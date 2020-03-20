<template>
  <div style="width:1000px;height:1123px;margin-left: 30px;margin-top: 30px;display:flex" class="wrapper">
    <template v-for="item in curCodes">
      <template v-for="i in item.num">
        <span :style="outerStyle">
          <span :style="spanStyle">
            <VueBarcode
              :style="{width: '100%', height:height - 60 + 'px' }"
              ref="bar"
              :value="item.code"
              :options="options"
              tag="svg"
            />
          </span>

          <div class="title">{{item.code}}</div>
          <div class="flex title">
            <span class="fix__row_1" style="flex: 1;">{{item.title.slice(0, 30)}}</span>
            <span>{{item.title.slice(item.title.length - 10)}}</span>
          </div>
        </span>
        <!-- <div style="page-break-after: always;"></div> -->
      </template>
    </template>
    <span :style="spanStyle" v-for="item in 4"></span>
  </div>
</template>
<script>
function unitConversion() {
  /**
   * 获取DPI
   * @returns {Array}
   */
  this.conversion_getDPI = function() {
    var arrDPI = new Array()
    if (window.screen.deviceXDPI) {
      arrDPI[0] = window.screen.deviceXDPI
      arrDPI[1] = window.screen.deviceYDPI
    } else {
      var tmpNode = document.createElement('DIV')
      tmpNode.style.cssText =
        'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
      document.body.appendChild(tmpNode)
      arrDPI[0] = parseInt(tmpNode.offsetWidth)
      arrDPI[1] = parseInt(tmpNode.offsetHeight)
      tmpNode.parentNode.removeChild(tmpNode)
    }
    return arrDPI
  }
  /**
   * px转换为mm
   * @param value
   * @returns {number}
   */
  this.pxConversionMm = function(value) {
    var inch = value / this.conversion_getDPI()[0]
    var c_value = inch * 25.4
    //      console.log(c_value);
    return c_value
  }
  /**
   * mm转换为px
   * @param value
   * @returns {number}
   */
  this.mmConversionPx = function(value) {
    var inch = value / 25.4
    var c_value = inch * this.conversion_getDPI()[0]
    //      console.log(c_value);
    return c_value
  }
}
export default {
  components: {
    VueBarcode: () => import('@chenfengyuan/vue-barcode')
  },
  data() {
    return {
      width: new unitConversion().mmConversionPx(
        this.$route.query.width || 63.5
      ),
      height: new unitConversion().mmConversionPx(
        this.$route.query.height || 38.1
      ),
      options: {
        displayValue: false,
        height: new unitConversion().mmConversionPx(
          this.$route.query.height || 38.1 - 10
        ),
        width: 3
      },
      codes: this.$route.query.codes
    }
  },
  computed: {
    outerStyle() {
      return {
        ...this.spanStyle,
        height: this.height + 'px',
        marginBottom: '35px',
        marginTop: '35px'
      }
    },
    spanStyle() {
      return {
        width: this.width + 'px',
        height: this.height - 60 + 'px',
        display: 'inline-block',
        textAlign: 'center',
        marginRight: '30px'
        // marginTop: '30px'
      }
    },
    curCodes() {
      return this.codes.split('$$').map(e => ({
        code: e.split('$')[0],
        num: +e.split('$')[1],
        title: e.split('$')[2]
      }))
    }
  },
  // mounted() {
  //   if (!window.top) {
  //     return
  //   }
  //   this.$nextTick(() => {
  //     window.top.__closeLoading()
  //   })
  // },
  updated() {
    this.$nextTick(() => {
      window.top.__closeLoading && window.top.__closeLoading()
    })
  }
}
</script>
<style lang="scss" scoped>
@page {
  margin-bottom: 0mm;
  margin-top: 10mm;
}
svg {
  width: 100%;
  height: 100%;
}
.title {
  line-height: 30px;
}
.wrapper {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  & > span:nth-child(2n + 1) {
    // FIXME:分页打不生效
    page-break-after: always;
  }
}
</style>
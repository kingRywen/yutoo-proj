<template>
  <div style="width:1000px;margin-left: 30px;margin-top: 30px;" class="wrapper">
    <div v-for="item in curCodes">
      <template v-for="i in item">
        <div :style="outerStyle">
          <div :style="spanStyle">
            <VueBarcode
              :style="{width: '100%', height:height - 60 + 'px' }"
              ref="bar"
              :value="i.code"
              :options="options"
              tag="svg"
            />
          </div>

          <div class="title">{{i.code}}</div>
          <div class="flex title">
            <span class="fix__row_1" style="flex: 1;">{{i.title.slice(0, 30)}}</span>
            <span>{{i.title.slice(i.title.length - 10)}}</span>
          </div>
        </div>
      </template>
      <div class="page-break"></div>
    </div>
    <!-- <div :style="spanStyle" v-for="item in 4"></div> -->
  </div>
</template>
<script>
import _chunk from 'lodash/chunk'
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
    let [colNum, rowNum] = this.$route.query.num.split('*').map(e => +e)
    return {
      width: new unitConversion().mmConversionPx(
        this.$route.query.width || 63.5
      ),
      height: new unitConversion().mmConversionPx(
        this.$route.query.height || 38.1
      ),
      colNum,
      rowNum,
      pageStyle: {
        width: '33.3%',
        height: new unitConversion().mmConversionPx(297) + 'px'
      },
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
        height: this.height + 20 + 'px',
        width: (100 / this.colNum) + '%',
        padding: '55px 35px 0 0',

        boxSizing: 'border-box'
      }
    },
    spanStyle() {
      return {
        width: this.width + 'px',
        height: this.height - 60 + 'px',
        display: 'inline-block',
        textAlign: 'center'
        // marginRight: '30px',
        // float: 'left'
        // marginTop: '30px'
      }
    },
    curCodes() {
      let ret = []
      this.codes.split('$$').map(e => {
        let code = e.split('$')[0],
          num = +e.split('$')[1],
          title = e.split('$')[2]
        for (let index = 0; index < num; index++) {
          ret.push({
            code,
            title
          })
        }
      })
      ret = _chunk(ret, this.rowNum * this.colNum)
      return ret
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
  size: A4;
  margin-bottom: 0mm;
  margin-top: 0mm;
}
svg {
  width: 100%;
  height: 100%;
}
.title {
  line-height: 30px;
}
.page-break {
  width: 100%;
  // border: 5px solid;
  page-break-before: always;
  // page-break-after: always;
}
.wrapper {
  display: block;
  & > div {
    page-break-before: always;
  }
}
</style>
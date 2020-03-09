<template>
  <div>
    <div class="top-bar nonprint">
      <div class="box">
        <div
          :class="[item.clsName, {active: index === i}]"
          v-for="(item, i) in selectBtns"
          :key="i"
          @click="toggleSelect(i)"
        >
          <i v-if="!item.noIcon" class="iconfont">&#xe744;</i>
          <span>{{item.name}}</span>
        </div>
        <div class="button-box">
          <el-button @click="print">确认打印</el-button>
        </div>
      </div>
    </div>

    <div class="print-area print-div" :class="[`print` + index, {double: index === 6}]">
      <template v-if="index !== 6">
        <div class="print-item" style="page-break-after:always" :class="'item' + index" v-for="item in codes">
          <!-- 前4个条码打印项 后两个打印 -->
          <el-row v-if="index < 4 || index > 6">
            <ElCol :span="12" class="left">
              <h1 v-if="index < 4" class="title1">{{item}}</h1>
              <h1 v-else class="title1">{{item.substr(0,2)}}</h1>
              <VueBarcode ref="bar" :value="item" :options="barOptions" tag="img"/>
              <h1 class="sub-title">{{item}}</h1>
            </ElCol>
            <el-col :span="12" class="right">
              <i v-if="index < 4" class="iconfont" :class="index % 2 !== 0 ? 'up': 'down'">&#xe611;</i>
              <i v-if="index > 6" class="iconfont" :class="index % 2 === 0 ? 'up': 'down'">&#xe611;</i>
              <h1 v-if="index < 4" class="text">{{item}}</h1>
              <h1 v-else class="text">{{item.substr(2,3)}}</h1>
            </el-col>
          </el-row>
          <!-- 第5、6个打印项 -->
          <el-row v-else-if="index < 6" class="wrapper">
            <ElCol :span="8" class="left">
              <VueBarcode ref="bar" :value="item" style="width:100%" :options="barOptions" tag="img"/>
              <h1 class="sub-title">{{item}}</h1>
            </ElCol>
            <ElCol :span="16" class="right" style="text-align:center">
              <i class="iconfont" style="font-size:100px" :class="index % 2 !== 0 ? '_left': '_right'">&#xe613;</i>
            </ElCol>
          </el-row>

          <div v-if="index < 4 || index > 6" class="page-break nonprint"></div>
        </div>
      </template>
      <el-row v-else>
        <!-- 双排打印项 -->
        <ElCol
          :span="12"
          class="print-item"
          style="page-break-after:always"
          :class="'item' + index"
          
          v-for="(item, i) in codes"
          :key="i"
        >
          <VueBarcode ref="bar" :value="item" :options="barOptions" tag="img"/>
          <h1 class="sub-title">{{item}}</h1>
        </ElCol>
      </el-row>
    </div>
  </div>
</template>

<script>
// import upImg from '@/assets/images/up.png'
export default {
  components: {
    VueBarcode: () => import('@chenfengyuan/vue-barcode')
  },
  props: ['id'],
  created() {
    if (this.id) {
      this.getData()
    }
  },
  data() {
    return {
      barOptions: { displayValue: false, height: 70, margin: 6 },
      barOptions1: { displayValue: false, width: 320, height: 70, margin: 6 },
      codes: [],
      index: 0,
      selectBtns: [
        {
          clsName: 'select',
          name: '10*6'
        },
        {
          clsName: 'select reverse',
          name: '10*6'
        },
        {
          clsName: 'select',
          name: '10*10'
        },
        {
          clsName: 'select reverse',
          name: '10*10'
        },
        {
          clsName: 'select reverse-90'
        },
        {
          clsName: 'select reverse90'
        },
        {
          clsName: 'select',
          name: '双排30*40',
          noIcon: true
        },
        {
          clsName: 'select',
          name: '多层'
        },
        {
          clsName: 'select reverse',
          name: '多层'
        }
      ]
    }
  },
  methods: {
    print() {
      window.print()
    },
    toggleSelect(index) {
      this.index = index
    },
    getData() {
      this.$api[`warehouse/wmLocationFindLocations`]({ids: this.id.split('_').map(el => +el)})
      .then(data => {
      this.codes = data.list.map(el => el.locationBarCode)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang='scss'>
body {
  background: #fff;
}
.top-bar {
  width: 100%;
  height: 50px;
  background: #f2f2f2;
  border-bottom: 1px solid #fff;
  box-shadow: 0 1px 0 0px #dcdfe6;

  .box {
    max-width: 800px;
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    color: #999;
    .select {
      font-size: 14px;
      display: flex;
      justify-content: center;
      width: 80px;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
      position: relative;
      margin: 0 4px;
      &.reverse .iconfont {
        transform: rotateX(180deg);
      }
      &.reverse90 .iconfont {
        transform: rotateY(180deg) rotateX(180deg) rotate(90deg);
      }
      &.reverse-90 .iconfont {
        transform: rotateX(180deg) rotate(90deg);
      }
      &.active:after,
      &:hover:after {
        width: 100%;
        content: '';
        display: block;
        padding: 6px;
        margin-top: 7px;
        box-sizing: border-box;
        position: absolute;
        top: 0;
        left: 0;
        height: 36px;
        background: #ddd;
        box-shadow: 0 2px 0 #ffffff, inset 0 4px 11px #bebebe;
        border-radius: 18px;
        z-index: 1;
      }

      span {
        margin-left: 6px;
        z-index: 22;
      }
      .iconfont {
        font-size: 24px;
        z-index: 22;
      }
    }
  }
  .button-box {
    position: absolute;
    top: 6px;
    right: 10px;
  }
}

.print-area {
  width: 340px;
  margin: 0 auto;

  &.double {
    width: 560px;
  }
  h1 {
    margin: 0;
  }
  .wrapper {
    border: 1px solid #000;
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    align-items: center;
  }
  .print-item {
    display: block;

    &.item0,
    &.item1,
    &.item2,
    &.item3,
    &.item7,
    &.item8 {
      .title1 {
        font-size: 56px;
      }
      .sub-title {
        font-size: 16px;
        font-weight: normal;
      }
    }
    h1 {
      color: #000;
    }
    .left {
      text-align: center;
    }
    .right {
      .text {
        font-size: 96px;
        font-family: monospace;
        float: right;
        &:after {
          clear: both;
        }
      }
      .down {
        transform: rotateX(180deg);
      }
      ._right {
        transform: rotateY(180deg);
      }
      .iconfont {
        float: right;
        font-size: 72px;
        color: #000;
        &:after {
          clear: both;
        }
      }
    }
    .page-break {
      border-top: 1pt dotted #000;
      width: 100%;
      height: 1px;
    }
  }
  &.print2,
  &.print3 {
    .print-item {
      .left {
        margin-top: 100px;
      }
    }
  }
}

@page {
  margin: 8mm 2mm 0 2mm;
  // size: 10cm 7cm;
}

@media print {
  h1 {
    color: #000;
    background: none;
  }
  nav,
  aside {
    display: none;
  }

  body,
  article {
    width: 100%;
    margin: 0;
    padding: 0;
  }
  .page-break {
    page-break-after: always;
  }
  .nonprint {
    display: none;
  }
  .print-area {
    .wrapper {
      border-color: transparent !important;
    }
  }
}
</style>
<style lang="scss">


@media print {
  body,
  #app,
  .appMain {
    height: auto !important;
    position: relative;
    overflow-y: hidden;
  }
}
</style>
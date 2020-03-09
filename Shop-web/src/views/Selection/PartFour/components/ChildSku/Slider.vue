<template>
  <div v-loading="loading">
    <div v-if="!noData" class="main-img">
      <div class="left">
        <div class="text-box">图片</div>
        <div class="text-box">ASIN</div>
        <div class="text-box">颜色</div>
        <div class="text-box">价格</div>
        <div class="text-box">buy box所有者</div>
        <div class="text-box">评分</div>
        <div class="text-box">评价数</div>
        <div class="text-box">跟卖卖家数</div>
      </div>
      <div id="slider" class="slider-wrapper" @mouseenter="showArrow = true" @mouseleave="showArrow = false">
        <div class="slider-container" v-show="showSlider" :style="{width: sliderContainerWidth}" id="slider-container">
          <ul class="slider" v-for="(list, index) in data" :style="getStyle(index)">
            <li
              @click="handleClickItem(item, index, i)"
              :class="['slider-item', {focus: (focusIndex[0] === index && focusIndex[1] === i)}]"
              v-for="(item, i) in list"
              :key="i"
            >
              <div class="__img_wrapper img-wrapper">
                <img v-lazy="item.imageUrl" alt="asin" class="img normal">
              </div>
              <span class="text">
                <b>{{item.asin || '-'}}</b>
              </span>
              <span class="text">{{item.color || item.Color || item.color_name || item.Color_name || '-'}}</span>
              <span class="text">{{item.price != null && item.price !== '' ? item.price : '-'}}</span>
              <span class="text">{{item.buybox != null && item.buybox !== '' ? item.buybox : '-'}}</span>
              <span class="text">{{item.starCnt != null && item.starCnt !== '' ? item.starCnt : '-'}}</span>
              <span class="text">{{item.reviewCnt != null && item.reviewCnt !== '' ? item.reviewCnt : '-'}}</span>
              <span class="text">
                <ElButton type="text" @click.stop="handleClick(item)">
                  <b>{{item.sellerCnt != null && item.sellerCnt !== '' ? item.sellerCnt : '-'}}</b>
                </ElButton>
                <!-- <a class="url" :href="item.productUrl" target="_blank"><b>{{item.sellerCnt}}</b></a> -->
              </span>
            </li>
          </ul>
        </div>
        <template v-if="data.length > 1">
          <transition name="carousel-arrow-right">
            <button v-show="showArrow" @click="next" type="button" class="el-carousel__arrow el-carousel__arrow--right">
              <i class="el-icon-arrow-right"></i>
            </button>
          </transition>
          <transition name="carousel-arrow-left">
            <button v-show="showArrow" @click="prev" type="button" class="el-carousel__arrow el-carousel__arrow--left">
              <i class="el-icon-arrow-left"></i>
            </button>
          </transition>
        </template>
      </div>
    </div>
    <none-page noBack v-else></none-page>
    <ElDialog width="1200px" :title="`查看跟卖-${title}`" :visible.sync="visible" @close="activeName = 'first'">
      <ElTabs v-model="activeName" type="card" style='margin-top:-20px;margin-bottom:-24px;'>
        <ElTabPane name="first" label="跟卖列表" lazy>
          <YtTableSelect url="bigProductSellingList" :params="params" :options="options" :data="firstData" :IsSelection='false'></YtTableSelect>
        </ElTabPane>
        <ElTabPane lazy name="second" label="跟卖卖家列表">
          <YtTableSelect url="bigProductSellingSellerList" :params="params" :options="secondOptions" :data="secondData" :IsSelection='false'></YtTableSelect>
        </ElTabPane>
      </ElTabs>
    </ElDialog>
    <ElDialog width="1200px" :title="`查看跟卖-${sellerName}`" :visible.sync="visible1">
      <YtTableSelect
        v-if="visible1"
        style='margin-top:-40px;margin-bottom:-24px;'
        url="bigProductSellingList"
        :params="params1"
        :IsSelection='false'
        :options="sellerOptions"
        :searchData='formInline'
        :data="sellerData11"
        :isShowOperation='false'
        ref='table'
      >
        <div slot='search'>
           <el-form :label-position="'center'" :model="formInline" ref='formInline' :inline="true" >
              <el-form-item label="ASIN" prop='asin' > 
                  <el-input v-model="formInline.asin"  placeholder="请输入ASIN" type='input' size='small'></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">搜索</el-button>
                          <el-button size="small" type="primary" plain @click="resetSearch" :loading="tableLoading">重置搜索</el-button>
                  </el-form-item>
              </el-form>
        </div>
      </YtTableSelect>
    </ElDialog>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    let vm = this
    return {
      tableLoading:false,
      formInline:{
        asin:""
      },
      loading: false,
      focusIndex: [0, 0],
      showSlider: true,
      sliderContainerWidth: '100%',
      showArrow: false,
      noData: false,
      index: 0,
      width: '',
      title: '',
      visible: false,
      visible1: false,
      activeName: 'first',
      sellerName: '',
      sellerId22: '',
      firstData: [],
      options: {
        search: {
          list: []
        },
        table: {
          columns: [
            {
              label: '跟卖时间',
              value: 'soldTime'
            },
            {
              label: '卖家',
              value: 'sellerName',
              url: 'sellerUrl'
            },
            {
              label: '属性',
              value: 'skuAttrList',
              render(h, scope) {
                const { skuAttrList = [] } = scope.row
                return (
                   <el-tooltip class="item" effect="light" content="Top Left 提示文字" placement="top-start">
                    <div slot="content">
                      <span>
                        {skuAttrList.map(el => (
                          <span>
                            {el.attrName}:{el.attrValue} ;{' '}
                          </span>
                        ))}
                      </span>
                    </div>
                    <span style='text-overflow: ellipsis;
                          display:inline-block;
                          width:170px;
                          white-space: nowrap;
                          overflow: hidden'>
                      {skuAttrList.map(el => (
                        <span>
                          {el.attrName}:{el.attrValue} ;{' '}
                        </span>
                      ))}
                    </span>
                  </el-tooltip>
                )
              }
            },
            {
              label: '发货方式',
              value: 'fbpFlag',
              enum: {
                0: '自发货',
                1: 'FBA',
                2: '自发货+FBA'
              }
            },
            {
              label: '价格',
              value: 'price'
            }
          ],
          maxHeight: 500,
          border: true,
          // 选择函数，返回true则设置当前项选中
          // selectableFunc: (row, index) => {
          //   return true
          // },
          reserveSelection: null
        }
      },
      secondData: [],
      secondOptions: {
        search: {
          list: []
        },
        table: {
          columns: [
            {
              label: '卖家',
              value: 'sellerName',
              url: 'sellerUrl'
            },
            {
              label: '跟卖子sku数量',
              value: 'sellingAmount',
              render(h, scope) {
                return (
                  <el-button
                    type="text"
                    on-click={() => {
                      vm.sellerName = scope.row.sellerName
                      vm.sellerId22 = scope.row.sellerId
                      vm.visible1 = true 
                      vm.formInline.asin = '' 

                    }}
                  >
                    {scope.row.sellingAmount}
                  </el-button>
                )
              }
            },
            {
              label: '发货方式',
              value: 'fbpFlag',
              enum: {
                0: '自发货',
                1: 'FBA',
                2: '自发货+FBA'
              }
            },
            {
              label: '价格',
              value: 'price'
            }
          ],
          maxHeight: 500,
          border: true,
          // 选择函数，返回true则设置当前项选中
          // selectableFunc: (row, index) => {
          //   return true
          // },
          reserveSelection: null
        }
      },
      sellerData11: [],
      sellerOptions: {
        search: {
          list: [
            {
              noLabel: true,
              name: 'asin',
              placeholder: '输入ASIN'
            }
          ]
        },
        table: {
          columns: [
            {
              label: '跟卖时间',
              value: 'soldTime'
            },
            {
              label: '子ASIN',
              value: 'asin'
            },
            {
              label: '属性',
              value: 'skuAttrList',
              render(h, scope) {
                const { skuAttrList } = scope.row
                return skuAttrList ? (
                    <el-tooltip placement="top" effect="light" >
                      <span slot="content"> {skuAttrList.map(el => (
                          <span >
                            {el.attrName}:{el.attrValue} ;{' '}
                          </span>
                        ))}</span>
                      <span class="fix__row_1">
                        {skuAttrList.map(el => (
                          <span >
                            {el.attrName}:{el.attrValue} ;{' '}
                          </span>
                        ))}
                      </span>
                  </el-tooltip> 
                ):('-')
              }
            },
            {
              label: '发货方式',
              value: 'fbpFlag',
              enum: {
                0: '自发货',
                1: 'FBA'
              }
            },
            {
              label: '价格',
              value: 'price'
            }
          ],
          maxHeight: 500,
          border: true,
          // 选择函数，返回true则设置当前项选中
          // selectableFunc: (row, index) => {
          //   return true
          // },
          reserveSelection: null
        }
      }
      // data: []
    }
  },
  mounted() {
    // this.initSlider()
    this.bindResize()
    // this.getSKuData()
  },
  computed: {
    params() {
      return {
        taskId: +this.$route.query.taskId,
        asin: this.title
      }
    },
    params1() {
      return {
        taskId: +this.$route.query.taskId,
        sellerId: this.sellerId22
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.$nextTick(() => {
            this.initSlider()
          })
        }
      }
    }
  },
  methods: {
    handleSearch(){
        this.$refs.table.handleSearch()
    },
    resetSearch(){
        this.formInline.asin= ''
        this.$refs.table.handleSearch()
    },
    handleClickItem(item, index, i) {
      // console.log(index, i);
      if (this.focusIndex[0] === index && this.focusIndex[1] === i) {
        this.focusIndex.splice(0)
        this.$emit('clickSku', {})
      } else {
        this.focusIndex = [index, i]
        this.$emit('clickSku', item)
      }
    },
    getStyle(index) {
      return { width: this.width + 'px' }
    },
    handleClick({ asin }) {
      this.title = asin
      this.visible = true
    },

    initSlider() {
      this.setStyle()
    },
    setStyle() {
      let sliderContainer = document.getElementById('slider')
      let width = sliderContainer.offsetWidth - 40
      this.width = width
      this.sliderContainerWidth = width * this.data.length + 'px'
      this.setTransform(width)
    },
    bindResize() {
      window.onresize = this.handlerResize
    },
    handlerResize() {
      this.initSlider()
    },
    next() {
      if (this.index >= this.data.length - 1) {
        this.index = 0
      } else {
        this.index++
      }
      // let sliderContainer = document.getElementById('slider-container')
      let width = this.width
      // sliderContainer.style.transform = `translateX(-${width * this.index}px)`
      this.setTransform(width)
    },
    setTransform(width) {
      let sliderContainer = document.getElementById('slider-container')
      sliderContainer.style.transform = sliderContainer.style[
        '-ms-transform'
      ] = sliderContainer.style['-moz-transform'] = sliderContainer.style[
        '-webkit-transform'
      ] = sliderContainer.style['-o-transform'] = `translateX(-${width *
        this.index}px)`

      //       transform:rotate(7deg);
      // -ms-transform:rotate(7deg); 	/* IE 9 */
      // -moz-transform:rotate(7deg); 	/* Firefox */
      // -webkit-transform:rotate(7deg); /* Safari 和 Chrome */
      // -o-transform:rotate(7deg);
    },

    prev() {
      if (this.index <= 0) {
        this.index = this.data.length - 1
      } else {
        this.index--
      }
      // let sliderContainer = document.getElementById('slider-container')
      let width = this.width
      this.setTransform(width)
      // sliderContainer.style.transform = sliderContainer.style[
      //   '-ms-transform'
      // ] = sliderContainer.style['-moz-transform'] = sliderContainer.style[
      //   '-webkit-transform'
      // ] = sliderContainer.style['-o-transform'] = `translateX(-${width *
      //   this.index}px)`
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>

<style lang='scss' scoped>
.main-img {
  display: flex;
  // font-size: 14px;
  .left {
    flex: 0 0 130px;
    background: #f5f7fa;
    border: 1px solid #dcdfe6;
    border-width: 1px 0 0 1px;
    display: flex;
    flex-direction: column;
    .text-box {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 10px;
      border: 1px solid #dcdfe6;
      border-width: 0 1px 1px 0;
      &:first-child {
        height: 200px;
        flex: 0 0 200px;
      }
      &:last-child {
        flex: auto;
      }
    }
  }
  .slider-wrapper {
    border: 1px solid #dcdfe6;
    border-width: 1px 1px 1px 0;
    flex: 1;
    padding: 0 20px;
    background: #f8f8f8;
    overflow: hidden;
    position: relative;
    height: 465px;
    // height: 100%;
    .slider-container {
      // overflow: hidden;
      height: 100%;
      position: relative;
      transition: all 0.4s ease-in-out;
      .slider {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        height: 100%;
        overflow-x: hidden;
        width: auto;
        background: #f8f8f8;
        float: left;
        // position: absolute;
        .slider-item {
          cursor: pointer;
          // height: 100%;
          // min-width: 200px;
          background: #fff;
          box-sizing: border-box;
          border: 2px solid transparent;
          margin: 0 6px;
          // flex: 1;
          width: 16.6%;
          &.focus {
            border-color: #30cc7b;
          }
          .img-wrapper {
            width: 100%;
            height: 200px;
            padding: 10px;
          }
          .text {
            // display: flex;
            flex-direction: column;
            font-size: 14px;
            text-align: center;
            line-height: 37px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            display: inherit;
          }
        }
      }
    }
  }
}
</style>

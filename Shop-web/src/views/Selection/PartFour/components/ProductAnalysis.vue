<template>
  <div class="partfour-detail">
    <!-- 产品分析 -->
    <!-- 基础信息 start -->
    <el-card v-loading="loading[0]" class="custom-box-card" shadow="hover">
      <div slot="header" class="clearfix">
        <span>基础信息</span>
      </div>
      <ElRow :gutter="20" type="flex">
        <ElCol :span="6">
          <div class="wrapper">
            <div class="__img_wrapper">
              <img class="normal" v-if="baseInfo.imageUrl" v-lazy="baseInfo.imageUrl">
            </div>
          </div>
        </ElCol>
        <ElCol :span="18">
          <table class="custom-table">
            <tr>
              <td class="table-header">标题</td>
              <td colspan="3">
                <a class="url" target="_blank" :href="baseInfo.productUrl">
                  <b>{{baseInfo.title | _formatData}}</b>
                </a>
              </td>
            </tr>
            <tr>
              <td class="table-header">ASIN</td>
              <td colspan="3">
                <b>{{baseInfo.parentAsin | _formatData}}</b>
              </td>
            </tr>
            <tr>
              <td class="table-header">价格</td>
              <td>{{baseInfo.price | _formatData}}</td>
              <td class="table-header">品牌</td>
              <td>{{baseInfo.brand | _formatData}}</td>
            </tr>
            <tr>
              <td class="table-header">总评论数</td>
              <td>{{baseInfo.reviewCnt | _formatData}}</td>
              <td class="table-header">上架时间</td>
              <td>{{baseInfo.releaseDate | _formatData}}</td>
            </tr>
            <tr>
              <td class="table-header">评分</td>
              <td>{{baseInfo.starCnt | _formatData}}</td>
              <td class="table-header">发货方式</td>
              <td>{{baseInfo.fbpFlag | _fbpFlagAmazon}}</td>
            </tr>
            <tr>
              <td class="table-header">AQ数</td>
              <td>{{baseInfo.aqCnt | _formatData}}</td>
              <td class="table-header">子SKU数量</td>
              <td>{{baseInfo.skuCnt | _formatData}}</td>
            </tr>
          </table>
        </ElCol>
      </ElRow>
    </el-card>
    <!-- 基础信息 end -->

    <!-- 统计分析 start -->
    <ElCollapse class="custom-collapse header14 mt20" value="first">
      <ElCollapseItem name="first" title="统计分析">
        <ElRow :gutter="12">
          <ElCol :span="6">
            <DataTable v-loading="loading[1]" title="标题分析" :data="titleData"/>
            <DataTable v-loading="loading[5]" title="AQ分析" :data="AqRtInfo"/>
            <DataTable v-loading="loading[8]" title="图片数" :data="ImageRtInfo"/>
          </ElCol>
          <ElCol :span="6">
            <DataTable v-loading="loading[2]" title="变体数分析" :data="attrData"/>
            <DataTable v-loading="loading[7]" title="卖点分析" :data="FeatureRtInfo"/>
          </ElCol>
          <ElCol :span="6">
            <DataTable v-loading="loading[3]" title="第一条评价" :data="firstReview"/>
            <DataTable v-loading="loading[6]" title="关联流量外流程度" :data="RelateRtInfo"/>
          </ElCol>
          <ElCol :span="6">
            <DataTable v-loading="loading[4]" title="第一个月新增评价" :data="reviewRtInfo"/>
            <DataTable title="价格分析" :data="priceData"/>
          </ElCol>
        </ElRow>
      </ElCollapseItem>
    </ElCollapse>
    <!-- 统计分析 end -->

    <!-- 新增评价数分析 start -->
    <NewEvaluationAnalysis />
    <!-- 新增评价数分析 end -->
    <!-- BSR变化 start -->
    <BSRChange :parent='true' />
    <!-- BSR变化 end -->
    <!-- 新增AQ数 start -->
    <AddedAq />
    <!-- 新增AQ数 end -->
    <!-- FIT率 start -->
    <FitRate />
    <!-- FIT率 end -->
    <!-- 产品历史变化动态记录 start -->
    <ProductHistory />
    <!-- 产品历史变化动态记录 end -->
  </div>
</template>

<script>
import NewEvaluationAnalysis from '../charts/NewEvaluationAnalysis'
import BSRChange from '../charts/BSRChange'
import AddedAq from '../charts/AddedAq'
import FitRate from '../charts/FitRate'
import ProductHistory from '../charts/ProductHistory'
// import svg from '@/assets/font/loading.svg';
export default {
  components: {
    NewEvaluationAnalysis,
    ProductHistory,
    AddedAq,
    FitRate,
    BSRChange
  },
  data() {
    return {
      // 基础信息
      baseInfo: {
        imageUrl: ''
      },
      // 标题分析
      bigProductTitleRtInfo: {},
      // 变体属性分析
      bigProductAttrRtInfo: [],
      // 第一条评价
      bigProductFirstReview: [{}],
      // 第一个月新增评价
      bigProductReviewRtInfo: {},
      // AQ数分析
      bigProductAqRtInfo: {},

      // 关联流量外放程度
      bigProductRelateRtInfo: [],
      // 卖点分析
      bigProductFeatureRtInfo: [],
      // 图片数分析
      bigProductImageRtInfo: {},

      loading: [false, false]
    }
  },
  created() {
    this.init()
  },
  computed: {
    titleData() {
      let arr = [],
        obj = this.bigProductTitleRtInfo
      Object.keys(obj).forEach(key => {
        switch (key) {
          case 'titleIncludeBrandFlag':
            arr.push({
              label: '品牌是否在标题中',
              value: obj[key] ? '是' : '否'
            })
            break
          case 'titleLength':
            arr.push({
              label: '字符长度',
              value: obj[key]
            })
            break
          case 'titleRepeatFlag':
            arr.push({
              label: '有无重复单词',
              value: obj[key] ? obj['titleRepeatWord'] : '无'
            })
            break

          default:
            break
        }
      })
      return arr
    },
    attrData() {
      let arr = [],
        obj = this.bigProductAttrRtInfo,
        total = 1
      obj.forEach(el => {
        arr.push({
          label: el.attrKey,
          value: el.skuCnt + '个'
        })
        total *= (el.skuCnt || 1)
      })

      arr.push({
        label: '合计',
        value: total + '个'
      })
      return arr
    },
    firstReview() {
      let arr = [],
        obj = this.bigProductFirstReview,
        titles = ['在上架时间', '评价类型', '评分', '评价长度']
      titles.forEach(element => {
        let label = element,
          value,
          data
        switch (label) {
          // eslint-disable-next-line no-case-declarations
          case '在上架时间':
            data = obj.reviewDateCompare
            const _data = data == null ? '-' : Math.abs(data)
            if (data == null) {
              value = '-'
            }
            value = data == 0 ? '同一天' : data > 0 ? `后${_data}天` : `前${_data}天`
            break
          case '评价类型':
            data = obj.reviewType
            if (data == null) {
              value = '-'
            }
            value = data ? '直评' : 'VP评'
            break
          case '评分':
            data = obj.evaluateStar
            if (data == null) {
              value = '-'
            }
            value = data + '星'
            break
          case '评价长度':
            let contentType = obj.contentType
            value = `${obj.wordCnt}单词数, ${
              contentType === 0
                ? '带图片'
                : contentType === 1
                ? '带视频'
                : '仅文字'
            }`
            break

          default:
            break
        }
        arr.push({ label, value })
      })
      return arr
    },
    // 第一个月新增评价
    reviewRtInfo() {
      let arr = [],
        obj = this.bigProductReviewRtInfo,
        titles = ['合计评分', '新增评价数量', '类型统计']
      titles.forEach(label => {
        let value
        switch (label) {
          case '合计评分':
            value = obj.starCnt
            break
          case '新增评价数量':
            value = obj.newReviewCnt
            break
          case '类型统计':
            value = `直评${obj.directCnt}个、VP评${obj.vpCnt}个、带图片${
              obj.reviewImageCnt
            }个、带视频${obj.reviewVideoCnt}个、仅文字评价${
              obj.reviewTextCnt
            }个`
            break

          default:
            break
        }
        arr.push({ label, value })
      })
      return arr
    },
    // AQ分析
    AqRtInfo() {
      let arr = [],
        obj = this.bigProductAqRtInfo,
        titles = ['第一条AQ', '第一个月AQ']
      titles.forEach(label => {
        let value
        if (label === '第一条AQ') {
          const _data = Math.abs(obj.firstAqDateCompare)
          let day = !obj.firstAqDateCompare ? null :
            obj.firstAqDateCompare > 0
              ? `后${_data}天`
              : `前${_data}天`
          value = !day ? '-' : `在上架时间${day}，单词数${obj.firstAqWordCnt}个`
        } else {
          value = obj.firstMonthAqCnt
        }
        arr.push({ label, value })
      })
      return arr
    },
    priceData() {
      let arr = [],
        obj = this.baseInfo
      arr.push({ label: '价格区间', value: obj.price })
      arr.push({ label: '具体金额', value: obj.priceList })
      return arr
    },
    RelateRtInfo() {
      let arr = [],
        obj = this.bigProductRelateRtInfo
      obj.forEach(el => {
        arr.push({
          label: el.position,
          value: `${el.brandProductCnt == null ? '-' : el.brandProductCnt} / ${
            el.productCnt == null ? '-' : el.productCnt
          }`
        })
      })
      return arr
    },
    FeatureRtInfo() {
      let arr = [],
        obj = this.bigProductFeatureRtInfo
      obj.forEach(el => {
        arr.push({
          label: `第${el.featureRow}行`,
          value: `单词数${
            el.featureWordCnt == null ? '-' : el.featureWordCnt
          } / 字符数${el.featureLength == null ? '-' : el.featureLength}`
        })
      })
      arr.push({
        label: '合计',
        value: obj.length + '行'
      })
      return arr
    },
    ImageRtInfo() {
      let arr = [],
        obj = this.bigProductImageRtInfo,
        titles = ['图片数量', '具体图片数']
      titles.forEach(label => {
        let value
        if (label !== '具体图片数') {
          value = obj.imageCntRange
        } else {
          value = obj.imageCnts
        }
        arr.push({ label, value })
      })
      return arr
    }
  },
  methods: {
    init() {
      this.getBaseInfo()
      this.getBigProductTitleRtInfo()
      this.getBigProductAttrRtInfo()
      this.getBigProductFirstReview()
      this.getBigProductReviewRtInfo()
      this.getBigProductAqRtInfo()
      this.getBigProductRelateRtInfo()
      this.getBigProductFeatureRtInfo()
      this.getBigProductImageRtInfo()
    },
    getInfo(api, index, init) {
      this.fetch(
        api,
        null,
        data => {
          this[api] = data.data || init
        },
        index
      )
    },
    getBaseInfo() {
      this.fetch(
        `bigProductInfo`,
        null,
        data => {
          this.baseInfo = data.data
        },
        0
      )
    },

    // 标题分析
    getBigProductTitleRtInfo() {
      this.getInfo('bigProductTitleRtInfo', 1, {})
    },
    getBigProductAttrRtInfo() {
      this.getInfo('bigProductAttrRtInfo', 2, [])
    },
    getBigProductFirstReview() {
      this.getInfo('bigProductFirstReview', 3, [{}])
    },
    getBigProductReviewRtInfo() {
      this.getInfo('bigProductReviewRtInfo', 4, {})
    },
    getBigProductAqRtInfo() {
      this.getInfo('bigProductAqRtInfo', 5, {})
    },
    getBigProductRelateRtInfo() {
      this.getInfo('bigProductRelateRtInfo', 6, [])
    },
    getBigProductFeatureRtInfo() {
      this.getInfo('bigProductFeatureRtInfo', 7, [])
    },
    // 图片数分析
    getBigProductImageRtInfo() {
      this.getInfo('bigProductImageRtInfo', 8, {})
    },

    fetch(url, params, cb, index) {
      params = Object.assign(params || {}, { taskId: this.$route.query.taskId })
      this.loading.splice(index, 1, true)
      return this.$api[url](params)
        .then(data => {
          this.loading.splice(index, 1, false)
          cb(data)
        })
        .catch(() => {
          this.loading.splice(index, 1, false)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  width: 100%;
  height: 100%;
  .__img_wrapper {
    // border: 1px solid red;
    margin: 0 auto;
    width: 100%;
    height: 100%;
    max-height: 230px;
    max-width: 230px;
    transition: all 0.5s ease-in-out;
  }
}
</style>
<style lang="scss">
.partfour-detail {
  .el-input--mini .el-input__inner {
    height: 28px !important;
  }
  .btns {
    display: flex;
    align-items: center;
    margin: 16px;
    .label {
      font-size: 12px;
      margin-right: 10px;
    }
  }
}
</style>
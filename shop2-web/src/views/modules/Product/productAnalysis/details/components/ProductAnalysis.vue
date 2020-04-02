<template>
  <div class="partfour-detail">
    <!-- 产品分析 -->
    <!-- 基础信息 start -->
    <el-card v-loading="loading[0]" class="custom-box-card" shadow="hover">
      <div slot="header" class="clearfix flex just-sb">
        <span>基础信息</span>
        <el-dropdown
          v-if="exp"
          @command="handleCommand"
          type="primary"
          szie="mini"
          @click="exp[0].fn"
          class="downexl-btn"
          v-setplain
          split-button
          slot="download"
        >
          <span class="el-dropdown-link">{{exp[0].name ||'导出 EXCEL'}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in exp.slice(1)" :key="index" :command="item">{{item.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button style="float: right; padding: 3px 0" icon="el-icon-download" @click="down" type="text">下载</el-button> -->
      </div>
      <ElRow :gutter="20" type="flex">
        <ElCol :span="6">
          <div class="wrapper">
            <div class="__img_wrapper">
              <img class="normal loadingImg" v-lazy="baseInfo.imageUrl" />
            </div>
          </div>
        </ElCol>
        <ElCol :span="18">
          <table class="custom-table">
            <tr>
              <td class="table-header">标题</td>
              <td colspan="3">
                <a class="url" target="_blank" :href="storeUrls.asinUrl + baseInfo.parentAsin">
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
              <td class="table-header">变体数</td>
              <td>{{baseInfo.skuCnt | _formatData}}</td>
            </tr>
          </table>
        </ElCol>
      </ElRow>
    </el-card>
    <!-- 基础信息 end -->

    <!-- 新增评价数分析 start -->
    <NewEvaluationAnalysis :asin="baseInfo.parentAsin" />
    <!-- 新增评价数分析 end -->
    <!-- 新增QA数 start -->
    <AddedAq :asin="baseInfo.parentAsin" />
    <!-- 新增QA数 end -->
  </div>
</template>

<script>
import NewEvaluationAnalysis from './charts/NewEvaluationAnalysis'
import AddedAq from './charts/AddedAq'
import { exportEXCEL } from 'Utils/xlsx'
import { _fbpFlagAmazon } from '@/mixins'

export default {
  components: {
    NewEvaluationAnalysis,
    AddedAq
  },
  data() {
    return {
      exp: [
        {
          name: '导出 EXCEL',
          fn: () => this.downloadExcel()
        },
        {
          name: '导出 CSV',
          fn: () => this.downloadExcel(true)
        }
      ],
      // 基础信息
      baseInfo: {
        imageUrl: ''
      },
      loading: [false, false]
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getBaseInfo()
    },

    downloadExcel(csv) {
      let {
        title,
        productUrl,
        imageUrl,
        parentAsin,
        price,
        brand,
        reviewCnt,
        releaseDate,
        starCnt,
        fbpFlag,
        aqCnt,
        skuCnt
      } = this.baseInfo

      exportEXCEL(
        [
          [
            '标题',
            '产品链接',
            '图片地址',
            'ASIN',
            '价格',
            '品牌',
            '总评论数',
            '上架时间',
            '评分',
            '发货方式',
            'AQ数',
            '变体数'
          ],
          [
            title,
            productUrl,
            imageUrl,
            parentAsin,
            price,
            brand,
            reviewCnt,
            releaseDate,
            starCnt,
            _fbpFlagAmazon(fbpFlag),
            aqCnt,
            skuCnt
          ]
        ],
        null,
        parentAsin + '-基础信息',
        csv
      )
    },

    handleCommand(item) {
      item.fn()
    },

    getBaseInfo() {
      this.fetch(
        `productAnalysis/paProductInfo`,
        null,
        data => {
          this.baseInfo = data.data
        },
        0
      )
    },

    fetch(url, params, cb, index) {
      params = Object.assign(params || {}, this.storeInfo, {
        taskId: +this.$route.query.taskId
      })
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
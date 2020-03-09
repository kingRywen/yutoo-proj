<template>
  <div class="__edit--wrapper">
    <WidgetCardWrapper class="second" title="第一步：选择店铺和类目">
      <el-form :model="data" label-width="0">
        <template v-if="type !== 3">
          <el-form-item>
            <ElSelect style="width:100%" v-model="data.platId" placeholder="请选择平台" @change="handlePlatChange">
              <ElOption v-for="item in platList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </ElSelect>
          </el-form-item>
          <el-form-item>
            <ElSelect style="width:100%" v-if="data.platId" v-model="data.platSiteId" placeholder="请选择站点">
              <ElOption v-for="item in siteList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </ElSelect>
          </el-form-item>
          <el-form-item>
            <ElSelect style="width:100%" v-model="data.languageId" placeholder="请选择语言">
              <ElOption v-for="item in langList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </ElSelect>
          </el-form-item>
        </template>
        <el-form-item v-else>
          <ElSelect style="width:100%" v-model="data.storeId" placeholder="请选择店铺">
            <ElOption v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </el-form-item>
      </el-form>
      <category-select
        ref="cate"
        :show-header="false"
        :showActionable="false"
        :showMoreCategories="false"
        :csLoading="loading"
        :categoryList="categoryList"
        :searchList="searchList"
        @clear="handleClear"
        @handleSearch="handleSearch"
        @getCategoryChild="getCategoryList"
        @handleNextPage="handleNextPage"
        :collectList="collectList"
        @handleCollect="handleCollect"
      />
    </WidgetCardWrapper>

    <WidgetCardWrapper class="second" title="第二步：选择模板的类型">
      <el-radio-group v-model="mode" size="small">
        <el-radio-button label="精简"></el-radio-button>
        <el-radio-button label="高级"></el-radio-button>
        <el-radio-button label="自定义"></el-radio-button>
      </el-radio-group>
      <p v-show="mode === '精简'">精简”选项包含与以上所选类目关联的“必填”属性。“必填”属性是在仓库产品中创建产品时至少要提供的值（例如“产品sku”）</p>
      <p v-show="mode === '高级'">“高级”选项包含与以上所选类目关联的所有属性。该选项包含“必填”和“可选”属性组。</p>
      <div v-show="mode === '自定义'" class="mt10 mb10">
        <CustomExport saveName="batch" />
      </div>
      <el-button type="primary" :disabled="data.catePlatId == null" size="small" @click="downloadFile">确认下载模板</el-button>
      <span v-if="data.catePlatId == null" class="ml10">
        <span class="danger">*</span> 请先选择类目
      </span>
    </WidgetCardWrapper>

    <WidgetCardWrapper :isCollapse="true" class="third" title="历史生成模板记录">
      <p>要下载过去生成的模板，请点击以下任意链接下载</p>
      <ul class="list">
        <li class="list-item" v-for="(item, index) in tempList" :key="index">
          <span>
            <a :href="item.savePath" target="_blank">{{item.reportName}}</a>
            ({{item.templateType == 1 ? '精简' : item.templateType == 2 ? '高级' : '自定义'}})
          </span>
          <span>生成日期：{{item.createTime}}</span>
        </li>
      </ul>
    </WidgetCardWrapper>
  </div>
</template>
<script>
import { commonMxd, commonCptd } from 'Store/helper/common'
import CustomExport from 'Views/modules/product/amazon/platProduct/index/dialogs/customExport'
import CategorySelect from '@/components/categorySelect/'
import { downloadFile2, formatDate } from 'Utils/tools'
export default {
  components: {
    CustomExport,
    CategorySelect
  },
  props: ['type'],
  data() {
    return {
      activeName: 'first',
      data: {
        catePlatId: null,
        platSiteId: null
      },
      searchTxt: '',
      mode: '精简',
      hideMore: true,
      // 已下载的历史模板列表
      tempList: [],
      // category
      categoryList: [], // 下面的所有列表
      searchList: [], // 搜索的列表
      loading: false,
      collectList: [] // 搜藏列表
    }
  },
  created() {
    this.getHistory()
    this.getCategoryList()
    if (this.type === 2) {
      this.getPlatList()
      this.getLangList()
    } else if (this.type === 3) {
      this.getShopList()
    } else {
      this.getPlatList()
    }
  },
  computed: {
    ...commonCptd
  },
  methods: {
    ...commonMxd,
    handlePlatChange(val) {
      this.data.platSiteId = null
      this.getSiteByPlatId(val)
    },
    downloadFile() {
      const { platSiteId } = this.$route.query
      const params = { platSiteId, ...this.data }
      this.$api[`product/platProductCreateTemplate`](params).then(data => {
        downloadFile2(
          data.rows.path,
          '模板-' + formatDate(new Date(), '{y}{m}{d}{h}{i}{s}') + '.xls'
        )
        this.getHistory()
      })
    },
    download(path) {
      downloadFile2(
        path,
        '模板-' + formatDate(new Date(), '{y}{m}{d}{h}{i}{s}') + '.xls'
      )
    },
    // 获取历史记录
    getHistory() {
      let params = {}
      this.$api[`product/platProductTemplateList`](params).then(data => {
        this.tempList = data.rows
      })
    },
    // category
    handleClear() {
      this.data.catePlatId = null
    },

    getCategoryList(parentId, useType = 3) {
      this.loading = true
      this.$api['product/allcategoryList']({
        parentId,
        useType,
        dataType: 1 // 1-系统类目；2-平台类目
      }).then(res => {
        this.categoryList = res.rows
        this.loading = false
      })
    },

    handleNextPage(item) {
      console.log(item)
      this.data.catePlatId = item.categoryId
      // this.$emit('handleNextPage', item)
      // this.$refs.cate.handleNextPage(item)
    },
    handleSearch(keyword) {
      this.$api['product/allcategoryList']({
        keyword,
        dataType: 1,
        useType: 3
      }).then(res => {
        this.searchList = res.rows
      })
    },
    handleCollect(item) {
      console.log(item)
      this.collectList.push(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  & /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  .header {
    color: #333;
    font-size: 13px;
    padding: 10px;
    font-weight: bold;
    background-color: #f2f2f2;
    display: flex;
    justify-content: space-between;
    span {
      font-weight: bold;
    }
    i {
      cursor: pointer;
    }
  }
  .content {
    .select-catename {
      color: #0080c9;
      padding: 12px 14px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-top: 10px;
    }
    .select-list {
      margin-top: 10px;
      & > li {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        text-align: center;
        background-color: #f2f2f2;
        border: 1px solid #e4e4e4;
        cursor: pointer;
        &:hover {
          background-color: #bce9ff;
        }
      }
    }
  }
  &.second {
    .el-radio-group {
      .el-radio-button__inner {
        background: #f2f2f2;
      }
      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        color: #0094e9;
        border-color: #0094e9;
        background-color: #f3fbff;
      }
    }
  }
  &.third {
    .list {
      margin-top: 20px;
      .list-item {
        margin: 16px 0;
        display: flex;
        justify-content: space-between;
        a {
          font-size: 15px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
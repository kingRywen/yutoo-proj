<template>
  <div>
    <keep-alive>
      <Category v-if="index == 0" @handleNextPage="handleNextPage" />
    </keep-alive>
    <select-lang v-if="index == 1" :selectCateInfo="selectCateInfo" @prev="index--" @next="langNext" />
    <el-tabs v-model="activeName" v-if="index == 2">
      <el-tab-pane label="平台信息" name="first">
        <PlatInfo :params="params" :copy="copy" :new-var="newVar" :select-cate-info="selectCateInfo" />
      </el-tab-pane>
      <el-tab-pane label="产品图片" name="second">
        <ImgInfo />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    edit: {
      default: false
    },
    copy: {
      default: false
    },
    newVar: {
      default: false
    }
  },
  components: {
    Category: () =>
      import('Views/modules/product/amazon/platProduct/edit/category.vue'),
    SelectLang: () => import('./selectLang'),
    PlatInfo: () => import('./platInfo'),
    ImgInfo: () => import('./imgInfo')
  },
  data() {
    return {
      index: this.copy || this.edit ? 2 : 0,
      langId: null,
      storeId: null,
      selectCateInfo: {},
      activeName: 'first'
    }
  },
  methods: {
    handleNextPage(item) {
      this.selectCateInfo = item
      this.index++
    },
    langNext({ lang, store }) {
      this.langId = lang
      this.storeId = store
      this.index++
    }
  },
  computed: {
    params() {
      let { categoryId } = this.selectCateInfo
      let { platSiteId, productSellerId } = this.$route.query
      return {
        catePlatId: categoryId,
        platSiteId: +platSiteId,
        productSellerId,
        languageId: this.langId,
        storeId: this.store
      }
    }
  }
}
</script>
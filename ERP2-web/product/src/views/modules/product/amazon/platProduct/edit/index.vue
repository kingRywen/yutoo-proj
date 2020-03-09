<template>
  <div class="h100">
    <keep-alive>
      <category v-if="index == 0" @handleNextPage="handleNextPage" />
    </keep-alive>
    <keep-alive>
      <select-lang v-if="index == 1" :selectCateInfo="selectCateInfo" @go="handleSecondGo" />
    </keep-alive>
    <el-tabs v-model="activeName" v-if="index == 2">
      <el-tab-pane label="平台信息" name="first" lazy>
        <PlatInfo :params="params" :select-cate-info="selectCateInfo" />
      </el-tab-pane>
      <el-tab-pane label="产品图片" name="second" lazy>
        <EditForm />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    // 查看模式
    view: {
      default: false
    },
    // 是否复制产品
    copy: {
      default: false
    },
    // 图片编辑模式
    imgEdit: {
      default: false
    }
  },
  components: {
    EditForm: () => import('../imgEdit/editForm'),
    PlatInfo: () => import('./platInfo'),
    Category: () => import('./category'),
    SelectLang: () => import('./selectLang')
  },
  data() {
    return {
      index: this.view || this.copy || this.imgEdit ? 2 : 1,
      activeName: this.imgEdit ? 'second' : 'first',
      // 选择的类目
      selectCateInfo: {},
      langId: null
    }
  },
  created() {
    this.getCategoryInfo()
  },
  methods: {
    // 获取产品的类目信息
    getCategoryInfo() {
      if (!this.$route.query.catePlatId) {
        return
      }
      this.$api[`product/catePlatCurrent`]({
        id: this.$route.query.catePlatId
      }).then(data => {
        this.selectCateInfo = data.rows
      })
    },
    handleSecondGo(val, langId) {
      if (langId) {
        this.langId = langId
      }
      this.index -= val
    },
    handleNextPage(item) {
      // console.log(item);
      this.selectCateInfo = item
      this.index = 1
    }
  },
  computed: {
    params() {
      let { catePlatId } = this.selectCateInfo
      let {
        platSiteId,
        productPlatId,
        platSku,
        productPlatIds
      } = this.$route.query
      return {
        catePlatId,
        platSiteId: +platSiteId,
        productPlatId: +productPlatId,
        productPlatIds,
        platSku,
        languageId: this.langId
      }
    }
  }
}
</script>

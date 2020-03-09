<template>
  <div class="min-wrapper" style="height:100%">
    <el-tabs v-model="activeLangName" type="border-card" tabPosition="left" style="height: 100%;">
      <ElTabPane
        v-for="item in info"
        lazy
        :name="item.languageName"
        :label="item.languageName"
        :disabled="item.productPltDetailId == null"
        style="height:100%;overflow: auto"
      >
        <!-- 易贝 -->
        <LangForms
          v-if="!item.disabled && platformId == 2"
          :siteData="siteData"
          :isVariant="isVariant"
          :languageId="item.languageId"
          :productPltDetailId="productPltDetailId"
          :platformId="platformId"
          :review="review"
        />
        <!-- wish -->
        <WishLangForms
          v-if="!item.disabled && platformId == 5"
          :siteData="siteData"
          :isVariant="isVariant"
          :languageId="item.languageId"
          :productPltDetailId="productPltDetailId"
          :platformId="platformId"
          :review="review"
        />
      </ElTabPane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // 语种信息
    info: {
      default: () => []
    },
    // 站点信息
    siteData: {
      default: () => {}
    },
    productPltDetailId: Number,
    // 平台id
    platformId: Number,
    // 母变体
    isVariant: Boolean,
    review: Boolean
  },
  components: {
    None: () => import('@/components/base/None'),
    LangForms: () => import('./EbayLangForms'),
    WishLangForms: () => import('./WishLangForms')
  },
  data() {
    return {
      loading: false,
      // 选中语种
      activeLangName: null
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.activeLangName = val[0].languageName
        }
      }
    }
  },
  methods: {}
}
</script>

<style>
</style>

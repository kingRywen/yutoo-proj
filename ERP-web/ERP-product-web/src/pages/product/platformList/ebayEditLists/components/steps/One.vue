<template>
  <div style="height:100%">
    <el-card v-for="(site, index) in siteData.siteList" :header="site.siteName + '站'">
      <ElForm :disabled="review" size="small" label-width="140px" ref="form" :model="siteData" :rules="rules">
        <ElFormItem label="映射类目">
          <ElInput v-model="site.pltCategoryPath" disabled></ElInput>
        </ElFormItem>
        <ElFormItem
          label="选择类目"
          :prop="`siteList.${index}.siteInfo.selectedCate`"
          :rules="[{ required: true, message: '请选择类目' }]"
        >
          <SyncCascader
            :load="getCategoryLists(site)"
            :props="prop"
            v-model="site.siteInfo.selectedCate"
            @change="handleCateChange(site, $event)"
          ></SyncCascader>
        </ElFormItem>

        <ElFormItem>
          <template slot="label">
            <span class="danger" style="margin-right:4px">$</span>选择第二分类
            <el-tooltip content="ebay可能需要收费" placement="top">
              <el-button type="text" icon="el-icon-info"></el-button>
            </el-tooltip>
          </template>
          <SyncCascader :load="getCategoryLists(site)" :props="prop" v-model="site.siteInfo.selectedCate1"></SyncCascader>
        </ElFormItem>
        <ElFormItem
          label="选择模板"
          :prop="`siteList.${index}.siteInfo.templateId`"
          :rules="[{ required: true, message: '请选择模板' }]"
        >
          <el-select size="small" v-model="site.siteInfo.templateId" placeholder="请选择模板" style="width:100%">
            <el-option v-for="item in site.siteInfo.tempList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </ElFormItem>
      </ElForm>
    </el-card>
  </div>
</template>

<script>
import apis from 'apis'
import SyncCascader from 'components/base/SyncCascader'
import { fetchData, showToast, handlerCode } from 'common/common'
export default {
  components: {
    SyncCascader
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    productPltDetailId: [String, Number],
    siteData: {
      type: Object,
      default: () => ({
        siteList: []
      })
    },
    platformId: Number,
    review: Boolean
  },
  data() {
    return {
      // tempList: [],
      prop: {
        label: 'categoryName',
        value: 'platformCategoryId',
        children: 'childs',
        enabled: 'haveTemplate'
      },
      rules: {
        selectedCate: [{ required: true, message: '请选择一级类目' }],
        selectedCate1: [{ required: true, message: '请选择二级类目' }],
        templateId: [{ required: true, message: '请选择模板' }]
      }
    }
  },
  methods: {
    // 选择类目后
    handleCateChange(site, val) {
      if (val) {
        this.getTempList(
          this.platformId == 5 ? val.slice(0).pop() : val.platformCategoryId,
          site
        )
        site.siteInfo.templateId = null
      }
    },
    validate(cb) {
      return Promise.all(this.$refs.form.map(form => form.validate())).then(
        () => {
          cb && cb()
          return Promise.resolve()
        }
      )
    },
    // 获取模板数据
    getTempList(siteCategoryId, site) {
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_MODULE,
        data: {
          siteCategoryId
        }
      }).then(res => {
        handlerCode(
          res,
          () => {
            site.siteInfo.tempList = res.data.categoryList.map(el => ({
              label: el.templateNameCh,
              value: el.salePfTemplateId
            }))
          },
          null,
          true
        )
      })
    },
    // 获取类目树
    getCategoryLists(site) {
      return id => {
        return fetchData({
          ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
          data: {
            siteId: site.siteInfo.siteId,
            cateId: id != null ? id[id.length - 1] : -1
          }
        }).then(res => {
          if (res.data.code !== 0) {
            showToast('error', res.data.msg)
            return
          }
          if (res.data.cates) {
            return res.data.cates.map(el => {
              return {
                ...el,
                childs: el.childCount > 0 ? [] : null
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style>
</style>

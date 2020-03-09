<template>
  <div v-loading="loading" element-loading-text="加载中..." style="min-height: 200px">
    <el-tabs v-model="activeName" class="__custom-tabs">
      <el-tab-pane
        v-for="(item, index) in formData"
        :key="index"
        :label="item.propertyGroupKey"
        :name="item.propertyGroupKey"
        :lazy="item.propertyGroupKey !== '变体信息'" 
      >
        <span slot="label">
          <i v-show="item.validSuccess === false || item.validSuccess1 === false" class="iconfont iconjinggaoicon warn"></i>
          {{item.propertyGroupKey}}
        </span>
        <div class="cate-info">{{selectCateInfo.systemCategoryName}}</div>
        <WidgetCardWrapper title="变体属性" v-if="item.propertyGroupKey === '变体'" :isCollapse="false">
          <new-form
            class="mt10"
            style="width: 500px"
            :validSuccess.sync="item.validSuccess1"
            label-width="120px"
            :is-dirty.sync="item.isDirty1"
            v-model="variantTheme"
            :form-schema="variantSchema"
          ></new-form>
        </WidgetCardWrapper>
        <new-form
          :validSuccess.sync="item.validSuccess"
          :is-dirty.sync="item.isDirty"
          v-if="item.props"
          label-width="250px"
          v-model="item.value"
          :form-schema="item.props"
        ></new-form>
      </el-tab-pane>
    </el-tabs>
    <div class="txc" v-if="formData.length">
      <ElButton type="primary" plain @click="cancel">取消</ElButton>
      <ElButton type="primary" :disabled="!isEdited" @click="save(!params.productPlatIds ? 2: 0)">保存</ElButton>
      <ElButton type="primary" :disabled="!isValidSuccess || !isEdited" @click="save(!params.productPlatIds ? 1: 3)">提交</ElButton>
    </div>
  </div>
</template>
<script>
import { generateInputConf, generateReqData } from '../../utils'
export default {
  props: ['params', 'selectCateInfo'],
  data() {
    return {
      loading: false,
      activeName: '变体',
      tabs: [
        {
          label: '任务1',
          name: 'first'
        },
        {
          label: '任务2',
          name: 'second'
        }
      ],
      info: {},
      formData: [],
      variantTheme: { theme: null },
      variantSchema: {
        theme: {
          widget: 'select',
          label: 'Variation Theme',
          options: [],
          required: true
        }
      }
    }
  },
  created() {
    // this.getTheme()
    // this.getData()
    this.init()
  },
  methods: {
    cancel() {
      if (this.isEdited) {
        this.$confirm('有编辑的数据未保存，是否离开此页面?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push('/product/amazon/platProduct')
          })
          .catch(() => {})
      } else {
        this.$router.push('/product/amazon/platProduct')
      }
    },
    // type 0.编辑保存，1.编辑提交，2.复制产品保存，3.复制产品提交
    save(reqType) {
      const data = generateReqData(this.formData)
      let params = { reqType, ...this.params, ...data, templateId: this.info.templateId, templateType: this.info.templateType }
      this.$api[`product/platProductSave`](params).then(() => {
        console.log(params)

        // this.$router.push('/product/amazon/platProduct')
      })
    },
    init() {
      this.loading = true
      this.getData()
        .then(data1 => {
          return data1.rows
        })
        .then(data1 => {
          return this.getTheme(data1.templateId).then(({ rows: data2 }) => {
            try {
              console.log(data1, data2)

              const {
                formData,
                catePlatId,
                catePlatName,
                templateId,
                templateType,
                variationThemeAmzId,
                variants
              } = generateInputConf(data1, data2)

              this.$options.data1 = Object.freeze(data1)
              this.$options.data2 = Object.freeze(data2)
              if (variationThemeAmzId != null) {
                this.variantTheme.theme = variationThemeAmzId
              }
              this.$watch('variantTheme.theme', this.themeChange)
              this.formData = formData
              // this.activeName = ''
              this.info = {
                catePlatId,
                catePlatName,
                templateId,
                templateType,
                variationThemeAmzId,
                variants
              }

              this.variantSchema.theme.options = data2.map(el => ({
                label: el.variationThemeName,
                value: el.variationThemeAmzId,
                propertys: el.propertys
              }))
            } catch (error) {
              console.error(error)
            }

            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
      // Promise.all([this.getData(), this.getTheme()]).then(([data1, data2]) => {

      // })
    },
    getData() {
      return this.$api[`product/platProductInfo`](this.params)
    },
    getTheme(templateId) {
      return this.$api[`product/platProductVariationTheme`]({
        templateId,
        catePlatId: this.params.catePlatId
      })
    },
    getThemeVariantValue(variationThemeAmzId) {
      return this.$api[`product/platProductVariantPropertyValue`]({
        templateId: this.info.templateId,
        catePlatId: this.params.catePlatId,
        variationThemeAmzId,
        ...this.params
      }).then(data => data.rows)
    },
    async themeChange(val) {
      this.loading = true
      let selectedThemeVarProps = await this.getThemeVariantValue(val)
      const { formData } = generateInputConf(
        { ...this.$options.data1, variationThemeAmzId: val },
        this.$options.data2,
        selectedThemeVarProps
      )
      this.$options.data1 = Object.freeze({
        ...this.$options.data1,
        variationThemeAmzId: val
      })
      this.info.variationThemeAmzId = val
      // this.formData = formData
      this.formData = this.formData.map((el, index) => ({
        ...formData[index],
        value: el.value
      }))
      this.loading = false
    }
  },
  computed: {
    isValidSuccess() {
      return this.formData.every(
        el => el.validSuccess !== false && el.validSuccess1 !== false
      )
    },
    isEdited() {
      return this.formData.some(
        el => el.isDirty === true || el.isDirty1 === true
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.cate-info {
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  color: #999999;
  line-height: normal;
  margin-bottom: 16px;
}
.iconjinggaoicon {
  margin-right: 6px;
}
</style>
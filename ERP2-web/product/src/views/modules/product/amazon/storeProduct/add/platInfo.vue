<template>
  <div v-loading="loading" element-loading-text="加载中..." style="min-height: 200px">
    <template v-if="!noData">
      <el-tabs v-model="activeName" class="__custom-tabs">
        <el-tab-pane
          v-for="(item, index) in formData"
          :key="index"
          :label="item.propertyGroupKey"
          :name="item.propertyGroupKey"
        >
          <span slot="label">
            <i
              v-show="item.validSuccess === false || item.validSuccess1 === false"
              class="iconfont iconjinggaoicon warn"
            ></i>
            {{item.propertyGroupKey}}
          </span>
          <div class="cate-info">{{selectCateInfo.systemCategoryName}}</div>
          <WidgetCardWrapper title="变体属性" v-if="item.propertyGroupKey === '变体'" :isCollapse="false">
            <new-form
              class="mt10"
              style="width: 500px;margin-bottom:20px"
              :validSuccess.sync="item.validSuccess1"
              label-width="120px"
              :is-dirty.sync="item.isDirty1"
              v-model="variantTheme"
              :form-schema="variantSchema"
            ></new-form>
            <template v-if="selectedThemeVarProps.propertys">
              <el-form size="small" label-width="120px" :model="selectedThemeVarProps">
                <el-form-item
                  v-for="(item, index) in selectedThemeVarProps.propertys"
                  :label="item.propertyName"
                  required
                  :key="index"
                >
                  <div class="flex" style="flex-wrap: wrap">
                    <ElFormItem
                      v-for="(val, pIdx) in item.propertyValues"
                      :key="pIdx"
                      class="mr10 s1"
                      label-width="0"
                      :rules="reqRules"
                      :prop="item.propertyValues.length === 1 ? `propertys.${index}.propertyValues.${pIdx}` : ''"
                    >
                      <el-input
                        :key="pIdx"
                        :value="item.propertyValues[pIdx]"
                        @blur="handleVarBlur($event, pIdx, item.propertyValues)"
                        @input="handleVarInput($event, pIdx, item.propertyValues)"
                        placeholder="请输入"
                      ></el-input>
                      <i
                        @click="handleVarClose(pIdx, item.propertyValues)"
                        v-if="item.propertyValues[pIdx] !== ''"
                        class="el-icon-remove close"
                      ></i>
                    </ElFormItem>
                  </div>
                </el-form-item>
              </el-form>
              <ElButton
                :disabled="showCreateBtn"
                type="primary"
                style="margin-left:120px;margin-bottom: 20px"
                size="small"
                :loading="varLoading"
                @click="createVar"
              >生成变体</ElButton>
            </template>
          </WidgetCardWrapper>
          <new-form
            :validSuccess.sync="item.validSuccess"
            :is-dirty.sync="item.isDirty"
            v-if="(item.props && item.propertyGroupKey !== '变体') || (item.propertyGroupKey === '变体' && variantTheme.theme != null && variantTheme.theme !== '')"
            label-width="140px"
            v-model="item.value"
            :form-schema="item.props"
          >
            <template v-slot:btnLeft="{data}">
              <ElButton size="small" type="primary" plain>添加变体</ElButton>
              <ElButton size="small" type="primary" plain>删除</ElButton>
            </template>
          </new-form>
        </el-tab-pane>
      </el-tabs>
      <div class="txc" v-if="formData.length">
        <ElButton type="primary" plain @click="cancel">取消</ElButton>
        <ElButton type="primary" :disabled="!isValidSuccess || !isEdited" @click="save(0)">保存</ElButton>
        <ElButton type="primary" :disabled="!isValidSuccess || !isEdited" @click="save(1)">提交</ElButton>
      </div>
    </template>
    <NonePage v-else text="该类目正在研发中"></NonePage>
  </div>
</template>
<script>
import { generateInputConf, generateReqData } from '../../utils'
export default {
  props: ['params', 'selectCateInfo', 'copy', 'newVar'],
  data() {
    return {
      varLoading: false,
      // 选择变体主题时获取到的变体属性
      selectedThemeVarProps: {},
      reqRules: [
        {
          required: true,
          message: '请输入'
        }
      ],
      loading: false,
      noData: false,
      activeName: this.newVar ? '变体' : '重要信息',
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
    createVar() {
      this.varLoading = true
      const variantProperties = this.selectedThemeVarProps.propertys
      const params = { ...this.params, variantProperties }
      this.$api[`product/repoProductVariant`](params)
        .then(data => {
          this.varLoading = false
          // console.log(data);
          const data1 = { ...this.$options.data1, ...data }
          const data2 = this.$options.data2
          const {
            formData,
            catePlatId,
            catePlatName,
            templateId,
            templateType,
            variationThemeAmzId,
            variants
          } = generateInputConf(data1, data2, this.selectedThemeVarProps)
          this.$options.data1 = Object.freeze(data1)
          this.formData = formData
          this.info = {
            catePlatId,
            catePlatName,
            templateId,
            templateType,
            variationThemeAmzId,
            variants
          }
        })
        .catch(() => {
          this.varLoading = false
        })
    },
    handleVarInput(val, index, arr) {
      arr.splice(index, 1, val)
    },
    handleVarClose(index, arr) {
      arr.splice(index, 1)
    },
    handleVarBlur(e, index, arr) {
      let val = e.target.value
      let hasIndex = arr.indexOf(val)
      if (hasIndex == index) {
        let _index = arr.lastIndexOf(val)
        if (_index > -1) {
          hasIndex = _index
        }
      }
      if (hasIndex > -1 && hasIndex !== index) {
        if (arr.length - 1 !== index) {
          arr.splice(index, 1)
        } else {
          arr.splice(index, 1, '')
        }

        return
      }
      if (val === '') {
        if (arr.length > 1 && arr.length - 1 !== index) {
          arr.splice(index, 1)
        }
      } else if (arr[index + 1] == null) {
        arr.splice(index, 1, val, '')
      }
    },
    cancel() {
      if (this.isEdited) {
        this.$confirm('有编辑的数据未保存，是否离开此页面?', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push('/product/amazon/storeProduct')
          })
          .catch(() => {})
      } else {
        this.$router.push('/product/amazon/storeProduct')
      }
    },
    // type 0 保存 1 提交
    save(reqType) {
      const data = generateReqData(this.formData)
      let params = { reqType, ...this.params, ...data }
      this.$api[`product/platProductSave`](params).then(() => {
        console.log(params)

        // this.$router.push('/product/amazon/storeProduct')
      })
    },
    init() {
      this.loading = true
      Promise.all([this.getData(), this.getTheme()]).then(([data1, data2]) => {
        if (data1 == null || data1.templateId == null) {
          this.loading = false
          this.noData = true
          return
        }
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
        if (
          variationThemeAmzId != null &&
          this.$route.path !== '/product/amazon/storeProduct/add'
        ) {
          this.variantTheme.theme = variationThemeAmzId
        }
        this.$watch('variantTheme.theme', this.themeChange)
        this.formData = formData
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
        this.loading = false
      })
    },
    getData() {
      return this.$api[`product/storeProductInfo`](this.params)
    },
    getTheme() {
      return this.$api[`product/platProductVariationTheme`]({
        templateId: this.info.templateId,
        catePlatId: this.params.catePlatId
      })
    },
    getThemeVariantValue(variationThemeAmzId) {
      return this.$api[`product/platProductVariantPropertyValue`]({
        templateId: this.info.templateId,
        catePlatId: this.params.catePlatId,
        variationThemeAmzId,
        ...this.params
      })
    },
    async themeChange(val) {
      this.loading = true
      let varValue = []
      let selectedThemeVarProps = this.variantSchema.theme.options.find(
        el => el.value === val
      )
      if (selectedThemeVarProps != null && selectedThemeVarProps !== '') {
        varValue = await this.getThemeVariantValue(val)
        selectedThemeVarProps.propertys.forEach(el => {
          this.$set(el, 'propertyValues', [''])
        })
        this.selectedThemeVarProps = selectedThemeVarProps
      } else {
        this.selectedThemeVarProps = {}
      }

      const { formData } = generateInputConf(
        { ...this.$options.data1, variationThemeAmzId: val },
        this.$options.data2,
        varValue
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
    showCreateBtn() {
      const props = this.selectedThemeVarProps.propertys
      if (props) {
        return !props.every(el =>
          el.propertyValues.some(e => e != null && e !== '')
        )
      }
      return true
    },
    variantion() {
      return {
        data: this.selectedThemeVarProps
      }
    },
    isValidSuccess() {
      return this.formData.every(
        el => el.validSuccess !== false && el.validSuccess1 !== false
      )
    },
    isEdited() {
      if (this.copy) {
        return true
      }
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
.s1 {
  position: relative;
  .close {
    position: absolute;
    right: 2px;
    top: 3px;
    cursor: pointer;
  }
}
</style>
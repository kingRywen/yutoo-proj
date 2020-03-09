<template>
  <v-spin tip="正在读取数据." :spinning="spinning" style="height:100%;width:100%">
    <!-- {{baseTab.variantEntityList}} -->
    <div ref="content">
      <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
        <v-row :gutter="20">
          <v-col span="12">
            <v-form-item label="产品SKU" :label-col="labelCol" :wrapper-col="wrapperCol" required has-feedback>
              <v-input v-if="ruleForm && ruleForm.sku" type="text" placeholder v-model="ruleForm.sku" disabled></v-input>
            </v-form-item>
          </v-col>
        </v-row>
        <v-row :gutter="20">
          <input-variant
            v-for="item in inputArrs"
            @set-input="setCategory(item, $event)"
            :review="review"
            :edit="$attrs.edit"
            :item="item"
            :cate="catelogy"
            :options.sync="baseEnum"
            :group="item.propertyGroupName"
            :label="item.propertyName"
            :disabled="item.displayKey === 'skuCustom' || item.disabled || show"
            :prop-item="item.displayKey"
            :date-type="item.dateType"
            :input-type="item.inputType"
            :key="item.displayKey"
            :type="item.inputType"
            v-model="ruleForm[item.displayKey]"
            @selectmore="selectmore"
            :labelcol="labelCol"
            :ruleForm="ruleForm"
            :wrappercol="wrapperCol"
            :cate-detail="ruleForm.categoryDetail"
            :cate-second-detail="ruleForm.categorySecondDetail"
            :history="allData.history"
          ></input-variant>
        </v-row>

        <!-- 扩展属性值 -->
        <v-row :gutter="20" v-if="propertys.length || variantMode">
          <v-col span="24" class="margin-bottom-20">
            <div v-for="(item, varIndex) in propertys" :key="item.displayKey">
              <input-variant
                :review="review"
                :item="item"
                :edit="$attrs.edit"
                :parent="1"
                :label="item.propertyName"
                :options.sync="baseEnum"
                :date-type="item.dateType"
                :input-type="item.inputType"
                :disabled="item.disabled || show"
                :prop-item="item.displayKey"
                :type="item.inputType"
                v-model="item.propertyValue"
                :labelcol="labelCol"
                :wrappercol="wrapperCol"
                :ruleForm="ruleForm"
                :cate-detail="ruleForm.categoryDetail"
                :cate-second-detail="ruleForm.categorySecondDetail"
                :history="allData.history"
              ></input-variant>
            </div>
          </v-col>
        </v-row>

        <!-- 差异值 -->
        <v-row :gutter="20" v-if="variantNum.length || variantMode">
          <v-col span="24" class="margin-bottom-20">
            <div v-for="(item, varIndex) in variants" :key="item.displayKey" style="position:relative">
              <v-row :gutter="16" v-if="item.displayKey !== 'sku' && item.displayKey !== 'skuCustom'">
                <v-col span="22">
                  <input-variant
                    :review="review"
                    :history="allData.history"
                    :item="item"
                    :edit="$attrs.edit"
                    :parent="1"
                    :label="item.propertyName"
                    :options.sync="baseEnum"
                    :date-type="item.dateType"
                    :input-type="item.inputType"
                    :disabled="item.displayKey === 'skuCustom' || item.disabled || show"
                    :prop-item="item.displayKey"
                    :type="item.inputType"
                    :value="ruleForm[item.displayKey]"
                    :ruleForm="ruleForm"
                    @input="setParentVal(item, $event)"
                    :labelcol="labelCol"
                    :wrappercol="{span:18}"
                    :cate-detail="ruleForm.categoryDetail"
                    :cate-second-detail="ruleForm.categorySecondDetail"
                  ></input-variant>
                  <v-col span="2" style="cursor:pointer">
                    <div @click="$set(showInputs, varIndex, !showInputs[varIndex])" style="padding: 9px;">
                      <v-icon v-if="!showInputs[varIndex]" type="down"></v-icon>
                      <v-icon v-else type="up"></v-icon>
                    </div>
                  </v-col>
                </v-col>
                <!-- 母体变体差异 -->
                <template v-if="variantNum[0] && variantNum[0].variant && variantNum[0].variant.sku && (item.displayKey !== 'sku' && item.displayKey !== 'skuCustom')">
                  <v-col span="22" v-for="(ii, index) in variantNum" v-show="showInputs[varIndex]">
                    <input-variant
                      v-if="ii"
                      :ruleForm="ruleForm"
                      :review="review"
                      :history="allData.history"
                      :item="item"
                      :edit="$attrs.edit"
                      :parent="1"
                      :label="ii.variant.skuCustom"
                      :options.sync="baseEnum"
                      :date-type="item.dateType"
                      :input-type="item.inputType"
                      :disabled="(item.displayKey === 'sku' || item.displayKey === 'skuCustom') || item.disabled || show"
                      :rules="renderedField.vali[item.displayKey]"
                      :prop-item="ii.variant.sku + '_' + item.displayKey"
                      :type="item.inputType"
                      :value="variantEntityList[index][item.displayKey]"
                      :data="variantEntityList[index]"
                      @input="setVariantValue(index, $event, item.displayKey, ii, item)"
                      :labelcol="labelCol"
                      :wrappercol="{span:18}"
                      :cate-detail="ruleForm.categoryDetail"
                      :cate-second-detail="ruleForm.categorySecondDetail"
                      :variant="ii.variant"
                    ></input-variant>
                  </v-col>
                </template>
              </v-row>
            </div>
          </v-col>
        </v-row>
        <!-- 母体差异值 -->
      </v-form>

      <div class="saveBtn" v-if="!$attrs.show">
        <div style="margin: 0 auto">
          <v-button
            type="primary"
            :disabled="show"
            :loading="saveLoading"
            v-if="!$attrs.show && !variantMode"
            @click.prevent="save"
          >保存</v-button>
          <v-button
            type="primary"
            :disabled="show"
            :loading="saveLoading"
            v-if="!$attrs.show && variantMode"
            @click.prevent="saveVariant"
          >保存</v-button>
          <v-button
            type="primary"
            :disabled="show"
            :loading="commitLoading"
            v-if="!$attrs.show && !variantMode"
            @click.prevent="submit"
          >提交</v-button>
        </div>
      </div>
    </div>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import bus from 'common/bus.js'
import inputVariant from 'components/base/inputVariant.vue'
import {
  fetchData,
  toParamUrl,
  showConfirm,
  showToast,
  batchValidForm
} from 'common/common'
import { isArray, getQueryString, isObj } from 'common/util'
import apis from 'apis'
let _cloneDeep = require('lodash/cloneDeep')

export default {
  customName: 'BasicInformation',
  inheritAttrs: false,
  components: {
    inputVariant
  },
  created() {
    if (getQueryString('variant')) {
      this.variantMode = true
    }
    this.review = getQueryString('isshow')
    let vm = this
    bus.$on('setBase', () => {
      console.log('object', this.baseTab)
      vm.$nextTick(() => {
        sessionStorage.setItem('baseTab', JSON.stringify(this.baseTab))
      })
    })

    console.log(this.$attrs.renderedField)
    if (!getQueryString('productId')) {
      this.getSku()
    }
    this.getProperties()
    // this.getEnumList();
    this.getBaseEnumList()

    if (getQueryString('type') == 1) {
      this.reviewBtn = true
    }
  },
  mounted() {
    this.allData.baseTab.variantEntityList.forEach(el => {
      for (const key in el) {
        if (el.hasOwnProperty(key)) {
          const element = el[key]
          this.$set(this.ruleForm, el.sku + '_' + key, element)
        }
      }
    })
  },
  data() {
    let list = this.$attrs.allData.baseTab.propertyEntityList

    return {
      saveLoading: false,
      commitLoading: false,
      showInputs: [],
      reqCount: 0,
      spinning: false,
      variantMode: false,
      show: this.$attrs.show,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      labelCol1: {
        span: 3
      },
      wrapperCol1: {
        span: 19
      },
      ruleForm: {
        sku: this.$attrs.parentSKU,
        platformIds: [],
        shareFlag: 0,
        variantFlag: 0,
        overseaFlag: 0,
        photoFlag: 0,
        plugFlag: 0,
        productType: null,
        modelId: 0
      },
      variantEntityList: [],
      isEdit: [],
      propertyEntityList: [],

      rules: {
        skuCustom: [
          {
            required: true,
            message: '请输入自定义SKU'
          }
        ],
        notEmpty: [
          {
            required: true,
            message: '不能为空'
          }
        ],
        purchaseId: [
          {
            required: true,
            message: '请选择采购人员'
          }
        ]
      },
      upOptions: [
        { label: '亚马逊', value: 'amazon' },
        { label: 'eabay', value: 'eabay' },
        { label: '速卖通', value: 'express' },
        { label: 'wish', value: 'wish' }
      ],
      inputArrs: [], //基础属性字段
      variants: [], // 变体差异字段
      propVal: list,
      originData: '',
      propertys: [], // 扩展属性字段
      baseEnum: {}, // 基本信息页面下拉数据获取
      enumList: [], // 插头数据
      keywords: [],
      reviewBtn: false, // 是否显示提交审核按钮
      baseList: {
        // 基本信息页面下拉数据字典表
        developId: 'developList',
        plugId: 'plugTypeList',
        warehouseId: 'warehouseList',
        riskType: 'productRiskList',
        unit: 'unitList',
        logisticType: 'logisticList',
        brand: 'brandList',
        productType: 'productTypeList',
        purchaseId: 'purchaseList'
      }
      // variantNum: 2 // 变体个数
    }
  },
  methods: {
    // 获取扩展属性
    getProperties() {
      let vm = this
      if (!this.$attrs.catelogy.sourceType || !this.categoryId) {
        return
      }
      this.spinning = true
      fetchData({
        ...apis.PRODUCT_FIELD_EXTEND,
        data: {
          sourceType: this.$attrs.catelogy.sourceType,
          categoryId: this.categoryId
        }
      }).then(res => {
        this.spinning = false
        this.reqCount++

        this.propertys = res.data.map(el => {
          let propertyValue = '',
            elm,
            productId,
            productPropertyId,
            categoryPropertyId

          if (this.propVal.length > 0) {
            elm = this.propVal.find(e => e.propertyName === el.propertyName)
            propertyValue = elm.propertyValue
            productPropertyId = elm.productPropertyId
            categoryPropertyId = elm.categoryPropertyId
          }

          return {
            ...el,
            variantPropFlag: 0,
            propertyOriginal: 1,
            propertyValue,
            productId,
            productPropertyId,
            categoryPropertyId
          }
        })
        vm.originData = vm.getSavedData()
      })
    },

    // 设置变体差异属性的值
    setVariantValue(index, val, key, ii, item) {
      console.log(index, val)
      if (isObj(val)) {
        this.$set(
          this.ruleForm,
          ii.variant.sku + '_' + item[val.index].displayKey,
          val.e
        )
        this.$set(this.variantEntityList, index, {
          ...this.variantEntityList[index],
          [item[val.index].displayKey]: val.e
        })
      } else {
        this.$set(this.ruleForm, ii.variant.sku + '_' + key, val)
        Vue.set(
          this.variantEntityList,
          index,
          Object.assign({}, this.variantEntityList[index], {
            [key]: val
          })
        )
      }
    },

    // 母体差异值输入时，同时改变变体的值
    setParentVal(item, val) {
      let vm = this
      // 母体
      if (isObj(val) && isArray(item)) {
        vm.ruleForm[item[val.index].displayKey] = val.e
        vm.variantEntityList.forEach((el, index) => {
          if (!vm.isEdit[index]) {
            // 排除sku 自定义sku
            if (el.displayKey == 'sku' || el.displayKey == 'skuCustom') {
              return
            }
            // 没有编辑过变体的值 就同步
            Vue.set(el, item[val.index].displayKey, val.e)
          }
        })
      } else {
        vm.ruleForm[item.displayKey] = val
        // 变体
        vm.variantEntityList.forEach((el, index) => {
          if (!vm.isEdit[index]) {
            // 排除sku 自定义sku
            if (item.displayKey == 'sku' || item.displayKey == 'skuCustom') {
              return
            }
            // 没有编辑过变体的值 就同步
            Vue.set(el, item.displayKey, val)
            // el[item.displayKey] = val;
          }
        })
      }
    },

    setCategory(item, val) {
      console.log(val)
      const {
        arr: { categoryId },
        name,
        arrs
      } = val

      this.ruleForm.categorySecondDetail = name.join(' &gt; ')
      this.ruleForm.categorySecondIdList = arrs.join(';')
      this.$nextTick(() => {
        this.ruleForm.categorySecondId = arrs[arrs.length - 1]
      })
    },

    // 多选
    selectmore(val) {
      console.log(val)
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          const element = val[key]
          Vue.set(this.ruleForm, key, element)
        }
      }
    },

    // 获取插头数据
    getEnumList() {
      this.spinning = true
      fetchData({
        ...apis.GLOBAL_ENUM_LIST,
        data: {
          type: 4
        }
      }).then(res => {
        this.spinning = false
        this.reqCount++
        console.log('获取插头数据', res)

        this.enumList = res.data
      })
    },

    // 获取下拉，单选，多选选项
    getBaseEnumList() {
      this.spinning = true
      fetchData({
        ...apis.PRODUCT_BASE_ENUM,
        data: {}
      }).then(res => {
        this.spinning = false
        this.reqCount++
        let ress = res.data
        delete ress.code
        console.log('获取下拉，单选，多选选项', ress)
        this.baseEnum = res.data
      })
    },

    // 获取产品的sku
    getSku() {
      this.spinning = true
      fetchData({
        ...apis._PRODUCT_SKU_GET,
        data: {
          num: 1
        }
      }).then(res => {
        this.spinning = false
        console.log(res)
        // this.ruleForm.sku = res.data.skuList[0];
        this.$set(this.ruleForm, 'sku', res.data.skuList[0])
        this.$emit('update:sku', res.data.skuList[0])
      })
    },

    // 保存
    save() {
      this.formSubmit()
    },

    // 保存变体
    saveVariant() {
      this.formSubmit()
    },

    getSavedData() {
      console.log('saveddata')
      let vm = this
      return JSON.stringify({
        ...vm.ruleForm,
        propertyEntityList: vm.propertys
      })
    },

    // 保存到服务器
    async formSubmit() {
      let vm = this
      this.saveLoading = true
      let res = await this.sendToSave()
      this.saveLoading = false
      if (res && typeof res === 'string') {
        showConfirm({
          title: '警告',
          content: `您提交的表单信息中包含<div class="text-error"> ${res} </div>是否保存？`,
          onOk() {
            vm.originData = vm.getSavedData()
            vm.$emit('openload')
            fetchData({
              ...apis.PRODUCT_BASE_SAVE,
              data: {
                ...vm.baseTab,
                propertyEntityList: vm.propertys
              }
            }).then(res => {
              vm.$emit('close')
              if (res.data.code === 0) {
                let variantEntityList = vm.baseTab.variantEntityList

                if (!getQueryString('productId')) {
                  toParamUrl('/product/productList/addProduct.html', {
                    productId: res.data.productId
                  })
                }

                // 如果变体列表存在porductID null 判断为有增加操作
                if (variantEntityList.some(el => el.productId === null)) {
                  window.location.reload()
                }
                showToast('success', '保存成功')
              } else {
                showToast('error', res.data.msg)
              }
            })
          }
        })
      }

      if (res && res.data && res.data.code === 0) {
        let variantEntityList = this.baseTab.variantEntityList

        if (!getQueryString('productId')) {
          toParamUrl('/product/productList/addProduct.html', {
            productId: res.data.productId
          })
        }

        // 如果变体列表存在porductID null 判断为有增加操作
        if (variantEntityList.some(el => el.productId === null)) {
          window.location.reload()
        }
        showToast('success', '保存成功')
      } else {
        res && res.data && res.data.msg && showToast('error', res.data.msg)
      }
    },

    // 保存服务器api
    async sendToSave() {
      console.log(this.ruleForm)
      let baseTab = this.baseTab
      let hasRemark = Object.keys(this.$attrs.remarkTab).length != 0
      if (isArray(baseTab.productEntity.platformIds)) {
        baseTab.productEntity.platformIds = baseTab.productEntity.platformIds.join(
          ';'
        )
      }

      let valis = await this.validKeywords(this.baseTab)

      if (valis.data.code !== 0) {
        showToast('error', valis.data.msg)
        return
      }
      if (Object.keys(valis.data).length > 1) {
        let str = ``
        for (const key in valis.data) {
          if (valis.data.hasOwnProperty(key)) {
            const element = valis.data[key]
            if (key === 'code') {
              continue
            }
            str += '<p>' + key + ': ' + element + '</p>'
          }
        }

        return str
      }

      // 把多选转化为字符
      let res = await fetchData({
        ...apis.PRODUCT_BASE_SAVE,
        data: {
          ...this.baseTab,
          propertyEntityList: this.propertys
        }
      })
      if (res && res.data.code === 0) {
        this.originData = this.getSavedData()
      }
      return res
    },

    // 验证敏感关键词
    setKeywords(data) {
      let vm = this
      // let arr = [];
      vm.keywords = []
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (isObj(element)) {
            vm.validKeywords(element)
          } else {
            if (
              key === 'nameEn' ||
              key === 'nameZh' ||
              key === 'seoTitle' ||
              key === 'seoKeyword' ||
              key === 'searchKeyword' ||
              key === 'seoDesc'
            ) {
              vm.keywords.push(element)
            }
          }
        }
      }
    },

    async validKeywords(data) {
      this.setKeywords(data)
      return await fetchData({
        ...apis.PRODUCT_KEY_WORD_VERIFY_1,
        data: { word: this.keywords.join(';') }
      })
    },

    // 提交到服务器
    async submit() {
      let valid = await this.submitForm()
      if (!valid) {
        console.log(valid)
        showToast('error', '请填写完整正确的表单信息')
        return
      }
      let vm = this
      let valis = await this.validKeywords(this.baseTab)

      if (valis.data.code !== 0) {
        showToast('error', valis.data.msg)
        return
      }
      if (Object.keys(valis.data).length > 1) {
        let str = ``
        let variantEntityList = vm.baseTab.variantEntityList
        for (const key in valis.data) {
          if (valis.data.hasOwnProperty(key)) {
            const element = valis.data[key]
            if (key === 'code') {
              continue
            }
            str += '<p>' + key + ': ' + element + '</p>'
          }
        }

        showConfirm({
          type: 'warning',
          title: '警告',
          content: `您提交的表单信息中包含 <div class="text-error">${str}</div>是否提交？`,
          async onOk() {
            let productId = +getQueryString('productId')
            let baseTab = vm.baseTab
            let hasRemark = Object.keys(vm.$attrs.remarkTab).length != 0
            let variantEntityList = vm.baseTab.variantEntityList
            if (isArray(baseTab.productEntity.platformIds)) {
              baseTab.productEntity.platformIds = baseTab.productEntity.platformIds.join(
                ';'
              )
            }

            if (vm.variantMode) {
              // 变体编辑
              productId = baseTab.productEntity.productId
            }

            vm.commitLoading = true
            let ret = await fetchData({
              ...apis.PRODUCT_BASE_COMMIT,
              data: {
                baseTab: {
                  ...vm.baseTab,
                  propertyEntityList: vm.propertys
                },
                productId
              }
            })
            vm.commitLoading = false

            if (ret.data.code === 0) {
              // 提交成功，跳转到列表页
              showToast('success', ret.data.msg)
              toParamUrl('/product/productList.html')
            } else {
              showToast('error', ret.data.msg)
            }
          }
        })
        return
      }

      let productId = +getQueryString('productId')
      let baseTab = this.baseTab
      let hasRemark = Object.keys(this.$attrs.remarkTab).length != 0
      if (isArray(baseTab.productEntity.platformIds)) {
        baseTab.productEntity.platformIds = baseTab.productEntity.platformIds.join(
          ';'
        )
      }
      let variantEntityList = this.baseTab.variantEntityList
      if (this.variantMode) {
        // 变体编辑
        productId = baseTab.productEntity.productId
      }

      this.commitLoading = true
      let ret = await fetchData({
        ...apis.PRODUCT_BASE_COMMIT,
        data: {
          baseTab: { ...this.baseTab, propertyEntityList: this.propertys },
          productId
        }
      })
      this.commitLoading = false

      if (ret.data.code === 0) {
        // 提交成功，跳转到列表页
        showToast('success', ret.data.msg)
        toParamUrl('/product/productList.html')
      } else {
        showToast('error', ret.data.msg)
      }
    },

    // 表单验证
    async submitForm() {
      let forms = [this.$refs.ruleForm]
      console.log(forms)
      return await batchValidForm(forms)
    },

    // 同步基本信息的数据到根组件的 basetab
    setBase(val) {
      this.$emit('set', 'baseTab', val)
    }
  },
  watch: {
    reqCount(val) {
      if (val === 3) {
        this.spinning = false
      }
    },

    'ruleForm.plugId'(val) {
      if (!val || !this.baseEnum.plugTypeList) {
        return
      }
      let el = this.baseEnum.plugTypeList.find(el => el.key === ~~val)
      if (!el) {
        return
      }
      if (!this.ruleForm.nameZh) {
        this.ruleForm.nameZh = ''
        return
      }
      // if (!this.ruleForm.plugFlag) {
      //   this.ruleForm.nameZh = ''
      //   return
      // }
      this.ruleForm.nameZh =
        this.ruleForm.nameZh.split('(')[0] + '(' + el.value + ')'
    },

    'ruleForm.plugFlag'(val) {
      if (!this.baseEnum.plugTypeList || !this.ruleForm.plugId) {
        return
      }
      if (!this.ruleForm.nameZh) {
        this.ruleForm.nameZh = ''
      }
      if (val == 0) {
        this.ruleForm.nameZh = this.ruleForm.nameZh.split('(')[0]
      } else {
        this.ruleForm.nameZh =
          this.ruleForm.nameZh.split('(')[0] +
          '(' +
          this.baseEnum.plugTypeList.find(
            el => el.key === ~~this.ruleForm.plugId
          ).value +
          ')'
      }
    },

    'allData.baseTab.variantEntityList'(val) {
      if (getQueryString('variant')) {
        this.variantEntityList[0] = { ...val[0] }
      }
    },

    variantNum: {
      deep: true,
      immediate: true,
      handler: function(val) {
        if (getQueryString('variant') && val[0] && val[0].variant) {
          this.$set(
            this.variantEntityList,
            0,
            JSON.parse(JSON.stringify(val[0].variant))
          )
          return
        }
        this.variantEntityList = val.map(el => el.variant)
        // if (val.length == this.variantEntityList.length) {
        //   val.map((el, index) => {
        //     if (
        //       !this.variantEntityList[index].sku ||
        //       !this.variantEntityList[index].skuCustom
        //     ) {
        //       Vue.set(this.variantEntityList, index, {
        //         ...(this.allData.baseTab.variantEntityList[index] || {
        //           productId: null,
        //           parentProductId: null,
        //           merchantId: 1
        //         }),
        //         sku: this.variantTab.productVariantList[index].variant.sku,
        //         skuCustom: this.variantTab.productVariantList[index].variant
        //           .skuCustom
        //       })
        //     }
        //   })
        //   return
        // } else if (val.length > this.variantEntityList.length) {
        //   val.map((el, index) => {
        //     if (index < this.variantEntityList.length) {
        //       return
        //     } else {
        //       Vue.set(this.variantEntityList, index, {
        //         ...(this.allData.baseTab.variantEntityList[index] || {
        //           productId: null,
        //           parentProductId: null,
        //           merchantId: 1
        //         }),
        //         sku: this.variantTab.productVariantList[index].variant.sku,
        //         skuCustom: this.variantTab.productVariantList[index].variant
        //           .skuCustom
        //       })
        //     }
        //   })
        // } else {
        //   this.variantEntityList.length = val.length
        // }
      }
    },
    categoryId() {
      // this.getVariantData();
      this.getProperties()
      this.ruleForm = {}
      if (!getQueryString('productId')) {
        this.getSku()
      }
    },

    // 绑定动态字段
    renderedField: {
      immediate: true,
      handler: function(val) {
        if (!val) {
          return
        }
        console.log(val)
        let reverses = val.inputArrs.sort((a, b) => {
          let m, n
          if (isArray(a)) {
            m = a[0].propertySort
          } else {
            m = a.propertySort
          }
          if (isArray(b)) {
            n = b[0].propertySort
          } else {
            n = b.propertySort
          }
          return m - n
        })
        this.inputArrs = reverses
        this.variants = val.variants

        this.rules = val.vali
      }
    },

    // 监控basetab数据渲染到初始ruleForm
    ['allData.baseTab']: {
      immediate: true,
      // deep: true,
      handler(val) {
        if (!this.$attrs.edit) {
          return
        }
        // debugger;
        this.ruleForm = val.productEntity
      }
    },

    ['allData.variantTab.productVariantList']: {
      immediate: true,
      handler(val) {
        let vm = this
        if (!val) {
          return
        }
        val.forEach((el, i) => {
          if (vm.variantEntityList[i]) {
            vm.variantEntityList[i].skuCustom = val[i].variant.skuCustom
          }
        })
      }
    }
  },
  computed: {
    // 最终提交表单的数据集合
    baseTab() {
      // 设置母体的提交数据
      let productEntity = Object.assign({}, this.ruleForm, {
        platformIds:
          this.ruleForm &&
          this.ruleForm.platformIds &&
          typeof this.ruleForm.platformIds != 'string'
            ? this.ruleForm.platformIds.join(';')
            : null,
        sourceType:
          this.ruleForm.sourceType != null ? this.ruleForm.sourceType : 1,
        categoryId: this.categoryId,
        categoryDetail: this.catelogy.categoryDetail // 用来显示类目层次的字段
      })
      for (const key in productEntity) {
        if (productEntity.hasOwnProperty(key)) {
          const element = productEntity[key]
          if (key.indexOf('_') > -1) {
            delete productEntity[key]
          }
        }
      }

      // 提交时插入空字符
      if (!this.$attrs.edit) {
        this.variantEntityList.map(elMain => {
          this.variants.map(el => {
            if (el.displayKey === 'sku') {
              return
            }
            if (elMain[el.displayKey] != null) {
              return
            }
            if (el.dateType === 2) {
              elMain[el.displayKey] = ''
            } else {
              elMain[el.displayKey] = 0
            }
          })
        })
      }

      return {
        variantEntityList: this.variantEntityList,
        productEntity,
        propertyEntityList: this.propertyEntityList
      }
    },

    allData() {
      return this.$attrs.allData
    },

    categoryId() {
      return this.$attrs.catelogy.categoryId
    },

    catelogy() {
      return this.$attrs.catelogy
    },

    variantNum() {
      let ret
      // debugger
      try {
        if (getQueryString('variant')) {
          ret = this.$attrs.data.variantEntityList.map(el => ({ variant: el }))
          // 变体编辑模式
          // ret = [];
        } else {
          // 母体编辑模式
          ret = this.$attrs.allData.variantTab.productVariantList
        }
      } catch (e) {
        ret = []
      }
      return ret
    },

    variantTab() {
      return this.$attrs.allData.variantTab
    },

    // 根据根组件的动态字段来渲染表单
    renderedField() {
      let ret
      // debugger;
      try {
        ret = this.$attrs.formatField.productTabField
      } catch (e) {
        ret = null
      }
      return ret
    }
  }
}
</script>

<style lang="less">
// .vue-tabs .tab-content .tab-container .product_box.ant-card .ant-card-body {
//   height: calc(100% - 115px);
// }
</style>

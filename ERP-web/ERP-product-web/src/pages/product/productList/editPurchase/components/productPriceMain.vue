<template>
  <v-spin :tip="'正在读取数据.'" :spinning="spinning" class="purchase_box">
    <!-- {{ruleForm}} -->
    <productPrice
      :auditDataList="auditDataList"
      :priceUnit="priceUnit"
      :unit.sync="unit"
      v-bind="$attrs"
      :variantTab="variantTab"
      v-on="$listeners"
      :senddata.sync="parentDataMain"
      :ruleform="parentDataMain"
      type="1"
      ref="ruleform"
      :variantForm="ruleForm"
      :productSupplierPriceEntityList.sync="productSupplierPriceEntityList"
    ></productPrice>

    <div class="saveBtn" v-if="!$attrs.type && !$attrs.show && !isVariant">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="save" :loading="saveLoading">保存</v-button>
        <v-button type="primary" v-if="!$attrs.show && !isVariant" @click.prevent="submit" :loading="commitLoading">提交</v-button>
      </div>
    </div>
  </v-spin>
</template>

<script>
import productPrice from './productPrice.vue'
import {
  fetchData,
  handlerCode,
  showToast,
  toParamUrl,
  showConfirm,
  batchValidForm
} from 'common/common'
import { getQueryString, isEmptyObject, isObj } from 'common/util'
import _cloneDeep from 'lodash/cloneDeep'
import bus from 'common/bus'

import apis from 'apis'
export default {
  custom: 'productPrice',
  name: 'productPriceMain',
  inheritAttrs: false,
  components: {
    productPrice
  },
  data() {
    return {
      name: 'productPrice',
      auditDataList: [],
      spinning: false,
      keywords: [],
      saveLoading: false,
      commitLoading: false,
      unit: 'USD',
      priceUnit: [],
      originData: null,
      parentDataMain: {}, // 母体基本字段
      parentDataSub: {}, // 母体差异字段
      productSupplierPriceEntityList: [
        {
          numStart: '',
          numEnd: '',
          supplierPriceUnit: '',
          purchaseFreightUnit: '',
          supplierPrice: '',
          purchaseFreight: ''
        }
      ],
      ruleForm: {}, //
      priceTab: {
        variantPriceList: [],
        parentPriceMap: {
          productPriceEntity: {},
          productPriceRelEntityList: []
        }
      }, // 新数据
      priceTabOld: {} // 获取到的服务器数据
    }
  },
  created() {
    this.getPriceUnits()
    let vm = this
    let id = +this.catelogy.categoryId
    this.isVariant = getQueryString('variant')
    let productId = +getQueryString('productId')
    this.isReview = getQueryString('review')
    // if (this.isVariant) {
    //   productId = +getQueryString("parentId")
    // }

    this.productId = productId
    // 获取数据
    this.spinning = true
    fetchData({
      ...apis.PRODUCT_PRICE_PARENT_TAB,
      data: {
        productId: productId,
        flag: this.isReview ? 1 : 0,
        parentFlag: this.isVariant ? 0 : 1
      }
    }).then(res => {
      this.spinning = false
      if (res.data.code === 0) {
        delete res.data.code
        if (
          res.data.parentPriceMap.productSupplierPriceEntityList &&
          res.data.parentPriceMap.productSupplierPriceEntityList.length
        ) {
          vm.productSupplierPriceEntityList =
            res.data.parentPriceMap.productSupplierPriceEntityList

          res.data.parentPriceMap.productPriceEntity.supplierPrice = 123123
        }
        if (
          res.data.parentPriceMap.productPriceEntity.priceNowUnit == null ||
          res.data.parentPriceMap.productPriceEntity.priceNowUnit === ''
        ) {
          res.data.parentPriceMap.productPriceEntity.priceNowUnit = vm.unit
        }
        if (
          res.data.parentPriceMap.productPriceEntity.priceOriginalUnit ==
            null ||
          res.data.parentPriceMap.productPriceEntity.priceOriginalUnit === ''
        ) {
          res.data.parentPriceMap.productPriceEntity.priceOriginalUnit = vm.unit
        }
        if (
          res.data.parentPriceMap.productPriceEntity.taxPriceUnit == null ||
          res.data.parentPriceMap.productPriceEntity.taxPriceUnit === ''
        ) {
          res.data.parentPriceMap.productPriceEntity.taxPriceUnit = vm.unit
        }

        // 注入审核提示

        // res.data.parentPriceMap.productPriceEntity.reviewData = res.data
        //   .parentChangeMap || {
        //   parentPriceChangeMap: {}
        // };
        this.auditDataList = res.data.auditDataList

        vm.$set(vm.ruleForm, 'main', {
          ...res.data.parentPriceMap.productPriceEntity,
          edit: false,
          productPriceRelEntityList: res.data.parentPriceMap
            .productPriceRelEntityList.length
            ? res.data.parentPriceMap.productPriceRelEntityList
            : [
                {
                  productPriceId: vm.parentDataSub.productPriceId,
                  numStart: 1,
                  numEnd: '',
                  sharePrice: '',
                  sharePriceUnit: vm.unit,
                  sort: null,
                  edit_numStart: false,
                  edit_numEnd: false,
                  edit_sharePrice: false
                }
              ]
        })
        res.data.variantPriceList.map(els => {
          let _variant = vm.variantTab.find(
            el => el.variant.productId === els.productPriceEntity.productId
          ).variant
          const { sku, skuCustom, activateFlag } = _variant
          if (activateFlag === 0) {
            return
          }

          vm.$set(vm.ruleForm, sku, {
            ...els.productPriceEntity,
            // 审核提示
            reviewData: res.data.variantChangeMap
              ? res.data.variantChangeMap[sku]
              : {},
            skuCustom,
            edit: false,
            productPriceRelEntityList: els.productPriceRelEntityList.length
              ? els.productPriceRelEntityList
              : [
                  {
                    productPriceId: els.productPriceEntity.productPriceId,
                    numStart: 1,
                    numEnd: '',
                    sharePrice: '',
                    sharePriceUnit: this.unit,
                    edit_numStart: false,
                    edit_numEnd: false,
                    edit_sharePrice: false,
                    sort: null
                  }
                ],
            productPriceEntity: {
              productId: els.productPriceEntity.productId,
              productPriceId: els.productPriceEntity.productPriceId
            }
          })
        })

        this.originData = JSON.stringify(this.getOriginData())
      } else {
        showToast('error', res.data.msg)
      }
    })
  },
  methods: {
    getOriginData() {
      return this.getPriceTabData()
    },
    // 获取价格单位列表
    getPriceUnits() {
      this.spinning = true
      fetchData({
        ...apis.GLOBAL_UNIT_ITEM_LIST,
        method: 'get',
        params: {}
      }).then(res => {
        this.spinning = false
        if (res.data.code === 0) {
          this.priceUnit = res.data.rows.map(el => ({ label: el, value: el }))
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 表单验证
    async submitForm() {
      let forms = [this.$refs.ruleform]

      return await batchValidForm(forms)
    },

    // 保存供应商
    saveSupp() {
      let datas = this.ruleForm
      let ret = []
      if (this.parentDataMain.radio || this.parentDataSub.radio) {
        fetchData({
          ...apis.PRODUCT_SUPPLIER_REL_UPDATE,
          data: {
            productSupplierRelId:
              this.parentDataMain.radio || this.parentDataSub.radio
          }
        }).then(res => {})
      }

      for (const key in datas) {
        if (datas.hasOwnProperty(key)) {
          const element = datas[key]
          if (!element.radio) {
            return
          }
          fetchData({
            ...apis.PRODUCT_SUPPLIER_REL_UPDATE,
            data: {
              productSupplierRelId: element.radio
            }
          }).then(res => {
            ret.push(res.data)
          })
        }
      }
    },

    getPriceTabData() {
      let variantPriceList = []
      let parentPriceMap = {}
      let data = this.$refs.ruleform ? this.$refs.ruleform.ruleForm : {}
      let productPriceEntity = _cloneDeep(data.main)

      // 提取变体字段
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (key === 'main') {
            continue
          }

          let { productPriceRelEntityList } = element
          let productPriceEntity = _cloneDeep(element)
          delete productPriceEntity.productPriceRelEntityList
          delete productPriceEntity.productPriceEntity

          if (
            !productPriceRelEntityList[0].numStart ||
            !productPriceRelEntityList[0].numEnd ||
            !productPriceRelEntityList[0].sharePrice
          ) {
            variantPriceList.push({
              productPriceRelEntityList: [],
              productPriceEntity
            })
          } else {
            variantPriceList.push({
              productPriceRelEntityList,
              productPriceEntity
            })
          }
        }
      }

      // 提取母体字段
      const productPriceRelEntityList = _cloneDeep(
        productPriceEntity.productPriceRelEntityList
      )
      delete productPriceEntity.productPriceRelEntityList
      parentPriceMap.productPriceEntity = productPriceEntity
      if (
        !productPriceRelEntityList[0].numStart ||
        !productPriceRelEntityList[0].numEnd ||
        !productPriceRelEntityList[0].sharePrice
      ) {
        parentPriceMap.productPriceRelEntityList = []
      } else {
        parentPriceMap.productPriceRelEntityList = productPriceRelEntityList
      }

      return {
        variantPriceList,
        parentPriceMap
      }
    },

    // 验证敏感关键词
    setKeywords(data) {
      let vm = this
      // let arr = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (isObj(element)) {
            vm.setKeywords(element)
          } else {
            if (
              key === 'titleEn' ||
              key === 'entryNameEn' ||
              key === 'entryNameZh'
            ) {
              vm.keywords.push(element)
            }
          }
        }
      }
    },

    async validKeyword(data) {
      this.setKeywords(data)
      let valis = await fetchData({
        ...apis.PRODUCT_KEY_WORD_VERIFY_1,
        data: { word: this.keywords.join(';') }
      })

      if (Object.keys(valis.data).length > 1) {
        let str = ``
        for (const key in valis.data) {
          if (valis.data.hasOwnProperty(key)) {
            const element = valis.data[key]
            if (key === 'code') {
              continue
            }
            str += key + ' ' + element
          }
        }
        return str
      } else {
        return null
      }
    },

    // 保存
    async save() {
      const deletePriceRelIds = this.$refs.ruleform.deletePriceRelIds
      let vm = this
      this.saveLoading = true
      bus.$emit('product.purchaseMain.loading', {
        spinning: true,
        loadingTip: '保存数据中...'
      })
      // this.saveSupp();
      let productId = +getQueryString('productId')
      if (getQueryString('variant')) {
        productId = +getQueryString('parentId')
      }
      let data = {
        productId,
        deletePriceRelIds,
        priceTab: this.getPriceTabData()
      }
      let res = await this.validKeyword(data)

      if (res) {
        showConfirm({
          title: '存在敏感关键词 ' + res + ',是否继续？',
          onOk() {
            this.save1(data)
          }
        })
        return
      }
      return this.save1(data)
    },

    save1(data) {
      const deletePriceRelIds = this.$refs.ruleform.deletePriceRelIds
      let vm = this
      this.saveLoading = true
      bus.$emit('product.purchaseMain.loading', {
        spinning: true,
        loadingTip: '保存数据中...'
      })
      let productId = +getQueryString('productId')
      if (getQueryString('variant')) {
        productId = +getQueryString('parentId')
      }
      return fetchData({
        ...apis.PRODUCT_PRICE_SAVE,
        data
      }).then(res => {
        this.saveLoading = false
        bus.$emit('product.purchaseMain.loading', { spinning: false })

        if (res.data.code === 0) {
          showToast('success', '保存成功')
          // 刷新共享价
          fetchData({
            ...apis.PRODUCT_PRICE_REL_LIST,
            data: {
              productId: vm.productId
            }
          }).then(res => {
            if (res.data.code !== 0) {
              showToast('error', res.data.msg)
              return
            }
            const {
              parentPriceMap: { productPriceRelEntityList },
              variantPriceList
            } = res.data
            // debugger;
            let ruleForm = vm.$refs.ruleform.ruleForm
            ruleForm.main.productPriceRelEntityList = productPriceRelEntityList.length
              ? productPriceRelEntityList
              : [
                  {
                    numStart: 1,
                    numEnd: '',
                    sharePrice: '',
                    sharePriceUnit: this.unit,
                    edit_numStart: false,
                    edit_numEnd: false,
                    edit_sharePrice: false,
                    sort: null
                  }
                ]
            variantPriceList.forEach(element => {
              const id = element.productId
              const _list = element.productPriceRelEntityList
              for (const key in ruleForm) {
                if (ruleForm.hasOwnProperty(key)) {
                  const _element = ruleForm[key]
                  if (key === 'main') {
                    continue
                  }
                  if (_element.productId === id) {
                    _element.productPriceRelEntityList = _list.length
                      ? _list
                      : [
                          {
                            numStart: 1,
                            numEnd: '',
                            sharePrice: '',
                            sharePriceUnit: this.unit,
                            edit_numStart: false,
                            edit_numEnd: false,
                            edit_sharePrice: false,
                            sort: null
                          }
                        ]
                  }
                }
              }
            })

            vm.originData = JSON.stringify(vm.getOriginData())
          })
        } else {
          showToast('error', res.data.msg)
        }
        return res
      })
    },

    async submit() {
      const deletePriceRelIds = this.$refs.ruleform.deletePriceRelIds
      // this.saveSupp();
      let productId = +getQueryString('productId')
      if (getQueryString('variant')) {
        productId = +getQueryString('parentId')
      }

      if (await this.submitForm()) {
        let data = {
          productId,
          deletePriceRelIds,
          priceTab: this.getPriceTabData()
        }
        this.commitLoading = true
        fetchData({
          ...apis.PRODUCT_PURCHASE_COMMIT,
          data: {
            productId,
            deletePriceRelIds,
            type: 'price',
            priceTab: this.getPriceTabData()
          }
        }).then(res => {
          this.commitLoading = false
          // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

          if (res.data.code === 0) {
            showToast('success', '提交成功')
            toParamUrl('/product/productList.html')
          } else {
            showToast('error', res.data.msg)
            this.$emit('toggle-tab')
          }
        })
      } else {
        showToast('error', '请填写完整正确的表单项')
      }
    }
  },
  watch: {
    // 监控母体的输入字段
    parentData(val) {
      try {
        let res = Object.assign(
          {},
          this.priceTabOld.parentPriceMap.productPriceEntity,
          val
        )
        this.priceTab.parentPriceMap.productPriceEntity = res
      } catch (e) {
        this.priceTab.parentPriceMap.productPriceEntity = val
      }
    },

    // // 监控变体的输入字段组
    // ruleForm: {
    //   deep: true,
    //   handler: function(val) {
    //     console.log(val);
    //     let vm = this;
    //     let variantPriceList = [];
    //     for (const key in val) {
    //       if (val.hasOwnProperty(key)) {
    //         const el = val[key];
    //         const _variant = vm.variantTab.find(el => el.variant.sku === key);
    //         const productId =
    //           _variant && _variant.variant && _variant.variant.productId;
    //         if (productId == null) {
    //           continue;
    //         }
    //         let variant = vm.priceTabOld.variantPriceList.find(
    //           el => el.productPriceEntity.productId === productId
    //         ).productPriceEntity;

    //         variantPriceList.push({
    //           productPriceRelEntityList: [],
    //           productPriceEntity: { ...variant, ...el }
    //         });

    //         // if (variant) {
    //         //   variantPriceList.push({
    //         //     productPriceRelEntityList: [],
    //         //     productPriceEntity: { ...variant, ...el }
    //         //   });
    //         // }
    //       }
    //     }
    //     vm.priceTab.variantPriceList = variantPriceList;
    //   }
    // },

    // 监控提交到服务器的字段，直接输出到根组件
    // priceTab: {
    //   deep: true,
    //   handler: function(val) {
    //     this.$emit("update:data", val);
    //   }
    // },

    variantTab(val) {
      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key]
          if (isEmptyObject(element)) {
            val.map(el => {
              this.$set(this.ruleForm, el.variant.sku, {})
            })
          }
        }
      }
      // val.map(el => {
      //   this.$set(this.ruleForm, el.variant.sku, {});
      // });
    }
  },
  computed: {
    variantTab() {
      return this.$attrs.allData.variantTab.productVariantList
    },

    // 获取所有母体字段
    parentData() {
      return { ...this.parentDataMain, ...this.parentDataSub }
    },

    catelogy() {
      return this.$attrs.category
    }
  }
}
</script>

<style lang="less">
.saveBtn {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 0;
  left: 126px;
  background: #f7f7f7;
  z-index: 222;
  padding: 8px;
  box-sizing: border-box;
  button {
    width: 160px;
  }
}
</style>

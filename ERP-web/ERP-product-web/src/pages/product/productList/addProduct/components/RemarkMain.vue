<template>
  <v-spin tip="加载中..." :spinning="spinning" style="height:100%" class="remark" ref="content">
    <Remark
      v-bind="$attrs"
      v-on="$listeners"
      :sku="getSKU"
      isParent="1"
      @change="setParentDiffer"
      :auditDataList="auditDataList"
      :variantForm="ruleForm"
      ref="parentBase"
    ></Remark>
    <div class="saveBtn" v-if="!$attrs.show">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="save" :loading="saveBtnLoading">保存</v-button>
        <v-button
          type="primary"
          v-if="!$attrs.show && !variantMode"
          @click.prevent="submit"
          :loading="submitBtnLoading"
        >提交</v-button>
      </div>
    </div>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import Remark from './Remark.vue'
import { fetchData, showToast, toParamUrl } from 'common/common'
import { isArray, getQueryString } from 'common/util'
import apis from 'apis'
export default {
  customName: 'Remark',
  inheritAttrs: false,
  props: ['data'],
  components: {
    Remark
  },
  created() {
    this.productId = +getQueryString('productId')
    this.isReview = +getQueryString('review')
    if (getQueryString('variant')) {
      this.variantMode = true
    }
    this.getInitData()
  },
  // mounted() {
  //   // 如果是编辑页
  //   if (this.$attrs.edit) {
  //     this.ruleForm = this.$attrs.remarkTab;
  //   }
  //   // 如果是变体编辑页
  //   if (getQueryString("variant")) {
  //     let {
  //       parentProductRemark,
  //       childProductRemarkList
  //     } = this.$attrs.remarkTab;
  //     this.ruleForm = {
  //       productParentRemark: parentProductRemark,
  //       productVariantRemarkMap: childProductRemarkList[0]
  //     };
  //   }
  // },
  data() {
    return {
      spinning: true,
      submitBtnLoading: false,
      saveBtnLoading: false,
      variantMode: false,
      show: this.$attrs.show,
      defaultMsg: '',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },

      auditDataList: [],

      ruleForm: {},
      rangeTime: '',
      upload: {
        name: 'file',
        action: '/upload'
      },
      originData: '',
      rules: {},
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },

      inputArrs: [], //基础属性字段
      variants: [], // 变体差异字段
      // productVariantRemarkMap: {}, // 存储变体数据

      remarkTab: {
        // 最终要提交的数据
        productVariantRemarkMap: {},
        productParentRemark: {}
      }
    }
  },
  methods: {
    getInitData() {
      let vm = this
      // 获取备注信息
      fetchData({
        ...apis.PRODUCT_REMARK_PARENT_BASE_TAB,
        data: {
          flag: vm.isReview ? 1 : 0,
          productId: vm.productId,
          parentFlag: vm.variantMode ? 0 : 1
        }
      }).then(res => {
        this.spinning = false
        if (res.data && res.data.code === 0) {
          const data = res.data
          const {
            productParentRemark,
            productVariantRemarkMap,
            childProductRemarkList,
            parentProductRemark,
            auditDataList
          } = data

          // 审核提示
          this.auditDataList = auditDataList || []

          if (productParentRemark) {
            // 母体
            if (productParentRemark.saleTimeStart) {
              productParentRemark.saleTime = [
                productParentRemark.saleTimeStart,
                productParentRemark.saleTimeEnd
              ]
            } else {
              productParentRemark.saleTime = ''
            }
            vm.$set(vm.ruleForm, 'main', productParentRemark)
            for (const key in productVariantRemarkMap) {
              if (productVariantRemarkMap.hasOwnProperty(key)) {
                // debugger;
                const _variant = vm.variantList.find(
                  el => el.variant.sku === key
                )
                const { skuCustom } = _variant.variant
                const element = productVariantRemarkMap[key]
                if (element.saleTimeStart) {
                  element.saleTime = [
                    element.saleTimeStart,
                    element.saleTimeEnd
                  ]
                } else {
                  element.saleTime = ''
                }
                vm.$set(vm.ruleForm, key, {
                  ...element,
                  skuCustom,
                  edit: false
                })
              }
            }
          } else {
            // 变体
            if (parentProductRemark.saleTimeStart) {
              parentProductRemark.saleTime = [
                parentProductRemark.saleTimeStart,
                parentProductRemark.saleTimeEnd
              ]
            } else {
              parentProductRemark.saleTime = []
            }
            vm.$set(vm.ruleForm, 'main', parentProductRemark)

            childProductRemarkList.forEach(list => {
              const _variant = vm.$attrs.allData.baseTab.variantEntityList.find(
                el => el.productId === list.productId
              )
              // debugger

              const { skuCustom, sku: key } = _variant
              const element = list
              if (element.saleTimeStart) {
                element.saleTime = [element.saleTimeStart, element.saleTimeEnd]
              } else {
                element.saleTime = ''
              }
              vm.$set(vm.ruleForm, key, {
                ...element,
                skuCustom,
                edit: false
              })
            })
          }

          setTimeout(() => {
            setTimeout(() => {
              vm.$nextTick(() => {
                vm.originData = vm.getSavedData()
              })
            }, 200)
          })
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    // 上传文件监听事件
    onUploadChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        showToast('success', info.file.name + ' 上传成功.')
      } else if (info.file.status === 'error') {
        showToast('warning', info.file.name + ' 上传失败.')
      }
    },

    // 设置母体字段
    setParentDiffer(val) {
      console.log(val)
      Vue.set(
        this.remarkTab,
        'productParentRemark',
        Object.assign({}, this.remarkTab.productParentRemark, val)
      )
    },

    // 设置变体字段
    setSubDiffer(sku, val) {
      let data = {
        ...this.remarkTab.productVariantRemarkMap[sku],
        ...val
      }
      console.log(data)
      let updateData = { ...this.remarkTab.productVariantRemarkMap }
      updateData[sku] = data
      this.$set(this.remarkTab, 'productVariantRemarkMap', updateData)

      // this.$set(this.remarkTab.productVariantRemarkMap, sku, data);
    },

    save() {
      this.formSubmit()
    },

    // 提交到服务器
    async submit() {
      this.submitBtnLoading = true
      let res = await this.sendToSave(2)
      this.submitBtnLoading = false
      if (res.data.code === 0) {
        showToast('success', '提交成功')
        toParamUrl('/product/productList.html')
      } else {
        showToast('error', res.data.msg || '服务器错误')
      }
    },

    // 保存服务器api
    async sendToSave(type) {
      let api
      if (type == 1) {
        api = apis.PRODUCT_REMARK_SAVE
      } else {
        api = apis.PRODUCT_BASE_COMMIT
      }
      let baseTab = JSON.parse(sessionStorage.getItem('baseTab'))
      if (!baseTab && !getQueryString('productId')) {
        let sku
        baseTab = {
          variantEntityList: [
            {
              productId: null,
              parentProductId: null,
              merchantId: 1,
              sku: '',
              skuCustom: '',
              brand: '',
              productSpecification: '',
              searchKeyword: '',
              modelId: 0
            },
            {
              productId: null,
              parentProductId: null,
              merchantId: 1,
              sku: '',
              skuCustom: '',
              brand: '',
              productSpecification: '',
              searchKeyword: '',
              modelId: 0
            }
          ],
          productEntity: {
            sku: null,
            platformIds: '',
            shareFlag: 0,
            variantFlag: 0,
            overseaFlag: 0,
            photoFlag: 0,
            plugFlag: 0,
            productType: 1,
            modelId: 0,
            sourceType: 1
          },
          propertyEntityList: []
        }

        if (this.$attrs.parentSKU) {
          sku = this.$attrs.parentSKU
        } else {
          let res = await this.getOneSku()
          sku = res.data.skuList[0]
          this.$emit('update:sku', res.data.skuList[0])
        }

        baseTab.productEntity.sku = sku
        baseTab.productEntity.categoryId = this.$attrs.catelogy.categoryId
        baseTab.productEntity.categoryDetail = this.$attrs.catelogy.categoryDetail

        Object.keys(this.remarkTab.productVariantRemarkMap).map((el, i) => {
          baseTab.variantEntityList[i].sku = el
        })
      }

      // 把多选转化为字符
      let res = await fetchData({
        ...api,
        data: this.getData()
      })
      return res
    },

    getData() {
      let datas = this.$refs.parentBase.ruleForm
      let { main, ...variants } = datas
      const ret = {
        productId: this.productId,
        productParentRemark: {},
        productVariantRemarkMap: {}
      }
      ret.productParentRemark = main
      ret.productVariantRemarkMap = variants

      return ret
    },

    getSavedData() {
      return JSON.stringify(this.getData())
    },

    // 获取产品的sku
    async getOneSku() {
      return await fetchData({
        ...apis._PRODUCT_SKU_GET,
        data: {
          num: 1
        }
      })
      // .then(res => {
      //   this.$emit("update:sku", res.data.skuList[0]);
      // });
    },

    // 保存到服务器
    async formSubmit() {
      this.saveBtnLoading = true
      let res = await this.sendToSave(1)
      this.saveBtnLoading = false
      if (res.data.code === 0) {
        this.originData = this.getSavedData()
        if (!getQueryString('productId')) {
          toParamUrl('/product/productList/addProduct.html', {
            productId: res.data.productId
          })
        }
        showToast('success', '保存成功')
      } else {
        showToast('error', res.data.msg)
      }
    },

    // 表单验证
    async submitForm() {
      let valis = [this.$refs.parentBase.submitForm()]
      return await Promise.all(valis)
    }
  },
  // watch: {
  //   // 监听表单字段输入
  //   ruleForm: {
  //     handler: function(v) {
  //       console.log(v);
  //       // this.remarkTab = v;
  //     },
  //     deep: true
  //   }

  //   // // 初始化日期
  //   // rangeTime: {
  //   //   handler: function(v) {
  //   //     this.ruleForm.saleTimeStart = v[0];
  //   //     this.ruleForm.saleTimeEnd = v[1];
  //   //     console.log(this.ruleForm);
  //   //   },
  //   //   deep: true,
  //   //   immediate: true
  //   // },

  //   // // 监控根组件的变体数量
  //   // variantList: {
  //   //   immediate: true,
  //   //   deep: true,
  //   //   handler: function(val) {
  //   //     if (!val && getQueryString("variant")) {
  //   //       // 变体编辑进来 没有值
  //   //       val = this.$attrs.remarkTab.childProductRemarkList;
  //   //       const variantInfo = this.$attrs.allData.baseTab.variantEntityList[0];

  //   //       this.ruleForm.productVariantRemarkMap = this.remarkTab.productVariantRemarkMap = {
  //   //         [variantInfo.sku]: val[0]
  //   //       };
  //   //     } else {
  //   //       let newObj = {};
  //   //       let productVariantRemarkMap = this.remarkTab.productVariantRemarkMap;
  //   //       val.map(el => {
  //   //         if (productVariantRemarkMap[el.variant.sku]) {
  //   //           newObj[el.variant.sku] = productVariantRemarkMap[el.variant.sku];
  //   //         } else {
  //   //           newObj[el.variant.sku] = {};
  //   //         }
  //   //       });
  //   //       this.remarkTab.productVariantRemarkMap = {};
  //   //       this.remarkTab.productVariantRemarkMap = newObj;
  //   //     }
  //   //   }
  //   // }
  // },
  computed: {
    // 获取变体list
    variantList() {
      let ret
      try {
        ret = this.$attrs.allData.variantTab.productVariantList
      } catch (e) {
        ret = []
      }
      return ret
    },

    // 根据根组件的动态字段来渲染表单
    renderedField() {
      return this.$attrs.formatField.remarkTabFied
    },

    // 获取母体sku
    getSKU() {
      return this.$attrs.parentSKU
    },

    // 父组件的值（其它tab页编辑的值）
    variantTab() {
      // 产品变体
      return this.$attrs.allData.variantTab
    },
    baseTabOrigin() {
      // 基本信息
      return this.$attrs.allData.baseTab
    },
    baseTab() {
      let ret = Object.assign({}, this.baseTabOrigin)
      if (isArray(ret.productEntity && ret.productEntity.platformIds)) {
        ret.productEntity.platformIds = ret.productEntity.platformIds.join(';')
      }

      return ret
    }
  }
}
</script>

<style lang="less">
.remark {
  .ant-form-inline .ant-form-item {
    margin-bottom: 24px;
  }
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
}
.vue-tabs .tab-content .tab-container .product_box.ant-card .ant-card-body {
  height: calc(100% - 115px);
}
</style>

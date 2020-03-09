<template>
  <div v-if="spinning" class="flex">
    <div style="width:200px">
      <v-progress-line :percent="percent" status="active"></v-progress-line>
      <div style="text-align:center">{{loadingText}}...</div>
    </div>
  </div>
  <v-spin v-else :spinning="spinning" tip="加载中..." style="height:100%" class="product_box">
    <el-tabs
      ref="tab"
      :tab-position="'left'"
      :style="tabStyle"
      type="border-card"
      v-model="name"
      class="info____tab"
      lazy
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :label="item.title"
        :key="item.title"
        :name="item.title"
        class="product_box"
      >
        <keep-alive>
          <!-- 亚马逊 -->
          <el-tabs
            v-if="platformId == 1"
            ref="tabs"
            style="height: 100%"
            type="card"
            v-model="activeKey"
            lazy
            class="product_box"
            @tab-click="handleTabClick"
          >
            <el-tab-pane
              :label="item.nameCn"
              :key="item.nameCn"
              :name="item.nameCn"
              v-for="(item, index) in properties"
              v-if="properties.length"
              ref="tab"
            >
              <template slot="label">
                <span>{{item.nameCn}}</span>
                <el-tooltip placement="top" :open-delay="500">
                  <div slot="content">
                    <p>{{item.descCn}}</p>
                    <p>{{item.descEn}}</p>
                  </div>
                  <i class="el-icon-info editlists_info_icon"></i>
                </el-tooltip>
              </template>
              <PurchaseInputNew
                direction="horizontal"
                :rules="{}"
                :data="item.properties"
                :labelcol="{span:6}"
                :wrappercol="{span:14}"
                :bind-field="bindField"
                ref="purchaseinput"
                :disabled="isShow"
              ></PurchaseInputNew>
            </el-tab-pane>
          </el-tabs>
          <!-- ebay -->
          <LangForms
            v-else-if="platformId == 2"
            :platformId="platformId"
            :productId="productId"
            :productType="productType"
            :isVariant="!productType"
            :review="isShow"
          />
          <!-- wish -->
          <WishLangForms
            ref="wishForm"
            v-else-if="platformId == 5"
            :platformId="platformId"
            :productId="productId"
            :productType="productType"
            :isVariant="!productType"
            :review="isShow"
            :tabs="properties"
          />
        </keep-alive>
        <v-button type="primary" v-if="publicInfo.platformFlag && !isShow" @click="apply" class="btn">一键应用平台信息</v-button>
      </el-tab-pane>
    </el-tabs>

    <div class="saveBtn" v-if="!isShow && platformId == 1">
      <div style="margin: 0 auto">
        <v-button type="primary" @click.prevent="submit" :loading="btnLoading">提交</v-button>
      </div>
    </div>
  </v-spin>
</template>

<script>
import { getQueryString } from 'common/util'
import {
  fetchData,
  showToast,
  _storage,
  toParamUrl,
  batchValidForm,
  showConfirm
} from 'common/common'
import apis from 'apis'
import PurchaseInput from 'components/base/purchaseInput'
import PurchaseInputNew from 'components/base/purchaseInputNew'
import { Tabs, TabPane } from 'element-ui'
import Vue from 'vue'
// 引入ebay组件
import LangForms from '@/pages/product/platformList/ebayEditLists/components/EbayLangForms.vue'
import WishLangForms from '@/pages/product/platformList/ebayEditLists/components/WishLangForms.vue'

Vue.use(Tabs)
Vue.use(TabPane)
export default {
  components: {
    PurchaseInput,
    LangForms,
    WishLangForms,
    PurchaseInputNew
  },
  created() {
    let vm = this
    this.productId = +getQueryString('storeProductId')
    this.productType = +getQueryString('productType')
    this.categoryId = +getQueryString('categoryId')
    this.deleteFlag = +getQueryString('deleteFlag')
    this.platformId = +getQueryString('platformId')
    this.isShow = getQueryString('isshow')
    // 获取所有初始化数据
    _storage.remove('session', 'USATime')
    if (this.platformId !== 5) {
      this.getData()
    }else if (this.platformId == 5) {
        this.getWishData()
      }
    
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.percent >= 98) {
        if (this.spinning) {
          clearInterval(this.timer)
          this.timer = null
          return
        }
      }
      if (this.percent >= 100) {
        clearInterval(this.timer)
        this.percent = 0
        this.timer = null
        return
      }
      this.percent += 1
    }, 200)
  },
  computed: {
    loadingText() {
      if (this.percent >= 75) {
        return '加载中'
      }
      if (this.percent >= 50) {
        return '装载数据'
      }
      if (this.percent >= 25) {
        return '初始化模板数据'
      }
      if (this.percent >= 0) {
        return '读取后端资源'
      }
    },
    tabStyle() {
      return { height: '100%', paddingBottom: this.platformId == 1 ? '49px' : 0 }
    }
  },
  data() {
    return {
      percent: 0,
      spinning: true,
      activeKey: '基本',
      bindField: {
        label: 'propertyName',
        value: 'value',
        bindval: 'propertyName',
        type: 'dataType',
        inputType: 'controlType',
        required: 'mustFlag'
      },
      name: '英语',
      tabs: [
        {
          title: '英语'
        }
      ],

      productId: '',
      productType: 0,

      ruleForm: {},

      properties: [],
      publicInfo: {},

      btnLoading: false
    }
  },
  methods: {
    getWishData() {
      let vm = this
      fetchData({
        ...apis.storeProductListGroup,
        data: {}
      }).then(res => {
        vm.percent = 100
        setTimeout(() => {
          clearInterval(vm.timer)
          vm.timer = null
          vm.spinning = false
        }, 500)
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        this.properties = res.data.groups
      })
    },

    getData() {
      let vm = this
      fetchData({
        ...apis.STORE_PRODUCT_INFO,
        data: {
          productId: this.productId,
          groupCode: 0,
          platformId: this.platformId,
          productType: this.productType,
          editFlag: !this.isShow,
          deleteFlag: this.deleteFlag
        }
      }).then(res => {
        vm.percent = 100
        setTimeout(() => {
          clearInterval(vm.timer)
          vm.timer = null
          vm.spinning = false
        }, 500)
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        if (res.data.code === 0) {
          // res.data.rows.properties.forEach(el => {})
          this.properties = res.data.rows.properties
          this.activeKey =
            res.data.rows.properties[0] && res.data.rows.properties[0].nameCn
          this.publicInfo = res.data.rows.publicInfo
        }
      })
    },
    handleTabClick(tab, event) {
      setTimeout(() => {
        this.$nextTick(() => {
          tab.$el.parentNode.scrollTop = 0
        })
      })
    },
    apply() {
      let vm = this
      showConfirm({
        title: '提示',
        content: '是否应用平台信息的字段值?',
        onOk() {
          // 应用平台信息

          vm.$refs.purchaseinput.forEach(element => {
            // element.applyVal()
            element.$refs.ruleForm.$children.forEach(com => {
              com.applyVal && com.applyVal()
            })
          })
        }
      })
    },
    async formValid() {
      let vm = this
      let forms = this.$refs.purchaseinput
      // table表格表单
      // let tableForms = forms[0].$refs.PurchaseTable[0].$refs.form
      let tableForms = {}
      forms.forEach((form, index) => {
        if (form.$refs.PurchaseTable) {
          tableForms[index] = form.$refs.PurchaseTable[0].$refs.form
        }
      })

      function validForm(form) {
        return new Promise((resolve, reject) => {
          form.validate(valid => {
            if (valid) {
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
      }

      async function getFirstVali() {
        let keys = Object.keys(tableForms)
        let ret = []
        let promises = keys.map(async el => {
          return await validForm(tableForms[el])
        })
        for (const promise of promises) {
          ret.push(await promise)
        }
        return ret
      }

      try {
        let result = await getFirstVali()

        let index = result.findIndex(el => el !== true)
        //
        if (index >= 0) {
          // 验证不通过
          return await [Object.keys(tableForms)[index]]
        } else {
          return await batchValidForm(forms, true)
        }
      } catch (error) {}
    },
    // 设置验证位置
    setPosition(index) {
      this.$nextTick(() => {
        let errorFormDom = this.$refs.purchaseinput[index].$el
        let errorInputDom = errorFormDom.querySelectorAll(
          '.ant-form-item-control.has-error'
        )[0]
        let errorBounding = errorInputDom.getBoundingClientRect()
        let { top } = errorBounding
        errorFormDom.parentNode.parentNode.scrollTop = top - 300
      })
    },
    async submit() {
      let valid = await this.formValid()

      if (valid.length > 0) {
        // 验证不通过
        showToast('warning', '请填写必填项')
        this.setPosition(valid[0])
        this.activeKey = this.properties[valid[0]].nameCn
        return
      }
      this.btnLoading = true
      const properties = []
      let arr = []

      this.properties.forEach(el => {
        arr = arr.concat(el.properties)
      })
      arr.forEach(el => {
        const {
          propertyName,
          mustFlag,
          propertyValue,
          value,
          templatePropertyShow,
          tableData,
          dataType,
          values,
          controlType
        } = el

        // debugger
        if (templatePropertyShow === 1) {
          let _propertyValue = []
          propertyValue.forEach(_el => {
            const { variantId, value } = _el
            _propertyValue.push({
              variantId,
              controlType,
              value: value
            })
          })
          properties.push({
            propertyName,
            variantList: _propertyValue,
            propertyValue: value,
            mustFlag,
            controlType
          })
        } else if (templatePropertyShow === 2) {
          // 表格
          const props = tableData[0].props
          props.forEach((el, index) => {
            let ret = {
              propertyName: el.propertyName,
              propertyValue: tableData[0][props[index].propertyName],
              mustFlag: el.mustFlag,
              controlType,
              variantList: []
            }

            values.forEach((__el, __index) => {
              if (__index === 0) {
                return
              }
              ret.variantList.push({
                controlType,
                variantId: __el[index].productId,
                value: tableData.find(el => el.item_sku === __el[0].value)[
                  props[index].propertyName
                ]
              })
            })
            properties.push(ret)
          })
        } else if (templatePropertyShow === 4) {
          // 多行
          values.forEach((el, index) => {
            let ret = { controlType }
            ret.propertyName = el.propertyName
            ret.propertyValue = el.value
            ret.mustFlag = el.mustFlag
            ret.variantList = []
            el.propertyValue.forEach(_el => {
              ret.variantList.push({
                variantId: _el.variantId,
                value: _el.value,
                controlType
              })
            })

            properties.push(ret)
          })
        } else if (templatePropertyShow === 3) {
          // 分组
          // debugger
          let props = values[0]
          props.forEach((el, index) => {
            let ret = {
              propertyName: el.propertyName,
              propertyValue: el.value,
              mustFlag: el.mustFlag,
              controlType,
              variantList: []
            }

            values.forEach((__el, __index) => {
              if (__index === 0) {
                return
              }
              ret.variantList.push({
                variantId: __el[index].productId,
                value: __el[index].value,
                controlType
              })
            })
            properties.push(ret)
          })
        }

        if (propertyValue) {
          // 母体
        } else {
          // 变体
          if (value != null) {
            properties.push({
              propertyName,
              value,
              mustFlag
            })
          }
        }
      })
      //
      fetchData({
        ...apis.STORE_PRODUCT_EDIT,
        data: {
          properties,
          platformId: this.platformId,
          productId: this.productId,
          productType: this.productType
        }
      })
        .then(res => {
          this.btnLoading = false
          if (res.data.code === 0) {
            showToast('success', '提交成功')
            toParamUrl('/product/ShopProducts.html')
          } else {
            showToast('error', res.data.msg)
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },

    applyVal() {
      let inputs = this.$refs.input

      inputs.map(el => {
        el.setVal()
      })
      showToast('success', '应用成功')
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

.bottom-60 {
  display: block;
  width: 100%;
  height: 80px;
}
</style>
<style scoped lang="scss">
.btn {
  position: absolute;
  right: 15px;
  z-index: 99;
  top: 15px;
}
.flex {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>


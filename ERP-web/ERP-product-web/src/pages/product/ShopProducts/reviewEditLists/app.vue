<template>
  <div style="height:100%">
    <el-tabs style="height: 100%;" type="border-card" v-model="name" class="product_box">
      <el-tab-pane
        v-for="(item, index) in mainTabs"
        :label="item.title"
        :key="item.title"
        :name="item.title"
        lazy
        style="height:100%"
      >
        <div v-if="item.src" class="product_box" :loading="loading" ref="card" style="height:100%">
          <iframe :src="item.src" ref="frame" frameborder="0" style="width:100%;height:100%" class="frame"></iframe>
        </div>
        <div class="__review" v-else>
          <v-form direction="horizontal" :model="ruleForm" ref="ruleform">
            <v-row>
              <v-col span="24">
                <v-form-item
                  label="审核"
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  :rules="[{required:true, message: '请选择审核结果'}]"
                  prop="auditType"
                  required
                >
                  <v-radio-group
                    v-model="ruleForm.auditType"
                    :data="[{value: 1, text: '审核通过'},{value: 0, text: '审核不通过'}]"
                  ></v-radio-group>
                </v-form-item>
              </v-col>
              <v-col span="24">
                <v-form-item
                  label="原因"
                  :label-col="labelCol"
                  :wrapper-col="wrapperCol"
                  :required="ruleForm.auditType === 0"
                  :rules="[{required:ruleForm.auditType === 0 ? true : false, message: '请填写不通过的原因'}]"
                  prop="refuseReason"
                >
                  <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder v-model="ruleForm.refuseReason"></v-input>
                </v-form-item>
              </v-col>
              <v-col span="24" style="text-align:center">
                <v-form-item>
                  <v-button type="primary" @click="commit" :loading="loading">确认</v-button>
                </v-form-item>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tabs, TabPane } from 'element-ui'
import { fetchData, handlerCode, toParamUrl } from 'common/common'
import { getQueryString } from 'common/util'
import { loginRedirect } from 'common/config'
import apis from 'apis'

Vue.use(Tabs)
Vue.use(TabPane)

export default {
  data() {
    return {
      loading: false,
      ruleForm: {},
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      src: '',
      // src: "/product/productList/addProduct.html" + window.location.search,
      name: '审核',
      curIndex: 0,
      loading: false,
      mainTabs: [
        {
          title: '基本信息',
          src:
            loginRedirect + '/product/productList/addProduct.html' +
            window.location.search +
            `isshow=true`
        },
        {
          title: '采购编辑',
          src:
            loginRedirect + '/product/productList/editPurchase.html' +
            window.location.search +
            '&type=1&isshow=true'
        },
        {
          title: '平台上架信息',
          src:
            loginRedirect + '/product/ShopProducts/upInfomation.html' +
            window.location.search +
            `&isshow=true`
        },
        {
          title: '图片',
          src:
            loginRedirect + '/product/ShopProducts/imgInfomation.html' +
            window.location.search +
            `&isshow=true&show=true`
        },
        {
          title: '审核'
        }
      ]
    }
  },
  created() {
    this.productId = +getQueryString('storeProductId')
    this.productType = +getQueryString('productType')
  },
  methods: {
    commit() {
      this.$refs.ruleform[0].validate(valid => {
        if (valid) {
          const { auditType, refuseReason } = this.ruleForm
          this.loading = true
          fetchData({
            ...apis.STORE_PRODUCT_AUDIT,
            data: {
              productId: this.productId,
              productType: this.productType,
              auditType,
              refuseReason
            }
          }).then(res => {
            this.loading = false
            handlerCode(res, () => {
              toParamUrl('/product/ShopProducts.html')
            })
          })
        }
      })
    }
  },
  watch: {
    'ruleForm.auditType'(val) {
      this.$nextTick(() => {
        this.$refs.ruleform[0].validate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.__review {
  padding-top: 40px;
}
</style>

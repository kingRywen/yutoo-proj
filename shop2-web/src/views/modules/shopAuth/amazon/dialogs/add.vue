<template>
  <div class="w600">
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value">
      <template slot="formItem" slot-scope="scope">
        <a
          @click="openTips"
          style="font-size:13px"
          class="link"
          href="javascript:void(0)"
          v-if="scope.label == 'MWSAuthToken'"
        >如何获取上述信息</a>
      </template>
    </new-form>
  </div>
</template>
<script>
export default {
  props: ['platformId', 'region', 'info', 'reAuth'],
  data() {
    return {
      formSchema: {
        sellerAlias: {
          disabled: () => this.reAuth,
          label: '店铺名称',
          placeholder: '必填项，自定义店铺名称',
          required: true
        },
        regionCode: {
          disabled: () => this.reAuth,
          label: '开通区域站',
          widget: 'select',
          required: true,
          options: this.region,
          bind: {
            label: 'regionName',
            value: 'regionCode'
          },
          change: this.initChange
        },
        siteIds: {
          hidden: data => {
            return data.regionCode == null
          },
          label: '开通站点',
          widget: 'checkbox',
          required: true,
          bind: {
            label: 'siteName',
            value: 'siteId'
          },
          options: []
        },
        sellerId: {
          hidden: () => this.reAuth,
          required: true,
          label: 'Merchant ID',
          placeholder: '卖家编号'
        },
        authToken: {
          hidden: () => this.reAuth,
          required: true,
          label: 'MWSAuthToken',
          placeholder: 'MWS授权令牌',
          bottomRender(h) {
            return <span>2</span>
          }
        }
      },
      value: {}
    }
  },
  created() {
    if (this.reAuth) {
      this.value = { ...this.info }
      this.initChange(this.value)
    }
  },
  methods: {
    initChange(data) {
      this.formSchema.siteIds.options = this.region.find(
        e => e.regionCode == data.regionCode
      ).sites
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = { ...this.value, platformId: this.platformId }
        return this.$api[
          `shopAuth/${this.reAuth ? 'sellerAuthUpdate' : 'sellerAuthSave'}`
        ](params)
      })
    },
    openTips() {
      this._openDialog({
        fullscreen: false,
        size: 'medium',
        title: '授权教程',
        params: {},
        cancelBtnText: '关闭',
        component: () => import('./tips.vue')
      })
    }
  }
}
</script>
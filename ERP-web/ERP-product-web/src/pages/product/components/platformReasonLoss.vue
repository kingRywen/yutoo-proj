<template>
  <v-spin :tip="`加载中...`" :spinning="loading">
    <el-tabs v-model="name">
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.name" :name="item.name">{{item.value}}</el-tab-pane>
    </el-tabs>
  </v-spin>
</template>

<script>
import { fetchData, showToast } from 'common/common'
import apis from 'apis'
export default {
  data() {
    return {
      loading: false,
      name: undefined,
      auditMap: this.$attrs.props.item.auditMap,
      languageIdMap: this.$attrs.props.item.languageIdMap,
      item: this.$attrs.props.item,
      ids: [],

      tabs: [],

      audit: {},

      reason: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData()
    })
  },
  methods: {
    ok() {},
    onTabClick() {},
    getData() {
      let vm = this
      let { props } = this.$attrs
      let { productPlatformId } = props.item
      let api = apis.PRODUCT_PLT_LANGUAGE_AUDIT_REASON_LIST
      this.loading = true
      fetchData({
        ...api,
        data: {
          productPlatformId
        }
      }).then(res => {
        vm.loading = false
        let { code, msg, rows } = res.data

        if (code === 0) {
          let { img, languageAudits } = rows
          if (languageAudits.length) {
            languageAudits.forEach(element => {
              this.tabs.push({
                name: element.name || '英语审核',
                value:
                  element.auditReason != null && element.auditReason !== ''
                    ? element.auditReason
                    : '暂无原因'
              })
            })
            this.name = '英语审核'
          }
          if (img.auditReason) {
            this.tabs.push({
              name: '图片审核',
              value:
                img.auditReason != null && img.auditReason !== ''
                  ? img.auditReason
                  : '暂无原因'
            })
            this.name = '图片审核'
          }
        } else {
          showToast('error', msg)
        }
      })
      // if (this.$attrs.img) {
      //   // 图片审核
      //   fetchData({
      //     ...apis.PRODUCT_PLT_AUDIT_IMG_INFO,
      //     data: {
      //       productId: this.item.productId,
      //       platformId: this.item.platformId
      //     }
      //   }).then(res => {
      //     console.log(res);

      //     if (res.data.code === 0) {
      //       delete res.data.code;
      //       this.audit = res.data.audit;
      //     } else {
      //       showToast("error", res.data.msg);
      //     }
      //   });
      // } else {
      //   // 语种审核
      //   fetchData({
      //     ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
      //     data: {
      //       languageIds: this.ids,
      //       productPlatformId: this.item.productPlatformId,
      //       productPltDetailId: this.item.productId
      //     }
      //   }).then(res => {
      //     console.log(res);

      //     if (res.data.code === 0) {
      //       delete res.data.code;
      //       this.reason = res.data;
      //     } else {
      //       showToast("error", res.data.msg);
      //     }
      //   });
      // }
    }
  }
  // computed: {
  //   tabs() {
  //     let ret = []
  //     this.ids = []
  //     for (const key in this.auditMap) {
  //       if (this.auditMap.hasOwnProperty(key)) {
  //         const element = this.auditMap[key]
  //         if (element === 3 && this.languageIdMap[key]) {
  //           this.ids.push(this.languageIdMap[key])
  //           ret.push({
  //             name: key,
  //             id: this.languageIdMap[key]
  //           })
  //         }
  //       }
  //     }
  //     return ret
  //   }
  // }
}
</script>

<style>
</style>

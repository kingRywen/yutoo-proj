<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="平台信息" lazy >
        <PlatInfo />
      </el-tab-pane>
      <el-tab-pane name="second" label="图片信息" lazy >
        <ImgInfo />
      </el-tab-pane>
      <el-tab-pane name="third" label="审核">
        <AuditForm @form-submit="submit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import AuditForm from 'Views/modules/product/amazon/platProduct/infoAudit/auditForm.vue'
import ImgInfo from '../add/imgInfo'
import PlatInfo from '../add/platInfo'
export default {
  components: {
    AuditForm,
    ImgInfo,
    PlatInfo
  },
  data() {
    return {
      activeName: 'third'
    }
  },
  methods: {
    submit(data) {
      const { productSellerId, platSiteId } = this.$route.query
      const params = { ...data, platSiteId: +platSiteId, productSellerIds:[+productSellerId] }
      this.$api[`product/prProductSellerAmzAudit`](params).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
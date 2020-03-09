<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="基础信息">
      </el-tab-pane>
      <el-tab-pane name="second" label="采购信息">
      </el-tab-pane>
      <el-tab-pane name="third" label="审核">
        <AuditForm @form-submit="submit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import AuditForm from 'Views/modules/product/amazon/platProduct/infoAudit/auditForm.vue'
export default {
  components: {
    AuditForm,
  },
  data() {
    return {
      activeName: 'third'
    }
  },
  methods: {
    submit(data) {
	  console.log(data)
      const { productSellerIds  } = this.$route.query
      const params = { ...data, productSellerIds }
      this.$api[`product/prProductSellerAmzAudit`](params).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
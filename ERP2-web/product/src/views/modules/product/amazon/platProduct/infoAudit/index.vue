<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="平台信息" lazy >
        <PlatInfo :params="params" :select-cate-info="selectCateInfo" />
      </el-tab-pane>
      <el-tab-pane name="second" label="审核">
        <AuditForm @form-submit="submit" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import AuditForm from './auditForm'
import PlatInfo from '../edit/platInfo';
export default {
  components: {
    AuditForm,
    PlatInfo
  },
  data() {
    return {
      selectCateInfo: {},
      params: {},
      activeName: 'second'
    }
  },
  methods: {
    submit(data) {
      const {productPlatId, platSiteId} = this.$route.query
      const params = {...data, platSiteId, productPlatIds: [productPlatId]}
      this.$api[`product/prProductPlatAmzAuditBasic`](params)
      .then(() => {
        this.$router.go(-1)
      })
    }
  },
}
</script>
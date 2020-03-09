<template>
  <div v-if="port">{{port}}</div>
  <NonePage v-else noBack></NonePage>
</template>
<script>
export default {
  data() {
    return {
      port: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.$api[`product/prProductSellerAmzAuditInfo`](this.$attrs).then(
        data => {
          this.port = data.rows.auditReason
        }
      )
    },
    _submit() {
      return this.$router.push({
        path: '/product/amazon/storeProduct/edit',
        query: this.$attrs
      })
    }
  }
}
</script>
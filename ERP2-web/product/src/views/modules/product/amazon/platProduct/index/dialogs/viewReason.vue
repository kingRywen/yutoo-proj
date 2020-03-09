<template>
  <div>{{reason}}</div>
</template>
<script>
export default {
  props: ['type', 'productPlatId', 'platSiteId'],
  data() {
    return {
      reason: ''
    }
  },
  created() {
    let { type, productPlatId, platSiteId } = this
    this.$api[`product/prProductPlatAmzAuditInfo`]({
      type,
      productPlatId,
      platSiteId
    }).then(data => {
      this.reason = data.rows.auditReason
    })
  },
  methods: {
    _submit() {
      return this.$router.push('/product/amazon/platProduct/edit')
    }
  },
}
</script>
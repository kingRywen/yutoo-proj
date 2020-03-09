<template>
  <Edit :img-edit="true" />
</template>
<script>
import EditForm from './editForm'
import Edit from '../edit'
export default {
  components: {
    EditForm,
    Edit
  },
  data() {
    return {
      activeName: 'second'
    }
  },
  methods: {
    submit(data) {
      const { productPlatIds, platSiteId } = this.$route.query
      const params = { ...data, platSiteId, productPlatIds }
      this.$api[`product/prProductPlatAmzAuditBasic`](params).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
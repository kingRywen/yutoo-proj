<template>
  <div class="products-img">
    <productsImg :data="data"></productsImg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: []
    }
  },
  methods: {
    edit(params) {
      let vm = this
      return vm.$api[`email/ebayUnpaidDisputeProductList`](params).then(
        data => {
          vm.data = data.rows
          return Promise.resolve()
        }
      )
    },
    submitForm(cb) {
      cb & cb()
    }
  }
}
</script>

<style lang='scss'>
.products-img {
  background: #fff;
}
</style>
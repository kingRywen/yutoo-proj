<template>
  <div class="products-img">
    <productsImg :data="data" price="true" :hiddenBotton="hiddenBotton"></productsImg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      hiddenBotton: false
    }
  },
  methods: {
    edit(params) {
      let vm = this
      if (!params.hiddenBotton) {
        return vm.$api[`email/ebayReturnProductList`](params).then(data => {
          console.log(data.rows)
          vm.data = data.rows.map(item => {
            item.productQuantity = item.returnQuantity
            return item
          })
          return Promise.resolve()
        })
      } else {
        vm.hiddenBotton = params.hiddenBotton
        vm.data = params.files.map(item => {
          return {
            productImg: item.file
          }
        })
        return Promise.resolve()
      }
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
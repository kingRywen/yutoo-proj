<template>
  <div>
    <div v-for="item in list">
      <img v-for="i in item.count" style="margin:5px" :src="item.plugImagePath" width="100" :key="i.id">
    </div>
  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      list: []
    }
  },
  computed: {
    params() {
      let id = this.id
      let params = []
      if (id) {
        let list = id.split('_')
        list.forEach(element => {
          let [productId, count] = element.split('-')
          params.push({
            productId: +productId,
            count: +count
          })
        })
      }
      return params
    }
  },
  watch: {
    params: {
      immediate: true,
      handler(val) {
        if (val.length) {
          this.getData()
        }
      }
    }
  },
  methods: {
    getData() {
      this.$api[`warehouse/wmInventoryProductPlug`]({ rows: this.params })
        .then(data => {
          this.list = data.list

          setTimeout(() => {
            this.$nextTick(() => {
              window.print()
            }) 
          });
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>

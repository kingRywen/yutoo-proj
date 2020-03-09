<template>
  <div>
    <template>
      <div v-for="code in codes" :key="code">
        <VueBarcode ref="bar" :value="code" :options="{ displayValue: true }" tag="svg" />
      </div>
    </template>
  </div>
</template>
<script>
import VueBarcode from '@chenfengyuan/vue-barcode'
export default {
  components: {
    VueBarcode
  },

  data() {
    return {
      codes: []
    }
  },
  created() {
    this.setCodes()
  },
  methods: {
    setCodes() {
      if (this.$route.query.codes) {
        this.codes = this.$route.query.codes.split('___')
      }
    }
  },
  watch: {
    $route() {
      this.setCodes()
    }
  }
}
</script>
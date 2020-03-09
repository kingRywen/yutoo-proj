<template>
  <div class="add-area">
    <iframe id="aaa" name="aaa" width="100%" style="height: 100%" :src="src"></iframe>
  </div>
</template>

<script>
import { loginRedirect } from 'Config'
export default {
  data() {
    return {
      src: ''
    }
  },
  created() {
    this.src = `${loginRedirect}erp-warehouse/#/warehouse/logisticsManagement/region?areaSkipType=1`
  },
  methods: {
    resetForm() {}
  }
}
</script>

<style lang="scss">
.add-area {
  background: #fff;
  height: 100%;
}
</style>

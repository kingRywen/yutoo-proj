<template>
  <ElTable style="margin-top:20px" :data="item.shipping" border stripe size="mini">
    <ElTableColumn label="国籍" prop="countryCode"></ElTableColumn>
    <ElTableColumn label="缩写" prop="currencyCode"></ElTableColumn>
    <ElTableColumn label="配送费 (USD)">
      <template slot-scope="scope">
        <el-input-number
          :min="0.01"
          :precision="2"
          :max="99999999999"
          v-model="data[scope.row.countryCode]"
          size="mini"
          placeholder="配送费"
        ></el-input-number>
      </template>
    </ElTableColumn>
    <ElTableColumn label="本地运费 (CNY)">
      <template slot-scope="scope">
        <el-input-number
          :min="0.01"
          :precision="2"
          :max="99999999999"
          v-model="data['LOCAL_' + scope.row.countryCode]"
          size="mini"
          placeholder="本地运费"
        ></el-input-number>
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script>
export default {
  props: {
    item: {
      default: () => {}
    },
    formData: {
      default: () => {}
    }
  },
  data() {
    return {
      data: {}
    }
  },
  created() {
    let unwatch = this.$watch('item.value', val => {
      if (val) {
        this.data = JSON.parse(val)
        unwatch()
      }
    })
  },
  watch: {
    data(val) {
      this.$set(this.item, 'value', JSON.stringify(val))
    }
  }
}
</script>

<style>
</style>

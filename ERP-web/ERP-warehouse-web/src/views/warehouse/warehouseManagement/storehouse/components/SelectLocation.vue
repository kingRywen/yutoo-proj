<template>
  <el-form :model="formData" label-width="80px" size="small">
    <ElFormItem label="库位规格" prop="wmLocationNormId" :rules="[{required:true,message:'请选择要设置的库位规格'}]">
      <el-select v-model="formData.wmLocationNormId" class="per100" clearable>
        <ElOption v-for="item in locationSpecifications" :key="item.value" :label="item.label" :value="item.value"></ElOption>
      </el-select>
    </ElFormItem>
  </el-form>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  inheritAttrs: false,
  data() {
    return {
      formData: {
        wmLocationNormId: null
      },
      list: []
    }
  },
  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    _initData() {
      if (this.locationSpecifications.length) {
        return
      }
      this.queryData(8)
    },
    submit() {
      console.log(this.$attrs)
      let { data: ids } = this.$attrs

      return this.$api[`warehouse/wmLocationUpdateNorm`]({
        ids,
        wmLocationNormId: this.formData.wmLocationNormId
      })
        .then(() => {})
        .catch(() => {})
    }
  },
  computed: {
    ...mapState('vmWarehouse', ['locationSpecifications'])
  }
}
</script>

<style>
</style>

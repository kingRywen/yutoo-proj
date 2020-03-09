<template>
  <div class="add-package-manager">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <ElFormItem label="负责仓库:" prop="wmWarehouseId">
        <ElSelect v-model="form.wmWarehouseId" placeholder clearable class="normal-input">
          <ElOption v-for="item in warehouseList" :label="item.label" :value="item.value" :key="item.id"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="负责人员:" prop="userId">
        <ElSelect v-model="form.userId" placeholder clearable :multiple="multiple" class="normal-input">
          <ElOption v-for="item in WmWarehouseStaffList" :label="item.label" :value="item.value" :key="item.id"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem prop="activateFlag">
        <ElCheckbox :true-label="1" :false-label="0" v-model="form.activateFlag">是否激活</ElCheckbox>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      form: {
        activateFlag: 0,
        userId: []
      },
      rules: vm.$formValidate([
        {
          label: '负责仓库',
          value: 'wmWarehouseId'
        },
        {
          label: '负责人员',
          value: 'userId'
        }
      ]),
      multiple: true
    }
  },
  created() {
    let vm = this
    vm.queryData(3)
    vm.getWmWarehouseStaffList(3)
  },
  computed: {
    ...mapState('logistics', ['WmWarehouseStaffList']),
    ...mapState('vmWarehouse', ['warehouseList'])
  },
  methods: {
    ...mapActions('logistics', ['getWmWarehouseStaffList']),
    ...mapActions('vmWarehouse', ['queryData']),
    async eidt(params) {
      let vm = this
      vm.multiple = false
      await vm.$api[`warehouse/WmWarehouseStaffGet`](params)
        .then(({ rows = {} }) => {
          vm.form = rows
          vm.$emit('loading')
          return Promise.resolve()
        })
        .catch(() => {
          vm.$emit('loading')
        })
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      _data.staffType = 3
      this.$refs.form.validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          console.log(333)
        }
      })
    },
    resetForm() {}
  }
}
</script>

<style lang='scss'>
.add-package-manager {
  background: #fff;
}
</style>
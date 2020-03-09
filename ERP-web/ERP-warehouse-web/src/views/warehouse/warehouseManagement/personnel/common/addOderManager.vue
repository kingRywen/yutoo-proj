<template>
  <div class="add-order-manager">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <ElFormItem label="仓库:" prop="wmWarehouseId">
        <ElSelect v-model="form.wmWarehouseId" placeholder clearable class="normal-input">
          <ElOption v-for="item in WmWarehouseGlobalLists" :label="item.label" :value="item.value" :key="item.id"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="拣货人:" prop="userId">
        <ElSelect v-model="form.userId" placeholder clearable class="normal-input">
          <ElOption v-for="item in WmWarehouseStaffList" :label="item.label" :value="item.value" :key="item.id"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="负责库位:" prop="locationEntityList">
        <!-- <ElSelect v-model="form.locationIds" placeholder clearable multiple class="normal-input">
          <ElOption v-for="" :key=""></ElOption>
        </ElSelect>-->
        <!-- <ElButton type="default" style="width: 193px;" @click="handleChose">多选</ElButton> -->
        <region :checkedList.sync="form.locationEntityList" :wmWarehouseId="form.wmWarehouseId"/>
      </ElFormItem>
      <ElFormItem prop="activateFlag">
        <ElCheckbox :true-label="1" :false-label="0" v-model="form.activateFlag">是否激活</ElCheckbox>
      </ElFormItem>
    </el-form>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
import region from './region'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      locationEntities: [],
      form: {
        activateFlag: 0,
        locationIds: [],
        locationEntityList: []
      },
      rules: vm.$formValidate([
        {
          label: '仓库',
          value: 'wmWarehouseId'
        },
        {
          label: '拣货人',
          value: 'userId'
        },
        {
          label: '负责库位',
          value: 'locationIds'
        }
      ])
    }
  },
  created() {
    let vm = this
    // vm.queryData(3)
    vm.getWmWarehouseStaffList(2)
    vm.getWmWarehouseGlobalLists()
  },
  mounted() {},
  watch: {
    'form.locationEntityList'() {}
  },
  computed: {
    ...mapState('logistics', ['WmWarehouseStaffList', 'WmWarehouseGlobalLists'])
    // ...mapState('vmWarehouse', ['warehouseList'])
  },
  methods: {
    ...mapActions('logistics', [
      'getWmWarehouseStaffList',
      'getWmWarehouseGlobalLists'
    ]),
    // ...mapActions('vmWarehouse', ['queryData']),
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
      _data.staffType = 2
      vm.$.dataType(_data.locationEntityList) !== 'Array' &&
        (_data.locationEntityList = [])
      if (!_data.locationEntityList.length) {
        this.$message.error('请选择负责库位')
        return
      }
      _data.locationIds = _data.locationEntityList.map(
        item => item.wmLocationId
      )
      this.$refs.form.validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          console.log(222)
        }
      })
    },
    resetForm() {},
    handleChose() {
      let vm = this
      if (!vm.form.wmWarehouseId && vm.form.wmWarehouseId != 0) {
        this.$message('请先选择仓库')
        return
      }
      this.$refs.dialog.$dialog({
        title: '添加',
        visible: true,
        width: '600px',
        component: () => import('./choseLocation'),
        childFn: [
          {
            name: 'getList',
            params: ''
          },
          {
            name: 'getAreaId',
            params: {
              wmWarehouseIds: [vm.form.wmWarehouseId]
            }
          }
        ],
        submitForm() {
          // vm.form.locationIds = val.map(item => item.wmLocationId)
          return Promise.resolve()
        }
      })
    }
  },
  components: {
    region
  }
}
</script>

<style lang='scss'>
.add-order-manager {
  background: #fff;
  .normal-input {
    width: 460px;
  }
}
</style>
<template>
  <div class="add-trans-way">
    <el-form ref="form" :model="form" :disabled="disabled" :rules="rules" size="small" label-width="100px">
      <ElFormItem label="国家:" prop="countryIds">
        <ElSelect
          v-model="form.countryIds"
          class="normal-input"
          multiple
          collapse-tags
          clearable
          placeholder="请选择国家(多选)"
        >
          <ElOption v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="运输方式:" prop="transportType">
        <ElSelect v-model="form.transportType" placeholder class="normal-input">
          <!-- <ElOption v-for="" :key=""></ElOption> -->
          <ElOption v-for="item in transportTypeList" :label="item.label" :value="item.value" :key="item.id"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="运费:" prop="value">
        <el-input-number
          v-model="form.freight"
          controls-position="right"
          :min="1"
          :max="10000000"
          class="normal-input"
          :controls="false"
        ></el-input-number>
      </ElFormItem>
      <ElFormItem label="附加费:" prop="value">
        <el-input-number
          v-model="form.additionalCost"
          controls-position="right"
          :min="0"
          :max="10000000"
          class="normal-input"
          :controls="false"
        ></el-input-number>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      disabled: false,
      form: {},
      rules: {},
      params: {}
    }
  },
  created() {
    this.initTransportTypeList()
    this.initCountryList()
  },
  computed: {
    ...mapState('common', ['transportTypeList', 'countryList'])
  },
  methods: {
    ...mapActions('common', ['initTransportTypeList', 'initCountryList']),
    edit(params) {
      let vm = this
      return vm.$api[`order/ebayTransportTypeTypeInfo`](params).then(
        ({ rows }) => {
          vm.form = rows
          return Promise.resolve()
        }
      )
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      vm.$refs['form'].validate(valid => {
        if (valid) {
          if (vm.params.check == true) {
            _data = false
          }
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.add-trans-way {
  background: #fff;
  .normal-input {
    width: 200px;
  }
}
</style>
<template>
  <div class="add-predict-day">
    <el-form ref="form" size="small" :rules="rules" :model="form" :inline="true" label-width="100px">
      <el-form-item label="预计到达天数:" prop="predictTimeStart">
        <!-- <el-input v-model="form.predictTimeStart" class="normal-input"></el-input> -->
        <el-input-number v-model="form.predictTimeStart" size="small" class="normal-input" :controls="false" :min="1"></el-input-number>
      </el-form-item>
      <ElFormItem>~</ElFormItem>
      <ElFormItem prop="predictTimeEnd">
        <!-- <el-input v-model="form.predictTimeEnd" class="normal-input"></el-input> -->
        <el-input-number
          v-model="form.predictTimeEnd"
          size="small"
          class="normal-input"
          :controls="false"
          :min="form.predictTimeStart"
        ></el-input-number>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      form: {},
      logisticForwarderFreightIdList: null,
      rules: vm.$formValidate([
        {
          value: 'predictTimeStart',
          type: ['number', 0]
        },
        {
          value: 'predictTimeEnd',
          type: ['number', 0]
        }
      ])
    }
  },
  methods: {
    getId(params) {
      this.logisticForwarderFreightIdList =
        params.logisticForwarderFreightIdList
    },
    submitForm(cb) {
      let _data = JSON.parse(JSON.stringify(this.form))
      _data.logisticForwarderFreightIdList = this.logisticForwarderFreightIdList
      _data.predictTimeStart = Number(_data.predictTimeStart)
      _data.predictTimeEnd = Number(_data.predictTimeEnd)
      cb && cb(_data)
    }
  }
}
</script>

<style lang="scss">
.add-predict-day {
  background: #fff;
  .normal-input {
    width: 100px;
  }
}
</style>

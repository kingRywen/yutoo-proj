<template>
  <div class="add-charges">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <ElRow>
        <ElCol :span="12">
          <t-form-item
            label-width="0 "
            class="style-center"
            :value.sync="form.file"
            prop="file"
            type="upload"
            :uploadFile="true"
            @handleHttpRequests="handleHttpRequests"
          ></t-form-item>
        </ElCol>
        <ElCol :span="12">
          <t-form-item
            label-width="0 "
            class="style-center"
            :value.sync="form.file"
            prop="modelName"
            type="btn"
            btnText="下载模板"
            @click="handleDownload"
          ></t-form-item>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    edit(params) {
      console.log(params)
    },
    cancel() {},
    handleDownload() {
      let vm = this
      vm.$api[`finance/financeProductCostTypeTemplateExport`]({}).then(
        ({ path = '' }) => {
          vm.$download(path)
        }
      )
    },
    handleHttpRequests() {
      let vm = this
      vm.$api[`finance/financeProductCostUploadTemp`]({
        file: vm.form.file
      })
    }
  }
}
</script>

<style lang='scss'>
.add-charges {
  background: #fff;
  .style-center {
    display: flex;
    justify-content: center;
  }
}
</style>
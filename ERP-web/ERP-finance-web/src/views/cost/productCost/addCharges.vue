<template>
  <div class="add-charges">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <t-form-item :value.sync="form.modelName" prop="modelName" label="开始时间:"></t-form-item>
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
    formatForm(form) {
      return form
    }
  }
}
</script>

<style lang='scss'>
.add-charges {
  background: #fff;
}
</style>
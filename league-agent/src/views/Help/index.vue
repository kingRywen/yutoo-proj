<template>
  <div>
    <el-page-header @back="goBack" content="帮助"></el-page-header>
    <new-form class="mt20" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <div class="txc">
      <ElButton type="primary" :loading="loading" class="more-len" @click="submit">提交</ElButton>
      <ElButton type="primary" @click="$router.go(-1)" plain>取消</ElButton>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      formSchema: {
        title: {
          label: '帮助主题',
          widget: 'select',
          width: '200px',
          options: [
            {
              label: '任务中心',
              value: 0
            },
            {
              label: '充值消费',
              value: 1
            },
            // {
            //   label: '商品回收',
            //   value: 2
            // },
            {
              label: '店铺管理',
              value: 3
            },
            {
              label: '其它',
              value: 4
            }
          ],
          required: true
        },
        content: {
          label: '需要什么帮助',
          placeholder: '最多只能输入1024个字符',
          required: true,
          widget: 'textarea',
          rows: 5
        }
      },
      value: {}
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          setTimeout(() => {
            this.$message.success('提交成功')
            this.$refs.form.$refs.ruleform.resetFields()
            this.loading = false
          }, 500)
          // this.$api[`agent/`](params)
          // .then((data) => {

          // })
        }
      })
    }
  }
}
</script>
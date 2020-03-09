<template>
  <div>
    <yt-form ref="form" label-width="120px" :fields="activeFields" :formData="formData"></yt-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      activeFields: [
        {
          label: '商户编号',
          name: 'merchantNo',
          span: 24,
          required: true
        },
        {
          label: '商户名称',
          name: 'merchantName',
          span: 24,
          required: true
        },
        {
          label: '登陆账号',
          name: 'username',
          span: 24,
          required: true
        },
        {
          label: '有效天数',
          name: 'effectiveTime',
          span: 24,
          type: 'number',
          min: 1,
          required: true
        },
        {
          label: 'ASIN',
          name: 'effectiveTime1',
          span: 24,
          rows: 5,
          type: 'textarea',
          required: 'multiUrl'
        },
        {
          label: "关键词",
          name: "keyword",
          span: 24,
          rows: 5,
          type: "textarea",
          required: "keyword",
        }
      ]
    }
  },
  methods: {
    _submit() {
      console.log(12);
      
      // return this.$refs.form.validate().then(()=>{
      //       return this.$api[url](params).then(data => {
      //     return Promise.resolve("reset");
      //   });
           
      // })

      return this.$refs.form.validate().then(()=>{
            return this.$api[url](params).then();
      })
    }
  },
}
</script>

<style>
</style>

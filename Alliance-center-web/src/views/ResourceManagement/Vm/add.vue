<template>
  <SimpleForm label-width="100px" :fields="addFields" :outerFormData="formData" ref="add"/>
</template>

<script>
export default {
  data() {
    return {
      formData:{},
      addFields: [
        {
          name: 'name',
          label: '虚拟机名称',
          span: 12,
          required: true
        },
        {
          name: 'ip',
          label: 'IP',
          span: 12,
          required: 'ip'
        },
        {
          name: 'intranetIp',
          label: '内网IP',
          span: 12,
          required: 'ip'
        },
        {
          name: 'remark',
          label: '备注',
          span: 24,
          type: 'textarea',
          rows: 6,
          // required: true
        },
      ],
    }
  },
  created() {
    if (this.$parent.$parent.title !== '新增虚拟机') {
      this.show = true
    }
  },
  methods: {
    setData(data) {
      this.$refs.add.setData(data)
      // this.formData = {...this.formData, ...data}
    }
  },
}
</script>

<style lang="scss"  scoped>
.bg {
  background: #f4f4f6;
  padding: 0 20px;
}
</style>

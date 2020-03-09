<template>
  <!-- <SimpleForm label-width="100px" :fields="addFields" :outerFormData="formData" ref="add" /> -->
  <new-form ref="form" label-width="80px" :form-schema="formSchema" v-model="value"></new-form>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['id'],
  computed: {
    ...mapState(['expendOption'])
  },
  watch: {
    expendOption: {
      immediate: true,
      handler(val) {
        this.formSchema.expendOptionId.options = val
      }
    }
  },
  data() {
    return {
      value: {},
      formSchema: {
        expendOptionId: {
          widget: 'select',
          label: '支出项',
          options: [],
          required: true
        },
        expendDate: {
          label: '支出日期',
          widget: 'date',
          timeDisabled: 'before',
          required: true
        },
        money: {
          label: '支出金额',
          widget: 'currency',
          // noShow: true,
          span: 16,
          required: true
        },
        currency: {
          widget: 'select',
          defaultVal: 'USD',
          options: [
            {
              label: '美金',
              value: 'USD'
            },
            {
              label: '人民币',
              value: 'CNY'
            }
          ],
          width: '100%',
          span: 8,
          required: true
        },
        remark: {
          label: '备注',
          span: 24,
          widget: 'textarea',
          rows: 6
        }
      }
    }
  },
  mounted() {
    if (this.id) {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$api[`main/expendRecordInfo`]({ id: this.id }).then(data => {
        this.value = data.rows
      })
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        return this.$api[
          this.id ? `main/expendRecordUpdate` : `main/expendRecordSave`
        ](this.value)
      })
    }
  }
}
</script>

<style lang="scss"  scoped>
.bg {
  background: #f4f4f6;
  padding: 0 20px;
}
</style>

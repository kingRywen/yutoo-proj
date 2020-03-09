<template>

  <SimpleForm label-width="120px" :fields="addFields" :defaultData="defaultData" ref="add"></SimpleForm>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
  data() {
    let vm =this
    return {
      defaultData:{},
      addFields: [
        {
          label: '习惯名称',
          type: 'select',
          name: 'accountId',
          allowCreate: true,
          options: vm.habitList
        },
        {
          label: '习惯备注',
          name: 'remark',
          type: 'textarea',
          disabled: true,
          rows: 5
        }
      ]
    }
  },
  created() {
    this.getHabitList()
  },
  computed: {
    ...mapState(['habitList'])
  },
  methods: {
    ...mapActions(['getHabitList']),
    getFormData() {
      return this.$refs.add.formData
    },
    init(accountId) {
      this.$api[`main/accountHabit`]({accountId})
      .then(data => {
        this.defaultData = data.rows[0]
      }).catch((err) => {})
    }
  },
}
</script>

<style>
</style>

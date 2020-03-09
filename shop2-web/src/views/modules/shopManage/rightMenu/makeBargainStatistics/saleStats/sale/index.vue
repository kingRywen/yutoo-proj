<template>
  <div>
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        time: {
          widget: 'daterange'
        },
        statType: {
          widget: 'select',
          options: [
            { label: '周一到周日', value: 0 },
            { label: '周一到周日24点', value: 1 },
            { label: '24点', value: 2 },
            { label: '月份', value: 3 },
            { label: '按日统计', value: 4 }
          ]
        }
      },
      value: {}
    }
  }
}
</script>
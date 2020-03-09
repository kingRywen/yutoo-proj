<template>
  <div>
    <new-form inline :formSchema="formSchema" v-model="value" />
    <v-chart :options="options"></v-chart>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: {},
      formSchema: {
        time: {
          widget: 'datetimerange'
        },
        date: {
          widget: 'select',
          options: [
            {
              label: '按周',
              value: 0
            },
            {
              label: '按日',
              value: 1
            },
            {
              label: '按月',
              value: 2
            }
          ]
        }
      },
      value: {}
    }
  }
}
</script>
<template>
  <div class="add-no-transport-way">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <search :searchList="searchConfig" ref="search" @search="search"></search>
      <yt-table :data="tableData" :columns="tableColumns"></yt-table>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      rules: {},
      tableData: [],
      tableColumns: [
        {
          label: '国家',
          value: 'bbb'
        },
        {
          label: '省',
          value: 'bbb'
        }
      ],
      searchConfig: [
        {
          type: 'select',
          value: 'aaa',
          label: '区域',
          placeholder: '',
          children: []
        },
        {
          type: 'select',
          value: 'aaa',
          label: '国家',
          placeholder: '',
          children: []
        }
      ]
    }
  },
  methods: {
    submitForm(cb) {
      cb && cb()
    },
    search(val) {
      console.log(val)
    }
  }
}
</script>

<style lang='scss'>
.add-no-transport-way {
  background: #fff;
  .normal-input {
    width: 200px;
  }
}
</style>
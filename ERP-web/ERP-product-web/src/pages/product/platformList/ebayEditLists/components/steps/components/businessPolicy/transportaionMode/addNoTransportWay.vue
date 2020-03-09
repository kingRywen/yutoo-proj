<template>
  <div class="add-no-transport-way">
    <!-- <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <search :searchList="searchConfig" ref="search" @search="search"></search>
      <yt-table :data="tableData" :columns="tableColumns"></yt-table>
    </el-form> -->
    <ElTree :data="treeData"></ElTree>
  </div>
</template>

<script>
import apis from 'apis';
import { fetchData, handlerCode, showToast } from 'common/common';
import search from '../../search'
import YtTable from '../../table'
export default {
  data() {
    return {
      // form: {},
      // rules: {},
      treeData: [],
      // tableData: [],
      // tableColumns: [
      //   {
      //     label: '国家',
      //     value: 'bbb'
      //   },
      //   {
      //     label: '省',
      //     value: 'bbb'
      //   }
      // ],
      // searchConfig: [
      //   {
      //     type: 'select',
      //     value: 'aaa',
      //     label: '区域',
      //     placeholder: '',
      //     children: []
      //   },
      //   {
      //     type: 'select',
      //     value: 'aaa',
      //     label: '国家',
      //     placeholder: '',
      //     children: []
      //   }
      // ]
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    getTreeData(data = {}) {
      let vm = this
      fetchData({
        ...apis.PRODUCT_PLATFORM_AREA_LIST,
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            vm.treeData = res.data.rows
          },
          () => {
          },
          true
        )
      })
    },
    submitForm(cb) {
      cb && cb()
    },
    search(val) {
      console.log(val)
    }
  },
  components: {
    YtTable,
    search
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
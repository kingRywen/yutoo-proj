<template>
  <div>
    <universal-layout
      :total="total"
      :pageSize="pageSize"
      :pageNo="pageNo"
      :btnList="btnList"
      :pagination="pagination"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @clickBtn="$emit('clickBtn',$event)"
    >
      <section slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allBtn"></section>
      <section slot="table">
        <yt-table :columns="columns" :data="tableData" @handleSelectionChange="handleSelectionChange">
          <template>
            <slot></slot>
          </template>
          <template name="right">
            <slot name="right"></slot>
          </template>
        </yt-table>
      </section>
    </universal-layout>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Boolean,
      default: true
    },
    searchDataFunc: {
      type: Function,
      default: () => {}
    },
    searchList: {
      type: Array,
      default: () => {
        return []
      }
    },
    btnList: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 10,
      pageSize: 10,
      pageNo: 1,
      searchData: {},
      tableData: [
        {
          price: '1'
        }
      ]
    }
  },
  created() {
    let vm = this
    vm.getList()
  },
  methods: {
    handleSearch(val) {
      let vm = this
      vm.searchData = this.searchDataFunc(JSON.parse(JSON.stringify(val)))
      this.getList('search')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search')
    },
    handleSelectionChange(val) {
      this.$emit('selectChange', val)
    },
    getList(type) {
      let vm = this
      let params = {
        pageSize: vm.pageSize,
        pageNo: vm.pageNo,
        sortOrder: 'asc'
      }
      if (type) {
        params = Object.assign({}, params, vm.searchData)
      }
      console.log(params)

      // vm.$api[url](params).then(data => {
      //   let { rows } = data
      //   vm.total = data.total
      //   vm.pageSize = data.pageSize
      //   vm.pageNo = data.pageNo
      //   vm.tableData = rows
      // })
    }
  }
}
</script>

<style lang="scss">
</style>

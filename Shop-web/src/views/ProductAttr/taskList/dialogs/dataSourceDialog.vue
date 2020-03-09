<template>
  <div>
    <yt-table :selection="false" :columns="columns" :data="data"></yt-table>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    return {
      columns: [],
      data: []
    }
  },
  methods: {
    _initData() {
      this.setColumns()
    },
    setColumns() {
      const { type, row, dataSourceList } = this.params
      this.data = dataSourceList.map(el => ({
        ...el,
        searchPages: row.searchPages,
        categoryType: row.categoryType ? '小类' : '大类',
        BSR: row.minRank + '-' + row.maxRank
      }))
      if (type === 2) {
        // 类目链接
        this.columns = [
          {
            label: '类目',
            value: 'dataSource',
            width: 300,
            // url: 'categoryUrl',
            render(h, scope) {
              let dataSource = scope.row.dataSource
              if (dataSource.length > 50) {
                let newArr = dataSource.split(':')
                var newStr = ''
                newStr = `${newArr[0]}...${newArr.pop()}`
              }
              return dataSource ? (
                <div>
                  <el-tooltip
                    open-delay={300}
                    content={dataSource}
                    placement="top"
                    effect="light"
                  >
                    <a
                      class="fix__row_1"
                      href={scope.row.categoryUrl}
                      style="color:#108ee9;"
                      target="_blink"
                    >
                      {dataSource.length > 50 ? newStr : dataSource}
                    </a>
                  </el-tooltip>
                </div>
              ) : (
                <span>-</span>
              )
            }
          },
          {
            label: '抓取页数',
            value: 'searchPages'
          },
          {
            label: '按类目',
            value: 'categoryType'
          },
          {
            label: 'BSR',
            value: 'BSR'
          }
        ]
      }
      if (type === 1) {
        // 关键词
        this.columns = [
          {
            label: '关键词',
            value: 'dataSource',
            render(h, scope) {
              return (
                <a
                  class="url"
                  href={scope.row.keywordUrl}
                  target="_blank"
                >
                  {scope.row.dataSource}
                </a>
              )
            }
          },
          {
            label: '抓取页数',
            value: 'searchPages'
          },
          {
            label: '按类目',
            value: 'categoryType'
          },
          {
            label: 'BSR',
            value: 'BSR'
          }
        ]
      }
      if (type === 3) {
        // top100
        this.columns = [
          {
            label: 'TOP100链接',
            value: 'dataSource',
            url: 'dataSource'
          }
        ]
      }
    }
  },
  created() {
    this.data = this.params.dataSourceList
    console.log(this.data)
  }
}
</script>

<style scoped lang="less">
.table {
  border: 1px solid #e5e5e5;
  margin-bottom: 20px;
  .link {
    text-align: center;
    height: 30px;
    background-color: #f5f5f5;
    line-height: 30px;
    border-bottom: 1px solid #e5e5e5;
  }
  .col {
    text-align: center;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>

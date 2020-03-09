<template>
  <el-row :gutter="20">
    <el-col style="border-right: 1px solid #ddd;position: relative" :span="12">
      <div class="add-wrapper">
        <el-button style="float: right" type="primary" @click="add">添加</el-button>
      </div>
      <main-layout
        class="table"
        :outerParams="storeInfo"
        :searchFields="searchFields"
        :columns="columns"
        :treeTable="true"
        @searchTrueData="val => searchData = val"
        :treeTableOtions="treeTableOtions"
        :checkStrictly="false"
        edit-width="160px"
        url="fba/FbaReplenishProductAndImport_1581321280321"
        ref="layout"
        tip="优化针对子产品，勾选父产品，添加该父产品下所有的子产品"
      ></main-layout>
    </el-col>
    <el-col :span="12">
      <div class="flex just-sb" style="line-height: 40px">
        <div>已选择{{allSelects.length}}个产品</div>
        <el-button type="text" @click="clear">全部删除</el-button>
      </div>
      <main-layout
        :columns="columns"
        :treeTable="true"
        :showSelection="false"
        :outerTableList="selected"
        :treeTableOtions="treeTableOtions"
        :checkStrictly="false"
        edit-width="160px"
        ref="layout1"
      >
        <el-table-column slot="right" label align="left">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-close" @click="del(scope.row)"></el-button>
          </template>
        </el-table-column>
      </main-layout>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      hasSelectIds: [],
      // selected: [],
      allSelects: [],
      searchData: {},
      treeTableOtions: {
        childs: 'children',
        expandFunc: row => {
          return row.variationType == 1
        }
      },
      searchFields: {
        keyword: {
          placeholder: '输入ASIN、SKU搜索',
          suffix: 'el-icon-search'
        }
      },
      columns: [
        {
          label: '主图',
          width: 65,
          value: 'img',
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['asin']
          },
          title: 'title'
        },
        {
          label: 'SKU',
          value: 'sellerSku',
          numField: 'childsCount',
          expand: true,
          async: true,
          asyncFunc: row => {
            let params = {
              keyword: this.searchData.keyword,
              storeId: row.storeId,
              parentAsin: row.asin
            }
            return this.$api[`fba/fbaReplenishProductAndImportVariation`](
              params
            ).then(data => data.rows)
          },
          noTooltip: true,
          minWidth: 200
        },
        {
          label: 'ASIN',
          value: 'asin',
          noTooltip: true,
          minWidth: 140
        }
      ]
    }
  },
  computed: {
    selected: {
      get() {
        let ret = {}
        this.allSelects
          .slice()
          .sort((a, b) => a - b)
          .forEach(el => {
            if (el._level == 1) {
              ret[el.sellerSku] = { ...el, children: [] }
            } else {
              if (!ret[el.parent.sellerSku]) {
                ret[el.sellerSku] = { ...el }
              } else {
                ret[el.parent.sellerSku].children.push({ ...el })
              }
            }
          })
        return Object.values(ret)
      }
    }
  },
  methods: {
    add() {
      // let ret = []
      this.$refs.layout.selection.forEach(el => {
        if (this.hasSelectIds.indexOf(el.sellerSku) == -1) {
          this.hasSelectIds.push(el.sellerSku)
          this.allSelects.push({ ...el, children: el._level == 1 ? [] : null })
        }
      })
    },
    validate() {
      return new Promise((resolve, reject) => {
        if (this.allSelects.length) {
          resolve()
        } else {
          this.$message.warning('请选择要添加的产品')
          reject()
        }
      })
    },
    del(row) {
      this.allSelects = this.allSelects.filter(
        el => el.sellerSku !== row.sellerSku
      )
      this.hasSelectIds = this.hasSelectIds.filter(e => e !== row.sellerSku)
    },
    clear() {
      this.allSelects = []
      this.hasSelectIds = []
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          data: this.allSelects.map(el => ({
            storeId: el.storeId,
            sellerSku: el.sellerSku
          }))
        }
        return this.$api[`fba/FbaReplenishProductAdd`](params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.add-wrapper {
  position: fixed;
  z-index: 33;
  width: 47%;
  background: #fff;
  top: 67px;
  padding: 10px;
  // /deep/ .el-button {
  // }
}
.table {
  margin-top: 42px;
}
</style>
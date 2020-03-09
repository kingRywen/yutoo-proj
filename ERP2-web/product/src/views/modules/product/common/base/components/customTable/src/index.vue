<template>
  <div>
    <search
      v-if="hasSearch"
      :searchConfig="searchConfig"
      :selectData="selectData"
      :useNumber="useNumber"
      v-on="$listeners"
      v-bind="$attrs"
      @searchForm="searchForm"
    ></search>
    <el-table
      class="special-table"
      :data="tables"
      style="width: 100%"
      v-bind="$attrs"
      v-on="$listeners"
      ref="table"
      :border="border"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-key="rowKey"
      @selection-change="selectionChange"
    >
      >
      <el-table-column type="selection" v-if="selection" width="55"></el-table-column>
      <template v-for="item in columns">
        <el-table-column
          :key="item.id"
          v-if="item.btns"
          align="center"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            <div v-for="i in item.btns" :key="i.id">
              <el-dropdown
                v-setplain.small
                v-if="i.type == 'dropdown'"
                @click="() => {i.fn ? i.fn(scope.$index, scope.row) : ()=> {}}"
                split-button
                type="primary"
              >
                {{i.name}}
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(j,idx) in i.children" :key="idx">
                    <div
                      @click="() => {typeof j.fn === 'function' ? j.fn(scope.$index, scope.row) : ()=> {}}"
                    >{{j.name}}</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-button
                v-else
                size="small"
                :type="i.type || ''"
                @click="i.fn(scope.$index, scope.row) || (() => {})"
              >{{i.name}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.id"
          v-else-if="item.input == true"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            <ElInput
              v-model="scope.row[item.value]"
              :disabled="scope.row.disabled != true ? false : true"
              placeholder="请输入"
              size="small"
            ></ElInput>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.id"
          v-else-if="item.type == 'image'"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="right">
              <el-image style="width: 100px; height: 100px" :src="scope.row[item.value]" fit="fill"></el-image>
              <div slot="reference" class="name-wrapper">
                <el-image style="width: 40px; height: 40px" :src="scope.row[item.value]" fit="fill"></el-image>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          width="450"
          :key="item.id"
          align="center"
          v-else-if="item.fields"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :key="indexKey">
              <div
                class="custom-wrap"
                v-demo="{
                row: scope.row,
                fields: item.fields,
                width: item.width || '400'
              }"
              >
                <div
                  class="costom-item"
                  v-for="(i) in scope.row[item.fields || 'btnList']"
                  :key="i.id"
                >
                  <a :href="i.href" target="_blank" v-if="i.href">{{i.name}}</a>
                  <span v-else>{{i.name}}</span>
                  <i
                    @click="() => {typeof item.close === 'function' ? item.close(i,scope.row) : ''}"
                    class="el-icon-close"
                  ></i>
                </div>
              </div>
              <div class="icon-wrap">
                <el-dropdown trigger="click" v-if="scope.row[`hide${item.fields}`]">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="i in scope.row[`hideList${item.fields}`]" :key="i.id">
                      <div style="width: 100%;position:relative">
                        {{i.name}}
                        <span
                          style="display:inline-block"
                          @click="() => {typeof item.close === 'function' ? item.close(i,scope.row) : ''}"
                        >
                          <i style="position: absolute;top: 0px;right: -22px" class="el-icon-close"></i>
                        </span>
                      </div>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" v-else-if="item.columns" :key="item.id" :label="item.label">
          <template slot-scope="scope">
            <div class="table-wrap">
              <div>{{scope.row[item.value]}}</div>
              <div class="icon-wrap">
                <el-dropdown trigger="hover">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown" style="margin: 0;padding: 0">
                    <custom-table
                      :hasSearch="false"
                      :columns="costomColumns"
                      :selection="false"
                      :tableData="costomData"
                    ></custom-table>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          :key="item.id"
          v-else
          :label="item.label"
          :prop="item.value"
        ></el-table-column>
      </template>
    </el-table>
    <!--  -->
    <el-pagination
      background
      v-if="isShowPag"
      :total="total || 0"
      :current-page="pageNo || 0"
      :page-size="pageSize || 0"
      @current-change="currentChange"
      @size-change="sizeChange"
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import search from "./search";
export default {
  name: "custom-table",
  props: {
    isShowPag: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: ""
    },
    moreParams: {
      type: Object,
      default: () => {}
    },
    moreColumns: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    selection: {
      type: Boolean,
      default: true
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: "id"
    },
    searchConfig: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => [
        {
          label: "Date1",
          value: "date"
        },
        {
          label: "name1",
          value: "name"
        },
        {
          label: "操作",
          custom: true
        },
        {
          label: "颜色",
          value: "color",
          input: true
        },
        {
          label: "表格",
          columns: [{}],
          value: "table"
        },
        {
          label: "按钮操作",
          btns: [
            {
              name: "删除",
              fn(index, row) {
                console.log(index, row);
              }
            }
          ]
        },
        {
          label: "操作",
          btns: [
            {
              type: "dropdown",
              name: "下拉一",
              fn() {
                console.log("fdsaf");
              },
              children: [
                {
                  name: "下拉二",
                  fn(index, row) {
                    console.log(index, row);
                  }
                },
                {
                  name: "下拉三",
                  fn(index, row) {
                    console.log(index, row);
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    border: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: () => [
        // {
        //   id: 1,
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄",
        //   color: "red",
        //   disabled: true
        // },
        // {
        //   id: 2,
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1517 弄",
        //   table: "biao",
        //   children: [
        //     {
        //       id: 3,
        //       date: "2016-05-02",
        //       name: "王小虎",
        //       address: "上海市普陀区金沙江路 1518 弄",
        //       color: "red",
        //       disabled: true
        //     },
        //     {
        //       id: 4,
        //       date: "2016-05-02",
        //       name: "王小虎",
        //       address: "上海市普陀区金沙江路 1518 弄",
        //       color: "red",
        //       disabled: true,
        //       children: [
        //         {
        //           id: 7,
        //           date: "2016-05-02",
        //           name: "王小虎",
        //           address: "上海市普陀区金沙江路 1518 弄",
        //           color: "red",
        //           disabled: true
        //         },
        //         {
        //           id: 8,
        //           date: "2016-05-02",
        //           name: "王小虎",
        //           address: "上海市普陀区金沙江路 1518 弄",
        //           color: "red",
        //           disabled: true
        //         }
        //       ]
        //     }
        //   ]
        // },
        // {
        //   id: 5,
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   btnList: [
        //     {
        //       name: "这是什么鬼",
        //       href: "http://www.baidu.com"
        //     },
        //     {
        //       name: "这是什么鬼",
        //       href: "http://www.baidu.com"
        //     },
        //     {
        //       name: "这是什么fdsfsadfdsa鬼",
        //       href: "http://www.baidu.com"
        //     },
        //     {
        //       name: "这是什么鬼",
        //       href: "http://www.baidu.com"
        //     },
        //     {
        //       name: "这fdsfadsfas是什么鬼",
        //       href: "http://www.baidu.com"
        //     },
        //     {
        //       name: "这是什么鬼",
        //       href: "http://www.baidu.com"
        //     }
        //   ]
        // },
        // {
        //   id: 6,
        //   date: "2016-05-03",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1516 弄"
        // }
      ]
    }
  },
  data() {
    return {
      total: 0,
      pageSize: 10,
      pageNo: 1,
      indexKey: Math.random(),
      costomColumns: [
        {
          label: "aaa",
          value: "aaa"
        },
        {
          label: "bbb",
          value: "bbb"
        }
      ],
      costomData: [{ aaa: "aaa", bbb: "bbb" }],
      baseData: [],
      selectionData: []
    };
  },

  computed: {
    useNumber: {
      get() {
        return this.selectData.length;
      }
    },
    tables: {
      get() {
        return [...this.baseData, ...this.tableData];
      }
    },
    selectData: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {},
  created() {
    this.backShowData = this.value;
    this.getList();
  },
  methods: {
    // 处理回显选中数据
    initBackShow() {
      let backShowData = this.backShowData;
      let selectionData = this.selectionData;
      let vm = this;
      vm.backShowData = backShowData.filter(item => {
        return JSON.stringify(selectionData).indexOf(item[vm.rowKey]) < 0;
      });
      vm.selectData = [...vm.selectionData, ...vm.backShowData];
    },
    selectionChange(val) {
      this.$set(this, "selectionData", val);
      this.initBackShow();
    },
    searchForm(val) {
      this.$emit("searchForm", val);
      this.getList(val);
    },
    currentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    sizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getList();
    },
    getList(search = {}) {
      let vm = this;
      if (!this.url || !this.isShowPag) {
        return;
      }
      let params = {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        ...vm.moreParams
      };
      if (!vm.utils.isEmpty(search)) {
        params = { ...params, ...search };
      }
      vm.$api[vm.url](params).then(res => {
        vm.baseData = res.rows || [];
        vm.baseData.forEach(item => {
          vm.backShowData.forEach(i => {
            if (item[vm.rowKey] == i[vm.rowKey]) {
              item = Object.assign(item, i);
            }
          });
        });
        vm.showBack(res.rows || []);

        vm.total = res.total;
        vm.pageNo = res.pageNo;
        vm.pageSize = res.pageSize;
      });
    },
    showBack(rows) {
      let vm = this;

      vm.$nextTick(() => {
        if (vm.utils.isArrLength(vm.selectData)) {
          rows.forEach(item => {
            vm.selectData.forEach(i => {
              if (item[vm.rowKey] == i[vm.rowKey]) {
                if (!vm.selectionData.find(j => j[vm.rowKey] == i[vm.rowKey])) {
                  vm.$refs.table.toggleRowSelection(item);
                }
              }
            });
          });
        }
      });
    },
    getTableData() {
      return this.tables;
    }
  },
  components: {
    search
  }
};
</script>

<style lang='scss'>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
.special-table {
  width: $box-width;
  margin: auto;
  .el-button--primary {
    i {
      font-size: 12px;
    }
  }
  .table-wrap {
    // background: white;
  }
  .custom-wrap {
    position: relative;
    .costom-item {
      display: inline-block;
      padding: 4px 16px 4px 6px;
      border: 1px solid #d7dae2;
      border-radius: 2px;
      position: relative;
      margin-left: 4px;
      cursor: pointer;
      .el-icon-close {
        position: absolute;
        right: 0;
      }
    }
  }
  .icon-wrap {
    position: absolute;
    right: 7px;
    top: 10px;
    display: inline-block;
    i {
      font-size: 24px;
    }
  }
  .el-table__row td {
    height: 51px;
  }
}
</style>
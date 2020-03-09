<template>
  <div>
    <search v-on="$listeners" :selectData="selectData" v-bind="$attrs"></search>
    <el-table
      class="special-table"
      :data="tableData"
      style="width: 100%"
      v-bind="$attrs"
      v-on="$listeners"
      :border="border"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :row-key="rowKey"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" v-if="selection" width="55"></el-table-column>
      <template v-for="item in tableColumns">
        <el-table-column :key="item.id" v-if="item.btns" align="center" :label="item.label">
          <template slot-scope="scope">
            <div v-for="i in item.btns" :key="i.id">
              <el-dropdown
                v-setplain.small
                v-if="i.type == 'dropdown'"
                @click="() => {i.fn ? i.fn() : ()=> {}}"
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
          v-else-if="item.type == 'input'"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            <ElInput
              v-model="scope.row[item.value]"
              :disabled="!scope.row[rowKey] ? false : true"
              placeholder="请输入"
              size="small"
            ></ElInput>
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
              :value="scope.row['productVariantList'].find(i => i.propertyName == item.label).propertyValue"
              @input="el => scope.row['productVariantList'].find(i => i.propertyName == item.label).propertyValue = el"
              :disabled="!scope.row[rowKey] ? false : true"
              placeholder="请输入"
              size="small"
            ></ElInput>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.id"
          v-else-if="item.type == 'btn'"
          align="center"
          :label="item.label"
        >
          <template slot-scope="scope">
            <ElButton
              style="width:90%;"
              size="small"
              :disabled="!scope.row[rowKey]? false : true"
              @click="item.fn(scope.$index,scope.row['productVariantList'].findIndex(i => i.propertyName == item.label), scope.row,item.value)"
            >{{scope.row['productVariantList'].find(i => i.propertyName == item.label).propertyValue || '请选择'}}</ElButton>
          </template>
        </el-table-column>
        <el-table-column
          width="450"
          :key="item.id"
          align="center"
          v-else-if="item.custom"
          :label="item.label"
        >
          <template slot-scope="scope">
            <div :key="indexKey">
              <div class="custom-wrap" v-demo="scope.row">
                <!-- <div
                  class="costom-item"
                  v-for="(i, index) in scope.row[item.btnListName]"
                  :key="i.id"
                >
                  <a :href="i.href" target="_blank" v-if="i.href">{{i.name}}</a>
                  <span v-else>{{i.name}}</span>
                  <i @click="handleClose(scope.$index, index, scope.row)" class="el-icon-close"></i>
                </div>-->
              </div>
              <div class="icon-wrap">
                <el-dropdown trigger="click" v-if="scope.row.hide">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="i in scope.row.hideList" :key="i.id">{{i.name}}</el-dropdown-item>
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
  </div>
</template>

<script>
import search from "./search";
export default {
  name: "custom-table",
  props: {
    selection: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: "id"
    },
    moreColumns: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => [
        {}
        // {
        //   label: "Date1",
        //   value: "date"
        // },
        // {
        //   label: "name1",
        //   value: "name"
        // },
        // {
        //   label: "操作",
        //   custom: true
        // },
        // {
        //   label: "颜色",
        //   value: "color",
        //   input: true
        // },
        // {
        //   label: "表格",
        //   columns: [{}],
        //   value: "table"
        // },
        // {
        //   label: "按钮操作",
        //   btns: [
        //     {
        //       name: "删除",
        //       fn(index, row) {
        //         console.log(index, row);
        //       }
        //     }
        //   ]
        // },
        // {
        //   label: "操作",
        //   btns: [
        //     {
        //       type: "dropdown",
        //       name: "下拉一",
        //       fn() {
        //         console.log("fdsaf");
        //       },
        //       children: [
        //         {
        //           name: "下拉二",
        //           fn(index, row) {
        //             console.log(index, row);
        //           }
        //         },
        //         {
        //           name: "下拉三",
        //           fn(index, row) {
        //             console.log(index, row);
        //           }
        //         }
        //       ]
        //     }
        //   ]
        // }
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
      indexKey: 0,
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
      selectData: []
    };
  },
  computed: {
    tableColumns: {
      get() {
        return [...this.columns, ...this.moreColumns];
      }
    }
  },
  methods: {
    selectChange(value) {
      this.selectData = value;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handlClick() {
      console.log(23);
    },
    handleClose(index, idx) {
      this.indexKey = Math.random();
      this.tableData[index].btnList.splice(idx, 1);
    }
  },
  components: {
    search
  }
};
</script>

<style lang='scss'>
.special-table {
  width: $box-width;
  margin: auto;
  .table-wrap {
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
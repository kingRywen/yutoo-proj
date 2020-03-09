<template>
  <div>
    <MainLayout
      :edit-btns="edits"
      :searchFields="searchFields"
      :searchData="searchData"
      :right-edit-btns="editBtns"
      :columns="columns"
      :leftTree="false"
      :treeTable="treeTable"
      :topBatchBtn="topBatchData"
      :searchFunc="searchFunc"
      :treeTableOtions="treeTableOtions"
      @selectChange="selectChange"
      ref="layout"
      url="product/prConsumablesList"
      @left-batch-change="leftBatchChange"
    ></MainLayout>
  </div>
</template>

<script>
import { downloadFile2 } from "Utils/tools";
export default {
  data() {
    return {
      treeTable: false,
      treeTableOtions: {},
      searchData: {},
      edits: [
        {
          name: "编辑",
          icon: "el-icon-edit-outline",
          show: scope => {
            return true; //scope.row.productStatus === 1
          },
          fn: scope => {
            // console.log(scope.row);
            this.$refs.layout.$dialog({
              title: "编辑",
              width: "1000px",
              params: {
                consumablesId: scope.row.consumablesId,
                type: "edit"
              },
              component: () => import("./dialogs/add.vue"),
              okBtnText: "确认",
              cancelBtnText: "取消"
            });
          }
        },
        {
          name: "删除",
          icon: "el-icon-edit-outline",
          fn: scope => {
            return this.deleteItem(scope.row.consumablesId);
          }
        },
        {
          name: "复制添加",
          icon: "el-icon-edit-outline",
          fn: scope => {
            return this.copyAdd(scope.row);
          }
        },
        {
          name: "操作日志",
          icon: "el-icon-edit-outline",
          fn: scope => {
            return this.operationLog();
          }
        }
      ],
      topBatchData: {
        title: "产品",
        props: {
          label: "label",
          value: "value",
          expandTrigger: "hover"
        },
        options: [{ label: "删除", value: 0 }, { label: "导出", value: 1 }],
        // 搜索
        consumablesSku: {
          field: "keyword",
          placeholder: "请输入自定义SKU、系统SKU、名称"
        }
      },
      firstType: "",
      searchFields: {
        firstType: {
          widget: "select",
          labelWidth: "44px",
          label: "类型",
          defaultVal: null, // 默认值
          change: value => {
            // console.log(value)
            this.$set(value, "secondType", null);
            console.log(value);
            if (!value.firstType) {
              this.searchFields.secondType.options = [];
            } else {
              this.searchFields.secondType.options = () => {
                return this.getSecondType();
              };
            }
          },
          options: () => {
            return this.getFirstType();
          },
          span: 8
        },
        secondType: {
          hidden: true,
          widget: "select",
          labelWidth: "80px",
          label: "二级类型",
          options: () => {
            return this.getSecondType();
          },
          span: 8
        },
        model: {
          hidden: true,
          widget: "input",
          labelWidth: "44px",
          label: "型号",
          span: 8
        },
        datetime: {
          hidden: true,
          widget: "daterange",
          label: "创建时间",
          time: true, // 是否显示时间
          span: 8,
          width: 300
        },
        creatorId: {
          widget: "select",
          labelWidth: "80px",
          label: "添加人员",
          options: () => {
            return this.getAddPeoplesOpts();
          },
          span: 8,
          hidden: true
        },
        purchaseUserId: {
          widget: "select",
          labelWidth: "80px",
          label: "采购人员",
          options: () => {
            return this.getPurchaseUserIdOpts();
          },
          span: 8,
          hidden: true
        },
        supplierId: {
          widget: "select",
          labelWidth: "60px",
          label: "供应商",
          options: () => {
            return this.getSupplierOpts();
          },
          span: 8,
          hidden: true
        }
      },
      columns: [
        {
          label: "自定义SKU",
          value: "consumablesSku",
          minWidth: 200
        },
        {
          label: "图片",
          value: "imgPath",
          img: true
        },
        {
          label: "产品类型",
          value: "platName"
        },
        {
          label: "产品名称",
          value: "nameCn",
          minWidth: 150
        },
        {
          label: "型号",
          value: "model",
          minWidth: 150
        },
        {
          label: "创建时间",
          value: "createTime",
          minWidth: 150,
          sortable: "custom"
        },
        {
          label: "价格",
          value: "price",
          minWidth: 150,
          sortable: "custom"
        },
        {
          label: "库存",
          value: "stock",
          sortable: "custom"
        },
        {
          label: "日均消耗",
          value: "daysConsume",
          sortable: "custom",
          minWidth: 150
        },
        {
          label: "添加人员",
          value: "userName"
        },
        {
          label: "采购人员",
          value: "purchaseUserName"
        }
      ],

      selctIds: [],

      editBtns: [
        {
          name: "新增耗材",
          perm: "add",
          fn: () => {
            this.$refs.layout.$dialog({
              title: "添加耗材",
              width: "1000px",
              component: () => import("./dialogs/add.vue"),
              okBtnText: "确认",
              cancelBtnText: "取消"
            });
          }
        }
      ]
    };
  },
  methods: {
    searchFunc(data) {
      //console.log(data);
      let { datetime, firstType, ...info } = data;
      this.firstType = firstType;
      let [createTimeStart, createTimeEnd] = datetime || [];
      return { createTimeStart, createTimeEnd, firstType, ...info };
    },
    leftBatchChange(v) {
      console.log(v);
      let val = v[0];
      switch (val) {
        case 0:
          this.deleteItem(this.selctIds);
          break;
        case 1:
          this.exportData();
          break;
        default:
          break;
      }
    },
    exportData() {
      console.log(11);
      this.$api[`product/prConsumablesExport`]({
        consumablesIds: this.selctIds
      }).then(data => {
        console.log(data);
        let { path } = data;
        console.log(path);
        downloadFile2(path, "耗材" + ".xls");
      });
    },
    selectChange(v) {
      //console.log(v);
      this.selctIds = v.map(i => {
        return i.consumablesId;
      });
    },
    deleteItem(v) {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let consumablesIds = Array.isArray(v) ? v : [v];
        this.$api[`product/prConsumablesRemove`]({
          consumablesIds
        }).then(res => {
          this.getLayoutList();
        });
      });
    },
    //操作日志
    operationLog() {
      this.$refs.layout.$dialog({
        title: "产品操作日志",
        width: "1000px",
        params: {
          modelLogType: 2
        },
        component: () => import("Views/modules/product/setup/common/log")
        // okBtnText: '确认',
        // cancelBtnText: '取消'
      });
    },
    copyAdd(v) {
      this.$refs.layout.$dialog({
        title: "添加耗材",
        width: "1000px",
        params: {
          type: "copyAdd",
          copyData: v
        },
        component: () => import("./dialogs/add.vue"),
        okBtnText: "确认",
        cancelBtnText: "取消"
      });
    },
    //获取采购人员
    getPurchaseUserIdOpts() {
      return this.$api[`product/permissionUserList`]({
        types: ["Purchase"]
      }).then(data => {
        //console.log(data);
        let { rows } = data;
        let arr = [];
        rows.forEach(i => {
          if (i.type === "Develop") {
            arr = i.users.map(i => {
              return {
                label: i.userName,
                value: i.userId
              };
            });
          }
        });
        return arr;
      });
    },
    //获取供应商
    getSupplierOpts() {
      return this.$api[`product/glSupplierGetComboBox`]({
        purchaseType: 1
      }).then(data => {
        //console.log(data);
        let { rows } = data;
        let arr = rows.map(i => {
          return {
            label: i.name,
            value: i.id
          };
        });
        return arr;
      });
    },
    //获取添加人员
    getAddPeoplesOpts() {
      return this.$api[`product/permissionUserList`]({
        types: ["ALL"]
      }).then(data => {
        let { rows } = data;
        let arr = [];
        rows.forEach(i => {
          if (i.type === "Develop") {
            arr = i.users.map(i => {
              return {
                label: i.userName,
                value: i.userId
              };
            });
          }
        });
        return arr;
      });
    },
    //获取一级分类
    getFirstType() {
      return this.$api[`product/glEnumList`]({
        enumName: "Consumables-First-Type"
      }).then(data => {
        //console.log(data);
        let { rows } = data;
        let arr = [];
        arr = rows.map(i => {
          return {
            label: i.labelCn,
            value: i.value
          };
        });
        return arr;
      });
    },
    //获取二级分类
    getSecondType() {
      if (!this.firstType && this.firstType !== 0) {
        return;
      }
      return this.$api[`product/glEnumList`]({
        parentEnumName: "Consumables-First-Type",
        parentValue: this.firstType
      }).then(data => {
        //console.log(data);
        let { rows } = data;
        let arr = [];
        arr = rows.map(i => {
          return {
            label: i.labelCn,
            value: i.value
          };
        });
        //console.log(arr);
        return arr;
      });
    }
  },
  created() {},
  watch: {
    firstType(v) {
      this.$set(this.searchFields.secondType, "options", () => {
        return this.getSecondType();
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

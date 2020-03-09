<template>
  <div class="data-box">
    <y-template>
      <!-- <div slot="ScreenBack" class="screen-back">
                    <div>筛选条件</div>
                    <div class="back" @click="backPage"><i class="el-icon-back"></i>返回</div>
                </div> -->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item prop="showType" key="showType-1">
          <el-select v-model="listQuery.showType" placeholder="显示方式" size="mini" @change="changeShowType">
            <el-option label="统计展示" value="0"></el-option>
            <el-option label="曲线展示" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="parentAsins" v-if="listQuery.showType==0" key="parentAsins-2" class="collapse-tags">
          <el-select v-model="listQuery.parentAsins" placeholder="输入或选择参品" size="mini" multiple collapse-tags @change="changeParentAsins">
            <el-option v-for="item in parentAsins" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="parentAsin" v-if="listQuery.showType==1" label=" " :rules="[
                        { required: true, message: '请选择参品', trigger: 'blur' },
                    ]" key="parentAsin-3">
          <el-select v-model="listQuery.parentAsin" placeholder="输入或选择参品" size="mini">
            <el-option v-for="item in parentAsin" :key="item.key" :label="item.value" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="columnTypes" key="columnTypes-4" class="collapse-tags">
          <el-select v-model="listQuery.columnTypes" placeholder="数据项" size="mini" multiple collapse-tags @change="changeColumnTypes">
            <el-option v-for="item in columnOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="statTime" v-if="listQuery.showType==0" label=" " :rules="[
                        { required: true, message: '请选择统计时间', trigger: 'blur' },
                    ]" key="statTime-5">
          <el-date-picker v-model="listQuery.statTime" type="date" placeholder="选择日期" size="mini" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="daterange" v-if="listQuery.showType==1" label=" " :rules="[
                        { required: true, trigger: ['blur', 'change'],validator:customValidate},
                    ]" key="daterange-6">
          <el-date-picker v-model="listQuery.daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item prop="multipleFrequency" v-if="listQuery.showType==1" class="multiple-frequency-form-item" label=" " :rules="[
                        { required: true, message: '请输入倍抓取频率', trigger: 'blur' },
                    ]" key="multipleFrequency-7">
          <el-input v-model.trim="listQuery.multipleFrequency" placeholder="请输入内容" size="mini" clearable></el-input>
          <span>倍抓取频率</span>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" :loading="$store.state.isloading || $store.state.loading" @click="distribute('确认搜索')" icon="el-icon-search">搜索</el-button>
          <el-button size="small" type="primary" plain  :disabled="$store.state.isloading || $store.state.loading"  @click="distribute('重置搜索')">重置搜索</el-button>
        </el-form-item>
      </el-form>
    </y-template>

    <!-- :p-params="pQuery" -->
    <component :is="componentName" ref="queryComponent" @loading="val => loadingbtn = val" :p-querys="pQuery"></component>

  </div>
</template>
<script>
import YTemplate from "../Common/y-template/index";
import DataTpl from "./data";
import ChartTpl from "./chart";
const columnTypesComm = [
  { value: "ALL_SELECT", label: "全部" },
  { value: "0", label: "大类BSR" },
  { value: "1", label: "评分" },
  { value: "2", label: "总评价数" },
  { value: "3", label: "新增评价数" },
  { value: "4", label: "AQ数" },
  { value: "5", label: "AQ新增数" },
  { value: "6", label: "日新增差评数" },
  { value: "7", label: "霸占排名子sku价格" },
  { value: "8", label: "子sku数" },
  { value: "9", label: "FIT率" },
  { value: "10", label: "中差评日新增HELPFULL" },
  { value: "11", label: "好评日新增HELPFULL" }
];
const columnTypes0 = [
  { value: "12", label: "搜索词在标题中出现情况" },
  { value: "13", label: "搜索词在卖点中出现情况" },
  { value: "14", label: "类目" },
  { value: "15", label: "已上架天数" },
  { value: "16", label: "发货方式" }
];
const columnTypes1 = [
  { value: "15", label: "已上架天数" },
  { value: "17", label: "自然搜索排名" },
  { value: "18", label: "图片数" },
  // {value:'19',label:'跟卖情况【实际展示跟卖卖家数】'},
  { value: "19", label: "跟卖情况" },
  { value: "20", label: "BSR排名" },
  { value: "21", label: "评分排名" },
  { value: "22", label: "总评价数排名" },
  { value: "23", label: "新增评价数排名" },
  { value: "24", label: "价格排名" },
  { value: "25", label: "AQ数排名" }
];
const _ = require("lodash");
const dayjs = require("dayjs");
export default {
  components: {
    YTemplate,
    DataTpl,
    ChartTpl
  },
  props: ["pParams"],
  data() {
    let self = this;
    return {
      loadingbtn: false,
      pickerOptions: {
        disabledDate(time) {
          let createTime = self.pParams.createTime;
          if (createTime !== null) {
            createTime = createTime.slice(0, 10);
            // 创建时间 到 今天
            return (
              time.getTime() > Date.now() ||
              time.getTime() < Date.parse(dayjs(createTime))
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      customValidate: (rule, value, callback) => {
        console.log(this.pParams);
        if (!value) {
          return callback(new Error("请选择日期"));
        } else {
          let createTime = this.pParams.createTime;
          if (createTime !== null) {
            createTime = createTime.slice(0, 10);
            if (dayjs(createTime) > dayjs(value[0])) {
              return callback(new Error(`开始时间不能小于创建时间`));
            }
          }
        }
        callback();
      },
      componentName: "DataTpl",
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      columnOptions: [],
      oldColumnOptions: ["ALL_SELECT"],

      parentAsins: [],
      oldParentAsins: [],
      parentAsin: [],
      listQuery: {
        showType: "0",
        parentAsins: [],
        columnTypes: [],
        statTime: null,

        daterange: null,
        parentAsin: null,
        multipleFrequency: 1
      },
      pQuery: {},
      columnTypes0Val: [],
      columnTypes1Val: []
      // columnMap:null
    };
  },
  watch: {
    "listQuery.showType"(val) {
      if (val == 0) {
        this.getColumnTypes0();
        this.listQuery.columnTypes = this.columnTypes0Val;
      } else if (val == 1) {
        let columnOptions = [];
        columnTypesComm.forEach(element => {
          columnOptions.push(element);
        });
        columnTypes1.forEach(element => {
          columnOptions.push(element);
        });
        this.columnOptions = columnOptions;
        this.pQuery.columnOptions = this.columnOptions;
        this.listQuery.columnTypes = this.columnTypes1Val;
        // this.setcolumnMap()
      }
    }
  },

  created() {
    this.getColumnTypes0();
    this.getProductSelectList();
    let createTime = this.pParams.createTime;

    if (createTime) {
      createTime = createTime.slice(0, 10);
      let endTime = this.pParams.updateTime;
      //console.log(this.pParams.updateTime);
      this.listQuery.statTime = endTime;
      this.listQuery.daterange = [createTime, endTime];
    }

    let columnTypes0Val = [];
    let columnTypes1Val = [];
    columnTypesComm.forEach(element => {
      columnTypes0Val.push(element.value);
      columnTypes1Val.push(element.value);
    });
    columnTypes0.forEach(element => {
      columnTypes0Val.push(element.value);
    });
    columnTypes1.forEach(element => {
      columnTypes1Val.push(element.value);
    });
    this.columnTypes0Val = columnTypes0Val;
    this.columnTypes1Val = columnTypes1Val;

    this.listQuery.columnTypes = columnTypes0Val;

    this.$nextTick(function(){
        this.handleFilter();
    });
  },

  methods: {
    getColumnTypes0() {
      let columnOptions = [];
      columnTypesComm.forEach(element => {
        columnOptions.push(element);
      });
      columnTypes0.forEach(element => {
        columnOptions.push(element);
      });
      this.columnOptions = columnOptions;
      this.pQuery.columnOptions = this.columnOptions;
      // this.listQuery.columnTypes
      // this.setcolumnMap()
    },

    changeColumnTypes(val) {
      // https://www.cnblogs.com/zhenggaowei/p/9828364.html
      this.changeSelect(
        val,
        "columnOptions",
        "oldColumnOptions",
        "columnTypes"
      );
      this.$refs.queryComponent.setColumnTypes(this.listQuery.columnTypes);
      //    this.pQuery.columnTypes=val
    },
    changeParentAsins(val) {
      this.changeSelect(val, "parentAsins", "oldParentAsins", "parentAsins");
    },
    changeSelect(val, options, oldOptions, param) {
      const allValues = [];
      // 保留所有值
      for (const item of this[options]) {
        if (options === "parentAsins") {
          allValues.push(item.key);
        } else {
          allValues.push(item.value);
        }
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal = this[oldOptions].length === 1 ? this[oldOptions][0] : [];
      // 若是全部选择
      if (val.includes("ALL_SELECT")) this.listQuery[param] = allValues;
      // 取消全部选中 上次有 当前没有 表示取消全选
      if (oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT"))
        this.listQuery[param] = [];
      // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes("ALL_SELECT") && val.includes("ALL_SELECT")) {
        const index = val.indexOf("ALL_SELECT");
        val.splice(index, 1); // 排除全选选项
        this.listQuery[param] = val;
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes("ALL_SELECT") && !val.includes("ALL_SELECT")) {
        if (val.length === allValues.length - 1)
          this.listQuery[param] = ["ALL_SELECT"].concat(val);
      }
      // 储存当前最后的结果 作为下次的老数据
      this[oldOptions][0] = this.listQuery[param];
    },
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.handleFilter();
        break;

        case "重置搜索":
          this.resetHandleFilter();
        break;
      }
    },
    // initPage(){
    //     if (this.sellerId && this.siteId) {
    //         this.listQuery.siteId =  this.siteId
    //         this.listQuery.sellerId =this.sellerId
    //         this.getList()
    //     }
    // },

    getProductSelectList() {
      this.$api["krResearchProductSelectList"]({
        taskId: this.pParams.taskId
      }).then(res => {
        let { code, data } = res;
        if (code == 0) {
          this.parentAsin = data;

          let parentAsins = _.cloneDeep(data);
          parentAsins.unshift({ value: "全部", key: "ALL_SELECT" });
          this.parentAsins = parentAsins;

          let tmpAsins = ["ALL_SELECT"];
          parentAsins.forEach(element => {
            tmpAsins.push(element.key);
          });
          this.listQuery.parentAsins = tmpAsins;
        }
      });
    },
    changeShowType(val) {
      if (val === "0") {
        this.componentName = "DataTpl";
      } else if (val === "1") {
        this.componentName = "ChartTpl";
        // chart 不能显示 出现这个应该是 tab页的原因
      }
    },
    // setcolumnMap(){
    //     // let columnMap =new Map()
    //     // this.columnOptions.forEach(element => {
    //     //     columnMap.set(element.value,element.label)
    //     // });

    //     // // columnMap.remove("ALL_SELECT")
    //     // this.pQuery.columnMap=columnMap
    //     this.pQuery.columnOptions=this.columnOptions
    //     // this.columnMap =columnMap
    //     // alert()
    //     // console.log(columnMap)
    // },
    resetHandleFilter(){
      this.$refs.listQueryForm.resetFields()
      this.handleFilter()
    },
    handleFilter() {
      this.$refs["listQueryForm"].validate(valid => {
        if (valid) {
          let showType = this.listQuery.showType;
          let params = {
            taskId: this.pParams.taskId,
            columnTypes: this.listQuery.columnTypes
          };
          if (showType == 0) {
            params.statTime = this.listQuery.statTime;
            params.parentAsins = this.listQuery.parentAsins;
          } else if (showType == 1) {
            let daterange = this.listQuery.daterange;
            if (daterange !== null && daterange.length === 2) {
              params.startTime = daterange[0];
              params.endTime = daterange[1];
            } else {
              params.startTime = null;
              params.endTime = null;
            }
            params.parentAsin = this.listQuery.parentAsin;
            params.multipleFrequency = parseInt(
              this.listQuery.multipleFrequency
            );
          }
          this.$refs.queryComponent.handleFilter(params);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }

    // backPage(){
    //     this.$router.push({
    //         path: '/RankingResearch',
    //     })
    // }
  }
};
</script>
<style lang="less" scoped>
.data-box {
  .template-box {
    border: none;
    padding: 0;
    /deep/.screen-info,
    /deep/.el-table {
      border-left: none;
      border-right: none;
    }

    .el-pagination {
      margin-left: 10px;
    }
    .screen-info {
      .el-select,
      .el-date-editor {
        width: 170px;
      }
      .collapse-tags {
        .el-select {
          width: 240px;
        }
      }
      .el-range-editor {
        width: 220px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
      .multiple-frequency-form-item {
        /deep/.el-form-item__content {
          width: 250px;
        }
        /deep/.el-input {
          width: 170px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>

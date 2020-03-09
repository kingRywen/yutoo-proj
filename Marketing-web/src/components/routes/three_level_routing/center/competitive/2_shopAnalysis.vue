<!-- 店铺分析主页 -->
<template>
  <div class="shopCon">
    <el-row :gutter="16" class="h100 h100_box">
      <el-col :sm="8" :xs="8" :xl="4" :lg="4" :md="6" class="h100 left">
        <GroupTree @nodeclick="getSalesAnalysisList" :data="groupList" ref="tree" :show="show" @toggle="val => show = val" />
      </el-col>
      <el-col :sm="!show ? 24 : 16" :xs="!show ? 24 : 16" :xl="!show ? 24 : 20" :lg="!show ? 24 : 20" :md="!show ? 24 : 18" :class="['h100', 'right', {'no-border': !show}]">
        <div class='keywordIndexContainer shopAnalysisContainer __wrapper_i'>
          <section class="parentPosition">
            <!-- 添加产品弹窗 -->
            <el-dialog :close-on-click-modal="false" title="添加店铺" :visible.sync="dialogShow.dialogFormVisible" width="600px">
              <!-- <section style="position:relative">
        <div class="timeCss">
          <span> {{this.point.charge}}点/每次</span>
        </div> -->
              <div slot="title">
                <span class="el-dialog__title">添加店铺</span>
                <span class="timeCss"> {{this.point.charge}}点/每次</span>
              </div>
              <!-- <span class="dialogTips">
              <span style="position:relative;left:-11px;"> 温馨提示，多个店铺ID用换行或逗号分隔</span>
            </span> -->
              <div class='box __box_wrapper'>
                <el-form :model="dialogData" :rules="rules" ref="ruleForm" style="width:100%;">
                  <el-form-item label="选择分组:" prop="groupId" :label-width="formLabelWidth" style="width:100%;" class="__flex_wrapper_right">
                    <el-cascader change-on-select :options="selectGroup" style="width:100%" v-model="dialogData.groupId" :props="addProjectFormOpts"></el-cascader>
                    <el-button type="primary" @click="handleAdd">添加分组</el-button>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="店铺ID:" prop="textarea" :label-width="formLabelWidth" style="width:100%;">
                    <!-- <el-input type="textarea" :rows="4" placeholder="多个店铺ID换行输入，或用逗号分隔" v-model="dialogData.textarea" style="width:100%;">
                  </el-input> -->
                    <el-input type="text" placeholder="店铺ID" v-model="dialogData.textarea" style="width:100%;">
                    </el-input>
                    <!-- <div class="_fontSize" v-model="fontSum">已输入 {{fontSum||0}} 个</div> -->
                  </el-form-item>
                  <!-- 是否马上添加到监控 -->
                  <el-form-item :label-width="formLabelWidth" style="width:100%;">
                    <el-checkbox v-model="dialogData.checked">是否添加监控</el-checkbox>
                    <div class="block" v-show="dialogData.checked" style="width:100%;">
                      <el-date-picker unlink-panels :picker-options="pickerOptions" v-model="dialogData.datePickValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width:100%;">
                      </el-date-picker>
                    </div>
                  </el-form-item>
                  <el-form-item :label-width="formLabelWidth" style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click="showPoint('ruleForm')" :loading="buttonLoading.add">{{buttonLoading.addText}}</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <!-- <div class='dialog-footer' style='text-align:center;margin-top:20px;'>
          <el-button type="primary" class="addTaskSubmitStyle" size="large" @click="addProduct('ruleForm')">确认</el-button>
        </div> -->
              <!-- </section> -->
            </el-dialog>
            <!-- 添加监控弹窗 -->
            <el-dialog :close-on-click-modal="false" title="添加监控" :visible.sync="dialogShow.dialogMonitorVisible" width="600px">
              <div class='dialogContent' style="overflow:hidden;">
                <div style="margin-top:15px;">
                  <div class="block" style='margin-top:15px;display:flex;justify-content:center'>
                    <el-date-picker unlink-panels :picker-options="pickerOptions" v-model="dialogData.monitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                </div>
                <div class='saveContainer' style='text-align:center;margin-top:40px;'>
                  <el-button type="primary" size="large" style='width:50%' @click="addChartMoni">确认</el-button>
                </div>
              </div>
            </el-dialog>
            <el-row>
              <el-button type="success" @click="dialogShow.dialogFormVisible = true">添加店铺</el-button>
              <el-button type="success" @click="showAddMonitoring('add')">添加监控</el-button>
              <el-button type="success" @click="showAddMonitoring('change')" style="width:140px">修改监控周期</el-button>
              <el-button type="success" plain @click="cancelMonitoring">取消监控</el-button>
              <el-button type="success" plain @click="deleteProduct">删除</el-button>
              <el-button type="success" plain @click="moveOut()">移出分组</el-button>
              <el-button type="success" plain @click="moveTo()">移动分组</el-button>
            </el-row>
            <!-- 布局 -->
            <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
              <!-- 输入框 -->
              <el-col :lg="{span:10}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
                <el-input placeholder="店铺ID" v-model.trim="inputText" clearable style='max-width:150px;'>
                </el-input>
                <!-- <el-input placeholder="卖家名称" v-model="inputText" clearable style='max-width:200px;'>
        </el-input> -->
                <!-- 搜索按钮 -->
                <!-- <el-button type="success" icon="el-icon-search" @click="searchProduct" :disabled="inputText.length>0?false:true">搜索</el-button> -->
                <el-button type="success" icon="el-icon-search" @click="searchProduct">搜索</el-button>
              </el-col>
              <!-- 时间段选择 -->
              <el-col :lg="{span:14}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
                <dateRange :DateMsg="DateMsg" v-on:hart3-date="getChildDate" :changeTime="changeTime"> </dateRange>
                <el-radio-group v-model="tabPosition" @change="useWhichTabs">
                  <el-radio-button label="0">今日</el-radio-button>
                  <el-radio-button label="7">7天</el-radio-button>
                  <el-radio-button label="30">30天</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>

            <!-- 表格数据 -->
            <el-table :max-height="12000" v-loading="shopTableLoading" stripe ref="Table" :data="listData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
              <el-table-column type="selection">
              </el-table-column>
              <!-- 单选 -->
              <!-- <el-table-column width="50" align='center' style="position:relative">
                <template scope="scope">
                  <el-radio :label="scope.row.taskId" v-model="templateRadio" @change.native="handleSelectionChange(scope.$index,scope.row)" style="position:absolute;left:17px;top:19px;">&nbsp</el-radio>
                </template>
              </el-table-column> -->
              <el-table-column prop="groupName" label="分组名称" align='center' width="125px">
                <template slot-scope="scope">
                  {{scope.row.groupName ? scope.row.groupName : '未分组'}}
                </template>
              </el-table-column>
              <el-table-column label="店铺ID" align='center' width="250px">
                <template slot-scope="scope">
                  <a rel="noopener noreferrer nofollow" class="aLink" target="_blank" :href="scope.row.sellerUrl?scope.row.sellerUrl:false" style="text-decoration:none;">{{ scope.row.sellerId!=""?scope.row.sellerId:"-"}}</a>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="imageUrl" label="图片" align='center'>
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl?scope.row.imageUrl:''" alt="" style="width: 70px;height: 70px">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" align='center'>
      </el-table-column>
      <el-table-column prop="category" label="类目" align='center'>
      </el-table-column> -->
              <el-table-column prop="sellerName" label="卖家" align='center'>
                <template slot-scope="scope">
                  <div class="fix__row_2" v-if="scope.row.sellerName === '' || scope.row.sellerName == null">{{scope.row.sellerName | _formatData}}</div>
                  <el-tooltip v-else placement="top" :content="scope.row.sellerName">
                    <div class="fix__row_2">
                      <span>{{ scope.row.sellerName!=""?scope.row.sellerName:""}}
                      </span>
                    </div>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="监控状态" align='center' width="80px">
                <template slot-scope="scope">{{ scope.row.monitorFlag===0?"关闭":scope.row.monitorFlag==1?"开启":scope.row.monitorFlag }}</template>
              </el-table-column>
              <el-table-column label="监控起止时间" align='center' width="265px">
                <template slot-scope="scope">{{ scope.row.monitorFrom?scope.row.monitorFrom.slice(0,10)+"~"+scope.row.monitorTo.slice(0,10):"-" }}</template>
              </el-table-column>
              <el-table-column prop="status" label="状态" align='center'>
                <template slot-scope="scope">{{ scope.row.status===2?"抓取成功":scope.row.status===0?"抓取中...":scope.row.status===1?"抓取中...":scope.row.status!==0||scope.row.status!==1||scope.row.status!==2?"抓取失败":"--" }}</template>
              </el-table-column>
              <el-table-column prop="handle" label="操作" align='center'>
                <template slot-scope="scope">
                  <el-button @click="handleClick(scope.$index,scope.row)" type="primary" v-if="scope.row.buttonText">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block" style='margin-top:20px;'>
              <PageVue v-bind:childPages="page" v-on:size-change="getSizeChange" v-on:current-page="getPage"></PageVue>
            </div>
          </section>
          <el-point :data="pointData">
            <el-button type="primary" :style="pointData.witdh" :loading="pointData.loading" @click="pointData.func(pointData.formName)">{{pointData.text}}</el-button>
          </el-point>

          <!-- 添加分组 -->
          <CommonDialog :modal-obj="addGroupObj">
            <el-form :model="addGroupModel" ref="addGroupModel">
              <el-form-item label="分组名称" label-width="100px" prop="groupName" :rules="$.getRule('请填写分组名称')">
                <el-input v-model="addGroupModel.groupName" placeholder=""></el-input>

              </el-form-item>
              <el-form-item label="选择上级分组" label-width="100px">
                <el-cascader change-on-select :options="selectNoUndefinedGroup" style="width:100%" v-model="addGroupModel.groupId" :props="addProjectFormOpts"></el-cascader>
              </el-form-item>
              <el-form-item style="text-align:center">
                <el-button type="primary" @click="addGroup">确认添加</el-button>
              </el-form-item>
            </el-form>
          </CommonDialog>

          <!-- 移动分组 -->
          <CommonDialog :modal-obj="moveGroupObj">
            <el-form :model="moveGroupModel">
              <el-form-item label="选择分组" label-width="100px">
                <el-row :gutter="12">
                  <el-col :span="18">
                    <el-cascader change-on-select :options="selectGroup" style="width:100%" v-model="moveGroupModel.groupId" :props="addProjectFormOpts"></el-cascader>
                  </el-col>
                  <el-col :span="5">
                    <el-button type="primary" @click="handleAdd">添加</el-button>
                  </el-col>
                </el-row>

              </el-form-item>
              <el-form-item style="text-align:center">
                <el-button type="primary" @click="moveGroup">确认移动</el-button>
              </el-form-item>
            </el-form>
          </CommonDialog>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// todoi
import { mapActions, mapGetters } from "vuex";
import dateRange from "@/components/common/listDatePicker";
import GroupTree from "@/components/common/GroupTree";
import CommonDialog from "@/components/common/commonDialog";
import { getGroupingList } from "@/api/globalGroup";
import {
  getDay,
  Trim,
  removeArrEmpty,
  getItemFromArr
} from "@/api/functions.js";
import {
  shopIndexDefaultDay,
  ShopAnalysisListurl, //列表
  ShopAnalysisSaveUrl, //添加店铺
  ShopMonitoringUrl, //添加监控
  changeShopMonitoringUrl, //修改监控周期
  ShopAnalysisRemoveMonitor, //取消监控
  ShopAnalysisRemoveUrl, // 删除店铺
  FunctionMktShopAnalysisList
} from "../../../../../api/myApi";
import PageVue from "../../../../common/page.vue";
export default {
  components: {
    PageVue,
    GroupTree,
    CommonDialog,
    dateRange
  },
  provide() {
    return {
      updateTreeData: this.updateTreeData,
      createNode: this.createNode,
      deleteNodes: this.deleteNodes,
      setState: this.setState
    };
  },
  data() {
    var validateSku = (rule, value, callback) => {
      if (!value) {
        callback(new Error("输入不能为空"));
        return;
      }
      if (value == null || value == undefined) return;
      // let val = value
      //   .split(/[\n|\r\n|\,|\，]/)
      //   .map(el => el.trim())
      //   .filter(el => el !== "");
      let val = value.trim();
      // this.skusArr = val;

      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;,，'[\]]/gi;
      // let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let reg = /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{0,100}$/;
      let changePlatformd = this.$store.state.common.savePlatformIdAndSiteId.split(
        ","
      )[0];
      let str = "店铺ID，只能是大写字母和数字组合";
      if (changePlatformd == 2) {
        reg = /^[0-9]{12,12}$/;
        str = "请输入12位纯数字";
      } else if (changePlatformd == 3) {
        reg = /^[0-9]{11,11}$/;
        str = "请输入11位纯数字";
      }
      // if (!val.every(el => reg.test(el))) {
      if (!reg.test(val)) {
        callback(new Error(str));
      } else if (
        // val.some(el => regEn.test(el)) ||
        // val.some(el => regCn.test(el))
        regEn.test(val) ||
        regCn.test(val)
      ) {
        callback(new Error("不能包含特殊字符"));
      } else {
        callback();
      }
    };
    return {
      show: true,
      templateRadio: null,
      addGroupObj: {
        show: false,
        title: "添加分组"
      },
      addProjectFormOpts: {
        value: "groupId",
        label: "groupName",
        children: "groupingVOS"
      },
      addGroupModel: {},
      moveGroupObj: {
        show: false,
        title: "移动分组"
      },
      moveGroupModel: {},
      groupList: [],
      // pointData 扣点明细
      pointData: {
        witdh: "60%",
        text: "确 定",
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      buttonLoading: {
        add: false,
        addText: "确定",
        addmonitor: false,
        changemonitor: false
      },
      formLabelWidth: "100px",
      fontSum: null,
      skusArr: [],
      // 日期选择框
      DateMsg: {
        DateValue: null,
        type: "daterange"
      },
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      point: {
        surplusAmount: null, //剩余点数
        charge: null //点数
      },
      dialogShow: {
        dialogFormVisible: false,
        dialogMonitorVisible: false,
        dialogMonitorType: ""
      },
      // 弹窗数据
      dialogData: {
        textarea: "",
        checked: true,
        datePickValue: "", // 添加产品的时间数组
        monitorDateValue: "" // 添加监控的时间数组
      },
      StatusValue: "",
      // 时间段
      tabPosition: "",
      tabPositionCopy: "",
      inputShop: "",
      inputText: "",
      tableHandle: {
        multipleSelection: [],
        selectTaskIdArr: [],
        // 记录是搜索返回的数据，还是列表数据 1列表数据，-1搜索数据
        tableType: "-1"
      },
      groupType: 3,
      page: {
        Size: 10,
        currentPage: 1,
        total: 0,
        pageNo: 1,
        totalPages: 1
      },
      // asin添加验证
      rules: {
        textarea: [
          {
            required: true,
            message: "请输入店铺ID",
            trigger: ["blur", "change"]
          },
          // { min: 1, max: 500, message: "最多只能输入500个", trigger: "blur" }, //限定输入的个数
          { validator: validateSku, trigger: ["blur", "change"] } //限定输入的个数
        ],
        groupId: [
          {
            required: true,
            message: "请选择分组",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    // 请求点数
    this.getChargeApi();
    // 获取分组
    this.updateTreeData();
    // todoc
    this.changeTabPosition(
      this.tabPosition,
      this,
      parseInt(this.$route.query.currentPage),
      parseInt(this.$route.query.Size)
    );
    // setInterval(() => {
    //   this.changeTabPosition(this.tabPosition, false);
    // }, 30000); // 竞争分析和店铺分析不用定时刷新页面
  },
  computed: {
    ...mapGetters("common", ["platformId", "siteId"]),
    listData() {
      return this.$store.state.competitive.shopAnalysisList.rows;
    },
    shopTableLoading() {
      return this.$store.state.competitive.shopTableLoading;
    },
    selectGroup() {
      if (!this.groupList.length) {
        return;
      }
      const vos = JSON.parse(JSON.stringify(this.groupList[0].groupingVOS));
      return vos;
    },
    selectNoUndefinedGroup() {
      if (!this.groupList.length) {
        return;
      }
      const vos = JSON.parse(JSON.stringify(this.groupList[0].groupingVOS));
      const index = vos.findIndex(el => el.groupId === -1);
      vos.splice(index, 1);
      return vos;
    }
  },
  watch: {
    skusArr(val) {
      if (val.length) {
        this.fontSum = val.length;
      } else {
        this.fontSum = null;
      }
    },
    // "page.Size"() {

    // },
    // "page.currentPage"() {

    // },
    inputText(a) {
      this.page.currentPage = 1;
      if (a == "") {
        this.getAll();
      }
    }
    // 监控日期组件
    // "DateMsg.DateValue"(newVal, oldVal) {
    //   this.page.currentPage = 1;
    //   this.page.Size = 10;
    //   if (!newVal) {
    //     return;
    //   }
    //   // 如果是日期发生改变，不是清除日期
    //   if (newVal) {
    //     if (this.tableHandle.tableType == -1) {
    //       this.changeTabPosition(
    //         this.tabPosition,
    //         this,
    //         null,
    //         null,
    //         newVal[0],
    //         newVal[1]
    //       );
    //     }
    //     if (this.tableHandle.tableType == 1) {
    //       let txt = Trim(this.inputText, "");
    //       this.searchTabPosition(
    //         this.tabPosition,
    //         this,
    //         null,
    //         null,
    //         txt,
    //         newVal[0],
    //         newVal[1]
    //       );
    //     }
    //     this.tabPosition = "";
    //   }
    // }
  },
  methods: {
    ...mapActions("competitive", [
      "actionGetShopAnalysisList",
      "actionSearchShopAnalysisList"
    ]),
    getSalesAnalysisList() {
      this.changeTabPosition(
        this.tabPosition,
        this,
        parseInt(this.$route.query.currentPage),
        parseInt(this.$route.query.Size)
      );
    },
    updateTreeData(cb) {
      getGroupingList({ groupType: this.groupType })
        .then(data => {
          this.groupList = [data];
        })
        .then(res => {
          if (cb) {
            cb();
          }
        });
    },

    // 创建分组数据
    createNode(data, type, cb) {
      const { platformId, siteId, groupType } = this;
      const { parentGroupId = 0, groupName, groupId } = data;

      if (type) {
        return this.$axios
          .post("/Grouping/updateName", {
            groupId,
            groupName
          })
          .then(res => {
            this.$.handlerCode(
              res,
              () => {
                cb();
              },
              true
            );
          });
      }

      this.$axios
        .post("/Grouping/save", {
          platformId,
          siteId,
          groupType,
          parentGroupId,
          groupName
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.updateTreeData(cb);
              this.addGroupObj.show = false;
            },
            true
          );
        });
    },
    // 删除分组数据
    deleteNodes(groupIds) {
      this.$axios
        .post("/Grouping/remove", {
          groupIds,
          groupType: this.groupType
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.updateTreeData();
            },
            true
          );
        });
    },
    // 添加分组
    addGroup() {
      let vm = this;
      vm.$refs.addGroupModel.validate(v => {
        if (v) {
          const arr = vm.addGroupModel.groupId;
          const parentGroupId = vm.addGroupModel.groupId
            ? vm.addGroupModel.groupId.slice().pop()
            : 0;
          const { groupName } = vm.addGroupModel;
          vm.createNode({ parentGroupId, groupName }, null, res => {
            let lastId = vm.$.findGroupIdsByName(
              groupName,
              arr,
              vm.selectGroup
            );
            vm.$set(
              vm.dialogData,
              "groupId",
              arr ? [...arr, lastId] : [lastId]
            );
            vm.$set(
              vm.moveGroupModel,
              "groupId",
              arr ? [...arr, lastId] : [lastId]
            );
          });
        }
      });
    },

    // 移出分组
    moveOut(groupId = -1) {
      if (!this.tableHandle.multipleSelection.length) {
        this.$message.warning("请选择后进行操作");
        return;
      }
      const taskIds = this.tableHandle.multipleSelection.map(el => el.taskId);
      // this.$confirm("是否将选择项移出当前分组？", "提示", {
      //   type: "warning"
      // })
      //   .then(() => {
      this.$axios
        .post("/ShopAnalysis/updateGroup", {
          taskIds,
          groupId: groupId
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.moveGroupObj.show = false;
              this.changeTabPosition(
                this.tabPosition,
                this,
                parseInt(this.$route.query.currentPage),
                parseInt(this.$route.query.Size)
              );
              this.updateTreeData();
            },
            true
          );
        });
      // })
      // .catch(() => {});
    },

    // 移动分组弹窗
    moveTo() {
      if (!this.tableHandle.multipleSelection.length) {
        this.$message.warning("请选择后进行操作");
        return;
      }
      this.moveGroupObj.show = true;
    },

    // 确认移动
    moveGroup() {
      this.moveOut(
        this.moveGroupModel.groupId
          ? this.moveGroupModel.groupId.slice().pop()
          : -1
      );
    },

    handleAdd() {
      this.addGroupObj.show = true;

      this.$nextTick(() => {
        this.addGroupModel = {};
        this.$refs.addGroupModel.resetFields();
      });
    },

    changeTime(val) {
      this.page.currentPage = 1;
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        // return this.getkeywordApi();
        if (this.tableHandle.tableType == -1) {
          return this.changeTabPosition(this.tabPosition, this, 1);
        } else if (this.tableHandle.tableType == 1) {
          let txt = Trim(this.inputText, "");
          return this.searchTabPosition(this.tabPosition, this, 1, null, txt);
        }
      }

      const [start, end] = val;
      // console.log($.formatTime(end + 7 * 24 * 3600 * 1000, "{y}/{m}/{d}"));
      if (
        $.formatTime(start, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 1;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 7 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 7;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 30 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 30;
      } else {
        this.tabPosition = null;
      }
      if (this.tableHandle.tableType == -1) {
        return this.changeTabPosition(
          this.tabPosition,
          this,
          1,
          null,
          this.DateMsg.DateValue[0],
          this.DateMsg.DateValue[1]
        );
      } else if (this.tableHandle.tableType == 1) {
        let txt = Trim(this.inputText, "");
        return this.searchTabPosition(
          this.tabPosition,
          this,
          1,
          null,
          txt,
          this.DateMsg.DateValue[0],
          this.DateMsg.DateValue[1]
        );
      }
    },
    //获取子组件传来的日期
    getChildDate(msg) {
      this.DateMsg.DateValue = msg;
    },
    // 请求点数
    getChargeApi() {
      this.$axios.post(FunctionMktShopAnalysisList).then(res => {
        // console.log(res, "店铺分析扣点");
        // this.point.surplusAmount = res.data.data.surplusAmount;
        this.point.charge = res.data.data.charge;
      });
    },
    // input的值为空，则代表以展示列表的形式切换分页和tabs，但input有值并不代表就是搜索列表。还要在搜索返回数据之后切换成1
    getAll() {
      this.tableHandle.tableType = "-1";
      this.changeTabPosition(
        this.tabPosition,
        this,
        parseInt(this.$route.query.currentPage),
        parseInt(this.$route.query.Size)
      );
    },
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    // 添加店铺id
    addTaskSubmit(formName, point) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            type: point,
            platformId: 1,
            groupId: this.dialogData.groupId.slice().pop(),
            sellerIds: this.dialogData.textarea,
            monitorFlag: this.dialogData.checked === true ? 1 : 0
          };
          let skuArr = params.sellerIds.replace(/\n/g, ",").split(","); // ["1 2", "2", "3", "4", "", "", "", ""]
          let newskuArr = [];
          skuArr.forEach((v, i) => {
            let vStr = Trim(v, "g"); //functions
            newskuArr.push(vStr);
          });
          params.sellerIds = new Set(removeArrEmpty(newskuArr)); //functions
          if (params.sellerIds == "") {
            this.$message({ type: "warning", message: "请选择监控起始时间" });
            return;
          }
          // console.log(params.sellerIds); // 处理后的params.sellerIds数组
          if (params.monitorFlag == 1) {
            if (!this.dialogData.datePickValue) {
              this.$message({ type: "warning", message: "请选择监控起始时间" });
              return;
            }
            params.monitorFrom = this.dialogData.datePickValue[0];
            params.monitorTo = this.dialogData.datePickValue[1];
          }
          // this.$store.commit("competitive/shopTableLoading", true); // loading
          params = this.$.dealObjectValue(params);
          // 扣点按钮loading pointData
          this.buttonLoading.add = true;
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
            this.pointData.text = "请稍后，店铺正在校验中...";
            this.pointData.width = "70%";
          }
          this.$axios
            .post(ShopAnalysisSaveUrl, params)
            .then(res => {
              this.buttonLoading.add = false;
              this.buttonLoading.addText = "确定";
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = "ruleForm";
                  this.pointData.func = this.addTaskSubmit;
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              // console.log("添加产品接口响应", res.data);
              if (res.data.code == 0) {
                this.dialogData.textarea = "";
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.dialogShow.dialogFormVisible = false;
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗 pointData
                  this.pointData.text = "确 定";
                  this.pointData.width = "60%";
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                if (point === undefined) {
                  this.reloadPointApi(); // 重新获取点数
                  this.changeTabPosition(this.tabPosition, this); // 添加产品后重新发起请求todo
                }
              } else if (res.data.code === 500) {
                this.pointData.show = false; // 关闭扣点弹窗 pointData
                this.pointData.loading = false; // 关闭扣点按钮loading
                this.pointData.text = "确 定";
                this.pointData.width = "60%";
                this.$message.error(res.data.msg);
              }
            })
            .catch(err => {
              // console.log("添加产品失败", err);
            });
        }
      });
    },
    // 删除店铺
    deleteProduct() {
      let taskIdArr = this.tableHandle.selectTaskIdArr;
      // console.log(taskIdArr == "");
      if (taskIdArr == "") {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
        return;
      }
      // 一个个检查是否存在监控状态
      let Items = [];
      taskIdArr.forEach((item, index) => {
        let func = function(v) {
          return v.taskId == item;
        };
        Items.push(getItemFromArr(this.listData, func));
      });
      // console.log("存在监状态的项是", Items);
      let tips;
      if (Items.length > 0) {
        let hasMonitorFlagItem = [];
        // 遍历选中的项，如果有处于监控的，则用对应的提示语
        // console.log(Items, "1");
        Items.forEach((item, index) => {
          if (item[0].monitorFlag == 1) {
            hasMonitorFlagItem.push(index);
          }
        });
        // console.log(hasMonitorFlagItem, "2");
        if (hasMonitorFlagItem.length > 0) {
          tips = "有正在监控中的产品，是否取消监控并删除?";
        }
        if (hasMonitorFlagItem.length == 0) {
          tips = "此操作将删除选中项, 是否继续?";
        }
      }
      if (Items.length == 0) {
        tips = "此操作将删除选中项, 是否继续?";
      }
      this.deleteHandle(tips, taskIdArr);

      // this.$confirm("此操作将删除选中项, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     let params = {
      //       taskIds: taskIdArr
      //     };
      //     console.log(params);
      //     this.$store.commit("competitive/shopTableLoading", true); // loading
      //     this.$axios.post(ShopAnalysisRemoveUrl, params).then(res => {
      //       if (res.data.code != 0) {
      //         this.$message.error(res.data.msg + " 确保删除前取消监控");
      //         this.changeTabPosition(
      //           this.tabPosition,
      //           this,
      //           parseInt(this.$route.query.currentPage),
      //           parseInt(this.$route.query.Size)
      //         ); // 删除任务后重新发起请求
      //         return;
      //       }
      //       this.$nextTick(function() {
      //         this.$message({
      //           type: "success",
      //           message: res.data.msg
      //         });
      //       });
      //       // this.dialogShow.dialogFormVisible = false;
      //       this.changeTabPosition(
      //         this.tabPosition,
      //         this,
      //         parseInt(this.$route.query.currentPage),
      //         parseInt(this.$route.query.Size)
      //       ); // 删除任务后重新发起请求
      //       console.log("删除响应", res.data);
      //     });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除"
      //     });
      //   });
    },
    // 删除操作
    deleteHandle(tips, taskIdArr) {
      this.$confirm(tips, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            taskIds: taskIdArr
          };
          // console.log(params);
          this.$store.commit("competitive/shopTableLoading", true); // loading
          this.$axios.post(ShopAnalysisRemoveUrl, params).then(res => {
            // if (res.data.code != 0) {
            //   this.$message.error(res.data.msg + " 确保删除前取消监控");
            //   this.changeTabPosition(
            //     this.tabPosition,
            //     this,
            //     parseInt(this.$route.query.currentPage),
            //     parseInt(this.$route.query.Size)
            //   ); // 删除任务后重新发起请求
            //   return;
            // }
            this.$nextTick(function() {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            });
            // this.dialogShow.dialogFormVisible = false;
            this.changeTabPosition(
              this.tabPosition,
              this,
              parseInt(this.$route.query.currentPage),
              parseInt(this.$route.query.Size)
            ); // 删除任务后重新发起请求
            // console.log("删除响应", res.data);
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    // 添加/修改监控
    showAddMonitoring(type) {
      // if (this.listData == undefined) {
      //   if (type == "add") {
      //     this.$message.error("暂无可监控的数据，请先添加店铺");
      //   }
      //   if (type == "change") {
      //     this.$message.error("暂无可修改的数据，请先添加店铺");
      //   }
      //   return;
      // }
      if (this.tableHandle.selectTaskIdArr == "") {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
        // if (type == "add") {
        //   this.$message.error("请选择要添加的选项");
        // }
        // if (type == "change") {
        //   this.$message.error("请选择要修改的选项");
        // }
        return;
      }
      if (this.tableHandle.selectTaskIdArr.length > 1) {
        this.$message({
          showClose: true,
          message: "只能选择其中一个",
          type: "warning"
        });
        return;
      }
      if (type == "add") {
        // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = true;
        for (let i = 0; i < this.tableHandle.multipleSelection.length; i++) {
          // console.log(this.tableHandle.multipleSelection[i]);
          if (this.tableHandle.multipleSelection[i].monitorFlag == 0) {
            // 只有要一项未开启，设置isAllInMonitor为否，下面则可以开启添加监控弹窗
            isAllInMonitor = false;
          }
        }
        if (isAllInMonitor === true) {
          this.$message({
            showClose: true,
            message: "选中项都处于监控，不能重复添加",
            type: "warning"
          });
          this.dialogShow.dialogMonitorVisible = false;
          return;
        }
      }
      //
      // 1
      if (type == "add") {
        this.dialogShow.title = "添加监控";
        this.dialogData.monitorDateValue = [];
      } else {
        this.dialogShow.title = "修改监控周期";
        // 2
        if (
          this.tableHandle.multipleSelection.length === 1 &&
          this.tableHandle.multipleSelection[0].monitorFlag === 1
        ) {
          // 修改监控，只选中一条默认带上
          console.log(this.tableHandle.multipleSelection, "修改监控一项");
          if (
            this.tableHandle.multipleSelection[0].monitorFrom &&
            this.tableHandle.multipleSelection[0].monitorTo
          ) {
            this.dialogData.monitorDateValue = [
              this.tableHandle.multipleSelection[0].monitorFrom,
              this.tableHandle.multipleSelection[0].monitorTo
            ];
          }
        } else {
          this.dialogData.monitorDateValue = [];
        }
        // 2 end
      }
      // end
      this.dialogShow.dialogMonitorVisible = true;
      this.dialogShow.dialogMonitorType = type;
    },
    // 添加，修改监控 pointData
    addChartMoni() {
      this.submitMonitoring(0);
    },
    submitMonitoring(point) {
      let type = this.dialogShow.dialogMonitorType;
      let monitoringUrl;
      if (type == "add") {
        monitoringUrl = ShopMonitoringUrl;
      }
      if (type == "change") {
        monitoringUrl = changeShopMonitoringUrl;
      }
      let taskIdArr = this.tableHandle.selectTaskIdArr;
      let params = {
        taskIds: taskIdArr,
        type: point,
        sellerIds: [this.tableHandle.multipleSelection[0].sellerId]
      };
      if (!this.dialogData.monitorDateValue) {
        this.$message({ type: "warning", message: "请选择监控起始时间" });
        return;
      }
      params.monitorFrom = this.dialogData.monitorDateValue[0];
      params.monitorTo = this.dialogData.monitorDateValue[1];
      params = this.$.dealObjectValue(params);
      this.buttonLoading.addmonitor = true;
      // 扣点按钮loading pointData
      if (point === undefined) {
        this.pointData.loading = true; // 关闭扣点按钮loading
        this.pointData.text = "请稍后，店铺正在校验中...";
        this.pointData.width = "70%";
      }
      // this.$store.commit("competitive/shopTableLoading", true); // loading
      this.$axios
        .post(monitoringUrl, params)
        .then(res => {
          this.buttonLoading.addmonitor = false;
          // console.log("添加监控/修改接口响应", res.data);
          // 扣点弹窗
          if (point === 0) {
            if (res.data.code == 0) {
              this.pointData.show = true;
              this.pointData.point = res.data.data + "点";
              // this.pointData.formName = "ruleForm_addmoni";
              this.pointData.func = this.submitMonitoring;
            } else if (res.data.code === 500) {
              this.$message.error(res.data.msg);
            }
            return;
          }
          if (res.data.code == 0) {
            this.$message({
              type: "success",
              message: res.data.msg
            });
            this.dialogShow.dialogMonitorVisible = false;
            this.$nextTick(() => {
              this.pointData.show = false; // 关闭扣点弹窗 pointData
              this.pointData.loading = false; // 关闭扣点按钮loading
              this.pointData.text = "确 定";
              this.pointData.width = "60%";
            });
            if (point === undefined) {
              this.reloadPointApi();
              this.changeTabPosition(this.tabPosition, this); // 添加产品后重新发起请
            }
          } else if (res.data.code === 500) {
            this.pointData.show = false; // 关闭扣点弹窗 pointData
            this.pointData.loading = false; // 关闭扣点按钮loading
            this.pointData.text = "确 定";
            this.pointData.width = "60%";
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          // console.log("添加、修改监控失败", err);
        });
    },
    //取消监控
    cancelMonitoring() {
      let taskIdArr = this.tableHandle.selectTaskIdArr;
      // console.log(taskIdArr == "");
      if (taskIdArr == "") {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
        return;
      }
      // // 此变量判断是否有未开启监控的选项
      let isAllInMonitor = false;
      for (let i = 0; i < this.tableHandle.multipleSelection.length; i++) {
        if (this.tableHandle.multipleSelection[i].monitorFlag == 1) {
          // 只有要一项未开启，设置isAllInMonitor为否，下面则可以开启添加监控弹窗
          isAllInMonitor = true;
        }
      }
      if (isAllInMonitor === false) {
        this.$message({
          showClose: true,
          message: "选中项都未开启监控，不需要取消",
          type: "warning"
        });
        return;
      }
      // //
      let params = {
        taskIds: taskIdArr
      };
      // console.log(params);
      this.$confirm("此操作将取消监控选中项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.commit("competitive/tableLoading", true); // loading
          this.$axios.post(ShopAnalysisRemoveMonitor, params).then(res => {
            if (res.data.code === 500) {
              this.$message.error(res.data.msg + "已取消的不能重复提交");
              this.changeTabPosition(
                this.tabPosition,
                this,
                parseInt(this.$route.query.currentPage),
                parseInt(this.$route.query.Size)
              ); // 取消监控任务后重新发起请求
              return;
            }
            this.$nextTick(function() {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            });
            // this.dialogShow.dialogFormVisible = false;
            this.changeTabPosition(
              this.tabPosition,
              this,
              parseInt(this.$route.query.currentPage),
              parseInt(this.$route.query.Size)
            ); // 取消监控任务后重新发起请求todo
            // if (this.tableHandle.tableType == -1) {
            //   this.changeTabPosition(
            //     this.tabPosition,
            //     this,
            //     parseInt(this.$route.query.currentPage),
            //     parseInt(this.$route.query.Size)
            //   ); // 取消监控任务后重新发起请求todo
            // } else if (this.tableHandle.tableType == 1) {
            //   this.searchTabPosition(
            //     this.tabPosition,
            //     this,
            //     null,
            //     null,
            //     Trim(this.inputText, "g")
            //   ); // 取消监控任务后重新发起请求
            // }
            // console.log("取消监控失败响应", res.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃操作"
          });
        });
    },
    // 根据店铺搜索
    searchProduct() {
      this.page.currentPage = 1;
      let txt = Trim(this.inputText, "g");
      // if (txt.length == 0) {
      //   this.$message.error("店铺ID不能为空");
      //   return;
      // }
      // 搜索新的数据先把时间设置为空
      this.searchTabPosition(this.tabPosition, this, null, null, txt);
    },
    searchTabPosition(day, _this, pageNumber, pageSize, sellerId) {
      // 店铺分析/ShopAnalysis/list
      this.$store.commit("competitive/shopTableLoading", true);
      let params = {
        platformId: 1,
        groupId:
          (this.$refs.tree && this.$refs.tree.$refs.tree.getCurrentKey()) || 0,
        sellerId: sellerId,
        pageNumber: pageNumber || this.page.currentPage,
        pageSize: pageSize || this.page.Size
      };
      if (this.DateMsg.DateValue !== null) {
        params.startTime = this.DateMsg.DateValue[0];
        params.endTime = this.DateMsg.DateValue[1];
      }
      params = this.$.dealObjectValue(params);
      if (day === null) {
        delete params.startTime;
        delete params.endTime;
      }
      this.$store.dispatch("competitive/actionSearchShopAnalysisList", {
        params,
        _this: _this
      });
    },
    // 实际根据tableType切换今天，7
    useWhichTabs(tabval) {
      this.DateMsg.DateValue = [getDay(tabval).computedDay, getDay().today];
      let txt = Trim(this.inputText, "g");
      if (this.tableHandle.tableType == 1) {
        this.searchChangeTabs(tabval, txt);
      } else {
        this.changeTabs(tabval);
      }
    },
    // search模式的tab 今天 7天 30天
    searchChangeTabs(tabval, argsku) {
      this.page.currentPage = 1; // 切换条件从第一页开始
      this.tabPosition = tabval;
      this.searchTabPosition(
        tabval,
        this,
        this.page.currentPage,
        this.page.Size,
        argsku
      );
    },
    // 默认模式tab 今天 7天 30天
    changeTabs(tabval) {
      this.page.currentPage = 1; // 切换条件从第一页开始
      this.tabPosition = tabval;
      this.changeTabPosition(
        tabval,
        this,
        this.page.currentPage,
        parseInt(this.$route.query.Size)
      );
    },
    // tableType为列表数据的分页切换和时间段切换
    changeTabPosition(day, _this, pageNumber, pageSize) {
      // 店铺分析列表/ShopAnalysis/list
      // todonow
      this.$store.commit("competitive/shopTableLoading", true);
      let params = {
        platformId: 1,
        groupType: this.groupType,
        groupId:
          (this.$refs.tree && this.$refs.tree.$refs.tree.getCurrentKey()) || 0,
        // sku: "B00AHRDKOO",
        // startTime: "2018-6-12",
        pageNumber: pageNumber || this.page.currentPage,
        pageSize: pageSize || this.page.Size
      };
      if (this.DateMsg.DateValue !== null) {
        params.startTime = this.DateMsg.DateValue[0];
        params.endTime = this.DateMsg.DateValue[1];
      }
      params = this.$.dealObjectValue(params);
      if (day === null) {
        delete params.startTime;
        delete params.endTime;
      }
      this.$store.dispatch("competitive/actionGetShopAnalysisList", {
        params,
        _this: _this
      });
    },
    // table选中
    handleSelectionChange(val) {
      // console.log(index, row);
      // this.tableHandle.selectTaskIdArr = [row.taskId];
      // this.tableHandle.multipleSelection.push(row);
      this.tableHandle.multipleSelection = val;
      let selected = this.tableHandle.multipleSelection;
      this.tableHandle.selectTaskIdArr = [];
      selected.forEach((v, i) => {
        this.tableHandle.selectTaskIdArr = this.tableHandle.selectTaskIdArr.concat(
          v.taskId
        );
      });
      // console.log(this.tableHandle.selectTaskIdArr);
    },
    // table删除
    deleteRow(tableData) {},
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
      this.$router.push(
        "/admin/competitive/shopAnalysis/checkShopAnalysis?taskId=" +
          rowDetail.taskId +
          "&sellerId=" +
          rowDetail.sellerId
      );
    },
    // 监听分页
    getSizeChange(size) {
      this.page.Size = size;
      // todon
      // 1.如果是非搜索模式
      if (this.tableHandle.tableType == -1) {
        // 如果时间为空
        if (this.DateMsg.DateValue == "") {
          this.changeTabPosition(this.tabPosition, this);
        }
        // 如果时间不为空
        if (this.DateMsg.DateValue != "") {
          this.changeTabPosition(this.tabPosition, this, null, null);
        }
      }
      // 2.如果是搜索模式
      if (this.tableHandle.tableType == 1) {
        let txt = Trim(this.inputText, "");
        // 如果时间为空
        if (this.DateMsg.DateValue == "") {
          this.searchTabPosition(this.tabPosition, this, null, null, txt);
        }
        // 如果时间不为空
        if (this.DateMsg.DateValue != "") {
          this.searchTabPosition(
            this.tabPosition,
            this,
            null,
            null,
            txt,
            this.DateMsg.DateValue[0],
            this.DateMsg.DateValue[1]
          );
        }
      }
      this.$router.push(
        "/admin/competitive/shopAnalysis?currentPage=" +
          this.page.currentPage +
          "&Size=" +
          this.page.Size +
          // "&tabPosition=" +
          // this.tabPosition +
          "&tableType=" +
          this.tableHandle.tableType
      );
    },
    getPage(currentPage) {
      this.page.currentPage = currentPage;
      // todon
      if (this.tableHandle.tableType == -1) {
        if (this.DateMsg.DateValue == "") {
          this.changeTabPosition(this.tabPosition, this);
        }
        if (this.DateMsg.DateValue != "") {
          this.changeTabPosition(this.tabPosition, this, null, null);
        }
      } else if (this.tableHandle.tableType == 1) {
        let txt = Trim(this.inputText, "");
        if (this.DateMsg.DateValue == "") {
          this.searchTabPosition(this.tabPosition, this, null, null, txt);
        }
        if (this.DateMsg.DateValue != "") {
          this.searchTabPosition(this.tabPosition, this, null, null, txt);
        }
      }
      this.$router.push(
        "/admin/competitive/shopAnalysis?currentPage=" +
          this.page.currentPage +
          "&Size=" +
          this.page.Size +
          // "&tabPosition=" +
          // this.tabPosition +
          "&tableType=" +
          this.tableHandle.tableType
      );
    }
  }
};
</script>

<style scoped>
/* .timeCss {
  position00c0delute;
  left: 100px;
  z-index: 999;
  top: -62px;
  display: inline-block;
  color: #00C0DE;
  font-size: 14px;
} */
.shopAnalysisContainer {
  border-top: none;
  position: relative;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.addTaskSubmitStyle {
  width: 375px;
  margin-left: 50px;
  /* margin-top: 20px;
  margin-bottom: 20px; */
}
/* .aLink:hover {
  text-decoration: underline !important;
} */
.el-dialog__title {
  line-height: 24px;
  color: #3aa8e6;
  font-weight: 30px;
}
.box {
  position: relative;
}
.left {
  /* background: #f4f6f6; */
  /* border-right: 1px solid #eee; */
  height: 100%;
}
</style>

<template>
  <BasicContainer>

    <el-row :gutter="16" class="h100 h100_box">
      <el-col :sm="8" :xs="8" :xl="4" :lg="4" :md="6" class="h100 left">
        <GroupTree @nodeclick="handleNodeClick" :data="groupList" ref="tree" :show="show" @toggle="val => show = val" />
      </el-col>
      <el-col :sm="!show ? 24 : 16" :xs="!show ? 24 : 16" :xl="!show ? 24 : 20" :lg="!show ? 24 : 20" :md="!show ? 24 : 18" :class="['h100', 'right', {'no-border': !show}]">
        <div class="btns" v-if="tableBtns.length">
          <div v-for="btn in tableBtns" class="btn_wrapper">
            <el-button type="success" :style="btn.width ? {width: `${btn.width}px`}: null" :plain="!btn.plain" @click="btn.fn">{{btn.name}}</el-button>
          </div>
        </div>
        <BasicSearch ref="search" :inputs="inputs" @search="getSalesAnalysisList($.dealObjectValue($event))" />
        <BasicTable :data="analysisList" :multipleSelection.sync="multipleSelection" v-loading="tableLoading">
          <el-table-column prop="groupName" label="分组名称" align='center' width="125px" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.groupName ? scope.row.groupName : '未分组'}}
            </template>
          </el-table-column>

          <el-table-column prop="parentSku" label="产品ASIN" :show-overflow-tooltip="true" align='center'>
          </el-table-column>
          <el-table-column prop="imgs" label="图片" align='center'>
            <!-- 动态渲染图片 -->
            <template slot-scope="scope">
              <!-- <div class="__img_wrapper">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'--'">
            </div> -->
              <el-popover placement="right" title="" trigger="hover">
                <img :src="scope.row.imageUrl" />
                <div class="__img_wrapper" slot="reference">
                  <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip="true" :formatter="_formatter" align='center'>
          </el-table-column>

          <el-table-column prop="monitorFlag" label="监控状态" width="90" :formatter="_formatter" align='center'>
            <template slot-scope="scope">
              {{ scope.row.monitorFlag?'开启':'关闭' }}</template>
          </el-table-column>

          <el-table-column prop="frequency" label="监控频率" align='center'>
            <template slot-scope="scope">
              <span v-if="scope.row.frequency">{{scope.row.frequency}}分钟/次</span>
              <span v-else>-</span>

            </template>
          </el-table-column>
          <el-table-column label="监控起止时间" :show-overflow-tooltip="true" :formatter="_formatter" align='center'>
            <template slot-scope="scope">
              <span v-if="scope.row.monitorFrom">{{scope.row.monitorFrom}} ~ {{scope.row.monitorTo}}</span>
              <span v-else>-</span>

            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="110" :formatter="_formatter" align='center'>
            <template slot-scope="scope">
              {{ scope.row.status===2?"抓取成功":scope.row.status===0?"抓取中...":scope.row.status===1?"抓取中...":scope.row.status!==0||scope.row.status!==1||scope.row.status!==2?"抓取失败":"--" }}
            </template>
          </el-table-column>
          <el-table-column prop="title" label="操作" align="center">
            <template slot-scope="scope">

              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <span class="tb_edit_btn" style="cursor:pointer" @click="editItem(scope.row)">
                  <i class="el-icon-edit" style="font-size:16px"></i>
                </span>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="查看" placement="top" v-if="scope.row.status===2">
                <router-link :to="{name:'销量分析查看', query: {taskId:scope.row.taskId, asin: scope.row.sku}}">
                  <span class="tb_edit_btn" style="cursor:pointer" @click="viewItem(scope.row)">
                    <i class="el-icon-search" style="font-size:16px"></i>
                  </span>
                </router-link>
              </el-tooltip>

              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <span class="tb_edit_btn" style="cursor:pointer" @click="deleteItem(scope.row)">
                  <i class="el-icon-delete" style="font-size:16px"></i>
                </span>
              </el-tooltip>

            </template>
          </el-table-column>
        </BasicTable>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <CommonDialog :modal-obj="addProjectModel">
      <div style="color:#30cca5;">
        温馨提示：
        <span>销量分析只分析FBA产品</span>
      </div>
      <el-form :model="addProjectForm" inline label-position="top" class="spe" ref="ruleform" :rules="rules" style="margin-top:24px">

        <el-form-item label="起止时间" prop="time">
          <el-date-picker unlink-panels style="width:260px" :picker-options="pickerOptions" v-model="addProjectForm.time" type="daterange" value-format='yyyy-MM-dd' start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="监控频率" prop="frequency">
          <div style="line-height:37px">
            <el-input-number v-model="addProjectForm.frequency" size="small" controls-position="right" :precision="0" :min="60" :max="60">
            </el-input-number>
            <span style="margin-left:10px">分钟/次</span>
          </div>

        </el-form-item>
        <el-form-item label="选择分组" prop="groupId">
          <div style="line-height:37px">
            <el-cascader change-on-select style="width:160px" :options="selectGroupList" v-model="addProjectForm.groupId" :props="addProjectFormOpts"></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label=" ">
          <div style="line-height:37px">
            <el-button type="primary" @click="handleAdd">添加</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane label="从产品库中选择产品" name="first">
          <el-form :model="selectListForm" inline class="spe">
            <el-form-item>
              <el-cascader change-on-select style="width:160px" :options="selectProductGroupList" v-model="selectListForm.groupId" :props="addProjectFormOpts"></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="selectListForm.sku" placeholder="输入ASIN"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" icon="el-icon-search" @click="searchSelectList">搜索</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="productLib.rows" @selection-change="handleSubChange" height="320px">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="分组" prop="groupName"></el-table-column>
            <el-table-column label="产品ASIN" prop="sku"></el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChangeLib" @current-change="handleCurrentChangeLib" :current-page="productLib.pageNo" :page-sizes="[5, 10, 20, 50]" :page-size="productLib.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="productLib.total">
          </el-pagination>
          <div style="text-align:center;margin-top:20px">
            <el-button type="primary" @click="addSalesAnalysisDialog(1)">确认添加</el-button>
          </div>

        </el-tab-pane>
        <el-tab-pane label="自定义输入" name="second">
          <el-form :model="selectListForm1" ref="custominput">
            <el-form-item prop="skus" :rules="skusRules">
              <el-input v-model="selectListForm1.skus" type="textarea" :rows="8" placeholder="自定义输入ASIN，每行一个，多个请换行"></el-input>
            </el-form-item>
          </el-form>

          <div style="text-align:center;margin-top:20px">
            <el-button type="primary" @click="addSalesAnalysisDialog(0)">确认添加</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </CommonDialog>

    <!-- 添加分组 -->
    <CommonDialog :modal-obj="addGroupObj">
      <el-form :model="addGroupModel" ref="addGroupModel">
        <el-form-item label="分组名称" label-width="100px" prop="groupName" :rules="$.getRule('请输入分组名称')">
          <el-input v-model="addGroupModel.groupName" clearable></el-input>
        </el-form-item>
        <el-form-item label="选择上级分组" label-width="100px">
          <el-cascader change-on-select :options="addGroupList" style="width:100%" v-model="addGroupModel.groupId" clearable :props="addProjectFormOpts"></el-cascader>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addGroup">确认添加</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <!-- 移动分组 -->
    <CommonDialog :modal-obj="moveGroupObj">
      <el-form :model="moveGroupModel" ref="moveGroupModel">
        <el-form-item label="选择分组" label-width="100px" prop="groupId" :rules="$.getRule('请选择分组')">
          <el-row :gutter="12">
            <el-col :span="18">
              <el-cascader :options="selectGroupList" style="width:100%" v-model="moveGroupModel.groupId" :props="addProjectFormOpts" clearable></el-cascader>
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

    <!-- 添加监控 -->
    <CommonDialog :modal-obj="addMonitoringObj">
      <el-form :model="addMonitoringModel" class="__myform">
        <el-form-item label="监控频率" label-width="100px" class="__flex_wrapper">
          <el-input-number style="width:100%" v-model="addMonitoringModel.frequency" size="small" controls-position="right" :min="60" :max="60">
          </el-input-number>
          <span>分钟/次</span>
        </el-form-item>
        <el-form-item label="监控起止时间" label-width="100px">
          <el-date-picker unlink-panels style="width:100%" :picker-options="pickerOptions" v-model="addMonitoringModel.time" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addMonitoring">确定</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <el-point :data="pointData"></el-point>
    <el-point :data="pointData1"></el-point>

  </BasicContainer>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import GroupTree from "@/components/common/GroupTree";
import BasicSearch from "@/components/common/BasicSearch";
import BasicTable from "@/components/common/BasicTable";
import BasicContainer from "@/components/common/BasicContainer";
import CommonDialog from "@/components/common/commonDialog";

export default {
  name: "salesVolumeContainer",
  provide() {
    return {
      updateTreeData: this.updateTreeData,
      deleteNodes: this.deleteNodes,
      setState: this.updateGroupDataMutation,
      handleSizeChange: this.handleSizeChange,
      handleCurrentChange: this.handleCurrentChange,
      createNode: this.createNode
    };
  },
  created() {
    this.getPointeApi(); //请求扣点
    // 分组数据
    this.updateTreeData();
    // 表格数据
    // this.getSalesAnalysisList();
  },
  computed: {
    ...mapState({
      analysisList: state => state.saleVolume && state.saleVolume.analysisList,
      tableLoading: state => state.saleVolume && state.saleVolume.tableLoading,
      productLib: state => state.myAttention && state.myAttention.productLib
    }),
    ...mapGetters("saleVolume", [
      "groupList",
      "selectGroupList",
      "addGroupList"
    ]),
    ...mapGetters("common", ["platformId", "siteId"]),
    ...mapGetters("myAttention", ["selectProductGroupList"])
  },
  data() {
    let vm = this;
    let changePlatformd = this.$store.state.common.savePlatformIdAndSiteId.split(
      ","
    )[0];
    let checkSkus = this.$.checkSkus(changePlatformd);
    return {
      show: true,
      rules: {
        time: [
          {
            required: true,
            message: "请选择监控日期"
          }
        ],

        frequency: [
          {
            required: true,
            message: "请选择监控间隔时间"
          }
        ],
        groupId: [
          {
            required: true,
            message: "请选择选择分组"
          }
        ]
      },
      // pointData 扣点明细
      pointData1: {
        show: false,
        point: "",
        loading: false,
        func: this.addMonitoring
      },
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addSalesAnalysis
      },
      skusRules: [
        {
          validator: checkSkus,
          trigger: ["blur", "change"]
        }
      ],
      selectListForm1: {},
      addMonitoringFlag: true,
      addProjectForm: {
        groupId: [-1]
      },
      moveGroupModel: {
        groupId: null
      },
      addMonitoringModel: {},
      addGroupModel: {},
      selectListForm: {},
      selectList: [],
      addProjectModel: {
        show: false,
        title: "添加任务",
        width: "800px",
        point: ""
      },
      addGroupObj: {
        show: false,
        title: "添加分组"
      },
      selected: [],
      addMonitoringObj: {
        show: false,
        title: "添加监控",
        point: 3
      },
      moveGroupObj: {
        show: false,
        title: "移动分组"
      },
      addProjectFormOpts: {
        value: "groupId",
        label: "groupName",
        children: "groupingVOS"
      },

      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      multipleSelection: [],

      activeName: "first",

      // 请求参数
      groupType: 4,
      params: {
        platformId: this.platformId,
        siteId: this.siteId,
        groupType: this.groupType
      },

      // 查询组
      inputs: [
        {
          placeholder: "请输入产品ASIN",
          key: "sku"
        }
      ],

      // 表格上的按钮组
      tableBtns: [
        {
          name: "添加任务",
          plain: true,
          fn() {
            vm.selectListForm = {};
            vm.activeName = "first";
            vm.addProjectModel.show = true;
            vm.$nextTick(() => {
              vm.$refs.ruleform.resetFields();
              const groupId = vm.$refs.tree.getAllKeys();
              vm.addProjectForm = {
                groupId: groupId && groupId[0] !== 0 ? groupId : [-1],
                time: []
              };
            });
            vm.updateGroupDataAt();
            vm.updateProductLib({
              platformId: vm.platformId,
              siteId: vm.siteId
            });
          }
        },
        {
          name: "添加监控",
          plain: true,
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }

            if (vm.multipleSelection.every(el => el.monitorFlag === 1)) {
              vm.$message.warning("选中项都处于监控，不能重复添加");
              return;
            }

            if (vm.multipleSelection.length === 1) {
              const {
                frequency,
                monitorFrom,
                monitorTo
              } = vm.multipleSelection[0];
              vm.addMonitoringModel = {
                frequency,
                time: monitorFrom ? [monitorFrom, monitorTo] : []
              };
            } else {
              vm.addMonitoringModel = { time: [] };
            }

            // 选中项都处于监控，不能重复添加

            vm.addMonitoringFlag = true;
            vm.addMonitoringObj.show = true;
            vm.addMonitoringObj.title = "添加监控周期";
          }
        },
        {
          name: "修改监控周期",
          plain: true,
          width: 140,
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }
            if (vm.multipleSelection.length === 1) {
              const data = {
                frequency: vm.multipleSelection[0].frequency,
                time: vm.multipleSelection[0].monitorFrom
                  ? [
                      vm.multipleSelection[0].monitorFrom,
                      vm.multipleSelection[0].monitorTo
                    ]
                  : []
              };
              vm.$set(vm, "addMonitoringModel", data);
            } else {
              vm.addMonitoringModel = {
                time: []
              };
            }
            vm.addMonitoringFlag = false;
            vm.addMonitoringObj.show = true;
            vm.addMonitoringObj.title = "修改监控周期";
          }
        },

        {
          name: "取消监控",
          fn() {
            console.log("取消监控");
            vm
              .$confirm("此操作将取消监控选中项, 是否继续?", "提示", {
                type: "warning"
              })
              .then(() => {
                vm.cancelMonitoring();
              })
              .catch(() => {});
          }
        },

        {
          name: "删除",
          fn() {
            vm.deleteSalesAnalysis();
          }
        },
        {
          name: "移出分组",
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }
            vm
              .$confirm("是否移出分组?", "提示", {
                type: "warning"
              })
              .then(() => {
                vm.moveOutGroup(vm.multipleSelection.map(el => el.taskId), -1);
              })
              .catch(() => {});
          }
        },
        {
          name: "移动分组",
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }
            vm.$refs.moveGroupModel && vm.$refs.moveGroupModel.resetFields();
            vm.moveGroupObj.show = true;
          }
        }
      ]
    };
  },

  components: {
    GroupTree,
    BasicContainer,
    BasicTable,
    CommonDialog,
    BasicSearch
  },
  methods: {
    ...mapActions("saleVolume", [
      "updateGroupData",
      // "getSalesAnalysisList",
      "deleteGroupData"
    ]),
    ...mapActions({
      getSalesAnalysisList1: "saleVolume/getSalesAnalysisList"
    }),
    ...mapActions({
      updateGroupDataAt: "myAttention/updateGroupData",
      updateProductLib: "myAttention/updateProductLib"
    }),
    ...mapMutations({
      updateGroupDataMutation: "saleVolume/updateGroupData"
    }),
    // 请求扣点
    getPointeApi() {
      this.$axios
        .post("/FunctionMkt/listFunction", { functionMark: "F0015" })
        .then(res => {
          if (res.data.code == 0) {
            this.surplusAmount = res.data.data.surplusAmount;
            this.addProjectModel.point = res.data.data.charge;
          }
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);
            return;
          }
        });
    },
    handleNodeClick() {
      this.$refs.search.reset();
    },
    // 更新分组数据
    updateTreeData(cb) {
      console.log("更新分组数据");
      this.updateGroupData(
        this.$.dealObjectValue({
          platformId: this.platformId,
          siteId: this.siteId,
          groupType: this.groupType
        })
      ).then(res => {
        if (cb) {
          cb();
        }
      });
    },
    // 删除分组数据
    deleteNodes(groupIds, cb) {
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
              // cb()
            },
            true
          );
        });
    },
    handleSubChange(val) {
      this.selected = val;
    },
    // 创建/编辑分组数据
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

    getSalesAnalysisList(params) {
      let groupId =
        (this.$refs.tree && this.$refs.tree.$refs.tree.getCurrentKey()) || 0;
      this.getSalesAnalysisList1(
        this.$.dealObjectValue({ groupId, pageSize: 10, ...params })
      );
    },

    // 表格业务

    handleCurrentChange(pageNumber) {
      this.getSalesAnalysisList({ pageNumber });
    },
    handleSizeChange(pageSize) {
      this.getSalesAnalysisList({ pageSize });
    },

    // 添加任务里的分页
    handleSizeChangeLib(pageSize) {
      this.updateProductLib({
        platformId: this.platformId,
        siteId: this.siteId,
        pageSize
      });
    },
    handleCurrentChangeLib(pageNumber) {
      this.updateProductLib({
        platformId: this.platformId,
        siteId: this.siteId,
        pageNumber
      });
    },

    deleteItem(row) {
      this.del([row.taskId]);
    },

    refreshData(res) {
      this.$.handlerCode(
        res,
        () => {
          this.getSalesAnalysisList();
          this.addMonitoringObj.show = false;
        },
        true
      );
    },

    del(taskIds) {
      this.$confirm("是否删除此数据？", "警告", {
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post("/salesAnalysis/remove", {
              taskIds
            })
            .then(res => {
              this.refreshData(res);
              this.updateTreeData();
            });
        })
        .catch(() => {});
    },
    editItem(row) {
      let vm = this;
      const data = {
        taskId: row.taskId,
        frequency: row.frequency,
        time: row.monitorFrom ? [row.monitorFrom, row.monitorTo] : []
      };
      vm.$set(vm, "addMonitoringModel", data);
      this.addMonitoringFlag = false;
      this.addMonitoringObj.show = true;
    },
    viewItem(row) {
      if (row.productUrl) {
        window.open(row.productUrl);
      }
    },

    // 弹窗业务
    // 添加计划
    /* 搜索 */
    handleAdd() {
      this.addGroupObj.show = true;

      this.$nextTick(() => {
        this.addGroupModel = {};
        this.$refs.addGroupModel.resetFields();
      });
    },
    searchSelectList() {
      let vm = this;
      const params = {
        ...vm.$.dealObjectValue(vm.selectListForm),
        platformId: vm.platformId,
        siteId: vm.siteId
      };
      params.groupId = params.groupId ? params.groupId.slice().pop() : 0;
      vm.updateProductLib(params);
    },

    addSalesAnalysisDialog() {
      this.$refs.ruleform.validate(valid => {
        if (valid) {
          if (this.activeName === "first") {
            this.addSalesAnalysis(1);
          } else {
            this.$refs.custominput.validateField("skus", errMsg => {
              if (!errMsg) {
                this.addSalesAnalysis(1);
              }
            });
          }
        }
      });
    },

    addSalesAnalysis(isPoint) {
      let skus = [];
      if (this.activeName === "first") {
        // 第一个输入
        skus = this.selected.map(el => el.sku);
      } else {
        skus =
          this.selectListForm1.skus &&
          this.$.getMultiWords(this.selectListForm1.skus);
      }
      let vm = this;
      const { time, frequency, groupId } = vm.addProjectForm;
      const [monitorFrom, monitorTo] = time;
      let params = vm.$.dealObjectValue({
        platformId: vm.platformId,
        siteId: vm.siteId,

        type: 0,
        skus, //
        frequency,
        groupId,
        monitorFrom,
        monitorTo,
        monitorFlag: 1
      });

      if (params.groupId) {
        params.groupId = params.groupId.slice().pop();
      }

      if (!isPoint) {
        delete params.type;
      }

      this.$axios.post("/salesAnalysis/save", params).then(res => {
        if (isPoint) {
          if (res.data.code === 500) {
            this.$message.error(res.data.msg);
            return;
          }
          this.pointData.show = true;
          this.pointData.point = res.data.data;
          return;
        }
        this.pointData.show = false;

        this.$.handlerCode(
          res,
          () => {
            this.addProjectModel.show = false;
            this.$refs.ruleform.resetFields();
            this.$refs.custominput.resetFields();
            this.updateTreeData();
            this.reloadPointApi();
            this.getSalesAnalysisList();
          },
          true
        );
      });
    },

    deleteSalesAnalysis() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请选择后进行操作");
        return;
      }
      this.del(this.multipleSelection.map(el => el.taskId));
    },

    // 将产品移出分组
    moveGroup(taskIds, groupId) {
      this.$refs.moveGroupModel.validate(valid => {
        if (valid) {
          this.moveOutGroup(taskIds, groupId);
        }
      });
    },

    moveOutGroup(taskIds, groupId) {
      if (groupId == null) {
        taskIds = this.multipleSelection.map(el => el.taskId);
        groupId = this.moveGroupModel.groupId.slice().pop();
      }
      this.$axios
        .post("/salesAnalysis/updateGroup", {
          taskIds,
          groupId
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.moveGroupObj.show = false;
              this.$refs.tree.updateAndKeep();
            },
            true
          );
        });
    },

    // 添加分组
    addGroup() {
      let vm = this;
      vm.$refs.addGroupModel.validate(valid => {
        if (valid) {
          const arr = vm.addGroupModel.groupId;

          const parentGroupId = vm.addGroupModel.groupId
            ? vm.addGroupModel.groupId.slice().pop()
            : 0;
          const groupName = vm.addGroupModel.groupName;
          vm.createNode(
            {
              parentGroupId,
              groupName
            },
            null,
            res => {
              let lastId = vm.$.findGroupIdsByName(
                groupName,
                arr,
                vm.addGroupList
              );
              vm.moveGroupModel.groupId = vm.addProjectForm.groupId = arr
                ? [...arr, lastId]
                : [lastId];
            }
          );
        }
      });
    },

    addMonitoringDialog() {
      this.addMonitoring(1);
    },

    // 添加监控 和修改监控
    addMonitoring(isPoint) {
      let url;
      if (this.addMonitoringFlag) {
        url = "/salesAnalysis/addMonitor";
      } else {
        url = "/salesAnalysis/updateMonitor";
      }

      const params = {
        taskIds: this.addMonitoringModel.taskId
          ? [this.addMonitoringModel.taskId]
          : this.multipleSelection.map(el => el.taskId),
        type: 0,
        frequency: this.addMonitoringModel.frequency,
        monitorFrom: this.addMonitoringModel.time[0],
        monitorTo: this.addMonitoringModel.time[1]
      };

      if (!isPoint) {
        delete params.type;
      }

      this.$axios.post(url, params).then(res => {
        if (isPoint) {
          if (res.data.code === 500) {
            this.$message.error(res.data.msg);
            return;
          }
          this.pointData1.show = true;
          this.pointData1.point = res.data.data;
          return;
        }
        this.pointData1.show = false;

        this.reloadPointApi();

        this.refreshData(res);
      });
    },

    // 取消监控
    cancelMonitoring() {
      this.$axios
        .post("/salesAnalysis/removeMonitor", {
          taskIds: this.multipleSelection.map(el => el.taskId)
        })
        .then(res => {
          this.refreshData(res);
        });
    }
  }
};
</script>

<style>
.h100 {
  height: 100%;
}
.left {
  /* background: #f4f6f6; */
  /* border-right: 1px solid #eee; */
  height: 100%;
}
</style>

<template>
  <BasicContainer v-loading="keywordLoading">
    <el-row :gutter="16" class="h100 h100_box">
      <el-col :sm="8" :xs="8" :xl="4" :lg="4" :md="6" class="h100 left">
        <GroupTree @nodeclick="handleNodeClick" :data="productGroupList" ref="tree" :show="show" @toggle="val => show = val" />
      </el-col>
      <el-col :sm="!show ? 24 : 16" :xs="!show ? 24 : 16" :xl="!show ? 24 : 20" :lg="!show ? 24 : 20" :md="!show ? 24 : 18" :class="['h100', 'right', {'no-border': !show}]">
        <div class="btns" v-if="tableBtns.length">
          <div v-for="btn in tableBtns" class="btn_wrapper">
            <el-button type="success" :style="btn.width ? {width: `${btn.width}px`}: null" :plain="!btn.plain" @click="btn.fn">{{btn.name}}</el-button>
          </div>
        </div>
        <BasicSearch :inputs="inputs" @search="updateTableData(setSearchData($event))" ref="search" />
        <BasicTable :data="productLib" :multipleSelection.sync="multipleSelection">
          <el-table-column prop="groupName" label="分组名称" :formatter="_formatter" min-width="40px">
          </el-table-column>
          <el-table-column prop="imageUrl" label="图片" align='center'>
            <template slot-scope="scope">
              <el-popover placement="right" title="" trigger="hover">
                <img :src="scope.row.imageUrl" />
                <div class="__img_wrapper" slot="reference">
                  <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="sku" :label="platformId == 1 ? 'ASIN' : '产品ID'">
          </el-table-column>
          <el-table-column prop="title" label="标题" :formatter="_formatter" min-width="200px">
            <template slot-scope="scope">
              <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
              <el-tooltip v-else placement="top" :content="scope.row.title">
                <div>
                  <a rel="noopener noreferrer nofollow" class="aLink fix__row_2" target="_blank" :href="scope.row.productUrl?scope.row.productUrl:false" style="text-decoration:none;">{{ scope.row.title | _formatData}}
                  </a>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <span style="cursor:pointer" @click="deleteItem(scope.row)">
                  <i class="el-icon-delete" style="font-size:14px"></i>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
        </BasicTable>
      </el-col>
    </el-row>

    <!-- 添加产品 -->
    <CommonDialog :modal-obj="addProductObj">
      <el-form :model="addProductModel" ref="addProductModel">
        <el-form-item :label="platformId == 1 ? '产品ASIN' : '产品ID'" label-width="80px" prop="skus" :rules="skusRules">
          <el-input v-model="addProductModel.skus" placeholder="多个换行输入" type="textarea" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="选择分组" label-width="80px" prop="groupId" :rules="$.getRule('请选择分组')">
          <el-row :gutter="12">
            <el-col :span="18">
              <el-cascader :options="selectProductGroupList" style="width:100%" v-model="addProductModel.groupId" :props="addProjectFormOpts"></el-cascader>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="handleAdd">添加</el-button>
            </el-col>
          </el-row>

        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addKeyword">确认添加</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <!-- 添加分组 -->
    <CommonDialog :modal-obj="addGroupObj">
      <el-form :model="addGroupModel" class="__myform" ref="addGroupModel">
        <el-form-item label="分组名称" label-width="90px" prop="groupName" :rules="$.getRule('请输入分组名称')">
          <el-input v-model="addGroupModel.groupName" clearable></el-input>
        </el-form-item>
        <el-form-item label="选择上级分组" label-width="90px">
          <el-cascader clearable change-on-select :options="addProductGroupList" style="width:100%" v-model="addGroupModel.groupId" :props="addProjectFormOpts"></el-cascader>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addGroup">确认添加</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <!-- 移动分组 -->
    <CommonDialog :modal-obj="moveGroupObj">
      <el-form :model="moveGroupModel" class="__myform" ref="moveGroupModel">
        <el-form-item label="选择分组" :label-width="formLabelWidth" prop="groupId" :rules="$.getRule('请选择分组')">
          <el-row :gutter="12">
            <el-col :span="18">
              <el-cascader :options="selectProductGroupList" style="width:100%" v-model="moveGroupModel.groupId" :props="addProjectFormOpts"></el-cascader>
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

    <!-- 竞争分析 -->
    <CommonDialog :modal-obj="addAnysisObj">
      <el-form :model="addAnysisModel">

        <el-form-item :label="platformId == 1 ? '产品ASIN' : '产品ID'" :label-width="formLabelWidth" prop="skus" :rules="skusRules">

          <el-input v-model="addAnysisModel.skus" placeholder="多个换行输入，可以用“，”号输入备注" type="textarea" :rows="8"></el-input>
          <div class="keywords_num">
            <span style="text-align: left; float:left"></span> 已输入 {{anyKeywords}} 个</div>
        </el-form-item>

        <el-form-item label="选择分组" :label-width="formLabelWidth">
          <el-cascader style="width:100%" :options="productAnalysisGroupList" v-model="addAnysisModel.groupId" :props="addProjectFormOpts"></el-cascader>
        </el-form-item>

        <el-form-item label="" :label-width="formLabelWidth">
          <el-checkbox label="是否添加监控" v-model="addAnysisModel.monitorFlag"></el-checkbox>
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" v-if="addAnysisModel.monitorFlag">
          <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="addAnysisModel.monitor" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addAnysisDialog">确定</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <!-- 加入销量分析 -->
    <CommonDialog :modal-obj="addProjectModel">
      <el-form :model="addProjectForm" inline label-position="top" class="spe">
        <el-form-item label="起止时间">
          <el-date-picker unlink-panels type="daterange" :picker-options="pickerOptions" style="width:260px" v-model="addProjectForm.monitorTime" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="结束时间">
          <el-date-picker  unlink-panels style="width:160px" v-model="addProjectForm.monitorTo" value-format="yyyy-MM-dd" placeholder=""></el-date-picker>
        </el-form-item> -->
        <el-form-item label="监控频率">
          <div style="line-height:37px">
            <!-- <el-input-number v-model="addProjectForm.frequency" size="small" controls-position="right" :min="10" :max="60">
            </el-input-number> -->
            <el-input-number v-model="addProjectForm.frequency" size="small" controls-position="right" :min="60" :max="60">
            </el-input-number>
            <span style="margin-left:10px">分钟/次</span>
          </div>
        </el-form-item>
        <el-form-item label="选择分组">
          <el-cascader change-on-select style="width:160px" :options="saleAnalysisGroupList" v-model="addProjectForm.groupId" :props="addProjectFormOpts"></el-cascader>
        </el-form-item>
      </el-form>
      <el-table :data="multipleSelection" @selection-change="handleMultiChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="分组" prop="groupName"></el-table-column>
        <el-table-column :label="platformId == 1 ? '产品ASIN' : '产品ID'" prop="sku"></el-table-column>
      </el-table>
      <div style="margin-top:20px;text-align:center">
        <el-button type="primary" @click="addProjectDialog">确认添加</el-button>
      </div>
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
import { getGroupingList } from "@/api/globalGroup";

export default {
  name: "keyLexiconContainer",
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
    // 分组数据
    this.updateTreeData();
    if (this.platformId !== 1) {
      this.tableBtns.splice(1, 1);
      this.tableBtns.splice(1, 1);
    }

    // 表格数据
    // this.updateTableData();
  },

  computed: {
    ...mapState({
      platformId: state => state.common.platformId,
      keywordLoading: state =>
        state.myAttention && state.myAttention.keywordLoading,
      productLib: state => state.myAttention && state.myAttention.productLib
    }),
    ...mapGetters("common", ["platformId", "siteId"]),
    ...mapGetters("myAttention", [
      "productGroupList",
      "selectProductGroupList",
      "addProductGroupList"
    ]),
    anyKeywords() {
      return this.$.getMultiWords(this.addAnysisModel.skus || "").length;
    },
    searchKeywords() {
      return this.$.getMultiWords(this.addSearchModel.keywords || "").length;
    },
    params() {
      let vm = this;
      return {
        platformId: vm.platformId,
        siteId: vm.siteId,
        groupType: vm.groupType
      };
    }
  },
  data() {
    let vm = this;
    let changePlatformd = this.$store.state.common.savePlatformIdAndSiteId.split(
      ","
    )[0];
    let checkSkus = this.$.checkSkus(changePlatformd);
    return {
      show: true,
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addAnysis
      },
      pointData1: {
        show: false,
        point: "",
        loading: false,
        func: this.addProject
      },
      isChecked: false,
      selectedList: [],
      StatusOptions: [
        {
          value: 0,
          label: "Google"
        },
        {
          value: 1,
          label: "速卖通"
        },
        {
          value: 2,
          label: "merchantwords"
        }
      ],
      skusRules: [
        {
          required: true,
          validator: checkSkus,
          trigger: ["blur", "change"]
        }
      ],
      selected: [],
      productAnalysisGroupList: [],
      saleAnalysisGroupList: [],
      formLabelWidth: "80px",
      addProjectForm: {
        monitorTime: ""
      },
      addSearchModel: {},
      moveGroupModel: {
        groupId: []
      },
      addAnysisModel: {
        searchSites: []
      },
      addGroupModel: {},
      selectListForm: {},
      selectList: [],
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      addProductObj: {
        show: false,
        title: "添加产品",
        width: "800px"
      },
      addProductModel: {},
      addGroupObj: {
        show: false,
        title: "添加分组"
      },
      addProjectModel: {
        show: false,
        title: "加入销量分析",
        width: "800px",
        point: 3
      },
      addAnysisObj: {
        show: false,
        point: 3,
        title: "加入竞品分析"
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
          return time.getTime() < Date.now();
        }
      },
      multipleSelection: [],

      activeName: "first",

      // 请求参数
      groupType: 1,

      // 查询组
      inputs: [
        {
          placeholder: vm.platformId == 1 ? "请输入ASN" : "请输入产品ID",
          key: "sku"
        },
        {
          placeholder: "分组名称",
          key: "groupId",
          type: 1
        }
      ],

      // 表格上的按钮组
      tableBtns: [
        {
          name: "添加产品",
          plain: true,
          fn() {
            vm.addProductObj.show = true;
            vm.$nextTick(() => {
              const groupId = vm.$refs.tree.getAllKeys();
              vm.$refs.addProductModel.resetFields();
              vm.addProductModel = {
                groupId: groupId && groupId[0] !== 0 ? groupId : [-1]
              };
            });
          }
        },
        {
          plain: true,
          name: "加入竞品分析",

          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }
            vm.updateProductAnalysisData();
            vm.addAnysisModel = {
              monitorFlag: 0
            };
            vm.$set(
              vm.addAnysisModel,
              "skus",
              vm.multipleSelection.map(el => el.sku).join("\n")
            );
            vm.addAnysisObj.show = true;
          }
        },
        {
          name: "加入销量分析",
          plain: true,
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }
            vm.addProjectForm = {
              monitorTime: ""
            };
            vm.updateSaleAnalysisData();
            vm.addProjectModel.show = true;
          }
        },
        {
          name: "删除",
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }
            vm
              .$confirm("是否删除选中的关键词?", "提示", {
                type: "warning"
              })
              .then(() => {
                vm.delKeywords(vm.multipleSelection.map(el => el.productLibId));
              })
              .catch(() => {});
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
                vm.moveOutGroup(
                  vm.multipleSelection.map(el => el.productLibId),
                  -1
                );
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
            vm.moveGroupModel.groupId = [-1];
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
    ...mapActions({
      updateProductLib: "myAttention/updateProductLib",
      updateGroupData: "myAttention/updateGroupData"
    }),
    ...mapMutations({
      updateGroupDataMutation: "myAttention/updateGroupDataKeyword"
    }),
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
    // 创建分组数据
    createNode(data, type, cb) {
      const { platformId, siteId, groupType } = this;
      const { parentGroupId = -1, groupName, groupId } = data;

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

    updateProductAnalysisData() {
      getGroupingList({ groupType: 2 }).then(data => {
        this.productAnalysisGroupList = data.groupingVOS;
      });
    },

    updateSaleAnalysisData() {
      getGroupingList({ groupType: 4 }).then(data => {
        this.saleAnalysisGroupList = data.groupingVOS;
      });
    },

    handleMultiChange(val) {
      this.selected = val;
    },

    // 更新表格数据
    updateTableData(params) {
      let groupId =
        (this.$refs.tree && this.$refs.tree.$refs.tree.getCurrentKey()) || 0;
      this.updateProductLib(
        this.$.dealObjectValue({
          groupId,
          pageSize: 10,
          ...this.params,
          ...params
        })
      );
    },

    // 点击node获取数据
    handleNodeClick(val) {
      let group = this.$refs.tree.getAllKeys();
      if (group[0] !== 0) {
        group.unshift(0);
      }
      this.$refs.search.reset(group);
      // this.updateTableData(val);
    },

    // 处理搜索业务
    setSearchData(data) {
      data = JSON.parse(JSON.stringify(data));
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          let element = data[key];
          if (element instanceof Array) {
            data[key] = element.slice().pop();
          }
        }
      }
      return data;
    },

    // 表格业务
    handleSizeChange(pageSize) {
      this.updateTableData({
        platformId: this.platformId,
        siteId: this.siteId,
        pageSize
      });
    },
    handleCurrentChange(pageNumber) {
      this.updateTableData({
        platformId: this.platformId,
        siteId: this.siteId,
        pageNumber
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    delKeywords(productLibIds) {
      this.$axios
        .post("/ProductLib/remove", {
          productLibIds
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.updateTableData();
              this.updateTreeData();
              this.addAnysisObj.show = false;
            },
            true
          );
        });
    },

    // 删除选项
    deleteItem(row) {
      const productLibId = [row.productLibId];
      this.$confirm("是否删除关键词?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.delKeywords(productLibId);
        })
        .catch(() => {});
    },

    // 弹窗业务

    handleAdd() {
      this.addGroupObj.show = true;

      this.$nextTick(() => {
        this.addGroupModel = {};
        this.$refs.addGroupModel.resetFields();
      });
    },

    // 刷新页面
    refreshList(res) {
      this.$.handlerCode(
        res,
        () => {
          this.updateTableData();
          this.addAnysisObj.show = false;
          this.addProjectModel.show = false;
        },
        true
      );
    },

    // 移动产品分组
    moveGroup(productLibIds, groupId) {
      this.$refs.moveGroupModel.validate(valid => {
        if (valid) {
          this.moveOutGroup(productLibIds, groupId);
        }
      });
    },

    moveOutGroup(productLibIds, groupId) {
      if (groupId == null) {
        productLibIds = this.multipleSelection.map(el => el.productLibId);
        groupId = this.moveGroupModel.groupId.slice().pop();
      }
      this.$axios
        .post("/ProductLib/updateGroup", {
          productLibIds,
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
      this.$refs.addGroupModel.validate(valid => {
        if (valid) {
          const arr = this.addGroupModel.groupId;
          const parentGroupId = this.addGroupModel.groupId
            ? this.addGroupModel.groupId.slice().pop()
            : 0;
          const groupName = this.addGroupModel.groupName;
          this.createNode(
            {
              parentGroupId,
              groupName
            },
            null,
            res => {
              let lastId = this.$.findGroupIdsByName(
                groupName,
                arr,
                this.addProductGroupList
              );
              this.moveGroupModel.groupId = this.addProductModel.groupId = arr
                ? [...arr, lastId]
                : [lastId];
            }
          );
        }
      });
    },

    // 添加产品
    addKeyword() {
      this.$refs.addProductModel.validate(valid => {
        if (valid) {
          const { platformId, siteId } = this;
          let { groupId, skus } = this.addProductModel;
          groupId = groupId.slice().pop();
          skus = this.$.getMultiWords(skus);
          const params = {
            platformId,
            siteId,
            groupId,
            skus
          };
          this.$axios.post("/ProductLib/save", params).then(res => {
            this.$.handlerCode(
              res,
              () => {
                this.updateTableData();
                this.updateTreeData();
                this.addProductObj.show = false;
              },
              true
            );
          });
        }
      });
    },

    addProjectDialog() {
      this.addProject(1);
    },

    // 加入销量分析
    addProject(isPoint) {
      if (!this.selected.length) {
        this.$message.warning("请选择数据进行操作");
        return;
      }
      const { platformId, siteId } = this;
      const skus = this.selected.map(el => el.sku);
      let {
        groupId,
        frequency,
        monitorTime: [monitorFrom, monitorTo]
      } = this.addProjectForm;
      groupId = groupId ? groupId.slice().pop() : -1;
      let params = {
        platformId,
        siteId,
        type: 0,
        skus,
        groupId,
        frequency,
        monitorFrom,
        monitorTo,
        monitorFlag: 1
      };

      if (!isPoint) {
        delete params.type;
      }

      this.$axios.post("/salesAnalysis/save", params).then(res => {
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
        this.refreshList(res);
      });
    },

    addAnysisDialog() {
      this.addAnysis(1);
    },

    // 加入竞品分析
    addAnysis(isPoint) {
      const { platformId, siteId } = this;
      let { skus, monitorFlag, monitor, groupId } = this.addAnysisModel;
      skus = this.$.getMultiWords(skus);
      groupId = groupId.slice().pop();
      let [monitorFrom, monitorTo] = monitor;
      monitorFlag = monitorFlag ? 1 : 0;
      const params = {
        platformId,
        type: 0,
        siteId,
        skus,
        monitorFlag,
        platformId,
        siteId,
        monitorFrom,
        monitorTo,
        groupId
      };
      if (!isPoint) {
        delete params.type;
      }
      this.$axios.post("/ProductAnalysis/save", params).then(res => {
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

        this.reloadPointApi();
        this.refreshList(res);
      });
    }
  }
};
</script>

<style scoped>
.h100 {
  height: initial;
}
.left {
  /* background: #f4f6f6; */
  /* border-right: 1px solid #eee; */
  height: 100%;
}
.searchSitesStyle {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  width: 350px;
  box-sizing: border-box;
  line-height: 40px;
  height: 42px;
}
</style>

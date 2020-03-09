<template>
  <BasicContainer v-loading="keywordLoading">

    <el-row :gutter="16" class="h100 h100_box">
      <el-col :sm="8" :xs="8" :xl="4" :lg="4" :md="6" class="h100 left">
        <GroupTree @nodeclick="handleNodeClick" :data="keywordGroupList" ref="tree" :show="show" @toggle="val => show = val" />
      </el-col>
      <el-col :sm="!show ? 24 : 16" :xs="!show ? 24 : 16" :xl="!show ? 24 : 20" :lg="!show ? 24 : 20" :md="!show ? 24 : 18" :class="['h100', 'right', {'no-border': !show}]">
        <div class="btns" v-if="tableBtns.length">
          <div v-for="btn in tableBtns" class="btn_wrapper">
            <el-button type="success" :style="btn.width ? {width: `${btn.width}px`}: null" :plain="!btn.plain" @click="btn.fn">{{btn.name}}</el-button>
          </div>
        </div>
        <BasicSearch :inputs="inputs" @search="updateTableData(setSearchData($event))" ref="search" />
        <BasicTable :data="analysisList" :multipleSelection.sync="multipleSelection">
          <el-table-column prop="groupName" label="关键词分组" :formatter="_formatter">
          </el-table-column>
          <el-table-column prop="keyword" label="关键词">
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

    <!-- 添加关键词 -->
    <CommonDialog :modal-obj="addKeywordObj">
      <el-form :model="addKeywordModel" class="__myform" ref="addKeywordModel">
        <el-form-item label="关键词" label-width="60px" prop="keywords" :rules="$.getRule('请输入关键词，多个关键词换行输入')">
          <el-input v-model="addKeywordModel.keywords" placeholder="多个关键词换行输入" type="textarea" :rows="6"></el-input>
        </el-form-item>
        <el-form-item label="选择分组" label-width="60px">
          <el-row :gutter="12">
            <el-col :span="18">
              <el-cascader :options="selectKeywordGroupList" style="width:100%" v-model="addKeywordModel.groupId" :props="addProjectFormOpts"></el-cascader>
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
        <el-form-item label="分组名称" label-width="100px" prop="groupName" :rules="$.getRule('请输入分组名称')">
          <el-input clearable v-model="addGroupModel.groupName"></el-input>

        </el-form-item>
        <el-form-item label="选择上级分组" label-width="100px">
          <el-cascader clearable change-on-select :options="addKeywordGroupList" style="width:100%" v-model="addGroupModel.groupId" :props="addProjectFormOpts"></el-cascader>
        </el-form-item>
        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addGroup">确认添加</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <!-- 移动分组 -->
    <CommonDialog :modal-obj="moveGroupObj">
      <el-form :model="moveGroupModel" class="__myform" ref="moveGroupModel">
        <el-form-item label="选择分组" label-width="100px" prop="groupId" :rules="$.getRule('请选择分组')">
          <el-row :gutter="12">
            <el-col :span="18">
              <el-cascader :options="selectKeywordGroupList" style="width:100%" v-model="moveGroupModel.groupId" :props="addProjectFormOpts"></el-cascader>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="addGroupObj.show = true">添加</el-button>
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
      <el-form :model="addAnysisModel" class="__myform" :rules="addAnysisRules" ref="addAnysisForm">
        <el-form-item label="选择来源" :label-width="formLabelWidth" style="width:100%;" prop="searchSites">
          <el-checkbox-group v-model="addAnysisModel.searchSites" class="searchSitesStyle" style="width:100%;">
            <el-checkbox v-for="item in StatusOptions" :label="item.value" :key='item.value' name="searchSites">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="关键词" :label-width="formLabelWidth" prop="keywords">
          <el-input v-model="addAnysisModel.keywords" placeholder="多个关键词以逗号间隔或换行输入（1-500个）" type="textarea" :rows="10"></el-input>
          <div class="keywords_num">已输入 {{anyKeywords}} 个</div>
        </el-form-item>

        <el-form-item label="任务名称" :label-width="formLabelWidth">
          <el-input v-model="addAnysisModel.taskName" placeholder=""></el-input>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addAnysisDialog">确定</el-button>
        </el-form-item>
      </el-form>
    </CommonDialog>

    <!-- 加入查询 -->
    <CommonDialog :modal-obj="addSearchObj">
      <el-form :model="addSearchModel" class="__myform" :rules="addSearchRules" ref="addSearchForm">

        <el-form-item label="关键词" :label-width="formLabelWidth" prop="keywords">
          <el-input v-model="addSearchModel.keywords" placeholder="多个关键词换行输入（1-500个）" type="textarea" :rows="10"></el-input>
          <div class="keywords_num">已输入 {{searchKeywords}} 个</div>
        </el-form-item>

        <el-form-item label="搜索页数" :label-width="formLabelWidth" prop="searchPages">
          <el-select :popper-append-to-body="false"v-model="addSearchModel.searchPages" placeholder="" style="width:100%">
            <el-option v-for="n in 10" :key="n" :value="n">{{n}}</el-option>
          </el-select>
        </el-form-item>

        <el-form-item style="text-align:center">
          <el-button type="primary" @click="addSearchDialog">确定</el-button>
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
    // 表格数据
    // this.updateTableData();
  },
  computed: {
    ...mapState({
      analysisList: state => state.myAttention && state.myAttention.keywordLib,
      keywordLoading: state =>
        state.myAttention && state.myAttention.keywordLoading,
      productLib: state => state.myAttention && state.myAttention.productLib
    }),
    ...mapGetters("common", ["platformId", "siteId"]),
    ...mapGetters("myAttention", [
      "keywordGroupList",
      "selectKeywordGroupList",
      "addKeywordGroupList"
    ]),
    anyKeywordsArr() {
      return this.$.getMultiWords(this.addAnysisModel.keywords || "");
    },
    anyKeywords() {
      return this.anyKeywordsArr.length;
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
  watch: {
    "addAnysisModel.keywords"(val) {
      this.addAnysisModel.taskName = this.anyKeywordsArr[0]
        ? this.anyKeywordsArr[0] + " " + this.anyKeywords
        : null;
    }
  },
  data() {
    let vm = this;
    // 自定义校验
    var validateKeyword = (rule, value, callback) => {
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== "");
      // this.keywordsArr = val;
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      let keyworldLength = null;
      // if (regEn.test(value) || regCn.test(value)) {
      //   callback(new Error("不能包含特殊字符"));
      // } else
      if (val.length > 500) {
        callback(new Error("输入数量不能超过500个"));
      } else {
        callback();
      }
    };
    return {
      show: true,
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
        func: this.addSearch
      },
      StatusOptions: [
        {
          value: 0,
          label: "Google"
        },
        // {
        //   value: 1,
        //   label: "速卖通"
        // },
        {
          value: 2,
          label: "merchantwords"
        }
      ],
      addAnysisRules: {
        keywords: [
          {
            required: true,
            message: "请输入关键词",
            trigger: "blur"
          },
          { validator: validateKeyword, trigger: ["change", "blur"] } //限定输入的个数
        ],
        searchSites: [
          {
            required: true,
            message: "请至少选择一个来源",
            trigger: "change"
          }
        ]
      },
      addSearchRules: {
        keywords: [
          {
            required: true,
            message: "请输入关键词",
            trigger: ["blur", "change"]
          },
          { validator: validateKeyword, trigger: ["blur", "change"] } //限定输入的个
        ],
        searchPages: [
          { required: true, message: "请选择页数", trigger: "blur" }
        ],
        siteValue: [
          { required: true, message: "请选择站点", trigger: "change" }
        ]
      },
      formLabelWidth: "80px",
      addProjectForm: {},
      addSearchModel: {},
      moveGroupModel: {
        groupId: [-1]
      },
      addAnysisModel: {
        searchSites: []
      },
      addGroupModel: {},
      selectListForm: {},
      selectList: [],
      addKeywordObj: {
        show: false,
        title: "添加关键词"
        // width: "800px"
      },
      addKeywordModel: {},
      addGroupObj: {
        show: false,
        title: "添加分组"
      },
      addSearchObj: {
        show: false,
        title: "加入查询",
        point: 3
      },
      addAnysisObj: {
        show: false,
        title: "加入关键词竞争分析",
        point: 5
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
      groupType: 0,

      // 查询组
      inputs: [
        {
          placeholder: "请输入关键词",
          key: "keyword"
        },
        {
          placeholder: "分组名称",
          key: "groupId",
          type: 2
        }
      ],

      // 表格上的按钮组
      tableBtns: [
        {
          name: "添加关键词",
          plain: true,
          fn() {
            vm.addKeywordObj.show = true;
            vm.$nextTick(() => {
              vm.$refs.addKeywordModel.resetFields();
              const groupId = vm.$refs.tree.getAllKeys();
              vm.addKeywordModel = {
                groupId: groupId && groupId[0] !== 0 ? groupId : [-1]
              };
            });
          }
        },
        {
          name: "加入关键词竞争分析",
          plain: true,
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }

            vm.addAnysisObj.show = true;
            vm.$nextTick(() => {
              vm.$refs.addAnysisForm.resetFields();
              vm.addAnysisModel = {
                searchSites: []
              };
              vm.$set(
                vm.addAnysisModel,
                "keywords",
                vm.multipleSelection.map(el => el.keyword).join("\n")
              );
            });
          }
        },
        {
          name: "加入查询",
          plain: true,
          fn() {
            if (!vm.multipleSelection.length) {
              vm.$message.warning("请选择后进行操作");
              return;
            }

            vm.addSearchModel = {};
            vm.$set(
              vm.addSearchModel,
              "keywords",
              vm.multipleSelection.map(el => el.keyword).join("\n")
            );

            vm.addSearchObj.show = true;
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
                vm.delKeywords(vm.multipleSelection.map(el => el.keywordLibId));
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
                  vm.multipleSelection.map(el => el.keywordLibId),
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
      updatekeywordLib: "myAttention/updatekeywordLib",
      updateGroupData: "myAttention/updateGroupData"
    }),
    ...mapMutations({
      updateGroupDataMutation: "myAttention/updateGroupDataKeyword"
    }),
    // 更新分组数据
    updateTreeData(cb) {
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
    // 更新表格数据
    updateTableData(params) {
      let groupId =
        (this.$refs.tree && this.$refs.tree.$refs.tree.getCurrentKey()) || 0;

      this.updatekeywordLib(
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

    delKeywords(keywordLibIds) {
      this.$axios
        .post("/KeywordLib/remove", {
          keywordLibIds
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.updateTableData();
              this.updateTreeData();
              this.addKeywordObj.show = false;
            },
            true
          );
        });
    },

    // 删除选项
    deleteItem(row) {
      const keywordLibIds = [row.keywordLibId];
      this.$confirm("是否删除关键词?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.delKeywords(keywordLibIds);
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
          this.addKeywordObj.show = false;
        },
        true
      );
    },

    // 移动产品分组
    moveGroup(keywordLibIds, groupId) {
      this.$refs.moveGroupModel.validate(valid => {
        if (valid) {
          this.moveOutGroup(keywordLibIds, groupId);
        }
      });
    },

    moveOutGroup(keywordLibIds, groupId) {
      if (groupId == null) {
        keywordLibIds = this.multipleSelection.map(el => el.keywordLibId);
        groupId = this.moveGroupModel.groupId.slice().pop();
      }
      this.$axios
        .post("/KeywordLib/updateGroup", {
          keywordLibIds,
          groupId
        })
        .then(res => {
          this.$.handlerCode(
            res,
            () => {
              this.moveGroupObj.show = false;
              this.$refs.moveGroupModel &&
                this.$refs.moveGroupModel.resetFields();
              this.moveGroupModel = {
                groupId: [-1]
              };
              this.$refs.tree.updateAndKeep();
            },
            true
          );
        });
    },

    // 添加分组
    addGroup() {
      this.$refs.addGroupModel.validate(v => {
        if (v) {
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
                this.addKeywordGroupList
              );
              this.moveGroupModel.groupId = arr ? [...arr, lastId] : [lastId];
            }
          );
        }
      });
    },

    // 添加关键词
    addKeyword() {
      this.$refs.addKeywordModel.validate(valid => {
        if (valid) {
          const { platformId, siteId } = this;
          let { groupId, keywords } = this.addKeywordModel;
          keywords = this.$.getMultiWords(keywords);
          groupId = groupId ? groupId.slice().pop() : -1;
          this.$axios
            .post("/KeywordLib/save", {
              keywords,
              groupId,
              siteId,
              platformId
            })
            .then(res => {
              this.$.handlerCode(
                res,
                () => {
                  this.$refs.addKeywordModel.resetFields();
                  this.updateTableData();
                  this.updateTreeData();
                  this.addKeywordObj.show = false;
                },
                true
              );
            });
        }
      });
    },

    addSearchDialog() {
      this.$refs.addSearchForm.validate(valid => {
        if (valid) {
          this.addSearch(1);
        }
      });
    },

    // 加入查询
    addSearch(isPoint) {
      const { platformId, siteId } = this;
      let { keywords, searchPages } = this.addSearchModel;
      keywords = this.$.getMultiWords(keywords);
      const params = {
        keywords,
        platformId,
        type: 0,
        siteId,
        searchPages
      };
      if (!isPoint) {
        delete params.type;
      }
      this.$axios.post("/TaskKeywordQuery/save", params).then(res => {
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
        this.addSearchObj.show = false;
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reloadPointApi();
        }
        // this.$.handlerCode(
        //   res,
        //   () => {
        //     this.addSearchObj.show = false;
        //   },
        //   true
        // );
      });
    },

    addAnysisDialog() {
      this.$refs.addAnysisForm.validate(valid => {
        if (valid) {
          this.addAnysis(1);
        }
      });
    },

    // 加入关键词竞争分析
    addAnysis(isPoint) {
      const { platformId, siteId } = this;
      let { searchSites, keywords, taskName } = this.addAnysisModel;
      keywords = this.$.getMultiWords(keywords);

      const params = {
        platformId,
        type: 0,
        siteId,
        searchSites,
        keywords,
        taskName
      };
      if (!isPoint) {
        delete params.type;
      }
      this.$axios.post("/TaskKeywordCompete/save", params).then(res => {
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
        this.addAnysisObj.show = false;
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reloadPointApi();
        }

        // this.$.handlerCode(
        //   res,
        //   () => {
        //     this.addAnysisObj.show = false;
        //   },
        //   true
        // );
      });
    }
  }
};
</script>

<style scoped>
.h100 {
  height: 100%;
}
.left {
  /* background: #f4f6f6; */
  /* border-right: 1px solid #eee; */
  height: initial;
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

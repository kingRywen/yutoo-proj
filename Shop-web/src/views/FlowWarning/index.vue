<template>
  <div class="box">
    <tpl-drawer>
      <div slot="leftMenu" class="box-left-menu">
        <el-input placeholder="输入类目进行过滤" v-model.trim="filterText" size="mini" class="menu-select" clearable>
        </el-input>
        <div style="text-align:right;width:100%">
					<el-tooltip class="item" effect="light" content="重新加载" placement="top-start" :enterable="false">
						<el-button type="text" icon="el-icon-refresh" @click="getCustomCategory"></el-button>
					</el-tooltip>

					<!-- <el-tooltip class="item" effect="light" content="关联管理" placement="top-start" :enterable="false">
						<i class="el-icon-menu" v-show="elIconMenuShow" @click="showRelateDialog"></i>
					</el-tooltip> -->

        </div>
        <!-- default-expand-all -->

        <el-tree node-key="cusCateId" :data="customCategoryData" :props="defaultProps" highlight-current @node-click="handleNodeClick" ref="treeCustomCategory" :filter-node-method="filterNode" v-loading="treeLoading" :expand-on-click-node="false" :key='treeKey'>
          <span class="span-ellipsis" slot-scope="{ node, data }">
            <span :title="node.label" class="font12">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div slot="body" class="box-body">
        <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="tabLabel1" name="tabLabel1">
            <TaskFwKeyword :p-params="pParams" v-on:setTotal="getTotal" />
          </el-tab-pane>
          <el-tab-pane :label="tabLabel2" name="tabLabel2">
            <TaskFwKeywordRelate :p-params="pParams" v-on:setTotal="getTotal" :fn='showRelateDialog'/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </tpl-drawer>

    <yt-dialog title="关联管理"   :options="outerVisible" width="1024px" :events="outerVisibleEvents">
      <div class="dialog-box">
        <el-form :inline="true" :model="listQuery" ref="listQueryForm">
          <el-form-item prop="monitorCategory">
            <el-cascader :options="monitorCategoryData" v-model="listQuery.monitorCategory" :props="cascaderProps" placeholder="系统类目" size="mini" clearable @change='seleChange'>
            </el-cascader>
          </el-form-item>
          <el-form-item prop="monitorParentAsin">
            <el-input v-model.trim="listQuery.monitorParentAsin" placeholder="产品ASIN" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item prop="relateParentAsin">
            <el-input v-model.trim="listQuery.relateParentAsin" placeholder="关联ASIN" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item prop="relateCategory">
            <el-cate :Cate.sync="listQuery.relateCategory" width="100%" :HaveChildform.sync="form.haveChildren" :CategoryId.sync="form.categoryId" :platformId="platformId"></el-cate>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" plain v-for="item in ['确认搜索']" @click="distribute(item)" :disabled="$store.state.isloading || $store.state.loading">{{item}}</el-button>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 10px;">
          <el-button size="mini" type="primary" plain v-for="item in ['添加','删除','停止监控','开启监控']" @click="distribute(item)" :disabled="$store.state.isloading || $store.state.loading">{{item}}</el-button>
        </div>
        <el-table :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%;margin-bottom: 10px;" border stripe tooltip-effect="light" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column label="监控类目或产品" min-width="110" :formatter="formatterMonitorCategorys" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="关联类目或产品" min-width="110" prop="relateSource" show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="监控状态" width="90">
            <template slot-scope="scope">
              <div v-if="scope.row.monitorFlag==0">
                关闭
              </div>
              <div v-else-if="scope.row.monitorFlag==1">
                开启
              </div>
              <div v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="110" :formatter="formatterStatus">
          </el-table-column>

          <el-table-column label="操作" width="75">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showDialog(scope.row,true)"></el-button>
              <el-button v-if="scope.row.status==2" type="text" size="mini" icon="el-icon-search" @click="showDialog(scope.row,false)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="padding-bottom: 10px;" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        </div>
      </yt-dialog>

      <yt-dialog title="添加关联" :options="innerAddVisible" class="inner-add-visible-dialog" append-to-body :events="innerAddVisibleEvents">
        <el-form :model="ruleAddForm" :rules="addRules" ref="ruleAddForm" label-width="100px" class="rule-add-form" >
          <el-form-item label="监控数据类型:" prop="monitorType" :rules="[
                      { required: true, message: '请选择监控数据类型', trigger: 'blur' },
                    ]">
            <el-select v-model="ruleAddForm.monitorType" placeholder="请选择" size="mini" clearable>
              <el-option label="类目" value="0"></el-option>
              <el-option label="产品" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选择类目:" prop="monitorCategorysStr" v-if="ruleAddForm.monitorType==0" :rules="[
                        { required: true, message: '请选择类目', trigger: ['blur', 'change'] },
                      ]" key="monitorCategorysStr">
            <el-input placeholder="选择类目" v-model.trim="ruleAddForm.monitorCategorysStr" size="mini" disabled>
            </el-input>
            <el-button size="mini" type="primary" plain @click="showCategorysDialog('customCategoryList')">选择类目</el-button>
          </el-form-item>

          <el-form-item label="产品ASIN:" prop="monitorParentAsins" v-else-if="ruleAddForm.monitorType==1" :rules="[
                      { required: true, message: '请输入产品ASIN', trigger: 'blur' },
                    ]" key="monitorParentAsins">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="ruleAddForm.monitorParentAsins">
            </el-input>
          </el-form-item>

          <!-- :rules="[
                      { required: true, message: '请输入关键词', trigger: 'blur' },
                    ]" -->
          <el-form-item label="新增关键词:" prop="keywords">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="ruleAddForm.keywords"></el-input>
          </el-form-item>

          <el-form-item label="关联数据类型:" prop="relateType" :rules="[
                      { required: true, message: '请选择关联数据类型', trigger: 'blur' },
                    ]">
            <el-select v-model="ruleAddForm.relateType" placeholder="请选择" size="mini" clearable>
              <el-option label="类目" value="0"></el-option>
              <el-option label="产品" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择类目:" prop="relateSourceStr" v-if="ruleAddForm.relateType==0" :rules="[
                      { required: true, message: '请选择类目', trigger: ['blur', 'change'] },
                    ]" key="relateSourceStr">
            <el-input placeholder="选择类目" v-model.trim="ruleAddForm.relateSourceStr" size="mini" disabled></el-input>
            <el-button size="mini" type="primary" plain @click="showCategorysDialog('GetCateList')">选择类目</el-button>
          </el-form-item>

          <el-form-item label="产品ASIN:" prop="relateSourceAsin" v-else-if="ruleAddForm.relateType==1" :rules="[
                      { required: true, message: '请输入产品ASIN', trigger: 'blur' },
                    ]" key="relateSourceAsin">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="ruleAddForm.relateSourceAsin"></el-input>
          </el-form-item>
        </el-form>
        <!-- <div slot="footer" class="dialog-footer"> -->
          <!-- <el-button type="primary" @click="submitSave" :loading="loadingBtn1">保 存</el-button>
          <el-button type="primary" @click="cancelSave">取 消</el-button> -->
          <!-- <el-button
            :loading="$store.state.isloading || $store.state.loading"
            size="small"
            type="primary"
            @click="submitSave"
          >{{'确定'}}</el-button>
          <el-button
            size="small"
            type="primary"
            plain
            @click="cancelSave"
          >取消</el-button>
            </div> -->
      </yt-dialog>

      <yt-dialog title='查看/编辑' :options="dialogTitle"  class="inner-visible-dialog" append-to-body :events='dialogTitleEvents'>
        <div style="margin-bottom: 10px;">
          <el-radio-group v-model="radioType" size="mini" @change="changeRadioType">
            <el-radio-button label="1">监控数据</el-radio-button>
            <el-radio-button label="2">关键词</el-radio-button>
            <el-radio-button label="3">关联数据</el-radio-button>
          </el-radio-group>
        </div>
        <div class="body-box">
          <div style="margin-bottom: 10px;" v-if="dialogTitle.title==='编辑'">
            <el-button size="mini" type="primary" plain @click="showAddAttributeDialog()">添 加</el-button>
            <el-button size="mini" type="primary" plain @click="deleteAttributeRows()">删 除</el-button>
          </div>
          <el-table :data="tmpList" style="width: 100%;margin-bottom: 10px;" border stripe tooltip-effect="light" @selection-change="handleTmpSelectionChange">
            <el-table-column v-if="dialogTitle.title==='编辑'" type="selection" width="55">
            </el-table-column>
            <el-table-column :label="tmpLabel" prop="value" min-width="100" show-overflow-tooltip>
            </el-table-column>

          </el-table>
        </div>
        <!-- <div slot="footer" class="dialog-footer" v-if="dialogTitle.title==='编辑'">
          <el-button type="primary" @click="submitAttribute" size='small'>保 存</el-button>
          <el-button type="primary" @click="dialogTitle.visible=false"   plain size='small'>取 消</el-button>
        </div>
        <div slot="footer" class="dialog-footer" v-else>
          <el-button type="primary" @click="dialogTitle.visible=false" size='small'>关 闭</el-button>
        </div> -->

      </yt-dialog>
      <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="outerVisible = false">取 消</el-button>
            <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
            </div> -->
  

    <!-- <yt-dialog :options="treeOptions" :events="treeEvents" class="tree-dialog">
            <el-tree :data="dialogCustomCategoryData" :props="cascaderProps" @node-click="handleNodeClick" show-checkbox node-key="cusCateId" v-if="treeApiName=='customCategoryList'" ref="treeCustomCategoryList" key="custom-category-list"></el-tree>

            <el-tree :props="cateProps" :load="loadNode" lazy show-checkbox node-key="pcid" v-else-if="treeApiName=='GetCateList'" ref="treeGetCateList" :check-strictly="true" key="get-cate-list" @check-change="handleCheckChange">
            </el-tree>
        </yt-dialog> -->

    <yt-dialog :options="treeOptions1" :events="treeEvents1" class="tree-dialog">
      <el-tree :data="dialogCustomCategoryData" :props="cascaderProps" @node-click="handleNodeClick" show-checkbox node-key="cusCateId" ref="treeCustomCategoryList"></el-tree>
    </yt-dialog>

    <yt-dialog :options="treeOptions2" :events="treeEvents2" class="tree-dialog">
      <el-tree :props="cateProps" :load="loadNode" lazy show-checkbox node-key="pcid" ref="treeGetCateList" :check-strictly="true" @check-change="handleCheckChange">
      </el-tree>
    </yt-dialog>
    <!-- 
            monitorType
            radioType 
        -->
    <yt-dialog :options="addOptions" :events="addEvents" class="add-yt-dialog">
      <el-form label-position="right" label-width="100px" :model="addForm">

        <el-form-item label="选择类目:" prop="categoryStr" v-if="(radioType==1&&monitorType==0)||(radioType==3&&relateType==0)">
          <el-input placeholder="选择类目" v-model.trim="addForm.categoryStr" size="mini" disabled>
          </el-input>
          <el-button size="mini" type="primary" plain @click="showAddCategorysDialog()">选择类目</el-button>
        </el-form-item>

        <el-form-item label="产品ASIN:" prop="asin" v-else-if="(radioType==1&&monitorType==1)||(radioType==3&&relateType==1)">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="addForm.asin">
          </el-input>
        </el-form-item>

        <el-form-item label="新增关键词:" prop="keywords" v-else-if="radioType==2">
          <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model.trim="addForm.keywords">
          </el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import TplDrawer from "../Common/tpl-drawer/index";
import YTemplate from "../Common/y-template/index";
import TaskFwKeyword from "./TaskFwKeyword";
import TaskFwKeywordRelate from "./TaskFwKeywordRelate";
export default {
  components: {
    TplDrawer,
    YTemplate,
    TaskFwKeyword,
    TaskFwKeywordRelate
  },
  data() {
    return {
      activeName: "tabLabel1",
      elIconMenuShow: false,
      tabLabel1: "关键词排名下降(0)",
      tabLabel2: "关联流量排名下降(0)",
      filterText: null,

      treeQuery: {
        sellerId: null
      },
      treeKey: 1,
      treeLoading: false,
      customCategoryData: [],

      defaultProps: {
        children: "childList",
        label: "cusCateName"
      },
      cascaderProps: {
        value: "cusCateId",
        label: "cusCateName",
        children: "childList"
      },

      //outerVisible: false,
      outerVisible:{
        visible: false,
        width: "1024px",
        title: "关联管理",
        showFooter:false
        //okBtnText: "确认"
      },
      outerVisibleEvents:{

      },

      //innerAddVisible: false,
      innerAddVisible: {
        visible: false,
        width: "530px",
        title: "添加关联",
      },
      innerAddVisibleEvents:{
          handleOkClick: () => {
            this.submitSave();
          }
      },
      innerVisible: false,

      relateSourceProps: {
        value: "pcid",
        label: "name"
        // children: 'children'
      },
      form: {
        haveChildren: "",
        category: "",
        categoryId: null
      },
      monitorCategoryData: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,
        // monitorCategory: [],
        // monitorParentAsin: null,

        // relateSourceInput: null,
        // relateSourceCascader: [],

        // relateSource: null // parentName:name
        monitorCategory: [],
        monitorParentAsin: null,
        relateParentAsin: null,
        relateCategory: null
      },
      //dialogTitle: "编辑",
      dialogTitle:{
        title:"编辑",
        visible:false,
        width:"500px",
      },
      dialogTitleEvents:{
          handleOkClick: () => {
            this.submitAttribute();
          }
      },
      radioType: "1",
      monitorType: null,
      relateType: null,

      ruleAddForm: {
        platformId: null,
        siteId: null,
        sellerId: null,
        monitorType: "0",
        monitorCategorys: null,
        monitorCategorysStr: null, // 临时
        monitorParentAsins: null,
        keywords: null,
        relateType: "0",
        relateSourceStr: null, // 临时
        relateSourceAsin: null, // 临时
        relateSource: null, // 类目和ASIN 是同一字段
        monitorFlag: 1
      },

      dialogCustomCategoryData: [],
      treeForm: {},
      // treeOptions: {
      //   visible: false,
      //   width: "350px",
      //   title: "选择类目",
      //   okBtnText: "确认"
      // },
      // treeEvents: {
      //   handleOkClick: () => {
      //     this.getTreeId();
      //   }
      // },

      treeOptions1: {
        visible: false,
        width: "350px",
        title: "选择类目",
        okBtnText: "确认"
      },
      treeEvents1: {
        handleOkClick: () => {
          this.getTreeId();
        }
      },

      treeOptions2: {
        visible: false,
        width: "350px",
        title: "选择类目",
        okBtnText: "确认"
      },
      treeEvents2: {
        handleOkClick: () => {
          this.getTreeId();
        }
      },

      taskId: null,
      monitorCategorys: null,
      monitorParentAsins: null,
      keywords: null,
      relateSource: null,
      tmpList: null,
      tmpLabel: "类目或产品",

      addForm: {
        categoryStr: null,
        asin: null,
        keywords: null
      },
      addOptions: {
        visible: false,
        width: "500px",
        title: "添加",
        okBtnText: "确认"
      },
      addEvents: {
        handleOkClick: () => {
          this.submitAddTmp();
        }
      },
      treeApiName: "customCategoryList",
      cateProps: {
        children: "children",
        label: "name"
      },
      cateData: [],
      multipleSelection: [],
      multipleTmpSelection: [],

      pParams: {
        platformId: null,
        cusCateId: null,
        siteId: null,
        sellerId: null,
        tabLabel: "tabLabel1"
      },
      loadingBtn1: false
    };
  },
  created() {
      this.ruleAddForm.platformId=this.platformId;
    this.listQuery.platformId=this.platformId;
    this.pParams.platformId=this.platformId;
    this.initPage();
  
  },
  watch: {
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val);
    },
    sellerData() {
      this.initPage();
      this.getTotal(0);
    },
    "listQuery.relateCategory"(newV, oldV) {
      if (!newV) {
        this.getList();
      }
    }
  },
  methods: {
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.handleFilter();
          break;
        case "添加":
          this.showSaveDialog();
          break;
        case "删除":
          this.deleteRows();
          break;
        case "停止监控":
          this.handleMonitor("stop");
          break;
        case "开启监控":
          this.handleMonitor("open");
          break;
      }
    },
    //关联管理选择变化时
    seleChange() {
      this.getList();
    },
    getTotal(id) {
      // let {type,total} =params
      // if(type==='keyword'){
      //   this.tabLabel1=`关键词排名下降(${total})`
      // }else if(type==='flow'){
      //   this.tabLabel2=`关联流量排名下降(${total})`
      // };

      let param = {
        siteId: this.siteId,
        sellerId: this.sellerId,
        platformId: this.platformId,
        cusCateId: id
      };
      //console.log('object202222222222');

      this.$api["taskFwKeywordlistCount"](param)
        .then(res => {
          // console.log('----------------------------666666666666777');
          // console.log(res);
          let { data } = res;

          if (res.code === 0) {
            this.tabLabel1 =
              data[0].pageType === 0 ? `关键词排名下降(${data[0].total})` : "";
            this.tabLabel2 =
              data[1].pageType === 1
                ? `关联流量排名下降(${data[1].total})`
                : "";
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleClick(tab, event) {
      let d = new Date();
      if (tab.name == "tabLabel1") {
        this.elIconMenuShow = false;
        this.pParams.tabLabel = `tabLabel1-${d.getTime()}`;
      } else if (tab.name == "tabLabel2") {
        this.elIconMenuShow = true;
        this.pParams.tabLabel = `tabLabel2-${d.getTime()}`;
      }
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.treeQuery.sellerId = this.sellerId;
        this.getCustomCategory();
        this.getTotal(0);
        this.listQuery.siteId = this.siteId;
        this.listQuery.sellerId = this.sellerId;

        this.pParams.platformId = this.listQuery.platformId;
        this.pParams.siteId = this.siteId;
        this.pParams.sellerId = this.sellerId;

        this.ruleAddForm.platformId = this.listQuery.platformId;
        this.ruleAddForm.sellerId = this.sellerId;
        this.ruleAddForm.siteId = this.siteId;

        this.$store.state.common.siteId__ = this.siteId;
      }
    },
    getCustomCategory() {
      this.treeLoading = true;
      this.getcustomCategoryList("init");
      setTimeout(() => {
        this.treeLoading = false;
      }, 500);
    },
    getcustomCategoryList(type) {
      this.$api["customCategoryList"]({
        sellerId: this.treeQuery.sellerId
      }).then(res => {
        let { code, data } = res;
        if (code === 0) {
          let customCategoryData = data;
          customCategoryData.push({
            childList: null,
            cusCateId: -1,
            cusCateName: "未映射类目产品",
            haveChildren: 0,
            parentCusCateId: 0
          });
          customCategoryData.unshift({
            childList: null,
            cusCateId: 0,
            cusCateName: "全部",
            haveChildren: 0,
            parentCusCateId: 0
          });
          this.customCategoryData = customCategoryData;
          if (type === "init") {
            if (data.length > 0) {
              let cusCateId = data[0].cusCateId;
              setTimeout(() => {
                this.$refs.treeCustomCategory.setCurrentKey(cusCateId);
                this.pParams.cusCateId = cusCateId;
              }, 500);
            }
          } else if (type == "dialog") {
            this.setTreeIdDisabled(data);
          }
        }
      });
    },
    setTreeIdDisabled(data) {
      this.dialogCustomCategoryData = _.remove(
        _.cloneDeep(
          _.remove(_.cloneDeep(data), function(n) {
            return n.cusCateName !== "全部";
          })
        ),
        function(n) {
          return n.cusCateName !== "未映射类目产品";
        }
      );

      // this.dialogCustomCategoryData = _.remove(_.cloneDeep(data), function(n) {
      //     return n.cusCateName!=='全部';
      // });
      // 设置父节点禁用
      // this.dialogCustomCategoryData.forEach(element => {
      //   function nextNode(node) {
      //     if (node.childList instanceof Array) {
      //       node.disabled = true;
      //       let childList = node.childList;
      //       childList.forEach(el => {
      //         if (el.children instanceof Array) {
      //           nextNode(el);
      //         }
      //       });
      //     }
      //   }
      //   nextNode(element);
      // });
      this.treeOptions1.visible = true;
    },
    handleNodeClick(data) {
      this.pParams.cusCateId = data.cusCateId;
      //console.log(data.cusCateId);
      this.getTotal(data.cusCateId);
      //this.pParams.isClick++;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.cusCateName.indexOf(value) !== -1;
    },
    showRelateDialog() {
      this.monitorCategoryData = _.remove(
        _.cloneDeep(
          _.remove(_.cloneDeep(this.customCategoryData), function(n) {
            return n.cusCateName !== "全部";
          })
        ),
        function(n) {
          return n.cusCateName !== "未映射类目产品";
        }
      );
      this.listQuery.monitorCategory = [];
      this.getCustomCategory();
      this.outerVisible.visible= true;
      this.handleFilter();
    },
    formatterMonitorCategorys(row, column) {
      let monitorType = row.monitorType;
      let arr = [];
      if (monitorType == 0) {
        let monitor = row.monitorCategorys;
        if (!monitor) {
          return "-";
        }
        monitor.forEach(element => {
          arr.push(element.cusCateName);
        });
      } else if (monitorType == 1) {
        let monitor = row.monitorParentAsins;
        if (!monitor) {
          return "-";
        }
        monitor.forEach(element => {
          arr.push(element);
        });
      } else {
        return "-";
      }
      return arr.toString();
    },
    // formatterRelateSource(row, column) {
    //   let relateSource = row.relateSource;
    //   if(!relateSource){
    //     return '-'
    //   }
    //   return relateSource.toString();
    // },
    formatterStatus(row, column) {
      let status = row.status;
      let str = "-";
      switch (status) {
        case 0:
          str = "待处理";
          break;
        case 1:
          str = "抓取中";
          break;
        case 2:
          str = "抓取成功";
          break;
        case 3:
          str = "抓取失败";
          break;
        case 4:
          str = "页面不存在";
          break;
        case 2:
          str = "大数据分析失败";
          break;
        case 6:
          str = "kafka连接异常";
          break;
      }
      return str;
    },
    getList() {
      this.listLoading = true;

      let listQuery = _.cloneDeep(this.listQuery);
      if (listQuery.monitorCategory.length === 0) {
        listQuery.monitorCategory = null;
      } else {
        listQuery.monitorCategory = _.last(listQuery.monitorCategory);
      }
      if (listQuery.monitorParentAsin === "") {
        listQuery.monitorParentAsin = null;
      }
      if (listQuery.relateCategory === "") {
        listQuery.relateCategory = null;
      }
      if (listQuery.relateParentAsin === "") {
        listQuery.relateParentAsin = null;
      }

      this.$api["taskFwRelateList"](listQuery)
        .then(res => {
          let { rows, total } = res;

          // rows.forEach(element => {
          //   if(element.relateSource!==null){
          //     element.relateSource =element.relateSource.toString();
          //   }else{
          //     element.relateSource ='1'
          //   }
          // });
          this.list = rows;
          this.total = total;
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
    },
    checkRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("至少选一项");
        return false;
      }
      return true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showSaveDialog() {
      let ruleAddForm = this.$refs["ruleAddForm"];
      if (ruleAddForm !== undefined) {
        ruleAddForm.resetFields();
      }
      this.innerAddVisible.visible= true;
      this.loadingBtn1 = false;
    },
    submitSave() {
      this.$refs["ruleAddForm"].validate(valid => {
        if (valid) {
          let params = _.cloneDeep(this.ruleAddForm);
          if (this.ruleAddForm.keywords !== null) {
            params.keywords = _.compact(this.ruleAddForm.keywords.split("\n"));
            params.keywords = _.uniq(params.keywords);
          } else {
            params.keywords = null;
          }

          /**
            * 监控数据类型
              monitorType
              类目 0 monitorCategorys
              产品 1 monitorParentAsins
            */
          params.monitorType = parseInt(params.monitorType);

          /**
             *  关联数据类型
                relateType
                类目 0 relateSource
                产品 1 relateSource
             */
          params.relateType = parseInt(params.relateType);

          //monitorParentAsins

          if (params.monitorType == 0) {
            params.monitorParentAsins = null;
          } else if (params.monitorType == 1) {
            params.monitorParentAsins = _.compact(
              this.ruleAddForm.monitorParentAsins.split("\n")
            );
            params.monitorParentAsins = _.uniq(params.monitorParentAsins);
            params.monitorCategorys = null;
          }

          if (params.relateType == 1) {
            params.relateSource = _.compact(
              this.ruleAddForm.relateSourceAsin.split("\n")
            );
            params.relateSource = _.uniq(params.relateSource);
          }

          delete params.monitorCategorysStr;
          delete params.relateSourceStr;
          delete params.relateSourceAsin;
          this.loadingBtn1 = true;
          this.$api["taskFwRelateSave"](params)
            .then(res => {
              let { code } = res;
              if (code == 0) {
                this.innerAddVisible = false;
                this.handleFilter();

                this.dialogCustomCategoryData = [];
                let treeGetCateList = this.$refs.treeGetCateList;
                if (treeGetCateList !== undefined) {
                  for (
                    let i = 0;
                    i < treeGetCateList.store._getAllNodes().length;
                    i++
                  ) {
                    treeGetCateList.store._getAllNodes()[i].expanded = false;
                  }
                  treeGetCateList.setCheckedKeys([]);
                }
              }
              this.loadingBtn1 = false;
            })
            .catch(err => {
              this.loadingBtn1 = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelSave() {
      this.innerAddVisible = false;
      this.loadingBtn1 = false;
      this.dialogCustomCategoryData = [];
      let treeGetCateList = this.$refs.treeGetCateList;
      if (treeGetCateList !== undefined) {
        for (let i = 0; i < treeGetCateList.store._getAllNodes().length; i++) {
          treeGetCateList.store._getAllNodes()[i].expanded = false;
        }
        treeGetCateList.setCheckedKeys([]);
      }
    },
    deleteRows() {
      if (!this.checkRows()) {
        return;
      };
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let taskIds = [];
            this.multipleSelection.forEach(element => {
              taskIds.push(element.taskId);
            });
            this.$api["taskFwRelateRemove"]({ taskIds }).then(res => {
              let { code } = res;
              if (code == 0) {
                this.handleFilter();
              }
            });
        }).catch(() => {
                  
        });
      
    },
    handleMonitor(type) {
      if (!this.checkRows()) {
        return;
      }
      let taskIds = [];
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId);
      });
      let monitorFlag = null;
      if (type === "stop") {
        monitorFlag = 0;
      } else if (type === "open") {
        monitorFlag = 1;
      } else {
        return;
      }
      this.$api["taskFwRelateUpdateMonitorFlag"]({ taskIds, monitorFlag }).then(
        res => {
          let { code } = res;
          if (code == 0) {
            this.getList();
          }
        }
      );
    },
    handleTmpSelectionChange(val) {
      this.multipleTmpSelection = val;
    },
    showDialog(row, isEdit) {
      if (isEdit) {
        this.dialogTitle.title= "编辑";
        this.dialogTitle.showFooter = true;
      } else {
        this.dialogTitle.title = "查看详情";
        this.dialogTitle.showFooter = false;
      }
      this.monitorType = row.monitorType;

      this.monitorCategorys = row.monitorCategorys;
      this.monitorParentAsins = row.monitorParentAsins;
      this.taskId = row.taskId;
      // 默认
      this.radioType = "1";
      if (this.monitorType == 0) {
        let list = [];
        if (this.monitorCategorys) {
          this.monitorCategorys.forEach(element => {
            list.push({
              value: element.cusCateName,
              cusCateId: element.cusCateId
            });
          });
        }
        this.tmpList = list;
      } else if (this.monitorType == 1) {
        let list = [];
        if (this.monitorParentAsins) {
          this.monitorParentAsins.forEach(element => {
            list.push({ value: element });
          });
        }

        this.tmpList = list;
      }

      this.keywords = row.keywords;

      this.relateType = row.relateType;

      this.relateSource = row.relateSource;

      // 测试类目
      // this.monitorType =0
      // this.relateType =0
      this.dialogTitle.visible = true;
    },
    changeRadioType(val) {
      if (val == 1) {
        this.tmpLabel = "类目或产品";
        if (this.monitorType == 0) {
          let list = [];

          this.monitorCategorys.forEach(element => {
            list.push({
              value: element.cusCateName,
              cusCateId: element.cusCateId
            });
          });
          this.tmpList = list;
        } else if (this.monitorType == 1) {
          let list = [];
          this.monitorParentAsins.forEach(element => {
            list.push({ value: element });
          });
          this.tmpList = list;
        }
      } else if (val == 2) {
        this.tmpLabel = "关键词名称";
        let list = [];
        this.keywords.forEach(element => {
          list.push({ value: element });
        });
        this.tmpList = list;
      } else if (val == 3) {
        this.tmpLabel = "关联类目或产品";
        let list = [];

        if (this.relateSource) {
          this.relateSource.forEach(element => {
            list.push({ value: element });
          });
        }

        this.tmpList = list;
      }
    },
    showAddCategorysDialog() {
      let apiName = null;
      let radioType = this.radioType;
      if (radioType == 1) {
        apiName = "customCategoryList";
      } else if (radioType == 3) {
        apiName = "GetCateList";
      } else {
        return;
      }
      this.showCategorysDialog(apiName);
    },
    showCategorysDialog(apiName) {
      this.treeApiName = apiName;
      if (apiName == "customCategoryList") {
        // 显中后下次反选
        if (this.dialogCustomCategoryData.length > 0) {
          this.treeOptions1.visible = true;
        } else {
          this.getcustomCategoryList("dialog");
        }
      } else if (apiName == "GetCateList") {
        this.getCateList(0);
      }
    },
    showAddAttributeDialog() {
      this.addForm = {
        categoryStr: null,
        asin: null,
        keywords: null
      };
      this.addOptions.visible = true;
    },
    deleteAttributeRows() {
      if (this.multipleTmpSelection.length === 0) {
        this.$message.warning("至少选一项");
        return;
      }

      let tmpList = [];
      this.tmpList.forEach(element => {
        tmpList.push(element.value);
      });
      let removeList = [];
      this.multipleTmpSelection.forEach(element => {
        removeList.push(element.value);
      });

      _.pull(tmpList, ...removeList);

      let tableList = [];
      tmpList.forEach(element => {
        tableList.push({ value: element });
      });
      this.tmpList = tableList;
    },

    submitAttribute() {
      let radioType = this.radioType;
      let monitorType = this.monitorType;
      let relateType = this.relateType;

      let list = [];
      this.tmpList.forEach(element => {
        list.push(element.value);
      });

      let params = {
        taskId: this.taskId
      };
      if (radioType == 1 && monitorType == 0) {
        params.monitorCategorys = list;
      } else if (radioType == 1 && monitorType == 1) {
        params.monitorParentAsins = list;
      } else if (radioType == 2) {
        params.keywords = list;
      } else if (radioType == 3) {
        params.relateSource = list;
      }

      // if(radioType==3&&relateType==0){

      // }else if(radioType==3&&relateType==1){

      // }

      this.$api["taskFwRelateUpdate"](params).then(res => {
        let { code } = res;
        if (code == 0) {
          this.dialogTitle.visible = false;
          this.getList();
        }
      });
      // alert(this.radioType)
      // radioType
      // monitorType:null,
      // relateType:null,
      // monitorCategorys:null,
      // monitorParentAsins:null,
      // keywords:null,
      // relateSource:null,
      // tmpList:null,
    },
    submitAddTmp() {
      let radioType = this.radioType;
      let monitorType = this.monitorType;
      let relateType = this.relateType;

      let addForm = _.cloneDeep(this.addForm);
      let list = [];
      if (radioType == 1 && monitorType == 0) {
        list = this.ruleAddForm.monitorCategorys;
      } else if (radioType == 1 && monitorType == 1) {
        addForm.asin = _.compact(this.addForm.asin.split("\n"));
        list = _.uniq(addForm.asin);
      } else if (radioType == 2) {
        addForm.keywords = _.compact(this.addForm.keywords.split("\n"));
        list = _.uniq(addForm.keywords);
      } else if (radioType == 3 && relateType == 0) {
        list = this.ruleAddForm.relateSource;
      } else if (radioType == 3 && relateType == 1) {
        addForm.asin = _.compact(this.addForm.asin.split("\n"));
        list = _.uniq(addForm.asin);
      }
      let tmpList = _.cloneDeep(this.tmpList);
      list.forEach(element => {
        tmpList.push({ value: element });
      });

      let uniqList = [];
      tmpList.forEach(element => {
        uniqList.push(element.value);
      });

      tmpList = [];
      _.uniq(uniqList).forEach(element => {
        tmpList.push({ value: element });
      });

      this.tmpList = tmpList;

      this.addOptions.visible = false;
      console.log(this.addForm);
    },
    getCateList(parentPcid) {
      let params = {
        platformId: this.listQuery.platformId,
        siteId: this.listQuery.siteId,
        parentPcid
      };
      this.$api["GetCateList"](params).then(res => {
        let { code, data } = res;
        if (code == 0) {
          data.forEach(element => {
            if (element.haveChildren == 1) {
              element.disabled = true;
            } else if (element.haveChildren == 0) {
              element.isLeaf = true;
            }
          });
          this.cateData = data;
          this.treeOptions2.visible = true;
          // if (parentPcid === 0) {
          //   let treeGetCateList =this.$refs.treeGetCateList
          //   if(treeGetCateList!==undefined){
          //     treeGetCateList.setCheckedKeys([]);
          //     treeGetCateList.store._getAllNodes().forEach(element => {
          //       element.expanded=false;
          //     });
          //   }
          // }
        }
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      // console.log(data, checked, indeterminate);
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.cateData);
      }
      this.getCateList(node.data.pcid);
      setTimeout(() => {
        resolve(this.cateData);
      }, 500);
    },
    getTreeId() {
      let treeApiName = this.treeApiName;
      if (treeApiName === "customCategoryList") {
        let customCategoryTree = this.$refs.treeCustomCategoryList;
        let monitorCategorysArr = [];
        let monitorCategorys = [];
        customCategoryTree.getCheckedNodes().forEach(element => {
          if (element.haveChildren === 0) {
            monitorCategorysArr.push(element.cusCateName);
            monitorCategorys.push(element.cusCateId);
          }
        });
        this.ruleAddForm.monitorCategorysStr = monitorCategorysArr.toString();
        this.addForm.categoryStr = monitorCategorysArr.toString();
        // console.log(customCategoryTree.getCheckedNodes())
        // console.log(customCategoryTree.getCheckedKeys())
        // this.ruleAddForm.monitorCategorys = customCategoryTree.getCheckedKeys();
        this.ruleAddForm.monitorCategorys = monitorCategorys;
        this.treeOptions1.visible = false;
      } else if (treeApiName === "GetCateList") {
        let cateTree = this.$refs.treeGetCateList;
        let relateSource = [];
        let relateSourceArr = [];
        cateTree.getCheckedNodes().forEach(element => {
          if (element.haveChildren == 0) {
            relateSource.push(`${element.parentName}:${element.name}`);
            relateSourceArr.push(element.name);
          }
        });
        this.ruleAddForm.relateSourceStr = relateSourceArr.toString();
        this.addForm.categoryStr = relateSourceArr.toString();
        this.ruleAddForm.relateSource = relateSource;
        //    console.log(cateTree.getCheckedNodes())
        //    console.log(cateTree.getCheckedKeys())
        this.treeOptions2.visible = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.el-icon-box {
  display: flex;
  justify-content:flex-start;
}
.box {
  .box-left-menu {
    .el-icon-box {
      margin-top: 5px;
      margin-bottom: 5px;
      /deep/[class^="el-icon-"] {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .box-body {
    .el-tabs {
      -webkit-box-shadow: 0 0 0 0;
      box-shadow: 0 0 0 0;
      /deep/.el-tabs__content {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
.inner-add-visible-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 270px;
      margin-right: 10px;
    }
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: center;
  }
}
.inner-visible-dialog {
  .body-box {
    padding: 10px;
    border: 1px solid @borderColor;
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: center;
  }
}

.add-yt-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 260px;
      margin-right: 10px;
    }
  }
}
.tree-dialog {
  .el-tree {
    // border:1px solid @borderColor;
    // padding: 5px;
    height: 300px;
    overflow-y: auto;
  }
}
</style>
<style>
.el-tooltip__popper {
  max-width: 800px;
}
</style>

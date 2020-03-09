<template>
  <div class="box ___common">
    <tpl-drawer>
      <div slot="leftMenu" class="box-left-menu">
        <el-input clearable placeholder="输入SKU过滤" v-model="filterText" size="mini" class="menu-select">
        </el-input>
        <div class="el-icon-box">
          <el-button type="text" icon="el-icon-refresh" @click="getCustomCategory"></el-button>
          <el-button type="text" icon="el-icon-plus" @click="showDialog"></el-button>
          <el-button type="text" icon="el-icon-edit-outline" @click="showDialog2"></el-button>
          <!-- <i icon="el-icon-menu" v-show="elIconMenuShow" @click="showRelateDialog"></i> -->
          <el-button type="text" icon="el-icon-delete" @click="sideDelete"></el-button>
          <el-button type="text" icon="el-icon-download" @click="uploadTaskShow = true;buttonLoading.upload = false;"></el-button>
        </div>
        <el-tree :expand-on-click-node="false" show-checkbox node-key="taskId" :data="customCategoryData" :props="defaultProps" highlight-current @node-click="handleNodeClick" ref="treeCustomCategory" :filter-node-method="filterNode" v-loading="treeLoading" :key='treeKey'>
          <span class="span-ellipsis" slot-scope="{ node, data }">
            <span :title="node.label" class="font12">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div slot="body" class="box-body" style="min-width:900px" v-loading="messageLoading">
        <template v-if="detail">
          <template>
          <div>
            <header class="header">
              产品信息
            </header>
            <!-- 图片 -->
            <div class="p-container">
              <div class="picture" v-if="typeof detail.imageUrl==='string'">
                <!-- <img class="loadingImg" v-lazy="detail.imageUrl?detail.imageUrl:'-'"> -->
                <img :src="detail.imageUrl.replace('._SL75_.', '._SL300_.')">
              </div>
              <div class="picture" v-if="typeof detail.imageUrl==='object'">
              </div>
            </div>
            <!-- 详情 -->
            <div class="pd-container">
              <div>
                <span>商品名称：</span>
                <a v-if="detail.productName" rel="noopener noreferrer nofollow" class="aLink common__color" target="_blank" :href="detail.productUrl?detail.productUrl:false" style="text-decoration:none;">{{detail.productName}}</a>
                <span v-else class='s'>-</span>
              </div>
              <div class='margin_top8'>
                <span>最高点击率：</span>
                <span class='s'>{{detail.maxAdvertClickRates | _formatRate2}}</span>

                <span>参考SKU：</span>
                <span class='s'>{{detail.refParentAsin | _formatData}}</span>

                <span>前缀：</span>
                <span class='s'>{{detail.prefix | _formatData}}</span>
              </div>
              <div class='pd-table'>
                <el-table size='mini' ref="multipleTable" :data="taskAdSeoStages" style="width: 100%;position:relative;margin-top:10px;" :stripe="true">
                  <el-table-column prop="stageNo" label="阶段">
                  </el-table-column>
                  <el-table-column prop="stageAdvertOrders" label="订单量指标">
                    <template slot-scope="scope">
                      {{scope.row.stageAdvertOrders}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="stageAdvertHits" label="点击率指标">
                    <template slot-scope="scope">
                      {{scope.row.stageAdvertHits}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="stageAdvertCostRate" label="阶段花费占比">
                    <template slot-scope="scope">
                      {{scope.row.stageAdvertCostRate | _formatRate2}}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-show="detail.taskAdSeoStages.length>2&&!this.switch" style="margin-top:5px;" class="common__color __pointer" @click="showAll">展开></div>
              <div v-show="detail.taskAdSeoStages.length>2&&this.switch" style="margin-top:5px;" class="common__color __pointer" @click="showAll">收起></div>
            </div>
            <!-- 开关、下载导入 -->
            <!-- {{detail.increaseClickFlag}} -->
            <span style="position:relative;top:-200px;left:10px">
              <el-switch v-loading="changeSwitchLoading" v-model="detail.increaseClickFlag" @change="changeSwitch">
              </el-switch>
              <!-- todo -->
              <i @click="uploadTaskShow2 = true;buttonLoading.upload2 = false" class="el-icon-upload common_color __pointer" style="font-size:24px;position:relative;top:5px;left:10px;"></i>
            </span>
          </div>
        </template>
        <template>
          <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect" :selection='false'></el-table-pagination>
        </template>
        </template>
        <NonePage noBack>暂时还没有优化数据哟，请在左侧添加数据</NonePage>
        
      </div>
    </tpl-drawer>
    <el-dialog class="customDialog" :close-on-click-modal="false" title="添加优化" :visible.sync="dialogVisible" width="980px">
      <template>
        <el-form size="small" :model="form" :rules="rules" ref="ruleForm" style="width:100%;">
          <div v-for="(item,index) in form.adSeos" :key="index">

            <el-form-item label="SKU" :prop="'adSeos.'+index+'.parentAsin'" :rules="rules.parentAsin" style="width:179px;display:inline-block">
                <el-tooltip content="可以是父产品或子SKU" placement="top" effect="light">
                  <i class='el-icon-question' style='position:absolute;left:34px;top:6px;font-size:18px;'></i> 
                </el-tooltip>
               <el-input :autofocus="false" type="text" v-model.trim="item.parentAsin" style="width:100px;margin-left:12px;" placeholder="SKU" size='mini' />
            </el-form-item>

            <el-form-item label="最高点击率" :prop="'adSeos.'+index+'.maxAdvertClickRates'" :rules="rules.maxAdvertClickRates" style="width:235px;display:inline-block">
               <el-tooltip content="自己操作的最高点击率配置,未达到时会给予提示" placement="top" effect="light">
                  <i class='el-icon-question' style='position:absolute;left:70px;top:6px;font-size:18px;'></i> 
                </el-tooltip>
              <el-input :autofocus="false" type="text" v-model.number="item.maxAdvertClickRates" style="width:100px;margin-left:12px;" placeholder="最高点击率" class="mr10" size='mini' />%
            </el-form-item>

            <el-form-item label="参考父SKU" :prop="'adSeos.'+index+'.refParentAsin'" :rules="rules.refParentAsin" style="width:230px;display:inline-block">
                <el-tooltip content="当优化产品数不足时,将使用参考ASIN的数据作为参考" placement="top" effect="light">
                  <i class='el-icon-question' style='position:absolute;left:70px;top:6px;font-size:18px;'></i> 
                </el-tooltip>
              <el-input :autofocus="false" type="text" v-model.trim="item.refParentAsin" style="width:100px;margin-left:12px;" placeholder="参考父SKU" size='mini' />
            </el-form-item>

            <el-form-item label="前缀" :prop="'adSeos.'+index+'.prefix'" :rules="rules.prefix" style="width:170px;display:inline-block">
                <el-tooltip content="用于自动开设广告时组和系列用这个前缀+流水号作为名称,非必填" placement="top" effect="light">
                  <i class='el-icon-question' style='position:absolute;left:34px;top:6px;font-size:18px;'></i> 
                </el-tooltip>
              <el-input :autofocus="false" type="text" v-model.trim="item.prefix" style="width:100px;margin-left:12px" placeholder="前缀" size='mini' />
            </el-form-item>

            <el-form-item style="width:100px;display:inline-block" v-if="status===1">
              <span class="esc_desc __pointer common__color el-icon-minus" v-if="form.adSeos.length>1?true:false" @click="spliceItem(index)"></span>
              <span class="esc_desc __pointer common__color el-icon-plus" v-if="index===0&&form.adSeos.length===1||index===form.adSeos.length-1&&form.adSeos.length>1?true:false" @click="addItem"></span>
            </el-form-item>
          </div>

          <div class="stage-box" v-for="(item,index1) in form.taskAdSeoStages" :key="index1">
            <div class="tit">
              阶段{{index1+1}}
              <el-input :autofocus="false" type="hidden" v-model.trim="item.stageNo" style="width:100px;visibilitity:" :value="index1+1" size='mini' />
            </div>
            <el-form-item label="订单量" :prop="'taskAdSeoStages.'+index1+'.stageAdvertOrders'" :rules="rules.stageAdvertOrders" style="width:235px;display:inline-block">
              <el-input :autofocus="false" type="text" v-model.number="item.stageAdvertOrders" style="width:100px;" placeholder="订单量" size='mini' />
            </el-form-item>

            <el-form-item label="点击量" :prop="'taskAdSeoStages.'+index1+'.stageAdvertHits'" :rules="rules.stageAdvertHits" style="width:230px;display:inline-block">
              <el-input :autofocus="false" type="text" v-model.number="item.stageAdvertHits" style="width:100px;" placeholder="点击量" size='mini' />
            </el-form-item>

            <el-form-item label="花费占比" :prop="'taskAdSeoStages.'+index1+'.stageAdvertCostRate'" :rules="rules.stageAdvertCostRate" style="width:230px;display:inline-block">
              <el-input :autofocus="false" type="text" v-model.number="item.stageAdvertCostRate" style="width:100px;" placeholder="花费占比" class="mr10" size='mini' />%
            </el-form-item>

            <el-form-item style="width:100px;display:inline-block">
              <span class="esc_desc __pointer common__color el-icon-minus" v-if="form.taskAdSeoStages.length>1?true:false" @click="spliceItem1(index1)"></span>
              <span class="esc_desc __pointer common__color el-icon-plus" v-if="index1===0&&form.taskAdSeoStages.length===1||index1===form.taskAdSeoStages.length-1&&form.taskAdSeoStages.length>1?true:false" @click="addItem1"></span>
            </el-form-item>
          </div>
        </el-form>
      </template>
      <div slot="footer" class="txc">
        
        <el-button type="primary" @click="submit()" size='small' :loading="submitLoading">确定</el-button>
        <el-button @click="dialogVisible = false" size='small'>取消</el-button>
      </div>
    </el-dialog>
    <a v-show="false" ref="exportExcel"></a>
    <el-dialog class="customDialog" :close-on-click-modal="false" title="下载/导入点击率模板" :visible.sync="uploadTaskShow" style="padding-right:100px;" width="500px">
      <ImportFile @success="handleSuccess1" filename="点击率模板" :data="downloadData" :downloadApi="downloadApi1" :action="action1" />
      <!-- <div style="position:relative;">
        <div style="position:relative;left:100px;top:-6px;width: 300px;">
          <el-upload style="margin-top:8px;" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange" :file-list="fileList" :on-remove="handleFileRemove" :auto-upload="false">
            <el-button size="mini" type="primary" plain>导入数据</el-button>
          </el-upload>
        </div>
        <el-button size="mini" type="primary" plain @click="downLoad" style="position:relative;left:0px;top:-6px;position:absolute;left: 270px;top:-6px;">下载模板</el-button>
        <el-button style="margin:8px 0;width:40%;position:relative;top:-0px;left:29%" :disabled=" fileList.length>0?false:true" :loading="buttonLoading.upload" size="mini" type="primary" plain @click="@">确 定</el-button>
      </div> -->
    </el-dialog>
    <!-- 导入关键词弹窗 -->

    <el-dialog class="customDialog" :close-on-click-modal="false" title="下载/导入关键词模板" :visible.sync="uploadTaskShow2" style="padding-right:100px;" width="500px">
      <ImportFile @success="handleSuccess" filename="关键词模板" :data="downloadData" :downloadApi="downloadApi" :action="action" />
      <!-- <div style="position:relative;">
        <div style="position:relative;left:100px;width: 300px;top:-6px;">
          <el-upload style="margin-top:8px;" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange2" :file-list="fileList2" :on-remove="handleFileRemove2" :auto-upload="false">
            <el-button size="mini" type="primary" disabled plain>导入数据</el-button>
          </el-upload>
        </div>
        <el-button size="mini" type="primary" plain @click="downLoad2" style="position:relative;left:0px;top:-6px;position:absolute;left: 270px;top:-6px;">下载模板</el-button>
        <el-button style="margin:8px 0;width:40%;position:relative;top:-0px;left:29%" :disabled=" fileList.length>0?false:true" :loading="buttonLoading.upload2" size="mini" type="primary" plain @click="upload2">确 定</el-button>
      </div> -->
    </el-dialog>
    <!-- 图表 -->
    <el-dialog :close-on-click-modal="false" :title="chartData.title" :visible.sync="pcMonitoringData" height='505px' width="950px" @close="closeDialog">
      <chartShow :chartData.sync="chartData" ref="child"></chartShow>
    </el-dialog>
  </div>
</template>
<script>
import { CONST_PORT_CONFIG, host } from "Config";
import TplDrawer from "../Common/tpl-drawer/index";
import YTemplate from "../Common/y-template/index";
import chartShow from "./echart";
class newItem {
  constructor() {
    (this.parentAsin = ""), //优化父ASIN
      (this.maxAdvertClickRates = ""), //最高点击率
      (this.refParentAsin = ""), //参考父ASIN
      (this.prefix = ""); //前缀:用于生成广告系列名称、组名称
  }
}
class newItem1 {
  constructor() {
    (this.stageNo = ""), //阶段编号
      (this.stageAdvertOrders = ""), //阶段广告订单量
      (this.stageAdvertHits = ""), //阶段广告点击量
      (this.stageAdvertCostRate = ""); //阶段广告花费占比
  }
}
export default {
  components: {
    TplDrawer,
    YTemplate,
    chartShow
  },
  computed: {
    downloadData() {
      return this.storeIds
    },
  },
  provide() {
    return {
      getList: this.getList,
      showEchart__: this.showEchart__
    };
  },
  data() {
    return {
      downloadApi: 'categoryKeywordDownloadFile',
      action: `${host}taskAdSeo/saveAdSeoKeywordRpt`,
      downloadApi1: 'adSeoImportDataExportTemplate',
      action1: `${host}adSeoImportData/importData`,
      messageLoading: false,
      titile: "",
      // 画图需要的数据 四
      pcMonitoringData: false,
      chartData: {
        title: "",
        taskId: "",
        type: "",
        monitorFrom: "",
        monitorTo: "",
        itemType: ""
      },
      changeSwitchLoading: false,
      uploadTaskShow: false,
      uploadTaskShow2: false,
      fileList: [],
      fileList2: [],
      buttonLoading: {
        upload: false,
        upload2: false
      },
      status: 1,
      dialogVisible: false,
      submitLoading: false,
      elIconMenuShow: false,
      filterText: null,
      treeKey: 1,
      treeLoading: false,
      customCategoryData: [],
      defaultProps: {
        children: "taskAsinVOs",
        label: "cusCateName"
      },
      form: {
        adSeos: [new newItem()],
        taskAdSeoStages: [new newItem1()]
      },
      rules: {
        parentAsin: [
          {
            required: true,
            message: "请输入ASIN",
            trigger: ["blur", "change"]
          }
        ],
        maxAdvertClickRates: [
          {
            required: true,
            message: "请输入最高点击率",
            trigger: ["blur", "change"]
          }
        ],
        refParentAsin: [
          {
            required: true,
            message: "请输入参考父ASIN",
            trigger: ["blur", "change"]
          }
        ],
        prefix: [
          {
            required: true,
            message: "请输入前缀",
            trigger: ["blur", "change"]
          }
        ],
        stageAdvertOrders: [
          {
            required: true,
            message: "请输入订单量",
            trigger: ["blur", "change"]
          }
        ],
        stageAdvertHits: [
          {
            required: true,
            message: "请输入点击量",
            trigger: ["blur", "change"]
          }
        ],
        stageAdvertCostRate: [
          {
            required: true,
            message: "请输入花费占比",
            trigger: ["blur", "change"]
          }
        ]
      },
      detail: null,
      taskAdSeoStages: null,
      switch: false,
      taskId: null,
      // 表格
      table: {
        loading: false,
        // rowKey: "taskId",
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          campaignName: true,
          keywordText: true,
          advertExposure: true,
          advertHits: true,
          advertOrders: true,
          advertClickRates: true,
          advertCpc: true,
          advertAcos: true,
          advertSales: true,
          conversionRates: true,
          advertCost: true,
          Handle: {
            showEchart__: true
          }
        }
      },
      userSelect: []
    };
  },
  created() {
    this.initPage();
  },
  watch: {
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val);
    },
    sellerData() {
      this.initPage();
    }
  },
  methods: {
    handleSuccess1({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.uploadTaskShow = false

      }
    },
    handleSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.uploadTaskShow2 = false

      }
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate();
    },
    // 画图 五
    showEchart__(row) {
      // console.log(row);
      this.pcMonitoringData = true;
      this.chartData.title = "数据展示";
      this.chartData.taskId = row.taskId;
      this.chartData.url = "AdSeoDataEventDayList";
      this.chartData.keywordId = row.keywordId;
      this.chartData.period = 1;
      // console.log(this.$refs);
      this.$nextTick(() => {
        this.$refs.child.showChartChild();
      });
    },
    // showEchart__(row) {
    //   console.log(row);
    // },
    changeSwitch(val) {
      //   console.log(val);
      let val_ = val === true ? 1 : 0;
      this.changeSwitchLoading = true;
      let params = {
        taskId: this.taskId,
        increaseClickFlag: val_
      };
      this.$api["TaskAdSeoUpdateIncreaseClickFlag"](params)
        .then(data => {
          //   console.log(data);
          this.changeSwitchLoading = false;
          this.$api["TaskAdSeoInfo"]({ taskId: this.taskId })
            .then(data => {
              if (data.data.increaseClickFlag === 1) {
                data.data.increaseClickFlag = true;
              } else {
                data.data.increaseClickFlag = false;
              }
              this.detail = data.data;
              // console.log(this.detail, "detail");
              this.taskAdSeoStages = this.detail.taskAdSeoStages.slice(0, 2);
            })
            .catch(err => {
              console.log(err);
              this.$set(this.detail, "increaseClickFlag", !val_);
              this.changeSwitchLoading = false;
            });
        })
        .catch(err => {
          this.$set(this.detail, "increaseClickFlag", !val_);
          this.changeSwitchLoading = false;
          console.log(err);
        });
    },
    // 下载模板
    downLoad() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + "adSeoImportData/exportTemplate",
        data: "",
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "点击率模板.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 上传模板
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleFileRemove(file, fileList) {
      this.fileList = [];
    },
    // 确认上传
    upload() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      let params = new FormData();
      params.append("siteId", this.siteId);
      params.append("sellerId", this.sellerId);
      params.append("platformId", this.platformId);
      params.append("file", this.fileList[0].raw);
      this.buttonLoading.upload = true;
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$ajax
        .post(BASE_URL + "adSeoImportData/importData", params, headers)
        .then(res => {
          // console.log(res);
          this.buttonLoading.upload = false;
          let code = res.code;
          if (code == 0) {
            this.uploadTaskShow = false;
            this.$message.success(res.data.msg);
          } else if (res.code === 500) {
            this.buttonLoading.upload = false;
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.buttonLoading.upload = false;
          this.$message.error(res.msg);
        });
    },
    // 下载模板2
    downLoad2() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + "categoryKeyword/downloadFile",
        data: "",
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "关键词模板.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 上传模板
    handleFileChange2(file, fileList) {
      this.fileList2 = fileList.slice(-1);
    },
    handleFileRemove2(file, fileList) {
      this.fileList2 = [];
    },
    // 确认上传
    upload2() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      let params = new FormData();
      params.append("siteId", this.siteId);
      params.append("sellerId", this.sellerId);
      params.append("platformId", this.platformId);
      params.append("taskId", this.taskId);
      params.append("file", this.fileList2[0].raw);
      this.buttonLoading.upload2 = true;
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$ajax
        .post(BASE_URL + "/taskAdSeo/saveAdSeoKeywordRpt", params, headers)
        .then(res => {
          // console.log(res);
          this.buttonLoading.upload2 = false;
          let code = res.code;
          if (code == 0) {
            this.uploadTaskShow2 = false;
            this.$message.success(res.data.msg);
          } else if (res.code === 500) {
            this.buttonLoading.upload2 = false;
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error(res.msg);
          this.buttonLoading.upload2 = false;
        });
    },
    // 添加任务增加一项
    addItem() {
      let item = new newItem();
      this.form.adSeos.push(item);
    },
    spliceItem(index) {
      this.form.adSeos.splice(index, 1);
    },
    // 添加任务增加一项
    addItem1() {
      let item = new newItem1();
      this.form.taskAdSeoStages.push(item);
    },
    spliceItem1(index1) {
      this.form.taskAdSeoStages.splice(index1, 1);
    },
    showDialog() {
      // status 为1 是添加状态
      this.status = 1;
      this.title = "添加计划";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.form = {
          adSeos: [new newItem()],
          taskAdSeoStages: [new newItem1()]
        };
        this.$refs.ruleForm.resetFields();
      });
      this.URL = "TaskAdSeoSave";
    },
    showDialog2() {
      // 将status 设置为2 表示编辑状态
      this.status = 2;
      this.title = "编辑计划";
      let arr = this.$refs.treeCustomCategory.getCheckedKeys();
      let newArr = arr.filter(item => item);
      if (!newArr.length) {
        this.$message.warning("未选中sku");
        return;
      } else if (newArr.length > 1) {
        this.$message.warning("编辑只能选中一个sku");
        return;
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.form = {
          adSeos: [new newItem()],
          taskAdSeoStages: [new newItem1()]
        };
        this.$refs.ruleForm.resetFields();
      });
      this.URL = "TaskAdSeoUpdate";
      this.getDetails(newArr[0]);
    },
    // 列表
    getList(arg) {
      let params = {
        taskId: this.taskId,
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        // startTime: this.$route.query.startTime,
        // endTime: this.$route.query.endTime,
        // skus: this.$store.state.common.childSkus,
        // flag: flag,
        // problemTypes: problemTypes,
        ...arg
      };
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["AdSeoKeywordRptList"](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          this.table.pageNumber = data.pageNo;
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          console.log(err);
          this.table.loading = false;
          return true;
        });
    },
    // 获取编辑信息
    getDetails(taskId) {
      let params = {
        taskId: taskId
      };
      this.$api["TaskAdSeoInfo"](params)
        .then(data => {
          //   console.log(data, "data");
          let adSeos = [
            {
              parentAsin: data.data.parentAsin,
              maxAdvertClickRates: data.data.maxAdvertClickRates,
              refParentAsin: data.data.refParentAsin,
              prefix: data.data.prefix
            }
          ];
          let taskAdSeoStages = [];
          data.data.taskAdSeoStages.forEach((el, index) => {
            taskAdSeoStages.push({
              stageAdvertOrders: el.stageAdvertOrders,
              stageAdvertHits: el.stageAdvertHits,
              stageAdvertCostRate: Number(el.stageAdvertCostRate * 100).toFixed(
                2
              )
            });
          });
          //   console.log(adSeos, "adSeos");
          //   console.log(taskAdSeoStages, "taskAdSeoStages");
          this.form = {
            adSeos: adSeos,
            taskAdSeoStages: taskAdSeoStages
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.form.taskAdSeoStages.forEach((el, index) => {
            el.stageNo = index + 1;
          });
          this.submitLoading = true;
          let params = {
            siteId: this.siteId,
            sellerId: this.sellerId,
            platformId: this.platformId,
            ...this.form
          };
          let data_ = JSON.parse(JSON.stringify(params.taskAdSeoStages));
          data_.forEach(el => {
            el.stageAdvertCostRate = +el.stageAdvertCostRate / 100;
          });
          params.taskAdSeoStages = data_;
          this.$api[this.URL](params)
            .then(data => {
              this.submitLoading = false;
              this.dialogVisible = false;
              this.getCustomCategory();
            })
            .catch(err => {
              this.submitLoading = false;
              console.log(err);
            });
        }
      });
    },
    showAll() {
      if (!this.switch) {
        this.taskAdSeoStages = this.detail.taskAdSeoStages;
        this.switch = !this.switch;
      } else {
        this.taskAdSeoStages = this.detail.taskAdSeoStages.slice(0, 2);
        this.switch = !this.switch;
      }
    },
    handleNodeClick(data) {
      //   console.log(data.taskId);
      this.taskId = data.taskId;
      let taskId = data.taskId;
      if (taskId) {
        this.messageLoading = true;
        this.$api["TaskAdSeoInfo"]({ taskId: taskId })
          .then(data => {
            if (data.data.increaseClickFlag === 1) {
              data.data.increaseClickFlag = true;
            } else {
              data.data.increaseClickFlag = false;
            }
            this.detail = data.data;
            this.taskAdSeoStages = this.detail.taskAdSeoStages.slice(0, 2);
            this.messageLoading = false;
          })
          .catch(err => {
            this.messageLoading = false;
            console.log(err);
          });
        this.getList({ taskId: taskId });
      }
    },
    sideDelete() {
      //   console.log(this.$refs.treeCustomCategory.getCheckedKeys());
      let arr = this.$refs.treeCustomCategory.getCheckedKeys();
      if (!arr.length) {
        this.$message.warning("未选中sku");
        return;
      }
      let newArr = arr.filter(item => item);
      this.$confirm("确定删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api["TaskAdSeoRemove"]({ taskIds: newArr }).then(res => {
            // 重新请求列表
            this.getCustomCategory();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      //   console.log(newArr);
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.getCustomCategory();
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
      this.$api["listByCategoryAdSeo"]({
        sellerId: this.sellerId,
        platformId: this.platformId,
        siteId: this.siteId
      })
        .then(res => {
          let data = res.data;
          console.log(data, "data");
          let code = res.code;
          if (data) {
            data.forEach((el, index) => {
              el.taskAsinVOs.forEach((i, j) => {
                i.cusCateName = i.parentAsin;
              });
            });
          }
          this.customCategoryData = data;
        })
        .catch(err => {
          this.customCategoryData = [];
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.cusCateName.indexOf(value) !== -1;
    },
    showRelateDialog() {
      this.getCustomCategory();
      this.outerVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.el-icon-box {
  display: flex;
  justify-content: flex-end;
  font-size: 16px !important;
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
    justify-content: space-around;
  }
}
.inner-visible-dialog {
  .body-box {
    padding: 10px;
    border: 1px solid @borderColor;
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
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
.dialog-footer {
  text-align: center;
}
.esc_desc {
  padding: 0px 7px;
}
.header {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  background: #faf7f5;
  padding: 0 10px;
}
.p-container {
  position: relative;
  padding: 10px 0px;
  width: 200px;
  display: inline-block;
  .picture {
    width: 240px;
    height: 240px;
    overflow: hidden;
    background-color: #fff;

    img {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    img[lazy="loaded"] {
      background: #fff;
    }
  }
}
.pd-container {
  width: 700px;
  display: inline-block;
  vertical-align: top;
  padding: 10px 0px;
  margin-top: 20px;
  margin-left: 50px;
  font-size: 14px;
  .s {
    margin-right: 40px;
  }
}
</style>

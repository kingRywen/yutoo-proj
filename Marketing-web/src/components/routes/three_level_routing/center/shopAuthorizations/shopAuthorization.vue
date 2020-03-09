<template>
  <!-- 店铺授权 -->

  <div class='shopAuthorization'>
    <section class="parentPosition">
      <el-dialog :close-on-click-modal="false" title="提示" :visible.sync="dialogFormVisible" width="600px">
        <span>这是一段信息</span>
      </el-dialog>
      <!-- 添加数据监控弹窗 -->
      <el-dialog :close-on-click-modal="false" :title="editData ? '修改数据监控':'添加数据监控'" :visible.sync="addDialogDataVisible" width="600px">
        <el-form :model="addDataObj" style="width: 450px;margin:0 auto">
          <el-form-item label="选择监控周期" label-width="90px">
            <el-date-picker unlink-panels :picker-options="pickerOptions" v-model="addDataObj.addDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="选择站点" label-width="90px">
            <el-checkbox-group v-model="addDataObj.searchSites" class="searchSitesStyle">
              <el-checkbox v-for="item in siteList" :label="item.siteId">{{item.siteName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <div style="text-align:center">
              <el-button type="primary" @click="addDataOk">确认</el-button>
              <el-button type="primary" @click="addDialogDataVisible = false">取消</el-button>
            </div>

          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 添加监控弹窗 -->
      <CommonDialog :modal-obj="addMonitorObj">
        <el-form :model="addMonitorModel" class="__myform" label-position="top" ref="addMonito">
          <el-form-item label="选择站点" prop="searchSites" :rules="[{required: true, message: '请选择站点', trigger:'change'}]">
            <el-checkbox-group v-model="addMonitorModel.searchSites" class="searchSitesStyle" style="width:100%">
              <el-checkbox v-for="item in siteList" :label="item.siteId">{{item.siteName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="选择监控周期" prop="time" :rules="[{required: true, message: '请选择监控周期', trigger:['change', 'blur']}]">
            <el-date-picker unlink-panels style="width:100%" :picker-options="pickerOptions" v-model="addMonitorModel.time" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>

          </el-form-item>
          <!-- <el-form-item label="选择监控周期" v-if="addMonitorModel.searchSites.length">
            <div class="__box">
              <el-form-item :prop="`time.${siteId}`" :rules="[{required: true, message: '请选择监控周期'}]" :label="siteList.find(el => el.siteId === siteId).siteName" v-for="(siteId, index) in addMonitorModel.searchSites">
                <el-date-picker  unlink-panels style="width:100%" :picker-options="pickerOptions" v-model="addMonitorModel.time[siteId]" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </div>

          </el-form-item> -->

          <el-form-item style="text-align:center">
            <el-button type="primary" @click="addSalesMonitor" :loading="buttonLoading.addmonitor">确认添加</el-button>
          </el-form-item>
        </el-form>
      </CommonDialog>

      <!-- 修改监控周期弹窗 -->
      <!-- <el-dialog :close-on-click-modal="false" title="修改差评监控" :visible.sync="changeDialogMonitorVisible" width="600px">
        <div class='dialogContent' style="overflow:hidden;">
          <div style="margin-top:15px;">
            <div class="block" style='margin-top:15px;display:flex;justify-content:center'>
              <el-date-picker  unlink-panels :picker-options="pickerOptions" v-model="dialogDate.changeMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div style="margin-top:15px;">
            <div class="block" style='margin-top:15px;display:flex;justify-content:center'>

              <el-checkbox-group v-model="dialogDate.searchSites" class="searchSitesStyle">
                <el-checkbox v-for="item in siteList" :label="item.siteId">{{item.siteName}}</el-checkbox>
              </el-checkbox-group>

            </div>
          </div>
          <div class='saveContainer' style='text-align:center;margin-top:40px;'>
            <el-button :loading="buttonLoading.changemonitor" type="primary" size="large" style='width:50%' @click="changeSalesMonitor">确 认</el-button>
          </div>
        </div>
      </el-dialog> -->
      <el-tabs v-model="activeName" type="border-card" v-if="areaList.length">
        <el-tab-pane v-for="item in areaList" :name="item.areaName" :label="item.areaName">
          <el-row :gutter="24" type='flex' justify="space-between">
            <el-col :span="24" class="__fixed_form">
              <el-form :inline="true">
                <el-button type="success" @click="onaddTask('添加授权')">添加授权</el-button>
                <!-- todoh -->
                <el-button type="success" @click="showAddmonitorDialog">添加差评监控</el-button>
                <el-button type="success" @click="addDataMonitor">添加数据监控</el-button>

                <el-button type="success" plain @click="showChangemonitorDialog">修改差评监控</el-button>
                <el-button type="success" plain @click="editDataMonitor">修改数据监控</el-button>
                <!-- 取消监控 -->
                <el-button type="success" plain @click="cancelSalesMonitor">取消差评监控</el-button>

                <el-button type="success" plain @click="cancelDataMonitor">取消数据监控</el-button>
                <el-button type="success" style="margin-left:0" plain @click="deleteMonitorList">删除</el-button>
              </el-form>
            </el-col>
          </el-row>
          <el-row :gutter="24" type='flex' justify="space-between" style="margin-top:10px;">
            <el-col :span="24" class="__fixed_form">
              <el-form :inline="true">
                <!-- <el-form-item label="站点">
              <el-select :popper-append-to-body="false"v-model="shopAuthorization.siteId" clearable style='max-width:120px'>
                <el-option v-for="(item,index) in siteData" :key="index" :label="item.siteName" :value="item.siteId">
                </el-option>
              </el-select>
            </el-form-item> -->
                <el-form-item label="店铺名称">
                  <el-input placeholder="请输入店铺名称" v-model.trim="shopAuthorization.sellerAlias" clearable style='max-width:150px'>
                  </el-input>
                </el-form-item>
                <el-form-item label="卖家编号">
                  <el-input placeholder="请输入卖家编号" v-model.trim="shopAuthorization.sellerId" clearable style='max-width:150px'>
                  </el-input>
                </el-form-item>
                <el-form-item label="差评监控状态">
                  <el-select :popper-append-to-body="false" v-model="shopAuthorization.monitorFlag" placeholder="选择状态" style='width:120px;' clearable>
                    <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数据监控状态">
                  <el-select :popper-append-to-body="false" v-model="shopAuthorization.salesMonitorFlag" placeholder="选择状态" style='width:120px;' clearable>
                    <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="onSearch">搜索</el-button> -->
                  <el-button type="success" icon="el-icon-search" @click="onSearch">搜索</el-button>
                  <el-button :disabled="isDisabled" type="success" icon="el-icon-search" @click="reSearch">清空</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>

          <!-- 表格数据 -->
          <el-table :max-height="12000" v-loading="loading" stripe ref="multipleTable" :data="shopAuthorizationLists" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>

            <el-table-column prop="sellerAlias" label="店铺名称" align='center'>
            </el-table-column>
            <el-table-column prop="sellerId" label="卖家编号" align='center'>
            </el-table-column>
            <el-table-column prop="authTime" label="授权时间" align='center'>
            </el-table-column>
            <el-table-column label="差评监控状态" align='center'>
              <template slot-scope="scope">
                <span>
                  {{scope.row.monitorFlag ? '开启': '关闭'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="差评监控起止时间" align='center'>
              <template slot-scope="scope">
                <span>
                  {{ scope.row.monitorFrom?scope.row.monitorFrom.slice(0,10)+"~"+scope.row.monitorTo.slice(0,10):"-" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="数据监控状态" align='center'>
              <template slot-scope="scope">
                <span>
                  {{scope.row.salesMonitorFlag ? '开启': '关闭'}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="数据监控起止时间" align='center'>
              <template slot-scope="scope">
                <span v-if="scope.row.salesMonitorFrom">
                  {{ scope.row.salesMonitorFrom?scope.row.salesMonitorFrom.slice(0,10)+"~"+scope.row.salesMonitorTo.slice(0,10):"-" }}
                </span>
                <span v-else>
                  {{ scope.row.salesMonitorFrom?scope.row.salesMonitorFrom.slice(0,10)+"~"+scope.row.salesMonitorTo.slice(0,10):"-" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align='center' style="width:350px;" class="deleteStyle">
              <template slot-scope="scope">
                <el-button type="text" @click="onaddTask( '编辑',scope.row.sellerAuthId)">编辑</el-button>
                <el-button type="text" @click="deleteShopLists(scope.row.sellerAuthId)">删除</el-button>
                <!-- <el-button type="text" v-if="!scope.row.reviewMonitorFlag" @click="OpenMonitoring(scope.row.sellerAuthId)"> 开启差评监控 </el-button>
            <el-button type="text" v-else @click="CloseMonitoring(scope.row.sellerAuthId)"> 关闭差评监控 </el-button> -->

              </template>

            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block" style='margin-top:20px;'>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>
    <!-- 添加授权弹窗 -->
    <el-dialog :close-on-click-modal="false" :title="title" :visible.sync="addShopTask" width="600px">
      <span class="el-dialog__title" slot="title">
        {{title}}
        <el-button type="text" @click="authObj.show= true">(查看授权教程)</el-button>
      </span>
      <el-form :rules="rules" :model="form" ref="ruleForm" style="width:80%;margin: 0 auto; " class="boxs">
        <!-- <el-form-item prop="siteId" class="_select">
          <div class="first">
            <div class=" smallStarBox smallStar">*</div>
            <div class="textLeft">国家站点 </div>
          </div>
          <el-select :popper-append-to-body="false"class="last" v-model="form.siteId">
            <el-option v-for="(item,index) in siteData" :key="index" :label="item.siteName" :value="item.siteId">
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item prop="sellerAlias">
          <div class=" smallStarBox smallStar">*</div>
          <el-input placeholder="请输入内容" v-model="form.sellerAlias">
            <template slot="prepend" style=" width:80px;">店铺名称</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="sellerId">
          <div class=" smallStarBox smallStar">*</div>
          <el-input placeholder="请输入内容" v-model="form.sellerId">
            <template slot="prepend" style=" width:80px;">卖家编号</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="authToken">
          <div class=" smallStarBox smallStar">*</div>
          <el-input placeholder="请输入内容" v-model="form.authToken">
            <template slot="prepend" style=" width:80px;">MWS授权令牌</template>
          </el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
        <el-button type="primary" style="width:100%;" :loading="loadingBtn" @click="addAuthorizationSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 授权 -->
    <CommonDialog :modal-obj="authObj">
      <div class="accreditWarp">
        <el-collapse accordion v-model="activeName1" style="width:99%">
          <el-collapse-item title="Step 1 : 选择商城" name="1" class="collapse1">
            <p>请遵照下列的步骤来连接MWS，以便使用我们的服务，</p>
            <p>注意：
              <span class="red">只有专业卖家 ( Pro Merchant )可以使用MWS的服务! 如果该账号已经授权了某一个账号，不要再授权另一账号,防止引起关联或数据错乱。</span>
            </p>
            <p>1.选择的商城是：
              <el-select :popper-append-to-body="false" v-model="accreditObj.name" disabled size="mini">
                <el-option :label="accreditObj.name" :value="accreditObj.name"></el-option>
              </el-select>
            </p>
            <p>2.点击下列连结并且登入login</p>
            <a target='_blank' href="https://sellercentral.amazon.com/gp/mws/registration/register.html?signInPageDisplayed=1&devAuth=1">https://sellercentral.amazon.com/gp/mws/registration/register.html</a>
          </el-collapse-item>
          <el-collapse-item title="Step 2 : MWS Access" name="2" class="collapse2">
            <p>1.选择 ' 我希望使用某个应用程序通过 MWS 访问我的亚马逊卖家账户 '.</p>
            <p>2.输入下列资讯</p>
            <ul class="hiti">
              <li>
                应用程序名称：
                <span class="red blod">{{info.applicationName}}</span>
              </li>
              <li>
                应用程序开发商账号：
                <span class="red blod">{{info.developerId}}</span>
              </li>
              <li>
                应用程序版本：
                <span class="red blod">{{info.applicationVersion}}</span>
              </li>
            </ul>
            <p>3.点击 下一页</p>
            <p>4.接受许可协议，然后点击 下一页</p>
            <div class="">
              <img src="./yamx.png" width="784" height="543" alt="">
            </div>
          </el-collapse-item>
          <el-collapse-item title="Step 3: 复制 Seller ID" name="3">
            <div class="">
              <img src="./yamxzh.png" width="808" height="577" alt="">
            </div>
          </el-collapse-item>
          <el-collapse-item title="Step 4: 输入 Seller ID" name="4">
            <!-- <h6 class="blod">{{accreditObj.name}}</h6> -->
            <img src="./yamx3.png" alt="">
          </el-collapse-item>
        </el-collapse>
      </div>
    </CommonDialog>
  </div>

</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import CommonDialog from "@/components/common/commonDialog";
import { isDisabled } from "@/api/functions";
import axios from "axios";
export default {
  components: {
    CommonDialog
  },
  data() {
    // 时间选择器
    return {
      addDataObj: {
        addDateValue: [],
        searchSites: []
      },
      editMonitor: false,
      addDialogDataVisible: false,
      activeName1: "1",
      accreditObj: {
        name: "Amazon"
      },
      accreditForm: {},
      addMonitorObj: {
        show: false,
        title: "添加差评监控"
      },
      addMonitorModel: {
        searchSites: [],
        // time: {}
        time: ""
      },
      accreditFormRules: {},
      authObj: {
        show: false,
        title: "授权教程",
        width: "1100px"
      },
      authModel: {},
      activeName: "北美站",
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      // 弹窗todod
      // 添加监控
      addDialogMonitorVisible: false,
      // 时间框
      dialogDate: {
        addMonitorDateValue: "",
        changeMonitorDateValue: "",
        addDateValue: [],
        searchSites: []
      },
      // 确认按钮loading
      buttonLoading: {
        addmonitor: false,
        changemonitor: false
      },
      // 修改监控周期todod
      changeDialogMonitorVisible: false,
      loadingBtn: false,
      loading: true,
      editData: false,
      title: null,
      // 校验
      rules: {
        // siteId: [
        //   {
        //     required: true,
        //     message: "请选择国家站点",
        //     trigger: "change"
        //   }
        // ],
        sellerAlias: [
          {
            required: true,
            message: "请输入店铺名称",
            trigger: "blur"
          }
        ],
        authToken: [
          {
            required: true,
            message: "请输入MWS授权令牌",
            trigger: "blur"
          }
        ],
        secretKey: [
          {
            required: true,
            message: "请输入密钥",
            trigger: "blur"
          }
        ],
        sellerId: [
          {
            required: true,
            message: "卖家编号",
            trigger: "blur"
          }
        ]
      },
      surplusAmount: null, //剩余点数
      charge: null, //点数
      monitorTimeAry: [], //时间选择器
      tabPosition: 30,
      currentPage: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      shopAuthorizationLists: [], //接收请求的数据
      //添加授权站点定义
      // addAuthorizationData: {
      //   options: "",
      //   value: ""
      // },

      form: {
        siteId: "",
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        sellerAlias: "",
        authToken: "",
        secretKey: "",
        sellerId: "",
        sellerAuthId: null
      },
      //添加授权提交  定义表单数据
      // shopAuthorizationForm: {
      //   platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0],
      // siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
      //   ","
      // )[1],
      //   sellerAlias: "",
      //   authToken: "",
      //   secretKey: "",
      //   sellerId: ""
      // },
      // 定义站点
      siteData: [],
      // userSelectsite: "",
      // 定义图片类目名称列表
      // props: {
      //   value: "siteId",
      //   // children: "recursionList",
      //   label: "siteName"
      // },
      StatusValue: "",
      addShopTask: false, //添加店铺授权弹窗
      formLabelWidth: "120px",
      nationalSite: "", //国家站点
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      value1: "",
      value2: "",
      // checkList: ["选中且禁用", "复选框 A"],
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 关键词
      inputText: "",
      originValue: "",
      // 差评监控状态
      StatusOptions: [
        {
          value: 1,
          label: "开启"
        },
        {
          value: 0,
          label: "关闭"
        }
      ],
      // 搜索 店铺授权
      shopAuthorization: {},
      isDisabled: true,
      addSiteDataLists: {
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        sellerAlias: "",
        sellerId: ""
      },

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1,

      userSelect: [], //定义选中事件
      taskIds: [], //定义删除授权列表ID
      areaList: [],
      siteList: [],
      info: {}
    };
  },
  created() {
    this.params = {
      platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
        ","
      )[0],
      pageNumber: 1,
      pageSize: 10
    };
    this.getCategorList(); //请求站点
    this.getPointeApi(); //请求扣点

    this.getList(); //获取区域列表
    this.getInfo();
    // this.getShopAuthorizationApi(this.params); //初始化请求列表
  },
  computed: {
    ...mapState("shopAuthorization", {
      // shopAuthorizationLists: state => state.shopAuthorizationLists, //n拿到的值
      siteListsData: state => state.getSiteLists //站点数据
    }),
    ...mapState("selectPlatform", {
      platformId: state => state.platformId
    }),
    ...mapGetters("common", ["platformId"])
  },
  watch: {
    // platformId(val) {
    //   this.getShopAuthorizationApi({ ...this.params, platformId: val });
    // },
    shopAuthorization: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        if (this.isDisabled === true) {
          this.getShopAuthorizationApi();
        }
        //要干的事情
      },
      deep: true
    }
  },
  methods: {
    // getSiteList() {
    //   /area/siteList
    // },
    getList() {
      this.getAreaList().then(res => {
        this.$.handlerCode(res, () => {
          this.areaList = res.data.data;
          this.getShopAuthorizationApi(this.params);
        });
      });
    },
    // 获取授权
    getInfo() {
      return this.$axios.post("/globalApi/info", {}).then(res => {
        this.$.handlerCode(res, () => {
          this.info = res.data.data;
        });
      });
    },
    //获取区域列表
    getAreaList() {
      return this.$axios.post("/area/list", {
        platformId: this.platformId
      });
    },
    getSiteList() {
      if (this.siteList.length) {
        return this.siteList;
      }
      this.$axios
        .post("/area/siteList", {
          areaId: +this.activeName1,
          platformId: this.platformId
        })
        .then(res => {
          this.$.handlerCode(res, () => {
            this.siteList = res.data.data;
          });
        });
    },
    // 添加监控
    //点击添加监控todom
    showAddmonitorDialog() {
      if (this.userSelect.length) {
        this.getSiteList();
        // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = true;
        for (let i = 0; i < this.userSelect.length; i++) {
          if (this.userSelect[i].monitorFlag == 0) {
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

          this.addMonitorObj.show = false;
          return;
        }
        this.addMonitorObj.title = "添加差评监控";
        //
        this.buttonLoading.addmonitor = false;
        this.addMonitorObj.show = true;
        // 清除表单内容;
        this.$nextTick(() => {
          this.$refs.addMonito.resetFields();
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    addSalesMonitor() {
      this.$refs.addMonito.validate(valid => {
        if (valid) {
          if (this.userSelect.length) {
            let addMonitorArr = [];
            this.userSelect.forEach(item => {
              addMonitorArr.push(item.sellerAuthId);
            });
            this.buttonLoading.addmonitor = true;
            let params = {
              sellerAuthIds: addMonitorArr,
              platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[0],
              siteIds: this.addMonitorModel.searchSites,
              monitorFrom: this.addMonitorModel.time[0],
              monitorTo: this.addMonitorModel.time[1]
            };
            this.$axios
              .post(
                this.addMonitorObj.title === "添加差评监控"
                  ? "/SellerAuth/turnOnMonitor"
                  : "/SellerAuth/updateMonitor",
                params
              )
              .then(res => {
                this.buttonLoading.addmonitor = false;
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.reloadPointApi();
                  this.getShopAuthorizationApi();
                  this.addMonitorObj.show = false;
                  return;
                }
                if (res.data.code == 500) {
                  this.$message.error(res.data.msg);
                }
              });
          } else {
            this.$message({
              showClose: true,
              message: "至少需要选中一个",
              type: "warning"
            });
          }
        }
      });
    },
    // 修改监控周期
    //点击修改监控周期
    showChangemonitorDialog() {
      if (this.userSelect.length === 0) {
        this.$message.warning("至少需要选中一个");
        return;
      }
      if (this.userSelect.every(el => !el.monitorFlag)) {
        this.$message.warning("选中项都未开启监控，不能修改");
        return;
      }

      this.addMonitorObj.title = "修改差评监控";

      this.getSiteList();

      this.addMonitorObj.show = true;
      this.$nextTick(() => {
        this.$refs.addMonito.resetFields();
        if (this.userSelect.length === 1) {
          this.addMonitorModel.time = [
            this.userSelect[0].monitorFrom,
            this.userSelect[0].monitorTo
          ];
        }
      });
    },
    changeSalesMonitor() {
      if (this.dialogDate.changeMonitorDateValue == "") {
        this.$message.error("请选择监控起止时间");
        return;
      }
      this.buttonLoading.changemonitor = true;
      let changeMonitorArr = [];
      this.userSelect.forEach(item => {
        changeMonitorArr.push(item.sellerAuthId);
      });
      let params = {
        sellerAuthIds: changeMonitorArr,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteIds: this.dialogDate.searchSites,
        monitorFrom: this.dialogDate.changeMonitorDateValue[0],
        monitorTo: this.dialogDate.changeMonitorDateValue[1]
      };
      this.$axios.post("/SellerAuth/updateMonitor", params).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.changeDialogMonitorVisible = false;
          this.reloadPointApi();
          this.getShopAuthorizationApi();
          return;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
        this.buttonLoading.changemonitor = false;
      });
    },
    //取消监控todom
    cancelSalesMonitor() {
      if (this.userSelect.length) {
        // // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = false;
        for (let i = 0; i < this.userSelect.length; i++) {
          if (this.userSelect[i].monitorFlag == 1) {
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
        this.$confirm("此操作将取消监控选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let cancelMonitor = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              cancelMonitor.push(item.sellerAuthId);
              // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              //   this.$message({
              //     showClose: true,
              //     message: "没有添加监控",
              //     type: "warning"
              //   });
              // }
              let params = {
                sellerAuthIds: cancelMonitor
              };
              this.$axios
                .post("/SellerAuth/turnOffMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getShopAuthorizationApi();
                    return;
                  }
                  if (res.data.code == 500) {
                    // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                    //   this.$message({
                    //     showClose: true,
                    //     message: "没有添加监控",
                    //     type: "warning"
                    //   });
                    // } else {
                    this.$message.error(res.data.msg);
                    // }
                  }
                });
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    //删除监控列表
    deleteMonitorList() {
      if (this.userSelect.length) {
        let deleteArr = [];
        this.userSelect.forEach(item => {
          deleteArr.push(item.sellerAuthId);
          let params = {
            sellerAuthIds: deleteArr
          };
        });
        this.$confirm("是否删除选中项?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$axios.post("/SellerAuth/remove", params).then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.pageNumber = 1;
                this.getShopAuthorizationApi();
                this.taskIds = [];
              }
              if (res.data.code == 500) {
                this.$message.error(res.data.msg);
                this.taskIds = [];
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    // 开启差评监控
    OpenMonitoring(sellerAuthId) {
      this.$confirm("是否开启差评监控", "提示", {
        type: "info"
      })
        .then(() => {
          this.$axios
            .post("/SellerAuth/turnOnMonitor", {
              sellerAuthId
            })
            .then(res => {
              this.$.handlerCode(
                res,
                () => {
                  this.getShopAuthorizationApi(this.params);
                },
                true
              );
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    addDataMonitor() {
      if (!this.userSelect.length) {
        this.$message.warning("请选择需要操作的店铺");
        return;
      }
      if (this.userSelect.every(el => el.salesMonitorFlag)) {
        this.$message.warning("选中项都处于监控，不能重复添加");
        return;
      }
      this.editData = false;
      this.addDialogDataVisible = true;
      this.addDataObj = {
        addDateValue: [],
        searchSites: []
      };
      this.getSiteList();
    },
    addDataOk() {
      let url;
      if (this.editData) {
        url = "/SellerAuth/updateSalesMonitor";
      } else {
        url = "/SellerAuth/turnOnSalesMonitor";
      }
      this.$axios
        .post(url, {
          sellerAuthIds: this.userSelect.map(el => el.sellerAuthId),
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[0],
          siteIds: this.addDataObj.searchSites,
          monitorFrom: this.addDataObj.addDateValue[0],
          monitorTo: this.addDataObj.addDateValue[1]
        })
        .then(res => {
          this.addDialogDataVisible = false;
          this.$.handlerCode(
            res,
            () => {
              this.getShopAuthorizationApi(this.params);
            },
            true
          );
        });
    },
    editDataMonitor() {
      if (!this.userSelect.length) {
        this.$message.warning("请选择需要操作的店铺");
        return;
      }

      if (this.userSelect.every(el => !el.salesMonitorFlag)) {
        this.$message.warning("选中项都未开启监控，不能修改");
        return;
      }

      this.editData = true;

      this.addDialogDataVisible = true;
      this.addDataObj = {
        addDateValue: [],
        searchSites: []
      };
      if (this.userSelect.length === 1) {
        const list = this.userSelect[0];
        this.addDataObj = {
          addDateValue: [list.salesMonitorFrom, list.salesMonitorTo],
          searchSites: []
        };
      }
      this.getSiteList();
    },
    cancelDataMonitor() {
      if (!this.userSelect.length) {
        this.$message.warning("请选择需要操作的店铺");
        return;
      }
      if (this.userSelect.every(el => !el.salesMonitorFlag)) {
        this.$message.warning("没有监控的店铺需要关闭");
        return;
      }
      this.$confirm("此操作将取消监控选中项?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        const sellerAuthIds = this.userSelect.map(el => el.sellerAuthId);
        this.$axios
          .post("/SellerAuth/turnOffSalesMonitor", {
            sellerAuthIds
          })
          .then(res => {
            this.$.handlerCode(
              res,
              () => {
                this.getShopAuthorizationApi(this.params);
              },
              true
            );
          });
      });
    },
    // 开启差评监控
    CloseMonitoring(sellerAuthId) {
      this.$confirm("是否关闭差评监控").then(res => {
        this.$axios
          .post("/SellerAuth/turnOffMonitor", {
            sellerAuthId
          })
          .then(res => {
            this.$.handlerCode(
              res,
              () => {
                this.getShopAuthorizationApi(this.params);
              },
              true
            );
          })
          .catch(res => {});
      });
    },
    // 请求扣点  接口需要改！！！！！！！！！！！
    getPointeApi() {
      this.$axios.post("/FunctionMkt/keywordRank/list").then(res => {
        if (res.data.code == 0) {
          this.surplusAmount = res.data.data.surplusAmount;
          this.charge = res.data.data.charge;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
      });
    },
    // newLists1() {
    //   this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    // },
    // newLists2() {
    //   this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    // },
    // newLists3() {
    //   this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    // },
    // newLists4() {
    //   this.getShopAuthorizationApi(this.param); //关键词竞争分析列表
    // },
    //请求列表todom
    getShopAuthorizationApi(param = {}) {
      // params = this.$.dealObjectValue(params);
      const { pageSize, currentPage } = this;
      // let startTime = this.searchListData.monitorTimeAry
      //   ? this.searchListData.monitorTimeAry[0]
      //   : "";
      // let endTime = this.searchListData.monitorTimeAry
      //   ? this.searchListData.monitorTimeAry[1]
      //   : "";
      const areaId = this.areaList.find(el => el.areaName === this.activeName)
        .areaId;
      const params = this.$.dealObjectValue({
        pageSize,
        areaId,
        pageNumber: currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        ...this.shopAuthorization,
        // startTime,
        // endTime,
        ...param
      });
      // console.log(params);
      this.loading = true;
      this.$axios.post("/SellerAuth/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.loading = false;
          return;
        }
        if (res.data.rows.length) {
          this.loading = false;
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.shopAuthorizationLists = res.data.rows;
        }
        if (!res.data.rows.length) {
          this.loading = false;
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.shopAuthorizationLists = res.data.rows;
        }
      });
    },
    // 分页 改变条数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.getShopAuthorizationApi(params);
    },
    // 改变页数
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.getShopAuthorizationApi(params);
    },
    //获取多少天以前的时间
    getBeforeTime(n) {
      var n = n;
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      return (
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //计算本月有多少天
    getCountDays() {
      var curDate = new Date();
      var curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      return curDate.getDate();
    },
    currentTimeData() {
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      let dateObj = new Date();
      let _end = `${dateObj.getFullYear()}-${dateObj.getMonth() +
        1}-${dateObj.getDate()}`;
      let _start = null;
      switch (params.createTime) {
        case 7:
          _start = this.getBeforeTime(7);
          break;
        case 30:
          _start = this.getBeforeTime(30);
          break;
        default:
          _start = _end;
      }
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();
      // console.log(params);
      return this.getShopAuthorizationApi(
        (params = {
          startTime: this.monitorTimeAry[0],
          endTime: this.monitorTimeAry[1],
          pageSize: this.pageSize,
          pageNumber: this.currentPage,
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[0]
        })
      );
    },
    // 自由改变时间搜索
    newTime() {
      this.tabPosition = null;
      let params = {
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      };
      return this.getShopAuthorizationApi(params);
    },
    // 获取站点方法
    getCategorList() {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.$axios.post("/TaskSiteShare/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        this.siteData = res.data;
      });
    },
    onaddTask(title, sellerAuthId) {
      this.title = title;
      this.addShopTask = true;
      if (title == "添加授权") {
        // 清除表单内容;
        this.$nextTick(() => {
          this.$refs.ruleForm.resetFields();
        });
      }
      if (title == "编辑") {
        let params = {
          sellerAuthId: sellerAuthId
        };
        this.$axios.post("/SellerAuth/info", params).then(res => {
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);
          }
          this.form.siteId = res.data.data.siteId;
          this.form.sellerAlias = res.data.data.sellerAlias.trim();
          this.form.authToken = res.data.data.authToken;
          this.form.secretKey = res.data.data.secretKey;
          this.form.sellerId = res.data.data.sellerId.trim();
        });
        this.form.sellerAuthId = sellerAuthId;
        this.title = title;
      }
    },
    //  添加授权提交
    addAuthorizationSubmit(formName, title) {
      // console.log(this.title);
      this.loadingBtn = true;
      if (this.title == "添加授权") {
        // console.log(title);
        this.$refs[formName].validate(valid => {
          if (valid) {
            const areaId = this.areaList.find(
              el => el.areaName === this.activeName
            ).areaId;
            let params = {
              platformId: +this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[0],
              siteId: +this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[1],
              sellerAlias: this.form.sellerAlias,
              authToken: this.form.authToken,
              secretKey: this.form.secretKey,
              sellerId: this.form.sellerId,
              areaId: areaId
            };
            this.$axios.post("/SellerAuth/save", params).then(res => {
              this.loadingBtn = false;
              if (res.data.code == 500) {
                this.$message.error(res.data.msg);
                return;
              }
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.addShopTask = false;
                this.reloadPointApi(); // 重新获取点数
                this.getShopAuthorizationApi();
                this.$refs[formName].resetFields(); //清除数据记录
              }
            });
          } else {
            return false;
          }
        });
      }

      if (this.title == "编辑") {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let params = {
              platformId: +this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[0],
              siteId: +this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[1],
              sellerAlias: this.form.sellerAlias,
              authToken: this.form.authToken,
              secretKey: this.form.secretKey,
              sellerId: this.form.sellerId,
              sellerAuthId: this.form.sellerAuthId
            };
            this.$axios.post("/SellerAuth/update", params).then(res => {
              this.loadingBtn = false;
              if (res.data.code == 500) {
                this.$message.error(res.data.msg);
                return;
              }
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
                this.addShopTask = false;
                this.reloadPointApi(); // 重新获取点数
                this.getShopAuthorizationApi();
                this.$refs[formName].resetFields(); //清除数据记录
              }
            });
          } else {
            return false;
          }
        });
      }
    },
    // 搜索
    onSearch() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getShopAuthorizationApi();
    },
    reSearch() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.shopAuthorization = {};
    },
    //搜索   店铺授权搜索
    // onShopAuthorizationSearch() {
    //   if (
    //     this.shopAuthorization.siteId ||
    //     this.shopAuthorization.sellerAlias ||
    //     this.shopAuthorization.sellerId
    //   ) {
    //     this.recordSearch(
    //       this.shopAuthorization.siteId,
    //       this.shopAuthorization.sellerAlias,
    //       this.shopAuthorization.sellerId
    //     );
    //   }
    // },
    //记录搜索值
    // recordSearch(siteId, sellerAlias, sellerId) {
    //   let params = {
    //     platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0],
    //     pageNumber: 1,
    //     pageSize: 10,
    //     siteId,
    //     sellerAlias,
    //     sellerId
    //   };
    //   // 排除空格，空字符，空数组
    //   params = { ...params, ...this.shopAuthorization };

    //   for (const key in params) {
    //     if (params.hasOwnProperty(key)) {
    //       const element = params[key];
    //       if (element === "" || element == null) delete params[key];
    //     }
    //   }
    //   this.$axios.post("/SellerAuth/list", params).then(res => {
    //     if (res.data.code == 500) {
    //       this.$message.error(res.data.msg);
    //       return;
    //     }
    //     if (res.data.rows.length) {
    //       this.currentPage = res.data.pageNo;
    //       this.total = res.data.total;
    //       this.pageSize = res.data.pageSize;
    //       this.shopAuthorizationLists = res.data.rows;
    //       return;
    //     }
    //     if (!res.data.rows.length) {
    //       this.currentPage = res.data.pageNo;
    //       this.total = res.data.total;
    //       this.pageSize = res.data.pageSize;
    //       this.shopAuthorizationLists = res.data.rows;
    //     }
    //   });
    // },
    //删除
    deleteShopLists(id) {
      // console.log(id, "666");
      this.$confirm("确定删除此条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            sellerAuthIds: [id]
          };
          this.$axios.post("SellerAuth/remove", params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.pageNumber = 1;
              this.getShopAuthorizationApi();
            } else if (res.data.code == 500) {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // table选中
    handleSelectionChange(val) {
      this.userSelect = val; //定义选中事件
      // console.log(this.userSelect);
    },
    // table删除
    deleteRow(tableData) {
      // console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
    }
  }
};
</script>

<style scoped lang="scss">
.smallStarBox {
  position: relative;
}
.smallStar {
  position: absolute;
  color: red;
  left: 5px;
  top: 2px;
  z-index: 1000;
}

/* .shopAuthorization .el-input--suffix .el-input__inner {
  width: 327px;
}
.element.style {
  width: 113px;
} */

.deleteStyle
  .el-message-box__btns
  .el-button
  .el-button--default
  .el-button--small
  .box {
  margin-left: 40px;
}
.shopAuthorization .el-input-group__prepend {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  width: 130px;
}
.timeCss {
  display: inline;
  margin-left: 30px;
  color: #00c0de;
  font-size: 14px;
}
.tableBox {
  width: 100%;
  margin-top: 10px;
}
.twoBox {
  margin: 10px 0;
}
.shopAuthorization {
  margin-top: 25px;
}
.el-dialog__title {
  line-height: 24px;
  color: #303133;
  padding-left: 20px;
}
.box {
}
.textLeft {
  border-radius: 4px 0 0 4px;
  color: #909399;
  width: 93px;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  border: 1px solid #dcdfe6;
  background: #f5f7fa;
  vertical-align: middle;
}
.box {
  min-width: 390px;
  width: 70%;
  box-sizing: border-box;
}
.textLeft {
  text-indent: 20px;
}
.el-select > .el-input {
  display: block;
  padding-left: 100px;
}

.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
/* .paddingBobbtom {
  padding-bottom: 10px;
} */
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
.interval {
  display: inline-block;
  margin-left: 50px;
}
</style>
<style lang="scss">
._select {
  .el-form-item__content {
    display: flex;
    flex: auto;
    .first {
      line-height: 38px;
      flex: 0 0 115px;
      .textLeft {
        width: 100%;
      }
    }
    .last {
      flex: auto;
      .el-input__inner {
        border-radius: 0 4px 4px 0 !important;
      }
    }
  }
}
</style>
<style lang="scss">
.shopAuthorization {
  .searchSitesStyle {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 10px;
    width: 350px;
    box-sizing: border-box;
    line-height: 40px;
    height: 42px;
  }
  .el-dialog__header {
    padding: 10px;
    .el-dialog__title {
      padding-left: 10px;
      .el-button--text {
        color: #f44336;
      }
    }
  }
}

//授权弹框
.accreditWarp {
  height: 520px;
  overflow-y: auto;
  .el-collapse-item__header {
    color: #0079c6 !important;
    font-size: 16px;
    font-weight: 700;
  }
  .el-collapse-item {
    background: #f5f5f5;
  }
  .el-form-item {
    display: flex;
    flex-direction: row;
  }
  .el-form-item__content {
    margin-left: 0 !important;
    .el-input {
      width: 400px;
    }
  }

  p {
    line-height: 30px;
    word-wrap: break-word;
  }
  .red {
    color: red;
  }
  .blod {
    font-weight: 800;
  }
  .collapse1 {
    a {
      color: #0079c6;
      margin-left: 50px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>


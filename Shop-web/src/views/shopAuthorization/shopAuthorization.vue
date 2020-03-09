<!-- 列表 -->
<template>
  <div class="___common for_shop_add_dialog">
  
    <el-tabs v-model="activeName" type="card" @tab-click="activeNameChange">
        <el-tab-pane :label="item.areaName" v-for='item in areaList' :key='item.areaId' :name="item.areaName"></el-tab-pane>
    </el-tabs>
    <!-- {{userSelect}} -->
    <!-- <el-tabs v-model="activeName" type="card" v-if="areaList.length">
      <el-tab-pane v-for="item in areaList" :name="item.areaName" :label="item.areaName">
        <template>
          <el-search :search="search" :clearSearch.sync="clearSearch"></el-search>
        </template>
        <template>
          <el-handler :userSelect="userSelect" :hander="hander" :addShow.sync="options.visible"></el-handler>
        </template>
        <template>
          <el-table-pagination :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
        </template>
      </el-tab-pane>
    </el-tabs> -->
    <!-- 添加任务 -->
    <MainLayout 
        style='margin-top:10px;'
        :outerParams="outerParams" 
        :edits="edits" 
        :searchFields="searchFields" 
        :editBtns="editBtns" 
        :columns="columns" 
        ref="layout" 
        :searchFunc='searchFunc'
         @selectChange='selectChange' 
         url="shopList">
        <!-- <div slot="left">123</div> -->
    </MainLayout>
    <!-- 添加授权 -->
    <template>
      <el-dialog-yt :options="options" :events="events">
        <span slot="other" style='position:absolute;left:100px;top:26px;'>
            <el-button type="text" @click="options_help.visible= true">(查看授权教程)</el-button>
        </span>
        <div class="box __box_wrapper" style="position:relative">
          <el-form :rules="rules" :model="form" ref="ruleForm" style="width:92%;margin-top:0px;margin-bottom:-16px">
            <el-form-item prop="sellerAlias" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入内容" v-model="form.sellerAlias" size="mini">
                <template slot="prepend" style=" width:80px;">店铺名称</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="sellerId" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入内容" v-model="form.sellerId" size="mini">
                <template slot="prepend" style=" width:80px;">卖家编号</template>
              </el-input>
            </el-form-item>
            <el-form-item prop="authToken" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入内容" v-model="form.authToken" size="mini">
                <template slot="prepend" style=" width:80px;">MWS授权令牌</template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item prop="emailAccount" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入邮箱" v-model="form.emailAccount" size="mini" type='email'>
                <template slot="prepend" style=" width:80px;">
                  店铺邮箱账号
                  <el-tooltip cplacement="top" effect="light">
                    <div slot="content">用于监控店铺预警消息和客户消息</div>
                    <i class='el-icon-question' style='margin-left:6px;font-size:16px;vertical-align: text-bottom;position: absolute;'></i>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="emailProtocol" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
                <div class='el-input el-input--mini el-input-group '>
                  <div class='el-input-group__prepend' style='line-height:26px;'>
                    接收邮件协议
                  </div>
                  <div style='border:1px solid #dcdcdc;height:28px;'>
                      <el-radio-group v-model="form.emailProtocol"  style='margin-top:8px;margin-left:10px;'>
                        <el-radio label="imap">IMAP</el-radio>
                       
                      </el-radio-group>
                  </div>
                </div>
            </el-form-item>
            <el-form-item prop="emailAuthCode" :label-width="formLabelWidth">
              <div class=" smallStarBox smallStar">*</div>
              <el-input placeholder="请输入邮箱授权码" v-model="form.emailAuthCode" size="mini" type='email'>
                <template slot="prepend" style=" width:80px;">
                  邮箱授权码
                  <el-tooltip cplacement="top" effect="light">
                    <div slot="content"> <a style='text-decoration: underline;color:#40a5ed;' @click='$router.push("/EmailAuthorizationHelp")'>查看授权教程</a> </div>
                    <i class='el-icon-question' style='margin-left:6px;font-size:16px;vertical-align: text-bottom;position: absolute;'></i>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </el-dialog-yt>
    </template>
    <!-- 查看教程 -->
    <template>
      <el-dialog-yt class="shopAuthorization-dia" :options="options_help" :events="events_help">
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
      </el-dialog-yt>
    </template>
    <!-- 邮箱授权 -->
    <yt-dialog :options='adAuthEmaildOpt' :events='adAuthEmaildEvents'>
       <span  slot="titleIn" style='position:absolute;left:100px;top:26px;'>
            <el-button type="text" @click='lookEmailcourse'>(查看授权教程)</el-button>
            <!-- $router.push("/EmailAuthorizationHelp") -->
        </span>
      <EmailAuthorizationDialog  ref='EmailAuthorizationDialog' v-if='adAuthEmaildOpt.visible'  :areaId='activeId' :adToAuthParams='adToAuthParams' @resquestEmaillSuccess='resquestEmaillSuccess' />
    </yt-dialog>
  </div>
</template>

<script>
  import USA from "@/assets/images/USA.png";
  import setSite from 'Service/mixins/setSite'
  import EmailAuthorizationDialog from './EmailAuthorizationDialog'
  import { host } from "Config";
export default {
  mixins: [setSite],
  components: {EmailAuthorizationDialog},
  // provide() {
  //   return {
  //     getList: this.getList,
  //     deleteTask: this.deleteTask,
  //     addTask: this.addTask,
  //     resetFields_add: this.resetFields_add,
  //     edit__: this.edit__,
  //     delete__: this.delete__ //删除单条
  //   };
  // },
  data() {
    let vm = this;
    return {
      USA,
      adAuthEmaildOpt:{
          title:'邮箱授权',
          width:'500px',
          visible:false
      },
      adToAuthParams:'',
      adAuthEmaildEvents:{
        handleOkClick:()=>{
          vm.$refs.EmailAuthorizationDialog.submit()
        }
      },
      searchFields:[
          {
            label: "店铺名称",
            name: "sellerAlias",
            type: "input",
            labelWidth:'60px',
            placeholder: "请输入任务名称"
          },
           {
            label: "创建时间",
            name: "time",
            type: "dateRange",
            placeholder: "请选择"
          },
          {
            label: "广告授权状态",
            name: "adAuthType",
            labelWidth:'110px',
            type: "select",
            placeholder: "请选择广告授权状态",
            options: [
              { label: "未授权", value: 0 },
              { label: "已授权", value: 1 },
            ]
          },
          {
            label: "邮箱授权状态",
            name: "emailAuthStatus",
            labelWidth:'110px',
            type: "select",
            placeholder: "请选择邮箱授权状态",
            options: [
              { label: "未授权", value: 0 },
              { label: "已授权", value: 1 },
            ]
          },
      ],
      editBtns:[
          {
            name: "添加授权",
            //showLoading:true,
            fn: () => {
              this.options.visible = true ;
              this.options.title = '添加授权' ;
              this.resetFields_add()
            }
          },
          {
            name: "删除",
            showLoading:true,
            disabled:()=>{
              return this.$refs.layout && this.$refs.layout.selection.length === 0
            },
            fn: () => {
              return this.deleteTask();
            }
          }
      ],
      edits: [
          {
            name: "编辑",
            icon: "el-icon-edit",
            // show: scope => {
            //   //console.log(scope);
            //   return scope.row.status===2;
            // },
            fn: scope => {
              this.options.title = '编辑授权' ;
              return this.edit__(scope.row);
            }
          },
          {
            name: "删除",
            icon: "el-icon-delete",
            // show: scope => {
            //   //console.log(scope);
            //   return scope.row.status===2;
            // },
            fn: scope => {
              return this.delete__(scope.row);
            }
          },
      ],
      columns:[
          {
            label: "序号",
            value: "taskName",
            minWidth: 50,
            render(h,scope){
              //console.log(scope);
              return(               
                <span>{ vm.$refs.layout.pageNo===1 ? scope.$index+1 : (vm.$refs.layout.pageNo-1)*vm.$refs.layout.pageSize+scope.$index+1 }</span>
              )
            }
          },
          {
            label: "店铺名称",
            value: "sellerAlias",
            minWidth: 150
          },
          {
            label: "卖家编号",
            value: "sellerId",
            minWidth: 150
          },
          {
            label: "授权时间",
            value: "authTime",
            minWidth: 150
          },
          {
            label: "添加时间",
            value: "createTime",
            minWidth: 150
          },
          {
            label: "广告授权状态",
            value: "adAuthType",
            minWidth: 150,
            render(h,scope){
                let {adAuthType} =scope.row;
                let span = ''
                if(adAuthType===0){
                    span = (
                       <el-button type="text" onClick={()=>{vm.adToAuth(scope.row)}}>立即去授权</el-button>
                    )
                }else if(adAuthType===1){
                    span = ('已授权')
                }
                return (
                  <div>{span}</div>
                )
            },
            // enum:{
            //   0:"未授权",
            //   1:"已授权"
            // }
          },
          {
            label: "广告授权时间",
            value: "adAuthTime",
            minWidth: 150
          },
          {
            label: "邮箱授权状态",
            value: "emailAuthStatus",
            minWidth: 150,
            render(h,scope){
                let {emailAuthStatus} =scope.row;
                let span = ''
                if(emailAuthStatus===0){
                    span = (
                       <el-button type="text" onClick={()=>{vm.emailToAuth(scope.row)}}>立即去授权</el-button>
                    )
                }else if(emailAuthStatus===1){
                    span = ('已授权')
                }
                return (
                  <div>{span}</div>
                )
            },
          },
          {
            label: "邮箱授权时间",
            value: "emailAuthTime",
            minWidth: 150
          },
          {
            label: "店铺邮箱",
            value: "emailAccount",
            minWidth: 200
          },
      ],
      outerParams:{
      },
      //站点
      activeName: null,
      activeId: null,
      slectIds:[],

      areaList: [],
      // // 搜索
      // search: {
      //   loading: false,
      //   sellerAlias: true,
      //   date: true
      // },
      // clearSearch: null,
      // 控件
      // hander: {
      //   addTask: true,
      //   addButton: "添加授权",
      //   deleteAuth: true
      // },
      // 表格
      // table: {
      //   loading: false,
      //   rowKey: "sellerAuthId",
      //   rows: [],
      //   pageNumber: 1,
      //   pageSize: 10,
      //   total: 0,
      //   show: {
      //     index: true,
      //     sellerAlias: true,
      //     sellerId: true,
      //     authTime: true,
      //     Handle: {
      //       edit: true,
      //       delete: true
      //     }
      //   }
      // },
      // userSelect: [],
      // 添加任务，编辑任务

      formLabelWidth: "50px", //label宽度
      options: {
        loading: false,
        visible: false,
        width: "620px",
        title: "添加授权",
        okBtnText: "确 认"
      },
      events: {
        handleOkClick: this.addTask
      },
      // 定义添加任务的数据
      form: {
        emailProtocol:"imap"
      },
      siteDatas: [], // 定义站点接收赋值
      // 校验
      rules: {
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
        sellerId: [
          {
            required: true,
            message: "请输入卖家编号",
            trigger: "blur"
          },
        ],
      },
      // 查看授权教程
      options_help: {
        visible: false,
        title: "授权教程",
        width: "1100px"
      },
      events_help: {
        handleOkClick: false
      },
      activeName1: "1",
      accreditObj: {
        name: "Amazon"
      },
      info: {}
    };
  },
  created() {
   
    // 获取授权开发者信息
    this.getInfo();
    this.getListArea(); //获取区域列表随后获取表格列表
		
  },
  mounted() {},
  methods: {
    //授权广告
    adToAuth(scope){
      this.$refs.layout.$dialog({
        title: "授权教程",
        width:'500px',
        //size:'small',
        params: {
          sellerId : scope.sellerId
        },
        component: () => import("./AdAuthorizationAddDialog.vue"),
        okBtnText: "复制URL",
        cancelBtnText: "取消"
      });
    },
    //查看邮箱授权教程
    lookEmailcourse(){
      let headUrl = host.split('shops')[0]+'shop';
      //console.log(headUrl);
      let url =  process.env.NODE_ENV === 'production' ? headUrl+'/#/EmailAuthorizationHelp':'/#/EmailAuthorizationHelp'
      window.open(url)
    },
    //邮箱授权成功
    resquestEmaillSuccess(){
        this.adAuthEmaildOpt.visible = false
        this.$refs.layout.getList()
    },
    //立即授权邮箱
      emailToAuth(row){
        this.adAuthEmaildOpt.visible = true;
        this.adToAuthParams = row;
      },
    //单选选择改变
      activeNameChange(){
        this.areaList.forEach(i=>{
          if(i.areaName === this.activeName){
              this.activeId = i.areaId
          }
        })
      },
    //参数处理
      searchFunc(data) {
        let { time, ...info } = data;
        let [startTime, endTime] = time || [];
        return { startTime, endTime, ...info };
    },
    //勾选改变
      selectChange(v) {
        //   console.log(v);
        this.slectIds = [];
        v.forEach(i => {
          this.slectIds.push(i.sellerAuthId);
        });
        //console.log(this.slectIds);
      },
    // 获取授权开发者信息
    getInfo() {
      return this.$api["GlobalApiInfo"]({}).then(data => {
        this.info = data.data;
        return data;
      });
    },
    //获取区域列表
    getListArea() {
      this.getAreaList().then(data => {
        this.areaList = data.data;
        this.activeName = this.areaList[0].areaName ; 
        this.activeId = this.areaList[0].areaId ;
        this.outerParams = {
            platformId: this.platformId,
            areaId: this.activeId
        };
      });
    },
    getAreaList() {
      let params = { platformId: this.platformId };
      return this.$api["areaList"](params);
    },
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        platformId: this.platformId, // 上线要改
        areaId: +this.activeName1,
        ...arg
      };
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0];
        params.endTime = params.date[1];
      }
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["shopList"](params)
        .then(data => {
          if (
            data.rows == "" &&
            data.pageNo !== null &&
            data.pageNo !== "" &&
            data.pageNo !== 1
          ) {
            let a = {
              pageSize: this.table.pageSize,
              pageNumber: 1
            };
            this.getList(a);
            return;
          }
          this.table.loading = false;
          data.rows.forEach((item, index) => {
            item.index = index + 1;
          });
          this.table.rows = data.rows;
          // console.log(data.rows == "");
          this.table.pageNumber = data.pageNo;
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          this.table.loading = false;
          console.log(err);
          return true;
        });
    },
    // 添加
    addTask() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let params = {
            platformId: this.platformId, //上线要改
            areaId: this.activeId,
            sellerAlias: this.form.sellerAlias,
            authToken: this.form.authToken,
            sellerId: this.form.sellerId,

            // emailAccount: this.form.emailAccount,
            // emailProtocol: this.form.emailProtocol,
            // emailAuthCode: this.form.emailAuthCode,
         

          };

          params = { ...params };
          params = this.$.dealObjectValue(params);
          if (this.form.sellerAuthId) {
            params.sellerAuthId = this.form.sellerAuthId;
          }
          // wish单选的时候导致this.excavateForm.keywordTypes从【】变成数字。多选的时候是【】，所有判断如果是数字，则变成数组
          if (typeof params.keywordTypes === "number") {
            params.keywordTypes = Array.of(params.keywordTypes);
          }
          this.options.loading = true; // 按钮loading
          this.$api[this.dialogURL](params)
            .then(data => {
              this.options.loading = false;
              if (data.code == 0) {
                this.options.visible = false; // 关闭弹窗
                this.$refs["ruleForm"].resetFields(); //清除数据记录
                this.clearSearch = new Date().getTime();


                this.$refs.layout.getList()
                this.getSelectPlatform();
                
                return;
              }
            })
            .catch(err => {
              console.log(err);
              this.options.loading = false;
              this.getSelectPlatform();
            });
        }
      });
    },
		// getSelectPlatform(params) {
		//   let defaults = {
		//     platformId: this.platformId
		//   };
		//   let opts = {
		//     ...defaults,
		//     ...params
		//   };
		//   this.$api["SellerAuthSelectList"](opts).then(data => {
		//     // this.stateData = data.data;
		//     this.$store.commit("common/stateData", data.data);
		//     if (!data.data.length) {
		//       this.$store.commit("common/siteId__", null);
		//       this.$store.commit("common/seller_Name", '选择店铺');
		// 			this.$store.commit("common/seller_Img",null);
		//       sessionStorage.removeItem('shop_seller_data')
		//       return
		//     }
		//     // 刷新的时候取本地的店铺信息来展示当前选中店铺，当然请求还是得发，因为要做下拉展示。
		//     let local = JSON.parse(sessionStorage.getItem("shop_seller_data"));
		//     if (local) {
		//       this.$store.commit("common/sellerData", local);
		//       // this.seller_Name = local.sellerAlias; //店铺名字
		//       this.$store.commit("common/seller_Name", local.sellerAlias);
		//       if (local.siteId == 1) {
		//         // 展示图片
		//         this.$store.commit("common/seller_Img",USA);
		//       }
		//     } else {
		//       // 如果本地sess没有，则取请求回来的第一个店铺默认选中
		//       if (this.stateData.length > 0) {
		//         let data = {
		//           sellerId: this.stateData[0].sellerId,
		//           siteId: this.stateData[0].siteList[0].siteId,
		//           sellerAlias: this.stateData[0].sellerAlias,
		//           platformId: defaults.platformId,
		//           // 存siteId用作类目选择上级，亚马孙底层类目映射
		//           siteList: this.stateData[0].siteList
		//         };
		//         // 存第一个店铺的sellerId和第一个siteList的第一个siteId到本地
		//         sessionStorage.setItem("shop_seller_data", JSON.stringify(data));
		// 				let userData = JSON.parse(localStorage.getItem("shop_seller_data") || '[]')
		// 				if (!userData.length) {
		// 					localStorage.setItem("shop_seller_data", JSON.stringify(data));
		// 				}
		//         // 存第一个店铺的sellerId和第一个siteList的第一个siteId到vuex
		//         this.$store.commit("common/sellerData", data);
		//         // 默认展示一个名字
		//         // this.seller_Name = this.stateData[0].sellerAlias; //店铺名字
		//         this.$store.commit(
		//           "common/seller_Name",
		//           this.stateData[0].sellerAlias
		//         );
		//         if (this.stateData[0].siteList[0].siteId == 1) {
		//           // 展示图片
		//          this.$store.commit("common/seller_Img",USA);
		//         }
		//       } else {
		//         // 没有店铺授权则跳转到无权限页面
		//         // this.seller_Name = "选择店铺"; //店铺名字
		//         this.$store.commit("common/seller_Name", "选择店铺");
		//         this.$store.commit("common/sellerData", null);
		//         this.$router.push("/error/notpermission");
		//       }
		//     }
		//     // console.log(this.stateData);
		//   });
		// },
    
    // 添加授权弹窗每次出来前清理表单
    resetFields_add() {
      // console.log(1);
      this.dialogURL = "addList";
      this.$set(this.form, "sellerAuthId", "");
      try {
          this.$refs.ruleForm.resetFields()
      } catch (err) {
        console.log(err);
      }
    },
    // 关闭教程弹窗
    closeHelp() {
      this.options_help.visible = false;
    },
    // 删除
    deleteTask() {
       return this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
             let params = { sellerAuthIds: this.slectIds };
            return this.$api["deleteList"](params)
              .then(data => {
                if (data.code === 0) {
                  this.getSelectPlatform();
                  localStorage.removeItem('shop_seller_data')
                  sessionStorage.removeItem('shop_seller_data')
                  return true;
                } else {
                  return false;
                }
              })
              .catch(err => {
                console.log(err);
              });
        }).catch(() => {
                  
        });
     
    },
    // 编辑
    edit__(row) {
      // console.log(arg);
      this.options.visible = true;
      this.dialogURL = "SellerAuthUpdate";
      let params = {
        sellerAuthId: row.sellerAuthId
      };
      this.$api["sellerAuthInfo"](params).then(data => {
        // this.form.siteId = data.data.siteId;
        this.$set(this.form, "siteId", data.data.siteId);
        // this.form.sellerAlias = data.data.sellerAlias.trim();
        this.$set(this.form, "sellerAlias", data.data.sellerAlias.trim());
        // this.form.authToken = data.data.authToken;
        this.$set(this.form, "authToken", data.data.authToken);
        // this.form.sellerId = data.data.sellerId.trim();
        this.$set(this.form, "sellerId", data.data.sellerId);
        this.$set(this.form, "sellerAuthId", data.data.sellerAuthId);

        this.$set(this.form, "emailAccount", data.data.emailAccount);
        this.$set(this.form, "emailAuthCode", data.data.emailAuthCode);

        
      });
    },
    //删除单条
    delete__(row) {
      this.$confirm("确定删除此条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            sellerAuthIds: [row.sellerAuthId]
          };
          this.$api["deleteList"](params).then(data => {
						if (data.code === 0) {
					
              this.$refs.layout.getList()
							localStorage.removeItem('shop_seller_data')
							sessionStorage.removeItem('shop_seller_data')
              this.getSelectPlatform();
              
							return true;
						} else {
							return false;
						}
					}).catch(err=>{
               //this.$refs.layout.getList()
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已放弃本次操作"
          // });
        });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang="scss">
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
.shopAuthorization-dia .el-dialog__title {
  position: absolute;
  top: -49px;
  left: 82px;
  padding-left: 10px;
  .el-button--text {
    color: #f44336;
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

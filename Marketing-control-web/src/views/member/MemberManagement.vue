<template>
    <div class="box">
        <div class="operation-btn">
            <el-button-group  ref="btnGroup">
                <el-button @click="changeStatus(null)" size="mini">全部</el-button>
                <el-button @click="changeStatus(3)" size="mini">重点</el-button>
                <el-button @click="changeStatus(0)" size="mini">未联系</el-button>
                <el-button @click="changeStatus(2)" size="mini">有意愿</el-button>
                <el-button @click="changeStatus(1)" size="mini">无意愿</el-button>
            </el-button-group>

            <el-button @click="showDialog(null,'ruleForm','add')" type="primary" size="mini">添加会员</el-button>
        </div>
        
        <el-table
        :data="list"
        v-loading="listLoading"
        :key='tableKey'
        style="width: 100%"
        tooltip-effect="light"
        height="700"
        :header-row-style="{fontSize:'12px',color:'#666'}"
        :header-cell-style="{background:'#f4f4f6',paddingTop:'8px',paddingBottom:'8px'}"
        :row-style="{fontSize:'12px'}"
        :cell-style="{paddingTop:'8px',paddingBottom:'8px'}">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <div class="table-expand">
                        <!-- <span>{{ props.row.merchantId}}aaaa</span> -->
                        <div class="box-left">
                            <div class="el-button-group" :ref="'set_status_btn_'+props.row.merchantId" v-if="props.row.status===0">
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,3)"><span>重点</span></button>
                                <button class="el-button el-button--primary el-button--mini" @click="setStatus(props.row.merchantId,0)"><span>未联系</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,2)"><span>有意愿</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,1)"><span>无意愿</span></button>
                            </div>
                            <div class="el-button-group" :ref="'set_status_btn_'+props.row.merchantId" v-else-if="props.row.status===1">
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,3)"><span>重点</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,0)"><span>未联系</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,2)"><span>有意愿</span></button>
                                <button class="el-button el-button--primary el-button--mini" @click="setStatus(props.row.merchantId,1)"><span>无意愿</span></button>
                            </div>
                            <div class="el-button-group" :ref="'set_status_btn_'+props.row.merchantId" v-else-if="props.row.status===2">
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,3)"><span>重点</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,0)"><span>未联系</span></button>
                                <button class="el-button el-button--primary el-button--mini" @click="setStatus(props.row.merchantId,2)"><span>有意愿</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,1)"><span>无意愿</span></button>
                            </div>
                            <div class="el-button-group" :ref="'set_status_btn_'+props.row.merchantId" v-else-if="props.row.status===3">
                                <button class="el-button el-button--primary el-button--mini" @click="setStatus(props.row.merchantId,3)"><span>重点</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,0)"><span>未联系</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,2)"><span>有意愿</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,1)"><span>无意愿</span></button>
                            </div>
                            <div class="el-button-group" :ref="'set_status_btn_'+props.row.merchantId" v-else>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,3)"><span>重点</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,0)"><span>未联系</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,2)"><span>有意愿</span></button>
                                <button class="el-button el-button--default el-button--mini" @click="setStatus(props.row.merchantId,1)"><span>无意愿</span></button>
                            </div>
                            
                            <div style="margin-left: 10px;">备注: {{props.row.remark}}</div>
                        </div>
                        <div class="box-right">
                            <button class="el-button el-button--primary el-button--mini" @click="updateStatus(props.row.merchantId)" :status="props.row.status" :ref="'update_status_btn_'+props.row.merchantId"><span>保存</span></button>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                prop="merchantId"
                label="序号"
                min-width="90"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="注册时间"
                min-width="100"
                :render-header="renderHeaderCreateTime">
            </el-table-column>
            <el-table-column
            prop="merchantName"
                label="名称"
                min-width="100"
                :render-header="renderHeaderMerchantName">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                min-width="100"
                show-overflow-tooltip
                :render-header="renderHeaderEmail">
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号"
                min-width="100"
                :render-header="renderHeaderMobile">
            </el-table-column>
            <el-table-column
                label="是否购买产品"
                min-width="110"
                show-overflow-tooltip
                :render-header="renderHeaderBuyFlag">
                 <template slot-scope="scope">
                  <div v-if="scope.row.buyFlag===0">否</div>
                  <div v-else>是</div>
                </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="showDialog(scope.row.merchantId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete" @click="deleteRows(scope.row.merchantId)" style="cursor:pointer"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="查看已购买产品" placement="top">
                  <i class="el-icon-view" @click="selectMemberProducts(scope.row.merchantId,scope.row.merchantName)" style="cursor:pointer"></i>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>

         <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogVisible"
          width="430px">
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="会员名称:" prop="merchantName">
                <el-input v-model="ruleForm.merchantName" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model="ruleForm.email" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="mobile">
                <el-input v-model="ruleForm.mobile" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
                <el-input v-model="ruleForm.password" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:" prop="checkPass">
                <el-input v-model="ruleForm.checkPass" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <query-orderby-or-query
        :p-dialog-visible="createTimeQueryVisible"
        :p-client-x-y="createTimeQueryXY"
        p-type="time"
        p-type-name="createTime"
        v-on:query="handleFilter"
        v-on:cancel="createTimeQueryVisible =false">
        </query-orderby-or-query>
        <query-one
        :p-dialog-visible="merchantNameQueryVisible"
        :p-client-x-y="merchantNameQueryXY"
        p-type="txt"
        p-type-name="merchantName"
        v-on:query="handleFilter"
        v-on:cancel="merchantNameQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="emailQueryVisible"
        :p-client-x-y="emailQueryXY"
        p-type="txt"
        p-type-name="email"
        v-on:query="handleFilter"
        v-on:cancel="emailQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="mobileQueryVisible"
        :p-client-x-y="mobileQueryXY"
        p-type="txt"
        p-type-name="mobile"
        v-on:query="handleFilter"
        v-on:cancel="mobileQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="buyFlagQueryVisible"
        :p-client-x-y="buyFlagQueryXY"
        p-type="radioCustom"
        p-type-name="buyFlag"
        :radio-items="[{value:0,label:'否'},{value:1,label:'是'}]"
        v-on:query="handleFilter"
        v-on:cancel="buyFlagQueryVisible =false">
        </query-one>

    </div>
</template>
<script>
import {httpPost} from '@/api/index'
import {validatEmail,validatMobile} from '@/utils/validate'
import QueryOne from '@/components/QueryDialog/QueryOne'
import QueryOrderbyOrQuery from '@/components/QueryDialog/QueryOrderbyOrQuery'
export default {
  components:{
    QueryOne,
    QueryOrderbyOrQuery
  },
  data() {
    
      let checkMerchantName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入会员名'));
        }else{
            callback();
        }
      };
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入邮箱'));
        }
        setTimeout(() => {
          if (!validatEmail(value)) {
            callback(new Error('请输入正确邮箱格式'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'));
        }
        setTimeout(() => {
          if (!validatMobile(value)) {
            callback(new Error('请输入正确手机号格式'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkPassword = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var checkPass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      
    return{
      tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        listQuery:{
            pageSize: 10,
            pageNumber: 1,
            // sortOrder: 'asc',
            merchantName:null,
            email:null,
            mobile:null,
            buyFlag:null,
            status:null,
            deleteFlag:0 //未删除
        },
        dialogVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        ruleForm: {
          merchantId:null,
          merchantName:null,
          email: null,
          mobile: null,
          password:null,
          checkPass:null
        },
        rules: {
          merchantName: [
            {required: true, validator: checkMerchantName, trigger: 'blur' }
          ],
          email: [
            {required: true, validator: checkEmail, trigger: 'blur' }
          ],
          mobile: [
            {required: true, validator: checkMobile, trigger: 'blur' }
          ],
          password: [
            {required: true, validator: checkPassword, trigger: 'blur' }
          ],
          checkPass: [
            {required: true, validator: checkPass2, trigger: 'blur' }
          ]
        },
        createTimeQueryVisible:false,
        createTimeQueryXY:[],
        merchantNameQueryVisible:false,
        merchantNameQueryXY:[],
        emailQueryVisible:false,
        emailQueryXY:[],
        mobileQueryVisible:false,
        mobileQueryXY:[],
        buyFlagQueryVisible:false,
        buyFlagQueryXY:[]
    }
  },
    created() {
      this.getList()
    },
    mounted(){
        this.$refs.btnGroup.$children[0].$el.className = 'el-button el-button--primary el-button--mini'
    },
    methods:{
      clickHandlerCreateTime(e){
        this.createTimeQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.createTimeQueryVisible =true
      },
      clickHandlerMerchantName(e){
        this.merchantNameQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.merchantNameQueryVisible =true
      },
      clickHandlerEmail(e){
        this.emailQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.emailQueryVisible =true
      },
      clickHandlerMobile(e){
        this.mobileQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.mobileQueryVisible =true
      },
      clickHandlerBuyFlag(e){
        this.buyFlagQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.buyFlagQueryVisible =true
      },

     renderHeaderCreateTime(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'createTime')
     },
     renderHeaderMerchantName(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'merchantName')
     },
     renderHeaderEmail(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'email')
     },
     renderHeaderMobile(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'mobile')
     },
     renderHeaderBuyFlag(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'buyFlag')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='createTime'){
         func =this.clickHandlerCreateTime
       }else if(t==='merchantName'){
         func =this.clickHandlerMerchantName
       }else if(t==='email'){
         func =this.clickHandlerEmail
       }else if(t==='mobile'){
         func =this.clickHandlerMobile
       }else if(t==='buyFlag'){
         func =this.clickHandlerBuyFlag
       }
       if(func===null){
         return (<span>{column.label}</span>)
       }
       return(
         <span>
          {column.label}
          <i slot="reference" 
              class="el-icon-search"
              style={{color: "#30cc7b",cursor: "pointer",fontSize: "16px",textIndent: "4px"}}
              onClick={func}>
          </i>
         </span>
         )
     },
     getList() {
      
      this.listLoading = true

      let params =this.listQuery
      let reqData={
        url:'/merchant/list',
        params
      }
      httpPost(reqData).then(res => {
        let {rows, total} = res
        this.list = rows
        this.total = total
        
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleFilter(params) {
      let {type} =params
      if(type==='packageName'){
        this.packageNameQueryVisible =false
        let packageName =null
        if(params.value!==null){
          let str =params.value.replace(/(^\s*)|(\s*$)/g,"")
          if(str.length!==0){
            packageName =str
          }
        }
        this.listQuery.packageName =packageName
      }else if(type==='createTime'){
        this.createTimeQueryVisible =false
        let sortOrder= params.sortOrder
        if(sortOrder==='asc'){
          this.listQuery.orderType =0
        }else if(sortOrder==='desc'){
          this.listQuery.orderType =1
        }
        let daterange =params.daterange
        this.listQuery.createTime =daterange
      }else if(type==='duration'){
        if(isNaN(params.value)){
          this.$message.warning('请输入数字');
          return
        }
        this.durationQueryVisible =false
        this.listQuery.duration =Number(params.value)
      }else if(type==='merchantName'){
        this.merchantNameQueryVisible =false
        this.listQuery.merchantName =params.value
      }else if(type==='email'){
        this.emailQueryVisible =false
        this.listQuery.email =params.value
      }else if(type==='mobile'){
        this.mobileQueryVisible =false
        this.listQuery.mobile =params.value
      }else if(type==='buyFlag'){
        this.buyFlagQueryVisible =false
        this.listQuery.buyFlag =params.value
        if(params.value==='radio_all'){
          this.listQuery.buyFlag=null
        }
      }

      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    changeStatus(status){
        let statusBtn= this.$refs.btnGroup.$children;
        for (let index = 0; index < statusBtn.length; index++) {
            statusBtn[index].$el.className = 'el-button el-button--default el-button--mini'
        }
        let btnIndex =0
        if(status===0){
            btnIndex =2
        }else if(status===3){
            btnIndex =1
        }else if(status===1){
            btnIndex =4
        }else if(status===2){
            btnIndex =3
        }
        statusBtn[btnIndex].$el.className = 'el-button el-button--primary el-button--mini'
        this.listQuery.status =status
        this.getList()
    },
    setStatus(id,status){
        let setStatusBtn= this.$refs['set_status_btn_'+id].children;
        for (let index = 0; index < setStatusBtn.length; index++) {
            setStatusBtn[index].className = 'el-button el-button--default el-button--mini'
        }
        let btnIndex =0
        if(status===0){
            btnIndex =1
        }else if(status===1){
            btnIndex =3
        }else if(status===2){
            btnIndex =2
        }else if(status===3){
            btnIndex =0
        }
        setStatusBtn[btnIndex].className = 'el-button el-button--primary el-button--mini'
        
       let updStatusBtn =this.$refs['update_status_btn_'+id]
       //console.log(updStatusBtn.getAttribute('status'))//获取自定义属性getAttribute('status') 设置自定义属性 setAttribute('status',status)
       updStatusBtn.setAttribute('status',status)
       
    },
    updateStatus(id){
        let updStatusBtn =this.$refs['update_status_btn_'+id]
        let status =updStatusBtn.getAttribute('status')
        let params ={
            merchantId:id,
            status:Number(status)
        }
        let reqData={
            url:'/merchant/update',
            params
        }
        httpPost(reqData).then(res => {
          let {code,msg} =res
          if(code===0){
              this.$message.success(msg);
              this.getList()
          }
        }).catch(err=>{
            console.log(err)
        })
    },
    showDialog(id,formName,t){
      if(t==='edit'){
          this.dialogTitle='编辑'
          this.isDialogAdd=false
        }else{
          this.dialogTitle='新增'
          this.isDialogAdd=true
        }
      this.dialogVisible=true;
      if(this.$refs[formName]!==undefined){
        this.$refs[formName].resetFields();
      }
      if(t==='edit'){
        let reqData={
          url:'/merchant/info',
          params:{id}
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            merchantId:data.merchantId,
            merchantName:data.merchantName,
            email:data.email,
            mobile:data.mobile,
            password:data.password,
            checkPass:null
          }
        }).catch(err=>{
          console.log(err)
        })
      }
      

    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.dialogVisible=false
            let params =this.ruleForm
            
            let url ='/merchant/save'
            if(this.isDialogAdd){
              params.merchantId=null
            }else{
              if(params.merchantId===null||!Number.isInteger(params.merchantId)){
                this.$message.error('增短信模板ID为空或不为数字');
                return
              }
              url ='/merchant/update'
            }
            let reqData={
                url,
                params
            }
            httpPost(reqData).then(res => {
              this.$message.success('操作成功');
              this.getList()
            }).catch(err=>{
              console.log(err)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.ruleForm.remark =null
    },
    deleteRows(id){
      let params ={ids:[id]}
      this.$confirm('此操作为删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let reqData={
                url:'/merchant/remove',
                params
            }
            httpPost(reqData).then(res => {
              this.$message.success('操作成功');
              this.getList()
            }).catch(err=>{
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });       
        })

    },
    selectMemberProducts(merchantId,merchantName){
        this.$router.push({
        path: '/member/memberProducts',
        query: {
          merchantId,
          merchantName
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../styles/page-default';
</style>
<style lang="less" scoped>
.box{
    .operation-btn{
        display: flex;
        justify-content: space-between;
    }
    /deep/.el-table__expanded-cell{
        // background-color: #f5f4fa;
        padding: 5px;
    }
    /deep/.table-expand {
        display: flex;
        justify-content: space-between;
    }
    .table-expand{
        .box-left{
            display: flex;
            align-items: center;
            .remark{
                margin-left: 5px;
            }
        }
    }
    
  /deep/.table-expand label {
    width: 90px;
    color: #99a9bf;
  }
 

   
}
 
</style>


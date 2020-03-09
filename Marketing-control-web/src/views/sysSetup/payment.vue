<template>
    <div class="box">
        <el-button-group>
            <el-button @click="showDialog(null,'ruleForm','add')" size="mini">新增</el-button>
            <el-button @click="deleteRows(null)" size="mini">批量删除</el-button>
        </el-button-group>

      <!-- @sort-change="handleSortChange" -->
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
        :cell-style="{paddingTop:'8px',paddingBottom:'8px'}"
        @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
                prop="orderNo"
                label="序号"
                min-width="50"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="type"
                label="启用状态"
                min-width="100"
                :render-header="handlerRenderHeaderType"
                >
                <template slot-scope="scope">
                  <div v-if="scope.row.type===0">关闭</div>
                  <div v-else>开启</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="payType"
                label="支付方式"
                min-width="100"
                :render-header="handlerRenderHeaderPayType">
                <template slot-scope="scope">
                  <div v-if="scope.row.payType===0">微信</div>
                  <div v-else-if="scope.row.payType===1">支付宝</div>
                </template>
            </el-table-column>
            <el-table-column
                label="支付图标">
                <template slot-scope="scope">
                  <img src="@/assets/payment/WeChat-Pay-64.png" style="height: 20px" v-if="scope.row.payType===0"/>
                  <img src="@/assets/payment/Alipay-64.png" style="height: 20px" v-else-if="scope.row.payType===1"/>
                  <!-- <img :src="'../..'+(scope.row.payIco)" style="height: 20px" /> -->
              </template>
            </el-table-column>
            <el-table-column
                prop="updateUser"
                label="更新人"
                :render-header="handlerRenderHeaderUpdateUser">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="更新时间"
                :render-header="handlerRenderHeaderUpdateTime"
                >
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="showDialog(scope.row.payConfigId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete" @click="deleteRows(scope.row.payConfigId)" style="cursor:pointer"></i>
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
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="125px">
            <el-form-item label="支付平台名称:" >
              <el-radio-group v-model="ruleForm.payType"  size="mini">
                <el-radio-button label="0">微信</el-radio-button>
                <el-radio-button label="1">支付宝</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="支付图标:" prop="payIco" style="height:64px;">
              <img src="@/assets/payment/WeChat-Pay-64.png" v-if="ruleForm.payType==='0'"/>
              <img src="@/assets/payment/Alipay-64.png" v-else-if="ruleForm.payType==='1'"/>
            </el-form-item>
            <el-form-item label="支付账号:" prop="payAccount">
              <el-input v-model="ruleForm.payAccount" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="合作者身份(PID):" prop="appId">
              <el-input v-model="ruleForm.appId" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="安全校验码(Key):" prop="paySecret">
              <el-input v-model="ruleForm.paySecret" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="同步地址:" prop="returnUrl">
              <el-input v-model="ruleForm.returnUrl" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="回调地址:" prop="notifyUrl">
              <el-input v-model="ruleForm.notifyUrl" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="排序:" prop="orderNo">
              <el-input v-model.number="ruleForm.orderNo" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="启用状态:">
              <el-switch
                v-model="ruleForm.type"
                active-text="开启"
                inactive-text="关闭">
              </el-switch>
            </el-form-item>
            <el-form-item class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <query-one
        :p-dialog-visible="typeQueryVisible"
        :p-client-x-y="typeQueryXY"
         p-type="radioCustom"
         p-type-name="QueryType"
        :radio-items="[{value:0,label:'关闭'},{value:1,label:'开启'}]"
        v-on:query="handleFilter"
        v-on:cancel="typeQueryVisible =false">
        </query-one>

        <query-one
        :p-dialog-visible="payTypeQueryVisible"
        :p-client-x-y="payTypeQueryXY"
         p-type="radioCustom"
         p-type-name="QueryPayType"
        :radio-items="[{value:0,label:'微信'},{value:1,label:'支付宝'}]"
        v-on:query="handleFilter"
        v-on:cancel="payTypeQueryVisible =false">
        </query-one>

        <query-one
        :p-dialog-visible="txtQueryVisible"
        :p-client-x-y="txtQueryXY"
        p-type="txt"
        p-type-name="QueryupdateUser"
        v-on:query="handleFilter"
        v-on:cancel="txtQueryVisible =false">
        </query-one>

        <!-- <query-one
        :p-dialog-visible="orderByTimeQueryVisible"
        :p-client-x-y="orderByTimeQueryXY"
        p-type="time"
        v-on:query="handleFilter"
        v-on:cancel="orderByTimeQueryVisible =false">
        </query-one> -->

        <query-orderby-or-query
        :p-dialog-visible="orderByTimeQueryVisible"
        :p-client-x-y="orderByTimeQueryXY"
        p-type="time"
        p-type-name="QueryOrderbyOrTime"
        v-on:query="handleFilter"
        v-on:cancel="orderByTimeQueryVisible =false">
        </query-orderby-or-query>

    </div>
</template>
<script>
import {httpPost} from '@/api/index'
import {validatChinese,validateURL} from '@/utils/validate'
import QueryOne from '@/components/QueryDialog/QueryOne'
import QueryOrderbyOrQuery from '@/components/QueryDialog/QueryOrderbyOrQuery'

export default {
  components:{
    QueryOne,
    QueryOrderbyOrQuery
  },
  data() {
    
      let checkPayAccount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入支付账号'));
        }
        setTimeout(() => {
          if (!validatChinese(value)) {
            callback(new Error('请输入英文或数字'));
          } else {
            callback();
          }
        }, 1000);
      };

      let checkAppId = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入合作者身份(PID)'));
        }
        setTimeout(() => {
          if (!validatChinese(value)) {
            callback(new Error('请输入英文或数字或其它字符'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkPaySecret = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入安全校验码(Key)'));
        }
        setTimeout(() => {
          if (!validatChinese(value)) {
            callback(new Error('请输入英文或数字或其它字符'));
          } else {
            callback();
          }
        }, 1000);
      };

      let checkReturnUrl = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入同步地址'));
        }
        setTimeout(() => {
          if (!validateURL(value)) {
            callback(new Error('请输入合法uri'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkNotifyUrl = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入回调地址'));
        }
        setTimeout(() => {
          if (!validateURL(value)) {
           callback(new Error('请输入合法uri'));
          } else {
            callback();
          }
        }, 1000);
      };

      let checkOrderNo = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入排序'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 1000);
      };
    return{
      tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        listQuery:{
            pageSize: 10,
            pageNumber: 1,
            sortOrder: 'asc',
            payType:null,
            type:null,
            updateUser:null,
            updateTime:[]
        },
        dialogVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        ruleForm: {
          payConfigId:null,
          payType: '0',
          payIco: null,
          payAccount:null,
          appId:null,
          paySecret:null,
          returnUrl:null,
          notifyUrl:null,
          orderNo:null,
          type:true
        },
        multipleSelection: [],
        rules: {
          payAccount: [
            {required: true, validator: checkPayAccount, trigger: 'blur' }
          ],
          appId: [
            {required: true, validator: checkAppId, trigger: 'blur' }
          ],
          paySecret: [
            {required: true, validator: checkPaySecret, trigger: 'blur' }
          ],
          returnUrl: [
            {required: true, validator: checkReturnUrl, trigger: 'blur' }
          ],
          notifyUrl: [
            {required: true, validator: checkNotifyUrl, trigger: 'blur' }
          ],
          orderNo: [
            {required: true, validator: checkOrderNo, trigger: 'blur' }
          ]
        },

        typeQueryVisible:false,
        typeQueryXY:[],
        payTypeQueryVisible:false,
        payTypeQueryXY:[],
        txtQueryVisible:false,
        txtQueryXY:[],
        orderByTimeQueryVisible:false,
        orderByTimeQueryXY:[]
        
    }
  },
    created() {
      this.getList()
    },
    methods:{
      clickHandlerType(e){
        this.typeQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.typeQueryVisible =true
      },
      clickHandlerPayType(e){
        this.payTypeQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.payTypeQueryVisible =true
      },
      clickHandlerUpdateUser(e){
        this.txtQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.txtQueryVisible =true
      },
      clickHandlerUpdateTime(e){
        this.orderByTimeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.orderByTimeQueryVisible =true
      },
     handlerRenderHeaderType(h, { column, $index }) {
       return this.handlerRenderHeader(h, {column, $index },'type')
     },
     handlerRenderHeaderPayType(h, { column, $index }){
        return this.handlerRenderHeader(h, {column, $index },'payType')
     },
     handlerRenderHeaderUpdateUser(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'updateUser')
     },
     handlerRenderHeaderUpdateTime(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'updateTime')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='type'){
         func =this.clickHandlerType
       }else if(t==='payType'){
         func =this.clickHandlerPayType
       }else if(t==='updateUser'){
         func =this.clickHandlerUpdateUser
       }else if(t==='updateTime'){
         func =this.clickHandlerUpdateTime
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
    //  handleSortChange({ column, prop, order }) {
    //   if (!prop) {
    //     this.sortProp = null;
    //     this.getList();
    //     return;
    //   }
    //   console.log(column, prop, order);
    //   const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
    //     return "_" + str.toLowerCase();
    //   })} ${order === "ascending" ? "asc" : "desc"}`;
    //   this.sortProp = sortOrder;
    //   this.getList();
    // },
     getList() {
      this.listLoading = true
      let params =this.listQuery
      //  if (this.sortProp) {
      //   params.sortOrder = this.sortProp;
      // } else {
      //   delete params.sortOrder;
      // }
      let reqData={
        url:'/payConfig/list',
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
      if(type==='QueryType'){
        this.typeQueryVisible =false
        this.listQuery.type =params.value
        if(params.value==='radio_all'){ // 10 全部
          this.listQuery.type=null
        }
      }else if(type==='QueryPayType'){
        this.payTypeQueryVisible =false
        this.listQuery.payType =params.value
        if(params.value==='radio_all'){
          this.listQuery.payType=null
        }
      }else if(type==='QueryupdateUser'){
        this.txtQueryVisible =false
        this.listQuery.updateUser =params.value
      }else if(type==='QueryOrderbyOrTime'){//QueryTime
        this.orderByTimeQueryVisible =false
        let sortOrder= params.sortOrder
        this.listQuery.sortOrder =sortOrder
        let daterange =params.daterange
        this.listQuery.updateTime =daterange
      }
      // else if(type==='QueryOrderbyOrTxt'){
      //   this.orderByTimeQueryVisible =false
      //   let sortOrder= params.sortOrder
      //   let txt =params.txt
      // }
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
          url:'/payConfig/info',
          params:{id}
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            payConfigId:id,
            payType: data.payType.toString(),
            payIco: null,
            payAccount:data.payAccount,
            appId:data.appId,
            paySecret:data.paySecret,
            returnUrl:data.returnUrl,
            notifyUrl:data.notifyUrl,
            orderNo:data.orderNo,
            type:data.type===0?false:true
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
            if(params.payType==='0'){
              params.payType=0
              params.payIco ='/assets/payment/WeChat-Pay-64.png'
            }else if(params.payType==='1'){
              params.payType=1
              params.payIco ='/assets/payment/Alipay-64.png'
            }
            if(params.type){
              params.type=1
            }else{
              params.type=0
            }
            let url ='/payConfig/save'
            if(this.isDialogAdd){
              params.payConfigId=null
            }else{
              if(params.payConfigId===null||!Number.isInteger(params.payConfigId)){
                this.$message.error('支付配置ID为空或不为数字');
                return
              }
              url ='/payConfig/update'
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
    },
    deleteRows(id){
      let params =null
      let confirmTitle ='此操作为删除, 是否继续?'
      if(id!==null){
        params={ids:[id]}
      }else{
        if(this.multipleSelection.length===0){
          this.$message.info('请至少选一项');
          return
        }
        let ids=[]
        this.multipleSelection.forEach(element => {
          ids.push(element.payConfigId)
        });
        confirmTitle ='此操作为批量删除, 是否继续?'
        params={ids}
      }
      
      this.$confirm(confirmTitle, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let reqData={
                url:'/payConfig/remove',
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>


<style lang="less" scoped>
  @import '../../styles/page-default';
</style>




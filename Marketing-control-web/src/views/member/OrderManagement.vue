<template>
    <div class="box">
        <el-button-group ref="payStatusGroupBtn">
            <el-button @click="changePayStatus(null)" size="mini">全部</el-button>
            <el-button @click="changePayStatus(0)" size="mini">未支付</el-button>
            <el-button @click="changePayStatus(1)" size="mini">已支付</el-button>
            <el-button @click="changePayStatus(2)" size="mini">已关闭</el-button>
         </el-button-group>
        
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
            <el-table-column
                prop="orderId"
                label="序号"
                min-width="90"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="订单创建时间"
                min-width="120"
                show-overflow-tooltip
                :render-header="renderHeaderCreateTime">
            </el-table-column>
            <el-table-column
              prop="merchantName"
                label="用户名"
                min-width="90"
                :render-header="renderHeaderMerchantName">
            </el-table-column>
            <el-table-column
                prop="phone"
                label="手机号"
                min-width="100"
                show-overflow-tooltip
                :render-header="renderHeaderPhone">
            </el-table-column>
            <el-table-column
                label="订单产品"
                min-width="90"
                :render-header="renderHeaderPackageType">
                <template slot-scope="scope">
                  <div v-if="scope.row.packageType===0">市场套餐</div>
                  <div v-else-if="scope.row.packageType===1">广告套餐</div>
                  <div v-else>其它</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="packageName"
                label="名称"
                min-width="80"
                show-overflow-tooltip
                :render-header="renderHeaderPackageName">
            </el-table-column>
            <el-table-column
                prop="charge"
                label="金额"
                min-width="80"
                show-overflow-tooltip
                :render-header="renderHeaderCharge">
            </el-table-column>
            <el-table-column
                label="支付状态"
                min-width="80"
                show-overflow-tooltip
                :render-header="renderHeaderPayStatus">
                <template slot-scope="scope">
                  <div v-if="scope.row.payStatus===0">未支付</div>
                  <div v-else-if="scope.row.payStatus===1">已支付</div>
                  <div v-else-if="scope.row.payStatus===2">已关闭</div>
                  <div v-else>其它</div>
                </template>
            </el-table-column>
            <el-table-column
                label="支付方式"
                min-width="80"
                show-overflow-tooltip
                :render-header="renderHeaderPayType">
                <template slot-scope="scope">
                  <div v-if="scope.row.payType===0">支付宝</div>
                  <div v-else-if="scope.row.payType===1">微信</div>
                  <div v-else>其它</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="payTime"
                label="支付时间"
                min-width="120"
                show-overflow-tooltip
                :render-header="renderHeaderPayTime">
            </el-table-column>
            <el-table-column
              label="操作"
              width="50">
              <template slot-scope="scope">
                <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="showDialog(scope.row.templateId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip> -->
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete" @click="deleteRows(scope.row.orderId)" style="cursor:pointer"></i>
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
          width="500px">
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="短信类型:" >
                <el-select v-model="ruleForm.messageType" placeholder="请选择">
                    <el-option label="注册" value="0"></el-option>
                    <el-option label="找回密码" value="1"></el-option>
                    <el-option label="修改密码" value="2"></el-option>
                    <el-option label="修改手机号" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="短信签名:" prop="signName">
                <el-input v-model="ruleForm.signName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="短信模板ID:" prop="templateCode">
                <el-input v-model="ruleForm.templateCode" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="是否默认:">
              <el-switch
                v-model="ruleForm.defaultFlag"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
            <el-form-item label="过期时间(s):" prop="expire">
                <el-input v-model.number="ruleForm.expire"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="ruleForm.remark"
                 autocomplete="off">
                </el-input>
            </el-form-item>
            <el-form-item class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
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
        :p-dialog-visible="phoneQueryVisible"
        :p-client-x-y="phoneQueryXY"
        p-type="txt"
        p-type-name="phone"
        v-on:query="handleFilter"
        v-on:cancel="phoneQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="packageTypeQueryVisible"
        :p-client-x-y="packageTypeQueryXY"
        p-type="radioCustom"
        p-type-name="packageType"
        :radio-items="[{value:0,label:'市场套餐'},{value:1,label:'广告套餐'}]"
        v-on:query="handleFilter"
        v-on:cancel="packageTypeQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="packageNameQueryVisible"
        :p-client-x-y="packageNameQueryXY"
        p-type="txt"
        p-type-name="packageName"
        v-on:query="handleFilter"
        v-on:cancel="packageNameQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="chargeQueryVisible"
        :p-client-x-y="chargeQueryXY"
        p-type="txt"
        p-type-name="charge"
        v-on:query="handleFilter"
        v-on:cancel="chargeQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="payStatusQueryVisible"
        :p-client-x-y="payStatusQueryXY"
        p-type="radioCustom"
        p-type-name="payStatus"
        :radio-items="[{value:0,label:'未支付'},{value:1,label:'已支付'},{value:2,label:'已关闭'}]"
        v-on:query="handleFilter"
        v-on:cancel="payStatusQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="payTypeQueryVisible"
        :p-client-x-y="payTypeQueryXY"
        p-type="radioCustom"
        p-type-name="payType"
        :radio-items="[{value:0,label:'支付宝'},{value:1,label:'微信'}]"
        v-on:query="handleFilter"
        v-on:cancel="payTypeQueryVisible =false">
        </query-one>

        <query-orderby-or-query
        :p-dialog-visible="payTimeQueryVisible"
        :p-client-x-y="payTimeQueryXY"
        p-type="time"
        p-type-name="payTime"
        v-on:query="handleFilter"
        v-on:cancel="payTimeQueryVisible =false">
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
    
      let checkSignName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('短信签名不能为空'));
        }else{
            callback();
        }
      };
      let checkTemplateCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('短信模板ID不能为空'));
        }
        setTimeout(() => {
          if (!validatChinese(value)) {
            callback(new Error('请输入英文或数字或其它字符'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkExpire = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('过期时间(s)不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 1000);
      }

      
    return{
      tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        listQuery:{
            pageSize: 10,
            pageNumber: 1,
            sortOrder: 'asc',
            payStatus:null
        },
        dialogVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        ruleForm: {
          templateId:null,
          messageType:null,
          signName: null,
          templateCode: null,
          defaultFlag:null,
          expire:null,
          remark:null
        },
        rules: {
          signName: [
            { validator: checkSignName, trigger: 'blur' }
          ],
          templateCode: [
            { validator: checkTemplateCode, trigger: 'blur' }
          ],
          expire: [
            { validator: checkExpire, trigger: 'blur' }
          ]
        },
        createTimeQueryVisible:false,
        createTimeQueryXY:[],
        merchantNameQueryVisible:false,
        merchantNameQueryXY:[],
        phoneQueryVisible:false,
        phoneQueryXY:[],
        packageTypeQueryVisible:false,
        packageTypeQueryXY:[],
        packageNameQueryVisible:false,
        packageNameQueryXY:[],
        chargeQueryVisible:false,
        chargeQueryXY:[],
        payStatusQueryVisible:false,
        payStatusQueryXY:[],
        payTypeQueryVisible:false,
        payTypeQueryXY:[],
        payTimeQueryVisible:false,
        payTimeQueryXY:[] 
    }
  },
    created() {
      this.getList()
    },
    mounted(){
      this.$refs.payStatusGroupBtn.$children[0].$el.className = 'el-button el-button--primary el-button--mini'
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
      clickHandlerPhone(e){
        this.phoneQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.phoneQueryVisible =true
      },
      clickHandlerPackageType(e){
        this.packageTypeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.packageTypeQueryVisible =true
      },
      clickHandlerPackageName(e){
        this.packageNameQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.packageNameQueryVisible =true
      },
      clickHandlerCharge(e){
        this.chargeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.chargeQueryVisible =true
      },
      clickHandlerPayStatus(e){
        this.payStatusQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.payStatusQueryVisible =true
      },
      clickHandlerPayType(e){
        this.payTypeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.payTypeQueryVisible =true
      },
      clickHandlerPayTime(e){
        this.payTimeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.payTimeQueryVisible =true
      },

     renderHeaderCreateTime(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'createTime')
     },
     renderHeaderMerchantName(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'merchantName')
     },
     renderHeaderPhone(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'phone')
     },
     renderHeaderPackageType(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'packageType')
     },
     renderHeaderPackageName(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'packageName')
     },
     renderHeaderCharge(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'charge')
     },
     renderHeaderPayStatus(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'payStatus')
     },
     renderHeaderPayType(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'payType')
     },
     renderHeaderPayTime(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'payTime')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='createTime'){
         func =this.clickHandlerCreateTime
       }else if(t==='merchantName'){
         func =this.clickHandlerMerchantName
       }else if(t==='phone'){
         func =this.clickHandlerPhone
       }else if(t==='packageType'){
         func =this.clickHandlerPackageType
       }else if(t==='packageName'){
         func =this.clickHandlerPackageName
       }else if(t==='charge'){
         func =this.clickHandlerCharge
       }else if(t==='payStatus'){
         func =this.clickHandlerPayStatus
       }else if(t==='payType'){
         func =this.clickHandlerPayType
       }else if(t==='payTime'){
         func =this.clickHandlerPayTime
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
        url:'/order/list',
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
      
      
      if(type==='createTime'){
        this.createTimeQueryVisible =false
        let sortOrder= params.sortOrder
        if(sortOrder==='asc'){
          this.listQuery.orderType =0
        }else if(sortOrder==='desc'){
          this.listQuery.orderType =1
        }
        let daterange =params.daterange
        this.listQuery.createTime =daterange
      }else if(type==='merchantName'){
        this.merchantNameQueryVisible =false
        this.listQuery.merchantName =params.value
      }else if(type==='phone'){
        this.phoneQueryVisible =false
        this.listQuery.mobile =params.value
      }else if(type==='packageType'){
        this.packageTypeQueryVisible =false
        this.listQuery.packageType =params.value
        if(params.value==='radio_all'){
          this.listQuery.packageType=null
        }
      }else if(type==='packageName'){
        this.packageNameQueryVisible =false
        this.listQuery.packageName =params.value
      }else if(type==='charge'){
        if(isNaN(params.value)){
          this.$message.warning('请输入数字');
          return
        }
        this.chargeQueryVisible =false
        this.listQuery.charge =Number(params.value)
      }else if(type==='payStatus'){
        this.payStatusQueryVisible =false
        this.listQuery.payStatus =params.value
        if(params.value==='radio_all'){
          this.listQuery.payStatus=null
        }
      }else if(type==='payType'){
        this.payTypeQueryVisible =false
        this.listQuery.payType =params.value
        if(params.value==='radio_all'){
          this.listQuery.payType=null
        }
      }else if(type==='payTime'){
        this.payTimeQueryVisible =false
        let sortOrder= params.sortOrder
        if(sortOrder==='asc'){
          this.listQuery.orderType =0
        }else if(sortOrder==='desc'){
          this.listQuery.orderType =1
        }
        let daterange =params.daterange
        this.listQuery.payTime =daterange
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
    changePayStatus(payStatus){
      let payStatusBtn= this.$refs.payStatusGroupBtn.$children;
        for (let index = 0; index < payStatusBtn.length; index++) {
            payStatusBtn[index].$el.className = 'el-button el-button--default el-button--mini'
        }
        let btnIndex =0
        if(payStatus===0){
            btnIndex =1
        }else if(payStatus===1){
            btnIndex =2
        }else if(payStatus===2){
            btnIndex =3
        }
        payStatusBtn[btnIndex].$el.className = 'el-button el-button--primary el-button--mini'
        this.listQuery.payStatus =payStatus
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
          url:'/messageTemplate/info',
          params:{id}
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            templateId:data.templateId,
            messageType:data.messageType.toString(),
            signName:data.signName,
            templateCode:data.templateCode,
            defaultFlag:data.defaultFlag===0?false:true,
            expire:data.expire,
            remark:data.remark
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
            if(params.defaultFlag){
              params.defaultFlag=1
            }else{
              params.defaultFlag=0
            }
            let url ='/messageTemplate/save'
            if(this.isDialogAdd){
              params.templateId=null
            }else{
              if(params.templateId===null||!Number.isInteger(params.templateId)){
                this.$message.error('增短信模板ID为空或不为数字');
                return
              }
              url ='/messageTemplate/update'
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
                url:'/order/remove',
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

    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../styles/page-default';
</style>



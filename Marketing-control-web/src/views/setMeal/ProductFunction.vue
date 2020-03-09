<template>
    <div class="box">
        <el-button-group class="change-list" ref="btnGroup">
            <el-button size="mini" v-for="(value, index) in btnList" :key="value.projectId" @click="changeList(value.projectId,index)">{{value.projectName}}</el-button>
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
          :cell-style="{paddingTop:'8px',paddingBottom:'8px'}"
          @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
                prop="functionId"
                label="序号"
                min-width="80"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="functionName"
                label="功能名称"
                min-width="90"
                show-overflow-tooltip
                :render-header="renderHeaderFunctionName">
            </el-table-column>
            <el-table-column
                label="收费类型"
                min-width="90"
                :render-header="renderHeaderChargeType">
                <template slot-scope="scope">
                  <div v-if="scope.row.chargeType===0">按次</div>
                  <div v-else-if="scope.row.chargeType===1">包月</div>
                  <div v-else-if="scope.row.chargeType===2">100M/月</div>
                  <div v-else>其它</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="charge"
                label="费用"
                min-width="90"
                :render-header="renderHeaderCharge">
            </el-table-column>
            <el-table-column
                prop="updateUser"
                label="更新人"
                min-width="90"
                show-overflow-tooltip
                :render-header="renderHeaderUpdateUser">
            </el-table-column>
            <el-table-column
                prop="updateTime"
                label="更新时间"
                min-width="90"
                show-overflow-tooltip
                :render-header="renderHeaderUpdateTime">
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="showDialog(scope.row.functionId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip>  
                <el-tooltip class="item" effect="dark" content="查看" placement="top">
                  <i class="el-icon-view" @click="showDialog(scope.row.functionId,'ruleForm','view')" style="cursor:pointer"></i>
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
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="90px">
            <el-form-item label="功能名称:" prop="functionName">
                <el-input v-model="ruleForm.functionName" autocomplete="off" :disabled="isDialogView" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="费用:"  prop="charge" class="form-item-charge">
                <el-input v-model="ruleForm.charge" autocomplete="off" :disabled="isDialogView" size="mini"></el-input><span class="input-unit">点/次</span>
            </el-form-item>
            
            <el-form-item label="功能描述:">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="ruleForm.desc"
                 autocomplete="off"
                 :disabled="isDialogView"
                  size="mini">
                </el-input>
            </el-form-item>
            <el-form-item v-if="!isDialogView" class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
            </el-form-item>
            <el-form-item v-else class="form-item-btn">
              <el-button type="primary" @click="dialogVisible = false" size="mini">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <query-one
        :p-dialog-visible="functionNameQueryVisible"
        :p-client-x-y="functionNameQueryXY"
        p-type="txt"
        p-type-name="functionName"
        v-on:query="handleFilter"
        v-on:cancel="functionNameQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="chargeTypeQueryVisible"
        :p-client-x-y="chargeTypeQueryXY"
        :radio-items="[{value:0,label:'按次'},{value:1,label:'包月'}]"
        p-type="radioCustom"
        p-type-name="chargeType"
        v-on:query="handleFilter"
        v-on:cancel="chargeTypeQueryVisible =false">
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
        :p-dialog-visible="updateUserQueryVisible"
        :p-client-x-y="updateUserQueryXY"
        p-type="txt"
        p-type-name="updateUser"
        v-on:query="handleFilter"
        v-on:cancel="updateUserQueryVisible =false">
        </query-one>
        <query-orderby-or-query
        :p-dialog-visible="orderOrTimeQueryVisible"
        :p-client-x-y="orderOrTimeQueryXY"
        p-type="time"
        p-type-name="updateTime"
        v-on:query="handleFilter"
        v-on:cancel="orderOrTimeQueryVisible =false">
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
    
      let checkFunctionName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('功能名称不能为空'));
        }else{
            callback();
        }
      };
      let checkCharge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('费用不能为空'));
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
      btnList:null,
      productManageProjectId:null,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery:{
          pageSize: 10,
          pageNumber: 1,
          orderType: 1,
          orderType:1,
          chargeType:null,
          projectId:null,
          updateUser:null,
          startTime:null,
          endTime:null
      },
      dialogVisible:false,
      dialogTitle:'新增',
      isDialogAdd:true,
      isDialogView:true,
      ruleForm: {
        functionId:null,
        functionName:null,
        charge: null,
        desc: null
      },
      multipleSelection: [],
      rules: {
        functionName: [
          {required: true, validator: checkFunctionName, trigger: 'blur' }
        ],
        charge: [
          {required: true, validator: checkCharge, trigger: 'blur' }
        ]
      },
      functionNameQueryVisible:false,
      functionNameQueryXY:[],
      chargeTypeQueryVisible:false,
      chargeTypeQueryXY:[],
      chargeQueryVisible:false,
      chargeQueryXY:[],
      updateUserQueryVisible:false,
      updateUserQueryXY:[],
      orderOrTimeQueryVisible:false,
      orderOrTimeQueryXY:[]
    }
  },
    created() {
      this.productManageProjectId =this.$route.query.id
      this.getBtnList()

      // if(projectId===undefined){
      //   this.getBtnList()
      // }else{
      //   this.getBtnList()
      // }
     
    },
    methods:{
      clickHandlerFunctionName(e){
        this.functionNameQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.functionNameQueryVisible =true
      },
      clickHandlerChargeType(e){
        this.chargeTypeQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.chargeTypeQueryVisible =true
      },
      clickHandlerCharge(e){
        this.chargeQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.chargeQueryVisible =true
      },
      clickHandlerUpdateUser(e){
        this.updateUserQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.updateUserQueryVisible =true
      },
      clickHandlerTime(e){
        this.orderOrTimeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.orderOrTimeQueryVisible =true
      },
     renderHeaderFunctionName(h, { column, $index }) {
       return this.handlerRenderHeader(h, {column, $index },'functionName')
     },
     renderHeaderChargeType(h, { column, $index }){
        return this.handlerRenderHeader(h, {column, $index },'chargeType')
     },
     renderHeaderCharge(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'charge')
     },
     renderHeaderUpdateUser(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'updateUser')
     },
     renderHeaderUpdateTime(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'updateTime')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='functionName'){
         func =this.clickHandlerFunctionName
       }else if(t==='chargeType'){
         func =this.clickHandlerChargeType
       }else if(t==='charge'){
         func =this.clickHandlerCharge
       }else if(t==='updateUser'){
         func =this.clickHandlerUpdateUser
       }else if(t==='updateTime'){
         func =this.clickHandlerTime
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
      changeList(id,index){
        this.$refs.btnGroup.$children.forEach(element => {
          element.$el.className ='el-button el-button--default el-button--mini'
        });
       this.$refs.btnGroup.$children[index].$el.className = 'el-button el-button--primary el-button--mini'
       this.listQuery.projectId =id
       this.getList() 
      },
     getBtnList(){
       let reqData={
        url:'/project/allList',
        params:{chargeType:null,photoFlag:null}
        }
      httpPost(reqData).then(res => {
        let {data} = res
        this.btnList =data
        
        setTimeout(() => {
          if(this.btnList.length>0){
            if(this.productManageProjectId===undefined){
              // 直接进入
              this.$refs.btnGroup.$children[0].$el.className = 'el-button el-button--primary el-button--mini'
              this.listQuery.projectId =this.btnList[0].projectId
            }else{
              // 在产品管理进入
              //根据this.productManageProjectId查询在this.btnList的坐标 projectId
              this.productManageProjectId =Number(this.productManageProjectId)
              this.btnList.forEach((value, index) => {
                if(value.projectId===this.productManageProjectId){
                  this.$refs.btnGroup.$children[index].$el.className = 'el-button el-button--primary el-button--mini'
                }
              });
              this.listQuery.projectId =this.productManageProjectId
            }
            this.getList()
          }
        }, 1.5 * 100)
      }).catch(err=>{
        console.log(err)
      })
     },
     getList() {
      this.listLoading = true

      let params =this.listQuery
      let reqData={
        url:'/function/list',
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
        console.log(err)
      })
    },
    handleFilter(params) {
      let {type} =params
      if(type==='functionName'){
        this.functionNameQueryVisible =false
        let functionName =null
        if(params.value!==null){
          let str =params.value.replace(/(^\s*)|(\s*$)/g,"")
          if(str.length!==0){
            functionName =str
          }
        }
        this.listQuery.functionName =functionName
      }else if(type==='chargeType'){
        this.chargeTypeQueryVisible =false
        this.listQuery.chargeType =params.value
        if(params.value==='radio_all'){
          this.listQuery.chargeType=null
        }
      }else if(type==='charge'){
        if(isNaN(params.value)){
          this.$message.warning('请输入数字');
          return
        }
        this.chargeQueryVisible =false
        this.listQuery.charge =Number(params.value)
      }else if(type==='updateUser'){
        this.updateUserQueryVisible =false
        this.listQuery.updateUser =params.value
      }else if(type==='updateTime'){//QueryTime
        this.orderOrTimeQueryVisible =false
        let sortOrder= params.sortOrder
        if(sortOrder==='asc'){
          this.listQuery.orderType =0
        }else if(sortOrder==='desc'){
          this.listQuery.orderType =1
        }
        let daterange =params.daterange
        
        if(daterange!==null&&daterange.length===2){
          this.listQuery.startTime =daterange[0]
          this.listQuery.endTime =daterange[1]
        }else{
          this.listQuery.startTime =null
          this.listQuery.endTime =null
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
    
    showDialog(id,formName,t){
      if(t==='edit'){
        this.dialogTitle='编辑'
        this.isDialogAdd=false
        this.isDialogView=false
      }else if(t==='view'){
        this.dialogTitle='查看'
        this.isDialogAdd=false
        this.isDialogView=true
      }else{
        this.dialogTitle='新增'
        this.isDialogAdd=true
        this.isDialogView=false
      }
      this.dialogVisible=true;
      if(this.$refs[formName]!==undefined){
        this.$refs[formName].resetFields();
      }
      if(t==='edit'||t==='view'){
        let reqData={
          url:'/function/info',
          params:{id}
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            functionId:data.functionId,
            functionName:data.functionName,
            charge:data.charge,
            desc:data.desc
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
            
            let url ='/function/save'
            if(this.isDialogAdd){
              params.functionId=null
            }else{
              if(params.functionId===null||!Number.isInteger(params.functionId)){
                this.$message.error('产品功能ID为空或不为数字');
                return
              }
              url ='/function/update'
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
          ids.push(element.projectId)
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
                url:'/function/remove',
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
<style lang="less" scoped>
.box{
    padding: 20px;
    .change-list{
      display: flex;
      justify-content: center;
      flex-wrap:wrap;
      .el-button{
        padding-left: 50px;
        padding-right: 50px;
      }
    }
   
    .el-form{
      .form-item-charge{
        /deep/.el-input{
          width: 257px;
        }
        .input-unit{
          margin-left: 5px;
        }
      }
    }
}
</style>


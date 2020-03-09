<template>
    <div class="box">
        <el-button-group>
            <el-button @click="showDialog(null,'ruleForm','add')" size="mini">新增</el-button>
            <el-button @click="deleteRows(null)" size="mini">批量删除</el-button>
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
                prop="templateCode"
                label="短信模板ID"
                min-width="90"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                label="是否默认"
                min-width="80"
                :render-header="renderHeaderDefaultFlag">
                <template slot-scope="scope">
                  <div v-if="scope.row.defaultFlag===0">否</div>
                  <div v-else>是</div>
                </template>
            </el-table-column>
            <el-table-column
                label="短信类型"
                min-width="90"
                :render-header="renderHeaderMessageType">
                <template slot-scope="scope">
                  <div v-if="scope.row.messageType===0">注册</div>
                  <div v-else-if="scope.row.messageType===1">找回密码</div>
                  <div v-else-if="scope.row.messageType===2">修改密码</div>
                  <div v-else-if="scope.row.messageType===3">修改手机号</div>
                  <div v-else>其它</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="signName"
                label="短信签名"
                min-width="100"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="expire"
                label="过期时间(s)"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注"
                min-width="80"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <i class="el-icon-edit" @click="showDialog(scope.row.templateId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <i class="el-icon-delete" @click="deleteRows(scope.row.templateId)" style="cursor:pointer"></i>
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
            <el-form-item label="短信类型:" >
                <el-select v-model="ruleForm.messageType" placeholder="请选择" size="mini">
                    <el-option label="注册" value="0"></el-option>
                    <el-option label="找回密码" value="1"></el-option>
                    <el-option label="修改密码" value="2"></el-option>
                    <el-option label="修改手机号" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="短信签名:" prop="signName">
                <el-input v-model="ruleForm.signName" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="短信模板ID:" prop="templateCode">
                <el-input v-model="ruleForm.templateCode" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="是否默认:">
              <el-switch
                v-model="ruleForm.defaultFlag"
                active-text="是"
                inactive-text="否">
              </el-switch>
            </el-form-item>
            <el-form-item label="过期时间(s):" prop="expire">
                <el-input v-model.number="ruleForm.expire" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="备注:">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="ruleForm.remark"
                 autocomplete="off"
                  size="mini">
                </el-input>
            </el-form-item>
            <el-form-item class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <query-one
        :p-dialog-visible="defaultFlagQueryVisible"
        :p-client-x-y="defaultFlagQueryXY"
        p-type="radioCustom"
         p-type-name="QueryDefaultFlag"
        :radio-items="[{value:0,label:'否'},{value:1,label:'是'}]"
        v-on:query="handleFilter"
        v-on:cancel="defaultFlagQueryVisible =false">
        </query-one>

        <query-one
        :p-dialog-visible="messageTypeQueryVisible"
        :p-client-x-y="messageTypeQueryXY"
        p-type="radioCustom"
         p-type-name="QueryMessageType"
        :radio-items="[{value:0,label:'注册'},{value:1,label:'找回密码'},{value:2,label:'修改密码'},{value:3,label:'修改手机号'}]"
        v-on:query="handleFilter"
        v-on:cancel="messageTypeQueryVisible =false">
        </query-one>

    </div>
</template>
<script>
import {httpPost} from '@/api/index'
import {validatChinese,validateURL} from '@/utils/validate'
import QueryOne from '@/components/QueryDialog/QueryOne'
export default {
  components:{
    QueryOne
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
            defaultFlag:null,
            messageType:null
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
        multipleSelection: [],
        rules: {
          signName: [
            {required: true, validator: checkSignName, trigger: 'blur' }
          ],
          templateCode: [
            {required: true, validator: checkTemplateCode, trigger: 'blur' }
          ],
          expire: [
            {required: true, validator: checkExpire, trigger: 'blur' }
          ]
        },
        defaultFlagQueryVisible:false,
        defaultFlagQueryXY:[],
        messageTypeQueryVisible:false,
        messageTypeQueryXY:[]
    }
  },
    created() {
      this.getList()
    },
    methods:{
      clickHandlerDefaultFlag(e){
        this.defaultFlagQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.defaultFlagQueryVisible =true
      },
      clickHandlerMessageType(e){
        this.messageTypeQueryXY=[(e.clientX -400),(e.clientY -95)]
        this.messageTypeQueryVisible =true
      },
      renderHeaderDefaultFlag(h, { column, $index }) {
       return this.handlerRenderHeader(h, {column, $index },'defaultFlag')
     },
     renderHeaderMessageType(h, { column, $index }){
        return this.handlerRenderHeader(h, {column, $index },'messageType')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='defaultFlag'){
         func =this.clickHandlerDefaultFlag
       }else if(t==='messageType'){
         func =this.clickHandlerMessageType
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
        url:'/messageTemplate/list',
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
      if(type==='QueryDefaultFlag'){
        this.defaultFlagQueryVisible =false
        this.listQuery.defaultFlag =params.value
        if(params.value==='radio_all'){
          this.listQuery.defaultFlag=null
        }
      }else if(type==='QueryMessageType'){
        this.messageTypeQueryVisible =false
        this.listQuery.messageType =params.value 
        if(params.value==='radio_all'){
          this.listQuery.messageType=null
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
          ids.push(element.templateId)
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
                url:'/messageTemplate/remove',
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


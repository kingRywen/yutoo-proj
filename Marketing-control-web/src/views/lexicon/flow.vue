<template>
    <div class="box">
        <el-button-group>
            <el-button @click="showDialog(null,'ruleForm','add')">新增</el-button>
            <el-button @click="deleteRows(null)">批量删除</el-button>
        </el-button-group>

        <el-table
        :data="list"
        v-loading="listLoading"
        :key='tableKey'
        style="width: 100%"
        tooltip-effect="light"
        height="700"
        :header-cell-style="{background:'#f4f4f6'}"
        @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
                prop="templateCode"
                label="关键词"
                min-width="90"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="搜索量">
                <el-table-column
                    label="Google"
                    min-width="80">
                    <template slot-scope="scope">
                    <div v-if="scope.row.defaultFlag===0">否</div>
                    <div v-else>是</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="更新时间"
                    min-width="80">
                    <template slot-scope="scope">
                    <div v-if="scope.row.defaultFlag===0">否</div>
                    <div v-else>是</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="速卖通"
                    min-width="80">
                    <template slot-scope="scope">
                    <div v-if="scope.row.defaultFlag===0">否</div>
                    <div v-else>是</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="更新时间"
                    min-width="80">
                    <template slot-scope="scope">
                    <div v-if="scope.row.defaultFlag===0">否</div>
                    <div v-else>是</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="signName"
                    label="merchantwords"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="signName"
                    label="更新时间"
                    min-width="100"
                    show-overflow-tooltip>
                </el-table-column>
            </el-table-column>

            
            <!-- <el-table-column
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
            </el-table-column> -->
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
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

    </div>
</template>
<script>
import {httpPost} from '@/api/index'
import {validatChinese,validateURL} from '@/utils/validate'
export default {
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
            { validator: checkSignName, trigger: 'blur' }
          ],
          templateCode: [
            { validator: checkTemplateCode, trigger: 'blur' }
          ],
          expire: [
            { validator: checkExpire, trigger: 'blur' }
          ]
        } 
    }
  },
    created() {
      this.getList()
    },
    methods:{
      
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
    handleFilter() {
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
.box{
    padding: 20px;
    .el-table{
        margin-top: 20px;
        border: 1px solid #d7d7d7;
        border-radius:6px;
        
    }
    /deep/.el-pagination{
      padding: 5px;
      display: flex;
      justify-content: flex-end;
    }
    /deep/.is-background{
      border: 1px solid #d7d7d7;
      border-radius:6px;
      background-color: #ffffff;
    }
    /deep/.el-dialog__body{
       background-color: #f5f4fa;
    }
    /deep/ .el-form{
      padding: 32px 10px 10px 10px;
      background-color: #ffffff;
      border: 1px dashed #d7d7d7;
      border-radius:6px;
    }
}
</style>


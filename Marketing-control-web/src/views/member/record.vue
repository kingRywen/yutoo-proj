<template>
    <div class="box">
        <div class="user-info_add-btn">
            <div class="user-info">{{merchantName}} 消费记录</div>
            <el-button @click="showDialog(null,'ruleForm','add')" icon="el-icon-download" type="primary" size="mini">下载</el-button>
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
            <el-table-column
                prop="createTime"
                label="时间"
                min-width="90"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="unit"
                label="消费类型 可能有错"
                min-width="100"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="useNumber"
                label="数量 可能有错"
                min-width="100">
            </el-table-column>
            <el-table-column
                prop="charge"
                label="消耗额度"
                min-width="80"
                show-overflow-tooltip>
            </el-table-column>
            <!-- <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="查看消费记录" placement="top">
                  <i class="el-icon-view" @click="selectRecord(scope.row.merchantPackageId)" style="cursor:pointer"></i>
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
      merchantName:null,  
      tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        listQuery:{
            pageSize: 10,
            pageNumber: 1,
            sortOrder: 'asc',
            merchantPackageId:null
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
        } 
    }
  },
    created() {
      let routeQuery = this.$route.query
      let merchantPackageId =routeQuery.merchantPackageId
      this.listQuery.merchantPackageId =Number(merchantPackageId)
      this.merchantName =routeQuery.merchantName
      this.getList()
    },
    methods:{
      
     getList() {
      this.listLoading = true

      let params =this.listQuery
      let reqData={
        url:'/merchantPackageRec/list',
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
      this.$message.error('不要问我，我不知道！');
      return
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
    selectRecord(merchantPackageId){
         this.$router.push({
        path: '/member/record',
        query: {
          merchantPackageId
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
    .user-info_add-btn{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .user-info{
            color: #30cc7b;
            font-size: 28px;
        }
    }
}
</style>


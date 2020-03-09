<template>
    <div class="box">
        <div class="handle">
          <div class="query">
            <el-input v-model="listQuery.username" placeholder="请输入查询关键字" size="mini"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleFilter" size="mini">查询</el-button>
          </div>
          <el-button-group>
            <el-button @click="showDialog(null,'ruleForm','add')" size="mini">新增</el-button>
            <el-button @click="deleteRows(null)" size="mini">删除</el-button>
          </el-button-group>
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
        :cell-style="{paddingTop:'8px',paddingBottom:'8px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
            <el-table-column
                prop="userId"
                label="编号"
                width="90"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="username"
                label="用户名"
                width="120"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="orgName"
                label="所属机构"
                width="90">
            </el-table-column>
            <el-table-column
                prop="email"
                label="邮箱"
                min-width="180"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="mobile"
                label="手机号"
                min-width="130"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态"
                width="80">
                <template slot-scope="scope">
                  <el-switch
                    v-model="statusModel['userId_'+scope.row.userId]"
                    @change="changeStatus(scope.row.userId)">
                  </el-switch>
              </template>
            </el-table-column>
            <el-table-column
                prop="gmtCreate"
                label="创建时间"
                min-width="160">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注"
                min-width="120"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="操作"
              width="100">
              <template slot-scope="scope">
                  <div class="set-el-icon">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <i class="el-icon-edit" @click="showDialog(scope.row.userId,'ruleForm','edit')"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="重置密码" placement="top">
                      <i class="el-icon-edit-outline" @click="showDialog(scope.row.userId,'restPwdRuleForm','rest')"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <i class="el-icon-delete" @click="deleteRows(scope.row.userId)"></i>
                    </el-tooltip>
                  </div>
                  
              </template>
            </el-table-column>
        </el-table>

         <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-dialog
          :title="dialogTitle"
          :visible.sync="outerVisible"
          width="430px">
          <el-dialog
            width="270px"
            title="选择机构"
            :visible.sync="innerVisible"
            append-to-body
            class="inner-dialog">

              <el-tree :data="orgDataTree" 
                :props="defaultProps" 
                @node-click="nodeClick"
                class="org-tree" 
                node-key="orgId" 
                ref="tree"
                highlight-current
                :check-strictly="true">
              </el-tree>

              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setParentId()" size="mini">确定</el-button>
                <el-button @click="innerVisible = false" size="mini">取 消</el-button>
              </div>
            </el-dialog>
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="用户名:" prop="username">
                <el-input v-model="ruleForm.username" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password" v-if="isDialogAdd">
                <el-input v-model="ruleForm.password" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="所属机构:" prop="orgName" class="form-item-org-name">
                <el-input v-model="ruleForm.orgName" :disabled="true" size="mini"></el-input>
                <el-button @click="showOrgDialog" size="mini">选择机构</el-button>
            </el-form-item>
            <el-form-item label="角色:" prop="roleIdList">
                <el-select
                  v-model="ruleForm.roleIdList"
                  multiple
                  collapse-tags
                  style="width: 300px;"
                  placeholder="请选择"
                   size="mini">
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号:" prop="mobile">
                <el-input v-model.number="ruleForm.mobile" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model.number="ruleForm.email" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
                <el-input v-model.number="ruleForm.remark" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
              <el-switch
                v-model="ruleForm.status"
                active-text="正常"
                inactive-text="禁用">
              </el-switch>
            </el-form-item>
            <el-form-item class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog
          title="重置密码"
          :visible.sync="dialogVisible"
          width="400px">
          <el-form :model="restPwdRuleForm" status-icon :rules="restPwdRules" ref="restPwdRuleForm" label-width="70px">
            <el-form-item label="用户名:" prop="password">
                <el-input v-model="restPwdRuleForm.password"></el-input>
            </el-form-item>
            <el-form-item class="form-item-btn">
              <el-button type="primary" @click="submitForm('restPwdRuleForm')">提交</el-button>
              <el-button @click="resetForm('restPwdRuleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
    </div>
</template>
<script>
import {httpPost,httpGet} from '@/api/index'
import {validatChinese,validatMobile,validatEmail} from '@/utils/validate'
import {listToTree} from '@/utils'
export default {
  data() {
      let checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入用户名'));
        }else{
            callback();
        }
      };
      let checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码名'));
        }
        setTimeout(() => {
          if (!validatChinese(value)) {
            callback(new Error('请输入英文或数字或其它字符'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkOrgName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请选择所属机构'));
        }else{
            callback();
        }
      };

      let checkRoleIdList = (rule, value, callback) => {
        if (value.length===0) {
          return callback(new Error('请选择角色'));
        }else{
            callback();
        }
      };
      let checkMobile = (rule, value, callback) => {
        if (!value) {
          callback();
        }else{
            setTimeout(() => {
              if (!validatMobile(value)) {
                callback(new Error('请输入合法手机号'));
              } else {
                callback();
              }
            }, 1000);
        }
      };
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          callback();
        }else{
            setTimeout(() => {
              if (!validatEmail(value)) {
                callback(new Error('请输入合法邮箱'));
              } else {
                callback();
              }
            }, 1000);
        }
      };

      
    return{
      tableKey: 0,
        list: null,
        total: null,
        listLoading: false,
        statusModel: {},
        listQuery:{
            pageSize: 10,
            pageNumber: 1,
            sortOrder: 'asc',
            username:null
        },
        outerVisible:false,
        innerVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        roleList:[],
        ruleForm: {
          userId:null,
          username:null,
          password: null,
          orgId:null,
          orgName: null,
          roleIdList:[],
          mobile:null,
          email:null,
          remark:null,
          status:true
        },
        rules: {
          username: [
            {required: true, validator: checkUsername, trigger: 'blur' }
          ],
          password: [
            {required: true, validator: checkPassword, trigger: 'blur' }
          ],
          orgName: [
            {required: true, validator: checkOrgName, trigger: 'blur' }
          ],
          roleIdList: [
            {required: true, validator: checkRoleIdList, trigger: 'blur' }
          ],
          mobile: [
            { validator: checkMobile, trigger: 'blur' }
          ],
          email: [
            { validator: checkEmail, trigger: 'blur' }
          ]
        },
        multipleSelection: [],
        orgDataTree:[],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        tmp:{
          orgId:null,
          name:null
        },

        dialogVisible:false,
        restPwdRuleForm:{
          userId:null,
          password:null
        },
        restPwdRules: {
          password: [
              {required: true, validator: checkPassword, trigger: 'blur' }
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
        url:'/sys/user/list',
        params
      }
      httpPost(reqData).then(res => {
        let {rows, total} = res
        rows.forEach(element => {
          let b =element.status===0?false:true
          this.statusModel['userId_'+element.userId]=b
        });
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
      let username =this.listQuery.username
      if(username!==null){
        if(username.trim().length===0){
          this.listQuery.username =null
        }
      }else{
        return
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
    changeStatus(userId){
      let url ='/sys/user/disable'
      if(this.statusModel['userId_'+userId]){
        url ='/sys/user/enable'
      }
      let reqData={
        url,
        params:[userId]
      }
      httpPost(reqData).then(res => {
        let {msg} =res
        this.$message.success(msg);
        this.getList()
      })
    },
    showDialog(id,formName,t){
      if(formName==='restPwdRuleForm'){
        this.restPwdRuleForm.userId =id
        this.dialogVisible=true;
        
        if(this.$refs[formName]!==undefined){
          this.$refs[formName].resetFields();
        }
      }else{
        if(t==='edit'){
          this.dialogTitle='编辑'
          this.isDialogAdd=false
        }else{
          this.dialogTitle='新增'
          this.isDialogAdd=true
        }
        this.outerVisible=true;
        if(this.$refs[formName]!==undefined){
          this.$refs[formName].resetFields();
        }
        // 获取角色
        let reqData={
          url:'/sys/role/select'
        }
        httpGet(reqData).then(res => {
          let {data} =res
          this.roleList =data
        })

        if(t==='edit'){
          let reqData={
            url:'/sys/user/infoUser',
            params:id
          }
          httpPost(reqData).then(res => {
            let {data} =res
            this.ruleForm= {
              userId:data.userId,
              username:data.username,
              password:null,
              orgId:data.orgId,
              orgName:data.orgName,
              roleIdList:data.roleIdList,
              mobile:data.mobile,
              email:data.email,
              remark:data.remark,
              status:data.status===0?false:true,
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      }
    },
    showOrgDialog(){
      let reqData={
        url:'/sys/org/select'
        }
        httpPost(reqData).then(res => {
          this.orgDataTree =listToTree("orgId","parentId",res)
          this.innerVisible = true
          
          if(this.isDialogAdd){
            if(this.$refs.tree!==undefined){
                this.$refs.tree.setCurrentKey(null)
            }
          }else{
            // 这里只展开一个父级，要展开的有的父级
            if(this.$refs.tree===undefined){
                this.setExpanded()
            }else{
                 
                this.setExpanded()
            }
          }
        }).catch(err=>{
          console.log(err)
        })
     
    },
    setExpanded(){
      setTimeout(() => {

        let parentOrgId = this.$refs.tree.getNode(this.tmp.orgId).parent.data.orgId
        if(parentOrgId!==undefined){
          // 获取所有父节点
          let treeArr =[parentOrgId]
          while (true){
            parentOrgId = this.$refs.tree.getNode(parentOrgId).parent.data.orgId
            if(parentOrgId===undefined){
              break;
            }
            treeArr.unshift(parentOrgId)
          }
          //最后一个节点不展开
          for (let index = 0; index < (treeArr.length-1); index++) {
            const element = treeArr[index]
            this.$refs.tree.store.nodesMap[element].expanded =true
          }
         
          this.$refs.tree.setCurrentKey(this.tmp.parentId)
        
         }
      }, 500);
      
    },
    nodeClick(item, node, self){
      this.tmp.orgId =item.orgId
      this.tmp.name =item.name
		},
    setParentId(){
      this.ruleForm.orgId =this.tmp.orgId
      this.ruleForm.orgName =this.tmp.name
      this.innerVisible = false
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url ='/sys/user/reset'
            let params =this.restPwdRuleForm
            let reqData={url,params}
            if(formName==='restPwdRuleForm'){
              httpPost(reqData).then(res => {
                let {msg} =res
                this.$message.success(msg)
                this.dialogVisible=false
              }).catch(err=>{
                console.log(err)
              })
            }else{
              this.outerVisible=false
              params =this.ruleForm
              if(params.status){
                params.status=1
              }else{
                params.status=0
              }
              url ='/sys/user/save'
              if(this.isDialogAdd){
                params.userId=null
              }else{
                if(params.userId===null||!Number.isInteger(params.userId)){
                  this.$message.error('用户ID为空或不为数字');
                  return
                }
                url ='/sys/user/update'
              }
              reqData={url,params}

              httpPost(reqData).then(res => {
                let {msg} =res
                this.$message.success(msg);
                this.getList()
              }).catch(err=>{
                console.log(err)
              })
            }
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
        params=[id]
      }else{
        if(this.multipleSelection.length===0){
          this.$message.info('请至少选一项');
          return
        }
        let ids=[]
        this.multipleSelection.forEach(element => {
          ids.push(element.userId)
        });
        confirmTitle ='此操作为批量删除, 是否继续?'
        params=ids
      }
      this.$confirm(confirmTitle, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let reqData={
                url:'/sys/user/remove',
                params
            }
            httpPost(reqData).then(res => {
              let {msg} =res
              this.$message.success(msg);
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
   
    .handle{
      display: flex;
      justify-content: space-between;
      /deep/.el-input{
        width: 250px;
      }

    }
    
    .set-el-icon{
      .el-icon-edit,
      .el-icon-edit-outline,
      .el-icon-delete{
        cursor:pointer;
        font-size:16px;
        font-weight: bold;
      }
      .el-icon-edit{
        color:#7eb561;
      }
      .el-icon-edit-outline{
        color:#599ec5;
      }
      .el-icon-delete{
        color:#F56C6C;
      }
  }
    .form-item-org-name{
      /deep/.is-disabled{
        width: 216px;
      }
    }
}
.inner-dialog{
    /deep/.el-dialog__header{
      border-bottom: 1px solid #d7d7d7;
    }
    /deep/.el-dialog__body{
      padding: 30px 20px 10px 20px;
    }
    /deep/.el-tree{
      height: 350px;
      overflow-y:auto;
    }
}
</style>


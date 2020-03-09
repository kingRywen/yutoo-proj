<template>
    <div class="box">
        <div class="handle">
          <div class="query">
            <el-input v-model="listQuery.roleName" placeholder="请输入查询关键字" size="mini"></el-input>
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
              prop="roleId"
              label="编号"
              width="90"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="roleName"
              label="角色名称"
              min-width="90"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="roleSign"
              label="角色标志"
              min-width="90"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="orgName"
              label="所属机构"
              min-width="90"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="remark"
              label="备注"
              min-width="120"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="gmtCreate"
              label="创建时间"
              min-width="160"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
                <div class="set-el-icon">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit" @click="showDialog(scope.row.roleId,'ruleForm','edit')"></i>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <i class="el-icon-delete" @click="deleteRows(scope.row.roleId)"></i>
                  </el-tooltip>
                  <el-popover
                    placement="left">
                        <el-button size="mini" icon="el-icon-setting" @click="showHandleRolesDialog(scope.row.roleId)">操作权限</el-button>
                        <el-button size="mini" icon="el-icon-view" @click="showDataRolesDialog(scope.row.roleId)">数据权限</el-button>
                      <i class="el-icon-edit-outline" slot="reference"></i>
                  </el-popover>
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
            <el-form-item label="角色名称:" prop="roleName">
               <el-input v-model="ruleForm.roleName" autocomplete="off" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="角色标识:" prop="roleSign">
                <el-input v-model="ruleForm.roleSign" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="所属机构:" prop="orgName" class="form-item-org-name">
                <el-input v-model="ruleForm.orgName" :disabled="true" size="mini"></el-input>
                <el-button @click="showOrgDialog" size="mini">选择机构</el-button>
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



        <el-dialog
          title="操作权限"
          :visible.sync="handleRolesVisible"
          width="270px"
          class="tree-dialog">
            <el-tree :data="handleRolesDataTree" 
                :props="defaultProps" 
                class="org-tree"
                show-checkbox
                node-key="menuId" 
                ref="menuTree"
                default-expand-all>
              </el-tree>

              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="authorizeOptOrData('opt')" size="mini">确定</el-button>
                <el-button @click="handleRolesVisible = false" size="mini">取 消</el-button>
              </div>
        </el-dialog>

        <!--
          注意 当选中子节点时，父节点不能自动选中；父节点只能手动选中
          通过 :check-strictly="true" 实现
        -->
        <el-dialog
          title="数据权限"
          :visible.sync="dataRolesVisible"
          width="270px"
          class="tree-dialog">
            <el-tree :data="dataRolesDataTree" 
                :props="defaultProps" 
                class="org-tree" 
                show-checkbox
                node-key="orgId" 
                ref="orgTree"
                :check-strictly="true"
                default-expand-all>
              </el-tree>

              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="authorizeOptOrData('data')" size="mini">确定</el-button>
                <el-button @click="dataRolesVisible = false" size="mini">取 消</el-button>
              </div>
        </el-dialog>

    </div>
</template>
<script>
import {httpPost} from '@/api/index'
import {validatChinese} from '@/utils/validate'
import {listToTree} from '@/utils'
export default {
  data() {
      let checkRoleName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入角色名称'));
        }else{
            callback();
        }
      };
      let checkSignName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入角色标识'));
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
            roleName:null
        },
        outerVisible:false,
        innerVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        ruleForm: {
          roleId:null,
          roleName:null,
          roleSign:null,
          orgId:null,
          orgName: null,
          remark: null
        },
        rules: {
          roleName: [
            {required: true, validator: checkRoleName, trigger: 'blur' }
          ],
          roleSign: [
            {required: true, validator: checkSignName, trigger: 'blur' }
          ],
          orgName: [
            {required: true, validator: checkOrgName, trigger: 'blur' }
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
        handleRolesVisible:false,
        handleRolesDataTree:[],
        dataRolesVisible:false,
        dataRolesDataTree:[],
        authorize:{
          roleId:null
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
        url:'/sys/role/list',
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
      
      let roleName =this.listQuery.roleName
      if(roleName!==null){
        if(roleName.trim().length===0){
          this.listQuery.roleName =null
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
    
    showDialog(id,formName,t){
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
      if(t==='edit'){
        let reqData={
          url:'/sys/role/info',
          params:id
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            roleId:data.roleId,
            roleName:data.roleName,
            roleSign:data.roleSign,
            orgId:data.orgId,
            orgName:data.orgName,
            remark:data.remark
          }
        }).catch(err=>{
          console.log(err)
        })
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
            this.outerVisible=false
            let params =this.ruleForm
            
            let url ='/sys/role/save'
            if(this.isDialogAdd){
              params.roleId=null
            }else{
              if(params.roleId===null||!Number.isInteger(params.roleId)){
                this.$message.error('角色ID为空或不为数字');
                return
              }
              url ='/sys/role/update'
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
        params=[id]
      }else{
        if(this.multipleSelection.length===0){
          this.$message.info('请至少选一项');
          return
        }
        let ids=[]
        this.multipleSelection.forEach(element => {
          ids.push(element.roleId)
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
                url:'/sys/role/remove',
                params
            }
            httpPost(reqData).then(res => {
              let {msg} =res
              this.$message.success(msg)
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
    },

    showHandleRolesDialog(roleId){

      let reqData={
        url:'/sys/menu/list'
        }
        httpPost(reqData).then(res => {
          this.handleRolesDataTree =listToTree("menuId","parentId",res)
          this.getRoleInfo(roleId,'menu')
          this.handleRolesVisible =true
          this.authorize.roleId =roleId
        }).catch(err=>{
          console.log(err)
        })
        
    },
    
    showDataRolesDialog(roleId){
      let reqData={
        url:'/sys/org/list'
        }
        httpPost(reqData).then(res => {
          this.dataRolesDataTree =listToTree("orgId","parentId",res)
          this.getRoleInfo(roleId,'org')
          this.dataRolesVisible =true
          this.authorize.roleId =roleId
        }).catch(err=>{
          console.log(err)
        })
    },
    getRoleInfo(roleId,t){
      
      let reqData={
          url:'/sys/role/info',
          params:roleId
        }
        httpPost(reqData).then(res => {
          let {data} =res
          if(t==='menu'){
            this.$refs.menuTree.setCheckedKeys(data.menuIdList);
          }else if(t==='org'){
            this.$refs.orgTree.setCheckedKeys(data.orgIdList);
          }
        }).catch(err=>{
          console.log(err)
        })
    },
    authorizeOptOrData(t){
      this.$confirm('您确定要保存当前数据项修改操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let url ='sys/role/authorize/opt'
            let params={roleId: this.authorize.roleId}
            
            if(t==='opt'){
              let menuIdList =this.$refs.menuTree.getCheckedKeys();
              params.menuIdList =menuIdList
            }else if(t==='data'){
              url='/sys/role/authorize/data'
              let orgIdList =this.$refs.orgTree.getCheckedKeys();
              params.orgIdList =orgIdList
            }
            let reqData={
                url,
                params
            }
            httpPost(reqData).then(res => {
              let {msg} =res
              this.$message.success(msg)
              if(t==='opt'){
                this.handleRolesVisible =false
              }else if(t==='data'){
                this.dataRolesVisible =false
              }
            }).catch(err=>{
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });       
        })
    },
    
    
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
      .el-icon-delete,
      .el-icon-edit-outline{
        cursor:pointer;
        font-size:16px;
        font-weight: bold;
      }
      .el-icon-edit{
        color:#7eb561;
      }
      .el-icon-delete{
        color:#F56C6C;
      }
      .el-icon-edit-outline{
        color:#599ec5;
      }
  }
    .form-item-org-name{
      /deep/.is-disabled{
        width: 210px;
      }
    }
}

</style>


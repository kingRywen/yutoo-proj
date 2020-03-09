<template>
  <div class="box">

    <el-button-group>
        <el-button @click="showDialog(null,'ruleForm','add')" size="mini">新增</el-button>
        <el-button @click="deleteRows(null)" size="mini">删除</el-button>
    </el-button-group>
    

    <tree-table :data="treeList" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border 
    class="organization-tree-table"
    v-on:handleSelectionChange="handleSelectionChange">
      <el-table-column
        prop="code"
        label="机构编码"
        min-width="90"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="parentName"
        label="上级机构"
        min-width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="可用"
        width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="statusModel['orgId_'+scope.row.orgId]"
              @change="changeStatus(scope.row.orgId)">
            </el-switch>
         </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序"
        min-width="90"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="orgId"
        label="操作"
        min-width="90"
        show-overflow-tooltip>
          <template slot-scope="scope">
              <div class="set-el-icon">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                   <i class="el-icon-edit-outline" @click="showDialog(scope.row,'ruleForm','edit')"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">  
                  <i class="el-icon-delete" @click="deleteRows(scope.row.orgId)"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="添加" placement="top">
                  <i class="el-icon-circle-plus-outline" @click="showDialog(scope.row,'ruleForm','add')"></i>
                </el-tooltip>
              </div>
         </template>
      </el-table-column>
     
    </tree-table>

    <el-dialog :title="dialogTitle" width="390px" :visible.sync="outerVisible">
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
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="85px">
            <el-form-item label="机构名称:" prop="name">
             <el-input v-model="ruleForm.name" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="机构编码:" prop="code">
             <el-input v-model="ruleForm.code" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="上级机构:" prop="parentName" class="form-item-org">
             <el-input v-model="ruleForm.parentName" :disabled="true" size="mini"></el-input>
             <el-button @click="showOrgDialog" size="mini">选择机构</el-button>
            </el-form-item>
            <el-form-item label="排序:" prop="orderNum">
             <el-input v-model.number="ruleForm.orderNum" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="可用:">
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
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import treeToArray from './customEval'
import {httpPost} from '@/api'
import {listToTree} from '@/utils'
import {validatChinese} from '@/utils/validate'
export default {
  name: 'customTreeTableDemo',
  components: { treeTable },
  data() {
    let checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('机构名称不能为空'));
        }else{
            callback();
        }
      };
      let checkCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('机构编码不能为空'));
        }
        setTimeout(() => {
          if (!validatChinese(value)) {
            callback(new Error('请输入英文或数字或其它字符'));
          } else {
            callback();
          }
        }, 1000);
      };
      let checkParentName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('上级机构不能为空'));
        }else{
            callback();
        }
      };
      let checkOrderNum = (rule, value, callback) => {
        if (!value) {
          callback();
        }else{
          setTimeout(() => {
            if (!Number.isInteger(value)) {
              callback(new Error('请输入数字值'));
            } else {
              callback();
            }
          }, 1000);
        }
      };
    return {
      func: treeToArray,
      expandAll: false,
      args: [null, null, 'timeLine'],
      treeList:null,
      statusModel: {},
      
      outerVisible: false,
      innerVisible: false,
      dialogTitle:'新增',
      dialogType:1, // 1 新增 2 新增(在记录行上) 3 修改
      ruleForm: {
        orgId:null,
        code:null,
        layer:1,
        name:null,
        orderNum:null,
        parentId:null,
        parentName:null,
        status:true
      },
      multipleSelection: [],
      rules: {
        name: [
            {required: true, validator: checkName, trigger: 'blur' }
          ],
        code: [
          {required: true, validator: checkCode, trigger: 'blur' }
        ],
        parentName: [
          {required: true, validator: checkParentName, trigger: 'blur' }
        ],
        orderNum: [
          { validator: checkOrderNum, trigger: 'blur' }
        ],
      },
      tmp:{
        orgId:null,
        name:null,
        parentId:null
      },
      orgDataTree:[],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created(){
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      let reqData={
        url:'/sys/org/list'
      }
      httpPost(reqData).then(res => {
        res.forEach(element => {
          let b =element.status===0?false:true
          this.statusModel['orgId_'+element.orgId]=b
        });
        this.treeList =listToTree("orgId","parentId",res)
      }).catch(err=>{
        console.log(err)
      })
    },
    changeStatus(orgId){
      let status =0
      if(this.statusModel['orgId_'+orgId]){
        status =1
      }
      let params={
        orgId,
        status
      }
      let reqData={
        url:'/sys/org/update',
        params
      }
      httpPost(reqData).then(res => {
          let {msg} =res
          this.$message.success(msg);
          this.getList()
      }).catch(err=>{
        console.log(err)
      })
    },
    showDialog(obj,formName,t){
       if(t==='edit'){
          this.dialogTitle='编辑'
          this.dialogType=3
        }else{
          this.dialogTitle='新增'
          this.dialogType=1
          this.ruleForm.status =true
        }
      this.outerVisible =true
      // if(array===null||array.length===1){
          if(this.$refs[formName]!==undefined){
            this.$refs[formName].resetFields();
          }
      // }
      if(t==='edit'){
        let reqData={
          url:'/sys/org/info',
          params:obj.orgId
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            orgId:data.orgId,
            code:data.code,
            name:data.name,
            orderNum:data.orderNum,
            parentId:data.parentId,
            parentName:data.parentName,
            status:data.status===0?false:true
          }
          if(data.parentId===0){
            this.ruleForm.parentName='一级机构'
          }
        }).catch(err=>{
          console.log(err)
        })
      }else{
        if(obj!==null){
          this.dialogType=2 
        }
      }
      if(t==='edit'||obj!==null){
          this.tmp.orgId =obj.orgId
          this.tmp.name =obj.name
          this.tmp.parentId =obj.parentId

          this.ruleForm.parentId =obj.orgId
          
          this.ruleForm.parentName =obj.parentName
          if(obj.parentId===0){
            this.ruleForm.parentName='一级机构'
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
          
          if(this.dialogType===1){
            if(this.$refs.tree!==undefined){
                this.$refs.tree.setCurrentKey(null)
            }
          }else if(this.dialogType===2||this.dialogType===3){
            // 这里只展开一个父级，要展开的有的父级
            if(this.$refs.tree===undefined){
                this.setExpanded()
            }else{
                  // this.$refs.tree.store.nodesMap[this.tmp.parentId].expanded =true
                  // // this.$refs.tree.setCurrentKey(this.tmp.orgId)
                  // this.$refs.tree.setCurrentKey(this.tmp.parentId)
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
          // this.$refs.tree.setCurrentKey(this.tmp.orgId)
          this.$refs.tree.setCurrentKey(this.tmp.parentId)
        
         }
      }, 500);
      
    },
    nodeClick(item, node, self){
      this.tmp.orgId =item.orgId
      this.tmp.name =item.name
      this.tmp.parentId =item.parentId
		},
    setParentId(){
      this.ruleForm.parentId =this.tmp.orgId
      this.ruleForm.parentName =this.tmp.name
      this.innerVisible = false
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.outerVisible=false
            let params =this.ruleForm
            if(params.status){
              params.status=1
            }else{
              params.status=0
            }
            let url ='/sys/org/save'
            if(this.dialogType===1||this.dialogType===2){
              params.orgId=null
            }else{
              if(params.orgId===null||!Number.isInteger(params.orgId)){
                this.$message.error('组织机构ID为空或不为数字');
                return
              }
              url ='/sys/org/update'
            }
            let reqData={
                url,
                params
            }
            httpPost(reqData).then(res => {
              let {msg} =res
              this.$message.success(msg);
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
      this.ruleForm.status =true
      this.ruleForm.parentName =null
    },
    deleteRows(id){
      let confirmTitle ='此操作为删除, 是否继续?'
      let ids=[]
      if(id!==null){
        ids.push(id)
      }else{
        if(this.multipleSelection.length===0){
          this.$message.info('请至少选一项');
          return
        }
        this.multipleSelection.forEach(element => {
          ids.push(element.orgId)
        });
        confirmTitle ='此操作为批量删除, 是否继续?'
      }
      
      this.$confirm(confirmTitle, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let reqData={
                url:'/sys/org/remove',
                params:ids
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
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    
  }
}
</script>
<style lang="less" scoped>
  @import '../../styles/page-default';
</style>
<style lang="less" scoped>
.box{
    .el-form{
      .form-item-org{
        /deep/.is-disabled{
          width: 180px;
        }
      }
    }
    
  

  .set-el-icon{
    .el-icon-edit-outline,
    .el-icon-delete,
    .el-icon-circle-plus-outline{
      cursor:pointer;
      font-size:16px;
      font-weight: bold;
      
    }
    .el-icon-edit-outline{
      color:#E6A23C;
    }
    .el-icon-delete{
      color:#F56C6C;
    }
    .el-icon-circle-plus-outline{
      color:#67C23A;
    }
  }

}

</style>


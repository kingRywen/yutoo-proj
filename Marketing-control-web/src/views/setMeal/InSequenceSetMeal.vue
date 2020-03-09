<template>
    <div class="box">
        <el-button-group>
            <el-button @click="showDialog(null,'ruleForm','add')" size="mini">添加套餐</el-button>
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
                prop="packageId"
                label="序号"
                min-width="80"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="packageName"
                label="套餐名称"
                min-width="90"
                show-overflow-tooltip
                :render-header="renderHeaderPackageName">
            </el-table-column>
            <el-table-column
                label="套餐产品"
                min-width="90"
                :formatter="formatterProject"
                show-overflow-tooltip
                :render-header="renderHeaderProjectName">
            </el-table-column>
            <el-table-column
                prop="duration"
                label="套餐点数"
                min-width="90"
                :render-header="renderHeaderDuration">
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
                label="状态"
                min-width="90"
                :render-header="renderHeaderStatus">
                <template slot-scope="scope">
                  <div v-if="scope.row.status===0" style="color:red;"><i class="el-icon-close"></i></div>
                  <div v-else style="color:red;"><i class="el-icon-check"></i></div>
                </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <i class="el-icon-edit" @click="showDialog(scope.row.packageId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="查看" placement="top">
                    <i class="el-icon-view" @click="showDialog(scope.row.packageId,'ruleForm','view')" style="cursor:pointer"></i>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="复制添加" placement="top">
                    <i class="el-icon-circle-plus-outline" @click="copy(scope.row.packageId)" style="cursor:pointer"></i>
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
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="130px">
            <el-form-item label="套餐名称:" prop="packageName">
                <el-input v-model.number="ruleForm.packageName" autocomplete="off" :disabled="isDialogView" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="图标:" class="form-item-upload">
              <el-upload
                class="upload-box"
                action="https://httpbin.org/post"
                :on-change="handleChange"
                :file-list="fileList"
                list-type="picture">
                <el-button size="mini" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="选择产品:" prop="projectId">
              <el-radio-group v-model="ruleForm.projectId">
                <el-radio v-for="item in projectAllList" :label="item.projectId" :key="item.projectId" :disabled="isDialogView">{{item.projectName}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--
              值为空 未开通图片空间
              传值 开通图片空间
            -->
            <el-form-item label="是否开通图片空间:">
                <el-switch
                v-model="projectId.flag"
                active-text="开通"
                inactive-text="不开通"
                :disabled="isDialogView">
              </el-switch>
            </el-form-item>
            <el-form-item label="套餐点数:" class="form-item-duration" prop="duration">
              <el-input v-model.number="ruleForm.duration" autocomplete="off" :disabled="isDialogView" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="费用:" prop="charge">
                <el-input v-model.number="ruleForm.charge" autocomplete="off" :disabled="isDialogView" size="mini"></el-input>
            </el-form-item>
             <el-form-item label="图片空间:" prop="capacity" class="form-item-capacity" v-if="projectId.flag">
                <el-input v-model.number="ruleForm.capacity" autocomplete="off" :disabled="isDialogView" size="mini"></el-input>
                <span class="input-unit">M</span>
            </el-form-item>
            <el-form-item label="是否激活:">
                <el-switch
                v-model="ruleForm.status"
                active-text="是"
                inactive-text="否"
                :disabled="isDialogView">
              </el-switch>
            </el-form-item>
            <el-form-item v-if="isDialogView" class="form-item-btn">
              <el-button type="primary" @click="dialogVisible=false" size="mini">关闭</el-button>
            </el-form-item>
            <el-form-item v-else class="form-item-btn">
              <el-button type="primary" @click="submitForm('ruleForm')" size="mini">提交</el-button>
              <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>


        <query-one
        :p-dialog-visible="packageNameQueryVisible"
        :p-client-x-y="packageNameQueryXY"
        p-type="txt"
        p-type-name="packageName"
        v-on:query="handleFilter"
        v-on:cancel="packageNameQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="projectNameQueryVisible"
        :p-client-x-y="projectNameQueryXY"
        p-type="radioCustom"
        p-type-name="projectName"
        :radio-items="projectNameItems"
        v-on:query="handleFilter"
        v-on:cancel="projectNameQueryVisible =false">
        </query-one>
        <query-one
        :p-dialog-visible="durationQueryVisible"
        :p-client-x-y="durationQueryXY"
        p-type="txt"
        p-type-name="duration"
        v-on:query="handleFilter"
        v-on:cancel="durationQueryVisible =false">
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
        <query-one
        :p-dialog-visible="statusQueryVisible"
        :p-client-x-y="statusQueryXY"
        p-type="radioCustom"
        p-type-name="status"
        :radio-items="[{value:0,label:'否'},{value:1,label:'是'}]"
        v-on:query="handleFilter"
        v-on:cancel="statusQueryVisible =false">
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
import {uploadFile} from '@/utils/oss'
import {validatChinese,validateURL} from '@/utils/validate'
import QueryOne from '@/components/QueryDialog/QueryOne'
import QueryOrderbyOrQuery from '@/components/QueryDialog/QueryOrderbyOrQuery'
export default {
  components:{
    QueryOne,
    QueryOrderbyOrQuery
  },
  data() {
      let checkPackageName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入套餐名称'));
        }else{
            callback();
        }
      };
      let checkProjectId = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入产品ID'));
        }else{
            callback();
        }
        
      };
      let checkCapacity = (rule, value, callback) => {
        // 不为空时验证
        if (value) {
            setTimeout(() => {
              if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
              } else {
                callback();
              }
            }, 1000);
        }else{
          callback();
        }
        
      };
      let checkCharge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入图片空间'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 1000);
      }
      let checkDuration = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入套餐限制'));
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
            chargeType:0,
            status:null,
            projectId:null,
            startTime:null,
            endTime:null,
            orderType:null // 排序方式 0-升序 1-降序
        },
        dialogVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        isDialogView:true,
        ruleForm: {
          packageId:null,
          projectId:null,
          packageName:null,
          duration:null,
          charge: null,
          icon: null,
          chargeType:0,
          capacity:null,
          status:null,
          functions:[]
        },
        projectId:{
          flag:false // 不开通图片空间
        },
        multipleSelection: [],
        rules: {
          packageName: [
            {required: true, validator: checkPackageName, trigger: 'blur' }
          ],
          projectId: [
            {required: true, validator: checkProjectId, trigger: 'blur' }
          ],
          capacity: [
            { validator: checkCapacity, trigger: 'blur' }
          ],
          charge: [
            {required: true, validator: checkCharge, trigger: 'blur' }
          ],
          duration: [
            {required: true, validator: checkDuration, trigger: 'blur' }
          ]
        },
        projectAllList:null,
        fileList:[],
        packageNameQueryVisible:false,
        packageNameQueryXY:[],
        projectNameQueryVisible:false,
        projectNameQueryXY:[],
        durationQueryVisible:false,
        durationQueryXY:[],
        chargeQueryVisible:false,
        chargeQueryXY:[],
        updateUserQueryVisible:false,
        updateUserQueryXY:[],
        orderOrTimeQueryVisible:false,
        orderOrTimeQueryXY:[],
        statusQueryVisible:false,
        statusQueryXY:[],
        projectNameItems:[]
    }
  },
    created() {
      this.getAllProjectList()
    },
    methods:{
     clickHandlerPackageName(e){
        this.packageNameQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.packageNameQueryVisible =true
      },
      clickHandlerProjectName(e){
        let items =[]
        this.projectAllList.forEach(element => {
          items.push({value:element.projectId,label:element.projectName})
        });
        this.projectNameItems=items
        this.projectNameQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.projectNameQueryVisible =true
      },
      clickHandlerDuration(e){
        this.durationQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.durationQueryVisible =true
      },
      clickHandlerCharge(e){
        this.chargeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.chargeQueryVisible =true
      },
      clickHandlerUpdateUser(e){
        this.updateUserQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.updateUserQueryVisible =true
      },
      clickHandlerTime(e){
        this.orderOrTimeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.orderOrTimeQueryVisible =true
      },
      clickHandlerStatus(e){
        this.statusQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.statusQueryVisible =true
      },
     renderHeaderPackageName(h, { column, $index }) {
       return this.handlerRenderHeader(h, {column, $index },'packageName')
     },
     renderHeaderProjectName(h, { column, $index }){
        return this.handlerRenderHeader(h, {column, $index },'projectName')
     },
     renderHeaderDuration(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'duration')
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
     renderHeaderStatus(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'status')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='packageName'){
         func =this.clickHandlerPackageName
       }else if(t==='projectName'){
         func =this.clickHandlerProjectName
       }else if(t==='duration'){
         func =this.clickHandlerDuration
       }else if(t==='charge'){
         func =this.clickHandlerCharge
       }else if(t==='updateUser'){
         func =this.clickHandlerUpdateUser
       }else if(t==='updateTime'){
         func =this.clickHandlerTime
       }else if(t==='status'){
         func =this.clickHandlerStatus
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
     formatterProject(row, column){
      let project = this.projectAllList.filter(element => element.projectId ===row.projectId);
       return project[0].projectName;
     } ,
     getList() {
      this.listLoading = true

      let params =this.listQuery
      let reqData={
        url:'/package/list',
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
      }else if(type==='projectName'){
        this.projectNameQueryVisible =false
        this.listQuery.projectId =params.value
        if(params.value==='radio_all'){
          this.listQuery.projectId=null
        }
      }else if(type==='duration'){
        if(isNaN(params.value)){
          this.$message.warning('请输入数字');
          return
        }
        this.durationQueryVisible =false
        this.listQuery.duration =Number(params.value)
      }else if(type==='charge'){
        if(isNaN(params.value)){
          this.$message.warning('请输入数字');
          return
        }
        this.chargeQueryVisible =false
        this.listQuery.charge =Number(params.value)
      }else if(type==='status'){
        this.statusQueryVisible =false
        this.listQuery.status =params.value
        if(params.value==='radio_all'){
          this.listQuery.status=null
        }
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
    handleChange(file, fileList){
        this.fileList = fileList.slice(-1);
    },
    showDialog(id,formName,t){
      // this.getAllProjectList()
      this.fileList =[]
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
        this.projectId.flag=false
      }
      if(t==='edit'||t==='view'){
        let reqData={
          url:'/package/info',
          params:{id}
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            packageId:data.packageId,
            projectId:data.projectId,
            packageName:data.packageName,
            duration:data.duration,
            charge:data.charge,
            icon:data.icon,
            chargeType:data.chargeType,
            capacity:data.capacity,
            status:data.status===0?false:true,
            functions:data.functions
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    getAllProjectList(){
      let reqData={
            url:'/project/allList',
            params:{
              chargeType:1, // 计费类型 0-按次,1-包月
              photoFlag:1 // 图片空间是否启用：0-关闭；1-开启
            }
          }
        httpPost(reqData).then(res => {
          let {data} =res
          this.projectAllList =data
          this.getList()
        }).catch(err=>{
          console.log(err)
        })
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              if(this.fileList.length===0){
                  this.$message.warning('请选择文件');
                  return
              }
              // 没有加验证文件后缀名
              uploadFile(this.fileList[0],'marketimg/admin/img/').then(resIcon=>{
                let params =this.ruleForm
                    params.icon =resIcon
                    if(params.status){
                        params.status=1
                    }else{
                        params.status=0
                    }

                    let url ='/package/save'
                    if(this.isDialogAdd){
                        params.packageId=null
                    }else{
                        if(params.packageId===null||!Number.isInteger(params.packageId)){
                            this.$message.error('套餐ID为空或不为数字');
                            return
                        }
                        url ='/package/update'
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
                console.log(res)
              }).catch(err=>{
                console.log(err)
              })
              this.dialogVisible=false
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
    },
    copy(id){
      this.$confirm('此操作为复制添加, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let reqData={
                url:'/package/info',
                params:{id}
              }
            httpPost(reqData).then(res => {
              let {code,data} =res
              if(code===0){
                data.packageId=null
                reqData={
                  url:'/package/save',
                  params:data
                }
                httpPost(reqData).then(res => {
                  this.$message.success('操作成功');
                  this.getList()
                }).catch(err=>{
                  console.log(err)
                })
              }
            }).catch(err=>{
              console.log(err)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消复制添加'
          });       
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
    
    /deep/ .el-form{
      // box-shadow: 4px 0px 10px -3px #C0C0C0;
    }
    
    .form-item-capacity{
        /deep/.el-input{
          width: 265px;
        }
        .input-unit{
          margin-left: 5px;
        }
    }
    /deep/ .form-item-upload{
        margin-bottom: 0;
    }
    .upload-box{
      display: flex;
        /deep/.el-upload--picture{
           margin-right: 10px;
       }
        /deep/.el-upload-list{
            margin-top: 5px;
            width: 130px;
            height: 94px;
            border: 1px dashed #d7d7d7;
            border-radius:6px;
        }
        /deep/.el-upload-list__item{
            margin-top: 0;
        }
    }

}
      
</style>


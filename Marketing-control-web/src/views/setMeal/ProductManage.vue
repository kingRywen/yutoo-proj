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
                prop="projectId"
                label="序号"
                min-width="80"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="projectName"
                label="产品名称"
                min-width="90"
                show-overflow-tooltip
                :render-header="renderHeaderProjectName">
            </el-table-column>
            <el-table-column
                label="计费类型"
                min-width="90"
                :render-header="renderHeaderChargeType">
                <template slot-scope="scope">
                  <div v-if="scope.row.chargeType===0">按次</div>
                  <div v-else>包月</div>
                </template>
            </el-table-column>
            <el-table-column
                label="图片空间"
                min-width="90"
                :render-header="renderHeaderPhotoFlag">
                <template slot-scope="scope">
                  <div v-if="scope.row.photoFlag===0">关闭</div>
                  <div v-else>开启</div>
                </template>
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
                  <i class="el-icon-edit" @click="showDialog(scope.row.projectId,'ruleForm','edit')" style="cursor:pointer"></i>
                </el-tooltip>
                <!-- <i class="el-icon-delete" @click="deleteRows(scope.row.projectId)" style="cursor:pointer"></i> -->
                <el-tooltip class="item" effect="dark" content="查看" placement="top">
                  <i class="el-icon-view" @click="seeProductFunction(scope.row.projectId)" style="cursor:pointer"></i>
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
          
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="85px">
            <el-form-item label="功能名称:" prop="projectName">
                 <el-input v-model="ruleForm.projectName" autocomplete="off" :disabled="!isDialogAdd" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="计费类型:">
                <el-radio-group v-model="ruleForm.chargeType"  size="medium">
                    <el-radio border label="0">按次</el-radio>
                    <el-radio border label="1">包月</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="图片空间:">
                <el-switch
                v-model="ruleForm.photoFlag"
                active-text="开启"
                inactive-text="关闭">
              </el-switch>
            </el-form-item>
            <el-form-item label="功能描述:">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="ruleForm.desc"
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
        :p-dialog-visible="projectNameQueryVisible"
        :p-client-x-y="projectNameQueryXY"
        p-type="txt"
        p-type-name="projectName"
        v-on:query="handleFilter"
        v-on:cancel="projectNameQueryVisible =false">
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
        :p-dialog-visible="photoFlagQueryVisible"
        :p-client-x-y="photoFlagQueryXY"
        :radio-items="[{value:0,label:'关闭'},{value:1,label:'开启'}]"
        p-type="radioCustom"
        p-type-name="photoFlag"
        v-on:query="handleFilter"
        v-on:cancel="photoFlagQueryVisible =false">
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
        :p-dialog-visible="orderByTimeQueryVisible"
        :p-client-x-y="orderByTimeQueryXY"
        p-type="time"
        p-type-name="updateTime"
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
      let checkProjectName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('功能名称不能为空'));
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
            orderType: 1,
            chargeType:null,
            photoFlag:null,
            startTime:null,
            endTime:null
        },
        dialogVisible:false,
        dialogTitle:'新增',
        isDialogAdd:true,
        ruleForm: {
          projectId:null,
          projectName:null,
          chargeType: '0',
          photoFlag: false,
          desc:null
        },
        multipleSelection: [],
        rules: {
          projectName: [
            {required: true, validator: checkProjectName, trigger: 'blur' }
          ]
        },
        projectNameQueryVisible:false,
        projectNameQueryXY:[],
        chargeTypeQueryVisible:false,
        chargeTypeQueryXY:[],
        photoFlagQueryVisible:false,
        photoFlagQueryXY:[],
        updateUserQueryVisible:false,
        updateUserQueryXY:[],
        orderByTimeQueryVisible:false,
        orderByTimeQueryXY:[]
    }
  },
    created() {
      this.getList()
    },
    methods:{
      clickHandlerProjectName(e){
        this.projectNameQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.projectNameQueryVisible =true
      },
      clickHandlerChargeType(e){
        this.chargeTypeQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.chargeTypeQueryVisible =true
      },
      clickHandlerPhotoFlag(e){
        this.photoFlagQueryXY=[(e.clientX -340),(e.clientY -95)]
        this.photoFlagQueryVisible =true
      },
      clickHandlerUpdateUser(e){
        this.updateUserQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.updateUserQueryVisible =true
      },
      clickHandlerTime(e){
        this.orderByTimeQueryXY=[(e.clientX -373),(e.clientY -95)]
        this.orderByTimeQueryVisible =true
      },
     renderHeaderProjectName(h, { column, $index }) {
       return this.handlerRenderHeader(h, {column, $index },'projectName')
     },
     renderHeaderChargeType(h, { column, $index }){
        return this.handlerRenderHeader(h, {column, $index },'chargeType')
     },
     renderHeaderPhotoFlag(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'photoFlag')
     },
     renderHeaderUpdateUser(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'updateUser')
     },
     renderHeaderUpdateTime(h, { column, $index }){
       return this.handlerRenderHeader(h, {column, $index },'updateTime')
     },
     handlerRenderHeader(h, { column, $index },t){
       let func =null
       if(t==='projectName'){
         func =this.clickHandlerProjectName
       }else if(t==='chargeType'){
         func =this.clickHandlerChargeType
       }else if(t==='photoFlag'){
         func =this.clickHandlerPhotoFlag
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
     getList() {
      this.listLoading = true

      let params =this.listQuery
      let reqData={
        url:'/project/list',
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
      if(type==='projectName'){
        this.projectNameQueryVisible =false
        this.listQuery.projectName =params.value
      }else if(type==='chargeType'){
        this.chargeTypeQueryVisible =false
        this.listQuery.chargeType =params.value
        if(params.value==='radio_all'){
          this.listQuery.chargeType=null
        }
      }else if(type==='photoFlag'){
        this.photoFlagQueryVisible =false
        this.listQuery.photoFlag =params.value
        if(params.value==='radio_all'){
          this.listQuery.photoFlag=null
        }
      }else if(type==='updateUser'){
        this.txtQueryVisible =false
        this.listQuery.updateUser =params.value
      }else if(type==='updateTime'){//QueryTime
        this.orderByTimeQueryVisible =false
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
        }else{
          // this.$message('不好意思，新增功能还未开放，开发人员独享');
          // return
          this.dialogTitle='新增'
          this.isDialogAdd=true
        }
      this.dialogVisible=true;
      if(this.$refs[formName]!==undefined){
        this.$refs[formName].resetFields();
      }
      if(t==='edit'){
        let reqData={
          url:'/project/info',
          params:{id}
        }
        httpPost(reqData).then(res => {
          let {data} =res
          this.ruleForm= {
            projectId:data.projectId,
            projectName:data.projectName,
            chargeType:data.chargeType.toString(),
            photoFlag:data.photoFlag===0?false:true,
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
            
            if(params.chargeType==='0'){
              params.chargeType=0
            }else if(params.chargeType==='1'){
              params.chargeType=1
            }else{
              params.chargeType=null
            }

            if(params.photoFlag){
              params.photoFlag=1
            }else{
              params.photoFlag=0
            }

            let url ='/project/save'
            if(this.isDialogAdd){
              params.projectId=null
            }else{
              if(params.projectId===null||!Number.isInteger(params.projectId)){
                this.$message.error('产品ID为空或不为数字');
                return
              }
              url ='/project/update'
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
      this.ruleForm.desc =null
      this.ruleForm.chargeType='0'
      this.ruleForm.photoFlag=false
    },
    deleteRows(id){
      this.$message('不好意思，删除功能还未开放，开发人员独享');
      return
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
                url:'/project/remove',
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
    seeProductFunction(id){
      this.$router.push({
        path: '/setMeal/productFunction', 
        query: {id}
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import '../../styles/page-default';
</style>


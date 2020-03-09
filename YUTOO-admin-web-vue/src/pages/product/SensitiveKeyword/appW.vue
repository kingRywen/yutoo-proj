<template lang="html">
    <div class="logistics_packaging">
        <!--  -->
        <el-form :inline="true" :model="selectForm" class="selectForm">
            <el-form-item label="类型">
                <el-select v-model="selectForm.packageType" clearable size="medium">
                    <el-option :label="item.name" :value="item.type" v-for="item in typeList"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="添加时间">
                <el-date-picker
                    size="medium"
                    v-model="selectForm.time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"  size="medium" @click="select">搜 索</el-button>
            </el-form-item>
        </el-form>
        <!--  -->
        <el-row :gutter="10" class="btn">
            <el-col :span="2">
                <el-button type="primary"  size="medium" @click="openDialog('添加采购点')">添 加</el-button>
            </el-col>
            <el-col :span="6">
                <el-button type="primary"  size="medium" @click="allDel">批量删除</el-button>
            </el-col>
        </el-row>
        <!--  -->
        <el-table :data="packageList" border style="width: 100%" height="620"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column  type="index"  label="编号" width="80" align="center"></el-table-column>
            <el-table-column  prop="typeDesc"  label="类型" align="center"></el-table-column>
            <el-table-column  prop="specification"  label="型号" align="center"></el-table-column>
            <el-table-column  label="长" align="center">
                <template slot-scope="scope">
                    {{scope.row.singleLong + scope.row.lengthUnit}}
                </template>
            </el-table-column>
            <el-table-column  label="宽" align="center">
                <template slot-scope="scope">
                    {{scope.row.singleWide + scope.row.widthUnit}}
                </template>
            </el-table-column>
            <el-table-column  label="高" align="center">
                <template slot-scope="scope">
                    {{scope.row.singleHigh + scope.row.heightUnit}}
                </template>
            </el-table-column>
            <el-table-column  label="体积" align="center">
                <template slot-scope="scope">
                    {{scope.row.volume }}
                </template>
            </el-table-column>
            <el-table-column  label="重量" align="center">
                <template slot-scope="scope">
                    {{scope.row.weight + scope.row.weightUnit}}
                </template>
            </el-table-column>
            <el-table-column   label="价格" align="center">
                <template slot-scope="scope">
                    {{scope.row.price + scope.row.priceUnit}}
                </template>
            </el-table-column>
            <el-table-column  prop="createTime"  label="添加时间" width="210" align="center"></el-table-column>
            <el-table-column  prop="creator"  label="添加人员" align="center"></el-table-column>
            <el-table-column  label="操作" align="center" width="200">
                <template slot-scope="scope">
                    <el-button type='text' @click="openDialog('编辑采购点',scope.row.logisticPackageId)">编辑</el-button>
                    <el-button type='text' @click="openDialog('查看采购点',scope.row.logisticPackageId)">查看</el-button>
                    <el-button type='text' @click="del(scope.row.logisticPackageId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--  -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 25, 50, 80]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          class="pagination">
        </el-pagination>
        <!--  -->
        <el-dialog :title="dialogTitle"  width="600px" center :visible.sync="p_locationDialog">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="类别：" prop="packageType">
                    <el-select v-model="form.packageType" size="medium" style="width:100%;" :disabled="islook">
                        <el-option :label="item.name" :value="item.type" v-for="item in typeList"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="型号：" prop="specification">
                    <el-input  v-model="form.specification" size="medium" :disabled="islook"/>
                </el-form-item>
                <div class="fxitem">
                    <el-form-item label="长：" prop="singleLong" class="first">
                        <el-input  v-model.number="form.singleLong" size="medium" :disabled="islook"/>
                    </el-form-item>
                    <el-form-item  prop="lengthUnit" class="fxitem-select">
                        <el-select v-model="form.lengthUnit" size="medium" @change="changeUnit" :disabled="islook">
                            <el-option :label="item" :value="item" v-for="item in unitInfo.lengths"/>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="fxitem">
                    <el-form-item label="宽：" prop="singleWide" class="first">
                        <el-input  v-model.number="form.singleWide" size="medium" :disabled="islook"/>
                    </el-form-item>
                    <el-form-item prop="widthUnit" class="fxitem-select">
                        <el-select v-model="form.widthUnit" size="medium" @change="changeUnit" :disabled="islook">
                           <el-option :label="item" :value="item" v-for="item in unitInfo.lengths"/>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="fxitem">
                    <el-form-item label="高：" prop="singleHigh" class="first">
                        <el-input  v-model.number="form.singleHigh" size="medium" :disabled="islook"/>
                    </el-form-item>
                    <el-form-item prop="heightUnit" class="fxitem-select">
                        <el-select v-model="form.heightUnit" size="medium" @change="changeUnit" :disabled="islook">
                            <el-option :label="item" :value="item" v-for="item in unitInfo.lengths"/>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="fxitem">
                    <el-form-item label="重量：" prop="weight" class="first">
                        <el-input  v-model.number="form.weight" size="medium" :disabled="islook"/>
                    </el-form-item>
                    <el-form-item  prop="weightUnit" class="fxitem-select">
                        <el-select v-model="form.weightUnit" size="medium" :disabled="islook">
                           <el-option :label="item" :value="item" v-for="item in unitInfo.weight"/>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="fxitem">
                    <el-form-item label="价格：" prop="price" class="first">
                        <el-input  v-model.number="form.price" size="medium" :disabled="islook"/>
                    </el-form-item>
                    <el-form-item prop="priceUnit" class="fxitem-select">
                        <el-select v-model="form.priceUnit" size="medium" :disabled="islook">
                            <el-option :label="item" :value="item" v-for="item in unitInfo.price"/>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="备注：">
                    <el-input type="textarea"  v-model="form.packageRemark" size="medium" :disabled="islook"/>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button v-if="!islook" type="primary" @click="submitform('form')">保 存</el-button>
                <el-button v-else type="primary" @click="p_locationDialog = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    BASE_URL
} from "common/config";
import {
    _storage
} from "common/common";
import axios from "axios";
function getData(requestURL, params) {
    return axios({
            method: "post",
            url: BASE_URL + "/" + requestURL,
            data: params,
            headers: {
                token: _storage._get('local', 'token'),
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        .then(res => {
            return res;
        })
        .catch(err => {
            console.log(err);
        });
}

export default {
    data() {
        return {
            islook:false,
            selectPacking:[],
            typeList:[
                {type:1,name:'纸箱'},
                {type:2,name:'信封袋'},
                {type:3,name:'气泡信封袋'},
                {type:4,name:'其他'},
                {type:5,name:'PE快递袋'}
            ],
            selectForm:{
                packageType:"",
                time:[]
            },
            packageList:[],
            currentPage:null,
            pageSize:null,
            total:null,
            p_locationDialog:false,
            dialogTitle:'',
            unitInfo:{
               lengths:[],
               price:[],
               weight:[]
            },
            rules:{
                packageType: [
                    { required: true, message: '请选择类别', trigger: 'change' }
                ],
                specification: [
                    { required: true, message: '请输入型号', trigger: 'blur' }
                ],
                singleLong: [
                    { required: true, message: '请输入长度', trigger: 'blur' },
                    { type: 'number', message: '长度必须为数字值'}
                ],
                lengthUnit:[
                   { required: true, message: '单位不能为空', trigger: 'change' }
                ],
                singleWide: [
                    { required: true, message: '请输入宽度', trigger: 'blur' },
                    { type: 'number', message: '宽度必须为数字值'}
                ],
                widthUnit:[
                   { required: true, message: '单位不能为空', trigger: 'change' }
                ],
                singleHigh: [
                    { required: true, message: '请输入高度', trigger: 'blur' },
                    { type: 'number', message: '高度必须为数字值'}
                ],
                heightUnit:[
                   { required: true, message: '单位不能为空', trigger: 'change' }
                ],
                weight: [
                    { required: true, message: '请输入重量', trigger: 'blur' },
                    { type: 'number', message: '重量必须为数字值'}
                ],
                weightUnit:[
                    { required: true, message: '单位不能为空', trigger: 'change' }
                 ],
                price: [
                    { required: true, message: '请输入价格', trigger: 'blur' },
                    { type: 'number', message: '价格必须为数字值'}
                ],
                priceUnit:[
                    { required: true, message: '单位不能为空', trigger: 'change' }
                ],
            },
            form:{
                // "logisticPackageId" : null,
                "packageType" : null,
                "specification" : null,
                "singleLong" : null,
                lengthUnit:"CM",
                "singleWide" : null,
                weightUnit:"kg",
                "singleHigh" : null,
                 heightUnit:"CM",
                "weight" : null,
                widthUnit:"CM",
                "price" : null,
                priceUnit : "RMB",
                "packageRemark" : "",
                typeDesc:""

                // "creatorId" : null,
            },
            logisticPackageId:null
        }
    },
    watch:{
        "form.packageType"(val){
            switch(val){
                case 1:
                    this.form.typeDesc = '纸箱'
                break;
                case 2:
                   this.form.typeDesc =  '信封袋'
                break;
                case 3:
                    this.form.typeDesc = '气泡信封袋'
                break;
                case 4:
                    this.form.typeDesc = '其他'
                break;
                case 5:
                    this.form.typeDesc = 'PE快递袋'
                break;
            }
        }
    },
    mounted(){
        this.getPackageList()
        this.getUnitList()
    },
    methods:{
        //编辑查询
        selectInfo(logisticPackageId){
            getData('logistic/package/info',{logisticPackageId}).then(res=>{
                if(res.data.code==0){
                    let obj = res.data.rows
                    for(let k in obj){
                        for(let j in this.form){
                            if(k==j){
                                this.form[j] = obj[k]
                            }
                        }
                    }
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //搜索
        select(){
            let params = {
                "sortOrder" : "asc",
                "pageSize" : 10,
                "pageNumber": 1,
            }
            if(this.selectForm.packageType){
               params = Object.assign({},params,{packageType:this.selectForm.packageType})
            }
            if(this.selectForm.time !=null && this.selectForm.time.length){
               params = Object.assign({},params,{
                   timeStart:this.selectForm.time[0],
                   timeEnd:this.selectForm.time[0]
               })
            }
            this.getPackageList(params)
        },
        //统一单位
        changeUnit(val){
            this.form.lengthUnit = val
            this.form.widthUnit = val
            this.form.heightUnit = val
        },
        //批量删除
        allDel(){
            if(this.selectPacking.length){
                this.remove({logisticPackageIds:this.selectPacking})
            }else{
                this.$message({
                  message: '请选择你要删除的',
                  type: 'warning'
                });
            }
        },
        remove(params){
            getData('logistic/package/batch/remove',params).then(res=>{
                if(res.data.code==0){
                    this.$message({
                      type: 'success',
                      message: res.data.msg
                    });
                    this.getPackageList()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //删除
        del(logisticPackageId){
            this.$confirm('确定删除吗, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.remove({logisticPackageIds:Array.of(logisticPackageId)})
            })
        },
        //获取单位
        getUnitList(){
            getData('global/unit/item/types/list',{types:[2,3,4]}).then(res=>{
                console.log(res)
                if(res.data.code==0){
                    let data = res.data.rows
                    this.unitInfo.lengths = data[2]
                    this.unitInfo.price = data[3]
                    this.unitInfo.weight = data[4]
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取物流包材table
        getPackageList(params={"sortOrder" : "asc","pageSize" : 10,"pageNumber": 1}){
            getData('logistic/package/page/list',params).then(res=>{
                if(res.data.code==0){
                    console.log(res)
                    this.packageList = res.data.rows.rows

                    this.currentPage = res.data.pageNo
                    this.pageSize = res.data.rows.pageSize
                    this.total = res.data.rows.total
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //确定
        submitform(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.dialogTitle == "添加采购点"){
                       this.send('logistic/package/save',this.form)
                   }else if(this.dialogTitle == "编辑采购点"){
                       this.send("logistic/package/update",{...this.form,logisticPackageId:this.logisticPackageId})
                   }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //添加 => 编辑 确定
        send(url,params){
            getData(url,params).then(res=>{
                if(res.data.code==0){
                    this.$message({
                      message: res.data.msg,
                      type: 'success'
                    });
                    this.p_locationDialog = false;
                    this.getPackageList()
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        //批量选择
        handleSelectionChange(val){
            this.selectPacking = val.map(item=>item.logisticPackageId)
        },
        openDialog(title,logisticPackageId){
            this.dialogTitle = title;
            this.form.packageRemark = ""
            this.$nextTick(()=>{
                this.$refs.form.resetFields();

            })
            this.p_locationDialog = true;
            if(title == "编辑采购点"){
                this.islook = false
                this.logisticPackageId = logisticPackageId
                this.selectInfo(logisticPackageId)
            }else if(title == "查看采购点"){
                this.islook = true
                 this.selectInfo(logisticPackageId)
            }else{
                this.islook = false
            }

        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            let params = {
                "sortOrder" : "asc",
                "pageSize" : val,
                "pageNumber": this.currentPage
            }
            if(this.selectForm.packageType){
                params = Object.assign({},params,{packageType:this.selectForm.packageType})
            }
            if(this.selectForm.time !=null && this.selectForm.time.length){
                params = Object.assign({},params,{
                     timeStart:this.selectForm.time[0],
                     timeEnd:this.selectForm.time[0]
                })
            }
            this.getPackageList(params)
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            let params = {
                "sortOrder" : "asc",
                "pageSize" :this.pageSize,
                "pageNumber": val
            }
            if(this.selectForm.packageType){
                params = Object.assign({},params,{packageType:this.selectForm.packageType})
            }
            if(this.selectForm.time !=null && this.selectForm.time.length){
                params = Object.assign({},params,{
                     timeStart:this.selectForm.time[0],
                     timeEnd:this.selectForm.time[0]
                })
            }
            this.getPackageList(params)
        }
    }
}
</script>

<style lang="scss">
    .logistics_packaging{
        padding: 10px;
    }
    .fxitem{
        display: flex;
        .first{
            width: 100%;
        }
        .fxitem-select{
            .el-form-item__content{
                width: 90px;
                margin-left:10px!important;
            }
        }
    }
    .selectForm{
        background: rgb(242, 242, 242);
        padding: 10px 0 10px 15px;
        border-radius: 5px;
        .el-form-item{
            margin-bottom: 0;
        }
    }
    .btn{
        margin: 10px 0;
    }
    .pagination{
        text-align: center;
        margin-top: 20px;
    }
</style>

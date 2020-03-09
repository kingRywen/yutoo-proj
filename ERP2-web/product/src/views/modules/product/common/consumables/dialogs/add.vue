<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" size='small'>
            <el-form-item label="耗材类型" prop="firstType" >
                <el-select v-model="ruleForm.firstType" placeholder="请选择"  clearable  style='width:100%;' @change='firstTypeChange'>
                    <el-option
                    v-for="item in firstTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级类型" prop="secondType">
                <el-select v-model="ruleForm.secondType" placeholder="请选择"  clearable  style='width:100%;'>
                    <el-option
                    v-for="item in secondTypeOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="型号" prop="model">
                <el-input v-model.trim='ruleForm.model'  clearable></el-input>
            </el-form-item>
            <el-form-item label="产品名称" prop="nameCn">
                <el-input v-model.trim='ruleForm.nameCn'  clearable></el-input>
            </el-form-item>
            <el-form-item label="产品图片" prop="imgPath" :class='{"imgPath":ruleForm.imgPath ? true : false}'>
              <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                     :on-remove="handleRemove"
                    :on-change="handleChange"
                    :on-success="onSuccess"
                    :on-error="onError"
                    :limit='1'
                    :file-list='fileList'
                    :http-request="handleHttpRequests"
                    :on-preview="handlePictureCardPreview"
                    >
                    <i class="el-icon-plus"></i>
                 </el-upload>
                <erpDialog  :append-to-body='true' :opts='imgOpts'>
                    <img width="100%" :src="dialogImageUrl" alt="">
                </erpDialog>
            </el-form-item>
            <el-form-item label="尺寸">
                <div style='display:flex;'>
                    <div style='width:90%;display:flex;justify-content: space-between;margin-right:30px;'>
                        <el-form-item label="" prop="length" label-width="0"   style='width:30%;'>
                            <el-input v-model.trim='ruleForm.length'  clearable>
                                <template slot="prepend">长</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="" prop="width" label-width="0" style='width:30%;'>
                            <el-input v-model.trim='ruleForm.width'  clearable>
                                <template slot="prepend">宽</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="" prop="height" label-width="0" style='width:30%;'>
                            <el-input v-model.trim='ruleForm.height'  clearable>
                                <template slot="prepend">高</template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div style='width:10%'>
                        <el-form-item label="" prop="lengthUnit" label-width="0">
                            <el-select v-model="ruleForm.lengthUnit" placeholder="请选择"  clearable  style='width:100%;'>
                                <el-option
                                v-for="item in lengthUnitOpts"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="重量">
                <div style='display:flex;'>
                    <div style='width:90%;margin-right:30px;'> 
                        <el-form-item label="" prop="weight" label-width="0">
                            <el-input v-model.trim='ruleForm.weight'  clearable></el-input>
                        </el-form-item>
                    </div>
                    <div style='width:10%'>
                        <el-form-item label="" prop="weightUnit" label-width="0" >
                            <el-select v-model="ruleForm.weightUnit" placeholder="请选择"  clearable  style='width:100%;'>
                                <el-option
                                v-for="item in weightUnitOpts"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="备注" prop='consumablesDesc'>
                 <el-input v-model.trim='ruleForm.consumablesDesc'  clearable></el-input>
            </el-form-item>
            <el-form-item label="自定义SKU" prop='consumablesSku'>
                 <el-input v-model.trim='ruleForm.consumablesSku'  clearable></el-input>
            </el-form-item>
            <el-form-item label="采购人员" prop="purchaseUserId">
                <el-select v-model="ruleForm.purchaseUserId" placeholder="请选择"  clearable  style='width:100%;'>
                    <el-option
                    v-for="item in purchaseUserIdOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <div style='margin-left:90px;'>
                <ElButton class="search-add" @click="opts.visible=true" type='primary'>添加供应商报价</ElButton>
                <ElButton class="search-add" type='primary' @click='deleteItem(selectIds)'>删除</ElButton>
            </div>
            <el-form-item label="供应商报价" prop="supplierList">
                <yt-table :data='ruleForm.supplierList' :columns="columns" :treeTable='true' :treeTableOtions='treeTableOtions'  style='margin-top:10px;' border v-loading='tableLoading' @selectChange='selectChange'>
                    <template slot="right">
                            <el-table-column label="操作" align="left" :width="editWidth" v-if="edits.length">
                                <template slot-scope="scope">
                                <template v-if="edits.length > 1">
                                    <el-dropdown
                                    v-setplain.small
                                    split-button
                                    type="primary"
                                    @click="edits[0].fn(scope)"
                                    @command="handleEditCommand"
                                    >
                                    {{edits[0].name}}
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                        v-for="(item, index) in edits.slice(1)"
                                        :command="{item, scope}"
                                        :key="index"
                                        >{{item.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                                <el-button
                                    v-else-if="edits[0].show == null ? true : typeof edits[0].show === 'boolean' ? edits[0].show : edits[0].show(scope)"
                                    size="small"
                                    type="primary"
                                    plain
                                >{{edits[0].name}}</el-button>
                                </template>
                            </el-table-column>
                        </template>
                </yt-table>
            </el-form-item>
        </el-form>
         <Dialog :opts='opts' :events='addEvents' :validate='validate'>
            <Add   ref='addDialog' v-if='opts.visible' :editData='editData'  />
        </Dialog>
    </div>
</template>

<script>
import erpDialog from 'Components/MainLayout/src/dialog'
import { oss } from "@yutoo/yutoo/utils/utils.umd.min";
import { OSS_CONFIG } from "Config";
import storage from "Utils/saver";
export default {
    components:{
        erpDialog,
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        Add:()=>import('./dialog/add')
    },
    props:['type','consumablesId','copyData'],
    data() {
        return {
            ruleForm:{
                firstType:'',
                secondType:'',
                model:'',
                nameCn:'',
                imgPath:'',
                length:'',
                width:'',
                height:'',
                lengthUnit:'',
                weight:"",
                weightUnit:"",
                consumablesDesc:"",
                consumablesSku:"",
                purchaseUserId:"",
                supplierList:[],
            },
            rules:{
                firstType:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                secondType:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                model:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                nameCn:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                imgPath:[
                    { required: true, message: '请上传', trigger: ['blur','change']},
                ],
                consumablesSku:[
                    { required: true, message: '请输入', trigger: ['blur']},
                ],
                purchaseUserId:[
                    { required: true, message: '请选择', trigger: ['blur' ,'change']},
                ],
                supplierList:[
                    { required: true, message: '请添加', trigger: ['blur' ,'change']},
                ]
            },
            //耗材类型的下拉
            firstTypeOpts:[],
            //二级类型的下拉
            secondTypeOpts:[],
            //长度单位
            lengthUnitOpts:[
                {label:'mm',value:1},
                {label:'m',value:2},
                {label:'dm',value:3},
                {label:'cm',value:4},
            ],
            //重量单位
            weightUnitOpts:[
                {label:'G',value:1},
                {label:'KG',value:2},
            ],
            //采购人员下拉
            purchaseUserIdOpts:[
            ],


            imgOpts:{
                visible :false,
                title:'预览图片'
            },
            dialogImageUrl:'',
            fileList:[
                // {name: 'food.jpg', url: 'http://pic16.nipic.com/20111006/6239936_092702973000_2.jpg'}
            ],


            editWidth:'130px',
            edits:[
                {
                    name:"编辑",
                    show:(scope)=>{
                        return fasle
                    },
                    fn:(scope)=>{
                        this.editItem(scope.row)
                    },
                    
                },
                {
                    name:"缺货",
                    show:(scope)=>{
                        return true
                    },
                },
                {
                    name:"停产",
                    show:(scope)=>{
                        return true
                    },
                },
                {
                    name:"清库",
                    show:(scope)=>{
                        return true
                    },
                },
                {
                    name:"正常",
                    show:(scope)=>{
                        return true
                    },
                },
                {
                    name:"删除供应商",
                    show:(scope)=>{
                        return true
                    },
                }

            ],
            columns:[

                {
                    label: "供应商",
                    value: "supplierName",
                    expand:true,
                    minWidth:160,
                },
                {
                    label: "报价",
                    value: "price",
                    minWidth:160,
                    render(h,scope){
                        //console.log(scope.row);
                        let priceColumus= [
                            {
                                label: "数量",
                                value: "numStart",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.numStart + '~' + scope.row.numEnd}</span>
                                    )
                                }
                            },
                            {
                                label: "单价",
                                value: "price",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.price}</span>
                                    )
                                }
                            },
                            {
                                label: "采购运费",
                                value: "purchaseFreight",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.purchaseFreight}</span>
                                    )
                                }
                            },
                            {
                                label: "加工费",
                                value: "processPrice",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.processPrice}</span>
                                    )
                                }
                            },
                            {
                                label: "其他费用",
                                value: "otherPrice",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.otherPrice}</span>
                                    )
                                }
                            },
                        ]
                       return(
                           scope.row.purchasePrice ? (
                                <div>
                                    <span>{scope.row.purchasePrice}</span>
                                    <el-popover
                                        placement="bottom-start"
                                        width="600"
                                        trigger="hover"
                                    >
                                    <yt-table data={scope.row.priceList} columns={priceColumus} selection={false} style='margin-top:10px;' border ></yt-table>
                                    <i 
                                        class="el-icon-d-arrow-right" 
                                        style='transform: rotate(90deg);font-size: 18px;color:#409eff;vertical-align: text-bottom;float:right; cursor: pointer;'
                                        slot="reference"
                                    >
                                    </i>
                                    </el-popover>
                                </div>  
                                ) : '-'
                       )
                    }
                },
                {
                    label: "开票税点",
                    value: "tax",
                },
                {
                    label: "含税价",
                    value: "includingTaxPrice",
                    minWidth:160,
                },
                {
                    label: "采购运费",
                    value: "purchaseFreight",
                    minWidth:160,
                },
                {
                    label: "产品状态",
                    value: "productionStatus",
                    _enum:{
                        0:"正常",
                        2:"缺货",
                        1:"停产",
                        3:"清库",
                    }
                },
                {
                    label: "备注",
                    value: "productionStatusDesc",
                    minWidth:160,
                },
            ],
            tableLoading:false,
            treeTableOtions: {
                childs: 'supplierList',
                expandFunc: row => {
                    return row.supplierList && row.supplierList.length > 0
                }
            },
            opts:{
                visible:false,
                fullscreen:true,
                appendToBody:true,
                title:'添加供应商供货价',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                //width:'1200'
            },
            addEvents:{
                handleOkClick:()=>{
                    return  this.$refs.addDialog.saveBtn().then((res)=>{
                        console.log(res);
                        let { addId } = res 
                        let isEdit = false
                        let editIndex 
                        this.ruleForm.supplierList.forEach( (i,index) =>{
                            if( i.addId === addId ){
                                isEdit = true
                                editIndex = index
                            }
                        })
                        if( isEdit ){
                            this.ruleForm.supplierList.splice(editIndex,1,res)
                        }else{
                            this.ruleForm.supplierList.push(res)
                        }
                        
                        return Promise.resolve(true)
                    })
                }
            },
            validate:()=>{
                return this.$refs.addDialog.validate()
            },
            editData:"",
            selectIds:[],


           
        };
    },
    methods: {
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.imgOpts.visible = true;
        },
        handleChange(file, fileList) {
            this.fileList = fileList;
        },
        handleRemove(file, fileList) {
            this.fileList = fileList;
            this.ruleForm.imgPath = ''
        },
        onSuccess(res) {
            console.log(res);
        },
        onError(err) {
            console.log(err);
        },
        //获取重量单位的下拉
        getWeightUnitOpts(){
            this.$api[`product/purchaseGlEnumList`]({
                 enumName:"Repo-Weight-Unit"
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.weightUnitOpts = rows.map(i=>{
                    return{
                        label:i.labelCn,
                        value:i.value
                    }
                })
            })
        },
        //获取采购人员
        getPurchaseUserIdOpts(){
            this.$api[`product/permissionUserList`]({
                types:["Purchase"]
            })
            .then((data) => {
                //console.log(data);
                let  { rows} = data 
                rows.forEach(i=>{
                    if(i.type === 'Purchase'){
                        this.purchaseUserIdOpts = i.users.map(i=>{
                            return{
                                label:i.userName,
                                value:i.userId
                            }
                        })
                    }
                })
        
            })
        },
        selectChange(v){
            this.selectIds = v.map(i=>{
                return i.addId
            })
        },
        editItem(v){
            this.editData =  v
            this.opts.visible = true
            
        },
        handleEditCommand(v){
            console.log(v);
            let name = v.item.name
            if( name === '删除供应商'){
                let {addId} = v.scope.row
                this.deleteItem([addId])
            }else{
                let {addId} = v.scope.row
                if(name ==='缺货'){
                    this.changeStatus(addId,2,'缺货')
                }else if(name==='正常'){
                    this.changeStatus(addId,0,'正常')
                }else if(name==='停产'){
                    this.changeStatus(addId,1,'停产')
                }else if(name==='清库'){
                    this.changeStatus(addId,3,'清库')
                }
            }
        },
        changeStatus(v,status,name){
            this.ruleForm.supplierList.forEach( (k,index)=> {
                if( k.addId === v){
                    k.productionStatus = status
                }
            })
            this.$message.success('操作成功')
        },
        //删除供应商
        deleteItem(v){
            if( !v.length){
                this.$message.warning('请至少选择一项')
                return
            };
            v.forEach(i=>{
                this.ruleForm.supplierList.forEach( (k,index)=> {
                    if( i === k.addId ){
                        this.ruleForm.supplierList.splice(index,1)
                    }   
                })
            })
            this.$message.success('操作成功')
        },
        _submit(){
            return this.$refs.ruleForm.validate().then(()=>{
                let url = this.type === 'edit' ? 'product/prConsumablesUpdate' : 'product/prConsumablesSave'
                return this.$api[url]({
                    ...this.ruleForm
                })
            })
        },
        //获取一级分类
        getFirstType(){
            this.$api[`product/glEnumList`]({
                enumName:"Consumables-First-Type"
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.firstTypeOpts = rows.map(i=>{
                    return{
                        label:i.labelCn,
                        value:i.value
                    }
                })
                
            })
        },
        //获取二级分类
        getSecondType(){
            this.$api[`product/glEnumList`]({
                parentEnumName:"Consumables-First-Type",
                parentValue: this.ruleForm.firstType
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.secondTypeOpts = rows.map(i=>{
                    return{
                        label:i.labelCn,
                        value:i.value
                    }
                })
            })
        },
        firstTypeChange(){
            this.ruleForm.secondType = ''
            this.secondTypeOpts = []
            this.getSecondType()
        },
        getInfo(){
            this.$api[`product/prConsumablesInfo`]({
                consumablesId : this.consumablesId
            })
            .then((data) => {
                this.ruleForm = data.rows
                this.fileList = [ {name: 'food.jpg', url: data.rows.imgPath}]
                //数据里添加特殊标识符
                this.ruleForm.supplierList.forEach((i,index)=>{ 
                    i.addId = Date.now() + index + 1
                })
                this.getSecondType()
            })
        },
        handleHttpRequests() {
            let vm = this;
            const token = storage.get("local", "token");
            vm.$api[`product/constantRealPathGet`](
                {"uploadType":'store-logo'}
            )
            .then(async data => {
                let { filePath:path } = data;
                let res = await oss.batchUpload(
                    vm.fileList.filter(el => el.ossUrl == null).map(el => el.raw),
                    path,
                    OSS_CONFIG.signUrl,
                    null,
                    token
                );
                //console.log(res.join());
                this.ruleForm.imgPath = res[0]
                // eslint-disable-next-line
                    vm.fileList.forEach(async (element, index) => {
                        if (!element.ossUrl) {
                        element.ossUrl = res.shift();
                        }
                        element.url = element.ossUrl;
                    });
            })
            .catch(() => {});
        },
    },
    created() {
        this.getWeightUnitOpts()
        this.getPurchaseUserIdOpts()
        this.getFirstType()
        if( this.type === 'edit' ){
            this.getInfo()
            this.ruleForm.consumablesId = this.consumablesId
        };
        if( this.type === 'copyAdd' ){
            //console.log(this.copyData);
            for(let k in this.copyData){
                if( this.copyData.hasOwnProperty(k) && ( this.copyData[k] || this.copyData[k] ===0 ) ){
                     this.ruleForm[k] = this.copyData[k] 
                }   
            }
            if(this.ruleForm.firstType || this.ruleForm.firstType === 0){
                this.firstTypeChange()
                this.getSecondType()
            }   
            if( this.ruleForm.imgPath){
                this.fileList = [
                    {name:"",url:this.ruleForm.imgPath}
                ]
            }   
        }

    },
    watch:{
        'opts.visible'(v){
            if( !v ){
                this.editData = ''
            }
        }
    }
};
</script>

<style scoped lang="scss">
.imgPath{
    /deep/{
        .el-upload--picture-card {
            display: none;
        }
    }
}
</style>

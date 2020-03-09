<template>
    <div>
        <ElButton class="search-add" @click="opts.visible=true" type='primary'>添加</ElButton>
        <!-- <ElButton class="search-add" @click="selectDeleteItem" type='primary' plain >删除</ElButton> -->
        <el-input
                v-model.trim="searchInp"
                placeholder="请输入仓库SKU、系统SKU、中英文名称"
                style="width:300px;margin-left:10px;"
                clearable
        >
        </el-input>
        <ElButton class="search-add" @click="searchBtn" type='primary' style='margin-left:10px;' :disabled='tableLoading'>搜索</ElButton>
        <yt-table :data='tableData' :columns="columns" :treeTable='true' :treeTableOtions='treeTableOtions'  style='margin-top:10px;' border v-loading='tableLoading' @selectChange='selectChange'>
            <template slot="right">
                    <el-table-column label="操作" align="left" :width="editWidth" v-if="edits.length" >
                        <template slot-scope="scope" v-if='scope.row.productRepoPriceId || scope.row.productRepoPriceId===0'>
                        <template v-if="edits.length > 1">
                            <el-dropdown
                            v-setplain.small
                            split-button
                            type="primary"
                            @click="edits[0].fn(scope)"
                            @command="handleEditCommand"
                            >
                            <span>
                                {{ edits[0].name }}
                            </span>
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
        <Dialog :opts='opts' :events='addEvents' :validate='validate'>
            <Add  v-if='opts.visible' ref='addDialog' :productRepoPriceId='productRepoPriceId' :productRepoId='productRepoId' />
        </Dialog>
        <Dialog :opts='opts2' :events='addEvents2' :validate='validate2'>
            <Remark  v-if='opts2.visible' ref='RemarkDialog' :remarkId='remarkId' :remarkStatus='remarkStatus' />
        </Dialog>
    </div>
</template>

<script>
import { Promise } from 'q';
export default {
    components:{
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        Add:()=>import('./dialog/add'),
        Remark:()=>import('./dialog/remark'),
    },
    props:['productRepoId'],
    data() {
        return {
            tableData:[],
            treeTable: true,
            treeTableOtions: {
                childs: 'supplierList',
                expandFunc: row => {
                    return row.supplierList && row.supplierList.length > 0
                }
            },
            searchInp:'',
            opts:{
                visible:false,
                fullscreen:true,
                appendToBody:true,
                title:'添加供应商供货价',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消'
            },
            editWidth:'140px',
            edits:[
                {
                    name:"编辑",
                    show:(scope)=>{
                        return scope.row.productRepoPriceId || scope.row.productRepoPriceId === 0
                    },
                    fn:(scope)=>{
                        this.editItem(scope.row)
                    },
                    
                },
                {
                    name:"缺货",
                    show:(scope)=>{
                      return scope.row.productRepoPriceId || scope.row.productRepoPriceId === 0
                    },
                },
                {
                    name:"停产",
                    show:(scope)=>{
                       return scope.row.productRepoPriceId || scope.row.productRepoPriceId === 0
                    },
                },
                {
                    name:"清库",
                    show:(scope)=>{
                        return scope.row.productRepoPriceId || scope.row.productRepoPriceId === 0
                    },
                },
                {
                    name:"正常",
                    show:(scope)=>{
                        return scope.row.productRepoPriceId || scope.row.productRepoPriceId === 0
                    },
                },
                {
                    name:"删除供应商",
                    show:(scope)=>{
                        return scope.row.productRepoPriceId || scope.row.productRepoPriceId === 0
                    },
                }

            ],
            columns:[
                {
                    label: "仓库SKU",
                    value: "repoSku"
                },
                {
                    label: "供应商",
                    value: "supplierName",
                    expand:true,
                    minWidth:200,
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
                     minWidth:140,
                },
                {
                    label: "采购运费",
                    value: "purchaseFreight",
                     minWidth:120,
                },
                {
                    label: "产品状态",
                    value: "productionStatusName",
                },
                {
                    label: "备注",
                    value: "productionStatusDesc",
                },
            ],
            tableLoading:false,

            addEvents:{
                handleOkClick:()=>{
                    return  this.$refs.addDialog.saveBtn().then((res)=>{
                        this.getData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate:()=>{
                return this.$refs.addDialog.validate()
            },

            productRepoPriceId:'',


            opts2:{
                visible:false,
                fullscreen:false,
                appendToBody:true,
                title:'添加备注',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                size:'small'
            },
            addEvents2:{
                handleOkClick:()=>{
                    return  this.$refs.RemarkDialog.changeStatus().then((res)=>{
                        this.getData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate2:()=>{
                return this.$refs.RemarkDialog.validate()
            },
            remarkId:"",
            remarkStatus:'',

        };
    },
    methods: {
        // getDropdownBtn(row){
        //     console.log(row);
        // },
        editItem(v){
            //console.log(v);
            let {productRepoPriceId} = v
            if( !productRepoPriceId && productRepoPriceId!==0 ){
                //this.$message.warning('请选择其子级修改')
                return
            }
            this.productRepoPriceId = productRepoPriceId
            this.opts.visible = true
            
        },
        searchBtn(){
            this.getData()
        },
        selectChange(){

        },
        handleEditCommand(v){
            console.log(v);
            let name = v.item.name
            if( name === '删除供应商'){
                let {productRepoPriceId} = v.scope.row
                this.deleteItem(productRepoPriceId)
            }else{
                this.opts2.visible  = true
                let {productRepoPriceId} = v.scope.row
                if(name ==='缺货'){
                    this.remarkId = productRepoPriceId
                    this.remarkStatus = 2
                    
                }else if(name==='正常'){
                    this.remarkId = productRepoPriceId
                    this.remarkStatus = 0
                    
                }else if(name==='停产'){
                    this.remarkId = productRepoPriceId
                    this.remarkStatus = 1
                  
                }else if(name==='清库'){
                    this.remarkId = productRepoPriceId
                    this.remarkStatus = 3
                  
                }
            }
        },
        //删除供应商
        deleteItem(v){
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api[`product/prProductRepoPurchaseSupplierDelete`]({
                    productRepoPriceId:v
                })
                .then((data) => {
                    this.getData()
                })
            }).catch(() => {

            });
        },
        getData(){
            this.tableLoading = true
            this.$api[`product/prProductRepoPurchaseSupplierGet`]({
                productRepoId:this.productRepoId,
                search : this.searchInp
            })
            .then((data) => {
                this.tableLoading = false
                let supplierInfo = data.rows
                let childs = supplierInfo.childs
                delete supplierInfo.childs
                childs.unshift(supplierInfo)
                this.tableData = childs
                //console.log(childs);
                
            })
        },
        
    },
    created() {
        this.getData()
    },
    watch:{
        'opts.visible'(v){
            if(!v){
                this.productRepoPriceId = null
            }
        }
    }
};
</script>

<style scoped lang="scss">

</style>

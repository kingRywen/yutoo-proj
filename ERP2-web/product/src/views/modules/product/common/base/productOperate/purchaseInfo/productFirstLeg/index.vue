<template>
    <div>
        <ElButton class="search-add" @click="opts.visible=true" type='primary'>选择添加头程</ElButton>
        <div class='filter'>
            <div>筛选条件:</div>
            <div>
                <el-radio-group v-model="search" @change='searchChange'>
                    <el-radio :label="0">所有</el-radio>
                    <el-radio :label="1">空运</el-radio>
                    <el-radio :label="2">海运</el-radio>
                </el-radio-group>
            </div>
        </div>
        <yt-table :data='tableData' :columns="columns"  style='margin-top:10px;' border v-loading='tableLoading' @selectChange='selectChange'>
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
        <!-- 添加头程 -->
        <Dialog :opts='opts' :events='addEvents' :validate='validate'>
            <Add  v-if='opts.visible' ref='addDialog' :productRepoId='productRepoId' />
        </Dialog>
        <!-- 修改头程 -->
        <Dialog :opts='opts2' :events='addEvents2' :validate='validate2'>
            <AddIn  v-if='opts2.visible' ref='addInDialog' :firstTransportId='firstTransportId' />
        </Dialog>
    </div>
</template>

<script>
export default {
    props:['productRepoId'],
    components:{
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        Add:()=>import('./dialog/add'),
        AddIn:()=>import('./dialog/addIn'),
    },
    data() {
        return {
            opts:{
                visible:false,
                fullscreen:true,
                appendToBody:true,
                title:'选择头程',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消'
            },
            search:0,
            tableData:[],
            tableLoading:false,
            editWidth:'140px',
            edits:[
                {
                    name:"编辑",
                    show:(scope)=>{
                        return true
                    },
                    fn:(scope)=>{
                        this.editItem(scope.row)
                    },
                    
                },
                {
                    name:"删除",
                    show:(scope)=>{
                        return true
                    },
                },
            ],
            columns:[
                {
                    label:"到达国家",
                    value:'countryName',
                },
                {
                    label:"运输方",
                    value:'transportationName',
                },
                {
                    label:"运输方式",
                    value:'transportTypeName',
                },
                {
                    label:"运输运费",
                    value:'freight',
                     render(h,scope){
                        //console.log(scope.row);
                        let priceColumus= [
                            {
                                label: "重量",
                                value: "weightOrVolumeStart",
                                render(h,scope){
                                    return(
                                        <span>{ scope.row.weightOrVolumeUnitName + scope.row.weightOrVolumeStart + '~' + scope.row.weightOrVolumeUnitName + scope.row.weightOrVolumeEnd}</span>
                                    )
                                }
                            },
                            {
                                label: "费用",
                                value: "price",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.price}</span>
                                    )
                                }
                            },
                            {
                                label: "均价",
                                value: "averagePrice",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.averagePrice}</span>
                                    )
                                }
                            },
                        ]
                       return(
                           scope.row.freight ? (
                                <div>
                                    <span>{scope.row.freight}</span>
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
                    label:"运输均价(RMB)",
                    value:'averagePrice',
                },
                {
                    label:"运输天数",
                    value:'transportDays',
                },
            ],
            addEvents:{
                handleOkClick:()=>{
                    return  this.$refs.addDialog.saveBtn().then((res)=>{
                        this.getTableData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate:()=>{
                return this.$refs.addDialog.addValidate()
            },


            opts2:{
                visible:false,
                fullscreen:true,
                appendToBody:true,
                title:'修改头程',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消'
            },
            addEvents2:{
                 handleOkClick:()=>{
                    return  this.$refs.addInDialog.editBtn().then((res)=>{
                        this.getTableData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate2:()=>{
                return this.$refs.addInDialog.validate()
            },
            firstTransportId:'',


        };
    },
    methods: {
        selectChange(){

        },
        editItem(v){
            console.log(v);
            let {firstTransportId} = v
            this.firstTransportId = firstTransportId
            this.opts2.visible = true
        },
        handleEditCommand(v){
            let name = v.item.name 
            if( name === '删除' ){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$api[`product/prProductRepoFirstTransportDelete`]({
                        productRepoFirstTransportIds: [v.scope.row.productRepoFirstTransportId]
                    }).then(()=>{
                        this.getTableData()
                    })
                }).catch(() => {
                    
                });
            }
           
        },
        searchChange(v){
            this.getTableData()
        },
        getTableData(){
            this.tableLoading = true
            this.$api[`product/prProductRepoFirstTransportGet`]({
                productRepoId :  this.productRepoId,
                search : this.search === 0 ? null : this.search
            })
            .then((data) => {
                let {rows} = data
                this.tableData = rows
                this.tableLoading = false
            })
        },
    },
    created() {
        this.getTableData()
    },
};
</script>

<style scoped lang="scss">
.filter{
    display: flex;
    line-height: 50px;
    background-color: rgba(243, 243, 243, 1);
    margin-top:10px;
    &>div:first-child{
        margin-left:20px;
    }
    &>div:last-child{
        margin-left:20px;
    }
}
</style>

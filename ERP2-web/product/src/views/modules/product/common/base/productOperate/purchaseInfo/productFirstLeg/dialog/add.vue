<template>
    <div>
        <div>
            <ElButton  type='primary' @click='opts.visible=true'>添加头程</ElButton>
            <ElButton  @click="deleteItem" type='primary' plain>删除</ElButton>
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
        </div>
        <Dialog :opts='opts' :events='addEvents' :validate='validate'>
            <AddIn  v-if='opts.visible' ref='addDialog' />
        </Dialog>
    </div>
</template>

<script>
export default {
    components:{
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        AddIn:()=>import('./addIn')
    },
    props:['productRepoId'],
    data() {
        return {
             opts:{
                visible:false,
                fullscreen:false,
                appendToBody:true,
                title:'添加头程',
                top:'8vh',
                okBtnText:'确定',
                cancelBtnText:'取消',
                width:'70%',
                height:'500px'
            },
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
                    label:"计价方式",
                    value:'calculationTypeName',
                },
                {
                    label:"体积/重量",
                    value:'baseNumber',
                },
                {
                    label:"费用",
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
                                label: "单价",
                                value: "price",
                                render(h,scope){
                                    return(
                                        <span>{scope.row.priceUnitName + scope.row.price}</span>
                                    )
                                }
                            },
                        ]
                        return(
                            scope.row.priceList ? (
                                <div>
                                    <span>{scope.row.priceList[0].weightOrVolumeStart +'~'+scope.row.priceList[0].weightOrVolumeEnd}</span>
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
                    label:"运输天数",
                    value:'transportDays',
                },
            ],
            tableLoading:false,
            editWidth:'160px',
            edits:[],
            tableData:[],

            selectIds:[],

            addEvents:{
                handleOkClick:()=>{
                    return  this.$refs.addDialog.saveBtn().then((res)=>{
                        this.getTableData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate:()=>{
                return this.$refs.addDialog.validate()
            },

        };
    },
    methods: {
        deleteItem(){
            if(!this.selectIds.length){
                this.$message.warning('请至少选择一项')
                return
            }
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$api[`product/glFirstTransportRemove`]({
                    firstTransportIds:this.selectIds
                }).then(()=>{
                    this.getTableData()
                })
            }).catch(() => {
                  
            });
        },
        selectChange(v){
            console.log(v);
            this.selectIds = v.map(i=>i.firstTransportId)
        },
        getTableData(){
            this.$api[`product/glFirstTransportGetComboBox`]()
            .then((data) => {
                let {rows} = data
                this.tableData = rows
                //console.log(data);
            })
        },
        saveBtn(){
            if(!this.firstTransportIds.length){
                this.$message.warning('请至少添加一项')
                return
            }
            if(!this.selectIds.length){
                this.$message.warning('请至少选择一项')
                return
            }
            return this.$api[`product/prProductRepoFirstTransportSave`]({
                productRepoId : this.productRepoId,
                firstTransportIds : this.selectIds
            })
        },
    },
    created() {
        this.getTableData()
    },
    computed:{
        addValidate(){
            return ()=>{
                return  this.firstTransportIds.length ? Promise.resolve(true) : Promise.reject(false) 
            }
        },
        firstTransportIds(){
            return this.tableData.map(i=>{
                return i.firstTransportId
            })
        }
    }
};
</script>

<style scoped lang="scss">

</style>

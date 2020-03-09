<template>
    <div>
        <div>
            <ElButton class="search-add" @click="opts.visible=true;editIds = null" type='primary'>添加</ElButton>
            <ElButton class="search-add" @click="selectDeleteItem" type='primary' plain >删除</ElButton>
            <el-input
                v-model.trim="searchInp"
                placeholder="请输入仓库SKU、系统SKU、中英文名称"
                style="width:300px;margin-left:10px;"
                clearable
            >
            </el-input>
            <ElButton class="search-add" @click="searchBtn" type='primary' style='margin-left:10px;' :disabled='tableLoading'>搜索</ElButton>
            <yt-table :data='tableData' :columns='columns' style='margin-top:10px;' border v-loading='tableLoading' @selectChange='selectChange'>
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
            <Dialog :opts='opts' :events='addEvents' :validate='validate'>
                <Add :productRepoId='productRepoId'  v-if='opts.visible' ref='addDialog' v-on="$listeners" :editIds='editIds' />
            </Dialog>
        </div>
    </div>
</template>

<script>
import { Promise } from 'q';
import { spawn } from 'child_process';
export default {
    props:['productRepoId'],
    components:{
        Dialog:()=>import('Components/MainLayout/src/dialog'),
        Add:()=>import('./dialogs/add')
    },
    data() {
        let vm = this
        return {
            searchInp:'',
            tableData:[],
            columns:[
                {
                    label:"仓库SKU",
                    value:'repoSku'
                },
                {
                    label:"原材料SKU",
                    value:'name',
                    render(h,scope){
                        let {rawMaterialInfo ,rawMaterialId} = scope.row
                        let span = []
                        rawMaterialInfo.forEach(i=>{
                            span.push(i.name)
                        })
                        return(
                            <div>
                                {
                                    rawMaterialInfo.map(i=>{
                                        return (
                                            <el-tag  closable onClose={()=>{vm.deleteOne(rawMaterialId,i.id)}} style='margin-left:6px;'>{i.name}</el-tag>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                },
            ],
            editWidth:'200px',
            edits:[
                {
                    name:"编辑原材料",
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
                }

            ],
            tableLoading:false,


            opts:{
                visible:false,
                fullscreen:true,
                appendToBody:true,
                title:'添加原材料',
                top:'12vh',
                okBtnText:'确定',
                cancelBtnText:'取消'
            },
            addEvents:{
                handleOkClick:()=>{
                    return this.$refs.addDialog._submit().then(()=>{
                        this.getData()
                        return Promise.resolve(true)
                    })
                }
            },
            validate:()=>{
                return this.$refs.addDialog.validate()
            },

            selectIds:[],

            editIds:'',
        };
    },
    methods: {
        deleteOne(rawMaterialId,id){
            this.deleteItem(rawMaterialId,id)
        },
        editItem(v){
            console.log(v);
            let {rawMaterialInfo} = v;
            let arr = rawMaterialInfo.map(i=>{
                return{
                    id:i.id,
                    count:i.count
                }
            })
            this.editIds = arr
            this.opts.visible = true
        },
        selectDeleteItem(){
            if(!this.selectIds.length){
                this.$message.warning('请至少选择一项')
                return
            }
            this.deleteItem(this.selectIds)
        },
        selectChange(v){
            this.selectIds = v.map(i=>i.rawMaterialId)
        },
        deleteItem(v,id){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let rawMaterialIds = Array.isArray(v) ? v : [v]
                this.$api[`product/prProductRepoMaterialDelete`]({
                    rawMaterialIds ,
                    id,
                }).then(res=>{
                    this.getData()
                })
            })
        },
        searchBtn(){
            this.getData()
        },
        handleEditCommand(v){
            console.log(v);
            let rawMaterialId = v.scope.row.rawMaterialId
            this.deleteItem(rawMaterialId)
        },
        getData(){
            this.tableLoading = true
            this.$api[`product/prProductRepoMaterialGet`]({
                productRepoId:this.productRepoId,
                search:this.searchInp
            })
            .then((data) => {
                console.log(data);
                this.tableLoading = false
                this.tableData = data.rows
            })
        }
        
    },
    created() {
       this.getData()
    },
};
</script>

<style scoped lang="scss">

</style>

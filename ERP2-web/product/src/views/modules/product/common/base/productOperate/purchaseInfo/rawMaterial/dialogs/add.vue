<template>
    <div>
        <el-form :model="formInline"  size='small' label-width="80px" :label-position="'left'" :rules='rules' ref='formInline'>
            <el-form-item label="选择SKU" prop='selectSku'>
                <el-select v-model="formInline.selectSku" placeholder="请选择" style='width:100%;' clearable multiple collapse-tags >
                    <el-option
                    v-for="item in skuOpts"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class='search-cont'>
            <div>筛选条件</div>
            <div>
                <el-input
                    v-model.trim="searchInp"
                    placeholder="请输入仓库SKU、产品名称"
                    style="width:300px;margin-left:10px;"
                    clearable
                >
                </el-input>
            </div>
            <div>
                <ElButton class="search-add" @click="searchBtn" type='primary' style='margin-left:10px;' :disabled='searchLoading'>搜索</ElButton>
            </div>
        </div>
        <div>
            <yt-table :data='tableData' :columns='columns' style='margin-top:10px;' border v-loading='searchLoading' :reserveSelection='"productRepoId"' @selectChange='selectChange' ref='table'></yt-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNumber"
                :page-sizes="[5,10, 20, 30, 40]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                style='margin-top:10px;'
                :total="total">
            </el-pagination>
        </div>
        <div class='select'>
            <p>已选择列表</p>
            <yt-table :data='selecTableData' :columns='selectColumns' style='margin-top:10px;' border ></yt-table>
        </div>
    </div>
</template>

<script>
import { Promise } from 'q';
export default {
    props:['productRepoId','editIds'],
    data() {
        let vm = this
        return {
                formInline:{
                    selectSku:[],
                },
                rules:{
                    selectSku:[
                        { required: true, message: '请选择', trigger: ['blur','change'] },
                    ]
                },
                skuOpts:[],
                selectSku:null,
                searchInp:'',

                columns:[
                    {
                        label:"图片",
                        value:'image',
                        img:true
                    },
                    {
                        label:"产品名称",
                        value:'nameCn',
                    },
                    {
                        label:"仓库SKU",
                        value:'repoSku',
                    },
                    {
                        label:"系统SKU",
                        value:'sysSku',
                    },
                ],
                tableData:[],
                pageNumber:1,
                pageSize:5,
                total:0,
                searchLoading:false,


                selecTableData:[],
                selectColumns:[
                    {
                        label:"图片",
                        value:'image',
                        img:true
                    },
                    {
                        label:"产品名称",
                        value:'nameCn',
                    },
                    {
                        label:"仓库SKU",
                        value:'repoSku',
                    },
                    {
                        label:"系统SKU",
                        value:'sysSku',
                    },
                    {
                        label:"数量",
                        value:'num',
                        render(h,scope){
                            return(
                                <input 
                                    value={scope.row.num} 
                                    placeholder="请输入数量" 
                                    onInput={(e)=>vm.numInp(e,scope.$index)} 
                                    type="text"  
                                    style='width: 100%;height: 30px;padding:0 5px;box-sizing:border-box;'
                                >
                                </input>
                            )
                        }
                    },
                ],

                noNumItem:[],//没填写数量的数组

        };
    },
    methods: {
        numInp(e,v){
            if(isNaN(Number(e.target.value))){
                e.target.value = ''
            }
            let val = !e.target.value ? '' : +e.target.value
            this.$set(this.selecTableData[v],'num',val)
        },
        selectChange(val){
            this.selecTableData = val
            //console.log(val);
        },
        //获取表格的数据
        getTableData(){
            this.searchLoading = true
            this.$api[`product/prProductRepoPartsGet`]({
                type:2,
                pageSize : this.pageSize,
                pageNumber:this.pageNumber,
                search:this.searchInp
            })
            .then((data) => {
                console.log(data);
                this.searchLoading = false
                let {rows} = data
                this.tableData = rows
                if(this.editIds){ //回显已选过的数据
                    //console.log(this.editIds);
                    this.editIds.forEach(i=>{
                        this.tableData.forEach(k=>{
                            if(k.productRepoId===i.id){
                                k.num = i.count
                                this.$refs.table.$refs.table.toggleRowSelection(k);
                            }
                        })
                    })
                }
                this.pageNumber = data.pageNo
                this.pageSize = data.pageSize
                this.total = data.total
            })  
        },
        getOpts(){
            this.$api[`product/prProductRepoVariantGet`]({
                productRepoId:this.productRepoId
            })
            .then((data) => {
                console.log(data);
               let {rows} = data
                let child = rows.childs.map(i=> {return {repoSku:i.repoSku,id:i.productRepoId} })
                let arr = [{repoSku:rows.repoSku,id:rows.productRepoId},...child]
                //console.log(arr);
                this.skuOpts = arr.map(i=>{
                    return{
                        label:i.repoSku,
                        value:i.id
                    }
                })
            })
        },
        searchBtn(){
            this.getTableData()
        },
        handleSizeChange(v){
            this.pageSize = v
            this.getTableData()
        },
        handleCurrentChange(v){
            this.pageNumber = v
            this.getTableData()
        },
        _submit(){
            let materialList = this.selecTableData.map(i=>{
                return {id:i.productRepoId,num:i.num}
            })
            return this.$api[`product/prProductRepoMaterialSave`]({
                productRepoIds : this.formInline.selectSku,
                materialList,
            })
        },
    },
    created() {
        this.getTableData()
        this.getOpts()
    },
    computed:{
        validate(){
            return () => {
                //debugger
                let arr = []
                arr.push(this.$refs.formInline.validate())
                if( !this.selecTableData.length){
                    this.$message.warning('请选择要添加的原材料')
                    arr.push(Promise.reject(false))
                }
                if(this.noNumItem.length){
                    this.$message.warning(`请完整填写${this.noNumItem.join(' , ')}原料的数量`)
                    arr.push(Promise.reject(false))
                }
                //console.log(Promise.all(arr));
                return Promise.all(arr)
            }
        },
    },
    watch:{
        selecTableData: {
            handler(newName, oldName) {
                let indexArr = []
                newName.forEach((i,index)=>{
                    if(!i.num){
                        indexArr.push(index+1)
                    }
                })
                this.noNumItem = indexArr
            },
            immediate: true,
            deep: true
        }
    }
    
};
</script>

<style scoped lang="scss">
.search-cont{
    display: flex;
    line-height: 40px;
}
.select{
    margin-top: 10px;
    /deep/{
        input::placeholder {
            color: #999;
            font-size: 14px;
            text-align: left;
        }
    }
}

</style>

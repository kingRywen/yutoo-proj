<template>
    <div>
        <!-- <new-form ref="form" :valid-success.sync="validSuccess" v-model="ruleForm" label-width="100px" :form-schema="dataFormSchema" ></new-form> -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"  size='small'>
            <el-form-item label="关键词" prop="word">
                <el-input v-model="ruleForm.word" clearable type='textarea' :rows="5" :maxlength='255' placeholder="多个换行输入"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="configConfigSensitiveDesc">
                <el-input v-model="ruleForm.configConfigSensitiveDesc" clearable type='textarea' :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="mixVal">
                <div style='display:flex;'>
                    <el-select v-model="ruleForm.mixVal" placeholder="请选择" style='width:100%;margin-right:10px;' >
                        <el-option
                        v-for="item in sensitiveWordTypeIdOpts"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click='openDialog()'>类别管理</el-button>
                </div>
            </el-form-item>
        </el-form>  
        <Dialog :opts='opts'> 
            <el-form class="new-form-2" ref="searchForm" size="small" :model="searchForm" :inline="true">
                <el-form-item label='类别名称' style='width:50%;'>
                    <el-input v-model.trim="searchForm.keyword" placeholder="请输入" style='width:100%;' clearable @clear='searchClear' class='input-search'> </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch" :disabled='tabelLoading'>搜索</el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-button size='small' type="primary" plain @click='opts2.visible=true'>添加</el-button>
            </div>
            <div style='margin-top:10px;'>
                <YtTable :data='tableData' :columns='columns' :selection='false' border v-loading='tabelLoading'>
                     <template slot="right">
                        <el-table-column label="操作" :width="editWidth" v-if="editBtns.length">
                        <template slot-scope="scope">
                            <template v-for="(item, index) in editBtns">
                            <template v-if="typeof item.show === 'boolean' ? item.show : item.show(scope)">
                                <template v-if="!item.childs">
                                <el-button
                                    v-if="!item.icon"
                                    class="right-btns"
                                    type="text"
                                    :key="index"
                                    :style='{width:item.width}'
                                    @click="item.fn(scope, item)"
                                    :icon="item.icon"
                                >{{item.name}}</el-button>
                                <el-tooltip v-else :content="item.name" placement="top">
                                    <el-button
                                    class="right-btns"
                                    type="text"
                                    :key="index"
                                    @click="item.fn(scope, item)"
                                    :icon="item.icon"
                                    ></el-button>
                                </el-tooltip>
                                </template>

                                <el-button
                                type="text"
                                v-else-if="(item.childs(scope)).length === 1"
                                :key="index"
                                @click="item.fn(scope, item, (item.childs(scope))[0].name,(item.childs(scope))[0].value)"
                                >{{(item.childs(scope))[0].name}}</el-button>

                                <el-dropdown
                                v-else-if="(item.childs(scope)).length !== 0"
                                split-button
                                type="text"
                                @click="item.fn(scope, item,item.name)"
                                @command="c => item.fn(scope, item,c)"
                                >
                                {{(item.childs(scope))[0].name}}
                                <el-dropdown-menu slot="dropdown">
                                    <template v-for="(i, subIndex) in (item.childs(scope))">
                                    <el-dropdown-item v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
                                    </template>
                                </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                            </template>
                        </template>
                        </el-table-column>
                    </template>
                </YtTable>
            </div>
        </Dialog>
        <Dialog :opts='opts2' :events='addEvents' :validate='addValidate'> 
             <el-form  ref="addForm" size="small" :model="addForm" :rules='addRules' v-if='opts2.visible' >
                <el-form-item label='类别名称' label-width='80px' prop='typeName'>
                    <el-input v-model.trim="addForm.typeName" placeholder="请输入" style='width:100%;'></el-input>
                </el-form-item>
            </el-form>
        </Dialog>

    </div>
</template>

<script>
import Dialog from "Components/MainLayout/src/dialog"
export default {
    props:['sensitiveWordId','type'],
    components:{
        Dialog
    },
    data() {
        return {
            opts:{
                visible:false,
                width:'70%',
                appendToBody:true,
                title:'类别管理',
                top:'12vh',
            },
            ruleForm:{
                word:"",
                configConfigSensitiveDesc:"",
                mixVal:"", //id和flag的结合体
            },
            rules:{
                word:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                // configConfigSensitiveDesc:[
                //     { required: true, message: '请输入', trigger: 'blur' },
                // ],
                mixVal:[
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
            },
            sensitiveWordTypeIdOpts:[],


            searchForm:{
                keyword:''
            },
            tabelLoading:false,
            tableData:[],
            columns:[
                {
                    label: '类别名称',
                    value: 'typeName',
                },
                {
                    label: '添加人员',
                    value: 'userName',
                },
                {
                    label: '添加时间',
                    value: 'createTime',
                },
            ],
            editBtns:[
                {
                    name:'编辑',
                    show:(scope)=>{
                        return scope.row.sensitiveWordTypeFlag !==1
                    },
                    width:'50px',
                    fn:(scope)=>{
                        this.editBtn(scope.row)
                    }
                },
                {
                    name:'删除',
                    width:'50px',
                    show:(scope)=>{
                         return scope.row.sensitiveWordTypeFlag !==1
                    },
                    fn:(scope)=>{
                        this.deleteItem(scope.row.sensitiveWordTypeId)
                    }
                },
            ],
            editWidth:'150px',


            opts2:{
                visible:false,
                appendToBody:true,
                title:'添加类别',
                size:'small',
                okBtnText:"确定",
                cancelBtnText:'取消',
                top:'14vh'
            },
            //添加类别
            addForm:{
                typeName:''
            },
            addEvents:{
                handleOkClick:()=>{
                    return this.addTypeName()
                }
            },
            addValidate:()=>{
                return this.$refs.addForm.validate()
            },
            addRules: {
                typeName: [
                        { required: true, message: '请输入', trigger: ['blur','change'] },
                    ],
                }
        }
    },
    methods: {
        _submit(){
            return this.$refs.ruleForm.validate().then(()=>{
                let params = JSON.parse(JSON.stringify(this.ruleForm))
                let {mixVal} = params
                let sensitiveWordTypeId = mixVal.split('+')[0]
                let sensitiveWordTypeFlag = mixVal.split('+')[1]
                delete params.mixVal
                params.sensitiveWordTypeId = sensitiveWordTypeId
                params.sensitiveWordTypeFlag = sensitiveWordTypeFlag
                if( this.type !== 'edit' ){
                    params.wordArray = params.word ? params.word.split('\n')
                                        .map(el => el.trim())
                                        .filter(el => el !== ''): []
                    delete params.word
                }
                let url = this.type === 'edit' ? 'product/PrConfigSensitiveWordMUpdate' : 'product/PrConfigSensitiveWordMSave'
                return this.$api[url](
                    params
                )
            })
        },
        getTypeOpt(){
            return this.$api[`product/PrConfigSensitiveWordTypeMDropDown`]()
            .then((data) => {
                //console.log(data);
                let { rows} = data
                rows.forEach(i=>{
                    i.mixVal = i.key + "+" +i.flag
                })
                let arr = rows.map(i=>{
                    return {label:i.value,value:i.mixVal}
                })
                this.sensitiveWordTypeIdOpts = arr
            })
        },
        onSearch(){
            this.getTableData()
        },
        searchClear(){
            this.getTableData()
        },
        getTableData(v){
            this.tabelLoading = true
            this.$api[`product/PrConfigSensitiveWordTypeMList`]({
                pageNumber:1,
                pageSize:10,
                ...this.searchForm
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.tableData = rows
                this.tabelLoading = false
            }).catch(err=>{
                this.tabelLoading = false
            })
        },
        addTypeName(v){
            let url = this.addForm.sensitiveWordTypeId  || this.addForm.sensitiveWordTypeId === 0 ? "product/PrConfigSensitiveWordTypeMUpdate" : 'product/PrConfigSensitiveWordTypeMSave'
            this.$api[url]({
                ...this.addForm
            })
            .then((data) => {
                this.addForm.typeName = ''
                this.getTableData()
                this.getTypeOpt()
            })
        },
        editBtn(v){
            //console.log(v);
            this.$api[`product/PrConfigSensitiveWordTypeMInfo`]({
                id:v.sensitiveWordTypeId
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                this.opts2.visible = true
                this.addForm = rows
            })
        },
        deleteItem(v){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idArray = Array.isArray(v) ? v : [v]
                this.$api[`product/PrConfigSensitiveWordTypeMRemove`]({
                    idArray
                }).then(res=>{
                    this.getTableData()
                    this.getTypeOpt()
                })
            })
        },
        //获取详情
        getInfo(){
            this.$api[`product/PrConfigSensitiveWordMInfo`]({
                id:this.sensitiveWordId
            })
            .then((data) => {
                //console.log(data);
                let {rows} = data
                let {sensitiveWordTypeId,sensitiveWordTypeFlag,...info} = rows
                this.ruleForm = info
                let mixVal = sensitiveWordTypeId + '+' + sensitiveWordTypeFlag
                this.$set(this.ruleForm,'mixVal',mixVal)
            })
        },
        openDialog(){
            this.opts.visible = true ;
            this.$nextTick(()=>{
                let inp =  document.querySelector('.input-search input')
                inp.onkeydown = function(e){
                    var e = e || event;
                    var currKey = e.keyCode || e.which || e.charCode;//支持IE,FireFox
                    if (currKey == 13) {
                        return false;
                    }
                }
            })
        }
    },
    created() {
        this.getTableData()
        this.getTypeOpt()
        if(this.type === 'edit'){
            this.getInfo()
        }
    },  
    watch:{
        'opts2.visible'(v){
            if(!v)this.addForm = {}
        }
    },
};
</script>

<style scoped lang="scss">
.new-form-2{
    /deep/{
        .el-form-item__content{
            width:81%;
        }
    }
}
</style>

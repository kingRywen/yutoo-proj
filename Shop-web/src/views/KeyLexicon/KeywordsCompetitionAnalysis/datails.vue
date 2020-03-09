<template>
    <div>
       <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :editBtns="editBtns"
            :columns="columns"
             @requestSuccess='requestSuccess'
            :searchFunc='searchFunc'
            @selectChange='selectChange' 
            @searchTrueData='searchTrueData'
            url="taskKeywordCompeteDetails"
            ref="layout"
		>
             <div slot="search">
                <el-form :label-position="'center'" :model="formInline" ref='formInline' :inline="true" :rules='rules'>

                    <div class='cont100'>
                        <el-form-item label="搜索" prop='keyword' style='width:100%'> 
                            <el-input v-model.trim="formInline.keyword"  placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" ></el-input>
                        </el-form-item>
                        <el-form-item label="包含" prop='include' style='width:100%'>
                            <el-input v-model.trim="formInline.include" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" ></el-input>
                        </el-form-item>
                        <div class='no-Include'>
                            <el-form-item label="不包含" prop='barring' style='width:100%'>
                                <el-input v-model.trim="formInline.barring" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" ></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label="排除" prop='exclude' style='width:100%'>
                            <el-input v-model.trim="formInline.exclude" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3"></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item label="产品数" prop='productMin'>
                        <el-input v-model.trim="formInline.productMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='productMax'>
                        <el-input v-model.trim="formInline.productMax" size='small' placeholder="请输入大值" ></el-input>
                    </el-form-item>

                    <el-form-item label="Google搜索量" prop='googleMin'>
                        <el-input v-model.trim="formInline.googleMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='googleMax'>
                        <el-input v-model.trim="formInline.googleMax" size='small' placeholder="请输入大值" ></el-input>
                    </el-form-item>

                    <el-form-item label="MerchantWords搜索量" prop='merchantwordsMin'>
                        <el-input v-model.trim="formInline.merchantwordsMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='merchantwordsMax'>
                        <el-input v-model.trim="formInline.merchantwordsMax" size='small' placeholder="请输入大值" ></el-input>
                    </el-form-item>

                     <el-form-item label="速卖通搜索量" prop='aliexpressMin'>
                        <el-input v-model.trim="formInline.aliexpressMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='aliexpressMax'>
                        <el-input v-model.trim="formInline.aliexpressMax" size='small' placeholder="请输入大值" ></el-input>
                    </el-form-item>

                    <el-form-item>
                            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">搜索</el-button>
                            <el-button size="small" type="primary" plain @click="resetSearch" :loading="tableLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>

            </div>
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    data() {
        let vm=this;
        var validatePass = (rule, value, callback) => {

            let field=rule.field;
            
            if( isNaN(Number(value))){
                return callback(new Error('请输入数字'));
            };
            if( field==='productMin' || field==='productMax' ){
                if( vm.formInline.productMin && vm.formInline.productMax) {
                    if( field==='productMin' ){
                        if(  Number(vm.formInline.productMin) >= Number(vm.formInline.productMax) ){
                                vm.formInline.productMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='productMax' ){
                        if(  Number(vm.formInline.productMin) >= Number(vm.formInline.productMax) ){
                                vm.formInline.productMax = ''
                                return callback(new Error('大值需大于小值'));
                        };
                    }
                    
                };
            };
            if( field==='googleMin' || field==='googleMax' ){
                if( vm.formInline.googleMin && vm.formInline.googleMax) {
                    if( field==='googleMin' ){
                        if(  Number(vm.formInline.googleMin) >= Number(vm.formInline.googleMax) ){
                                vm.formInline.googleMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='googleMax' ){
                        if(  Number(vm.formInline.googleMin) >= Number(vm.formInline.googleMax) ){
                                vm.formInline.googleMax = ''
                                return callback(new Error('大值需大于小值'));
                        };
                    }
                    
                };
            };
            if( field==='merchantwordsMin' || field==='merchantwordsMax' ){
                if( vm.formInline.merchantwordsMin && vm.formInline.merchantwordsMax) {
                    if( field==='merchantwordsMin' ){
                        if(  Number(vm.formInline.merchantwordsMin) >= Number(vm.formInline.merchantwordsMax) ){
                                vm.formInline.merchantwordsMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='merchantwordsMax' ){
                        if(  Number(vm.formInline.merchantwordsMin) >= Number(vm.formInline.merchantwordsMax) ){
                                vm.formInline.merchantwordsMax = ''
                                return callback(new Error('大值需大于小值'));
                        };
                    }
                    
                };
            };
            if( field==='aliexpressMin' || field==='aliexpressMax' ){
                if( vm.formInline.aliexpressMin && vm.formInline.aliexpressMax) {
                    if( field==='aliexpressMin' ){
                        if(  Number(vm.formInline.aliexpressMin) >= Number(vm.formInline.aliexpressMax) ){
                                vm.formInline.aliexpressMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='aliexpressMax' ){
                        if(  Number(vm.formInline.aliexpressMin) >= Number(vm.formInline.aliexpressMax) ){
                                vm.formInline.aliexpressMax = ''
                                return callback(new Error('大值需大于小值'));
                        };
                    }
                    
                };
            };
             callback()
        }
        return {
            edits:[
                {
                    name: "链接",
                    icon: "el-icon-share",
                    show: scope => {
                            return  true//scope.row.keywordUrl;
                    },
                    fn: (scope) => {
                        //console.log(scope);
                        window.open(scope.row.keywordUrl) 
                    }
                }
            ],
            editBtns:[
                {
                    name: '复制',
                    //showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        this.copyKeyword()
                    }
                },
                {
                    name: '导出',
                    showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    fn: ()=>{
                        return this.exportBtn();
                    }
                },
                {
                    name: '加入词库',
                   // showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        this.addLexicon();
                    }
                },
                {
                    name: '导入数据',
                    //showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    fn: ()=>{
                        this.importBtn();
                    }
                },
            ],
            columns:[
                {
                    label:'关键词',
                    value:'keyword',
                    minWidth:200,
                },
                {
                    label:'Google',
                    // value:'Google',
                    merge:[
                        {
                            label:'搜索量',
                            value:'searchGoogle',
                            sortable:'custom'
                        },
                        {
                            label:'竞争度',
                            value:'competitiveGoogle',
                            sortable:'custom'
                        },
                    ]
                },
                {
                    label:'速卖通',
                    // value:'Google',
                    merge:[
                        {
                            label:'搜索量',
                            value:'searchAliexpress',
                            sortable:'custom'
                        },
                        {
                            label:'竞争度',
                            value:'competitiveAliexpress',
                            sortable:'custom'
                        },
                    ]
                },
                {
                    label:'merchantwords',
                    // value:'Google',
                    merge:[
                        {
                            label:'搜索量',
                            value:'searchMerchantwords',
                            sortable:'custom'
                        },
                        {
                            label:'竞争度',
                            value:'competitiveMerchantwords',
                            sortable:'custom'
                        },
                    ]
                },
                {
                    label:'产品数量',
                    value:'productAmount',
                    minWidth:200,
                     sortable:'custom'
                },
            ],
            formInline:{
               keyword:'',
               include:'',
               barring:'',
               exclude:'',

               productMin:'',
               productMax:'',
               googleMin:'',
               googleMax:'',
               merchantwordsMin:'',
               merchantwordsMax:'',
               aliexpressMin:'',
               aliexpressMax:'',

            },
            //搜索的验证规则
            rules:{
                productMin:[{ validator: validatePass, trigger: ['blur'] }],
                productMax:[{ validator: validatePass, trigger: ['blur'] }],
                googleMin:[{ validator: validatePass, trigger: ['blur'] }],
                googleMax:[{ validator: validatePass, trigger: ['blur'] }],
                merchantwordsMin:[{ validator: validatePass, trigger: ['blur'] }],
                merchantwordsMax:[{ validator: validatePass, trigger: ['blur'] }],
                aliexpressMin:[{ validator: validatePass, trigger: ['blur'] }],
                aliexpressMax:[{ validator: validatePass, trigger: ['blur'] }],
            },

            selectIds:[],//表格勾选
            searchTrueDatas:"",//搜索的所有的数据

            tableLoading:false,//搜索的loading

        };
    },
    methods: {
        //复制关键词
        copyKeyword(){
            var oInput = document.createElement('textarea');
            oInput.value = this.selectIds.join('\n');
            //console.log(oInput.value);
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            //oInput.style.display='none';
             document.body.removeChild(oInput);
             this.$message.success('复制成功')
        },
        //加入词库
        addLexicon(){
            this.$refs.layout.$dialog({
                title:'加入词库',
                width:'500px',
                params:{
                    keywords : this.selectIds
                },
                component: () => import("./dialog/addLexicon.vue"),
                cancelBtnText:'取消',
                okBtnText:'确认'
            }); 
        },
        //导入数据
        importBtn(){
            this.$refs.layout.$dialog({
                title:'导入数据',
                width:'500px',
                params:{
                    taskId : this.$route.query.taskId,
                    success: this.$refs.layout.getList
                },
                component: () => import("./dialog/importData"),
                cancelBtnText:'关闭',
                //okBtnText:'关闭'
            }); 
        },
        //导出
        exportBtn(){
            let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,keywordSrc: this.selectIds.length ? this.selectIds : null }
            return this.$api[`taskKeywordCompeteExportData`](params)
            .then(data => {
                downloadFile(data, '关键词竞争分析详情 ' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
        //表单搜索的真实数据
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        selectChange(v){
            //console.log(v);
            this.selectIds=[];
            v.forEach(i=>{
                this.selectIds.push(i.keyword);
            })
        },
        //搜索参数处理
        searchFunc(data){
            let { keyword,exclude,include,barring,...info }= this.formInline ;
            let keywords = keyword
						.split(/[\n|\r\n|\,|\，]/)
						.map(el => el.trim())
                        .filter(el => el !== '');
            let excludes = exclude
						.split(/[\n|\r\n|\,|\，]/)
						.map(el => el.trim())
                        .filter(el => el !== '');
            let includes = include
						.split(/[\n|\r\n|\,|\，]/)
						.map(el => el.trim())
                        .filter(el => el !== '');
            let barrings = barring
						.split(/[\n|\r\n|\,|\，]/)
						.map(el => el.trim())
						.filter(el => el !== '');
            let params = {
                keywords:keywords,
                exclude:excludes,
                include:includes,
                barring:barrings,
                ...info
            }
            return {...data,...params};
        },
        //确认搜索
        handleSearch(){
            console.log('object');
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    this.tableLoading=true;
                    this.$refs.layout.getList();
                }
            });
        },
        //接受子组件的请求成功的方法
        requestSuccess(){
            //console.log('object');
            this.tableLoading=false;
        },
        //重置搜索
        resetSearch(){
            this.tableLoading=true;
            for(let k in this.formInline){
                this.formInline[k] = ''
            };
            this.$refs.formInline.clearValidate()
            this.$refs.layout.getList();
        },
    },
    created() {

    },
    computed: {
        outerParams(){
            return {
                platformId:this.platformId,
                siteId:this.siteId,
                sellerId:this.sellerId,
                taskId:this.$route.query.taskId
            }
        },
    },
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom:14px;
}
.cont100{
    /deep/.el-form-item__content {
        width: 94%;
        margin-left: 12px;
    }
    .no-Include{
        /deep/.el-form-item__content {
            width: 94%;
            margin-left: 0;
        }
    }
}
</style>

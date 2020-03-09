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
            url="adKeywordAnalysisDetails"
            ref="layout"
		>
             <div slot="search">
                <el-form :label-position="'center'" :model="formInline" ref='formInline' :inline="true" :rules='rules'>
                    <el-form-item label="搜索" prop='keyword'>
                        <el-input v-model="formInline.keyword" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" style='width:330px;'></el-input>
                    </el-form-item>
                    <el-form-item label="包含" prop='include'>
                        <el-input v-model="formInline.include" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" style='width:330px;'></el-input>
                    </el-form-item>
                    <el-form-item label="不包含" prop='barring'>
                        <el-input v-model="formInline.barring" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" style='width:330px;'></el-input>
                    </el-form-item>
                    <el-form-item label="排除" prop='exclude'>
                        <el-input v-model="formInline.exclude" size='small' placeholder="请输入关键词,一行一个" type='textarea'  :rows="3" style='width:330px;'></el-input>
                    </el-form-item>
                   
                    <el-form-item label="产品数" prop='adProductCntMin'>
                        <el-input v-model="formInline.adProductCntMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='adProductCntMax'>
                        <el-input v-model="formInline.adProductCntMax" size='small' placeholder="请输入大值" ></el-input>
                    </el-form-item>

                    <el-form-item label="最低竞价" prop='exactRangeStartMin'>
                        <el-input v-model="formInline.exactRangeStartMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='exactRangeStartMax'>
                        <el-input v-model="formInline.exactRangeStartMax" size='small' placeholder="请输入大值" ></el-input>
                    </el-form-item>

                    <el-form-item label="最高竞价" prop='exactRangeEndMin'>
                        <el-input v-model="formInline.exactRangeEndMin" size='small' placeholder="请输入小值" ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop='exactRangeEndMax'>
                        <el-input v-model="formInline.exactRangeEndMax" size='small' placeholder="请输入大值" ></el-input>
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
import { downloadFile } from 'Utils/tools'
export default {
	
    data() {
        let vm=this;
        var validatePass = (rule, value, callback) => {

            let field=rule.field;
            
            if( isNaN(Number(value))){
                return callback(new Error('请输入数字'));
            };
            if( field==='adProductCntMin' || field==='adProductCntMax' ){
                if( vm.formInline.adProductCntMin && vm.formInline.adProductCntMax) {
                    if( field==='adProductCntMin' ){
                        if(  Number(vm.formInline.adProductCntMin) >= Number(vm.formInline.adProductCntMax) ){
                                vm.formInline.adProductCntMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='adProductCntMax' ){
                        if(  Number(vm.formInline.adProductCntMin) >= Number(vm.formInline.adProductCntMax) ){
                                vm.formInline.adProductCntMax = ''
                                return callback(new Error('大值需大于小值'));
                        };
                    }
                    
                };
            };
            if( field==='exactRangeStartMin' || field==='exactRangeStartMax' ){
                if( vm.formInline.exactRangeStartMin && vm.formInline.exactRangeStartMax) {
                    if( field==='exactRangeStartMin' ){
                        if(  Number(vm.formInline.exactRangeStartMin) >= Number(vm.formInline.exactRangeStartMax) ){
                                vm.formInline.exactRangeStartMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='exactRangeStartMax' ){
                        if(  Number(vm.formInline.exactRangeStartMin) >= Number(vm.formInline.exactRangeStartMax) ){
                                vm.formInline.exactRangeStartMax = ''
                                return callback(new Error('大值需大于小值'));
                        };
                    }
                    
                };
            };
            if( field==='exactRangeEndMin' || field==='exactRangeEndMax' ){
                if( vm.formInline.exactRangeEndMin && vm.formInline.exactRangeEndMax) {
                    if( field==='exactRangeEndMin' ){
                        if(  Number(vm.formInline.exactRangeEndMin) >= Number(vm.formInline.exactRangeEndMax) ){
                                vm.formInline.exactRangeEndMin = ''
                                return callback(new Error('小值需小于大值'));
                        };
                    };
                    if( field==='exactRangeEndMax' ){
                        if(  Number(vm.formInline.exactRangeEndMin) >= Number(vm.formInline.exactRangeEndMax) ){
                                vm.formInline.exactRangeEndMax = ''
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
                    fn: (scope) => {
                        window.open(scope.row.keywordUrl) 
                    }
                }
            ],
            editBtns:[
                {
                    name: '复制',
                    disabled: selection => {
                        return selection.length == 0
                    },
                    fn:()=>{
                    	let data = vm.getSelection().map(e=>e.keyword)
                    	let str = ''
                    	str = data.join('\n')
                    	vm.$copyText(str).then(function (e) {
                    	  vm.$message.success('复制成功')
                    	}, function (e) {
                    	  vm.$message.error('复制失败')
                    	})
                    }
                },
                {
                    name: '导出',
                    showLoading:true,
                    fn: ()=>{
                        return this.exportBtn();
                    }
                },
                {
                    name: '加入词库',
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                        this.addLexicon();
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
				    label:'广告产品数',
				    value:'adProductCnt',
				    sortable:'custom'
				},
                {
                    label:'精确推荐最高竞价',
                    value:'exactRangeEnd',
                    sortable:'custom',
					money:'us'
                },
                {
                    label:'精确推荐最低竞价',
                    value:'exactRangeStart',
                    sortable:'custom',
					money:'us'
                },
            ],
            formInline:{
               keyword:'',
               include:'',
               barring:'',
               exclude:'',

               adProductCntMin:'',
               adProductCntMax:'',
               exactRangeStartMin:'',
               exactRangeStartMax:'',
               exactRangeEndMin:'',
               exactRangeEndMax:'',

            },
            //搜索的验证规则
            rules:{
                adProductCntMin:[{ validator: validatePass, trigger: ['blur'] }],
                adProductCntMax:[{ validator: validatePass, trigger: ['blur'] }],
                exactRangeStartMin:[{ validator: validatePass, trigger: ['blur'] }],
                exactRangeStartMax:[{ validator: validatePass, trigger: ['blur'] }],
                exactRangeEndMin:[{ validator: validatePass, trigger: ['blur'] }],
                exactRangeEndMax:[{ validator: validatePass, trigger: ['blur'] }],
            },

            selectIds:[],//表格勾选
            searchTrueDatas:"",//搜索的所有的数据

            tableLoading:false,//搜索的loading

        };
    },
    methods: {
        //加入词库
        addLexicon(){
            this.$refs.layout.$dialog({
                title:'加入词库',
                width:'500px',
                params:{
                    keywords : this.selectIds
                },
                component: () => import("../dialog/addLexicon.vue"),
                cancelBtnText:'取消',
                okBtnText:'确认'
            }); 
        },
        //导出
        exportBtn(){
            let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,keywordSrc: this.selectIds.length ? this.selectIds : null }
            return this.$api[`adKeywordAnalysisExportData`](params)
            .then(data => {
                downloadFile(data, '广告关键词分析详情 ' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
        //表单搜索的真实数据
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        selectChange(v){
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
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    this.tableLoading=true;
                    this.$refs.layout.getList();
                }
            });
        },
        //接受子组件的请求成功的方法
        requestSuccess(){
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
    computed: {
        outerParams(){
            return {
                // platformId:this.platformId,
                // siteId:this.siteId,
                // sellerId:this.sellerId,
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
</style>

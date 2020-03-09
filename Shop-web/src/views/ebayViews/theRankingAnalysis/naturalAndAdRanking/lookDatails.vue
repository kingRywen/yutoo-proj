<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :editBtns="editBtns"
            :columns="columns"
            :backBtn='true'
            :searchFunc='searchFunc'
            @requestSuccess='requestSuccess'
            :treeTable="treeTable"
            @selectChange='selectChange'
            ref="layout"
            url="ebTaskKrFqProductList"
            >  
            <div slot="search">
                <el-form :model="formInline"  :rules="rules" ref="formInline" :inline="true">
                    <el-form-item label="页码" prop="minPages">
                        <el-input type='text' v-model.number="formInline.minPages" size='mini' ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxPages">
                        <el-input type='text' v-model.number="formInline.maxPages" size='mini' ></el-input>
                    </el-form-item>
                    <el-form-item label="排名" prop="minRank">
                        <el-input type='text' v-model.number="formInline.minRank" size='mini' ></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="maxRank">
                        <el-input type='text' v-model.number="formInline.maxRank" size='mini' ></el-input>
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
import {downloadFile} from '../../../../utils/tools';
export default {
    data() {
        let vm=this;
        var validatePass = (rule, value, callback) => {
            let field=rule.field;
            // console.log(field);
            // console.log(value);
            // if (!value && field==='multipleFrequency') {
            //     return callback(new Error('抓取倍率不能为空'));
            // };
            if( (value && isNaN(Number(value))) || (value && Number(value)<=0) || ( value &&  !/^[1-9]\d*$/.test(value*1)) ){
                return callback(new Error('请输入大于0的整数'));
            };
            if( field==='minPages' || field==='maxPages' ){
                    // if( vm.formInline.maxPages &&  !vm.formInline.minPages && field==='minPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  vm.formInline.minPages &&  !vm.formInline.maxPages && field==='maxPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.minPages && vm.formInline.maxPages) {
                            if(  Number(vm.formInline.minPages) >= Number(vm.formInline.maxPages) ){
                                 return callback(new Error('大值需大于小值'));
                            };
                    };
            };
            
            if( field==='minRank' || field==='maxRank' ){
                    // if( vm.formInline.minRank &&  !vm.formInline.maxRank && field==='maxRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  !vm.formInline.minRank &&  vm.formInline.maxRank && field==='minRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.minRank && vm.formInline.maxRank) {
                            if(  Number(vm.formInline.minRank) >= Number(vm.formInline.maxRank) ){
                                 return callback(new Error('大值需大于小值'));
                            };
                    };
            };
            callback()
        };
        return {
            treeTable:false,
            treeTableOtions:{},
            searchData: {},
            //筛选条件的搜索
                formInline:{
                    minPages:null,
                    maxPages:null,
                    minRank:null,
                    maxRank:null,
                    taskId:null,
                    startTime:null,
                    endTime:null,
                    taskFlag:null,
                },
            //搜索表单的验证
            rules:{
                minPages:[{ validator: validatePass, trigger: ['blur','change'] }],
                maxPages:[{ validator: validatePass, trigger: ['blur','change'] }],
                minRank:[{ validator: validatePass, trigger: ['blur','change'] }],
                maxRank:[{ validator: validatePass, trigger: ['blur','change'] }],
            },
			//表格头部操作按钮
                editBtns:[
                    {
                        name: "导出",
                        fn: () =>{
                            this.exportBtn()
                        }
					},
				],
			//columns表格
                columns: [
                    {
                        label: "图片",
                        value: "imageUrl",
                        minWidth: 60,
                        img:true,
                        style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 120 //鼠标hover图片高，宽度自动
                    },
					{
                        label: "ID",
                        value: "parentAsin",
                        minWidth: 180,
                        render(h,scope){
                            return  <a href={scope.row.productUrl} target='_blink' style={{color:"#108ee9"}}>{scope.row.parentAsin}</a>
                        }
					},
					{
                        label: "标题",
                        value: "title",
                        minWidth: 220
					},
					{
                        label: "页码",
                        value: "webRankPages",
                        minWidth: 130,
                        sortable:"custom",
					},{
                        label: "排名",
                        value: "webPagesRank",
                        minWidth: 130,
                        sortable:"custom",
					}
				],
			//外部参数
                outerParams: {
                    siteId: null,
					sellerId: null,
					platformId:null,
					taskFlag:null
				},
			//表格列表操作按钮
                edits: [
                    {
                        name: "查看详情",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return  true//scope.row.status===2;
                        },
                        fn: (scope) => {
                            return this.lookDatsils(scope.row)
                        }
					},
                ],

            tableLoading:false,//按钮的loading

            selectIds:[],
        };
    },
    methods: {
        //搜索参数处理
        searchFunc(data){
            return {...data,...this.formInline};
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
                //console.log('object');
                this.tableLoading=false;
            },
        //重置搜索
            resetSearch(){
                this.tableLoading=true;
                this.formInline.minPages=null;
                this.formInline.maxPages=null;
                this.formInline.minRank=null;
                this.formInline.maxRank=null;
             
                this.$refs.layout.getList(this.formInline);
            },
        //勾选改变
            selectChange(v){
                //console.log(v);
                this.selectIds=v.map(i=>{
                    return i.parentAsin
                });
                //console.log(this.selectIds);
            },
        //查看详情
            lookDatsils(v){
                this.$refs.layout.$dialog({
                    title: "数据展示",
                    size:'large',
                    params: {resultTime:this.formInline.startTime,url:"ebTaskKrFqListToFqRec",taskId:v.taskId,parentAsin:v.parentAsin,taskFlag:this.formInline.taskFlag},
                    component: () => import('./common/echartsDialog.vue'),
                    // okBtnText: "确认",
                    // cancelBtnText: "取消"
                });
            },
        //导出
            exportBtn(){
                let datas={...this.formInline};
                if(this.selectIds.length){
                    datas.asins=this.selectIds;
                }
                this.$api['ebTaskKrFqExportProductList'](datas)
                .then(data => {
                    downloadFile(data,'排名有变化产品数详情')
                }).catch(() => {})
            },
    },
    created() {
        
        this.$nextTick(function(){
            this.formInline.taskId=this.$route.query.taskId*1;
            this.formInline.taskFlag=this.$route.query.taskFlag*1;
            this.formInline.minRank=this.$route.query.minRank;
            this.formInline.maxRank=this.$route.query.maxRank;
            this.formInline.minPages=this.$route.query.minPages;
            this.formInline.maxPages=this.$route.query.maxPages;
            this.formInline.startTime=this.$route.query.startTime;
            this.formInline.endTime=this.$route.query.endTime;
            this.formInline.week=this.$route.query.week;
            this.formInline.hour=this.$route.query.hour;
           // console.log(this.formInline);
            this.handleSearch()
        })
    },
};
</script>

<style scoped lang="less">

</style>

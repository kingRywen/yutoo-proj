<template>
    <div>
         <MainLayout
            :outerParams="outerParams"
            :editBtns="editBtns"
            :edits="edits"
            :columns="columns"
            @searchTrueData='searchTrueData'
            @selectChange='selectChange' 
            :searchFunc='searchFunc'
            @requestSuccess='requestSuccess'
            ref="layout"
            url="taskRankResearchListByRankReseProd"
            >
            <div slot="search">
                <el-form :label-position="'center'" :model="formInline" ref='formInline' :inline="true" :rules='rules'>
                    <el-form-item label="ASIN" prop='asin'>
                        <el-input v-model.trim="formInline.parentAsin" size='small' placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="大类BSR" prop="rankMin">
                        <el-input type='text' v-model.trim="formInline.rankMin" size='small' placeholder="请输入小值" style='width:130px;'></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="rankMax">
                        <el-input type='text' v-model.trim="formInline.rankMax" size='small' placeholder="请输入大值" style='width:130px;'></el-input>
                    </el-form-item>
                    <el-form-item label="评分" prop="statCntMin">
                        <el-input type='text' v-model.trim="formInline.statCntMin" size='small' placeholder="请输入小值" style='width:130px;'></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="statCntMax">
                        <el-input type='text' v-model.trim="formInline.statCntMax" size='small' placeholder="请输入大值" style='width:130px;'></el-input>
                    </el-form-item>
                     <el-form-item label="总评价数" prop="reviewCntMin">
                        <el-input type='text' v-model.trim="formInline.reviewCntMin" size='small' placeholder="请输入小值" style='width:130px;'></el-input>
                    </el-form-item>
                    <el-form-item label="~" prop="reviewCntMax">
                        <el-input type='text' v-model.trim="formInline.reviewCntMax" size='small' placeholder="请输入大值" style='width:130px;'></el-input>
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
    props:['radioSiteId','siteList','pcid'],
    data() {
        let vm=this;
        var validatePass = (rule, value, callback) => {
            let field=rule.field;
            console.log(field);
            // console.log(value);
            // if (!value && field==='multipleFrequency') {
            //     return callback(new Error('抓取倍率不能为空'));
            // };
            if(  ( field !=='statCntMin' && field !=='statCntMax' ) &&  ( (value && isNaN(Number(value))) || (value && Number(value)<=0) || ( value &&  !/^[1-9]\d*$/.test(value*1)) ) ){
                return callback(new Error('请输入大于0的整数'));
            };
            if( field==='rankMin' || field==='rankMax' ){
                    // if( vm.formInline.maxPages &&  !vm.formInline.minPages && field==='minPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  vm.formInline.minPages &&  !vm.formInline.maxPages && field==='maxPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.rankMin && vm.formInline.rankMax) {
                        if( field==='rankMin' ){
                            if(  Number(vm.formInline.rankMin) >= Number(vm.formInline.rankMax) ){
                                    vm.formInline.rankMin = ''
                                    return callback(new Error('小值需小于大值'));
                            };
                        };
                        if( field==='rankMax' ){
                            if(  Number(vm.formInline.rankMin) >= Number(vm.formInline.rankMax) ){
                                    vm.formInline.rankMax = ''
                                    return callback(new Error('大值需大于小值'));
                            };
                        }
                       
                    };
            };
            
            if( field==='statCntMin' || field==='statCntMax' ){ //可以输入小数
                    // if( vm.formInline.minRank &&  !vm.formInline.maxRank && field==='maxRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  !vm.formInline.minRank &&  vm.formInline.maxRank && field==='minRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.statCntMin && vm.formInline.statCntMax) {
                        if( field==='statCntMin' ) {
                            if(  Number(vm.formInline.statCntMin) >= Number(vm.formInline.statCntMax) ){
                                vm.formInline.statCntMin = ''
                                return callback(new Error('小值需大于大值'));
                            };
                        };
                        if( field==='statCntMax' ){
                            if(  Number(vm.formInline.statCntMin) >= Number(vm.formInline.statCntMax) ){
                                 vm.formInline.statCntMax = ''
                                return callback(new Error('大值需大于小值'));
                            };
                        };
                       
                    };
                    if( isNaN(Number(value)) || Number(vm.formInline.statCntMin)<0 || Number(vm.formInline.statCntMin)>5){
                            return callback(new Error('请输入0到5之间的数字'));
                    };
                    if(  Number(vm.formInline.statCntMax)<0 || Number(vm.formInline.statCntMax)>5){
                            return callback(new Error('请输入0到5之间的数字'));
                    };
            };
            if( field==='reviewCntMin' || field==='reviewCntMax' ){
                    // if( vm.formInline.minRank &&  !vm.formInline.maxRank && field==='maxRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  !vm.formInline.minRank &&  vm.formInline.maxRank && field==='minRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.reviewCntMin && vm.formInline.reviewCntMax) {
                        if( field==='reviewCntMin' ){
                            if(  Number(vm.formInline.reviewCntMin) >= Number(vm.formInline.reviewCntMax) ){
                                vm.formInline.reviewCntMin = '';
                                return callback(new Error('小值需小于大值'));
                            };
                        };   
                        if( field==='reviewCntMax' ){
                            if(  Number(vm.formInline.reviewCntMin) >= Number(vm.formInline.reviewCntMax) ){
                                vm.formInline.reviewCntMin = '';
                                return callback(new Error('大值需大于小值'));
                            };
                        };  
                    };
            };
            callback()
        };
        return {
            outerParams:{
                //productFlag:1
            },
            formInline:{
                parentAsin:null,
                rankMin:null,
                rankMax:null,
                statCntMin:null,
                statCntMax:null,
                reviewCntMin:null,
                reviewCntMax:null
            },
            //搜索的验证规则
            rules:{
                rankMin:[{ validator: validatePass, trigger: ['blur'] }],
                rankMax:[{ validator: validatePass, trigger: ['blur'] }],
                statCntMin:[{ validator: validatePass, trigger: ['blur'] }],
                statCntMax:[{ validator: validatePass, trigger: ['blur'] }],
                reviewCntMin:[{ validator: validatePass, trigger: ['blur'] }],
                reviewCntMax:[{ validator: validatePass, trigger: ['blur'] }],
            },
            editBtns:[
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
                //  {
                //     name: '查看评价内容',
                //     icon: 'el-icon-edit-outline',
                //     // show: scope => {
                //     //     return scope.row.status !== -1
                //     // },
                //     fn: () => {
                //        return this.lookEvaluateContent()
                //     }
                // }
            ],
            edits:[
                {
                    name: "数据展示",
                    icon: "el-icon-picture-outline",
                    show: scope => {
                            return  true//scope.row.status===3;
                    },
                    fn: (scope) => {
                        //console.log(scope);
                        return this.$refs.layout.$dialog(
                            {
                                title: "数据展示",
                                width: "1200px",
                                showMaxBtn:true,
                                params:{
                                    parentAsin:scope.row.parentAsin,
                                    taskId:scope.row.taskId,
                                    keywordOptions:vm.$route.query.keywordOptions,
                                    categoryOptions:scope.row.bsrCates,
                                    resultTime:scope.row.createTime
                                },
                                component: () => import("./dialog/echartsDialog.vue"),
                            }
                        )
                    }
                }
            ],
            columns:[
                {
                    label: '主图',
                    value: 'imageUrl',
                    img:true,
                    style: {
                        //图片宽高
                        width: 40,
                        height: 40
                    },
                    bulkyHeight: 120 //鼠标hover图片高，宽度自动
                },
                {
                    label: "ASIN",
                    value: "parentAsin",
                    width:"200px",
                    //expand:true,
                    render(h,scope,a,b){
                        return(
                            <a href={scope.row.productUrl} target="_blink" style='color: rgb(16, 142, 233);'>{scope.row.parentAsin}</a>
                        )
                    }
                },
                {
                    label: "BSR排名",
                    value: "rank",
                    minWidth:100,
                    sortable:'custom',
                    render(h,scope,a,b){
                        let {rank,bsrCates}=scope.row;
                        let span='';
                        if(bsrCates){
                            bsrCates.forEach( (i,index) =>{
                                span+= i.rank +' : '+ i.bsrCategory 
                                span+='<br />'  
                                         
                            })
                        }
                        return rank ? (
                            <el-tooltip open-delay={300}  effect="light">
                                <div slot="content" domPropsInnerHTML={span}></div>
                                <span class="fix__row_1" style='color: rgb(16, 142, 233);'>{rank}</span>
                            </el-tooltip>
                            ) : (
                                <span>-</span>
                            )
                    }
                },
                {
                    label: "评分",
                    value: "starCnt",
                    minWidth:100,
                    sortable:'custom'
                },
                {
                    label: "总评价数",
                    value: "reviewCnt",
                    minWidth:100,
                    sortable:'custom'
                },
                {
                    label: "访客数",
                    merge:[
                        {
                            label: "总数",
                            value: "sessions",
                            minWidth:120,
                            sortable:'custom'
                        },
                        {
                            label: "仅广告",
                            value: "adSessions",
                            width:'130px',
                            sortable:'custom'
                        },
                    ]
                },
                {
                    label: "订单数",
                    merge:[
                        {
                            label: "总数",
                            value: "orderCnt",
                            minWidth:120,
                            sortable:'custom'
                        },
                        {
                            label: "仅广告",
                            value: "adOrderCnt",
                            width:'130px',
                            sortable:'custom'
                        },
                    ]
                },
                {
                    label: "转化率",
                    merge:[
                        {
                            label: "总数",
                            value: "conversionRates",
                            minWidth:120,
                            sortable:'custom',
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.conversionRates || scope.row.conversionRates===0) ? Math.ceil(scope.row.conversionRates*10000)/100+'%' :'-'}</span>
                                )
                            }
                        },
                        {
                            label: "仅广告",
                            value: "adConversionRates",
                            width:'130px',
                            sortable:'custom',
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.adConversionRates || scope.row.adConversionRates===0) ? Math.ceil(scope.row.adConversionRates*10000)/100+'%' :'-'}</span>
                                )
                            }
                        },
                    ]
                },
            ],

            selectIds:[],//表格勾选
            searchTrueDatas:"",//搜索的所有的数据

            tableLoading:false,//搜索的loading
        };
    },
    methods: {
        //导出
         exportBtn(){
            let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,parentAsins: this.selectIds.length ? this.selectIds : null }
            return this.$api[`taskRankResearchListByRankReseProdExport`](params)
            .then(data => {
                downloadFile(data, '排名研究详情' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
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
                this.selectIds.push(i.parentAsin);
            })
        },
        //搜索参数处理
        searchFunc(data){
            return {...data,...this.formInline};
        },
        //确认搜索
        handleSearch(){
            //console.log(this.formInline);
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
                this.formInline[k]=null
            };
            this.$refs.formInline.clearValidate()
            this.$refs.layout.getList();
        },
      

    },
    created() {
        this.outerParams.platformId=this.platformId;
        this.outerParams.taskId=this.$route.query.taskId;
        if (this.sellerId && this.siteId) {
            this.outerParams.siteId = this.siteId;
            this.outerParams.sellerId = this.sellerId;
        }
    },
    watch: {
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId = this.siteId;
                this.outerParams.sellerId = this.sellerId;
            }
        }
    }
};
</script>

<style scoped lang="less">
.el-form-item{
    margin-bottom:10px;
}
</style>

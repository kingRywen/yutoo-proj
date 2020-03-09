<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            :backBtn='true'
            :treeTable="treeTable"
            :treeTableOtions='treeTableOtions'
            @selectChange='selectChange'
            ref="layout"
            url="taskShopTrendAnalysisListTaskDetail"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
         <a href="" ref='link'></a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            treeTable: false,
            treeTableOtions: {
                childs: "children",
                expandFunc: row => {
                    return true
                }
            },
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "卖家名称",
                        name: "sellerName",
                        labelWidth:'60px',
                        type: "input",
                        placeholder:'请输入卖家名称'
                    }
                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "加入店铺分析",
                        fn: () => {
                            this.joinStoreBtn()
                        }
                    },
                    {
                        name: "导出",
                        showLoading:true,
                        fn: () =>{
                            return this.exoprtBtn()
                        }
                    },
                ],
            //columns表格
                 columns: [
                    {
                        label: "卖家名称",
                        value: "sellerName",
                        minWidth: 150,
                        url:'sellerUrl',

                    },
                    {
                        label: "店铺产品数",
                        value: "productCnt",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                    {
                        label: "品牌数",
                        value: "brandCnt",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                    {
                        label: "好评率",
                        value: "positiveRate",
                        minWidth: 150,
                        sortable: 'custom',
                        render(h,scope){
                            return(
                                <span>{ (scope.row.positiveRate || scope.row.positiveRate===0) ? Math.ceil(scope.row.positiveRate*10000)/100+"%" :"-"}</span>
                            )
                        }
                    },
                    {
                        label: "店铺新增Feedback数",
                        value: "newFeedbackCntD30",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                 ],
            //外部参数
                outerParams:{
                    sellerId:null,
                    siteId:null,
                    taskId:null,
                    sellerName:null,
                    platformId:null
                },
            //表格列表操作按钮
                edits: [
                    {
                        name: "查看新增feedbacks数",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return  true//scope.row.status===2;
                        },
                        fn: (scope) => {
                            console.log(scope);
                            return this.$refs.layout.$dialog({
                                title: "新增feedbacks数",
                                width: "1200px",
                                showMaxBtn:true,
                                params: {
                                    taskId:this.$route.query.taskId,//任务id
                                    sellerId:scope.row.sellerId,//卖家id
                                    resultTime:this.$route.query.resultTime,//有结果时间
                                    url:"taskShopTrendAnalysisListReview",//请求数据的url
                                    type:"store"
                                },
                                component: () => import("../common/echartsDialog.vue"),
                                // okBtnText: "确认",
                                // cancelBtnText: "取消"
                            });
                        }
                    },

                ],

            selectIds:[],//table表格勾选的数组
            urls:[],//店铺链接数组
        };
    },
    methods: {
        //加入店铺分析
            joinStoreBtn(){
                if(this.selectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    })
                    return
                };
                this.$refs.layout.$dialog({
                    title: "加入店铺分析",
                    size:"small",
                    params: {
                        sellerId:this.$route.query.sellerId,//卖家id
                        siteId:this.outerParams.siteId,//站点id
                        platformId:this.platformId,//平台id
                        url:"taskShopTrendAnalysisTaskShopAnalysissave",//请求数据的url
                        dataSource:this.urls
                    },
                    component: () => import("../common/addStoreAnalysisDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });

            },
        //导出
            exoprtBtn(){
                let data={
                    siteId: this.outerParams.siteId,
                    sellerId: this.outerParams.sellerId,
                    taskId:this.$route.query.taskId,
                };
                if(this.selectIds.length>0){
                    data.sellerNames=this.selectIds;
                };
                return this.$api['taskShopTrendAnalysisExportTaskDetail'](
                    data
                )
                .then(data => {
                        let url = window.URL.createObjectURL(new Blob([data]));
                        let a = this.$refs.link;
                        a.href = url;
                        a.setAttribute("download", "店铺趋势分析详情.xlsx");
                        a.click();
                        window.URL.revokeObjectURL(url);
                    
                }).catch(err=>{
                    
                })
            },
        //勾选改变
            selectChange(v){
                this.selectIds=[];
                this.urls=[];
                console.log(v);
                v.forEach(i=>{
                    this.selectIds.push(i.sellerName);
                    this.urls.push(i.sellerUrl);
                });
                //console.log(this.selectIds);
            },
    },
    created() {
         this.outerParams.platformId=this.platformId;
        if (this.sellerId && this.siteId) {
           this.outerParams.siteId=this.siteId;
           this.outerParams.sellerId=this.sellerId;
        };
        this.outerParams.taskId=this.$route.query.taskId;

    },
    watch:{
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId=this.siteId;
                this.outerParams.sellerId=this.sellerId;
            }
        }
    }
};
</script>

<style scoped lang="less">

</style>

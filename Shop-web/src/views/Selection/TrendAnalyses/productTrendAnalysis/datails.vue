<template>
    <div >
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
            url="taskProductTrendAnalysisListTaskDetail"
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
                        label: "产品名称",
                        name: "parentAsin",
                        labelWidth:'60px',
                        type: "input",
                        placeholder:'请输入产品名称'
                    }
                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "加入竞品分析",
                        fn: () => {
                            this.joinPartBtn()
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
                        label: "ASIN",
                        value: "parentAsin",
                        minWidth: 150,
                        url:'productUrl'
                    },
                    {
                        value: "imageUrl", //table需要渲染的值
                        label: "主图", //表头
                        // width: "60", //当前行宽度
                        img: true, //如图片传
                        style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 150 //鼠标hover图片高，宽度自动
                    },
                    {
                        label: "价格",
                        value: "price",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                    {
                        label: "子SKU数",
                        value: "skuCnt",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                    {
                        label: "评分",
                        value: "starCnt",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                      {
                        label: "评价数",
                        value: "reviewCnt",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                      {
                        label: "上架时间",
                        value: "releaseDate",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                      {
                        label: "AQ数",
                        value: "aqCnt",
                        minWidth: 150,
                        sortable: 'custom',
                    },
                    {
                        label: "发货方式",
                        value: "fbpFlag",
                        minWidth: 150,
                        enum:{
                            0:'自发货',
                            1:'FBA',
                            2:'自发货+FBA',
                        }
                    },
                      {
                        label: "BSR",
                        value: "rank",
                        minWidth: 150,
                        sortable: 'custom',
                        render(h,scope){
                            let {rank}=scope.row;
                            return (rank || rank===0 ) ? (
                                <el-tooltip open-delay={300} content={scope.row.category ? scope.row.category  :"-"}>
                                    <span class="fix__row_2">{rank}</span>
                                </el-tooltip>
                                ) : (
                                <span>-</span>
                            )
                        }
                    },
                    {
                        label: "品牌名",
                        value: "brand",
                        minWidth: 150,
                    },
                 ],
            //外部参数
                outerParams:{
                    sellerId:null,
                    siteId:null,
                    taskId:null,
                    sellerName:null,
                    platformId:null,
                },
            //表格列表操作按钮
                edits: [
                    {
                        name: "查看新增评价",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return true//scope.row.status===2;
                        },
                        fn: (scope) => {
                            console.log(scope);
                            return this.$refs.layout.$dialog({
                                title: "新增评价数",
                                width:'1200px',
                                showMaxBtn:true,
                                params: {
                                    taskId:this.$route.query.taskId,//任务id
                                    sellerId:scope.row.sellerId,//卖家id
                                    resultTime:this.$route.query.resultTime,//有结果时间
                                    url:"taskProductTrendAnalysisListReview",//请求数据的url
                                    parentAsin:scope.row.parentAsin,
                                    type:'product'

                                },
                                component: () => import("../common/echartsDialog.vue"),
                                // okBtnText: "确认",
                                // cancelBtnText: "取消"
                            });
                        }
                    },

                ],

            selectIds:[],//table表格勾选的数组  
            asins:[]
        };
    },
    methods: {
        //加入竞品分析
            joinPartBtn(){
                if(this.selectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    })
                    return
                };
                this.$refs.layout.$dialog({
                    title: "加入竞品分析",
                    size:"small",
                    params: {
                        sellerId:this.$route.query.sellerId,//卖家id
                        siteId:this.outerParams.siteId,//站点id
                        platformId:this.platformId,
                        url:"productAnalysisSave",//请求数据的url
                        asins:this.selectIds
                    },
                    component: () => import("../common/addProductAnalysisDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });
            },
        //导出按钮
            exoprtBtn(){
                let data={
                    siteId: this.outerParams.siteId,
                    sellerId: this.outerParams.sellerId,
                    taskId:this.$route.query.taskId,
                }
                if(this.selectIds.length>0){
                    data.parentAsins=this.selectIds;
                };
                return this.$api['taskProductTrendAnalysisExportTaskDetail'](
                   
                   data
                )
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let a = this.$refs.link;
                    a.href = url;
                    a.setAttribute("download", "产品趋势分析详情.xlsx");
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(err=>{
                    
                })
            },
        //勾选改变
            selectChange(v){
                //console.log(v);
                this.selectIds=[];
                v.forEach(i=>{
                    this.selectIds.push(i.parentAsin);
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

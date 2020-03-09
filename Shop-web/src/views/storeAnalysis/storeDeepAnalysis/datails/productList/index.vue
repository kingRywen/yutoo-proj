<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            ref="layout"
            :outSearchData='searchData'
            :searchFunc='searchFunc'
            @selectChange='selectChange'
            url="taskShopDepthAnalysisProductDetails"
            >
            <!-- <div slot="left">123</div> -->
        </MainLayout>
        <a href="" ref='link'></a>
    </div>
</template>

<script>
export default {
    props:['bigCategorys'],
    data() {
        return {
            customHandleBack:{
                isShow:true,
                fn:null
            },
            //外部参数
                outerParams: {
                    
                    releaseDateMin: null,
                    releaseDateMax: null,
                    parentAsin:null,
                    siteId: null,
                    sellerId: null,
                    taskId:null,
                },
            //自定义搜素的数据
                searchData:{

                },
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "加入竞品分析",
                        fn: () =>{
                            this.joinPartBtn()
                        }
                    },
                    {
                        name: "导出",
                        showLoading:true,
                        fn: () =>{
                            return this.exportBtn()
                        }
                    },  
                ],
            //columns表格
                 columns: [
                    {
                        label: "主图",
                        value: "imageUrl",
                        minWidth: 150,
                        // width: "60", //当前行宽度
                        img: true, //如图片传
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
                        minWidth: 150,
                        render(h,scope){
                            return(
                                <a href={scope.row.productUrl} style={{color:'#108ee9'}} target='_blink'>{scope.row.parentAsin}</a>
                            )
                        }
                    },
                    {
                        label: "大类BSR",
                        value: "rank",
                        sortable:'custom',
                        width: 300,
                        render(h,scope){
                            return(
                                <div>
                                    <a href={scope.row.bsrCategoryUrl} style={{color:'#108ee9'}} target='_blink'>{scope.row.rank ? scope.row.rank :'-'}</a>
                                    <span style={{'margin-left':'10px'}}>{scope.row.bsrCategory ? scope.row.bsrCategory  :"-"}</span>
                                </div> 
                            )
                        }
                    },
                    {
                        label: "品牌",
                        value: "brand",
                        minWidth: 150,
                    },
                    {
                        label: "上架时间",
                        value: "releaseDate",
                        minWidth: 150,
                        sortable:'custom',
                    },
                      {
                        label: "评分",
                        value: "starCnt",
                        minWidth: 150,
                        sortable:'custom',
                    },
                      {
                        label: "总评价数",
                        value: "reviewCnt",
                        minWidth: 150,
                        sortable:'custom',
                    },
                      {
                        label: "日新增评价数",
                        value: "avgNewReviewCntD30",
                        minWidth: 150,
                        sortable:'custom',
                    },
                     {
                        label: "AQ数",
                        value: "aqCnt",
                        minWidth: 150,
                         sortable:'custom',
                    },
                     {
                        label: "发货方式",
                        value: "fbpFlag",
                        minWidth: 150,
                        render(h,scope){
                            return (
                                <span>{scope.row.fbpFlag==0?'自发货':scope.row.fbpFlag==1?'FBA':scope.row.fbpFlag==2?"自发货+FBA":"-"}</span>
                            )
                        }
                    },
                   
                 ],
            //表格列表操作按钮
                edits: [
                    {
                        name: "查看竞品分析",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return  scope.row.productTaskId!==null;
                        },
                        fn: (scope) => {
                            return this.ViewCompetitiveAnalysis(scope.row)
                        }
                    },
                ],
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "ASIN",
                        name: "parentAsin",
                        type: "input",
                        labelWidth:'40px',
                        placeholder:'请输入ASIN'
                    },
                    {
                        label: "上架时间",
                        name: "time",
                        type: "dateRange",
                        placeholder:'请选择时间',
                        pickerOptions:{
                            shortcuts: ''    
                        }
                    },
                   
                ],
            slectIds:[],//选择的ID的数组
            pickerOptionsArr:[],
            
        };
    },
    methods: {
        //参数处理
            searchFunc(data) {
                let {time, ...info} = data;
                let [releaseDateMin, releaseDateMax] = time || [];
                return {releaseDateMin, releaseDateMax, ...info}
            },
        //勾选改变
            selectChange(v){
                //console.log(v);
                this.slectIds=[];
                v.forEach(i =>{
                    this.slectIds.push(i.parentAsin);
                });
                //console.log(this.slectIds);
            },
        //导出
            exportBtn(){
                let data={
                    taskId:this.outerParams.taskId
                };
                if(this.slectIds.length>0){
                    data.parentAsins=this.slectIds;
                };
                return this.$api['taskShopDepthAnalysisExportData'](
                    data
                )
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let a = this.$refs.link;
                    a.href = url;
                    a.setAttribute("download", "店铺深度分析详情.xlsx");
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(() => {})
            },
        //加入竞品分析
            joinPartBtn(){
                if(this.slectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    })
                    return
                };
                this.$refs.layout.$dialog({
                    title: "加入竞品分析",
                    width: "500px",
                    params: {
                        sellerId:this.outerParams.sellerId,//卖家id
                        siteId:this.outerParams.siteId,//站点id
                        platformId:this.platformId,
                        url:"productAnalysisSave",//请求数据的url
                        asins:this.slectIds
                    },
                    component: () => import("./common/addProductAnalysisDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });
            },
        //查看竞品分析
            ViewCompetitiveAnalysis(v){
                console.log(v);
                this.$router.push(
                    {path:"/selection/partFour/detail",query:{taskId:v.productTaskId,name:v.title,asin:v.parentAsin,startTime:v.productCreateTime}}
                )
            },
        
    },
    created() {
        
        this.outerParams.taskId=this.$route.query.taskId;//任务id

        if (this.sellerId && this.siteId) {
           this.outerParams.siteId=this.siteId;
           this.outerParams.sellerId=this.sellerId;
        };
        
        //时间范围选择器的快捷选择日期
        let timeData=[1,3,6,12]
        for (let index = 0; index < timeData.length; index++) {
            const element = timeData[index];
            this.pickerOptionsArr.push({
                text: `最近${element}个月`,
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30*element);
                    picker.$emit('pick', [start, end]);
                }
            })
        };
        this.searchFields[1].pickerOptions.shortcuts=this.pickerOptionsArr;

        //console.log(this.bigCategorys)


        //初始化父组件传递过来的数据
        if(this.bigCategorys){
            let type=this.bigCategorys.type;
            let [min,max]=this.bigCategorys.bigCategorys.split('-');

            this.searchData.bigCategorys=this.bigCategorys.select;//选择的类目
            //console.log( this.searchData.bigCategorys);
            if(type==='bsr'){
                
                // this.outerParams.minRank=min;
                // this.outerParams.maxRank=max;
                this.searchData.minRank=min;
                this.searchData.maxRank=max;

            }else if(type==='joinTime'){

                this.searchData.minReleaseDay=min;
                this.searchData.maxReleaseDay=max;

            }else if(type==='grade'){

                this.searchData.minStarCnt=min;
                this.searchData.maxStarCnt=max;

            }else{

                this.searchData.minReviewCnt=min;
                this.searchData.maxReviewCnt=max;
            };
        };
        //判断是否是从数据统计分析跳转过来,为返回按钮赋值事件
        if( this.bigCategorys){
            if(this.bigCategorys.skipFormDataAnalysis){
                const fn=()=>{
                    this.$emit('skipDataAnalysis')
                };
                this.$emit('customHandleBack',fn)
            }
        }else{
            const fn =()=>{
                const matched = this.$route.matched
                const len = matched.length
                const backRoute = matched[len - 2]
                this.$router.push({
                    name: backRoute.name,
                    query: backRoute.query,
                    params: backRoute.params
                })
            };
            this.$emit('customHandleBack',fn)
        };
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

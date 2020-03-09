<template>
    <div>
            <MainLayout
                :outerParams="outerParams"
                :edits="edits"
                :searchFields="searchFields"
                :editBtns="editBtns"
                :columns="columns"
                ref="layout"
                @selectChange='selectChange'
                :customDisplay='true'
                :handleLeft='true'
                :backBtn='true'
                url="taskShopAnalysisDetails"
                >
                <!-- <div slot="left">123</div> -->
            </MainLayout>
            <a href="" ref='link'></a>
    </div>
</template>

<script>
export default {
    data() {
        let vm=this;
        return {
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "店铺名称",
                        name: "sellerName",
                        type: "input",
                        labelWidth:'60px',
                        placeholder:'请输入店铺名称'
                    },
                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "加入深度分析",
                        fn: () => {
                           return this.addDeepAnalysis();
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
                        label: "店铺名称",
                        value: "sellerName",
                        minWidth: 150,
                         render(h,scope){
                            return(
                                <el-tooltip content={scope.row.sellerName} effect="light" placement="top">
                                    <a href={scope.row.sellerUrl}  target='_blink' style='text-overflow: ellipsis; white-space: nowrap;overflow: hidden;display:inline-block;width:120px;color:#40a5ed'>{scope.row.sellerName}</a>
                                </el-tooltip>
                            )
                        }
                    },
                    {
                        label: "好评率",
                        value: "positiveRate",
                        minWidth: 100,
                        sortable:"custom",
                        render(h,scope){
                            return(
                                <span>{scope.row.positiveRate*1000/10+"%"}</span>
                            )
                        }
                    },
                    {
                        label: "Feedback数",
                        // value: "dataSources",
                        merge:[
                            {
                                label: "30天",
                                value: "newFeedbackCntD30",
                                sortable:"custom",
                            },
                             {
                                label: "3个月",
                                value: "newFeedbackCntD90",
                                sortable:"custom",
                                width: 100,
                            },
                             {
                                label: "12个月",
                                value: "newFeedbackCntY1",
                                sortable:"custom",
                                width: 100,
                            },
                            
                             {
                                label: "Lifetime",
                                value: "feedbackCnt",
                                sortable:"custom",
                                width: 100,
                            }
                        ],
                    },
                    {
                        label: "TOP1",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top1ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top1ProductUrl} target='_blink'>
                                            <img src={scope.row.top1ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top1Price",
                                sortable:"custom",
                                width:170,
                                render(h,scope){
                                    return(
                                        <span>{scope.row.top1Price}</span>
                                    )
                                }
                            },
                             {
                                label: "大类BSR",
                                value: "top1Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top1SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,1)}>{scope.row.top1SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top1ReleaseDate",
                                width:100,
                                sortable:"custom",
                            },
                            {
                                label: "评分",
                                value: "top1StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top1ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top1AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                    {
                        label: "TOP2",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top2ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top2ProductUrl} target='_blink'>
                                            <img src={scope.row.top2ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top2Price",
                                sortable:"custom",
                                width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top2Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top2SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,2)}>{scope.row.top2SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top2ReleaseDate",
                                width:100,
                                sortable:"custom",
                            },
                            {
                                label: "评分",
                                value: "top2StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top2ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top2AqCnt",
                                sortable:"custom",
                                width:100
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP3",
                        // value: "dataSources",
                        merge:[
                           {
                                value: "top3ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top3ProductUrl} target='_blink'>
                                            <img src={scope.row.top3ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top3Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top3Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top3SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,3)}>{scope.row.top3SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top3ReleaseDate",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "评分",
                                value: "top3StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top3ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top3AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP4",
                        // value: "dataSources",
                        merge:[
                           {
                                value: "top4ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top4ProductUrl} target='_blink'>
                                            <img src={scope.row.top4ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top4Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top4Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top4SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,4)}>{scope.row.top4SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top4ReleaseDate",
                                sortable:"custom",
                                width:100,
                            },
                            {
                                label: "评分",
                                value: "top4StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top4ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top4AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP5",
                        // value: "dataSources",
                        merge:[
                             {
                                value: "top5ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top5ProductUrl} target='_blink'>
                                            <img src={scope.row.top5ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top5Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top5Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top5SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,5)}>{scope.row.top5SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top5ReleaseDate",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "评分",
                                value: "top5StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top5ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top5AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP6",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top6ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top6ProductUrl} target='_blink'>
                                            <img src={scope.row.top6ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top6Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top6Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top6SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,6)}>{scope.row.top6SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top6ReleaseDate",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "评分",
                                value: "top6StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top6ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top6AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP7",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top7ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top7ProductUrl} target='_blink'>
                                            <img src={scope.row.top7ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top7Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top7Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top7SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,7)}>{scope.row.top7SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top7ReleaseDate",
                                width:100,
                                sortable:"custom",
                            },
                            {
                                label: "评分",
                                value: "top7StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top7ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top7AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP8",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top8ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top8ProductUrl} target='_blink'>
                                            <img src={scope.row.top8ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top8Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top8Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top8SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,8)}>{scope.row.top8SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top8ReleaseDate",
                                width:100,
                                sortable:"custom",
                            },
                            {
                                label: "评分",
                                value: "top8StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top8ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top8AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP9",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top9ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top9ProductUrl} target='_blink'>
                                            <img src={scope.row.top9ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top9Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top9Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top9SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,9)}>{scope.row.top9SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top9ReleaseDate",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "评分",
                                value: "top9StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top9ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top9AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                     {
                        label: "TOP10",
                        // value: "dataSources",
                        merge:[
                            {
                                value: "top10ProductUrl", //table需要渲染的值
                                label: "主图", //表头
                                render(h,scope){
                                    return(
                                         <a href={scope.row.top10ProductUrl} target='_blink'>
                                            <img src={scope.row.top10ImageUrl} style={{width:'40px',height:'40px'}} />
                                         </a>
                                    )
                                }
                            },
                             {
                                label: "价格",
                                value: "top10Price",
                                sortable:"custom",
                                 width:170,
                            },
                             {
                                label: "大类BSR",
                                value: "top10Rank",
                                sortable:"custom",
                                width:100
                            },
                            
                            {
                                label: "小类",
                                value: "top10SmallBsrCnt",
                                sortable:"custom",
                                render(h,scope){
                                    return(
                                        <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookSmallBsrCnt(scope.row,10)}>{scope.row.top10SmallBsrCnt}</span>
                                    )
                                }
                            },
                            {
                                label: "上架时间",
                                value: "top10ReleaseDate",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "评分",
                                value: "top10StarCnt",
                                sortable:"custom",
                            },
                            {
                                label: "评价数",
                                value: "top10ReviewCnt",
                                sortable:"custom",
                                width:100
                            },
                            {
                                label: "AQ数",
                                value: "top10AqCnt",
                                sortable:"custom",
                            }

                        ],
                        minWidth: 150,
                    },
                    {
                        label: "品牌数",
                        value: "brandCnt",
                        minWidth: 150,
                        render(h,scope){
                           return <span style={{'color':'#108ee9','cursor':'pointer'}} onClick={()=>vm.lookBrandCnt(scope.row)}>{scope.row.brandCnt}</span>
                        }
                    },
    
                 ],
            //外部参数
                outerParams: {
                  
                    startTime: null,
                    endTime: null,
                    platformId:'',
                    siteId: null,
                    sellerId: null,
                    taskId:null,
                },
            //表格列表操作按钮
                edits: [
                    {
                        name: "查看深度分析",
                        icon: "el-icon-search",
                        show: scope => {
                            
                            return scope.row.depthTaskId;
                        },
                        fn: (scope) => {
                            console.log(scope);
                            return this.$router.push({path:"/storeAnalysis/storeDeepAnalysis/datails",query:{name:scope.row.sellerName,taskId:scope.row.depthTaskId}})
                        }
                    },
                    {
                        name: "新增Feedback数",
                        icon: "el-icon-picture-outline",
                        show: scope => {
                              return  true//scope.row.status===3;
                        },
                        fn: (scope) => {
                            console.log(scope);
                            return this.$refs.layout.$dialog(
                                {
                                    title: "新增Feedback数",
                                    width: "1200px",
                                    showMaxBtn:true,
                                    params:{
                                        taskId:vm.$route.query.taskId*1,
                                        sellerId:scope.row.sellerId,
                                        url:"taskShopAnalysisListToNewFeedBackBysellerId"
                                    },
                                    component: () => import("../common/echartsDialog.vue"),
                                }
                            )
                        }
                    }
                ],
            slectIds:[],//选择的ID的数组

        };
    },
    methods: {
         //勾选改变
            selectChange(v){
                console.log(v);
                this.slectIds=[];
                v.forEach(i =>{
                    this.slectIds.push(i.sellerId);
                });
                //console.log(this.slectIds);
            },
        //查看详情
            lookDatsils(v){
                this.$router.push({path:"/storeAnalysis/index/datails",query:{name:v.taskName,taskId:v.taskId}})
            },
        //查看bsr小类
            lookSmallBsrCnt(v,index){
                //console.log(v);
                let parentAsinStr='top'+index+'ParentAsin';
                let parentAsin=v[parentAsinStr];
                console.log(parentAsinStr);
                console.log(parentAsin);
                this.$refs.layout.$dialog({
                    title: "查看类目",
                    size:"medium",
                    component: () => import("../common/lookSmallBsrCntDialog.vue"),
                    params:{
                        taskId: this.outerParams.taskId,
                        parentAsin:parentAsin
                    }
                    // okBtnText: "确认",
                    // cancelBtnText: "取消"
                })
            },
        //加入深度分析
            addDeepAnalysis(){
                if(this.slectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    });
                    return;
                };
                this.$refs.layout.$dialog({
                    title: "加入深度分析",
                    size:"small",
                    params: {
                        url:'taskShopDepthAnalysisSave',
                        platformId:this.platformId,
                        siteId:this.outerParams.siteId,
                        sellerId:this.outerParams.sellerId,
                        monitorSellerIds:this.slectIds,
                    },
                    component: () => import("../common/addDeepAnalysisDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });
            },
        //导出
            exportBtn(){
                let data={
                    taskId:this.outerParams.taskId,
                };
                if(this.slectIds.length>0){
                    data.sellerIds=this.slectIds;
                };
                return this.$api['taskShopAnalysisExportData'](data)
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let a = this.$refs.link;
                    a.href = url;
                    a.setAttribute("download", "店铺分析任务详情.xlsx");
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(() => {})
            },
        //查看品牌数
            lookBrandCnt(v){
                console.log(v.brandList);
                this.$refs.layout.$dialog({
                    title: "查看品牌",
                    size:"small",
                    params: {
                        data:v.brandList
                    },
                    component: () => import("../common/brandContDialog.vue"),
                    // okBtnText: "确认",
                    // cancelBtnText: "取消"
                });
            }
    },
    created() {
         this.outerParams.platformId=this.platformId;
        this.outerParams.taskId=this.$route.query.taskId;
        if (this.sellerId && this.siteId) {
           this.outerParams.siteId=this.siteId;
           this.outerParams.sellerId=this.sellerId;
        }
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

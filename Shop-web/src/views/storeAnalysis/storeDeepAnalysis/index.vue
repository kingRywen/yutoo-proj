<template>
    <div>
        <div v-if='$route.name==="storeDeepAnalysis"'>
            <MainLayout
                :outerParams="outerParams"
                :edits="edits"
                :searchFields="searchFields"
                :editBtns="editBtns"
                :columns="columns"
                ref="layout"
                :searchFunc='searchFunc'
                @selectChange='selectChange'
                url="taskShopDepthAnalysisList"
                >
                <!-- <div slot="left">123</div> -->
            </MainLayout>
        </div>
        <router-view v-else></router-view>
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
                    {
                        label: "抓取状态",
                        name: "status",
                        type: "select",
                        placeholder:'请选择数据类型',
                        options: [
                            {label: "待处理",value: 0 },
                            {label: "处理中",value: 1},
                            {label: "处理成功",value: 2},
                            {label: "处理失败",value: 3},
                        ]
                    },
                    {
                        label: "监控状态",
                        name: "monitor_flag",
                        type: "select",
                        placeholder:'请选择抓取状态',
                        options:[
                            { label: "未开启",value: 0 },
                            { label: "监控中",value: 1 },
                        ]
                    },
                    {
                        label: "创建时间",
                        name: "time",
                        type: "dateRange",
                        placeholder:'请选择'
                    },
                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "添加任务",
                        fn: () => {
                            this.$refs.layout.$dialog({
                                title: "添加任务",
                                width: "500px",
                                params: {siteId:this.outerParams.siteId,sellerId:this.outerParams.sellerId,platformId:this.platformId},
                                component: () => import("./common/addTaskDialog.vue"),
                                okBtnText: "确认",
                                cancelBtnText: "取消"
                            });
                        }
                    },
                    {
                        name: "删除",
                        showLoading:true,
                        fn: () =>{
                            return this.delBtn()
                        }
                    },
                    {
                        name: "添加监控",
                        fn: () =>{
                            this.addMonitoring()
                        }
                    },
                    {
                        name: "修改监控周期",
                        fn: () =>{
                            this.alterMonitoring()
                        }
                    },
                    {
                        name: "停止监控",
                         showLoading:true,
                        fn: () =>{
                            return this.stopMonitoring()
                        }
                    },
                    
                ],
            //columns表格
                 columns: [
                    {
                        label: "店铺ID",
                        value: "monitorSellerId",
                        minWidth: 150
                    },
                    {
                        label: "卖家名称",
                        value: "sellerName",
                        minWidth: 150,
                        render(h,scope){
                            return(
                                <a href={scope.row.sellerUrl} style={{color:"#108ee9"}} target='_blink'>{scope.row.sellerName ? scope.row.sellerName : '-' }</a>
                            )
                        }
                    },
                    {
                        label: "监控状态",
                        value: "monitorFlag",
                        minWidth: 150,
                        render(h, scope) {
                            return (
                                <span>{scope.row.monitorFlag==0? "未监控" : "监控中"}</span>
                            )
                        }

                    },
                    {
                        label: "监控周期",
                        value: "createTime",
                        width: 160,
                        render(h,scope){
                            let span=null;
                            //如果为null就用 '-' 代替
                            if(scope.row.monitorFrom && !scope.row.monitorTo){
                                 span=(<span>{scope.row.monitorFrom + "~" + '-'}</span>) ;

                            }else if(!scope.row.monitorFrom && scope.row.monitorTo){
                                span=(<span>{'-' + "~" + scope.row.monitorTo}</span>) ;

                            }else if(!scope.row.monitorFrom && !scope.row.monitorTo){
                                span="-";

                            }else{
                                 span=(<span>{scope.row.monitorFrom + "~" + scope.row.monitorTo}</span>) ;
                            }
                            //console.log(span)
                            return (
                              
                                <div>{span}</div> 
                              
                            )
                        }
                    },
                    {
                        label: "抓取状态",
                        value: "status",
                        minWidth: 150,
                        render(h, scope) {
                            return (
                                <span>{scope.row.status == 0 ? "待处理" : scope.row.status == 1 ? "处理中" : scope.row.status == 2 ? '处理成功' : "处理失败"}</span>
                            );
                        }
                    },
                    {
                        label: "创建时间",
                        value: "createTime",
                        minWidth: 150
                    },
                    {
                        label: "结果生成时间",
                        value: "resultTime",
                        minWidth: 150
                    }
                 ],
            //外部参数
                outerParams: {
                    startTime: null,
                    endTime: null,
                    platformId:'',
                    siteId: null,
                    sellerId: null
                },
            //表格列表操作按钮
                edits: [
                    {
                        name: "查看详情",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return scope.row.status===2;
                        },
                        fn: (scope) => {
                            return this.lookDatsils(scope.row)
                        }
                    },
                    {
                        name: "重新执行",
                        icon: "el-icon-refresh",
                        show: scope => {
                              return  scope.row.status>=3;
                        },
                        fn: (scope) => {
                            //console.log(scope);
                            return this.refetchOneData(scope.row.taskId)
                        }
                    }
                ],
            slectIds:[],//选择的ID的数组

        };
    },
    methods: {
        //参数处理
            searchFunc(data) {
                let {time, ...info} = data;
                let [startTime, endTime] = time || [];
                return {startTime, endTime, ...info}
            },
        //删除按钮
            delBtn(){
                if(this.slectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    });
                    return Promise.reject()
                };
                return this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$api['taskShopDepthAnalysisRemove']({
                        // siteId:this.outerParams.siteId,
                        // sellerId:this.outerParams.sellerId,
                        taskIds:this.slectIds
                    })
                    .then(data => {
                        if(data.code===0){
                            this.$refs.layout.getList()
                        }
                    }).catch(() => {})
                }).catch(() => {
                
                });
               
            },
         //勾选改变
            selectChange(v){
                    //console.log(v);
                    this.slectIds=[];
                    v.forEach(i =>{
                        this.slectIds.push(i.taskId);
                    });
                    //console.log(this.slectIds);
            },
        //查看详情
            lookDatsils(v){
                // console.log(v);
                // return
                this.$router.push({path:"/storeAnalysis/storeDeepAnalysis/datails",query:{name:v.sellerName,taskId:v.taskId}})
            },
         //重新抓取
            refetchOneData(id){
                this.$api['taskShopDepthAnalysisReCrawl']({
                    taskIds:[id]
                })
                .then(data => {
                    if(data.code===0){
                        this.$refs.layout.getList()
                    }
                }).catch(() => {})
            },
        //添加监控
            addMonitoring(){
                if(this.slectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    });
                    return
                };
                this.$refs.layout.$dialog({
                    title: "添加监控",
                    width: "500px",
                    params: {taskIds:this.slectIds,type:"add"},
                    component: () => import("./common/addAlterMonitoringDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });
            },
        //修改监控
            alterMonitoring(){
                 if(this.slectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    });
                    return
                };
                this.$refs.layout.$dialog({
                    title: "修改监控",
                    width: "500px",
                    params: {taskIds:this.slectIds,type:"alter"},
                    component: () => import("./common/addAlterMonitoringDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                });
            },
        //停止监控
            stopMonitoring(){
                if(this.slectIds.length===0){
                    this.$message({
                        message:"请至少选择一项",
                        type:'warning'
                    });
                    return  Promise.reject()
                };
                return this.$api['taskShopDepthAnalysisRemoveMonitor']({
                    taskIds:this.slectIds
                })
                .then(data => {
                    if(data.code===0){
                        this.$refs.layout.getList();
                    };
                }).catch(() => {})
            },
    },
    created() {
         this.outerParams.platformId=this.platformId;
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

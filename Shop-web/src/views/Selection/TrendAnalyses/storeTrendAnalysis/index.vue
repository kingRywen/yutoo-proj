<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :searchData="searchData"
            :editBtns="editBtns"
            :columns="columns"
            :treeTable="treeTable"
            @selectChange='selectChange'
            :searchFunc="searchFunc"
            :treeTableOtions="treeTableOtions"
            ref="layout"
            url="taskShopTrendAnalysisListTask"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
    </div>
</template>

<script>
export default {
    data() {
        let vm =this
        return {
            treeTable:false,
            treeTableOtions:{},
            searchData: {},
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "任务名称",
                        name: "taskName",
                        labelWidth:'60px',
                        type: "input",
                        placeholder:'请输入任务名称'
                    },
                    {
                        label: "数据类型",
                        name: "dataType",
                        type: "select",
                        placeholder:'请选择数据类型',
                        options: [
                            {label: "店铺链接",value: 0 },
                            {label: "Top100链接",value: 1}
                        ]
                    },
                    {
                        label: "链接",
                        name: "dataSource",
                        type: "input",
                        placeholder:'请输入任链接'
                    },
                    {
                        label: "抓取状态",
                        name: "status",
                        type: "select",
                        placeholder:'请选择抓取状态',
                        options:[
                            { label: "处理中",value: 1 },
                            { label: "处理成功",value: 2 },
                            { label: "处理失败",value: 3},   
                        ]
                    },
                    {
                        label: "时间范围",
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
                                // width: "500",
                                size:'small',
                                params: {
                                    isLink:false,
                                    type:'store',
                                    sellerId:this.outerParams.sellerId,
                                    siteId:this.outerParams.siteId,
                                    platformId:this.platformId,
                                },
                                component: () => import("../common/dialog.vue"),
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
                        name: "重新抓取数据",
                         showLoading:true,
                        fn: () =>{
                            return this.refetchData()
                        }
                    }
                ],
            //columns表格
                 columns: [
                    {
                        label: "任务名称",
                        value: "taskName",
                        minWidth: 150
                    },
                    {
                        label: "数据类型",
                        value: "dataType",
                        minWidth: 150,
                        render(h,scope){
                            return(
                                <span>{scope.row.dataType===0?'店铺链接':'Top100链接'}</span>
                            )
                        }

                    },
                    {
                        label: "链接数",
                        value: "dataSources",
                        minWidth: 150,
                        render(h, scope) {
                            return <el-button type='text' onClick={() =>{
                              vm.$refs.layout.$dialog({
                                title: "数据源",
                                size:"small",
                                params: {datas:scope.row.dataSources,isLink:true},
                                component: () => import("../common/dialog.vue"),
                                //okBtnText: "确认",
                                //cancelBtnText: "取消"
                            });
                        
                            }}>{scope.row.dataSources.length}</el-button>
                        }

                    },
                    {
                        label: "创建时间",
                        value: "createTime",
                        minWidth: 150
                    },
                    {
                        label: "抓取状态",
                        value: "status",
                        minWidth: 150,
                        render(h, scope) {
                            return (
                                <span>{scope.row.status == 1 ? "抓取中" : scope.row.status == 2 ? "抓取成功" : '抓取失败'}</span>
                            );
                        }
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
                    siteId: null,
                    sellerId: null,
                    platformId:null,
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
                        name: "重新抓取",
                        icon: "el-icon-refresh",
                        show: scope => {
                              return  scope.row.status===3;
                        },
                        fn: (scope) => {
                            //console.log(scope);
                            return this.refetchOneData(scope.row.taskId)
                        }
                    },

                ],
            selectIds:[],//table表格勾选的数组
        };
    },
    methods: {
        //参数处理
            searchFunc(data) {
                let {time, status,...info} = data;
                let [startTime, endTime] = time || [];
                if(!status){
                    status=null
                }
                return {startTime, status , endTime, ...info}
                
            },
        //删除按钮
            delBtn(){
                if(this.selectIds.length===0){
                    this.$message({
                        message:'请至少选择一项',
                        type: 'warning'
                    })
                    return Promise.reject()
                };
                return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    return this.$api['taskShopTrendAnalysisBatchRemove'](
                        {
                            sellerId:this.sellerId,
                            siteId:this.siteId,
                            ids:this.selectIds
                        }
                    ).then(data=>{
                        if(data.code===0){
                            this.$message({
                                message:'操作成功',
                                type: 'success'
                            });
                            this.$refs.layout.getList()
                        }
                    }).catch(() =>{
                        
                    })
                }).catch(() => {
                    
                });
              
            },
        //重新抓取数据
            refetchData(){
                if(this.selectIds.length===0){
                    this.$message({
                        message:'请至少选择一项',
                        type: 'warning'
                    })
                     return Promise.reject()
                };
                return this.$api['taskShopTrendAnalysisReExecute'](
                    {
                        sellerId:this.sellerId,
                        siteId:this.siteId,
                        ids:this.selectIds
                    }
                ).then(data=>{
                    if(data.code===0){
                      
                        this.$refs.layout.getList()
                    }
                }).catch(() =>{
                    
                })
            },
        //查看详情
            lookDatsils(n){
                //console.log(n);
                this.$router.push(
                    {path:'/selection/trendAnalyses/storetDatails',
                    query:{
                        name:n.taskName,//任务名称
                        taskId:n.taskId, //任务id
                        sellerId:n.sellerId,//卖家id
                        resultTime:n.resultTime,//有结果时间
                    }})
            },
        //刷新单条数据
            refetchOneData(v){
                this.$api['taskShopTrendAnalysisReExecute'](
                    {
                        sellerId:this.sellerId,
                        siteId:this.siteId,
                        ids:[v]
                    }
                ).then(data=>{
                    if(data.code===0){
                        this.$message({
                            message:'操作成功',
                            type: 'success'
                        });
                        this.$refs.layout.getList()
                    }
                }).catch(() =>{
                    
                })
            },
        //table勾选改变
            selectChange(v){
                this.selectIds=[];
                v.forEach(i=>{
                    this.selectIds.push(i.taskId);
                });
                
            }

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

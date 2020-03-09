<template>
  <div>
    <div v-if='$route.name==="selection"'>
    
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            :treeTable="treeTable"
            :searchFunc="searchFunc"
            @selectChange='selectChange'
            ref="layout"
            url="taskSelectionList"
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
            treeTable:false,
            treeTableOtions:{},
            searchData: {},
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "任务名称",
                        name: "taskName",
                        type: "input",
                        labelWidth:'60px',
                        placeholder:'请输入任务名称'
                    },
                    {
                        label: "数据类型",
                        name: "dataType",
                        type: "select",
                        placeholder:'请选择数据类型',
                        options: [
                            {label: "产品",value: 0 },
                            {label: "关键词",value: 1},
                            {label: "类目",value: 2},
                            {label: "top100链接",value: 3},
                        ]
                    },
                    {
                        label: "链接",
                        name: "dataSource",
                        type: "input",
                        placeholder:'请输入链接'
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
                                size:'small',
                                params: {isLink:false,type:'store',siteId:this.outerParams.siteId,sellerId:this.outerParams.sellerId},
                                component: () => import("./common/dialog.vue"),
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
                            return (
                                <div>
                                    <span>
                                        {scope.row.dataType == 0 ? "产品" 
                                        : scope.row.dataType == 1 ? '关键词' 
                                        :scope.row.dataType == 2 ? '类目' 
                                        : "top100链接"}
                                    </span>

                                </div>
                            )
                        }
                    },
                    {
                        label: "抓取源",
                        value: "dataSources",
                        minWidth: 150,
                        render(h, scope) {
                            //console.log(scope);
                            return <el-button type='text' onClick={() =>{
                              vm.$refs.layout.$dialog({
                                title: "数据源",
                                size:"medium",
                                params: {
                                    datas:scope.row.dataSources, 
                                    categoryUrl:scope.row.categoryUrl,
                                    searchPages:scope.row.searchPages,
                                    isLink:true,
                                    dataType:scope.row.dataType
                                },
                                component: () => import("./common/dialog.vue"),
                                //okBtnText: "",
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
                    platformId:null,
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

            slectIds:[],//选择的ID的数组
        };
    },
    methods: {
        //参数处理
            searchFunc(data) {
                let {time,status, ...info} = data;
                let [startTime, endTime] = time || [];
                if(!status){
                    status=null;
                }
                return {startTime, status,endTime, ...info}
            },
        //勾选改变
            selectChange(v){
                     console.log(v);
                    this.slectIds=[];
                    v.forEach(i =>{
                        this.slectIds.push(i.taskId);
                    });
                    //console.log(this.slectIds);
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
                    return this.$api['taskSelectionBatchRemove']({
                        siteId:this.outerParams.siteId,
                        sellerId:this.outerParams.sellerId,
                        ids:this.slectIds
                    })
                    .then(data => {
                        if(data.code===0){
                            this.$refs.layout.getList()
                        }
                    }).catch(() => {})
                }).catch(() => {

                });
               
            },
        //查看详情
            lookDatsils(v){
                //console.log(v);
                this.$router.push({path:"/selection/index/selectionDatails",query:{name:v.taskName,taskId:v.taskId}})
            },
        //重新抓取
            refetchOneData(id){
                this.$api['taskSelectionReExecute']({
                    siteId:this.outerParams.siteId,
                    sellerId:this.outerParams.sellerId,
                    ids:[id]
                })
                .then(data => {
                    if(data.code===0){
                        this.$refs.layout.getList()
                    }
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
}
</script>

<style  scoped lang="less">

</style>

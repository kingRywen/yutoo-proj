<template>
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :columns="columns" 
            ref="layout" 
            :searchFunc='searchFunc'
            @selectChange='selectChange' 
            url="taskRankResearchList">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
export default {
    data() {
        let vm=this;
        return {
            outerParams:{

            },
            searchFields:[
                {
                    label: "任务名称",
                    name: "taskName",
                    type: "input",
                    labelWidth:'60px',
                    placeholder: "请输入任务名称"
                },
                {
                    label: "监控状态",
                    name: "monitorFlag",
                    type: "select",
                    placeholder: "请选择监控状态",
                    options: [
                        { label: "否", value: 0 },
                        { label: "是", value: 1 },
                    ]
                },
                {
                    label: "抓取状态",
                    name: "status",
                    type: "select",
                    placeholder: "请选择抓取状态",
                    options: [
                        { label: "抓取中", value: 1 },
                        { label: "抓取成功", value: 2 },
                        { label: "抓取失败", value: 3 },
                    ]
                },
                {
                    label: "",
                    name: "ourType",
                    type: "select",
                    placeholder: "是否本店产品",
                    options: [
                        { label: "否", value: 0 },
                        { label: "是", value: 1 },
                    ]
                },
                {
                    label: "创建时间",
                    name: "time",
                    type: "dateRange",
                    placeholder: "请选择"
                }
            ],
            editBtns:[
                 {
                    name: "添加任务",
                    fn: () => {
                        this.$refs.layout.$dialog({
                            title: "添加任务",
                            width:'500px',
                            //size:'small',
                            params: {
                            // isLink: false,
                            // type: "store",
                            // siteId: this.outerParams.siteId,
                            // sellerId: this.outerParams.sellerId
                            },
                            component: () => import("./dialog/addTaskDialog"),
                            okBtnText: "确认",
                            cancelBtnText: "取消"
                        });
                    }
                },
                {
                    name: "停止监控",
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                        let data = this.$refs.layout.selection;
                        //console.log(data);
                        // if (data.some(el => el.status !== 1)) {
                        //     this.$message.warning('选择项中已经存在停止状态')
                        //     return
                        // }
                        let taskIds=this.$refs.layout.selection.map(i=>{
                            return i.taskId
                        });
                        return this.stopMonitor(taskIds)
                    }
                },
                {
                    name: "开启监控",
                    //showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                        let taskIds=this.$refs.layout.selection.map(i=>{
                            return i.taskId
                        });
                        let params = {
                            taskIds
                        };
                        params.url = 'taskRankResearchAddMonitor';
                        this.$refs.layout.$dialog({
                            title: "开启监控",
                            width:'500px',
                            //size:'small',
                            params:params,
                            component: () => import("./dialog/addOralterMonitoringDialog.vue"),
                            okBtnText: "确认",
                            cancelBtnText: "取消"
                        });
                    }
                },
                {
                    name: "修改监控",
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                        let taskIds=this.$refs.layout.selection.map(i=>{
                            return i.taskId
                        });
                        let params = {
                            taskIds
                        };
                        //如果选中的是一项就回显
                        if(this.$refs.layout.selection.length === 1){
                            params.monitorFrom = this.$refs.layout.selection[0].monitorFrom;
                            params.monitorTo = this.$refs.layout.selection[0].monitorTo;
                            params.frequency = this.$refs.layout.selection[0].frequency;
                        };   
                        params.url = 'taskRankResearchUpdateMonitor';
                        this.$refs.layout.$dialog({
                            title: "修改监控",
                            width:'500px',
                            //size:'small',
                            params:params,
                            component: () => import("./dialog/addOralterMonitoringDialog.vue"),
                            okBtnText: "确认",
                            cancelBtnText: "取消"
                        });
                    }
                },
                {
                    name: "删除",
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                        return this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            let taskIds=this.$refs.layout.selection.map(i=>{
                                return i.taskId
                            });
                            return this.$api['taskRankResearchRemove']({
                                taskIds
                            })
                            .then(data => {
                                vm.$refs.layout.getList()
                            }).catch(() => {})
                        }).catch(() => {
                        
                        });          
                       
                    }
                },
            ],
            edits:[
                {
                    name: "查看详情",
                    icon: "el-icon-search",
                    show: scope => {
                    //console.log(scope);
                    return scope.row.status===2;
                    },
                    fn: scope => {
                    return this.lookDatsils(scope.row);
                    }
                },
            ],
            columns:[
                {
                    label: "任务名称",
                    value: "taskName",
                    minWidth: 150
                },
                {
                    label: "产品数量",
                    value: "asins",
                    minWidth: 120,
                    render(h,scope){
                        return(
                             <el-button type='text' onClick={()=>{vm.lookProductLenght(scope.row.asins,'asin')}} style='color:'>{scope.row.asins.length}</el-button>
                        )                      
                    }
                },
                {
                    label: "关键词数量",
                    value: "asins",
                    minWidth: 120,
                    render(h,scope){
                        return(
                             <el-button type='text' onClick={()=>{vm.lookProductLenght(scope.row.keywords,'keywords')}} style='color:'>{scope.row.keywords.length}</el-button>
                        )                      
                    }
                },
                {
                    label: "是否本店产品",
                    value: "ourType",
                    minWidth: 120,
                    enum:{
                        0:'否',
                        1:"是"
                    }
                },
                {
                    label: "监控状态",
                    value: "monitorFlag",
                    minWidth: 120,
                    enum:{
                        0:'否',
                        1:'是',
                    }
                },
                {
                    label: "监控周期",
                    value: "monitorFrom",
                    minWidth: 170,
                    render(h,scope){
                        let span;
                        let { monitorFrom , monitorTo } = scope.row;
                        if( monitorFrom && monitorTo){
                            span=( monitorFrom  +"~" + monitorTo )
                        }else if ( monitorFrom && !monitorTo){
                            span=( monitorFrom  +"~" + '-')
                        }else if (  !monitorFrom && monitorTo){
                            span=( '-'  +"~" + monitorTo)
                        }else{
                            span=('-')
                        }
                        return(
                            <span>{ span }</span>
                        )
                    }
                },
                {
                    label: "抓取频率",
                    value: "frequency",
                    minWidth: 120
                },
                {
                    label: "创建时间",
                    value: "createTime",
                    minWidth: 150
                },
                {
                    label: "抓取状态",
                    value: "status",
                    minWidth: 120,
                    enum:{
                        0:'待处理',
                        1:'处理中',
                        2:'处理成功',
                        3:'处理失败'
                    }
                },
                {
                    label: "结果生成时间",
                    value: "resultTime",
                    minWidth: 150
                },

            ],

            slectIds:[]
        };
    },
    methods: {
        //参数处理
        searchFunc(data) {
            let { time, ...info } = data;
            let [startTime, endTime] = time || [];
            return { startTime, endTime, ...info };
        },
        selectChange(v){
            this.slectIds = [];
            v.forEach(i => {
                this.slectIds.push(i.taskId);
            });
        },
        //查看产品数量
        lookProductLenght(data,type){
            let tit = type === 'asin' ? '产品' : '关键词' ;
            //console.log(1);
            this.$refs.layout.$dialog({
                title: tit,
                size:"small",
                params: {
                    data,
                    type,
                },
                component: () => import("./dialog/lookProductNumDialog")
                //okBtnText: "",
                //cancelBtnText: "取消"
            });
        },
        //查看详情
        lookDatsils(v){
            this.$router.push({
                path: "/RankingResearch/tab2Datails",
                query: { name: v.taskName, taskId: v.taskId , keywordOptions:v.keywords }
            });
        },
        //取消监控
        stopMonitor(v){
            return this.$api['taskRankResearchRemoveMonitor']({
                taskIds:v
            })
            .then(data => {
                this.$refs.layout.getList()
            }).catch(() => {})
        }
    },
    created() {
        this.outerParams.platformId=this.platformId;
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

</style>

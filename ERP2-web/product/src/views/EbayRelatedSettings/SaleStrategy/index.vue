<template>
    <div>
        <MainLayout
            :edit-btns="edits"
            :searchFields="searchFields"
            :searchData="searchData"
            :right-edit-btns="editBtns"
            :columns="columns"
            :leftTree='false'
            :treeTable="treeTable"
            :topBatchBtn='topBatchData'
            :searchFunc="searchFunc"
            :treeTableOtions="treeTableOtions"
            @selectChange='selectChange'
            ref="layout"
            url="product/prSellStrategyEbayList"
            @left-batch-change='leftBatchChange'
        >
        </MainLayout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            treeTable:false,
            treeTableOtions:{},
            searchData:{},
            edits:[
                {
                    name: '编辑',
                    icon: 'el-icon-edit-outline',
                    show: scope => {
                        return true //scope.row.productStatus === 1
                    },
                    fn: (scope) => {
                        //console.log(scope.row);
                        this.$refs.layout.$dialog({
                                title: '编辑',
                                width: '1000px',
                                params:{
                                    strategyId:scope.row.strategyId,
                                    type:'edit'
                                },
                                component: () => import('./dialogs/add.vue'),
                                okBtnText: '确认',
                                cancelBtnText: '取消'
                            })
                    }
                },
                {
                    name: '删除',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.deleteItem(scope.row.strategyId)
                    }
                },
                {
                    name: '复制添加',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.copyAdd(scope.row)
                    }
                },
                {
                    name: '操作日志',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.operationLog()
                    }
                },
            ],
            searchFields:{
                strategyType: {
                    widget: 'select',
                    labelWidth:'44px',
                    label: '类型',
                    options:[
                        {label:"每日",value:0},
                        {label:"周一到周日",value:1},
                    ],
                    span: 8
                },
                datetime: {
                    hidden: true,
                    widget: 'daterange',
                    label: '添加时间',
                    time: true, // 是否显示时间
                    span: 8,
                    width:300
                },
            },
            topBatchData:{
                title:'删除',
                props: {
                    label: 'label',
                    value: 'value',
                    expandTrigger: 'hover'
                },
                options: [
                    {label: '删除',value:0},
                ],
                // 搜索
                search: {
                    field: 'strategyName',
                    placeholder: '请输入策略名称'
                }
            },
            columns:[
                {
                    label: '策略名称',
                    value: 'strategyName',
                    minWidth: 150
                },
                {
                    label: '类型',
                    value: 'strategyType',
                    minWidth: 150,
                    _enum:{
                        0:"每日",
                        1:'周一到周日'
                    }
                },
                {
                    label: '是否激活',
                    value: 'pauseFlag',
                    minWidth: 150,
                    _enum:{
                        0:"禁用",
                        1:'激活'
                    }
                },
                {
                    label: '添加人员',
                    value: 'creator',
                    minWidth: 150
                },
                {
                    label: '添加时间',
                    value: 'createTime',
                    minWidth: 150
                },
            ],
            editBtns:[
                {
                    name: '添加',
                    perm: 'add',
                    fn: (scope) => {
                        this.$refs.layout.$dialog({
                            title: '添加策略',
                            width: '1000px',
                            params:{
                                type:'add'
                            },
                            component: () => import('./dialogs/add.vue'),
                            okBtnText: '确认',
                            cancelBtnText: '取消'
                        })
                    }
                }
            ],

            selctIds:[],
        };
    },
    methods: {
        searchFunc(data){
            let {datetime,...info}=data;
            let [startTime,endTime] = datetime || []
            return {startTime,endTime,...info}
        },
        leftBatchChange(v){
            let val = v[0]
            console.log(v);
            if(val===0){
                this.deleteItem(this.selctIds)
            }

        },
        selectChange(v){
            //console.log(v);
            this.selctIds = v.map(i=>{
                return i.strategyId
            })
        },
        deleteItem(v){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let strategyIds = Array.isArray(v) ? v : [v]
                this.$api[`product/prSellStrategyEbayRemove`]({
                    strategyIds
                }).then(res=>{
                    this.getLayoutList()
                })
            })
        },
        copyAdd(v){
            //console.log(v);
            this.$refs.layout.$dialog({
                title: '添加策略',
                width: '1000px',
                params:{
                    type:'copyAdd',
                    data:v
                },
                component: () => import('./dialogs/add.vue'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        operationLog(){
            this.$refs.layout.$dialog({
                title: '产品操作日志',
                width: '1000px',
                params:{
                   modelLogType:2,
                },
                component: () => import('Views/modules/product/setup/common/log'),
                // okBtnText: '确认',
                // cancelBtnText: '取消'
            })
        },
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>

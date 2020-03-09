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
            url="product/PrConfigGatherAccountEbayList"
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
            searchFields:{
                datetime: {
                    widget: 'daterange',
                    label: '添加时间',
                    time: true, // 是否显示时间
                    span: 8,
                    width:300
                },
            },
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
                                title: 'eBay店铺和Paypal账号关联',
                                width: '1000px',
                                params:{
                                    gatherAccountId:scope.row.gatherAccountId,
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
                        return this.deleteItem(scope.row.gatherAccountId)
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
                    field: 'keyword',
                    placeholder: '请输入自定义账户名、用户名、签名..'
                }
            },
            columns:[
                {
                    label: '店铺名称',
                    value: 'storeName',
                    minWidth: 150
                },
                {
                    label: '关联PayPal账号',
                    value: 'paypalAccount',
                    minWidth: 150
                },
                {
                    label: '是否激活',
                    value: 'apiSignature',
                    minWidth: 150,
                    _enum:{
                        1:'激活',
                        0:'未激活',
                    }
                },
                {
                    label: '添加时间',
                    value: 'createTime',
                    minWidth: 150
                },
                {
                    label: '添加人员',
                    value: 'userName',
                    minWidth: 150
                },
            ],
            editBtns:[
                {
                    name: '添加',
                    perm: 'add',
                    fn: (scope) => {
                        this.$refs.layout.$dialog({
                            title: 'eBay店铺和Paypal账号关联',
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
            let [queryCreateStartTime,queryCreateEndTime] = datetime || []
            return {queryCreateStartTime,queryCreateEndTime,...info}
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
                return i.gatherAccountId
            })
        },
        deleteItem(v){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idArray = Array.isArray(v) ? v : [v]
                this.$api[`product/PrConfigGatherAccountEbayRemove`]({
                    idArray
                }).then(res=>{
                    this.getLayoutList()
                })
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

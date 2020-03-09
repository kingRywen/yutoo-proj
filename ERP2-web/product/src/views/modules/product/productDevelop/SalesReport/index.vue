<template>
    <div>
        <MainLayout
            :edit-btns="edits"
            :searchFields="searchFields"
            :searchData="searchData"
            :right-edit-btns="editBtns"
            :columns="columns"
            :leftTree='false'
            :tabs='tabs'
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
            tabs: [
                {
                    name: '正常',
                    num: '-',
                    query: {
                        tableStatus: 0
                    }
                },
                {
                    name: '待编辑',
                    num: '-',
                    query: {
                        tableStatus: 1
                    }
                },
                {
                    name: '待审核',
                    num: '-',
                    query: {
                        tableStatus: 2
                    }
                },
                {
                    name: '待分配',
                    num: '-',
                    query: {
                        tableStatus: 3
                    }
                },
                {
                    name: '开发中',
                    num: '-',
                    query: {
                        tableStatus: 4
                    }
                },
                {
                    name: '已导入',
                    num: '-',
                    query: {
                        tableStatus: 4
                    }
                },
                {
                    name: '所有',
                    num: '-',
                    query: {
                        tableStatus: 4
                    }
                },
                       
            ],
            treeTable:false,
            treeTableOtions:{},
            searchData:{},
            edits:[
                {
                    name: '导入产品库',
                    icon: 'el-icon-edit-outline',
                    show: scope => {
                        return true 
                    },
                    fn: (scope) => {
                       
                    }
                },
                {
                    name: '查看',
                    icon: 'el-icon-edit-outline',
                    show: scope => {
                        return true 
                    },
                    fn: (scope) => {
                        return this.lookDatails()
                    }
                },
                {
                    name: '删除',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.deleteItem(scope.row.strategyId)
                    }
                },
            ],
            searchFields:{
                plat:{
                    widget: 'select',
                    labelWidth:'80px',
                    label: '来源平台',
                    options:()=>{
                        return this.getPlatsOpts()
                    },
                    span: 8
                },
                remark: {
                    hidden: true,
                    widget: 'input',
                    labelWidth:'60px',
                    label: '日估算',
                    span: 8
                },
                people3: {
                    hidden: true,
                    widget: 'select',
                    labelWidth:'80px',
                    label: '销售平台',
                    options:()=>{
                        return this.getSalesOpts()
                    },
                    span: 8
                },
                people5: {
                    hidden: true,
                    widget: 'select',
                    labelWidth:'44px',
                    label: '站点',
                    options:()=>{
                        return this.getSitesOpts()
                    },
                    span: 8
                },
                people: {
                    hidden: true,
                    widget: 'select',
                    labelWidth:'80px',
                    label: '开发人员',
                    options:()=>{
                        return this.getDevelopOpts()
                    },
                    span: 8
                },
                people10: {
                    hidden: true,
                    widget: 'select',
                    labelWidth:'80px',
                    label: '提交人',
                    options:()=>{
                        return this.getSubmitOpts()
                    },
                    span: 8
                },
                datetime1: {
                    hidden: true,
                    widget: 'daterange',
                    label: '添加时间',
                    time: true, // 是否显示时间
                    span: 8,
                    width:300
                },
                
            },
            editBtns:[
                 {
                    name: '添加',
                    perm: 'add',
                    fn: (scope) => {
                        this.$refs.layout.$dialog({
                            title: '创建',
                            width: '1000px',
                            params:{
                                type:'add'
                            },
                            component: () => import('./dialogs/add'),
                            okBtnText: '确认',
                            cancelBtnText: '取消'
                        })
                    }
                }
            ],
            columns:[
                {
                    label:"状态",
                    value:'',
                },
                {
                    label:"图片",
                    value:'',
                    img:true,
                },
                {
                    label:"标题",
                    value:'',
                },
                {
                    label:"属性",
                    value:'',
                },
                {
                    label:"单价",
                    value:'',
                },
                {
                    label:"平台",
                    value:'',
                },
                {
                    label:"地址",
                    value:'',
                },
                {
                    label:"采集时间",
                    value:'',
                },
                {
                    label:"采集人",
                    value:'',
                },
                {
                    label:"导入人",
                    value:'',
                },
                {
                    label:"导入时间",
                    value:'',
                },
                {
                    label:"备注",
                    value:'',
                },
            ],
            topBatchData:{
                title:'产品',
                props: {
                    label: 'label',
                    value: 'value',
                    expandTrigger: 'hover'
                },
                options: [
                    {label: '删除',value:0},
                    {label: '认领',value:1},
                ],
                // 搜索
                search: {
                    field: 'strategyName',
                    placeholder: '请输入名称'
                }
            },



        };
    },
    methods: {
        searchFunc(){

        },
        selectChange(){

        },
        leftBatchChange(v){
            let val = v[0]
            console.log(v);
        },
        lookDatails(){

        },
        changeStatus(){
            this.$confirm(`是否继续此操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
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
        //获取来源平台
        getPlatsOpts(){
            return this.$api[`product/SMGlPlatList`]({})
            .then((res) => {
                let {rows} = res
                let  arr = rows.map(i=>{
                    return {label:i.platName,value:i.platId}
                })
                return arr
            })
        },
        //获取销售平台
        getSalesOpts(){
            this.$api[`product/url`](params)
            .then((data) => {
              
            })
        },
        //获取站点
        getSitesOpts(){
            this.$api[`product/url`](params)
            .then((data) => {
              
            })
        },
        //获取开发人员
        getDevelopOpts(){
            this.$api[`product/url`](params)
            .then((data) => {
              
            })
        },
        //获取提交人
        getSubmitOpts(){
            this.$api[`product/url`](params)
            .then((data) => {
              
            })
        },
        //获取认领人员
        getclaimOpts(){
             this.$api[`product/url`](params)
            .then((data) => {
              
            })
        }
    },
    created() {

    },
};
</script>

<style scoped lang="scss">

</style>

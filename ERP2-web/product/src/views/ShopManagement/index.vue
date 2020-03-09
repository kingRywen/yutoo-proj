<template>
    <div>
        <MainLayout
        :edit-btns="edits"
        :searchFields="searchFields"
        :searchData="searchData"
        :right-edit-btns="editBtns"
        :leftTree='false'
        :columns="columns"
        :treeTable="treeTable"
        :topBatchBtn='topBatchData'
        :searchFunc="searchFunc"
        :treeTableOtions="treeTableOtions"
        @selectChange='selectChange'
        ref="layout"
        url="product/GlStoreList"
        @left-batch-change='leftBatchChange'
        ></MainLayout>
    </div>
</template>

<script>
import { Promise } from 'q';
export default {
    data() {
        let vm = this
        return {
            treeTable:false,
            treeTableOtions:{},
            topBatchData:{
                title:'店铺',
                props: {
                    label: 'label',
                    value: 'value',
                    expandTrigger: 'hover'
                },
                options: [
                    {label: '删除',value:0},
                    {label: '设置发货单',value:1},
                    {label: '开启',value:2},
                    {label: '禁用',value:3},
                ],
                // 搜索
                search: {
                    field: 'keyword',
                    placeholder: '请输入店铺名称'
                }
            },
            edits: [
                {
                    name: '编辑',
                    icon: 'el-icon-edit-outline',
                    show: scope => {
                        return scope.row.productStatus === 1
                    },
                    fn: (scope) => {
                       this.$refs.layout.$dialog({
                            title: '编辑',
                            width: '1000px',
                            params:{storeId:scope.row.storeId},
                            component: () => import('./dialogs/addShop.vue'),
                            okBtnText: '确认',
                            cancelBtnText: '取消'
                        })
                    }
                },
                {
                    name: '删除',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.deleteItem(scope.row.storeId)
                    }
                },
                {
                    name: '开启',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.changeStatus(scope.row.storeId,'开启')
                    }
                },
                {
                    name: '禁用',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                         return this.changeStatus(scope.row.storeId,'关闭')
                    }
                },
                {
                    name: '设置发货单',
                    icon: 'el-icon-edit-outline',
                    fn: (scope) => {
                        return this.setInvoice(scope.row.storeId)
                    }
                },
                {
                    name: '操作日志',
                    icon: 'el-icon-edit-outline',
                    fn: () => {
                        console.log(666);
                        return this.operationLog()
                    }
                },
            ],
            searchFields:{
                platId: {
                    labelWidth: '44px',
                    widget: 'select',
                    label: '平台',
                    change:(value) => {
                        // console.log(value)
                        this.$set(value, 'platSiteId', null)
                        console.log(value);
                        if(!value.platId && value.platId!==0){
                            this.searchFields.platSiteId.options = []
                        }else{
                            this.searchFields.platSiteId.options = ()=>{
                                return this.getPlatList().then(res=>{
                                    return res
                                }).catch(err=>{
                                    return []
                                })
                            }
                        }
                        
                    },
                    options: () =>{ return this.getPlats().then(res=>{
                            return res
                        }).catch(err=>{
                            return []
                        })
                    }, 
                    span: 8
                },
                datetime: {
                    hidden: true,
                    widget: 'daterange',
                    label: '创建时间',
                    time: true, // 是否显示时间
                    span: 8,
                    width:300
                },
                apiFlag:{
                    hidden: true,
                    widget: 'select',
                    label: '店铺状态',
                    span: 8,
                    options: [
                        { label: '已授权', value: 1 },
                        { label: '未授权', value: 0 },
                    ],
                },
                platSiteId:{
                    hidden: true,
                    widget: 'select',
                    label: '站点',
                    span: 8,
                    options: () =>{ return this.getPlatList().then(res=>{
                            return res
                        }).catch(err=>{
                            return []
                        })
                    } 
                },
                userId:{
                    hidden: true,
                    widget: 'select',
                    label: '添加人员',
                    span: 8,
                    options:()=>{ return this.getUsers().then(res=>{
                            return res
                        }).catch(err=>{
                            return []
                        })
                    } 
                }
            },
            searchData:{
            },
            editBtns:[
                {
                    name: '添加店铺',
                    perm: 'addShop',
                    fn: () => {
                        this.$refs.layout.$dialog({
                            title: '添加店铺',
                            width: '1000px',
                            component: () => import('./dialogs/addShop.vue'),
                            okBtnText: '确认',
                            cancelBtnText: '取消'
                        })
                    }
                }
            ],
            columns:[
                {
                    label: '店铺名称',
                    value: 'storeName',
                    minWidth: 150
                },
                {
                    label: '平台',
                    value: 'platName',
                    minWidth: 150
                },
                {
                    label: '站点',
                    value: 'platSiteName',
                    minWidth: 150
                },
                {
                    label: '添加时间',
                    value: 'createTime',
                    minWidth: 150,
                    sortable:'custom'
                },
                {
                    label: '店铺授权状态',
                    value: 'apiFlag',
                    minWidth: 150,
                    render(h,scope){
                        let {apiFlag} = scope.row
                        let btn ;
                        if(!apiFlag){
                            btn = <el-button type='text' onClick={()=>{vm.shopAuthorizationBtn(scope.row)}}>立即授权</el-button>
                        }else{
                            btn= '已授权'
                        }
                        return (
                            <div>{btn}</div>
                        )
                    }
                    
                },
                {
                    label: '广告授权状态',
                    value: 'adApiFlag',
                    minWidth: 150,
                    render(h,scope){
                        let {adApiFlag} = scope.row
                        let btn ;
                        if(!adApiFlag){
                            btn = <el-button type='text' onClick={()=>{vm.adAuthorizationBtn(scope.row)}}>立即授权</el-button>
                        }else{
                            btn= '已授权'
                        }
                        return (
                            <div>{btn}</div>
                        )
                    }
                },
                {
                    label: '备注',
                    value: 'remark',
                    minWidth: 150,
                },
                {
                    label: '是否激活',
                    value: 'activateFlag',
                    minWidth: 150,
                    _enum:{
                        0:'否',
                        1:'是'
                    }
                },
            ],

            selctIds:[],

            platOpts:'',//平台的数据
            platId:'',//当前选择的平台
            AmazonId:"",//记录Amazon平台的id

        };
    },
    methods: {
        
        searchFunc(data){
            //console.log(data);
            let {datetime,platId,...info}=data;
            let [queryCreateStartTime,queryCreateEndTime] = datetime || [];
            this.platId = platId
            return {queryCreateStartTime,queryCreateEndTime,platId,...info}
        },
        leftBatchChange(v){
            //console.log(v);
            let val = v[0]
            switch(val){
                case 0:
                    this.deleteItem(this.selctIds)
                break;
                case 1:
                    this.setInvoice(this.selctIds)
                break;
                case 2:
                    this.changeStatus(this.selctIds,'开启')
                break;
                case 3:
                    this.changeStatus(this.selctIds,'关闭')
                break;
                default:
                break;
            }
        },
        selectChange(v){
            //console.log(v);
            this.selctIds = v.map(i=>{
                return i.storeId
            })
        },
        //店铺授权
        shopAuthorizationBtn(v){
            //console.log(v);
            let { platName , storeId}  = v
            this.$refs.layout.$dialog({
              title: platName,
              width: '1000px',
              params:{
                  storeId ,
                  platName
              },
              component: () => import('./dialogs/shopAuthorization/index'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
        },
        //广告授权
        adAuthorizationBtn(v){
            let {storeId} = v
            this.$refs.layout.$dialog({
              title: '授权教程',
              width: '1000px',
              params:{storeId},
              component: () => import('./dialogs/adAuthorization'),
              okBtnText: '复制URL',
              cancelBtnText: '取消'
            })
        },
        //获取人员
        getUsers(){
            return this.$api[`product/SMpermissionUserList`](
                {
                    types:['Develop']
                }
            )
            .then((res) => {
                let { rows } = res
                //console.log(rows);
                let arr 
                rows.forEach(i=>{
                    if(i.type === 'Develop'){
                        let current = i.users
                        arr = current.map(k=>{
                            return {label:k.userName , value:k.userId }
                        })

                    }
                })
                return  Promise.resolve(arr)
            })
        },
        //获取站点
        getPlatList(){
            if( !this.platId && this.platId !==0 ){
                return 
            }
            if (this.platId === this.AmazonId) { //相等是亚马逊平台
                return this.$api[`product/SMGlPlatSiteContinentList`](
                    {
                        platId:this.platId
                    }
                )
                .then((res) => {
                    let { rows } = res
                    //console.log(rows);
                    let arr = rows.map(i=>{
                        return {label:i.continentCn , value:i.continentKey }
                    })
                    return  Promise.resolve(arr)
                })
            } else {
                return this.$api[`product/SMGlPlatSiteList`]({
                    platId : this.platId
                })
                .then((res) => {
                    let { rows } = res
                    //console.log(rows);
                    let arr = rows.map(i=>{
                        return {label:i.siteNameCn , value:i.platSiteId }
                    })
                    return  Promise.resolve(arr)
                })
            }
        },
        //获取平台
        getPlats(){
            return this.$api[`product/SMGlPlatList`]({})
            .then((res) => {
                let {rows} = res
                let  arr = rows.map(i=>{
                    return {label:i.platName,value:i.platId}
                })
                this.platOpts = arr
                this.platOpts.forEach( k => {
                    if (k.label === 'Amazon') {
                        this.AmazonId = k.value
                    }
                })
                return  Promise.resolve(arr)
            })
        },
        //删除一项
        deleteItem(v){
            this.$confirm(`此操作将永久删除该数据, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let idArray = Array.isArray(v) ? v : [v]
                this.$api[`product/GlStoreRemove`]({
                    idArray
                }).then(res=>{
                    this.getLayoutList()
                })
            })
        },
        //开启或禁用
        changeStatus(v,status){
            this.$confirm(`此操作将${status}此项, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = status === '开启' ? 'product/GlStoreActivate' : 'product/GlStorecancelActivate'
                let idArray = Array.isArray(v) ? v : [v]
                this.$api[url]({
                    idArray 
                }).then(()=>{
                    this.getLayoutList()
                })
            })
        },
        //设置发货单
        setInvoice(v){
            this.$refs.layout.$dialog({
              title: '设置发货单',
              width: '1000px',
              params:{storeId :v },
              component: () => import('./dialogs/setShipOrder.vue'),
              okBtnText: '确定',
              cancelBtnText: '取消'
            })
        },
        //操作日志
        operationLog(){
            this.$refs.layout.$dialog({
                title: '产品操作日志',
                width: '1000px',
                params:{
                   modelLogType:4,
                },
                component: () => import('Views/modules/product/setup/common/log'),
                // okBtnText: '确认',
                // cancelBtnText: '取消'
            })
        },
    },
    created() {
        //this.getUsers()
        //this.getPlatList()
        // this.getPlats()
    },
};
</script>

<style scoped lang="scss">

</style>

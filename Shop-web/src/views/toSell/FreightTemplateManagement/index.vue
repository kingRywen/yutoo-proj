<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :editBtns="editBtns"
            :columns="columns"
            :edits='edits'
            @selectChange='selectChange' 
            :searchFunc='searchFunc'
            :searchFields='searchFields'
            ref="layout"
            url="saleFareTempList"
            >
       </MainLayout>
    </div>
</template>

<script>
export default {
    data() {
        return {
            outerParams:{

            },
            searchFields:[
                {
                    label: "模板名称",
                    name: "tempName",
                    type: "input",
                    placeholder: "请输入模板名称",
                    labelWidth:'60px'
                },
                {
                    label: "适用店铺",
                    name: "sellerIds",
                    type: "select",
                    multi:true,
                    width:'240px',
                    placeholder: "请选择适用店铺",
                    options:[
                        {label:'1',value:1},
                        {label:'2',value:2},
                        {label:'3',value:3},
                    ]
                },
                {
                    label: "添加时间",
                    name: "time",
                    type: "dateRange",
                    placeholder: "请选择添加时间"
                },
            ],
            editBtns:[
                {
                    name: '添加模板',
                    //showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    fn: ()=>{
                        this.addCont();
                    }
                },
                {
                    name: '删除',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                       return this.delete();
                    }
                },
            ],
            columns:[
                {
                    label:'模板名称',
                    value:"tempName",
                    minWidth:110
                },
                {
                    label:'运费金额',
                    value:"fare",
                    //sortable:'custom',
                    minWidth:110
                },
                {
                    label:'适用店铺',
                    value:"sellerId",
                    minWidth:110
                },
                {
                    label:'添加时间',
                    value:"createTime",
                    minWidth:110
                },
            ],
            edits:[
                {
                    name: '修改模板',
                    icon: 'el-icon-edit',
                    show: scope => {
                        return scope.row.status !== -1
                    },
                    fn: (scope) => {
                       return this.editContent(scope.row)
                    }
                }
            ],

            selectIds:[],//表格勾选
        };
    },
    methods: {
        searchFunc(data){
            let {time,...info}=data;
            let [startTime,endTime] =time || [];
            return {startTime,endTime,...info}
        },
        //添加模板
        addCont(){
            this.$refs.layout.$dialog({
                title: '添加',
                width: '500px',
                params:{
                    url:"saleFareTempSave"
                },
                component: () => import('./dialog/templateOfFreightDialog'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        //修改模板
        editContent(v){
            //console.log(v);
            this.$refs.layout.$dialog({
                title: '修改',
                width: '500px',
                params:{
                    alter:true,
                    tempId:v.tempId	,
                    url:"saleFareTempUpdate"
                },
                component: () => import('./dialog/templateOfFreightDialog'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        //删除
        delete(){
                return this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$api['saleFareTempBatchRemove']({
                        tempIds:this.selectIds
                    })
                    .then(data => {
                        this.$refs.layout.getList()
                    })
                }).catch(() => {
                  
                });
           
        },
        selectChange(v){
            //console.log(v);
            this.selectIds=[];
            v.forEach(i=>{
                this.selectIds.push(i.tempId);
            })
        },
         //获取授权店铺,获取跟卖店铺的下拉选项
        getAuthorizationShop(){
            let opt=[] ;
            this.stateData.forEach(i=>{
                if ( i.platformName === "Amazon" ) {
                    //console.log(i);
                    let siteList = i.siteList;
                    siteList.forEach( k => {
                        k.sellerList.forEach( h => {
                            opt.push({
                                label: h.sellerId ,
                                value: h.sellerId
                            })
                        })
                    })
                }
            });
            //console.log(opt);
            delete this.searchFields[1].options;
            this.$set(this.searchFields[1],'options',opt)
        },
    },
    created() {
        this.$nextTick(function(){
             this.$refs.layout.getList()
        })
    },
    computed:{
       stateData(){
           return this.$store.state.common.stateData
       }
    },
    watch:{
        stateData:{
            handler(){
                if (this.stateData) {
                    //console.log(this.stateData);
                    this.getAuthorizationShop()
                };
            },
            immediate:true,
       },
    }
};
</script>

<style scoped lang="less">

</style>

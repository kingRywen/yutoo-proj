<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            @searchTrueData='searchTrueData'
            :columns="columns"
            :outSearchData='outSearchData'
            :treeTable="treeTable"
            @selectChange='selectChange'
            ref="layout"
            url="taskClaimCostList"
            >  
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from "Utils/tools";
export default {
    data() {
        let vm=this;
        return {
            treeTable:false,
            //外部参数
                outerParams: {
                    platformId:null,
                    siteId: null,
                    sellerId: null
                },
                outSearchData:{
                    claimType:null
                },
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "ASIN/SKU",
                        name: "asin",
                         labelWidth:'68px',
                        type: "input",
                        placeholder:'请输入ASIN / SKU'
                    },
                    {
                        label: "订单号",
                        name: "orderId",
                        type: "input",
                        placeholder:'请输入订单号',
                    },
                    {
                        label: "回复状态",
                        name: "status",
                        type: "select",
                        multi:true,
                        placeholder:'请选择回复状态',
                        options:[
                            { label: "待申请",value: 0 },
                            { label: "申请中",value: 1 },
                            { label: "未回复",value: 2 },
                            { label: "已回复",value: 3 },     
                        ]
                    },
                    {
                        label: "索赔状态",
                        name: "claimStatus",
                        type: "select",
                        // multi:true,
                        placeholder:'请选择索赔状态',
                        options:[
                            { label: "处理中",value: 0 },
                            { label: "已处理",value: 1 },
                            { label: "未处理",value: 2},   
                        ]
                    },
                     {
                        label: '索赔类型',
                        name: "claimType",
                        type: "select",
                        placeholder:'请选择索赔类型',
                        options:[
                            { label: "FBA配送费不对",value: 0 },
                            { label: "佣金不对",value: 1 },
                            { label: "仓储费不对",value: 2},   
                        ]
                    }
                    
                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        name: "导出",
						showLoading:true,
                        fn: () =>{
                           return this.exportBtn()
                        }
                    }
        
                ],
             //columns表格
                columns:[
                    {
                        label: "预警时间",
                        value: "warnTime",
                        minWidth: 150
                    },
                    // {
                    //     label: "产品ASIN / SKU",
                    //     value: "asin",
                    //     toggle:['asin','sku'],
                    //     align:'left',
                    //     showLabel:true,
                    //     width:"200px",
                    //     render(h,scope,a,b){
                    //         return(
                    //             <a href={scope.row.productUrl} style='color:rgb(16, 142, 233)' target='_blink'>{b}</a>
                    //         )
                    //     }
                    //     //expand: true
                    // },
                    {
                        label: "SKU",
                        value: "sku",
                        minWidth: 200,
                        align:'left',
                    },
                    {
                        label: "产品ASIN",
                        value: "asin",
                        minWidth: 200,
                        render(h,scope,a,b){
                            return(
                                <a href={scope.row.productUrl} style='color:rgb(16, 142, 233)' target='_blink'>{scope.row.asin}</a>
                            )
                        }
                    },
                    {
                        label: '主图',
                        value: 'imageUrl',
                        img:true,
                        style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 120 //鼠标hover图片高，宽度自动
                    },
                    {
                        label: "索赔类型",
                        value: "claimType",
                        minWidth: 150,
                        enum:{
                            0:"FBA配送费不对",
                            1:"佣金不对",
                            2:"仓储费不对",
                        }
                    },
                    {
                        label: "关联订单号",
                        value: "orderIds",
                        sortable:'custom',
                        minWidth: 150,
                        render(h,scope){
                            let {orderIds}=scope.row;
                            let div=''
                            let span='';
                            if(orderIds){
                                orderIds.forEach( (i,index) =>{
                                    // if(index!==0){
                                    //     span+=' , '
                                    // };
                                    if( index!==0  && (index+1)%3===0 ){
                                        span += i +'<br /> '
                                    }else{
                                        if( index < (orderIds.length-1) ){
                                            span += i +' , '
                                        }else{
                                             span += i
                                        }
                                        
                                    } ;                        
                                });
                                if(orderIds.length>60){
                                    div = (
                                        <el-tooltip open-delay={300}  effect="light" placement="top" content='点击查看'>
                                            <el-button type='text' onClick={()=>vm.lookIds(orderIds)} style='color: rgb(16, 142, 233);'>{orderIds.length}</el-button>
                                        </el-tooltip>
                                    )
                                }else{
                                    div = ( 
                                        <el-tooltip open-delay={300}  effect="light" placement="top">
                                            <div slot="content" domPropsInnerHTML={span}></div>
                                            <span class="fix__row_1" style='color: rgb(16, 142, 233);'>{orderIds.length}</span>
                                        </el-tooltip>)
                                }
                            }else{
                                div = ('-')
                            };

                            return(
                               <div>{div}</div>
                            )
                        }
                    },
                    // {
                    //     label: "金额",
                    //     value: "orderTotal",
                    //     minWidth: 150,
                    //     sortable:'custom',
                    // },
                    {
                        label: "应赔金额",
                        value: "costReceivable",
                        minWidth: 150,
                        sortable:'custom',
                    },
                    {
                        label: "实赔金额",
                        value: "costActual",
                        minWidth: 150,
                        sortable:'custom',
                    },
                    {
                        label: "回复状态",
                        value: "status",
                        minWidth: 120,
                        enum:{
                            0:'待申请',
                            1:'申请中',
                            2:'未回复',
                            3:'已回复',
                        }
                    },
                    {
                        label: "赔偿编号",
                        value: "taskClaimAsinRts",
                        minWidth: 150,
                        render(h,scope){
                            let span;
                            if(scope.row.taskClaimAsinRts){
                                span=(<span>{scope.row.taskClaimAsinRts.length}</span>)
                            }else{
                                span=(<span>-</span>)
                            };
                            return <el-button type='text' onClick={() =>{
                              vm.$refs.layout.$dialog({
                                title: "索赔列表",
                                size:'medium',
                                params: {
                                    tableList:scope.row.taskClaimAsinRts
                                },
                                component: () => import("../common/compensationNumbersDialog.vue"),
                                //okBtnText: "确认",
                                //cancelBtnText: "取消"
                            });
                        
                            }}>{span}</el-button>
                        }
                        
                    },
                    {
                        label: "申请时间",
                        value: "applyTime",
                        minWidth: 150,
                    },
                    {
                        label: "回复时间",
                        value: "replyTime",
                        minWidth: 150,
                    },
                    
                ],
            //表格操作按钮
                edits: [
                    // {
                    //     name: "查看订单详情",
                    //     icon: "el-icon-search",
                    //     show: scope => {
                    //         //console.log(scope);
                    //         return true//scope.row.status===2;
                    //     },
                    //     fn: (scope) => {
                    //         return this.lookOrderDatsils(scope.row)
                    //     }
                    // },
                    {
                        name: "查看回复内容",
                        icon: "el-icon-message",
                        show: scope => {
                            //console.log(scope);
                            return   scope.row.status===3;
                        },
                        fn: (scope) => {
                            return this.lookReplayDatails(scope.row)
                        }
                    },
                    {
                        name: "发送申请",
                        icon: "el-icon-upload",
                        show: scope => {
                            //console.log(scope);
                            return scope.row.status!==1 && scope.row.status!==2;
                        },
                        fn: (scope) => {
                            return this.sendApplyFor(scope.row)
                        }
                    },

                ],

            selectIds:[],//表格勾选

            searchDatas:"",//搜索的所有的数据
        };
    },
    methods: {
        lookIds(v){
            this.$refs.layout.$dialog({
                title: "关联订单号",
                width:'670px',
                params: {
                    datas:v
                },
                component: () => import("./lookIdsDialog"),
                //okBtnText: "确认",
                //cancelBtnText: "取消"
            });
        },
        searchTrueData(v){
            this.searchDatas=v;
        },
        //导出
            exportBtn(){
                 //console.log(this.searchDatas);
                 
                let params=JSON.parse(JSON.stringify(this.searchDatas));
                if(this.selectIds.length) params.taskIds=this.selectIds;
                return this.$api['taskClaimCostExportData'](params)
                .then(data => {
                    downloadFile(data,'费用不对列表')
                })
            },
        //表格勾选改变
            selectChange(v){
                console.log(v);
                this.selectIds=[];
                v.forEach(i=>{
                    this.selectIds.push(i.taskId);
                })
            },
        //查看邮件回复详情
            lookReplayDatails(v){
                 this.$refs.layout.$dialog({
                    title: "邮件内容",
                    //size:'medium',
                    width:'1000px',
                    params: {
                        taskId:v.taskId
                    },
                    component: () => import("../common/lookreplyContentDialog.vue"),
                    //okBtnText: "确认",
                    //cancelBtnText: "取消"
                })
            },
        //发送申请
            sendApplyFor(v){
                 this.$refs.layout.$dialog({
                    title: "索赔",
                    size:'large',
                    //width:'1000px',
                    params: {
                        taskId:v.taskId,
                        templateType:2,
                        Costiswrong:true ,//是费用不对
                    },
                    component: () => import("../common/sendApplicationDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                })
            },
        //查看订单详情
            // lookOrderDatsils(v){
            //     this.$refs.layout.$dialog({
            //         title: "订单详情",
            //         size:'medium',
            //         //width:'1000px',
            //         params: {
            //             taskId:v.taskId,
            //         },
            //         component: () => import("../common/lookOrderDatsilsDialog.vue"),
            //         //okBtnText: "确认",
            //         //cancelBtnText: "取消"
            //     })
            // },

        
    },
     created() {
         if( this.$route.query.name){
            let name = this.$route.query.name;
            if (name === 'FBA配送费不对') {
                this.$set(this.outSearchData,'claimType',0)
            }else if (name === '佣金不对') {
                this.$set(this.outSearchData,'claimType',1)
            }else if ( name === '仓储费不对') {
                this.$set(this.outSearchData,'claimType',2)
            }
         }
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

<style scoped lang="scss">

</style>

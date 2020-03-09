<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            :treeTable="treeTable"
            @selectChange='selectChange'
            ref="layout"
            url="taskClaimDamageList"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
        <a href="" ref='link'></a>
    </div>
</template>

<script>
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
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "ASIN",
                        name: "asin",
                         labelWidth:'42px',
                        type: "input",
                        placeholder:'请输入ASIN'
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
                        placeholder:'请选择索赔状态',
                        options:[
                            { label: "处理中",value: 0 },
                            { label: "已处理",value: 1 },
                            { label: "未处理",value: 2},   
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
                     {
                        value: "imageUrl", //table需要渲染的值
                        label: "主图", //表头
                        // width: "60", //当前行宽度
                        img: true, //如图片传
                        style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 150 //鼠标hover图片高，宽度自动
                    },
                     {
                        label: "ASIN",
                        value: "asin",
                        minWidth: 150,
                        render(h,scope){
                            return(
                                <a href={scope.row.productUrl} style={{color:"#108ee9"}}>{scope.row.asin}</a>
                            )
                        }
                    },
                    {
                        label: "应有产品数量",
                        value: "quantityShipped",
                        minWidth: 150,
                        sortable:'custom',
                    },
                    {
                        label: "实际库存数量",
                        value: "quantityReceived",
                        minWidth: 150,
                        sortable:'custom',
                    },
                    {
                        label: "应赔数量",
                        value: "quantityReceivable",
                        minWidth: 150,
                        sortable:'custom',
                    },
                    {
                        label: "实赔数量",
                        value: "quantityActual",
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
                    {
                        name: "查看回复内容",
                        icon: "el-icon-message",
                        show: scope => {
                            //console.log(scope);
                            return  scope.row.status===3;
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
        };
    },
    methods: {

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
                        templateType:1,
                    },
                    component: () => import("../common/sendApplicationDialog.vue"),
                    okBtnText: "确认",
                    cancelBtnText: "取消"
                })
            },
        //导出
            exportBtn(){
                let data={
                    siteId: this.outerParams.siteId,
                    sellerId: this.outerParams.sellerId,
                    platformId:this.outerParams.platformId,
                };
                if(this.selectIds.length>0){
                    data.taskIds=this.selectIds
                };
                return this.$api['taskClaimDamageExportData'](
                    data
                )
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let a = this.$refs.link;
                    a.href = url;
                    a.setAttribute("download", "亚马逊损坏库存，未赔偿.xlsx");
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(err=>{

                })
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

<style scoped lang="scss">

</style>

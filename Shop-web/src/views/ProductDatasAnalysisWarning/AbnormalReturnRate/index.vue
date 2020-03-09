<template>
    <div>
         <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
             @searchTrueData='searchTrueData'
            @selectChange='selectChange' 
            :treeTable="treeTable"
            :treeTableOtions="treeTableOtions"
            ref="layout"
            url="pdWarnRtRefundRateWarnList"
            >
         </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    data() {
        return {
            //table表格配置
            treeTable: true,
            treeTableOtions: {
                childs: "childList",
                expandFunc: row => {
                    return (row.childList && row.childList.length > 0);
                }
            },
            searchFields:[
                {
                    name: 'asin',
                    label: 'ASIN/SKU',
                    placeholder: '请输入ASIN / SKU',
                    labelWidth:'60px',
                    type:"input",
                    clearable:true,
                },
            ],
            outerParams:{
                siteId:"",
                sellerId:'',
            },
            edits:[

            ],
            editBtns:[
                 {
                    name: '导出',
                    showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    showLoading:true,
                    fn: ()=>{
                        return this.exportBtn();
                    }
                },
                 {
                    name: '退货率预警值配置',
                    //showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    //showLoading:true,
                    fn: ()=>{
                        this.$router.push('/cate/CateSetup')
                    }
                },
            ],
            columns:[
                // {
                //     label: "asin/sku",
                //     value: "asin",
                //     toggle:['asin','sku'],
                //     align:'left',
                //     width:"200px",
                //     expand: true,
                // },
                 {
                    label: "SKU",
                    value: "sku",
                    minWidth:"240px",
                    expand: true,
                    render(h,scope){
                        return(
                            <span>{scope.row.sku} <span style='color: #ff6c00'>{ scope.row.childList ? "("+scope.row.childList.length +")" : ''}</span></span>
                        )
                    }
                },
                {
                    label: "ASIN",
                    value: "asin",
                    minWidth:"200px",
                    url:"productUrl"
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
                    label: "退货率预警值",
                    value: "returnRate",
                    minWidth:"200px",
                    sortable:'custom',
                    render(h,scope){
                        return(
                            <span>{ (scope.row.returnRate || scope.row.returnRate===0 ) ? Math.ceil(scope.row.returnRate*10000)/100+'%' :"-"}</span>
                        )
                    }
                },
                {
                    label: "退货率",
                    value: "refundRate",
                    minWidth:"200px",
                     sortable:'custom',
                    render(h,scope){
                        return(
                            <span>{ (scope.row.refundRate || scope.row.refundRate===0 ) ? Math.ceil(scope.row.refundRate*10000)/100+'%' :"-"}</span>
                        )
                    }
                },
                {
                    label: "退货数",
                     sortable:'custom',
                    value: "returndCnt",
                    minWidth:"200px",
                },
                
            ],

            searchTrueDatas:null,
            slectIds:[],
        };
    },
    methods: {
        selectChange(v){
            this.slectIds=v.map(i=>{
                return i.productId
            })
        },
         searchTrueData(v){
            this.searchTrueDatas=v;
            //console.log(v);
        },
        exportBtn(){
            let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , productIds: this.slectIds.length ? this.slectIds : null }
            return this.$api[`pdWarnRtRefundRateWarnListExport`](params)
            .then(data => {
                downloadFile(data, '退货率异常' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
    },
    created() {
        //console.log(2);
        if (this.sellerId && this.siteId) {
            this.outerParams.siteId=this.siteId;
            this.outerParams.sellerId=this.sellerId;
            
        }
    },
    watch:{
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId=this.siteId;
                this.outerParams.sellerId=this.sellerId;''
            }
        },
    },
};
</script>

<style scoped lang="less">

</style>

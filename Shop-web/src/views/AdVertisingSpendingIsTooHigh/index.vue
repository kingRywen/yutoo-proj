<template>
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :columns="columns" 
            ref="layout" 
            :outSearchData='outSearchData'
             @searchTrueData='searchTrueData'
             :initialParmas='initialParmas'
            :searchFunc='searchFunc'
            @selectChange='selectChange' 
            url="financeListAdPropError">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
import dayjs from 'dayjs'
export default {
    data() {
        return {
            outerParams:{
                sellerId:"",
                siteId:"",
            },
            searchFields:[
                {
                    label: "预警时间",
                    name: "time",
                    type: "dateRange",
                    width:220,
                    labelWidth:'60px',
                    placeholder: "请选择"
                },
                {
                    label: "ASIN",
                    name: "asin",
                    type: "input",
                    width:220,
                    placeholder: "请输入ASIN/SKU"
                },
            ],
            outSearchData:{
                time:[ dayjs().format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
            },
            initialParmas:{
                time:[ dayjs().format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
            },
            edits:[
                // {
                //     name: '查看评价内容',
                //     icon: 'el-icon-edit-outline',
                //     show: scope => {
                //         return scope.row.status !== -1
                //     },
                //     fn: (scope) => {
                //        return this.lookEvaluateContent()
                //     }
                // }
            ],
            editBtns:[
                {
                    name: '导出',
                    showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    fn: ()=>{
                        return this.exportBtn();
                    }
                },
                //  {
                //     name: '查看评价内容',
                //     icon: 'el-icon-edit-outline',
                //     // show: scope => {
                //     //     return scope.row.status !== -1
                //     // },
                //     fn: () => {
                //        return this.lookEvaluateContent()
                //     }
                // }
            ],
            columns:[
                // {
                //     label: "预警时间",
                //     value: "taskName",
                //     minWidth: 150
                // },
                {
                    label: "SKU",
                    value: "sku",
                    minWidth:200,
                },
                {
                    label: "ASIN",
                    value: "asin",
                    minWidth:200,
                    render(h,scope){
                        return(
                            <a href={'https://www.amazon.com/dp/'+scope.row.asin} target='_blink' style='color: #108ee9;'>{scope.row.asin}</a>
                        )
                    }
                },
                {
                    label: '销售额',
                    value: 'amountSales',
                    minWidth: 150,
                    sortable:'custom'
                },
                {
                    label: "退款金额",
                    value: "amountRefund",
                    minWidth: 150,
                    sortable:'custom'
                },
                {
                    label: "广告费",
                    value: "amountAdvert",
                    minWidth: 150,
                    sortable:'custom'
                },
                {
                    label: "广告占未退款比率",
                    value: "advertProportion",
                    minWidth: 150,
                    sortable:'custom',
                    render(h,scope){
                        return(
                            <span>{ (scope.row.advertProportion===0 ||scope.row.advertProportion) ? Math.ceil(scope.row.advertProportion*10000)/100+'%':"-"  }</span>
                        )
                    }
                },
                
            ],

            selectIds:[],//表格勾选
            searchTrueDatas:"",//搜索的所有的数据

        };
    },
    methods: {
        searchFunc(data){
            let {time,...info}=data;
            let [startTime,endTime] =time || [];
            return {startTime,endTime,...info}
        },
        selectChange(v){
            this.selectIds=[];
            v.forEach(i=>{
                this.selectIds.push(i.sku);
            })
        },
        searchTrueData(v){
             this.searchTrueDatas=v;
        },
        // lookEvaluateContent(){
        //     this.$refs.layout.$dialog({
        //         title: '查看差评内容',
        //         width: '1000px',
        //         params:{},
        //         //component: () => import('./EvaluateContentDialog.vue'),
        //         // okBtnText: '确认',
        //         // cancelBtnText: '取消'
        //     })
        // },
        exportBtn(){
              let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,skus	: this.selectIds.length ? this.selectIds : null }
            return this.$api[`financeListAdPropErrorExport`](params)
            .then(data => {
                downloadFile(data, '广告花费占比过高' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
    },
    created() {
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

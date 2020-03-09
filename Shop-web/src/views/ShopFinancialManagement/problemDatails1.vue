<template>
    <div>
        <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :columns="columns" 
            :outSearchData='searchData'
            :initialParmas='initialParmas'
            :searchFunc='searchFunc'
            ref="layout" 
            @selectChange='selectChange' 
            :url="params.URL">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
         <a v-show="false" ref="exportExcel"></a>
    </div>
</template>

<script>
import { CONST_PORT_CONFIG } from "Config";
export default {
    props:['params'],
    data() {
        return {
            userSelect:"",
            downloadUrl:"",
            date:"",
            outerParams:{
                siteId:"",
                sellerId:"",
                startTime: this.params.startTime,
                endTime: this.params.endTime,
                sku: this.params.sku
            },
            initialParmas:{
                time:[this.params.startTime,this.params.endTime]
            },
            searchData:{
                time:[this.params.startTime,this.params.endTime]
            },
            searchFields:[
        
            ],
            edits:[

            ],
            editBtns:[
                {
                    name: "导出",
                    showLoading:true,
                    fn: () => {
                        return this.exportMethod();
                    }
                }
            ],
            columns:[
            ]
        };
    },
    methods: {
        selectChange(v){
            this.userSelect=v;
        },
        searchFunc(data){
            let {time,...info}=data;
            if(time){
                let [startTime,endTime] = time ;
                 return {startTime,endTime,...info}
            }else{
                  return {...info}
            };
        },
        exportMethod(){
            let arr = this.userSelect;
            let params;
            params = {
                siteId: this.siteId, //上线要改
                sellerId: this.sellerId, //上线要改
                startTime: this.params.startTime,
                endTime: this.params.endTime,
                sku: this.params.sku
            };
            let ids;
            if (arr.length) {
                if (this.params.pt == 1) {
                ids = arr.map(item => item.orderId);
                params.ids = ids;
                } else if (this.params.pt == 2) {
                ids = arr.map(item => item.orderId);
                params.ids = ids;
                } else if (this.params.pt == 3) {
                params.startQueryTime = this.date[0];
                params.endQueryTime = this.date[1];
                } else if (this.params.pt == 4) {
                ids = arr.map(item => item.orderId);
                params.ids = ids;
                } else if (this.params.pt == 5) {
                ids = arr.map(item => item.shipmentId);
                params.ids = ids;
                } else if (this.params.pt == 6) {
                ids = arr.map(item => item.id);
                params.ids = ids;
                }
            } else {
                if (this.params.pt == 3) {
                params.startQueryTime = this.date[0];
                params.endQueryTime = this.date[1];
                }
            }
            params = this.$.dealObjectValue(params);
            const { BASE_URL } = CONST_PORT_CONFIG;
            return this.$ajax({
                method: "post",
                url: BASE_URL + this.downloadUrl,
                data: params,
                responseType: "blob"
            })
                .then(data => {
                let url = window.URL.createObjectURL(new Blob([data]));
                let y = this.$refs.exportExcel;
                y.href = url;
                y.setAttribute("download", "列表.xlsx");
                y.click();
                window.URL.revokeObjectURL(url);
                })
                .catch(function(error) {
                // console.log(error);
                });
        },
    },
    created() {
        this.date = [this.$route.query.startTime, this.$route.query.endTime];
        console.log(this.params);
        //判断问题的类型,展示不同的搜索条件和表格列
        if (this.params.pt == 1) {
            this.searchFields=[
                {
                    label: "订单号:",
                    name: "orderId",
                    type: "input",
                    placeholder: "请输入订单号"

                }
            ];
            this.columns=[
                {
                    label: "订单号",
                    value: "orderId"
                },
                {
                    label: "应收金额",
                    value: "amountReceivable",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountReceivable || scope.row.amountReceivable===0) ? "$"+scope.row.amountReceivable : '-'}</span>
                        )
                    }
                },
                {
                    label: "实收金额",
                    value: "amountActual",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountActual || scope.row.amountActual===0) ? "$"+scope.row.amountActual : '-'}</span>
                        )
                    }
                },
                {
                    label: "差额",
                    value: "amountDifference",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountDifference || scope.row.amountDifference===0) ? "$"+scope.row.amountDifference : '-'}</span>
                        )
                    }
                },

            ];
            this.downloadUrl = "finance/fulfillmentErrorExport";
        } else if (this.params.pt == 2) {
            this.searchFields=[
                {
                    label: "订单号:",
                    name: "orderId",
                    type: "input",
                    placeholder: "请输入订单号"

                }
            ];
            this.columns=[
                {
                    label: "订单号",
                    value: "orderId"
                },
                {
                    label: "应收金额",
                    value: "amountReceivable",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountReceivable || scope.row.amountReceivable===0) ? "$"+scope.row.amountReceivable : '-'}</span>
                        )
                    }
                },
                {
                    label: "实收金额",
                    value: "amountActual",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountActual || scope.row.amountActual===0) ? "$"+scope.row.amountActual : '-'}</span>
                        )
                    }
                },
                {
                    label: "产品数量",
                    value: "quantity",
                    sortable:"custom",
                },
                {
                    label: "差额",
                    value: "amountDifference",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountDifference || scope.row.amountDifference===0) ? "$"+scope.row.amountDifference : '-'}</span>
                        )
                    }
                },

            ];
            this.downloadUrl = "finance/commissionErrorExport";
        } else if (this.params.pt == 3) {
            this.searchFields=[
                {
                    label: "订单号:",
                    name: "orderId",
                    type: "input",
                    placeholder: "请输入订单号"

                },
                {
                    label: "时间:",
                    name: "time",
                    type: "dateRange",
                    isShowUnlink:true,
                    placeholder: "请选择时间"

                }
            ];
            this.columns=[
                {
                    label: "预警时间",
                    value: "statTime",
                    width:'160px'
                },
                {
                    label: "0到90天",
                    merge:[
                        {
                            label: "库存",
                            value: "invAge0To90Days",
                            sortable:"custom"
                        },
                        {
                            label: "费用",
                            value: "amount0To90Days",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.amount0To90Days || scope.row.amount0To90Days===0) ? "$"+scope.row.amount0To90Days :"-"}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "91到180天",
                    merge:[
                        {
                            label: "库存",
                            value: "invAge91To180Days",
                            sortable:"custom"
                        },
                        {
                            label: "费用",
                            value: "amount91To180Days",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.amount91To180Days || scope.row.amount91To180Days===0) ? "$"+scope.row.amount91To180Days :"-"}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "181到270天",
                    merge:[
                        {
                            label: "库存",
                            value: "invAge181To270Days",
                            sortable:"custom"
                        },
                        {
                            label: "费用",
                            value: "amount181To270Days",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.amount181To270Days || scope.row.amount181To270Days===0) ? "$"+scope.row.amount181To270Days :"-"}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "271到365天",
                    merge:[
                        {
                            label: "库存",
                            value: "invAge271To365Days",
                            sortable:"custom"
                        },
                        {
                            label: "费用",
                            value: "amount271To365Days",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.amount271To365Days || scope.row.amount271To365Days===0) ? "$"+scope.row.amount271To365Days :"-"}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "365天~",
                    merge:[
                        {
                            label: "库存",
                            value: "invAge365PlusDays",
                            sortable:"custom"
                        },
                        {
                            label: "费用",
                            value: "amount365PlusDays",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.amount365PlusDays || scope.row.amount365PlusDays===0) ? "$"+scope.row.amount365PlusDays :"-"}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "应收金额",
                    value:"amountReceivable",
                    sortable:"custom",
                    width:"110px",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountReceivable || scope.row.amountReceivable===0) ? "$"+scope.row.amountReceivable :"-"}</span>
                        )
                    }
                },
                {
                    label: "实收金额",
                    value:"amountActual",
                    sortable:"custom",
                    width:"110px",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountActual || scope.row.amountActual===0) ? "$"+scope.row.amountActual :"-"}</span>
                        )
                    }
                },
                {
                    label: "差额合计",
                    value:"amountDifference",
                    sortable:"custom",
                    width:"110px",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.amountDifference || scope.row.amountDifference===0) ? "$"+scope.row.amountDifference :"-"}</span>
                        )
                    }
                },

            ];
            this.downloadUrl = "finance/storageErrorExport";
        } else if (this.params.pt == 4) {
            this.searchFields=[
                 {
                    label: "时间:",
                    name: "time",
                    type: "dateRange",
                    placeholder: "请选择时间",
                    isShowUnlink:true,

                }
            ];
            this.columns=[
                {
                    label: "订单号",
                    value: "orderId"
                },
                {
                    label: "应赔数量",
                    value: "quantityReceivable",
                    sortable:"custom",
                },
                {
                    label: "实赔数量",
                    value: "quantityActual",
                    sortable:"custom",
                },
                {
                    label: "退款数量",
                    value: "quantityReturn",
                    sortable:"custom",
                },
                {
                    label: "退货数量",
                    value: "quantityReturn",
                    sortable:"custom",
                },
                {
                    label: "差额",
                    value: "quantityDifference",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.quantityDifference || scope.row.quantityDifference===0) ? "$"+scope.row.quantityDifference : '-'}</span>
                        )
                    }
                },

            ];
            this.downloadUrl = "finance/refundErrorExport";
        } else if (this.params.pt == 5) {
            this.searchFields=[
                 {
                    label: "时间:",
                    name: "time",
                    type: "dateRange",
                    placeholder: "请选择时间",
                    isShowUnlink:true,

                }
            ];
            this.columns=[
                {
                    label: "时间",
                    value: "createTime"
                },
                {
                    label: "shipmentId",
                    value: "shipmentId",
                },
                {
                    label: "应赔数量",
                    value: "quantityReceivable",
                    sortable:"custom",
                },
                {
                    label: "实赔数量",
                    value: "quantityActual",
                    sortable:"custom",
                },
                {
                    label: "发货数量",
                    value: "quantityShipped",
                    sortable:"custom",
                },
                {
                    label: "入库数量",
                    value: "quantityReceived",
                    sortable:"custom",
                },
                {
                    label: "差额",
                    value: "quantityDifference",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.quantityDifference || scope.row.quantityDifference===0) ? "$"+scope.row.quantityDifference : '-'}</span>
                        )
                    }
                },

            ];
            this.downloadUrl = "finance/amazonLossErrorExport";
        } else if (this.params.pt == 6) {
            this.searchFields=[
                 {
                    label: "时间:",
                    name: "time",
                    type: "dateRange",
                    placeholder: "请选择时间",
                    isShowUnlink:true,

                }
            ];
            this.columns=[
                {
                    label: "预警时间",
                    value: "warnTime"
                },
                {
                    label: "应有库存数",
                    value: "quantityReceivable",
                    sortable:"custom",
                },
                {
                    label: "实际库存数",
                    value: "quantityActual",
                    sortable:"custom",
                },
                {
                    label: "应赔数量",
                    value: "quantityReceivableReturn",
                    sortable:"custom",
                },
                {
                    label: "实赔数量",
                    value: "quantityActualReturn",
                    sortable:"custom",
                },
                {
                    label: "差额",
                    value: "quantityDifference",
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.quantityDifference || scope.row.quantityDifference===0) ? "$"+scope.row.quantityDifference : '-'}</span>
                        )
                    }
                },

            ];
            this.downloadUrl = "finance/amazonErrorExport";
        };

        let problemTypes = this.params.problemType;
        if (problemTypes != "all") {
             problemTypes = [this.params.problemType];
        } else {
            problemTypes = [1, 2, 3, 4, 5, 6];
        };
        this.outerParams.problemTypes=problemTypes;
        if(this.siteId && this.sellerId){
            this.outerParams.siteId=this.siteId;
            this.outerParams.sellerId=this.sellerId;
        };
    },
    watch: {
        sellerData() {
            this.outerParams.siteId=this.siteId;
            this.outerParams.sellerId=this.sellerId;
        }
    },

};
</script>

<style scoped lang="less">

</style>

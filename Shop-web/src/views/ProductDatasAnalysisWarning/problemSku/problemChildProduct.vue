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
            url="pdWarnRtListByWarn"
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
                    width:"230px",
                    align:'left',
                    expand: true,
                    render(h,scope){
                        let length = ( scope.row.childList ? "("+ scope.row.childList.length +')': '' );
                        var styles = {
                            'text-overflow': 'ellipsis',
                            'overflow': 'hidden',
                            'white-space': 'nowrap',
                            'display':'inline-block',
                            'max-width':'150px',
                            'vertical-align': 'top',
                            
                        }
                        return(
                           <span style='width:180px;display:inline-block;'>
                                <el-tooltip class="item" effect="light" content={scope.row.sku} placement="top-start">
                                    <span style={styles}>
                                        { scope.row.sku}                                       
                                    </span>
                                </el-tooltip>
                                <span style='vertical-align: top;color:red'>{length}</span>
                           </span>
                             
                        )
                    }
                },
                {
                    label: "ASIN",
                    value: "asin",
                    width:"200px",
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
                    label: '订单数',
                    value: 'orderCnt',
                    render(h,scope){
                        return(
                            <div>
                                {
                                    scope.row.orderType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-down' style='color: rgb(16, 142, 233);font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:4px;'>{ ( scope.row.orderCnt || scope.row.orderCnt===0 ) ? scope.row.orderCnt :"-"}</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                },
                {
                    label: '访客数',
                    value: 'sessions',
                    render(h,scope){
                        return(
                            <div>
                                {
                                    scope.row.sessionsType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-down' style='color: rgb(16, 142, 233);font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:4px;'>{ ( scope.row.sessions || scope.row.sessions===0 ) ? scope.row.sessions :"-"}</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                },
                {
                    label: "转化率",
                    value: "conversionRates",
                    //sortable:"custom",
                    render(h,scope){
                        return(
                             <div>
                                {
                                    scope.row.cvrType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-down' style='color: rgb(16, 142, 233);font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:4px;'>{ (scope.row.conversionRates || scope.row.conversionRates===0 ) ? Math.ceil(scope.row.conversionRates*10000)/100+'%' : "-" }</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                },
                 {
                    label: "退货率",
                    value: "refundRate",
                    // sortable:"custom",
                     render(h,scope){
                        return(
                             <div>
                                {
                                    scope.row.returndRateType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-up' style='color:#ff3040;font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:14px;'>{ (scope.row.refundRate || scope.row.refundRate===0 ) ? Math.ceil(scope.row.refundRate*10000)/100+'%' : "-" }</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                },
                {
                    label: '退货数',
                    value: 'returndCnt',
                     render(h,scope){
                        return(
                            <div>
                                {
                                    scope.row.returndType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-up' style='color:#ff3040;font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:14px;'>{ ( scope.row.returndCnt || scope.row.returndCnt===0 ) ? scope.row.returndCnt :"-"}</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }

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
            return this.$api[`pdWarnRtListByWarnExport`](params)
            .then(data => {
                downloadFile(data, '问题子产品' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
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

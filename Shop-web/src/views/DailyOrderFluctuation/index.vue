<template>
    <!-- 日订单波动超过XXX -->
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :columns="columns" 
            ref="layout" 
            :initialParmas='initialParmas'
            :outSearchData='outSearchData'
             @searchTrueData='searchTrueData'
            :searchFunc='searchFunc'
            @selectChange='selectChange' 
            url="homeOrderRangeList">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
import dayjs from 'dayjs';
export default {
    data() {
        return {
            outerParams:{
                sellerId:"",
                siteId:"",
            },
            outSearchData:{
                time:[ dayjs(Date.now()-15*3600*1000).format('YYYY-MM-DD'), dayjs(Date.now()-15*3600*1000).format('YYYY-MM-DD')]
            },
            initialParmas:{
                time:[ dayjs(Date.now()-15*3600*1000).format('YYYY-MM-DD'), dayjs(Date.now()-15*3600*1000).format('YYYY-MM-DD')]
            },
            searchFields:[
                 {
                    label: "ASIN/SKU",
                    name: "searchText",
                    type: "input",
                    placeholder: "请输入ASIN / SKU",
                    labelWidth:"65px"
                },
                {
                    label: "预警时间",
                    name: "time",
                    type: "dateRange",
                    placeholder: "请选择",
                    pickerOptions: {
                        disabledDate(time) {
                            return time.getTime() > ( Date.now()-15*3600*1000);
                        },
                    }
                },
                {
                    label: "方向",
                    name: "flag",
                    type: "select",
                    placeholder: "请选择方向",
                    options:[
                        {label:"上涨",value:1},
                        {label:"下跌",value:0},
                    ]
                },
            ],
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
                {
                    label: "预警时间",
                    value: "wornTime",
                    minWidth: 150
                },
                // {
                //     label: "asin/sku",
                //     value: "asin",
                //     toggle:['asin','sku'],
                //     align:'left',
                //     width:"200px",
                // },
                 {
                    label: "SKU",
                    value: "sku",
                    width:"230px",
                    align:'left',
                },
                {
                    label: "ASIN",
                    value: "asin",
                    width:"200px", 
                    url:'productUrl'
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
                    label: "昨日销量",
                    value: "upperSalesCnt",
                    minWidth: 150,
                    sortable:"custom"
                },
                 {
                    label: "今日销量",
                    value: "salesCnt",
                    minWidth: 150,
                    sortable:"custom"
                },
                 {
                    label: "方向",
                    value: "flag",
                    minWidth: 150,
                    enum:{
                        0:"下跌",
                        1:"上涨"
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
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        selectChange(v){
            this.selectIds=[];
            v.forEach(i=>{
                this.selectIds.push({
                    wornTime: i.wornTime,
                    asin: i.asin,
                    sku: i.sku
                });
            })
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
             let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,wornList: this.selectIds.length ? this.selectIds : null }
            return this.$api[`HomeOrderReangeExport`](params)
            .then(data => {
                downloadFile(data, '日订单波动' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
        //日订单波动-获取波动
        getNum(){
            this.$api['homeOrderRangeConfigInfo']({
                platformId:this.platformId,
                siteId:this.siteId,
                sellerId:this.sellerId,
            })
            .then(data => {
                //console.log(data.orderRange);
                this.$router.replace({
                    path:"/DailyOrderFluctuation",
                    query:{
                        name : `超过${ parseInt(data.orderRange*10000)/100}%`
                    }
                })
            }).catch(() => {})
        }
    },
    created() {
        this.outerParams.platformId = this.platformId;
        if (this.sellerId && this.siteId) {
            this.outerParams.siteId = this.siteId;
            this.outerParams.sellerId = this.sellerId;
            this.getNum()
        }
    },
    watch: {
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId = this.siteId;
                this.outerParams.sellerId = this.sellerId;
                  this.getNum()
            }
        }
    }
};
</script>

<style scoped lang="less">

</style>

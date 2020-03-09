<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            @searchTrueData='searchTrueData'
            :treeTable="treeTable"
            :outSearchData='searchData'
            :searchFunc='searchFunc'
            :initialParmas='initialParmas'
            @selectChange='selectChange'
            ref="layout"
            url="orderTargetListDetail"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    props:{
        taskId:{
            type:Number,
            default:-1
        }
    },
    data() {
        return {
            treeTable:false,

            outerParams:{
                sellerId:null,
                siteId:null,
                taskId:null,
            },
            searchData:{
                period:1,
            },
            initialParmas:{
                 period:1,
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
                    fn: ()=>{
                        this.exportBtn();
                    }
                },
            ],
            searchFields:[
                {
                    label: "时间",
                    name: "time",
                    type: "dateRange",
                    width:'250px',
                    labelWidth:'38px',
                    placeholder: "请选择",
                    pickerOptions: {
                        disabledDate(time) {
                            return time.getTime() > (Date.now()-15*3600*1000);
                        }
                    }
                },
                {
                    label: "统计周期",
                    name: "period",
                    type: "select",
                    placeholder: "请选择",
                    required:true,
                    clearable:false,
                    options:[
                        {label:'日',value:1},
                        {label:'周',value:7},
                        {label:'月',value:30},
                    ]
                },
            ],
            columns:[
                {
                    label: "时间",
                    value: "statTime",
                    minWidth: 150,
                    sortable:"custom",
                },
                {
                    label: "总访客数",
                    merge:[
                        {
                            label: "目标",
                            value: "sessionsTarget",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "实际",
                            value: "sessions",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
                {
                    label: "广告访客数",
                    merge:[
                        {
                            label: "目标",
                            value: "adSessionsTarget",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "实际",
                            value: "adSessions",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
                {
                    label: "自然访客数",
                    merge:[
                        {
                            label: "目标",
                            value: "normalSessionsTarget",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "实际",
                            value: "normalSessions",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
                {
                    label: "总订单数",
                    merge:[
                        {
                            label: "目标",
                            value: "orderCntTarget",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "实际",
                            value: "orderCnt",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
                {
                    label: "广告订单数",
                    merge:[
                        {
                            label: "目标",
                            value: "adOrderCntTarget",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "实际",
                            value: "adOrderCnt",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
                {
                    label: "自然订单数",
                    merge:[
                        {
                            label: "目标",
                            value: "normalOrderCntTarget",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "实际",
                            value: "normalOrderCnt",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
                {
                    label: "自然转化率",
                    merge:[
                        {
                            label: "目标",
                            value: "normalConversionRateTarget",
                            sortable:"custom",
                            minWidth:'100px',
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.normalConversionRateTarget || scope.row.normalConversionRateTarget===0) ? Math.ceil(scope.row.normalConversionRateTarget*10000)/100+'%' : '-'}</span>
                                )
                            }
                        },
                        {
                            label: "实际",
                            value: "normalConversionRate",
                            minWidth:'100px',
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.normalConversionRate || scope.row.normalConversionRate===0) ? Math.ceil(scope.row.normalConversionRate*10000)/100+'%' : '-'}</span>
                                )
                            }
                        },
                    ]
                },
                 {
                    label: "广告转化率",
                    merge:[
                        {
                            label: "目标",
                            value: "adConversionRateTarget",
                            sortable:"custom",
                            minWidth:'100px',
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.adConversionRateTarget || scope.row.adConversionRateTarget===0) ? Math.ceil(scope.row.adConversionRateTarget*10000)/100+'%' : '-'}</span>
                                )
                            }
                        },
                        {
                            label: "实际",
                            value: "normalConversionRate",
                            minWidth:'100px',
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.adConversionRate || scope.row.adConversionRate===0) ? Math.ceil(scope.row.adConversionRate*10000)/100+'%' : '-'}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "搜索量",
                    merge:[
                        {
                            label: "合计",
                            value: "views",
                            sortable:"custom",
                            minWidth:'100px'
                        },
                        {
                            label: "自然",
                            value: "normalViews",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                        {
                            label: "广告",
                            value: "adViews",
                            minWidth:'100px',
                            sortable:"custom",
                        },
                    ]
                },
            ],

            searchTrueDatas:null,
        };
    },
    methods: {
        selectChange(){

        },
        searchTrueData(v){
            this.searchTrueDatas=v;
            //console.log(this.searchTrueDatas);
        },
        searchFunc(data){
            let {time,...info}=data;
            let [startTime,endTime] =time || [];
            return {startTime,endTime,...info}
        },
        exportBtn(){
            // if(this.$refs.layout.selection.length){
            //     let buyerIds=[];
            //     this.$refs.layout.selection.forEach(i=>{
            //     // console.log(i);
            //         buyerIds.push(i.buyerId)
            //     });
            //     this.searchTrueDatas.buyerIds=buyerIds;
            // }else{
            //     this.searchTrueDatas.buyerIds=null;
            // };
            let params = {...this.searchTrueDatas }
            this.$api['orderTargetDetailExport'](params)
            .then(data => {
                downloadFile(data, '问题列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
    },
    created() {
        if(this.sellerId && this.siteId){
            this.outerParams.sellerId=this.sellerId;
            this.outerParams.siteId=this.siteId;
        }
    },
    watch:{
        taskId:{
            immediate: true,
            handler(newName, oldName){
                this.outerParams.taskId=this.taskId;
                console.log(this.taskId);
            }
        },
        sellerData(){
            if(this.sellerId && this.siteId){
                this.outerParams.sellerId=this.sellerId;
                this.outerParams.siteId=this.siteId;
            }
        }
    }
};
</script>

<style scoped lang="less">

</style>

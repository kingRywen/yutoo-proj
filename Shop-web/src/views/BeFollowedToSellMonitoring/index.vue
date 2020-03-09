<template>
    <!-- 被跟卖监控 -->
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :outSearchData='outSearchData'
            :initialParmas='initialParmas'
            :columns="columns" 
            ref="layout" 
            @searchTrueData='searchTrueData'
            :searchFunc='searchFunc'
            @selectChange='selectChange' 
            url="homeOsProductList">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
import dayjs from "dayjs"
export default {
    data() {
        return {
            outerParams:{
                sellerId:"",
                siteId:"",
            },
            searchFields:[
                 {
                    label: "ASIN/SKU",
                    name: "searchText",
                    type: "input",
                    placeholder: "请输入ASIN / SKU",
                },
                {
                    label: "预警时间",
                    name: "time",
                    type: "dateRange",
                    isShowUnlink:true,
                    placeholder: "请选择",
                    pickerOptions: {
                        disabledDate(time) {
                            return  time.getTime() < (Date.now()-366*24*3600*1000) || time.getTime() > Date.now()
                        }
                    }
                },
            ],
            outSearchData:{
                time:[ dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
            },
            initialParmas:{
                time:[ dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]
            },
            edits:[
                {
                    name: '查看跟卖卖家详情',
                    icon: 'el-icon-search',
                    show: scope => {
                        return scope.row.status !== -1
                    },
                    fn: (scope) => {
                       return this.lookSellersDatails(scope.row)
                    }
                }
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
                //  {
                //     name: '查看评价内容',
                //     icon: 'el-icon-edit-outline',
                //     // show: scope => {
                //     //     return scope.row.status !== -1
                //     // },
                //     fn: () => {
                //        return this.lookSellersDatails()
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
                    value: "parentSku",
                    width:"200px"
                },
                {
                    label: "ASIN",
                    value: "parentAsin",
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
                    label: "标题",
                    value: "title",
                    minWidth: 150,
                    render(h,scope){
                        let { title } = scope.row
                        // return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
                        return title ? (
                            <el-tooltip open-delay={300} content={title} effect="light" >
                            <span class="fix__row_1">{title}</span>
                            </el-tooltip>
                        ) : (
                            <span>-</span>
                        )
                    }
                },
                 {
                    label: "发货方式",
                    value: "fbpFlag",
                    minWidth: 150,
                    enum:{
                        0:"FBM",
                        1:"FBA",
                        2:"FBM+FBA",
                    }
                },
                 {
                    label: "价格",
                    value: "price",
                    minWidth: 150,
                    sortable:'custom'
                },
                 {
                    label: "跟卖卖家数",
                    value: "sellerCnt",
                    minWidth: 150,
                    sortable:'custom'
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
            console.log(v);
            this.selectIds=[];
            v.forEach(i=>{
                this.selectIds.push({
                    wornTime:i.wornTime,
                    parentAsin:i.parentAsin
                });
            })
        },
        lookSellersDatails(v){
            console.log(v);
            this.$refs.layout.$dialog({
                title: '跟卖卖家列表',
                width: '1200px',
                params:{
                    wornTime: v.wornTime,
                    parentAsin: v.parentAsin,
                },
                component: () => import('./WithTheSellerListDialog.vue'),
                // okBtnText: '确认',
                // cancelBtnText: '取消'
            })
        },
        exportBtn(){
             let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,wornList: this.selectIds.length ? this.selectIds : null }
            this.$api[`homeOsProductExport`](params)
            .then(data => {
                downloadFile(data, '被跟卖监控' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
    },
    created() {
        this.outerParams.platformId=this.platformId;
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

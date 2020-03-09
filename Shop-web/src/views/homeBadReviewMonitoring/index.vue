<template>
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :columns="columns" 
            @searchTrueData='searchTrueData'
            ref="layout" 
            :searchFunc='searchFunc'
            @selectChange='selectChange' 
            url="homeBrProductList">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
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
                    placeholder: "请输入ASIN / SKU"
                },
                // {
                //     label: "预警时间",
                //     name: "time",
                //     width:230,
                //     type: "dateRange",
                //     placeholder: "请选择"
                // },

            ],
            edits:[
                {
                    name: '查看评价内容',
                    icon: 'el-icon-search',
                    show: scope => {
                        return scope.row.status !== -1
                    },
                    fn: (scope) => {
                       return this.lookEvaluateContent(scope.row)
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
                // {
                //     label: "ASIN/SKU",
                //     showLabel:true,
                //     value: "parentAsin",
                //     toggle:['parentAsin','parentSku'],
                //     align:'left',
                //     width:"200px",
                //     render(h,scope,a,b){
                //         return(
                //             <a href={scope.row.productUrl} target="_blink" style='color: rgb(16, 142, 233);'>{b}</a>
                //         )
                //     }
                // },
                {
                    label: "SKU",
                    value: "parentSku",
                    width:"200px",
                     align:'left',
                },
                {
                    label: "ASIN",
                    value: "asin",
                    width:"200px",
                    render(h,scope,a,b){
                        return(
                            <a href={scope.row.productUrl} target="_blink" style='color: rgb(16, 142, 233);'>{scope.row.parentAsin}</a>
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
                    label: "差评数量",
                    value: "badReviewCnt",
                    minWidth: 150,
                    sortable:"custom"
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
                this.selectIds.push(i.parentAsin);
            })
        },
        lookEvaluateContent(v){
            //console.log(v);
            this.$refs.layout.$dialog({
                title: '查看差评内容',
                width: '1000px',
                params:{
                    parentAsin:v.parentAsin
                },
                component: () => import('./EvaluateContentDialog.vue'),
                // okBtnText: '确认',
                // cancelBtnText: '取消'
            })
        },
        exportBtn(){
             let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , platformId:this.platformId ,parentAsins: this.selectIds.length ? this.selectIds : null }
            this.$api[`homeBrProductExport`](params)
            .then(data => {
                downloadFile(data, '首页出现差评' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
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

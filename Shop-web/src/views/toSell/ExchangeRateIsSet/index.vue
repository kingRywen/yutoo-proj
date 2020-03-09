<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :editBtns="editBtns"
            :columns="columns"
            @searchTrueData='searchTrueData'
            :isShowPag='false'
            :searchFields='searchFields'
            @selectChange='selectChange' 
            :treeTable="treeTable"
            ref="layout"
            url="imSaleExchangeRateList"
            >
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    data() {
        return {
            treeTable:false,
            outerParams:{

            },
            searchFields:[
                {
                    label: "",
                    name: "name",
                    type: "input",
                    placeholder: "请输入币种名称/代码",
                    labelWidth:'60px'
                },
            ],
            editBtns:[
                {
                    name: '编辑汇率',
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                        return this.editCurrency()
                    }   
                },
                {
                    name: '导出',
                    showLoading:true,
                   
                    fn: () => {
                        return this.exportBtn()
                    }
                },
            ],
            columns:[
                {
                    label: "币种中文名称",
                    value: "chineseName",
                    minWidth: 150
                },
                {
                    label: "币种代码",
                    value: "currency",
                    minWidth: 150
                },
                {
                    label: "币种符号",
                    value: "symbol",
                    minWidth: 150
                },
                {
                    label: "兑美元汇率",
                    value: "exchangeRate",
                    sortable:'custom',
                    minWidth: 150
                },
                {
                    label: "更新时间",
                    value: "updateTime",
                    minWidth: 150
                },

            ],
            searchTrueDatas:null,
            selectIds:[],//表格勾选

        };
    },
    methods: {
        selectChange(v){
            //console.log(v);
            this.selectIds = v.map(i=>{return i.currency})
        },
        //导出
        exportBtn(){
            let params = { currencies : this.selectIds.length ? this.selectIds :[]  }
            return  this.$api[`imSaleExchangeRateExport`](params)
            .then(data => {
                downloadFile(data, '汇率设置' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
        //表单搜索的真实数据
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        //编辑汇率
        editCurrency(){
            this.$refs.layout.$dialog({
                title: '编辑汇率',
                width: '500px',
                params:{
                   currencies:this.selectIds
                },
                component: () => import('./EditCurrencyDialog'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },

    },
    created() {
        this.$nextTick(function(){
            this.$refs.layout.getList()
        })
    },
};
</script>

<style scoped lang="less">

</style>

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
            :searchFunc="searchFunc"
            @selectChange='selectChange'
            ref="layout"
            url="selAttrProductDeclineAnalysis"
        >  
        </MainLayout>
        <a href="" ref='link'></a>
    </div>
</template>

<script>
export default {
    props:['cateId','cateFlag'],
    data() {
        let vm=this;
        return {
            treeTable:false,
            treeTableOtions:{},
            searchData: {},
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "是否剔除爆款",
                        name: "removePopularFlag",
                        type: "select",
                        placeholder:'请选择',
                        options:[
                            {label:'否',value:0},
                            {label:'是',value:1}
                        ],
                        labelWidth:'86px',
                    },
                    {
                        label: "只展示百分之几以上出现的属性",
                        name: "overProportion",
                        type: "number",
                        placeholder:'请直接输入百分之几',
                        labelWidth:'230px',
                    },
                    {
                        label: "时间范围",
                        name: "time",
                        type: "dateRange",
                        placeholder:'请选择',
                        width:260,
                    },
                ],
            //表格头部操作按钮
                editBtns:[
                    {
                        showLoading: true,
                        name: "导出",
                        fn: () =>{
                            return this.exportBtn()
                        }
                    }
        
                ],
            //columns表格
                 columns: [
                    {
                        label: "序号",
                        value: "index",
                        minWidth: 100,
                        render(h,scope){
                            let pageIndex=vm.$refs.layout.pageNo;
                            let pageSize=vm.$refs.layout.pageSize;
                            //console.log(h);
                            return(
                                <div>{(pageIndex-1)*pageSize+scope.$index+1}</div>
                            )
                        }
                    },
                    {
                        label: "属性值",
                        value: "attrValue",
                        minWidth: 150,
                        render(h,scope){
                            let {attrValue}=scope.row;
                            return attrValue ? (
                                <el-tooltip open-delay={300} content={attrValue} placement="top" effect="light">
                                    <span class="fix__row_1">{attrValue}</span>
                                </el-tooltip>
                                ) : (
                                <span>-</span>
                            )
                        }
                    },
                    {
                        label: "评价数",
                        value: "reviewCnt",
                        minWidth: 150,
                        sortable:'custom',
                    },
                    {
                        label: "占比",
                        value: "proportion",
                        minWidth: 150,
                        render(h,scope){
                            return(
                                <span>{Math.ceil(scope.row.proportion*10000)/100+'%'}</span>
                            )
                        },
                        sortable:'custom',
                    },
                 ],
            //外部参数
                outerParams: {
                    startTime: null,
                    endTime: null,
                    platformId:null,
                    siteId: null,
                    sellerId: null,
                    cateId:this.cateId,
                },
            //表格列表操作按钮
                edits: [
                ],

            slectIds:[],//选择的ID的数组

            searchDatas:"",//子组件传过来的当前的搜索条件
        };
    },
    methods: {
        //参数处理
            searchFunc(data) {
                let {time,status, ...info} = data;
                let overProportions = data.overProportion;
                delete info.overProportion;
                let [startTime, endTime] = time || [];
                let overProportion = overProportions/100 ;
                return {startTime,endTime, overProportion, ...info}
            },
        //勾选改变
            selectChange(v){
                 this.slectIds=[];
                v.forEach(i=>{
                    this.slectIds.push(i.attrValue)
                });
            },
        //导出
            exportBtn(){
                let datas={
                    ...this.searchDatas
                };
                if(this.slectIds.length){
                    datas.attrValues=this.slectIds
                };
                return this.$api['selAttrProductExportDeclineAttr'](datas)
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let a = this.$refs.link;
                    a.href = url;
                    a.setAttribute("download", "衰款属性分析.xlsx");
                    a.click();
                    window.URL.revokeObjectURL(url);
                }).catch(() => {})
            },
        //接受从子组件传过来的当期的搜索的参数
            searchTrueData(v){
                //console.log(v);
                this.searchDatas=v;
            }
    },
    created() {
        this.outerParams.platformId=this.platformId;
        if (this.sellerId && this.siteId) {
           this.outerParams.siteId=this.siteId;
           this.outerParams.sellerId=this.sellerId;
        };
        //  this.outerParams.cateId=this.cateId;
        //  console.log(this.cateId);
    },
    watch:{
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId=this.siteId;
                this.outerParams.sellerId=this.sellerId;
            }
        },
        cateId(){
            this.outerParams.cateId=this.cateId;
        }
    }
};
</script>

<style scoped lang="scss">

</style>

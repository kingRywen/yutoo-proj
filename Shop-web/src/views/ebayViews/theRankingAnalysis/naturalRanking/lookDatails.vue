<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            :treeTable="treeTable"
            :searchFunc="searchFunc"
            @selectChange='selectChange'
            ref="layout"
            url="ebTaskKrFqList"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
    </div>
</template>

<script>
export default {
    data() {
        return {
            treeTable:false,
            treeTableOtions:{},
            searchData: {},
            //筛选条件的搜索
                searchFields:[
                    {
                        label: "关键词",
                        name: "keyword",
                        type: "input",
                        placeholder:'关键词'
					},
					{
                        label: "监控状态",
                        name: "monitorFlag",
                        type: "select",
                        placeholder:'请选择监控状态',
                        options:[
                            { label: "关闭监控",value: 0 },
                            { label: "开启监控",value: 1 },
                        ]
					},
					{
                        label: "抓取状态",
                        name: "status",
                        type: "select",
                        placeholder:'请选择抓取状态',
                        options:[
                            { label: "抓取中",value: 1 },
                            { label: "抓取成功",value: 2 },
                            { label: "抓取失败",value: 3 },
                        ]
                    },
                    {
                        label: "数据类型",
                        name: "productType",
                        type: "select",
                        placeholder:'请选择数据类型',
                        options: [
                            {label: "全部",value: 0 },
                            {label: "拍卖",value: 1},
                            {label: "一口价",value: 2},
                        ]
                    },
                    {
                        label: "创建时间",
                        name: "time",
						type: "dateRange",
						width:300,
                        placeholder:'请选择'
                    },
				],
			//表格头部操作按钮
                editBtns:[
                    {
                        name: "导出",
                        fn: () =>{
                            this.exportBtn()
                        }
					},
				],
			//columns表格
                columns: [
                    {
                        label: "关键词",
                        value: "keyword",
                        minWidth: 150
                    },
					{
                        label: "产品类型",
                        value: "productType",
						minWidth: 150,
						enum:{
							0:'全部',
							1:'拍卖',
							2:'一口价',
						}
					},
					{
                        label: "抓取页数",
                        value: "searchPages",
                        minWidth: 150
					},
					{
                        label: "抓取状态",
                        value: "status",
						minWidth: 150,
						render(h,scope){
								return(
									scope.row.status===1?"抓取中":scope.row.status===2?"抓取成功":'抓取失败'
								)
							}
						},
					{
                        label: "监控状态",
                        value: "monitorFlag",
						minWidth: 150,
						enum:{
							0:'关闭监控',
							1:'开启监控'
						}
					},
					{
                        label: "监控频率",
                        value: "frequency",
						minWidth: 150,
						render(h,scope){
							return (
								<span>{scope.row.frequency+'分钟'}</span>
							)
						}
					},
					{
                        label: "创建时间",
                        value: "createTime",
                        minWidth: 150
					},{
                        label: "监控开始时间",
                        value: "monitorFrom",
                        minWidth: 150
					},
					{
                        label: "监控结束时间",
                        value: "monitorTo",
                        minWidth: 150
					},
				],
			//外部参数
                outerParams: {
                    siteId: null,
					sellerId: null,
					platformId:null,
					taskFlag:null
				},
			//表格列表操作按钮
                edits: [
                    {
                        name: "查看详情",
                        icon: "el-icon-search",
                        show: scope => {
                            //console.log(scope);
                            return scope.row.status===2;
                        },
                        fn: (scope) => {
                            return this.lookDatsils(scope.row)
                        }
					},
                ],
        };
    },
    methods: {
        //查看详情
            lookDatsils(){

            },
        //导出
            exportBtn(){

            },
    },
    created() {
        console.log(this.$route.query);
        if(this.$route.query.taskFlag){
            this.data='自然'
        }else{
            this.data='广告'
        }
    },
};
</script>

<style scoped lang="less">

</style>

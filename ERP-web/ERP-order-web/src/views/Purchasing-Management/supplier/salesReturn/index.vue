
<template>
    <!-- 供应商退货管理 -->
    <universal-layout
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :btnList="btnList"
        @clickBtn="clickBtn">
        <template slot="search">
            <search :searchList="searchList"></search>
        </template>
        <template slot="table">
            <yt-table :data="tableList" :columns="columns" :border="true">

                <el-table-column label="操作" width="100" align="center" slot="right">
                    <template slot-scope="scope">
                        <el-button type="text">审核</el-button>
                        <el-button type="text">取消</el-button>
                    </template>
                </el-table-column>
            </yt-table>
        </template>
    </universal-layout>
</template>

<script>
export default {
    data(){
        return {
            searchList:[
                {
                    label:'采购人员',
                    value:'Id1',
                    type:'select',
                    style:{
                        width:"100px"
                    },
                    children:[
                        {
                           label:'是',
                           value:'1',
                        },
                    ]
                },
                {
                    label:'状态',
                    value:'Id1',
                    type:'select',
                    style:{
                        width:"100px"
                    },
                    children:[
                        {
                           label:'是',
                           value:'1',
                        },
                    ]
                },

            ],
            btnList:[
                {name:"添加", value:'1'},
                {name:"批量操作", value:'2'},
                {name:"导出", value:'2'},
            ],
            tableList:[

            ],
            columns:[
                {
                    value: "",
                    label: "退货单号",
                    width:"60"
                },
                {
                    value: "",
                    label: "供应商",
                },
                {
                    value: "",
                    label: "仓库",
                },
                {
                    value: "",
                    label: "总数量",
                },
                {
                    value: "",
                    label: "总金额",
                },
                {
                    value: "",
                    label: "申请",
                },
                {
                    value: "",
                    label: "退回状态",
                },
            ]
        };
    },
    methods:{
        handleSizeChange(val){
            console.log(val)
        },
        handleCurrentChange(val){
            console.log(val)
        },
        //
        clickBtn(val){
            console.log(val)
        }
    }
}
</script>

<style lang="scss">


</style>

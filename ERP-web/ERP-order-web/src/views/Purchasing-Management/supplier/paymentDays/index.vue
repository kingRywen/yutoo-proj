
<template>
    <!-- 供应商账期管理 -->
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
                        <el-button type="text">修改</el-button>
                        <el-button type="text">查看</el-button>
                        <el-button type="text">删除</el-button>
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
                    label:'添加人',
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
                    label:'账期名称',
                    value:'Id1',
                    type:'input',
                },
                {
                    label:'添加时间',
                    value:'Id1',
                    type:'input',
                },
                {
                    label:'账期类型',
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
                {name:"批量删除", value:'2'},
            ],
            tableList:[

            ],
            columns:[
                {
                    value: "",
                    label: "编号",
                    width:"60"
                },
                {
                    value: "",
                    label: "账期名称",
                },
                {
                    value: "",
                    label: "账期类型",
                },
                {
                    value: "",
                    label: "状态",
                },
                {
                    value: "",
                    label: "描述",
                },
                {
                    value: "",
                    label: "添加时间",
                },
                {
                    value: "",
                    label: "添加人员",
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

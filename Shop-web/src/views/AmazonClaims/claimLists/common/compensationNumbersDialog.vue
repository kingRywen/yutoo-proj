<template>
    <div>
        <!-- 索赔编号列表 -->
        <yt-table
          border
          :selection="false"
          :data="tableList"
          :columns="columns"
        >
        </yt-table>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            columns:[
                {
                    label:'caseId',
                    value:"caseId",
                    minWidth:100
                },
                {
                    label:'主图',
                    value:"imageUrl",
                    minWidth:100,
                    img:true,
                    style: {
                            //图片宽高
                            width: 40,
                            height: 40
                    },
                    bulkyHeight: 150 //鼠标hover图片高，宽度自动

                    },
                {
                    label:'ASIN',
                    value:"ASIN",
                    minWidth:100,
                    render(h,scope){
                        return(
                            <a href={scope.row.productUrl} style={{color:"#108ee9"}} target='_blink'>{scope.row.asin}</a>
                        )
                    }
                },
                {
                    label:'索赔编号',
                    value:"claimId",
                    minWidth:100,
                },
                {
                    label:'状态',
                    value:"status",
                    minWidth:100,
                    enum:{
                        0:'处理中',
                        1:'已处理',
                        2:'未处理',
                    }
                },
            ],
            tableList:''
        };
    },
    methods: {

    },
    created() {
        this.tableList=this.params.tableList;
        ///console.log(this.tableList);
    },
};
</script>

<style scoped lang="less">

</style>

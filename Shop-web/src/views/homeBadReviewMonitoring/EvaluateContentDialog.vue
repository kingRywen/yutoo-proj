<template>
    <div>
        <yt-table
            v-loading="tableLoading"
            border
            :data="list"
            @sortChange='sortChange'
            :columns="columns"
            ref="table"
            :selection="false"
            >
        </yt-table>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        return {
            tableLoading:false,
            list:[],
            columns:[
                {
                    label: "评价者名称",
                    value: "buyerName",
                    minWidth: 150,
                    render(h,scope){
                        return(
                           <a href={scope.row.buyerUrl} style={{color:"#108ee9"}} target='_blink'>{scope.row.buyerName ? scope.row.buyerName : '-' }</a>
                        )
                    }
                },
                {
                    label: "评价者ID",
                    value: "buyerId",
                    minWidth: 150,
                    showTooltip:true,
                },
                {
                    label: "评价时间",
                    value: "reviewTime",
                    minWidth: 150,
                    sortable:"true"
                },
                {
                    label: "评价星级",
                    value: "evaluateStar",
                    minWidth: 150,
                    sortable:"true"
                },
                {
                    label: "评价内容",
                    value: "content",
                    minWidth: 150,
                    render(h,scope){
                        let { content } = scope.row
                        // return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
                        return content ? (
                            <el-tooltip open-delay={300} content={content}  effect="light">
                            <span class="fix__row_1">{content}</span>
                            </el-tooltip>
                        ) : (
                            <span>-</span>
                        )
                    }
                },
            ]
        };
    },
    methods: {
        getData(data){
            this.tableLoading=true;
            //this.list=[]
            this.$api['homeBrProductReviewList']({
                platformId:this.platformId,
                siteId:this.siteId,
                sellerId:this.sellerId,
                parentAsin:this.params.parentAsin,
                ...data
            })
            .then(data => {
                console.log(data);
                this.list=data.data;
                this.tableLoading=false;
            }).catch(() => {})
        },
        sortChange({ column, prop, order }) {
            //console.log({ column, prop, order });
            // console.log(prop);
            // console.log(order);
            this.list.sort((a,b)=>{
                if(order==='descending'){
                    if( prop === 'evaluateStar'){
                        return a['evaluateStar'] - b['evaluateStar']
                    }else{
                         return  new Date(a['reviewTime'] ).getTime() - new Date(b['reviewTime'] ).getTime()
                    }
                }else{
                     if( prop === 'evaluateStar'){
                        return b['evaluateStar'] - a['evaluateStar']
                    }else{
                         return  new Date(b['reviewTime'] ).getTime() - new Date(a['reviewTime'] ).getTime()
                    }
                }
            })

            //this.getData(params)
        },
        // // 排序参数处理函数
        // sortableFunc ({ column, prop, order }) {
        //     //debugger
        //     prop =
        //     prop &&
        //     prop.replace(/[A-Z]/g, function(match) {
        //         return '_' + match.toLowerCase()
        //     })
        //     return {
        //     sort: order && (order === 'ascending' ? 1 : 0),
        //     sortField: prop
        //     }
        // },
    
    },
    created() {
        if (this.sellerId && this.siteId) {
           this.getData()
        }
    },
    watch: {
        sellerData() {
            this.getData()
        }
    }
};
</script>

<style scoped lang="less">

</style>

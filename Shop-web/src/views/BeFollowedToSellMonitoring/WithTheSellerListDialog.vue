<template>
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :showSearch='false'
            :edits='edits'
            :editBtns='editBtns'
            :showSelection='false'
            :columns="columns" 
            ref="layout" 
            url="homeOsSellerList">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
export default {
    props:['params'],
    data() {
        let vm=this;
        return {
            outerParams:{
                siteId:null,
                sellerId:null,
            },
            edits:[],
            editBtns:[
                // {
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
                    label: "卖家",
                    value: "sellerName",
                    minWidth: 150,
                    url:"sellerUrl"
                    // render(h,scope){
                    //     rerturn(
                    //         <a href={66} target='_blink' style='color:rgb(16, 142, 233)'>{}</a>
                    //     )
                    // }
                },
                {
                    label: "跟卖子sku数量",
                    value: "sellingAmount",
                    sortable:'custom',
                    minWidth: 150,
                    render(h,scope){
                        return(
                            <el-button type='text' style='color:rgb(16, 142, 233)' onClick={()=>vm.lookSellersDatails(scope.row)} >{scope.row.sellingAmount}</el-button>
                        )
                    }
                },
                {
                    label: "发货方式",
                    value: "fbpFlag",
                    minWidth: 150,
                    enum:{
                        0:"FMB",
                        1:"FBA",
                        2:"FMB+FBA",
                    }
                },
                {
                    label: "价格",
                    value: "price",
                    sortable:'custom',
                    minWidth: 150,
                },
            ]
        };
    },
    methods: {
        lookSellersDatails(v){
            console.log(v);
            this.$refs.layout.$dialog({
                title: `查看跟卖 - ${v.sellerName}`,
                width: '1200px',
                appendToBody:true,
                params:{
                    wornTime: v.wornTime,
                    parentAsin: v.parentAsin,
                    querySellerId:v.sellerId
                },
                component: () => import('./ViewFollowSellBuyerNameDialog.vue'),
                // okBtnText: '确认',
                // cancelBtnText: '取消'
            })
        }
    },
    created() {
        this.outerParams.platformId=this.platformId;
        this.outerParams.wornTime=this.params.wornTime;
        this.outerParams.parentAsin=this.params.parentAsin;
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

<style scoped lang="scss">

</style>

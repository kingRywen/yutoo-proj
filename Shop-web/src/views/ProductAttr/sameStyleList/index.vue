<template>
    <div>
        <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
            :showSearch='showSearch'
            :treeTable="treeTable"
            ref="layout"
            url="selAttrProductListSameProduct"
            >  

            <!-- <div slot="left">123</div> -->
        </MainLayout> 
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
            showSearch:false,//不显示删选条件的搜索
            //筛选条件的搜索
                searchFields:[
                ],
            //表格头部操作按钮
                editBtns:[
                ],
            //columns表格
                 columns: [
                    {
                        value:"imageUrl",
                        name:'主图',
                        img: true, //如图片传
                        style: {
                            //图片宽高
                            width: 40,
                            height: 40
                        },
                        bulkyHeight: 150 //鼠标hover图片高，宽度自动
                        },
                    {
                        label: "价格",
                        value: "price",
                        minWidth: 150,
                    },
                    {
                        label: "颜色",
                        value: "color",
                        width: 250,
                        render(h, scope) {
                            let { color } = scope.row
                            return color ? (
                            <el-tooltip open-delay={300} content={color.join(', ')} placement="top" effect="light">
                                <span class="fix__row_1">{color.join(', ')}</span>
                            </el-tooltip>
                            ) : (
                            <span>-</span>
                            )
                        }
                    },
                    {
                        label: "尺寸",
                        value: "size",
                        width: 250,
                        render(h, scope) {
                            let { size } = scope.row
                            return size ? (
                            <el-tooltip open-delay={300} content={size.join(', ')} placement="top" effect="light">
                                <span class="fix__row_1">{size.join(', ')}</span>
                            </el-tooltip>
                            ) : (
                            <span>-</span>
                            )
                        }
                    },
                    {
                        label: "包装重量",
                        value: "shippingWeight",
                        width: 250,
                        render(h, scope) {
                            let { shippingWeight } = scope.row
                            return shippingWeight ? (
                            <el-tooltip open-delay={300} content={shippingWeight.join(', ')} placement="top" effect="light">
                                <span class="fix__row_1">{shippingWeight.join(', ')}</span>
                            </el-tooltip>
                            ) : (
                            <span>-</span>
                            )
                        }
                    },
                     {
                        label: "包装尺寸",
                        value: "dimensions",
                        width: 250,
                        render(h, scope) {
                            let { dimensions } = scope.row
                            return dimensions ? (
                            <el-tooltip open-delay={300} content={dimensions.join(', ')} placement="top" effect="light">
                                <span class="fix__row_1">{dimensions.join(', ')}</span>
                            </el-tooltip>
                            ) : (
                            <span>-</span>
                            )
                        }
                    },
                     {
                        label: "材质",
                        value: "material",
                        width: 250,
                        render(h, scope) {
                            let { material } = scope.row
                            return material ? (
                            <el-tooltip open-delay={300} content={material.join(', ')} placement="top" effect="light">
                                <span class="fix__row_1">{material.join(', ')}</span>
                            </el-tooltip>
                            ) : (
                            <span>-</span>
                            )
                        }
                    }
                
                 ],
            //外部参数
                outerParams: {
                    platformId:null,
                    siteId: null,
                    sellerId: null,
                    cateId:this.cateId,
                    cateFlag:this.cateFlag,
                },
            //表格列表操作按钮
                edits: [
                    {
                        name: "同款分析",
                        icon: "el-icon-search",
                        show: scope => {
                              return  true//scope.row.status===3;
                        },
                        fn: (scope) => {
                            //console.log(scope);
                            return this.lookData(scope.row)
                        }
                    },

                ],

            selectIds:[],//勾选的id的数组
        };
    },
    methods: {

        //查看同款分析
            lookData(v){
                //console.log(v);
                this.$refs.layout.$dialog({
                    title: "同款分析",
                    size:"large",
                    showMaxBtn:true,
                    params: {
                        parentAsin:v.parentAsin,
                        sellerId:this.outerParams.sellerId,
                        siteId:this.outerParams.siteId,
                        cateId:this.outerParams.cateId,
                        cateFlag:this.outerParams.cateFlag,
                        platformId:this.outerParams.platformId
                    },
                    component: () => import("./dialogs/withTheAnalysisDialog.vue"),
                    //okBtnText: "",
                    //cancelBtnText: "取消"
                });
            },
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
            this.outerParams.cateFlag=this.cateFlag;
        },

    }
};
</script>

<style scoped lang="less">

</style>

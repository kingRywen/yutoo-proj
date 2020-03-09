<template>
    <div>
         <MainLayout
            :outerParams="outerParams"
            :edits="edits"
            :searchFields="searchFields"
            :editBtns="editBtns"
            :columns="columns"
             @searchTrueData='searchTrueData'
            @selectChange='selectChange' 
            :treeTable="treeTable"
            :treeTableOtions="treeTableOtions"
            ref="layout"
            url="pdWarnRtListByWarnstar"
            >
         </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    data() {
        return {
            //table表格配置
            treeTable: true,
            treeTableOtions: {
                childs: "childList",
                expandFunc: row => {
                    return (row.childList && row.childList.length > 0);
                }
            },
            searchFields:[
                {
                    name: 'asin',
                    label: 'ASIN/SKU',
                    placeholder: '请输入ASIN / SKU',
                    labelWidth:'60px',
                    type:"input",
                    clearable:true,
                },
            ],
            outerParams:{
                siteId:"",
                sellerId:'',
            },
            edits:[

            ],
            editBtns:[
                 {
                    name: '导出',
                    showLoading:true,
                    // disabled: () => {
                    //     return this.$refs.layout && this.$refs.layout.selection.length === 0
                    // },
                    fn: ()=>{
                        return this.exportBtn();
                    }
                },
            ],
            columns:[
                // {
                //     label: "父ASIN/SKU",
                //     showLabel:true,
                //     value: "asin",
                //     toggle:['asin','sku'],
                //     align:'left',
                //     width:"200px",
                //     expand:true,
                // },
                 {
                    label: "SKU",
                    value: "sku",
                    width:"230px",
                    align:'left',
                    expand: true,
                    render(h,scope){
                        let length = ( scope.row.childList ? "("+ scope.row.childList.length +')': '' );
                        var styles = {
                            'text-overflow': 'ellipsis',
                            'overflow': 'hidden',
                            'white-space': 'nowrap',
                            'display':'inline-block',
                            'max-width':'150px',
                            'vertical-align': 'top',
                            
                        }
                        return(
                           <span style='width:180px;display:inline-block;'>
                                <el-tooltip class="item" effect="light" content={scope.row.sku} placement="top-start">
                                    <span style={styles}>
                                        { scope.row.sku}                                       
                                    </span>
                                </el-tooltip>
                                <span style='vertical-align: top;color:red'>{length}</span>
                           </span>
                             
                        )
                    }
                },
                {
                    label: "父ASIN",
                    value: "asin",
                    expand: true,
                    width:"200px",
                    url:"productUrl"

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
                    label: "评分",
                    value: 'starCnt',
                    render(h,scope){
                        return(
                            <div>
                                {
                                    scope.row.starType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-down' style='color: rgb(16, 142, 233);font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:4px;'>{ ( scope.row.starCnt || scope.row.starCnt===0 ) ? scope.row.starCnt :"-"}</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                },
                {
                    label: '评价数',
                    value: 'reviewCnt',
                     render(h,scope){
                        return(
                            <div>
                                {
                                    scope.row.reviewType ===0 ? (<span>----</span>) :
                                    (
                                        <div>
                                            <i class='el-icon-sort-down' style='color: rgb(16, 142, 233);font-size:22px;vertical-align:middle;'></i>
                                            <span style='margin-left:4px;'>{ ( scope.row.reviewCnt || scope.row.reviewCnt===0 ) ? scope.row.reviewCnt :"-"}</span>
                                        </div>
                                    )
                                }
                            </div>
                        )
                    }
                },
              
            ],

            searchTrueDatas:null,
            slectIds:[],
        };
    },
    methods: {
         selectChange(v){
            this.slectIds=v.map(i=>{
                return i.productId
            })
        },
         searchTrueData(v){
            this.searchTrueDatas=v;
            //console.log(v);
        },
        exportBtn(){
            let params = { ...this.searchTrueDatas, sellerId:this.sellerId ,siteId:this.siteId , productIds: this.slectIds.length ? this.slectIds : null }
            return this.$api[`pdWarnRtListByWarnstarExport`](params)
            .then(data => {
                downloadFile(data, '评分问题' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
    },
    created() {
        //console.log(3);
        if (this.sellerId && this.siteId) {
            this.outerParams.siteId=this.siteId;
            this.outerParams.sellerId=this.sellerId;
            
        }
    },
    watch:{
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.outerParams.siteId=this.siteId;
                this.outerParams.sellerId=this.sellerId;''
            }
        },
    },
};
</script>

<style scoped lang="less">

</style>

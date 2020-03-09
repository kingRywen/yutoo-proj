<template>
    <!-- 被跟卖监控 -->
    <div>
         <MainLayout 
            :outerParams="outerParams" 
            :edits="edits" 
            :searchFields="searchFields" 
            :editBtns="editBtns" 
            :expand='true'
            :showSelection='false'
            :columns="columns" 
            ref="layout" 
            @selectChange='selectChange' 
            url="homeOsSellingList">
            <!-- <div slot="left">123</div> -->
        </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';

export default {
    props:['params'],
    data() {
        return {
            outerParams:{
                sellerId:"",
                siteId:"",
            },
            searchFields:[
                {
                    label: "ASIN",
                    name: "queryAsin",
                    type: "input",
                    labelWidth:'40px',
                    placeholder: "请数入ASIN"
                },
            ],
           
            edits:[
            ],
            editBtns:[
            ],
            columns:[
                {
                    label: "跟卖时间",
                    value: "soldTime",
                    minWidth: 150
                },
                {
                    label: "子sku",
                    value: "asin",
                    minWidth: 210
                },
                {
                    label: '属性',
                    value: 'skuAttrList',
                    minWidth: 150,
                    render(h,scope){
                            let {skuAttrList}=scope.row;
                            let span='';
                            if(skuAttrList){
                                skuAttrList.forEach( (i,index) =>{                      
                                   if(index!==0 && index%2===0)  {
                                        span+= ( i['attrName'] || '-')+' : '+ (i['attrValue'] || "-") +'<br />'
                                   }else{
                                        if( index < (skuAttrList.length-1) ){
                                            span += ( i['attrName'] || '-')+' : '+ (i['attrValue'] || "-") +' , '
                                        }else{
                                             span += ( i['attrName'] || '-')+' : '+ (i['attrValue'] || "-")
                                        }
                                        
                                    };    
                                })
                            }
                            //console.log(span);
                            return skuAttrList ? ( 
                                <el-tooltip open-delay={300}  effect="light" >
                                     <div slot="content" domPropsInnerHTML={span}></div>
                                    <span class="fix__row_1"  domPropsInnerHTML={span}></span>
                                </el-tooltip>
                                ) : (
                                 <span>-</span>
                            )
                    }
                },
                 {
                    label: "发货方式",
                    value: "fbpFlag",
                    minWidth: 150,
                    enum:{
                        0:"FBM",
                        1:"FBA",
                        2:"FMB+FBA",
                    }
                },
                 {
                    label: "价格",
                    value: "price",
                    minWidth: 150,
                    sortable:'custom',
                },
            ],

        };
    },
    methods: {
        searchFunc(data){
            let {time,...info}=data;
            let [startTime,endTime] =time || [];
            return {startTime,endTime,...info}
        },
        selectChange(){

        },
        // lookSellersDatails(){
        //     this.$refs.layout.$dialog({
        //         title: '跟卖卖家列表',
        //         width: '1200px',
        //         params:{},
        //         component: () => import('./WithTheSellerListDialog.vue'),
        //         // okBtnText: '确认',
        //         // cancelBtnText: '取消'
        //     })
        // },
        exportBtn(){
            let params = { ...this.mustParams, parentAsins: this.slectIds.length ? this.slectIds : null }
            this.$api[`selAttrProductExportProductData`](params)
            .then(data => {
                downloadFile(data, '问题列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
    },
    created() {
        this.outerParams.platformId=this.platformId;
        this.outerParams.wornTime=this.params.wornTime;
        this.outerParams.parentAsin=this.params.parentAsin;
        this.outerParams.querySellerId=this.params.querySellerId;
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

<style scoped lang="less">

</style>

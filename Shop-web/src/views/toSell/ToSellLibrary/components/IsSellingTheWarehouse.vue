<template>
    <div>
       <MainLayout
            :outerParams="outerParams"
            :editBtns="editBtns"
            :columns="columns"
            @searchTrueData='searchTrueData'
            @selectChange='selectChange' 
            :customDisplay='true'
            :searchFunc='searchFunc'
            :outSearchData='outSearchData'
            :searchFields='searchFields'
            :treeTable="treeTable"
             @select="handleSelect"
            :treeTableOtions="treeTableOtions"
            ref="layout"
            url="imSaleProdExeListProduct"
            >
       </MainLayout>
    </div>
</template>

<script>
export default {
    props:['radioSiteId','radioSiteName','pcid','symbol'],
    data() {
        let vm = this 
        return {
            treeTable:true,
            treeTableOtions:{
                childs: "childList",
                expandFunc: row => {
                    return (row.childList && row.childList.length > 0);
                }
            },
            outerParams:{

            },
            outSearchData:{
                sellerId:null
            },
            searchFields:[
                {
                    label:"ASIN",
                    name:'asin',
                    placeholder:"请输入ASIN",
                    type:"input",
                    labelWidth:'40px',
                }, 
                {
                    label:"跟卖店铺",
                    name:'sellerId',
                    placeholder:"请选择跟卖店铺",
                    type:"select",
                    options:[
                        
                    ]
                },
                {
                    label:"跟卖状态",
                    name:'saleStatus',
                    placeholder:"请选择跟卖状态",
                    type:"select",
                    options:[
                        { label: '停止跟卖' , value: 0 },
                        { label: '正在跟卖' , value: 1 },
                    ]
                },
                {
                    label:"更新时间",
                    name:'time',
                    //placeholder:"请选择跟卖状态",
                    type:"dateRange",
                    pickerOptions: {
                        disabledDate(time) {
                            return time.getTime() > Date.now();
                        }
                    },
                },
            ],
            editBtns:[
                {
                    name: '停止跟卖',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                        return  this.ToSellStatus(0)
                    }
                },
                {
                    name: '重新跟卖',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                       return  this.ToSellStatus(1)
                    }
                },
                {
                    name: '修改价格',
                    disabled: () => {
                        let firstSellerId = vm.skuList.length && vm.skuList[0].sellerId  ;
                        let flag = vm.skuList.length===0 ? true :false;
                        //多选的只能选择相同店铺下的
                        vm.skuList.forEach(i=>{
                            if(i.sellerId !== firstSellerId ){
                                flag = true;
                                return
                            }
                        })
                        return flag
                    },
                    fn: () => {
                       return this.editPrice()
                    }
                },
                {
                    name: '修改源库存量',
                    disabled: () => {
                        //let firstSellerId = vm.asinList.length && vm.asinList[0].sellerId  ;
                        let flag = vm.skuList.length===0 ? true :false;
                        // vm.asinList.forEach(i=>{
                        //     if(i.sellerId !== firstSellerId ){
                        //         flag = true;
                        //         return
                        //     }
                        // })
                        return flag
                    },
                    fn: () => {
                       return this.editInventory()
                    }
                },
                {
                    name: '删除',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: ()=>{
                       return this.deleteBtn();
                    }
                },
            ],
            columns:[
                {
                    label:"SKU",
                    value:"sku",
                    width:200,
                    expand:true
                },
                {
                    label: "更新时间",
                    value: "updateTime",
                    minWidth: 150
                },
                {
                    label:"ASIN",
                    value:"asin",
                    width:200,
                    url:"productUrl",
                },
                {
                    label:"图片",
                    value:"imageUrl",
                    img:true,
                    style: {
                        //图片宽高
                        width: 40,
                        height: 40
                    },
                    bulkyHeight: 120 //鼠标hover图片高，宽度自动
                },
                {
                    label:"源站点",
                    value:"sourceSiteName",
                },
                {
                    label:"跟卖店铺",
                    value:"sellerId",
                    minWidth:160,
                },
                {
                    label:"源库存量",
                    value:"sourceQuantity",
                    sortable:'custom',
                    minWidth:110,
                     render(h,scope){
                        return(
                            <span>{ scope.row.sourceQuantity >= 30 ? 30 +'+' : scope.row.sourceQuantity }</span>
                        )
                    }
                },
                {
                    label:"源总价格",
                    value:"totalPrice",
                    //sortable:'custom',
                    minWidth:110,
                    // render(h,scope){
                    //     let span='';
                    //     if( scope.row.childList && scope.row.childList.length){
                    //         // let priceArr = []
                    //         // scope.row.childList.forEach(i=>{
                    //         //     if( i.totalPrice < 0 ){
                    //         //         priceArr.push(null)
                    //         //     }else{
                    //         //         priceArr.push(i.totalPrice)
                    //         //     }                             
                    //         // });
                    //         // let newArr = [];
                    //         // priceArr.forEach(i=>{
                    //         //     if( i || i===0){
                    //         //         newArr.push(i)
                    //         //     }
                    //         // });
                    //         // if( newArr.length ){
                    //         //      span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                    //         //       if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                    //         //           span = '$'+ Math.min.apply(null,newArr)
                    //         //      }
                    //         // }else{
                    //         //     span =  (<i class="el-icon-close" style="color:red;font-size:28px"></i>)
                    //         // }
                    //         span = ('-')
                    //     }else{
                    //         span = ( scope.row.totalPrice < 0 ? (<i class="el-icon-close" style="color:red;font-size:28px"></i>) : (scope.row.totalPrice || scope.row.totalPrice===0) ? '$'+scope.row.totalPrice : '-' );
                    //     };
                    //     return(
                    //         <span>{ span }</span>
                    //     )
                    // }
                    render(h,scope){
                        let totalPrice = scope.row.totalPrice
                        if(totalPrice && totalPrice>0) totalPrice = totalPrice.toFixed(2)
                        return totalPrice || totalPrice == 0 ? (
                            totalPrice == 0 ? (
                                <span>0</span>
                            ) : totalPrice > 0 ? (
                                <span>{vm.symbol}{totalPrice}</span>
                            ) : totalPrice<-10 ? (
                                <span>抓取失败</span>
                            ) : (									
                                <span>不能配送</span>
                            )
                        ) : (
                            <span>-</span>
                        )
                    }
                },
                {
                    label:"跟卖最高价",
                    value:"maxPrice",
                    sortable:'custom',
                    minWidth:120,
                    render(h,scope){
                        return  scope.row.maxPrice || scope.row.maxPrice ===0 ? (
                            <span>{vm.symbol + scope.row.maxPrice }</span>
                        ) :(
                            "-"
                        )
                    }
                },
                {
                    label:"跟卖最低价",
                    value:"minPrice",
                    sortable:'custom',
                    minWidth:120,
                    render(h,scope){
                        return scope.row.minPrice || scope.row.minPrice ===0 ?(
                            <span>{ vm.symbol+scope.row.minPrice }</span>
                        ):(
                            '-'
                        )
                    }
                },
                {
                    label:"亚马逊自营价格",
                    value:"fbaPrice",
                    // sortable:'custom',
                    minWidth:140,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.fbaPrice < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.fbaPrice)                                 
                        //         }                             
                        //     });
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                        //           if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                        //               span = '$'+ Math.min.apply(null,newArr)
                        //          }
                        //     }else{
                        //         span =  ('无')
                        //     }
                        // }else{
                            span = (  (scope.row.fbaPrice || scope.row.fbaPrice===0) ? vm.symbol+scope.row.fbaPrice : '无' );
                        //};
                        return(
                            <span>{ span }</span>
                        )
                    }
                },
                {
                    label:"当前库存量",
                    value:"quantity",
                    sortable:'custom',
                    minWidth:110,
                },
                {
                    label:"销售价",
                    value:"salePrice",
                    //sortable:'custom',
                    minWidth:110,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.salePrice < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.salePrice)                                 
                        //         }                             
                        //     });
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                        //           if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                        //               span = '$'+ Math.min.apply(null,newArr)
                        //          }
                        //     }else{
                        //         span =  ('-')
                        //     }
                        // }else{
                            span = (  (scope.row.salePrice || scope.row.salePrice===0) ? vm.symbol+scope.row.salePrice : '-' );
                        // };
                        return(
                            <span>{ span }</span>
                        )
                    }
                },
                {
                    label:"运费",
                    value:"fare",
                    //sortable:'custom',
                    minWidth:110,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.fare < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.fare)                                 
                        //         }                             
                        //     });
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                        //           if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                        //               span = '$'+ Math.min.apply(null,newArr)
                        //          }
                        //     }else{
                        //         span =  ('-')
                        //     }
                        // }else{
                            span = (  (scope.row.fare || scope.row.fare===0) ? vm.symbol+scope.row.fare : '-' );
                        //};
                        return(
                            <span>{ span }</span>
                        )
                    }
                },
                {
                    label:"保底价",
                    value:"bottomPrice",
                    //sortable:'custom',
                    minWidth:110,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.bottomPrice < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.bottomPrice)                                 
                        //         }                             
                        //     });
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                        //           if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                        //               span = '$'+ Math.min.apply(null,newArr)
                        //          }
                        //     }else{
                        //         span =  ('-')
                        //     }
                        // }else{
                            span = (  (scope.row.bottomPrice || scope.row.bottomPrice===0) ? vm.symbol+scope.row.bottomPrice : '-' );
                        //};
                        return(
                            <span>{ span }</span>
                        )
                    }
                },
                {
                    label:"最近30天订单数",
                    value:"orderCntD30",
                    sortable:'custom',
                    minWidth:150,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.orderCntD30 < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.orderCntD30)                                 
                        //         }                             
                        //     });
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                        //           if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                        //               span = '$'+ Math.min.apply(null,newArr)
                        //          }
                        //     }else{
                        //         span =  ('-')
                        //     }
                        // }else{
                            span = (  (scope.row.orderCntD30 || scope.row.orderCntD30===0) ? scope.row.orderCntD30 : '-' );
                        //};
                        return(
                            <span>{ span }</span>
                        )
                    }
                },
                {
                    label:"跟卖状态",
                    value:"saleStatus",
                    minWidth:110,
                    enum:{
                        0:'停止跟卖',
                        1:'正在跟卖',
                    }
                },
                {
                    label:"所属类目",
                    value:"category",
                    align:'left',
                    width:310,
                    render(h, scope) {
                        let  category  = scope.row.category
                        if(category.length>50){
                            let newArr = category.split(':')
                            var newStr = ''
                            newStr = `${newArr[0]}...${newArr.pop()}`
                        }
                        return category ? (
                        <div>					
                            <el-tooltip open-delay={300} content={category} placement="top"  effect="light">
                                <a class="fix__row_1" href={scope.row.categoryUrl} style="color:#108ee9;" target='_blink'>{category.length>50?newStr:category}</a>
                            </el-tooltip>
                        </div>
                        
                        ) : (
                        <span>-</span>
                        )
                    }
                }
            ],

            searchTrueDatas:null,
            selectIds:[],
            selectSkus:[],//勾选sku数组
            skuList:[],
        };
    },
    methods: {
        //删除按钮
        deleteBtn(){
            return this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    return this.$api['imSaleProdExeRemove']({
                        siteId :this.radioSiteId,
                        skus : this.selectSkus
                    })
                    .then(data => {
                        this.$refs.layout.getList()
                    }).catch(() => {})
                }).catch(() => {
                     
                });
        },
        searchFunc(data){
            let {time,...info} = data;
            let [startTime,endTime] = time || [];
            return {startTime,endTime,...info};
        },
        //导出
        // exportBtn(){
        //      let params = { ...this.searchTrueDatas ,productFlag: 1,siteId:this.radioSiteId ,asins: this.selectIds.length ? this.selectIds : null }
        //     this.$api[`imSaleProdAbleListProductExport`](params)
        //     .then(data => {
        //         downloadFile(data, '正在跟卖库' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
        //     })
        //     .catch(() => {})
        // },
        //表格勾选,勾选父级也勾选子级
        handleSelect(select, row) {
            let vm = this

            if (row.childList) {
                if( !row.hasOwnProperty('selectStatus')){
                    row.selectStatus = true ;
                }else{
                    row.selectStatus = !row.selectStatus ;
                };
                //console.log(row.selectStatus);
                vm.$refs.layout.$refs.table.$refs.table.toggleRowSelection(row,row.selectStatus )
                row.childList.forEach(el => {
                // debugger
                    vm.$refs.layout.$refs.table.$refs.table.toggleRowSelection(el,row.selectStatus )
                })
            };
          
            if(row.parent){
                let parent = row.parent
                let num = 0;
                parent.childList.forEach(i=>{
                    this.selectData.forEach(k=>{
                        if( i.asin === k.asin){
                            num ++ 
                        }
                    })
                });
                if( num !== parent.childList.length ){
                    parent.selectStatus = false;
                    vm.$refs.layout.$refs.table.$refs.table.toggleRowSelection(row.parent,false)
                };
                if(  num === parent.childList.length ){
                    parent.selectStatus = false;
                    vm.$refs.layout.$refs.table.$refs.table.toggleRowSelection(row.parent,false)
                };
            };

            this.getSelectAsin(select);
        },
        //表单搜索的真实数据
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        getSelectAsin(data){
            this.selectIds=[];
            this.selectSkus=[];
            let skuList=[];
            data.forEach(i=>{
                if( !i.childList){
                    if( !this.selectIds.includes(i.asin)){
                        this.selectIds.push(i.asin);
                    };
                    if( !this.selectSkus.includes(i.sku)){
                        this.selectSkus.push(i.sku);
                    };
                    let item = {sku:i.sku,sellerId:i.sellerId} ;
                    skuList.push(item);
                }else{
                    i.childList.forEach(k=>{
                        if( !this.selectIds.includes(k.asin)){
                            this.selectIds.push(k.asin);
                        };
                        if( !this.selectSkus.includes(k.sku)){
                            this.selectSkus.push(k.sku);
                        };
                        let item = {sku:k.sku,sellerId:k.sellerId} ;
                        skuList.push(item);
                    });  
                }
               
            });   
            this.skuList = [];
            skuList.forEach(p=>{
                let flag = true;
                this.skuList.forEach(b=>{
                    if( p.sku === b.sku){
                         flag = false;
                         return 
                    }
                });
                if( flag ){
                    this.skuList.push(p)
                }
            });
            console.log(this.selectIds);
            console.log(this.skuList);
            console.log(this.selectSkus);
        },
        selectChange(v){
            this.selectData = v;
            this.getSelectAsin(v)
        },
        //重新跟卖或停止跟卖
        ToSellStatus(v){
            return this.$api['imSaleProdExePause']({
                siteId:this.radioSiteId,
                skus:this.selectSkus,
                pauseFlag:v,
            })
            .then(data => {
                this.$refs.layout.getList()
            }).catch(() => {})
        },
        //修改价格
        editPrice(){
            //console.log(this.$refs.layout.selection);
            this.$refs.layout.$dialog({
                title: '修改价格',
                width: '560px',
                params:{
                   skuList :this.skuList,
                   siteId : this.radioSiteId,
                },
                component: () => import('./dialog/editPriceDialog.vue'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        //修改原库存量
        editInventory(){
            this.$refs.layout.$dialog({
                title: '修改源库存',
                width: '560px',
                params:{
                   asins : this.selectIds,
                   siteId : this.radioSiteId,
                },
                component: () => import('./dialog/editInventory.vue'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        //获取授权店铺,获取跟卖店铺的下拉选项
        getAuthorizationShop(){
            let opt=[] ;
            this.stateData.forEach(i=>{
                if ( i.platformName === "Amazon" ) {
                    i.siteList.forEach(k=>{
                        if(k.siteName===this.radioSiteName){
                            k.sellerList.forEach(h=>{
                                opt.push({
                                    label:h.sellerAlias,
                                    value:h.sellerId,
                                })
                            })
                        }
                    })
                }
            });
            this.$set(this.outSearchData,'sellerId',null)
            this.searchFields.splice(1,1,
                {
                    label:"跟卖店铺",
                    name:'sellerId',
                    placeholder:"请选择跟卖店铺",
                    type:"select",
                    options:opt
                },
            );
            //console.log(opt);
        },
    },
    created() {
        //console.log(this.$store.state.common.stateData);
    },
    computed:{
       stateData(){
           return this.$store.state.common.stateData
       }
    },
    watch:{
        stateData(){
            if (this.stateData && this.radioSiteName) {
                this.getAuthorizationShop()
            }
       },
       radioSiteId:{
            handler(oldName,newMame){
                //console.log(this.radioSiteId);
                if( this.radioSiteId) {
                    //this.outerParams.siteId=this.radioSiteId ;
                    this.$set(this.outerParams,'siteId',this.radioSiteId )
                    if (this.stateData && this.radioSiteName) {
                        this.getAuthorizationShop()
                    }
                }
                //console.log(this.outerParams.siteId);
            },
            immediate:true
        },
        pcid:{
            handler(oldName,newMame){
                if( this.pcid) {
                    this.$set(this.outerParams,'pcid',this.pcid);
                }
            },
            immediate:true
        },
    }
};
</script>

<style scoped lang="less">

</style>


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
            :treeTable="treeTable"
             @select="handleSelect"
            @requestSuccess='requestSuccess'
            :treeTableOtions="treeTableOtions"
            ref="layout"
            url="imSaleProdAbleListProduct"
            >
            <div slot="search">
                <el-form :label-position="'center'" :model="formInline" ref='formInline' :inline="true" :rules='rules'>
                    <el-form-item label="ASIN" prop='asin'>
                        <el-input v-model.trim="formInline.asin" size='small' placeholder="请输入"></el-input>
                    </el-form-item>
                    <el-form-item label="更新时间" prop='time'>
                         <el-date-picker
                            v-model="time"
                            type="daterange"
                            size='small'
                            style='width:260px;'
                            :picker-options="pickerOptions1"
                            value-format="yyyy-MM-dd"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="跟卖最高价格/源总价格" prop="minHighest">
                        <el-input type='text' v-model.number="formInline.minHighest" size='small' placeholder="请输入小值" style='width:100px;'></el-input> %
                    </el-form-item>
                    <el-form-item label="~" prop="maxHighest">
                        <el-input type='text' v-model.number="formInline.maxHighest" size='small' placeholder="请输入大值" style='width:100px;'></el-input> %
                    </el-form-item>
                    <el-form-item label="跟卖最低价格/源总价格" prop="minLowest">
                        <el-input type='text' v-model.number="formInline.minLowest" size='small' placeholder="请输入小值" style='width:100px;'></el-input> %
                    </el-form-item>
                    <el-form-item label="~" prop="maxLowest">
                        <el-input type='text' v-model.number="formInline.maxLowest" size='small' placeholder="请输入大值" style='width:100px;'></el-input> %
                    </el-form-item>
                    <el-form-item label="是否有亚马逊自营" prop="fbaPriceFlag">
                        <el-select v-model="formInline.fbaPriceFlag" placeholder="请选择" size='small'>
                            <el-option
                            v-for="item in fbaFlagOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="源站点" prop="sourceSiteId">
                        <el-select v-model="formInline.sourceSiteId" placeholder="请选择" size='small'>
                            <el-option
                            v-for="item in siteList"
                            :key="item.value"
                            :label="item.siteName"
                            :value="item.siteId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="源店铺" prop="sourceSellerId">
                        <el-select v-model="formInline.sourceSellerId" placeholder="请选择" size='small'>
                            <el-option
                            v-for="item in SourceShopsOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="tableLoading">搜索</el-button>
                            <el-button size="small" type="primary" plain @click="resetSearch" :loading="tableLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
         </MainLayout>
    </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
    props:['radioSiteId','siteList','pcid','symbol'],
    data() {
        let vm=this;
        var validatePass = (rule, value, callback) => {
            let field=rule.field;
            // console.log(field);
            // console.log(value);
            // if (!value && field==='multipleFrequency') {
            //     return callback(new Error('抓取倍率不能为空'));
            // };
            if( (value && isNaN(Number(value))) || (value && Number(value)<=0) || ( value &&  !/^[1-9]\d*$/.test(value*1)) ){
                return callback(new Error('请输入大于0的整数'));
            };
            if( field==='minHighest' || field==='maxHighest' ){
                    // if( vm.formInline.maxPages &&  !vm.formInline.minPages && field==='minPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  vm.formInline.minPages &&  !vm.formInline.maxPages && field==='maxPages'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.minHighest && vm.formInline.maxHighest) {
                            if(  Number(vm.formInline.minHighest) >= Number(vm.formInline.maxHighest) ){
                                 return callback(new Error('大值需大于小值'));
                            };
                    };
            };
            
            if( field==='minLowest' || field==='maxLowest' ){
                    // if( vm.formInline.minRank &&  !vm.formInline.maxRank && field==='maxRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    // if(  !vm.formInline.minRank &&  vm.formInline.maxRank && field==='minRank'){
                    //     return callback(new Error('请输入'));
                    // };
                    if( vm.formInline.minLowest && vm.formInline.maxLowest) {
                            if(  Number(vm.formInline.minLowest) >= Number(vm.formInline.maxLowest) ){
                                 return callback(new Error('大值需大于小值'));
                            };
                    };
            };
            callback()
        };
        return {
            treeTable:true,
            treeTableOtions:{
                childs: "childList",
                expandFunc: row => {
                    return (row.childList && row.childList.length > 0);
                }
            },
            outerParams:{
                //productFlag:0, 
            },
          
            //是否是否有亚马逊自营下拉
            fbaFlagOptions:[
                {label:"是",value:1},
                {label:"否",value:0},
            ],
            SourceShopsOptions:[],//源店铺的下拉
            formInline:{
                asin:null,
                minHighest:null,
                maxHighest:null,
                minLowest:null,
                maxLowest:null,
                fbaFlagOptions:null,
                sourceSiteId:null,
                sourceSellerId:null,
            },
            time:[],
            pickerOptions1: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            //搜索的验证规则
            rules:{
                minHighest:[{ validator: validatePass, trigger: ['blur','change'] }],
                maxHighest:[{ validator: validatePass, trigger: ['blur','change'] }],
                minLowest:[{ validator: validatePass, trigger: ['blur','change'] }],
                maxLowest:[{ validator: validatePass, trigger: ['blur','change'] }],
            },
            editBtns:[
                  {
                    name: '加入计划跟卖库',
                    showLoading:true,
                    disabled: () => {
                        return this.$refs.layout && this.$refs.layout.selection.length === 0
                    },
                    fn: () => {
                       return this.addToSellLibrary()
                    }
                },
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
                    label: "ASIN",
                    value: "asin",
                    width:"200px",
                    expand:true,
                    render(h,scope,a,b){
                        return(
                            <a href={scope.row.productUrl} target="_blink" style='color: rgb(16, 142, 233);'>{scope.row.asin}</a>
                        )
                    }
                },
                {
                    label: "更新时间",
                    value: "updateTime",
                    minWidth: 150
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
                    label: "源站点",
                    value: "sourceSiteName",
                    minWidth: 120
                },
                {
                    label: "源店铺",
                    value: "sourceSellerId",
                    minWidth: 160
                },
                {
                    label: "源总价格",
                    value: "totalPrice",
                    minWidth: 120,
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
                    //         //      if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
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
                    label: "源库存",
                    value: "sourceQuantity",
                    minWidth: 100,
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ scope.row.sourceQuantity >= 30 ? 30 +'+' : scope.row.sourceQuantity }</span>
                        )
                    }
                },
                {
                    label: "跟卖卖家数",
                    value: "sellerCnt",
                    minWidth: 120,
                    sortable:"custom",
                },
                {
                    label: "跟卖最高价",
                    value: "maxPrice",
                    minWidth: 120,
                    sortable:"custom",
                    render(h,scope){
                        return  scope.row.maxPrice || scope.row.maxPrice ===0 ? (
                            <span>{vm.symbol + scope.row.maxPrice }</span>
                        ) :(
                            "-"
                        )
                    }
                },
                {
                    label: "跟卖最低价",
                    value: "minPrice",
                    minWidth: 120,
                    //money:'us',
                    sortable:"custom",
                    render(h,scope){
                        return scope.row.minPrice || scope.row.minPrice ===0 ?(
                            <span>{ vm.symbol+scope.row.minPrice }</span>
                        ):(
                            '-'
                        )
                    }
                },
                {
                    label: "是否有FBA跟卖",
                    value: "fbaFlag",
                    minWidth: 130,
                    render(h,scope){
                        let span;
                        // if( scope.row.childList && scope.row.childList.length){
                        //     span= ('否')
                        //     scope.row.childList.forEach(i=>{
                        //         if(i.fbaFlag === 1){
                        //              span= ('是');
                        //              return
                        //         }   
                        //     });
                        // }else{
                            span = scope.row.fbaFlag === 0 ? '否' : '是'
                        //};
                        return(
                            <span>{span}</span>
                        )
                    },
                },
                {
                    label: "亚马逊自营价格",
                    value: "fbaPrice",
                    minWidth: 150,
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
                        //         span = ( '$'+ Math.min.apply(null,newArr) + '~' + '$'+ Math.max.apply(null,newArr)  ) ;
                        //         if(  Math.min.apply(null,newArr) === Math.max.apply(null,newArr) ){
                        //             span = '$'+ Math.min.apply(null,newArr)
                        //         }
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
                    //sortable:"custom"
                },
                {
                    label: "跟卖最高价格/源总价格",
                    value: "highest",
                    minWidth: 160,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.highest < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.highest)
                        //         }                             
                        //     });
                        //     // console.log(priceArr);
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( Math.max.apply(null,newArr) ) ;
                        //     }else{
                        //         span =  ('-')
                        //     }
                        // }else{
                            span = ( (scope.row.highest || scope.row.highest===0) ? scope.row.highest : '-' );
                        //};

                        if( span !== '-'){
                            span = parseInt(span*10000)/100+"%"
                        };
                        return(
                            <span>{ span }</span>
                        )
                    }
                    //sortable:"custom"
                },
                {
                    label: "跟卖最低价格/源总价格",
                    value: "lowest",
                    minWidth: 160,
                    render(h,scope){
                        let span='';
                        // if( scope.row.childList && scope.row.childList.length){
                        //     let priceArr = []
                        //     scope.row.childList.forEach(i=>{
                        //         if( i.lowest < 0 ){
                        //             priceArr.push(null)
                        //         }else{
                        //             priceArr.push(i.lowest)
                        //         }                             
                        //     });
                        //     let newArr = [];
                        //     priceArr.forEach(i=>{
                        //         if( i || i===0){
                        //             newArr.push(i)
                        //         }
                        //     });
                        //     if( newArr.length ){
                        //          span = ( Math.min.apply(null,newArr) ) ;
                        //     }else{
                        //         span =  ('-')
                        //     }
                        // }else{
                            span = ( (scope.row.lowest || scope.row.lowest===0) ? scope.row.lowest : '-' );
                        //};

                        if( span !== '-'){
                            span = parseInt(span*10000)/100+"%"
                        };
                        return(
                            <span>{ span }</span>
                        )
                    }
                    //sortable:"custom"
                },
                {
                    label: "所属类目",
                    value: "category",
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
                },
            ],

            selectIds:[],//表格勾选
            searchTrueDatas:"",//搜索的所有的数据

            tableLoading:false,//搜索的loading

            selectData:[],
            
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
                    return this.$api['imSaleProdAbleRemove']({
                        siteId :this.radioSiteId,
                        asins : this.selectIds
                    })
                    .then(data => {
                        this.$refs.layout.getList()
                    }).catch(() => {})
                }).catch(() => {
                     
                });
        },
        //表格勾选,勾选父级也勾选子级
        handleSelect(select, row) {
            let vm = this;

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
            }
            //console.log(this.selectData);
            //console.log(select);
            this.getSelectAsin(select)
            
        },
        //导出
        exportBtn(){
            let params = { ...this.searchTrueDatas ,productFlag: 0,siteId:this.radioSiteId ,asins: this.selectIds.length ? this.selectIds : null }
            return  this.$api[`imSaleProdAbleListProductExport`](params)
            .then(data => {
                downloadFile(data, '可跟卖库' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
            })
            .catch(() => {})
        },
        //表单搜索的真实数据
        searchTrueData(v){
            this.searchTrueDatas=v;
        },
        selectChange(v){
            //console.log(v);
            this.selectData = v;
            this.getSelectAsin(v)
        },
        getSelectAsin(data){
            this.selectIds=[];
            data.forEach(i=>{
                if( !i.childList){
                    if( !this.selectIds.includes(i.asin)){
                        this.selectIds.push(i.asin);
                    }      
                }else{
                    i.childList.forEach(k=>{
                        if( !this.selectIds.includes(k.asin)){
                            this.selectIds.push(k.asin);
                        } 
                    })
                }
               
            });
            //console.log(this.selectIds);
        },
        //搜索参数处理
        searchFunc(data){
            let [startTime,endTime] = this.time || [];
            let {minHighest,maxHighest,minLowest,maxLowest,...formInlineInfo} = JSON.parse(JSON.stringify(this.formInline));
            minHighest = minHighest ? minHighest/100 : null;
            maxHighest = maxHighest ? maxHighest/100 :null ;
            minLowest = minLowest ? minLowest/100 : null ;
            maxLowest = maxLowest ? maxLowest/100 : null ;
            return {startTime,endTime,minHighest,maxHighest,minLowest,maxLowest,...formInlineInfo};
        },
        //确认搜索
        handleSearch(){
            //console.log(this.formInline);
            this.$refs.formInline.validate((valid) => {
                if (valid) {
                    this.tableLoading=true;
                    this.$refs.layout.getList();
                }
            });
        },
        //接受子组件的请求成功的方法
        requestSuccess(){
            //console.log('object');
            this.tableLoading=false;
        },
        //重置搜索
        resetSearch(){
            this.tableLoading=true;
            for(let k in this.formInline){
                this.formInline[k]=null
            };
            this.$refs.formInline.clearValidate()
            this.$refs.layout.getList();
        },
        //获取源店铺列表
        getSourceShopsList(){
            this.SourceShopsOptions=[]
            this.$api['imSaleProdCheckListSellerId']({
                siteId:this.radioSiteId
            })
            .then(data => {
               //console.log(data);
                data.data.forEach(i=>{
                    this.SourceShopsOptions.push({
                        label:i,
                        value:i

                    })
                })
            })
        },
        //加入计划跟卖库
        addToSellLibrary(){
            return this.$confirm('此操作将加入计划跟卖库, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                return this.$api['imSaleProdAbleUpdatePlan']({
                    siteId:this.radioSiteId,
                    asins:this.selectIds
                })
                .then(data => {
                    this.$refs.layout.getList()
                    this.$emit('dialogSuccess')
                }).catch(() => {})
            }).catch(() => {
               
            });
         
        },

    },
    created() {
        
    },
    watch:{
        radioSiteId:{
            handler(oldName,newMame){
                if( this.radioSiteId) {
                    this.$set(this.outerParams,'productFlag',0);
                    this.$set(this.outerParams,'siteId',this.radioSiteId );
                    this.$set(this.outerParams,'sourceSellerId',null );
                    this.formInline.sourceSellerId=null;
                    this.getSourceShopsList() 
                } 
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
.el-form-item{
    margin-bottom:10px;
}
</style>

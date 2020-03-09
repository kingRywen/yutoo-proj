<template>
<!--创建广告的商品 -->
    <div class='par-div'>
        <el-row :gutter="20">
            <el-col :span="10">
                <div class="grid-content bg-purple">
                    <el-input placeholder="按商品名称、ASIN或SKU进行搜索" v-model.trim="inputVal" class="input-with-select" size='small' clearable @clear='clear'>
                        <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
                    </el-input>
                    <div class='border-top'>
                        <span>按添加日期排序</span>
                        <el-button size='mini' type="primary" style='margin-left:6px;' plain @click='sortBtn'>{{btnText}}</el-button>
                        <el-button size='mini' type="text" style='float:right;' @click='addAll'>在此页面添加全部</el-button>
                    </div>
                    <div 
                        class='border-top' 
                        style='overflow:auto;overflow-x:hidden;border-bottom:1px solid #dcdcdc;' 
						:style='{height:viewHeight}'
                        v-loading='loading'
                        v-if='tableData && tableData.length>0'
                    >
                        <div v-for='(item,index) in tableData' :key='item.productId' style='padding:10px 0;border-top:1px solid #dcdcdc;'>
                            <el-row :gutter="20">
                                <el-col :span="5">
                                    <div class="grid-content bg-purple">
                                        <div class='imgItem'>
                                            <img v-lazy="item.imageUrl" alt="" :key='item.productId' class='img loadingImg'>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="14">
                                    <div class="grid-content bg-purple">
                                        <p class='title-p fix__row_2'><a :href="item.productUrl" target="_blink">{{item.productName}}</a></p>
                                        <div style='font-size:12px;margin-top:4px;'>
                                            <span v-if='item.price ||item.price===0' style='margin-right:10px;'>${{item.price }}</span>
                                            <!-- <span style='margin-left:10px;'>$122.26</span> -->
                                            <span v-if='item.productStatus===2' ><i class="el-icon-warning" style='font-size:12px;'></i> 缺货</span>
                                        </div>
                                        <div style='font-size:12px;margin-top:4px;'>
                                            <span>SKU:{{item.sku ? item.sku :"-"}}</span>
                                            <span> | </span>
                                            <span>ASIN:{{item.asin ? item.asin :"-"}}</span>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div class="grid-content bg-purple" style='position:relative;'>
                                        <el-button size='mini' type="primary" plain @click='addItem(index)'
                                            style='position:absolute;right:20px;top:0px;'
                                            :disabled="item.parentDisabled"
                                        >添加</el-button>
                                        <el-button size='mini' type="primary" plain @click='addChildList(index)' v-if='item.childList'
                                            style='position:absolute;right:20px;top:36px;' :disabled="item.childDisabled">添加变体</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <NonePage v-else></NonePage>
                    <div v-if='total' style='margin-top:10px;text-align:center;'>
                        <el-pagination
                            @size-change="HandleSizeChange"
                            @current-change="HandleCurrentChange"
                            :current-page="pageNumber"
                            :page-sizes="[10,20,30, 50,1000]"
                            :page-size="pageSize"
                            layout="prev, pager, next ,total"
                            :total='total'
                            >
                        </el-pagination>
                    </div>
                </div>
               
            </el-col>
            <el-col :span="10">
                <div class="grid-content bg-purple">
                    <div style='height:32px;'></div>
                    <div class='border-top' style='padding-top: 14px; padding-bottom: 10px;'>
                        <span style='color:#333;'>{{addData.length}} 商品</span>
                        <el-button size='mini' type="text" plain style='float:right;' @click='deleteAll' :disabled="!addData.length">全部删除</el-button>
                    </div>
                    <div 
                        class='border-top' 
                        style='overflow:auto;overflow-x:hidden;border-bottom:1px solid #dcdcdc;' 
						:style='{height:viewHeight}'
                        v-if='addData && addData.length>0'
                    >
                        <div v-for='(item,index) in addData' :key='item.productId' style='padding:10px 0;border-top:1px solid #dcdcdc;'>
                            <el-row :gutter="20">
                                <el-col :span="5">
                                    <div class="grid-content bg-purple">
                                        <div class='imgItem'>
                                            <img v-lazy="item.imageUrl" alt="" :key='item.productId' class='img loadingImg'>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="14">
                                    <div class="grid-content bg-purple">
                                        <p class='title-p fix__row_2'><a :href="item.productUrl" target="_blink">{{item.productName}}</a></p>
                                        <div style='font-size:12px;margin-top:4px;'>
                                            <span v-if='item.price ||item.price===0' style='margin-right:10px;'>${{item.price }}</span>
                                            <!-- <span style='margin-left:10px;'>$122.26</span> -->
                                            <span v-if='item.productStatus===2' ><i class="el-icon-warning" style='font-size:12px;'></i> 缺货</span>
                                        </div>
                                        <div style='font-size:12px;margin-top:4px;'>
                                            <span>SKU:{{item.sku ? item.sku :"-"}}</span>
                                            <span> | </span>
                                            <span>ASIN:{{item.asin ? item.asin :"-"}}</span>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :span="5">
                                    <div class="grid-content bg-purple">
                                        <el-button size='mini' type="primary" plain @click='deleteItem(index)'>删除</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                    <NonePage v-else ></NonePage>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
	props:{
		//可视高度
		viewHeight:{
			default: '600px'
		}
	},
    data() {
        return {
            btnText:"降序",
            inputVal:"",
            pageNumber:1,
            pageSize:10,
            tableData:'',
            total:null,
            loading:false,

            addData:[],
            oldPushId:[],
        };
    },
    methods: {
        getDatas(v){
            this.loading = true
            this.$api['productList']({
                sellerId : this.sellerId,
                siteId : this.siteId,
                productStatus:0,
                pageNumber:this.pageNumber,
                pageSize:this.pageSize,
                asin:this.inputVal,
                ...v
            })
            .then(data => {
                //console.log(data);
                this.loading = false
                this.tableData = data.rows
                this.pageNumber = data.pageNo
                this.pageSize = data.pageSize
                this.total = data.total

                 this.tableData.forEach(i=>{
                     if(i.childList){
                        if(this.oldPushId.includes(i.productId)){
                            i.parentDisabled = true
                            i.childDisabled = true
                        }else{
                            let parentId = i.productId
                            let childLength = i.childList.length
                            let num = 0
                            this.addData.forEach(k=>{
                                if( k.parentId === parentId){
                                    num++
                                }
                            });
                            if(num){
                                i.parentDisabled = true
                            };
                            if( num === childLength ){
                                i.childDisabled = true
                            }else{
                                i.childDisabled = false
                            }   
                        }
                     }else{
                        if( this.oldPushId.includes(i.productId)){
                            i.parentDisabled = true
                        }
                     }
                 })


            }).catch(() => {})
        },
        HandleSizeChange(v){
            this.pageNumber = 1
            this.pageSize = v
            this.getDatas()
        },
        HandleCurrentChange(v){
            this.pageNumber = v
            this.getDatas()
        },
        search(){
            if( this.inputVal ){
                this.pageNumber = 1
                this.getDatas()
            }
        },
        clear(){
            this.pageNumber = 1
            this.getDatas()
        },
        sortBtn(){
            if( this.btnText === '降序'){
                this.btnText = '升序'
                this.getDatas({
                    sortField:"create_time",
                    sort:0
                })
            }else{
                this.btnText = '降序'
                this.getDatas({
                    sortField:"create_time",
                    sort:1
                })
            }
        },
        addAll(){
            this.tableData.forEach(i=>{
                i.parentDisabled = true
                i.childDisabled = true
                if( !this.oldPushId.includes(i.productId)){
                    this.addData.push(i)
                    this.oldPushId.push(i.productId)
                }   
                // if(i.childList){
                //     needPush = i.childList
                // }else{
                //     needPush = i
                // };
                // if(Object.prototype.toString.call(needPush) === '[object Array]' ) {
                //     needPush.forEach(i=>{
                //         if( !this.oldPushId.includes(i.productId)){
                //             this.addData.push(i)
                //             this.oldPushId.push(i.productId)
                //         }   
                //     })
                // }else{
                //     if( !this.oldPushId.includes(needPush.productId)){
                //         this.addData.push(needPush)
                //         this.oldPushId.push(needPush.productId)
                //     }   
                // }
            })
        },
        addItem(index){
            this.tableData[index].parentDisabled = true
            this.tableData[index].childDisabled = true
            let data = this.tableData[index] ;
            if( !this.oldPushId.includes(data.productId)){
                this.addData.push(data)
                this.oldPushId.push(data.productId)
            }  
        },
        addChildList(index){
            let data = this.tableData[index].childList ;
            this.tableData[index].parentDisabled = true
            this.tableData[index].childDisabled = true
            data.forEach(i=>{
                if( !this.oldPushId.includes(i.productId)){
                    i.parentId = this.tableData[index].productId
                    this.addData.push(i)
                    this.oldPushId.push(i.productId)
                }   
            })
        },
        deleteItem(index){
            let currentData = this.addData[index]
            //console.log(currentData);
            this.addData.splice(index,1)
            this.oldPushId.splice(index,1)
            if(currentData.childList){
                let current;
                getSameId(this.tableData)
                //console.log(current);
                function getSameId(data){
                    data.forEach(i=>{
                        if( i.productId === currentData.productId){
                            current = i
                            return 
                        };
                        if(i.childList){
                            getSameId(i.childList)
                        }
                    })
                }
                current.parentDisabled = false
                current.childDisabled = false
            }else{
                let parentId = currentData.parentId
                if( parentId ){
                    let num = 0
                    this.addData.forEach(i=>{
                        if( i.parentId === parentId){
                            num ++
                        }
                    })
                    if( !num ){
                        this.tableData.forEach(i=>{
                            if( i.productId === parentId){
                                i.parentDisabled = false
                                i.childDisabled = false
                                return
                            }
                        })
                    }else{
                        this.tableData.forEach(i=>{
                            if( i.productId === parentId){
                                i.childDisabled = false
                                return
                            }
                        })
                    }
                }else{
                    let productId = currentData.productId;
                    this.tableData.forEach(i=>{
                        if( i.productId === productId){
                            i.parentDisabled = false
                            i.childDisabled = false
                            return
                        }
                    })
                }
            }

        },
        deleteAll(){
            this.addData = []
            this.oldPushId = []
            this.tableData.forEach(i=>{
                i.parentDisabled = false
                i.childDisabled = false
            })
        },


    },
    created() {
        if(this.sellerId && this.siteId){
            this.getDatas()
        }   
    },
    watch:{
        sellerData(){
            if(this.sellerId && this.siteId){
                this.getDatas()
            }  
        },
        oldPushId(b){
            // console.log(b);
            this.$emit('update:productIds',b)
        }
    }

};
</script>

<style scoped lang="less">
.par-div{
    margin: 20px 0 ;
}
.border-top{
    border-top :1px solid #dcdcdc;
    margin-top: 10px;
    padding: 6px 0 ;
}
.imgItem{
    width: 80px;
    height: 60px;
    margin:0 auto;
}
.img{
    width:100%;
    height:100%;
    display: block;
    object-fit: contain;
    margin:0 auto;
}
.title-p{
    color:#409eff;
    font-size: 12px;
    word-break: break-all;
    margin: 0;
    padding: 0;
}
</style>

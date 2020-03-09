<template lang="html">
    <div style="padding-bottom: 20px;" v-loading="loading" element-loading-text="拼命加载中...">
        <el-table :data="storeList" border class="table_list" @sort-change="sort" :default-sort="defaultSort">
            <el-table-column  label="序号" width="50" align="center">
                 <template slot-scope="scope">
                     {{(scope.$index + 1) + (currentPage-1) * pageSize }}
                 </template>
            </el-table-column>
            <el-table-column label="店铺名" align="center" width="130">
                <template slot-scope="scope">
                    <el-button type="text" style="color:#30cc7b;">
                        <router-link :to="{ path: 'shop/ShopAnalysis/ShopChart', query: {sellerId:scope.row.sellerId} }">{{scope.row.sellerName}}</router-link>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="noSalesNewReviewCnt" label="无跟卖产品新增评价数" align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.noSalesNewReviewCnt | toThousands}}
                </template>
            </el-table-column>
            <el-table-column prop="newReviewCnt" label="店铺新增评价数" align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.newReviewCnt | toThousands}}
                </template>
            </el-table-column>
            <el-table-column prop="newReviewCntRate" label="店铺新增评价数整长率"  align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.newReviewCntRate | percent}}
                </template>
            </el-table-column>
            <el-table-column prop="reviewCnt" label="店铺总评价数" width="130" align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.reviewCnt | toThousands}}
                </template>
            </el-table-column>
            <el-table-column prop="categoryCnt" label="类目数" width="100" align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.categoryCnt | toThousands}}
                </template>
            </el-table-column>
            <el-table-column prop="productCnt" label="产品数" width="100" align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.productCnt | toThousands}}
                </template>
            </el-table-column>
            <el-table-column prop="openTime" label="开店时间" width="120" align="center" sortable/>
            <el-table-column prop="shopStarCnt" label="店铺评分" width="110" align="center" sortable/>
            <el-table-column prop="fbpFlag" label="产品发货方式" width="110" align="center">
                <template  slot-scope="scope">
                    {{scope.row.fbpFlag | status}}
                </template>
            </el-table-column>
            <el-table-column prop="positiveRate" label="好评率" width="90" align="center" sortable>
                <template  slot-scope="scope">
                    {{scope.row.positiveRate | percent}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="70">
                <template slot-scope="scope">
                    <el-tooltip content="去SOUQ平台看看" placement="top">
                          <a :href="scope.row.sellerUrl"  target="_blank">
                              <img src="../../base/icon/u2340.png" width="24" height="24" class="imghiti">
                          </a>
                    </el-tooltip>
                </template>
            </el-table-column>

            <div slot="empty">
              <none-page no-back>暂无数据</none-page>
            </div>
        </el-table>

        <el-pagination
            class="page_pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20,40, 60]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
</template>

<script>
import NonePage from "@/components/common/NonePage";
export default {
    data() {
        return {
            defaultSort:{
                prop: 'newReviewCnt',
                order: 'descending'
            },
            storeList:[],
            currentPage:null,
            pageSize:null,
            total:null,
            loading:true,
            sortMindful:'newReviewCnt desc'
        }
    },
    components:{
      NonePage
    },
    filters:{
        toThousands(num){
            return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        },
        percent(val){
            return (val*100) + "%"
        },
        status(val){
            let str;
            if(val==0)str = "自发货";
            if(val==1)str = "平台发货";
            if(val==2)str = "自发货/平台发货";
            return str
        }
    },
    methods: {
        //排序
        sort({ column, prop, order }){
            let obj = { column, prop, order }
            //升序
            if(obj.order == 'ascending'){
                this.sortMindful = obj.prop + ' ' +'asc'
            //降序
            }else if(obj.order == 'descending'){
                this.sortMindful = obj.prop + ' ' +'desc'
            //随机
            }else{
               //  if(this.$route.query.category){
               //     this.getTableList({...this.CommonParams(),category: this.$route.query.category})
               //     return
               //  }
               // this.getTableList(this.CommonParams())
            }
            let needed = {
                sort:this.sortMindful
            }
            if(needed.sort){
                let params = this.CommonParams()
                if(this.$route.query.category){
                    params = Object.assign({},params,{
                        category: this.$route.query.category
                    })
                }
                params = {...params,...needed}
                this.loading = true;
                this.getTableList(params)
            }
        },
        //
        CommonParams (pageNumber=1,pageSize=10,sort='newReviewCnt desc'){
            return {
                minDate:this.$route.query.minDate,
                maxDate:this.$route.query.maxDate,
                minNewReviewCnt:this.$route.query.minNewReviewCnt,
                maxNewReviewCnt:this.$route.query.maxNewReviewCnt,
                pageNumber,
                sort,
                pageSize
            };
        },
        //获取列表数据
        getTableList(params){
            this.$axios.post('/shop/list',params).then(res=>{
                if(res.data.code==500){
                    this.$message.error(res.data.msg)
                    return;
                }
                this.loading = false,
                this.pageSize = res.data.pageSize
                this.total = res.data.total
                this.currentPage = res.data.pageNo
                this.storeList = res.data.rows;
            })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.loading = true
            let params = this.CommonParams(this.currentPage,val,this.sortMindful)
            if(this.$route.query.category){
                params = {...params,category: this.$route.query.category}
            }
            this.getTableList(params)
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.loading = true
            let params = this.CommonParams(val,this.pageSize,this.sortMindful)
             if(this.$route.query.category){
                 params = Object.assign({},params,{
                     category: this.$route.query.category
                 })
             }
            this.getTableList(params)
        },

    },
    mounted() {
        this.$route.meta.name = this.$route.query.mytitle;
        let params = this.CommonParams()
        if(this.$route.query.category){
            params = Object.assign({},params,{
                category: this.$route.query.category
            })
        }
        this.getTableList(params)
    }
}
</script>

<style lang="scss" scoped>
    // .storelist{
    //     position: absolute;
    //     top: 0;right: 0;
    //     left: 0;bottom: 0;
    //
    //     background: #ccc;
    // }
    .page_pagination{
        text-align: center;
        margin-top: 60px;
    }
    .imghiti{
        cursor: pointer;
    }
    .table_list{
        width: 100%;
        min-height: 600px;
    }
</style>

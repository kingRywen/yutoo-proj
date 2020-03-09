<template lang="html">
  <div style="padding-bottom: 20px;" v-loading="loading" element-loading-text="拼命加载中...">
      <el-table :data="storeList" border class="table_list"  @sort-change="sort" :default-sort="defaultSort">
          <el-table-column type="index" label="排名" width="80" align="center">
              <template slot-scope="scope">
                  {{(scope.$index + 1) + (currentPage-1) * pageSize }}
              </template>
          </el-table-column>
          <el-table-column label="主图" align="center" width="100">
              <template slot-scope="scope">
                  <img :src="scope.row.imageUrl || '../../base/icon/login.gif'" width="71" height="79"/>
              </template>
          </el-table-column>
          <el-table-column label="标题" align="center">
              <template slot-scope="scope">
                  <router-link :to="{ path: 'product/ProductAnalysis/ProductChart', query: {sku:scope.row.sku} }" tag="p" class="title">
                     {{scope.row.title}}
                  </router-link>
              </template>
          </el-table-column>
          <el-table-column prop="newReviewCnt" label="新增评价数" align="center" sortable>
              <template slot-scope="scope">
                    {{scope.row.newReviewCnt | toThousands}}
              </template>
          </el-table-column>
          <el-table-column prop="reviewCnt" label="评价总数" align="center" sortable>
              <template slot-scope="scope">
                    {{scope.row.reviewCnt | toThousands}}
              </template>
          </el-table-column>
          <el-table-column prop="starCnt" label="评分" align="center" sortable width="80">
              <template slot-scope="scope">
                    {{scope.row.starCnt | toThousands}}
              </template>
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120" align="center" sortable/>
          <el-table-column prop="releaseDate" label="上架时间" width="120" align="center" sortable/>
          <el-table-column  label="发货方式" width="80" align="center">
              <template slot-scope="scope">
                    {{scope.row.fbpFlag | status}}
              </template>
          </el-table-column>
          <el-table-column prop="sellerCnt" label="跟卖人数" width="120" align="center" sortable>
              <template slot-scope="scope">
                    {{scope.row.sellerCnt | toThousands}}
              </template>
          </el-table-column>
          <el-table-column prop="skuCnt" label="子SKU数" width="120" align="center" sortable>
              <template slot-scope="scope">
                    {{scope.row.skuCnt | toThousands}}
              </template>
          </el-table-column>

          <el-table-column  prop="newReviewCntRate" label="新增评价数增长率" width="160" align="center" sortable>
              <template slot-scope="scope">
                    {{scope.row.newReviewCntRate | percent}}
              </template>
            </el-table-column>
          <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                  <el-tooltip content="去SOUQ平台看看" placement="top">
                         <a :href="scope.row.productUrl" target="_blank">
                             <img src="../../base/icon/u2340.png" width="24" height="24" class="imghiti">
                         </a>
                  </el-tooltip>
                 <el-tooltip content="下載" placement="top">
                      <img src="../../base/icon/u2342.png" width="24" height="24" class="imghiti">
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
        :page-sizes="[10, 20, 40, 50]"
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
        loading:true,
        storeList: [],
        currentPage: null,
        pageSize:null,
        total:null,
        defaultSort:{
            prop: 'newReviewCnt',
            order: 'descending'
        },
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
          if(val==null)return "0%"
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
        let sort = null;
        //升序
        if(obj.order == 'ascending'){
            this.sortMindful = obj.prop + ' ' +'asc'
        //降序
        }else if(obj.order == 'descending'){
            this.sortMindful = obj.prop + ' ' +'desc'
        //随机
        }else{
            if(this.$route.query.category){

            }
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
    CommonParams(pageNumber=1,pageSize=10,sort="newReviewCnt desc"){
        return {
            "minDate":this.$route.query.minDate,
            "maxDate":this.$route.query.maxDate,
            "minNewReviewCnt":this.$route.query.minNewReviewCnt,
            "maxNewReviewCnt":this.$route.query.maxNewReviewCnt,
            sort,
            pageNumber,
            pageSize,
        }
    },
    //获取商品列表数据
    getTableList(params) {
        this.$axios.post('/product/list',params).then(res=>{
            if(res.data.code==500){
                this.$message.error(res.data.msg)
                return
            }
            this.loading = false;
            let data = res.data.rows;
            this.pageSize = res.data.pageSize
            this.currentPage = res.data.pageNo
            this.total = res.data.total
            data.forEach(item=>{
                item.imageUrl = item.imageUrl.replace('_SR38,50_','_SR150,150_');
            })
            this.storeList = data
        })
    },
    handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.loading = true
        let params = this.CommonParams(this.currentPage,val,this.sortMindful)
        if(this.$route.query.category){
            params = Object.assign({},params,{
                category: this.$route.query.category
            })
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
    toThousands(num){
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    },
  },
  mounted() {
    this.$route.meta.name = this.$route.query.mytitle;
    let params  = this.CommonParams()
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
.title {
    margin: 0;
    padding: 0;
    font-size: 14px;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    cursor: pointer;
    &:hover{
        color:#30cc7b;
        font-weight: 600;
    }
}
.page_pagination {
    text-align: center;
    margin-top: 60px;
}
.imghiti {
    cursor: pointer;
    margin-right: 10px;

}
.table_list {

    width: 100%;
    min-height: 600px;
}
</style>

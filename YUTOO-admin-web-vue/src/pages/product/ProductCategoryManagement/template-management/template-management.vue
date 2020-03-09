
<template lang="html">
    <div class="template">
        <el-tabs type="border-card" class="tabs" v-model="activePlatform" @tab-click="handlePlatform">
            <el-tab-pane :label="item.platformName" :name="item.platformSign" v-for="item in platformList">
                <templateList
                    :loading="loading"
                    :siteList="siteList"
                    :categoryList="categoryList"
                    :tempList="tempList"
                    @select="select"/>
                <el-pagination
                    v-if="item.platformSign==activePlatform"
                    class="tempPagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10,30,80,120]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {getData} from "@/common/http.js";
import TemplateList from './template-list.vue'
export default {
    data() {
        return {
            platformList:[],
            siteList:[],
            categoryList:[],
            tempList:[],
            total: 50,
            pageSize: null,
            currentPage: null,


            activePlatform:"Amazon",
            siteId:null,
            loading:true,
        }
    },
    mounted(){
        this.getPlatformList()

    },
    watch:{
        activePlatform(val){
            this.platformList.forEach(item=>{
                if(item.platformSign == val){
                    this.siteList = item.siteList
                }
            })
        }
    },
    methods:{
        //搜索
        select(val){
            console.log(val)
            let params = {
                "pageSize": 10,
                "pageNumber":1,
                "platformKey":this.activePlatform,
                categoryId:this.$route.params.categoryId
            }
            this.getTemplateList(Object.assign({},params,val))
        },
        //切换平台
        handlePlatform(tab){
            this.getTemplateList()
        },
        handleSizeChange(val) {
            this.loading = true;
            let params = {
                "pageSize": val,
                "pageNumber": this.currentPage,
                "platformKey":this.activePlatform,
                categoryId:this.$route.params.categoryId
            }
            this.getTemplateList(params)
        },
        handleCurrentChange(val) {
            this.loading = true;
            let params = {
                "pageSize": this.pageSize,
                "pageNumber": val,
                "platformKey":this.activePlatform,
                categoryId:this.$route.params.categoryId
            }
            this.getTemplateList(params)
        },
        //获取平台列表
        getPlatformList(){
            getData("platform/list/platform/site").then(res=>{
                if(res.data.code==0){
                   this.platformList = res.data.rows;
                   this.siteList = this.platformList[0].siteList
                   this.getTemplateList()
                }else{
                   this.$message.error(res.data.msg)
                }
            })
        },
        //根据平台=>获取模板列表
        getTemplateList(params={"pageSize": 10,"pageNumber": 1,"platformKey":this.activePlatform,categoryId:this.$route.params.categoryId}){
            getData("CatePltTemplateM/list",params).then(res=>{
                this.loading = false;
                if(res.data.code==0){
                    this.tempList = res.data.page.rows;
                    this.pageSize = res.data.page.pageSize
                    this.currentPage = res.data.page.pageNo
                    this.total = res.data.page.total
                    this.tempList.forEach(i=>{
                        this.siteList.forEach(j=>{
                            if(i.siteId == j.siteId){
                                i['siteImg'] = j.banner
                                i['siteName'] = j.siteNameZh
                            }
                        })
                    })
                }else{
                   this.$message.error(res.data.msg)
                }
            })
        },
    },
    components:{
        TemplateList
    }
}
</script>

<style lang="scss" scoped>
    .tabs{
        box-shadow: 0 0 0 0;
    }
    .tempPagination{
        text-align: center;
        margin-top: 20px;
    }

</style>

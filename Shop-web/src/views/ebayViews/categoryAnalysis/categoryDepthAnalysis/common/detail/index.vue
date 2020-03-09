<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click='tabClick'>
            <el-tab-pane label="卖家分析" name="first" :lazy='true'>
				<keep-alive>
					<seller-analysis :parentParams='parentParams' />
				</keep-alive>
            </el-tab-pane>
            <el-tab-pane label="产品分析" name="second" :lazy='true'>
				<keep-alive>
					<product-analysis :parentParams='parentParams' />
				</keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import sellerAnalysis from './common/sellerAnalysis.vue'
import productAnalysis from './common/productAnalysis.vue'
export default {
    data() {
        return {
            activeName:"first",
			parentParams:{
				taskId:null,
			}							
        };
    },
	methods:{
		tabClick(){
			
		}
	},
    created() {
		this.$nextTick(function(){
			this.parentParams.taskId = this.$route.query.taskId
		})
		
    },
    components:{
		sellerAnalysis,
		productAnalysis
    },

};
</script>

<style scoped lang="less">
.el-tabs {
  box-shadow: 0 0 0 0;
  /deep/.el-tabs__content {
    padding: 15px 0 0 0;
  }
}
</style>


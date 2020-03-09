<template>
    <div>
        <el-tabs v-model="activeName" @tab-click='tabClick' type="card">
            <el-tab-pane :label="allBrandName" name="first" :lazy='true'>
				<keep-alive>
					<all-brands />
				</keep-alive>
            </el-tab-pane>
            <el-tab-pane :label="screenedName" name="second" :lazy='true' v-if="isAdmin">
				<keep-alive>
					<screened-brands :sereenedNum='sereenedNum' />
				</keep-alive>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import allBrands from './common/common/allBrands.vue'
import screenedBrands from './common/common/screenedBrands.vue'
import storage from "Utils/saver";
export default {
    data() {
        return {
            activeName:"first",
			parentParams:{
				taskId:null,
			},
			allBrandName:'所有品牌',
			screenedName:'待筛选品牌',
			isAdmin:null,
			sereenedNum:0,
			onceSend:true,
        };
    },
	methods:{
		tabClick(){
			
		},
		getLIstCount(){
			this.$api['brandManageListCount']().then((e)=>{
				if (e.code === 0) {
					e.data.forEach((e)=>{
						if (e.pageType === 0){
							this.allBrandName = `所有品牌(${e.total})`
							
						}
						if (e.pageType === 1){
							this.screenedName = `待筛选品牌(${e.total})`
							if (this.onceSend) this.sereenedNum = e.total
							this.onceSend = false
						}
					})
				}
			})
		},		
	},
    components:{
		allBrands,
		screenedBrands
    },
	created(){
		if(this.$route.params.isSecond) this.activeName = 'second'
		this.isAdmin = storage.get('local','isAdmin')
		this.getLIstCount()		
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


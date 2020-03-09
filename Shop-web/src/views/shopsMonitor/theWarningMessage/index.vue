<template>
  <div>
    <div v-if='$route.name==="theWarningMessage"'>
      <el-tabs v-model="activeName" @tab-click='tabClick' type="card">
		<el-tab-pane v-for="item in tabNameList" :name="item.rank" :lazy='true'>
			<div slot="label">{{item.name}}</div>
		</el-tab-pane>	  
      </el-tabs>
	  <main-view ref="child"/>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import mainView from './mainView.vue'
export default{
	data(){
		return{
			tabNameList:[
				{name:'信用卡失效',rank:'first'},
				{name:'政策违规',rank:'second'},
				{name:'收款账户发生变化',rank:'three'},
				{name:'退货率过高',rank:'four'},
				{name:'产品标题错误',rank:'five'},
				{name:'产品价格错误',rank:'six'},
				{name:'信用卡变更',rank:'seven'},
			],
			activeName:this.$route.params.name || 'first',
			oldName:this.$route.params.name || 'first',
		}
	},
	methods:{
		tabClick(e){
			if(this.oldName !== this.activeName){
				this.$refs.child.getView(this.activeName)
				// this.$refs.child.$refs.layout.clearSearchData()		
				this.$refs.child.$refs.layout.resetSort()	
				this.oldName = this.activeName
			}			
		},
		getTab(){
			let params = {platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId}
			this.$api['homePerformanceNoticeCnt'](params).then((res)=>{
				if(res.code == 0){
					let data = res.data
					let list = this.tabNameList
					data.forEach((e)=>{
						switch(e.noticeType){
							case 0:
								list[0].name = `信用卡失效(${e.wornCnt})`
							break;
							case 1:
								list[1].name = `政策违规(${e.wornCnt})`
							break;
							case 2:
								list[2].name = `收款账户发生变化(${e.wornCnt})`
							break;
							case 3:
								list[3].name = `退货率过高(${e.wornCnt})`
							break;
							case 4:
								list[4].name = `产品标题错误(${e.wornCnt})`
							break;
							case 5:
								list[5].name = `产品价格错误(${e.wornCnt})`
							break;
							case 6:
								list[6].name = `信用卡变更(${e.wornCnt})`
							break;
						}
					})
				}
			})
		}
	},
	components:{
		mainView
	},
	created(){
		//跳转过来执行时间的请写在这里
	},
	mounted(){
		this.getTab()
	},
}
</script>

<style>
</style>

<template>
	<div class="mainContent" v-loading.fullscreen.lock="mainLoading">
		<series1 ref="child1" @changeChild1 = 'changeChild1' v-if="!$route.query.objectId" />
		<series2 ref="child2"  v-if="!$route.query.objectId" />
		<group1 ref="child3" />
		<group2 ref="child4" />
		<product1 ref="child5" />
		<type1 ref="child6" v-if="isShowPut" @changeChild6 = 'changeChild6'  />
		<keyword-put1 ref="child7" v-if="isShowPut && isShowKeywordType === '1'" @changeChild7 = 'changeChild7' @changeChild71 = 'changeChild71' :productIds = 'productIds' />
		<keyword-put2 ref="child8" v-if="isShowKeywordType === '1'" />
		<product-put1 ref="child9" v-if="isShowPut && isShowKeywordType === '2'" />
		<product-put2 ref="child10" v-if="isShowPut && isShowKeywordType === '2'" />
		<div style="text-align: center;">
			<el-button @click="submit" type="primary" size="small">确定投放广告</el-button>
			<el-button @click="cancel" type="primary" size="small" plain>取消</el-button>
		</div>		
	</div>
</template>

<script>
	import series1 from './component/series1.vue'
	import series2 from './component/series2.vue'
	import group1 from './component/group1.vue'
	import group2 from './component/group2.vue'
	import product1 from './component/product1.vue'
	import type1 from './component/type1.vue'
	import keywordPut1 from './component/keywordPut1.vue'
	import keywordPut2 from './component/keywordPut2.vue'
	import productPut1 from './component/productPut1.vue'
	import productPut2 from './component/productPut2.vue'
	export default {
		data(){
			return {
				isShowPut:false,
				isShowKeywordType:'1',
				mainLoading:false,
				productIds:[],
			}
		},
		methods:{
			submit(){
				//child6不用
				let {child1,child2,child3,child4,child5,child7,child8,child9,child10} = this.$refs
				let forms = [child1,child2,child3,child4,child5,child7,child8,child9,child10].filter(e=>e!=null)
				return Promise.all(forms.map(e=>e.validateFn())).then((res)=>{
					this.mainLoading = true
					console.log(res)
					
					let params = {}
					if(this.$route.query.objectId){
						params = {
							...this.storeIds,
							campaignId:this.$route.query.objectId,
							adGroup:{...res[0],...res[1].obj1},
							adGroupStrategy:res[1].adGroupStrategy || null,
							productIds:res[2],
							keywords: child7 ? res[3] : null,
							negativeKeywords: child8 ? this.isShowPut ? res[4] : res[3] : null,
							adTarget:child9 ? res[3] : null,
							negativeTarget:child10 ? res[4] : null
						}
					}else{
						params = {
							...this.storeIds,
							adCampaign:{...res[0].adCampaign,...res[1]},
							adCampaignStrategy:res[0].adCampaignStrategy || null,
							adGroup:{...res[2],...res[3].obj1},
							adGroupStrategy:res[3].adGroupStrategy || null,
							productIds:res[4],
							keywords: child7 ? res[5] : null,
							negativeKeywords: child8 ? this.isShowPut ? res[6] : res[5] : null,
							adTarget:child9 ? res[5] : null,
							negativeTarget:child10 ? res[6] : null
						}
					}
					console.log(params)
					return this.$api[`${this.$route.query.objectId ? 'adGroupSave' : 'adCampaignSave'}`](params).then(()=>{
						this.mainLoading = false
						this.$router.go(-1)
						console.log('成功啦')
					}).catch(()=>{
						this.mainLoading = false
					})
				})
			},
			cancel(){
				this.$router.go(-1)
			},
			changeChild1(e){
				this.isShowPut = e==='auto' ? false : true
			},
			changeChild6(e){
				this.isShowKeywordType = e
			},
			changeChild7(){
				let [...arr1] = this.$refs.child5.oldPushId
				this.productIds = arr1
			},
			changeChild71(data){
				this.$refs.child8.getOuterData(data)
			}
		},
		components:{
			series1,series2,group1,group2,product1,type1,keywordPut1,keywordPut2,productPut1,productPut2
		},
		mounted(){
			if(this.$route.query && this.$route.query.targetingType === 'manual') this.isShowPut = true
			if(this.$route.query && this.$route.query.keyType){
				this.$refs.child1.formData.targetingType = 'manual'
				this.isShowPut = true
			} 
		}
	}
</script>

<style lang="less" scoped>
	.mainContent{
		*{
			margin-bottom: 20px;
		}
	}
</style>

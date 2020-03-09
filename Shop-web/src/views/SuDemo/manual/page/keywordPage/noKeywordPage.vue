<template>
	<div>
		<div v-if='$route.name==="newAdKeyword"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:editBtns="editBtns"
				:columns="columns"	
				:showWdg = 'false'
				:url="$route.query.adGroupFlag == 1 ? 'adNegativeTargetList' : 'adNegativeKeywordList'"
				ref="layout"
			></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				edits:[],
				searchFields:[
					{
						label:'关键词',
						name:'keyword',
						type:'input',
						labelWidth:'50px',
						placeholder:'请输入关键词',
					},
				],
				editBtns:[
					{
						name:'添加否定词',
						fn: ()=>{
							
							if(vm.$route.query.adGroupFlag == 1){
								vm.$refs.layout.$dialog({
									title: "添加否定词",
									width:'600px',
									params: {
										adGroupId:vm.outerParams.adGroupIds
									},
									component: () => import('Views/SuDemo/manual/dialogs/main/new/addKeyword.vue'),
									okBtnText:'确认',
									cancelBtnText:'取消'
								});
							}else{
								vm.$refs.layout.$dialog({
									title: "添加否定词",
									width:'600px',
									params: {},
									component: () => import('Views/SuDemo/manual/dialogs/main/keyword/noKeyword/add.vue'),
									okBtnText:'确认',
									cancelBtnText:'取消'
								});
							}
							
							
						}
					},
					{
						name:'删除',
						disabled:selection => {
							return selection.length === 0
						},
						fn: ()=>{
							let params = { ...vm.storeIds }
							if(this.$route.query.adGroupFlag == 1) params.targetIds = vm.getSelection().map(e=>e.targetId)
							if(this.$route.query.adGroupFlag == 0) params.keywordIds = vm.getSelection().map(e=>e.keywordId)
							vm.$confirm('此操作将删除关键词,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api[`${this.$route.query.adGroupFlag == 1 ? 'adNegativeTargetRemove' : 'adNegativeKeywordRemoveKeyword'}`](params).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})
						}
					},
				],
				columns:[
					{
						label:'关键词',
						value:`${this.$route.query.adGroupFlag == 1 ? 'keyword' : 'keywordText'}`,
						align:'left',
						minWidth:400,	
					},
					{
						label:'匹配类型',
						value:`matchType`,
						isShow:this.$route.query.adGroupFlag == 1 ? true : false,
						enum:{
							'negativeExact' : '精确否定',
							'negativePhrase' : '词组否定'
						}
					},
				]
			}
		},
		methods:{
			
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					adGroupIds:[this.$route.query.objectId] || null
				}
			},
		}
	}
</script>


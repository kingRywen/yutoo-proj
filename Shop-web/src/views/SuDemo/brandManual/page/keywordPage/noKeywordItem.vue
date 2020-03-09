<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"	
			:showWdg = 'false'
			url="adNegativeKeywordBrandList"
			ref="layout"
		></MainLayout>
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
						label:'否定词',
						name:'keyword',
						type:'input',
						labelWidth:'50px',
						placeholder:'请输入否定词',
					},
					{
						label:'匹配方式',
						name:'matchType',
						type:'select',
						placeholder:'请选择匹配方式',
						options:[
							{label:'精确否定',value:'negativeExact'},
							{label:'词组否定',value:'negativePhrase'},
						]
					},
				],
				editBtns:[
					{
						name:'添加否定词',
						fn: ()=>{
							vm.$refs.layout.$dialog({
								title: "添加否定词",
								width:'600px',
								params: {
									campaignId:vm.outerParams.campaignId
								},
								component: () => import('Views/SuDemo/brandManual/dialogs/noKeyword/add.vue'),
								okBtnText:'确认',
								cancelBtnText:'取消'
							});
						}
					},
					{
						name:'删除',
						disabled:selection => {
							return selection.length === 0
						},
						fn: ()=>{
							let data = vm.getSelection().map(e=>e.keywordId)
							let params = {
								...vm.storeIds,
								keywordIds:data
							}
							vm.$confirm('此操作将删除否定词,是否继续','提示',{type:'warning'}).then(()=>{
								vm.$api['adNegativeKeywordBrandRemove'](params).then(()=>{
									vm.getLayoutList()
								})
							}).catch(()=>{})
						}
					},
				],
				columns:[
					{
						label:'否定词',
						value:'keywordText',
						align:'left',
						minWidth:400,	
					},
					{
						label:'匹配方式',
						value:'matchType',
						enum:{
							"negativeExact":'精确否定',
							'negativePhrase':'词组否定'
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
					campaignId:this.$route.query.objectId || null
				}
			},
		}
	}
</script>


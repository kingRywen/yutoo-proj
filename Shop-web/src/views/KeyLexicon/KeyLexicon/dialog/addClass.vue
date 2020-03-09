<template>
	<div>
		<MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:searchFunc='searchFunc'
			url="keywordClassifyList"
			ref="layout"
		></MainLayout>
	</div>
</template>

<script>
	export default{
		props:['params'],
		data(){
			let vm = this
			return{
				edits:[],
				searchFields:[				
					{
						label:'分类属性名称',
						name:'classifyName',
						type:'input',
						placeholder:'请输入名称',
						labelWidth:'85px'
					},
					{
						label:'创建时间',
						name:'time',
						type:'dateRange'
					},
				],
				editBtns:[
					{
						name:'添加分类属性',
						fn: ()=>{
							vm.$refs.layout.$dialog({
								title:'添加分类属性',
								width: '500px',
								appendToBody:true,
								params:{
									siteId:vm.siteId,
									...vm.outerParams
								},
								component: () => import(`./addClassItem.vue`),
								okBtnText:'确认',
								cancelBtnText:'取消'
							})
						}
					},
				],
				columns:[
					{
						label:'分类属性名称',
						value:'classifyName',
						align:'left',
					},
				]
			}
		},
		methods:{
			searchFunc(data) {
			  let { time, ...info } = data;
			  let [startTime, endTime] = time || [];
			  return { startTime, endTime, ...info };
			},
			_submit(){
				if(this.getSelection().length){
					if(this.getSelection().length == 1){
						console.log(this.getSelection())
						let params = {
							...this.params,
							siteId:this.siteId,
							classifyId:this.getSelection()[0].classifyId,
							classifyName:this.getSelection()[0].classifyName					
						}
						return this.$api[`keywordClassifySave`](params)
					}else{
						return this.$message.warning('只能选择一项分类属性')
					}				
				}else{
					return this.$message.warning('请勾选分类属性')
				}
				
			},
		},
		computed: {
			outerParams(){
				return {
					cusCateId:this.params.cusCateId,
					productId:this.params.productId,
				}
			},
		}
	}
</script>


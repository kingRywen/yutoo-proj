<template>
	<div>
		<div v-if="$route.name==='ebayCategoryDepthAnalysis'">
		 <MainLayout
			:outerParams="outerParams"
			:edits="edits"
			:searchFields="searchFields"
			:editBtns="editBtns"
			:columns="columns"
			:searchFunc = 'searchFunc'
			@selectChange='selectChange' 
			ref="layout"
			url="ebTaskCateDepthAysList"
		  ></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				selectList:[],
				edits:[
					{
						name:'查看详情',
						icon:'el-icon-search',
						show:scope=>{
							return scope.row.status === 2
						},
						fn:scope=>{
							return this.$router.push({
								name:'ebayCategoryDepthAnalysisDetail',
								query:{taskId:scope.row.taskId}
							})
						}
					},
					{
						name:'删除',
						icon:'el-icon-delete',
						fn: scope=>{
							this.delBtnItem(scope.row.taskId)
						}
					},
				],
				searchFields:[
					{
						label:'类目',
						name:'categorys',
						type:'cascader',
						placeholder:'请选择类目',
						width:320,
						bind:{
							label:'name',
							value:'name',
							children:'childs',
							enabled:'enabled'
						},
						options:this.getCategory,
						labelWidth:'40px'
					},
				],
				editBtns:[
					{
						name:"添加类目",
						fn: () => {
						  this.$refs.layout.$dialog({
						    title: '添加类目',
						    size: 'medium',
						    params: { edit: true },
						    component: () => import('./common/addDialog.vue'),
						    okBtnText: '确认'
						  })
						}
					},
					{
						name:'删除',
						fn: ()=>{
							this.taskIdsMethod('del')
						}
					},
					{
						name:'抓取数据',
						fn: ()=>{
							this.taskIdsMethod('capture')
						}
					}
				],
				columns:[
					{
						label:'类目',
						value:'category',
						url: 'categoryUrl'						
					},
					{
						label:'添加时间',
						value:'createTime',
						minWidth:150,
					},
					{
						label:'状态',
						value:'status',
						minWidth:150,
						render(h,scope){
							let {status} = scope.row
							return status===0 ? (
								<span>待处理</span>
							) : status===1 ? (
								<span>处理中</span>							
							) : status===2 ? (
								<span>处理成功</span>
							) : (
								<span>处理失败</span>
							)
						}
					},
					{
						label:'结果生成时间',
						value:'resultTime',
						minWidth:150,
					},
				]
			}
		},
		methods:{
			async getCategory(id = [0],selEl,itemDisabled){
				if(!selEl) selEl = {pcid:0};
				let siteId = await this.siteId;
				if(siteId){
					let {pcid} = selEl
					let params = {
						parentPcid:pcid,
						siteId:siteId,
						platformId:this.ebayPlatformId
					}
					return this.$api['ebProductCategoryGetCategory'](params)
						.then(data => {
							if (data && data.code && data.code !== 0) {
								this.$message.error(data.meg)
								return
							}
							return data.data.map(el => {
								return {
									...el,
									childs:el.haveChildren ? [] :null,
									enabled: true,
									isLeaf: !el.haveChildren
								}
							})
						}).catch(()=>{})
				}
			},
			searchFunc(data){
				let {categorys,...info} = data;
				if(categorys){
					let category = categorys.join(':');
					return {category,...info}
				}else{
					return {...info}
				}
			},
			selectChange(v){
				this.selectList = [];
				v.forEach(i => {
				  this.selectList.push(i.taskId)
				});
			},
			taskIdsMethod(e){
				if (this.selectList.length === 0) {
				  this.$message({
					message: "请至少选择一项",
					type: "warning"
				  });
				  return;
				}
				this.$confirm(e==='del'?'此操作将删除,是否继续？':"此操作将抓取数据,是否继续？","提示",{type:'warning'}).then(()=>{
					this.$api[e==='del'?'ebTaskCateDepthAysRemove':"ebTaskCateDepthAysReCrawl"]({
					  taskIds:this.selectList
					})
					  .then(data => {
						if (data.code === 0) {
						  this.$refs.layout.getList();
						}
					  })
				}).catch(()=>{})
			},
			delBtnItem(e){
				this.$confirm('此操作将删除,是否继续？',"提示",{type:'warning'}).then(()=>{
					this.$api["ebTaskCateDepthAysRemove"]({
					  taskIds:[e]
					})
					  .then(data => {
						if (data.code === 0) {
						  this.$refs.layout.getList();
						}
					  })
				}).catch(()=>{})
			},
			
		},
		computed: {
			outerParams(){
				return {
					platformId:this.ebayPlatformId,
					siteId:this.siteId,
				}
			},
		},
		watch:{
			
		}
	}
</script>

<style>
</style>

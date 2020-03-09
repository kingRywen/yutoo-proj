<template>
	<div>
		<el-tabs v-model="activeName" type="card" v-if="areaList.length">
		  <el-tab-pane v-for="item in areaList" :name="item.areaName" :label="item.areaName">
			 <MainLayout
			  	:outerParams="outerParams"
			  	:edits="edits"
			  	:searchFields="searchFields"
			  	:editBtns="editBtns"
			  	:columns="columns"
			  	@selectChange='selectChange' 
			  	ref="layout"
			  	url="sellerAuthList"
			  ></MainLayout>
		  </el-tab-pane>
		</el-tabs>
		
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				selectList:[],
				activeName1: "1",
				activeName:'北美站',
				areaList:[{areaName:'北美站'}],
				edits:[
					{
						name:'编辑',
						icon:'el-icon-edit-outline',
						fn:scope=>{
							this.$refs.layout[0].$dialog({
								title:'编辑店铺',
								width:'600px',
								params:{
									siteId: this.outerParams.siteId,
									areaId: this.outerParams.areaId,
									platformId:this.outerParams.platformId,
									edit:true,
									sellerAuthId:scope.row.sellerAuthId,
									sellerAlias:scope.row.sellerAlias,
								},
								component: () => import("./common/addDialog.vue"),
								okBtnText:'确认',
								cancelBtnText:'取消'
							})
						}
					},
					{
						name:'删除',
						icon:'el-icon-delete',
						fn: scope=>{
							this.delBtnItem(scope.row.sellerAuthId)
						}
					},
					{
						name:'重新授权',
						icon:'el-icon-refresh',
						show:scope => {
							return status !== 2
						},
						fn: scope=>{
							this.resetAuthMethod(scope.row.sellerAuthId)
						}
					}
				],
				searchFields:[
					{
						label:'店铺名称',
						name:'sellerAlias',
						type:'input',
						placeholder:'请输入店铺名称'
					},
					{
						label:'创建时间',
						name: "time",
						type: "dateRange",
						placeholder:'请选择'
					}
				],
				editBtns:[
					{
						name:"添加授权",
						fn:()=>{
							this.$refs.layout[0].$dialog({
								title:'添加店铺',
								width:'600px',
								params:{
									siteId: this.outerParams.siteId,
									areaId: this.outerParams.areaId,
									platformId:this.outerParams.platformId,
								},
								component: () => import("./common/addDialog.vue"),
								okBtnText:'确认',
								cancelBtnText:'取消'
							})
						}
					},
					{
						name:'删除',
						fn: ()=>{
							this.delBtn()
						}
					}
				],
				columns:[
					{
						label:'序号',
						value:'sellerAuthId',
						minWidth:150,
					},
					{
						label:'店铺名称',
						value:'sellerAlias',
						minWidth:150,
					},
					{
						label:'卖家编号',
						value:'sellerId',
						minWidth:150,
					},
					{
						label:'授权时间',
						value:'authTime',
						minWidth:150,
					},
					{
						label:'授权状态',
						value:'status',
						minWidth:150,
						render(h,scope){
							let {status} = scope.row
							return status === 0 ? (
								<span>授权中</span> 
							) : status === 1 ? (
								<span>授权失败</span>
							) : status === 2 ? (
								<span>已授权</span>
							) : (
								<span>授权过期</span>
							)
						}
					},
				]
			}
		},
		methods:{
			resetAuthMethod(e){
				this.$confirm('此操作将重新授权,是否继续？','提示',{type:'warning'}).then(()=>{
					this.$api['sellerAuthReauthorization'](
						{sellerAuthId:e}
					).then(data => {
						if (data.code === 0) {
						  this.$refs.layout[0].getList();
						  this.$refs.layout[0].$dialog({
						  	title:'提示',
						  	width:'600px',
						  	params:{
						  		url:data.loginUrl
						  	},
						  	component: () => import("./common/urlDialog.vue")
						  })
						}
					})
				}).catch(()=>{})				
			},
			selectChange(v){
				this.selectList = [];
				v.forEach(i => {
				  this.selectList.push(i.sellerAuthId)
				});
			},
			delBtn() {
				if (this.selectList.length === 0) {
				  this.$message({
					message: "请至少选择一项",
					type: "warning"
				  });
				  return;
				}
				this.$confirm('此操作将删除,是否继续？','提示',{type:'warning'}).then(()=>{
					this.$api["sellerAuthRemove"]({
					  sellerAuthIds:this.selectList
					})
					  .then(data => {
						if (data.code === 0) {
						  this.$refs.layout[0].getList();
						}
					  })
					  .catch(() => {});
				}).catch(()=>{})				
			},
			delBtnItem(e){
				this.$confirm('此操作将删除,是否继续？','提示',{type:'warning'}).then(()=>{
					this.$api["sellerAuthRemove"]({
					  sellerAuthIds:[e]
					})
					  .then(data => {
						if (data.code === 0) {
						  this.$refs.layout[0].getList();
						}
					  })
					  .catch(() => {});
				}).catch(()=>{})	
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.ebayPlatformId,
					siteId:this.siteId,
					areaId:+this.activeName1
				}
			},
		},
		watch:{
			
		}
	}
</script>

<style>
</style>

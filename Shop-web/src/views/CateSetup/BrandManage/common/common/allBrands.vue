<template>
	<div>
		<div v-if='$route.name==="BrandManage"'>
			<MainLayout
				:outerParams="outerParams"
				:edits="edits"
				:searchFields="searchFields"
				:editBtns="isAdmin===1?editBtns:[]"
				:columns="columns"
				:treeTable="treeTable"
				:treeTableOtions="treeTableOtions"
				:treeColor="true"
				:searchFunc = 'searchFunc'
				reserveSelection = "brandId"
				ref="layout"
				url="brandManageList"
			></MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
import storage from "Utils/saver";
import { isRepeat } from 'Utils/tools'
export default {
	data(){
		return{
			
			edits:[
				{
					name:'编辑',
					icon:'el-icon-edit-outline',
					show:()=>{
						return this.isAdmin
					},
					fn: scope => {
						this.$refs.layout.$dialog({
							title:'编辑品牌归属国',
							width:'600px',
							params:{
								editType:true,
								siteId: this.siteId,
								sellerId: this.sellerId,
								platformId:this.platformId,
								brand:scope.row.brand,
								serialNumbers:[scope.row.brandId],
								countryCode:scope.row.countryCode,
							},
							component: () => import("../../common/brandDialog.vue"),
							okBtnText:'确认',
							cancelBtnText:'取消'
						})
					}
				}
			],
			searchFields:[
				{
					label:'品牌名称',
					
					name:'brand',
					type:'input',
					placeholder:'请输入品牌名称',
					labelWidth: '60px',
				},
				{
					label:'品牌来源',					
					name:'sourceType',
					type:'select',
					placeholder:'请选择品牌来源',
					options:[
						{label:'平台抓取',value:1},
						{label:'关键词库',value:0},
					],
					labelWidth: '100px',
				},
				{
					label:'注册状态',					
					name:'registrationType',
					type:'select',
					placeholder:'请选择注册状态',
					options:[
						{label:'是',value:1},
						{label:'否',value:0},
					],
					labelWidth: '100px',
				},
				{
					label:'国家',
					labelWidth: '100px',
					name:'countryCode',
					type:'select',
					placeholder:'请选择国家',
					optionsHoverFunc(i){
						return i.highlightFlag === 1
					},
					options:[]
				},
				{
					label:'类目',
					labelWidth: '100px',
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
					options:this.getCategory
				},
				{
					label:'品牌类型',
					labelWidth: '60px',
					name:'brandType',
					type:'select',
					placeholder:'请选择品牌类型',
					options:[
						{label:'仅广告',value:1},
						{label:'可布局',value:2},
					]
				},
				{
					label:'筛选状态',
					labelWidth: '100px',
					name:'filterStatus',
					type:'select',
					placeholder:'请选择筛选状态',
					options:[
						{label:'待筛选',value:0},
						{label:'已筛选',value:1},
					]
				},
			],
			editBtns:[
				{
					name:"设置品牌归属国",					
					disabled: selection => {
					  return selection.length == 0
					},
					fn:()=>{
						this.$refs.layout.$dialog({
							
							title:'设置品牌归属国',
							width:'600px',
							
							params:{								
								siteId: this.siteId,
								sellerId: this.sellerId,
								platformId:this.platformId,
								serialNumbers:this.getSelectionSerial()
							},
							component: () => import("../../common/brandDialog.vue"),
							okBtnText:'确认',
							cancelBtnText:'取消'
						})
					}
				},
				{
					name:'设置品牌类型',
					disabled: selection =>{					
						// return selection.length == 0 || isRepeat(this.getSelectionBrand())
						return selection.length == 0 
					},
					fn: ()=>{
						this.$refs.layout.$dialog({
							title:'设置品牌类型',
							width:'400px',
							params:{								
								serialNumbers:this.getSelectionSerial()
							},
							component: () => import("./common/brandTypeDialog.vue"),
							okBtnText:'确认',
							cancelBtnText:'取消',
						})
					}
				},
				{
					name:'删除',
					disabled: selection =>{
						return selection.length == 0
					},
					fn: ()=>{
						this.delBtn()
					}
				}
			],
			num:1,
			columns:[
				{
					label:'品牌名称',
					value:'brand',
					width:150,
					align:'left',
					width:"150px",
					expand:true,
					render(h, scope) {				
						let brand = scope.row.brand
						return brand ? scope.row._level == 1 ? (
						  <el-tooltip open-delay={300} content={brand} placement="top" effect="light">
							<span>{brand.length>12?brand.substring(0,12)+"...":brand}</span>
						  </el-tooltip>
						) : (
						  <el-tooltip open-delay={300} content={brand} placement="top" effect="light">
						  	<span>{brand.length>12?brand.substring(0,9)+"...":brand}</span>
						  </el-tooltip>
						) : (
						  <span>-</span>
						)
					}
				},
				{
					label:'来源',
					value:'sourceType',
					enum:{
						1:'平台抓取',
						0:'关键词库'
					}
				},
				{
					label:'是否注册',
					value:'registrationType',
					enum:{
						1:'是',
						0:'否'
					}
				},
				{
					label:'序列号',
					value:'serialNumber',
					minWidth:100,
				},
				{
					label:'注册号',
					value:'regNumber',
					minWidth:100,
				},
				{
					label:'品牌所有者',
					value:'brandOwner',
					showTooltip:true,
					minWidth:120,
				},
				{
					label:'归属国家',
					value:'countryCode',
					render(h, scope) {
						let countryCode = scope.row.countryCode
						return countryCode ? (
						  <span class="fix__row_1">{countryCode}({scope.row.chineseName})</span>
						) : (
						  <span>-</span>
						)
					},
					minWidth:120,
				},
				{
					label:'类目',
					value:'categorys',
					minWidth:'100px',
					render(h,scope){
						let categorys = scope.row.categorys
						if(categorys && categorys.length){
							 var strCate = ''
							 strCate = categorys.join(',')
						}
						return categorys ? (
							categorys.length ? (
								categorys[0] === '' ? (
									<span>全部</span>
								) : (
									<el-tooltip open-delay={300} content={strCate} placement="top" effect="light">
										<span class="fix__row_1">{strCate}</span>
									</el-tooltip>
								)								
							) : (
								<span>全部</span>
							)							
						) : (
							<span>-</span>							
						)
					}
				},
				{
					label:'服务范围',
					value:'goodsAndServices',
					showTooltip:true,
				},
				{
					label:'注册时间',
					value:'registrationDate',
					width:'100'
				},
				{
					label:'品牌类型',
					value:'brandType',
					render(h,scope){
						let brandType = scope.row.brandType
						return brandType ? (
							brandType === 1 ? (
								<span>仅广告</span>
							) : (
								<span>可布局</span>
							)
						) : (
							<span>-</span>
						)
					}
				},
				{
					label:'筛选状态',
					value:'filterStatus',
					render(h,scope){
						let filterStatus = scope.row.filterStatus
						return	filterStatus === 0 ? (
								<span>待筛选</span>
							) : (
								<span>已筛选</span>
							)
					}
				},
			],
			treeTable:true,
			treeTableOtions:{
				childs:'sameBrandList',
				expandFunc:row =>{
					return row.sameBrandList && row.sameBrandList.length>0
				}
			},
			isAdmin:0,
		}
	},
	methods:{
		searchFunc(data){
			let {categorys,...info} = data;
			if(categorys){
				let category = categorys.join(':');
				if(category === '全部') category = "0"
				return {category,...info}
			}else{
				return {...info}
			}
		},
		getSelectionBrand(){
			return this.getSelection().map(el=>el.brand)
		},
		getSelectionSerial(){
			return this.getSelection().map(el=>el.brandId)
		},
		async getCategory(id = [0],selEl,itemDisabled){
			if(!selEl) selEl = {pcid:0};
			let siteId = await this.sellerData.siteId;
			if(siteId){
				let {pcid} = selEl
				let params = {
					parentPcid:pcid,
					siteId:siteId,
					platformId:this.platformId
				}
				return this.$api['GetCateList'](params)
					.then(data => {
						if (data && data.code && data.code !== 0) {
							this.$message.error(data.meg)
							return
						}
						if(pcid == 0) {data.data.unshift({
							haveChildren: 0,
							name: "全部",
							nodeId: 0,
							parentPcid: 0,
							pcid: '',
							platformId: 1,
							seq: 0,
							siteId: 1,
						})}
						return data.data.map(el => {
							var arr = {
								...el,
								childs:el.haveChildren ? [] :null,
								enabled: true,
								isLeaf: !el.haveChildren
							}
							return arr
						})
					}).catch((err)=>{
				})
			}
		},
		getCountry(){
			this.$api["brandManageListCountry"]({brand:null}).then(res => {
			  res.data.forEach(e => {
				  let newLabel = `${e.countryCode}(${e.chineseName})`
			    this.searchFields[3].options.push({label:newLabel,value:e.countryCode,highlightFlag:e.highlightFlag});
			  });
			});
		},
		delBtn() {
			
			this.$confirm('此操作将删除该项, 是否继续？','提示',{type: "warning"}).then(()=>{
				this.$api["brandManageRemove"]({
				  serialNumbers:this.getSelectionSerial()
				})
				  .then(data => {
					if (data.code === 0) {
					  this.$refs.layout.getList();
					  this.$parent.$parent.$parent.getLIstCount()
					}
				  })
			}).catch(()=>{})			
		},
	},
	mounted(){		
		this.isAdmin = storage.get('local','isAdmin')	
		this.getCountry()
		this.$refs.layout.getList()
		
	},
	computed: {
		outerParams(){
			return {
				
			}
		},
		sellerData(){
			return JSON.parse(sessionStorage.getItem("shop_seller_data") || null)
		}
	}
}
</script>


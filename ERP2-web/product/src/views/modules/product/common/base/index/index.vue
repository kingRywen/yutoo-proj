<template>
	<div>
		<div v-if="this.$route.name === '仓库产品'">
			<MainLayout 
				:outerParams="outerParams" 
				:edit-btns="edits" 
				:tabs="tabs" 
				:leftTree="leftTree" 
				@left-batch-change="handleLeftBatchChange"
				:topBatchBtn="topBatchBtn" 
				:searchFields="searchFields" 
				:searchDefaultData="searchData" 
				:right-edit-btns="editBtns"
				:columns="columns" 
				arrowLeft="-10px"
				:treeTable="treeTable" 
				:searchFunc="searchFunc" 
				:treeTableOtions="treeTableOtions" 
				ref="layout"
				url="product/prProductRepoList">
			</MainLayout>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import {tabsDataFn,topLeftBtnFn,getPeople} from './js/index.js'
	import constOption from './js/const.js'
	export default {
		data() {
			let vm = this;
			return {
				treeTable: true,
				treeTableOtions: {
					childs: 'childProductList',
					expandFunc: row => {
						return row.childProductList && row.childProductList.length > 0
					}
				},
				topBatchBtn: {
					options: constOption.OPTIONS.topLeftBtnOption,
					search: {
						field: 'search',
						placeholder: '请输入仓库SKU、平台SKU、中英文名称'
					}
				},
				leftTree: {
					props: {
						label: 'systemCategoryName',
						children: 'childArray'
						// isLeaf: 'leaf'
					},
					dataFn(data) {
						return {
							categoryId: data.systemCategoryId
						}
					},
					dataPromise: () => {
						return this.$api[`product/CateSystemCategoryTree`]({}).then(data => {
							return [{
								systemCategoryName: '全部',
								systemCategoryId: -1,
								childArray: data.rows
							}]
						})
					}
				},
				edits: [
					{
						name: "编辑",
						fn: ({row = {}}) => {
							if (vm.utils.isEmpty(row.categoryId) && vm.$message.warning('类目ID不存在')) return 

							if (vm.utils.isEmpty(row.productRepoId) && vm.$message.warning('母体ID不存在')) return
							
							if (vm.utils.isEmpty(row.categoryDetail) && vm.$message.warning('类目路劲不存在')) return

							this.$router.push({
								path: '/product/common/base/productOperate',
								query: {
									id: row.categoryId,
									productRepoId: row.productRepoId,
									path: row.categoryDetail
								}
							})
						}
					},
					{
						name: "废除",
						fn: scope => {
							let params = {
								productRepoIds: [scope.row.productRepoId],
								cancelStatus: 1
							}
							return vm.showConfirm('product/prProductRepoCancel', params, '废除')
						}
					},
					{
						name: '取消废除',
						fn: scope => {
							let params = {
								productRepoIds: [scope.row.productRepoId],
								cancelStatus: 2
							}
							return vm.showConfirm('product/prProductRepoCancel', params, '废除')
						}
					},
					{
						name: "锁定",
						fn: scope => {
							let params = {
								productRepoIds: [scope.row.productRepoId],
								lockStatus: 1
							}
							return vm.showConfirm('product/prProductRepoLock', params, '锁定')
						}
					},
					{
						name: "取消锁定",
						fn: scope => {
							let params = {
								productRepoIds: [scope.row.productRepoId],
								lockStatus: 2
							}
							return vm.showConfirm('product/prProductRepoLock', params, '取消锁定')
						}
					},
					{
						name: "复制添加",
						fn: () => {
							let routeData = vm.$router.resolve({
								path: "/product/common/base/productOperate",
								query: {
									params: 1
								}
							})
							window.open(routeData.href, '_blank');
						}
					},
					
					
					{
						name: '操作日志',
						fn: () => {
							this.showDialog('操作日志', '100%', {modelLogType: 1}, () => import('Views/modules/product/setup/common/log.vue'))
						}
					},
					{
						name: '审核',
						fn: ({row}) => {
							if (vm.utils.isEmpty(row.categoryId) && vm.$message.warning('类目ID不存在')) return 

							if (vm.utils.isEmpty(row.productRepoId) && vm.$message.warning('母体ID不存在')) return
							
							if (vm.utils.isEmpty(row.categoryDetail) && vm.$message.warning('类目路劲不存在')) return
							this.$router.push({
								path: "/product/common/base/productOperate",
								query: {
									id: row.categoryId,
									productRepoId: row.productRepoId,
									path: row.categoryDetail,
									audit: 1
								}
							})
						}
					},
					{
						name: '查看理由',
						fn: scope => {
							this.showDialog('查看理由', '100%', {productRepoId: scope.row.productRepoId}, () => import('Views/modules/product/common/base/index/dialogs/viewReason.vue'))
						}
					},
					{
						name: '停产',
						fn: scope => {
							let params = {
								productRepoIds: [scope.row.productRepoId],
								produceStatus: 1
							}
							return vm.showConfirm('product/prProductRepoSetStatus', params, '设置变体状态为停产')
						}
					},
					{
						name: '缺货',
						fn: scope => {
							let params = {
								productRepoIds: [scope.row.productRepoId],
								produceStatus: 2
							}
							return vm.showConfirm('product/prProductRepoSetStatus', params, '设置变体状态为缺货')
						}
					},
					{
						name: '删除',
						fn: scope => {
							let params = {productRepoIds: [scope.row.productRepoId]}
							return vm.showConfirm('product/prProductRepoDelete', params, '删除')
						}
					},	
					{
						name: '新增变体',
						fn: () => {
							vm.$router.push({
								path: "/product/common/base/productOperate",
								query: {
									params: 1
								}
							})
						}
					},
				],
				tabs: [
					{
						name: "正常",
						num: 0,
						query: {
							productRepoStatus: 5
						}
					},
					{
						name: "基本信息待编辑",
						num: 0,
						query: {
							productRepoStatus: 1
						}
					},
					{
						name: "基本信息待审核",
						num: 0,
						query: {
							productRepoStatus: 2
						}
					},
					{
						name: "采购信息待编辑",
						num: 0,
						query: {
							productRepoStatus: 3
						}
					},
					{
						name: "采购信息待审核",
						num: 0,
						query: {
							productRepoStatus: 4
						}
					},
					{
						name: "废除",
						num: 0,
						query: {
							invalidFlag: 1
						}
					},
					{
						name: "锁定",
						num: 0,
						query: {
							lockFlag: 1
						}
					},
					{
						name: "所有",
						num: 0,
					}
				],
				searchFields: {
					combinationProductFlag: {
						labelWidth: "44px",
						widget: "radio",
						label: "产品",
						options: this.$const['WAREHOUSEPRODUCT/combinationProductFlag']
					},
					productType: {
						hidden: true,
						labelWidth: "80px",
						widget: "select",
						label: "产品类型",
						options: this.$const['WAREHOUSEPRODUCT/productType']
					},
					sourceType: {
						hidden: true,
						labelWidth: "80px",
						widget: "select",
						label: "产品来源",
						options: this.$const['WAREHOUSEPRODUCT/sourceType']
					},
					createTime: {
						hidden: true,
						labelWidth: "80px",
						widget: 'daterange',
						label: '创建时间',
						time: true
					},
					warehouseId: {
						hidden: true,
						labelWidth: '80px',
						widget: 'select',
						label: '发货仓库',
						options: "$store.common.warehouseList",
						handler: {
							action: 'common/getWarehouseList'
						}
					},
					developUserId: {
						hidden: true,
						labelWidth: '80px',
						widget: 'select',
						label: '开发人员',
						options: []
					},
					purchaseUserId: {
						hidden: true,
						labelWidth: '80px',
						widget: 'select',
						label: '采购人员',
						options: []
					},
					supplierId: {
						hidden: true,
						labelWidth: '80px',
						widget: 'select',
						label: '供应商',
						options: "$store.common.supplierList",
						handler: {
							action: 'common/getSupplierList'
						}
					},
					presaleFlag: {
						hidden: true,
						labelWidth: "80px",
						widget: "select",
						label: "预售属性",
						options: this.$const['WAREHOUSEPRODUCT/presaleFlag']
					},
					platformIds: {
						hidden: true,
						labelWidth: '90px',
						widget: 'select',
						label: '仅上架平台',
						options: "$store.common.platList",
						handler: {
							action: 'common/getPlatList'
						}
					},
					photoFlag: {
						hidden: true,
						labelWidth: "110px",
						widget: "select",
						label: "是否需要拍照",
						options: this.$const['WAREHOUSEPRODUCT/photoFlag']
					},
					auditStatus: {
						hidden: true,
						labelWidth: "80px",
						widget: "select",
						label: "审核状态",
						options: this.$const['WAREHOUSEPRODUCT/auditStatus']
					},
					activeStatus: {
						hidden: true,
						labelWidth: "90px",
						widget: "input",
						label: "产品活跃度"
					},
					produceStatus: {
						hidden: true,
						labelWidth: "80px",
						widget: "select",
						label: "变体状态",
						options: this.$const['WAREHOUSEPRODUCT/produceStatus']
					},
				},
				searchData: {},
				editBtns: [{
						type: "dropdown",
						btns: [{
								name: "新增产品",
								perm: "addTask",
								fn: () => {
									vm.addSingleProduct();
								}
							},
							{
								name: "新增单个产品",
								perm: "addTask",
								fn: () => {
									vm.addSingleProduct();
								}
							},
							{
								name: "批量添加产品",
								perm: "addTask",
								fn: () => {
									vm.$router.push({
										path:'/product/common/base/warehouseMoreAddProduct',
										query: {}
									})
								}
							},
							{
								name: "新增组合产品",
								perm: "del",
								icon: "el-icon-delete",
								type: "danger",
								fn: () => {
									vm.addSingleProduct();
								}
							}
						]
					},
					{
						name: "移动变体",
						perm: "addTask",
						disabled: selection => {
							let selectionLength = selection.filter(e => !e.childProductList)
							return selectionLength.length == 0
						},
						fn: () => {
							let data = vm.getSelection()
							vm.showDialog('批量移动产品', '100%', {data: data}, () => import('./dialogs/moveProduct'), '确认', '取消')
						}
					}
				],
				columns: [
					{
						type: "array",
						minWidth: 150,
						children: [
							{
								label: "仓库SKU",
								value: "repoSku",
								numField: 'childProductList',
								expand: true,
							},
							{
								label: "状态",
								value: "productRepoStatus"
							}
						]
					},
					{
						label: '图片',
						img: true,
						value: 'image',
					},
					{
						type: 'array',
						minWidth: 130,
						children: [
							{
								label: '系统SKU',
								value: 'sysSku'
							},
							{
								label: '活跃度',
								value: 'activeStatusName'
							}
						]
					},
					{
						type: 'array',
						minWidth: 130,
						children: [
							{
								label: '产品名称',
								value: 'nameCn'
							},
							{
								label: '英文名称',
								value: 'nameEn'
							}
						]
					},
					{
						label: "创建日期",
						value: "createTime",
						sortable: true,
						minWidth: 150,
					},
					{
						type: 'array',
						minWidth: 130,
						children: [
							{
								sortable: true,
								label: '采购价',
								value: 'purchasePriceCurrency'
							},
							{
								label: '最低售价',
								value: 'lowestPrice'
							}
						]
					},
					{
						type: 'array',
						minWidth: 130,
						children: [
							{
								label: '基本审核状态',
								value: 'auditStatusName'
							},
							{
								label: '采购审核状态',
								value: 'purchaseAuditStatusName'
							}
						]
					},
					{
						type: 'array',
						minWidth: 130,
						children: [
							{
								label: '产品来源',
								value: 'sourceTypeName'
							},
							{
								label: '产品类型',
								value: 'productTypeName'
							}
						]
					},
					{
						type: 'array',
						minWidth: 140,
						children: [
							{
								sortable: true,
								label: '库存',
								value: 'stock'
							},
							{
								label: '默认发货仓库',
								value: 'warehouseName'
							}
						]
					},
				]
			};
		},
		methods: {
			addSingleProduct() {
				this.$router.push({
					path: "/product/common/base/category",
					query: {
						params: 1
					}
				});
			},
			searchFunc(data) {
				let { createTime,sort,sortField,...el} = data
				let sortType = sort || null
				let sortColums = sortField || null
				let [createTimeStart, createTimeEnd] = createTime || []
				return {createTimeStart,createTimeEnd,sortType,sortColums,...el};
			},
			handleLeftBatchChange(val, selection) {
				topLeftBtnFn(this, val, selection)
			},
			async getPeopleMethod() {
				this.searchFields.developUserId.options = await getPeople('KF', this)
				this.searchFields.purchaseUserId.options = await getPeople('CG', this)
			},
		},
		created() {},
		mounted() {
			this.$refs.layout.getList()
			this.$api['product/prProductRepoStatusCount']({}).then((res) => {
				let data = res.rows
				let tabData = tabsDataFn(data)
				tabData.forEach((e, index) => {
					this.tabs[index].num = e
				})
			})
			this.getPeopleMethod()
		},
		computed: {
			outerParams() {
				return {}
			},
		}
	};
</script>

<style>
</style>

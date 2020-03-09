<!--  -->
<template>
	<div class="___common" style="min-width:1050px;padding-bottom:50px">
		<div v-if='$route.name==="Svr"'>
			<div v-if="rightTopShow" class="rightTopBtn"  style="position: absolute;right: 20px;top: 10px;">
				<span style="font-size: 10px;color: #666666;margin-right: 20px;">最早订单同步时间：{{statTime}}</span>
				<el-button v-if="!status" type="primary" @click="rightTopShow = !rightTopShow" >同步数据<i class="el-icon-refresh el-icon--right"></i></el-button>
				<el-button v-else type="primary" :disabled="status">同步数据<i class="el-icon-loading el-icon--right"></i></el-button>
			</div>
			<div v-else class="rightTopBtn"  style="position: absolute;right: 20px;top: 10px;">
				<el-select size="small" style="margin-right: 20px;" v-model="selectMouth">
					<el-option v-for="item in mouthList" :label="item.name" :value="item.value" :key="item.value" ></el-option>
				</el-select>
				<el-button type="primary" @click="submitMethod">确认同步</el-button>
			</div>	
			<div style="position: relative;">
				<el-tabs type="card" v-model="activeName" @tab-click="change">
					<el-tab-pane label="销量报告" name="1">
						<svr ref="ts1" />
					</el-tab-pane>
					<el-tab-pane label="客户分析" name="2" :lazy='true'>
						<oca ref="ts2" />
					</el-tab-pane>
					<el-tab-pane label="客户分布" name="3" :lazy='true'>
						<dooc ref="ts3" />
					</el-tab-pane>
				</el-tabs>
				<section class='scoped_right1'>
					<span class="title">父产品:</span>
					<el-select clearable :popper-append-to-body="false" @change="selectAll" filterable v-model="changeParentList" placeholder="选择父sku,可多选"
					 style="min-width:370px;z-index: 999;" :multiple="true" collapse-tags size="small">
						<el-option v-for="item in options" :key="item.value" :label="item.parentSku" :value="item.value">
							<el-tooltip class="item" effect="light" placement="top-start" v-if="item.parentSku.length>20">>
								<div slot="content">{{item.parentSku}}</div>
								<span style="margin-left: 0px;">{{item.parentSku}}</span>
							</el-tooltip>
						</el-option>
					</el-select>
				</section>
				<section class="scoped_right">
					<span class="title">子产品:</span>
					<el-select clearable :popper-append-to-body="false" @change="selectAllChild" filterable v-model="changeChildList" placeholder="选择子sku,可多选"
					 style="min-width:370px;z-index: 999;" :multiple="true" collapse-tags size="small">
						<el-option v-for="item in optionSchild" :key="item.value" :label="item.childSku" :value="item.value">
							<el-tooltip class="item" effect="light" placement="top-start" v-if="item.childSku.length>20">
								<div slot="content">{{item.childSku}}</div>
								<span style="margin-left: 0px;">{{item.childSku}}</span>
							</el-tooltip>
						</el-option>
					</el-select>
				</section>
				<section class="scoped_right2">
					<el-button plain type="primary" @click="getByTag" size="small">确认搜索</el-button>
				</section>
				
			</div>
			
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import svr from "./Svr/svr";
	import oca from "./Oca/Oca";
	import dooc from "./Dooc/Dooc";
	import { getArrDifference,getArrEqual } from 'Utils/tools'
	export default {
		components: {
			svr,
			oca,
			dooc
		},
		data() {
			return {
				activeName: "1",
				options: [],
				optionSchild: [],
				changeParentList: [],	
				changeChildList: [],
				rightTopShow:true,
				statTime:'',
				status:null,
				mouthList:[
					{name:'一月',value:1},{name:'二月',value:2},{name:'三月',value:3},{name:'四月',value:4},{name:'五月',value:5},{name:'六月',value:6},{name:'七月',value:7},{name:'八月',value:8},{name:'九月',value:9},{name:'十月',value:10},{name:'十一月',value:11},{name:'十二月',value:12}
				],
				selectMouth:null,
				oldChildList:[],
				oldParentList:[]
			};
		},
		mounted() {
			if (this.siteId && this.sellerId) {
				this.getData();
				this.getBtnStatus()
			}
		},
		methods: {
			submitMethod(){
				if(!this.selectMouth) return this.$message.warning('请选择月份')
				this.$api['salesOrderRecordSave']({sellerId:this.sellerId,siteId:this.siteId,months:this.selectMouth}).then((res)=>{
					this.getBtnStatus()
					this.selectMouth = null
					this.rightTopShow = !this.rightTopShow
				})
			},
			getBtnStatus(){
				this.$api['salesOrderRecordInfo']({sellerId:this.sellerId,siteId:this.siteId}).then((res)=>{
					if(res.data){
						if(!res.data.status && res.data.status === 0) this.status = true
						this.statTime = res.data.statTime;
						
					}
				})
			},
			async getData() {
				let parent = await this.getParentSkus();
				if (parent) {
					this.$refs.ts1.getList();
				}
			},
			change(val) {
				this.getByTag();
			},
			// 获取父sku列表
			getParentSkus() {
				let params = {
					sellerId: this.sellerId,
					siteId: this.siteId
				};
				return this.$api["ProductListParentSku"](params)
					.then(data => {
						let arr = data.data;
						if (!arr) {
							this.$msgbox({
									title: "提示",
									message: "获取父sku列表失败，请刷新页面",
									showCancelButton: true,
									confirmButtonText: "刷新",
									cancelButtonText: "取消"
								})
								.then(action => {
									location.reload();
								})
								.catch(err => {});
							return;
						}
						this.$store.commit("common/parentSkusAll",[]);
						this.$store.commit("common/parentSkusAll",arr);
						this.options = []
						arr.forEach((item) => {
							this.options.push({
								value: item,
								parentSku: item
							});
						});
						return data;
					})
					.catch(err => {
						return false;
					});
			},
			//获取子sku
			getChildSkus(data) {
				let params = {
					sellerId: this.sellerId,
					siteId: this.siteId,
					parentSkus:data ? data : null
				};
				return this.$api["ProductListSku"](params)
					.then(data => {
						let arr = data.data;
						if (!arr) {
							this.$msgbox({
									title: "提示",
									message: "获取子sku列表失败，请刷新页面",
									showCancelButton: true,
									confirmButtonText: "刷新",
									cancelButtonText: "取消"
								})
								.then(action => {
									location.reload();
								})
								.catch(err => {});
							return;
						}
						this.$store.commit("common/childSkusAll",[]);
						this.$store.commit("common/childSkusAll",arr);
						this.optionSchild = []
						this.optionSchild.push({
							value: '全部',
							childSku: '全部',
						})
						arr.forEach((item) => {
							this.optionSchild.push({
								value: item,
								childSku: item,
							});
						});
						
						return data;
					})
					.catch(err => {
						return false;
					});
			},
			
			// 根据tag 请i去
			getByTag() {
				let activeName = this.activeName;
				this.$nextTick(function() {
					if (activeName == "1") {
						this.$refs.ts1.getList();
					} else if (activeName == "2") {						
						this.$refs.ts2.getList();
					} else if (activeName == "3") {
						this.$refs.ts3.getList();
					}
				})

			},
			
			//返回时保存的时间
			getMemoryTime(){
				let activeName = this.activeName
				this.$nextTick(()=>{
					if(activeName === '2'){
						if( this.$store.state.pubilcTime.customerAnalysisTime &&  this.$store.state.pubilcTime.customerAnalysisTime.length) this.$refs.ts2.$refs.child.DateMsg.DateValue = this.$store.state.pubilcTime.customerAnalysisTime
					}
					if(activeName === '3'){
						if( this.$store.state.pubilcTime.customerDistributionTime &&  this.$store.state.pubilcTime.customerDistributionTime.length) this.$refs.ts3.$refs.child.DateMsg.DateValue = this.$store.state.pubilcTime.customerDistributionTime
					}
				})
			},
			// 父选择
			selectAll(val) {
				this.$store.commit("common/select_parentSkuMain",this.changeParentList);
				
				//如果删除某一个父,要删掉对应的勾选上的子
				if(val.length < this.oldParentList.length){
					let testList = []
					this.$api['ProductListSku']({sellerId: this.sellerId,siteId: this.siteId,parentSkus:getArrDifference(val,this.oldParentList)}).then((res)=>{
						res.data.forEach((e)=>{
							testList.push(e)
						})
						let delList = getArrEqual(testList,this.changeChildList)
						delList.forEach((e)=>{
							this.changeChildList.forEach((i,index)=>{
								if(e===i){
									this.changeChildList.splice(index,1)
								}
							})
						})
						this.$store.commit("common/select_childSku",this.changeChildList);
					})				
				}
				
				//存储旧数据
				this.oldParentList = val
				
				if(this.changeParentList && this.changeParentList.length == 0){
					this.optionSchild = []
					this.changeChildList = []
					this.oldChildList = []
					this.$store.commit("common/select_childSku",[]);
					this.$store.commit("common/childSkusAll",null);
					return true
				}
				this.getChildSkus(this.changeParentList)
			},
			//子选择
			selectAllChild(val) {
				//oldChildList 旧数据
				//changeChildList 双向绑定的数据
				//optionSchild 渲染的数据
				const allValues = [];
				// 保留所有值
				for (const item of this.optionSchild) {
				  allValues.push(item.value)
				}
				// 用来储存上一次的值，可以进行对比
				const oldVal = this.oldChildList.length === 1 ? this.oldChildList[0] : [];
				// 若是全部选择
				if (val.includes('全部')) this.changeChildList = allValues;
				// 取消全部选中 上次有 当前没有 表示取消全选
				if (oldVal.includes('全部') && !val.includes('全部')) this.changeChildList = [];
				// 点击非全部选中 需要排除全部选中 以及 当前点击的选项
				// 新老数据都有全部选中
				if (oldVal.includes('全部') && val.includes('全部')) {
				  const index = val.indexOf('全部');
				  val.splice(index, 1); // 排除全选选项
				  this.changeChildList = val
				}
				// 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
				if (!oldVal.includes('全部') && !val.includes('全部')) {
				  if (val.length === allValues.length - 1) this.changeChildList = ['全部'].concat(val)
				}
				// 储存当前最后的结果 作为下次的老数据
				this.oldChildList[0] = this.changeChildList;
				
				this.$store.commit("common/select_childSku",this.changeChildList);
			},
			
		},
		computed: {},
		watch: {
			sellerData() {
				this.getData();
			},
			$route(to, from) {
				if (from.name === 'TSdatails') {
					this.getMemoryTime()
					this.getByTag();					
				}
			},

		}
	};
</script>

<style lang='scss' scoped>
	.scoped_right {
		position: absolute;
		right: 100px;
		top: 4px;
	}

	.scoped_right1 {
		position: absolute;
		right: 557px;
		top: 4px;
	}
	
	.scoped_right2 {
		position: absolute;
		right: 0px;
		top: 4px;
	}
	
	.title {
		color: #909399;
		font-size: 14px !important;
	}

	.item {
		margin: 4px;
	}
</style>

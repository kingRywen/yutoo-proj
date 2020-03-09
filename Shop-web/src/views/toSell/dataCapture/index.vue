<template>
	<div>
		<div class="box" style="height:100%"  v-show='$route.name==="dataCapture"'>
			<div class="drawer-btn" @click="setShow()" v-if="!isShow" :style="position">
				<i :class="icon"></i>
			</div>
			<ElRow :gutter="20" style="height:100%">
				<ElCol :span="4" v-show="isShow" style="position:relative;border-right: 1px solid #ddd;height:100%">
					<div class="drawer-btn drawer-btn1" @click="setShow()" v-if="isShow">
						<i :class="icon"></i>
					</div>
					<div class="menu">
						<div class="box-center">
							<el-input clearable placeholder="输入类目进行过滤" v-model="filterText" size="mini" class="menu-select">
								<!-- <i slot="append" class="el-icon-search"></i> -->
							</el-input>
						</div>
						<div style="text-align:right">
							<el-tooltip class="item" effect="light" content="刷新" placement="top-start">
								<el-button icon="el-icon-refresh" type="text" @click="getCustomCategory"></el-button>
							</el-tooltip>
						</div>
						<!-- node-key="cusCateId" -->
						<el-tree
							:data="customCategoryData"
							:props="defaultProps"
							highlight-current
							@node-click="handleNodeClick"
							ref="treeCustomCategory"
							:filter-node-method="filterNode"
							v-loading="treeLoading"
							:key="treeKey"
						>
							<span class="span-ellipsis" slot-scope="{ node, data }">
								<span :title="node.label" class="font12">{{ node.label }}</span>
							</span>
						</el-tree>
					</div>
				</ElCol>
				<ElCol :span="isShow ? 20 : 24">
					<el-tabs v-model="activeName" @tab-click='tabClick' type="card">
						<el-tab-pane v-for="item in countryList" :name="item.siteId" :lazy='true'>
							<div slot="label">{{item.siteName}}</div>
						</el-tab-pane>	  
					</el-tabs>
					<main-view />
				</ElCol>
			</ElRow>
			
		</div>
		<router-view></router-view>
	</div>
  
</template>

<script>
	import mainView from './mainView.vue'
	export default {
		data(){
			return {
				isShow: true,
				icon: 'el-icon-caret-left',
				position: {
				  position: 'absolute',
				  top: '254px',
				},
				customCategoryData:[],
				defaultProps: {
				  children: 'childList',
				  label: 'name'
				},
				treeKey:1,
				treeLoading:false,
				filterText: null,
				countryList:[],
				activeName:"1",
				pcid:null,
			}
		},
		methods:{
			tabClick(){
			
			},
			setShow() {
			  this.isShow = !this.isShow			
			  if (this.isShow) {
			    this.icon = 'el-icon-caret-left'
			  } else {
			    this.icon = 'el-icon-caret-right'
			  }
			},
			handleNodeClick(data) {
			  this.pcid = data.pcid
			},
			filterNode(value, data) {
			  if (!value) return true
			  return data.name.indexOf(value) !== -1
			},
			getTab(){
				this.$api['siteListSite1']().then((res)=>{
					res.data.forEach((e)=>{
						e.siteId = e.siteId.toString()
					})
					this.countryList = res.data 
				})
			},
			initPage() {
			    this.getCustomCategory()
			},
			getCustomCategory() {
			  this.treeLoading = true
			  this.$nextTick(function(){
			  	this.getcustomCategoryList()
			  	this.pcid = null
			  })			  
			},
			getcustomCategoryList(){
				let child = this.$refs.childItem
				let params = {
					pageType:1,
					siteId:parseInt(this.activeName)
				}
				this.$api['imSaleProdCateList'](params)
				  .then(res => {
				    let data = res.data
					this.treeLoading = false
				    if (!data.length) {
				      return
				    }
				    this.customCategoryData = data
				  })
				  .catch(err => {
				    this.customCategoryData = []
				  })
			},
		},
		created(){
			this.initPage()
		},
		mounted(){
			this.getTab()
		},
		watch: {
		  filterText(val) {
		    this.$refs.treeCustomCategory.filter(val)
		  },
		  sellerData() {
		    this.initPage()
		  },
		},
		components:{
			mainView
		},
		computed:{
			moneyType(){
				return this.countryList.find((e)=>{
					return e.siteId === this.activeName
				}).symbol
			}
		}
	}
</script>

<style lang="less" scoped>
.box {
  .drawer-btn {
    background-color: #fff;
    border: 1px solid @borderColor;
    width: 15px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }
  .drawer-btn1 {
    // right: -8px;
    position: absolute;
    top: 200px;
  }   
}
</style>
<template>
	<div>
		<div v-if="$route.name !== 'newManualCreateAd'">
			<div class="mainBtn">
				<el-button type="primary" plain size="small" @click="addAdMethod">添加广告策略</el-button>
				<el-button
				  type="primary"
				  @click="setManualUpdate"
				  :loading="loadingBtn1"
				  :disabled="BTNdisabled"
				   plain size="small"
				>
				  {{refreshhtml}}
				  <i class="el-icon-refresh el-icon--right"></i>
				</el-button>
			</div>
			<div class="mainContent" style="position: relative;">
				<div class="drawer-btn" @click="setShow()" :style="position">
					<i :class="icon"></i>
				</div>
				<ElRow :gutter="20" style="height: 100%;">
					<ElCol :span="4" v-show="isShow" style="position:relative;border-right: 1px solid #ddd;max-height: calc(100vh - 180px);overflow: auto;">
						<div class="menu" >
							<CommonTree
							  :currentNode.sync="currentNode"
							  :classifyType="2"
							  ref="treeTaskCustomCategory"	
							  @nodeClick="handleNodeClick"
							  @del="deleteTreeNode"
							  @add="showDialog('AddGroup', '添加分组', $event)"
							  @addNext="showDialog('AddGroup', '添加下级分组', $event)"
							  @edit="showDialog('AddGroup', '编辑分组', $event)"
							/>
						</div>
					</ElCol>
					<ElCol :span="isShow ? 20 : 24">
						<div class="body">
							<component :is="currentView" :key="currentView" ref="child" ></component>
						</div>
					</ElCol>
				</ElRow>
			</div>
		</div>
		<router-view v-else></router-view>
	</div>
</template>

<script>
	import series from '@/views/SuDemo/manual/page/series.vue'
	import group from '@/views/SuDemo/manual/page/group.vue'
	import keyword from '@/views/SuDemo/manual/page/keyword.vue'
	export default {
		data() {
			return {
				isShow: true,
				icon: 'el-icon-caret-left',
				position: {
					position: 'absolute',
					top: '200px',
					left: '0px',
				},
				currentNode:{},
				currentView:'series',
				loadingBtn1: false,
				refreshhtml: '手动刷新',
				BTNdisabled: false,
			}
		},
		methods: {	
			addAdMethod(){
				this._openDialog({
					title:'广告策略',
					width: '1200px',
					params: {
						params:{
							keyName:'预算',
							strategyType:-1,
							edit:true,
							row:{
								status:1
							}
						}
					},
					top:'10vh',
					showMaxBtn:true,
					component: () => import('Views/SuDemo/manual/dialogs/main/strategy/allAd.vue')
				})
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
			  let { classifyName: objectName, campaignId, adGroupId, classifyId, targetingType } = data
			  
			  if (data.campaignId) {
			    this.$nextTick(() => {
			      this.$router.push({
			        name: 'newAdGroup',
			        query: {
			          strategyType: 1,
			          seriesName: objectName,
			          groupObjectId: campaignId,
					  targetingType:targetingType
			        }
			      })
			    })
			  } else if (data.adGroupId) {
			    this.$nextTick(() => {
			      this.$router.push({
			        name: 'newAdKeyword',
			        query: {
			          strategyType: 2,
			          objectId: adGroupId,
			          name: objectName,
			          seriesName: this.$route.query.seriesName,
			          groupObjectId: this.$route.query.groupObjectId,
					  targetingType:targetingType
			        }
			      })
			    })
			  } else {			
			    this.$nextTick(() => {
			      this.$router.push({ name: 'newManual' })
			    })
			  }
			},
			getTaskClassifyList(noCheckbox) {
			  return this.$refs.treeTaskCustomCategory.refreshTree(noCheckbox)
			},
			deleteTreeNode(data, done) {
			  let ids = []
			  if (!data) {
			    ids = this.$refs.treeTaskCustomCategory.getCheckedKeys()
			    if (ids.length) {
			    } else {
			      this.$message.warning('请选择一项进行删除')
			      return
			    }
			  } else {
			    ids.push(data.classifyId)
			  }
			
			  let params = {
			    classifyIds: ids,
			    classifyType: 2,
			    flag: 1
			  }
			  this.$confirm('是否删除分组？', '警告', {
			    confirmButtonText: '确认',
			    cancelButtonText: '取消',
			    type: 'warning'
			  })
			    .then(() => {
			      return this.$api[`taskClassifyRemove`](params)
			        .then(data => {
			          if (ids.indexOf(this.currentNode.classifyId) > -1) {
			            this.currentNode = {}
			          }
			          this.getTaskClassifyList(true)
			          this.$refs.layout.getList()
			        })
			        .catch(() => {})
			    })
			    .catch(() => {
			      done()
			    })
			},
			showDialog(componentName = 'Add', title, row, edit) {
			  let params = {
			    row,
			    objectId: this.objectId,
			    strategyType: this.strategyType,
			    treeList: this.$refs.treeTaskCustomCategory.data,
			    parent: this,
			    keyName: this.keyName,
			    title,
			    edit
			  }
			  if (title === '编辑分组' || title === '添加下级分组') {
			    params.row.parentIds = this.$refs.treeTaskCustomCategory.getParentIds(
			      row
			    )
			  }
			  if (title === '添加下级分组') {
			    params._next = true
			  }
			  this._openDialog({
			  	title,
			  	size: 'small',
			  	params: {
			  		params
			  	},
			  	component: () => import('./dialogs/AddGroup.vue'),
			  	okBtnText:'确认',
			  	cancelBtnText:'取消'
			  })
			  
			},
			updateTree(type, parentKey) {
			  switch (type) {
			    case '添加分组':
			      this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
			      break
			    case '添加下级分组':
			      this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
			      break
			    case '编辑分组':
			      this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
			      break
			
			    default:
			      break
			  }
			},
			getManualUpdate() {
			  this.$api['adDataGetLatestTime']({
			    siteId: this.siteId,
			    sellerId: this.sellerId,
			    platformId: this.platformId
			  })
			    .then(data => {
			      // debugger
			      const { status, dataTime } = data
			      if (status === 0) {
			        this.refreshhtml = '更新中'
			        this.loadingBtn1 = true
			      }
			      if (status === 1) {
			        this.refreshhtml = '更新成功'
			        this.loadingBtn1 = false
			        this.BTNdisabled = true
			      }
			    })
			    .catch(err => {
			      // if (err && err.code) {
			      //   this.refreshhtml = '正在刷新中'
			      //   this.loadingBtn1 = true
			      // }
			    })
			},
			//手动更新
			setManualUpdate() {
			  this.$confirm('数据更新可能需要1个小时，是否确认更新?', '提示', {
			    confirmButtonText: '确定',
			    cancelButtonText: '取消',
			    type: 'warning'
			  })
			    .then(() => {
			      this.loadingBtn1 = true
			      this.refreshhtml = '正在刷新中'
			      this.$api['adDataUpdateData']({
			        siteId: this.siteId,
			        sellerId: this.sellerId,
			        platformId: this.platformId
			      })
			        .then(res => {
			          if (res.code === 0) {		
			            this.refreshhtml = '正在刷新中'
			            this.BTNdisabled = true
			            this.loadingBtn1 = false
			          }
			        })
			        .catch(err => {
			          if (err.code === 400) {
			            this.BTNdisabled = true
			            this.refreshhtml = '今日数据已更新'
			            this.loadingBtn1 = false
			          } else if (err.code === 500) {
			            this.BTNdisabled = true
			            this.refreshhtml = '正在刷新中'
			          }
			        })
			    })
			    .catch(() => {})
			}
		},
		
		watch:{
			$route(to,from){
				switch(to.name){
					case 'newManual':
						this.currentView = 'series'
					break;
					case 'newAdGroup':
						this.currentView = 'group'
					break;
					case 'newAdKeyword':
						this.currentView = 'keyword'
					break;
				}				
			}
		},
		components:{
			series,
			group,
			keyword
		},
		created(){
			if(this.$route.name === 'newManual'){
				this.currentView = 'series'
			}else if(this.$route.name === 'newAdGroup'){
				this.currentView = 'group'
			}else if(this.$route.name === 'newAdKeyword'){
				this.currentView = 'keyword'
			}
			this.getManualUpdate()
		}
	}
</script>

<style lang="less" scoped>
	.mainBtn{
		position: absolute;
		top: 10px;
		right: 80px;
	}
	.drawer-btn {
		background-color: #fff;
		border: 1px solid @borderColor;
		width: 15px;
		height: 100px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	
</style>

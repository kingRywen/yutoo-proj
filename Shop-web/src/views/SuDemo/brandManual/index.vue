<template>
	<div>
		<div v-if="$route.name !== 'newBrandManualCreateAd'">
			<div class="mainContent" style="position: relative;">
				<div class="drawer-btn" @click="setShow()" :style="position">
					<i :class="icon"></i>
				</div>
				<ElRow :gutter="20" style="height: 100%;">
					<ElCol :span="4" v-show="isShow" style="position:relative;border-right: 1px solid #ddd;max-height: calc(100vh - 180px);overflow: auto;">
						<div class="menu" >
							<CommonTree
							  :currentNode.sync="currentNode"
							  :classifyType="5"
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
	import series from '@/views/SuDemo/brandManual/page/series.vue'
	import keyword from '@/views/SuDemo/brandManual/page/keyword.vue'
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
			}
		},
		methods: {		
			setShow() {
				this.isShow = !this.isShow
				if (this.isShow) {
					this.icon = 'el-icon-caret-left'
				} else {
					this.icon = 'el-icon-caret-right'
				}
			},
			handleNodeClick(data) {
			  let { classifyName: objectName, campaignId, adGroupId, classifyId } = data
			  
			  if (data.campaignId) {
			    this.$nextTick(() => {
				  campaignId = campaignId.toString()
			      this.$router.push({
			        name: 'newBrandAdKeyword',
			        query: {
			          strategyType: 5,
			          seriesName: objectName,
			          objectId: campaignId
			        }
			      })
			    })
			  }else {			
			    this.$nextTick(() => {
			      this.$router.push({ name: 'newBrandManual' })
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
			    classifyType: 5,
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
			  if(title === '编辑分组'){
				  //删掉他自己的选项
				  let delIndex = params.treeList[0].childList.findIndex(e=>e.classifyName === params.row.classifyName)
				  params.treeList[0].childList.splice(delIndex,1)
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
		},
		
		watch:{
			$route(to,from){
				switch(to.name){
					case 'newBrandManual':
						this.currentView = 'series'
					break;
					case 'newBrandAdKeyword':
						this.currentView = 'keyword'
					break;
				}				
			}
		},
		components:{
			series,
			keyword
		},
		created(){
			if(this.$route.name === 'newBrandManual'){
				this.currentView = 'series'
			}else if(this.$route.name === 'newBrandAdKeyword'){
				this.currentView = 'keyword'
			}
		}
	}
</script>

<style lang="less" scoped>
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

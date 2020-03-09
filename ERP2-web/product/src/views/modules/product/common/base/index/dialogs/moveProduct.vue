<template>
	<div style="display: flex;width:100%;height: 100%;justify-content: space-between;">
		<div class="leftTable">
			<div style="width: 100%;background: rgb(242,242,242);height: 30px;line-height: 30px;">
				<span style="font-size: 14px;margin-left: 5px;">已选择列表</span>
			</div>
			<div style="margin-top: 15px;">
				<el-button type="primary" size="small" @click="changeMoreMethod">选择更多</el-button>
				<el-button type="primary" size="small" plain @click="delLeftMethod" :disabled="changeLeftData.length == 0">删除</el-button>
			</div>
			<div style="margin-top: 15px;">
				<el-table :data="leftTableData" style="width: 100%" border @selection-change="leftSelectionChange">
					<el-table-column type="selection" width="55"  align="center">
					</el-table-column>
					<el-table-column prop="image" label="图片" align="center">
						<template slot-scope="scope">
							<el-popover placement="right" trigger="hover">
								<div class="__img_item mar-auto" :style="{width:'200' + 'px', height:'200' + 'px'}">
									<img class="loadingImg" v-lazy="scope.row.image" style="object-fit: contain;overflow: hidden;">
								</div>
								<div class="__img_item" slot="reference" style="margin: 0 auto;">
									<img class="loadingImg" :key="scope.row.image" v-lazy="scope.row.image?scope.row.image:'-'">
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="nameCn" label="产品名称" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.nameCn">
								<div>{{scope.row.nameCn}}</div>
								<div>{{scope.row.nameEn}}</div>
							</div>
							<span v-else>-</span>
						</template>
					</el-table-column>
					<el-table-column prop="sysSku" label="系统SKU" align="center">
					</el-table-column>
					<el-table-column prop="repoSku" label="仓库SKU" align="center">
					</el-table-column>
					<el-table-column label="属性" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.variantProperty && scope.row.variantProperty.length">
								<div v-for="item in scope.row.variantProperty">{{item.propertyName}} : {{item.propertyValueShort}}</div>
							</div>
							<span v-else>-</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="rightTable">
			<div style="width: 100%;background: rgb(242,242,242);height: 30px;line-height: 30px;">
				<span style="font-size: 14px;margin-left: 5px;">随着目标移入父产品</span>
			</div>
			<div style="margin-top: 15px;">
				<el-input v-model.trim='parentInput' size="small" style="width: 50%;" placeholder="输入仓库SKU/系统SKU/名称" clearable></el-input>
				<el-button type="primary" size="small" style="margin-left: 10px;" @click="getRightList">搜索</el-button>
			</div>
			<div style="margin-top: 15px;">
				<el-table :data="rightTableData" style="width: 100%" border @selection-change="rightSelectionChange">
					<el-table-column type="selection" width="55"  align="center">
					</el-table-column>
					<el-table-column prop="image" label="图片" align="center">
						<template slot-scope="scope">
							<el-popover placement="right" trigger="hover">
								<div class="__img_item mar-auto" :style="{width:'200' + 'px', height:'200' + 'px'}">
									<img class="loadingImg" v-lazy="scope.row.image" style="object-fit: contain;overflow: hidden;">
								</div>
								<div class="__img_item" slot="reference" style="margin: 0 auto;">
									<img class="loadingImg" :key="scope.row.image" v-lazy="scope.row.image?scope.row.image:'-'">
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="nameCn" label="产品名称" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.nameCn">
								<div>{{scope.row.nameCn}}</div>
								<div>{{scope.row.nameEn}}</div>
							</div>
							<span v-else>-</span>
						</template>
					</el-table-column>
					<el-table-column prop="sysSku" label="系统SKU" align="center">
					</el-table-column>
					<el-table-column prop="repoSku" label="仓库SKU" align="center">
					</el-table-column>
					<el-table-column label="属性" align="center">
						<template slot-scope="scope">
							<div v-if="scope.row.variantProperty && scope.row.variantProperty.length">
								<div v-for="item in scope.row.variantProperty">{{item.propertyName}} : {{item.propertyValueShort}}</div>
							</div>
							<span v-else>-</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props:['params'],
		data() {
			return {
				leftTableData:[],
				rightTableData:[],
				parentInput: null,
				changeLeftData:[],
				changeRightData:[],
				paramsData:[],
			}
		},
		methods: {
			leftSelectionChange(e) {
				this.changeLeftData = e
			},
			rightSelectionChange(e){
				this.changeRightData = e
			},
			getChildList(data){
				this.leftTableData = [...this.leftTableData , ...data]
			},
			changeMoreMethod(){
				this._openDialog({
				  title: '选择产品',
				  width:'70%',
				  params: {
					  params:{
						  data:this.paramsData,
						  fn:this.getChildList
					  }				  
				  },
				  component: () => import('./moveProductItem.vue'),
				  okBtnText: '确认选择',
				  cancelBtnText: '取消'
				})
			},
			delLeftMethod(){
				this.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
					let list = this.changeLeftData.map((e)=>{return e.productRepoId})
					list.forEach(e=>{
						let delIndex = this.leftTableData.findIndex((i,index)=>{
							return i.productRepoId === e
						})
						this.leftTableData.splice(delIndex,1)
					})
					this.$message.success('删除成功')
				}).catch(()=>{})
			},
			getRightList(){
				let params = {
					productRepoIds:this.paramsData.map(e=>e.productRepoId),
					search:this.parentInput
				}
				this.$api['product/prProductRepoParentList'](params).then((res)=>{
					this.rightTableData = res.rows
				}).catch((e)=>{
					this.rightTableData = this.paramsData.slice(0) 
				})
			},
			_submit(){
				if(this.changeLeftData.length == 0) return this.$message.warning('请选择左边列表,至少一项')
				if(this.changeRightData.length != 1) return this.$message.warning('请选择右边列表,只能一项')
				let params = {
					productRepoIds:this.changeLeftData.map(e=>e.productRepoId),
					targetProductParentRepoId:this.changeRightData[0].productRepoId
				}
				return this.$api['product/prProductRepoMoveVariant'](params)
			}
		},
		mounted(){
			this.paramsData = this.params.data.slice(0)
			this.leftTableData = this.paramsData
			this.getRightList()
		}
	}
</script>

<style scoped lang="scss">
	.leftTable {
		width: 48%;
		height: 100%;
	}
	.rightTable {
		width: 48%;
		height: 100%;
	}
	.__img_item {
	  width: 40px;
	  height: 40px;
	  overflow: hidden;
	  background-color: #fff;
	
	  img {
	    margin: 0;
	    padding: 0;
	    width: 100%;
	    height: 100%;
	    object-fit: contain;
	  }
	
	  img[lazy=loaded] {
	    background: #fff;
	  }
	}
</style>

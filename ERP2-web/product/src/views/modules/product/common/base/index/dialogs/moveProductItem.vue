<template>
	<div style="display: flex;width:100%;height: 100%;justify-content: space-between;">
		<div class="rightTable">
			<div style="margin-top: 15px;">
				<el-input v-model.trim='inputContent' size="small" style="width: 50%;" placeholder="输入仓库SKU/系统SKU/名称" clearable></el-input>
				<el-button type="primary" size="small" style="margin-left: 10px;" @click="getList">搜索</el-button>
			</div>
			<div style="margin-top: 15px;">
				<el-table :data="tableData" style="width: 100%" border @selection-change="selectionChange">
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
				tableData:[],
				selectionData:[],
				systemCategoryId:null,
				inputContent:null,
			}
		},
		methods: {
			selectionChange(e){
				this.selectionData = e
			},
			getList(){
				let params = {
					systemCategoryId:this.systemCategoryId,
					search:this.inputContent,
				}
				this.$api['product/prProductRepoChildList'](params).then((res)=>{
					this.tableData = res.rows
				}).catch(()=>{
					this.tableData = [
						{
							productRepoId:1,
							image: null,
							nameCn: null,
							nameEn: null,														
						},
						{
							productRepoId:2,
							image: null,
							nameCn: null,
							nameEn: null,														
						}
					]
				})
			},
			_submit(){
				// if(selectionData.length == 0) return this.$message.warning('请至少选择一项')
				this.$attrs.fn(this.selectionData)
				return Promise.resolve('close')
			}
		},
		mounted(){
			this.getList()
		}
	}
</script>

<style scoped lang="scss">
	.rightTable {
		width: 100%;
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

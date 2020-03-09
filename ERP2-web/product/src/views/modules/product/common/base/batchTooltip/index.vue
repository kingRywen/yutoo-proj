<template>
	<div>
		<div v-if="this.$route.name === '批量提示'">
			<div>
				<div>
					<span class="msgClass">{{msg}}</span>
					<el-button size="small" plain type="primary" icon="el-icon-back" style="float: right;" @click="returnGo">返回</el-button>
				</div>
				<el-table :data="tableData" style="width: 100%;margin-top: 30px;" >
					<el-table-column prop="repoSku" label="仓库SKU" width="250">
					</el-table-column>
					<el-table-column prop="nameCn" label="产品中文名称" width="250">
					</el-table-column>
					<el-table-column prop="extraterritorialCircumstances" label="产品例外情况">
					</el-table-column>
				</el-table>
			</div>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				msg: '共处理条，成功条；失败条；忽略',
				tableData:[]
			}
		},
		methods:{
			returnGo(){
				this.$router.go(-1)
			}
		},
		mounted(){
			
			let data = JSON.parse(this.$route.query.data).rows
			console.log(data)
			this.msg = `共处理${data.totalCount}条;成功${data.success}条;失败${data.fail}条;忽略${data.ignore}条;`
			this.tableData = data.productList
		}
	}
</script>

<style scoped>
	.msgClass {
		font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
		font-weight: 700;
		font-style: normal;
		color: #FF9900;
	}
</style>

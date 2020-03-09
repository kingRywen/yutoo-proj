<template>
	<div>
		<el-cascader :props="props"></el-cascader>
		<div>
			{{obj}}
			<el-button @click="btnMethod">新增按钮</el-button>
			<el-button @click="delBtn">删除按钮</el-button>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			btnMethod(){
				this.$set(this.obj,'remake','123')
				console.log(this.obj)
			},
			delBtn(){
				this.$delete(this.obj,'remake')
			},
		},
		data() {
			let vm = this
			return {
				obj: {
					name: 'subinyu',
					id: 1
				},
				props: {
					lazy: true,
					lazyLoad(node, resolve) {
						setTimeout(() => {
							let parentId = node.value || null
							let nodes = []
							vm.$api['product/CateSystemCategoryTreeTitleRule']({
								parentId: parentId
							}).then((res) => {
								nodes = res.rows.map(e => ({
									value: e.parentId,
									label: e.systemCategoryName,
									leaf: e.childFlag
								}))
								resolve(nodes);
							})
						});
					}
				}
			};
		}
	};
</script>

<style>
</style>

<template>
	<MainLayout :outerParams="outerParams" :searchFields="searchFields" :editBtns="editBtns" :edits="edits" :showSearch="false"
	 :showSelection='false' :outerTableList='outerTableList' :columns="columns" :isShowPag='false' ref="layout">
	</MainLayout>

</template>

<script>
	export default {
		props: ["params"],
		data() {
			let vm = this
			return {
				edits: [],
				editBtns: [],
				searchFields: [],
				outerTableList: [],
				columns: [{
					label: '订单编号',
					value: 'id',
					minWidth: 150,
				}],

			}
		},
		mounted(){
			let list = this.params.list
			list.forEach((e)=>{
				this.outerTableList.push({id:e})
			})
		},
		computed: {
			outerParams() {
				return {

				}
			},
		},
	};
</script>

<style>
</style>

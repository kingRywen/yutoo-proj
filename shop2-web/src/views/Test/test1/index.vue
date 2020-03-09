<template>
	<div>
		<el-button @click="showDialog1">添加</el-button>
		<el-button @click="showDialog2">导入</el-button>
		<main-layout :showTable="false" ref="layout"></main-layout>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				
			}
		},
		methods:{
			showDialog1(){
				let params = {}
				this._openDialog({title:'配置公式',width:'100%',params:{params},component:() => import("./dialogs/add.vue"),okBtnText:'确认',cancelBtnText:'取消'})
			},
			showDialog2(){
				let params = {
					filename:'测试名称1',   
					importType:0,   
					fn:this.$refs.layout.closeDialog,
					success: this.$refs.layout.getList,
				}
				this.showDialogGlobal('导入','100%',params,() => import("Views/common/dialog/import.vue"))
			}
		}
	}
</script>

<style>
</style>

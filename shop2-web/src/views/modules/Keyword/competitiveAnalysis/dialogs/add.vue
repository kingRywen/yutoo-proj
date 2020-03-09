<template>
	<div>
		<addTasks :addOptions = "addOptions" @clearInput = 'clearInput' ref="child"   @changePlaceHolder="changePlaceHolder">	
			<div slot="leftContent">
				<el-form :model="formData" ref='formData'>
					<el-form-item prop="keyword">
						<el-input v-model="formData.keyword" type="textarea" rows="5"  :placeholder="placeText"></el-input>
					</el-form-item>
				</el-form>
			</div>
		</addTasks>
	</div>
</template>

<script>
	import addTasks from 'Views/common/dialog/addTasks.vue'
	export default{
		data(){
			return {
				//传给子组件参数
				addOptions:{
					num:200,     //限制的数量
					rightTitle:'关键词',   //右侧表格标题
					regText:this.$const['OTHER/keywordExp'],  //验证规则,现在是逐个验证;
					
				},
				placeText:`多个关键词换行输入，最多限制200个......`,
				formData:{
					keyword:null
				},
			}		
		},
		methods:{
			changePlaceHolder(data){
				this.placeText = data
			},
			//判断是否需要清空input,如果全部验证通过需要清空input,反之则留下未验证通过的;
			clearInput(data){
				if(data){
					this.formData.keyword = data
				}else{
					this.formData.keyword = null
					this.$nextTick(()=>{
						this.$refs.formData.clearValidate()
					})				
				}
			},
			_submit(){
				let [ ...childData ] = this.$refs.child.formList
				if(childData && childData.length == 0) return this.$message.warning('请添加关键词!')
				let params = {
					...this.storeInfo,
					keywords:childData		
				}
				return this.$api['keyword/taskKeywordCompeteSave'](params)
			}
		},
		components:{
			addTasks
		}
	}
</script>

<style>
</style>

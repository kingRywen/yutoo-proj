<template>
	<div>
		<addTasks :addOptions = "addOptions" :noAsin="formData.dataType == 1" @clearInput = 'clearInput' ref="child" @changePlaceHolder="changePlaceHolder">	
			<div slot="leftContent">
				<el-form :model="formData" ref='formData' label-width="90px" label-position="left">
					<el-form-item label="任务名称" prop="taskName" :rules="[{required:true,message:'请输入任务名称'}]">
						<el-input v-model="formData.taskName" size="small"></el-input>
					</el-form-item>
					<el-form-item label="数据类型" prop="dataType" :rules="[{required:true,message:'请选择数据类型'}]">
						<el-select v-model="formData.dataType" size="small" >
							<el-option label="ASIN" :value="0"></el-option>
							<el-option label="TOP100链接" :value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="formData.dataType == 0" prop="keyword" label-width="0">
						<el-input v-model="formData.keyword" type="textarea" rows="5" :placeholder="placeText"></el-input>
					</el-form-item>
					<el-form-item v-else-if="formData.dataType == 1" label="TOP100链接" prop="pcId" :rules="[{required:true,message:'请选择TOP100链接'}]">
						<el-cascader  @change="activeItemChange" ref="cas" :props="propsOption" size="small" v-model="formData.pcId"></el-cascader>
					</el-form-item>
					
				</el-form>
			</div>
		</addTasks>
	</div>
</template>

<script>
	import addTasks from 'Views/common/dialog/addTasks.vue'
	export default{
		props:['params'],
		data(){
			let vm = this
			return {
				//传给子组件参数
				addOptions:{
					rightTitle:'ASIN',   //右侧表格标题
					regText:this.$const["OTHER/asinExp"],  //验证规则,现在是逐个验证;
					num:200,
				},
				formData:{
					taskName: this.cfuns.geRandomNum(),
					dataType:0,
					pcId:null,
					keyword:null,
				},
				placeText:`多个ASIN换行输入，最多限制200个......`,
				propsOption:{
					lazy: true,
					checkStrictly: true,
					lazyLoad(node, resolve) {
						setTimeout(() => {
							let parentId = node.value || 0
							let nodes = []
							vm.$api['productAnalysis/categoryGetCategory']({
						        ...vm.storeInfo,
								parentPcid: parentId
							}).then((res) => {
								nodes = res.data.map(e => ({
									value: e.pcid,
									label: e.name,
									leaf: !e.haveChildren
								}))
								resolve(nodes);
							})
						});
					}
				}
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
			getNode(menu, id) {
				let child = [];
				[].forEach.call(menu, (el) => {
					child.push(...el.$children[0].$children)
				})
				child = child.filter(el => el.$options._componentTag === 'cascader-node')
				return child.find(el => el.value && el.value.slice().pop() === id.slice().pop())
			},
			activeItemChange(val) {
				let panal = this.$refs.cas.$refs.panel.$refs.menu
				let el = this.getNode(panal, val)
				if (el) {
					el.handleExpand()
				}
			},
			_submit(){
				if(this.formData.dataType === 0){
					var [ ...childData ] = this.$refs.child.formList
					if(childData && childData.length == 0) return this.$message.warning('请添加ASIN!')
				}
				return this.$refs.formData.validate().then(()=>{				
					let params = {
						...this.storeInfo,
						...this.formData,
						dataSource: this.formData.dataType === 0 ? childData : null	
					}
					params.pcId = params.pcId && params.pcId.length ? params.pcId.pop() : null
					delete params.keyword
					if(this.params.edit) params.taskId = this.params.data.taskId
					return this.$api['productAnalysis/ptSaveTask'](params)
				})
				
			}
		},
		mounted(){
			if(this.params && this.params.edit){
				let data = this.params.data
				this.formData.taskName = data.taskName
				this.formData.dataType = data.dataType
				if(this.params.data.dataType === 0){
					//ASIN
					this.$api['productAnalysis/ptAsinList']({...this.storeInfo,taskId:data.taskId}).then((res)=>{
						let asins = res.data.map((e)=>{
							return e.asin
						})
						this.$refs.child.formList = asins
					})
					
				}else if(this.params.data.dataType === 1){
					//TOP100链接
					this.formData.pcId = data.pcId
					
					
					//test
					//this.formData.pcId = 7919
					
				}
			}
		},
		components:{
			addTasks
		},
	}
</script>

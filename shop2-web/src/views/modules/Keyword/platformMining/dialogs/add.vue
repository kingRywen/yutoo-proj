<template>
	<div>
		<addTasks :addOptions = "addOptions" @clearInput = 'clearInput' ref="child"  @changePlaceHolder="changePlaceHolder">	
			<div slot="leftContent">
				<el-form :model="formData" ref='formData' label-position="left" label-width="80px">
					<el-form-item prop="originId" :rules="{required:true,message:'请选择来源'}" label="来源">
						<el-select v-model="formData.originId" size="small" @change="originChange">
							<el-option v-for="item in allData" :label="item.platformName" :value="item.platformId" :key="item.platformId"></el-option>
						</el-select>
					</el-form-item>
									
					<!-- 动态生成的el-form-item --> 
					
					<!-- 选择语言    目前只有google才有-->
					<el-form-item v-if="formData.originId === 6" prop="languageId" :rules="{required:true,message:'请选择语言'}" label="语言">
						<el-select v-model="formData.languageId" size="small">
							<el-option v-for="item in allData.find(e=>e.platformId === formData.originId).languages" :label="item.languageName" :value="item.languageId" :key="item.languageId"></el-option>
						</el-select> 
					</el-form-item>
					
					<!-- 选择类型 -->
					<el-form-item v-if="formData.originId === 4 && formData.originId" prop="keywordTypeItem"  :rules="{required:true,message:'请选择类型'}" label="选择类型" >
						<el-radio-group v-model="formData.keywordTypeItem" @change="radioChange">
						    <el-radio v-for="item in allData.find(e=>e.platformId === formData.originId).keywordTypes" :label="item.type" :key="item.type">{{CNNameMethod(item.type)}}</el-radio>
						</el-radio-group>
					</el-form-item>					
					<el-form-item v-else-if="formData.originId" prop="keywordTypes"  :rules="{required:true,message:'请选择类型'}" label="选择类型">
						<el-checkbox-group v-model="formData.keywordTypes">
							<el-checkbox v-for="item in allData.find(e=>e.platformId === formData.originId).keywordTypes" :label="item.type" :key="item.type">{{CNNameMethod(item.type)}}</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
					
					<!-- 深度 -->
					<el-form-item v-if="formData.originId && ( formData.keywordTypeItem === 0 || formData.keywordTypeItem === 1 || formData.keywordTypes.indexOf(0) !== -1 || formData.keywordTypes.indexOf(1) !== -1 )" prop="depth" :rules="{required:true,message:'请选择深度'}" label="深度">
						<el-select v-model="formData.depth" size="small">
							<el-option v-for="item in numList" :label="item" :value="item" :key="item"></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item prop="keyword" label-width="0">
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
			let vm =this
			return {
				//传给子组件参数
				addOptions:{
					num:200,     //限制的数量
					rightTitle:'关键词',   //右侧表格标题
					regText:this.$const['OTHER/keywordExp'],  //验证规则,现在是逐个验证;				
				},
				formData:{
					originId:null,		
					keywordTypeItem:null,
					keywordTypes:[],
					depth:null,
					languageId:null,
					keyword:null
				},
				placeText:`多个关键词换行输入，最多限制200个......`,
				allData:[],
				numList:[1,2,3,4,5],
				oldOriginId:null,
				oldRadioId:null,
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
			CNNameMethod(type){
				return type === 0 ? '相关词' 
				: type === 1 ? '下拉词'
				: type === 2 ? '联想词'
				: type === 3 ? 'TAG词'
				: '广告词'
			},
			originChange(e){
				this.formData.keywordTypeItem = null
				this.formData.keywordTypes = []
				
				
				//判断是否选中Wish的TAG词
				if(this.oldOriginId === 4 && this.oldRadioId === 3){
					this.addOptions.rightTitle = '关键词'
					this.$refs.child.formList = []
				}			
				this.oldOriginId = e
			},
			radioChange(e){
				if(e === 3){
					this.addOptions.rightTitle = '商品Id'
					this.$refs.child.formList = []
				}else if(this.oldRadioId === 3 && e !== 3){
					this.addOptions.rightTitle = '关键词'
					this.$refs.child.formList = []
				}
				this.oldRadioId = e
			},
			_submit(){
				let [ ...childData ] = this.$refs.child.formList
				if(childData && childData.length == 0) return this.$message.warning('请添加关键词!')
				return this.$refs.formData.validate().then(()=>{					
					let params = {
						...this.storeInfo,
						originId:this.formData.originId,
						keywordTypes:this.formData.originId === 4 ? [this.formData.keywordTypeItem] : this.formData.keywordTypes,
						depth:this.formData.keywordTypeItem === 0 || this.formData.keywordTypeItem === 1 || this.formData.keywordTypes.indexOf(0) !== -1 || this.formData.keywordTypes.indexOf(1) !== -1 ? this.formData.depth : null,
						languageId:this.formData.originId === 6 ? this.formData.languageId : null,
						keywords:childData		
					}
					return this.$api['keyword/taskKeywordDigSave'](params)
				})
			}
		},
		components:{
			addTasks
		},
		mounted(){
			let params = {num:1}
			this.$api['common/keywordTypeList'](params).then((res)=>{
				this.allData = res.data
			})
		},
		watch:{
			'formData.originId' :{
				handler(val){
					if(val === 6) {
						this.addOptions.num = 50
					}else{
						this.addOptions.num = 200
					}
				},
				deep:true,
			}
		}
	}
</script>
<template>
	<div v-loading="adLoading">
	    <el-form :model="formData" ref='formData'>
			<div>
				<el-form-item label-position="right" label-width="78px">
					<span slot="label" style="font-size: 14px;" >报告时长</span>
					<div style="display: flex;">
						<el-form-item prop="origin.timeType"  :rules="[{required:true,message:'请选择报告时长'}]" >
							<el-select size="small" v-model="formData.origin.timeType" @change="reportTimeChange"  placeholder="请选择广告时长">
								<el-option label="自定义时间段" :value="1" :key="1"></el-option>
								<el-option label="最近XX天" :value="2" :key="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item v-if="formData.origin.timeType == 1" prop="origin.dateRange"  :rules="[{required:true,message:'请选择时间段'}]" style="margin-left: 20px;">
							<el-date-picker
							  v-model="formData.origin.dateRange"
							  type="daterange"
							  size="small"
							  @change="reportDateChange"
							  value-format="yyyy-MM-dd"
							  unlink-panels
							></el-date-picker>
						</el-form-item>
						<el-form-item v-if="formData.origin.timeType == 2" prop="origin.days"  :rules="dayValidate" style="margin-left: 20px;">
							<el-input size="small" v-model.trim.number="formData.origin.days"><template slot="append">天</template></el-input>								
						</el-form-item>
					</div>		
				</el-form-item>
			</div>
			<div>
				<div style="width:100%;height:auto;margin-top: 10px;">
					<div style="background: rgb(242,242,242);height: 35px;line-height: 35px;">
						<span style="margin-left: 10px;">条件管理</span><el-button @click="isShowConditionDiv" type="text" :class="conditionShow==='none'?'el-icon-caret-bottom':'el-icon-caret-top'" style="font-size: 20px;padding-top: 5px;margin-left: 5px;" ></el-button>
					</div>								
					<div style="width: 100%;height: auto;padding: 10px;border: 1px solid rgb(242,242,242);" :style="{display:conditionShow}">
						<el-form-item prop="rule"  :rules="ruleValidate()">
							<MainLayout 
								:outerParams="outerParams" 
								:searchFields="searchFields" 
								:editBtns="editBtns" 
								:edits="edits" 
								:showSearch="false"
								:columns="columns"
								ref="layout" 
								:isShowPag = "false"
								:isShowTableLoading='false'
								:outerTableList = 'formData.rule'
							>
							</MainLayout>
						</el-form-item>
					</div>
				</div>
			</div>

			
			<!-- 策略 -->
			<div>
				<div v-for="(item,index) in formData.strategy" style="width:100%;height:auto;margin-top: 10px;">
					<div style="background: rgb(242,242,242);height: 30px;line-height: 30px;">
						<span style="margin-left: 10px;">策略{{index + 1}}</span><el-button @click="isShowDiv(index)" type="text" :class="item.divDisplay==='none'?'el-icon-caret-bottom':'el-icon-caret-top'" style="font-size: 20px;padding-top: 5px;margin-left: 5px;" ></el-button>					
						<el-tooltip v-if="formData.strategy.length > 1" class="item"  effect="light" content="删除指标" placement="top">
							<el-button  @click="delIndexMethod(index)" type="text" class="el-icon-delete" style="font-size: 20px;float: right;padding-top: 5px;margin-right: 10px;" ></el-button>
						</el-tooltip>
						
						<el-tooltip class="item"  effect="light" content="添加指标" placement="top">
							<el-button  @click="addIndexMethod" type="text" class="el-icon-circle-plus-outline" style="font-size: 20px;float: right;padding-top: 5px;margin-right: 20px;" ></el-button>
						</el-tooltip>
						
						<el-tooltip v-if="index < formData.strategy.length-1" class="item"  effect="light" content="降序，顺序置前的优先级更高" placement="top">
							<el-button  @click="sortDowmMethod(index)" type="text" class="el-icon-sort-down" style="font-size: 20px;float: right;padding-top: 5px;margin-right: 30px;" ></el-button>
						</el-tooltip>
						
						<el-tooltip v-if="index > 0" class="item"  effect="light" content="升序，顺序置后的优先级更低" placement="top">
							<el-button  @click="sortUpMethod(index)" type="text" class="el-icon-sort-up" style="font-size: 20px;float: right;padding-top: 5px;margin-right: 30px;" ></el-button>
						</el-tooltip>
					</div>								
					<div class="rule_content" style="width: 100%;height: auto;padding: 10px;border: 1px solid rgb(242,242,242);" :style="{display:item.divDisplay}">					
						<el-form-item class="form_item" prop="expression" :rules="strategyRule(item)"  >						
							<div class="lebelBox">
								<div class="lebelBtn">
									<div style="width: 100%;background:rgb(242,242,242);text-align: center;display:block;height: 30px;line-height: 30px;">链接符号</div>
									<el-button type="info" size="small" v-for="(itemBtn,indexBtn) in ruleList" :key="itemBtn" :style="{marginLeft: indexBtn == 0 ? '10px' : null,width: '40px'}"
									 @click="addBtnMethod(itemBtn,index)">{{itemBtn}}</el-button>
									<div style="width: 100%;background:rgb(242,242,242);text-align: center;display:block;height: 30px;line-height: 30px;">条件</div>
									<el-button type="info" size="small" v-for="(itemBtn,indexBtn) in ruleNameList" :key="itemBtn" :style="{marginLeft: indexBtn == 0 ? '10px' : null}"
									 @click="addBtnMethod(itemBtn,index)">{{itemBtn}}</el-button> 
								</div>
								<div class="lebel">
									<draggable v-model="item.formula" @start="drag=true" @end="drag=false" class="draggable">
										<div v-for="(itemChild,indexChild) in item.formula" :key="indexChild" class="formula-btn">
											<div class="btn-txt">
												<div style="background: rgb(188,188,188);color:#fff;padding: 0 10px 0 10px;margin-top: 8px;border-radius: 4px;">{{itemChild}}</div>									
											</div>
											<i class="el-icon-circle-close" @click="btnClose(index,indexChild)"></i>
										</div>
									</draggable>
								</div>
							</div>
						</el-form-item>
						<el-form-item label-width="110px" :prop="'strategy.'+index+'.handle'" :rules="[{required:true,message:'请选择处理方式'}]">
							<span slot="label" style="font-size: 14px;" >
								处理方式
								<el-tooltip effect="light" placement="top" content="满足以上条件执行以下操作">
								  <i
								    style="color: #108ee9;margin-left:2px"
								    class="el-icon-question"
								  />
								</el-tooltip>
							</span>
							<el-select size="small" v-model="item.handle">
								<el-option v-for="item in resultList" :value="item.value" :label="item.label" :key="item.value"></el-option>
							</el-select>
							<el-button type="primary" size="small" plain style="float: right;" @click="testMethod(item,index)">校验</el-button>
							<div  v-if="item.isShowError" style="color: #f56c6c;font-size: 12px;margin-right: 90px;float: right;">策略配置错误,请重新配置</div>
						</el-form-item>	
					</div>
				</div>
			</div>
	    </el-form>
	</div>
</template>

<script>
	import {dayValidate} from 'Utils/customValid.js'
	import draggable from 'vuedraggable'
	import {toCNStrZB,initData,strategyText} from 'Views/SuDemo/manual/js/noWord.js'
	export default {
		props: ["params","type"],
		data() {
			let vm = this
			return {
				isSHowtip:false,
				formData:{				
					origin:{
						timeType:null,
						start:null,
						end:null,
						days:null,
						dateRange:null,
					},
					rule:[],
					strategy:[
						{	
							formula:[],
							handle:null,
							divDisplay:'block',
							isShowError:false,
						},
					],
				},
				adLoading:false,
				dayValidate:{validator: dayValidate, trigger: 'blur',required:true},
				conditionShow:'block',
				edits: [
					{
					    name: '编辑',
					    icon: 'el-icon-edit-outline',
					    fn: (scope) => {
							vm.$refs.layout.$dialog({
								title:'编辑条件',
								width: '1120px',
								appendToBody:true,
								params:{
									fn:vm.setTableMethod,
									data:scope.row,
									edit:true,
									index:scope.$index,
									nameList:vm.formData.rule.map(e=>e.ruleName),
									type:this.type
								},
								component: () => import(`Views/SuDemo/manual/dialogs/main/item/noWord/addNoCl.vue`),
								okBtnText:'确认',
								cancelBtnText:'取消'
							})
					    }
					},
					{
					    name: '删除',
					    icon: 'el-icon-delete',
					    fn: (scope) => {
							vm.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
								vm.strategyDel([scope.row.ruleName])
								vm.formData.rule.splice(scope.$index,1)
								vm.$message.success('操作成功')
							}).catch(()=>{})
					    }
					}
				],
				editBtns: [
					{
						name:'添加',
						fn:()=>{
							vm.$refs.layout.$dialog({
								title:'添加条件',
								width: '1120px',
								appendToBody:true,
								params:{
									fn:vm.getTableMethod,
									nameList:vm.formData.rule.map(e=>e.ruleName),
									type:this.type
								},
								component: () => import(`Views/SuDemo/manual/dialogs/main/item/noWord/addNoCl.vue`),
								okBtnText:'确认',
								cancelBtnText:'取消'
							})
						}
					},
					{
						name:'删除',
						disabled:selection => {
							return selection.length == 0
						},
						fn:()=>{
							vm.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
								let data = vm.getSelection()
								let list = data.map((e)=>{return e.ruleName})
								vm.strategyDel(list)
								list.forEach(e=>{
									let delIndex = this.formData.rule.findIndex((i,index)=>{
										return i.ruleName === e
									})
									this.formData.rule.splice(delIndex,1)
								})
								this.$message.success('删除成功')
							}).catch(()=>{})
						}
					},
				],				
				columns: [
					{
						label: '条件名称',
						value: 'ruleName',					
					},
					{
						label: '统计方式',
						value: 'statType',
						enum:{
							0:'所有',
							1:'产品',
							2:'广告系列',
							3:'广告组',
							4:'广告词',
							5:'ASIN'
						}
					},
					{
						label: '广告时长',
						value: 'timeType',
						render(h,scope){
							let {timeType,dayStart,dayEnd,days} = scope.row
							return timeType == 0 ? (
								<span>全部</span>
							) : timeType == 1 ? (
								<span>{dayStart}天~{dayEnd}天</span>
							) : timeType == 2 ? (
								<span>最近{days}天</span>
							) : (
								<span>-</span>
							)
						}
					},
					{
						label: '指标',
						value: 'expression',
						render(h,scope){
							let {expression} = scope.row
							let str = toCNStrZB(expression)
							return (
								<el-tooltip class="item" effect="light" placement="top">
									<div slot="content">{str}</div>
								    <span class="fix__row_1">{str}</span>
								</el-tooltip>								
							)
						}
					},
				],
				searchFields:[],
				ruleList:['与','或','(',')'],
				validType:false,
			}
		},
		// 方法/
		methods: {
			strategyDel(arr){
				arr.forEach(e=>{
					this.formData.strategy.forEach(v=>{
						for(let i = v.formula.length - 1;i>=0;i--){
							if(v.formula[i] === e) v.formula.splice(i,1)
						}
					})
				})
			},
			strategyRule(e){
				let checkStrategy = (rule, value, cb) => {
					if ( e.formula && e.formula.length === 0) cb(new Error('请选择策略配置'))
					if ( e.formula.every((e)=>{return e==='与' || e==='或' || e==='(' || e===')'})) cb(new Error('请至少选择一个条件'))
					cb()					
				}
				return [
					{
						validator: checkStrategy
					}
				]
			},
			getInfo(data){
				initData(data,this).then((res)=>{
					setTimeout(()=>{
						this.formData = res
						this.adLoading = false
					})				
				}).catch(()=>{
					this.adLoading = false
				})
			},
			testMethod(e,index){
				let str = strategyText(e.formula)
				if(!str) return this.$message.warning('请配置指标')
				this.$api['adManualVerifyExpress']({type:1,express:str}).then((res)=>{
					if(res.result){
						this.formData.strategy[index].isShowError = false
						return this.$message.success('校验通过')						
					}else{
						this.formData.strategy[index].isShowError = true
					}
				})
			},
			reportTimeChange(e){
				let origin = this.formData.origin
				origin.start = null
				origin.end = null
				origin.days = null
				origin.dateRange = null
			},
			reportDateChange(e){
				let origin = this.formData.origin
				origin.start = e[0]
				origin.end = e[1]
			},
			isShowConditionDiv(){
				this.conditionShow = `${this.conditionShow === 'block' ? 'none' : 'block'}`
			},
			getTableMethod(data){
				this.formData.rule.push(data)
			},
			setTableMethod(type,data,index){
				if(type === 1){
					this.formData.rule.splice(index,1,data)
				}else if(type === 2){
					this.formData.strategy.forEach((e)=>{
						e.formula.forEach((v,i,arrChild)=>{
							if(v === data) arrChild[i] = index
						})
					})
				}				
			},
			isShowDiv(index){
				this.formData.strategy[index].divDisplay = `${this.formData.strategy[index].divDisplay === 'block' ? 'none' : 'block'}`
			},
			addIndexMethod(){
				this.formData.strategy.push({	
					formula:[],
					handle:null,
					divDisplay:'block',
					isShowError:false,
				})
			},
			delIndexMethod(index){
				this.formData.strategy.splice(index,1)
			},
			addBtnMethod(item,index){
				this.formData.strategy[index].formula.push(item)
			},
			btnClose(index,indexChild){
				this.formData.strategy[index].formula.splice(indexChild,1)
			},
			sortDowmMethod(index){
				let [...arr] = this.formData.strategy
				this.$set(this.formData.strategy,index,arr[index+1])
				this.$set(this.formData.strategy,index+1,arr[index])
			},
			sortUpMethod(index){
				let [...arr] = this.formData.strategy
				this.$set(this.formData.strategy,index,arr[index-1])
				this.$set(this.formData.strategy,index-1,arr[index])
			},
			ruleValidate(){
				let checkRule = (rule, value, cb) => {
					let data = this.formData.rule
					if ( data && data.length === 0) {
						cb(new Error('请添加条件'))
					}
					cb()					
				}
				return [
					{
						validator: checkRule
					}
				]
			},
			validateFn(){
				if(this.type === 'first'){
					//广告词
					return this.$refs.formData.validate().then(()=>{
						//检查有没有策略配置不通过的
						// if(this.formData.strategy.some(e=>e.isShowError)){
						// 	console.log('不通过')
						// 	return Promise.reject(this.type)
						// }
					}).catch(()=>{
						return Promise.reject(this.type)
					})
				}else{
					//其他
					let form = this.formData
					if(Object.values(form.origin).every(e=>e === null) && form.rule.length == 0 && form.strategy.length == 1){
						this.validType = false
						return Promise.resolve()
					}else{
						return this.$refs.formData.validate().then(()=>{
							this.validType = true
						}).catch(()=>{
							this.validType = false
							return Promise.reject(this.type)
						})
					}
				}
			}
		},
		computed: {
			outerParams() {
				return {}
			},
			ruleNameList() {
				let list = this.formData.rule.map(e=>e.ruleName)
				return list
			},
			resultList(){
				let list = this.type === 'first' ? [
					{label:'加入精确否定',value:0},
					{label:'加入词组否定',value:1},
					{label:'暂停广告',value:2},
					{label:'人工筛选',value:3},
				] : this.type === 'second' ? [
					{label:'加入精确否定',value:0},
					{label:'加入词组否定',value:1},
					{label:'人工筛选',value:3},
				] : this.type === 'third' ? [
					{label:'暂停广告',value:2},
				] : [
					{label:'暂停广告',value:2},
					{label:'人工筛选',value:3},
					{label:'加入排除',value:4},
				]
				return list
			}
		},
		components:{
			draggable
		}
	};
</script>

<style lang="scss" scoped>
	@import 'Views/SuDemo/manual/css/addNoCl.scss';
</style>
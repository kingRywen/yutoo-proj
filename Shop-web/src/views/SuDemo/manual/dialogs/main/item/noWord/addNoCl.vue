<template>
	<div>
		<el-form :model="formData" ref="formData" class="rule_content">
			<el-form-item label="条件名称" prop="ruleName"  label-width="80px" class="form_item" :rules="[{required:true,trigger:'blur',message:'请输入条件名称'}]">
				<el-input v-model.trim="formData.ruleName" placeholder="请输入条件名称" size="small" />
			</el-form-item>
			<el-form-item label="统计方式" prop="statType"  label-width="80px" class="form_item" :rules="[{required:true,trigger:'change',message:'请选择统计方式'}]">
				<el-select v-model="formData.statType" placeholder="请选择统计方式" style="width: 100%;"  size="small">
					<el-option v-for="item in statList" :value="item.value" :label="item.label" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item class="form_item"  label-width="80px">
				<span slot="label"><span style="color: #f56c6c;margin-right: 4px;">*</span>广告时长</span>
				<div style="display: flex;">
					<el-form-item prop="timeType"  :rules="[{required:true,message:'请选择广告时长'}]" >
						<el-select size="small" v-model="formData.timeType" @change="reportTimeChange" placeholder="请选择广告时长" style="width: 210px;">
							<el-option label="全部" :value="0" :key="0"></el-option>
							<el-option label="自定义时间段" :value="1" :key="1"></el-option>
							<el-option label="最近XX天" :value="2" :key="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item v-if="formData.timeType == 1" style="margin-left: 20px;">
						<div style="display: flex;">
							<el-form-item prop="dayStart" :rules="StartRule()">
								<el-input size="small" v-model.trim.number="formData.dayStart"><template slot="append">天</template></el-input>		
							</el-form-item>
							&nbsp;~&nbsp;
							<el-form-item prop="dayEnd"  :rules="EndRule()">
								<el-input size="small" v-model.trim.number="formData.dayEnd"><template slot="append">天</template></el-input>		
							</el-form-item>
						</div>						
					</el-form-item>
					<el-form-item v-if="formData.timeType == 2" prop="days"  :rules="dayValidate" style="margin-left: 20px;">
						<el-input size="small" v-model.trim.number="formData.days"><template slot="append">天</template></el-input>								
					</el-form-item>
				</div>		
			</el-form-item>
			<el-form-item class="form_item" prop="expression"  label-width="80px" :rules="indexRule()">
				<span slot="label"><span style="color: #f56c6c;margin-right: 4px;">*</span>指标配置</span>
				<div class="lebelBox">
					<div class="lebelBtn">
						<div style="width: 100%;background:rgb(242,242,242);text-align: center;display:block;height: 30px;line-height: 30px;">数据项</div>
						<el-button type="info" size="small" v-for="(item,index) in ruleList" :key="item.value" :style="{marginLeft: index == 0 ? '10px' : index == 5 || index == 7 || index == 9  ? '10px' : null,width:index>3 ? '90px' : '40px'}"
						 @click="addBtnMethod(item,index)">{{item.label}}</el-button>
					</div>
					<div class="lebel">
						<draggable v-model="formData.expression" @start="drag=true" @end="drag=false" class="draggable">
							<div v-for="(item,index) in formData.expression" :key="index" class="formula-btn">
								<div class="btn-txt" v-if="item.key === 9" style="display: flex;">
									<div style="background: rgb(188,188,188);color:#fff;border-radius: 4px;margin-top: 7px;padding: 2px 10px 25px;">{{item.first}}</div>
									<el-form-item :prop="'expression.'+index+'.second'" :rules="[{required:true,message:'请选择'}]">										
										<el-select v-model="item.second" placeholder="请选择" size="mini" style="width:90px;" :clearable="true">
											<el-option v-for="item in symbolList" :label="item" :key="item" :value="item" ></el-option>
										</el-select>
									</el-form-item>
									<el-form-item :prop="'expression.'+index+'.third'" :rules="[{required:true,message:'请输入'}]" style="margin-left: 5px;">										
										<el-input v-model.trim="item.third" placeholder="请输入" size="mini" style="width:90px;" :clearable="true"></el-input>
									</el-form-item>
									<el-form-item :prop="'expression.'+index+'.fourth'" :rules="[{required:true,message:'请选择'}]" style="margin-left: 5px;">										
										<el-select v-model="item.fourth" placeholder="请选择" size="mini" style="width:90px;" :clearable="true">
											<el-option label="%" :key="1" value="%" ></el-option>
											<el-option label="次" :key="2" value="次" ></el-option>
										</el-select>
									</el-form-item>
								</div>
								<div class="btn-txt" v-else-if="item.key >3 && item.key < 9"  style="display: flex;">
									<div style="background: rgb(188,188,188);color:#fff;border-radius: 4px;margin-top: 7px;padding: 2px 10px 25px;">{{item.first}}</div>
									<el-form-item :prop="'expression.'+index+'.second'" :rules="[{required:true,message:'请选择'}]">										
										<el-select v-model="item.second" placeholder="请选择" size="mini" style="width:90px;" :clearable="true">
											<el-option v-for="item in symbolList" :label="item" :key="item" :value="item" ></el-option>
										</el-select>
									</el-form-item>
									<el-form-item :prop="'expression.'+index+'.third'" :rules="[{required:true,message:'请输入'}]" style="margin-left: 5px;">										
										<el-input v-model.trim="item.third" placeholder="请输入" size="mini" style="width:90px;" :clearable="true"></el-input>
									</el-form-item>									
								</div>
								<div class="btn-txt" v-else>
									<div style="background: rgb(188,188,188);color:#fff;padding: 0 10px 0 10px;margin-top: 8px;border-radius: 4px;">{{item.first}}</div>									
								</div>
								<i class="el-icon-circle-close" @click="btnClose(index)"></i>
							</div>
						</draggable>
					</div>
				</div>
			</el-form-item>
			<el-form-item class="form_item"></el-form-item>	
		</el-form>
	</div>
</template>
<script>
	import draggable from 'vuedraggable'
	import {dayValidate} from 'Utils/customValid.js'
	import {conditionResult} from 'Views/SuDemo/manual/js/noWord.js'
	export default {
		props: ['params'],
		data() {
			return {
				formData:{
					ruleName:null,
					statType:null,
					timeType:null,
					dayStart:null,
					dayEnd:null,
					days:null,
					expression:[],
				},
				dayValidate:{validator: dayValidate, trigger: 'blur',required:true},
				statList:[
					{label:'所有',value:0},
					{label:'产品',value:1},
					{label:'广告系列',value:2},
					{label:'广告组',value:3},
					{label:'广告词',value:4},
				],
				ruleList:[
					{label:'与',value:'and',key:0},
					{label:'或',value:'or',key:1},
					{label:'(',value:'(',key:2},
					{label:')',value:')',key:3},
					{label:'花费',value:'cost',key:4},
					{label:'ACOS',value:'acos',key:5},
					{label:'转化率',value:'adConversionRates',key:6},
					{label:'点击率',value:'clickRates',key:7},
					{label:'订单量',value:'adOrderCnt',key:8},
					{label:'无效点击数',value:'noDealClicks',key:9},
				],
				symbolList:['>','<','=','>=','<='],
				outerRuleName:null,
			};
		},
		methods: {
			_submit() {
				return this.$refs.formData.validate().then(()=>{
					if(this.params.nameList.includes(this.formData.ruleName) && this.outerRuleName !== this.formData.ruleName){
						this.$message.error('存在相同的条件名称')
					}else{
						//校验一下
						let testText = conditionResult(this.formData.expression)
						return this.$api['adManualVerifyExpress']({type:0,express:testText}).then((res)=>{
							if(res.result){
								if(this.params.edit){
									this.params.fn(1,this.formData,this.params.index)
									this.params.fn(2,this.outerRuleName,this.formData.ruleName)
								}else{
									this.params.fn(this.formData)
								}					
								this.$message.success('操作成功')
								return Promise.resolve('close')
							}else{
								this.$message.error('指标配置错误,请重新配置')
							}						
						})										
					}				
				})
			},
			reportTimeChange(e){
				this.formData.dayStart = null
				this.formData.dayEnd = null
				this.formData.days = null
			},
			addBtnMethod(e,index){
				this.formData.expression.push({
					first:e.label,
					second:null,
					third:null,
					fourth:e.key === 5 || e.key === 6 || e.key === 7 ? '%' : null,
					value:e.value,
					key:e.key
				})
			},
			indexRule() {
				let checkIndex = (rule, value, cb) => {
					let data = this.formData.expression
					if ( data && data.length === 0) {
						cb(new Error('请选择指标配置'))
					}
					cb()					
				}
				return [
					{
						validator: checkIndex
					}
				]
			},
			StartRule(){
				let checkStart = (rule, value, cb) => {
					let data = this.formData.dayStart
					if ( !data ) {
						cb(new Error('请输入最小天数'))
					}
					if(isNaN(Number(data))){
						cb(new Error('请输入数字'));
					}
					if( this.formData.dayEnd && data > this.formData.dayEnd){
						cb(new Error('天数不能大于最大天数'));
					}else{
						cb()
					}
				}
				return [
					{
						validator: checkStart
					}
				]
			},
			EndRule(){
				let checkStart = (rule, value, cb) => {
					let data = this.formData.dayEnd
					if ( !data ) {
						cb(new Error('请输入最大天数'))
					}
					if(isNaN(Number(data))){
						cb(new Error('请输入数字'));
					}
					if( this.formData.dayStart && data < this.formData.dayStart){
						cb(new Error('天数不能小于最小天数'));
					}else{
						cb()
					}					
				}
				return [
					{
						validator: checkStart
					}
				]
			},
			btnClose(index){
				this.formData.expression.splice(index,1)
			}
		},
		mounted() {
			if(this.params && this.params.edit){
				let data = this.deepCopyGlobal(this.params.data)
				this.formData = data
				this.outerRuleName = data.ruleName
			} 
			if(this.params.type === 'fourth'){
				this.statList.splice(4,1,{label:'ASIN',value:5})
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

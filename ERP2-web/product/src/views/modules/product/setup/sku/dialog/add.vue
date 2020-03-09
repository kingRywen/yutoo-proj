<template>
    <div>
        <el-form :model="formData" ref="formData" label-width="90px" class="rule_content">
            <el-form-item label="规则名称" prop="ruleName" class="form_item" :rules="[{required:true,trigger:'blur',message:'请输入规则名称'}]">
                <el-input v-model.trim="formData.ruleName" placeholder="请输入规则名称" />
            </el-form-item>
			<el-form-item label="店铺名称" prop="storeId" class="form_item" :rules="[{required:true,trigger:'change',message:'请选择店铺名称'}]"  v-if="this.params.type === 'shop'">
			    <el-select v-model="formData.storeId" placeholder="请选择店铺名称" style="width: 100%;" >
					<el-option v-for="item in shopList" :value="item.key" :label="item.value" :key="item.key" ></el-option>
				</el-select>
			</el-form-item>
            <el-form-item class="form_item" label="规则" prop="ruleFormal" :rules="formalRule()" >
                <div class="lebelBox">
                    <div class="lebelBtn">
                        <el-button
                          type="info"
                          size="small"
                          v-for="(item,index) in ruleList"
                          :key="item.key"
						  :style="{marginLeft: index == 0 ? '10px' : null}"
						  :disabled="btnDisMethod(item)"
						  @click="addBtnMethod(item,index)"
                        >{{item.value}}</el-button>
                    </div>
                    <div class="lebel">
                        <draggable v-model="formData.ruleFormal" @start="drag=true" @end="drag=false" class="draggable">
                            <div v-for="(item,index) in formData.ruleFormal" :key="index" class="formula-btn">
								<div class="btn-txt" v-if="item.input">
									<el-input v-model.trim="item.text" placeholder="请输入" size="mini" style="width:90px;" :clearable="true"></el-input>
								</div>
								<div class="btn-txt" v-if="!item.input">{{item.label}}</div>
								<i class="el-icon-circle-close" @click="btnClose(index)"></i>
                            </div>
                        </draggable>
                    </div>
                </div>
            </el-form-item>
            <el-form-item class="form_item" label="规则描述"  prop="ruleDesc">
                <div class="textarea">
                    <el-input v-model.trim='formData.ruleDesc' type="textarea" :autosize="{ minRows: 2, maxRows: 99}" />
                </div>
            </el-form-item>
            <el-form-item class="form_item" label="预览">
                <div class="preview_inputBox">
					<el-input v-model.trim="skuText" @input.native="skuTextMethod" style="width: 30%;" ></el-input>
                    <span>{{skuPreview && skuText ? skuPreview : '选择规则输入预览'}}</span>
                </div>
            </el-form-item>
            <el-form-item class="form_item"  prop="activateFlag">
                <el-checkbox v-model="formData.activateFlag" :true-label="1" :false-label="0">是否激活</el-checkbox>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	import draggable from 'vuedraggable'
	import {arrToStr,strToArr} from '../js/index.js'
	export default{
		data(){
			return {
				ruleList:[],
				shopList:[],
				skuText:'',
				skuPreview:null,
				formData:{
					ruleName:null,
					ruleFormal:[],
					storeId:null,
					ruleDesc:null,
					activateFlag:0,
				}
			}
		},
		methods:{
			addBtnMethod(item,index){
				this.formData.ruleFormal.push({
					label:item.value,
					value:item.key,
					input:item.key === 7 ? true :false,
					text:null,
				})
			},
			btnClose(index){
				this.formData.ruleFormal.splice(index,1)
			},
			_submit(){
				return this.$refs.formData.validate().then(()=>{	
					let params = JSON.parse(JSON.stringify(this.formData))
					params.ruleUseType =  this.params.type === 'shop' ? 1 : 0
					let data = arrToStr(params.ruleFormal)
					params.ruleFormal =  data.ruleStr
					params.ruleFormalIdArray =  data.ruleFormalIdArray
					params.fixedString =  data.fixedString
					console.log(params)
					return this.$api[`${ this.params.edit ? 'product/PrConfigSkuRuleUpdate' : 'product/PrConfigSkuRuleSave' }`](params)
				})
			},
			skuTextMethod(){
				if(this.formData.ruleFormal && this.formData.ruleFormal.length === 0) return
				if( this.formData.ruleFormal.find(e=>e.value === 7) && !this.formData.ruleFormal.find(e=>e.value === 7).text ) return 
				let params = {
					keyword : this.skuText,
					fixedString: this.formData.ruleFormal.find(e=>e.value === 7) && this.formData.ruleFormal.find(e=>e.value === 7).text ? this.formData.ruleFormal.find(e=>e.value === 7).text : null,
					ruleFormalIdArray: arrToStr(this.formData.ruleFormal).ruleFormalIdArray,
					ruleUseType : this.params.type === 'shop' ? 1 : 0
					
				}
				this.$api['product/PrConfigSkuRulePreview'](params).then((res)=>{
					this.skuPreview = res.rows
				})
			},
			btnDisMethod(item){
				return this.formData.ruleFormal.some(e=>e.value === item.key)
			},
			formalRule() {
				let checkFormal = (rule, value, cb) => {
					let data = this.formData.ruleFormal
					if ( data && data.length === 0) {
						cb(new Error('请选择规格'))
					}
					if( data.some(e=>e.value === 1) || data.some(e=>e.value === 2) || data.some(e=>e.value === 3) || data.some(e=>e.value === 4)){
						if(data.some(e=>e.value === 5) ){
							cb()
						}else{
							cb(new Error('必须有父SKU'))
						}
					}else{
						cb(new Error('随机4位数字,随机4位字母,随机4位数字字母,变体属性至少要选一项'))
					}					
				}
				return [
					{
						validator: checkFormal
					}
				]
			},
		},
		components:{
			draggable
		},
		mounted(){
			this.$api['product/PrConfigSkuRuleDropDownRepo']({}).then((res)=>{
				this.ruleList = res.rows
			})			
			this.$nextTick(function(){
				if(this.params && this.params.edit){
					this.$api['product/PrConfigSkuRuleInfo']({id:this.params.skuRuleId}).then((res)=>{
						let data = res.rows
						data.ruleFormal = strToArr(data,this.ruleList)
						this.formData = data
					})
				}
				if(this.params && this.params.type === 'shop'){
					this.$api['product/GlStoreDropDown']({}).then((res)=>{
						this.shopList = res.rows
					})					
				}				
			})
		},
		props:['params']
	}
</script>

<style lang="scss" scoped>
	@import '../css/skuAdd.scss';
</style>

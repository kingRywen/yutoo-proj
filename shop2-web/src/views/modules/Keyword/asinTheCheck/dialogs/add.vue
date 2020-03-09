<template>
	<div class="w30p">
		<el-form :model="formData" ref='formData'>
			<el-form-item prop="compareType">
				<el-checkbox v-model="formData.compareType" :true-label="1" :false-label="0">ASIN对比</el-checkbox>
				<ElTooltip content="选择ASIN对比,必须输入对比ASIN,会对比分析产品的排名情况" placement="right" style="margin-left: 10px;">
					<i class="el-icon-info"></i>
				</ElTooltip>
			</el-form-item>
			<div style="display: flex;justify-content: space-between;">
				<el-form-item prop="asin" :style="{width:formData.compareType ? '49%' : '100%'}" :rules="asin1Rule()">
					<el-input size="medium" v-model="formData.asin" @change="asinInputMethod" :disabled="asinTagShow" :placeholder="asinTagShow ? '' : '请输入ASIN'">
						<template slot="prepend" v-if="asinTagShow">
							<el-tag type="warning" closable @close="asinTagMethod()">{{asinTagText}}</el-tag>
						</template>
					</el-input>		
				</el-form-item>
				<el-form-item prop="compareAsin" style="width: 49%;" v-if="formData.compareType"  :rules="asin2Rule()">
					<el-input size="medium" v-model="formData.compareAsin" @change="ConAsinInputMethod" :disabled="ConAsinTagShow" :placeholder="ConAsinTagShow ? '' : '请输入竞争产品ASIN'">
						<template slot="prepend" v-if="ConAsinTagShow">
							<el-tag type="warning" closable @close="ConAsinTagMethod()">{{ConAsinTagText}}</el-tag>
						</template>
					</el-input>		
				</el-form-item>
			</div>
			
			<el-form-item prop="matchType">
				<el-checkbox v-model="formData.matchType" :true-label="1" :false-label="0">完全匹配</el-checkbox>
				<ElTooltip content="勾选完全匹配,将不获取相关变体的关键词" placement="right" style="margin-left: 10px;">
					<i class="el-icon-info"></i>
				</ElTooltip>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				formData:{
					asin:null,
					compareAsin:null,
					compareType:0,
					matchType:0,
				},
				asinTagText:null,
				ConAsinTagText:null,
				asinTagShow:false,
				ConAsinTagShow:false,
				asinRule:/^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
			}		
		},
		methods:{
			asinInputMethod(e){
				if(e && this.asinRule.test(e)){
					this.asinTagShow = true
					this.asinTagText = e
					this.formData.asin = ''
				}else{
					this.formData.asin = ''
				}
			},
			asinTagMethod(){
				this.asinTagShow = false
				this.asinTagText = null
			},
			ConAsinInputMethod(e){
				if(e && this.asinRule.test(e)){
					this.ConAsinTagShow = true
					this.ConAsinTagText = e
					this.formData.compareAsin = ''
				}else{
					this.formData.compareAsin = ''
				}
			},
			ConAsinTagMethod(){
				this.ConAsinTagShow = false
				this.ConAsinTagText = null
			},
			asin1Rule(){
				let asin1Rule = (rule, value, cb) => {
					if ( !this.asinTagText) cb(new Error('请输入正确的ASIN'))
					if ( this.ConAsinTagText == this.asinTagText) cb(new Error('ASIN和竞争产品ASIN不能一样'))
					cb()					
				}
				return [
					{
						validator: asin1Rule,
						trigger:'blur'
					}
				]
			},
			asin2Rule(){
				let asin2Rule = (rule, value, cb) => {
					if ( !this.ConAsinTagText && this.formData.compareType  ) cb(new Error('请输入正确的ASIN'))
					if ( this.ConAsinTagText == this.asinTagText) cb(new Error('ASIN和竞争产品ASIN不能一样'))
					cb()					
				}
				return [
					{
						validator: asin2Rule,
						trigger:'blur'
					}
				]
			},
			_submit(){
				return this.$refs.formData.validate().then(()=>{
					let params = {
						...this.storeInfo,
						asin:this.asinTagText,
						compareType:this.formData.compareType,
						matchType:this.formData.matchType,
						compareAsin:this.formData.compareType ? this.ConAsinTagText : null
					}
					return this.$api['keyword/taskKeywordAsinReverseMerSave'](params)
				})
			}
		},
	}
</script>

<style>
</style>

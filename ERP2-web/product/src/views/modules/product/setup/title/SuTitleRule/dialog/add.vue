<template>
	<div v-loading=" this.params && this.params.edit ? dataLoading : false">
		<el-form :model="formData" ref="formData" label-width="90px" class="rule_content">
			<el-form-item label="标题名称" prop="ruleName" class="form_item" :rules="[{required:true,trigger:'blur',message:'请输入标题名称'}]">
				<el-input v-model.trim="formData.ruleName" placeholder="请输入标题名称" />
			</el-form-item>
			<el-form-item label="平台类型" prop="platId" class="form_item" :rules="[{required:true,trigger:'change',message:'请选择平台类型'}]">
				<el-select v-model="formData.platId" placeholder="请选择平台类型" style="width: 100%;">
					<el-option label="Amazon" :key="1" :value="1"></el-option>
					<el-option label="eBay" :key="2" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="适用店铺" prop="storeIds" class="form_item" :rules="[{required:true,message:'请选择适用店铺'}]">
				<el-select @change="shopMethod" v-model="formData.storeIds" multiple collapse-tags placeholder="请选择适用店铺" style="width: 100%;">
					<el-option v-for="item in shopList" :label="item.value" :key="item.key" :value="item.key"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="适用类目" prop="systemCategoryId" class="form_item">
				<el-cascader @change="activeItemChange" ref="cas" v-model="formData.systemCategoryId" :props="props" placeholder="请选择适用类目"
				 style="width: 100%;"></el-cascader>
			</el-form-item>

			<el-form-item class="form_item" label="规则" prop="ruleFormal" :rules="[{required:true,trigger:'blur',message:'请选择规则'}]">
				<div class="lebelBox">
					<div class="lebel">
						<el-button type="info" size="small" v-for="(item,index) in ruleList" :key="index" :style="{marginLeft: index == 0 ? '10px' : null}"
						 :disabled="btnDisMethod(item)" @click="addBtnMethod(item,index)">{{item.value}}</el-button>
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
			<el-form-item class="form_item" label="规则描述：" prop="ruleDesc">
				<div class="textarea">
					<el-input v-model.trim='formData.ruleDesc' type="textarea" :autosize="{ minRows: 2, maxRows: 99}" />
				</div>
			</el-form-item>
			<el-form-item class="form_item" label="预览：">
				<div class="preview_inputBox">
					<el-input v-if="isShowPre" v-model.trim="skuText" @input.native="skuTextMethod"  ></el-input>
					<span>{{skuPreview  ? skuPreview : '选择规则输入标题名称预览'}}</span>
				</div>
			</el-form-item>
			<el-form-item class="form_item" prop="activateFlag">
				<el-checkbox v-model="formData.activateFlag" :true-label="1" :false-label="0">是否激活</el-checkbox>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import draggable from 'vuedraggable'
	import {
		arrToStr,
		strToArr,
		initData
	} from '../common/titleRule.js'
	export default {
		data() {
			let vm = this
			return {
				ruleList: [],
				skuText: '',
				skuPreview: '',
				formData: {
					ruleName: null,
					platId: null,
					storeIds: [],
					systemCategoryId: null,
					ruleFormal: [],
					ruleDesc: null,
					activateFlag: 1,
				},
				shopList: [],
				props: {
					lazy: true,
					checkStrictly: true,
					lazyLoad(node, resolve) {
						setTimeout(() => {
							let parentId = node.value || null
							let nodes = []
							vm.$api['product/CateSystemCategoryTreeTitleWordHasGroup']({
								id: parentId
							}).then((res) => {
								nodes = res.rows.map(e => ({
									value: e.systemCategoryId,
									label: e.systemCategoryName,
									leaf: e.childFlag
								}))
								resolve(nodes);
							})
						});
					}
				},
				btnVal: null,
				dataLoading: true,
				oldSearchJobType:[],
				isShowPre:false,
			}
		},
		methods: {
			shopMethod(val) {
				const allValues = []
				for (const item of this.shopList) {
					allValues.push(item.key)
				}			
				const oldVal = this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : []
				if (val.includes(0)) {				
					this.formData.storeIds = allValues
				}
				if (oldVal.includes(0) && !val.includes(0)){
					
					this.formData.storeIds = []
				}				
				if (oldVal.includes(0) && val.includes(0)) {					
					const index = val.indexOf(0)
					val.splice(index, 1)
					this.formData.storeIds = val
				}
				if ( !oldVal.includes(0) && !val.includes(0) && !this.oldSearchJobType.length){
					this.formData.storeIds = []
				}
				if ( !val.includes(0) && val.length === allValues.length - 1 && this.formData.storeIds.length) {
					val.unshift(0)
					this.formData.storeIds = val
				}
				this.oldSearchJobType[0] = this.formData.storeIds
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
				let [...btnVal] = val
				this.btnVal = btnVal
				this.getBtn()
			},
			addBtnMethod(item, index) {
				if (item.key === '+') {
					return this._openDialog({
						title: '添加标题组',
						width: '70%',
						params: {
							params: {
								fn: this.getBtn,
								id: this.btnVal.length == 1 ? this.btnVal[0] : this.btnVal[this.btnVal.length - 1]
							}
						},
						component: () => import('./addChild.vue'),
						okBtnText: '保存',
						cancelBtnText: '取消'
					})
				}
				this.formData.ruleFormal.push({
					label: item.value,
					value: item.key,
					input: item.key === -2 ? true : false,
					text: null,
				})
				if(item.key === -3) this.isShowPre = true
				if (item.key !== '+') this.skuTextMethod()
				
			},
			btnClose(index) {
				if(this.formData.ruleFormal[index].value === -3) this.isShowPre = false
				this.formData.ruleFormal.splice(index, 1)
			},
			_submit() {
				return this.$refs.formData.validate().then(() => {
					let params = JSON.parse(JSON.stringify(this.formData))
					let data = arrToStr(params.ruleFormal)
					params.ruleFormal = data.ruleStr
					params.ruleFormalIdArray = data.ruleFormalIdArray
					params.fixedString = data.fixedString
					if(params.storeIds.includes(0)){
						let index = params.storeIds.findIndex(e=>e===0)
						params.storeIds.splice(index,1)
					}
					params.storeIds = params.storeIds.join() + ','
					params.systemCategoryId = params.systemCategoryId && params.systemCategoryId.length ? params.systemCategoryId.pop() :
						null
					return this.$api[`${ this.params.edit ? 'product/PrConfigTitleRuleUpdate' : 'product/PrConfigTitleRuleSave' }`](
						params)
				})
			},
			skuTextMethod() {
				if (this.formData.ruleFormal && this.formData.ruleFormal.length === 0) return
				if (this.formData.ruleFormal.find(e => e.value === -2) && !this.formData.ruleFormal.find(e => e.value === -2).text)
					return
				let params = {
					keyword: this.skuText,
					fixedString: this.formData.ruleFormal.find(e => e.value === -2) && this.formData.ruleFormal.find(e => e.value === -2).text ? this.formData.ruleFormal.find(e => e.value === -2).text : null,
					ruleFormalIdArray: arrToStr(this.formData.ruleFormal).ruleFormalIdArray,
				}
				this.$api['product/PrConfigTitleRulePreview'](params).then((res) => {
					this.skuPreview = res.rows
				})
			},
			btnDisMethod(item) {
				return this.formData.ruleFormal.some(e => e.value === item.key)
			},
			handleItemChange(e) {
				this.formData.systemCategoryId = e
			},
			getBtn() {
				let btnVal = this.btnVal
				let id = btnVal.length == 1 ? null : btnVal[btnVal.length - 2]
				for (var v = this.ruleList.length - 1; v >= 0; v--) {
					if (this.ruleList[v].isAdd) this.ruleList.splice(v, 1)
				}
				return this.$api['product/CateSystemCategoryTreeTitleWordHasGroup']({
					id: id
				}).then((res) => {
					let [...row] = res.rows
					let newId = btnVal.length == 1 ? btnVal[0] : btnVal[btnVal.length - 1]
					let obj = row.find(e => e.systemCategoryId == newId)
					if (obj && obj.titleWordGroupArray && obj.titleWordGroupArray.length) {
						obj.titleWordGroupArray.forEach(e => {
							this.ruleList.push({
								key: e.systemCategoryId,
								value: e.systemCategoryName,
								isAdd: true
							})
						})
						this.ruleList.push({
							key: '+',
							value: "+",
							isAdd: true
						})
					}
				})
			}
		},
		components: {
			draggable
		},
		mounted() {
			this.$api['product/GlStoreDropDown']({}).then((res) => {
				this.shopList = res.rows
				this.shopList.unshift({
					value: '全部',
					key: 0
				})
			})
			this.$api['product/PrConfigTitleRuleDropDown']({}).then((res) => {
				this.ruleList = res.rows
			})
			this.$nextTick(function() {
				setTimeout(() => {
					if (this.params && this.params.edit) {
						let vm = this
						vm.$api['product/PrConfigTitleRuleInfo']({
							id: vm.params.titleRuleId
						}).then((res) => {
							let { ...data
							} = res.rows
							data.systemCategoryId = []
							for (var i in data.categoryMap) {
								data.categoryMap[i].forEach(e => {
									data.systemCategoryId.push(e)
								})
								data.systemCategoryId.push(parseInt(i))
							}
							this.btnVal = data.systemCategoryId
							this.getBtn().then(() => {
								data.ruleFormal = strToArr(data, vm.ruleList)
								data.storeIds = data.storeIds.split(',').filter(e => e !== '').map(e => e = parseInt(e))
								delete data.categoryIdArray
								delete data.categoryMap
								delete data.ruleFormalIdArray
								if(data.storeIds.length === this.shopList.length - 1) data.storeIds.unshift(0)
								if(data.ruleFormal && data.ruleFormal.length && data.ruleFormal.find(e=>e.value === -3)) this.isShowPre = true
								this.formData = data
								
							})

						})
					}
				}, 1000)
				setTimeout(()=>{
					this.dataLoading = false
				},1200)			
			})
		},
		props: ['params']
	}
</script>

<style lang="scss" scoped>
	@import '../common/titleRule.scss';
</style>

<template>
    <div>
        <el-form :model="formData" ref="formData" label-width="90px" class="rule_content">
            <el-form-item class="form_item" label="规则" prop="ruleFormal" :rules="[{required:true,trigger:'change',message:'请选择规则'}]" >
                <div class="lebelBox">
                    <div class="lebelBtn" style="padding: 0;">
						<div style="height: 30px;width: 100%;background: rgb(242,242,242);line-height: 30px;text-align: center;margin-bottom: 10px;">链接符号</div>
                        <el-button
                          type="info"
                          size="small"
                          v-for="(item,index) in symbolList"
                          :key="item.key"
						  :style="{marginLeft: index == 0 ? '10px' : null}"
						  @click="addBtnMethod(item,index)"
                        >{{item.label}}</el-button>
						<div style="height: 30px;width: 100%;background: rgb(242,242,242);line-height: 30px;text-align: center;margin-top: 10px;margin-bottom: 10px;">条件</div>
						<el-button
						  type="primary"
						  size="small"
						  v-for="(item,index) in conditionList"
						  :key="item.key"
						  :style="{marginLeft: index == 0 ? '10px' : null}"
						  @click="addBtnMethod(item,index)"
						>{{item.label}}</el-button>
                    </div>
                    <div class="lebel">
                        <draggable v-model="formData.ruleFormal" @start="drag=true" @end="drag=false" class="draggable">
                            <div v-for="(item,index) in formData.ruleFormal" :key="index" class="formula-btn">
								<div class="btn-txt" v-if="!item.input" style="background: rgb(188,188,188);color:#fff;padding: 0 10px 0 10px;border-radius: 4px;">{{item.label}}</div>
								<i class="el-icon-circle-close" @click="btnClose(index)"></i>
                            </div>
                        </draggable>
                    </div>
                </div>
            </el-form-item>
            <el-form-item class="form_item">
				<el-button @click="method123">演示</el-button>
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
				symbolList:[
					{label:'与',value:0},
					{label:'或',value:1},
					{label:'(',value:2},
					{label:')',value:3},
				],
				conditionList:[
					{label:'S1',value:'S1'},
					{label:'S2',value:'S2'},
					{label:'S3',value:'S3'},
				],
				formData:{
					ruleFormal:[],
				}
			}
		},
		methods:{
			addBtnMethod(item,index){
				this.formData.ruleFormal.push({
					label:item.label,
					value:item.value,
				})
			},
			btnClose(index){
				this.formData.ruleFormal.splice(index,1)
			},	
			method123(){
				let reg = /\(([^()]*(\(.*\))*[^()]*)*\)/
				// let str = this.formData.ruleFormal.map(el => el.label).join('')
				let str = 'S1与(S2或S3)'
				let op
				function getStr(match, index, str) {
					
					if(match === '与') {
						op = 1
					}else {
						op = 0
					}
					
					let el = str.slice(0, index)
					let next = str.slice(index + 1)
					if(next) {
						return [{
							ruleName: el
						}, {
							ruleName: next, op
						}]
					}
					return [{
							ruleName: el
						}]
				}
				function setPrev(prev, parent, op, el, formula, match) {
					prev.replace(/[与或]/g, function(_match, index, str) {
						console.log(arguments)
						if(parent) {
							parent.formula.push(...getStr(_match, index, str))
						} else {
							formula.push(...getStr(_match, index, str))
						}
						if(reg.test(el)) {
							el = match[1]
							// if(!parent) {
							// 	parent = {
							// 		op,
							// 		// ruleName: el,
							// 		formula: []
							// 	}
							// }
							formula.push(parent)
							setPrev(prev, parent, op, el, formula, match)
						}
						
					})
				}
				function setFunc(str, parent, formula = []) {
					let match = str.match(reg)
					let index =  match ? match.index : undefined
					let el = match ? match[0] : str
					let prev = str.slice(0, index)
					// if(prev) {
					// 	setPrev(prev, parent, op, el, formula, match)
					// }
					if(reg.test(el)) {
						if(!parent) {
							parent = {
								op,
								// ruleName: el,
								formula: []
							}
						}
						formula.push(parent)
						setPrev(RegExp.$1, parent, op, el, formula, match)
					} else {
						setPrev(el, parent, op, el, formula, match)
					}
					return formula
				}
				console.log(setFunc(str))
				
				
			}
		},
		components:{
			draggable
		},
		mounted(){
			
		},
		props:['params']
	}
</script>

<style lang="scss" scoped>
	@import '../css/skuAdd.scss';
</style>

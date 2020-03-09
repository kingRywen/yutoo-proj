<template>
	<div>
		<el-form :model="formData" ref="formData" class="demo-dynamic">
			<div v-for="(item,index) in formData.domains" style="display: flex;" :style="{marginTop: index === 0 ? '0' : '15px'}">
				<el-form-item :prop="'domains.' + index + '.numMin'" :rules="{required: true, message: '数量不能为空', trigger: 'blur'}" >
					<el-input class="prependInput" style="width: 120px" v-model.trim.number="item.numMin" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>数量</span></template></el-input>&nbsp; ~ 					
				</el-form-item>
				<el-form-item label-width="12px" :prop="'domains.' + index + '.numMax'"  :rules="{required: true, message: '数量不能为空', trigger: 'blur'}">
					<el-input  style="width: 76px;" v-model.trim.number="item.numMax" size="small"></el-input>
				</el-form-item>
				<el-form-item label-width="12px" :prop="'domains.' + index + '.singlePrice'" :rules="{required: true, message: '单价不能为空', trigger: 'blur'}" >
					<el-input  class="prependInput" style="width: 130px;" v-model.trim.number="item.singlePrice" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>单价</span></template></el-input>
				</el-form-item>
				<el-form-item label-width="12px" :prop="'domains.' + index + '.purchasePrice'" :rules="{required: true, message: '采购费用不能为空', trigger: 'blur'}">
					<el-input  class="prependInput" style="width: 150px;" v-model.trim.number="item.purchasePrice" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>采购费用</span></template></el-input>
				</el-form-item>
				<el-form-item label-width="12px" :prop="'domains.' + index + '.processPrice'" :rules="{required: true, message: '加工费用不能为空', trigger: 'blur'}">
					<el-input  class="prependInput" style="width: 150px;" v-model.trim.number="item.processPrice" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>加工费用</span></template></el-input>
				</el-form-item>
				<el-form-item label-width="12px" :prop="'domains.' + index + '.otherPrice'" >
					<el-input  class="prependInput" style="width: 150px;" v-model.trim.number="item.otherPrice" size="small"><template slot="prepend"><span class="prependClassText">其他费用</span></template></el-input>
				</el-form-item>
				<el-form-item label-width="20px" :prop="'domains.' + index + '.currency'" >
					<el-select style="width: 112px;"  size="small" v-model="item.currency">
						<el-option v-for="e in countryList" :key="e.value" :value="e.value" :label="e.label"></el-option>
					</el-select>&nbsp;
					<el-button @click.prevent="addDomain" size="small" type="plain" icon="el-icon-plus" plain></el-button>
					<el-button @click.prevent="removeDomain(index)" v-if="formData.domains.length > 1" size="small" type="danger" icon="el-icon-delete" plain></el-button>
				</el-form-item>					
			</div>
		</el-form>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				countryList:[
					{label:'USD',value:0},
					{label:'CHINA',value:1},
				],
				formData: {
				    domains: [
						{numMin:null,numMax:null,singlePrice:null,purchasePrice:null,processPrice:null,otherPrice:null,currency:0,}
					],
				}
			}
		},
		methods:{
			validate(){
				return this.$refs.formData.validate().then(()=>{})
			},
			removeDomain(index) {
				  this.formData.domains.splice(index, 1)
			},
			addDomain() {
				this.formData.domains.push({numMin:null,numMax:null,singlePrice:null,purchasePrice:null,processPrice:null,otherPrice:null,currency:0,});
			}
		}
	}
</script>

<style>
	.prependClassText{
		font-size: 12px;
	}
	.prependClassText>span{
		color: #f56c6c;
		margin-right: 4px;
	}
	.prependInput .el-input-group__prepend{
		padding: 0 5px;
	}
</style>

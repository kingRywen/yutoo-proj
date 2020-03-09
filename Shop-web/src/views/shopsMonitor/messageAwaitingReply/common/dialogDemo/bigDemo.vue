<template>
	<div>
		<el-form :model="formData" ref="formData" label-width="110px">
			<el-form-item prop="supplierType" label="供应商类型" :rules="[{ required: true, message: '请选择供应商类型', trigger: 'blur' }]">
				<el-select  style="width: 90%;" v-model="formData.supplierType" size="small">
					<el-option v-for="item in supplierTypeList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="supplier" label="供应商" :rules="[{ required: true, message: '请选择供应商', trigger: 'blur' }]">
				<el-select  style="width: 90%;" v-model="formData.supplier" size="small">
					<el-option v-for="item in supplierList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
				</el-select>
				<span style="color: #3AB6FE;margin-left: 10px;">添加供应商</span>
			</el-form-item>
			<el-form-item prop="kaipiaoshuidian" label="开票税点" >
				<el-input  style="width: 90%;" v-model.trim.number="formData.kaipiaoshuidian" size="small"></el-input>
				<span style="margin-left: 10px;">%</span>
			</el-form-item>
			<el-form-item prop="productStates" label="产品状态">
				<el-radio-group v-model="formData.productStates">
				    <el-radio v-for="item in productStatesList"  :key="item.value"  :label="item.value" >{{item.label}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="statesRemark" label="状态备注" >
				<el-input  style="width: 90%;" v-model.trim="formData.statesRemark" size="small" type="textarea" rows="2" :autosize="{ minRows: 2, maxRows: 99}" ></el-input>
			</el-form-item>			
			<el-form-item  >
				<span class="prependClassText" slot="label"><span>*</span>采购天数
					<el-tooltip effect="light" placement="top-start">
					  <div slot="content">采购天数=生产天数+运输天数+入库天数</div>
					  <i
						style="color: #108ee9;margin-left:2px"
						class="el-icon-question"
					  />
					</el-tooltip>
				</span>
				<div style="display: flex;">
					<el-form-item prop="productDay" :rules="{required: true, message: '生产天数不能为空', trigger: 'blur'}" >
						<el-input class="prependInput" style="width: 320px" v-model.trim.number="formData.productDay" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>生产天数</span></template></el-input>				
					</el-form-item>
					<el-form-item label-width="12px" prop="shippingDay"  :rules="{required: true, message: '运输天数不能为空', trigger: 'blur'}">
						<el-input  class="prependInput" style="width: 320px;" v-model.trim.number="formData.shippingDay" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>运输天数</span></template></el-input>
					</el-form-item>
					<el-form-item label-width="12px" prop="inStorageDay" :rules="{required: true, message: '入库天数不能为空', trigger: 'blur'}" >
						<el-input  class="prependInput" style="width: 319px;" v-model.trim.number="formData.inStorageDay" size="small"><template slot="prepend"><span class="prependClassText"><span>*</span>入库天数</span></template></el-input>
					</el-form-item>				
				</div>
			</el-form-item>						
			<el-form-item >
				<span class="prependClassText" slot="label"><span>*</span>供应商报价</span>
				<demo-item ref="supplierForm" />
			</el-form-item>
			<el-form-item prop="isDefaultSupplier" label="是否默认供应商" :rules="[{ required: true, message: '请选择是否默认供应商', trigger: 'blur' }]">
				<el-radio-group v-model="formData.isDefaultSupplier">
				    <el-radio :key="1"  :label="1" >是</el-radio>
					<el-radio :key="0"  :label="0" >否</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import demoItem from 'Views/shopsMonitor/messageAwaitingReply/common/dialogDemo/demoItem.vue'
	export default{
		data(){
			return {
				supplierTypeList:[{label:'网络采购',value:0},{label:'市场采购',value:1},{label:'工厂采购',value:2},{label:'自主加工',value:3},],
				supplierList:[{label:'供应商1',value:0}],
				productStatesList:[{label:'正常',value:0},{label:'缺货',value:1},{label:'停产',value:2},{label:'清库',value:3}],
				formData: {
				    supplierType: null,
					supplier:null,
					kaipiaoshuidian:null,
					productStates:null,
					statesRemark:null,
					productDay:null,
					shippingDay:null,
					inStorageDay:null,
					isDefaultSupplier:null,
				}
			}
		},
		methods:{
			_submit(){
				let { formData,supplierForm } = this.$refs				
				let forms = [formData,supplierForm]
				return Promise.all(forms.map(item => item.validate())).then(()=>{
					console.log('成功')
				}).catch((err)=>{
					console.log(err)
				})
			}
		},
		components:{
			demoItem
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

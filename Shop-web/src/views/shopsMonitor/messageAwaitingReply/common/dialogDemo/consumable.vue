<template>
	<div>
		<el-form :model="formData" ref="formData" label-width="110px">
			<el-form-item prop="materialType" label="耗材类型" :rules="[{ required: true, message: '请选择耗材类型', trigger: ['blur','change'] }]">
				<el-select  style="width: 95%;" v-model="formData.materialType" size="small" @change="materialTypeMethod">
					<el-option v-for="item in materialTypeList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="secondType" label="二级类型" :rules="[{ required: true, message: '请选择二级类型', trigger: ['blur','change'] }]" v-if="formData.materialType !== 2">
				<el-select  style="width: 95%;" v-model="formData.secondType" size="small">
					<el-option v-for="item in secondTypeList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="modelName" label="型号" :rules="[{ required: true, message: '请输入型号', trigger: 'blur' }]">
				<el-input  style="width: 95%;" v-model.trim="formData.modelName" size="small"></el-input>
			</el-form-item>
			<el-form-item prop="productName" label="产品名称" :rules="[{ required: true, message: '请输入产品名称', trigger: 'blur' }]">
				<el-input  style="width: 95%;" v-model.trim="formData.productName" size="small"></el-input>
			</el-form-item>
			<el-form-item >
				<span class="prependClassText"  slot="label"><span>*</span>产品图片</span>
				<updata-picture ref="pictureForm" />
			</el-form-item>
			<el-form-item  >
				<span class="prependClassText" slot="label">尺寸</span>
				<div style="display: flex;">
					<el-form-item prop="sizeLength" >
						<el-input style="width: 300px" v-model.trim.number="formData.sizeLength" size="small"><template slot="prepend"><span class="prependClassText">长</span></template></el-input>				
					</el-form-item>
					<el-form-item label-width="12px" prop="sizeWidth"  >
						<el-input  style="width: 300px;" v-model.trim.number="formData.sizeWidth" size="small"><template slot="prepend"><span class="prependClassText">宽</span></template></el-input>
					</el-form-item>
					<el-form-item label-width="12px" prop="sizeHeight" >
						<el-input  style="width: 300px;" v-model.trim.number="formData.sizeHeight" size="small"><template slot="prepend"><span class="prependClassText">高</span></template></el-input>
					</el-form-item>
					<el-form-item label-width="12px" prop="sizeUnit" >
						<el-select  style="width: 100px;" v-model="formData.sizeUnit" size="small">
							<el-option v-for="item in sizeUnitList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
						</el-select>
					</el-form-item>				
				</div>
			</el-form-item>
			<el-form-item  >
				<span class="prependClassText" slot="label">重量</span>
				<div style="display: flex;">
					<el-form-item prop="weight" >
						<el-input style="width: 924px" v-model.trim.number="formData.weight" size="small"></el-input>				
					</el-form-item>
					<el-form-item label-width="12px" prop="weightUnit" >
						<el-select  style="width: 100px;" v-model="formData.weightUnit" size="small">
							<el-option v-for="item in weightUnitList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
						</el-select>
					</el-form-item>				
				</div>
			</el-form-item>
			<el-form-item prop="remark" label="备注" >
				<el-input  style="width: 95%;" v-model.trim="formData.remark" size="small" type="textarea" rows="2" :autosize="{ minRows: 2, maxRows: 99}" ></el-input>
			</el-form-item>
			<el-form-item prop="customSku" label="自定义SKU" :rules="[{ required: true, message: '请输入自定义SKU', trigger: 'blur' }]">
				<el-input  style="width: 95%;" v-model.trim="formData.customSku" size="small"></el-input>
			</el-form-item>
			<el-form-item prop="purchasePeople" label="采购人员" :rules="[{ required: true, message: '请选择采购人员', trigger: ['blur','change'] }]">
				<el-select  style="width: 95%;" v-model="formData.purchasePeople" size="small">
					<el-option v-for="item in purchasePeopleList" :key="item.value" :value="item.value" :label="item.label" ></el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import updataPicture from 'Views/shopsMonitor/messageAwaitingReply/common/dialogDemo/updataPicture.vue'
	export default{
		data(){
			return {
				materialTypeList:[{label:'包装材料',value:0},{label:'办公材料',value:1},{label:'其他',value:2}],
				secondTypeList:[],
				secondTypeList1:[{label:'纸箱',value:0},{label:'信封袋',value:1},{label:'气泡信封袋',value:2},{label:'其他',value:3},{label:'PE快递袋',value:4}],
				secondTypeList2:[{label:'笔',value:0},{label:'笔记本',value:1},{label:'纸巾',value:2},{label:'饮用水',value:3},{label:'其他',value:4}],
				sizeUnitList:[{label:'mm',value:0},{label:'m',value:1},{label:'dm',value:2},{label:'cm',value:2}],
				weightUnitList:[{label:'g',value:0},{label:'kg',value:1}],
				purchasePeopleList:[{label:'采购人员1',value:0},{label:'采购人员2',value:1}],
				formData: {
				    materialType:null,
					secondType:null,
					modelName:null,
					productName:null,
					sizeLength:null,
					sizeWidth:null,
					sizeHeight:null,
					sizeUnit:null,
					weight:null,
					weightUnit:null,
					remark:null,
					customSku:null,
					purchasePeople:null,
				}
			}
		},
		methods:{
			_submit(){
				let { formData,pictureForm } = this.$refs				
				let forms = [formData,pictureForm]
				return Promise.all(forms.map(item => item.validate())).then(()=>{
					console.log(pictureForm.formData.imageUrl)
					console.log('成功')
				}).catch((err)=>{
					console.log(err)
				})
			},
			materialTypeMethod(e){
				if(e === 0){
					this.secondTypeList = this.secondTypeList1
				}else if(e === 1){
					this.secondTypeList = this.secondTypeList2
				}
			}
		},
		components:{
			updataPicture
		},
		created(){
			this.secondTypeList = this.secondTypeList1
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

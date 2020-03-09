<template>
	<div>
		<el-form :label-position="labelPosition" label-width="110px" :model="formData" ref='form'>
			<!-- <el-form-item label="品牌所有者" prop='brandOwner' :rules="[ { required: true, message: '请输入', trigger: ['blur'] }]" v-if="editType">
				<el-input v-model="formData.brandOwner" style="width: 300px;" size="small"></el-input>
			</el-form-item>
			<el-form-item label="原来的类目" v-if="editType">
				<el-input v-model="originCategory" style="width: 300px;" disabled size="small"></el-input>
			</el-form-item> -->
			<el-form-item label="类目" prop='parentPcid' 
		    >
				<div slot="label">
					<span><span style="color: #f56c6c;">*</span> 类目</span>
				</div>
				<el-checkbox v-model="checked" >全部</el-checkbox>
				<el-tree
				  check-strictly
				  :props="props"
				  :load="loadNode1"
				  @node-expand="clickMethod"
				  lazy
				  node-key="id"
				  ref="tree"
				  show-checkbox>
				</el-tree>
		    </el-form-item>
			<el-form-item label="国家" prop='countryCode' 
			  :rules="[ { required: true, message: '请选择国家', trigger: ['blur'] }]"
			>
				<el-select filterable   size="small" v-model="formData.countryCode" placeholder="请选择" style="width: 300px;">
					<el-option v-for="item in countryList" :key="item.value"  :label="item.label"  :value="item.value">
						<span :class="{'custom_hover': item.highlightFlag ? item.highlightFlag : false}">{{ item.label }}</span>
					</el-option>
				</el-select>
			</el-form-item>
			
		</el-form>
	</div>
</template>

<script>
export default{
	props:['params'],
	data(){
		
		return{
			// selectCategory:this.$refs.tree.getCheckedKeys().length?this.$refs.tree.getCheckedKeys():[],
			checked:false,
			props: {
			  label: 'name',
			  children: 'zones',
			  isLeaf: 'leaf'
			},
			countryList:[],
			labelPosition:'right',
			countryName:null,
			formData:{
				brandOwner:null,
				countryCode:null
			},
			clickId:null,
			editType:false,
			originCategory:'',
			originPcid:null,
			
		}
	},
	methods:{
		_submit(){
			if(this.editType){
				let params = {
					serialNumbers:this.params.serialNumbers,
					countryCode:this.formData.countryCode,
					categoryIds:this.$refs.tree.getCheckedKeys()
				}
				if (this.checked) {
					params.categoryIds = ['0']
				}
				return this.$refs.form.validate().then(() => {
					  return this.$api['brandManageUpdateCountry'](params).then((res)=>{
						  if(res.data == 1){
							  if(this.params.fn) this.params.fn('add')
						  }
						  if(res.data == 0){
							  if(this.params.fn) this.params.fn()
						  }
					 })
				}).then(()=>{
					return Promise.resolve(true)
				})
			}else{
				let params = {
					serialNumbers:this.params.serialNumbers,
					countryCode:this.formData.countryCode,
					categoryIds:this.$refs.tree.getCheckedKeys()
				}
				if (this.checked) {
					params.categoryIds = ['0']
				}
				return this.$refs.form.validate().then(() => {
					  return this.$api['brandManageUpdateCountry'](params).then()
				})
			}			
		},
		clickMethod(e){
			this.clickId = e.value;
		},
		loadNode1(node, resolve) {
			if (node.level === 0) {
				let params = {
					parentPcid:0,
					siteId:1,
					platformId: this.params.platformId
				}
				let resList = [];
				this.$api['productCategoryGetCategory'](params)
					.then(data=>{
						if(data && data.code && data.code !== 0){
							this.$message.error(data.msg)
							return
						}
						let list = data.data
						for(var i=0;i<list.length;i++){
							resList.push({value:list[i].pcid,name:list[i].name,leaf:!list[i].haveChildren,id:list[i].pcid})
						}
						return resolve(resList);
					})
				
			}
			if (node.level > 0) {
				setTimeout(()=>{
					let params = {
						parentPcid:this.clickId,
						siteId:1,
						platformId: this.params.platformId
					}
					let resList = [];
					this.$api['productCategoryGetCategory'](params)
						.then(data=>{
							if(data && data.code && data.code !== 0){
								this.$message.error(data.msg)
								return
							}
							let list = data.data
							for(var i=0;i<list.length;i++){
								resList.push({value:list[i].pcid,name:list[i].name,leaf:!list[i].haveChildren,id:list[i].pcid})
							}
							return resolve(resList);
						})
				},200)
				
				
			}
		},
		
		
		loadCountry(){
			
			let params = {brand:null}
			if (this.editType) {
				params.brand=this.params.brand
			}
			this.$api["brandManageListCountry"](params).then(res => {
			  res.data.forEach(e => {
				let newLabel = `${e.countryCode}(${e.chineseName})`
			    this.countryList.push({label:newLabel,value:e.countryCode,highlightFlag:e.highlightFlag});
			  });
			  // console.log(this.params.countryCode)
			  if(this.editType){
			  	this.formData.countryCode = this.params.countryCode
			  }
			});
		},
		
	},
	mounted(){
		this.editType = this.params.editType
		
		this.loadCountry()
	},
	watch:{
		
	}
}
</script>

<style lang='scss' scoped>
.custom_hover {
  background: #e4e7ed;
  display: block;
  margin: 0 -20px;
  padding: 0 20px;
  &:hover {
    background: #dcdfe6;
  }
}
</style>

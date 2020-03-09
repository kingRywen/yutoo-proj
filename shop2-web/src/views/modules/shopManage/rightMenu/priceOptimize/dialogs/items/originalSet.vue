<template>
	<div>
		<new-form :form-schema="formSchema" :value="value" ref="formData"></new-form>
	</div>
</template>

<script>
	export default{
		data(){
			let vm = this
			return {
				formSchema: {
					table: {
						batch:false,
					  // 表格数据
					  type: 'table',
					  label: 'table',
					  width: 'auto', // 如果不设置每一列的宽度，用这个，能最优分配表格列的宽度
					  head: {
						sellerSku:{
							widget: 'txt',
							label: 'SKU',
							noLabel: true
						},
					    asin: {
					      widget: 'txt',
					      label: 'ASIN',
					      noLabel: true
					    },
						defaultPrice: {
						  widget: 'number',
						  controls:false,
						  label: '原价$',
						  noLabel: true,
						  required: true
						}
					  }
					},
				},
				value: {
					table: []
				},
			}
		},
		methods:{
			validateFn(){
				let vm = this
				return this.$refs.formData.validate().then(()=>{
					return Promise.resolve({productData:vm.setData(vm.value.table)})
				}).catch((e)=> {
					return Promise.reject(e)
				})			
			},
			setData(arr){
				let newArr = arr.map(e => ({
					sellerSku:e.sellerSku,
					defaultPrice:e.defaultPrice
				}))
				return newArr
			},
			getData(arr){
				let newArr = []
				arr.forEach(e => {
					if(e.childList && e.childList.length){
						e.childList.forEach(i => {
							newArr.push({sellerSku:i.sellerSku,asin:i.asin,defaultPrice:1})
						})
					}
				})
				this.value.table = newArr
			}
		},
	}
</script>

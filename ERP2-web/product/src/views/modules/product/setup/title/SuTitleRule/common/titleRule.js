export function arrToStr(arr){
	let [ ... arr1 ] = arr
	let ruleStr = ''
	arr1.map(e=>e.label).forEach((e)=>{ ruleStr += "{#" + e + "#}" })
	let ruleFormalIdArray = arr1.map(e=>e.value)
	let fixedString = arr1.find(e=>e.value === -2) && arr1.find(e=>e.value === -2).text || null
	return { ruleStr , ruleFormalIdArray , fixedString }
}

export function strToArr(data,arr){
	let { ruleFormalIdArray , fixedString } = data
	let newArr = []
	ruleFormalIdArray.forEach(e=>{
		newArr.push({
			label:arr.find(i=>i.key===e).value,
			value:arr.find(i=>i.key===e).key,
			input:e === -2 ? true :false,
			text:e === -2 ? fixedString :null,
		})
	})
	return newArr
}

export function initData(vm){
	return vm.$api['product/PrConfigTitleRuleInfo']({id:vm.params.titleRuleId}).then((res)=>{	
		let { ...data } = res.rows	
		data.ruleFormal = strToArr(data,vm.ruleList)
		data.storeIds = data.storeIds.split(',').filter(e => e !== '').map(e => e = parseInt(e))
		data.systemCategoryId = []
		for(var i in data.categoryMap){
			data.categoryMap[i].forEach(e=>{
				data.systemCategoryId.push(e)
			})
			data.systemCategoryId.push(parseInt(i))
		}
		delete data.categoryIdArray
		delete data.categoryMap
		delete data.ruleFormalIdArray
		return data
	})
}
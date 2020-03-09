export function arrToStr(arr){
	let [ ... arr1 ] = arr
	let ruleStr = ''
	arr1.map(e=>e.label).forEach((e)=>{ ruleStr += "{#" + e + "#}" })
	let ruleFormalIdArray = arr1.map(e=>e.value)
	let fixedString = arr1.find(e=>e.value === 7) && arr1.find(e=>e.value === 7).text || null
	return { ruleStr , ruleFormalIdArray , fixedString }
}

export function strToArr(data,arr){
	let { ruleFormalIdArray , fixedString } = data
	let newArr = []
	ruleFormalIdArray.forEach(e=>{
		newArr.push({
			label:arr.find(i=>i.key===e).value,
			value:arr.find(i=>i.key===e).key,
			input:e === 7 ? true :false,
			text:e === 7 ? fixedString :null,
		})
	})
	return newArr
}
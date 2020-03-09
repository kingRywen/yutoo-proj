//将前端的数据格式转成后端需要的数据格式
export function resultData(obj){
	delete obj.origin.dateRange
	obj.rule.forEach((e,index,arr)=>{
		delete arr[index]._show
		arr[index].expression = conditionResult(arr[index].expression)
	})
	obj.strategy.forEach((e,index,arr)=>{
		delete arr[index].divDisplay
		delete arr[index].isShowError
		arr[index].formulaExpress = strategyText(arr[index].formula)
		arr[index].formula = strategyResult(arr[index].formula)		
	})
	return obj
}

//将后端的数据格式转成前端的格式
export function initData(obj,vm){
	let newObj = vm.deepCopyGlobal(obj)
	newObj.origin.dateRange = newObj.origin.start ? [newObj.origin.start,newObj.origin.end] : [];
	newObj.rule.forEach((e,index,arr)=>{
		arr[index].expression = toArrZB(e.expression)
	})
	newObj.strategy.forEach((e,index,arr)=>{
		arr[index].formula = toStrStrategy(e.formula)
		arr[index].divDisplay = 'block'
		arr[index].isShowError = false
	})
	return Promise.resolve(newObj)
}

function toStrStrategy(arr1){
	let onlyStr = ''
	let result = toStr(arr1)
	function toStr(arr,isBra){	
		arr.forEach((e,index,arr)=>{
			if(e.op == 0 || e.op == 1) onlyStr += e.op == 0 ? ' 与 ' : ' 或 '
			if(e.formula && e.formula.length){
				onlyStr += ' ( '
				toStr(e.formula,true)
			}else{
				onlyStr += e.ruleName				
			}
			if(isBra && index === arr.length - 1) onlyStr += ' ) '
		})
		let newArr = onlyStr.split(' ').filter(e=>e!='')
		return newArr
	}
	return result
}


function toArrZB(str) {
	let arr = str.split(' ')
	let newArr = []
	arr.forEach((e, index) => {
		if (e.includes('>=')) {
			newArr.push({
				first: getCondition(e.split('>=')[0],'CN'),
				second: '>=',			
				third: e.split('>=')[0] === 'acos' || e.split('>=')[0] === 'adConversionRates' ||  e.split('>=')[0] === 'clickRates' ||  e.split('>=')[0] === 'noDealClickRate' ? e.split('>=')[1] * 100 : e.split('>=')[1],
				fourth: e.includes('noDealClickRate') || e.includes('acos') || e.includes('adConversionRates') || e.includes('clickRates') ? '%' : e.includes('noDealClicks') ? '次' : null,
				value: e.split('>=')[0],
				key:getCondition(e.split('>=')[0],'key')
			})
		} else if (e.includes('<=')) {
			newArr.push({
				first: getCondition(e.split('<=')[0],'CN'),
				second: '<=',
				third: e.split('<=')[0] === 'acos' || e.split('<=')[0] === 'adConversionRates' ||  e.split('<=')[0] === 'clickRates' ||  e.split('<=')[0] === 'noDealClickRate' ? e.split('<=')[1] * 100 : e.split('<=')[1],
				fourth: e.includes('noDealClickRate') || e.includes('acos') || e.includes('adConversionRates') || e.includes('clickRates')  ? '%' : e.includes('noDealClicks') ? '次' : null,
				value: e.split('<=')[0],
				key:getCondition(e.split('<=')[0],'key')
			})
		} else if (e.includes('=')) {
			newArr.push({
				first: getCondition(e.split('=')[0],'CN'),
				second: '=',
				third: e.split('=')[0] === 'acos' || e.split('=')[0] === 'adConversionRates' ||  e.split('=')[0] === 'clickRates' ||  e.split('=')[0] === 'noDealClickRate' ? e.split('=')[1] * 100 : e.split('=')[1],
				fourth: e.includes('noDealClickRate') || e.includes('acos') || e.includes('adConversionRates') || e.includes('clickRates')  ? '%' : e.includes('noDealClicks') ? '次' : null,
				value: e.split('=')[0],
				key:getCondition(e.split('=')[0],'key')
			})
		} else if (e.includes('<')) {
			newArr.push({
				first: getCondition(e.split('<')[0],'CN'),
				second: '<',
				third: e.split('<')[0] === 'acos' || e.split('<')[0] === 'adConversionRates' ||  e.split('<')[0] === 'clickRates' ||  e.split('<')[0] === 'noDealClickRate' ? e.split('<')[1] * 100 : e.split('<')[1],
				fourth: e.includes('noDealClickRate') || e.includes('acos') || e.includes('adConversionRates') || e.includes('clickRates')  ? '%' : e.includes('noDealClicks') ? '次' : null,
				value: e.split('<')[0],
				key:getCondition(e.split('<')[0],'key')
			})
		} else if (e.includes('>')) {
			newArr.push({
				first: getCondition(e.split('>')[0],'CN'),
				second: '>',
				third: e.split('>')[0] === 'acos' || e.split('>')[0] === 'adConversionRates' ||  e.split('>')[0] === 'clickRates' ||  e.split('>')[0] === 'noDealClickRate' ? e.split('>')[1] * 100 : e.split('>')[1],
				fourth: e.includes('noDealClickRate') || e.includes('acos') || e.includes('adConversionRates') || e.includes('clickRates')  ? '%' : e.includes('noDealClicks') ? '次' : null,
				value: e.split('>')[0],
				key:getCondition(e.split('>')[0],'key')
			})
		} else {
			newArr.push({
				first: getCondition(e,'CN'),
				second: null,
				third: null,
				fourth: null,
				value: e,
				key:getCondition(e,'key')
			})
		}
	})
	return newArr
}

//仅作列表展示
export function toCNStrZB(arr) {
	let arr1 = arr.map(o => ({...o}));
	let strItem = ''
	arr1.forEach((e,index,arr)=>{
		for(var key in e){
			if(e[key] === null){
				delete e[key]
				delete e["value"]
			}
		}
		strItem += e.first ? e.first : ''
		strItem += e.second ? e.second : ''
		strItem += e.third ? e.third : ''
		strItem += e.fourth ? e.fourth : ''
		strItem += index === arr.length - 1 ? '' : ' '
	})
	return strItem
}

//条件管理(传给后台)
export function conditionResult(arr){
	let arr1 = arr.map(o => ({...o}));
	let strItem = ''
	arr1.forEach((e,index,arr)=>{
		for(var key in e){
			if(e[key] === null){
				delete e[key]
			}
		}
		strItem += e.value ? (e.fourth && e.fourth == '%' && e.value === 'noDealClicks') ? 'noDealClickRate' : e.value : ''
		strItem += e.second ? e.second : ''
		strItem += e.third ? (e.fourth && e.fourth == '%') ? e.third * 0.01 : e.third : ''
		strItem += index === arr.length - 1 ? '' : ' '
	})
	return strItem
}

//策略管理(传给后台校验)
export function strategyText(arr){
	let [...arr1] = arr
	let str = ''
	arr1.forEach((e,index,arr)=>{
		if(e === '与'){
			arr[index] = 'and'
		} else if (e === '或'){
			arr[index] = 'or'
		} else if (e === '('){
			arr[index] = '('
		} else if (e === ')'){
			arr[index] = ')'
		} else {
			arr[index] = true
		}
	})
	str = arr1.join(' ')
	return str
}

//策略管理(传给后台)
function strategyResult(arr){
	let [...arr1] = arr
	let str1 = arr1.join('')
	let reg = /([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g
	let match	
	function getOp(op) {
		return op === '与' ? 0 : 1
	}	
	function getNormal(str) {
		let i = 0,
			ret = []
		str.replace(/[与或]*[^与或]+/g, function(match, index, input) {
			let el = {}	
			if (match[0].charAt() === '与' || match[0].charAt() === '或') {
				el = {
					ruleName: match.substring(1),
					op: getOp(match[0].charAt())
				}
			} else {
				el = {
					ruleName: match,
				}
			}
			ret.push(el)
			i = index
		})	
		return ret
	}				
	function getMatch(str, ret = [], parent, reg = /([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g) {
		if (!/([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g.test(str)) {	
			parent.formula.push(...getNormal(str))
			return ret
		}
		while (match = reg.exec(str)) {
			let el = []
			if (/[与或]*\(([^()]*(\(.*\))*[^()]*)*\)/.test(match[0])) {	
				if (match[0].charAt() === '与' || match[0].charAt() === '或') {
					let p = {
						op: getOp(match[0].charAt()),
						formula: []
					}
					el.push(p)
					if (parent) {
						parent.formula.push(...el)
					} else {
						ret.push(...el)
					}
					getMatch(match[0].substring(2, match[0].length - 1), ret, p)
				} else {
					let p = {
						formula: []
					}
					el.push(p)
					if (parent) {
						parent.formula.push(...el)
					} else {
						ret.push(...el)
					}
					getMatch(match[0].substring(1, match[0].length - 1), ret, p,
						/([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g)
				}
			} else if (/[与或]*([^()]+)(?<![与或])/.test(match[0])) {
				el = getNormal(match[0])
				if (parent) {
					parent.formula.push(...el)
				} else {
					ret.push(...el)
				}
			} else {}
		}
		return ret
	}
	let ret = getMatch(str1)
	return ret
}


function getCondition(str,type){
	if(type === 'CN'){
		switch(str){
			case 'and':
				return '与'
			break;
			case 'or':
				return '或'
			break;
			case '(':
				return '('
			break;
			case ')':
				return ')'
			break;
			case 'cost':
				return '花费'
			break;
			case 'acos':
				return 'ACOS'
			break;
			case 'adConversionRates':
				return '转化率'
			break;
			case 'clickRates':
				return '点击率'
			break;
			case 'adOrderCnt':
				return '订单量'
			break;
			case 'noDealClicks':
				return '无效点击数'
			break;
			case 'noDealClickRate':
				return '无效点击数'
			break;
		}
	}else if(type === 'key'){
		switch(str){
			case 'and':
				return 0
			break;
			case 'or':
				return 1
			break;
			case '(':
				return 2
			break;
			case ')':
				return 3
			break;
			case 'cost':
				return 4
			break;
			case 'acos':
				return 5
			break;
			case 'adConversionRates':
				return 6
			break;
			case 'clickRates':
				return 7
			break;
			case 'adOrderCnt':
				return 8
			break;
			case 'noDealClicks':
				return 9
			break;
			case 'noDealClickRate':
				return 9
			break;
		}
	}
}
export function resultData(arr,arr1){
	let [...arr2] =  arr
	arr2.forEach((e,index,arr3)=>{
		if(e !== '+' && e !== '-' && e !== '(' && e !== ')') arr3[index] = arr1.find(i=>i.ruleName === e).ruleId
		else if(e === '+') arr3[index] = '与'
		else if(e === '-') arr3[index] = '或'		
	})
	return strategyResult(arr2)
}


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
					groupId: match.substring(1),
					op: getOp(match[0].charAt())
				}
			} else {
				el = {
					groupId: match,
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
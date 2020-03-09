//验证关键词
export function adKeywordsValidate(rule, value, callback){
  if (!value) {
	callback(new Error('关键词不能为空'))
	return
  }
  let val = value
	.split(/[\n|\r\n|\,|\，]/)
	.map(el => el.trim())
	.filter(el => el !== '')
		let reg = /^[ A-Za-z0-9\']*$/		
		if (!val.every(el => reg.test(el))) {
		  callback(new Error('只能输入数字,字母,单引号'))
		} else if (val.length > 1000) {
		  callback(new Error('输入数量不能超过1000个'))
		} else {
		  callback()
		}			
}

//验证URL
export function urlValidate(rule, value, callback) {
      if (!value) {
        callback(new Error('输入不能为空'))
        return
      }
      let val = value
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== '')
      let reg = /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/
      if (!val.every(el => reg.test(el))) {
        callback(new Error('请输入正确的url, 一行一个'))
      } else if (val.length > 500) {
        callback(new Error('输入数量不能超过500个'))
      } else {
        callback()
      }
}

//验证价格
export function priceValidate(rule, value, callback){
	if (!value) {
		return callback(new Error('请输入价格'));
	};
	if(isNaN(Number(value))){
		return callback(new Error('请输入数字'));
	};
	callback()
}

//验证正整数
export function dayValidate(rule, value, callback){
	if (!value) {
		return callback(new Error('请输入天数'));
	};
	let reg = /^[1-9]\d*$/;
	if(!reg.test(value)){
		 return callback(new Error('请输入正整数'));
	};
	callback()
}

//验证监控周期
export function checkFrequencyValidate(rule, value, callback){
  let numReg = /^[1-9]\d*$/
  if (!value) {
	return callback(new Error('请输入监控周期'))
  } else {
	if (!numReg.test(value)) {
	  return callback(new Error('请输入正整数'))
	}
	if (value < 10 || value > 1440) {
	  return callback(new Error('请输入10至1440'))
	}
	callback()
  }
}
//验证ASIN
export function asinValidate(rule, value, callback) {
  if (!value) {
	callback(new Error('输入不能为空'))
	return
  }
  if (value == null || value == undefined) return
  let val = value
	.split(/[\n|\r\n|\,|\，]/)
	.map(el => el.trim())
	.filter(el => el !== '')
  this.skusArr = val
  let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi
  let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi
  let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
  let changePlatformd = 1 //上线要改
  let str = 'ASIN须为10位数，纯数字或大写字母和数字的组合'
  if (changePlatformd == 2) {
	reg = /^[0-9]{12,12}$/
	str = '请输入12位纯数字'
  } else if (changePlatformd == 3) {
	reg = /^(?!_)(?!.*?_$)[0-9_]+$/
	str = '请输入纯数字，允许下划线'
  } else if (changePlatformd == 4) {
	reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/
	str = '长度24位，须小写字母与纯数字的组合'
  } else if (changePlatformd == 5) {
	reg = /^[0-9]*$/
	str = '请输入纯数字'
  }
  if (!val.every(el => reg.test(el))) {
	callback(new Error(str))
  } else if (
	val.some(el => regEn.test(el)) ||
	val.some(el => regCn.test(el))
  ) {
	callback(new Error('不能包含特殊字符'))
  } else if (val.length > 500) {
	callback(new Error('输入数量不能超过500个'))
  } else {
	callback()
  }
}


//验证ASIN  允许为空
export function asinValidateNull(rule, value, callback) {
  if (!value) {
	callback()
	return
  }
  if (value == null || value == undefined) return
  let val = value
	.split(/[\n|\r\n|\,|\，]/)
	.map(el => el.trim())
	.filter(el => el !== '')
  this.skusArr = val
  let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi
  let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi
  let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
  let changePlatformd = 1 //上线要改
  let str = 'ASIN须为10位数，纯数字或大写字母和数字的组合'
  if (changePlatformd == 2) {
	reg = /^[0-9]{12,12}$/
	str = '请输入12位纯数字'
  } else if (changePlatformd == 3) {
	reg = /^(?!_)(?!.*?_$)[0-9_]+$/
	str = '请输入纯数字，允许下划线'
  } else if (changePlatformd == 4) {
	reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/
	str = '长度24位，须小写字母与纯数字的组合'
  } else if (changePlatformd == 5) {
	reg = /^[0-9]*$/
	str = '请输入纯数字'
  }
  if (!val.every(el => reg.test(el))) {
	callback(new Error(str))
  } else if (
	val.some(el => regEn.test(el)) ||
	val.some(el => regCn.test(el))
  ) {
	callback(new Error('不能包含特殊字符'))
  } else if (val.length > 500) {
	callback(new Error('输入数量不能超过500个'))
  } else {
	callback()
  }
}
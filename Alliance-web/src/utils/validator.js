let exps = Object.values(GLOBAL.$const['OTHER/phoneExp'])
let postCode = GLOBAL.$const['OTHER/postcode']

let strategies = {
    isMobile(rule, value, cb) {
        let flag = exps.some(regExp => regExp.test(value) == true)
        if (!flag) {
            cb(new Error('联系电话输入错误'))
        }
        cb()
    },
    isPostCode(rule, value, cb) {
        if (postCode.test(value)) {
            cb()
        } else {
            cb(new Error('邮编输入错误'))
        }
    }
}

let validatorStrategies = {
    notEmpty(str, type = true) {
        return {
            required: type,
            message: `${str}不能为空`
        }
    },
    beEmail: {
        type: 'email',
        message: '请输入正确的邮箱地址'
    },
    number: {
        type: 'number',
        message: '必须是数字'
    },
    mobile: {
        validator: strategies.isMobile
    },
    post: {
        validator: strategies.isPostCode
    }
}

export default (type, str) => {
    let validate
    if (type === false) {
        validate = [validatorStrategies.notEmpty(str, false)]
    } else {
        validate = [validatorStrategies.notEmpty(str)]
    }
    switch (type) {
        case 'email':
            validate.push(validatorStrategies.beEmail)
            break
        case 'number':
            validate.push(validatorStrategies.number)
            break
        case 'mobile':
            validate.push(validatorStrategies.mobile)
            break
        case 'post':
            validate.push(validatorStrategies.post)
            break

        default:
            break
    }

    return validate
};
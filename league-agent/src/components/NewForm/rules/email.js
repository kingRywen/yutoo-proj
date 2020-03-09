import ValidationRule from './validate-rule';

class EmailRule extends ValidationRule {
  constructor(props) {
    super(props);
    this.name = "email";
    this.errMsg = "邮箱格式错误";
  }

  validateRule(val) {
    if (typeof val !== "string") return true;
    // eslint-disable-next-line no-useless-escape
    return /^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(
      val
    );
  }
}

export default EmailRule;

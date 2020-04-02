import Vue from "vue";

// class EmptyRule {
//   msg = '不能为空'
//   constructor(msg) {
//     this.msg = msg || '不能为空'
//   }

// }
function EmptyRule(msg, widget) {
  this.msg = msg || "不能为空";
  return [
    {
      required: true,
      message: msg || "不能为空",
      trigger:
        // TODO: 数字验证的时候会有问题
        widget == "number" || widget == "currency" ? ["blur"] : undefined
    },
    this.emptyValidator
  ];
}

EmptyRule.prototype.emptyValidator = {
  validator(rule, value, cb) {
    if (typeof value === "string" && value.trim() === "") {
      cb(new Error("不能为空"));
    }
    cb();
  }
};

const formUtils = {
  /**
   * 判断表单值是否为空
   * @param {array, string} data 要判断的数据
   */
  isEmpty(data) {
    if (Array.isArray(data) && data.length == 0) {
      return true;
    }
    if (data == null || data === "") {
      return true;
    }
    return;
  },
  setObjectKeysByFunc(obj = {}, fn) {
    let keys = Object.keys(obj);
    if (!keys.length) {
      return;
    }
    Object.keys(obj).forEach(key => {
      fn(obj[key]);
    });
  },

  /**
   * 获取验证规则
   *
   * @param {object} schema 表单控件基本对象
   */
  getvalidRules(schema) {
    // debugger
    let value, errMsg;
    const { required } = schema;
    const allRules = window._newform.$rule.allRules;
    if (required == null || required == false) {
      return;
    }

    if (typeof required === "object") {
      value = schema.required.value;
      errMsg = schema.required.errMsg;
    } else {
      value = required;
    }

    if (value == null || value == false) {
      return;
    }

    if (typeof value === "boolean") {
      return required ? new EmptyRule(errMsg, schema.widget) : undefined;
    }

    if (typeof value === "function") {
      return new EmptyRule(errMsg, schema.widget).concat(
        new allRules["function"]({ errMsg, value }).rules
      );
    }
    if (value instanceof RegExp) {
      return new EmptyRule(errMsg, schema.widget).concat(
        new allRules["reg"]({ errMsg, value }).rules
      );
    }

    return new EmptyRule(errMsg, schema.widget).concat(
      new allRules[value]({ errMsg }).rules
    );
  },
  /**
   *  对传入的表单配置项格式化
   *
   * @param {Object} formSchema 表单schema对象
   * @param {Boolean} search    搜索组件
   */
  generateForm(formSchema, search) {
    let returnVal = {};
    const hidden = search === false ? () => false : false;
    const disabled = () => false;
    if (Object.prototype.toString.call(formSchema) !== "[object Object]") {
      throw new Error("formSchema必须是一个json对象");
    }

    function setPropDefault(returnVal, el, key) {
      if (!el.rules && el.type !== "table") {
        el.rules = formUtils.getvalidRules(el);
      }
      if (el.hidden == null || el.hidden === false) {
        el.hidden = hidden;
      } else {
        if (typeof el.hidden === "function" || typeof el.hidden === "boolean") {
          if (typeof el.hidden === "boolean") {
            el.hidden = search === false ? () => el.hidden : el.hidden;
          }
        } else {
          throw new Error("hidden必须是函数或者布尔值");
        }
      }

      if (el.disabled == null) {
        el.disabled = disabled;
      } else {
        if (
          typeof el.disabled === "function" ||
          typeof el.disabled === "boolean"
        ) {
          if (typeof el.disabled === "boolean") {
            el.disabled = () => !!el.disabled;
          }
        } else {
          throw new Error("disabled必须是函数或者布尔值");
        }
      }

      if (!el.type) {
        el.type = "normal";
      }
      if (!el.widget) {
        el.widget = "input";
      }
      if (!el.layout) {
        el.layout = "h";
      }
      if (el.type === "normal") {
        returnVal[key] = el;
      } else if (el.type === "object") {
        returnVal[key] = el;
        let f = el.properties;
        Object.keys(f).forEach(k => {
          let e = f[k];
          setPropDefault(f, e, k);
        });
      } else if (el.type === "table") {
        // 表格表单
        returnVal[key] = el;
        formUtils.setObjectKeysByFunc(el.head, item => {
          item.rules = formUtils.getvalidRules(item);
        });
      } else if (el.type === "array") {
        returnVal[key] = el;
      } else if (el.type === "multiArray") {
        formUtils.setObjectKeysByFunc(el.children, item => {
          item.rules = formUtils.getvalidRules(item);
        });
        returnVal[key] = el;
      }
    }
    // 补全数据
    Object.keys(formSchema).forEach(key => {
      let el = formSchema[key];
      setPropDefault(returnVal, el, key);
    });
    return returnVal;
  },

  setNormalDefault(item, value, key, defaultVal = undefined) {
    if (item.defaultVal == null || item.defaultVal === "") {
      if (defaultVal == null || defaultVal === "") {
        // TODO: 如果是数字，这里是否要处理？
        if (item.widget === "number" || item.widget === "currency") {
          Vue.set(value, key, undefined);
        }
      } else {
        Vue.set(value, key, defaultVal);
      }
    } else {
      Vue.set(value, key, item.defaultVal);
    }
  },

  /**
   * 获取各种表单控件的默认值
   *
   * @param {object} schema 表单控件基本对象
   * @returns
   */
  getInputDefault(schema) {
    let ret;
    switch (schema.widget) {
      // 如果是数字或者货币，且没有默认值 ，则给undefined
      case "number":
      case "currency":
        ret = undefined;
        break;

      // switch组件
      case "switch":
        ret =
          schema.inactiveValue == null
            ? schema.options
              ? schema.options[1].value
              : 0
            : schema.inactiveValue;
        break;

      // 树形展示
      // 时间范围
      case "cascader":
      case "dateRange":
      case "checkbox":
      case "upload":
      case "datetimerange":
        ret = [];
        break;

      default:
        // ret = ''
        break;
    }
    return ret;
  },

  /**
   *  设置默认值， 补全默认值
   *
   * @param {*} value   要设置的表单值
   * @param {*} schema  表单的配置项
   */
  setDefaultVal(value, schema) {
    // console.log(value);
    let retDef = {}
    function setNormalDef(item, value, key) {
      let defaultVal = formUtils.getInputDefault(item);
      formUtils.setNormalDefault(item, value, key, defaultVal);
      retDef[key] = defaultVal;
    }

    // 设置表格值
    function setTable(item, value, key) {
      const { rows, head } = item;

      if (!head || typeof head !== "object") {
        throw new Error("head不存在或者不合法");
      }
      // if (!rows || typeof rows !== "object") {
      //   throw new Error("rows不存在或者不合法");
      // }
      let ret = [];
      const _default = {};
      Object.keys(head).forEach(k => {
        _default[k] = formUtils.getInputDefault(head[k]);
      });

      if (rows) {
        let { props } = rows;
        props = props || {};
        Object.keys(props).forEach(k => {
          let el = props[k],
            val = el.defaultVal || {};
          val = { ..._default, ...val };
          ret.push(val);
        });
      }

      Vue.set(value, key, ret);
      retDef[key] = ret
    }

    function setDef(schema, value) {
      Object.keys(schema).forEach(key => {
        let el = schema[key];
        if (el.type == "normal") {
          if (value[key] == null || value[key] === "") {
            setNormalDef(el, value, key);
          } else {
            retDef[key] = value[key];
          }
        } else if (el.type === "object") {
          let val = Object.prototype.toString.call(value[key]),
            e = {};
          if (val !== "[object Object]" && val !== "[object Array]") {
            if (el.array) {
              e = [e];
              Vue.set(value, key, e);
            } else {
              Vue.set(value, key, e);
            }
          }
          let res = el.array ? value[key][0] : value[key],
            ret = {};
          setDef(el.properties, res);
          Object.keys(res).forEach(key => {
            ret[key] = res[key];
          });
          el.__default = ret;
          retDef[key] = el.__default;
        } else if (el.type === "table") {
          if (
            value[key] &&
            value[key] !== "" &&
            Object.prototype.toString.call(value[key]) === "[object Array]" &&
            value[key].length
          ) {
            const { head } = el;
            let _default = {};
            Object.keys(head).forEach(k => {
              _default[k] = formUtils.getInputDefault(head[k]);
            });
            // debugger;
            value[key].forEach(item => {
              // Object.assign(_default, item);
              Object.keys(_default).forEach(key => {
                if (!(key in item)) {
                  item[key] = _default[key];
                }
              });
            });
            return;
          }
          setTable(el, value, key);
        } else if (el.type === "array") {
          if (Object.prototype.toString.call(value[key]) !== "[object Array]") {
            Vue.set(value, key, []);
            setNormalDef({ ...el, type: "normal" }, value[key], 0);
          }
          for (let index = 0; index < el.lenMax.length; index++) {
            setNormalDef({ ...el, type: "normal" }, value[key], index);
          }
        } else if (el.type == "multiArray") {
          if (Object.prototype.toString.call(value[key]) !== "[object Array]") {
            // FIXME: 需要把默认值带进去
            Vue.set(value, key, [{}]);
            retDef[key] = [{}]
          }
        }
      });
    }
    setDef(schema, value);
    // return 默认值
    return retDef
  }
};

export default formUtils;

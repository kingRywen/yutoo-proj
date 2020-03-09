/* eslint-disable no-useless-escape */
export function resultData(arr, arr1) {
  let [...arr2] = arr;
  arr2.forEach((e, index, arr3) => {
    if (e !== "+" && e !== "-" && e !== "(" && e !== ")")
      arr3[index] = arr1.find(i => i.ruleName === e).ruleId;
    else if (e === "+") arr3[index] = "与";
    else if (e === "-") arr3[index] = "或";
  });
  return strategyResult(arr2);
}

function strategyResult(arr) {
  let [...arr1] = arr;
  let str1 = arr1.join("");
  let reg = /([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g;
  let match;
  function getOp(op) {
    return op === "与" ? 1 : 0;
  }
  function getNormal(str) {
    let i = 0,
      ret = [];
    str.replace(/[与或]*[^与或]+/g, function(match, index, input) {
      let el = {};
      if (match[0].charAt() === "与" || match[0].charAt() === "或") {
        el = {
          groupId: match.substring(1),
          op: getOp(match[0].charAt())
        };
      } else {
        el = {
          groupId: match
        };
      }
      ret.push(el);
      i = index;
    });
    return ret;
  }
  function getMatch(
    str,
    ret = [],
    parent,
    reg = /([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g
  ) {
    if (
      !/([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g.test(
        str
      )
    ) {
      parent.formula.push(...getNormal(str));
      return ret;
    }
    while ((match = reg.exec(str))) {
      let el = [];
      if (/[与或]*\(([^()]*(\(.*\))*[^()]*)*\)/.test(match[0])) {
        if (match[0].charAt() === "与" || match[0].charAt() === "或") {
          let p = {
            op: getOp(match[0].charAt()),
            formula: []
          };
          el.push(p);
          if (parent) {
            parent.formula.push(...el);
          } else {
            ret.push(...el);
          }
          getMatch(match[0].substring(2, match[0].length - 1), ret, p);
        } else {
          let p = {
            formula: []
          };
          el.push(p);
          if (parent) {
            parent.formula.push(...el);
          } else {
            ret.push(...el);
          }
          getMatch(
            match[0].substring(1, match[0].length - 1),
            ret,
            p,
            /([与或]*\(([^()]*(\(.*\))*[^()]*)*\))|([与或]*[^()]+(?<![与或]))/g
          );
        }
      } else if (/[与或]*([^()]+)(?<![与或])/.test(match[0])) {
        el = getNormal(match[0]);
        if (parent) {
          parent.formula.push(...el);
        } else {
          ret.push(...el);
        }
      } else {
      }
    }
    return ret;
  }
  let ret = getMatch(str1);
  return ret;
}

export function validLegal(string, ids) {
  let reg;
  if (ids.length) {
    reg = new RegExp("(" + ids.join("|") + ")\\1{1}");
  }
  // 剔除空白符
  string = string.replace(/\s/g, "");

  // 错误情况，空字符串
  if ("" === string) {
    return false;
  }
  // console.log(reg);

  // 错误情况，变量重复
  if (reg && reg.test(string)) {
    return false;
  }

  // 错误情况，运算符连续
  if (/[\+\-\*\/]{2,}/.test(string)) {
    return false;
  }

  // 空括号
  if (/\(\)/.test(string)) {
    return false;
  }

  // 错误情况，括号不配对
  var stack = [];
  for (var i = 0, item; i < string.length; i++) {
    item = string.charAt(i);
    if ("(" === item) {
      stack.push("(");
    } else if (")" === item) {
      if (stack.length > 0) {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  if (0 !== stack.length) {
    return false;
  }

  // 错误情况，(后面是运算符
  if (/\([\+\-\*\/]/.test(string)) {
    return false;
  }

  // 错误情况，)前面是运算符
  if (/[\+\-\*\/]\)/.test(string)) {
    return false;
  }

  // 错误情况，(前面不是运算符
  if (/[^\+\-\*\/]\(/.test(string)) {
    return false;
  }

  // 错误情况，)后面不是运算符
  if (/\)[^\+\-\*\/]/.test(string)) {
    return false;
  }

  return true;
}

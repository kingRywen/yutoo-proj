import newform from './newform';
import AllRules from './validate';

export default {
  install: function (Vue, { extRules = [] } = {}) {
    window._newform = {}
    window._newform.$rule = new AllRules()
    // 注册验证规则
    extRules.forEach(rule => {
      window._newform.$rule.registerRule(rule)
    })
    Vue.component(newform.name, newform)
  }
};

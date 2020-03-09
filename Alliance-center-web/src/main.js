import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'

import ELEMENT from 'element-ui';
import '../theme/index.css'

// import yutoo from '@yutoo/yutoo';

import VueLazyload from 'vue-lazyload'

import 'Components' // 全局组件注册
import 'Directives' // 指令

// 引入svg图像
const requireAll = requireContext => requireContext.keys().map(requireContext);
// import all svg
const req = require.context('./assets/svg', true, /\.svg$/);
requireAll(req);

// 引入插件
import router from '@/router/index'
import inject from 'Plugins/inject'
import store from '@/store/index'
import globalMixin from './globalMixin';
// import chart from 'echarts'
import '@/assets/css/index.scss';
// 引入echarts全部组件
// Vue.use(chart)
// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()

Vue.mixin(globalMixin)
Vue.use(inject)
Vue.use(ELEMENT);
// Vue.use(yutoo);
Vue.config.productionTip = false


router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title
    }
    next()
})

Vue.use(VueLazyload, {
    preLoad: 1.3,
    attempt: 2
})

Vue.prototype.$msg = function (msg, type = 'success') {
    let self = this;
    self.$message({
        showClose: true,
        message: msg,
        type: type
    });
}
// 新增
Vue.mixin({
    methods: {

        // 加载类目树
        loadTree(id = [0], selEl, itemDisabled) {

            if (!selEl) {
                selEl = {
                    categorySysId: 0,
                    level: 0
                }
            }
            let {
                categorySysId,
                categoryId,
                level
            } = selEl
            // console.log(selEl);
            let params = {
                level: level + 1,
                parentCategoryId: categorySysId != null ? categorySysId : categoryId
            }
            return this.$api[`main/categorySysDropdownList`](params)
                .then(data => {
                    if (data && data.code && data.code !== 0) {
                        this.$message.error(data.msg)
                        return
                    }


                    return data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            enabled: el.categorySysId !== itemDisabled && el.lastLevel !== 1,
                            isLeaf: !el.hasChild
                        }
                    })
                })
                .catch(() => { })
        },
        loadTreeNoLast(id = [0], selEl, itemDisabled) {

            if (!selEl) {
                selEl = {
                    categorySysId: 0,
                    level: 0
                }
            }
            let {
                categorySysId,
                categoryId,
                level
            } = selEl
            // console.log(selEl);
            let params = {
                level: level + 1,
                parentCategoryId: categorySysId != null ? categorySysId : categoryId
            }
            return this.$api[`main/categorySysDropdownListNoHasLastLevel`](params)
                .then(data => {
                    if (data && data.code && data.code !== 0) {
                        this.$message.error(data.msg)
                        return
                    }


                    return data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            enabled: el.categorySysId !== itemDisabled,
                            isLeaf: !el.hasChild
                        }
                    })
                })
                .catch(() => { })
        },
        // 加载平台站点树
        loadSiteTree(id = [0], selEl, itemDisabled, _params = {}) {

            let { platformSiteCode } = _params
            if (!selEl) {
                selEl = {
                    categoryId: 0,
                    level: 0
                }
            }
            let {
                categoryId,
                level
            } = selEl
            let params = {
                level: level + 1,
                parentCategoryId: categoryId,
                platformSiteCode
            }
            return this.$api[`main/categoryPlatformSiteDropdownList`](params)
                .then(data => {
                    if (data && data.code && data.code !== 0) {
                        this.$message.error(data.msg)
                        return
                    }


                    return data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            disabled: el.categoryId !== itemDisabled,
                            isLeaf: !el.hasChild
                        }
                    })
                })
                .catch(() => { })
        },
    },
    filters: {
        _formatData_cate: function (val) {
            if (val == null || val === -1 || val === "") {
                return "-";
            } else {
                if (val.indexOf(":") !== -1) {
                    let arr = val.split(":");
                    // 
                    val = arr[0] + "..." + arr[arr.length - 1];
                    if (arr.length === 2) {
                        val = arr.join(':')
                    }
                    return val;
                } else {
                    return val;
                }
            }
        },
        _formatData(val) {
            return val == null || val === -1 || val === "" ? "-" : val;
        },
        _formatData2(val) {
            return val == null || val === -1 || val === "" ? "" : val;
        },
        _formatRate(val) {
            if (val == null || val === "") {
                return '-'
            }
            var str = Number(val * 100).toFixed(1);
            str += "%";
            return str
        },
        _formatRate2(val) {
            if (val == null || val === "") {
                return '-'
            }
            var str = Number(val * 100).toFixed(2);
            str += "%";
            return str
        },
        _formatFlag(val) {
            if (val === 0) {
                return "自发货"
            } else if (val === 1) {
                return "FBS"
            } else if (val === 2) {
                return "自发货+FBS"
            }
        }
    }
})
// end新增
window.vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
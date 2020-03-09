import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'

import ELEMENT from 'element-ui';
import '../theme/index.css'

import yutoo from '@yutoo/yutoo';

import VueLazyload from 'vue-lazyload'

import 'Components' // 全局组件注册
import 'Directives' // 指令

// 引入插件
import router from '@/router/index'
import inject from 'Plugins/inject'
import store from '@/store/index'
// import chart from 'echarts'
import '@/assets/css/index.scss';
// 引入echarts全部组件
// Vue.use(chart)
// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()

Vue.use(inject)
Vue.use(ELEMENT);
Vue.use(yutoo);
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
    },
    methods: {
        // 加载类目树
        loadTree(id = [0], selEl, itemDisabled) {
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
                parentId: categoryId
            }
            return this.$api[`main/categoryDropdownList`](params)
                .then(data => {
                    if (data && data.code && data.code !== 0) {
                        this.$message.error(data.msg)
                        return
                    }


                    return data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            enabled: el.categoryId !== itemDisabled,
                            isLeaf: !el.hasChild
                        }
                    })
                })
                .catch(() => {})
        },
        // 侧边栏类目树获取
        _loadNode(node) {
            let {
                data
            } = node,
            params



            if (data) {
                params = {
                    level: data.level + 1,
                    parentId: data.categoryId
                }
            } else {
                params = {
                    level: 1,
                    parentId: 0
                }
            }

            return this.$api[`main/categoryDropdownListHasParent`](params)
        },
    },
})
// end新增
window.vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'

import ELEMENT from 'element-ui';
import '../theme/index.css'

import yutoo from '@yutoo/yutoo';

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
// import chart from 'echarts'
import '@/assets/css/index.scss';
import mixins from './mixins';
Vue.mixin(mixins)

import storage from 'Utils/saver';
// 引入echarts全部组件
// Vue.use(chart)
// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()
Vue.prototype.$storage = storage

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
        // 没有最底层 用于类目编辑新增时选择上级类目 
        loadTreeNoLast(id = [0], selEl) {
            if (!selEl) {
                selEl = {
                    categoryId: 0,
                    level: 0
                }
            }
            let { categoryId, level } = selEl
            let params = {
                level: level + 1,
                parentId: categoryId
            }

            return this.$api[`main/dropdownListNoHasLastLevel`](params)
                .then(data => {
                    if (!data) {
                        this.$message.error(data.msg)
                        return
                    }
                    data = data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            enabled: el.hasChild ? true : !el.lastLevel,
                            isLeaf: !el.hasChild
                        }
                    })
                    return data
                })
                .catch(() => { })
        },
        // 只有最底层类目 的接口
        loadTreeHasLast(id = [0], selEl) {
            if (!selEl) {
                selEl = {
                    categoryId: 0,
                    level: 0
                }
            }
            let { categoryId, level } = selEl
            let params = {
                level: level + 1,
                parentId: categoryId
            }

            return this.$api[`main/categoryDropdownListHasLastLevel`](params)
                .then(data => {
                    if (!data) {
                        this.$message.error(data.msg)
                        return
                    }
                    data = data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            enabled: el.hasChild ? true : !!el.lastLevel,
                            isLeaf: !el.hasChild
                        }
                    })
                    return data
                })
                .catch(() => { })
        },
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
                            enabled: (itemDisabled != null) ? el.categoryId !== itemDisabled : true,
                            isLeaf: !el.hasChild
                        }
                    })
                })
                .catch(() => { })
        },
        // 系统类目树
        loadTree1(id = [0], selEl) {


            if (!selEl) {
                selEl = {
                    categorySysId: 0,
                    level: 0
                }
            }
            let {
                categorySysId: categoryId,
                level
            } = selEl
            let params = {
                level: level + 1,
                parentCategoryId: categoryId
            }

            return this.$api[`main/categorySysList`](params)
                .then(data => {
                    if (!data) {
                        this.$message.error(data.msg)
                        return
                    }
                    data = data.map(el => {
                        return {
                            ...el,
                            childs: el.hasChild ? [] : null,
                            enabled: el.hasChild ? true : !!el.lastLevel,
                            isLeaf: !el.hasChild
                        }
                    })


                    return data
                })
                .catch(() => { })
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
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui';
import '../theme/index.css'

import VueLazyload from 'vue-lazyload'
import chart from 'echarts'
import VueClipboard from 'vue-clipboard2';

import storage from 'Utils/saver';

import 'Components' // 全局组件注册
import 'Directives' // 指令

// 初始化前设置routerType
storage.set('local', 'routerType', 'ebay')
// 全局 event bus 用来发布订阅
GLOBAL.vbus = new Vue()

// 引入插件
import router from '@/router/index'
import inject from 'Plugins/inject'
import store from '@/store/index'
import '@/assets/css/index.scss';
// import svg from '@/assets/images/loading.svg';
import { CONST_PORT_CONFIG } from "Config";


// 引入echarts全部组件
Vue.use(chart)


Vue.use(inject)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(VueClipboard);

// import routes from './router/shopRouter/index'
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = `${to.meta.title} | 店铺优化`
    }
    // if (from.name === null && to.name === null) { //页面刷新
    next()
})

Vue.use(VueLazyload, {
    preLoad: 1.3,
    attempt: 2,
    // loading: svg
})

Vue.prototype.$msg = function (msg, type = 'success') {
    let self = this;
    self.$message({
        showClose: true,
        message: msg,
        type: type
    });
};

Vue.mixin({
    filters: {
        _formatData_cate: function (val) {
            if (val == null || val === -1 || val === "") {
                return "-";
            } else {
                if (val.indexOf(":") !== -1) {
                    let arr = val.split(":");
                    // console.log(arr);
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
        },
        _fbpFlagAmazon(val) {
            if (val === 0) {
                return "自发货"
            } else if (val === 1) {
                return "FBA"
            } else if (val === 2) {
                return "自发货+FBA"
            }
        },
        __formatFlagM(val) {
            return val == null || val === -1 || val === "" ? "-" : "$" + val;
        },
        // 店铺管理 问题类型
        __formatFlagP(val) {
            return val == null || val === -1 || val === "" ? "-" : val[0].problemName;
        },
        // 赔偿的没有带单位的
        _formatData111(arg, val) {
            // return val == null || val === -1 || val === "" ? "-" : val.problemType <= 3 ? '$' + val : val;
            if (val.problemType <= 3) {
                return '$' + arg
            } else {
                return arg
            }
        }
    },
    methods: {
        getSelection() {
            return this.$refs.layout.selection
        },
        getSelectionByKey(key) {
            return this.getSelection().map(el => el[key])
        },
        getLayoutList() {
            return this.$refs.layout.getList()
        },
        renderIndex(scope) {
            let { $index } = scope
            let lay = this.$refs.layout
            let { pageNo, pageSize } = lay
            return <span>{$index + 1 + (pageNo - 1) * pageSize}</span>
        },
        // 所有的表格导出功能
        downLoadList(params, api, name) {
            params = this.$.dealObjectValue(params);
            const { BASE_URL } = CONST_PORT_CONFIG;
            this.$ajax({
                method: "post",
                url: BASE_URL + api,
                data: params,
                responseType: "blob"
            })
                .then(data => {
                    let url = window.URL.createObjectURL(new Blob([data]));
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download", name + ".xlsx");
                    y.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(function (error) {
                    // console.log(error);
                });
        }
    },
    computed: {
        sellerData() {
            return {platformId: 1, ...this.$store.state.common.sellerData};
        },
        sellerId() {
            return this.$store.state.common.sellerData.sellerId;
        },
        siteId() {
            return +this.$store.state.common.sellerData.siteId;
        },
        platformId() {
			// let type = this.$store.state.common.routerType
   //          return type==='amazon'?1:2
			return 1
        },
        ebayPlatformId(){
            return 2
        },
    }
})
// end新增
window.vm = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
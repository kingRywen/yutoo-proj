import Vue from 'vue';
import App from './app.vue'
import Router from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import YtLayout from './layout'
import YtTable from './table'
import YtSearch from './search'

Vue.use(ElementUI);
Vue.use(YtLayout);
Vue.use(YtTable);
Vue.use(YtSearch);

import Amend from './amend'
import Record from './record'

import VueBus from 'common/vue-bus'

// import helloworld from './helloworld' ////////////////////////////

Vue.use(Router);
Vue.use(VueBus);





const router  = new Router({
    routes: [
        {path: '/',component: Amend},
        // {path: '/',component: helloworld},
        {path: '/amend',component: Amend},
        {path: '/record',name: 'record',component: Record},
    ]
})


new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})

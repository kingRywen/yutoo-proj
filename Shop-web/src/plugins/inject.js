import axios from './axios'

import api from './api'
import funs from './$';
import consts from './const'
GLOBAL.ajax = api
GLOBAL.consts = consts
import Dialog from '@/views/Common/Dialog'
import cfuns from './functions'
import Search from '@/views/Common/Search'
import SearchDetail from '@/views/Common/SearchDetail'
import Cate from '@/views/Common/Cate'
import CateGrouping from '@/views/Common/CateGrouping'
import Handler from '@/views/Common/Handler'
import Table from '@/views/Common/Table'
import TableSelect from '@/views/Common/TableSelect'
import rankChart from '@/views/Common/rankChart'
import ECharts from 'vue-echarts/components/ECharts'
import NonePage from '@/views/Common/NonePage'
import Sider from '@/views/Common/Sider/Sider.vue'
export default {
    // eslint-disable-next-line
    install: (Vue, options) => {
        Vue.prototype.$api = api
        Vue.prototype.$ajax = axios
        Vue.prototype.$const = consts
        Vue.prototype.$ = funs
        // 需要挂载的都放在这里
        Vue.component('el-dialog-yt', Dialog)
        Vue.prototype.cfuns = cfuns
        Vue.component('el-search', Search)
        Vue.component('el-search-detail', SearchDetail)
        Vue.component('el-cate', Cate)
        Vue.component('el-cate-grouping', CateGrouping)
        Vue.component('el-handler', Handler)
        Vue.component('el-table-pagination', Table)
        Vue.component('el-table-select', TableSelect)
        Vue.component('el-rank-chart', rankChart)
        Vue.component('echart', ECharts)
        Vue.component('none-page', NonePage)
        Vue.component('yt-sider', Sider)
    }
}
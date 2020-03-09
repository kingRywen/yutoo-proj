import SimpleForm from './SimpleForm'
import Vue from 'vue'
import UniversalLayout from '@/components/UniversalLayout'
import Search from '@/components/search'
import YtTable from '@/components/table'
import TwpPage from '@/components/Page'
import YtDialog from '@/components/dialog'
import TreeBtn from '@/components/treeBtn'
import logInfo from '@/components/logInfo'
import tFormItem from '@/components/tFormItem'
import ChoseTemplate from '@/components/ChoseTemplate'
import ECharts from 'vue-echarts/components/ECharts.vue'

Vue.use(UniversalLayout)
Vue.use(Search)
Vue.use(YtTable)
Vue.use(TwpPage)
Vue.use(YtDialog)
Vue.use(TreeBtn)
Vue.use(logInfo)
Vue.use(tFormItem)
Vue.use(ChoseTemplate)
Vue.component('chart', ECharts)
Vue.use(SimpleForm)

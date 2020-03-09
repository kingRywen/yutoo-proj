import Vue from 'vue'
import UniversalLayout from '@/components/UniversalLayout'
import Search from '@/components/search'
import YtTable from '@/components/table'
import YtDialog from '@/components/dialog'
import YtForm from '@/components/form'
import YtCustomExport from '@/components/CustomExport'
import YtMenuSelect from '@/components/MenuSelect'
import YtTransitionType from '@/components/transition'
import YtTreeSelect from '@/components/TreeSelect'
import NonePage from '@/components/NonePage'
import TwpForm from '@/components/dialogForm'
import TTable from './tTable'
import search from './search'
import tPage from './tPage'
import TDialog from './tDialog'
import tDrag from './tDrag'
import tFormItem from './tFormItem'
import btns from './btns'

Vue.use(UniversalLayout)
Vue.use(Search)
Vue.use(YtTable)
Vue.use(YtCustomExport)
Vue.use(YtTransitionType)
Vue.use(YtMenuSelect)
Vue.use(YtDialog)
Vue.use(YtForm)
Vue.use(YtTreeSelect)
Vue.use(NonePage)
Vue.use(TwpForm)

Vue.use(TTable)
Vue.use(search)
Vue.use(tPage)
Vue.use(TDialog)
Vue.use(tDrag)
Vue.use(tFormItem)
Vue.use(btns)

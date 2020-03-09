import TwpPage from './src'
import TwpDialog from './src/dialogComponent.vue'
import TwpSimpleTable from './src/simpleTable'
import twpTime from './src/twpTime'
import twpUpdata from './src/updata'
import productsImg from './src/productsImg'

TwpPage.install = function(Vue) {
  Vue.component(TwpPage.name, TwpPage)
  Vue.component(TwpDialog.name, TwpDialog)
  Vue.component(TwpSimpleTable.name, TwpSimpleTable)
  Vue.component(twpTime.name, twpTime)
  Vue.component(twpUpdata.name, twpUpdata)
  Vue.component(productsImg.name, productsImg)
}

export default TwpPage

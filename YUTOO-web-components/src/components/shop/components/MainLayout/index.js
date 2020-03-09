import MainLayout from './src/MainLayout'
import CollapseWrapper from './src/CollapseWrapper'

MainLayout.install = function(Vue) {
  Vue.component(MainLayout.name, MainLayout)
  Vue.component(CollapseWrapper.name, CollapseWrapper)
}

export default MainLayout

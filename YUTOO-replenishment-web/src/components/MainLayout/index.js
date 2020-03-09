import MainLayout from './src/MainLayout'
import CollapseWrapper from './src/CollapseWrapper';
import Dialog from './src/dialog';

MainLayout.install = function (Vue) {
  Vue.component(MainLayout.name, MainLayout)
  Vue.component(CollapseWrapper.name, CollapseWrapper)
  Vue.component(Dialog.name, Dialog)
}

export default MainLayout
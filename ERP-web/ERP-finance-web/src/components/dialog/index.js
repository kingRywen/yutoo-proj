import Dialog from './src/dialog'
import dialogCom from './src/dialogCom.vue'

Dialog.install = function (Vue) {
  Vue.component(Dialog.name, Dialog)
  Vue.component(dialogCom.name, dialogCom)
}

export default Dialog
import Dialog from "./src/YtDialog.vue";
import DialogCom from "./src/DialogCom.vue";

Dialog.install = function (Vue) {
  Vue.component(Dialog.name, Dialog);
  Vue.component(DialogCom.name, DialogCom);
};

export default Dialog;
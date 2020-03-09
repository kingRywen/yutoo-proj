import Vue from "vue";
import store from '@/store/index'
export default class CreateComponent {
  constructor() {
    this.instances = [];
    this.id = 1;
  }
  removeItem(instance) {
    if (!instance) {
      return;
    }
    let index = this.instances.findIndex(item => item.id == instance.id);
    if (index < 0) {
      return;
    }
    this.instances.splice(index, 1);
    instance.visible = false;
    return Promise.resolve(instance);
  }
  createInstance(options, creatorOptions) {
    //生成组件
    let Creator = Vue.extend(creatorOptions);
    let {
      on = {},
        params = {},
        ...rest
    } = options;
    let instance = new Creator({
      store,
      propsData: {
        params
      },
      data: {
        ...rest
      }
    });
    instance.id = "instance" + this.id++;
    //组件需要挂载在dom元素上
    instance.vm = instance.$mount();

    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;

    // 监听组件$emit事件
    if (on) {
      for (const key in on) {
        if (on.hasOwnProperty(key)) {
          const element = on[key];
          instance.$on(key, element);
        }
      }
    }

    this.instances.push(instance);
    return instance.vm;
  }
}
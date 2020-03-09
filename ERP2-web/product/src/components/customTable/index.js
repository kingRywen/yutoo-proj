import customTable from './src';

export default {
  install: (Vue) => {
    Vue.component(customTable.name, customTable)
  }
}
import locationSearch from './src/index.vue'

locationSearch.install = function (Vue) {
  Vue.component(locationSearch.name, locationSearch)
}

export default locationSearch


import YtSearch from "./src/search.vue";

YtSearch.install = function(Vue) {
  Vue.component(YtSearch.name, YtSearch);
};

export default YtSearch;

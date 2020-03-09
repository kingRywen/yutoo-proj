import Vue from 'vue'
// import clickoutside from './clickoutside'
import permission from './permission'
import './tableCustom';
import setplain from './setplain';

// Vue.directive('outside', clickoutside)
Vue.directive('permission', permission)
Vue.directive('setplain', setplain)
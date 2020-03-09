import './app.scss'
import Vue from 'vue'
import {BASE_URL} from 'scripts/common.js'

window.vm = new Vue({
  el: '#root',
  data () {
    return {
      src: BASE_URL + '/druid/index.html'
    }
  }
})
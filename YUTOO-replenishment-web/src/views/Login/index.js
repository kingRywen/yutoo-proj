import UserLogin from './src/UserLogin.vue'

UserLogin.install = function(Vue) {
  Vue.component(UserLogin.name, UserLogin)
}

export default UserLogin

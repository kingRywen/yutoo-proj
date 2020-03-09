<template>
  <div class="wrap">
    <mt-header :title="title" class="marbottom15">
      <div slot="left">
        <mt-button v-if="menu" icon="back" @click="goBack">返回</mt-button>
      </div>
      <div slot="right">
        <mt-button v-if="menu" @click="handleCancel">注销</mt-button>
      </div>
    </mt-header>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import storage from 'Utils/saver'
export default {
  data() {
    let vm = this
    return {
      menu: true,
      routesName: '',
      list: vm.$router.options.routes[2].children
    }
  },
  computed: {
    title: {
      get() {
        let vm = this
        return `${vm.routesName}(ID:${storage.get('local', 'nickname')})`
      }
    }
  },
  created() {
    this.routesName = storage.get('local', 'routesName') || '功能菜单'
  },
  watch: {
    $route(to, from) {
      let currentName = to.name
      this.routesName = this.list.filter(
        item => item.name == currentName
      )[0].meta.title
      storage.set('local', 'routesName', this.routesName)
    }
  },
  methods: {
    goBack() {
      // if (this.$route.name != 'menu') {
      //   this.$router.back(-1)
      // }
      this.$router.back(-1)
    },
    handleCancel() {
      storage.set('local', 'token', null)
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.wrap {
  background: #fff;
  max-width: 1024px;
  margin: auto;
}
</style>

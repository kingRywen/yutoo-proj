<template>
<el-aside width="200px" style="background-color: rgb(238, 241, 246);height: 100%">
  <img src="/wenwen" alt="" height="60px" style="display:block">
  <!-- <el-menu router unique-opened :default-openeds="index" @open="bindIndex" @select="bindSelect" :default-active="$route.path"> -->
  <el-menu router unique-opened :default-openeds="index" @open="bindIndex" @select="bindSelect" :default-active="myPath || $route.path">
    <template v-for="(list, index) in lists">
      <el-submenu :index="index + ''" :key="index" v-if="list.list">
        <template slot="title">
          <i :class="list.icon"></i>
          <span slot="title" style='font-weight:bold;font-size:15px'>{{list.name}}</span>
        </template>
        <el-menu-item v-for="(item, i) in list.list" :key="i" v-if="!item.list" :index="'/' + item.url">
          {{item.name}}
        </el-menu-item>
      </el-submenu>
      
      <el-menu-item :key="index" v-else :index="'/' + list.url">
        <i :class="list.icon"></i>
        <span slot="title" style='font-weight:bold'>{{list.name}}</span>
      </el-menu-item>
    </template>
  </el-menu>
</el-aside>
</template>
<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import { mapState } from 'vuex'
export default {
  props: ['baseUrl'],
  created () {
    this.getSiderBar({
      route: this.$route.path
    })
  },
  data () { 
    return {
      index: ['0'],
      menuList: []
    }
  },
  methods: {
    ...mapActions('menu', [
      'getSiderBar'
    ]),
    bindIndex (e, i) {
      // console.log(e)
    },
    bindClick (e) {
      this.$emit('change', e.$el.dataset.name)
    },
    bindSelect (e, i) {
      // console.log(e, i)
      // var urlArr = [];
      // for (let i=0;i<this.lists.length;i++) {
      //   let key = this.lists[i]
      //   if (key.url){
      //     urlArr.push(key.url)
      //   } else if(key.list){
      //     for (let j=0;j<key.list.length;j++) {
      //       urlArr.push(key.list[j].url)
      //     }
      //   }
      // }
      // this.urlArr = urlArr
      // console.log(urlArr)
      // let path = e.substring(1)
      // let result = urlArr.indexOf(path)
      // if (result === -1) {
      //   this.result = -1
      // }
      // console.log(result)
    }
  },
  computed: {
    lists () {
      return this.$store.state.menu.subMenus
    },
    myPath () {
      return this.$store.state.common.pathFromCheckProductAnalysis
    }
  }
}
</script>
<style scoped>
</style>

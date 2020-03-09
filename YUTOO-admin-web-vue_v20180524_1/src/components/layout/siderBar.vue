<template>
  <v-sider collapsible :collapsed="collapsed" :trigger="false" :collapsed-width="64" style="background: transparent">
    <v-menu mode="inline" :data="$attrs.data" style="height:100%" :inline-collapsed="collapsed" @item-click="itemClick"></v-menu>
  </v-sider>
</template>
<script>
import bus from 'common/bus.js';
export default {
  name: 'yt-siderbar',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  created () {
    let vm = this
    
    bus.$on('toggle', () => {
      vm.$nextTick(()=> {
        vm.$emit('update:collapsed', !this.$props.collapsed)
      })
    })
  },
  methods: {
    itemClick (e) {
      this.$emit('item-click', e)
    }
  }
}
</script>


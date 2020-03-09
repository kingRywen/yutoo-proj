<template>
  <div class="wrap">
    <div class="top50"></div>
    <group title="选择仓库">
      <selector :options="list" v-model="defaultValue"></selector>
    </group>
    <div style="padding:15px 0;">
      <x-button type="primary" @click.native="getValue('valueMapRef')">提交</x-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultValue: '',
      list: [{ key: 'gd', value: '广东' }, { key: 'gx', value: '广西' }]
    }
  },
  methods: {
    getValue(ref) {
      this.$router.push('app')
    }
  }
}
</script>

<style lang="scss">
.wrap {
  .top50 {
    margin-top: 50%;
  }
}
</style>

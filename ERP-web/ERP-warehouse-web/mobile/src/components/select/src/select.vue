<template>
  <div class="yt-select">
    <popup-picker
      :popup-title="popupTitle"
      :title="title"
      :data="lists"
      v-model="values"
      @on-show="onShow"
      @on-hide="onHide"
      @on-change="change"
      :placeholder="placeholder"
    ></popup-picker>
  </div>
</template>

<script>
export default {
  name: 'yt-select',
  props: {
    popupTitle: {
      type: String,
      default: '选择'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: [] //{name: '上海',value: 1}
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    let vm = this
    return {
      format: function(value, name) {
        return `${name}`
      },
      values: []
    }
  },
  created() {
    let vm = this
    let current = ''
    vm.list.map(item => {
      if (item.value == vm.value) {
        current = item.label
      }
      return item
    })
    if (current) {
      vm.values = [current]
    } else {
      vm.values = []
    }
  },
  computed: {
    lists() {
      let vm = this
      if (vm.list && vm.list.length) {
        return [
          vm.list.map(item => {
            return item.label
          })
        ]
      } else {
        return []
      }
    }
  },
  watch: {},
  methods: {
    change(val) {
      let vm = this
      let obj = {}
      vm.list.map(item => {
        try {
          if (val.indexOf(item.label) >= 0) {
            vm.$emit('update:value', item.value)
          }
        } catch (error) {
          console.log(error)
        }
      })
    },
    onHide(val) {
      this.$emit('hide', val)
    },
    onShow() {
      this.$emit('show')
    }
  }
}
</script>

<style lang="scss">
.yt-select {
  background: #fff;
}
</style>

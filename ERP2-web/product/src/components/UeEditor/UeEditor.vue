<template>
  <script :id.prop="initId" type="text/plain"></script>
</template>

<script>
import UE from 'UE'

export default {
  name: 'UeEditor',
  data() {
    return {
      editor: null,
      flag: true // 是否触发value 的watch事件
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initEditor()
    })
  },

  beforeDestroy() {
    this.editor.removeListener('ready', this.ready)
    this.editor.removeListener('contentChange', this.contentChange)
    this.editor.destroy()
    this.editor = null
  },

  watch: {
    value(val) {
      if (this.flag) {
        this.setValueToEdit(val)
      }
    },
    disabled(val) {
      if (val) {
        this.editor.setDisabled()
      } else {
        this.editor.setEnabled()
      }
    }
  },

  methods: {
    // 把str添加进编辑器
    setStr(str) {
      this.editor.execCommand('inserthtml', str)
    },
    ready() {
      let vm = this
      if (vm.value) {
        // 如果存在初始值则初始化取值
        vm.setValueToEdit(vm.value)
      }
      if (vm.disabled) {
        vm.editor.setDisabled()
      }
    },
    contentChange() {
      let vm = this
      vm.flag = false
      // 动态获取编辑器的内容
      let content = vm.editor.getContent()
      vm.$emit('input', vm.unhtml(content))
      // 等到input事件触发完value的watch事件后， 把flag重置，下次value赋值的时候就会修改编辑器的内容, 以实现双向绑定
      vm.$nextTick(() => (vm.flag = true))
    },
    // 初始化UE
    initEditor() {
      let vm = this
      vm.editor = UE.getEditor(vm.initId, vm.config)
      /* 监听编辑器初始化完成的状态 */
      vm.editor.addListener('ready', this.ready)

      this.editor.addListener('contentChange', this.contentChange)
    },

    setValueToEdit(val) {
      if (!this.editor) {
        return
      }
      try {
        this.editor.setContent(this.html(val))
        // eslint-disable-next-line no-empty
      } catch (error) {}
    },

    unhtml(html) {
      return UE.utils.unhtml(html)
    },

    html(html) {
      return UE.utils.html(html)
    }
  },

  model: {
    // 绑定自定义model, 当触发实例的input事件时， 会主动更新value绑定的值，父组件的value值也会同步更新
    prop: 'value',
    event: 'input'
  },

  props: {
    value: {
      type: String
    },
    initId: {
      // 初始化编辑器时传入的ID，默认生成随机字符串
      // 自定义传入时必须注意，要保证ID在同一页面中的只能存在唯一一个，否则会出现初始化编辑器异常
      type: String,
      default: () => `_${Math.random()}`
    },
    disabled: {
      // 是否禁用编辑器，适合展示
      type: Boolean,
      default: false
    },

    config: {
      // 编辑器配置项
      type: Object,
      default: () => ({
        initialFrameWidth: null,
        initialFrameHeight: 350
      })
    }
  }
}
</script>

<style>
</style>

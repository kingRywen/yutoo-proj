<template>
  <el-cascader
    filterable
    class="__yt_cascader"
    :options="options2"
    :disabled="disabled"
    @active-item-change="handleItemChange"
    :props="props"
    :size="size"
    :clearable="clearable"
    :itemDisabled="itemDisabled"
    style="width:100%"
    @change="handlerChange"
    :value="value"
    @input="$emit('input', $event)"
    separator=" : "
  ></el-cascader>
</template>

<script>
export default {
  name: 'SyncCascader',
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    clearable: {
      default: false
    },
    filterFunc: {
      type: Function,
      default: () => {
        return true
      }
    },
    params: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    itemDisabled: {
      type: [Number, Boolean, String],
      default: null
    },
    size: {
      type: String,
      default: 'small'
    },
    getEl: {
      type: Boolean,
      default: false
    },
    load: {
      type: Function,
      default: () => Promise.resolve([])
    },
    city: {
      type: String
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
        children: 'childs',
        enabled: 'enabled'
      })
    }
  },
  data() {
    return {
      options2: [],
      selEl: null
    }
  },
  created() {
    let vm = this

    const quene = async function(arr) {
      let level = 1
      const promises = arr.map(async id => {
        const res = await vm.load(
          [id],
          { categoryId: id, level: level++ },
          vm.itemDisabled,
          vm.params
        )
        return res.map(el => ({
          ...el,
          disabled: !el[vm.enabledKey]
        })).filter(vm.filterFunc)
      })

      let ret = []

      for (const promise of promises) {
        ret.push(await promise)
      }
      return ret
    }

    if (this.value && this.value.length > 0) {
      // 有初始值

      vm.load(undefined, undefined, vm.itemDisabled, vm.params).then(data => {
        if (data && Array.isArray(data)) {
          vm.options2 = data.map(el => ({
            ...el,
            disabled: !el[vm.enabledKey]
          })).filter(this.filterFunc)
          quene(vm.value.slice(0, vm.value.length)).then(res => {
            res.forEach((el, index) => {
              vm.findItem(vm.options2, vm.value[index])
              if (vm.selEl && vm.selEl.hasChild) {
                vm.$set(vm.selEl, vm.props.children, el)
              }
            })
          })
        }
      })
    } else {
      this.load(undefined, undefined, vm.itemDisabled, vm.params).then(data => {
        // console.log(vm.enabledKey);
        if (data && Array.isArray(data)) {
          this.options2 = data.map(el => ({
            ...el,
            disabled: !el[vm.enabledKey]
          })).filter(this.filterFunc)
        }
      })
    }
  },
  methods: {
    handlerChange(val) {
      this.$emit('change', val)

      if (this.getEl) {
        let _el
        if (!this.selEl) {
          _el = this.options2.find(
            el => el[this.props.value] === val.slice(0).pop()
          )
        } else {
          _el = this.selEl
        }
        this.$emit('changeEl', _el)
      }
    },
    getName() {
      let text = this.$el
        .querySelectorAll('.el-cascader__label')[0]
        .innerText.split('/')
        .map(el => el.trim())

      return text
    },
    handleItemChange(e) {
      this.handlerChange(e)
      let vm = this
      vm.findItem(vm.options2, e[e.length - 1])
      if (vm.selEl.childs.length === 0) {
        if (this.city) {
          // 城市
          vm.load(e, this.city).then(data => {
            data = data.map(el => ({
              ...el,
              disabled: !el[vm.enabledKey]
            })).filter(this.filterFunc)
            if (vm.selEl) {
              vm.$set(vm.selEl, vm.props.children, data)
            }
          })
        } else {
          // 正常的
          vm.load(e, vm.selEl, this.itemDisabled, vm.params).then(data => {
            data = data.map(el => ({
              ...el,
              disabled: !el[vm.enabledKey]
            })).filter(this.filterFunc)
            if (vm.selEl) {
              vm.$set(vm.selEl, vm.props.children, data)
            }
            vm.$nextTick(() => {
              setTimeout(() => {
                let _el = document.querySelectorAll('.el-popper')
                _el.forEach(el => {
                  el.scrollLeft = el.scrollWidth
                })
              })
            })
          })
        }
      } else {
        vm.$nextTick(() => {
          setTimeout(() => {
            let _el = document.querySelectorAll('.el-popper')

            _el.forEach(el => {
              el.scrollLeft = el.scrollWidth
            })
          })
        })
      }
    },
    findItem(arr, id) {
      arr.forEach(el => {
        if (el[this.props.value] === id) {
          this.selEl = el
          return false
        } else {
          if (el[this.props.children] && el[this.props.children].length > 0) {
            this.findItem(el[this.props.children], id)
          }
        }
      })
    }
  },
  computed: {
    enabledKey() {
      return this.props.enabled
    }
  }
}
</script>

<style lang='scss'>
.__yt_cascader {
  .el-cascader__label {
    padding: 0 25px 0 8px;
    font-size: 12px;
  }
}
</style>

<template>
  <div class="dialog-com">
    <el-dialog
      :title="options.title || '添加'"
      :visible.sync="options.visible"
      :width="options.width"
      @open="open"
      @close="close"
      :append-to-body="true"
      :fullscreen="options.fullscreen || false"
      left
    >
      <el-scrollbar
        wrap-class="default-scrollbar__wrap"
        :style="{height:options.height || '100%'}"
        view-class="p20-scrollbar__view"
        ref="scroll"
      >
        <div>
          <component
            :is="options.component"
            :reserveSelection="options.reserveSelection || 'id'"
            v-bind="$attrs"
            v-on="$listeners"
            :key="indexKey"
            ref="com"
          ></component>
          <template v-if="options.display == false ? false : true">
            <span slot="footer" class="dialog-footer">
              <template v-for="(item, index) in options.footBtns">
                <el-button
                  :loading="loading"
                  size="small"
                  type="primary"
                  :key="index"
                  @click="handleSubmit(`${item.value}`)"
                >{{item.name || '保存'}}</el-button>
              </template>
            </span>
          </template>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 't-dialog',
  props: {
    listFlag: {
      // 如果form中是表结构
      type: Boolean,
      default: false
    },
    tablePage: {
      type: Boolean,
      default: false
    },
    titleList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      options: {
        title: '',
        visible: false,
        width: '',
        height: '',
        component: '',
        cancelText: '',
        submitText: '',
        display: true,
        submit: null,
        cancel: null
      },
      indexKey: null,
      loading: false,
      defaultBtns: [
        {
          name: '取消',
          value: 'cancel'
        },
        {
          name: '保存',
          value: 'submit'
        }
      ]
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async $dialog(params) {
      let vm = this

      vm.indexKey = Math.random()
      let { component, footBtns } = vm.utils.clone(params)
      try {
        // await component().then(data => {
        //   vm.options.reserveSelection = reserveSelection
        //   vm.options.visible = visible || false
        //   vm.options.width = width
        //   vm.options.height = height || '100%'
        //   vm.options.component = data.default
        //   vm.options.title = title
        //   vm.options.childFn = childFn
        //   vm.options.fullscreen = fullscreen || false
        //   vm.options.submitText = submitText || '保存'
        //   vm.options.cancelText = cancelText || '取消'
        //   vm.options.display = display == false ? false : true
        //   vm.options.submitForm = submitForm || null
        //   vm.options.cancel = cancel || null
        // })
        await component().then(data => {
          vm.options = Object.assign({}, vm.options, params)
          vm.options.component = data.default
          vm.options.footBtns = footBtns ? footBtns : vm.defaultBtns
          // vm.options.footBtns = footBtns
          //   ? vm.$wipeRepet([...vm.defaultBtns, ...footBtns], 'value')
          //   : vm.defaultBtns
        })
      } catch (error) {
        console.log(error)
      }
    },
    close() {
      let vm = this
      if (!vm.utils.isEmpty(vm.$refs.com.form)) {
        vm.$refs.com.form = {}
      }
    },
    open() {
      let vm = this
      let childFn = this.options.childFn

      childFn = childFn ? childFn : []
      vm.$nextTick(() => {
        vm.$refs.com['resetForm'] && vm.$refs.com['resetForm']()
        if (childFn && childFn.length) {
          childFn.map(async item => {
            try {
              if (item.name == 'getList') {
                vm.$refs.com[item.name] &&
                  (await vm.$refs.com[item.name](null, item.params))
              } else {
                vm.$refs.com[item.name] &&
                  (await vm.$refs.com[item.name](item.params))
              }
            } catch (error) {
              console.log(error)
            }
          })
        }
      })
    },
    getList(val) {
      this.dialog.getList(val)
    },
    handleSubmit(submitName) {
      let vm = this
      if (vm.$refs.com.form && vm.$refs.com.$refs.form) {
        let data = vm.$clone(vm.$refs.com.form) // form表单的值
        let form = vm.$refs.com.$refs.form // form 表单
        if (submitName == 'cancel') {
          vm.options.visible = false
          return
        }
        form.validate(async valid => {
          if (valid) {
            if (submitName == 'cancel') {
              vm.options.visible = false
              return
            }
            if (
              !vm.$refs.com[submitName] ||
              !vm.utils.isFunction(vm.$refs.com[submitName])
            ) {
              console.warn(`弹框${submitName}不存在或者不是一个函数`)
              return
            }
            vm.loading = true
            let result = await vm.$refs.com[submitName]()
            if (!result) {
              vm.loading = false
              return
            }
            if (result.then && vm.utils.isFunction(result.then)) {
              result.then(() => {
                vm.loading = false
                vm.options.visible = false
              })
              return
            }
            if (vm.utils.isObject(result)) {
              if (!result.selectOptions) {
                result.selectOptions = {}
              }
              // vm.$emit('btnClick', options, i.name)
              result.selectOptions.ids = ['弹窗']
              vm.$emit('btnClick', result, '弹窗', data => {
                if (data) {
                  vm.loading = false
                  vm.options.visible = false
                } else {
                  vm.loading = false
                  // vm.options.visible = false
                }
              })
            } else if (!result.then) {
              vm.loading = false
              console.warn(`弹框${submitName}返回的不是一个对象或者Promise`)
            } else if (vm.utils.isFunction(result.then)) {
              result
                .then(() => {
                  vm.options.visible = false
                  vm.loading = false
                })
                .catch(() => {
                  vm.loading = false
                })
            }
          }
        })
      } else {
        console.warn('表单form不存在')
        if (vm.$refs.com && vm.$refs.com._submit && submitName != 'cancel') {
          vm.loading = true
          let done = (close = true) => {
            vm.loading = false
            vm.options.visible = close
          }
          vm.$refs.com._submit(done)
        } else {
          vm.loading = false
          vm.options.visible = false
        }
      }
    },
    dialog(ref = 'com') {
      return this.$refs[ref]
    }
  }
}
</script>

<style lang="scss">
.dialog-com {
  background: #fff;
  .p20-scrollbar__view {
    padding: 17px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
  }
  .default-scrollbar__wrap {
    overflow-x: auto;
    max-height: 560px;
    margin-right: 0 !important;
  }
}
.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div class="dialog-com">
    <el-dialog
      :title="options.title"
      :visible.sync="options.visible"
      :width="options.width"
      @open="open"
      :append-to-body="true"
      :fullscreen="options.fullscreen"
    >
      <el-scrollbar
        wrap-class="default-scrollbar__wrap"
        :style="{height:options.height}"
        view-class="p20-scrollbar__view"
        ref="scroll"
      >
        <div>
          <component :is="options.component" :reserveSelection="options.reserveSelection" :key="indexKey" ref="com"></component>
          <span slot="footer" class="dialog-footer" v-if="options.display">
            <el-button size="small" @click="options.visible = false">{{options.cancelButtonText}}</el-button>
            <el-button size="small" type="primary" @click="submitForm">{{options.confirmButtonText}}</el-button>
          </span>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'dialog-component',
  props: {},
  data() {
    return {
      options: {
        title: '',
        visible: false,
        width: '',
        height: '',
        component: '',
        okBtnText: '',
        cancelButtonText: '',
        confirmButtonText: '',
        display: true,
        submitForm: null
      },
      indexKey: null
    }
  },
  watch: {},
  methods: {
    async $dialog({
      title,
      visible,
      width,
      component,
      okBtnText,
      cancelBtnText,
      childFn,
      display,
      height,
      submitForm,
      fullscreen,
      reserveSelection
    }) {
      let vm = this
      vm.indexKey = Math.random()
      await component().then(data => {
        vm.options.reserveSelection = reserveSelection
        vm.options.visible = visible || false
        vm.options.width = width
        vm.options.height = height || '100%'
        vm.options.component = data.default
        vm.options.title = title
        vm.options.childFn = childFn
        vm.options.fullscreen = fullscreen || false
        vm.options.confirmButtonText = okBtnText || '保存'
        vm.options.cancelButtonText = cancelBtnText || '取消'
        vm.options.display = display == false ? false : true
        submitForm
          ? (vm.options.submitForm = submitForm)
          : (vm.options.submitForm = null)
      })
    },
    open() {
      let vm = this
      let childFn = this.options.childFn
      childFn ? childFn : []
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
      this.$refs.com.getList(val)
    },
    submitForm() {
      let vm = this
      if (!vm.$refs.com || !vm.$refs.com['submitForm']) {
        vm.options.visible = false
        return
      }
      vm.$refs.com['submitForm'](async data => {
        if (vm.options.submitForm) {
          await vm.options.submitForm(data)
        }
        vm.options.visible = false
      })
    },
    clearSelection() {
      this.$refs['com'].clearSelection()
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
}
</style>

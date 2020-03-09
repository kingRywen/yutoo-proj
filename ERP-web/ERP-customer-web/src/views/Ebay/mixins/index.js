const mixin = {
  data() {
    return {
      selectData: [],
      form: {},
      rules: {}
    }
  },
  methods: {
    edit(params) {
      console.log(params)
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      vm.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    },
    resetForm() {}
  },
  computed: {},
  watch: {}
}

export { mixin }

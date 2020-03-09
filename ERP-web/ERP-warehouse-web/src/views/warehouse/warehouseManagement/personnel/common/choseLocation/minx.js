import storage from 'Utils/saver.js'

let minx = {
  data() {
    return {}
  },
  watch: {
    selectData() {}
  },
  methods: {
    handleEcho(changeArr) {
      let vm = this
      let arr = []
      vm.getStorage().map(item => {
        if (
          changeArr.every(
            el => el[vm.reserveSelection] != item[vm.reserveSelection]
          )
        ) {
          arr.push(item)
        }
      })
      vm.setStorage(arr)
    },
    selectEchoInit(val) {
      // 回显初始化进来的数据
      this.$.dataType(val) === 'Array' &&
        (this.selectData = val) &&
        this.setStorage(val)
    },
    selectChange(val) {
      let arr = this.clearDouble(val, this.reserveSelection)
      this.handleEcho(arr)
      this.selectData = [...arr, ...this.getStorage()]
    },
    getStorage() {
      return storage.get('local', `${this.$route.name}-originList`)
    },
    setStorage(val) {
      return storage.set('local', `${this.$route.name}-originList`, val)
    },
    clearDouble(arr, id) {
      let vm = this
      let obj = {}
      if (Array.isArray(arr)) {
        vm.$clone(arr).map(item => {
          obj[item[id]] = item
        })
      }
      return Object.values(obj)
    },
    submitForm(cb) {
      let vm = this
      cb && cb(vm.selectData)
      vm.setStorage('')
    },
    resetForm() {}
  }
}

export { minx }

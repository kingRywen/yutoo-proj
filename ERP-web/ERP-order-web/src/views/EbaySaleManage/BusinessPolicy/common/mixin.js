import { mapState } from 'vuex'
const edit = {
  data() {
    return {
      params: {},
      disabled: false
    }
  },
  created() {},
  computed: {
    ...mapState('common', ['ebayStoreList'])
  },
  methods: {
    /**
     *
     * @param {Object} params = {
     *   url: 'url',
     *    id: 'ebayPublishPreferenceId',  // 主键id名称
     *    ebayPublishPreferenceId: 12  // 主键id
     *    check: false, // 是否查看
     *    copy: false,  // 是否复制
     * }
     */
    async edit(params) {
      let vm = this
      return vm.$api[`order/${params.url}`]({
        [params.id]: params[params.id]
      }).then(({ rows }) => {
        let _data = vm.$clone(rows)
        if (_data.storeId || _data.storeId == 0) {
          _data.storeId = vm.getIdTree(vm.ebayStoreList, _data.storeId)
        }
        vm.form = _data
        if (
          vm.form.ebayTransportTypeInfoId ||
          vm.form.ebayTransportTypeInfoId == 0
        ) {
          vm.baseInfoId = vm.form.ebayTransportTypeInfoId
        }
        if (params.check) {
          vm.disabled = true
          vm.params = params
        } else if (params.copy) {
          delete vm.form[params.id]
        }
        return Promise.resolve()
      })
    },
    getIdTree(treeArr, id) {
      let idTree = []
      let flag = false
      if (treeArr && Array.isArray(treeArr)) {
        if (id == null || id == undefined) {
          return treeArr[treeArr.length - 1]
        }
        treeArr.find(item => {
          idTree.push(item.value)
          if (item.children && Array.isArray(item.children)) {
            item.children.find(el => {
              if (el.value == id) {
                idTree.push(el.value)
                return (flag = true)
              }
            })
          }
          !flag && (idTree = [])
          return flag
        })
      }
      return idTree
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      console.log(_data)
      if (
        _data.storeId &&
        Array.isArray(_data.storeId) &&
        _data.storeId.length == 2
      ) {
        _data.storeId = vm.getIdTree(_data.storeId)
      }

      // 买家条件
      if (_data.buyConditions == 1) {
        _data.noPaypalAccountFlag = 0
        _data.addressOffscaleFlag = 0
        _data.discardedCaseFlag = 0
        _data.discardedCaseDays = 0
        _data.discardedCaseCount = 0
        _data.violationPolicyDays = 0
        _data.violationPolicyFlag = 0
        _data.violationPolicyCount = 0
        _data.creditIndexFlag = 0
        _data.creditIndexCount = 0
        _data.buyingMoreThanFlag = 0
        _data.buyingMoreThanCount = 0
      }
      vm.$refs['form'].validate(valid => {
        if (valid) {
          if (vm.params.check == true) {
            _data = false
          }
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    }
  }
}
export { edit }

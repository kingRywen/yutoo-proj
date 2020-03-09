<template>
  <div>
    <el-button type="primary" size="small" @click="categoryVisible">选择类目</el-button>
    <yt-dialog :options="options" :events="events">
      <div class="dialog-wrap">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="value"
          ref="tree"
          accordion
          :default-checked-keys="defaultKeys"
          highlight-current
          :props="defaultProps"
        ></el-tree>
      </div>
      <el-form-item class="saveBtn martop" label-width="0px">
        <el-button size="small" type="primary" @click="handleSure">确认选择</el-button>
      </el-form-item>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  props: {
    categoryData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      options: {
        visible: false,
        title: '选择类目',
        width: '420px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      events: {
        close: () => {
          this.$emit('close', null)
        }
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        value: 'value'
      },
      dataValue: '',
      defaultKeys: []
    }
  },
  created() {},
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.options.visible = val
      }
    }
  },
  methods: {
    categoryVisible() {
      let vm = this
      vm.$api['product/categoryList']({})
        .then(data => {
          let dataList = vm.getCategory(data)
          vm.treeData = [dataList]
          if (vm.categoryData && vm.categoryData.length) {
            vm.defaultKeys = vm.categoryData.map(item => item.value)
          }
        })
        .catch(err => {
          console.log(err)
        })
      vm.options.visible = true
    },
    handleSure() {
      let data = this.$refs.tree.getCheckedNodes()
      if (data && data.length) {
        let _data = this.$.deepClone(data).map(item => {
          if (item.children) {
            delete item.children
          }
          return item
        })
        this.$emit('close', _data)
        this.options.visible = false
      }
    },
    getCategory(data) {
      let result = {}
      result.label = data.nameCn
      result.value = data.categoryId
      if (data.childs && data.childs.length) {
        result.children = fn(data.childs)
      }
      function fn(datas) {
        let list = []
        datas.map(item => {
          let obj = {}
          obj.label = item.nameCn
          obj.value = item.categoryId
          if (item.childs && item.childs.length) {
            obj.children = fn(item.childs)
          }
          list.push(obj)
        })
        return list
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.add-sku {
  .dialog-wrap {
    width: 100%;
    border-top: 1px solid #bbbbbb;
    padding-top: 20px;
  }
}
</style>


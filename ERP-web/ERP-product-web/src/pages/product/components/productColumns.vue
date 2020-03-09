<template>
  <div class="productColumns">
    <!-- {{selected}} -->
    <el-tree :data="data" :multiple="false" node-key="categoryId" ref="tree" highlight-current :props="defaultProps" @node-click="onNodeClick" :default-expanded-keys="defaultKeys">
    </el-tree>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tree } from 'element-ui'
import { fetchData, loopFind } from 'common/common'
import { PRODUCT_CATEGORY_LIST } from 'apis'

Vue.use(Tree)

export default {
  inheritAttrs: false,
  components: {
    Tree
  },
  created() {
    // 获取所有类目树
    fetchData({ ...PRODUCT_CATEGORY_LIST, data: {} }).then(res => {
      let vm = this
      let rows = res.data
      console.log(this.$attrs)
      this.data = [rows]
      this.$nextTick(() => {
        vm.$refs.tree.setCurrentKey(
          vm.defaultKeys[vm.defaultKeys.length - 1] || 1
        )
      })
    })

    if (this.$attrs.selected) {
      this.defaultKeys = this.$attrs.selected
      this.has = true
    }
  },

  data() {
    return {
      data: [], // 类目树
      has: false,
      isLast: false,
      defaultKeys: [1, 2], // 默认展开类目
      selected: [], // 选中的类目详细
      arrs: [], // 选中的类目ID组
      name: [], // 选中的类目名字组

      defaultProps: {
        children: 'childs',
        label: 'nameCn'
      }
    }
  },
  methods: {
    onNodeClick(arr, node, self) {
      console.log(arr, node, self)
      this.has = false
      if (arr.parentId == -1) {
        return
      }
      let ids = []
      let name = []
      // 获取所有父节点的id
      function getKeys(node) {
        if (node.parent) {
          ids.unshift(node.key)
          name.unshift(node.label)
          getKeys(node.parent)
        } else {
          if (node.key) {
            ids.unshift(node.key)
            name.unshift(node.label)
          }
        }
      }
      getKeys(node)
      console.log(ids)
      if (!node.childNodes.length) {
        this.isLast = true
      } else {
        this.isLast = false
      }
      this.selected = arr
      this.arrs = ids
      this.name = name
    },
    ok() {
      if (this.has) {
        this.$root.$children[0].asyncModalVisible = false
      } else {
        let n = this.$listeners.set(this.selected, this.arrs, this.name)
        this.$root.$children[0].asyncModalVisible = !!n
      }
    },
    set() {
      this.$listeners.set(this.selected, this.arrs, this.name)
    }
  }
}
</script>

<style lang='less'>
.productColumns
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #108ee9;
  color: #fff;
}
</style>

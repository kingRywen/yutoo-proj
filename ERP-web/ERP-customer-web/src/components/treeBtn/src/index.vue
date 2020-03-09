<template>
  <div class="tree-btn">
    <el-popover placement="bottom" width="200" trigger="click" v-model="visible">
      <el-tree
        ref="tree"
        :data="treeData"
        accordion
        :show-checkbox="showCheckbox"
        node-key="value"
        highlight-current
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :key="keyIndex"
      ></el-tree>
      <el-row>
        <el-col :offset="4" :span="24">
          <el-button class="martop" size="mini" @click.stop="handleSure">确认</el-button>
          <el-button class="martop" size="mini" @click.stop="handleClear">清除</el-button>
        </el-col>
      </el-row>
      <el-button slot="reference" class="btn" :style="style" :size="size">{{ btnText }}</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'TreeBtn',
  props: {
    text: {
      type: String,
      default: ''
    },
    styles: {
      type: Object,
      default: () => {
        return {}
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Number,
      default: 0
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    classifyType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      keyIndex: null,
      width: '200',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        value: 'value'
      },
      selectValue: [],
      btnText: '',
      showCheck: false,
      visible: false,
      defaultCheckedKeys: [],
      classify: null
    }
  },
  created() {
    let vm = this
    vm.classify = vm.classifyType || 1
    vm.btnText = this.text || '分类'
    this.style = this.styles || {
      width: '190px'
    }
    vm.$api['email/classificationList']({
      classifyType: vm.classify
    })
      .then(data => {
        console.log(data)

        if (data && data.rows && data.rows.childs && data.rows.childs.length) {
          let val = data.rows.childs
          vm.treeData = vm.getClassification(val)
          console.log(vm.treeData)
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  mounted() {},
  watch: {
    treeData() {
      let vm = this
      vm.$nextTick(() => {
        if (!vm.value) return

        let node = vm.$refs.tree.getNode(vm.value)
        if (!node) {
          this.selectValue = node
          this.btnText = '所选分类不存在'
        } else {
          this.selectValue = node.data
          this.btnText = node.data.label
        }
      })
    }
  },
  methods: {
    handleNodeClick(data) {
      if (!this.showCheckbox) {
        this.selectValue = []
        this.selectValue.push({
          label: data.label,
          value: data.value
        })
      }
    },
    handleSure() {
      if (this.showCheckbox) {
        this.selectValue = this.$refs.tree.getCheckedNodes()
      }
      this.visible = false

      if (this.selectValue.length) {
        this.btnText = this.selectValue
          .map(item => {
            return item.label
          })
          .join()
      }
      this.$emit('close', this.selectValue)
    },
    handleClear() {
      this.selectValue = []
      this.visible = false
      this.defaultCheckedKeys = []
      this.keyIndex = Math.random()
      this.btnText = this.text
      this.$emit('close', this.selectValue)
    },
    getClassification(data) {
      let vm = this
      let result = []
      data.map(item => {
        let obj = {
          label: item.classifyName,
          value: item.emailClassificationId
        }
        if (item.childs && item.childs.length) {
          obj.children = vm.getClassification(item.childs)
        }
        result.push(obj)
      })
      return result
    }
  }
}
</script>

<style lang="scss">
.tree-btn {
  height: 33px;
  .el-button.btn {
    width: 100%;
    height: 33px;
  }
  .el-button.btn > span {
    width: 100%;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    box-sizing: border-box;
  }
}
</style>

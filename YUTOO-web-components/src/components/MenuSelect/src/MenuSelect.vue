<template>
  <div v-clickoutside="handleOutSide">
    <yt-transition>
      <div class="menu-select" v-if="!show" key="1">
        <div class="title">
          <div>{{title}}</div>
          <i class="el-icon-caret-right" title="收起" @click="handlePackUp"></i>
        </div>
        <el-tree
          v-if="showTree"
          :expand-on-click-node="false"
          :highlight-current="true"
          :default-expand-all="defaultExpandAll"
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          :node-key="nodeKey"
          v-loading="showLoading"
          ref="tree"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              {{ node.label }} (
              <span style="color:red">{{data[defaultProps.count]}}</span>&nbsp;)
            </span>
          </span>
        </el-tree>
        <div class="btn">
          <el-button type="text" @click="toggleExpandAll">{{defaultExpandAll ? '收起' : '展开'}}</el-button>
          <el-button type="text" class="el-icon-refresh" @click="handleRefresh"></el-button>
        </div>
      </div>

      <div class="btn-open" v-if="show" key="2">
        <el-button type="primary" icon="el-icon-d-arrow-left" @click="show = false" round></el-button>
      </div>
    </yt-transition>
  </div>
</template>

<script>
export default {
  name: 'YtMenuSelect',
  props: {
    showLoading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '邮件分类'
    },
    loadData: {
      type: Function,
      required: true,
      default: () => Promise.resolve([])
    },
    nodeKey: {
      type: String,
      required: true,
      default: 'label'
    },
    defaultProps: {
      type: Object,
      required: true,
      default: () => ({
        children: 'children',
        label: 'label',
        count: 'count'
      })
    }
  },

  data() {
    return {
      currentNodeKey: undefined,
      showBtn: true,
      defaultExpandAll: true,
      showTree: true,
      loading: false,
      show: true,
      data: []
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.init()
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.tree &&
                this.$refs.tree.setCurrentKey(this.currentNodeKey)
            })
          }, 200)
        }
      }
    }
  },
  methods: {
    /* eslint-disable */
    handleNodeClick(data, node, _node) {
      // console.log(data, node, _node)
      this.$emit('nodeclick', data, node)
    },
    init() {
      let load = this.loadData()
      this.loading = true
      if (!load.then) {
        console.error('函数必须返回promise')
        return
      } else {
        load
          .then(data => {
            this.loading = false
            this.data = data
            this.reSelectNode()
          })
          .catch(() => {
            // this.data = []
            this.loading = false
          })
      }
    },

    // 切换树展开折叠的状态
    toggleExpandAll() {
      this.defaultExpandAll = !this.defaultExpandAll
      this.reSelectNode()
    },

    reSelectNode() {
      // 判断是否有选中的节点 ，如果有的话，刷新树之后还原选中的节点
      let selectedNodeKey = this.$refs.tree.getCurrentKey()
      this.showTree = false
      this.$nextTick(() => {
        this.showTree = true
        if (selectedNodeKey != null) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(selectedNodeKey)
          })
        }
      })
    },

    handleRefresh() {
      this.init()
    },
    handleOutSide() {
      this.closeMenu()
    },
    handlePackUp() {
      this.closeMenu()
    },
    closeMenu() {
      this.currentNodeKey = this.$refs.tree && this.$refs.tree.getCurrentKey()
      this.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-select {
  position: fixed;
  right: 0;
  height: 100vh;
  background: #fff;
  top: 68px;
  width: 30%;
  max-width: 300px;
  z-index: 5555;
  box-sizing: border-box;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  padding: 20px;
  padding-top: 10px;
  // animation: fadeInRightBig 400ms both;
  // transform: translateX(330px);
  // transition: all 0.25s ease-in-out;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    div {
      font-size: 14px;
    }
    i {
      font-size: 14px;
      cursor: pointer;
    }
  }
  .btn {
    position: fixed;
    right: 8px;
    top: 118px;
    padding-right: 20px;
  }
  // &.collapse {
  //   animation: fadeInRightBig 400ms both reverse;
  // }
}

.btn-open {
  position: fixed;
  right: -10px;
  top: 68px;
  z-index: 9999;
  // animation: fadeInRightBig 400ms both;

  // &.active {
  //   animation: fadeInRightBig 400ms both reverse;
  // }
}
</style>
<style lang="scss">
.btn-open {
  .el-button.is-round {
    padding: 10px;
    border-radius: 20px 0 0 20px;
    background: #108ee9;
    padding: 6px 8px;
    color: #cfe8f9;
    box-shadow: -1px 5px 20px rgba(16, 144, 233, 0.5);
  }
}
</style>
<style lang="scss">
.menu-select {
  .is-current {
    // color: #108ee9;
  }
}
</style>
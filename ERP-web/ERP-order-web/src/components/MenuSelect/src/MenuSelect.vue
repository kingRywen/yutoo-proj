<template>
  <div v-clickoutside="handleOutSide">
    <transition-type>
      <div class="menu-select animated" :class="{'error': error}" v-if="!show" v-loading="loading">
        <template v-if="!error">
          <div class="title">
            <div>{{`产品状态`}}</div>
            <i class="el-icon-caret-right" title="收起" @click="handlePackUp"></i>
          </div>
          <el-tree
            v-if="showTree"
            :highlight-current="true"
            :default-expand-all="defaultExpandAll"
            :current-node-key="currentNodeKey"
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
        </template>
        <div v-else>
          加载列表失败，请
          <el-button type="text" @click="reload">重试</el-button>
        </div>
      </div>
    </transition-type>

    <transition-type>
      <div class="btn-open animated" v-if="show">
        <el-button type="primary" icon="el-icon-d-arrow-left" @click="show = false" round>
          <slot name="btn">{{current}}</slot>
          <!-- <el-button type="text" icon="el-icon-delete">清除</el-button> -->
        </el-button>
      </div>
    </transition-type>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'menu-select',
  props: {
    current: [String, Number],
    showLoading: {
      type: Boolean,
      default: false
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
      defaultExpandAll: true,
      showTree: true,
      currentNodeKey: undefined,
      loading: false,
      show: true,
      data: [],
      error: false
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.init()
        }
      }
    }
  },
  methods: {
    // 重新加载树
    reload() {
      this.loading = true
      this.error = false
      this.init()
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    },
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
            if (this.current) {
              this.data = data
              this.$nextTick(() => {
                this.setCurrentKey(this.current)
              })
            } else {
              this.data = data
            }
          })
          .catch(() => {
            this.error = true
            this.loading = false
            // this.data = []
            // this.loading = false
          })
      }
    },

    // 切换树展开折叠的状态
    toggleExpandAll() {
      this.defaultExpandAll = !this.defaultExpandAll
      this.showTree = false
      // 判断是否有选中的节点 ，如果有的话，刷新树之后还原选中的节点
      let selectedNodeKey = this.$refs.tree.getCurrentKey()
      this.$nextTick(() => {
        this.showTree = true
        if (selectedNodeKey != null) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(this.current || selectedNodeKey)
          })
        }
      })
    },

    handleRefresh() {
      this.init()
    },
    handleOutSide() {
      if (!this.show) {
        this.closeMenu()
      }
    },
    handlePackUp() {
      this.closeMenu()
    },
    closeMenu() {
      let tree = this.$refs.tree
      this.show = true
      if (tree) {
        this.$emit('close', this.current)
      }
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
  z-index: 40;
  box-sizing: border-box;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  padding: 20px;
  padding-top: 10px;
  animation: fadeInRightBig 400ms both;
  &.error {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // transform: translateX(330px);
  // transition: all 0.25s ease-in-out;

  .title {
    @include flex-wrapper(space-between);
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
    right: 28px;
    top: 118px;
  }
  &.collapse {
    animation: fadeInRightBig 400ms both reverse;
  }
}

.btn-open {
  position: fixed;
  right: -5px;
  top: 68px;
  z-index: 42;
  animation: fadeInRightBig 400ms both;

  &.active {
    animation: fadeInRightBig 400ms both reverse;
  }
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
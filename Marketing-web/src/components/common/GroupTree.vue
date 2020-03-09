<template>
  <div>
    <div class="custom_tree" v-show="show">
      <div class="__J_flex">
        <el-input placeholder="输入关键字进行过滤" v-model.trim="filterText">
        </el-input>

      </div>

      <div>
        <el-button type="text" icon="el-icon-refresh" @click="refresh">刷新</el-button>
        <el-button type="text" icon="el-icon-plus" @click="addRoot">新增</el-button>
        <el-button type="text" icon="el-icon-delete" @click="del">删除</el-button>

      </div>

      <el-tree @check="handleCheck" @node-click="nodeClick" node-key="groupId" :check-strictly="true" show-checkbox :expand-on-click-node="false" :render-content="renderContent" class="filter-tree" :data="data1" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree">
      </el-tree>
    </div>
    <div @click="hide" class="arrow">
      <i class="el-icon-caret-right icon" :class="show ? 'reverse': ''"></i>
    </div>
  </div>

</template>

<script>
export default {
  name: "GroupTree",
  props: {
    show: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  inject: ["updateTreeData", "createNode", "deleteNodes", "setState"],
  data() {
    return {
      // show: true,
      selectedIds: [],
      filterText: "",
      defaultProps: {
        children: "groupingVOS",
        label: "groupName"
      },
      nodeKey: "groupId"
    };
  },
  computed: {
    data1: {
      get() {
        return JSON.parse(JSON.stringify(this.data));
      },
      set(val) {
        this.setState(val);
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    data1() {
      const id = this.getCurrentKey();
      this.$nextTick(() => {
        this.setCurrentKey(id || 0);
      });
    }
  },
  methods: {
    hide() {
      // this.show = !this.show;
      this.$emit("toggle", !this.show);
    },
    /**
     * 基本函数
     */

    // 根据nodekey 获取node
    getNode(nodeKey) {
      return this.$refs.tree.getNode(nodeKey);
    },

    // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
    // (leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked);
    },

    // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
    // (leafOnly) 接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false
    getCheckedKeys(leafOnly) {
      return this.$refs.tree.getCheckedKeys(leafOnly);
    },

    // 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性
    // (data) 要删除的节点的 data 或者 node
    removeNode(data) {
      return this.$refs.tree.remove(data);
    },

    // 设置选中特定的 key
    setCurrentKey(key) {
      return this.$refs.tree && this.$refs.tree.setCurrentKey(key);
    },

    // 获取选中的 key
    getCurrentKey() {
      return this.$refs.tree && this.$refs.tree.getCurrentKey();
    },

    setChecked(key, checked, deep) {
      return this.$refs.tree.setChecked(key, checked, deep);
    },

    setCheckedKeys(keys, leafOnly) {
      return this.$refs.tree.setCheckedKeys(keys, leafOnly);
    },

    getParentId(node) {
      if (node.parent && node.parent.data.groupId) {
        this.selectedIds.unshift(node.parent.data.groupId);
        this.getParentId(node.parent);
      }
    },

    // 获取选中节点的所有数组key
    getAllKeys() {
      this.selectedIds = [];
      let key = this.getCurrentKey();
      if (key != null) {
        const node = this.getNode(key);
        this.selectedIds.unshift(node.data.groupId);
        this.getParentId(node);
        return this.selectedIds;
      }
    },

    updateAndKeep() {
      const groupId = this.getCurrentKey();
      this.updateTreeData();
      this.nodeClick({ groupId });
    },

    refresh() {
      this.updateTreeData();
      this.nodeClick({ groupId: 0 });
    },

    // 获取指定节点所有下级叶节点的key
    getChilds(data) {
      let vm = this;
      this.getChilds.key = this.getChilds.key || [];
      const child = data.groupingVOS || [];
      if (child.length) {
        child.forEach(ch => {
          this.getChilds.key.push(ch[vm.nodeKey]);
          this.getChilds(ch);
        });
      }
      return this.getChilds.key;
    },

    getKey(data) {
      return data[this.nodeKey];
    },

    /**
     * 操作tree
     */

    // 删除选择的节点
    del() {
      let keys = this.getCheckedKeys();
      if (!keys.length) {
        this.$message.warning("请选择一条数据");
        return;
      }
      this.deleteNodes(keys);
    },

    // 新增根节点
    addRoot() {
      let root = this.$refs.tree.root;
      this.append(root.data[0]);
    },

    // 共两个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、树目前的选中状态对象，包含 checkedNodes、checkedKeys、halfCheckedNodes、halfCheckedKeys 四个属性
    handleCheck(data, { checkedKeys }) {
      this.getChilds.key = [];
      const key = this.getKey(data);
      const checked = checkedKeys.indexOf(key) > -1;
      const keys = this.getChilds(data);
      keys.forEach(key => {
        this.setChecked(key, checked);
      });
    },

    // 过滤函数
    filterNode(value, data) {
      if (!value) return true;
      return data.groupName.indexOf(value) !== -1;
    },

    // 添加子节点
    append(data) {
      const newChild = {
        parentGroupId: data.groupId,
        groupName: "",
        groupingVOS: [],
        showInput: true
      };
      if (!data.groupingVOS) {
        this.$set(data, "groupingVOS", []);
      }
      data.groupingVOS.unshift(newChild);
    },

    // 打开编辑子节点
    edit(data) {
      this.$set(data, "showInput", true);
      this.$set(data, "_edit", true);
      this.$set(data, "_oldVal", data.groupName);
    },

    // 编辑子节点
    editNode(data) {
      if (data._oldVal === data.groupName) {
        this.$set(data, "showInput", false);
        return;
      }
      this.createNode(data, 1, () => {
        this.$set(data, "showInput", false);
        this.nodeClick(data);
      });
    },

    cancelEditNode(data) {
      this.$set(data, "groupName", data._oldVal);
      this.$set(data, "showInput", false);
    },

    // 提交子节点
    confirmNode(data) {
      if (data.groupName === "" || data.groupName == null) {
        this.$message.warning("组名不能为空");
        return;
      }
      this.createNode(data);
    },

    // 移除子节点
    remove(node, data) {
      let vm = this;
      const parent = node.parent;
      const children = parent.data.groupingVOS || parent.data;
      if (!("groupId" in data)) {
        // 移除未保存到后端 的
        const index = children.findIndex(
          d => d[this.nodeKey] === data[this.nodeKey]
        );
        children.splice(index, 1);
      } else {
        this.$confirm("是否删除分组?", "警告", {
          type: "warning"
        })
          .then(() => {
            // 移除已经在后端 保存的
            const id = children.find(el => el[vm.nodeKey] === data[vm.nodeKey])
              .groupId;
            vm.deleteNodes([id]);
          })
          .catch(() => {});
      }
    },

    // nodeClick
    nodeClick(data, m, node) {
      if (data.groupId == null) {
        return;
      }
      if (!node && data.groupId != null) {
        this.$emit("nodeclick", { groupId: data.groupId });
        return;
      }
      if (node.$el.querySelectorAll(".el-input__inner").length !== 0) {
        return;
      }
      this.$emit("nodeclick", { groupId: data.groupId });
    },

    // 渲染函数
    renderContent(h, { node, data, store }) {
      return (
        <span
          class="custom-tree-node"
          on-mouseenter={event => {
            if (data.groupId === -1) {
              return;
            }
            if (event.target !== event.currentTarget) return;
            let subEl = event.target.lastChild.lastChild;
            if (subEl.className === "btn-box") {
              subEl.style.display = "block";
            }
          }}
          on-mouseleave={event => {
            if (data.groupId === -1) {
              return;
            }
            if (event.target !== event.currentTarget) return;
            let subEl = event.target.lastChild.lastChild;
            if (subEl.className === "btn-box") {
              subEl.style.display = "none";
            }
          }}
        >
          {data.showInput ? (
            <div class="add-input">
              <el-input
                size="mini"
                value={data.groupName}
                on-input={e => {
                  data.groupName = e;
                }}
                on-click={event => {
                  event.stopPropagation();
                  if (event.target !== event.currentTarget) return;
                }}
              />
              <span class="btn-box-1">
                <i
                  class="el-icon-check"
                  on-click={e => {
                    e.stopPropagation();

                    if (data._edit) {
                      this.editNode(data);
                      return;
                    }
                    this.confirmNode(data);
                  }}
                />
                <i
                  class="el-icon-close"
                  on-click={e => {
                    e.stopPropagation();
                    const key = this.getCurrentKey();
                    this.$nextTick(() => {
                      this.setCurrentKey(key);
                    });
                    if (data._edit) {
                      this.cancelEditNode(data);
                      return;
                    }

                    this.remove(node, data);
                  }}
                />
              </span>
            </div>
          ) : (
            <div>
              <span title={data.groupName}>
                <span class="title">{data.groupName}</span>
                <span class="count">
                  {data.dataCnt ? ` (${data.dataCnt})` : null}
                </span>
              </span>
              <span class="btn-box">
                {data.dataCnt ? null : (
                  <i
                    class="el-icon-plus"
                    on-click={event => {
                      if (event.target !== event.currentTarget) return;
                      event.stopPropagation();
                      this.append(data);
                    }}
                  />
                )}
                <i
                  class="el-icon-edit"
                  on-click={event => {
                    if (event.target !== event.currentTarget) return;
                    event.stopPropagation();
                    this.edit(data);
                  }}
                />
                <i
                  class="el-icon-delete"
                  on-click={event => {
                    if (event.target !== event.currentTarget) return;
                    event.stopPropagation();

                    this.remove(node, data);
                  }}
                />
              </span>
            </div>
          )}
        </span>
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.arrow {
  position: absolute;
  top: 301px;
  right: 0;
  width: 0;
  left: 0;
  transform: translateY(100%);
  z-index: 1;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 14px;
  transform: rotate(0);
  background: #00c0de;
  box-shadow: 1px 2px 10px rgba(45, 77, 82, 0.4);
  color: #fff;
  cursor: pointer;
  i.icon {
    transition: all 0.25s ease-in-out;
  }

  & i.reverse {
    transform: rotate(180deg);
    transition: all 0.25s ease-in-out;
  }
}
</style>

<template>
  <div>
    <el-input placeholder="输入分组名称进行过滤" v-model="filterText" clearable size="mini" class="menu-select"></el-input>
    <div class="box-center" style="text-align:right">
      <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
        <ElButton type="text" icon="el-icon-refresh" @click="refreshTree"></ElButton>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="添加分组" placement="top-start">
        <ElButton type="text" icon="el-icon-circle-plus-outline" @click="$emit('add')"></ElButton>
      </el-tooltip>
      <el-tooltip class="item" effect="light" content="删除分组" placement="top-start">
        <ElButton type="text" icon="el-icon-delete" @click="handleDel"></ElButton>
      </el-tooltip>
    </div>
    <el-tree
      class="disabled-tree-none"
      v-if="storeIds.sellerId != null && showTree"
      :props="defaultProps"
      highlight-current
      :load="loadNode"
      lazy
      :show-checkbox="showCheckBox"
      node-key="classifyId"
      @node-click="handleNodeClick"
      ref="tree"
      :default-expanded-keys="defaultExpand"
      :check-strictly="true"
      :default-expand-all="false"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
    >
      <div
        class="custom-tree-node custom-tree-node1 flex"
        slot-scope="{ node, data }"
        @mouseenter="$set(data, '_show', true)"
        @mouseleave="$set(data, '_show', false)"
      >
        <span style="font-size:12px" :style="{marginLeft: !node.data.adGroupId ? '' : '4px'}" :title="node.label">
          <i
            v-if="!node.data.adGroupId"
            style="margin-right:4px; font-size:14px"
            :class="node.data.campaignId ? 'iconfont1 iconduowenjianjia' : node.data.adGroupId ? '' : 'iconfont1 iconwenjianjia'"
          ></i>
           <span v-if='data.dataCnt || data.dataCnt===0'> {{ node.label + ' ('+ data.dataCnt+')' }} </span> 
           <span v-else> {{ node.label}} </span>
        </span>
        <div v-if="data.classifyName !== '全部' && data.classifyName !=='未分组' && !(data.adGroupId || data.campaignId)" v-show="data._show" class="span-el-icon">
          <el-tooltip v-if="!data.dataFlag" class="item" effect="light" content="添加" placement="top-start">
            <el-button type="text" icon="el-icon-plus" @click.stop="$emit('addNext', data)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="编辑" placement="top-start">
            <el-button type="text" icon="el-icon-edit-outline" @click.stop="$emit('edit', data)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" placement="top-start">
            <el-button type="text" icon="el-icon-delete" @click.stop="$emit('del', data)"></el-button>
          </el-tooltip>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'CommonTree',
  props: {
    currentNode: {
      default: () => ({})
    },
    classifyType: {
      required: true,
      type: Number,
      default: 2
    },
	isShowGroup:{
		type:Boolean,
		default:false
	}
  },
  data() {
    return {
      defaultExpand: [0],
      showCheckBox: false,
      showTree: true,
      // 搜索过滤字段
      filterText: '',
      // tree 选中的id
      selectedId: 0,
      // tree 当前选中项
      // currentNode: {},
      // tree loading
      loading: false,
      // tree 数据
      data: [],
      // tree props
      defaultProps: {
        label: 'classifyName',
        value: 'classifyId',
        children: 'childs',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    handleDel() {
      if (this.showCheckBox) {
        this.$emit('del', null, () => {
          this.refreshTree(true)
        })
      } else {
        this.refreshTree()
      }
    },
    refreshTree(noCheckbox = false) {
      let key = this.$refs.tree.getCurrentKey()
      this.showTree = false
      this.showCheckBox = !noCheckbox
      this.$nextTick(() => {
        this.showTree = true
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(key)
        })
      })
    },
    async updateKeyChildren(key) {
      let data = await this.getTreeList()

      // let node = this.findParent(data, key)
      // console.log(data, node);
      this.$refs.tree.updateKeyChildren(0, data[0].childList)
    },

    findParent(data, key) {
      data.forEach(el => {
        if (el.classifyId === key) {
          return el
        }
        if (el.childList) {
          return this.findParent(el.childList, key)
        }
      })
    },

    getNode(data) {
      return this.$refs.tree.getNode(data)
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },
    getParentIds(data) {
      let node = this.getNode(data)
      let arrs = []
      if (!node) {
        return []
      } else {
        let current = node
        while (current.parent) {
          arrs.unshift(current.data.classifyId)
          current = current.parent
        }
      }
      return arrs
    },
    handleNodeClick(data) {
      // this.currentNode = data
      if (!data.campaignId && !data.adGroupId) {
        this.$emit('update:currentNode', data)
      }

      this.$emit('nodeClick', data)
    },
    filterNode(value, data) {
      value = value.trim()
      if (!value) return true
      return data.classifyName.indexOf(value) !== -1
    },
    loadNode(node, resolve) {
      
      if (node.level === 0) {
        // return resolve([
        //   {
        //     classifyName: '全部',
        //     classifyId: 0,
        //     disabled: true,
        //     childList: [],
        //     leaf: false
        //   },
        //   {
        //     classifyName: '未分组',
        //     classifyId: -1,
        //     disabled: true,
        //     leaf: false
        //   }
        // ])
        return this.getTreeList().then(data => {
          this.defaultExpand = [0]
          resolve(data || [])
        })
      }
      if (node.level > 1) {
        if (node.data.childList) {
          // 存在childList的说明 是最开始请求的数据中存在过的子数据，直接塞进去
          return resolve(
            node.data.childList.map(el => ({ ...el, leaf: !(el.dataFlag || el.haveChildren) }))
          )
        } else {
          // 不存在childList,要请求系列， 不过系列中会带组，所以组也不需要请求
          if (node.data.groupList) {
            // console.log(node.data.groupList)
            return resolve(
              node.data.groupList.map(el => ({
                ...el,
                leaf: true,
                classifyName: el.name,
                classifyId: el.adGroupId
              }))
            )
          }
          return this.getSeriesList(node.data.classifyId).then(data => {
            resolve(data || [])
          })
        }
      }
      if (node.data.classifyName === '全部') {
        return this.getTreeList().then(data => {
          this.defaultExpand = [0]
          //resolve(data || [])
          resolve(data[0].childList || [])
        })
      } else {
        // 未分组
        return this.getSeriesList(-1).then(data => {
          resolve(data || [])
        })
      }
    },
    getSeriesList(classifyId) {
	  
      let params = {
        ...this.storeIds,
        classifyType: this.classifyType,
        classifyId
      }
      return this.$api[`taskClassifyAdList`](params)
        .then(data => {
          return this.handleData(data.data)
        })
        .catch(() => {})
    },
    handleData(data) {
      data.forEach(el => {
        el.classifyName = el.name
        el.classifyId = el.campaignId
        el.disabled = true
        el.leaf = this.isShowGroup || !(el.groupList && el.groupList.length > 0)
        el.groupList && el.groupList.forEach(_el => {
          _el.disabled = true
        })
      })

      return data
    },
    getTreeList(parentClassifyId = 0) {
      let treeQuery = {
        ...this.storeIds,
        parentClassifyId: parentClassifyId,
        classifyType: this.classifyType
      }
      if (this.currentNode.classifyId != null) {
        this.selectedId = this.currentNode.classifyId
      } else {
        this.selectedId = 0
      }
      this.loading = true
      return this.$api['taskClassifyList'](treeQuery)
        .then(data => {
          this.loading = false
          // 设置包含有系列的分组可以点击加载
          this.setGroupArrow(data.data)
          // this.data = [
          //   {
          //     classifyName: '全部',
          //     classifyId: 0,
          //     childList: data.data
          //   },
          //   {
          //     classifyName: '未分组',
          //     classifyId: -1
          //   }
          // ]
         // console.log(data.data);
          this.data = JSON.parse(JSON.stringify(data.data));
          this.data[0].childList.forEach((i,index)=>{
              if(i.classifyId === -1){
                this.data[0].childList.splice(index,1)
              } 
          });
          //console.log(this.data);

          this.selectedId != null &&
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.selectedId)
            })
          return data.data
        })
        .catch(() => {})
    },
    setGroupArrow(data) {
      data.forEach(el => {
        if (!el.dataFlag && !el.haveChildren) {
          el.leaf = true
          // el.childList = []
        } else {
          el.leaf = false
          
        }
        if (el.childList) {
          this.setGroupArrow(el.childList)
        }
        
      })
    }
  },
  watch: {
    // storeIds: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     if (val.sellerId) {
    //       this.getTreeList()
    //     }
    //   }
    // },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="box">
    <ElTabs type="card" v-model="activeName" @tab-click="handleTabClick">
      <ElTabPane v-for="item in tabs" :name="item.name" :label="item.label" :item="item"></ElTabPane>
    </ElTabs>
    <tpl-drawer>
      <div slot="leftMenu" class="box-left-menu">
        <div v-show="activeName === 'first'">
          <div class="box-center">
            <el-input :placeholder="inputName" v-model.trim="filterText" clearable size="small" class="menu-select"></el-input>
          </div>
          <div style="text-align:right" class="btns">
            <el-button type="text" icon="el-icon-refresh" @click="getTaskClassifyList(0,false)"></el-button>
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="showDialog('add',1,null,0)"></el-button>
            <!-- <i icon="el-icon-edit-outline" @click="showDialog('edit',1,null,0)"></i> -->
            <el-button type="text" icon="el-icon-delete" @click="deleteTreeNode(0,null,0)"></el-button>
          </div>

          <div style="max-height: 600px;overflow-y: auto; padding-bottom: 30px;">
            <el-tree
              :data="taskClassify0List"
              :props="defaultProps"
              style="width: 100%"
              highlight-current
              show-checkbox
              check-strictly
              node-key="classifyId"
              @check-change='checkChange1'
              @node-click="handleNode0Click"
              ref="treeCustomCategory"
              :filter-node-method="filterNode"
              v-loading="tree0Loading"
              default-expand-all
              :expand-on-click-node="false"
              :key="tree0Key"
            >
              <div class="custom-tree-node custom-tree-node1 flex" slot-scope="{ node, data }">
                <div>{{ node.label + " (" + data.dataCnt +')' }}</div>
                <div class="span-el-icon" v-if="node.label!=='全部'">
                  <el-tooltip
                    v-if="!(!data.haveChildren && data.dataFlag ===1)"
                    content="添加下级"
                    placement="top"
                    effect="light"
                    :open-delay="500"
                  >
                    <el-button
                      type="text"
                      icon="el-icon-circle-plus-outline"
                      @click.stop="showDialog('add',2,data,0,node)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top" effect="light" :open-delay="500">
                    <el-button type="text" icon="el-icon-edit-outline" @click.stop="showDialog('edit',2,data,0,node)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top" effect="light" :open-delay="500">
                    <el-button type="text" icon="el-icon-delete" @click.stop="deleteTreeNode(0,data,0)"></el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-tree>
          </div>
        </div>
        <div v-show="activeName !== 'first'">
          <div class="box-center">
            <el-input :placeholder="inputName" v-model.trim="filterTaskText" clearable size="small" class="menu-select"></el-input>
          </div>
          <div style="text-align:right" class="btns">
            <el-button
              type="text"
              icon="el-icon-refresh"
              @click="getTaskClassifyList(1,false)"
              :disabled="$store.state.isloading || $store.state.loading"
            ></el-button>
            <el-button type="text" icon="el-icon-circle-plus-outline" @click.stop="showDialog('add',3,null,1)"></el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteTreeNode(1,null,1)"></el-button>
          </div>

          <div>
            <el-tree
              :data="taskClassify1List"
              :props="defaultProps"
              style="width: 100%"
              highlight-current
              show-checkbox
              node-key="classifyId"
               check-strictly
              @check-change='checkChange2'
              @node-click="handleNode1Click"
              ref="treeTaskCustomCategory"
              :filter-node-method="filterNode"
              v-loading="tree1Loading"
              default-expand-all
              :expand-on-click-node="false"
              :key="tree1Key"
            >
              <div class="custom-tree-node custom-tree-node1 flex" slot-scope="{ node, data }">
                <div>{{ node.label + " (" + data.dataCnt +')'  }}</div>
                <div class="span-el-icon" v-if="node.label!=='全部'">
                  <el-tooltip
                    v-if="!(!data.haveChildren && data.dataFlag ===1)"
                    content="添加下级"
                    placement="top"
                    effect="light"
                    :open-delay="500"
                  >
                    <el-button
                      type="text"
                      icon="el-icon-circle-plus-outline"
                      @click.stop="showDialog('add',3,data,1,node)"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip content="编辑" placement="top" effect="light" :open-delay="500">
                    <el-button type="text" icon="el-icon-edit-outline" @click.stop="showDialog('edit',4,data,1,node)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top" effect="light" :open-delay="500">
                    <el-button type="text" icon="el-icon-delete" @click.stop="deleteTreeNode(1,data,1)"></el-button>
                  </el-tooltip>
                </div>
              </div>
            </el-tree>
          </div>
        </div>
      </div>
      <div slot="body" class="box-body" v-if="refreshTree">
        <component
          :is="componentName"
          :p-params="pParams"
          ref="com"
          v-on:viewDetail="viewDetail"
          v-on:backPage="backPage"
          v-on:reloadTaskClassify0List="reloadTaskClassify0List"
          :parentIds="parentIds"
        ></component>
      </div>
    </tpl-drawer>

    <ClassifyDialog ref="classifyDialog" v-on:reloadTree="reloadTree"></ClassifyDialog>
  </div>
</template>
<script>
import TplDrawer from '../Common/tpl-drawer/index'
import Task from './task'
import Library from './library'
import Detail from './detail'
import YTemplate from '../Common/y-template/index'
import Navigation from '../Common/y-template/navigation'
import ClassifyDialog from './ClassifyDialog'
const _ = require('lodash')
export default {
  components: {
    TplDrawer,
    YTemplate,
    Task,
    Library,
    Detail,
    ClassifyDialog,
    Navigation
  },
  data() {
    return {
      refreshTree: true,
      activeName: 'first',
      tabs: [
        {
          label: '任务分组',
          name: 'first',
          comName: 'task'
        },
        {
          label: '产品分类',
          name: 'second',
          comName: 'Library'
        }
      ],
      filterText: null,
      filterTaskText: null,
      tree0Key: 0,
      tree0Loading: false,
      tree1Key: 1,
      tree1Loading: false,
      treeQuery: {
        parentClassifyId: 0, // 顶级及全部
        platformId: '',
        siteId: null,
        sellerId: null,
        classifyType: null,
        classifyName: null
      },
      taskClassify0List: [],
      taskClassify1List: [],
      componentName: 'task',
      pParams: {
        classifyId: null,
        siteId: null,
        sellerId: null,
        taskId: null,
        taskClassify0List: [],
        isBackPage: false,
        taskClassify1List: []
      },

      defaultProps: {
        children: 'childList',
        label: 'classifyName'
      },
      dataTypeOptions: {
        visible: false,
        width: '500px',
        title: '数据源',
        okBtnText: '关闭'
      },
      dataTypeEvents: {
        handleOkClick: () => {
          this.dataTypeOptions.visible = false
        }
      },
      parentClassifyIdOptions: [],
      props: {
        label: 'classifyName',
        value: 'classifyId',
        children: 'childList'
      },
      parentIds: [], //当前点击节点的所有的父节点的id加上自己的id
      inputName: '输入分组进行过滤'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val)
    },
    filterTaskText(val) {
      this.$refs.treeTaskCustomCategory.filter(val)
    },
    sellerData() {
      this.initPage()
    }
  },
  created() {
    this.treeQuery.platformId = this.platformId
    this.initPage()

    // 绑定自定义返回事件
    GLOBAL.vbus.$on('custom.back', () => {
      this.backPage()
    })
  },
  methods: {
    //任务分组的树形勾选变化
    checkChange1(data,status){
        //console.log(data);
        let getCheckedKeys = this.$refs.treeCustomCategory.getCheckedKeys();
        //console.log(getCheckedKeys);
        let ids = [data.classifyId];
        if(data.childList){
             this.getChildListId(data.childList,ids)
        };
        if(status){
           this.$refs.treeCustomCategory.setCheckedKeys(ids.concat(getCheckedKeys));
        }else{
          let arr = [];
          getCheckedKeys.forEach(i=>{
              if( !ids.includes(i)){
                  arr.push(i)
              }
          })
          this.$refs.treeCustomCategory.setCheckedKeys(arr);
        }  
        
    },
    //产分类的树形勾选变化
    checkChange2(data,status){
        let getCheckedKeys = this.$refs.treeTaskCustomCategory.getCheckedKeys();
        //console.log(getCheckedKeys);
        let ids = [data.classifyId];
        if(data.childList){
             this.getChildListId(data.childList,ids)
        };
        if(status){
           this.$refs.treeTaskCustomCategory.setCheckedKeys(ids.concat(getCheckedKeys));
        }else{
          let arr = [];
          getCheckedKeys.forEach(i=>{
              if( !ids.includes(i)){
                  arr.push(i)
              }
          })
          this.$refs.treeTaskCustomCategory.setCheckedKeys(arr);
        } 
    },
    getChildListId(data,ids){
        data.forEach(el=>{
            if(el.classifyId){
              ids.push(el.classifyId)
            };
            if(el.childList){
              this.getChildListId(el.childList,ids)
            }
        })
    },
    handleTabClick(tab) {
      this.componentName = tab.$attrs.item.comName
      this.pParams.classifyId = null
      tab.name === 'first'
        ? (this.inputName = '输入分组进行过滤')
        : (this.inputName = '输入分类进行过滤')
      this.$nextTick(() => {
        this.getTaskClassifyList(tab.name === 'first' ? 0 : 1, true, () => {
          this.getPParams(0)
        })
        // this.getPParams(0)
      })
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.treeQuery.siteId = this.siteId
        this.treeQuery.sellerId = this.sellerId
        this.getTaskClassifyList(0, true)
        setTimeout(() => {
          this.getTaskClassifyList(1, false)
        }, 500)
      }
    },
    getTaskClassifyList(classifyType, flag, cb) {
      // flag true 首次加载
      if (!this.treeQuery.sellerId || !this.treeQuery.siteId) {
        return
      }

      setLoading(this, true)
      this.treeQuery.classifyType = classifyType
      this.$api['taskClassifyList'](this.treeQuery)
        .then(res => {
          let { code, data } = res
          if (code === 0) {
            // let classifyId =null
            // if(flag&&Array.isArray(data)&&data.length>0){
            //     classifyId =data[0].classifyId
            //     // this.listQuery.classifyId =classifyId
            //     // this.getList()
            //     this.getPParams(classifyId)
            // }
            //console.log(data)
            if (classifyType == 0) {
              this.getPParams(0) // 展示全部

              // this.ruleForm.classifyType =classifyType
              // 默认是 任务分类

              // this.taskClassify0List = [
              //   {
              //     childList: data,
              //     parentClassifyId: 0,
              //     haveChildren: 1,
              //     createTime: null,
              //     classifyName: '全部',
              //     classifyId: 0
              //     //disabled: true
              //   }
              // ]
              this.taskClassify0List = data ;
              this.pParams.taskClassify0List = data

              this.$nextTick(() => {
                this.$refs.treeCustomCategory.setCurrentKey(0)
                this.$refs.treeTaskCustomCategory.setCurrentKey(null)
              })

              // if (flag && classifyId !== null) {
              //   setTimeout(() => {

              //   }, 500);
              // }
            } else if (classifyType == 3) {
              this.pParams.taskClassify0List = data
            } else {
              // this.taskClassify1List = [
              //   {
              //     childList: data,
              //     parentClassifyId: 0,
              //     haveChildren: 1,
              //     createTime: null,
              //     classifyName: '全部',
              //     classifyId: 0
              //     //disabled: true
              //   }
              // ]
              this.taskClassify1List = data;
              this.pParams.taskClassify1List = data

              this.$nextTick(() => {
                this.$refs.treeCustomCategory.setCurrentKey(0)
                this.$refs.treeTaskCustomCategory.setCurrentKey(null)
              })
            }
            // this.getParentClassifyIdOptions()
            if (cb) {
              cb()
            }
          }
          setTimeout(() => {
            setLoading(this, false)
          }, 500)
        })
        .catch(() => {
          setLoading(this, false)
        })
      function setLoading(self, type) {
        if (classifyType == 0) {
          self.tree0Loading = type
        } else {
          self.tree1Loading = type
        }
      }
    },
    handleNode0Click(data, node, us) {
      this.$store.commit('setBackBtn', false)
      if (this.componentName === "detail") {
        this.componentName = 'task'
        this.refreshTree = false
        this.$nextTick(() => {
          this.refreshTree = true
          this.$nextTick(() =>{
            this.$refs.com.getList()
          })
          
          
        })
        return
      }
      // this.componentName = 'task'
      // console.log('----------------------0000...............');
      // // console.log(data);
      console.log(node)
      // debugger
      // console.log(us);
      // console.log(this.taskClassify0List);

      let idArray = [] //拿到当前点击节点的所有父级id和自己的id和自己子级的id
      function searachParent(node) {
        if (node.parent && node.parent.data.classifyId !== 0) {
          idArray.unshift(node.parent.data.classifyId)
          searachParent(node.parent)
        }
        //console.log('object');
      }
      searachParent(node)
      idArray.push(node.data.classifyId)
      //如果当前节点还有下级的话还要继续往下找,直到找到没有数据的节点
      searchChild(node.data)
      function searchChild(data) {
        if (data.haveChildren && data.childList) {
          for (let index = 0; index < data.childList.length; index++) {
            const item = data.childList[index]
            if (!item.haveChildren) {
              idArray.push(item.classifyId)
              break
            } else {
              idArray.push(item.classifyId)
              searchChild(item)
            }
          }
        } else {
          idArray.push(data.classifyId)
        }
      }

      this.parentIds = idArray

      this.$refs.treeTaskCustomCategory.setCurrentKey(null)
      setTimeout(() => {
        this.getPParams(data.classifyId)
      }, 250)
    },
    check0change(o, t, h) {
      // console.log('-=========================================');
      // console.log(o);
      // console.log(t);
    },
    handleNode1Click(data) {
      this.$store.commit('setBackBtn', false)
      // this.componentName = 'library'

      this.$refs.treeCustomCategory.setCurrentKey(null)
      setTimeout(() => {
        this.getPParams(data.classifyId)
      }, 250)
    },
    viewDetail(taskId) {
      this.componentName = 'detail'
      this.pParams.taskId = taskId
    },
    backPage(back) {
      // console.log(back);
      this.$store.commit('setBackBtn', false)
      this.componentName = 'task'
      // debugger
      this.$nextTick(() => {

        this.$refs.com.getList()
      })
      // this.pParams.isBackPage = back
      
    },
    getPParams(classifyId) {
      this.pParams.classifyId = classifyId
      this.pParams.siteId = this.siteId
      this.pParams.sellerId = this.sellerId
    },

    filterNode(value, data) {
      if (!value) return true
      return data.classifyName.indexOf(value) !== -1
    },
    filterNode(value, data) {
      if (!value) return true
      return data.classifyName.indexOf(value) !== -1
    },
    reloadTree(params) {
      let { classifyType, flag } = params
      this.getTaskClassifyList(classifyType, flag)
    },

    showDialog(fun, type, nodeDate, classifyType, node) {
      console.log('------------555555555555555555')
      // console.log(this.taskClassify0List);
      // console.log('------------555555555555555555');
      // console.log(nodeDate);

      // fun 是添加还是删除还是编辑
      //nodeDate 点击的节点的数据
      //classifyType 点击的是哪个树形结构   0上  1下面的产品
      //node 获取当前节点

      // type 1 任务分类顶部  2 任务分类树形菜单
      //      3 产品分类顶部  4 产品分类树形菜单
      //      5 右边body功能按钮

      //console.log(type);
      console.log('--------------------0000000000000')
      //console.log(nodeDate);
      console.log(node)
      // console.log(classifyType);

      let parentNode = null //点击节点的父级数据
      if (type === 2 || type === 4) {
        parentNode = node.parent.data
      }
      let params = {
        fun,
        type,
        siteId: this.treeQuery.siteId,
        sellerId: this.treeQuery.sellerId
      }
      let allNode //全部的树形节点
      if ((type === 1 || type === 2) && classifyType === 0) {
        allNode = this.taskClassify0List
      } else {
        allNode = this.taskClassify1List
      }
      console.log(allNode)
      if (type === 1 || type === 3) {
        this.$refs.classifyDialog.showDialog(
          true,
          params,
          [nodeDate],
          parentNode,
          allNode[0].childList,
          node
        )
      } else if (nodeDate === null) {
        this.$refs.classifyDialog.showDialog(true, params, [
          { classifyId: 0, parentClassifyId: 0, classifyName: '' }
        ])
      } else {
        this.$refs.classifyDialog.showDialog(
          true,
          params,
          [nodeDate],
          parentNode,
          allNode[0].childList,
          node
        )
      }
      //this.getParentClassifyIdOptions(type,classifyType,nodeDate);
      //this.$refs.classifyDialog.showDialog(true, params, nodeDate);
    },
    // getParentClassifyIdOptions(type,classifyType,nodeDate) {
    //   if (classifyType=== 0) {
    //     this.getTaskClassify0List(type,nodeDate);
    //   } else if (classifyType === 1) {
    //     this.getTaskClassify1List(nodeDate);
    //   }
    // },
    // getTaskClassify0List(type,nodeDate) {
    //   //let taskClassify0List = this.taskClassify0List;
    //    console.log('------------66666666666666666');
    //   // console.log(taskClassify0List);
    //   console.log(nodeDate)
    //   if (type===1) {
    //     this.parentClassifyIdOptions = [{ parentClassifyId: 0, classifyName: "无" }];
    //   }else {
    //     this.parentClassifyIdOptions = [nodeDate];
    //   }
    // },
    // getTaskClassify1List() {
    //   let taskClassify1List = this.taskClassify1List;
    //   if (taskClassify1List.length == 0) {
    //     this.parentClassifyIdOptions = [{ classifyId: 0, classifyName: "无" }];
    //   } else {
    //     this.parentClassifyIdOptions = this.taskClassify1List;
    //   }
    // },
    submitForm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let dialogTypeArr = this.dialogType.split(':')
          let fun = dialogTypeArr[0]
          let type = dialogTypeArr[1]

          if (fun == 'add') {
            let classifyType = 0

            if (type == 3 || type == 4) {
              classifyType = 1
            }
            this.ruleForm.platformId = this.listQuery.platformId
            let ruleForm = _.cloneDeep(this.ruleForm)
            ruleForm.parentClassifyId = _.last(ruleForm.parentClassifyId)
            ruleForm.classifyType = classifyType

            this.$api['taskClassifySave'](ruleForm).then(res => {
              this.getTaskClassifyList(classifyType, false)
            })
          } else if (fun == 'edit') {
            let classifyType = 0

            if (type == 3 || type == 4) {
              classifyType = 1
            }
            let parentClassifyId = null
            let parentClassifyIdArr = this.ruleForm.parentClassifyId
            if (Array.isArray(parentClassifyIdArr)) {
              if (parentClassifyIdArr.length == 1) {
                parentClassifyId = parentClassifyIdArr[0]
              } else if (parentClassifyIdArr.length > 1) {
                parentClassifyId =
                  parentClassifyIdArr[parentClassifyIdArr.length - 1]
              }
            }

            this.$api['taskClassifyUpdate']({
              parentClassifyId,
              classifyId: _.last(this.ruleForm.parentClassifyId),
              classifyName: this.ruleForm.classifyName
            }).then(res => {
              if (res.code == 0) {
                this.getTaskClassifyList(classifyType, false)
              }
            })
          } else if (fun == 'move') {
            let multipleSelection = this.multipleSelection

            if (multipleSelection.length !== 1) {
              this.$message.warning('不支持批量移动')
              return
            }
            this.$api['taskClassifyUpdate']({
              parentClassifyId: _.last(this.ruleForm.parentClassifyId),
              classifyId: multipleSelection[0].classifyId,
              classifyName: this.ruleForm.classifyName
            }).then(res => {
              if (res.code == 0) {
                this.getList()
              }
            })
          }
          this.options.visible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    deleteTreeNode(classifyType, nodeData, type) {
      //console.log(type);
      //return
      //console.log(nodeData)
      let classifyIds = []
      if (nodeData !== null) {
        classifyIds = [nodeData.classifyId]
      } else {
        let ids = null
        if (classifyType == 0) {
          ids = this.$refs.treeCustomCategory.getCheckedNodes()
        } else if (classifyType == 1) {
          ids = this.$refs.treeTaskCustomCategory.getCheckedNodes()
        }
        if (ids !== null) {
          ids.forEach(element => {
            classifyIds.push(element.classifyId)
          })
        }
        console.log(ids)
      }
      if (classifyIds.length == 0) {
        this.$message.warning('至少选一项')
        return
      }
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['taskClassifyRemove']({
            classifyIds,
            classifyType: type,
            flag: classifyType===0 ? 0 : null
          }).then(res => {
            if (res.code == 0) {
              this.getTaskClassifyList(classifyType, false)
              if (classifyIds.indexOf(this.pParams.classifyId) !== -1) {
                this.pParams.classifyId = null
              }
            }
          })

          if (classifyType == 0) {
            this.$refs.treeCustomCategory.setCheckedKeys([])
          } else if (classifyType == 1) {
            this.$refs.treeTaskCustomCategory.setCheckedKeys([])
          }
        })
        .catch(() => {})
    },
    reloadTaskClassify0List() {
      this.getTaskClassifyList(0, false) // 更新 pParams.taskClassify0List
    }
  }
}
</script>
<style lang="less" scoped>
.custom-tree-node {
  .span-el-icon {
    display: none;
  }
  &:hover {
    .span-el-icon {
      display: inline-block;
    }
  }
}
.box-center {
  display: flex;
  justify-content: center;
}
.box {
  .box-left-menu {
    .box-center {
      margin-bottom: 5px;
      /deep/[class^='el-icon-'] {
        // font-size: 13px;
        margin-left: 15px;
        margin-right: 15px;
        cursor: pointer;
      }
    }
    .menu-select {
      width: 100%;
      // margin-bottom: 5px;
    }
    .btns {
      .el-button {
        padding: 6px 0;
      }
    }

    .el-tree {
      /deep/.el-tree-node__children {
        overflow: visible !important;
      }
      .custom-tree-node {
        display: flex;
        //   width: 180px;
        justify-content: space-between;
        font-size: 12px;
        [class^='el-icon-'] {
          font-size: 16px;
          margin-left: 3px;
        }
      }

      /deep/.el-tree__empty-text {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>

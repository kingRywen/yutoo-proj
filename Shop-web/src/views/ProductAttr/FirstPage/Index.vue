<!--  -->
<template>
  <div class="box h100">
    <div v-if="$route.name==='ProductAttr'" class="h100" v-loading="loading">
      <tpl-drawer v-if="$route.name==='ProductAttr'" left="13px">
        <template slot="leftMenu" class="box-left-menu">
          <el-input clearable placeholder="输入类目过滤" v-model.trim="filterText" size="mini" class="menu-select w100"></el-input>
          <div class="el-icon-box w100" style="display:flex;justify-content: flex-end;">
            <!-- <i class="el-icon-refresh common_color" @click="getCustomCategory"></i>
            <i class="el-icon-refresh common_color" :addBtn="cateButs"></i>-->
            <!-- // 类目按钮 -->
            <cateBtns type="menu" :cateBtns="cateBtns" ref="cateBtns"></cateBtns>
          </div>
          <el-tree
            v-if="showTree"
            :expand-on-click-node="false"
            node-key="cateId"
            class="custom-productattr-tree"
            show-checkbox
            :data="customCategoryData"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
            ref="treeCustomCategory"
            :filter-node-method="filterNode"
            v-loading="treeLoading"
            :key="treeKey"
            :default-expanded-keys="defaultExpandedKeys"
            :current-node-key="currentNodeKey"
          >
            <!-- 鼠标移上去显示 -->
            <div
              class="custom-tree-node"
              slot-scope="{ node, data }"
              @mouseenter="handleNodeMouseEnter(data)"
              @mouseleave="handleNodeMouseLeave(data)"
            >
              <ElTooltip v-if="data.cateFlag" content="自定义类目" :open-delay="500" placement="top">
                <i class="iconfont1" style="font-size:14px">&#xe6cf;</i>
              </ElTooltip>
              <span :title="node.label" class="tree-box">
                <span>{{ node.label }}</span>

                <!-- // 分类按钮 -->
                <cateBtns
                  v-show="data.show"
                  class="right-btns-wrapper"
                  :cateBtns="itemCateBtns(data)"
                  ref="itemCateBtns"
                  style="display:inline"
                ></cateBtns>
              </span>
            </div>
          </el-tree>
        </template>
        <div slot="body" class="box-body">
          <el-tabs v-if="customCategoryData[0]" type="card" v-model="activeName" @tab-click="change">
            <el-tab-pane label="产品列表" name="0">
              <ProductList ref="productList" v-if="activeName==='0'" :cateId="taskCateId" :outerParams="outerParams"></ProductList>
            </el-tab-pane>
            <el-tab-pane v-if="!taskCateFlag" label="任务列表" name="1" lazy>
              <taskList ref="tasklist" :cateId="taskCateId" :cateFlag="taskCateFlag" :currentCateId="currentCateId" v-if="activeName==='1'"></taskList>
            </el-tab-pane>
            <el-tab-pane v-if="taskCateFlag" label="同款列表" name="2" lazy>
              <sameStyle :cateId="taskCateId" :cateFlag="taskCateFlag" v-if="activeName==='2'"></sameStyle>
            </el-tab-pane>
            <el-tab-pane v-if="taskCateFlag" label="爆款属性分析" name="3" lazy>
              <hotStyle :cateId="taskCateId" :cateFlag="taskCateFlag" v-if="activeName==='3'"></hotStyle>
            </el-tab-pane>
            <el-tab-pane v-if="taskCateFlag" label="衰款属性分析" name="4" lazy>
              <desilingStyle :cateId="taskCateId" :cateFlag="taskCateFlag" v-if="activeName==='4'"></desilingStyle>
            </el-tab-pane>
          </el-tabs>
          <NonePage noBack v-else>暂时还没有任何任务哟，请在左侧类目树中添加任务</NonePage>
        </div>
      </tpl-drawer>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import ProductList from '../ProductList/ProductList' //产品列表
import taskList from '../taskList/index' //任务列表
import sameStyle from '../sameStyleList/index' //同款列表
import hotStyle from '../hotStyleAttributeAnalysis/index' //爆款属性分析
import desilingStyle from '../decilingStyleAttributeAnalysis/index' //衰款属性分析
import TplDrawer from '@/views/Common/tpl-drawer/index'
import cateBtns from './cateBtns/cateBtns'
export default {
  components: {
    TplDrawer,
    cateBtns,
    ProductList,
    taskList,
    sameStyle,
    hotStyle,
    desilingStyle
  },
  data() {
    return {
      showTree: false,
      currentCateId: null,
      currentNodeKey: null,
      defaultExpandedKeys: [],
      cateBtns: [
        {
          icon: 'el-icon-refresh',
          name: '刷新',
          fn: scope => {
            this.getCustomCategory()
          },
          show: true
        },
        {
          icon: 'el-icon-circle-plus-outline',
          name: '添加类目任务',
          fn: scope => {
            this.$refs.cateBtns.$dialog({
              title: '添加类目任务',
              size: 'small',
              params: {},
              component: () => import('./cateBtnDialogs/addCateDialog'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          },
          show: true
        },
        {
          icon: 'el-icon-delete',
          name: '删除类目',
          fn: scope => {
            this.sideDelete()
          },
          show: true
        }
      ],
      activeName: '0',
      // sider
      filterText: null,
      treeLoading: false,
      loading: false,
      treeKey: 1,
      customCategoryData: [],
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      cateId: null,
      //外部参数
      outerParams: {
        startTime: null,
        endTime: null,
        platformId: null,
        siteId: null,
        sellerId: null
      },

      taskCateId: '', //tree列表的类目id
      taskCateFlag: '', //tree列表类目类型

      currentCateIdData:'',//当前类目id的数据
    }
  },

  created() {
    this.outerParams.platformId=this.platformId;
    let vm = this
    if (this.sellerId && this.siteId) {
      this.getCustomCategory()
      this.outerParams.siteId = this.siteId
      this.outerParams.sellerId = this.sellerId
    }
    GLOBAL.vbus.$on('addCate.refreshTree', (v) => {
      vm.getCustomCategory(v)
    })
  },
  mounted() {},
  methods: {
    handleNodeMouseEnter(data) {
      this.$set(data, 'show', true)
    },
    handleNodeMouseLeave(data) {
      this.$set(data, 'show', false)
    },
    change() {},
    handleNodeClick(data, node) {
      let currentIds = [],
        current = node
      // 清除选中项
      if (this.$refs.productList) {
        this.$refs.productList.clearSelection()
      }

      if (
        (!data.cateFlag && this.taskCateFlag) ||
        (data.cateFlag && !this.taskCateFlag)
      ) {
        this.activeName = '0'
      }

      this.$set(this.outerParams, 'cateId', data.cateId)
      this.$set(this.outerParams, 'cateFlag', data.cateFlag)
      this.taskCateId = data.cateId
      this.taskCateFlag = data.cateFlag
      while (current) {
        if (current.data.cateId) {
          currentIds.unshift(current.data.cateId)
        }
        current = current.parent
      }
      this.currentCateId = currentIds
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getCustomCategory(v) {
      this.treeLoading = true
      if (this.outerParams.cateId === 0) {
        // 如果本来就是全部，那么请求一下新的侧边栏
        this.getcustomCategoryList(v)
      } else {
        // 如果不是处于全部，既然请求侧边栏，也要请求右边的表格数据
        this.getcustomCategoryList(v)
        this.$set(this.outerParams, 'cateId', 0)
      }
      setTimeout(() => {
        this.treeLoading = false
      }, 500)
    },
    getcustomCategoryList(v) {
      this.loading = true
      this.$api['taskSelAttrListCategory']({
        sellerId: this.sellerId,
        siteId: this.siteId,
        platformId: this.platformId
      })
        .then(res => {
          this.loading = false
          let data = res.data
          if (!data) {
            return
          }
          // let notInGroups = {
          //   createTime: "",
          //   cateId: null,
          //   cateId: -1,
          //   name: "未分类",
          //   haveChildren: 0,
          //   parentcateId: null
          // };
          // data.push(notInGroups);
          let newData = data
          this.customCategoryData = newData


          let setCurrentKey ;

          //如果v存在,并且不是对象,说明刚添加完类目任务

          if( v && Object.prototype.toString.call(v) ==='[object Number]'){
            this.getCateIdData(data,v)
            this.taskCateId = this.currentCateIdData.cateId
            this.taskCateFlag = this.currentCateIdData.cateFlag
            this.$set(this.outerParams, 'cateId', this.currentCateIdData.cateId)
            this.$set(this.outerParams, 'cateFlag', this.currentCateIdData.cateFlag)
            this.defaultExpandedKeys = [this.currentCateIdData.cateId]
            this.currentCateId = [this.currentCateIdData.cateId]
            this.activeName = '1'
            setCurrentKey = v ;

          }else if( v && Object.prototype.toString.call(v) ==='[object Object]' ){ //添加完自定义类目
              let {parentCateId,name} = v;
              let current
              getChildId(data)
              function getChildId(data){
                  data.forEach(i=>{
                      if(i.cateId === parentCateId){
                        current = i
                        return
                      };
                      if(i.childList){
                          getChildId(i.childList)
                      }
                  })
              };
              //console.log(current); 
              current.childList.forEach(i=>{
                  if(i.name === name){
                    this.currentCateIdData = i
                  }
              })
              this.taskCateId = this.currentCateIdData.cateId
              this.taskCateFlag = this.currentCateIdData.cateFlag
              this.$set(this.outerParams, 'cateId', this.currentCateIdData.cateId)
              this.$set(this.outerParams, 'cateFlag', this.currentCateIdData.cateFlag)
              this.defaultExpandedKeys = [this.currentCateIdData.cateId]
              this.currentCateId = [this.currentCateIdData.cateId]
              this.activeName = '0'
              setCurrentKey = this.currentCateIdData.cateId
              
          }else{
              const { current, arr } = this.getFirstKey(data)
              //
              this.taskCateId = current.cateId
              this.taskCateFlag = current.cateFlag
              this.$set(this.outerParams, 'cateId', current.cateId)
              this.$set(this.outerParams, 'cateFlag', current.cateFlag)
              this.defaultExpandedKeys = arr
              this.currentCateId = arr
              this.activeName = '0'
              setCurrentKey = arr.slice(0).pop()
          }

          this.showTree = true
          this.$nextTick(() => {
              this.$refs.treeCustomCategory && this.$refs.treeCustomCategory.setCurrentKey(setCurrentKey)
          })
          //
        })
        .catch(err => {
          console.log(err);
          this.loading = false
          this.customCategoryData = []
        })
    },
    getCateIdData(data,id,){
      //debugger
      data.forEach(i=>{
          if(i.cateId === id){
            this.currentCateIdData = i
            return
          };
          if(i.childList){
              this.getCateIdData(i.childList,id)
          }
      })
    },
    getFirstKey(data) {
      let current = data[0],
        arr = []
      while (current.childList) {
        arr.push(current.cateId)
        current = current.childList[0]
      }
      arr.push(current.cateId)
      return { current, arr }
    },
    sideDelete(deleteOne) {
      let newArr
      let arr
      if (deleteOne) {
        // 删除某一项
        newArr = deleteOne
      } else {
        // 删除某一项或多项
        arr = this.$refs.treeCustomCategory.getCheckedKeys()
        if (!arr.length) {
          this.$message.warning('未选中类目')
          return
        }
        newArr = arr.filter(item => item)
      }

      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            sellerId: this.sellerId,
            siteId: this.siteId,
            cateIds: newArr,
            removeDataFlag: 1,
            platformId: this.platformId
          }
          this.$api['taskSelAttrBatchRemoveCategory'](params).then(res => {
            this.$message.success('删除成功')
            // 重新请求列表
            this.getCustomCategory()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      //
    },
    itemCateBtns(data) {
      let vm = this
      let allBtns = [
        {
          icon: 'el-icon-plus',
          name: '添加自定义子级分类',
          fn: scope => {
            vm.$refs.cateBtns.$dialog({
              title: '添加自定义子级分类',
              size: 'small',
              params: {
                cateId: data.cateId
              },
              component: () => import('./cateBtnDialogs/DIYcateDialog'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          icon: 'el-icon-setting',
          name: '查看产品属性',
          fn: scope => {
            const params = {
              sellerId: vm.sellerId,
              siteId: vm.siteId,
              platformId: vm.platformId,
              cateId: data.cateId,
              cateFlag: data.cateFlag
            }
            vm.$api[`selAttrCategorySyncConfig`](params)
              .then(() => {
                vm.$refs.cateBtns.$dialog({
                  title: '查看产品属性',
                  size: 'medium',
                  params: {
                    name: data.name,
                    parentName: data.parentName
                  },
                  component: () =>
                    import('./cateBtnDialogs/checkProAttrDialog'),
                  okBtnText: '确认',
                  cancelBtnText: '取消'
                })
              })
              .catch(() => {})
          }
        },
        {
          icon: 'el-icon-delete',
          name: '删除类目',
          fn: scope => {
            vm.sideDelete([data.cateId])
          }
        },
        {
          icon: 'el-icon-circle-plus',
          name: '添加任务',
          fn: scope => {
            vm.$refs.cateBtns.$dialog({
              title: '添加任务',
              size: 'small',
              params: {
                cateId: data.cateId,
                currentCateId: vm.currentCateId,
                close(id) {
                  if (id == vm.currentCateId.slice(0).pop() && vm.activeName == '1') {
                    vm.$refs.tasklist.getLayoutList()
                  }
                }
              },
              component: () => import('./cateBtnDialogs/addTask.vue'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        }
      ]
      if (!data.cateFlag) {
        // 不是自定义，则返回全部按钮
        return allBtns
      } else {
        // 是自定义则返回部分按钮
        return [allBtns[1], allBtns[2]]
      }
    }
  },

  computed: {},
  watch: {
    customCategoryData: {
      immediate: true,
      handler(val) {
        if (!val.length) {
          this.cateBtns[0].show = false
          this.cateBtns[1].show = true
          this.cateBtns[2].show = false
        } else {
          this.cateBtns[0].show = true
          this.cateBtns[1].show = true
          this.cateBtns[2].show = true
        }
      }
    },
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val)
    },
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.getCustomCategory()
        this.outerParams.siteId = this.siteId
        this.outerParams.sellerId = this.sellerId
      }
    }
  }
}
</script>

<style lang='less' scoped>
.iconfont1 {
  font-size: 22px !important;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
  color: #5daf34;
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
      width: 225px;
      margin-bottom: 5px;
    }

    .el-tree {
      /deep/.el-tree-node__children {
        overflow: visible !important;
      }

      /deep/.el-tree__empty-text {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>
<style lang="scss">
.custom-productattr-tree {
  .el-tree-node__content {
    position: relative;
    height: 26px;
  }
  .custom-tree-node {
    height: 26px;
    line-height: 26px;
    display: flex;
    //   width: 180px;
    width: 100%;
    // justify-content: space-between;
    align-items: center;
    font-size: 12px;
    .tree-box {
      display: flex;
      justify-content: space-between;
      & > span {
        font-size: 12px;
      }
      .right-btns-wrapper {
        background: #f5f7fa;
        height: 26px;
        top: 0;
        line-height: 26px;
        position: absolute;
        right: 0;
      }
    }
    [class^='el-icon-'] {
      font-size: 14px;
      margin-left: 3px;
    }
  }
}
</style>

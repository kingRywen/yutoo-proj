<template>
  <div>
    <div class="rightColumns" :class="className ? 'active' : ''">
      <el-button type="text" @click="toggle" class="left" v-if="!className">
        <v-icon type="bars"></v-icon>
      </el-button>
      <el-card class="box-card" :body-style="bodyStyle">
        <div slot="header" class="clearfix">
          <span>产品类目</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="toggle">
            <v-icon type="caret-right"></v-icon>
          </el-button>
        </div>
        <div>
          <el-tree
            :data="data"
            :multiple="false"
            node-key="categoryId"
            ref="tree"
            @node-expand="handleNodeExpand"
            highlight-current
            :props="defaultProps"
            @node-click="handleNodeClick"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data.num" style="color:#108ee9">({{data.num}})</span>
            </span>
          </el-tree>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { Card, Button, Tree } from 'element-ui'
import Vue from 'vue'
import { fetchData, showToast, _storage } from 'common/common'
import { isArray } from 'common/util'
import apis from 'apis'
import {loginRedirect} from 'common/config';

Vue.use(Card)
Vue.use(Button)
Vue.use(Tree)

export default {
  async created() {
    let currentPlat = _storage._get('session', 'platCurrentPlatform')
    if (currentPlat) {
      this.currentPlatformId = currentPlat.platformId
    }
    // 设置类目数目
    this.getNum()

    if (sessionStorage.getItem('toggle') == 1) {
      this.className = true
    } else {
      this.className = false
    }
  },
  data() {
    return {
      baseFlag: false,
      className: true,
      list: [],

      currentPlatformId: 1,

      data: [],
      defaultProps: {
        children: 'childs',
        label: 'nameCn'
      },

      bodyStyle: {
        overflow: 'auto',
        height: '100%',
        marginTop: '14px',
        marginRight: '6px'
      }
    }
  },
  methods: {
    getNum(categoryId = 1) {
      let url = '/product/productList.html'
      console.log(url);
      if (window.location.hash.indexOf(url) >= 0) {
        this.baseFlag = true
        this.setNum(categoryId)
      } else {

        this.setNum(categoryId, this.currentPlatformId)
      }
    },

    // 重新获取类目
    reset(platformId, type) {
      this.list = []
      this.currentPlatformId = platformId
      this.$emit('search', null)
      this.reload(platformId, type)
    },
    reload(platformId, type) {
      if (type === 'base') {
        this.setNum(1)
      } else {
        this.setNum(1, platformId)
      }
    },
    async setNum(categoryId, plat) {
      // 获取所有类目树
      let list
      if (!this.list.length) {
        list = this.list = [await this.getCategoryList()]
      } else {
        list = this.list
      }

      let num = await this.getCategoryNum(
        categoryId,
        plat || this.currentPlatformId
      )

      function find(list, id) {
        
        let el = list.find(el => el.categoryId == id)
        if (el) {
          return el
        } else {
          for (let i = 0; i < list.length; i++) {
            const element = list[i]
            if (
              element.childs &&
              isArray(element.childs) &&
              element.childs.length > 0
            ) {
              let el = find(element.childs, id)
              if (el) {
                return el
                break
              }
            }
          }
        }
      }

      for (const key in num) {
        if (num.hasOwnProperty(key)) {
          const element = num[key]
          let cur = find(list, key)
          if (cur) {
            // cur.num = element;
            this.$set(cur, 'num', element)
            
          }
        }
      }

      this.data = list
    },

    getCategoryList() {
      return fetchData({ ...apis.PRODUCT_CATEGORY_LIST, data: {} }).then(
        res => {
          let { code, msg } = res.data
          if (code && code === 500) {
            showToast('error', msg)
            return null
          } else {
            return res.data
          }
        }
      )
    },

    getCategoryNum(id, plat) {
      let api = apis.PRODUCT_BASE_CATEGORY_NUM
      if (!this.baseFlag) {
        api = apis.PRODUCT_PLATFORM_CATEGORY_NUM
      }
      return fetchData({
        ...api,
        data: {
          categoryId: id,
          platformId: plat || 1
        }
      }).then(res => {
        let { code, msg } = res.data
        if (code && code === 500) {
          showToast('error', msg)
          return {}
        } else {
          return res.data
        }
      })
    },

    toggle() {
      this.className = !this.className
      if (sessionStorage.getItem('toggle') == 1) {
        sessionStorage.setItem('toggle', 2)
      } else {
        sessionStorage.setItem('toggle', 1)
      }
    },
    handleNodeClick(data) {
      
      this.$emit('search', data.categoryId)
    },

    handleNodeExpand(data) {
      
      this.getNum(data.categoryId)
    }
  }
}
</script>

<style lang="less" scoped>
.rightColumns {
  position: fixed;
  right: 0;
  width: 240px;
  height: 100%;
  bottom: 0;
  box-sizing: border-box;
  padding: 160px 0 100px;
  transform: translateX(240px);
  transition: all 0.15s ease-in-out;
  .left {
    border-radius: 20px 0 0 20px;
    position: absolute;
    background: #108ee9;
    padding: 6px 8px;
    color: #cfe8f9;
    box-shadow: -1px 5px 20px rgba(16, 144, 233, 0.5);
    left: -24px;
  }
  .box-card {
    height: 100%;
    padding-bottom: 100px;
  }
  &.active {
    transform: translateX(0);
    transition: all 0.15s ease-in-out;
  }
}
</style>

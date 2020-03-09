<template>
  <div style="height:100%">
    <div class="___imageLibrary">
      <div class="col left">
        <div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>

          <div class="hr"></div>
          <div class="expand">
            <a @click="toggle">收起/展开</a>
          </div>

          <el-tree
            :highlight-current="true"
            v-if="updated"
            class="filter-tree"
            :data="data2"
            :props="defaultProps"
            :default-expand-all="expandAll"
            :filter-node-method="filterNode"
            ref="tree"
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          ></el-tree>
        </div>
      </div>
      <div class="col right">
        <div v-if="!showInfoImg">
          <!-- {{zipInfo}} -->
          <v-button @click="back" style="margin-bottom:10px">返回图片编辑</v-button>
          <upload-file
            :lib="true"
            :no-edit-photo-btn="true"
            @successfile="setFile"
            @getzip="getZip"
            :zip="zipInfo"
            key="file"
          ></upload-file>
        </div>
        <div v-if="showInfoImg">
          <v-button @click="back" style="margin-bottom:10px">返回图片编辑</v-button>
          <upload-img
            :has-img="imgs"
            :product-id="productId"
            :lib="true"
            @updatelib="updateData"
            key="img"
            :show="true"
          ></upload-img>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tree, Input } from 'element-ui'
import UploadFile from 'components/base/uploadFile'
import UploadImg from 'components/base/uploadImg'
import { fetchData, toParamUrl, showToast, _storage } from 'common/common'
import { getQueryString } from 'common/util'
import apis from 'apis'

Vue.use(Tree)
Vue.use(Input)

export default {
  components: {
    UploadFile,
    UploadImg
  },
  created() {
    this.productId = +getQueryString('productId')
    this.productPltDetailId = +getQueryString('productPltDetailId')
    this.getZip()
  },
  data() {
    return {
      curId: null,
      imgs: [],
      showInfoImg: false,
      all: true,
      expandAll: true,
      updated: true,
      filterText: '',
      zipInfo: {},
      data2: [],
      defaultProps: {
        children: 'childList',
        label: 'name'
      }
    }
  },
  methods: {
    back() {
      let params = _storage._get('session', 'imageLibrary_param')
      top.location.hash =
        '#/product/platformList/editLists.html?' +
        encodeURIComponent(decodeURIComponent(params) + '&showimg=true')
      // toParamUrl("/product/platformList/editLists.html?", params);
    },
    getZip() {
      fetchData({
        ...apis.PRODUCT_IMAGE_DIR_TREE,
        data: { productPltDetailId: this.productPltDetailId }
      }).then(res => {
        if (res.data.code === 500) {
          showToast('error', res.data.msg)
        } else {
          // debugger;
          this.data2 = res.data.rows.dirTree
          this.zipInfo = res.data.rows.zipInfo
        }
      })
    },
    updateData() {
      this.getPics(this.curId)
    },

    setFile(files) {
      this.getZip()
    },

    handleNodeClick(data, node, self) {
      console.log(data, node, self)
      if (data.parentId !== 0 && data.parentId != null) {
        this.curId = data.imgFolderId
        this.getPics(data.imgFolderId)
      } else {
        this.getZip()
        this.showInfoImg = false
      }
    },

    getPics(folderId) {
      fetchData({
        ...apis.PRODUCT_IMAGE_LIST_BY_DIR,
        data: {
          folderId,
          productId: this.productPltDetailId
        }
      }).then(res => {
        this.showInfoImg = true
        if (res.data.code !== 0) {
          this.imgs = []
          showToast('error', res.data.msg)
          return
        }
        this.imgs = res.data.rows
      })
    },

    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    toggle() {
      if (this.all) {
        this.all = false
        this.expandToggle(false)
      } else {
        this.all = true
        this.expandToggle(true)
      }
    },

    expandToggle(expand) {
      this.updated = false
      setTimeout(() => {
        this.expandAll = expand
        this.updated = true
      })
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="less">
.___imageLibrary {
  display: flex;
  height: 100%;
  .col.left {
    flex: auto;
    background: #f8f8f8;
    border-right: 1px solid #eee;
    width: 360px;
    & > div {
      padding: 20px;
    }
    .expand {
      text-align: right;
    }
  }
  .col.right {
    flex: auto;
    width: 100%;
    & > div {
      padding: 20px;
    }
  }
  .el-tree {
    background: none;
    .el-tree-node__label {
      font-size: 12px;
    }
  }
  .el-tree-node:focus > .el-tree-node__content {
    color: #0e77ca;
  }
  .el-tree-node.is-current > .el-tree-node__content {
    color: #0e77ca;
    border: 1px solid #add3ff;
  }
}
</style>

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
          <el-tree :data="data" :multiple="false" node-key="categoryId" ref="tree" @node-expand="handleNodeExpand" highlight-current :props="defaultProps" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }} </span>
              <span v-if="data.num" style="color:#108ee9">({{data.num}})</span>
            </span>
          </el-tree>
        </div>

      </el-card>
    </div>
  </div>

</template>

<script>
import { Card, Button, Tree } from "element-ui";
import Vue from "vue";
import { fetchData } from "common/common";
import { isArray } from "common/util";
import apis from "apis";

Vue.use(Card);
Vue.use(Button);
Vue.use(Tree);

export default {
  async created() {
    // 设置类目数目
    this.setNum(1);
    if (sessionStorage.getItem("toggle") == 1) {
      this.className = true;
    } else {
      this.className = false;
    }
  },
  data() {
    return {
      className: true,

      list: null,

      data: [],
      defaultProps: {
        children: "childs",
        label: "nameCn"
      },

      bodyStyle: {
        overflow: "auto",
        height: "100%",
        marginTop: "14px",
        marginRight: "6px"
      }
    };
  },
  methods: {
    async setNum(categoryId) {
      // 获取所有类目树
      let list;
      if (!this.list) {
        list = this.list = [await this.getCategoryList()];
      } else {
        list = this.list;
      }

      let num = await this.getCategoryNum(categoryId);

      function find(list, id) {
        console.log(id);
        let el = list.find(el => el.categoryId == id);
        if (el) {
          return el;
        } else {
          for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (
              element.childs &&
              isArray(element.childs) &&
              element.childs.length > 0
            ) {
              let el = find(element.childs, id);
              if (el) {
                return el;
                break;
              }
            }
          }
        }
      }

      for (const key in num) {
        if (num.hasOwnProperty(key)) {
          const element = num[key];
          let cur = find(list, key);
          if (cur) {
            // cur.num = element;
            this.$set(cur, "num", element);
            console.log(cur.num);
          }
        }
      }

      this.data = list;
    },

    getCategoryList() {
      return fetchData({ ...apis.PRODUCT_CATEGORY_LIST, data: {} }).then(
        res => res.data
      );
    },

    getCategoryNum(id) {
      return fetchData({
        ...apis.PRODUCT_BASE_CATEGORY_NUM,
        data: {
          categoryId: id
        }
      }).then(res => res.data);
    },

    toggle() {
      this.className = !this.className;
      if (sessionStorage.getItem("toggle") == 1) {
        sessionStorage.setItem("toggle", 2);
      } else {
        sessionStorage.setItem("toggle", 1);
      }
    },
    handleNodeClick(data) {
      console.log(data);
      this.$emit("search", data.categoryId);
    },

    handleNodeExpand(data) {
      console.log(data);
      this.setNum(data.categoryId);
    }
  }
};
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

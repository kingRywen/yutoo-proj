<template>
<el-aside width="200px" style="background-color: rgb(238, 241, 246);height: 100%">
  <el-menu router unique-opened :default-openeds="index" @open="bindIndex" @select="bindSelect" :default-active="$route.path">
    <!-- <el-submenu :index="index + ''" v-for="(list, index) in lists" :key="index">
      <template slot="title"><i class="el-icon-message"></i>{{list.name}}</template>
      <el-submenu :index="i + 'sub'" v-for="(item, i) in list.list" :key="i" v-if="item.list">
        <template v-if="item.list">
          <template slot="title"><i class="el-icon-message"></i>{{item.name}}</template>
          <el-menu-item v-for="(subItem, subI) in item.list" :key="subI" :index="subItem.url">
            {{ subItem.name }}
          </el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item v-for="(item, i) in list.list" :key="i" v-if="!item.list" index="/admin">
        {{item.name}}
      </el-menu-item>
    </el-submenu> -->
    <el-submenu :index="index + ''" v-for="(list, index) in lists" :key="index">
      <template slot="title"><i class="el-icon-message"></i>{{list.name}}</template>
      <el-submenu :index="i + 'sub'" v-for="(item, i) in list.list" :key="i" v-if="item.list">
        <template v-if="item.list">
          <template slot="title"><i class="el-icon-message"></i>{{item.name}}</template>
          <el-menu-item v-for="(subItem, subI) in item.list" :key="subI" :index="subItem.url">
            {{ subItem.name }}
          </el-menu-item>
        </template>
      </el-submenu>
      <el-menu-item v-for="(item, i) in list.list" :key="i" v-if="!item.list" :index="'/' + item.url">
        {{item.name}}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</el-aside>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  props: ['baseUrl'],
  created () {
    this.getSiderBar({
      route: this.$route.path
    })
  },
  data () { 
    return {
      index: ['0'],
      "menuList": [
        {
          "name": "产品管理",
          "type": 0,
          "icon": "fa fa-coffee",
          "orderNum": 0,
          "list": [
            {
              "name": "产品listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 0,
              "list": [
                {
                  "name": "产品listing",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/productList",
                  "orderNum": 0,
                },
                {
                  "name": "平台listing",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/PlatformList",
                  "orderNum": 1,
                },
                {
                  "name": "店铺listing",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/ShopList",
                  "orderNum": 2,
                }
              ]
            },
            {
              "name": "产品开发",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 1,
              "list": [
                {
                  "name": "销售提报开发",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/SalesReport",
                  "orderNum": 0,
                },
                {
                  "name": "平台产品采集",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/PlatformProductCollection",
                  "orderNum": 1,
                },
                {
                  "name": "供应商产品审核",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/VendorProductReview",
                  "orderNum": 2,
                }
              ]
            },
            {
              "name": "相关设置",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 2,
              "list": [
                {
                  "name": "店铺管理",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/StoreManagement",
                  "orderNum": 0,
                },
                {
                  "name": "敏感关键词管理",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/SensitiveKeywordManagement",
                  "orderNum": 1,
                },
                {
                  "name": "渠道SKU生成规则",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/ChannelSKUGenerationRules",
                  "orderNum": 2,
                },
                {
                  "name": "渠道SKU管理",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/ChannelSKUManagement",
                  "orderNum": 3,
                },
                {
                  "name": "SKU平台标题管理",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/SKUPlatformTitleManagement",
                  "orderNum": 4,
                },
                {
                  "name": "产品类目管理",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/BatchModificationOfChannelAssociation",
                  "orderNum": 5,
                },
                {
                  "name": "批量修改渠道关联",
                  "type": 2,
                  "icon": "fa fa-coffee",
                  "url": "/admin/center/ProductCategoryManagement",
                  "orderNum": 6,
                }
              ]
            }
          ]
        },
        {
          "name": "采购管理",
          "type": 0,
          "icon": "fa fa-coffee",
          "orderNum": 0,
          "list": [
            {
              "name": "产品listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 0,
              "url": "/admin/center"
            },
            {
              "name": "平台listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 1,
              "url": "/admin/center"
            },
            {
              "name": "店铺listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 2,
              "url": "/admin/center"
            }
          ]
        },
        {
          "name": "供应商管理",
          "type": 0,
          "icon": "fa fa-coffee",
          "orderNum": 1,
          "list": [
            {
              "name": "产品listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 0,
              "url": "/admin/center"
            },
            {
              "name": "平台listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 0,
              "url": "/admin/center"
            },
            {
              "name": "店铺listing",
              "type": 1,
              "icon": "fa fa-coffee",
              "orderNum": 0,
              "url": "/admin/center"
            }
          ]
        }
      ]
    }
  },
  methods: {
    ...mapActions('menu', [
      'getSiderBar'
    ]),
    bindIndex (e, i) {
      console.log(e, i)
      console.log('触发')
    },
    // bindClick (e) {
    //   console.log(e.$el.dataset.name)
    //   this.$emit('change', e.$el.dataset.name)
    // },
    bindSelect (e, i) {
      console.log(e, i)
    }
  },
  computed: {
    lists () {
      return this.$store.state.menu.subMenus
    }
  }
}
</script>
<style>

</style>

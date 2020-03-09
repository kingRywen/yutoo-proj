<template>
  <div v-if="breadList.length">
    <!-- 当前位置: -->
    <v-breadcrumb style="margin:12px 0" separator=">">
      <v-breadcrumb-item v-for="bread in breadList">
        <a v-if="bread.url" :href="bread.url">{{bread.name}}</a>
        <span v-else>{{bread.name}}</span>
      </v-breadcrumb-item>
    </v-breadcrumb>
  </div>
</template>

<script>
import {loginRedirect} from '@/ipConfig.js';
export default {
  props: {
    hash: {
      required: true,
      type: String,
      default: function() {
        return top.location.hash.split('?')[0]
      }
    }
  },
  data() {
    let productCrumb = [
      {
        name: '产品管理'
      },
      {
        name: '产品库',
        url: '#/product/productList.html'
      }
    ]
    let productDevelopment = [
      {
        name: '产品管理'
      },
      {
        name: '产品开发',
        url: '#/product/productDevelopment.html'
      }
    ]
    return {
      bread: {
        // 基础产品
        '#/product/productList/addProduct.html': [
          ...productCrumb,
          {
            name: '产品列表',
            url: '#/product/productList.html'
          },
          {
            name: '新增产品'
          }
        ],
        '#/product/productList/editAll.html': [
          ...productCrumb,
          {
            name: '产品列表',
            url: '#/product/productList.html'
          },
          {
            name: '编辑产品'
          }
        ],
        '#/product/productList/viewProductVariant.html': [
          ...productCrumb,
          {
            name: '产品列表',
            url: '#/product/productList.html'
          },
          {
            name: '查看变体'
          }
        ],
        '#/product/productList/viewProduct.html': [
          ...productCrumb,
          {
            name: '产品列表',
            url: '#/product/productList.html'
          },
          {
            name: '产品基本信息'
          }
        ],
        '#/product/productList/editVariant.html': [
          ...productCrumb,
          {
            name: '产品列表',
            url: '#/product/productList.html'
          },
          {
            name: '基础信息编辑(变体)'
          }
        ],
        '#/product/productList/editPurchase.html': [
          ...productCrumb,
          {
            name: '产品列表',
            url: '#/product/productList.html'
          },
          {
            name: '采购编辑'
          }
        ],
        '#/product/productList.html': [
          ...productCrumb,
          {
            name: '产品'
          }
        ],

        // 平台产品
        '#/product/platformList.html': [
          ...productCrumb,
          {
            name: '平台产品'
          }
        ],
        '#/product/ShopProducts.html': [
          ...productCrumb,
          {
            name: '店铺产品'
          }
        ],
        '#/product/platformList/review.html': [
          ...productCrumb,
          {
            name: '平台产品',
            url: '#/product/platformList.html'
          },
          {
            name: '平台信息审核'
          }
        ],
        '#/product/platformList/editLists.html': [
          ...productCrumb,
          {
            name: '平台产品',
            url: '#/product/platformList.html'
          },
          {
            name: '平台信息编辑(Amazon)'
          }
        ],
        '#/product/platformList/ebayEditLists.html': [
          ...productCrumb,
          {
            name: '平台产品',
            url: '#/product/platformList.html'
          },
          {
            name: '平台信息编辑(Ebay)'
          }
        ],
        '#/product/platformList/wishEditLists.html': [
          ...productCrumb,
          {
            name: '平台产品',
            url: '#/product/platformList.html'
          },
          {
            name: '平台信息编辑(wish)'
          }
        ],
        '#/product/platformList/viewProduct.html': [
          ...productCrumb,
          {
            name: '平台产品',
            url: '#/product/platformList.html'
          },
          {
            name: '平台产品查看'
          }
        ],
        // 图片库
        '#/product/imageLibrary.html': [
          ...productCrumb,
          {
            name: '平台产品',
            url: '#/product/platformList.html'
          },
          {
            name: '图片编辑'
          }
        ],

        // 店铺产品
        '#/product/ShopProducts/moveLog.html': [
          ...productCrumb,
          {
            name: '店铺产品',
            url: '#/product/ShopProducts.html'
          },
          {
            name: '挪动日志'
          }
        ],
        '#/product/ShopProducts/editLists.html': [
          ...productCrumb,
          {
            name: '店铺产品',
            url: '#/product/ShopProducts.html'
          },
          {
            name: '平台上架信息编辑'
          }
        ],

        '#/product/ShopProducts/reviewEditLists.html': [
          ...productCrumb,
          {
            name: '店铺产品',
            url: '#/product/ShopProducts.html'
          },
          {
            name: '平台上架信息审核'
          }
        ],

        // 提报开发
        '#/product/productDevelopment.html': [
          ...productCrumb,
          {
            name: '销售提报开发'
          }
        ],

        // 平台产品采集
        '#/product/PlatformProductsCollection.html': [
          ...productCrumb,
          {
            name: '平台产品采集'
          }
        ],

        // 供应商产品审核
        '#/product/SupplierProductReview.html': [
          ...productCrumb,
          {
            name: '供应商产品审核'
          }
        ]
      }
    }
  },
  computed: {
    breadList() {
      if (!this.bread[this.currentHash]) {
        return []
      }
      return this.bread[this.currentHash]
    },
    currentHash() {
      return this.hash.replace(loginRedirect, '/')
    }
  }
}
</script>

<style>
</style>

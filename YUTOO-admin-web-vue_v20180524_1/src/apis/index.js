const ProductBaseAPI = require('./product_base')
const DashAPI = require('./dash')
const mainAPI = require('./main')
const categolryMAPI = require('./category_m')
const skuAPI = require('./platform_lists')
const sku1API = require('./sku_lists')
const shopAPI = require('./shop_lists')
const productPurchase = require('./product_purchase')
const productCategory = require('./product_category')
const storeProduct = require('./store_product')
const Product_src_develop = require('./Product_src_develop')

module.exports = Object.assign({},
  ProductBaseAPI,
  DashAPI,
  categolryMAPI,
  mainAPI,
  skuAPI,
  sku1API,
  productPurchase,
  productCategory,
  storeProduct,
  Product_src_develop,
  shopAPI
)
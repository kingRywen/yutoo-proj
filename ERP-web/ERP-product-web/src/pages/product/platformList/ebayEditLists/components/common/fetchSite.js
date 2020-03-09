import apis from 'apis'
import { fetchData, showToast } from 'common/common'
import { getQueryString } from 'common/util'
import { getTempList } from './fetch';

export default {
  data() {
    return {
      siteData: {},
      review: null,
      productPlatformId: null,
      productPltDetailId: null,
      isVariant: null,
      platformId: null
    }
  },
  created() {
    let platformId = getQueryString('platformId')
    if (platformId === 1 || platformId === 3) {
      return
    }
    
    // 审核模式，有审核提示
    this.review = getQueryString('review')
    
    // 平台产品id
    this.productPlatformId = getQueryString('productPlatformId')
    // 平台详情id
    this.productPltDetailId = getQueryString('productPltDetailId')
    
    this.initData()
  },
  methods: {
    initData() {
      Promise.all([this.getLangData(), this.getSiteInfo()]).then(res => {
        if (res.every(data => data.code === 0)) {
          // 获取到语种 站点信息
          const [infoRes, siteRes] = res
          const infoData = infoRes.rows
          // 处理语种信息，初始化
          const { languageInfos, defaultFlag, id } = infoData
          this.info = languageInfos
          this.languageId = id
          if (!this.review) {
            if (id) {
              this.name = '平台信息'
            } else {
              this.name = '图片'
            }
          }
          
          // this.showTab = true
    
          // 传递站点信息
          siteRes.siteList &&
            siteRes.siteList.forEach(site => {
              let { siteCategoryInfo, categoryId } = site.siteInfo
              siteCategoryInfo = siteCategoryInfo ? siteCategoryInfo.split(',').map(el => +el) : []
              site.siteInfo.tempList = []
              site.siteInfo.selectedCate = siteCategoryInfo
              site.siteInfo.selectedCate1 = null
              if (siteCategoryInfo.length) {
                getTempList(categoryId, site)
              }
            })
          this.siteData = siteRes
        } else {
          showToast('error', '初始化数据失败，请刷新重试')
        }
      })
    },
    
    // 获取站点信息
    getSiteInfo() {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_SITE_INFO,
        data: {
          parentFlag: this.isVariant ? 0 : 1,
          productPltDetailId: this.productPltDetailId
        }
      }).then(res => res.data)
    },
    // 获取语种信息
    getLangData() {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_LANGUAGE_LIST,
        data: {
          productPlatformId: this.productPlatformId,
          type: 1
        }
      }).then(res => res.data)
    },
  },
};

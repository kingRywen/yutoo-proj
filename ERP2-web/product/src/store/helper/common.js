import {
  mapActions,
  mapState
} from 'vuex';

export const commonMxd = mapActions('common', ['getPlatList', 'getSiteByPlatId', 'getVariantList', 'getShopList', 'getLangList'])
export const commonCptd = {
  ...mapState('common', ['platList', 'siteList', 'variantList', 'shopList', 'langList'])
}
export const langList = mapState('common', ['langList'])
export const getLang = mapActions('common', ['getLangList'])
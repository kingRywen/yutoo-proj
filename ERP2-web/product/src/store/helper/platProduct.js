import { mapMutations, mapState, mapActions } from 'vuex';

export const platProductMut = mapMutations('product/platProduct', ['setSite'])
export const platProductAct = mapActions('product/platProduct', ['getButtedSiteList'])
export const platProductComputed = {
  ...mapState('product/platProduct', ['buttedSiteList','selectedSite']),
}
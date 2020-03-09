import Vue from "vue";

export const state = {
  info: {
    platformId: null,
    siteId: null
  },
  allData: [],
  // 当前站点下的店铺
  curStoreList: [],
  otherData: {}
};
export const getters = {
  currentSite(state, getters) {
    // console.log(state.allData);

    if (state.allData.length && getters.currentPlat.sites) {
      return getters.currentPlat.sites.find(
        el => el.siteId == state.info.siteId
      );
    } else {
      return {};
    }
  },
  currentPlat(state) {
    if (state.allData.length) {
      let ret = state.allData.find(
        el => el.platformId == state.info.platformId
      );
      ret.sites.forEach(e => {
        e.label = e.siteName;
        e.value = e.siteId;
      });
      return ret;
    } else {
      return {};
    }
  }
};
export const mutations = {
  setInfo(state, val) {
    Vue.prototype.$storage.set("local", "storeInfo.info", val);
    state.info = val;
  },
  setAllData(state, val) {
    state.allData = val;
  },
  setOtherData(state, val) {
    state.otherData = val;
  },
  setStoreList(state, val) {
    state.curStoreList = val;
  }
};

export const actions = {
  async getStoreList({ commit, state }, { platformId, siteId } = {}) {
    platformId = platformId || state.info.platformId;
    siteId = siteId || state.info.siteId;
    return GLOBAL.ajax["shopAuth/sellerAuthListToSeller"]({
      platformId,
      siteId
    }).then(data => {
      data = data.data.map(el => ({
        label: el.sellerAlias,
        value: el.sellerId
      }));
      commit("setStoreList", data);
      return data;
    });
  }
};

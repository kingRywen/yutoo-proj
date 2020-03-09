export const state = {
  curSiteId: null,
  curSite: {}
};

export const mutations = {
  setSiteId(state, payload) {
    state.curSiteId = payload.siteId;
    state.curSite = payload;
  }
};

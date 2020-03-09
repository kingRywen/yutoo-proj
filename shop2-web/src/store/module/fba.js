export const state = {
  // 运输方式列表
  transportList: []
};
export const mutations = {
  setTransportList(state, data) {
    state.transportList = data;
  }
};
export const actions = {
  async getTransportList({ commit }) {
    return GLOBAL.ajax[`fba/FbaReplenishTransportList`]({ a: 1 }).then(data => {
      data = data.list.map(el => ({
        label: el.name,
        value: el.id
      }));
      commit("setTransportList", data);
      return data;
    });
  }
};

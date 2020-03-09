// initial state
export const state = {
  saveWork_loading: false,
  previewWork_loading: false,
  fetchWorks_loading: false,
  setWorkAsTemplate_loading: false,
  fetchWorkTemplates_loading: false,
  useTemplate_loading: false,
  uploadWorkCover_loading: false
};

// getters
export const getters = {};

// actions
export const actions = {
  update({ commit }, payload) {
    commit("update", payload);
  }
};

// mutations
export const mutations = {
  update(state, { type, payload }) {
    state[type] = payload;
  }
};

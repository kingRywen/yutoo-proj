import { loadLanguageAsync } from "@/locales";

export const state = {
  lang: "zh-CN"
};
export const mutations = {
  SET_LANG: (state, lang) => {
    state.lang = lang;
  }
};
export const actions = {
  // 设置界面语言
  SetLang({ commit }, lang) {
    return new Promise(resolve => {
      commit("SET_LANG", lang);
      loadLanguageAsync(lang);
      resolve();
    });
  }
};

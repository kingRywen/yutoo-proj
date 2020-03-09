import Vue from "vue";
const storage = Vue.prototype.$storage;

const userInfo = storage.get("local", "auth.userInfo") || {
  username: "anonymous"
};
const cache = userInfo.keywordlib_cache || (userInfo.keywordlib_cache = {});

/**
 *
 * @param {String} key 缓存的key
 * @param {String} val 缓存的value
 * @param {Number} id 要缓存的分类
 */
export function setLibCache(key, val, id) {
  let groupCache = getGroupCache(id);
  groupCache[key] = val;
  storage.set("local", "auth.userInfo", userInfo);
}

export function getGroupCache(id) {
  let userCache = cache[userInfo.username] || (cache[userInfo.username] = {});
  let groupCache = userCache[id] || (userCache[id] = {});
  return groupCache;
}

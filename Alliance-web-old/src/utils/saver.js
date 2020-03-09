const storage = {
  local: localStorage,
  session: sessionStorage,
  host: !process.env.VUE_APP_TEST ? 'YUTOO.ALLIANCE' : 'YUTOO.ALLIANCE_TEST',
  get(type, name) {
    const item = this[type].getItem(this.host + '_' + name)
    return !item ? null : JSON.parse(item)
  },
  set(type, name, val) {
    return this[type].setItem(this.host + '_' + name, JSON.stringify(val))
  },
  remove(type, name) {
    return this[type].removeItem(this.host + '_' + name)
  },
  clear(type) {
    return this[type].clear()
  }
}

export default storage
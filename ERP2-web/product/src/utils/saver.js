const storage = {
    local: localStorage,
    session: sessionStorage,
    host: window.location.host,
    get(type, name) {

        const item = this[type].getItem(this.host + '_' + name)
        if (item === 'undefined') {
            return undefined
        }
        if (item === 'null') {
            return null
        }
        return !item ? null : JSON.parse(item)
    },
    set(type, name, val) {
        if (val == null) {
            return
        }
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
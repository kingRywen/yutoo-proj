const MAP = {
    local: localStorage,
    session: sessionStorage
}

export default class Storage {
    constructor(name) {
        this.host = name || window.location.host
    }
    get(type, name) {
        const item = MAP[type].getItem(this.host + '_' + name)
        if (item === 'undefined') {
            return undefined
        }
        if (item === 'null') {
            return null
        }
        return !item ? null : JSON.parse(item)
    }
    set(type, name, val) {
        if (val == null) {
            return
        }
        return MAP[type].setItem(this.host + '_' + name, JSON.stringify(val))
    }
    remove(type, name) {
        return MAP[type].removeItem(this.host + '_' + name)
    }
    clear(type) {
        return MAP[type].clear()
    }
};
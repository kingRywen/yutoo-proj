class MakeConst {
    constructor(options) {
        this.const = {}
        this.constBuilder(options)
    }


    constBuilder({
        sep = '/',
        config = []
    }) {
        Object.keys(config).map(namespace => {
            this._constSingleBuilder({
                namespace,
                sep,
                config: config[namespace]
            })
        })
    }

    _constSingleBuilder({
        namespace,
        sep = '/',
        config = {}
    }) {
        config.forEach(cst => {
            let {
                name,
                value
            } = cst
            let constName = `${namespace.toUpperCase()}${sep}${name}`
            Object.defineProperty(this.const, constName, {
                value
            })
        })

    }
}

export default MakeConst
function bindMethods() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        .map(key => {
            if (this[key] instanceof Function && key !== 'constructor')
                this[key] = this[key].bind(this)
        })
}

module.exports = { bindMethods };

function bindMethods() {
    Object.getOwnPropertyNames(Object.getPrototypeOf(this))
        .map(key => {
            if (this[key] instanceof Function && key !== 'constructor')
                this[key] = this[key].bind(this)
        })
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

module.exports = {bindMethods, swap};

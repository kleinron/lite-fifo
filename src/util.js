/**
 * @return {void}
 */
function bindMethods () {
  Object.getOwnPropertyNames(Object.getPrototypeOf(this))
    .map(key => {
      if (this[key] instanceof Function && key !== 'constructor') { this[key] = this[key].bind(this); }
      return undefined;
    });
}

/**
 * @param {any[]} arr
 * @param {number} i
 * @param {number} j
 * @return {void}
 */
function swap (arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

module.exports = { bindMethods, swap };

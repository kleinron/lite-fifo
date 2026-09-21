/**
 * Bind all prototype methods of `this` to the instance.
 * Internal helper; not part of the public API.
 *
 * Implemented as a function expression so TypeScript does not emit a
 * constructor/class declaration for this helper.
 *
 * @this {{ [key: string]: any }}
 * @returns {void}
 */
const bindMethods = function bindMethods () {
  const self = this;
  Object.getOwnPropertyNames(Object.getPrototypeOf(self))
    .map(key => {
      if (self[key] instanceof Function && key !== 'constructor') { self[key] = self[key].bind(self); }
      return undefined;
    });
};

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

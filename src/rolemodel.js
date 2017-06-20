const flatten = require('flat')

const getRights = Symbol('getRights')
const getModel = Symbol('getModel')

/**
 *
 * @param {string} rawName
 */
const role = rawName => (impl, modl) => {
  if (!Array.isArray(impl)) {
    throw new TypeError(`Impl expects array, got ${typeof impl}`)
  }
  if (Array.isArray(modl) || typeof modl !== 'object') {
    throw new TypeError(`Modl expects object, got ${Array.isArray(modl) ? 'array' : typeof modl}`)
  }

  const name = String.raw(rawName)
  const short = flatten(modl)
  const model = Object.assign(
    {},
    impl.reduce(
      (all, current) => Object.assign({}, current[getModel](), all, current[getRights]()),
      {}
    ),
    short
  )

  return {
    is(target) {
      return name === target
    },
    can(right) {
      return model[right] === true
    },
    has(right) {
      return typeof model[right] !== 'undefined'
    },
    [getRights]() {
      return Object.assign({}, short)
    },
    [getModel]() {
      return Object.assign({}, model)
    },
  }
}

module.exports = { role }

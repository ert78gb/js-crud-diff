/**
 * Create a difference of 2 object
 * @param obj1 - before object
 * @param obj2 - after object
 * @returns {*}
 */
function diff (obj1, obj2) {
  if (isFunction(obj1) || isFunction(obj2)) {
    throw new Error('Invalid argument. Function given, object expected.')
  }

  if (isValue(obj1) || isValue(obj2)) {
    if (obj1 === obj2) { return null }

    if (isUndefined(obj1)) {
      return {
        created: obj2
      }
    }

    if (isUndefined(obj2)) {
      return {
        deleted: obj1
      }
    }

    return {
      before: obj1,
      after: obj2
    }
  }

  let diffValue = null

  for (const key in obj1) {
    if (isFunction(obj1[key])) {
      continue
    }

    let value2
    if (!isUndefined(obj2[key])) {
      value2 = obj2[key]
    }

    const diffs = diff(obj1[key], value2)
    if (diffs) {
      if (!diffValue) { diffValue = {} }
      diffValue[key] = diffs
    }
  }

  for (const key in obj2) {
    if (isFunction(obj2[key]) || !isUndefined(obj1[key])) {
      continue
    }

    const diffs = diff(undefined, obj2[key])
    if (diffs) {
      if (!diffValue) diffValue = {}
      diffValue[key] = diffs
    }
  }

  return diffValue
}

function isFunction (o) {
  return o && typeof o === 'function'
}

function isObject (o) {
  return o && typeof o === 'object'
}

function isValue (value) {
  return value === undefined || (!isObject(value) && !Array.isArray(value))
}

function isUndefined (o) {
  return typeof o === 'undefined'
}

module.exports = exports = diff

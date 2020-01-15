const chai = require('chai')
const diff = require('../src').diff

const expect = chai.expect

const noop = () => {}

describe('js-crud-diff', () => {
  describe('should throw error when', () => {
    it('both object function', () => {
      errorTester(noop, noop)
    })

    it('one of the objects is function', () => {
      errorTester(null, noop)
      errorTester(noop, null)
      errorTester(noop, '')
      errorTester('', noop)
    })
  })

  describe('should return null when', () => {
    it('both object null', () => {
      tester(null, null, null)
    })

    it('both object undefined', () => {
      tester(undefined, undefined, null)
    })

    it('both object empty object', () => {
      tester({}, {}, null)
    })

    it('both object empty object', () => {
      tester({}, {}, null)
    })

    it('both object same number', () => {
      tester(1, 1, null)
    })

    it('both object 0', () => {
      tester(0, 0, null)
    })
    it('both object same string', () => {
      tester('s', 's', null)
    })

    it('both object empty string', () => {
      tester('', '', null)
    })

    it('both object true', () => {
      tester(true, true, null)
    })

    it('both object false', () => {
      tester(false, false, null)
    })
  })

  describe('should return "created"', () => {
    it('when new object has a number property', () => {
      tester({}, {a: 0}, {a: {created: 0}})
    })

    it('when old is undefined and new object has a number property', () => {
      tester(undefined, {a: 0}, {created: {a: 0}})
    })

    it('when new object has a string property', () => {
      tester({}, {a: ''}, {a: {created: ''}})
    })

    it('when old is undefined and new object has a string property', () => {
      tester(undefined, {a: ''}, {created: {a: ''}})
    })

    it('when new object has a boolean property', () => {
      tester({}, {a: true}, {a: {created: true}})
    })

    it('when old is undefined and new object has a boolean property', () => {
      tester(undefined, {a: true}, {created: {a: true}})
    })
  })

  describe('should return "deleted"', () => {
    it('when new object deleted a number property', () => {
      tester({a: 0}, {}, {a: {deleted: 0}})
    })

    it('when old property is number new object is undefined', () => {
      tester({a: 0}, undefined, {deleted: {a: 0}})
    })

    it('when new object deleted a string property', () => {
      tester({a: ''}, {}, {a: {deleted: ''}})
    })

    it('when old property is string new object is undefined', () => {
      tester({a: ''}, undefined, {deleted: {a: ''}})
    })
    it('when new object deleted a booleand property', () => {
      tester({a: true}, {}, {a: {deleted: true}})
    })

    it('when old property is boolean new object is undefined', () => {
      tester({a: true}, undefined, {deleted: {a: true}})
    })
  })

  describe('should return with "before", "after" values', () => {
    it('when old value is number and new value is null', () => {
      tester({a: 0}, null, {before: {a: 0}, after: null})
    })

    it('when old value is string and new value is null', () => {
      tester({a: ''}, null, {before: {a: ''}, after: null})
    })

    it('when old value is boolean and new value is null', () => {
      tester({a: true}, null, {before: {a: true}, after: null})
    })

    it('when old value is number and new value is different number', () => {
      tester({a: 0}, {a: 1}, {a: {before: 0, after: 1}})
    })

    it('when old value is string and new value is different string', () => {
      tester({a: ''}, {a: 'a1'}, {a: {before: '', after: 'a1'}})
    })

    it('when old value is boolean and new value is different boolean', () => {
      tester({a: true}, {a: false}, {a: {before: true, after: false}})
    })

    it('when old value is boolean and new value is string', () => {
      tester({a: true}, {a: ''}, {a: {before: true, after: ''}})
    })

    it('when old value is boolean and new value is number', () => {
      tester({a: true}, {a: 0}, {a: {before: true, after: 0}})
    })

    it('when old value is number and new value is boolean', () => {
      tester({a: 0}, {a: false}, {a: {before: 0, after: false}})
    })

    it('when old value is number and new value is string', () => {
      tester({a: 0}, {a: ''}, {a: {before: 0, after: ''}})
    })

    it('when old value is string and new value is number', () => {
      tester({a: ''}, {a: 0}, {a: {before: '', after: 0}})
    })

    it('when old value is string and new value is booleand', () => {
      tester({a: ''}, {a: true}, {a: {before: '', after: true}})
    })
  })

  describe('handle nested properties', () => {
    it('should return null when two object same', () => {
      tester({a: {b: {c: ''}}}, {a: {b: {c: ''}}}, null)
    })

    it('should return "created" when new nested property added', () => {
      tester({a: {b: {c: ''}}}, {a: {b: {c: '', d: {e: ''}}}}, {'a': {'b': {'d': {'created': {'e': ''}}}}})
    })

    it('should return "deleted" when nested property deleted', () => {
      tester({a: {b: {c: '', d: {e: ''}}}}, {a: {b: {c: ''}}}, {'a': {'b': {'d': {'deleted': {'e': ''}}}}})
    })

    it('should return "deleted", "created" when nested property change', () => {
      const obj1 = {a: {b: {c: '', d: {e: ''}}}}
      const obj2 = {a: {b: {c: '', d: {f: ''}}}}
      const expected = {
        a: {
          b: {
            d: {
              e: {deleted: ''},
              f: {created: ''}
            }
          }
        }
      }

      tester(obj1, obj2, expected)
    })
  })

  it('should return "deleted", "created" when mixing', () => {
    const obj1 = {
      a: {
        b: {
          c: '',
          d: {
            e: '',
            g: ''
          }
        }
      },
      a2: {
        b2: '',
        c2: ''
      }
    }
    const obj2 = {
      a: {
        b: {
          c: '',
          d: {
            e: ''
          }
        },
        newProp: {
          a: ''
        }
      },
      a2: {
        b2: 'asa'
      }
    }

    const expected = {
      a: {
        b: {
          d: {
            g: {
              deleted: ''
            }
          }
        },
        newProp: {
          created: {
            a: ''
          }
        }
      },
      a2: {
        b2: {
          after: 'asa',
          before: ''
        },
        c2: {
          deleted: ''
        }
      }
    }

    tester(obj1, obj2, expected)
  })

  it.skip('should handle when old value was a function and new value is object', () => {
    const obj1 = {a: {b: noop}}
    const obj2 = {a: {b: {c: ''}}}
    const expected = {
      a: {
        b: {
          d: {
            e: {deleted: ''},
            f: {created: ''}
          }
        }
      }
    }

    tester(obj1, obj2, expected)
  })

  it.skip('should handle when old value was a object and new value is function', () => {
    const obj1 = {a: {b: {c: ''}}}
    const obj2 = {a: {b: noop}}
    const expected = {
      a: {
        b: {
          d: {
            e: {deleted: ''},
            f: {created: ''}
          }
        }
      }
    }

    tester(obj1, obj2, expected)
  })

  describe('handle array', () => {
    it('should return null when both object are empty array', () => {
        tester([], [], null)
      }
    )

    it('should return null when both object are same array', () => {
        tester([1], [1], null)
      }
    )

    it('should return deleted when element deleted', () => {
        tester([1, 2, 3], [1, undefined, 3], {1: {deleted: 2}})
      }
    )

    it('should return deleted when element deleted', () => {
        tester([1], [1, 2], {1: {created: 2}})
      }
    )
  })
})

function tester (obj1, obj2, expected) {
  expect(diff(obj1, obj2)).to.be.deep.equal(expected)
}

function errorTester (obj1, obj2) {
  expect(diff.bind(null, obj1, obj2)).to.throw('Invalid argument. Function given, object expected.')
}

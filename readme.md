js-crud-diff
============

Create a difference of the to object

```javascript

const before = {
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
    const after = {
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

    const difference = diff(before, after)
    // value of the difference
    // {
    //   a: {
    //     b: {
    //       d: {
    //         g: { // g deleted. original value was an empty string
    //           deleted: ''
    //         }
    //       }
    //     },
    //     newProp: { // newProp created with value {a: ''}
    //       created: {
    //         a: ''
    //       }
    //     }
    //   },
    //   a2: {
    //     b2: { // b2 modified
    //       after: 'asa', // new value
    //       before: '' // original value
    //     },
    //     c2: { // c2 deleted original value was an empty string
    //       deleted: ''
    //     }
    //   }
    // }

```

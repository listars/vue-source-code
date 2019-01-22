// 判断是否是对象
function isObject (obj) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

// 视图更新触发的方法
function update () {
  console.log('🎉update success')
}

// 封装Object.defineProperty，使传进来的对象绑定get和set方法
function updateReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function () {
      return val
    },
    set: function (newVal) {
      if (newVal === val) return

      update()
    }
  })
}

// 封装观察者方法，对传进去的value每一个属性进行处理，使其做到「响应式」
function observer (value) {
  if (!value && !isObject(value)) {
    console.warn('⚠️请传入对象')
    return
  }

  Object.keys(value).forEach(key => updateReactive(value, key, value[key]))
}

export default class Vue {
  constructor(options) {
    this.$data = options.data
    observer(this.$data)
  }
}
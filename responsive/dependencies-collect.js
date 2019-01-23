function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

// 定义一个订阅者方法存放Watcher对象，和通知视图更新
class Dep {
  constructor () {
    this.subs = []
  }

  // 在subs中添加一个新的Watcher对象
  addSubs (sub) {
    this.subs.push(sub)
  }

  // 通知每一个Watcher对象更新
  notify () {
    this.subs.forEach(sub => sub.update())
  }
}

// 定义一个观察者类，触发更新视图
class Watcher {
  constructor () {
    // new Watcher对象的时候将该对象赋值给Dep.target，updateReactive触发get的时候用到
    Dep.target = this
  }

  update () {
    console.log('🎉watcher触发update啦')
  }
}

function updateReactive (obj, key, val) {
  // 定义一个Dep类来收集Watcher对象
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // get方法被触发的时候会把Watcher对象存放到Dep.target并把它收集到Dep类中
      dep.addSubs(Dep.target)
      return val
    },
    set: function reactiveSetter (newVal) {
      if (newVal === val) return
      val = newVal
      // set方法通过触发notify来通知所有Watcher对象使用update方法更新视图
      dep.notify()
    }
  })
}

// 封装observer方法,对传进去的value每一个属性进行处理，使其做到「响应式」
function observer (val) {
  if (!val && !isObject(val)) {
    console.warn('⚠️请传入正确的值')
    return
  }

  Object.keys(val).forEach(key => updateReactive(val, key, val[key]))
}

class Vue {
  constructor (options) {
    this.$data = options.data
    observer(this.$data)

    new Watcher()
  }
}
import deepExtend from './deepExtend'

let util = {
  //对象深拷贝
  deepExtend: deepExtend,
  copy (obj) {//对象/数据的浅拷贝
    if (obj instanceof File) {
      return obj
    }
    if (obj == null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
      return obj

    let temp
    if (obj instanceof Date) {
      temp = new Date(obj.getTime())
      // temp = new obj.constructor() //or new Date(obj)
    } else {
      try {
        temp = obj.constructor()
      } catch (e) {
        temp = obj
      }
    }
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        obj['isActiveClone'] = null
        temp[key] = util.copy(obj[key])
        delete obj['isActiveClone']
      }
    }
    return temp
  },
  /*
  * 防抖：immediate 为false
  * 截流：immediate 为true
  **/
  debounce: function (func, wait, immediate) {
    var timeout
    return function () {
      var context = this,
        args = arguments
      var later = function () {
        timeout = null
        if (!immediate) return func.apply(context, args)
      }
      var callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) return func.apply(context, args)
    }
  }
}
export default util

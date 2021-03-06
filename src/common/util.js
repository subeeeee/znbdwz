let SIGN_REGEXP = /([yMdhsm])(\1*)/g
let DEFAULT_PATTERN = 'yyyy-MM-dd'
let hostname = window.location.hostname
function padding (s, len) {
  let length = len - (s + '').length
  for (let i = 0; i < length; i++) { s = '0' + s }
  return s
}

export default {
  getQueryStringByName: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    let context = ''
    if (r !== null) {
      context = r[2]
      reg = null
      r = null
      return context == null || context === '' || context === 'undefined' ? '' : context
    }
  },
  formatDate: {

    format: function (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length)
          case 'M':
            return padding(date.getMonth() + 1, $0.length)
          case 'd':
            return padding(date.getDate(), $0.length)
          case 'w':
            return date.getDay() + 1
          case 'h':
            return padding(date.getHours(), $0.length)
          case 'm':
            return padding(date.getMinutes(), $0.length)
          case 's':
            return padding(date.getSeconds(), $0.length)
        }
      })
    },
    parse: function (dateString, pattern) {
      let matchs1 = pattern.match(SIGN_REGEXP)
      let matchs2 = dateString.match(/(\d)+/g)
      if (matchs1.length === matchs2.length) {
        let _date = new Date(1970, 0, 1)
        for (let i = 0; i < matchs1.length; i++) {
          let _int = parseInt(matchs2[i])
          let sign = matchs1[i]
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int)
              break
            case 'M':
              _date.setMonth(_int - 1)
              break
            case 'd':
              _date.setDate(_int)
              break
            case 'h':
              _date.setHours(_int)
              break
            case 'm':
              _date.setMinutes(_int)
              break
            case 's':
              _date.setSeconds(_int)
              break
          }
        }
        return _date
      }
      return null
    }

  },

  // 设置cookie
  setCookie: function (name, value, expiremMinutes) {
    let exdate = new Date()
    exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ((expiremMinutes == null) ? '' : ';expires=' + exdate.toGMTString()) + ';domain=' + hostname + ';path=' + '/'
  },
  // 读取cookie
  getCookie: function (name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return (arr[2])
    } else {
      return null
    }
  },
  // 删除cookie
  delCookie: function (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = this.getCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';domain=' + hostname + ';path=' + '/'
    }
  }
}

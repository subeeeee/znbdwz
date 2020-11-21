// 电话格式验证
export const validateMobile = (rule, value, callback) => {
  let reg = /^1[0-9]{10}$/
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (!reg.test(value)) {
    callback(new Error('电话格式输入不正确'))
  } else {
    callback()
  }
}
// 14字符
export const validateWeChatMenuFourteen = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (value.replace(/[^\x00-\xff]/g, '**').length > 14) {
    callback(new Error(`长度控制在14个字符以内`))
  } else {
    callback()
  }
}
// 8字符
export const validateWeChatMenuEight = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (value.replace(/[^\x00-\xff]/g, '**').length > 8) {
    callback(new Error(`长度控制在4个汉字以内`))
  } else {
    callback()
  }
}
// 20字符必填
export const validateReferred = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (value.replace(/[^\x00-\xff]/g, '**').length > 20) {
    callback(new Error('长度控制在20个字符以内'))
  } else {
    callback()
  }
}
// 32字符必填
export const validateReferred1 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (value.replace(/[^\x00-\xff]/g, '**').length > 32) {
    callback(new Error('长度控制在32个字符以内'))
  } else {
    callback()
  }
}
// 64字符必填
export const validateReferred2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (value.replace(/[^\x00-\xff]/g, '**').length > 64) {
    callback(new Error('长度控制在64个字符以内'))
  } else {
    callback()
  }
}
// 固话或手机号验证
export const validateTelephone = (rule, value, callback) => {
  //手机号码
  // const reg1 = /^1[3|4|5|7|8|6|9][0-9]\d{8}$/
  // //固定电话号码
  // const reg2 = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
  //手机号码
  const reg1 = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/; 
  //固定电话号码
  const reg2 = /^([04][0-9]{2,3}\-?)([2-9][0-9]{6,7})+(\-?[0-9]{1,4})?$/;
  // console.info(reg1.test(value))
  // console.info(reg2.test(value))
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (!reg1.test(value)&&!reg2.test(value)) {
    callback(new Error('电话格式输入不正确，应为固话或手机号'))
  } else {
    callback()
  }
  // let reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$|^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0-9]))\d{8}$|^0\d{2,3}-?\d{7,8}$/
  // if (value === '') {
  //   callback(new Error('必填项不能为空'))
  // } else if (!reg.test(value)) {
  //   callback(new Error('电话格式输入不正确，应为固话或手机号'))
  // } else {
  //   callback()
  // }
}
// 60字符
export const lengthControl = (rule, value, callback) => {
  if (value && value.replace(/[^\x00-\xff]/g, '**').length > 60) {
    callback(new Error('长度控制在60个字符以内'))
  } else {
    callback()
  }
}
// 100字符
export const oneHundredLengthControl = (rule, value, callback) => {
  if (value && value.replace(/[^\x00-\xff]/g, '**').length > 100) {
    callback(new Error('长度控制在100个字符以内'))
  } else {
    callback()
  }
}
// number不可有小数点
export const validateNumberCarport = (rule, value, callback) => {
  var regNum = /^[0-9]+\.?[0-9]*$/
  if (value && !regNum.test(value)) {
    callback(new Error('此处必须为数字值'))
  } else if (value && (value.toString()).indexOf('.') !== -1) {
    callback(new Error('不可以含有小数点或其他字符'))
  } else {
    callback()
  }
}
// number
export const validateNumber = (rule, value, callback) => {
  var regNum = /^[0-9]+\.?[0-9]*$/
  if (value && !regNum.test(value)) {
    callback(new Error('此处必须为数字值'))
  } else {
    callback()
  }
}
// 小于100的整数
export const validateNumberPlotRate = (rule, value, callback) => {
  var regNum = /^[0-9]+\.?[0-9]*$/
  if (value && !regNum.test(value)) {
    callback(new Error('此处必须为数字值'))
  } else if (value < 0 || value > 99) {
    callback(new Error('0-99可保留两位小数'))
  } else {
    callback()
  }
}
// 001-999之间的数字
export const validatePatternNo = (rule, value, callback) => {
  var regPatternNo = /(?!0{3})\d{3}/
  if (value > 999 || !regPatternNo.test(value)) {
    callback(new Error('请输入001-999之间的数字'))
  } else {
    callback()
  }
}
// http 验证
export const validateHttpUrl = (rule, value, callback) => {
  let strRegex = '^((https|http|ftp|rtsp|mms)://)'
  let regHttpUrl = new RegExp(strRegex)
  if (rule.required && value === '') {
    callback(new Error('请输入地址'))
  } else if (value && !regHttpUrl.test(value)) {
    callback(new Error('地址格式错误'))
  } else {
    callback()
  }
}
export const promptInputUrlValidator = (url) => {
  let strRegex = '^((https|http|ftp|rtsp|mms)://)'
  // let strRegex = '^((https|http|ftp|rtsp|mms)://)' + '(([0-9a-z_!~*().&=+$%-]+: )?[0-9a-z_!~*().&=+$%-]+@)?' + '(([0-9]{1,3}.){3}[0-9]{1,3}' + '|' + '([0-9a-z_!~*()-]+.)*' + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + '[a-z]{2,6})' + '(:[0-9]{1,4})?' + '((/?)|' + '(/[0-9a-z_!~*().;?:@&=+$,%#-]+)+/?)$'
  let regHttpUrl = new RegExp(strRegex)
  if (regHttpUrl.test(url)) {
    return true
  } else {
    return false
  }
}

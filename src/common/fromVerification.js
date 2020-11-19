/* eslint-disable */
//2.验证金额11位，整数最多8位小数两位
export const validateMoney = (rule, value, callback) => {
  const exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
  if (value === '') {
    callback(new Error('请选择必填项'))
  } else if (!exp.test(value)) {
    callback(new Error('请填写正确金额'))
  } else {
    callback()
  }
}
//2.验证金额11位，整数最多8位小数两位
export const validateMoneyNoNull = (rule, value, callback) => {
  const exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/
  if (value === '') {
    callback()
  } else if (!exp.test(value)) {
    callback(new Error('请填写正确金额'))
  } else {
    callback()
  }
}

// 必选项
export const validateSelect = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请选择必填项'))
  } else {
    callback()
  }
}

// 50 字符
export const validateLength = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('必填项不能为空'))
  } else if (value.replace(/[^\x00-\xff]/g, '**').length > 50) {
    callback(new Error('长度控制在个50字符以内!'))
  } else {
    callback()
  }
}

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

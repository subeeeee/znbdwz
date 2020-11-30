import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { openLoading, closeLoading, resetloading } from './loading'
let baseURL = '/iCloud-rest/channel-manager'
let digital = '/iCloud-rest/digital-manager'
// 允许请求携带cookie  允许set-cookie
axios.defaults.withCredentials = true
// create an axios instance
const service = axios.create({
  baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})


// request interceptor
service.interceptors.request.use((config) => {
  if (!config.LOAD_ING) {
    openLoading()
  }
  return config
}, (error) => {
  if (!config.LOAD_ING) {
    resetLoading()
  }
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error)
})

// response interceptor
axios.interceptors.response.use((res) => {

  const status = res.data.status || res.data.code
  if (status === 400) {
    if (res.data.message.code === 3061) {
      const messageObject = JSON.parse(res.data.message.describeCn)
      let message = ''
      for (let key in messageObject) {
        message += '<p style="margin: 5px 0;">' + messageObject[key] + '</p>'
      }
      Message({
        message: message,
        dangerouslyUseHTMLString: true,
        type: 'error'
      })
    } else {
      Message({
        message: res.data.message.describeCn ? res.data.message.describeCn : res.data.message,
        type: 'error'
      })
    }
    resetLoading()
  } else if (status === 401) {
    sessionStorage.clear()
    window.close()
  } else if (status === 500) {
    resetLoading()
  } else {

    closeLoading()
    return res
  }
  return Promise.reject(res)
}, (error) => {
  // 响应失败 - 错误处理
  if (error && error.response) {
    if (error.response.status === 401) {
      let href = window.location.href
      if (!(href.split('/')[2].indexOf('localhost') > -1)) {
        if (href.indexOf('https://') > -1) {
          window.location.href = 'https://' + href.split('/')[2] + '/admin-tenant/'
        } else {
          window.location.href = 'http://' + href.split('/')[2] + '/admin-tenant/'
        }
      }
      closeLoading()
      return false
    }
    switch (error.response.status) {
      case 408:
        error.message = '网络超时'
        break
      case 504:
        error.message = '网络超时'
        break
      default:
        error.message = '网络异常'
    }
  } else {
    error.message = '网络异常'
  }
  // reset loading
  MessageBox.alert('请点击重试', error.message, {
    confirmButtonText: '重试',
    callback: action => {
      if (action === 'confirm') {
        window.location.reload()
      }
    }
  })
  return Promise.reject(error.message)
})

export default service

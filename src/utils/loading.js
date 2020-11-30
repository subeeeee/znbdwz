import { Loading } from 'element-ui'

let loadingCount = 0
let loadingInstance = null

const loadingOption = {
  lock: true,
  text: '努力加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.9)',
  zIndex: '50000'
}

export const openLoading = () => {
  if(loadingCount === 0) {
    loadingInstance = Loading.service(option)
  }
  loadingCount++
}

export const resetLoading = () => {
  loadingCount = 0
  loadingInstance.close()
}

export const closeLoading = () => {
  if(loadingCount > 1) {
    loadingCount--
  } else if(loadingCount === 1) {
    resetLoading()
  }
}

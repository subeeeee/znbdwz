import * as types from '../types.js'
let state = {
  isShowProgress: false,
  percentage: 0,
  info: ''
}
const actions = {
  [types.UPDATE_PROGRESS] ({commit}, progress) {
    commit(types.UPDATE_PROGRESS, progress)
  }
}
const getters = {
  [types.GET_PROGRESS] (state) {
    return state
  }
}
const mutations = {
  [types.UPDATE_PROGRESS] (state, progress) {
    state.isShowProgress = progress.isShowProgress
    state.percentage = progress.percentage
    state.info = progress.info
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

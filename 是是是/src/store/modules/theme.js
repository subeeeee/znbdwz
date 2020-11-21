import * as types from '../types.js'
const state = {
  colour: ''
}
const actions = {
  [types.UPDATE_COLOUR] ({commit}, theme) {
    commit(types.UPDATE_COLOUR, theme.colour)
  }
}
const getters = {
  [types.GET_COLOUR] (state) {
    return state.colour
  }
}
const mutations = {
  [types.UPDATE_COLOUR] (state, theme) {
    state.colour = theme.colour
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}

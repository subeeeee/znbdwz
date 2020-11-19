// 组装模块并导出 store 的文件
import Vue from 'vue'
import Vuex from 'vuex'
import loading from './modules/loading'
import progress from './modules/progress'
import theme from './modules/theme'

Vue.use(Vuex)
// 导出需要的模块

export default new Vuex.Store({
  modules: {
    loading,
    progress,
    theme
  }
})

<template>
  <div id="app"
       v-loading.fullscreen.lock="isLoading"
       element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <router-view />
    <div class="app_progress"
         v-if="progress.isShowProgress">
      <el-progress class="progress"
                   type="circle"
                   :percentage="progress.percentage * 1"></el-progress>
      <div class="progress_info">{{ progress.info }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  computed: mapGetters({
    isLoading: 'GET_LOADING_STATUS',
    progress: 'GET_PROGRESS'
  })
}
</script>

<style lang="scss">
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: #a0a0a0;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
  border-radius: 0px;
  background-color: #f0f2f3;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 4px;
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
/* 滑轨两头的监听按钮颜色 */
::-webkit-scrollbar-button {
  // background-color: #7c2929;
}
/* 横向滚动条和纵向滚动条相交处尖角的颜色 */
::-webkit-scrollbar-corner {
  background-color: #7c2929;
}
#app {
  width: 100%;
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303030;
  font-size: 14px;
}
.app_progress {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  z-index: 99999;
  position: absolute;
  .el-progress {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -63px;
    margin-top: -63px;
    z-index: 999999;
  }
  .el-progress__text {
    color: #fff !important;
  }
  .progress_info {
    width: 100%;
    text-align: center;
    color: #fff;
    position: absolute;
    top: 50%;
    margin-top: 83px;
  }
}
</style>

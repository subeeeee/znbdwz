<template>
  <div id="Home"
       class="home">
    <el-container>
      <el-header :style='{background: theme}'>
        <el-row class="tenantBox">
          <el-col class="tenant"
                  :span="12">
            <img v-if="userselfConfig['logo'] && userselfConfig['logo'] !='undefined' && userselfConfig['logo'] !='null'"
                 class="yuandianLogo"
                 @click='callbackIndex'
                 :src="OSS_BASE_URL + userselfConfig.logo">
            <i v-else
               class="yuandianLogo"
               @click='callbackIndex'></i>
            <em>营销服务平台</em>
          </el-col>
          <el-col :span="12">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <span class='userName'>{{ user.name || '' }}</span>
                <el-button class="share-button"
                           icon="el-icon-setting"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix"
                                  v-show='user && user.type === 0'>
                  换肤：<ThemePicker :user='user'></ThemePicker>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix"
                                  @click.native='logout'>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-container class="container_wrap">
        <el-aside>
          <el-row class='tenantMenu'>
            <!-- <el-col :span="24"
                    class='tenantLogoBox'>
              <div class="tenantLogo">
                <img v-if="userselfConfig['homeLogo'] && userselfConfig['homeLogo']!='undefined' && userselfConfig['homeLogo'] !='null'"
                     :src="OSS_BASE_URL + userselfConfig.homeLogo"
                     alt="">
                <img v-else
                     src="../../static/images/tenantLogo.png"
                     alt="">
              </div>
            </el-col> -->
            <el-col :span="24"
                    class='menuBox'>
              <el-menu router
                       :default-active="menuActive"
                       :collapse="isCollapse"
                       text-color="#303030"
                       class="el-menu-vertical-demo">
                <el-menu-item v-for="(item,index) in menuList"
                              :key="index"
                              :index="item.path">
                  <i class="iconfont"
                     :class="item.icon"></i>
                  <span slot="title">{{item.name}}</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
          <div class='isCollapseBox'>
            <i :class="isCollapse ? 'el-icon-arrow-left open' : 'el-icon-arrow-left collapse'"
               @click='isCollapse ? isCollapse = false : isCollapse = true'></i>
          </div>
        </el-aside>
        <el-main>
          <div class="wrapper">
            <div class="scroller">
              <el-row class="banner">
                <el-col :span="18">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <!-- <el-breadcrumb-item :to="{ path: '/home' }">线上售楼</el-breadcrumb-item> -->
                    <el-breadcrumb-item>线上售楼</el-breadcrumb-item>
                    <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
                <el-col :span="6"
                        v-if="routePath === '/sale/subscribe' || routePath === '/sale/customer'"
                        style="text-align:right">
                  <el-button size="mini"
                             type="primary"
                             style="margin: 12px 0 0 0;"
                             @click="exportExcel">{{routePath === '/sale/subscribe'?'导出认购记录':'导出客户'}}</el-button>
                </el-col>
              </el-row>
              <el-row class="router_view"
                      :class="{divider_wrap:routePath === '/sale/weex'}">
                <el-row class="projectSelect"
                        v-if="routePath !== '/sale/weex'">
                  <el-col :span="2"
                          class="title"
                          v-if='!user.type'>公司名称：</el-col>
                  <el-col style='padding-right: 20px;'
                          :span="6"
                          v-if='!user.type'>
                    <el-cascader :options="organization"
                                 :props="defaultProps"
                                 v-model='companyIds'
                                 @change='cascaderChange'
                                 placeholder="请选择公司"
                                 change-on-select
                                 style='width: 100%'></el-cascader>
                  </el-col>
                  <el-col :span="2"
                          class="title">项目名称：</el-col>
                  <el-col :span="6"
                          style='padding-right: 20px;'>
                    <el-select v-model="projectId"
                               placeholder="请选择项目"
                               @change='projectChange'>
                      <el-option v-for="item in projectData"
                                 :key="item.projectId"
                                 :label="item.referred"
                                 :value="item.projectId">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="3"
                          v-if="routePath === '/sale/subscribe'"
                          class="title">签约认购状态：</el-col>
                  <el-col :span="5"
                          v-if="routePath === '/sale/subscribe'">
                    <el-select v-model="subscribeStatus"
                               placeholder="请选择签约认购状态"
                               @change='subscribeChange'>
                      <el-option v-for="item in subscribeStatusList"
                                 :key="item.key"
                                 :label="item.name"
                                 :value="item.key">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-divider></el-divider>
                <transition name="fade"
                            mode="out-in">
                  <router-view ref='routerView'
                               :user="user"
                               class="content_wrap"
                               :projectId="projectId"
                               :companyId="companyId"
                               :projectNameActive='projectNameActive'
                               :appList="appList"
                               v-on:getCompanyEmit="getCompany">
                  </router-view>
                </transition>
              </el-row>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import LabelTitle from '../components/LabelTitle'
import ThemePicker from '@/components/ThemePicker'
import util from '../common/js/util.js'
import * as BASE_URL from '../common/js/ossBaseUrl.js'
import {
  requestProjectList,
  requestManagerProjectList,
  requestOrganizationList,
  isLoginApp,
  isLoginAppPort,
  isLoginHouseInspection,
  requestAuthAppsGet,
  requestWebsiteConfigGet,
  requestAuthorizedApplicationGet
} from '../store/fetch/api'
import { mapGetters } from 'vuex'
import { toTreeData } from '../common/js/toTreeData'

export default {
  name: 'Home',
  watch: {
    $route: 'changeNav'
  },
  data () {
    return {
      user: '',
      origin: '',
      isCollapse: false,
      menuActive: '',
      projectNameActive: '',
      companyName: '',
      projectData: '',
      companyData: [],
      organization: [],
      companyId: '',
      companyIds: [],
      projectId: '',
      appList: [],
      OSS_BASE_URL: BASE_URL.OSS_BASE_URL,
      tenantId: '',
      userselfConfig: {
        banner: '',
        homeLogo: '',
        loginBack: '',
        logo: ''
      },
      defaultProps: {
        label: 'referred',
        value: 'companyId'
      },
      menuList: [
        //   {
        //   key: 'home',
        //   name: '线上售楼',
        //   path: '/home',
        //   icon: 'icon-shouye'
        // }, 
        {
          key: 'flow',
          name: '认购流程配置',
          path: '/sale/flow',
          icon: 'icon-shouye'
        }, {
          key: 'sign',
          name: '签约配置',
          path: '/sale/sign',
          icon: 'icon-xiangmuguanli'
        }, {
          key: 'pay',
          name: '支付配置',
          path: '/sale/pay',
          icon: 'icon-huodongguanli-jiagekongzhi'
        }, {
          key: 'weex',
          name: '小程序配置',
          path: '/sale/weex',
          icon: 'icon-xiaoshoutuanduiguanli'
        }, {
          key: 'customer',
          name: '客户预约管理',
          path: '/sale/customer',
          icon: 'icon-yonghuguanli'
        }, {
          key: 'subscribe',
          name: '认购管理',
          path: '/sale/subscribe',
          icon: 'icon-fangyuanguanli'
        }],
      currentPathName: '',
      subscribeStatus: null,
      subscribeStatusList: [{
        key: null,
        name: '全部'
      }, {
        key: 0,
        name: '已取消'
      }, {
        key: 1,
        name: '认购中'
      }, {
        key: 5,
        name: '已完成'
      }]
    }
  },
  components: {
    LabelTitle,
    ThemePicker
  },
  computed: mapGetters({
    theme: 'GET_COLOUR'
  }),
  created () {
    if (util.getCookie('tenantManger')) {
      this.originAdminOpen = window.location.origin + '/admin-open/#/index'
      this.originAdminMaterial = window.location.origin + '/admin-material/#/index'
      this.originAdminCustomer = window.location.origin + '/admin-customer/#/index'
      this.originAdminInspection = window.location.origin + '/admin-inspection/#/'
      this.originAdminNewCase = window.location.origin + '/digital-manager/#/'
      this.user = JSON.parse(unescape(util.getCookie('tenantManger')))
      this.changeNav()
      if (this.user.type) {
        this.getManagerProjectList()
        this.getManagerCompanyList()
        this.getManagerApps()
        sessionStorage.setItem('companyId', this.user.companyId)
      } else {
        this.getCompany()
        this.getTenantsApps()
      }
      let timer = null
      timer = setInterval(() => {
        if (this.projectId && this.$refs.routerView) {
          clearInterval(timer)
          if (this.projectData) {
            this.projectData.forEach((project) => {
              if (project.projectId === this.projectId) {
                this.projectNameActive = project.referred
              }
            })
          }
        }
      }, 100)
    } else {
      this.$router.push('/')
      this.$message.info('登录失效，请重新登录')
    }
  },
  methods: {
    locationTo (url) {
      window.open(window.location.origin + url)
    },
    // 获取集团管理员已授权应用
    async getTenantsApps () {
      let res = await requestAuthAppsGet({
        tenantId: this.user.tenantId
      })
      this.appList = res.data
    },
    // 获取项目管理员已授权应用
    async getManagerApps () {
      const result = await requestAuthorizedApplicationGet({
        managerId: this.user.managerId
      })
      this.appList = result.data
    },
    cascaderChange () {
      sessionStorage.setItem('companyIds', this.companyIds)
      this.companyId = this.companyIds[this.companyIds.length - 1]
      this.companyChange(this.companyId)
    },
    companyChange (companyId) {
      sessionStorage.setItem('companyId', companyId)
      sessionStorage.removeItem('projectId')
      this.$refs.routerView.projectId = ''
      this.projectData = []
      this.projectId = null
      this.projectNameActive = null
      if (this.routePath === '/home/housingManage') {
        this.$refs.routerView.buildings = []
        this.$refs.routerView.tableData = []
      } else if (this.routePath === '/home/salesTeamManage' || this.routePath === '/home/marketingTeamManage') {
        if (this.routePath === '/home/salesTeamManage') {
          this.$refs.routerView.dispatchersList = null
        }
        this.$refs.routerView.teamsSaleManageList = null
        this.$refs.routerView.teams = null
        this.$refs.routerView.saleManageList = null
        this.$refs.routerView.groupList = null
      } else if (this.routePath === '/home/memberManage' || this.routePath === '/home/marketingMemberManage') {
        this.$refs.routerView.tableData = []
      } else if (this.routePath === '/home/agencyTeamManage') {
        this.$refs.routerView.teams = null
        this.$refs.routerView.generalAgents = null
        this.$refs.routerView.shops = null
      }
      this.getProject()
    },
    projectChange (projectId) {
      sessionStorage.setItem('projectId', projectId)
      this.projectData.map((project, index) => {
        if (project.projectId === projectId) {
          this.projectNameActive = project.referred
          this.tenantId = this.projectData[index]['tenantId']
        }
      })
      if (this.routePath.startsWith('/sale/')) {
        this.$refs.routerView.projectId = projectId
        projectId && this.$refs.routerView.getInfo({
          projectId: projectId
        })
      }
      // else if (this.routePath === '/sale/sign') {
      //   projectId && this.$refs.routerView.getSignInfo({
      //     projectId: projectId
      //   })
      // }
    },
    // 获取公司
    async getCompany () {
      const companyParams = {
        tenantId: this.user.tenantId,
        deleteFlag: 0
      }
      const result = await requestOrganizationList(companyParams)
      this.companyData = result.data.result
      this.companyId = sessionStorage.getItem('companyId')
      this.companyIds = sessionStorage.getItem('companyIds') ? sessionStorage.getItem('companyIds').split(',') : []
      const attributes = { id: 'id', companyId: 'companyId', parentId: 'parentId', name: 'referred', type: this.user.type }
      this.organization = toTreeData(this.companyData, attributes)
      this.findChildren(this.organization)
      if (this.companyId) {
        this.getProject()
      }
      this.companyName = this.organization[0].referred
    },
    // 获取项目
    async getProject () {
      const projectParams = {
        tenantId: this.user.tenantId,
        companyId: this.companyId,
        deleteFlag: 0,
        status: 1
      }
      const result = await requestProjectList(projectParams)
      this.projectData = result.data.result
      this.projectId = sessionStorage.getItem('projectId')
    },
    async getManagerProjectList () {
      const result = await requestManagerProjectList({ managerId: this.user.managerId })
      this.projectData = result.data
      this.projectId = sessionStorage.getItem('projectId')
    },
    async getManagerCompanyList () {
      const companyParams = {
        tenantId: this.user.tenantId,
        deleteFlag: 0
      }
      const result = await requestOrganizationList(companyParams)
      result.data.result.forEach((company) => {
        if (company.type === 0) {
          this.companyName = company.referred
        }
      })
    },
    changeNav () {
      this.routePath = this.$route.path
      this.menuActive = this.$route.path
      let path = this.menuList.filter(item => item.path === this.menuActive)
      path.length && (this.currentPathName = path[0]['name'])
    },
    logout () {
      // debugger
      this.$confirm('<h3>确定退出登录吗?</h3>', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
        dangerouslyUseHTMLString: true
      }).then(() => {
        util.delCookie('tenantManger')
        // util.deleteAllCookies()
        sessionStorage.clear()
        localStorage.clear()
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        setTimeout(() => {
          this.$router.push('/')
        }, 300)
      }).catch((res) => {
        console.log(res)
      })
    },
    async loginApp (url) {
      const params = { '_datatype': 'text', '_param': { 'Account': 'admin', 'Pwd': 'c8837b23ff8aaa8a2dde915473ce0991' } }
      if (url === 'https://yxf1.juzhouyun.com:4443/View/Site/CaseIndex.html') {
        await isLoginApp(params)
      } else if (url === 'https://yxf1.juzhouyun.com:5443/View/Home/Index.html') {
        await isLoginAppPort(params)
      } else {
        await isLoginHouseInspection({ '_datatype': 'text', '_param': { 'Account': 'superadmin', 'Pwd': '123321' } })
      }
      this.windowBlank(url)
    },
    windowBlank (url) {
      let elink = document.createElement('a')
      elink.style.display = 'none'
      elink.href = url
      elink.target = '_blank'
      document.body.appendChild(elink)
      elink.click()
      document.body.removeChild(elink)
    },
    findChildren (source) {
      if (source && source.length) {
        for (let item of source) {
          if (item.children && item.children.length) {
            this.findChildren(item.children)
          } else {
            delete item.children
          }
        }
      }
    },
    caseIndexBlank () {
      this.loginApp('https://yxf1.juzhouyun.com:4443/View/Site/CaseIndex.html')
    },
    indexBlank () {
      this.loginApp('https://yxf1.juzhouyun.com:5443/View/Home/Index.html')
    },
    houseInspection () {
      this.loginApp('https://yxf1.juzhouyun.com:6443/View/Problem/QusIndex.html')
    },
    callbackIndex () {
      this.$router.push('/home')
    },
    subscribeChange () {
      this.$refs.routerView.getInfo({
        projectId: this.projectId,
        subscribeStatus: this.subscribeStatus
      })
    },
    exportExcel () {
      this.$refs.routerView.exportExcel()
    }
  },
  async mounted () {
    setTimeout(async () => {
      if (this.user.tenantId) {
        let res = await requestWebsiteConfigGet({
          tenantId: this.user.tenantId
        })
        if (res.data) {
          this.userselfConfig['banner'] = res.data['banner'] || ''
          this.userselfConfig['homeLogo'] = res.data['homeLogo'] || ''
          this.userselfConfig['logo'] = res.data['logo'] || ''
          this.userselfConfig['loginBack'] = res.data['loginBack'] || ''
          let keys = Object.keys(this.userselfConfig)
          keys.map(item => {
            localStorage.setItem(item, this.userselfConfig[item])
          })
        }
      }
      // this.userselfConfig['banner'] = localStorage.getItem('banner')
      // this.userselfConfig['homeLogo'] = localStorage.getItem('homeLogo')
      // this.userselfConfig['logo'] = localStorage.getItem('logo')
      // this.userselfConfig['loginBack'] = localStorage.getItem('loginBack')
    }, 300)
  }
}
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  .tenantMenu {
    height: 100%;
    .tenantLogoBox {
      min-height: 120px;
    }
    .menuBox {
      height: 100%;
      padding: 24px 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .projectSelect {
    margin-top: 16px;
    // border-bottom: 1px solid #e3e3e5;
    // padding-bottom: 24px;
  }
  .divider_wrap {
    .el-divider--horizontal {
      margin-top: 4px;
    }
  }
  .title {
    line-height: 30px;
    text-align: center;
  }
  .tenantLogo {
    width: 30%;
    height: auto;
    margin: 0 auto;
    margin-top: 35px;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .tenantTitle {
    display: block;
    width: 100%;
    height: 70px;
    line-height: 70px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-menu {
    background: none;
    border: none;
    margin: 0 auto;
    // .is-active {
    //   background: #0F8BE6;
    // }
    .el-submenu {
      background: none;
    }
    .is-opened {
      background: none;
    }
    .el-menu-item {
      span {
        width: 100px;
        text-align: left;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .el-submenu {
      .el-menu-item {
        padding-left: 80px !important;
      }
      .el-submenu__title {
        span {
          width: 100px;
          text-align: left;
          display: inline-block;
          padding-left: 10px;
        }
      }
      .el-menu {
        .icon-dian {
          font-size: 6px;
          display: inline-block;
          transform: scale(0.4, 0.4);
        }
      }
    }
  }
  .el-menu-vertical-demo {
    width: 250px;
  }
  .el-menu--collapse {
    width: 64px !important;
  }
  .tenantBox {
    height: 100%;
    .userName {
      color: #fff;
      font-size: 14px;
      position: relative;
      top: -3px;
    }
    .tenant {
      height: 100%;
      text-align: left;
      i.yuandianLogo {
        width: 150px;
        height: 35px;
        background: url("../../static/images/logo.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        &:hover {
          cursor: pointer;
        }
      }
      img.yuandianLogo {
        width: 150px;
        height: 35px;
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        margin: auto 0;
        &:hover {
          cursor: pointer;
        }
      }
      span {
        color: #fff;
        font-size: 22px;
        font-weight: bold;
        line-height: 100px;
        padding-left: 130px;
      }
      em {
        display: block;
        height: 30px;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        line-height: 30px;
        margin-left: 170px;
        padding-left: 20px;
        margin-top: 15px;
        font-style: normal;
        border-left: 2px solid #fff;
      }
    }
    .el-dropdown {
      float: right;
      margin-top: 14px;
    }
    .share-button {
      background: none;
      border: none;
      color: #fff;
      font-size: 22px;
    }
  }
}
.home > .el-container {
  width: 100%;
  height: 100%;
}

.container_wrap {
  height: calc(100% - 60px);
}

.el-header {
  width: 100%;
  height: 60px !important;
  background: url("../../static/images/headerBg.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
}

.el-aside {
  width: auto !important;
  max-width: 250px !important;
  background-color: #f7f7f7;
  text-align: center;
  position: relative;
  overflow: inherit;
  .el-icon-arrow-left {
    width: 12px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    font-weight: bold;
    font-size: 12px;
    &:hover {
      cursor: pointer;
    }
  }
  .isCollapseBox {
    width: 12px;
    height: 26px;
    position: absolute;
    background: #f7f7f7;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    top: 0;
    bottom: 0;
    right: -12px;
    margin: auto 0;
  }
  .collapse {
    transform: rotate3d(0, 0, 1, 0deg);
    transition: transform 0.5s;
  }
  .open {
    transform: rotate3d(0, 0, 1, 180deg);
    transition: transform 0.5s;
  }
}

.el-main {
  // max-width: 1360px;
  padding: 10px 20px 0 16px;
  .scroller {
    padding-bottom: 100px;
    padding: 0 0 0 12px;
    .el-breadcrumb {
      line-height: 50px;
      border: none;
      padding-left: 0;
      &:before {
        width: 0;
      }
    }
  }
  .content_wrap {
    padding: 0px;
  }
}

body > .el-container {
  margin-bottom: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

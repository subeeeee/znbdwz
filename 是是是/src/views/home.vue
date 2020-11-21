<template>
  <div id="Home" class="home">
    <el-container>
      <el-header :style='{background: theme}'>
        <el-row class="tenantBox">
          <el-col class="tenant" :span="12">
            <img v-if="userselfConfig['logo'] && userselfConfig['logo'] !='undefined' && userselfConfig['logo'] !='null'" class="yuandianLogo" @click='callbackIndex'  :src="OSS_BASE_URL + userselfConfig.logo">
            <i v-else class="yuandianLogo" @click='callbackIndex'></i>
            <em>营销服务平台</em>
          </el-col>
          <el-col :span="12">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <span class='userName'>{{ user.name || '' }}</span>
                <el-button class="share-button" icon="el-icon-setting"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="clearfix" v-show='user && user.type === 0'>
                  换肤：<ThemePicker :user='user'></ThemePicker>
                </el-dropdown-item>
                <el-dropdown-item class="clearfix" @click.native='logout'>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-header>
      <el-container style='height: 100%;'>
        <el-aside>
          <el-row class='tenantMenu'>
            <el-col :span="24" class='tenantLogoBox'>
              <div class="tenantLogo">
                <img v-if="userselfConfig['homeLogo'] && userselfConfig['homeLogo']!='undefined' && userselfConfig['homeLogo'] !='null'" :src="OSS_BASE_URL + userselfConfig.homeLogo" alt="">
                <img v-else src="../../static/images/tenantLogo.png" alt="">
              </div>
              <!-- <span class='tenantTitle'>{{companyName}}</span> -->
            </el-col>
            <el-col :span="24" class='menuBox'>
              <el-menu
                router
                :default-active="menuActive"
                :collapse="isCollapse"
                text-color="#303030"
                class="el-menu-vertical-demo">
                <el-menu-item index="/home">
                  <i class="iconfont icon-shouye"></i>
                  <span slot="title">首页</span>
                </el-menu-item>
                <el-menu-item index="/home/projectManage" v-if='user.type !==2'>
                  <i class="iconfont icon-xiangmuguanli"></i>
                  <span slot="title">项目管理</span>
                </el-menu-item>
                <el-menu-item index="/home/housingManage"  v-if='user.type !==2'>
                  <i class="iconfont icon-fangyuanguanli"></i>
                  <span slot="title">房源管理</span>
                </el-menu-item>
                <el-submenu index="/home/salesTeamManage"  v-if='user.type !==2'>
                  <template slot="title">
                    <i class="iconfont icon-xiaoshoutuanduiguanli"></i>
                    <span slot="title">销售团队管理</span>
                  </template>
                  <el-menu-item index="/home/salesTeamManage"><i class="iconfont icon-dian" v-if='!isCollapse'></i><span>团队管理</span></el-menu-item>
                  <el-menu-item index="/home/memberManage"><i class="iconfont icon-dian" v-if='!isCollapse'></i><span>成员管理</span></el-menu-item>
                </el-submenu>
                <el-submenu index="/home/marketingTeamManage"  v-if='user.type !==2'>
                  <template slot="title">
                    <i class="iconfont icon-xiaoshoutuanduiguanli"></i>
                    <span slot="title">拓客团队管理</span>
                  </template>
                  <el-menu-item index="/home/marketingTeamManage"><i class="iconfont icon-dian" v-if='!isCollapse'></i><span>行销团队管理</span></el-menu-item>
                  <el-menu-item index="/home/marketingMemberManage"><i class="iconfont icon-dian" v-if='!isCollapse'></i><span>行销成员管理</span></el-menu-item>
                  <el-menu-item index="/home/agencyTeamManage"><i class="iconfont icon-dian" v-if='!isCollapse'></i><span>代理机构管理</span></el-menu-item>
                </el-submenu>
                <el-menu-item index="/home/backstageUser" v-if='!user.type'>
                  <i class="iconfont icon-yonghuguanli"></i>
                  <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item index="/home/application-manage" v-if='!user.type'>
                  <i class="iconfont icon-xiangmuguanli"></i>
                  <span slot="title">应用授权</span>
                </el-menu-item>
                <el-submenu index="/home/userself-config" v-if='!user.type'>
                  <template slot="title">
                    <i class="iconfont icon-xiaoshoutuanduiguanli"></i>
                    <span slot="title">系统设置</span>
                  </template>
                  <el-menu-item index="/home/userself-config"><i class="iconfont icon-dian" v-if='!isCollapse'></i><span>用户定制</span></el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
          <div class='isCollapseBox'>
            <i
              :class="isCollapse ? 'el-icon-arrow-left open' : 'el-icon-arrow-left collapse'"
              @click='isCollapse ? isCollapse = false : isCollapse = true'
            ></i>
          </div>
        </el-aside>
        <el-main>
          <div class="wrapper">
            <div class="scroller">
              <el-row class="banner">
                <el-col :span="24">
                  <el-carousel :interval="4000" height="180px">
                    <el-carousel-item v-for="item in 2" :key="item">
                      <img v-if="userselfConfig.banner && userselfConfig.banner != 'undefined' && userselfConfig.banner != 'null'" :src="OSS_BASE_URL + userselfConfig.banner" alt="banner">
                      <img v-else src="../../static/images/banner.png" alt="banner">
                    </el-carousel-item>
                  </el-carousel>
                </el-col>
              </el-row>
              <el-row class="my_app" v-if="isMyApp">
                <el-col :span="24">
                  <LabelTitle :title="'我的应用'"></LabelTitle>
                </el-col>
                <el-col :span="24" class="app">
                  <el-row>
                    <el-col v-for="(app, idx) of appList" :key="idx" :span="4" class='appIconBox'>
                      <a style="cursor: pointer;" @click="locationTo(app.uri)" :href="app.url" target='_blank'>
                        <div class='imgBox' :style='{background: theme}'>
                          <img v-if="app.ico == '' || null || undefined" class="app_icon" :src="app.cssClass" alt="">
                          <img v-else class="app_icon" :src="OSS_BASE_URL + app.ico" alt="">
                        </div>
                        <p>{{app.name}}</p>
                      </a>
                    </el-col>
                    <!-- <el-col :span="4" class='appIconBox'>
                      <a :href="originAdminOpen" target='_blank'>
                        <i class="app_icon kaipan"></i>
                        <p>网上开盘</p>
                      </a>
                    </el-col>
                    <el-col :span="4" class='appIconBox'>
                      <a :href="originAdminMaterial" target='_blank'>
                        <i class="app_icon ziliao"></i>
                        <p>资料验收</p>
                      </a>
                    </el-col>
                    <el-col :span="4" class='appIconBox'>
                      <a href="javascript:;" @click='caseIndexBlank'>
                        <i class="app_icon anchang"></i>
                        <p>移动案场</p>
                      </a>
                    </el-col>
                    <el-col :span="4" class='appIconBox'>
                      <a :href="originAdminNewCase" target='_blank'>
                        <i class="app_icon anchang"></i>
                        <p>数字案场</p>
                      </a>
                    </el-col> -->
                    <!-- <el-col :span="4" class='appIconBox'>
                      <a href="javascript:;" @click='indexBlank'>
                        <i class="app_icon tuoke"></i>
                        <p>移动拓客</p>
                      </a>
                    </el-col>
                    <el-col :span="4" class='appIconBox'>
                      <a href="javascript:;" @click='houseInspection'>
                        <i class="app_icon yanfang"></i>
                        <p>移动验房</p>
                      </a>
                    </el-col> -->
                    <!-- <el-col :span="4" class='appIconBox'>
                      <a :href="originAdminInspection" target='_blank'>
                        <i class="app_icon yanfang"></i>
                        <p>原点验房</p>
                      </a>
                    </el-col>
                    <el-col :span="4" class='appIconBox'>
                      <a :href="originAdminCustomer" target='_blank'>
                        <i class="app_icon kefu"></i>
                        <p>移动客服</p>
                      </a> -->
                    <!-- </el-col> -->
                  </el-row>
                </el-col>
                <el-col :span="24" v-if="user.type !==2">
                  <LabelTitle :title="'我的操作'"></LabelTitle>
                </el-col>
                <el-col :span="24" class="app" v-if="user.type !==2">
                  <el-row>
                    <el-col :span="4" class='appIconBox'>
                      <router-link :to="'/home/weChatManage'">
                        <div class='imgBox' :style='{background: theme}'>
                          <i class="app_icon weixin"></i>
                        </div>
                        <p>微信授权</p>
                      </router-link>
                    </el-col>
                    <el-col :span="4" class='appIconBox' v-if='!user.type'>
                      <router-link :to="'/home/dataSynchronization'">
                        <div class='imgBox' :style='{background: theme}'>
                          <i class="app_icon erp"></i>
                        </div>    
                        <p>ERP同步设置</p>
                      </router-link>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-row class="router_view" v-if="!isMyApp">
                <el-row v-if='routePath !== "/home/dataSynchronization" && routePath !== "/home/weChatManage" && routePath !== "/home/userself-config" && routePath !== "/home/application-manage"'>
                  <el-col :span="24" class="projectSelect" v-if='routePath !== "/home/projectManage" && routePath !== "/home/backstageUser" && routePath !== "/home/addProject"'>
                    <el-col :span="2" class="title" v-if='!user.type'>公司名称：</el-col>
                    <el-col style='margin-right:20px;' :span="6" v-if='!user.type'>
                      <el-cascader
                        :options="organization"
                        :props="defaultProps"
                        v-model='companyIds'
                        @change='cascaderChange'
                        placeholder="请选择公司"
                        change-on-select
                        style='width: 100%'
                      ></el-cascader>
                      <!-- <el-select  @change='companyChange'>
                        <el-option
                          v-for="item in companyData"
                          :key="item.companyId"
                          :label="item.referred"
                          :value="item.companyId">
                        </el-option>
                      </el-select> -->
                    </el-col>
                    <el-col :span="2" class="title">项目名称：</el-col>
                    <el-col :span="6">
                      <el-select v-model="projectId" placeholder="请选择项目" @change='projectChange'>
                        <el-option
                          v-for="item in projectData"
                          :key="item.projectId"
                          :label="item.referred"
                          :value="item.projectId">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-col>
                </el-row>
                <transition name="fade" mode="out-in">
                  <router-view 
                    ref='routerView'
                    :user="user"
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
  import {mapGetters} from 'vuex'
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
        isMyApp: true,
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
        }
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
        if(url.startsWith('http://') || url.startsWith('https://')){
          window.open(url)
        }else{
          window.open(window.location.origin + url)
        }
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
        if (this.routePath === '/home/housingManage') {
          this.$refs.routerView.getBuilding()
          this.$refs.routerView.activeName = 'listModel'
          this.$refs.routerView.tableData = []
          this.$refs.routerView.buildingId = ''
        } else if (this.routePath === '/home/salesTeamManage' || this.routePath === '/home/marketingTeamManage') {
          this.$refs.routerView.getTeams('firstLoad')
          this.$refs.routerView.getTeamsSaleManagers()
        } else if (this.routePath === '/home/memberManage' || this.routePath === '/home/marketingMemberManage') {
          this.$refs.routerView.getMemberList(projectId)
          this.$refs.routerView.getGroups()
        } else if (this.routePath === '/home/agencyTeamManage') {
          this.$refs.routerView.getTeams('firstLoad')
        }
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
        const attributes = {id: 'id', companyId: 'companyId', parentId: 'parentId', name: 'referred', type: this.user.type}
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
        if (this.$route.name !== 'Home') {
          this.isMyApp = false
        } else {
          this.isMyApp = true
        }
        if (this.routePath === '/home/addProject') {
          this.menuActive = '/home/projectManage'
        } else if (this.routePath === '/home/dataSynchronization' || this.routePath === '/home/weChatManage') {
          this.menuActive = '/home'
        } else {
          this.menuActive = this.$route.path
        }
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
        const params = {'_datatype': 'text', '_param': {'Account': 'admin', 'Pwd': 'c8837b23ff8aaa8a2dde915473ce0991'}}
        if (url === 'https://yxf1.juzhouyun.com:4443/View/Site/CaseIndex.html') {
          await isLoginApp(params)
        } else if (url === 'https://yxf1.juzhouyun.com:5443/View/Home/Index.html') {
          await isLoginAppPort(params)
        } else {
          await isLoginHouseInspection({'_datatype': 'text', '_param': {'Account': 'superadmin', 'Pwd': '123321'}})
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
  .home{
    width: 100%;
    height: 100%;
    .tenantMenu{
      height: 100%;
      .tenantLogoBox{
        min-height: 120px;
      }
      .menuBox{
        height: 70%;
        overflow-y: scroll;
        overflow-x: hidden;
      }
    }
    .projectSelect{
      margin-top: 18px;
    }
    .title{
      line-height: 30px;
    }
    .tenantLogo{
      width: 30%;
      height: auto;
      margin: 0 auto;
      margin-top: 35px;
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .tenantTitle{
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
            transform: scale(.4, .4);
          }
        }
      }
    }
    .el-menu-vertical-demo{
      width: 250px;
    }
    .el-menu--collapse{
      width: 64px !important;
    }
    .tenantBox{
      height: 100%;
      .userName{
        color: #fff;
        font-size: 14px;
        position: relative;
        top: -3px;
      }
      .tenant{
        height: 100%;
        text-align: left;
        i.yuandianLogo{
          width: 150px;
          height: 35px;
          background: url("../../static/images/logo.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 10px;
          top:0;
          bottom: 0;
          margin: auto 0;
          &:hover{
            cursor: pointer;
          }
        }
        img.yuandianLogo{
          width: 150px;
          height: 35px;
          position: absolute;
          left: 10px;
          top:0;
          bottom: 0;
          margin: auto 0;
          &:hover{
            cursor: pointer;
          }
        }
        span{
          color: #fff;
          font-size: 22px;
          font-weight: bold;
          line-height: 100px;
          padding-left: 130px;
        }
        em{
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
      .el-dropdown{
        float: right;
        margin-top: 14px;
      }
      .share-button{
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
    .el-icon-arrow-left{
      width: 12px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      font-weight: bold;
      font-size: 12px;
      &:hover{
        cursor: pointer;
      }
    }
    .isCollapseBox{
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
    .collapse{
      transform: rotate3d(0,0,1,0deg);
      transition: transform .5s;
    }
    .open {
      transform: rotate3d(0,0,1,180deg);
      transition: transform .5s;
    }
  }

  .el-main {
    // max-width: 1360px;
    padding: 10px 20px 0 16px;
    .scroller{
      padding-bottom: 100px;
    }
    .banner{
      img{
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .my_app{
      .app{
        background: #F7F7F7;
        padding: 10px 0;
        .appIconBox{
          margin: 20px 0;
          .imgBox{
            width: 50px;
            height: 50px;
            position: relative;
            margin: 0 auto;
            border-radius: 50%;
            .app_icon{
              width: 60%;
              height: 60%;
              display: block;
              position: absolute;
              left: 20%;
              top: 20%;
              box-sizing: border-box;
            }
          }
        }
        .kaipan{
          background: url("../../static/images/selectRoomIcon.png") no-repeat;
          background-size: 100% 100%;
        }
        .anchang{
          background: url("../../static/images/anchang.png") no-repeat;
          background-size: 100% 100%;
        }
        .ziliao{
          background: url("../../static/images/ziliao.png") no-repeat;
          background-size: 100% 100%;
        }
        .tuoke{
          background: url("../../static/images/tuoke.png") no-repeat;
          background-size: 100% 100%;
        }
        .yanfang{
          background: url("../../static/images/houseInspection.png") no-repeat;
          background-size: 100% 100%;
        }
        .kefu{
          background: url("../../static/images/customerService.png") no-repeat;
          background-size: 100% 100%;
        }
        .weixin{
          background: url("../../static/images/weixin.png") no-repeat;
          background-size: 100% 100%;
        }
        .erp{
          background: url("../../static/images/erp.png") no-repeat;
          background-size: 100% 100%;
        }
        a{
          color: #303030;
          text-decoration: none;
        }
        p{
          text-align: center;
          margin-bottom: 0;
        }
      }
    }
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .fade-enter-active,.fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,.fade-leave-active {
    opacity: 0;
  }
</style>

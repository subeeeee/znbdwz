<template>
  <div id="app">
    <el-container>
      <el-header :style="{background: theme}">
        <ul>
          <li v-if="logo === ''"><img src="../static/images/logo.png"></li>
          <li v-else><img :src="'https://yxf-bucket-01.oss-cn-beijing.aliyuncs.com/' + logo"></li>
          <li>{{userName}}</li>
        </ul>
      </el-header>
      <el-container>
        <el-aside class="main-left">
          <el-radio-group v-model="isCollapse">
            <el-radio-button :label="false" v-if="isCollapse"><i class="el-icon-arrow-right"></i></el-radio-button>
            <el-radio-button :label="true" v-if="!isCollapse"><i class="el-icon-arrow-left"></i></el-radio-button>
          </el-radio-group>
          <el-menu :default-active="routerActive" class="el-menu-vertical-demo" :unique-opened="true" :router="true" :collapse="isCollapse">
            <el-submenu index="/">
              <template slot="title">
                <i class="icon iconfont icon-yonghuguanli"></i>
                <span slot="title">用户管理</span>
              </template>
              <el-menu-item index="/">注册用户</el-menu-item>
              <el-menu-item index="/userManagement/ChannelUser">渠道管理</el-menu-item>
            </el-submenu>
            <el-submenu index="/customerAccount">
              <template slot="title">
                <i class="icon iconfont icon-kehutaizhang"></i>
                <span slot="title">客户管理</span>
              </template>
              <el-menu-item index="/customerAccount">客户台账</el-menu-item>
              <el-menu-item v-if="canViewCustomerMobile!== 0" index="/judge">渠道判客</el-menu-item>
              <el-menu-item  v-if="canViewCustomerMobile!== 0" index="/distribute">渠道分配</el-menu-item>
              <el-menu-item index="/writeOff">佣金核销</el-menu-item>
            </el-submenu>
            <el-menu-item index="/ruleSetting">
              <i class="icon iconfont icon-guizeshezhi"></i>
              <span slot="title">规则设置</span>
            </el-menu-item>
            <el-menu-item index="/application" v-if="type === '0'">
              <i class="icon iconfont icon-yingyongguanli"></i>
              <span slot="title">应用管理</span>
            </el-menu-item>
            <!-- <el-submenu index="/RankingBrokers" v-if="false"> -->
            <el-submenu index="/RankingBrokers">
              <template slot="title">
                <i class="icon iconfont icon-shujutongji"></i>
                <span slot="title">数据统计</span>
              </template>
              <el-menu-item index="/UserStatistics">用户报备统计</el-menu-item>
              <el-menu-item index="/InstitutionalStatistics">机构报备统计</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" class="crumbs-menu">
            <span class="line-ico" :style="{background: theme}"></span>
            <el-breadcrumb-item :to="{ path: '/' }">渠道管家</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: routerMeta.path }">{{routerMeta.page}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="routerMeta.pageTitle">{{routerMeta.pageTitle}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view :tenantId='tenantId' :companyId='companyId' :themeColor="theme"></router-view><!-- 内容 -->
        </el-main>
      </el-container>
    </el-container>
    <ThemePicker :tenantId='tenantId'></ThemePicker>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ThemePicker from '@/components/ThemePicker'
import util from './common/util'
import { MessageBox } from 'element-ui'
export default {
  name: 'App',
  data () {
    return {
      user: '',
      type: '',
      menuWidth: '250px',
      isCollapse: false,
      routerActive: '/',
      routerData: this.$route.path,
      routerMeta: {},
      userName: null, // 用户名称
      tenantId: null, // 租户ID
      companyId: null, // 公司ID
      canViewCustomerMobile: null, //能否可见渠道判客等菜单
      logo: '',
      selfBg: ''
    }
  },
  computed: mapGetters({
    isLoading: 'GET_LOADING_STATUS',
    progress: 'GET_PROGRESS',
    theme: 'GET_COLOUR'
  }),
  components: {
    ThemePicker
  },
  watch: {
    $route: 'changeNav'
  },
  created () {
    var uitl = JSON.parse(unescape(util.getCookie('tenantManger')))
    if (uitl === null) {
      MessageBox.alert('请重新登录', '登录过期', {
        confirmButtonText: '确定',
        callback: action => {
          if (action === 'confirm') {
          }
        }
      })
      let href = window.location.href
      if (!(href.split('/')[2].indexOf('localhost') > -1)) {
        if (href.indexOf('https://') > -1) {
          window.location.href = 'https://' + href.split('/')[2] + '/admin-tenant/'
        } else {
          window.location.href = 'http://' + href.split('/')[2] + '/admin-tenant/'
        }
      }
    } else {
      this.tenantId = uitl.tenantId
      this.companyId = uitl.companyId
      this.userName = uitl.name
      this.type = uitl.type.toString()
      this.canViewCustomerMobile = uitl.canViewCustomerMobile
      sessionStorage.setItem('lastModifyUserId', uitl.lastModifyUserId)
      sessionStorage.setItem('tenantId', uitl.tenantId)
      sessionStorage.setItem('type', uitl.type)
      sessionStorage.setItem('managerId', uitl.managerId)
      sessionStorage.setItem('userId', uitl.createUserId)
      if (uitl.type === 1) {
        this.$router.push({
          path: '/customerAccount'
        })
      }
    }
    this.getUserConfig()
  },
  methods: {
    changeNav () {
      this.routerActive = this.$route.path
      this.routerMeta = this.$route.meta
    },
    async getUserConfig () {
      if (localStorage.getItem('logo')) {
        this.logo = localStorage.getItem('logo')
      } else {
        let secHostName = window.location.host.split('.')[0] || null
        let res = await this.$axios.get(`/iCloud-rest/tenant/config/login?prefix=${secHostName}`)
        if (res.status === 200) {
          if (res.data) {
            localStorage.setItem('logo', res.data.logo || '')
            localStorage.setItem('loginBack', res.data.loginBack || '')
            localStorage.setItem('homeLogo', res.data.homeLogo || '')
            localStorage.setItem('banner', res.data.banner || '')
            this.selfBg = res.dataloginBack || ''
            this.logo = res.data.logo || ''
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header{width:100%;height: 60px;
  ul{display:flex;justify-content:space-between;
    li{height:60px;line-height:60px;
      img{width:150px;height:34px;}
      &:first-child{margin-left:10px;}
      &:last-child{color:#fff;font-size:16px;}
    }
  }
}
</style>

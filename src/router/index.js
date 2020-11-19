import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: function (resolve) {
        require(['../views/userManagement/RegisteredUser'], resolve)
      },
      meta: {
        page: '用户管理',
        pageTitle: '注册用户',
        path: '/'
      }
    },
    {
      path: '/userManagement/ChannelUser',
      name: 'ChannelUser',
      component: function (resolve) {
        require(['../views/userManagement/ChannelUser'], resolve)
      },
      meta: {
        page: '用户管理',
        pageTitle: '渠道管理',
        path: '/'
      }
    },
    {
      path: '/customerAccount',
      name: 'customerAccount',
      component: function (resolve) {
        require(['../views/customerAccount/customerAccount'], resolve)
      },
      meta: {
        page: '客户台账',
        path: '/customerAccount'
      }
    },
    {
      path: '/judge',
      name: 'judge',
      component: function (resolve) {
        require(['../views/customerAccount/judge'], resolve)
      },
      meta: {
        page: '渠道判客',
        path: '/judge'
      }
    },
    {
      path: '/distribute',
      name: 'distribute',
      component: function (resolve) {
        require(['../views/customerAccount/distribute'], resolve)
      },
      meta: {
        page: '渠道分配',
        path: '/distribute'
      }
    },
    {
      path: '/writeOff',
      name: 'writeOff',
      component: function (resolve) {
        require(['../views/customerAccount/writeOff'], resolve)
      },
      meta: {
        page: '佣金核销',
        path: '/writeOff'
      }
    },
    {
      path: '/ruleSetting',
      name: 'ruleSetting',
      component: function (resolve) {
        require(['../views/ruleSetting/ruleSetting'], resolve)
      },
      meta: {
        page: '规则设置',
        path: '/ruleSetting'
      }
    },
    {
      path: '/application',
      name: 'application',
      component: function (resolve) {
        require(['../views/application/application'], resolve)
      },
      meta: {
        page: '应用管理',
        path: '/application'
      }
    },
    // 1
    {
      path: '/UserStatistics',
      name: 'UserStatistics',
      component: function (resolve) {
        require(['../views/Statistics/UserStatistics'], resolve)
      },
      meta: {
        page: '用户报备统计',
        path: '/UserStatistics'
      }
    },
    {
      path: '/InstitutionalStatistics',
      name: 'InstitutionalStatistics',
      component: function (resolve) {
        require(['../views/Statistics/InstitutionalStatistics'], resolve)
      },
      meta: {
        page: '机构报备统计',
        path: '/InstitutionalStatistics'
      }
    }
  ]
})

// router.beforeEach(function (to, from, next) {
//   let setDocumentTitle = function (title) {
//     document.title = title
//   }
//   to.meta.pageTitle && setDocumentTitle(to.meta.pageTitle)
//   next()
// })

export default router

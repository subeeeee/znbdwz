import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const router = new Router({
  // mode: 'history',
  //切换路由后，置顶滚动条
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  },
  routes: [
    {
      path: '/',
      name: 'Login',
      component: function (resolve) {
        require(['../views/login.vue'], resolve)
      },
      meta: {
        pageTitle: '登录'
      }
    },
    {
      path: '*',
      redirect: '/404'
    },
    {
      path: '/404',
      name: 'NotPage',
      component: function (resolve) {
        require(['../views/404.vue'], resolve)
      },
      meta: {
        pageTitle: '404'
      }
    },
    {
      path: '/500',
      name: 'Error',
      component: function (resolve) {
        require(['../views/500.vue'], resolve)
      },
      meta: {
        pageTitle: '500'
      }
    },
    {
      path: '/backPassword',
      name: 'BackPassword',
      component: function (resolve) {
        require(['../views/backPassword.vue'], resolve)
      },
      meta: {
        pageTitle: '找回密码'
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: function (resolve) {
        require(['../views/home.vue'], resolve)
      },
      meta: {
        pageTitle: '首页'
      },
      children: [
        {
          path: 'dataSynchronization',
          name: 'DataSynchronization',
          component: function (resolve) {
            require(['../views/dataSynchronization/dataSynchronization.vue'], resolve)
          }
        },
        {
          path: 'projectManage',
          name: 'ProjectManage',
          component: function (resolve) {
            require(['../views/projectManage/projectManage.vue'], resolve)
          }
        },
        {
          path: 'addProject',
          name: 'AddProject',
          component: function (resolve) {
            require(['../views/projectManage/AddProject.vue'], resolve)
          }
        },
        {
          path: 'housingManage',
          name: 'HousingManage',
          component: function (resolve) {
            require(['../views/housingManage/housingManage.vue'], resolve)
          }
        },
        {
          path: 'salesTeamManage',
          name: 'SalesTeamManage',
          component: function (resolve) {
            require(['../views/salesTeamManage/salesTeamManage.vue'], resolve)
          }
        },
        {
          path: 'memberManage',
          name: 'MemberManage',
          component: function (resolve) {
            require(['../views/salesTeamManage/memberManage.vue'], resolve)
          }
        },
        {
          path: 'marketingTeamManage',
          name: 'MarketingTeamManage',
          component: function (resolve) {
            require(['../views/tokerTeamManage/marketingTeamManage.vue'], resolve)
          }
        },
        {
          path: 'marketingMemberManage',
          name: 'MarketingMemberManage',
          component: function (resolve) {
            require(['../views/tokerTeamManage/marketingMemberManage.vue'], resolve)
          }
        },
        {
          path: 'agencyTeamManage',
          name: 'AgencyTeamManage',
          component: function (resolve) {
            require(['../views/tokerTeamManage/agencyTeamManage.vue'], resolve)
          }
        },
        {
          path: 'backstageUser',
          name: 'BackstageUser',
          component: function (resolve) {
            require(['../views/backstageUser/backstageUser.vue'], resolve)
          }
        },
        {
          path: 'weChatManage',
          name: 'WeChatManage',
          component: function (resolve) {
            require(['../views/weChatManage/weChatManage.vue'], resolve)
          }
        },
        // application-manage
        {
          path: 'application-manage',
          name: 'ApplicationManage',
          component: function (resolve) {
            require(['../views/application-manage/application-manage.vue'], resolve)
          }
        },
        {
          path: 'userself-config',
          name: 'UserselfConfig',
          component: function (resolve) {
            require(['../views/userself-config/userself-config.vue'], resolve)
          }
        }
      ]
    },
    //线上认购
    // {
    //   path: '/sale',
    //   name: 'Sale',
    //   redirect: "/sale/flow",
    //   component: function (resolve) {
    //     require(['../views/sale.vue'], resolve)
    //   },
    //   meta: {
    //     pageTitle: '线上认购'
    //   },
    //   children: [
    //     {
    //       path: 'flow',
    //       name: 'Flow',
    //       component: function (resolve) {
    //         require(['../views/saleOnline/flow/flow.vue'], resolve)
    //       }
    //     },
    //     {
    //       path: 'sign',
    //       name: 'Sign',
    //       component: function (resolve) {
    //         require(['../views/saleOnline/sign/sign.vue'], resolve)
    //       }
    //     },
    //     {
    //       path: 'pay',
    //       name: 'Pay',
    //       component: function (resolve) {
    //         require(['../views/saleOnline/pay/pay.vue'], resolve)
    //       }
    //     },
    //     {
    //       path: 'weex',
    //       name: 'Weex',
    //       component: function (resolve) {
    //         require(['../views/saleOnline/weex/weex.vue'], resolve)
    //       }
    //     },
    //     {
    //       path: 'customer',
    //       name: 'Customer',
    //       component: function (resolve) {
    //         require(['../views/saleOnline/customer/customer.vue'], resolve)
    //       }
    //     },
    //     {
    //       path: 'subscribe',
    //       name: 'subscribe',
    //       component: function (resolve) {
    //         require(['../views/saleOnline/subscribe/subscribe.vue'], resolve)
    //       }
    //     }
    //   ]
    // }
  ]
})

router.beforeEach(function (to, from, next) {
  let setDocumentTitle = function (title) {
    document.title = title
  }
  to.meta.pageTitle && setDocumentTitle(to.meta.pageTitle)
  next()
})

export default router

import axios from 'axios'
// import Router from 'vue-router'
import { Message, MessageBox, Loading } from 'element-ui'
let responseStep = 0
// let router = new Router({})
let loadingInstance = null
const options = {
  lock: true,
  text: '努力加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.9)',
  zIndex: '50000'
}
// 全局的 axios 默认值
axios.defaults.withCredentials = true
axios.defaults.timeout = 10000
// 请求拦截器
axios.interceptors.request.use((config) => {
  responseStep = responseStep + 1
  if (!config.LOAD_ING) {
    loadingInstance = Loading.service(options)
  }
  return config
}, (error) => {
  responseStep = 0
  loadingInstance.close()
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use((res) => {
  // 响应成功 - 错误处理
  const status = res.data.status || res.data.code
  if (status === 400) {
    if (res.data.message.code === 3061) {
      const messageObject = JSON.parse(res.data.message.describeCn)
      let message = ''
      for (let key in messageObject) {
        message += '<p style="margin: 5px 0;">' + messageObject[key] + '</p>'
      }
      Message({
        message: message,
        dangerouslyUseHTMLString: true,
        type: 'error'
      })
    } else {
      Message({
        message: res.data.message.describeCn ? res.data.message.describeCn : res.data.message,
        type: 'error'
      })
    }
    responseStep = 0
    loadingInstance.close()
  } else if (status === 401) {
    sessionStorage.clear()
    window.close()
  } else if (status === 500) {
    responseStep = 0
    loadingInstance.close()
  } else {
    // 响应成功 - 返回成功
    responseStep = responseStep - 1
    if (!responseStep) {
      responseStep = 0
      setTimeout(() => {
        loadingInstance.close()
      }, 400)
    }
    return res
  }
  return Promise.reject(res)
}, (error) => {
  // 响应失败 - 错误处理
  if (error && error.response) {
    if (error.response.status === 401) {
      let href = window.location.href
      if (!(href.split('/')[2].indexOf('localhost') > -1)) {
        if (href.indexOf('https://') > -1) {
          window.location.href = 'https://' + href.split('/')[2] + '/admin-tenant/'
        } else {
          window.location.href = 'http://' + href.split('/')[2] + '/admin-tenant/'
        }
      }
      loadingInstance.close()
      return false
    }
    switch (error.response.status) {
      case 408:
        error.message = '网络超时'
        break
      case 504:
        error.message = '网络超时'
        break
      default:
        error.message = '网络异常'
    }
  } else {
    error.message = '网络异常'
  }
  responseStep = 0
  loadingInstance.close()
  MessageBox.alert('请点击重试', error.message, {
    confirmButtonText: '重试',
    callback: action => {
      if (action === 'confirm') {
        window.location.reload()
      }
    }
  })
  return Promise.reject(error.message)
})

let base = '/iCloud-rest/channel-manager'
let digital = '/iCloud-rest/digital-manager'

export const projectsProject = params => { return axios.get(`/iCloud-rest/projects/project?tenantId=${params}`).then(res => res.data) }
export const projectsManagerProject = params => { return axios.get(`/iCloud-rest/projects/manager/project?managerId=${params}`).then(res => res.data) }
export const projectsOptions = params => { return axios.get(`${base}/projects/options?tenantId=${params}`).then(res => res.data) }
// 客户状态
export const ManagerCustomersCustomerStatus = params => { return axios.get(`${base}/manager/customers/customerStatus${params}`).then(res => res.data) }
// 时间类型
export const managerCustomersTimeTypes = params => { return axios.get(`${base}/manager/customers/timeTypes${params}`).then(res => res.data) }
// 渠道来源
export const managerAgencyTeamChannelChannelTypes = params => { return axios.get(`${base}/manager/agencyTeam/channel/channelTypes${params}`).then(res => res.data) }
// 渠道列表
export const managerAgencyTeamChannelOptions = params => { return axios.get(`${base}/manager/agencyTeam/channel/options${params}`).then(res => res.data) }
// 报备团队列表
export const managerAgencyTeamStoresOptions = params => { return axios.get(`${base}/manager/agencyTeam/stores/options${params}`).then(res => res.data) }
// 客户台账列表
export const managerCustomersList = params => { return axios.get(`${base}/manager/customers/list${params}`).then(res => res.data) }
// 导出 客户台账列表
export const exportManagerCustomersList = params => { return axios.get(`${base}/manager/customers/list${params}`, { LOAD_ING: true }).then(res => res.data) }
// 客户台账列表 查看
export const managerCustomers = params => { return axios.get(`${base}/manager/customers/${params}`).then(res => res.data) }
// 客户台账列表 推荐进度
export const customersReportHistory = params => { return axios.get(`${base}/manager/customers/reportHistory/${params}`).then(res => res.data) }
// 判客列表
export const judgeCustomersList = params => { return axios.get(`${base}/manager/customers/listJudge${params}`).then(res => res.data) }
// 导出 判客列表
export const exportJudgeCustomersList = params => { return axios.get(`${base}/manager/customers/listJudge${params}`, { LOAD_ING: true }).then(res => res.data) }
// 判客
export const setJudge = params => { return axios.post(`${base}/manager/customers/judge`, params).then(res => res.data) }

// 分配列表
export const distributeCustomersList = params => { return axios.get(`${base}/manager/customers/listNoMember${params}`).then(res => res.data) }
// 导出 分配列表
export const exportDistributeCustomersList = params => { return axios.get(`${base}/manager/customers/listNoMember${params}`, { LOAD_ING: true }).then(res => res.data) }
// 分配可选列表
export const getDistributeList = params => { return axios.post(`${base}/manager/members`, params).then(res => res.data) }
// 分配
export const setDistribute = params => { return axios.post(`${base}/manager/customers/setMember`, params).then(res => res.data) }


// 佣金类型
export const managerCommissionTypes = params => { return axios.get(`${base}/manager/commission/types/${params}`).then(res => res.data) }
// 佣金管理 提交
export const postManagerCommission = params => { return axios.post(`${base}/manager/commission`, params).then(res => res.data) }
// 佣金列表
export const getManagerCommission = params => { return axios.get(`${base}/manager/commission/${params}`).then(res => res.data) }
// 删除佣金记录
export const deleteManagerCommission = params => { return axios.delete(`${base}/manager/commission/${params}`).then(res => res.data) }
// 注册用户列表
export const accountsFreeAgentList = params => { return axios.get(`${base}/accounts/freeAgent/list${params}`).then(res => res.data) }
// 身份选项卡
export const accountsIdentity = params => { return axios.get(`${base}/accounts/identity${params}`).then(res => res.data) }
// 身份选项卡-包括禁用和启用的
export const accountsIdentity2 = params => { return axios.get(`${base}/identity${params}`).then(res => res.data) }

// 停启用
export const accountsFreeAgent = params => { return axios.put(`${base}/accounts/freeAgent/${params}`).then(res => res.data) }
// 变更身份提交
export const putAccountsIdentity = params => { return axios.put(`${base}/accounts/identity`, params).then(res => res.data) }
// 渠道名单
export const managerAgencyTeamChannelList = params => { return axios.get(`${base}/manager/agencyTeam/channel/list${params}`).then(res => res.data) }
// 添加 渠道名单
export const postManagerAgencyTeamChannel = params => { return axios.post(`${base}/manager/agencyTeam/channel`, params).then(res => res.data) }
// 编辑 渠道名单
export const putManagerAgencyTeamChannel = params => { return axios.put(`${base}/manager/agencyTeam/channel`, params).then(res => res.data) }
// 获取 渠道信息
export const getManagerAgencyTeamChannel = params => { return axios.get(`${base}/manager/agencyTeam/channel/${params}`).then(res => res.data) }
// 删除 渠道
export const deleteManagerAgencyTeamChannel = params => { return axios.delete(`${base}/manager/agencyTeam/channel/${params}`).then(res => res.data) }
// 停启用渠道
export const changeManagerAgencyTeamChannel = params => { return axios.delete(`${base}/manager/agencyTeam/channel/${params}`).then(res => res.data) }
// 渠道下 门店列表
export const managerAgencyTeamStores = params => { return axios.get(`${base}/manager/agencyTeam/stores/${params}`).then(res => res.data) }
// 停启用门店
export const changeAgencyTeamStores = params => { return axios.delete(`${base}/manager/agencyTeam/stores/${params}`).then(res => res.data) }
// 添加门店获取渠道列表
export const managerAgencyTeamChannel = params => { return axios.get(`${base}/manager/agencyTeam/channel/${params}/authorizedProjects`).then(res => res.data) }
// 添加门店
export const addManagerAgencyTeamStores = params => { return axios.post(`${base}/manager/agencyTeam/stores`, params).then(res => res.data) }
// 编辑门店 查询门店信息
export const getManagerAgencyTeamStores = params => { return axios.get(`${base}/manager/agencyTeam/stores/${params}`).then(res => res.data) }
// 编辑门店
export const editManagerAgencyTeamStores = params => { return axios.put(`${base}/manager/agencyTeam/stores`, params).then(res => res.data) }
// 删除门店
export const delManagerAgencyTeamStores = params => { return axios.delete(`${base}/manager/agencyTeam/stores/${params}`).then(res => res.data) }
// 门店店员列表
export const managerAgencyTeamStoresAssistants = (params, currentPage, search) => { return axios.get(`${base}/manager/agencyTeam/stores/${params}/assistants?currentPage=${currentPage}${search}`).then(res => res.data) }
// 停启用店员
export const accountsChannel = params => { return axios.put(`${base}/accounts/channel/${params}`).then(res => res.data) }
// 注册规则 获取
export const getManagerAccountRules = params => { return axios.get(`${base}/manager/accountRules/${params}`).then(res => res.data) }
// 注册规则 提交
export const postManagerAccountRules = params => { return axios.post(`${base}/manager/accountRules`, params).then(res => res.data) }
// 报备规则 获取
export const getManagerReporterRule = params => { return axios.get(`${base}/manager/reporterRule/${params}`).then(res => res.data) }
// 提交报备修改
export const postManagerReporterRule = params => { return axios.post(`${base}/manager/reporterRule`, params).then(res => res.data) }
// 佣金规则 获取
export const getManagerCommissionRules = params => { return axios.get(`${base}/manager/commission/rules/${params}`).then(res => res.data) }
// 提交报备修改
export const postManagerCommissionRules = params => { return axios.post(`${base}/manager/commission/rules`, params).then(res => res.data) }
// 阿里云Token
export const getAliyunToken = params => { return axios.get(`/iCloud-rest/projects/Aliyun/token/${params}`).then(res => res.data) }
// 活动管理 提交
export const postManagerShareActivity = params => { return axios.post(`${base}/manager/shareActivity`, params).then(res => res.data) }
// 活动管理 获取
export const getManagerShareActivity = params => { return axios.get(`${base}/manager/shareActivity/${params}`).then(res => res.data) }
// 配图管理 提交
export const postManagerTenantConfig = params => { return axios.post(`${base}/manager/tenantConfig`, params).then(res => res.data) }
// 配图管理 获取
export const getManagerTenantConfig = params => { return axios.get(`${base}/manager/tenantConfig/${params}`).then(res => res.data) }
// 获取微信活动链接
export const managerTenantConfigWxMenuUrl = params => { return axios.get(`${base}/manager/tenantConfig/wxMenuUrl${params}`).then(res => res.data) }
// 查看授权项目列表
export const getProjectsAuthorizationList = params => { return axios.get(`${base}/projects/authorization/list/${params}`).then(res => res.data) }
// 提交授权项目列表
export const postProjectsAuthorizationList = params => { return axios.post(`${base}/projects/authorization/list`, params).then(res => res.data) }
// 报备状态
export const getManagerCustomersReportStatus = params => { return axios.get(`${base}/manager/customers/reportStatus`, params).then(res => res.data) }
// 添加 报备规则-渠道规则
export const postProjectGroupRule = params => { return axios.post(`/iCloud-rest/digital-manager/project/group/rule`, params).then(res => res.data) }
// 获取 报备规则-渠道规则
export const getProjectGroupRule = params => { return axios.get(`/iCloud-rest/digital-manager/project/group/rule${params}`).then(res => res.data) }
// 修改 报备规则-渠道规则
export const putProjectGroupRule = params => { return axios.put(`/iCloud-rest/digital-manager/project/group/rule`, params).then(res => res.data) }
// 获取项目所在城市
export const projectsCitys = params => { return axios.get(`${base}/projects/citys${params}`).then(res => res.data) }
// 获取 个性应用
export const getManagerIndividualRules = params => { return axios.get(`${base}/manager/individualRules/${params}`).then(res => res.data) }
// 提交 个性应用
export const postManagerIndividualRules = params => { return axios.post(`${base}/manager/individualRules`, params).then(res => res.data) }
// 获取 身份认证类型
//type 0获取内置的所有身份类型, 1获取内置的所有非渠道身份类型, 2获取内置的所有渠道身份类型, 3获取租户启用的所有非渠道身份类型, 4获取租户启用的所有非渠道身份类型 + 渠道身份, 5获取租户配置的所有非渠道身份类型 - 启用的checked=true
export const getIdentityData = params => { return axios.get(`${base}/identity?type=${params.type}&tenantId=${params.tenantId || ''}`).then(res => res.data) }
// 新建 身份认证类型
export const addIdentity = params => { return axios.post(`${base}/identity`, params).then(res => res.data) }
// 编辑 身份认证类型
export const editIdentity = params => { return axios.put(`${base}/identity`, params).then(res => res.data) }
// 删除 身份认证类型
export const delIdentity = params => { return axios.post(`${base}/identity/delete`, params).then(res => res.data) }
// 启用选中状态 身份认证类型
export const startIdentity = params => { return axios.put(`${base}/identity/start`, params).then(res => res.data) }


// 项目配置规则 案场
export const getProjectRule = params => { return axios.get(`/iCloud-rest/digital-manager/project/rule/${params}`).then(res => res.data) }
export const postProjectRule = params => { return axios.post(`/iCloud-rest/digital-manager/project/rule/`, params).then(res => res.data) }
// 用户定制获取
export const requestWebsiteConfigGet = params => { return axios.get(`/iCloud-rest/tenant/config`, { params: params }).then(res => res.data) }
// 获取报备默认规则
export const getManagerReporterModeOptions = params => { return axios.get(`${base}/manager/reporterMode/options/${params}`).then(res => res.data) }
// 获取报备模式 适用范围
export const getManagerReporterModeTeamOptions = params => { return axios.get(`${base}/manager/reporterMode/teamOptions/${params}`).then(res => res.data) }
// 获取报备模式 细则
export const getManagerReporterMode = params => { return axios.get(`${base}/manager/reporterMode/${params}`).then(res => res.data) }
// 新建报备模式
export const postManagerReporterMode = params => { return axios.post(`${base}/manager/reporterMode`, params).then(res => res.data) }
// 修改报备模式
export const putManagerReporterMode = params => { return axios.put(`${base}/manager/reporterMode`, params).then(res => res.data) }
// 删除报备模式
export const deleteManagerReporterMode = params => { return axios.delete(`${base}/manager/reporterMode/${params}`).then(res => res.data) }
// 判客
export const putCustomersDisableStatus = params => { return axios.put(`${base}/manager/customers/disableStatus/${params}`).then(res => res.data) }
// 经纪人排行表
export const getStatisticsGetAgentRankList = params => { return axios.get(`${base}/statistics/getAgentRankList`, { params: params }).then(res => res.data) }
export const getDownStatisticsGetAgentRankList = params => { return axios.get(`${base}/statistics/getAgentRankList${params}`, { LOAD_ING: true }).then(res => res.data) }
// 机构报备统计
export const getStatisticsGetOrganizationReportList = params => { return axios.get(`${base}/statistics/getOrganizationReportList`, { params: params }).then(res => res.data) }
export const getDownStatisticsGetOrganizationReportList = params => { return axios.get(`${base}/statistics/getOrganizationReportList${params}`, { LOAD_ING: true }).then(res => res.data) }
// 核算列表
export const getReceiveCommissionList = params => { return axios.get(`${base}/manager/commission/getReceiveCommissionList`, { params: params }).then(res => res.data) }
// 佣金核销
export const postReceiveCommission = params => { return axios.post(`${base}/manager/commission/receiveCommission`, params).then(res => res.data) }
// 获取邀请人
export const getParentUser = params => { return axios.get(`${base}/accounts/parentUser/${params}`).then(res => res.data) }
// 查询核销记录明细
export const getReceiveCommissionHistoryList = params => { return axios.get(`${base}/manager/commission/receiveCommissionHistoryList/`, { params: params }).then(res => res.data) }
// 删除核销记录
export const deletReceiveCommission = params => { return axios.delete(`${base}/manager/commission/delete/CommissionHistory/${params}`).then(res => res.data) }
// 注册用户 佣金账户
export const getBank = params => { return axios.get(`${base}/manager/bank/${params}`).then(res => res.data) }


// 查询渠道负责人
export const getChannelPrincipal = params => { return axios.get(`${base}/manager/bank/${params.id}?`).then(res => res.data) }

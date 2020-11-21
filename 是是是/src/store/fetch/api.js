import axios from 'axios'
import Router from 'vue-router'
import store from '../index'
import { Message, MessageBox } from 'element-ui'
// import util from '../../common/js/util.js'

let origin = window.location.origin
let responseStep = 0
let router = new Router({})
let base = '/iCloud-rest'
let wxthird = '/icloud-wxthird'

// 配置信息  ↓

axios.defaults.withCredentials = true
axios.defaults.timeout = 100000
axios.interceptors.request.use((config) => {
  responseStep = responseStep + 1
  if (!config.LOAD_ING) {
    store.commit('UPDATE_LOADING_STATUS', { isLoading: true })
  }
  return config
}, (error) => {
  responseStep = 0
  store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
  return Promise.reject(error)
})
axios.interceptors.response.use((res) => {
  if (res.data.status === 400) {
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
      console.log(res)
      Message({
        message: res.data.message.describeCn ? res.data.message.describeCn : res.data.message,
        type: 'error'
      })
    }
    responseStep = 0
    store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
  } else if (res.data.status === 401) {
    router.push('/')
    window.location.reload()
    Message({
      message: '登录失效，请重新登录！',
      type: 'info'
    })
  } else if (res.data.status === 500) {
    responseStep = 0
    store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
    MessageBox.alert('请点击重试', '服务器繁忙', {
      confirmButtonText: '重试',
      callback: action => {
        if (action === 'confirm') {
          window.location.reload()
        }
      }
    })
  } else if (res.data.status >= 800 && res.data.status < 900) {
    Message({
      message: res.data.msg ? res.data.msg : res.data.message,
      type: 'error'
    })
    responseStep = 0
    store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
  } else {
    responseStep = responseStep - 1
    if (!responseStep) {
      responseStep = 0
      store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
    }
    return res
  }
  return Promise.reject(res)
}, (error) => {
  console.info(error)
  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        error.message = '非法授权'
        break
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
  store.commit('UPDATE_LOADING_STATUS', { isLoading: false })
  MessageBox.alert('请点击重试', error.message, {
    confirmButtonText: '重试',
    callback: action => {
      if (action === 'confirm') {
        window.location.reload()
      }
    }
  })
  // util.deleteAllCookies()
  // router.push('/')
  return Promise.reject(error.message)
})
/* --------------------------------------接口管理---------------------------------------------- */
export const weChatGoAuthor = tenantId => { return axios.get(`${origin}/icloud-wxthird/openwx/goAuthor/${tenantId}`).then(res => res.data) }
export const isLoginApp = params => { return axios.post(`https://yxf1.juzhouyun.com:4443/FrameWeb/FrameService/Main.ashx?option=func&funcid=login`, params).then(res => res.data) }
export const isLoginAppPort = params => { return axios.post(`https://yxf1.juzhouyun.com:5443/FrameWeb/FrameService/Main.ashx?option=func&funcid=login`, params).then(res => res.data) }
export const isLoginHouseInspection = params => { return axios.post(`https://yxf1.juzhouyun.com:6443/FrameWeb/FrameService/Main.ashx?option=func&funcid=login`, params).then(res => res.data) }

/* --------------------------------------ERP数据同步---------------------------------------------- */
// 保存ERP数据信息
export const requestSaveErpConfig = params => { return axios.post(`${base}/inspection/api/post/saveErpConfig`, params).then(res => res.data) }
// 获取ERP数据信息
export const requestGetErpConfig = tenantId => { return axios.get(`${base}/inspection/api/get/erpConfig/${tenantId}`).then(res => res.data) }
// 接口测试
export const requestTestErpInterface = params => { return axios.post(`${base}/inspection/api/post/testErpInterface`, params, { timeout: 1000 * 60 * 2, LOAD_ING: true }).then(res => res.data) }
// 获取公司 ERP 数据
export const requestGetErpCorConfig = params => { return axios.get(`${base}/inspection/api/get/syncCompanyFromErp/${params}`).then(res => res.data) }
// 保存 ERP 授权
export const requestPostErpCorConfig = params => { return axios.get(`${base}/projects/company/config/erp/`, { params: params }).then(res => res.data) }

/* ---------------------------------------微信菜单管理--------------------------------------------- */

// 获取微信菜单
export const requestWeChatMenu = appId => { return axios.get(`${wxthird}/openwx/getMenu/${appId}`).then(res => res.data) }
// 创建微信菜单
export const requestWeChatCreateMenu = (id, params) => { return axios.post(`${wxthird}/openwx/createMenu/${id}`, params).then(res => res.data) }

/* --------------------------------------后台用户管理管理---------------------------------------------- */

// 获取用户
export const requestTenantManager = params => { return axios.get(`${base}/tenant/tenant/manager/view`, { params: params }).then(res => res.data) }
// 添加用户
export const requestTenantManagerPost = params => { return axios.post(`${base}/tenant/tenant/manager`, params).then(res => res.data) }
// 修改用户
export const requestTenantManagerPut = params => { return axios.put(`${base}/tenant/tenant/manager`, params).then(res => res.data) }
// 密码重置
export const requestTenantResetPassword = params => { return axios.post(`${base}/tenant/tenant/manager/modify/password`, params).then(res => res.data) }
// 获取验证码
export const requestTenantVerifyMsg = params => { return axios.post(`${base}/tenant/tenant/manager/forget/password`, params).then(res => res.data) }
// 修改密码
export const requestTenantPwdReset = params => { return axios.post(`${base}/tenant/tenant/manager/forget/password/reset`, params).then(res => res.data) }
// 修改用户状态
export const requestTenantManagerStatus = params => { return axios.get(`${base}/tenant/tenant/manager/status`, { params: params }).then(res => res.data) }
// oss操作接口
export const requestAliYunToken = params => { return axios.get(`${base}/projects/Aliyun/token`, { params: params }).then(res => res.data) }
// 租户管理员登录
export const requestLogin = params => { return axios.get(`${base}/tenant/tenant/manager/login`, { params: params }).then(res => res.data) }
// 模板导出
export const excelExportTemplate = params => { return axios.post(`${base}/projects/excel/exportTemplate`, params, { responseType: 'blob' }).then(res => res.data) }
// 导出数据
export const excelExport = params => { return axios.post(`${base}/projects/excel/export`, params, { responseType: 'blob' }).then(res => res.data) }
// 获取处理状态
export const excelProcess = params => { return axios.post(`${base}/projects/excel/process`, params, { LOAD_ING: true }).then(res => res.data) }
export const requestExcelProcess = params => { return axios.get(`${base}/projects/excel/process`, { params: params, LOAD_ING: true }).then(res => res.data) }
// 获取公众号名称
export const requestWeChatName = appId => { return axios.get(`${wxthird}/openwx/getName/${appId}`).then(res => res.data) }
// 获取微信授权列表
export const requestWeChatAuthorizationList = (pageNum, pageSize, tid) => { return axios.get(`${wxthird}/openwx/getAllAppId/${pageNum}/${pageSize}/${tid}`).then(res => res.data) }
// 管理员授权应用
export const requestAuthorizedApplicationPost = params => { return axios.post(`${base}/tenant/manager/appliance`, params).then(res => res.data) }
// 获取管理员授权应用
export const requestAuthorizedApplicationGet = params => { return axios.get(`${base}/tenant/manager/appliance`, { params: params }).then(res => res.data) }

/* ------------------------------------项目管理接口------------------------------------------ */

// 添加项目图册
export const requestProjectAlbum = params => { return axios.post(`${base}/projects/projectAlbum`, params).then(res => res.data) }
// 获取项目图册
export const requestProjectAlbumGet = params => { return axios.get(`${base}/projects/projectAlbum`, { params: params }).then(res => res.data) }
// 删除项目图册
export const requestProjectAlbumDelete = params => { return axios.get(`${base}/projects/projectAlbum/delete`, { params: params }).then(res => res.data) }
// 获取erp数据
export const requestViewErp = params => { return axios.get(`${base}/projects/view/erp`, { params: params }).then(res => res.data) }
// 获取城市数据
export const requestArea = () => { return axios.get(`${base}/projects/area`).then(res => res.data) }
// 获取组织列表
export const requestOrganizationList = params => { return axios.get(`${base}/projects/company`, { params: params }).then(res => res.data) }
// 修改公司
export const requestOrganizationPut = params => { return axios.put(`${base}/projects/company`, params).then(res => res.data) }
// 新增公司
export const requestOrganizationPost = params => { return axios.post(`${base}/projects/company`, params).then(res => res.data) }
// 逻辑删除公司
export const requestCompanyMarkDelete = params => { return axios.get(`${base}/projects/company/markDelete`, { params: params }).then(res => res.data) }
// 获取集团公司和区域公司
export const requestCompanyGroupArea = params => { return axios.get(`${base}/projects/company/groupArea`, { params: params }).then(res => res.data) }
// 逻辑删除项目
export const requestProjectMarkDelete = params => { return axios.get(`${base}/projects/project/markDelete`, { params: params }).then(res => res.data) }
// 获取项目列表
export const requestProjectList = params => { return axios.get(`${base}/projects/project`, { params: params, LOAD_ING: true }).then(res => res.data) }
// 根据管理员id获取
export const requestManagerProjectList = params => { return axios.get(`${base}/projects/manager/project`, { params: params }).then(res => res.data) }
export const requestAreaManagerProjectList = params => { return axios.get(`${base}/projects/area/manager/project`, { params: params }).then(res => res.data) }
// 新增项目
export const requestProjectListPost = params => { return axios.post(`${base}/projects/project`, params).then(res => res.data) }
// 修改项目
export const requestProjectListPut = params => { return axios.put(`${base}/projects/project`, params).then(res => res.data) }
export const requestProjectERPPut = params => { return axios.put(`${base}/projects/project/binder-erp`, params).then(res => res.data) }
// 获取户型列表
export const requestRoomPatternList = params => { return axios.get(`${base}/projects/roomPattern`, { params: params }).then(res => res.data) }
// 添加户型
export const requestRoomPatternPost = params => { return axios.post(`${base}/projects/roomPattern`, params).then(res => res.data) }
// 修改户型
export const requestRoomPatternPut = params => { return axios.put(`${base}/projects/roomPattern`, params).then(res => res.data) }
// 标记删除户型
export const requestRoomPatternDelete = params => { return axios.get(`${base}/projects/roomPattern/markDelete`, { params: params }).then(res => res.data) }
// 批量删除户型
export const requestRoomPatternBatchDeleting = params => { return axios.post(`${base}/projects/roomPattern/batchDeleting`, params).then(res => res.data) }
// 获取户型图
export const requestRoomPatternImages = params => { return axios.get(`${base}/projects/roomPattern/images`, { params: params }).then(res => res.data) }
// 删除户型图
export const requestRoomPatternImagesDelete = params => { return axios.get(`${base}/projects/roomPattern/images/delete`, { params: params }).then(res => res.data) }
// 启用/禁用户型
export const setRoomEnable = params => { return axios.get(`${base}/projects/roomPattern/enable`, { params: params }).then(res => res.data) }
// 根据租户Id获取可绑定微信项目
export const requestWeChatManagerProjectTenant = params => { return axios.get(`${base}/projects/manager/project/weixin/tenant`, { params: params }).then(res => res.data) }
// 项目绑定app ID
export const requestWeChatManagerProjectBinder = params => { return axios.post(`${base}/projects/manager/project/weixin/binder`, params).then(res => res.data) }
//获取项目分期列表
export const getIntentionStages = params => { return axios.post(`${base}/projects/stage/listPage`, params).then(res => res.data) }
//新增项目分期
export const saveIntentionStages = params => { return axios.post(`${base}/projects/stage`, params).then(res => res.data) }
//修改项目分期
export const updateIntentionStages = params => { return axios.put(`${base}/projects/stage`, params).then(res => res.data) }
//删除项目分期
export const deleteIntentionStages = params => { return axios.delete(`${base}/projects/stage/${params}`).then(res => res.data) }
//绑定ERP项目分期
export const doERPIntentionStages = params => { return axios.put(`${base}/projects/stage/binder-erp`, params).then(res => res.data) }

/* ----------------------------------销售团队接口------------------------------------------- */

// 重置密码
export const requestRestPassword = params => { return axios.put(`${base}/projects/members/password`, params).then(res => res.data) }
// 获取成员列表
export const requestMemberListPost = params => { return axios.post(`${base}/projects/members/page`, params).then(res => res.data) }
// 置为离职
export const requestMembersDimission = params => { return axios.put(`${base}/projects/members/dimission`, params).then(res => res.data) }
// 置为在职
export const requestMembersOnJob = params => { return axios.put(`${base}/projects/members/onJob`, params).then(res => res.data) }
// 修改成员
export const requestMembersPut = (params, memberId) => { return axios.put(`${base}/projects/members/${memberId}`, params).then(res => res.data) }
// 获取未选择成员列表
export const requestTeamsMembersPost = params => { return axios.post(`${base}/projects/teams/members`, params).then(res => res.data) }
// 移除团队成员
export const requestTeamsMembersDelete = (params, memberId) => { return axios.delete(`${base}/projects/teams/members/${memberId}`, { params: params }).then(res => res.data) }
// 移除团队成员
export const requestMembersDelete = (params, memberId) => { return axios.delete(`${base}/projects/members/${memberId}`, { params: params }).then(res => res.data) }
// 添加成员
export const requestMembersPost = params => { return axios.post(`${base}/projects/members`, params).then(res => res.data) }
// 调整成员所属组织
export const requestTeamsMembersPut = params => { return axios.put(`${base}/projects/teams/members`, params).then(res => res.data) }
// 团队添加成员
export const requestTeamsMemberPost = params => { return axios.post(`${base}/projects/teams/member`, params).then(res => res.data) }
// 获取销售经理
export const requestTeamsSaleManagers = params => { return axios.get(`${base}/projects/teams/saleManagersAndDispatchers`, { params: params }).then(res => res.data) }
// 查询团队和小组
export const requestGroups = params => { return axios.get(`${base}/projects/teams/groups`, { params: params }).then(res => res.data) }
// 查询团队列表
export const requestTeams = params => { return axios.get(`${base}/projects/teams`, { params: params }).then(res => res.data) }
// 查询组织成员
export const requestTeamsMembers = params => { return axios.get(`${base}/projects/teams/members`, { params: params }).then(res => res.data) }
// 查询团队和组列表
export const requestTeamsGroup = params => { return axios.get(`${base}/projects/teams/groups/list`, { params: params }).then(res => res.data) }
// 查询团队和组成员
export const requestTeamsGroupMembers = params => { return axios.get(`${base}/projects/teams/groups/members`, { params: params }).then(res => res.data) }
// 查询团队组织结构
export const requestTeamsStructure = (params, teamId) => { return axios.get(`${base}/projects/teams/${teamId}/structure`, { params: params }).then(res => res.data) }
// 增加团队
export const requestTeamsPost = params => { return axios.post(`${base}/projects/teams`, params).then(res => res.data) }
// 修改团队
export const requestTeamsPut = (params, teamId) => { return axios.put(`${base}/projects/teams/${teamId}`, params).then(res => res.data) }
// 删除团队
export const requestTeamsDelete = (params, teamId) => { return axios.delete(`${base}/projects/teams/${teamId}`, { params: params }).then(res => res.data) }
// 同步成员
export const getSyncXyMemberFromErp = projectId => { return axios.post(`${base}/digital-manager/syncMember/syncMyMemberFromErp`,{projectId:projectId}).then(res => res.data) }
// 同步成员-作废
export const getSyncXyMemberFromErp_bak = projectId => { return axios.get(`${base}/inspection/api/get/syncXyMemberFromErp/${projectId}`).then(res => res.data) }
// 查询同步成员进度
export const getSyncXyMemberFromErpProcess = projectId => { return axios.get(`${base}/inspection/api/get/syncXyMemberFromErpProcess/${projectId}`, { LOAD_ING: true }).then(res => res.data) }
// 基础信息-查询推荐列表
export const getPromoteSort = params => { return axios.get(`${base}/projects/view/promoteSort`,{ params: params }).then(res => res.data) }


/* ----------------------------------拓客团队接口------------------------------------------- */
// 导出团队
export const requestExpandTeamExcelExport = params => { return axios.get(`${base}/projects/expandTeams/excel/export`, { params: params, responseType: 'blob' }).then(res => res.data) }
// 查询拓客总监
export const requestExpandTeamDirectors = params => { return axios.get(`${base}/projects/expandTeams/directors`, { params: params }).then(res => res.data) }
// 获取处理状态
export const requestExpandTeamExcelProcess = taskId => { return axios.get(`${base}/projects/expandTeams/excel/process/${taskId}`).then(res => res.data) }
// 获取拓客团队
export const requestGetExpandTeam = params => { return axios.get(`${base}/projects/expandTeams`, { params: params }).then(res => res.data) }
// 删除拓客团队
export const requestDeleteExpandTeam = (params, teamId) => { return axios.delete(`${base}/projects/expandTeams/${teamId}`, { params: params }).then(res => res.data) }
// 组建拓客团队
export const requestPostExpandTeam = params => { return axios.post(`${base}/projects/expandTeams`, params).then(res => res.data) }
// 修改拓客团队
export const requestPutExpandTeam = (params, teamId) => { return axios.put(`${base}/projects/expandTeams/${teamId}`, params).then(res => res.data) }
// 查询未选择的拓客成员
export const requestGetExpandTeamMembers = params => { return axios.post(`${base}/projects/expandTeams/members`, params).then(res => res.data) }
// 移除拓客成员
export const requestDeleteExpandTeamMembers = (params, memberId) => { return axios.delete(`${base}/projects/expandTeams/members/${memberId}`, { params: params }).then(res => res.data) }
// 查询拓客团队成员结构
export const requestGetExpandTeamsStructure = (params, teamId) => { return axios.get(`${base}/projects/expandTeams/${teamId}/structure`, { params: params }).then(res => res.data) }
// 获取拓客团队成员
export const requestGetExpandGroupsMembers = params => { return axios.get(`${base}/projects/expandTeams/groups/members`, { params: params }).then(res => res.data) }
// 添加拓客成员
export const requestPostExpandTeamsMember = params => { return axios.post(`${base}/projects/expandTeams/member`, params).then(res => res.data) }
// 调整组织
export const requestPutExpandTeamsMembers = params => { return axios.put(`${base}/projects/expandTeams/members`, params).then(res => res.data) }
// 查询组织成员
export const requestGetExpandMembers = params => { return axios.get(`${base}/projects/expandTeams/members`, { params: params }).then(res => res.data) }
// 获取团队和组列表
export const requestGetExpandGroupsList = params => { return axios.get(`${base}/projects/expandTeams/groups/list`, { params: params }).then(res => res.data) }
// 获取团队和组
export const requestGetExpandGroups = params => { return axios.get(`${base}/projects/expandTeams/groups`, { params: params }).then(res => res.data) }
// 删除拓客成员
export const requestDeleteExpandMembers = (params, memberId) => { return axios.delete(`${base}/projects/expandMembers/${memberId}`, { params: params }).then(res => res.data) }
// 增加拓客成员
export const requestPostExpandMembers = params => { return axios.post(`${base}/projects/expandMembers`, params).then(res => res.data) }
// 修改拓客成员
export const requestPutExpandMembers = (params, memberId) => { return axios.put(`${base}/projects/expandMembers/${memberId}`, params).then(res => res.data) }
// 查询拓客成员列表
export const requestGetExpandMembersPage = params => { return axios.post(`${base}/projects/expandMembers/page`, params).then(res => res.data) }
// 置为离职
export const requestExpandMembersDimission = params => { return axios.put(`${base}/projects/expandMembers/dimission`, params).then(res => res.data) }
// 置为在职
export const requestExpandMembersOnJob = params => { return axios.put(`${base}/projects/expandMembers/onJob`, params).then(res => res.data) }
// 重置密码
export const requestExpandMembersPassword = params => { return axios.put(`${base}/projects/expandMembers/password`, params).then(res => res.data) }

/* ----------------------------------代理团队接口------------------------------------------- */
// 查询总代成员信息
export const requestGetAgencyTeamMembers = teamId => { return axios.get(`${base}/projects/agency/team/members/${teamId}`).then(res => res.data) }
// 增加代理团队
export const requestPostAgencyTeam = params => { return axios.post(`${base}/projects/agency/team`, params).then(res => res.data) }
// 查询代理团队
export const requestGetAgencyTeam = params => { return axios.get(`${base}/projects/agency/team`, { params: params }).then(res => res.data) }
// 修改代理团队
export const requestPutAgencyTeam = params => { return axios.put(`${base}/projects/agency/team`, params).then(res => res.data) }
// 删除代理团队
export const requestDeleteAgencyTeam = teamId => { return axios.delete(`${base}/projects/agency/team/${teamId}`).then(res => res.data) }
// 新增总代负责人
export const requestPostAgencyTeamMember = params => { return axios.post(`${base}/projects/agency/team/member`, params).then(res => res.data) }
// 修改总代负责人
export const requestPutAgencyTeamMember = params => { return axios.put(`${base}/projects/agency/team/member`, params).then(res => res.data) }
// 删除总代负责人
export const requestDeleteAgencyTeamMember = memberId => { return axios.delete(`${base}/projects/agency/team/member/${memberId}`).then(res => res.data) }

/* ------------------------------------房源管理接口----------------------------------------- */
// 获取楼栋
export const requestBuilding = params => { return axios.get(`${base}/projects/building`, { params: params }).then(res => res.data) }
// 获取单元
export const requestBuildingUnit = params => { return axios.get(`${base}/projects/building/unit`, { params: params }).then(res => res.data) }
// 修改楼栋
export const requestBuildingPut = params => { return axios.put(`${base}/projects/building`, params).then(res => res.data) }
// 设置特价房源
export const setBuildingDelete = (params) => { return axios.post(`${base}/projects/roomBrief/isDiscount`, params).then(res => res.data) }
// 删除楼栋
export const requestBuildingDelete = (params, buildingId) => { return axios.delete(`${base}/projects/building/${buildingId}`, { params: params }).then(res => res.data) }
// 获取房源
export const requestRoomBrief = params => { return axios.get(`${base}/projects/roomBrief`, { params: params }).then(res => res.data) }
export const requestRoomBriefList = params => { return axios.get(`${base}/projects/roomBrief/list`, { params: params }).then(res => res.data) }
// 导出房间
export const requestRoomBriefExport = params => { return axios.get(`${base}/projects/roomBrief/export`, { params: params, responseType: 'blob' }).then(res => res.data) }
// 查询导入进度
export const requestRoomBriefExportOwnerProcess = taskId => { return axios.get(`${base}/projects/roomBrief/updateOwner/process/${taskId}`, { LOAD_ING: true }).then(res => res.data) }
// 导出业主信息
export const requestRoomBriefExportOwner = params => { return axios.get(`${base}/projects/roomBrief/exportOwner`, { params: params, responseType: 'blob' }).then(res => res.data) }
// 删除房源
export const requestRoomBriefDelete = params => { return axios.delete(`${base}/projects/roomBrief/${params}`).then(res => res.data) }
// 批量删除房源
export const requestRoomBriefBatchDelete = params => { return axios.get(`${base}/projects/roomBrief/batchDelete`, { params: params }).then(res => res.data) }
// 修改房源
export const requestRoomBriefPut = params => { return axios.put(`${base}/projects/roomBrief`, params).then(res => res.data) }

// ---------------------------获取应用列表-------------------------- //
export const requestAuthAppsGet = params => { return axios.get(`${base}/tenant/tenant/appliance`, { params: params }).then(res => res.data) }
// ---------------------------获取充值记录 ------------------------- //
// --项目
export const requestAppActivityRulesGet = params => { return axios.get(`${base}/tenant/charging/usableActivity`, { params: params }).then(res => res.data) }
// --活动
export const requestAppProjectRulesGet = params => { return axios.get(`${base}/tenant/charging/usableProject`, { params: params }).then(res => res.data) }
// ---------------------------增加项目授权 ------------------------- //
export const requestSaveProjectAuthGet = params => { return axios.get(`${base}/tenant/bill`, { params: params }).then(res => res.data) }
export const requestSaveProjectSelectionGet = params => { return axios.get(`${base}/tenant/bill/view`, { params: params }).then(res => res.data) }
export const requestSaveProjectAuthPost = params => { return axios.post(`${base}/tenant/bill`, params).then(res => res.data) }
export const requestSaveProjectAuthDelete = params => { return axios.delete(`${base}/tenant/bill/${params}`).then(res => res.data) }
export const requestSaveProjectAuthPut = params => { return axios.put(`${base}/tenant/bill`, params).then(res => res.data) }

// ---------------------------ERP 同步 ------------------------------- //
export const requestSynchronizERPGet = params => { return axios.get(`${base}/inspection/api/get/syncBuildingAndRoomFromErp/${params}`).then(res => res.data) }
export const requestSynchronizERPProcessGet = params => { return axios.get(`${base}/inspection/api/get/syncFromErpProcess/${params}`).then(res => res.data) }
export const requestERPProjectsGet = params => { return axios.get(`${base}/inspection/api/get/syncProjectOfCompanyFromErp/${params.tenantId}/${params.outerCompanyGUID}`).then(res => res.data) }
// --------------------------用户定制--------------------------------- //
export const requestSaveWebsitePut = params => { return axios.put(`${base}/tenant/config`, params).then(res => res.data) }
export const requestWebsiteConfigGet = params => { return axios.get(`${base}/tenant/config`, { params: params }).then(res => res.data) }
export const requestLoginConfigGet = params => { return axios.get(`${base}/tenant/config/login`, { params: params }).then(res => res.data) }
// --------------------------线上认购--------------------------------- //
//流程配置
export const getFlowInfoByProjectId = params => { return axios.get(`${base}/signpay/subscribeConfig/getByProjectId/${params.projectId}`).then(res => res.data) }
export const saveFlowInfo = params => { return axios.post(`${base}/signpay/subscribeConfig/save`, params).then(res => res.data) }
export const updateFlowInfo = params => { return axios.post(`${base}/signpay/subscribeConfig/save`, params).then(res => res.data) }
//签约配置
export const getSignInfoByProjectId = params => { return axios.get(`${base}/signpay/signConfig/getByProjectId/${params.projectId}`).then(res => res.data) }
export const saveSignInfo = params => { return axios.post(`${base}/signpay/signConfig/save`, params).then(res => res.data) }
//支付配置
export const getPayInfoByProjectId = params => { return axios.get(`${base}/signpay/payConfig/getByProjectId/${params.projectId}`).then(res => res.data) }
export const savePayInfo = params => { return axios.post(`${base}/signpay/payConfig/save`, params).then(res => res.data) }
//小程序配置
export const getWeexInfo = params => { return axios.get(`${base}/signpay/appConfig/getByTenantId/${params.tenantId}`).then(res => res.data) }
export const saveWeexInfo = params => { return axios.post(`${base}/signpay/appConfig/save`, params).then(res => res.data) }
//客户管理
export const getCustomerList = params => { return axios.post(`${base}/signpay/onlineCustomer/listPage`, params).then(res => res.data) }
// 导出数据
export const excelExportCustomer = params => { return axios.post(`${base}/signpay/onlineCustomer/exportExcel`, params, { responseType: 'blob' }).then(res => res.data) }
export const getCustomerListByProjectId = params => { return axios.get(`${base}/signpay/customer/getByProjectId/${params.projectId}`).then(res => res.data) }
//认购管理
export const getSubscribeList = params => { return axios.post(`${base}/signpay/subscribeRecord/listPage`, params).then(res => res.data) }
// 导出数据
export const excelExportSubscribe = params => { return axios.post(`${base}/signpay/subscribeRecord/exportExcel`, params, { responseType: 'blob' }).then(res => res.data) }
//获取签约详情
export const getSignDetail = params => { return axios.get(`${base}/signpay/signResult/getBySubscribeResultId/${params.id}`).then(res => res.data) }
//获取支付详情
export const getPayDetail = params => { return axios.get(`${base}/signpay/payResult/getBySubscribeResultId/${params.subscribeId}`).then(res => res.data) }


// -------------------------- 获取所有项目 ---------------------------- //

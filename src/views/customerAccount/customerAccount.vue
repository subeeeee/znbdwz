<template>
  <div class="customerAccount">
    <div class="search">
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="项目名称：">
          <entryName @entryName="entryNameFun" v-on:listenTochildEvent="managerCustomersList"></entryName>
        </el-form-item>
        <el-form-item label="报备状态：">
          <el-select v-model="search.reportStatus" placeholder="请选择">
            <el-option v-for="(item, index) in reportStatusData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="search">
        <el-form-item label="客户状态：">
          <el-radio-group v-model="search.status">
            <el-radio-button :label="item.value" v-for="(item, index) in statusData" :key="index">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="search">
        <el-form-item label="时间类型：">
          <el-select v-model="search.timeType" placeholder="请选择" @change="changeTimeType">
            <el-option v-for="(item, index) in timeTypeData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-date-picker v-model="createTim" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setDate" value-format="yyyy-MM-dd HH:mm:ss" :disabled="search.timeType === ''"></el-date-picker>
      </el-form>
      <el-form :inline="true" :model="search">
        <el-form-item label="报备信息：">
          <el-select v-model="search.channelType" placeholder="渠道类型" @change="managerAgencyTeamChannelOptions" style="margin-right:8px;">
            <el-option v-for="(item, index) in channelTypeData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="search.channelId" placeholder="渠道名称" :disabled="channelIdData.length < 1" @change="managerAgencyTeamStoresOptions" style="margin-right:8px;">
            <el-option v-for="(item, index) in channelIdData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-select v-model="search.storeId" placeholder="报备团队" :disabled="storeIdData.length < 1">
            <el-option v-for="(item, index) in storeIdData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="报备人员："><el-input v-model.trim="search.reporterName" placeholder="报备人员" maxlength="50"></el-input></el-form-item>
      </el-form>
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="客户信息：" class="customer-information">
          <el-input v-model.trim="search.name" placeholder="客户姓名" maxlength="50" style="margin-right:8px"></el-input>
          <el-input v-model.trim="search.mobile" placeholder="客户手机" maxlength="50" style="margin-right:8px;"></el-input>
          <el-input v-model.trim="search.memberName" placeholder="置业顾问" maxlength="50"></el-input>
          <el-button type="primary" class="search-submit" icon="el-icon-search" @click="managerCustomersList('search')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12"><span class="list-title-text">客户台账</span></el-col>
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-download" @click="loadingFun">导 出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="list-table">
      <el-table-column type="index" label="编号" width="50"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="mobile" label="客户手机" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
          <el-tag effect="plain" v-if="scope.row.hideMobile === 1">隐号</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reportTime" label="报备时间" width="150"></el-table-column>
      <el-table-column prop="firstVisitTime" label="到访时间" width="150"></el-table-column>
      <el-table-column prop="reportStatus" label="客户状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.reportStatus !== 1 && scope.row.reportStatus !== 3">{{scope.row.statusName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reportStatusName" label="报备状态" width="100"></el-table-column>
      <el-table-column prop="reportSourceName" label="渠道类型" width="120"></el-table-column>
      <el-table-column prop="channelName" label="渠道名称" width="140"></el-table-column>
      <el-table-column prop="reporterName" label="报备人员" width="170">
      </el-table-column>
      <el-table-column prop="memberName" label="置业顾问" width="100"></el-table-column>
      <el-table-column label="管理" fixed="right">
        <template slot-scope="scope">
          <el-dropdown trigger="click" size="small">
            <el-button type="text" size="small">操作</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="managerCustomers(scope.row)">查看</el-dropdown-item>
              <el-dropdown-item @click.native="clickRecommend(scope.row)">推荐进度</el-dropdown-item>
              <el-dropdown-item @click.native="clickUserInformation(scope.row)">佣金</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="panke(scope.row)" v-if="scope.row.reportStatus === -1">判客</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <!-- dialog -->
    <el-dialog title="查看信息" :visible.sync="commissionsPop" width="850px" class="information-dialog el-dialog-body">
      <h3>基础信息</h3>
      <el-form :inline="true" class="commissions">
        <el-form-item label="客户姓名：">{{managerCustomersData.name}}</el-form-item>
        <el-form-item label="客户性别：">{{managerCustomersData.sex === 0 ? '男' : '女' }}</el-form-item>
        <el-form-item label="客户手机：">{{managerCustomersData.mobile}}</el-form-item>
      </el-form>
      <el-form :inline="true" class="commissions">
        <el-form-item label="客户状态：">{{managerCustomersData.statusName}}</el-form-item>
        <el-form-item label="置业顾问：">{{managerCustomersData.memberName}}</el-form-item>
        <el-form-item label="其他号码：">
            <el-tooltip class="item" effect="dark" :content="managerCustomersData.otherMobiles.join(',')" placement="top" v-if="managerCustomersData.otherMobiles">
              <span class="tel-intercept">
                {{managerCustomersData.otherMobiles.join(',')}}
              </span>
            </el-tooltip>
        </el-form-item>
      </el-form>
      <el-form :inline="true" class="commissions">
        <el-form-item label="报备时间：">{{managerCustomersData.reportTime}}</el-form-item>
        <el-form-item label="到访时间：">{{managerCustomersData.firstVisitTime}}</el-form-item>
        <el-form-item label="最后跟进：">{{managerCustomersData.lastFollowTime}}</el-form-item>
        <el-form-item class="commissions-item" label="备注：">{{managerCustomersData.remark}}</el-form-item>
      </el-form>
      <h3>报备信息</h3>
      <el-form :inline="true" class="commissions">
        <el-form-item label="是否渠道：">{{managerCustomersData.isChannel === 0 ? '是' : '否'}}</el-form-item>
        <el-form-item label="渠道名称：">{{managerCustomersData.channelName}}</el-form-item>
        <el-form-item label="所属门店：">{{managerCustomersData.storeName}}</el-form-item>
      </el-form>
      <el-form :inline="true" class="commissions">
        <el-form-item label="渠道类型：">{{managerCustomersData.reportSourceName}}</el-form-item>
        <el-form-item label="报备人员：">{{managerCustomersData.reporterName}}
        </el-form-item>
        <el-form-item label="报备有效期：">{{ managerCustomersData.reportStatus === -1?managerCustomersData.effectiveReportTime : '/'}}</el-form-item>
      </el-form>
      <el-form :inline="true" class="commissions">
        <el-form-item label="报备状态：">{{managerCustomersData.reportStatus | reportStatusFormate}}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commissionsPop = false" icon="el-icon-close">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="佣金管理" :visible.sync="userInformationPop" width="800px" @close="resetForm('userInformationForm')">
      <el-form :inline="true" :model="userInformationForm" ref="userInformationForm" class="lookCommission-dialog" label-width="100px" :rules="userInformationFormRules">
        <el-form-item label="项目名称：" prop="projectId">
          <el-select v-model="userInformationForm.projectId" placeholder="项目名称" disabled="disabled">
            <el-option v-for="(item, index) in userInformationFormProjectData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佣金类型：" prop="type">
          <el-select v-model="userInformationForm.type" placeholder="佣金类型">
            <el-option v-for="(item, index) in userInformationFormTypeData" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <!--  -->
        <el-form-item label="报备人姓名：">
          <el-input v-model="userInformationForm.Presentation" placeholder="报备人姓名" maxlength="200" disabled></el-input>
        </el-form-item>
        <el-form-item label="佣金：" prop="accounts">
          <el-input v-model="userInformationForm.accounts" placeholder="应付佣金" maxlength="11"></el-input> 元
        </el-form-item>
        <!--  -->
        <el-form-item label="邀请人姓名：" v-if="userInformationForm.Invitation">
          <el-input v-model="userInformationForm.Invitation" placeholder="邀请人姓名" maxlength="200" disabled></el-input>
        </el-form-item>
        <el-form-item label="邀请奖励：" v-if="userInformationForm.Invitation" prop="inviterAccounts">
          <el-input v-model="userInformationForm.inviterAccounts" placeholder="应付佣金" maxlength="11"></el-input> 元
        </el-form-item>
        <!--  -->
        <el-form-item label="备注信息：">
          <el-input v-model="userInformationForm.remark" placeholder="备注" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div style="width:36px;"></div>
        </el-form-item>
        <el-form-item class="lookCommission-submit">
          <el-button type="primary" class="search-submit" @click="postManagerCommission">添 加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="userInformationFormTable" class="lookCommission-table">
        <el-table-column prop="typeName" label="类型" width="140"></el-table-column>
        <el-table-column prop="firstLevelAccount" label="邀请奖励(元)" width="140"></el-table-column>
        <el-table-column prop="secondLevelAccount" label="报备佣金(元)" width="140"></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
        <!-- <el-table-column prop="name" label="管理">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteManagerCommissionInfo(scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('userInformationForm')" icon="el-icon-close">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="推荐进度" :visible.sync="recommendPop" width="650px" class="recommend_wrap">
      <ul class="recommend-list">
        <li v-for="(item, index) in clickRecommendData" :key="index">
          <div class="info">
            <i class="icon iconfont"></i><span>{{item.operateName}}</span><span>{{item.operateTimeName}}：{{item.operateTime}}</span>
          </div>
          <div class="other_info" v-if="['置为有效','置为无效'].includes(item.operateName)">
            <p>操作人：{{item.operatorName}}</p>
            <p>{{item.operateName.split('为')[1]}}原因：{{item.operateRemark}}</p>
          </div>
        </li>
      </ul>
    </el-dialog>
    <!--作废-->
    <el-dialog title="渠道判客" :visible.sync="pankePop" width="500px">
      <div class="panke-box">
        <el-radio v-model="CustomersDisableStatus.status" label="0" border size="medium">置为有效</el-radio>
        <el-radio v-model="CustomersDisableStatus.status" label="1" border size="medium">置为无效</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pankePop = false" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="putCustomersDisableStatus" icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import entryName from '../../components/entryName'
import { validateMoney, validateSelect, validateMoneyNoNull } from '../../common/fromVerification'
import { getManagerReporterModeOptions, getManagerReporterMode, ManagerCustomersCustomerStatus, managerCustomersTimeTypes, managerAgencyTeamChannelChannelTypes, managerAgencyTeamChannelOptions, managerAgencyTeamStoresOptions, managerCustomersList, exportManagerCustomersList, managerCustomers, customersReportHistory, postManagerCommission, managerCommissionTypes, getManagerCommission, deleteManagerCommission, getManagerCustomersReportStatus, putCustomersDisableStatus, getParentUser, getIdentityData } from '../../common/api'
let loadingInstance = null
const options = {
  lock: true,
  text: '努力加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.9)',
  zIndex: '50000'
}
export default {
  name: 'customerAccount',
  data () {
    return {
      createTim: '',
      search: {
        tenantId: '', // 租户Id
        projectId: '', // 项目名称 Id
        timeType: '', // 时间类型
        timeStart: '', // 开始时间
        timeEnd: '', // 结束时间
        status: '', // 客户状态
        channelType: '', // 渠道类型
        channelId: '', // 渠道名称
        storeId: '', // 报备团队
        reporterName: '', // 报备人员
        name: '', // 客户姓名
        mobile: '', // 客户手机
        memberName: '', // 置业顾问
        reportStatus: '' // 报备状态
      },
      reportStatusData: [],
      timeTypeData: [],
      statusData: [],
      channelTypeData: [],
      channelIdData: [],
      storeIdData: [],
      tableData: [],
      page: {
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 1
      },
      managerCustomersData: {},
      commissionsPop: false,
      userInformationPop: false,
      recommendPop: false,
      userInformationFormProjectData: [],
      userInformationFormTypeData: [],
      userInformationFormTable: [],
      userInformationForm: {
        projectId: '', // 项目ID
        tenantId: '', // 租户号
        registerId: '', // 报备客户
        type: '', // 佣金类型
        Invitation: null, // 邀请人姓名
        inviterAccounts: '', // 邀请人佣金
        Presentation: '', // 报备人姓名
        accounts: '', // 报备人佣金
        remark: '' // 备注
      },
      userInformationFormRules: {
        type: [
          { validator: validateSelect, trigger: 'blur' }
        ],
        accounts: [
          { validator: validateMoney, trigger: 'blur' }
        ],
        inviterAccounts: [
          { validator: validateMoneyNoNull, trigger: 'blur' }
        ]
      },
      clickRecommendData: [],
      pageNum: 0,
      dowExcelList: [],
      pankePop: false,
      CustomersDisableStatus: {
        registerId: '',
        status: ''
      },
      status: ''
    }
  },
  props: [ 'themeColor' ],
  created () {
    this.search.tenantId = sessionStorage.getItem('tenantId')
    if (sessionStorage.getItem('projectId')) {
      this.search.projectId = sessionStorage.getItem('projectId')
    } else {
      this.search.projectId = ''
    }
    this.ManagerCustomersCustomerStatus()
    this.managerCustomersTimeTypes()
    this.managerAgencyTeamChannelChannelTypes()
    this.managerCommissionTypes()
    this.getManagerCustomersReportStatus()
  },
  filters:{
    reportStatusFormate (value){
      switch (value) {
        case -1:
            return '已报备';
        case 0:
            return '有效';
        case 1:
            return '无效';
        default:
            return '--';
      }
    },
  },
  methods: {
    async getManagerReporterModeOptions (scope) {
      const result = await getManagerReporterModeOptions(`${sessionStorage.getItem('userId')}/${scope.projectId}`)
      this.getManagerReporterMode(result.data[0].modeId, scope)
    },
    async getManagerReporterMode (modeId, scope) {
      console.log(this.userInformationFormTypeData)
      this.userInformationFormTypeData.forEach(item => {
        item.disabled = true
      })
      // 2 已认筹   3 已认购   4 已签约
      // 1 带看佣金  3 成交佣金
      const result = await getManagerReporterMode(modeId)
      // === 带看佣金
      if (!this.status || this.status === '0') {
        this.userInformationFormTypeData.forEach(item => {
          if (item.value === '1') {
            item.disabled = true
          }
        })
      } else {
        this.userInformationFormTypeData.forEach(item => {
          if (item.value === '1') {
            item.disabled = false
          }
        })
      }
      // ==== 成交佣金
      const dealStatus = parseInt(result.data.dealStatus)
      const status = parseInt(scope.status)
      if (dealStatus === 2 && (status === 2 || status === 3 || status === 4)) {
        this.userInformationFormTypeData.forEach(item => {
          if (item.value === '3') {
            item.disabled = false
          }
        })
      }
      if (dealStatus === 3 && ((status === 3 || status === 4) && status)) {
        this.userInformationFormTypeData.forEach(item => {
          if (item.value === '3') {
            item.disabled = false
          }
        })
      }
      if (dealStatus === 4 && (status && status === 4)) {
        this.userInformationFormTypeData.forEach(item => {
          if (item.value === '3') {
            item.disabled = false
          }
        })
      }
      if (dealStatus !== 2 && dealStatus !== 3 && dealStatus !== 4) {
        this.userInformationFormTypeData.forEach(item => {
          if (item.value === '3') {
            item.disabled = true
          }
        })
      }
      this.userInformationPop = true
    },
    async panke (scope) {
      this.pankePop = true
      this.CustomersDisableStatus.status = ''
      this.CustomersDisableStatus.registerId = scope.registerId
    },
    async putCustomersDisableStatus () {
      if (this.CustomersDisableStatus.status === '') {
        this.$message.error('请选择客户状态')
        return false
      }
      const result = await putCustomersDisableStatus(`${this.CustomersDisableStatus.registerId}/${this.CustomersDisableStatus.status}`)
      if (result.code === 200) {
        this.pankePop = false
        this.$message.success('设置成功')
        this.managerCustomersList()
      } else {
        this.$message.error(result.message)
      }
    },
    loadingFun () {
      loadingInstance = Loading.service(options)
      this.exportExcel()
      this.dowExcelList = []
    },
    async exportExcel () {
      this.pageNum++
      let projectId = sessionStorage.getItem('projectId') === null ? '' : sessionStorage.getItem('projectId')
      let url = `?tenantId=${sessionStorage.getItem('tenantId')}&projectId=${projectId}&timeType=${this.search.timeType}`
      url += `&timeStart=${this.search.timeStart}&timeEnd=${this.search.timeEnd}&status=${this.search.status}&reportStatus=${this.search.reportStatus}`
      url += `&channelType=${this.search.channelType}&channelId=${this.search.channelId}&storeId=${this.search.storeId}`
      url += `&reporterName=${this.search.reporterName}&name=${this.search.name}&mobile=${this.search.mobile}&memberName=${this.search.memberName}`
      url += `&currentPage=${this.pageNum}&pageSize=1000`
      const result = await exportManagerCustomersList(`${url}`)
      this.dowExcelList = this.dowExcelList.concat(result.data)
      let totalPage = result.page.pageCount
      let currentPage = result.page.currentPage
      let Speed = parseInt((currentPage / totalPage) * 100)
      loadingInstance.text = `导出进度 ${Speed}%`
      if (totalPage > currentPage) {
        this.exportExcel()
      } else {
        this.pageNum = 0
        loadingInstance.text = `导出进度完成开始下载`
        setTimeout(() => {
          loadingInstance.close()
          this.dowExcelList.forEach((item, index) => {
            if (this.dowExcelList[index].sex === 1) {
              this.dowExcelList[index].sex = '男'
            } else {
              this.dowExcelList[index].sex = '女'
            }
          })
          this.export2Excel()
        }, 1000)
      }
    },
    excelFormatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    export2Excel () {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../vendor/Export2Excel')
        const tHeader = [
          '项目名称',
          '客户姓名',
          '客户手机',
          '报备时间',
          '到访时间',
          '客户状态',
          '报备状态',
          '渠道类型',
          '渠道名称',
          '报备人员',
          '客户性别',
          '置业顾问',
          '客户备注',
          '最后到访时间',
          '最近跟进时间',
          '认筹时间',
          '认购时间',
          '签约时间',
          '回款时间'
        ]
        const filterVal = [
          'projectName',
          'name',
          'mobile',
          'reportTime',
          'firstVisitTime',
          'statusName',
          'reportStatusName',
          'reportSourceName',
          'channelName',
          'reporterName',
          'sex',
          'memberName',
          'remark',
          'lastVisitTime',
          'lastFollowTime',
          'recognitionTime',
          'subscriptionTime',
          'signTime',
          'receivedPaymentsTime'
        ]
        const data = this.excelFormatJson(filterVal, this.dowExcelList)
        const d = new Date()
        const myYear = d.getFullYear()
        const myMonth = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
        const myDate = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
        const myHours = d.getHours()
        const myMinutes = d.getMinutes()
        const mySeconds = d.getSeconds()
        const _time = '' + myYear + myMonth + myDate + myHours + myMinutes + mySeconds
        exportJsonToExcel(tHeader, data, '客户台账_' + _time)
      })
    },
    async clickRecommend (scope) {
      const result = await customersReportHistory(`${scope.registerId}`)
      // debugger
      if (result.code === 200) {
        this.recommendPop = true
        this.clickRecommendData = result.data
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 报备状态
    async getManagerCustomersReportStatus () {
      const result = await getManagerCustomersReportStatus(``)
      if (result.code === 200) {
        this.reportStatusData = [
          {
            value: '',
            label: '全部'
          }
        ]
        for (let item in result.data) {
          let obj = {
            value: item,
            label: result.data[item]
          }
          this.reportStatusData.push(obj)
        }
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 时间类型
    async managerCustomersTimeTypes () {
      const result = await managerCustomersTimeTypes('')
      const data = result.data
      this.timeTypeData = this.formatJsonAll(data)
    },
    // 获取客户状态
    async ManagerCustomersCustomerStatus () {
      const result = await ManagerCustomersCustomerStatus('')
      const data = result.data
      this.statusData = this.formatJsonAll(data)
    },
    // 渠道来源
    async managerAgencyTeamChannelChannelTypes () {
      const result = await managerAgencyTeamChannelChannelTypes('')
      //查询租户配置的所有非渠道身份
      let identityList = []
      let identityData = {}
      const result1 = await getIdentityData({ type: 5, tenantId: sessionStorage.getItem('tenantId') })
      if (result.code === 200) {
        identityList = [...result1.data]
      }
      identityList.forEach((item)=>{
        if(item.checked){
          identityData[item.identity] = item.identityName
        }
      })
      const data = Object.assign(result.data,identityData)

      this.channelTypeData = this.formatJsonAll(data)
    },
    // 渠道列表
    async managerAgencyTeamChannelOptions () {
      if(['2','3','4'].indexOf(this.search.channelType) !== -1){
        this.search.channelId = ''
        this.search.storeId = ''
        this.channelIdData = []
        this.storeIdData = []
        const result = await managerAgencyTeamChannelOptions(`?projectId=${this.search.projectId}&tenantId=${sessionStorage.getItem('tenantId')}&channelType=${this.search.channelType}`)
        const data = result.data
        if (result.code === 200) {
          let list = [
            {
              label: '全部',
              value: ''
            }
          ]
          for (let i = 0; i < data.length; i++) {
            let json = {
              label: data[i].channelName,
              value: data[i].channelId
            }
            list.push(json)
          }
          this.channelIdData = list
        } else if (result.code !== 200 && result.code !== 401) {
          this.$message.error(result.message)
        }
      }else{
        this.channelIdData = []
      }
    },
    // 报备团队列表
    async managerAgencyTeamStoresOptions () {
      if(this.search.channelId){
        this.search.storeId = ''
        const result = await managerAgencyTeamStoresOptions(`?channelId=${this.search.channelId}`)
        const data = result.data
        let list = [
          {
            label: '全部',
            value: ''
          }
        ]
        for (let i = 0; i < data.length; i++) {
          let json = {
            label: data[i].storeName,
            value: data[i].storeId
          }
          list.push(json)
        }
        this.storeIdData = list
      }else{
        this.storeIdData = []
      }
    },
    // 客户台账 列表
    async managerCustomersList (type='') {
      let projectId = sessionStorage.getItem('projectId') === null ? '' : sessionStorage.getItem('projectId')
      let url = `?tenantId=${sessionStorage.getItem('tenantId')}&projectId=${projectId}&timeType=${this.search.timeType}`
      url += `&timeStart=${this.search.timeStart}&timeEnd=${this.search.timeEnd}&status=${this.search.status}&reportStatus=${this.search.reportStatus}`
      url += `&channelType=${this.search.channelType}&channelId=${this.search.channelId}&storeId=${this.search.storeId}`
      url += `&reporterName=${this.search.reporterName}&name=${this.search.name}&mobile=${this.search.mobile}&memberName=${this.search.memberName}`
      url += `&currentPage=${type===''?this.page.currentPage:1}&pageSize=${this.page.pageSize}`
      const result = await managerCustomersList(`${url}`)
      // debugger
      if (result.code === 200) {
        if(+result.page.recordCount < 0){
          this.page.currentPage = 1
          this.page.pageSize = 10
          this.managerCustomersList()
        }else{
          this.tableData = result.data
          this.page.currentPage = result.page.currentPage
          this.page.total = parseInt(result.page.recordCount)
          this.page.pageSize = result.page.pageSize
        }
      } else {
        this.$message.warning(result.message)
      }
    },
    // 查看台账
    async managerCustomers (item) {
      const result = await managerCustomers(`${item.registerId}`)
      if (result.code === 200) {
        this.commissionsPop = true
        this.managerCustomersData = result.data
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 佣金类型
    async managerCommissionTypes () {
      const result = await managerCommissionTypes(``)
      this.userInformationFormTypeData = []
      for (let i in result.data) {
        if (i !== '2') {
          let json = {
            label: result.data[i],
            value: i,
            disabled: true
          }
          this.userInformationFormTypeData.push(json)
        }
      }
    },
    // 添加佣金管理 提交
    postManagerCommission () {
      this.$refs.userInformationForm.validate(async (valid) => {
        if (valid) {
          const result = await postManagerCommission(this.userInformationForm)
          if (result.code === 200) {
            this.userInformationForm.inviterAccounts = ''
            this.userInformationForm.accounts = ''
            this.userInformationForm.remark = ''
            this.getManagerCommission()
          } else {
            this.$message.error(result.message)
          }
        }
      })
    },
    async getManagerCommission () {
      const result = await getManagerCommission(`${this.userInformationForm.registerId}`)
      if (result.code === 200) {
        this.userInformationFormTable = result.data
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    async deleteManagerCommission (scope) {
      const result = await deleteManagerCommission(`${this.userInformationForm.registerId}/${scope.type}`)
      if (result.code === 200) {
        this.getManagerCommission()
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 获取邀请人
    async getParentUser (scope) {
      const result = await getParentUser(`${scope.reporterId}`)
      this.userInformationForm.Presentation = scope.reporterName
      result.data ? this.userInformationForm.Invitation = result.data.name : this.userInformationForm.Invitation = null
    },
    clickUserInformation (scope) {
      this.getManagerReporterModeOptions(scope)
      this.status = scope.status
      let item = {
        label: scope.projectName,
        value: scope.projectId
      }
      this.userInformationFormProjectData = [item]
      this.userInformationForm.projectId = scope.projectId
      this.userInformationForm.registerId = scope.registerId
      this.userInformationForm.tenantId = sessionStorage.getItem('tenantId')
      this.userInformationForm.type = ''
      this.userInformationForm.accounts = ''
      this.userInformationForm.inviterAccounts = ''
      this.userInformationForm.remark = ''
      this.getParentUser(scope)
      this.getManagerCommission()
    },
    // 删除佣金记录
    deleteManagerCommissionInfo (scope) {
      this.$confirm('此操作将永久删除当前项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteManagerCommission(scope)
      }).catch(() => {
      })
    },
    // 切换时间类型
    changeTimeType (v) {
      if (v === '') {
        this.createTim = ''
        this.search.timeStart = ''
        this.search.timeEnd = ''
      }
    },
    setDate (a) {
      if (a) {
        this.search.timeStart = a[0]
        this.search.timeEnd = a[1]
      } else {
        this.search.timeStart = ''
        this.search.timeEnd = ''
      }
    },
    // 切换项目
    entryNameFun (res) {
      this.search.projectId = res
    },
    // 分页
    handleSizeChange (val) {
      this.page.pageSize = val
      this.managerCustomersList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.managerCustomersList()
    },
    formatJsonAll (data) {
      let list = [
        {
          label: '全部',
          value: ''
        }
      ]
      for (let item in data) {
        let json = {
          label: data[item],
          value: item
        }
        list.push(json)
      }
      return list
    },
    formatJson (data) {
      let list = []
      for (let item in data) {
        let json = {
          label: data[item],
          value: item
        }
        list.push(json)
      }
      return list
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.userInformationPop = false
    }
  },
  components: {
    entryName
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.customerAccount{
  .information-dialog{
    h3{font-size:14px;margin-bottom:20px;}
    .commissions{
      .el-form-item.el-form-item--small{width:31%;}
      .el-form-item.commissions-item.el-form-item--small{width:100%;display:flex;}
      .el-form-item.el-form-item--mini{width:31%;}
      .el-form-item.commissions-item.el-form-item--mini{width:100%;}
    }
  }
  .lookCommission-dialog{
    .el-input.el-input--mini{width:200px;}
    .lookCommission-submit{padding-left:50px;}
  }
  .lookCommission-table{width:100%;border-top:3px solid #ebeef5;
    .el-table__body-wrapper.is-scrolling-none{height:159px;}
  }
  .tel-intercept{display:inline-block;width:150px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden; position: absolute;}
  .customer-information{
    .el-input.el-input--mini{margin-right:12px;}
  }
  .recommend_wrap{
    .el-dialog__body{
      max-height: 380px;overflow-y: auto;
    }
    .recommend-list{border-left:2px solid #ccc;padding-left:20px;margin-left:40px;
      li{
        min-height:32px;position:relative;color:#ccc;margin-bottom:16px;
        display: flex;
        flex-direction: column;
        .info{display:flex;line-height:30px;
          span:nth-child(2){width:280px;padding-left:0px;}
          i.iconfont{position:absolute;left:-31px;top:8px;color:#ccc;transform: rotate(180deg);background:#fff;width:20px;height:14px;line-height:14px;}
          &:first-child{
            color:#333;
            i.iconfont{color:#3e8bdf}
          }
        }
        .other_info{
          line-height:18px;color:#ccc;font-size: 12px;
        }
      }
    }
  }
  .panke-box{padding:30px 0;text-align:center;
    .el-radio{margin:0 30px;}
  }
}
</style>

<template>
  <div class="customerDistribute">
    <div class="search">
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="项目名称：">
          <entryName @entryName="entryNameFun" from="distribute" v-on:listenTochildEvent="distributeCustomersList"></entryName>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="search.reportStatus" placeholder="请选择" @change="changeReportStatus">
            <el-option v-for="(item, index) in reportStatusData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="客户信息：" class="customer_information">
          <el-input v-model.trim="search.name" placeholder="客户姓名" maxlength="50" style="margin-right:8px"></el-input>
          <el-input v-model.trim="search.mobile" placeholder="客户手机" maxlength="50" style="margin-right:8px;"></el-input>
          <el-button type="primary" class="search-submit" icon="el-icon-search" @click="distributeCustomersList('search')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12">
        <el-button type="primary" @click="setValid">批量分配</el-button>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" icon="el-icon-download" @click="loadingFun">导 出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="list-table" empty-text="无数据" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="index" label="编号" width="60"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="100"></el-table-column>
      <el-table-column prop="mobile" label="客户手机" width="120"></el-table-column>
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
        <template slot-scope="scope">
          {{scope.row.reporterName + (scope.row.reporterMobile?("（"+scope.row.reporterMobile+"）"):'')}}
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="置业顾问" width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" class="operate" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="managerCustomers(scope.row)">查看</el-button>
          <el-button type="text" @click="distributeOpen(scope.row)">分配</el-button>
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
    <el-dialog title="查看信息" :visible.sync="commissionsPop" width="850px" class="information_dialog el-dialog-body">
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
              <span class="tel_intercept">
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
        <el-form-item label="报备人员：">{{managerCustomersData.reporterName + (managerCustomersData.reporterMobile?("（"+managerCustomersData.reporterMobile+"）"):'')}}</el-form-item>
        <el-form-item label="报备有效期：">{{ managerCustomersData.reportStatus === -1?managerCustomersData.effectiveReportTime : '/'}}</el-form-item>
      </el-form>
      <el-form :inline="true" class="commissions">
        <el-form-item label="报备状态：">{{managerCustomersData.reportStatus | reportStatusFormate}}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commissionsPop = false" icon="el-icon-close">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配置业顾问" :visible.sync="distributePop" width="700px">
      <div class="distribute-box">
        <el-input placeholder="顾问姓名/手机号" v-model="CustomersSearch.name" size="medium">
          <el-button slot="append" icon="el-icon-search" @click="searchCustomers"></el-button>
        </el-input>
<!--        @selection-change="handleSelectionChange2" @select="selectCustomer" @select-all="selectCustomerAll"-->
        <el-table ref="multipleTable" :data="customerList" class="list_table" empty-text="无数据" highlight-current-row @current-change="getCurrentRow" >
          <el-table-column width="55">
            <template slot-scope="scope" >
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="110"></el-table-column>
          <el-table-column prop="mobile" label="手机号" width="130"></el-table-column>
          <el-table-column prop="identity" label="角色" width="130">
            <template slot-scope="scope">
              <span>{{scope.row.identity | roleTypeFormate}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="teamName" label="所属团队" min-width="120"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2"
          :current-page="page2.pageNum"
          :page-sizes="page2.pageSizes"
          :page-size="page2.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page2.total">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributePop = false" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="setDistribute" icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import entryName from '../../components/entryName'
import { validateMoney, validateSelect, validateMoneyNoNull } from '../../common/fromVerification'
import {
  distributeCustomersList,
  exportDistributeCustomersList,
  setDistribute,
  managerCustomers,
  getIdentityData,
  managerAgencyTeamChannelChannelTypes,
  managerAgencyTeamChannelOptions,
  managerAgencyTeamStoresOptions,
  getDistributeList,
} from '../../common/api'
let loadingInstance = null
const options = {
  lock: true,
  text: '努力加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.9)',
  zIndex: '50000'
}
export default {
  name: 'customerDistribute',
  components: {
    entryName
  },
  data () {
    return {
      multipleSelection: [],
      search: {
        tenantId: '', // 租户Id
        projectId: '', // 项目名称 Id
        channelType: '', // 渠道类型
        channelId: '', // 渠道名称
        storeId: '', // 报备团队
        reporterName: '', // 报备人员
        name: '', // 客户姓名
        mobile: '', // 客户手机
        reportStatus: '-1' // 报备状态
      },
      reportStatusData: [{
        value: '-1',
        label: '待分配'
      }],
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
      managerCustomersData: {},//查看详情
      commissionsPop: false,//查看
      pageNum: 0,
      dowExcelList: [],
      distributePop: false,
      registerIds: [],
      // memberIdSelected:'',//顾问id，分配用
      customerList:[],//待选择的客户列表
      CustomersSearch: {
        name:'',
      },
      page2: {
        pageNum: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 1
      },
      multipleSelection2: [],
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
    this.managerAgencyTeamChannelChannelTypes()
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
    roleTypeFormate (value){
      switch (value) {
        case 0:
          return '置业顾问';
        case 1:
          return '销售组长';
        case 2:
          return '团队经理';
        case 3:
          return '销售经理';
        case 4:
          return '分接';
        default:
          return '--';
      }
    },
  },
  methods: {
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
        this.search.channelId = ''
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
        this.search.channelId = ''
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
    //搜索状态切换，立即执行搜索
    changeReportStatus(){
      this.distributeCustomersList()
    },
    // 客户台账 列表
    async distributeCustomersList (type='') {
      let projectId = sessionStorage.getItem('projectId')
      if(projectId){
        let url = `?tenantId=${sessionStorage.getItem('tenantId')}&projectId=${projectId}`
        url += `&channelType=${this.search.channelType}&channelId=${this.search.channelId}&storeId=${this.search.storeId}`
        url += `&reporterName=${this.search.reporterName}&name=${this.search.name}&mobile=${this.search.mobile}`
        url += `&currentPage=${type===''?this.page.currentPage:1}&pageSize=${this.page.pageSize}`
        const result = await distributeCustomersList(`${url}`)
        // debugger
        if (result.code === 200) {
          if(+result.page.recordCount < 0){
            this.page.currentPage = 1
            this.page.pageSize = 10
            this.distributeCustomersList()
          }else{
            this.tableData = result.data
            this.page.currentPage = result.page.currentPage
            this.page.total = parseInt(result.page.recordCount)
            this.page.pageSize = result.page.pageSize
          }
        } else {
          this.$message.warning(result.message)
        }
      }else{
        this.$message.warning('请选择一个项目')
      }
    },
    //分配窗口
    async distributeOpen (obj = {}) {
      this.multipleSelection2 = []
      this.CustomersSearch.name = ''
      this.registerIds = []
      this.registerIds.push(obj.registerId)
      this.searchCustomers()
      this.distributePop = true
    },
    //批量分配
    setValid(){
      if(!this.multipleSelection.length){
        this.$message.warning("请选择客户")
      }else{
        this.multipleSelection2 = []
        this.CustomersSearch.name = ''
        this.registerIds = this.multipleSelection.map(item=>{
          return item.registerId
        })
        this.CustomersSearch.name = ''
        this.searchCustomers()
        this.distributePop = true
      }
    },
    //获取可分配的人员列表
    async searchCustomers () {
      let queryData = {
        name: this.CustomersSearch.name,
        currentPage: this.page2.pageNum,
        pageSize: this.page2.pageSize,
        projectId:this.search.projectId
      }
      const result = await getDistributeList(queryData)
      if (result.code === 200) {
        if(+result.data.size < 0){
          this.page.pageNum = 1
          this.page.pageSize = 10
          this.searchCustomers()
        }else{
          this.customerList = result.data
          this.page2.pageNum = result.page.currentPage
          this.page2.total = parseInt(result.page.recordCount)
          this.page2.pageSize = result.page.pageSize
          // 清空选中的元素
          this.multipleSelection2 = []
        }
      } else {
        this.$message.warning(result.message)
      }
    },
    // 把多选换成单选  添加checkbox 展示选中
    getCurrentRow(row) {
      this.multipleSelection2 = [row]
      this.customerList.forEach(item => {
        item.checked = false
      })
      if(row) {
        row.checked = true
      }

    },
    //全选
    selectCustomerAll(){
      this.$message.warning('不可全选，只能单选')
      this.$refs.multipleTable.clearSelection()
    },
    // 当用户手动勾选数据行的 Checkbox时触发的事件,确保只能选中一项数据
    selectCustomer(selection, row){
      selection.forEach(i=>{
        this.$refs.multipleTable.toggleRowSelection(i, false,false);
      })
      // this.$refs.multipleTable.clearSelection()
      // if(selection.length == 0) return false
      this.$refs.multipleTable.toggleRowSelection(row, true,false);
       this.multipleSelection2 = [row]
    },
    //可分配的人员列表的选中事件,当选择项发生变化时会触发该事件，进行赋值
    handleSelectionChange2(val) {
      this.multipleSelection2 = val
    },
    // 分页
    handleSizeChange2 (val) {
      this.page2.pageSize = val
      this.searchCustomers()
    },
    handleCurrentChange2 (val) {
      this.page2.pageNum = val
      this.searchCustomers()
    },
    //执行分配
    async setDistribute () {
      if(!this.multipleSelection2[0]) {
        this.$message.error('请选择置业顾问')
        return

      }
      let queryData = {
        memberId: this.multipleSelection2[0]['memberId'], //顾问id
        registerIds:this.registerIds,
        managerId:sessionStorage.getItem('managerId')//当前登录管理员的id
      }
      const result = await setDistribute(queryData)

      if (result.code === 200) {
        this.distributePop = false
        // this.$message.success('设置成功')
        this.$message.success(result.message)
        this.distributeCustomersList()
      } else {
        this.$message.error(result.message)
      }
    },
    //表格的选中事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
    // 切换项目
    entryNameFun (res) {
      this.search.projectId = res
    },
    // 分页
    handleSizeChange (val) {
      this.page.pageSize = val
      this.distributeCustomersList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.distributeCustomersList()
    },
    loadingFun () {
      loadingInstance = Loading.service(options)
      this.exportExcel()
      this.dowExcelList = []
    },
    async exportExcel () {
      this.pageNum++
      let projectId = sessionStorage.getItem('projectId') === null ? '' : sessionStorage.getItem('projectId')
      let url = `?tenantId=${sessionStorage.getItem('tenantId')}&projectId=${projectId}`
      // 导出暂时不需要报备状态  bug:2720
      // url += `&reportStatus=${this.search.reportStatus}`
      // url += `&reportStatus=${this.search.reportStatus}`
      url += `&channelType=${this.search.channelType}&channelId=${this.search.channelId}&storeId=${this.search.storeId}`
      url += `&reporterName=${this.search.reporterName}&name=${this.search.name}&mobile=${this.search.mobile}&memberName=${this.search.memberName}`
      url += `&currentPage=${this.pageNum}&pageSize=1000`
      const result = await exportDistributeCustomersList(`${url}`)
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
        exportJsonToExcel(tHeader, data, '渠道分配_' + _time)
      })
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
    },
  }
}
</script>
<style lang="scss">
.customerDistribute{
  .el-table th>.cell{
    padding-left:14px;
    padding-right:14px;
  }
  .information_dialog{
    h3{font-size:14px;margin-bottom:20px;}
    .commissions{
      .el-form-item.el-form-item--small{width:31%;}
      .el-form-item.commissions-item.el-form-item--small{width:100%;display:flex;}
      .el-form-item.el-form-item--mini{width:31%;}
      .el-form-item.commissions-item.el-form-item--mini{width:100%;}
    }
  }
  .tel_intercept{display:inline-block;width:150px;white-space:nowrap;text-overflow:ellipsis;overflow: hidden; position: absolute;}
  .customer_information{
    .el-input.el-input--mini{margin-right:12px;}
  }
  .distribute-box{
    padding:0 16px 0px;
    text-align: left;
    .el-radio{
      margin:16px 0px;
    }
  }
  .list_table{
    margin-top:16px;
    border-top:2px solid rgb(1, 108, 254);
  }
}
</style>

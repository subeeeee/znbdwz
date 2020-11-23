<template>
  <div class="RegisteredUser">
    <div class="search">
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="项目名称：">
          <entryName @entryName="entryNameFun"></entryName>
        </el-form-item>
        <el-form-item label="报备时间：">
          <el-date-picker v-model="createTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setDate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="用户身份：">
          <el-radio-group v-model="search.identity" size="mini">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="2">中介公司</el-radio-button>
            <el-radio-button label="3">代理公司</el-radio-button>
            <el-radio-button label="4">合作伙伴</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="排列顺序：">
          <el-radio-group v-model="search.sort" size="mini">
            <el-radio-button label="allNum">报备数据</el-radio-button>
            <el-radio-button label="visitNum">到访数量</el-radio-button>
            <el-radio-button label="recognitionNum">认筹数量</el-radio-button>
            <el-radio-button label="visitProportion">到访率</el-radio-button>
            <el-radio-button label="buyProportion">购买率</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-submit" icon="el-icon-search" @click="getStatisticsGetOrganizationReportList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12">
        <span class="list-title-text">用户报备统计</span>
        <el-popover
          placement="top-start"
          title="说明"
          width="360"
          trigger="hover">
          <div class="text">
            到访率 = ( 已到访 + 已认筹 + 已认购 + 已签约 ) &divide; 全部报备<br />
            购买率 = ( 已认筹 + 已认购 + 已签约 ) &divide; 全部报备
          </div>
          <i class="el-icon-info el-icon-info-zp" slot="reference" :style="'color:' + themeColor"></i>
        </el-popover>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" class="search-submit" icon="el-icon-download" @click="loadingFun">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="list-table" style="width:100%;">
      <el-table-column prop="channelTypeName" label="渠道类型"></el-table-column>
      <el-table-column prop="teamName" width="200" label="渠道名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="storeNum" label="店员总数"></el-table-column>
      <el-table-column prop="allNum" label="全部报备"></el-table-column>
      <el-table-column prop="notVisitNum" label="未到访"></el-table-column>
      <el-table-column prop="visitNum" label="已到访"></el-table-column>
      <el-table-column prop="recognitionNum" label="已认筹"></el-table-column>
      <el-table-column prop="subscriptionNum" label="已认购"></el-table-column>
      <el-table-column prop="signNum" label="已签约"></el-table-column>
      <el-table-column prop="visitProportion" label="到访率">
        <template slot-scope="scope">
          {{scope.row.visitProportion}} %
        </template>
      </el-table-column>
      <el-table-column prop="buyProportion" label="购买率">
        <template slot-scope="scope">
          {{scope.row.buyProportion}} %
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="search.currentPage"
      :page-sizes="page.pageSizes"
      :page-size="search.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
  </div>
</template>
<script>
import entryName from '../../components/entryName'
import { Loading } from 'element-ui'
import { getStatisticsGetOrganizationReportList, getDownStatisticsGetOrganizationReportList } from '../../common/api'
let loadingInstance = null
const options = {
  lock: true,
  text: '努力加载中...',
  spinner: 'el-icon-loading',
  background: 'rgba(255, 255, 255, 0.9)',
  zIndex: '50000'
}
export default {
  name: 'registeredUser',
  data () {
    return {
      createTime: '',
      search: {
        tenantId: sessionStorage.getItem('tenantId'), // 租户号
        projectId: '', // 项目名称
        createTimeStart: '', // 创建开始时间
        createTimeEnd: '', // 创建结束时间
        identity: '', // 用户身份
        sort: 'allNum', // 排列顺序
        currentPage: 1, // 当前页
        pageSize: 10 // 当前页条数
      },
      page: {
        pageSizes: [10, 20, 50, 100],
        total: 1
      },
      tableData: [],
      dowExcelList: [],
      dowCurrentPage: 0
    }
  },
  props: [ 'themeColor' ],
  created () {
    if (sessionStorage.getItem('projectId')) {
      this.search.projectId = sessionStorage.getItem('projectId')
    }
    this.getStatisticsGetOrganizationReportList()
  },
  methods: {
    // 用户报备统计
    async getStatisticsGetOrganizationReportList () {
      const result = await getStatisticsGetOrganizationReportList(this.search)
      this.tableData = result.data
      this.page.total = parseInt(result.page.recordCount)
    },
    // 设置 报备时间
    setDate (time) {
      if (time) {
        this.search.createTimeStart = time[0]
        this.search.createTimeEnd = time[1]
      } else {
        this.search.createTimeStart = ''
        this.search.createTimeEnd = ''
      }
    },
    // 切换项目
    entryNameFun (res) {
      this.search.projectId = res
    },
    // 分页
    handleSizeChange (val) {
      this.search.pageSize = val
      this.getStatisticsGetOrganizationReportList()
    },
    handleCurrentChange (val) {
      this.search.currentPage = val
      this.getStatisticsGetOrganizationReportList()
    },
    // 导出的方法
    loadingFun () {
      loadingInstance = Loading.service(options)
      this.dowExcelList = []
      this.dowCurrentPage = 0
      this.getExportExcelData()
    },
    async getExportExcelData () {
      this.dowCurrentPage++
      const params = `?tenantId=${this.search.tenantId}&projectId=${this.search.projectId}&createTimeStart=${this.search.createTimeStart}
                      &createTimeEnd=${this.search.createTimeEnd}&identity=${this.search.identity}&sort=${this.search.sort}
                      &pageSize=10&currentPage=${this.dowCurrentPage}`
      const result = await getDownStatisticsGetOrganizationReportList(params)
      this.dowExcelList = this.dowExcelList.concat(result.data)
      if (this.dowCurrentPage < result.page.pageCount) {
        let totalPage = result.page.pageCount
        let currentPage = result.page.currentPage
        let Speed = parseInt((currentPage / totalPage) * 100)
        loadingInstance.text = `导出进度 ${Speed}%`
        this.getExportExcelData(params)
      } else {
        this.export2Excel()
      }
    },
    export2Excel () {
      loadingInstance.text = `导出进度完成开始下载`
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../vendor/Export2Excel')
        const tHeader = ['渠道类型', '渠道名称', '店员总数', '全部报备', '未到访', '已到访', '已认筹', '已认购', '已签约', '到访率', '购买率'] // 上面设置Excel的表格第一行的标题
        const filterVal = ['channelTypeName', 'teamName', 'storeNum', 'allNum', 'notVisitNum', 'visitNum', 'recognitionNum', 'subscriptionNum', 'signNum', 'visitProportion', 'buyProportion'] // 上面的index、nickName、name是tableData里对象的属性
        const list = this.dowExcelList // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        const d = new Date()
        const myYear = d.getFullYear()
        const myMonth = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
        const myDate = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
        const myHours = d.getHours()
        const myMinutes = d.getMinutes()
        const mySeconds = d.getSeconds()
        const _time = '' + myYear + myMonth + myDate + myHours + myMinutes + mySeconds
        let excelName = sessionStorage.getItem('projectName') ? sessionStorage.getItem('projectName') : '全部'
        exportJsonToExcel(tHeader, data, `机构报备统计_${excelName}_${_time}`)
      })
      setTimeout(() => {
        loadingInstance.close()
      }, 500)
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  components: {
    entryName
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>

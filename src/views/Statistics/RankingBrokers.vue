<template>
  <div class="RegisteredUser">
    <div class="search">
      <el-form :inline="true" :model="search">
        <el-form-item label="注册时间：">
          <el-date-picker v-model="createTim" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setDate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-submit" @click="getStatisticsGetAgentRankList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="explain">
      更新时间：统计数据更新至每日凌晨00:00，也就是仅能查看昨日之前的数据。如您用业务管理模块查看/导出的实时数据与本统计报表做对比，可能发现数据不一致。<br />
      统计范围：本报表仅统计由全民营销产生的业务数据，因此可能与售楼系统或其它案场销售管理工具的数据有不一致之处。<br />
      影响因素：如您曾做过修改佣金发放条件、手工修改客户交易状态等操作，可能会导致部分数据有一定表面的误差。
    </div>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12"><span class="list-title-text">经纪人排行表 <i class="icon iconfont icon-shuoming" :style="{color:themeColor}" @click="dialogVisible = true"></i>数据统计截止时间：{{stopTime}}</span></el-col>
      <el-col :span="12">
        <el-button type="primary" class="search-submit" @click="getStatisticsGetAgentRankList">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="list-table" style="width:100%;min-height:400px;">
      <el-table-column type="index" label="编号" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名" width="130"></el-table-column>
      <el-table-column label="性别" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 0 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="注册号码" width="120"></el-table-column>
      <el-table-column prop="parentName" label="邀请人" width="120"></el-table-column>
      <el-table-column prop="identityName" label="用户身份" width="100"></el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="180"></el-table-column>
      <el-table-column prop="statusName" label="用户状态" width="120"></el-table-column>
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
    <!--  -->
    <el-dialog title="说明" :visible.sync="dialogVisible" width="700">
      <b>报备客户</b><br />
      在统计时间范围内，由经纪人推荐报备的客户数（包括已审核、未审核、已拒收）<br /><br />
      <b>报备成功客户</b><br />
      在统计时间范围内，由经纪人推荐报备的客户数（已审核）<br /><br />
      <b>到访客户</b><br />
      在统计时间范围内，达到到访状态的客户（报备模式“已到访”客户+带看模式“带看已接收”客户）<br /><br />
      <b>认筹客户</b><br />
      在统计时间范围内，达到认筹状态的客户<br /><br />
      <b>认购客户</b><br />
      在统计时间范围内，达到认购状态的客户<br /><br />
      <b>签约客户</b><br />
      在统计时间范围内，达到签约状态的客户<br /><br />
      <b>发展下线经纪人</b><br />
      截止到今天为止，经纪人通过“邀请经纪人”功能发展的下线经纪人数量
    </el-dialog>
  </div>
</template>
<script>
import { getStatisticsGetAgentRankList } from '../../common/api'
export default {
  name: 'registeredUser',
  data () {
    return {
      createTim: '',
      search: {
        createTimeStart: '',
        createTimeEnd: '',
        tenantId: sessionStorage.getItem('tenantId'),
        currentPage: 1,
        pageSize: 10
      },
      page: {
        pageSizes: [10, 20, 50, 100],
        total: 1
      },
      tableData: [],
      stopTime: '',
      dialogVisible: false
    }
  },
  props: [ 'themeColor' ],
  created () {
    let date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    this.stopTime = date
    this.getStatisticsGetAgentRankList()
  },
  methods: {
    async getStatisticsGetAgentRankList () {
      const result = await getStatisticsGetAgentRankList(this.search)
      if (result.code === 200) {
        this.tableData = result.data
        this.page.currentPage = result.page.currentPage
        this.page.total = parseInt(result.page.recordCount)
        this.page.pageSize = result.page.pageSize
      } else {
        this.$message.warning(result.message)
      }
    },
    // 分页
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getStatisticsGetAgentRankList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getStatisticsGetAgentRankList()
    },
    setDate (time) {
      if (time) {
        this.search.createTimeStart = time[0]
        this.search.createTimeEnd = time[1]
      } else {
        this.search.createTimeStart = ''
        this.search.createTimeEnd = ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.commissions-dialog{
  h3{color:#3e8bdf}
  .commissions{
    .el-form-item.el-form-item--small{width:31%;}
    .el-form-item.commissions-item.el-form-item--small{width:100%;display:flex;}
  }
}
.userInformation-dialog{
  .demo-form-inline{height:140px;}
}
.icon-shuoming{cursor: pointer;font-size:18px;}
.explain{width:calc(100% - 20px);padding:10px;border:1px solid #ccc;line-height:24px;color:#999}
</style>

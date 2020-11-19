<template>
  <div class="RegisteredUser">
    <div class="search">
      <el-form :inline="true" :model="search">
        <el-form-item label="时间区间：">
          <el-radio-group v-model="search.identity">
            <el-radio-button :label="item.value" v-for="(item, index) in identityData" :key="index">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="自定义：">
          <el-date-picker v-model="createTim" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="setDate" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-submit" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="explain">
      更新时间：统计数据更新至每日凌晨00:00，也就是仅能查看昨日之前的数据。如您用业务管理模块查看/导出的实时数据与本统计报表做对比，可能发现数据不一致。<br />
      统计范围：本报表仅统计由全民营销产生的业务数据，因此可能与售楼系统或其它案场销售管理工具的数据有不一致之处。<br />
      影响因素：如您曾做过修改佣金发放条件、手工修改客户交易状态等操作，可能会导致部分数据有一定表面的误差。
    </div>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12"><span class="list-title-text">经纪人新增表 <i class="icon iconfont icon-shuoming" :style="{color:themeColor}" @click="dialogVisible = true"></i>数据统计截止时间：{{stopTime}}</span></el-col>
      <el-col :span="12">
        <el-button type="primary" class="search-submit" @click="getList">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="list-table" style="width:100%;">
      <el-table-column prop="a" label="渠道身份" width="120"></el-table-column>
      <el-table-column prop="b" label="已接收" width="120"></el-table-column>
      <el-table-column prop="b" label="已拒收" width="120"></el-table-column>
      <el-table-column prop="b" label="未审核" width="120"></el-table-column>
      <el-table-column prop="b" label="全部" width="120"></el-table-column>
      <el-table-column prop="c" label="已接收经纪人占比(已接收/已接收合计)"></el-table-column>
    </el-table>
    <!--  -->
    <el-dialog title="说明" :visible.sync="dialogVisible" width="700">
      <b>已接收</b><br />
      统计时间范围内，通过注册审核的新增经纪人注册数量<br /><br />
      <b>已拒收</b><br />
      统计时间范围内，被审核拒收的经纪人注册数量<br /><br />
      <b>未审核</b><br />
      统计时间范围内，新增并且还没有审核的经纪人注册数量<br /><br />
      <b>全部</b><br />
      统计时间范围内，已接收+已拒收+未审核的经纪人注册数量<br /><br />
      <b>已接收经纪人占比（已接收/已接收合计）</b><br />
      统计时间范围内，已接收的某渠道经纪人数量占所有已接收的渠道经纪人数量的比重<br /><br />
      <b>未知</b><br />
      包括所有被“禁用”渠道身份、“无”渠道身份的经纪人<br /><br />
    </el-dialog>
  </div>
</template>
<script>
import { } from '../../common/api'
export default {
  name: 'registeredUser',
  data () {
    return {
      createTim: '',
      search: {
        createTimeStart: '',
        createTimeEnd: '',
        identity: 0
      },
      identityData: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '本周',
          value: 1
        },
        {
          label: '本月',
          value: 2
        },
        {
          label: '本季',
          value: 3
        },
        {
          label: '本年',
          value: 4
        }
      ],
      tableData: [
        {
          a: '地产公司员工',
          b: '0',
          c: '0.00%'
        },
        {
          a: '代理公司',
          b: '0',
          c: '0.00%'
        },
        {
          a: '自由经纪人',
          b: '0',
          c: '0.00%'
        },
        {
          a: '中介公司',
          b: '0',
          c: '0.00%'
        },
        {
          a: '合作伙伴',
          b: '0',
          c: '0.00%'
        },
        {
          a: '其他',
          b: '0',
          c: '0.00%'
        },
        {
          a: '中介机构',
          b: '0',
          c: '0.00%'
        },
        {
          a: '老业主',
          b: '0',
          c: '0.00%'
        },
        {
          a: '未知',
          b: '0',
          c: '0.00%'
        },
        {
          a: '合计',
          b: '0',
          c: '0.00%'
        }
      ],
      stopTime: '',
      dialogVisible: false
    }
  },
  props: [ 'themeColor' ],
  created () {
    this.getList()
    let date = new Date(+new Date() + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    this.stopTime = date
  },
  methods: {
    setDate (a) {
      this.search.createTimeStart = a[0]
      this.search.createTimeEnd = a[1]
    },
    async getList () {
    },
    // 分页
    handleSizeChange (val) {
      this.page.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.getList()
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
.icon-shuoming{color:#409EFF;cursor: pointer;font-size:18px;}
.explain{width:calc(100% - 20px);padding:10px;border:1px solid #ccc;line-height:24px;color:#999}
</style>

<template>
  <div class="RegisteredUser">
    <div class="newsearch">
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="项目名称：">
          <MultipleEntryName @MultipleEntryName="MultipleEntryNameFun"></MultipleEntryName>
        </el-form-item><span class="top6">（可多选）</span>
      </el-form>
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
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12"><span class="list-title-text">成交统计表 <i class="icon iconfont icon-shuoming" :style="{color:themeColor}" @click="dialogVisible = true"></i>数据统计截止时间：{{stopTime}}</span></el-col>
      <el-col :span="12">
        <el-button type="primary" class="search-submit" @click="getList">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" class="list-table">
      <el-table-column prop="a" label="项目名称" width="150"></el-table-column>
      <el-table-column prop="b" label="认购套数（套）" width="120"></el-table-column>
      <el-table-column prop="c" label="认购金额（万元）" width="120"></el-table-column>
      <el-table-column prop="b" label="签约套数（套）" width="120"></el-table-column>
      <el-table-column prop="c" label="签约金额（万元）" width="120"></el-table-column>
      <el-table-column prop="c" label="到访佣金" width="120"></el-table-column>
      <el-table-column prop="c" label="认筹佣金" width="120"></el-table-column>
      <el-table-column prop="c" label="成交佣金"></el-table-column>
    </el-table>
    <!--  -->
    <el-dialog title="说明" :visible.sync="dialogVisible" width="700">
      <b>提示文字</b><br />
      成交统计表目前暂时仅供有明源ERP销售系统的客户使用，如有疑问请咨询明源各区域顾问。<br /><br />
      <b>认购套数</b><br />
      来自渠道管家的客户，ERP中认购单签署日期在统计时间范围内的所有认购房间数（不包含附属房间）<br /><br />
      <b>认购金额</b><br />
      来自渠道管家的客户，ERP中认购单签署日期在统计时间范围内的房间总价（包含附属房间的价格）<br /><br />
      <b>签约套数</b><br />
      来自渠道管家的客户，ERP中合同签署日期在统计时间范围内的所有签约房间数（不包含附属房间）<br /><br />
      <b>签约金额</b><br />
      来自渠道管家的客户，ERP中合同签署日期在统计时间范围内的房间总价（包含附属房间的价格）<br /><br />
      <b>到访佣金</b><br />
      在统计时间范围内，已经通过审定在待发放中的到访佣金<br /><br />
      <b>认筹佣金</b><br />
      在统计时间范围内，已经通过审定在待发放中的认筹佣金<br /><br />
      <b>成交佣金</b><br />
      在统计时间范围内，已经通过审定在待发放中的成交佣金
    </el-dialog>
  </div>
</template>
<script>
import { } from '../../common/api'
import MultipleEntryName from '../../components/MultipleEntryName'
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
          c: '0.00'
        },
        {
          a: '代理公司',
          b: '0',
          c: '0.00'
        },
        {
          a: '自由经纪人',
          b: '0',
          c: '0.00'
        },
        {
          a: '中介公司',
          b: '0',
          c: '0.00'
        },
        {
          a: '合作伙伴',
          b: '0',
          c: '0.00'
        },
        {
          a: '其他',
          b: '0',
          c: '0.00'
        },
        {
          a: '中介机构',
          b: '0',
          c: '0.00'
        },
        {
          a: '老业主',
          b: '0',
          c: '0.00'
        },
        {
          a: '未知',
          b: '0',
          c: '0.00'
        },
        {
          a: '合计',
          b: '0',
          c: '0.00'
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
    // 切换项目
    MultipleEntryNameFun (res) {
      this.search.projectId = res
    },
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
  },
  components: {
    MultipleEntryName
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
.top6{top:6px;position: relative;color:#999}
</style>

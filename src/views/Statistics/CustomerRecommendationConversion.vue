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
      <el-col :span="12"><span class="list-title-text">项目客户推荐表 <i class="icon iconfont icon-shuoming" :style="{color:themeColor}" @click="dialogVisible1 = true"></i>数据统计截止时间：{{stopTime}}</span></el-col>
      <el-col :span="12">
        <el-button type="primary" class="search-submit" @click="getList">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData1" class="list-table">
      <el-table-column prop="a" label="项目名称" width="150"></el-table-column>
      <el-table-column prop="b" label="报备客户" width="100"></el-table-column>
      <el-table-column prop="b" label="报备成功客户" width="100"></el-table-column>
      <el-table-column prop="b" label="到访客户" width="100"></el-table-column>
      <el-table-column prop="b" label="认筹客户" width="100"></el-table-column>
      <el-table-column prop="b" label="认购客户" width="100"></el-table-column>
      <el-table-column prop="b" label="直签客户" width="100"></el-table-column>
      <el-table-column prop="b" label="签约客户" width="100"></el-table-column>
      <el-table-column prop="b" label="已拒收客户" width="100"></el-table-column>
      <el-table-column prop="b" label="未审定客户"></el-table-column>
    </el-table>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12"><span class="list-title-text">项目客户转化表 <i class="icon iconfont icon-shuoming" :style="{color:themeColor}" @click="dialogVisible2 = true"></i>数据统计截止时间：{{stopTime}}</span></el-col>
      <el-col :span="12">
        <el-button type="primary" class="search-submit">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData2" class="list-table">
      <el-table-column prop="a" label="项目名称" width="150"></el-table-column>
      <el-table-column prop="b" label="报备客户" width="100"></el-table-column>
      <el-table-column prop="b" label="报备成功客户" width="100"></el-table-column>
      <el-table-column prop="b" label="报备到访客户" width="100"></el-table-column>
      <el-table-column prop="b" label="报备认筹客户" width="100"></el-table-column>
      <el-table-column prop="b" label="报备认购客户" width="100"></el-table-column>
      <el-table-column prop="b" label="报备签约客户"></el-table-column>
    </el-table>
    <!--  -->
    <el-dialog title="说明" :visible.sync="dialogVisible1" width="700">
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
      <b>直签客户</b><br />
      在统计时间范围内，跳过认购状态直接达到签约状态的客户<br /><br />
      <b>签约客户</b><br />
      在统计时间范围内，达到签约状态的客户<br /><br />
      <b>已拒收客户</b><br />
      在统计时间范围内，报备拒收或者带看拒收的客户<br /><br />
      <b>未审定客户</b><br />
      在统计时间范围内，报备模式报备审核中的客户或者带看模式带看审核中的客户
    </el-dialog>
    <el-dialog title="说明" :visible.sync="dialogVisible2" width="700">
      <b>报备客户</b><br />
      在统计时间范围内，由经纪人推荐报备的客户数（包括已审核、未审核、已拒收）<br /><br />
      <b>报备成功客户</b><br />
      在统计时间范围内的报备客户，已通过报备审核的客户数（已审核）<br /><br />
      <b>报备到访客户</b><br />
      在统计时间范围内的报备客户，已达到到访状态（报备模式“已到访”客户+带看模式“带看已接收”客户）<br /><br />
      <b>报备认筹客户</b><br />
      在统计时间范围内的报备客户，已达到认筹状态的客户量<br /><br />
      <b>报备认购客户</b><br />
      在统计时间范围内的报备客户，已达到认购状态的客户量<br /><br />
      <b>报备签约客户</b><br />
      在统计时间范围内的报备客户，已达到签约状态的客户量
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
      tableData1: [
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
          a: '合计',
          b: '0',
          c: '0.00%'
        }
      ],
      tableData2: [
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
          a: '合计',
          b: '0',
          c: '0.00%'
        }
      ],
      stopTime: '',
      dialogVisible1: false,
      dialogVisible2: false
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

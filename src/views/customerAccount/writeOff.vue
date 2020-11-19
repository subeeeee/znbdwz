<template>
  <div class="customerAccountDetail">
    <div class="search">
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="经纪人信息：" class="customer-information">
          <el-input v-model.trim="search.name" placeholder="姓名" maxlength="50" style="margin-right:8px"></el-input>
          <el-input v-model.trim="search.mobile" placeholder="手机号" maxlength="50" style="margin-right:8px;"></el-input>
          <el-button type="primary" class="search-submit" icon="el-icon-search" @click="getReceiveCommissionList('search')">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="list-title" :style="'border-bottom:2px solid' + themeColor">
      <el-col :span="12"><span class="list-title-text">佣金核销</span></el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-table :data="tableData" class="list-table">
      <el-table-column type="index" label="编号" width="50"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="identityname" label="渠道身份" width="120"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="120"></el-table-column>
      <el-table-column prop="allAccount" label="总佣金(元)" width="120"></el-table-column>
      <el-table-column prop="receiveAccount" label="已领佣金(元)" width="120"></el-table-column>
      <el-table-column prop="remainAccount" label="剩余佣金(元)" width="120"></el-table-column>
      <el-table-column label="管理">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="PopReceiveCommission(scope.row)">核销</el-button>
          <el-button type="text" size="small" @click="getReceiveCommissionHistoryList(scope.row)">明细</el-button>
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
    <!-- dialog -->
    <el-dialog title="佣金核销" :visible.sync="receiveCommissionPop" width="500px">
      <el-form :model="ReceiveCommissionSubmit" status-icon :rules="ReceiveCommissionRules" ref="ReceiveCommissionFrom" label-width="70px" class="demo-ruleForm">
        <el-form-item label="佣金金额" prop="account">
          <el-input type="text" v-model.number="ReceiveCommissionSubmit.account" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model.number="ReceiveCommissionSubmit.remark" maxlength="30" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ReceiveCommissionFrom')">取 消</el-button>
        <el-button type="primary" @click="postReceiveCommission('ReceiveCommissionFrom')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="佣金明细" :visible.sync="ReceiveCommissionHistoryListPop" width="650px">
      <el-table :data="ReceiveCommissionHistoryListData" style="width: 100%" height="300px">
        <el-table-column prop="account" label="领取佣金数 (元)" width="140">
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="核销时间" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deletReceiveCommission(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next, total" :total="ReceiveCommissionHistoryListTotal" @current-change="ReceiveCommissionHistoryListJump"></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { validateMoney } from '../../common/fromVerification'
import { getReceiveCommissionList, postReceiveCommission, getReceiveCommissionHistoryList, deletReceiveCommission } from '../../common/api'
export default {
  name: 'customerAccountDetail',
  data () {
    return {
      search: {
        tenantId: sessionStorage.getItem('tenantId'), // 租户Id
        name: '',
        mobile: '',
        currentPage: 1,
        pageSize: 10
      },
      tableData: [],
      page: {
        pageSizes: [10, 20, 50, 100],
        total: 1
      },
      receiveCommissionPop: false,
      ReceiveCommissionSubmit: {
        userId: '',
        account: '',
        remark: ''
      },
      ReceiveCommissionRules: {
        account: [
          { validator: validateMoney, trigger: 'blur' }
        ]
      },
      ReceiveCommissionHistoryListPop: false,
      ReceiveCommissionHistoryListData: [],
      ReceiveCommissionHistoryListTotal: 0,
      ReceiveCommissionHistoryList: {
        userId: '',
        currentPage: 1,
        pageSize: 10
      }
    }
  },
  props: [ 'themeColor' ],
  created () {
    this.getReceiveCommissionList()
  },
  methods: {
    // 客户台账 列表
    async getReceiveCommissionList (type='') {
      this.search.currentPage = type === ''?this.search.currentPage:1
      const result = await getReceiveCommissionList(this.search)
      this.tableData = result.data
      this.search.currentPage = result.page.currentPage
      this.page.total = parseInt(result.page.recordCount)
    },
    // 佣金明细
    async getReceiveCommissionHistoryList (scope) {
      this.ReceiveCommissionHistoryList.userId = scope.userId ? scope.userId : this.ReceiveCommissionHistoryList.userId
      const result = await getReceiveCommissionHistoryList(this.ReceiveCommissionHistoryList)
      if (result.code === 200) {
        this.ReceiveCommissionHistoryListPop = true
        this.ReceiveCommissionHistoryListData = result.data
        this.ReceiveCommissionHistoryList.currentPage = result.page.currentPage
        this.ReceiveCommissionHistoryList.pageSize = result.page.pageSize
        this.ReceiveCommissionHistoryListTotal = parseInt(result.page.recordCount)
      } else {
        this.$message.error(result.message)
      }
    },
    // 删除佣金明细
    async deletReceiveCommission (scope) {
      const result = await deletReceiveCommission(scope.receiveCommissionId)
      if (result.code === 200) {
        this.$message.success('操作成功')
        this.getReceiveCommissionHistoryList(false)
        this.getReceiveCommissionList()
      }
    },
    // 佣金核销
    postReceiveCommission (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const result = await postReceiveCommission(this.ReceiveCommissionSubmit)
          if (result.code === 200) {
            this.$message.success('操作成功')
            this.receiveCommissionPop = false
            this.getReceiveCommissionList()
          }
        }
      })
    },
    PopReceiveCommission (scope) {
      this.receiveCommissionPop = true
      this.ReceiveCommissionSubmit.userId = scope.userId
      this.ReceiveCommissionSubmit.account = ''
      this.ReceiveCommissionSubmit.remark = ''
    },
    resetForm (formName) {
      this.receiveCommissionPop = false
      this.$refs[formName].resetFields()
    },
    // 分页
    handleSizeChange (val) {
      this.search.pageSize = val
      this.getReceiveCommissionList()
    },
    handleCurrentChange (val) {
      this.search.currentPage = val
      this.getReceiveCommissionList()
    },
    ReceiveCommissionHistoryListJump (val) {
      this.ReceiveCommissionHistoryList.currentPage = val
      this.getReceiveCommissionHistoryList(false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.customerAccountDetail{
  .information-dialog{
    h3{font-size:14px;margin-bottom:20px;}
    .commissions{
      .el-form-item.el-form-item--small{width:31%;}
      .el-form-item.commissions-item.el-form-item--small{width:100%;display:flex;}
      .el-form-item.el-form-item--mini{width:31%;}
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
  .recommend-list{border-left:2px solid #ccc;padding-left:20px;margin-left:40px;
    li{display:flex;height:70px;line-height:70px;position:relative;color:#ccc;
      span:nth-child(2){width:280px;padding-left:20px;}
      i.iconfont{position:absolute;left:-31px;top:28px;color:#ccc;transform: rotate(180deg);background:#fff;width:20px;height:14px;line-height:14px;}
      &:first-child{color:#3e8bdf;
        i.iconfont{color:#3e8bdf}
      }
    }
  }
  .panke-box{padding:30px 0;text-align:center;
    .el-radio{margin:0 30px;}
  }
}
</style>

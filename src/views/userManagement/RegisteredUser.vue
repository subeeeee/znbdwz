<template>
  <div class="RegisteredUser">
    <div class="search">
      <el-form :inline="true"
               :model="search">
        <el-form-item label="注册来源：">
          <entryName from="registeredUser" @entryName="entryNameFun" v-on:listenTochildEvent="accountsFreeAgentList"></entryName>
        </el-form-item>
      </el-form>
      <el-form :inline="true"
               :model="search"
               class="demo-form-inline-on">
        <el-form-item label="用户姓名：">
          <el-input v-model.trim="search.name"
                    placeholder="用户姓名"
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="注册号码：">
          <el-input v-model.trim="search.mobile"
                    placeholder="注册号码"
                    maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="邀请人：">
          <el-input v-model.trim="search.parentName"
                    placeholder="邀请人"
                    maxlength="50"></el-input>
        </el-form-item>
      </el-form>
      <el-form :inline="true"
               :model="search">
        <el-form-item label="注册时间：">
          <el-date-picker v-model="createTim"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="setDate"
                          value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form>
      <el-form :inline="true"
               :model="search" class="identity">
        <el-form-item label="用户身份：">
          <el-radio-group v-model="search.identity">
            <el-radio-button :label="item.value"
                             v-for="(item, index) in identityData"
                             :key="index">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :inline="true"
               :model="search"
               class="search-submit-form">
        <el-form-item label="排列顺序：">
          <el-select v-model="search.sortType"
                     placeholder="请选择">
            <el-option label="注册时间倒序"
                       value="1">注册时间倒序</el-option>
            <el-option label="注册时间正序"
                       value="0">注册时间正序</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     class="search-submit"
                     icon="el-icon-search"
                     @click="accountsFreeAgentList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-row class="list-title"
            :style="'border-bottom:2px solid' +  themeColor">
      <el-col :span="12"><span class="list-title-text">注册用户</span></el-col>
      <el-col :span="12"></el-col>
    </el-row>
    <el-table :data="tableData"
              class="list-table"
              style="width:100%">
      <el-table-column type="index"
                       label="编号"
                       width="80"></el-table-column>
      <el-table-column prop="name"
                       label="姓名"
                       width="130"></el-table-column>
      <el-table-column label="性别"
                       width="80">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 0 ? '男' : '女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile"
                       label="注册号码"
                       width="120"></el-table-column>
      <el-table-column prop="parentName"
                       label="邀请人"
                       width="120"></el-table-column>
      <el-table-column prop="identityName"
                       label="用户身份"
                       width="100"></el-table-column>
      <el-table-column prop="createTime"
                       label="注册时间"
                       width="180"></el-table-column>
      <el-table-column prop="projectName"
                       label="注册来源"
                       width="180"></el-table-column>
      <el-table-column prop="statusName"
                       label="用户状态"
                       width="120"></el-table-column>
      <el-table-column prop="statusName"
                       label="佣金账户"
                       width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isOwnBank === '0'">未设置</span>
          <el-button @click="ownBankView(scope.row)"
                     type="text"
                     v-else>查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="date"
                       label="管理">
        <template slot-scope="scope">
          <el-dropdown trigger="click"
                       size="small">
            <el-button type="text"
                       size="small">操作</el-button>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-button type="text" size="small" @click="commissionsPop = true">查看</el-button> -->
              <el-dropdown-item @click.native="userInformationPopFun(scope.row)">身份变更</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.status === 0"
                                @click.native="confirm(scope.row)">通过审核</el-dropdown-item>
              <el-dropdown-item v-else
                                @click.native="confirm(scope.row)">待审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="page.currentPage"
                   :page-sizes="page.pageSizes"
                   :page-size="page.pageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="page.total">
    </el-pagination>
    <!-- dialog -->
    <el-dialog title="佣金管理"
               :visible.sync="commissionsPop"
               width="800px"
               class="commissions-dialog">
      <h3>基础信息</h3>
      <el-form :inline="true"
               class="commissions">
        <el-form-item label="客户姓名：">王宪富</el-form-item>
        <el-form-item label="客户性别：">男</el-form-item>
        <el-form-item label="客户手机：">15011113021</el-form-item>
        <el-form-item label="用户身份：">公司员工</el-form-item>
        <el-form-item label="邀请人：">鞠少青</el-form-item>
        <el-form-item label="客户状态：">已审核</el-form-item>
        <el-form-item label="注册时间：">2018-10-17 16:32:40</el-form-item>
        <el-form-item label="审核时间：">2018-10-17 16:32:40</el-form-item>
        <el-form-item label="是否渠道：">是</el-form-item>
      </el-form>
      <h3>渠道信息</h3>
      <el-form :inline="true"
               class="commissions">
        <el-form-item label="渠道类型：">中介机构</el-form-item>
        <el-form-item label="渠道名称：">链家新房</el-form-item>
        <el-form-item label="所属门店：">大望路店</el-form-item>
        <el-form-item label="身份角色：">门店员工</el-form-item>
        <el-form-item label="授权项目："
                      class="commissions-item"
                      label-width="90px">天津汤泉世家、济南世家公馆、长沙木莲世家天津汤泉世家、济南世家公馆、长沙木莲世家天津汤泉世家、济南世家公馆、长沙木莲世家</el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="commissionsPop = false"
                   icon="el-icon-close">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="用户信息"
               :visible.sync="userInformationPop"
               width="740px"
               class="userInformation1-dialog">
      <el-form :inline="true"
               :model="userInformationForm"
               class="demo-form-inline">
        <el-form-item label="用户身份："
                      style="width:100%" class="identity">
          <el-radio-group v-model="userInformationForm.identity"
                          @change="selectIdentity">
            <el-radio-button :label="item.value"
                             v-for="(item, index) in identityData2"
                             :key="index">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <span v-if="userInformationForm.identity === 2 || userInformationForm.identity === 3 || userInformationForm.identity === 4">
          <el-form-item label="渠道名称：">
            <el-select v-model="userInformationForm.channelId"
                       placeholder="渠道名称"
                       :disabled="channelIdData.length < 1"
                       @change="managerAgencyTeamStoresOptions">
              <el-option v-for="(item, index) in channelIdData"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属门店：">
            <el-select v-model="userInformationForm.storeId"
                       placeholder="所属门店"
                       :disabled="storeIdData.length < 1"
                       @change="userInformationForm.roleType = ''">
              <el-option v-for="(item, index) in storeIdData"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份角色：">
            <el-select v-model="userInformationForm.roleType"
                       placeholder="身份角色"
                       :disabled="userInformationForm.storeId === '' && userInformationForm.channelId === ''">
              <el-option v-for="(item, index) in roleTypeData"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </span>
        <span v-else>渠道信息：无</span>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="userInformationPop = false"
                   icon="el-icon-close">关 闭</el-button>
        <el-button type="primary"
                   @click="putAccountsIdentity"
                   icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="佣金账户"
               :visible.sync="ownBankViewPop"
               width="560px"
               class="userInformation1-dialog">
      <el-form :inline="true"
               label-width="100px"
               class="demo-form-inline"
               v-if="getBankData">
        <el-form-item label="户名："
                      style="width:100%">
          {{getBankData.accountName}}
        </el-form-item>
        <el-form-item label="账户："
                      style="width:100%">
          {{getBankData.accountNum}}
        </el-form-item>
        <el-form-item label="银行："
                      style="width:100%">
          {{getBankData.bankName}}
        </el-form-item>
        <el-form-item label="开户行："
                      style="width:100%">
          {{getBankData.bankOpenName}}
        </el-form-item>
      </el-form>
      <div style="padding-bottom:30px;"></div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="ownBankViewPop = false"
                   icon="el-icon-close">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { accountsFreeAgentList, accountsIdentity, accountsIdentity2, accountsFreeAgent, managerAgencyTeamChannelChannelTypes, managerAgencyTeamStoresOptions, managerAgencyTeamChannelOptions, putAccountsIdentity, getBank } from '../../common/api'

import entryName from '../../components/entryName'
export default {
  name: 'registeredUser',
  components: {
    entryName
  },
  data () {
    return {
      createTim: '',
      search: {
        name: '',
        mobile: '',
        parentName: '',
        createTimeStart: '',
        createTimeEnd: '',
        identity: '',
        sort: '1', // 排序字段
        sortType: '1', // 排序方式
        projectId:'',//项目
      },
      identityData: [],
      tableData: [],
      page: {
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 1
      },
      commissionsPop: false,
      userInformationPop: false,
      ownBankViewPop: false,
      // 变更身份
      identityData2: [],
      channelIdData: [], // 渠道数组
      storeIdData: [], // 店铺数组
      roleTypeData: [ // 角色类型数组
        {
          label: '店长',
          value: 2
        },
        {
          label: '店员',
          value: 3
        }
      ],
      userInformationForm: {
        identity: '', // 用户身份
        channelId: '', // 渠道Id
        storeId: '', // 店铺Id
        roleType: '', // 角色类型 （店长 or 店员）
        userId: '', // 列表中用户id
        tenantId: '' // 租户id
      },
      getBankData: null // 佣金账户
    }
  },
  props: ['themeColor'],
  watch: {
    userInformationForm: {
      handler (Json) {
        if (Json.storeId === '') {
          this.roleTypeData = [
            {
              label: '总代',
              value: 1
            }
          ]
        } else {
          this.roleTypeData = [
            {
              label: '店长',
              value: 2
            },
            {
              label: '店员',
              value: 3
            }
          ]
        }
      },
      deep: true
    }
  },
  created () {
    this.accountsIdentity()
    this.accountsIdentity2()
    this.accountsFreeAgentList()
  },
  methods: {
    setDate (time) {
      if (time) {
        this.search.createTimeStart = time[0]
        this.search.createTimeEnd = time[1]
      } else {
        this.search.createTimeStart = ''
        this.search.createTimeEnd = ''
      }
    },
    async accountsIdentity () {
      const result = await accountsIdentity2(`?type=5&tenantId=${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        let arr = [
          {
            label: '全部',
            value: ''
          }
        ]
        for (let i = 0; i < result.data.length; i++) {
          arr.push({
            label: result.data[i].identityName,
            value: result.data[i].identity
          })
        }
        this.identityData = arr
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    async accountsIdentity2 () {
      const result = await accountsIdentity(`?type=4&tenantId=${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        let arr = []
        for (let i = 0; i < result.data.length; i++) {
          arr.push({
            label: result.data[i].identityName,
            value: result.data[i].identity
          })
        }
        this.identityData2 = arr
        this.userInformationForm.identity = arr[0].value
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    async confirm (scope) {
      let text = ''
      switch (scope.status) {
        case 0:
          text = '启用'
          break
        case 1:
          text = '停用'
          break
      }
      this.$confirm('此操作将' + text + '此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.accountsFreeAgent(scope)
      }).catch(() => {
      })
    },
    async accountsFreeAgent (scope) {
      let userId = scope.userId
      let status = scope.status
      const result = await accountsFreeAgent(`${userId}/${status}`)
      if (result.code === 200) {
        this.$message.success('操作成功!')
        this.accountsFreeAgentList()
      } else {
        this.$message.warning(result.message)
      }
    },
    // 渠道来源
    async managerAgencyTeamChannelChannelTypes () {
      const result = await managerAgencyTeamChannelChannelTypes(`?tenantId=${sessionStorage.getItem('tenantId')}&channelType=${this.userInformationForm.identity}`)
      const data = result.data
      this.channelTypeData = this.formatJson(data)
    },
    async accountsFreeAgentList () {
      let url = `?tenantId=${sessionStorage.getItem('tenantId')}&name=${this.search.name}&mobile=${this.search.mobile}&parentName=${this.search.parentName}&projectId=${this.search.projectId || sessionStorage.getItem('projectId')|| ''}`
      url += `&createTimeStart=${this.search.createTimeStart}&createTimeEnd=${this.search.createTimeEnd}&identity=${this.search.identity}&sort=${this.search.sort}&sortType=${this.search.sortType}`
      url += `&currentPage=${this.page.currentPage}&pageSize=${this.page.pageSize}`
      const result = await accountsFreeAgentList(`${url}`)
      if (result.code === 200) {
        this.tableData = result.data
        this.page.currentPage = result.page.currentPage
        this.page.total = parseInt(result.page.recordCount)
        this.page.pageSize = result.page.pageSize
      } else {
        this.$message.warning(result.message)
      }
    },
    async ownBankView (scope) { // 查看佣金账户
      const result = await getBank(scope.userId)
      this.getBankData = result.data
      this.ownBankViewPop = true
    },
    // 分页
    handleSizeChange (val) {
      this.page.pageSize = val
      this.accountsFreeAgentList()
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.accountsFreeAgentList()
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
    // 变更身份 ==========================
    userInformationPopFun (scope) {
      this.userInformationForm.userId = scope.userId
      this.userInformationPop = true
      this.getAccountsIdentity() // 用户身份
    },
    // 用户身份
    async getAccountsIdentity () {
      const result = await accountsIdentity2(`?type=4&tenantId=${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        let arr = []
        for (let i = 0; i < result.data.length; i++) {
          arr.push({
            label: result.data[i].identityName,
            value: result.data[i].identity
          })
        }
        this.identityData2 = arr
        this.userInformationForm.identity = arr[0].value
        this.managerAgencyTeamChannelOptions()
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 切换 用户身份
    selectIdentity () {
      if (this.userInformationForm.identity === 2 || this.userInformationForm.identity === 3 || this.userInformationForm.identity === 4) {
        this.userInformationForm.channelId = '' // 渠道Id
        this.userInformationForm.storeId = '' // 店铺Id
        this.userInformationForm.roleType = '' // 角色类型 （店长 or 店员）
        this.channelIdData = []
        this.storeIdData = []
        this.managerAgencyTeamChannelOptions()
      }
    },
    // 渠道来源
    async managerAgencyTeamChannelOptions () {
      const result = await managerAgencyTeamChannelOptions(`?channelType=${this.userInformationForm.identity}&tenantId=${sessionStorage.getItem('tenantId')}`)
      const data = result.data
      this.userInformationForm.channelId = ''
      this.userInformationForm.storeId = '' // 店铺Id
      this.userInformationForm.roleType = '' // 角色类型 （店长 or 店员）
      this.channelIdData = []
      this.storeIdData = []
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].channelName,
          value: data[i].channelId
        }
        this.channelIdData.push(json)
      }
    },
    // 门店列表
    async managerAgencyTeamStoresOptions () {
      this.userInformationForm.storeId = ''
      this.userInformationForm.roleType = ''
      const result = await managerAgencyTeamStoresOptions(`?channelId=${this.userInformationForm.channelId}`)
      if (result.data.length < 1) {
        this.$message.error('没有相关门店')
        this.storeIdData = []
      } else if (result.code === 200) {
        const data = result.data
        this.storeIdData = []
        for (let i = 0; i < data.length; i++) {
          let json = {
            label: data[i].storeName,
            value: data[i].storeId
          }
          this.storeIdData.push(json)
        }
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    async putAccountsIdentity () {
      this.userInformationForm.tenantId = sessionStorage.getItem('tenantId')
      if (this.userInformationForm.identity === 2 || this.userInformationForm.identity === 3 || this.userInformationForm.identity === 4) {
        if (this.userInformationForm.channelId === '') { // 渠道Id
          this.$message.error('请选择渠道')
        } else if (this.userInformationForm.roleType === '') { // 角色类型
          this.$message.error('请选择角色类型')
        } else {
          // if (this.userInformationForm.storeId === '') { // 店铺Id
          //   this.$message.error('请选择店铺')
          //   return false
          // }
          const result = await putAccountsIdentity(this.userInformationForm)
          if (result.code === 200) {
            this.$message.success('设置成功')
            this.userInformationPop = false
            this.accountsFreeAgentList()
          } else {
            this.$message.warning(result.message)
          }
        }
      } else {
        const result = await putAccountsIdentity(this.userInformationForm)
        if (result.code === 200) {
          this.$message.success('设置成功')
          this.userInformationPop = false
          this.accountsFreeAgentList()
        } else {
          this.$message.warning(result.message)
        }
      }
    },
    // 切换项目
    entryNameFun (res) {
      this.search.projectId = res
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss">
.identity{
  .el-form-item__content{
    max-width: calc(100% - 100px);
    .el-radio-button{
      margin-bottom: 8px;
    }
  }
}
</style>
<style lang="scss" scoped>
.commissions-dialog {
  h3 {
    color: #3e8bdf;
  }
  .commissions {
    .el-form-item.el-form-item--small {
      width: 31%;
    }
    .el-form-item.commissions-item.el-form-item--small {
      width: 100%;
      display: flex;
    }
  }
}
.userInformation1-dialog {
  .demo-form-inline {
    min-height: 140px;
  }
}
</style>

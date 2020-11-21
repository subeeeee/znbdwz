<template>
  <div id='MarketingMemberManage' class="marketingMemberManage">
    <el-row>
      <el-col :span="12" class="memberStatus">
        <el-col :span="4" class="title">成员状态：</el-col>
        <el-col :span="4">
          <el-select v-model="memberStatus" placeholder="全部" @change="selectChange">
            <el-option
              v-for="item in memberStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-input v-model="selectMember.memberName"
                    auto-complete="off"
                    placeholder="姓名/手机号"
                    @change="searchChange"
                    @keyup.enter.native="searchMember"
                    clearable></el-input>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-button type="primary" @click="searchMember">搜索</el-button>
        </el-col>
      </el-col>
      <el-col :span="12" class="memberButtons">
        <el-button type="primary" @click="title='添加成员';isAddMember = true;dialogFormVisible = true">添加成员</el-button>
      </el-col>
      <el-col :span="24" class="housingList">
        <el-table
          ref="memberTable"
          :data="tableData"
          height="450"
          stripe
          :style="{borderColor: this.theme, width: '100%'}">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="60"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="手机号"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="tableText">{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">在职</span>
              <span v-else-if="scope.row.status === 1">休假</span>
              <span v-else>离职</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" class="operation" v-if="scope.row.status !== 2" @click="editMember(scope.row)">编辑</el-button>
              <el-button type="text" class="operation" v-if="scope.row.status !== 2" @click="dismiss(scope.$index, tableData, scope.row)">置为离职</el-button>
              <el-button type="text" class="operation" v-if="scope.row.status === 2" @click="onjob(scope.$index, tableData, scope.row)">置为在职</el-button>
              <el-button type="text" class="operation" v-if="scope.row.status === 2" style="margin-left: 8px;" @click="deleteMember(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalRecord">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog ref='dialog' :title="title" :visible.sync="dialogFormVisible" top="20vh" @close="dialogClose">
      <el-row v-if="isAddMember">
        <el-col :span="24">
          <el-steps :active="active" align-center>
            <el-step title="基本信息" icon="el-icon-edit"></el-step>
            <el-step title="团队分配" icon="el-icon-edit"></el-step>
          </el-steps>
        </el-col>
        <el-row>
          <el-col :span="12" :offset="5" style="margin-top: 20px;" v-if="active === 1">
            <el-form :label-position="labelPosition" :model="memberEssentialInfo" :rules="memberEssentialInfoRules" ref="memberEssentialInfoForm" >
              <el-col :span="24">
                <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
                  <el-input v-model="memberEssentialInfo.name" auto-complete="off" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="手机号：" :label-width="formLabelWidth" prop="mobile">
                  <el-input v-model.number="memberEssentialInfo.mobile" auto-complete="off" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
          <el-col :span="12" :offset="5" style="margin-top: 20px;" v-if="active === 2">
            <el-form :label-position="labelPosition" :model="steamDistribution" ref="steamDistributionForm" >
              <el-col :span="24">
                <el-form-item label="岗位：" :label-width="formLabelWidth">
                  <el-select v-model="steamDistribution.station" clearable placeholder="请选择岗位" @change='stationChange'>
                    <el-option
                      v-for="item in stationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属团队：" :label-width="formLabelWidth">
                  <el-select :disabled='steamDistribution.station === "4" || steamDistribution.station === "3"' v-model="steamDistribution.steam" clearable placeholder="请选择团队" @change="selectGroupChange">
                    <el-option
                      v-for="steam in teamOptions"
                      :key="steam.teamId"
                      :label="steam.teamName"
                      :value="steam.teamId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="小组名称：" :label-width="formLabelWidth" >
                  <el-select :disabled='steamDistribution.station === "4" || steamDistribution.station === "3" || steamDistribution.station === "2"' v-model="steamDistribution.groupName" clearable placeholder="请选择小组">
                    <el-option
                      v-for="group in groupOptions"
                      :key="group.groupId"
                      :label="group.groupName"
                      :value="group.groupId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form>
          </el-col>
        </el-row>
      </el-row>
      <el-row v-if="isResetPassWord">
        <el-col :span="12" :offset="5" style="margin-top: 20px;">
          <el-form :label-position="labelPosition" status-icon :model="resetPassWord" :rules="resetPassWordRules" ref="resetPassWordForm" >
            <el-col :span="24">
              <el-form-item label="新密码：" :label-width="formLabelWidth" prop="newPassWord">
                <el-input v-model="resetPassWord.newPassWord" auto-complete="off" type="password" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="确认新密码：" :label-width="formLabelWidth" prop="confirmNewPassWord">
                <el-input v-model="resetPassWord.confirmNewPassWord" auto-complete="off" type="password" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" :offset="8" style="font-size: 12px;">
              *密码由8-16位字符，包括至少一位数字和字母
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-if="isEditMember">
        <el-col :span="12" :offset="5" style="margin-top: 20px;">
          <el-form :label-position="labelPosition" :model="memberEssentialInfo" :rules="memberEssentialInfoRules" ref="memberEssentialInfoForm" >
            <el-col :span="24">
              <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
                <el-input v-model="memberEssentialInfo.name" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机号：" :label-width="formLabelWidth" prop="mobile">
                <el-input v-model.number="memberEssentialInfo.mobile" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='24' class='showInfo'>
              *注意：活动期间修改成员信息，需再次发布活动后生效。
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog_foot_button" type="primary" v-if="active === 1 && isAddMember" @click="next">下一步</el-button>
        <el-button class="dialog_foot_button" type="primary" v-if="active > 1 || isEditMember" @click="determine">确 定</el-button>
        <el-button class="dialog_foot_button" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    requestGetExpandMembersPage,
    requestExpandMembersDimission,
    requestDeleteExpandMembers,
    requestPutExpandMembers,
    requestGetExpandGroups,
    requestPostExpandMembers,
    requestExpandMembersPassword,
    requestExpandMembersOnJob
  } from '../../store/fetch/api'
  import { validateMobile } from '../../common/js/formValidation'
  import {mapGetters} from 'vuex'
  
  export default {
    name: 'MarketingMemberManage',
    data () {
      const newPassWordValidatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.resetPassWord.confirmNewPassWord !== '') {
            this.$refs.resetPassWordForm.validateField('confirmNewPassWord')
          }
          callback()
        }
      }
      const confirmNewPassWordValidatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.resetPassWord.newPassWord) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userName: '',
        active: 1,
        totalRecord: 1,
        currentPage: 1,
        pageSize: 10,
        totalPage: 1,
        memberStatus: '',
        memberId: '',
        visible: false,
        title: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        labelPosition: 'right',
        isAddMember: false,
        isEditMember: false,
        isResetPassWord: false,
        tableData: [],
        memberStatusOptions: [{
          value: '',
          label: '全部'
        }, {
          value: '0',
          label: '在职'
        }, {
          value: '2',
          label: '离职'
        }],
        stationOptions: [
          {
            value: '3',
            label: '拓客总监'
          }, {
            value: '2',
            label: '团长'
          }, {
            value: '1',
            label: '组长'
          },
          {
            value: '0',
            label: '组员'
          }
        ],
        groupOptions: [],
        teamOptions: [],
        memberEssentialInfo: {
          name: '',
          mobile: ''
        },
        memberEssentialInfoRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }]
        },
        steamDistribution: {
          station: '',
          steam: '',
          groupName: ''
        },
        resetPassWord: {
          newPassWord: '',
          confirmNewPassWord: ''
        },
        resetPassWordRules: {
          newPassWord: [{ required: true, validator: newPassWordValidatePass, trigger: 'blur' }],
          confirmNewPassWord: [{ required: true, validator: confirmNewPassWordValidatePass, trigger: 'blur' }]
        },
        selectMember: {
          memberName: ''
        },
        membersParams: {
          pageNo: '1',
          pageSize: '10',
          projectId: '',
          searchKey: '',
          tenantId: this.user.tenantId,
          status: ''
        }
      }
    },
    props: ['user'],
    computed: mapGetters({
      theme: 'GET_COLOUR'
    }),
    created () {
      this.getMemberList()
      this.getGroups()
    },
    methods: {
      // 获取成员列表
      async getMemberList (projectId) {
        projectId ? this.membersParams.projectId = projectId : this.membersParams.projectId = sessionStorage.getItem('projectId')
        const result = await requestGetExpandMembersPage(this.membersParams)
        this.totalRecord = result.data.totalRecord
        this.currentPage = result.data.currentPage
        this.pageSize = result.data.pageSize
        this.totalPage = result.data.totalPage
        this.tableData = result.data.result
      },
      // 添加成员
      async postMember () {
        const params = {
          groupId: this.steamDistribution.groupName,
          identity: this.steamDistribution.station,
          mobile: this.memberEssentialInfo.mobile,
          name: this.memberEssentialInfo.name,
          teamId: this.steamDistribution.steam,
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        await requestPostExpandMembers(params)
        this.getMemberList()
        this.$message({
          type: 'success',
          message: '添加成员成功!'
        })
      },
      // 重置密码
      async restPassWord () {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          password: this.resetPassWord.newPassWord,
          memberId: this.memberId
        }
        await requestExpandMembersPassword(params)
        this.$message({
          type: 'success',
          message: `用户：${this.userName}  密码重置成功!`
        })
      },
      // 修改成员信息
      async editMemberPut () {
        const params = {
          name: this.memberEssentialInfo.name,
          mobile: this.memberEssentialInfo.mobile,
          memberId: this.memberId,
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        await requestPutExpandMembers(params, this.memberId)
        this.getMemberList()
        this.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: '修改成员成功!'
        })
      },
      // 获取团队和小组
      async getGroups () {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        if (params.projectId) {
          const result = await requestGetExpandGroups(params)
          this.teamOptions = result.data
        }
      },
      // 下一步
      next () {
        this.$refs.memberEssentialInfoForm.validate((valid) => {
          if (valid) {
            this.active++
          } else {
            return false
          }
        })
      },
      // 重置密码
      restPassWordFun (rows) {
        this.title = '重置密码'
        this.isResetPassWord = true
        this.dialogFormVisible = true
        this.memberId = rows.memberId
        this.userName = rows.name
      },
      stationChange () {
        this.steamDistribution.groupName = ''
        this.steamDistribution.steam = ''
      },
      // 筛选团队
      selectGroupChange (val) {
        this.steamDistribution.groupName = ''
        this.teamOptions.forEach((team) => {
          if (team.teamId === val) {
            this.groupOptions = team.groupList
          }
        })
      },
      // 筛选成员状态
      selectChange (val) {
        this.membersParams.status = val
        this.getMemberList()
      },
      // 搜索值为空触发
      searchChange () {
        if (this.selectMember.memberName === '') {
          this.membersParams.searchKey = this.selectMember.memberName
          this.getMemberList()
        }
      },
      // 搜索
      searchMember () {
        this.membersParams.searchKey = this.selectMember.memberName
        this.getMemberList()
      },
      editMember (row) {
        this.memberEssentialInfo.name = row.name
        this.memberEssentialInfo.mobile = row.mobile
        this.memberId = row.memberId
        this.title = '编辑成员'
        this.isEditMember = true
        this.dialogFormVisible = true
      },
      determine () {
        if (this.isEditMember) {
          this.$refs.memberEssentialInfoForm.validate((valid) => {
            if (valid) {
              this.editMemberPut()
            } else {
              return false
            }
          })
        } else if (this.isAddMember) {
          this.dialogFormVisible = false
          this.postMember()
        } else if (this.isResetPassWord) {
          this.$refs.resetPassWordForm.validate((valid) => {
            if (valid) {
              this.dialogFormVisible = false
              this.restPassWord()
            } else {
              this.$message({
                type: 'info',
                message: '修改密码失败，请重新检查后输入！'
              })
              return false
            }
          })
        }
      },
      dialogClose () {
        this.steamDistribution = {
          station: '',
          steam: '',
          groupName: ''
        }
        this.isAddMember = false
        this.isEditMember = false
        this.isResetPassWord = false
        this.memberId = ''
        this.memberEssentialInfo.name = ''
        this.memberEssentialInfo.mobile = ''
        this.resetPassWord.newPassWord = ''
        this.resetPassWord.confirmNewPassWord = ''
        this.active = 1
      },
      dismiss (index, data, rows) {
        this.$confirm('<h3>确定要置为离职吗?</h3><p style="margin: 10px 0;">一旦置为离职，当前成员将从所在的拓客团队中移除，已发生的业务数据会保留，不在参与后续各类业务。</p>', '职位离职', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(async () => {
          const params = {
            memberId: rows.memberId,
            projectId: rows.projectId,
            tenantId: rows.tenantId
          }
          await requestExpandMembersDimission(params)
          data[index].status = 2
          this.$message({
            type: 'success',
            message: '置为离职成功!'
          })
        }).catch(() => {})
      },
      onjob (index, data, rows) {
        this.$confirm('<h3>确定要置为在职吗?</h3><p style="margin: 10px 0;">置为在职后，需要重新加入拓客团队。</p>', '职位在职', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(async () => {
          const params = {
            memberId: rows.memberId,
            projectId: rows.projectId,
            tenantId: rows.tenantId
          }
          await requestExpandMembersOnJob(params)
          data[index].status = 0
          this.$message({
            type: 'success',
            message: '置为在职成功!'
          })
        }).catch(() => {})
      },
      deleteMember (rows) {
        this.$confirm('<h3>确定删除该成员?</h3>', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(async () => {
          const params = {
            projectId: rows.projectId,
            tenantId: rows.tenantId
          }
          await requestDeleteExpandMembers(params, rows.memberId)
          this.getMemberList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {})
      },
      handleSizeChange (val) {
        this.membersParams.pageSize = val
        this.getMemberList()
      },
      handleCurrentChange (val) {
        this.membersParams.pageNo = val
        this.getMemberList()
      }
    }
  }
</script>

<style scoped lang="scss">
  .marketingMemberManage {
    .memberStatus{
      margin-top: 20px;
    }
    .title{
      line-height: 30px;
    }
    .memberButtons{
      margin-top: 20px;
      text-align: right;
    }
    .addBan {
      line-height: 52px;
      text-align: left;
      margin-top: 20px;
    }
    .showInfo{
      font-size: 12px;
      color: #0F8BE6;
      text-align: right;
    }
    .ban {
      border: 1px solid #eee;
      li {
        line-height: 40px;
        border-bottom: 1px solid #eee;
        padding: 0 24px;
        display: flex;
        &:first-child {
          padding-left: 16px;
        }
        &:last-child {
          border: none;
        }
        span{
          width: 50%;
          display: inline-block;
        }
        .buttons {
          width: 50%;
          text-align: right;
          display: inline-block;
        }
      }
    }
    .steamManagerBox{
      border: 1px solid #eee;
      min-height: 162px;
      margin-top: 72px;
      .steamManager{
        padding: 14px 18px;
        border-bottom: 1px solid #eee;
      }
    }
    .steamGroupingsBox{
      background: #eee;
      padding: 4px 18px;
    }
    .steamGroupings{
      padding: 8px 18px;
    }
    .exportTeam{
      text-align: right;
    }
    .salesBox{
      display: flex;
    }
    .sales{
      min-width: 100px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #eee;
      display: flex;
      margin-right: 18px;
      box-sizing: border-box;
      span{
        flex: 1 0;
        display: inline-block;
        font-size: 12px;
        text-align: center;
        padding: 0 10px;
        box-sizing: border-box;
      }
      .iBox{
        width: 22px;
        height: 29px;
        position: relative;
      }
      i{
        position: absolute;
        top: 3px;
        right: -4px;
        width: 29px;
        height: 22px;
        background: #eee;
        display: inline-block;
        box-sizing: border-box;
        text-align: center;
        line-height: 22px;
        transform: rotate3d(0,0,1,90deg);
        color: #303030;
        &:hover{
          cursor:pointer;
        }
      }
    }
    .addSalesBox{
      width: 30px;
      height: 30px;
      background: #F7F7F7;
      line-height: 30px;
      text-align: center;
      border: 1px dashed #eee;
      font-size: 18px;
      box-sizing: border-box;
      &:hover{
        cursor:pointer;
      }
    }
    .memberList{
      margin-left: 26px;
      margin-right: 26px;
    }
    .housingList{
      margin-top: 10px;
    }
    .organizational{
      margin-top: 10px;
    }
    .block{
      text-align: right;
      margin: 20px 0;
    }
  }
</style>

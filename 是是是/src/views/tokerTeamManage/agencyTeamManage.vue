<template>
  <div id='AgencyTeamManage' class="agencyTeamManage">
    <el-row>
      <el-col :span="6">
        <el-col :span="24" class="addBan">
          <el-button type="primary" @click="addTeams">新增总代</el-button>
        </el-col>
        <el-col :span="24">
          <ul class="ban">
            <li>总代名称</li>
            <li v-for="items in teams" :key="items.id" ref="ban" :class="items.active ? 'banActive': ''">
              <span @click="teamsClick(items)">{{ items.name }}</span>
              <div class="buttons">
                <el-button type="text" @click="editTeams(items)">编辑</el-button>
                <el-button type="text" @click="deleteTeams(items, '删除后，团队中的成员将被移除团队!')">删除</el-button>
              </div>
            </li>
          </ul>
        </el-col>
      </el-col>
      <el-col :span="17" :offset="1" class="personInChargeBox" v-if="generalAgents && shops">
        <el-col :span="24" class="personInCharge">
          <el-col :span="3" class="title">总代负责人：</el-col>
          <el-col :span="15">
            <div class="angentBox">
              <div class="angent" v-for="personInCharge in generalAgents" v-if="generalAgents.length" :key="personInCharge.memberId">
                <el-tooltip placement="top" effect="light">
                  <div slot="content">
                    <p>姓名：{{personInCharge.name}}</p>
                    <p>手机号：{{personInCharge.mobile}}</p>
                  </div>
                  <span>{{personInCharge.name}}</span>
                </el-tooltip>
                <div class="iBox">
                  <el-popover
                    placement="bottom"
                    width="82"
                    trigger="click">
                    <div style="text-align: center; margin: 0">
                      <el-button type="text" @click="editPersonInCharge(personInCharge)">编辑</el-button>
                      <el-button type="text" @click="removePersonInCharge(personInCharge.memberId, '确认删除总代负责人吗？')">删除</el-button>
                    </div>
                    <i class="el-icon-more" slot="reference"></i>
                  </el-popover>
                </div>
              </div>
              <div class="addMemberBox" @click="addPersonInCharge">+</div>
            </div>
          </el-col>
        </el-col>
        <el-col :span="24" v-if="shops.length" v-for="(shop, index) in shops" :key="index">
          <el-col :span="24" class="shopBox">
            <el-col :span="12" class="title">{{ shop.shopName }}</el-col>
          </el-col>
          <el-col :span="24" class="shop">
            <el-col :span="3" class="title">店长：</el-col>
            <el-col :span="20">
              <div class="angentBox">
                <div class="angent" v-for="shopLeader in shop.shopManagers" v-if="shopLeader.identity === 1" :key="shopLeader.memberId">
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      <p>姓名：{{shopLeader.name}}</p>
                      <p>手机号：{{shopLeader.mobile}}</p>
                    </div>
                    <span>{{ shopLeader.name }}</span>
                  </el-tooltip>
                </div>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="shop">
            <el-col :span="3" class="title">已邀请店员：</el-col>
            <el-col :span="20">
              <div class="angentBox">
                <div class="angent" v-for="clerk in shop.clerks" v-if="clerk.identity === 0" :key="clerk.memberId">
                  <el-tooltip placement="top" effect="light">
                    <div slot="content">
                      <p>姓名：{{clerk.name}}</p>
                      <p>手机号：{{clerk.mobile}}</p>
                    </div>
                    <span> {{clerk.name}} </span>
                  </el-tooltip>
                </div>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
    <el-dialog ref='dialog' :title="title" :visible.sync="dialogFormVisible" top="20vh" @close="dialogClose">
      <el-row v-if="isAgentTeam || isEditAgentTeam">
        <el-form :label-position="labelPosition" :model="agentTeam" :rules="agentTeamRules" ref="agentTeamForm" >
          <el-col :span="14">
            <el-form-item label="总代名称：" :label-width="formLabelWidth" prop="name">
              <el-input v-model="agentTeam.name" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row v-if="isPersonInCharge">
        <el-col :span="12" :offset="5" style="margin-top: 20px;">
          <el-form :label-position="labelPosition" :model="personInChargeInfo" :rules="personInChargeInfoRules" ref="personInChargeInfoForm" >
            <el-col :span="24">
              <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
                <el-input v-model="personInChargeInfo.name" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="手机号：" :label-width="formLabelWidth" prop="mobile">
                <el-input v-model.number="personInChargeInfo.mobile" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog_foot_button" type="primary" @click="determine">确 定</el-button>
        <el-button class="dialog_foot_button" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    requestPostAgencyTeam,
    requestPutAgencyTeam,
    requestGetAgencyTeam,
    requestDeleteAgencyTeam,
    requestPostAgencyTeamMember,
    requestPutAgencyTeamMember,
    requestGetAgencyTeamMembers,
    requestDeleteAgencyTeamMember
  } from '../../store/fetch/api'
  import { validateMobile } from '../../common/js/formValidation'
  export default {
    name: 'AgencyTeamManage',
    data () {
      return {
        title: '',
        memberId: '',
        dialogFormVisible: false,
        isPersonInCharge: false,
        isEditPersonInCharge: false,
        formLabelWidth: '140px',
        labelPosition: 'right',
        isAgentTeam: false,
        isEditAgentTeam: false,
        generalAgents: null,
        shops: null,
        teams: null,
        personInChargeInfo: { name: '', mobile: '' },
        personInChargeInfoRules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }]
        },
        agentTeam: { name: '' },
        agentTeamRules: {
          name: [
            {required: true, message: '请输入团队名称', trigger: 'blur'}
          ]
        },
        teamsParams: { name: '' },
        params: { tenantId: this.user.tenantId, currentPage: 1, pageSize: 50 }
      }
    },
    props: ['user'],
    created () {
      if (sessionStorage.getItem('projectId')) {
        this.getTeams('firstLoad')
      }
    },
    methods: {
      // 获取团队列表
      async getTeams (firstLoad) {
        this.params.projectId = sessionStorage.getItem('projectId')
        if (this.params.projectId) {
          const result = await requestGetAgencyTeam(this.params)
          this.teams = result.data
          if (firstLoad && this.teams.length) {
            this.agentTeamMembers = this.teams[0]
            Vue.set(this.teams[0], 'active', true)
            this.getAgencyTeamMembers()
          }
        } else {
          this.$message.info('请先选择项目')
        }
      },
      // 组建团队
      async postTeams () {
        const params = {
          name: this.agentTeam.name,
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        if (this.params.projectId) {
          await requestPostAgencyTeam(params)
          this.getTeams()
        } else {
          this.$message.info('请先选择项目')
        }
        this.dialogFormVisible = false
      },
      // 修改团队
      async putTeams () {
        const params = {
          name: this.agentTeam.name,
          teamId: this.teamsParams.teamId
        }
        await requestPutAgencyTeam(params)
        this.getTeams()
        this.dialogFormVisible = false
      },
      // 加载门店
      async getAgencyTeamMembers () {
        const result = await requestGetAgencyTeamMembers(this.agentTeamMembers.teamId)
        this.generalAgents = result.data.generalAgents
        this.shops = result.data.shops
      },
      // 新增总代负责人
      async postAgencyTeamMember () {
        const params = {
          teamId: this.agentTeamMembers.teamId,
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          name: this.personInChargeInfo.name,
          mobile: this.personInChargeInfo.mobile
        }
        await requestPostAgencyTeamMember(params)
        this.getAgencyTeamMembers()
        this.$message.success('新增总代负责人成功')
        this.dialogFormVisible = false
      },
      // 修改总代负责人
      async putAgencyTeamMember () {
        const params = {
          tenantId: this.user.tenantId,
          projectId: sessionStorage.getItem('projectId'),
          memberId: this.memberId,
          name: this.personInChargeInfo.name,
          mobile: this.personInChargeInfo.mobile
        }
        await requestPutAgencyTeamMember(params)
        this.getAgencyTeamMembers()
        this.$message.success('修改总代负责人成功')
        this.dialogFormVisible = false
      },
      async teamsClick (items) {
        this.agentTeamMembers = items
        this.$nextTick(() => {
          this.teams.forEach(function (team) {
            Vue.set(team, 'active', false)
          })
          Vue.set(items, 'active', true)
          this.getAgencyTeamMembers()
        })
      },
      addPersonInCharge () {
        this.title = '新增总代负责人'
        this.dialogFormVisible = true
        this.isPersonInCharge = true
      },
      editPersonInCharge (personInCharge) {
        this.title = '编辑总代负责人'
        this.dialogFormVisible = true
        this.isPersonInCharge = true
        this.isEditPersonInCharge = true
        this.memberId = personInCharge.memberId
        this.personInChargeInfo.name = personInCharge.name
        this.personInChargeInfo.mobile = personInCharge.mobile
      },
      removePersonInCharge (memberId, title) {
        this.$confirm(`<h3>${title}</h3>`, '删除团队', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(async() => {
          await requestDeleteAgencyTeamMember(memberId)
          this.getAgencyTeamMembers()
          this.$message.success('删除总代负责人成功')
        }).catch(() => {})
      },
      determine () {
        if (this.isAgentTeam || this.isEditAgentTeam) {
          this.$refs.agentTeamForm.validate((valid) => {
            if (valid) {
              this.isAgentTeam ? this.postTeams() : this.putTeams()
            } else {
              return false
            }
          })
        } else if (this.isPersonInCharge) {
          this.$refs.personInChargeInfoForm.validate((valid) => {
            if (valid) {
              this.isEditPersonInCharge ? this.putAgencyTeamMember() : this.postAgencyTeamMember()
            } else {
              return false
            }
          })
        }
      },
      dialogClose () {
        this.isPersonInCharge = false
        this.isEditPersonInCharge = false
        this.isAgentTeam = false
        this.isEditAgentTeam = false
        this.agentTeam.name = ''
        this.personInChargeInfo.name = ''
        this.personInChargeInfo.mobile = ''
      },
      addTeams () {
        this.dialogFormVisible = true
        this.isAgentTeam = true
        this.title = '增加团队'
      },
      editTeams (items) {
        this.agentTeam.name = items.name
        this.teamsParams.teamId = items.teamId
        this.title = '编辑团队'
        this.dialogFormVisible = true
        this.isEditAgentTeam = true
      },
      deleteTeams (items, title) {
        this.$confirm(`<h3>${title}</h3>`, '删除团队', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(async() => {
          await requestDeleteAgencyTeam(items.teamId)
          this.getTeams()
          this.generalAgents = null
          this.$message.success('删除成功')
        }).catch(() => {})
      }
    }
  }
</script>

<style scoped lang="scss">
  .agencyTeamManage {
    .title{
      line-height: 30px;
    }
    .addBan {
      line-height: 52px;
      text-align: left;
      margin-top: 20px;
    }
    .ban {
      border: 1px solid #eee;
      li {
        line-height: 40px;
        border-bottom: 1px solid #eee;
        padding: 0 24px;
        display: flex;
        &:hover{
          cursor:pointer;
        }
        &:first-child {
          padding-left: 16px;
        }
        &:last-child {
          border: none;
        }
        span{
          width: 60%;
          display: inline-block;
        }
        .buttons {
          width: 40%;
          text-align: right;
          display: inline-block;
        }
      }
      .banActive{
        background: rgb(231, 243, 253);
      }
    }
    .personInChargeBox{
      border: 1px solid #eee;
      min-height: 162px;
      margin-top: 72px;
      .personInCharge{
        padding: 10px 18px 0 18px;
        border-bottom: 1px solid #eee;
      }
    }
    .shopBox{
      background: #eee;
      padding: 4px 18px;
    }
    .shop{
      padding: 8px 18px;
    }
    .angent{
      box-shadow: 5px 5px 5px #ccc;
      float: left;
      min-width: 100px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #eee;
      display: flex;
      margin-right: 18px;
      box-sizing: border-box;
      margin-bottom: 10px;
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
    .addMemberBox{
      box-shadow: 5px 5px 5px #ccc;
      width: 30px;
      height: 30px;
      background: #F7F7F7;
      line-height: 26px;
      text-align: center;
      border: 1px dashed #eee;
      font-size: 18px;
      box-sizing: border-box;
      float: left;
      margin-bottom: 10px;
      &:hover{
        cursor:pointer;
      }
    }
  }
</style>

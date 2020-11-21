<template>
  <div id='SalesTeamManage' class="salesTeamManage">
    <el-row>
      <el-col :span="5" class='download'>
        <el-col :span="24" class="exportTeam">
          <el-button type="primary" @click="exportTemplate">模板下载</el-button>
          <el-popover
            ref="popover5"
            placement="bottom"
            width="82"
            trigger="hover"
            v-model="visible">
            <div style="text-align: center; margin: 0 auto">
              <el-upload
                class="upload-demo"
                ref="upload"
                :data="importTeamData"
                :show-file-list="false"
                action="/iCloud-rest/projects/excel/import"
                accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :before-upload='beforeAvatarUpload'
                :on-success="handleSuccess">
                <el-button size="mini" type="primary" @click='importTeam'>导入团队</el-button>
              </el-upload>
              <el-button size="mini" type="primary" style="margin: 10px 0 0 0;" @click="exportExcel">导出团队</el-button>
            </div>
          </el-popover>
          <el-button type="primary" v-popover:popover5>导入/导出</el-button>
        </el-col>
      </el-col>
      <el-col :span="24" class='teamsSaleManageList'>
        <el-col :span="2" class="title">销售经理：</el-col>
        <el-col :span="22">
          <div class="salesBox">
            <div class="sales" v-if="teamsSaleManageList.length" v-for="SaleManage in teamsSaleManageList" :key="SaleManage.memberId">
              <span>{{ SaleManage.name }}</span>
              <div class="iBox">
                <el-popover
                  placement="bottom"
                  width="82"
                  trigger="click">
                  <div style="text-align: center; margin: 0">
                    <el-button type="text" @click="removeSteam(SaleManage, '确定将当前用户移出该团队吗?')">移出团队</el-button>
                  </div>
                  <i class="el-icon-more" slot="reference"></i>
                </el-popover>
              </div>
            </div>
            <div class="addSalesBox" @click="addSalesManager(3)">+</div>
          </div>
        </el-col>
        <el-col :span="2" class="title">分接：</el-col>
        <el-col :span="22">
          <div class="salesBox">
            <div class="sales" v-if="dispatchersList.length" v-for="dispatchers in dispatchersList" :key="dispatchers.memberId">
              <span>{{ dispatchers.name }}</span>
              <div class="iBox">
                <el-popover
                  placement="bottom"
                  width="82"
                  trigger="click">
                  <div style="text-align: center; margin: 0">
                    <el-button type="text" @click="removeSteam(dispatchers, '确定将当前用户移出该团队吗?')">移出团队</el-button>
                  </div>
                  <i class="el-icon-more" slot="reference"></i>
                </el-popover>
              </div>
            </div>
            <div class="addSalesBox" @click="addSalesManager(4)">+</div>
          </div>
        </el-col>
        <el-col :span='24' class='showInfo' :style="{ color: theme }">*注意：活动期间修改销售团队信息，需再次发布活动后生效。</el-col>
      </el-col>
      <el-col :span="6">
        <el-col :span="24" class="addBan">
          <el-button type="primary" @click="addTeams">组建团队</el-button>
          <el-button type="primary" @click="teamsReset">组织调整</el-button>
        </el-col>
        <el-col :span="24">
          <ul class="ban">
            <li>团队名称</li>
            <li v-for="items in teams" :key="items.id" ref="ban" :class="items.active ? 'banActive': ''">
              <span @click="teamsClick(items)">{{ items.name }}</span>
              <div class="buttons">
                <el-button type="text" @click="editTeams(items)">编辑</el-button>
                <el-button type="text" @click="deleteTeams(items, '删除后，团队中的成员将被移除团队!', 0)">删除</el-button>
              </div>
            </li>
          </ul>
        </el-col>
      </el-col>
      <el-col :span="17" :offset="1" class="steamManagerBox" v-if="saleManageList && groupList">
        <el-col :span="24" class="steamManager">
          <el-col :span="3" class="title">团队经理：</el-col>
          <el-col :span="15">
            <div class="salesBox">
              <div class="sales" v-for="manager in saleManageList" v-if="saleManageList.length" :key="manager.memberId">
                <span>{{manager.name}}</span>
                <div class="iBox">
                  <el-popover
                    placement="bottom"
                    width="82"
                    trigger="click">
                    <div style="text-align: center; margin: 0">
                      <el-button type="text" @click="removeSteam(manager, '确定将当前用户移出该团队吗?')">移出团队</el-button>
                    </div>
                    <i class="el-icon-more" slot="reference"></i>
                  </el-popover>
                </div>
              </div>
              <div class="addSalesBox" @click="addSalesManager(2)">+</div>
            </div>
          </el-col>
          <el-col :span="6" class="exportTeam">
            <el-button type="primary" @click="addGroup">新建分组</el-button>
          </el-col>
        </el-col>
        <el-col :span="24" v-if="groupList.length" v-for="group in groupList" :key="group.groupId">
          <el-col :span="24" class="steamGroupingsBox">
            <el-col :span="12" class="title">{{ group.groupName }}</el-col>
            <el-col :span="12" class="exportTeam">
              <el-button type="text" @click="editGroup(group)">编辑</el-button>
              <el-button type="text" @click="deleteTeams(group, '删除后，小组中的成员将被移出小组!', 1)">删除</el-button>
            </el-col>
          </el-col>
          <el-col :span="24" class="steamGroupings">
            <el-col :span="3" class="title" style="text-indent: 2em;">组长：</el-col>
            <el-col :span="20">
              <div class="salesBox">
                <div class="sales" v-for="groupLeader in group.memberList" v-if="groupLeader.identity === 1" :key="groupLeader.memberId">
                  <span>{{ groupLeader.name }}</span>
                  <div class="iBox">
                    <el-popover
                      placement="bottom"
                      width="82"
                      trigger="click">
                      <div style="text-align: center; margin: 0">
                        <el-button type="text" @click="removeSteam(groupLeader, '确定将当前用户移出该团队吗?')">移出团队</el-button>
                      </div>
                      <i class="el-icon-more" slot="reference"></i>
                    </el-popover>
                  </div>
                </div>
                <div class="addSalesBox" @click="addSalesManager(1, group)">+</div>
              </div>
            </el-col>
          </el-col>
          <el-col :span="24" class="steamGroupings">
            <el-col :span="3" class="title">置业顾问：</el-col>
            <el-col :span="20">
              <div class="salesBox">
                <div class="sales" v-for="adviser in group.memberList" v-if="adviser.identity === 0" :key="adviser.memberId">
                  <span> {{adviser.name}} </span>
                  <div class="iBox">
                    <el-popover
                      placement="bottom"
                      width="82"
                      trigger="click">
                      <div style="text-align: center; margin: 0">
                        <el-button type="text" @click="removeSteam(adviser, '确定将当前用户移出该团队吗?')">移出团队</el-button>
                      </div>
                      <i class="el-icon-more" slot="reference"></i>
                    </el-popover>
                  </div>
                </div>
                <div class="addSalesBox" @click="addSalesManager(0, group)">+</div>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
    </el-row>
    <el-dialog ref='dialog' :title="title" :visible.sync="dialogFormVisible" top="20vh" @close="dialogClose">
      <el-row v-if="isSalesTeam || isPutSalesTeam">
        <el-form :label-position="labelPosition" :model="salesTeam" :rules="salesTeamRules" ref="salesTeamForm" >
          <el-col :span="14">
            <el-form-item label="团队名称：" :label-width="formLabelWidth" prop="salesTeamName">
              <el-input v-model="salesTeam.salesTeamName" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row v-if="isSalesGroup || isPutSalesGroup">
        <el-form :label-position="labelPosition" :model="salesGroup" :rules="salesGroupRules" ref="salesGroupForm" >
          <el-col :span="14">
            <el-form-item label="销售组名称：" :label-width="formLabelWidth" prop="salesGroupName">
              <el-input v-model="salesGroup.salesGroupName" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row v-if="isSelectMember || isOrganizationalAdjustment">
        <el-col :span="11" class="memberList">
          <el-col :span="6" style="line-height: 28px;" v-if="!isOrganizationalAdjustment">成员列表：</el-col>
          <el-col :span="12">
            <el-input v-model="selectMember.memberName" @change="searchMemberChange" auto-complete="off" placeholder="姓名/手机号" clearable></el-input>
          </el-col>
          <el-col :span="6" style="text-align: right;">
            <el-button type="primary" @click='searchMember'>搜索</el-button>
          </el-col>
          <el-col :span="24" class="organizational" v-if="isOrganizationalAdjustment">
            <el-col :span="6" style="line-height: 28px;">原组织：</el-col>
            <el-col :span="18">
              <el-col :span="18">
              <el-cascader
                :options="teamsGroup"
                :props="teamsGroupProps"
                change-on-select
                @change='originalGroupChange'
              ></el-cascader>
            </el-col>
            </el-col>
          </el-col>
          <el-col :span="24" class="housingList">
            <el-table
              ref="memberTable"
              :data="tableData"
              height="250"
              stripe
              :style="{ borderColor: theme, width: '100%'}"
              @selection-change="selectionChange">
              <el-table-column
                type="selection"
                width="30">
              </el-table-column>
              <el-table-column
                label="序号"
                align="center"
                type="index"
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
                label="身份"
                align="center"
                v-if='isOrganizationalAdjustment'
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="tableText" v-if='scope.row.identity === 0'>置业顾问</span>
                  <span class="tableText" v-else-if='scope.row.identity === 1'>销售组长</span>
                  <span class="tableText" v-else-if='scope.row.identity === 2'>团队经理</span>
                  <span class="tableText" v-else>销售经理</span>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24" v-if='!isOrganizationalAdjustment'>
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
        </el-col>
        <el-col :span="11">
          <el-col :span="24" style="line-height: 28px;" v-if="!isOrganizationalAdjustment">已选择成员列表</el-col>
          <el-col :span="24" style="height: 28px;" v-if="isOrganizationalAdjustment"></el-col>
          <el-col :span="24" class="organizational" v-if="isOrganizationalAdjustment">
            <el-col :span="6" style="line-height: 28px;">现组织：</el-col>
            <el-col :span="18">
              <el-cascader
                :options="teamsGroup"
                :disabled='SelectMemberData.length ? true : false'
                :props="teamsGroupProps"
                @change='newGroupChange'
                change-on-select
              ></el-cascader>
            </el-col>
          </el-col>
          <el-col :span="24" class="housingList">
            <el-table
              :data="SelectMemberData"
              height="250"
              stripe
              :style="{ borderColor: theme, width: '100%'}">
              <el-table-column
                label="序号"
                align="center"
                type="index"
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
                label="身份"
                align="center"
                v-if='isOrganizationalAdjustment'
                show-overflow-tooltip>
                <template slot-scope="scope">
                  <span class="tableText" v-if='scope.row.identity === 0'>置业顾问</span>
                  <span class="tableText" v-else-if='scope.row.identity === 1'>销售组长</span>
                  <span class="tableText" v-else>团队经理</span>
                </template>
              </el-table-column>
              <el-table-column
              label="操作"
              align="center">
                <template slot-scope="scope">
                <el-button type="text" class="operation" @click="removeMember(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
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
    excelExport,
    excelProcess,
    requestTeamsSaleManagers,
    requestTeamsMembersPost,
    requestTeamsMemberPost,
    requestTeams,
    requestTeamsGroup,
    requestTeamsPost,
    requestTeamsPut,
    requestTeamsMembersPut,
    requestTeamsDelete,
    requestTeamsStructure,
    requestTeamsMembersDelete,
    requestTeamsGroupMembers,
    requestTeamsMembers
  } from '../../store/fetch/api'
  import { formatDate } from '../../common/js/date.js'
  import {mapGetters} from 'vuex'

  export default {
    name: 'SalesTeamManage',
    data () {
      return {
        timerId: null,
        totalRecord: 1,
        currentPage: 1,
        pageSize: 1,
        totalPage: 1,
        visible: false,
        title: '',
        identity: '',
        originalGroup: '',
        newGroup: '',
        newGroupId: '',
        dialogFormVisible: false,
        formLabelWidth: '140px',
        labelPosition: 'right',
        isSalesTeam: false,
        isPutSalesTeam: false,
        isPutSalesGroup: false,
        isSalesGroup: false,
        isSelectMember: false,
        isOrganizationalAdjustment: false,
        isSubmitTeamsMembersPut: true,
        importTeamData: {
          module: 'team',
          projectId: '',
          tenantId: this.user.tenantId
        },
        tableData: [],
        SelectMemberData: [],
        group: '',
        groups: '',
        teamsSaleManageList: [],
        dispatchersList: [],
        groupList: null,
        saleManageList: null,
        teams: null,
        teamsGroup: null,
        teamsGroupProps: {
          label: 'name'
        },
        salesTeam: {
          salesTeamName: ''
        },
        salesTeamRules: {
          salesTeamName: [
            {required: true, message: '请输入团队名称', trigger: 'blur'}
          ]
        },
        salesGroup: {
          salesGroupName: ''
        },
        salesGroupRules: {
          salesGroupName: [
            {required: true, message: '请输入销售组名称', trigger: 'blur'}
          ]
        },
        selectMember: {
          memberName: ''
        },
        teamsParams: {
          name: '',
          projectId: '',
          tenantId: this.user.tenantId,
          type: '0'
        },
        params: {
          projectId: '',
          tenantId: this.user.tenantId,
          currentPage: 1,
          pageSize: 20
        },
        addMember: {
          identity: '',
          memberIds: [],
          projectId: '',
          tenantId: this.user.tenantId,
          teamId: ''
        },
        putOrganizationParams: [],
        teamsMembersParams: {
          pageNo: '1',
          pageSize: '10',
          projectId: '',
          searchKey: '',
          tenantId: this.user.tenantId
        }
      }
    },
    props: ['user', 'projectNameActive'],
    computed: mapGetters({
      theme: 'GET_COLOUR'
    }),
    created () {
      if (sessionStorage.getItem('projectId')) {
        this.getTeams('firstLoad')
        this.getTeamsSaleManagers()
      }
    },
    methods: {
      // 获取团队列表
      async getTeams (firstLoad) {
        this.params.projectId = sessionStorage.getItem('projectId')
        if (this.params.projectId) {
          const result = await requestTeams(this.params)
          this.teams = result.data
          if (firstLoad && this.teams.length) {
            this.group = this.teams[0]
            Vue.set(this.teams[0], 'active', true)
            this.loadGroup()
          }else{
            this.groupList = []
            this.saleManageList = []
          }
        } else {
          this.$message.info('请先选择项目')
        }
      },
      // 组织调整
      async getTeamsGroup () {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        if (this.params.projectId) {
          const result = await requestTeamsGroup(params)
          this.teamsGroup = result.data
          this.dialogFormVisible = true
          this.isOrganizationalAdjustment = true
          this.title = '组织调整'
        } else {
          this.$message.info('请先选择项目')
        }
      },
      // 组建团队
      async postTeams () {
        this.teamsParams.projectId = sessionStorage.getItem('projectId')
        if (this.params.projectId) {
          this.teamsParams.name = this.salesTeam.salesTeamName
          this.teamsParams.type = 0
          await requestTeamsPost(this.teamsParams)
          this.getTeams()
        } else {
          this.$message.info('请先选择项目')
        }
        this.dialogFormVisible = false
      },
      // 新建分组
      async postGroup () {
        delete this.teamsParams.teamId
        this.teamsParams.projectId = sessionStorage.getItem('projectId')
        this.teamsParams.name = this.salesGroup.salesGroupName
        this.teamsParams.parentId = this.group.teamId
        this.teamsParams.type = 1
        await requestTeamsPost(this.teamsParams)
        this.loadGroup()
        this.dialogFormVisible = false
      },
      // 修改团队
      async putTeams () {
        delete this.teamsParams.parentId
        this.teamsParams.projectId = sessionStorage.getItem('projectId')
        this.teamsParams.name = this.salesTeam.salesTeamName
        this.teamsParams.type = 0
        await requestTeamsPut(this.teamsParams, this.teamsParams.teamId)
        this.getTeams()
        this.dialogFormVisible = false
      },
      async putGroup () {
        delete this.teamsParams.parentId
        this.teamsParams.projectId = sessionStorage.getItem('projectId')
        this.teamsParams.name = this.salesGroup.salesGroupName
        this.teamsParams.type = 1
        await requestTeamsPut(this.teamsParams, this.teamsParams.teamId)
        this.loadGroup()
        this.dialogFormVisible = false
      },
      // 添加成员
      async postTeamsMember () {
        if (this.SelectMemberData.length) {
          this.addMember.identity = this.identity
          this.addMember.projectId = sessionStorage.getItem('projectId')
          this.groups ? this.addMember.teamId = this.groups.groupId : this.addMember.teamId = this.group.teamId
          this.SelectMemberData.forEach((selectMember, index) => {
            this.addMember.memberIds[index] = selectMember.memberId
          })
          await requestTeamsMemberPost(this.addMember)
          this.identity === 3 || this.identity === 4 ? this.getTeamsSaleManagers() : this.loadGroup()
          this.dialogFormVisible = false
          this.$message.success('添加成员成功')
        }
      },
      // 调整组织
      async teamsMembersPut () {
        if (this.SelectMemberData.length) {
          this.SelectMemberData.forEach((selectMember) => {
            this.putOrganizationParams.push({
              identity: selectMember.identity,
              memberId: selectMember.memberId,
              projectId: sessionStorage.getItem('projectId'),
              tenantId: this.user.tenantId,
              teamId: this.newGroupId
            })
          })
          if (this.putOrganizationParams.length) {
            await requestTeamsMembersPut(this.putOrganizationParams)
            if (this.group.teamId) {
              this.loadGroup()
            }
            this.dialogFormVisible = false
            this.$message.success('组织调整成功')
          }
        } else {
          this.$message.info('无可调整人员')
        }
      },
      // 查询组织成员
      async getTeamsMember () {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          searchKey: this.selectMember.memberName
        }
        const result = await requestTeamsMembers(params)
        this.tableData = result.data
      },
      // 获取为选择成员列表
      async getTeamsMembers () {
        this.teamsMembersParams.projectId = sessionStorage.getItem('projectId')
        const result = await requestTeamsMembersPost(this.teamsMembersParams)
        this.totalRecord = result.data.totalRecord
        this.currentPage = result.data.currentPage
        this.pageSize = result.data.pageSize
        this.totalPage = result.data.totalPage
        this.tableData = result.data.result
      },
      // 获取团队或组成员
      async getTeamsGroupMembers (params) {
        const result = await requestTeamsGroupMembers(params)
        this.tableData = result.data
      },
      // 获取团队销售经理和分接
      async getTeamsSaleManagers () {
        this.params.projectId = sessionStorage.getItem('projectId')
        const result = await requestTeamsSaleManagers(this.params)
        this.teamsSaleManageList = result.data.saleManagers
        this.dispatchersList = result.data.dispatchers
      },
      globalExport (result, templateName) {
        const content = result
        const blob = new Blob([content])
        const fileName = `${templateName}.xlsx`
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      },
      downloadByIframe (url) {
        var iframe = document.getElementById('myIframe')
        if (iframe) {
          iframe.src = url
        } else {
          iframe = document.createElement('iframe')
          iframe.style.display = 'none'
          iframe.src = url
          iframe.id = 'myIframe'
          document.body.appendChild(iframe)
        }
      },
      // 导出模板
      exportTemplate () {
        this.downloadByIframe('./static/excelTemplate/团队导入模板.xlsx')
      },
      async exportExcel () {
        const form = {
          module: 'team',
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        if (!form.projectId) {
          this.$message.info('请选择一个项目')
          return false
        } else {
          const result = await excelExport(form)
          const date = new Date()
          const currentTime = formatDate(date, 'yyyyMMdd_hhmmss')
          this.globalExport(result, `${this.projectNameActive}_团队列表_${currentTime}`)
          this.$message.success('导出团队列表成功')
        }
      },
      // 加载分组
      async loadGroup () {
        const params = {
          teamId: this.group.teamId,
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId
        }
        const result = await requestTeamsStructure(params, this.group.teamId)
        this.groupList = result.data.groupList
        this.saleManageList = result.data.saleManageList
      },
      async teamsClick (items) {
        this.group = items
        this.$nextTick(() => {
          this.teams.forEach(function (team) {
            Vue.set(team, 'active', false)
          })
          Vue.set(items, 'active', true)
          this.loadGroup()
        })
      },
      originalGroupChange (val) {
        const params = {
          projectId: sessionStorage.getItem('projectId'),
          tenantId: this.user.tenantId,
          teamId: val[val.length - 1],
          type: val.length > 1 ? 1 : 0
        }
        this.getTeamsGroupMembers(params)
      },
      newGroupChange (val) {
        this.newGroup = val
        this.newGroupId = val[val.length - 1]
      },
      // 点击dialog确定
      determine () {
        if (this.isSalesTeam || this.isPutSalesTeam) {
          this.$refs.salesTeamForm.validate((valid) => {
            if (valid) {
              this.isSalesTeam ? this.postTeams() : this.putTeams()
            } else {
              return false
            }
          })
        } else if (this.isSelectMember || this.isOrganizationalAdjustment) {
          this.isSelectMember ? this.postTeamsMember() : this.teamsMembersPut()
        } else if (this.isSalesGroup || this.isPutSalesGroup) {
          this.$refs.salesGroupForm.validate((valid) => {
            if (valid) {
              this.isSalesGroup ? this.postGroup() : this.putGroup()
            } else {
              return false
            }
          })
        }
      },
      dialogClose () {
        this.isSalesTeam = false
        this.isSalesGroup = false
        this.isSelectMember = false
        this.isPutSalesTeam = false
        this.isPutSalesGroup = false
        this.isOrganizationalAdjustment = false
        this.salesGroup.salesGroupName = ''
        this.salesTeam.salesTeamName = ''
        this.newGroupId = ''
        this.selectMember.memberName = ''
        this.addMember.memberIds = []
        this.tableData = []
        this.SelectMemberData = []
        this.newGroup = []
      },
      addGroup () {
        this.dialogFormVisible = true
        this.isSalesGroup = true
        this.title = '新建分组'
      },
      addTeams () {
        this.dialogFormVisible = true
        this.isSalesTeam = true
        this.title = '组建团队'
      },
      teamsReset () {
        this.getTeamsGroup()
      },
      addSalesManager (identity, groups) {
        this.identity = identity
        this.groups = groups
        this.dialogFormVisible = true
        this.isSelectMember = true
        this.title = '选择成员'
        this.getTeamsMembers()
      },
      editGroup (group) {
        this.salesGroup.salesGroupName = group.groupName
        this.teamsParams.teamId = group.groupId
        this.title = '编辑分组'
        this.dialogFormVisible = true
        this.isPutSalesGroup = true
      },
      editTeams (items) {
        this.salesTeam.salesTeamName = items.name
        this.teamsParams.teamId = items.teamId
        this.title = '编辑团队'
        this.dialogFormVisible = true
        this.isPutSalesTeam = true
      },
      deleteTeams (items, title, type) {
        this.$confirm(`<h3>${title}</h3>`, type === 0 ? '删除团队' : '删除小组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
          dangerouslyUseHTMLString: true
        }).then(async() => {
          const params = {
            teamId: type === 0 ? items.teamId : items.groupId,
            projectId: sessionStorage.getItem('projectId'),
            tenantId: this.user.tenantId,
            type: type
          }
          await requestTeamsDelete(params, params.teamId)
          if (type === 0) {
            this.getTeams()
            this.saleManageList = null
          } else {
            this.loadGroup()
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {})
      },
      removeMember (row) {
        this.$refs.memberTable.toggleRowSelection(row)
      },
      removeSteam (data, title) {
        this.$confirm(`<h3>${title}</h3><p style="margin: 10px 0;">如果当前用户已离职，建议在成员管理置为离职，会同时触发移除各团队</p><p>如果仅仅是调岗，请继续确定移出当前团队</p>`, '移出团队', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(async () => {
          const params = {
            memberId: data.memberId,
            teamId: data.teamId,
            projectId: data.projectId,
            tenantId: data.tenantId
          }
          await requestTeamsMembersDelete(params, data.memberId)
          this.getTeamsSaleManagers()
          if (this.group.teamId) {
            this.loadGroup()
          }
          this.$message({
            type: 'success',
            message: '移出成功!'
          })
        }).catch(() => {})
      },
      importTeam () {
        this.importTeamData.projectId = sessionStorage.getItem('projectId')
      },
      beforeAvatarUpload (file) {
        if (this.importTeamData.projectId) {
          let Xls = file.name.split('.')
          if (Xls[Xls.length - 1] === 'xls' || Xls[Xls.length - 1] === 'xlsx') {
            return file
          } else {
            this.$message.error('导入文件只能是 xls/xlsx 格式')
            return false
          }
        } else {
          this.$message.info('请选择一个项目')
          return false
        }
      },
      handleSuccess (res, file, fileList) {
        if (res.status === 200) {
          const params = {
            module: 'team',
            taskId: res.data
          }
          this.$message({
            message: res.message.describeCn,
            duration: '1000',
            type: 'info'
          })
          this.timerId = setInterval(async() => {
            const result = await excelProcess(params)
            const state = {
              isShowProgress: false,
              percentage: 0,
              info: ''
            }
            const progress = {
              isShowProgress: true,
              percentage: result.data.process,
              info: result.data.message
            }
            this.$store.commit('UPDATE_PROGRESS', progress)
            if (result.data.status === 1) {
              clearInterval(this.timerId)
              if (result.data.success === 1) {
                this.$message({
                  message: result.data.message,
                  type: 'success'
                })
                this.getTeams()
                this.getTeamsSaleManagers()
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
              }
              this.$store.commit('UPDATE_PROGRESS', state)
              if (result.data.excelUrl) {
                window.location.href = result.data.excelUrl
              }
            }
          }, 1000)
        } else {
          this.$message({
            message: res.message.message,
            type: 'error'
          })
        }
      },
      searchMember () {
        if (this.isSelectMember) {
          this.teamsMembersParams.searchKey = this.selectMember.memberName
          this.getTeamsMembers()
        } else {
          this.getTeamsMember()
        }
      },
      searchMemberChange () {
        if (!this.selectMember.memberName) {
          if (this.isSelectMember) {
            this.teamsMembersParams.searchKey = this.selectMember.memberName
            this.getTeamsMembers()
          } else {
            this.getTeamsMember()
          }
        }
      },
      handleSizeChange (val) {
        this.teamsMembersParams.pageSize = val
        this.getTeamsMembers()
      },
      handleCurrentChange (val) {
        this.teamsMembersParams.pageNo = val
        this.getTeamsMembers()
      },
      selectionChange (selection) {
        if (selection[selection.length - 1] && this.isOrganizationalAdjustment) {
          let i = selection.length
          while (i--) {
            if (selection[i].identity === 3) {
              this.$refs.memberTable.toggleRowSelection(selection[i], false)
              this.$message.info('销售经理不可调整')
              selection.splice(i, 1)
            }
          }
          if (!this.newGroup.length) {
            this.$refs.memberTable.toggleRowSelection(selection[0], false)
            this.$message.info('请先选择现组织')
            selection = []
            return false
          } else if (this.newGroup.length > 1) {
            let i = selection.length
            while (i--) {
              if (selection[i].identity === 2) {
                this.$refs.memberTable.toggleRowSelection(selection[i], false)
                this.$message.info('团队经理只能调整到指定团队')
                selection.splice(i, 1)
              }
            }
          } else if (this.newGroup.length === 1) {
            let i = selection.length
            while (i--) {
              if (selection[i].identity === 0 || selection[i].identity === 1) {
                this.$refs.memberTable.toggleRowSelection(selection[i], false)
                this.$message.info('销售组长和置业经理只能调整到指定小组')
                selection.splice(i, 1)
              }
            }
          }
        }
        this.SelectMemberData = selection
      }
    }
  }
</script>

<style scoped lang="scss">
  .salesTeamManage {
    .download{
      position: absolute;
      right: 0;
      top: -28px;
    }
    .teamsSaleManageList{
      margin-top: 20px;
    }
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
    .steamManagerBox{
      border: 1px solid #eee;
      min-height: 162px;
      margin-top: 72px;
      .steamManager{
        padding: 10px 18px 0 18px;
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
    .sales{
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
    .showInfo{
      font-size: 12px;
      color: #0F8BE6;
    }
    .addSalesBox{
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

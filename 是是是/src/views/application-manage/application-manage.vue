<template>
  <el-row class="application-manage">
    <el-col style="display: flex;align-items: center;" :span="24">
      <el-col :span="4">
        <LabelTitle :title="'授权应用'"></LabelTitle>
      </el-col>
      <el-col :span="20" style="text-align: right;">
        <el-button v-if="!isActivity" :disabled="authForm.chargingId == '' || userProjectCount >= projectCount" @click="ctrlNewAuth" type="primary">新增授权</el-button>
        <el-button v-if="isActivity" :disabled="authForm.chargingId == '' || userActivityCount >= activityCount" @click="ctrlNewAuth" type="primary">新增活动</el-button>
      </el-col>
    </el-col>
    <el-col>
      <el-tabs @tab-click="handleTabsClick" :tab-position="'left'" v-model="selectedAppId" style="height: 200px;" class='applicationTabs'>
        <el-tab-pane v-for="(item, index) of appList" :label="item.name || ''" :name="item.applianceId" :value="item.applianceId" :key="index">
          <el-col :span="24" class="status-count">
            <el-col class="count-item" :span="8">授权期限：<span :style="{ color: theme }">{{authDateGap}}</span></el-col>
            <el-col class="count-item" v-if="!isActivity" :span="8">授权项目数：<span :style="{ color: theme }">{{projectCount}}</span><span class="used" :style="{ color: theme }">&nbsp;&nbsp;（已授权：{{userProjectCount}}）</span></el-col>
            <el-col class="count-item" v-if="isActivity" :span="8">活动数量：<span :style="{ color: theme }">{{activityCount}}</span><span class="used" :style="{ color: theme }">&nbsp;&nbsp;（已授权：{{useActivityCount}}）</span></el-col>
            <!-- <el-col v-if="!isActivity" class="count-item" :span="4">可授权状态：<span>{{userProjectCount < projectCount ? '可授权' : '不可授权'}}</span></el-col> -->
            <!-- <el-col v-else class="count-item" :span="4">可授权状态：<span>{{activityCount < useActivityCount ? '可授权' : '不可授权'}}</span></el-col> -->
            <el-col class="select-project" style="text-align: right;" :span="8">
              <el-col class="title" :span="12">
                <span>项目名称: &nbsp;&nbsp;&nbsp;</span>
              </el-col>
              <el-col :span="12">
                <el-select v-model="selectedProject" placeholder="请选择项目">
                  <el-option
                    v-for="item in projectList"
                    :key="item.value"
                    :label="item.referred"
                    :value="item.projectId">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-col>
          <el-col>
            <el-table
              class="application-manage-table"
              :data="authTableData"
              stripe
              :style="{borderColor: theme, width: '100%'}">
              <el-table-column
                label="项目名称">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.projectName }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                label="授权数量">
                <template slot-scope="scope">
                  <span>{{ scope.row.count }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="已用数量">
                <template slot-scope="scope">
                  <span>{{ scope.row.count }}</span>
                </template>
              </el-table-column> -->
              <el-table-column
                label="授权期限">
                <template slot-scope="scope">
                  <span>{{ scope.row.dissipate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="当前状态">
                <template slot-scope="scope">
                  <span>{{ statusType[scope.row.status] }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    v-show="!isActivity"
                    type="primary"
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)">启用</el-button>
                  <el-button
                    v-if="scope.row.status == 0 || scope.row.status == 2"
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="authActivityTotal.currentPage"
                :page-sizes="[10, 20, 30]"
                :page-size="authTableListCtrlForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="authActivityTotal">
              </el-pagination>
            </div>
          </el-col>
          <!-- <el-col class="none-data" v-else>
            暂无数据
          </el-col> -->
        </el-tab-pane>
      </el-tabs>
    </el-col>
    <el-dialog title="新增授权" :visible.sync="dialogAuthFormVisible">
      <el-form :rules="authFormRules" ref="authForm" :model="authForm">
        <el-row>
          <el-col :span="15">
            <el-form-item prop="chargingId" label="选择应用" :label-width="formLabelWidth">
              <el-select disabled v-model="authForm.applianceId" placeholder="请选择应用">
                <el-option v-for="(item, index) of appList" :key="index" :label="item.name || ''" :name="item.applianceId" :value="item.applianceId || ''"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item prop="projectId" label="选择项目" :label-width="formLabelWidth">
              <el-select v-model="authForm.projectId" :name="authForm.projectId" :value-key="name" placeholder="请选择项目">
                <el-option
                  :value-key="selectedProject"
                  :name="authForm.projectId"
                  v-for="item in projectList"
                  :key="item.projectId"
                  :label="item.referred || ''"
                  :value="item.projectId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item prop="dissipate" label="使用期限" :label-width="formLabelWidth">
          <el-date-picker
            v-model="authForm.dissipate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            :picker-options="pickerOptions1"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-col :span="12">
          <el-form-item prop="activityCount" :label="isActivity ? '活动数量' : '授权数量'" :label-width="formLabelWidth">
            <el-input style="width: 100%;" v-model="authForm.activityCount" auto-complete="off" clearable></el-input>          
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAuthCharging('authForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import LabelTitle from '../../components/LabelTitle'
import {
  requestAppActivityRulesGet,
  requestAppProjectRulesGet,
  requestProjectList,
  requestSaveProjectAuthPost,
  requestSaveProjectSelectionGet,
  requestSaveProjectAuthDelete
  } from '../../store/fetch/api.js'
import {mapGetters} from 'vuex'

let moment = require('moment')

export default {
  data () {
    return {
      name: '',
      userActivityCount: 0,
      statusType: {
        0: '已授权',
        2: '未开始',
        1: '已使用',
        9: '已过期'
      },
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      authTableListCtrlForm: {
        pageSize: 10,
        currentPage: 1,
        applianceId: '',
        tenantId: ''
      },
      authTableData: [],
      projectList: [],
      currentPage: 1,
      dialogAuthFormVisible: false,
      formLabelWidth: '200px',
      authForm: {
        chargingId: '',
        projectId: '',
        createUserId: '',
        lastModifyUserId: '',
        dissipate: '',
        type: 0,
        applianceId: ''
      },
      authFormRules: {
        chargingId: [{ required: true, message: '请选择应用', trigger: 'blur' }],
        projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
        dissipate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        activityCount: [{ required: true, message: '请输入活动数量', trigger: 'blur' }]
      },
      authDateGap: '',
      projectCount: 0,
      userProjectCount: 0,
      activityCount: 0,
      useActivityCount: 0,
      selectedApp: null,
      selectedAppId: '',
      authActivityTotal: 0,
      selectedProject: '',
      isActivity: false
    }
  },
  components: {
    LabelTitle
  },
  props: ['user', 'appList', 'projectId', 'companyId'],
  computed: mapGetters({
    theme: 'GET_COLOUR'
  }),
  methods: {
    handleSizeChange (size) {
      this.authTableListCtrlForm.pageSize = size
      this.getAuthCharging()
    },
    handleCurrentChange (cp) {
      this.authTableListCtrlForm.currentPage = cp
      this.getAuthCharging()
    },
    handleTabsClick (i, e) {
      if (i.label === '网上开盘') {
        this.isActivity = true
      } else {
        this.isActivity = false
      }
      this.selectedProject = ''
      this.selectedApp = this.appList[this.appList.findIndex(item => item.applianceId === i.$attrs.value)]
      sessionStorage.setItem('selectedApp', JSON.stringify(this.selectedApp))
      this.authForm.chargingId = this.selectedApp.applianceId
      this.getAuthCountData()
      this.getAuthCharging()
    },
    async getProjectList () {
      let res = await requestProjectList({
        tenantId: this.user.tenantId
      })
      this.projectList = res.data.result
    },
    async getAuthCountData () {
      let res = null
      if (this.isActivity) {
        res = await requestAppActivityRulesGet({
          tenantId: this.user.tenantId,
          applianceId: this.selectedApp.applianceId
        })
      } else {
        res = await requestAppProjectRulesGet({
          tenantId: this.user.tenantId,
          applianceId: this.selectedApp.applianceId
        })
      }

      // debugger
      if (res.data && res.status === 200) {
        this.authDateGap = `${res.data['start'].replace(' 00:00:00', '')} 到 ${res.data['overTime'].replace(' 23:59:59', '')}`
        this.pickerOptions1 = {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7 || moment(time.getTime()).unix() > moment(res.data['overTime']).unix()
          }
        }
        this.projectCount = res.data['projectCount']
        this.activityCount = res.data['activityCount']
        this.authForm.chargingId = res.data['chargingId']
        this.useActivityCount = res.data['useActivityCount']
        this.userProjectCount = res.data['userProjectCount']
        // debugger
      } else {
        this.authDateGap = '无'
        this.projectCount = '无'
        this.activityCount = '无'
        this.useActivityCount = '无'
        this.userProjectCount = '无'
      }
    },
    async addAuthCharging (formName) {
      this.authForm.createUserId = this.user.createUserId
      this.authForm.lastModifyUserId = this.user.lastModifyUserId
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.authForm['type'] = this.selectedApp['type']
          this.authForm['applianceId'] = this.selectedAppId
          this.authForm.start = moment(this.authForm.dissipate[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.authForm.dissipate = moment(this.authForm.dissipate[1]).format('YYYY-MM-DD') + ' 23:59:59'
          let params = []
          let format = JSON.parse(JSON.stringify(this.authForm))
          delete format['activityCount']
          for (let i = 0; i < this.authForm.activityCount; i++) {
            params.push(format)
          }
          if (!this.isActivity) {
            if (Number.parseInt(this.authForm.activityCount) <= (this.projectCount - this.userProjectCount)) {
              let res = await requestSaveProjectAuthPost(params)
              if (res.status === 200) {
                this.$message.success('新增成功！')
                this.dialogAuthFormVisible = false
                this.getAuthCharging()
                this.getAuthCountData()
              } else {
                this.$message.warning('res.message.describeCn')
              }
              this.authForm['dissipate'] = []
            } else {
              this.$message.warning('使用额度不足！')
            }
          } else {
            if (Number.parseInt(this.authForm.activityCount) <= (this.activityCount - this.useActivityCount)) {
              let res = await requestSaveProjectAuthPost(params)
              if (res.status === 200) {
                this.$message.success('新增成功！')
                this.dialogAuthFormVisible = false
                this.getAuthCharging()
                this.getAuthCountData()
              } else {
                this.$message.warning('res.message.describeCn')
              }
              this.authForm['dissipate'] = []
            } else {
              this.$message.warning('使用额度不足！')
            }
          }
        } else {
          return false
        }
      })
    },
    async getAuthCharging () {
      // debugger
      // if (this.selectedProject) {
      this.authTableListCtrlForm.applianceId = this.selectedApp.applianceId
      this.authForm.applianceId = this.selectedApp.applianceId
      this.authTableListCtrlForm.tenantId = this.user.tenantId
      if (this.selectedProject) {
        this.authTableListCtrlForm['projectId'] = this.selectedProject
      } else if (this.authTableListCtrlForm['projectId']) {
        delete this.authTableListCtrlForm['projectId']
      }
      let res = await requestSaveProjectSelectionGet(this.authTableListCtrlForm)
      this.authTableData = []
      if (res.data.result.length > 0) {
        this.authTableData = res.data.result
        this.authActivityTotal = res.data.totalRecord
      }
    },
    async handleDelete (index, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await requestSaveProjectAuthDelete(row.billId)
        if (res.status === 200) {
          this.getAuthCountData()
          this.authTableData.splice(index, 1)
          this.authActivityTotal = this.authActivityTotal - 1
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    ctrlNewAuth () {
      this.dialogAuthFormVisible = true
      this.getProjectList()
      if (this.$refs['authForm']) {
        this.$refs['authForm'].resetFields()
      }
      this.authForm.applianceId = this.selectedAppId
      this.authForm.projectId = this.selectedProject
    }
  },
  watch: {
    appList: function (v, o) {
      if (v.length > 0) {
        let selected = sessionStorage.getItem('selectedApp') || null
        if (selected === null || '') {
          this.selectedApp = this.appList[0]
          this.selectedAppId = this.appList[0].applianceId
          sessionStorage.setItem('selectedApp', JSON.stringify(this.selectedApp))
        } else {
          this.selectedApp = JSON.parse(selected)
          this.selectedAppId = this.selectedApp.applianceId
        }
        this.getAuthCountData()
        this.getAuthCharging()
      }
    },
    selectedProject: function (n, o) {
      let projectId = this.selectedProject || ''
      // this.authTableListCtrlForm.projectId = projectId
      this.authForm.projectId = projectId
      this.authTableData = []
      this.authDateGap = ''
      // this.projectCount = 0
      // this.userProjectCount = 0
      // this.activityCount = 0
      // this.useActivityCount = 0
      // this.getAuthCountData()
      // // debugger
      // if (projectId) {
      this.getAuthCharging(true)
      // }
    }
  },
  mounted () {
    let projectId = sessionStorage.getItem('projectId') || ''
    this.selectedApp = JSON.parse(sessionStorage.getItem('selectedApp')) || null
    if (this.selectedApp.name === '网上开盘') {
      this.isActivity = true
    } else {
      this.isActivity = false
    }
    this.authTableListCtrlForm.tenantId = this.user.tenantId
    this.authForm.projectId = projectId
    this.getProjectList()
  },
  created () {}
}
</script>


<style lang="scss" scoped>
.application-manage {
  .status-count {
    padding: 10px;
    .count-item {
      padding: 10px;
      span {
        color: #0F8BE6;
      }
    }
  }
  .pagination {
    text-align: right;
    margin: 20px 0;
  }
  .el-tabs {
    height: min-content!important;
  }
  .none-data {
    text-align: center;
    color: #aaa;
  }
  .el-tabs .is-active {
    background: #EAF7FF!important;
    color: #303030;
  } 
  .select-project {
    text-align: right;
    display: flex;
    align-items: center;
  }
  span.used {
    color: #eee;
  }
}
</style>


<template>
  <div id='BackstageUser' class="backstageUser" v-if='user.type === 0'>
    <el-row>
      <el-col :span="6">
        <el-col :span="24">
          <LabelTitle :title="'公司列表'"></LabelTitle>
        </el-col>
        <el-col :span="24">
          <el-tree
            ref="tree"
            :data="organization"
            :props="defaultProps"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent"
            @node-click="organizationClick">
          </el-tree>
        </el-col>
      </el-col>
      <el-col :span="17" :offset="1" class="housingListCol">
        <el-row>
          <el-col :span="24" class="filterBox">
            <el-col :span="12" class="colTop">
                  <el-col :span="3" class="title">状态：</el-col>
                  <el-col :span="6">
                    <el-select v-model="userStatus" placeholder="全部" @change='selectUserStatus'>
                      <el-option
                        v-for="item in userStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8" :offset="1">
                    <el-input v-model="searchUser" 
                              placeholder="登录名"
                              @keyup.enter.native="searchBackUser"
                              clearable></el-input>
                  </el-col>
                </el-col>
                <el-col :span="12" class="rightButton">
                  <el-button type="primary" @click='searchBackUser'>搜索</el-button>
                  <el-button type="primary" @click='addUser' :disabled="!companyId">新增用户</el-button>
                </el-col>
                <el-col :span="24" class="housingList">
                  <el-table
                    :data="tableData"
                    height="447"
                    stripe
                    :style="{borderColor: this.theme, width: '100%'}">
                    <el-table-column
                      type="selection"
                      width="30">
                    </el-table-column>
                    <el-table-column
                      label="序号"
                      align="center"
                      type="index"
                      width="60"
                      show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                      label="角色名称"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>
                          {{ scope.row.type | typeName}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="用户"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>
                          {{ scope.row.name}}
                        </span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="登录名"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span>{{ scope.row.account }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="所属公司"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText">{{ scope.row.companyName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="所属项目"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText" v-for='( project, index ) in scope.row.projects' :key='index'>{{ project.referred }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="状态"
                      align="center"
                      show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="tableText">{{ scope.row.status < 0 ? '禁用' : '启用' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作"
                      align="center">
                      <template slot-scope="scope">
                        <el-button type="text" class="operation" @click='editUser(scope.row)'>编辑</el-button>
                        <el-button type="text" class="operation" @click='authorizedApp(scope.row)'>授权应用</el-button>
                        <el-popover
                          placement="bottom"
                          width="82"
                          trigger="hover">
                          <div style="text-align: center; margin: 0">
                            <el-button type="text" class="operation" @click='resetPassword(scope.row)'>密码重置</el-button>
                            <el-button 
                              type="text"
                              style='margin: 0'
                              v-if='scope.row.status > -1'
                              @click='disable(scope.$index, tableData, scope.row, -1, "此操作将禁用该账号的登录权限, 是否继续?")'>
                              禁用账号
                            </el-button>
                            <el-button 
                              type="text"
                              style='margin: 0'
                              v-if='scope.row.status < 0'
                              @click='disable(scope.$index, tableData, scope.row, 0, "此操作将启用该账号的登录权限, 是否继续?")'>
                              启用账号
                            </el-button>
                          </div>
                          <el-button type="text" class="operation" slot="reference">更多操作</el-button>
                        </el-popover>
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
          </el-col>
        </el-row>
      </el-col>
      <el-dialog ref='dialog' :title="title" :visible.sync="dialogFormVisible" top="10vh" @close="dialogClose">
        <el-row v-if='isAddUser'>
          <el-col :span='24'>
            <el-form :model="userForm" :rules='userFormRule' ref="userRuleForm">
              <el-row>
                <el-col :span='22'>
                  <el-form-item label="角色类型：" :label-width="formLabelWidth" prop='type' v-if="userForm.type">
                    <el-select v-model="userForm.type" placeholder="角色类型" @change='typeChange'>
                      <el-option
                        v-for="item in roleList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='24'>
                  <el-col :span="11">
                    <el-form-item label="用户名：" :label-width="formLabelWidth" prop='name'>
                      <el-input v-model="userForm.name" auto-complete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="登录名：" :label-width="formLabelWidth" prop='account'>
                      <el-input v-model="userForm.account" auto-complete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span='24'>
                  <el-col :span="11">
                    <el-form-item label="密码：" :label-width="formLabelWidth" prop='password'>
                      <el-input type='password' v-model="userForm.password" auto-complete="off" clearable :disabled='isEditUser'></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="手机号：" :label-width="formLabelWidth" prop='mobile'>
                      <el-input v-model="userForm.mobile" auto-complete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span='24'>
                  <el-col :span='11'>
                    <el-form-item label="所属公司：" :label-width="formLabelWidth" prop='companyId'>
                      <el-select v-model="userForm.companyId" disabled placeholder="所属公司" @change='companyChange'>
                        <el-option
                          v-for="item in companydata"
                          :key="item.companyId"
                          :label="item.referred"
                          :value="item.companyId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span='11' v-if="userForm.type!==2">
                    <el-form-item label="所属项目：" :label-width="formLabelWidth" prop='projectIdList'>
                      <el-select v-model="userForm.projectIdList" multiple placeholder="请选择所属项目">
                        <el-option
                          v-for="item in projectData"
                          :key="item.projectId"
                          :label="item.referred"
                          :value="item.projectId">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span='22' v-else>
                    <el-form-item label="所属项目和团队：" :label-width="formLabelWidth" prop='projects'>
                      <el-col :span='24' v-for="index of teamRows" :key="index" style="margin-bottom:8px">
                        <el-col :span='10'>
                          <el-select v-model="teamProjectSelected[index-1]" placeholder="请选择所属项目" @change="selectTeamProject">
                            <el-option
                              v-for="item in teamProjectListCopy"
                              :key="item.projectId"
                              :label="item.referred"
                              :disabled="item.disabled"
                              :value="item.projectId">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span='1' style="text-align: center;">
                          -
                        </el-col>
                        <el-col :span='10'>
                          <el-select v-model="teamIdsSelected[index-1]" multiple placeholder="默认全部，可选择所属团队">
                            <el-option
                              v-for="item in teamIdsList[index-1]"
                              :key="item.teamId"
                              :label="item.name"
                              :value="item.teamId">
                            </el-option>
                          </el-select>
                        </el-col>
                        <el-col :span='3' style="text-align: left;cursor: pointer;text-indent: 8px;">
                          <i class="el-icon-remove-outline" @click="delTeam(index-1,teamProjectSelected[index-1],teamIdsList[index-1])"></i>
                          <i v-if="teamRows == index" class="el-icon-circle-plus-outline" @click="addTeam(index-1)"></i>
                        </el-col>
                      </el-col>
                    </el-form-item>
                  </el-col>
                  <el-col :span='22'>
                    <el-form-item label="是否允许查看客户电话："
                                label-width="200px"
                                prop='canViewCustomerMobile'>
                      <el-radio-group v-model="userForm.canViewCustomerMobile">
                        <el-radio :label="0">否</el-radio>
                        <el-radio :label="1">是</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  </el-col>
                  <el-col :span='22'>
                    <el-form-item label="备注：" :label-width="formLabelWidth">
                      <el-input
                        type="textarea"
                        :rows="4"
                        placeholder="请输入备注"
                        v-model="userForm.mark"
                        clearable>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row v-if='isAuthorizedApp'>
          <el-col :span='24'>
            <el-form :model="authorizedAppForm" :rules='authorizedAppFormRule' ref="authorizedAppRuleForm">
              <el-row>
                <el-col :span='20'>
                  <el-form-item label="授权应用：" :label-width="formLabelWidth" prop='appIdList'>
                    <el-select v-model="authorizedAppForm.appIdList" multiple placeholder="请选择授权应用">
                      <el-option
                        v-for="item in appData"
                        :key="item.applianceId"
                        :label="item.name"
                        :value="item.applianceId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row v-if='isResetPassword'>
          <el-col :span='24'>
            <el-form :model="resetPasswordForm" status-icon :rules="resetPasswordRules" ref="resetPasswordRuleForm">
              <el-row>
                <el-col :span='24'>
                  <el-col :span="14" class='resetPasswordCol'>
                    <el-form-item label="新密码：" :label-width="formLabelWidth" prop='password'>
                      <el-input v-model="resetPasswordForm.password" :maxlength='16' type='password' auto-complete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="14" class='resetPasswordCol'>
                    <el-form-item label="确认新密码：" :label-width="formLabelWidth" prop='confirmPassword'>
                      <el-input v-model="resetPasswordForm.confirmPassword" :maxlength='16' type='password' auto-complete="off" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span='24'>
                  <p style='text-indent: 22%;'>密码由8-16位字符，包括至少一位数字和一位字母</p>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button class="dialog_foot_button" type="primary" @click="determine">确 定</el-button>
          <el-button class="dialog_foot_button" @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import LabelTitle from '../../components/LabelTitle'
  import { requestTenantManager, requestTenantManagerPost, requestOrganizationList, requestProjectList, requestTeams, requestTenantManagerStatus, requestTenantManagerPut, requestTenantResetPassword, requestAuthAppsGet, requestAuthorizedApplicationPost, requestAuthorizedApplicationGet } from '../../store/fetch/api'
  import { toTreeData } from '../../common/js/toTreeData'
  import { validateMobile } from '../../common/js/formValidation'
  import {mapGetters} from 'vuex'

  export default {
    name: 'BackstageUser',
    data () {
      let validatePass = (rule, value, callback) => {
        const passLength = new RegExp(/^[0-9A-Za-z]+$/)
        const passReg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (value.length < 8) {
          callback(new Error('密码长度小于8位'))
        } else if (!passLength.test(value)) {
          callback(new Error('密码不能包含特殊字符'))
        } else if (!passReg.test(value)) {
          callback(new Error('密码格式必须包含数字和字母'))
        } else {
          if (this.isResetPassword) {
            if (this.resetPasswordForm.confirmPassword !== '') {
              this.$refs.resetPasswordRuleForm.validateField('confirmPassword')
            }
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.resetPasswordForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      let validateProjects = (rule, value, callback) => {
        if ( !value.length ) {
          callback(new Error('请选择所属项目'))
        } else {
          callback()
        }
      }
      return {
        title: '新增用户',
        dialogFormVisible: false,
        isAddUser: false,
        isResetPassword: false,
        isAuthorizedApp: false,
        labelPosition: 'right',
        totalRecord: 0,
        currentPage: 1,
        pageSize: 10,
        totalPage: 1,
        formLabelWidth: '120px',
        companyId: '',
        managerId: '',
        isEditUser: false,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        userForm: {
          type:1,//0系统管理员、1项目管理员、2团队经理
          tenantId: this.user.tenantId,
          enterprise: this.user.enterprise,
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          name: '',
          account: '',
          password: '',
          mobile: '',
          companyId: '',
          projectIdList: [],
          mark: '',
          canViewCustomerMobile:1,
          projects:[]
        },
        authorizedAppForm: {
          appIdList: []
        },
        userFormRule: {
          name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          account: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
          password: [{ required: true, validator: validatePass, trigger: 'blur' }],
          mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }],
          companyId: [{ required: true, message: '所属公司不能为空', trigger: 'change' }],
          projectIdList: [{ required: true, message: '所属项目不能为空', trigger: 'change' }],
          canViewCustomerMobile: [{ required: true, message: '是否允许查看客户电话不能为空', trigger: 'blur' }],
          projects: [{ required: true, validator: validateProjects, trigger: 'change' }],
        },
        authorizedAppFormRule: {
          appIdList: [{ required: true, message: '授权应用不能为空', trigger: 'change' }]
        },
        organizationParams: {
          tenantId: this.user.tenantId,
          deleteFlag: 0
        },
        userStatus: '',
        searchUser: '',
        userStatusOptions: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '启用',
            value: '0'
          },
          {
            label: '禁用',
            value: '-1'
          }
        ],
        resetPasswordForm: {
          enterprise: '',
          account: '',
          password: '',
          confirmPassword: ''
        },
        resetPasswordRules: {
          password: [{ required: true, validator: validatePass, trigger: 'blur' }],
          confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
        },
        companyList: [],
        tableData: [],
        companydata: [],
        projectData: [],//原始团队项目列表
        appData: [],
        organization: [],
        roleList: [
        // {
        //   id:0,
        //   name:'系统管理员'
        // },
        {
          id:1,
          name:'项目管理员'
        },{
          id:2,
          name:'团队经理'
        }],//角色列表
        teamProjectListCopy:[],//可选列表
        teamProjectSelected:[],//已选择
        teamIdsList:[],//原始团队id列表，二维数组
        teamIdsSelected:[],//已选择，二维数组
        teamRows:1,//团队行数
      }
    },
    props: ['user'],
    components: {
      LabelTitle
    },
    computed: mapGetters({
      theme: 'GET_COLOUR'
    }),
    filters: {
      typeName (value) {
        //角色名称：0系统管理员、1项目管理员、2团队经理
        switch (value) {
          case 0:
            return '系统管理员';
          case 1:
            return '项目管理员';
          case 2:
            return '团队经理';
          default:
            return '--';
        }
      },
    },
    created () {
      if (this.user.type === 0) {
        this.getCompanyFormat()
      } else {
        this.$message.info('此账号无访问权限！')
        this.$router.go(-1)
      }
    },
    methods: {
      renderContent (h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;position:relative;">
            <span style='width:100%;;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;'>
              { data.type ? <i class="iconfont icon-zuzhiliebiao"></i> : '' }
              <span style="padding-left:10px;">
                <span>{node.label}</span>
              </span>
            </span>
          </span>
        )
      },
      async getCompanyFormat () {
        const result = await requestOrganizationList(this.organizationParams)
        sessionStorage.setItem('company', JSON.stringify(result.data.result))
        // 属性配置信息
        const attributes = {id: 'id', companyId: 'companyId', parentId: 'parentId', name: 'referred', type: 0}
        this.organization = toTreeData(result.data.result, attributes)
        this.companydata = JSON.parse(sessionStorage.getItem('company'))
      },
      // 获取用户
      async getTenantManager (status, account) {
        const params = {
          tenantId: this.user.tenantId,
          companyId: this.companyId,
          currentPage: this.currentPage || 1,
          pageSize: this.pageSize || 10
        }
        status ? params.status = status : delete params.status
        account ? params.account = account : delete params.account
        const result = await requestTenantManager(params)
        this.totalRecord = result.data.totalRecord
        this.tableData = result.data.result
      },
      // 获取项目
      async getProject (companyId) {
        const projectParams = {
          tenantId: this.user.tenantId,
          companyId: companyId,
          deleteFlag: 0,
          status: 1
        }
        const result = await requestProjectList(projectParams)
        this.projectData = result.data.result

        //维护可选列表-团队
        if(this.isEditUser){
          this.teamProjectListCopy = this.projectData.map((item,index) => {
            item.disabled = this.teamProjectSelected.indexOf(item.projectId) !== -1
            return item
          });
        }else{
          this.teamProjectListCopy = [...this.projectData]
        }
        
        //团队经理
        if(this.userForm.type ===2 && this.teamProjectSelected.length > 0){
          this.teamProjectSelected.forEach((item,index)=>{
            this.getTeamList(item,index)
          })
        }
      },
      // 获取项目对应的团队列表
      async getTeamList (projectId = '',index=0) {
        const projectParams = {
          projectId: projectId,
          tenantId: this.user.tenantId,
          // currentPage: 1,
          // pageSize: 200
        }
        const result = await requestTeams(projectParams)
        this.$set(this.teamIdsList, index, [...result.data]);
      },
      // 获取租户已授权应用
      async getTenantsApps (type = 0) {
        let res = await requestAuthAppsGet({
          tenantId: this.user.tenantId
        })
        if(type==2){//团队经理，只能授权数字案场
          this.appData = res.data.filter(item => {
            return item.name == '数字案场';
          });
        }else{
          this.appData = res.data
        }
      },
      // 获取项目管理员已授权应用
      async getManagerApps (managerId) {
        this.authorizedAppForm.appIdList = []
        const result = await requestAuthorizedApplicationGet({
          managerId: managerId
        })
        result.data.map(i => {
          this.authorizedAppForm.appIdList.push(i.applianceId)
        })
      },
      // 新增/编辑用户
      async tenantManager (edit = false) {
        let projectArr = []
        if(this.userForm.type == 2){//团队经理
          this.teamProjectSelected.forEach((item,index)=>{
            let teamArr = []
            this.teamIdsSelected[index].forEach(subItem=>{
              teamArr.push({
                teamId:subItem
              })
            })
            projectArr.push({
              projectId:item,
              teams:[...teamArr]
            })
          })
        }else{
          this.userForm.projectIdList.forEach((item,index)=>{
            projectArr.push({
              projectId:item,
              teams:[]
            })
          })
        }
        this.userForm.projects = [...projectArr]
        delete this.userForm.projectIdList
        if(edit){//修改
          await requestTenantManagerPut(this.userForm)
        }else{//新增
          await requestTenantManagerPost(this.userForm)
        }
        this.getTenantManager()
        this.$message.success(edit?'修改成功':'新增成功')
        this.dialogFormVisible = false
      },
      //// 新增用户-作废
      // async tenantManagerPost () {
      //   if(this.userForm.type == 2){//团队经理
      //     let projectArr = []
      //     this.teamProjectSelected.forEach((item,index)=>{
      //       let teamArr = []
      //       this.teamIdsSelected[index].forEach(subItem=>{
      //         teamArr.push({
      //           teamId:subItem
      //         })
      //       })
      //       projectArr.push({
      //         projectId:item,
      //         teams:[...teamArr]
      //       })
      //     })
      //     this.userForm.projects = [...projectArr]
      //     // debugger
      //   }else{
      //     let projectArr = []
      //     this.userForm.projectIdList.forEach((item,index)=>{
      //       projectArr.push({
      //         projectId:item,
      //         teams:[]
      //       })
      //     })
      //     this.userForm.projects = [...projectArr]
      //   }
      //   delete this.userForm.projectIdList
      //   await requestTenantManagerPost(this.userForm)
      //   this.getTenantManager()
      //   this.$message.success('新增成功')
      //   this.dialogFormVisible = false
      // },
      ////修改-作废
      // async tenantManagerPut () {
      //   delete this.userForm.projects
      //   delete this.userForm.companyName
      //   if(this.userForm.type == 2){//团队经理
      //     delete this.userForm.projectIdList
      //     let projectArr = []
      //     this.teamProjectSelected.forEach((item,index)=>{
      //       let teamArr = []
      //       this.teamIdsSelected[index].forEach(subItem=>{
      //         teamArr.push({
      //           teamId:subItem
      //         })
      //       })
      //       projectArr.push({
      //         projectId:item,
      //         teams:[...teamArr]
      //       })
      //     })
      //     this.userForm.projects = [...projectArr]
      //   }else{
      //     delete this.userForm.projects
      //   }
      //   await requestTenantManagerPut(this.userForm)
      //   this.getTenantManager()
      //   this.$message.success('修改成功')
      //   this.dialogFormVisible = false
      // },
      async tenantResetPassword () {
        await requestTenantResetPassword(this.resetPasswordForm)
        this.$message.success('密码重置成功')
        this.dialogFormVisible = false
      },
      async authorizedApplication () {
        const params = []
        this.authorizedAppForm.appIdList.map(i => {
          params.push({
            managerId: this.managerId,
            applianceId: i
          })
        })
        await requestAuthorizedApplicationPost(params)
        this.$message.success('授权成功')
        this.dialogFormVisible = false
      },
      resetPassword (rows) {
        this.title = '密码重置'
        this.resetPasswordForm.enterprise = rows.enterprise
        this.resetPasswordForm.account = rows.account
        this.isResetPassword = true
        this.dialogFormVisible = true
      },
      searchBackUser () {
        this.getTenantManager(this.userStatus, this.searchUser)
      },
      selectUserStatus () {
        this.getTenantManager(this.userStatus)
      },
      companyChange (companyId) {
        this.userForm.projectIdList = []
        this.getProject(companyId)
      },
      organizationClick (data) {
        this.companyId = data.companyId
        this.userForm.companyId = data.companyId
        this.getTenantManager()
      },
      addUser () {
        this.dialogFormVisible = true
        this.isAddUser = true
        this.title = '新增用户'
        if (this.userForm.companyId) {
          this.getProject(this.userForm.companyId)
        }
      },
      editUser (rows) {
        this.dialogFormVisible = true
        this.isEditUser = true
        this.isAddUser = true
        this.title = '编辑用户'
        this.userForm.type = rows.type
        this.userForm.name = rows.name
        this.userForm.account = rows.account
        this.userForm.enterprise = rows.enterprise
        this.userForm.managerId = rows.managerId
        this.userForm.password = rows.password
        this.userForm.mobile = rows.mobile
        this.userForm.companyId = rows.companyId
        this.userForm.mark = rows.mark
        this.userForm.status = rows.status
        this.userForm.projectIdList = []
        this.userForm.canViewCustomerMobile = rows.canViewCustomerMobile

        let arrTemp = [...this.teamProjectSelected]
        rows.projects.map((project,index) => {
          this.userForm.projectIdList.push(project.projectId)
          //团队经理的逻辑处理
          // if(rows.type === 2){
            arrTemp.push(project.projectId)
            this.teamIdsSelected[index] = []
            project.teams && project.teams.forEach(item=>{
              this.teamIdsSelected[index].push(item.teamId)
            })
          // }
        })
        // debugger
        this.teamProjectSelected = [...arrTemp]
        this.teamRows = this.teamProjectSelected.length
        
        this.getProject(this.userForm.companyId)
      },
      authorizedApp (rows) {
        this.dialogFormVisible = true
        this.isAuthorizedApp = true
        this.title = '授权应用'
        this.managerId = rows.managerId
        this.getTenantsApps(rows.type)
        this.getManagerApps(rows.managerId)
      },
      // dialog关闭
      dialogClose () {
        this.userForm = {
          type:1,
          tenantId: this.user.tenantId,
          enterprise: this.user.enterprise,
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          name: '',
          account: '',
          password: '',
          mobile: '',
          companyId: this.companyId,
          projectIdList: [],
          mark: '',
          canViewCustomerMobile:1
        }
        this.resetPasswordForm = {
          enterprise: '',
          account: '',
          password: '',
          confirmPassword: ''
        }
        this.isEditUser = false
        this.isAddUser = false
        this.isResetPassword = false
        this.isAuthorizedApp = false
        this.projectData = []
        this.teamIdsList = []//原始团队id列表
        this.teamProjectSelected = []//已选择
        this.teamIdsSelected = []//已选择
        this.teamProjectListCopy = []//可选列表
        this.teamRows = 1
      },
      disable (index, data, rows, status, messageTitle) {
        this.$confirm(messageTitle, '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(async () => {
          const params = {
            managerId: rows.managerId,
            lastModifyUserId: this.user.lastModifyUserId,
            status: status
          }
          await requestTenantManagerStatus(params)
          data[index].status = status
          this.$message({
            type: 'success',
            message: status > -1 ? '启用成功!' : '禁用成功!'
          })
        }).catch(() => {})
      },
      determine () {
        // console.info(this.userForm)
        // console.info(this.teamProjectSelected)
        // console.info(this.teamIdsSelected)
        // debugger
        if (this.isAddUser) {
          this.$refs.userRuleForm.validate((valid) => {
            if (valid) {
              this.tenantManager(this.isEditUser)
            } else {
              return false
            }
          })
        } else if (this.isAuthorizedApp) {
          this.$refs.authorizedAppRuleForm.validate((valid) => {
            if (valid) {
              this.authorizedApplication()
            } else {
              return false
            }
          })
        } else {
          this.$refs.resetPasswordRuleForm.validate((valid) => {
            if (valid) {
              this.tenantResetPassword()
            } else {
              return false
            }
          })
        }
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getTenantManager(this.userStatus, this.searchUser)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getTenantManager(this.userStatus, this.searchUser)
      },
      //角色改变
      typeChange(){
        this.getProject(this.userForm.companyId)
      },
      //团队-新增项目和团队
      addTeam(index = 0){
        // console.info(index)
        // console.info(this.teamProjectListCopy)
        if(this.teamProjectListCopy.length - 1 > index){
          this.teamRows ++ 
        }else{
          this.$message({
            type: 'warning',
            message: '已达可选项目的最大值!'
          })
        }
        
      },
      //团队-删除项目和团队
      delTeam(index=0,teamProject='',teamIds=[]){
        console.info(index)
        console.info(this.teamProjectListCopy)
        if(this.teamRows < 2){
          this.$message({
            type: 'warning',
            message: '至少选择一个项目!'
          })
        }else{
          this.teamRows --
          if(teamProject){
            let projectIndex = this.teamProjectSelected.indexOf(teamProject)

            this.teamProjectSelected.splice(projectIndex,1)
            this.teamProjectListCopy = this.projectData.map((item,index) => {
              item.disabled = this.teamProjectSelected.indexOf(item.projectId) !== -1
              return item
            });
            // console.info(teamIds)
            // debugger
            this.teamIdsList.splice(projectIndex,1)
            this.teamIdsSelected.splice(projectIndex,1)
          }
        }
      },
      //团队-项目选择事件
      selectTeamProject(id = ''){
        let position = 0
        this.teamProjectListCopy = this.projectData.map((item,index) => {
          if(item.projectId===id){
            position = this.teamProjectSelected.indexOf(item.projectId)
          }
          item.disabled = this.teamProjectSelected.indexOf(item.projectId) !== -1
          return item
        });
        // console.info(this.teamProjectSelected )
        // debugger
        this.$set(this.teamIdsSelected, position, []);
        this.getTeamList(id,position)
      },
    },
    mounted(){
      //获取项目
    },
    watch: {
      'teamProjectSelected': {
        handler: function (newVal, oldVal) {
          // console.info(newVal)
          // console.info(oldVal)
          this.userForm.projects = [...newVal]
        },
        deep: true
      },
    }
  }
</script>

<style scoped lang="scss">
  .backstageUser{
    .easy-scrollbar{
      height: 260px;
    }
    .resetPasswordCol{
      margin-left: 22%;
    }
    .title{
      line-height: 30px;
    }
    .addBan{
      line-height: 52px;
      text-align: right;
    }
    .ban{
      border: 1px solid #eee;
      li{
        line-height: 40px;
        border-bottom: 1px solid #eee;
        padding: 0 24px;
        display: flex;
        &:first-child{
          padding-left: 16px;
        }
        &:last-child{
          border: none;
        }
        &:not(:first-child) {
          cursor:pointer;
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
      .active{
        background: #EAF7FF;
      }
    }
    .housingListCol{
      margin-top: 10px;
      .housingListTopBut{
        position: absolute;
        right: 0;
        top: 0;
        text-align: right;
        z-index: 99;
      }
      .colTop{
        margin-top: 20px;
      }
    }
    .notImg{
      width: 100%;
      box-sizing: border-box;
      padding: 0 0 20px 20px;
      img{
        width: 100%;
        display: block;
      }
    }
    .patternImages{
      padding: 0 0 20px 20px;
    }
    .introduceHousing{
      text-align: right;
      .introduceLabel{
        line-height: 30px;
      }
      .checkAll{
        line-height: 30px;
        text-align: center;
      }
      .building{
        padding-left: 20px;
        .buildingBox{
          border: 1px solid #EEEEEE;
        }
        .buildingName{
          height: 30px;
          background: #F7F7F7;
          text-align: left;
          line-height: 30px;
          text-indent: 20px;
        }
        .unitBox{
          padding: 10px 18px;
        }
        .unit{
          text-align: center;
          position: relative;
          height: 30px;
          margin: 6px 0;
          input{
            width: 100%;
            height: 100%;
            top:0;
            left: 0;
            position: absolute;
            visibility: hidden;
            &:checked{
              &+label{
                background: #0F8BE6;
                color: #fff;
              }
            }
            &:disabled{
              &+label{
                background: #60B974;
                color: #fff;
              }
            }
          }
          label{
            width: 100%;
            height: 100%;
            line-height: 30px;
            display: block;
            background: #EEEEEE;
            &:hover{
              cursor:pointer;
            }
          }
        }
      }
    }
    .lookInfo{
      height: auto;
      padding-left: 20px;
    }
    .blockRow{
      border: 1px solid #F2F2F2;
      padding: 16px 0 16px 44px;
      margin-bottom: 30px;
      .blockCol{
        span{
          width: 40px;
          float: left;
          line-height: 80px;
          margin-right: 10px;
        }
        .blockInfo{
          font-size: 12px;
          width: 120px;
          height: 80px;
          background: #EAF7FF;
          float: left;
          text-align: center;
          margin: 0 2px 2px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          i{
            font-style: normal;
          }
          &:hover{
            >.blockOperation{
              top: 0;
              transition: top .2s;
            }
          }
          .blockOperation{
            width: 100%;
            height: 100%;
            border: 1px solid #4AA7EC;
            background: #F7F7F7;
            box-sizing: border-box;
            position: absolute;
            top:-80px;
            left: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .el-button{
              margin: 0;
            }
          }
        }
      }
    }
    .checkboxGroup{
      margin-left: 70px;
      margin-bottom: 20px;
    }
    .housingList{
      margin-top: 10px;
    }
    .filter{
      position: relative;
      .el-tabs{
        margin-left: 70px;
      }
      span{
        width: 66px;
        text-align: right;
        position: absolute;
        line-height: 32px;
      }
    }
    .operation{
      width: 50px;
      text-align: left;
      text-indent: 1em;
      display: block;
      margin: 0 auto;
    }
    .tableText{
      display: block;
      width: 100%;
      min-height: 22px;
      position: relative;
      i{
        display: inline-block;
        width: 40px;
        text-align: right;
        font-style: normal;
      }
    }
    .leftButton{
      padding-left: 10px;
    }
    .rightButton{
      text-align: right;
      margin-top: 20px;
    }
    .showInfo{
      i{
        font-style: normal;
        font-size: 12px;
        color: #0F8BE6;
        position: absolute;
        left: 0;
        top: 20px;
      }
    }
    .block{
      text-align: right;
      margin: 20px 0;
    }
  }
</style>

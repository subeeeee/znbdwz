<template>
  <div id="ProjectManage" class="projectManage">
    <el-row type="flex" justify="space-between">
      <el-col :span="10">
        <LabelTitle :title="'组织列表'"></LabelTitle>
        <el-popover
          ref="popover5"
          placement="bottom"
          width="82"
          trigger="hover"
          v-model="visible">
          <div style="text-align: right; margin: 0">
            <el-button class="popoverButton" size="mini" type="primary" @click="addOrganization">区域公司</el-button>
            <el-button class="popoverButton" size="mini" type="primary" @click="addProjectManage">项目公司</el-button>
          </div>
        </el-popover>
        <el-button type="primary" class="addButton" v-popover:popover5 v-if='!user.type'>新 增</el-button>
        <el-tree
          ref="company"
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
      <el-col :span="10">
        <LabelTitle :title="'项目管理'"></LabelTitle>
        <el-button type="primary" class="addButton" @click="addProject" v-if='!user.type && companyDetails.type !== 0 && companyDetails.type !== 1'>新 增</el-button>
        <el-tree
          ref='project'
          :data="project"
          :props="projectProps"
          node-key="id"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :render-content="renderProjectContent">
        </el-tree>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" top="20vh" @close="dialogClose('projectRuleForm')">
      <el-form :model="projectForm" :rules="organizationFormRules" ref="projectRuleForm" >
        <el-row>
          <el-col :span="11">
            <el-form-item :label="dialogType ? '区域简称' : '公司简称'" :label-width="formLabelWidth" prop="referred">
              <el-input v-model="projectForm.referred" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item :label="dialogType ? '区域全称' : '公司全称'" :label-width="formLabelWidth" prop='fullName'>
              <el-input v-model="projectForm.fullName" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="公司编码" :label-width="formLabelWidth" prop="number">
              <el-input v-model="projectForm.number" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="父级公司" :label-width="formLabelWidth" prop="region">
              <el-select v-model="projectForm.region" @change="selectChange" :disabled="selectDisabled" placeholder="">
                <el-option
                  v-for="item in organizationList"
                  :key="item.companyId"
                  :label="item.referred"
                  :value="item.companyId"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="22" v-if="!dialogType">
            <el-form-item label="详细地址" :label-width="formLabelWidth">
              <el-input v-model="projectForm.address" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="22" v-if="dialogType">
            <el-form-item label="说明" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="projectForm.describe" auto-complete="off" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog_foot_button" type="primary" @click="addCompany('projectRuleForm')">确 定</el-button>
        <el-button class="dialog_foot_button" @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title2" :visible.sync="dialogFormVisible2" top="20vh" @close="handleClose">
      <el-form :model="erpForm" :rules="erpProjectFormRules" ref="erpRuleForm" >
        <el-row>
          <el-col :span="20">
            <el-form-item :label="'ERP 项目'" :label-width="formLabelWidth" prop="outerProjectId">
              <el-select v-model="erpFormOuterProjectIdList" multiple filterable clearable placeholder="请选择 ERP 项目" @change="handleSelect" @remove-tag="removeTag" @clear="clearTag">
                <el-option
                  v-for="item in erpList"
                  :key="item.ProjectID"
                  :label="item.ProjectName"
                  :value="item.ProjectID">
                </el-option>
              </el-select>
              <!-- <el-autocomplete
                class="inline-input"
                v-model="erpForm.name"
                :fetch-suggestions="querySearch"
                placeholder="请选择 ERP 项目"
                @clear="clearERPProject"
                :clearable="true"
                @select="handleSelect"
                >
                <template slot-scope="props">
                  <div>{{ props.item.ProjectName }}</div>
                </template>
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog_foot_button" type="primary" @click="bindErpConfirm('erpRuleForm')">确 定</el-button>
        <el-button class="dialog_foot_button" @click="dialogFormVisible2 = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'绑定ERP'" :visible.sync="dialogFormVisibleCERP" top="20vh">
      <el-form :model="erpCompanyErpForm" :rules="erpCompanyFormRules" ref="erpCompanyErpForm" >
        <el-row>
          <el-col :span="20">
            <el-form-item :label="'ERP 公司'" :label-width="formLabelWidth" prop="CompanyName">
              <el-select v-model="erpCompanyErpForm.CompanyName" filterable clearable placeholder="请选择 ERP 公司" @change="handleCorBindERPSelect">
                <el-option
                  v-for="item in companyErpList"
                  :key="item.CompanyID"
                  :label="item.CompanyName"
                  :value="item.CompanyID">
                </el-option>
              </el-select>
              <!-- <el-autocomplete
                class="inline-input"
                v-model="erpCompanyErpForm.CompanyName"
                :fetch-suggestions="queryCERPSearch"
                placeholder="请选择 ERP 公司"
                :clearable="true"
                @clear="clearERPCompany"
                @select="handleCorBindERPSelect"
                >
                <template slot-scope="props">
                  <div>{{ props.item.CompanyName }}</div>
                </template>
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="dialog_foot_button" type="primary" @click="bindCompanyErpConfirm('erpCompanyErpForm')">确 定</el-button>
        <el-button class="dialog_foot_button" @click="dialogFormVisibleCERP = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import LabelTitle from '../../components/LabelTitle'
  import { requestOrganizationList,
    requestProjectList,
    requestManagerProjectList,
    requestCompanyMarkDelete,
    requestProjectMarkDelete,
    requestOrganizationPut,
    requestOrganizationPost,
    requestERPProjectsGet,
    requestProjectERPPut,
    requestGetErpCorConfig,
    requestPostErpCorConfig,
    requestAreaManagerProjectList
  } from '../../store/fetch/api'
  import { toTreeData } from '../../common/js/toTreeData'
  import { validateReferred2, lengthControl } from '../../common/js/formValidation'
  export default {
    name: 'ProjectManage',
    data () {
      return {
        organizationList: '',
        erpList: '',
        organization: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        projectProps: {
          children: 'children',
          label: 'referred'
        },
        project: [],
        visible: false,
        /* dialogStart */
        title: '',
        title2: '绑定ERP',
        dialogType: true,
        dialogFormVisible: false,
        dialogFormVisible2: false,
        selectDisabled: false,
        editCompany: false,
        projectForm: {
          referred: '',
          fullName: '',
          number: '',
          region: '',
          address: '',
          describe: ''
        },
        organizationFormRules: {
          referred: [{ required: true, validator: validateReferred2, trigger: 'blur' }],
          fullName: [{ validator: lengthControl, trigger: 'blur' }],
          number: [{ validator: lengthControl, trigger: 'blur' }],
          region: [{required: true, message: '请选择父级组织', trigger: 'change'}]
        },
        erpForm: {
          tenantId: this.user.tenantId,
          name: '',
          outerProjectId: '',
          projectId: '',
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId
        },
        erpFormOuterProjectIdList:[],//绑定多个项目
        erpCompanyFormRules: {
          CompanyName: [{ required: true, message: '请选择 ERP 公司!', trigger: 'change' }]
        },
        erpProjectFormRules: {
          outerProjectId: [{ required: true, message: '请选择 ERP 项目!', trigger: 'change' }]
        },
        formLabelWidth: '120px',
        organizationParams: {
          tenantId: this.user.tenantId,
          deleteFlag: 0
        },
        projectParams: {
          tenantId: this.$route.query.tenantId,
          companyId: this.$route.query.companyId,
          deleteFlag: 0
        },
        /* dialogEnd */
        dialogFormVisibleCERP: false,
        erpCompanyErpForm: {
          outerCompanyGuid: '',
          outerCompanyId: '',
          companyId: '',
          CompanyName: ''
        },
        companyErpList: [],
        selectedName: '',
        companyDetails: ''
      }
    },
    props: ['user'],
    components: {
      LabelTitle
    },
    created () {
      this.getCompanyFormat()
      if (this.$route.query.tenantId && this.$route.query.companyId) {
        this.getProject()
      }
    },
    methods: {
      init () {
        this.editCompany = false
        this.organizationList.forEach((value) => {
          if (value.type === 2) {
            value.disabled = false
          }
        })
      },
      renderContent (h, { node, data, store }) {
        if (this.user.type) {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                { data.type ? <i class="iconfont icon-zuzhiliebiao"></i> : '' }
                <span style="padding-left:10px;">
                  <span>{node.label}</span>
                </span>
              </span>
            </span>
          )
        } else {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                { data.type ? <i class="iconfont icon-zuzhiliebiao"></i> : '' }
                <span style="padding-left:10px;">
                  <span>{node.label}</span>
                </span>
              </span>
              <span class='tree_button'>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.organizationERPSynchronize(node, data) }>{ (data.outerCompanyId && data.outerCompanyGuid) ? '修改关联ERP组织' : '关联ERP组织'}</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.organizationEdit(node, data) }>编辑</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.organizationDel(node, data) }>删除</el-button>
              </span>
            </span>
          )
        }
      },
      renderProjectContent (h, { node, data, store }) {
        if (this.user.type) {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;position:relative">
              {node.data.promoteSort!==null?<span style="position:absolute;left:-25px;top:-1px;"><img src="static/images/promoteSort.svg" style="display:block;width:40px;height:40px" /></span>:''}
              <span>
                <i class="iconfont icon-xiangmuguanli1"></i>
                <span style="padding-left:10px;">
                <span>{node.label}</span>
              </span>
              </span>
              <span class='tree_button'>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.projectEdit(node, data) }>编辑</el-button>
              </span>
            </span>
          )
        } else {
          return (
            <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;position:relative">
              {node.data.promoteSort!==null?<span style="position:absolute;left:-25px;top:-1px;"><img src="static/images/promoteSort.svg" style="display:block;width:40px;height:40px" /></span>:''}
              <span>
                <i class="iconfont icon-xiangmuguanli1"></i>
                <span style="padding-left:10px;">
                <span>{node.label}</span>
              </span>
              </span>
              <span class='tree_button'>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.bindErp(node, data) }>{ data.outerProjectId ? '修改管理ERP项目' : '关联ERP项目'}</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.unBingErp(node, data) }>解绑ERP项目</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.projectEdit(node, data) }>编辑</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.projectDel(node, data) }>删除</el-button>
              </span>
            </span>
          )
        }
      },
      async getCompanyFormat () {
        const result = await requestOrganizationList(this.organizationParams)
        // 属性配置信息
        sessionStorage.setItem('company', JSON.stringify(result.data.result))
        const companyData = []
        const attributes = {id: 'id', companyId: 'companyId', parentId: 'parentId', name: 'referred', type: 0}
        if (this.user.type) {
          const getItemCompany = JSON.parse(sessionStorage.getItem('company'))
          getItemCompany.forEach((company) => {
            if (this.user.companyId === company.companyId) {
              attributes.type = company.type
              companyData.push(company)
            } else if (this.user.companyId === company.parentId) {
              companyData.push(company)
            }
          })
          this.organization = toTreeData(companyData, attributes)
        } else {
          this.organization = toTreeData(result.data.result, attributes)
        }
        this.organizationList = JSON.parse(sessionStorage.getItem('company'))
      },
      async getProject () {
        const projectList = await requestProjectList(this.projectParams)
        this.project = projectList.data.result
      },
      async getManagerProjectList () {
        const projectList = await requestManagerProjectList({ managerId: this.user.managerId })
        this.project = projectList.data
      },
      async getAreaManagerProjectList () {
        const projectList = await requestAreaManagerProjectList({ companyId: this.projectParams.companyId, managerId: this.user.managerId })
        this.project = projectList.data
      },
      async companyMarkDelete (data) {
        const params = { lastModifyUserId: data.lastModifyUserId, companyId: data.companyId }
        await requestCompanyMarkDelete(params)
        this.getCompanyFormat()
        this.$emit('getCompanyEmit')
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      },
      async projectMarkDelete (data) {
        const params = { lastModifyUserId: data.lastModifyUserId, projectId: data.projectId }
        await requestProjectMarkDelete(params)
        this.getProject()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      },
      selectChange (value) {
        this.projectForm.parentId = value
      },
      organizationEdit (node, data) {
        this.editCompany = true
        this.organizationList.forEach((value) => {
          if (value.companyId === data.parentId) {
            this.projectForm.region = value.companyId
          }
          if (data.type === 1 && value.type === 2) {
            value.disabled = true
          }
        })
        this.projectForm.tenantId = this.user.tenantId
        this.projectForm.createUserId = this.user.createUserId
        this.projectForm.lastModifyUserId = this.user.lastModifyUserId
        this.projectForm.id = data.id
        this.projectForm.companyId = data.companyId
        this.projectForm.parentId = data.parentId
        this.projectForm.referred = data.referred
        this.projectForm.fullName = data.fullName
        this.projectForm.number = data.number
        this.projectForm.address = data.address
        this.projectForm.describe = data.describe
        this.projectForm.type = data.type
        this.dialogFormVisible = true
        if (data.type === 0) {
          this.title = '集团公司'
          this.dialogType = false
          this.selectDisabled = true
        } else if (data.type === 1) {
          this.title = '编辑区域'
          this.dialogType = true
          this.selectDisabled = false
        } else if (data.type === 2) {
          this.title = '编辑公司'
          this.dialogType = false
          this.selectDisabled = false
        }
      },
      organizationDel (node, data) {
        if (data.children && data.children.length > 0) {
          this.$notify({
            title: '警告',
            message: '这是一条错误操作，如您想删除该公司，请先删除子公司后在进行操作',
            type: 'warning'
          })
        } else {
          this.$confirm('此操作将永久删除该公司, 是否继续?', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning',
            center: true
          }).then(() => {
            this.companyMarkDelete(data)
          }).catch(() => {})
        }
      },
      organizationClick (data) {
        this.companyDetails = data
        if (this.user.type) {
          if (data.type === 1) {
            this.getManagerProjectList()
          } else {
            this.projectParams.tenantId = data.tenantId
            this.projectParams.companyId = data.companyId
            this.getAreaManagerProjectList()
          }
        } else {
          if (data) {
            this.projectParams.tenantId = data.tenantId
            this.projectParams.companyId = data.companyId
          }
          this.$router.push(
            { path: '/home/projectManage',
              query: {
                tenantId: data.tenantId,
                companyId: data.companyId,
                CompanyGUID: data.outerCompanyGuid
              }
            }
          )
          this.getProject()
        }
      },
      addOrganization () {
        this.selectDisabled = false
        this.title = '新增区域'
        this.dialogType = true
        this.dialogFormVisible = true
        this.projectForm = {
          tenantId: this.user.tenantId,
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          referred: '',
          fullName: '',
          number: '',
          region: this.companyDetails.type !== 2 ? this.companyDetails.companyId : '',
          describe: '',
          type: 1
        }
        this.organizationList.forEach((value) => {
          if (value.type === 2) {
            value.disabled = true
          }
        })
      },
      addCompany (formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            this.projectForm.parentId = this.projectForm.region
            if (this.editCompany) {
              delete this.projectForm.title
              delete this.projectForm.children
              delete this.projectForm.region
              await requestOrganizationPut(this.projectForm)
              this.getCompanyFormat()
              this.$emit('getCompanyEmit')
            } else {
              delete this.projectForm.region
              await requestOrganizationPost(this.projectForm)
              this.getCompanyFormat()
              this.$emit('getCompanyEmit')
            }
            this.dialogFormVisible = false
          } else {
            return false
          }
        })
      },
      async bindErp (node, data) {
        this.selectedName = data.name
        if (!this.$route.query.CompanyGUID) {
          this.$message.warning('请先选择绑定公司 ERP ！')
        } else {
          const params = {
            outerCompanyGUID: this.$route.query.CompanyGUID,
            tenantId: data.tenantId
          }
          const result = await requestERPProjectsGet(params)
          //兼容紫光项目，添加的逻辑
          if(result.data && result.data.length > 0 && result.data[0].hasOwnProperty('isFQ')){
            this.erpList = result.data.filter((item)=> {
              return item.isFQ === 0;
            });
          }else{
            this.erpList = result.data
          }
          if (data.outerProjectId) {
            this.erpForm.name = this.selectedName
            this.erpForm.outerProjectId = data.outerProjectId
            this.erpFormOuterProjectIdList = data.outerProjectId.split(',')

            this.erpForm.outerProjectId = data.outerProjectId

            // const idx = this.erpList.findIndex(item => item.ProjectID === data.outerProjectId)
            // if (idx > -1) {
            //   this.erpForm.name = this.erpList[idx].ProjectName
            //   this.erpForm.outerProjectId = this.erpList[idx].ProjectID
            // }
          } else {
            this.erpForm.name = ''
            this.erpForm.outerProjectId = ''
          }
          this.erpForm.projectId = data.projectId
          this.dialogFormVisible2 = true
        }
      },
      clearTag(){
        this.erpForm.outerProjectId = ''
      },
      handleClose(){
        this.erpForm.name = ''
        this.erpForm.outerProjectId = ''
        this.erpFormOuterProjectIdList = []
      },
      bindErpConfirm (formName) {
        this.$refs[formName].validate(async(valid) => {
          let param = JSON.parse(JSON.stringify(this.erpForm))
          delete param.createUserId
          param.name = this.selectedName
          // debugger
          if (valid) {
            await requestProjectERPPut(param)
            this.dialogFormVisible2 = false
            this.$message.success('绑定ERP成功')
            this.getCompanyFormat()
            this.getProject()
          } else {
            return false
          }
        })
      },
      unBingErp (node, data) {
        if (data.outerProjectId) {
          this.$confirm('确认要解除绑定吗？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning',
            center: true
          }).then(async () => {
            let param = JSON.parse(JSON.stringify(this.erpForm))
            delete param.createUserId
            param.projectId = data.projectId
            param.name = ''
            param.outerProjectId = ''

            this.erpFormOuterProjectIdList = []
            this.erpForm.outerProjectId = ''
            await requestProjectERPPut(param)
            this.$message.success('解绑ERP成功')
            this.getCompanyFormat()
            this.getProject()
          }).catch(e=>e)
        } else {
          this.$message.warning('暂未绑定ERP项目，无法解绑')
        }
      },
      addProjectManage () {
        this.selectDisabled = false
        this.title = '新增公司'
        this.dialogType = false
        this.dialogFormVisible = true
        this.projectForm = {
          tenantId: this.user.tenantId,
          createUserId: this.user.createUserId,
          lastModifyUserId: this.user.lastModifyUserId,
          referred: '',
          fullName: '',
          number: '',
          region: this.companyDetails.companyId,
          type: 2,
          address: ''
        }
      },
      projectEdit (node, data) {
        this.$router.push(
          { path: '/home/addProject',
            query: {
              tenantId: data.tenantId,
              companyId: data.companyId,
              projectId: data.projectId,
              companyGuid:this.$route.query.CompanyGUID
            }
          }
        )
      },
      projectDel (node, data) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning',
          center: true
        }).then(() => {
          this.projectMarkDelete(data)
        }).catch(() => {})
      },
      addProject (data) {
        if (this.projectParams.companyId) {
          this.$router.push(
            { path: '/home/addProject',
              query: {
                tenantId: this.projectParams.tenantId,
                companyId: this.projectParams.companyId
              }
            }
          )
        } else {
          this.$message({
            type: 'info',
            message: '请先选择一个项目公司或者区域公司!'
          })
        }
      },
      querySearch (queryString, cb) {
        let restaurants = this.erpList
        let results = queryString ? restaurants.filter(this.createFilter(this.erpForm.name)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.ProjectName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      removeTag(item){
        console.info(this.erpFormOuterProjectIdList)
        this.erpFormOuterProjectIdList = this.erpFormOuterProjectIdList.filter((data) => {
          return item !== data;
        });
        this.erpForm.outerProjectId = this.erpFormOuterProjectIdList.join(',')
      },
      handleSelect (item) {
        // console.info(this.erpList)
        // console.info(this.erpFormOuterProjectIdList)
        let nameArr = [],
            outerProjectIdArr=[]
        this.erpList.forEach((subItem,index) => {
          if(item.includes(subItem.ProjectID)){
            nameArr.push(subItem.ProjectName) 
            outerProjectIdArr.push(subItem.ProjectID) 
          }
        })
        this.erpForm.name = nameArr.join(',')

        let tempArr2=[]
        if(this.erpForm.outerProjectId){
          let tempArr = this.erpForm.outerProjectId.split(',')
          let tempArr1 = [...tempArr,...outerProjectIdArr]
          tempArr2 = [...new Set(tempArr1)]
        }else{
          tempArr2 = [...outerProjectIdArr]
        }
        this.erpForm.outerProjectId = tempArr2.join(',')

        // this.erpForm.name = item.ProjectName
        // this.erpForm.outerProjectId = item.ProjectID
      },
      dialogClose (formName) {
        this.$refs[formName].clearValidate()
        this.init()
      },
      handleCorBindERPSelect (item) {
        this.companyErpList.some((subItem,index) => {
          if(item === subItem.CompanyID){
            this.erpCompanyErpForm.CompanyName = subItem.CompanyName
            this.erpCompanyErpForm.outerCompanyGuid = subItem.CompanyGUID
            this.erpCompanyErpForm.outerCompanyId = subItem.CompanyID
            this.erpCompanyErpForm.companyId = this.projectParams.companyId
            return true
          }
        })
      },
      createCorFilter (queryString) {
        return (list) => {
          return (list.CompanyName.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      queryCERPSearch (queryString, cb) {
        let list = this.companyErpList
        let results = queryString ? list.filter(this.createCorFilter(this.erpCompanyErpForm.CompanyName)) : list
        // 调用 callback 返回建议列表的数据
        // debugger
        cb(results)
      },
      async organizationERPSynchronize (node, data) {
        // console.log(data)
        if (this.$refs['erpCompanyErpForm']) {
          this.$refs['erpCompanyErpForm'].resetFields()
        }
        let res = await requestGetErpCorConfig(data.tenantId)
        if (res.status === 200) {
          this.companyErpList = res.data
          this.erpCompanyErpForm.CompanyName = ''
          
          if (data.outerCompanyId) {
            res.data.some((item, index) => {
              if(item.CompanyID === data.outerCompanyId){
                this.erpCompanyErpForm.CompanyName = item.CompanyName || item.Code || ''
                this.erpCompanyErpForm.outerCompanyGuid = item.CompanyGUID
                this.erpCompanyErpForm.outerCompanyId = item.CompanyID
                this.erpCompanyErpForm.companyId = data.companyId
                return true;//当内部return true时跳出整个循环
              }
            });
            // const index = this.companyErpList.findIndex(item => item.CompanyID === data.outerCompanyId)
            // if (index >= 0) {
            //   this.erpCompanyErpForm.CompanyName = this.companyErpList[index]['CompanyName'] || this.companyErpList[index]['Code'] || ''
            //   this.erpCompanyErpForm.outerCompanyGuid = this.companyErpList[index]['CompanyGUID']
            //   this.erpCompanyErpForm.outerCompanyId = this.companyErpList[index]['CompanyID']
            //   this.erpCompanyErpForm.companyId = data.companyId
            // } else {
            //   this.erpCompanyErpForm.CompanyName = ''
            // }
          }
          this.dialogFormVisibleCERP = true
          this.getProject()
        }
      },
      async bindCompanyErpConfirm () {
        // debugger
        this.$refs.erpCompanyErpForm.validate(async(valid) => {
          if (valid) {
            let param = JSON.parse(JSON.stringify(this.erpCompanyErpForm))
            delete param['CompanyName']
            let res = await requestPostErpCorConfig(param)
            if (res.status === 200) {
              this.$message.success('绑定成功！')
              this.dialogFormVisibleCERP = false
              this.$router.push(
                { path: '/home/projectManage',
                  query: {
                    tenantId: this.$route.query.tenantId,
                    companyId: this.$route.query.companyId,
                    CompanyGUID: this.erpCompanyErpForm.outerCompanyGuid
                  }
                }
              )
              this.getCompanyFormat()
            } else {
              this.$message.error(`绑定失败！${res.message.describeCn}`)
            }
          }
        })
      },
      clearERPCompany () {
        this.erpCompanyErpForm.CompanyName = ''
        this.$refs.erpCompanyErpForm.resetFields()
      },
      clearERPProject () {
      }
    }
  }
</script>

<style scoped lang="scss">
 .projectManage{
   .el-col{
     position: relative;
   }
   .el-autocomplete{
    width: 100%;
   }
   .addButton{
     position: absolute;
     top:10px;
     right: 0;
   }
   .el-autocomplete{
    width: 100%;
   }
 }
</style>

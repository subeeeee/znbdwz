<template>
  <div class="ChannelUser">
    <div class="search">
      <el-form :inline="true" :model="search" class="demo-form-inline-on">
        <el-form-item label="项目名称：">
          <entryName @entryName="entryNameFun"></entryName>
        </el-form-item>
        <el-form-item label="渠道类型：">
          <el-select v-model="search.channelType" placeholder="渠道类型">
            <el-option v-for="item in channelTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-submit" @click="managerAgencyTeamChannelList" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-block">
      <div class="tab-bar">
        <div class="main-title">
          <span>渠道列表</span>
          <span class="main-title-form">
            <el-button type="primary" icon="el-icon-plus" @click="addChannelManagement">添加</el-button>
          </span>
        </div>
        <div class="tab-bar-cont">
          <channel-tree
	          :treeData="teamChannelList"
	          :open-item-list="[ treeOpenId ]"
	          :active-item="[ treeActiveId ]"
	          :expand-on-click-node="false"
	          @nodeClick="handleNodeClick"
	          @editChannel="editChannel"
	          @stopChannel="stopChannel"
	          @delChannel="delChannel"
	          @addStore="addStore"
	          @editStore="editStore"
	          @stopStore="stopStore"
	          @delStore="delStore"
          ></channel-tree>
        </div>
      </div>


			    <!--<div class="tab-cont" v-show="isStoreList">
				    <div class="main-title">
          <span class="main-title-form">
            <el-button type="primary" @click="addStoreManagement" v-if="channelStatus === 0" icon="el-icon-plus">添加门店</el-button>
          </span>
				    </div>
				    <el-table :data="agencyTeamData" class="tab-cont-table" style="width: calc(100% - 30px);" :style="'border-top:2px solid' + themeColor">
					    <el-table-column prop="storeName" label="门店" width="200"></el-table-column>
					    <el-table-column prop="storePrincipalName" label="门店店长" width="140"></el-table-column>
					    <el-table-column prop="storePrincipalMobile" label="电话号码" width="120"></el-table-column>
					    <el-table-column label="门店成员" width="100">
						    <template slot-scope="scope">
							    <el-button type="text" size="small" @click="managerAgencyTeamStoresAssistantsclick(scope.row)">{{scope.row.storeAssistantNum}}个</el-button>
						    </template>
					    </el-table-column>
					    <el-table-column prop="storePrincipalMobile" label="报备客户" width="120"></el-table-column>
					    <el-table-column label="门店状态" width="100">
						    <template slot-scope="scope">
							    {{scope.row.storeStatus === 0 ? '启用' : '停用'}}
						    </template>
					    </el-table-column>
					    <el-table-column prop="name" label="管理">
						    <template slot-scope="scope" v-if="channelStatus === 0">
							    <el-dropdown trigger="click" size="small">
								    <el-button type="text" size="small">操作</el-button>
								    <el-dropdown-menu slot="dropdown">
									    <el-dropdown-item @click.native="changeAgencyTeamStoresConfirm(scope.row)" v-if="scope.row.storeStatus === 0">停用</el-dropdown-item>
									    <el-dropdown-item @click.native="changeAgencyTeamStoresConfirm(scope.row)" v-if="scope.row.storeStatus === -1">启用</el-dropdown-item>
									    <el-dropdown-item @click.native="editStoreManagement(scope.row)">编辑</el-dropdown-item>
									    <el-dropdown-item @click.native="deleteStoreInfo(scope.row)">删除</el-dropdown-item>
								    </el-dropdown-menu>
							    </el-dropdown>
						    </template>
					    </el-table-column>
				    </el-table>
				    <el-pagination
					    @current-change="agencyTeamPageJump"
					    :current-page.sync="agencyTeamPage.currentPage"
					    :page-size="agencyTeamPage.pageSize"
					    layout="prev, pager, next, jumper"
					    :total="agencyTeamPage.total">
				    </el-pagination>
			    </div>-->
	    <div class="tab-bar-right">

		    <div class="tab-cont" v-show="showType === 'store'">
			    <div class="main-title">
				    <span>{{storeInfo.name}}</span>
				    <span class="main-title-form">
			        <ul class="search-user">
			          <li><el-input v-model.trim="searchStoreClerkData.name" placeholder="用户姓名" maxlength="50"></el-input></li>
			          <li><el-input v-model.trim="searchStoreClerkData.mobile" placeholder="手机号码" maxlength="11"></el-input></li>
			          <li><el-button type="primary" class="search-submit" @click="managerAgencyTeamStoresAssistants" icon="el-icon-search">搜索</el-button></li>
			        </ul>
			      </span>
			    </div>
			    <el-table :data="storeClerkData" class="tab-cont-table" style="width: calc(100% - 30px);" :style="'border-top:2px solid' + themeColor">
				    <el-table-column prop="name" label="姓名" min-width="120"></el-table-column>
				    <el-table-column label="性别" min-width="80">
					    <template slot-scope="scope">
						    {{scope.row.sex === 0 ? '男' : '女'}}
					    </template>
				    </el-table-column>
				    <el-table-column prop="mobile" label="手机号码" min-width="120"></el-table-column>
				    <el-table-column prop="roleTypeName" label="用户角色" min-width="90"></el-table-column>
				    <el-table-column prop="createTime" label="注册时间"min- width="160"></el-table-column>
				    <el-table-column prop="agencyStatusName" label="用户状态" min-width="90"></el-table-column>
				    <el-table-column prop="reportedNum" label="报备客户(个)" min-width="90"></el-table-column>
				    <el-table-column prop="effectiveNum" label="有效客户(个)" min-width="90"></el-table-column>
				    <el-table-column label="管理" fixed="right" width="90">
					    <template slot-scope="scope" v-if="channelStatus === 0">
						    <el-dropdown trigger="click" size="small">
							    <el-button type="text" size="small">操作</el-button>
							    <el-dropdown-menu slot="dropdown">
								    <el-dropdown-item @click.native="switchAccountsChannel(scope.row, 1, '停用')" v-if="scope.row.agencyStatus === 1">停用</el-dropdown-item>
								    <el-dropdown-item @click.native="switchAccountsChannel(scope.row, 0, '启用')" v-if="scope.row.agencyStatus === 2 || scope.row.agencyStatus === 0">启用</el-dropdown-item>
								    <el-dropdown-item @click.native="handleTransferCuster(scope.row)" v-if="scope.row.reportedNum > 0">客户转移</el-dropdown-item>
								    <el-dropdown-item @click.native="deleteAccountsChannel(scope.row, 2)">删除</el-dropdown-item>
								    <el-dropdown-item @click.native="userInformationPopFun(scope.row)">身份变更</el-dropdown-item>
							    </el-dropdown-menu>
						    </el-dropdown>
					    </template>
				    </el-table-column>
			    </el-table>
			    <el-pagination
				    @current-change="storeClerkPageJump"
				    :current-page.sync="storeClerkPage.currentPage"
				    :page-size="storeClerkPage.pageSize"
				    layout="prev, pager, next, jumper"
				    :total="storeClerkPage.total">
			    </el-pagination>
		    </div>
	      <principal-table
		      ref="principalTableRef"
		      v-show="showType === 'principal'"
		      :themeColor="themeColor"
		      :channel-id="currentChannelId"
		      @transferCuster="handleTransferCuster"
		      @switch="switchAccountsChannel"
		      @delete="deleteAccountsChannel"
	      ></principal-table>
	    </div>
<!--	    <el-tabs  class="tab-cont-warp" v-model="tabsActiveName" type="card">-->
<!--		    <el-tab-pane label="渠道门店" name="channel">-->
<!--		    </el-tab-pane>-->
<!--		    <el-tab-pane label="负责人" name="principal">-->
<!--					<principal-table ref="principalTableRef" ></principal-table>-->
<!--		    </el-tab-pane>-->
<!--	    </el-tabs>-->
    </div>
    <!-- dialog -->
    <el-dialog :title="channelDialogType === '01' ? '添加渠道' : '编辑渠道'" :visible.sync="channelPop" width="1100px" @close="resetForm('channelForm')">
      <el-form>
        <el-form-item style="padding-left:10px;">
          <el-checkbox v-model="channelForm.multiLogin">是否允许多设备登录</el-checkbox>
          <el-checkbox v-model="channelForm.globleJudge">全局判客</el-checkbox>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="channelForm" class="demo-form-inline" label-position="right" label-width="106px" ref="channelForm" :rules="channelFormVerification">
        <el-form-item label="渠道类型：" class="store-item" prop="channelType">
          <el-select v-model="channelForm.channelType" placeholder="渠道类型">
            <el-option v-for="item in addChannelTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称：" class="store-item" prop="channelName">
          <el-input v-model="channelForm.channelName" placeholder="渠道名称" maxlength="20"></el-input>
        </el-form-item>
        <!-- 不可编辑负责人 -->
        <div v-if="channelDialogType === '01'">
          <div v-for="(item, index) in channelForm.channelPrincipals" :key="index">
            <el-form-item label="负责人：" class="store-item" :prop="'channelPrincipals.' + index + '.principalName'" :rules="{required: true, message: '必填项不能为空', trigger: 'blur'}">
              <el-input v-model="item.principalName" placeholder="负责人" maxlength="6"></el-input>
            </el-form-item>
            <el-form-item label="电话号码：" class="store-item" :prop="'channelPrincipals.' + index + '.principalMobile'" :rules="[{required: true, message: '必填项不能为空'}, {type: 'number', min: 10000000000, max: 19999999999, message: '请输入正确的电话号码', trigger: ['blur', 'change']}]">
              <el-input v-model.number="item.principalMobile" placeholder="电话号码" maxlength="11"></el-input>
              <div class="iconfont-block">
                <!--                新增渠道只添加一个负责人-->
                <!--              <span class="icon iconfont icon-shanjian" v-if="index === 0 && channelForm.channelPrincipals.length > 1" :style="{color: themeColor}" @click="delPrincipalMobile(index)"></span>-->
                <!--              <span class="icon iconfont icon-zengjia" v-if="index === 0" :style="{color: themeColor}" @click="addPrincipalMobile"></span>-->
                <!--              <span class="icon iconfont icon-shanjian" v-if="index > 0" :style="{color: themeColor}" @click="delPrincipalMobile(index)"></span>-->
              </div>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="授权项目：" class="authorized-project">
          <el-checkbox-group v-model="channelForm.projectIds">
            <el-checkbox :label="item.value" v-for="(item, index) in projectIdsData" :key="index">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row>
          <el-col :span="12" style="text-align:left">&nbsp;</el-col>
          <el-col :span="12" style="text-align:right">
            <el-button @click="resetForm('channelForm')" icon="el-icon-close">关 闭</el-button>
            <el-button type="primary" @click="postManagerAgencyTeamChannel" v-if="!channelIsDisabled" icon="el-icon-check">确 定</el-button>
            <el-button type="primary" @click="putManagerAgencyTeamChannel" v-if="channelIsDisabled" icon="el-icon-check">确 定</el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <el-dialog title="门店管理" :visible.sync="storePop" width="650px" @close="resetForm('addManagerAgencyTeamStoresData')">
      <el-form :inline="true" :model="addManagerAgencyTeamStoresData" class="demo-form-inline" ref="addManagerAgencyTeamStoresData" :rules="addManagerAgencyTeamStoresDataVerification">
        <el-form-item label="门店名称：" class="store-name must-fill" prop="storeName">
          <el-input v-model="addManagerAgencyTeamStoresData.storeName" placeholder="门店名称" style="width:480px"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店店长：" class="must-fill" prop="storePrincipalName">
              <el-input v-model="addManagerAgencyTeamStoresData.storePrincipalName" placeholder="门店店长"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话号码：" class="must-fill" prop="channelPrincipalMobile">
              <el-input v-model="addManagerAgencyTeamStoresData.channelPrincipalMobile" placeholder="电话号码" :disabled="isChannelPrincipalMobile" maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="店长查看客户：" class="must-fill" prop="canViewCustomerMobile">
              <el-radio-group v-model="addManagerAgencyTeamStoresData.canViewCustomerMobile">
                <el-radio :label="1">全号查看</el-radio>
                <el-radio :label="0">隐号查看</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="授权项目：" class="authorized-project">
          <ul class="authorized-project-ul">
            <li v-for="(item, index) in managerAgencyTeamChannelTextArr" :key="index">{{item}}</li>
          </ul>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addManagerAgencyTeamStoresData')" icon="el-icon-close">关 闭</el-button>
        <el-button type="primary" @click="addManagerAgencyTeamStores" v-if="!isChannelPrincipalMobile" icon="el-icon-check">确 定</el-button>
        <el-button type="primary" @click="editManagerAgencyTeamStores" v-if="isChannelPrincipalMobile" icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
    <!--  -->

    <el-dialog title="用户信息" :visible.sync="userInformationPop" width="700px" class="userInformation-dialog">
      <el-form :inline="true" :model="userInformationForm" class="demo-form-inline identity">
        <el-form-item label="用户身份：" style="width:100%">
          <el-radio-group v-model="userInformationForm.identity" @change="selectIdentity">
            <el-radio-button :label="item.value" v-for="(item, index) in identityData2" :key="index">{{item.label}}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <span v-if="userInformationForm.identity === 2 || userInformationForm.identity === 3 || userInformationForm.identity === 4">
          <el-form-item label="渠道名称：">
            <el-select v-model="userInformationForm.channelId" placeholder="渠道名称" :disabled="channelIdData.length < 1" @change="managerAgencyTeamStoresOptions">
              <el-option v-for="(item, index) in channelIdData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属门店：">
            <el-select v-model="userInformationForm.storeId" placeholder="所属门店" :disabled="storeIdData.length < 1" @change="userInformationForm.roleType = ''">
              <el-option v-for="(item, index) in storeIdData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份角色：">
            <el-select v-model="userInformationForm.roleType" placeholder="身份角色" :disabled="userInformationForm.storeId === ''">
              <el-option v-for="(item, index) in roleTypeData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </span>
        <span v-else>渠道信息：无</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userInformationPop = false" icon="el-icon-close">关 闭</el-button>
        <el-button type="primary" @click="putAccountsIdentity" icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <transfer-custer-dialog
	    ref="transferCusterDialogRef"
	    :channel-id="currentChannelId"
	    :is-show.sync="isShowTransfer"
	    :reported-no="transferReportedNum"
	    :from-user-id="fromUserId"
	    :treeData="resultTreeData"
	    @success="transferSuccess"
    ></transfer-custer-dialog>
  </div>
</template>

<script>
import {
	managerAgencyTeamChannelChannelTypes,
	managerAgencyTeamChannelList,
	postManagerAgencyTeamChannel,
	putManagerAgencyTeamChannel,
	projectsProject,
	projectsManagerProject,
	getManagerAgencyTeamChannel,
	deleteManagerAgencyTeamChannel,
	managerAgencyTeamStores,
	addManagerAgencyTeamStores,
	editManagerAgencyTeamStores,
	managerAgencyTeamChannel,
	getManagerAgencyTeamStores,
	delManagerAgencyTeamStores,
	managerAgencyTeamStoresAssistants,
	accountsChannel,
	accountsIdentity,
	managerAgencyTeamChannelOptions,
	managerAgencyTeamStoresOptions,
	putAccountsIdentity,
	changeManagerAgencyTeamChannel,
	changeAgencyTeamStores } from '../../common/api'
import entryName from '../../components/entryName'
import { validateLength, validateMobile, validateSelect } from '../../common/fromVerification'
import TransferCusterDialog from "./components/TransferCuster";
import PrincipalTable from "./components/PrincipalTable";
import ChannelTree from "./components/ChannelTree";
export default {
  name: 'ChannelUser',
  components: {
    ChannelTree,
    TransferCusterDialog,
	  PrincipalTable,
    entryName
  },
	computed: {
		principalTableRef() {
			return this.$refs.principalTableRef
		},
		resultTreeData() {
			const tree = []
			this.teamChannelList.forEach(item =>{
				if(item.id === this.currentChannelId) {
					tree.push(item)
				}
			})
			return tree
		}
	},
  data() {
    return {
	    treeOpenId: '',
	    treeActiveId: '1',
	    currentChannelId: '',
    	showType: 'store',
      isShowTransfer: false,
	    transferReportedNum: '',
	    fromUserId: '',
      search: {
        projectId: '',
        channelType: ''
      },
      channelTypeData: [], // 渠道名称
      addChannelTypeData: [], // 渠道名称
      teamChannelList: [],
      channelPop: false,
      channelForm: {
        multiLogin: false, // 是否允许多设备登录
        globleJudge: false, // 全局判客
        channelId: '',
        channelType: '',
        channelName: '', // 渠道名称
        channelPrincipals: [
          {
            principalName: '',
            principalMobile: ''
          }
        ],
        projectIds: [] // 授权项目
      },
      channelFormVerification: {
        channelType: { required: true, validator: validateSelect, trigger: 'change' },
        channelName: { required: true, validator: validateLength, trigger: 'blur' }
      },
      projectIdsData: [],
      channelDialogType: '', //  添加:01  编辑:02
      channelIsDisabled: false,
      isStoreList: true,
      isUserList: false,
      userInformationPop: false,
      agencyTeamDataChannelId: '',
      agencyTeamData: [], // 门店列表
      agencyTeamPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 添加列表内 门店
      addManagerAgencyTeamStoresChannelId: '',
      managerAgencyTeamChannelTextArr: '',
      isChannelPrincipalMobile: false,
      addManagerAgencyTeamStoresData: {
        tenantId: '', // 租户号
        channelId: '', // 门店所属渠道
        storeName: '', // 门店名称
        storePrincipalName: '', // 门店负责人名称
        channelPrincipalMobile: '', // 门店负责人手机号
        canViewCustomerMobile: '' // 店长查看客户
      },
      addManagerAgencyTeamStoresDataVerification: {
        storeName: { validator: validateLength, trigger: 'blur' },
        storePrincipalName: { validator: validateLength, trigger: 'blur' },
        channelPrincipalMobile: { validator: validateMobile, trigger: 'blur' },
	      canViewCustomerMobile: {required: true, message:'必填项不能为空'}
      },
      // 门店店员
      storeInfo: {}, // 门店信息
      searchStoreClerkData: {
        name: '',
        mobile: ''
      },
      storeClerkData: [],
      storeClerkPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 变更身份
      identityData2: [],
      channelIdData: [], // 渠道数组
      storeIdData: [], // 店铺数组
      roleTypeData: [ // 角色类型数组
        {
          label: '总代',
          value: 1
        },
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
      // ---
      input: '',
      storePop: false,
      storeForm: {
        user: '',
        region: '',
        checkList: []
      },
      checkList: [],
      channelStatus: 0, // 是否停用渠道
      storeStatusType: 0, // 是否停用门店,
	    reloadInfo:{}
    }

  },
  props: [ 'themeColor' ],
  created () {
    if (sessionStorage.getItem('projectId')) {
      this.search.projectId = sessionStorage.getItem('projectId')
    }
    this.managerAgencyTeamChannelChannelTypes()
    if (sessionStorage.getItem('type') === '0') {
      this.projectsProject()
    } else if (sessionStorage.getItem('type') === '1') {
      this.projectsManagerProject()
    }
  },
  methods: {
	  transferSuccess() {
	  	this.handleNodeClick(this.reloadInfo)
	  },
	  handleNodeClick(data) {
	  	this.reloadInfo = data
		  this.currentChannelId = data.channelId || data.id
		  if(data.type === 'channel') {
			  this.showType = 'principal'
			  this.storeInfo = data
			  this.$nextTick(() => {
				  this.principalTableRef.queryList()
			  })
		  } else if(data.type === 'store') {
		  	this.storeInfo = data
		  	this.showType = 'store'
			  this.managerAgencyTeamStoresAssistantsclick(this.storeInfo)
		  }
	  },
	  editChannel(data) {
		  this.treeOpenId = data.id
	  	this.getManagerAgencyTeamChannel(data.id)

	  },
	  stopChannel(data) {
		  this.treeOpenId = data.id
	  	this.ManagerAgencyTeamChannelConfirm(data)
	  },
	  delChannel(data) {
	  	this.deleteChannelInfo(data)
	  },
	  addStore(data) {
		  this.treeOpenId = data.id
	  	this.addStoreManagement(data)
	  },
	  editStore(data) {
		  this.treeOpenId = data.id
		  console.log(data.id)
	  	this.editStoreManagement(data)
	  },
	  stopStore(data) {
		  this.treeOpenId = data.id
	  	this.changeAgencyTeamStoresConfirm(data)
	  },
	  delStore(data) {
	  	this.deleteStoreInfo(data)
	  },
    addStoreManagement (data) {
	    this.agencyTeamDataChannelId = data.id
	    this.treeOpenId = data.id
      this.isChannelPrincipalMobile = false
      this.addManagerAgencyTeamStoresData.storeName = ''
      this.addManagerAgencyTeamStoresData.storePrincipalName = ''
      this.addManagerAgencyTeamStoresData.channelPrincipalMobile = ''
      this.addManagerAgencyTeamStoresData.canViewCustomerMobile = 0
	    this.addManagerAgencyTeamStoresData.channelId = data.id
      this.managerAgencyTeamChannel()
      this.storePop = true
    },
    async editStoreManagement (data) {
      const result = await getManagerAgencyTeamStores(`${data.id}/${data.tenantId}`)
      if (result.code === 200) {
        this.addManagerAgencyTeamStoresData.storeId = data.id
        this.addManagerAgencyTeamStoresData.storePrincipalUserId = result.data.storePrincipalUserId
        this.addManagerAgencyTeamStoresData.storeName = result.data.storeName
        this.addManagerAgencyTeamStoresData.storePrincipalName = result.data.storePrincipalName
        this.addManagerAgencyTeamStoresData.channelPrincipalMobile = result.data.storePrincipalMobile
        this.addManagerAgencyTeamStoresData.canViewCustomerMobile = result.data.canViewCustomerMobile
        this.isChannelPrincipalMobile = true
        this.managerAgencyTeamChannel(data.channelId)
        this.storePop = true
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    addChannelManagement () {
      this.channelDialogType = '01'
      this.channelIsDisabled = false
      this.channelForm.channelType = '' // 渠道类型
      this.channelForm.channelName = '' // 渠道名称
      this.channelForm.channelPrincipalName = '' // 负责人
      this.channelForm.channelPrincipalMobile = '' // 电话号码
      this.channelForm.multiLogin = false
      this.channelForm.globleJudge = false
      this.channelForm.channelPrincipals = [
        {
          principalName: '',
          principalMobile: ''
        }
      ]
      this.channelForm.projectIds = [] // 授权项目
      this.channelPop = true
    },
    // 新增门店获取渠道名称
    async managerAgencyTeamChannel (id) {
      const result = await managerAgencyTeamChannel(`${id || this.agencyTeamDataChannelId}`)
      let arr = []
      for (let i in result.data) {
        arr.push(result.data[i])
      }
      this.managerAgencyTeamChannelTextArr = arr
    },
    // 渠道来源
    async managerAgencyTeamChannelChannelTypes () {
      const result = await managerAgencyTeamChannelChannelTypes('')
      if (result.code === 200) {
        const data = result.data
        this.channelTypeData = this.formatJsonAll(data)
        this.addChannelTypeData = this.formatJson(data)
        this.managerAgencyTeamChannelList()
      }
    },
    // 渠道名单 新增
    async managerAgencyTeamChannelList () {
      const result = await managerAgencyTeamChannelList(`?tenantId=${sessionStorage.getItem('tenantId')}&channelType=${this.search.channelType}&projectId=${this.search.projectId}`)
      this.teamChannelList = []
      if (result.data.length) {
	      result.data.forEach((item, i) => {
	      	const stores = []
		      item.stores.forEach(store => {
			      stores.push({
				      channelId: item.channelId,
				      id: store.storeId,
				      name: store.storeName,
				      type: 'store',
				      effectivity: store.storeStatus,
				      tenantId: item.tenantId
			      })
		      })
		      const channel = {
			      name: item.channelName,
			      id: item.channelId,
			      type: 'channel',
			      tenantId: item.tenantId,
			      effectivity:item.channelStatus,
			      stores
		      }
		      this.teamChannelList.push(channel)
	      })
	      // 进入页面展示第一个渠道的负责人
	      this.handleNodeClick(this.teamChannelList[0])
	      this.treeActiveId = this.teamChannelList[0].id
        this.agencyTeamDataChannelId = result.data[0].channelId
        this.managerAgencyTeamStores()
        this.addManagerAgencyTeamStoresData.tenantId = sessionStorage.getItem('tenantId') // 添加门店 租户号
        this.addManagerAgencyTeamStoresData.channelId = result.data[0].channelId // 添加门店 门店所属渠道
      } else {
	      this.principalTableRef && this.principalTableRef.resetTable()
        this.agencyTeamData = []
        this.agencyTeamPage.currentPage = 1
        this.agencyTeamPage.total = 1
      }
    },
    // 渠道名单 编辑
    putManagerAgencyTeamChannel () {
      let mobileArr = []
      const channelPrincipals = this.channelForm.channelPrincipals
      for (let i = 0; i < channelPrincipals.length; i++) {
        mobileArr.push(channelPrincipals[i].principalMobile)
      }
      if (this.isRepeat(mobileArr)) {
        this.$message.error('负责人手机号码重复')
        return false
      }
      this.channelForm.multiLogin ? this.channelForm.multiLogin = 1 : this.channelForm.multiLogin = 0
      this.channelForm.globleJudge ? this.channelForm.globleJudge = 1 : this.channelForm.globleJudge = 0
      this.$refs.channelForm.validate(async (valid) => {
        if (valid) {
          const result = await putManagerAgencyTeamChannel(this.channelForm)
          if (result.code === 200) {
            this.channelPop = false
            this.$message.success('修改成功！')
            this.managerAgencyTeamChannelList()
          } else if (result.code !== 200 && result.code !== 401) {
            this.$message.error(result.message)
          }
        }
      })
    },
    isRepeat (arr) {
      var hash = {}
      for (var i in arr) {
        if (hash[arr[i]]) {
          return true
        }
        hash[arr[i]] = true
      }
      return false
    },
    // 获取 渠道信息
    async getManagerAgencyTeamChannel (channelId) {
      this.channelDialogType = '02'
      this.channelIsDisabled = true
      this.channelForm.channelId = channelId
      const result = await getManagerAgencyTeamChannel(`${channelId}/${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        this.channelForm.tenantId = result.data.tenantId
        this.channelForm.channelType = result.data.channelType.toString()
        this.channelForm.projectIds = result.data.authenticationProjectIds
        this.channelForm.channelName = result.data.channelName
        this.channelForm.multiLogin = result.data.multiLogin === 1
        this.channelForm.globleJudge = result.data.globleJudge === 1
        let channelPrincipals = []
	      result.data.channelPrincipals = result.data.channelPrincipals || []
        for (let i = 0; i < result.data.channelPrincipals.length; i++) {
          channelPrincipals.push({
            principalName: result.data.channelPrincipals[i].principalName,
            principalMobile: parseInt(result.data.channelPrincipals[i].principalMobile),
            principalUserId: result.data.channelPrincipals[i].principalUserId
          })
        }
        this.channelForm.channelPrincipals = channelPrincipals
        this.channelPop = true
      } else {
        this.$message.warning(result.message)
      }
    },
    // 获取 渠道名单项目
    async projectsProject () {
      const result = await projectsProject(sessionStorage.getItem('tenantId'))
      const data = result.data.result
      this.projectIdsData = []
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].referred,
          value: data[i].projectId
        }
        this.projectIdsData.push(json)
      }
    },
    async projectsManagerProject () {
      const result = await projectsManagerProject(sessionStorage.getItem('managerId'))
      let data = result.data
      this.projectIdsData = []
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].referred,
          value: data[i].projectId
        }
        this.projectIdsData.push(json)
      }
    },
    // 添加 渠道名单
    postManagerAgencyTeamChannel () {
      this.channelForm.multiLogin ? this.channelForm.multiLogin = 1 : this.channelForm.multiLogin = 0
      this.channelForm.globleJudge ? this.channelForm.globleJudge = 1 : this.channelForm.globleJudge = 0
      this.$refs.channelForm.validate(async (valid) => {
        if (valid) {
          this.channelForm.tenantId = sessionStorage.getItem('tenantId')
          const result = await postManagerAgencyTeamChannel(this.channelForm)
          if (result.code === 200) {
            this.channelPop = false
            this.managerAgencyTeamChannelChannelTypes()
            this.$message.success('添加成功！')
          } else {
            this.$message.warning(result.message)
          }
        }
      })
    },
    // 删除 渠道 提示
    deleteChannelInfo (item) {
      this.$confirm('是否将该渠道删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteManagerAgencyTeamChannel(item)
      }).catch(() => {
      })
    },
    // 删除 渠道
    async deleteManagerAgencyTeamChannel (item) {
      const result = await deleteManagerAgencyTeamChannel(`${item.id}/${sessionStorage.getItem('tenantId')}/1`)
      if (result.code === 200) {
        this.agencyTeamDataChannelId = ''
        this.managerAgencyTeamChannelList()
        this.channelPop = false
      } else {
        this.$message.warning(result.message)
      }
    },
    // 获取渠道下 门店列表
    async managerAgencyTeamStores () {
      const result = await managerAgencyTeamStores(`${this.agencyTeamDataChannelId}?currentPage=${this.agencyTeamPage.currentPage}`)
      if (result.code === 200) {
        this.agencyTeamData = result.data // 做分页
        this.agencyTeamPage.currentPage = result.page.currentPage
        this.agencyTeamPage.total = parseInt(result.page.recordCount)
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 添加 渠道下 门店
    addManagerAgencyTeamStores () {
      this.$refs.addManagerAgencyTeamStoresData.validate(async (valid) => {
        if (valid) {
          delete this.addManagerAgencyTeamStoresData.storeId
          delete this.addManagerAgencyTeamStoresData.storePrincipalUserId
          const result = await addManagerAgencyTeamStores(this.addManagerAgencyTeamStoresData)
          if (result.code === 200) {
            this.storePop = false
            // this.managerAgencyTeamStores()
	          this.$message.success('添加成功')
	          this.managerAgencyTeamChannelList()
          } else {
            this.$message.warning(result.message)
          }
        }
      })
    },
    // 编辑 渠道下 门店
    editManagerAgencyTeamStores () {
      this.$refs.addManagerAgencyTeamStoresData.validate(async (valid) => {
        if (valid) {
          const result = await editManagerAgencyTeamStores(this.addManagerAgencyTeamStoresData)
          if (result.code === 200) {
            this.storePop = false
	          this.$message.success('编辑成功')
	          this.managerAgencyTeamChannelList()
            // this.managerAgencyTeamStores()
          } else {
            this.$message.warning(result.message)
          }
        }
      })
    },
    // 删除 店铺 提示
    deleteStoreInfo (data) {
      this.$confirm('是否将该店铺删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delManagerAgencyTeamStores(data)
      }).catch(() => {
      })
    },
    async delManagerAgencyTeamStores (data) {
      const result = await delManagerAgencyTeamStores(`${data.id}/${data.tenantId}/1`)
      if (result.code === 200) {
      	this.$message.success('操作成功')
	      this.principalTableRef.queryList()
	      this.managerAgencyTeamChannelList()
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 门店店员列表
    managerAgencyTeamStoresAssistantsclick (data) {
      this.storeInfo = data
      this.storeStatusType = data.effectivity
      this.managerAgencyTeamStoresAssistants(data)
    },
    async managerAgencyTeamStoresAssistants () {
	  	if(!this.storeInfo.id) {
	  		this.$message.warning('请选择门店')
				return
		  }
	    const result = await managerAgencyTeamStoresAssistants(`${this.storeInfo.id}`, this.storeClerkPage.currentPage, `&name=${this.searchStoreClerkData.name}&mobile=${this.searchStoreClerkData.mobile}`)
      if (result.code === 200) {
        this.storeClerkData = result.data
        this.storeClerkPage.currentPage = result.page.currentPage
        this.storeClerkPage.total = parseInt(result.page.recordCount)
        this.isStoreList = false
        this.isUserList = true
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    handleTransferCuster(row) {
	    const h = this.$createElement;
      this.$msgbox({
	      title: '提示',
	      message: h('div', null, [
		      h('div', null, '此操作将转移选中用户下所有报备客户，且会更新客户报备人，是否继续？ '),
		      h('div', { style: 'font-weight: 500;padding: 10px; font-size: 20px' }, `报备客户数: ${row.reportedNum}`)
	      ]),
	      showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      	this.fromUserId = row.userId
      	this.transferReportedNum = row.reportedNum
        this.isShowTransfer = true
      })
    },
    // 删除 店员 提示
    deleteAccountsChannel (scope, status) {
      this.$confirm('是否将该店员删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.accountsChannel(scope, status)
      }).catch(() => {
      })
    },
    // 停启用 店员 提示
    switchAccountsChannel (scope, status, text) {
      this.$confirm(`是否${text}该用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.accountsChannel(scope, status)
      }).catch(() => {
      })
    },
    async accountsChannel (scope, status) {
      const result = await accountsChannel(`${scope.userId}/${status}`)
      if (result.code === 200) {
      	this.$message.success('操作成功')
	      if(this.storeInfo.type === 'channel') {
		      this.principalTableRef.queryList()
	      } else if(this.storeInfo.type === 'store'){
		      this.managerAgencyTeamStoresAssistantsclick(this.storeInfo)
	      }
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.storePop = false
      this.channelPop = false
    },
    // 分页
    agencyTeamPageJump (val) {
      this.agencyTeamPage.currentPage = val
      this.managerAgencyTeamStores()
    },
    storeClerkPageJump (val) {
      this.storeClerkPage.currentPage = val
      this.managerAgencyTeamStoresAssistants()
    },
    // 切换项目
    entryNameFun (res) {
      this.search.projectId = res
    },
    formatJsonAll (data) {
      let list = [
        {
          label: '全部',
          value: ''
        }
      ]
      for (let item in data) {
        let json = {
          label: data[item],
          value: item
        }
        list.push(json)
      }
      return list
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
    tabBarFun (item) {
      this.channelStatus = item.channelStatus
      // if (item.channelStatus !== 0) {
      //   this.$message.warning('渠道已停用')
      //   return false
      // }
      for (let i = 0; i < this.teamChannelList.length; i++) {
        this.teamChannelList[i].active = false
      }
      item.active = true
      this.isStoreList = true
      this.isUserList = false
      this.addManagerAgencyTeamStoresData.tenantId = sessionStorage.getItem('tenantId') // 添加门店 租户号
      this.addManagerAgencyTeamStoresData.channelId = item.id // 添加门店 门店所属渠道
      this.agencyTeamDataChannelId = item.id
      this.agencyTeamPage.currentPage = 1
      this.managerAgencyTeamStores()
    },
    // 增加渠道负责人
    addPrincipalMobile () {
      if (this.channelForm.channelPrincipals.length === 4) {
        this.$message.warning('最多添加四位负责人')
        return false
      }
      this.channelForm.channelPrincipals.push({
        principalName: '',
        principalMobile: ''
      })
    },
    // 删除渠道负责人
    delPrincipalMobile (index) {
      this.channelForm.channelPrincipals.splice(index, 1)
    },
    // 变更身份 ==========================
    userInformationPopFun (scope) {
      this.userInformationForm.userId = scope.userId
      this.userInformationPop = true
      this.getAccountsIdentity() // 用户身份
    },
    // 用户身份
    async getAccountsIdentity () {
      const result = await accountsIdentity(`?type=4&tenantId=${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        this.identityData2 = []
        for (let i = 0; i < result.data.length; i++) {
          this.identityData2.push({
            label: result.data[i].identityName,
            value: result.data[i].identity
          })
        }
        this.userInformationForm.identity = this.identityData2[0].value
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
        } else if (this.userInformationForm.storeId === '') { // 店铺Id
          this.$message.error('请选择店铺')
        } else if (this.userInformationForm.roleType === '') { // 角色类型
          this.$message.error('请选择角色类型')
        } else {
          const result = await putAccountsIdentity(this.userInformationForm)
          if (result.code === 200) {
            this.$message.success('设置成功')
            this.userInformationPop = false
            this.managerAgencyTeamStoresAssistants()
          } else {
            this.$message.warning(result.message)
          }
        }
      } else {
        const result = await putAccountsIdentity(this.userInformationForm)
        if (result.code === 200) {
          this.$message.success('设置成功')
          this.userInformationPop = false
          this.managerAgencyTeamStoresAssistants()
        } else {
          this.$message.warning(result.message)
        }
      }
    },
    // 渠道停启用提示
    ManagerAgencyTeamChannelConfirm (item) {
      let text = item.effectivity === 0 ? '此操作将禁用该渠道下账号的登录权限，是否继续？' : '此操作将启用该渠道下账号的登录权限，是否继续？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeManagerAgencyTeamChannel(item)
      }).catch(() => {
      })
    },
    // 停启用渠道
    async changeManagerAgencyTeamChannel (item) {
      let channelStatus = item.effectivity === 0 ? -1 : 0
      this.effectivity = channelStatus
      const result = await changeManagerAgencyTeamChannel(`${item.id}/${sessionStorage.getItem('tenantId')}/${channelStatus}`)
      if (result.code === 200) {
        this.$message.success('操作成功')
        this.managerAgencyTeamChannelList()
      } else {
        this.$message.error(result.message)
      }
    },
    // 门店停启用提示
    changeAgencyTeamStoresConfirm (item) {
      let text = item.effectivity === 0 ? '此操作将禁用门店下账号的登录权限，是否继续？' : '此操作将启用门店下账号的登录权限，是否继续？'
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAgencyTeamStores(item)
      }).catch(() => {
      })
    },
    // 停启用门店
    async changeAgencyTeamStores (item) {
      let storeStatus = item.effectivity === 0 ? -1 : 0
      const result = await changeAgencyTeamStores(`${item.storeId}/${sessionStorage.getItem('tenantId')}/${storeStatus}`)
      if (result.code === 200) {
        this.$message.success('操作成功')
        this.managerAgencyTeamChannelList()

      } else {
        this.$message.error(result.message)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scope>
.identity{
  .el-form-item__content{
    max-width: calc(100% - 100px);
    .el-radio-button{
      margin-bottom: 8px;
    }
  }
}

.main-block {
	width: 100%;
	height: 600px;
	display: flex;

	.main-title {
		height: 50px;
		line-height: 50px;
		padding: 0 15px;
		position: relative;

		span {
			font-size: 14px;
		}

		.main-title-form {
			position: absolute;
			right: 15px;
			top: 50%;
			transform: translate(0, -50%);

			.el-button {
				padding: 7px 15px;
			}

			.search-user {
				display: flex;

				li {
					padding-left: 10px;

					.el-button {
						padding: 7px 15px;
					}
				}
			}
		}
	}

	.tab-bar {
		min-width: 280px;
		height: 100%;
		background: #f7f7f7;
		margin-right: 20px;
		padding-bottom: 20px;
		box-sizing: border-box;
		.tab-bar-cont {
			width: 100%;
			height: calc(100% - 50px);
			overflow-y: auto;
			padding-top: 2px;

			.tab-bar-menu {
				li {
					height: 40px;
					line-height: 40px;
					border: 1px solid #dcdfe6;
					border-radius: 4px;
					margin: 0 15px 10px 15px;
					background: #fff;
					padding: 0 10px;
					font-size: 13px;
					color: #666;
					cursor: pointer;
					display: flex;
					justify-content: space-between;

					span:first-child {
						width: 190px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}

					span:last-child {
						text-align: right;
						display: block;
						width: 100px;

						i {
							font-size: 18px;
							color: #ccc;
						}

						i.icon-tingyong {
							color: #de5246;
						}

						i.icon-qiyong {
							color: #1ba362
						}
					}

					&:hover, &.active {
						border: 1px solid #999;
						box-shadow: 0 0 2px #999;
					}
				}
			}
		}
	}

	.tab-bar-right{
		flex:1;
		width: calc(100% - 300px);
		height: 100%;
		background: #f7f7f7;
		.tab-cont {
			width: 100%;
			height: 100%;
			.tab-cont-table {
				margin: 0 auto;
				border-top: 2px solid #0f8be6;
				height: calc(100% - 118px);
				overflow-y: auto
			}
		}
	}
}
.store-name{width: 100%;
  .el-form-item__content{width:422px;}
}
.store-item{width:48%;height:35px;float:left;position:relative;
  .el-form-item__content{width:74%;
    .el-select{width:100%;}
  }
  .iconfont-block{position:absolute;top:2px;left:calc(100% + 10px);width:70px;
    .icon.iconfont{cursor:pointer;}
    .icon-zengjia{font-weight:bold;}
    .icon-shanjian{font-size:22px;}
  }
}
.channel-type{
  .el-input.el-input--small.el-input--suffix{width:178px;}
}
.authorized-project{width:100%;
  .el-form-item__content{width:100%;
    .el-checkbox{margin:0;width:31%;margin-right:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  }
  .authorized-project-ul:after{clear:both; display:block; content:'\20';}
  .authorized-project-ul{
    li{width:50%;zoom:1;float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  }
  .el-form-item__label{font-weight:bold;margin-bottom:10px;font-size:14px;}
  .el-form-item__content{padding-left:10px;}
}
.commissions-dialog{
  h3{color:#3e8bdf}
  .commissions{
    .el-form-item.el-form-item--small{width:31%;}
    .el-form-item.commissions-item.el-form-item--small{width:100%;display:flex;}
  }
}
.userInformation-dialog{
  .demo-form-inline{min-height:140px;}
}
.authorized-project .el-form-item__label{width:90px!important;}
.el-tabs__header{
	margin: 0!important;
}
</style>

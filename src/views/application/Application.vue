<template>
  <div class="Application">
    <el-tabs v-model="activeName"
             type="card"
             @tab-click="handleClick">
      <el-tab-pane label="配图管理"
                   name="1"
                   class="mapping">
        <dl class="title">
          <dt>登陆页面图</dt>
          <dd>(推荐尺寸<span class="red-font">676px*332px</span>，支持jpg/gif/png格式，大小不能超过 5MB)</dd>
        </dl>
        <el-upload class="avatar-uploader"
                   action="/iCloud-rest/projects/Aliyun/token/"
                   :show-file-list="false"
                   :http-request="loginPicsUpload"
                   :before-upload="beforeAvatarUpload">
          <img v-if="tenantConfig.loginPics"
               :src="tenantConfig.loginPics"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!--  -->
        <dl class="title">
          <dt>首页Banner</dt>
          <dd>(推荐尺寸<span class="red-font">750px*356px</span>，支持jpg/gif/png格式，大小不能超过 5MB，最多上传3张)</dd>
        </dl>
        <ul class="upload-img-list">
          <el-upload class="avatar-uploader"
                     :limit="3"
                     :class="tenantConfig.indexPics.length > 2 ? 'noupload' : ''"
                     action="/iCloud-rest/projects/Aliyun/token/"
                     accept="image/jpeg,image/gif,image/png,image/bmp"
                     list-type="picture-card"
                     :file-list="indexPics"
                     :before-remove="handleRemove"
                     :http-request="indexPicsUpload"
                     :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </ul>
        <!--  -->
        <dl class="title">
          <dt>注册页面图</dt>
          <dd>(推荐尺寸<span class="red-font">750px*246px</span>，支持jpg/gif/png格式，大小不能超过 5MB)</dd>
        </dl>
        <el-upload class="avatar-uploader"
                   action="/iCloud-rest/projects/Aliyun/token/"
                   :show-file-list="false"
                   :http-request="registerPicsUpload"
                   :before-upload="beforeAvatarUpload">
          <img v-if="tenantConfig.registerPics"
               :src="tenantConfig.registerPics"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!--  -->
        <dl class="title">
          <dt>佣金页面图</dt>
          <dd>(推荐尺寸<span class="red-font">750px*246px</span>，支持jpg/gif/png格式，大小不能超过 5MB)</dd>
        </dl>
        <el-upload class="avatar-uploader"
                   action="/iCloud-rest/projects/Aliyun/token/"
                   :show-file-list="false"
                   :http-request="commissionPicsUpload"
                   :before-upload="beforeAvatarUpload">
          <img v-if="tenantConfig.commissionPics"
               :src="tenantConfig.commissionPics"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <!--  -->
        <dl class="title">
          <dt>注册协议</dt>
        </dl>
        <div id="editorElem"
             style="text-align:left;margin-left:10px;"></div>
        <div class="submit">
          <el-button type="primary"
                     @click="postManagerTenantConfig"
                     icon="el-icon-check">保 存</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="活动管理"
                   name="2"
                   class="activity">
        <!--  -->
        <el-form label-width="100px"
                 :model="shareActivity">
          <el-form-item label="活动名称：">
            <el-input v-model="shareActivity.activityTitle"
                      maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="活动介绍：">
            <el-input type="textarea"
                      :rows="5"
                      placeholder="请输入内容"
                      v-model="shareActivity.activityDec"
                      maxlength="200">
            </el-input>
          </el-form-item>
          <el-form-item label="活动细则：">
            <el-input type="textarea"
                      :rows="5"
                      placeholder="请输入内容"
                      v-model="shareActivity.activityRule"
                      maxlength="200">
            </el-input>
          </el-form-item>
          <el-form-item label="活动图片：">
            <el-upload class="avatar-uploader"
                       action="/iCloud-rest/projects/Aliyun/token/"
                       :show-file-list="false"
                       :http-request="activityPicUpload"
                       :before-upload="beforeAvatarUpload">
              <img v-if="shareActivity.activityPic"
                   :src="shareActivity.activityPic"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            活动图片：( 推荐尺寸<span class="red-font">750px*1206px</span>，支持jpg/gif/png格式，大小不能超过 5MB)
          </el-form-item>
          <el-form-item label="活动ICON：">
            <el-upload class="avatar-uploader"
                       action="/iCloud-rest/projects/Aliyun/token/"
                       :show-file-list="false"
                       :http-request="activityShareIconUpload"
                       :before-upload="beforeAvatarUpload">
              <img v-if="shareActivity.activityShareIcon"
                   :src="shareActivity.activityShareIcon"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            活动ICON：( 推荐尺寸<span class="red-font">300px*300px</span>，支持jpg/gif/png格式，大小不能超过 5MB)
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="primary"
                       @click="postManagerShareActivity"
                       icon="el-icon-check">保 存</el-button>
          </el-form-item>
        </el-form>
        <!--  -->
      </el-tab-pane>
      <el-tab-pane label="公众号配置"
                   name="3"
                   class="activity"
                   v-if="type.toString() === '0'">
        <el-form label-width="100px">
          <el-form-item label="项目名称：">
            <el-select v-model="projectId"
                       placeholder="请选择"
                       filterable
                       @change="managerTenantConfigWxMenuUrl">
              <el-option v-for="(item, index) in projectData"
                         :key="index"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-form label-width="100px">
          <el-form-item label="应用链接：">
            <el-input v-model="copyLink"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary"
                       v-clipboard:copy="copyLink"
                       v-clipboard:success="copyLinkFun"
                       v-if="isButton">一键复制</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="非渠道项目授权"
                   name="4"
                   v-if="type.toString() === '0'">
        <el-form label-width="100px">
          <el-form-item label="项目名称：">
            <el-checkbox :indeterminate="isIndeterminate"
                         v-model="checkAll"
                         @change="handleCheckAllChange"
                         style="margin-bottom:15px;">全选</el-checkbox>
            <el-checkbox-group v-model="postNoAuthorization.projectIds"
                               v-if="noAuthorizationData && noAuthorizationData.length"
                               class="noAuthorization"
                               @change="handleCheckedCitiesChange">
              <el-checkbox :label="item.value"
                           v-for="(item, index) in noAuthorizationData"
                           :key="index">{{item.label}}</el-checkbox>
            </el-checkbox-group>
            <div v-else>无可选项目</div>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary"
                       @click="postProjectsAuthorizationList"
                       icon="el-icon-check">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个性应用"
                   name="5">
        <el-form label-width="100px">
          <el-form-item label="应用名称："
                        class="activity">
            <el-input v-model="individualRules.applicationName"
                      maxlength="15"></el-input>
          </el-form-item>
          <el-form-item label="默认城市："
                        class="activity">
            <el-select v-model="individualRules.selectedCityCode"
                       placeholder="请选择"
                       style="width:100%">
              <el-option v-for="(item, index) in citys"
                         :key="index"
                         :label="item.label"
                         :value="item.value">{{item.label}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=""
                        style="margin-top:30px">
            <el-button type="primary"
                       size="medium"
                       @click="postManagerIndividualRules"
                       icon="el-icon-check">保 存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="身份类型设置"
                   name="6">
        <el-form label-width="100px">
          <el-form-item label="身份类型："
                        class="identity">
            <div class="identity_item"
                 v-for="(item, index) in identityData"
                 :key="index"
                 :class="{'checked':item.checked}">
              <el-switch v-model="item.checked"
                         active-color="#546fe9"
                         inactive-color="#ccc"
                         @change="handleCheckedChange(item)">
              </el-switch>
              <span class="divider">{{item.identityName}}</span>
              <img :title="item.associatedProject?'已关联注册来源':'未关联注册来源'" :src="'static/images/'+(item.associatedProject?'associatedProject':'associatedProjectNo') +'.png'" width="20px" height="20px" />
               <!-- | -->
              <div class="action">
                <span @click.stop="editIdentity(item)">编辑</span>
                <span :class="{'dis_edit':item.fixed}" @click.stop="delIdentity(item)">删除</span>
              </div>
            </div>

            <!-- <el-checkbox-group v-model="individualRules.identityIds"
                               v-if="identityData.length">
              <el-checkbox v-for="(item, index) in identityData"
                           :key="index"
                           :checked="item.checked"
                           :label="item.identity"
                           @change="handleCheckedChange(item)"
                           border>
                {{item.identityName}}
                <span class="divider">|</span>
                <div class="action"
                     :class="{'dis_edit':item.fixed}">
                  <span @click.stop="editIdentity(item)">编辑</span>
                  <span @click.stop="delIdentity(item)">删除</span>
                </div>
              </el-checkbox>
            </el-checkbox-group> -->
          </el-form-item>
          <el-form-item label=""
                        style="margin-top:30px">
            <el-button type="primary"
                       size="medium"
                       @click="addIdentity()"
                       icon="el-icon-plus">添 加</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <!--
      添加/编辑身份信息
    -->
    <el-dialog :title="(identityEdit ?'编辑':'新建')+'身份类型'"
               :visible.sync="identityDialog"
               width="500px"
               @close="closeIdentity"
               class="identityDialog-dialog">
      <el-form ref="identityForm"
               :model="identityForm"
               :rules="identityRules"
               label-position="right"
               label-width="160px">
        <el-form-item label="身份类型名称："
                      prop="identityName">
          <el-input v-model="identityForm.identityName"
                    maxlength="10" :disabled="identityForm.fixed"></el-input>
        </el-form-item>
        <el-form-item label="是否关联注册来源："
                      prop="associatedProject">
          <el-switch v-model="identityForm.associatedProject"
                     active-color="#546fe9"
                     inactive-color="#ccc">
          </el-switch>
        </el-form-item>
        <el-form-item label="身份证是否必填："
                      prop="needIdCard">
          <el-switch v-model="identityForm.needIdCard"
                     active-color="#546fe9"
                     inactive-color="#ccc">
          </el-switch>
        </el-form-item>
        <el-form-item label="注册时是否需要审核："
                      prop="needReview">
          <el-switch v-model="identityForm.needReview"
                     active-color="#546fe9"
                     inactive-color="#ccc">
          </el-switch>
        </el-form-item>

      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeIdentity()"
                   icon="el-icon-close">关 闭</el-button>
        <el-button type="primary"
                   @click="doIdentity()"
                   icon="el-icon-check">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { getAliyunToken, getManagerShareActivity, postManagerShareActivity, getManagerTenantConfig, postManagerTenantConfig, managerTenantConfigWxMenuUrl, projectsProject, getProjectsAuthorizationList, postProjectsAuthorizationList, getManagerIndividualRules, projectsCitys, accountsIdentity, postManagerIndividualRules, getIdentityData, addIdentity, editIdentity, delIdentity, startIdentity } from '../../common/api'
import E from 'wangeditor'
import * as oss from '../../common/ossBaseUrl'
export default {
  name: 'Application',
  data () {
    return {
      individualRules: {
        tenantId: '', // 租户ID
        applicationName: '', // 默认应用名称
        selectedCityCode: '', // 默认选中城市
        identityIds: [] // 身份类型
      },
      citys: [],
      identityData: [],
      activeName: '1',
      // 配图管理
      editorElem: null,
      indexPics: [],
      tenantConfig: {
        tenantId: '', // 租户id
        loginPics: '', // 登录页面图片
        indexPics: [], // 首页图片
        registerPics: '', // 注册页面图
        commissionPics: '', // 佣金页面图片
        registerAgreement: '' // 注册协议
      },
      // 活动管理
      shareActivity: {
        tenantId: '', // 租户id
        activityTitle: '', // 活动标题
        activityDec: '', // 活动介绍
        activityRule: '', // 活动细则
        activityPic: '', // 活动图片
        activityShareIcon: '' // 分享活动小图标
      },
      // 上传至阿里云
      imageUrl: '',
      client: '',
      baseUrl: oss.OSS_BASE_URL,
      houseType: {
        imageParse: [],
        imageUrls: []
      },
      // 待删
      editorContent: '',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      // 复制
      type: '',
      isButton: false,
      projectId: '',
      projectData: [],
      copyLink: '',
      checkAll: false,
      isIndeterminate: true,
      postNoAuthorization: {
        tenantId: '',
        projectIds: []
      },
      noAuthorizationData: [],
      identityDialog: false,
      randomNum: [],
      identityEdit: false,
      identityForm: {
        identityName: '',
        associatedProject:false,
        fixed:false,
        identity: -1,
        needIdCard:false,//身份证是否必填（1是，0否）
        needReview:false//注册时是否需要审核（1是，0否）
      },
      identityRules: {//表单验证规则
        identityName: [
          { required: true, message: '请输入身份类型名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.editorElem = new E('#editorElem')
    this.editorElem.customConfig.onchange = (html) => {
      this.tenantConfig.registerAgreement = html
    }
    this.editorElem.create()
    this.getAliyunToken()
    this.getManagerTenantConfig()
    this.projectId = sessionStorage.getItem('projectId')
    this.type = sessionStorage.getItem('type')
    if (sessionStorage.getItem('tenantId')) {
      this.shareActivity.tenantId = sessionStorage.getItem('tenantId')
      this.tenantConfig.tenantId = sessionStorage.getItem('tenantId')
      this.postNoAuthorization.tenantId = sessionStorage.getItem('tenantId')
      this.projectsProject()
    }
    this.projectsCitys()
    // this.accountsIdentity()
  },
  methods: {
    handleClick (tab, event) {
      switch (this.activeName) {
        case '1':
          // this.getManagerTenantConfig()
          break
        case '2':
          this.getManagerShareActivity()
          break
        case '3':
          if (this.projectId !== null && this.projectId !== '') {
            this.managerTenantConfigWxMenuUrl()
          } else {
            this.$message.error('请选择项目')
          }
          break
        case '4':
          this.getProjectsAuthorizationList()
          break
        case '5':
          this.getManagerIndividualRules()
          break
        case '6':
          this.accountsIdentity()
          break
      }
    },
    // 获取城市
    async projectsCitys () {
      const res = await projectsCitys(`?tenantId=${sessionStorage.getItem('tenantId')}`)
      this.citys = [{
        value: '',
        label: '全部'
      }]
      const data = res.data
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].citys.length; j++) {
          this.citys.push({
            value: data[i].citys[j].cityCode,
            label: data[i].citys[j].cityName
          })
        }
      }
    },
    // 获取 个性应用
    async getManagerIndividualRules () {
      const result = await getManagerIndividualRules(sessionStorage.getItem('tenantId'))
      if (result.code === 200) {
        this.individualRules.tenantId = sessionStorage.getItem('tenantId') // 租户ID
        this.individualRules.applicationName = result.data.applicationName // 默认应用名称
        this.individualRules.selectedCityCode = result.data.selectedCityCode // 默认选中城市
        // this.individualRules.identityIds = result.data.identityIds // 身份类型
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 提交 个性应用
    async postManagerIndividualRules () {
      console.info(this.individualRules)
      // let identityIds = JZY.u.copy(this.identityData)
      // this.identityData.forEach((item, index) => {
      //   identityIds[index]['checked'] = (this.individualRules.identityIds.indexOf(item.value) !== -1)
      //   identityIds[index]['value'] = item.value > 0 ? item.value : -1
      // })
      let params = JZY.u.deepExtend({}, this.individualRules)
      // params.identityIds = identityIds
      delete params.identityIds
      const result = await postManagerIndividualRules(params)
      if (result.code === 200) {
        this.$message.success('设置成功')
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 获取身份认证类型
    async accountsIdentity () {
      // const result = await accountsIdentity(`?type=1`)
      const result = await getIdentityData({ type: 5, tenantId: sessionStorage.getItem('tenantId') })
      if (result.code === 200) {
        this.identityData = [...result.data]
        // for (let i = 0; i < result.data.length; i++) {
        //   this.identityData.push({
        //     label: result.data[i].identityName,
        //     value: result.data[i].identity,
        //     checked: result.data[i].checked,
        //     fixed: result.data[i].fixed
        //   })
        // }
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 获取微信链接
    async managerTenantConfigWxMenuUrl () {
      sessionStorage.setItem('projectId', this.projectId)
      const res = await managerTenantConfigWxMenuUrl(`?tenantId=${sessionStorage.getItem('tenantId')}&projectId=${this.projectId}`)
      const data = res.message
      if (res.code === 200) {
        this.copyLink = data
        this.isButton = true
      } else {
        this.copyLink = ''
        this.isButton = false
        this.$message.error(res.message)
      }
    },
    // 一键复制
    copyLinkFun (e) {
      this.$message.success('复制成功')
    },
    // ----
    async projectsProject () {
      const result = await projectsProject(sessionStorage.getItem('tenantId'))
      const data = result.data.result
      let list = []
      for (let i = 0; i < data.length; i++) {
        let json = {
          label: data[i].referred,
          value: data[i].projectId
        }
        list.push(json)
      }
      this.projectData = list
    },
    // 配图管理 获取
    async getManagerTenantConfig () {
      const result = await getManagerTenantConfig(`${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        const res = result.data
        this.tenantConfig.tenantId = res.tenantId // 租户id
        this.tenantConfig.loginPics = res.loginPic // 登录页面图片
        let indexPicsArr = res.indexPic.split(',')
        let arr = []
        for (let i = 0; i < indexPicsArr.length; i++) {
          arr.push(
            {
              url: indexPicsArr[i],
              name: ''
            }
          )
        }
        this.indexPics = arr // 首页图片
        this.tenantConfig.indexPics = res.indexPic.split(',') // 首页图片
        this.tenantConfig.registerPics = res.registerPic // 注册页面图
        this.tenantConfig.commissionPics = res.commissionPic // 佣金页面图片
        this.tenantConfig.registerAgreement = res.registerAgreement
        // 注册协议
        setTimeout(() => {
          this.editorElem.txt.html(res.registerAgreement)
        }, 0)
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 配图管理 提交
    async postManagerTenantConfig () {
      let obj = {
        commissionPics: [this.tenantConfig.commissionPics],
        indexPics: this.tenantConfig.indexPics,
        loginPics: [this.tenantConfig.loginPics],
        registerPics: [this.tenantConfig.registerPics],
        registerAgreement: this.tenantConfig.registerAgreement,
        tenantId: this.tenantConfig.tenantId
      }
      const result = await postManagerTenantConfig(obj)
      if (result.code === 200) {
        this.$message.success('设置成功')
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 活动管理 获取
    async getManagerShareActivity () {
      const result = await getManagerShareActivity(`${sessionStorage.getItem('tenantId')}`)
      if (result.code === 200) {
        const res = result.data
        this.shareActivity.tenantId = res.tenantId // 租户id
        this.shareActivity.activityTitle = res.activityTitle // 活动标题
        this.shareActivity.activityRule = res.activityRule // 活动细则
        this.shareActivity.activityDec = res.activityDec // 活动介绍
        this.shareActivity.activityPic = res.activityPic // 活动图片
        this.shareActivity.activityShareIcon = res.activityShareIcon // 分享活动小图标
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    // 活动管理 提交
    async postManagerShareActivity () {
      if (this.shareActivity.activityTitle === '') {
        this.$message.error('活动名称不能为空')
      } else if (this.shareActivity.activityRule === '') {
        this.$message.error('活动细则不能为空')
      } else if (this.shareActivity.activityDec === '') {
        this.$message.error('活动介绍不能为空')
      } else if (this.shareActivity.activityPic === '') {
        this.$message.error('活动图片不能为空')
      } else if (this.shareActivity.activityShareIcon === '') {
        this.$message.error('活动ICON不能为空')
      } else {
        const result = await postManagerShareActivity(this.shareActivity)
        if (result.code === 200) {
          this.$message.success('设置成功')
        } else if (result.code !== 200 && result.code !== 401) {
          this.$message.error(result.message)
        }
      }
    },
    // 上传图片
    async getAliyunToken () {
      const result = await getAliyunToken(``)
      if (result.status === 200) {
        this.client = new window.OSS.Wrapper({
          accessKeyId: result.data.accessKeyId,
          secure: true,
          accessKeySecret: result.data.accessKeySecret,
          stsToken: result.data.stsToken,
          region: 'oss-cn-beijing',
          bucket: result.data.bucket
        })
      } else if (result.code !== 200 && result.code !== 401) {
        this.$message.error(result.message)
      }
    },
    loginPicsUpload (param) { // 上传图片 - 登陆页面图
      let timeStamp = new Date().getTime()
      try {
        let pattern = 'Pattern/' + timeStamp + '.jpg'
        this.houseType.imageParse.push(pattern)
        let file = param.file
        if (file !== undefined) {
          this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
            let httpSrc = result.res.requestUrls[0]
            if (httpSrc.indexOf('?') !== -1) {
              httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
            }
            this.houseType.imageUrls.push(pattern)
            this.$emit('oss-child-urls', this.houseType.imageUrls)
            this.tenantConfig.loginPics = httpSrc
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '图片选取上传失败,请重新选择上传！！'
            })
          })
        }
      } catch (ex) {
      }
    },
    indexPicsUpload (param) { // 上传图片 - 首页banner多张
      let timeStamp = new Date().getTime()
      try {
        let pattern = 'Pattern/' + timeStamp + '.jpg'
        let file = param.file
        if (file !== undefined) {
          this.client.multipartUpload(pattern, file).then((result) => {
            let httpSrc = result.res.requestUrls[0]
            if (httpSrc.indexOf('?') !== -1) {
              httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
            }
            let obj = {
              url: httpSrc,
              name: file.name
            }
            this.tenantConfig.indexPics.push(obj.url)
            console.log(this.tenantConfig.indexPics)
          })
        }
      } catch (ex) {
      }
    },
    handleRemove (file, fileList) { // 删除 - 首页banner多张
      for (let i = 0; i < fileList.length; i++) {
        if (file === fileList[i]) {
          this.tenantConfig.indexPics.splice(i, 1)
        }
      }
    },
    registerPicsUpload (param) { // 上传图片 - 注册页
      let timeStamp = new Date().getTime()
      try {
        let pattern = 'Pattern/' + timeStamp + '.jpg'
        this.houseType.imageParse.push(pattern)
        let file = param.file
        if (file !== undefined) {
          this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
            let httpSrc = result.res.requestUrls[0]
            if (httpSrc.indexOf('?') !== -1) {
              httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
            }
            this.houseType.imageUrls.push(pattern)
            this.$emit('oss-child-urls', this.houseType.imageUrls)
            this.tenantConfig.registerPics = httpSrc
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '图片选取上传失败,请重新选择上传！！'
            })
          })
        }
      } catch (ex) {
      }
    },
    commissionPicsUpload (param) { // 上传图片 - 佣金页面
      let timeStamp = new Date().getTime()
      try {
        let pattern = 'Pattern/' + timeStamp + '.jpg'
        this.houseType.imageParse.push(pattern)
        let file = param.file
        if (file !== undefined) {
          this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
            let httpSrc = result.res.requestUrls[0]
            if (httpSrc.indexOf('?') !== -1) {
              httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
            }
            this.houseType.imageUrls.push(pattern)
            this.$emit('oss-child-urls', this.houseType.imageUrls)
            this.tenantConfig.commissionPics = httpSrc
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '图片选取上传失败,请重新选择上传！！'
            })
          })
        }
      } catch (ex) {
      }
    },
    activityPicUpload (param) { // 上传图片 - 活动图片
      let timeStamp = new Date().getTime()
      try {
        let pattern = 'Pattern/' + timeStamp + '.jpg'
        this.houseType.imageParse.push(pattern)
        let file = param.file
        if (file !== undefined) {
          this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
            let httpSrc = result.res.requestUrls[0]
            if (httpSrc.indexOf('?') !== -1) {
              httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
            }
            this.houseType.imageUrls.push(pattern)
            this.$emit('oss-child-urls', this.houseType.imageUrls)
            this.shareActivity.activityPic = httpSrc
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '图片选取上传失败,请重新选择上传！！'
            })
          })
        }
      } catch (ex) {
      }
    },
    activityShareIconUpload (param) { // 上传图片 - 活动ICON
      let timeStamp = new Date().getTime()
      try {
        let pattern = 'Pattern/' + timeStamp + '.jpg'
        this.houseType.imageParse.push(pattern)
        let file = param.file
        if (file !== undefined) {
          this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
            let httpSrc = result.res.requestUrls[0]
            if (httpSrc.indexOf('?') !== -1) {
              httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
            }
            this.houseType.imageUrls.push(pattern)
            this.$emit('oss-child-urls', this.houseType.imageUrls)
            this.shareActivity.activityShareIcon = httpSrc
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '图片选取上传失败,请重新选择上传！！'
            })
          })
        }
      } catch (ex) {
      }
    },
    beforeAvatarUpload (file) {
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isJPEG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG、PNG、GIF 格式!')
        return false && isLt5M
      } else if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!')
        return false && isLt5M
      } else if (isJPEG) {
        return isJPEG && isLt5M
      } else if (isPNG) {
        return isPNG && isLt5M
      } else if (isGIF) {
        return isGIF && isLt5M
      }
    },
    // 查看授权项目列表
    async getProjectsAuthorizationList () {
      const result = await getProjectsAuthorizationList(`${sessionStorage.getItem('tenantId')}`)
      const data = result.data
      this.noAuthorizationData = []
      this.postNoAuthorization.projectIds = []
      for (let i = 0; i < data.length; i++) {
        let obj = {
          label: data[i].name,
          value: data[i].projectId
        }
        this.noAuthorizationData.push(obj)
        if (data[i].isAuthorised === 1) {
          this.postNoAuthorization.projectIds.push(data[i].projectId)
        }
      }
    },
    // 提交授权项目列表
    async postProjectsAuthorizationList () {
      if (this.postNoAuthorization.projectIds.length < 1) {
        this.$message.error('请选择项目')
      } else {
        const result = await postProjectsAuthorizationList(this.postNoAuthorization)
        if (result.code === 200) {
          this.$message.success('设置成功')
        } else if (result.code !== 200 && result.code !== 401) {
          this.$message.error(result.message)
        }
      }
    },
    // 全选
    handleCheckAllChange (val) {
      let arr = []
      for (let i = 0; i < this.noAuthorizationData.length; i++) {
        arr.push(this.noAuthorizationData[i].value)
      }
      this.postNoAuthorization.projectIds = val ? arr : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.noAuthorizationData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.noAuthorizationData.length
    },
    //选中事件
    async handleCheckedChange (obj) {
      console.log(this.individualRules.identityIds)
      let params = {
        "tenantId": sessionStorage.getItem('tenantId'),
        value: obj.identity,
        checked: obj.checked
      }
      let result = await startIdentity(params)
      if (result.code !== 200) {
        obj.checked = !obj.checked
      }
    },
    //添加身份信息
    addIdentity () {
      this.identityForm.identity = -1
      this.identityForm.needIdCard = false
      this.identityForm.needReview = false
      this.identityEdit = false
      this.identityDialog = true
    },
    //编辑身份信息
    editIdentity (obj = {}) {
      // if (!obj.fixed) {
        this.identityEdit = true
        this.identityForm = JZY.u.deepExtend({}, obj)
        this.identityDialog = true
      // }
    },
    //删除身份信息
    delIdentity (obj = {}) {
      if (obj.fixed) {//内置属性，不允许删除
        // this.$message.error('内置属性，不允许删除')
      } else {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            "tenantId": sessionStorage.getItem('tenantId'),
            "value": obj.identity
          }
          let result = await delIdentity(params)
          if (result.code === 400) {
            this.$message({
              type: 'error',
              message: result.message
            })
          } else {
            this.identityData = this.identityData.filter((item, index) => {
              return item.identity !== obj.identity
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        }).catch(() => {
        });
      }
    },
    //身份信息弹窗的保存事件
    doIdentity () {
      this.$refs.identityForm.validate(async valid => {
        if (valid) {
          let params = JZY.u.deepExtend({}, this.identityForm, {
            "tenantId": sessionStorage.getItem('tenantId'),
            value: this.identityForm.identity,
            label: this.identityForm.identityName
          })
          delete params.identity
          delete params.identityName
          let result = null
          if (this.identityEdit) {//编辑
            result = await editIdentity(params)
          } else {//新增
            result = await addIdentity(params)
          }
          if (result.code === 400) {
            this.$message({
              type: 'error',
              message: result.message
            })
          } else {
            this.accountsIdentity()
            this.closeIdentity()
          }
        } else {
          return
        }
      })
    },
    closeIdentity () {
      this.$refs.identityForm.resetFields()//置空表单项
      this.identityForm.identity = -1
      this.identityForm.identityName = ''
      this.identityForm.needIdCard = false
      this.identityForm.needReview = false
      this.identityForm.checked = false
      this.identityForm.fixed = false
      this.identityForm.associatedProject = false

      console.info(this.identityForm)
      this.identityDialog = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.Application {
  padding-top: 30px;
  .mapping {
    .title {
      display: flex;
      line-height: 40px;
      padding-left: 10px;
      dt {
        font-size: 16px;
        font-weight: bold;
        padding-right: 20px;
      }
      dd {
        font-size: 14px;
      }
    }
    .avatar-uploader {
      margin-left: 10px;
    }
    .submit {
      padding: 30px 0 60px 10px;
    }
  }
  .upload-img-list {
    display: flex;
    li {
      width: 220px;
    }
  }
  .activity {
    width: 500px;
    .submit {
      padding: 30px 0 60px 0;
    }
  }
  .agreement {
    .submit {
      padding: 20px 0;
    }
  }
}
.red-font {
  color: #f66;
}
.noAuthorization {
  .el-checkbox {
    margin-left: 0;
    width: 30%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 20px;
  }
}
.identity {
  width: 100%;
  .el-checkbox {
    margin-left: 0;
    margin-right: 30px;
    line-height: 18px;
    margin-bottom: 12px;
    // position: relative;
    &.is-bordered.el-checkbox--mini {
      padding: 3px 75px 3px 10px;
    }
  }
  .el-checkbox.is-bordered + .el-checkbox.is-bordered {
    margin-left: 0;
  }
  .divider {
    padding: 0 10px;
  }
  .action {
    // position: absolute;
    // top: 7px;
    // right: 14px;
    span + span {
      margin-left: 8px;
    }
    .dis_edit {
      color: #ccc;
    }
  }

  .identity_item {
    font-size: 12px;
    margin-left: 0;
    margin-right: 30px;
    line-height: 18px;
    display: inline-block;
    width: auto;
    height: 32px;
    margin-bottom: 12px;
    line-height: 30px;
    padding: 0 8px;
    border-radius: 4px;
    position: relative;
    border: 1px solid #ccc;

    .divider {
      padding: 1px 10px;
      display: inline-flex;
    }
    &.checked {
      border: 1px solid #546fe9;
      // .action {
      //   color: #546fe9;
      // }
    }
    .action {
      display: inline-flex;
      margin-left: 8px;
      cursor: pointer;
      color: #546fe9;
      span + span {
        margin-left: 8px;
      }
      .dis_edit {
        color: #ccc;
        cursor: inherit;
      }
    }
  }
}
</style>

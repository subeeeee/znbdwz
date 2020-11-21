<template>
  <div class="sign_wrap">
    <el-row>
      <el-col :span="12"
              class="content">
        <el-form ref="signForm"
                 label-position="left"
                 :model="signForm"
                 :rules="signFormRules"
                 label-width="120px">
          <el-form-item label="AppId："
                        prop="signKey">
            <el-input v-model="signForm.signKey"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="SecretKey："
                        prop="signSecret">
            <el-input v-model="signForm.signSecret"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="合同编号："
                        prop="contractClassifyId">
            <el-input v-model="signForm.contractClassifyId"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="合同主题："
                        prop="contractSubject">
            <el-input v-model="signForm.contractSubject"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="甲方主题："
                        prop="companyName">
            <el-input v-model="signForm.companyName"
                      size="medium">
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24"
              class="submit">
        <el-col :span="4"
                :offset='11'>
          <el-button type="primary"
                     size="medium"
                     @click.native="submit()">保 存</el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import * as api from '@/store/fetch/api'
export default {
  name: 'sign_wrap',
  data () {
    return {
      signForm: {
        signKey: '',//AppId
        signSecret: '',//SecretKey
        contractClassifyId: '',//合同编号
        contractSubject: '',//合同主题
        companyName: ''//甲方主题
      },
      signFormRules: {//表单验证规则
        signKey: [
          { required: true, message: '请输入AppId', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        signSecret: [
          { required: true, message: '请输入SecretKey', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        contractClassifyId: [
          { required: true, message: '请输入合同编号', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        contractSubject: [
          { required: true, message: '请输入合同主题', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        companyName: [
          { required: true, message: '请输入甲方主题', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ]
      },
      projectId: ''//项目id
    }
  },
  mounted () {
    this.projectId = sessionStorage.getItem('projectId')//获取已选择的项目id
    // let user = JSON.parse(unescape(util.getCookie('tenantManger')))
    this.projectId && this.getInfo({
      projectId: this.projectId
    })
  },
  methods: {
    //根据项目id获取签约配置信息
    async getInfo (obj = {}) {
      let loadingInstance = Loading.service({ fullscreen: true })
      let res = await api.getSignInfoByProjectId(obj)
      if (res.data) {
        this.projectId = obj.projectId
        Object.assign(this.signForm, res.data)
      } else {
        res.code !== 200 && this.$message.warning(res.message)
        this.signForm.id = ''
        this.$refs.signForm.resetFields()//置空表单项
      }
      loadingInstance.close()
    },
    //表单提交
    submit () {
      this.$refs["signForm"].validate((valid) => {
        if (valid) {
          console.log(this.signForm)
          if (!this.projectId) {
            this.$message.warning('请选择项目！')
            return
          }
          let queryData = {
            ...this.signForm,
            projectId: this.projectId
          }
          this.saveInfo(queryData)
        } else {
          return false
        }
      })
    },
    //保存数据
    async saveInfo (obj = {}) {
      let res = await api.saveSignInfo(obj)
      this.$message.success('保存成功')
      // debugger
    }
  }
}
</script>
<style scoped lang="scss">
.sign_wrap {
  .content {
    padding-left: 0;
    padding-top: 12px;
  }
  .submit {
    margin-top: 24px;
    margin-bottom: 24px;
  }
}
</style>

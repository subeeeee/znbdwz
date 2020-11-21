<template>
  <div class="pay_wrap">
    <el-row>
      <el-col :span="12"
              class="content">
        <el-form ref="payForm"
                 label-position="left"
                 :model="payForm"
                 :rules="payFormRules"
                 label-width="120px">
          <el-form-item label="AppId："
                        prop="payKey">
            <el-input v-model="payForm.payKey"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="SecretKey："
                        prop="paySecret">
            <el-input v-model="payForm.paySecret"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="商户标识："
                        prop="payIdentity">
            <el-input v-model="payForm.payIdentity"
                      size="medium">
            </el-input>
          </el-form-item>
          <el-form-item label="ApiKey："
                        prop="payApiKey">
            <el-input v-model="payForm.payApiKey"
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
  name: 'pay_wrap',
  data () {
    return {
      payForm: {
        payKey: '',//AppId
        paySecret: '',//SecretKey
        payIdentity: '',//商户标识
        payApiKey: ''//ApiKey
      },
      payFormRules: {//表单验证规则
        payKey: [
          { required: true, message: '请输入AppId', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        paySecret: [
          { required: true, message: '请输入SecretKey', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        payIdentity: [
          { required: true, message: '请输入商户标识', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        payApiKey: [
          { required: true, message: '请输入ApiKey', trigger: 'blur' },
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
    //根据项目id获取支付配置信息
    async getInfo (obj = {}) {
      let loadingInstance = Loading.service({ fullscreen: true })
      let res = await api.getPayInfoByProjectId(obj)
      if (res.data) {
        this.projectId = obj.projectId
        Object.assign(this.payForm, res.data)
      } else {
        res.code !== 200 && this.$message.warning(res.message)
        this.payForm.id = ''
        this.$refs.payForm.resetFields()//置空表单项
      }
      loadingInstance.close()
    },
    //表单提交
    submit () {
      this.$refs["payForm"].validate((valid) => {
        if (valid) {
          console.log(this.payForm)
          if (!this.projectId) {
            this.$message.warning('请选择项目！')
            return
          }
          let queryData = {
            ...this.payForm,
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
      let res = await api.savePayInfo(obj)
      this.$message.success('保存成功')
      // debugger
    }
  }
}
</script>
<style scoped lang="scss">
.pay_wrap {
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
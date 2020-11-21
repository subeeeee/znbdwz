<template>
  <div id="BackPassword" class="backPassword">
    <el-header>
      <el-row class="tenantBox">
        <el-col class="tenant" :span="12">
          <i class="yuandianLogo" @click='callbackIndex'></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row class='stepsRow'>
        <el-col :span='24'>
          <el-steps :active="active" finish-status="success" simple>
            <el-step title="1.安全认证"></el-step>
            <el-step title="2.找回密码"></el-step>
          </el-steps>
        </el-col>
      </el-row>
      <el-row class='formRow' v-if='active === 0'>
        <el-col :span='24'>
          <el-form :model="backPassword" :rules='backPasswordRules' ref='backPasswordForm' label-width="80px" label-position='left'>
            <el-col :span='24'>
              <el-form-item label="企业号：" prop='enterprise'>
                <el-input v-model="backPassword.enterprise"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
              <el-form-item label="用户名：" prop='account'>
                <el-input v-model="backPassword.account"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
              <el-form-item label="手机号：" prop='mobile'>
                <el-input v-model="backPassword.mobile"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='18'>
              <el-form-item label="验证码：" prop='code'>
                <el-input v-model="backPassword.code"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='6' class='getCode'>
              <el-button type="primary" @click="getVerifyMsg" :disabled="isSended" :loading="loading">{{getButtonText=='获取验证码' ? getButtonText : '剩余' + getButtonText + '秒'}}</el-button>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <el-row class='formRow' v-if='active === 1'>
        <el-col :span='24'>
          <el-form ref="newPasswordForm" :model="newPassword" label-width="100px" label-position='left'>
            <el-col :span='24'>
              <el-form-item label="新密码：">
                <el-input type="password" v-model="newPassword.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
              <el-form-item label="确认新密码：">
                <el-input type="password" v-model="newPassword.confirmPassword"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </el-main>
    <div slot="footer" class="dialog-footer">
      <el-button class="dialog_foot_button" type="primary" v-if='active === 0' @click='next'>下一步</el-button>
      <el-button class="dialog_foot_button" type="primary" v-if='active === 1' @click='prev'>上一步</el-button>
      <el-button class="dialog_foot_button" type="primary" v-if="active === 1" @click="resetPassword" :disabled='newPassword.confirmPassword == "" && !newPassword.password === newPassword.confirmPassword'>确 定</el-button>
    </div>
  </div>
</template>

<script>
  import { validateMobile } from '../common/js/formValidation'
  import { requestTenantVerifyMsg, requestTenantPwdReset } from '../store/fetch/api'
  export default {
    name: 'BackPassword',
    data () {
      return {
        active: 0,
        loading: false,
        isSended: false,
        backPassword: {
          enterprise: '',
          account: '',
          mobile: '',
          code: ''
        },
        timer: null,
        getButtonText: '获取验证码',
        newPassword: {
          password: '',
          confirmPassword: ''
        },
        backPasswordRules: {
          enterprise: [{ required: true, message: '请输入企业号', trigger: 'blur' }],
          account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
          mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }]
        }
      }
    },
    methods: {
      prev () {
        this.active = 0
      },
      next () {
        this.$refs.backPasswordForm.validate((valid) => {
          if (valid) {
            this.active++
          } else {
            return false
          }
        })
      },
      callbackIndex () {
        this.$router.push('/')
      },
      async getVerifyMsg () {
        const valid = this.backPassword.enterprise && this.backPassword.account && this.backPassword.mobile
        if (valid) {
          this.isSended = true
          let param = {
            enterprise: this.backPassword.enterprise,
            account: this.backPassword.account,
            mobile: this.backPassword.mobile
          }
          let res = await requestTenantVerifyMsg(param)
          // console.log(res)
          // debugger
          if (res.status === 200 && res.message.code === 200) {
            this.getButtonText = 300
            this.timer = setInterval(() => {
              if (this.getButtonText > 0) {
                this.getButtonText--
              } else {
                this.isSended = false
                this.getButtonText = '获取验证码'
                clearInterval(this.timer)
              }
            }, 1000)
            this.$message.success(`获取验证码成功！`)
          } else {
            this.isSended = false
            this.$message.warning(`${res.message.describeCn}`)
          }
        } else {
          this.$message.warning('企业号、用户名、手机号不能为空！')
        }
      },
      async resetPassword () {
        let partern = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/
        if (this.newPassword.password !== this.newPassword.confirmPassword) {
          this.$message.warning('两次密码输入不一致！')
        } else if (partern.test(this.newPassword.confirmPassword)) {
          const param = {
            enterprise: this.backPassword.enterprise,
            account: this.backPassword.account,
            mobile: this.backPassword.mobile,
            code: this.backPassword.code,
            password: this.newPassword.confirmPassword
          }
          let res = await requestTenantPwdReset(param)
          if (res.message.code === 200) {
            this.$message.success(res.message.describeCn + '即将跳转至登录页面...')
            setTimeout(() => {
              this.$router.back(1)
            }, 1200)
          } else {
            this.$message(res.message.describeCn)
          }
        } else {
          this.$message.warning('密码设置规则：长度6-14个字符；允许输入数字与大小写字母、标点符号；不允许有空格。')
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .backPassword{
    width: 100%;
    height: 100%;
    .dialog-footer{
      text-align: center;
    }
    .tenantBox{
      height: 100%;
      .tenant{
        height: 100%;
        text-align: left;
        .yuandianLogo{
          width: 150px;
          height: 35px;
          background: url("../../static/images/logo.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 10px;
          top:0;
          bottom: 0;
          margin: auto 0;
          &:hover{
            cursor: pointer;
          }
        }
        span{
          color: #fff;
          font-size: 22px;
          font-weight: bold;
          line-height: 100px;
          padding-left: 130px;
        }
      }
      .el-dropdown{
        float: right;
        margin-top: 36px;
      }
      .share-button{
        background: none;
        border: none;
        color: #fff;
        font-size: 22px;
      }
    }
    .stepsRow{
      width: 900px;
      margin: 40px auto;
    }
    .formRow{
      width: 400px;
      margin: 40px auto;
      .getCode{
        text-align: right;
        .el-button{
          background: none;
          color: #0F8BE6;
        }
      }
    }
  }
  .el-header {
    width: 100%;
    height: 60px !important;
    background: url("../../static/images/headerBg.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
  }
</style>

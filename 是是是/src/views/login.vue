<template>
  <div id="Login" :class="{'login': 1, 'self-bg' : selfBg!== '' || null }">
    <ThemePicker v-show="false" ref="themePicker"></ThemePicker>
    <el-container>
      <div class="huayuan-dingzhi" v-if='secHostName === "huayuan"'>
        <div class="daping">
          <img src="../../static/images/daping.png" alt="">
        </div>
        <div class="shouji">
          <img src="../../static/images/shouji.png" alt="">
        </div>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px"
               class="demo-ruleForm login-container">
        <img class="logo" :src="logo ? `${BASE_URL + logo}` : 'static/images/logo.png'" v-if='secHostName !== "huayuan"'>
        <!-- <img v-else src='../../static/images/logo.png' class="logo" /> -->
        <h3 class="title" :style="{color: theme}">系统登录</h3>
        <div class="loginInput">
          <el-form-item prop="enterprise">
            <i class="iconfont icon-qiyehao1" :style="{color: theme}"></i>
            <el-input type="text" v-model="loginForm.enterprise" auto-complete="off" placeholder="企业号"></el-input>
          </el-form-item>
          <el-form-item  prop="account">
            <i class="iconfont icon-yonghuming1" :style="{color: theme}"></i>
            <el-input v-model="loginForm.account" placeholder="用户名" type="text"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <i class="iconfont icon-mima1" :style="{color: theme}"></i>
            <el-input type="password" v-model="loginForm.password" @keyup.enter.native="handleSubmit" auto-complete="off" placeholder="密码"></el-input>
          </el-form-item>
        </div>
        <div class="rememberBox">
          <el-checkbox v-model="rememberPassword" class="remember">记住登录账号</el-checkbox>
          <div class="restPassWord" @click='backPassword' :style="{color: theme}">找回密码</div>
        </div>
        <el-form-item style="width:100%;">
          <el-button class="loginButton" type="primary" style="width:100%;" @click.native.prevent="handleSubmit">登录</el-button>
          <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
        </el-form-item>
        <div class="icons" v-if='secHostName === "huayuan"'>
          <span @click="openHuaYuanDingZhi('./static/images/zygwjj.png')">系统功能简介</span>
          <span @click="openHuaYuanDingZhi('./static/images/kpjz.png')">网上开盘价值</span>
          <span @click="openHuaYuanDingZhi('./static/images/kplc.png')">在线选房流程</span>
        </div>
      </el-form>
    </el-container>
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen>
      <img :src="dialogImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { requestLogin, requestLoginConfigGet } from '../store/fetch/api'
  import util from '../common/js/util.js'
  import * as BASE_URL from '../common/js/ossBaseUrl.js'
  import ThemePicker from '@/components/ThemePicker'

  export default {
    name: 'Login',
    data () {
      return {
        BASE_URL: BASE_URL.OSS_BASE_URL,
        loginForm: {
          enterprise: '',
          account: '',
          password: ''
        },
        rules: {
          enterprise: [
            {required: true, message: '企业号不能为空', trigger: 'blur'}
          ],
          account: [
            {required: true, message: '用户名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        rememberPassword: false,
        selfBg: '',
        logo: '',
        secHostName: '',
        theme: '#0F8BE6',
        dialogImgUrl: '',
        dialogVisible: false
      }
    },
    components: {
      ThemePicker
    },
    mounted () {
      this.loadAccountInfo()
      if (window.location.host.split('.')[0] !== 'yxf') {
        this.getUserConfig()
      }
    },
    created () {
    },
    methods: {
      async getUserConfig () {
        this.secHostName = window.location.host.split('.')[0] || null
        if (this.secHostName === 'huayuan') {
          this.$refs.themePicker.theme = '#C61408'
          this.theme = this.$refs.themePicker.theme
        }
        let res = await requestLoginConfigGet({
          prefix: this.secHostName
        })
        if (res.status === 200) {
          if (res.data) {
            localStorage.setItem('logo', res.data.logo || '')
            localStorage.setItem('loginBack', res.data.loginBack || '')
            localStorage.setItem('homeLogo', res.data.homeLogo || '')
            localStorage.setItem('banner', res.data.banner || '')
            this.selfBg = res.data.loginBack || ''
            this.logo = res.data.logo || ''
            if (this.selfBg) {
              document.querySelector('.login').setAttribute('style', `background: url('${this.BASE_URL + this.selfBg}') 100%/cover no-repeat;`)
            }
          }
        }
      },
      async handleSubmit (ev) {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            util.deleteAllCookies()
            let result = await requestLogin(this.loginForm)
            if (result.message.code !== 200) {
              this.$message({
                message: '登录失败，请检查您的账号信息填写是否正确。',
                type: 'error'
              })
            } else {
              util.delCookie('tenantManger')
              util.delCookie('accountInfo')
              if (this.rememberPassword) {
                let accountInfo = this.loginForm.account + '&' + this.loginForm.enterprise
                util.setCookie('accountInfo', accountInfo, 1440 * 3)
              } else {
                util.delCookie('accountInfo')
              }
              util.setCookie('tenantManger', JSON.stringify(result.data), 1440 * 3)
              this.$router.push({path: '/home'})
            }
          } else {
            return false
          }
        })
      },
      loadAccountInfo: function () {
        let accountInfo = unescape(util.getCookie('accountInfo'))
        if (accountInfo === 'null') {
          return false
        } else {
          let index = accountInfo.indexOf('&')
          this.loginForm.account = accountInfo.substring(0, index) ? accountInfo.substring(0, index) : ''
          this.loginForm.enterprise = accountInfo.substring(index + 1) ? accountInfo.substring(index + 1) : ''
          this.rememberPassword = true
        }
      },
      backPassword () {
        this.$router.push('/backPassword')
      },
      openHuaYuanDingZhi (url) {
        this.dialogVisible = true
        this.dialogImgUrl = url
      }
    }
  }
</script>

<style lang="scss">
  .login {
    width: 100%;
    height: 100%;
    background: url("../../static/images/logoBg.png") no-repeat;
    background-size: 100% 100%;
    .el-dialog{
      margin-bottom: 0;
      .el-dialog__header{
        padding: 0;
      }
      .el-dialog__body{
        text-align: center;
        padding: 0;
        img{
          width: 100%;
          height: auto;
        }
      }
      .el-icon-close{
        font-size: 40px;
        color: #fff;
      }
    }
    .huayuan-dingzhi{
      width: calc(90% - 500px);
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .daping{
        position: relative;
        img{
          width: 445px;
          height: 270px;
          display: block;
        }
      }
      .shouji{
        margin-left: 40px;
        img{
          width: 161px;
          height: 144px;
          display: block;
        }
      }
    }
    .button{
      width: 100%;
      height: 30px;
      color: #0F8BE6;
      font-size: 14px;
      line-height: 30px;
      text-align: center;
      border-left: 1px solid #0F8CE7;
    }
    .loginInput{
      border: 1px solid #303030;
      border-radius: 5px;
      overflow: hidden;
      .el-form-item{
        margin: 0;
        border-bottom: 1px solid #303030;
        position: relative;
        .el-form-item__error{
          width: 100px;
          padding: 0;
          left: 240px;
          z-index: 999;
          line-height: 32px;
          top:0;
          text-align: right;
        }
        &:last-child{
          border: none;
        }
        .el-input{
          position: relative;
          padding-left: 30px;
          box-sizing: border-box;
          input{
            border: none;
            color: #999;
          }
        }
        .iconfont{
          position: absolute;
          width: 45px;
          text-align: center;
          z-index: 99;
        }
      }
    }
    .el-container {
      width: 100%;
      height: 100%;
      position: relative;
      .login-container {
        /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
        box-sizing: border-box;
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: auto 0;
        width: 450px;
        height: 300px;
        padding: 20px 46px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        position: absolute;
        top:0;
        bottom: 0;
        right: 180px;
        .logo {
          content: '';
          width: 144px;
          height: 32px;
          position: absolute;
          left: 0;
          top:-50px;
        }
        .title {
          text-align: center;
          color: #0F8BE6;
          margin: 0 0 20px 0;
        }
        .icons{
          position: absolute;
          left: 0;
          bottom: -35px;
          span{
            display: inline-block;
            width: 100px;
            text-align: center;
            position: relative;
            color: #fff;
            font-size: 12px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.50);
            &:after{
              content: '';
              width: 1px;
              height: 18px;
              background: #fff;
              position: absolute;
              right: 0;
              top: 0;
            }
            img{
              width: 20px;
              height: 20px;
              display: inline-block;
            }
            &:last-child{
              &::after{
                display: none;
              }
            }
            &:nth-of-type(2){
              img{
                width: 17px;
              }
            }
          }
        }
      }
      .rememberBox{
        width: 100%;
        height: 50px;
        position: relative;
        .remember{
          margin: 17px 0 17px 10px;
          position: absolute;
          left: 0;
        }
        .restPassWord{
          line-height: 50px;
          position: absolute;
          right: 0;
          text-align: right;
          color: #0F8AE5;
          font-size: 14px;
          &:hover{
            cursor:pointer;
          }
        }
      }
      .loginButton{
        height: 40px;
        transition: all .4s;
      }
      .el-button--primary{
        &:hover{
          opacity: .7;
          border-radius: 20px;
          transition: all .4s;
        }
      }
    }
  }
</style>

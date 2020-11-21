<template>
  <div id='Error' class="error">
    <el-header>
      <el-row class="tenantBox">
        <el-col class="tenant" :span="12">
          <i class="yuandianLogo"></i>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <div class='errorImg'>
        <img src="../../static/images/500.png" alt="">
        <p>{{ message }}，点击重新加载试试 ~ </p>
        <el-button type="primary" @click='reload'>重新加载</el-button>
      </div>
    </el-main>
  </div>
</template>

<script>
  export default {
    name: 'Error',
    data () {
      return {
        message: ''
      }
    },
    created () {
      this.$route.query.message ? this.message = this.$route.query.message : this.message = '网络异常'
    },
    methods: {
      reload () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped lang="scss">
  .error{
    .el-header {
      width: 100%;
      height: 60px !important;
      background: url("../../static/images/headerBg.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      .tenantBox {
        height: 100%;
        .tenant {
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
          }
          span {
            color: #fff;
            font-size: 22px;
            font-weight: bold;
            line-height: 100px;
            padding-left: 130px;
          }
        }
      }
    }
    .errorImg{
      width: 450px;
      margin: 100px auto 30px auto;
      text-align: center;
      img{
        width: 100%;
        display: block;
      }
      p{
        text-align: center;
        line-height: 40px;
        margin-top: 30px;
        margin-bottom: 10px;
        color: #0f81dc;
        font-size: 14px;
      }
      .el-button--mini{
        padding: 9px 32px;
      }
    }
  }
</style>

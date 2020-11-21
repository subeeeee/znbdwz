<template>
  <el-row>
    <el-col>
      <LabelTitle :title="'用户定制'"></LabelTitle>
    </el-col>

    <el-col class="item-up" :span="6">
      <el-col :span="22" class="photoAlbumTitle">
        <span>登录背景定制：</span><br/>
        <span>( 推荐尺寸 1920px*1080px，支持jpg/png格式 )</span>
      </el-col>
      <el-col :span="22" class="uploadImg">
        <ossUpload
          :id="'backgroundImg'"
          :urls="backgroundImgUrls"
          :is-single="true"
          @oss-child-urls="bgImageUplaodChange"
          @oss-delete-img="bgImageDelete">
        </ossUpload>
      </el-col>
    </el-col>

    <el-col class="item-up" :span="6">
      <el-col :span="22" class="photoAlbumTitle">
        <span>LOGO 定制：</span>
        <br/>
        <span>( 推荐尺寸130px*35px，支持jpg/png格式 )</span>
      </el-col>
      <el-col :span="22" class="uploadImg">
        <ossUpload
          :id="'logoImgUrl'"
          :urls="logoImgUrls"
          :is-single="true"
          @oss-child-urls="logoImageUplaodChange"
          @oss-delete-img="logoImageDelete">
        </ossUpload>
      </el-col>
    </el-col>
    <el-col class="item-up" :span="6">
      <el-col :span="22" class="photoAlbumTitle">
        <span>标识图标定制：</span><br/>
        <span>( 推荐尺寸76px*47px，支持jpg/png格式 )</span>
      </el-col>
      <el-col :span="22" class="uploadImg">
        <ossUpload
          :id="'iconImgUrl'"
          :urls="iconImgUrls"
          :is-single="true"
          @oss-child-urls="iconImageUplaodChange"
          @oss-delete-img="iconImageDelete">
        </ossUpload>
      </el-col>
    </el-col>
    <el-col class="item-up" :span="6">
      <el-col :span="22" class="photoAlbumTitle">
        <span>Banner 定制</span>
        <br/>
        <span>( 推荐尺寸1623px*217px，支持jpg/gif/png格式 )</span>
      </el-col>
      <el-col :span="22" class="uploadImg">
        <ossUpload
          :id="'bannerImgUrl'"
          :urls="bannerImgUrls"
          :is-single="true"
          @oss-child-urls="bannerImageUplaodChange"
          @oss-delete-img="bannerImageDelete">
        </ossUpload>
      </el-col>
    </el-col>
    <el-col class="item-up">
      <el-button @click="saveUserCustomization" type="primary">保存</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { requestSaveWebsitePut, requestWebsiteConfigGet } from '../../store/fetch/api.js'
import LabelTitle from '../../components/LabelTitle'
import ossUpload from '../../components/singleOssUpload'
// import * as oss from '../../common/js/ossBaseUrl'
export default {
  props: ['user'],
  components: {
    LabelTitle,
    ossUpload
  },
  data () {
    return {
      backgroundImgUrls: [],
      logoImgUrls: [],
      iconImgUrls: [],
      bannerImgUrls: [],
      customizationForm: {
        tenantId: '',
        logo: '',
        banner: '',
        homeLogo: '',
        loginBack: '',
        lastModifyUserId: ''
      }
    }
  },
  methods: {
    bgImageUplaodChange (imgUrls) {
      this.backgroundImgUrls = imgUrls || ''
    },
    bgImageDelete (index) {
      this.backgroundImgUrls.splice(index, 1)
    },
    logoImageUplaodChange (imgUrls) {
      this.logoImgUrls = imgUrls || ''
    },
    logoImageDelete (index) {
      this.logoImgUrls.splice(index, 1)
    },
    iconImageUplaodChange (imgUrls) {
      this.iconImgUrls = imgUrls || ''
    },
    iconImageDelete (index) {
      this.iconImgUrls.splice(index, 1)
    },
    bannerImageUplaodChange (imgUrls) {
      this.bannerImgUrls = imgUrls || ''
    },
    bannerImageDelete (index) {
      this.bannerImgUrls.splice(index, 1)
    },
    async getTenantCustomization () {
      let res = await requestWebsiteConfigGet({
        tenantId: this.user.tenantId
      })
      if (res.data) {
        if (res.data.loginBack) { this.backgroundImgUrls.push(res.data.loginBack) }
        if (res.data.logo) { this.logoImgUrls.push(res.data.logo) }
        if (res.data.homeLogo) { this.iconImgUrls.push(res.data.homeLogo) }
        if (res.data.banner) { this.bannerImgUrls.push(res.data.banner) }
      }
    },
    async saveUserCustomization () {
      this.customizationForm = {
        tenantId: this.user.tenantId,
        logo: this.logoImgUrls[0] || '',
        banner: this.bannerImgUrls[0] || '',
        homeLogo: this.iconImgUrls[0] || '',
        loginBack: this.backgroundImgUrls[0] || '',
        lastModifyUserId: this.user.lastModifyUserId || ''
      }
      let isAll = true
      let keys = Object.keys(this.customizationForm)
      // keys.map(item => {
      //   debugger
      //   if (this.customizationForm[item] === '' || null || undefined) {
      //     isAll = false
      //   }
      // })
      if (isAll) {
        let res = await requestSaveWebsitePut(this.customizationForm)
        if (res.status === 200) {
          this.$message.success('保存定制成功！重新登录生效。')
          keys.map(item => {
            localStorage.setItem(item, this.customizationForm[item])
          })
        }
      } else {
        this.$message.error('请全部上传！')
      }
    }
  },
  mounted () {
    this.getTenantCustomization()
  }
}
</script>

<style lang="scss" scoped>
.photoAlbumTitle{
  padding: 10px;
  span:nth-of-type(2) {
    color: #999;
  }
}
.item-up {
  text-align: center;
  padding: 30px 0;
  &:last-of-type {
    text-align: right;
    padding-right: 40px;
  }
}
  
</style>
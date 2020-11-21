<template>
  <div class="OSSUpload">
    <slot>
      <div>
        <ul class="el-upload-list el-upload-list--picture-card">
          <li tabindex="0" class="el-upload-list__item is-success" v-for="( imageUrls, index ) in houseType.imageUrls" :key="imageUrls">
            <img :src='baseUrl + imageUrls' alt="" class="el-upload-list__item-thumbnail">
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"></i>
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-check"></i>
            </label>
            <i class="el-icon-close"></i>
            <i class="el-icon-close-tip">按 delete 键可删除</i>
            <span class="el-upload-list__item-actions" @click="deleteImg(index)">
              <span class="el-upload-list__item-delete">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </li>
        </ul>
        <div v-if="isSingleCtrl" tabindex="0" class="el-upload el-upload--picture-card">
          <i class="el-icon-plus"></i>
          <input type="file" accept='image/*' name="file" class="el-upload__input" :id="id" @change="fileChange">
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
  import { requestAliYunToken } from '../store/fetch/api'
  import * as oss from '../common/js/ossBaseUrl'
  
  export default {
    props: {
      id: {
        type: String,
        twoWay: false
      },
      urls: {
        type: Array,
        twoWay: true
      },
      isSingle: false
    },
    data () {
      return {
        houseType: {
          imageParse: [],
          imageUrls: []
        },
        token: '',
        client: '',
        baseUrl: oss.OSS_BASE_URL,
        isSingleCtrl: true
      }
    },
    created () {
      this.houseType.imageUrls = this.urls
      this.getAliYunToken()
    },
    methods: {
      fileChange () {
        this.uploadPatternImage()
      },
      deleteImg (index) {
        this.$emit('oss-delete-img', index)
      },
      async getAliYunToken () {
        let result = await requestAliYunToken()
        this.token = result.data
        this.client = new window.OSS.Wrapper({
          accessKeyId: this.token.accessKeyId,
          secure: true,
          accessKeySecret: this.token.accessKeySecret,
          stsToken: this.token.stsToken,
          region: 'oss-cn-beijing',
          bucket: this.token.bucket
        })
      },
      async uploadPatternImage () {
        let timeStamp = new Date().getTime()
        try {
          let pattern = 'Pattern/' + timeStamp + '.jpg'
          this.houseType.imageParse.push(pattern)
          let files = document.getElementById(this.id).files
          let file = files[0]
          if (file !== undefined) {
            this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
              let httpSrc = result.res.requestUrls[0]
              if (httpSrc.indexOf('?') !== -1) {
                httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
              }
              this.houseType.imageUrls.push(pattern)
              this.$emit('oss-child-urls', this.houseType.imageUrls)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '上传失败,请重新选择上传！！'
              })
            })
          }
        } catch (ex) {
          console.log(ex)
        }
      }
    },
    watch: {
      'houseType.imageUrls': function () {
        if (this.isSingle && this.houseType.imageUrls.length > 0) {
          this.isSingleCtrl = false
        } else {
          this.isSingleCtrl = true
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .OSSUpload {
    .uploadImg {
      margin-left: 38px;
      margin-top: 20px;
    }
    .upload-demo {
      display: inline-block;
      margin: 0 10px;
    }
    .el-upload{
      position: relative;
      .el-upload__input{
        display: block;
        opacity: 0;
        width: 100%;
        height: 100%;
        position: absolute;
        top:0;
        left: 0;
        z-index: 999;
        &:hover{
          cursor:pointer;
        }
      }
    }
  }
</style>

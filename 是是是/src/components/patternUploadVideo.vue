<template>
  <div class="OSSUpload">
    <slot>
      <div>
        <ul class="el-upload-list el-upload-list--picture-card">
          <li tabindex="0"
              class="el-upload-list__item is-success"
              v-for="(imageUrls, index) in houseType.imageUrls"
              :key="imageUrls.url">
            <!-- <img :src="imageUrls.url"
                 alt=""
                 class="el-upload-list__item-thumbnail"> -->
            <video id="video"
                   :src="imageUrls.url"
                   :poster="imageUrls.url"
                   preload="auto"
                   webkit-playsinline="true"
                   playsinline="true"
                   class="el-upload-list__item-thumbnail"
                   style="object-fit:fill">
            </video>
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"></i>
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-check"></i>
            </label>
            <i class="el-icon-close"></i>
            <i class="el-icon-close-tip">按 delete 键可删除</i>
            <span class="el-upload-list__item-actions"
                  @click="deleteImg(index)">
              <span class="el-upload-list__item-delete">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </li>
        </ul>
        <div tabindex="0"
             v-if="!houseType.imageUrls.length"
             class="el-upload el-upload--picture-card">
          <i class="el-icon-plus"></i>
          <input type="file"
                 name="file"
                 accept='video/*'
                 class="el-upload__input"
                 :id="id"
                 @change="fileChange"
                 :multiple="false">
        </div>
      </div>
    </slot>
  </div>
</template>

<script>
import { requestAliYunToken } from '../store/fetch/api'
import { Loading } from 'element-ui';
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
    name: {
      type: String,
      twoWay: false
    }
  },
  watch: {
    urls: 'urlsChange'
  },
  data () {
    return {
      houseType: {
        imageParse: [],
        imageUrls: []
      },
      token: '',
      client: ''
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
    urlsChange () {
      this.houseType.imageUrls = this.urls
    },
    deleteImg (index) {
      this.$emit('oss-delete-img', index, this.urls)
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
      try {
        let files = document.getElementById(this.id).files
        if (files !== undefined) {
          let loadingInstance = Loading.service({
            fullscreen: false,
            lock: true,
            text: '上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          Object.keys(files).map(idx => {
            let timeStamp = new Date().getTime()
            this.houseType.imageParse.push(this.name + timeStamp + '.' + files[idx]['type'].split('video/')[1])
            let file = files[idx]
            this.client.multipartUpload(this.houseType.imageParse[this.houseType.imageParse.length - 1], file).then((result) => {
              let httpSrc = result.res.requestUrls[0]
              if (httpSrc.indexOf('?') !== -1) {
                httpSrc = httpSrc.substr(0, httpSrc.indexOf('?'))
              }
              this.houseType.imageUrls.push({ url: httpSrc })
              this.$emit('oss-child-urls', this.houseType.imageParse)
              loadingInstance.close();
            }).catch(() => {
              loadingInstance.close();
              this.$message({
                type: 'info',
                message: '户型图选取上传失败,请重新选择上传！！'
              })
            })
          })
        }
      } catch (ex) {
        console.log(ex)
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
  .el-upload {
    position: relative;
    .el-upload__input {
      display: block;
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>

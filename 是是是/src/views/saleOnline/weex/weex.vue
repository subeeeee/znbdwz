<template>
  <div class="weex_wrap">
    <el-row>
      <el-col :span="24"
              class="content">
        <el-form ref="weexForm"
                 label-position="left"
                 :model="weexForm"
                 :rules="weexFormRules"
                 label-width="120px">
          <el-form-item label="背景图："
                        prop="imgUrlList">
            <p>( 推荐尺寸750px*400px，支持jpg/gif/png格式 )</p>
            <patternUpload ref='patternUploadWeex'
                           :name="'PatternWeex'"
                           :id="'PatternImageWeex'"
                           :maxNum="5"
                           :urls="ossUploadUrls"
                           @oss-child-urls="fileChange"
                           @oss-delete-img="projectFileDelete">
            </patternUpload>
          </el-form-item>
          <el-form-item label="AppId："
                        prop="appId">
            <el-col :span="12">
              <el-input v-model="weexForm.appId"
                        size="medium">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="SecretKey："
                        prop="appSecret">
            <el-col :span="12">
              <el-input v-model="weexForm.appSecret"
                        size="medium">
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="品牌介绍：">
            <el-col :span="20">
              <div id='content'></div>
            </el-col>
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
import E from 'wangeditor'
import patternUpload from '@/components/patternUpload'
import util from '@/common/js/util.js'
import * as api from '@/store/fetch/api'
import * as oss from '@/common/js/ossBaseUrl'
import { Loading } from 'element-ui'
const content = new E('#content')
export default {
  name: 'weex_wrap',
  components: {
    patternUpload
  },
  data () {
    //背景图不能为空
    let validateImgUrls = (rule, value, callback) => {
      console.info(rule)
      console.info(this.weexForm)
      console.info(callback)
      if (this.weexForm.imgUrlList.length < 1 || this.weexForm.imgUrlList.length > 5) {
        callback(new Error('请上传1-5张背景图片'))
      } else {
        callback();
      }
    }
    return {
      ossUploadUrls: [],
      delImgUrlList: [],
      weexForm: {
        imgUrlList: [],//背景图
        appId: '',//AppId
        appSecret: '',//SecretKey
        brandInfo: ''//描述
      },
      weexFormRules: {//表单验证规则
        imgUrlList: [
          { validator: validateImgUrls, required: true, trigger: ['blur', 'change'] }
        ],
        appId: [
          { required: true, message: '请输入AppId', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ],
        appSecret: [
          { required: true, message: '请输入SecretKey', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入1-100个字符', trigger: ['blur', 'change'] }
        ]
      },
      user: {}
    }
  },
  mounted () {
    this.user = JSON.parse(unescape(util.getCookie('tenantManger')))
    this.getInfo()
  },
  methods: {
    //获取小程序配置信息
    async getInfo () {
      let loadingInstance = Loading.service({ fullscreen: true })
      let htmlStr = ''
      let res = await api.getWeexInfo({
        tenantId: this.user.tenantId
      })
      if (res.data) {
        Object.assign(this.weexForm, res.data)
        let urls = []
        this.weexForm.imgUrlList.forEach((url) => {
          urls.push({ url: oss.OSS_BASE_URL + url })
        })
        this.ossUploadUrls = [...urls]
        htmlStr = res.data.brandInfo
      } else {
        res.code !== 200 && this.$message.warning(res.message)
        this.$refs.weexForm.resetFields()//置空表单项
      }
      setTimeout(() => {
        content.create()
        content.txt.html(htmlStr)
      }, 0)
      loadingInstance.close()
    },
    async projectFileDelete (index, urls) {
      // if (urls[index].imageId && urls[index].url) {
      //   const params = {
      //     imageId: urls[index].imageId,
      //     uri: urls[index].url
      //   }
      //   await api.requestRoomPatternImagesDelete(params)
      // } else {
      this.weexForm.imgUrlList.splice(index, 1)
      // }
      this.delImgUrlList.push(urls[index]['url'].split(oss.OSS_BASE_URL)[1])
      this.ossUploadUrls.splice(index, 1)

      this.$refs["weexForm"].validate((valid) => {
      })
    },
    fileChange (imgUrlList) {
      let arr = [...this.weexForm.imgUrlList, ...imgUrlList]
      let arrSet = Array.from(new Set(arr))
      this.weexForm.imgUrlList = arrSet.filter((item, index) => {
        return !this.delImgUrlList.includes(item)
      });
    },
    //表单提交
    submit () {
      this.$refs["weexForm"].validate((valid) => {
        if (valid) {
          console.log(this.weexForm)
          console.log(content.txt.html())
          // debugger
          let queryData = {
            ...this.weexForm,
            tenantId: this.user.tenantId,
            brandInfo: content.txt.html()
          }
          this.saveInfo(queryData)
        } else {
          return false
        }
      })
    },
    //保存数据
    async saveInfo (obj = {}) {
      let res = await api.saveWeexInfo(obj)
      this.$message.success('保存成功')
      // debugger
    }
  }
}
</script>
<style scoped lang="scss">
.weex_wrap {
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
<template>
  <div class="flow_wrap">
    <el-row>
      <el-col :span="24"
              class="title">
        认购流程设置
      </el-col>
      <el-col :span="24"
              class="content">
        <div class="step">
          <el-tag type="">基础信息</el-tag>
          <el-tag v-for="(tag,index) in dynamicTags"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="delNode(index,tag)">
            {{tag.name}}
          </el-tag>
          <el-dropdown type="primary"
                       size="medium"
                       v-if="dynamicTags.length < 3"
                       @command="addNewNode">
            <el-button type="primary"
                       size="medium">
              新增流程<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(tag,index) in tagsListCopy"
                                :key="index"
                                :command='tag.value'>
                {{tag.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-tag type="">认购完成</el-tag>
        </div>
        <div class="tips">
          <div class="icon">
            <i class="el-icon-question"></i>
          </div>
          <div class="desc">
            <p>
              1.如果认购流程包含签署协议，请先完成 <u @click="$router.push('/sale/sign')">签约配置</u><br />
              2.如果认购流程包含费用缴纳，请先完成 <u @click="$router.push('/sale/pay')">支付配置</u><br />
              3.选定房源为签署协议的必要前置流程
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="24"
              class="title">
        认购规则配置
      </el-col>
      <el-col :span="12"
              class="content">
        <el-form ref="flowForm"
                 label-position="left"
                 :model="flowForm"
                 :rules="flowFormRules"
                 label-width="120px">
          <el-form-item label="单人认购套数："
                        prop="subscribeAmount">
            <el-input v-model="flowForm.subscribeAmount"
                      type="number"
                      size="medium">
              <template slot="append">套数</template>
            </el-input>
          </el-form-item>
          <el-form-item label="认购费用："
                        v-if="showPayAmount"
                        prop="payAmount">
            <el-input v-model="flowForm.payAmount"
                      size="medium">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="认购时限："
                        prop="subscribeLimitTime">
            <el-input v-model="flowForm.subscribeLimitTime"
                      size="medium">
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否启用："
                        prop="enabled">
            <el-switch v-model="flowForm.enabled"
                       :active-value="1"
                       :inactive-value="0"
                       active-text=""
                       inactive-text="">
            </el-switch>
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
// import util from '@/common/js/util.js'
import { Loading } from 'element-ui'
import * as api from '@/store/fetch/api'
export default {
  name: 'flow_wrap',
  data () {
    //小数点两位验证
    let floatValidator = (rule, value, callback) => {
      if (value === 0 || value === "0") {
        callback(new Error("请输入7位整数或带两位小数的10位数字"))
      } else if (value) {
        let reg = /(^[1-9]([0-9]{0,6})$)|(^[0-9]([0-9]{0,6})(\.[0-9]{0,2})?$)/;
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error("请输入7位整数或带两位小数的10位数字"))
        }
      } else {
        callback()
      }
    }
    //整数验证-单人认购套数
    let numberValidator = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入[0,10]之间的数字'))
      } else if (Number(value) >= 0 && Number(value) <= 10 && (/^(0|[1-9][0-9]*)$/.test(value))) {
        callback()
      } else {
        callback(new Error('请输入[0,10]之间的数字'))
      }
    }
    //整数验证-签约认购时限
    let number1Validator = (rule, value, callback) => {
      if (value === '' || value === undefined || value === null) {
        callback(new Error('请输入[0,1440]之间的数字'))
      } else if (Number(value) >= 0 && Number(value) <= 1440 && (/^(0|[1-9][0-9]*)$/.test(value))) {
        callback()
      } else {
        callback(new Error('请输入[0,1440]之间的数字'))
      }
    }
    return {
      tagsList: [{
        name: '选定房源',
        value: '2'
      }, {
        name: '费用缴纳',
        value: '3'
      }, {
        name: '签署协议',
        value: '4'
      }],
      projectId: '',//项目id
      tagsListCopy: [],
      dynamicTags: [],
      flowForm: {
        subscribeAmount: 0,//单人认购套数
        payAmount: '',//签约认购金
        subscribeLimitTime: 0,//签约认购时限
        enabled: 0
      },
      flowFormRules: {//表单验证规则
        subscribeAmount: [
          { required: false, message: '请输入单人认购套数', trigger: 'blur' },
          { validator: numberValidator, trigger: ['blur', 'change'] }
        ],
        payAmount: [
          { required: false, message: '请输入认购费用', trigger: 'blur' },
          { validator: floatValidator, trigger: ['blur', 'change'] }
        ],
        subscribeLimitTime: [
          { required: false, message: '请输入认购时限', trigger: 'blur' },
          { validator: number1Validator, trigger: ['blur', 'change'] }
        ]
      },
      showPayAmount: false
    }
  },
  mounted () {
    this.tagsListCopy = [...this.tagsList]
    this.projectId = sessionStorage.getItem('projectId')//获取已选择的项目id
    // let user = JSON.parse(unescape(util.getCookie('tenantManger')))
    this.projectId && this.getInfo({
      projectId: this.projectId
    })
  },
  methods: {
    //根据项目id获取流程配置信息
    async getInfo (obj = {}) {
      this.tagsListCopy = [...this.tagsList]
      this.showPayAmount = false
      let loadingInstance = Loading.service({ fullscreen: true })
      let res = await api.getFlowInfoByProjectId(obj)
      if (res.data) {
        this.projectId = obj.projectId
        Object.assign(this.flowForm, res.data)
        let step = res.data.subscribeProcess.split(',')
        step = step.slice(1, step.length - 1)
        step.includes('3') && (this.showPayAmount = true)
        //动态维护可选列表
        this.tagsListCopy = this.tagsList.filter(item => !step.includes(item.value));

        let arr = []
        step[0] && step.forEach((item, index) => {
          arr.push(this.tagsList.find(val => {
            return val.value === item
          }))
        })
        // let arr = this.tagsList.filter((item, index) => {
        //   if (step.indexOf(item.value) !== -1) {
        //     //动态维护可选列表
        //     this.tagsListCopy = this.tagsListCopy.filter(val => {
        //       return val.value !== item.value
        //     })
        //     item.value === '3' && (this.showPayAmount = true)
        //     return true
        //   }
        // })
        this.dynamicTags = [...arr]
      } else {
        res.code !== 200 && this.$message.warning(res.message)
        this.flowForm.id = ''
        this.dynamicTags = []
        this.$refs.flowForm.resetFields()//置空表单项
      }
      loadingInstance.close()
    },
    //新增节点
    addNewNode (value) {
      if (value && this.dynamicTags.length < 3) {
        let arr = this.tagsList.filter((item, index) => {
          if (item.value === value) {
            value === '3' && (this.showPayAmount = true)
            //动态维护可选列表
            this.tagsListCopy = this.tagsListCopy.filter(val => {
              return val.value !== value
            })
            return true
          }
        })
        this.dynamicTags.push(arr[0])
      }
    },
    //删除节点
    delNode (index, obj = {}) {
      //删除已选列表的元素
      this.dynamicTags.splice(index, 1)
      //动态维护可选列表
      this.tagsList.map((item, subIndex) => {
        if (item.value === obj.value) {
          obj.value === '3' && (this.showPayAmount = false)
          this.tagsListCopy.splice(index, 0, this.tagsList[subIndex])
        }
      })
    },
    //表单提交
    submit () {
      this.$refs["flowForm"].validate((valid) => {
        if (valid) {
          console.log(this.dynamicTags)
          console.log(this.flowForm)
          if (!this.projectId) {
            this.$message.warning('请选择项目！')
            return
          }
          let arr = this.dynamicTags.map(item => {
            return item.value
          })
          let subscribeProcess = arr.length > 0 ? ('1,' + arr.join(',') + ',5') : '1,5'
          let queryData = {
            ...this.flowForm,
            projectId: this.projectId,
            subscribeProcess: subscribeProcess
          }

          let lock = false
          if (arr.indexOf('4') !== -1) {//如果有步骤4，必须有2，且2在4的之前
            if (arr.indexOf('2') !== -1 && arr.indexOf('4') > arr.indexOf('2')) {
              lock = true
            } else {
              lock = false
            }
          } else {
            lock = true
          }
          if (arr.indexOf('3') === -1) {//如果流程中包含在线支付3。则支付金额>0
            delete queryData.payAmount
          }

          if (lock) {
            this.saveInfo(queryData)
          } else {
            // MessageBox.alert('如果有步骤4"签署协议"，必须有步骤2"选定房源"，且步骤2在步骤4之前。', {
            //   confirmButtonText: '确定',
            //   callback: action => {
            //     if (action === 'confirm') {
            //       // window.location.reload()
            //     }
            //   }
            // })
            this.$message.warning('如果有“签署协议”步骤，则必须有“选定房源”步骤且“选定房源”步骤必须在“签署协议”步骤前面。')
          }
        } else {
          return false
        }
      })
    },
    //保存数据
    async saveInfo (obj = {}) {
      let handle = (code = 200, message = '') => {
        if (code === 200) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(message || '接口错误')
        }
      }
      let res = null
      if (this.flowForm.id) {//编辑
        res = await api.updateFlowInfo(obj)
        handle(res.code, res.message)
      } else {//新增
        res = await api.saveFlowInfo(obj)
        handle(res.code, res.message)
      }
    }
  }
}
</script>

<style lang="scss">
.el-dropdown-menu--medium .el-dropdown-menu__item {
  line-height: 36px;
}
.flow_wrap {
  .el-tag {
    background-color:rgba(229,245,255,1);
    & + .el-tag {
      margin-left: 24px;
    }
    &.el-tag--mini {
      height: 36px;
      line-height: 34px;
      padding: 0 12px;
    }
  }
}
</style>
<style scoped lang="scss">
.flow_wrap {
  .title {
    line-height: 50px;
    font-weight: 600;
    padding-bottom: 16px;
    & + .el-tag {
      margin-top: 24px;
    }
  }
  .content {
    padding-left: 48px;
    .step {
      width: auto;
      display: inline-block;
      position: relative;
      margin-bottom: 16px;
      &:before {
        content: "";
        width: 100%;
        height: 2px;
        background-color: #e3e3e5;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto 0;
        z-index: -1;
      }
      .el-tag {
        & + .el-tag {
          margin-left: 24px;
        }
      }
      .el-dropdown {
        margin: 0 24px;
      }
    }
    .tips {
      clear: both;
      width: auto;
      position: relative;
      margin-bottom: 16px;
      .icon {
        vertical-align: top;
        padding-top: 3px;
        display: inline-block;
        i {
          color: grey;
        }
      }
      .desc {
        display: inline-block;
        padding-left: 8px;
        em {
          font-style: normal;
        }
        u {
          color: red;
          cursor: pointer;
        }
      }
    }
  }
  .submit {
    margin-top: 24px;
    margin-bottom: 24px;
  }
}
</style>

<template>
  <div id="DataSynchronization" class="dataSynchronization">
    <el-row>
      <el-col :span="12" class="synchronizationForm">
        <el-form :model="synchronizationForm" :rules="synchronizationFormRules" ref="synchronizationRuleForm" >
          <el-row>
            <el-col :span="20">
              <el-form-item label="数据同步是否启用：" :label-width="formLabelWidth">
                <el-radio v-model="synchronizationForm.is_use" label="1" @change='synchronizationChange'>是</el-radio>
                <el-radio v-model="synchronizationForm.is_use" label="0" @change='synchronizationChange'>否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="是否定时同步房源：" :label-width="formLabelWidth">
                <el-radio v-model="synchronizationForm.is_cron" :disabled="synchronizationForm.is_use === '0'" label="1">开启</el-radio>
                <el-radio v-model="synchronizationForm.is_cron" label="0">关闭</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="是否定时同步顾问信息：" :label-width="formLabelWidth">
                <el-radio v-model="synchronizationForm.is_member_cron" :disabled="synchronizationForm.is_use === '0'" label="1">是</el-radio>
                <el-radio v-model="synchronizationForm.is_member_cron" label="0">否</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="ERP类型：" :label-width="formLabelWidth">
                <el-select v-model="synchronizationForm.erp_type" :disabled='synchronizationForm.is_use === "0"'>
                  <el-option
                    v-for="item in erpList"
                    :key="item.erp_type"
                    :label="item.erp_name"
                    :value="item.erp_type">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据同步接口地址：" :label-width="formLabelWidth" prop='interface_url'>
                <el-input :disabled='synchronizationForm.is_use === "0"' v-model="synchronizationForm.interface_url" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据同步APPID：" :label-width="formLabelWidth">
                <el-input :disabled='synchronizationForm.is_use === "0"' v-model="synchronizationForm.ticket1" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据同步Secret Key：" :label-width="formLabelWidth">
                <el-input :disabled='synchronizationForm.is_use === "0"' v-model="synchronizationForm.ticket2" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if='synchronizationForm.erp_type === "1"'>
              <el-form-item label="租户：" :label-width="formLabelWidth">
                <el-input :disabled='synchronizationForm.is_use === "0"' v-model="synchronizationForm.ticket3" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据同步用户名：" :label-width="formLabelWidth">
                <el-input :disabled='synchronizationForm.is_use === "0"' v-model="synchronizationForm.user_name" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="数据同步密码：" :label-width="formLabelWidth">
                <el-input :disabled='synchronizationForm.is_use === "0"' v-model="synchronizationForm.password" auto-complete="off" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20" class="preservation">
              <el-button type="primary" @click='preservation'>保 存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-col :span="20" class="interfaceTest">
          <el-button type="primary" size='small' @click='testErpInterface'>接口测试</el-button>
        </el-col>
        <el-col :span='20'>
          <div class='interfaceTestResult'>
            <p v-for='(result, index) in interfaceTestResult' :key='index'>{{ result }}</p>
          </div>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { requestSaveErpConfig, requestGetErpConfig, requestTestErpInterface } from '../../store/fetch/api'
  import { validateHttpUrl } from '../../common/js/formValidation'
  export default {
    name: 'DataSynchronization',
    data () {
      return {
        formLabelWidth: '200px',
        erpList: [
          {
            erp_type: '1',
            erp_name: '巨洲云ERP'
          },
          {
            erp_type: '2',
            erp_name: '明源ERP（WebService版）'
          },
          {
            erp_type: '3',
            erp_name: '明源ERP（HTTP版）'
          }
        ],
        synchronizationForm: {
          tenant_id: this.user.tenantId,
          create_user_id: this.user.createUserId,
          last_modify_user_id: this.user.lastModifyUserId,
          is_use: '0',
          is_cron: '0',
          is_member_cron: '0',
          erp_type: '1',
          interface_url: '',
          ticket1: '',
          ticket2: '',
          ticket3: '',
          user_name: '',
          password: ''
        },
        synchronizationFormRules: {
          interface_url: [{ required: true, validator: validateHttpUrl, trigger: 'blur' }]
        },
        interfaceTestResult: []
      }
    },
    props: ['user'],
    created () {
      this.getErpConfig()
    },
    methods: {
      async getErpConfig () {
        const result = await requestGetErpConfig(this.user.tenantId)
        this.synchronizationForm = {
          tenant_id: this.user.tenantId,
          create_user_id: this.user.createUserId,
          last_modify_user_id: this.user.lastModifyUserId,
          is_use: result.data.is_use ? result.data.is_use.toString() : '0',
          is_cron: result.data.is_cron ? result.data.is_cron.toString() : '0',
          is_member_cron: result.data.is_member_cron ? result.data.is_member_cron.toString() : '0',
          erp_type: result.data.erp_type ? result.data.erp_type.toString() : '1',
          interface_url: result.data.interface_url ? result.data.interface_url : '',
          ticket1: result.data.ticket1 ? result.data.ticket1 : '',
          ticket2: result.data.ticket2 ? result.data.ticket2 : '',
          ticket3: result.data.ticket3 ? result.data.ticket3 : '',
          user_name: result.data.user_name ? result.data.user_name : '',
          password: result.data.password ? result.data.password : ''
        }
        if (this.synchronizationForm.is_use === '0') {
          this.synchronizationFormRules.interface_url[0].required = false
        }
      },
      preservation () {
        this.$refs.synchronizationRuleForm.validate(async(valid) => {
          if (valid) {
            await requestSaveErpConfig(this.synchronizationForm)
            this.$message.success('保存成功')
          } else {
            return false
          }
        })
      },
      synchronizationChange (checked) {
        if (checked === '0') {
          this.synchronizationFormRules.interface_url[0].required = false
          this.synchronizationForm.is_cron = '0'
          this.synchronizationForm.is_member_cron = '0'
        } else {
          this.synchronizationFormRules.interface_url[0].required = true
        }
        this.$refs.synchronizationRuleForm.clearValidate()
      },
      testErpInterface () {
        this.$refs.synchronizationRuleForm.validate(async(valid) => {
          if (valid) {
            this.interfaceTestResult.push('开始测试接口，请耐心等待...')
            // let urlReg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/
            // let interfaceUrl = urlReg.exec(this.synchronizationForm.interface_url)
            const params = {
              interface_url: this.synchronizationForm.interface_url,
              erp_type: this.synchronizationForm.erp_type,
              ticket1: this.synchronizationForm.ticket1,
              ticket2: this.synchronizationForm.ticket2,
              ticket3: this.synchronizationForm.ticket3
            }
            const result = await requestTestErpInterface(params)
            this.interfaceTestResult.push(result.data)
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .dataSynchronization {
    margin-top: 20px;
    .synchronizationForm {
      margin-top: 20px;
    }
    .preservation {
      text-align: right;
      margin-bottom: 20px;
    }
    .interfaceTest{
      margin: 20px 0;
    }
    .interfaceTestResult{
      width: 100%;
      min-height: 250px;
      max-height: 250px;
      overflow-y: scroll;
      border: 1px solid #ccc;
      padding: 10px;
      p{
        font-size: 12px;
        line-height: 24px;
      }
    }
  }
</style>

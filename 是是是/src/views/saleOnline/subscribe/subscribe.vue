<template>
  <div class="subscribe_wrap">
    <el-table ref="multipleTable"
              :data="list"
              style="width: 100%"
              highlight-current-row
              @row-click="rowClick">
      <el-table-column type="index"
                       width="50">
      </el-table-column>
      <el-table-column prop="projectName"
                       label="所属项目"
                       min-width="160">
        <template slot-scope="scope">
          <span :title="scope.row.projectName">{{ scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName"
                       label="客户名称"
                       width="130">
        <template slot-scope="scope">
          <span :title="scope.row.customerName">{{ scope.row.customerName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别"
                       width="50">
        <template slot-scope="scope">
          <span :title="scope.row.sex">{{ scope.row.sex===1 ? '男':'女'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mobile"
                       label="手机号码"
                       width="100">
        <template slot-scope="scope">
          <span :title="scope.row.mobile">{{ scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="identityNo"
                       label="身份证号码"
                       width="140">
        <template slot-scope="scope">
          <span :title="scope.row.identityNo">{{ scope.row.identityNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="roomName"
                       label="认购房源"
                       width="100">
      </el-table-column>
      <el-table-column prop="signStatus"
                       label="签约状态"
                       width="80">
        <template slot-scope="scope">
          <span :class="{hover:scope.row.signStatus===1}"
                @click="showProtocol(scope.row)">{{ scope.row.signStatus | formatSignStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payStatus"
                       label="支付状态"
                       width="80">
        <template slot-scope="scope">
          <span :class="{hover:scope.row.payStatus===1}"
                @click="showPayment(scope.row)">{{ scope.row.payStatus | formatPayStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subscribeStatus"
                       label="签约认购状态"
                       width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.subscribeStatus | formatSubscribeStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       label="签约认购时间"
                       width="150"
                       sortable="createTime">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDateByMoment }}
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24">
      <div class="block">
        <el-pagination @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNum"
                       :page-sizes="[10, 50, 100, 200]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="dataTotal">
        </el-pagination>
      </div>
    </el-col>
    <!--协议详情-->
    <el-dialog ref='dialog'
               :width="payInfo?'50%':'75%'"
               :title="dailogTitle"
               :visible.sync="dialogVisible"
               top="10vh"
               @close="dialogClose">
      <el-row>
        <el-col :span="24"
                v-if="payInfo"
                class="payInfo">
          <el-form ref="payInfoForm"
                   :model="payInfoForm"
                   label-width="120px">
            <el-form-item label="支付编号："
                          prop="orderNo">
              <span>{{payInfoForm.orderNo}}</span>
            </el-form-item>
            <el-form-item label="姓名："
                          prop="customerName">
              <span>{{payInfoForm.customerName}}</span>
            </el-form-item>
            <el-form-item label="证件号："
                          prop="identityNo">
              <span>{{payInfoForm.identityNo}}</span>
            </el-form-item>
            <el-form-item label="认购房源："
                          prop="roomName">
              <span>{{payInfoForm.roomName}}</span>
            </el-form-item>
            <el-form-item label="认购金额："
                          prop="payAmount">
              <span>{{payInfoForm.payAmount}} 元</span>
            </el-form-item>
            <el-form-item label="交易时间："
                          prop="createTime">
              <span>{{payInfoForm.createTime}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24"
                v-else>
          <iframe id="show_iframe"
                  frameborder=0
                  name="showHere"
                  scrolling=auto
                  width="100%"
                  height="500px"
                  :src="iframeUrl"></iframe>
        </el-col>
      </el-row>
      <div slot="footer"
           class="dialog-footer">
        <el-button class="dialog_foot_button"
                   @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import moment from 'moment'
import { formatDate } from '@/common/js/date.js'
import * as api from '@/store/fetch/api'
export default {
  name: 'subscribe_wrap',
  props: {
    projectNameActive: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      list: [],//客户列表
      dialogVisible: false,
      payInfo: false,
      dailogTitle: '查看协议',
      subscribeStatus: null,
      pageTotal: 1,   //总页数
      pageNum: 1,      //当前页数
      pageSize: 10, //分页大小,每页多少条
      dataTotal: 0,   //数据总条数
      payInfoForm: {
        orderNo: '',
        customerName: '',
        identityNo: '',
        roomName: '',
        payAmount: '',
        createTime: ''
      },
      iframeUrl: ''
    }
  },
  filters: {
    formatSignStatus (value) {
      //签约等级：0未签约、1已签约
      switch (value) {
        case 0:
          return '未签约'
        case 1:
          return '查看协议'
        default:
          return '--'
      }
    },
    formatPayStatus (value) {
      //支付状态 ：0未支付、1已支付
      switch (value) {
        case 0:
          return '未支付'
        case 1:
          return '支付详情'
        default:
          return '--'
      }
    },
    formatSubscribeStatus (value) {
      //签约认购状态 ：0未认购、1认购中、2已完成、3已取消
      // 1~4 都是 认购中  5. 已完成  0 已取消
      switch (value) {
        case 0:
          return '已取消'
        case 1:
          return '认购中'
        case 2:
          return '认购中'
        case 3:
          return '认购中'
        case 4:
          return '认购中'
        case 5:
          return '已完成'
        default:
          return '--'
      }
    },
    formatDateByMoment (value) {
      return moment(value).format("YYYY-MM-DD HH:mm:ss")
    }
  },
  mounted () {
    this.projectId = sessionStorage.getItem('projectId')//获取已选择的项目id
    // let user = JSON.parse(unescape(util.getCookie('tenantManger')))
    this.projectId && this.getInfo({
      projectId: this.projectId,
      subscribeStatus: this.subscribeStatus
    })
  },
  methods: {
    //行点击事件
    rowClick (row, event, column) {
      // this.$router.push({
      //   path: '/task/detail/' + row.sid
      // })
    },
    //保存数据
    async getInfo (obj = {}) {
      //  { "param": { "payKey": "42268", "paySecret": "4" }, "pageNum": 0, "pageSize": 10 }
      let queryData = {
        param: {
          ...obj
        },
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      this.subscribeStatus = obj.subscribeStatus
      if (this.subscribeStatus === 1) {
        queryData.param.subscribeStatusList = ['1', '2', '3', '4']
      } else if ('0,5'.split(',').indexOf('' + this.subscribeStatus) !== -1) {
        queryData.param.subscribeStatusList = ['' + this.subscribeStatus]
      }
      delete queryData.param.subscribeStatus
      let res = await api.getSubscribeList(queryData)
      // debugger
      if (res.data) {
        this.projectId = obj.projectId
        this.dataTotal = +res.data.total
        this.list = [...res.data.list]
      } else {
        this.$message.warning(res.message)
        this.list = []
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      const obj = {
        projectId: this.projectId,
        subscribeStatus: this.subscribeStatus
      }
      this.getInfo(obj)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      const obj = {
        projectId: this.projectId,
        subscribeStatus: this.subscribeStatus
      }
      this.getInfo(obj)
    },
    // dialog关闭
    dialogClose () {
      // if (this.editBuilding) {
      //   this.$refs.editBuildingRuleForm.clearValidate()
      // } else if (this.editHousing) {
      //   this.$refs.editHousingRuleForm.clearValidate()
      // }
      this.dialogVisible = false
    },
    //查看协议
    async showProtocol (obj = {}) {
      if (obj.signStatus === 1) {
        this.payInfo = false
        this.dailogTitle = '查看协议'
        let queryData = {
          id: obj.id,
          projectId: obj.projectId,
          customerId: obj.customerId
        }
        let res = await api.getSignDetail(queryData)
        // const oIframe = document.getElementById('show_iframe')
        // const deviceWidth = document.documentElement.clientWidth
        // const deviceHeight = document.documentElement.clientHeight
        // oIframe.style.width = deviceWidth + 'px'
        // oIframe.style.height = deviceHeight + 'px'
        // this.iframeUrl = 'https://cloudapi.qiyuesuo.cn/contract/share/2678546040109404532?authqid=6024725f-15ba-4dca-a209-ef2339261526'
        if (res.code === 200) {
          this.dialogVisible = true
          this.iframeUrl = res.data.contractUrl
        } else {
          this.$message.error(res.message || '接口错误')
        }
      }
    },
    //查看支付详情
    async showPayment (obj = {}) {
      if (obj.payStatus === 1) {
        this.payInfo = true
        this.dailogTitle = '支付详情'
        this.dialogVisible = true
        let queryData = {
          subscribeId: obj.id
        }
        let res = await api.getPayDetail(queryData)
        res.data && (res.data instanceof Object) && Object.assign(this.payInfoForm, res.data)
        // debugger
        this.payInfoForm.customerName = obj.customerName
        this.payInfoForm.identityNo = obj.identityNo
        this.payInfoForm.roomName = obj.roomName
      }
    },
    //导出认购
    globalExport (result, templateName) {
      const content = result
      const blob = new Blob([content])
      const fileName = `${templateName}.xlsx`
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName)
      }
    },
    //导出接口调用
    async exportExcel () {
      if (!this.projectId) {
        this.$message.info('请选择一个项目')
        return false
      } else {
        let queryData = {
          module: 'subscribe',
          projectId: this.projectId
        }
        if (this.subscribeStatus === 1) {
          queryData.subscribeStatusList = ['1', '2', '3', '4']
        } else if ('0,5'.split(',').indexOf('' + this.subscribeStatus) !== -1) {
          queryData.subscribeStatusList = ['' + this.subscribeStatus]
        }
        const result = await api.excelExportSubscribe(queryData)
        const date = new Date()
        const currentTime = formatDate(date, 'yyyyMMdd_hhmmss')
        this.globalExport(result, `${this.projectNameActive}_认购列表_${currentTime}`)
        this.$message.success('导出认购列表成功')
      }
    }
  }
}
</script>
<style lang="scss">
.el-dialog .el-dialog__body {
  border-top: 1px solid #e4e7ed !important;
}
</style>
<style scoped lang="scss">
.subscribe_wrap {
  .hover {
    &:hover {
      color: red;
      cursor: pointer;
    }
  }
  .block {
    text-align: right;
    margin: 24px 0;
  }
}
</style>
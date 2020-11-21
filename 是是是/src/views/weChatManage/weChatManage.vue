<template>
  <div id="WeChatManage" class="weChatManage">
    <div :class="iphonePreview ? 'iphone iphoneShow' : 'iphone'">
      <div class="iphone-top">
        <span class="camera"></span>
        <span class="sensor"></span>
        <span class="speaker"></span>
      </div>
      <div class="top-bar"></div>
      <div class="iphone-screen">
        <div class='weChatContent'>
          <p>点击home 键可返回</p>
        </div>
        <div class='weChatMenuBox'>
          <div class='weChatMenu' v-for='(menu, index) in weChatMenuList' :key='index'>
            <el-dropdown trigger="click" placement='top-end'>
              <span class="el-dropdown-link">
                {{ menu.name }}<i v-if='menu.sub_button.length' class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for='(subMenu, index) in menu.sub_button' :key='index'>{{ subMenu.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="buttons">
        <span class="on-off"></span>
        <span class="sleep"></span>
        <span class="up"></span>
        <span class="down"></span>
      </div>
      <div class="bottom-bar"></div>
      <div class="iphone-bottom">
        <span @click='iphonePreview = false;'></span>
      </div>
    </div>
    <el-row type="flex" justify="space-between">
      <el-col :span="10" style='position: relative;'>
        <LabelTitle :title="'项目列表'"></LabelTitle>
        <el-button class='authorizationList' type="primary" @click="weChatAuthorizationList">授权列表</el-button>
        <el-button class='authorization' type="primary" @click="weChatAuthorization">授权</el-button>
        <el-col :span="24">
          <ul class="projects">
            <li v-for="project in projects" :key="project.projectId" :class="project.active ? 'active' : ''">
              <span @click="roomBriefClick(project.projectId, project)">{{ project.name }}</span>
              <div class="buttons">
                <el-button type="text" @click='bindAppId(project.projectId)'>{{project.weiXinAppId ? '更改App ID' : '绑定App ID' }}</el-button>
                <el-button type="text" v-if="project.weiXinAppId" @click='viewAppInfo(project)'>查看公众号</el-button>
              </div>
            </li>
          </ul>
        </el-col>
      </el-col>
      <el-col :span='10' :offset="4" class='weChatConfig'>
        <el-col :span='24' class='alignRight'>
          <el-button type="primary" :disabled='!addWeChatMenuAppId' @click='appendStairNav'>新增一级菜单</el-button>
          <el-button type="primary" :disabled='!addWeChatMenuAppId' @click='iphonePreview = true;'>预览</el-button>
          <el-button type="primary" :disabled='!isListItemDraged' v-if="isListItemDraged" @click='saveDropListAction'>保存</el-button>
        </el-col>
        <el-col :span='24'>
          <el-tree
            class='weChatMenuTree'
            :data="weChatMenuList"
            node-key="id"
            default-expand-all
            :props='defaultProps'
            @node-drag-start="handleDragStart"
            @node-drag-enter="handleDragEnter"
            @node-drag-leave="handleDragLeave"
            @node-drag-over="handleDragOver"
            @node-drag-end="handleDragEnd"
            @node-drop="handleDrop"
            :allow-drag="allowDrag"
            draggable
            :expand-on-click-node="false">
            <span class="tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  type="text"
                  size="mini"
                  v-if="node.level==1"
                  @click.stop="append(data)">
                  增加
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="edit(node, data)">
                  编辑
                </el-button>
                <el-button
                  type="text"
                  size="mini"
                  @click.stop="remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-col>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      @close='dialogClose'
      width="35%">
      <el-form :model="weChatMenuRuleForm" :rules="weChatMenuRules" ref="weChatMenuRuleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="标题：" prop="name">
          <el-input v-model="weChatMenuRuleForm.name" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="url">
          <el-input type="textarea" autosize v-model="weChatMenuRuleForm.url" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addWeChatMenu">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权列表 -->
    <el-dialog class="dialog-authorization-table" title="授权列表" :visible.sync="dialogTableVisible">
      <el-table style="width: 100%" height="450" border stripe :data="weChatAuthorizationListData">
        <el-table-column fixed type="index" label="#" width="100"></el-table-column>
        <el-table-column property="projectName" label="项目"></el-table-column>
        <el-table-column property="nickName" label=" 公众号"></el-table-column>
        <el-table-column property="authorizerAppid" label="APPID"></el-table-column>
        <el-table-column label="QR Code" width="150">
          <template slot-scope="scope">
            <img class="qr-code" :src="`http://img04.sogoucdn.com/net/a/04/link?appid=100520033&url=${scope.row.qrcodeUrl}`" alt="">
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="authorization-control"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="listPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalListData">
      </el-pagination>
      <div class="bottom">
        <el-button type="primary" @click='dialogTableVisible = false;'>确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import LabelTitle from '../../components/LabelTitle'
  import { validateHttpUrl, promptInputUrlValidator, validateWeChatMenuFourteen, validateWeChatMenuEight } from '../../common/js/formValidation'
  import {
    weChatGoAuthor,
    requestWeChatMenu,
    requestWeChatCreateMenu,
    requestWeChatManagerProjectTenant,
    requestWeChatManagerProjectBinder,
    requestWeChatName,
    requestWeChatAuthorizationList
  } from '../../store/fetch/api'
  const circleJSON = require('circular-json')
  export default {
    name: 'WeChatManage',
    data () {
      return {
        title: '新增菜单',
        successMessage: '',
        isSubmit: true,
        dialogVisible: false,
        dialogTableVisible: false,
        weChatAuthorizationListData: [],
        iphonePreview: false,
        weChatMenuEdit: false,
        weChatUrl: '',
        weChatAppId: '',
        addWeChatMenuAppId: '',
        nowDraggingNode: null,
        projectId: '',
        projects: [],
        weChatMenuList: [],
        beforeDragedList: [],
        selectedNode: null,
        editInfo: null,
        isListItemDraged: false,
        canAllowDrag: true,
        defaultProps: {
          children: 'sub_button',
          label: 'name'
        },
        weChatMenuRuleForm: {
          name: '',
          url: '',
          type: 'view',
          sub_button: []
        },
        weChatMenuRules: {
          name: [{ required: true, validator: validateWeChatMenuFourteen, trigger: 'blur' }],
          url: [{ required: true, validator: validateHttpUrl, trigger: 'blur' }]
        },
        listPageSize: 10,
        currentPage: 1,
        totalListData: null
      }
    },
    props: ['user'],
    components: {
      LabelTitle
    },
    created () {
      this.getWeChatProject()
      this.weChatOpen()
    },
    methods: {
      async weChatOpen () {
        const reuslt = await weChatGoAuthor(this.user.tenantId)
        this.weChatUrl = reuslt.url
      },
      async getWeChatProject () {
        let result = null
        if (this.user.type === 0) {
          result = await requestWeChatManagerProjectTenant({ tenantId: this.user.tenantId })
        } else {
          result = await requestWeChatManagerProjectTenant({ tenantId: this.user.tenantId, managerId: this.user.managerId })
        }
        this.projects = result.data
      },
      async weChatProjectBinder () {
        const params = {
          projectId: this.projectId,
          appId: this.weChatAppId
        }
        await requestWeChatManagerProjectBinder(params)
        this.$message.success('绑定AppId成功')
        this.getWeChatProject()
      },
      async getWeChatMenu (appId) {
        let result = []
        if (appId) {
          result = await requestWeChatMenu(appId)
        }
        result.menu && result.menu.button[0] && result.menu.button[0].name ? this.weChatMenuList = result.menu.button : this.weChatMenuList = []
      },
      async weChatCreateMenu () {
        if (this.weChatMenuEdit) {
          this.editInfo.children[this.editInfo.index].name = this.weChatMenuRuleForm.name
          this.editInfo.children[this.editInfo.index].url = this.weChatMenuRuleForm.url
          this.successMessage = '修改菜单成功'
        } else if (this.selectedNode) {
          this.weChatMenuList.forEach((item) => {
            if (item.name === this.selectedNode.name) {
              item.sub_button.push(this.weChatMenuRuleForm)
            }
          })
          this.successMessage = '新增二级菜单成功'
        } else {
          this.weChatMenuList.push(this.weChatMenuRuleForm)
          this.successMessage = '新增一级菜单成功'
        }
        await requestWeChatCreateMenu(this.addWeChatMenuAppId, {button: this.weChatMenuList})
        this.getWeChatMenu(this.addWeChatMenuAppId)
        this.$message.success(this.successMessage)
        this.dialogVisible = false
      },
      bindAppId (projectId) {
        this.projectId = projectId
        this.$prompt('请输入正确的App ID', '绑定App ID(请授权后再进行绑定!)', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\S{18,18}$/,
          inputErrorMessage: 'App ID为十八位字符'
        }).then(({ value }) => {
          this.weChatAppId = value
          this.weChatProjectBinder()
        })
      },
      async viewAppInfo (project) {
        const h = this.$createElement
        const name = await requestWeChatName(project.weiXinAppId)
        this.$msgbox({
          title: '公众号信息',
          message: h('p', null, [
            h('p', { style: 'color: #aaa' }, `APP ID： ${project.weiXinAppId}`),
            h('p', { style: 'color: #aaa' }, `公众号名称：${name}`)
          ]),
          confirmButtonText: '确定'
        })
      },
      async weChatAuthorizationList () {
        this.dialogTableVisible = true
        const tableList = await requestWeChatAuthorizationList(this.currentPage, this.listPageSize, this.user.tenantId)
        this.currentPage = tableList.data.currentPage
        this.totalListData = tableList.data.recordTotal
        this.weChatAuthorizationListData = tableList.data.content
      },
      roomBriefClick (projectId, project) {
        this.isListItemDraged = false
        if (project) {
          this.$nextTick(() => {
            this.projects.forEach(function (project) {
              Vue.set(project, 'active', false)
            })
            Vue.set(project, 'active', true)
            this.addWeChatMenuAppId = project.weiXinAppId
            this.getWeChatMenu(project.weiXinAppId)
          })
        }
      },
      addWeChatMenu () {
        this.$refs.weChatMenuRuleForm.validate((valid) => {
          if (valid) {
            this.weChatCreateMenu()
          } else {
            return false
          }
        })
      },
      appendStairNav () {
        if (this.weChatMenuList.length >= 3) {
          this.$message.info('一级菜单不能超过三个')
        } else {
          this.title = '新增菜单'
          this.weChatMenuRules.url[0].required = false
          this.weChatMenuRules.name[0].validator = validateWeChatMenuEight
          this.dialogVisible = true
        }
      },
      append (data) {
        if (data.sub_button.length >= 5) {
          this.$message.info('二级菜单不可超过五个')
        } else {
          this.title = '新增菜单'
          this.dialogVisible = true
          this.selectedNode = data
        }
      },
      async remove (node, data) {
        const parent = node.parent
        const children = parent.data.sub_button || parent.data
        const index = children.findIndex(d => d.name === data.name)
        this.isSubmit = true
        if (parent.childNodes.length === 1) {
          this.isSubmit = false
          this.$prompt('请输入地址', '清空二级菜单需要设置一级菜单地址', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: promptInputUrlValidator,
            inputErrorMessage: '地址格式不正确'
          }).then(async ({ value }) => {
            parent.data.url = value
            parent.data.type = 'view'
            children.splice(index, 1)
            await requestWeChatCreateMenu(this.addWeChatMenuAppId, {button: this.weChatMenuList})
            this.$message.success('删除成功')
            this.getWeChatMenu(this.addWeChatMenuAppId)
          })
        }
        if (this.isSubmit) {
          children.splice(index, 1)
          await requestWeChatCreateMenu(this.addWeChatMenuAppId, {button: this.weChatMenuList})
          this.$message.success('删除成功')
          this.getWeChatMenu(this.addWeChatMenuAppId)
        }
      },
      edit (node, data) {
        if (node.level === 1) {
          this.weChatMenuRules.url[0].required = false
          this.weChatMenuRules.name[0].validator = validateWeChatMenuEight
        } else {
          this.weChatMenuRules.url[0].required = true
          this.weChatMenuRules.name[0].validator = validateWeChatMenuFourteen
        }
        this.weChatMenuEdit = true
        this.title = '编辑菜单'
        const parent = node.parent
        const children = parent.data.sub_button || parent.data
        const index = children.findIndex(d => d.name === data.name)
        this.editInfo = {
          children: children,
          index: index
        }
        this.weChatMenuRuleForm.name = data.name
        this.weChatMenuRuleForm.url = data.url
        this.dialogVisible = true
      },
      dialogClose () {
        this.selectedNode = null
        this.weChatMenuEdit = false
        this.weChatMenuRuleForm.name = ''
        this.weChatMenuRuleForm.url = ''
        this.weChatMenuRules.url[0].required = true
        this.weChatMenuRules.name[0].validator = validateWeChatMenuFourteen
        this.$refs.weChatMenuRuleForm.clearValidate()
      },
      weChatAuthorization () {
        let elink = document.createElement('a')
        elink.style.display = 'none'
        elink.href = this.weChatUrl
        elink.target = '_blank'
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      },
      // 拖拽相关方法
      async saveDropListAction () {
        let res = await requestWeChatCreateMenu(this.addWeChatMenuAppId, {button: this.weChatMenuList})
        if (res === 'success') {
          this.$message.success('菜单保存成功！')
          this.isListItemDraged = false
        } else {
          this.$message.error('保存失败！')
        }
      },
      handleDrop (draggingNode, dropNode, dropType, ev) {
        // console.log(this.nowDraggingNode, dropNode)
        if (dropType === 'inner') {
          this.$message.error('只能同级拖拽！')
          // console.log(this.beforeDragedList)
          this.weChatMenuList = this.beforeDragedList
          this.isListItemDraged = false
        } else if (this.nowDraggingNode.parent.id !== dropNode.parent.id) {
          this.$message.error('不支持越级拖拽！')
          this.weChatMenuList = this.beforeDragedList
          this.isListItemDraged = false
        } else {
          this.isListItemDraged = true
        }
        // console.log('tree drop: ', draggingNode, dropNode, dropType, ev)
      },
      handleDragEnd (draggingNode, dropNode, dropType, ev) {
        // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
      },
      handleDragStart (node, ev) {
        this.beforeDragedList = JSON.parse(JSON.stringify(this.weChatMenuList))
        this.nowDraggingNode = JSON.parse(circleJSON.stringify(node))
        // console.log('drag start', this.nowDraggingNode)
      },
      handleDragEnter (draggingNode, dropNode, ev) {
        // console.log('tree drag enter: ', dropNode.label)
      },
      handleDragLeave (draggingNode, dropNode, ev) {
        // console.log('tree drag leave: ', dropNode.label)
      },
      handleDragOver (draggingNode, dropNode, ev) {
        // console.log('tree drag over: ', dropNode.label)
      },
      allowDrag (a) {
        return this.canAllowDrag
      },
      handleSizeChange (val) {
        this.listPageSize = val
        this.weChatAuthorizationList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.weChatAuthorizationList()
      }
    }
  }
</script>

<style scoped lang="scss">
.weChatManage{
  .alignRight{
    text-align: right;
    line-height: 52px;
  }
  .tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .authorization{
    position: absolute;
    right: 0;
    top: 13px;
  }
  .authorizationList {
    position: absolute;
    right: 60px;
    top: 13px;
  }
  .weChatMenuTree{
    max-height: 400px;
    overflow-y: scroll;
  }
  .projects{
    border: 1px solid #eee;
    min-height: 400px;
    max-height: 400px;
    overflow-y: scroll;
    li{
      line-height: 40px;
      border-bottom: 1px solid #eee;
      padding: 0 24px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: flex;
      cursor:pointer;
      &:last-child{
        border: none;
      }
      span{
        width: 60%;
        display: inline-block;
      }
      .buttons {
        width: 40%;
        text-align: right;
        display: inline-block;
      }
    }
    .active{
      background: #EAF7FF;
    }
  }
  *, *:after, *:before {
    box-sizing: border-box;
  }
  .weChatConfig{
    position: relative;
  }
  .iphone {
    position: fixed;
    left: 0;
    right: 0;
    top: -10%;
    margin: 0 auto;
    z-index: 999;
    box-shadow: inset 0 0 3px 0 rgba(0, 0, 0, 0.2), 0 0 0 1px #999, 0 0 30px 0px rgba(0, 0, 0, 0.7);
    border: 5px solid #d9dbdc;
    background: #f8f8f8;
    padding: 15px;
    border-radius: 50px;
    height: 877px;
    width: 423px;
    margin: 30px auto;
    -webkit-transform: scale(0);
    transform: scale(0);
    transition: all .2s;
  }
  .iphoneShow {
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
    transition: all .3s;
  }
  .iphone-top {
    padding: 5px 110px 40px;
    position: relative;
  }
  .iphone-top .speaker {
    display: block;
    width: 70px;
    height: 6px;
    margin: 0 auto;
    border-radius: 6px;
    background: #292728;
  }
  .iphone-top .camera {
    display: block;
    margin: 0 auto;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-bottom: 13px;
    background: #333;
  }
  .iphone-top .sensor {
    display: block;
    width: 15px;
    height: 15px;
    float: left;
    background: #333;
    margin-top: -5px;
    border-radius: 50%;
  }

  .top-bar, .bottom-bar {
    display: block;
    width: 423px;
    height: 15px;
    border-left: 5px solid #BBB;
    border-right: 5px solid #BBB;
    position: absolute;
    left: -5px;
  }

  .top-bar {
    top: 65px;
  }

  .bottom-bar {
    bottom: 65px;
  }

  .iphone-screen {
    position: relative;
    background: #f5f5f5;
    border: 1px solid #fff;
    height: 677px;
    width: 375px;
    margin: 0 auto;
    border: 2px solid rgba(0, 0, 0, 0.9);
    border-radius: 3px;
    font-size: 16px;
    color: #303030;
    overflow: hidden;
    h6{
      font-size: 16px;
      font-weight: normal;
    }
    .weChatContent{
      p{
        text-align: center;
        line-height: 40px;
      }
    }
    .weChatMenuBox{
      position: absolute;
      z-index: 99999;
      width: 100%;
      height: 50px;
      border-top: 1px solid #999;
      bottom: 0;
      display: -webkit-flex;
      display: -webkit-box;
      .weChatMenu{
        -webkit-flex: 1 0;
        -webkit-box-flex: 1;
        border-right: 1px solid #999;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        &:nth-last-child{
          border-right: none;
        }
      }
    }
  }
  .buttons .on-off, .buttons .up, .buttons .down, .buttons .sleep {
    display: block;
    background: #CCC;
    position: absolute;
    border-radius: 2px 0px 0px 2px;
  }
  .buttons .on-off {
    height: 40px;
    width: 3px;
    top: 100px;
    left: -8px;
  }
  .buttons .up, .buttons .down, .buttons .sleep {
    height: 60px;
    width: 5px;
    left: -10px;
  }
  .buttons .up {
    top: 170px;
  }
  .buttons .down {
    top: 250px;
  }
  .buttons .sleep {
    left: auto;
    right: -10px;
    top: 170px;
    border-radius: 0px 2px 2px 0px;
  }

  .iphone-bottom {
    padding: 10px 0 0;
  }
  .iphone-bottom span {
    display: block;
    margin: 0 auto;
    width: 68px;
    height: 68px;
    background: #ccc;
    border-radius: 50%;
    background: -webkit-linear-gradient(315deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);
    background: linear-gradient(135deg, #303233 0%, #b5b7b9 50%, #f0f2f2 69%, #303233 100%);
    position: relative;
  }
  .iphone-bottom span:after {
    content: "";
    display: block;
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    left: 4px;
    top: 4px;
  }
  .authorization-control {
    text-align: center;
    padding: 10px;
    &+div.bottom {
      text-align: center;
      border-top: 1px solid #0F8BE6;
      padding-top: 30px;
    }
  }

  .qr-code {
    height: 130px;
    width: 130px;
    display: block;
  }
}
</style>

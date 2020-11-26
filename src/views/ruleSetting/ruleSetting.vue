<template>
	<div class="ruleSetting">
		<el-tabs v-model="tabActive"
		         @tab-click="handleClick">
			<el-tab-pane label="注册规则"
			             name="1"
			             v-if="type === '0'">
				<el-form :model="rulesRegistration"
				         class="rulesRegistration"
				         label-width="170px">
					<!-- <el-form-item label="新用户注册后审核：">
						<el-radio v-model="rulesRegistration.manualCheck"
											:label="1">自动审核</el-radio>
						<el-radio v-model="rulesRegistration.manualCheck"
											:label="0">人工审核</el-radio>
					</el-form-item> -->
					<el-form-item label="未审核用户报备客户：">
						<el-radio v-model="rulesRegistration.uncheckedReport"
						          :label="1">允许报备</el-radio>
						<el-radio v-model="rulesRegistration.uncheckedReport"
						          :label="0">不允许报备</el-radio>
					</el-form-item>
					<el-form-item label="未审核用户邀请好友：">
						<el-radio v-model="rulesRegistration.uncheckedInvite"
						          :label="1">允许邀请</el-radio>
						<el-radio v-model="rulesRegistration.uncheckedInvite"
						          :label="0">不允许邀请</el-radio>
					</el-form-item>
					<el-form-item class="m-l0">
						<el-button type="primary"
						           @click="postManagerAccountRules"
						           icon="el-icon-check">确 定</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="报备规则"
			             name="2">
				<!-- 11 -->
				<div class="rules-reporting">
					<el-form :model="rulesReporting"
					         style="margin-bottom:10px;">
						<el-form-item label="项目名称：">
							<el-select v-model="projectId"
							           placeholder="请选择"
							           @change="select"
							           filterable>
								<el-option v-for="(item, index) in projectData"
								           :key="index"
								           :label="item.label"
								           :value="item.value"></el-option>
							</el-select><span v-if="projectId === ''"
							                  class="error-text"
							                  :style="{color:themeColor}">请选择项目!</span>
						</el-form-item>
						<el-form-item label="报备模式："
						              class="reporting-style"
						              v-if="projectId !== ''">
							<el-tag @click.native="selectPatten(patternDataDefault)"
							        size="medium">默认规则</el-tag>
							<el-tag v-for="(tag, index) in patternData"
							        @click.native="selectPatten(tag, index)"
							        @close="handleClose(tag)"
							        closable
							        size="medium"
							        :key="tag.name">
								{{tag.name}}
							</el-tag>
							<i class="el-icon-circle-plus-outline add-pattern"
							   @click="addPatternPopFun"
							   :style="{color:themeColor}"></i>
						</el-form-item>
					</el-form>
					<h3 class="rules-reporting-title"
					    :style="'color:' + themeColor + ';border-top: 2px solid ' + themeColor"
					    v-if="projectId !== ''">
						{{shouRulesReporting.modeName}}
						（{{rulesReporting.modeType === 1 ? '竞争带看' : '保护带看'}}模式）
						<i class="el-icon-question"
						   :style="{'color': themeColor}"
						   @click="dialogVisible = true"></i>
						<el-dropdown trigger="click"
						             v-if="rulesReporting.modeId !== 1 && rulesReporting.modeId !== 2 && rulesReporting.modeName !== '默认规则'">
							<i class="el-icon-more"
							   :style="'background:' + themeColor"></i>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item class="clearfix"
								                  @click.native="modeNamePop = true">
									修改模式名称
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</h3>
					<el-form :model="rulesReporting"
					         label-width="84px"
					         v-if="projectId !== ''">
						<el-form-item label="适用范围："
						              class="reporting-style">
							<el-tag v-for="tag in channelShow"
							        :key="tag.name"
							        size="medium">
								{{tag.name}}
							</el-tag>
							<i class="el-icon-circle-plus-outline add-pattern"
							   :style="{color:themeColor}"
							   @click="channelPop = true"></i>
						</el-form-item>
						<el-form-item label=""
						              v-if="rulesReporting.modeType !== 1"
						              class="reporting-style">
							<el-checkbox v-model="rulesReporting.canInvalidCustomer">允许报备判客无效和成交逾期客户</el-checkbox>
						</el-form-item>
						<el-form-item label=""
						              v-if="rulesReporting.modeType !== 1"
						              class="reporting-style">
							<el-checkbox v-model="rulesReporting.canVisitExpire">允许报备到访逾期的客户</el-checkbox>
							<span v-if="rulesReporting.canVisitExpire">
                <div style="padding-top:15px;">
                  <el-radio v-model="rulesReporting.canOldCustomer"
                            :label="1"
                            class="rulesReporting-line">允许报备项目老客户</el-radio>
                  <el-radio v-model="rulesReporting.canOldCustomer"
                            :label="0"
                            class="rulesReporting-line">不允许报备项目老客户</el-radio>
                </div>
                <div style="padding-top:15px;">
                  <el-radio v-model="rulesReporting.canRepeatReport"
                            :label="0"
                            class="rulesReporting-line">不限制重复报备次数</el-radio>
                  <el-radio v-model="rulesReporting.canRepeatReport"
                            :label="1"
                            class="rulesReporting-line">允许重复报备</el-radio>
                  <el-input v-model.number="rulesReporting.repeatReportNum"
                            class="width80"
                            :disabled="!rulesReporting.canRepeatReport"
                            maxlength="3"></el-input>次
                  <el-tooltip class="item" effect="dark" content="同一渠道/经纪人允许重复的报备次数，支持填写1-999次" placement="right" >
                    <span class="">
                      <i class="el-icon-question"></i>
                    </span>
                  </el-tooltip>
                </div>
              </span>
						</el-form-item>
						<el-form-item label=""
						              class="reporting-style">
							<el-checkbox v-model="rulesReporting.canReportMax">每日报备客户上限</el-checkbox>
							<el-input v-model.number="rulesReporting.reportMax"
							          class="width80"
							          :disabled="!rulesReporting.canReportMax"
							          maxlength="3"></el-input>
						</el-form-item>
						<el-form-item label=""
						              label-width='80px'
						              class="canHideMobile">
							允许客户到访前隐号报备：
							<el-radio v-model="rulesReporting.canHideMobile"
							          :label="1">允许</el-radio>
							<el-radio v-model="rulesReporting.canHideMobile"
							          :label="0">不允许</el-radio>
							<el-radio v-model="rulesReporting.canHideMobile"
							          :label="2">只允许隐号报备</el-radio>
						</el-form-item>
						<el-form-item>
							<el-checkbox v-model="rulesReporting.canChooseMember"
							             @change="chageCanChooseMember"
							             :disabled="rulesReporting.modeType === 1">允许报备客户指定置业顾问</el-checkbox>
							<el-checkbox v-model="rulesReporting.autoChooseMember"
							             @change="chageAutoChooseMember"
							             :disabled="rulesReporting.modeType === 1 || rulesReporting.canHideMobile !== 0">允许客户自动分配</el-checkbox>
						</el-form-item>
						<el-form-item>
							<el-checkbox v-model="rulesReporting.visitOverdueIsEffect">报备后<el-input v-model.number="rulesReporting.visitOverdueDays"
							                                                                        class="width80"
							                                                                        :disabled="!rulesReporting.visitOverdueIsEffect"
							                                                                        maxlength="3"></el-input>天未到访视为到访逾期</el-checkbox>
							<span v-if="rulesReporting.visitOverdueIsEffect">
                <el-radio v-model="rulesReporting.visitOverdueEarlyWarningIsEffect"
                          :label="0"
                          class="rulesReporting-line">不提醒</el-radio>
                <el-radio v-model="rulesReporting.visitOverdueEarlyWarningIsEffect"
                          :label="1">
                  到访逾期结束前<el-input v-model.number="rulesReporting.visitOverdueEarlyWarningDays"
                                   class="width80"
                                   maxlength="3"
                                   :disabled="rulesReporting.visitOverdueEarlyWarningIsEffect === 0"></el-input>天提醒
                </el-radio>
                <div class="paddingleft40"
                     style="padding-top:15px;">
                  <el-form-item>
                    时间计算类型
                    <el-radio v-model="rulesReporting.visitOverdueCalculateType"
                              :label="1"
                              class="rulesReporting-radio">自然天</el-radio>
                    <el-radio v-model="rulesReporting.visitOverdueCalculateType"
                              :label="2"
                              class="rulesReporting-radio"
                              :disabled="rulesReporting.visitOverdueDays === 0">24小时</el-radio>
                  </el-form-item>
                </div>
              </span>
						</el-form-item>
						<el-form-item>
							<el-checkbox v-model="rulesReporting.dealOverdueIsEffect">到访后<el-input v-model.number="rulesReporting.dealOverdueDays"
							                                                                       class="width80"
							                                                                       :disabled="!rulesReporting.dealOverdueIsEffect"
							                                                                       maxlength="3"></el-input>天未成交视为成交逾期</el-checkbox>
							<span v-if="rulesReporting.dealOverdueIsEffect">
                <el-radio v-model="rulesReporting.dealOverdueEarlyWarningIsEffect"
                          :label="0"
                          class="rulesReporting-line">不提醒</el-radio>
                <el-radio v-model="rulesReporting.dealOverdueEarlyWarningIsEffect"
                          :label="1">
                  成交逾期结束前<el-input v-model.number="rulesReporting.dealOverdueEarlyWarningDays"
                                   class="width80"
                                   maxlength="3"
                                   :disabled="rulesReporting.dealOverdueEarlyWarningIsEffect === 0"></el-input>天提醒
                </el-radio>
              </span>
						</el-form-item>
						<div class="paddingleft40"
						     v-if="rulesReporting.dealOverdueIsEffect">
							<el-form-item v-show="rulesReporting.modeName === '默认规则'">
								成交节点
								<el-radio v-model="rulesReporting.dealStatus"
								          v-for="(item, index) in dealStatusData"
								          :label="item.value"
								          :key="index"
								          class="rulesReporting-radio">{{item.label}}</el-radio>
							</el-form-item>
							<el-form-item>
								<el-checkbox v-model="rulesReporting.visitRefreshDealExpire">客户复访时自动刷新成交保护期</el-checkbox>
							</el-form-item>
						</div>
						<el-form-item>
							<el-checkbox v-model="rulesReporting.antiIntercept"
							             @change="changeAntiIntercept">
								防截客时间
								<el-input v-model="rulesReporting.interceptMinute"
								          :disabled="!rulesReporting.antiIntercept"
								          class="width80"
								          maxlength="4"></el-input>分钟</el-checkbox>
						</el-form-item>
						<el-form-item>
							<el-checkbox v-model="rulesReporting.confirmCustomer"
							             @change="changeConfirmCustomer"
							             :disabled="rulesReporting.modeType === 1">到访后自动确客</el-checkbox>
						</el-form-item>
						<el-form-item>
							<el-button type="primary"
							           @click="postManagerReporterMode"
							           icon="el-icon-check">保 存</el-button>
						</el-form-item>
					</el-form>
				</div>
				<!-- 11 -->
			</el-tab-pane>
			<!-- <el-tab-pane label="佣金规则" name="3">
				<el-form :model="commissionRules" class="rules-reporting">
					<el-form-item label="项目名称：">
						<el-select v-model="projectId" placeholder="请选择" @change="select" filterable>
							<el-option v-for="(item, index) in projectData" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<i class="text">一级推荐人可获取应付佣金的</i><el-input v-model.number="commissionRules.firstLevelRatio" placeholder="请输入内容" class="width100" maxlength="3"></el-input><i class="text">%。（请填写1-100之间的整数，默认为0）</i>
					</el-form-item>
					<el-form-item label="佣金规则：">
						<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="commissionRules.commissionRule" style="width:460px;"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="postManagerCommissionRules" icon="el-icon-check">确 定</el-button>
					</el-form-item>
				</el-form>
			</el-tab-pane> -->
		</el-tabs>
		<el-dialog title="自定义报备模式"
		           :visible.sync="addPatternPop"
		           width="600px">
			<el-form :model="addPatternForm"
			         class="demo-form-inline"
			         :inline="true"
			         label-width="80px"
			         label-position="left">
				<el-form-item label="模式名称">
					<el-input v-model="addPatternForm.name"
					          placeholder="模式名称"
					          style="width:260px;"
					          maxlength="12"></el-input>
				</el-form-item>
				<el-form-item label="预设规则">
					<el-radio v-model="addPatternForm.value"
					          :label="2">保护带看</el-radio>
					<el-radio v-model="addPatternForm.value"
					          :label="1">竞争带看</el-radio>
				</el-form-item>
				<el-form-item>
					<i class="el-icon-question"></i>
					<span class="addPattern-text">自定义规则时默认为预设规则的基础配置，可进行手动配置</span>
				</el-form-item>
			</el-form>
			<span slot="footer"
			      class="dialog-footer">
        <el-button type="primary"
                   @click="pushPatternData"
                   icon="el-icon-check">确 定</el-button>
      </span>
		</el-dialog>
		<el-dialog title="选择渠道"
		           :visible.sync="channelPop"
		           width="900px">
			<el-checkbox-group v-model="channelIdArr"
			                   class="qd-checkbox">
				<el-checkbox v-for="(item, index) in channelData"
				             :label="item.value"
				             :key="index">{{item.label}}</el-checkbox>
			</el-checkbox-group>
			<span slot="footer"
			      class="dialog-footer">
        <el-button type="primary"
                   @click="channelPop = false"
                   icon="el-icon-check">确 定</el-button>
      </span>
		</el-dialog>
		<el-dialog title="带看模式说明"
		           :visible.sync="dialogVisible"
		           width="500px">
      <span class="explain">
        <b>保护带看：</b><br />
        1、不支持手机号重复报备；<br />
        2、全号报备时受到访和成交保护期保护；<br />
        3、全号报备时支持指定置业顾问；<br /><br /><br />
        <b>竞争带看：</b><br />
        1、支持隐号/全号重复报备；<br />
        2、不支持指定置业顾问；<br />
        3、到访和成交保护期仅作保护期后的逾期处理；<br />
        4、不支持自动确客
      </span>
		</el-dialog>
		<el-dialog title="修改模式名称"
		           :visible.sync="modeNamePop"
		           width="500px">
			模式名称：<el-input type="text"
			               :rows="2"
			               placeholder="请输入内容"
			               v-model="rulesReporting.modeName"
			               style="width:360px;"></el-input>
			<span slot="footer"
			      class="dialog-footer">
        <el-button type="primary"
                   @click="submitModeName"
                   icon="el-icon-check">确 定</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { getManagerAccountRules, postManagerAccountRules, getManagerCommissionRules, postManagerCommissionRules, projectsProject, projectsManagerProject, getManagerReporterModeOptions, getManagerReporterModeTeamOptions, getManagerReporterMode, postManagerReporterMode, putManagerReporterMode, deleteManagerReporterMode } from '../../common/api'
import entryName from '../../components/entryName'
export default {
	name: 'ruleSetting',
	data () {
		return {
			type: '',
			tabActive: '1',
			projectId: '',
			projectData: [],
			rulesRegistration: {
				tenantId: '', // 租户id
				manualCheck: '', // 是否人工审核
				uncheckedReport: '', // 是否允许报备
				uncheckedInvite: '' // 是否允许邀请
			},
			shouRulesReporting: {
				modeName: '',
				modeType: ''
			},
			rulesReporting: {
				projectId: '', // 项目id
				modeId: '', // 规则ID
				isDefault: 1,
				modeName: '', // 模式名称
				modeType: '', // 模式类型
				channelIds: [],
				canInvalidCustomer:false, // 允许报备判客无效和成交逾期客户
				canVisitExpire:true, // 允许报备到访逾期的客户
				canOldCustomer:1,//是否允许报备老客户 0不可以  1可以
				canRepeatReport:0,//是否允许重复报备 0不限次数  1可以
				repeatReportNum:1,//重复报备次数
				canReportMax:false,//是否设置重复报备上限  0不设置  1设置
				reportMax:0,//重复报备的上限
				canHideMobile: '', // 允许客户到访前隐号报备（遇到疑似重复号码时必须补齐全号）
				canChooseMember: false, // 允许报备客户指定置业顾问
				autoChooseMember: false, // 自动分配
				visitOverdueIsEffect: false, // 到访逾期 是否开启
				visitOverdueDays: '', // 到访视为到访逾期 天数
				visitOverdueEarlyWarningIsEffect: 0, // 到访逾期是否提前预警 0 否 1 是
				visitOverdueEarlyWarningDays: '', // 到访逾期提前提醒 天数
				dealOverdueIsEffect: false, // 到访视为成交逾期 是否开启
				dealOverdueDays: '', // 成交逾期 天数
				dealOverdueEarlyWarningIsEffect: 0, // 成交逾期是否提前预警 0 否 1 是
				dealOverdueEarlyWarningDays: '', // 到访逾期结束前提醒 天数
				dealStatus: 3, // 成交节点判定
				visitOverdueCalculateType: 1, // 时间计算类型  1-自然天  2-24小时   默认选中1
				visitRefreshDealExpire: false, // 客户复访时自动刷新成交保护期
				antiIntercept: false, // 是否开启防截时间 0否 1是
				interceptMinute: 60, // 防截时间（分钟）
				confirmCustomer: false // 是否自动确客
			},
			dealStatusData: [
				{
					label: '已认筹',
					value: 2
				},
				{
					label: '已认购',
					value: 3
				},
				{
					label: '已签约',
					value: 4
				}
			],
			selectModeType: false, // 允许重复报备客户手机号码（保护带看不支持保护期内号码重复）
			channelPop: false,
			channelIdArr: [],
			channelShow: [],
			channelData: [],
			addPatternPop: false,
			addPatternForm: {
				name: '',
				value: 2
			},
			patternIndex: 0,
			patternDataDefault: {
				name: '默认规则',
				value: ''
			},
			patternData: [],
			commissionRules: {
				tenantId: '', // 租户id
				projectId: '', // 项目id
				firstLevelRatio: '',
				commissionRule: '' // 佣金细则
			},
			dialogVisible: false,
			modeNamePop: false
		}
	},
	watch: {
		channelIdArr (v) {
			this.channelShow = []
			this.rulesReporting.channelIds = []
			for (let i = 0; i < v.length; i++) {
				for (let j = 0; j < this.channelData.length; j++) {
					if (v[i] === this.channelData[j].value) {
						this.channelShow.push({
							name: this.channelData[j].label,
							value: this.channelData[j].value
						})
						this.rulesReporting.channelIds.push(this.channelData[j].value)
					}
				}
			}
		},
		rulesReporting: {
			handler (json) {
				if (!this.rulesReporting.visitOverdueIsEffect) {
					this.rulesReporting.visitOverdueDays = 0
					this.rulesReporting.visitOverdueEarlyWarningIsEffect = 0
					this.rulesReporting.visitOverdueEarlyWarningDays = 0
				}
				if (!this.rulesReporting.dealOverdueIsEffect) {
					this.rulesReporting.dealOverdueDays = 0
					this.rulesReporting.dealOverdueEarlyWarningIsEffect = 0
					this.rulesReporting.dealOverdueEarlyWarningDays = 0
					this.rulesReporting.dealStatus = 3
					this.rulesReporting.visitRefreshDealExpire = false
				}
				if (this.rulesReporting.visitOverdueDays === 0) {
					this.rulesReporting.visitOverdueCalculateType = 1
				}
				if (this.rulesReporting.canHideMobile !== 0) {
					this.rulesReporting.autoChooseMember = ''
				}
				if(!this.rulesReporting.canVisitExpire){
					this.rulesReporting.canOldCustomer=0
					this.rulesReporting.canRepeatReport=0
					this.rulesReporting.repeatReportNum=1
				}
			},
			deep: true
		}
	},
	props: ['themeColor'],
	created () {
		this.rulesRegistration.tenantId = sessionStorage.getItem('tenantId')
		this.rulesReporting.tenantId = sessionStorage.getItem('tenantId')
		this.commissionRules.tenantId = sessionStorage.getItem('tenantId')
		this.projectId = sessionStorage.getItem('projectId') ? sessionStorage.getItem('projectId') : ''
		this.rulesReporting.projectId = sessionStorage.getItem('projectId')
		this.commissionRules.projectId = sessionStorage.getItem('projectId')
		this.type = sessionStorage.getItem('type').toString()
		if (this.type === '0') {
			this.projectsProject()
			this.getManagerAccountRules()
			this.tabActive = '1'
		} else if (this.type === '1') {
			this.projectsManagerProject()
			this.tabActive = '2'
			if (this.projectId !== '') {
				this.getManagerReporterModeOptions()
				this.getManagerReporterModeTeamOptions()
			}
		}
	},
	methods: {
		chageCanChooseMember () {
			if (this.rulesReporting.canChooseMember) {
				this.rulesReporting.autoChooseMember = ''
			}
		},
		chageAutoChooseMember () {
			if (this.rulesReporting.autoChooseMember) {
				this.rulesReporting.canChooseMember = ''
			}
		},
		async projectsProject () {
			const result = await projectsProject(sessionStorage.getItem('tenantId'))
			const data = result.data.result
			let list = [
				{
					label: '全部',
					value: ''
				}
			]
			for (let i = 0; i < data.length; i++) {
				let json = {
					label: data[i].referred,
					value: data[i].projectId
				}
				list.push(json)
			}
			this.projectData = list
		},
		async projectsManagerProject () {
			const result = await projectsManagerProject(sessionStorage.getItem('managerId'))
			let data = result.data
			this.projectData = []
			for (let i = 0; i < data.length; i++) {
				let json = {
					label: data[i].referred,
					value: data[i].projectId
				}
				this.projectData.push(json)
			}
		},
		async getManagerAccountRules () { // 注册规则
			const result = await getManagerAccountRules(`${this.rulesRegistration.tenantId}`)
			if (result.code === 200) {
				this.rulesRegistration.manualCheck = result.data.manualCheck
				this.rulesRegistration.uncheckedReport = result.data.uncheckedReport
				this.rulesRegistration.uncheckedInvite = result.data.uncheckedInvite
			} else if (result.code !== 200 && result.code !== 401) {
				this.$message.error(result.message)
			}
		},
		async postManagerAccountRules () {
			const result = await postManagerAccountRules(this.rulesRegistration)
			if (result.code === 200) {
				this.$message.success('设置成功')
			} else if (result.code !== 200 && result.code !== 401) {
				this.$message.error(result.message)
			}
		},
		async getManagerCommissionRules () { // 佣金规则
			if (sessionStorage.getItem('projectId') !== '' && sessionStorage.getItem('projectId') !== null) {
				const result = await getManagerCommissionRules(`${this.commissionRules.projectId}`)
				if (result.code === 200) {
					this.commissionRules.firstLevelRatio = result.data.firstLevelRatio === null ? 0 : result.data.firstLevelRatio
					this.commissionRules.commissionRule = result.data.commissionRule
				} else if (result.code !== 200 && result.code !== 401) {
					this.$message.error(result.message)
				}
			}
		},
		async postManagerCommissionRules () {
			var reg = /^[0-9]*$/
			if (this.commissionRules.projectId === '' || this.commissionRules.projectId === null) {
				this.$message.error('请选择项目')
			} else if (!reg.test(this.commissionRules.firstLevelRatio) || this.commissionRules.firstLevelRatio > 100) {
				this.$message.error('请填写1-100之间的整数')
			} else {
				const result = await postManagerCommissionRules(this.commissionRules)
				if (result.code === 200) {
					this.$message.success('设置成功')
				} else if (result.code !== 200 && result.code !== 401) {
					this.$message.error(result.message)
				}
			}
		},
		async getManagerReporterModeOptions () {
			const result = await getManagerReporterModeOptions(`${sessionStorage.getItem('userId')}/${this.rulesReporting.projectId}`)
			this.patternData = []
			if (result.code === 200) {
				for (let i = 0; i < result.data.length; i++) {
					if (result.data[i].isDefault === 1) {
						this.patternDataDefault.value = result.data[i].modeId
						this.getManagerReporterMode(result.data[i].modeId)
					} else if (result.data.length > 1) {
						this.patternData.push({
							name: result.data[i].modeName,
							value: result.data[i].modeId
						})
					}
				}
				this.rulesReporting.modeName = result.data[0].modeName
			}
		},
		async getManagerReporterModeTeamOptions () {
			this.channelData = []
			this.channelShow = []
			const result = await getManagerReporterModeTeamOptions(this.rulesReporting.projectId)
			if (result.code === 200) {
				for (let i = 0; i < result.data.length; i++) {
					this.channelData.push({
						label: result.data[i].channelName,
						value: result.data[i].channelId
					})
				}
			}
		},
		async getManagerReporterMode (modeId) {
			const result = await getManagerReporterMode(modeId)
			if (result.code === 200) {
				this.channelIdArr = []
				for (let i = 0; i < result.data.channels.length; i++) {
					this.channelIdArr.push(result.data.channels[i].channelId)
				}
				this.rulesReporting.modeId = result.data.modeId // 规则ID
				this.rulesReporting.isDefault = result.data.isDefault // 是否默认模式 1是 0否
				this.rulesReporting.modeType = result.data.modeType // 模式类型  1竞争带看 2保护带看
				this.rulesReporting.canHideMobile = result.data.canHideMobile // 允许客户到访前隐号报备（遇到疑似重复号码时必须补齐全号）
				this.rulesReporting.canInvalidCustomer = result.data.canInvalidCustomer === 1
				this.rulesReporting.canVisitExpire = result.data.canVisitExpire === 1
				this.rulesReporting.canOldCustomer = result.data.canOldCustomer
				this.rulesReporting.canRepeatReport = result.data.canRepeatReport
				this.rulesReporting.repeatReportNum = result.data.repeatReportNum || 1
				this.rulesReporting.canReportMax = result.data.canReportMax === 1
				this.rulesReporting.reportMax = result.data.reportMax || 0
				this.rulesReporting.canChooseMember = result.data.canChooseMember === 1 // 允许报备客户指定置业顾问
				this.rulesReporting.autoChooseMember = result.data.autoChooseMember === 1 // 自动分配
				this.rulesReporting.visitOverdueIsEffect = result.data.visitOverdueIsEffect === 1 // 到访逾期 是否开启
				this.rulesReporting.visitOverdueDays = result.data.visitOverdueDays // 到访视为到访逾期 天数
				this.rulesReporting.visitOverdueEarlyWarningIsEffect = result.data.visitOverdueEarlyWarningIsEffect // 到访逾期是否提前预警 0 是 1 否
				this.rulesReporting.visitOverdueEarlyWarningDays = result.data.visitOverdueEarlyWarningDays // 到访逾期提前提醒 天数
				this.rulesReporting.dealOverdueIsEffect = result.data.dealOverdueIsEffect === 1 // 到访视为成交逾期 是否开启
				this.rulesReporting.dealOverdueDays = result.data.dealOverdueDays // 成交逾期 天数
				this.rulesReporting.dealOverdueEarlyWarningIsEffect = result.data.dealOverdueEarlyWarningIsEffect // 成交逾期是否提前预警 0 是 1 否
				this.rulesReporting.dealOverdueEarlyWarningDays = result.data.dealOverdueEarlyWarningDays // 到访逾期结束前提醒 天数
				this.rulesReporting.dealStatus = result.data.dealStatus // 成交节点判定
				this.rulesReporting.visitOverdueCalculateType = result.data.visitOverdueCalculateType // 时间计算类型
				this.rulesReporting.visitRefreshDealExpire = result.data.visitRefreshDealExpire === 1 // 客户复访时自动刷新成交保护期
				this.rulesReporting.antiIntercept = result.data.antiIntercept === 1 // 是否开启防截时间 0否 1是
				this.rulesReporting.interceptMinute = result.data.interceptMinute // 防截时间（分钟）
				this.rulesReporting.confirmCustomer = result.data.confirmCustomer === 1 // 是否自动确客
				this.selectModeType = result.data.modeType === 1 // 允许重复报备客户手机号码（保护带看不支持保护期内号码重复）
				this.shouRulesReporting.modeName = result.data.modeName
				// 适用范围
				this.channelShow = []
				this.rulesReporting.channelIds = []
				for (let i = 0; i < result.data.channels.length; i++) {
					this.channelShow.push({
						name: result.data.channels[i].channelName,
						value: result.data.channels[i].channelId
					})
					this.rulesReporting.channelIds.push(result.data.channels[i].channelId)
				}
			} else if (result.code !== 200 && result.code !== 401) {
				this.$message.error(result.message)
			}
		},
		async postManagerReporterMode () {
			var reg1 = /^[0-9]\d*$/
			var reg = /^[1-9]\d*$/
			// 到访逾期天数-----------
			if (this.rulesReporting.visitOverdueIsEffect && !reg1.test(this.rulesReporting.visitOverdueDays)) {
				this.$message.error('到访逾期天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.visitOverdueIsEffect && this.rulesReporting.visitOverdueDays < 0 && this.rulesReporting.visitOverdueDays > 999) {
				this.$message.error('到访逾期天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.visitOverdueEarlyWarningIsEffect && !reg1.test(this.rulesReporting.visitOverdueEarlyWarningDays)) {
				this.$message.error('到访逾期结束前天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.visitOverdueEarlyWarningIsEffect && this.rulesReporting.visitOverdueEarlyWarningDays < 0 && this.rulesReporting.visitOverdueEarlyWarningDays > 999) {
				this.$message.error('到访逾期结束前天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.visitOverdueEarlyWarningIsEffect && this.rulesReporting.visitOverdueEarlyWarningDays > this.rulesReporting.visitOverdueDays) {
				this.$message.error('到访逾期提醒天数不能大于到访天数')
				return false
			}
			// 成交逾期-------------
			if (this.rulesReporting.dealOverdueIsEffect && !reg1.test(this.rulesReporting.dealOverdueDays)) {
				this.$message.error('成交逾期结束前天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.dealOverdueIsEffect && this.rulesReporting.dealOverdueDays < 0 && this.rulesReporting.dealOverdueDays > 999) {
				this.$message.error('成交逾期天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.dealOverdueEarlyWarningIsEffect && !reg1.test(this.rulesReporting.dealOverdueEarlyWarningDays)) {
				this.$message.error('成交逾期天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.dealOverdueEarlyWarningIsEffect && this.rulesReporting.dealOverdueEarlyWarningDays < 0 && this.rulesReporting.dealOverdueEarlyWarningDays > 999) {
				this.$message.error('成交逾期天数必须为0 ~ 999的数字')
				return false
			}
			if (this.rulesReporting.dealOverdueEarlyWarningIsEffect && this.rulesReporting.dealOverdueEarlyWarningDays > this.rulesReporting.dealOverdueDays) {
				this.$message.error('成交逾期提醒天数不能大于成交天数')
				return false
			}
			// 结束----------
			if (this.rulesReporting.antiIntercept && (this.rulesReporting.interceptMinute < 1 || this.rulesReporting.interceptMinute > 1440)) {
				this.$message.error('防截客时间应在1-1440分钟内')
				return false
			}
			if (this.rulesReporting.antiIntercept && !reg.test(this.rulesReporting.interceptMinute)) {
				this.$message.error('防截客时间只能输入1-1440之间的整数')
				return false
			}
			let postJson = {
				projectId: this.rulesReporting.projectId, // 项目id
				createUserId: sessionStorage.getItem('userId'), // 用户id
				modeName: this.rulesReporting.modeName, //  模式名称
				modeType: this.rulesReporting.modeType,
				channelIds: this.rulesReporting.channelIds,
				canHideMobile: this.rulesReporting.canHideMobile, // 允许客户到访前隐号报备（遇到疑似重复号码时必须补齐全号）
				canInvalidCustomer: this.rulesReporting.canInvalidCustomer ? 1 : 0,
				canVisitExpire: this.rulesReporting.canVisitExpire ? 1 : 0,
				canOldCustomer: this.rulesReporting.canOldCustomer,
				canRepeatReport: this.rulesReporting.canRepeatReport,
				repeatReportNum: this.rulesReporting.repeatReportNum,
				canReportMax: this.rulesReporting.canReportMax ? 1 : 0,
				reportMax: this.rulesReporting.reportMax,
				canChooseMember: this.rulesReporting.canChooseMember ? 1 : 0, // 允许报备客户指定置业顾问
				autoChooseMember: this.rulesReporting.autoChooseMember ? 1 : 0, // 自动分配
				visitOverdueIsEffect: this.rulesReporting.visitOverdueIsEffect ? 1 : 0, // 到访逾期 是否开启
				visitOverdueDays: this.rulesReporting.visitOverdueDays, // 到访视为到访逾期 天数
				visitOverdueEarlyWarningIsEffect: this.rulesReporting.visitOverdueEarlyWarningIsEffect ? 1 : 0, // 到访逾期是否提前预警 0 否 1 是
				visitOverdueEarlyWarningDays: this.rulesReporting.visitOverdueEarlyWarningDays, // 到访逾期提前提醒 天数
				dealOverdueIsEffect: this.rulesReporting.dealOverdueIsEffect ? 1 : 0, // 到访视为成交逾期 是否开启
				dealOverdueDays: this.rulesReporting.dealOverdueDays, // 成交逾期 天数
				dealOverdueEarlyWarningIsEffect: this.rulesReporting.dealOverdueEarlyWarningIsEffect, // 成交逾期是否提前预警 0 否 1 是
				dealOverdueEarlyWarningDays: this.rulesReporting.dealOverdueEarlyWarningDays, // 到访逾期结束前提醒 天数
				dealStatus: this.rulesReporting.dealStatus, // 成交节点判定
				visitOverdueCalculateType: this.rulesReporting.visitOverdueCalculateType, // 时间计算类型  1-自然天  2-24小时   默认选中1
				visitRefreshDealExpire: this.rulesReporting.visitRefreshDealExpire ? 1 : 0, // 客户复访时自动刷新成交保护期
				antiIntercept: this.rulesReporting.antiIntercept ? 1 : 0, // 是否开启防截时间 0否 1是
				interceptMinute: this.rulesReporting.interceptMinute, // 防截时间（分钟）
				confirmCustomer: this.rulesReporting.confirmCustomer ? 1 : 0 // 是否自动确客
			}
			if (this.rulesReporting.modeId) { // 保存
				postJson.modeId = this.rulesReporting.modeId // 模式id
				const result = await putManagerReporterMode(postJson)
				if (result.code === 200) {
					if (this.rulesReporting.modeName !== '默认规则' && this.rulesReporting.modeName !== '默认规则') {
						this.patternData[this.patternIndex].name = this.rulesReporting.modeName
					}
					this.shouRulesReporting.modeName = this.rulesReporting.modeName
					this.$message.success('保存成功')
				} else if (result.code !== 200 && result.code !== 401) {
					this.$message.error(result.message)
				}
			} else { // 创建
				const result = await postManagerReporterMode(postJson)
				if (result.code === 200) {
					this.rulesReporting.modeId = result.data.modeId
					this.patternData[this.patternIndex].value = result.data.modeId
					this.$message.success('创建成功')
				} else if (result.code !== 200 && result.code !== 401) {
					this.$message.error(result.message)
				}
			}
			this.modeNamePop = false
		},
		selectPatten (tag, index) {
			this.changePatternFun(index)
			this.rulesReporting.modeName = tag.name
			if (tag.value !== 1 && tag.value !== 2) {
				this.getManagerReporterMode(tag.value)
			} else {
				this.ResetRulesReporting(tag)
			}
		},
		pushPatternData () {
			for (let i = 0; i < this.patternData.length; i++) {
				if (this.patternData[i].name === this.addPatternForm.name) {
					this.$message.warning('报备模式名称重复，请重新命名')
					return false
				}
			}
			if (this.addPatternForm.name === '') {
				this.$message.warning('请填写模式名称')
			} else if (this.addPatternForm.name.length < 2 || this.addPatternForm.name.length > 12) {
				this.$message.warning('模式名称长度在2到12位之间')
			} else if (this.patternData.length > 8) {
				this.$message.warning('最多可以创建10个报备模式')
			} else {
				this.rulesReporting.modeName = this.addPatternForm.name
				this.rulesReporting.modeType = this.addPatternForm.value
				this.ResetRulesReporting(this.addPatternForm)
				this.patternData.push(this.addPatternForm)
				this.patternIndex = this.patternData.length - 1
				this.rulesReporting.canHideMobile = 0
				this.addPatternForm = {
					name: '',
					value: 2
				}
				this.addPatternPop = false
				this.rulesReporting.visitOverdueCalculateType = 1
				this.postManagerReporterMode()
			}
		},
		ResetRulesReporting (tag) {
			this.shouRulesReporting.modeName = tag.name
			this.shouRulesReporting.modeType = parseInt(tag.value)
			this.channelShow = []
			this.selectModeType = []
			this.channelIdArr = []
			this.rulesReporting = {
				projectId: sessionStorage.getItem('projectId'), // 项目id
				modeName: tag.name,
				modeType: parseInt(tag.value),
				channelIds: [],
				isDefault: '',
				canHideMobile: '', // 允许客户到访前隐号报备（遇到疑似重复号码时必须补齐全号）
				canInvalidCustomer:false,//允许报备判客无效和成交逾期客户
				canVisitExpire:true,//允许报备到访逾期的客户
				canOldCustomer: 1,
				canRepeatReport: 0,
				repeatReportNum: 1,
				canReportMax: false,
				reportMax: 0,
				canChooseMember: false, // 允许报备客户指定置业顾问
				autoChooseMember: false, // 自动分配
				visitOverdueIsEffect: false, // 到访逾期 是否开启
				visitOverdueDays: '', // 到访视为到访逾期 天数
				visitOverdueEarlyWarningIsEffect: 0, // 到访逾期是否提前预警 0 否 1 是
				visitOverdueEarlyWarningDays: '', // 到访逾期提前提醒 天数
				dealOverdueIsEffect: false, // 到访视为成交逾期 是否开启
				dealOverdueDays: '', // 成交逾期 天数
				dealOverdueEarlyWarningIsEffect: 0, // 成交逾期是否提前预警 0 否 1 是
				dealOverdueEarlyWarningDays: '', // 到访逾期结束前提醒 天数
				dealStatus: 3, // 成交节点判定
				visitOverdueCalculateType: 1, // 时间计算类型  1-自然天  2-24小时   默认选中1
				visitRefreshDealExpire: false, // 客户复访时自动刷新成交保护期
				antiIntercept: false, // 是否开启防截时间 0否 1是
				interceptMinute: 60, // 防截时间（分钟）
				confirmCustomer: false // 是否自动确客
			}
		},
		handleClick (tab, event) {
			this.rulesReporting.projectId = sessionStorage.getItem('projectId')
			this.commissionRules.projectId = sessionStorage.getItem('projectId')
			switch (this.tabActive) {
				case '1':
					this.getManagerAccountRules()
					break
				case '2':
					if (this.projectId !== '') {
						this.getManagerReporterModeOptions()
						this.getManagerReporterModeTeamOptions()
					}
					break
				case '3':
					this.getManagerCommissionRules()
					break
			}
		},
		select () {
			sessionStorage.setItem('projectId', this.projectId)
			this.rulesReporting.projectId = this.projectId
			this.commissionRules.projectId = this.projectId
			switch (this.tabActive) {
				case '2':
					if (this.projectId !== '') {
						this.getManagerReporterModeOptions()
						this.getManagerReporterModeTeamOptions()
					}
					break
				case '3':
					this.getManagerCommissionRules()
					break
			}
		},
		changePatternFun (index) {
			this.patternIndex = index
		},
		handleClose (tag) {
			this.$confirm('此操删除此报备模式, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.deleteManagerReporterMode(tag)
			})
		},
		async deleteManagerReporterMode (tag) {
			if (tag.value.length > 3) {
				const result = await deleteManagerReporterMode(tag.value)
				if (result.code === 200) {
					this.$message.success('删除成功')
					this.patternData.splice(this.patternData.indexOf(tag), 1)
					if (this.patternData.length) {
						let modeTypeId = this.patternData[this.patternData.length - 1].value
						this.getManagerReporterMode(modeTypeId)
					} else {
						this.getManagerReporterMode(this.patternDataDefault.value)
					}
				} else if (result.code !== 200 && result.code !== 401) {
					this.$message.error(result.message)
				}
			} else {
				this.patternData.splice(this.patternData.indexOf(tag), 1)
			}
		},
		changeAntiIntercept () {
			// if (this.rulesReporting.antiIntercept) {
			//   this.rulesReporting.confirmCustomer = false
			// }
		},
		changeConfirmCustomer () {
			// if (this.rulesReporting.confirmCustomer) {
			//   this.rulesReporting.antiIntercept = false
			// }
		},
		addPatternPopFun () {
			if (this.patternData.length) {
				let len = this.patternData[this.patternData.length - 1].value
				if (len < 10) {
					this.$message.warning('请保存当前报备模式后再创建新的报备模式')
					return false
				} else {
					this.addPatternPop = true
				}
			} else {
				this.addPatternPop = true
			}
		},
		submitModeName () {
			if (this.rulesReporting.modeName.length < 2) {
				this.$message.error('模式名称长度在2到12位之间')
			} else {
				this.postManagerReporterMode()
			}
		}
	},
	components: {
		entryName
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.rules-reporting {
	padding: 20px;
	.el-form-item__content {
		position: relative;
		.width100 {
			width: 100px;
			padding: 0 5px;
		}
		.el-form-item__error {
			position: absolute;
			left: 360px;
			top: 8px;
			width: 200px;
		}
	}
}
.rulesRegistration {
	padding: 20px;
}
.m-l0 {
	.el-form-item__content {
		margin-left: 18px !important;
	}
}
.canHideMobile {
	.el-form-item__label {
		text-align: left !important;
	}
}
.name {
	margin-left: 10px;
}
.add-pattern {
	font-size: 22px;
	position: relative;
	bottom: -3px;
	color: #666;
	cursor: pointer;
}
.el-icon-question {
	font-size: 18px;
	margin-right: 5px;
	position: relative;
	bottom: -1px;
	color: #999;
	cursor: pointer;
}
.addPattern-text {
	color: #999;
}
.reporting-style {
	.el-form-item__content {
		.el-tag {
			margin-right: 10px;
			cursor: pointer;
			margin-bottom: 8px;
		}
	}
}
.rules-reporting-title {
	font-size: 16px;
	margin-bottom: 20px;
	padding-top: 10px;
	position: relative;
	.el-dropdown {
		position: absolute;
		right: 0;
		top: 0;
	}
	.el-icon-more {
		width: 30px;
		height: 30px;
		line-height: 30px;
		cursor: pointer;
		color: #fff;
		text-align: center;
	}
}
.width80 {
	width: 80px !important;
	margin: 0 5px;
}
.rulesReporting-line {
	margin: 7px 0 0 40px;
}
.rulesReporting-radio {
	margin: 7px 10px 0 10px;
}
.paddingleft40 {
	padding-left: 54px;
}
.error-text {
	font-size: 12px;
	margin-left: 10px;
}
.qd-checkbox {
	.el-checkbox + .el-checkbox {
		margin: 0 0 20px;
		width: 33%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.el-checkbox {
		margin: 0 0 20px;
		width: 33%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
.del-line {
	position: relative;
	::before {
		display: block;
		width: 410px;
		height: 1px;
		background: #666;
		position: absolute;
		left: 18px;
		top: 50%;
		z-index: 1;
	}
}
.el-checkbox__input.is-disabled + .el-checkbox__label {
	text-decoration: line-through;
}
.explain {
	font-size: 14px;
	b {
		margin-bottom: 10px;
		font-size: 16px;
	}
}
</style>

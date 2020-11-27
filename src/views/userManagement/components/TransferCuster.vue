<template lang="pug">
	.channel-dialog
		el-dialog(
			:title="'客户转移'"
			:visible.sync="isShow"
			width="1100px"
			:close-on-click-modal="false"
			:show-close="false"
		)
			.warpper
				.tree
					channel-tree(
						:treeData="treeData"
						@nodeClick="handleNodeClick"
						:is-show-edit="false"
						:expand-on-click-node="false"
					)
				.table
					.table-content
						.search-box
							el-select(v-model="searchData.type" class="search-select" @change="handleSelectChange")
								el-option(label="姓名" value="01")
								el-option(label="手机号" value="02")
							el-input(class="search-input" :placeholder="`请输入${searchData.type === '01'? '姓名' : '手机号'}`" v-model="searchData.inputContent")
							el-button(class="search-btn" type="primary" @click="handleSearch") 搜索
						.table-box
							el-table(
								:data="tableData"
								empty-text="无数据"
								highlight-current-row
								@current-change="handleCheck"
							)
								el-table-column( width="60")
									template(slot-scope="scope")
										el-checkbox(v-model="scope.row.isChecked")
								el-table-column( prop="name" label="姓名" min-width="60" align="center" header-align="center")
								el-table-column( prop="mobile" label="手机号码" min-width="120" align="center" header-align="center")
								el-table-column( prop="roleTypeName" label="用户角色" min-width="120" align="center" header-align="center")
								el-table-column( prop="statusName" label="用户状态" min-width="120" align="center" header-align="center")

							el-pagination(
								@current-change="handleCurrentChange"
								:current-page.sync="page.currentPage"
								:page-size="page.pageSize"
								layout="prev, pager, next, jumper"
								:total="page.total"
							)

					.footer
						el-button(@click="submit" size="medium" type="primary") 确 定
						el-button(@click="closeDialog" size="medium") 取 消

</template>

<script>
import ChannelTree from "./ChannelTree";
import {
	managerAgencyTeamStoresAssistants,
	transferCustomer,
	queryChannelPrincipal,
} from '../../../common/api'
export default {
	name: "TransferCusterDialog",
	components: {ChannelTree},
	props: {
		projectIds: {
			type: Array,
			default: () => []
		},
		fromUserId: {
			type: [ String, Number ],
			default: 0
		},
		ReportedNum:{
			type: [ String, Number ],
			default: 0
		},
		isShow: {
			type: Boolean,
			required: true,
			default: true
		},
		treeData: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data() {
		return {
			toUserId:'',
			defaultProps: {
				children: 'stores',
				label: 'name'
			},
			searchData: {
				inputContent: '',
				type: "01"
			},
			tableData: [],
			params: {
				name: '',
				mobile: '',
				id: ''
			},
			page: {
				currentPage: 1,
				pageSize: 10,
				total: 0
			}
		}
	},
	computed: {
	},
	mounted() {
	},
	methods: {
		handleSelectChange() {
			this.searchData.inputContent = ''
		},
		/**
		 * 选中一条
		 * */
		handleCheck(row) {
			this.tableData.forEach(item => {
				item.isChecked = false
			})
			row.isChecked = true
			this.toUserId = row.userId
			this.currentRow = { ...row }
		},
		handleSearch() {
			if(this.searchData.type === '01') {
				this.params.name = this.searchData.inputContent
				this.params.mobile = ''
			} else {
				this.params.mobile = this.searchData.inputContent
				this.params.name = ''
			}
			if( !this.params.id) {
				this.$message.warning('请选择渠道或门店')
				return
			}
			if(this.queryListType === 'store') {
				this.queryPrincipalList()
			} else {
				this.queryChannelPrincipal()
			}
		},
		handleCurrentChange(val) {
			this.page.currentPage = val
			if(this.queryListType === 'store') {
				this.queryPrincipalList()
			} else {
				this.queryChannelPrincipal()
			}
		},
		handleNodeClick(data) {
			this.queryListType = data.type
			this.page.currentPage = 1
			this.params.id = data.id
			this.params.effectivity = data.effectivity
			if(this.queryListType === 'store') {
				this.queryPrincipalList()
			} else {
				this.queryChannelPrincipal()

			}
		},
		async queryChannelPrincipal() {
			const res = await queryChannelPrincipal({
				currentPage: this.page.currentPage,
				channelId: this.params.id,
				name: this.params.name,
				mobile: this.params.mobile,
				tenantId: sessionStorage.getItem('tenantId')
			})
			this.tableData = res.data
			this.page.currentPage = res.page.currentPage
			this.page.total = res.page.recordCount * 1
		},
		async queryPrincipalList() {
			const res = await managerAgencyTeamStoresAssistants(`${this.params.id}`, this.page.currentPage, `&name=${this.params.name}&mobile=${this.params.mobile}`)
			this.tableData = res.data
			this.page.total = res.page.recordCount * 1
			this.page.currentPage = res.page.currentPage

		},
		closeDialog() {
			this.$emit('update:isShow', false)
		},
		async submit() {
			const res = await transferCustomer({
				fromUserId: this.fromUserId,
				toUserId: this.toUserId,
				tenantId: sessionStorage.getItem('tenantId'),
				projectIds:null
			})
			if(res.code === 200) {
				this.$message.success('转移成功')
				this.$emit('success')
				this.closeDialog()
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.channel-dialog {
	.warpper {
		display: flex;
		min-height: 300px;

		.tree {
			padding: 30px 20px;
			background-color: #f8f8f8;
			width: 200px;
		}

		.table {
			flex: 1;
			display: flex;
			flex-direction: column;
			background-color: #fff;
			padding: 30px 20px;

			.table-content {
				flex: 1;

				.search-box {
					display: flex;
					justify-content: flex-end;

					.search-select {
						width: 90px;
						margin-right: 10px;
					}

					.search-input {
						width: 250px;
						margin-right: 10px;
					}

					.search-btn {

					}
				}
			}

			.footer {
				height: 30px;

				.el-button {
					float: right;
					margin-right: 10px;
				}
			}
		}
	}

}

/deep/ .el-dialog__body {
	padding: 0 !important;
}

.el-tree {
	background-color: transparent;
}
</style>

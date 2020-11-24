<template lang="pug">
	.PrincipalTable
		.principal-title
			.store-name {{storeName}}
			.operation
				el-button(type="primary" class="search-submit" @click="handleEdit" icon="el-icon-plus") 添加负责人
		el-table(
			:data="tableData"
			class="principal-table"
			:style="'border-top:2px solid' + themeColor"
		)
			el-table-column(prop="name" label="姓名" min-width="120")
			el-table-column(prop="mobile" label="电话号码" min-width="120")
			el-table-column(prop="roleTypeName" label="用户角色" min-width="120")
			el-table-column(prop="agencyStatusName" label="用户状态" min-width="120")
			el-table-column(prop="reportedNum" label="报备客户" min-width="120")
			el-table-column(prop="effectiveNum" label="有效客户" min-width="120")
			el-table-column(prop="name" label="管理" width="100")
				template(slot-scope="scope")
					el-dropdown(trigger="click" size="small")
						el-button(type="text" size="small") 操作
						el-dropdown-menu(slot="dropdown")
							el-dropdown-item(@click.native="handleSwitch(scope.row, 1, '停用')" v-if="scope.row.agencyStatus === 1 || 1") 停用
							el-dropdown-item(@click.native="handleSwitch(scope.row, 0, '启用')" v-if="scope.row.agencyStatus === 2 || scope.row.agencyStatus === 0") 启用
							el-dropdown-item(@click.native="handleTransferCuster(scope.row)") 客户转移
							el-dropdown-item(@click.native="handleEdit(scope.row)") 编辑
							el-dropdown-item(@click.native="handleDel(scope.row)") 删除

		el-pagination(
			@current-change="currentChange"
			:current-page.sync="page.currentPage"
			:page-size="page.pageSize"
			layout="prev, pager, next, jumper"
			:total="page.total"
		)
		el-dialog(
			:title="dialogType + '负责人'"
			:visible.sync="isShow"
			width="500px"
			:close-on-click-modal="false"
			:show-close="false"
		)
			div
				el-form(ref="dialigFormRef" :model="dialogForm" :rules="dialogRules" label-width="100px")
					el-row()
						el-col(:span="24")
							el-form-item(label="负责人" prop="name" :maxlength="20" style="width:400px")
								el-input(placeholder="负责人" v-model="dialogForm.name")
						el-col(:span="24")
							el-form-item(label="电话号码" prop="mobile" :maxlength="20" style="width:400px")
								el-input(placeholder="电话号码" v-model="dialogForm.mobile")
			span( slot="footer" class="dialog-footer")
				el-row
					el-col(:span="24"  style="text-align:right")
						el-button(icon="el-icon-close" @click="isShow = false") 关 闭
						el-button(type="primary" icon="el-icon-check" @click="handleSubmit") 确 定

</template>

<script>
import {
	queryChannelPrincipal,
	putChannelPrincipal
} from  './../../../common/api'
import { mapGetters } from 'vuex'
export default {
	name: "PrincipalTable",
	props: [ 'channelStatus', 'channelId' ],
	computed: {
		...mapGetters({
			themeColor: 'GET_COLOUR'
     })
	},
	data() {
		return {
			storeName: '',
			tableData:[],
			page: {
				currentPage: 0,
				pageSize: 0,
				total: 0
			},
			search:{
				name: '',
				mobile: ''
			},



			// dialog相关
			isShow: false,
			dialogType:'',
			dialogForm: {
				name: '',
				userId: '',
				mobile: '',
			},
			dialogRules: {
				name: [
					{required: true, message: '必填项不能为空', trigger:'blur'}
				],

				mobile: [
					{required: true, message: '必填项不能为空', trigger:'blur'}
				],
			}
		}
	},
	methods: {
		handleTransferCuster(row) {
			this.$emit('transferCuster', row)
		},
		handleSwitch(row, status, text) {
			this.$emit('switch',row, status, text)
		},
		handleDel(row) {
			this.$emit('delete',row, 2 )
		},
		handleEdit(row) {
			if(row) {
				this.dialogType = '编辑'
				this.dialogForm.name = row.name
				this.dialogForm.mobile = row.mobile
				this.dialogForm.userId = row.userId
			} else {
				this.dialogType = '添加'
				this.dialogForm.name = ''
				this.dialogForm.mobile = ''
				this.dialogForm.userId = ''
			}
			this.isShow = true
		},
		handleSubmit() {
			this.$refs.dialigFormRef.validate(async valid => {
				if(valid) {
					const res = await putChannelPrincipal({
						tenantId: sessionStorage.getItem('tenantId'),
						name: this.dialogForm.name,
						userId: this.dialogForm.userId,
						mobile: this.dialogForm.name,
						teamId: this.channelId
					})
					if(res.code === 200) {
						this.isShow = false
						this.$message.success('操作成功')
					}
				}
			})
		},
		currentChange(val){
			this.page.currentOage = val
		},
		getParams() {
			return {
				currentPage: this.page.currentPage,
				channelId: this.channelId,
				name: this.search.name,
				mobile: this.search.mobile,
				tenantId: sessionStorage.getItem('tenantId')
			}
		},
		async queryList() {
			const res = await queryChannelPrincipal(this.getParams())
			this.tableData = res.data
		}
	}
}
</script>

<style scoped lang="scss">
 .PrincipalTable {
	 background-color: #f7f7f7;
	 height: 100%;
	 width: 100%;
	 .principal-title {
		 display: flex;
		 box-sizing: border-box;
		 padding: 10px 15px;
		 height: 50px;
		 .store-name {
			 font-size: 24px;
			 line-height: 30px;
			 font-weight: 500;
		 }
		 .operation {
			  padding: 1px;
		 }
	 }
	 .principal-table{
		 height: calc(100% - 115px);
		 width: calc(100% - 30px);
		 margin: 0 auto;
	 }
 }
</style>

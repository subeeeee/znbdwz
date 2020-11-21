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
					el-tree(
						:data="tree"
						:props="defaultProps"
						@node-click="handleNodeClick"
						:highlight-current="true"
					)
				.table
					.table-content
						.serch-box
							el-input(class="serch-input" placeholder="姓名/手机号码" v-model="serchData.inputContent")
							el-button(class="serch-btn" type="primary") 搜索
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
								el-table-column( prop="index" label="姓名" min-width="60" align="center" header-align="center")
								el-table-column( prop="index" label="手机号码" min-width="120" align="center" header-align="center")
								el-table-column( prop="index" label="用户角色" min-width="120" align="center" header-align="center")
								el-table-column( prop="index" label="用户状态" min-width="120" align="center" header-align="center")

					.footer
						el-button(@click="submit" size="medium" type="primary") 确 定
						el-button(@click="closeDialog" size="medium") 取 消

</template>

<script>
export default {
	name: "TransferCusterDialog",
	props: {
		isShow: {
			type: Boolean,
			required: true,
			default: true
		},
	},
	data() {
		return {
			defaultProps: {
				children: 'children',
				label: 'label'
			},
			tree: [{
				label: '一级 1',
				children: [{
					label: '二级 1-1',

				}]
			}],
			serchData: {
				inputContent: '',
			},
			tableData: [{index: 123123123123}]
		}
	},
	mounted() {
		// .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content
	},
	methods: {
		/**
		 * 选中一条
		 * */
		handleCheck(row) {
			row.isChecked = true
			console.log(row)
		},
		handleNodeClick(data) {
			console.log(data)
		},
		closeDialog() {
			this.$emit('update:isShow', false)
		},
		submit() {

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

				.serch-box {
					display: flex;

					.serch-input {

					}

					.serch-btn {

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

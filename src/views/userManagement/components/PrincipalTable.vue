<template lang="pug">
	.PrincipalTable
		.principal-title
			.store-name {{storeName}}
			.operation
				el-button(type="primary" class="search-submit" @click="addPrincipal" icon="el-icon-plus") 添加负责人
		el-table(
			:data="tableData"
			class="principal-table"
			:style="'border-top:2px solid' + themeColor"
		)
			el-table-column(prop="name" label="姓名" min-width="120")
			el-table-column(prop="name" label="电话号码" min-width="120")
			el-table-column(prop="name" label="用户角色" min-width="120")
			el-table-column(prop="name" label="用户状态" min-width="120")
			el-table-column(prop="name" label="报备客户" min-width="120")
			el-table-column(prop="name" label="有效客户" min-width="120")
			el-table-column(prop="name" label="管理" width="100")
				template(slot-scope="scope")
					el-dropdown(trigger="click" size="small")
						el-button(type="text" size="small") 操作
						el-dropdown-menu(slot="dropdown")
							el-dropdown-item() 停用
							el-dropdown-item() 客户转移
							el-dropdown-item() 编辑
							el-dropdown-item() 删除

		el-pagination(
			@current-change="currentChange"
			:current-page.sync="page.currentPage"
			:page-size="page.pageSize"
			layout="prev, pager, next, jumper"
			:total="page.total"
		)
</template>

<script>
import {mapGetters} from 'vuex'
export default {
	name: "PrincipalTable",
	props: [ 'channelStatus' ],
	computed: {
		...mapGetters({
			themeColor: 'GET_COLOUR'
     })
	},
	data() {
		return {
			storeName: '',
			tableData:[1,2,3,4,5],
			page: {
				currentPage: 0,
				pageSize: 0,
				total: 0
			}
		}
	},
	methods: {
		addPrincipal() {

		},
		currentChange(){

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

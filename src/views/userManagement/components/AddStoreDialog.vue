<template lang="pug">
	.AddStoreDialog
		el-dialog(
			:title="'添加门店'"
			:visible.sync="isShow"
			width="700px"
			:close-on-click-modal="false"
			:show-close="false"
		)
			el-form(:model="storeForm" :rules="storeRules" label-width="100px")
				el-row()
					el-col(:span="24")
						el-form-item(label="门店名称" prop="storeName")
							el-input(placeholder="门店名称" v-model="storeForm.storeName")
				el-row()
					el-col(:span="12")
						el-form-item(label="门店店长" prop="storeName")
							el-input(placeholder="门店店长" v-model="storeForm.masterName")
					el-col(:span="12")
						el-form-item(label="电话号码" prop="storeName")
							el-input(placeholder="电话号码" v-model="storeForm.phone")
				el-form-item( label="授权项目：")
					el-checkbox-group(v-model="storeForm.proIdList")
						el-checkbox(:label="item.value" v-for="(item, index) in allProList" :key="index") {{item.label}}
			span( slot="footer" class="dialog-footer")
				el-row
					el-col(:span="24"  style="text-align:right")
						el-button(icon="el-icon-close" @click="handleClose") 关 闭
						el-button(type="primary" icon="el-icon-check") 确 定
</template>

<script>
	export default {
		name: "AddStoreDialog",
		props: {
			isShow: {
				type: Boolean,
				required: true
			}
		},
		data() {
			return {
				allProList:[],
				storeForm: {
					storeName:'',
					masterName:'',
					phone:'',
					proIdList: []
				},
				storeRules: {
					storeName: [
						{required: true, message: '必填项不能为空', trigger:'blur'}
					],
					masterName: [
						{required: true, message: '必填项不能为空', trigger:'blur'}
					],
					phone: [
						{required: true, message: '必填项不能为空', trigger:'blur'}
					],
					proIdList: [
						{required: true, message: '必填项不能为空', trigger:'blur'}
					]
				},
			}
		},
		methods: {
			handleClose() {
				this.$emit('update:isShow', false)
			}
		}
	}
</script>

<style scoped lang="scss">
	.AddStoreDialog {

	}
</style>

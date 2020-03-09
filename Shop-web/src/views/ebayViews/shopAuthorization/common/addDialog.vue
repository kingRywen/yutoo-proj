<template>
	<div>
		<yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="50%" @close="closeMethod" append-to-body>
			<span>{{loginUrl}}</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="closeMethod">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: ["params"],
		data() {
			return {
				dialogVisible: false,
				formData: {},
				activeFields: [{
						label: "店铺名称",
						name: "sellerAlias",
						span: 24,
						type: "input",
						rows: 5,
						required: "true"
					}

				],
				loginUrl: '',
			};
		},
		methods: {
			_initData() {
				if (this.params.edit) {
					this.formData.sellerAlias = this.params.sellerAlias
				}

			},

			_close() {

			},
			_submit() {
				return this.$refs.form.validate().then(() => {
					let datas = {
						...this.formData,
						...this.params
					};
					if (this.params.edit) {
						return this.$api[`sellerAuthUpdate`](datas).then(data => {
							return Promise.resolve("reset");
						})
					} else {
						return this.$api[`sellerAuthSave`](datas).then(data => {
							this.loginUrl = data.loginUrl
							this.openDialog()
							// return  Promise.resolve("reset");
						})

					}
				});
			},
			openDialog() {
				this.dialogVisible = true;
			},
			closeMethod(){
				GLOBAL.vbus.$emit('toggle.mainlayoutDialog', false)
			},
		},
		created() {

		}
	};
</script>

<style>
</style>

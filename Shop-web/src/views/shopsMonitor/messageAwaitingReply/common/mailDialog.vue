<template>
	<div class="content">
		<div class="main" id="mainScroll">
			<div class="mainItem" v-for="item in messageList">
				<div class="item">
					<div class="itemDate" :style="{float:item.buyerMsg?'left':'right'}">{{item.msgDate}}</div>
					</br>
					<div class="itemText" :style="{float:item.buyerMsg?'left':'right',backgroundColor:item.buyerMsg?'#CFE7EB':'#FAFAFA'}">{{item.msgBody}}</div>
					</br>
				</div>
			</div>
			<div v-if="params.isShow">
				<el-form :model="ruleForm" :rules="rules" ref="form">
					<el-form-item prop="textarea">
						<el-input type="textarea" @blur="blurMethod" @focus="focusMethod" :rows="rows" placeholder="请输入内容" style="margin-top: 10px;"
						 v-model="ruleForm.textarea">
						</el-input>
					</el-form-item>
				</el-form>
				<span v-if="onlyNum>-1">剩余字符数:{{onlyNum}}</span>
				<span v-else style="color: red;">您已输入超过4000字,请减少输入字数</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["params"],
		data() {
			var checkText = (rule, value, callback) => {
				if (!value) return callback(new Error('请输入回复内容'))
				if (value.length > 4000) return callback(new Error('您已输入超过4000字,请减少字数'))
				callback()
			}
			return {
				rows: 2,
				messageList: [],
				ruleForm: {
					textarea: '',
				},
				rules: {
					textarea: [{
						validator: checkText,
						trigger: 'blur'
					}, ]
				},
			}
		},
		methods: {
			focusMethod() {
				this.rows = 4
			},
			blurMethod() {
				this.rows = 2
			},
			getList() {
				let params = {
					platformId: this.platformId,
					siteId: this.siteId,
					sellerId: this.sellerId,
					id: this.params.id
				}
				this.$api['homeCusMsgRecList'](params).then((data) => {
					this.messageList = data.data
					this.$nextTick(function() {
						this.$emit('toBottom')
					})
				})
			},
			_submit() {
				return this.$refs.form.validate().then(() => {
					let params = {
						platformId: this.platformId,
						siteId: this.siteId,
						sellerId: this.sellerId,
						id: this.params.id,
						msgBody: this.ruleForm.textarea
					}
					return this.$api['homeCusMsgReply'](params).then((res) => {
						return Promise.resolve("reset");
					})
				})
			},
		},
		mounted() {
			this.getList()
		},
		computed: {
			onlyNum() {
				return 4000 - this.ruleForm.textarea.length
			}
		},
	};
</script>

<style scoped="scoped">
	.item {
		width: 100%;
		height: auto;
		overflow: hidden;
		margin: 5px 0;
	}

	.itemDate {
		font-size: 12px;
		color: #9DA0A4;
	}

	.itemText {
		max-width: 70%;
		height: auto;
		font-size: 14px;
		padding: 8px;
		border-radius: 10px;
		word-wrap: break-word;
		word-break: normal;
	}
</style>

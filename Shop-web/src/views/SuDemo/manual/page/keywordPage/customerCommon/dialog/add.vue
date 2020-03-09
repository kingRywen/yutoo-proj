<template>
	<div>
		<yt-form ref="form" label-width="80px" :fields="activeFields" :formData="formData"></yt-form>
	</div>
</template>

<script>
	export default {
		props: ["params"],
		data() {
			var vm = this
			return {
				formData: {
					keywordQuerys: ''
				},
				activeFields: [{
						label: "选择系列",
						name: "campaignIds",
						span: 24,
						type: "select",
						options: vm.getCountry1,
						required: true,
						labelWidth: '90px',
						filterable: true,
						placeholder: '请输入或选择系列',
					},
					{
						label: "否定词类型",
						name: "matchType",
						span: 24,
						type: "select",
						options: [{
								label: '精确否定',
								value: 'negativeExact'
							},
							{
								label: '词组否定',
								value: 'negativePhrase'
							},
						],
						required: true,
						labelWidth: '90px'
					},
					{
						label: "关键词",
						name: "keywordQuerys",
						span: 24,
						type: "textarea",
						required: "adKeyword",
						placeholder: '多个换行输入',
						rows: 4,
						labelWidth: '90px'
					},

				],

			};
		},
		methods: {
			_submit() {
				return this.$refs.form.validate().then(() => {
					if (this.formData.keywordQuerys) {
						let newKeyword = this.moreRowText(this.formData.keywordQuerys)
						delete this.formData.keywordQuerys
						this.formData.keywordTexts = newKeyword
					}
					let datas = {
						platformId: this.platformId,
						siteId: this.siteId,
						sellerId: this.sellerId,
						campaignIds: [this.formData.campaignIds],
						matchType: this.formData.matchType,
						keywordTexts: this.formData.keywordTexts,
					};
					let url = 'adCampaignNegativeKeywordAddKeyword'
					if (this.params.type === 'noKey1') {
						delete datas.campaignIds
						datas.adGroupIds = [this.$route.query.objectId]
						url = 'adNegativeKeywordAddKeyword'
					}
					if (this.params.type === 'noKey2') {
						delete datas.campaignIds
						datas.campaignIds = [this.$route.query.groupObjectId]
						url = 'adCampaignNegativeKeywordAddKeyword1'
					}
					return this.$api[url](datas).then(data => {
						return Promise.resolve(true);
					})


				});
			},
			getCountry1() {
				let params = {
					adType: 0,
					platformId: this.platformId,
					siteId: this.siteId,
					sellerId: this.sellerId,
					stateArr: ['enabled', 'paused'],
				}
				return this.$api['adKeywordQueryAdDataOption'](params).then((res) => {
					return res.data.map(el => {
						return {
							label: el.name,
							value: el.id
						}
					})
				})
			}
		},
		created() {
			if (this.params.type === 'noKey1' || this.params.type === 'noKey2') this.activeFields.splice(0, 1)
			this.formData.keywordQuerys = this.params.datas.join('\n')
		},
		computed: {

		}

	};
</script>

<style>
</style>

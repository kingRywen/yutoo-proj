<template>
	<ElForm :disabled="disabled" ref="form1" :model="data" size="small" label-width="90px" label-position="left">
		<div style="display: flex;">
			<div>
				<ElFormItem label="优化方式" prop="seoType" :rules="[{ required: true, message: '请选择优化方式' }]">
					<ElSelect v-model="data.seoType" @change="handlerSeoChange" style="width: 130px;">
						<ElOption v-for="(item, index) in seoTypes" :key="index" :label="item.label" :value="item.value"></ElOption>
					</ElSelect>
				</ElFormItem>
			</div>
			<div style="margin-left: 189px;">
				<ElFormItem :rules="[{ required: true, message: `请选择预算方式` }]" prop="bidType" label="预算方式" label-width="69px">
					<ElSelect style="width: 130px;" v-model="data.bidType" @change="handlerYsChange">
						<ElOption v-for="(item, index) in ysTypes" :key="item.value" :label="item.label" :value="item.value"></ElOption>
					</ElSelect>
				</ElFormItem>
			</div>
		</div>
		<div style="display: flex;">

			<div >
				<ElFormItem :rules="[{ required: true, message: `请输入默认预算` }]" prop="defaultAddBid" label="默认预算" label-width="90px">
					<ElInputNumber @change="defaultBidMethod" v-model.trim.number="data.defaultAddBid" :min="1" :precision="2" :max="9999999999"
					 :controls="false"></ElInputNumber>
				</ElFormItem>
			</div>
		</div>

		<!-- 每日 -->
		<template v-if="!data.seoType">
			<div v-if="data.bidType !== 0">
				<ElFormItem prop="oldBid" label="总预算" label-width="90px" :rules="totalPriceValidate(0)">
					<ElInputNumber @change="totalBidMethod" :disabled="data.bidType === 1 ? true : false" v-model.trim.number="data.totalBid"
					 :precision="2" :max="9999999999" :controls="false"></ElInputNumber>
				</ElFormItem>
			</div>
			<Form :seoTypeItem='data.seoType' :defaultPrice="data.defaultAddBid" @getAllPriceMethod='getArrPrice' :ysTypeShow='data.bidType'
			 :allPrice='data.totalBid' :disabled="disabled" :title="labelName1" :data="data" :strategyDetail="data.strategyDetail"
			 ref="form2" />
		</template>
		<!-- 周一到周日 -->
		<template v-else>
			<ElTabs type="card" v-model="activeName">
				<ElTabPane v-for="(item, index) in weeks" :label="item.label" :name="item.name" :key="index">
					<div v-if="data.bidType !== 0">
						<ElFormItem prop="oldBid" label="总预算" label-width="90px" :rules="totalPriceValidate(1)">
							<ElInputNumber @change="totalBidMethod" :key="index" :disabled="data.bidType === 1 ? true : false"
							 v-model.trim.number="data.totalBidList[parseInt(item.name)]" :precision="2" :max="9999999999" :controls="false"></ElInputNumber>
						</ElFormItem>
					</div>
					<Form :seoTypeItem='data.seoType' :allPrice='data.totalBidList' :ysTypeShow='data.bidType' :defaultPrice="data.defaultAddBid"
					 :disabled="disabled" :title="labelName1" :data="item.data" :weekDay="+item.name" :strategyDetail="item.data.strategyDetail"
					 @getAllPriceMethod='getArrPrice' ref="form3" />
				</ElTabPane>
			</ElTabs>
		</template>
	</ElForm>
</template>

<script>
	import Form from './form'
	export default {
		props: ['params'],
		components: {
			Form
		},
		data() {
			return {
				disabled: false,
				activeName: '1',
				weeks: [{
						label: '周一',
						name: '1'
					},
					{
						label: '周二',
						name: '2'
					},
					{
						label: '周三',
						name: '3'
					},
					{
						label: '周四',
						name: '4'
					},
					{
						label: '周五',
						name: '5'
					},
					{
						label: '周六',
						name: '6'
					},
					{
						label: '周日',
						name: '0'
					}
				],
				ysTypes: [{
						label: '固定值',
						value: 0
					},
					{
						label: '固定值递增',
						value: 1
					},
					{
						label: '百分比递增',
						value: 2
					}
				],
				seoTypes: [{
						label: '每日',
						value: 0
					},
					{
						label: '周一到周日',
						value: 1
					}
				],

				data: {
					seoType: 0,
					bidType: 0,
					totalBid: null,
					defaultAddBid: null,
					totalBidList: [],
					strategyDetail: [{
						hourStart: null,
						hourEnd: null
					}]
				}
			}
		},
		computed: {
			labelName() {
				return '预算'
			},
			labelName1() {
				return '每日预算'
			},
			weekIndex() {
				let num = 0
				switch (parseInt(this.activeName)) {
					case 1:
						num = 0
						break;
					case 2:
						num = 1
						break;
					case 3:
						num = 2
						break;
					case 4:
						num = 3
						break;
					case 5:
						num = 4
						break;
					case 6:
						num = 5
						break;
					case 0:
						num = 6
						break;
				}
				return num
			}
		},
		created() {
			let _weeks = this.weeks.map(el => ({
				...el,
				data: {
					strategyDetail: [{
						weekDay: +el.name,
						hourStart: null,
						hourEnd: null
					}]
				}
			}))
			this.weeks = _weeks
		},
		methods: {
			totalPriceValidate(type) {
				let checkTotalPrice = (rule, value, cb) => {
					if (type === 0) {
						if (this.data.totalBid == 0) return cb(new Error('总预算不能为0'))
						if (!this.data.totalBid) return cb(new Error('总预算不能为空'))
					} else {
						let num = this.data.totalBidList[parseInt(this.activeName)]
						if (num == 0) return cb(new Error('总预算不能为0'))
						if (!num) return cb(new Error('总预算不能为空'))
					}
					cb()
				}
				return [{
					validator: checkTotalPrice
				}]
			},
			totalBidMethod(e) {
				this.$nextTick(function() {
					if (this.data.bidType && this.data.bidType === 2) {
						if (this.data.seoType === 0) {
							this.$refs.form2.changeSingleMethod(0, e)
						} else {
							this.$refs.form3[this.weekIndex].changeSingleMethod(1, e)
						}
					}
				})

			},
			handlerYsChange(e) {
				this.$nextTick(function() {
					if (this.data.seoType === 0) {
						//每日
						this.data.strategyDetail.forEach((e) => {
							e.bid = null
							e.bidPct = null
						})
						this.data.totalBid = null
					} else {
						//周一到周日
						this.weeks.forEach((e) => {
							e.data.strategyDetail.forEach((i) => {
								i.bid = null
								i.bidPct = null
							})
						})
						this.data.totalBid = null
					}
					if (this.data.bidType === 1) {
						this.defaultBidMethod()
					}
				})
			},
			handlerSeoChange(val) {
				if (!val) {
					this.data.strategyDetail = [{
						hourStart: null,
						hourEnd: null
					}]
				} else {
					this.weeks.forEach(el => {
						el.data.strategyDetail = [{
							hourStart: null,
							weekDay: +el.name,
							hourEnd: null
						}]
					})
					this.activeName = '1'
				}
			},
			// 设置weekday的值
			setWeekDay(strategyDetail, save) {
				strategyDetail = JSON.parse(JSON.stringify(strategyDetail))
				let getTime = time => {
					if (time < 10) {
						return `0${time}: 00`
					} else {
						return `${time}: 00`
					}
				}

				strategyDetail.forEach(el => {
					el.hourStart = save ? parseInt(el.hourStart) : getTime(el.hourStart)
					el.hourEnd = save ? parseInt(el.hourEnd) : getTime(el.hourEnd)
					el.bidPct = save ? el.bidPct ? parseInt(el.bidPct) / 100 : null : el.bidPct * 100
					el.totalBid = save ? this.data.seoType == 0 ? this.data.totalBid : this.data.totalBidList.find((e, index) => {
						return index === el.weekDay
					}) : el.totalBid
				})

				return strategyDetail
			},
			defaultBidMethod() {
				this.$nextTick(function() {
					if (this.data.bidType && this.data.bidType === 1) {
						if (this.data.seoType === 0) {
							this.$refs.form2.changeAllMethod()
						} else {
							this.$refs.form3[this.weekIndex].changeAllMethod()
						}
					}
				})
			},
			validate() {
				let {
					form1,
					form2,
					form3 = []
				} = this.$refs
				let forms = [form1, form2, ...form3].filter(el => el != null)
				return Promise.all(forms.map(form => form.validate()))
					.then(() => {
						console.log('subinyu')
						let strategyDetail = [],
							{
								strategyDetail: _strategyDetail,
								...info
							} = this.data,
							params = {
								...info
							}
						if (!info.seoType) {
							strategyDetail.push(..._strategyDetail)
						} else {
							this.weeks.forEach((el, index) => {
								if (this.$refs.form3[index].valid) {
									let {
										strategyDetail: __strategyDetail
									} = el.data
									strategyDetail.push(...__strategyDetail)
								}
							})
						}
						let onceType = this.setWeekDay(strategyDetail, 1).some((e) => {
							return e.hourEnd && e.hourStart && e.bid
						})
						if (this.data.seoType === 1 && !onceType) return this.$refs.form3[this.weekIndex].validateItem()
						return { ...params,strategyDetail: this.setWeekDay(strategyDetail, 1)}
					})
					.catch(weekDay => {
						if (weekDay) {
							this.activeName = weekDay + ''
						}
						return Promise.reject()
					})
			},
			getArrPrice(data) {
				let type = data.type;
				let num = data.data;
				type === 0 ? this.data.totalBid = num : this.$set(this.data.totalBidList, data.index, num)
			}
		}
	}
</script>

<style>
</style>

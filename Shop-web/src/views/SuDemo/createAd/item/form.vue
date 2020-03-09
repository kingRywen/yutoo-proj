<template>
	<ElForm :disabled="disabled" ref="form" style="flex: 1" size="small" :model="data" label-width="90px">
		<div v-for="(item, index) in strategyDetail" class="flex">
			<ElFormItem label="时间段">
				<div class="flex">
					<ElFormItem label-width="0" :prop="`strategyDetail.${index}.hourStart`" :rules="timeRule('start', item, index)">
						<el-time-select @focus="defaultPriceTip" style="width:130px" placeholder="起始时间" v-model="item.hourStart" @change="changeTotalPriceMethod"
						 :picker-options="{start: '00:00',step: '01:00',end: '23:00', minTime: index === 0 ? undefined : getMinTime(data.strategyDetail[index - 1].hourEnd)}"></el-time-select>
					</ElFormItem>
					<span class="ml10 mr10">~</span>
					<ElFormItem label-width="0" :prop="`strategyDetail.${index}.hourEnd`" :rules="timeRule('end', item, index)">
						<el-time-select @focus="defaultPriceTip" placeholder="结束时间" style="width:130px" v-model="item.hourEnd" @change="changeTotalPriceMethod"
						 :picker-options="{start: '01:00',step: '01:00',end: '24:00', minTime: item.hourStart}"></el-time-select>
					</ElFormItem>
				</div>
			</ElFormItem>


			<!-- 占比 -->
			<ElFormItem v-if="ysTypeShow === 2 ? true : false" label="占比" label-width="60px" class="custom-label-right" style="margin-left: 40px;"
			 :prop="`strategyDetail.${index}.bidPct`" :rules="perRule(item, index)">
				<ElInputNumber @change="percentMethod($event,index)" v-model.trim.number="item.bidPct" :min="0" :max="100"
				 :controls="false"></ElInputNumber>%
			</ElFormItem>



			<ElFormItem :label="ysTypeShow === 2 || ysTypeShow === 1 ? '递增预算' : title" label-width="100px" class="custom-label-right" :prop="`strategyDetail.${index}.bid`"
			 :rules="[{ required: true, message: `请输入${title}` }]">
				<ElInputNumber class="inputClass" @focus="defaultPriceTip('input',index)" @change="changeAllMethod(index)"
				 :disabled="ysTypeShow === 2 ? true : false" v-model="item.bid" :min="title==='关键词出价' ? 0.02 : ysTypeShow === 2 || ysTypeShow === 1 ? 0 : 1" :precision="2" :max="9999999999"
				 :controls="false"></ElInputNumber>
			</ElFormItem>
			<div class="ml10" v-if="!disabled">
				<ElButton @click="addItem(index)" size="small" type="plain" icon="el-icon-plus" plain></ElButton>
				<ElButton @click="delItem(index)" v-if="strategyDetail.length > 1" size="small" type="danger" icon="el-icon-delete"
				 plain></ElButton>
			</div>
		</div>
	</ElForm>
</template>

<script>
	export default {
		props: {
			seoTypeItem: {
				default: 0
			},
			defaultPrice: {
				default: null
			},
			allPrice: {
				default: null
			},
			ysTypeShow: {
				default: 0
			},
			disabled: {
				default: false
			},
			title: String,
			data: {
				default: () => ({
					strategyDetail: [{
						hourStart: null,
						hourEnd: null
					}]
				})
			},
			strategyDetail: Array,
			weekDay: Number
		},
		data() {
			return {
				valid: false,
			}
		},
		methods: {
			perRule(item, index) {
				let checkPer = (rule, value, cb) => {
					if (!this.strategyDetail[index].bidPct) return cb(new Error('占比不能为空'))
					let num = 0
					this.strategyDetail.forEach((e) => {
						num += e.bidPct
					})
					if (num > 100) return cb(new Error('总占比不能超过100'))
					cb()
				}
				return [{
					validator: checkPer
				}]
			},
			validateItem() {
				return this.$refs.form.validate()
			},
			validate() {
				this.valid = false
				if (this.weekDay != null) {
					if (this.strategyDetail.length === 1) {
						let {
							bid,
							hourEnd,
							hourStart,
							bidPct
						} = this.strategyDetail[0]
						if (hourEnd == null && hourStart == null) {
							return Promise.resolve()
						} else {
							return this.$refs.form
								.validate()
								.then(() => {
									this.valid = true
								})
								.catch(() => {
									return Promise.reject(this.weekDay)
								})
						}
					}
				}
				return this.$refs.form
					.validate()
					.then(() => {
						this.valid = true
					})
					.catch(() => {
						return Promise.reject(this.weekDay)
					})
			},
			timeRule(type, item, index) {
				let checkTime = (rule, value, cb) => {
					if (!value || value === '') {
						if (this.strategyDetail[index].hourStart === null && this.strategyDetail[index].hourEnd) {
							return cb(new Error('开始时间不能大于结束时间'))
						}
						cb(new Error('时间不能为空'))
					}
					if (type === 'start') {
						if (parseInt(value) > parseInt(item.hourEnd)) {
							this.strategyDetail[index].hourStart = null
							cb(new Error('开始时间不能大于结束时间'))
						}
					}
					cb()
				}
				return [{
					validator: checkTime
				}]
			},
			getMinTime(time) {
				time = parseInt(time) - 1
				if (time < 10) {
					return `0${time}: 00`
				} else {
					return `${time}: 00`
				}
			},
			addItem(index) {
				let el = {
					hourStart: null,
					hourEnd: null
				}
				if (this.weekDay != null) {
					el.weekDay = this.weekDay
				}
				this.data.strategyDetail.splice(index + 1, 0, el)
			},
			delItem(index) {
				this.data.strategyDetail.splice(index, 1)
				//动态计算
				if (this.ysTypeShow === 1) this.changeAllMethod()
			},
			changeTotalPriceMethod() {
				this.$nextTick(function() {
					console.log(this.data.strategyDetail)
					if (this.ysTypeShow === 1) {
						this.changeAllMethod()
					}
				})
			},
			//每日预算改变总预算
			changeAllMethod(index) {
				this.$nextTick(function() {

					if (this.ysTypeShow === 1) {
						let type = this.seoTypeItem
						let list = []
						type === 0 ? list = this.data.strategyDetail : list = this.data.strategyDetail.filter((e) => {
							return e.weekDay === this.weekDay
						})
						let timeRange = 0
						let allPrice = 0
						list.forEach(e => {

							timeRange += parseInt(e.hourEnd) - parseInt(e.hourStart)
							allPrice += e.bid
						})
						let result = (24 - timeRange) * this.defaultPrice + allPrice
						if (type === 0) {
							let returnData = {
								data: result,
								type,
							}
							this.$emit('getAllPriceMethod', returnData)
						} else if (type === 1) {
							let returnData = {
								data: result,
								type,
								index: this.weekDay
							}
							this.$emit('getAllPriceMethod', returnData)
						}
					}
				})
			},
			percentMethod(e, index) {
				this.$nextTick(function() {
					if (this.seoTypeItem === 0) {
						this.data.strategyDetail[index].bid = this.allPrice * e / 100
					} else {
						let price = this.allPrice.find((e, index) => {
							return index === parseInt(this.weekDay)
						})
						this.data.strategyDetail[index].bid = price * e / 100
					}
				})
			},
			defaultPriceTip(type, index) {
				this.$nextTick(function() {
					if (this.ysTypeShow === 1) {
						if (!this.defaultPrice) {
							return this.$message.warning('请先输入默认预算!')
						}
						if (type === 'input') {
							let list = this.data.strategyDetail
							list.forEach(e => {
								if (!e.hourStart || !e.hourEnd) {
									return this.$message.warning('请先补全时间段,否则无效果!')
								}
							})
						}
					}
				})
			},
			changeSingleMethod(type, price) {
				if (type) {
					//周一到周日			
					this.data.strategyDetail.forEach((e) => {
						if (e.weekDay === this.weekDay) {
							e.bid = price * e.bidPct / 100
						}
					})
					console.log(this.data.strategyDetail)
				} else {
					//每日
					this.data.strategyDetail.forEach((e) => {
						e.bid = price * e.bidPct / 100
					})
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	/deep/.custom-label-right {
		/deep/.el-form-item__label {
			text-align: right;
		}
	}
</style>

<template>
	<div class="w1100 calendarClass">
		<div>
			<span>说明</span>
			<span>红色区域日期表示未导入,点击可以导入</span>
		</div>
		<el-calendar v-model="value">
			<template
			    slot="dateCell"
			    slot-scope="{date, data}">
			    <p :class="data.isSelected ? 'is-selected' : ''" :style="{background:dateList.indexOf(data.day) == -1 ? '#fff' : 'rgb(245,108,108)'}" @click="showDialog(data.day)" >
			      {{ data.day.split('-').slice(1).join('-') }} {{ data.isSelected ? '✔️' : ''}}
			    </p>
			  </template>
		</el-calendar>
	</div>
</template>

<script>
	export default {
	    data() {
	      return {
	        value: new Date(),
			dateList:[]
	      }
	    },
		methods:{
			getData(){
				let { today, computedDay } = this.cfuns.getDay(365)
				let params = {
					...this.storeInfo,
					productType:1,
					rptDateMax:today,
					rptDateMin:computedDay
				}
				this.$api['keyword/productFlowRptLogNoImportDate'](params).then((res)=>{
					//this.dateList = res.data
					this.dateList = ['2019-12-31','2020-01-03','2020-01-05']
				})
			},
			showDialog(date){
				if(this.dateList.indexOf(date) !== -1) {
					let params = {
						success: this.getData,
						date
					}
					return this._openDialog({title:'导入变体报告',width:'100%',params:{params},component:() => import("./import"),okBtnText:'',cancelBtnText:'关闭'})
				}
			}
		},
		mounted(){
			this.$nextTick(()=>{
				this.getData()
			})
		}
	  }
</script>

<style lang="scss">
	.calendarClass{
		>div:nth-child(1){
			margin-top: 10px;
			span{
				font-size: 12px;
			}
			>span:nth-child(1){
				display: inline-block;
				background: rgb(0,152,152);
				font-size: 13px;
				padding: 3px 19px;
				border-radius: 4px;
				color: #fff;
				margin-right: 10px;
			}
		}
		.is-selected {
		    color: #1989FA;
		}
		.el-calendar-day{
			padding: 0;
		}
		p{
			margin: 0;
			height: 100%;
			width:100%;
			padding: 10px;
			box-sizing: border-box;
		}
	}
	
</style>

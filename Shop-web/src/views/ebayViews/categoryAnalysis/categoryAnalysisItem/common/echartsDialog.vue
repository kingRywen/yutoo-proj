<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="时间范围:">
                 <el-date-picker
                    v-model="rangeTime"
                    type="daterange"
                    size='mini'
                     @change='dateChange'
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
			<el-form-item>
				<el-select v-model="formInline.period" size="mini" @change="changeMethod">
					<el-option
						v-for="item in options"
						:key='item.value'
						:label="item.name"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
        </el-form>
        <div v-if='isData'>
            <div v-loading="echartsLoading"  class="chart-body" ref="chart"> </div>
        </div>
        <div v-else style='line-height:400px;text-align:center;'> 暂无数据</div>
         <!-- {{params}} -->
    </div>
   
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs';
export default {
    props:['params'],
    data() {
        return {
			options:[
				{name:'按天',value:1},
				{name:'按周',value:7},
				{name:'按月',value:30}
			],
            echartsLoading:false,
            formInline:{
				period:30,
            },
			rangeTime:null,
            pickerOptions:{
				shortcuts: [
					{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, 
					{
						text: '最近六个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
							picker.$emit('pick', [start, end]);
						}
					},
					{
						text:'最近一年',
						onClick(picker) {
							const end = dayjs().format('YYYY-MM-DD');
							const start = dayjs().subtract(1,'year').format('YYYY-MM-DD');
							picker.$emit('pick', [start, end]);
						}
					}
				],
                disabledDate:(time)=> {
                    return ( 
                        time.getTime() > Date.now() ||   time.getTime() < (new Date(this.params.resultTime).getTime()-24*60*60*1000)
                    )
                },
            },
            echartsData:null,
            isData:true,

        };
    },
    methods: {
		changeMethod(e){
			this.getData();
		},
        //选择时间范围改变
        dateChange(v){
			if (v) {
				this.formInline.startTime=v[0];
				this.formInline.endTime=v[1];
				this.getData();
			}else{
				this.isData = false
			}
        },
        //初始化echarts
        initChart(data) {
            if(this.chart){
                this.chart.dispose();
                this.chart = null;
            }
            if( !data.length){
                return
            }
            this.chart = echarts.init(this.$refs.chart);
            let Xdata=[];//横坐标
            let datas=[];//数据  
            // Xdata.sort((a,b)=>{
            //     return new Date(a).getTime() - new Date(b).getTime()
            // });
			let titleType = ['评价数']
			if (this.params.isCategory) titleType = ['订单数']
			if(this.params.isSeller) titleType = ['订单数']
			
			let seriesDouble = [{name:'好评',data:[],type:'line'},{name:'中差评',data:[],type:'line'}]
			if (this.params.sellerDouble) {
				
				data.forEach((i,index)=>{
					if (i.reviewLevel === 0) {
						i.list.forEach(e =>{
							seriesDouble[0].data.push(e.cnt)
							Xdata.push(e.statTime);
						})
					}
					if (i.reviewLevel === 1) {
						i.list.forEach(e =>{
							seriesDouble[1].data.push(e.cnt)
						})
					}
				})
				titleType = ['好评','中差评']
			}else{
				data.forEach(i=>{
				    Xdata.push(i.statTime);
					datas.push(i.cnt)
				});
			}  
			
			let seriesOne = [{name:titleType,data:datas,type:'line'}]
			let vm = this
            this.chart.setOption({
                xAxis: {
                    type: 'category',
					boundaryGap: false,
                    data: Xdata
                },
                legend: {
                    data:titleType
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        //showDetail:false
                            handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    },

                ],
                tooltip: {
                    trigger: 'axis',
                    confine:true,
					padding:[0,5,10,5],
					formatter(params) {
                        return vm.$.getChartTooltip(params, param => `$${param.data}`)
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: this.params.sellerDouble?seriesDouble:seriesOne
            });
           
        },
        getData(){
            this.echartsLoading=true;
            this.isData=true;
            if(this.chart){
                this.chart.dispose();
            }
            this.$api[this.params.url](this.formInline)
            .then(data => {
                if(data.code===0){
					
                    this.echartsLoading=false;
                    this.echartsData=data.data;
                    this.initChart(this.echartsData);
                    if(this.echartsData.length===0){
                        this.isData=false;
                    }
                   
                }
            })
        }
    },
    created() {
		let startTime = dayjs().subtract(1,'year').format('YYYY-MM-DD')
        let endTime=dayjs().format('YYYY-MM-DD');
		this.formInline.startTime=startTime; 
		this.formInline.endTime=endTime;
		this.rangeTime=[startTime,endTime];
		this.formInline.taskId = this.params.taskId
		if (this.params.isCategory) {
			this.formInline.category = this.params.category;
			this.formInline.siteId = this.siteId;			
		}else if(this.params.isSeller){
			this.formInline.sellerId = this.sellerId;
			this.formInline.siteId = this.siteId;
		}else if(this.params.isProduct){
			this.formInline.asin = this.params.asin
		}
        this.getData();
    },
    beforeDestroy() {
        if (!this.chart) {
            return;
        }
        this.chart.dispose();
        this.chart = null;
    },
};
</script>

<style scoped lang="scss">
.chart-body {
    height: 400px;
    width: 100%;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>

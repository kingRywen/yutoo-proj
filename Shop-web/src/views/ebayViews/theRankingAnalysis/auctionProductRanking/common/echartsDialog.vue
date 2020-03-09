<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item>
			    <el-select v-model="searchJobType" placeholder="请选择" size='mini' @change='selectAll' style='width:230px;' multiple collapse-tags clearable>
			        <el-option
			        v-for="item in options"
			        :key="item.value"
			        :label="item.name"
			        :value="item.value">
			        </el-option>
			    </el-select>
			</el-form-item>
            <el-form-item label="时间范围:">
                 <el-date-picker
                    v-model="formInline.rangeTime"
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
				<el-input size='mini' v-model="formInline.multipleFrequency"></el-input>
			</el-form-item>
			<el-form-item>
				倍抓取频率
			</el-form-item>
			<el-form-item>
				<el-button type="primary" plain size="mini" @click="rearchMethod">确认搜索</el-button>
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
			searchJobType: ['全部','自然搜索排名', '价格排名', 'bids数排名', '剩余时间排名', '拍卖天数排名', '运费排名', 'Watchers排名', '卖家评价数排名', '卖家好评率排名', '卖家月新增好评数排名', '卖家月新增中评数排名', '卖家月新增差评数排名', '开店时间排名', '支持退货天数排名', 'Item as described排名', 'Communication排名', 'Shipping time排名', 'Shipping charges排名'],
			oldSearchJobType:[],
			selectList:[],
            echartsLoading:false,
            options:[
				{name:'全部',value:'全部'},
				{name:'自然搜索排名',value:'自然搜索排名'},
				{name:'价格排名',value:'价格排名'},
				{name:'bids数排名',value:'bids数排名'},
				{name:'剩余时间排名',value:'剩余时间排名'},
				{name:'拍卖天数排名',value:'拍卖天数排名'},
				{name:'运费排名',value:'运费排名'},
				{name:'Watchers排名',value:'Watchers排名'},
				{name:'卖家评价数排名',value:'卖家评价数排名'},
				{name:'卖家好评率排名',value:'卖家好评率排名'},
				{name:'卖家月新增好评数排名',value:'卖家月新增好评数排名'},
				{name:'卖家月新增中评数排名',value:'卖家月新增中评数排名'},
				{name:'卖家月新增差评数排名',value:'卖家月新增差评数排名'},
				{name:'开店时间排名',value:'开店时间排名'},
				{name:'支持退货天数排名',value:'支持退货天数排名'},
				{name:'Item as described排名',value:'Item as described排名'},
				{name:'Communication排名',value:'Communication排名'},
				{name:'Shipping time排名',value:'Shipping time排名'},
				{name:'Shipping charges排名',value:'Shipping charges排名'},
			],
            formInline:{
                rangeTime:null,
                taskId:null,
                sellerId:null,
                startTime:null,
                endTime:null,
                parentAsin:null,
				multipleFrequency:1,
            },
            pickerOptions:{
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
		selectAll(val){
			const allValues = [];
			for (const item of this.options) {
			  allValues.push(item.value)
			}
			const oldVal = this.oldSearchJobType.length === 1 ? this.oldSearchJobType[0] : [];
			
			if (val.includes('全部')) this.searchJobType = allValues;
			if (oldVal.includes('全部') && !val.includes('全部')) this.searchJobType = [];
			if (oldVal.includes('全部') && val.includes('全部')) {
			  const index = val.indexOf('全部');
			  val.splice(index, 1); 
			  this.searchJobType = val
			}
			if (!oldVal.includes('全部') && !val.includes('全部') && !this.oldSearchJobType.length) this.searchJobType = [];
			if (!oldVal.includes('全部') && val.includes('全部') && !this.oldSearchJobType.length){
				const index = val.indexOf('全部');
				val.splice(index, 1); 
				this.searchJobType = val;
			}
			//用来选最后一项的时候把全部也勾选上
			if (!val.includes('全部') && val.length === 18 && this.searchJobType.length) {
				val.unshift('全部'); 
				this.searchJobType = val;
			}
			this.oldSearchJobType[0] = this.searchJobType;
		},
		rearchMethod(){
			this.getData();
		},
        //选择时间范围改变
        dateChange(v){
            this.formInline.startTime=v[0];
            this.formInline.endTime=v[1];
            
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
            let datas=[
				{name:'自然搜索排名',value:'webRank',type:'line',data:[]},
				{name:'价格排名',value:'priceRank',type:'line',data:[]},
				{name:'bids数排名',value:'bidsCntRank',type:'line',data:[]},
				{name:'剩余时间排名',value:'endTimeRank',type:'line',data:[]},
				{name:'拍卖天数排名',value:'auctionDaysRank',type:'line',data:[]},
				{name:'运费排名',value:'fareRank',type:'line',data:[]},
				{name:'Watchers排名',value:'watchersRank',type:'line',data:[]},
				{name:'卖家评价数排名',value:'reviewCntRank',type:'line',data:[]},
				{name:'卖家好评率排名',value:'positiveRateRank',type:'line',data:[]},
				{name:'卖家月新增好评数排名',value:'positiveCntD30Rank',type:'line',data:[]},
				{name:'卖家月新增中评数排名',value:'neutralCntD30Rank',type:'line',data:[]},
				{name:'卖家月新增差评数排名',value:'negativeCntD30Rank',type:'line',data:[]},
				{name:'开店时间排名',value:'openTimeRank',type:'line',data:[]},
				{name:'支持退货天数排名',value:'supportReturnDaysRank',type:'line',data:[]},
				{name:'Item as described排名',value:'itemAsDescribedRank',type:'line',data:[]},
				{name:'Communication排名',value:'communicationRank',type:'line',data:[]},
				{name:'Shipping time排名',value:'shippingTimeRank',type:'line',data:[]},
				{name:'Shipping charges排名',value:'shippingChargesRank',type:'line',data:[]},
			];//数据
            let legendData=[];//标题数组
			datas.forEach(i=>{
				legendData.push(i.name)
			})
            data.forEach(i=>{
                Xdata.push(i.statTime);
            });
			for(var i = 0;i<datas.length;i++){
				let flag = true
				if (flag) {
					for(var v = 0;v<data.length;v++){
						for(var g in data[v]){
							if (datas[i].value === g) {
								datas[i].data.push(data[v][g])
							}
						}
					}
				}
			}
			for(var i=0;i<datas.length;i++){
				let flag = false
				for(var v=0;v<this.searchJobType.length;v++){
					if (datas[i].name === this.searchJobType[v]) {
						flag = true
					}
				}
				if (!flag) {
					delete datas[i]
				}
			}
			// console.log(datas)
            // Xdata.sort((a,b)=>{
            //     return new Date(a).getTime() - new Date(b).getTime()
            // });
            let vm = this
            this.chart.setOption({
                xAxis: {
                    type: 'category',
					boundaryGap: false,
                    data: Xdata
                },
                legend: {
                    data:legendData,
                    type:'scroll'
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
                series: datas
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
        let time=dayjs().format('YYYY-MM-DD');
        this.formInline.startTime=time; 
        this.formInline.endTime=time;
        this.formInline.rangeTime=[time,time];
        this.formInline.taskId=this.params.taskId;
		this.formInline.parentAsin = this.params.parentAsin
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

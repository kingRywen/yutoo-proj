<template lang="html">
    <div class="chart">
        <layout>
            <template slot="title">SOUQ全站店铺数量趋势</template>
            <template slot="time">
                <selectTime :show="false"  @pieTime="getTime"/>
            </template>
            <template slot="content">
                <div class="myecharts" v-loading="loading"  element-loading-text="拼命加载中...">
                    <chart :options="option" auto-resize style="width:100%"></chart>
                </div>
            </template>
        </layout>
    </div>
</template>

<script>
import layout from '../base/layout';
import selectTime from '../base/selectTime';
import echarts from 'echarts';

export default {
    props:{
        option:{
            type:Object,
            default:function() {
                return {}
            }
        },
        loading:{
            type:Boolean,
            default:true
        }
    },
    // data() {
    //     return {
    //         option:{
	// 			title: {
	// 				text: ''
	// 			},
	// 			tooltip: {
	// 				trigger: 'axis'
	// 			},
	// 			legend: {
	// 				data: ['店铺数量', '有销量的店铺数量', '新增店铺总数']
	// 			},
	// 			grid: {
	// 				left: '3%',
	// 				right: '4%',
	// 				bottom: '3%',
	// 				containLabel: true
	// 			},
	// 			toolbox: {
	// 				feature: {
	// 					saveAsImage: {}
	// 				}
	// 			},
	// 			xAxis: {
	// 				type: 'category',
	// 				boundaryGap: false,
	// 				data: []
	// 			},
	// 			yAxis: {
	// 				type: 'value'
	// 			},
	// 			series: [{
	// 					name: '店铺数量',
	// 					type: 'line',
    //                     color:"#ff851b",
	// 					stack: '总量',
	// 					data: []
	// 				},
	// 				{
	// 					name: '有销量的店铺数量',
	// 					type: 'line',
    //                     color:"#c30d70",
	// 					stack: '总量',
	// 					data: []
	// 				},
	// 				{
	// 					name: '新增店铺总数',
	// 					type: 'line',
    //                     color:"#1df111",
	// 					stack: '总量',
	// 					data: []
	// 				}
	// 			]
	// 		},
    //         loading:true
    //     };
    // },
    methods:{
        getTime(time) {
            this.$emit("allCountTime",time)
            // this.$axios.post('/wholeShopDay/list',time).then(res=>{
            //     if(res.data.code==0){
            //         this.loading = false
            //         let data = res.data.data;
            //         //时间
            //         let timeArr = data.map(item=>item.statTime);
            //         //店铺总量
            //         let shopCount = data.map(item=>item.shopCnt);
            //         //有销量的店铺数量
            //         let salesShopCnt = data.map(item=>item.salesShopCnt)
            //         //新增店铺总数
            //         let newShoptCnt = data.map(item=>item.newShopCnt)
            //
            //         this.option.xAxis.data = timeArr;
            //         this.option.series[0].data = shopCount;
            //         this.option.series[1].data = salesShopCnt;
            //         this.option.series[2].data = newShoptCnt;
            //     }else{
            //         this.$message.error(res.data.code==0)
            //     }
            // })
        }
    },
    components:{
        layout,
        selectTime
    }
}
</script>

<style lang="scss">
</style>

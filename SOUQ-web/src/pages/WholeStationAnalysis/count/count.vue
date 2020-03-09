<template lang="html">
    <div class="chart">
        <layout>
            <template slot="title">SOUQ全站商品数量趋势</template>
            <template slot="time">
                <selectTime :show="false" @pieTime="getTime"/>
            </template>
            <template slot="content">
                <div class="myecharts"  v-loading="loading"  element-loading-text="拼命加载中...">
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
	// 	return {
	// 		option:{
	// 			tooltip: {
	// 				trigger: 'axis'
	// 			},
	// 			legend: {
	// 				data: ['商品总量', '当天有销量的商品数量', '新增上架商品数']
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
	// 				data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
	// 			},
	// 			yAxis: {
	// 				type: 'value'
	// 			},
	// 			series: [{
	// 					name: '商品总量',
	// 					type: 'line',
    //                     color:"green",
	// 					stack: '总量',
	// 					data: []
	// 				},
	// 				{
	// 					name: '当天有销量的商品数量',
	// 					type: 'line',
    //                     color:"#0074d9",
	// 					stack: '总量',
	// 					data: []
	// 				},
	// 				{
	// 					name: '新增上架商品数',
	// 					type: 'line',
    //                     color:"#ffdc00",
	// 					stack: '总量',
	// 					data: []
	// 				}
	// 			]
	// 		},
    //         loading:true
	// 	}
	// },
    methods: {
        getTime(time){
            this.$emit('countTime',time)


            // this.$axios.post('/wholeProductDay/list',time).then(res=>{
            //     if(res.data.code==0){
            //         this.loading = false;
            //         let data = res.data.data;
            //         //时间
            //         let timeArr = data.map(item=>item.statTime)
            //         //商品总量
            //         let productCntArr = data.map(item=>item.productCnt)
            //         //当天有销量的商品数量
            //         let salesProductCntArr = data.map(item=>item.salesProductCnt)
            //         //新增上架商品数
            //         let newProductCntArr = data.map(item=>item.newProductCnt)
            //
            //         this.option.xAxis.data = timeArr;
            //         this.option.series[0].data = productCntArr;
            //         this.option.series[1].data = salesProductCntArr;
            //         this.option.series[2].data = newProductCntArr;
            //     }else{
            //         this.$message.error(res.data.msg);
            //     }
            // })
        },
    },
	components: {
		layout,
		selectTime
	}
}
</script>

<style lang="scss" scoped>
.myecharts {
    height: 420px;
    width: 100%;
}
</style>

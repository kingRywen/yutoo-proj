<template lang="html">
    <div class="chart">
        <layout>
            <template slot="title">{{title}}</template>
            <template slot="time">
                <selectTime :show="true" @pieTime="getTime" @setshopTitle="getTitle"/>
            </template>
            <template slot="content">
                <div class="pie_warp" v-loading="loading"  element-loading-text="拼命加载中...">
                    <div class="pie">
                         <chart :options="option" v-if='option.tooltip' auto-size style="width:100%"/>
                    </div>
                    <lookList :dataList="SareaList" :tag="'(家)'"/>
                </div>
            </template>
        </layout>
    </div>
</template>

<script>
import layout from '../base/layout';
import selectTime from '../base/selectTime';
import echarts from 'echarts';
import lookList from '../base/look-list';
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
        },
        SareaList:{
            type:Array,
            default:function() {
                return []
            }
        }
    },
    data() {
        return {
            title:'店铺销量分布-近7天'
        }
    },
    // data() {
    //     return {
    //         option:{
	// 			tooltip: {
	// 				trigger: 'item',
    //                 show:true, //是否跟随鼠标，显示
    //                 position: [350,350,],
	// 				formatter: "{a} <br/>{b}: {c} ({d}%)",
	// 			},
	// 			legend: {
    //                 type: 'scroll',
	// 				orient: 'vertical',  //horizontal 控制显示的位置横向还是纵向
    //                 itemGap:40,    //每项之间的间隔,横向为水平
    //                 itemWidth:15,   //没项的宽度
    //                 itemHeight:15, //没项的高度
    //                 selectedMode:true, //是否可以点击改变系列的显示转态
    //                 textStyle:{
    //                     color:"#333",
    //                     fontSize:20,
    //                 },
    //                 right: 0,
    //                 top: 20,
    //                 bottom: 20,
	// 				data: [
    //                     '销量在1-100之间',
    //                     '销量在101-300之间',
    //                     '销量在301-600之间',
    //                     '销量在601-1000之间',
    //                     '销量在1001-2000之间',
    //                     '销量 > 2000'
    //                 ]
	// 			},
	// 			series: [{
	// 				name: '',
	// 				type: 'pie',  //type 决定是什么样的图形样式，饼图或其他
	// 				radius: ['50%', '70%'], //控制大小
    //                 center:['30%', '50%'], //控制页面布局距离
    //                 color:['#39cccc','#0074d9', '#7fdbff', '#2ecc40', '#ffdc00','#ff851b'],
	// 				avoidLabelOverlap: false,
    //                 label: {
    //                     normal: {
    //                         show: false,
    //                         position: 'center'
    //                     },
    //                     emphasis: {
    //                         show: true,
    //                         textStyle: {
    //                             fontSize: '16',
    //                             fontWeight: 'bold'
    //                         }
    //                     }
    //                 },
	// 				labelLine: {
	// 					normal: {
	// 						show: false
	// 					}
	// 				},
	// 				data: [{
	// 						value: "",
	// 						name: '销量在1-100之间'
	// 					},
	// 					{
	// 						value: "",
	// 						name: '销量在101-300之间'
	// 					},
	// 					{
	// 						value: "",
	// 						name: '销量在301-600之间'
	// 					},
	// 					{
	// 						value: "",
	// 						name: '销量在601-1000之间'
	// 					},
	// 					{
	// 						value: "",
	// 						name: '销量在1001-2000之间'
	// 					},
    //                     {
	// 						value: "",
	// 						name: '销量 > 2000'
	// 					}
	// 				]
	// 			}]
	// 		},
    //         loading:true,
    //         areaList:[],
    //         title:'店铺销量分布-近7天'
    //     }
    // },
    methods:{
        getTitle(title){
            this.title = title;
        },
        getTime(time) {
            let params = {
                minDate:time.minDate,
                maxDate:time.maxDate
            }
            this.$emit("sDistributionTime",params)
            // this.$axios.post('/shopProductDay/listWholeShopSales',params).then(res=>{
            //     if(res.data.code==0){
            //         let data =  res.data.data;
            //         this.loading = false;
            //         //更改饼图数据
            //         data.forEach((item,index)=>{
            //             let val = item.salesRange
            //             switch(val){
            //     			case "1-100":
            //                     this.option.series[0].data[0].value = item.shopCnt;
            //     			break;
            //     			case "101-300":
            //                     this.option.series[0].data[1].value = item.shopCnt;
            //     			break;
            //     			case "301-600":
            //                     this.option.series[0].data[2].value = item.shopCnt;
            //     			break;
            //                 case "601-1000":
            //                     this.option.series[0].data[3].value = item.shopCnt;
            //     			break;
            //                 case "1001-2000":
            //                     this.option.series[0].data[4].value = item.shopCnt;
            //     			break;
            //                 case "2000-":
            //                     this.option.series[0].data[5].value = item.shopCnt;
            //     			break;
            //     		 }
            //         })
            //         //处理查看列表数据
            //         let maxIndex = time.maxDate.lastIndexOf('-')
            //         let minIndex = time.minDate.lastIndexOf('-')
            //         let max = time.maxDate.slice(maxIndex+1)
            //         let min = time.minDate.slice(minIndex+1)
            //         let isWeek = (max-min)==7 ? true:false
            //         this.SareaList = data.map(item=>{
            //             let mytitle;
            //             let rangeArr = item.salesRange.split('-')
            //             let cur = item.salesRange
            //             if(cur == '1-100' && isWeek){
            //                 mytitle = '销量在1-100之间近7天商品'
            //             }else if(cur == '1-100'){
            //                 mytitle = `销量在1-100之间${time.minDate}到${time.maxDate}商品`
            //             }
            //             if(cur == '101-300' && isWeek){
            //                 mytitle = '销量在101-300之间近7天商品'
            //             }else if(cur == '101-300'){
            //                 mytitle = `销量在101-300之间${time.minDate}到${time.maxDate}商品`
            //             }
            //             if(cur == '301-600' && isWeek){
            //                 mytitle = '销量在301-600之间近7天商品'
            //             }else if(cur == '301-600'){
            //                 mytitle = `销量在301-600之间${time.minDate}到${time.maxDate}商品`
            //             }
            //             if(cur == '601-1000' && isWeek){
            //                 mytitle = '销量在601-1000之间近7天商品'
            //             }else if(cur == '601-1000'){
            //                 mytitle = `销量在601-1000之间${time.minDate}到${time.maxDate}商品`
            //             }
            //             if(cur == '1001-2000' && isWeek){
            //                 mytitle = '销量在1001-2000之间近7天商品'
            //             }else if(cur == '1001-2000'){
            //                 mytitle = `销量在1001-2000之间${time.minDate}到${time.maxDate}商品`
            //             }
            //             if(cur == '2000-' && isWeek){
            //                 mytitle = '商品销量>500近7天商品'
            //             }else if(cur == '2000-'){
            //                 mytitle = `商品销量>2000从${time.minDate}到${time.maxDate}商品`
            //             }
            //             return {
            //                 productCnt:this.toThousands(item.shopCnt),
            //                 productCntRate:(item.shopCntRate*100) + "%",
            //                 params:{
            //                     mytitle,
            //                     url:'storeList',
            //                     "minDate": time.minDate,
            //                     "maxDate": time.maxDate,
            //                     "minNewReviewCnt": rangeArr[0],
            //                     "maxNewReviewCnt": rangeArr[1] || "",
            //                 }
            //             }
            //         })
            //     }else{
            //         this.$message.error(res.data.msg);
            //     }
            // })
        },
        // toThousands(num){
        //     return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        // }
    },
    components:{
        layout,
        selectTime,
        lookList
    }
}
</script>

<style lang="scss" scoped>
    .pie_warp{
        display: flex;
        flex-direction: row;
        min-height: 420px;
        .pie{
            width:650px;
        }
    }
</style>

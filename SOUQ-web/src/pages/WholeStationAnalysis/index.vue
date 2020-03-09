<template lang="html">
    <div>
        <WholeStationAnalysis
            :statisticsLeft_Data="statisticsLeft_Data"
            :statisticsRight_Data="statisticsRight_Data"

            @sellTime="getSell"
            :sellOption="sellOption" :sellLoadng="sellLoadng"

            @countTime="getCount"
            :countOption="countOption"
            :countLoading="countLoading"

            @allCountTime="allCountTime"
            :allCountOption = "allCountOption"
            :allCountLoading = "allCountLoading"

            @cDistributionTime="cDistributionTime"
            :cOption = "cOption"
            :cLoading = "cLoading"
            :CareaList="CareaList"

            @sDistributionTime="getSsDistributionTime"
            :sOption="sOption"
            :sloading="sloading"
            :SareaList="SareaList"/>
    </div>
</template>
<script>
    import WholeStationAnalysis from './WholeStationAnalysis';

    export default {
        data() {
            return {
                time:null,
                statisticsLeft_Data:{},
                statisticsRight_Data:{},

                sellLoadng:true,
                sellOption:{},

                countLoading:true,
                countOption:{},

                allCountLoading:true,
                allCountOption:{},

                cLoading:true,
                cOption:{},
                CareaList:[],

                sloading:true,
                sOption:{},
                SareaList:[]
            }
        },
        components:{
            WholeStationAnalysis
        },
        methods:{
            //获取全站商品统计
            getWPAList() {
                this.$axios.post('/wholeProductAnalysis/list').then(res=>{
                    if(res.data.code==0){
                        this.statisticsLeft_Data = res.data.data
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //获取全站店铺统计
            getWShopList() {
                this.$axios.post('/wholeShopAnalysis/list').then(res=>{
                    if(res.data.code==0){
                        this.statisticsRight_Data = res.data.data
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //获取全站销售趋势
            getSell(time) {
                this.$axios.post('/wholeProductDay/list',time).then(res=>{
                    if(res.data.code==0){
                        this.sellLoadng = false;
                        let data = res.data.data;
                        this.sellOption = {
                    		tooltip: {
                    			trigger: 'axis'
                    		},
                    		legend: {
                    			data: ['评价数']
                    		},
                    		grid: {
                    			left: '3%',
                    			right: '4%',
                    			bottom: '3%',
                    			containLabel: true
                    		},
                    		xAxis: {
                    			type: 'category',
                    			boundaryGap: false,
                    			data: data.map(item=>item.statTime)
                    		},
                    		yAxis: {
                    		    type: 'value',
                                show:true,
                                gridIndex:0,
                                position:'left',
                    		},
                    		series: [{
                                name: '评价数',
                                color:"#0074d9",
                                type: 'line',
                                stack: '总量',
                                data: data.map(item=>item.newReviewCnt)
                            }]
                    	}
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //获取商品数量趋势
            getCount(time) {
                this.$axios.post('/wholeProductDay/list',time).then(res=>{
                    if(res.data.code==0){
                        this.countLoading = false;
                        let data = res.data.data;
                        this.countOption = {
                    		tooltip: {
                    			trigger: 'axis'
                    		},
                    		legend: {
                    			data: ['商品总量', '当天有销量的商品数量', '新增上架商品数']
                    		},
                    		grid: {
                    			left: '3%',
                    			right: '4%',
                    			bottom: '3%',
                    			containLabel: true
                    		},
                    		xAxis: {
                    			type: 'category',
                    			boundaryGap: false,
                    		    data: data.map(item=>item.statTime)
                    		},
                    		yAxis: {
                    			type: 'value'
                    		},
                    		series: [{
                    			name: '商品总量',
                    		    type: 'line',
                                color:"green",
                    			stack: '总量',
                    			data: data.map(item=>item.productCnt)
                    		},
                    		{
                    			name: '当天有销量的商品数量',
                    			type: 'line',
                                color:"#0074d9",
                    			stack: '总量',
                    			data: data.map(item=>item.salesProductCnt)
                    		},
                    		{
                    			name: '新增上架商品数',
                    			type: 'line',
                                color:"#ffdc00",
                    			stack: '总量',
                    			data:  data.map(item=>item.newProductCnt)
                    		}]
                    	}
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            //获取店铺数量趋势
            allCountTime(time){
                this.$axios.post('/wholeShopDay/list',time).then(res=>{
                    if(res.data.code==0){
                        this.allCountLoading = false;
                        let data = res.data.data
                        this.allCountOption = {
                    				tooltip: {
                    					trigger: 'axis'
                    				},
                    				legend: {
                    					data: ['店铺数量', '有销量的店铺数量', '新增店铺总数']
                    				},
                    				grid: {
                    					left: '3%',
                    					right: '4%',
                    					bottom: '3%',
                    					containLabel: true
                    				},
                    				xAxis: {
                    					type: 'category',
                    					boundaryGap: false,
                    					data: data.map(item=>item.statTime)
                    				},
                    				yAxis: {
                    					type: 'value'
                    				},
                    				series: [{
                    						name: '店铺数量',
                    						type: 'line',
                                            color:"#ff851b",
                    						stack: '总量',
                    						data: data.map(item=>item.shopCnt)
                    					},
                    					{
                    						name: '有销量的店铺数量',
                    						type: 'line',
                                            color:"#c30d70",
                    						stack: '总量',
                    						data: data.map(item=>item.salesShopCnt)
                    					},
                    					{
                    						name: '新增店铺总数',
                    						type: 'line',
                                            color:"#1df111",
                    						stack: '总量',
                    						data: data.map(item=>item.newShopCnt)
                    					}
                    				]
                    	}
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //获取商品销量分布
            cDistributionTime(time) {
                this.$axios.post("/productDay/listWholeProductSales",time).then(res=>{
                    if(res.data.code==0){
                        let data =  res.data.data;
                        this.cLoading = false;
                        this.cOption = {
                    		tooltip: {
                    			trigger: 'item',
                                show:true, //是否跟随鼠标，显示
                                position: [360,360,],
                    			formatter: "{a} <br/>{b}: {c} ({d}%)",
                    		},
                    		legend: {
                                type: 'scroll',
                    			orient: 'vertical',  //horizontal 控制显示的位置横向还是纵向
                                itemGap:40,    //每项之间的间隔,横向为水平
                                itemWidth:15,   //没项的宽度
                                itemHeight:15, //没项的高度
                                selectedMode:true, //是否可以点击改变系列的显示转态
                                textStyle:{
                                    color:"#333",
                                    fontSize:20,
                                },
                                right: 0,
                                top: 20,
                                bottom: 20,
                    			data: [
                                    '销量在1-10之间',
                                    '销量在11-50之间',
                                    '销量在51-100之间',
                                    '销量在101-300之间',
                                    '销量在301-500之间',
                                    '销量 > 500'
                                ],
                                animationDurationUpdate:800
                    		},
                            animation:{
                                default:true
                            },
                    		series: [{
                    			name: '',
                    			type: 'pie',  //type 决定是什么样的图形样式，饼图或其他
                    			radius: ['50%', '70%'], //控制大小
                                center: ['30%', '50%'], //控制页面布局距离
                                color:['#39cccc','#0074d9', '#7fdbff', '#2ecc40', '#ffdc00','#ff851b'],
                    			avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                    			labelLine: {
                    				normal: {
                    					show: true
                    				}
                    			},
                    			data:data.map((item,index)=>{
                                    let val = item.salesRange;
                                    switch(val){
                                        case "1-10":
                                            return {value:item.productCnt,name:'销量在1-10之间'}
                                        break;
                                        case "11-50":
                                            return {value:item.productCnt,name:'销量在11-50之间'}
                                        break;
                                        case "51-100":
                                            return {value:item.productCnt,name:'销量在51-100之间'}
                                        break;
                                        case "101-300":
                                            return {value:item.productCnt,name:'销量在101-300之间'}
                                        break;
                                        case "301-500":
                                            return {value:item.productCnt,name:'销量在301-500之间'}
                                        break;
                                        case "500-":
                                            return {value:item.productCnt,name:'销量 > 500'}
                                        break;
                                    }
                                })
                            }]
                    	};
                        // 处理查看列表数据
                            let maxIndex = time.maxDate.lastIndexOf('-')
                            let minIndex = time.minDate.lastIndexOf('-')
                            let max = time.maxDate.slice(maxIndex+1)
                            let min = time.minDate.slice(minIndex+1)
                            let isWeek = (max-min)==7 ? true:false
                            this.CareaList = data.map(item=>{
                                let mytitle;
                                let rangeArr = item.salesRange.split('-')
                                let cur = item.salesRange
                                if(cur == '1-10' && isWeek){
                                    mytitle = '商品销量在1-10之间近7天商品'
                                }else if(cur == '1-10'){
                                    mytitle = `商品销量在1-10之间${time.minDate}到${time.maxDate}商品`
                                }
                                if(cur == '11-50' && isWeek){
                                    mytitle = '商品销量在11-50之间近7天商品'
                                }else if(cur == '11-50'){
                                    mytitle = `商品销量在11-50之间${time.minDate}到${time.maxDate}商品`
                                }
                                if(cur == '51-100' && isWeek){
                                    mytitle = '商品销量在51-100之间近7天商品'
                                }else if(cur == '51-100'){
                                    mytitle = `商品销量在51-100之间${time.minDate}到${time.maxDate}商品`
                                }
                                if(cur == '101-300' && isWeek){
                                    mytitle = '商品销量在101-300之间近7天商品'
                                }else if(cur == '101-300'){
                                    mytitle = `商品销量在101-300之间${time.minDate}到${time.maxDate}商品`
                                }
                                if(cur == '301-500' && isWeek){
                                    mytitle = '商品销量在301-500之间近7天商品'
                                }else if(cur == '301-500'){
                                    mytitle = `商品销量在301-500之间${time.minDate}到${time.maxDate}商品`
                                }
                                if(cur == '500-' && isWeek){
                                    mytitle = '商品销量>500近7天商品'
                                }else if(cur == '500-'){
                                    mytitle = `商品销量>500从${time.minDate}到${time.maxDate}商品`
                                }
                                return {
                                    productCnt:item.productCnt,
                                    productCntRate:parseFloat((item.productCntRate*100).toFixed(1)) + "%",
                                    listName:'查 看 商 品 列 表',
                                    params:{
                                        mytitle,
                                        url:'salesList',
                                        "minDate": time.minDate,
                                        "maxDate": time.maxDate,
                                        "minNewReviewCnt": rangeArr[0],
                                        "maxNewReviewCnt": rangeArr[1] || "",
                                    }
                                }
                            })
                    }else{
                        this.$message.error(res.data.msg)
                    }
                })
            },
            //获取店铺销量分布
            getSsDistributionTime(time) {
                this.$axios.post('/shopProductDay/listWholeShopSales',time).then(res=>{
                    if(res.data.code==0){
                        let data =  res.data.data;
                        this.sloading = false;
                        this.sOption = {
                    		tooltip: {
                                trigger: 'item',
                                show:true, //是否跟随鼠标，显示
                                position: [350,350,],
                                formatter: "{a} <br/>{b}: {c} ({d}%)",
                            },
                            legend: {
                                type: 'scroll',
                                orient: 'vertical',  //horizontal 控制显示的位置横向还是纵向
                                itemGap:40,    //每项之间的间隔,横向为水平
                                itemWidth:15,   //没项的宽度
                                itemHeight:15, //没项的高度
                                selectedMode:true, //是否可以点击改变系列的显示转态
                                textStyle:{
                                    color:"#333",
                                    fontSize:20,
                                },
                                right: 0,
                                top: 20,
                                bottom: 20,
                                data: [
                                    '销量在1-100之间',
                                    '销量在101-300之间',
                                    '销量在301-600之间',
                                    '销量在601-1000之间',
                                    '销量在1001-2000之间',
                                    '销量 > 2000'
                                ]
                            },
                            series: [{
                                name: '',
                                type: 'pie',  //type 决定是什么样的图形样式，饼图或其他
                                radius: ['50%', '70%'], //控制大小
                                center:['30%', '50%'], //控制页面布局距离
                                color:['#39cccc','#0074d9', '#7fdbff', '#2ecc40', '#ffdc00','#ff851b'],
                                avoidLabelOverlap: false,
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.map(item=>{
                                    let val = item.salesRange;
                                    switch(val){
                            			case "1-100":
                                            return { name:'销量在1-100之间', value:item.shopCnt }
                            			break;
                            			case "101-300":
                                            return { name:'销量在101-300之间', value:item.shopCnt }
                            			break;
                            			case "301-600":
                                            return { name:'销量在301-600之间', value:item.shopCnt }
                            			break;
                                        case "601-1000":
                                            return { name:'销量在601-1000之间', value:item.shopCnt }
                            			break;
                                        case "1001-2000":
                                            return { name:'销量在1001-2000之间', value:item.shopCnt }
                            			break;
                                        case "2000-":
                                            return { name:'销量 > 2000', value:item.shopCnt }
                            			break;
                            		}
                                })
                            }]
                        }
                        //处理查看列表数据
                        let maxIndex = time.maxDate.lastIndexOf('-')
                        let minIndex = time.minDate.lastIndexOf('-')
                        let max = time.maxDate.slice(maxIndex+1)
                        let min = time.minDate.slice(minIndex+1)
                        let isWeek = (max-min)==7 ? true:false
                        this.SareaList = data.map(item=>{
                            let mytitle;
                            let rangeArr = item.salesRange.split('-')
                            let cur = item.salesRange
                            if(cur == '1-100' && isWeek){
                                mytitle = '销量在1-100之间近7天商品'
                            }else if(cur == '1-100'){
                                mytitle = `销量在1-100之间${time.minDate}到${time.maxDate}商品`
                            }
                            if(cur == '101-300' && isWeek){
                                mytitle = '销量在101-300之间近7天商品'
                            }else if(cur == '101-300'){
                                mytitle = `销量在101-300之间${time.minDate}到${time.maxDate}商品`
                            }
                            if(cur == '301-600' && isWeek){
                                mytitle = '销量在301-600之间近7天商品'
                            }else if(cur == '301-600'){
                                mytitle = `销量在301-600之间${time.minDate}到${time.maxDate}商品`
                            }
                            if(cur == '601-1000' && isWeek){
                                mytitle = '销量在601-1000之间近7天商品'
                            }else if(cur == '601-1000'){
                                mytitle = `销量在601-1000之间${time.minDate}到${time.maxDate}商品`
                            }
                            if(cur == '1001-2000' && isWeek){
                                mytitle = '销量在1001-2000之间近7天商品'
                            }else if(cur == '1001-2000'){
                                mytitle = `销量在1001-2000之间${time.minDate}到${time.maxDate}商品`
                            }
                            if(cur == '2000-' && isWeek){
                                mytitle = '商品销量>500近7天商品'
                            }else if(cur == '2000-'){
                                mytitle = `商品销量>2000从${time.minDate}到${time.maxDate}商品`
                            }
                            return {
                                productCnt:item.shopCnt,
                                productCntRate:parseFloat((item.shopCntRate*100).toFixed(1)) + "%",
                                listName:'查 看 店 铺 列 表',
                                params:{
                                    mytitle,
                                    url:'storeList',
                                    "minDate": time.minDate,
                                    "maxDate": time.maxDate,
                                    "minNewReviewCnt": rangeArr[0],
                                    "maxNewReviewCnt": rangeArr[1] || "",
                                }
                            }
                        })
                    }else{
                        this.$message.error(res.data.msg);
                    }
                })
            }
        },
        mounted() {
            this.getWPAList()
            this.getWShopList()


        }
    }
</script>

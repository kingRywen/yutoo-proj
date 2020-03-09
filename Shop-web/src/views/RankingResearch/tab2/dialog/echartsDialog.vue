<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label='数据源'>
			    <el-select v-model="dataSource" placeholder="请选择数据源" size='small' style='width:230px;' multiple collapse-tags clearable @change='dataSourceChange'>
			        <el-option
			        v-for="item in dataSourceOptions"
			        :key="item.value"
			        :label="item.label"
			        :value="item.value">
			        </el-option>
			    </el-select>
			</el-form-item>
            <el-form-item v-if='keywordShow' label='关键词' class='keyword-form-item'>
			    <el-select v-model="keyword" placeholder="请选择关键词" size='small'  style='width:350px;overflow:hidden;' multiple collapse-tags clearable @change='keywordChange'>
			        <el-option
			        v-for="item in keywordOptions"
			        :key="item.value"
			        :label="item.name"
			        :value="item.value">
			        </el-option>
			    </el-select>
			</el-form-item>
            <el-form-item  v-if='categoryShow' label='类目'>
			    <el-select v-model="category" placeholder="请选择类目" size='small'  style='width:350px;' multiple collapse-tags clearable @change='categoryChange'>
			        <el-option
			        v-for="item in categoryOptions"
			        :key="item.value"
			        :label="item.name"
			        :value="item.value">
			        </el-option>
			    </el-select>
			</el-form-item>
            <el-form-item label='时间'>
                 <el-date-picker
                    :clearable="false"
                    v-model="formInline.rangeTime"
                    type="daterange"
                    style='width:242px;'
                    size='small'
                     @change='dateChange'
                     unlink-panels
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptions"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label='展示方式'>
            	<el-select v-model="formInline.period" size="small" @change='periodChange' clearable style='width:218px;'>
            		<el-option
            			v-for="item in tiemOptions"
            			:key='item.value'
            			:label="item.name"
            			:value="item.value"
            		></el-option>
            	</el-select>
            </el-form-item>
			<!-- <el-form-item>
				<el-button type="primary" plain size="small" @click="rearchMethod" icon='el-icon-search' :loading='echartsLoading'>搜索</el-button>
			</el-form-item> -->
        </el-form>

		<div style="position:absolute;right:30px;top:8px" v-loading="$store.state.isloading || $store.state.loading">
		  <el-button type='text' class="el-icon-download" style="font-size:22px;cursor:pointer" @click="downloadExel" :disabled='$store.state.isloading || $store.state.loading'></el-button>
		</div>
        <div v-if='isData'>
            <div v-loading="echartsLoading"  :class="echartsClass" ref="chart"  style='margin-top:14px'></div>
        </div>
        <div v-else style='line-height:400px;text-align:center;'> 暂无数据</div>
         <!-- {{params}} -->
    </div>
   
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs';
import { downloadFile } from 'Utils/tools'
export default {
    props:['params'],
    data() {
        return {
            echartsLoading:false,
            //数据源的下拉
            dataSourceOptions:[
                {label:'自然搜索排名',value:0 },
                {label:'广告搜索排名',value:1 },
                {label:'类目BSR排名',value:2 },
                {label:'访客数',value:3 },
                {label:'订单数',value:4 },
                {label:'转化率',value:5 },
                {label:'访客数（仅广告）',value:6},
                {label:'订单数（仅广告）',value:7},
                {label:'转化率（仅广告）',value:8},
                {label:'新增评价数',value:9 },
                {label:'评分',value:10 },
                {label:'新增差评数',value:11 },
                {label:'新增好评数',value:12 },
                {label:'总评价数',value:13 },
            ],

            //关键词的下拉
            keywordOptions:[],
            keywordShow:true,
            //类目的下拉
            categoryOptions:[],
            categoryShow:false,

            formInline:{
               rangeTime:[],
               startTime:null,
               endTime:null,
               period:null
            },
            pickerOptions:{
                disabledDate:(time)=> {
                    return ( 
                        time.getTime() > Date.now()-15*3600*1000  ||   time.getTime() < (new Date(this.params.resultTime).getTime()-15*60*60*1000-24*3600*1000)
                    )
                },
            },

            echartsData:[],//选择数据源保存echarts所需要图表的数据
            legendData:[],//选择数据源保存图表的标题
            isData:true,
            Xdata:[],//图表的横坐标
            keywordEchartsdData:[],//选择关键词保存echarts需要的数据
            keywordLegend:[],//选择关键词保存图表的标题
            categoryEchartsData:[],//选择类目保存echarts需要的数据
            categoryLegend:[],//选择类目保存图表的标题

			tiemOptions:[
				{name:'按天',value:1},
				{name:'按周',value:7},
				{name:'按月',value:30}
            ],
            //弹框放大改变
            echartsClass:'chart-body',

            dataSource:[],//选择数据源
            keyword:[],//选择的关键词
            category:[],//选择的类目

            bigData:null,//保存请求的数据

            initChartData:null,//图表渲染时保存的数据
            
			echartsOpt:null,//echarts的options
        };
    },
    methods: {
		downloadExel(){
			this.$api['taskRankResearchStatListExport'](this.formInline)
			  .then(data => {
			    downloadFile(data, '数据展示')
			  })
			  .catch(() => {})
		},
		echratsResize(type){
			if (type) {
				this.echartsClass = 'chart-big'
			}else{
				this.echartsClass = 'chart-body'
			}
		    this.$nextTick(function(){
                this.chart && this.chart.resize();
                this.initChart()
		    })
        },
        //选择数据源改变
        dataSourceChange(v){
            // console.log("数据源选择");
            // console.log(v);

            if( !v || !v.length){
                this.keywordEchartsdData=[];
                this.keywordLegend=[];
                this.categoryEchartsData=[];
                this.categoryLegend=[];
            }
            //选择了自然搜索排名和广告搜索排名则要显示关键词选择框
            if( v.includes(0) || v.includes(1) ){
                this.keywordShow=true ;
                if(this.keyword && this.keyword.length){
                    this.keywordChange(this.keyword)
                }
            }else{
                 this.keywordShow=false;
            }
             //选择了类目BSR排名则要显示类目的选择框
            if( v.includes(2) ){
                this.categoryShow=true;
                if( this.category && this.category.length){
                    this.categoryChange(this.category)
                }
            }else{
                 this.categoryShow=false;
            }
            //除了自然搜索排名,广告搜索排名,类目BSR排名 要处理数据
            this.echartsData=[];
            this.legendData=[];
            //拿数据
            let getData=(data,h)=>{
                this.bigData.forEach(k=>{
                    data.push(k[h])
                })
            }
            //遍历勾选的结果
            v.forEach(i=>{
                let data=[]
                switch(i){
                    case 3:
                        this.legendData.push('访客数');                     
                        getData(data,'sessions');
                        this.echartsData.push(
                            {                            
                                name:'访客数',
                                type:'line',
                                data:data                               
                            }
                        )
                    break;
                    case 4:
                        this.legendData.push('订单数');                       
                        getData(data,'orderCnt');
                        this.echartsData.push(
                            {                            
                                name:'订单数',
                                type:'line',
                                data:data                              
                            }
                        )
                    break;
                    case 5:
                        this.legendData.push('转化率');                       
                        getData(data,'conversionRates');
                        this.echartsData.push(
                            {                            
                                name:'转化率',
                                type:'line',
                                data:data                               
                            }
                        )
                    break;
                    case 6:
                        this.legendData.push('访客数（仅广告）');                       
                        getData(data,'adSessions');
                        this.echartsData.push(
                            {
                                name:'访客数（仅广告）',
                                type:'line',
                                data:data                              
                            }
                        )
                    break;
                    case 7:
                        this.legendData.push('订单数（仅广告）');                      
                        getData(data,'adOrderCnt');
                        this.echartsData.push(
                            {                              
                                name:'订单数（仅广告）',
                                type:'line',
                                data:data                              
                            }
                        )
                    break;
                    case 8:
                        this.legendData.push('转化率（仅广告）');                       
                        getData(data,'adConversionRates');
                        this.echartsData.push(
                            {                              
                                name:'转化率（仅广告）',
                                type:'line',
                                data:data                           
                            }
                        )
                    break;
                    case 9:
                        this.legendData.push('新增评价数');                      
                        getData(data,'newReviewCnt');
                        this.echartsData.push(
                            {                             
                                name:'新增评价数',
                                type:'line',
                                data:data                                
                            }
                        )
                    break;
                    case 10:
                        this.legendData.push('评分');                       
                        getData(data,'starCnt');
                        this.echartsData.push(
                            {
                                name:'评分',
                                type:'line',
                                data:data                                
                            }
                        )
                    break;
                    case 11:
                        this.legendData.push('新增差评数');                       
                        getData(data,'negativeCnt');
                        this.echartsData.push(
                            {                              
                                name:'新增差评数',
                                type:'line',
                                data:data                              
                            }
                        )
                    break;
                    case 12:
                        this.legendData.push('新增好评数');                       
                        getData(data,'positiveCnt');
                        this.echartsData.push(
                            {                              
                                name:'新增好评数',
                                type:'line',
                                data:data                               
                            }
                        )
                    break;
                    case 13:
                        this.legendData.push('总评价数');                       
                        getData(data,'reviewCnt');
                        this.echartsData.push(
                            {                              
                                name:'总评价数',
                                type:'line',
                                data:data                               
                            }
                        )
                    break;
                    default:
                    break;
                }
            });
            
            //console.log(this.echartsData);
            this.initChart()
    
        },
        //选择关键词改变
        keywordChange(v){
            //console.log(v);
            this.keywordEchartsdData=[];
            this.keywordLegend=[];
            if( this.dataSource.includes(0)){
                v.forEach(i=>{
                    let data=[];
                    let otherData=[];
                    this.bigData.forEach(k=>{
                        if( k.keywordRanks  ){
                            k.keywordRanks.forEach(h=>{
                                if( i===h.keyword){
                                    data.push(h.webRank);
                                    otherData.push({webRankPages:h.webRankPages,webPagesRank:h.webPagesRank})
                                }   
                            })
                        }else{
                            data.push(null)
                            otherData.push({webRankPages:null,webPagesRank:null})
                        }
                    });

                    this.keywordEchartsdData.push({
                        name:`${i}自然搜索排名`,
                        type:'line',
                        data:data,
                        otherData:otherData,
                        otherType:"自然搜素排名"  
                    });
                    this.keywordLegend.push(`${i}自然搜索排名`)
                });

            }
            if( this.dataSource.includes(1) ){
                v.forEach(i=>{
                    let data=[];
                    let otherData=[];
                    this.bigData.forEach(k=>{
                        if( k.keywordRanks ){
                            k.keywordRanks.forEach(h=>{
                                if( i===h.keyword){
                                    data.push(h.adWebRank);
                                    otherData.push({adWebRankPages:h.adWebRankPages,adWebPagesRank:h.adWebPagesRank})
                                }   
                            })
                        }else{
                            data.push(null)
                            otherData.push({adWebRankPages:null,adWebPagesRank:null})
                        }
                       
                    });

                    this.keywordEchartsdData.push({
                        name:`${i}广告搜索排名`,
                        type:'line',
                        data:data,
                        otherData:otherData,
                        otherType:"广告搜素排名"  
                    });
                    this.keywordLegend.push(`${i}广告搜索排名`)
                });
            }
            this.initChart();
        },
        //选择类目改变
        categoryChange(v){
            this.categoryEchartsData=[];
            this.categoryLegend=[];
            v.forEach(i=>{
                let data=[];
                this.bigData.forEach(k=>{
                    if( k.bsrCates ){
                        k.bsrCates.forEach(h=>{
                            if( i===h.bsrCategory){
                                data.push(h.rank)
                            }   
                        })
                    }else{
                         data.push(null)
                    }
                });

                this.categoryEchartsData.push({
                    name:`${i}类目BSR排名`,
                    type:'line',
                    data:data   
                });
                this.categoryLegend.push(`${i}类目BSR排名`)
            });
            this.initChart(); 
        },
        //确认搜索
		// rearchMethod(){
		// 	this.getData();
		// },
        //选择时间范围改变
        dateChange(v){
            this.formInline.startTime=v[0];
            this.formInline.endTime=v[1];
            this.getData()
        },
        //选择统计方式改变
        periodChange(){
            this.getData()
        },
        //初始化echarts
        initChart() {
            if(this.chart){
                this.chart.dispose();
                this.chart = null;
            }
            this.chart = echarts.init(this.$refs.chart);

            let legendData = this.legendData.concat(this.keywordLegend).concat(this.categoryLegend);
            let Ydata = [];
            legendData.forEach(i=>{
                Ydata.push({
                    type:'value',name:i,show:false,position:'left',nameRotate:0.1
                })
            });
    
            let echartsData=this.echartsData.concat(this.keywordEchartsdData).concat(this.categoryEchartsData);
            let haveDataIndex ; //有数据的index
            echartsData.forEach( (i,index)=>{
                i.yAxisIndex = index ;
                i.data.forEach(k=>{
                    if(k){
                        haveDataIndex = index
                    }   
                })
            });
            //console.log(haveDataIndex);
            if( haveDataIndex ){
                Ydata[haveDataIndex].show = true;
            }else{
                 Ydata[0].show = true;
            }
           
            this.initChartData=echartsData;

            // console.log('legendData');
            // console.log(legendData);
            // console.log('Ydata');
            // console.log(Ydata);
            // console.log('echartsData');
            // console.log(echartsData);
            //console.log(this.initChartData);
            
            setTimeout(() => {
                this.chart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            });
            let vm = this;
            this.echartsOpt =  {
                xAxis: {
                    type: 'category',
					boundaryGap: false,
                    data: this.Xdata,
                    axisLabel: {
                        rotate: 45,
                    },
                    name:"时间"
                },
                 // 布局
                grid: {         
                    //left: '15%',        
                    bottom: vm.echartsClass === 'chart-big' ? '22%' : '30%', // 防止 dataZoom 重叠                 
                },
                toolbox:{
                    top: '-50px',
                    feature: {
                        dataZoom:{
                        yAxisIndex:"none"   //不启用y轴的选中
                        }
                    }
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
                    //padding:[0,5,10,5],
                    formatter:(params, ticket, callback) =>{
                        //console.log(params);
                        let content='';
                        params = params.filter(
                            el => !(el.data == 0 || el.data === '' || el.data == null || isNaN(el.data))
                        )
                        if (!params.length) {
                            return
                        }
                        params.forEach((i,key)=>{
                            let Xindex = i.seriesIndex; //在大数据中的位置
                            let dataIndex = i.dataIndex;//在单个数据中的位置

                            if( this.initChartData[Xindex].otherType ==="自然搜素排名" ){
                                let data =  this.initChartData[Xindex].otherData[dataIndex] ;
                                let webRankPages = data.webRankPages ? data.webRankPages :'--';
                                let webPagesRank = data.webPagesRank ? data.webPagesRank :'--' ;
                                //console.log(this.initChartData[Xindex].otherData[dataIndex]);
                                if(webRankPages === '--'){
                                    return
                                }
                                content += '<div>' +'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> ' + i.seriesName + " : " + '第' + webRankPages+'页'+' 第'+webPagesRank+'名'+ '</div>';

                            }else if(this.initChartData[Xindex].otherType ==="广告搜素排名" ){
                                let data =  this.initChartData[Xindex].otherData[dataIndex];
                                let adWebRankPages = data.adWebRankPages ? data.adWebRankPages :'--';
                                let adWebPagesRank = data.adWebPagesRank ? data.adWebPagesRank :'--';
                                //console.log(this.initChartData[Xindex].otherData[dataIndex]);
                                if( adWebRankPages === '--'){
                                    return
                                }
                                content += '<div>' +'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> ' + i.seriesName + " : " + '第' + adWebRankPages +'页'+' 第'+adWebPagesRank+'名'+ '</div>';

                            }else{
                                let value = (i.value  || i.value === 0 ) ? i.value : '' ;
                                if( !value ){
                                    return
                                }   
                                content += '<div>' +'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> ' + i.seriesName + " : " +value + '</div>';                  
                            }
                                 
                        })
                        return content;
                    }
                },
                yAxis:Ydata,
                series: echartsData

                //  series: [
                //     {
                //         name:'邮件营销',
                //         type:'line',
                //         stack: '总量',
                //         data:[120, 132, 101, 134, 90, 230, 210]
                //     },
                //  ]
            }
            this.chart.setOption( this.echartsOpt );
           
        },
        getData(){
            this.echartsLoading=true;
            this.isData=true;
            if(this.chart){
                this.chart.dispose();
            }
            this.$api['taskRankResearchStatList'](this.formInline)
            .then(data => {
                if(data.code===0){					
                    this.echartsLoading=false;
                    this.bigData=data.data;
                    //拿到横坐标的数据
                    this.Xdata=[];
                    this.bigData.forEach(i=>{
                        this.Xdata.push(i.sendTime);
                    });
                    // console.log('bigData');
                    // console.log(this.bigData)
                    this.dataSource=[0,1,2,3,4,5,6,7,8,9,10,11,12,13];
                    this.dataSourceChange(this.dataSource);
                    //console.log(object);
                    this.keyword = this.params.keywordOptions ;
                    let category = this.params.categoryOptions ;
                    this.category = []
                    category.forEach(i=>{
                        this.category.push(i.bsrCategory)
                    })
                    this.keywordChange(this.keyword);
                    this.categoryChange(this.category);
                   
                }
            })
        }
    },
    created() {
        //console.log(this.params);
        let endTime=dayjs(new Date().getTime()-15*3600*1000).format('YYYY-MM-DD');
		let startTime = dayjs(new Date(this.params.resultTime).getTime()-15*3600*1000).format('YYYY-MM-DD')
		this.formInline.platformId = this.platformId;
		this.formInline.siteId = this.siteId;
		this.formInline.sellerId = this.sellerId;
		this.formInline.taskId = this.params.taskId;
		this.formInline.parentAsin = this.params.parentAsin;
        this.formInline.startTime=startTime; 
        this.formInline.endTime=endTime;
        this.formInline.rangeTime=[startTime,endTime];

        this.params.keywordOptions.forEach(i=>{
            this.keywordOptions.push({
                label:i,
                value:i,
            })
        });
        this.params.categoryOptions.forEach(i=>{
            this.categoryOptions.push({
                label:i.bsrCategory,
                value:i.bsrCategory,
            })
        });
        //console.log(this.formInline);
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

<style scoped lang="less">
.el-form-item{
    margin-bottom: 10px;
}
.chart-body {
    height: 500px;
    width: 100%;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
}
.chart-big {
      height: 700px;
      width: 100%;
      //border: 1px solid @borderColor;
      padding-top: 10px;
      padding-bottom: 10px;
}
.keyword-form-item{
    /deep/.el-select{
        .el-select__tags {
           & > span {
                width: 100%;
                display: block;
                overflow: hidden;
            }
        }
    }
}

   
</style>

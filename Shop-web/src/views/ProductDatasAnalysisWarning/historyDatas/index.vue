<template>
    <div class='parent'>
        <!-- 筛选条件 -->
        <el-collapse class="custom-collapse mb10" value="`1`" accordion>
            <el-collapse-item title="筛选条件" name="1" label-width="120px">
                <el-form size="small" :inline="true" ref="searchRuleForm" :model="listQuery" >
                    <el-form-item label="父产品" prop="parentSkus" >
                        <el-select v-model="listQuery.parentSkus" placeholder="请输入或选择父产品" size='small' :clearable='true' filterable  style='width:320px;' multiple collapse-tags @change='parSelectChange'>
                            <el-option
                            v-for="item in parOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="子产品" prop="skus" >
                       <el-select v-model="listQuery.skus" placeholder="请输入或选择子产品" size='small'  :clearable='true' filterable  style='width:320px;' collapse-tags multiple @change='childSelectChange'>
                            <el-option
                            v-for="item in childOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="展示分类" prop="echartsClassify" :rules="[ { required: true, message: '请选择分类', trigger: 'change' }]">
                       <el-select v-model="listQuery.echartsClassify" placeholder="请选择要展示的分类" size='small'  :clearable='true' filterable  style='width:230px;' collapse-tags multiple @change='echartsClassifySelectChange'>
                            <el-option
                            v-for="item in echartsClassifyOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间范围" prop="productType" >
                        <el-date-picker
                            v-model="rangeTime"
                            type="daterange"
                            size='small'
                            @change='Datechange'
                            unlink-panels
                            :picker-options='pickerOptions'
                            value-format="yyyy-MM-dd"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>    
                    <el-form-item label="统计方式" prop="period" >
                        <el-select v-model="listQuery.period"   style='width:130px;' size='mini' collapse-tags >
                            <el-option
                            v-for="item in periodOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>  
                    <el-form-item>
                        <el-button size="small" type="primary"  @click="handleSearch" :loading='btnLoading' icon="el-icon-search">搜索</el-button>
                        <el-button size="small" type="primary"  plain @click="resetSearch" :disabled="btnLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div>
            <div style='line-height:40px;background-color:#f5f5f5;font-size:14px;border-bottom:1px solid #e5e5e5;'>
                <span style='margin-left:18px;'>数据展示</span>
            </div>
            <div v-if='isData'>
                <div v-loading="echartsLoading"  class="chart-body" ref="chart"  style='margin-top:100px;' ></div>
            </div>
            <div v-else style='line-height:100px;text-align:center;'>
                暂无数据
            </div>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import dayjs from "dayjs";
export default {
    data() {
        return {
            parOptions:[],//父产品
            childOptions:[],//子产品
            listQuery:{
                parentSkus:[],//父产品
                skus:[],//子产品
                startTime:null,
                endTime:null,
                sellerId:null,
                siteId:null,
                echartsClassify:[],////图表展示的分类
                platformId:this.platformId,
                period:1,//统计方式
            },
            rangeTime:[],//时间范围
            pickerOptions:{
            },
            defaultRangeTime:[], //保存选择的最大的时间范围
            periodOptions:[
                 {value:1,label:"按日"},
                 {value:7,label:"按周"},
                 {value:30,label:"按月"},
            ],
            echartsClassifyOptions:[
                {value:0,label:"全部"},
                {value:'sessions',label:'访客总数'},
                {value:'orderCnt',label:'订单总数'},
                {value:'conversionRates',label:'合计转化率'},
                {value:'buyBoxPercentage',label:'购物车获得率'},
                {value:'impressions',label:'广告曝光量'},
                {value:'adClickRates',label:'广告点击率'},
                {value:'adOrderCnt',label:'广告订单数'},
                {value:'adConversionRates',label:'广告转化率'},
                {value:'normalSessions',label:'自然访客数'},
                {value:'normalOrderCnt',label:'自然订单数'},
                {value:'normalConversionRates',label:'自然转化率'},
                {value:'returnsRates',label:'退货率'},
            ],
            
            oldSeclect:[],//原来选择过的展示的分类,和现在选择的对比,看有没有全部

            echartsdData:null,//图表的数据
            chart:null,//图表实例
            echartsLoading:false,
            xAxisData: [],//图表横坐标

            isData:true,//暂无数据

            btnLoading:false,//确认搜索按钮的loading
        };
    },
    methods: {
        //获取父产品的下拉
        getParent(){
            this.$api['productListParentSku1']({
                siteId:this.listQuery.siteId,
                sellerId:this.listQuery.sellerId,
            })
            .then(data => {
                let v = []
                data.data.forEach(i=>{
                    this.parOptions.push({value:i,label:i});
                    v.push(i)
                });
                this.getChild(v)

            }).catch(() => {})
        },
        //查询子产品的下拉
        getChild(v){
            this.$api['ProductListSku']({
                siteId:this.listQuery.siteId,
                sellerId:this.listQuery.sellerId,
                parentSkus: v
            }).then(data=>{
                //console.log(data);
                data.data.forEach(i=>{
                    this.childOptions.push({value:i,label:i});
                    //this.listQuery.skus.push(i)
                });
            })
        },
        //父产品选择改变,改变子选择器的options
        parSelectChange(v){
            this.childOptions=[];
            this.listQuery.skus=[]
            this.getChild(v);
            
        },  
        //子产品选择改变,改变父选择器的options
        childSelectChange(v){
            
        },
        //时间选择改变
        Datechange(v){
            this.listQuery.startTime=v[0];
            this.listQuery.endTime=v[1];
            // console.log(this.listQuery.startTime);
            // console.log(this.listQuery.endTime);
        },
        //选择展示分类的改变
        echartsClassifySelectChange(v){
            // console.log('vvvvvvvvvvvvvvv');
            //  console.log(v);
            
             if(this.oldSeclect.includes(0) && !v.includes(0)){ //原来有全部,现在没有 , 把选择数据的情清空
                this.listQuery.echartsClassify=[];
                this.oldSeclect= this.listQuery.echartsClassify;
             }else if( !this.oldSeclect.includes(0) && v.includes(0)){ //原来没有全部 , 现在有 , 全部选择
                this.listQuery.echartsClassify=[];
                this.echartsClassifyOptions.forEach(item=>{
                    this.listQuery.echartsClassify.push(item.value);
                });
                this.oldSeclect= this.listQuery.echartsClassify;  //将选择的保存起来

             }else if( v.length<this.echartsClassifyOptions.length && v.includes(0)){ //现在有全部,但是没全选 , 全部选择
                this.listQuery.echartsClassify=[];
                v.forEach(item=>{
                     if(item!==0){
                        this.listQuery.echartsClassify.push(item);
                     }
                });
                this.oldSeclect= this.listQuery.echartsClassify;
             }else if((v.length===this.echartsClassifyOptions.length-1) && !v.includes(0)){  //刚好全部选完 ,并且没选全部 ,全部选择
                this.listQuery.echartsClassify=[];
                this.echartsClassifyOptions.forEach(item=>{
                    this.listQuery.echartsClassify.push(item.value);
                });
                this.oldSeclect= this.listQuery.echartsClassify;
             }
            //  console.log('objectobjectobjectobjectobjectobjectobject');
            //  console.log(this.listQuery.echartsClassify);
        },
        //确认搜素
        handleSearch(){
            this.$nextTick(function(){
                this.$refs.searchRuleForm.validate((valid) => {
                    if (valid) {
                        this.echartsLoading=true;
                        this.isData=true;
                        this.btnLoading=true;
                        this.$api['pdWarnRtDayHistoryStat'](this.listQuery).then(data=>{
                            //console.log(data);
                            if(data.code===0){
                                this.echartsdData=data.data;
                                if(this.echartsdData.length===0){
                                    this.isData=false;
                                }
                                //console.log(this.echartsdData);
                                this.initChart();
                                this.echartsLoading=false;
                                this.btnLoading=false;
                            }
                        }).catch(err=>{
                            this.listQuery.echartsClassify;
                            this.echartsLoading=false;
                            this.isData=false;
                            this.btnLoading=false;
                        })
                    } else {
                        return false;
                    }
                });
            })
        },
        //重置搜素
        resetSearch(){
            this.$refs.searchRuleForm.resetFields();
            this.listQuery.startTime=this.defaultRangeTime[0];
            this.listQuery.endTime=this.defaultRangeTime[1];
            this.rangeTime=this.defaultRangeTime
            this.handleSearch();
        },
        //初始化echarts
        initChart() {
            //初始化图表
            if(this.chart){
                this.chart.dispose();
            }
            this.chart = echarts.init(this.$refs.chart);
            //标题
            let legendTit=[];
            let Ydata = [];
            //console.log(this.listQuery.echartsClassify);
            this.echartsClassifyOptions.forEach( item =>{
                this.listQuery.echartsClassify.forEach(it=>{
                    if(it===item.value && it!==0){
                        legendTit.push(item.label);
                        Ydata.push(
                            {type:'value',name:item.label,show:false},
                        )
                        //console.log(legendTit);
                    }
                });
            });
            console.log(Ydata);
            Ydata[0].show=true;
            let datas=[];//处理数据
            this.listQuery.echartsClassify.forEach( item =>{
                let data=[];//对应value数据集合
                let time=[];//每一条数据的时间
                this.echartsdData.forEach(it=>{
                    data.push(it[item]);
                    time.push(it.statTime);
                });
                let name;//拿到value对应的label名字
                this.echartsClassifyOptions.forEach(i=>{
                    if(i.value===item ){
                        name=i.label;
                    }
                });
                if(item!==0){
                    datas.push({name:name,data:data,time:time})
                }
            });
            let Xdata= datas[0].time;//横坐标
            //console.log(Xdata);
            Xdata.sort((a,b)=>{
               return new Date(a).getTime() - new Date(b).getTime()
            });

            //console.log(datas);
            datas.forEach( (item,index)=>{
                item.type='line';
                item.stack='总量';
                item.yAxisIndex=index
            });
             console.log(datas);
            // console.log(legendTit);
            //展示数据
            setTimeout(() => {
                this.chart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            });
            this.chart.setOption({
                legend: {
                    data:legendTit
                },
                toolbox:{
                    top: '-50px',
                    feature: {
                        dataZoom:{
                        yAxisIndex:"none"   //不启用y轴的选中
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    position: function (point, params, dom, rect, size) {
                        //console.log(point);
                        // 固定在顶部
                        return [point[0]+20, '10%'];
                    },
                    formatter:(params, ticket, callback) =>{
                        //let index=params[0].dataIndex;
                        //console.log(params);
                        let str=params[0].axisValue;
                        params = params.filter(
                            el => !(el.data == 0 || el.data === '' || el.data == null || isNaN(el.data))
                        )
                        if (!params.length) {
                            return
                        }
                        params.forEach(i=>{
                            if(i.seriesName.indexOf('率')!==-1){
                                str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+Math.ceil(i.data*10000)/100+'%'+'</div>';
                            }else{
                                str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+i.data+'</div>';
                            }
                           
                        })
                        // let str='第'+this.echartsData[index].webRankPages+"页第"+this.echartsData[index].webPagesRank+"名";
                        return str;
                    }
                },
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true
                // },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: Xdata,
                    axisLabel: {
                        rotate: 45,
                    }
                },
                grid: {
                    bottom: "30%", // 防止 dataZoom 重叠
                    //containLabel: true
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        //bottom:'-10%',
                        //showDetail:false
                            handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    },

                ],
                yAxis:Ydata,
                series:datas,
                // series: [
                //     {
                //         name:'广告曝光量',
                //         type:'line',
                //         stack: '总量',
                //         data:[100,98,55,66]
                //     }
                  
                // ]
            })
        },
        //获取时间最大的时间范围
        getTimeRange(){
            this.echartsLoading=true;
            this.$api['pdWarnRtDayHistoryStatTime']({
                sellerId: this.sellerId,
                siteId: this.siteId,
            })
            .then(data => {
                //console.log(data);
                this.defaultRangeTime = [data.data.minDate,data.data.maxDate] ;
                this.rangeTime = [data.data.minDate,data.data.maxDate] ;
                this.listQuery.startTime = this.rangeTime[0];
                this.listQuery.endTime= this.rangeTime[1];
                this.handleSearch();
                this.pickerOptions={
                    disabledDate:(time)=>{
                        return time.getTime() < new Date(data.data.minDate)-24*3600*1000 || time.getTime() > new Date(data.data.maxDate)
                    }
                }
            }).catch(() => {})
        }
    },
    created() {
        if(this.sellerId && this.siteId){
            this.listQuery.siteId = this.siteId;
            this.listQuery.sellerId = this.sellerId;
            this.getParent();
            this.getTimeRange()
        }

        this.listQuery.startTime=this.rangeTime[0];
        this.listQuery.endTime=this.rangeTime[1];
        
        this.echartsClassifyOptions.forEach(item=>{
            this.listQuery.echartsClassify.push(item.value);
        });
        this.oldSeclect=this.listQuery.echartsClassify;

    },
    watch:{
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.listQuery.siteId = this.siteId;
                this.listQuery.sellerId = this.sellerId;
                this.getParent();
                this.getTimeRange()
            }
        }
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
    .custom-collapse .el-form-item {
        margin-bottom: 10px;
    }
    .parent{
        /deep/.custom-collapse .el-collapse-item__header{
        justify-content: start;
        }
    }
  .chart-body {
    
    height: 400px;
    width: 100%;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
  }
</style>

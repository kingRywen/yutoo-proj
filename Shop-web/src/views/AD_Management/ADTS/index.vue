<template>
    <div>
         <!-- 筛选条件 -->
        <el-collapse class="custom-collapse" value="`1`" accordion>
            <el-collapse-item title="筛选条件" name="1" label-width="80px" style='text-align:left;'>
                <el-form :inline="true" ref="searchRuleForm" :model="listQuery" :rules='rules' >
                    <el-form-item label="包含"  prop="include">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="listQuery.include">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="不包含"  prop="exclude">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="listQuery.exclude">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="排除"  prop="barring">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="listQuery.barring">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="等于">
                        <el-input
                            style='width:270px'
                            type="textarea"
                            :rows="4"
                            placeholder="请输入,一行一个"
                            v-model="listQuery.querys">
                        </el-input>
                        <!-- <el-input v-model.trim="listQuery.negativeText" placeholder="请输入关键字" size="mini" clearable></el-input> -->
                    </el-form-item>
                    <el-form-item prop="time" label="时间段">
                        <el-date-picker
                            v-model="listQuery.time"
                            type="daterange"
                            size="small"
                            style='width:260px;'
                            :picker-options="pickerOptions"
                            value-format='yyyy-MM-dd'
                            unlink-panels
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop="type" label="统计方式"> 
                        <el-select v-model="listQuery.type" placeholder="请选择" size='small' >
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="campaignIds" label="广告系列"> 
                        <el-select v-model="listQuery.campaignIds" filterable placeholder="输入或选择广告系列(多选)"  size='small' clearable multiple  @change='campaignChange' collapse-tags style='width:270px;'>
                            <el-option
                            v-for="item in sdvertisingSeriesOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="adGroupIds" label="广告组"> 
                        <el-select v-model="listQuery.adGroupIds" filterable placeholder="输入或选择广告组(多选)"  size='small' clearable multiple @change='adGroupChange' collapse-tags style='width:270px;'>
                            <el-option
                            v-for="item in adGroupOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="keywordIds" label="广告关键词"> 
                        <el-select v-model="listQuery.keywordIds" filterable placeholder="输入或选择广告关键词"  size='small' clearable multiple collapse-tags style='width:300px;'>
                            <el-option
                            v-for="item in adKeywordpOpt"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="searchText" label="搜索词"> 
                       <el-input type='text' clearable v-model.trim='listQuery.searchText' placeholder="请输入搜索词" size='small'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" :loading='btnLoading' icon="el-icon-search"  @click="handleSearch">搜索</el-button>
                        <el-button size="small" type="primary" plain @click="resetSearch" :disabled="btnLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class='content-d'>
            <p>投放数据统计</p>
            <div style='position:relative;'>
                <el-button type="text" icon='el-icon-download' class='downloadBtn' @click='downloadBtn' :loading='downloadBtnLoading'></el-button>
                <div v-if='checkboxGroupShow && bigData.length'>
                    <div style='margin: 10px 0;margin-left:10%;' >
                        <h4 style='display:inline-block;vertical-align:sub;margin-right:20px;'>指标:</h4>
                        <el-checkbox-group v-model="checkboxGroup1" style='display:inline-block;' @change='checkboxGroup1Change'>
                            <el-checkbox-button v-for="item in checkboxGroup1S" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
                        </el-checkbox-group>
                    </div>
                    <div style='margin: 10px 0;margin-left:10%;'>
                        <h4 style='display:inline-block;vertical-align:sub;margin-right:20px;'>时间:</h4>
                        <el-checkbox-group v-model="checkboxGroup2" style='display:inline-block;' @change='checkboxGroup2Change'>
                            <el-checkbox-button v-for="item in checkboxGroup2S" :label="item.value" :key="item.value">{{item.label}}</el-checkbox-button>
                        </el-checkbox-group>
                    </div>
                </div>
                <v-chart :options="echartsOptions" auto-resize  ref='chart' style='width:100%;margin-top:10px' v-if='bigData.length' v-loading = 'btnLoading'  @legendselectchanged='legendselectchanged'/>
                <NonePage v-else></NonePage>
            </div>
            <div style='margin-top:20px;'>
                <el-select v-model="selectWeek" placeholder="请选择" size='small' v-if='checkboxGroupShow && bigData.length' @change='getTableData'>
                    <el-option
                    v-for="item in weekSelectOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <yt-table 
                    :columns='columns' 
                    :data='tableData' 
                    :selection='false'  
                    ref='table'
                    v-loading = 'btnLoading' 
                    @sortChange='sortChange'  
                    v-if='bigData.length'
                    style='margin-top:10px;'
                >
                </yt-table>
                <NonePage v-else></NonePage>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import ECharts from 'vue-echarts'
import {downloadFile} from 'Utils/tools';
export default {
    components: { 'v-chart': ECharts },
    data() {
        return {
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() > Date.now()-(15)*3600*1000;
                },
            },
            rules:{
                time:[
                     { required: true, message: '请选择时间段', trigger: ['blur','change'] },
                ],
                type:[
                     { required: true, message: '请选择统计方式', trigger: 'blur' },
                ]
            },
            listQuery:{
                campaignIds:[],
                adGroupIds:[],
                keywordIds:[],
                searchText:'',
                type:1,
                time:[]
            },
            btnLoading:false,
            options:[
                {label:"周一到周日",value:1},
                {label:"周一到周日(0~24点)",value:2},
                {label:"0~24点",value:3},
            ],
            sdvertisingSeriesOpt:[],
            adGroupOpt:[],
            adKeywordpOpt:[],

            bigData:[],

            echartsOptions:{
            },
            columns:[
                {
                    label: "太平洋时间",
                    value: "week",
                    minWidth:100,
                    enum:{
                        0:'周日',
                        1:'周一',
                        2:'周二',
                        3:'周三',
                        4:'周四',
                        5:'周五',
                        6:'周六',
                    }
                },
                {
                    label : '订单量',
                    merge:[
                        {
                            label:'订单量',
                            value:'adOrderCnt',
                            sortable:'custom',
                            width:120,
                        },
                        {
                            label:'占比',
                            value:'adOrderCntProp',
                            sortable:'custom',
                            width:120,
                            render(h,scope){
                                return(
                                    <span>{ scope.row.adOrderCntProp  ||  scope.row.adOrderCntProp===0 ? Math.ceil(scope.row.adOrderCntProp*10000)/100+"%" : '-'}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label : '曝光量',
                    merge:[
                        {
                            label:'曝光量',
                            value:'impressions',
                            sortable:'custom',
                            width:120,
                        },
                        {
                            label:'占比',
                            value:'impressionsProp',
                            sortable:'custom',
                            width:120,
                            render(h,scope){
                                return(
                                    <span>{ scope.row.impressionsProp || scope.row.impressionsProp ===0 ? Math.ceil(scope.row.impressionsProp*10000)/100+"%" : '-'}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "点击率",
                    value: "clickRates",
                    sortable:'custom',
                    minWidth:120,
                    render(h,scope){
                        return(
                            <span>{ scope.row.clickRates || scope.row.clickRates===0 ? Math.ceil(scope.row.clickRates*10000)/100+"%" : '-'}</span>
                        )
                    }
                },
                {
                    label : '点击量',
                    merge:[
                        {
                            label:'点击量',
                            value:'clicks',
                            sortable:'custom',
                            width:120,
                        },
                        {
                            label:'占比',
                            value:'clicksProp',
                            sortable:'custom',
                            width:120,
                            render(h,scope){
                                return(
                                    <span>{ scope.row.clicksProp || scope.row.clicksProp === 0 ? Math.ceil(scope.row.clicksProp*10000)/100+"%" : '-'}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "转化率",
                    value: "adConversionRates",
                    sortable:'custom',
                    minWidth:120,
                    render(h,scope){
                        return(
                            <span>{ scope.row.adConversionRates || scope.row.adConversionRates ===0 ? Math.ceil(scope.row.adConversionRates*10000)/100+"%" : '-'}</span>
                        )
                    }
                },
                {
                    label : '实际花费',
                    merge:[
                        {
                            label:'实际花费',
                            value:'cost',
                            sortable:'custom',
                            width:120,
                            render(h,scope){
                                return(
                                     <span>{ scope.row.cost || scope.row.cost ===0 ?"$" + scope.row.cost : '-'}</span>
                                )
                            }
                        },
                        {
                            label:'占比',
                            value:'costProp',
                            sortable:'custom',
                            width:120,
                            render(h,scope){
                                return(
                                    <span>{ scope.row.costProp || scope.row.costProp ===0 ?Math.ceil(scope.row.costProp*10000)/100+"%" : '-'}</span>
                                )
                            }
                        },
                    ]
                },
                {
                    label: "花费占比",
                    value: "acos",
                    sortable:'custom',
                    minWidth:120,
                    render(h,scope){
                        return(
                            <span>{ scope.row.acos || scope.row.acos ===0 ? Math.ceil(scope.row.acos*10000)/100+"%" : '-'}</span>
                        )
                    }
                },
                {
                    label: "CPC",
                    value: "cpc",
                    minWidth:120,
                    sortable:'custom',
                    render(h,scope){
                        return(
                            <span>{ scope.row.cpc || scope.row.cpc ===0 ?"$" + scope.row.cpc : '-'}</span>
                        )
                    }
                },
            ],
            tableData:[],

            checkboxGroup1:['impressions'],
            oldSelect1:['impressions'],
            checkboxGroup1S:[
                {label:"全选",value:0},
                {label:"曝光量",value:'impressions'},
                {label:"点击率",value:'clickRates'},
                {label:"点击量",value:'clicks'},
                {label:"订单量",value:'adOrderCnt'},
                {label:"转化率",value:'adConversionRates'},
                {label:"实际花费",value:'cost'},
                {label:"花费占比",value:'acos'},
                {label:"CPC",value:'cpc'},
            ],
            checkboxGroup2:[1,2,3,4,5,6,0,7],
            oldSelect2:[1,2,3,4,5,6,0,7],
            checkboxGroup2S:[
                {label:"全选",value:7},
                {label:"周一",value:1},
                {label:"周二",value:2},
                {label:"周三",value:3},
                {label:"周四",value:4},
                {label:"周五",value:5},
                {label:"周六",value:6},
                {label:"周日",value:0},
            ],
            checkboxGroupShow:false,

            weekSelectOpt:[
                {label:"周一",value:1},
                {label:"周二",value:2},
                {label:"周三",value:3},
                {label:"周四",value:4},
                {label:"周五",value:5},
                {label:"周六",value:6},
                {label:"周日",value:0},
            ],
            selectWeek:1,

            downloadBtnLoading:false,
        };
    },
    methods: {
        //图表的lengend选择改变
        legendselectchanged(Event){
            let selcted = Event.selected
            let arr = Object.values(selcted)
            let showIndex = [];
            let hideIndex = []
            arr.forEach( (i,index)=>{
                if(i){
                    showIndex.push(index)
                }else{
                    hideIndex.push(index)
                }
            })
            hideIndex.forEach(i=>{
                this.echartsOptions.yAxis[i].show = false
            })
            //console.log();
            showIndex.forEach((i,index)=>{
                if(index===0){
                    this.echartsOptions.yAxis[i].show = true
                }else{
                    this.echartsOptions.yAxis[i].show = false
                }
            })
            if(!showIndex.length){
                 this.echartsOptions.yAxis[0].show = true
            }
        },
        handleSearch(){
            this.$refs.searchRuleForm.validate((valid) => {
                if (valid) {
                    this.getData()
                }
            });
        },
        resetSearch(){
            this.listQuery.campaignIds = []
            this.listQuery.adGroupIds = []
            this.listQuery.keywordIds = []
            this.listQuery.searchText = ''
            this.listQuery.include = null
            this.listQuery.exclude = null
            this.listQuery.querys = null
            this.listQuery.barring = null
            let time = dayjs(Date.now()-(15)*3600*1000).format('YYYY-MM-DD')
            let start = dayjs(Date.now()-(15+365*24)*3600*1000).format('YYYY-MM-DD')
            this.listQuery.time = [start,time] 
            this.handleSearch()
        },
        //表格排序
        sortChange({column, prop , order}){
            let noData = []
            let havaData = []
            this.tableData.forEach(i =>{
                if( !i[prop] && i[prop]!==0){
                    noData.push(i)
                }else{
                    havaData.push(i)
                }
            })
            if(order==='descending'){
                havaData.sort((a,b)=>{
                    return b[prop] - a[prop]
                })
                let tableData = havaData.concat(noData)
                this.$set(this,'tableData',[])
                this.$set(this,'tableData',tableData)
            }else{  
                havaData.sort((a,b)=>{
                    return  a[prop] - b[prop]
                })
                let tableData = noData.concat(havaData)
                this.$set(this,'tableData',[])
                this.$set(this,'tableData',tableData)
            }
        },
        //导出
        downloadBtn(){
            this.downloadBtnLoading = true
            let {platformId,siteId,sellerId} = this.sellerData;
            let params = JSON.parse(JSON.stringify(this.listQuery))
            params.platformId = platformId
            params.siteId = siteId
            params.sellerId = sellerId
            let [startTime,endTime] = params.time 
            params.startTime = startTime
            params.endTime = endTime
            delete params.type
            delete params.time 
            params = this.$.dealObjectValue(params)
            this.$api[this.downloadUrl](params)
            .then(data => {
                downloadFile(data, '广告成交统计' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
                this.downloadBtnLoading = false
            })
            .catch(() => {
                this.downloadBtnLoading = false
            })
        },
        //指标选择改变
        checkboxGroup1Change(v){
            //console.log(v);
            if(v.includes(0) && !this.oldSelect1.includes(0)){
                this.checkboxGroup1S[0].label = '取消全选'   
                this.checkboxGroup1 = []
                this.checkboxGroup1S.forEach(i=>{
                    this.checkboxGroup1.push(i.value)
                })
                this.oldSelect1 = this.checkboxGroup1
            }else if( !v.includes(0) && this.oldSelect1.includes(0)){
                this.checkboxGroup1 = []
                this.checkboxGroup1S[0].label = '全选'  
                this.oldSelect1 = []
            }else if( v.includes(0) && v.length < this.checkboxGroup1S.length){
                this.checkboxGroup1S[0].label = '全选'
                this.checkboxGroup1.splice(this.checkboxGroup1.indexOf(0),1)
                this.oldSelect1 = this.checkboxGroup1
            }else if( !v.includes(0) && (this.checkboxGroup1.length === this.checkboxGroup1S.length -1 ) ){
                this.checkboxGroup1S[0].label = '取消全选'   
                this.checkboxGroup1 = []
                this.checkboxGroup1S.forEach(i=>{
                    this.checkboxGroup1.push(i.value)
                })
                this.oldSelect1 = this.checkboxGroup1
            }
            //console.log(this.checkboxGroup1);
            this.getEchartsOpt()
        },
        //星期选择改变
        checkboxGroup2Change(v){
            //console.log(v);
            if(v.includes(7) && !this.oldSelect2.includes(7)){
                this.checkboxGroup2S[0].label = '取消全选'   
                this.checkboxGroup2 = []
                this.checkboxGroup2S.forEach(i=>{
                    this.checkboxGroup2.push(i.value)
                })
                this.oldSelect2 = this.checkboxGroup2
            }else if( !v.includes(7) && this.oldSelect2.includes(7)){
                this.checkboxGroup2 = []
                this.checkboxGroup2S[0].label = '全选'  
                this.oldSelect2 = []
            }else if( v.includes(7) && v.length < this.checkboxGroup2S.length){
                this.checkboxGroup2S[0].label = '全选'
                this.checkboxGroup2.splice(this.checkboxGroup2.indexOf(7),1)
                this.oldSelect2 = this.checkboxGroup2
            }else if( !v.includes(7) && (this.checkboxGroup2.length === this.checkboxGroup2S.length -1 ) ){
                this.checkboxGroup2S[0].label = '取消全选'   
                this.checkboxGroup2 = []
                this.checkboxGroup2S.forEach(i=>{
                    this.checkboxGroup2.push(i.value)
                })
                this.oldSelect2 = this.checkboxGroup2
            }
            //console.log(this.checkboxGroup2);
            this.getEchartsOpt()
        },
        //获取数据
        getData(){
            this.btnLoading = true
            if(this.listQuery.type === 2){
                this.checkboxGroupShow = true
            }else{
                this.checkboxGroupShow = false
            };
            let {platformId,siteId,sellerId} = this.sellerData;
            let params = JSON.parse(JSON.stringify(this.listQuery))
            params.platformId = platformId
            params.siteId = siteId
            params.sellerId = sellerId
            let [startTime,endTime] = params.time 
            params.startTime = startTime
            params.endTime = endTime
            let {barring,include,exclude,querys} = params;
            params.barring = barring ?
                    barring.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : null;
            params.include = include ?
                    include.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : [];
            params.exclude = exclude ?
                    exclude.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : [];
            params.querys = querys ?
                    querys.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : [];
            delete params.type
            delete params.time 
            params = this.$.dealObjectValue(params)
            this.$api[this.requestUrl](
                params
            )
            .then(data => {
                this.btnLoading = false
                this.bigData = data.data
                //this.bigData.splice(0,1)
                this.initData()
                //console.log('data');
                console.log(this.bigData );
            }).catch((err) => {
                console.log(err);
                this.bigData = []
                this.btnLoading = false
            })
        },
        //处理数据
        initData(){
            this.$nextTick(function(){
                this.$refs.table.$refs.table.clearSort()
            })
            let {type} = this.listQuery 
            if ( type === 1 ) { //周一到周日
                let legend = ['曝光量','点击率','点击量','订单量','转化率','实际花费','花费占比','CPC']
                let Ydata = []; //纵坐标
                let series = []; //数据
                let arr = Array.call(null, ...Array(7)).map((_, h) => h) //0-6的数组
                let bigData =JSON.parse(JSON.stringify(this.bigData))
                let weeks = bigData.map(i=>i.week)
                let noDataWeek = [];//记录没数据的日子
                arr.forEach(i=>{
                    if(!weeks.includes(i)){
                        noDataWeek.push(i)
                    }
                })
                //把没数据的日子附上空值
                if(noDataWeek.length){
                    noDataWeek.forEach(j=>{
                        bigData.push({
                            week : j
                        })
                    })
                };
                //数组排序从小到大
               bigData.sort((a,b)=>{
                    return a.week-b.week
                })
                //把week = 0的也就是星期天放到最后
                let firstData = bigData[0]
                bigData.splice(0,1)
                bigData.push(firstData)
                legend.forEach(i=>{
                    Ydata.push({
                        type:'value',name:i,show:false,position:'left',nameRotate:0.1
                    })
                    let data = []
                    bigData.forEach(k=>{
                        if( i === '曝光量'){
                            data.push(k.impressions)
                        }else if( i === '点击率' ){
                             data.push(k.clickRates)
                        }else if( i === '点击量' ){
                             data.push(k.clicks)
                        }else if( i === '订单量' ){
                             data.push(k.adOrderCnt)
                        }else if( i === '转化率' ){
                             data.push(k.adConversionRates)
                        }else if( i === '实际花费' ){
                             data.push(k.cost)
                        }else if( i === '花费占比' ){
                             data.push(k.acos)
                        }else if( i === 'CPC' ){
                             data.push(k.cpc)
                        }

                    });
                    series.push({
                        name:i,
                        type:'line',
                        data:data
                    })
                })
                //console.log(series);
                let haveDataIndex ; //有数据的index
                series.forEach( (i,index)=>{
                    i.yAxisIndex = index ;
                    i.data.forEach(k=>{
                        if(k){
                            haveDataIndex = index
                            return
                        }   
                    })
                });
                if( haveDataIndex ){
                    Ydata[haveDataIndex].show = true;
                }else{
                    Ydata[0].show = true;
                }
                this.echartsOptions = {
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
                                if(i.seriesName.indexOf('率')!==-1 || i.seriesName === '花费占比'){
                                    str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+Math.ceil(i.data*10000)/100+'%'+'</div>';
                                }else if( i.seriesName === 'CPC' || i.seriesName === '实际花费'){
                                     str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+ '$'+i.data+'</div>';
                                }else{
                                    str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+i.data+'</div>';
                                }
                            })
                            // let str='第'+this.echartsData[index].webRankPages+"页第"+this.echartsData[index].webPagesRank+"名";
                            return str;
                        }
                    },
                    legend: {
                        data:legend
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                       top: '-50px',
                        feature: {
                            dataZoom:{
                            yAxisIndex:"none"   //不启用y轴的选中
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis:Ydata,
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            //showDetail:false
                                handleIcon:
                    "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                        },

                    ],
                      // 布局
                    grid: {         
                        //left: '15%',        
                        bottom: '15%'  // 防止 dataZoom 重叠                 
                    },
                    series:series
                };
                this.$nextTick(function(){
                    this.$refs.chart.dispatchAction({
                        type: 'takeGlobalCursor',
                        key: 'dataZoomSelect',
                        // 启动或关闭
                        dataZoomSelectActive: true
                    });
                })
                
                //表格的数据
                this.tableData = bigData
                this.columns[0] = {
                    label: "太平洋时间",
                    value: "week",
                    minWidth:100,
                    enum:{
                        0:'周日',
                        1:'周一',
                        2:'周二',
                        3:'周三',
                        4:'周四',
                        5:'周五',
                        6:'周六',
                    }
                }
            }else if ( type === 2 ){ //周一到周日(0~24点)
                this.getTableData(this.selectWeek)
                this.getEchartsOpt()
            }else{ // 0~24点
                this.getTabelData3()
            }
        },
        //周一到日(0~24点)处理图标的数据
        getEchartsOpt(){
            this.$nextTick(function(){
                this.$refs.chart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            })
            let Ydata = []; //纵坐标
            let series = []; //数据
            let checkboxGroup2 = JSON.parse(JSON.stringify(this.checkboxGroup2))
            let checkboxGroup1 = JSON.parse(JSON.stringify(this.checkboxGroup1))
            if(checkboxGroup2.indexOf(7)!==-1){
                checkboxGroup2.splice(checkboxGroup2.indexOf(7),1)
            };
            if(checkboxGroup1.indexOf(0)!==-1){
                checkboxGroup1.splice(checkboxGroup1.indexOf(0),1)
            }
            checkboxGroup2.forEach(k=>{
                let current = []
                this.bigData.forEach(i=>{
                    if(k === i.week){
                        current = i.data
                    }
                })
                // current.splice(0,1)
                let arr = Array.call(null, ...Array(24)).map((_, h) => h) //0-23的数组
                let hours = current.map(i=>i.hour)
                let noDataHour = [];//记录没数据的小时
                arr.forEach(i=>{
                    if(!hours.includes(i)){
                        noDataHour.push(i)
                    }
                })
                //把没数据的日子附上空值
                if(noDataHour.length){
                    noDataHour.forEach(j=>{
                        current.push({
                            hour : j,
                        })
                    })
                };
                //从0到23排序
                current.sort((a,b)=>{
                    return a.hour - b.hour
                })
                //console.log(current);
                checkboxGroup1.forEach(b=>{
                    let name 
                    this.checkboxGroup1S.forEach(v=>{
                        if(v.value === b){
                            Ydata.push({
                                type:'value',name:v.label,show:false,position:'left',nameRotate:0.1
                            })
                            name = v.label
                        }
                    })
                    let data = []
                    current.forEach(h=>{
                        data.push(h[b])
                    })
                    this.checkboxGroup2S.forEach(z=>{
                        if(z.value === k){
                             series.push({
                                type:'line',
                                data:data,
                                week:z.label,
                                name,
                            })
                        }
                    })
                })
            })
            let haveDataIndex ; //有数据的index
            series.forEach( (i,index)=>{
                i.yAxisIndex = index ;
                i.data.forEach(k=>{
                    if(k){
                        haveDataIndex = index
                        return
                    }   
                })
            });
            if(series.length){
                if( haveDataIndex ){
                    Ydata[haveDataIndex].show = true;
                }else{
                    Ydata[0].show = true;
                }
            }else{
                Ydata = [ { type:'value',name:'曝光量',show:true,position:'left',nameRotate:0.1 }]
            }
           
            //console.log(Ydata);
            //console.log(series);

            this.echartsOptions = {
                tooltip: {
                    trigger: 'axis',
                    position: function (point, params, dom, rect, size) {
                        //console.log(point);
                        // 固定在顶部
                        return [point[0]+20, '10%'];
                    },
                    formatter:(params, ticket, callback) =>{
                        //console.log(params);
                        params = params.filter(
                            el => !(el.data == 0 || el.data === '' || el.data == null || isNaN(el.data))
                        )
                        if (!params.length) {
                            return
                        }
                        let str = '<div>'+params[0].axisValue +'</div>'
                        params.forEach(i=>{
                            let seriesIndex = i.seriesIndex
                            if(i.seriesName.indexOf('率')!==-1 || i.seriesName === '花费占比'){
                                str+='<div>'+'<i style="background-color:'+i.color+';display:inline-block;width:12px;height:12px;border-radius:6px;"></i>'+series[seriesIndex].week+i.seriesName+':'+Math.ceil(i.data*10000)/100+'%'+'</div>';
                            }else if( i.seriesName === 'CPC' || i.seriesName === '实际花费'){
                                str+='<div>'+'<i style="background-color:'+i.color+';display:inline-block;width:12px;height:12px;border-radius:6px;"></i>'+series[seriesIndex].week+i.seriesName+':$'+i.data+'</div>';
                            }else{
                                str+='<div>'+'<i style="background-color:'+i.color+';display:inline-block;width:12px;height:12px;border-radius:6px;"></i>'+series[seriesIndex].week+i.seriesName+':'+i.data+'</div>';
                            }
                        })
        
                        return str;
                    }
                },
                legend: {
                    data:[]
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    top: '-50px',
                    feature: {
                        dataZoom:{
                        yAxisIndex:"none"   //不启用y轴的选中
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [...Array.call(null, ...Array(24)).map((_, h) => h+'点')]
                },
                yAxis:Ydata,
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        //showDetail:false
                            handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                    },

                ],
                    // 布局
                grid: {         
                    //left: '15%',        
                    bottom: '15%'  // 防止 dataZoom 重叠                 
                },
                series:series
            }
            this.$nextTick(function(){
                this.$refs.chart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            })
            
        },
        //周一到日(0~24点)获取表格的数据
        getTableData(v){
            //console.log(v);
            this.$nextTick(function(){
                this.$refs.table.$refs.table.clearSort()
            })
            let bigData =JSON.parse(JSON.stringify(this.bigData))
            let currentData = [];
            bigData.forEach(i=>{
                if( i.week === v){
                    currentData = i.data
                    return
                }
            })
            let arr = Array.call(null, ...Array(24)).map((_, h) => h) //0-23的数组
            let enums = {}
            arr.forEach( (i,index)=>{
                enums[index] = index +'~' + (index+1)
            })
            let hours = currentData.map(i=>i.hour)
            let noDataHour = [];//记录没数据的日子
            arr.forEach(i=>{
                if(!hours.includes(i)){
                    noDataHour.push(i)
                }
            })
            //把没数据的日子附上空值
            if(noDataHour.length){
                noDataHour.forEach(j=>{
                    currentData.push({
                        hour : j
                    })
                })
            };
            //数据排序
            currentData.sort((a,b)=>{
                return a.hour - b.hour
            })
            this.columns[0] = {
                label: "太平洋时间",
                value: "hour",
                minWidth:100,
                enum:enums
            }
            //console.log(currentData);
            this.tableData = []
            this.tableData = currentData
        },
        //0~24点处理表格的数据和图表的数据
        getTabelData3(){
            this.$nextTick(function(){
                this.$refs.chart.dispatchAction({
                    type: 'takeGlobalCursor',
                    key: 'dataZoomSelect',
                    // 启动或关闭
                    dataZoomSelectActive: true
                });
            })
            let currentData = JSON.parse(JSON.stringify(this.bigData))
            let arr = Array.call(null, ...Array(24)).map((_, h) => h) //0-23的数组
            let enums = {}
            arr.forEach( (i,index)=>{
                enums[index] = index +'~' + (index+1)
            })
            let hours = currentData.map(i=>i.hour)
            let noDataHour = [];//记录没数据的日子
            arr.forEach(i=>{
                if(!hours.includes(i)){
                    noDataHour.push(i)
                }
            })
            //把没数据的日子附上空值
            if(noDataHour.length){
                noDataHour.forEach(j=>{
                    currentData.push({
                        hour : j
                    })
                })
            };
            //数据排序
            currentData.sort((a,b)=>{
                return a.hour - b.hour
            })
            this.columns[0] = {
                label: "太平洋时间",
                value: "hour",
                minWidth:100,
                enum:enums
            }
            this.tableData = []
            this.tableData = currentData

            let legend = ['曝光量','点击率','点击量','订单量','转化率','实际花费','花费占比','CPC']
            let Ydata = []; //纵坐标
            let series = []; //数据

            //console.log(currentData);
            legend.forEach(i=>{
                    Ydata.push({
                        type:'value',name:i,show:false,position:'left',nameRotate:0.1
                    })
                    let data = []
                    currentData.forEach(k=>{
                        if( i === '曝光量'){
                            data.push(k.impressions)
                        }else if( i === '点击率' ){
                             data.push(k.clickRates)
                        }else if( i === '点击量' ){
                             data.push(k.clicks)
                        }else if( i === '订单量' ){
                             data.push(k.adOrderCnt)
                        }else if( i === '转化率' ){
                             data.push(k.adConversionRates)
                        }else if( i === '实际花费' ){
                             data.push(k.cost)
                        }else if( i === '花费占比' ){
                             data.push(k.acos)
                        }else if( i === 'CPC' ){
                             data.push(k.cpc)
                        }

                    });
                    series.push({
                        name:i,
                        type:'line',
                        data:data
                    })
                })
                //console.log(series);
                let haveDataIndex ; //有数据的index
                series.forEach( (i,index)=>{
                    i.yAxisIndex = index ;
                    i.data.forEach(k=>{
                        if(k){
                            haveDataIndex = index
                            return
                        }   
                    })
                });
                if( haveDataIndex ){
                    Ydata[haveDataIndex].show = true;
                }else{
                    Ydata[0].show = true;
                }
                // console.log(Ydata);
                // console.log(series);
                this.echartsOptions = {
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
                                if(i.seriesName.indexOf('率')!==-1 || i.seriesName === '花费占比'){
                                    str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+Math.ceil(i.data*10000)/100+'%'+'</div>';
                                }else if( i.seriesName === 'CPC' || i.seriesName === '实际花费'){
                                     str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+ '$'+i.data+'</div>';
                                }else{
                                    str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+i.data+'</div>';
                                }
                            })
                            // let str='第'+this.echartsData[index].webRankPages+"页第"+this.echartsData[index].webPagesRank+"名";
                            return str;
                        }
                    },
                    legend: {
                        data:legend
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                       top: '-50px',
                        feature: {
                            dataZoom:{
                            yAxisIndex:"none"   //不启用y轴的选中
                            }
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: [...Array.call(null, ...Array(24)).map((_, h) => h+'点') ]
                    },
                    yAxis:Ydata,
                    dataZoom: [
                        {
                            type: 'slider',
                            show: true,
                            //showDetail:false
                                handleIcon:
                    "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                        },

                    ],
                      // 布局
                    grid: {         
                        //left: '15%',        
                        bottom: '15%'  // 防止 dataZoom 重叠                 
                    },
                    series:series
                };
                this.$nextTick(function(){
                    this.$refs.chart.dispatchAction({
                        type: 'takeGlobalCursor',
                        key: 'dataZoomSelect',
                        // 启动或关闭
                        dataZoomSelectActive: true
                    });
                })
                
        },
        //广告系列选择改变
        campaignChange(v){
            if( !v || !v.length){
                return
            }
            this.getOptions(
                {
                    adType:1,
                    campaignIds:v
                }
            ,2)
        },
        //广告组选择改变
        adGroupChange(v){
            if( !v || !v.length || !this.listQuery.campaignIds || !this.listQuery.campaignIds.length ){
                return 
            }
            this.getOptions(
                {
                    adType:2,
                    campaignIds:this.listQuery.campaignIds ,
                    adGroupIds:v ,
                }
            ,3)
        },
        //获取广告组合或广告系列的下拉
        getOptions(v,type){
            let {platformId,siteId,sellerId} = this.sellerData;
            let params = {platformId,siteId,sellerId,...v};
            this.$api['adKeywordQueryAdDataOption1'](
               params
            )
            .then(res => {
                let {data} = res;
                //console.log(data);
                let datas = data.map(i=>{
                    return {
                        label : i.name,
                        value : i.id,
                    }
                });
                switch(type){
                    case 1:
                        this.sdvertisingSeriesOpt = datas 
                        //console.log(this.sdvertisingSeriesOpt);
                    break;
                    case 2:
                        this.adGroupOpt = datas
                        //console.log(this.adGroupOpt);
                    break;
                    case 3:
                        this.adKeywordpOpt = datas
                        //console.log(this.adKeywordpOpt);
                    break;
                    default:
                    break;
                }
                
            }).catch(() => {})
        },
    },
    created() {
        let time = dayjs(Date.now()-(15)*3600*1000).format('YYYY-MM-DD')
        let start = dayjs(Date.now()-(15+365*24)*3600*1000).format('YYYY-MM-DD')
        this.listQuery.time = [start,time] 
        //获取广告系列的下拉
        if(this.sellerId && this.siteId){
            this.getOptions({adType:0},1)
            this.getData()
        }  
    },
    watch:{
        sellerData(){
            if(this.sellerId && this.siteId){
                this.getOptions({adType:0},1)
                this.getData()
            }  
        },
    },
    computed:{
        requestUrl(){
            return this.listQuery.type === 1 ? 'adKeywordQuerySalesByWeek' : this.listQuery.type === 2 ? 'adKeywordQuerySalesByWeekOfHour' : 'adKeywordQuerySalesByHour'
        },
        downloadUrl(){
            return this.listQuery.type === 1 ? 'adKeywordQuerySalesByWeekExport' : this.listQuery.type === 2 ? 'adKeywordQuerySalesByWeekOfHourExport' : 'adKeywordQuerySalesByHourExport'
        }
    }
};
</script>

<style scoped lang="scss">
.custom-collapse .el-form-item {
    margin-bottom: 10px;
}
.content-d{
    border:1px solid #dcdcdc;
    margin-top: 10px;
    p{
        background-color: rgba(246, 246, 249, 1);
        border-bottom:1px solid #dcdcdc;
        line-height: 40px;
        padding: 0;
        margin: 0;
        padding-left: 14px;
    }
}
.downloadBtn{
    position:absolute;
    right:40px;
    top:0;
    z-index:1000;
    /deep/{
        i{
            font-size: 26px;
        }
    }
}
</style>

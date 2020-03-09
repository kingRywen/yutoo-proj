<template>
    <div>
         <!-- 筛选条件 -->
        <el-collapse class="custom-collapse" value="'1'" accordion>
            <el-collapse-item name="1" label-width="80px">
                <div class="collapse-item-title" slot="title">
                    <span>筛选条件</span>
                </div>
                <el-form size="small" :inline="true" ref="searchRuleForm" :model="listQuery" >
                    <el-form-item prop="category" label="请选择类目">
                        <el-select v-model="listQuery.bigCategorys" multiple placeholder="请选择" collapse-tags size='mini' @change="ClassifySelectChange" style='width:300px;'>
                            <el-option
                            v-for="(item,index) in CategoryOpt"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearch" :loading="$store.state.isloading || $store.state.loading">搜索</el-button>
                        <el-button size="small" type="primary" plain @click="resetSearch" :disabled="$store.state.isloading || $store.state.loading">重置搜索</el-button>
                 </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <!-- 操作按钮 -->
        <div class="btns">
          <ElButton
            v-for="item in editBtns"
            :key='item.id'
            type="primary"
            size="small"
            :disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
            @click="item.fn"
            plain
          >{{item.name}}</ElButton>
        </div>
        <!-- BSR排名区间分布 -->
        <div>
            <div style='background-color: #f5f7fa;line-height:36px;border-top:1px solid #e5e5e5;padding-left:10px;border-bottom:1px solid #e5e5e5;'>
                BSR排名区间分布 
            </div>
            <div style='height:400px;margin-bottom:50px;'>
                <div  v-loading="echartsLoading"  class="chart-body-pie" ref="bsrChartPie"></div>
                <div  v-loading="echartsLoading"  class="chart-body-bar" ref="bsrChartBar"></div>
            </div>
        </div>
        <div style='margin-top:10px;'>
            <div style='background-color: #f5f7fa;line-height:36px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding-left:10px;'>
                上架时间区间分布 
            </div>
            <div style='height:400px;'>
                <div  v-loading="echartsLoading"  class="chart-body-pie"  ref="joinTimeChartPie"></div>
                <div  v-loading="echartsLoading"  class="chart-body-bar" ref="joinTimeChartBar"></div>
            </div>
        </div>
        <div style='margin-top:10px;'>
            <div style='background-color: #f5f7fa;line-height:36px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding-left:10px;'>
                评分区间分布 
            </div>
            <div style='height:400px;'>
                <div  v-loading="echartsLoading"  class="chart-body-pie"  ref="gradeChartPie" ></div>
                <div  v-loading="echartsLoading"  class="chart-body-bar" ref="gradeChartBar"></div>
            </div>
        </div>
        <div style='margin-top:10px;'>
            <div style='background-color: #f5f7fa;line-height:36px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding-left:10px;'>
                日新增评价产品分布 
            </div>
            <div style='height:400px;'>
                <div  v-loading="echartsLoading"  class="chart-body-pie"  ref="evaluateChartPie"></div>
                <div  v-loading="echartsLoading"  class="chart-body-bar" ref="evaluateChartBar"></div>
            </div>
        </div>


        <!-- 弹框 -->
        <Dialog :options="innerDialogOpts" :events="events" @close="innerDialogOpts.visible = false">
            <transition-type name="fadeIn-fadeOut">
                <component
                v-if="innerDialogOpts.visible"
                :is="dialogComponent.component"
                :params="dialogComponent.params"
                ref="component"
                ></component>
            </transition-type>
        </Dialog>

    </div>
</template>

<script>
import Dialog from './common//bigDialog';
import echarts from "echarts";
export default {
    components:{
        Dialog,
    },
    data() {
        return {
            //筛选条件
            listQuery:{
                bigCategorys:[],//类目
                taskId:null,
            },
            CategoryOpt:[],//类目的下拉选项
            tableLoading:false,//搜索按钮的loading
            oldSeclect:[],//原来选择过的展示的分类,和现在选择的对比,看有没有全部
            selectTrue:[],//确认搜索后保存类目的勾选
            //操作按钮
            editBtns:[
                {
                    name: "统计区间设置",
                    fn: () =>{
                       return this.StatisticalTntervalSetting()
                    }
                }
            ],


            //弹框的配置
            innerDialogOpts: {
                visible: false,
                closeOnClickModal: true
            },
            dialogComponent: {},//弹框的组件
            //弹框的事件
            events:{
                open() {
                    setTimeout(() => {
                        vm.$nextTick(() => {
                        // 弹窗里的组件
                        let component = vm.$refs.component
                        if (!component) {
                            return
                        }
                        // 调用组件初始化函数
                        component && component._initData && component._initData()
                        })
                    })
                },
                close() {
                    // 弹窗里的组件
                    let component = vm.$refs.component
                    // 调用组件关闭函数
                    component && component._close && component._close()
                    },
                    handleOkClick() {
                    let component = vm.$refs.component
                    // if (!component) {
                    //   return
                    // }
                    if (!component._submit) {
                        throw new Error('确保弹窗组件内定义了_submit方法')
                    }
                    return (
                        component &&
                        component._submit &&
                        component._submit().then(res => {
                        if (res) {
                            vm.innerDialogOpts.visible = false
                            vm.getList(undefined, res === 'reset')
                        }
                        })
                    )
                }
            },

            //echarts loading
            echartsLoading:true,
            bsrChartPie:"",//BSR排名区间分布拼图
            bsrChartBar:"",//BSR排名区间分布柱状图
            joinTimeChartPie:"",//上架时间区间分布柱状图
            joinTimeChartBar:"",//上架时间区间分布柱状图
            gradeChartPie:"",//评分区间分布柱状图
            gradeChartBar:"",//评分区间分布 柱状图
            evaluateChartPie:"",//日新增评价产品分布柱状图
            evaluateChartBar:"",//日新增评价产品分布柱状图
            eachartData:'',//数据

        };
    },
    methods: {
        //获取类目的下拉
            getCategoryOpt(){
                this.$api['taskShopDepthAnalysisSellerCategory']({taskId:this.$route.query.taskId})
                .then(data => {
                   // console.log(data);
                    if(data.code===0){
                        let res=data.data;
                        res.forEach(i=>{
                            this.CategoryOpt.push({label:i.bigCategory,value:i.bigCategory})
                        });
                        this.CategoryOpt.unshift({label:'全部',value:0});
                        this.ClassifySelectChange([0])
                        //console.log(this.CategoryOpt);
                    }
                }).catch(() => {})
            },
        //确认搜索
            handleSearch(){
                this.getData();
            },
        //重置搜索
            resetSearch(){
                this.listQuery.bigCategorys=[];
                this.getData();
            },
        //选择的类目改变
            ClassifySelectChange(v){
                // console.log('vvvvvvvvvvvvvvv');
                //  console.log(v);
                
                if(this.oldSeclect.includes(0) && !v.includes(0)){ //原来有全部,现在没有 , 把选择数据的情清空
                    this.listQuery.bigCategorys=[];
                    this.oldSeclect= this.listQuery.bigCategorys;

                }else if( !this.oldSeclect.includes(0) && v.includes(0)){ //原来没有全部 , 现在有 , 全部选择
                    this.listQuery.bigCategorys=[];
                    this.CategoryOpt.forEach(item=>{
                        this.listQuery.bigCategorys.push(item.value);
                    });
                    this.oldSeclect= this.listQuery.bigCategorys;  //将选择的保存起来

                }else if( v.length<this.CategoryOpt.length && v.includes(0)){ //现在有全部,但是没全选 , 全部选择
                    this.listQuery.bigCategorys=[];
                    v.forEach(item=>{
                        if(item!==0){
                            this.listQuery.bigCategorys.push(item);
                        }
                    });
                    this.oldSeclect= this.listQuery.bigCategorys;

                }else if((v.length===this.CategoryOpt.length-1) && !v.includes(0)){  //刚好全部选完 ,并且没选全部 ,全部选择
                    this.listQuery.bigCategorys=[];
                    this.CategoryOpt.forEach(item=>{
                        this.listQuery.bigCategorys.push(item.value);
                    });
                    this.oldSeclect= this.listQuery.bigCategorys;
                };
                //  console.log('objectobjectobjectobjectobjectobjectobject');
                //  console.log(this.listQuery.echartsClassify);
            },
        //统计区间设置
            StatisticalTntervalSetting(){
             
                //console.log('object');
                this.$dialog({
                    title: "统计区间设置",
                    width: "700px",
                    params: {
                       taskId:this.$route.query.taskId,
                       fn:this.getData
                    },
                    component: () => import("./common/dialog.vue"),
                    // okBtnText: "确认",
                    // cancelBtnText: "取消"
                });
            },
        //弹窗
            $dialog({ title, width, component, okBtnText, cancelBtnText, params }) {
                component().then(com => {
                    //console.log(com)
                    com.default.inheritAttrs = false
                    this.dialogComponent.component = com.default
                    this.dialogComponent.params = params
                    this.innerDialogOpts.title = title
                    this.innerDialogOpts.visible = true
                    this.innerDialogOpts.width = width
                    this.innerDialogOpts.okBtnText = okBtnText
                    this.innerDialogOpts.cancelBtnText = cancelBtnText
                })
            },
        //获取数据
            getData(){
                
                this.selectTrue=this.listQuery.bigCategorys;
                //console.log(this.selectTrue);
                // if(this.selectTrue.includes(0)){
                //     this.selectTrue.splice(this.selectTrue.indexOf(0),1)
                // };
                //console.log(this.selectTrue);
                let {taskId,bigCategorys} = JSON.parse(JSON.stringify(this.listQuery))
                if( bigCategorys.includes(0)){
                    bigCategorys.splice(this.selectTrue.indexOf(0),1)
                }
                this.echartsLoading=true;
                this.$api['taskShopDepthAnalysisStatList'](
                    {
                        taskId,
                        bigCategorys
                    }
                )
                .then(data => {
                    if(data.code===0){
                        this.eachartData=data.data;
                        this.setOption();
                        //console.log(this.eachartData);
                    }
                })
            },
        //echarts初始化
            initEchart(){
                this.bsrChartPie=echarts.init(this.$refs.bsrChartPie);
                this.bsrChartBar=echarts.init(this.$refs.bsrChartBar);
                this.joinTimeChartPie=echarts.init(this.$refs.joinTimeChartPie);
                this.joinTimeChartBar=echarts.init(this.$refs.joinTimeChartBar);
                this.gradeChartPie=echarts.init(this.$refs.gradeChartPie);
                this.gradeChartBar=echarts.init(this.$refs.gradeChartBar);
                this.evaluateChartPie=echarts.init(this.$refs.evaluateChartPie);
                this.evaluateChartBar=echarts.init(this.$refs.evaluateChartBar);
            },
        //setOption
            setOption(){
                this.echartsLoading=false;
                let bsrData;//BSR排名区间分布
                let joinTimeData;//上架时间区间分布
                let gradeData;//评分区间分布
                let evaluateData;//日新增评价产品分布
                this.eachartData.forEach(i=>{
                    //判断数据类型给对应的赋值
                    if(i.dataType===0){  //bsr
                        bsrData=i.list;
                        let pieData=[];
                        let barXdata=[];
                        let barSData=[];
                        bsrData.forEach(i=>{
                            barXdata.push(i.range);
                            barSData.push(i.cnt);
                            pieData.push(
                                 {value:i.cnt, name:i.range}
                            )
                        });
                        // console.log(barXdata);
                        // console.log(barSData);
                        this.bsrChartBar.setOption(barSetOption(barXdata,barSData));
                        ///console.log(this.bsrChartPie);
                        this.bsrChartPie.setOption(pieSetOption(pieData));

                        //触发父组件定义的方法,要转到产品列表页面
                        this.bsrChartPie.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"bsr",select:this.selectTrue })
                        });
                        this.bsrChartBar.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"bsr", select:this.selectTrue })
                        });

                    }else if(i.dataType===1){  //上架时间
                        joinTimeData=i.list;
                        let pieData=[];
                        let barXdata=[];
                        let barSData=[];
                        joinTimeData.forEach(i=>{
                            barXdata.push(i.range);
                            barSData.push(i.cnt);
                            pieData.push(
                                 {value:i.cnt, name:i.range}
                            )
                        });
                        this.joinTimeChartBar.setOption(barSetOption(barXdata,barSData));
                        ///console.log(this.bsrChartPie);
                        this.joinTimeChartPie.setOption(pieSetOption(pieData));

                        //触发父组件定义的方法,要转到产品列表页面
                        this.joinTimeChartPie.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"joinTime",select:this.selectTrue })
                        });
                        this.joinTimeChartBar.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"joinTime",select:this.selectTrue })
                        });

                    }else if(i.dataType===2){  //评分区间分布
                        gradeData=i.list;
                        let pieData=[];
                        let barXdata=[];
                        let barSData=[];
                        gradeData.forEach(i=>{
                            barXdata.push(i.range);
                            barSData.push(i.cnt);
                            pieData.push(
                                 {value:i.cnt, name:i.range}
                            )
                        });
                         this.gradeChartBar.setOption(barSetOption(barXdata,barSData));
                        ///console.log(this.bsrChartPie);
                        this.gradeChartPie.setOption(pieSetOption(pieData));

                        //触发父组件定义的方法,要转到产品列表页面
                        this.gradeChartPie.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"grade",select:this.selectTrue })
                        });
                        this.gradeChartBar.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"grade",select:this.selectTrue })
                        });

                    }else if(i.dataType===3){ //日新增评价产品分布
                        evaluateData=i.list;
                        let pieData=[];
                        let barXdata=[];
                        let barSData=[];
                        evaluateData.forEach(i=>{
                            barXdata.push(i.range);
                            barSData.push(i.cnt);
                            pieData.push(
                                 {value:i.cnt, name:i.range}
                            )
                        });
                        this.evaluateChartBar.setOption(barSetOption(barXdata,barSData));
                        ///console.log(this.bsrChartPie);
                        this.evaluateChartPie.setOption(pieSetOption(pieData));

                        //触发父组件定义的方法,要转到产品列表页面
                        this.evaluateChartPie.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"evaluate",select:this.selectTrue })
                        });
                        this.evaluateChartBar.on('click',  (params)=> {
                            //console.log(params);
                            this.$emit('activeName',{bigCategorys:params.name,type:"evaluate",select:this.selectTrue })
                        });

                    }
                });
                //饼图设置optins
                function pieSetOption(data){
                    return{
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        series : [
                            {
                                name: '产品数量',
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:data,
                                // data:[
                                //     {value:335, name:'直接访问'},
                                //     {value:310, name:'邮件营销'},
                                //     {value:234, name:'联盟广告'},
                                //     {value:135, name:'视频广告'},
                                //     {value:1548, name:'搜索引擎'}
                                // ],
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                                //每一格的标题
                                label:{
                                    show:true,
                                    formatter: '{b} : {c} ({d}%)'
                                }
                            }
                        ]
                    }
                };
                //柱状图设置options
                function barSetOption(barXdata,barSData){
                    return{
                        title: {
                            text: '产品数量',
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                        },
                        color:['skyblue'],
                        // 布局
                        grid: {
                            left: "6%",
                            right: "8%",
                            bottom: "11%", // 防止 dataZoom 重叠
                            containLabel: true
                        },
                        xAxis: {
                            type : 'category',
                            splitLine: {show:false},
                            //data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            data : barXdata,
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                rotate: 45,
                            }
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
                        yAxis: {
                            type : 'value'
                        },
                        series: [
                            {
                                type: 'bar',
                                barWidth: '50%',
                                data: barSData
                                //data:[10, 52, 200, 334, 390, 330, 220]
                            },
                            
                
                        ]
                    }
                };

            },

    },
    created() {
      
        this.oldSeclect=this.listQuery.bigCategorys;

        this.listQuery.taskId=this.$route.query.taskId;

        this.getCategoryOpt();
        this.getData();

        this.$nextTick(function(){
              this.initEchart();
        })

    },
    watch:{
       
    },
     beforeDestroy() {
        this.bsrChartPie.dispose();
        this.bsrChartPie = null;
        this.bsrChartBar.dispose();
        this.bsrChartBar = null;

        this.joinTimeChartPie.dispose();
        this.joinTimeChartPie = null;
        this.joinTimeChartBar.dispose();
        this.joinTimeChartBar = null;

        this.gradeChartPie.dispose();
        this.gradeChartPie = null;
        this.gradeChartBar.dispose();
        this.gradeChartBar = null;

        this.evaluateChartPie.dispose();
        this.evaluateChartPie = null;
        this.evaluateChartBar.dispose();
        this.evaluateChartBar = null;
    },
};
</script>

<style scoped lang="less">
 .custom-collapse {
    .el-collapse-item__header,
    .collapse-item-title {
      display: flex;
      justify-content: space-between;
    }
    .collapse-item-title {
      flex: 1;
      .el-button--text {
        margin-right: 10px;
      }
    }
    /deep/.el-collapse-item__arrow {
        float: left !important;
    }
  }
   .btns {
        padding: 10px;
        // border-left:1px solid #e5e5e5;
        // border-right:1px solid #e5e5e5;
  }
  .chart-body-pie{
    height: 400px;
    width: 40%;
    display:inline-block;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .chart-body-bar{
    height: 400px;
    width: 60%;
    display:inline-block;
    //border: 1px solid @borderColor;
    padding-top: 10px;
    padding-bottom: 40px;

  }
</style>

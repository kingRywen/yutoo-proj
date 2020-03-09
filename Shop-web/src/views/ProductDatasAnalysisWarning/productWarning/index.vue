<template>
    <div class='parent'>
        <!-- 筛选条件 -->
        <el-collapse class="custom-collapse" value="`1`" accordion>
            <el-collapse-item title="筛选条件" name="1" label-width="80px" style='text-align:left;'>
                <el-form :inline="true" ref="searchRuleForm" :model="listQuery" >
                    <el-form-item prop="asin" label="ASIN / SKU">
                        <el-input  placeholder="请输入ASIN / SKU" size="small" v-model.trim="listQuery.asin" :clearable='true'></el-input>
                    </el-form-item>
                    <el-form-item label="预警内容" prop="warnType" >
                        <el-select v-model="listQuery.warnType" placeholder="请选择" size='small' :clearable='true'>
                            <el-option
                            v-for="item in warningOptions"
                            :key="item.value"
                            :label="item.warnContentCustom? item.warnContentCustom : item.warnContent"
                            :value="item.warnType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="统计方式" prop="productType" :rules="[{ required: true, message: '请选择统计方式', trigger: 'change' }]" >
                        <el-select v-model="listQuery.productType" placeholder="请选择" size='small'  :clearable='true'>
                            <el-option
                            v-for="item in statisticsOptions"
                            :key="item.value"
                            :clearable='true'
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="是否无效" prop="ignoreType">
                        <el-select v-model="listQuery.ignoreType" placeholder="请选择" size='small'  :clearable='true'>
                            <el-option
                            v-for="item in invalidOptions"
                            :key="item.value"
                            :clearable='true'
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" :loading='btnLoading' icon="el-icon-search"  @click="handleSearch">搜索</el-button>
                        <el-button size="small" type="primary" plain @click="resetSearch" :disabled="btnLoading">重置搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <!-- 操作按钮 -->
        <div class="box-update">
            <el-button size="small" type="primary" plain  @click='opensettingDialog'>预警提示设置</el-button>
            <el-button size="small" type="primary" plain  @click='exportBtn'  :disabled="$store.state.isloading || $store.state.loading">导出</el-button>
             <el-button size="small" type="primary" plain  @click='setInvalidSku' :disabled="$store.state.isloading || $store.state.loading">设置为无效SKU</el-button>
             <el-button size="small" type="primary" plain  @click='revocationSetInvalidSku' :disabled="$store.state.isloading || $store.state.loading">撤销设置无效SKU</el-button>
             <el-button size="small" type="primary" plain  @click='setParentGradeBtn'>设置父产品目标评分</el-button>
             <el-button size="small" type="primary" plain  @click='recount'  :disabled="$store.state.isloading || $store.state.loading">重新统计</el-button>
        </div>
        <!-- 滑标start -->
        <transition>
            <div v-show="showCircle" class="scroll-box" ref="outer" @mouseenter="showCircle = true" @mousemove="handleMousemove"
                @mousedown="handleMouseDown">
                <div class="scroll-box-inner" ref="inner" @mousemove="handleMousemove($event, true)"></div>
                <div class="arrow-left" @mousedown.stop="handleArrowMousedown"></div>
                <div class="arrow-right" @mousedown.stop="handleArrowMousedown"></div>
            </div>
        </transition>
        <!-- 滑标end -->
        <!-- table 表格 -->
        <div class="box-data">
             <yt-table
                reserveSelection="productId"
                :treeTable="treeTable"
                :treeTableOtions="treeTableOtions"
                v-loading="listLoading"
                @sortChange="sortChange"
                @selectChange="selectChange"
                border
                :tableRowClassName='tableRowClassName'
                :treeColor='"true"'
                :data="list"
                :columns="columns"
                :selection="showSelection"
                ref="table"
                >
             </yt-table>
        </div>
        <!-- 分页 -->
        <el-pagination background  @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" >
        </el-pagination>
        <!-- 预警提示设置弹框 -->
        <yt-dialog :options="settingOptions" :events="editCustomNameEvents"  class="edit-custom-name-dialog">
            <el-table
                :data="warningtableData"
                 border
                 v-loading="warningtableDataloading"
                style="width: 100%;border-left:1px solid #e5e5e5;border-bottom:none;">
                <el-table-column
                    prop="warnContent"
                    label="预警问题"
                    width="300">
                </el-table-column>
                <el-table-column
                    prop="warnContentCustom"
                    label="自定义提示"
                    width="350">
                </el-table-column>
                <el-table-column
                    label="操作">
                   <template slot-scope="scope">
                        <div>
                           <el-button type="text" icon="el-icon-edit" @click='editContent(scope.$index)'></el-button>
                        </div> 
                    </template>
            </el-table-column>
            </el-table>
            <div  slot="footerIn">
                
            </div>
        </yt-dialog>
        <!-- 修改预警提示设置弹框 -->
        <yt-dialog :options="editsettingOptions" :events="saveNameEvents"  class="edit-custom-name-dialog">
                <div style='height:100px;margin-top:50px;'>
                    <el-input v-model.trim="editInput" placeholder="请输入内容,不输入为删除此项"></el-input>
                </div>
        </yt-dialog>
         <!-- 预警问题弹框 -->
        <yt-dialog :options="warningProOptions" :events="editCustomNameEvents"  class="edit-custom-name-dialog">
               <el-table
                :data="warningProDatas"
                 border
                style="width: 100%;border-left:1px solid #e5e5e5;border-bottom:none;text-align:center;">
                    <el-table-column
                        prop="warnContent"
                        label="预警问题"
                        >
                    </el-table-column>
            </el-table>
            <div  slot="footerIn">
                
            </div>
        </yt-dialog>
        <!--设置父产品目标评分  -->
        <yt-dialog :options="setParentGradeOptions" :events="setParentGradeeEvents"  class="edit-custom-name-dialog">
                <el-form :label-position="'center'" label-width="80px" :model="setParentGradeData" ref='setParentGradeRef'>
                    <el-form-item label="目标评分" prop='grade' :rules="setParentGradeRules()">
                        <el-input v-model.number="setParentGradeData.grade"  min="0" max='5' size='small' placeholder='请输入目标评分'></el-input>
                    </el-form-item>
                </el-form>
        </yt-dialog>
       <a href="" ref='link'></a>
    </div>
</template>

<script>
export default {
    components:{
    },
    data() {
        let vm=this;
        let validatePass= (rule, value, callback) => {
            if (value === '') {
               return callback(new Error('请输入'));
            } else if ( isNaN(Number(value))) {
               return callback(new Error('请输入数字'));
            } else if( Number(value) >5 || Number(value)<0){
               return callback(new Error('请输入0到5之间的数字'));
            }
            callback()
        };
        return {
            showCircle: false,
            listLoading:false,
            list:[],
            childAsinList:[],//子asin数组
            treeTable:true,
            treeTableOtions:{
                childs: "childList",
                expandFunc: row => {
                    return (row.childList && row.childList.length > 0);
                }
            },
            columns:[
                 {
                    label: "SKU",
                    value: "sku",
                    width:"230px",
                    expand:true,
                    render(h,scope){
                        let length = ( scope.row.childList ? "("+ scope.row.childList.length +')': '' );
                        var styles = {
                            'text-overflow': 'ellipsis',
                            'overflow': 'hidden',
                            'white-space': 'nowrap',
                            'display':'inline-block',
                            'max-width':scope.row.ignoreType ===1 ? '120px' :'150px',
                            'vertical-align': 'top',
                            
                        }
                        return(
                           <span style='width:180px;display:inline-block;'>
                                {
                                    scope.row.ignoreType ===1 ? (
                                         <el-tooltip class="item" effect="light" content="无效sku" placement="top-start">
                                            <i class='el-icon-info' style='margin-right:10px;margin-left:6px;font-size:18px;vertical:middle;' ></i>
                                        </el-tooltip>
                                    ):( '' )
                                }
                                <el-tooltip class="item" effect="light" content={scope.row.sku} placement="top-start">
                                    <span style={styles}>
                                        { scope.row.sku}                                       
                                    </span>
                                </el-tooltip>
                                <span style='vertical-align: top;color:red'>{length}</span>
                           </span>
                             
                        )
                    }
                },
                {
                    label: "ASIN",
                    value: "ASIN",
                    width:"200px",
                    render(h,scope,a,b){
                        return(
                            <span>

                                <a href={scope.row.productUrl} style='color: #108ee9;' target='_blink'>{scope.row.asin}</a>
                            </span>                          
                        )
                    }
                },
                {
                    label: "主图",
                    value: "imageUrl",
                    img:true,
                    style: {
                        //图片宽高
                        width: 40,
                        height: 40
                    },
                    bulkyHeight: 120 //鼠标hover图片高，宽度自动
                },
                {
                    label: "访客数",
                    merge:[
                        {
                            label: "总数",
                            value: "sessions",
                            sortable:"custom"
                        },
                        {
                            label: "广告",
                            value: "adSessions",
                            sortable:"custom"
                        },
                        {
                            label: "自然",
                            value: "normalSessions",
                            sortable:"custom"
                        },

                    ]
                },
                {
                    label: "订单量",
                    merge:[
                        {
                            label: "总数",
                            value: "orderCnt",
                            sortable:"custom"
                        },
                        {
                            label: "广告",
                            value: "adOrderCnt",
                            sortable:"custom"
                        },
                        {
                            label: "自然",
                            value: "normalOrderCnt",
                            sortable:"custom"
                        },

                    ]
                },
                {
                    label: "转化率",
                    merge:[
                        {
                            label: "总数",
                            value: "conversionRates",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.conversionRates || scope.row.conversionRates===0 ) ? Math.ceil(scope.row.conversionRates*10000)/100+'%' : "-" }</span>
                                )
                            }
                        },
                        {
                            label: "广告",
                            value: "adConversionRates",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.adConversionRates || scope.row.adConversionRates===0 ) ? Math.ceil(scope.row.adConversionRates*10000)/100+'%' : "-" }</span>
                                )
                            }
                        },
                        {
                            label: "自然",
                            value: "normalConversionRates",
                            sortable:"custom",
                            render(h,scope){
                                return(
                                    <span>{ (scope.row.normalConversionRates || scope.row.normalConversionRates===0 ) ? Math.ceil(scope.row.normalConversionRates*10000)/100+'%' : "-" }</span>
                                )
                            }
                        },

                    ]
                },
                {
                    label:"购物车获得率",
                    value:"buyBoxPercentage",
                    width:'120px',
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.buyBoxPercentage || scope.row.buyBoxPercentage===0 ) ? Math.ceil(scope.row.buyBoxPercentage*10000)/100+'%' : "-" }</span>
                        )
                    }
                },
                {
                    label:"广告曝光量",
                    value:"impressions",
                    width:'120px',
                    sortable:"custom",
                },
                {
                    label:"广告点击率",
                    value:"adClickRates",
                    width:'120px',
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.adClickRates || scope.row.adClickRates===0 ) ? Math.ceil(scope.row.adClickRates*10000)/100+'%' : "-" }</span>
                        )
                    }
                },
                 {
                    label:"可售库存",
                    value:"sellableQuantity",
                    width:'120px',
                    sortable:"custom",
                },
                // 从这开始改字段
                 {
                    label:"评分",
                    value:"starCnt",
                     width:'90px',
                    sortable:"custom",
                },
                 {
                    label:"目标评分",
                    value:"goalStarCnt",
                    width:'120px',
                    sortable:"custom",
                },
                {
                    label:"评价数",
                    value:"reviewCnt",
                    width:'90px',
                    sortable:"custom",
                },
                {
                    label:"退货件数",
                    value:"returndCnt",
                    width:'120px',
                    sortable:"custom",
                },
                {
                    label:"退货率",
                    value:"refundRate",
                    width:'120px',
                    sortable:"custom",
                    render(h,scope){
                        return(
                            <span>{ (scope.row.refundRate || scope.row.refundRate===0 ) ? Math.ceil(scope.row.refundRate*10000)/100+'%' : "-" }</span>
                        )
                    }
                },
                {
                    label:"预警内容",
                    value:"pdWarnContents",
                    width:'300px',
                    render(h,scope){
                        let { pdWarnContents } =scope.row ;
                        let spnBTN={
                            'width': '30px',
                            'height': '30px',
                            'border-radius': '15px',
                            'background-color': '#ff3040',
                            'position': 'absolute',
                            'right': 0,
                            'top': 0,
                            'color': 'white',
                            'text-align': 'center',
                            'font-size': '14px',
                            'line-height': '30px',
                            'cursor': 'pointer',
                        }
                        let div;
                        if( pdWarnContents ){
                            div=( <div style='position:relative;'>
                                    <div style='line-height: 30px;display:inline-block;'>
                                        { scope.row.pdWarnContents[0].warnContent }
                                    </div> 
                                    {
                                        scope.row.pdWarnContents.length ?  
                                            <span style={spnBTN}
                                                onClick={()=>{
                                                    return vm.proviewProblem(scope.row.pdWarnContents)
                                                }}
                                            >
                                                +{scope.row.pdWarnContents.length}
                                            </span>
                                        
                                        : "-"
                                    }
                                
                                </div>
                            ) 
                        }else{
                            div='-';
                        }
                        return(
                            div
                        )
                    }
                },
               

            ],
            showSelection:true,
            warningOptions:[],//预警内容选择器
            statisticsOptions:[
                {label:"父产品",value:1},
                {label:"子产品",value:0},
            ],
            invalidOptions:[
                {label:"是",value:1},
                {label:"否",value:0}
            ],
            //查询条件
            listQuery:{
                asin:"",
                warnType:"",//预警内容
                // productType:1,//统计方式
                pageSize: 10,
                pageNumber: 1,
                ignoreType:'',//是否无效
                field:null,//排序的字段名
                sort:null,//排序方式
                sellerId:null,
                siteId:null,
                platformId:this.platformId,
            },
            total:0,//列表总数,
            settingOptions:{
                visible: false,
                 size:"medium",
                // width:'600px',
                title: "预警提示设置",
                okBtnText:"关闭",
                showFooter:false,
            },
            editsettingOptions:{
                visible: false,
                size:"small",
                title: "编辑",
            },
            warningProOptions:{
                visible: false,
                size:"small",
                title: "预警问题",
                okBtnText:"关闭",
                showFooter:false,
            },
            editCustomNameEvents: {
                handleOkClick: () => {
                    this.settingOptions.visible=false;
                    this.warningProOptions.visible=false;
                }
            },
            saveNameEvents:{
                 handleOkClick: () => {
                    this.savewarningName();
                }
            },
            setParentGradeOptions:{
                visible: false,
                size:"small",
                title: "设置目标评分",
            },
            setParentGradeeEvents:{
                handleOkClick: () => {
                    this.setParentGrade();
                }
            },
            setParentGradeData:{
                grade:""
            },

            setParentGradeRules(){
                return { validator: validatePass, trigger: ['blur','change'] ,required:true }
            },

            warningtableData:[],//预警提示设置内容列表
            editInput:'',//修改预警提示设置内容的输入
            editwarnType:"",//预警提示设置类型
            warningtableDataloading:false,
            selectIds:[],//列表选择的id数组
            warningProDatas:[],//预警问题

            btnLoading:false,//确认搜索按钮的loading


        };
    },
    methods: {
        moveAndScroll(child, e, isMoveInnerCircle = true) {
            let vm = this;
            let { target, pageX, pageY } = e;
            // 移动小圆
            let {
            offsetLeft: pLeft,
            offsetTop: pTop,
            offsetWidth,
            offsetHeight
            } = child;

            if (isMoveInnerCircle) {
            let scrollTop =
                document.body.scrollTop || document.documentElement.scrollTop;
                child.style.left = pageX - offsetWidth / 2 + "px";
                child.style.top = pageY - offsetHeight / 2 + "px" - scrollTop;
            }

            // 滑动scroll
            let scrollLeftEl = document.querySelectorAll(
            ".el-table__body-wrapper"
            )[0];
            let distanceX = Math.abs(pageX - this.originX);
            let distanceY = pageY - this.originY;
            window._setTimeout =
            window._setTimeout ||
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.setTimeout;

            function updateScroll() {
            //
            if (vm.requestId) {
                if (window.requestAnimationFrame) {
                window.cancelAnimationFrame(vm.requestId);
                } else {
                clearTimeout(vm.requestId);
                }

                vm.requestId = null;
            }
            if (pageX > vm.originX) {
                // 右
                scrollLeftEl.scrollLeft += 2 + distanceX;
                vm.requestId = window._setTimeout(updateScroll);
            }
            if (pageX < vm.originX && scrollLeftEl.scrollLeft > 0) {
                // 左
                scrollLeftEl.scrollLeft -= 2 + distanceX;
                if (scrollLeftEl.scrollLeft !== 0) {
                vm.requestId = window._setTimeout(updateScroll);
                }
            }
            }

            if (scrollLeftEl) {
                updateScroll();
            }
		},
        handleTableMouseleave() {
            this.showCircle = false;
        },
        handleTableMouseenter() {
            this.showCircle = true;
            this.setInnerCirclePosition();
        },
        setInnerCirclePosition() {
            if (!this.$refs.outer) {
            return;
            }
            this.$nextTick(() => {
            let {
                offsetLeft,
                offsetTop,
                offsetWidth,
                offsetHeight
            } = this.$refs.outer;
            let {
                offsetWidth: offsetWidth1,
                offsetHeight: offsetHeight1
            } = this.innerCircle;

            this.originX = offsetLeft + offsetWidth / 2;
            this.originY = offsetTop + offsetWidth / 2;
            this.originLeft = this.originX - offsetWidth1 / 2;
            this.originTop = this.originY - offsetHeight1 / 2;

            this.innerCircle.style.left = this.originLeft + "px";
            this.innerCircle.style.top = this.originTop + "px";
            });
		},
        handleMouseUp(e) {
			  this.move = false;
			  this.innerCircle.style.left = this.originLeft + "px";
			  this.innerCircle.style.top = this.originTop + "px";

			  if (window.requestAnimationFrame) {
				window.cancelAnimationFrame(this.requestId);
			  } else {
				clearTimeout(this.requestId);
			  }
			  this.requestId = null;
		},
        handleArrowMousedown(e) {
            this.move = true;
            if (this.move) {
            let child = this.innerCircle;
            if (child) {
                this.moveAndScroll(child, e, false);
            }
            }
        },
        handleMouseDown(e) {
            this.move = true;
            // 当前点击的点
            // this.currentPointX = e.pageX;
            // this.currentPointY = e.pageY;
            if (this.move) {
            let child = this.innerCircle;
            if (child) {
                this.moveAndScroll(child, e);
            }
            }
        },
        handleMousemove(e, isSelf) {
            if (this.move) {
                let child = this.innerCircle;
                if (child) {
                    this.moveAndScroll(child, e);
                }
            }
        },
        
        tableRowClassName(arg){
            let { row, rowIndex} = arg ;
            if(row.parent){
                return 'product-warning-table-bgc' 
            }
        },
        //筛选条件确认搜索
        handleSearch(){
            this.listQuery.pageNumber=1;
            this.getList();
        },
        //筛选条件重置搜索
        resetSearch(){
            this.$refs.searchRuleForm.resetFields();
            this.listQuery.pageNumber=1;
            this.getList();
        },
        //预警内容下拉
        getwarnTypeOption(){
            this.warningtableDataloading=true;
            this.$api["pdWarnConfigList"](
                {
                    sellerId:this.listQuery.sellerId,
                    siteId	:this.listQuery.siteId
                }
            )
            .then(data => {
                if(data.code===0){
                    this.warningOptions=data.data;
                    this.warningtableData=data.data;
                    this.warningtableDataloading=false;
                    //console.log(data.data);
                }
            })
            .catch(() => {

            });
        },
        //每页总数改变
        handleSizeChange(val){
            this.listQuery.pageSize = val;
            this.getList();
        },
        //分页器当前页改变
        handleCurrentChange(val) {
            this.listQuery.pageNumber = val;
            this.getList();
        },
        //获取列表数据
        getList(){
            this.listLoading=true;
            this.btnLoading=true;
            this.$api["pdWarnRtList"](this.listQuery)
            .then(data => {
                //console.log(data)
                this.list=data.rows;
                this.childAsinList = [];
                this.list.forEach(i=>{
                    if(i.childList){
                        i.childList.forEach(k=>{
                            this.childAsinList.push(k.asin)
                        })
                    }
                })
                this.total=data.total;
                this.listLoading=false;
                this.btnLoading=false;
            })
            .catch(() => {
                this.listLoading=false;
                this.btnLoading=false;
            });
        },
        //打开预警提示设置弹框
        opensettingDialog(){
            this.settingOptions.visible=true;
        },
        //修改预计提示设置弹框
        editContent(v){
            this.editInput= this.warningtableData[v].warnContentCustom;
            this.editwarnType= this.warningtableData[v].warnType;
            this.editsettingOptions.visible=true;
        },
        //保存修改预计提示设置
        savewarningName(){
            this.$api['pdWarnConfigSave'](
                {
                    sellerId:this.listQuery.sellerId,
                    siteId:this.listQuery.siteId,
                    warnType:this.editwarnType,
                    warnContent:this.editInput
                }
            ).then(
                data=>{
                    if(data.code===0){
                        this.$message({
                            type:'success',
                            message:"操作成功"
                        });
                        this.editsettingOptions.visible=false;
                        this.getwarnTypeOption();
                    }
                }
            ).catch(() => {

            });
        },
        //点击导出按钮
        exportBtn(){
            let data={
                sellerId:this.listQuery.sellerId,
                siteId:this.listQuery.siteId,
                warnType:this.listQuery.warnType,
                productType:this.listQuery.productType,
                asin:this.listQuery.asin,
            };
            if(this.selectIds.length>0){
                data.productIds=this.selectIds
            }
            this.$api['pdWarnRtExport'](
                data
            ).then(
                data=>{

                        let url = window.URL.createObjectURL(new Blob([data]));
                        let a = this.$refs.link;
                        a.href = url;
                        a.setAttribute("download", "产品预警.xlsx");
                        a.click();
                        window.URL.revokeObjectURL(url);
                    
                }
            ).catch(err=>{
                
            })
        },
        //表格勾选改变
        selectChange(v){
            this.selectIds=[];
            v.forEach(item=>{
                this.selectIds.push(item.productId)
            })
            //console.log(this.selectIds);
        },
        //排序改变
        sortChange(column, prop, order){
            let tit=column.prop; //排序的字段名
            let sort=column.order;//排序顺序
            let v=this.sortableFunc(column, tit, sort );
            this.listQuery.field=v.sortField;
            this.listQuery.sort=v.sort;
            this.listQuery.pageNumber=1;
            this.getList();

        },
         //table排序参数处理
        sortableFunc(column, pro, order ){
            let prop = pro.replace(/[A-Z]/g, function (match) {
                return '_' + match.toLowerCase()
            })
            return {
                sort: order === 'ascending' ? 1 : 0,
                sortField: prop
            }
        },
        //查看预警问题
        proviewProblem(v){
            //console.log(v);
            this.warningProOptions.visible=true;
            this.warningProDatas=v;
        },
        //设置为无效sku
        setInvalidSku(){
            if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
            }
            this.$api['pdWarnRtSaveIgnoreAsin']({
                productIds:this.selectIds
            }).then(res=>{
                this.getList();
            })

        },
        //撤销设置无效sku
        revocationSetInvalidSku(){
            if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
            }
            this.$api['pdWarnRtRemoveIgnoreAsin']({
                productIds:this.selectIds
            }).then(res=>{
                this.getList();
            })
        },
        //重新统计
        recount(){
            this.$api['pdWarnRtRecount']({
                sellerId:this.sellerId,
                siteId:this.siteId,
            })
            .then(data => {
                this.getList();
            })
        },
        //设置目标评分按钮
        setParentGradeBtn(){
            if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
            }
            this.setParentGradeOptions.visible=true;
        },
        //设置目标评分提交
        setParentGrade(){

            this.$refs.setParentGradeRef.validate((valid) => {
                if (valid) {
                    this.$api['pdWarnRtSaveGoalStarCnt']({
                        productIds:this.selectIds,
                        goalStarCnt:this.setParentGradeData.grade
                    })
                    .then(data => {
                          this.setParentGradeOptions.visible=false;
                        this.getList();
                    }).catch(() => {})
                } 
            });
        }



    },
    created() {
        if (this.sellerId && this.siteId) {
            this.listQuery.siteId = this.siteId;
            this.listQuery.sellerId = this.sellerId;
            this.getwarnTypeOption();
            this. getList();
        }
    },
    watch: {
        sellerData() {
            if (this.sellerId && this.siteId) {
                this.listQuery.siteId = this.siteId
                this.listQuery.sellerId = this.sellerId
                this.getwarnTypeOption();
                this. getList();
            }
        }
    },
    mounted() {
        document.addEventListener("mouseup", this.handleMouseUp);
        document.addEventListener("mousemove", this.handleMousemove);
        window.addEventListener("resize", this.setInnerCirclePosition);
        this.$nextTick(() => {
            this.innerCircle = this.$refs.inner;
            let tableEl = document.querySelectorAll(".box-data")[0];
            tableEl.addEventListener("mouseenter", this.handleTableMouseenter);
            tableEl.addEventListener("mouseleave", this.handleTableMouseleave);
            // this.setInnerCirclePosition()
        });
    },
    beforeDestroy() {
        let tableEl = document.querySelectorAll(".box-data")[0];
        document.removeEventListener("mouseup", this.handleMouseUp);
        document.removeEventListener("mousemove", this.handleMousemove);
        window.removeEventListener("resize", this.setInnerCirclePosition);
        if (tableEl) {
            tableEl.removeEventListener("mouseenter", this.handleTableMouseenter);
            tableEl.removeEventListener("mouseleave", this.handleTableMouseleave);
        }
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

.box-update {
    // margin-left: 10px;
    margin-top: 10px;
}
.box-data{
    margin-top: 10px;
}
.el-table {
    border: none;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    text-align: center !important;
}
.el-pagination{
    margin-top: 5px;
    margin-bottom: 5px;
}
.__img_wrapper{
    height:40px;
    width:40px;
    margin:auto;
    .loadingImg{
        display:block;
    }
}
.el-icon-edit{
    &:hover{
        color:#0084ff;
    }
}
.spnBTN{
    width: 30px;
    height: 30px;
    border-radius: 15px;
    background-color: #ff3040;
    position: absolute;
    right: 0;
    top: 0;
    color: white;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
}
</style>

<style lang='less'>
.product-warning-table-bgc{
    background-color: rgb(242, 246, 252)!important;
    & td{
         background-color: rgb(242, 246, 252)!important;
    }
}
</style>
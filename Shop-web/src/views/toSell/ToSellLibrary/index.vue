<template>
    <div>
        <MainLayout
            :leftSpan='4'
            ref="layout"
            :isShowCustomContent='true'
        >
            <div slot="left">
                <el-input placeholder='输入分组名称进行过滤' v-model="filterTaskText" clearable size="mini" class="menu-select"></el-input>
                <div class="box-center" style='display: flex;justify-content: flex-end;'>
                    <el-tooltip class="item" effect="light" content='刷新' placement="top-start">
                        <ElButton type="text" icon="el-icon-refresh" @click="tabClick" style='margin-left:40px;'></ElButton>
                    </el-tooltip>
                </div>
                <el-tree
                    :data="taskClassifyList"
                    :props="defaultProps"
                    highlight-current
                    node-key="pcid"
                    @node-click="handleNodeClick"
                    :filter-node-method="filterNode"
                    ref="treeTaskCustomCategory"
                    v-loading="treeLoading"
                   
                    :expand-on-click-node="false"
                    key="pcid"
                    >
                    <div class="custom-tree-node custom-tree-node1 flex" slot-scope="{ node, data }">
                        <div style='font-size:12px;'>{{ node.label }}</div>
                        <div class="span-el-icon" v-if="node.label!=='全部'">
                            <!-- <el-tooltip class="item" effect="light" content='添加分组' placement="top-start">
                                <i class="el-icon-circle-plus-outline" 
                                @click.stop="addClassify(node,data)" v-if=' !(data.haveChildren===0 && data.dataFlag===1) && data.classifyId!==-1'
                                style='margin-left:10px;'
                                ></i>
                            </el-tooltip> -->
                            <el-tooltip class="item" effect="light" content='设置佣金和保底利润运费' placement="top-start" >
                                <i class="el-icon-setting" @click.stop="editClassify(node,data)" v-if='activeName === "second"' style='margin-left:10px;'></i>
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="light" content='删除分组' placement="top-start">
                                <i class="el-icon-delete" @click.stop="deleteTreeNode(node,data)" v-if='data.classifyId!==-1' style='margin-left:10px;'></i>
                            </el-tooltip> -->
                        </div>
                    </div>
                </el-tree>
            </div>
            <div slot="customContent" class='customContent'>
                <div style='position:absolute;top:-42px;right:12px;' v-if='activeName !== "first"'>
                    <el-button type="primary" size='small' @click=' setPriceMonitoringFrequency'>设置价格库存监控频率</el-button>
                </div>
                <div style='border-left:1px solid #dcdcdc;'>
                     <el-radio-group v-model="radio" @change='radioChange'>
                        <el-radio-button :label="item.siteName" v-for='(item,index) in siteList' :key='item.siteId'></el-radio-button>
                    </el-radio-group>
                </div>
                <div style='margin-top:20px'>
                    <el-tabs v-model="activeName" type="card" @tab-click='tabClick'>
                        <el-tab-pane :label="'可跟卖库'+'('+ tab1Num +')'" name="first" :lazy='true'>
                            <With-the-library :radioSiteId='radioSiteId' :siteList='siteList' :pcid='pcid'  v-if='activeName==="first"' @dialogSuccess='dialogSuccess' :symbol='symbol' ></With-the-library>
                        </el-tab-pane>
                        <el-tab-pane :label="'计划跟卖库'+'('+ tab2Num +')'" name="second" :lazy='true'>
                            <plan-and-sellWarehouse :radioSiteId='radioSiteId'  :radioSiteName='radioSiteName' :siteList='siteList' :pcid='pcid' @dialogSuccess='dialogSuccess' v-if='activeName==="second"' ref="planChild" :symbol='symbol'></plan-and-sellWarehouse>
                        </el-tab-pane>
                        <el-tab-pane :label="'正在跟卖库'+'('+tab3Num +')'" name="third" :lazy='true'>
                            <Is-selling-theWarehouse :radioSiteId='radioSiteId' :radioSiteName='radioSiteName' :pcid='pcid' v-if='activeName==="third"' :symbol='symbol'></Is-selling-theWarehouse>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </MainLayout>
    </div>
</template>

<script>
import WithTheLibrary from './components/WithTheLibrary';
import planAndSellWarehouse from './components/planAndSellWarehouse' ;
import IsSellingTheWarehouse from './components/IsSellingTheWarehouse' ;
export default {
    components:{
        WithTheLibrary,
        planAndSellWarehouse,
        IsSellingTheWarehouse,
    },
    data() {
        return {
            taskClassifyList:[],//类目列表数据
            defaultProps:{  //类目显示的配置
                children: 'childList',
                label: 'name'
            },
            treeLoading:false,//树形结构的loading
            filterTaskText:"",//树形结构筛选输入
            //站点
            siteList:[],
            radio:'',
            radioSiteId:"",//选择的站点id
            radioSiteName:"",//选择的站点名字

            activeName:'first',

            pcid:null,//选择的类目id

            tab1Num:0,
            tab2Num:0,
            tab3Num:0,

            symbol:'',//货币符号
            
        };
    },
    methods: {
		//设置佣金和保底利润完成之后,要调计划跟卖库页面的列表接口
		getSecondList(){
			this.$refs.planChild.$refs.layout.getList()
		},
		
        //获取站点列表
        getSites(){
            this.$api['siteListSite1']({
            })
            .then(data => {
                //console.log(data);
                this.siteList=data.data;
                this.radio=this.siteList[0].siteName;
                this.radioSiteName=this.siteList[0].siteName;
                this.symbol=this.siteList[0].symbol
                this.radioChange(this.radio)
                this.getTaskClassifyList()
            })
        },
        //选择站点改变
        radioChange(v){
            this.radioSiteName=v;
            this.siteList.forEach(i=>{
                if(i.siteName===v){
                    this.radioSiteId=i.siteId
                    this.symbol=i.symbol
                }   
            })
            this.getTabNum();
            this.tabClick()
            // console.log(this.radioSiteId);
            // console.log(this.radioSiteName);
        },
        tabClick(){
            let type=this.activeName;
            switch (type) {
                case 'first' :
                    this.getTaskClassifyList(4) ;
                break;  
                case 'second' :
                    this.getTaskClassifyList(5) ;
                break; 
                case 'third' :
                    this.getTaskClassifyList(6) ;
                break;
                default:
                break;
            }
        },
        //获取类目列表
        getTaskClassifyList(v){
            this.treeLoading=true;
            this.$api['imSaleProdCateList']({
                pageType: v || 4,
                siteId:this.radioSiteId
            })
            .then(data => {
                this.taskClassifyList=data.data;
                this.treeLoading=false;
            })
        },
        //点击左侧树形的节点
        handleNodeClick(data){
            //console.log(data);
            this.pcid = data.pcid;
        },
        //筛选节点
        filterNode(value, data) {
            // console.log(value);
            // console.log(data);
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //设置佣金和保底利润
        editClassify(node,data){
            //console.log(data,node);
            this.$refs.layout.$dialog({
                title: '设置佣金和保底利润',
                width: '500px',
                params:{
                    siteId:this.radioSiteId,
                    isAll:true,
                    pcid:data.pcid,
					fn:this.getSecondList
                },
                component: () => import('./components/dialog/SetFreightDialog'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        //设置价格库存监控频率
        setPriceMonitoringFrequency(){
            this.$refs.layout.$dialog({
                title: '设置价格库存监控频率',
                width: '500px',
                params:{
                    
                },
                component: () => import('./components/dialog/setPriceMonitoringFrequencyDialog'),
                okBtnText: '确认',
                cancelBtnText: '取消'
            })
        },
        dialogSuccess(){
            this.getTabNum()
        },
        //获取tab页数量
        getTabNum(){
            this.tab1Num=0;
            this.tab2Num=0;
            this.tab3Num=0;
            this.$api['imSaleProdExeListCount']({
                siteId :this.radioSiteId
            })
            .then(data => {
                data.data.forEach(i=>{
                    if( i.pageType ===0){
                        this.tab1Num=i.total || 0 ;
                    };
                    if( i.pageType ===1){
                        this.tab2Num=i.total || 0 ;
                    };
                    if( i.pageType ===2){
                        this.tab3Num=i.total || 0 ;
                    };
                })
            })
        }   
    },
    created() {
        this.getSites();
    },
    watch:{
      filterTaskText(val) {
        this.$refs.treeTaskCustomCategory.filter(val);
      }
  },

};
</script>

<style scoped lang="less">
.customContent{
    /deep/.el-radio-button__inner{
        // border-top:none;
        // border-bottom:none;
    }
    
}
.custom-tree-node{
  .span-el-icon{
    display:none;
  }
  &:hover{
    .span-el-icon{
      display:inline-block;
    }
  }
}
</style>

<template>
  <div class='MainLayout-Manual'>
    <MainLayout
      :outerParams="outerParams"
      :edits="edits"
      :leftSpan='4'
      :searchFields="searchFields"
      :editBtns="editBtns"
      :columns="columns"
      reserveSelection="productId"
      @selectChange='selectChange' 
      :treeTable="treeTable"
      :treeTableOtions="treeTableOtions"
      ref="layout"
      url="priceSeoManualListProduct"
    >
      <!-- <div slot="showRefresh">
        <el-button type="primary" plain  @click="setManualUpdate" :loading="loadingBtn1" :disabled="BTNdisabled"  style="position:absolute;right:26px;top:6px;">
            {{refreshhtml}}
            <i class="el-icon-refresh el-icon--right"></i>
        </el-button>
      </div> -->
      <div slot="left">
        <el-input placeholder='输入分组名称进行过滤' v-model.trim="filterTaskText" clearable size="mini" class="menu-select"></el-input>
        <div class="box-center" style='overflow:hidden;'>
          <div style='float:right;'>
            <el-tooltip class="item" effect="light" content='刷新' placement="top-start">
                <ElButton type="text" icon="el-icon-refresh" @click="getTaskClassifyList" style=''></ElButton>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content='添加分组' placement="top-start">
              <ElButton type="text" icon="el-icon-circle-plus-outline" @click="topAddClassify" style=''></ElButton>
            </el-tooltip>
            <!-- <ElButton type="text" icon="el-icon-edit-outline" @click="topAlterClassify"></ElButton> -->
            <el-tooltip class="item" effect="light" content='删除分组' placement="top-start">
              <ElButton type="text" icon="el-icon-delete" @click="topDeleteClassify" style=''></ElButton>
            </el-tooltip>
          </div>
        </div>
        <el-tree
          :data="taskClassifyList"
          :props="defaultProps"
          highlight-current
          show-checkbox
          node-key="classifyId"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="treeTaskCustomCategory"
          v-loading="treeLoading"
          default-expand-all
          :expand-on-click-node="false"
          key="parentCusCateId"
        >
          <div class="custom-tree-node custom-tree-node1 flex" slot-scope="{ node, data }">
            <div style='font-size:12px;'>{{ node.label + ' ('+ data.dataCnt+')' }}</div>
            <div class="span-el-icon" v-if="node.label!=='全部'">
              <el-tooltip class="item" effect="light" content='添加下级分组' placement="top-start">
                <i class="el-icon-circle-plus-outline" 
                  @click.stop="addClassify(node,data)" v-if=' !(data.haveChildren===0 && data.dataFlag===1) && data.classifyId!==-1'
                  style='margin-left:10px;'
                ></i>

              </el-tooltip>
              <el-tooltip class="item" effect="light" content='编辑分组' placement="top-start">
                <i class="el-icon-edit-outline" @click.stop="alterClassify(node,data)"  v-if='data.classifyId!==-1' style='margin-left:10px;'></i>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content='删除分组' placement="top-start">
                <i class="el-icon-delete" @click.stop="deleteTreeNode(node,data)" v-if='data.classifyId!==-1' style='margin-left:10px;'></i>
              </el-tooltip>
            </div>
          </div>
        </el-tree>
      </div>
    </MainLayout>
    <yt-dialog :options='opts' :events='dialogEvents'>
      <addAndAlterAddTimingStrategyDialog  v-if='opts.visible' ref='dialog' :params='dialogParams' :selectSkus='selectSkus' @addSuccess='addSuccess' />
    </yt-dialog>
  </div>
</template>

<script>
import addAndAlterAddTimingStrategyDialog from "./dialogs/addAndAlterAddTimingStrategyDialog"
export default {
  components:{
    addAndAlterAddTimingStrategyDialog 
  },
  data() {
    return {
      opts:{
        visible : false,
        width: '700px',
        okBtnText:'下一步',
        title:""
        //showCancel : false
        // cancelBtnText:""
      },
      dialogParams :'',
      dialogEvents:{
        handleOkClick : () =>{
          this.$refs.dialog.dialogNextStep()
        }
      },

      filterTaskText: '', //输入筛选的输入
      treeLoading: false, //树形的loading
      taskClassifyList: [], //树形的结构的数据
      defaultProps: {
        children: 'childList',
        label: 'classifyName'
      },
      //table表格配置
      treeTable: true,
      treeTableOtions: {
          childs: "childList",
          expandFunc: row => {
              return (row.childList && row.childList.length > 0);
          }
      },
      edits: [
        {
          name: '编辑调价策略',
          icon: 'el-icon-edit-outline',
          show: scope => {
            return scope.row.status !== -1
          },
          fn: (scope) => {
              this.opts.title = '编辑优化'
              this.opts.visible = true
              this.dialogParams = {productId:scope.row.productId,type:'alter',url:'priceSeoManualUpdateStrategy',ids:[scope.row.productId],pauseFlag:scope.row.status}
              let {sku, productIdsku,priceOld } = scope.row
              this.selectSkus = [{sku,productIdsku,priceOld}]
          }
        }
      ],
      searchFields: [
        {
          name: 'asin',
          label: 'ASIN/SKU',
          placeholder: '请输入ASIN / SKU',
          labelWidth:'60px',
          type:"input",
          clearable:true,
        },
        {
          label: '定时调整价格状态',
          labelWidth: '130px',
          name: 'status',
          type: 'select',
          clearable:false,
          options: [
            {
              label: '开启',
              value: 1
            },
            {
              label: '关闭',
              value: 0
            },
            {
              label: '无',
              value: -1
            }
          ]
        },
        {
          label: '定时调整价格类型',
          labelWidth: '130px',
          name: 'seoType',
          type: 'select',
          clearable:false,
          options: [
            {
              label: '每日',
              value: 0
            },
            {
              label: '周一到周日',
              value: 1
            }
          ]
        }
      ],

      outerParams:{
          sellerId:null,
          siteId:null,
          classifyId:-1,
      },
      //表格头部操作按钮
      editBtns: [
        {
          name: '移入分组',
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: ()=>{
              this.moveGroup();
          }
        },
        {
          name: '添加定时调整价格策略',
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
            }
            let data = this.$refs.layout.selection;
            if (data.some(el => el.status !== -1)) {
              this.$message.warning('选择项中已经存在策略')
              return
            }
            this.opts.title = '添加优化'
            this.opts.visible = true
            this.dialogParams = {url:'priceSeoManualSaveStrategy',ids:this.selectIds}
          }
        },
        {
          name: '编辑定时调整价格策略',
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
            }
            //console.log(this.selectIds);
            let params;
            if(this.selectIds.length===1){
               params={url:'priceSeoManualUpdateStrategy',ids:this.selectIds,type:'alter',productId:this.selectIds[0]}
            }else{
              params={url:'priceSeoManualUpdateStrategy',ids:this.selectIds}
            }
            this.opts.title = '编辑优化'
            this.opts.visible = true
            this.dialogParams = params
          }
        },
        {
          name: '关闭定时调整价格',
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
              if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
              }
              this.$api['priceSeoManualUpdateStrategyStatus']({
                  sellerId:this.outerParams.sellerId,
                  siteId:this.outerParams.siteId,
                  ids:this.selectIds,
                  pauseFlag:0,
              })
              .then(data => {
                this.$refs.layout.getList();
              }).catch(() => {})
          }
        },
        {
          name: '开启定时调整价格',
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
              if( !this.selectIds.length){
                this.$message.warning('请至少选择一项');
                return
              }
              this.$api['priceSeoManualUpdateStrategyStatus']({
                  sellerId:this.outerParams.sellerId,
                  siteId:this.outerParams.siteId,
                  ids:this.selectIds,
                  pauseFlag:1,
              })
              .then(data => {
                this.$refs.layout.getList();
              }).catch(() => {})
          }
        },
        {
          name: '编辑产品原价',
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
             if( !this.selectIds.length ){
                this.$message.warning('请至少选择一项');
                return
              }
            //console.log(this.$refs.layout.selection);
            if(this.$refs.layout.selection.some( (i)=> i.status===-1)){
                this.$message.warning('未添加定时调整价格策略')
                return
            }
            this.$refs.layout.$dialog({
              title: '设置子SKU原价',
              size: 'medium',
              params:{productId:this.selectIds},
              component: () => import('./dialogs/EditProductOriginalPriceDialog.vue'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        }
      ],
      //表格列表
      columns: [
        {
            label: "SKU",
             width:"200px",
            value: "sku",
            expand: true,
            showTooltip: true
        },
        {
            label: "ASIN",
            value: "asin",
             width:"200px",
        },
        {
          label: '状态',
          value: 'productStatus',
          enum:{
             1:'在售',
             2:'不可售'
          },
          align:'left',
        },
        {
          label: '主图',
          value: 'imageUrl',
          img:true,
          style: {
              //图片宽高
              width: 40,
              height: 40
          },
          bulkyHeight: 120 //鼠标hover图片高，宽度自动
        },
        {
          label: '所属类目',
          value: 'amzCateName',
          width:'150px',
          render(h,scope){
             let { amzCateName } = scope.row
              // return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
              return amzCateName ? (
                <el-tooltip open-delay={300} content={amzCateName}>
                  <span class="fix__row_1">{amzCateName}</span>
                </el-tooltip>
              ) : (
                <span>-</span>
            )
          }
        },
        {
          label: '标题',
          value: 'productName',
          width:'150px',
          render(h,scope){
             let { productName } = scope.row
              // return <span class="fix__row_2">{shippingWeight.join(', ')}</span>
              return productName ? (
                <el-tooltip open-delay={300} content={productName}>
                  <span class="fix__row_1">{productName}</span>
                </el-tooltip>
              ) : (
                <span>-</span>
            )
          }
        },
        {
          label: '原价',
          value: 'priceOld',
          align:'left',
        },
        {
          label: '当前售价',
          value: 'priceCurrent',
          align:'left',
        },
        {
          label: '定时调整价格状态',
          value: 'status',
          width:'150px',
          align:'left',
          enum:{
             '-1':'无',
             0:'关闭',
             1:'开启',
             2:"关闭"
          }
        },
        {
          label: '分组',
          value: 'classifyName',
          align:'left',
          render(h,scope){
              return(
                <span style='text-align:left'>{scope.row.classifyName?scope.row.classifyName:'未分组'}</span>
              )
          }
        },
      ],
      selectIds:[],//选择的产品数组
      selectSkus:[],

      treeGetCheckedIds:[],//树形结构选择的全部的节点

      loadingBtn1: false,
      refreshhtml: '手动刷新',
      BTNdisabled: false,

    }
  },
  methods: {
    //添加或修改策略成功
      addSuccess(){
        this.opts.visible = false
        this.getLayoutList()
      },
    //筛选节点
      filterNode(value, data) {
        // console.log(value);
        // console.log(data);
        if (!value) return true;
        return data.classifyName.indexOf(value) !== -1;
      },
    //表格勾选改变
      selectChange(v){
        //console.log(v);
        this.selectIds = v.map(i=>{
          return i.productId
        })
        this.selectSkus = v.map( i => {
           return {
             sku: i.sku,
             productId: i.productId,
             priceOld:i.priceOld
           }
        })
        //console.log(this.selectIds);
        //console.log(this.selectSkus);
      },  
    //获取树形结构的数据
      getTaskClassifyList(v) {
        this.treeLoading=true;
        let treeQuery = {
          sellerId:this.outerParams.sellerId,
          siteId:this.outerParams.siteId,
          platformId:this.platformId,
          classifyType:3, //固定的
          parentClassifyId:0
        };
        this.tree1Loading = true
        this.$api['riceSeoManualtaskReviewContentList'](treeQuery)
          .then(data => {
            this.treeLoading = false;
            this.taskClassifyList = data.data;
            
          })
          .catch(() => {
              this.treeLoading = false;
          })
      },
    //树形结构顶部添加分类按钮
      topAddClassify(){
        this.$refs.layout.$dialog({
            title: "添加分组",
            size:"small",
            params: {
                parentClassifyId:0,
                fn:this.getTaskClassifyList,
                topAdd:true, //是点击顶部的添加按钮
                url:"riceSeoManualtaskClassifySave",
            },
            component: () => import("./dialogs/addAndAlterTreeNodeDialog.vue"),
            okBtnText: "确定",
            cancelBtnText: "取消"
        });
      },
    //树形结构顶部删除分类按钮
      topDeleteClassify(){
        if( !this.$refs.treeTaskCustomCategory.getCheckedNodes().length){
            this.$message.warning("至少选一项");
            return;
        }
        let classifyIds=[];
        this.treeGetCheckedIds=this.$refs.treeTaskCustomCategory.getCheckedNodes();
        this.treeGetCheckedIds.forEach(i=>{
              if(i.classifyId!==-1){
                  classifyIds.push(i.classifyId)
              }
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$api['riceSeoManualtaskClassifyRemove']({
              classifyType:3, //固定的
              classifyIds
            })
            .then(data => {
                this.getTaskClassifyList();
            })
        }).catch(() => {
               
        });
       // console.log(classifyIds);
        
      },
    //点击树形的节点
      handleNodeClick(data){
        //console.log(data);
        //console.log(this.taskClassifyList );
        this.outerParams.classifyId=data.classifyId;
        this.$refs.layout.pageNo=1;
        //请求列表
        this.$refs.layout.getList();
      },
    //树形节点添加
      addClassify(node,data){
        // console.log(node);
        // console.log(data);
        let parentClassifyId=data.classifyId;
        this.$refs.layout.$dialog({
            title: "添加下级分组",
            size:"small",
            params: {
                parentClassifyId,
                fn:this.getTaskClassifyList,
                options:data,
                oneAdd:true,
                url:"riceSeoManualtaskClassifySave",
            },
            component: () => import("./dialogs/addAndAlterTreeNodeDialog.vue"),
            okBtnText: "确定",
            cancelBtnText: "取消"
        });
      },
    //树形节点编辑
      alterClassify(node,data){
        let ids= this.getParentIds(
          this.$refs.treeTaskCustomCategory.getNode(data)
        );
        ids.splice(0,1);
        //console.log(ids);
        // return;
        let classifyId=data.classifyId; //编辑时把当前的分类的id带过去
        let classifyName=data.classifyName;
        this.$refs.layout.$dialog({
            title: "修改分组",
            size:"small",
            params: {
                classifyId,
                classifyName,
                parentClassifyId:ids,
                fn:this.getTaskClassifyList,
                oneAlter:true,
                url:"riceSeoManualtaskClassifyUpdate",
            },
            component: () => import("./dialogs/addAndAlterTreeNodeDialog.vue"),
            okBtnText: "确定",
            cancelBtnText: "取消"
        });
      },
    //树形节点删除节点
      deleteTreeNode(node,data) {
          //console.log(data);
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
              let classifyIds=[data.classifyId];
              this.$api['riceSeoManualtaskClassifyRemove']({
                  classifyType:3,
                  classifyIds
              })
              .then(data => {
                  this.getTaskClassifyList();
              })
          }).catch(() => {
                   
          });
          
      },
    //移入分组
      moveGroup(){
        if(!this.selectIds.length){
            this.$message.warning('请至少选择一项');
            return
        }
        this.$refs.layout.$dialog({
          title: '移入分组',
          width: '500px',
          params:{
              fn:this.$refs.layout.getList,
              refeshFn:this.getTaskClassifyList,
              ids:this.selectIds
          },
          component: () => import('./dialogs/moveGroupDialog.vue'),
          okBtnText: '确认',
          cancelBtnText: '取消'
        })
      },
    //获取当前节点的父节点
      getParentIds(node) {
        console.log(node)
        let arrs = []
        if (!node) {
          return []
        } else {
          let current = node
          while (current.parent) {
            arrs.unshift(current.data.classifyId)
            current = current.parent
          }
        }
        return arrs
      },
    //获取更新状态
      getManualUpdate() {
        this.$api['productManualUpdateStatus']({
          //siteId:this.listQuery.siteId,
          //siteId:this.listQuery.siteId,
          siteId: this.siteId,
          sellerId: this.sellerId,
          merchantId: 2
        })
          .then(data => {
            // debugger

            if (data.code === 0) {
              this.loadingBtn1 = false
            }
          })
          .catch(err => {
            // if (err && err.code) {
            //   this.refreshhtml = '正在刷新中'
            //   this.loadingBtn1 = true
            // }
            if (err.code === 500) {
              this.refreshhtml = '正在刷新中'
              this.loadingBtn1 = true
            }
            if (err.code === 400) {
              this.refreshhtml = '今日数据已更新'
              this.loadingBtn1 = false
              this.BTNdisabled = true
            }
          })
      },
    //手动更新
      setManualUpdate() {
        this.$confirm('数据更新可能需要2~3个小时，是否确认更新?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.loadingBtn1 = true
            this.refreshhtml = '正在刷新中'
            this.$api['productManualUpdate']({
              //siteId:this.listQuery.siteId,
              //siteId:this.listQuery.siteId,
              siteId: this.siteId,
              sellerId: this.sellerId,
              merchantId: 2
            })
              .then(res => {
                if (res.code === 0) {
                  // if(this.listQuery.cusCateId!==null){

                  this.handleFilter()
                  this.refreshhtml = '正在刷新中'
                  this.BTNdisabled = true
                  this.loadingBtn1 = false

                  // }
                }
              })
              .catch(err => {
                //console.log(err);
                if (err.code === 400) {
                  this.BTNdisabled = true
                  this.refreshhtml = '今日数据已更新'
                  this.loadingBtn1 = false
                } else if (err.code === 500) {
                  this.BTNdisabled = true
                  this.refreshhtml = '正在刷新中'
                }
              })
        }).catch(() => {

        });
      },


  },
  created() {
      this.outerParams.platformId=this.platformId;
      console.log('object');
      if (this.sellerId && this.siteId) {
          this.outerParams.siteId=this.siteId;
          this.outerParams.sellerId=this.sellerId;
          this.getTaskClassifyList();
          this.getManualUpdate()
      }
  },
  watch:{
      sellerData() {
          if (this.sellerId && this.siteId) {
              this.outerParams.siteId=this.siteId;
              this.outerParams.sellerId=this.sellerId;
              this.getTaskClassifyList();
              this.getManualUpdate()
          }
      },
      filterTaskText(val) {
        this.$refs.treeTaskCustomCategory.filter(val);
      }
  },
}
</script>

<style scoped lang="less">

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
.MainLayout-Manual{
  /deep/.main-layout .custom_simple_form .el-row--flex{
      .el-col:first-child{
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .el-col:nth-of-type(2){
        padding-left: 0 !important;
      }
    }  
}
</style>

<!--  -->
<template>
  <div>
    <!-- <template>
      <div class="title_h1 margin_bottom8">
        <span class="title_icon"></span>
        <span class="color_666">任务名称 :</span>
        <span class="titleBox">{{this.$route.query.problemType | filterProblemName}}</span>
      </div>
    </template> -->
    <!-- <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :backFun="backFun" @changeMethod="changeMethod"></el-search>
    </template>
	<template>
	  <div style="margin:8px 0">
		<el-button size="mini" type="primary" plain @click="exportMethod">导出</el-button>
	  </div>
	</template>
    <template>
      <el-table-pagination  @update:userSelect="selectionChange($event)" :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template> -->
     <MainLayout 
        :outerParams="outerParams" 
        :edits="edits2" 
        :searchFields="searchFields" 
        :editBtns="editBtns" 
        :columns="columns" 
        :backBtn='true'
        :outSearchData='searchData'
        :initialParmas='initialParmas'
        :searchFunc='searchFunc'
        ref="layout" 
        @selectChange='selectChange' 
        :url="URL">
        <!-- <div slot="left">123</div> -->
    </MainLayout>
    <a v-show="false" ref="exportExcel"></a>
     <template>
      <yt-dialog  title="问题类型" :options="dialogOptions" >
        <yt-table v-loading="table2.loading" border :data="table2.rows" :columns='table2Columns' :selection='false'>
            <template slot="right">
            <el-table-column label="操作" :width="editWidth" v-if="edits.length">
              <template slot-scope="scope">
                <template v-for="(item, index) in edits">
                  <template
                    v-if="item.show == null ? true : typeof item.show === 'boolean' ? item.show : item.show(scope)"
                  >
                    <template v-if="!item.childs">
                      <el-button
                        v-if="!item.icon"
                        class="right-btns"
                        type="text"
                        :key="index"
                        @click="item.fn(scope, item)"
                        :icon="item.icon"
                      >item.name</el-button>
                      <el-tooltip v-else :content="item.name" placement="top" effect="light">
                        <el-button
                          class="right-btns"
                          type="text"
                          :key="index"
                          @click="item.fn(scope, item)"
                          :icon="item.icon"
                        ></el-button>
                      </el-tooltip>
                    </template>

                    <el-button
                      type="text"
                      v-else-if="(item.childs(scope)).length === 1"
                      :key="index"
                      @click="item.fn(scope, item, (item.childs(scope))[0].name,(item.childs(scope))[0].value)"
                    >{{(item.childs(scope))[0].name}}</el-button>

                    <el-dropdown
                      v-else-if="(item.childs(scope)).length !== 0"
                      split-button
                      type="text"
                      @click="item.fn(scope, item,item.name)"
                      @command="c => item.fn(scope, item,c)"
                    >
                      {{(item.childs(scope))[0].name}}
                      <el-dropdown-menu slot="dropdown">
                        <template v-for="(i, subIndex) in (item.childs(scope))">
                          <el-dropdown-item v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
        </yt-table>
      </yt-dialog>
     </template>
    
    <!-- <template>
      <el-dialog :close-on-click-modal="false" title="问题类型" :visible.sync="visible" height='505px' width="820px">
        <el-table ref="multipleTable" :data="table2.rows" style="width: 100%;position:relative;top:-20px;" :stripe="true" v-loading="table2.loading">
          <el-table-column prop="problemName" label="问题项">
            <template slot-scope="scope">
              {{scope.row.problemName | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityReceivable" label="应收/应赔">
            <template slot-scope="scope">
              {{scope.row.quantityReceivable | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityActual" label="实收/实赔">
            <template slot-scope="scope">
              {{scope.row.quantityActual | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityDifference" label="差额">
            <template slot-scope="scope">
              {{scope.row.quantityDifference | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="handle" label="操作">
            <template slot-scope="scope">
              <span class="__pointer common_color" @click="toDetails(scope.row)">
                {{scope.row.handle}}
              </span>
            </template>
          </el-table-column>
        </el-table>

      </el-dialog>
    </template> -->
  </div>
</template>

<script>
	import {downloadFile} from 'Utils/tools';
export default {
  // components: {},
  // provide() {
  //   return {
  //     getList: this.getList,
  //     showDialog: this.showDialog
  //   };
  // },
  // filters: {
  //   filterProblemName(val) {
  //     if (val == 1) {
  //       return "FBA配送费不对(库存情况)";
  //     } else if (val == 2) {
  //       return "佣金不对(库存情况)";
  //     } else if (val == 3) {
  //       return "仓储费不对(库存情况)";
  //     } else if (val == 4) {
  //       return "客户退款为退货，亚马逊未赔偿(库存情况)";
  //     } else if (val == 5) {
  //       return "入库丢件亚马逊未赔偿(库存情况)";
  //     } else if (val == 6) {
  //       return "亚马逊损坏未赔偿(库存情况)";
  //     } else if (val == "all") {
  //       return "查看所有库存";
  //     }
  //   }
  // },
  data() {
    return {
      // 搜索
      // search: {
      //   loading: false,
      //   asin2: true,
      //   date: true,
      //   pstatus: true,
      //   plist: true,
      //   default: [this.$route.query.startTime, this.$route.query.endTime]
      // },
      // clearSearch: null,
      // 表格
      // table: {
      //   loading: false,
      //   // rowKey: "taskId",
      //   rows: [],
      //   pageNumber: 1,
      //   pageSize: 10,
      //   total: 0,
      //   show: {
      //     asin3: true,
      //     saleStatus: true,
      //     imageUrl: true,
      //     quantityStock: true,
      //     quantityReceived: true,
      //     quantityRefundActive: true,
      //     quantityRefundInactive: true,
      //     quantityReimbursement: true,
      //     quantityShipped: true,
      //     quantitySales: true,
      //     quantityAmazonLoss: true,
			// 		quantityCustomerDamaged:true,
      //     quantityAmazonDamaged: true,
      //     quantityDisposal: true,
      //     quantityTransfer: true,
      //     pro: true
      //     //   Handle: {
      //     // edit: true,
      //     // refresh: true,
      //     // check: true
      //     //   }
      //   }
      // },
      dialogOptions:{
        visible:false,
        title:"问题类型",
        width:"820px",
        showFooter:false,
      },
      events:{
        handleOkClick:()=>{

        }
      },
      // 表格
      table2: {
        loading: false,
        // rowKey: "taskId",
        rows: []
      },
       editWidth:"",
      table2Columns:[
        {
          label: "问题项",
          value: "problemName",
          width:200
        },
        {
          label: "应收/应赔",
          value: "quantityReceivable"
        },
        {
          label: "实收/实赔",
          value: "quantityActual"
        },
        {
          label: "差额",
          value: "quantityDifference"
        },
      ],
       edits:[
         {
            name: "查看详情",
            icon: "el-icon-search",
            show: scope => {
              //console.log(scope);
              return true//scope.row.status===2;
            },
            fn: scope => {
              return this.toDetails(scope.row)
            }
          },
      ],


      exportType:null,

      multipleSelection:[],
      URL:"",
      searchData:{
        time:[this.$route.query.startTime,this.$route.query.endTime]
      },  
      initialParmas:{
        time:[this.$route.query.startTime,this.$route.query.endTime]
      },
      outerParams:{
        siteId:"",
        sellerId:"",
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        skus: this.$route.query.skus,
      },
      searchFields:[
        {
            label:'ASIN/SKU',
            name:"asin",
            placeholder:"请输入ASIN/SKU"
        },
        {
            label:'创建时间',
            name:"time",
            placeholder:"请选择创建时间",
            type:'dateRange'
        },
        {
            label: "问题类型:",
            name: "problemTypes",
            type: "select",
            multi:true,
            width:"250px",
            options: [
              {
                value: 1,
                label: 'FBA配送费不对'
              },
              {
                value: 2,
                label: '佣金不对'
              },
              {
                value: 3,
                label: '仓储费不对'
              },
              {
                value: 4,
                label: '客户退款未退货，亚马逊未赔偿'
              },
              {
                value: 5,
                label: '入库丢件亚马逊未赔偿'
              },
              {
                value: 6,
                label: '亚马逊损坏未赔偿'
              }
            ],
        }
      ],
      edits2:[
          {
            name: "查看问题类型",
            icon: "el-icon-search",
            show: scope => {
              //console.log(scope);
              return scope.row.problemList && scope.row.problemList.length>0//scope.row.status===2;
            },
            fn: scope => {
              return this.showDialog(scope.row);
            }
          },
      ],
      editBtns:[
         {
            name: "导出",
            showLoading:true,
            fn: () => {
               return this.exportMethod();
            }
          }
      ],
      columns:[
          // {
          //   label: "asin/sku",
          //   value: "asin",
          //   toggle:['asin','sku'],
          //   width:"200px",
          //   align:'left',
          //   // render(h,scope,a,b){
          //   //   return(
          //   //     <span 
          //   //       onClick={  ()=>{ vm.showDetails(scope.row) } }
          //   //       style='color:#108ee9;cursor:pointer;'
          //   //     >{b}</span>
          //   //   )
          //   // }
          // },
           {
                label: "SKU",
                value: "sku",
                width:"200px",
                showTooltip:true,
                align:'left',
          },
           {
              label: "ASIN",
              value: "asin",
              width:"200px",
          },
          {
            label: "状态",
            value: "productStatus",
            align:'left',
            render(h,scope){
              let {productStatus}=scope.row;
              let span;
              if( productStatus==1){
                span=("在售")
              }else if(productStatus==2){
                span=("不可售")
              }else if(productStatus==3){
                span=('信息待改善')
              }else if(productStatus==4){
                span=('禁止显示')
              }else if(productStatus==null){
                  span=('已下架，不可售')
              };
              return(
                span
              )
                
            }
          },
          {
              img: true,
              label: "主图",
              value: "imageUrl"
          },
          {
              label: "剩余库存",
              value: "quantityStock",
              sortable:'custom',
              width:'100px'
          },
          {
              label: "入库库存",
              value: "quantityReceived",
              sortable:'custom',
               width:'100px'
          },
          {
              label: "可售退货库存",
              value: "quantityRefundActive",
              sortable:'custom',
               width:'120px'
          },
          {
              label: "不可售退货库存",
              value: "quantityRefundInactive",
              sortable:'custom',
               width:'130px'
          },
          {
              label: "赔偿库存",
              value: "quantityReimbursement",
              sortable:'custom',
               width:'100px'
          },
          {
              label: "发货库存",
              value: "quantityShipped",
              sortable:'custom',
               width:'100px'
          },
          {
              label: "售出库存",
              value: "quantitySales",
              sortable:'custom',
               width:'100px'
          },
          {
              label: "亚马逊丢件库存",
              value: "quantityAmazonLoss",
              sortable:'custom',
               width:'130px'
          },

          {
              label: "客户损坏库存",
              value: "quantityCustomerDamaged",
              sortable:'custom',
               width:'130px'
          },
          {
              label: "亚马逊损坏库存",
              value: "quantityAmazonDamaged",
              sortable:'custom',
               width:'130px'
          },
          {
              label: "销毁库存",
              value: "quantityDisposal",
              sortable:'custom',
               width:'100px'
          },
          {
              label: "转库中",
              value: "quantityTransfer",
              sortable:'custom',
               width:'100px'
          },
      ]


    };
  },

  created() {
      this.exportType = this.$route.query.problemType
      let problemTypes = this.$route.query.problemType;
      let flag;
      if (problemTypes != "all") {
        problemTypes = [this.$route.query.problemType];
        flag = this.$route.query.problemType;
      } else {
        problemTypes = null;
        flag = 0;
      };
      this.outerParams.problemTypes=problemTypes;
      this.outerParams.flag=flag;

      if (this.$route.query.type) {
        this.URL = "inventoryDetailList";
      } else {
        this.URL = "chargeDetailList";
      }
      if(this.siteId && this.sellerId){
        this.outerParams.siteId=this.siteId;
        this.outerParams.sellerId=this.sellerId;
     };
  },
  watch: {
    sellerData() {
        this.outerParams.siteId=this.siteId;
        this.outerParams.sellerId=this.sellerId;
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     if (this.sellerId && this.siteId) {
	// 	  this.exportType = this.$route.query.problemType
  //       let problemTypes = this.$route.query.problemType;
  //       let flag;
  //       if (problemTypes != "all") {
  //         problemTypes = [this.$route.query.problemType];
  //         flag = this.$route.query.problemType;
  //       } else {
  //         problemTypes = null;
  //         flag = 0;
  //       }
  //       this.date = [this.$route.query.startTime, this.$route.query.endTime];
  //       this.getList({
  //         problemTypes: problemTypes,
  //         flag: flag,
  //         startTime: this.$route.query.startTime,
  //         endTime: this.$route.query.endTime
  //       });
  //     }
  //   });
  // },
  methods: {
    searchFunc(data){
        let {time,...info}=data;
        if(time){
            let [startTime,endTime] = time ;
              return {startTime,endTime,...info}
        }else{
              return {...info}
        };
    },
	  // changeMethod(e){
	  // 	this.typeList = e;
	  // },
	  selectChange(e){
	  	this.multipleSelection = e
	  },
	  exportMethod(){
		  let type = this.exportType
		  let flag = null
		  if (type != "all") {
		    flag = type
		  } else {
		    flag = 0;
		  }
		  
		  let ids = []
		  this.multipleSelection.forEach(element => {
		    ids.push(element.sku);
		  });
		  let params = {
		  	siteId: this.siteId,
		  	sellerId: this.sellerId,
		  	startTime: this.$route.query.startTime,
		  	endTime: this.$route.query.endTime,
		  	parentSkus: ids.length?[]:this.$store.state.common.selectParentSkus,
		  	skus: ids.length?ids:this.$store.state.common.selectChildSkus,
		  	// skuList:ids,
		  	flag:flag,
		  	problemTypes:this.typeList,
		  	pageNumber:1,
		  	pageSize:10
		  }
		  return this.$api['financeInventoryDetailExport'](params).then(data => {
		  	downloadFile(data, '店铺财务统计-产品库存明细' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
		  })
	  },
    // 列表
    // getList(arg) {
    //   let problemTypes = this.$route.query.problemType;
    //   let flag;
    //   if (problemTypes != "all") {
    //     problemTypes = [this.$route.query.problemType];
    //     flag = this.$route.query.problemType;
    //   } else {
    //     problemTypes = null;
    //     flag = 0;
    //   }
    //   let params = {
    //     pageSize: this.table.pageSize,
    //     pageNumber: this.table.pageNumber,
    //     siteId: this.siteId, //上线要改
    //     sellerId: this.sellerId, //上线要改
    //     startTime: this.$route.query.startTime,
    //     endTime: this.$route.query.endTime,
    //     skus: this.$store.state.common.selectChildSkus,
    //     flag: flag,
    //     // problemTypes: problemTypes,
    //     ...arg
    //   };
    //   // 如果与日期，要分开赋值
    //   if (params.date) {
    //     params.startTime = params.date[0];
    //     params.endTime = params.date[1];
    //     this.date = [params.date[0], params.date[1]];
    //   }
    //   params = this.$.dealObjectValue(params);
    //   this.table.loading = true;
    //   let URL;
    //   if (this.$route.query.type) {
    //     URL = "inventoryDetailList";
    //   } else {
    //     URL = "chargeDetailList";
    //   }
    //   if (!params.siteId) {
    //     return;
    //   }
    //   return this.$api[URL](params)
    //     .then(data => {
    //       this.table.loading = false;
    //       this.table.rows = data.rows;
    //       // console.log(data.rows == "");
    //       this.table.pageNumber = data.pageNo;
    //       this.table.pageSize = data.pageSize;
    //       this.table.total = data.total;
    //       return true;
    //     })
    //     .catch(err => {
    //       console.log(err);
    //       this.table.loading = false;
    //       return true;
    //     });
    // },
    // backFun() {
    //   this.$router.push("/SFM");
    // },
    showDialog(row) {
      this.dialogOptions.visible = true;
      this.table2.rows = row.problemList;
      this.table2.rows.forEach(el => {
        el.handle = "查看详情";
      });
      console.log(row, "row");
    },
    toDetails(row) {
      let type = row.problemType;
      let URL;
      let pt = row.problemType;
      if (type == 1) {
        URL = "fulfillmentErrorList";
      } else if (type == 2) {
        URL = "commissionErrorList";
      } else if (type == 3) {
        URL = "storageErrorList";
      } else if (type == 4) {
        URL = "refundErrorList";
      } else if (type == 5) {
        URL = "amazonLossErrorList";
      } else if (type == 6) {
        URL = "amazonErrorList";
      }
       this.$refs.layout.$dialog({
        title: "问题类型详情",
        width:'1200px',
        //size:'small',
        params: {
          fullPath: this.$route.fullPath,
          URL: URL,
          pt: pt,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          sku: row.sku
        },
        component: () => import("./problemDatails2.vue"),
        // okBtnText: "确认",
        // cancelBtnText: "取消"
      });
      // this.$router.push({
      //   path: "/SFM/pdetails3",
      //   query: {
      //     fullPath: this.$route.fullPath,
      //     URL: URL,
      //     pt: pt,
      //     startTime: this.date[0],
      //     endTime: this.date[1],
      //     sku: row.sku
      //   }
      // });
      console.log(row, "row");
    }
  },
};
</script>

<style lang='scss' scoped>
</style>

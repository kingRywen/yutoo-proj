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
      <el-search :search="search" :clearSearch.sync="clearSearch" :clearfield='clearfield' :backFun="backFun" @changeMethod="changeMethod"></el-search>
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
        :initialParmas='initialParmas'
        :outSearchData='searchData'
        ref="layout" 
        :searchFunc='searchFunc'
        @selectChange='selectChange' 
        :url="URL">
        <!-- <div slot="left">123</div> -->
    </MainLayout>
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
        <!-- <el-table ref="multipleTable" :data="table2.rows" style="width: 100%;position:relative;top:-20px;" :stripe="true" >
          <el-table-column prop="problemName" label="问题项">
            <template slot-scope="scope">
              {{scope.row.problemName | _formatData}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityReceivable" label="应收/应赔">
            <template slot-scope="scope">
              {{scope.row.quantityReceivable | _formatData111(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityActual" label="实收/实赔">
            <template slot-scope="scope">
              {{scope.row.quantityActual | _formatData111(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="quantityDifference" label="差额">
            <template slot-scope="scope">
              {{scope.row.quantityDifference | _formatData111(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="handle" label="操作">
            <template slot-scope="scope">
              <span class="__pointer common_color" @click="toDetails(scope.row)">
                {{scope.row.handle}}
              </span>
            </template>
          </el-table-column>
        </el-table> -->

      </yt-dialog>
    </template>
  </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
  data() {
		let vm = this
    return {
      dialogOptions:{
        visible:false,
        title:"问题类型",
        width:"820px",
        showFooter:false,
        showMaxBtn:false
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
      //userSelect: [],
      // visible: false,
      exportType:null,
      multipleSelection:[],
      //typeList:[],

      URL:'',
      searchData:{
        time:[this.$route.query.startTime,this.$route.query.endTime]
      },
      initialParmas:{
         time:[this.$route.query.startTime,this.$route.query.endTime]
      },
      outerParams:{
        siteId: '', //上线要改
        sellerId: '', //上线要改
        // startTime: this.$route.query.startTime,
        // endTime: this.$route.query.endTime,
        skus: this.$route.query.skus,
      },
      searchFields:[
        {
            label: "ASIN/SKU",
            name: "asin",
            type: "input",
            placeholder: "请输入ASIN/SKU"
        },
        {
            label: "创建时间",
            name: "time",
            type: "dateRange",
            placeholder: "请选择创建时间",
            isShowUnlink:true,
        },
        {
            label: "问题类型",
            name: "problemTypes",
            type: "select",
            width:"250px",
            multi:true,
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
         // {
         //    name: "查看问题类型",
         //    icon: "el-icon-search",
         //    show: scope => {
         //      console.log(scope);
         //      return scope.row.problemList && scope.row.problemList.length>0//scope.row.status===2;
         //    },
         //    fn: scope => {
         //      return this.showDialog(scope.row);
         //    }
         //  },
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
              label: "店铺收款",
              value: "amountReceived",
              width:"110px",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountReceived || scope.row.amountReceived==0 ) ? "$"+scope.row.amountReceived:"-"}</span>
                )
              }
            } ,
            {
              label: "销售总额",
              value: "amountSales",
              width:"110px",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountSales || scope.row.amountSales==0) ? "$"+scope.row.amountSales:"-"}</span>
                )
              }
            },
            {
              label: "赔额",
              value: "amountReimbursement",
              sortable:"custom",
              width:"110px",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountReimbursement || scope.row.amountReimbursement ==0 )?"$"+scope.row.amountReimbursement:"-"}</span>
                )
              }
            },
            {
              label: "正常FBA配送费",
              value: "amountFulfillment",
              width:"130px",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountFulfillment || scope.row.amountFulfillment ==0 )?"$"+scope.row.amountFulfillment:"-"}</span>
                )
              }
            },
            {
              label: "正常订单佣金",
              value: "amountCommission",
              width:"130px",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountCommission || scope.row.amountCommission ==0 )?"$"+scope.row.amountCommission:"-"}</span>
                )
              }
            },
            {
              label: "退款金额",
              value: "amountRefund",
              sortable:"custom",
              width:"110px",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountRefund || scope.row.amountRefund ==0 )?"$"+scope.row.amountRefund:"-"}</span>
                )
              }
            },
            {
              label: "退款损失",
              value: "amountReimbursement",
              sortable:"custom",
              width:"110px",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountRefundLoss || scope.row.amountRefundLoss ==0 )?"$"+scope.row.amountRefundLoss:"-"}</span>
                )
              }
            },
            {
              label: "仓储费",
              value: "amountStorage",
              sortable:"custom",
              width:"110px",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountStorage || scope.row.amountStorage ==0 )?"$"+scope.row.amountStorage:"-"}</span>
                )
              }
            },
            {
              label: "销毁费用",
              width:"110px",
              value: "amountReimbursement",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountReimbursement || scope.row.amountReimbursement ==0 )?"$"+scope.row.amountReimbursement:"-"}</span>
                )
              }
            },
            {
              label: "广告费用",
              width:"110px",
              value: "amountReimbursement",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountAdvert || scope.row.amountAdvert ==0 )?"$"+scope.row.amountAdvert:"-"}</span>
                )
              }
            },
            {
              label: "移除费用",
              width:"110px",
              value: "amountDisposal",
              sortable:"custom",
              render(h,scope){
                return(
                  <span>{ (scope.row.amountDisposal || scope.row.amountDisposal ==0 )?"$"+scope.row.amountDisposal:"-"}</span>
                )
              }
            },
						{
						  label: "问题类型",
						  width:"210px",
							align:'left',
						  render(h,scope){
								let problemList = scope.row.problemList
								return problemList && problemList.length>0 ? problemList && problemList.length>1 ? (
									<div>
										<div onClick={() => {vm.showDialog(scope.row);}} style="color:red;cursor:pointer;float: left;">{problemList[0].problemName}</div><div style="width: 20px;font-size:16px;float: left;height:20px;border-radius: 50%;background: red;color: white;">+{problemList.length-1}</div>
									</div>
								) : (
									<div>
										<div onClick={() => {vm.showDialog(scope.row);}} style="color:red;cursor:pointer;float: left;">{problemList[0].problemName}</div>
									</div>
								) : (
									<span>-</span>
								)
						  }
						},
      ]

    };
  },

  created() {
    this.exportType = this.$route.query.problemType
    let problemTypes = this.$route.query.problemType;
    let flag;
    if (problemTypes != "all") {
      // problemTypes = [this.$route.query.problemType];
      flag = this.$route.query.problemType;
    } else {
      // problemTypes = null;
      flag = 0;
    };
    this.outerParams.flag=flag;
    if (this.$route.query.type) {
        this.URL = "inventoryDetailList";
    } else {
      this.URL= "chargeDetailList";
    };
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
  mounted() {
    // this.$nextTick(() => {
    //   if (this.sellerId && this.siteId) {
		// this.exportType = this.$route.query.problemType
    //     let problemTypes = this.$route.query.problemType;
    //     let flag;
    //     if (problemTypes != "all") {
    //       // problemTypes = [this.$route.query.problemType];
    //       flag = this.$route.query.problemType;
    //     } else {
    //       // problemTypes = null;
    //       flag = 0;
    //     }
    //     this.date = [this.$route.query.startTime, this.$route.query.endTime];
    //     this.getList({
    //       // problemTypes: problemTypes,
    //       flag: flag,
    //       startTime: this.$route.query.startTime,
    //       endTime: this.$route.query.endTime
    //     });
    //   }
    // });
  },
  methods: {
    lookProlemDatails(){

    },
    searchFunc(data){
      let {time,...info}=data;
      let [startTime, endTime] = time || [];
      return {startTime,endTime,...info}
    },
		changeMethod(e){
      this.typeList = e;
      console.log(e);
		},
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
			return this.$api['financeChargeDetailExport'](params).then(data => {
				downloadFile(data, '店铺财务统计-产品费用明细' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
			})
		},
    // 列表
    // getList(arg) {
    //   let problemTypes = this.$route.query.problemType;
    //   let flag;
    //   if (problemTypes != "all") {
    //     // problemTypes = [this.$route.query.problemType];
    //     flag = this.$route.query.problemType;
    //   } else {
    //     // problemTypes = null;
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
    //   if (!params.siteId) {
    //     return;
    //   }
    //   this.table.loading = true;
    //   let URL;
    //   if (this.$route.query.type) {
    //     URL = "inventoryDetailList";
    //   } else {
    //     URL = "chargeDetailList";
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
    backFun() {
      this.$router.push("/SFM");
    },
    showDialog(row) {
      this.dialogOptions.visible = true;
      this.table2.rows = row.problemList;
      this.table2.rows.forEach(el => {
        el.handle = "查看详情";
      });
      // console.log(row, "row");
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
      console.log('--------------');
      console.log(pt);
      this.$refs.layout.$dialog({
        title: "问题类型详情",
        width:'1200px',
        //size:'small',
        showMaxBtn:false,
        params: {
          fullPath: this.$route.fullPath,
          URL: URL,
          pt: pt,
          startTime: this.$route.query.startTime,
          endTime: this.$route.query.endTime,
          sku: row.sku
        },
        component: () => import("./problemDatails1.vue"),
        // okBtnText: "确认",
        // cancelBtnText: "取消"
      });
      // this.$router.push({
      //   path: "/SFM/pdetails2",
      //   query: {
      //     fullPath: this.$route.fullPath,
      //     URL: URL,
      //     pt: pt,
      //     startTime: this.$route.query.startTime,
      //     endTime: this.$route.query.endTime,
      //     sku: row.sku
      //   }
      // });
      // console.log(row, "row");
    }
  },
  computed: {},
  watch: {
    sellerData() {
      // this.$router.replace("/dash");
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

<!--  -->
<template>
  <div>
    <!-- <template>
      <el-search :search="search" :clearSearch.sync="clearSearch" :backFun="backFun" v-if="table.show.asin2" :__picker="cfuns._pickerBefore"></el-search>
    </template>
		<template>
		  <div style="margin:8px 0">
		  	<el-button size="mini" type="primary" plain @click="exportMethod">导出</el-button>
		  </div>
		</template>
    <template>
      <el-table-pagination @update:userSelect="selectionChange($event)"  :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="table.userSelect"></el-table-pagination>
      
    </template> -->
      <MainLayout 
        :outerParams="outerParams" 
        :edits="edits" 
        :showSearch='showSearch'
        :searchFields="searchFields" 
        :editBtns="editBtns" 
        :columns="columns" 
        :backBtn='true'
        ref="layout" 
        @selectChange='selectChange' 
        :url="$route.query.URL">
        <!-- <div slot="left">123</div> -->
      </MainLayout>
  </div>
</template>

<script>
import {downloadFile} from 'Utils/tools';
export default {
  // components: {},
  // provide() {
  //   return {
  //     getList: this.getList,
  //     showDetails: this.showDetails
  //   };
  // },
  data() {
    return {
      // // 搜索
      // search: {
      //   loading: false,
      //   asin2: true
      // },
      // clearSearch: null,
      // // 表格
      // table: {
      //   loading: false,
      //   // rowKey: "taskId",
      //   rows: [],
      //   pageNumber: 1,
      //   pageSize: 10,
      //   total: 0,
      //   show: {}
      // },
      // userSelect: [],
			exportUrl:null,
      multipleSelection:[],
      showSearch:true,
      outerParams:{
        siteId:"",
        sellerId:"",
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime,
        skus: this.$route.query.skus,
      },
      searchFields:[
        {
            label: "ASIN/SKU",
            name: "asin",
            type: "input",
            placeholder: "请输入ASIN/SKU"
        },
      ],
      edits:[

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
      ]

    };
  },

  created() {
    let vm=this;
    this.exportUrl=this.$route.query.URL;
    if (this.$route.query.URL == "subscriptionList") {
        this.showSearch=false;
        this.columns=[
            {
              label: "统计时间",
              value: "chargeMonth",
            },
            {
              label: "店铺费用",
              value: "subscriptionFee",
              render(h,scope){
                return (
                  <span>{ (scope.row.subscriptionFee ||scope.row.subscriptionFee==0) ? "$"+scope.row.subscriptionFee:"-"}</span>
                )
              }
            },
          ]
      } else {
        this.columns=[
            // {
            //     label: "asin/sku",
            //     value: "asin",
            //     toggle:['asin','sku'],
            //     width:"200px",
            //     align:'left',
            //     render(h,scope,a,b){
            //       return(
            //         <span 
            //           onClick={  ()=>{ vm.showDetails(scope.row) } }
            //           style='color:#108ee9;cursor:pointer;'
            //         >{b}</span>
            //       )
            //     }
            // },
             {
                label: "SKU",
                value: "sku",
                width:"200px",
                align:'left',
                showTooltip:true
              },
             {
                label: "ASIN",
                value: "asin",
                width:"200px",
                render(h,scope){
                  return(
                    <span 
                      onClick={  ()=>{ vm.showDetails(scope.row) } }
                      style='color:#108ee9;cursor:pointer;'
                    >{scope.row.asin}</span>
                  )
                }
            },
            {
                label: "状态",
                value: "productStatus",
                width:"200px",
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
              label: "标题",
              value: "productName",
              render(h,scope){
                let { productName } = scope.row
                return productName ? (
                  <el-tooltip open-delay={300} content={productName}  placement="top" effect="light">
                    <span class="fix__row_1">{productName}</span>
                  </el-tooltip>
                ) : (
                  <span>-</span>
                )
              }
            },
            {
              label: "费用",
              value: "amount",
              sortable:'custom',
              render(h,scope){
                return (
                  <span>{ (scope.row.amount || scope.row.amount ==0)?'$'+scope.row.amount:"-"}</span>
                )

              }
            },
            {
              label: "占比",
              value: "proportion",
              sortable:'custom',
              render(h,scope){
                return(
                  <span>{ (scope.row.proportion || scope.row.proportion ==0) ? Math.ceil(scope.row.proportion*10000)/100+"%":"-"}</span>
                )
              }
            },
            
          ]
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
	// 			this.exportUrl = this.$route.query.URL
  //       if (this.$route.query.URL == "subscriptionList") {
  //         this.$set(this.table, "show", {
  //           chargeMonth: true,
  //           subscriptionFee: true
  //         });
  //       } else {
  //         this.$set(this.table, "show", {
  //           asin2: true,
  //           saleStatus: true,
  //           imageUrl: true,
  //           productName2: true,
  //           proportion2: true,
  //           cost: true
  //         });
  //       }
  //       this.getList();
  //     }
  //   });
  // },
  methods: {
		selectChange(e){
			this.multipleSelection = e
    },
		//导出
		exportMethod(){
      
			let url = this.exportUrl
			let ids = []
			this.multipleSelection.forEach(element => {
			  ids.push(element.sku);
			});
			let params = {
				siteId: this.siteId,
				sellerId: this.sellerId,
				startTime: this.$route.query.startTime,
				endTime: this.$route.query.endTime,
				parentSkus: this.$store.state.common.selectParentSkus,
				skus: this.$store.state.common.selectChildSkus,
				skuList:ids,
				pageNumber:1,
				pageSize:10
      }
      //console.log(url);
			switch(url){
				case 'totalSalesList':
					return this.$api['financeTotalSalesExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-销售总额列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'reimbursementList':
					return this.$api['financeReimbursementExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-赔偿列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'fulfillmentFeeList':
					return this.$api['financeFulfillmentFeeExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-正常FBA配送费列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'commissionList':
					return this.$api['financeCommissionExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-佣金列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'storageFeeList':
					return this.$api['financeStorageFeeExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-仓储费列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'refundAmountList':
					return this.$api['financeRefundExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-退款列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'refundLossList':
					return this.$api['financeRefundLossExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-退款损失列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'removeFeeList':
					return this.$api['financeDisposalFeeExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-销毁费用列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'disposalFeeList':
					return this.$api['financeRemoveFeeExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-移除费用列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'adChargeList':
					return this.$api['financeAdChargeExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-广告费用列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
				case 'subscriptionList':
					return this.$api['financeSubscriptionExport'](params).then(data => {
						downloadFile(data, '店铺财务统计-店铺费用列表' + this.$.formatDate(new Date(),'{y}{m}{d}{h}{i}{s}'))
					})
				break;
			}
		},
    // 列表
    // getList(arg) {
    //   let params = {
    //     pageSize: this.table.pageSize,
    //     pageNumber: this.table.pageNumber,
    //     siteId: this.siteId, //上线要改
    //     sellerId: this.sellerId, //上线要改
    //     startTime: this.$route.query.startTime,
    //     endTime: this.$route.query.endTime,
    //     skus: this.$store.state.common.selectChildSkus,
    //     ...arg
    //   };
    //   // 如果与日期，要分开赋值
    //   if (params.date) {
    //     params.startTime = params.date[0];
    //     params.endTime = params.date[1];
    //   }
    //   params = this.$.dealObjectValue(params);
    //   this.table.loading = true;
    //   return this.$api[this.$route.query.URL](params)
    //     .then(data => {
    //       this.table.loading = false;
    //       this.table.rows = data.rows;
    //       let data_ = [];
    //       this.table.rows.forEach(el => {
    //         if (this.$route.query.URL == "subscriptionList") {
    //           data_.push(el);
    //         } else {
    //           data_.push(el);
    //         }
    //       });
    //       this.table.rows = data_;
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
    showDetails(row) {
      console.log(row);
      this.$store.commit("common/isChildSku", true);
      this.$store.commit("common/childSkus_1", [row.sku]);
      let query = {
        sku: row.sku,
        startTime: this.$route.query.startTime,
        endTime: this.$route.query.endTime
      };

      this.$router.push({
        path: "/SFM",
        query
      });
    }
  },
  computed: {},

};
</script>

<style lang='scss' scoped>
</style>

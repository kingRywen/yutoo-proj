<!--  -->
<template>
  <div>
    <div>
      <a v-show="false" ref="exportExcel"></a>
    </div>
	<el-button v-if="$route.name==='productIntegration'" type="primary" plain style="position: absolute;right:365px;z-index: 999;" @click="allSetMethod">全局配置广告利润监控占比</el-button>
	<el-button v-if="$route.name==='productIntegration'" type="primary" plain style="position: absolute;right:245px;z-index: 999;" @click="headReset">手动更新<i class="el-icon-refresh el-icon--right"></i></el-button>
	<el-tooltip v-if="$route.name==='productIntegration'" content='文件名需以日期命名。文件名日期是哪一天，导入的就是该天的数据。如 "2019-01-01" 。' placement="top" effect="light">
		<el-button v-if="$route.name==='productIntegration'" type="primary" plain style="position: absolute;right:120px;z-index: 999;" @click="importMethod">导入流量报告</el-button>
	</el-tooltip>
	<el-button v-if="$route.name==='productIntegration'" type="primary" plain style="position: absolute;right:20px;z-index: 999;" @click="linkMethod">导入日志</el-button>
    <div v-if='$route.name==="productIntegration"'>	  
      <el-tabs v-model="activeName" @tab-click="change" type="card" lazy>
        <el-tab-pane label="列表展示" name="0">
          <MainLayout :edits="edits" :editBtns="editBtns" :outerParams="outerParams" :searchFields="searchFields" :outSearchData="searchData" :columns="columns" 
          :treeTable="treeTable" :expand="true" :treeTableOtions="treeTableOtions" :searchFunc="searchFunc" :initialParmas='initialParmas' @selectChange='selectChange' ref="layout" url="productInfoList" :customDisplay="true">	
          </MainLayout>
        </el-tab-pane>
        <el-tab-pane label="图表分析" name="1" :lazy='true'>
          <tab2  :editBtns="editBtns2" ref="tab2" :type='searchData.statType' v-if='isShow'></tab2>
        </el-tab-pane>
      </el-tabs>
    </div>

    <router-view v-else></router-view>
  </div>
</template>

<script>
import tab2 from "./tab2/tab2";
import { downloadFile } from 'Utils/tools'
import dayjs from 'dayjs';
export default {
  components: { tab2 },
  data() {
    return {
	  treeTable:true,
	  treeTableOtions:{
	  	childs:'sameList',
	  	expandFunc:row =>{
	  		return row.sameList && row.sameList.length>0
	  	}
	  },
      searchData: {
        time: [this.cfuns.getDay(365).computedDay,dayjs().subtract(15,'hour').format('YYYY-MM-DD')],
        statType: 0
      },
      initialParmas:{
        time:[this.cfuns.getDay(365).computedDay,dayjs().subtract(15,'hour').format('YYYY-MM-DD')],
        statType: 0
      },
      activeName: "0",
      parentSkus: null,
      //columns表格
      columns: [
        
		{			
		  label: "SKU",
		  value: "sku",
		  expand:true,
		  width:"250px",
		  align:'left',
		  render(h, scope) {
		  	let sku = scope.row.sku
		  	return sku ? scope.row._level == 1 ? (
		  	  <el-tooltip open-delay={300} content={sku} placement="top"  effect="light">
		  		<span>{sku.length>24?sku.substring(0,27)+"...":sku}</span>
		  	  </el-tooltip>
		  	) : (
		  	  <el-tooltip open-delay={300} content={sku} placement="top"  effect="light">
		  	  	<span>{sku.length>24?sku.substring(0,24)+"...":sku}</span>
		  	  </el-tooltip>
		  	) : (
		  	  <span>-</span>
		  	)
			// return sku ? (
			// 	<span>{sku}</span>
			// ) : (
			// 	<span>-</span>
			// )
		  }
		},
		{			
		  label: "ASIN",		  
		  value: "asin",
		  width:"150px",
		  align:'left',
		  url:"productUrl",
		},
        {
          img: true,
          label: "主图",
          value: "imageUrl"
        },
        {
          label: "访客数",
          merge: [
            {
              label: "总数",
              value: "sessions",
              sortable: 'custom',
              width: 100
            },
            {
              label: "广告",
              value: "advertSessions",
              sortable: 'custom',
              width: 100
            },
            {
              label: "自然",
              value: "normalSessions",
              sortable: 'custom',
              width: 100
            }
          ]
        },
        {
          label: "订单量",
          merge: [
            {
              label: "总数",
              value: "orderCnt",
              sortable: 'custom',
              width: 100
            },
            {
              label: "广告",
              value: "advertOrderCnt",
              sortable: 'custom',
              width: 100
            },
            {
              label: "自然",
              value: "normalOrderCnt",
              sortable: 'custom',
              width: 100
            }
          ]
        },
        {
          label: "转化率",
          merge: [
            {
              label: "总数",
              value: "conversionRate",
              sortable: 'custom',
              width: 100,
              render(h,scope){
                let conversionRate=scope.row.conversionRate;
                return  (conversionRate || conversionRate===0 )? Math.ceil(conversionRate*10000)/100+'%' :"-"
              }
            },
            {
              label: "广告",
              value: "advertConversionRate",
              sortable: 'custom',
              width: 100,
              render(h,scope){
                let advertConversionRate=scope.row.advertConversionRate;
                return  (advertConversionRate || advertConversionRate===0) ? Math.ceil(advertConversionRate*10000)/100+'%' :"-"
              }
            },
            {
              label: "自然",
              value: "normalConversionRate",
              sortable: 'custom',
              width: 100,
              render(h,scope){
                let normalConversionRate=scope.row.normalConversionRate;
                return  (normalConversionRate || normalConversionRate===0) ? Math.ceil(normalConversionRate*10000)/100+'%' :"-"
              }
            }
          ]
        },
        {
          label: "成交额",
          merge: [
            {
              label: "总数",
              value: "sales",
              sortable: 'custom',
              width: 100,
			  render(h,scope){
				  let sales = scope.row.sales
				  return sales || sales===0 ? (
					<span>{sales?'$'+sales:sales}</span>
				  ) : (
					<span>-</span>
				  )
			  }
            },
            {
              label: "广告",
              value: "advertSales",
              sortable: 'custom',
              width: 100,
			  render(h,scope){
				  let advertSales = scope.row.advertSales
				  return advertSales || advertSales===0 ? (
				  	  <span>{advertSales?'$'+advertSales:advertSales}</span>
				  ) : (
				  	  <span>-</span>
				  )
			  }
            },
            {
              label: "自然",
              value: "normalSales",
              sortable: 'custom',
              width: 100,
			  render(h,scope){
				  let normalSales = scope.row.normalSales
				  return normalSales || normalSales===0 ? (
				  	  <span>{normalSales?'$'+normalSales:normalSales}</span>
				  ) : (
				  	  <span>-</span>
				  )
			  }
            }
          ]
        },
        {
          label: "客单价",
          merge: [
            {
              label: "总数",
              value: "pricePerOrder",
              sortable: 'custom',
              width: 100,
			  render(h,scope){
				  let pricePerOrder = scope.row.pricePerOrder
				  return pricePerOrder || pricePerOrder===0 ? (
					<span>{pricePerOrder?'$'+pricePerOrder:pricePerOrder}</span>
				  ) : (
					<span>-</span>
				  )
			  }
            },
            {
              label: "广告",
              value: "advertPricePerOrder",
              sortable: 'custom',
              width: 100,
			  render(h,scope){
				  let advertPricePerOrder = scope.row.advertPricePerOrder
				  return advertPricePerOrder || advertPricePerOrder===0 ? (
					<span>{advertPricePerOrder?'$'+advertPricePerOrder:advertPricePerOrder}</span>
				  ) : (
					<span>-</span>
				  )
			  }
            },
            {
              label: "自然",
              value: "normalPricePerOrder",
              sortable: 'custom',
              width: 100,
			  render(h,scope){
				  let normalPricePerOrder = scope.row.normalPricePerOrder
				  return normalPricePerOrder || normalPricePerOrder===0 ? (
					<span>{normalPricePerOrder?'$'+normalPricePerOrder:normalPricePerOrder}</span>
				  ) : (
					<span>-</span>
				  )
			  }
            }
          ]
        },
        {
          label: "广告曝光量",
          value: "advertExposure",
          sortable: 'custom',
          width: 140
        },
        {
          label: "广告点击率",
          value: "advertClickRates",
          sortable: 'custom',
          width: 140,
          render(h,scope){
              let advertClickRates=scope.row.advertClickRates;
              return  (advertClickRates || advertClickRates===0) ? Math.ceil(advertClickRates*10000)/100+'%' :"-"
            }
        },
        {
          label: "广告花费占比",
          value: "advertAcos",
          sortable: 'custom',
          width: 140
        },
        {
          label: "广告平均CPC",
          value: "advertCpc",
          sortable: 'custom',
          width: 140,
		  render(h,scope){
			  let advertCpc = scope.row.advertCpc
			  return advertCpc || advertCpc===0 ? (
				<span>{advertCpc?'$'+advertCpc:advertCpc}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        },
        {
          label: "广告费",
          value: "advertCost",
          sortable: 'custom',
          width: 140,
		  render(h,scope){
			  let advertCost = scope.row.advertCost
			  return advertCost || advertCost===0 ? (
				<span>{advertCost?'$'+advertCost:advertCost}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        },
        {
          label: "FBA配送总配送费",
          value: "fulfillmentFee",
          sortable: 'custom',
          width: 150,
		  render(h,scope){
			  let fulfillmentFee = scope.row.fulfillmentFee
			  return fulfillmentFee || fulfillmentFee===0 ? (
				<span>{fulfillmentFee?'$'+fulfillmentFee:fulfillmentFee}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        },
        {
          label: "FBA配送平均配送费",
          value: "avgFulfillmentFee",
          sortable: 'custom',
          width: 160,
		  render(h,scope){
			  let avgFulfillmentFee = scope.row.avgFulfillmentFee
			  return avgFulfillmentFee || avgFulfillmentFee===0 ? (
				<span>{avgFulfillmentFee?'$'+avgFulfillmentFee:avgFulfillmentFee}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        },
        {
          label: "总金额",
          value: "sales",
          sortable: 'custom',
          width: 100,
		  render(h,scope){
			  let sales = scope.row.sales
			  return sales || sales===0 ? (
				<span>{sales?'$'+sales:sales}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        },
        {
          label: "佣金总金额",
          value: "commission",
          sortable: 'custom',
          width: 120,
		  render(h,scope){
			  let commission = scope.row.commission
			  return commission || commission===0 ? (
				<span>{commission?'$'+commission:commission}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        },
        {
          label: "平均佣金费率",
          value: "avgCommissionRate",
          sortable: 'custom',
          width: 140,
          render(h,scope){
            let avgCommissionRate=scope.row.avgCommissionRate;
            return  (avgCommissionRate || avgCommissionRate===0) ? Math.ceil(avgCommissionRate*10000)/100+'%' :"-"
          }
        },
        {
          label: "退款件数",
          value: "refundCnt",
          sortable: 'custom',
          width: 140
        },
        {
          label: "退货率",
          value: "refundRate",
          sortable: 'custom',
          width: 100,
          render(h,scope){
            let refundRate=scope.row.refundRate;
            return  (refundRate || refundRate===0) ? Math.ceil(refundRate*10000)/100+'%' :"-"
          }
        },
        {
          label: "退款销售额",
          value: "refundSales",
          sortable: 'custom',
          width: 130
        },
        {
          label: "退款损失占销售额比率",
          value: "refundLossProportion",
          sortable: 'custom',
          width: 170,
          render(h,scope){
            let refundLossProportion=scope.row.refundLossProportion;
            return  (refundLossProportion || refundLossProportion===0) ? Math.ceil(refundLossProportion*10000)/100+'%' :"-"
          }
        },
        {
          label: "库存量",
          merge: [
            {
              label: "合计",
              value: "quantityStock",
              sortable: 'custom',
              width: 100
            },
            {
              label: "FBA可售",
              value: "quantityActiveFba",
              sortable: 'custom',
              width: 100
            },
            {
              label: "FBM可售",
              value: "quantityActiveFbm",
              sortable: 'custom',
              width: 100
            },
			{
			  label: "FBA不可售",
			  value: "quantityInactiveFba",
			  sortable: 'custom',
			  width: 120
			},
          ]
        },
        {
          label: "库龄分布",
          merge: [
            {
              label: "0~90天",
              value: "invAge0To90Days",
              sortable: 'custom',
              width:150,
            },
            {
              label: "91-180天",
              value: "invAge91To180Days",
              sortable: 'custom',
              width:150,
            },
            {
              label: "181-270天",
              value: "invAge181To270Days",
              sortable: 'custom',
              width:150,
            },
            {
              label: "271-365天",
              value: "invAge271To365Days",
              sortable: 'custom',
              width:150,
            },
            {
              label: "365~",
              value: "invAge365PlusDays",
              sortable: 'custom',
              width:150,
            }
          ]
        },
        {
          label: "仓储体积",
          value: "cubage",
          sortable: 'custom',
		  minWidth:'100px',
		  render(h,scope){
			  let cubage = scope.row.cubage
			  return cubage && cubage.toString().split('.')[1]>2 ? (
				<span>{cubage.toFixed(2)}</span>
			  ) : (
				<span>{cubage}</span>
			  )
		  }
        },
        {
          label: "理论应收仓储费",
          value: "storageFeeReceivable",
		  minWidth:'150px',
          sortable: 'custom'
        },
        {
          label: "实际收取仓储费",
          value: "storageFeeActual",
		  minWidth:'150px',
          sortable: 'custom'
        },
        {
          label: "已配送订单",
          value: "shipped",
		  minWidth:'120px',
          sortable: 'custom'
        },
        {
          label: "未配送订单",
          value: "unshipped",
		  minWidth:'120px',
          sortable: 'custom'
        },
        {
          label: "Pending订单",
          value: "pending",
		  minWidth:'130px',
          sortable: 'custom'
        },
        {
          label: "差评数",
		  minWidth:'90px',
          value: "badReviewCnt",
          sortable: 'custom'
        },
        {
          label: "好评数",
		  minWidth:'90px',
          value: "goodReviewCnt",
          sortable: 'custom'
        },
        {
          label: "每个订单平均产品数",
          value: "productCntPerOrder",
		  minWidth:'200px',
          sortable: 'custom'
        },
        {
          label: "广告费占未退款销售额比例",
          value: "advertProportion",
		  minWidth:'200px',
          sortable: 'custom',
		  isPercent:true,
		  keepFew:2,
        },
        {
          label: "库存可售时间",
          value: "sellableDays",
		  minWidth:'140px',
          sortable: 'custom'
        }
      ],
      //表格列表操作按钮
      edits: [
        {
          name: "操作",
          icon: "el-icon-search",
          show: scope => {
            return true;
          },
          fn: scope => {
            this.activeName = "1";
            this.isShow=true;
           
            let type = this.searchData.statType;
            let sku = scope.row.sku;
            switch (type) {
              case 0:
                this.$store.commit("common/selectParentSkus", [sku]);
                this.$store.commit("common/selectChildSkus", null);
                break;
              case 1:
                this.$store.commit("common/selectParentSkus", null);
                this.$store.commit("common/selectChildSkus", [sku]);
                break;
            }
          }
        }
      ],
      searchFields: [
        {
          label: "父产品",
          name: "parentSkus",
          type: "select",
		  
          placeholder: "请选择",
          options: [],
          multiple: true
        },
        {
          label: "子产品",
          name: "skus",
          type: "select",
          placeholder: "请选择",
          options: [],
          //multiple: true,
          //width:'300px',
        },
        {
          label: "统计时间",
          name: "time",
          type: "dateRange",
          placeholder: "请选择",
          required:true,
          labelWidth:'90px',
          clearable:false,
          width:250,
		  isShowUnlink:true,
		  pickerOptions:{
			disabledDate(time) {
				return  time.getTime() > Date.now() - 15 * 3600 * 1000
			}
		  },
		  
        },
        {
          label: "统计方式",
          name: "statType",
          type: "select",
          clearable: false,
          placeholder: "请选择",
          options: [
            { label: "按父产品", value: 0 },
            { label: "按子产品", value: 1 }
          ]
        }
      ],
      editBtns: [
        // {
        //   name: "导入商品费用明细",
        //   fn: () => {
        //     let vm = this
        //     this.$refs.layout.$dialog({
        //       title: "导入商品费用明细",
        //       size: "small",
        //       params: {
        //         success() {
        //           vm.$refs.layout.closeDialog()
        //         }
        //       },
        //       component: () => import("./dialogs/Upload.vue"),
        //     });
        //   }
        // },
        // {
        //   name: "导入日志",
        //   fn: () => {
        //     this.$router.push({
        //       name: "Log"
        //     });
        //   }
        // },
        {
          name: "查看商品明细",
          fn: () => {
            this.$router.push({
              name: "ProDetails"
            });
          }
        },
        {
          name: "导出",
          showLoading: true,
          fn: () => {
            let name = "产品完整信息整合";
            let api = "productInfo/productInfoExport";
            // console.log(this.searchData);
            let type = this.searchData.statType;
            let parentSkus = [];
            let skus = [];
            let select = this.getSelection();
            switch (type) {
              case 0:
                // todo
                select.forEach(el => {
                  parentSkus.push(el.sku);
                });
                break;
              case 1:
                select.forEach(el => {
                  skus.push(el.sku);
                });
            };
            // console.log(this.searchData);
            // return;
            let params = {
              sellerId: this.sellerId,
              siteId: this.siteId,
              statType:type,
              startTime: this.searchData.time[0],
              endTime: this.searchData.time[1],
              skus: skus,
              parentSkus: parentSkus
            };
            //params = this.$.dealObjectValue(params);			
			return this.$api['productInfoProductInfoExport'](params).then(data => {
			  downloadFile(
			    data,
			    '产品完整信息整合' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
			  )
			})
			
          }
        },
        // {
        //   name: "全局配置广告利润监控占比",
        //   fn: () => {
        //     this.$refs.layout.$dialog({
        //       title: "全局配置广告利润监控占比",
        //       size: "small",
        //       params: {
        //         sellerId:this.outerParams.sellerId,
        //         siteId:this.outerParams.siteId,
        //       },
        //       component: () => import("./dialogs/setPercent"),
        //       okBtnText: "确认",
        //       cancelBtnText: "取消"
        //     });
        //   }
        // }
      ],
      //外部参数
      outerParams: {
        startTime: null,
        endTime: null,
        platformId: this.platformId,
        siteId: null,
        sellerId: null
      },
      slectIds: [], //选择的ID的数组
      //   tab2
      editBtns2: [
        {
          name: "导入商品费用明细",
          fn: () => {
            this.$refs.layout.$dialog({
              title: "导入商品费用明细",
              width: "500px",
              params: {
                downLoadUrl: "finance/downloadFile",
                uploadUrl: "finance/costImport",
                excellName: "商品费用明细"
                // type: "store",
              },
              component: () => import("@/views/Common/downUpload"),
              okBtnText: "确认",
              cancelBtnText: "取消"
            });
          }
        },
        {
          name: "导入日志",
          fn: () => {}
        },
        {
          name: "查看商品明细",
          fn: () => {}
        }
      ],

      isShow:false,
    };
  },

  created() {
    if (this.sellerId && this.siteId) {
      this.getSkus();
      this.outerParams.siteId = this.siteId;
      this.outerParams.sellerId = this.sellerId;
    }
  },
  mounted() {},
  methods: {
	importMethod(){
		let vm = this
		this.$refs.layout.$dialog({
		  title: "导入流量报告",
		  size: "small",
		  params: {
			success() {
			  vm.$refs.layout.closeDialog()
			}
		  },
		  component: () => import("./dialogs/trafficReports.vue"),
		});
	},
	linkMethod(){
		this.$router.push({
			name: "Log",
			query:{
			    type: 2
			}
		})
	},
	headReset(){
		if(this.activeName === '0'){
			this.getLayoutList()
		}else{
			this.$refs.tab2.getParent()
		}
	},
	allSetMethod(){
		this.$refs.layout.$dialog({
		  title: "全局配置广告利润监控占比",
		  size: "small",
		  params: {
		    sellerId:this.outerParams.sellerId,
		    siteId:this.outerParams.siteId,
		  },
		  component: () => import("./dialogs/setPercent"),
		  okBtnText: "确认",
		  cancelBtnText: "取消"
		});
	},
    change() {
        if(this.activeName==='1'){
            this.isShow=true;
        }else{
          this.isShow=false;
        }
    },
    // 请求父asin列表
    getParentSkus() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      };
      return this.$api["productListParentSku1"](params)
        .then(data => {
          if (data.data) {
            let newSet = [...new Set(data.data)];
            //console.log(newSet, "newSet");
            let parent = [];
            newSet.forEach((el, index) => {
              parent.push({
                label: el,
                value: el
              });
            });
            let parentSetting = {
              label: "父产品",
              name: "parentSkus",
              type: "select",
              placeholder: "请选择",
              options: parent,
              multi: true,
              width:'300px',
			  labelWidth: '50px',
              onChange(item, value, data) {
                data.skus = [];
              },
              filterable: true
            };
            this.searchFields.splice(0, 1, parentSetting);
			this.$store.commit('common/parentSkus', data.data)
          }
          //   console.log(this.searchFields, "this.searchFields");
          return data;
        })
        .catch(err => {
          return false;
          console.log(err, "err");
        });
    },
    // 请求子sku列表
    getChildSkus() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentSkus: this.parentSkus
      };
      this.$api["ProductListSku"](params)
        .then(data => {
          if (data.data) {
            let newSet = [...new Set(data.data)];
            let children = [];
            newSet.forEach((el, index) => {
              children.push({
                label: el,
                value: el
              });
            });
            children = [...new Set(children)];
            let childrenSetting = {
              label: "子产品",
              name: "skus",
              type: "select",
              placeholder: "请选择",
              options: children,
              multi: true,
              width: '300px',
              onChange(item, value, data) {
                data.parentSkus = [];
                // console.log(data);
              },
              filterable: true
            };
            this.searchFields.splice(1, 1, childrenSetting);
			this.$store.commit('common/childSkus', data.data)
            // console.log(this.searchFields, "this.searchFields");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    async getSkus() {
      let parent = await this.getParentSkus();
      this.parentSkus = parent.data;
      //console.log(parent, "parent");
      if (this.parentSkus) {
        this.getChildSkus();
      }
    },
    //参数处理
    searchFunc(data) {
      let { time, ...info } = data;
      let [startTime, endTime] = time || [];
      return { startTime, endTime, ...info };
    }, //勾选改变
    selectChange(v) {
      //   console.log(v);
      this.slectIds = [];
      v.forEach(i => {
        this.slectIds.push(i.taskId);
      });
      //console.log(this.slectIds);
    },
    //删除按钮
    delBtn() {
      if (this.slectIds.length === 0) {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
        return;
      }
      this.$api["sameAttrConfigBatchRemove"]({
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        ids: this.slectIds
      })
        .then(data => {
          if (data.code === 0) {
            this.$refs.layout.getList();
          }
        })
        .catch(() => {});
    }
  },

  computed: {},
  watch: {
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.getSkus();
        this.outerParams.siteId = this.siteId;
        this.outerParams.sellerId = this.sellerId;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

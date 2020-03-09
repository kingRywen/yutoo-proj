
<!-- 表格和分页 -->
<template>
  <div class="___common __table custom-eltable">
    <!-- {{rows}} -->
    <el-table ref="Table" @selection-change="handleSelectionChange" :data="table.rows" style="width: 100%" border :stripe="stripe" @sort-change="sortable" @row-click="showCity__" :highlight-current-row="true" :row-style="table.rowStyle">
      <el-table-column v-if="selection" type="selection" width="55" :header-row-style="{'position':'absolute'}">
      </el-table-column>
      <!-- 序号 -->
      <el-table-column v-if="table.show.index" prop="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column v-if="table.show.orderId" prop="orderId" label="订单号" align="center">
      </el-table-column>
      <el-table-column v-if="table.show.chargeMonth" prop="chargeMonth" label="统计时间">
        <template slot-scope="scope">
          {{scope.row.chargeMonth | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.subscriptionFee" prop="subscriptionFee" label="店铺费用">
        <template slot-scope="scope">
          {{scope.row.subscriptionFee | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReceivable" sortable='custom' prop="amountReceivable" label="亚马逊应收FBA配送费用">
        <template slot-scope="scope">
          {{scope.row.amountReceivable | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountActual" sortable='custom' prop="amountActual" label="亚马逊实收FBA配送费用">
        <template slot-scope="scope">
          {{scope.row.amountActual | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountDifference" sortable='custom' prop="amountDifference" label="差额">
        <template slot-scope="scope">
          {{scope.row.amountDifference | _formatData}}
        </template>
      </el-table-column>

      <el-table-column v-if="table.show.parentAsinAmazon" prop="asin" label="ASIN" width='120px;'>
        <template slot-scope="scope">
          <a class="common_color" v-if="scope.row.productUrl&&scope.row.productUrl!==null&&scope.row.productUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl&&scope.row.productUrl!==null&&scope.row.productUrl!==''?scope.row.productUrl:false" style="text-decoration:none;">
            <span>{{scope.row.parentAsin}}</span>
          </a>
          <div v-else class="fix__row_2">
            {{scope.row.parentAsin | _formatData}}
          </div>
        </template>
      </el-table-column>
      <!-- 1 -->
      <el-table-column v-if="table.show.orderId1" prop="orderId" label="订单号">
        <template slot-scope="scope">
          {{scope.row.orderId | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReceivable1" sortable='custom' prop="amountReceivable" label="应收金额">
        <template slot-scope="scope">
          {{scope.row.amountReceivable | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountActual1" sortable='custom' prop="amountActual" label="实收金额">
        <template slot-scope="scope">
          {{scope.row.amountActual | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountDifference1" sortable='custom' prop="amountDifference" label="差额">
        <template slot-scope="scope">
          {{scope.row.amountDifference | __formatFlagM}}
        </template>
      </el-table-column>
      <!-- 2 -->
      <el-table-column v-if="table.show.orderId2" prop="orderId" label="订单号">
        <template slot-scope="scope">
          {{scope.row.orderId | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReceivable2" sortable='custom' prop="amountReceivable" label="应收金额">
        <template slot-scope="scope">
          {{scope.row.amountReceivable | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountActual2" sortable='custom' prop="amountActual" label="实收金额">
        <template slot-scope="scope">
          {{scope.row.amountActual | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantity2" sortable='custom' prop="quantity" label="产品数量">
        <template slot-scope="scope">
          {{scope.row.quantity | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountDifference2" sortable='custom' prop="amountDifference" label="差额">
        <template slot-scope="scope">
          {{scope.row.amountDifference | __formatFlagM}}
        </template>
      </el-table-column>
      <!-- 3 -->
      <el-table-column v-if="table.show.warnTime3" prop="warnTime" label="预警时间">
        <template slot-scope="scope">
          {{scope.row.warnTime | _formatData}}
        </template>
      </el-table-column>
	  <el-table-column v-if="table.show.statTime3" prop="statTime3" label="预警时间">
	    <template slot-scope="scope">
	      {{getWarning(scope.row.statTime)}}
	    </template>
	  </el-table-column>
      <el-table-column v-if="table.show.invAge0To90Days3" label="0到90天">
        <el-table-column sortable='custom' label="库存">
          <template slot-scope="scope">
            {{scope.row.invAge0To90Days | _formatData}}
          </template>
        </el-table-column>
        <el-table-column sortable='custom' label="费用">
          <template slot-scope="scope">
            {{scope.row.amount0To90Days | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.invAge91To180Days3" label="91到180天">
        <el-table-column sortable='custom' label="库存">
          <template slot-scope="scope">
            {{scope.row.invAge91To180Days | _formatData}}
          </template>
        </el-table-column>
        <el-table-column sortable='custom' label="费用">
          <template slot-scope="scope">
            {{scope.row.amount91To180Days | __formatFlagM}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.invAge181To270Days3" label="181到270天">
        <el-table-column sortable='custom' label="库存">
          <template slot-scope="scope">
            {{scope.row.invAge181To270Days | _formatData}}
          </template>
        </el-table-column>
        <el-table-column sortable='custom' label="费用">
          <template slot-scope="scope">
            {{scope.row.amount181To270Days | __formatFlagM}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.invAge271To365Days3" label="271到365天">
        <el-table-column sortable='custom' label="库存">
          <template slot-scope="scope">
            {{scope.row.invAge271To365Days | _formatData}}
          </template>
        </el-table-column>
        <el-table-column sortable='custom' label="费用">
          <template slot-scope="scope">
            {{scope.row.amount271To365Days | __formatFlagM}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.invAge365PlusDays3" label="365天~">
        <el-table-column sortable='custom' label="库存">
          <template slot-scope="scope">
            {{scope.row.invAge365PlusDay | _formatData}}
          </template>
        </el-table-column>
        <el-table-column sortable='custom' label="费用">
          <template slot-scope="scope">
            {{scope.row.amount365PlusDays | __formatFlagM}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.amountReceivable3" sortable='custom' prop="amountDifference" label="应收金额">
        <template slot-scope="scope">
          {{scope.row.amountReceivable | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountActual3" sortable='custom' prop="amountActual" label="实收金额">
        <template slot-scope="scope">
          {{scope.row.amountActual | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountDifference3" sortable='custom' prop="amountDifference" label="差额合计">
        <template slot-scope="scope">
          {{scope.row.amountDifference | __formatFlagM}}
        </template>
      </el-table-column>
      <!-- 4 -->
      <el-table-column v-if="table.show.orderId4" prop="orderId" label="订单号">
        <template slot-scope="scope">
          {{scope.row.orderId | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReceivable4" sortable='custom' prop="quantityReceivable" label="应赔数量">
        <template slot-scope="scope">
          {{scope.row.quantityReceivable | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityActual4" sortable='custom' prop="quantityActual" label="实赔数量">
        <template slot-scope="scope">
          {{scope.row.quantityActual | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityRefund4" sortable='custom' prop="quantityRefund" label="退款数量">
        <template slot-scope="scope">
          {{scope.row.quantityRefund | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReturn4" sortable='custom' prop="quantityReturn" label="退货数量">
        <template slot-scope="scope">
          {{scope.row.quantityReturn | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityDifference4" sortable='custom' prop="quantityDifference" label="差额">
        <template slot-scope="scope">
          {{scope.row.quantityDifference | _formatData}}
        </template>
      </el-table-column>
      <!-- 5 -->
      <el-table-column v-if="table.show.createTime5" prop="warnTime" label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.shipmentId5" prop="warnTime" label="shipmentId">
        <template slot-scope="scope">
          {{scope.row.shipmentId | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityShipped5" sortable='custom' prop="quantityShipped" label="发货数量">
        <template slot-scope="scope">
          {{scope.row.quantityShipped | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReceived5" sortable='custom' prop="quantityReceived" label="入库数量">
        <template slot-scope="scope">
          {{scope.row.quantityReceived | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReceivable5" sortable='custom' prop="quantityReceivable" label="应赔数量">
        <template slot-scope="scope">
          {{scope.row.quantityReceivable | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityActual5" sortable='custom' prop="quantityActual" label="实赔数量">
        <template slot-scope="scope">
          {{scope.row.quantityActual | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityDifference5" sortable='custom' prop="quantityDifference" label="差额">
        <template slot-scope="scope">
          {{scope.row.quantityDifference | _formatData}}
        </template>
      </el-table-column>
      <!-- 6 -->
      <el-table-column v-if="table.show.warnTime6" prop="warnTime" label="预警时间">
        <template slot-scope="scope">
          {{scope.row.warnTime | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReceivable6" sortable='custom' prop="quantityReceivable" label="应有库存数">
        <template slot-scope="scope">
          {{scope.row.quantityReceivable | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityActual6" sortable='custom' prop="quantityActual" label="实际库存数">
        <template slot-scope="scope">
          {{scope.row.quantityActual | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReceivableReturn6" sortable='custom' prop="quantityReceivableReturn" label="应赔数量">
        <template slot-scope="scope">
          {{scope.row.quantityReceivableReturn | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityActualReturn6" sortable='custom' prop="quantityActualReturn" label="实赔数量">
        <template slot-scope="scope">
          {{scope.row.quantityActualReturn | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityDifference6" sortable='custom' prop="quantityDifference" label="差额">
        <template slot-scope="scope">
          {{scope.row.quantityDifference | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReceived7" prop="amountReceived" label="店铺收款">
        <template slot-scope="scope">
          {{scope.row.amountReceived | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountSales7" prop="amountSales" label="销售额">
        <template slot-scope="scope">
          {{scope.row.amountSales | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReimbursement7" prop="amountReimbursement" label="赔偿">
        <template slot-scope="scope">
          {{scope.row.amountReimbursement | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountFulfillment7" prop="amountFulfillment" label="正常FBA配送费">
        <template slot-scope="scope">
          {{scope.row.amountFulfillment | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountCommission7" prop="amountCommission" label="正常订单佣金">
        <template slot-scope="scope">
          {{scope.row.amountCommission | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountStorage7" prop="amountStorage" label="仓储费">
        <template slot-scope="scope">
          {{scope.row.amountStorage | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRefund7" prop="amountRefund" label="退款金额">
        <template slot-scope="scope">
          {{scope.row.amountRefund | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRefundLoss7" prop="amountRefundLoss" label="退款损失">
        <template slot-scope="scope">
          {{scope.row.amountRefundLoss | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountDisposal7" prop="amountDisposal" label="移除费用">
        <template slot-scope="scope">
          {{scope.row.amountDisposal | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRemove7" prop="amountRemove" label="销毁费">
        <template slot-scope="scope">
          {{scope.row.amountRemove | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountAdvert7" prop="amountAdvert" label="广告费">
        <template slot-scope="scope">
          {{scope.row.amountAdvert | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountCost7" prop="amountCost" label="成本">
        <template slot-scope="scope">
          {{scope.row.amountCost | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountProfit7" prop="amountProfit" label="利润">
        <template slot-scope="scope">
          {{scope.row.amountProfit | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.orderId8" prop="orderId" label="订单号">
        <template slot-scope="scope">
          {{scope.row.orderId | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountTotal8" sortable='custom' prop="amountTotal" label="订单金额">
        <template slot-scope="scope">
          {{scope.row.amountTotal | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantity8" sortable='custom' prop="quantity" label="退货数量">
        <template slot-scope="scope">
          {{scope.row.quantity | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.refundAmount8" sortable='custom' prop="refundAmount" label="退款金额">
        <template slot-scope="scope">
          {{scope.row.refundAmount | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fulfillmentFee8" sortable='custom' prop="fulfillmentFee" label="正常FBA配送费">
        <template slot-scope="scope">
          {{scope.row.fulfillmentFee | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.commission8" sortable='custom' prop="commission" label="正常订单佣金">
        <template slot-scope="scope">
          {{scope.row.commission | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.refundLoss8" sortable='custom' prop="refundLoss" label="退款损失">
        <template slot-scope="scope">
          {{scope.row.refundLoss | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountSales9" prop="amountSales" label="销售额">
        <template slot-scope="scope">
          {{scope.row.amountSales | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRefund9" prop="amountRefund" label="退款金额">
        <template slot-scope="scope">
          {{scope.row.amountRefund | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountAdvert9" prop="amountAdvert" label="广告费用">
        <template slot-scope="scope">
          {{scope.row.amountAdvert | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertProportion9" prop="advertProportion" label="广告占未退款比率">
        <template slot-scope="scope">
          <!-- todo -->
          {{scope.row.advertProportion | _formatRate}}
        </template>
      </el-table-column>
      <!-- 任务名称 -->
      <el-table-column v-if="table.show.taskName" prop="taskName" label="任务名称">
        <template slot-scope="scope">
          <div class="fix__row_1" v-if="scope.row.taskName === '' || scope.row.taskName == null">{{scope.row.taskName
            || "-"}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.taskName" effect="light">
            <div class="fix__row_1">
              <span>{{ scope.row.taskName!=""?scope.row.taskName:""}}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- asin关键词检验的 -->
	  <el-table-column v-if="table.show.mainImg" prop="imageUrl" label="主图" width="80px">
	    <template slot-scope="scope">
	      <el-popover placement="right" title="" trigger="hover">
	        <img :src="scope.row.imageUrl" class="big__" />
	        <a class="__img_wrapper" slot="reference" :href="scope.row.productUrl" target="_blank">
	          <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
	        </a>
	      </el-popover>
	    </template>
	  </el-table-column>
      <el-table-column v-if="table.show.asin||table.show.parentAsin" :prop="'asin'||table.show.asinProp" label="ASIN">
        <template slot-scope="scope">
          <span v-if="scope.row.highlight" v-html='scope.row.asin'></span>
          <span v-else>{{scope.row.asin||scope.row.parentAsin}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="table.show.asin2" prop="asin" label="ASIN/SKU" width='120'>
                <template slot-scope="scope">
                    <span style="cursor:pointer;" class="common__color" @click='showDetails(scope.row)'>{{scope.row.asin}}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="table.show.asin3" prop="asin" label="ASIN/SKU" width='120'>
                <template slot-scope="scope">
                    <span>{{scope.row.asin}}</span>
                </template>
            </el-table-column> -->
      <el-table-column v-if="table.show.asin2" prop="asin" width='140'>
        <template slot="header" slot-scope="scope">
          <el-select v-model="value" size='mini'>
            <el-option v-for="item in optionsAsinSku" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope">
          <span v-if="value==='asin'" style="cursor:pointer;" class="common__color" @click='showDetails(scope.row)'>{{scope.row.asin}}</span>
          <span v-else style="cursor:pointer;" class="common__color" @click='showDetails(scope.row)'>{{scope.row.sku}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="table.show.asin3" prop="asin" width='140'>
        <template slot="header" slot-scope="scope">
          <el-select v-model="value" size='mini'>
            <el-option v-for="item in optionsAsinSku" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope">
          <span v-if="value==='asin'">{{scope.row.asin}}</span>
          <span v-else>{{scope.row.sku}}</span>
        </template>
      </el-table-column> -->
	  <el-table-column v-if="table.show.asin3" prop="sku" label="SKU" width='180'>
	    <template slot-scope="scope">
		  <span class="fix__row_1">{{scope.row.sku?scope.row.sku:"-"}}</span>
	      
	    </template>
	  </el-table-column>
	  <el-table-column v-if="table.show.asin3" prop="asin" label="ASIN" width='150'>
	    <template slot-scope="scope">
	      {{scope.row.asin?scope.row.asin:"-"}}
	    </template>
	  </el-table-column>
      <el-table-column v-if="table.show.saleStatus" prop="saleStatus" label="状态" width='120'>
        <template slot-scope="scope">
          <div v-if="scope.row.productStatus==1">在售</div>
          <div v-else-if="scope.row.productStatus==2">不可售</div>
          <div v-else-if="scope.row.productStatus==3">信息待改善</div>
          <div v-else-if="scope.row.productStatus==4">禁止显示</div>
          <div v-else-if="scope.row.productStatus==null">已下架，不可售</div>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.imageUrl" prop="imageUrl" label="主图" width="80px">
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.imageUrl" class="big__" />
            <div class="__img_wrapper" slot="reference">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.asinURL" prop="asin" label="ASIN">
        <template slot-scope="scope">
          <a class="common_color" v-if="scope.row.productUrl&&scope.row.productUrl!==null&&scope.row.productUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl&&scope.row.productUrl!==null&&scope.row.productUrl!==''?scope.row.productUrl:false" style="text-decoration:none;">
            <span>{{scope.row.asin}}</span>
          </a>
          <div v-else class="fix__row_2">
            {{scope.row.asin | _formatData}}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.imageUrlURL" prop="imageUrl" label="主图" width="80px">
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.imageUrl" class="big__" />
            <div class="__img_wrapper" slot="reference">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReceived" prop="amountReceived" label="店铺收款" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.amountReceived | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountSales" prop="amountSales" label="销售总额" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.amountSales | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountReimbursement" prop="amountReimbursement" label="赔偿" sortable='custom' min-width="70">
        <template slot-scope="scope">
          {{scope.row.amountReimbursement | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountFulfillment" prop="amountFulfillment" label="正常FBA配送费" sortable='custom' min-width="130">
        <template slot-scope="scope">
          {{scope.row.amountFulfillment | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountCommission" prop="amountCommission" label="正常订单佣金" sortable='custom' min-width="120">
        <template slot-scope="scope">
          {{scope.row.amountCommission | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRefund" prop="amountRefund" label="退款金额" sortable='custom' min-width="95" >
        <template slot-scope="scope">
          {{scope.row.amountRefund | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRefundLoss" prop="amountRefundLoss" label="退款损失" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.amountRefundLoss | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountStorage" prop="amountStorage" label="仓储费" sortable='custom' min-width="85">
        <template slot-scope="scope">
          {{scope.row.amountStorage | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountDisposal" prop="amountDisposal" label="销毁费用"  sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.amountDisposal | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountAdvert" prop="amountAdvert" label="广告费用"  sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.amountAdvert | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.amountRemove" prop="amountRemove" label="移除费用"  sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.amountRemove | __formatFlagM}}
        </template>
      </el-table-column>
      <!-- 2 -->
      <el-table-column v-if="table.show.quantityStock" prop="quantityStock" label="剩余库存" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.quantityStock | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReceived" prop="quantityReceived" label="入库库存" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.quantityReceived | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityRefundActive" prop="quantityRefundActive" label="可售退货库存" sortable='custom' min-width="120">
        <template slot-scope="scope">
          {{scope.row.quantityRefundActive | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityRefundInactive" prop="quantityRefundInactive" label="不可售退货库存" sortable='custom' min-width="130">
        <template slot-scope="scope">
          {{scope.row.quantityRefundInactive | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityReimbursement" prop="quantityReimbursement" label="赔偿库存" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.quantityReimbursement | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityShipped" prop="quantityShipped" label="发货库存" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.quantityShipped | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantitySales" prop="quantitySales" label="售出库存" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.quantitySales | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityAmazonLoss" prop="quantityAmazonLoss" label="亚马逊丢件库存" sortable='custom' min-width="130">
        <template slot-scope="scope">
          {{scope.row.quantityAmazonLoss | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.quantityAmazonDamaged" prop="quantityAmazonDamaged" label="亚马逊损坏库存" sortable='custom' min-width="130">
        <template slot-scope="scope">
          {{scope.row.quantityAmazonDamaged | _formatData}}
        </template>
      </el-table-column>
			<el-table-column v-if="table.show.quantityCustomerDamaged" prop="quantityCustomerDamaged" label="客户损坏库存" sortable='custom' min-width="120">
			  <template slot-scope="scope">
			    {{scope.row.quantityCustomerDamaged | _formatData}}
			  </template>
			</el-table-column>
      <el-table-column v-if="table.show.quantityDisposal" prop="quantityDisposal" label="销毁库存" sortable='custom' min-width="95">
        <template slot-scope="scope">
          {{scope.row.quantityDisposal | _formatData}}
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="table.show.quantityDisposal" prop="quantityDisposal" label="移除费用">
                <template slot-scope="scope">
                    {{scope.row.quantityDisposal | __formatFlagM}}
                </template>
            </el-table-column> -->
      <el-table-column v-if="table.show.quantityTransfer" prop="quantityTransfer" label="转库中" sortable='custom' min-width="85">
        <template slot-scope="scope">
          {{scope.row.quantityTransfer | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.pro" label="问题类型" width="210">
        <template slot-scope="scope">
          <div @click="showDialog(scope.row)">
            <el-badge :value="scope.row.problemList.length" class="item __pointer common_color2">
              <span style="color: red;">
                {{scope.row.problemList[0].problemName}}
              </span>
            </el-badge>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.skuCnt" sortable='custom' prop="skuCnt" label="子sku数" min-width="90">
        <template slot-scope="scope">
          {{scope.row.skuCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.starCnt" sortable='custom' prop="starCnt" label="评分">
        <template slot-scope="scope">
          {{scope.row.starCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.reviewCnt" sortable='custom' prop="reviewCnt" label="评价数" min-width="90">
        <template slot-scope="scope">
          {{scope.row.reviewCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.dailyAvgNewReviewCnt" min-width="100px" sortable='custom' prop="dailyAvgNewReviewCnt" label="日均新增评价数">
        <template slot-scope="scope">
          {{scope.row.dailyAvgNewReviewCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.releaseDate" sortable='custom' prop="releaseDate" label="上架时间" min-width="100">
        <template slot-scope="scope">
          {{scope.row.releaseDate | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.brand" prop="brand" label="品牌" min-width="100">
        <template slot-scope="scope">
			<el-tooltip v-if="table.show.brand" placement="top" :content="scope.row.brand" effect="light">
			  <div class="fix__row_1">
			    {{scope.row.brand}}
			  </div>
			</el-tooltip>
			<span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.aqCnt" sortable='custom' prop="aqCnt" label="AQ数">
        <template slot-scope="scope">
          {{scope.row.aqCnt===null||scope.row.aqCnt===''?'-':scope.row.aqCnt==1000?'1000+':scope.row.aqCnt}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbpFlag" prop="fbpFlag" label="发货方式">
        <template slot-scope="scope">
          {{scope.row.fbpFlag | _formatFlag}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbpFlagAmazon" prop="fbpFlag" label="发货方式" min-width="120">
        <template slot-scope="scope">
          {{scope.row.fbpFlag | _fbpFlagAmazon}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sellerCnt" sortable='custom' prop="sellerCnt" label="跟卖卖家数" min-width="120">
        <template slot-scope="scope">
          {{scope.row.sellerCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.salesRank" sortable='custom' prop="salesRank" label="销量排名">
        <template slot-scope="scope">
          {{scope.row.salesRank | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.Stars" label="底部评价分数" align="center">
        <el-table-column v-if="table.show.Stars.s1" sortable='custom' prop="bottom1StarCnt" label="1星">
          <template slot-scope="scope">
            {{scope.row.bottom1StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.Stars.s2" sortable='custom' prop="bottom2StarCnt" label="2星">
          <template slot-scope="scope">
            {{scope.row.bottom2StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.Stars.s3" sortable='custom' prop="bottom3StarCnt" label="3星">
          <template slot-scope="scope">
            {{scope.row.bottom3StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.Stars.s4" sortable='custom' prop="bottom4StarCnt" label="4星">
          <template slot-scope="scope">
            {{scope.row.bottom4StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.Stars.s5" sortable='custom' prop="bottom5StarCnt" label="5星">
          <template slot-scope="scope">
            {{scope.row.bottom5StarCnt | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.BSR" sortable='custom' prop="rank" label="BSR">
        <template slot-scope="scope">
          {{scope.row.rank | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.price" sortable='custom' prop="price" label="价格">
        <template slot-scope="scope">
          {{scope.row.price | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.buyBoxSellerCnt" sortable='custom' min-width="160" prop="buyBoxSellerCnt" label="buy box获得卖家数">
        <template slot-scope="scope">
          <span style="cursor:pointer;" class="common__color" @click='showBuyBoxSellerCnt__(scope.row)'>
            {{scope.row.buyBoxSellerCnt | _formatData}}</span>
        </template>
      </el-table-column>
	  
	  <el-table-column v-if="table.show.skuItem" prop="sku" label="sku">
	    <template slot-scope="scope">
	      {{scope.row.sku?scope.row.sku:"-"}}
	    </template>
	  </el-table-column>
	  
      <!-- 名称 todo-->
      <el-table-column v-if="table.show.productName" prop="productName" label="名称">
        <template slot-scope="scope">
          <div class="fix__row_1" v-if="scope.row.productName === '' || scope.row.productName == null">{{scope.row.productName
            || "-"}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.productName" effect="light">
            <div class="fix__row_1">
              <span>{{ scope.row.productName!=""?scope.row.productName:""}}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 店铺名称 -->
      <el-table-column v-if="table.show.sellerAlias" prop="sellerAlias" label="店铺名称">
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.sellerAlias === '' || scope.row.sellerAlias == null">{{scope.row.sellerAlias
            || "-"}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.sellerAlias" effect="light">
            <div class="fix__row_2">
              <span>{{ scope.row.sellerAlias!=""?scope.row.sellerAlias:""}}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 卖家ID -->
      <el-table-column v-if="table.show.sellerId" prop="sellerId" label="卖家编号">
      </el-table-column>
      <!-- 授权时间 -->
      <el-table-column v-if="table.show.authTime" prop="authTime" label="授权时间">
      </el-table-column>
      <!-- 类目分析的操作在前面 -->
      <el-table-column v-if="table.show.Handle_head" prop="handle" label="操作" width='80'>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="light" content="查看" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle_head.check&&scope.row.depthTaskId" class="iconfont el-icon-search" type="text"  @click="check__(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="新增评价数" placement="top-start" :enterable="false">
            <el-button size="mini" v-if="table.show.Handle_head.check" class="iconfont el-icon-picture-outline" type="text" @click="draw__(scope.row)" style="width: 14px;height: 14px;"></el-button>
          </el-tooltip>
		  <el-tooltip class="item" effect="light" content="TOP100新增review数" placement="top-start" :enterable="false">
		    <el-button size="mini" v-if="table.show.Handle_head.Topreview" class="iconfont el-icon-picture-outline" type="text" @click="draw__(scope.row)" style="width: 14px;height: 14px;"></el-button>
		  </el-tooltip>
        </template>
      </el-table-column>
      <!-- 类目 v-if="table.show.category"-->
      <!-- <el-table-column v-if="table.show.category" prop="category" label="类目" min-width="140">
        <template slot-scope="scope">
          <div class="fix__row_1" v-if="scope.row.category === '' || scope.row.category == null">{{scope.row.category
            ||'-'}}</div>
          <el-tooltip v-if="scope.row.categoryUrl" placement="top" :content="scope.row.category">
            <a class="fix__row_1 common_color" v-if="scope.row.categoryUrl&&scope.row.categoryUrl!==null&&scope.row.categoryUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.categoryUrl&&scope.row.categoryUrl!==null&&scope.row.categoryUrl!==''?scope.row.categoryUrl:false" style="text-decoration:none;">
              <span>{{scope.row.category}}</span>
            </a>
            <div v-else class="fix__row_1">
              {{scope.row.category | _formatData_cate}}
            </div>
          </el-tooltip>
          <el-tooltip v-if="!scope.row.categoryUrl" placement="top" :content="scope.row.category">
            <div class="fix__row_1">
              {{scope.row.category | _formatData_cate}}
            </div>
          </el-tooltip>
          <a v-if="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?scope.row.url:false" style="text-decoration:none;">
            <i v-if="table.show.Handle.link" class="iconfont icon-Group-"></i>
          </a>
        </template>
      </el-table-column> -->
	  <!-- 深度分析的类目 -->
	  <el-table-column v-if="table.show.category" prop="category" label="类目" width="300">
	    <template slot-scope="scope">
	      <div class="fix__row_1" v-if="scope.row.category === '' || scope.row.category == null">{{scope.row.category
	        ||'-'}}</div>
	      <el-tooltip v-if="scope.row.categoryUrl" placement="top" :content="scope.row.category" effect="light">
	        <!-- todo -->
	        <a class="fix__row_1 common_color2" v-if="scope.row.categoryUrl&&scope.row.categoryUrl!==null&&scope.row.categoryUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.categoryUrl&&scope.row.categoryUrl!==null&&scope.row.categoryUrl!==''?scope.row.categoryUrl:false" style="text-decoration:none;">
	          <span>{{formatCateDepth(scope.row.category)}}</span>
	        </a>
	        <div v-else class="fix__row_1">
	          {{formatCateDepth(scope.row.category)}}
	        </div>
	      </el-tooltip>
	      <el-tooltip v-if="!scope.row.categoryUrl" placement="top" :content="scope.row.category"  effect="light">
	        <div class="fix__row_1">
	          {{formatCateDepth(scope.row.category)}}
	        </div>
	      </el-tooltip>
	      <a v-if="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?scope.row.url:false" style="text-decoration:none;">
	        <i v-if="table.show.Handle.link" class="iconfont icon-Group-"></i>
	      </a>
	    </template>
	  </el-table-column>
      <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[0].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="productCnt" label="产品数">
        <template slot-scope="scope">
          {{scope.row.productCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[0].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="fbsProductCnt" label="FBS产品数">
        <template slot-scope="scope">
          {{scope.row.fbsProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[0].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="fbmProductCnt" label="自发货产品数">
        <template slot-scope="scope">
          {{scope.row.fbmProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[0].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="brandCnt" label="品牌数">
        <template slot-scope="scope">
          {{scope.row.brandCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[0].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="sellerCnt" label="卖家数">
        <template slot-scope="scope">
          {{scope.row.sellerCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[0].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="newReviewCntD30" label="近30天日平均新增评价数">
        <template slot-scope="scope">
          {{scope.row.newReviewCntD30 | _formatData}}
        </template>
      </el-table-column>
      <!-- TOP1产品 -->
      <el-table-column label="TOP1产品" v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('a')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl1" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl1&&scope.row.productUrl1!==null&&scope.row.productUrl1!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl1&&scope.row.productUrl1!==null&&scope.row.productUrl1!==''?scope.row.productUrl1:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl1" :key="scope.row.imageUrl1" v-lazy="scope.row.imageUrl1?scope.row.imageUrl1:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="dailyAvgNewReviewCnt1" label="日平均新增评价数">
          <template slot-scope="scope">
            {{scope.row.dailyAvgNewReviewCnt1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="starCnt1" label="评分">
          <template slot-scope="scope">
            {{scope.row.starCnt1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="reviewCnt1" label="总评价数">
          <template slot-scope="scope">
            {{scope.row.reviewCnt1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="releaseDate1" label="上架时间">
          <template slot-scope="scope">
            {{scope.row.releaseDate1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="price1" label="价格">
          <template slot-scope="scope">
            {{scope.row.price1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="productSellerCnt1" label="跟卖人数">
          <template slot-scope="scope">
            {{scope.row.productSellerCnt1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[1].selected.indexOf('h')!==-1?true:false" prop="fbpFlag1" label="发货方式">
          <template slot-scope="scope">
            {{scope.row.fbpFlag1 | _formatFlag}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP2产品 -->
      <el-table-column label="TOP2产品" v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('a')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl2" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl2&&scope.row.productUrl2!==null&&scope.row.productUrl2!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl2&&scope.row.productUrl2!==null&&scope.row.productUrl2!==''?scope.row.productUrl2:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl2" :key="scope.row.imageUrl2" v-lazy="scope.row.imageUrl2?scope.row.imageUrl2:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="dailyAvgNewReviewCnt2" label="日平均新增评价数">
          <template slot-scope="scope">
            {{scope.row.dailyAvgNewReviewCnt2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="starCnt2" label="评分">
          <template slot-scope="scope">
            {{scope.row.starCnt2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="reviewCnt2" label="总评价数">
          <template slot-scope="scope">
            {{scope.row.reviewCnt2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="releaseDate2" label="上架时间">
          <template slot-scope="scope">
            {{scope.row.releaseDate2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="price2" label="价格">
          <template slot-scope="scope">
            {{scope.row.price2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="productSellerCnt2" label="跟卖人数">
          <template slot-scope="scope">
            {{scope.row.productSellerCnt2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[2].selected.indexOf('h')!==-1?true:false" prop="fbpFlag2" label="发货方式">
          <template slot-scope="scope">
            {{scope.row.fbpFlag2 | _formatFlag}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP3产品 -->
      <el-table-column label="TOP3产品" v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('a')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl3" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl3&&scope.row.productUrl3!==null&&scope.row.productUrl3!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl3&&scope.row.productUrl3!==null&&scope.row.productUrl3!==''?scope.row.productUrl3:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl3" :key="scope.row.imageUrl3" v-lazy="scope.row.imageUrl3?scope.row.imageUrl3:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="dailyAvgNewReviewCnt3" label="日平均新增评价数">
          <template slot-scope="scope">
            {{scope.row.dailyAvgNewReviewCnt3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="starCnt3" label="评分">
          <template slot-scope="scope">
            {{scope.row.starCnt3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="reviewCnt3" label="总评价数">
          <template slot-scope="scope">
            {{scope.row.reviewCnt3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="releaseDate3" label="上架时间">
          <template slot-scope="scope">
            {{scope.row.releaseDate3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="price3" label="价格">
          <template slot-scope="scope">
            {{scope.row.price3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="productSellerCnt3" label="跟卖人数">
          <template slot-scope="scope">
            {{scope.row.productSellerCnt3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[3].selected.indexOf('h')!==-1?true:false" prop="fbpFlag3" label="发货方式">
          <template slot-scope="scope">
            {{scope.row.fbpFlag3 | _formatFlag}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP4产品 -->
      <el-table-column label="TOP4产品" v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('a')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl4" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl4&&scope.row.productUrl4!==null&&scope.row.productUrl4!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl4&&scope.row.productUrl4!==null&&scope.row.productUrl4!==''?scope.row.productUrl4:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl4" :key="scope.row.imageUrl4" v-lazy="scope.row.imageUrl4?scope.row.imageUrl4:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="dailyAvgNewReviewCnt4" label="日平均新增评价数">
          <template slot-scope="scope">
            {{scope.row.dailyAvgNewReviewCnt4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="starCnt4" label="评分">
          <template slot-scope="scope">
            {{scope.row.starCnt4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="reviewCnt4" label="总评价数">
          <template slot-scope="scope">
            {{scope.row.reviewCnt4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="releaseDate4" label="上架时间">
          <template slot-scope="scope">
            {{scope.row.releaseDate4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="price4" label="价格">
          <template slot-scope="scope">
            {{scope.row.price4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="productSellerCnt4" label="跟卖人数">
          <template slot-scope="scope">
            {{scope.row.productSellerCnt4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[4].selected.indexOf('h')!==-1?true:false" prop="fbpFlag4" label="发货方式">
          <template slot-scope="scope">
            {{scope.row.fbpFlag4 | _formatFlag}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- Top5 -->
      <el-table-column label="TOP5产品" v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('a')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl5" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl5&&scope.row.productUrl5!==null&&scope.row.productUrl5!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl5&&scope.row.productUrl5!==null&&scope.row.productUrl5!==''?scope.row.productUrl5:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl5" :key="scope.row.imageUrl5" v-lazy="scope.row.imageUrl5?scope.row.imageUrl5:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="dailyAvgNewReviewCnt5" label="日平均新增评价数">
          <template slot-scope="scope">
            {{scope.row.dailyAvgNewReviewCnt5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="starCnt5" label="评分">
          <template slot-scope="scope">
            {{scope.row.starCnt5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="reviewCnt5" label="总评价数">
          <template slot-scope="scope">
            {{scope.row.reviewCnt5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="releaseDate5" label="上架时间">
          <template slot-scope="scope">
            {{scope.row.releaseDate5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="price5" label="价格">
          <template slot-scope="scope">
            {{scope.row.price5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="productSellerCnt5" label="跟卖人数">
          <template slot-scope="scope">
            {{scope.row.productSellerCnt5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[5].selected.indexOf('h')!==-1?true:false" prop="fbpFlag5" label="发货方式">
          <template slot-scope="scope">
            {{scope.row.fbpFlag5 | _formatFlag}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP1卖家 -->
      <el-table-column label="TOP1卖家" v-if="table.show.tableSelect2&&table.show.tableSelect2[6].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[6].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="top100ProductCnt1" label="TOP100产品数">
          <template slot-scope="scope">
            {{scope.row.top100ProductCnt1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[6].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="newFeedbackCntD301" label="近30天店铺新增评价数">
          <template slot-scope="scope">
            {{scope.row.newFeedbackCntD301 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[6].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="sellerProductCnt1" label="店铺产品数">
          <template slot-scope="scope">
            {{scope.row.sellerProductCnt1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[6].selected.indexOf('d')!==-1?true:false" prop="sellerName1" label="卖家名称">
          <template slot-scope="scope">
            <a class="fix__row_2 common_color" v-if="scope.row.sellerUrl1&&scope.row.sellerUrl1!==null&&scope.row.sellerUrl1!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl1&&scope.row.sellerUrl1!==null&&scope.row.sellerUrl1!==''?scope.row.sellerUrl1:false" style="text-decoration:none;">
              {{scope.row.sellerName1 | _formatData}}
            </a>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP2卖家 -->
      <el-table-column label="TOP2卖家" v-if="table.show.tableSelect2&&table.show.tableSelect2[7].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[7].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="top100ProductCnt2" label="TOP100产品数">
          <template slot-scope="scope">
            {{scope.row.top100ProductCnt2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[7].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="newFeedbackCntD302" label="近30天店铺新增评价数">
          <template slot-scope="scope">
            {{scope.row.newFeedbackCntD302 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[7].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="sellerProductCnt2" label="店铺产品数">
          <template slot-scope="scope">
            {{scope.row.sellerProductCnt2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[7].selected.indexOf('d')!==-1?true:false" prop="sellerName2" label="卖家名称">
          <template slot-scope="scope">
            <a class="fix__row_2 common_color" v-if="scope.row.sellerUrl2&&scope.row.sellerUrl2!==null&&scope.row.sellerUrl2!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl2&&scope.row.sellerUrl2!==null&&scope.row.sellerUrl2!==''?scope.row.sellerUrl2:false" style="text-decoration:none;">
              {{scope.row.sellerName2 | _formatData}}
            </a>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP3卖家 -->
      <el-table-column label="TOP3卖家" v-if="table.show.tableSelect2&&table.show.tableSelect2[8].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[8].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="top100ProductCnt3" label="TOP100产品数">
          <template slot-scope="scope">
            {{scope.row.top100ProductCnt3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[8].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="newFeedbackCntD303" label="近30天店铺新增评价数">
          <template slot-scope="scope">
            {{scope.row.newFeedbackCntD303 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[8].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="sellerProductCnt3" label="店铺产品数">
          <template slot-scope="scope">
            {{scope.row.sellerProductCnt3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[8].selected.indexOf('d')!==-1?true:false" prop="sellerName3" label="卖家名称">
          <template slot-scope="scope">
            <a class="fix__row_2 common_color" v-if="scope.row.sellerUrl3&&scope.row.sellerUrl3!==null&&scope.row.sellerUrl3!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl3&&scope.row.sellerUrl3!==null&&scope.row.sellerUrl3!==''?scope.row.sellerUrl3:false" style="text-decoration:none;">
              {{scope.row.sellerName3 | _formatData}}
            </a>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP4卖家 -->
      <el-table-column label="TOP4卖家" v-if="table.show.tableSelect2&&table.show.tableSelect2[9].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[9].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="top100ProductCnt4" label="TOP100产品数">
          <template slot-scope="scope">
            {{scope.row.top100ProductCnt4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[9].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="newFeedbackCntD304" label="近30天店铺新增评价数">
          <template slot-scope="scope">
            {{scope.row.newFeedbackCntD304 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[9].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="sellerProductCnt4" label="店铺产品数">
          <template slot-scope="scope">
            {{scope.row.sellerProductCnt4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[9].selected.indexOf('d')!==-1?true:false" prop="sellerName4" label="卖家名称">
          <template slot-scope="scope">
            <a class="fix__row_2 common_color" v-if="scope.row.sellerUrl4&&scope.row.sellerUrl4!==null&&scope.row.sellerUrl4!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl4&&scope.row.sellerUrl4!==null&&scope.row.sellerUrl4!==''?scope.row.sellerUrl4:false" style="text-decoration:none;">
              {{scope.row.sellerName4 | _formatData}}
            </a>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP5卖家 -->
      <el-table-column label="TOP5卖家" v-if="table.show.tableSelect2&&table.show.tableSelect2[10].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[10].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="top100ProductCnt5" label="TOP100产品数">
          <template slot-scope="scope">
            {{scope.row.top100ProductCnt5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[10].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="newFeedbackCntD305" label="近30天店铺新增评价数">
          <template slot-scope="scope">
            {{scope.row.newFeedbackCntD305 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[10].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="sellerProductCnt5" label="店铺产品数">
          <template slot-scope="scope">
            {{scope.row.sellerProductCnt5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect2&&table.show.tableSelect2[10].selected.indexOf('d')!==-1?true:false" prop="sellerName5" label="卖家名称">
          <template slot-scope="scope">
            <a class="fix__row_2 common_color" v-if="scope.row.sellerUrl5&&scope.row.sellerUrl5!==null&&scope.row.sellerUrl5!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl5&&scope.row.sellerUrl5!==null&&scope.row.sellerUrl5!==''?scope.row.sellerUrl5:false" style="text-decoration:none;">
              {{scope.row.sellerName5 | _formatData}}
            </a>
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 亚马逊类目分析 -->
	  <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[0].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="fbaSellerCnt" label="卖家总数" width="95" :render-header="handleHelp3">
	    <template slot-scope="scope">
	      {{scope.row.fbaSellerCnt | _formatData}}
	    </template>
	  </el-table-column>
	  <el-table-column v-if="table.show.isShowCnSellerCnt&&table.show.tableSelecty[0].selected.indexOf('e')!==-1?true:false"  sortable='custom' prop="fbaProdCnBrandCnt" label="中国品牌数" width="110px" :render-header="handleHelp1">
	    <template slot-scope="scope">
	      <span  v-if="table.show.showBrandStatus!=1" style="color:#108ee9;cursor: pointer;" @click="tableMethod(scope,1)">{{scope.row.fbaProdCnBrandCnt}}</span>
	  		  <span v-else>-</span>
	    </template>
	  </el-table-column>
	  <el-table-column v-if="table.show.isShowTop100CNProdCnt&&table.show.tableSelecty[0].selected.indexOf('f')!==-1?true:false"  sortable='custom' prop="top100CnProdCnt" label="中国品牌产品数" width="130px" :render-header="handleHelp2">
	    <template slot-scope="scope">
	      <span v-if="table.show.showBrandStatus!=1" style="color:#108ee9;cursor: pointer;" @click="tableMethod(scope,2)">{{scope.row.top100CnProdCnt}}</span>
	  		   <span v-else>-</span>
	    </template>
	  </el-table-column>
      <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[0].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="productCnt" label="总产品数" width="95">
        <template slot-scope="scope">
          {{scope.row.productCnt | _formatData}}
        </template>
      </el-table-column>
      
			<el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[0].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="fbaProductCnt" label="FBA产品数" width="110">
			  <template slot-scope="scope">
			    {{scope.row.fbaProductCnt | _formatData}}
			  </template>
			</el-table-column>
			<el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[0].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="top100ProdReviewCnt" label-class-name="col-column" label="总评价数" width="100" :render-header="handleHelp4" min-width="100px">				
				<template slot-scope="scope" >
					<span v-if="scope.row.top100ProdReviewCnt" style="color:#108ee9;cursor: pointer;" @click="tableMethod(scope,3)">{{scope.row.top100ProdReviewCnt}}</span>
					<span v-else>-</span>
				</template>				
			</el-table-column>
			<el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[0].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="top100ProdNewReviewCntD30" label-class-name="col-column" label="新增评价数" width="110" :render-header="handleHelp" min-width="110px">				
				<template slot-scope="scope" >
					<span v-if="scope.row.top100ProdNewReviewCntD30" style="color:#108ee9;cursor: pointer;" @click="tableMethod(scope,4)">{{scope.row.top100ProdNewReviewCntD30}}</span>
					<span v-else>-</span>
				</template>				
			</el-table-column>
			
      <!-- 亚马逊类目分析top1-20产品 -->
      <!-- TOP1产品 -->
      <el-table-column label="TOP1产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[1].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[1].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl1" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl1&&scope.row.productUrl1!==null&&scope.row.productUrl1!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl1&&scope.row.productUrl1!==null&&scope.row.productUrl1!==''?scope.row.productUrl1:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl1" :key="scope.row.imageUrl1" v-lazy="scope.row.imageUrl1?scope.row.imageUrl1:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[1].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price1" label="价格">
          <template slot-scope="scope">
            {{scope.row.price1 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[1].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank1" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank1 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP2产品 -->
      <el-table-column label="TOP2产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[2].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[2].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl2" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl2&&scope.row.productUrl2!==null&&scope.row.productUrl2!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl2&&scope.row.productUrl2!==null&&scope.row.productUrl2!==''?scope.row.productUrl2:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl2" :key="scope.row.imageUrl2" v-lazy="scope.row.imageUrl2?scope.row.imageUrl2:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[2].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price2" label="价格">
          <template slot-scope="scope">
            {{scope.row.price2 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[2].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank2" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank2 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP3产品 -->
      <el-table-column label="TOP3产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[3].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[3].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl3" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl3&&scope.row.productUrl3!==null&&scope.row.productUrl3!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl3&&scope.row.productUrl3!==null&&scope.row.productUrl3!==''?scope.row.productUrl3:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl3" :key="scope.row.imageUrl3" v-lazy="scope.row.imageUrl3?scope.row.imageUrl3:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[3].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price3" label="价格">
          <template slot-scope="scope">
            {{scope.row.price3 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[3].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank3" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank3 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP4产品 -->
      <el-table-column label="TOP4产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[4].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[4].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl4" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl4&&scope.row.productUrl4!==null&&scope.row.productUrl4!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl4&&scope.row.productUrl4!==null&&scope.row.productUrl4!==''?scope.row.productUrl4:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl4" :key="scope.row.imageUrl4" v-lazy="scope.row.imageUrl4?scope.row.imageUrl4:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[4].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price4" label="价格">
          <template slot-scope="scope">
            {{scope.row.price4 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[4].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank4" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank4 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP5产品 -->
      <el-table-column label="TOP5产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[5].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[5].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl5" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <div class="__img_wrapper" slot="reference">
                  <a class="fix__row_2 common_color" v-if="scope.row.productUrl5&&scope.row.productUrl5!==null&&scope.row.productUrl5!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl5&&scope.row.productUrl5!==null&&scope.row.productUrl5!==''?scope.row.productUrl5:false" style="text-decoration:none;">
                    <img class="loadingImg" v-if="scope.row.imageUrl5" :key="scope.row.imageUrl5" v-lazy="scope.row.imageUrl5?scope.row.imageUrl5:'-'">
                  </a>
                </div>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[5].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price5" label="价格">
          <template slot-scope="scope">
            {{scope.row.price5 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[5].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank5" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank5 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP6产品 -->
      <el-table-column label="TOP6产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[6].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[6].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl6" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl6&&scope.row.productUrl6!==null&&scope.row.productUrl6!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl6&&scope.row.productUrl6!==null&&scope.row.productUrl6!==''?scope.row.productUrl6:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl6" :key="scope.row.imageUrl6" v-lazy="scope.row.imageUrl6?scope.row.imageUrl6:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[6].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price6" label="价格">
          <template slot-scope="scope">
            {{scope.row.price6 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[6].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank6" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank6 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP7产品 -->
      <el-table-column label="TOP7产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[7].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[7].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl7" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl7&&scope.row.productUrl7!==null&&scope.row.productUrl7!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl7&&scope.row.productUrl7!==null&&scope.row.productUrl7!==''?scope.row.productUrl7:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl7" :key="scope.row.imageUrl7" v-lazy="scope.row.imageUrl7?scope.row.imageUrl7:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[7].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price7" label="价格">
          <template slot-scope="scope">
            {{scope.row.price7 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[7].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank7" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank7 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP8产品 -->
      <el-table-column label="TOP8产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[8].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[8].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl8" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl8&&scope.row.productUrl8!==null&&scope.row.productUrl8!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl8&&scope.row.productUrl8!==null&&scope.row.productUrl8!==''?scope.row.productUrl8:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl8" :key="scope.row.imageUrl8" v-lazy="scope.row.imageUrl8?scope.row.imageUrl8:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[8].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price8" label="价格">
          <template slot-scope="scope">
            {{scope.row.price8 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[8].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank8" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank8 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP9产品 -->
      <el-table-column label="TOP9产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[9].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[9].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl9" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl9&&scope.row.productUrl9!==null&&scope.row.productUrl9!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl9&&scope.row.productUrl9!==null&&scope.row.productUrl9!==''?scope.row.productUrl9:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl9" :key="scope.row.imageUrl9" v-lazy="scope.row.imageUrl9?scope.row.imageUrl9:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[9].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price9" label="价格">
          <template slot-scope="scope">
            {{scope.row.price9 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[9].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank9" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank9 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP10产品 -->
      <el-table-column label="TOP10产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[10].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[10].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl10" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl10&&scope.row.productUrl10!==null&&scope.row.productUrl10!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl10&&scope.row.productUrl10!==null&&scope.row.productUrl10!==''?scope.row.productUrl10:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl10" :key="scope.row.imageUrl10" v-lazy="scope.row.imageUrl10?scope.row.imageUrl10:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[10].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price10" label="价格">
          <template slot-scope="scope">
            {{scope.row.price10 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[10].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank10" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank10 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP11产品 -->
      <el-table-column label="TOP11产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[11].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[11].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl11" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl11&&scope.row.productUrl11!==null&&scope.row.productUrl11!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl11&&scope.row.productUrl11!==null&&scope.row.productUrl11!==''?scope.row.productUrl11:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl11" :key="scope.row.imageUrl11" v-lazy="scope.row.imageUrl11?scope.row.imageUrl11:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[11].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price11" label="价格">
          <template slot-scope="scope">
            {{scope.row.price11 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[11].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank11" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank11 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- ASIN -->
      <el-table-column v-if="table.show.relateSku" prop="relateSku" label="关联ASIN">
        <template slot-scope="scope">
          <!-- {{scope.row.sku?scope.row.relateSku:"-"}} -->
          <a target="_blank" :href='scope.row.relateProductUrl' style="text-decoration:none;color:#108ee9;">
              {{scope.row.relateSku?scope.row.relateSku:"-"}}
          </a>
        </template>
      </el-table-column>
      <!-- TOP12产品 -->
      <el-table-column label="TOP12产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[12].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[12].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl12" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl12&&scope.row.productUrl12!==null&&scope.row.productUrl12!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl12&&scope.row.productUrl12!==null&&scope.row.productUrl12!==''?scope.row.productUrl12:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl12" :key="scope.row.imageUrl12" v-lazy="scope.row.imageUrl12?scope.row.imageUrl12:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[12].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price12" label="价格">
          <template slot-scope="scope">
            {{scope.row.price12 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[12].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank12" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank12 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP13产品 -->
      <el-table-column label="TOP13产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[13].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[13].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl13" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl13&&scope.row.productUrl13!==null&&scope.row.productUrl13!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl13&&scope.row.productUrl13!==null&&scope.row.productUrl13!==''?scope.row.productUrl13:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl13" :key="scope.row.imageUrl13" v-lazy="scope.row.imageUrl13?scope.row.imageUrl13:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[13].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price13" label="价格">
          <template slot-scope="scope">
            {{scope.row.price13 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[13].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank13" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank13 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP14产品 -->
      <el-table-column label="TOP14产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[14].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[14].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl14" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl14&&scope.row.productUrl14!==null&&scope.row.productUrl14!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl14&&scope.row.productUrl14!==null&&scope.row.productUrl14!==''?scope.row.productUrl14:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl14" :key="scope.row.imageUrl14" v-lazy="scope.row.imageUrl14?scope.row.imageUrl14:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[14].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price14" label="价格">
          <template slot-scope="scope">
            {{scope.row.price14 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[14].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank14" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank14 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP15产品 -->
      <el-table-column label="TOP15产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[15].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[15].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl15" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl15&&scope.row.productUrl15!==null&&scope.row.productUrl15!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl15&&scope.row.productUrl15!==null&&scope.row.productUrl15!==''?scope.row.productUrl15:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl15" :key="scope.row.imageUrl15" v-lazy="scope.row.imageUrl15?scope.row.imageUrl15:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[15].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price15" label="价格">
          <template slot-scope="scope">
            {{scope.row.price15 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[15].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank15" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank15 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP16产品 -->
      <el-table-column label="TOP16产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[16].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[16].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl16" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl16&&scope.row.productUrl16!==null&&scope.row.productUrl16!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl16&&scope.row.productUrl16!==null&&scope.row.productUrl16!==''?scope.row.productUrl16:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl16" :key="scope.row.imageUrl16" v-lazy="scope.row.imageUrl16?scope.row.imageUrl16:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[16].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price16" label="价格">
          <template slot-scope="scope">
            {{scope.row.price16 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[16].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank16" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank16 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP17产品 -->
      <el-table-column label="TOP17产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[17].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[17].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl17" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl17&&scope.row.productUrl17!==null&&scope.row.productUrl17!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl17&&scope.row.productUrl17!==null&&scope.row.productUrl17!==''?scope.row.productUrl17:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl17" :key="scope.row.imageUrl17" v-lazy="scope.row.imageUrl17?scope.row.imageUrl17:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[17].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price17" label="价格">
          <template slot-scope="scope">
            {{scope.row.price17 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[17].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank17" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank17 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP18产品 -->
      <el-table-column label="TOP18产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[18].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[18].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl18" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl18&&scope.row.productUrl18!==null&&scope.row.productUrl18!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl18&&scope.row.productUrl18!==null&&scope.row.productUrl18!==''?scope.row.productUrl18:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl18" :key="scope.row.imageUrl18" v-lazy="scope.row.imageUrl18?scope.row.imageUrl18:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[18].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price18" label="价格">
          <template slot-scope="scope">
            {{scope.row.price18 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[18].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank18" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank18 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP19产品 -->
      <el-table-column label="TOP19产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[19].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[19].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl19" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl19&&scope.row.productUrl19!==null&&scope.row.productUrl19!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl19&&scope.row.productUrl19!==null&&scope.row.productUrl19!==''?scope.row.productUrl19:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl19" :key="scope.row.imageUrl19" v-lazy="scope.row.imageUrl19?scope.row.imageUrl19:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[19].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price19" label="价格">
          <template slot-scope="scope">
            {{scope.row.price19 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[19].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank19" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank19 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP20产品 -->
      <el-table-column label="TOP20产品" v-if="table.show.tableSelecty&&table.show.tableSelecty[20].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[20].selected.indexOf('ya')!==-1?true:false" prop="araSearches" label="主图" width="80px">
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl20" class="big__" />
              <div class="__img_wrapper" slot="reference">
                <a class="fix__row_2 common_color" v-if="scope.row.productUrl20&&scope.row.productUrl20!==null&&scope.row.productUrl20!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.productUrl20&&scope.row.productUrl20!==null&&scope.row.productUrl20!==''?scope.row.productUrl20:false" style="text-decoration:none;">
                  <img class="loadingImg" v-if="scope.row.imageUrl20" :key="scope.row.imageUrl20" v-lazy="scope.row.imageUrl20?scope.row.imageUrl20:'-'">
                </a>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[20].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="price20" label="价格">
          <template slot-scope="scope">
            {{scope.row.price20 | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[20].selected.indexOf('yc')!==-1?true:false" sortable='custom' prop="rank20" label="BSR">
          <template slot-scope="scope">
            {{scope.row.rank20 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP1品牌 -->
      <el-table-column label="TOP1品牌" v-if="table.show.tableSelecty&&table.show.tableSelecty[21].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[21].selected.indexOf('ya')!==-1?true:false" sortable='custom' prop="brand1" label="名称">
          <template slot-scope="scope">
            <div class="fix__row_1" v-if="scope.row.brand1 === '' || scope.row.brand1 == null">{{scope.row.brand1
              || "-"}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.brand1" effect="light">
              <div class="fix__row_1">
                <span>{{ scope.row.brand1!=""?scope.row.brand1:""}}
                </span>
              </div>
            </el-tooltip>
          </template>
          <!-- <template slot-scope="scope">
            {{scope.row.brand1 | _formatData}}
          </template> -->

        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[21].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="brandProductCnt1" label="产品数" min-width="90px">
          <template slot-scope="scope">
            {{scope.row.brandProductCnt1 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP2品牌 -->
      <el-table-column label="TOP2品牌" v-if="table.show.tableSelecty&&table.show.tableSelecty[22].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[22].selected.indexOf('ya')!==-1?true:false" sortable='custom' prop="brand2" label="名称">
          <template slot-scope="scope">
            <div class="fix__row_1" v-if="scope.row.brand2 === '' || scope.row.brand2 == null">{{scope.row.brand2
              || "-"}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.brand2" effect="light">
              <div class="fix__row_1">
                <span>{{ scope.row.brand2!=""?scope.row.brand2:""}}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[22].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="brandProductCnt2" label="产品数"  min-width="90px">
          <template slot-scope="scope">
            {{scope.row.brandProductCnt2 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP3品牌 -->
      <el-table-column label="TOP3品牌" v-if="table.show.tableSelecty&&table.show.tableSelecty[23].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[23].selected.indexOf('ya')!==-1?true:false" sortable='custom' prop="brand3" label="名称">
          <template slot-scope="scope">
            <div class="fix__row_1" v-if="scope.row.brand3 === '' || scope.row.brand3 == null">{{scope.row.brand3
              || "-"}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.brand3" effect="light">
              <div class="fix__row_1">
                <span>{{ scope.row.brand3!=""?scope.row.brand3:""}}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[23].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="brandProductCnt3" label="产品数"  min-width="90px">
          <template slot-scope="scope">
            {{scope.row.brandProductCnt3 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP4品牌 -->
      <el-table-column label="TOP4品牌" v-if="table.show.tableSelecty&&table.show.tableSelecty[24].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[24].selected.indexOf('ya')!==-1?true:false" sortable='custom' prop="brand4" label="名称">
          <template slot-scope="scope">
            <div class="fix__row_1" v-if="scope.row.brand4 === '' || scope.row.brand4 == null">{{scope.row.brand4
              || "-"}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.brand4" effect="light">
              <div class="fix__row_1">
                <span>{{ scope.row.brand4!=""?scope.row.brand4:""}}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[24].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="brandProductCnt4" label="产品数" min-width="90px">
          <template slot-scope="scope">
            {{scope.row.brandProductCnt4 | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- TOP5品牌 -->
      <el-table-column label="TOP5品牌" v-if="table.show.tableSelecty&&table.show.tableSelecty[25].selected.length>0?true:false" align="center">
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[25].selected.indexOf('ya')!==-1?true:false" sortable='custom' prop="brand5" label="名称">
          <template slot-scope="scope">
            <div class="fix__row_1" v-if="scope.row.brand5 === '' || scope.row.brand5 == null">{{scope.row.brand5
              || "-"}}</div>
            <el-tooltip v-else placement="top" :content="scope.row.brand5" effect="light">
              <div class="fix__row_1">
                <span>{{ scope.row.brand5!=""?scope.row.brand5:""}}
                </span>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelecty&&table.show.tableSelecty[25].selected.indexOf('yb')!==-1?true:false" sortable='custom' prop="brandProductCnt5" label="产品数" min-width="90px">
          <template slot-scope="scope">
            {{scope.row.brandProductCnt5 | _formatData}}
          </template>
        </el-table-column>
		
      </el-table-column>
	  
	  
	  
	  
	  
	  <el-table-column v-if="table.show.imageUrl_RQ" prop="relateImageUrl" label="关联图" width="80px">
	    <template slot-scope="scope">
	      <el-popover placement="right" title="" trigger="hover">
	        <img :src="scope.row.relateImageUrl" class="big__" />
	        <div class="__img_wrapper" slot="reference">
	          <img class="loadingImg" v-if="scope.row.relateImageUrl" :key="scope.row.relateImageUrl" v-lazy="scope.row.relateImageUrl?scope.row.relateImageUrl:'-'">
	        </div>
	      </el-popover>
	    </template>
	  </el-table-column>
		<el-table-column v-if="table.show.imageUrl_RQ1" prop="imageUrl" label="主图" width="80px">
		  <template slot-scope="scope">
		    <el-popover placement="right" title="" trigger="hover">
		      <img :src="scope.row.imageUrl" class="big__" />
		      <div class="__img_wrapper" slot="reference">
		        <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
		      </div>
		    </el-popover>
		  </template>
		</el-table-column>
      <!-- ASIN -->
      <!-- <el-table-column v-if="table.show.relateSku" prop="relateSku" label="关联">
                <template slot-scope="scope">
                    {{scope.row.sku?scope.row.relateSku:"-"}}
                </template>
            </el-table-column> -->
      <!-- 关联ASIN -->
      <el-table-column v-if="table.show.sku" prop="sku" label="ASIN">
        <template slot-scope="scope">
			<a target="_blank" :href='scope.row.productUrl' style="text-decoration:none;color:#108ee9;">
          {{scope.row.sku?scope.row.sku:"-"}}
		  </a>
        </template>
      </el-table-column>
		<el-table-column v-if="table.show.imageUrl_RQ2" prop="imageUrl" label="主图" width="80px">
		  <template slot-scope="scope">
			<el-popover placement="right" title="" trigger="hover">
			  <img :src="scope.row.imageUrl" class="big__" />
			  <div class="__img_wrapper" slot="reference">
				<img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
			  </div>
			</el-popover>
		  </template>
		</el-table-column>
      <!-- 标题 -->
      <el-table-column v-if="table.show.title" prop="title" label="标题">
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title?scope.row.title:'-'}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.title" effect="light"> 
            <div>
              <span class="aLink fix__row_1" style="text-decoration:none;">
                {{ scope.row.title?scope.row.title:'-'}}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 标题 -->
      <el-table-column v-if="table.show.productName2" prop="productName" label="标题">
        <template slot-scope="scope">
          <div class="fix__row_2" v-if="scope.row.productName === '' || scope.row.productName == null">{{scope.row.productName?scope.row.productName:'-'}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.productName" effect="light">
            <div>
              <span class="aLink fix__row_2" style="text-decoration:none;">
                {{ scope.row.productName?scope.row.productName:'-'}}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 来源 -->
      <el-table-column v-if="table.show.platformName" prop="platformName" label="来源">
        <template slot-scope="scope">
          {{scope.row.platformName||'-'}}
        </template>
      </el-table-column>
      <!-- 源关键词、产品ID -->
      <el-table-column v-if="table.show.keywordSrc" prop="keywordSrc" :label="keyName" width="350">
        <template slot-scope="scope">
          {{scope.row.keywordSrc?scope.row.keywordSrc:"-"}}
        </template>
      </el-table-column>
      <!-- 关键词 -->
      <el-table-column v-if="table.show.keyword" prop="keyword" label="关键词"  width="600">
        <template slot-scope="scope">
          {{scope.row.keyword?scope.row.keyword:"-"}}
        </template>
      </el-table-column>
      <!-- 类型 -->
      <el-table-column v-if="table.show.keywordType" prop="keywordType" label="类型" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.keywordType=='0'">相关词 &nbsp;</span>
          <span v-if="scope.row.keywordType=='1'">下拉词 &nbsp;</span>
          <span v-if="scope.row.keywordType=='2'">联想词 &nbsp;</span>
          <span v-if="scope.row.keywordType=='3'">TAG词 &nbsp;</span>
          <span v-if="scope.row.keywordType=='4'">AdWords &nbsp;</span>
          <span v-if="scope.row.keywordType=='-1'">-</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.keywordSrc1" prop="originKeywords" label="源关键词" width="150">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.originKeywords.length>0" v-else placement="top" :content="scope.row.originKeywords.join(' , ')" effect="light">
            <div class="fix__row_2">
              <span v-for="item in scope.row.originKeywords">
                {{item}}</br>
              </span>
            </div>
          </el-tooltip>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- 类型多个 -->
      <el-table-column v-if="table.show.keywordTypes" label="类型">
        <template slot-scope="scope">
          <template v-for="item in scope.row.keywordTypes">
            <span v-if="item=='0'">相关词 &nbsp;&nbsp;</span>
            <span v-if="item=='1'">下拉词 &nbsp;&nbsp;</span>
            <span v-if="item=='2'">联想词 &nbsp;&nbsp;</span>
            <span v-if="item=='3'">Tag词 &nbsp;&nbsp;</span>
            <span v-if="item=='4'">AdWords &nbsp;&nbsp;</span>
            <span v-if="item=='-1'">-</span>
          </template>
        </template>
      </el-table-column>
      <!-- 深度 -->
      <el-table-column v-if="table.show.depth" sortable='custom' prop="depth" label="深度" min-width="150">
        <template slot-scope="scope">
          {{scope.row.keywordType==2||scope.row.keywordType==3||scope.row.keywordType==4?"-":scope.row.depth==""?"-":scope.row.depth}}
        </template>
      </el-table-column>
      <!-- 抓取状态 -->
      <el-table-column v-if="table.show.status" prop="status" label="抓取状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='0'">抓取中</span>
          <span v-if="scope.row.status=='1'">抓取中</span>
          <span v-if="scope.row.status=='2'">抓取成功</span>
          <span v-if="scope.row.status>=3">抓取失败</span>
        </template>
      </el-table-column>
      <!-- 监控状态 -->
      <el-table-column v-if="table.show.monitorFlag" label="监控状态" width="80px">
        <template slot-scope="scope">
          {{ scope.row.monitorFlag==0?"关闭":scope.row.monitorFlag==1?"开启":'' }}
        </template>
      </el-table-column>
      <!-- 监控频率 -->
      <el-table-column v-if="table.show.frequency" prop="frequency" label="监控频率">
        <template slot-scope="scope">
          <span v-if="scope.row.frequency">{{scope.row.frequency}}分钟/次</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- 创始时间 -->
      <el-table-column v-if="table.show.createTime" prop="createTime" label="创建时间">
      </el-table-column>
      <!-- 监控起始时间 -->
      <el-table-column v-if="table.show.monitorFrom" prop="monitorFrom" label="监控起始时间">
        <template slot-scope="scope">
          {{scope.row.monitorFrom || "-"}}
        </template>
      </el-table-column>
      <!-- 监控结束时间 -->
      <el-table-column v-if="table.show.monitorTo" prop="monitorTo" label="监控结束时间">
        <template slot-scope="scope">
          {{scope.row.monitorTo || "-"}}
        </template>
      </el-table-column>
      <!-- 结果生成时间 -->
      <el-table-column v-if="table.show.resultTime" prop="resultTime" label="结果生成时间">
        <template slot-scope="scope">
          {{scope.row.resultTime || "-"}}
        </template>
      </el-table-column>
      <!-- 关键词 todo bug  编号3981-->
      <el-table-column v-if="table.show.keyword2" prop="keyword" label="关键词" width="250">
        <template slot-scope="scope">
          <div class="fix__row_1" v-if="scope.row.keyword === '' || scope.row.keyword == null">{{scope.row.keyword
            || "-"}}</div>
          <el-tooltip v-else placement="top" :content="scope.row.keyword" effect="light">
            <div class="fix__row_1">
              <span>{{ scope.row.keyword!=""?scope.row.keyword:""}}
              </span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[2].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="googleSearches" label="Google搜索量" min-width="130">
        <template slot-scope="scope">
          {{scope.row.googleSearches | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[2].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="amazonProducts" label="产品数"  min-width="90">
        <template slot-scope="scope">
          {{scope.row.amazonProducts | _formatData}}
        </template>
      </el-table-column>
      <!-- ARA数据 -->
      <el-table-column label="ARA数据" v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.length>0?true:false">
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="araSearches" label="搜索量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.araSearches | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="araOrders" label="订单量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.araOrders | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="araHits" label="点击量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.araHits | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="araCarts" label="加购量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.araCarts | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="araConversionRates" label="转化率" min-width="90">
          <template slot-scope="scope">
            {{scope.row.araConversionRates | _formatRate}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[0].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="araClickRates" label="点击率" min-width="90">
          <template slot-scope="scope">
            {{scope.row.araClickRates | _formatRate}}
          </template>
        </el-table-column>
      </el-table-column>
      <!-- 广告数据 -->
      <el-table-column label="广告数据" v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.length>0?true:false">
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('a')!==-1?true:false" sortable='custom' prop="advertExposure" label="曝光量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertExposure | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('b')!==-1?true:false" sortable='custom' prop="advertOrders" label="订单量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertOrders | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('c')!==-1?true:false" sortable='custom' prop="advertHits" label="点击量" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertHits | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('d')!==-1?true:false" sortable='custom' prop="advertConversionRates" label="转化率" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertConversionRates | _formatRate}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('e')!==-1?true:false" sortable='custom' prop="advertClickRates" label="点击率" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertClickRates | _formatRate}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('f')!==-1?true:false" sortable='custom' prop="advertCpc" label="CPC" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertCpc | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('g')!==-1?true:false" sortable='custom' prop="advertCost" label="花费" min-width="80">
          <template slot-scope="scope">
            {{scope.row.advertCost | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('h')!==-1?true:false" sortable='custom' prop="advertCost" label="销售总额" min-width="110">
          <template slot-scope="scope">
            {{scope.row.advertCost | _formatData}}
          </template>
        </el-table-column>
        <el-table-column v-if="table.show.tableSelect&&table.show.tableSelect[1].selected.indexOf('i')!==-1?true:false" sortable='custom' prop="advertAcos" label="ACOS" min-width="90">
          <template slot-scope="scope">
            {{scope.row.advertAcos | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column v-if="table.show.sellerName" prop="sellerName" label="卖家名称">
        <template slot-scope="scope">
          {{scope.row.sellerName | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sellerName1" prop="sellerName" label="卖家名称">
        <template slot-scope="scope">
          <a class="common_color" v-if="scope.row.sellerUrl&&scope.row.sellerUrl!==null&&scope.row.sellerUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl&&scope.row.sellerUrl!==null&&scope.row.sellerUrl!==''?scope.row.sellerUrl:false" style="text-decoration:none;">
            <span>{{scope.row.sellerName | _formatData}}</span>
          </a>
          <span v-else>{{scope.row.sellerName | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sellerName2" prop="sellerName" label="卖家名称">
        <template slot-scope="scope">
          <a class="common_color" v-if="scope.row.sellerUrl&&scope.row.sellerUrl!==null&&scope.row.sellerUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl&&scope.row.sellerUrl!==null&&scope.row.sellerUrl!==''?scope.row.sellerUrl:false" style="text-decoration:none;">
            <span>{{scope.row.sellerName | _formatData}}</span>
          </a>
          <span v-else>{{scope.row.sellerName | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.productCnt" sortable='custom' prop="productCnt" label="产品数">
        <template slot-scope="scope">
          {{scope.row.productCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbsProductCnt" sortable='custom' prop="fbsProductCnt" label="FBS产品数">
        <template slot-scope="scope">
          {{scope.row.fbsProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbmProductCnt" sortable='custom' prop="fbmProductCnt" label="自发货产品数">
        <template slot-scope="scope">
          {{scope.row.fbmProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbaProductCnt" sortable='custom' prop="fbaProductCnt" label="FBA产品数">
        <template slot-scope="scope">
          {{scope.row.fbaProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbaProductRate" sortable='custom' prop="fbaProductRate" label="FBA产品数占比">
        <template slot-scope="scope">
          {{scope.row.fbaProductRate | _formatRate2}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbmProductCnt_text" sortable='custom' prop="fbmProductCnt" label="FBM产品数">
        <template slot-scope="scope">
          {{scope.row.fbmProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.fbmProductRate" sortable='custom' prop="fbmProductRate" label="FBM产品数占比">
        <template slot-scope="scope">
          {{scope.row.fbmProductRate | _formatRate2}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.salesProductCnt" sortable='custom' prop="salesProductCnt" label="有跟卖产品数">
        <template slot-scope="scope">
          {{scope.row.salesProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.salesProductRate" sortable='custom' prop="salesProductRate" label="有跟卖产品数占比">
        <template slot-scope="scope">
          {{scope.row.salesProductRate | _formatRate2}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.noSalesProductCnt" sortable='custom' prop="noSalesProductCnt" label="无跟卖产品数">
        <template slot-scope="scope">
          {{scope.row.noSalesProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.noSalesProductRate" sortable='custom' prop="noSalesProductRate" label="无跟卖产品数占比">
        <template slot-scope="scope">
          {{scope.row.noSalesProductRate | _formatRate2}}
        </template>
      </el-table-column>
      <!-- 自定义表头 -->
      <el-table-column v-if="table.show.monthNewProductCnt" prop="monthNewProductCnt" label="每月上新数" width="160" align="center">
        <template slot="header" slot-scope="scope">
          <span style="margin-left:10px;">每月上新数</span>
          <el-date-picker unlink-panels :style="{width:DateMsg.width}" value-format='yyyy-MM' v-model="DateMsg.DateValue" @change="changeTime($event,scope)" :type="DateMsg.type" placeholder="选择年月" :clearable="true" size="mini">
          </el-date-picker>
        </template>
        <template slot-scope="scope">
          {{scope.row.monthNewProductCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.top10ProdNewReviewCnt" sortable='custom' prop="top10ProdNewReviewCnt" label="日新增评价数">
        <template slot-scope="scope">
          {{scope.row.top10ProdNewReviewCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.brandCnt" sortable='custom' prop="brandCnt" label="品牌数">
        <template slot-scope="scope">
          {{scope.row.brandCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.positiveRate" sortable='custom' prop="positiveRate" label="好评率">
        <template slot-scope="scope">
          {{scope.row.positiveRate | _formatRate}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.newFeedbackCntD30" sortable='custom' prop="newFeedbackCntD30" :label="table.show.newFeedbackCntD30_label||'月新增评价数'">
        <template slot-scope="scope">
          {{scope.row.newFeedbackCntD30 | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.newFeedbackCntD90" sortable='custom' prop="newFeedbackCntD90" label="90天新增评价数">
        <template slot-scope="scope">
          {{scope.row.newFeedbackCntD90 | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.feedbackCnt" sortable='custom' prop="feedbackCnt" label="总评价数">
        <template slot-scope="scope">
          {{scope.row.feedbackCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.openTime" sortable='custom' prop="openTime" label="开店时间">
        <template slot-scope="scope">
          {{scope.row.openTime?scope.row.openTime.slice(0,10):'' | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.categoryCnt" sortable='custom' prop="categoryCnt" label="类目数">
        <template slot-scope="scope">
          <span v-if="scope.row.categoryCnt" style="cursor:pointer;" class="common__color" @click='showCate__(scope.row)'>
            {{scope.row.categoryCnt | _formatData}}</span>
          <span v-else> {{scope.row.categoryCnt | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.categoryCntAmazon" sortable='custom' prop="categoryCnt" label="类目数">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.categoryCnt>0&&scope.row.categoryCnt<10" style="cursor:pointer;" class="common__color" @click='showCate__(scope.row)'> {{scope.row.categoryCnt | _formatData}}</span>
                    <span v-if="scope.row.categoryCnt>=10">{{scope.row.categoryCnt | _formatData}}</span> -->
          <span v-if="scope.row.categoryCnt" style="cursor:pointer;" class="common__color" @click='showCate__(scope.row)'>
            {{scope.row.categoryCnt | _formatData}}</span>
          <span v-else> {{scope.row.categoryCnt | _formatData}}</span>
        </template>
      </el-table-column>
      <!-- 广告优化 -->
      <el-table-column v-if="table.show.campaignName" prop="campaignName" label="广告系列">
        <template slot-scope="scope">
          {{scope.row.campaignName | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.keywordText" prop="keywordText" label="关键词">
        <template slot-scope="scope">
          {{scope.row.keywordText | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertExposure" prop="advertExposure" label="曝光量">
        <template slot-scope="scope">
          {{scope.row.advertExposure | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertHits" prop="advertHits" label="点击量">
        <template slot-scope="scope">
          {{scope.row.advertHits | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertOrders" prop="advertOrders" label="订单量">
        <template slot-scope="scope">
          {{scope.row.advertOrders | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.conversionRates" prop="conversionRates" label="转化率">
        <template slot-scope="scope">
          {{scope.row.conversionRates | _formatRate2}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertCpc" prop="advertCpc" label="CPC">
        <template slot-scope="scope">
          {{scope.row.advertCpc | _formatRate2}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertAcos" prop="advertAcos" label="ACOS">
        <template slot-scope="scope">
          {{scope.row.advertAcos | _formatRate2}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertCost" prop="advertCost" label="花费">
        <template slot-scope="scope">
          {{scope.row.advertCost | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.advertSales" prop="advertSales" label="广告销售总额">
        <template slot-scope="scope">
          {{scope.row.advertSales | __formatFlagM}}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column v-if="table.show.Handle" prop="handle" label="操作">
        <template slot-scope="scope">
         
          <!-- <el-tooltip class="item" effect="light" content="编辑" placement="top-start" :enterable="false">
                        <el-button v-if="table.show.Handle.edit1&&scope.row.status==2" class="__icon" type="text" icon="el-icon-edit-outline" @click="edit__(scope.row)"></el-button>
                    </el-tooltip> -->
          <el-tooltip class="item" effect="light" content="添加" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.add" class="__icon" type="text" icon="el-icon-circle-plus-outline" @click="add__(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="查看" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.check&&scope.row.status===2" class="__icon" type="text" icon="el-icon-search" @click="check__(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="查看" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.showChart" class="__icon" type="text" icon="el-icon-search" @click="draw__(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="查看" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.reviewItem" class="__icon" type="text" icon="el-icon-search" @click="draw__(scope.row)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="light" content="下载报告" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.showEchart__" class="__icon" type="text" icon="el-icon-download" @click="showEchart__(scope.row)"></el-button>
          </el-tooltip>
      
          <el-tooltip class="item" effect="light" content="重新抓取" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.refresh&&scope.row.status>=3" class="__icon" type="text" icon="el-icon-refresh" @click="refresh__(scope.row)"></el-button>
          </el-tooltip>
		  
          <el-tooltip class="item" effect="light" content="重新抓取" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.refreshItem&&scope.row.status!=1" class="__icon" type="text" icon="el-icon-refresh" @click="refresh__item(scope.row)"></el-button>
          </el-tooltip>

           <el-tooltip class="item" effect="light" content="编辑" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.edit" class="__icon" type="text" icon="el-icon-edit-outline" @click="edit__(scope.row)"></el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="light" content="删除" placement="top-start" :enterable="false">
            <el-button v-if="table.show.Handle.delete" class="__icon" type="text" icon="el-icon-delete" @click="delete__(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="链接" placement="top-start" :enterable="false">
            <a v-if="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.url&&scope.row.url!==null&&scope.row.url!==''?scope.row.url:false" style="text-decoration:none;">
              <!-- <i v-if="table.show.Handle.link" class="iconfont icon-Group-"></i> -->
              <el-button v-if="table.show.Handle.link" icon="iconfont icon-Group-" type="text">
            </el-button>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 城市 州 -->
      <el-table-column v-if="table.show.countryCode" prop="countryCode" label="国家">
        <template slot-scope="scope">
          {{scope.row.countryCode | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.state" prop="state" label="州">
        <template slot-scope="scope">
          {{scope.row.state | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.city" prop="city" label="城市">
        <template slot-scope="scope">
          <!-- <span style="cursor:pointer;" class="common__color" @click='showCity__(scope.row)'>{{scope.row.city | _formatData}}</span> -->
          <span>{{scope.row.city | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.customerCnt" prop="customerCnt" label="客户数" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.customerCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.proportion" prop="proportion" label="占比" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.proportion | _formatRate2}}
        </template>
      </el-table-column>
      <!--老客户详情-->
      <el-table-column v-if="table.show.buyerId" prop="buyerId" label="序号" width="80" min-width="0" align="center">
      </el-table-column>
      <el-table-column v-if="table.show.buyerIndex" prop="buyerIndex" label="序号" width="80" min-width="0" align="center">
      </el-table-column>
      <el-table-column v-if="table.show.buyerName" prop="buyerName" label="姓名" >
        <template slot-scope="scope">
          {{scope.row.buyerName | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.buyerEmail" prop="buyerEmail" label="邮箱">
        <template slot-scope="scope">
          {{scope.row.buyerEmail | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.count_" prop="count" label="购买次数" width="120" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.count | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.priceAvg" prop="priceAvg" label="单次购买均价" width="120" sortable="custom">
        <template slot-scope="scope">
          {{"$"+scope.row.priceAvg | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.intervalTime" prop="intervalTime" label="平均间隔时间" width="150" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.intervalTime+"天" | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sellerNameAmazon" prop="sellerName" label="卖家名称">
        <template slot-scope="scope">
          <a class="common_color" v-if="scope.row.sellerUrl&&scope.row.sellerUrl!==null&&scope.row.sellerUrl!==''?true:false" rel="noopener noreferrer nofollow" target="_blank" :href="scope.row.sellerUrl&&scope.row.sellerUrl!==null&&scope.row.sellerUrl!==''?scope.row.sellerUrl:false" style="text-decoration:none;">
            <span>{{scope.row.sellerName | _formatData}}</span>
          </a>
          <span v-else>{{scope.row.sellerName | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sellerSkuCnt" sortable='custom' prop="sellerSkuCnt" label="跟卖子SKU数">
        <template slot-scope="scope">
          {{scope.row.sellerSkuCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sellYourselfFlag" prop="sellYourselfFlag" label="是否自己跟卖自己">
        <template slot-scope="scope">
          {{scope.row.sellYourselfFlag===0?"否":scope.row.fbpFlag===0?"自发货":'FBA'}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.newFeedbackCntD30Amazon" sortable='custom' prop="newFeedbackCntD30" label="店铺新增月Feedback数">
        <template slot-scope="scope">
          {{scope.row.newFeedbackCntD30 | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.productCntAmazon" sortable='custom' prop="productCnt" label="卖家产品数">
        <template slot-scope="scope">
          {{scope.row.productCnt | _formatData}}
        </template>
      </el-table-column>
      <!-- 店铺管理sku详情 -->
      <el-table-column v-if="table.show.cost" prop="amount" sortable='custom' label="费用">
        <template slot-scope="scope">
          {{scope.row.amount | __formatFlagM}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.proportion2" prop="proportion" sortable='custom' label="占比">
        <template slot-scope="scope">
          {{scope.row.proportion | _formatRate2}}
        </template>
      </el-table-column>
      <!-- 产品价格优化-->
      <el-table-column v-if="table.show.imageUrl_POP" prop="imageUrl" label="主图" width="80px">
        <template slot-scope="scope">
          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.imageUrl" class="big__" />
            <div class="__img_wrapper" slot="reference">
              <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.asin_POP" prop="'parentAsin'" label="ASIN" width='120px;'>
        <template slot-scope="scope">
          <span>{{scope.row.parentAsin | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.seoMaxPrice" prop="'seoMaxPrice'" label="最高价">
        <template slot-scope="scope">
          <span>{{scope.row.seoMaxPrice | __formatFlagM}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.seoMinPrice" prop="'asin'" label="最低价">
        <template slot-scope="scope">
          <span>{{scope.row.seoMinPrice | __formatFlagM}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.priceRange" prop="'asin'" label="改价幅度">
        <template slot-scope="scope">
          <span>{{scope.row.priceRange | __formatFlagM}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.priceFrequency" prop="'asin'" label="改价频率">
        <template slot-scope="scope">
          <span>{{scope.row.priceFrequency?scope.row.priceFrequency+'分':'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.lowestSalesAsin" prop="'asin'" label="区间最低价ASIN" width='150'>
        <template slot-scope="scope">
          <span>{{scope.row.lowestSalesAsin | _formatData}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.intervalMinPrice" prop="'asin'" label="区间最低价" width='100'>
        <template slot-scope="scope">
          <span>{{scope.row.intervalMinPrice | __formatFlagM}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.sameParentAsins" prop="'asin'" label="同款asin" width='120px;'>
        <template slot-scope="scope">
          <span v-if="scope.row.sameParentAsins" class="__pointer common_color" style="padding:4px 15px;" @click="show1__(scope.row)">{{scope.row.sameParentAsins.length}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.newProductFlag" prop="'asin'" label="是否新品">
        <template slot-scope="scope">
          <span>{{scope.row.newProductFlag?scope.row.refParentAsin:'否'}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.stageNo" prop="'asin'" label="当前执行阶段" width='150'>
        <template slot-scope="scope">
          <span v-if="scope.row.stageNo" class="__pointer common_color" style="padding:4px 15px;" 
          @click="show2__(scope.row)">{{scope.row.stageNo===-1 ?'已暂停':scope.row.stageNo===0 ? '未开始' : scope.row.stageNo===-2 ? '今日优化结束': scope.row.stageNo}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.primarySkuProportion" prop="'asin'" label="主要成交SKU百分比" width='150'>
        <template slot-scope="scope">
          <span>{{scope.row.primarySkuProportion | _formatRate2}}</span>
        </template>
      </el-table-column>
      <!-- 设置订单目标查看详情的弹窗列表 -->
      <el-table-column v-if="table.show.otsStarCnt" prop="starCnt" label="评分">
        <template slot-scope="scope">
          {{scope.row.starCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.otsAqCnt" prop="aqCnt" label="AQ数">
        <template slot-scope="scope">
          {{scope.row.aqCnt | _formatData}}
        </template>
      </el-table-column>
      <el-table-column v-if="table.show.otsStars" label="底部评分" align="center">
        <el-table-column label="1星">
          <template slot-scope="scope">
            {{scope.row.bottom1StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column label="2星">
          <template slot-scope="scope">
            {{scope.row.bottom2StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column label="3星">
          <template slot-scope="scope">
            {{scope.row.bottom3StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column label="4星">
          <template slot-scope="scope">
            {{scope.row.bottom4StarCnt | _formatData}}
          </template>
        </el-table-column>
        <el-table-column label="5星">
          <template slot-scope="scope">
            {{scope.row.bottom5StarCnt | _formatData}}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:5px;" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" :page-sizes="[10,20,30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
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
import YtDialog from '@/components/MainLayout/src/dialog.vue'
import Dialog from '@/components/MainLayout/src/dialog.vue'
export default {
  components: {
	  YtDialog,
	  Dialog
  },
  inject: {
    getList: {
      default: null
    },
    draw__: {
      default: null
    },
    edit__: {
      default: null
    },
    showEchart__: {
      default: null
    },
    check__: {
      default: null
    },
    refresh__: {
      default: null
    },
	refresh__item:{
		default:null
	},
    delete__: {
      default: null
    },
    showCate__: {
      default: null
    },
    showCity__: {
      default: () => () => {}
    },
    showBuyBoxSellerCnt__: {
      default: null
    },
    showDetails: {
      default: null
    },
    showDialog: {
      default: null
    },
    show1__: {
      default: null
    },
    show2__: {
      default: null
    }
  },
  props: {
    selection: {
      default: true
    },
    stripe: {
      default: true
    },
    table: {
      type: Object
    },
    pageNumber: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    getShowCateList: {
      default: null
    }
  },
  data() {
    return {
	  innerDialogOpts: {
	    visible: false,
	    size: null,
	    width: null,
	    closeOnClickModal: true,
	    title: null,
	    okBtnText: '',
	    cancelBtnText: ''
	  },
	  dialogComponent: {}, //弹框的组件
	  events: {
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
	            // vm.getList(undefined, res === "reset");
	          }
	        })
	      )
	    }
	  },
	  edits:[],
	  columns:[],
	  TableUrl:'',
	  chinaEvents:{
		  
	  },
      optionsAsinSku: [
        {
          value: "asin",
          label: "ASIN"
        },
        {
          value: "sku",
          label: "SKU"
        }
      ],
      value: "asin",
      sortData: {},
      DateMsg: {
        DateValue: [],
        // DateValue: [this.chartData.date[0], this.chartData.date[1]],
        width: "130px",
        type: "month"
      }
    };
  },
  created() {},
  methods: {
	tableMethod(scope,e){
		switch(e){
			case 1:
				this.$dialog({
					title: "中国品牌",
					width: "800px",
					params: {
					  category:scope.row.category,
					  url:'taskCategoryAnalysisListByCateFbaProdBrand',
					  taskId:this.$route.query.taskId,
					  type:1,
					},
					component: () => import("./common/tableDialog.vue"),				
				})
			break;
			case 2:
				this.$dialog({
					title: "中国品牌产品",
					width:'800px',
					params: {
					  category:scope.row.category,
					  url:'taskCategoryAnalysisListByTop100CnProd',
					  taskId:this.$route.query.taskId,
					  type:2,
					},
					component: () => import("./common/tableDialog.vue"),				
				})
			break;
			case 3:
				this.$dialog({
					title: "TOP100总评价数",
					width:'800px',
					params: {
					  category:scope.row.category,
					  url:'taskCategoryAnalysisListByTop100ReviewCnt',
					  taskId:this.$route.query.taskId,
					  type:3,
					},
					component: () => import("./common/tableDialog.vue"),				
				})
			break;
			case 4:
				this.$dialog({
					title: "TOP100近30天新增评价数",
					width:'800px',
					params: {
					  category:scope.row.category,
					  url:'taskCategoryAnalysisListByTop100ReviewCnt',
					  taskId:this.$route.query.taskId,
					  type:4,
					},
					component: () => import("./common/tableDialog.vue"),				
				})
			break;
		}
	},
	$dialog({
	  title,
	  width,
	  size,
	  component,
	  okBtnText,
	  cancelBtnText,
	  params,
	  appendToBody = false
	}) {
	  component().then(com => {
	    //console.log(com);
	    com.default.inheritAttrs = false
	    this.dialogComponent.component = com.default
	    this.dialogComponent.params = params
	    this.innerDialogOpts.title = title
	    this.innerDialogOpts.visible = true
	    this.innerDialogOpts.width = width
	    this.innerDialogOpts.appendToBody = appendToBody
	    this.innerDialogOpts.size = size
	    this.innerDialogOpts.okBtnText = okBtnText
	    this.innerDialogOpts.cancelBtnText = cancelBtnText
	  })
	},
	handleHelp(h,{column}){
        return(
        <el-tooltip class="tooltip randerTool" 
        effect="light" 
				style="height: 33px;"
        placement="top">
        <div slot="content">
          <div>TOP100近30天新增评价数</div>
        </div>
         <span style={{lineHeight: '32px'}}>
          新增评价数
         </span>
        </el-tooltip>
        )
	},
	handleHelp1(h,{column}){
	    return(
	    <el-tooltip class="tooltip randerTool" 
	    effect="light" 
				style="height: 33px;"
	    placement="top">
	    <div slot="content">
	      <div>FBA产品中国品牌数</div>
	    </div>
	     <span style={{lineHeight: '32px'}}>
	      中国品牌数
	     </span>
	    </el-tooltip>
	    )
	},
	handleHelp2(h,{column}){
	    return(
	    <el-tooltip class="tooltip randerTool" 
	    effect="light" 
				style="height: 33px;"
	    placement="top">
	    <div slot="content">
	      <div>TOP100产品中中国品牌数</div>
	    </div>
	     <span style={{lineHeight: '32px'}}>
	      中国品牌产品数
	     </span>
	    </el-tooltip>
	    )
	},
	handleHelp3(h,{column}){
	    return(
	    <el-tooltip class="tooltip randerTool" 
	    effect="light" 
				style="height: 33px;"
	    placement="top">
	    <div slot="content">
	      <div>FBA卖家总数</div>
	    </div>
	     <span style={{lineHeight: '32px'}}>
	      卖家总数
	     </span>
	    </el-tooltip>
	    )
	},
	handleHelp4(h,{column}){
	    return(
	    <el-tooltip class="tooltip randerTool" 
	    effect="light" 
				style="height: 33px;"
	    placement="top">
	    <div slot="content">
	      <div>TOP100总评价数</div>
	    </div>
	     <span style={{lineHeight: '32px'}}>
	      总评价数
	     </span>
	    </el-tooltip>
	    )
	},
	getWarning(e){
		if(e){
			let e1 = e.split(' ')[0]
			return e1
		}else{
			return '-'
		}
	},
    changeTime(val, scope) {
      let arg = {
        pageSize: 10,
        pageNumber: 1
      };
      if (!val) {
        this.getShowCateList();
        return;
      }
      arg.monthTime = val;
      // 有日期则往下走
      this.getShowCateList(arg);
    },
    // renderHeader(h, params) {
    //   console.log(params, "params");
    //   return h("span", [
    //     h("span", params.column.label),
    //     h("el-date-picker", {
    //       props: {
    //         type: "month",
    //         nativeOn: {
    //           click: null
    //         }
    //       }
    //     })
    //   ]);
    // },
    // 排序
    sortable(sort_param) {
      // console.log(sort_param.prop);
      let type;
      if (sort_param.order === "descending") {
        type = "desc";
      } else {
        type = "asc";
      }
      // console.log(this.params.sort);
      if (sort_param.prop === null) {
        this.sortData = {};
        this.getList(); //请求列表
      } else {
        if (type === "desc") {
          this.sortData.sort = 0;
        } else {
          this.sortData.sort = 1;
        }
        this.sortData.prop = this.cfuns.toLine(sort_param.prop);
        let arg = {};
        arg.sort = this.sortData.sort;
        arg.field = this.sortData.prop;
        arg.sortField = this.sortData.prop;
        if (this.getShowCateList) {
          this.getShowCateList(arg);
        } else {
           this.$emit("update:pageNumber", 1);
          this.getList(arg); //请求列表
        }
      }
    },
    // table选中
    handleSelectionChange(val) {
      this.$emit("update:userSelect", val);
    },
    // 分页
    handleSizeChange(pageSize) {
      this.$emit("update:pageSize", pageSize);
      this.$emit("update:pageNumber", 1);
      if (this.getShowCateList) {
        if (this.sortData) {
          let arg = {};
          arg.sort = this.sortData.sort;
          arg.field = this.sortData.prop;
          arg.sortField = this.sortData.prop;
          this.getShowCateList(arg);
        } else {
          this.getShowCateList();
        }
      } else {
        if (this.sortData) {
          let arg = {};
          arg.sort = this.sortData.sort;
          arg.field = this.sortData.prop;
          arg.sortField = this.sortData.prop;
          this.getList(arg); //请求列表
        } else {
          this.getList(); //请求列表
        }
      }
    },
    handleCurrentChange(pageNumber) {
      this.$emit("update:pageNumber", pageNumber);
      if (this.getShowCateList) {
        if (this.sortData) {
          let arg = {};
          arg.sort = this.sortData.sort;
          arg.field = this.sortData.prop;
          arg.sortField = this.sortData.prop;
          this.getShowCateList(arg);
        } else {
          this.getShowCateList();
        }
      } else {
        if (this.sortData) {
          let arg = {};
          arg.sort = this.sortData.sort;
          arg.field = this.sortData.prop;
          arg.sortField = this.sortData.prop;
          arg.select=true;
          this.getList(arg); //请求列表
        } else {
          this.getList(); //请求列表
        }
      }
    },
    clearSortable() {
      //   console.log(this.$refs.Table);
      this.$refs.Table.clearSort();
    },
	formatCateDepth(data){
		let category  = data
		if(category.length>50){
			let newArr = category.split(':')
			var newStr = ''
			return newStr = `${newArr[0]}...${newArr.pop()}`
		}else{
			return category
		}
	},
  },
  //   filters:{
  //       _formatData222(val){

  //       }
  //   },
  computed: {
    querySiteId__() {
      return this.$route.query.siteId__;
    },
    keyName() {
      let k;
      if (this.$route.query.keywordTypes == 3) {
        k = "原产品ID";
      }
      if (this.$route.query.keywordTypes != 3) {
        k = "源关键词";
      }
      return k;
    },
	outerParams(){
		return {
			taskId:this.$route.query.taskId,
			category:null,
		}
	},
  },
};
</script>

<style lang='scss' scoped>

.big__ {
  width: 220px;
  height: 220px;
  object-fit: contain;
}
.randerTool{
	display: inline-block;
	height: 30px;
}
.iconfont{
	font-size: 14px;
}
.__icon{
	font-size: 14px;
}
</style>

<template>
	<MainLayout
	    :outerParams="outerParams"
	    :searchFields="searchFields"
	    :editBtns="editBtns"
		:edits="edits"
	    :columns="columns"
	    :searchFunc="searchFunc"
		@requestSuccess = "requestSuccess"
	    @selectChange='selectChange'
		:handleLeft='true'
		:backBtn='true'
		:customDisplay='true'
	    ref="layout"
	    url="ebTaskKrResearchListTaskDetail"
	    >  
		<template slot="search">
			<el-form :inline="true" ref="searchRuleForm" :model="listQuery"  :rules="rules" >
				<el-form-item label="标题" prop="title" v-if="searchIsShow.title">
				    <el-input v-model="listQuery.title" placeholder="请输入标题" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="自然搜索排名:" prop="minWebRank" v-if="searchIsShow.WebRank">
				    <el-input v-model="listQuery.minWebRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxWebRank" v-if="searchIsShow.WebRank">
				    <el-input v-model="listQuery.maxWebRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="价格:" prop="minPrice"  v-if="searchIsShow.Price">
				    <el-input v-model="listQuery.minPrice" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxPrice" v-if="searchIsShow.Price">
				    <el-input v-model="listQuery.maxPrice" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="价格排名:" prop="minPriceRank" v-if="searchIsShow.PriceRank">
				    <el-input v-model="listQuery.minPriceRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxPriceRank" v-if="searchIsShow.PriceRank">
				    <el-input v-model="listQuery.maxPriceRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="搜索词在标题中匹配方式:" prop="matchInTitle" v-if="searchIsShow.matchInTitle">
					<el-select v-model="listQuery.matchInTitle" size='mini' clearable>
						<el-option label="全部出现（紧密相连）" value=0></el-option>
						<el-option label="全部出现（非紧密相连）" value=1></el-option>
						<el-option label="部分出现（紧密相连）" value=2></el-option>
						<el-option label="部分出现（非紧密相连）" value=3></el-option>
						<el-option label="未出现" value=4></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="搜索词在卖点中匹配方式:" prop="matchInFeature" v-if="searchIsShow.matchInFeature">
					<el-select v-model="listQuery.matchInFeature" size='mini' clearable>
						<el-option label="全部出现（紧密相连）" value=0></el-option>
						<el-option label="全部出现（非紧密相连）" value=1></el-option>
						<el-option label="部分出现（紧密相连）" value=2></el-option>
						<el-option label="部分出现（非紧密相连）" value=3></el-option>
						<el-option label="未出现" value=4></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="评分:" prop="minStarCnt"  v-if="searchIsShow.StarCnt">
				    <el-input v-model="listQuery.minStarCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxStarCnt" v-if="searchIsShow.StarCnt">
				    <el-input v-model="listQuery.maxStarCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="评分排名:" prop="minStarRank" v-if="searchIsShow.StarRank">
				    <el-input v-model="listQuery.minStarRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxStarRank" v-if="searchIsShow.StarRank">
				    <el-input v-model="listQuery.maxStarRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="评价数:" prop="minReviewCnt"  v-if="searchIsShow.ReviewCnt">
				    <el-input v-model="listQuery.minReviewCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxReviewCnt" v-if="searchIsShow.ReviewCnt">
				    <el-input v-model="listQuery.maxReviewCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="评价数排名:" prop="minReviewCntRank" v-if="searchIsShow.ReviewCntRank">
				    <el-input v-model="listQuery.minReviewCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxReviewCntRank" v-if="searchIsShow.ReviewCntRank">
				    <el-input v-model="listQuery.maxReviewCntRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="三日新增评价数:" prop="minNewReviewCntD3"  v-if="searchIsShow.NewReviewCntD3">
				    <el-input v-model="listQuery.minNewReviewCntD3" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxNewReviewCntD3" v-if="searchIsShow.NewReviewCntD3">
				    <el-input v-model="listQuery.maxNewReviewCntD3" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="三日新增评价数排名:" prop="minNewReviewCntD3Rank" v-if="searchIsShow.NewReviewCntD3Rank">
				    <el-input v-model="listQuery.minNewReviewCntD3Rank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxNewReviewCntD3Rank" v-if="searchIsShow.NewReviewCntD3Rank">
				    <el-input v-model="listQuery.maxNewReviewCntD3Rank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="发货地:" prop="deliveryAddr" v-if="searchIsShow.deliveryAddr">
					<el-select v-model="listQuery.deliveryAddr" size='mini' clearable>
						<el-option  v-for="item in shipList" :label="item.label" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="Watchers:" prop="minWatchers" v-if="searchIsShow.Watchers">
				    <el-input v-model="listQuery.minWatchers" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxWatchers" v-if="searchIsShow.Watchers">
				    <el-input v-model="listQuery.maxWatchers" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="Watchers排名:" prop="minWatchersRank" v-if="searchIsShow.WatchersRank">
				    <el-input v-model="listQuery.minWatchersRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxWatchersRank" v-if="searchIsShow.WatchersRank">
				    <el-input v-model="listQuery.maxWatchersRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="卖家名称:" prop="sellerName" v-if="searchIsShow.sellerName">
				    <el-input v-model="listQuery.sellerName" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="卖家评价数:" prop="minSellerReviewCnt" v-if="searchIsShow.SellerReviewCnt">
				    <el-input v-model="listQuery.minSellerReviewCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxSellerReviewCnt" v-if="searchIsShow.SellerReviewCnt">
				    <el-input v-model="listQuery.maxSellerReviewCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="卖家评价数排名:" prop="minSellerReviewCntRank" v-if="searchIsShow.SellerReviewCntRank">
				    <el-input v-model="listQuery.minSellerReviewCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxSellerReviewCntRank" v-if="searchIsShow.SellerReviewCntRank">
				    <el-input v-model="listQuery.maxSellerReviewCntRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="卖家好评率:" prop="minPositiveRate" v-if="searchIsShow.PositiveRate">
				    <el-input v-model="listQuery.minPositiveRate" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxPositiveRate" v-if="searchIsShow.PositiveRate">
				    <el-input v-model="listQuery.maxPositiveRate" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="卖家好评率排名:" prop="minPositiveRateRank" v-if="searchIsShow.PositiveRateRank">
				    <el-input v-model="listQuery.minPositiveRateRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxPositiveRateRank" v-if="searchIsShow.PositiveRateRank">
				    <el-input v-model="listQuery.maxPositiveRateRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="是否TOP RATED:" prop="topRatedFlag" v-if="searchIsShow.topRatedFlag">
					<el-select v-model="listQuery.topRatedFlag" size='mini' clearable>
						<el-option label="是" value=1></el-option>
						<el-option label="否" value=0></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="卖家月新增好评数:" prop="minPositiveCnt" v-if="searchIsShow.PositiveCnt">
				    <el-input v-model="listQuery.minPositiveCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxPositiveCnt" v-if="searchIsShow.PositiveCnt">
				    <el-input v-model="listQuery.maxPositiveCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="卖家月新增好评数排名:" prop="minPositiveCntRank" v-if="searchIsShow.PositiveCntRank">
				    <el-input v-model="listQuery.minPositiveCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxPositiveCntRank" v-if="searchIsShow.PositiveCntRank">
				    <el-input v-model="listQuery.maxPositiveCntRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="卖家注册地:" prop="sellerRegistration" v-if="searchIsShow.sellerRegistration">
					<el-select v-model="listQuery.sellerRegistration" size='mini' clearable>
						<el-option  v-for="item in placeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="快递到达预计所需天数:" prop="minExpressDeliveryDays" v-if="searchIsShow.ExpressDeliveryDays">
				    <el-input v-model="listQuery.minExpressDeliveryDays" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxExpressDeliveryDays" v-if="searchIsShow.ExpressDeliveryDays">
				    <el-input v-model="listQuery.maxExpressDeliveryDays" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="快递到达预计所需天数排名:" prop="minExpressDeliveryDaysRank" v-if="searchIsShow.ExpressDeliveryDaysRank">
				    <el-input v-model="listQuery.minExpressDeliveryDaysRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxExpressDeliveryDaysRank" v-if="searchIsShow.ExpressDeliveryDaysRank">
				    <el-input v-model="listQuery.maxExpressDeliveryDaysRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="开店时间:" prop="minOpenTime" v-if="searchIsShow.OpenTime">
				    <el-input v-model="listQuery.minOpenTime" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOpenTime" v-if="searchIsShow.OpenTime">
				    <el-input v-model="listQuery.maxOpenTime" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="开店时间排名:" prop="minOpenTimeRank" v-if="searchIsShow.OpenTimeRank">
				    <el-input v-model="listQuery.minOpenTimeRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOpenTimeRank" v-if="searchIsShow.OpenTimeRank">
				    <el-input v-model="listQuery.maxOpenTimeRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="支持退货天数:" prop="minSupportReturnDays" v-if="searchIsShow.SupportReturnDays">
				    <el-input v-model="listQuery.minSupportReturnDays" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxSupportReturnDays" v-if="searchIsShow.SupportReturnDays">
				    <el-input v-model="listQuery.maxSupportReturnDays" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="支持退货天数排名:" prop="minSupportReturnDaysRank" v-if="searchIsShow.SupportReturnDaysRank">
				    <el-input v-model="listQuery.minSupportReturnDaysRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxSupportReturnDaysRank" v-if="searchIsShow.SupportReturnDaysRank">
				    <el-input v-model="listQuery.maxSupportReturnDaysRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="是否免运费:" prop="shippingFreeFlag" v-if="searchIsShow.shippingFreeFlag">
					<el-select v-model="listQuery.shippingFreeFlag" size='mini' clearable>
						<el-option label="是" value=1></el-option>
						<el-option label="否" value=0></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="子sku数量:" prop="minSkuCnt" v-if="searchIsShow.SkuCnt">
				    <el-input v-model="listQuery.minSkuCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxSkuCnt" v-if="searchIsShow.SkuCnt">
				    <el-input v-model="listQuery.maxSkuCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="子sku数量排名:" prop="minSkuCntRank" v-if="searchIsShow.SkuCntRank">
				    <el-input v-model="listQuery.minSkuCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxSkuCntRank" v-if="searchIsShow.SkuCntRank">
				    <el-input v-model="listQuery.maxSkuCntRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="日订单量:" prop="minOrderCntDaily" v-if="searchIsShow.OrderCntDaily">
				    <el-input v-model="listQuery.minOrderCntDaily" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderCntDaily" v-if="searchIsShow.OrderCntDaily">
				    <el-input v-model="listQuery.maxOrderCntDaily" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="日订单量排名:" prop="minOrderCntDailyRank" v-if="searchIsShow.OrderCntDailyRank">
				    <el-input v-model="listQuery.minOrderCntDailyRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderCntDailyRank" v-if="searchIsShow.OrderCntDailyRank">
				    <el-input v-model="listQuery.maxOrderCntDailyRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="周订单量:" prop="minOrderCntWeekly" v-if="searchIsShow.OrderCntWeekly">
				    <el-input v-model="listQuery.minOrderCntWeekly" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderCntWeekly" v-if="searchIsShow.OrderCntWeekly">
				    <el-input v-model="listQuery.maxOrderCntWeekly" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="周订单量排名:" prop="minOrderCntWeeklyRank" v-if="searchIsShow.OrderCntWeeklyRank">
				    <el-input v-model="listQuery.minOrderCntWeeklyRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderCntWeeklyRank" v-if="searchIsShow.OrderCntWeeklyRank">
				    <el-input v-model="listQuery.maxOrderCntWeeklyRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="月订单量:" prop="minOrderCntMonthly" v-if="searchIsShow.OrderCntMonthly">
				    <el-input v-model="listQuery.minOrderCntMonthly" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderCntMonthly" v-if="searchIsShow.OrderCntMonthly">
				    <el-input v-model="listQuery.maxOrderCntMonthly" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="月订单量排名:" prop="minOrderCntMonthlyRank" v-if="searchIsShow.OrderCntMonthlyRank">
				    <el-input v-model="listQuery.minOrderCntMonthlyRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderCntMonthlyRank" v-if="searchIsShow.OrderCntMonthlyRank">
				    <el-input v-model="listQuery.maxOrderCntMonthlyRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="总订单量:" prop="minOrderTotal" v-if="searchIsShow.OrderTotal">
				    <el-input v-model="listQuery.minOrderTotal" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderTotal" v-if="searchIsShow.OrderTotal">
				    <el-input v-model="listQuery.maxOrderTotal" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="总订单量排名:" prop="minOrderTotalRank" v-if="searchIsShow.OrderTotalRank">
				    <el-input v-model="listQuery.minOrderTotalRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxOrderTotalRank" v-if="searchIsShow.OrderTotalRank">
				    <el-input v-model="listQuery.maxOrderTotalRank" size='mini' clearable></el-input>
				</el-form-item>
			</el-form>
			
			<el-button type="primary" size="mini" @click="searchMethod" icon="el-icon-search" :loading="tableLoading">搜索</el-button>
			<el-button type="primary" plain size="mini" @click="resetMethod" :loading="tableLoading">重置搜索</el-button>
			<el-popover
				style="margin-left: 15px;"
			    placement="bottom"
			    width="400"
			    trigger="hover">
			    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			    <div style="margin: 15px 0;"></div>
			    <el-checkbox-group v-model="checkedClassify" @change="handleCheckedClassifyChange">
			        <el-checkbox 
			            v-for="(item) in ClassifyArray" 
			            :label="item.label" 
			            :key="item.label" 
			            style='width:160px;'
			            :style="{marginLeft:item.label==='标题'?'30px':''}"
			        >
			            {{item.label}}
			        </el-checkbox>
			    </el-checkbox-group>
			    <el-button size="mini" type="primary"  plain  slot="reference" >自定义筛选条件</el-button>
			</el-popover>
		</template>
	</MainLayout> 
</template>

<script>
	import { downloadFile } from 'Utils/tools'
	export default{
		data(){
			return{
				tableLoading:false,
				isIndeterminate:true,
				checkAll:false,
				checkedClassify:['标题','自然搜索排名','价格','价格排名'],
				listQuery:{
					title:null,
					minWebRank:null,
					maxWebRank:null,
					minPrice:null,
					maxPrice:null,
					minPriceRank:null,
					maxPriceRank:null,
					matchInTitle:null,
					matchInFeature:null,
					minStarCnt:null,
					maxStarCnt:null,
					minStarRank:null,
					maxStarRank:null,
					minReviewCnt:null,
					maxReviewCnt:null,
					minReviewCntRank:null,
					maxReviewCntRank:null,
					minNewReviewCntD3:null,
					maxNewReviewCntD3:null,
					minNewReviewCntD3Rank:null,
					maxNewReviewCntD3Rank:null,
					deliveryAddr:null,
					minWatchers:null,
					maxWatchers:null,
					minWatchersRank:null,
					maxWatchersRank:null,
					sellerName:null,
					minSellerReviewCnt:null,
					maxSellerReviewCnt:null,
					minSellerReviewCntRank:null,
					maxSellerReviewCntRank:null,
					minPositiveRate:null,
					maxPositiveRate:null,
					minPositiveRateRank:null,
					maxPositiveRateRank:null,
					topRatedFlag:null,
					minPositiveCnt:null,
					maxPositiveCnt:null,
					minPositiveCntRank:null,
					maxPositiveCntRank:null,
					sellerRegistration:null,
					minExpressDeliveryDays:null,
					maxExpressDeliveryDays:null,
					minExpressDeliveryDaysRank:null,
					maxExpressDeliveryDaysRank:null,
					minOpenTime:null,
					maxOpenTime:null,
					minOpenTimeRank:null,
					maxOpenTimeRank:null,
					minSupportReturnDays:null,
					maxSupportReturnDays:null,
					minSupportReturnDaysRank:null,
					maxSupportReturnDaysRank:null,
					shippingFreeFlag:null,
					minSkuCnt:null,
					maxSkuCnt:null,
					minSkuCntRank:null,
					maxSkuCntRank:null,
					minOrderCntDaily:null,
					maxOrderCntDaily:null,
					minOrderCntDailyRank:null,
					maxOrderCntDailyRank:null,
					minOrderCntWeekly:null,
					maxOrderCntWeekly:null,
					minOrderCntWeeklyRank:null,
					maxOrderCntWeeklyRank:null,
					minOrderCntMonthly:null,
					maxOrderCntMonthly:null,
					minOrderCntMonthlyRank:null,
					maxOrderCntMonthlyRank:null,
					minOrderTotal:null,
					maxOrderTotal:null,
					minOrderTotalRank:null,
					maxOrderTotalRank:null,
				},
				searchIsShow:{
					title:true,
					WebRank:true,
					Price:true,
					PriceRank:true,
					matchInTitle:false,
					matchInFeature:false,
					StarCnt:false,
					StarRank:false,
					ReviewCnt:false,
					ReviewCntRank:false,
					NewReviewCntD3:false,
					NewReviewCntD3Rank:false,
					deliveryAddr:false,
					Watchers:false,
					WatchersRank:false,
					sellerName:false,
					SellerReviewCnt:false,
					SellerReviewCntRank:false,
					PositiveRate:false,
					PositiveRateRank:false,
					topRatedFlag:false,
					PositiveCnt:false,
					PositiveCntRank:false,
					sellerRegistration:false,
					ExpressDeliveryDays:false,
					ExpressDeliveryDaysRank:false,
					OpenTime:false,
					OpenTimeRank:false,
					SupportReturnDays:false,
					SupportReturnDaysRank:false,
					shippingFreeFlag:false,
					SkuCnt:false,
					SkuCntRank:false,
					OrderCntDaily:false,
					OrderCntDailyRank:false,
					OrderCntWeekly:false,
					OrderCntWeeklyRank:false,
					OrderCntMonthly:false,
					OrderCntMonthlyRank:false,
					OrderTotal:false,
					OrderTotalRank:false,
				},
				ClassifyArray:[
					{label:'标题',sign:"title"},
					{label:'自然搜索排名',sign:"WebRank"},
					{label:'价格',sign:"Price"},
					{label:'价格排名',sign:"PriceRank"},
					{label:'搜索词在标题中匹配方式',sign:"matchInTitle"},
					{label:'搜索词在卖点中匹配方式',sign:"matchInFeature"},
					{label:'评分',sign:"StarCnt"},
					{label:'评分排名',sign:"StarRank"},
					{label:'评价数',sign:"ReviewCnt"},
					{label:'评价数排名',sign:"ReviewCntRank"},
					{label:'三日新增评价数',sign:"NewReviewCntD3"},
					{label:'三日新增评价数排名',sign:"NewReviewCntD3Rank"},
					{label:'发货地',sign:"deliveryAddr"},
					{label:'Watchers',sign:"Watchers"},
					{label:'Watchers排名',sign:"WatchersRank"},
					{label:'卖家名称',sign:"sellerName"},
					{label:'卖家评价数',sign:"SellerReviewCnt"},
					{label:'卖家评价数排名',sign:"SellerReviewCntRank"},
					{label:'卖家好评率',sign:"PositiveRate"},
					{label:'卖家好评率排名',sign:"PositiveRateRank"},
					{label:'是否TOP RATED',sign:"topRatedFlag"},
					{label:'卖家月新增好评数',sign:"PositiveCnt"},
					{label:'卖家月新增好评数排名',sign:"PositiveCntRank"},
					{label:'卖家注册地',sign:"sellerRegistration"},
					{label:'快递到达预计所需天数',sign:"ExpressDeliveryDays"},
					{label:'快递到达预计所需天数排名',sign:"ExpressDeliveryDaysRank"},
					{label:'开店时间',sign:"OpenTime"},
					{label:'开店时间排名',sign:"OpenTimeRank"},
					{label:'支持退货天数',sign:"SupportReturnDays"},
					{label:'支持退货天数排名',sign:"SupportReturnDaysRank"},
					{label:'是否免运费',sign:"shippingFreeFlag"},
					{label:'子sku数量',sign:"SkuCnt"},
					{label:'子sku数量排名',sign:"SkuCntRank"},
					{label:'日订单量',sign:"OrderCntDaily"},
					{label:'日订单量排名',sign:"OrderCntDailyRank"},
					{label:'周订单量',sign:"OrderCntWeekly"},
					{label:'周订单量排名',sign:"OrderCntWeeklyRank"},
					{label:'月订单量',sign:"OrderCntMonthly"},
					{label:'月订单量排名',sign:"OrderCntMonthlyRank"},
					{label:'总订单量',sign:"OrderTotal"},
					{label:'总订单量排名',sign:"OrderTotalRank"},
				],
				rules:{},
				edits:[
					{
					    name: "查看分析",
					    icon: "el-icon-picture-outline",
					    show: scope => {
					          return  true
					    },
					    fn: (scope) => {
					        this.$refs.layout.$dialog({
					        	title: "数据展示",
					        	size:'large',
					        	params: {taskId:scope.row.taskId,url:"ebTaskKrResearchCurveList"},
					        	component: () => import('./echartsDialog.vue'),
					        });
					    }
					}
				],
				searchFields:[],
				editBtns:[
					{
						name:'导出',
						fn:()=>{
							this.exportMethod()
						}
					}
				],
				columns:[
					
					{
					    label: "主图",
					    value: "imageUrl",
						img:true,
						link: 'productUrl',
					},
					{
					    label: "标题",
					    value: "title",
						minWidth:'120',
					},
					{
					    label: "自然搜索排名",
					    value: "webRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "搜索词在标题中匹配方式",
					    value: "matchInTitle",
						minWidth:'210',
					},
					{
					    label: "搜索词在卖点中匹配方式",
					    value: "matchInFeature",
						minWidth:'200',
					},
					{
					    label: "是否TOP REATED",
					    value: "topRatedFlag",
						minWidth:'160',
						render(h,scope){
							let {topRatedFlag} = scope.row
							return topRatedFlag ? (
								<span>是</span>
							) : (
								<span>否</span>							
							)
						}
					},
					{
					    label: "评分",
					    value: "starCnt",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "评分排名",
					    value: "starCntRank",
						sortable:"custom",
						minWidth:'110',
					},
					{
					    label: "评价数",
					    value: "reviewCnt",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "评价数排名",
					    value: "reviewCntRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "3天新增评价数",
					    value: "newReviewCntD3",
						sortable:"custom",
						minWidth:'130',
					},
					{
					    label: "3天新增评价数排名",
					    value: "newReviewCntD3Rank",
						sortable:"custom",
						minWidth:'160',
					},
					{
					    label: "发货地",
					    value: "deliveryAddr",
						minWidth:'70',
					},
					{
					    label: "价格",
					    value: "price",
						sortable:"custom",
						minWidth:'80',
					},
					{
					    label: "价格排名",
					    value: "priceRank",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "子SKU数",
					    value: "skuCnt",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "子SKU数排名",
					    value: "skuCntRank",
						sortable:"custom",
						minWidth:'130',
					},
					{
					    label: "日订单量",
					    value: "orderCntDaily",
						minWidth:'100',
					},
					{
					    label: "日订单量排名",
					    value: "orderCntDailyRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "周订单量",
					    value: "orderCntWeekly",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "周订单量排名",
					    value: "orderCntWeeklyRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "月订单量",
					    value: "orderCntMonthly",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "月订单量排名",
					    value: "orderCntMonthlyRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "总订单量",
					    value: "orderTotal",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "总订单量排名",
					    value: "orderTotalRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "卖家名称",
					    value: "sellerName",
						minWidth:'150',
					},
					{
					    label: "卖家月新增好评数",
					    value: "positiveCntD30",
						sortable:"custom",
						minWidth:'160',
					},
					{
					    label: "卖家月新增好评数排名",
					    value: "positiveCntD30Rank",
						sortable:"custom",
						minWidth:'180',
					},
					{
					    label: "卖家总评价数",
					    value: "sellerReviewCnt",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "卖家总评价数排名",
					    value: "sellerReviewCntRank",
						sortable:"custom",
						minWidth:'150',
					},
					{
					    label: "卖家好评率",
					    value: "positiveRate",
						sortable:"custom",
						minWidth:'110',
					},
					{
					    label: "卖家好评率排名",
					    value: "positiveRateRank",
						sortable:"custom",
						minWidth:'130',
					},
					{
					    label: "开店时间",
					    value: "openTime",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "开店时间排名",
					    value: "openTimeRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "卖家注册地",
					    value: "sellerRegistration",
						minWidth:'120',
					},
					{
					    label: "快递到达预计所需天数",
					    value: "expressDeliveryDays",
						sortable:"custom",
						minWidth:'170',
					},
					{
					    label: "快递到达预计所需天数排名",
					    value: "expressDeliveryDaysRank",
						sortable:"custom",
						minWidth:'190',
					},
					{
					    label: "支持多少天退货",
					    value: "supportReturnDays",
						sortable:"custom",
						minWidth:'140',
					},
					{
					    label: "支持多少天退货排名",
					    value: "supportReturnDaysRank",
						sortable:"custom",
						minWidth:'170',
					},
					{
					    label: "Watching数量",
					    value: "watchers",
						sortable:"custom",
						minWidth:'140',
					},

					{
					    label: "Watching数量排名",
					    value: "watchersRank",
						sortable:"custom",
						minWidth:'160',
					},
				],
				selectList:[],
				shipList:[],
				placeList:[],
			}
		},
		created(){
			this.outerParams.taskId=this.$route.query.taskId;//任务id
			this.getShip()
			this.getPlace()
		},
		methods:{
			requestSuccess(){
				this.tableLoading = false
			},
			exportMethod(){
				let param = {
				  sellerId: this.sellerId,
				  siteId: this.siteId,
				  taskId:this.outerParams.taskId,
				  pageNumber: 1,
				  pageSize: 10,
				  ...this.listQuery
				}
				this.$api['ebTaskKrResearchExportTaskDetail'](param).then(data => {
				  downloadFile(
				    data,
				    '自然搜索详情' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
				  )
				})
			},
			searchMethod(){
				this.tableLoading = true
				this.$refs.layout.getList()
			},
			resetMethod(){
				this.tableLoading = true
				this.$refs.searchRuleForm.resetFields();
				this.$refs.layout.getList()
			},
			getShip(){
				this.$api['ebTaskKrResearchListDeliveryAddr']({
					sellerId:this.sellerId,
					siteId:this.siteId,
					taskId:this.outerParams.taskId
				}).then(data=>{
					data.data.forEach(v=>{
						this.shipList.push({label:v,value:v})
					})
					
				})
			},
			getPlace(){
				this.$api['ebTaskKrResearchListRegistration']({
					sellerId:this.sellerId,
					siteId:this.siteId,
					taskId:this.outerParams.taskId
				}).then(data=>{
					data.data.forEach(v=>{
						this.placeList.push({label:v,value:v})
					})
					
				})
			},
			searchFunc(data){
				let datas = {...this.listQuery};
				let {...info} = data;
				return {...datas,...info}
			},
			selectChange(v){
				// this.selectList = [];
				// v.forEach(i => {
				//   this.selectList.push(i.taskId)
				// });
			},
			//全选
			handleCheckAllChange(val){
			    let label=[];
			    this.ClassifyArray.forEach(i=>{
			        label.push(i.label);
			    });
			    this.checkedClassify = val ? label : [];
			    this.isIndeterminate = false;
			    
			    if(val){
			        for (const key in this.searchIsShow) {
			                this.searchIsShow[key]=true;
			        }
			    }else{
			        for (const key in this.searchIsShow) {
			                this.searchIsShow[key]=false;
			        }
			    }
			},
			//单
			handleCheckedClassifyChange(value){
				let checkedCount = value.length;
			    this.checkAll = checkedCount === this.ClassifyArray.length;
			    this.isIndeterminate = checkedCount > 0 && checkedCount < this.ClassifyArray.length;
			    let arr=[];
			    if(value.length>=0){
			        value.forEach(item=>{
			            this.ClassifyArray.forEach(i=>{
			                if(item===i.label){
			                    arr.push(i.sign);
			                }
			            })
			        })
			        for (const key in this.searchIsShow) {
			                this.searchIsShow[key]=false;
			        };
			        arr.forEach(i=>{
			               this.searchIsShow[i]=true;
			        });
			    };
			},
		},
		computed: {
			outerParams(){
				return {
					platformId:this.ebayPlatformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					taskId:null,
				}
			},
		},
	}
</script>

<style>
</style>

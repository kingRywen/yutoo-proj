<template>
	<MainLayout
	    :outerParams="outerParams"
	    :searchFields="searchFields"
	    :editBtns="editBtns"
		:edits="edits"
	    :columns="columns"
	    :searchFunc="searchFunc"
	    @selectChange='selectChange'
		@requestSuccess = 'requestSuccess'
		:handleLeft='true'
		:backBtn='true'
		:customDisplay='true'
	    ref="layout"
	    url="ebTaskAuctionRankListTaskDetail"
	    >  
		<template slot="search">
			<el-form :inline="true" ref="searchRuleForm" :model="listQuery"  :rules="rules" >
				<el-form-item label="标题" prop="title" v-if="searchIsShow.title">
				    <el-input v-model="listQuery.title" placeholder="请输入标题" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="自然搜索:" prop="minWebRank" v-if="searchIsShow.WebRank">
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
				
				<el-form-item label="bids数:" prop="minBidsCnt" v-if="searchIsShow.BidsCnt">
				    <el-input v-model="listQuery.minBidsCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxBidsCnt" v-if="searchIsShow.BidsCnt">
				    <el-input v-model="listQuery.maxBidsCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="bids数排名:" prop="minBidsCntRank" v-if="searchIsShow.BidsCntRank">
				    <el-input v-model="listQuery.minBidsCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxBidsCntRank" v-if="searchIsShow.BidsCntRank">
				    <el-input v-model="listQuery.maxBidsCntRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="剩余时间:" prop="minEndTime" v-if="searchIsShow.EndTime">
				    <el-input v-model="listQuery.minEndTime" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxEndTime" v-if="searchIsShow.EndTime">
				    <el-input v-model="listQuery.maxEndTime" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="剩余时间排名:" prop="minEndTimeRank" v-if="searchIsShow.EndTimeRank">
				    <el-input v-model="listQuery.minEndTimeRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxEndTimeRank" v-if="searchIsShow.EndTimeRank">
				    <el-input v-model="listQuery.maxEndTimeRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="拍卖天数:" prop="minAuctionDays" v-if="searchIsShow.AuctionDays">
				    <el-input v-model="listQuery.minAuctionDays" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxAuctionDays" v-if="searchIsShow.AuctionDays">
				    <el-input v-model="listQuery.maxAuctionDays" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="拍卖天数排名:" prop="minAuctionDaysRank" v-if="searchIsShow.AuctionDaysRank">
				    <el-input v-model="listQuery.minAuctionDaysRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxAuctionDaysRank" v-if="searchIsShow.AuctionDaysRank">
				    <el-input v-model="listQuery.maxAuctionDaysRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="运费:" prop="minFare" v-if="searchIsShow.Fare">
				    <el-input v-model="listQuery.minFare" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxFare" v-if="searchIsShow.Fare">
				    <el-input v-model="listQuery.maxFare" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="运费排名:" prop="minFareRank" v-if="searchIsShow.FareRank">
				    <el-input v-model="listQuery.minFareRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxFareRank" v-if="searchIsShow.FareRank">
				    <el-input v-model="listQuery.maxFareRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="项目所在地:" prop="itemLocation" v-if="searchIsShow.itemLocation">
				    <el-select v-model="listQuery.itemLocation" size='mini' clearable>
				    	<el-option  v-for="item in placeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
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
				
				<el-form-item label="卖家评价数:" prop="minReviewCnt" v-if="searchIsShow.ReviewCnt">
				    <el-input v-model="listQuery.minReviewCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxReviewCnt" v-if="searchIsShow.ReviewCnt">
				    <el-input v-model="listQuery.maxReviewCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="卖家评价数排名:" prop="minReviewCntRank" v-if="searchIsShow.ReviewCntRank">
				    <el-input v-model="listQuery.minReviewCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxReviewCntRank" v-if="searchIsShow.ReviewCntRank">
				    <el-input v-model="listQuery.maxReviewCntRank" size='mini' clearable></el-input>
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
				
				<el-form-item label="卖家月新增中评数:" prop="minNeutralCnt" v-if="searchIsShow.NeutralCnt">
				    <el-input v-model="listQuery.minNeutralCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxNeutralCnt" v-if="searchIsShow.NeutralCnt">
				    <el-input v-model="listQuery.maxNeutralCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="卖家月新增中评数排名:" prop="minNeutralCntRank" v-if="searchIsShow.NeutralCntRank">
				    <el-input v-model="listQuery.minNeutralCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxNeutralCntRank" v-if="searchIsShow.NeutralCntRank">
				    <el-input v-model="listQuery.maxNeutralCntRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="卖家月新增差评数:" prop="minNegativeCnt" v-if="searchIsShow.NegativeCnt">
				    <el-input v-model="listQuery.minNegativeCnt" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxNegativeCnt" v-if="searchIsShow.NegativeCnt">
				    <el-input v-model="listQuery.maxNegativeCnt" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="卖家月新增差评数排名:" prop="minNegativeCntRank"  v-if="searchIsShow.NegativeCntRank">
				    <el-input v-model="listQuery.minNegativeCntRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxNegativeCntRank"  v-if="searchIsShow.NegativeCntRank">
				    <el-input v-model="listQuery.maxNegativeCntRank" size='mini' clearable></el-input>
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
				
				<el-form-item label="Item as described:" prop="minItemAsDescribed" v-if="searchIsShow.ItemAsDescribed">
				    <el-input v-model="listQuery.minItemAsDescribed" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxItemAsDescribed" v-if="searchIsShow.ItemAsDescribed">
				    <el-input v-model="listQuery.maxItemAsDescribed" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="Item as described排名:" prop="minItemAsDescribedRank" v-if="searchIsShow.ItemAsDescribedRank">
				    <el-input v-model="listQuery.minItemAsDescribedRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxItemAsDescribedRank" v-if="searchIsShow.ItemAsDescribedRank">
				    <el-input v-model="listQuery.maxItemAsDescribedRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="Communication:" prop="minCommunication"  v-if="searchIsShow.Communication">
				    <el-input v-model="listQuery.minCommunication" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxCommunication"  v-if="searchIsShow.Communication">
				    <el-input v-model="listQuery.maxCommunication" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="Communication排名:" prop="minCommunicationRank" v-if="searchIsShow.CommunicationRank">
				    <el-input v-model="listQuery.minCommunicationRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxCommunicationRank" v-if="searchIsShow.CommunicationRank">
				    <el-input v-model="listQuery.maxCommunicationRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="ShippingTime:" prop="minShippingTime" v-if="searchIsShow.ShippingTime">
				    <el-input v-model="listQuery.minShippingTime" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxShippingTime" v-if="searchIsShow.ShippingTime">
				    <el-input v-model="listQuery.maxShippingTime" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="ShippingTime排名:" prop="minShippingTimeRank" v-if="searchIsShow.ShippingTimeRank">
				    <el-input v-model="listQuery.minShippingTimeRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxShippingTimeRank" v-if="searchIsShow.ShippingTimeRank">
				    <el-input v-model="listQuery.maxShippingTimeRank" size='mini' clearable></el-input>
				</el-form-item>
				
				<el-form-item label="ShippingCharges:" prop="minShippingCharges" v-if="searchIsShow.ShippingCharges">
				    <el-input v-model="listQuery.minShippingCharges" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxShippingCharges" v-if="searchIsShow.ShippingCharges">
				    <el-input v-model="listQuery.maxShippingCharges" size='mini' clearable></el-input>
				</el-form-item>
							   
				<el-form-item label="ShippingCharges排名:" prop="minShippingChargesRank" v-if="searchIsShow.ShippingChargesRank">
				    <el-input v-model="listQuery.minShippingChargesRank" size='mini' clearable></el-input>
				</el-form-item>
				<el-form-item label="~" prop="maxShippingChargesRank" v-if="searchIsShow.ShippingChargesRank">
				    <el-input v-model="listQuery.maxShippingChargesRank" size='mini' clearable></el-input>
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
				placeList:[],
				isIndeterminate:true,
				checkAll:false,
				checkedClassify:['标题','自然搜索','价格','价格排名'],
				listQuery:{
					title:null,
					minWebRank:null,
					maxWebRank:null,
					minPrice:null,
					maxPrice:null,
					minPriceRank:null,
					maxPriceRank:null,
					minBidsCnt:null,
					maxBidsCnt:null,
					minBidsCntRank:null,
					maxBidsCntRank:null,
					minEndTime:null,
					maxEndTime:null,
					minEndTimeRank:null,
					maxEndTimeRank:null,
					minAuctionDays:null,
					maxAuctionDays:null,
					minAuctionDaysRank:null,
					maxAuctionDaysRank:null,
					minFare:null,
					maxFare:null,
					minFareRank:null,
					maxFareRank:null,
					itemLocation:null,
					minWatchers:null,
					maxWatchers:null,
					minWatchersRank:null,
					maxWatchersRank:null,
					sellerName:null,
					minReviewCnt:null,
					maxReviewCnt:null,
					minReviewCntRank:null,
					maxReviewCntRank:null,
					minPositiveRate:null,
					maxPositiveRate:null,
					minPositiveRateRank:null,
					maxPositiveRateRank:null,
					topRatedFlag:null,
					minPositiveCnt:null,
					maxPositiveCnt:null,
					minPositiveCntRank:null,
					maxPositiveCntRank:null,
					minNeutralCnt:null,
					maxNeutralCnt:null,
					minNeutralCntRank:null,
					maxNeutralCntRank:null,
					minNegativeCnt:null,
					maxNegativeCnt:null,
					minNegativeCntRank:null,
					maxNegativeCntRank:null,
					minOpenTime:null,
					maxOpenTime:null,
					minOpenTimeRank:null,
					maxOpenTimeRank:null,
					minItemAsDescribed:null,
					maxItemAsDescribed:null,
					minItemAsDescribedRank:null,
					maxItemAsDescribedRank:null,
					minCommunication:null,
					maxCommunication:null,
					minCommunicationRank:null,
					maxCommunicationRank:null,
					minShippingTime:null,
					maxShippingTime:null,
					minShippingTimeRank:null,
					maxShippingTimeRank:null,
					minShippingCharges:null,
					maxShippingCharges:null,
					minShippingChargesRank:null,
					maxShippingChargesRank:null,
				},
				searchIsShow:{
					title:true,
					WebRank:true,
					Price:true,
					PriceRank:true,
					BidsCnt:false,
					BidsCntRank:false,
					EndTime:false,
					EndTimeRank:false,
					AuctionDays:false,
					AuctionDaysRank:false,
					Fare:false,
					FareRank:false,
					itemLocation:false,
					Watchers:false,
					WatchersRank:false,
					sellerName:false,
					ReviewCnt:false,
					ReviewCntRank:false,
					PositiveRate:false,
					PositiveRateRank:false,
					topRatedFlag:false,
					PositiveCnt:false,
					PositiveCntRank:false,
					NeutralCnt:false,
					NeutralCntRank:false,
					NegativeCnt:false,
					NegativeCntRank:false,
					OpenTime:false,
					OpenTimeRank:false,
					ItemAsDescribed:false,
					ItemAsDescribedRank:false,
					Communication:false,
					CommunicationRank:false,
					ShippingTime:false,
					ShippingTimeRank:false,
					ShippingCharges:false,
				},
				ClassifyArray:[
					{label:'标题',sign:"title"},
					{label:'自然搜索',sign:"WebRank"},
					{label:'价格',sign:"Price"},
					{label:'价格排名',sign:"PriceRank"},
					{label:'bids数',sign:"BidsCnt"},
					{label:'bids数排名',sign:"BidsCntRank"},
					{label:'剩余时间',sign:"EndTime"},
					{label:'剩余时间排名',sign:"EndTimeRank"},
					{label:'拍卖天数',sign:"AuctionDays"},
					{label:'拍卖天数排名',sign:"AuctionDaysRank"},
					{label:'运费',sign:"Fare"},
					{label:'运费排名',sign:"FareRank"},
					{label:'项目所在地',sign:"itemLocation"},
					{label:'Watchers',sign:"Watchers"},
					{label:'Watchers排名',sign:"WatchersRank"},
					{label:'卖家名称',sign:"sellerName"},
					{label:'卖家评价数',sign:"ReviewCnt"},
					{label:'卖家评价数排名',sign:"ReviewCntRank"},
					{label:'卖家好评率',sign:"PositiveRate"},
					{label:'卖家好评率排名',sign:"PositiveRateRank"},
					{label:'是否TOP RATED',sign:"topRatedFlag"},
					{label:'卖家月新增好评数',sign:"PositiveCnt"},
					{label:'卖家月新增好评数排名',sign:"PositiveCntRank"},
					{label:'卖家月新增中评数',sign:"NeutralCnt"},
					{label:'卖家月新增中评数排名',sign:"NeutralCntRank"},
					{label:'卖家月新增差评数',sign:"NegativeCnt"},
					{label:'卖家月新增差评数排名',sign:"NegativeCntRank"},
					{label:'开店时间',sign:"OpenTime"},
					{label:'开店时间排名',sign:"OpenTimeRank"},
					{label:'Item as described',sign:"ItemAsDescribed"},
					{label:'Item as described排名',sign:"ItemAsDescribedRank"},
					{label:'Communication',sign:"Communication"},
					{label:'Communication排名',sign:"CommunicationRank"},
					{label:'ShippingTime',sign:"ShippingTime"},
					{label:'ShippingTime排名',sign:"ShippingTimeRank"},
					{label:'ShippingCharges',sign:"ShippingCharges"},
					{label:'ShippingCharges排名',sign:"ShippingChargesRank"},
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
					        	params: {taskId:scope.row.taskId,parentAsin:scope.row.parentAsin,url:"ebTaskAuctionRankCurveList"},
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
						render(h, scope) {
							let { title } = scope.row
							return title ? (
							  <el-tooltip open-delay={300} content={title} placement="top">
								<span class="fix__row_2">{title}</span>
							  </el-tooltip>
							) : (
							  <span>-</span>
							)
						}
					},
					{
					    label: "自然排名搜索",
					    value: "webRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "价格",
					    value: "price",
						sortable:"custom",
					},
					{
					    label: "价格排名",
					    value: "priceRank",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "bids数",
					    value: "bidsCnt",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "bids数排名",
					    value: "bidsCntRank",
						sortable:"custom",
						minWidth:'110',
					},
					{
					    label: "剩余时间",
					    value: "endTime",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "剩余时间排名",
					    value: "endTimeRank",
						sortable:"custom",
						minWidth:'120',
					},
					{
					    label: "发布的几天拍卖",
					    value: "auctionDays",
						sortable:"custom",
						minWidth:'130',
					},
					{
					    label: "发布的几天拍卖排名",
					    value: "auctionDaysRank",
						sortable:"custom",
						minWidth:'160',
					},
					{
					    label: "运费",
					    value: "fare",
						sortable:"custom",
						minWidth:'70',
					},
					{
					    label: "运费排名",
					    value: "fareRank",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "项目所在地",
					    value: "itemLocation",
						minWidth:'120',
					},
					{
					    label: "Watchers",
					    value: "watchers",
						sortable:"custom",
						minWidth:'100',
					},
					{
					    label: "Watchers排名",
					    value: "watchersRank",
						sortable:"custom",
						minWidth:'130',
					},
					{
					    label: "卖家名称",
					    value: "sellerName",
						minWidth:'100',
					},
					{
					    label: "卖家评论数",
					    value: "reviewCnt",
						sortable:"custom",
						minWidth:'110',
					},
					{
					    label: "卖家评论数排名",
					    value: "reviewCntRank",
						sortable:"custom",
						minWidth:'130',
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
					    label: "卖家月新增中评数",
					    value: "neutralCntD30",
						sortable:"custom",
						minWidth:'160',
					},
					{
					    label: "卖家月新增中评数排名",
					    value: "neutralCntD30Rank",
						sortable:"custom",
						minWidth:'180',
					},
					{
					    label: "卖家月新增差评数",
					    value: "negativeCntD30",
						sortable:"custom",
						minWidth:'160',
					},
					{
					    label: "卖家月新增差评数排名",
					    value: "negativeCntD30Rank",
						sortable:"custom",
						minWidth:'180',
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
					    label: "卖家四项评分",
						minWidth:'150',
					    merge:[
					        {
					            label: "Item as described",
					            value: "itemAsDescribed",
					            sortable:"custom",
								width:'150',
					        },
					         {
					            label: "Item as described排名",
					            value: "itemAsDescribedRank",
					            sortable:"custom",
								width:'180',
					        },
					         {
					            label: "Communication",
					            value: "communication",
					            sortable:"custom",
								width:'140',
					        },
					        {
					            label: "Communication排名",
					            value: "communicationRank",
					            sortable:"custom",
								width:'160',
					        },
							{
							    label: "Shipping time",
							    value: "shippingTime",
							    sortable:"custom",
								width:'130',
							},
							{
							    label: "Shipping time排名",
							    value: "shippingTimeRank	",
							    sortable:"custom",
								width:'150',
							},
							{
							    label: "Shipping charges",
							    value: "shippingCharges	",
							    sortable:"custom",
								width:'150',
							},
							{
							    label: "Shipping charges排名",
							    value: "shippingChargesRank",
							    sortable:"custom",
								width:'170',
							},
					    ],
					},
				],
				selectList:[],
				tableLoading:false,
			}
		},
		created(){
			this.outerParams.taskId=this.$route.query.taskId;//任务id
			this.getPlace()
		},
		methods:{
			getPlace(){
				this.$api['ebTaskAuctionRankListItemLocation']({
					sellerId:this.sellerId,
					siteId:this.siteId,
					taskId:this.outerParams.taskId
				}).then(data=>{
					data.data.forEach(v=>{
						this.placeList.push({label:v,value:v})
					})
					
				})
			},
			exportMethod() {
			  let param = {
			    sellerId: this.sellerId,
			    siteId: this.siteId,
				taskId:this.outerParams.taskId,
			    pageNumber: 1,
			    pageSize: 10,
				...this.listQuery
			  }
			  this.$api['ebTaskAuctionRankExportTaskDetail'](param).then(data => {
			    downloadFile(
			      data,
			      '拍卖产品详情' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
			    )
			  })
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
			requestSuccess(){
				this.tableLoading = false
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

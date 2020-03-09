<template>
    <div>
		<div>
			<el-collapse class="custom-collapse" value="`1`" accordion>
			    <el-collapse-item title="筛选条件" name="1" label-width="80px" style='text-align:left;'>
			        <el-form :inline="true" ref="searchRuleForm" :model="listQuery"  :rules="rules" >
						
						<el-form-item label="是否ASIN" prop="asinType"  v-show="searchIsShow.asinType">
							<el-select v-model="listQuery.asinType" size='small' placeholder="是否ASIN">
								<el-option label="是" :value='1' key=1 ></el-option>
								<el-option label="否" :value='0' key=0 ></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="系列状态" prop="stateArr" v-show="searchIsShow.stateArr">
							<el-select v-model="listQuery.stateArr" size='small' placeholder="系列状态" @change="changeMethod5" >
								<el-option label="启动" value='enabled' key='enabled' ></el-option>
								<el-option label="暂停" value='paused' key='paused' ></el-option>
							</el-select>
						</el-form-item>
						
						
						
			        	<el-form-item label="广告系列" prop="campaignIds" v-show="searchIsShow.campaignIds">
			        		<el-select v-on:blur="blurMethod" style="width: 440px;" filterable  multiple collapse-tags v-model="listQuery.campaignIds" size='small' clearable @visible-change="camOpenMethod" @remove-tag='camOpenMethod(false)'>
			        			<el-option v-for="item in option0" :key="item.id" :label="item.name" :value="item.id" ></el-option>
			        		</el-select>
			        	</el-form-item>
			        	
			        	<el-form-item label="广告组" prop="adGroupIds" v-show="searchIsShow.adGroupIds">
			        		<el-select style="width: 440px;" filterable  multiple collapse-tags v-model="listQuery.adGroupIds" size='small' clearable @visible-change="adgOpenMethod">
			        			<el-option v-for="item in option1" :key="item.id" :label="item.name" :value="item.id" ></el-option>
			        		</el-select>
			        	</el-form-item>
			        	
			        	<el-form-item label="广告词" prop="keywordIds" v-show="searchIsShow.keywordIds">
			        		<el-select style="width: 500px;" filterable  multiple collapse-tags v-model="listQuery.keywordIds" size='small' clearable @visible-change="openMethod"  >
			        			<el-option v-for="item in option2"  :key="item.id" :label="item.name" :value="item.id" ></el-option>
			        		</el-select>
			        	</el-form-item>
						
						<el-form-item prop="matchType" v-show="searchIsShow.matchType">
							<el-select v-model="listQuery.matchType" size='small' placeholder="广告词匹配方式">
								<el-option label="精确匹配" value="exact" key="exact" ></el-option>
								<el-option label="广泛匹配" value="broad" key="broad" ></el-option>
								<el-option label="词组匹配" value="phrase" key="phrase" ></el-option>
								<el-option label="自动匹配" value="auto" key="auto" ></el-option>
							</el-select>
						</el-form-item>						
						
						<!-- <el-form-item prop="asins"  v-show="searchIsShow.asins">
						    <el-input v-model.trim="listQuery.asins" size='small' clearable placeholder="请输入ASIN"></el-input>
						</el-form-item> -->
						
			        	<el-form-item label="曝光量" prop="impressionsMin"  v-show="searchIsShow.impressions">
			        	    <el-input v-model.number="listQuery.impressionsMin" size='small' clearable style="width: 100px;"></el-input>
			        	</el-form-item>
			        	<el-form-item label="~" prop="impressionsMax" v-show="searchIsShow.impressions">
			        	    <el-input v-model.number="listQuery.impressionsMax" size='small' clearable style="width: 100px;"></el-input>
			        	</el-form-item>
			        				   		        				        				        	
			        	<el-form-item label="点击量" prop="clicksMin"  v-show="searchIsShow.clicks">
			        	    <el-input v-model.number="listQuery.clicksMin" size='small' clearable style="width: 100px;"></el-input>
			        	</el-form-item>
			        	<el-form-item label="~" prop="clicksMax" v-show="searchIsShow.clicks">
			        	    <el-input v-model.number="listQuery.clicksMax" size='small' clearable style="width: 100px;"></el-input>
			        	</el-form-item>
			        	
			        	<el-form-item label="点击率" prop="clickRatesMin1"  v-show="searchIsShow.clickRates">
			        	    <el-input v-model.number="listQuery.clickRatesMin1" size='small' clearable style="width: 100px;"></el-input>%
			        	</el-form-item>
			        	<el-form-item label="~" prop="clickRatesMax1" v-show="searchIsShow.clickRates">
			        	    <el-input v-model.number="listQuery.clickRatesMax1" size='small' clearable style="width: 100px;"></el-input>%
			        	</el-form-item>
						
						<el-form-item label="ACOS" prop="acosMin1" v-show="searchIsShow.acos">
						    <el-input v-model.number="listQuery.acosMin1" size='small' clearable style="width: 100px;"></el-input>%
						</el-form-item>
						<el-form-item label="~" prop="acosMax1" v-show="searchIsShow.acos">
						    <el-input v-model.number="listQuery.acosMax1" size='small' clearable style="width: 100px;"></el-input>%
						</el-form-item>
						
						<el-form-item label="CPC" prop="cpcMin" v-show="searchIsShow.cpc">
						    <el-input v-model.number="listQuery.cpcMin" size='small' clearable style="width: 100px;"></el-input>
						</el-form-item>
						<el-form-item label="~" prop="cpcMax" v-show="searchIsShow.cpc">
						    <el-input v-model.number="listQuery.cpcMax" size='small' clearable style="width: 100px;"></el-input>
						</el-form-item>
			        	
			        	<el-form-item label="转化率" prop="adConversionRatesMin1"  v-show="searchIsShow.adConversionRates">
			        	    <el-input v-model.number="listQuery.adConversionRatesMin1" size='small' clearable style="width: 100px;"></el-input>%
			        	</el-form-item>
			        	<el-form-item label="~" prop="adConversionRatesMax1" v-show="searchIsShow.adConversionRates">
			        	    <el-input v-model.number="listQuery.adConversionRatesMax1" size='small' clearable style="width: 100px;"></el-input>%
			        	</el-form-item>
			        				   			        				        				        				        	
						<el-form-item label="订单量" prop="orderCntMin" v-show="searchIsShow.orderCnt">
						    <el-input v-model.number="listQuery.orderCntMin" size='small' clearable style="width: 100px;"></el-input>
						</el-form-item>
						<el-form-item label="~" prop="orderCntMax" v-show="searchIsShow.orderCnt">
						    <el-input v-model.number="listQuery.orderCntMax" size='small' clearable style="width: 100px;"></el-input>
						</el-form-item>
						
						<el-form-item  label="等于" prop="keywordQuerys"  v-show="searchIsShow.keywordQuerys">
							<el-input v-model.trim="listQuery.keywordQuerys" size='small' placeholder="请输入搜索词,一行一个" type='textarea'  :rows="2" style='width:300px;' clearable></el-input>
						</el-form-item>
						<el-form-item label="包含" prop='include' v-show="searchIsShow.include">
						    <el-input v-model="listQuery.include" size='small' placeholder="请输入搜索词,一行一个" type='textarea'  :rows="2" style='width:300px;'></el-input>
						</el-form-item>
						<el-form-item label="不包含" prop='exclude' v-show="searchIsShow.exclude">
						    <el-input v-model="listQuery.exclude" size='small' placeholder="请输入搜索词,一行一个" type='textarea'  :rows="2" style='width:300px;'></el-input>
						</el-form-item>
						<el-form-item label="排除" prop='barring' v-show="searchIsShow.barring">
						    <el-input v-model="listQuery.barring" size='small' placeholder="请输入搜索词,一行一个" type='textarea'  :rows="2" style='width:300px;'></el-input>
						</el-form-item>
						
			        	<el-form-item label="时间" prop="time" v-show="searchIsShow.time">
			        	    <el-date-picker
			        	        v-model="listQuery.time"
			        	        type="daterange"
			        	        size='small'
			        	        value-format='yyyy-MM-dd'
			        			 style="width: 250px;"
			        			:picker-options = "pickerOptions"
			        	        >
			        	    </el-date-picker>
			        	</el-form-item>
						
						<el-form-item prop="newQueryType" v-show="searchIsShow.newQueryType">
							<el-select v-model="listQuery.newQueryType" size='small' placeholder="全部搜索词"  >
								<el-option label="全部搜索词" :value='null' ></el-option>
								<el-option label="新词" :value='1' ></el-option>
								<el-option label="旧词" :value='0' ></el-option>
							</el-select>
						</el-form-item>
						
			        	<el-form-item>
			        		<el-button type="primary" size="small" @click="searchMethod(false,{},1)" icon="el-icon-search" :loading="tableLoading">搜索</el-button>
			        	</el-form-item>
			        	<el-form-item>
			        		<el-button type="primary" plain size="small" @click="resetMethod" :loading="tableLoading">重置搜索</el-button>
			        	</el-form-item>
			        	<el-form-item>
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
			        					:style="{marginLeft:item.label==='是否ASIN'?'30px':''}"
			        				>
			        					{{item.label}}
			        				</el-checkbox>
			        			</el-checkbox-group>
			        			<el-button size="small" type="primary"  plain  slot="reference" >自定义筛选条件</el-button>
			        		</el-popover>
			        	</el-form-item>
			        </el-form>
			    </el-collapse-item>
			</el-collapse>
			<el-tabs v-model="activeName" @tab-click='tabClick' type="card" style="margin-top: 15px;">
			    <el-tab-pane label="成交" name="first" :lazy='true'>
					<keep-alive>
						<clinch-deal-word ref="firstChild" />
					</keep-alive>
			    </el-tab-pane>
			    <el-tab-pane label="零成交" name="second" :lazy='true'>
					<keep-alive>
						<zero-clinch-word ref="secondChild" />
					</keep-alive>
			    </el-tab-pane>
			</el-tabs>
		</div>
    </div>
</template>

<script>
import clinchDealWord from './page/clinchDealWord.vue'
import zeroClinchWord from './page/zeroClinchWord.vue'
export default {
    data() {
        return {
			activeName:'first',
            tableLoading:false,
            isIndeterminate:true,
            checkAll:false,
            checkedClassify:['是否ASIN','系列状态','广告系列','广告组','广告词'],
            listQuery:{
				asinType:0,
				stateArr:'enabled',
            	campaignIds:null,
            	adGroupIds:null,
            	keywordIds:null,
				matchType:null,
				keywordQuerys:null,
				// asins:null,
            	impressionsMin:null,
            	impressionsMax:null,           	
            	clicksMin:null,
            	clicksMax:null,
            	clickRatesMin1:null,
            	clickRatesMax1:null,
				acosMin1:null,
				acosMax1:null,
				cpcMin:null,
				cpcMax:null,
            	adConversionRatesMin1:null,
            	adConversionRatesMax1:null,        	
				orderCntMin:null,
				orderCntMax:null,
				include:null,
				exclude:null,
				barring:null,
            	time:null,
				newQueryType:null,
            },
            searchIsShow:{
				asinType:true,
				stateArr:true,
            	campaignIds:true,
            	adGroupIds:true,
            	keywordIds:true,
				matchType:false,
				keywordQuerys:false,
				// asins:false,
            	impressions:false,           	
            	clicks:false,
            	clickRates:false,
				acos:false,
				cpc:false,
            	adConversionRates:false,            	
				orderCnt:false,
				include:false,
				exclude:false,
				barring:false,
            	time:false,
				newQueryType:false
            },
            ClassifyArray:[
				
				{label:'是否ASIN',sign:"asinType"},
				{label:'系列状态',sign:"stateArr"},				
            	{label:'广告系列',sign:"campaignIds"},
            	{label:'广告组',sign:"adGroupIds"},
            	{label:'广告词',sign:"keywordIds"},
				{label:'匹配类型',sign:"matchType"},				
            	{label:'曝光量',sign:"impressions"},           	
            	{label:'点击量',sign:"clicks"},
            	{label:'点击率',sign:"clickRates"},
				{label:'ACOS',sign:"acos"},
				{label:'CPC',sign:"cpc"},
            	{label:'转化率',sign:"adConversionRates"},          	
				{label:'订单量',sign:"orderCnt"},
				{label:'等于',sign:"keywordQuerys"},
				{label:'包含',sign:"include"},
				{label:'不包含',sign:"exclude"},
				{label:'排除',sign:"barring"},
            	{label:'时间',sign:"time"},
				{label:'是否新词',sign:"newQueryType"},
            ],
            rules:{},
            pickerOptions:{
            	disabledDate(time) {
            		return  time.getTime() > Date.now() - 15 * 3600 * 1000
            	}
            },
			option0:[],
			option1:[],
			option2:[],
        };
    },
	methods:{
		searchMethod(exportType = false,sortData = {} , pageNumber){
			let name = this.activeName
			let data = this.listQuery
			let params = {
				asinType:data.asinType,
				campaignIds:data.campaignIds && data.campaignIds.length ? data.campaignIds : null,
				adGroupIds:data.adGroupIds && data.adGroupIds.length ? data.adGroupIds : null,
				keywordIds:data.keywordIds && data.keywordIds.length ? data.keywordIds : null,
				matchType:data.matchType,
				keywordQuerys: data.keywordQuerys ? data.keywordQuerys.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') :null,
				// asins:data.asins ? [data.asins] : null,
				impressionsMin:data.impressionsMin,
				impressionsMax:data.impressionsMax,				
				clicksMin:data.clicksMin,
				clicksMax:data.clicksMax,
				clickRatesMin:data.clickRatesMin1 ? data.clickRatesMin1/100 : null,
				clickRatesMax:data.clickRatesMax1 ? data.clickRatesMax1/100 : null,
				acosMin:data.acosMin1 ? data.acosMin1/100 : null,
				acosMax:data.acosMax1 ? data.acosMax1/100 : null,
				cpcMin:data.cpcMin,
				cpcMax:data.cpcMax,				
				adConversionRatesMin:data.adConversionRatesMin1 ? data.adConversionRatesMin1/100 : null,
				adConversionRatesMax:data.adConversionRatesMax1 ? data.adConversionRatesMax1/100 : null,
				orderCntMin:data.orderCntMin,
				orderCntMax:data.orderCntMax,
				include: data.include ? data.include.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') :null,
				exclude: data.exclude ? data.exclude.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') :null,
				barring: data.barring ? data.barring.split(/[\n|\r\n|\,|\，]/).map(el => el.trim()).filter(el => el !== '') :null,
				startTime:data.time && data.time.length ? data.time[0] : null,
				endTime:data.time && data.time.length ? data.time[1] : null,
				newQueryType:data.newQueryType,
				...sortData
			}
			if(exportType) return params
			this.tableLoading = true
			if(name === 'first'){
				if(pageNumber) this.$refs.firstChild.$refs.layout.pageNo = pageNumber
				this.$refs.firstChild.$refs.layout.getList(params)
			}
			if(name === 'second'){
				if(pageNumber) this.$refs.firstChild.$refs.layout.pageNo = pageNumber
				this.$refs.secondChild.$refs.layout.getList(params)
			}
		},
		resetMethod(){
			this.tableLoading = true
			this.listQuery = {
				asinType:0,
				stateArr:'enabled',
				campaignIds:[],
				adGroupIds:[],
				keywordIds:[],
				matchType:null,
				keywordQuerys:null,
				impressionsMin:null,
				impressionsMax:null,           	
				clicksMin:null,
				clicksMax:null,
				clickRatesMin1:null,
				clickRatesMax1:null,
				acosMin1:null,
				acosMax1:null,
				cpcMin:null,
				cpcMax:null,
				adConversionRatesMin1:null,
				adConversionRatesMax1:null,        	
				orderCntMin:null,
				orderCntMax:null,
				include:null,
				exclude:null,
				barring:null,
				time:null,
				newQueryType:null
			}
			this.getOption0()
			let name = this.activeName
			if(name === 'first'){
				this.searchMethod()
			}
			if(name === 'second'){
				this.searchMethod()
			}
			
		},
		tabClick(){
			this.$nextTick(function(){
				this.searchMethod()
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
		blurMethod(e){
			console.log(e)
		},
		getOption(){
			this.getOption0()
		},
		getOption0(){
			this.$api['adKeywordQueryAdDataOption']({adType:0,platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,stateArr:[this.listQuery.stateArr]}).then((res)=>{
				this.option0 = res.data
			})
		},
		getOption1(){
			this.$api['adKeywordQueryAdDataOption']({adType:1,platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,campaignIds:this.listQuery.campaignIds && this.listQuery.campaignIds.length ? this.listQuery.campaignIds : null}).then((res)=>{
				this.option1 = res.data
			})
		},
		getOption2(){
			this.$api['adKeywordQueryAdDataOption']({adType:2,platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId,campaignIds:this.listQuery.campaignIds && this.listQuery.campaignIds.length ? this.listQuery.campaignIds : null,adGroupIds:this.listQuery.adGroupIds && this.listQuery.adGroupIds.length ? this.listQuery.adGroupIds : null}).then((res)=>{
				this.option2 = res.data
			})
		},
		changeMethod0(){
			this.getOption1()
			this.getOption2()
			this.listQuery.adGroupIds = []
			this.listQuery.keywordIds = []
		},
		changeMethod1(){
			this.getOption2()
			this.listQuery.keywordIds = []
		},
		openMethod(e){
			// if(e && this.option1 && this.option1.length && this.options2 && this.options2.length) return this.$message.warning('请先选择广告系列')
		},
		changeMethod5(e){
			this.listQuery.campaignIds = []
			this.listQuery.adGroupIds = []
			this.listQuery.keywordIds = []
			this.getOption0()
		},
		camOpenMethod(e){
			if(!e){
				this.changeMethod0()
			}			
		},
		adgOpenMethod(e){
			if(!e){
				this.changeMethod1()
			}	
		}
	},
    components:{
		clinchDealWord,
		zeroClinchWord
    },
	created(){
			
	},
	mounted(){
		this.getOption()
		this.searchMethod()
	},
};
</script>


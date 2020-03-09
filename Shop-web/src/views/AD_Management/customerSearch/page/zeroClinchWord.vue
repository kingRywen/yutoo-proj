<template>
	<MainLayout
	    :outerParams="outerParams"
	    :searchFields="searchFields"
	    :editBtns="editBtns"
		:edits="edits"
	    :columns="columns"
	    :searchFunc="searchFunc"
		@requestSuccess = "requestSuccess"
		:showSearch = 'false'
	    ref="layout"
	    url="adKeywordQueryList"
		:cancelGetList = "false"
		:getSummaries = 'getSummaries'
		:getSort = 'true'
		@parentGetList = 'parentGetList'
	    >  
		<!-- <template slot="search">
			<el-form :inline="true" ref="searchRuleForm" :model="listQuery"  :rules="rules" >
				<el-form-item label="广告系列" prop="campaignIds" v-show="searchIsShow.campaignIds">
					<el-select  style="width: 440px;" filterable  multiple collapse-tags v-model="listQuery.campaignIds" size='small' clearable @change="changeMethod0">
						<el-option v-for="item in option0" :label="item.name" :value="item.id" ></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="广告组" prop="adGroupIds" v-show="searchIsShow.adGroupIds">
					<el-select style="width: 440px;"  filterable  multiple collapse-tags v-model="listQuery.adGroupIds" size='small' clearable @change="changeMethod1" @visible-change="openMethod">
						<el-option v-for="item in option1" :label="item.name" :value="item.id" ></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="关键词" prop="keywordIds" v-show="searchIsShow.keywordIds">
					<el-select style="width: 500px;"  filterable  multiple collapse-tags v-model="listQuery.keywordIds" size='small' clearable @visible-change="openMethod">
						<el-option v-for="item in option2" :label="item.name" :value="item.id" ></el-option>
					</el-select>
				</el-form-item>
				
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
				<el-form-item>	
					<el-button type="primary" size="small" @click="searchMethod" icon="el-icon-search" :loading="tableLoading">搜索</el-button>
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
								:style="{marginLeft:item.label==='广告系列'?'30px':''}"
							>
								{{item.label}}
							</el-checkbox>
						</el-checkbox-group>
						<el-button size="small" type="primary"  plain  slot="reference" >自定义筛选条件</el-button>
					</el-popover>
				</el-form-item>
			</el-form>
			
			
		</template> -->
	</MainLayout> 
</template>

<script>
	import { downloadFile,totalMethod } from 'Utils/tools'
	export default{
		data(){
			let vm = this
			return{
				tableLoading:false,
				isIndeterminate:true,
				checkAll:false,
				checkedClassify:['广告系列','广告组','关键词'],
				listQuery:{
					campaignIds:null,
					adGroupIds:null,
					keywordIds:null,
					impressionsMin:null,
					impressionsMax:null,
					clicksMin:null,
					clicksMax:null,
					clickRatesMin1:null,
					clickRatesMax1:null,
					time:null,
				},
				searchIsShow:{
					campaignIds:true,
					adGroupIds:true,
					keywordIds:true,
					impressions:false,
					clicks:false,
					clickRates:false,
					time:false,
				},
				ClassifyArray:[
					{label:'广告系列',sign:"campaignIds"},
					{label:'广告组',sign:"adGroupIds"},
					{label:'关键词',sign:"keywordIds"},
					{label:'曝光量',sign:"impressions"},
					{label:'点击量',sign:"clicks"},
					{label:'点击率',sign:"clickRates"},
					{label:'时间',sign:"time"},
				],
				pickerOptions:{
					disabledDate(time) {
						return  time.getTime() > Date.now() - 15 * 3600 * 1000
					}
				},
				rules:{},
				edits:[
					{
					    name: "查看分析",
					    icon: "el-icon-search",
					    show: scope => {
					          return  true
					    },
					    fn: (scope) => {
							this.$refs.layout.$dialog({
								title: '数据展示',
								width: '1200px',
								showMaxBtn: true,
								params: { dealFlag:0,keywordQuery: scope.row.keywordQuery, campaignIds: vm.$parent.$parent.$parent.listQuery.campaignIds && vm.$parent.$parent.$parent.listQuery.campaignIds.length ? vm.$parent.$parent.$parent.listQuery.campaignIds : null,adGroupIds: vm.$parent.$parent.$parent.listQuery.adGroupIds && vm.$parent.$parent.$parent.listQuery.adGroupIds.length ? vm.$parent.$parent.$parent.listQuery.adGroupIds : null,keywordIds: vm.$parent.$parent.$parent.listQuery.keywordIds && vm.$parent.$parent.$parent.listQuery.keywordIds.length ? vm.$parent.$parent.$parent.listQuery.keywordIds : null,url:'adKeywordQueryAdHistoryStat'},
								component: () => import('../dialog/echarts.vue'),
							})
					    }
					}
				],
				searchFields:[],
				editBtns:[
					{
						name:'导出',
						showLoading:true,
						fn:()=>{
							let data = vm.getSelection().map(e=>e.keywordQuery)
							return this.exportMethod(data)
						}
					},
					{
						name:'复制关键词',
						disabled:selection => {
							return selection.length == 0
						},
						fn:()=>{
							let data = vm.getSelection().map(e=>e.keywordQuery)
							let str = ''
							str = data.join('\n')
							vm.$copyText(str).then(function (e) {
							  vm.$message.success('复制成功')
							}, function (e) {
							  vm.$message.error('复制失败')
							})
						}
					},
					{
						name:'加入系列否定词',
						disabled:selection => {
							return selection.length == 0
						},
						fn:()=>{
							let datas = vm.getSelection().map(e=>e.keywordQuery)
							this.$refs.layout.$dialog({
								title: "加入系列否定词",
								width:'600px',
								params: {datas:datas,fn:vm.manualFn},
								component: () => import('../dialog/add.vue'),
								okBtnText:'确认',
								cancelBtnText:'取消'
							});
						}
					},
					{
					    name: '导入搜索词数据',
					    fn: ()=>{
					        vm.$refs.layout.$dialog({
					            title:'导入搜索词数据',
					            width:'500px',
					            params:{
					                fn:vm.$refs.layout.closeDialog,
					                success: vm.$refs.layout.getList
					            },
					            component: () => import("../dialog/import"),
					            cancelBtnText:'关闭',
					        }); 
					    }
					},
				],
				columns:[
					
					{
					    label: "客户搜索词",
					    value: "keywordQuery",
						align:'left',
						showTooltip:true,
					},
					{
					    label: "曝光量",
					    value: "impressions",
						sortable:"custom",
					},
					{
					    label: "点击量",
					    value: "clicks",
						sortable:"custom",
					},
					{
					    label: "点击率",
					    value: "clickRates",
						sortable:"custom",
						isPercent:true,
						keepFew:2,
					},
				],
				option0:[],
				option1:[],
				option2:[],
			}
		},
		methods:{
			manualFn(){
				this.$parent.$parent.$parent.searchMethod(false)
			},
			parentGetList(data){
				this.$parent.$parent.$parent.searchMethod(false,data)
			},
			getSummaries(param) {
				
				const { columns, data } = param;
				const sums = [];
				const sums1 = [];
				//循环处理所有列数据
				columns.forEach((column, index) => {
				  if (index === 0) {
					sums[index] = '合计';
					return;
				  }
				  
				  if (index === 2 || index === 3 ) {
					 const values = data.map(item => Number(item[column.property]));
					 if (!values.every(value => isNaN(value))) {
						sums[index] = totalMethod(values)
						sums[index] += '';
					 } else {
						sums[index] = '';
					 }
				  }
				  if (index === 4 ) {
					 const values1 = data.map(e=>Number(e.clicks));
					 const values2 = data.map(e=>Number(e.impressions));
					 if (!values1.every(value => isNaN(value))) {
						sums[index] = totalMethod(values1)						
						sums1[index] = totalMethod(values2)						
						sums[index] = sums[index] / sums1[index]
						sums[index] = sums[index] * 100
						sums[index] = sums[index].toFixed(2) 
						sums[index] += '%';
					 } else {
					 	sums[index] = '';
					 }
				  }
				});
					 
				return sums;
			},
			requestSuccess(){
				this.$parent.$parent.$parent.tableLoading = false
			},
			exportMethod(data){
				let parentData = this.$parent.$parent.$parent.searchMethod(true)
				let param = {
				  ...this.outerParams,
				  ...parentData,
				  sortField:this.$refs.layout.sortData.sortField,
				  sort:this.$refs.layout.sortData.sort == 1 ? 1 : this.$refs.layout.sortData.sort == 0 ? 0 : null,
				  keywordQuerys:data && data.length ? data : null,
				}
				return this.$api['adKeywordQueryExportData'](param).then(data => {
				  downloadFile(
				    data,
				    '广告客户搜索词列表' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
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
			searchFunc(data){
				let datas = {...this.listQuery};
				let { time,clickRatesMin1,clickRatesMax1, ...info} = datas
				let [startTime, endTime] = time || [];
				let clickRatesMin = clickRatesMin1 ? clickRatesMin1/100 : null;
				let clickRatesMax = clickRatesMax1 ? clickRatesMax1/100 : null;
				return { startTime, endTime,clickRatesMin,clickRatesMax, ...info };
			},
			getOption(){
				this.getOption0()
				// this.getOption1()
				// this.getOption2()
			},
			getOption0(){
				this.$api['adKeywordQueryAdDataOption']({adType:0,platformId:this.platformId,siteId:this.siteId,sellerId:this.sellerId}).then((res)=>{
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
			openMethod(e){
				// if(e && this.option1 && this.option1.length && this.options2 && this.options2.length) return this.$message.warning('请先选择广告系列')
			}
		},
		mounted(){
			this.getOption()
		},
		computed: {
			outerParams(){
				return {
					platformId:this.platformId,
					siteId:this.siteId,
					sellerId:this.sellerId,
					dealFlag:0
				}
			},
		},
	}
</script>

<style>
</style>

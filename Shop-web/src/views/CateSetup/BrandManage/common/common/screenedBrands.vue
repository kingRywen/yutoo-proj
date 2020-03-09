<template>
	<el-container>
	  <el-tooltip class="item" style="z-index: 999;" effect="light" content="获取品牌在亚马逊搜索的前48个产品的图片,每次获取最多500个品牌,超过500个品牌时,需要在前一批获取完成后,再次点击此按钮进行获取" placement="bottom-start">
	  		<el-button style="position: absolute;right: 140px;z-index:999;" type="primary" plain @click="getImg" size="mini" v-if="btnType===0">获取图片</el-button>
	  		<el-button style="position: absolute;right: 140px;z-index:999;" type="primary" plain size="mini" loading disabled v-if="btnType===1">图片获取中</el-button>
	  </el-tooltip>
	  <el-popover
		  placement="top"
		  width="200"
		  v-model="visible"
		   style="z-index: 999;"
		  >
		  <div>
			<el-input v-model.number="picCut" placeholder="请输入1~48的数字" style="width: 130px;margin-right: 10px;" size="mini" ></el-input>
			<el-button type="primary" size="mini" @click="picNumMethod()">确定</el-button>
		  </div>
		  <el-button plain  slot="reference" type="primary" size="mini" icon="el-icon-edit" style="position: absolute;right: 20px;">图片数量</el-button>
	  </el-popover>
	  <el-main v-if="mainShow">
		  <el-row>
		    <el-col :span="24">
				<div class="mainHeader">
					<div class="img-2">
						<!-- <img :src="showData.logo" /> -->
						<span class="brandClass">品牌名称：{{showData.brand}}</span>		
					</div>					
					<div>
						<el-button type="primary" plain size="mini" @click="fastMethod('onlyAd')" >仅广告(A)</el-button>
						<el-button type="primary" plain size="mini" @click="fastMethod('layout')" >可布局(D)</el-button>
					</div>					
				</div>
			</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="24">
				<div class="mainMain" v-loading="tableLoading">
				    <MainLayout
				      :outerParams="outerParams"
					  :outerTableList = 'showData.brandList'
				      :searchFields="searchFields"
				      :editBtns="editBtns"
				      :edits="edits"
				      :showSearch="false"
				      :showSelection = 'false'
					  :isShowPag = 'false'
				      :columns="columns"
				      ref="layout"
				        >  
				    </MainLayout> 					
				</div>
			</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="24" style="border: 1px solid rgb(229,229,229);">
				<div>
				    <div class="image-group">
				      <template v-if="showData.imageList.length>0">
				        <div v-for="item in showData.imageList" class="content_wrapper">
				          <div class="__img_wrapper" style="margin:10px" >
				            <img :key="item.imageUrl" class="item-img loadingImg" v-lazy="item.imageUrl">
				          </div>
						  <div style="width: 120px;padding: 0 10px;">
							<el-tooltip placement="bottom" effect="light">
								<span slot="content">{{item.title}}</span>
							   <span class="fix__row_2">{{item.title}}</span>		
							 </el-tooltip>
						  </div>
				        </div>
				      </template>
				
				      <div
				        v-if="!(showData.imageList.length>0)"
				        style="width:100%;text-align: center;color: #909399;font-size: 14px;"
				      >暂无缓存图片</div>
				    </div>
				  </div>
				</div>
			</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="24">
		  		<div style="float: right;">
					{{currentNum}}/{{sereenedNum}}
				</div>	
		  	</el-col>
		  </el-row>
	  </el-main>
	</el-container>
</template>

<script>
import storage from "Utils/saver";
import { getArrDifference,unique } from 'Utils/tools'
export default {
	props:{
		sereenedNum:{
			type:Number,
			defalut:0,
		}
	},
    data() {
		let vm = this
		return {
			visible:false,
			showData:[],
			edits:[],
			editBtns:[],
			searchFields:[],
			preList:[],
			tableLoading:false,			
			mainShow:false,
			btnType:null,
			picCut:48,
			currentNum:0,
			columns:[
				{
					label:'序列号',
					value:'serialNumber',
				},
				{
					label:'注册号',
					value:'regNumber',
				},
				{
					label:'品牌所有者',
					value:'brandOwner',
					showTooltip:true,
					minWidth:120,
				},
				{
					label:'归属地',
					value:'countryCode',
					render(h, scope) {
						let countryCode = scope.row.countryCode
						return countryCode ? (
						  <span class="fix__row_1">{countryCode}({scope.row.chineseName})</span>
						) : (
						  <span>-</span>
						)
					},
					minWidth:120,
				},
				{
					label:'类目',
					value:'categorys',
					render(h,scope){
						let categorys = scope.row.categorys
						if(categorys && categorys.length){
							 var strCate = ''
							 strCate = categorys.join(',')
						}
						return categorys ? (
							categorys.length ? (
								categorys[0] === '' ? (
									<span>全部</span>
								) : (
									<el-tooltip  content={strCate} placement="top" effect="light">
										<span class="fix__row_1">{strCate}</span>
									</el-tooltip>
								)								
							) : (
								<span>全部</span>
							)							
						) : (
							<span>-</span>							
						)
					}
				},
				{
					label:'服务范围',
					value:'goodsAndServices',
					showTooltip:true
				},
				{
					label:'注册时间',
					value:'registrationDate',
				},
				{
					label:'操作',
					align:'left',
					width:"50px",
					render(h,scope){
						return (
							<el-tooltip content="编辑" placement="top" effect="light">
							  <el-button
							    class="right-btns"
							    type="text"
							    onClick={() => {
							      vm.$refs.layout.$dialog({
							        title:'编辑品牌归属国',
							        width:'600px',
							        params:{
							        	editType:true,
							        	siteId: vm.siteId,
							        	sellerId: vm.sellerId,
							        	platformId:vm.platformId,
										brand:scope.row.brand,
							        	serialNumbers:[scope.row.brandId],
							        	countryCode:scope.row.countryCode,
										fn:vm.currentFn
							        },
							        component: () => import("../../common/brandDialog.vue"),
							        okBtnText:'确认',
							        cancelBtnText:'取消'
							      });
							    }}
							    icon="el-icon-edit-outline"
							  ></el-button>
							</el-tooltip>
						)
					}
				},
			],
			isAdmin:0,
		}
	},
	watch:{
		currentNum(){
			this.$parent.$parent.$parent.getLIstCount()
		}
	},
	methods: {
		fastMethod(type){
			// this.$confirm(`此操作将筛选为${type==='onlyAd'?'仅广告':'可布局'},是否继续`,'提示',{type:'warning'}).then(()=>{
				let ids = []
				this.showData.brandList.forEach((e)=>{
					ids.push(e.brandId)
				})
				this.$api['brandManageUpdateBrandType']({serialNumbers:ids,brandType:type==='onlyAd'?1:2}).then(res=>{
					if (res.code == 0) {
						if(res.data == 1) this.currentNum = this.currentNum + 1
						this.getScreenedBrands()
					}
				})
			// }).catch(()=>{})
		},
		currentFn(type){
			
			if(type==='add') this.currentNum = this.currentNum + 1;
			this.getScreenedBrands()
		},
		getBtnType(){
			this.$api['brandManageGetImageFlag']().then((e)=>{
				if (e.code === 0) this.btnType = e.data
			})
		},
		picNumMethod(){
			if(!Number.isInteger(this.picCut) || this.picCut<0 || this.picCut>48) return this.$message.warning('请输入0-48之间的数字')
			this.visible = false
			this.$message.success('操作成功')
			this.getScreenedBrands()
		},
		getScreenedBrands(){		
			let params = {imageCnt:this.picCut}
			this.$api['brandManageListByNoFilterBrand'](params).then((res)=>{
				if (res.code == 0) {
					if(this.sereenedNum) this.mainShow = true
					this.showData = res.data	
					
					if (this.showData.cacheImageList.length) {
						//拿到接口返回的图片数组 新的元素数组
						let preLoads = []
						let allList = unique(this.preList.concat(this.showData.cacheImageList))
						if (this.preList.length){
							preLoads = getArrDifference(allList,this.showData.cacheImageList)
						}else{
							preLoads = this.showData.cacheImageList
						}
						
						//预加载图片					
						preLoads.forEach(img => {
							let _img = new Image()
							_img.src = img
						})
						
						//存储
						this.preList = this.showData.cacheImageList
					}
					
					
				}
			})
		},
		getImg(){
			this.$api['brandManageSendImageTask']().then((res)=>{
				if(res.code == 0) {
					this.getBtnType()
				}
			})
		},
		Method(){
			
		}
	},
	created() {		
		let vm = this
		document.onkeydown = function(e) {			
			if (vm.mainShow&&vm.$parent.$parent.currentName==='second') {
				let key = window.event.keyCode;
				if (key == 65) {
					vm.fastMethod('onlyAd')
				}
				if (key == 68) {
					vm.fastMethod('layout')
				}
			}			
		};
	},
	mounted(){
		this.getBtnType()
		this.getScreenedBrands()
		this.isAdmin = storage.get('local','isAdmin')
	},
	beforeDestroy(){
		let vm = this
		vm.mainShow = false
		document.onkeydown = null
	},
	computed:{
		outerParams(){
			return {
				sellerId:this.sellerId 
			}
		},
	}
};
</script>

<style scoped>
	.el-header {
		background-color: #fff;
		color: #333;
	}
	.el-main {
		background-color: #fff;
		color: #333;
		padding-top: 0;
	}
	.el-row {
		margin-bottom: 20px;
		&:last-child {
		  margin-bottom: 0;
		}
	}
	.el-col {
		border-radius: 4px;
	}
	.mainHeader{
		display: flex;
		// justify-content: space-between;
		// align-items: center;
		width: 100%;
	}
	.img-2{
		// display: table-cell;
		display: flex;
		// align-items: center;
		// text-align: center;
		// vertical-align: middle;		
		overflow: hidden;
		width: 40%;
		height: 40px;		
		margin-right: 0px;
	}
	.img-2 img{
		width: auto;
		max-height: 40px;
	}
	.mainHeader span{
		margin: 0 15px;
		font-size: 20px;
	}
	.mainHeader>div * {
		margin: 0 10px;
	}
	.mainMain {
		margin-top: 15px;
	}
	.image-group {
	  margin-top: 10px;
	  border: 1px solid @borderColor;
	  display: flex;
	  flex: 1;
	  flex-wrap: wrap;
	  justify-content: flex-start;
	  flex-wrap: wrap;
	  .content_wrapper {
	    // margin: 10px;
	    width: 16.5%;
	    height: 0;
	    padding-bottom: 16.5%;
	    position: relative;
	    justify-content: space-around;
	  }
	  .__img_wrapper {
	    position: absolute;
	    width: 88%;
	    height: 88%;
	    top: 2%;
	    left: 2%;
		transition: all 0.5s ease-in-out;
	  }
	}
	.brandClass{
		font-size: 20px;
		margin-left: 250px;
	}
</style>


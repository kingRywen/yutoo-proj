<template>
  <div class="box" style="position: relative;">
	<div v-if='$route.name==="ProductLibrary"'>
		<div class="drawer-btn" @click="setShow()" :style="position">
		  <i :class="icon"></i>
		</div>
		<ElRow :gutter="20" style="height: 100%;">	
			<ElCol :span="4"  v-show="isShow" style="position:relative;border-right: 1px solid #ddd;height:100%">			
				<div class="menu">
				  <div class="box-center">
					<el-input placeholder="输入类目进行过滤" v-model="filterText" size="small" class="menu-select" clearable>
					  <!-- <i slot="append" class="el-icon-search"></i> -->
					</el-input>
				  </div>
				  <div style="margin: 5px 0;height: 15px;">
					<i class="el-icon-refresh" @click="getCustomCategory" style="cursor: pointer;float: right;"></i>
				  </div>
				  <!-- node-key="cusCateId" -->
				  <el-tree
					:data="customCategoryData"
					:props="defaultProps"
					highlight-current
					@node-click="handleNodeClick"
					ref="treeCustomCategory"
					:filter-node-method="filterNode"
					v-loading="treeLoading"	
					:key="treeKey"
				  ></el-tree>
				</div>
			</ElCol>
			<ElCol  :span="isShow ? 20 : 24">
				<div class="body">
				  <div v-loading="tabsLoading" class="tabs-wrapper">
					<ElTabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
					  <ElTabPane v-for="(item, index) in statusBtnList" :name="index + ''" :item="item" :label="item[0]">
						<!-- <template slot="label">
							{{item[0]}}
							<b v-if="item[2]">{{item[2]}}</b>
						</template>-->
					  </ElTabPane>
					</ElTabs>
					<!-- <el-button style="position: absolute;right: 220px;top: 0;"  type="primary" plain @click="setManualUpdate" :loading="loadingBtn1" :disabled="BTNdisabled">
						{{refreshhtml}}
						<i class="el-icon-refresh el-icon--right"></i>
					</el-button> -->
					<el-button style="position: absolute;right: 110px;top: 0;" type="primary" plain @click="importMethod">
						导入产品
					</el-button>
					<el-button style="position: absolute;right: 0;top: 0;" type="primary" plain @click="linkMethod">
						导入日志
					</el-button>
				  </div>
				  <!-- <div style="display: flex;justify-content:space-between;">
					  <el-button-group ref="productStatusBtn">
						<el-button
						  type="primary"
						  plain
						  v-for="(item, index) in statusBtnList"
						  @click="setStatus(item[2],index,item[1])"
						>
						  <div style="display:flex;">
							{{item[0]}}
							<div class="circle" v-show="item[1]"></div>
						  </div>
						</el-button>
					  </el-button-group>
		
					  <el-button type="primary" plain @click="setManualUpdate" :loading="loadingBtn1" :disabled="BTNdisabled">
						{{refreshhtml}}
						<i class="el-icon-refresh el-icon--right"></i>
					  </el-button>
				  </div>-->
				  <el-collapse class="custom-collapse custom-collapse-1 custom-flex" v-model="activeName" accordion>
					<el-collapse-item name="1">
					  <template slot="title">
						筛选条件
						<!-- <div class="right">
						  <a class="a-btn url" @click="setIgnore" v-show="isIgnore">已忽略产品列表</a>
						</div> -->
					  </template>
		
					  <el-form
						size="small"
						class="searchForm custom-search"
						:inline="true"
						:model="listQuery"
						ref="listQueryForm"
					  >
						<el-form-item>
						  <el-input v-model.trim="listQuery.asin" placeholder="请输入ASIN或者SKU" size="small" clearable style="width:200px;"></el-input>
						</el-form-item>
						<el-form-item label="更新时间">
						  <el-date-picker
							v-model="daterange"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							size="small"
							value-format="yyyy-MM-dd"
						  ></el-date-picker>
						</el-form-item>
						<!-- ['禁止显示','4'],
									['信息待改善','3'], 
									@change="selectStatus"
						-->
						<el-form-item label="商品状态" v-if="isProductStatusShow">
						  <el-select v-model="listQuery.productStatus" placeholder="请选择" size="small">
							<el-option
							  v-for="item in productStatus"
							  :label="item[0]"
							  :value="item[1]"
							  :key="'select_status_'+item[1]"
							></el-option>
						  </el-select>
						</el-form-item>
						<el-form-item label="问题类型" v-if="isInfoChangelist==isIgnore">
						  <el-select v-model="listQuery.alertType" placeholder="请选择" size="small" clearable>
							<el-option
							  v-for="item in alertTypeOptions"
							  :key="item.value+'_alertType'"
							  :label="item.label"
							  :value="item.value"
							></el-option>
						  </el-select>
						</el-form-item>
									
									<!-- <el-form-item label="是否忽略" v-if="this.activeTabName==5">
									  <el-select v-model="listQuery.isIgnore" placeholder="请选择" size="small" clearable>
										<el-option
										  v-for="item in alertTypeOptions"
										  :key="item.value+'_alertType'"
										  :label="item.label"
										  :value="item.value"
										></el-option>
									  </el-select>
									</el-form-item> -->
		
						<el-form-item>
						  <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="listLoading">搜索</el-button>
						  <el-button size="small" type="primary" :disabled="listLoading" plain @click="resetListQueryForm('all')">重置搜索</el-button>
						</el-form-item>
					  </el-form>
					</el-collapse-item>
				  </el-collapse>
				  <!-- <div class="box-query" v-if='searchShow'>
					  
				  </div>-->
		
				  <div class="box-update-btn" style="margin-top: 10px;">
					<el-button type="primary" plain size="small" @click="distribute('忽略产品')" v-if="setShowBtn('忽略产品')">忽略产品</el-button>
					<el-button type="primary" plain size="small" @click="distribute('标记已处理')" v-if="setShowBtn('标记已处理')">标记已处理</el-button>
					<el-button type="primary" plain size="small" @click="distribute('取消忽略')" v-if="setShowBtn('取消忽略')">取消忽略</el-button>
							<el-button type="primary" plain size="small" @click="setIgnore" v-if="isIgnore">已忽略产品列表</el-button>
				  </div>
		
				  <!--
								:row-key="'productId'"
								:reserve-selection="'productId'"
								分页时记录以前的选中状态
				  -->
		
				  <div class="box-data">
					<el-table
					  :row-style="showRow"
					  :cell-style="cellStyle"
					  :data="listToArray"
					  v-loading="listLoading"
					  :key="tableKey"
					  style="width: 100%"
					  :row-key="'productId'"
					  border
					  stripe
            @select="handleRowSelect"
					  tooltip-effect="light"
					  @sort-change="handleSortChange"
					  @selection-change="handleSelectionChange"
					  ref="clearTableSort"
					>
					  <!-- ref="clearTableSort" -->
					  <!-- <el-table-column type="selection" width="55" :reserve-selection="'productId'"></el-table-column> -->
					  <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
					  <el-table-column prop="sku" width="230" class-name="asin-sku" label="SKU">
						<template slot-scope="scope">
						  <div class="flex flex-wrap">
							  <ElButton
								v-if="scope.row.childList"
								class="custom-dropbtn"
								
								:disabled="scope.row.loading"
								@click="handleExpand(scope)"
								type="text"
								:icon="`el-icon-${scope.row.loading ? 'loading' : scope.row._expanded ? 'caret-bottom' : 'caret-right'}`"
							  ></ElButton>
							  <el-tooltip placement="top" effect="light" style="width:100%" v-if="scope.row.childList">
								<div slot="content">{{scope.row.sku}}</div>
								<div
								 class="text"
								 style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:80px;margin-left: 5px;"
								>{{scope.row.sku}}<span style="color: red;">({{scope.row.childList.length}})</span></div>
							  </el-tooltip>
							  <el-tooltip placement="top" effect="light" style="width:100%" v-else>
								<div slot="content">{{scope.row.sku}}</div>
								<div
								 class="text"
                 :class="{'_children': scope.row._level != 1}"
								 style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;margin-left: 23px;"
								>{{scope.row.sku}}</div>
							  </el-tooltip>
						  </div>
						</template>
					  </el-table-column>
					  <el-table-column prop="asin" width="180" class-name="asin-sku" label="ASIN">
						<template slot-scope="scope">
							<a
							  class="text"
							  :style = "!scope.row.childList ? 'null': null"
							  v-if="asinOrSkuLabel==='ASIN'"
							  :href="scope.row.productUrl"
							  target="_blank"
							  style="color:rgb(16, 142, 233)"
							>{{scope.row.asin}}</a>
						 <!-- <div class="flex flex-wrap">

							
							<div
							  class="text"
							  :style = "!scope.row.childList ? 'null': null"
							  v-else-if="asinOrSkuLabel==='SKU'"
							>
							  <el-tooltip placement="top" effect="light" style="width:100%">
								<div slot="content">{{scope.row.sku}}</div>
								<div
								  style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;"
								>{{scope.row.sku}}</div>
							  </el-tooltip>
							</div>
						  </div> -->
						</template>
					  </el-table-column>
					  
					  <el-table-column prop="productStatus" width="105" label="产品状态">
						<template slot-scope="scope">
						  <div v-if="scope.row.productStatus==1">在售</div>
						  <div v-else-if="scope.row.productStatus==2">不可售(缺货)</div>
						  <div v-else-if="scope.row.productStatus==3">不可售(停售)</div>
						  <div v-else-if="scope.row.productStatus==4">禁止显示</div>
						</template>
					  </el-table-column>
					  <el-table-column prop="imageUrl" width="100" label="主图">
						<template slot-scope="scope">
						  <el-popover placement="right" trigger="hover">
							<div
							  class="__img_wrapper mar-auto"
							  :style="{width:'200' + 'px', height:'200' + 'px'}"
							>
							  <img class="loadingImg" v-lazy="scope.row.imageUrl" style="object-fit: contain;overflow: hidden;">
							</div>
							<div class="__img_wrapper" slot="reference">
							  <img
								class="loadingImg"
								:key="scope.row.imageUrl"
								v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'"
							  >
							</div>
						  </el-popover>
										
						</template>
					  </el-table-column>
					  <el-table-column prop="amzCateName" min-width="120" label="所属类目" show-overflow-tooltip></el-table-column>
					  <!-- <el-table-column prop="createTime" width="140" label="添加时间"></el-table-column> -->
					  <el-table-column prop="updateTime" width="140" label="更新时间" :sortable="'custom'"></el-table-column>
					  <el-table-column prop="quantity" width="100" label="库存量" :sortable="'custom'"></el-table-column>
					  <el-table-column prop="deliveryType" width="140" label="发货方式">
						<template slot-scope="scope">{{scope.row.deliveryType?scope.row.deliveryType:"-"}}</template>
					  </el-table-column>
					  <el-table-column min-width="85" label="问题类型" v-if="!(isInfoChangelist&&!isIgnore)">
						<template slot-scope="scope">
						  <div v-if="isInfoChangelist" class="event-list">
							<div v-if="scope.row.eventList">
							  <div v-if="scope.row.eventList.length>0" style="margin-top:10px;">
								<el-badge :value="getBadgeValue(scope.row.eventList)" style="margin-right:15px;">
								  <el-button
									size="small"
									@click="showEventListDialog(scope.row.eventList,scope.row.productId)"
								  >{{getEventType(scope.row.eventList[0].eventType)}}</el-button>
								</el-badge>
							  </div>
							</div>
						  </div>
						  <div v-else>
							<ElTooltip :content="scope.row.explanation" placement="top" :open-delay="200">
							  <span class="fix__row_1">{{scope.row.explanation}}</span>
							</ElTooltip>
						  </div>
						</template>
					  </el-table-column>
					  <el-table-column label="操作" width="55">
						<template slot-scope="scope">
						  <!-- <el-tooltip effect="light" content="编辑" placement="top-start" v-if="isIgnore===isInfoChangelist">
										<el-button  type="text" size="small" icon="el-icon-edit-outline" @click="reCrawl(scope.row)"></el-button>
						  </el-tooltip>-->
						  <el-tooltip effect="light" content="查看日志" placement="top-start">
							<el-button type="text" size="small" icon="el-icon-tickets" @click="showLogDialog(scope.row)"></el-button>
						  </el-tooltip>
						</template>
					  </el-table-column>
					</el-table>
		
					<el-pagination
					  background
					  @size-change="handleSizeChange"
					  @current-change="handleCurrentChange"
					  :current-page="listQuery.pageNumber"
					  :page-sizes="[10,20,30, 50]"
					  :page-size="listQuery.pageSize"
					  class="mt10"
					  layout="total, sizes, prev, pager, next, jumper"
					  :total="total"
					></el-pagination>
				  </div>
				</div>
			</ElCol>
		</ElRow>
		<yt-dialog :options="logOptions" :events="logEvents" class="log-dialog">
		  <el-table
		    :data="logList"
		    v-loading="logListLoading"
		    :key="logTableKey"
		    style="width: 100%"
		    border
		    stripe
		    tooltip-effect="light"
		  >
		    <el-table-column prop="createTime" label="时间" width="140"></el-table-column>
		    <el-table-column prop="merchantName" label="操作人" width="150"></el-table-column>
		    <el-table-column prop="remark" label="操作内容"></el-table-column>
		  </el-table>
		
		  <el-pagination
		    background
		    @size-change="handleLogSizeChange"
		    @current-change="handleLogCurrentChange"
		    :current-page="logListQuery.pageNumber"
		    :page-sizes="[10,20,30, 50]"
		    :page-size="logListQuery.pageSize"
		    class="mt10"
		    layout="total, sizes, prev, pager, next, jumper"
		    :total="logTotal"
		  ></el-pagination>
		</yt-dialog>
		
		<el-dialog title="问题类型" :visible.sync="outerVisible" width="400px" class="event-list-dialog customDialog">
		  <el-table
		    :data="eventList"
		    v-loading="eventListLoading"
		    :key="eventTableKey"
		    style="width: 100%"
		    border
		    stripe
		    tooltip-effect="light"
		  >
		    <el-table-column label="问题类型" :formatter="formatterEventType" min-width="150"></el-table-column>
		    <el-table-column label="变动SKU数" width="150">
		      <template slot-scope="scope">
		        <el-button type="text" size="small" @click="showEventDetailDialog(scope.row)">{{scope.row.eventSkuCnt}}</el-button>
		      </template>
		    </el-table-column>
		  </el-table>
		
		  <el-dialog width="800px" title="问题明细" :visible.sync="innerVisible" append-to-body class="event-list-inner-dialog customDialog" height="500px">
		    <el-table
		      :data="eventDetailList"
		      v-loading="eventDetailLoading"
		      :key="eventDetailTableKey"
		      style="width: 100%"
		      border
		      stripe
		      tooltip-effect="light"
		    >
		      <el-table-column prop="createTime" label="时间" width="135"></el-table-column>
		      <el-table-column prop="sku" label="SKU" min-width="150"></el-table-column>
		      <el-table-column prop="preContent" label="变动前" min-width="120">
		        <template slot-scope="scope">
		          <div v-if="scope.row.eventType==8" style="display:flex;justify-content: center;">
		            <!-- <el-popover
		                                placement="right"
		                                width="200"
		                                trigger="hover">
		                                <img :src="scope.row.preContent"/>
		                                <img  slot="reference" :src="scope.row.preContent" height="30"/>
		            </el-popover>-->
		            <el-popover placement="right" trigger="hover">
		              <div style="display:flex;justify-content:center;align-items:center; width: 300px;height: 150px;">
		                <div>
		                  <img :src="scope.row.preContent">
		                </div>
		              </div>
		              <img
		                slot="reference"
		                :src="scope.row.preContent"
		                height="30"
		                v-lazy="scope.row.preContent?scope.row.preContent:'-'"
		              >
		            </el-popover>
		          </div>
		          <div v-else>
									<el-tooltip placement="top"  effect="light" v-if="scope.row.preContent">
										<span slot="content">{{scope.row.preContent}}</span>
										<span class="fix__row_1">{{scope.row.preContent}}</span>
									</el-tooltip>
									<span v-else>-</span>
								</div>
		        </template>
		      </el-table-column>
		      <el-table-column prop="curContent" label="变动后" min-width="120">
		        <template slot-scope="scope">
		          <div v-if="scope.row.eventType==8" style="display:flex;justify-content: center;">
		            <!-- <el-popover
		                                    placement="right"
		                                    width="200"
		                                    trigger="hover">
		                                    <img :src="scope.row.curContent"/>
		                                    <img  slot="reference" :src="scope.row.curContent" height="30"/>
		            </el-popover>-->
		            <el-popover placement="right" trigger="hover">
		              <div style="display:flex;justify-content:center;align-items:center; width: 300px;height: 150px;">
		                <div>
		                  <img :src="scope.row.curContent">
		                </div>
		              </div>
		              <img
		                slot="reference"
		                :src="scope.row.curContent"
		                height="30"
		                v-lazy="scope.row.curContent?scope.row.curContent:'-'"
		              >
		            </el-popover>
		          </div>
		          <div v-else>
									<el-tooltip placement="top"  effect="light" v-if="scope.row.curContent">
										<span slot="content">{{scope.row.curContent}}</span>
										<span class="fix__row_1">{{scope.row.curContent}}</span>
									</el-tooltip>
									<span v-else>-</span>
								</div>
		        </template>
		      </el-table-column>
		    </el-table>
		
		    <el-pagination
		      background
		      @size-change="handleDetailSizeChange"
		      @current-change="handleDetailCurrentChange"
		      :current-page="eventDetailListQuery.pageNumber"
		      :page-sizes="[10,20,30, 50]"
		      :page-size="eventDetailListQuery.pageSize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="eventDetailTotal"
		    ></el-pagination>
		
		    <!-- <div slot="footer" class="dialog-footer">
		      <el-button @click="innerVisible = false" type="primary" size="small">关闭</el-button>
		    </div> -->
		  </el-dialog>
		
		 <!-- <div slot="footer" class="dialog-footer">
		    <el-button @click="outerVisible = false" type="primary" size="small">关闭</el-button>
		  </div> -->
		</el-dialog>
		<yt-dialog :options="uploadOptions" :events="uploadEvents">
		  <ImportFile @success="handleSuccess" filename="产品模板" tips="只能上传Excel文件,如需删除产品,请在操作列输入'delete',添加编辑请留空" :data="downloadData" :downloadApi="downloadApi" :action="action" />
		</yt-dialog>
	</div>
	<router-view v-else></router-view>
	
  </div>
</template>
<script>
import Vue from 'vue'
import { CONST_PORT_CONFIG, host } from 'Config'
const _ = require('lodash')
export default {
  data() {
    return {
      tabsLoading: false,
      activeTabName: '0',
      activeName: '0',
	  uploadOptions: {
        visible: false,
        width: '500px',
        title: '导入产品',
        showFooter: false
      },
      // 默认展开
      // isShow: true,
      // icon: "el-icon-caret-left",
      // position: {
      //     position: "absolute",
      //     top: "300px",
      //     left: "260px"
      // },
      //默认关闭
      isShow: true,
      icon: 'el-icon-caret-left',
      position: {
        position: 'absolute',
        top: '300px',
        left: '0px', // 默认开启
        // color: '#108ee9',
      },
      filterText: null,
      statusBtnList: [
        ['所有产品', false, null],
        ['在售', false, 1],
        ['不可售', false, 2],
        ['禁止显示', false, 4],
        ['信息待改善', false, 3],
        ['商品信息变动', false, 0] // 0 切换接口
      ],
      productStatus: [
        ['所有', 'all'],
        ['在售', '1'],
        ['不可售', '2'],
        ['禁止显示', '4'],
        ['信息待改善', '3'],
        ['变体关系发生变化', '5']
      ],
      daterange: [],
      asinOrSkuLabel: 'ASIN',
      asinOrSkuOptions: ['ASIN', 'SKU'],
      alertTypeOptions: [],
      isIgnore: false,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      isProductStatusShow: true,
      btnStatus: null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        cusCateId: null,
        asin: null,
        startTime: null,
        endTime: null,
        productStatus: 'all',
        alertType: null, //问题类型
        readFlag: null,
        problem: null,
      },
      multipleSelection: [],
      isInfoChangelist: false,
      treeKey: 1,
      treeLoading: false,
      customCategoryData: [],

      defaultProps: {
        children: 'childList',
        label: 'cusCateName'
      },
      logOptions: {
        visible: false,
        width: '800px',
        title: '操作日志',
        // okBtnText: '关闭',
		showOk:false,
        showCancel: false
      },
      logEvents: {
        handleOkClick: () => {
          this.logOptions.visible = false
        }
      },
      logTableKey: 2,
      logList: null,
      logTotal: null,
      logListLoading: false,
      logListQuery: {
        pageSize: 10,
        pageNumber: 1,
        productId: null
      },
      outerVisible: false,
      innerVisible: false,
      eventTableKey: 3,
      eventListLoading: false,
      eventList: null,

      eventDetailTableKey: 4,
      eventDetailList: null,
      eventDetailTotal: null,
      eventDetailLoading: false,
      eventDetailListQuery: {
        pageSize: 10,
        pageNumber: 1,
        productId: null,
        eventType: null
      },
      loadingBtn1: false,

      refreshhtml: '手动刷新',
      BTNdisabled: false,

      searchShow: false,
	  downloadApi: 'productDownloadFile',
	  action: `${host}product/productImport`,
	  uploadEvents: {
        handleOkClick: () => {
          this.submitUploadForm()
        }
      },
	  fileList: [],
    }
  },
  computed: {
    listToArray() {
      let tmp = this.list || []
      const func = this.evalFunc
      const args = [tmp, false]
      return func.apply(null, args)
    },
	downloadData() {
      return {...this.storeIds}
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val)
    },
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.initPage()
        this.getManualUpdate()
      }
    }
  },
  created() {
    if (this.sellerId && this.siteId) {
      this.listQuery.productStatus = this.$route.params.productStatus
      this.$route.params.activeName && (this.activeTabName = this.$route.params.activeName)
      this.setStatus(+this.$route.params.status, +this.$route.params.activeName, null, false)
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId
        this.getList()
      }
      
      this.initPage()
      this.getManualUpdate()
    }
    
  },
  // mounted() {
  //   this.$refs.productStatusBtn.$children[0].$el.className =
  //     'el-button el-button--primary'
  // },

  methods: {
	  handleSuccess({ res, file, fileList }) {
		  if (res.code !== 0) {
			this.$message.error(res.msg)
		  } else {
			this.$message.success(res.msg)
			this.uploadOptions.visible = false
			this.handleFilter()
		  }
	  },
	  linkMethod(){
		  this.$router.push({
		        name: "ProLog123",
		        query:{
		            type: 1
		        }
		    });
	  },
	  importMethod(){
		  this.uploadOptions.visible = true
    },
    handleRowSelect(selection, row) {
			if (row._expanded || this.$refs.clearTableSort.selection.indexOf(row) === -1) {
				this.checkStrict(row)
			}
    },
    checkStrict(row) {
      this.$nextTick(() => {
        let i = this.listToArray.indexOf(row)
        while (i < this.listToArray.indexOf(row) + row.childList.length) {
          i++
          this.$refs.clearTableSort.toggleRowSelection(
            this.listToArray[i],
            this.$refs.clearTableSort.selection.indexOf(row) > -1
          )
        }
      })
    },
	  handleSortChange(column) {
		let sortId = column.prop
		if(sortId === 'updateTime') sortId = 'update_time'
	    this.listQuery.pageNumber = 1
	    if (column.order === 'descending') {
	      this.listQuery.sortField = sortId
	      this.listQuery.sort = 0
	    } else {
	      this.listQuery.sortField = sortId
	      this.listQuery.sort = 1
	    }
	    this.handleFilter()
	  },
    handleTabClick(tab) {
	  this.$refs.clearTableSort.clearSelection()
      let { index } = tab
      let { item } = tab.$attrs
      // this.tabsLoading = true
      this.setStatus(item[2], +index, item[1])
    },
    handleExpand(scope) {
      if (!scope.row._expanded) {
        if (!scope.row.children) {
          let {
              productId,
              sellerId,
              siteId,
              productStatus,
              problem,
              asin,
              alertType
            } = scope.row,
            listQuery = {}

          // this.btnStatus
          let btnStatus = this.btnStatus
          // problem
          if (btnStatus == 3) {
            listQuery.problem = 2
          } else if (btnStatus == 4) {
            listQuery.problem = 1
          }
          if (btnStatus == 1 || btnStatus == 2) {
            listQuery.productStatus = btnStatus
            listQuery.problem = null
          }

          this.$set(scope.row, 'loading', true)
          // this.$api[`productListForSame`]({
          //   productId,
          //   sellerId,
          //   siteId,
          //   ...listQuery
          // })
          //   .then(data => {
          //     scope.row.loading = false
          //     this.$set(scope.row, 'children', data.data)
          //     this.$set(scope.row, '_expanded', true)
          //   })
          //   .catch(err => {
          //     scope.row.loading = false
          //   })
		  if(scope.row.childList.length){
			  scope.row.loading = false
			  this.$set(scope.row, 'children', scope.row.childList)
        this.$set(scope.row, '_expanded', true)
        // this.checkStrict(scope.row)
		  }else{
			  scope.row.loading = false
		  }
        } else {
          this.$set(scope.row, '_expanded', true)
          // this.checkStrict(scope.row)
        }
      } else {
        scope.row._expanded = false
        // this.checkStrict(scope.row)
      }
    },
    showRow(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    cellStyle({ row }) {
      return row.parent ? 'background: #f2f6fc' : null
    },
    evalFunc(data, expandAll, parent = null, level = null) {
      let tmp = [],
        vm = this
      Array.from(data).forEach(function(record) {
        if (record._expanded === undefined) {
          Vue.set(record, '_expanded', expandAll)
        }
        let _level = 1
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        Vue.set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          Vue.set(record, 'parent', parent)
        }
        tmp.push(record)
        if (record.children && record.children.length > 0) {
          const children = vm.evalFunc(
            record.children,
            expandAll,
            record,
            _level
          )
          tmp = tmp.concat(children)
        }
      })
      return tmp
    },
    setShowBtn(btnTxt) {
      let ignore = this.isIgnore
      let infoChangelist = this.isInfoChangelist
      //getAlertType
      if (btnTxt === '忽略产品') {
        if (ignore == infoChangelist && infoChangelist == true) {
          return true
        }
        return false
      }
      if (btnTxt === '标记已处理') {
        // if(ignore==infoChangelist==true){
        //     return true
        // }
        if ((ignore == infoChangelist) == true && infoChangelist == true) {
          return true
        }
        return false
      }
      if (btnTxt === '取消忽略') {
        if (ignore == !infoChangelist) {
          return true
        }
        return false
      }
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId
        this.getCustomCategory()
        this.getAlertType()

        this.getList()
      }
    },
    distribute(type) {
      switch (type) {
        case '忽略产品':
          this.handleIgnore(1)
          break
        case '取消忽略':
          this.handleIgnore(0)
          break
        case '标记已处理':
          this.handleSign()
          break
      }
    },
    setShow() {
      this.isShow = !this.isShow
      if (this.isShow) {
        this.icon = 'el-icon-caret-left'
        // this.position.left = '20px'
      } else {
        this.icon = 'el-icon-caret-right'
        // this.position.left = '20px'
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.cusCateName.indexOf(value) !== -1
    },
    getCustomCategory() {
	  console.log('123')
      this.treeLoading = true
      this.$api['customCategoryList']({ sellerId: this.listQuery.sellerId })
        .then(res => {
          let { code, data } = res
          if (code === 0) {
            this.customCategoryData = data
            this.customCategoryData.push({
              childList: null,
              createTime: null,
              cusCateId: -1,
              cusCateName: '未映射类目产品',
              haveChildren: 0,
              parentCusCateId: 0
            })
			
			this.customCategoryData.unshift({
			  childList: null,
			  createTime: null,
			  cusCateId: null,
			  cusCateName: '全部',
			  haveChildren: 0,
			  parentCusCateId: 0
			})

            this.listQuery.cusCateId = null // 刷新清空类目id
          }
          setTimeout(() => {
            this.treeLoading = false
          }, 500)
        })
        .catch(() => {
          this.treeLoading = false
        })
    },
    handleNodeClick(data) {
      this.listQuery.cusCateId = data.cusCateId
      this.handleFilter()
    },
    renderAsinOrSku(h, { column, $index }) {
      // class="table-column-select"
      return (
        <div>
          <el-button
            onClick={() => {
              this.asinOrSkuLabel = 'ASIN'
            }}
            type="text"
            style={{
              color:
                this.asinOrSkuOptions[1] === this.asinOrSkuLabel
                  ? '#999'
                  : '#108ee9',
              marginRight: '2px',
              fontWeight:'bold',
              fontSize: '12px'
            }}
          >
            ASIN
          </el-button>
          /
          <el-button
            
            onClick={() => {
              this.asinOrSkuLabel = 'SKU'
            }}
            type="text"
            style={{
              color:
                this.asinOrSkuOptions[0] === this.asinOrSkuLabel
                  ? '#999'
                  : '#108ee9',
              fontSize: '12px',
              marginLeft: '2px',
              fontWeight:'bold',
            }}
          >
            SKU
          </el-button>
        </div>
      )
    },
    getAlertType() {
      this.$api['productAlertType']({}).then(res => {
        let { code, data } = res
        if (code === 0) {
          let alertTypeOptions = []
          data.forEach(element => {
            alertTypeOptions.push({ label: element, value: element })
          })
          this.alertTypeOptions = alertTypeOptions
        }
      })
    },
	
    getManualUpdate() {
      this.$api['productManualUpdateStatus']({
        //siteId:this.listQuery.siteId,
        //siteId:this.listQuery.siteId,
        siteId: this.siteId,
        sellerId: this.sellerId,
        merchantId: 2
      })
        .then(data => {
          // debugger

          if (data.code === 0) {
            this.loadingBtn1 = false
			
          }
        })
        .catch(err => {
          // if (err && err.code) {
          //   this.refreshhtml = '正在刷新中'
          //   this.loadingBtn1 = true
          // }
          if (err.code === 500) {
            this.refreshhtml = '正在刷新中'
            this.loadingBtn1 = true
          }
          if (err.code === 400) {
            this.refreshhtml = '今日数据已更新'
            this.loadingBtn1 = false
            this.BTNdisabled = true
          }
        })
    },
    setManualUpdate() {
	  this.$confirm('手动刷新需要一个小时,是否继续','提示',{type:'warning'}).then(()=>{
		  this.loadingBtn1 = true
		  this.refreshhtml = '正在刷新中'
		  this.$api['productManualUpdate']({
		    siteId: this.siteId,
		    sellerId: this.sellerId,
		    merchantId: 2
		  })
		    .then(res => {
		      if (res.code === 0) {
		        // if(this.listQuery.cusCateId!==null){
		  
		        this.handleFilter()
		        this.refreshhtml = '正在刷新中'
		        this.BTNdisabled = true
		        this.loadingBtn1 = false

		        // }
		      }
		    })
		    .catch(err => {
		      //console.log(err);
		      if (err.code === 400) {
		        this.BTNdisabled = true
		        this.refreshhtml = '今日数据已更新'
		        this.loadingBtn1 = false
		      } else if (err.code === 500) {
		        this.BTNdisabled = true
		        this.refreshhtml = '正在刷新中'
		      }
		    })
	  }).catch(()=>{})
    },
    //productStatus
    resetListQueryForm() {
      // debugger
      this.listQuery.asin = null
      this.daterange = []
      this.listQuery.productStatus = 'all'
      this.listQuery.alertType = null
      this.$refs.listQueryForm && this.$refs.listQueryForm.resetFields()
      this.handleFilter()
    },
    getList() {
      this.getProductListCount()
      // if(this.listQuery.cusCateId===null){
      //     this.$message.warning('请选择类目');
      //     return
      // }
      this.listLoading = true

      let asin = this.listQuery.asin
      if (asin !== null) {
        let flag = _.isEmpty(asin.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          this.listQuery.asin = null
        }
      }
      if (this.daterange !== null && this.daterange.length === 2) {
        this.listQuery.startTime = this.daterange[0]
        this.listQuery.endTime = this.daterange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      let listQuery = _.cloneDeep(this.listQuery)
      if (listQuery.productStatus === 'all') {
        listQuery.productStatus = null
      } else {
        listQuery.productStatus = parseInt(listQuery.productStatus)
      }

      // this.btnStatus
      let btnStatus = this.btnStatus
      // problem
      if (btnStatus == 3) {
        listQuery.problem = 2
      } else if (btnStatus == 4) {
        listQuery.problem = 1
      }
      if (btnStatus == 1 || btnStatus == 2) {
        listQuery.productStatus = btnStatus
        listQuery.problem = null
      }

      if (listQuery.productStatus == 3 || listQuery.productStatus == 4) {
        if (listQuery.productStatus == 3) {
          listQuery.problem = 2
        } else if (listQuery.productStatus == 4) {
          listQuery.problem = 1
        }
        listQuery.productStatus = null
      }

      let apiName = 'productList'

      if (this.isInfoChangelist) {
        apiName = 'productInfoChangelist'
        if (!this.isIgnore) {
          apiName = 'productIgnoreList'
        }
      }
      if (listQuery.alertType == '') {
        listQuery.alertType = null
      }
      if (this.isInfoChangelist == this.isIgnore && this.isIgnore == true) {
        listQuery.eventType = listQuery.alertType
        delete listQuery.alertType
      }
      this.$api[apiName](listQuery)
        .then(res => {
          this.listLoading = false
          let { rows, total } = res
          this.list = rows
          // console.log(this.list)
          this.total = total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
	submitUploadForm() {
      if (this.fileList.length === 0) {
        this.$message.warning('请选择文件')
        return
      }
      const isLt2M = this.fileList[0].raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 2MB!')
        return
      }
      let params = {
        siteId: this.siteId,
        sellerId: this.sellerId,
        file: this.fileList[0]
      }
      this.$api['productProductImport'](params).then(res => {
        let { code } = res
        if (code === 0) {
          this.uploadOptions.visible = false
          this.fileList = []
          this.handleFilter()
        }
      })
    },
    getProductListCount() {
      let params = {
        sellerId: this.listQuery.sellerId,
        siteId: this.listQuery.siteId,
        cusCateId: this.listQuery.cusCateId
      }
      this.$api['productListCount'](params).then(res => {
        let { code, data } = res
        if (code === 0) {
          let status0Btn = data.find(element => {
            return element.pageType == 0
          })
		  this.$set(this.statusBtnList,0,[`所有产品(${status0Btn.total})`, false, null])
          // this.statusBtnList[0] = [`所有产品(${status0Btn.total})`, false, null]

          let status1Btn = data.find(element => {
            return element.pageType == 1
          })
          let flag = status1Btn.readFlag == 0 ? true : false
          this.statusBtnList[1] = [`在售(${status1Btn.total})`, flag, 1]

          let status2Btn = data.find(element => {
            return element.pageType == 2
          })
          flag = status2Btn.readFlag == 0 ? true : false
          this.statusBtnList[2] = [`不可售(${status2Btn.total})`, flag, 2]

          let status3Btn = data.find(element => {
            return element.pageType == 4
          })
          flag = status3Btn.readFlag == 0 ? true : false
          this.statusBtnList[3] = [`禁止显示(${status3Btn.total})`, flag, 4]

          let status4Btn = data.find(element => {
            return element.pageType == 3
          })
          flag = status4Btn.readFlag == 0 ? true : false
          this.statusBtnList[4] = [`信息待改善(${status4Btn.total})`, flag, 3]

          let status5Btn = data.find(element => {
            return element.pageType == 5
          })
          flag = status5Btn.readFlag == 0 ? true : false
          this.statusBtnList[5] = [`商品信息变动(${status5Btn.total})`, flag, 0]

          
        }
      })
    },
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('至少选一项')
        return false
      }
      return true
    },
    handleIgnore(ignoreFlag) {
      if (!this.checkRows()) {
        return
      }
      this.$confirm(
        `此操作将${ignoreFlag ? '忽略产品' : '取消忽略'},是否继续`,
        '提示',
        { type: 'warning' }
      )
        .then(() => {
          let ids = []
          this.multipleSelection.forEach(element => {
            ids.push(element.productId)
          })
          this.$api['productIgnore']({
            ids,
            ignoreFlag, //1-忽略 0-取消忽略
            sellerId: this.listQuery.sellerId,
            siteId: this.listQuery.siteId,
            merchantId: 1
          }).then(res => {
            if (res.code === 0) {
              this.getList()
            }
          })
        })
        .catch(() => {})
    },
    handleSign() {
      if (!this.checkRows()) {
        return
      }
      this.$confirm('此操作将标记已处理,是否继续', '提示', { type: 'warning' })
        .then(() => {
          let ids = []
          this.multipleSelection.forEach(element => {
            ids.push(element.productId)
          })
          this.$api['productHandle']({
            ids,
            sellerId: this.listQuery.sellerId,
            siteId: this.listQuery.siteId,
            merchantId: 1
          }).then(res => {
            if (res.code === 0) {
			  this.$refs.clearTableSort.clearSelection()
              this.getList()
            }
          })
        })
        .catch(() => {})
    },
    setIgnore() {
      this.isIgnore = false
			this.$refs.clearTableSort.clearSelection()
      //  if(this.listQuery.cusCateId!==null){
      this.handleFilter()
      // }
    },
    setStatus(status, index, readFlag, fetch = true) {
      // let productStatusBtnArr = this.$refs.productStatusBtn.$children
      // productStatusBtnArr.forEach(element => {
      //   element.$el.className = 'el-button el-button--primary is-plain'
      // })
      // productStatusBtnArr[index].$el.className = 'el-button el-button--primary'
      if (status === null) {
        this.productStatus = [
          ['所有', 'all'],
          ['在售', '1'],
          ['不可售', '2'],
          ['禁止显示', '4'],
          ['信息待改善', '3'],
          ['变体关系发生变化', '5']
        ]
      } else {
        this.productStatus = [['所有', 'all'], ['在售', '1'], ['不可售', '2']]
      }
      this.btnStatus = status

      if (status === null || status == 0) {
        // this.listQuery.productStatus ='all'
        if (status == 0) {
          this.isInfoChangelist = true
          this.isIgnore = true
        } else {
          this.isInfoChangelist = false
          this.isIgnore = false
        }
      } else {
        // if(status!=3&&status!=4){
        //     this.listQuery.productStatus =status.toString()
        // }

        this.isInfoChangelist = false
        this.isIgnore = false
      }
      if (status == 1 || status == 2) {
        this.isProductStatusShow = false
        // this.listQuery.productStatus =status.toString()
      } else {
        this.isProductStatusShow = true
      }

      // if(status==3){
      //     this.listQuery.problem =2
      //     // this.listQuery.productStatus='all'
      // }else if(status==4){
      //     this.listQuery.problem =1
      //     // this.listQuery.productStatus='all'
      // }else{
      //     this.listQuery.problem =null
      // }

      this.listQuery.readFlag = 0

      if (readFlag) {
        this.listQuery.readFlag = 1 // 已读
      }

      if (this.isInfoChangelist == this.isIgnore && this.isIgnore == true) {
        this.alertTypeOptions = [
          { label: '标题', value: 0 },
          { label: '类目', value: 1 },
          { label: 'sku数', value: 2 },
          { label: 'colorname', value: 3 },
          { label: 'sizename', value: 4 },
          { label: '卖点', value: 5 },
          { label: '价格', value: 6 },
          { label: '品牌', value: 7 },
          { label: '图片', value: 8 },
          { label: '描述', value: 9 }
        ]
      } else {
        this.getAlertType()
      }
      this.listQuery.alertType = null
      if (fetch) {
		this.listQuery.sort = null
		this.listQuery.sortField = null
		this.$refs.clearTableSort.clearSort()
        this.resetListQueryForm(this.listQuery.productStatus)
      }
      // this.$refs.clearTableSort.clearSort();
      
      // this.handleFilter()
    },
    // selectStatus(status){
    //     // if(status==3){
    //     //     this.listQuery.problem =2
    //     // }else if(status==4){
    //     //     this.listQuery.problem =1
    //     // }
    //      this.listQuery.productStatus=status
    //     // if(this.isInfoChangelist){
    //     //      this.listQuery.productStatus =val
    //     //      this.handleFilter()
    //     // }else{
    //     //     switch(val){
    //     //         case 'all':
    //     //             this.setStatus(null,0)
    //     //         break;
    //     //         case '1':
    //     //             this.setStatus(1,1)
    //     //         break;
    //     //         case '2':
    //     //             this.setStatus(2,2)
    //     //         break;
    //     //         case '4':
    //     //             this.setStatus(4,3)
    //     //         break;
    //     //         case '3':
    //     //             this.setStatus(3,4)
    //     //         break;
    //     //     }
    //     // }

    // },
    getBadgeValue(eventList) {
      if (eventList.length == 1) {
        return eventList[0].eventSkuCnt
      } else {
        let count = 0
        eventList.forEach(element => {
          count += parseInt(element.eventSkuCnt)
        })
        return `+${count}`
      }
    },
    showLogDialog(row) {
      this.logListQuery.pageNumber = 1
      this.logListQuery.productId = row.productId
      this.getLogList()
      this.logOptions.visible = true
    },
    getLogList() {
      this.logListLoading = true
      this.$api['productOperateLog'](this.logListQuery)
        .then(res => {
          let { rows, total } = res
          this.logList = rows
          this.logTotal = total
          setTimeout(() => {
            this.logListLoading = false
          }, 500)
        })
        .catch(() => {
          this.logListLoading = false
        })
    },

    handleLogSizeChange(val) {
      this.logListQuery.pageSize = val
      this.getLogList()
    },
    handleLogCurrentChange(val) {
      this.logListQuery.pageNumber = val
      this.getLogList()
    },
    formatterEventType(row, column) {
      return this.getEventType(row.eventType)
    },
    getEventType(eventType) {
      switch (eventType) {
        case 0:
          return '标题'
          break
        case 1:
          return '类目'
          break
        case 2:
          return 'sku数'
          break
        case 3:
          return 'colorname'
          break
        case 4:
          return 'sizename'
          break
        case 5:
          return '卖点'
          break
        case 6:
          return '价格'
          break
        case 7:
          return '品牌'
          break
        case 8:
          return '图片'
          break
        case 9:
          return '描述'
          break
      }
    },
    showEventListDialog(eventList, productId) {
      this.eventDetailListQuery.productId = productId
      this.outerVisible = true
      this.eventList = eventList
    },
    showEventDetailDialog(row) {
      this.eventDetailListQuery.pageNumber = 1
      this.eventDetailListQuery.eventType = row.eventType
      this.getDetailList()
      this.innerVisible = true
    },
    getDetailList() {
      this.eventDetailLoading = true
      this.$api['productEventDetailList'](this.eventDetailListQuery)
        .then(res => {
          let { rows, total } = res
          this.eventDetailList = rows
          this.eventDetailTotal = total
          setTimeout(() => {
            this.eventDetailLoading = false
          }, 500)
        })
        .catch(() => {
          this.eventDetailLoading = false
        })
    },
    handleDetailSizeChange(val) {
      this.eventDetailListQuery.pageSize = val
      this.getDetailList()
    },
    handleDetailCurrentChange(val) {
      this.eventDetailListQuery.pageNumber = val
      this.getDetailList()
    }
  }
}
</script>
<style lang="less" scoped>
.tabs-wrapper {
  position: relative;
}
.flex {
  display: flex;
  align-items: center;
  .text {
    line-height: 23px;
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.box-center {
  display: flex;
  justify-content: center;
}
.el-pagination() {
  margin-top: 5px;
  padding-left: 0;
  /deep/.el-pagination__sizes {
    .el-input {
      margin-left: 0 !important;
    }
  }
}
.box {
  .drawer-btn {
    background-color: #fff;
    border: 1px solid @borderColor;
    width: 15px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .box-body {
    display: flex;
    .menu {
      height: 100vh;
      overflow-y: auto;
      border: 1px solid @borderColor;
      border-radius: 3px;
      width: 300px;
      margin-bottom: 10px;
      padding: 10px;
      .menu-select {
        width: 225px;
        margin-bottom: 5px;
      }
      .el-tree {
        /deep/.el-tree__empty-text {
          font-size: 14px;
          color: #606266;
        }
      }
    }
    .body {
      width: 100%;
      overflow-y: auto;
      .el-button-group {
        min-width: 690px;
        .circle {
          width: 10px;
          height: 10px;
          background-color: red;
          border-radius: 5px; /* 图形的半径 */
          margin-left: 3px;
        }
      }

      padding: 10px;
      border: 1px solid @borderColor;
      border-radius: 3px;
      // margin-left: 10px;
      // margin-right: 10px;
      .box-info {
        margin-top: 10px;
        font-size: 14px;
        background-color: @boxQueryBGColor;
        padding: 15px;
        border: 1px solid @borderColor;
        display: flex;
        justify-content: space-between;
        .left {
          span {
            &:first-of-type {
              margin-right: 20px;
            }
            &:last-of-type {
              color: @titleColor;
            }
          }
        }
        .right {
          .a-btn {
            color: #40b4ff;
            font-size: 12px;
            text-decoration: underline;
          }
        }
      }
      .box-query {
        // min-width: 1070px;
        // padding: 15px;
        padding: 15px 15px 0 15px;
        border-left: 1px solid @borderColor;
        border-right: 1px solid @borderColor;
        border-bottom: 1px solid @borderColor;
        // .el-form--inline {
        // //   height: 40px;
        // }
        .el-form-item__content {
          .el-input {
            width: 150px;
          }

          .el-range-editor {
            width: 240px;
            /deep/.el-range-separator {
              width: 20px;
            }
          }
          .el-select {
            width: 120px;
          }
        }
      }
      .box-update-btn {
        
        display: flex;
        // justify-content: flex-end;
      }
      .box-data {
        // .table-column-select{
        //     height: 40px;
        // }
        .el-pagination {
          .el-pagination;
        }
      }
    }
  }

  .log-dialog {

    .el-pagination {
      .el-pagination;
    }
  }
  //
  .event-list-dialog {
    /deep/.el-dialog__body {
      padding: 10px;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}
.event-list-inner-dialog {
  /deep/.el-dialog__body {
    padding: 20px;
    // margin: 10px;
    // border: 1px solid @borderColor;
  }

  .el-pagination {
    .el-pagination;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="less">
.custom-flex {
  .el-collapse-item__header {
    display: flex;
    justify-content: space-between;
    .right {
      text-align: right;
      flex: 1;
      padding-right: 10px;
    }
  }
}
.box-data {
  .el-table__header-wrapper {
    // .asin-sku {
    //   /deep/.cell {
    //     height: 38px;
    //   }
    // }
  }
}
.custom-dropbtn {
  i::before {
	display: block;
    font-size: 16px;
  }
}
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
._children {
  margin-left: 43px !important;
}
</style>


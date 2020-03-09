<template>
  <div class="box" style="height:100%">
    <div class="drawer-btn" @click="setShow()" v-if="!isShow" :style="position">
      <i :class="icon"></i>
    </div>
    <ElRow :gutter="20" style="height:100%">
      <ElCol :span="4" v-show="isShow" style="position:relative;border-right: 1px solid #ddd;height:100%">
        <div class="drawer-btn drawer-btn1" @click="setShow()" v-if="isShow">
          <i :class="icon"></i>
        </div>
        <div class="menu">
          <div class="box-center">
            <el-input placeholder="输入类目进行过滤" v-model.trim="filterText" size="mini" class="menu-select" clearable>
              <!-- <i slot="append" class="el-icon-search"></i> -->
            </el-input>
          </div>
          <div style="text-align:right">
            <el-tooltip class="item" effect="light" content="刷新" placement="top-start">
              <el-button icon="el-icon-refresh" type="text" @click="getCustomCategory"></el-button>
            </el-tooltip>
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
          >
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span :title="node.label" class="font12">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </ElCol>
      <ElCol :span="isShow ? 20 : 24">
        <!-- <el-button-group ref="productStatusBtn" style="margin-bottom:16px">
				  <el-button
					type="primary"
					plain
					v-for="(item, index) in statusBtnList"
					@click="setStatus(item[1],index)"
				  >{{item[0]}}</el-button>
        </el-button-group>-->

        <!-- 浮标 -->
        <transition>
          <div
            v-show="showCircle"
            class="scroll-box"
            ref="outer"
            @mouseenter="showCircle = true"
            @mousemove="handleMousemove"
            @mousedown="handleMouseDown"
          >
            <div class="scroll-box-inner" ref="inner" @mousemove="handleMousemove($event, true)"></div>
            <div class="arrow-left" @mousedown.stop="handleArrowMousedown"></div>
            <div class="arrow-right" @mousedown.stop="handleArrowMousedown"></div>
          </div>
        </transition>

        <ElTabs v-model="activeTabName" type="card" @tab-click="handleTabClick">
          <ElTabPane v-for="(item, index) in statusBtnList" :name="index + ''" :item="item" :label="item[0]"></ElTabPane>
        </ElTabs>

        <el-collapse class="custom-collapse" value="`1`" accordion>
          <el-collapse-item title="筛选条件" name="1">
            <el-form :inline="true" :model="listQuery" size="small" ref="listQueryForm">
              <el-form-item label="请输入ASIN或SKU">
                <el-input v-model.trim="listQuery.asin" placeholder="请输入ASIN或SKU" size="mini" clearable></el-input>
              </el-form-item>
              <el-form-item label="添加时间">
                <el-date-picker
                  v-model="daterange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                  value-format="yyyy-MM-dd"
                  :picker-options="cfuns.pacPickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="商品状态">
                <el-select v-model="listQuery.productStatus" placeholder="请选择" size="mini" clearable>
                  <el-option
                    v-for="item in [
                                    ['在售','1'],
                                    ['不可售','2'],
                                ]"
                    :label="item[0]"
                    :value="item[1]"
                    :key="'select_status_'+item[1]"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间范围">
                <el-select v-model="listQuery.invDayStatus" placeholder="请选择" size="mini" clearable>
                  <el-option
                    v-for="item in [
						['0~90天',1],
						['91~180天',2],
						['181~270天',3],
						['271~365天',4],
						['365天以上',5],
			                    ]"
                    :label="item[0]"
                    :value="item[1]"
                    :key="item[1]"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <!-- <el-button size="mini" type="primary" plain @click="handleFilter">确认搜索</el-button>
                <el-button size="mini" type="primary" plain @click="resetListQueryForm">重置搜索</el-button>-->
                <el-button
                  size="small"
                  type="primary"
                  @click="handleFilter"
                  icon="el-icon-search"
                  :loading="searchLoading"
                >搜索</el-button>
                <el-button size="small" type="primary" plain @click="resetListQueryForm" :disabled="searchLoading">重置搜索</el-button>
              </el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>

        <div class="box-update-btn">
          <div class="left">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="distribute('全局预警库存设置')"
              :key="'box_update_btn_'+0"
            >全局预警库存设置</el-button>
            <el-button type="primary" plain size="mini" @click="distribute('单个预警库存设置')">单个预警库存设置</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              :loading="updateBtnDisabled"
              @click="distribute('导出')"
              :key="'box_update_btn_'+1"
              :disabled="updateBtnDisabled"
            >导出</el-button>
            <a v-show="false" ref="exportExcel" class="exportExcel"></a>
          </div>
          <div class="right">
            <custom-table-column :custom-column="customColumnParams" v-on:setCustomColumn="setCustomColumn"></custom-table-column>
          </div>
        </div>
        <div class="box-data">
          <el-table
            :data="listToArray"
            :row-style="showRow"
            :cell-style="cellStyle"
            row-key="productId"
            v-loading="listLoading"
            :key="tableKey"
            style="width: 100%"
            border
            stripe
            tooltip-effect="light"
						@select="handleRowSelect"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            ref="clearTableSort"
          >
            <el-table-column type="selection" reserve-selection width="55"></el-table-column>
            <!-- <el-table-column class-name="asin-sku" width="180">
              <template slot="header" slot-scope="scope">
                <span :style="{color:asinColor}" style="cursor:pointer;line-height:38px;" @click="asinClick">ASIN</span> /
                <span :style="{color:skuColor}" style="cursor:pointer;line-height:38px;" @click="skuClick">SKU</span>
              </template>
              <template slot-scope="scope">
				<ElButton
                  v-if="scope.row.childList"
                  class="custom-dropbtn" 
                  @click="handleExpand(scope)"
                  type="text"
                  :icon="`el-icon-${scope.row._expanded ? 'caret-bottom' : 'caret-right'}`"
                ></ElButton>
                <a
                  :href="scope.row.productUrl" :style = "!scope.row.childList ? 'margin-left:18px;color: #108ee9;': 'color: #108ee9;'"
                  target="_blink"
                  v-if="asinShow"
                >{{scope.row.asin}}<span v-if="scope.row.count" style="color: red;margin-left: 5px;">({{scope.row.count}})</span></a>
				<el-tooltip placement="top" effect="light" style="width:100%"  v-else>
                    <div slot="content">{{scope.row.sku}}</div>
                    <a :href="scope.row.productUrl" :style = "!scope.row.childList ? 'margin-left:18px;color: #108ee9;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;': 'color: #108ee9;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;'" target="_blink">{{scope.row.sku}}</a>
				</el-tooltip>
              </template>
            </el-table-column>-->
            <el-table-column width="200" prop="sku" label="SKU">
              <template slot-scope="scope">
                <!-- <ElButton
				  v-if="scope.row.childList"
				  class="custom-dropbtn" 
				  @click="handleExpand(scope)"
				  type="text"
				  :icon="`el-icon-${scope.row._expanded ? 'caret-bottom' : 'caret-right'}`"
				></ElButton>
				<el-tooltip placement="top" effect="light" style="width:100%" >
			        <div slot="content">{{scope.row.sku}}</div>
			        <a :href="scope.row.productUrl" :style = "!scope.row.childList ? 'margin-left:18px;color: #108ee9;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;': 'color: #108ee9;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;'" target="_blink">{{scope.row.sku}}</a>
                </el-tooltip>-->
                <div class="flex flex-wrap">
                  <ElButton
                    v-if="scope.row.childList"
                    class="custom-dropbtn"
                    @click="handleExpand(scope)"
                    type="text"
                    :icon="`el-icon-${scope.row._expanded ? 'caret-bottom' : 'caret-right'}`"
                  ></ElButton>
                  <el-tooltip placement="top" effect="light" style="width:100%" v-if="scope.row.childList">
                    <div slot="content">{{scope.row.sku}}</div>
                    <div
                      class="text"
                      style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;margin-left: 5px;"
                    >
                      {{scope.row.sku}}
                      <span
                        v-if="scope.row.count"
                        style="color: red;margin-left: 5px;"
                      >({{scope.row.count}})</span>
                    </div>
                  </el-tooltip>
                  <el-tooltip placement="top" effect="light" style="width:100%" v-else>
                    <div slot="content">{{scope.row.sku}}</div>
                    <div
                      class="text"
                      style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;margin-left: 23px;"
                    >
                      {{scope.row.sku}}
                      <span
                        v-if="scope.row.count"
                        style="color: red;margin-left: 5px;"
                      >({{scope.row.count}})</span>
                    </div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="asin-sku" width="150" prop="asin" label="ASIN">
              <template slot-scope="scope">
                <a
                  :href="scope.row.productUrl"
                  :style="!scope.row.childList ? 'color: #108ee9;': 'color: #108ee9;'"
                  target="_blink"
                  v-if="asinShow"
                >{{scope.row.asin}}</a>
                <el-tooltip placement="top" effect="light" style="width:100%" v-else>
                  <div slot="content">{{scope.row.sku}}</div>
                  <a
                    :href="scope.row.productUrl"
                    :style="!scope.row.childList ? 'margin-left:18px;color: #108ee9;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;': 'color: #108ee9;overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:119px;'"
                    target="_blink"
                  >{{scope.row.sku}}</a>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column prop="productStatus" width="120" label="状态">
              <template slot-scope="scope">
                <div v-if="scope.row.productStatus==1">在售</div>
                <div v-else-if="scope.row.productStatus==2">不可售</div>
                <div v-else-if="scope.row.productStatus==3">信息待改善</div>
                <div v-else-if="scope.row.productStatus==4">禁止显示</div>
                <div
                  v-if="scope.row.productStatus==1||scope.row.productStatus==2||scope.row.productStatus==3||scope.row.productStatus==4"
                >
                  <div v-if="scope.row.flowFlag==1" style="display:flex;align-items:flex-start;">
                    <img src="../BadReviewSeo/icon-warning.png" style="height:18px;margin-right: 3px;" />
                    优化流量
                  </div>
                  <div v-if="scope.row.conversionFlag==1" style="display:flex;align-items:flex-start;">
                    <img src="../BadReviewSeo/icon-warning.png" style="height:18px;margin-right: 3px;" />
                    优化转化率
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="imageUrl" width="100" label="主图">
              <template slot-scope="scope">
                <el-popover placement="right" trigger="hover">
                  <div class="__img_wrapper mar-auto" :style="{width:'200' + 'px', height:'200' + 'px'}">
                    <img v-lazy="scope.row.imageUrl" class="loadingImg" style="object-fit: contain;overflow: hidden;" />
                  </div>
                  <div class="__img_wrapper" slot="reference">
                    <img
                      class="loadingImg"
                      :key="scope.row.imageUrl"
                      v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'"
                    />
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="primarySkuProportion"
              min-width="150"
              :sortable="'custom'"
              v-if="columnList.indexOf('primarySkuProportion')!==-1"
              label="主要成交SKU占比"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.primarySkuProportion==null">-</div>
                <div v-else>{{toFixedMethod(scope.row.primarySkuProportion)}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="safeSaleableDays"
              min-width="130"
              :sortable="'custom'"
              v-if="columnList.indexOf('safeSaleableDays')!==-1"
              label="安全可售天数"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.safeSaleableDays==null">-</div>
                <div v-else>{{scope.row.safeSaleableDays}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="longestInvDays"
              min-width="130"
              :sortable="'custom'"
              v-if="columnList.indexOf('longestInvDays')!==-1"
              label="最长库存天数"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.longestInvDays==null">-</div>
                <div v-else>{{scope.row.longestInvDays}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="shippingDays"
              min-width="130"
              :sortable="'custom'"
              v-if="columnList.indexOf('shippingDays')!==-1"
              label="货运运输时间"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.shippingDays==null">-</div>
                <div v-else>{{scope.row.shippingDays}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="sessions"
              min-width="90"
              :sortable="'custom'"
              v-if="columnList.indexOf('sessions')!==-1"
              label="访客数"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.sessions==null">-</div>
                <div v-else>{{scope.row.sessions}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderCnt"
              min-width="90"
              :sortable="'custom'"
              v-if="columnList.indexOf('orderCnt')!==-1"
              label="订单数"
            ></el-table-column>
            <el-table-column
              prop="conversionRates"
              min-width="90"
              :sortable="'custom'"
              v-if="columnList.indexOf('conversionRates')!==-1"
              :formatter="formatterConversionRates"
              label="转化率"
            ></el-table-column>
            <el-table-column
              prop="sellableQuantity"
              min-width="100"
              :sortable="'custom'"
              v-if="columnList.indexOf('sellableQuantity')!==-1"
              label="库存数量"
            ></el-table-column>
            <el-table-column
              prop="avgDailySales"
              min-width="100"
              :sortable="'custom'"
              v-if="columnList.indexOf('avgDailySales')!==-1"
              label="日均销量"
            ></el-table-column>
            <el-table-column
              prop="sellableDays"
              min-width="100"
              :sortable="'custom'"
              v-if="columnList.indexOf('sellableDays')!==-1"
              label="可售天数"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.sellableDays==null">-</div>
                <div v-else>{{scope.row.sellableDays}}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="warnCnt"
              min-width="110"
              :sortable="'custom'"
              label="预警库存数"
              v-if="columnList.indexOf('warnCnt')!==-1"
            >
              <template slot-scope="scope">
                <div v-if="scope.row.warnCnt==null">-</div>
                <div v-else>{{scope.row.warnCnt}}</div>
              </template>
            </el-table-column>

            <el-table-column
              label="库龄预警数"
              class-name="level-1-column"
              v-if="(columnList.indexOf('invAge0To90Days')!==-1||
              columnList.indexOf('invAge91To180Days')!==-1||
              columnList.indexOf('invAge181To270Days')!==-1||
              columnList.indexOf('invAge271To365Days')!==-1||
              columnList.indexOf('invAge365PlusDays')!==-1)"
            >
              <el-table-column
                prop="invAge0To90Days"
                min-width="100"
                :sortable="'custom'"
                v-if="columnList.indexOf('invAge0To90Days')!==-1"
                label="0~90天"
              ></el-table-column>
              <el-table-column
                prop="invAge91To180Days"
                min-width="100"
                :sortable="'custom'"
                v-if="columnList.indexOf('invAge91To180Days')!==-1"
                label="91~180天"
              ></el-table-column>
              <el-table-column
                prop="invAge181To270Days"
                min-width="110"
                :sortable="'custom'"
                v-if="columnList.indexOf('invAge181To270Days')!==-1"
                label="181~270天"
              ></el-table-column>
              <el-table-column
                prop="invAge271To365Days"
                min-width="110"
                :sortable="'custom'"
                v-if="columnList.indexOf('invAge271To365Days')!==-1"
                label="271~365天"
              ></el-table-column>
              <el-table-column
                prop="invAge365PlusDays"
                min-width="110"
                :sortable="'custom'"
                v-if="columnList.indexOf('invAge365PlusDays')!==-1"
                label="大于365天"
              ></el-table-column>
            </el-table-column>

            <!-- <el-table-column
                        label="操作"
                        width="75">
                            <template slot-scope="scope">
                                <el-tooltip effect="light" content="编辑" placement="top-start">
                                    <el-button  type="text" size="mini" icon="el-icon-edit-outline" @click="reCrawl(scope.row)"></el-button>
                                </el-tooltip>
                                <el-tooltip effect="light" content="查看日志" placement="top-start">
                                    <el-button  type="text" size="mini" icon="el-icon-tickets" @click="showLogDialog(scope.row)"></el-button>
                                </el-tooltip>
                            </template>
            </el-table-column>-->
          </el-table>

          <el-pagination
            class="mt10"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.pageNumber"
            :page-sizes="[10,20,30, 50]"
            :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </ElCol>
    </ElRow>
    <!-- <div class="box-body">
      
      <div class="body">
        

        
      </div>
    </div>-->

    <yt-dialog :options="options" :events="events">
      <el-form :model="ruleForm" ref="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="主要成交SKU占比" prop="primarySkuProportion">
          <el-input v-model.trim="ruleForm.primarySkuProportion" placeholder="请输入值" size="mini" style="width: 210px;"></el-input>%
        </el-form-item>
        <el-form-item label="安全可售天数>=" prop="safeSaleableDays">
          <el-input v-model.trim="ruleForm.safeSaleableDays" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="最长库存天数>=" prop="longestInvDays">
          <el-input v-model.trim="ruleForm.longestInvDays" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="货物运输时间>=" prop="shippingDays">
          <el-input v-model.trim="ruleForm.shippingDays" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
const _ = require('lodash')
import CustomTableColumn from '../KeyLexicon/KeyLexicon/components/custom-table-column'
import { CONST_PORT_CONFIG } from 'Config'
const { BASE_URL } = CONST_PORT_CONFIG
export default {
  components: {
    CustomTableColumn
  },
  computed: {
    listToArray() {
      let tmp = this.list || []
      const func = this.evalFunc
      const args = [tmp, false]
      return func.apply(null, args)
    }
  },
  data() {
    var validatePercent = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入主要成交SKU占比'))
      const reg = /^(\d{1,2}(\.\d{1,3})?|100)$/
      if (reg.test(value)) {
        return callback()
      } else {
        return callback(new Error('请输入0-100之间的数'))
      }
    }
    return {
      showCircle: false,
      rules: {
        primarySkuProportion: [
          {
            validator: validatePercent,
            trigger: ['blur']
          },
          {
            required: true,
            message: '请输入主要成交SKU占比',
            trigger: ['blur']
          }
        ],
        safeSaleableDays: [
          {
            required: true,
            message: '请输入安全可售天数',
            trigger: ['blur']
          }
        ],
        longestInvDays: [
          {
            required: true,
            message: '请输入最长库存天数',
            trigger: ['blur']
          }
        ],
        shippingDays: [
          {
            required: true,
            message: '请输入货物运输时间',
            trigger: ['blur']
          }
        ]
      },
      activeTabName: this.$route.params.tab_name || '0',
      //默认展开
      isShow: true,
      icon: 'el-icon-caret-left',
      position: {
        position: 'absolute',
        top: '300px'
      },
      // 默认关闭
      // isShow: false,
      // icon: 'el-icon-caret-right',
      // position: {
      //   position: 'absolute',
      //   top: '254px',
      // },
      filterText: null,
      statusBtnList: [
        ['库存不足', 1],
        ['主要SKU库存不足', 4],
        ['有死库风险', 2],
        ['库龄预警', 3],
        ['所有商品', null]
      ],
      customColumnParams: {
        oneLevelHeader: true,
        checkboxList: [
          'primarySkuProportion',
          'safeSaleableDays',
          'longestInvDays',
          'shippingDays',
          'sessions',
          'orderCnt',
          'conversionRates',
          'sellableQuantity',
          'avgDailySales',
          'sellableDays',
          'warnCnt',
          'invAge0To90Days',
          'invAge91To180Days',
          'invAge181To270Days',
          'invAge271To365Days',
          'invAge365PlusDays'
        ],
        checkboxOptions: [
          {
            label: 'primarySkuProportion',
            name: '主要成交SKU占比'
          },
          {
            label: 'safeSaleableDays',
            name: '安全可售天数'
          },
          {
            label: 'longestInvDays',
            name: '最长库存天数'
          },
          {
            label: 'shippingDays',
            name: '货运运输时间'
          },
          {
            label: 'sessions',
            name: '访客数'
          },
          {
            label: 'orderCnt',
            name: '订单数'
          },
          {
            label: 'conversionRates',
            name: '转化率'
          },
          {
            label: 'sellableQuantity',
            name: '库存数量'
          },
          {
            label: 'avgDailySales',
            name: '日均销量'
          },
          {
            label: 'sellableDays',
            name: '可售天数'
          },
          {
            label: 'warnCnt',
            name: '预警库存数'
          },
          {
            label: 'invAge0To90Days',
            name: '0~90天'
          },
          {
            label: 'invAge91To180Days',
            name: '91~180天'
          },
          {
            label: 'invAge181To270Days',
            name: '181~270天'
          },
          {
            label: 'invAge271To365Days',
            name: '271~365天'
          },
          {
            label: 'invAge365PlusDays',
            name: '大于365天'
          }
        ]
      },
      columnList: null,
      daterange: [],
      asinOrSkuLabel: 'ASIN',
      asinOrSkuOptions: ['ASIN', 'SKU'],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      sortProp: null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        sellerId: null,
        siteId: null,
        cusCateId: null,

        asin: null, //未知
        productStatus: null, //产品状态 1-在售 2-不可售 3-禁止显示
        sortField: null,
        invDayStatus: this.$route.params.invDayStatus || null,
        invStatus: this.$route.params.invStatus || 1 //库存状态 0-全部 1-库存不足 2-死库 3-库龄预警
      },
      multipleSelection: [],

      treeKey: 1,
      treeLoading: false,
      customCategoryData: [],

      defaultProps: {
        children: 'childList',
        label: 'cusCateName'
      },
      options: {
        visible: false,
        width: '400px',
        title: '设置',
        okBtnText: '确认'
      },
      events: {
        handleOkClick: () => {
          this.submitForm('ruleForm')
        }
      },
      ruleForm: {
        siteId: null,
        sellerId: null,
        platformId: this.platformId,
        safeSaleableDays: null,
        primarySkuProportion: null,
        longestInvDays: null,
        shippingDays: null
      },
      searchLoading: false,

      asinColor: '#108ee9', //表格列asin文字颜色
      skuColor: '#999', //表格列sku文字颜色
      asinShow: true, //表格列asin是否显示

      updateBtnDisabled: false,
      isAll: null
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val)
    },
    sellerData() {
      this.initPage()
    }
  },
  created() {
    this.columnList = this.customColumnParams.checkboxList
    this.initPage()
  },
  // mounted() {
  //   // this.$refs.productStatusBtn.$children[0].$el.className =
  //   //   'el-button el-button--primary'
  // 	if(this.$route.query) this.listQuery.invDayStatus = this.$route.query.type
  // },
  mounted() {
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMousemove)
    window.addEventListener('resize', this.setInnerCirclePosition)
    this.$nextTick(() => {
      this.innerCircle = this.$refs.inner
      let tableEl = document.querySelectorAll('.box-data')[0]
      tableEl.addEventListener('mouseenter', this.handleTableMouseenter)
      tableEl.addEventListener('mouseleave', this.handleTableMouseleave)
      // this.setInnerCirclePosition()
    })
  },
  beforeDestroy() {
    let tableEl = document.querySelectorAll('.box-data')[0]
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMousemove)
    window.removeEventListener('resize', this.setInnerCirclePosition)
    if (tableEl) {
      tableEl.removeEventListener('mouseenter', this.handleTableMouseenter)
      tableEl.removeEventListener('mouseleave', this.handleTableMouseleave)
    }
  },
  methods: {
    handleMouseUp(e) {
      this.move = false
      this.innerCircle.style.left = this.originLeft + 'px'
      this.innerCircle.style.top = this.originTop + 'px'

      if (window.requestAnimationFrame) {
        window.cancelAnimationFrame(this.requestId)
      } else {
        clearTimeout(this.requestId)
      }
      this.requestId = null
    },
    checkStrict(row) {
      // 如果没有展开时，判断父产品是否选中，选中的话子产品也要选中
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
    handleExpand(scope) {
      if (!scope.row._expanded) {
        if (!scope.row.children) {
          this.$set(scope.row, 'loading', true)
          if (scope.row.childList.length) {
            scope.row.loading = false
            this.$set(scope.row, 'children', scope.row.childList)
            this.$set(scope.row, '_expanded', true)
            // this.checkStrict(scope.row)
          } else {
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
    moveAndScroll(child, e, isMoveInnerCircle = true) {
      let vm = this
      let { target, pageX, pageY } = e
      // 移动小圆
      let {
        offsetLeft: pLeft,
        offsetTop: pTop,
        offsetWidth,
        offsetHeight
      } = child

      if (isMoveInnerCircle) {
        let scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop
        child.style.left = pageX - offsetWidth / 2 + 'px'
        child.style.top = pageY - offsetHeight / 2 + 'px' - scrollTop
      }

      // 滑动scroll
      let scrollLeftEl = document.querySelectorAll('.el-table__body-wrapper')[0]
      let distanceX = Math.abs(pageX - this.originX)
      let distanceY = pageY - this.originY
      window._setTimeout =
        window._setTimeout ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.setTimeout

      function updateScroll() {
        //
        if (vm.requestId) {
          if (window.requestAnimationFrame) {
            window.cancelAnimationFrame(vm.requestId)
          } else {
            clearTimeout(vm.requestId)
          }

          vm.requestId = null
        }
        if (pageX > vm.originX) {
          // 右
          scrollLeftEl.scrollLeft += 2 + distanceX
          vm.requestId = window._setTimeout(updateScroll)
        }
        if (pageX < vm.originX && scrollLeftEl.scrollLeft > 0) {
          // 左
          scrollLeftEl.scrollLeft -= 2 + distanceX
          if (scrollLeftEl.scrollLeft !== 0) {
            vm.requestId = window._setTimeout(updateScroll)
          }
        }
      }

      if (scrollLeftEl) {
        updateScroll()
      }
    },
    cellStyle({ row }) {
      return row.parent ? 'background: #f2f6fc' : null
    },
    evalFunc(data, expandAll, parent = null, level = null) {
      let tmp = [],
        vm = this
      Array.from(data).forEach(function(record) {
        if (record._expanded === undefined) {
          vm.$set(record, '_expanded', expandAll)
        }
        let _level = 1
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        vm.$set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          vm.$set(record, 'parent', parent)
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
    handleTabClick(tab) {
			this.$refs.clearTableSort.clearSelection()
      let { index } = tab
      let { item } = tab.$attrs
      // this.tabsLoading = true
			this.listQuery.pageNumber = 1
			
      this.setStatus(item[1], +index)
    },
    //表头点击asin
    asinClick() {
      this.asinColor = '#108ee9'
      this.skuColor = '#999'
      this.asinShow = true
    },
    //表头点击sku
    skuClick() {
      this.asinColor = '#999'
      this.skuColor = '#108ee9'
      this.asinShow = false
    },
    handleTableMouseenter() {
      this.showCircle = true
      this.setInnerCirclePosition()
    },
    handleTableMouseleave() {
      this.showCircle = false
    },
    setInnerCirclePosition() {
      if (!this.$refs.outer) {
        return
      }
      this.$nextTick(() => {
        let {
          offsetLeft,
          offsetTop,
          offsetWidth,
          offsetHeight
        } = this.$refs.outer
        let {
          offsetWidth: offsetWidth1,
          offsetHeight: offsetHeight1
        } = this.innerCircle

        this.originX = offsetLeft + offsetWidth / 2
        this.originY = offsetTop + offsetWidth / 2
        this.originLeft = this.originX - offsetWidth1 / 2
        this.originTop = this.originY - offsetHeight1 / 2

        this.innerCircle.style.left = this.originLeft + 'px'
        this.innerCircle.style.top = this.originTop + 'px'
      })
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId
        this.getCustomCategory()

        this.getList()
      }
    },
    distribute(type) {
      switch (type) {
        case '全局预警库存设置':
          this.isAll = true
          this.showDialog(null)
          break
        case '单个预警库存设置':
          if (!this.multipleSelection.length)
            return this.$message.warning('请选择至少一项')
          this.isAll = false
          this.showDialog(null)
          break
        case '导出':
          this.exportExcelFile()
          break
      }
    },
    setShow() {
      this.isShow = !this.isShow

      if (this.isShow) {
        this.icon = 'el-icon-caret-left'
      } else {
        this.icon = 'el-icon-caret-right'
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.cusCateName.indexOf(value) !== -1
    },
    getCustomCategory() {
      this.treeLoading = true
      this.$api['customCategoryList']({
        sellerId: this.listQuery.sellerId
      })
        .then(res => {
          let { code, data } = res
          if (code === 0) {
            this.customCategoryData = data
            this.customCategoryData.unshift({
              childList: null,
              createTime: null,
              cusCateId: null,
              cusCateName: '全部',
              haveChildren: 0,
              parentCusCateId: 0
            })
            this.customCategoryData.push({
              childList: null,
              createTime: null,
              cusCateId: -1,
              cusCateName: '未映射类目产品',
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
    // renderAsinOrSku(h, { column, $index }) {
    //   // class="table-column-select"
    //   return (
    //     <el-select
    //       value={this.asinOrSkuLabel}
    //       size="mini"
    //       style={{ width: "120px" }}
    //       onChange={e => {
    //         this.asinOrSkuLabel = e;
    //       }}
    //     >
    //       {this.asinOrSkuOptions.map(item => (
    //         <el-option key={item} label={item} value={item} />
    //       ))}
    //     </el-select>
    //   );
    // },

    setManualUpdate() {
      this.$api['productManualUpdate']({
        siteId: this.listQuery.siteId,
        sellerId: this.listQuery.sellerId,
        merchantId: 2
      }).then(res => {
        if (res.code === 0) {
          // if(this.listQuery.cusCateId!==null){
          this.handleFilter()
          // }
        }
      })
    },
    setCustomColumn(list) {
      this.columnList = list
    },
    handleMousemove(e, isSelf) {
      if (this.move) {
        let child = this.innerCircle
        if (child) {
          this.moveAndScroll(child, e)
        }
      }
    },
    handleArrowMousedown(e) {
      this.move = true
      if (this.move) {
        let child = this.innerCircle
        if (child) {
          this.moveAndScroll(child, e, false)
        }
      }
    },
    formatterConversionRates(row, column) {
      let val = row.conversionRates
      if (val === null) {
        return '-'
      }
      return this.toPercent(val)
    },
    toPercent(point) {
      if (isNaN(point) || point == 0) {
        return '0%'
      }
      let str = Number(point * 100).toFixed()
      str += '%'
      return str
    },
    resetListQueryForm() {
      this.listQuery.asin = null
      this.daterange = []
      this.listQuery.productStatus = null
      this.listQuery.invDayStatus = null
      this.$refs.listQueryForm.resetFields()
      this.getList()
    },
    handleMouseDown(e) {
      this.move = true
      // 当前点击的点
      // this.currentPointX = e.pageX;
      // this.currentPointY = e.pageY;
      if (this.move) {
        let child = this.innerCircle
        if (child) {
          this.moveAndScroll(child, e)
        }
      }
    },
    getList() {
      this.getListCount()
      // if(this.listQuery.cusCateId===null){
      //     this.$message.warning('请选择类目');
      //     return
      // }

      // this.listLoading = true
      // this.searchLoading = true
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
      if (listQuery.productStatus !== null) {
        listQuery.productStatus = parseInt(listQuery.productStatus)
      }
      if (this.sortProp) {
        let sortPropArr = this.sortProp.split(' ')
        if (sortPropArr.length === 2) {
          let sortField = sortPropArr[0]
          if (sortField === 'inv_age0_to90_days') {
            sortField = 'inv_age_0_to_90_days'
          } else if (sortField === 'inv_age91_to180_days') {
            sortField = 'inv_age_91_to_180_days'
          } else if (sortField === 'inv_age181_to270_days') {
            sortField = 'inv_age_181_to_270_days'
          } else if (sortField === 'inv_age271_to365_days') {
            sortField = 'inv_age_271_to_365_days'
          } else if (sortField === 'inv_age365_plus_days') {
            sortField = 'inv_age_365_plus_days'
          }

          listQuery.sortField = sortField
          if (sortPropArr[1] === 'desc') {
            listQuery.sort = 0
          } else {
            listQuery.sort = 1
          }
        } else {
          listQuery.sortField = null
          listQuery.sort = 0
        }
      } else {
        listQuery.sortField = null
        listQuery.sort = 0
      }
      this.listLoading = true
      this.searchLoading = true

      this.$api['productInventoryFbaList'](listQuery)
        .then(res => {
          let { rows, total } = res
          this.list = rows
          this.total = total

          this.listLoading = false
          this.searchLoading = false
        })
        .catch(() => {
          this.listLoading = false
          this.searchLoading = false
        })
    },
    getListCount() {
      let params = {
        sellerId: this.listQuery.sellerId,
        siteId: this.listQuery.siteId,
        cusCateId: this.listQuery.cusCateId
      }
      this.$api['productInventoryFbaListCount'](params).then(res => {
        let { code, data } = res
        if (code === 0) {
          let status0Btn = data.find(element => {
            return element.pageType == 1
          })
          this.statusBtnList[0] = [`库存不足(${status0Btn.total})`, 1]

          let status4Btn = data.find(element => {
            return element.pageType == 4
          })
          this.statusBtnList[1] = [`主要SKU库存不足(${status4Btn.total})`, 4]

          let status1Btn = data.find(element => {
            return element.pageType == 2
          })
          this.statusBtnList[2] = [`有死库风险(${status1Btn.total})`, 2]

          let status2Btn = data.find(element => {
            return element.pageType == 3
          })
          this.statusBtnList[3] = [`库龄预警(${status2Btn.total})`, 3]

          let status3Btn = data.find(element => {
            return element.pageType == 0
          })
          this.statusBtnList[4] = [`所有商品(${status3Btn.total})`, 0]
        }

        //    statusBtnList:[
        //     ['库存不足(10)',1],
        //     ['有死库风险(10)',2],
        //     ['库龄预警(10)',3],
        //     ['所有商品(10)',null],
        // ]
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
		handleRowSelect(selection, row) {
			if (row._expanded || this.$refs.clearTableSort.selection.indexOf(row) === -1) {
				this.checkStrict(row)
			}
		},
    handleSortChange({ column, prop, order }) {
      if (!prop) {
        this.sortProp = null
        this.handleFilter()
        return
      }
      console.log(column, prop, order)
      const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
        return '_' + str.toLowerCase()
      })} ${order === 'ascending' ? 'asc' : 'desc'}`
      this.sortProp = sortOrder
      this.handleFilter()
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

    setStatus(status, index) {
      // let productStatusBtnArr = this.$refs.productStatusBtn.$children
      // productStatusBtnArr.forEach(element => {
      //   element.$el.className = 'el-button el-button--primary is-plain'
      // })
      // productStatusBtnArr[index].$el.className = 'el-button el-button--primary'
      this.listQuery.invStatus = status
      this.$refs.clearTableSort.clearSort()
      // this.listQuery.sortField =null
      this.sortProp = null
      this.listQuery.sort = 0
      this.resetListQueryForm()
      // this.handleFilter()
    },

    showDialog(row) {
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
      this.getInfo()
      this.options.visible = true
    },
    getInfo() {
      let params = {
        siteId: this.listQuery.siteId,
        sellerId: this.listQuery.sellerId,
        platformId: this.platformId,
        pageType: this.listQuery.invStatus
      }
      this.$api['productSkuWarnInfo'](params).then(res => {
        let { code, data } = res
        if (code == 0) {
          if (data !== null) {
            this.ruleForm.primarySkuProportion = data.primarySkuProportion * 100
            this.ruleForm.shippingDays = data.shippingDays
            this.ruleForm.safeSaleableDays = data.safeSaleableDays
            this.ruleForm.longestInvDays = data.longestInvDays
          }
        }
      })
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.ruleForm.siteId = this.listQuery.siteId
          this.ruleForm.sellerId = this.listQuery.sellerId
          this.ruleForm.platformId = this.platformId
          let paramMap = _.cloneDeep(this.ruleForm)
          if (!this.isAll)
            paramMap.ids = this.multipleSelection.map(e => {
              return e.productId
            })
          paramMap.primarySkuProportion =
            parseInt(paramMap.primarySkuProportion) / 100

          this.$api['productSkuWarnSave'](paramMap)
            .then(data => {
              this.options.visible = false
              this.getList()
            })
            .catch(() => {
              this.options.visible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toFixedMethod(num) {
      var str = Number(num * 100).toFixed(0)
      str += '%'
      return str
    },
    exportExcelFile() {
      this.updateBtnDisabled = true
      let ids = []
      this.multipleSelection.forEach(element => {
        ids.push(element.productId)
      })
      let pageType = this.listQuery.invStatus
      if (pageType == null) {
        pageType = 0
      }
      let params = {
        siteId: this.listQuery.siteId,
        sellerId: this.listQuery.sellerId,
        // merchantId:1,
        platformId: this.platformId,
        ids: ids.length == 0 ? null : ids,
        pageType
      }

      this.$ajax({
        method: 'post',
        url: BASE_URL + 'productInventoryFba/exportData',
        responseType: 'blob',
        data: params
      }).then(data => {
        this.updateBtnDisabled = false
        let { type } = data
        if (type === 'application/json') {
          this.$message.error('导出失败')
          return
        }
        let url = window.URL.createObjectURL(new Blob([data]))
        let a = this.$refs.exportExcel
        a.href = url
        a.setAttribute('download', 'SKU监控预警.xlsx')
        a.click()
        window.URL.revokeObjectURL(url)
        a.onprocess = function() {
          console.log(1)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.custom-collapse .el-form-item {
  margin-bottom: 10px;
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
    z-index: 2000;
  }

  .drawer-btn1 {
    position: absolute;
    top: 246px;
  }

  .box-update-btn {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }

  .box-body {
    display: flex;

    .menu {
      // height: 100vh;
      // overflow-y: auto;
      border-right: 1px solid @borderColor;
      // border-radius: 3px;
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
      }

      // padding: 10px;
      // border: 1px solid @borderColor;
      border-radius: 3px;
      margin-left: 10px;
      margin-right: 10px;

      .box-info {
        margin-top: 10px;
        font-size: 14px;
        background-color: @boxQueryBGColor;
        padding: 15px;
        border: 1px solid @borderColor;
        display: flex;
        justify-content: space-between;

        span {
          &:first-of-type {
            margin-right: 20px;
          }

          &:last-of-type {
            color: @titleColor;
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

      .box-data {
        // .table-column-select{
        //     height: 40px;
        // }
        .el-table__header-wrapper {
          // .asin-sku {
          //   /deep/.cell {
          //     height: 40px;
          //   }
          // }
        }

        .el-pagination {
          .el-pagination;
        }
      }
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
    padding: 10px;
    margin: 10px;
    border: 1px solid @borderColor;
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
.box-data {
  .el-table__header-wrapper {
    // .asin-sku {
    //   /deep/.cell {
    //     height: 38px;
    //   }
    // }
    .level-1-column {
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
}

.custom-dropbtn {
  i {
    font-size: 16px;
  }
}
</style>

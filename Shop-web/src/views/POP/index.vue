<template>
  <div class="box">
    <tpl-drawer>
      <div slot="leftMenu" class="box-left-menu">
        <el-input clearable placeholder="输入类目过滤" v-model.trim="filterText" size="small" class="menu-select"></el-input>
        <div class="el-icon-box">
          <i class="el-icon-refresh common_color" @click="getCustomCategory"></i>
        </div>
        <el-tree
          :expand-on-click-node="false"
          node-key="cusCateId"
          :data="customCategoryData"
          :props="defaultProps"
          highlight-current
          @node-click="handleNodeClick"
          ref="treeCustomCategory"
          :filter-node-method="filterNode"
          v-loading="treeLoading"
          :key="treeKey"
          default-expand-all
          :current-node-key="null"
        >
          <!-- 鼠标移上去显示 -->
          <span class="span-ellipsis" slot-scope="{ node, data }">
            <span :title="node.label" class="font12">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div slot="body" class="box-body" style="min-width:900px;">
        <el-button
          type="primary"
          plain
          size="small"
          @click="showDialogPercent('all')"
          style="margin-bottom:10px;"
        >设置全局主要成交SKU百分比</el-button>
        <el-dialog
          class="customDialog"
          title="设置全局主要成交SKU百分比"
          :visible.sync="dialogVisible2"
          width="500px"
          :close-on-click-modal="false"
        >
          <el-form class="pad10" size="small">
            <ElFormItem label-width="90px">
              <el-input
                placeholder="输入数字"
                v-model.trim="primarySkuProportion"
                clearable
                style="max-width:300px"
                size="small"
              ></el-input>&nbsp;&nbsp;%
            </ElFormItem>
          </el-form>
          <div slot="footer" style="text-align:center;">
            <el-button
              type="primary"
              size="small"
              @click="addPOP"
              :loading="submitLoading2"
              :disabled="!primarySkuProportion"
            >确定</el-button>
            <el-button
              type="primary"
              size="small"
              plain=""
              @click="dialogVisible2=false"

            >取消</el-button>
          </div>
        </el-dialog>
        <template>
          <el-search :search="search" :clearSearch.sync="clearSearch" :clearfield="clearfield" :__picker='picker'></el-search>
        </template>
        <div class="margin_bottom8 margin_top8">
          <el-button type="primary" @click="showDialog" size="small" plain>添加优化</el-button>
          <el-button type="primary" @click="showDelete" size="small" plain>删除</el-button>
          <!-- {{userSelect}} -->
          <el-button type="primary" size="small" plain @click="showDialog2">编辑</el-button>
          <el-button type="primary" plain size="small" @click="showDialogPercent('others')">设置主要成交SKU百分比</el-button>
          <el-button
            type="primary"
            plain
            size="small"
            @click="Optimize(1)"
            :disabled="$store.state.isloading || $store.state.loading"
          >开启优化</el-button>
          <el-button
            type="primary"
            plain
            size="small"
            @click="Optimize(0)"
            :disabled="$store.state.isloading || $store.state.loading"
          >暂停优化</el-button>
        </div>
        <template>
          <el-table-pagination
            :table="table"
            :pageNumber.sync="table.pageNumber"
            :pageSize.sync="table.pageSize"
            :total="table.total"
            v-loading="table.loading"
            :userSelect.sync="userSelect"
            :selection="true"
          ></el-table-pagination>
        </template>
      </div>
    </tpl-drawer>
    <!-- title="添加优化"  -->
    <yt-dialog :options="dialogVisible" :events="dialogVisibleEvents" :close-on-click-modal="false">
      <!-- <div slot="title" style="font-size:14px;">{{title}}</div> -->
      <template>
        <div class="__box_wrapper__local_page">
          <el-form
            class="custom_li_form"
            size="small"
            :model="form"
            :rules="rules"
            ref="ruleForm"
            style="width:100%"
            label-width="130px"
          >
            <el-form-item label="产品ASIN" prop="parentAsin" :rules="rules.parentAsin">
              <el-select
                v-model="form.parentAsin"
                placeholder="输入或选择产品ASIN"
                clearable
                style='width:300px;'
                size="small"
                filterable
              >
                <el-option v-for="item in skuOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="最高价" prop="seoMaxPrice" :rules="rules.seoMaxPrice">
              <el-input placeholder="请输入最高价" v-model.trim="form.seoMaxPrice" clearable size="small" style='width:300px;'></el-input>
            </el-form-item>

            <el-form-item label="最低价" prop="seoMinPrice" :rules="rules.seoMinPrice">
              <el-input placeholder="请输入最低价" v-model.trim="form.seoMinPrice" clearable size="small" style='width:300px;'></el-input>
            </el-form-item>

            <!-- <el-form-item label="原价" prop="originalPrice" :rules="rules.originalPrice">
              <el-input placeholder="请输入原价" v-model.trim="form.originalPrice" clearable size="small" style='width:300px;'></el-input>
            </el-form-item> -->

            <div class="flex">
              <el-form-item label="改价幅度" prop="priceRange" :rules="rules.priceRange">
                <el-input placeholder="请输入金额" v-model.trim="form.priceRange" clearable size="small" style='width:140px;'></el-input>
              </el-form-item>

              <el-form-item class="ml10" prop="priceFrequency" :rules="rules.priceFrequency" label-width="0px">
                <div class="flex">
                  <el-input placeholder="请输入频率" v-model.trim="form.priceFrequency" clearable size="small"  style='width:150px;'></el-input>
                  <span class="ml10">分</span>
                </div>
              </el-form-item>
            </div>

            <template v-if="form.parentAsin&&childSkuOptions.length>0">
              <div class="flex">
                <el-form-item label="区间最低价" prop="lowestSalesAsin" :rules="rules.lowestSalesAsin">
                  <el-select
                    v-model="form.lowestSalesAsin"
                    placeholder="请输入ASIN"
                  
                    clearable
                    size="small"
                    style='width:140px;'
                    filterable
                  >
                    <el-option
                      v-for="item in childSkuOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item prop="intervalMinPrice" :rules="rules.intervalMinPrice" label-width="0px" class="ml10">
                  <el-input placeholder="请输入价格" v-model.trim="form.intervalMinPrice" clearable size="small" style='width:150px;'></el-input>
                </el-form-item>
              </div>
            </template>

            <el-form-item prop="newProductFlag" label="是否新品">
              <el-checkbox-group v-model="form.newProductFlag">
                <el-checkbox label="是"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="参考ASIN" prop="refParentAsin" :rules="rules.refParentAsin" v-if="form.newProductFlag">
              <el-select
                v-model="form.refParentAsin"
                placeholder="输入或选择参考ASIN"
                clearable
                style='width:300px;'
                size="small"
                filterable
              >
                <el-option
                  v-for="item in refParentAsinOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="sameParentAsins" label="同款ASIN" style="width:100%;margin-bottom: 32px" 
                :rules="[
                    { required: true, message: '请输入ASIN', trigger: ['blur','change'] }
                  ]"
              >
              <el-input
                style='width:300px;'
                type="textarea"
                :rows="4"
                placeholder="输入ASIN,多ASIN个换行输入或用逗号隔开"
                v-model.trim="form.sameParentAsins"
              />
              <!-- <div v-if="showTips1" class="_fontSize1">请输入asin</div> -->
              <div v-if="showTips" class="_fontSize1">ASIN个数不能超过500个</div>
              <div v-if="showTips2" class="_fontSize1">以下ASIN长度不对：{{errorSameParentAsin}}</div>
              <div class="_fontSize">已输入 {{fontSum||0}} 个</div>
            </el-form-item>
            <div  style='border-bottom:1px solid #dcdcdc;margin-top:10px;'></div>
            <div  v-for="(item,index) in form.stageList" :key="index" style='border-bottom:1px solid #dcdcdc;margin-top:10px;'>
              <div class="tit" style='margin-left: 20px;font-weight:bold;font-size:15px'>
                阶段{{index+1}}
                <el-input
                  :autofocus="false"
                  type="hidden"
                  v-model.trim="item.stageNo"
                  style="width:100px;display:none"
                  :value="index+1"
                  size="small"
                />
                <!-- <div>
                  <el-button
                    type="text"
                    icon=" el-icon-minus"
                    style="padding:0"
                    v-if="form.stageList.length>1?true:false"
                    @click="spliceItem(index)"
                  ></el-button>
                  <el-button
                    class="el-icon-plus"
                    type="text"
                    style="padding:0"
                    v-if="index===0&&form.stageList.length===1||index===form.stageList.length-1&&form.stageList.length>1?true:false"
                    @click="addItem"
                  ></el-button>
                </div> -->
              </div>

              <el-form-item label="时间段" :prop="'stageList.'+index+'.date'" :rules="rules.date"  >
                <el-date-picker
                  v-model="item.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="{shortcuts: cfuns.__pickerOptions.shortcuts, disabledDate: cfuns._pickerFuture.disabledDate}"
                  size="small"
                  value-format="yyyy-MM-dd"
                  style='width:300px'
                ></el-date-picker>
              </el-form-item>

              <el-form-item
                label="订单目标类型"
                prop="targetType"
                :prop="'stageList.'+index+'.targetType'"
                :rules="rules.targetType"
                style='display: inline-block !important;'
              >
                <el-select v-model="item.targetType" placeholder="订单目标类型"    style='width:300px' clearable size="small" >
                  <el-option
                    v-for="item in targetTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                label="订单目标设置"
                :prop="'stageList.'+index+'.stageOrderCnt'"
                :rules="getRule(item.stageOrderCnt,index)"
                v-if="item.targetType==1"
                style='display: inline-block !important;'
              >
                <el-input
                  :autofocus="false"
                  v-model.trim="item.stageOrderCnt"
                    style='width:300px'
                  placeholder="订单目标设置"
                  size="small"
                />
              </el-form-item>

              <el-form-item
                label="选择类目:"
                :prop="'stageList.'+index+'.bsrCategory'"
                :rules="rules.bsrCategory"
                v-if="item.targetType==2"
              >
                <el-cate
                  :Cate.sync="item.bsrCategory"
                  :width='"300px"'
                  :size="'small'"
                  :platformId="platformId"
                  :placeholder="item.bsrCategory"
                ></el-cate>
              </el-form-item>

              <el-form-item
                label="目标排名"
                :prop="'stageList.'+index+'.rank'"
                :rules="getRule(item.rank,index)"
                v-if="item.targetType==2"
                style='display: inline-block !important;'
              >
                <el-input :autofocus="false" v-model.trim="item.rank"    style='width:300px' placeholder="请输入目标排名" size="small"/>
              </el-form-item>

              <el-form-item style="display:inline-block" label-width="10px">
                <el-button
                    type="text"
                    icon=" el-icon-minus"
                    style="padding:0"
                    v-if="form.stageList.length>1?true:false"
                    @click="spliceItem(index)"
                  ></el-button>
                  <el-button
                    class="el-icon-plus"
                    type="text"
                    style="padding:0"
                    v-if="index===0&&form.stageList.length===1||index===form.stageList.length-1&&form.stageList.length>1?true:false"
                    @click="addItem(index)"
                  ></el-button>
                </el-form-item>
            </div>
          </el-form>
        </div>
      </template>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.visible = false" size='mini'>取 消</el-button>
        <el-button type="primary" @click="submit()" size='mini' :loading="submitLoading">确 定</el-button>
      </div>-->
    </yt-dialog>
    <!-- 同款asin弹窗 -->
    <template>
      <el-dialog :close-on-click-modal="false" title="同款ASIN" :visible.sync="visible1" height="505px" width="300px">
        <el-table
          ref="multipleTable"
          :data="showTable1"
          style="width: 100%;position:relative;top:-20px;"
          :stripe="true"
        >
          <el-table-column prop="asin" label="ASIN">
            <template slot-scope="scope">{{scope.row.asin | _formatData}}</template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </template>
    <!-- 当前执行阶段弹窗 -->
    <template>
      <el-dialog :close-on-click-modal="false" title="当前执行阶段" :visible.sync="visible2" height="505px" width="1200px">
        <el-table
          ref="multipleTable"
          :data="showTable2"
          style="width: 100%;position:relative;top:-20px;"
          :stripe="true"
          border
        >
          <el-table-column prop="stageNo" label="阶段" width="80">
            <template slot-scope="scope">{{scope.row.stageNo | _formatData}}</template>
          </el-table-column>
          <el-table-column label="计划起止时间" width="180">
            <template slot-scope="scope">
              <span
                v-if="scope.row.startTime&&scope.row.endTime"
              >{{scope.row.startTime.slice(0,10)+' ~ '+scope.row.endTime.slice(0,10)}}</span>
              <span v-if="scope.row.startTime&&!scope.row.endTime">{{scope.row.startTime.slice(0,10)+' ~ '}}</span>
              <span v-if="!scope.row.startTime&&scope.row.endTime">{{ '~ '+scope.row.endTime.slice(0,10)}}</span>
              <span v-if="!scope.row.startTime&&!scope.row.endTime">-</span>
            </template>
          </el-table-column>
          <el-table-column label="实际起止时间" width="180">
            <template slot-scope="scope">
              <span
                v-if="scope.row.actualStartTime&&scope.row.actualEndTime"
              >{{scope.row.actualStartTime.slice(0,10)+' ~ '+scope.row.actualEndTime.slice(0,10)}}</span>
              <span
                v-if="scope.row.actualStartTime&&!scope.row.actualEndTime"
              >{{scope.row.actualStartTime.slice(0,10)+' ~ '}}</span>
              <span
                v-if="!scope.row.actualStartTime&&scope.row.actualEndTime"
              >{{' ~ '+scope.row.actualEndTime.slice(0,10)}}</span>
              <span v-if="!scope.row.actualStartTime&&!scope.row.actualEndTime">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="targetType" label="执行方式" width="140">
            <template slot-scope="scope">{{scope.row.targetType===1?'按订单目标':scope.row.targetType===2?'按BSR排名':'-'}}</template>
          </el-table-column>
          <el-table-column prop="stageOrderCnt" label="目标">
            <template slot-scope="scope">
              <span v-if="scope.row.targetType===1">{{scope.row.stageOrderCnt | _formatData}}</span>
              <el-tooltip placement="top" effect="light">
                <div slot="content">{{'类目'+scope.row.bsrCategory+'第'+scope.row.rank+'名'}}</div>
                <span v-if="scope.row.targetType===2" class='fix__row_1'>{{'类目'+scope.row.bsrCategory+'第'+scope.row.rank+"名"}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="执行状态" width="140">
            <template
              slot-scope="scope"
            >{{scope.row.status===0?'未执行':scope.row.status===1?'执行中':scope.row.status===2?'执行完成':'-'}}</template>
          </el-table-column>
          <el-table-column prop="targetFlag" label="达标状态" width="140">
            <template slot-scope="scope">{{scope.row.targetFlag===0?'未达标':scope.row.targetFlag===1?'已达标':'-'}}</template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import { CONST_PORT_CONFIG } from 'Config'
import TplDrawer from '../Common/tpl-drawer/index'
import YTemplate from '../Common/y-template/index'
import dayjs from 'dayjs'
class newItem {
  constructor() {
    ;(this.stageNo = ''), //阶段编号
      (this.date = []), // 时间段
      (this.targetType = ''), //目标类型
      (this.stageOrderCnt = ''), //目标
      (this.bsrCategory = ''), //亚马逊类目
      (this.rank = '') //目标排名
  }
}
var validatorNumber = (rule, value, callback) => {
  let value_ = +value
  // console.log(isNaN(value_));
  if (isNaN(value_)) {
    callback(new Error('请输入数值'))
    return
  } else {
    if (value_ < 0) {
      callback(new Error('不能输入负数'))
      return
    } else {
      callback()
    }
  }
}
var itemVali1 = (item_, index) => {
  let validator = (rule, value, callback) => {
    if (!item_) {
      callback(new Error('请输入数值'))
    }
    if (isNaN(item_)) {
      callback(new Error('请输入数值'))
      return
    } else {
      if (item_ < 0) {
        callback(new Error('不能输入负数'))
        return
      } else {
        callback()
      }
    }
  }
  return [
    {
      required: true,
      validator: validator,
      trigger: ['change', 'blur']
    }
  ]
}

export default {
  components: {
    TplDrawer,
    YTemplate
  },
  provide() {
    return {
      getList: this.getList,
      showEchart__: this.showEchart__,
      show1__: this.show1__,
      show2__: this.show2__
    }
  },

  data() {
    var validatorDate = (rule, value, callback) => {
    // console.log(rule);
    // console.log(value);
    let nowIndex = rule.field.split('.')[1]*1;
        //console.log(nowIndex);
    if( !value ){
      return  callback(new Error("请选择时间"));
    };
    if( nowIndex!==0 ){
        let previousDate =   this.form.stageList[nowIndex-1].date;
        if ( !previousDate || !previousDate.length  ) {
            this.form.stageList[nowIndex].date = [] ;
            return  callback(new Error('请先选择上一阶段的时间'));
        }else{
            let pre = new Date(this.form.stageList[nowIndex-1].date[1]).getTime()
            let now = new Date(this.form.stageList[nowIndex].date[0]).getTime()
            // console.log(pre +"pre");
            // console.log(now +'now');
            // console.log(pre<now);
            if(pre>now){
                return  callback(new Error('不能早于上一阶段的时间'));
            };          
        }
      };
    
        //debugger
      if( this.form.stageList[nowIndex+1] && this.form.stageList[nowIndex+1].date && this.form.stageList[nowIndex+1].date.length ){
          console.log(this.form.stageList[nowIndex+1].date);
          let now = new Date(this.form.stageList[nowIndex].date[1]).getTime()
          let next= new Date(this.form.stageList[nowIndex+1].date[0]).getTime()
          // console.log(old);
          // console.log(now);
          // console.log(now);
          // console.log(next);
          // console.log(now<next);
          if(now>next){
              return  callback(new Error('不能晚于下一阶段的时间'));
          };
      };
      this.form.stageList.forEach((i , index) =>{
          // console.log(i);
          // console.log(i.date);
          if(value[0]===i.date[0] && value[1]===i.date[1] && index !== nowIndex){
              return  callback(new Error('阶段'+`${index+1}选择已有相同时间`));
          }
      });
      callback()
    }
    return {
      picker: {
          disabledDate(time) {
            return time.getTime() > (Date.now()-15*3600*1000);
        }
      },
      clearfield: ['asin', 'date'],
      getRule(item, index) {
        return itemVali1(item, index)
      },
      errorSameParentAsin: '',
      targetTypeOptions: [
        {
          label: '按订单目标',
          value: 1
        },
        {
          label: '按BSR目标',
          value: 2
        }
      ],
      skuOptions: [],
      refParentAsinOptions: [],
      childSkuOptions: [],
      title: null,
      loading_1: false,
      loading_2: false,
      loading_3: false,
      visible1: false,
      showTable1: [],
      visible2: false,
      showTable2: [],
      // 搜索
      search: {
        date: true,
        asin: true
      },
      clearSearch: null,
      searchData: {},
      searchLoading: false,
      radio: '从列表中选择产品',
      primarySkuProportion: null,
      more: false,
      asinArr: null,
      fontSum: 0,
      showTips: false,
      showTips1: false,
      showTips2: false,
      uploadTaskShow: false,
      title: '添加计划',
      fileList: [],
      fileList2: [],
      buttonLoading: {
        upload: false
      },
      status: 1,
      //dialogVisible: false,
      dialogVisible: {
        visible: false,
        width: '550px',
        title: ''
      },
      dialogVisibleEvents: {
        handleOkClick: () => {
          this.submit()
        }
      },
      dialogVisible2: false,
      submitLoading: false,
      submitLoading2: false,
      elIconMenuShow: false,
      filterText: null,
      treeKey: 1,
      treeLoading: false,
      customCategoryData: [],
      defaultProps: {
        children: 'childList',
        label: 'cusCateName'
      },
      form: {
        stageList: [new newItem()]
      },
      rules: {
        parentAsin: [
          {
            required: true,
            message: '产品ASIN不能为空'
            // trigger: ["blur", "change"]
          }
        ],
        seoMaxPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ['change', 'blur']
            // message: "请输入最高价"
          }
        ],
        seoMinPrice: [
          {
            required: true,
            validator: validatorNumber
            // trigger: ["change", "blur"]
            // message: "请输入最低价"
          }
        ],
        originalPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ['change', 'blur']
            // message: "请输入原价"
          }
        ],
        priceRange: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ['change', 'blur']
            // message: "请输入改价幅度"
          }
        ],
        priceFrequency: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ['change', 'blur']
            // message: "请输入频率"
          }
        ],
        refParentAsin: [
          {
            required: true,
            message: '参考ASIN不能为空'
          }
        ],
        lowestSalesAsin: [
          {
            required: true,
            message: '区间ASIN不能为空'
          }
        ],
        intervalMinPrice: [
          {
            required: true,
            validator: validatorNumber,
            trigger: ['change', 'blur']
            // message: "请输入价格"
          }
        ],
        sameParentASINs: [
          {
            required: true,
            message: '同款ASIN不能为空'
          }
        ],
        date: [
          {
            required: true,
            validator: validatorDate,
            //message: '请选择时间段',
            trigger: ['change', 'blur']
          }
        ],
        targetType: [
          {
            required: true,
            message: '请选择订单目标类型'
          }
        ],
        stageOrderCnt: [
          {
            required: true,
            trigger: ['change', 'blur']
            // message: "请输入订单目标"
          }
        ],
        bsrCategory: [
          {
            required: true,
            message: '请选择类目'
          }
        ],
        rank: [
          {
            required: true,
            trigger: ['change', 'blur']
            // message: "请输入目标排名"
          }
        ]
      },
      detail: null,
      stageList: null,
      switch: false,
      cusCateId: null,
      table1: {
        loading: false,
        // rowKey: "asin",
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        userSelect: []
      },
      // 表格
      table: {
        loading: false,
        // rowKey: "taskId",
        rows: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          imageUrl_POP: true,
          asin_POP: true,
          seoMaxPrice: true, // 最高价
          seoMinPrice: true, // 最低价
          priceRange: true, //改价幅度
          priceFrequency: true, // 改价频率
          lowestSalesAsin: true, //区间最低价asin
          intervalMinPrice: true, //区间最低价
          sameParentAsins: true, //同款asin
          newProductFlag: true, //是否新品
          stageNo: true, //当前执行阶段
          primarySkuProportion: true // 主要成交sku百分比
        }
      },
      userSelect: []
    }
  },
  created() {
    this.initPage()
  },
  watch: {
    'form.parentAsin'(n) {
      if (n) {
        //console.log(this.form);
        this.getChildSku()

        // todo
        // let taskId = this.table.rows.find(el => {
        //   return n === el.parentAsin;
        // }).taskId;
        // let item = this.table.rows.find(el => {
        //   return n === el.parentAsin;
        // });
        //console.log(n)
        // console.log(item, "item");
        // if (taskId) {
        //   if (this.status == 2) {
        //     this.getDetails({ taskId: taskId });
        //   } else if (this.status == 1) {
        //     // 如果是添加则显示订单目标和目标值即可
        //     let params0 = {
        //       siteId: this.siteId,
        //       sellerId: this.sellerId,
        //       platformId: this.platformId
        //     };
        //     // 先请求列表
        //     this.$api["OrderTargetListTask"](params0).then(data0 => {
        //       let findTaskId;
        //       //console.log(object);
        //       data0.data.forEach(el => {
        //         el.taskAsinVOs.forEach(item => {
        //           if (item.parentAsin === n) {
        //             findTaskId = item.taskId;
        //           }
        //         });
        //       });
        //       // todo 根据asin，匹配到设置订单目标那边的taskId
        //       let params1 = {
        //         siteId: this.siteId,
        //         sellerId: this.sellerId,
        //         taskId: findTaskId
        //       };
        //       this.$api["OrderTargetTaskDetail"](params1)
        //         .then(data => {
        //           // todo
        //           // this.tableDialog.rows = data.data.stageList;
        //           let stageList = [];
        //           console.log(data, "data");
        //           if (!data) {
        //             return;
        //           } else {
        //             data.data.stageList.forEach((el, index) => {
        //               stageList.push({
        //                 date: [el.startTime, el.endTime],
        //                 stageOrderCnt: el.stageOrderCnt, //目标
        //                 targetType: 1
        //               });
        //             });
        //             this.$set(this.form, "stageList", stageList);
        //           }
        //         })
        //         .catch(err => {
        //           console.log(err);
        //         });
        //     });
        //     // this.getList({ taskId: taskId });
        //   }
        // }
      }
    },
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val)
    },
    sellerData() {
      this.initPage()
    },
    'form.sameParentAsins'(val) {
      if (val === '') {
        this.showTips = false
        this.showTips1 = false
        this.showTips2 = false
      }
      //   console.log(val, "val");
      // 自定义校验
      if (val) {
        let value = val
          .split(/[\n|\r\n|\,|\，]/)
          .map(el => el.trim())
          .filter(el => el !== '')
        this.asinArr = value
        this.fontSum = value.length
      }
      // errorSameParentAsin
    }
  },
  methods: {
    Optimize(n) {
      // n===0是暂停 ,1是开启
      //console.log(this.userSelect);
      let arr = JSON.parse(JSON.stringify(this.userSelect))
      if (!arr.length) {
        this.$message.warning('请至少选中一项')
        return
      }
      let ids = []
      arr.forEach(el => {
        // if(n===0 && el.stageNo===1){
        //     ids.push(el.taskId);
        // }else{
        //     ids.push(el.taskId);
        // }
        ids.push(el.taskId)
      })

      let datas = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        pauseFlag: n,
        ids: ids
      }
      this.$api['taskPriceSeoPause'](datas).then(data => {
        this.getList()
      })
    },
    show1__(row) {
      let item = this.table.rows.find(el => {
        return el.taskId === row.taskId
      })
      if (item) {
        let sameParentAsins = []
        if (item.sameParentAsins) {
          item.sameParentAsins.forEach(el => {
            sameParentAsins.push({
              asin: el
            })
          })
          this.visible1 = true
          this.showTable1 = sameParentAsins
        } else {
          this.$message.warning('暂无同款asin')
        }
      }
    },
    show2__(row) {
      let taskId = row.taskId
      let params = {
        taskId: taskId,
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      this.$api['TaskPriceSeoStageList'](params)
        .then(data => {
          // console.log(data);
          this.visible2 = true
          this.showTable2 = data.data
        })
        .catch(err => {
          this.$message.warning('暂无数据')
        })
    },
    showDelete() {
      let arr = JSON.parse(JSON.stringify(this.userSelect))
      if (!arr.length) {
        this.$message.warning('请至少选中一项')
        return
      }
      let ids = []
      arr.forEach(el => {
        ids.push(el.taskId)
      })
      let params = {
        ids: ids,
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['TaskPriceSeoBatchRemove'](params).then(res => {
            // 重新请求列表
            this.getList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showDialogPercent(type) {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      if (type === 'all') {
        this.isAll = true
      } else {
        this.isAll = false
        let arr = JSON.parse(JSON.stringify(this.userSelect))
        if (!arr.length) {
          this.$message.warning('请至少选中一项')
          return
        }
        if (arr.length == 1) {
          params.parentAsin = arr[0].parentAsin
        }
      }
      this.$api['TaskPriceSeoMasterSkuConfigDetail'](params)
        .then(data => {
          if (data.data) {
            if (data.data) {
              this.primarySkuProportion = data.data.primarySkuProportion * 100
            }
          }
          // console.log(data, 11111111111111111111111111);
        })
        .catch(err => {})
      this.type = 'all'
      this.primarySkuProportion = null
      this.dialogVisible2 = true
    },
    // todo
    addPOP() {
      let n = JSON.parse(JSON.stringify(this.primarySkuProportion))
      if (n < 0 || n > 100) {
        this.$message.warning('百分比0-100之间')
        return
      } else if (isNaN(n)) {
        this.$message.warning('请输入数字')
        return
      }
      let primarySkuProportion =
        JSON.parse(JSON.stringify(this.primarySkuProportion)) / 100
      let params = {
        siteId: this.siteId,
        sellerId: this.sellerId,
        primarySkuProportion: primarySkuProportion
      }
      params.asins = []
      // console.log(this.userSelect);
      if (!this.isAll) {
        this.userSelect.forEach(el => {
          params.asins.push(el.parentAsin)
        })
      } else {
      }
      this.submitLoading2 = true
      this.$api['TaskPriceSeoMasterSkuConfig'](params)
        .then(data => {
          this.dialogVisible2 = false
          this.submitLoading2 = false
          if (!this.isAll) {
            this.getList()
          }
        })
        .catch(err => {
          this.submitLoading2 = false
          console.log(err)
        })
    },
    getSkus(arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      params = this.$.dealObjectValue(params)
      return this.$api['ProductListParentProduct'](params)
        .then(data => {
          this.skuOptions = []
          this.refParentAsinOptions = []
          // console.log(data);
          let data1 = data.data
          data1.forEach(el => {
            this.skuOptions.push({
              label: el.asin,
              value: el.asin
            })
            this.refParentAsinOptions.push({
              label: el.asin,
              value: el.asin
            })
          })
          return true
        })
        .catch(err => {
          console.log(err)
          return true
        })
    },
    getChildSku() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentAsin: this.form.parentAsin
      }
      this.$api['ProductListAsin'](params)
        .then(data => {
          // console.log(data);
          let data1 = data.data
          let arr = []
          data1.forEach(el => {
            arr.push({
              label: el,
              value: el
            })
          })
          this.childSkuOptions = arr
          if (this.status == 1) {
            this.$set(this.form, 'lowestSalesAsin', null)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 关闭弹窗时调用子组件方法清空日期 六
    closeDialog() {
      this.$refs.child.clearDate()
    },
    // 添加任务增加一项
    addItem(index) {
      // let item = new newItem()
      // this.form.stageList.push(item)
      let item = new newItem();
      if(this.form.stageList[index].date && this.form.stageList[index].date[1]){
        let day = dayjs(new Date(this.form.stageList[index].date[1]).getTime()+3600*24*1000).format('YYYY-MM-DD')
        item.date=[this.form.stageList[index].date[1],day]
      }
      //console.log(item);
      this.form.stageList.push(item);
    },
    spliceItem(index) {
      this.form.stageList.splice(index, 1)
    },
    showDialog() {
      // status 为1 是添加状态
      this.status = 1
      this.dialogVisible.title = '添加计划'
      this.dialogVisible.visible = true
      this.$nextTick(() => {
        this.form = {
          stageList: [new newItem()]
        }
        this.showTips2 = false
        this.showTips1 = false
        this.showTips = false
        this.$refs.ruleForm.resetFields()
      })
      // this.URL = "OrderTargetSave";
      this.getSkus()
    },
    showDialog2() {
      // 将status 设置为2 表示编辑状态
      this.status = 2
      this.dialogVisible.title = '优化编辑'
      let arr = this.userSelect
      if (!arr.length) {
        this.$message.warning('未选中任何项')
        return
      } else if (arr.length > 1) {
        this.$message.warning('编辑只能选中一个sku')
        return
      }
      this.dialogVisible.visible = true
      this.$nextTick(() => {
        this.form = {
          stageList: [new newItem()]
        }
        this.$refs.ruleForm.resetFields()
      })
      // this.URL = "TaskPriceSeoSave";
      // console.log(this.userSelect, "this.userSelect");
      this.getDetails({ taskId: arr[0].taskId })
      this.getSkus()
    },
    // 获取编辑信息 todo
    getDetails(arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        ...arg
      }
      this.$api['TaskPriceSeoInfo'](params)
        .then(data => {
          // console.log(data.data.stageList, "data.data.stageList");
          let stageList = []
          data.data.stageList.forEach((el, index) => {
            stageList.push({
              date: [el.startTime, el.endTime],
              targetType: el.targetType, //目标类型
              stageOrderCnt: el.stageOrderCnt, //目标
              bsrCategory: el.bsrCategory, //亚马逊类目
              rank: el.rank
            })
          })
          // console.log(stageList, "stageList");
          this.form = {
            parentAsin: data.data.parentAsin,
            seoMaxPrice: data.data.seoMaxPrice,
            seoMinPrice: data.data.seoMinPrice,
            originalPrice: data.data.originalPrice,
            priceRange: data.data.priceRange,
            priceFrequency: data.data.priceFrequency,
            intervalMinPrice: data.data.intervalMinPrice,
            lowestSalesAsin: data.data.lowestSalesAsin,
            sameParentAsins: data.data.sameParentAsins.toString(),
            newProductFlag: data.data.newProductFlag === 1 ? true : false,
            refParentAsin: data.data.refParentAsin,
            stageList: stageList
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    submit() {
      // console.log(this.form);
      this.errorSameParentAsin = false
      let errorSameParentAsin = ''
      // console.log(this.errorSameParentAsin, "errorSameParentAsin");
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.asinArr) {
            this.asinArr.forEach(el => {
              if (el.length !== 10) {
                errorSameParentAsin += el + ','
              }
            })
            this.errorSameParentAsin = errorSameParentAsin.slice(0, -1)
            if (this.errorSameParentAsin) {
              this.showTips2 = true
            } else {
              this.showTips2 = false
            }
          }
          this.form.stageList.forEach((el, index) => {
            el.stageNo = index + 1
          })
          this.submitLoading = true
          let params = {
            siteId: this.siteId,
            sellerId: this.sellerId,
            platformId: this.platformId,
            ...this.form
          }
          params.stageList.forEach(el => {
            el.startTime = el.date[0]
            el.endTime = el.date[1]
          })
          // console.log(this.asinArr, "asinArr");
          // debugger;
          if (!this.asinArr) {
            this.showTips1 = true
            this.submitLoading = false
            return
          } else if (this.asinArr.length > 500) {
            this.showTips = true
            this.submitLoading = false
            return
          } else {
            this.showTips1 = false
            this.showTips = false
            // debugger;
          }
          // debugger;
          if (this.status == 2) {
            params.taskId = this.userSelect[0].taskId
          }
          params.sameParentAsins = this.asinArr
          params.newProductFlag = params.newProductFlag === true ? 1 : 0
          //   console.log(params, "params");
          this.$api['TaskPriceSeoSave'](params)
            .then(data => {
              this.submitLoading = false
              this.dialogVisible.visible = false
              this.getCustomCategory()
              this.cusCateId = null
              this.getList()
            })
            .catch(err => {
              this.submitLoading = false
              console.log(err)
            })
        }
      })
    },
    handleNodeClick(data) {
      // console.log(data);
      this.cusCateId = data.cusCateId
      this.getList()
    },
    // 列表
    getList(arg) {
      // console.log(this.table.rows);
      let params = {
        cusCateId: this.cusCateId,
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        siteId: this.siteId, //上线要改
        sellerId: this.sellerId, //上线要改
        ...arg
      }
      params = this.$.dealObjectValue(params)
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0]
        params.endTime = params.date[1]
      }
      this.table.loading = true
      return this.$api['TaskPriceSeoList'](params)
        .then(data => {
          console.log(data, '列表data')
          this.table.loading = false
          this.table.rows = data.rows
          this.table.pageNumber = data.pageNo
          this.table.pageSize = data.pageSize
          this.table.total = data.total
          return true
        })
        .catch(err => {
          console.log(err)
          this.table.loading = false
          return true
        })
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.getCustomCategory()
      }
    },
    getCustomCategory() {
      this.treeLoading = true
      this.getcustomCategoryList('init')
      this.cusCateId = null
      this.getList()
      setTimeout(() => {
        this.treeLoading = false
      }, 500)
    },
    getcustomCategoryList(type) {
      this.$api['CustomCategoryList_POP']({
        sellerId: this.sellerId,
        // platformId: 1,
        siteId: this.siteId
      })
        .then(res => {
          let data = res.data
          // console.log(data, "data");
          if (!data.length) {
            return
          }
          let notInGroups = {
            createTime: '',
            cusCateId: null,
            cusCateId: -1,
            cusCateName: '未分类',
            haveChildren: 0,
            parentCusCateId: null
          }
          data.push(notInGroups)
          let newData = [
            {
              childList: data,
              createTime: '',
              cusCateId: null,
              cusCateName: '全部',
              haveChildren: 1,
              parentCusCateId: null
            }
          ]
          this.customCategoryData = newData
        })
        .catch(err => {
          this.customCategoryData = []
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.cusCateName.indexOf(value) !== -1
    },
    showRelateDialog() {
      this.getCustomCategory()
      this.outerVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-icon-box {
  display: flex;
  justify-content: flex-end;
  font-size: 16px !important;
}
.box {
  .box-left-menu {
    .el-icon-box {
      margin-top: 5px;
      margin-bottom: 5px;
      /deep/[class^='el-icon-'] {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .box-body {
    .el-tabs {
      -webkit-box-shadow: 0 0 0 0;
      box-shadow: 0 0 0 0;
      /deep/.el-tabs__content {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
.inner-add-visible-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 270px;
      margin-right: 10px;
    }
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
  }
}
.inner-visible-dialog {
  .body-box {
    padding: 10px;
    border: 1px solid @borderColor;
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
  }
}

.add-yt-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 260px;
      margin-right: 10px;
    }
  }
}
.tree-dialog {
  .el-tree {
    // border:1px solid @borderColor;
    // padding: 5px;
    height: 300px;
    overflow-y: auto;
  }
}
.dialog-footer {
  text-align: center;
}
.esc_desc {
  padding: 0px 7px;
}
.header {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  background: #faf7f5;
  padding: 0 10px;
}
.p-container {
  position: relative;
  padding: 10px 0px;
  width: 200px;
  display: inline-block;
  .picture {
    width: 240px;
    height: 240px;
    overflow: hidden;
    background-color: #fff;

    img {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    img[lazy='loaded'] {
      background: #fff;
    }
  }
}
.pd-container {
  width: 700px;
  display: inline-block;
  vertical-align: top;
  padding: 10px 0px;
  margin-top: 5px;
  margin-left: 50px;
  font-size: 14px;
  .s {
    margin-right: 40px;
  }
}
.big__ {
  width: 300px;
  height: 150px;
  object-fit: contain;
  overflow: hidden;
}
.__box_wrapper__local_page {
  display: flex;
  // margin: 12px 10px 0px;
  // .el-form-item {
  //   display: inline-block !important;
  //   position: relative;
  // }
}
</style>

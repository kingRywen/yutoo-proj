<template>
  <v-spin v-if="ruleForm.main" :spinning="spinning" tip="加载中...">
    <div class="margin-bottom-20" v-if="showField.length > 0">
      <v-form :model="ruleForm" direction="horizontal" :rules="renderedField.vali" ref="ruleForm">
        <v-row>
          <!-- 产品状态 -->
          <v-row v-for="(item, key, index) in ((showField.indexOf('productStatus') === -1) ? {main: ruleForm.main} : ruleForm)" :key="'productStatus'+key" v-if="showInputs['productStatus'] || key ==='main'" class="openTab">
            <v-col span="12">
              <v-form-item class="tips_box" :label-col="{span:8}" :wrapper-col="{span:16}" :label="key === 'main' ? '产品状态' : item.skuCustom" :prop="`${key}.productStatus`" :required="showRequire.indexOf('productStatus') >= 0" :rules="renderedField.vali['productStatus']">
                <v-radio-group :disabled="$attrs.show" v-model="ruleForm[key+''].productStatus" @change="setSubVal('productStatus', $event, index, key)" @blur="handlerBlur('productStatus', $event, index, key)" :data="[{value: 1, text: '正常'},{value: 2, text: '仅批量'},{value: 3, text: '暂时缺货'},{value: 4, text: '停产'},{value: 5, text: '锁定'},{value: 6, text: '清库'}]">
                </v-radio-group>
                <div class="tips" v-if="hasHistory('productStatus')">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">旧值:<span style="color:red">{{hasHistory('productStatus').value}}</span></div>
                    <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                  </el-tooltip>
                </div>
              </v-form-item>

            </v-col>
            <v-col span="12">
              <v-form-item class="tips_box" v-if="ruleForm[key+''].productStatus === 3" :label-col="{span:6}" :wrapper-col="{span:14}" label="到货日期" :prop="`${key}.arrivalDate`" required :rules="{required: true, message: '不能为空'}">
                <el-date-picker :picker-options="pickerOptions" style="width:100%" v-model="ruleForm[key+''].arrivalDate" size="small" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" @change="$refs.ruleForm.validateField(`${key}.arrivalDate`)">
                </el-date-picker>
                <div class="tips" v-if="hasHistory('arrivalDate')">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">旧值:<span style="color:red">{{hasHistory('arrivalDate').value}}</span></div>
                    <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                  </el-tooltip>
                </div>
                <div class="iconBox" @click="toggleTabs('productStatus')" v-if="showField.indexOf('productStatus') !== -1">
                  <v-icon type="down" v-if="!showInputs['productStatus'] && key ==='main'"></v-icon>
                  <v-icon type="up" v-if="showInputs['productStatus'] && key ==='main'"></v-icon>
                </div>
              </v-form-item>
              <v-form-item class="tips_box" v-else-if="ruleForm[key+''].productStatus === 4" :label-col="{span:6}" :wrapper-col="{span:14}" label="停产日期" :prop="`${key}.discontinueDate`" required :rules="{required: true, message: '不能为空'}">
                <el-date-picker :picker-options="pickerOptions" style="width:100%" v-model="ruleForm[key+''].discontinueDate" size="small" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" @change="$refs.ruleForm.validateField(`${key}.discontinueDate`)">
                </el-date-picker>
                <div class="tips" v-if="hasHistory('discontinueDate')">
                  <el-tooltip class="item" effect="light" placement="top">
                    <div slot="content">旧值:<span style="color:red">{{hasHistory('discontinueDate').value}}</span></div>
                    <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                  </el-tooltip>
                </div>
                <div class="iconBox" @click="toggleTabs('productStatus')" v-if="showField.indexOf('productStatus') !== -1">
                  <v-icon type="down" v-if="!showInputs['productStatus'] && key ==='main'"></v-icon>
                  <v-icon type="up" v-if="showInputs['productStatus'] && key ==='main'"></v-icon>
                </div>
              </v-form-item>
              <v-form-item class="hidden__label" :label-col="{span:6}" :wrapper-col="{span:14}" label=" " v-else-if="showField.indexOf('productStatus') === -1">
                <div class="iconBox" @click="toggleTabs('productStatus')" v-if="showField.indexOf('productStatus') !== -1">
                  <v-icon type="down" v-if="!showInputs['productStatus'] && key ==='main'"></v-icon>
                  <v-icon type="up" v-if="showInputs['productStatus'] && key ==='main'"></v-icon>
                </div>
              </v-form-item>
            </v-col>
          </v-row>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('statusRemark') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'statusRemark' + key" v-if="showInputs['statusRemark'] || key ==='main'" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品状态备注' : item.skuCustom" :prop="`${key}.statusRemark`" :required="showRequire.indexOf('statusRemark') >= 0" :rules="renderedField.vali['statusRemark']">
              <v-input :disabled="$attrs.show" v-model="ruleForm[key+''].statusRemark" @input="setSubVal('statusRemark', $event, index, key)" @blur="handlerBlur('statusRemark', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('statusRemark')" v-if="showField.indexOf('statusRemark') === -1">
                <v-icon type="down" v-if="!showInputs['statusRemark'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['statusRemark'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="hasHistory('statusRemark')">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{hasHistory('statusRemark').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24">

            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="默认产品供货价" prop="main.supplierPrice" :required="showRequire.indexOf('supplierPrice') >= 0" :rules="[{required:true, message: '请设置和选择默认供应商'}]">
              <template v-for="(list, index) in productSupplierPriceEntityList">
                <v-row :gutter="12" style="margin-bottom:12px">
                  <v-col span="3" style="width: 120px">
                    <span :style="{visibility: index === 0 ? 'initial': 'hidden'}">
                      <div class="see_more" v-if="!list._moreTag" @click="lookMore(list)">
                        <v-icon type="caret-right" style="margin-right:10px"></v-icon>
                      </div>
                      <div class="see_more" v-else @click="lookLess(list)">
                        <v-icon type="caret-down" style="margin-right:10px"></v-icon>
                      </div>
                    </span>

                    供应商报价:</v-col>
                  <v-col span="6">
                    <v-input :disabled="true" :value="~~list.numStart ? list.numStart + '~' + list.numEnd: ''"></v-input>
                  </v-col>
                  <v-col span="5">
                    <v-input :price="true" :disabled="true" :value="list.supplierPrice">
                      <v-select placeholder="" :disabled="$attrs.show" style="width: 56px;" slot="after" :data="priceUnit" v-model="list.supplierPriceUnit" :allowClear="false"></v-select>
                    </v-input>
                  </v-col>
                  <v-col span="1" style="white-space:nowrap">/个</v-col>
                  <v-col span="6" style="display:flex">
                    <span style="width:80px;white-space: nowrap;">采购运费：</span>
                    <v-input :price="true" :disabled="true" v-model="list.purchaseFreight" style="width:100%" @input="setFreight(index)">
                      <v-select placeholder="" :disabled="$attrs.show" slot="after" :data="priceUnit" v-model="list.purchaseFreightUnit" :allowClear="false" style="width:56px"></v-select>
                    </v-input>
                  </v-col>
                </v-row>
              </template>

              <v-row :gutter="16">

                <v-col span="24" style="margin-top:8px">
                  <v-button :disabled="$attrs.show" @click="showSupply(0)" type="primary">添加供货价</v-button>
                  <v-button :disabled="$attrs.show" @click="showInfo">查看详情</v-button>
                </v-col>
              </v-row>
            </v-form-item>
          </v-col>

          <v-col offset="2" span="20" class="margin-bottom-20">
            <div v-if="showInfoFlag">
              <v-data-table :data='loadData' :columns='columns' stripe bordered ref="form">
                <template slot="td" slot-scope="props">
                  <div v-if="props.column.field=='defaultFlag'">
                    <v-radio v-model="radio" :label="props.item.productSupplierRelId" @click.stop.native="handlerChange">&nbsp;</v-radio>
                    <v-button :disabled="$attrs.show" @click="showSupply(1, props.item.productSupplierRelId)" type="primary">修改</v-button>
                  </div>
                  <div v-else-if="props.column.field=='purchaseLink1'">
                    <span v-if="props.item.productSupplierPriceEntity">
                      {{props.item.productSupplierPriceEntity.numStart}}~{{props.item.productSupplierPriceEntity.numEnd}} {{props.item.productSupplierPriceEntity.supplierPrice}}{{props.item.productSupplierPriceEntity.supplierPriceUnit}}/个
                    </span>

                  </div>
                  <div v-else-if="props.column.field=='processingPrice1' && props.item.productSupplierPriceEntity">
                    {{props.item.productSupplierPriceEntity.processPrice}}{{props.item.productSupplierPriceEntity.processPriceUnit}}
                  </div>
                  <div v-else-if="props.column.field=='otherPrice' && props.item.productSupplierPriceEntity">
                    {{props.item.productSupplierPriceEntity.otherPrice}}{{props.item.productSupplierPriceEntity.otherPriceUnit}}
                  </div>
                  <div v-else-if="props.column.field=='purchaseFreight' && props.item.productSupplierPriceEntity">
                    {{props.item.productSupplierPriceEntity.purchaseFreight}}{{props.item.productSupplierPriceEntity.purchaseFreightUnit}}
                  </div>
                  <div v-else-if="props.column.field=='supplierPriceTime' && props.item.productSupplierRelEntity">
                    {{props.item.productSupplierRelEntity.createTime}}
                  </div>
                  <div v-else-if="props.column.field=='creator' && props.item.productSupplierRelEntity">
                    {{props.item.productSupplierRelEntity.creator}}
                  </div>
                  <span v-else v-html="props.content"></span>
                </template>
              </v-data-table>
            </div>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('taxInvoice') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'taxInvoice' + key" v-if="showInputs['taxInvoice'] || key ==='main'" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '开票税点' : item.skuCustom" :prop="`${key}.taxInvoice`" :required="showRequire.indexOf('taxInvoice') >= 0" :rules="renderedField.vali['taxInvoice']">
              <v-input :disabled="$attrs.show" v-model.number="ruleForm[key+''].taxInvoice" @input="setSubVal('taxInvoice', $event, index, key)" @blur="handlerBlur('taxInvoice', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('taxInvoice')" v-if="showField.indexOf('taxInvoice') === -1">
                <v-icon type="down" v-if="!showInputs['taxInvoice'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['taxInvoice'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="hasHistory('taxInvoice')">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{hasHistory('taxInvoice').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('taxPrice') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'taxPrice' + key" v-if="showInputs['taxPrice'] || key ==='main'" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '含税价' : item.skuCustom" :prop="`${key}.taxPrice`" :required="showRequire.indexOf('taxPrice') >= 0" :rules="renderedField.vali['taxPrice']">
              <v-input :price="true" :disabled="$attrs.show" v-model.number="ruleForm[key+''].taxPrice" @input="setSubVal('taxPrice', $event, index, key)" @blur="handlerBlur('taxPrice', $event, index, key)">
                <v-select placeholder="" style="width: 70px;" :disabled="$attrs.show" slot="after" :value="unit1" @input="val => item.taxPriceUnit = val" :data="priceUnit" :allowClear="false"></v-select>
              </v-input>
              <div class="iconBox" @click="toggleTabs('taxPrice')" v-if="showField.indexOf('taxPrice') === -1">
                <v-icon type="down" v-if="!showInputs['taxPrice'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['taxPrice'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="hasHistory('taxPrice')">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{hasHistory('taxPrice').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>

            </v-form-item>
          </v-col>

          <!-- <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('salePriceOriginal') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'salePriceOriginal' + key" v-if="showInputs['salePriceOriginal'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品最低销售价（原价）' : item.skuCustom" :prop="`${key}.salePriceOriginal`" :required="showRequire.indexOf('salePriceOriginal') >= 0" :rules="renderedField.vali['salePriceOriginal']">
              <v-input :disabled="$attrs.show" v-model.number="ruleForm[key+''].salePriceOriginal" @input="setSubVal('salePriceOriginal', $event, index, key)" @blur="handlerBlur('salePriceOriginal', $event, index, key)">
                <v-select placeholder="" style="width: 70px;" slot="after" :disabled="$attrs.show" :value="unit1" @input="val => item.priceOriginalUnit = val" :data="priceUnit" :allowClear="false"></v-select>
              </v-input>
              <div class="iconBox" @click="toggleTabs('salePriceOriginal')" v-if="showField.indexOf('salePriceOriginal') === -1">
                <v-icon type="down" v-if="!showInputs['salePriceOriginal'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['salePriceOriginal'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col> -->

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('salePriceNow') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'salePriceNow' + key" v-if="showInputs['salePriceNow'] || key ==='main'" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品最低销售价' : item.skuCustom" :prop="`${key}.salePriceNow`" :required="showRequire.indexOf('salePriceNow') >= 0" :rules="renderedField.vali['salePriceNow']">
              <v-input :price="true" :disabled="$attrs.show" v-model.number="item.salePriceNow" @input="setSubVal('salePriceNow', $event, index, key)" @blur="handlerBlur('salePriceNow', $event, index, key)">
                <v-select placeholder="" style="width: 70px;" slot="after" :value="unit1" @input="val => item.priceNowUnit = val" :data="priceUnit" :allowClear="false"></v-select>
              </v-input>
              <div class="iconBox" @click="toggleTabs('salePriceNow')" v-if="showField.indexOf('salePriceNow') === -1">
                <v-icon type="down" v-if="!showInputs['salePriceNow'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['salePriceNow'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="hasHistory('salePriceNow')">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{hasHistory('salePriceNow').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('pinkageFlag') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'pinkageFlag' + key" v-if="showInputs['pinkageFlag'] || key ==='main'" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '是否包邮' : item.skuCustom" :prop="`${key}.pinkageFlag`" :required="showRequire.indexOf('pinkageFlag') >= 0" :rules="renderedField.vali['pinkageFlag']">
              <v-switch :disabled="$attrs.show" :true-value="1" :false-value="0" v-model="item.pinkageFlag" @change="setSubVal('pinkageFlag', $event, index, key)" @blur="handlerBlur('pinkageFlag', $event, index, key)"></v-switch>
              <div class="iconBox" @click="toggleTabs('pinkageFlag')" v-if="showField.indexOf('pinkageFlag') === -1">
                <v-icon type="down" v-if="!showInputs['pinkageFlag'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['pinkageFlag'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="hasHistory('pinkageFlag')">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{hasHistory('pinkageFlag').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('freightPrice') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'freightPrice' + key" v-if="showInputs['freightPrice'] || key ==='main'" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '运费' + productSupplierPriceEntityList[0].supplierPriceUnit : item.skuCustom" :prop="`${key}.freightPrice`" :required="showRequire.indexOf('freightPrice') >= 0" :rules="renderedField.vali['freightPrice']">
              {{item.freightPrice}}
              <div class="iconBox" @click="toggleTabs('freightPrice')" v-if="showField.indexOf('freightPrice') === -1">
                <v-icon type="down" v-if="!showInputs['freightPrice'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['freightPrice'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="hasHistory('freightPrice')">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{hasHistory('freightPrice').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in ((showField.indexOf('priceRel') !== -1) ? {main: ruleForm.main} : ruleForm)" :key="'priceRel' + key" v-if="showInputs['priceRel'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品销售价（共享）' : item.skuCustom">
              <div class="__inlineInput" v-for="(productPrice, subIndex) in item.productPriceRelEntityList" :key="'productPriceRelEntityList'+index +subIndex">
                <!-- {{productPrice}} -->
                <v-form-item :label-col="{span:8}" :wrapper-col="{span:16}" label="数量" :prop="`${key}.productPriceRelEntityList[${subIndex}].numStart`" :rules="numStartVali(item.productPriceRelEntityList, subIndex)">
                  <v-input-number :precision="2" size="large" :min="1" :disabled="subIndex === 0 || $attrs.show" v-model.number="productPrice.numStart" @input="setSubValPrice('numStart', $event, key, item, subIndex, index)" @blur="handlerBlurPrice('numStart', $event, key, item, subIndex, index)">
                  </v-input-number>
                </v-form-item>
                <span style="margin:0 4px">~</span>
                <v-form-item :prop="`${key}.productPriceRelEntityList[${subIndex}].numEnd`" :rules="numEndVali(item.productPriceRelEntityList, subIndex)">
                  <v-input-number size="large" :min="1" :disabled="$attrs.show" v-model.number="productPrice.numEnd" @input="setSubValPrice('numEnd', $event, key, item, subIndex, index)" @blur="handlerBlurPrice('numEnd', $event, key, item, subIndex, index)">
                  </v-input-number>
                </v-form-item>
                <v-form-item :label-col="{span:10}" :wrapper-col="{span:14}" label="价格" :prop="`${key}.productPriceRelEntityList[${subIndex}].sharePrice`" :rules="numPrice">
                  <v-input :disabled="$attrs.show" :price="true" v-model.number="productPrice.sharePrice" @input="setSubValPrice('sharePrice', $event, key, item, subIndex, index)" @blur="handlerBlurPrice('sharePrice', $event, key, item, subIndex, index)">
                    <v-select placeholder="" style="width: 70px;" :disabled="$attrs.show" slot="after" v-model="unit1" @input="val => productPrice.sharePriceUnit = val" :data="priceUnit" :allowClear="false"></v-select>
                  </v-input>
                </v-form-item>
                <v-form-item style="margin-left: 10px;" v-if="!$attrs.show">
                  <div style="display:flex;height: 32px;vertical-align: middle;align-items: center;">
                    <div class="__btn" @click="addList(item.productPriceRelEntityList, subIndex, item)">
                      <v-icon type="plus"></v-icon>
                    </div>
                    <div class="__btn" @click="delList(item.productPriceRelEntityList, subIndex, item, key)" v-if="subIndex !== 0">
                      <v-icon type="minus"></v-icon>
                    </div>
                  </div>

                </v-form-item>

              </div>
              <div class="iconBox" @click="toggleTabs('priceRel')" v-if="showField.indexOf('priceRel') === -1">
                <v-icon type="down" v-if="!showInputs['priceRel'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['priceRel'] && key ==='main'"></v-icon>
              </div>

            </v-form-item>
          </v-col>
        </v-row>
      </v-form>
    </div>

  </v-spin>
</template>

<script>
import Vue from "vue";
import {
  showDialog,
  fixFrameHeight,
  fetchData,
  handlerCode,
  showToast,
  _storage
} from "common/common";
import { formatCurrency, formatTime, getQueryString } from "common/util";
import { DatePicker, Tooltip } from "element-ui";
import apis from "apis";
import _isEqual from "lodash/isEqual";

Vue.use(DatePicker);
Vue.use(Tooltip);

export default {
  inheritAttrs: false,
  props: [
    "ruleform",
    "priceUnit",
    "unit",
    "productSupplierPriceEntityList",
    "auditDataList"
  ],
  created() {
    this.productId = +getQueryString("productId");
  },
  data() {
    let vm = this;

    const checkPrice = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (!Number.isFinite(value)) {
          callback(new Error("必须是数字"));
        }
        if (value <= 0) {
          callback(new Error("必须是正整数"));
        }
      }

      callback();
    };

    const validateNumStart = function(list, subIndex) {
      return (rule, value, callback) => {
        if (value === "") {
          callback();
        } else {
          if (
            list[subIndex - 1] &&
            ~~list[subIndex - 1].numEnd &&
            value < list[subIndex - 1].numEnd
          ) {
            callback(new Error("不能小于上一级"));
          }
          if (
            list[subIndex] &&
            ~~list[subIndex].numEnd &&
            value > list[subIndex].numEnd
          ) {
            callback(new Error("不能大于结束值"));
          }
          if (value <= 0 && subIndex !== 0) {
            callback(new Error("必须是正整数"));
          }
        }

        callback();
      };
    };

    const validateNumEnd = function(list, subIndex) {
      return (rule, value, callback) => {
        if (value === "") {
          callback();
        } else {
          if (
            list[subIndex] &&
            ~~list[subIndex].numStart &&
            value < list[subIndex].numStart
          ) {
            callback(new Error("不能小于初始值"));
          }
          if (
            list[subIndex + 1] &&
            ~~list[subIndex + 1].numEnd &&
            value > list[subIndex + 1].numEnd
          ) {
            callback(new Error("不能大于下一级"));
          }
          if (value <= 0) {
            callback(new Error("必须是正整数"));
          }
        }

        callback();
      };
    };
    return {
      hasHistory(key) {
        return (
          this.auditDataList && this.auditDataList.find(el => el.key === key)
        );
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 24 * 3600 * 1000 < Date.now();
        }
      },
      deletePriceRelIds: [],
      radio: null,
      spinning: false,
      showInputs: {},
      requireSharePrice: false,
      ruleForm: vm.$attrs.variantForm,
      options: [
        { value: "1", label: "RMB" },
        { value: "2", label: "EUR" },
        { value: "3", label: "GBP" },
        { value: "4", label: "USD" }
      ],

      supplierPriceUnit: null,
      moreTag: true,

      numPrice: [
        {
          validator: checkPrice
        }
      ],

      numEndVali(productPrice, subIndex) {
        return [
          // { type: "integer", message: "必须为正整数" },
          { validator: validateNumEnd(productPrice, subIndex) }
        ];
      },

      numStartVali(productPrice, subIndex) {
        return [
          // { type: "integer", message: "必须为正整数" },
          { validator: validateNumStart(productPrice, subIndex) }
        ];
      },

      columns: [
        {
          title: "是否默认",
          field: "defaultFlag"
        },
        {
          title: "供应商名称",
          field: "supplierName"
        },
        {
          title: "供应商SKU",
          field: "supplierSku"
        },
        {
          title: "供应商报价",
          field: "purchaseLink1"
        },
        {
          title: "加工费用",
          field: "processingPrice1"
        },
        {
          title: "其他",
          field: "otherPrice"
        },
        {
          title: "采购运费",
          field: "purchaseFreight"
        },
        {
          title: "采购天数",
          field: "purchaseTime"
        },
        {
          title: "报价时间",
          field: "supplierPriceTime"
        },
        {
          title: "开发人员",
          field: "creator"
        }
      ],
      loadData: data => {
        let vm = this;
        return fetchData({
          ...apis.PRODUCT_SUPPLIER_LIST,
          data: {
            productId: vm.productId,
            parentFlag: 1
          }
        }).then(res => {
          let data = res.data.rows.map(el => ({
            ...el,
            ...el.productSupplierRelEntity
          }));

          data.forEach(el => {
            // debugger;
            if (el.defaultFlag) {
              vm.radio = el.productSupplierRelId;
              // vm.$set(vm, "radio", el.productSupplierRelId);
            }
          });
          console.log(data);
          return {
            result: data
          };
        });
      },
      showInfoFlag: false,
      // ruleForm: ruleform,
      rules: {},
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      }
    };
  },
  methods: {
    handlerChange(e) {
      setTimeout(() => {
        this.setDefaultSupply(this.radio);
        this.ruleForm.main.supplierPrice = 123123;
      });
    },
    setDefaultSupply(e) {
      this.spinning = true;
      fetchData({
        ...apis.PRODUCT_SUPPLIER_REL_DEFAULT_UPDATE,
        data: {
          productId: this.productId,
          parentFlag: 1,
          productSupplierRelId: e
        }
      }).then(res => {
        this.spinning = false;
        if (res.data.code === 0) {
          this.refreshData(e);
          showToast("success", res.data.msg);
        }
      });
    },
    addList(list, index, item) {
      let el = {
        ...list[index],
        numStart: list[index].numEnd + 1,
        numEnd: "",
        sharePrice: "",
        sharePriceUnit: this.unit,
        edit_numStart: false,
        edit_numEnd: false,
        edit_sharePrice: false,
        productPriceRelId: null,
        sort: null
      };

      let vals = list.map(el => ({
        numStart: el.numStart,
        numEnd: el.numEnd,
        sharePrice: el.sharePrice,
        sharePriceUnit: el.sharePriceUnit
      }));

      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          const elementList = element.productPriceRelEntityList.map(_el => ({
            numStart: _el.numStart,
            numEnd: _el.numEnd,
            sharePrice: _el.sharePrice,
            sharePriceUnit: _el.sharePriceUnit
          }));
          if (key === "main") {
            continue;
          }
          if (_isEqual(vals, elementList)) {
            element.productPriceRelEntityList.splice(index + 1, 0, {
              ...el,
              productPriceId:
                element.productPriceRelEntityList[0].productPriceId
            });
          }
        }
      }

      list.splice(index + 1, 0, el);
    },
    delList(list, index, item, key) {
      let vals = list.map(el => ({
        numStart: el.numStart,
        numEnd: el.numEnd,
        sharePrice: el.sharePrice,
        sharePriceUnit: el.sharePriceUnit
      }));

      // debugger

      if (key === "main") {
        for (const key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            const element = this.ruleForm[key];
            const elementList = element.productPriceRelEntityList.map(_el => ({
              numStart: _el.numStart,
              numEnd: _el.numEnd,
              sharePrice: _el.sharePrice,
              sharePriceUnit: _el.sharePriceUnit
            }));
            if (key === "main") {
              continue;
            }
            if (_isEqual(vals, elementList)) {
              element.productPriceRelEntityList.splice(index, 1);
            }
          }
        }
      }

      if (list[index] && list[index].productPriceRelId) {
        this.deletePriceRelIds.push(list[index].productPriceRelId);
      }

      list.splice(index, 1);
    },
    toggleTabs(key) {
      if (this.showInputs[key]) {
        this.$set(this.showInputs, key, false);
        return;
      }

      this.$set(this.showInputs, key, true);
    },
    setSubVal(k, val, index, keyIndex) {
      if (index === 0) {
        for (const key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            const element = this.ruleForm[key];
            if (key === "main" && k !== "pinkageFlag") {
              continue;
            }

            if (k === "pinkageFlag") {
              if (val) {
                this.ruleForm.main.freightPrice = 0;
              } else {
                const _val = this.productSupplierPriceEntityList[0]
                  .purchaseFreight;
                this.ruleForm.main.freightPrice = _val;

                if (this.ruleForm[key]["edit"]) {
                  continue;
                }
                this.ruleForm[key][k] = val;
              }
            }

            if (this.ruleForm[key]["edit"]) {
              continue;
            }
            this.ruleForm[key][k] = val;
          }
        }
      }
    },
    handlerBlur(k, val, index, keyIndex) {
      if (val === this.ruleForm.main[k]) {
        this.ruleForm[keyIndex + ""]["edit"] = false;
      } else {
        this.ruleForm[keyIndex + ""]["edit"] = true;
      }
    },

    setFreight(index) {
      if (index === 0) {
        for (const key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            const element = this.ruleForm[key];
            if (element.pinkageFlag) {
              element.freightPrice = 0;
            } else {
              if (typeof element === "object") {
                element.freightPrice = this.productSupplierPriceEntityList[0].purchaseFreight;
              }
            }
          }
        }
      }
    },

    setSubValPrice(k, val, key, item, subIndex, i) {
      try {
        if (i === 0) {
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const element = this.ruleForm[key];
              if (key === "main") {
                continue;
              }
              if (
                this.ruleForm[key].productPriceRelEntityList[subIndex][
                  "edit_" + k
                ]
              ) {
                continue;
              }
              this.ruleForm[key].productPriceRelEntityList[subIndex][k] = val;
            }
          }
        }
        // debugger;
        if (k === "numStart") {
          this.ruleForm[key].productPriceRelEntityList[subIndex - 1]["numEnd"] =
            val - 1;
        }
        if (k === "numEnd") {
          this.ruleForm[key].productPriceRelEntityList[subIndex + 1][
            "numStart"
          ] = val + 1;
        }
      } catch (error) {}
    },
    handlerBlurPrice(k, val, key, item, subIndex, i) {
      try {
        if (val === this.ruleForm.main.productPriceRelEntityList[subIndex][k]) {
          this.ruleForm[key].productPriceRelEntityList[subIndex][
            "edit_" + k
          ] = false;
        } else {
          this.ruleForm[key].productPriceRelEntityList[subIndex][
            "edit_" + k
          ] = true;
        }

        // 判断是否同步母体
        // const parent = this.ruleForm.main.productPriceRelEntityList
        // const sub = this.ruleForm[key].productPriceRelEntityList
        // if (_isEqual(parent, sub)) {
        //   this.ruleForm[key].productPriceRelEntityList[subIndex]
        // }
      } catch (error) {}
    },

    lookMore(list) {
      this.$set(list, "_moreTag", true);
    },
    lookLess(list) {
      this.$set(list, "_moreTag", false);
    },
    onChange(type, val) {
      if (!val) {
        return;
      }
      val = formatTime(new Date(val), "{y}-{m}-{d} {h}:{i}:{s}");
      this.$set(this.ruleForm, type, val);
    },
    // 修正小数点
    fixN(key, val) {
      console.log(key, val);
      this.$set(this.ruleForm, key, formatCurrency(val, 2));
    },
    refreshData(id) {
      this.$refs.form && this.$refs.form.refresh();
      fetchData({
        ...apis.PRODUCT_SUPPLIER_REL_INFO,
        data: { productSupplierRelId: id }
      }).then(res => {
        if (res.data.code === 0) {
          this.$emit(
            "update:productSupplierPriceEntityList",
            res.data.rows.productSupplierPriceEntityList
          );
          this.$nextTick(() => {
            this.setFreight(0);
          });
        }
      });
    },
    showSupply(type, id) {
      let vm = this;
      console.log(vm.radio);
      if (type) {
        // 修改
        showDialog(
          "SupplyPrice",
          {
            title: "修改供货价",
            width: 1200,

            okText: "修改"
          },
          { disabled: true, options: this.priceUnit, id: id },
          {
            // 绑定点击model确认事件,参数是选择的配件详情
            set: function(childVm) {
              const {
                ruleForm: { supplierAddressId },
                priceModel: { priceArr: productSupplierPriceEntityList }
              } = childVm;
              const provinceId = supplierAddressId[0];
              const cityId = supplierAddressId[1];
              delete childVm.ruleForm.supplierAddressId;
              // 供应商信息
              const productSupplierRelEntity = {
                ...childVm.ruleForm,
                provinceId,
                cityId,
                productId: vm.productId
              };

              fetchData({
                ...apis.PRODUCT_SUPPLIER_REL_UPDATE,
                data: {
                  parentFlag: 1,
                  productSupplierRelEntity,
                  productSupplierPriceEntityList
                }
              }).then(res => {
                handlerCode(res, () => {
                  childVm.cancel();
                  vm.refreshData(
                    childVm.priceModel.priceArr[0].productSupplierRelId
                  );
                });
              });
            }
          }
        );
      } else {
        showDialog(
          "SupplyPrice",
          {
            title: "添加供货价",
            width: 1200,
            okText: "保存"
          },
          { options: this.priceUnit },
          {
            // 绑定点击model确认事件,参数是选择的配件详情
            set: function(childVm) {
              const {
                ruleForm: { supplierAddressId },
                priceModel: { priceArr: productSupplierPriceEntityList }
              } = childVm;
              const provinceId = supplierAddressId[0];
              const cityId = supplierAddressId[1];
              delete childVm.ruleForm.supplierAddressId;
              // 供应商信息
              const productSupplierRelEntity = {
                ...childVm.ruleForm,
                provinceId,
                cityId,
                productId: vm.productId
              };
              // 供应商报价
              // const productSupplierPriceEntityList = [];

              fetchData({
                ...apis.PRODUCT_SUPPLIER_REL_SAVE,
                data: {
                  productSupplierRelEntity,
                  productSupplierPriceEntityList
                }
              }).then(res => {
                handlerCode(res, () => {
                  childVm.cancel();
                  vm.refreshData(
                    childVm.priceModel.priceArr[0].productSupplierRelId
                  );
                });
              });
            }
          }
        );
      }
    },
    showInfo() {
      this.showInfoFlag = !this.showInfoFlag;
      // if (this.showInfoFlag) {
      //   this.$nextTick(() => {
      //     this.$refs.form.refresh();
      //   });
      // }
    }
  },
  watch: {
    "productSupplierPriceEntityList.0.supplierPrice"(val, old) {
      _storage.set(
        "session",
        "purchase.productSupplierPriceEntityList.0.supplierPrice",
        val
      );
      _storage.set(
        "session",
        "purchase.productSupplierPriceEntityList.0.supplierPrice_old",
        old
      );
    },
    ruleForm(val) {
      // 处理日期
      this.$emit("update:senddata", val);
    },

    ruleform(val) {
      this.ruleForm = val;
    },

    // 设置包邮
    "ruleForm.pinkageFlag"(val) {
      console.log(val);
      if (val) {
        this.ruleForm.freightPrice = "0.00";
      } else {
        this.$set(this.ruleForm, "freightPrice", this.ruleForm.freightCost);
        // this.ruleForm.freightPrice = this.ruleForm.freightCost;
      }
    },

    "ruleForm.freightCost"(val) {
      this.ruleForm.freightPrice = val;
    }
  },
  computed: {
    parentPriceChangeMap() {
      return this.ruleForm.main.reviewData.parentPriceChangeMap;
    },
    unit1: {
      get() {
        return this.unit;
      },
      set(val) {
        this.$emit("update:unit", val);
      }
    },
    // 找到需要渲染的字段
    showField() {
      // 如果是母体
      if (this.$attrs.type == 1) {
        return this.renderedField.inputArrs.map(
          el => el.displayKey || el[0].displayKey
        );
      } else {
        return this.renderedField.variants.map(
          el => el.displayKey || el[0].displayKey
        );
      }
    },

    // 找到需要渲染的字段
    showRequire() {
      // 如果是母体
      if (this.$attrs.type == 1) {
        return this.renderedField.inputArrs.map(
          el => el.requireFlag && el.displayKey
        );
      } else {
        return this.renderedField.variants.map(
          el => el.requireFlag && el.displayKey
        );
      }
    },

    // 获取动态字段
    renderedField() {
      // debugger;
      return this.$attrs.formatField.priceTabField;
    },

    // inputarr
    inputArrs() {
      // debugger;
      return this.renderedField.inputArrs;
    }
  }
};
</script>

<style lang="scss" scoped>
.see_more {
  cursor: pointer;
  display: inline;
}
</style>
<style lang="scss">
.openTab {
  .__btn {
    width: 33px;
    height: 33px;
    line-height: 33px;
    background: #eee;
    text-align: center;
    margin-left: 8px;
    cursor: pointer;
  }
  .iconBox {
    position: absolute;
    right: -20px;
    top: 0;
    line-height: 33px;
    cursor: pointer;
  }
  .iconBox1 {
    position: absolute;
    right: 47px;
    top: 0;
    line-height: 38px;
    display: block;
    cursor: pointer;
  }
  .hidden__label {
    .ant-form-item-label label {
      visibility: hidden;
      &.fix {
        width: 8%;
      }
    }
  }
  .__inlineInput {
    display: flex;
    margin-bottom: 10px;
    height: 42px;
  }
}
</style>


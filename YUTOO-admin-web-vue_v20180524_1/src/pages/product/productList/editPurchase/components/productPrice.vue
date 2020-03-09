<template>
  <div>
    <v-card :title="$attrs.type == 1?'母体基本信息': ($attrs.type == 2 ?'母体差异字段信息' :`变体sku:${$attrs.sku}差异字段信息`)" class="margin-bottom-20">
      <v-form :model="ruleForm" direction="horizontal" :rules="renderedField.vali" ref="ruleForm">
        <v-row>
          <v-col span="24" v-if="showField.indexOf('productStatus') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品状态" prop="productStatus">
              <v-radio-group v-model="ruleForm.productStatus" :data="[{value: 1, text: '正常'},{value: 2, text: '仅批量'},{value: 3, text: '暂时缺货'},{value: 4, text: '停产'},{value: 5, text: '锁定'},{value: 6, text: '清库'}]">
              </v-radio-group>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('statusRemark') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品状态备注" prop="statusRemark">
              <v-input v-model="ruleForm.statusRemark"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="默认产品供货价" prop="supplierPrice">
              供应商报价
              <v-input v-model.number="ruleForm.supplierPrice"></v-input>
            </v-form-item>
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="采购运费" v-if="showField.indexOf('freightCost') >= 0" prop="freightCost">

              <v-input @blur="fixN('freightCost', $event)" :value.number="ruleForm.freightCost"></v-input>
              <v-button @click="showSupply">添加/修改供货价</v-button>
              <v-button>查看详情</v-button>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('taxInvoice') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="开票税点" prop="taxInvoice">
              <v-input @blur="fixN('taxInvoice', $event)" v-model.number="ruleForm.taxInvoice"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('taxPrice') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="含税价" prop="taxPrice">
              <v-input @blur="fixN('taxPrice', $event)" v-model.number="ruleForm.taxPrice"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('salePriceOriginal') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品销售价（原价）" prop="salePriceOriginal">
              <v-input @blur="fixN('salePriceOriginal', $event)" v-model.number="ruleForm.salePriceOriginal"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('salePriceNow') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品销售价（现价）" prop="salePriceNow">
              <v-input @blur="fixN('salePriceNow', $event)" v-model.number="ruleForm.salePriceNow"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('pinkageFlag') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否包邮" prop="pinkageFlag">
              <v-switch :true-value="1" :false-value="0" v-model="ruleForm.pinkageFlag"></v-switch>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('freightPrice') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="运费RMB" prop="freightPrice">
              {{ruleForm.freightPrice}}
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('freightPrice') >= 0">
            <!-- <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品销售价（多区间）">
              数量
              <v-input v-model="ruleForm"></v-input>
              <v-input v-model="ruleForm"></v-input>
              价格RMB
              <v-input v-model="ruleForm"></v-input>
              售价
              <v-input v-model="ruleForm"></v-input>
            </v-form-item> -->
          </v-col>
        </v-row>
      </v-form>
    </v-card>

  </div>
</template>

<script>
import { showDialog, fixFrameHeight } from "common/common";
import { formatCurrency } from "common/util";
export default {
  inheritAttrs: false,
  props: ["ruleform"],
  data() {
    let vm = this;
    let ruleform = {
      pinkageFlag: 1,
      freightPrice: "0.00"
    };
    return {
      ruleForm: ruleform,
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
    // 修正小数点
    fixN(key, val) {
      console.log(key, val);
      this.$set(this.ruleForm, key, formatCurrency(val, 2));
    },
    showSupply() {
      showDialog(
        "SupplyPrice",
        { title: "添加修改供货价", width: 1200, okText: "保存" },
        {},
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(arr) {
            console.log(arr);
            Vue.set(
              vm.items,
              index,
              Object.assign({}, vm.items[index], { childs: arr })
            );
            // vm.items[index].childs = arr;
            console.log(vm.items);
            setTimeout(() => {
              fixFrameHeight(1);
            });
          }
        }
      );
    }
  },
  watch: {
    ruleForm(val) {
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
        this.ruleForm.freightPrice = this.ruleForm.freightCost;
      }
    }
  },
  computed: {
    // 找到需要渲染的字段
    showField() {
      // 如果是母体
      if (this.$attrs.type == 1) {
        return this.renderedField.inputArrs.map(
          el => el.displayKey || el[0].displayKey
        );
      } else {
        return this.renderedField.variants.map(el => el.displayKey);
      }
    },

    // 获取动态字段
    renderedField() {
      return this.$attrs.formatField.priceTabField;
    }
  }
};
</script>

<style>
</style>

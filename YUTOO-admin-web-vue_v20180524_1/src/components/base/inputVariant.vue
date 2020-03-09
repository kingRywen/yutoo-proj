<template>
  <!-- 分组 -->
  <v-col v-if="isGroup" span="24">
    <v-form-item v-if="item[0]['propertyGroupName'] == '强电插头'" label="强电插头" :label-col="{span:3}" :wrapper-col="{span:21}" :required="required">
      <div v-for="i in item" :key="i.displayKey">
        <v-form-item v-if="i.inputType ==5" :prop="i.displayKey" :required="required">
          <v-switch v-model="groupData[i.displayKey]" :true-value="1" :false-value="0"></v-switch>
        </v-form-item>
        <v-form-item v-else-if="i.inputType == 3 && groupData.plugFlag" :prop="i.displayKey" class="margin-top-20 margin-bottom-10" :required="required">
          <v-radio-group v-model="groupData[i.displayKey]" :data="options.plugTypeList | formatPlug"></v-radio-group>
        </v-form-item>
      </div>
    </v-form-item>

    <!-- 产品包装重量组 -->
    <v-row :gutter="10" v-else>
      <v-col :span="parseInt(24 / item.length)" v-for="(i, index) in item">
        <v-form-item :label="index ==0 ? item[0]['propertyGroupName'] : null" :label-col="{span:index ==0 ? 9 : null}" :wrapper-col="{span:index ==0 ? 15 : 24}" :required="required">
          <v-row>
            <v-col span="16">
              <v-form-item :prop="i.displayKey">
                <v-input v-model.number="groupData[i.displayKey]"></v-input>
              </v-form-item>
            </v-col>
            <v-col span="8">
              {{i.propertyName}}
            </v-col>
          </v-row>
        </v-form-item>
      </v-col>
    </v-row>

  </v-col>
  <!-- 不分组 -->
  <v-col v-else :span="span || inputType == 4 ? '24' : '12'">
    <!-- 输入类型 -->
    <v-form-item :label="label" v-if="inputType == 1" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">

      <!-- 参考网站链接 -->
      <v-row :gutter="60" v-if="dataType !== 1 && prop == 'referenceLink'">
        <v-col span="20">
          <v-input :value="value" @input="$emit('input', $event)"></v-input>
        </v-col>
        <v-col span="4">
          <v-button type="primary" @click="openLink">打开参考链接</v-button>
        </v-col>
      </v-row>

      <!-- 文字输入框 -->
      <v-input v-else-if="dataType !== 1" :disabled="disabled || prop === 'sku'" placeholder="" :value="value" @input="$emit('input', $event)"></v-input>

      <!-- 数字输入框 -->
      <v-input-number v-else size="large" style="width:100%" :value="isNaN(parseFloat(value)) ? 0 : parseFloat(value)" @input="$emit('input', $event)"></v-input-number>

    </v-form-item>

    <!-- 单选下拉 -->
    <v-form-item :label="label" v-else-if="inputType == 2" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop == 'sourceType' ? null : prop" :required="required">

      <!-- 开发人员选择框 -->
      <v-select size="lg" v-if="prop == 'developId'" style="width: 100%;" :data="options['developList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 采购人员选择框 -->
      <v-select size="lg" v-else-if="prop == 'purchaseId'" style="width: 100%;" :data="options['purchaseList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 产品单位 -->
      <v-select size="lg" label="itemValue" clue="itemValue" v-else-if="prop == 'unit'" style="width: 100%;" :data="options['unitList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 物流属性 -->
      <v-select size="lg" v-else-if="prop == 'logisticType'" label="value" clue="value" style="width: 100%;" :data="options['logisticList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 产品类型 -->
      <v-select size="lg" v-else-if="prop == 'productType'" label="value" clue="key" style="width: 100%;" :data="options['productTypeList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 产品来源 -->
      <v-select size="lg" v-else-if="prop == 'sourceType'" style="width: 100%;" :data="[{label: '新样品', value:1},{label: '销售提报', value:2},{label: '平台采集', value:3},{label: '供应商审核', value:4}]" :value="value || 1" @input="$emit('input', $event)" disabled></v-select>

      <!-- 推荐指数 -->
      <v-rate v-else-if="prop == 'recommendLevel'" :value="~~value" @change="$emit('input', $event)"></v-rate>

      <!-- 产品品牌 -->
      <v-select size="lg" v-else-if="prop == 'productType'" label="value" clue="key" style="width: 100%;" :data="options['productTypeList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 产品侵权风险 -->
      <v-select size="lg" v-else-if="prop == 'riskType'" label="value" clue="value" style="width: 100%;" :data="options['productRiskList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 选择品牌 -->
      <v-select size="lg" v-else-if="prop == 'brand'" label="brandNameEn" clue="brandNameEn" style="width: 100%;" :data="options['brandList'] || [{label: '暂无数据', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 发货仓库 -->
      <v-select size="lg" v-else-if="prop == 'warehouseId'" clue="warehouseId" label="warehouseName" style="width: 100%;" :data="options['warehouseList']" :value="value" @input="$emit('input', $event)"></v-select>

      <!-- 统一换成switch -->
      <v-switch v-else-if="prop == 'shareFlag' || prop == 'variantFlag'" :true-value="1" :false-value="0" v-model="checked" :value="value" @input="$emit('input', $event)"></v-switch>

      <!-- 默认 -->
      <v-select size="lg" v-else style="width: 100%;" :data="[{label: 'mock', value:0}]" :value="value" @input="$emit('input', $event)"></v-select>

    </v-form-item>
    <!-- 多选框 -->
    <v-form-item :label="label" v-else-if="inputType == 3" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">
      <v-checkbox-group v-if="prop == 'platformIds'" :data="[{label: '亚马逊', value:1},{label: 'ebay', value:2},{label: '速卖通', value:3},{label: 'wish', value:4}]" :value="checkVal" @change="$emit('input', $event)"></v-checkbox-group>
      <v-checkbox-group v-else-if="prop == 'plugId'" :data="options['plugTypeList']" :value="value" @change="$emit('input', $event)" label="value" keyField="key"></v-checkbox-group>
      <v-checkbox-group v-else :data="[{label: '暂无数据', value:0}]" :value="value" @change="$emit('input', $event)"></v-checkbox-group>
    </v-form-item>
    <!-- 多行文本输入框-->
    <v-form-item :label="label" v-else-if="inputType == 4" :label-col="{span:3}" :wrapper-col="{span:19}" :prop="prop" :required="required">
      <v-input type="textarea" :value="value" @input="$emit('input', $event)" :autosize="{ minRows: 6, maxRows: 12 }"></v-input>
    </v-form-item>
    <!-- 单选按键-->
    <v-form-item :label="label" v-else-if="inputType == 5" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">

      <!-- 强电插头选择 -->
      <v-switch v-if="prop == 'plugFlag'" :value="value" @input="$emit('input', $event)" :true-value="1" :false-value="0"></v-switch>

      <!-- 是否支持海外仓直采 -->
      <v-switch v-if="prop == 'overseaFlag' || prop == 'photoFlag'" :value="value" @input="$emit('input', $event)" :true-value="1" :false-value="0"></v-switch>

      <v-radio-group v-else :value="value" @change="$emit('input', $event)" :data="[]"></v-radio-group>
    </v-form-item>
    <!-- 日期-->
    <v-form-item :label="label" v-else-if="inputType == 6" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">
      <v-date-picker :value="value" @change="$emit('input', $event)" size="lg"></v-date-picker>
    </v-form-item>
    <!-- 富文本-->
    <v-form-item :label="label" v-else-if="inputType == 7" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">
      <Editor :defaultMsg=value :config=config init-id="editor" @input="$emit('input', $refs.ue.getUEContent())" ref="ue" />
    </v-form-item>
    <!-- 颜色类型-->
    <v-form-item :label="label" v-else-if="inputType == 9" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">
      <v-input v-on="$listeners" :value="value" @input="$emit('input', $event)" style="display:none"></v-input>
      <v-button @click="openColor">选择类目</v-button>
    </v-form-item>
    <!-- 产品类目类型-->
    <v-form-item :label="label" v-else-if="inputType == 10" :label-col="labelcol" :wrapper-col="wrappercol" :prop="prop" :required="required">
      <template v-if="item.displayKey === 'categoryId'">
        <v-input v-on="$listeners" :value="$attrs.cate.categoryId" @input="$emit('input', $event)" style="display:none"></v-input>
        {{$attrs.cate.categoryDetail ? $attrs.cate.categoryDetail.replace(/\;/gi, ' > ') : cateDetail ? cateDetail.replace(/\;/gi, ' > ') : null }}
      </template>
      <template v-else>
        <v-input v-on="$listeners" :value="value" @input="$emit('input', $event)" style="display:none"></v-input>
        {{name}}
        <v-button @click="open">选择类目</v-button>
      </template>
    </v-form-item>

  </v-col>
</template>

<script>
import Vue from "vue";
import { fetchData, getVue, showDialog, showModal } from "common/common";
import Editor from "components/base/editor.vue";
import { isURL, isArray } from "common/util";
import apis from "apis";
import {
  YT_PRODUCT_COLUMNS,
  COLOR_PICKER
} from "../../pages/product/componentName";

export default {
  inheritAttrs: false,
  components: {
    Editor
  },
  props: [
    "group",
    "options",
    "value",
    "cateDetail",
    "label",
    "labelcol",
    "wrappercol",
    "disabled",
    "span",
    "prop",
    "inputType",
    "dataType",
    "item",
    "edit",
    "ruleForm"
  ],
  created() {
    if (this.item && this.item.requireFlag) {
      this.required = true;
    }
    if (this.isGroup) {
      if (this.item && this.item[0].requireFlag) {
        this.required = true;
      }
    }
  },
  data() {
    return {
      // 分组数据存储
      groupData: {},
      name: "",
      // 富文本配置
      defaultMsg: "",
      checked: 0,
      checkVal: [],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      required: false

      // 多选选项
      // options: []
    };
  },
  filters: {
    formatPlug(val) {
      let ret = [];
      val.forEach(el => {
        ret.push({
          value: +el.key,
          text: el.value
        });
      });
      return ret;
    }
  },
  methods: {
    // 打开参考链接
    openLink() {
      if (isURL(this.value)) {
        window.open(this.value);
      } else {
        showModal("error", "请填写正确的url");
      }
    },

    open() {
      let vm = this;
      showDialog(
        YT_PRODUCT_COLUMNS,
        { title: "请选择产品类目" },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr, arrs, name) {
            console.log(arr, arrs, name);
            if (arr.length <= 0) {
              getVue().$message.error("请选择一个类目");
              return true;
            }
            vm.name = name.join(" > ");
            vm.$emit("input", arr.parentId);
          }
        }
      );
    },
    openColor() {
      let vm = this;
      showDialog(
        COLOR_PICKER,
        { title: "请选择颜色" },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr) {
            console.log(arr);
            if (arr.length <= 0) {
              getVue().$message.error("请选择一个颜色");
              return true;
            }
            vm.$emit("input", arr);
          }
        }
      );
    },
    blur() {
      this.$emit("blur");
    }
  },
  computed: {
    isGroup() {
      return this.item.length;
    },
    htType() {
      switch (this.dataType) {
        case 1:
          return "int";
          break;
        case 2:
          return "string";
          break;
        case 3:
          return "date";
          break;
        case 4:
          return "boolean";
          break;
        case 5:
          return "double";
          break;
        case 6:
          return "bigdecimal";
          break;

        default:
          return "string";
          break;
      }
    },
    change(val) {
      console.log(val);
    }
  },
  watch: {
    groupData: {
      deep: true,
      handler: function(val) {
        if (!val.plug_flag) {
          delete val.plug_id;
        }
        this.$emit("selectmore", val);
      }
    },
    value(val) {
      console.log(val, this.prop);
      this.checked = val;

      let arr;

      if (this.prop == "platformIds") {
        if (isArray(val)) {
          this.checkVal = val;
        } else {
          arr = val.split(";").map(el => +el);
          this.checkVal = arr;
        }
      }
    },
    ruleForm(val) {
      console.log(this.item);
      if (this.item.length && this.edit) {
        this.item.forEach(el => {
          let value;
          if (!val[el.displayKey]) {
            value = null;
          } else {
            value = val[el.displayKey];
          }
          Vue.set(this.groupData, el.displayKey, value);
        });
        console.log(this.groupData);
      }
    }
  }
};
</script>

<style>
</style>

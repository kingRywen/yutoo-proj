<template>
  <div v-if="ruleForm.main">

    <!-- {{deleteEntryPriceIds}} -->
    <div class="margin-bottom-20">
      <v-form :model="ruleForm" direction="horizontal" :rules="renderedField.vali" ref="ruleForm">
        <v-row>
          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('titleEn') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'titleEn' + key" v-if="showInputs['titleEn'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品英文名称' : item.skuCustom" :prop="`${key}.titleEn`" :rules="renderedField.vali['titleEn']">
              <v-input placeholder="注：产品英文名即产品英文标题，用于Amazon/Ebay/Wish/速卖通等平台Listing上架标题" :disabled="$attrs.show" v-model="item.titleEn" @input="setSubVal('titleEn', $event, index, key)" @blur="handlerBlur('titleEn', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('titleEn')" v-if="showField.indexOf('titleEn') === -1">
                <v-icon type="down" v-if="!showInputs['titleEn'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['titleEn'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('entryNameEn') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'entryNameEn' + key" v-if="showInputs['entryNameEn'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品报关英文名称' : item.skuCustom" :prop="`${key}.entryNameEn`" :rules="renderedField.vali['entryNameEn']">
              <v-input placeholder="（例：USB Data Cable）请控制在 35 个字符" :disabled="$attrs.show" v-model="item.entryNameEn" @input="setSubVal('entryNameEn', $event, index, key)" @blur="handlerBlur('entryNameEn', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('entryNameEn')" v-if="showField.indexOf('entryNameEn') === -1">
                <v-icon type="down" v-if="!showInputs['entryNameEn'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['entryNameEn'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('entryNameZh') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'entryNameZh' + key" v-if="showInputs['entryNameZh'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品报关中文名' : item.skuCustom" :prop="`${key}.entryNameZh`" :rules="renderedField.vali['entryNameZh']">
              <v-input :disabled="$attrs.show" v-model="item.entryNameZh" @input="setSubVal('entryNameZh', $event, index, key)" @blur="handlerBlur('entryNameZh', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('entryNameZh')" v-if="showField.indexOf('entryNameZh') === -1">
                <v-icon type="down" v-if="!showInputs['entryNameZh'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['entryNameZh'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('productApplication') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'productApplication' + key" v-if="showInputs['productApplication'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品用途' : item.skuCustom" :prop="`${key}.productApplication`" :rules="renderedField.vali['productApplication']">
              <v-input :disabled="$attrs.show" v-model="item.productApplication" @input="setSubVal('productApplication', $event, index, key)" @blur="handlerBlur('productApplication', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('productApplication')" v-if="showField.indexOf('productApplication') === -1">
                <v-icon type="down" v-if="!showInputs['productApplication'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['productApplication'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('entryMaterial') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'entryMaterial' + key" v-if="showInputs['entryMaterial'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '报关材质' : item.skuCustom" :prop="`${key}.entryMaterial`" :rules="renderedField.vali['entryMaterial']">
              <v-input :disabled="$attrs.show" v-model="item.entryMaterial" @input="setSubVal('entryMaterial', $event, index, key)" @blur="handlerBlur('entryMaterial', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('entryMaterial')" v-if="showField.indexOf('entryMaterial') === -1">
                <v-icon type="down" v-if="!showInputs['entryMaterial'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['entryMaterial'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('hsCode') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'hsCode' + key" v-if="showInputs['hsCode'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '海关编码' : item.skuCustom" :prop="`${key}.hsCode`" :rules="renderedField.vali['hsCode']" class="__flex__">
              <v-input placeholder="默认是类别的海关编码，如果手动修改，我们将使用你手动修改值" :disabled="$attrs.show" v-model="item.hsCode" @input="setSubVal('hsCode', $event, index, key)" @blur="handlerBlur('hsCode', $event, index, key)"></v-input>
              <v-button style="margin-left:10px" v-if="index === 0" :disabled="$attrs.show" @click="openLink('https://www.hsbianma.com/')">查询海关编码</v-button>
              <div class="iconBox" @click="toggleTabs('hsCode')" v-if="showField.indexOf('hsCode') === -1">
                <v-icon type="down" v-if="!showInputs['hsCode'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['hsCode'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('hsCodeAudit') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'hsCodeAudit' + key" v-if="showInputs['hsCodeAudit'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '海关编码是否审核' : item.skuCustom" :prop="`${key}.hsCodeAudit`" :rules="renderedField.vali['hsCodeAudit']">
              <v-switch :disabled="$attrs.show" v-model="item.hsCodeAudit" :true-value="1" :false-value="0" @change="setSubVal('hsCodeAudit', $event, index, key)" @blur="handlerBlur('hsCodeAudit', $event, index, key)"></v-switch>
              <div class="iconBox" @click="toggleTabs('hsCodeAudit')" v-if="showField.indexOf('hsCodeAudit') === -1">
                <v-icon type="down" v-if="!showInputs['hsCodeAudit'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['hsCodeAudit'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('refundRate') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'refundRate' + key" v-if="showInputs['refundRate'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '退税率' : item.skuCustom" :prop="`${key}.refundRate`" :rules="renderedField.vali['refundRate']">
              <v-input placeholder="最多支持两位数" :disabled="$attrs.show" v-model.number="item.refundRate" @input="setSubVal('refundRate', $event, index, key)" @blur="handlerBlur('refundRate', $event, index, key)">
                <span slot="after">%</span>
              </v-input>
              <div class="iconBox" @click="toggleTabs('refundRate')" v-if="showField.indexOf('refundRate') === -1">
                <v-icon type="down" v-if="!showInputs['refundRate'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['refundRate'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in ((showField.indexOf('entryPrice') !== -1) ? {main: ruleForm.main} : ruleForm)" :key="'entryPrice' + key" v-if="showInputs['entryPrice'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '报关价' : item.skuCustom">
              <!-- {{item.productEntryPriceEntityList}} -->
              <div class="__inlineInput" v-for="(entry, subIndex) in item.productEntryPriceEntityList" :key="'productEntryPriceEntityList'+index +subIndex">
                <v-form-item :label-col="{span:10}" :wrapper-col="{span:14}" label="国家" :prop="`${key}.productEntryPriceEntityList[${subIndex}].nationId`" :required="requireEntry" :rules="[{required: true, message:'请选择一个国家'}]">
                  <v-select search size="lg" v-if="reloadSelect" :disabled="$attrs.show" v-model="entry.nationId" @change="setSubValPrice('nationId', $event, key, item, subIndex, index, entry)" @blur="handlerBlurPrice('nationId', $event, key, item, subIndex, index)" :data="nationList" style="width:200px">
                  </v-select>
                </v-form-item>
                <v-form-item :label-col="{span:10}" :wrapper-col="{span:14}" label="价格" :prop="`${key}.productEntryPriceEntityList[${subIndex}].entryInfoPrice`" :required="requireEntry" :rules="priceVali">
                  <v-input :disabled="$attrs.show" v-model.number="entry.entryInfoPrice" @input="setSubValPrice('entryInfoPrice', $event, key, item, subIndex, index)" @blur="handlerBlurPrice('entryInfoPrice', $event, key, item, subIndex, index)">
                    <v-select placeholder="" style="width: 70px;" slot="after" v-model="unit1" @input="val => entry.entryInfoPriceUnit = val" :data="priceUnit" :allowClear="false"></v-select>
                  </v-input>
                </v-form-item>
                <v-form-item style="margin-left: 10px;">
                  <div style="display:flex;height: 32px;vertical-align: middle;align-items: center;">
                    <div class="__btn" @click="addList(item.productEntryPriceEntityList, subIndex, item)">
                      <v-icon type="plus"></v-icon>
                    </div>
                    <div class="__btn" @click="delList(item.productEntryPriceEntityList, subIndex, item, key)" v-if="subIndex !== 0">
                      <v-icon type="minus"></v-icon>
                    </div>
                  </div>
                </v-form-item>
                <v-form-item style="margin-left: 10px;" v-if="index=== 0">
                  <v-button @click="openDialog" :disabled="$attrs.show">报关价格规则管理</v-button>
                </v-form-item>
              </div>
              <div class="iconBox" @click="toggleTabs('entryPrice')" v-if="showField.indexOf('entryPrice') === -1">
                <v-icon type="down" v-if="!showInputs['entryPrice'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['entryPrice'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>

          <v-col span="24" v-for="(item, key, index) in (!showField.indexOf('declareElement') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'declareElement' + key" v-if="showInputs['declareElement'] || key ==='main'" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '申报要素' : item.skuCustom" :prop="`${key}.declareElement`" :rules="renderedField.vali['declareElement']">
              <v-input :disabled="$attrs.show" :placeholder="`多个申报元素,以'|'分隔`" type="textarea" :autosize="{minRows:6}" v-model="item.declareElement" @input="setSubVal('declareElement', $event, index, key)" @blur="handlerBlur('declareElement', $event, index, key)">
              </v-input>
              <div class="iconBox" @click="toggleTabs('declareElement')" v-if="showField.indexOf('declareElement') === -1">
                <v-icon type="down" v-if="!showInputs['declareElement'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['declareElement'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </div>
</template>

<script>
import isURL from "is-url";
import { showToast, fetchData, showDialog } from "common/common";
import apis from "apis";
import _isEqual from "lodash/isEqual";

export default {
  inheritAttrs: false,
  props: ["ruleform", "priceUnit", "unit"],
  data() {
    let vm = this;
    const checkPrice = (rule, value, callback) => {
      if (value === "" || value == null) {
        callback(new Error("不能为空"));
      }
      if (!(Number.isFinite(value) && value > 0)) {
        callback(new Error("必须为正整数"));
      }
      callback();
    };
    return {
      priceVali: [
        {
          validator: checkPrice
        }
      ],
      deleteEntryPriceIds: [],
      nationList: [
        {
          label: "中国",
          value: 0
        },
        {
          label: "美国",
          value: 1
        },
        {
          label: "英国",
          value: 2
        }
      ],
      // requireEntry: false,
      showInputs: {},
      reloadSelect: true,
      rules: {},
      // ruleForm: {},
      ruleForm: vm.$attrs.variantForm,
      // ruleForm: this.$attrs.ruleForm || {},
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      }
    };
  },
  created() {
    this.getNationList();
  },
  methods: {
    openDialog() {
      showDialog(
        "EntryPrice",
        { title: "报关价格规则管理", width: 600, modalnoBtn: true },
        {},
        {}
      );
    },
    getNationList() {
      fetchData({
        ...apis.NATION_LIST
      }).then(res => {
        if (res.data.code === 0) {
          this.nationList = res.data.rows.map(el => ({
            label: el.name_zh,
            value: el.nation_id,
            ...el
          }));
        }
      });
    },
    addList(list, index, item) {
      let el = {
        ...list[index],
        nationId: null,
        nationName: null,
        entryInfoPrice: null,
        entryInfoPriceUnit: this.unit,
        edit_nationId: false,
        edit_nationName: false,
        edit_entryInfoPrice: false,
        sort: null
      };

      const id = item.productEntryPriceEntityList[index].nationId;
      this.setNationSelected(id, true);

      let vals = list.map(el => ({
        nationId: el.nationId,
        nationName: el.nationName,
        entryInfoPrice: el.entryInfoPrice,
        entryInfoPriceUnit: el.entryInfoPriceUnit
      }));

      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          const elementList = element.productEntryPriceEntityList.map(_el => ({
            nationId: _el.nationId,
            nationName: _el.nationName,
            entryInfoPrice: _el.entryInfoPrice,
            entryInfoPriceUnit: _el.entryInfoPriceUnit
          }));
          if (key === "main") {
            continue;
          }
          if (_isEqual(vals, elementList)) {
            element.productEntryPriceEntityList.splice(index + 1, 0, {
              ...el,
              productEntryInfoId:
                element.productEntryPriceEntityList[0].productEntryInfoId
            });
          }
        }
      }

      list.splice(index + 1, 0, el);
    },
    setNationSelected(id, status) {
      this.reloadSelect = false;
      this.$nextTick(() => {
        // debugger;
        const nation_el = this.nationList.find(el => el.value === id);
        if (nation_el) {
          nation_el.disabled = status;
        }
        this.reloadSelect = true;
      });
    },
    delList(list, index, item, key) {
      let vals = list.map(el => ({
        nationId: el.nationId,
        nationName: el.nationName,
        entryInfoPrice: el.entryInfoPrice,
        entryInfoPriceUnit: el.entryInfoPriceUnit
      }));

      // 恢复国家可选择
      const id = item.productEntryPriceEntityList[index].nationId;
      this.setNationSelected(id);
      // const nation_el = this.nationList.find(el => el.value === id);
      // nation_el.disabled = false;
      // debugger;

      if (key === "main") {
        for (const key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            const element = this.ruleForm[key];
            const elementList = element.productEntryPriceEntityList.map(
              _el => ({
                nationId: _el.nationId,
                nationName: _el.nationName,
                entryInfoPrice: _el.entryInfoPrice,
                entryInfoPriceUnit: _el.entryInfoPriceUnit
              })
            );
            if (key === "main") {
              continue;
            }

            if (_isEqual(vals, elementList)) {
              element.productEntryPriceEntityList.splice(index, 1);
            }
          }
        }
      }

      if (list[index] && list[index].productEntryPriceId) {
        this.deleteEntryPriceIds.push(list[index].productEntryPriceId);
      }

      list.splice(index, 1);
    },
    setSubVal(k, val, index, keyIndex) {
      if (index === 0) {
        for (const key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            const element = this.ruleForm[key];
            if (key === "main") {
              continue;
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
    toggleTabs(key) {
      if (this.showInputs[key]) {
        this.$set(this.showInputs, key, false);
        return;
      }

      this.$set(this.showInputs, key, true);
    },
    // 打开海关编码查询
    openLink(url) {
      window.open(url);
    },

    setSubValPrice(k, val, key, item, subIndex, i, entry) {
      if (k === "nationId") {
        const el = this.nationList.find(el => el.value === val) || {};
        entry.nationName = el.label;

        // 设置选定的国家不可选
        // el.disabled = true;
        if (el.value != null) {
          this.setNationSelected(el.value, true);
        }
      }
      try {
        if (i === 0) {
          for (const key in this.ruleForm) {
            if (this.ruleForm.hasOwnProperty(key)) {
              const element = this.ruleForm[key];

              if (key === "main") {
                continue;
              }
              if (
                this.ruleForm[key].productEntryPriceEntityList[subIndex][
                  "edit_" + k
                ]
              ) {
                continue;
              }
              this.ruleForm[key].productEntryPriceEntityList[subIndex][k] = val;
            }
          }
        }
      } catch (error) {}
    },
    handlerBlurPrice(k, val, key, item, subIndex, i) {
      try {
        if (
          val === this.ruleForm.main.productEntryPriceEntityList[subIndex][k]
        ) {
          this.ruleForm[key].productEntryPriceEntityList[subIndex][
            "edit_" + k
          ] = false;
        } else {
          this.ruleForm[key].productEntryPriceEntityList[subIndex][
            "edit_" + k
          ] = true;
        }
      } catch (error) {}
    },

    open() {
      if (isURL(this.ruleForm.europeEntryLink)) {
        if (
          this.ruleForm.europeEntryLink.indexOf("http://") == 0 ||
          this.ruleForm.europeEntryLink.indexOf("https://") == 0
        ) {
          window.open(this.ruleForm.europeEntryLink);
        } else {
          window.open("http://" + this.ruleForm.europeEntryLink);
        }
      } else {
        showToast("error", "请输入正确的url");
      }
    },
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
    // ruleForm(val) {
    //   this.$emit("update:senddata", val);
    // },
    ruleform(val) {
      this.ruleForm = val;
    }
  },
  computed: {
    requireEntry: {
      get() {
        return this.showRequire && this.showRequire.indexOf("entryPrice") > -1;
      }
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
        return this.renderedField.variants.map(el => el.displayKey);
      }
    },

    // 找到必填字段
    showRequire() {
      // 如果是母体
      if (this.$attrs.type == 1) {
        return this.renderedField.inputArrs
          .map(el => el.requireFlag && el.displayKey)
          .filter(el => el !== false && el != null);
      } else {
        return this.renderedField.variants.map(
          el => el.requireFlag && el.displayKey
        );
      }
    },

    // 获取动态字段
    renderedField() {
      return this.$attrs.formatField.entryInfoTabField;
    }
  }
};
</script>

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

<template>
  <v-form :direction="$attrs.direction" :model="ruleForm" :rules="$attrs.rules" class="__special_form" ref="ruleForm">
    <!-- 控件类型 1.输入框，2单选框，3多选框，4多行文本输入框-->
    <!-- {{ruleForm}} -->
    <!-- 平台编辑list -->
    <template v-if="data.length == null">
      <div class="__hover_box" v-for="(item,key,index) in data">
        <div class="openTab platform_tab">
          <v-form-item :label="item[label]" :rules="getRule(item, 0)" :prop="`parent.${key}`" :label-col="$attrs.labelcol" :wrapper-col="$attrs.wrappercol" :required="!!item[required]">

            <v-input :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && item[type] !== 1 && item[type] !== 5 && item[type] !== 7" :value="item[val]" @input="handlerInput(item, key, $event)" style="width:100%"></v-input>

            <v-input-number size="large" :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && (item[type] === 1 || item[type] === 5 || item[type] === 7)" :value="item[val] || ''" @input="handlerInput(item, key, $event)" @change="handlerInput(item, key, $event)" style="width:100%"></v-input-number>

            <v-input :disabled="disabled" v-if="item[inputType] === 4" :value="item[val]" @input="handlerInput(item, key, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>
            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 2" :value="item[val] ? +item[val] : null" @input="handlerInput(item, key, $event)" :cate-id="item.salePfPropertyId" :plat="true"></PurchaseSelect>

            <PurchaseSelect :disabled="disabled" :plat="true" v-if="item[inputType] === 3" :value="item[val]" @input="handlerInput(item, key, $event)" :cate-id="item.salePfPropertyId" type="1"></PurchaseSelect>

            <PurchaseSelect :disabled="disabled" :plat="true" v-if="item[inputType] === 5" :value="item[val] ? +item[val] : null" @input="handlerInput(item, key, $event)" :cate-id="item.salePfPropertyId" type="2"></PurchaseSelect>

            <el-date-picker :picker-options="pickerOptions" :disabled="disabled" :value-format="item.dataRanges.replace('mm', 'MM')" size="small" v-if="item[type] === 3 && item[inputType] === 1" :value="item[val]" @change="handlerInput(item, key, $event, null, `parent.${key}`)" @input="handlerInput(item, key, $event, null, `parent.${key}`)" style="width:100%" type="date" placeholder="选择日期">
            </el-date-picker>

            <v-input :disabled="disabled" v-if="item[inputType] === 7" :value="item[val]" @input="handlerInput(item, key, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

            <v-cascader :disabled="disabled" v-if="item[inputType] === 9 || item[inputType] === 10" size="large" :data="options"></v-cascader>

            <div class="iconBox">
              <div @click="toggle(item, index)" v-if="item.variantsDisparityFlag === 1">
                <v-icon v-show="!item._hidden" type="down-square"></v-icon>
                <v-icon v-show="item._hidden" type="up-square"></v-icon>
              </div>
              <div v-if="mappingFieldData && mappingFieldData.parent && mappingFieldData.parent.reference[item.propertyName] != null">
                <el-tooltip placement="top">
                  <div slot="content">映射值: {{mappingFieldData.parent.reference[item.propertyName]}}</div>
                  <div @click="handlerInput(item, key, mappingFieldData.parent.reference[item.propertyName])">
                    <v-icon type="info-circle" style="color:#ffbf00;margin-left:6px"></v-icon>
                  </div>

                </el-tooltip>
              </div>
            </div>
          </v-form-item>

        </div>
        <template v-if="item.variantsDisparityFlag === 1 && mappingFieldData">

          <div class="openTab platform_tab" v-for="(variant, k, index) in ruleForm.variants" v-show="item._hidden">
            <v-form-item :label="mappingFieldData.variants[k].skuCustom" :rules="getRule(item, 0)" :prop="`variants.${k}.${key}`" :label-col="$attrs.labelcol" :wrapper-col="$attrs.wrappercol" :required="!!item[required]">

              <!-- {{variant[key]}} -->
              <v-input :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && item[type] !== 1 && item[type] !== 5 && item[type] !== 7" :value="variant[key]" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" style="width:100%"></v-input>
              <v-input-number size="large" :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && (item[type] === 1 || item[type] === 5 || item[type] === 7)" :value="variant[key] || ''" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @change="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" style="width:100%"></v-input-number>

              <PurchaseSelect :plat="true" :disabled="disabled" v-if="item[inputType] === 2" :value="variant[key] ? +variant[key] : null" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" :cate-id="item.salePfPropertyId"></PurchaseSelect>

              <PurchaseSelect :plat="true" :disabled="disabled" v-if="item[inputType] === 3" :value="variant[key]" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" :cate-id="item.salePfPropertyId" type="1"></PurchaseSelect>

              <v-input :disabled="disabled" v-if="item[inputType] === 4" :value="variant[key]" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

              <PurchaseSelect :plat="true" :disabled="disabled" v-if="item[inputType] === 5" :value="variant[key] ? +variant[key] : null" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" :cate-id="item.salePfPropertyId" type="2"></PurchaseSelect>

              <!-- <v-date-picker v-if="item[inputType] === 6" :value="variant[key]" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" style="width:100%"></v-date-picker> -->
              <el-date-picker :picker-options="pickerOptions" :disabled="disabled" value-format="yyyy-MM-dd" size="small" v-if="item[type] === 3 && item[inputType] === 1" :value="variant[key]" @change="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" style="width:100%" type="date" placeholder="选择日期">
              </el-date-picker>

              <v-input :disabled="disabled" v-if="item[inputType] === 7" :value="variant[key]" @input="handlerInput(variant, key, $event, 1, `variants.${k}.${key}`)" @blur="handlerBlur(variant, key, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

              <v-cascader :disabled="disabled" v-if="item[inputType] === 9 || item[inputType] === 10" size="large" :data="options"></v-cascader>

              <div class="iconBox" v-if="mappingFieldData && mappingFieldData.variants[k].reference[item.propertyName] != null">
                <el-tooltip placement="top">
                  <div slot="content">映射值: {{mappingFieldData.variants[k].reference[item.propertyName]}}</div>
                  <div @click="handlerInput(variant, key, mappingFieldData.variants[k].reference[item.propertyName], 1, `variants.${k}.${key}`)">
                    <v-icon type="info-circle" style="color:#ffbf00;margin-left:6px"></v-icon>
                  </div>

                </el-tooltip>
              </div>
            </v-form-item>

          </div>
        </template>
        <div class="__hr"></div>
      </div>
    </template>

    <!-- 店铺编辑list -->
    <template v-else>

      <div v-for="(item, index) in data" class="__hover_box">
        <div class="openTab">
          <!-- {{item._hidden}} -->
          <v-form-item :label="item[label]" :rules="getRule(item,1)" :prop="`parent.main_${item[bindval]}`" :label-col="$attrs.labelcol" :wrapper-col="$attrs.wrappercol" :required="!!item[required]">

            <v-input :disabled="disabled" @focus="showItem(item)" v-if="item[type] !== 3 && item[inputType] === 1 && item[type] !== 1 && item[type] !== 5 && item[type] !== 7" :value="item[val]" @input="handlerInputMain(item, index, $event)" style="width:100%"></v-input>

            <v-input-number size="large" :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && (item[type] === 1 || item[type] === 5 || item[type] === 7)" :value="item[val] || ''" @focus="showItem(item)" @input="handlerInputMain(item, index, $event)" @change="handlerInputMain(item, index, $event)" style="width:100%"></v-input-number>

            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 2" @focus="showItem(item)" :value="item[val] ? +item[val] : null" @input="handlerInputMain(item, index, $event)" :cate-id="item.salePfPropertyId" :list="item.itemProp"></PurchaseSelect>

            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 3" @focus="showItem(item)" :value="item[val]" @input="handlerInputMain(item, index, $event)" :cate-id="item.salePfPropertyId" type="1" :list="item.itemProp"></PurchaseSelect>

            <v-input :disabled="disabled" @focus="showItem(item)" v-if="item[inputType] === 4" :value="item[val]" @input="handlerInputMain(item, index, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 5" @focus="showItem(item)" :value="item[val] ? +item[val] : null" @input="handlerInputMain(item, index, $event)" :cate-id="item.salePfPropertyId" type="2" :list="item.itemProp"></PurchaseSelect>

            <el-date-picker :disabled="disabled" :picker-options="pickerOptions" @focus="showItem(item)" :value-format="item.dataRanges.replace('mm', 'MM')" size="small" v-if="item[type] === 3 && item[inputType] === 1" :value="item[val]" @input="handlerInputMain(item, index, $event, `parent.main_${item[bindval]}`)" @change="handlerInputMain(item, index, $event, `parent.main_${item[bindval]}`)" style="width:100%" type="date" placeholder="选择日期">
            </el-date-picker>

            <!-- <v-date-picker v-if="item[type] === 3 && item[inputType] === 1" :value="item[val]" @change="handlerInputMain(item, index, $event)" style="width:100%"></v-date-picker> -->

            <v-input :disabled="disabled" @focus="showItem(item)" v-if="item[inputType] === 7" :value="item[val]" @input="handlerInputMain(item, index, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

            <v-cascader :disabled="disabled" @focus="showItem(item)" v-if="item[inputType] === 9 || item[inputType] === 10" size="large" :data="options"></v-cascader>

            <div class="iconBox" v-if="item.propertyValue">
              <div @click="toggle(item, index)">
                <v-icon type="down-square" v-show="!item._hidden"></v-icon>
                <v-icon type="up-square" v-show="item._hidden"></v-icon>
              </div>
              <div v-if="item.variantsDisparityFlag">
                <el-tooltip class="item" effect="dark" :content="'每个变体值必须不同'" placement="top">
                  <v-icon type="info-circle-o" style="color:#ff9800;margin-left:6px"></v-icon>
                </el-tooltip>
              </div>
            </div>

          </v-form-item>

        </div>
        <div class="openTab" v-show="item._hidden">
          <v-form-item v-for="(i, subIndex) in item.propertyValue" :label="i.skuStore" :rules="getRule(item,1)" :prop="`variants.${subIndex}_${item[bindval]}`" :label-col="$attrs.labelcol" :wrapper-col="$attrs.wrappercol" :required="!!item[required]">
            <!-- {{item.itemProp}} -->
            <v-input :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && item[type] !== 1 && item[type] !== 5 && item[type] !== 7" :value="i[val]" @input="handlerInput1(item, subIndex, $event)" style="width:100%"></v-input>

            <v-input-number size="large" :disabled="disabled" v-if="item[type] !== 3 && item[inputType] === 1 && (item[type] === 1 || item[type] === 5 || item[type] === 7)" :value="i[val] || ''" @input="handlerInput1(item, subIndex, $event)" @change="handlerInput1(item, subIndex, $event)" style="width:100%"></v-input-number>

            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 2" :value="i[val] ? +i[val] : null" @input="handlerInput1(item, subIndex, $event)" :cate-id="item.salePfPropertyId" :list="item.itemProp"></PurchaseSelect>

            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 3" :value="i[val]" @input="handlerInput1(item, subIndex, $event)" :cate-id="item.salePfPropertyId" type="1" :list="item.itemProp"></PurchaseSelect>

            <v-input :disabled="disabled" v-if="item[inputType] === 4" :value="i[val]" @input="handlerInput1(item, subIndex, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

            <PurchaseSelect :disabled="disabled" v-if="item[inputType] === 5" :value="i[val] ? +i[val] : null" @input="handlerInput1(item, subIndex, $event)" :cate-id="item.salePfPropertyId" type="2" :list="item.itemProp"></PurchaseSelect>

            <el-date-picker :disabled="disabled" :picker-options="pickerOptions" value-format="yyyy-MM-dd" size="small" v-if="item[type] === 3 && item[inputType] === 1" :value="i[val]" @input="handlerInput1(item, subIndex, $event)" style="width:100%" type="date" @change="handlerInput1(item, index, $event, `variants.${subIndex}_${item[bindval]}`)" placeholder="选择日期">
            </el-date-picker>

            <!-- <v-date-picker v-if="item[type] === 3 && item[inputType] === 1" :value="i[val]" @change="handlerInput1(item, subIndex, $event)" style="width:100%"></v-date-picker> -->

            <v-input :disabled="disabled" v-if="item[inputType] === 7" :value="i[val]" @input="handlerInput1(item, subIndex, $event)" type="textarea" :autosize="{minRows:6}" style="width:100%"></v-input>

            <v-cascader :disabled="disabled" v-if="item[inputType] === 9 || item[inputType] === 10" size="large" :data="options"></v-cascader>

          </v-form-item>

        </div>
        <div class="__hr"></div>
      </div>
    </template>

  </v-form>
</template>

<script>
import PurchaseSelect from "./purchaseSelect";
import { formatTime } from "common/util";
import Vue from "vue";
import { DatePicker, Tooltip } from "element-ui";

Vue.use(DatePicker);
Vue.use(Tooltip);

export default {
  inheritAttrs: false,
  props: [
    "value",
    "data",
    "bindField",
    "mappingFieldData",
    "variantDataList",
    "name",
    "disabled"
  ],
  components: {
    PurchaseSelect
  },
  created() {
    if (this.data.length) {
      // 店铺编辑
      this.data.forEach(element => {
        this.ruleForm.parent["main_" + element.propertyName] = element.value;
        if (element.propertyValue) {
          element.propertyValue.forEach((el, i) => {
            this.ruleForm.variants[i + "_" + element.propertyName] = el.value;
          });
        }
      });
    }
  },
  data() {
    const checkRule = item => {
      return (rule, value, callback) => {
        let reg;
        if (item.ruleExp) {
          reg = new RegExp(item.ruleExp, "gi");
        } else {
          reg = new RegExp(item.dataRanges, "gi");
        }
        // let errorMsg = "不能为空";
        if (value === "") {
          callback(new Error("不能为空"));
        }
        if (!reg.test(value)) {
          callback(new Error("数值不符合规范"));
        }
        callback();
      };
    };

    return {
      getRule(item, type) {
        if (!item.mustFlag) {
          return null;
        }
        if (item.dataType === 3) {
          return this.rule.notEmpty;
        }
        if (type == 1) {
          if (item.dataRanges === "") {
            return this.rule.notEmpty;
          } else {
            return [{ validator: checkRule(item) }];
          }
        } else {
          if (item.rules) {
            return this.rule[item.rules];
          }

          return [
            { validator: checkRule(item) },
            {
              required: item[this.required] === 1 ? true : false,
              message: "不能为空"
            }
          ];
        }
      },

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 24 * 3600 * 1000 < Date.now();
        }
      },
      selectOptions: [],
      checkboxOptions: [],
      rule: {
        notEmpty: [{ required: true, message: "不能为空" }]
      },
      options: [],
      ruleForm: {
        parent: {},
        variants: {}
      }
    };
  },
  methods: {
    // 日期组件输入时需要手动验证一下表单域
    validDate(prop) {
      this.$refs.ruleForm.validateField(prop);
    },
    applyVal() {
      this.data.forEach(el => {
        if (el.propertyValue && el.propertyValue.length) {
          el.propertyValue.forEach(i => {
            if (i.platformValue != null) {
              i.value = i.platformValue;
            }
          });
        }
      });
    },
    toggle(i, index) {
      if (i._hidden) {
        this.$set(i, "_hidden", false);
      } else {
        this.$set(i, "_hidden", true);
      }
    },
    showItem(item) {
      this.data.forEach(element => {
        this.$set(element, "_hidden", false);
      });
      this.$set(item, "_hidden", true);
    },
    hiddenItem(item) {
      this.$set(item, "_hidden", false);
    },
    handlerMainBlur(item) {
      this.$set(item, "_hidden", false);
    },
    handlerBlur(item, key, val) {
      if (val === this.ruleForm.parent[key]) {
        item["edit-" + key] = false;
      } else {
        item["edit-" + key] = true;
      }
    },
    handlerInput(item, key, val, variant, field) {
      if (field) {
        this.$refs.ruleForm.validateField(field);
      }
      // debugger;
      if (variant) {
        if (item[this.type] === 3) {
          this.$refs.ruleForm.validate();
        }
      } else {
        if (item[this.type] === 3) {
          this.$refs.ruleForm.validate();
        }
      }

      if (variant) {
        this.$set(item, key, val);
        return;
      }
      this.$set(item, this.val, val);
      this.$set(this.ruleForm.parent, key, val);
      if (
        item.variantsDisparityFlag != null &&
        item.variantsDisparityFlag === 1
      ) {
        for (const k in this.ruleForm.variants) {
          if (this.ruleForm.variants.hasOwnProperty(k)) {
            const element = this.ruleForm.variants[k];
            if (element["edit-" + key]) {
              continue;
            }
            this.$set(element, key, val);
            // element[key] = val;
          }
        }
      }
    },
    handlerInput1(item, index, val, field) {
      if (field) {
        this.$refs.ruleForm.validateField(field);
      }
      // item.propertyValue[index].value = val;
      this.$set(item.propertyValue[index], "value", val);

      this.$set(this.ruleForm.variants, index + "_" + item[this.bindval], val);
      if (item.propertyValue) {
        item.propertyValue.forEach(element => {
          if (element.value === val) {
            item.propertyValue[index].edit = false;
          } else {
            item.propertyValue[index].edit = true;
          }
        });
      }
    },
    handlerInputMain(item, index, val, field) {
      if (field) {
        this.$refs.ruleForm.validateField(field);
      }
      this.$set(this.ruleForm.parent, "main_" + item[this.bindval], val);
      this.$set(item, this.val, val);
      if (item.variantsDisparityFlag) {
        return;
      }
      if (item.propertyValue) {
        item.propertyValue.forEach(element => {
          if (!element.edit) {
            this.$set(element, this.val, val);
          }
        });
      }
    }
  },
  computed: {
    label() {
      return this.bindField.label;
    },
    bindval() {
      return this.bindField.bindval;
    },
    val() {
      return this.bindField.value;
    },
    type() {
      return this.bindField.type;
    },
    required() {
      return this.bindField.required;
    },
    inputType() {
      return this.bindField.inputType;
    }
  },
  watch: {
    mappingFieldData: {
      immediate: true,
      handler(val) {
        if (!val) {
          return;
        }
        val = JSON.parse(JSON.stringify(val));
        let vm = this;
        let ret = {
          parent: {},
          variants: {}
        };
        for (const key in val) {
          if (val.hasOwnProperty(key)) {
            const element = val[key];
            if (key === "parent") {
              ret[key] = JSON.parse(JSON.stringify(element));
              let _el = ret[key];

              for (const k in vm.data) {
                if (vm.data.hasOwnProperty(k)) {
                  const el = vm.data[k];
                  _el[k] = el.value;
                  if (el.variantsDisparityFlag === 1) {
                    _el["edit-" + k] = false;
                  }
                }
              }
            } else {
              for (const key in element) {
                if (element.hasOwnProperty(key)) {
                  const el = element[key];
                  ret.variants[key] = JSON.parse(JSON.stringify(el));
                  let _el = ret.variants[key];
                  let _values = {};
                  vm.variantDataList.forEach(__el => {
                    if (key === __el.pltSku) {
                      _values = { ..._values, ...__el.data[vm.name] };
                    }
                  });

                  ret.variants[key] = { ..._el, ..._values };
                  for (const k in vm.data) {
                    if (vm.data.hasOwnProperty(k)) {
                      const el = vm.data[k];
                      // ret.variants[key][k] = el.value;
                      if (el.variantsDisparityFlag === 1) {
                        ret.variants[key]["edit-" + k] = false;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        vm.ruleForm = ret;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.iconBox {
  position: absolute;
  right: -37px;
  cursor: pointer;
  top: 0;
  display: flex;
  width: 30px;
}
.__hover_box {
  padding-top: 24px;
  &:hover {
    background: #eff1f6;
  }
}

.platform_tab {
  .iconBox {
    height: 33px;
    line-height: 33px;
    .anticon {
      line-height: 33px;
    }
  }
}
</style>

<template>
  <!-- 正常输入 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="$attrs.type == 1" style="width:100%;margin-right: 0">
    <v-input-number :value="+value" v-if="$attrs.dataType === 1" size="large" style="width:100%" v-on="parentListeners"></v-input-number>
    <v-input :value="value" v-on="parentListeners" style="width:100%" v-else></v-input>
    <!-- <v-icon type="minus-circle" class="dyniInput-icon-minus"></v-icon> -->
  </v-form-item>

  <!-- 选择 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 9">
    <!-- {{options}} -->
    <v-select size="lg" style="width: 100%;" :data="options" v-on="parentListeners" :value="value" label="propertyValue" clue="propertyValue"></v-select>
  </v-form-item>

  <!-- 多行文本 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 4">
    <v-input :value="value" @input="$emit('input', $event)" type="textarea"></v-input>
  </v-form-item>

  <!-- 单选 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 5">
    <v-radio v-for="i in options_new" :value="value" @input="$emit('input', $event)" :label="i.value">{{i.value}}</v-radio>
  </v-form-item>

  <!-- 日期 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 6">
    <v-date-picker :value="value" @input="$emit('input', $event)" style="width:100%"></v-date-picker>
  </v-form-item>

  <!-- 颜色选择器 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 2">
    <v-button v-if="!icon" @click="chooseColor" type="ghost" style="width:100%">选择{{item.propertyName}}</v-button>
    <v-button v-else @click="chooseColor" :icon="icon" type="ghost" style="width:100%"></v-button>
    <!-- <ColorPicker></ColorPicker> -->
  </v-form-item>

  <!-- 级联类目选择器 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 100">
    <el-cascader :options="categoryPlatformEntityList" @active-item-change="handleItemChange" :props="props" @change="$emit('input', $event)" :value="value" style="width:100%"></el-cascader>
  </v-form-item>

  <!-- 正常显示文字 -->
  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else-if="$attrs.type == 101">
    {{value}}
  </v-form-item>

  <v-form-item :label="$attrs.label" :label-col="labelCol" :wrapper-col="wrapperCol" v-else>
    <div>{{$attrs.type}}:无组件</div>
  </v-form-item>

</template>

<script>
import Vue from "vue";
import { fetchData, showDialog } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";
import { Cascader } from "element-ui";
import { COLOR_PICKER } from "../../pages/product/componentName";

Vue.use(Cascader);

export default {
  inheritAttrs: false,
  components: {
    Cascader
  },
  props: ["value", "item", "selected", "index", "opts", "info", "radio", 'icon'],

  created() {
    this.productId = +getQueryString("productId");
    if (this.$attrs.type == 9) {
      // if (this.opts[this.index]) {
      //   this.options = this.opts[this.index];
      //   return;
      // }
      this.getSelectOptions();
    }
  },
  methods: {
    // 获取单选取值
    getSelectOptions() {
      console.log(123123);
      if (this.opts && this.opts.length > 0) {
        this.options = this.opts;
        return;
      }
      fetchData({
        ...apis.CATEPROPERTYM_FINDCATEPROPITEM,
        data: {
          catePropId: this.item.categoryPropertyId
        }
      }).then(res => {
        console.log(res);
        this.options = res.data.items;
      });
    },

    // 选择颜色按钮点击事件
    chooseColor() {
      let vm = this;
      showDialog(
        COLOR_PICKER,
        { title: "选择" + vm.item.propertyName, width: 1000 },
        {
          selected: vm.item.childs,
          propertyName: vm.item.propertyName,
          propertyId: vm.item.propertyId,
          radio: vm.item.radio,
          info: vm.info,
          productId: vm.productId
        },
        {
          // 绑定点击model确认事件
          set: function(arr) {
            vm.$emit("colorselect", arr);
          }
        }
      );
    },

    // 清除输入框 的值
    clear() {
      console.log(123123);
      this.value = null;
    }
  },
  data() {
    return {
      labelCol: {
        span: 0
      },
      wrapperCol: {
        span: 24
      },
      options: []
    };
  },

  watch: {
    ["item.inputs"]: {
      immediate: true,
      handler(val) {
        console.log(this.options);
        if (this.$attrs.type == 9) {
          this.options.map((el, index) => {
            if (val.find(i => i === el.propertyValue)) {
              this.options.splice(index, 1, {
                ...this.options[index],
                disabled: true
              });
            } else {
              this.options.splice(index, 1, {
                ...this.options[index],
                disabled: false
              });
            }
          });
          // this.$emit("update:opts", this.options);
        }
      }
    },
    options: {
      deep: true,
      handler(val) {
        this.$emit("update:opts", val);
      }
    }
  },

  computed: {
    // 监听事件
    parentListeners() {
      let vm = this;
      let event = {};
      if (this.$attrs.type === 1) {
        event = {
          blur(val) {
            vm.$emit("blur", val);
          }
        };
      }
      if (this.$attrs.type === 9) {
        event = {
          change(val) {
            vm.$emit("blur", val);
          }
        };
      }
      return {
        ...vm.$listeners,
        ...event
      };
    }
  }
};
</script>

<style lang="less" scoped>
.dyniInput-icon-minus {
  font-size: 16px;
  position: absolute;
}
</style>

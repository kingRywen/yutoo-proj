<template>
  <!-- 正常输入 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-if="$attrs.type == 1" :prop="item.uploadMustFlag ? item.displayKey : ''">

    <v-input-number :value="+value" @input="$emit('input', $event)" v-if="$attrs.dataType === 1" size="large" style="width:100%" v-on="parentListeners"></v-input-number>
    <v-input :value="value" @input="$emit('input', $event)" v-on="parentListeners" style="width:100%" v-else></v-input>
    <!-- <v-input :value="value" @input="$emit('input', $event)" v-else></v-input> -->
  </v-form-item>

  <!-- 选择 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 2" :prop="item.uploadMustFlag ? item.displayKey : ''">
    <v-select size="lg" style="width: 100%;" :data="options" :value="value" @input="$emit('input', $event)" label="propertyValue" clue="propertyValue"></v-select>
  </v-form-item>

  <!-- 多行文本 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 4" :prop="item.uploadMustFlag ? item.displayKey : ''">
    <v-input :value="value" @input="$emit('input', $event)" type="textarea"></v-input>
  </v-form-item>

  <!-- 单选 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 5" :prop="item.uploadMustFlag ? item.displayKey : ''">
    <v-radio v-for="i in options_new" :value="value" @input="$emit('input', $event)" :label="i.value">{{i.value}}</v-radio>
  </v-form-item>

  <!-- 日期 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 6" :prop="item.uploadMustFlag ? item.displayKey : ''">
    <v-date-picker :value="value" @input="$emit('input', $event)" style="width:100%"></v-date-picker>
  </v-form-item>

  <!-- 颜色选择器 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 9" :prop="item.uploadMustFlag ? item.displayKey : ''">
    <v-date-picker :value="value" @input="$emit('input', $event)" style="width:100%"></v-date-picker>
  </v-form-item>

  <!-- 级联类目选择器 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 100">
    <el-cascader :options="categoryPlatformEntityList" @active-item-change="handleItemChange" :props="props" @change="$emit('input', $event)" :value="value" style="width:100%"></el-cascader>
  </v-form-item>

  <!-- 正常显示文字 -->
  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else-if="$attrs.type == 101">
    {{value}}
  </v-form-item>

  <v-form-item :label="$attrs.label" :label-col="{span:4}" :wrapper-col="{span:16}" v-else>
    <div>{{$attrs.type}}:无组件</div>
  </v-form-item>

</template>

<script>
import Vue from "vue";
import { fetchData } from "common/common";
import apis from "apis";
import { Cascader } from "element-ui";

Vue.use(Cascader);

export default {
  inheritAttrs: false,
  components: {
    Cascader
  },
  props: ["value", "item", "isVariant"],
  // props: {
  //   value: {
  //     type: Number,
  //     default: 1
  //   },
  //   item: {
  //     type: Object
  //   }
  // },
  created() {
    //  采购编辑动态字段
    if (this.$attrs.type == 2) {
      // 查询接口
      fetchData({
        ...apis.CATEPLTTEMPPROPM_FINDCATEPLTPROPITEM,
        data: {
          propertyName: this.item.propertyName,
          siteId: this.item.siteId[0]
        }
      }).then(res => {
        console.log(res);
        this.options = res.data.item;
      });
    }

    if (this.$attrs.type == 5) {
      // 查询接口
      fetchData({
        ...apis.CATEPLTTEMPPROPM_FINDCATEPLTPROPITEM,
        data: {
          propertyName: this.item.propertyName,
          siteId: this.item.siteId[0]
        }
      }).then(res => {
        console.log(res);
        this.options_5 = res.data.item;
      });
    }

    if (this.$attrs.type == 100) {
      // 查询接口获取级联类目选择器
      this.getCategoryPlatformEntityList().then(res => {
        console.log(res);

        this.categoryPlatformEntityList = res.data.categoryPlatformEntityList;
        this.categoryPlatformEntityList.forEach(el => {
          if (el.itemType == "") {
            el.childs = [];
          }
        });
      });
    }
  },
  data() {
    return {
      options: [],
      options_5: [],
      props: {
        children: "childs",
        value: "platformCategoryId",
        label: "categoryName"
      },
      categoryPlatformEntityList: []
    };
  },
  methods: {
    // 设置单选type的值
    setType_5(val) {
      console.log(val, "+++++++++++++++++++++++++");
      this.$emit("input", val);
    },

    // 获取级联数据
    handleItemChange(val) {
      console.log("active item:", val);

      this.getCategoryPlatformEntityList({
        parentCategoryId: val[val.length - 1]
      }).then(res => {
        console.log(res);

        // 添加childs设置可点击获取数据
        res.data.categoryPlatformEntityList.map((el, index) => {
          if (el.itemType == "") {
            el.childs = [];
          }
        });

        // 设置下级类目列表，如果找到类目ID， 设置类目列表到当前类目下
        // 如果没找到类目id，说明不是此类目
        this.categoryPlatformEntityList.map((el, index) => {
          this.$set(
            this.categoryPlatformEntityList,
            index,
            Object.assign({}, this.categoryPlatformEntityList[index], {
              childs: res.data.categoryPlatformEntityList
            })
          );
        });
      });
    },

    // 获取类目
    getCategoryPlatformEntityList(data) {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
        data: { siteId: 1, ...data }
      });
    }
  },
  watch: {
    optionsAttr(val) {
      this.options = val;
    }
  },
  computed: {
    optionsAttr() {
      return this.$attrs.options;
    },
    options_new() {
      let opt = this.options_5;
      let obj = [];
      opt.map((el, i) =>
        obj.push({
          value: el.propertyValue,
          text: el.propertyName
        })
      );

      return obj;
    },

    // 监听事件
    parentListeners() {
      let vm = this;

      if (!this.isVariant) {
        return {};
      }

      return {
        ...vm.$listeners,
        blur(val) {
          vm.$emit("blur", val);
        }
      };
    }
  }
};
</script>

<style>
</style>

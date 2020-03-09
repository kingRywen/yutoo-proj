<template>
  <div class="____checkColor_wrapper">
    <!-- {{addItems}} -->
    <div v-if="success">
      <ul class="list">
        <!-- {{!$attrs.radio}} -->
        <!-- {{hasSelected}} == {{selected}} -->
        <el-checkbox-group v-if="!$attrs.radio" v-model="hasSelected" @change="change">
          <el-checkbox v-for="i in items" :label="i.nameCn" :key="i.nameCn">
            <span v-if="i.code" :style="`background: ${i.code};display:inline-block;border:1px solid #ddd`"></span>
            <span> {{i.nameCn}} {{i.nameEn}}</span>
          </el-checkbox>
          <el-checkbox v-for="(item, index) in addItemsAll" :label="item.nameCn" :key="item.nameCn" class="check">
            <span v-if="item.code" :style="`background: ${item.code};display:inline-block;border:1px solid #ddd`"></span>
            <span :title="item.nameCn + ' ' + item.nameEn"> {{item.nameCn}} {{item.nameEn}}</span>
            <span class="delBtn" @click.stop="deleteAddItem(index)">
              <v-icon type="close-circle"></v-icon>
            </span>
          </el-checkbox>

        </el-checkbox-group>

        <el-radio-group v-else v-model="hasSelected" @change="change">
          <el-radio v-for="i in items" :label="i.nameCn" :key="i.nameCn">
            <span v-if="i.code" :style="`background: ${i.code};display:inline-block;border:1px solid #ddd`"></span>
            <span> {{i.nameCn}} {{i.nameEn}}</span>
          </el-radio>
          <el-radio v-for="(item, index) in addItemsAll" :label="item.nameCn" :key="item.nameCn" class="check">
            <span v-if="item.code" :style="`background: ${item.code};display:inline-block;border:1px solid #ddd`"></span>
            <span :title="item.nameCn + ' ' + item.nameEn"> {{item.nameCn}} {{item.nameEn}}</span>
            <span class="delBtn" @click.stop="deleteAddItem(index)">
              <v-icon type="close-circle"></v-icon>
            </span>
          </el-radio>
        </el-radio-group>

        <div style="width:100%;margin-top:20px">
          <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="value">
              <el-input clearable size="small" v-model="ruleForm.value" placeholder="">
              </el-input>
            </el-form-item>
            <el-form-item prop="valueShort">
              <el-input clearable size="small" v-model="ruleForm.valueShort" placeholder="请输入标题缩写">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="add" size="small">确定</el-button>
            </el-form-item>
          </el-form>
        </div>
      </ul>
    </div>
    <div v-else>加载中...</div>
  </div>

</template>

<script>
import Vue from "vue";
import {
  Checkbox,
  CheckboxGroup,
  Input,
  Button,
  Form,
  FormItem
} from "element-ui";
import { fetchData, showToast, _storage } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";

Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);

export default {
  inheritAttrs: false,
  created() {
    let vm = this;
    let prop = this.$attrs.propertyName + "_" + this.$attrs.propertyId,
      propObj = _storage._get("session", "erp_add_props") || {};
    if (propObj[prop]) {
      propObj = propObj[prop];
      this.items = propObj.items;
      // 自定义的属性
      this.customItems = propObj.customItems;
      this.addItems = propObj.addItems;
      this.success = true;
      if (!this.$attrs.radio) {
        this.hasSelected = this.$attrs.selected.map(el => el.nameCn);
      } else {
        this.hasSelected = this.$attrs.selected;
      }
      if (this.$attrs.radio) {
        return;
      }

      this.addProp();
    } else {
      fetchData({
        ...apis.PRODUCT_PROPERTY_VALUE_LIST,
        data: {
          categoryPropertyId: this.$attrs.propertyId,
          productId: vm.$attrs.productId
        }
      }).then(res => {
        if (res.data.code !== 0) {
          this.success = true;
        }
        if (res.data.code === 0) {
          this.items = [];
          const { items, customItems } = res.data;
          this.success = true;
          this.items.push(
            ...items.map(el => ({
              nameCn: el.propertyValue,
              ...el,
              custom: false
            }))
          );
          this.customItems.push(
            ...customItems.map(el => ({ ...el, custom: true }))
          );
        }
      });
      if (!this.$attrs.radio) {
        this.hasSelected = this.$attrs.selected.map(el => el.nameCn);
      } else {
        this.hasSelected = this.$attrs.selected;
      }
      if (this.$attrs.radio) {
        return;
      }

      this.addProp();
    }
  },
  data() {
    return {
      rules: {
        value: [{ required: true, message: "请输入自定义值" }],
        valueShort: [{ required: true, message: "请输入自定义缩写" }]
      },
      ruleForm: {},
      inputVal: "",
      success: false,
      colorVal: "",
      selected: this.$attrs.selected || [],
      hasSelected: [],
      items: [],
      addItems: [],
      customItems: []
    };
  },
  computed: {
    allItems() {
      return [...this.items, ...this.addItems, ...this.customItems];
    },
    addItemsAll() {
      return [...this.addItems, ...this.customItems];
    }
  },
  methods: {
    change(v) {
      console.log("change", v);
      if (this.$attrs.radio) {
        this.selected = v;
      } else {
        v.forEach((element, index) => {
          if (!this.allItems.find(el => el.nameCn === element)) {
            v.splice(index, 1);
          }
        });
        this.selected = [];
        this.allItems.forEach(el => {
          if (v.find(i => el.nameCn === i)) {
            this.selected.push(el);
          }
        });
      }
    },
    ok() {
      console.log("ok");
      this.$root.$children[0].asyncModalVisible = false;
      this.$listeners.set(this.selected);
    },
    deleteAddItem(i) {
      this.addItems.splice(i, 1);
    },
    add() {
      const {
        info: { categoryId },
        propertyId: categoryPropertyId,
        propertyName
      } = this.$attrs;
      const { value, valueShort } = this.ruleForm;

      if (!this.allItems.find(el => el.nameCn === value)) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.addItems.push({
              custom: true,
              nameCn: value,
              nameEn: valueShort,
              code: "#fff",
              categoryId,
              categoryPropertyId,
              propertyName,
              valueShort
            });
          }
        });
      } else {
        showToast("warning", "存在相同名字的属性");
        return;
      }
    },
    saveProp(name, val) {
      // if (this.$attrs.radio) {
      //   return;
      // }
      let _cache = _storage._get("session", "erp_add_props") || {};
      console.log(_cache);
      _cache[name] = val;
      console.log(_cache);
      _storage.set("session", "erp_add_props", _cache);
    },
    addProp() {
      // if (this.$attrs.radio) {
      //   return;
      // }
      const saved = {
        items: this.items,
        selected: this.hasSelected,
        addItems: this.addItems,
        customItems: this.customItems
      };
      this.saveProp(
        this.$attrs.propertyName + "_" + this.$attrs.propertyId,
        saved
      );
    }
  },

  beforeDestroy() {
    this.addProp();
  }
};
</script>

<style lang="less">
.list {
  overflow: hidden;
  .ant-checkbox-wrapper {
    line-height: 3;
  }
}
.____checkColor_wrapper {
  .check {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    .delBtn {
      position: absolute;
      right: 20px;
      background: #fff;
      padding-left: 6px;
    }
  }

  .elCheck {
    width: 40%;
    display: flex;
    flex: none;
    align-items: center;
  }

  .el-radio-group {
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    .el-radio {
      display: block;
      line-height: 3;
      width: 25%;
      padding: 0;
      .el-radio__label {
        span {
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
      }
    }
    .el-radio + .el-radio {
      margin-left: 0;
    }
  }

  .el-checkbox-group {
    .el-checkbox {
      .el-checkbox__input {
        line-height: 0;
      }
      line-height: 3;
      vertical-align: middle;
      .el-checkbox__label {
        vertical-align: middle;
        span {
          vertical-align: middle;
          width: 20px;
          height: 20px;
        }
      }
    }
    display: flex;
    flex-wrap: wrap;
    label {
      display: block;
      padding: 0;
      margin: 0;
      width: 25%;
      padding-right: 40px;
    }
  }
}
</style>

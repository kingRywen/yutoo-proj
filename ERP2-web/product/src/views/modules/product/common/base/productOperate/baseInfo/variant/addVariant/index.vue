<template>
  <ElRow class="add-variant">
    <ElCol :span="24" style="border: 1px solid rgba(242, 242, 242, 1);">
      <t-form-item
        class="mgt custom-item"
        :list="variantList"
        type="multiple"
        :value.sync="addVariant.propertys"
        prop="propertys"
        label="选择变体属性:"
      ></t-form-item>
      <ElFormItem
        v-for="(item, index) in addVariant.propertyList"
        :key="index"
        type="custom"
        prop="bbb"
        :label="item.label"
        class="custom-item"
      >
        <div class="property-item" v-for="(j,idx) in item.list" :key="idx">
          {{j.labelCn}}
          <span class="close" @click="handleClose(index, idx)">
            <i class="el-icon-close"></i>
          </span>
        </div>
        <ElButton
          v-if="item.type == 'color' || item.type == 'size'"
          style="color:#C9C9C9"
          class="normal-btns"
          @click="handleChose(item.type)"
        >请选择</ElButton>
        <ElInput
          v-else
          v-model="item.input"
          class="normal-btns"
          @blur="handleBlur(index)"
          placeholder="请输入"
        ></ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton @click="$emit('addVariant',addVariant.propertyList)" :disabled="disabled">生成变体</ElButton>
      </ElFormItem>
    </ElCol>
  </ElRow>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    categoryId: {
      type: Number,
      default: null
    },
    value: {
      type: Object,
      default: () => [
        // {
        //   type: "color",
        //   label: "颜色",
        //   list: [
        //     {
        //       labelCn: "红色",
        //       value: 11
        //     },
        //     {
        //       labelCn: "绿色",
        //       value: 1
        //     }
        //   ]
        // },
        // {
        //   type: "size",
        //   label: "尺寸",
        //   list: [
        //     {
        //       labelCn: "大",
        //       value: 11
        //     },
        //     {
        //       labelCn: "小",
        //       value: 1
        //     }
        //   ]
        // },
        // {
        //   type: null,
        //   label: "xxxx",
        //   input: "",
        //   list: [
        //     {
        //       labelCn: "x",
        //       value: "x"
        //     },
        //     {
        //       labelCn: "xxx",
        //       value: "xxx"
        //     }
        //   ]
        // }
      ]
    }
  },
  data() {
    return {
      custom: (rule, value, callback) => {
        callback();
      },
      originProperty: []
    };
  },
  created() {
    this.originProperty = this.utils.clone(this.addVariant.propertyList);
  },
  watch: {
    "addVariant.propertyList": {
      deep: true,
      immediate: true,
      handler(val) {
        val.forEach((index, item) => {
          if (item.input) {
            item.list.push({
              labelCn: item.input,
              value: item.input,
              input: ""
            });
          }
        });
      }
    },
    "addVariant.propertys": {
      deep: true,
      handler(val) {
        let vm = this;
        vm.addVariant.propertyList.splice(val.length);
        let searchList = vm.utils.clone(vm.addVariant.propertyList);
        val.forEach((item, index) => {
          try {
            let label = null;
            if (searchList.find(i => i.labelId === item)) {
              label = searchList.find(i => i.labelId === item);
            }
            let obj = {
              label: label.label,
              labelId: label.labelId,
              type: null,
              list: label.list || []
            };
            if (label.label == "颜色") {
              obj.type = "color";
            } else if (label.label == "尺码") {
              obj.type = "size";
            } else {
              obj.input = "";
            }
            vm.addVariant.propertyList.splice(index, 1, obj);
          } catch (error) {
            let label = null;
            if (vm.variantList.find(i => i.value === item)) {
              label = vm.variantList.find(i => i.value === item);
            }
            let obj = {
              label: label.label,
              labelId: label.value,
              type: null,
              list: label.list || []
            };
            let choseDesc = null;
            if (vm.variantList.find(i => i.value == item)) {
              choseDesc = vm.variantList.find(i => i.value == item).desc;
            }
            if (choseDesc == "颜色") {
              obj.type = "color";
            } else if (choseDesc == "尺码") {
              obj.type = "size";
            } else {
              obj.input = "";
            }
            vm.addVariant.propertyList.splice(index, 1, obj);
          }
        });
      }
    }
  },
  computed: {
    ...mapState("common", ["variantList"]),
    addVariant: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    disabled: {
      get() {
        let vm = this;
        return (
          !this.addVariant.propertyList.every(item => item.list.length) ||
          !vm.utils.isArrLength(vm.addVariant.propertyList)
        );
      }
    }
  },
  methods: {
    handleBlur(index) {
      let len = this.addVariant.propertyList[index].list.length;
      this.addVariant.propertyList[index].list.push({ labelCn: "" });
      this.$set(
        this.addVariant.propertyList[index].list[len],
        "labelCn",
        this.addVariant.propertyList[index].input
      );
      this.$set(this.addVariant.propertyList[index], "input", "");
    },
    handleClose(index, idx) {
      this.addVariant.propertyList[index].list.splice(idx, 1);
    },

    handleChose(type) {
      let vm = this;
      if (type == "color") {
        vm._dialog({
          fullscreen: true,
          title: "选择颜色",
          component: () => import("../choseColor"),
          params: {
            getColorForm: colors => {
              vm.addVariant.propertyList.forEach((item, index) => {
                if (item.type == "color") {
                  let arr = colors.map(i => {
                    return {
                      labelCn: i.labelCn,
                      labelEn: i.labelEn,
                      value: i.value
                    };
                  });
                  vm.addVariant.propertyList[index].list.push(...arr);
                }
              });
            }
          }
        });
      } else {
        vm._dialog({
          fullscreen: true,
          title: "选择尺寸",
          component: () => import("../choseSize"),
          params: {
            getColorForm: sizes => {
              vm.addVariant.propertyList.forEach((item, index) => {
                if (item.type == "size") {
                  let arr = sizes.map(i => {
                    return {
                      labelCn: i.labelCn,
                      labelEn: i.labelEn,
                      value: i.value
                    };
                  });
                  vm.addVariant.propertyList[index].list.push(...arr);
                }
              });
            }
          }
        });
      }
    }
  }
};
</script>

<style lang='scss'>
.add-variant {
  .custom-item {
    .el-form-item__label {
      &::before {
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
  .normal-btns {
    width: 132px;
  }
  .property-item {
    width: 130px;
    height: 30px;
    line-height: 30px;
    border: 1px solid rgba(242, 242, 242, 1);
    display: inline-block;
    text-align: center;
    border-radius: 4px;
    position: relative;
    margin-right: 10px;
    .close {
      display: inline-block;
      position: absolute;
      top: -6px;
      right: 2px;
    }
  }
}
</style>
<template>
  <div class="dialog-com">
    <el-dialog
      :title="title"
      :visible.sync="visible"
      :width="width"
      @open="open"
      @close="close"
      append-to-body
      :fullscreen="fullscreen"
      left
      custom-class="way"
    >
      <el-scrollbar
        wrap-class="default-scrollbar__wrap"
        :style="{ height: height }"
        view-class="p20-scrollbar__view"
        ref="scroll"
      >
        <div>
          <component
            :is="comp"
            :reserveSelection="reserveSelection"
            v-bind="$attrs"
            v-on="$listeners"
            ref="com"
            :params="params"
          ></component>
        </div>
      </el-scrollbar>
      <template v-if="display" slot="footer">
        <span slot="footer" class="dialog-footer">
          <template v-for="(item, index) in footBtns">
            <el-button
              :loading="loading[index]"
              type="primary"
              :key="index"
              size="small"
              @click="handleSubmit(`${item.value}`,index)"
            >{{ item.name || "保存" }}</el-button>
          </template>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import moduleName from "vuex";
export default {
  name: "t-dialog",
  inheritAttrs: true,
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      title: "添加",
      visible: false,
      width: "500px",
      height: "100%",
      fullscreen: false,
      component: () => {},
      reserveSelection: "id",
      display: true,
      comp: () => {},
      loading: [],
      footBtns: [
        {
          name: "取消",
          value: "cancel"
        },
        {
          name: "保存",
          value: "submit"
        }
      ]
    };
  },
  watch: {
    $listeners: {
      deep: true,
      handler(val) {
        console.log(val);
      }
    }
  },
  async created() {
    let vm = this;
    if (typeof vm.component == "function") {
      await vm.component().then(data => {
        vm.comp = data.default;
      });
    }
    this.footBtns.forEach((item, index) => {
      vm.$set(vm.loading, index, false);
    });
  },
  mounted() {},
  methods: {
    handleSubmit(submitName, index) {
      let vm = this;
      if (submitName == "cancel") {
        vm.visible = false;
        return;
      }
      let data = vm.utils.clone(vm.$refs.com.form); // form表单的值
      let form = vm.$refs.com.$refs.form; // form 表单
      function validFn() {
        let result = null;
        if (!vm.$refs.com[submitName]) {
          console.warn(`表单${submitName}不存在`);
          vm.$set(vm.loading, index, false);
          return;
        }
        vm.utils.isFunction(vm.$refs.com[submitName]) &&
          (result = vm.$refs.com[submitName]());

        if (result === false) {
          vm.$set(vm.loading, index, false);
          return;
        }
        if (result === true) {
          vm.visible = false;
          vm.$set(vm.loading, index, false);
          return;
        }
        console.log(vm.utils);
        switch (vm.utils.dataType(result)) {
          case "Undefined":
            vm.$set(vm.loading, index, false);
            vm.visible = false;
            break;
          case "Promise":
            if (result.then) {
              result
                .then(() => {
                  vm.$set(vm.loading, index, false);
                  vm.visible = false;
                })
                .catch(err => {
                  console.log(err);
                  vm.$set(vm.loading, index, false);
                });
            } else {
              vm.$set(vm.loading, index, false);
              console.warn(`弹框${submitName}返回的不是一个对象或者Promise`);
            }
            break;
          case "Object":
            let { url = "", params = {}, cb = () => {} } = result;
            vm.$api[result.url](result.params)
              .then(data => {
                vm.$set(vm.loading, index, false);
                vm.visible = false;
                cb(data);
                return Promise.resolve(data);
              })
              .catch(() => {
                vm.$set(vm.loading, index, false);
                return Promise.reject();
              });
            break;
          default:
            vm.$set(vm.loading, index, false);
            console.warn(`弹框${submitName}返回的不是一个对象或者Promise`);
            break;
        }
        return Promise.resolve();
      }
      vm.$set(vm.loading, index, true);
      if (!data && !form) {
        validFn();
      } else if (data && form) {
        form.validate(valid => {
          if (valid) {
            validFn();
          } else {
            vm.$set(vm.loading, index, false);
          }
        });
      } else {
        console.warn("无法提交表单");
        vm.$set(vm.loading, index, false);
      }
    },
    close() {
      // !this.utils.isEmpty(this.$refs.com.form) &&
      //   (this.$refs.com.form = this.reset(this.$refs.com.form));
      this.$emit("close");
    },
    reset(obj) {
      let vm = this;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const item = obj[key];
          switch (vm.utils.dataType(item)) {
            case "Function":
              Reflect.set(obj, key, item);
              break;
            case "Object":
              Reflect.set(obj, key, {});
              break;
            case "Array":
              Reflect.set(obj, key, []);
              break;
            case "String":
              Reflect.set(obj, key, "");
              break;
            default:
              Reflect.set(obj, key, null);
              break;
          }
        }
      }
      return obj;
    },
    open() {}
  }
};
</script>

<style lang="scss">
.dialog-com {
  background: #fff;
  .p20-scrollbar__view {
    padding: 17px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    -o-box-sizing: border-box;
    -ms-box-sizing: border-box;
  }
  .default-scrollbar__wrap {
    overflow-x: auto;
    max-height: 560px;
    margin-right: 0 !important;
  }
  .el-scrollbar__view {
    margin-bottom: 10px;
  }
}
.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}
.el-dialog__body {
  border-bottom: 1px solid #ebeef5;
}
.dialog-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<template>
  <div class="remark">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      v-model="form"
      label-width="170px"
      :form-schema="dataFormSchema"
    ></new-form>
    <btns :btns="bottomBtns"></btns>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    bottomBtns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isDirty: false,
      form: {
        developRemark: null,
        productRemarkPath: null,
        packageType: null,
        purchaseRemark: null,
        imgRemarkPath: null,
        qcRemarkPath: null,
        shipmentRemarkPath: null
      },
      dataFormSchema: {
        developRemark: {
          label: "开发备注",
          widget: "textarea"
        },
        productRemarkPath: {
          label: "产品备注",
          widget: "editor"
        },
        packageType: {
          label: "打包备注",
          widget: "radio",
          options: [
            {
              label: "不需打包",
              value: 1
            },
            {
              label: "需自行打包",
              value: 2
            },
            {
              label: "需供应商打包",
              value: 3
            }
          ]
        },
        purchaseRemark: {
          label: "采购注意事项",
          widget: "textarea"
        },
        imgRemarkPath: {
          label: "图片处理注意事项",
          widget: "editor"
        },
        qcRemarkPath: {
          label: "质检注意事项",
          widget: "editor"
        },
        shipmentRemarkPath: {
          label: "发货打包注意事项",
          widget: "editor"
        }
      }
    };
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$set(this.editObj.remark, "form", val);
      }
    }
  },
  computed: {
    editObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  created() {
    let vm = this;
    vm.bottomBtns[1].show = false;
  },
  components: {
    btns: () => import("../common/btns")
  }
};
</script>

<style lang='scss'>
.remark {
  background: #fff;
}
</style>
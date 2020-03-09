<template>
  <div class="baseInfo">
    <el-tabs
      :tab-position="tabPosition"
      v-model="editableTabsValue"
      type="card"
      style="height: 200px;"
      :before-leave="beforeLeave"
    >
      <el-tab-pane label="变体" lazy>
        <span slot="label">
          <i v-if="!editObj.variant.mustInfoFlag" class="el-icon-warning-outline"></i>
          变体
        </span>
        <variant :key="indexKey" v-model="editObj" ref="variant" :bottomBtns="bottomBtns"></variant>
      </el-tab-pane>
      <el-tab-pane label="基本信息" lazy>
        <span slot="label">
          <i v-if="!editObj.base.mustInfoFlag" class="el-icon-warning-outline"></i>
          基本信息
        </span>
        <bases :key="indexKey" v-model="editObj" :bottomBtns="bottomBtns"></bases>
      </el-tab-pane>
      <el-tab-pane label="变体差异信息" lazy>
        <span slot="label">
          <i v-if="!editObj.variantDiffer.mustInfoFlag" class="el-icon-warning-outline"></i>
          变体差异信息
        </span>
        <variantDiffer :key="indexKey" v-model="editObj" :bottomBtns="bottomBtns"></variantDiffer>
      </el-tab-pane>
      <el-tab-pane label="组合SKU" lazy v-if="$route.query.combinationFlag">
        <span slot="label">组合SKU</span>
        <combinationInfo v-model="editObj" :bottomBtns="bottomBtns"></combinationInfo>
      </el-tab-pane>
      <el-tab-pane label="图片" lazy>
        <pictures v-model="editObj" :bottomBtns="bottomBtns"></pictures>
      </el-tab-pane>
      <el-tab-pane label="产品备注">
        <remark v-model="editObj" :bottomBtns="bottomBtns"></remark>
      </el-tab-pane>
      <el-tab-pane label="产品附件" lazy>
        <accessory :key="indexKey" v-model="editObj" :bottomBtns="bottomBtns"></accessory>
      </el-tab-pane>
      <el-tab-pane label="产品配件" lazy>
        <parts :bottomBtns="bottomBtns" v-model="editObj"></parts>
      </el-tab-pane>
      <el-tab-pane label="包装材料" lazy>
        <materials :bottomBtns="bottomBtns" v-model="editObj"></materials>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import variant from "./variant";
import bases from "./base";
import variantDiffer from "./variantDiffer";
import combinationInfo from "./combinationInfo";
import pictures from "./picture";
import remark from "./remark";
import accessory from "./accessory";
import parts from "./parts";
import materials from "./materials";
export default {
  inject: ["sourceType", "categoryId", "categoryDetail"],
  props: {
    id: {
      // 母体ID
      type: Number,
      default: null
    },
    path: {
      type: String,
      default: ""
    }
  },
  data() {
    let vm = this;
    return {
      indexKey: 0,
      tabPosition: "top",
      editableTabsValue: "0",
      editObj: {
        productRepoId: null,
        categoryId: vm.categoryId,
        variant: {
          mustInfoFlag: null, // 必填项是否填完
          nextFlag: true, // 下一步flag
          saveFlag: false, //保存flag
          submitFlag: false, // 提交flag
          parentRepoSku: "",
          addVariant: {
            propertys: [],
            propertyList: []
          },
          productVariantList: [],
          generateVariant: {
            title: [],
            list: []
          },
          deleteVariantIds: []
        },
        base: {
          mustInfoFlag: null,
          saveFlag: false,
          submitFlag: false,
          form: {
            nameCn: null,
            nameEn: null,
            variantTitleFlag: null,
            warehouseId: null,
            purchaseUserId: null,
            developUserId: null,
            productType: null,
            risktType: null,
            logisticType: null,
            plugFlag: null,
            brandId: null,
            platformIds: null,
            grossWeight: null,
            netWeight: null,
            weightUnit: null,
            singleLength: null,
            singleWidth: null,
            singleHeight: null,
            singleLengthUnit: null,
            packageLength: null,
            packageWidth: null,
            packageHeight: null,
            packageLengthUnit: null,
            lowestPrice: null,
            lowestPriceCurrency: null,
            presaleFlag: null,
            time: null,
            feature: null,
            list: null,
            overseaFlag: null,
            seoTitle: null,
            seoKeyword: null,
            seoDesc: null,
            presaleDate: null
          }
        },
        variantDiffer: {
          mustInfoFlag: null,
          saveFlag: false,
          submitFlag: false,
          form: {
            variantDifference: []
          }
        },
        combinationInfo: {
          form: [
            {
              variantId: 1,
              repoSku: "43455",
              variantProperties: "23454354332",
              combinationProduct: []
            }
          ]
        },
        picture: {
          form: {
            imgSource: 1,
            productRepoId: null
          }
        },
        remark: {
          submitFlag: false,
          form: {}
        },
        accessory: {
          form: {
            productRepoId: null
          }
        },
        parts: {
          form: {}
        }
      },
      bottomBtns: [
        {
          name: "取消",
          fn() {
            vm.$router.push("/product/common/base");
          }
        },
        {
          name: "下一步",
          fn() {
            if (vm.editObj.variant.mustInfoFlag) {
              let params = {
                sourceType: vm.sourceType,
                productRepoId: null,
                parentRepoSku: vm.editObj.variant.parentRepoSku,
                categoryIdList: [],
                categoryId: vm.categoryId,
                categoryDetail: vm.categoryDetail,
                addVariant: vm.editObj.variant.addVariant,
                generateVariant: vm.editObj.variant.generateVariant,
                deleteVariantIds: vm.editObj.variant.deleteVariantIds
              };
              // params.productVariantList = vm.$refs.variant.tableData;
              vm.$api[`product/prProductRepoVariantSave`](params).then(
                ({ productRepoId }) => {
                  if (productRepoId) {
                    vm.editObj.productRepoId = productRepoId;
                  }
                  vm.$set(vm.editObj.variant, "nextFlag", true);
                  vm.editableTabsValue = "1";
                }
              );
            } else {
              console.log("还没填完");
            }
          }
        },
        {
          name: "保存",
          disabled: true,
          fn() {
            let params = {
              productRepoId: vm.editObj.productRepoId,
              productRemark: vm.editObj.remark.form,
              essentialInfo: vm.editObj.base.form,
              variantDifference:
                vm.editObj.variantDiffer.form.variantDifference,
              saveType: 1
            };
            vm.$api[`product/prProductRepoSave`](params).then(() => {
              vm.$router.push("/product/common/base");
            });
          }
        },
        {
          name: "提交",
          disabled: true,
          fn() {
            let params = {
              productRepoId: vm.editObj.productRepoId,
              productRemark: vm.editObj.remark.form,
              essentialInfo: vm.editObj.base.form,
              variantDifference:
                vm.editObj.variantDiffer.form.variantDifference,
              saveType: 2
            };
            vm.$api[`product/prProductRepoSave`](params).then(() => {
              vm.$router.push("/product/common/base");
            });
          }
        }
      ]
    };
  },
  async created() {
    let vm = this;
    await vm.getVariantList({
      type: 1,
      productType: 1,
      id: vm.categoryId
    });
    if (
      vm.utils.isEmpty(this.$route.query.id) ||
      vm.utils.isEmpty(this.$route.query.path) ||
      vm.utils.isEmpty(this.$route.query.productRepoId)
    ) {
      return;
    }
    vm.editObj.productRepoId = +this.$route.query.productRepoId;
    vm.$api[`product/prProductRepoGet`]({
      productRepoId: vm.id
    }).then(({ rows }) => {
      let {
        combinationInfo,
        essentialInfo,
        productRemark,
        variantInfo,
        variantDifference,
        productRepoId
      } = rows;
      vm.editObj.productRepoId = productRepoId;
      vm.editObj.combinationInfo.form = combinationInfo;
      vm.editObj.remark.form = productRemark;
      let { addVariant, generateVariant, parentRepoSku } = JSON.parse(
        variantInfo
      );
      vm.editObj.variant.addVariant = vm.utils.clone(addVariant);
      vm.editObj.variant.generateVariant = generateVariant;
      vm.editObj.variant.parentRepoSku = parentRepoSku;
      vm.editObj.base.form = essentialInfo;
      vm.editObj.variantDiffer.form.variantDifference = variantDifference;
      vm.editObj.variant.nextFlag = true;
      return Promise.resolve();
    });
  },
  watch: {
    "editObj.productRepoId"(val) {
      this.productRepoId = val;
    },
    amendFlag(val) {
      this.$set(this.bottomBtns[2], "disabled", !val);
      this.$set(this.bottomBtns[3], "disabled", !val);
      this.$emit("amend", val);
    }
  },
  computed: {
    amendFlag: {
      get() {
        return (
          this.editObj.base.mustInfoFlag &&
          this.editObj.variantDiffer.mustInfoFlag
        );
      },
      // eslint-disable-next-line no-unused-vars
      set(val) {}
    },
    productRepoId: {
      get() {
        return this.id;
      },
      set(val) {
        this.$emit("update:id", val);
      }
    }
  },
  methods: {
    ...mapActions("common", ["getVariantList"]),
    // eslint-disable-next-line no-unused-vars
    beforeLeave(activeName, oldActiveName) {
      this.indexKey = Math.random();
      let vm = this;
      if (!vm.editObj.variant.nextFlag) {
        if (activeName == 0) {
          return true;
        }
        return false;
      } else {
        return true;
      }
    }
  },
  components: {
    variant,
    bases,
    variantDiffer,
    combinationInfo,
    pictures,
    remark,
    accessory,
    parts,
    materials
  }
};
</script>

<style lang='scss'>
.baseInfo {
  background: #fff;
  .el-tabs {
    height: 100% !important;
  }
}
</style>
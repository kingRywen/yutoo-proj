<template>
  <div class="purchase-info">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="变体状态" name="1">
        <span slot="label">
          <!-- <i class="el-icon-warning-outline"></i> -->
          变体状态
        </span>
        <VariantState :productRepoId="id" />
      </el-tab-pane>
      <el-tab-pane label="采购价格" name="2" :lazy="true">
        <span slot="label">
          <!-- <i class="el-icon-warning-outline"></i> -->
          采购价格
        </span>
        <procurementPrice :productRepoId="id" />
        <!-- <btns :btns='btns'></btns> -->
      </el-tab-pane>
      <el-tab-pane label="产品图片" name="3" :lazy="true">
        <productImg :productRepoId="id" v-model="editObj" />
      </el-tab-pane>
      <el-tab-pane label="报关信息" name="4">
        <span slot="label">
          <i class="el-icon-warning-outline" v-if="isComplete1"></i>
          报关信息
        </span>
        <customsInfor :productRepoId="id" ref="customsInfor" :isComplete1.sync="isComplete1" />
        <btns :btns="btns"></btns>
      </el-tab-pane>
      <el-tab-pane label="变体差异信息" name="5">
        <span slot="label">
          <i class="el-icon-warning-outline" v-if="isComplete2"></i>
          变体差异信息
        </span>
        <variationInfor :categoryId="categoryId" ref="variationInfor" v-model="editObj" />
        <btns :btns="btns"></btns>
      </el-tab-pane>
      <el-tab-pane label="原材料" name="6" :lazy="true">
        <rawMaterial :productRepoId="id" />
      </el-tab-pane>
      <el-tab-pane label="产品头程" name="7" :lazy="true">
        <productFirstLeg :productRepoId="id" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { Promise } from "q";
export default {
  components: {
    VariantState: () => import("./VariantState/index"),
    procurementPrice: () => import("./procurementPrice/index"),
    productImg: () => import("./productImg/index"),
    customsInfor: () => import("./customsInfor/index"),
    variationInfor: () => import("./variationInfor/index"),
    productFirstLeg: () => import("./productFirstLeg/index"),
    rawMaterial: () => import("./rawMaterial/index"),
    btns: () => import("./common/btns")
  },
  inject: ["categoryId"],
  props: {
    id: {
      // 母体ID
      type: Number,
      default: null,
      required: true
    }
  },
  data() {
    let vm = this;
    return {
      activeName: "3",
      btns: [
        {
          name: "取消",
          type: "primary",
          plain: true,
          fn() {}
        },
        {
          name: "保存",
          type: "primary",
          plain: false,
          fn() {
            return vm.saveBtn(1);
          }
        },
        {
          name: "提交",
          plain: false,
          type: "success",
          fn() {
            return vm.saveBtn(2);
          }
        }
      ],
      editObj: {
        productRepoId: vm.id,
        categoryId: vm.categoryId,
        variantDiffer: {
          mustInfoFlag: null,
          saveFlag: false,
          submitFlag: false,
          form: {}
        },
        picture: {
          form: {
            imgSource: 2,
            productRepoId: null
          }
        }
      },
      isComplete1: true,
      isComplete2: true
    };
  },
  methods: {
    handleClick() {},
    saveBtn(saveType) {
      let arr = [];
      arr.push(this.$refs.customsInfor.saveBtn());
      arr.push(this.$refs.variationInfor.saveBtn());
      Promise.all(arr)
        .then(res => {
          console.log(res);
          return;
          this.$api[`product/prProductRepoPurchaseSave`]({
            productRepoId: this.productRepoId,
            variantDifference: res[1].variantDifference,
            declareInfo: res[0].declareInfo,
            saveType: saveType
          }).then(data => {});
        })
        .catch(err => {
          console.log(err);
          this.$message.warning("请完整填写信息");
        });
    }
  },
  watch: {
    id(val) {
      if(val ==0 || val) {
        this.editObj.productRepoId = val
      }
    }
  },
  created() {
    console.log(this.id);
  }
};
</script>

<style lang='scss'>
.purchase-info {
  background: #fff;
}
</style>
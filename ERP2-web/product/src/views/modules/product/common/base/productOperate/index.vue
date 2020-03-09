<template>
  <div class="product-operate">
    <el-tabs v-model="activeName" @tab-click="handleClick" lazy>
      <el-tab-pane label="基本信息" name="基本信息">
        <crumbs>
          {{path}}
          <ElButton style="margin-left: 10px;" size="mini" disabled @click="handleAmend">修改</ElButton>
          <!-- <ElButton
            style="margin-left: 10px;"
            size="mini"
            :disabled="amendFlag"
            @click="handleAmend"
          >修改</ElButton>-->
        </crumbs>
        <base-info @amend="val => amendFlag = !val" :path="path" :id.sync="productRepoId"></base-info>
      </el-tab-pane>
      <el-tab-pane label="采购信息" name="采购信息" :lazy="true">
        <crumbs>{{path}}</crumbs>
        <purchase-info :id="productRepoId"></purchase-info>
      </el-tab-pane>
      <el-tab-pane v-if="audit" label="审核" name="审核" :lazy="true">
        <audit></audit>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import baseInfo from "./baseInfo";
import purchaseInfo from "./purchaseInfo";
import crumbs from "./crumbs";
import audit from "./audit";
export default {
  provide: {
    sourceType: 1,
    categoryId: null,
    categoryDetail: null
  },
  data() {
    return {
      activeName: "基本信息",
      productRepoId: null,
      path: "",
      amendFlag: true,
      audit: null
    };
  },
  created() {
    let { id, path, audit, productRepoId } = this.$route.query; // id 类目id   path类目path   audit审核flag  productRepoId 母体ID
    this.productRepoId = +productRepoId;
    if (audit) {
      this.audit = audit;
      this.activeName = "审核";
    }
    this._provided.categoryId = +id;
    this._provided.categoryDetail = path;
    this.path = path.split(":").join(">");
  },
  watch: {
    productRepoId(val) {
      console.log(val);
    }
  },
  methods: {
    handleClick() {},
    handleAmend() {
      console.log("我要修改了");
    }
  },
  components: {
    baseInfo,
    purchaseInfo,
    crumbs,
    audit
  }
};
</script>

<style lang='scss'>
.product-operate {
  background: #fff;
}
</style>
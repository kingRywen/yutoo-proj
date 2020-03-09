<template>
  <div class="productHeaderEditing">

    <div>
      <span>到达国家：</span>{{item.transportItem.nationName}}</div>
    <div>
      <span>{{item.priceType === 1 ? '产品净重（g）': '产品重量（g）'}}：</span>{{item.priceType === 1 ? item.transportItem.productWeight : item.transportItem.nw }}</div>
    <div>
      <span>产品体积（cm³）：</span>{{item.transportItem.productVolume}}</div>
    <div>
      <span>报关价格（RMB）：</span>{{item.transportItem.entryPrice}}</div>
    <div>
      <span>单个运费（RMB）:</span>
      <v-input v-model="item.transportItem.freightPriceSingle"></v-input>
    </div>
    <div>
      <span> 单个税费（RMB）:</span>
      <v-input v-model="item.transportItem.taxesSingle"></v-input>
    </div>
  </div>
</template>

<script>
import apis from "apis";
import { fetchData, showToast } from "common/common";

export default {
  inheritAttrs: false,
  props: ["item"],
  data() {
    return {};
  },
  methods: {
    ok() {
      // this.$listeners.set(this.ruleForm)
      fetchData({
        ...apis.PRODUCT_TRANSPORT_REL_UPDATE,
        data: { ...this.item.transportItem }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", "编辑成功");
          this.$root.$children[0].asyncModalVisible = false;
        } else {
          showToast("error", "编辑失败");
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  font-size: 14px;
}
.productHeaderEditing {
  display: flex;
  flex-direction: column;
  div {
    display: flex;
    margin: 12px 0;
    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 160px;
    }
  }
}
</style>

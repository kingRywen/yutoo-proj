export default {
  methods: {
    // 添加深度分析
    addDepth({ categorys, pcid }) {
      let params = { ...this.storeInfo, categorys, pcid };
      return this.$api[
        `proPick/${
          categorys
            ? "categoryDepthTaskMerchantBatchSave"
            : "categoryDepthTaskMerchantSave"
        }`
      ](params);
    }
  }
};

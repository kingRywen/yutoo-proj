export default {
  computed: {
    relatedId() {
      return this.productId || this.categoryId;
    },
    categoryFlag() {
      return this.productId == null;
    }
  },
  // 公有方法
  methods: {
    delKeywords(keywordIds, iscategoryId = true) {
      let params = iscategoryId
        ? { categoryId: this.categoryId }
        : { relatedId: this.relatedId, categoryFlag: this.categoryFlag };
      this.showTips({ msg: "此操作将删除数据, 是否继续?" }, () => {
        return this.$api[`keyword/keywordLibRemoveKeyword`]({
          ...this.storeInfo,
          ...params,
          keywordIds
        });
      });
    },
    copyKeywords(text) {
      this.$copyText(text)
        .then(() => {
          this.$message.success("复制成功");
        })
        .catch(() => {
          this.$message.error("复制失败，请重试");
        });
    },
    // 移动类型,CORE:核心词；LONG:长尾词；OTHER:其他词；
    // pritivate :是否否定词类型
    moveKeywords(keywordIds, movedKeywordType) {
      let api = "keywordLibMoveKeyword";
      this.showTips({ msg: "此操作将移动关键词, 是否继续?" }, () => {
        let params = {
          ...this.storeInfo,
          relatedId: this.relatedId,
          categoryFlag: this.categoryFlag,
          movedKeywordType,
          keywordTexts: keywordIds
        };
        return this.$api[`keyword/${api}`](params);
      });
    }
  }
};

export default {
  methods: {
    getParents(sel) {
      return sel.filter((el) =>
        this.searchData.displayType ? el._level == 1 : false
      );
    },
    cleanData(sel) {
      sel = sel.map((e) => ({
        ...e,
        parent: null,
        childrens: null,
        buttonList: undefined,
      }));
      return sel;
    },
    getChilds(sel) {
      return sel.filter((el) =>
        this.searchData.displayType ? !(el._level == 1) : true
      );
    },

    getAsins(parent) {
      return parent.map((e) => e.asin);
    },
    // 只能选择父的就自动过滤子的
    selectA(sel) {
      if (this.searchData.displayType) {
        // 父视图
        let parent = this.getParents(sel);
        if (parent.length) {
          return this.getAsins(parent);
        } else {
          this.$message.warning("只能选择父产品进行操作");
        }
      }
    },
    // 某些选择父能操作子的，前端传父但是后台 自动 转换为子的，子直接 传递
    selectB(sel) {
      // return getAsins(sel)
      if (this.searchData.displayType) {
        // 父视图
        let parent = this.getAsins(this.getParents(sel));
        let childs = this.getAsins(
          this.getChilds(sel).filter((e) => parent.indexOf(e.parent.asin) == -1)
        );
        return [...parent, ...childs];
      } else {
        return this.getAsins(sel);
      }
    },
    // 只能选择子的就自动过滤父的
    selectC(sel, origin = true) {
      let childs = this.getChilds(sel);
      if (!childs.length) {
        this.$message.warning("只能选择子产品进行操作");
        return;
      }
      if (origin) {
        return this.cleanData(childs);
      }
      return this.getAsins(childs);
    },
  },
};

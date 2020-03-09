<template>
  <yt-form ref="form" label-width="100px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ["params"],
  data() {
    let vm = this;
    let pages = new Array(10)
      .toString()
      .split(",")
      .map((el, index) => ({ label: index + 1, value: index + 1 }));

    return {
      formData: {
        dataType: 0
      },
      activeFields: [
        {
          label: "数据源",
          name: "popularFlag",
          span: 24,
          type: "select",
          required: true,
          options: [
            {
              label: "衰款",
              value: 0
            },
            {
              label: "爆款",
              value: 1
            }
          ]
        },
        {
          label: "类目",
          // name: 'productCategoryGetCategory',
          name: "pcId",
          span: 24,
          placeholder: "请选择类目",
          options: vm.loadTree,
          bind: {
            label: "name",
            value: "pcid",
            children: "childs",
            enabled: "enabled"
          },
          type: "cascader",
          last: false,
          required: true
        },
        {
          label: "搜索页数",
          name: "searchPages",
          type: "select",
          options: pages,
          span: 24,
          required: true
        },
        {
          label: "按类目",
          name: "categoryType",
          span: 24,
          type: "select",
          required: true,
          options: [
            {
              label: "大类",
              value: 0
            },
            {
              label: "小类",
              value: 1
            }
          ]
        },
        {
          label: "BSR最小值",
          name: "minRank",
          span: 12,
          required: false
        },
        {
          label: "BSR最大值",
          span: 12,
          name: "maxRank",
          required: false
        },
        {
          label: "任务名称",
          name: "taskName",
          span: 24,
          required: true
        }
      ]
    };
  },
  methods: {
    loadTree(id = [0], selEl, itemDisabled) {
      if (!selEl) {
        selEl = {
          pcid: 0
        };
      }
      let { pcid } = selEl;
      let params = {
        parentPcid: pcid,
        siteId: this.siteId,
        platformId: this.platformId
      };
      return this.$api[`productCategoryGetCategory`](params)
        .then(data => {
          if (data && data.code && data.code !== 0) {
            this.$message.error(data.msg);
            return;
          }

          return data.data.map(el => {
            return {
              ...el,
              childs: el.haveChildren ? [] : null,
              enabled: true,
              isLeaf: !el.haveChildren
            };
          });
        })
        .catch(() => {});
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let {
          popularFlag,
          pcId,
          searchPages,
          categoryType,
          minRank,
          maxRank,
          taskName
        } = this.formData;
        pcId = pcId.slice(0).pop()
        let { platformId, sellerId, siteId } = this.sellerData;
        return this.$api[`taskSelAttrSaveCategory`]({
          platformId,
          sellerId,
          siteId,
          popularFlag,
          pcId,
          searchPages,
          categoryType,
          minRank,
          maxRank,
          taskName
        }).then(data => {
          GLOBAL.vbus.$emit('addCate.refreshTree',pcId)
          return true;
        });
      });
    }
  }
};
</script>

<style>
</style>

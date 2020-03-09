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
          label: "类目名称",
          name: "name",
          span: 24,
          required: true
        }
      ]
    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { name } = this.formData;
        let { platformId, sellerId, siteId } = this.sellerData;
        return this.$api[`selAttrCategorySave`]({
          name,
          platformId,
          sellerId,
          siteId,
          parentCateId: this.params.cateId
        }).then(data => {
          GLOBAL.vbus.$emit('addCate.refreshTree',{parentCateId:this.params.cateId,name})
          return true;
        });
      });
    }
  }
};
</script>

<style>
</style>

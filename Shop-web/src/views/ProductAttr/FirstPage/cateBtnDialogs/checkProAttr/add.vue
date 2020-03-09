<template>
  <yt-form ref="form" label-width="120px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ["params"],
  data() {
    return {
      formData: {
        sameAttrFlag: 0
      },
      options: []
    };
  },
  computed: {
    activeFields() {
      return [
        {
          label: "属性名称",
          name: "cusAttrKey",
          span: 24,
          maxlength: 5,
          required: true
        },
        {
          label: "关联亚马逊属性",
          name: "attrKey",
          filterable: true,
          type: "select",
          options: this.options,
          span: 24,
          // required: true
        },
        {
          label: "是否同款属性",
          name: "sameAttrFlag",
          type: "switch",
          options: this.options,
          span: 24,
          required: false
        }
      ];
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      const { name, parentName } = this.params;
      let params = {
        name,
        parentName
      };
      this.$api[`sameAttrConfigDetailListAttrAmazon`](params)
        .then(data => {
          this.options = data.data.map(el => ({
            label: el.attrKey,
            value: el.attrKey
          }));
        })
        .catch(() => {});
    },
    _initData() {
      if (this.params && this.params.edit) {
        this.getInfo();
      }
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        const { name, parentName } = this.params;
        const params = {
          sellerId: this.sellerId,
          siteId: this.siteId,
          name,
          parentName,
          ...this.formData
        };
        return this.$api[`sameAttrConfigDetailSave`](params);
      });
    },
    getInfo() {
      const { name, parentName } = this.params;
      const params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        name,
        parentName,
        attrId: this.params.attrId
      };
      this.$api[`sameAttrConfigDetailDetail`](params)
        .then(data => {
          const { sameAttrFlag, attrKey, cusAttrKey } = data.data;
          this.formData = { sameAttrFlag, attrKey, cusAttrKey };
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
</style>

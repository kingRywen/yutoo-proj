<template>
  <yt-form ref="form" label-width="140px" :fields="activeFields" :formData="formData"></yt-form>
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
      formData: {},
      activeFields: [
        {
          label: "广告占比高于(%)",
          name: "advertProportion",
          span: 24,
          required: false
        },
        {
          label: "利润低于(%)",
          name: "profitProportion",
          span: 24,
          required: false
        }
      ]
    };
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { advertProportion, profitProportion } = this.formData;
        let { sellerId, siteId } = this.sellerData;
        return this.$api[`productInfoConfigSave`]({
          advertProportion: advertProportion / 100,
          profitProportion: profitProportion / 100,
          sellerId,
          siteId
        }).then(data => {
          return true;
        });
      });
    },
    _initData(){
      this.$api['productInfoConfigInfo']({
        ...this.params
      })
      .then(data => {
        this.formData.advertProportion=data.data.advertProportion*100;
        this.formData.profitProportion=data.data.profitProportion*100;
      })
    },
  }
};
</script>

<style>
</style>

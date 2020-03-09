<template>
  <div class="add-variant-property">
    <propertySettings
      :systemCategoryId="params.categoryId"
      :childFlag="true"
      ref="propertySettings"
    ></propertySettings>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  methods: {
    submit() {
      let vm = this;
      return vm.$refs.propertySettings._submit().then(() => {
        vm.params.change();
        return Promise.resolve();
      });
    }
  },
  components: {
    propertySettings: () => import("Components/propertySettings/index.vue")
  }
};
</script>

<style lang='scss'>
.add-variant-property {
  background: #fff;
}
</style>
<template>
  <div class="add-accessory">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      v-model="form"
      label-width="170px"
      :form-schema="dataFormSchema"
    ></new-form>
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
    return {
      isDirty: false,
      form: {
        annexList: [],
        variantIds: []
      },
      dataFormSchema: {
        variantIds: {
          label: "选择SKU",
          widget: "select",
          multi: true,
          options: []
        }
      }
    };
  },
  mounted() {
    let vm = this;
    vm.$api[`product/prProductRepoVariantGetComboBox`]({
      productRepoId: vm.params.productRepoId
    }).then(({ rows }) => {
      let options = rows.map(item => {
        return {
          label: item.repoSku,
          value: item.productRepoId
        };
      });
      vm.dataFormSchema = {
        ...vm.dataFormSchema,
        ...{
          variantIds: {
            label: "选择SKU",
            widget: "select",
            multi: true,
            options
          }
        }
      };
    });
  },
  methods: {
    submit() {
      let vm = this;
      let data = vm.utils.clone(vm.form);
      data.annexList = data.annexList.map(item => {
        return {
          annexName: item.name,
          annexPath: item.url,
          annexSize: item.size
        };
      });
      return vm.$api[`product/prProductRepoAnnexSingleSave`]({
        ...data,
        productRepoAttachmentRelId: vm.params.productRepoAttachmentRelId
      }).then(() => {
        vm.params.getList();
      });
    }
  }
};
</script>

<style lang='scss'>
.add-accessory {
  background: #fff;
}
</style>
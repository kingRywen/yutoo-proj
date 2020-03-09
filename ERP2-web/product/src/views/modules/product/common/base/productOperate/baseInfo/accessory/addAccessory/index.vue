<template>
  <div class="add-related">
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
        annexList: []
      },
      dataFormSchema: {
        annexList: {
          label: "上传文件",
          widget: "upload",
          action: "https://jsonplaceholder.typicode.com/posts/",
          limitSize: 0.5,
          fileLimit: ["excel"]
        }
      }
    };
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
.add-related {
  background: #fff;
}
</style>
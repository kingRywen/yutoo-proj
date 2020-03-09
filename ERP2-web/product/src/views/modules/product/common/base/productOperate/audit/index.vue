<template>
  <div class="audit">
    <new-form
      ref="form"
      :is-dirty.sync="isDirty"
      :valid-success.sync="validSuccess"
      v-model="form"
      label-width="100px"
      :form-schema="dataFormSchema"
    ></new-form>
    <div style="display:flex;justify-content: center;margin-top: 60px;">
      <ElButton style="width: 200px" size="small" type @click="handleSureAudit">确认审核</ElButton>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDirty: false,
      form: {},
      validSuccess: false,
      dataFormSchema: {
        input1: {
          widget: "radio",
          label: "审核",
          span: 12,
          options: [
            { label: "审核通过", value: 1 },
            { label: "审核不通过", value: 0 }
          ]
        },
        input2: {
          widget: "textarea",
          label: "审核原因"
        }
      }
    };
  },
  methods: {
    handleSureAudit() {
      console.log("审核");
    }
  }
};
</script>

<style lang='scss'>
.audit {
  background: #fff;
}
</style>
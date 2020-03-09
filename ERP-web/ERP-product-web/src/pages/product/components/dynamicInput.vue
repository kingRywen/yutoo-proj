<template>
  <div>

    <div v-if="isInput">
      <InitInput v-if="$attrs.type === 'num'" :min="1" :value.sync="value"></InitInput>
      <v-input v-else-if="$attrs.type !== 'num' && $attrs.type !== 'double'" :value="value" style="width:120px" size="small" @input="val=> value = val"></v-input>
      <template v-else-if="$attrs.type === 'double'">
        <v-form :model="ruleForm" ref="ruleForm" :rules="rules" class="__dynamicInput_form">
          <v-form-item prop="startNum">
            <InitInput :min="1" :value.sync="ruleForm.startNum"></InitInput>
          </v-form-item>~
          <v-form-item prop="endNum">
            <InitInput :min="1" :value.sync="ruleForm.endNum"></InitInput>
          </v-form-item>
        </v-form>
      </template>

      <v-button type="primary" size="small" @click="edit" :loading="loading">修改</v-button>
      <v-button size="small" @click="cancel">取消</v-button>
    </div>
    <span v-else>{{ $attrs.type === 'double' ? ruleForm.startNum === ruleForm.endNum ? `${ruleForm.startNum}` : `${ruleForm.startNum}-${ruleForm.endNum}` : value }}</span>
  </div>
</template>

<script>
import InitInput from "components/base/initInput.vue";

export default {
  inheritAttrs: false,
  components: {
    InitInput
  },
  props: ["text", "item"],
  data() {
    const checkStart = (rule, value, callback) => {
      if (!~~value) {
        callback(new Error("数量不能为0"));
      }
      if (value < 0) {
        callback(new Error("数量不能为负数"));
      }
      if (~~this.ruleForm.endNum && value > this.ruleForm.endNum) {
        callback(new Error("必须小于结尾数量"));
      }
      callback();
    };
    const checkEnd = (rule, value, callback) => {
      if (!~~value) {
        callback(new Error("数量不能为0"));
      }
      if (value < 0) {
        callback(new Error("数量不能为负数"));
      }
      if (~~this.ruleForm.startNum && value < this.ruleForm.startNum) {
        callback(new Error("必须大于开始数量"));
      }
      callback();
    };
    let startNum;
    let endNum;
    if (typeof this.text === "string") {
      const _v = this.text.split("-");
      startNum = +_v[0];
      endNum = +_v[1];
    }

    return {
      value: this.text,
      loading: false,
      ruleForm: {
        startNum,
        endNum
      },
      rules: {
        startNum: [
          {
            required: true,
            validator: checkStart
          }
        ],
        endNum: [
          {
            required: true,
            validator: checkEnd
          }
        ]
      }
    };
  },
  methods: {
    edit() {
      if (this.$attrs.type === "double") {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.loading = true;
            this.$emit("edit", this);
          }
        });
      } else {
        this.loading = true;
        this.$emit("edit", this);
      }
    },
    onchange(val) {
      console.log(val);
      this.value = 1;
    },
    cancel() {
      this.value = this.text;
      this.loading = false;
      this.$emit("cancel", this.value);
    }
  },
  computed: {
    isInput() {
      return this.$attrs.isInput;
    }
  },
  watch: {
    ruleForm: {
      deep: true,
      handler(val) {
        this.$refs.ruleForm.validate();
      }
    }
  }
};
</script>

<style lang="scss">
.__dynamicInput_form {
  display: inline-block;
  .ant-form-item {
    margin-right: 0;
  }
}
</style>

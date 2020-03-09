<template>
  <el-input @clear="$emit('clear')" v-if="data.type == null" :placeholder="data.placeholder" :value="value" @input="handlerInput" clearable style='max-width:150px;'>
  </el-input>
  <el-cascader v-else-if="data.type" @clear="$emit('clear')" clearable :placeholder="data.placeholder" change-on-select style="width:160px;margin-right:6px;line-height: 28px;" :options="data.type === 2 ?keywordGroupList : productGroupList" :props="addProjectFormOpts" :value="value" @input="val => $emit('input', val)"></el-cascader>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { debounce } from "throttle-debounce";
export default {
  props: {
    value: [String, Array, Object, Number],
    data: {
      type: Object,
      default: () => {
        placeholder: "请输入";
      }
    }
  },
  computed: {
    ...mapGetters("myAttention", ["keywordGroupList", "productGroupList"])
  },
  data() {
    return {
      addProjectFormOpts: {
        value: "groupId",
        label: "groupName",
        children: "groupingVOS"
      }
    };
  },
  created() {
    this.deEmitInput = debounce(300, false, this.search);
  },
  methods: {
    handlerInput(val) {
      this.deEmitInput(val);
    },
    search(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style>
</style>

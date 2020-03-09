<!--  -->
<template>
    <div>
        <el-cascader placeholder="搜索类目（为空时默认根目录）" :options="options" :show-all-levels="true" :props="props" v-model="ids" change-on-select style="width:100%;" clearable size="mini" :filterable="filterable"></el-cascader>
    </div>
</template>

<script>
export default {
  components: {},
  props: {
    options: {
      default: null
    },
    filterable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ids: [],
      props: {
        value: "cusCateId",
        children: "childList",
        label: "cusCateName"
      }
    };
  },

  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {
    ids(val) {
      this.$store.commit("CateSetup/CateIds", val);
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

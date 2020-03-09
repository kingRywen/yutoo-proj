<!-- 日期选择器组件,有开始和结束的 -->
<template>
  <div>
    <div class="block">
      <el-date-picker unlink-panels style="max-width:240px;" @change="changeTime" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: "datePick",
  components: {},
  props: {
    DateMsg: {},
    changeTime: {}
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {
    //向父组件传递日期
    "DateMsg.DateValue"(newvla, value) {
      this.$emit("chart3-date", newvla);
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

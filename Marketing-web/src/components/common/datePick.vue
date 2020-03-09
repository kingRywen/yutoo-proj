<!-- 日期选择器组件,有开始和结束的 -->
<template>
  <div>
    <div class="block">
      <!-- 单个日期选择 onlyOneYear_ForOneSelect-->
      <el-date-picker v-if="onlyOne" :picker-options="onlyOneYear_ForOneSelect" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
      </el-date-picker>
      <!-- 两个日期 onlyOneYear-->
      <el-date-picker v-else :picker-options="onlyOneYear" unlink-panels :style="{width:DateMsg.width}" v-model="DateMsg.DateValue" value-format='yyyy-MM-dd' :type="DateMsg.type" placeholder="选择日期" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false">
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
    onlyOne: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // date: []
    };
  },
  created() {},
  mounted() {
    // this.date = this.DateMsg.DateValue;
  },
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

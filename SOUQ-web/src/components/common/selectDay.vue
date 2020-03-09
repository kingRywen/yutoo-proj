<!-- 按日按周按月 此处是实现双向props绑定的一个例子 -->
<template>
  <div>
    <!-- 按日，按周按月分 -->
    <el-select v-model="propsValue" style="width:80px;margin-left:10px;">
      <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "day",
  components: {},
  props: {
    dayOptions: {},
    value: {
      type: String
    }
  },
  data() {
    return {
      propsValue: this.value // 上面绑定的v-modle是data中新定义的一个变量。接住props上面的一个变量。然后先watch  这个props的变量的变化，动态改变data中的变量。data中的变量改变了。dom自然改变，实现了子组件的更新。2.继续再写一个watch 监控data中的变量的变化，动态传输至给父组件。实现父组件的数据的动态变化
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 切换按日，按周，按月
  },
  computed: {},
  watch: {
    value(newval) {
      this.propsValue = newval;
    },
    propsValue(newval) {
      this.$emit("chart3-day", newval);
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

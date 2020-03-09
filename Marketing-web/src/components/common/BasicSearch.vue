<template>
  <el-row type="flex" justify="space-between" style="height:30px">
    <!-- 输入框 -->
    <el-col :lg="{span:10}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
      <BasicForms v-for="input in inputs" :data="input" v-model="ruleForm[input.key]" />
      <el-button type="primary" icon="el-icon-search" @click="$emit('search', ruleForm)">搜索</el-button>
    </el-col>
    <!-- 时间段选择 -->
    <el-col :lg="{span:14}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
      <el-date-picker unlink-panels v-model="date" start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期" type="daterange" style="max-width: 240px;"></el-date-picker>
      <el-radio-group v-model="radio" @change="handleRadioChange">
        <el-radio-button :label="0">今日</el-radio-button>
        <el-radio-button :label="7">7天</el-radio-button>
        <el-radio-button :label="30">30天</el-radio-button>
      </el-radio-group>
    </el-col>
  </el-row>
</template>

<script>
import BasicForms from "./BasicForms";

export default {
  name: "BasicSearch",
  props: {
    inputs: {
      type: Array,
      default: () => []
    }
  },
  components: {
    BasicForms
  },
  data() {
    return {
      ruleForm: {},
      date: "",
      radio: null
    };
  },
  methods: {
    search(val) {
      this.$emit("search", val);
    },
    reset(groupId) {
      this.ruleForm = {
        groupId
      };
      this.radio = null;
      this.date = "";
    },
    useWhichTabs() {},
    getChildDate() {},
    // 切换快捷日期选择
    handleRadioChange(val) {
      this.setRangeDate(this.$.getRangeDay(val));
    },
    // 设置日期选择
    setRangeDate(arr) {
      if (!arr) {
        return (this.date = "");
      }
      this.date = arr;
    }
  },
  watch: {
    date: {
      immediate: true,
      handler(val) {
        const day1 = this.$.getRangeDay(1);
        const day7 = this.$.getRangeDay(7);
        const day30 = this.$.getRangeDay(30);
        const [first, last] = val || [];
        console.log(first, last, day1, day7, day30);
        this.$set(this.ruleForm, "startTime", first);
        this.$set(this.ruleForm, "endTime", last);

        // 根据日期选择label高亮
        if (!first) {
          this.radio = null;
        } else if (first === day7[0] && last === day7[1]) {
          this.radio = 7;
        } else if (first === day30[0] && last === day30[1]) {
          this.radio = 30;
        } else if (first === day1[0] && last === day1[1]) {
          this.radio = 0;
        } else {
          this.radio = null;
        }
      }
    },
    ruleForm: {
      deep: true,
      immediate: true,
      handler(val) {
        this.search(val);
      }
    }
  }
};
</script>

<style scoped>
</style>

<template>
  <transition name="fade">
    <div @click.stop.self class="query-box" v-show="pDialogVisible" ref="dialogVisible">
      <el-date-picker  unlink-panels v-model="daterange" size="medium" placeholder="选择日期" :picker-options="pickerOptionsToday" value-format="yyyy-MM-dd" v-if="pType==='daterange'">
      </el-date-picker>

      <el-date-picker  unlink-panels v-model="daterangeRight" size="medium" placeholder="选择日期" :picker-options="pickerOptionsYesterday" value-format="yyyy-MM-dd" v-else-if="pType==='daterangeRight'">
      </el-date-picker>
      <span style="margin-left: 6px">
        <el-button @click="handleFilter" size="medium" type="success">搜索</el-button>
      </span>
      <span style="margin-left: 6px">
        <el-button size="medium" @click="handleCancel" type="danger">取消</el-button>
      </span>

    </div>
  </transition>
</template>
<script>
export default {
  props: ["pDialogVisible", "pClientXY", "pType"],
  created() {
    this.bindCancelEvent();
  },
  data() {
    return {
      pickerOptionsToday: {
        // shortcuts: [
        //   {
        //     text: "今日",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "昨日",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "上周今日",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   }
        // ]
      },
      pickerOptionsYesterday: {
        // shortcuts: [
        //   {
        //     text: "昨日",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       end.setTime(end.getTime() - 3600 * 1000 * 24);
        //       start.setTime(start.getTime() - 3600 * 1000 * 24);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "昨日前一天",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       end.setTime(end.getTime() - 3600 * 1000 * 24);
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   },
        //   {
        //     text: "上周昨日",
        //     onClick(picker) {
        //       const end = new Date();
        //       const start = new Date();
        //       end.setTime(end.getTime() - 3600 * 1000 * 24);
        //       start.setTime(start.getTime() - 3600 * 1000 * 24 * 8);
        //       picker.$emit("pick", [start, end]);
        //     }
        //   }
        // ]
      },
      daterange: "",
      daterangeRight: ""
    };
  },
  watch: {
    pDialogVisible(newP, oldP) {
      if (newP) {
        let queryVisible = this.$refs.dialogVisible.style;
        queryVisible.position = "absolute";
        queryVisible.left = this.pClientXY[0] + "px";
        queryVisible.top = this.pClientXY[1] + "px";
      }
    }
  },
  methods: {
    bindCancelEvent() {
      document.addEventListener("click", this.bindCancelEventListener);
    },

    bindCancelEventListener() {
      this.$emit("close");
    },

    handleFilter(e) {
      let params = {};
      if (this.pType === "daterange") {
        params.key = "daterange";
        params.value = this.daterange;
      } else if (this.pType === "daterangeRight") {
        params.key = "daterangeRight";
        params.value = this.daterangeRight;
      }
      this.$emit("query", params);
    },
    handleCancel() {
      this.$emit("close");
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bindCancelEventListener);
  }
};
</script>

<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.query-box {
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 0 15px #dcdfe6;
  padding: 10px;
  /deep/.el-date-editor{
    width: 150px;
  }
}
</style>

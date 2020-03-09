<!-- 店铺详情时间和开关组件 -->
<template>
  <div class="shopStatuContainer">
    <!-- 添加监控弹窗 -->
    <el-dialog top="30vh" title="添加监控" :visible.sync="dialogMonitorVisible" width="24%">
      <div class='dialogContent' style="overflow:hidden;">
        <div style="margin-top:15px;">
          <div class="block" style='margin-top:15px;display:flex;justify-content:center'>
            <el-date-picker v-model="monitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class='saveContainer' style='text-align:center;margin-top:40px;'>
          <el-button type="primary" size="large" style='width:50%' @click="addMonitoring">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 更新时间，截止时间，取消监控 -->
    <div class='tabRight'>
      <!-- 切换新品天数 -->
      <div style="margin-right:-5px;font-size:13px;position:relative;top:-12px;height:40px;line-height:40px;" v-show="isShowMoniContrl">
        <span>新品：上架时间</span>
        <span style="color:#0000FF">{{dayValue}}</span>
        <span>天</span>
        <span class="changeDate" v-show="ShowSwitch" @click="ShowSwitch=false">切换</span>
        <span v-show="!ShowSwitch">
          <el-select v-model="value" style="width:70px;margin-left:10px;" @change="selectDay">
            <el-option v-for="item in dayOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" @click="confirmDay">确认</el-button>
        </span>
      </div>
      <!-- 时间，开关 -->
      <ul style="display:flex;position:relative;right:-10px;">
        <li>
          更新时间：
          <span class='timeColor'>{{this.childStatus.updateTime}}</span>
        </li>

        <li>
          截止时间：
          <span class='timeColor' v-loading="load.moniLoading">{{this.childStatus.monitorFlag==1?this.childStatus.monitorTo:"未开启监控"}}</span>
        </li>

        <li>
          <el-button type="success" class='cancelBtn' @click="addOrCancel">
            {{this.childStatus.monitorFlag==1?"取消监控":"开启监控"}}
          </el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  ShopMonitoringUrl,
  ShopAnalysisRemoveMonitor
} from "../../../api/myApi";
export default {
  name: "moniCotrl",
  components: {},
  props: {
    childStatus: {},
    callback: {},
    isShowMoniContrl: {}
  },
  data() {
    return {
      dialogMonitorVisible: false, //弹窗
      monitorDateValue: "", // 日期
      load: {
        moniLoading: false // 监控时间的loading
      },
      ShowSwitch: true, // 切换二字的隐藏与时间select框，确定的显示控制
      // 切换时间
      dayValue: "60",
      dayOptions: [
        {
          value: "7",
          label: "7"
        },
        {
          value: "14",
          label: "14"
        },
        {
          value: "21",
          label: "21"
        },
        {
          value: "30",
          label: "30"
        },
        {
          value: "60",
          label: "60"
        },
        {
          value: "90",
          label: "90"
        }
      ],
      value: "60"
    };
  },

  created() {
    console.log("childStatus", this.childStatus);
  },
  mounted() {},
  methods: {
    // 点击切换二字

    // 选择时间，放好
    selectDay(selected) {
      // console.log(selected);
      this.dayOptions.value = selected;
    },
    // 确认时间
    confirmDay() {
      this.dayValue = this.dayOptions.value;
      this.ShowSwitch = !this.ShowSwitch;
      // 切换新品时间存store
      this.$store.commit(
        "competitive/saveDay",
        parseInt(this.dayOptions.value)
      );
    },
    // 开启还是取消监控
    // 点击按钮是使用添加监控函数，还是使用取消监控函数
    addOrCancel() {
      if (this.childStatus.monitorFlag == 0) {
        this.dialogMonitorVisible = true;
        return;
      }
      this.cancelMonitoring();
    },
    // 添加监控
    addMonitoring() {
      let params = {
        taskIds: [parseInt(this.$route.query.taskId)]
      };

      if (!this.monitorDateValue) {
        this.$alert("请选择监控起始时间");
        return;
      }
      params.monitorFrom = this.monitorDateValue[0];
      params.monitorTo = this.monitorDateValue[1];
      // loading
      this.load.moniLoading = true;
      this.$axios
        .post(ShopMonitoringUrl, params)
        .then(res => {
          // console.log("添加产品接口响应", res.data);
          if (res.data.code != 0) {
            this.$message.error(res.data.msg);
            // loading
            return;
          }
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.load.moniLoading = false;
          this.callback();
          this.dialogMonitorVisible = false;
        })
        .catch(err => {
          console.log("添加监控失败", err);
        });
    },
    //取消监控
    cancelMonitoring() {
      // this.$set(this.productDetail, this.productDetail.toTime, "未开启监控");
      let taskIdArr = [parseInt(this.$route.query.taskId)];
      // console.log(taskIdArr);
      let params = {
        taskIds: taskIdArr
      };
      // console.log(params);
      this.$confirm("是否取消本产品的监控?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.post(ShopAnalysisRemoveMonitor, params).then(res => {
            if (res.data.code != 0) {
              this.$message.error(res.data.msg);
              return;
            }
            this.$nextTick(function() {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            });
            this.callback();
            // console.log("取消监控失败响应", res.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃了本次操作"
          });
        });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.tabRight {
  list-style: none;
  position: absolute;
  right: 30px;
  top: 12px;
  z-index: 9;
  display: flex;
  li {
    margin-left: 5px;
    font-weight: bold;
    font-size: 13px;
    .timeColor {
      color: #3a8ee6;
    }
    .cancelBtn {
      height: 32px;
      line-height: 8px;
      position: relative;
      top: -8px;
      right: -10px;
    }
  }
}
.changeDate {
  margin-left: 5px;
  display: inline-block;
  border: 1px solid #0094e9;
  padding: 2px 10px;
  border-radius: 3px;
  color: #0094e9;
  cursor: pointer;
  height: 24px;
  line-height: 24px;
}
</style>

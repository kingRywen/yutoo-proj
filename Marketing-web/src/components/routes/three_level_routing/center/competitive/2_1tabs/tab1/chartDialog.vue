<!-- chart弹窗 -->
<template>
  <div class="dialogContainer">
    <el-dialog :close-on-click-modal="false" top="30vh" :title="dialog.title" :visible.sync="dialog.dialogShow" :width="dialog.width">
      <div class='dialogContent' style="overflow:hidden;padding:0 5px;">
        <!-- table -->
        <slot name="temp">
          <el-table :data="dialog.list" stripe height="400px" style="width: 100%;overflow:auto">
            <el-table-column prop="range" :label="dialog.type" align="center">

            </el-table-column>
            <el-table-column prop="newShelfProductCnt" label="新品数" align="center">
              <template slot-scope="scope">
                <span class="canClick" @click="toNewProductPage(scope.row)">{{scope.row.newShelfProductCnt}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="oldShelfProductCnt" label="非新品数" align="center">
              <template slot-scope="scope">
                <span class="canClick" @click="toOldProductPage(scope.row)">{{scope.row.oldShelfProductCnt}}</span>
              </template>
            </el-table-column>
          </el-table>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDay } from "@/api/functions";
export default {
  name: "chartDialog",
  props: ["dialog"],
  data() {
    return {
      //   tableData: [
      //     {
      //       date: "2016-05-02",
      //       name: "王小虎",
      //       address: "上海市普陀区金沙江路 1518 弄"
      //     },
      //     {
      //       date: "2016-05-04",
      //       name: "王小虎",
      //       address: "上海市普陀区金沙江路 1517 弄"
      //     },
      //     {
      //       date: "2016-05-01",
      //       name: "王小虎",
      //       address: "上海市普陀区金沙江路 1519 弄"
      //     },
      //     {
      //       date: "2016-05-03",
      //       name: "王小虎",
      //       address: "上海市普陀区金沙江路 1516 弄"
      //     }
      //   ]
    };
  },

  created() {},
  mounted() {},
  methods: {
    toNewProductPage(item, index) {
      let date1 = getDay().today,
        date2 = this.dialog.setToVuex.date;
      // console.log(date1, "date1");
      // console.log(date2, "date2");
      // if (date1 !== date2) {
      //   this.$message({
      //     type: "warning",
      //     message: "选择时间是今天才能查看产品列表"
      //   });
      //   return;
      // }
      // console.log(item, "点击了哪个数据");
      let data = {};
      data.range = item.range;
      data.newOrOld = "新品";
      data.productType = 0;
      data.taskId = parseInt(this.$route.query.taskId);
      this.$store.commit("competitive/saveDialogItem", data);
      this.$router.push("/admin/competitive/shopAnalysis/shopProductScore");
    },
    toOldProductPage(item, index) {
      let date1 = getDay().today,
        date2 = this.dialog.setToVuex.date;
      // console.log(date1, "date1");
      // console.log(date2, "date2");
      // if (date1 !== date2) {
      //   this.$message({
      //     type: "warning",
      //     message: "选择时间是今天才能查看产品列表"
      //   });
      //   return;
      // }
      let data = {};
      data.range = item.range;
      data.newOrOld = "非新品";
      data.productType = 1;
      data.taskId = parseInt(this.$route.query.taskId);
      //   console.log(data, "点击了哪个数据");
      this.$store.commit("competitive/saveDialogItem", data);
      this.$router.push("/admin/competitive/shopAnalysis/shopProductScore");
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
.canClick {
  cursor: pointer;
  padding: 2px;
  color: #5757ff;
  font-size: 14px;
}
</style>

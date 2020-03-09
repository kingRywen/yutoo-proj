<!-- chart弹窗 -->
<template>
    <div class="dialogContainer">
        <el-dialog top="30vh" :title="dialog.title" :visible.sync="dialog.dialogShow" :width="dialog.width">
            <div class='dialogContent' style="overflow:hidden;padding:0 5px;">
                <!-- table -->
                <slot name="temp">
                    <el-table :data="dialog.list" stripe style="width: 100%;height:400px;overflow:scroll">
                        <el-table-column prop="range" label="评分" align="center">

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
      let data = {};
      data.range = item.range;
      data.newOrOld = "新品";
      data.productType = 0;
      //   console.log(data, "点击了哪个数据");
      this.$store.commit("competitive/saveDialogItem", data);
      this.$router.push("/admin/competitive/shopProductScore");
    },
    toOldProductPage(item, index) {
      let data = {};
      data.range = item.range;
      data.newOrOld = "非新品";
      data.productType = 1;
      //   console.log(data, "点击了哪个数据");
      this.$store.commit("competitive/saveDialogItem", data);
      this.$router.push("/admin/competitive/shopProductScore");
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

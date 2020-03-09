<!-- 关键字查询 -->
<template>
  <div class='keyQuerySee'>

    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between" style="padding-bottom:10px;">
      <!-- 输入框 -->
      <el-col :span="20">

        关键字
        <span v-model="keyword">{{keyword}}</span>

      </el-col>
      <el-col :span="4">
        <el-button type="success" @click="onExport()">导出</el-button>
      </el-col>
    </el-row>
    <el-table :data="seeListData" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="id" label="图片" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题">
      </el-table-column>
      <el-table-column prop="sku" label="ASIN">
      </el-table-column>
      <el-table-column prop="releaseDate" sortable label="上架时间">
      </el-table-column>
      <el-table-column prop="reviewCnt" sortable label="评分数">
      </el-table-column>
      <el-table-column prop="starCnt" sortable label="评分">
      </el-table-column>
      <el-table-column prop="rank" sortable label="BSR排名">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style='margin-top:20px;'>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-size="100" layout="prev, pager, next, jumper" :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// import vieCheck from '@/components/routes/three_level_routing/center/productList/KeywordIndexFiles/vieCheck'
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      keyword: this.$route.query.keyword,
      seeKeyword: "",

      seeListData: [],

      exportData: [], //选中导出的id
      currentPage3: 1 // 分页
    };
  },
  created() {
    this.getLists(); //请求列表
  },
  computed: {},
  methods: {
    ...mapActions("selectionTool", ["getKeywordQueryListApi"]),
    ...mapMutations("selectionTool", {
      setWordList: "getKeywordList"
    }),
    //获取查看列表
    getLists() {
      let params = {
        taskId: this.$route.query.id,
        keyword: this.$route.query.keyword,
        pageNumber: 1,
        pageSize: 10
      };
      console.log(params, "参数");
      this.$axios.post("/TaskKeywordQueryRt/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
        if (res.data.rows.length) {
          this.seeListData = res.data.rows;
        }

        if (!res.data.rows.length) {
          this.$message.error("没有相关数据");
        }
      });
    },

    //导出 关键词查询查看导出
    onExport() {
      let a = this.exportData;
      let s = new Set(a);
      let result = Array.from(s);
      console.log(result, "关键词竞争导出的ID");

      this.$axios
        .post("/TaskKeywordQueryRt/exportData", { taskRtIdArray: result })
        .then(res => {
          if (res.data) {
            //成功返回的数据
            window.open("http://192.168.0.233:8080/img/exportData/10002");

            this.$message({
              message: res.data.msg,
              type: "success"
            });

            return;
          } else if (res.data.code == 500) {
            this.$message.error(res.data.msg);
            return;
          }
        });
    },

    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.exportData.push(item.taskId);
      });
    },
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style scoped>
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
</style>

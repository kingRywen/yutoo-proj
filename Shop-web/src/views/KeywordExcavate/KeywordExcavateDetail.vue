<!-- 查看 -->
<template>
  <div class="___common">
    <!-- <template>
      <div class="title_h1 margin_bottom8">
        <span class="title_icon"></span>
        <span class="color_666">任务名称 :</span>
        <span class="titleBox">{{this.$route.query.taskName}}</span>
      </div>
    </template> -->

    <template >
      <el-search-detail :backFun="backFun"  @searchTrueData='searchTrueData'></el-search-detail>
    </template>
    <!-- 导出提示文字隐藏 -->
    <a v-show="false" ref="exportExcel"></a>
    <template>
      <Handler :buttonLoading="handlerButtonLoading" :data='userSelect' :onExport="onExport"></Handler>
    </template>
    <template>
      <!-- // 3 -->
      <el-table-pagination ref="table" :table="table" :pageNumber.sync="table.pageNumber" :pageSize.sync="table.pageSize" :total="table.total" v-loading="table.loading" :userSelect.sync="userSelect"></el-table-pagination>
    </template>

  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from "Config";
const { BASE_URL } = CONST_PORT_CONFIG;
import Handler from "./child/handler";
export default {
  components: { Handler },
  provide() {
    return {
      getList: this.getList,
      link__: this.link__,
      // 1
      clearSort: this.clearSort
    };
  },
  data() {
    return {
      // 表格
      table: {
        loading: false,
        rows: [],
        // rowKey: "keyword",
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        show: {
          keywordSrc: true,
          keyword: true,
          keywordType: true,
          depth: true,
          Handle: {
            link: true
          }
        }
      },
      userSelect: [],
      handlerButtonLoading: {
        funCopyButtonLoading: false,
        funExportButtonLoading: false,
        funAddButtonLoading: false
      },

      searchTrueDatas:'',
    };
  },

  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    searchTrueData(v){
      delete v.pageNumber
      delete v.pageSize
      this.searchTrueDatas = v;
      console.log(this.searchTrueDatas);
    },
    // 列表
    getList(arg) {
      let params = {
        pageSize: this.table.pageSize,
        pageNumber: this.table.pageNumber,
        taskId: this.$route.query.taskId,
        ...arg,
        ...this.searchTrueDatas
      };
      params = this.$.dealObjectValue(params);
      this.table.loading = true;
      return this.$api["TaskKeywordDigRtList"](params)
        .then(data => {
          this.table.loading = false;
          this.table.rows = data.rows;
          // console.log(data.rows == "");
          if (
            data.rows == "" &&
            data.pageNo !== null &&
            data.pageNo !== "" &&
            data.pageNo !== 1
          ) {
            let a = {
              pageSize: this.table.pageSize,
              pageNumber: 1
            };
            this.getList(a);
            return;
          } else {
            this.table.pageNumber = data.pageNo;
          }
          this.table.pageSize = data.pageSize;
          this.table.total = data.total;
          return true;
        })
        .catch(err => {
          this.table.loading = false;
          console.log(err);
          return true;
        });
    },
    // 2
    clearSort() {
      this.$refs.table.clearSortable();
    },
    //导出 todo
    onExport() {
      let arr = this.userSelect;
      let params;
      let taskRtIdArray = arr.map(item => item.keyword);
      if (taskRtIdArray.length == 0) {
        params = { ...this.SearchData };
        params.taskId = parseInt(this.$route.query.taskId);
        // 有搜索条件的导出要把搜索条件带上，搜索的每一条处理成数组
        if (params.keywordSrc) {
          params.keywordSrc = params.keywordSrc
            .split(/[\n|\r\n|\,|\，]/)
            .map(el => el.trim())
            .filter(el => el !== "");
        }
      } else {
        params = {};
        params.taskId = parseInt(this.$route.query.taskId);
        params.keywords = taskRtIdArray;
      }
      params = this.$.dealObjectValue(params);
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.handlerButtonLoading.funExportButtonLoading = true
      this.$ajax({
        method: "post",
        url: BASE_URL + "taskKeywordDigRt/exportData",
        data: params,
        responseType: "blob"
      })
        .then(data => {
          this.handlerButtonLoading.funExportButtonLoading = false
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "关键词挖掘分析列表.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    link__() {},
    backFun() {
      this.$router.push({
        path: "/keywordExcavate"
      });
    }
  },
  computed: {},
  watch: {
    sellerData(val) {
      if (
        val.sellerId !== this.$route.query.sellerId ||
        val.siteId != this.$route.query.siteId
      ) {
        // this.$router.replace("/dash");
      } else {
        this.getList();
      }
    }
  }
};
</script>

<style lang='less' scope>

.___common{    
    /deep/.__back  {
      position: absolute;
      top: 8px !important;
      right: 27px;
    }
}
</style>

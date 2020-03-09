<template>
  <div class="box">
    <div class="box-info" style='height:48px;'>
      <span style="display: flex;align-items:center;">筛选条件</span>
      <span>
        <el-button
          type="text"
          size="mini"
        ></el-button>
      </span>
    </div>
    <div class="box-query">
      <el-form
        :inline="true"
        :model="listQuery"
        ref="listQueryForm"
      >
        <el-form-item prop="starFlag" label='评分星级'>
          <el-select
            v-model="listQuery.evaluateStar"
            placeholder="请选择评分星级"
            size="mini"
            class="select-query"
            clearable
            style='width:180px;'
          >
            <el-option
              :label="item"
              :value="item"
              :key="item+'_evaluateStar'"
              v-for="item in [1,2,3]"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评价时间:">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- <el-button
            size="mini"
            type="primary"
            plain
            v-for="item in ['确认搜索','重置搜索']"
            @click="distribute(item)"
          >{{item}}</el-button> -->
          <el-button size="small" type="primary" @click="distribute('确认搜索')" icon="el-icon-search" :loading="$store.state.isloading || $store.state.loading">搜索</el-button>
          <el-button size="small" type="primary" plain @click="distribute('重置搜索')" :disabled='$store.state.isloading || $store.state.loading'>重置搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="box-update-btn">

    </div>
    <div class="box-data">
      <el-table
        :data="list"
        v-loading="listLoading"
        :key='tableKey'
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
        tooltip-effect="light"
      >
        <el-table-column
          type="selection"
          width="55"
        >
        </el-table-column>
        <el-table-column
          prop="reviewId"
          label="sku属性"
          min-width="150"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.skuAttrStr!==null">
              <div v-for="item in scope.row.skuAttrStr" v-if='item.attrName'>
                {{item.attrName}}:<span style="margin-left: 5px;"> {{item.attrValue}}</span>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="reviewTime"
          label="时间"
          min-width="100"
        >
        </el-table-column>
        <el-table-column
          prop="buyerName"
          label="买家"
          min-width="80"
        >
        </el-table-column>
        <el-table-column
          prop="evaluateStar"
          label="评价星级"
          min-width="80"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
const _ = require("lodash");
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      daterange: [],
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        evaluateStar: null,
        startTime: null,
        endTime: null
      },
    };
  },
  created() {
    let query = this.$route.query;
    this.listQuery.reviewPosition = query.reviewPosition;
    this.listQuery.taskId = query.taskId;

    this.getList();
  },

  methods: {
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.getList();
          break;
        case "重置搜索":
          this.resetListQueryForm();
          break;
      }
    },
    getList() {
      this.listLoading = true;
      let daterange = this.daterange;
      if (daterange !== null && daterange.length === 2) {
        this.listQuery.startTime = daterange[0];
        this.listQuery.endTime = daterange[1];
      } else {
        this.listQuery.startTime = null;
        this.listQuery.endTime = null;
      }
      let listQuery = _.cloneDeep(this.listQuery);
      this.$api["badReviewSeoDetailList"](listQuery)
        .then(res => {
          let { rows, total } = res;
          this.list = rows;
          this.total = total;

            this.listLoading = false;
         
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    resetListQueryForm() {
      this.daterange = [];
      this.listQuery.evaluateStar = null;
      this.$refs.listQueryForm.resetFields();
      this.getList()
    },

    backPage() {
      this.$router.push({
        path: "/badReviewSeo"
      });
    }
  }
};
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.box {
  // border: 1px solid @borderColor;
  // padding: 10px;
  .box-info {
    font-size: 14px;
    background-color: @boxQueryBGColor;
    //    padding: 15px;
    padding: 6px 15px 6px 15px;
    border: 1px solid @borderColor;
    display: flex;
    justify-content: space-between;
    //    span {
    //     &:first-of-type {
    //         margin-right: 20px;
    //     }
    //     &:last-of-type {
    //         color: @titleColor
    //     }
    //  }
  }
  .box-query {
    //    min-width: 680px;
    padding: 15px 15px 0 15px;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;

    //    display: flex;
    // //    justify-content: center;
    //    align-items: center;
    // //    align-self: center;
    // .el-form--inline{
    //     height: 40px;
    // }
    .el-form-item{
      margin-bottom:14px;
    }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }
      .el-select {
        width: 120px;
      }
      .el-range-editor {
        width: 240px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
    }
  }
  .box-update-btn {
    margin-top: 10px;
  }
  .box-data {
    .el-pagination {
      margin-top: 5px;
      padding-left: 0;
      /deep/.el-pagination__sizes {
        .el-input {
          margin-left: 0 !important;
        }
      }
    }
  }
}
</style>



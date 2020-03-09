<template>
  <div class="tab-box">
    <y-template>
      <!-- <div slot="ScreenTip">
                <span>筛选条件</span>
                <span></span>
      </div>-->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <div class="custom-collapse">
          <el-form-item prop="parentAsin">
            <el-input v-model.trim="listQuery.parentAsin" placeholder="请输入ASIN、标题" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model.trim="listQuery.keyword" placeholder="关键词" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <!-- <el-button  size="mini" type="primary" plain v-for="item in ['确认搜索','重置条件']" @click="distribute(item)">{{item}}</el-button> -->
            <el-button
              size="small"
              type="primary"
              @click="distribute('确认搜索')"
              icon="el-icon-search"
              :loading="$store.state.isloading || $store.state.loading"
            >搜索</el-button>
            <el-button
              size="small"
              type="primary"
              plain
              @click="distribute('重置条件')"
              :disabled="$store.state.isloading || $store.state.loading"
            >重置搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="blank-rank" slot="HandleBtn" style="padding-top:10px;">
        <!-- <el-checkbox v-model="rankingChecked">不展示排名</el-checkbox> -->
        <span>不展示排名</span>
        <el-form style="display:inline-block;" :model="blankRank" ref="blankRankForm">
          <el-form-item prop="blankRank" :rules="rules2" style="margin-left:6px;margin-bottom:10px;">
            <el-input
              v-model.trim="blankRank.blankRank"
              placeholder="请输入正整数"
              size="mini"
              clearable
              style="width:180px;"
              :disabled="!isSave"
            >
              <el-button type="info" slot="append" size="small" v-if="!isSave" @click="isEditBtn">编辑</el-button>
              <el-button type="primary" slot="append" size="small" v-if="isSave" @click="isSaveBtn">保存</el-button>
            </el-input>
            <span style="margin-left:6px;">以后的预警</span>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        slot="table"
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        border
        stripe
        tooltip-effect="light"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="parentAsin" label="ASIN" width="120"></el-table-column>
        <el-table-column label="主图" width="80">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <img :src="scope.row.imageUrl" style="width: 300px;height: 150px;object-fit: contain;overflow: hidden;">
              <div class="__img_wrapper" slot="reference">
                <img
                  class="loadingImg"
                  v-if="scope.row.imageUrl"
                  :key="scope.row.imageUrl"
                  v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'"
                >
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip min-width="120">
          <!-- <template slot-scope="scope">
                                <div v-if="scope.row.title">
                                    {{scope.row.title}}
                                </div>
                                <div v-else>-</div>
          </template>-->
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column label="关键词类型" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.thesaurus==0">核心词</div>
            <div v-else-if="scope.row.thesaurus==1">长尾词</div>
            <div v-else-if="scope.row.thesaurus==2">其他词</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="fallWarn" label="预警" min-width="100"></el-table-column>
        <el-table-column label="排名备注" min-width="100">
          <template slot-scope="scope">
            <!-- <div v-if='!scope.row.webRank && !scope.row.webRankChange'>-</div>
            <div v-else>{{scope.row.webRank}}({{scope.row.webRankChange}})</div>-->
            <div>
              <span>{{scope.row.webRank===null?'-':scope.row.webRank}}</span>
              <span>({{scope.row.webRankChange===null?"-":scope.row.webRankChange}})</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-search" @click="showChartDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        slot="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </y-template>

    <chart ref="chartDialog"/>
  </div>
</template>
<script>
import YTemplate from '../Common/y-template/index'
import Chart from './chart'
export default {
  components: {
    YTemplate,
    Chart
  },
  props: ['pParams'],
  data() {
    let validatePass = (rule, value, callback) => {
      console.log(value)
      if (value === null || value === '' || value === undefined) {
        callback()
      } else if (isNaN(Number(value))) {
        return callback(new Error('请输入数字'))
      } else if (!/^[1-9]\d*$/.test(Number(value))) {
        return callback(new Error('请输入正整数'))
      }
      callback()
    }
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: this.platformId,
        siteId: null,
        sellerId: null,
        cusCateId: null,
        parentAsin: null,
        keyword: null
      },
      blankRank: {
        blankRank: null
      },
      isSave: false, //是否是编辑保存
      rankingChecked: false,
      rules2: [{ validator: validatePass, trigger: ['blur', 'change'] }]
    }
  },
  watch: {
    'pParams.cusCateId'(val) {
      if (val !== null) {
        this.listQuery.platformId = this.pParams.platformId
        this.listQuery.siteId = this.pParams.siteId
        this.listQuery.sellerId = this.pParams.sellerId
        this.listQuery.cusCateId = this.pParams.cusCateId
        this.listQuery.pageNumber = 1
        if (this.pParams.tabLabel !== null) {
          if (this.pParams.tabLabel.indexOf('tabLabel1') !== -1) {
            this.getList()
          }
        }
      }
    },
    'pParams.tabLabel'(val) {
      if (val !== null) {
        this.listQuery.platformId = this.pParams.platformId
        this.listQuery.siteId = this.pParams.siteId
        this.listQuery.sellerId = this.pParams.sellerId
        this.listQuery.cusCateId = this.pParams.cusCateId
        this.listQuery.pageNumber = 1
        if (val.indexOf('tabLabel1') !== -1) {
          this.listQuery.parentAsin = null
          this.listQuery.keyword = null
          this.listQuery.blankRank = null
          this.getList()
        }
      }
    }
  },
  methods: {
    isSaveBtn() {
      this.$refs.blankRankForm.validate(valid => {
        if (valid) {
          this.isSave = !this.isSave
          this.listQuery.blankRank = this.blankRank.blankRank * 1
          if (this.listQuery.blankRank) {
            this.getList()
          }
        }
      })
    },
    isEditBtn() {
      this.isSave = true
    },
    distribute(btn) {
      switch (btn) {
        case '确认搜索':
          this.handleFilter()
          break
        case '重置条件':
          this.handleFilter(btn)
          break
      }
    },
    getList() {
      this.listLoading = true
      this.$api['taskFwKeywordList'](this.listQuery)
        .then(res => {
          let { rows, total } = res
          //this.$emit('setTotal',{type:'keyword',total});
          this.list = rows
          this.total = total
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleFilter(btn) {
      let isTrue = null
      this.$refs.listQueryForm.validate(valid => {
        if (valid) {
          isTrue = true
        } else {
          isTrue = false
        }
      })
      if (isTrue) {
        this.listQuery.pageNumber = 1
        if (btn === '重置条件') {
          this.$refs.listQueryForm.resetFields()
        }
        this.getList()
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    showChartDialog(row) {
      if (row.taskId == null || row.parentAsin == null) {
        this.$message.error('taskId或parentAsin不能为空!')
        return
      }
      let chartDialog = this.$refs.chartDialog
      if (chartDialog !== undefined) {
        // type keyword 关键词排名下降 flow 关联流量排名下降
        chartDialog.showDialog({
          taskId: row.taskId,
          parentAsin: row.parentAsin,
          type: 'keyword'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.custom-collapse .el-form-item {
  margin-bottom: 14px;
}
.tab-box {
  .template-box {
    border: none;
    padding: 0;
    /deep/.screen-info,
    /deep/.el-table {
      border-left: none;
      border-right: none;
    }
    /deep/.box-update-btn {
      padding-left: 10px;
    }
    .el-pagination {
      margin-left: 10px;
    }
    .screen-info {
      .blank-rank {
        .el-checkbox {
          margin-top: 12px;
        }
        /deep/.el-form-item__content {
          display: flex;
        }
        .el-form-item__content {
          .el-input {
            width: 120px;
            margin-left: 5px;
            margin-right: 5px;
          }
        }
      }
    }
  }
}
</style>

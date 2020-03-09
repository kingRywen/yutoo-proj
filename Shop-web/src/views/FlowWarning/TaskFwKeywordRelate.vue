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
        <el-button type="primary" plain size="small" @click="showRelateDialog">关联管理</el-button>
        <span class="ml10">不展示排名</span>
        <el-form style="display:inline-block;" :model="blankRank" ref="blankRankForm">
          <el-form-item prop="blankRank" :rules="rules2" style="margin-left:6px;margin-bottom:10px;">
            <el-input
              v-model.trim="blankRank.blankRank"
              placeholder="请输入正整数"
              size="small"
              clearable
              style="width:180px;"
              :disabled="!isSave"
            >
              <el-button slot="append" type="info" size="small" v-if="!isSave" @click="isEditBtn">编辑</el-button>
              <el-button slot="append" type="primary" size="small" v-if="isSave" @click="isSaveBtn">保存</el-button>
            </el-input>

            <span style="margin-left:6px;">以后的预警</span>
          </el-form-item>
        </el-form>
        <!-- <el-form style="display:inline-block;" :model="blankRank" ref="blankRankForm">
          <el-form-item prop="blankRank" :rules="rules2" style="margin-left:6px;margin-bottom:10px;">
            <span style="margin-left:20px;margin-right:6px">不展示排名</span>
            
              <el-button slot="append" type="info" size="small" v-if="!isSave" @click="isEditBtn">编辑</el-button>
              <el-button slot="append" type="primary" size="small" v-if="isSave" @click="isSaveBtn">保存</el-button>
            </el-input>
            <span style="margin-left:6px;">以后的预警</span>
          </el-form-item>
        </el-form>-->

        <!-- <el-form style='display:inline-block;' :model="blankRank" ref='blankRankForm'>
                    <el-form-item prop="blankRank" :rules="rules2" style='margin-left:6px;margin-bottom:10px;'>
                        <el-input v-model="blankRank.blankRank" placeholder="请输入正整数" size="mini" clearable style='width:160px;' :disabled="!isSave"></el-input>
                        <el-button type="info"  size='small' v-if='!isSave' @click='isEditBtn'>编辑</el-button>
                        <el-button type="primary" size='small' v-if='isSave' @click='isSaveBtn'>保存</el-button>
                        
                    </el-form-item>     
        </el-form>-->
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
        <el-table-column prop="parentAsin" label="ASIN" min-width="100"></el-table-column>
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
        <el-table-column prop="relateParentAsin" label="关联ASIN" width="120"></el-table-column>
        <el-table-column label="关键词类型" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.thesaurus==0">核心词</div>
            <div v-else-if="scope.row.thesaurus==1">长尾词</div>
            <div v-else-if="scope.row.thesaurus==2">其他词</div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column label="预警" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.fallWarn instanceof Array&&scope.row.fallWarn.length>0">
              <el-popover placement="right-start" width="500" trigger="hover">
                <el-table :data="scope.row.fallWarn" tooltip-effect="light">
                  <el-table-column min-width="90" prop="name" label="预警列表" show-overflow-tooltip></el-table-column>
                </el-table>
                <div
                  slot="reference"
                >{{scope.row.fallWarn[0].name.length>16?scope.row.fallWarn[0].name.substring(0,16)+' ...':scope.row.fallWarn[0].name}}</div>
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="排名备注" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.fwRelateRankChanges instanceof Array&&scope.row.fwRelateRankChanges.length>0">
              <el-popover placement="right-start" width="200" trigger="hover">
                <el-table :data="scope.row.fwRelateRankChanges">
                  <!-- <el-table-column min-width="90" prop="webRank"></el-table-column>
                  <el-table-column min-width="90" prop="webRankChange"></el-table-column>-->
                  <el-table-column min-width="90" label="排名备注预警列表">
                    <template slot-scope="scope">
                      <!-- <div v-if=' !scope.row.webRank && !scope.row.webRankChange'>-</div>
                      <div v-else>{{scope.row.webRank}}({{scope.row.webRankChange}})</div>-->
                      <div>
                        <span>{{scope.row.webRank===null?'-':scope.row.webRank}}</span>
                        <span>({{scope.row.webRankChange===null?"-":scope.row.webRankChange}})</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div slot="reference">
                  <span>{{scope.row.fwRelateRankChanges[0].webRank===null?"-":scope.row.fwRelateRankChanges[0].webRank}}</span>
                  <span>({{scope.row.fwRelateRankChanges[0].webRankChange===null?"-":scope.row.fwRelateRankChanges[0].webRankChange}})</span>
                </div>
                <!-- <div slot="reference" v-else>{{scope.row.fwRelateRankChanges[0].webRank}}({{scope.row.fwRelateRankChanges[0].webRankChange}})</div> -->
              </el-popover>
            </div>
            <div v-else>-</div>
          </template>
          <!-- <template slot-scope="scope">
                                <div>{{scope.row.webRank}}({{scope.row.webRankChange}})</div>
          </template>-->
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
  props: ['pParams', 'fn'],
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === null || value === '') {
        callback()
      } else if (isNaN(Number(value))) {
        return callback(new Error('请输入数字'))
      } else if (!/^[1-9]\d*$/.test(value)) {
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
          if (this.pParams.tabLabel.indexOf('tabLabel2') !== -1) {
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
        if (val.indexOf('tabLabel2') !== -1) {
          this.listQuery.parentAsin = null
          this.listQuery.keyword = null
          this.listQuery.blankRank = null
          this.getList()
        }
      }
    }
  },
  methods: {
    //调用父组件的事件
    showRelateDialog() {
      this.fn()
    },
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
      this.$api['taskFwRelateRelatelist'](this.listQuery)
        .then(res => {
          let { rows, total } = res
          // let list =[]
          //this.$emit('setTotal',{type:'flow',total});
          rows.forEach(element => {
            if (element.fallWarn !== null) {
              let listTmp = element.fallWarn.split(',')
              let fallWarnArr = []
              listTmp.forEach(el => {
                fallWarnArr.push({ name: el })
              })
              element.fallWarn = fallWarnArr
            }

            if (element.fwRelateRankChanges !== null) {
              let listTmp = []
              element.fwRelateRankChanges.forEach(el => {
                if (el.webRank !== 0) {
                  listTmp.push(el)
                }
              })
              element.fwRelateRankChanges = listTmp
            }
            // fwRelateRankChanges[0].webRank
            // list.push(element)
          })
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
      if (row.parentAsin == null || row.relateParentAsin == null) {
        this.$message.error('parentAsin或relateParentAsin不能为空!')
        return
      }
      let chartDialog = this.$refs.chartDialog

      if (chartDialog !== undefined) {
        // type keyword 关键词排名下降 flow 关联流量排名下降
        chartDialog.showDialog({
          parentAsin: row.parentAsin,
          relateParentAsin: row.relateParentAsin,
          type: 'flow'
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

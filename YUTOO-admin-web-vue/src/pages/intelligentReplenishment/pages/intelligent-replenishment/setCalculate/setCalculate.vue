<template lang="html">
    <section class="setCalculate">
        <IRLayout>
            <!-- -->
            <template slot="header">
                <div class="title" @click="back"> <i class="el-icon-arrow-left"></i> 计算公式参数管理</div>
                <div style="margin-right:20px;">
                    <el-button type="primary" size="small" @click="addRedact(1)"  v-show="show">添 加</el-button>
                </div>
            </template>
            <!--  -->
            <template slot="select">
    <ul>
        <li>
            <el-select placeholder="选择周期类型" size="small" v-model="ruleForm.cycleType" clearable>
                <el-option v-for="item in cycleType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </li>
        <li class="flex">
            <span>名称：</span>
            <el-input size="small" v-model="ruleForm.formulaName" />
        </li>
        <li class="flex">
            <span>添加人员：</span>
            <el-input size="small" v-model="ruleForm.userName" />
        </li>
        <li>
            <el-button type="primary" icon="el-icon-search" size="small" @click="select()">搜索</el-button>
        </li>
    </ul>
</template>
            <!--  -->
            <template slot="table">
    <el-table border ref="table" :data="listsInfo.rows" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="formuleName" label="名称" width="200" align="center" />
        <!-- <el-table-column prop="cycleType" label="周期类型" width="120" align="center" /> -->
        <el-table-column label="周期类型" align="center">
            <template slot-scope="scope">
                <p>{{scope.row.cycleType === 1 ? '上升期': scope.row.cycleType === 2 ? '稳定期': '衰退期'}}</p>
            </template>
        </el-table-column>
        <el-table-column label="周期监控参数" align="center">
            <template slot-scope="scope">

                <p v-if="scope.row.cycleMonitorParm">
                    {{scope.row.cycleMonitorParm &&scope.row.cycleMonitorParm[0]&& scope.row.cycleMonitorParm[0].day || ' - '}}天: BSR排名
                    <span>{{scope.row.cycleMonitorParm[0].bsrRanking[0].largeRankingStart}}</span> ~
                    <span>{{scope.row.cycleMonitorParm[0].bsrRanking[0].largeRankingEnd}}, </span>
                    周期: {{scope.row.cycleMonitorParm[0].bsrRanking[0].cycle}}天, 幅度: {{scope.row.cycleMonitorParm[0].bsrRanking[0].rangeValue}}
                    <span v-if="scope.row.cycleMonitorParm[0].bsrRanking[0].range === 1">%</span>
                    <el-tooltip content="Left center" placement="bottom" effect="light">
                        <i class="el-icon-caret-bottom"></i>
                        <div slot="content">
                            <div v-for="(item, index) in scope.row.cycleMonitorParm" style="margin-top:8px">
                                {{item.day || ' - '}}天:
                                <p v-for="i in item.bsrRanking">
                                    BSR排名
                                    <span>{{i.largeRankingStart}}</span> ~
                                    <span>{{i.largeRankingEnd}}, </span>
                                    周期: {{i.cycle}}天, 幅度: {{i.rangeValue}}
                                    <span v-if="i.range === 1">%</span>
                                </p>
                            </div>
                        </div>
                    </el-tooltip>
                </p>

            </template>
        </el-table-column>
        <el-table-column label="缺货监控参数" align="center">
            <template slot-scope="scope">
                <p v-if="scope.row.shortageMonitorParm">
                    保底天数：
                    <span>{{scope.row.shortageMonitorParm[0].insuredDays}}</span>
                    备货天数:
                    <span>{{scope.row.shortageMonitorParm[0].stockDays}}</span>
                    运输天数:
                    <span>{{scope.row.shortageMonitorParm[0].transportDays}}</span>
                    <el-tooltip content="Left center" placement="bottom" effect="light">
                        <i class="el-icon-caret-bottom"></i>
                        <div slot="content">
                            <div v-for="(item, index) in scope.row.shortageMonitorParm" style="margin-top:8px">
                                <p>{{item.id}}:</p>
                                保底天数：
                                <span>{{item.insuredDays}}</span>
                                备货天数:
                                <span>{{item.stockDays}}</span>
                                运输天数:
                                <span>{{item.transportDays}}</span>
                            </div>
                        </div>
                    </el-tooltip>
                </p>
            </template>
        </el-table-column>
        <el-table-column prop="userName" label="添加人" width="120" align="center" />
        <el-table-column label="是否激活使用" width="180" align="center">
            <template slot-scope="scope">
                <p v-if="scope.row.activeFlag">
                    <i class="el-icon-success" style="color:#56bb25"></i>
                </p>
                <p v-else>
                    <i class="el-icon-error" style="color:#f56c6c"></i>
                </p>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <el-button type="text" @click="addRedact(0, scope.row)">编 辑</el-button>
                <el-button type="text" @click="copy(scope.row)">复制添加</el-button>
                <el-button type="text" @click="delItem(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
            <!--  -->
            <template slot="footer">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listsInfo.pageNo" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listsInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listsInfo.total">
    </el-pagination>
</template>
            <!-- 添加或者编辑  -->
            <template :slot="slot"  v-show="!show">
    <div class="addRedactBox">
        <el-form ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="名称：" style="width: 500px;">
                <el-input size="small" />
            </el-form-item>
            <el-form-item label="选择生命周期：" style="width: 500px;">
                <el-select style="width:100%;" size="small" clearable>
                    <el-option :label="item.label" :value="item.value" v-for="item in periodList" />
                </el-select>
            </el-form-item>

            <el-form-item label="周期监控参数：">
                <!--  -->
                <div class="formItemAdd" style="display:flex;margin-bottom:22px;">
                    <el-form-item label="上架时间：" style="margin-right:10px; width:230px;">
                        <el-select size="small">
                            <el-option label="高于等于" value="1" />
                            <el-option label="等于" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-right:10px;width:120px;">
                        <el-input size="small" />
                    </el-form-item>
                    <span>天</span>
                    <i class="el-icon-circle-plus-outline icon" />
                </div>
                <!--  -->
                <div class="formItemAdd" style="margin-bottom:22px;">
                    <el-form-item label="BSR排名：" class="mr10w200">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item style="width:120px;">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item label="计算周期：" class="mr10w200">
                        <el-input size="small" />
                    </el-form-item>
                    <span>天</span>
                    <el-form-item label="幅度：" class="mr10w200">
                        <el-select size="small">
                            <el-option label="比例" :value="0" />
                            <el-option label="值" :value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style='width: 80px;'>
                        <el-input size="small" />
                    </el-form-item>
                    <i class="el-icon-circle-plus-outline icon" />
                </div>
            </el-form-item>
            <el-form-item label="缺货监控参数：">
                <div class="formItemAdd">
                    <el-form-item label="运输方式：">
                        <el-select size="small">
                            <el-option label="海运" value="1" />
                            <el-option label="空运" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="保底天数" class="w80">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item label="备货天数" class="w80">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item label="运输天数" class="w80">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item label="日平均销量计算周期">
                        <el-input size="small" />
                    </el-form-item>
                    <el-form-item label="缺货监控参数：">
                        <el-input size="small" />
                    </el-form-item>
                    <div class="">
                        <i class="el-icon-circle-plus-outline icon" />
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="是否激活：">
                <el-radio-group size="mini">
                    <el-radio-button label="1">是</el-radio-button>
                    <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item style="margin-top:50px;">
                <el-button type="primary" size="small" @click="submitForm('ruleForm')">保 存</el-button>
                <el-button size="small" @click="resetForm('ruleForm')">取 消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


        </IRLayout>
    </section>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { fetchData, handlerCode } from "@/common/common";
import apis from "@/apis";
export default {
  created() {
    this.getCycleType();
    this.getList();
  },
  filters: {
    _formatCycle(val) {
      return val;
    }
  },
  data() {
    return {
      ruleForm: { pageSize: "10", pageNumber: "1" },
      listsInfo: {
        rows: []
      },
      radio6: "",
      slot: "",
      type: 1, //判断点击的是添加还是编辑，
      show: true, //控制页面显示
      periodList: [
        {
          label: "正常",
          value: 1
        },
        {
          label: "衰退",
          value: 2
        },
        {
          label: "上升",
          value: 3
        }
      ],
      formulaList: [
        {
          //公式
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ]
    };
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    //添加编辑取消按钮
    resetForm() {
      this.show = true;
      this.slot = "";
    },
    //添加编辑确定按钮
    submitForm() {},
    //点击添加、编辑
    addRedact(type, row) {
      this.type = type;
      //添加
      if (type) {
        this.$router.push({
          path: "/IntelligentReplenishment/setCalculate/add"
        });

        //编辑
      } else {
        this.$router.push({
          path: "/IntelligentReplenishment/setCalculate/edit/" + row.formulaId
        });
      }
    },
    //选中的
    handleSelectionChange() {},
    //搜索
    select() {
      this.getList();
    },
    //  获取列表
    getList() {
      fetchData({ ...apis.REPLENISHFORMULA_LIST, data: this.ruleForm }).then(
        res => {
          this.listsInfo = res.data;
        }
      );
    },

    copy(row) {
      console.log(row);
      fetchData({
        ...apis.REPLENISHFORMULA_CLONE,
        data: { formulaId: row.formulaId }
      }).then(res => {
        if (res.data.code === 0) {
          this.$refs.table.clearFilter();
          this.getList();
        }
      });
    },

    delItem(row) {
      console.log(row);
      fetchData({
        ...apis.REPLENISHFORMULA_REMOVE,
        data: { formulaId: row.formulaId }
      }).then(res => {
        handlerCode(res);
        if (res.data.code === 0) {
          this.$refs.table.clearFilter();
          this.getList();
        }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.ruleForm.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.ruleForm.pageNumber = val;
      this.getList();
    },
    ...mapActions(["getCycleType"])
  },
  computed: {
    ...mapState(["cycleType"])
  }
};
</script>

<style lang="scss" scoped>
.select {
  ul {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    li {
      margin-right: 20px;
    }
    .flex {
      display: flex;
      flex-direction: row;
      span {
        width: 110px;
        line-height: 32px;
        text-align: right;
      }
    }
  }
}
.formItemAdd {
  display: flex;
  flex-direction: row;
  .mr10w200 {
    width: 200px;
    margin-right: 10px;
  }
  .w80 {
    .el-form-item__label {
      width: 80px !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .icon {
    line-height: 40px;
    padding: 0 20px;
    font-size: 24px;
    cursor: pointer;
    &:hover {
      color: #3a8ee6;
    }
  }
}
</style>

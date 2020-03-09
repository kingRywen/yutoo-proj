<template lang="html">
    <section class="intelligent-replenishment">
        <!-- -->
        <IRLayout>
            <!--   -->
            <template slot="header">
                <div class="title" style="display:flex"> <div @click="back"> <i class="el-icon-arrow-left"></i> 智能补货列表 </div>
                <div> <img :src="lockStatus ? '/static/lock.png' : '/static/unlock.png'" width="30" @click.self="unlock" style="vertical-align: middle;"/></div>
                  <!-- <img src="/static/lock.png" width="30" @click.self="unlock" style="vertical-align: middle;"/> -->
                </div>
                <ul class="title-btn">
                    <li>
                        <el-button type="primary" size="small" @click="exportData">
                            确认并导出数据
                        </el-button>
                    </li>
                </ul>
            </template>
            <!-- 搜索  -->
            <template slot="select">
  <ul class="selectList">
    <li>
      <el-select v-model="select.platformId" multiple placeholder="来源平台（可多选）" collapse-tags size="small" @change="handlerPlatformIdChange">
        <el-option v-for="item in sourcePlatformList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </li>
    <li>
      <el-select v-model="select.shopId" multiple placeholder="来源店铺（可多选）" collapse-tags size="small">
        <el-option v-for="item in sourceShopList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </li>

    <li class="inputrow">
      <span>产品sku：</span>
      <el-input clearable size="small" v-model="select.sku" />
    </li>
    <li class="inputrow">
      <span>产品名称：</span>
      <el-input clearable size="small" v-model="select.productName" />
    </li>
    <li>
      <el-button type="primary" size="small" @click="onSeek()" icon="el-icon-search">搜 索</el-button>
    </li>
  </ul>
</template>
            <!-- table -->
            <template slot="table">
  <p class="userSelect">已选择：
    <strong>{{hasSelect}}</strong> 条</p>
  <el-table v-loading="loading" @selection-change="userSelectTable" @select="selectTable" @select-all="selectTable" element-loading-text="拼命加载中" :data="tableData" tooltip-effect="dark" ref="table" style="width: 100%" class="curtable">
    <el-table-column type="selection" width="30" :disabled="true" />
    <el-table-column label="产品图片" width="130" align="content">
      <template slot-scope="scope">
        <div class="imgbox">
          <img :src="scope.row.productImage || '/static/no-image.jpg'" width='80' height="80" alt="">
          <el-button v-if="scope.row.childs.length > 0 && scope.row._isOpen" type="text" @click="viewVariant(scope.row, scope.$index)">查看变体</el-button>
          <el-button v-if="scope.row.childs.length > 0 && !scope.row._isOpen" type="text" @click="closeVariant(scope.row, scope.$index)">折叠变体</el-button>
          <!-- <img src="/static/icons/intelligent_replenishment/top.png" alt="" class="hintIcon" width="58" height="58"> -->
        </div>
      </template>
    </el-table-column>
    <el-table-column label="产品名称" width="320" align="left">
      <template slot-scope="scope">
        <p>{{scope.row.productName | _formatData}}</p>
        <p>sku：{{scope.row.sku | _formatData}}</p>
        <p>店铺：{{scope.row.shopName | _formatData}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="warehouseName" label="仓库" width="140" align="center" :formatter="_formatter" />
    <el-table-column label="当前库存" width="140" align="center" :render-header="handlerRenderHeader1">
      <template slot-scope="scope">
        <el-button-group>
          <el-button plain size="mini">{{scope.row.actualStock | _formatData}}</el-button>
          <el-tooltip placement="bottom" effect="light" content="Bottom Center" @mouseenter.native="handlerToolTipMouseenter(scope.row, scope.$index)" @mouseleave.native="handlerToolTipMouseleave">
            <div slot="content">
              <table-hover :table-data="tableDatas[scope.$index]" />
            </div>
            <el-button type="info" size="mini">{{scope.row.transportStock | _formatData}}</el-button>
          </el-tooltip>
        </el-button-group>
      </template>
    </el-table-column>
    <el-table-column prop="purchaseAccount" label="采购中" width="80" align="center" :formatter="_formatter" />
    <el-table-column label="日销量/平均日销量" width="140" align="center" :render-header="handlerRenderHeader2">
      <template slot-scope="scope">
        <el-tooltip placement="bottom" effect="light" content="Bottom Center" @mouseenter.native="handlerToolTipMouseenter1(scope.row, scope.$index)" @mouseleave.native="handlerToolTipMouseleave">
          <div slot="content">
            <DailyBox :table-data="tableDatasDailySales[scope.$index]" />
          </div>
          <div>
            <el-button type="text" style="color:#333;">{{scope.row.dailySales | _formatData}}</el-button>
            <i> / </i>
            <el-button type="text">{{scope.row.avgSales | _formatData}}</el-button>
          </div>
        </el-tooltip>

      </template>
    </el-table-column>
    <el-table-column label="预计日销量" width="140" align="center">
      <template slot-scope="scope">
        <div @click="tips">
          <el-input clearable :disabled="scope.row.parentFlag && scope.row.childs.length > 0 && scope.row._isOpen || lockStatus" v-model.number="scope.row.expectedDailySales" @input="setVariantNum(scope.row, scope.$index, $event)"></el-input>
        </div>

      </template>
    </el-table-column>
    <el-table-column label="运输方式" width="140" align="center">
      <template slot-scope="scope">
        <div v-if="!scope.row._show">
          <p v-for="(item, index) in scope.row.listSMP" :key="index" style="line-height:3em">{{item.transportName | _formatData}}</p>
        </div>

        <div v-else>
          <p style="line-height:3em">{{scope.row.listSMP[0].transportName | _formatData}}</p>
        </div>

        <el-tooltip placement="bottom" effect="light" content="Bottom Center">
          <div slot="content">
            <input-table :table-data="scope.row.listSMP" />
          </div>
          <img src="/static/icons/intelligent_replenishment/more.png" width="21" height="21" alt="" class="more" @click="toggleListSMPClick(scope.row)">
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="准备天数" width="140" align="center">
      <template slot-scope="scope">
        <div v-if="!scope.row._show">
          <div v-for="(item, index) in scope.row.listSMP" :key="index">
            <p>运输天数：{{item.transportDays | _formatData}}</p>
            <p>保底销售天数：{{item.insuredDays | _formatData}}</p>
          </div>
        </div>

        <div v-else>
          <p>运输天数：{{scope.row.listSMP[0].transportDays | _formatData}}</p>
          <p>保底销售天数：{{scope.row.listSMP[0].insuredDays | _formatData}}</p>
        </div>

      </template>
    </el-table-column>
    <el-table-column prop="stockDays" label="备货天数" width="80" align="center" :formatter="_formatter" />
    <el-table-column prop="availableStock" label="可售库存" width="80" align="center" :formatter="_formatter" />
    <el-table-column prop="availableDayCount" label="可售天数" width="80" align="center" :formatter="_formatter" />
    <el-table-column prop="lackDayCount" label="缺货天数" width="80" align="center" :formatter="_formatter" />
    <el-table-column label="补货数量" width="150" fixed="right" align="center">
      <template slot-scope="scope">
        <div @click="tips">
          <el-input clearable v-if="scope.row._show" :disabled="scope.row.childs.length > 0 && scope.row._isOpen || lockStatus" v-model.number="scope.row.listSMP[0].needReplenishNum"></el-input>
          <div v-else>
            <el-input clearable style="margin-bottom:8px" v-for="(item, index) in scope.row.listSMP" :key="index" :disabled="item.parentFlag || lockStatus" v-model.number="item.needReplenishNum"></el-input>
          </div>
        </div>

      </template>
    </el-table-column>
  </el-table>
</template>

        </IRLayout>

        <!--  -->
        <!-- 更改恢复生命周期-->
        <el-dialog title="批量更改产品周期" :visible.sync="periodDialog" width="30%" center append-to-body>
            <div style="text-align: center;">
                <span>选择周期：</span>
                <el-select  placeholder="产品生命周期" v-model="userProductCycle" clearable>
                    <el-option v-for="(val,key,index) in cycleList.cycleType" :key="index" :label="key" :value="val"/>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="periodDialog = false">取 消</el-button>
                <el-button type="primary" @click="onChangePeriod()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入导入运输中数量 -->
        <el-dialog title="导入运输中数量" :visible.sync="toLeadDialog" width="30%" center append-to-body>
            <div style="display:flex;">
                <el-button type="primary" plain size="medium" icon="el-icon-download" style="margin-right:10px;">下载模板</el-button>
                <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple :limit="1">
                    <el-button size="medium" type="primary" >点击上传 <i class="el-icon-upload2"/> </el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toLeadDialog = false">取 消</el-button>
                <el-button type="primary" @click="ontoLead()" >确 定</el-button>
            </span>
        </el-dialog>

        <!-- 提示解锁 -->
        <el-dialog
          title="提示"
          :visible.sync="tipVisible"
          width="50%">
          <span>请先点击解锁按钮进行解锁</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="tipVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </section>
</template>

<script>
import TableHover from "@/components/intelligent_replenishment/table";
import InputTable from "@/components/intelligent_replenishment/inputTable";
import ReplenishTable from "@/components/intelligent_replenishment/ReplenishTable";
import DailyBox from "@/components/intelligent_replenishment/dailySalesBox";
import { mapState, mapActions, mapMutations } from "vuex";
import { fetchData, showToast, downloadFile } from "@/common/common";
import apis from "@/apis";
import { debounce } from "@/common/util";

export default {
  name: "batch-intelligent-replenishment",
  data() {
    return {
      lockStatus: true,

      userProductCycle: null,
      loading: false,
      periodDialog: false,
      type: "",
      toLeadDialog: false,
      tipVisible: false,

      tableData: [], //选中的列表

      platformList: [], //来源平台列表
      storeSourceList: [], //店铺来源列表
      tableDatas: [], // 补货信息列表-当前库存(提示框列表)
      tableDatasDailySales: [], // 日销量(提示框列表)
      tableDatasShipping: [], // 列表-运输方式(提示框列表)\
      tableDatasReplenishmentNum: [], // 列表-在补数量(提示框列表)
      tableDatasDailySalesAvarage: [], // 平均日销量
      productList: [
        {
          //产品table列表
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      attentionList: [
        //是否关注 //是否手动更改生命周期
        {
          label: "是",
          value: 1
        },
        {
          label: "否",
          value: 0
        }
      ],
      hasSelect: 0,
      userList: [], //用户选中的列表
      userSelectListId: [], //用户选中的列表id
      // 业务层
      select: {
        //搜索
        // pageSize: "10",
        // pageNumber: "1",
        // parentId: null,
        // shopId: [],
        // platformId: [],
        // artificialCycle: null,
        // sku: "",
        // productName: ""
      }
    };
  },

  beforeRouteEnter(to, from, next) {
    console.log("进入路由");
    next(vm => {
      // vm.searchList(vm.select);

      vm.getNewData(vm);
    });
  },

  created() {
    let vm = this;
    vm.getNewData(vm);
    // vm.hasSelect = vm.getAllSelected().length;
    // vm.tableData = vm.getAllSelected();
    this.debGetCurrentReplenishmentNum = debounce(
      300,
      this.getCurrentReplenishmentNum
    );
    this._setNum = debounce(500, this.setNum);
    this.debGetCurrentStockList = debounce(300, this.getCurrentStockList);
    this.debGetCurrentShippingList = debounce(300, this.getCurrentShippingList);
    this.debGetCurrentDailySalesList = debounce(
      300,
      this.getCurrentDailySalesList
    );

    this.getCycleList();
  },

  methods: {
    back() {
      this.$router.push("/");
    },
    // 导出数据
    exportData() {
      let list = [];
      this.tableData.forEach(el => {
        const {
          replenishProductId,
          parentId,
          productName,
          sku,
          shopId,
          actualStock,
          transportStock,
          purchaseAccount,
          dailySales,
          expectedDailySales
        } = el;
        let i = {
          replenishProductId,
          parentId: parentId || replenishProductId,
          productName,
          sku,
          shopId,
          actualStock,
          transportStock,
          purchaseAccount,
          dailySales,
          expectedDailySales,
          replenishes: []
        };
        el.listSMP.forEach(smp => {
          if (!smp.needReplenishNum || smp.needReplenishNum === "") {
            return false;
          }
          if (smp.needReplenishNum && smp.needReplenishNum > 0) {
            i.replenishes.push({
              transportName: smp.transportName,
              transportDays: smp.transportDays,
              insuredDays: smp.insuredDays,
              availableDays: smp.availableDayCount,
              stockDays: smp.stockDays,
              outstockDays: smp.null,
              shortageMonitorId: smp.id,
              transportFirstId: smp.transportFirstId,
              replenishNum: smp.needReplenishNum
            });
          }
        });
        list.push(i);
      });
      fetchData({
        ...apis.REPLENISHDETAILED_CONFIRMANDEXPORT,
        data: list
      }).then(res => {
        if (res.data.code === 0) {
          downloadFile(res.data.path);
          this.$confirm("导出数据成功！", "提示", {
            confirmButtonText: "确定",
            type: "success",
            callback: action => {
              this.$router.push("/IntelligentReplenishment/Replenishment");
              this.clearIntelligentReplenishmentList();
            }
          });
        } else {
          showToast("error", res.data.msg);
        }
      });
    },
    // 切换显示运输方式
    toggleListSMPClick(row) {
      // row._show = !row._show;
      this.$set(row, "_show", !row._show);
    },

    // 提示
    tips() {
      if (this.lockStatus) {
        this.tipVisible = true;
      }
    },

    // 解锁
    unlock() {
      this.lockStatus = !this.lockStatus;
    },

    getNewData(vm) {
      let data = [];
      vm.getAllSelected().forEach(el => {
        data.push(el.replenishProductId);
        // if (!el.variantsFlag || (!el.parentFlag && el.variantsFlag)) {
        //   data.push(el.replenishProductId);
        // }
      });
      console.log(data);
      this.replenishProductIds = data;
      fetchData({
        ...apis.REPLENISHPRODUCT_BATCHREPLENISHPRODUCTLIST,
        data: {
          replenishProductIds: data
        }
      }).then(res => {
        let list = res.data.list;
        list.forEach((element, index) => {
          if (element.childs && element.childs.length > 0) {
            list.splice(index + 1, 0, ...element.childs);
          }
        });
        vm.tableData = list;
        vm.hasSelect = list.length;
        vm.$nextTick(() => {
          vm.tableData.forEach(el => {
            vm.$refs.table.toggleRowSelection(el, true);
          });
        });
      });
    },
    viewVariant(row, index) {
      this.$set(row, "_isOpen", false);
      this.tableData.splice(index + 1, 0, ...row.childs);

      // fetchData({
      //   ...apis.REPLENISHPRODUCT_REPLENISHPRODUCTLISTVARIANTS,
      //   data: { parentId: row.replenishProductId }
      // }).then(res => {
      //   if (res.data.code === 0) {
      //     this.addIntelligentReplenishmentList({
      //       index: 1,
      //       items: res.data.list
      //     });
      //   }
      // });
    },

    closeVariant(row, index) {
      // this._isOpen = true
      this.$set(row, "_isOpen", true);
      this.tableData.splice(index + 1, row.childs.length);
    },

    // 鼠标移过显示
    handlerToolTipMouseenter(row, index) {
      console.log(row);
      if (!this.tableDatas[index]) {
        this.timer = this.debGetCurrentStockList(row.asin, index);
      }
    },

    // 鼠标移过显示
    handlerToolTipMouseenter1(row, index) {
      console.log(row);
      if (!this.tableDatasDailySales[index]) {
        this.timer = this.debGetCurrentDailySalesList(row.asin, index);
      }
    },

    // 鼠标移过显示
    handlerToolTipMouseenter2(row, index) {
      console.log(row);
      if (!this.tableDatasShipping[index]) {
        this.timer = this.debGetCurrentShippingList(row.asin, index);
      }
    },

    // 设置日销量
    setVariantNum(row, index, val) {
      if (row.childs && row.childs.length > 0) {
        this._setNum(row, index, val);
      }
    },

    // 设置日销量
    setNum(row, index, val) {
      // if (!('_isOpen' in row)) return
      const len = row.childs.length,
        childs = row.childs;
      if (val % len !== 0) {
        showToast("error", "请设置合适的数量");
        return;
      } else {
        let v = val / len;
        for (let i = index + 1; i <= index + len; i++) {
          const element = this.tableData[i];
          this.$set(element, "expectedDailySales", v);
          // element.expectedDailySales = v
        }
      }
    },

    // 鼠标移过显示
    handlerToolTipMouseenter3(row, index) {
      console.log(row);
      if (!this.tableDatasReplenishmentNum[index]) {
        this.timer = this.debGetCurrentReplenishmentNum(row, index);
      }
    },

    handlerToolTipMouseleave() {
      clearTimeout(this.timer);
    },

    // 自定义表头
    handlerRenderHeader1(h, { column, $index }) {
      console.log(column);
      return h("span", [
        h("span", column.label),
        h(
          "el-tooltip",
          {
            props: {
              effect: "light"
            },
            style: {
              borderColor: "#e8e8e8"
            }
          },
          [
            h(
              "div",
              {
                slot: "content"
              },
              [
                h(
                  "div",
                  {
                    style: {
                      display: "flex",
                      padding: "10px"
                    }
                  },
                  [
                    h(
                      "div",
                      {
                        style: {
                          display: "flex",
                          marginRight: "20px"
                        }
                      },
                      [
                        h(
                          "div",
                          {
                            style: {
                              width: "12px",
                              height: "12px",
                              background: "#909399",
                              border: "1px solid #909399",
                              marginRight: "10px"
                            }
                          }
                          // "实际"
                        ),
                        h("div", "实际")
                      ]
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "flex"
                        }
                      },
                      [
                        h(
                          "div",
                          {
                            style: {
                              width: "12px",
                              height: "12px",
                              background: "#fff",
                              border: "1px solid #ddd",
                              marginRight: "10px"
                            }
                          }
                          // "运输中"
                        ),
                        h("div", "运输中")
                      ]
                    )
                  ]
                )
              ]
            ),
            h(
              "i",
              {
                class: "el-icon-question tips",
                style: {
                  color: "#409EFF",
                  cursor: "pointer",
                  fontSize: "16px",
                  textIndent: "4px"
                }
              },
              ""
            )
          ]
        )
      ]);
    },

    // 自定义表头
    handlerRenderHeader3(h, { column, $index }) {
      console.log(column);
      return h("span", [
        h("span", column.label),
        h(
          "el-tooltip",
          {
            props: {
              effect: "light"
            },
            style: {
              borderColor: "#e8e8e8"
            }
          },
          [
            h(
              "div",
              {
                slot: "content"
              },
              [
                h(
                  "div",
                  {
                    style: {
                      display: "flex",
                      padding: "10px"
                    }
                  },
                  [
                    h(
                      "div",
                      {
                        style: {
                          display: "flex",
                          marginRight: "20px"
                        }
                      },
                      [
                        h("div", {
                          style: {
                            width: "12px",
                            height: "12px",
                            background: "#F4F4F5",
                            border: "1px solid #F4F4F5",
                            marginRight: "10px"
                          }
                        }),
                        h("div", "在补")
                      ]
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "flex"
                        }
                      },
                      [
                        h("div", {
                          style: {
                            width: "12px",
                            height: "12px",
                            background: "#fff",
                            border: "1px solid #ddd",
                            marginRight: "10px"
                          }
                        }),
                        h("div", "还需补")
                      ]
                    )
                  ]
                )
              ]
            ),
            h(
              "i",
              {
                class: "el-icon-question tips",
                style: {
                  color: "#409EFF",
                  cursor: "pointer",
                  fontSize: "16px",
                  textIndent: "4px"
                }
              },
              ""
            )
          ]
        )
      ]);
    },
    // 自定义表头
    handlerRenderHeader2(h, { column, $index }) {
      console.log(column);
      return h("span", [
        h("span", "日销量/"),
        h(
          "span",
          {
            style: {
              color: "#409EFF"
            }
          },
          "平均日销量"
        )
      ]);
    },

    // 获取当前列表-当前库存(提示框列表)
    getCurrentStockList(asin, index) {
      fetchData({
        ...apis.REPLENISHDETAILED_GETREPLENISHTRANSPORTITEM,
        data: {
          asin
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatas, index, res.data.list);
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    // 列表-运输方式(提示框列表)
    getCurrentShippingList(asin, index) {
      fetchData({
        ...apis.REPLENISHPRODUCT_GETTRANSPORTATIONLIST,
        data: {
          asin
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatasShipping, index, res.data.list);
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    // 获取当前列表-日销量提示框
    getCurrentDailySalesList(asin, index) {
      fetchData({
        ...apis.REPLENISHPRODUCTSTATUSRECORD_GETDAILYSALES,
        data: {
          asin
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatasDailySales, index, res.data.list);
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    // 列表-在补(提示框列表)
    getCurrentReplenishmentNum(row, index) {
      fetchData({
        ...apis.REPLENISHPRODUCT_GETREPLENISHDETAILSLIST,
        data: {
          asin: row.asin,
          transportFirstId: row.transportFirstId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$set(this.tableDatasReplenishmentNum, index, res.data.list);
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    //导入确定
    ontoLead() {},
    //批量关注和取消关注
    attention(type) {
      if (this.userList.length) {
        this.userAttention = null;
        this.attentionDialog = true;
        this.type = type;
        if (type) {
          this.$confirm("是否全部关注?", "提示", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning"
          }).then(() => {
            this.sendAttention("REPLENISHPRODUCT_UPDATEATTENTIONFLAG", 1);
          });
        } else {
          this.$confirm("是否取消全部关注?", "提示", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning"
          }).then(() => {
            this.sendAttention("REPLENISHPRODUCT_UPDATEATTENTIONFLAG", 0);
          });
        }
      } else {
        this.userHint("warning", "请先勾选您要操作的产品!");
      }
    },
    sendAttention(url, num) {
      const obj = {
        pageNumber: 1,
        pageSize: 10
      };
      return fetchData({
        ...apis[url],
        data: {
          attentionFlag: num,
          replenishProductId: this.userSelectListId
        }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          this.attentionDialog = false;
          this.getIntelligentReplenishmentList(obj);
        } else {
          showToast("error", res.data.msg);
        }
      });
    },
    //更改产品生命周期
    changePeriod(type) {
      if (this.userList.length) {
        this.userProductCycle = null;
        this.periodDialog = true;
        this.type = type;
      } else {
        this.userHint("warning", "请先勾选您要操作的产品!");
      }
    },
    //生命周期确定
    onChangePeriod(url) {
      //恢复系统周期
      if (this.type) {
        this.sendChangePeriod("REPLENISHPRODUCT_RECOVERYPRODUCTCYCLE");
        //更改生命周期
      } else {
        this.sendChangePeriod("REPLENISHPRODUCT_UPDATEPRODUCTCYCLE");
      }
    },
    sendChangePeriod(url) {
      if (this.userProductCycle) {
        const obj = {
          pageNumber: 1,
          pageSize: 10
        };
        return fetchData({
          ...apis[url],
          data: {
            productCycle: this.userProductCycle,
            replenishProductId: this.userSelectListId
          }
        }).then(res => {
          if (res.data.code === 0) {
            showToast("success", res.data.msg);
            this.periodDialog = false;
            this.getIntelligentReplenishmentList(obj);
          } else {
            showToast("error", res.data.msg);
          }
        });
      }
    },
    //table选中的
    userSelectTable(val) {
      console.log(val);

      this.userList = val;
      this.userSelectListId = val.map(item => item.replenishProductId);
      this.hasSelect = val.length;
    },

    selectTable(selection) {
      return;
      // 存储到vuex中
      this.setIntelligentSelected({
        item: selection
      });
      this.$nextTick(() => {
        let selected = this.getAllSelected();
        this.hasSelect = selected.length;
      });
    },
    //搜索
    onSeek() {
      this.getBatchIntelligentReplenishmentList();
    },
    getBatchIntelligentReplenishmentList() {
      fetchData({
        ...apis.REPLENISHPRODUCT_BATCHREPLENISHPRODUCTLIST,
        data: {
          replenishProductIds: this.replenishProductIds,
          ...this.select
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.tableData = res.data.list;
        }
      });
    },

    userHint(status = "success", msg = "操作成功") {
      this.$message({
        message: msg,
        type: status,
        center: true
      });
    },
    handlerPlatformIdChange(e) {
      this.select.shopId.splice(0);
      this.getSourceShopList({
        platformIds: e.join(",")
      });
    },
    // 清空数据
    clearData() {
      this.tableDatas.splice(0);
      this.tableDatasDailySales.splice(0);
      this.tableDatasShipping.splice(0);
    },

    getAllSelected() {
      let selected = this.intelligentReplenishmentSelected,
        arr = [];
      for (const key in selected) {
        if (selected.hasOwnProperty(key)) {
          const element = selected[key];
          arr = arr.concat(element);
        }
      }

      return [...new Set(arr)];
    },

    setSelected() {
      let selected = this.getAllSelected();

      console.log(selected);
      this.intelligentReplenishmentList.rows.map((el, index) => {
        if (
          selected.find(i => i.replenishProductId === el.replenishProductId)
        ) {
          console.log(index);
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.table.toggleRowSelection(el, true);
            });
          }, 0);
        }
      });
    },
    getIntelligentReplenishmentSelected() {
      // 选择的数据
      let selected = this.intelligentReplenishmentSelected;
    },
    ...mapActions([
      "getIntelligentReplenishmentList",
      "getSourceShopList",

      "getCycleList"
    ]),
    ...mapMutations([
      "setIntelligentSelected",
      "clearIntelligentReplenishmentList",
      "addIntelligentReplenishmentList"
    ])
  },
  computed: mapState([
    "sourcePlatformList",
    "sourceShopList",
    "intelligentReplenishmentList",
    "cycleList",
    "intelligentReplenishmentSelected"
  ]),
  components: {
    TableHover,
    DailyBox,
    InputTable,
    ReplenishTable
  },
  watch: {
    "intelligentReplenishmentList.rows"(val) {
      this.setSelected();
    }
  }
};
</script>

<style lang="scss" scoped>
@mixin flex($direction: columin, $inline: block) {
  display: if($inline==block, flex, inline-flex);
  flex-direction: $direction;
  flex-wrap: wrap;
}
.intelligent-replenishment {
  height: 100%;
}
.title-btn {
  @include flex(row);
  padding-right: 10px;
  border: 1px solid #bdb9b9;
  border-bottom: none;
  li {
    margin-left: 10px;
    padding-right: 10px;
    border-right: 1px solid #bdb9b9;
    &:last-child {
      border-right: none;
      padding-right: 0;
    }
  }
}
.selectList {
  @include flex(row);
  li {
    width: 184px;
    margin-right: 10px;
  }
  .inputrow {
    @include flex(row);
    color: #333;
    width: 210px;
    .el-input {
      width: 130px;
    }
    span {
      line-height: 32px;
    }
  }
}
.userSelect {
  padding-bottom: 10px;
  strong {
    color: #00ccff;
  }
}
.curtable {
  border-top: 1px solid #bdb9b9;
  .imgbox {
    text-align: center;
    margin-top: 10px;
    position: relative;
    img {
      display: inline-block;
    }
    .hintIcon {
      position: absolute;
      top: -13px;
      left: -3px;
    }
    .el-button {
      padding: 0;
    }
  }
  .more {
    margin-top: 5px;
    cursor: pointer;
  }
}
</style>

<template lang="html">
    <section class="intelligent-replenishment">
        <!-- -->
        <IRLayout>
            <!--   -->
            <template slot="header">
                <div class="title">智能补货列表</div>
                <ul class="title-btn">
                    <li>
                        <el-button type="primary" size="small" @click="onManualSync">手动同步</el-button>
                        <el-button type="primary" size="small" @click="$router.push('/IntelligentReplenishment/SynchronousLog')">同步日志</el-button>
                    </li>
                    <li>
                        <el-button type="primary" size="small" @click="$router.push('/IntelligentReplenishment/setCalculate')">
                        计算公式参数设置
                            <!-- <router-link :to="{ path:'/IntelligentReplenishment/setCalculate', params: {} }">计算公式参数设置</router-link> -->
                        </el-button>
                    </li>
                    <li>
                        <el-button type="primary" size="small" @click="changePeriod(1)">恢复系统周期</el-button>
                        <el-button type="primary" size="small" @click="changePeriod(0)">更改生命周期</el-button>
                    </li>
                    <li>
                        <el-button type="primary" size="small" @click="attention(1)">批量关注</el-button>
                        <el-button type="primary" size="small" @click="attention(0)">批量取消关注</el-button>
                    </li>
                    <li>
                        <el-button type="primary" size="small">导入采购中数量</el-button>
                        <el-button type="primary" size="small" @click="toLeadDialog=true">导入运输中数量</el-button>
                    </li>
                    <li>
                        <el-button type="primary" size="small" @click="$router.push('/IntelligentReplenishment/batchReplenishment')">
                          批量补货
                           <!-- <router-link :to="{ path: '/IntelligentReplenishment/batchReplenishment', params: {} }" tag="span">批量补货</router-link> -->
                        </el-button>
                        <el-button type="primary" size="small" @click="$router.push('/IntelligentReplenishment/Replenishment')">
                        补货明细
                            <!-- <router-link :to="{ path: '/IntelligentReplenishment/Replenishment', params: {} }" tag="span">补货明细</router-link> -->
                        </el-button>
                    </li>
                </ul>
            </template>
            <!-- 搜索  -->
            <template slot="select">
                  <ul class="selectList">
                    <li>
                      <el-select v-model="select.platformId" multiple placeholder="来源平台（可多选）" filterable clearable collapse-tags size="small" @change="handlerPlatformIdChange">
                        <el-option v-for="item in sourcePlatformList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-select v-model="select.shopId" multiple placeholder="来源店铺（可多选）" filterable clearable collapse-tags size="small">
                        <el-option v-for="item in sourceShopList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                    </li>
                    <li>
                      <el-select placeholder="产品生命周期" clearable size="small" v-model="select.productCycle">
                        <!-- <el-option v-for="item in periodList" :key="item.value" :label="item.label" :value="item.value" /> -->
                        <el-option v-for="(val,key,index) in cycleList" :key="index" :label="key" :value="val" />
                      </el-select>
                    </li>
                    <li>
                      <el-select placeholder="是否手动更改周期" clearable size="small" v-model="select.artificialCycle">
                        <el-option v-for="item in attentionList" :key="item.value" :label="item.label" :value="item.value" />
                      </el-select>
                    </li>
                    <li>
                      <el-select placeholder="是否关注" clearable size="small" v-model="select.attentionFlag">
                        <el-option v-for="item in attentionList" :label="item.label" :key="item.value" :value="item.value" />
                      </el-select>
                    </li>
                    <li class="inputrow">
                      <span>产品sku：</span>
                      <el-input size="small" v-model="select.sku" />
                    </li>
                    <li class="inputrow">
                      <span>产品名称：</span>
                      <el-input size="small" v-model="select.productName" />
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
  <el-table v-loading="loading" @selection-change="userSelectTable" @select="selectTable" @select-all="selectTable" element-loading-text="拼命加载中" :data="intelligentReplenishmentList.rows" tooltip-effect="dark" ref="table" style="width: 100%" class="curtable">
    <el-table-column type="selection" width="30" />
    <el-table-column label="产品图片" width="130" align="content">
      <template slot-scope="scope">
        <div class="imgbox">
            <el-tooltip effect="light"  placement="right">
                <img slot="content" :src="scope.row.productImage || '/static/no-image.jpg'" width='auto' height="340" alt="">
                <img :src="scope.row.productImage || '/static/no-image.jpg'" width='50' height="60" alt="">
            </el-tooltip>

          <el-button v-if="scope.row.variantsFlag && scope.row.parentFlag && scope.row._isOpen" type="text" @click="closeVariant(scope.row, scope.$index)">关闭变体</el-button>
          <el-button v-if="scope.row.variantsFlag && scope.row.parentFlag && !scope.row._isOpen" type="text" @click="viewVariant(scope.row, scope.$index)">查看变体</el-button>
          <img v-if="isCycle(scope.row) == 1" src="/static/icons/intelligent_replenishment/top.png" alt="" class="hintIcon" width="58" height="58">
          <!-- 上升 -->
          <img v-if="isCycle(scope.row) == 2" src="/static/icons/intelligent_replenishment/bottom.png" alt="" class="hintIcon" width="58" height="58">
          <!-- 下降 -->
          <img v-if="isCycle(scope.row) == 3" src="/static/icons/intelligent_replenishment/usertop.png" alt="" class="hintIcon" width="58" height="58">
          <!-- 手动上升 -->
          <img v-if="isCycle(scope.row) == 4" src="/static/icons/intelligent_replenishment/userbottom.png" alt="" class="hintIcon" width="58" height="58">
          <!-- 手动下降 -->
          <img v-if="isCycle(scope.row) == 5" src="/static/icons/intelligent_replenishment/keep.png" alt="" class="hintIcon" width="58" height="58">
          <!-- 关注 -->
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
        <div>{{scope.row.actualStock + scope.row.transportStock}}</div>
        <el-button-group>
          <el-button plain size="mini">{{scope.row.actualStock | _formatData}}</el-button>
          <el-tooltip :open-delay="300" placement="bottom" effect="light" content="Bottom Center" @mouseenter.native="handlerToolTipMouseenter(scope.row, scope.$index)" @mouseleave.native="handlerToolTipMouseleave">
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
        <el-tooltip :open-delay="300" placement="bottom" effect="light" content="Bottom Center" @mouseenter.native="handlerToolTipMouseenter1(scope.row, scope.$index)" @mouseleave.native="handlerToolTipMouseleave">
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
    <el-table-column label="运输方式" width="140" align="center">
      <template slot-scope="scope">
        <p>{{scope.row.transportName | _formatData}}</p>
        <el-tooltip :open-delay="300" placement="bottom" effect="light" content="Bottom Center" @mouseenter.native="handlerToolTipMouseenter2(scope.row, scope.$index)" @mouseleave.native="handlerToolTipMouseleave">
          <div slot="content">
            <input-table :table-data="tableDatasShipping[scope.$index]" />
          </div>
          <div @click="showTransDialog(scope.$index)"><img src="/static/icons/intelligent_replenishment/more.png" width="21" height="21" alt="" class="more"></div>

        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="准备天数" width="140" align="center">
      <template slot-scope="scope">
        <p>运输天数：{{scope.row.transportDays | _formatData}}</p>
        <p>保底销售天数：{{scope.row.insuredDays | _formatData}}</p>
      </template>
    </el-table-column>
    <el-table-column prop="stockDays" label="备货天数" width="80" align="center" :formatter="_formatter" />
    <el-table-column prop="availableStock" label="可售库存" width="80" align="center" :formatter="_formatter" />
    <el-table-column prop="availableDayCount" label="可售天数" width="80" align="center" :formatter="_formatter" />
    <el-table-column prop="lackDayCount" label="缺货天数" width="80" align="center" :formatter="_formatter" />
    <el-table-column label="补货详情" width="150" fixed="right" align="center" :render-header="handlerRenderHeader3">
      <template slot-scope="scope">
        <span style="color:#00CCFF;">{{scope.row.stockDaysCountdown | _formatData}}</span>天
        <el-button-group>
          <el-tooltip placement="bottom" effect="light" content="Bottom Center" @mouseenter.native="handlerToolTipMouseenter3(scope.row, scope.$index)" @mouseleave.native="handlerToolTipMouseleave">
            <div slot="content">
              <replenish-table :table-data="tableDatasReplenishmentNum[scope.$index]" />
            </div>
            <el-button plain type="info" size="mini">{{ scope.row.inReplenishmentNum | _formatData}}</el-button>
          </el-tooltip>
          <el-button plain size="mini">{{scope.row.restockNumNeeded | _formatData}}</el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>
            <!-- 分页 -->
            <template slot="footer">
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="intelligentReplenishmentList.pageNo" :page-sizes="[10, 20, 50, 100, 200]" :page-size="intelligentReplenishmentList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="intelligentReplenishmentList.total">
  </el-pagination>
</template>
        </IRLayout>

        <!--  -->
        <!-- 更改恢复生命周期-->
        <el-dialog :title="!type ? '批量更改产品周期' : '是否恢复生命周期'" :visible.sync="periodDialog" width="30%" center append-to-body>
            <div v-if="!type" style="text-align: center;">
                <span>选择周期：</span>
                <el-select  placeholder="产品生命周期" v-model="userProductCycle">
                    <el-option v-for="(val,key,index) in cycleList" :key="index" :label="key" :value="val"/>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="periodDialog = false">取 消</el-button>
                <el-button type="primary" @click="onChangePeriod()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 导入导入运输中数量 -->
        <el-dialog title="导入运输中数量" :visible.sync="toLeadDialog" width="30%" center append-to-body class="____inteReplinshment">

                <el-button type="primary" plain size="medium" icon="el-icon-download" style="position: absolute;left: 153px;" @click="download()">下载模板</el-button>
                <el-upload class="upload-demo"
                    :headers="uploadHeader"
                    :action="uploadURL"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    :with-credentials="true"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    multiple>
                    <el-button size="medium" type="primary" >点击上传 <i class="el-icon-upload2"/> </el-button>
                    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-upload>
            <!-- 上传的模板信息 -->
            <div class="tempInfo" v-if="uploadAfterInfo.success">
                <ul style="margin-top:40px">
                    <li v-for="(item,index) in uploadAfterInfo.info.errorInfos">{{index+1}}. {{item}}</li>
                </ul>
                <h4>
                    <span>批次号：{{uploadAfterInfo.info.batchNumber}}</span>
                    <span>最早到货时间：{{uploadAfterInfo.info.fastestArrival}}</span>
                </h4>
                <el-table :data="uploadAfterInfo.info.items" border style="width: 100%">
                    <el-table-column prop="asin" label="产品ID" align="center"/>
                    <el-table-column prop="sku" label="SKU" align="center"/>
                    <el-table-column prop="count" label="数量" align="center"/>
                    <el-table-column prop="price" label="价格" align="center"/>
                    <el-table-column  label="提示" align="center">
                        <template slot-scope="scope">
  <p v-for="item in scope.row.errorInfo" style="color:#ff3c3c;">{{item}}</p>
</template>
                    </el-table-column>
                 </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="toLeadDialog = false">取 消</el-button>
                <el-button type="primary" @click="ontoLead()" >确 定</el-button>
            </span>
        </el-dialog>
        <!-- 提示 -->
        <el-dialog
          title="详情"
          :visible.sync="tipVisible"
          width="60%">
          <div>
            <input-table :is-h="true" v-if="shippingIndex != null" :table-data="shippingIndex != null ? tableDatasShipping[shippingIndex] : []" />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="tipVisible = false">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 手动同步 -->
        <el-dialog title="手动同步"  :visible.sync="manualSyncDialog"  width="408px"  center>
            <el-form :model="manualSyncForm" :rules="manualSyncRules" ref="manualSyncForm" label-width="100px" class="manualSyncForm">
                <el-form-item label="选择平台：" prop="platformId">
                    <el-select v-model.number="manualSyncForm.platformId" @change="changePlatform">
                        <el-option v-for="item in syncPlatformList" :label="item.platformName" :value="item.platformId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择站点：" prop="siteId">
                    <el-select v-model.number="manualSyncForm.siteId" @change="changeSite" @focus="focusSite">
                        <el-option v-for="item in syncSiteList" :label="item.siteNameZh" :value="item.siteId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择店铺：" prop="storeId">
                    <el-select v-model.number="manualSyncForm.storeId"  @focus="focusStore">
                        <el-option v-for="item in syncStoreList" :label="item.name" :value="item.storeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择类型：" prop="synType">
                    <el-select v-model.number="manualSyncForm.synType">
                        <el-option v-for="(value,key) in syncTypeList" :label="key" :value="value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
          <span slot="footer">
            <el-button type="primary" @click="submitSyncForm('manualSyncForm')">确 认 同 步</el-button>
          </span>
        </el-dialog>
    </section>
</template>

<script>
import TableHover from "@/components/intelligent_replenishment/table";
import InputTable from "@/components/intelligent_replenishment/inputTable";
import ReplenishTable from "@/components/intelligent_replenishment/ReplenishTable";
import DailyBox from "@/components/intelligent_replenishment/dailySalesBox";
import {
    mapState,
    mapActions,
    mapMutations
} from "vuex";
import {
    fetchData,
    showToast,
    _storage
} from "@/common/common";
import apis from "@/apis";
import {
    debounce
} from "@/common/util";
import {
    BASE_URL,REP_URL
} from "@/common/config";

export default {
    name: "intelligent-replenishment",
    data() {
        return {
            syncPlatformList: [],
            syncSiteList: [],
            syncStoreList: [],
            syncTypeList: {},
            manualSyncRules: {
                platformId: [{
                    type: 'date',
                    required: true,
                    message: '请选择平台',
                    trigger: 'change'
                }],
                siteId: [{
                    type: 'date',
                    required: true,
                    message: '请选择站点',
                    trigger: 'change'
                }],
                synType: [{
                    type: 'date',
                    required: true,
                    message: '请选择店铺',
                    trigger: 'change'
                }],
                storeId: [{
                    type: 'date',
                    required: true,
                    message: '请选择类型',
                    trigger: 'change'
                }]
            },
            manualSyncForm: {
                platformId: null,
                siteId: null,
                synType: null,
                storeId: null,
            },
            manualSyncDialog: false,


            shippingIndex: null,
            uploadAfterInfo: {
                //上传成功之后的模板信息
                success: false,
                uploadCode: null,
                info: {}
            },
            uploadHeader: {
                token: _storage._get('local', 'token')
            },
            uploadURL: REP_URL + "/replenishDetailed/uploadShippingCount",

            tipVisible: false,

            userProductCycle: null,
            loading: false,
            periodDialog: false,
            type: "",
            toLeadDialog: false,

            platformList: [], //来源平台列表
            storeSourceList: [], //店铺来源列表
            tableDatas: [], // 补货信息列表-当前库存(提示框列表)
            tableDatasDailySales: [], // 日销量(提示框列表)
            tableDatasShipping: [], // 列表-运输方式(提示框列表)
            tableDatasDailySalesAvarage: [], // 平均日销量
            tableDatasReplenishmentNum: [], // 列表-在补数量(提示框列表)
            productList: [{
                //产品table列表
                date: "2016-05-03",
                name: "王小虎",
                address: "上海市普陀区金沙江路 1518 弄"
            }],
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
                pageSize: "10",
                pageNumber: "1",
                parentId: null,
                shopId: [],
                platformId: [],
                artificialCycle: null,
                sku: "",
                productName: ""
            }
        };
    },

    beforeRouteEnter(to, from, next) {
        console.log("进入路由");

        next(vm => {
            // vm.$store.commit("setLoading", false);
            vm.searchList(vm.select);
            vm.hasSelect = vm.getAllSelected().length;
        });
    },

    beforeRouteLeave(to, from, next) {
        // this.$store.commit("setLoading", true);
        console.log(123113);
        if (to.path.indexOf("/IntelligentReplenishment/batchReplenishment") > -1) {
            if (Object.keys(this.intelligentReplenishmentSelected).length <= 0) {
                showToast("error", "请至少选择一个产品进行补货");
                return next(false);
            }
        }
        next();
    },

    created() {
        this.debGetCurrentStockList = debounce(300, this.getCurrentStockList);
        this.debGetCurrentShippingList = debounce(300, this.getCurrentShippingList);
        this.debGetCurrentReplenishmentNum = debounce(
            300,
            this.getCurrentReplenishmentNum
        );
        this.debGetCurrentDailySalesList = debounce(
            300,
            this.getCurrentDailySalesList
        );

        this.getCycleList();


    },

    methods: {
        focusSite(){
           if(!this.manualSyncForm.platformId){
                this.$notify.info({
                  title: '提示',
                  message: '请先选择平台'
                });
           }
        },
        focusStore(){
           if(!this.manualSyncForm.siteId){
               this.$notify.info({
                 title: '提示',
                 message: '请先选择站点'
               });
           }
        },
        //
        submitSyncForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    fetchData({
                        ...apis.REPLENISHSYN_SYNSTOREINFO,
                        data:{
                            storeId:this.manualSyncForm.storeId,
                            synType:this.manualSyncForm.synType
                        }
                    }).then(res=>{
                        if(res.data.code==0){
                            this.$message({
                              message: res.data.msg,
                              type: 'success'
                            });
                            this.manualSyncDialog = false;
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 切换站点更新店铺
        changeSite(val) {
            this.manualSyncForm.storeId = null;
            fetchData({
                ...apis.STORE_LIST_BY_SITE,
                data: {
                    siteIds: Array.of(val)
                }
            }).then(res => {
                if (res.data.code == 0) {
                    this.syncStoreList = res.data.rows
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //切换平台更新站点
        changePlatform(val) {
            this.manualSyncForm.siteId = null;
            this.syncPlatformList.forEach(item => {
                if (item.platformId == val) {
                    this.syncSiteList = item.siteList
                }
            })
        },
        //手动同步
        onManualSync() {
            this.manualSyncDialog = true;
            if (!this.syncPlatformList.length) this.getPlatform()
            if (Object.keys(this.syncTypeList).length < 1) this.getTypes()
        },
        //获取手动同步类型
        getTypes() {
            fetchData({
                ...apis.REPLENISHSYN_GETSYNTYPE,
                data: {}
            }).then(res => {
                console.log(res)
                if (res.data.code == 0) {
                    this.syncTypeList = res.data.map
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        //获取平台
        getPlatform() {
            fetchData({
                ...apis.PLATFORMSITE,
            }).then(res => {
                console.log(res)
                if (res.data.code == 0) {
                    this.syncPlatformList = res.data.rows
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },








        isCycle(row) {
            // 先判断是否有关注，如果没有
            // 判断是否有手动设置上升下降
            // 最后判断系统上升下降
            if (!row.attentionFlag) {
                return 5;
            }
            if (row.artificialCycle == 0) {
                if (row.productCycle === 1) {
                    return 3;
                }
                if (row.productCycle === 3) {
                    return 4;
                }
            } else {
                if (row.productCycle === 1) {
                    return 1;
                }
                if (row.productCycle === 3) {
                    return 2;
                }
            }
        }, //上传失败
        uploadError(err) {
            if (err.type == "error") {
                this.$message.error("上传失败");
            }
        },

        //上传成功
        uploadSuccess(response, file, fileList) {
            console.log(response);
            if (response.code == 0) {
                this.uploadAfterInfo.success = true;

                this.uploadAfterInfo.uploadCode = response.uploadCode;
                this.uploadAfterInfo.info = Object.assign({}, response.info);
            } else {
                this.$message.error(response.msg);
            }
        },
        //上传运输中的数量
        beforeUpload(file) {},
        //下载运输中模板
        download() {
            fetchData({
                ...apis.REPLENISHDETAILED_DOWNLOADSHIPPINGCOUNTMODEL,
                data: {}
            }).then(res => {
                // console.log(res)
                if (res.data.code == 0) {
                    window.location.href = res.data.path;
                } else {
                    showToast("error", res.data.msg);
                }
            });
        },
        showTransDialog(index) {
            this.shippingIndex = index;
            this.tipVisible = true;
        },
        viewVariant(row, index) {
            this.clearData();
            fetchData({
                ...apis.REPLENISHPRODUCT_REPLENISHPRODUCTLISTVARIANTS,
                data: {
                    parentId: row.replenishProductId
                }
            }).then(res => {
                if (res.data.code === 0) {
                    if (row.checked) {}
                    this.$set(row, "_isOpen", true);
                    this.$set(row, "_len", res.data.list.length);
                    this.insertIntelligentReplenishmentList({
                        index: index,
                        info: res.data.list
                    });
                } else {
                    showToast("error", res.data.msg);
                }
            });
        },
        // 取消查看变体
        closeVariant(row, index) {
            this.clearData();
            this.$set(row, "_isOpen", false);
            console.log(row._len, "----------------------");
            this.delIntelligentReplenishmentList({
                len: row._len,
                index
            });
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
        handlerRenderHeader1(h, {
            column,
            $index
        }) {
            console.log(column);
            return h("span", [
                h("span", column.label),
                h(
                    "el-tooltip", {
                        props: {
                            effect: "light"
                        },
                        style: {
                            borderColor: "#e8e8e8"
                        }
                    }, [
                        h(
                            "div", {
                                slot: "content"
                            }, [
                                h(
                                    "div", {
                                        style: {
                                            display: "flex",
                                            padding: "10px"
                                        }
                                    }, [
                                        h(
                                            "div", {
                                                style: {
                                                    display: "flex",
                                                    marginRight: "20px"
                                                }
                                            }, [
                                                h(
                                                    "div", {
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
                                            "div", {
                                                style: {
                                                    display: "flex"
                                                }
                                            }, [
                                                h(
                                                    "div", {
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
                            "i", {
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
        handlerRenderHeader3(h, {
            column,
            $index
        }) {
            return h("span", [
                h("span", column.label),
                h(
                    "el-tooltip", {
                        props: {
                            effect: "light"
                        },
                        style: {
                            borderColor: "#e8e8e8"
                        }
                    }, [
                        h(
                            "div", {
                                slot: "content"
                            }, [
                                h(
                                    "div", {
                                        style: {
                                            display: "flex",
                                            padding: "10px"
                                        }
                                    }, [
                                        h(
                                            "div", {
                                                style: {
                                                    display: "flex",
                                                    marginRight: "20px"
                                                }
                                            }, [
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
                                            "div", {
                                                style: {
                                                    display: "flex"
                                                }
                                            }, [
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
                            "i", {
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
        handlerRenderHeader2(h, {
            column,
            $index
        }) {
            // console.log(column);
            return h("span", [
                h("span", "日销量/"),
                h(
                    "span", {
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

        //导入确定
        ontoLead() {
            if (this.uploadAfterInfo.uploadCode) {
                fetchData({
                    ...apis.REPLENISHDETAILED_UPLOADSHIPPINGCOUNTCONFIRM,
                    data: {
                        uploadCode: this.uploadAfterInfo.uploadCode
                    }
                }).then(res => {
                    if (res.data.code === 0) {
                        showToast("success", res.data.msg);
                        this.toLeadDialog = false;
                    } else {
                        showToast("error", res.data.msg);
                    }
                });
            }
        },
        //批量关注和取消关注
        attention(type) {
            if (this.userList.length) {
                this.userAttention = null;
                this.attentionDialog = true;
                this.type = type;
                if (type) {
                    this.$confirm("是否确认关注?", "提示", {
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        type: "warning"
                    }).then(() => {
                        this.sendAttention("REPLENISHPRODUCT_UPDATEATTENTIONFLAG", 1);
                    });
                } else {
                    this.$confirm("是否确认取消关注?", "提示", {
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
                if (!type) {
                    this.userHint("warning", "请先勾选您要操作的产品!");
                }
            }
        },
        //生命周期确定
        onChangePeriod(url) {
            //恢复系统周期
            if (this.type) {
                this.sendChangePeriod("REPLENISHPRODUCT_RECOVERYPRODUCTCYCLE", true);
                //更改生命周期
            } else {
                this.sendChangePeriod("REPLENISHPRODUCT_UPDATEPRODUCTCYCLE");
            }
        },
        sendChangePeriod(url, type) {
            if (this.userProductCycle || type) {
                const obj = {
                    pageNumber: 1,
                    pageSize: 10
                };
                return fetchData({
                    ...apis[url],
                    data: type ? {
                        replenishProductId: this.userSelectNotValId
                        // productCycle: 1 // 恢复周期
                    } : {
                        productCycle: this.userProductCycle,
                        replenishProductId: this.userSelectNotValId
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
            this.userSelectNotValId = [];
            val.forEach(element => {
                if (element.variantsFlag && !element.parentFlag) {
                    return;
                }
                this.userSelectNotValId.push(element.replenishProductId);
            });
            this.userSelectListId = val.map(item => item.replenishProductId);
        },

        selectTable(selection) {
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
        async onSeek() {
            this.loading = true;
            this.clearData();
            await this.searchList(this.select);
            this.loading = false;
        },
        async searchList(data) {
            return await this.getIntelligentReplenishmentList(data);
        },
        async handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.clearData();
            // this.setSelected();
            this.select.pageSize = val + "";
            await this.onSeek();
            // this.setSelected();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.clearData();

            this.select.pageNumber = val;
            this.onSeek();
            // this.setSelected();
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
            this.tableDatasReplenishmentNum.splice(0);
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
            "insertIntelligentReplenishmentList",
            "delIntelligentReplenishmentList"
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
        "intelligentReplenishmentList.rows" (val) {
            this.setSelected();
        }
    }
};
</script>

<style lang="scss">
@mixin flex($direction: columin, $inline: block) {
    display: if($inline==block, flex, inline-flex);
    flex-direction: $direction;
    flex-wrap: wrap;
}

.____inteReplinshment {
    .upload-demo {
        input[type="file"] {
            display: none !important;
        }
    }
}
.intelligent-replenishment {
    height: 100%;
}
.title-btn {
    @include flex(row);
    padding-right: 10px;
    // border: 1px solid #bdb9b9;
    border-bottom: none;
    li {
        margin-left: 10px;
        padding-right: 10px;
        // border-right: 1px solid #bdb9b9;
        &:last-child {
            border-right: none;
            padding-right: 0;
        }
    }
}

.el-upload-list {
    position: absolute;
    left: 18px;
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

.tempInfo {
    margin-top: 15px;
    ul {
        margin: 0 0 15px 5px;
        li {
            color: #ff3c3c;
        }
    }
    h4 {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
}
</style>

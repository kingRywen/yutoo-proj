<template>
  <!-- 跟卖监控 -->
  <div class='preventSalesMonitoring __wrapper_i'>
    <!-- 导出提示文字隐藏 -->
    <a v-show="false" ref="exportExcel"></a>
    <section class="parentPosition">
      <el-row>
        <el-button type="success" @click="onaddCommodityk">添加产品</el-button>
        <!-- 添加产品 -->
        <el-dialog :close-on-click-modal="false" title="添加产品" :visible.sync="addCommodityk" style="padding-right:100px;" width="800px">
          <div slot="title">
            <span class="el-dialog__title">添加任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <div class="box __box_wrapper__local_page">
            <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%;">
              <!-- todoh -->
              <el-form-item prop="taskName" :label-width="formLabelWidth" label="任务名称" style="width:43%">
                <el-input v-model.trim="form.taskName" placeholder="请输入任务名称" style="width:100%"></el-input>
              </el-form-item>
              <el-form-item prop="sellerId" :label-width="formLabelWidth" label="店铺名称" style='width:55%;'>
                <el-select :popper-append-to-body="false" v-model="form.sellerId" placeholder="选择店铺" style='width:100%;' clearable>
                  <el-option v-for="item in ShopOptions" :key="item.sellerName" :label="item.sellerName" :value="item.sellerId">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="sepcial_item">
                <el-form-item label="监控时间" prop="addDate" :label-width="formLabelWidth" style="width:98.5%;">
                  <div class="block" style="width:100%;">
                    <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="form.addDate" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </div>
              <!-- 监控频率 -->
              <el-form-item label="监控频率" prop="frequency" :label-width="formLabelWidth" style="width:43%;">
                <el-input type="text" v-model="form.frequency" style="width:208px;" placeholder="限制10-60" />
                <span class="placeholder_color">分钟</span>
              </el-form-item>
              <el-form-item label="价格波动" prop="priceRange" style="width:241px" label-width="80px">
                <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
                <el-input type="text" v-model="form.priceRange" style="width:131px" placeholder="价格" />
                <span class="placeholder_color" style="position:relative;left:10px;">/</span>
              </el-form-item>
              <el-form-item prop="priceFrequency" style="width:160px;">
                <el-input type="text" v-model="form.priceFrequency" style="width:131px;" placeholder="限制3-60" />
                <span class="placeholder_color">分钟</span>
              </el-form-item>
              <div v-for="(item,index) in form.skus" :key="index">

                <el-form-item label="产品ASIN" :prop="'skus.'+index+'.sku'" :rules="rules.sku" :label-width="formLabelWidth" style="width:179px">
                  <el-input v-if="!item.AISN_Focus" :autofocus="false" type="text" v-model.trim="item.sku" style="width:100px;" placeholder="产品ASIN" />
                  <el-input v-if="item.AISN_Focus" :autofocus="true" type="text" v-model.trim="item.sku" style="width:100px;" placeholder="产品ASIN" />
                </el-form-item>

                <el-form-item label="标准价" :prop="'skus.'+index+'.priceStandard'" :rules="rules.priceStandard" label-width="70px" style="width:150px;">
                  <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
                  <el-input type="text" v-model="item.priceStandard" style="width:75px;" placeholder="价格" />
                </el-form-item>

                <el-form-item label="最低价" :prop="'skus.'+index+'.priceMin'" :rules="rules.priceMin" label-width="60px" style="width:130px;">
                  <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
                  <el-input type="text" v-model="item.priceMin" style="width:75px;" placeholder="价格" />
                </el-form-item>

                <el-form-item label="店铺SKU" :prop="'skus.'+index+'.sellerSku'" :rules="rules.sellerSku" :label-width="formLabelWidth" style="width:206px">
                  <el-input v-if="!item.SKU_Focus" :autofocus="false" type="text" v-model.trim="item.sellerSku" style="width:125px;" placeholder="店铺SKU" />
                  <el-input v-if="item.SKU_Focus" :autofocus="true" type="text" v-model.trim="item.sellerSku" style="width:125px;" placeholder="店铺SKU" />
                </el-form-item>

                <el-form-item label-width="0px" style="width:58px;position:relative;top:1px;">
                  <span class="color_blue esc_desc" v-if="form.skus.length>1?true:false" @click="spliceItem(index)">-</span>
                  <span class="color_blue esc_desc" style="padding:0px 5px" v-if="index===0&&form.skus.length===1||index===form.skus.length-1&&form.skus.length>1?true:false" @click="addItem">+</span>
                </el-form-item>
              </div>
              <el-form-item style="width:100%;text-align:center">
                <el-button :loading="buttonLoading.add" type="primary" style="width:60%;" @click="showPoint('ruleForm')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <el-alert v-show="showAlert" style="position:fixed;top:30vh;left:50%;margin-left:-200px;width:400px;z-index:9999;" title="添加成功" type="success" description="如果要手动在亚马逊修改价格，那么就需要现在此处暂停监控，等修改完后再开启" show-icon>
        </el-alert>
        <!-- 导入任务 -->
        <el-button type="success" @click="uploadTaskShow=true">导入任务</el-button>
        <!-- 导入任务弹窗 -->
        <el-dialog :close-on-click-modal="false" title="导入任务" :visible.sync="uploadTaskShow" style="padding-right:100px;" width="400px">
          <div slot="title">
            <span class="el-dialog__title">导入任务</span>
            <span class="timeCss"> {{this.charge}}点/每次</span>
          </div>
          <div class="box __box_wrapper">
            <el-form ref="ruleForm" style="width:100%;margin-top:-10px">
              <el-form-item style="width:48%;">
                <el-upload ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange" :file-list="fileList" :on-remove="handleFileRemove" :auto-upload="false">
                  <el-button type="primary">上传文件</el-button>
                  <!-- <div slot="tip" class="el-upload__tip">只能xx上传文件，且不超过500kb</div> -->
                </el-upload>
              </el-form-item>
              <el-form-item style="width:48%;position:absolute;right:10px;">
                <el-button type="primary" @click="downLoad">下载模板</el-button>
              </el-form-item>
              <el-form-item style="width:100%;text-align:center;">
                <el-button :disabled="fileList.length>0?false:true" :loading="buttonLoading.upload" type="primary" style="width:60%;" @click="upload">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 添加监控 -->
        <el-button type="success" @click="showAddmonitorDialog">添加监控</el-button>
        <!-- 添加监控弹窗 -->
        <el-dialog :close-on-click-modal="false" title="添加监控" :visible.sync="addDialogMonitorVisible" width="650px">
          <div class="box __box_wrapper__local_page">
            <el-form :model="dialogDate" :rules="rules_addmoni" ref="ruleForm_addmoni" style="width:100%;">
              <!-- 监控起止时间 -->
              <div class="sepcial_item">
                <el-form-item label="监控时间:" prop="addMonitorDateValue" :label-width="formLabelWidth" style="width:93%;">
                  <div class="block" style="width:100%;">
                    <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="dialogDate.addMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </div>
              <!-- <el-form-item label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:90%;" placeholder="请输入10-60之间的整数" />
                <span>分钟</span>
              </el-form-item> -->
              <!-- 监控频率 -->
              <el-form-item label="监控频率" prop="frequency" :label-width="formLabelWidth" style="width:43%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:115px;" placeholder="限制10-60" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item label="价格波动" prop="priceRange" style="width:162px" label-width="71px">
                <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
                <el-input type="text" v-model="dialogDate.priceRange" style="width:81px" placeholder="价格" />
                <span class="placeholder_color">/</span>
              </el-form-item>
              <el-form-item prop="priceFrequency" style="width:137px;">
                <el-input type="text" v-model="dialogDate.priceFrequency" style="width:100px;" placeholder="限制3-60" />
                <span class="placeholder_color">分钟</span>
              </el-form-item>
              <el-form-item style="width:100%;text-align:center">
                <el-button :loading="buttonLoading.addmonitor" type="primary" style="width:60%;" @click="addChartMoni('ruleForm_addmoni')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 修改监控周期 todoh-->
        <el-button type="success" @click="showChangemonitorDialog">修改监控周期</el-button>
        <!-- 修改监控周期弹窗 -->
        <el-dialog :close-on-click-modal="false" title="修改监控周期" :visible.sync="changeDialogMonitorVisible" width="650px">
          <div class="box __box_wrapper__local_page">
            <el-form :model="dialogDate" :rules="rules_changemoni" ref="ruleForm_changemoni" style="width:100%;">
              <!-- 监控起止时间 -->
              <div class="sepcial_item">
                <el-form-item label="监控时间:" prop="changeMonitorDateValue" :label-width="formLabelWidth" style="width:93%;">
                  <div class="block" style="width:100%;">
                    <el-date-picker unlink-panels style="width:100%;" :picker-options="pickerOptions" v-model="dialogDate.changeMonitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </div>
                </el-form-item>
              </div>
              <!-- 监控频率 -->
              <!-- <el-form-item label="监控频率:" prop="frequency" :label-width="formLabelWidth" style="width:100%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:90%;" placeholder="请输入10-60之间的整数" />
                <span>分钟</span>
              </el-form-item> -->
              <el-form-item label="监控频率" prop="frequency" :label-width="formLabelWidth" style="width:43%;">
                <el-input type="text" v-model="dialogDate.frequency" style="width:115px;" placeholder="限制10-60" />
                <span>分钟</span>
              </el-form-item>
              <el-form-item label="价格波动" prop="priceRange" style="width:162px" label-width="71px">
                <span class="placeholder_color" style="position:absolute;z-index:100;left:5px;">$</span>
                <el-input type="text" v-model="dialogDate.priceRange" style="width:81px" placeholder="价格" />
                <span class="placeholder_color">/</span>
              </el-form-item>
              <el-form-item prop="priceFrequency" style="width:137px;">
                <el-input type="text" v-model="dialogDate.priceFrequency" style="width:100px;" placeholder="限制3-60" />
                <span class="placeholder_color">分钟</span>
              </el-form-item>
              <el-form-item style="width:100%;text-align:center">
                <el-button :loading="buttonLoading.changemonitor" type="primary" style="width:60%;" @click="changeMoni('ruleForm_changemoni')">确 定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
        <!-- 取消监控 -->
        <el-button type="success" plain @click="cancelSalesMonitor">取消监控</el-button>
        <el-button type="success" style="margin-left:0" plain @click="deleteMonitorList">删除</el-button>
        <!-- 定时任务（测试） -->
        <!-- <el-button type="primary" @click="ceshi(8)">定时任务（测试用）</el-button> -->
      </el-row>
      <!-- 布局 -->
      <el-row style="margin-top:8px;margin-bottom: 8px;height:30px" type="flex" justify="space-between">
        <!-- 输入框 关键词输入 -->
        <el-col :lg="{span:12}" :md="{span:9}" :sm="{span:6}" class="__J_flex">
          <!-- 输入框 关键词输入 -->
          <el-input placeholder="请输入任务名称" v-model="searchListData.taskName" clearable style='max-width:150px;'>
          </el-input>
          <el-select :popper-append-to-body="false" v-model="searchListData.sellerId" placeholder="所属店铺" style='max-width:150px;' clearable>
            <el-option v-for="item in ShopOptions" :key="item.sellerName" :label="item.sellerName" :value="item.sellerId">
            </el-option>
          </el-select>
          <el-select :popper-append-to-body="false" v-model="searchListData.monitorFlag" placeholder="监控状态" style='max-width:120px;' clearable>
            <el-option v-for="item in form.monitorFlagData" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
          <!-- 搜索按钮 -->
          <!-- <el-button :disabled="isDisabled" type="success" icon="el-icon-search" :loading="searchLoading" @click="searchSalesMonitoring">搜索</el-button> -->
          <el-button type="success" icon="el-icon-search" :loading="searchLoading" @click="searchSalesMonitoring">搜索</el-button>
          <el-button style="margin-left:5px !important;" :disabled="isDisabled" type="success" icon="el-icon-search" :loading="clearSearchLoading" @click="clearSearchLists">清空</el-button>
          <!-- <div>
            <el-button type="success" icon="el-icon-search" @click="testButton">测试</el-button>
          </div> -->

        </el-col>
        <el-col :lg="{span:12}" :md="{span:15}" :sm="{span:18}" class="__J_flex right">
          <el-date-picker unlink-panels :label-width="formLabelWidth" value-format="yyyy-MM-dd" @change="newTime" clearable class="el-date-wrapper" style="width:53%;max-width:240px" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
          <el-radio-group v-model="tabPosition" @change="currentTimeData">
            <el-radio-button label=1>今日</el-radio-button>
            <el-radio-button label=7>7天</el-radio-button>
            <el-radio-button label=30>30天</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table stripe ref="multipleTable" v-loading="loading" :max-height="12000" :data="saveSalesLists" tooltip-effect="dark" class="tableBox" @selection-change="handleSelectionChange">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" align='center'>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align='center'>
        </el-table-column>
        <el-table-column prop="sellerName" label="所属店铺" align='center'>
        </el-table-column>
        <!-- <el-table-column prop="imgs" label="图片" align='center'>
          <template slot-scope="scope">
            <el-popover placement="right" title="" trigger="hover">
              <img :src="scope.row.imageUrl" />
              <div class="__img_wrapper" slot="reference">
                <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
              </div>
            </el-popover>
          </template>
        </el-table-column> -->
        <el-table-column prop="monitorFlag" label="监控状态" align='center' width="100">
          <template slot-scope="scope">
            {{ scope.row.monitorFlag?'开启':'关闭' }}
          </template>
        </el-table-column>

        <el-table-column prop="frequency" label="监控频率" align='center' width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.frequency">{{scope.row.frequency}}分钟/次</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="监控起止时间" align='center'>
          <template slot-scope="scope">
            <span>
              {{ scope.row.monitorFrom?scope.row.monitorFrom.slice(0,10)+"~"+scope.row.monitorTo.slice(0,10):"-" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="priceRange" label="价格波动" align='center' width="100">
          <template slot-scope="scope">
            {{ scope.row.priceRange!==null&&scope.row.priceRange!==""?"$"+scope.row.priceRange:'-' | _formatData }}
          </template>
        </el-table-column>
        <el-table-column prop="priceFrequency" label="波动频率" align='center' width="100">
          <template slot-scope="scope">
            {{ scope.row.priceFrequency | _formatData }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align='center' class="status" width="120px">
          <template slot-scope="scope">
            {{ scope.row.status===2?"抓取成功":scope.row.status===0?"抓取中...":scope.row.status===1?"抓取中...":scope.row.status!==0||scope.row.status!==1||scope.row.status!==2?"抓取失败":"--" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align='center'>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" v-if="scope.row.status=='2'" type="primary">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block" style='margin-top:20px;'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      <el-point :data="pointData"></el-point>
    </section>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import { isDisabled, Trim, getDay } from "@/api/functions";
class newItem {
  constructor() {
    // 用于skus新增一项
    (this.sku = ""),
      (this.priceStandard = ""),
      (this.priceMin = ""),
      (this.sellerSku = ""),
      (this.AISN_Focus = false),
      (this.SKU_Focus = false);
  }
}
export default {
  data() {
    var validateSku = (rule, value, callback) => {
      let val = Trim(value, "g");
      // this.skusArr = val;
      // console.log(this.skusArr, 44);
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi;
      let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi;
      // let reg = /^[A-Z0-9]{10}$/;
      let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/;
      if (!reg.test(val)) {
        callback(new Error("10位，大写字母和数字组合"));
      } else if (regEn.test(val) || regCn.test(val)) {
        callback(new Error("不能包含特殊字符"));
      } else {
        callback();
      }
    };
    var validateFrequency = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error("请输入整数"));
      } else if (value < 10 || value > 60) {
        callback(new Error("请输入10-60之间的整数"));
      } else {
        callback();
      }
    };
    // 波动价格 正数（正整数，正小数）
    var validatePriceRange = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (
        /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/.test(value) ===
        false
      ) {
        callback(new Error("只能输入正数"));
      } else if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value) === false) {
        callback(new Error("只能输入数字"));
      } else {
        callback();
      }
    };
    // 波动频率3-60
    var validatePriceFrequency = (rule, value, callback) => {
      value = Trim(value, "g");
      value = +value;
      if (/^[0-9]*$/.test(value) === false) {
        callback(new Error("请输入整数"));
      } else if (value < 1 || value > 60) {
        callback(new Error("请输入3-60之间的整数"));
      } else {
        callback();
      }
    };
    // 店铺sku校验
    var validateSellerSku = (rule, value, callback) => {
      value = Trim(value, "g");
      if (value.length > 25) {
        callback(new Error("长度应少于25个字符"));
      } else {
        callback();
      }
    };
    return {
      showAlert: false,
      // pointData 扣点明细
      pointData: {
        show: false,
        point: "",
        loading: false,
        func: this.addTaskSubmit
      },
      // 导入任务
      uploadTaskShow: false,
      fileList: [],
      // end
      isDisabled: true,
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      clearSearchLoading: false,
      searchLoading: false,
      searchListData: {},
      fontSum: null,
      skusArr: [],
      loading: true,
      buttonLoading: {
        add: false,
        upload: false,
        addmonitor: false,
        changemonitor: false
      },
      surplusAmount: null, //剩余点数
      charge: null, //点数
      monitorTimeAry: [], //时间选择器
      pageNumber: 1, //分页
      total: null, //总条数
      pageSize: 10, //每页条数
      tabPosition: "",
      saveSalesLists: [], //接收请求的列表数据
      addCommodityk: false, //添加任务
      rules: {
        taskName: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ],
        sellerId: [
          {
            required: true,
            message: "请选择店铺",
            trigger: ["blur", "change"]
          }
        ],
        addDate: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-60）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ],
        priceRange: [
          {
            required: true,
            message: "请输入波动价格",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ],
        priceFrequency: [
          {
            required: true,
            message: "请输入波动频率",
            trigger: ["blur", "change"]
          },
          { validator: validatePriceFrequency, trigger: ["blur", "change"] }
        ],
        sku: [
          {
            required: true,
            message: "请输入产品ASIN",
            trigger: ["blur", "change"]
          },
          { validator: validateSku, trigger: ["blur", "change"] }
        ],
        sellerSku: [
          {
            required: true,
            message: "请输入店铺SKU",
            trigger: ["blur", "change"]
          },
          { validator: validateSellerSku, trigger: ["blur", "change"] }
        ],
        // 标准价格
        priceStandard: [
          {
            required: true,
            message: "请输入标准价",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ],
        // 标准价格
        priceMin: [
          {
            required: true,
            message: "请输入价格",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ]
      },
      rules_addmoni: {
        addMonitorDateValue: [
          {
            required: true,
            message: "请输入监控起始时间",
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-60）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ],
        priceRange: [
          {
            required: true,
            message: "请输入波动价格",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ],
        priceFrequency: [
          {
            required: true,
            message: "请输入波动频率",
            trigger: ["blur", "change"]
          },
          { validator: validatePriceFrequency, trigger: ["blur", "change"] }
        ]
      },
      rules_changemoni: {
        changeMonitorDateValue: [
          {
            required: true,
            message: "请选择监控起始时间",
            trigger: ["change"]
          }
        ],
        frequency: [
          {
            required: true,
            message: "请输入监控频率（10-60）",
            trigger: ["blur", "change"]
          },
          { validator: validateFrequency, trigger: ["blur", "change"] } //限定输入的个数
        ],
        priceRange: [
          {
            required: true,
            message: "请输入波动价格",
            trigger: ["change", "blur"]
          },
          { validator: validatePriceRange, trigger: ["blur", "change"] } //限制正数
        ],
        priceFrequency: [
          {
            required: true,
            message: "请输入波动频率",
            trigger: ["blur", "change"]
          },
          { validator: validatePriceFrequency, trigger: ["blur", "change"] }
        ]
      },
      //添加产品
      // 店铺
      ShopOptions: [],
      form: {
        taskName: "",
        sellerId: "",
        addDate: "",
        frequency: "",
        priceRange: "", // 价格和频率是分开的
        priceFrequency: "",
        skus: [
          new newItem()
          // {
          //   sku: "",
          //   priceStandard: "",
          //   priceMin: ""
          // }
        ],
        monitorFlagData: [
          {
            value: "1",
            name: "开启"
          },
          {
            value: "0",
            name: "关闭"
          }
        ],
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
        // monitorFlag: null
      },
      // 添加监控
      // 弹窗todod
      addDialogMonitorVisible: false,
      // 日期
      dialogDate: {
        frequency: "",
        priceRange: "", // 价格和频率是分开的
        priceFrequency: "",
        addMonitorDateValue: "",
        changeMonitorDateValue: ""
      },
      // 修改监控周期
      changeDialogMonitorVisible: false,
      // 定义搜索
      searchSkuLists: {
        sku: ""
      },
      taskIds: [],
      userSelect: [],
      // 、、、、、、、、、、、、、、
      checked: false,
      addTask: false,
      formLabelWidth: "78px",

      // 表格数据
      tableData: [
        {
          Numbering: "BSKEYON1136",
          imgs: "Lacoste ",
          titles:
            "Lacoste Men's Short Sleeve '85th Anni' 00's Striped Polo, PH7326",
          sellingQuantity: "666"
        }
      ],
      // 放删除选中的数组
      multipleSelection: []
    };
  },

  created() {
    this.getShopOptions(); //请求店铺下拉ShopOptions
    // this.monitorTimeAry.push(this.getBeforeTime(30), this.getBeforeTime(0));
    // this.getSalesMonitoringListApi();
    this.getSalesMonitoringList(); //请求列表数据
    // this.getSalesMonitoringSeeListApi();
    this.getPointeApi(); //请求扣点
  },
  computed: {
    ...mapGetters("common", ["siteId", "platformId"])
  },
  watch: {
    searchListData: {
      handler(newV) {
        // console.log(newV, "搜索条件");
        this.isDisabled = isDisabled(newV);
        //要干的事情
        if (this.isDisabled === true) {
          this.getSalesMonitoringList();
        }
      },
      deep: true
    },
    // platformId(val) {
    //   this.getSalesMonitoringList({ platformId: val });
    // },
    skusArr(val) {
      if (val.length) {
        this.fontSum = val.length;
      } else {
        this.fontSum = null;
      }
    }
  },

  methods: {
    // 下载模板
    downLoad() {
      this.$axios
        .post("/taskNoSelling/downloadFile", null, {
          responseType: "blob"
        })
        .then(res => {
          let url = window.URL.createObjectURL(new Blob([res.data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "防跟卖任务模板.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        });
    },
    // 上传模板
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleFileRemove(file, fileList) {
      this.fileList = [];
    },
    // 确认上传todo
    upload() {
      // console.log(params);
      let params = new FormData();
      params.append("siteId", this.siteId);
      params.append("platformId", this.platformId);
      params.append("file", this.fileList[0].raw);
      console.log(this.fileList[0]);
      this.buttonLoading.upload = true;
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$axios
        .post("/taskNoSelling/importData", params, headers)
        .then(res => {
          // console.log(res);
          this.buttonLoading.upload = false;
          let code = res.data.code;
          if (code == 0) {
            this.uploadTaskShow = false;
            this.$message.success(res.data.msg);
          } else if (res.data.code === 500) {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 请求店铺下拉ShopOptions
    getShopOptions() {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      this.$axios.post("/SellerAuth/selectList", params).then(res => {
        console.log(res);
        let code = res.data.code;
        if (code == 0) {
          let data = res.data.data;
          this.ShopOptions = data;
        } else {
          this.ShopOptions = [];
        }
      });
    },
    // 清空搜索
    clearSearchLists() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.clearSearchLoading = true;
      this.searchListData = {};
      // this.recordSearch();
    },
    // todom
    testButton() {},
    // 请求扣点  防跟卖监控扣点
    getPointeApi() {
      this.$axios
        .post("/FunctionMkt/listFunction", { functionMark: "F0014" })
        .then(res => {
          if (res.data.code == 0) {
            this.surplusAmount = res.data.data.surplusAmount;
            this.charge = res.data.data.charge;
          }
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);
            return;
          }
        });
    },
    ...mapActions("monitor", [
      // getSalesMonitoringListApi
      "getSalesMonitoringSeeListApi"
    ]),
    ...mapMutations("monitor", {
      setWordList: "saveSalesLists"
    }),

    // 请求列表
    getSalesMonitoringList(param = {}) {
      // debugger;
      this.loading = true;
      const { pageSize, pageNumber } = this;
      let startTime = this.monitorTimeAry ? this.monitorTimeAry[0] : "";
      let endTime = this.monitorTimeAry ? this.monitorTimeAry[1] : "";
      const params = this.$.dealObjectValue({
        pageSize,
        pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        ...this.searchListData,
        startTime,
        endTime,
        ...param
      });

      this.$axios.post("/taskNoSelling/list", params).then(res => {
        this.clearSearchLoading = false;
        if (this.searchLoading) {
          this.searchLoading = false;
        }
        this.loading = false;
        const { pageNo, pageSize, total, rows } = res.data;
        if (res.data.code === 500) {
          this.$.showError(res);
          return;
        }
        if (rows && rows.length >= 0) {
          this.pageSize = pageSize;
          this.pageNumber = pageNo;
          this.total = total;
          this.saveSalesLists = rows;
        } else if (!rows) {
          this.saveSalesLists = rows;
          this.total = 0;
        }
      });
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;

      this.getSalesMonitoringList();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pageNumber = val;
      this.getSalesMonitoringList();
    },
    //获取多少天以前的时间
    getBeforeTime(n) {
      var n = n;
      var d = new Date();
      var year = d.getFullYear();
      var mon = d.getMonth() + 1;
      var day = d.getDate();
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1;
        } else {
          year = year - 1;
          mon = 12;
        }
      }
      d.setDate(d.getDate() - n);
      year = d.getFullYear();
      mon = d.getMonth() + 1;
      day = d.getDate();
      return (
        year +
        "-" +
        (mon < 10 ? "0" + mon : mon) +
        "-" +
        (day < 10 ? "0" + day : day)
      );
    },
    //计算本月有多少天
    getCountDays() {
      var curDate = new Date();
      var curMonth = curDate.getMonth();
      curDate.setMonth(curMonth + 1);
      curDate.setDate(0);
      return curDate.getDate();
    },
    //根据时间选择列表 1.7.30
    currentTimeData() {
      this.pageSize = 10;
      this.pageNumber = 1;
      let a = Number(this.tabPosition);
      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0]
      };
      let _end = null;
      let _start = null;
      switch (params.createTime) {
        case 7:
          _start = getDay(7).computedDay;
          _end = getDay().today;
          break;
        case 30:
          _start = getDay(30).computedDay;
          _end = getDay().today;
          break;
        default:
          _start = getDay().today;
          _end = getDay().today;
      }
      this.monitorTimeAry = [_start, _end];
      this.$forceUpdate();

      return this.getSalesMonitoringList({
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      });
    },

    //自由选择时间 刷新列表
    newTime(val) {
      this.pageSize = 10;
      this.pageNumber = 1;
      const { $ } = this;
      if (!val) {
        this.tabPosition = null;
        return this.getSalesMonitoringList();
      }

      const [start, end] = val;

      // console.log($.formatTime(end + 7 * 24 * 3600 * 1000, "{y}/{m}/{d}"));

      if (
        $.formatTime(start, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 1;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 7 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 7;
      } else if (
        $.formatTime(
          new Date(start).valueOf() + 30 * 24 * 3600 * 1000,
          "{y}/{m}/{d}"
        ) === $.formatTime(new Date(), "{y}/{m}/{d}") &&
        $.formatTime(end, "{y}/{m}/{d}") ===
          $.formatTime(new Date(), "{y}/{m}/{d}")
      ) {
        this.tabPosition = 30;
      } else {
        this.tabPosition = null;
      }

      return this.getSalesMonitoringList();
    },

    //点击添加产品
    onaddCommodityk() {
      this.addCommodityk = true;
      // 清除表单内容;
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields();
      });
    },
    // 添加任务增加一项
    addItem() {
      let item = new newItem();
      this.form.skus.push(item);
    },
    spliceItem(index) {
      this.form.skus.splice(index, 1);
    },
    // 添加任务减少一项
    // 添加任务扣点明细 pointData
    showPoint(formName) {
      this.addTaskSubmit(formName, 0);
    },
    //添加任务提交 todonow
    addTaskSubmit(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            // merchantId: 2, // 上线删
            sellerId: this.form.sellerId,
            taskName: this.form.taskName,
            type: point,
            monitorFlag: 1,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[1],
            monitorFrom: this.form.addDate[0],
            monitorTo: this.form.addDate[1],
            frequency: +this.form.frequency,
            priceRange: +this.form.priceRange,
            priceFrequency: +this.form.priceFrequency
          };
          params = this.$.dealObjectValue(params);
          let arr = [];
          this.form.skus.forEach((item, index) => {
            if (arr.indexOf(item.sku) !== -1) {
              // this.form.skus.splice(index, 1);
              this.$message.error(`ASIN：${item.sku}输入重复`);
              item.AISN_Focus = true;
              this.form.skus.splice(index, 1, item);
              return;
            } else {
              arr.push(item.sku);
            }
          });
          params.noSellingDetails = this.form.skus;
          this.buttonLoading.add = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          _this.$axios.post("/taskNoSelling/save", params).then(res => {
            if (res.data.code == 0) {
              this.buttonLoading.add = false;
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = "ruleForm";
                  this.pointData.func = this.addTaskSubmit;
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              // this.$message({
              //   message: res.data.msg,
              //   type: "success"
              // });
              this.showAlert = true;
              this.$nextTick(() => {
                this.pointData.show = false; // 关闭扣点弹窗 pointData
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              if (point === undefined) {
                this.reloadPointApi(); // 重新获取点数
                this.getSalesMonitoringList();
              }
              this.addCommodityk = false;
              this.$refs[formName].resetFields(); //清除数据记录
              this.form.allChildFlag = true; //默认为勾选状态
            } else {
              this.$nextTick(() => {
                this.buttonLoading.add = false;
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              this.$message.error(res.data.msg);
              // res.data = {
              //   code: 500,
              //   type: 1,
              //   ASIN: "B444444444"
              // };
              let error = res.data;
              console.log(res.data);
              if (error.type === 1) {
                // console.log(this.form.skus);
                this.form.skus.forEach((item, index) => {
                  if (item.sku === error.ASIN) {
                    item.AISN_Focus = true;
                    this.form.skus.splice(index, 1, item);
                  } else {
                    item.AISN_Focus = false;
                    this.form.skus.splice(index, 1, item);
                  }
                });
              } else if (error.type === 2) {
                this.form.skus.forEach((item, index) => {
                  if (item.sellerSku === error.sellerSku) {
                    item.SKU_Focus = true;
                    this.form.skus.splice(index, 1, item);
                  } else {
                    item.SKU_Focus = false;
                    this.form.skus.splice(index, 1, item);
                  }
                });
              }
              console.log(this.form.skus);
            }
          });
        }
      });
    },
    // 添加监控
    //点击添加监控
    showAddmonitorDialog() {
      if (this.userSelect.length) {
        // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = true;
        for (let i = 0; i < this.userSelect.length; i++) {
          if (this.userSelect[i].monitorFlag == 0) {
            // 只有要一项未开启，设置isAllInMonitor为否，下面则可以开启添加监控弹窗
            isAllInMonitor = false;
          }
        }
        if (isAllInMonitor === true) {
          this.$message({
            showClose: true,
            message: "选中项都处于监控，不能重复添加",
            type: "warning"
          });
          this.addDialogMonitorVisible = false;
          return;
        }
        //
        this.addDialogMonitorVisible = true;
        // 清除表单内容;
        // 清除表单内容;
        this.$nextTick(() => {
          this.$refs.ruleForm_addmoni.resetFields();
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    // 添加监控 pointData todon
    addChartMoni(formName) {
      this.addSalesMonitor(formName, 0);
    },
    addSalesMonitor(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.userSelect.length) {
            let addMonitorArr = [];
            this.userSelect.forEach(item => {
              addMonitorArr.push(item.taskId);
            });
            let params = {
              type: point,
              taskIds: addMonitorArr,
              platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                ","
              )[0],
              monitorFrom: this.dialogDate.addMonitorDateValue[0],
              monitorTo: this.dialogDate.addMonitorDateValue[1],
              frequency: +this.dialogDate.frequency,
              priceRange: +this.dialogDate.priceRange,
              priceFrequency: +this.dialogDate.priceFrequency
            };
            params = this.$.dealObjectValue(params);
            this.buttonLoading.addmonitor = true;
            // 扣点按钮loading pointData
            if (point === undefined) {
              this.pointData.loading = true; // 关闭扣点按钮loading
            }
            this.$axios.post("/taskNoSelling/addMonitor", params).then(res => {
              this.buttonLoading.addmonitor = false;
              // 扣点弹窗
              if (point === 0) {
                if (res.data.code == 0) {
                  this.pointData.show = true;
                  this.pointData.point = res.data.data + "点";
                  this.pointData.formName = "ruleForm_addmoni";
                  this.pointData.func = this.addSalesMonitor;
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg);
                }
                return;
              }
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });

                this.addDialogMonitorVisible = false;
                this.$nextTick(() => {
                  this.pointData.show = false; // 关闭扣点弹窗 pointData
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                if (point === undefined) {
                  this.reloadPointApi();
                  this.getSalesMonitoringList();
                }
                return;
              }
              if (res.data.code == 500) {
                this.$nextTick(() => {
                  this.buttonLoading.addmonitor = false;
                  this.pointData.loading = false; // 关闭扣点按钮loading
                });
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "至少需要选中一个",
              type: "warning"
            });
          }
        }
      });
    },
    // 修改监控周期todom
    //点击修改监控周期
    showChangemonitorDialog() {
      if (this.userSelect.length) {
        this.changeDialogMonitorVisible = true;
        // 清除表单内容;
        // 1
        if (
          this.userSelect.length === 1 &&
          this.userSelect[0].monitorFlag === 1
        ) {
          // 修改监控，只选中一条默认带上
          // console.log(this.userSelect, "修改监控一项");
          if (
            this.userSelect[0].frequency != null &&
            this.userSelect[0].frequency !== ""
          ) {
            this.dialogDate.frequency = this.userSelect[0].frequency + "";

            this.dialogDate.priceRange = this.userSelect[0].priceRange + "";
            this.dialogDate.priceFrequency =
              this.userSelect[0].priceFrequency + "";
          }
          if (this.userSelect[0].monitorFrom && this.userSelect[0].monitorTo) {
            this.dialogDate.changeMonitorDateValue = [
              this.userSelect[0].monitorFrom,
              this.userSelect[0].monitorTo
            ];
          }
        } else {
          this.dialogDate.frequency = "";
          this.dialogDate.changeMonitorDateValue = [];
        }
        // 2 end
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    // 添加监控 pointData
    changeMoni(formName) {
      this.changeSalesMonitor(formName, 0);
    },
    changeSalesMonitor(formName, point) {
      var _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let changeMonitorArr = [];
          this.userSelect.forEach(item => {
            changeMonitorArr.push(item.taskId);
          });
          let params = {
            type: point,
            taskIds: changeMonitorArr,
            platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
              ","
            )[0],
            monitorFrom: this.dialogDate.changeMonitorDateValue[0],
            monitorTo: this.dialogDate.changeMonitorDateValue[1],
            frequency: +this.dialogDate.frequency,
            priceRange: +this.dialogDate.priceRange,
            priceFrequency: +this.dialogDate.priceFrequency
          };
          params = this.$.dealObjectValue(params);
          this.buttonLoading.changemonitor = true;
          // 扣点按钮loading pointData
          if (point === undefined) {
            this.pointData.loading = true; // 关闭扣点按钮loading
          }
          this.$axios.post("/taskNoSelling/updateMonitor", params).then(res => {
            this.buttonLoading.changemonitor = false;
            // 扣点弹窗
            if (point === 0) {
              if (res.data.code == 0) {
                this.pointData.show = true;
                this.pointData.point = res.data.data + "点";
                this.pointData.formName = "ruleForm_changemoni";
                this.pointData.func = this.changeSalesMonitor;
              } else if (res.data.code === 500) {
                this.$message.error(res.data.msg);
              }
              return;
            }
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.$nextTick(() => {
                this.pointData.show = false; // 关闭扣点弹窗 pointData
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              if (point === undefined) {
                this.reloadPointApi();
                this.getSalesMonitoringList();
              }
              this.changeDialogMonitorVisible = false;
              return;
            }
            if (res.data.code == 500) {
              this.$nextTick(() => {
                this.pointData.loading = false; // 关闭扣点按钮loading
              });
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
    //取消监控
    cancelSalesMonitor() {
      if (this.userSelect.length) {
        // // 此变量判断是否有未开启监控的选项
        let isAllInMonitor = false;
        for (let i = 0; i < this.userSelect.length; i++) {
          if (this.userSelect[i].monitorFlag == 1) {
            // 只有要一项未开启，设置isAllInMonitor为否，下面则可以开启添加监控弹窗
            isAllInMonitor = true;
          }
        }
        if (isAllInMonitor === false) {
          this.$message({
            showClose: true,
            message: "选中项都未开启监控，不需要取消",
            type: "warning"
          });
          return;
        }
        // //
        this.$confirm("此操作将取消监控选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let cancelMonitor = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              cancelMonitor.push(item.taskId);
              // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              //   this.$message({
              //     showClose: true,
              //     message: "没有添加监控",
              //     type: "warning"
              //   });
              // }
              let params = {
                taskIds: cancelMonitor
              };
              this.$axios
                .post("/taskNoSelling/removeMonitor", params)
                .then(res => {
                  if (res.data.code == 0) {
                    this.$message({
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getSalesMonitoringList();
                    return;
                  }
                  if (res.data.code == 500) {
                    // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                    //   this.$message({
                    //     showClose: true,
                    //     message: "没有添加监控",
                    //     type: "warning"
                    //   });
                    // } else {
                    this.$message.error(res.data.msg);
                    // }
                  }
                });
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    //删除监控列表
    deleteMonitorList() {
      if (this.userSelect.length) {
        this.$confirm("此操作将删除选中项, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let deleteArr = [];
          if (this.userSelect.length) {
            this.userSelect.forEach(item => {
              deleteArr.push(item.taskId);
              // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
              //   this.$message({
              //     showClose: true,
              //     message: "没有添加监控",
              //     type: "warning"
              //   });
              // }
              let params = {
                taskIds: deleteArr
              };
              this.$axios.post("/taskNoSelling/remove", params).then(res => {
                if (res.data.code == 0) {
                  this.$message({
                    message: res.data.msg,
                    type: "success"
                  });
                  this.pageNumber = 1;
                  this.getSalesMonitoringList();
                  return;
                }
                if (res.data.code == 500) {
                  // if (item.monitorFlag == 0 && this.userSelect.length == 1) {
                  //   this.$message({
                  //     showClose: true,
                  //     message: "没有添加监控",
                  //     type: "warning"
                  //   });
                  // } else {
                  this.$message.error(res.data.msg);
                  // }
                }
              });
            });
          }
        });
      } else {
        this.$message({
          showClose: true,
          message: "至少需要选中一个",
          type: "warning"
        });
      }
    },
    //搜索，跟卖监控 搜索
    searchSalesMonitoring() {
      this.pageSize = 10;
      this.pageNumber = 1;
      this.getSalesMonitoringList();
    },
    //记录搜索值
    recordSearch(sku) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10,
        sku
      };

      this.$axios.post("/TaskProductSelling/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.pageNumber = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.saveSalesLists = res.data.rows;
          return;
        }
        if (!res.data.rows.length) {
          this.pageNumber = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.saveSalesLists = res.data.rows;
          return;
        }
      });
    },

    ...mapActions("monitor", ["getSalesMonitoringListApi"]),
    // ...mapMutations("monitor", {
    //   setWordList: "getWordRankingLists"
    // }),
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val;
      this.userSelect.forEach(item => {
        this.taskIds.push(item.taskId);
      });
    },
    // table删除
    deleteRow(tableData) {
      // console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(row) {
      console.log(row);
      this.$router.push({
        path:
          "/admin/monitoringCenter/preventSalesMonitoring/preventSalesMonitoringSee",
        query: {
          taskName: row.taskName,
          taskId: row.taskId
        }
      });
    }
  }
};
</script>


<style scoped lang="scss">
.__box_wrapper__local_page {
  display: flex;
  margin: 12px 10px -25px;
  .el-form-item {
    display: inline-block !important;
    position: relative;
    .esc_desc {
      padding: 0px 7px;
      border-radius: 4px;
      border: 1px solid #00c0de;
      cursor: pointer;
      font-size: 14px;
      &:hover {
        background: #00c0de;
        color: #fafafa;
      }
    }
  }
}
.__box_wrapper .el-form-item {
  display: inline-block !important;
  position: relative;
}
.tips {
  display: block;
  text-align: center;
  margin-bottom: 20px;
  font-size: 12px;
  color: #30cca5;
}
.fontSizeBox {
  position: relative;
}
.fontSize {
  position: absolute;
  z-index: 10000;
  left: 420px;
  top: -92px;
  color: #30cca5;
  font-size: 12px;
}
.titleStyle {
  display: inline;

  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  /*! autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  -webkit-line-clamp: 2; /** 显示的行数 **/
  overflow: hidden; /** 隐藏超出的内容 **/
}
.box {
  position: relative;
}

.timeCss2 {
  display: inline;
  margin-left: 30px;
  color: #00c0de;
  font-size: 12px;
}
.tableBox {
  width: 100%;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
</style>

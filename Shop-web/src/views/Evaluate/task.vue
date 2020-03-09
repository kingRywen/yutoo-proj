<template>
  <div class="box">
    <y-template>
      <!-- <div slot="ScreenTip">
                <span>筛选条件</span>
                <span></span>
      </div>-->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item label="任务分组" prop="classifyName">
          <el-input v-model.trim="listQuery.classifyName" placeholder="请输入任务分组" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model.trim="listQuery.taskName" placeholder="请输入任务名称" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="抓取状态">
          <el-select v-model="listQuery.status" placeholder="请选择" size="small" class="select-status" clearable>
            <el-option
              :label="item[0]"
              :value="item[1]"
              v-for="item in [
                        ['抓取中','1'],
                        ['抓取成功','2'],
                        ['抓取失败','3'],
                        ]"
              :key="status+'_'+item[1]"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="listQuery.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
			
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
			style="width:337px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- ,'重置搜索' -->
          <!-- <el-button
            size="small"
            type="primary"
            :loading="listLoading"
            plain
            v-for="item in ['确认搜索','重置搜索']"
            @click="distribute(item)"
          >{{item}}</el-button> -->

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
              @click="distribute('重置搜索')"
              :disabled="$store.state.isloading || $store.state.loading"
            >重置搜索</el-button>
        </el-form-item>
      </el-form>
      <div slot="HandleBtn">
        <el-button
          type="primary"
          plain
          :loading='item.loading'
          size="small"
          v-for="(item,index) in HandleBtns"
          @click="distribute(item.name,index)"
        >{{item.name}}</el-button>
      </div>
      <el-table
        slot="table"
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="classifyName" label="任务分组" min-width="120"></el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="100"></el-table-column>
        <el-table-column prop="dataType" label="数据类型" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.dataType==0">产品链接</div>
            <div v-else-if="scope.row.dataType==1">关键词</div>
            <div v-else-if="scope.row.dataType==2">类目</div>
            <div v-else-if="scope.row.dataType==3">Top100链接</div>
            <div v-else-if="scope.row.dataType==4">同款产品</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="数据源" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.dataType==0">
              <div v-if="(scope.row.productUrls instanceof Array)&&scope.row.productUrls.length!==0">
                <el-button type="text" @click="showDataTypeDialog(scope.row)">{{scope.row.productUrls.length}}</el-button>
              </div>
              <div v-else>-</div>
            </div>
            <div v-else-if="scope.row.dataType==1">
              <div v-if="(scope.row.keywords instanceof Array)&&scope.row.keywords.length!==0">
                <el-button type="text" @click="showDataTypeDialog(scope.row)">{{scope.row.keywords.length}}</el-button>
              </div>
              <div v-else>-</div>
            </div>
            <div v-else-if="scope.row.dataType==2">
              <div v-if="scope.row.categoryUrl!==null">
                <el-button type="text" @click="showDataTypeDialog(scope.row)">1</el-button>
              </div>
              <div v-else>-</div>
            </div>
            <div v-else-if="scope.row.dataType==3">
              <div v-if="(scope.row.top100BsrUrls instanceof Array)&&scope.row.top100BsrUrls.length!==0">
                <el-button type="text" @click="showDataTypeDialog(scope.row)">{{scope.row.top100BsrUrls.length}}</el-button>
              </div>
              <div v-else>-</div>
            </div>
            <div v-else-if="scope.row.dataType==4">
              <div v-if="(scope.row.imageUrls instanceof Array)&&scope.row.imageUrls.length!==0">
                <el-button type="text" @click="showDataTypeDialog(scope.row)">{{scope.row.imageUrls.length}}</el-button>
              </div>
              <div v-else>-</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="160"></el-table-column>
        <el-table-column label="抓取状态" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0">待处理</div>
            <div v-else-if="scope.row.status==1">抓取中</div>
            <div v-else-if="scope.row.status==2">抓取成功</div>
            <div v-else-if="scope.row.status>=3">抓取失败</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="resultTime" label="结果生成时间" min-width="135"></el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
						<el-tooltip  content="查看" placement="top" effect="light">
							<el-button
							  v-if="scope.row.status==2"
							  type="text"
							  size="small"
							  icon="el-icon-search"
							  @click="viewDetails(scope.row)"
							></el-button>
						</el-tooltip>
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

    <el-dialog
      :close-on-click-modal="false"
      title="添加任务"
      :visible.sync="outerVisible"
      width="500px"
      class="outer-visible-dialog customDialog"
    >
      <el-form size="small" :model="ruleTaskForm" :rules="rules" ref="ruleTaskForm" label-width="85px" class="options-form">
        <el-form-item
          label="任务名称"
          prop="taskName"
          :rules="[
                { required: true, message: '请输入任务名称', trigger: ['blur'] },
                ]"
        >
          <el-input v-model.trim="ruleTaskForm.taskName" placeholder="请输入" size="small"></el-input>
        </el-form-item>
        <el-form-item
          label="数据类型"
          prop="dataType"
          :rules="[
                { required: true, message: '请选择数据类型', trigger: ['blur', 'change'] },
                ]"
        >
          <el-select v-model="ruleTaskForm.dataType" placeholder="请选择" size="small" @change="restRuleTaskForm">
            <el-option
              v-for="item in [
                                {value:0,label:'产品链接'},
                                {value:1,label:'关键词'},
                                {value:2,label:'类目链接'},
                                {value:3,label:'Top100链接'},
                                {value:4,label:'同款产品图片链接'},
                            ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="产品链接"
          prop="productUrls"
          v-if="ruleTaskForm.dataType==0"
          key="productUrls"
          :rules="[
                { required: true, message: '请输入产品链接', trigger: ['blur'] },
                ]"
        >
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="ruleTaskForm.productUrls"></el-input>
        </el-form-item>

        <el-form-item
          label="关键词"
          prop="keywords"
          v-if="ruleTaskForm.dataType==1"
          key="keywords"
          :rules="[
                { required: true, message: '请输入关键词', trigger: ['blur'] },
                ]"
        >
          <el-input type="textarea" :rows="5" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" v-model.trim="ruleTaskForm.keywords"></el-input>
        </el-form-item>

        <!-- <el-form-item label="类目:" prop="categoryId" v-if="ruleTaskForm.dataType==2"
                :rules="[
                { required: true, message: '请选择类目', trigger: ['blur', 'change'] },
                ]">
                    <el-cascader
                    class="cascader-category-id"
                    clearable
                    v-model="ruleTaskForm.categoryId"
                    :options="pParams.taskClassify0List" 
                    change-on-select
                    size="small"
                    :props="props">
                    </el-cascader>
        </el-form-item>-->
        <el-form-item
          label="类目"
          prop="categoryId"
          v-if="ruleTaskForm.dataType==2||ruleTaskForm.dataType==4"
          key="categoryId"
          :rules="[
                { required: true, message: '请选择类目', trigger: ['blur', 'change'] },
                ]"
        >
          <!-- <el-cascader
                    class="cascader-category-id"
                    clearable
                    v-model="ruleTaskForm.categoryId"
                    :options="pParams.taskClassify0List" 
                    change-on-select
                    size="small"
                    :props="props">
          </el-cascader>-->
          <el-cate
            :Cate.sync="category.category"
            width="100%"
            :HaveChildform.sync="category.haveChildren"
            :CategoryId.sync="ruleTaskForm.categoryId"
            :platformId="platformId"
          ></el-cate>
        </el-form-item>

        <el-form-item
          label="搜索页数"
          prop="searchPages"
          v-if="ruleTaskForm.dataType==1||ruleTaskForm.dataType==2"
          key="searchPages"
          :rules="[
                { required: true, message: '请选择搜索页数', trigger: ['blur', 'change'] },
                ]"
        >
          <el-select v-model="ruleTaskForm.searchPages" placeholder="请选择" size="small">
            <el-option v-for="item in [1,2,3,4,5,6,7,8,9,10]" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="top100链接"
          prop="top100BsrUrls"
          v-if="ruleTaskForm.dataType==3"
          key="top100BsrUrls"
          :rules="[
                { required: true, message: '请输入top100链接', trigger: ['blur'] },
                ]"
        >
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="ruleTaskForm.top100BsrUrls"></el-input>
        </el-form-item>

        <el-form-item
          label="web排名最小值"
          prop="minWebRank"
          v-if="ruleTaskForm.dataType==4"
          key="minWebRank"
          :rules="[
                { required: true, message: '请输入web排名最大值', trigger: 'blur' },
                ]"
        >
          <el-input v-model.trim="ruleTaskForm.minWebRank" placeholder="请输入值" size="small"></el-input>
        </el-form-item>

        <el-form-item
          label="web排名最大值"
          prop="maxWebRank"
          v-if="ruleTaskForm.dataType==4"
          key="maxWebRank"
          :rules="[
                { required: true, message: '请输入web排名最大值', trigger: 'blur' },
                ]"
        >
          <el-input v-model.trim="ruleTaskForm.maxWebRank" placeholder="请输入值" size="small"></el-input>
        </el-form-item>

        <el-form-item
          label="同类产品图片url"
          prop="imageUrls"
          v-if="ruleTaskForm.dataType==4"
          key="imageUrls"
          :rules="[
                { required: true, message: '请输入同类产品图片url', trigger: ['blur'] },
                ]"
        >
          <el-input type="textarea" :rows="5" placeholder="多个换行输入" v-model.trim="ruleTaskForm.imageUrls"></el-input>
        </el-form-item>

        <el-form-item
          label="任务分组"
          prop="classifyId"
          :rules="[
                { required: true, message: '请选择任务分组', trigger: ['blur', 'change'] },
                ]"
        >
          <div class="flex">
            <el-cascader
            class="cascader-classify-id"
            clearable
            v-model="ruleTaskForm.classifyId"
            :options="addTaskOption"
            size="small"
            :props="props"
            change-on-select
          ></el-cascader>
          <el-button type="primary" @click="showInnerTaskDialog()" size="small">添加</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-dialog
        :close-on-click-modal="false"
        width="500px"
        title="添加分组"
        :visible.sync="innerVisible"
        append-to-body
        class="inner-visible-dialog customDialog"
      >
        <el-form
          size="small"
          :model="ruleForm"
          :rules="rules"
          ref="ruleInnerForm"
          label-width="115px"
          class="options-form"
        >
          <el-form-item
            label="分组"
            prop="classifyName"
            :rules="[
                        { required: true, message: '请输入分组', trigger: 'blur' },
                    ]"
          >
            <el-input v-model.trim="ruleForm.classifyName" placeholder="请输入值" size="small" clearable></el-input>
          </el-form-item>
          <!-- :show-all-levels="false" -->
          <!-- :rules="[
                        { required: true, message: '选择任务分组', trigger: ['blur', 'change'] },
          ]"-->
          <el-form-item label="上级分组" prop="parentClassifyId">
            <el-cascader
              clearable
              :options="addClassifyOption"
              size="small"
              :props="props"
              v-model="ruleForm.parentClassifyId"
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitInnerTaskForm()" size="small">确认添加</el-button>
          <el-button type="primary" @click="cancel(1)" size="small" plain>取消</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTaskForm()" size="small" :loading="loadingBtn1">确认添加</el-button>
        <el-button type="primary" @click="cancel(0)" size="small" :loading="loadingBtn1" plain>取消</el-button>
      </div>
    </el-dialog>

    <ClassifyDialog
      ref="classifyDialog"
      :taskClassify1List="pParams.taskClassify0List[0].childList"
      :parent-classify-options="pParams.taskClassify0List"
      :multiple-selection="multipleSelection"
      v-on:reloadList="reloadList"
    ></ClassifyDialog>

    <yt-dialog :options="dataTypeOptions" :events="dataTypeEvents">
      <el-table
        :data="dataTypeList"
        v-loading="dataTypeListLoading"
        :key="dataTypeTableKey"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column
          v-for="item in dataTypeColumns"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          :key="item.prop"
        >
          <template slot-scope="scope">
            <!---->
            <div v-if="tableDataType==2" key="table-data-type-2">
              <div v-if="item.prop=='categoryUrl'" key="table-data-type-2-categoryUrl">
                <a
                  @click="openWebsite(scope.row[item.prop])"
                  class="a-title"
                >{{scope.row[item.prop].length>60?scope.row[item.prop].substr(0, 45)+' ...':scope.row[item.prop]}}</a>
              </div>
              <div v-else-if="item.prop=='searchPages'" key="table-data-type-2-searchPages">
                <el-button @click="showDataTypeColumnDialog(scope.row)" type="text">{{scope.row[item.prop]}}</el-button>
              </div>
              <div v-else key="table-data-type-2-else">-</div>
            </div>
            <div v-else-if="tableDataType==3" key="table-data-type-3">
              <div v-if="item.prop=='top100BsrUrl'" key="table-data-type-0-top100BsrUrl">
                <a
                  @click="openWebsite(scope.row[item.prop])"
                  class="a-title"
                >{{scope.row[item.prop].length>100?scope.row[item.prop].substr(0, 80)+' ...':scope.row[item.prop]}}</a>
              </div>
              <div v-else key="table-data-type-0-else">-</div>
            </div>
            <div v-else-if="tableDataType==4" key="table-data-type-4">
              <div v-if="item.prop=='imageUrl'" key="table-data-type-4-imageUrl">
                <el-popover placement="right" trigger="hover">
                  <div style="width: 300px;height:150px;">
                    <!-- <img :src="scope.row[item.prop]" style='display:block;height:auto;width:400px;' /> -->
                    <div
                      style="width:100%;height:100%;background-repeat:no-repeat;background-size:contain;background-position:center;"
                      :style="{backgroundImage: 'url('+ scope.row[item.prop] +')' }"
                    ></div>
                  </div>
                  <div slot="reference" class="__img_wrapper" style="width:30px; height:30px">
                    <img
                      class="loadingImg"
                      :src="scope.row[item.prop]"
                      height="30"
                      v-lazy="scope.row[item.prop]?scope.row[item.prop]:'-'"
                    >
                  </div>
                </el-popover>
              </div>

              <div v-else-if="item.prop=='categoryUrl'" key="table-data-type-4-categoryUrl">
                <a
                  @click="openWebsite(scope.row[item.prop])"
                  class="a-title"
                >{{scope.row[item.prop].length>40?scope.row[item.prop].substr(0, 25)+' ...':scope.row[item.prop]}}</a>
                <!-- {{scope.row[item.prop]}} -->
              </div>
              <div v-else-if="item.prop=='ranking'" key="table-data-type-4-ranking">
                <el-button @click="showDataTypeColumnDialog(scope.row)" type="text">{{scope.row[item.prop]}}</el-button>
              </div>
              <div v-else key="table-data-type-4-else">-</div>
            </div>
            <div v-else-if="tableDataType==0" key="table-data-type-0">
              <div v-if="item.prop=='productUrl'" key="table-data-type-0-productUrls">
                <a
                  @click="openWebsite(scope.row[item.prop])"
                  class="a-title"
                >{{scope.row[item.prop].length>100?scope.row[item.prop].substr(0, 80)+' ...':scope.row[item.prop]}}</a>
              </div>
              <div v-else key="table-data-type-0-else">-</div>
            </div>

            <div v-else key="table-data-type-else">{{scope.row[item.prop]}}</div>
          </template>
        </el-table-column>
      </el-table>
    </yt-dialog>

    <yt-dialog :options="dataTypeColumnOptions" :events="dataTypeColumnEvents" class="data-type-column-dialog">
      <el-form :inline="true" :model="formDataType">
        <div class="data-type-form-2" v-if="tableDataType==2">
          <el-form-item label="抓取页数:">
            <el-input v-model.trim="formDataType.searchPages" size="small"></el-input>
          </el-form-item>
        </div>
        <div class="data-type-form-4" v-else-if="tableDataType==4">
          <el-form-item label="排名:">
            <el-input v-model.trim="formDataType.minWebRank" size="small"></el-input>
          </el-form-item>
          <el-form-item label="~">
            <el-input v-model.trim="formDataType.maxWebRank" size="small"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import YTemplate from '../Common/y-template/index'
import ClassifyDialog from './ClassifyDialog'
const _ = require('lodash')
export default {
  components: {
    YTemplate,
    ClassifyDialog
  },
  props: ['pParams', 'parentIds'],
  data() {
    return {
      HandleBtns:[{name:'添加任务',loading:false},{name:'移动分组',loading:false},{name:'删除',loading:false},{name:'重新抓取',loading:false}],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: '',
        classifyId: null,
        siteId: null,
        sellerId: null,
        classifyName: null,
        taskName: null,
        status: null,
        startTime: null,
        endTime: null,
        daterange: []
      },

      outerVisible: false,
      innerVisible: false,

      // parentClassifyIdOptions:[],
      props: {
        label: 'classifyName',
        value: 'classifyId',
        children: 'childList'
      },
      ruleTaskForm: {
        platformId: '',
        siteId: null,
        sellerId: null,
        taskName: null,

        dataType: null,
        productUrls: null,
        keywords: null,
        categoryId: null,
        searchPages: null,
        top100BsrUrls: null,
        minWebRank: null,
        maxWebRank: null,
        imageUrls: null,
        classifyId: null
      },
      category: {
        category: null,
        haveChildren: null
      },
      ruleForm: {
        parentClassifyId: null,
        platformId: '',
        siteId: null,
        sellerId: null,
        classifyType: null,
        classifyName: null
      },
      multipleSelection: [],
      dataTypeOptions: {
        visible: false,
        width: '600px',
        title: '数据源',
        showOk:false,
        showCancel: false
      },
      dataTypeEvents: {
        handleOkClick: () => {
          this.dataTypeOptions.visible = false
        }
      },
      dataTypeTableKey: 1,
      dataTypeList: null,
      tableDataType: null,
      dataTypeListLoading: false,
      dataTypeColumns: [],

      dataTypeColumnOptions: {
        visible: false,
        width: '320px',
        title: '编辑',
        okBtnText: '保 存'
      },
      dataTypeColumnEvents: {
        handleOkClick: () => {
          this.submitDataTypeColumn()
        }
      },
      dataTypeColumnRow: null,
      formDataType: {
        searchPages: null,
        minWebRank: null,
        maxWebRank: null
      },
      loadingBtn1: false,
      parentIdsArray: [],
      addClassifyOption: [],
      addTaskOption: []
    }
  },
  watch: {
    'pParams.classifyId'(val) {
      this.listQuery.pageNumber = 1
      if (val !== null) {
        this.listQuery.classifyId = val
        this.getList()
      } else {
        this.listLoading = true
        this.list = null
        this.total = null
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      }
    },
    sellerData() {
      this.$store.state.common.siteId__ = this.siteId
    },
    parentIds(newN, oldN) {
      console.log(newN)
      this.parentIdsArray = newN
    },
    'pParams.taskClassify0List'(val) {
      let all = _.cloneDeep(val)
      this.addTaskOption = all[0].childList
      this.addClassifyOption = all[0].childList
    }
  },
  created() {
    this.listQuery.platformId = this.platformId
    this.ruleForm.platformId = this.platformId
    this.ruleTaskForm.platformId = this.platformId
    if (this.siteId) {
      this.$store.state.common.siteId__ = this.siteId
    }

    this.ruleForm.siteId = this.pParams.siteId
    this.ruleForm.sellerId = this.pParams.sellerId

    if (this.pParams.isBackPage) {
      this.listQuery.classifyId = this.pParams.classifyId
      this.getList()
    }

    this.addTaskOption = this.pParams.taskClassify0List
    this.addClassifyOption = this.pParams.taskClassify0List

    
  },

  methods: {
    cancel(type) {
      this.$refs.ruleTaskForm.resetFields()
      if (type) {
        this.innerVisible = false
      } else {
        this.outerVisible = false
      }
    },
    reloadList() {
      this.getList()
    },
    setDisabled(all,parent) {
      all.forEach( (el,index) => {
        if (!el.haveChildren && el.dataFlag ===1) {
            //el.disabled = true
            delete all[index];
            if(parent){
                parent.flagIndex = parent.flagIndex || 0;
                parent.flagIndex ++;
            }
            delete all[index];
            if( parent && parent.flagIndex === all.length){
                delete parent.childList
            }    
        }
        if (el.childList) {
          this.setDisabled(el.childList ,el)
        }
      })
    },
    distribute(btn,index) {
      switch (btn) {
        case '确认搜索':
          this.handleFilter()
          break
		case '重置搜索':
		  this.listQuery.classifyName = null
		  this.listQuery.taskName = null
		  this.listQuery.status = null
		  this.listQuery.startTime = null
		  this.listQuery.endTime = null
		  this.listQuery.daterange = []
		  this.handleFilter()
		  break
        case '添加任务':
          this.showTaskDialog()
          break
        // case "添加分类":
        //   this.$refs.classifyDialog.showDialog(
        //     true,
        //     {
        //       fun: "add",
        //       type: 5,
        //       sellerId: this.pParams.sellerId,
        //       siteId: this.pParams.siteId
        //     },
        //     null
        //   );
        //   break;
        case '移动分组':
          if (this.checkRows()) {
            this.$refs.classifyDialog.showDialog(
              true,
              {
                fun: 'move',
                type: 5,
                sellerId: this.pParams.sellerId,
                siteId: this.pParams.siteId
              },
              null
            )
          }

          //    this.showDialog('move',5,null)
          break
        case '删除':
          if (this.checkRows()) {
            
            this.deleteTasks(index)
          }
          break
        case '重新抓取':
          if (this.checkRows()) {
            this.reGrasp(index)
          }
          break
      }
    },
    openWebsite(url) {
      window.open(url)
    },
    getList() {
      this.listQuery.siteId = this.pParams.siteId
      this.listQuery.sellerId = this.pParams.sellerId
      this.listQuery.classifyId = this.pParams.classifyId
      this.listLoading = true
      let classifyName = this.listQuery.classifyName
      if (classifyName !== null) {
        let flag = _.isEmpty(classifyName.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          this.listQuery.classifyName = null
        }
      }
      let taskName = this.listQuery.taskName
      if (taskName !== null) {
        let flag = _.isEmpty(taskName.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          this.listQuery.taskName = null
        }
      }

      let daterange = this.listQuery.daterange
      if (daterange !== null && daterange.length === 2) {
        this.listQuery.startTime = daterange[0]
        this.listQuery.endTime = daterange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      let listQuery = _.cloneDeep(this.listQuery)

      delete listQuery.daterange

      this.$api['taskReviewContentList'](listQuery)
        .then(res => {
          let { rows, total } = res
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
    handleFilter() {
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    viewDetails(row) {
      if (row.taskId === null) {
        this.$message.warning('taskId为空')
        return
      }
      this.$store.commit('setBackBtn', true)
      this.$emit('viewDetail', row.taskId)
    },
    showTaskDialog() {
      //this.$emit("reloadTaskClassify0List");
      let ruleTaskForm = this.$refs['ruleTaskForm']
      if (ruleTaskForm !== undefined) {
        ruleTaskForm.resetFields()
      }
      this.ruleTaskForm.classifyId = this.parentIdsArray
      this.outerVisible = true
      this.loadingBtn1 = false
    },
    restRuleTaskForm() {
      this.ruleTaskForm.productUrls = null
      this.ruleTaskForm.keywords = null
      this.ruleTaskForm.categoryId = null
      this.ruleTaskForm.searchPages = null
      this.ruleTaskForm.top100BsrUrls = null
      this.ruleTaskForm.minWebRank = null
      this.ruleTaskForm.maxWebRank = null
      this.ruleTaskForm.imageUrls = null
    },
    submitTaskForm() {
      this.$refs['ruleTaskForm'].validate(valid => {
        if (valid) {
          let ruleTaskForm = _.cloneDeep(this.ruleTaskForm)
          if (ruleTaskForm.productUrls !== null) {
            ruleTaskForm.productUrls = _.compact(
              this.ruleTaskForm.productUrls.split('\n')
            )
            ruleTaskForm.productUrls = _.uniq(ruleTaskForm.productUrls)
          }
          if (ruleTaskForm.keywords !== null) {
            ruleTaskForm.keywords = _.compact(
              this.ruleTaskForm.keywords.split('\n')
            )
            ruleTaskForm.keywords = _.uniq(ruleTaskForm.keywords)
          }
          if (ruleTaskForm.top100BsrUrls !== null) {
            ruleTaskForm.top100BsrUrls = _.compact(
              this.ruleTaskForm.top100BsrUrls.split('\n')
            )
            ruleTaskForm.top100BsrUrls = _.uniq(ruleTaskForm.top100BsrUrls)
          }
          if (ruleTaskForm.imageUrls !== null) {
            ruleTaskForm.imageUrls = _.compact(
              this.ruleTaskForm.imageUrls.split('\n')
            )
            ruleTaskForm.imageUrls = _.uniq(ruleTaskForm.imageUrls)
          }
          // if(ruleTaskForm.categoryId!==null){
          //     ruleTaskForm.classifyId =_.last(ruleTaskForm.classifyId)
          // }

          ruleTaskForm.classifyId = _.last(ruleTaskForm.classifyId)
          ruleTaskForm.siteId = this.pParams.siteId
          ruleTaskForm.sellerId = this.pParams.sellerId

          this.loadingBtn1 = true
          this.$api['taskReviewContentSave'](ruleTaskForm)
            .then(res => {
              if (res.code == 0) {
                this.outerVisible = false
                this.getList()
                this.$emit('reloadTaskClassify0List')
              }
              this.loadingBtn1 = false
            })
            .catch(err => {
              this.loadingBtn1 = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showInnerTaskDialog() {
      let ruleInnerForm = this.$refs['ruleInnerForm']
      if (ruleInnerForm !== undefined) {
        ruleInnerForm.resetFields()
      }
      let all = this.addClassifyOption
      this.setDisabled(all)
      this.addClassifyOption = all
      this.innerVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('至少选一项')
        return false
      }
      return true
    },
    deleteTasks(index) {
       //this.HandleBtns[index].loading = true;
      this.$confirm('是否删除选定的任务？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.HandleBtns[index].loading = true;
          let taskIds = []
          this.multipleSelection.forEach(element => {
            taskIds.push(element.taskId)
          })
          this.$api['taskReviewContentRemove']({ taskIds }).then(res => {
            if (res.code == 0) {
              this.handleFilter()
              this.$emit('reloadTaskClassify0List')
              this.HandleBtns[index].loading = false;
            }
          }).catch(ERR=>{
             this.HandleBtns[index].loading = false;
          })
        })
        .catch(() => {})
    },
    reGrasp(index) {
      let taskIds = []
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId)
      })
      this.HandleBtns[index].loading = true;
      this.$api['taskReviewContentReCrawl']({ taskIds }).then(res => {
        if (res.code == 0) {
          this.HandleBtns[index].loading = false;
          this.handleFilter()
        }
      }).catch(err=>{
          this.HandleBtns[index].loading = false;
      })
    },
    showDataTypeDialog(row) {
      console.log(row)
      this.dataTypeOptions.visible = true
      this.dataTypeListLoading = true
      setTimeout(() => {
        this.dataTypeListLoading = false
      }, 500)
      let dataType = row.dataType
      let taskId = row.taskId
      this.tableDataType = dataType
      this.dataTypeList = null
      if (dataType == 0) {
        this.dataTypeColumns = [
          { prop: 'productUrl', label: '产品链接', width: '160' }
        ]
        let list = []
        row.productUrls.forEach(element => {
          list.push({ productUrl: element, type: dataType, taskId })
        })
        this.dataTypeList = list
      } else if (dataType == 1) {
        this.dataTypeColumns = [
          { prop: 'keyword', label: '关键词', width: '160' },
          { prop: 'searchPages', label: '抓取页数', width: '160' }
        ]
        let list = []
        row.keywords.forEach(element => {
          list.push({
            keyword: element,
            searchPages: row.searchPages,
            type: dataType,
            taskId
          })
        })
        this.dataTypeList = list
      } else if (dataType == 2) {
        this.dataTypeColumns = [
          { prop: 'categoryUrl', label: '类目', width: '160' },
          { prop: 'searchPages', label: '抓取页数', width: '100' }
        ]
        let list = []
        list.push({
          categoryUrl: row.categoryUrl,
          searchPages: row.searchPages,
          type: dataType,
          taskId
        })
        this.dataTypeList = list
      } else if (dataType == 3) {
        this.dataTypeColumns = [
          { prop: 'top100BsrUrl', label: '数据源', width: '160' }
        ]
        let list = []
        row.top100BsrUrls.forEach(element => {
          list.push({
            top100BsrUrl: element,
            type: dataType,
            taskId
          })
        })
        this.dataTypeList = list
      } else if (dataType == 4) {
        this.dataTypeColumns = [
          { prop: 'imageUrl', label: '同款产品', width: '160' },
          { prop: 'categoryUrl', label: '类目链接', width: '160' },
          { prop: 'ranking', label: '排名', width: '120' }
        ]
        let list = []
        let ranking = '-'
        if (row.minWebRank && row.maxWebRank) {
          ranking = `${row.minWebRank}~${row.maxWebRank}`
        } else if (row.minWebRank) {
          ranking = row.minWebRank
        } else if (row.maxWebRank) {
          ranking = row.maxWebRank
        }
        row.imageUrls.forEach(element => {
          list.push({
            categoryUrl: row.categoryUrl,
            imageUrl: element,
            ranking,
            type: dataType,
            taskId
          })
        })
        this.dataTypeList = list
      }
    },
    showDataTypeColumnDialog(row) {
      this.dataTypeColumnRow = row
      let type = row.type

      console.log(row)
      this.formDataType = {
        searchPages: null,
        minWebRank: null,
        maxWebRank: null
      }
      if (type == 2) {
        this.formDataType.searchPages = row.searchPages
      } else if (type == 4) {
        let rankingStr = row.ranking
        let rankingArr = rankingStr.split('~')
        if (rankingArr.length == 2) {
          this.formDataType.minWebRank = rankingArr[0]
          this.formDataType.maxWebRank = rankingArr[1]
        }
      } else {
        return
      }
      this.dataTypeColumnOptions.visible = true
    },
    submitDataTypeColumn() {
      let dataType = this.dataTypeColumnRow.type
      let taskId = this.dataTypeColumnRow.taskId
      let params = {
        taskId,
        dataType
      }
      if (dataType == 2) {
        this.dataTypeColumnRow.searchPages = this.formDataType.searchPages
        params.searchPages = this.formDataType.searchPages
      } else if (dataType == 4) {
        this.dataTypeColumnRow.ranking = `${this.formDataType.minWebRank}~${
          this.formDataType.maxWebRank
        }`
        params.minWebRank = this.formDataType.minWebRank
        params.maxWebRank = this.formDataType.maxWebRank
      } else {
        return
      }

      this.$api['taskReviewContentUpdate'](params).then(res => {
        if (res.code == 0) {
          this.dataTypeColumnOptions.visible = false
        }
      })
    },
    submitInnerTaskForm() {
      this.$refs['ruleInnerForm'].validate(valid => {
        if (valid) {
          this.ruleForm.platformId = this.listQuery.platformId
          this.ruleForm.sellerId = this.listQuery.sellerId
          this.ruleForm.siteId = this.listQuery.siteId
          let ruleForm = _.cloneDeep(this.ruleForm)
          if (
            ruleForm.parentClassifyId !== null &&
            ruleForm.parentClassifyId.length > 0
          ) {
            ruleForm.parentClassifyId = _.last(ruleForm.parentClassifyId)
          } else {
            ruleForm.parentClassifyId = 0
          }
          ruleForm.classifyType = 0
          this.$api['taskClassifySave'](ruleForm).then(res => {
            if (res.code == 0) {
              if (ruleForm.parentClassifyId !== 0) {
                this.ruleTaskForm.classifyId = ruleForm.parentClassifyId
              }
            }
            // todo
            // this.getTaskClassifyList(classifyType);/
            this.$emit('reloadTaskClassify0List')
          })
          this.innerVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  .el-form-item__content {
    .el-input {
      width: 150px;
    }
  }
  .el-table__row {
    .a-title {
      color: #2f00cc;
      text-decoration: underline;
    }
  }
  .outer-visible-dialog {
    /deep/.el-dialog__title {
      color: #2c3e50;
      font-size: 16px;
    }
    .el-form-item__content {
      .el-select,
      .el-input,
      .el-textarea,
      .cascader-category-id {
        width: 100%;
      }
      .cascader-classify-id {
        width: 100%;
        margin-right: 5px;
      }
    }
    /deep/.__cate {
      width: 100%;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}
.inner-visible-dialog {
  /deep/.el-dialog__title {
    color: #2c3e50;
    font-size: 16px;
  }
  .el-form-item__content {
    .el-input,
    .el-cascader {
      width: 260px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
  }
}
.data-type-column-dialog {
  .data-type-form-2 {
    .el-input {
      width: 170px;
    }
  }
  .data-type-form-4 {
    .el-input {
      width: 70px;
    }
  }
}
</style>

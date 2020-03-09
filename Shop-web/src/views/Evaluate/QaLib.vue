<template>
  <div class="products-box">

    <y-template>
      <div slot="HandleBtn">
        <el-button type="primary" :loading="btnLoading" plain size="small" v-for="item in ['导出']" @click="distribute(item)">{{item}}</el-button>
      </div>
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item label="产品ASIN" prop="parentAsin">
          <el-input v-model.trim="listQuery.parentAsin" placeholder="请输入" size="mini" clearable></el-input>
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
            @click="distribute('重置搜索')"
            :disabled="$store.state.isloading || $store.state.loading"
            >重置搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table slot="table" :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" border stripe tooltip-effect="light" @selection-change="handleSelectionChange"
        @sort-change='sortChange'
      >
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="questionTime" label="提问时间" min-width="90"  sortable="custom">
        </el-table-column>
        <el-table-column
            prop="parentAsin"
            label="ASIN"
            min-width="100">
			<template slot-scope="scope">				
			  <a
			    :href="scope.row.productUrl"
				:style = "!scope.row.childList ? 'color: #108ee9;': 'color: #108ee9;'"
			    target="_blink"
			  >{{scope.row.parentAsin}}</a>
			</template>
        </el-table-column>
        <el-table-column prop="questionContent" label="提问内容" min-width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="questionContentCn" label="中文翻译" min-width="150" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="回答数" prop="answerCnt" min-width="80"  sortable="custom">
          <template slot-scope="scope">
            <ElButton type="text" @click="infoOuterParams.questionId = scope.row.questionId, infoOpts.visible = true">{{scope.row.answerCnt}}</ElButton>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <ElTooltip content="查看对应产品信息" placement="top" effect="light">
              <el-button type="text" size="small" icon="el-icon-search" @click="selectProductPage(scope.row)"></el-button>
            </ElTooltip>
            <ElTooltip content="翻译" placement="top" effect="light">
              <el-button type="text" size="small" icon="el-icon-search iconfont1 iconshenqingfanyi" @click="translate(scope.row)"></el-button>
            </ElTooltip>
            
          </template>
        </el-table-column>
      </el-table>
      <el-pagination slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </y-template>

    <yt-dialog :options="diaOpts" :events="diaEvents">
      <p>{{translateData.enVal}}</p>
      <el-form size="small" :model="translateData" ref="transForm" :rules="translateRule">
        <el-form-item prop="value">
          <ElInput v-model.trim="translateData.value" type="textarea" :rows="8" placeholder="请输入翻译内容"></ElInput>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="infoOpts" :events="infoEvents">
      <main-layout ref="info" :columns="infoColumns" :outerParams="infoOuterParams" :showSearch='false' :showSelection='false' url="taskReviewContentProductListProductAqRec"></main-layout>
    </yt-dialog>
  </div>
</template>
<script>
import YTemplate from "../Common/y-template/index";
import {downloadFile} from 'Utils/tools';
const _ = require("lodash");
export default {
  components: {
    YTemplate
  },
  props: ["pParams"],
  data() {
    let vm = this
    return {
      infoOuterParams: {
        questionId: null
      },
      infoColumns: [
        {
          label: '回答者名称',
          value: 'answerName',
          url: 'answerUrl'
        },
        {
          label: '时间',
          value: 'answerTime'
        },
        {
          label: '内容',
          value: 'answerContent',
          line: 1
        },
      ],
      infoData: [],
      translateData: {
        value: null,
        enVal: '-'
      },
      translateRule: {
        value: [{ required: true, message: '请输入翻译内容' }]
      },
      diaOpts: {
        visible: false,
        title: '翻译',
        size: 'small'
      },
      diaEvents: {
        handleOkClick() {
          vm.submitTranslate()
        },
        close() {
          vm.$refs.transForm.resetFields()
        }
      },
      infoOpts: {
        visible: false,
        title: '问答详情',
        size: 'large',
        showOk: false,
				showCancel:false
      },
      infoEvents: {
      },
      btnLoading: false,
      selection: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        classifyId: null,
        platformId: '',
        siteId: null,
        sellerId: null,
        parentAsin: null,
        flag: 0
      }
    };
  },
  watch: {
    "pParams.classifyId"(val) {
      if (val !== null) {
        this.listQuery.classifyId = val;
        this.listQuery.siteId = this.pParams.siteId;
        this.listQuery.sellerId = this.pParams.sellerId;
        this.getList();
      } else {
        this.listLoading = true;
        this.list = null;
        this.total = null;
        setTimeout(() => {
          this.listLoading = false;
        }, 500);
      }
    }
  },
  created(){
    this.listQuery.platformId=this.platformId;
  },
  methods: {
    getInfoList(row) {
      this.$nextTick(() =>{
        this.$refs.info.getList({questionId: row.questionId})
      })
    },
    handleSelectionChange(val) {
      this.selection = val
    },
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.handleFilter();
          break;
		case "重置搜索":
		  this.listQuery.parentAsin = null
		  this.handleFilter();
		  break;  
        case "导出":
          this.exportFile();
          break;
        case "移动产品分类":
          this.showDialog(null);
          break;
      }
    },
    //tabl表格排序改变
      sortChange(column, prop, order){
          let tit=column.prop; //排序的字段名
          let sort=column.order;//排序顺序
          // console.log(tit);
          // console.log(sort);
          let v=this.sortableFunc(column, tit, sort );
          this.listQuery.sortField=v.sortField;
          this.listQuery.sort=v.sort;
          this.listQuery.pageNumber=1;
          this.getList();
      },
  //table排序参数处理
      sortableFunc(column, pro, order ){
          let prop = pro.replace(/[A-Z]/g, function (match) {
              return '_' + match.toLowerCase()
          })
          return {
              sort: order === 'ascending' ? 1 : 0,
              sortField: prop
          }
      },
    getList() {
      this.listLoading = true;
      this.$api["taskReviewContentProductListProductAqRt"](
        this.listQuery
      )
        .then(res => {
          let { rows, total } = res;
          this.list = rows;
          this.total = total;
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    exportFile() {
      const {classifyId,platformId,siteId,sellerId,parentAsin} = this.listQuery
      let questionIds = this.selection.map(el => el.questionId)
      let params = {classifyId,platformId,siteId,sellerId,parentAsin, questionIds}
      this.btnLoading = true
      this.$api[`taskReviewContentProductProdAqRtExport`](params)
      .then(data => {
        this.btnLoading = false
        downloadFile(data)
      }).catch(() => {
        this.btnLoading = false
      })
    },
    submitTranslate() {
      this.$refs.transForm.validate().then(() => {
        let params = {
          id: this.translateData.id,
          contentCn: this.translateData.value
        }
        this.$api[`taskReviewContentProductUpdateTranslateByProdAqRt`](params)
        .then(data => {
          this.diaOpts.visible = false
          this.getList()
        }).catch(() => {})
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
    },
    setFlag(flag) {
      let productFlagBtnArr = this.$refs.productFlagBtn.$children;
      productFlagBtnArr.forEach(element => {
        element.$el.className = "el-button el-button--primary is-plain";
      });
      productFlagBtnArr[flag].$el.className = "el-button el-button--primary";
      this.listQuery.flag = flag;
      this.handleFilter();
    },
    selectProductPage(row) {
      this.$emit("changePage", row.parentAsin);
    },
    translate(row) {
      this.diaOpts.visible = true
      this.translateData.enVal = row.questionContent
      this.translateData.id = row.questionId
    },
    restList() {
      this.listQuery.parentAsin = null;
      this.handleFilter();
    }
  }
};
</script>
<style lang="less" scoped>
.products-box {
  .el-button-group {
    margin-left: 10px;
    margin-bottom: 10px;
  }
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
  }
}
</style>
<style>
.el-tooltip__popper {
  max-width: 800px;
}
</style>


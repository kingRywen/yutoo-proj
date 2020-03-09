<template>
  <div class="products-box">
    <el-button-group ref="productFlagBtn">
      <el-button type="primary" plain @click="setFlag(0)">好评库</el-button>
      <el-button type="primary" plain @click="setFlag(1)">中评库</el-button>
      <el-button type="primary" plain @click="setFlag(2)">差评库</el-button>
    </el-button-group>
    <y-template>
      <!-- <div slot="ScreenTip">
                    <span>筛选条件</span>
                    <span></span>
                </div> -->
      <div slot="HandleBtn">
        <el-button type="primary" :loading="btnLoading" plain size="small" v-for="item in ['导出']" @click="distribute(item)">{{item}}</el-button>
      </div>
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item label="产品ASIN" prop="parentAsin">
          <el-input v-model.trim="listQuery.parentAsin" placeholder="请输入产品ASIN" size="mini" clearable></el-input>
        </el-form-item>
		<el-form-item label="评价者名称" prop="buyerName">
		  <el-input v-model.trim="listQuery.buyerName" placeholder="请输入评价者名称" size="mini" clearable></el-input>
		</el-form-item>
		<el-form-item prop="vineVoiceFlag">
		  <el-select v-model.number="listQuery.vineVoiceFlag" placeholder="是否VINE VOICE" style="width:150px">
			  <el-option label="否" value=0></el-option>
			  <el-option label="是" value=1></el-option>
		  </el-select>
		</el-form-item>
		<el-form-item>
		  <el-date-picker
		    v-model="listQuery.daterange"
		    type="daterange"
		    range-separator="至"
		    start-placeholder="开始日期"
		    end-placeholder="结束日期"
		    size="small"
		    value-format="yyyy-MM-dd"
			style="width:337px"
		  ></el-date-picker>
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
        <el-table-column prop="buyerName" label="评价者名称" min-width="100">
			<template slot-scope="scope">				
			  <a
			    :href="scope.row.buyerUrl"
				:style = "!scope.row.childList ? 'color: #108ee9;': 'color: #108ee9;'"
			    target="_blink"
			  >{{scope.row.buyerName}}</a>
			</template>
        </el-table-column>
        <el-table-column prop="parentAsin" label="ASIN" min-width="100">
			<template slot-scope="scope">				
			  <a
			    :href="scope.row.productUrl"
				:style = "!scope.row.childList ? 'color: #108ee9;': 'color: #108ee9;'"
			    target="_blink"
			  >{{scope.row.parentAsin}}</a>
			</template>
        </el-table-column>
        <el-table-column prop="reviewTime" label="评价时间" width="130" sortable="custom">
        </el-table-column>
        <el-table-column label="评价星级" prop="evaluateStar" min-width="100" sortable="custom">
        </el-table-column>
        <el-table-column label="是否VINE VOICE" width="120">
          <template slot-scope="scope">
            <div v-if="scope.row.vineVoiceFlag==0">否</div>
            <div v-else-if="scope.row.vineVoiceFlag==1">是</div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column class="content-column" label="评价内容" prop="content" show-overflow-tooltip min-width="165">
        </el-table-column>
        <el-table-column class="content-column" label="中文翻译" prop="contentCn" :formatter="_formatData.bind(null, 'contentCn')" show-overflow-tooltip min-width="165">
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <ElTooltip content="查看对应产品信息" placement="top" effect="light">
              <el-button type="text" size="small" icon="el-icon-search" @click="selectProductPage(scope.row)"></el-button>
            </ElTooltip>
            <ElTooltip content="翻译" placement="top" effect="light">
              <el-button type="text" size="small" icon="el-icon-search iconfont1 iconshenqingfanyi" @click="translate(scope.row)"></el-button>
            </ElTooltip>
            <!-- <el-button type="text" size="mini" icon="el-icon-search" @click="selectProductPage(scope.row)"></el-button> -->
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
      tableKey: 0,
      selection: [],
      list: null,
      total: null,
      listLoading: false,
      btnLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        classifyId: null,
        platformId: '',
        siteId: null,
        sellerId: null,
        parentAsin: null,
		buyerName:null,
		vineVoiceFlag:null,
		startTime: null,
		endTime: null,
		daterange: [],
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
  mounted() {
    this.$refs.productFlagBtn.$children[0].$el.className =
      "el-button el-button--primary";
  },
  methods: {
    translate(row) {
      this.diaOpts.visible = true
      this.translateData.enVal = row.content
      this.translateData.id = row.reviewId
    },
    submitTranslate() {
      this.$refs.transForm.validate().then(() => {
        let params = {
          id: this.translateData.id,
          contentCn: this.translateData.value
        }
        this.$api[`taskReviewContentProductUpdateTranslateByProdReview`](params)
        .then(data => {
          this.diaOpts.visible = false
          this.getList()
        }).catch(() => {})
      })
    },
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.handleFilter();
          break;
		case "重置搜索":
		  this.listQuery.parentAsin = null
		  this.listQuery.buyerName = null
		  this.listQuery.vineVoiceFlag = null
		  this.listQuery.startTime = null
		  this.listQuery.endTime = null
		  this.listQuery.daterange = []
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
    exportFile() {
      const {classifyId,platformId,siteId,sellerId,parentAsin, flag} = this.listQuery
      let reviewIds = this.selection.map(el => el.reviewId)
      let params = {classifyId,platformId,siteId,sellerId,parentAsin, reviewIds, flag}
      this.btnLoading = true
      this.$api[`taskReviewContentProductProductReviewDetailExport`](params)
      .then(data => {
        this.btnLoading = false
        downloadFile(data)
      }).catch(() => {
        this.btnLoading = false
      })
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
	  if(this.listQuery.daterange && this.listQuery.daterange.length){
		  this.listQuery.startTime = this.listQuery.daterange[0]
		  this.listQuery.endTime = this.listQuery.daterange[1]
	  }
      this.$api["taskReviewContentProductListProductReviewDetail"](
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
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.selection = val
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


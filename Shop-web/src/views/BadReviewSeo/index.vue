<template>
  <div class="box" v-if="$route.name === 'badReviewSeoIndex'">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm">
          <el-form-item prop="parentAsin" label='请输入产品ASIN'>
            <el-input v-model.trim="listQuery.parentAsin" placeholder="请输入产品ASIN" size="mini" clearable></el-input>
          </el-form-item>

          <el-form-item
            :label='item.placeholder'
            v-for="item in [
                    {model:'starFlag',placeholder:'评分状态',options:[['未达标','0'],['达标','1']]},
                    {model:'reviewCntFlag',placeholder:'评价数状态',options:[['未达标','0'],['达标','1']]},
                    {model:'aqCntFlag',placeholder:'AQ数状态',options:[['未达标','0'],['达标','1']]}
                ]"
            :prop="item.model"
          >
            <el-select
              v-model="listQuery[item.model]"
              :placeholder="item.placeholder"
              size="mini"
              class="select-query"
              clearable
            >
              <el-option :label="im[0]" :value="im[1]" v-for="im in item.options"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item prop="starFlag">
                    <el-select
                        v-model="listQuery.starFlag"
                        placeholder="评分状态"
                        size="mini"
                        class="select-query"
                        clearable>
                        <el-option :label="item[0]" :value="item[1]" v-for="item in [['未达标','0'],['达标','1']]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="reviewCntFlag">
                    <el-select
                        v-model="listQuery.reviewCntFlag"
                        placeholder="评价数状态"
                        size="mini"
                        class="select-query"
                        clearable>
                        <el-option :label="item[0]" :value="item[1]" v-for="item in [['未达标','0'],['达标','1']]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="aqCntFlag">
                    <el-select
                        v-model="listQuery.aqCntFlag"
                        placeholder="AQ数状态"
                        size="mini"
                        class="select-query"
                        clearable>
                        <el-option :label="item[0]" :value="item[1]" v-for="item in [['未达标','0'],['达标','1']]"></el-option>
                    </el-select>
          </el-form-item>-->

          <!-- <el-form-item prop="starRiskFlag">
                    <el-select
                        v-model="listQuery.starRiskFlag"
                        placeholder="有无评分风险"
                        size="mini"
                        class="select-query"
                        clearable>
                        <el-option :label="item[0]" :value="item[1]" v-for="item in [['无','0'],['有','1']]"></el-option>
                    </el-select>
          </el-form-item>-->

          <el-form-item label='时间'>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <!-- <el-button
              size="mini"
              type="primary"
              plain
              v-for="item in ['确认搜索','重置搜索']"
              @click="distribute(item)"
            >{{item}}</el-button> -->
             <el-button size="small" type="primary" @click="distribute('确认搜索')" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
             <el-button size="small" type="primary" plain @click="distribute('重置搜索')" :disabled='searchLoading'>重置搜索</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <div class="box-update-btn">
      <el-button type="primary"  plain size="mini" @click="distribute('添加产品')">添加产品</el-button>
      <el-button type="primary"  plain size="mini" @click="distribute('编辑')">编辑</el-button>
      <el-button type="primary"  plain size="mini" @click="distribute('重新抓取')" :loading="reCrawlLoading" :disabled="$store.state.isloading || $store.state.loading">重新抓取</el-button>
      <el-button type="primary"  plain size="mini" @click="distribute('删除')">删除</el-button>
    </div>
    <div class="box-data">
      <el-table
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
        <el-table-column prop="parentAsin" label="ASIN" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tooltip class="item" :content="scope.row.remark" placement="top" effect="light">
                 <span class='fix__row_1'>{{scope.row.remark}}</span>
              </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column prop="imageUrl" label="主图" width="100">
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
        <el-table-column prop="targetStarCnt" label="目标评分" min-width="80" :formatter="formatterTargetStarCnt"></el-table-column>
        <el-table-column prop="targetReviewCnt" label="目标评价数" min-width="80" :formatter="formatterTargetReviewCnt"></el-table-column>
        <el-table-column prop="targetAqCnt" label="目标AQ数" min-width="80" :formatter="formatterTargetAqCnt"></el-table-column>
        <el-table-column prop="starFlag" label="评分状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.starFlag==0" style="display:flex;align-items:flex-start;">
              <img src="./icon-warning.png" style="height:18px;margin-right: 3px;">未达标
            </div>
            <div v-else-if="scope.row.starFlag==1">已达标</div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column prop="reviewCntFlag" label="评价数状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.reviewCntFlag==0" style="display:flex;align-items:flex-start;">
              <img src="./icon-warning.png" style="height:18px;margin-right: 3px;">未达标
            </div>
            <div v-else-if="scope.row.reviewCntFlag==1">已达标</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="aqCntFlag" label="AQ数状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.aqCntFlag==0" style="display:flex;align-items:flex-start;">
              <img src="./icon-warning.png" style="height:18px;margin-right: 3px;">未达标
            </div>
            <div v-else-if="scope.row.aqCntFlag==1">已达标</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="Top Review差评" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.topBadReviewCnt===null">-</div>
            <div v-else>
              <el-button
                size="mini"
                type="info"
                v-if="scope.row.unreadTopBadReviewCnt===null||scope.row.unreadTopBadReviewCnt==0"
                style="margin-top:10px;"
                @click="viewDetails(scope.row,0)"
                :disabled="scope.row.topBadReviewCnt===0"
              >{{scope.row.topBadReviewCnt}}</el-button>
              <el-badge v-else :value="scope.row.unreadTopBadReviewCnt" style="margin-top:10px;">
                <el-button
                  size="mini"
                  type="info"
                  @click="viewDetails(scope.row,0)"
                  :disabled="scope.row.topBadReviewCnt===0"
                >{{scope.row.topBadReviewCnt}}</el-button>
              </el-badge>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mostBadRecentCnt" label="Most Recent差评" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.mostBadRecentCnt===null">-</div>
            <div v-else>
              <el-button
                size="mini"
                type="info"
                v-if="scope.row.unreadMostBadRecentCnt===null||scope.row.unreadMostBadRecentCnt==0"
                style="margin-top:10px;"
                @click="viewDetails(scope.row,1)"
                :disabled="scope.row.mostBadRecentCnt===0"
              >{{scope.row.mostBadRecentCnt}}</el-button>
              <el-badge v-else :value="scope.row.unreadMostBadRecentCnt" style="margin-top:10px;">
                <el-button
                  size="mini"
                  type="info"
                  @click="viewDetails(scope.row,1)"
                  :disabled="scope.row.mostBadRecentCnt===0"
                >{{scope.row.mostBadRecentCnt}}</el-button>
              </el-badge>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="starRiskBudget" label="风险预算" min-width="150" show-overflow-tooltip></el-table-column>
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
      ></el-pagination>
    </div>

    <yt-dialog :options="options" :events="events" class="add-dialog">
      <el-form size="small" :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="115px">
        <el-form-item label="ASIN" prop="asins">
          <el-input type="textarea" v-model.trim="ruleForm.asins" placeholder="多个换行输入，备注用' , '分隔填写，如ASIN,备注" :rows="5" size="mini"></el-input>
        </el-form-item>

        <el-form-item label="目标评分>=" prop="targetStarCnt">
          <el-input v-model.trim="ruleForm.targetStarCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="目标评价数>=" prop="targetReviewCnt">
          <el-input v-model.trim="ruleForm.targetReviewCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="目标AQ数>=" prop="targetAqCnt">
          <el-input v-model.trim="ruleForm.targetAqCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="差评预测数量" prop="preBadReviewCnt">
          <el-input v-model.trim="ruleForm.preBadReviewCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="editOptions" :events="editEvents" class="edit-dialog">
      <el-form size="small" :inline="true" :model="ruleEditForm" :rules="rules" ref="ruleEditForm" label-width="115px">
        <el-checkbox
          v-model="ruleEditcheckbox.targetStarCnt"
          style="margin-top:8px;"
          @change="changeEditCheckbox('targetStarCnt')"
        ></el-checkbox>
        <el-form-item label="目标评分>=" prop="targetStarCnt">
          <el-input v-model.trim="ruleEditForm.targetStarCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>

        <el-checkbox
          v-model="ruleEditcheckbox.targetReviewCnt"
          style="margin-top:8px;"
          @change="changeEditCheckbox('targetReviewCnt')"
        ></el-checkbox>
        <el-form-item label="目标评价数>=" prop="targetReviewCnt">
          <el-input v-model.trim="ruleEditForm.targetReviewCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>

        <el-checkbox
          v-model="ruleEditcheckbox.targetAqCnt"
          style="margin-top:8px;"
          @change="changeEditCheckbox('targetAqCnt')"
        ></el-checkbox>
        <el-form-item label="目标AQ数>=" prop="targetAqCnt">
          <el-input v-model.trim="ruleEditForm.targetAqCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>

        <el-checkbox
          v-model="ruleEditcheckbox.preBadReviewCnt"
          style="margin-top:8px;"
          @change="changeEditCheckbox('preBadReviewCnt')"
        ></el-checkbox>
        <el-form-item label="差评预测数量" prop="preBadReviewCnt">
          <el-input v-model.trim="ruleEditForm.preBadReviewCnt" placeholder="请输入值" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
  <router-view v-else></router-view>
</template>
<script>
const _ = require('lodash')
//import { checkAsins } from '../KeyLexicon/utils'
export default {
  data() {
    
    // let numReg = /^[1-9]\d*$/
    // let regu = /^(\-)*(\d+)\.(\d).*$/
    // let checkTargetStarCnt = (rule, value, callback) => {
    //     if (!value) {
    //     return callback(new Error('请输入目标评分'));
    //     }else{
    //         if(!regu.test(value)){
    //             return callback(new Error('请输入一位小数'));
    //         }
    //         if(value<0.1||value>4.9){
    //             return callback(new Error('请输入0.1至4.9'));
    //         }
    //         callback();
    //     }
    // };
    // let checkTargetReviewCnt = (rule, value, callback) => {
    //     if (!value) {
    //     return callback(new Error('请输入值'));
    //     }else{
    //         if(value<0){
    //             return callback(new Error('请输入大于0'));
    //         }
    //         callback();
    //     }
    // };
    let checkAsins = (rule, value, callback) => {
        //console.log(value);
        if (!value) {
          return callback(new Error('请输入'));
        };
        value = value.replace(/，/ig,',');
        
        let val = value
            .split('\n')
            .map(el => el.trim())
            .filter(el => el !== '');
        let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/gi
        let regCn = /[·！#￥（——）：；“”‘、|《。》？、【】[\]]/gi
        let reg = /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/
        let changePlatformd = 1 //上线要改
        let str = 'ASIN须为10位数，纯数字或大写字母和数字的组合'
        if (changePlatformd == 2) {
            reg = /^[0-9]{12,12}$/
            str = '请输入12位纯数字'
        } else if (changePlatformd == 3) {
            reg = /^(?!_)(?!.*?_$)[0-9_]+$/
            str = '请输入纯数字，允许下划线'
        } else if (changePlatformd == 4) {
            reg = /^(?=.*?[a-z])(?=.*?[0-9])[a-z0-9]{24}$/
            str = '长度24位，须小写字母与纯数字的组合'
        } else if (changePlatformd == 5) {
            reg = /^[0-9]*$/
            str = '请输入纯数字'
        }
        if (!val.every(el => reg.test( el.split(',')[0].trim() ))) {
            return callback(new Error(str))
        } else if (
            val.some(el => regEn.test( el.split(',')[0].trim() )) ||
            val.some(el => regCn.test( el.split(',')[0].trim() ))
        ) {
            return callback(new Error('不能包含特殊字符'))
        } else if (val.length > 500) {
            return callback(new Error('输入数量不能超过500个'))
        } 
        //console.log(val);
        callback();
    };
    return {
      reCrawlLoading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      daterange: [],
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,

        parentAsin: null,
        starFlag: null,
        reviewCntFlag: null,
        aqCntFlag: null,
        // starRiskFlag:null,
        startTime: null,
        endTime: null
      },
      options: {
        visible: false,
        width: '500px',
        title: '添加产品',
        okBtnText: '确认'
      },
      events: {
        handleOkClick: () => {
          this.submitForm('ruleForm')
        }
      },
      ruleForm: {
        platformId: null,
        siteId: null,
        sellerId: null,
        asins: null,
        targetStarCnt: null,
        targetReviewCnt: null,
        targetAqCnt: null,
        preBadReviewCnt: null
      },
      rules: {
        asins: [{ required: true, validator: checkAsins, trigger: 'blur' }],
        targetStarCnt: [
          {
            required: true,
            validator: this.checkTargetStarCnt,
            trigger: 'blur'
          }
        ],
        targetReviewCnt: [
          {
            required: true,
            validator: this.checkTargetReviewCnt,
            trigger: 'blur'
          }
        ],
        targetAqCnt: [
          { required: true, validator: this.checkTargetAqCnt, trigger: 'blur' }
        ],
        preBadReviewCnt: [
          {
            required: true,
            validator: this.checkPreBadReviewCnt,
            trigger: 'blur'
          }
        ]
      },
      editOptions: {
        visible: false,
        width: '410px',
        title: '编辑',
        okBtnText: '确认'
      },
      editEvents: {
        handleOkClick: () => {
          this.submitEditForm('ruleEditForm')
        }
      },
      ruleEditForm: {
        taskIds: null,
        targetStarCnt: null,
        targetReviewCnt: null,
        targetAqCnt: null,
        preBadReviewCnt: null
      },
      ruleEditcheckbox: {
        targetStarCnt: true,
        targetReviewCnt: true,
        targetAqCnt: true,
        preBadReviewCnt: true
      },
      multipleSelection: [],
      searchLoading:false,
    }
  },
  created() {
    this.listQuery.platformId=this.platformId;
    this.ruleForm.platformId=this.platformId;
    if (this.sellerId && this.siteId) {
      this.listQuery.siteId = this.siteId
      this.listQuery.sellerId = this.sellerId
      this.ruleForm.siteId = this.siteId
      this.ruleForm.sellerId = this.sellerId
      this.getList()
    }
  },
  watch: {
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId
        this.ruleForm.siteId = this.siteId
        this.ruleForm.sellerId = this.sellerId
        this.getList()
      }
    }
  },
  methods: {
    checkTargetStarCnt(rule, value, callback) {
      if (this.editOptions.visible) {
        if (!this.ruleEditcheckbox.targetStarCnt) {
          callback()
          return
        }
      }
      if (!value) {
        return callback(new Error('请输入目标评分'))
      }else if(String(value).indexOf('.')!==-1){

        let x=String(value).indexOf('.')+1; //小数点位置
        let y=String(value).length-x;
        //console.log(y)

        if (y===0 || y>1) {
          return callback(new Error('若小数,请输入一位小数'))
        }
        if (value < 0.1 || value > 4.9) {
          return callback(new Error('若小数,请输入0.1至4.9'))
        }
        
      }else{
          if(value < 0.1 || value > 4.9){
              return callback(new Error('若整数,请输入1至4'))
          }
      }
      callback()
    },
    checkTargetReviewCnt(rule, value, callback) {
      if (this.editOptions.visible) {
        if (!this.ruleEditcheckbox.targetReviewCnt) {
          callback()
          return
        }
      }
      if (!value) {
        return callback(new Error('请输入目标评价数'))
      } else {
        if (value < 0) {
          return callback(new Error('请输入大于0'))
        }
        let numReg = /^[1-9]\d*$/
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        }
        callback()
      }
    },
    checkTargetAqCnt(rule, value, callback) {
      if (this.editOptions.visible) {
        if (!this.ruleEditcheckbox.targetAqCnt) {
          callback()
          return
        }
      }
      if (!value) {
        return callback(new Error('请输入目标AQ数'))
      } else {
        if (value < 0) {
          return callback(new Error('请输入大于0'))
        }
        let numReg = /^[1-9]\d*$/
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        }
        callback()
      }
    },
    checkPreBadReviewCnt(rule, value, callback) {
      if (this.editOptions.visible) {
        if (!this.ruleEditcheckbox.preBadReviewCnt) {
          callback()
          return
        }
      }
      if (!value) {
        return callback(new Error('请输入预测差评数量'))
      } else {
        if (value <= 0) {
          return callback(new Error('请输入大于0'))
        }
        let numReg = /^[1-9]\d*$/
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        }
        callback()
      }
    },
    distribute(btn) {
      switch (btn) {
        case '确认搜索':
          this.handleFilter()
          break
        case '重置搜索':
          this.resetListQueryForm()
          break
        case '添加产品':
          this.showAddDialog(null)
          break
        case '编辑':
          this.showEditDialog()
          break
        case '重新抓取':
          this.reCrawl()
          break
        case '删除':
          this.deleteRows(null)
          break
      }
      // '添加监控','修改监控周期'
    },
    formatterTargetStarCnt(row, column) {
      return this.formatterTarget(row.targetStarCnt)
    },
    formatterTargetReviewCnt(row, column) {
      return this.formatterTarget(row.targetReviewCnt)
    },
    formatterTargetAqCnt(row, column) {
      return this.formatterTarget(row.targetAqCnt)
    },
    formatterTarget(val) {
      if (!isNaN(val)) {
        return `≥${val}`
      } else {
        return val
      }
    },
    getList() {
      this.listLoading = true
      this.searchLoading = true
      let parentAsin = this.listQuery.parentAsin
      if (parentAsin !== null) {
        let flag = _.isEmpty(parentAsin.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          this.listQuery.parentAsin = null
        }
      }
      let daterange = this.daterange
      if (daterange !== null && daterange.length === 2) {
        this.listQuery.startTime = daterange[0]
        this.listQuery.endTime = daterange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      let listQuery = _.cloneDeep(this.listQuery)

      this.$api['badReviewSeoList'](listQuery)
        .then(res => {
          let { rows, total } = res
          this.list = rows
          this.total = total
          setTimeout(() => {
            this.listLoading = false
            this.searchLoading = false
          }, 1.5 * 1000)
        })
        .catch(() => {
          this.listLoading = false
          this.searchLoading = false
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
    resetListQueryForm() {
      this.daterange = []
      this.$refs.listQueryForm.resetFields()
      this.getList()
    },

    showAddDialog() {
      // if(!this.checkRows()){
      //     return
      // }
      // 只有新增
      this.options.visible = true
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let paramMap = _.cloneDeep(this.ruleForm)
          this.ruleForm.asins = this.ruleForm.asins.replace(/，/ig,',');
          let asins = JSON.parse(JSON.stringify(this.ruleForm.asins)).split('\n')
          delete paramMap.asins  ;
          // paramMap.asins = _.compact(this.ruleForm.asins.split('\n'))
          // paramMap.asins = _.uniq(paramMap.asins)
          let asinList = [];
          asins.forEach(i=>{
            let arr = i.split(',');
            let asin = arr[0].trim();
            let remarkArr = arr.filter((i,index)=>{
                return index!==0
            })
            let remark = remarkArr.join(',')
            //console.log(remarkArr);
            asinList.push({
                asin,
                remark
            })
          })
          paramMap.asinList = asinList;
          paramMap.targetStarCnt = parseFloat(paramMap.targetStarCnt) // 小数
          paramMap.targetReviewCnt = parseFloat(paramMap.targetReviewCnt)
          paramMap.targetAqCnt = parseFloat(paramMap.targetAqCnt)
          paramMap.preBadReviewCnt = parseInt(paramMap.preBadReviewCnt)

          this.$api['badReviewSeoSave'](paramMap)
            .then(data => {
              this.options.visible = false
              this.getList()
            })
            .catch(() => {
              //   this.options.visible = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    deleteRows(id) {
      let taskIds = []
      if (id === null) {
        let multipleSelection = this.multipleSelection
        let ids = []
        if (!this.checkRows()) {
          return
        }
        multipleSelection.forEach(element => {
          ids.push(element.taskId)
        })
        taskIds = ids
      } else {
        taskIds = [id]
      }

      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api['badReviewSeoRemove']({ taskIds }).then(res => {
          let { code } = res
          if (code === 0) {
            this.handleFilter()
          }
        })
      })
    },
    showEditDialog() {
      if (!this.checkRows()) {
        return
      }
      this.editOptions.visible = true
      if (this.$refs['ruleEditForm'] !== undefined) {
        this.$refs['ruleEditForm'].resetFields()
        this.ruleEditForm = {
          taskIds: [],
          targetStarCnt: null,
          targetReviewCnt: null,
          targetAqCnt: null,
          preBadReviewCnt: null
        }
      }
      this.rules.targetStarCnt[0].required = true
      this.rules.targetReviewCnt[0].required = true
      this.rules.targetAqCnt[0].required = true
      this.rules.preBadReviewCnt[0].required = true

      this.ruleEditcheckbox = {
        targetStarCnt: true,
        targetReviewCnt: true,
        targetAqCnt: true,
        preBadReviewCnt: true
      }
      let taskIds = []
      let multipleSelection = this.multipleSelection
      multipleSelection.forEach(element => {
        taskIds.push(element.taskId)
      })
      this.ruleEditForm.taskIds = taskIds
      //回显
      if (taskIds.length === 1) {
        this.ruleEditForm.targetStarCnt = multipleSelection[0].targetStarCnt
        this.ruleEditForm.targetReviewCnt = multipleSelection[0].targetReviewCnt
        this.ruleEditForm.targetAqCnt = multipleSelection[0].targetAqCnt
        this.ruleEditForm.preBadReviewCnt = multipleSelection[0].preBadReviewCnt
      }
    },
    changeEditCheckbox(type) {
      switch (type) {
        case 'targetStarCnt':
          this.rules.targetStarCnt[0].required = this.ruleEditcheckbox.targetStarCnt
          break
        case 'targetReviewCnt':
          this.rules.targetReviewCnt[0].required = this.ruleEditcheckbox.targetReviewCnt
          break
        case 'targetAqCnt':
          this.rules.targetAqCnt[0].required = this.ruleEditcheckbox.targetAqCnt
          break
        case 'preBadReviewCnt':
          this.rules.preBadReviewCnt[0].required = this.ruleEditcheckbox.preBadReviewCnt
          break
      }
    },
    submitEditForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let paramMap = _.cloneDeep(this.ruleEditForm)
          let checkboxObj = this.ruleEditcheckbox
          if (!checkboxObj.targetStarCnt) {
            delete paramMap.targetStarCnt
          } else {
            paramMap.targetStarCnt = parseFloat(paramMap.targetStarCnt)
          }
          if (!checkboxObj.targetReviewCnt) {
            delete paramMap.targetReviewCnt
          }
          if (!checkboxObj.targetAqCnt) {
            delete paramMap.targetAqCnt
          }
          if (!checkboxObj.preBadReviewCnt) {
            delete paramMap.preBadReviewCnt
          }
          if (Object.getOwnPropertyNames(paramMap).length === 1) {
            this.$message.warning('至少选一个属性')
            return
          }
          this.$api['badReviewSeoUpdate'](paramMap)
            .then(data => {
              this.editOptions.visible = false
              this.getList()
            })
            .catch(() => {
              this.editOptions.visible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    reCrawl() {
      if (!this.checkRows()) {
        return
      }
      let taskIds = []
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId)
      })
      this.reCrawlLoading = true
      this.$api['badReviewSeoReCrawl']({
        taskIds
      }).then(data => {
        this.reCrawlLoading = false
        let { code } = data
        if (code === 0) {
          this.getList()
        }
      })
    },
    viewDetails(row, reviewPosition) {
      if (reviewPosition === 0) {
        if (row.topBadReviewCnt == 0) {
          return
        }
      } else if (reviewPosition === 1) {
        if (row.mostBadRecentCnt == 0) {
          return
        }
      }
      this.$router.push({
        name: 'badReviewSeoDetails',
        query: {
          taskId: row.taskId,
          reviewPosition
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.custom-collapse .el-form-item {
    margin-bottom: 10px;
}
.box {
  // border: 1px solid @borderColor;
  // padding: 10px;
  .box-info {
    font-size: 14px;
    background-color: @boxQueryBGColor;
    padding: 15px;
    border: 1px solid @borderColor;
    span {
      &:first-of-type {
        margin-right: 20px;
      }
      &:last-of-type {
        color: @titleColor;
      }
    }
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
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      //联调时修改
      .select-query {
        width: 120px;
      }
      .data-type {
        width: 70px;
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
    // .el-button-group {
    //     &:first-of-type {
    //         margin-right: 10px;
    //     }
    // }
  }
  .box-data {
    .el-table__row {
      .el-icon-warning {
        margin-right: 3px;
        color: #d81f07;
      }
    }
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
  /deep/.el-dialog__body {
    padding-bottom: 0;
  }
  .add-dialog {
    .el-textarea,
    .el-input {
      width: 310px;
    }
  }
  .edit-dialog {
    .el-form {
      display: grid;
      grid-template: e('48px 48px 48px 48px / 20px auto');
    }
    .el-input {
      width: 210px;
    }
  }
}
</style>



<template>
  <div class="collapse-box">
    <el-collapse class="custom-collapse custom-collapse-nomargin" v-model="activeNames">
      <el-collapse-item title="常用筛选条件" name="list">
        <el-table
          :data="criteriaData"
          v-loading="listLoading"
          :key="tableKey"
          :row-class-name="tableRowClassName"
          @row-click="handleRowClick"
          border
          style="width: 100%;min-height:80px"
          tooltip-effect="light"
        >
          <el-table-column  label="包含" width="160">
                <template slot-scope="scope">
                  <el-tooltip  placement="top" :content="scope.row.content.include && scope.row.content.include.join(' , ')" effect="light">
                        <div class='fix__row_1' >{{ scope.row.content.include && scope.row.content.include.join(' , ') }}</div> 
                  </el-tooltip>
                </template>
          </el-table-column>
          <el-table-column  label="不包含" width="160" >
               <template slot-scope="scope">
                  <el-tooltip  placement="top" :content="scope.row.content.exclude && scope.row.content.exclude.join(' , ')" effect="light">
                        <div class='fix__row_1' >{{ scope.row.content.exclude && scope.row.content.exclude.join(' , ') }}</div> 
                  </el-tooltip>
                </template>
          </el-table-column>
          <el-table-column  label="排除" width="160" >
                <template slot-scope="scope">
                  <el-tooltip  placement="top" :content="scope.row.content.barring && scope.row.content.barring.join(' , ')" effect="light">
                        <div class='fix__row_1' >{{ scope.row.content.barring && scope.row.content.barring.join(' , ') }}</div> 
                  </el-tooltip>
                </template>
          </el-table-column>
          <el-table-column  label="单词数量" width="100"  prop="content.wordCnt"></el-table-column>                
          <el-table-column prop="content.keywordTexts" label="等于" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            width="100"
            prop="content.source"
            label="添加来源"
            v-if="pPageType==='LAYOUT'"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column width="120" prop="content.advertName" label="广告系列" show-overflow-tooltip v-else></el-table-column>
          <el-table-column label="公式" show-overflow-tooltip :formatter="formatterContent"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.stop="handleRowCriteria(scope.row)" type="text" size="small">设置</el-button>
              <!-- <el-button type="text" size="small">编辑</el-button> -->
              <el-button @click.stop="deleteRows(scope.row.conditionId)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item name="criteria">
        <template slot="title">
          <div class="collapse-criteria-title">
            <div>自定义筛选条件</div>
            <div class="criteria-save-btn">
              <template v-if="formInline.conditionId">
                <el-button type="warning" size="small" plain @click.stop="saveCriteria(1)">保存为新的筛选条件</el-button>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="editBtnDisabled"
                  plain
                  @click.stop="saveCriteria(0)"
                >保存修改</el-button>
              </template>
              <el-button v-else type="primary" size="small" plain @click.stop="saveCriteria(1)">保存为常用筛选条件</el-button>
            </div>
          </div>
        </template>
        <el-form
          style="margin:12px 10px"
          :inline="true"
          size="small"
          :model="formInline"
          ref="formInline"
        >
          <el-form-item label="包含"  prop="include">
              <el-input
                style='width:270px'
                type="textarea"
                :rows="4"
                placeholder="请输入,一行一个"
                v-model.trim="formInline.include">
              </el-input>
          </el-form-item>
          <el-form-item label="不包含"  prop="exclude">
              <el-input
                style='width:270px'
                type="textarea"
                :rows="4"
                placeholder="请输入,一行一个"
                v-model.trim="formInline.exclude">
              </el-input>
          </el-form-item>
          <el-form-item label="排除"  prop="barring">
              <el-input
                style='width:270px' 
                type="textarea"
                :rows="4"
                placeholder="请输入,一行一个"
                v-model.trim="formInline.barring">
              </el-input>
          </el-form-item>

          <el-form-item label="等于"  prop="keywordTexts">
            <el-input
                style='width:270px' 
                type="textarea"
                :rows="4"
                placeholder="请输入,一行一个"
                v-model.trim="formInline.keywordTexts">
              </el-input>
          </el-form-item>
          <el-form-item label="单词数量"  prop="wordCnt">
            <el-select v-model="formInline.wordCnt" placeholder="请选择" size="small" class="select-rource" clearable>
              <el-option 
                v-for="item in [{label:1,value:1},{label:2,value:2},{label:3,value:3},{label:'≥',value:4}]" 
                :key="item.value" 
                :label="item.label" 
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="添加来源" v-if="pPageType==='LAYOUT'"  prop="source">
            <el-select v-model="formInline.source" placeholder="请选择" size="small" class="select-rource" clearable>
              <el-option v-for="item in sourceList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否手动添加" v-if="pPageType==='LAYOUT'"  prop="manualFlag">
            <el-select v-model="formInline.manualFlag" placeholder="请选择" size="small" class="select-rource" clearable>
              <el-option v-for="item in manualFlagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告系列" v-else-if="pPageType==='ADVERT'" prop="advertName">
            <el-select
              v-model="formInline.advertName"
              placeholder="请选择"
              size="small"
              class="select-advert-name"
              clearable
            >
              <el-option v-for="item in advertOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <span v-if="querySelectList.length>0">
            <el-form-item
              v-for="(condition, index) in formInline.conditions"
              :key="'condition_'+index"
              :prop="'conditions.' + index + '.value'"
              :label="querySelectList[index].label"
              
            >
              <el-select v-model="condition.value" size="small" class="select-condition" clearable placeholder="请选择">
                <el-option
                  v-for="item in querySelectList[index].options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button
                type="primary"
                plain
                icon="el-icon-edit-outline"
                size="small"
                style="padding: 9px 15px;border-radius:0 3px 3px 0;"
                @click="showConditionDialog(querySelectList[index].conditionId,querySelectList[index].fieldKey,querySelectList[index].options,index)"
              ></el-button>
            </el-form-item>
          </span>

          <el-form-item :label-width="'0px'" label=" ">
            <!-- <el-button type="primary" size="small" plain @click="handleFilter">确认搜索</el-button>
            <el-button type="primary" size="small" plain @click="resetForm">重置搜索</el-button> -->
            <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
            <el-button size="small" type="primary" plain @click="resetForm" :disabled='searchLoading'>重置搜索</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <yt-dialog :options="conditionOptions" :events="conditionEvents">
      <el-form
        label-position="right"
        label-width="40px"
        :model="formCondition"
        :rules="conditionRules"
        ref="numberValidateForm"
      >
        <el-form-item label="高" prop="high">
          <el-input v-model.number="formCondition.high" size="small"></el-input>
        </el-form-item>
        <el-form-item label="中" prop="middle">
          <el-input v-model.number="formCondition.middle" size="small"></el-input>
        </el-form-item>
        <el-form-item label="低" prop="low">
          <el-input v-model.number="formCondition.low" size="small"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { DataUtil } from '../../utils'
// import {RelatedWords} from "../pages/utils";
export default {
  props: ['pParams', 'pPageType','searchLoading'],
  data() {
    let validateHighValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选输入高'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= this.formCondition.middle) {
            callback(new Error('必须大于中'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    let validateMidValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选输入中'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= this.formCondition.low) {
            callback(new Error('必须大于小'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    let validateLowValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选输入低'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= 0) {
            callback(new Error('必须大于0'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    return {
      editBtnDisabled: false,
      activeNames: ['criteria22'],
      tableKey: 0,
      listLoading: false,
      criteriaData: [],
      formItemWidth: '90px',
      sourceList: [],
      querySelectArray: [], // 后台返回
      querySelectList: [],
      manualFlagOptions:[{label:'是',value:1},{label:'否',value:0}],
      advertOptions: [],
      formInline: {
        conditionId: null,
        keywordTexts: null,
        source: null,
        include:'',
        exclude:'',
        barring:'',
        wordCnt:null,
        manualFlag:null,
        advertName: null,
        conditions: [
          {
            value: ''
          }
        ]
      },
      fieldKeyMap: new Map(),
      ruleIdMap: new Map(),
      conditionRules: {
        high: [
          { required: true, validator: validateHighValue, trigger: 'blur' }
        ],
        middle: [
          { required: true, validator: validateMidValue, trigger: 'blur' }
        ],
        low: [{ required: true, validator: validateLowValue, trigger: 'blur' }]
      },
      conditionQuery: {
        pageType: null
      },
      conditionOptions: {
        visible: false,
        width: '350px',
        okBtnText: '确认',
        btnLoading:false,
      },
      conditionEvents: {
        handleOkClick: () => {
          this.submitConditionOptions()
        }
      },
      formCondition: {
        index: null,
        high: null,
        middle: null,
        low: null
      },
    }
  },
  watch: {
    'pParams.treeId'(newP, oldP) {
      console.log('dwqedwq');
      let ruleId = null
      if (newP == 5 || newP == 9) {
        ruleId = this.ruleIdMap.get('coreWords')
      } else if (newP == 6 || newP == 10) {
        ruleId = this.ruleIdMap.get('longWords')
      } else if (newP == 7 || newP == 11) {
        ruleId = this.ruleIdMap.get('otherWords')
      }
      this.getRuleIdOrPageType(newP)
      this.$emit('setRuleId', { treeId: newP, ruleId })
    },
    formInline: {
      deep: true,
      handler(val) {
        if (!this.formInline.conditionId) {
          return
        }
        //console.log(val);
        if (_.isEqual(val, this.oldData)) {
          this.editBtnDisabled = true
        } else {
          this.editBtnDisabled = false
        }
      }
    }
  },
  created() {
    let pPageType = this.pPageType
    if (pPageType === 'LAYOUT') {
      this.getRuleId(this.pParams.treeId)
      this.getSource()
    } else if (pPageType === 'ADVERT') {
      this.getAdvertName()
      this.getRuleId(this.pParams.treeId)
    }
    this.getfieldKeyOptions()
    this.getQuerySelect()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return 'cursor'
    },
    //常用筛选条件的表格的设置按钮
    handleRowClick(row) {
      this.handleRowCriteria(row, true)
    },
    //重置搜索
    resetForm() {
      this.formInline.conditionId = null
      this.$refs.formInline.resetFields()
      this.handleFilter()
    },
    addPerCent(fieldKey) {
      /**
       * 加百分号
       *
       * 广告ACOS
       * 广告点击率
       * 广告转化率
       *
       * ARA点击率
       * ARA转化率
       */
      return (
        [
          'advert_acos',
          'advert_click_rates',
          'advert_conversion_rates',
          'ara_click_rates',
          'ara_conversion_rates'
        ].indexOf(fieldKey) > -1
      )
    },
    //处理数据常用筛选条件的数据
    handleUtilQuerySelect(array) {
      let querySelectList = []
      if (array.length === 0) {
        // 防止页面加载错误
        querySelectList.push({
          label: null,
          options: [],
          fieldKey: null,
          conditionId: null
        })
      } else {
        let blankSpace = '\r \r \r \r \r'
        array.forEach(element => {
          let highLabel = `高${blankSpace}${element.high}`
          let middleLabel = `中${blankSpace}${element.middle}`
          let lowLabel = `低${blankSpace}${element.low}`
          let highValue = `${element.conditionId}:high:${element.high}`
          let middleValue = `${element.conditionId}:middle:${element.middle}`
          let lowValue = `${element.conditionId}:low:${element.low}`
          if (this.addPerCent(element.fieldKey)) {
            highLabel = `高${blankSpace}${element.high * 100}%`
            middleLabel = `中${blankSpace}${element.middle * 100}%`
            lowLabel = `低${blankSpace}${element.low * 100}%`
            highValue = `${element.conditionId}:high:${element.high * 100}`
            middleValue = `${element.conditionId}:middle:${element.middle *
              100}`
            lowValue = `${element.conditionId}:low:${element.low * 100}`
          }
          querySelectList.push({
            label: `${element.conditionName}`,
            fieldKey: element.fieldKey,
            conditionId: element.conditionId,
            options: [
              {
                label: highLabel,
                value: highValue
              },
              {
                label: middleLabel,
                value: middleValue
              },
              {
                label: lowLabel,
                value: lowValue
              }
            ]
          })
        })
      }
      return querySelectList
    },
    addPerCent(fieldKey) {
      /**
       * 加百分号
       *
       * 广告ACOS
       * 广告点击率
       * 广告转化率
       *
       * ARA点击率
       * ARA转化率
       */
      return (
        [
          'advert_acos',
          'advert_click_rates',
          'advert_conversion_rates',
          'ara_click_rates',
          'ara_conversion_rates'
        ].indexOf(fieldKey) > -1
      )
    },
    getfieldKeyOptions() {
      this.$api['keywordDataFieldListAll']({ fieldOrigin: null })
        .then(res => {
          let { data } = res
          let fieldKeyMap = new Map()
          _(data).forEach(val => {
            fieldKeyMap.set(val.fieldKey, val.displayName)
          })
          this.fieldKeyMap = fieldKeyMap
          GLOBAL.vbus.$emit('setCustomKey', data)
        })
        .catch(() => {
          // this.$message.error('公式加载失败!')
          console.log('公式加载失败!')
        })
    },
    //获取搜索项的列表
    getQuerySelect() {
      this.$api['keywordFilterConditionSelect']({
        conditionScopeSingle: this.pPageType
      }).then(res => {
        let { code, data } = res
        if (code === 0) {
          if (data.length > 0) {
            this.querySelectArray = data
            this.querySelectList = this.handleUtilQuerySelect(data)
            let len = this.querySelectList.length
            this.formInline.conditions = []

            for (let index = 0; index < len; index++) {
              this.formInline.conditions.push({ value: '' })
              // 设置默认值
              // this.formInline.conditions[index].value =`${data[index].conditionId}:high:${data[index].high}`
            }
          }
        }
      })
    },
    getRuleId(treeId) {
      this.$api['keywordDecisionRuleListUp']().then(res => {
        let { code, data } = res
        if (code === 0) {
          // this.ruleIdList =data
          let ruleArr = data.filter(element => {
            return element.ruleName === '核心词'
          })
          if (ruleArr.length > 0) {
            ruleId = ruleArr[0].ruleId
            this.ruleIdMap.set('coreWords', ruleId)
          }
          ruleArr = data.filter(element => {
            return element.ruleName === '长尾词'
          })
          if (ruleArr.length > 0) {
            ruleId = ruleArr[0].ruleId
            this.ruleIdMap.set('longWords', ruleId)
          }
          ruleArr = data.filter(element => {
            return element.ruleName === '其他词'
          })
          if (ruleArr.length > 0) {
            ruleId = ruleArr[0].ruleId
            this.ruleIdMap.set('otherWords', ruleId)
          }

          // let ruleId =null
          // let type =this.pParams.type
          // if(treeId==5||treeId==9){
          //     ruleId =this.ruleIdMap.get('coreWords')
          //     if(treeId==5){
          //         this.conditionQuery.pageType='UP_CORE'
          //     }else{
          //         this.conditionQuery.pageType='UP_BRAND_CORE'
          //     }
          // }else if(treeId==6||treeId==10){
          //     ruleId =this.ruleIdMap.get('longWords')
          //     if(treeId==6){
          //         this.conditionQuery.pageType='UP_LONG'
          //     }else{
          //         this.conditionQuery.pageType='UP_BRAND_LONG'
          //     }
          // }else if(treeId==7||treeId==11){
          //     ruleId =this.ruleIdMap.get('otherWords')
          //     if(treeId==7){
          //         this.conditionQuery.pageType='UP_OTHER'
          //     }else{
          //         this.conditionQuery.pageType='UP_BRAND_OTHER'
          //     }
          // }else if((treeId=='49'&&type==='category')||treeId=='41'&&type==='product'){
          //     // 仅广告
          //     this.conditionQuery.pageType='UP_ADVERT'
          // }
          let ruleId = this.getRuleIdOrPageType(treeId)
          this.$emit('setRuleId', { treeId: null, ruleId })
        }
      })
    },
    //设置页面类型和规则id
    getRuleIdOrPageType(treeId) {
      let ruleId = null
      let type = this.pParams.type
      if (treeId == 5 || treeId == 9) {
        ruleId = this.ruleIdMap.get('coreWords')
        if (treeId == 5) {
          this.conditionQuery.pageType = 'UP_CORE'
        } else {
          this.conditionQuery.pageType = 'UP_BRAND_CORE'
        }
      }else if(treeId == 3){
        this.conditionQuery.pageType = 'UP'
      }else if(treeId == 4){
        this.conditionQuery.pageType = 'UP_NO_BRAND'
      }else if(treeId == 8){
        this.conditionQuery.pageType = 'UP_BRAND'
      }else if (treeId == 6 || treeId == 10) {
        ruleId = this.ruleIdMap.get('longWords')
        if (treeId == 6) {
          this.conditionQuery.pageType = 'UP_LONG'
        } else {
          this.conditionQuery.pageType = 'UP_BRAND_LONG'
        }
      } else if (treeId == 7 || treeId == 11) {
        ruleId = this.ruleIdMap.get('otherWords')
        if (treeId == 7) {
          this.conditionQuery.pageType = 'UP_OTHER'
        } else {
          this.conditionQuery.pageType = 'UP_BRAND_OTHER'
        }
      } else if (
        (treeId == '49' && type === 'category') ||
        (treeId == '41' && type === 'product')
      ) {
        // 仅广告
        this.conditionQuery.pageType = 'UP_ADVERT'
      } else if (treeId == 23) {
        // 以下广告词库
        this.conditionQuery.pageType = 'AD_BRAND_UP_DEAL'
      } else if (treeId == 24) {
        this.conditionQuery.pageType = 'AD_BRAND_UP_NO_DEAL'
      } else if (treeId == 26) {
        this.conditionQuery.pageType = 'AD_BRAND_DEAL'
      } else if (treeId == 27) {
        this.conditionQuery.pageType = 'AD_BRAND_NO_DEAL'
      } else if (treeId == 29) {
        this.conditionQuery.pageType = 'AD_DEAL'
      } else if (treeId == 30) {
        this.conditionQuery.pageType = 'AD_NO_DEAL'
      }else if (treeId == 20) {
        this.conditionQuery.pageType = 'AD'
      }else if (treeId == 21) {
        this.conditionQuery.pageType = 'AD_BRAND'
      }else if (treeId == 22) {
        this.conditionQuery.pageType = 'AD_BRAND_UP'
      }else if (treeId == 25) {
        this.conditionQuery.pageType = 'AD_BRAND_NO_UP'
      }else if (treeId == 28) {
        this.conditionQuery.pageType = 'AD_NO_BRAND'
      }
      

      this.getCriteriaList()
      return ruleId
    },
    //获取添加来源的下拉
    getSource() {
      this.$api['categoryKeywordGetSource']().then(res => {
        let { code, data } = res
        if (code === 0) {
          this.sourceList = data
          this.$emit('setSourceList', data)
        }
      })
    },
    //获取广告系列的名称
    getAdvertName() {
      this.$api['categoryKeywordAdNameList']({
        cusCateId: this.pParams.cusCateId,
        siteId: this.siteId,
        keywordType: this.pPageType
      }).then(res => {
        let { code, data } = res
        if (code === 0) {
          let advertOptions = []
          data.forEach(element => {
            advertOptions.push({
              label: element.adName,
              value: element.adNameKey
            })
          })

          advertOptions.unshift({
            label: '全部',
            value: null
          })
          this.advertOptions = advertOptions
        }
      })
    },
    //确认搜素
    handleFilter() {
      console.log(1);
      this.searchLoading=true;
      this.$refs.formInline.validate(valid => {
        if (valid) {
          let params = this.handleCriteria('search')
          this.$emit('search', params)
        } else {
          console.log('error submit!!')
          this.searchLoading=false;
          return false
        }
      })
    },
    //设置搜索的参数
    handleCriteria(type) {
      let conditionArr = this.getUtilConditions(
        this.querySelectList,
        this.formInline.conditions
      );
      //console.log(conditionArr);
      let conditions = []
      if (type === 'search') {
        conditionArr.forEach(element => {
          if (element.level !== null) {
            conditions.push(element)
          }
        })
      } else {
        conditions = conditionArr
      };
      if (conditions.length === 0) {
        conditions = null
      };
      let keywordTexts = JSON.parse( JSON.stringify(this.formInline.keywordTexts));
      if (keywordTexts ) {
        let flag = _.isEmpty(keywordTexts.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          keywordTexts = null
        }else{
          keywordTexts = keywordTexts.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') ;
        }
      }else{
        keywordTexts = []
      };
      let params = {
        conditions,
        keywordTexts
      };
      let pPageType = this.pPageType
      if (pPageType === 'LAYOUT') {
        params.source = this.formInline.source
        //console.log(this.formInline.manualFlag);
        params.manualFlag=this.formInline.manualFlag
        //console.log('object66666rew');
        //console.log(params.manualFlag);
      } else if (pPageType === 'ADVERT') {
        params.advertName = this.formInline.advertName
      }
      let { include,exclude,barring,wordCnt } = JSON.parse(JSON.stringify(this.formInline))
      //console.log(include,exclude,barring,wordCnt);
      params.include = include ?
                    include.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : [];
      params.exclude = exclude ?
                    exclude.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : [];
      params.barring = barring ?
                    barring.split(/[\n|\r\n|\,|\，]/)
                    .map(el => el.trim())
                    .filter(el => el !== '') : [];
      params.wordCnt = wordCnt ? wordCnt : null;

      //console.log(params);
      return params
    },
    //处理其他搜索条件的参数
    getUtilConditions(querySelectArray, formConditions) {
      //  console.log(querySelectArray)
      //  console.log(formConditions) 
      // querySelectArray的坐标数据 与 formInline.conditions的坐标数据 一致
      let array = querySelectArray
      let conditions = []
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        let strArr = formConditions[index].value.split(':')
        // let high = element.high
        // let middle = element.middle
        // let low = element.low
        let high = parseInt(element.options[0].value.split(':')[2])
        let middle = parseInt(element.options[1].value.split(':')[2])
        let low = parseInt(element.options[2].value.split(':')[2])
        let level = null
        if (strArr.length === 3) {
          level = strArr[1].toUpperCase()
          if (this.addPerCent(element.fieldKey)) {
            // high = parseFloat(strArr[2])/100
            high = parseFloat(element.options[0].value.split(':')[2]) / 100
            middle = parseFloat(element.options[1].value.split(':')[2]) / 100
            low = parseFloat(element.options[2].value.split(':')[2]) / 100
          }

          // if (level === 'HIGH') {
          //   if(this.addPerCent(element.fieldKey)){
          //     high = parseFloat(strArr[2])/100
          //   }else{
          //     high = parseInt(strArr[2])
          //   }
          // } else if (level === 'MIDDLE') {
          //   if(this.addPerCent(element.fieldKey)){
          //     middle = parseFloat(strArr[2])/100
          //   }else{
          //     middle = parseInt(strArr[2])
          //   }
          // } else if (level === 'LOW') {
          //   if(this.addPerCent(element.fieldKey)){
          //     low = parseFloat(strArr[2])/100
          //   }else{
          //     low = parseInt(strArr[2])
          //   }
          // }
        }
        conditions.push({
          conditionId: element.conditionId,
          high,
          middle,
          low,
          level
        })
      }
      return conditions
    },
    showConditionDialog(id, fieldKey, options, index) {
      if (this.$refs['numberValidateForm'] !== undefined) {
        this.$refs['numberValidateForm'].resetFields()
      }
      // this.formCondition.conditionId =id
      // this.formCondition.fieldKey =fieldKey
      this.formCondition.index = index
      let displayName = this.fieldKeyMap.get(fieldKey)
      this.conditionOptions.title = displayName
      this.conditionOptions.visible = true
      options.forEach(element => {
        let str = element.value
        let strArr = str.split(':')
        let name = strArr[1]
        if (name === 'high') {
          this.formCondition.high = parseInt(strArr[2])
        } else if (name === 'middle') {
          this.formCondition.middle = parseInt(strArr[2])
        } else if (name === 'low') {
          this.formCondition.low = parseInt(strArr[2])
        }
      })
    },
    submitConditionOptions() {
      this.conditionOptions.btnLoading=true;
      this.$refs.numberValidateForm.validate(valid => {
        if (valid) {
          let id = this.querySelectList[
            this.formCondition.index
          ].options[0].value.split(':')[0]
          let blankSpace = '\r \r \r \r \r'

          let fieldKey = this.querySelectList[this.formCondition.index].fieldKey
          let options = [
            {
              label: `高${blankSpace}${this.formCondition.high}`,
              value: `${id}:high:${this.formCondition.high}`
            },
            {
              label: `中${blankSpace}${this.formCondition.middle}`,
              value: `${id}:middle:${this.formCondition.middle}`
            },
            {
              label: `低${blankSpace}${this.formCondition.low}`,
              value: `${id}:low:${this.formCondition.low}`
            }
          ]
          if (this.addPerCent(fieldKey)) {
            options[0].label = `高${blankSpace}${this.formCondition.high}%`
            options[1].label = `中${blankSpace}${this.formCondition.middle}%`
            options[2].label = `低${blankSpace}${this.formCondition.low}%`
          }

          this.querySelectList[this.formCondition.index].options = options
          this.conditionOptions.visible = false
          this.conditionOptions.btnLoading=false;
          this.formInline.conditions[this.formCondition.index].value = ''

          //    this.$api["keywordFilterConditionUpdate"](this.formCondition).then(res => {
          //        let {code} =res
          //        if(code===0){
          //            this.getQuerySelect()
          //             this.conditionOptions.visible = false
          //        }
          //     })
        } else {
          console.log('error submit!!')
          this.conditionOptions.btnLoading=false;
          return false
        }
      })
    },
    //保存为常用筛选条件
    saveCriteria(save) {
      //conditionQuery

      //pParams.type
      let type = this.pParams.type;
      let productId = null;
      if (type === 'product') {
        productId: this.pParams.productId
      }
      
      let params = {
        siteId: this.siteId,
        cusCateId: this.pParams.cusCateId,
        productId: null,
        pageType: this.conditionQuery.pageType,
        filterFlag: 0, //筛选标识 0-常用筛选 1-编辑参数
        content: {}
      }
      //保存修改
      if (!save) {
        params.conditionId = this.formInline.conditionId
      }

      let data = this.handleCriteria('save')
      // console.log('data');
      // console.log(data);
      let flag = false
      let pPageType = this.pPageType
      if (pPageType === 'LAYOUT') {
        let source = data.source
        if (source !== null) {
          let b = _.isEmpty(source.replace(/(^\s+)|(\s+$)/g, ''))
          if (b) {
            source = null
          } else {
            flag = true
          }
        }
        params.content.source = source
      } else if (pPageType === 'ADVERT') {
        let advertName = data.advertName
        if (advertName !== null) {
          let b = _.isEmpty(advertName.replace(/(^\s+)|(\s+$)/g, ''))
          if (b) {
            advertName = null
          } else {
            flag = true
          }
        }
        params.content.advertName = advertName
      };
      let { conditions, keywordTexts } = data

      if (keywordTexts.length) {
          flag = true
      }
      params.content.keywordTexts = keywordTexts


      params.content.include = data.include
      params.content.exclude = data.exclude
      params.content.barring = data.barring
      params.content.wordCnt = data.wordCnt
      if( (data.include && data.include.length ) || (data.exclude && data.exclude.length) || (data.barring && data.barring.length) || data.wordCnt){
          flag = true
      }

      for (let index = 0; index < conditions.length; index++) {
        const element = conditions[index]
        element.label = this.querySelectList[index].label
      }

      // 检查是否全部为空，全部为空不可保存
      let conditionArr = []
      conditions.forEach(element => {
        if (element.level !== null) {
          flag = true
          conditionArr.push(element)
        }
      })


      params.content.conditions = conditionArr
      if (!flag) {
        this.$message.warning('筛选条件不能全部为空')
        return
      }


      //判断有没有重复的项
      let alreadyData = this.criteriaData ;//已添加过的数据
      // console.log('params');
      // console.log(params);
      // console.log('alreadyData');
      // console.log(alreadyData);
  
      let paramsCont = params.content;
      // console.log('paramsCont');
      // console.log(paramsCont);

      let keywordTextStatus,sourceStatus,wordCntStatus,includeStatus,excludeStatus,barringStatus,conditionsStatus;
      if(paramsCont.keywordTexts.length){
          keywordTextStatus = true
          let num = 0;
          alreadyData.forEach(i=>{
            let el = i.content.keywordTexts && i.content.keywordTexts.join('');
            let newP =  paramsCont.keywordTexts.join('');
            if( el === newP){
              num++
            }
          })
          if( num ){
              console.log('keywordTexts');
              keywordTextStatus = false
          }
      };
      if(paramsCont.source){
          sourceStatus = true;
          let num = 0;
          alreadyData.forEach(i=>{
              if( paramsCont.source === i.content.source ){
                  num ++ ; 
              }
          });
          if( num ){
              console.log('source');
              sourceStatus = false
          }
      };
      if(paramsCont.wordCnt ){
          wordCntStatus = true;
          let num = 0;
          alreadyData.forEach(i=>{
              if( paramsCont.wordCnt === i.content.wordCnt ){
                  num ++ ; 
              }
          });
          if( num ){
              console.log('wordCnt');
              wordCntStatus = false
          }
      };
      if(paramsCont.include.length ){
          includeStatus = true;
          let num = 0;
          alreadyData.forEach(i=>{
            let el = i.content.include && i.content.include.join('');
            let newP =  paramsCont.include.join('');
            if( el === newP){
              num++
            }
          })
          if( num ){
              console.log('include');
              includeStatus = false
          }
      };
      if(paramsCont.exclude.length ){
            excludeStatus = true;
            let num = 0;
            alreadyData.forEach(i=>{
              let el = i.content.exclude && i.content.exclude.join('');
              let newP =  paramsCont.exclude.join('');
              if( el === newP){
                num++
              }
            })
            if( num ){
                console.log('exclude');
                excludeStatus = false
            }
      };
      if(paramsCont.barring.length ){
            barringStatus = true;
            let num = 0;
            alreadyData.forEach(i=>{
              let el = i.content.barring && i.content.barring.join('');
              let newP =  paramsCont.barring.join('');
              if( el === newP){
                num++
              }
            })
            if( num ){
                console.log('barring');
                barringStatus = false
            }
      };
      if(paramsCont.conditions.length ){
            conditionsStatus = true;
            let num = 0;
            alreadyData.forEach(i=>{
              let el = i.content.conditions.map(k=>{return k.label + k.level}).join('');
              let newP =paramsCont.conditions.map(j=>{return  j.label + j.level}).join('');
              if( el === newP){
                num++
              }
               
            })
            if( num  ){
                console.log('conditions');
                conditionsStatus = false
            }
      }

      //console.log(sameFlag);
      if( !(keywordTextStatus || sourceStatus || wordCntStatus || includeStatus || excludeStatus || barringStatus || conditionsStatus)){
          this.$message.warning('请勿添加相同的筛选条件')
          return
      }
      this.$api[
        save
          ? 'keywordCommonFilterConditionSave'
          : 'keywordCommonFilterConditionUpdate'
      ](params).then(res => {
        this.getCriteriaList()
        this.activeNames = ['list']
        this.formInline.conditionId = null
      })
    },
    formatterContent(row, column) {
      let conditions = row.content.conditions
      let str = ''
      let blankSpace = '\r \r \r'
      conditions.forEach(element => {
        let value = null
        if (element.level === 'HIGH') {
          value = element.high
        } else if (element.level === 'MIDDLE') {
          value = element.middle
        } else if (element.level === 'LOW') {
          value = element.low
        }
        let tmp = this.querySelectList.filter(
          item => item.conditionId === element.conditionId
        )
        if (tmp.length === 1) {
          if (this.addPerCent(tmp[0].fieldKey)) {
            str += `${element.label}:${value * 100}%${blankSpace}`
          } else {
            str += `${element.label}:${value}${blankSpace}`
          }
        }
        // str += `${element.label}:${value}${blankSpace}`
      })
      return str
    },
    //获取常用筛选条件列表
    getCriteriaList() {
      this.listLoading = true
      this.$api['keywordCommonFilterConditionList']({
        siteId: this.siteId,
        cusCateId: this.pParams.cusCateId,
        pageType: this.conditionQuery.pageType
      })
        .then(res => {
          let { code, data } = res
          if (code === 0) {
            data.forEach(element => {
              element.content = JSON.parse(element.content)
            })
            this.criteriaData = data
            //console.log(data);
            this.listLoading = false
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    deleteRows(id) {
      
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$api['keywordCommonFilterConditionRemove']({
              ids: [id]
            }).then(res => {
              let { code } = res
              if (code === 0) {
                if (this.formInline.conditionId === id) {
                  this.formInline.conditionId = null
                }
                this.getCriteriaList()
              }
            })
        }).catch(() => {

        });
    },
    //点击常用筛选条件的表格的设置按钮
    handleRowCriteria(row, search) {
      // console.log(row)
      // console.log(this.querySelectList)
      let pPageType = this.pPageType
      this.formInline.keywordTexts = row.content.keywordTexts.join('\n');
     
      this.formInline.include = row.content.include &&  row.content.include.join('\n')
      this.formInline.exclude = row.content.exclude && row.content.exclude.join('\n')
      this.formInline.barring = row.content.barring && row.content.barring.join('\n')
      this.formInline.wordCnt = row.content.wordCnt
     
      if (pPageType === 'LAYOUT') {
        this.formInline.source = row.content.source
      } else if (pPageType === 'ADVERT') {
        this.formInline.advertName = row.content.advertName
      }
      let querySelectListTmp = []
      let blankSpace = '\r \r \r \r \r'
      row.content.conditions.forEach(element => {
        let tmp = this.querySelectList.filter(
          item => item.conditionId === element.conditionId
        )

        if (tmp.length === 1) {
          let options = [
            {
              label: `高${blankSpace}${element.high}`,
              value: `${element.conditionId}:high:${element.high}`
            },
            {
              label: `中${blankSpace}${element.middle}`,
              value: `${element.conditionId}:middle:${element.middle}`
            },
            {
              label: `低${blankSpace}${element.low}`,
              value: `${element.conditionId}:low:${element.low}`
            }
          ]
          let formValue = ''
          if (element.level === 'HIGH') {
            formValue = `${element.conditionId}:high:${element.high}`
          } else if (element.level === 'MIDDLE') {
            formValue = `${element.conditionId}:middle:${element.middle}`
          } else if (element.level === 'LOW') {
            formValue = `${element.conditionId}:low:${element.low}`
          }
          if (this.addPerCent(tmp[0].fieldKey)) {
            options[0].label = `高${blankSpace}${element.high * 100}%`
            options[1].label = `中${blankSpace}${element.middle * 100}%`
            options[2].label = `低${blankSpace}${element.low * 100}%`
            options[0].value = `${element.conditionId}:high:${element.high *
              100}`
            options[1].value = `${element.conditionId}:middle:${element.middle *
              100}`
            options[2].value = `${element.conditionId}:low:${element.low * 100}`
            if (element.level === 'HIGH') {
              formValue = `${element.conditionId}:high:${element.high * 100}`
            } else if (element.level === 'MIDDLE') {
              formValue = `${element.conditionId}:middle:${element.middle *
                100}`
            } else if (element.level === 'LOW') {
              formValue = `${element.conditionId}:low:${element.low * 100}`
            }
          }

          querySelectListTmp.push({
            conditionId: element.conditionId,
            formValue,
            options
          })
        }
      })

      console.log('querySelectListTmp', querySelectListTmp)

      let array = this.querySelectList
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        let flag = true
        querySelectListTmp.forEach(elm => {
          if (element.conditionId === elm.conditionId) {
            element.options = elm.options
            this.formInline.conditions[index].value = elm.formValue
            flag = false
          }
        })
        if (flag) {
          this.formInline.conditions[index].value = ''
        }
      }

      this.formInline.conditionId = row.conditionId

      if (!search) {
        // 缓存数据
        this.oldData = JSON.parse(JSON.stringify(this.formInline))
        //console.log(this.oldData );
      }

      this.activeNames = 'criteria'

      if (search) {
        this.formInline.conditionId = null
        this.handleFilter()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.collapse-box {
  /deep/.el-collapse-item__header {
    display: flex;
    justify-content: space-between;
    .collapse-criteria-title {
      width: 97%;
      display: flex;
      justify-content: space-between;
    }
  }
  .el-form {
    .select-keyword,
    .select-advert-name,
    .select-rource {
      width: 164px;
    }
    .select-condition {
      width: 120px;
      input {
        border-radius: 3px 0 0 3px;
        border-right-width: 0;
      }
    }
  }
}
</style>
<style lang="scss">
.cursor {
  cursor: pointer;
}
.select-condition {
  input {
    border-radius: 3px 0 0 3px;
    border-right-width: 0;
  }
}
</style>

<template>
  <div v-loading="tableLoading">
    <MainLayout
      @loading="val => tableLoading = val"
      :outerParams="outerParams"
      :edits="edits"
      :leftSpan="4"
      :searchFields="searchFields"
      :outSearchData="searchData"
      :editBtns="editBtns"
      @searchTrueData='searchTrueData'
      :columns="columns"
      :searchFunc="searchFunc"
      :treeTable="treeTable"
      :initialParmas="initialParmas"
      :treeTableOtions="treeTableOtions"
      ref="layout"
      :editWidth="null"
	  :getSummaries = 'getSummaries'
      url="adManualList"
      :backBtn="!(this.$route.name === 'CompetitiveOptimizationsManual' || this.$route.name === 'DataAnalysisManual')"
    >
      <div slot="showRefresh">
        <el-button
          type="primary"
          plain
          size="small"
          @click="setManualUpdate"
          :loading="loadingBtn1"
          :disabled="BTNdisabled"
          style="position:absolute;right:100px;top:13px;"
        >
          {{refreshhtml}}
          <i class="el-icon-refresh el-icon--right"></i>
        </el-button>
      </div>
      <CommonTree
        @add="showDialog('AddGroup', '添加分组', $event)"
        @addNext="showDialog('AddGroup', '添加下级分组', $event)"
        @edit="showDialog('AddGroup', '编辑分组', $event)"
        @del="deleteTreeNode"
        @nodeClick="handleNodeClick"
        :currentNode.sync="currentNode"
        :classifyType="2"
        ref="treeTaskCustomCategory"
        slot="left"
      />
    </MainLayout>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { totalMethod } from 'Utils/tools'
export default {
  data() {
    let vm = this
    return {
      tableLoading: false,
      currentNode: {},
      // objectId: 'ad_group_id',
      filterTaskText: '',
      tree1Key: 1,
      tree1Loading: false,
      taskClassify1List: [],
      defaultProps: {
        label: 'classifyName',
        value: 'classifyId',
        children: 'childList'
      },
      show: true,
      treeTable: true,
      treeTableOtions: {
        childs: 'children',
        expandFunc: row => {
          return row.count > 0
        }
      },
      data: {},

      edits: [
        {
          name: '编辑定时调整预算策略',
          icon: 'el-icon-edit-outline',
          show: scope => {
            return scope.row.status !== -1
          },
          fn: (scope, item) => {
            this.showDialog(
              'Add',
              `编辑定时调整${this.keyName}策略`,
              scope.row,
              true
            )
          }
        },
        // {
        //   name: '查看定时调整预算策略',
        //   icon: 'el-icon-search',
        //   show: scope => {
        //     return scope.row.status !== -1
        //   },
        //   fn: (scope, item) => {
        //     this.showDialog(
        //       'Add',
        //       `查看定时调整${this.keyName}策略`,
        //       scope.row,
        //       true
        //     )
        //   }
        // },
        {
          name: '广告预算历史曲线',
          icon: 'el-icon-picture-outline',
          show: scope => {
            return scope.row.status !== -1 && this.strategyType === 0
          },
          fn: (scope, item) => {
            this.lookAdEcharts(scope)
          }
        }
      ],
      searchFields: [
        {
          name: 'objectName',
          labelWidth: '75px',
          label: '广告系列'
          // placeholder: '请输入广告活动名称'
        },
        {
          label: '定时调整预算状态',
          labelWidth: '130px',
          name: 'status',
          type: 'select',
          options: [
            {
              label: '开启',
              value: 1
            },
            {
              label: '关闭',
              value: 0
            },
            {
              label: '无',
              value: -1
            }
          ]
        },
        {
          label: '优化方式',
          labelWidth: '80px',
          name: 'seoType',
          type: 'select',
          options: [
            {
              label: '每日',
              value: 0
            },
            {
              label: '周一到周日',
              value: 1
            }
          ]
        },
        {
          label: '系列状态',
          labelWidth: '80px',
          name: 'state',
          type: 'select',
          options: [
            {
              label: '启用',
              value: 'enabled'
            },
            {
              label: '暂停',
              value: 'paused'
            }
          ]
        },
        {
          label: '是否忽略',
          labelWidth: '80px',
          name: 'ignoreFlag',
          type: 'select',
          options: [
            {
              label: '否',
              value: 0
            },
            {
              label: '是',
              value: 1
            }
          ]
        },
        {
          label: '太平洋时间',
          name: 'rptDate',
          type: 'dateRange',
          placeholder: '请选择',
          clearable :false,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 15 * 3600 * 1000
            }
          }
        }
      ],
      searchData:{
          rptDate: [ dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') , dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') ],
          ignoreFlag: 0,
      },
      initialParmas: {
					rptDate: [dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'),dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')],
					ignoreFlag: 0,
      },
      editBtns: [
        {
          name: '移入分组',
          show: () => {
            return this.keyName === '预算'
          },
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            let data = this.$refs.layout.selection
            if (!data.length) {
              this.$message.warning('请选择数据进行移动')
              return
            }
            this.showDialog('MoveGroup', '移入分组', data)
          }
        },
        {
          // name: '添加定时调整预算策略',
          nameFn: () => {
            return `添加定时调整${this.keyName}策略`
          },
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            let data = this.$refs.layout.selection
            if (!data.length) {
              this.$message.warning('请选择数据添加')
              return
            }
            if (data.some(el => el.status !== -1)) {
              this.$message.warning('选择项中已经存在策略')
              return
            }
            this.showDialog('Add', `添加定时调整${this.keyName}策略`, data)
          }
        },
        {
          name: '编辑定时调整预算策略',
          nameFn: () => {
            return `编辑定时调整${this.keyName}策略`
          },
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            let data = this.$refs.layout.selection
            if (data.length) {
			  if (data.some(el => el.status === -1)) {
			    this.$message.warning('选择项中存在未添加的策略')
			    return
			  }
              this.showDialog(
                'Add',
                `编辑定时调整${this.keyName}策略`,
                data,
                true
              )
            } else {
              this.$message.warning('请选择一条数据编辑')
            }
          }
        },
        {
          // name: '关闭定时调整预算',
          nameFn: () => {
            return `关闭定时调整${this.keyName}`
          },
          showLoading:true,
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            return this.updateStatus(0)
          }
        },
        {
          // name: '开启定时调整预算',
          nameFn: () => {
            return `开启定时调整${this.keyName}`
          },
          showLoading:true,
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            return this.updateStatus(1)
          }
        },
        {
          name: '忽略',
          showLoading:true,
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            return this.setIgnore(1)
          }
        },
        {
          name: '取消忽略',
          showLoading:true,
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            return  this.setIgnore(0)
          }
        },
        {
          name: '添加否定词',
          show: () => {
            return this.$route.name === 'CompetitiveOptimizationsManual' || this.$route.name === 'DataAnalysisManual'
          },
          disabled: () => {
            return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          fn: () => {
            let data = this.$refs.layout.selection
            if (!data.length) {
              this.$message.warning('请选择数据添加')
              return
            }
            this.showDialog('AddNegativeWord', '添加否定词', data)
          }
        }
      ],
      columns: [
        {
          label: '广告系列',
          value: 'objectName',
          width: '160px',
          render: (h, scope) => {
            let { objectName, objectId } = scope.row
            return (
              <a
                type="text"
                style="word-wrap:normal;"
                onClick={() => {
                  console.log(this.searchData);
                  this.$router.push({
                    name: 'DataAnalysisManualGroup',
                    query: {
                      strategyType: 1,
                      objectId,
                      name: objectName,
                      classifyId: this.currentNode.classifyId,
                      timeRange:this.timeRange
                    }
                  })
                }}
              >
                {objectName}
              </a>
            )
          }
        },
		{
		  label: '匹配方式',
		  value: 'matchType',
		  enum: {
		    exact: '精确匹配',
		    phrase: '词组匹配',
			broad:'广泛匹配',
		  },
		  isShow:false,
		},
        {
          label: '投放类型',
          value: 'targetingType',
          isShow: false,
          enum: {
            manual: '手动',
            auto: '自动'
          }
        },
        {
          label: '状态',
          value: 'state',
          enum: {
            enabled: '启用',
            paused: '暂停'
          }
        },
        {
          label: '广告预算',
          value: 'oldBid',
          width: 120,
          headerTooltip: '最新的广告预算',
          isShow: false,
          sortable: 'custom',
		  money:'us'
        },
		{
		  label: '花费',
		  value: 'cost',
		  sortable: 'custom',
		  money:'us'
		},
		{
		  label: '订单量',
		  value: 'adOrderCnt',
		  minWidth: '90px',
		  sortable: 'custom'
		},
		{
		  label: '转化率',
		  value: 'adConversionRates',
		  minWidth: '90px',
		  sortable: 'custom',
		  render(h, scope) {
		    let { adConversionRates } = scope.row
		    return (
		      <span>
		        {adConversionRates == null
		          ? '-'
		          : Math.round(adConversionRates * 1000000) / 10000 + '%'}
		      </span>
		    )
		  }
		},
		{
		  label: 'CPC',
		  value: 'cpc',
		  sortable: 'custom'
		},
		{
		  label: 'ACOS',
		  value: 'acos',
		  sortable: 'custom',
		  minWidth: '90px',
		  isPercent:true,
		  keepFew:2
		},
		{
		  label: '广告销售总额',
		  minWidth: 110,
		  value: 'adSales',
		  minWidth: '140px',
		  sortable: 'custom',
		  money:'us'
		},
        {
          label: '曝光量',
          value: 'impressions',
          minWidth: '90px',
          sortable: 'custom'
        },
        {
          label: '点击量',
          value: 'clicks',
          minWidth: '90px',
          sortable: 'custom'
        },
        {
          label: '点击率',
          value: 'clickRates',
          minWidth: '90px',
          sortable: 'custom',
          render(h, scope) {
            let { clickRates } = scope.row
            return (
              <span>
                {clickRates == null
                  ? '-'
                  : Math.round(clickRates * 1000000) / 10000 + '%'}
              </span>
            )
          }
        },
        
        
        
        
        
        
        {
          label: '定时调整预算状态',
          minWidth: 130,
          value: 'status',
          enum: {
            '<0': '无',
            0: '关闭',
            1: '开启'
          }
        },
        {
          label: '分组',
          value: 'classifyName',
          isShow: true,
          render(h, scope) {
            let { classifyName } = scope.row
            return classifyName ? (
				<el-tooltip content={classifyName} effect="light" placement="top">
				    <span class="fix__row_1">{classifyName}</span>
				</el-tooltip>
			) : '未分组'
          }
        }
      ],

      loadingBtn1: false,
      refreshhtml: '手动刷新',
      BTNdisabled: false,

      time:null
    }
  },
  computed: {
    timeRange(){
      return  this.time
    },
    keyName() {
      return this.$route.name === 'DataAnalysisManualKeyword'
        ? 'CPC'
        : this.$route.name === 'DataAnalysisManualGroup'
        ? '默认CPC'
        : '预算'
    },
    strategyType() {
      if (this.$route.name === 'DataAnalysisManualGroup') {
        return 1
      } else if (this.$route.name === 'DataAnalysisManualKeyword') {
        return 2
      } else {
        return 0
      }
    },
    objectId() {
      return this.strategyType == 0
        ? 'campaign_id'
        : this.strategyType == 1
        ? 'ad_group_id'
        : 'keyword_id'
    },
    baseParams() {
      return {
        ...this.storeIds,
        strategyType: this.strategyType
      }
    },
    outerParams() {
      let { classifyId, objectId, groupObjectId } = this.$route.query
      classifyId = this.currentNode.classifyId || classifyId
      return {
        ...this.storeIds,
        classifyId,
        objectId:
          this.$route.name === 'DataAnalysisManualGroup'
            ? +groupObjectId
            : +objectId,
        strategyType: this.strategyType
      }
    }
  },
  created() {
    this.updateColumn()
    // if (this.siteId && this.sellerId) {
    //   this.getManualUpdate()
    // }
  },
  watch: {
    $route(to) {
        let rptDate= [ dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') , dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD') ];
        if( this.$route.query && this.$route.query.timeRange){
            rptDate= [ 
              this.$route.query.timeRange[0] || dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD'),
              this.$route.query.timeRange[1]  || dayjs(Date.now() - 15 * 3600 * 1000).format('YYYY-MM-DD')
            ];
        }
        
      this.searchData = { rptDate , ignoreFlag: 0 };
      this.initialParmas = { rptDate , ignoreFlag: 0 };
      //console.log(this.searchData);
      if (
        to.name === 'DataAnalysisManual' ||
        to.name === 'DataAnalysisManualGroup' ||
        to.name === 'DataAnalysisManualKeyword' ||
        to.name === 'CompetitiveOptimizationsManual'
      ) {
        this.$refs.layout.resetSort()
        this.$nextTick(() => {
          this.updateColumn()
          this.$refs.layout && this.$refs.layout.getList(undefined, true)
        })
      }
    },
    sellerData() {
      if (this.siteId && this.sellerId) {
        this.getManualUpdate()
      }
    }
  },
  methods: {
    searchTrueData(v){
      let { startTime , endTime} = v;
      this.time = [startTime,endTime]
    },
    setIgnore(flag) {
      return this.$confirm(`是否${!flag ? '取消' : ''}忽略选中项？`, '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let strategyType = this.strategyType
          let objectIds = []
          this.$refs.layout.selection.forEach(i => {
            objectIds.push(i.objectId)
          })
          return  this.$api['adManualIgnore']({
            ...this.storeIds,
            strategyType,
            ignoreFlag: flag,
            objectIds
          }).then(data => {
            this.$refs.layout.getList()
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    lookAdEcharts(scope) {
      this.$refs.layout.$dialog({
        title: '广告预算历史曲线',
        width: '1200px',
        showMaxBtn: true,
        params: { strategyType: 0, objectId: scope.row.objectId },
        component: () => import('./dialogs/echartsDialog.vue')
        // okBtnText: "确认",
        // cancelBtnText: "取消"
      })
    },
    searchFunc(data) {
      let { rptDate, ...info } = data
      // rptDate = JSON.parse(
      //   JSON.stringify(
      //     dayjs(new Date(rptDate).getTime() - 15 * 3600 * 1000).format(
      //       'YYYY-MM-DD'
      //     )
      //   )
      // )
      //console.log(rptDate);
      let [startTime,endTime] = rptDate || [] ;
      return { startTime,endTime, ...info }
    },
    handleNodeClick(data) {
      let { classifyName: objectName, campaignId, adGroupId, classifyId } = data
      if (data.campaignId) {
        this.$refs.layout.resetSort()
		this.$refs.layout.pageNo = 1
        // 点击的是广告系列
        this.$nextTick(() => {
          this.$router.push({
            name: 'DataAnalysisManualGroup',
            query: {
              strategyType: 1,
              seriesName: objectName,
              groupObjectId: campaignId
              // classifyId: this.currentNode.classifyId
            }
          })
        })
      } else if (data.adGroupId) {
        this.$refs.layout.resetSort()
		this.$refs.layout.pageNo = 1
        // 点击的是广告组
        this.$nextTick(() => {
          this.$router.push({
            name: 'DataAnalysisManualKeyword',
            query: {
              strategyType: 2,
              objectId: adGroupId,
              name: objectName,
              seriesName: this.$route.query.seriesName,
              groupObjectId: this.$route.query.groupObjectId
              // classifyId: this.currentNode.classifyId
            }
          })
        })
      } else {
        // 点击的是自创分组
        this.$refs.layout.resetSort()
		this.$refs.layout.pageNo = 1
        this.$nextTick(() => {
          this.$router.push({ name: 'DataAnalysisManual' })
        })
      }
    },
    updateColumn() {
      let strategyType =
        this.$route.name === 'CompetitiveOptimizationsManual' ||
        this.$route.name === 'DataAnalysisManual'
          ? 0
          : this.$route.name === 'DataAnalysisManualGroup'
          ? 1
          : 2

      let el = {},
        searchItemName = null,
		show1,
        show2,
        show5,
        show14,
        btnsItem = {}
      //
      /// console.log(strategyType);
      if (strategyType == 0) {
        el = {
          label: '广告系列',
          value: 'objectName',
          align: 'left',
          minWidth: '160px',
          render: (h, scope) => {
            let { objectName, objectId } = scope.row
            return (
              <el-tooltip content={objectName} placement="top" effect="light">
                <a
                  title={objectName}
                  class="url fix__row_1"
                  onClick={() => {
                    this.$router.push({
                      name: 'DataAnalysisManualGroup',
                      query: {
                        strategyType: 1,
                        seriesName: objectName,
                        groupObjectId: objectId,
                        classifyId: this.currentNode.classifyId,
                        timeRange:this.timeRange
                      }
                    })
                  }}
                >
                  {objectName}
                </a>
              </el-tooltip>
            )
          }
        }
		show1 = false
        show2 = false
        show5 = true
        show14 = true
        searchItemName = '广告系列'
      } else {
        if (strategyType == 1) {
          el = {
            label: '广告组',
            align: 'left',
            value: 'objectName',
            minWidth: '120px',
            render: (h, scope) => {
              let { objectName, objectId } = scope.row
              return (
                <el-tooltip content={objectName} placement="top" effect="light">
                  <a
                    type="text"
                    class="url fix__row_1"
                    onClick={() => {
                      this.$router.push({
                        name: 'DataAnalysisManualKeyword',
                        query: {
                          strategyType: 2,
                          objectId,
                          name: objectName,
                          seriesName: this.$route.query.seriesName,
                          groupObjectId: this.$route.query.groupObjectId,
                          classifyId: this.currentNode.classifyId,
                          timeRange:this.timeRange
                        }
                      })
                    }}
                  >
                    {objectName}
                  </a>
                </el-tooltip>
              )
            }
          }
		  show1 = false
          show2 = true
          show5 = false
          show14 = false
          searchItemName = '广告组'
        } else {
          el = {
            label: '关键词',
            value: 'objectName',
            align: 'left',
            minWidth: '220px',
			showTooltip:true
          }
		  show1 = true
          show2 = true
          show5 = false
          show14 = false
          searchItemName = '关键词'
        }
      }
      this.columns.splice(0, 1, el)
	  this.columns[1].isShow = !show1
      this.columns[2].isShow = show2
      this.columns[4].isShow = !show5
      //console.log(this.columns.length);
      this.columns[15].isShow = !show14
      this.searchFields[0].label = searchItemName
    },
    updateStatus(status) {
      let data = this.$refs.layout.selection
      if (data.length) {
        return this.$confirm(
          `是否${status ? '开启' : '关闭'}选中项的${this.keyName}？`,
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            let ids = data.map(el => el.objectId)
            let params = {
              ...this.baseParams,
              objectIds: ids,
              status
            }
            return this.$api[`adManualUpdateStrategyStatus`](params)
              .then(data => {
                this.$refs.layout.getList()
              })
              .catch(() => {})
          })
          .catch(() => {})
      } else {
        this.$message.warning('请选择数据编辑')
      }
    },
    sortChange({ column, prop, order }) {},
    getTaskClassifyList(noCheckbox) {
      return this.$refs.treeTaskCustomCategory.refreshTree(noCheckbox)
    },

    updateTree(type, parentKey) {
      // '添加分组', '添加下级分组', '编辑分组'
      switch (type) {
        case '添加分组':
          this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
          break
        case '添加下级分组':
          this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
          break
        case '编辑分组':
          this.$refs.treeTaskCustomCategory.updateKeyChildren(parentKey)
          break

        default:
          break
      }
    },

    showDialog(componentName = 'Add', title, row, edit) {
      let params = {
        row,
        objectId: this.objectId,
        strategyType: this.strategyType,
        treeList: this.$refs.treeTaskCustomCategory.data,
        parent: this,
        keyName: this.keyName,
        title,
        edit
      }
      if (title === '编辑分组' || title === '添加下级分组') {
        params.row.parentIds = this.$refs.treeTaskCustomCategory.getParentIds(
          row
        )
      }
      if (title === '添加下级分组') {
        params._next = true
      }
      if (title.indexOf('查看') > -1) {
        params.view = true
      }
      this.$refs.layout.$dialog({
        title,
        params,
		    width:componentName === 'Add' ? params.strategyType === 0 ? '1010px' : '800px' : '500px',
		    //size: componentName === 'Add' ? 'medium' : 'small',
        component: () => import(`./dialogs/${componentName}.vue`),
        okBtnText: title.indexOf('查看') > -1 ? null : '确认',
        cancelBtnText: title.indexOf('查看') > -1 ? null : '取消'
      })
    },
    deleteTreeNode(data, done) {
      let ids = []
      if (!data) {
        ids = this.$refs.treeTaskCustomCategory.getCheckedKeys()
        if (ids.length) {
        } else {
          this.$message.warning('请选择一项进行删除')
          return
        }
      } else {
        ids.push(data.classifyId)
      }

      let params = {
        classifyIds: ids,
        classifyType: 2,
        flag: 1
      }
      this.$confirm('是否删除分组？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return this.$api[`taskClassifyRemove`](params)
            .then(data => {
              if (ids.indexOf(this.currentNode.classifyId) > -1) {
                this.currentNode = {}
              }
              this.getTaskClassifyList(true)
              this.$refs.layout.getList()
            })
            .catch(() => {})
        })
        .catch(() => {
          done()
        })
    },
    //获取更新状态
    getManualUpdate() {
      this.$api['adDataGetLatestTime']({
        //siteId:this.listQuery.siteId,
        //siteId:this.listQuery.siteId,
        siteId: this.siteId,
        sellerId: this.sellerId,
        platformId: this.platformId
      })
        .then(data => {
          // debugger
          const { status, dataTime } = data
          if (status === 0) {
            this.refreshhtml = '更新中'
            this.loadingBtn1 = true
          }
          if (status === 1) {
            this.refreshhtml = '更新成功'
            this.loadingBtn1 = false
            this.BTNdisabled = true
          }
        })
        .catch(err => {
          // if (err && err.code) {
          //   this.refreshhtml = '正在刷新中'
          //   this.loadingBtn1 = true
          // }
        })
    },
    //手动更新
    setManualUpdate() {
      this.$confirm('数据更新可能需要1个小时，是否确认更新?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loadingBtn1 = true
          this.refreshhtml = '正在刷新中'
          this.$api['adDataUpdateData']({
            //siteId:this.listQuery.siteId,
            //siteId:this.listQuery.siteId,
            siteId: this.siteId,
            sellerId: this.sellerId,
            platformId: this.platformId
          })
            .then(res => {
              if (res.code === 0) {
                // if(this.listQuery.cusCateId!==null){

                this.handleFilter()
                this.refreshhtml = '正在刷新中'
                this.BTNdisabled = true
                this.loadingBtn1 = false

                // }
              }
            })
            .catch(err => {
              //console.log(err);
              if (err.code === 400) {
                this.BTNdisabled = true
                this.refreshhtml = '今日数据已更新'
                this.loadingBtn1 = false
              } else if (err.code === 500) {
                this.BTNdisabled = true
                this.refreshhtml = '正在刷新中'
              }
            })
        })
        .catch(() => {})
    },
	//表尾合计
	getSummaries(param) {
		
		const { columns, data } = param;
		const sums = [];
		const sums1 = [];
		//循环处理所有列数据
		let indexList = {
			oldBid:4,
			cost:5,
			adOrderCnt:6,
			adConversionRates:7,
			cpc:8,
			acos:9,
			adSales:10,
			impressions:11,
			clicks:12,
			clickRates:13
		}
		if(this.$route.name === 'DataAnalysisManualGroup'){
			indexList = {
				oldBid:null,
				cost:3,
				adOrderCnt:4,
				adConversionRates:5,
				cpc:6,
				acos:7,
				adSales:8,
				impressions:9,
				clicks:10,
				clickRates:11
			}
		}
		if(this.$route.name === 'DataAnalysisManualKeyword'){
			indexList = {
				oldBid:null,
				cost:4,
				adOrderCnt:5,
				adConversionRates:6,
				cpc:7,
				acos:8,
				adSales:9,
				impressions:10,
				clicks:11,
				clickRates:12
			}
		}
		columns.forEach((column, index) => {
		  if (index === 0) {
			sums[index] = '合计';
			return;
		  }
		  if (index === indexList.adOrderCnt || index === indexList.impressions || index === indexList.clicks) {
			 const values = data.map(item => Number(item[column.property]));
			 if (!values.every(value => isNaN(value))) {
				sums[index] = totalMethod(values)
				sums[index] += '';
			 } else {
				sums[index] = '';
			 }
		  }
		  if (index === indexList.oldBid || index === indexList.cost || index === indexList.adSales) {
			 const values = data.map(item => Number(item[column.property]));
			 if (!values.every(value => isNaN(value))) {
				sums[index] = totalMethod(values)
				sums[index] = sums[index].toFixed(2) 
				sums[index] = '$ ' + sums[index];
			 } else {
				sums[index] = '';
			 }
		  }
		  if (index === indexList.acos) {
			 const values1 = data.map(e=>Number(e.cost));
			 const values2 = data.map(e=>Number(e.adSales));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)		
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index] * 100
				sums[index] = sums[index].toFixed(2)
				if(isNaN(Number(sums[index]))) sums[index] = 0
				if(sums[index] == 'Infinity') sums[index] = 0
				sums[index] += '%';
			 } else {
				sums[index] = '';
			 }
		  }
		  if (index === indexList.cpc) {
			 const values1 = data.map(e=>Number(e.cost));
			 const values2 = data.map(e=>Number(e.clicks));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)			
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index].toFixed(2) 
				if(isNaN(Number(sums[index]))) sums[index] = 0
				if(sums[index] == 'Infinity') sums[index] = 0
				sums[index] += '';
			 } else {
				sums[index] = '';
			 }
		  }
		  if ( index === indexList.clickRates) {
			 const values1 = data.map(e=>Number(e.clicks));
			 const values2 = data.map(e=>Number(e.impressions));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)			
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index] * 100
				sums[index] = sums[index].toFixed(2)
				if(isNaN(Number(sums[index]))) sums[index] = 0 
				if(sums[index] == 'Infinity') sums[index] = 0
				sums[index] += '%';
			 } else {
				sums[index] = '';
			 }
		  }
		  if ( index === indexList.adConversionRates) {
			 const values1 = data.map(e=>Number(e.adOrderCnt));
			 const values2 = data.map(e=>Number(e.clicks));
			 if (!values1.every(value => isNaN(value))) {
				sums[index] = totalMethod(values1)			
				sums1[index] = totalMethod(values2)			
				sums[index] = sums[index] / sums1[index]
				sums[index] = sums[index] * 100
				sums[index] = sums[index].toFixed(2)
				if(isNaN(Number(sums[index]))) sums[index] = 0
				if(sums[index] == 'Infinity') sums[index] = 0
				sums[index] += '%';
			 } else {
			 	sums[index] = '';
			 }
		  }
		});
			 
		return sums;
	},
  }
}
</script>

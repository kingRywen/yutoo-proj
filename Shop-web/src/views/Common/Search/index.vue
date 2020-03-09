<!-- 搜索组件 -->
<template>
  <div class="___common __search parent">
    <el-collapse v-model="activeName" class="custom-collapse" value="`1`" accordion>
      <el-button v-if="backFun" type="text" icon="el-icon-back" @click="backFun" size="mini" class="__backbtn">返回</el-button>
      <el-collapse-item title="筛选条件" name="1">
        <section>
          <!-- <div class="box-info" v-if="text">
        <span>筛选条件</span>
          </div>-->
          <div :class="{'box-query':box_query}">
            <el-form size="small" :inline="true" :model="searchData" class="mb10">
              <el-form-item v-if="search.taskName" label="任务名称">
                <el-input v-model.trim="searchData.taskName" placeholder="输入任务名称" size="small" :clearable="true"></el-input>
              </el-form-item>
              <el-form-item v-if="search.orderId2" label="订单号">
                <el-input v-model.trim="searchData.orderId" placeholder="输入订单号" size="small" :clearable="true"></el-input>
              </el-form-item>
              <el-form-item v-if="search.sellerName" label="卖家名称">
                <el-input v-model.trim="searchData.sellerName" placeholder="输入卖家名称" size="small" :clearable="true"></el-input>
              </el-form-item>
              <el-form-item v-if="search.sellerAlias" label="店铺名称">
                <el-input
                  placeholder="请输入店铺名称"
                  v-model.trim="searchData.sellerAlias"
                  clearable
                  style="max-width:150px"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="search.cusCateName" label="分类名称">
                <el-input
                  placeholder="请输入分类名称"
                  v-model.trim="searchData.cusCateName"
                  clearable
                  style="max-width:150px"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="search.status" label="抓取状态">
                <el-select v-model="searchData.status" placeholder="选择状态" style="max-width:120px" clearable size="small">
                  <el-option v-for="item in StatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="search.cate" label="选择类目">
                <el-cate :Cate.sync="searchData.category" width="150px" :platformId="platformId"></el-cate>
              </el-form-item>
			  <el-form-item v-if="search.parentAsin" label="ASIN">
			    <el-input
			      placeholder="请输入ASIN"
			      v-model.trim="searchData.parentAsin"
			      clearable
			      style="max-width:150px;"
			      size="small"
			    ></el-input>
			  </el-form-item>
              <el-form-item v-if="search.sku" label="ASIN">
                <el-input
                  placeholder="请输入ASIN"
                  v-model.trim="searchData.sku"
                  clearable
                  style="max-width:150px;"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="search.asin" label="ASIN">
                <el-input
                  placeholder="ASIN"
                  v-model.trim="searchData.asin"
                  clearable
                  style="max-width:150px;"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="search.asin2" label="ASIN/SKU">
                <el-input
                  placeholder="ASIN/SKU"
                  v-model.trim="searchData.asin"
                  clearable
                  style="max-width:150px;"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="search.fbpFlag" label="发货方式">
                <el-select v-model="searchData.fbpFlag" placeholder="请选择" style="max-width:120px" clearable size="small">
                  <el-option v-for="item in fbpFlagOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="search.fbpFlagAmazon" label="发货方式">
                <el-select v-model="searchData.fbpFlag" placeholder="请选择" style="max-width:120px" clearable size="small">
                  <el-option
                    v-for="item in fbpFlagOptionsAmazon"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="search.TitleOptions" label="标题卖点校验状态">
                <el-cascader
                  :options="TitleOptions"
                  v-model="searchData.titleStatus"
                  clearable
                  size="small"
                  style="max-width:150px;"
                ></el-cascader>
              </el-form-item>
              <el-form-item v-if="search.BackstageOptions" label="后台校验状态">
                <el-cascader
                  :options="BackstageOptions"
                  v-model="searchData.BackStatus"
                  clearable
                  size="small"
                  style="max-width:150px;"
                  :disabled="false"
                ></el-cascader>
              </el-form-item>
              <el-form-item v-if="search.relateSku" label="关联ASIN">
                <el-input
                  placeholder="关联ASIN"
                  v-model.trim="searchData.relateSku"
                  clearable
                  style="max-width:150px;"
                  size="small"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="search.monitorFlag" label="监控状态">
                <el-select
                  v-model="searchData.monitorFlag"
                  placeholder="选择状态"
                  style="max-width:120px"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="item in StatusFlagOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="search.parent" label="父产品">
                <el-select
                  :popper-append-to-body="false"
                  collapse-tags
                  v-model="searchData.value3"
                  @change="selectAll"
                  placeholder="选择父sku"
                  style="min-width:300px"
                  clearable
                  size="small"
                  filterable
                  :multiple="true"
                >
                  <el-option v-for="item in options" :key="item.value" :label="item.country" :value="item.country"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="search.child" label="子产品">
                <el-select
                  :multiple="true"
                  v-loading="childLoading"
                  :popper-append-to-body="false"
                  @change="selectAll2"
                  filterable
                  v-model="searchData.value4"
                  placeholder="选择子sku"
                  style="min-width:400px"
                  collapse-tags
                  size="small"
                >
                  <el-option v-for="item in options6" :key="item.value" :label="item.state" :value="item.state"></el-option>
                </el-select>
              </el-form-item>
              <div class="__time">
                <el-form-item v-if="search.date" :label="search.timeText||'创建时间'">
                  <el-date-picker
                    v-model="searchData.date"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="__picker"
                    size="small"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
				<el-form-item v-if="search.pacDate" :label="search.timeText||'创建时间'">
				  <el-date-picker
				    v-model="searchData.date"
				    type="daterange"
				    unlink-panels
				    range-separator="至"
				    start-placeholder="开始日期"
				    end-placeholder="结束日期"
				    :picker-options="cfuns.pacPickerOptions"
				    size="small"
				    value-format="yyyy-MM-dd"
				  ></el-date-picker>
				</el-form-item>
                <el-form-item v-if="search.time11">
                  <el-date-picker
                    v-model="searchData.date"
                    type="daterange"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="__picker"
                    size="small"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <!-- todd -->
                <el-form-item v-if="search.onepstatus">
                  <el-select
                    v-model="searchData.status"
                    placeholder="状态"
                    :multiple="true"
                    collapse-tags
                    size="small"
                    style="width:150px;"
                  >
                    <el-option
                      v-for="item in pstatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      style="width:150px;"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="search.plist">
                  <el-select
                    v-model="searchData.problemTypes"
                    placeholder="问题类型"
                    :multiple="true"
                    collapse-tags
                    size="small"
                    style="width:300px;"
                    @change="typeMethod"
                  >
                    <el-option
                      v-for="item in plistOptions"
                      :key="item.problemType"
                      :label="item.problemName"
                      :value="item.problemType"
                      style="width:300px;"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="small"
                    type="primary"
                    @click="searchFun2"
                    :loading="searchLoading"
                    v-if="search.timeText"
										icon="el-icon-search"
                  >搜索</el-button>
                  <el-button size="small" type="primary" @click="searchFun" :loading="searchLoading" v-else icon="el-icon-search">搜索</el-button>
                  <el-button size="small" type="primary" plain @click="resetFun(search.timeText)" :loading="searchresLoading">重置搜索</el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
        </section>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import _chunk from 'lodash/chunk'
export default {
  components: {},
  inject: {
    getList: {
      default: null
    },
    clearSort: {
      default: null
    },
    dataShowFunc: {
      default: null
    },
	
  },
  props: {
    __picker: {
      default: () => {
        return {
          shortcuts: [
            {
              text: '今日',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 0)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '7天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '30天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        }
      }
    },
    // platformId: {
    //   default: 1
    // },
    siteId__: {
      default: null
    },
    text: {
      default: true
    },
    class_box: {
      default: true
    },
    box_query: {
      default: true
    },
    search: {
      type: Object
    },
    clearSearch: {
      type: Number
    },
    clearSort: {
      default: null
    },
    backFun: {
      default: null
    },
    clearfield: {
      default: () => []
    },
	activeName:{
		default:''
	}
  },
  data() {
    return {
      oldOptions: [],
      // options: [],
      // select_country: [],
      oldOptions6: [],
      // options6: [],
      // searchData.value6: [],
      // select_stateList: [],
      // 抓取状态
      StatusOptions: [
        {
          value: '1',
          label: '抓取中'
        },
        {
          value: '2',
          label: '抓取成功'
        },
        {
          value: '3',
          label: '抓取失败'
        }
      ],
      fbpFlagOptions: [
        {
          value: 0,
          label: '自发货'
        },
        {
          value: 1,
          label: 'FBS'
        }
        // {
        //   value: 2,
        //   label: "FBA+自发货"
        // }
      ],
      fbpFlagOptionsAmazon: [
        {
          value: 0,
          label: '自发货'
        },
        {
          value: 1,
          label: 'FBA'
        },
        {
          value: 2,
          label: "FBA+自发货"
        }
      ],
      // 标题卖点校验状态
      TitleOptions: [
        {
          value: 0,
          label: '未执行',
          disabled: false
        },
        {
          value: 1,
          label: '执行中',
          disabled: false
        },
        {
          value: 2,
          label: '执行失败',
          disabled: false
        },
        {
          value: 3,
          label: '执行成功',
          disabled: false
        }
      ],
      // end
      disabledStatus: null,
      // 后台校验状态
      BackstageOptions: [
        {
          value: 0,
          label: '未执行',
          disabled: false
        },
        {
          value: 1,
          label: '执行中',
          disabled: false
        },
        {
          value: 2,
          label: '执行失败',
          disabled: false
        },
        {
          value: 3,
          label: '执行成功',
          disabled: false
        }
      ],
      // end
      //   监控状态
      StatusFlagOptions: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 0,
          label: '关闭'
        }
      ],
      searchData: {
		value3: [],
		value4: [],
		// value5: [],
  //       value6: []
      },
      searchLoading: false,
      selectParentSkus: [],
      pstatusOptions: [
        {
          value: 1,
          label: '在售',
          disabled: false
        },
        {
          value: 2,
          label: '不可售',
          disabled: false
        }
      ],
      plistOptions: [
        {
          problemType: 1,
          problemName: 'FBA配送费不对'
        },
        {
          problemType: 2,
          problemName: '佣金不对'
        },
        {
          problemType: 3,
          problemName: '仓储费不对'
        },
        {
          problemType: 4,
          problemName: '客户退款未退货，亚马逊未赔偿'
        },
        {
          problemType: 5,
          problemName: '入库丢件亚马逊未赔偿'
        },
        {
          problemType: 6,
          problemName: '亚马逊损坏未赔偿'
        }
      ],
      childLoading: false,

      searchresLoading: false
    }
  },

  created() {
    // 回显sku的值
    // if (this.$route.name === 'SFM') {
    //   this.searchData.value6 = this.$store.state.common.selectChildSkus || []
    //   this.searchData.value5 = this.$store.state.common.selectParentSkus || []
    // }
  },
  mounted() {
    if (this.search.default) {
      let default1 = JSON.parse(JSON.stringify(this.search.default))
      this.$set(this.searchData, 'date', default1)
    }

    //如果传的有其他的默认的搜索条件
    if (this.search.otherDefault) {
      for(let k in this.search.otherDefault){
          this.$set(this.searchData, k, this.search.otherDefault[k])
      }
    }
  },
  methods: {
    typeMethod(e) {
      this.$emit('changeMethod', e)
    },
    async resetFun(text) {
      this.$emit('searchTrueData',{})
      if (text === '统计时间') {
        this.$store.commit('common/selectChildSkus', null)
        this.$store.commit('common/selectParentSkus', null)
		    this.searchData.value3 = []
        this.searchData.value4 = []
        
        this.searchData.parentSkus = null
        this.searchData.skus = null
        this.searchFun2()
        return
      }
      //console.log(this.clearfield);
      if (this.clearfield.length) {
        this.searchresLoading = true
        for (let k in this.clearfield) {
		      if(this.clearfield[k]==='category') this.$store.state.common.clearCate = []
          //console.log(k);
          let val = this.clearfield[k * 1]
          //console.log(val);
          if (this.searchData.hasOwnProperty(val)) {
            //console.log(val);
            if (Array.isArray(this.searchData[val])) {
              this.searchData[val] = []
              //时间传入的是default
              if (this.search.default) {
                let default1 = JSON.parse(JSON.stringify(this.search.default))
                this.$set(this.searchData, 'date', default1)
              }
            } else {
              this.searchData[val] = null
            }
          }
          //this.searchData[val]=null;
        }
        //自己加的
        this.$set(this.searchData, 'parentSkus', this.searchData.select_country)
        this.$set(this.searchData, 'skus', null)

        if (this.dataShowFunc) {
          this.dataShowFunc()
        }

        let result = await this.getList()
        if (result) {
          this.searchresLoading = false
          if (this.clearSort) {
            this.clearSort()
          }
        }
      }
    },
    // 选择父sku
    async selectAll(val) {
      // console.log(val);
      // 父子互斥，只要选了某一个，另一个清空，并把当前选择保存到vuex
      // this.selectCountryFun()
    },
    getChildSkus() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentSkus: this.searchData.select_country
      }
      return this.$api['ProductListSku'](params)
        .then(data => {
          // console.log('666665');
          // console.log(data);
          return data
        })
        .catch(err => {
          return []
          // console.log(err);
        })
    },
    getStates() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentSkus: this.searchData.select_country
      }
      // SalesShopDayDistOldCustCityDetail ProductListSku
      this.childLoading = true
      this.$api['ProductListSku'](params)
        .then(data => {
          this.childLoading = false
          // console.log(data, "child");
          if (!data.data) {
            this.$store.commit('common/childSkus', null)
          } else {
            this.searchData.select_stateList = []
            this.oldOptions6 = []
            this.searchData.value6 = []
            let arr = data.data
            this.$store.commit('common/childSkus', data.data)
            this.options6.forEach((item, index) => {
              this.searchData.value6.push(item.value)
              // 用于组成country数据
              this.oldOptions6.push(item.value)
            })
            // console.log(this.options6, "options6");
          }
        })
        .catch(err => {
          this.childLoading = false
          console.log(err)
        })
    },
    async selectCountryFun() {
      let arr_ = JSON.parse(JSON.stringify(this.searchData.value5))
      this.searchData.select_country = []
      arr_.forEach(item => {
        let result = this.options.find(el => el.value === item)
        if (result) {
          this.searchData.select_country.push(result.country)
        }
      })
      let result = await this.getChildSkus()
      this.$store.commit('common/selectChildSkus', result.data)

      this.$set(this.searchData, 'value6', [])

      //自己加的
      this.$set(this.searchData, 'parentSkus', this.searchData.select_country)
      this.$set(this.searchData, 'skus', null)

      this.searchData.select_stateList = result.data
      this.$store.commit(
        'common/selectParentSkus',
        this.searchData.select_country
      )
    },
    selectCountryFun2() {
      // console.log(this.options6, "options6");
      let arr_ = JSON.parse(JSON.stringify(this.searchData.value6))
      // if (arr_.includes("all")) {
      //   arr_.splice(0, 1);
      // }
      // 用于组成parent数据
      this.searchData.select_stateList = []
      arr_.forEach(item => {
        let result = this.options6.find(el => el.value === item)
        if (result) {
          // 用于复制数据
          this.searchData.select_stateList.push(result.state)
        }
      })

      this.$set(this.searchData, 'skus', this.searchData.select_stateList)
      //自己加的
      this.$set(this.searchData, 'parentSkus', null)

      // this.$set(this.searchData, 'value5', [])
      // delete this.searchData.value5;
      // this.$store.commit("common/selectParentSkus", null);
      this.$store.commit(
        'common/selectChildSkus',
        this.searchData.select_stateList
      )
      //this.$store.commit("common/selectParentSkus", null);

      // console.log(this.searchData.select_stateList, "select_stateList");
      // console.log(this.$store.state.common.childSkus, "common.childSku");
    },
    // 财务管理费用收支占比多选2
    async selectAll2(val) {
      this.selectCountryFun2()
    },
    async searchFun() {
      // console.log(this.searchData);
      let param = {
        pageSize: 10,
        pageNumber: 1,
        ...this.searchData
      }
      //console.log(param);
      this.$emit('searchTrueData',param)
      //delete param.flag
      //console.log(param);
      this.searchLoading = true
      let result = await this.getList(param)
      if (result) {
        this.searchLoading = false
        if (this.clearSort) {
          this.clearSort()
        }
      }
    },
    async searchFun2() {
      console.log(this.searchData)
      this.searchLoading = true
      let result = await this.getList({ ...this.searchData })
      if (result) {
        // this.$store.commit("common/parentSkus", this.parentSkus);
        // this.$store.commit("common/childSkus", null);
        this.$store.commit('common/isChildSku', false)
        this.searchLoading = false
      }
    },
    // 标题卖点校验状态选择
    // handleChangeTitleOptions(val) {
    //   // console.log(val);
    //   if (this.searchData.BackStatus) {
    //     this.searchData.BackStatus = []
    //   }
    //   let v = JSON.parse(JSON.stringify(val))
    //   if (v.length > 0) {
    //     if (v[0] === 0) {
    //       // this.disabledStatus = true;
    //       this.BackstageOptions = [
    //         {
    //           value: 0,
    //           label: '未执行',
    //           disabled: false
    //         },
    //         {
    //           value: 1,
    //           label: '执行中',
    //           disabled: true
    //         },
    //         {
    //           value: 2,
    //           label: '执行失败',
    //           disabled: true
    //         },
    //         {
    //           value: 3,
    //           label: '执行成功',
    //           disabled: true
    //         }
    //       ]
    //     } else if (v[0] === 1) {
    //       this.BackstageOptions = [
    //         {
    //           value: 0,
    //           label: '未执行',
    //           disabled: false
    //         },
    //         {
    //           value: 1,
    //           label: '执行中',
    //           disabled: true
    //         },
    //         {
    //           value: 2,
    //           label: '执行失败',
    //           disabled: true
    //         },
    //         {
    //           value: 3,
    //           label: '执行成功',
    //           disabled: true
    //         }
    //       ]
    //     } else if (v[0] === 2) {
    //       this.BackstageOptions = [
    //         {
    //           value: 0,
    //           label: '未执行',
    //           disabled: true
    //         },
    //         {
    //           value: 1,
    //           label: '执行中',
    //           disabled: false
    //         },
    //         {
    //           value: 2,
    //           label: '执行失败',
    //           disabled: false
    //         },
    //         {
    //           value: 3,
    //           label: '执行成功',
    //           disabled: false
    //         }
    //       ]
    //     } else if (v[0] === 3) {
    //       this.BackstageOptions = [
    //         {
    //           value: 0,
    //           label: '未执行',
    //           disabled: true
    //         },
    //         {
    //           value: 1,
    //           label: '执行中',
    //           disabled: true
    //         },
    //         {
    //           value: 2,
    //           label: '执行失败',
    //           disabled: true
    //         },
    //         {
    //           value: 3,
    //           label: '执行成功',
    //           disabled: true
    //         }
    //       ]
    //     }
    //   } else {
    //     // 左边为空，则还原右边disabled的
    //     // this.disabledStatus = false;
    //     this.BackstageOptions = [
    //       {
    //         value: 0,
    //         label: '未执行',
    //         disabled: false
    //       },
    //       {
    //         value: 1,
    //         label: '执行中',
    //         disabled: false
    //       },
    //       {
    //         value: 2,
    //         label: '执行失败',
    //         disabled: false
    //       },
    //       {
    //         value: 3,
    //         label: '执行成功',
    //         disabled: false
    //       }
    //     ]
    //   }
    // }
  },
  computed: {
    options() {
	  
      let parentSkus = this.$store.state.common.parentSkus
      let parentOptions = []
      if (!parentSkus) {
        return
      }
      parentSkus.forEach((item, index) => {
        parentOptions.push({
          value: index,
          country: item
        })
      })
      // console.log(
      //   this.$store.state.common.selectParentSkus,
      //   "selectParentSkus"
      // );
      return parentOptions
    },
    options6() {
      let childSkus = this.$store.state.common.childSkus
      let parentOptions = []
      if (!childSkus) {
        return
      }
      childSkus.forEach((item, index) => {
        parentOptions.push({
          value: index,
          state: item
        })
      })
      return parentOptions
    },
    parentSkus() {
      return this.$store.state.common.parentSkus
    },
    childSkus() {
      return this.$store.state.common.childSkus
    }
  },
  watch: {
//     options(val) {
//       if (this.$store.state.common.isChildSku) {
//         return
//       }
//       let value5 = []
//       val.forEach((el, index) => {
//         let selectParentSkus = this.$store.state.common.selectParentSkus
//         // console.log(selectParentSkus, "selectParentSkus");
//         if (selectParentSkus) {
//           selectParentSkus.forEach(item => {
//             if (el.country === item) {
//               value5.push(index)
//             }
//           })
//         }
//       })
//       // console.log(value5, "value5");
// 
//       //自己注释的
//       this.$set(this.searchData, "value5", value5);
//     },
    options6(val) {
      if (this.$store.state.common.isChildSku) {
        let childSkus_1 = this.$store.state.common.childSkus_1
        let value6 = []
        val.forEach((el, index) => {
          if (childSkus_1) {
            childSkus_1.forEach(item => {
              if (el.state === item) {
                value6.push(index)
              }
            })
          }
        })
        this.$set(this.searchData, 'value6', value6)
        return
      }
      let value6 = []
      val.forEach((el, index) => {
        let selectChildSkus = this.$store.state.common.selectChildSkus
        // console.log(selectChildSkus, "selectChildSkus");
        if (selectChildSkus) {
          selectChildSkus.forEach(item => {
            if (el.state === item) {
              value6.push(index)
            }
          })
        }
      })
      // console.log(value5, "value5");

      //自己注释的
      this.$set(this.searchData, "value6", value6);
    },
    // selectChildSkus: {
    //   handler() {
    //     if (!this.$store.state.common.selectParentSkus) {
    //       // this.searchData.value6 = this.$store.state.common.selectChildSkus;
    //       this.$set(
    //         this.searchData,
    //         "value6",
    //         this.$store.state.common.selectChildSkus
    //       );
    //     } else {
    //       this.$set(this.searchData, "value6", []);
    //       this.searchData.value5 = this.$store.state.common.selectParentSkus;
    //     }
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // searchData: {
    //   handler(newVal) {
    //     let result = this.cfuns.noValue(newVal)
    //     if (result === true) {
    //       this.searchFun()
    //     }
    //   },
    //   deep: true
    // },
    // 监听添加成功之后的清空状态，如果得到需要更新的提示，则请求新列表
    clearSearch(newVal) {
      let result = this.cfuns.noValue(this.searchData)
      if (result === true) {
        this.searchFun()
      } else {
        this.searchData = {}
      }
    }
  }
}
</script>

<style lang='less' scoped>
.box {
  min-width: 690px;
  .box-info {
    font-size: 12px;
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
    //padding: 15px;
    // border-left: 1px solid @borderColor;
    // border-right: 1px solid @borderColor;
    // border-bottom: 1px solid @borderColor;
    // .el-form--inline {
    //   height: 40px;
    // }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      .el-range-editor {
        width: 240px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
    }
  }
}
.__time {
  display: inline-block;
}
.parent {
  position: relative;
  /deep/.custom-collapse .el-collapse-item__header {
    justify-content: start;
  }
  .__backbtn {
    position: absolute;
    top: 10px;
    right: 27px;
  }
}
</style>

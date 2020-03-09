<template>
  <div>
    <v-form :model="ruleForm" v-if="showSimple" class="____multi_form custom__form" ref="ruleForm">
      <v-form-item label="SKU">
        <v-input placeholder="请输入SKU" v-model="ruleForm.sku">
          <v-select
            search
            v-model="skuType"
            ize="lg"
            slot="before"
            style="width: 90px;"
            :allowClear="false"
            :data="$attrs.select"
          ></v-select>
        </v-input>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input placeholder="请输入产品名称" v-model="ruleForm.name">
          <v-select
            :allowClear="false"
            v-model="productNamelanguage"
            style="width: 80px;"
            slot="before"
            :data="[{value: 1, label: '中文名称'}, {value: 2, label: '英文名称'}]"
          ></v-select>
        </v-input>
      </v-form-item>
      <!--  -->
      <v-form-item>
        <v-button type="primary" html-type="button" @click.prevent="search" style="margin-right:10px;">搜 索</v-button>
        <v-button @click="isMultiple = !isMultiple " style="margin-right:10px;">自定义筛选条件</v-button>
        <v-button v-if="isMultiple" @click.prevent="resetForm('ruleForm')" style="margin-right:10px;">清空搜索条件</v-button>
      </v-form-item>
      <!--  -->
      <el-collapse-transition>
        <div class="isMultiple" v-if="isMultiple">
          <v-form-item label="选择时间">
            <v-select search size="lg" v-model="timeType" style="width: 120px;" :data="timeList" :allowClear="false"></v-select>
            <el-date-picker
              size="small"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="ruleForm.date"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </v-form-item>
          <v-form-item label="是否需要拍照">
            <v-select
              search
              size="lg"
              v-model="ruleForm.photoFlag"
              :data="[{label:'是', value:1},{label:'否', value:0}]"
              style="width:100px"
            ></v-select>
          </v-form-item>
          <v-form-item label="选择仓库">
            <v-select
              search
              size="lg"
              v-model="ruleForm.warehouseId"
              style="width:100px"
              :data="dataList.warehouseList"
              label="warehouseName"
              clue="warehouseId"
            ></v-select>
          </v-form-item>
          <v-form-item label="预售属性">
            <v-select
              search
              size="lg"
              v-model="ruleForm.presellFlag"
              style="width:100px"
              :data="[{label:'是', value:1},{label:'否', value:0}]"
            ></v-select>
          </v-form-item>

          <v-form-item label="供应商">
            <!-- {{dataList.supplierList}} -->
            <v-select
              label="supplierName"
              clue="supplierId"
              search
              size="lg"
              v-model="ruleForm.supplierId"
              style="width:100px"
              :data="dataList.supplierList"
            ></v-select>
          </v-form-item>
          <v-form-item label="产品来源">
            <v-select
              search
              size="lg"
              placeholder="请选择产品来源"
              style="width: 185px;"
              :allowClear="false"
              v-model="ruleForm.sourceType"
              :data="productSourceList"
            ></v-select>
          </v-form-item>
          <v-form-item label="物流属性">
            <v-select
              search
              size="lg"
              v-model="ruleForm.logisticType"
              style="width:100px"
              :data="dataList.logisticList"
              label="value"
              clue="value"
            ></v-select>
          </v-form-item>
          <v-form-item label="侵权风险">
            <v-select
              search
              size="lg"
              v-model="ruleForm.riskType"
              style="width:100px"
              :data="dataList.productRiskList"
              label="value"
              clue="value"
            ></v-select>
          </v-form-item>
          <!-- <v-form-item label="是否有物流包材">
                    <v-select search size="lg" v-model="ruleForm.photoFlag" style="width:100px" :data="[{label:'是', value:1},{label:'否', value:0}]"></v-select>
          </v-form-item>-->
          <v-form-item label="开发人员">
            <v-select
              search
              size="lg"
              v-model="ruleForm.developId"
              style="width: 162px;"
              :data="dataList.developList"
              label="nickName"
              clue="userId"
            ></v-select>
          </v-form-item>
          <v-form-item label="采购人员">
            <v-select
              search
              size="lg"
              v-model="ruleForm.purchaseId"
              style="width: 185px;"
              :data="dataList.purchaseList"
              label="nickName"
              clue="userId"
            ></v-select>
          </v-form-item>

          <v-form-item label="产品类型">
            <v-select
              search
              size="lg"
              v-model="ruleForm.productType"
              style="width:100px"
              :data="dataList.productTypeList"
              label="value"
              clue="key"
            ></v-select>
          </v-form-item>
          <v-form-item label="产品品牌">
            <v-select
              search
              size="lg"
              v-model="ruleForm.brand"
              style="width:100px"
              :data="dataList.brandList"
              label="brandNameZh"
              clue="productBrandId"
            ></v-select>
          </v-form-item>
          <v-form-item label="是否支持海外仓">
            <v-select
              search
              size="lg"
              v-model="ruleForm.overseaFlag"
              style="width:100px"
              :data="[{label:'是', value:1},{label:'否', value:0}]"
            ></v-select>
          </v-form-item>
          <!--  -->
          <v-form-item label="产品尺寸">
            <v-select
              search
              size="lg"
              v-model="size"
              style="width:100px"
              :data="[{label:'长', value:1},{label:'宽', value:2},{label:'高', value:3}]"
            ></v-select>
          </v-form-item>
          <template v-if="size === 1">
            <v-form-item>
              <v-input v-model="ruleForm.singleLongStart" style="width:100px"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input v-model="ruleForm.singleLongEnd" style="width:100px"></v-input>
            </v-form-item>
          </template>
          <template v-if="size === 2">
            <v-form-item>
              <v-input v-model="ruleForm.singleWideStart" style="width:100px"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input v-model="ruleForm.singleWideEnd" style="width:100px"></v-input>
            </v-form-item>
          </template>
          <template v-if="size === 3">
            <v-form-item>
              <v-input v-model="ruleForm.singleHighStart" style="width:100px"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input v-model="ruleForm.singleHighEnd" style="width:100px"></v-input>
            </v-form-item>
          </template>
          <!--  -->
          <v-form-item label="产品重量">
            <v-select
              search
              size="lg"
              v-model="weight"
              style="width:100px"
              :data="[{label:'毛重', value:1},{label:'净重', value:2},{label:'包裹重', value:3}]"
            ></v-select>
          </v-form-item>
          <template v-if="weight === 1">
            <v-form-item>
              <v-input v-model="ruleForm.nwStart" style="width:100px"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input v-model="ruleForm.nwEnd" style="width:100px"></v-input>
            </v-form-item>
          </template>
          <template v-if="weight === 2">
            <v-form-item>
              <v-input v-model="ruleForm.gwStart" style="width:100px"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input v-model="ruleForm.gwEnd" style="width:100px"></v-input>
            </v-form-item>
          </template>
          <template v-if="weight === 3">
            <v-form-item>
              <v-input v-model="ruleForm.packageWeightStart" style="width:100px"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input v-model="ruleForm.packageWeightEnd" style="width:100px"></v-input>
            </v-form-item>
          </template>
          <!--  -->
          <v-form-item label="价格类型">
            <v-select
              search
              size="lg"
              v-model="priceType"
              style="width:100px"
              :data="[{label:'采购价', value:3},{label:'原价', value:1},{label:'现价', value:2},{label:'共享价', value:4}]"
            ></v-select>
          </v-form-item>
          <template v-if="priceType === 3">
            <v-form-item>
              <v-input type="text" v-model="ruleForm.purchasePriceStart" placeholder="采购起始价"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input type="text" v-model="ruleForm.purchasePriceEnd" placeholder="采购终止价"></v-input>
            </v-form-item>
          </template>
          <template v-if="priceType === 1">
            <v-form-item>
              <v-input type="text" v-model="ruleForm.originalPriceStart" placeholder="原价起始价"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input type="text" v-model="ruleForm.originalPriceEnd" placeholder="原价终止价"></v-input>
            </v-form-item>
          </template>
          <template v-if="priceType === 2">
            <v-form-item>
              <v-input type="text" v-model="ruleForm.nowPriceStart" placeholder="现价起始价"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input type="text" v-model="ruleForm.nowPriceEnd" placeholder="现价终止价"></v-input>
            </v-form-item>
          </template>
          <template v-if="priceType === 4">
            <v-form-item>
              <v-input type="text" v-model="ruleForm.sharePriceStart" placeholder="共享价起始价"></v-input>
            </v-form-item>
            <v-form-item>
              <v-input type="text" v-model="ruleForm.sharePriceEnd" placeholder="共享价终止价"></v-input>
            </v-form-item>
          </template>
        </div>
      </el-collapse-transition>
    </v-form>
  </div>
</template>

<script>
import { fetchData, showToast } from 'common/common'
import apis from 'apis'

export default {
  name: 'ytSimpleSearch',
  inheritAttrs: false,
  data: () => ({
    skuType: 1,
    productNamelanguage: 1,
    timeType: 1,

    isMultiple: false,
    size: 1,
    weight: 1,
    priceType: 1,

    showSimple: true,
    visible2: false,
    productSourceList: [
      {
        value: 1,
        label: '新样品'
      },
      {
        value: 2,
        label: '销售提报'
      },
      {
        value: 3,
        label: '平台采集'
      },
      {
        value: 4,
        label: '供应商审核'
      }
    ],
    timeList: [
      {
        value: 3,
        label: '创建时间'
      },
      {
        value: 1,
        label: '基础审核通过时间'
      },
      {
        value: 2,
        label: '采购审核通过时间'
      }
    ],
    dataList: {},
    ruleForm: {},
    pickerOptions: {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }
      ]
    }
  }),
  methods: {
    search() {
      if (!this.isMultiple) {
        let params = {}
        for (let key in this.ruleForm) {
          if (key == 'sku') {
            if (this.skuType == 1) params['sku'] = this.ruleForm[key]
            if (this.skuType == 2) params['skuCustom'] = this.ruleForm[key]
            continue
          }
          if (key == 'name') {
            if (this.productNamelanguage == 1)
              params['nameZh'] = this.ruleForm[key]
            if (this.productNamelanguage == 2)
              params['nameEn'] = this.ruleForm[key]
            continue
          }
          if (
            key == 'date' &&
            this.ruleForm[key] instanceof Array &&
            this.ruleForm[key].length
          ) {
            if (this.timeType == 3)
              params['createTimeStart'] = this.ruleForm.date[0]
            if (this.timeType == 3)
              params['createTimeEnd'] = this.ruleForm.date[1]
            if (this.timeType == 1 || this.timeType == 2) {
              params['operationType'] = this.timeType
              params['createTimeStart'] = this.ruleForm.date[0]
              params['createTimeEnd'] = this.ruleForm.date[1]
            }
            continue
          }
        }
        console.log(params)
        this.$emit('search', params)
      } else {
        let params = {}
        for (let key in this.ruleForm) {
          if (key == 'sku') {
            if (this.skuType == 1) params['sku'] = this.ruleForm[key]
            if (this.skuType == 2) params['skuCustom'] = this.ruleForm[key]
            continue
          }
          if (key == 'name') {
            if (this.productNamelanguage == 1)
              params['nameZh'] = this.ruleForm[key]
            if (this.productNamelanguage == 2)
              params['nameEn'] = this.ruleForm[key]
            continue
          }
          if (
            key == 'date' &&
            this.ruleForm[key] instanceof Array &&
            this.ruleForm[key].length
          ) {
            if (this.timeType == 3)
              params['createTimeStart'] = this.ruleForm.date[0]
            if (this.timeType == 3)
              params['createTimeEnd'] = this.ruleForm.date[1]
            if (this.timeType == 1 || this.timeType == 2) {
              params['operationType'] = this.timeType
              params['auditTimeStart'] = this.ruleForm.date[0]
              params['auditTimeEnd'] = this.ruleForm.date[1]
            }
            continue
          }
          //
          if (
            key == 'singleLongEnd' ||
            'singleLongStart' ||
            'singleWideEnd' ||
            'singleWideStart' ||
            'singleHighEnd'
          ) {
            if (this.size == 1) {
              params['singleLongEnd'] = this.ruleForm['singleLongEnd']
              params['singleLongStart'] = this.ruleForm['singleLongStart']
            } else if (this.size == 2) {
              params['singleWideEnd'] = this.ruleForm['singleWideEnd']
              params['singleWideStart'] = this.ruleForm['singleWideStart']
            } else if (this.size == 3) {
              params['singleHighStart'] = this.ruleForm['singleHighStart']
              params['singleHighEnd'] = this.ruleForm['singleHighEnd']
            }
          }
          //
          if (
            key == 'nwStart' ||
            'nwEnd' ||
            'gwStart' ||
            'gwEnd' ||
            'packageWeightStart' ||
            'packageWeightEnd'
          ) {
            if (this.weight == 1) {
              params['nwStart'] = this.ruleForm['nwStart']
              params['nwEnd'] = this.ruleForm['nwEnd']
            } else if (this.weight == 2) {
              params['gwStart'] = this.ruleForm['gwStart']
              params['gwEnd'] = this.ruleForm['gwEnd']
            } else if (this.weight == 3) {
              params['packageWeightStart'] = this.ruleForm['packageWeightStart']
              params['packageWeightEnd'] = this.ruleForm['packageWeightEnd']
            }
          }
          //
          if (
            key == 'originalPriceStart' ||
            'originalPriceEnd' ||
            'nowPriceStart' ||
            'nowPriceEnd' ||
            'purchasePriceStart' ||
            'purchasePriceEnd' ||
            'sharePriceEnd' ||
            'sharePriceStart'
          ) {
            if (this.priceType == 1) {
              params['originalPriceStart'] = this.ruleForm['originalPriceStart']
              params['originalPriceEnd'] = this.ruleForm['originalPriceEnd']
            } else if (this.priceType == 2) {
              params['nowPriceStart'] = this.ruleForm['nowPriceStart']
              params['nowPriceEnd'] = this.ruleForm['nowPriceEnd']
            } else if (this.priceType == 3) {
              params['purchasePriceStart'] = this.ruleForm['purchasePriceStart']
              params['purchasePriceEnd'] = this.ruleForm['purchasePriceEnd']
            } else if (this.priceType == 4) {
              params['sharePriceEnd'] = this.ruleForm['sharePriceEnd']
              params['sharePriceStart'] = this.ruleForm['sharePriceStart']
            }
          }
          params[key] = this.ruleForm[key]
        }
        console.log(params)

        this.$emit('search', params)
      }
    },
    getList() {
      fetchData({
        ...apis.PRODUCT_SEARCH_ITEM_LIST
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        this.dataList = res.data
        console.log(this.dataList)
      })
    },
    resetForm(formName) {
      // this.$nextTick(() => {
      //     this.$refs[formName].resetFields();
      // })
      for (let key in this.ruleForm) {
        this.ruleForm[key] = ''
      }
      this.$emit('search', this.ruleForm)
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style lang="scss">
.____multi_form {
  .ant-form-inline .ant-form-item {
    margin-bottom: 10px !important;
  }
  .ant-row {
    margin-bottom: 0 !important;
  }
  &.custom__form {
    .ant-row {
    margin-bottom: 10px !important;
  }
  }
}
</style>

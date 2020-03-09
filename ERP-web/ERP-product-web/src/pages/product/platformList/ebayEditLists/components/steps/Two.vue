<template>
  <ElForm
    :disabled="review"
    size="small"
    label-width="140px"
    ref="form"
    :model="data"
    :rules="rules"
    style="margin-right:40px"
  >
    <ElFormItem label="标题" prop="title">
      <el-input clearable v-model="data.title" placeholder></el-input>
    </ElFormItem>
    <ElFormItem prop="titleSub">
      <template slot="label">
        <span class="danger" style="margin-right:4px">$</span>副标题
        <el-tooltip
          popper-class="custom-tooltip"
          content="ebay需要收费$1.50，字幕在列表视图中显示在易趣搜索结果中，并且可以通过提供更多描述性信息来增加买家的兴趣。"
          placement="top"
        >
          <el-button type="text" icon="el-icon-info"></el-button>
        </el-tooltip>
      </template>
      <el-input clearable v-model="data.titleSub" placeholder></el-input>
    </ElFormItem>
    <ElFormItem v-if="isStoreVariant">
      <template slot="label">
        UPC
        <el-tooltip
          popper-class="custom-tooltip"
          content="买家经常使用商品标识符进行搜索，因此我们需要使用商品标识符来确保您的商家信息在买方搜索结果中具有最大可见。"
          placement="top"
        >
          <el-button type="text" icon="el-icon-info"></el-button>
        </el-tooltip>
      </template>
      <el-input maxlength="50" clearable v-model="data.upc" placeholder></el-input>
    </ElFormItem>
    <!-- 母体编辑 需要填变体的UPC 母体填不了，并且要展开 -->
    <div class="parent-box" v-if="isStoreParent">
      <ElFormItem>
        <template slot="label">
          UPC
          <el-tooltip
            popper-class="custom-tooltip"
            content="买家经常使用商品标识符进行搜索，因此我们需要使用商品标识符来确保您的商家信息在买方搜索结果中具有最大可见。"
            placement="top"
          >
            <el-button type="text" icon="el-icon-info"></el-button>
          </el-tooltip>
        </template>
        <el-input maxlength="50" clearable disabled></el-input>
      </ElFormItem>
      <template v-if="data.special">
        <ElFormItem v-for="item in data.special.UPC.propertyValue">
          <template slot="label">
            <div :title="item.skuStore" class="text-el">{{item.skuStore}}</div>
          </template>
          <el-input :maxlength="data.special.UPC.dataMaxLength" clearable v-model="item.value"></el-input>
        </ElFormItem>
      </template>
    </div>

    <ElFormItem prop="conditionType">
      <template slot="label">
        条件
        <el-tooltip popper-class="custom-tooltip" content="选择您要列出的项目的条件" placement="top">
          <el-button type="text" icon="el-icon-info"></el-button>
        </el-tooltip>
      </template>
      <el-select clearable v-model="data.conditionType" placeholder style="width:100%">
        <el-option v-for="item in conditions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </ElFormItem>
    <ElFormItem prop="conditionInfo">
      <template slot="label">
        条件说明
        <el-tooltip popper-class="custom-tooltip" content="提供有关非新项目状况的详细信息，包括任何缺陷或缺陷，以便买家确切知道预期的内容" placement="top">
          <el-button type="text" icon="el-icon-info"></el-button>
        </el-tooltip>
      </template>
      <el-input clearable v-model="data.conditionMore" type="textarea" :rows="5" placeholder></el-input>
    </ElFormItem>
    <!-- <ElFormItem prop="saleType" label="销售类型">
      <el-select v-model="data.salesType" placeholder style="width:100%">
        <el-option v-for="item in saleTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </ElFormItem>-->

    <ElFormItem label="持续时间">
      <ElFormItem prop="salesDays">
        <el-select clearable v-model="data.salesDays" placeholder style="width:100%">
          <el-option v-for="item in durationTimes" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </ElFormItem>
      <!-- <div>
        <ElFormItem>
          <el-radio v-model="data.salesStrategyType" :label="1">我提交时会开始我的列表</el-radio>
          <el-radio v-model="data.salesStrategyType" :label="2">安排开始</el-radio>
        </ElFormItem>
        <template v-if="data.salesStrategyType === 2">
          <ElFormItem prop="salesTime">
            <el-date-picker type="datetime" value-format="yyyy-MM-dd hh:mm:ss" class="marright10" v-model="data.salesTime" placeholder></el-date-picker>太平洋夏令时
          </ElFormItem>
        </template>
      </div>-->
      <div>
        <el-checkbox v-model="data.shelfStrategy" :true-label="1" :false-label="0">开启下架后立即上架</el-checkbox>
      </div>
    </ElFormItem>
    <ElFormItem label="价格">
      <ElRow>
        <ElCol :span="24" class="flex">
          <ElFormItem label="起始价" label-width="50px">
            <div class="flex">
              <span class="marright10">$</span>
              <ElInputNumber
                :controls="false"
                :min="0.01"
                :precision="2"
                @change="val => data.startingPrice = val"
                :value="data.startingPrice || undefined"
              ></ElInputNumber>
            </div>
          </ElFormItem>
          <ElFormItem label="立即购买价" label-width="90px">
            <div class="flex">
              <span class="marright10">$</span>
              <ElInputNumber
                :controls="false"
                :min="0.01"
                :precision="2"
                @change="val => data.buyNowPrice = val"
                :value="data.buyNowPrice || undefined"
              ></ElInputNumber>
            </div>
          </ElFormItem>
          <ElFormItem label="保留价格" label-width="80px">
            <div class="flex">
              <span class="marright10">$</span>
              <ElInputNumber
                :controls="false"
                :min="0.01"
                :precision="2"
                @change="val => data.reserveRprice = val"
                :value="data.reserveRprice || undefined"
              ></ElInputNumber>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElFormItem>
    <ElFormItem prop="num" label="数量" v-if="isStoreVariant">
      <el-input-number
        style="width:400px"
        :min="1"
        :controls="false"
        :max="99999999999"
        v-model="data.selasInventory"
        clearable
      ></el-input-number>
    </ElFormItem>

    <!-- 母体编辑 需要填变体的UPC 母体填不了，并且要展开 -->
    <div class="parent-box" v-if="isStoreParent">
      <ElFormItem label="数量">
        <el-input-number style="width:400px" :min="1" :controls="false" :max="99999999999" clearable disabled></el-input-number>
      </ElFormItem>
      <ElFormItem v-for="item in data.special['Selas Inventory'].propertyValue">
        <template slot="label">
          <div :title="item.skuStore" class="text-el">{{item.skuStore}}</div>
        </template>
        <el-input-number
          style="width:400px"
          :min="1"
          :controls="false"
          :max="99999999999"
          clearable
          v-model="item.value"
        ></el-input-number>
      </ElFormItem>
    </div>
    <ElFormItem label>
      <div class="mt10">
        <el-checkbox v-model="data.bargainingFlag" :true-label="1" :false-label="0">议价，让买家提供优惠。灵活应对价格可能有助于您的商品销售更快</el-checkbox>
      </div>
      <div class="mt10">
        <el-checkbox v-model="data.bargainingLeastFlag" :true-label="1" :false-label="0">
          自动接受至少的报价 $
          <!-- <el-input clearable v-model="data.bargainingLeastPrice" placeholder></el-input> -->
          <ElInputNumber
            :controls="false"
            :min="0.01"
            :precision="2"
            @change="val => data.bargainingLeastPrice = val"
            :value="data.bargainingLeastPrice || undefined"
          ></ElInputNumber>
        </el-checkbox>
      </div>
      <div class="mt10">
        <el-checkbox v-model="data.bargainingBelowFlag" :true-label="1" :false-label="0">
          自动拒绝低于的报价 $
          <!-- <el-input v-model="data.bargainingBelowPrice" placeholder></el-input> -->
          <ElInputNumber
            :controls="false"
            :min="0.01"
            :precision="2"
            @change="val => data.bargainingBelowPrice = val"
            :value="data.bargainingBelowPrice || undefined"
          ></ElInputNumber>
        </el-checkbox>
      </div>
    </ElFormItem>
    <ElFormItem label="MSRP">
      <div class="flex">
        <el-select clearable class="mr10" v-model="data.msrpCurrency" placeholder style="width:200px">
          <el-option v-for="item in msrpCurrencyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- <ElInput v-model="data.retailPrice"></ElInput> -->
        <ElInputNumber
          :controls="false"
          :min="0.01"
          :precision="2"
          @change="val => data.retailPrice = val"
          :value="data.retailPrice || undefined"
        ></ElInputNumber>
      </div>
    </ElFormItem>
    <ElFormItem>
      <template slot="label">
        私人上市
        <el-tooltip popper-class="custom-tooltip" content="保持投标人和买家身份对公众隐藏" placement="top">
          <el-button type="text" icon="el-icon-info"></el-button>
        </el-tooltip>
      </template>
      <ElCheckbox v-model="data.privateUpFlag" :true-label="1" :false-label="0">允许买家对其他易趣用户保持匿名</ElCheckbox>
    </ElFormItem>
    <!-- <ElFormItem label="捐献">
      <ElCheckbox v-model="data.donateFlag" :true-label="1" :false-label="0">将您销售的一定比例捐赠给您选择的慈善机构，我们将为您销售物品的基本销售费用</ElCheckbox>
    </ElFormItem>-->
  </ElForm>
</template>

<script>
import apis from 'apis'
import { fetchData, showToast, handlerCode } from 'common/common'
import mixins from './mixins'

export default {
  // props: ['data', 'productPltDetailId', 'platformId', 'parentFlag'],
  mixins: [mixins],
  data() {
    return {
      rules: {
        title: [
          {
            required: true,
            message: '请填写标题'
          }
        ],
        upc: [
          {
            required: true,
            message: '请填写UPC'
          }
        ],
        conditionType: [
          {
            required: true,
            message: '请选择条件'
          }
        ],
        salesDays: [
          {
            required: true,
            message: '请选择持续时间'
          }
        ],
        salesStrategyType: [
          {
            required: true,
            message: '请选择开始条件'
          }
        ],
        salesTime: [
          {
            required: true,
            message: '请填写开始时间'
          }
        ]
      },
      // MSRP货币 list
      msrpCurrencyList: [
        {
          label: '美元USD',
          value: 'usd'
        }
      ],
      durationTimes: [
        {
          label: '3天',
          value: 3
        },
        {
          label: '5天',
          value: 5
        },
        {
          label: '7天',
          value: 7
        },
        {
          label: '10天',
          value: 10
        },
        {
          label: '30天',
          value: 30
        },
        {
          label: '好Til取消',
          value: 0
        }
      ],
      saleTypes: [
        {
          label: '拍卖价',
          value: 1
        },
        {
          label: '一口价',
          value: 2
        }
      ],
      conditions: [
        {
          label: 'new with tagd',
          value: 'new with tagd'
        },
        {
          label: 'new without tagd',
          value: 'new without tagd'
        },
        {
          label: 'new with defects',
          value: 'new with defects'
        },
        {
          label: 'pre-owned',
          value: 'pre-owned'
        }
      ],
      groupCode: 0
    }
  },
  computed: {
    isStoreVariant() {
      return this.productPltDetailId == null && this.productType
    },
    isStoreParent() {
      return this.productPltDetailId == null && !this.productType
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    validate(cb) {
      return this.$refs.form.validate(cb)
    },
    save() {
      // debugger
      let dataMap = { ...this.data }
      if (this.isStoreParent) {
        dataMap.general = Object.values(this.data.special)
        delete dataMap.special
      }

      let data = {
        groupCode: this.groupCode,
        platformId: this.platformId,
        productPltDetailId: this.productPltDetailId,
        dataMap
      }
      this.saveData(data)
    },
    // 一次性获取下拉
    getAllList() {
      let selects = [
        // {
        //   propertyName: 'saleType',
        //   listName: 'saleTypes'
        // },
        {
          propertyName: 'salesDays',
          listName: 'durationTimes'
        },
        {
          propertyName: 'msrpCurrency',
          listName: 'msrpCurrencyList'
        },
        {
          propertyName: 'conditionType',
          listName: 'conditions'
        }
      ]
      Promise.all(selects.map(el => this.getSelectList(el))).catch(() => {
        showToast('error', '初始化数据失败， 请刷新重试')
      })
    },
    // 获取单个下拉取值
    getSelectList({ propertyName, listName }) {
      return fetchData({
        ...apis.saleEbayProItemSaleEbayProItem,
        data: { propertyName }
      }).then(res => {
        this[listName] = res.data.data.map(el => ({
          label: el.name,
          value: el.id
        }))
      })
    }
  }
}
</script>

<style lang='less' scoped>
.parent-box {
  border: 2px dotted #ddd;
  padding: 20px 20px 0 0;
  border-radius: 5px;
  margin-bottom: 20px;
}
</style>

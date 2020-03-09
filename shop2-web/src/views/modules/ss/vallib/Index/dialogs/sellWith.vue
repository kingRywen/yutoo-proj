<template>
  <div class="w1200">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <div class="mb20">
      <b>【温馨提示】</b>非平台采购的库存、采购价，都>0时，系统将会优先销售。请留意设置运费。
    </div>
    <el-form ref="form1" size="mini" :model="sellingInfo">
      <el-table stripe border size="mini" class="custom-eltable" :data="sellingInfo.list">
        <el-table-column label="ASIN" prop="asin"></el-table-column>
        <el-table-column label="主图" :width="70">
          <template slot-scope="scope">
            <el-tooltip placement="right" effect="light">
              <div slot="content" class="flex" style="align-items: flex-start;">
                <div class="__img_wrapper mar-auto mr10" style="width: 200px;height:200px">
                  <img class="loadingImg" v-lazy="scope.row.imageUrl" />
                </div>
                <a
                  style="max-width: 300px"
                  :href="storeUrls.asinUrl + scope.row['asin']"
                  target="_blank"
                >{{scope.row.title || '-'}}</a>
              </div>
              <div class="__img_wrapper mar-auto mr10" style="width: 45px;height:45px">
                <img class="loadingImg" v-lazy="scope.row.imageUrl" />
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="品牌名" prop="brand" show-overflow-tooltip></el-table-column>
        <el-table-column label="源站点" prop="srcSiteName" width="80"></el-table-column>
        <el-table-column label="固定售价">
          <template slot-scope="scope">
            <el-form-item
              :key="scope.$index + 'fixedPrice'"
              :rules="notEmpty"
              :prop="`list.${scope.$index}.fixedPrice`"
            >
              <el-input-number
                class="w100"
                v-model="scope.row.fixedPrice"
                :controls="false"
                :min="0.01"
                :precision="2"
                :max="99999999999"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="localStockQty">
          <template slot="header" slot-scope="scope">
            <div>
              库存
              <ElTooltip content="非平台库存" placement="top">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <div>
              采购价(美元)
              <ElTooltip content="非平台采购价" placement="top">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <el-form-item
              :key="scope.$index + 'purchasePrice'"
              :rules="notEmpty"
              :prop="`list.${scope.$index}.purchasePrice`"
            >
              <el-input-number
                class="w100"
                v-model="scope.row.purchasePrice"
                :controls="false"
                :min="0.01"
                :precision="2"
                :max="99999999999"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <div>
              运费(美元)
              <ElTooltip content="非平台采购运费" placement="top">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <el-form-item :key="scope.$index + 'fare'" :rules="notEmpty" :prop="`list.${scope.$index}.fare`">
              <el-input-number
                class="w100"
                v-model="scope.row.fare"
                :controls="false"
                :min="0.01"
                :precision="2"
                :max="99999999999"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="成本价-指定卖家">
          <template slot-scope="scope">
            <el-form-item :rules="notEmpty" v-if="scope.row.sellers" :prop="`list.${scope.$index}.fixedSeller`">
              <el-select v-model="scope.row.fixedSeller" placeholder>
                <el-option
                  v-for="(item, index) in scope.row.sellers"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="成本价-指定发货方式" :width="150">
          <template slot-scope="scope">
            <el-form-item :rules="notEmpty" :prop="`list.${scope.$index}.fixedFbpFlag`">
              <el-select v-model="scope.row.fixedFbpFlag" placeholder>
                <el-option label="FBA" :value="0"></el-option>
                <el-option label="FBM" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-button type="text" @click="sellingInfo.list.splice(scope.$index, 1)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['curSiteId', 'getStoreList', 'sel'],
  data() {
    return {
      formSchema: {
        siteId: {
          label: '源站点',
          span: 12,
          widget: 'select',
          disabled: true,
          bind: {
            label: 'siteName',
            value: 'siteId'
          },
          options: this.$store.getters['storeInfo/currentPlat'].sites
        },
        sellerIds: {
          label: '店铺名称',
          required: true,
          span: 12,
          multi: true,
          widget: 'select',
          options: () => this.getStoreList()
        },
        inventoryStrategyId: {
          label: '库存策略',
          required: true,
          span: 12,
          widget: 'select',
          options: []
        },
        priceStrategyId: {
          label: '价格策略',
          required: true,
          span: 12,
          widget: 'select',
          options: []
        },
        cntStrategyId: {
          label: '数量策略',
          required: true,
          span: 12,
          widget: 'select',
          options: []
        },
        timeStrategyId: {
          label: '时间策略',
          required: true,
          span: 12,
          widget: 'select',
          options: []
        },
        frequencyStrategyId: {
          label: '频率策略',
          required: true,
          span: 12,
          widget: 'select',
          options: []
        }
      },
      sellingInfo: {
        list: [...this.sel]
      },
      value: {
        siteId: this.curSiteId
      },
      notEmpty: [
        {
          required: true,
          message: '不能为空'
        }
      ]
    }
  },
  created() {
    this.getStras()
    this.sellingInfo.list.forEach(el => {
      this.getSellers(el.asin).then(data => {
        this.$set(el, 'sellers', data)
      })
    })
  },
  methods: {
    getSellers(asin) {
      const params = {
        ...this.storeInfo,
        srcSiteId: this.curSiteId,
        asin
      }
      return this.$api[`ss/sellingSellerAllList`](params).then(data => {
        return data.data.map(el => ({
          label: el.sellerName,
          value: el.sellerId
        }))
      })
    },
    getStras() {
      let params = {
          ...this.storeInfo,
          pageSize: 1,
          pageNumber: 10000
        },
        vm = this

      this.$api[`ss/sellingStrategyList`](params).then(data => {
        let list = data.rows.map(e => ({
            label: e.strategyName,
            value: e.strategyId,
            strategyType: e.strategyType,
            defaultFlag: e.defaultFlag
          })),
          cur
        vm.formSchema.inventoryStrategyId.options = list.filter(
          e => e.strategyType == 0
        )
        vm.formSchema.priceStrategyId.options = list.filter(
          e => e.strategyType == 1
        )
        vm.formSchema.cntStrategyId.options = list.filter(
          e => e.strategyType == 2
        )
        vm.formSchema.timeStrategyId.options = list.filter(
          e => e.strategyType == 3
        )
        vm.formSchema.frequencyStrategyId.options = list.filter(
          e => e.strategyType == 4
        )

        vm.value = {
          ...vm.value,
          inventoryStrategyId:
            (cur = vm.formSchema.inventoryStrategyId.options.find(
              e => e.defaultFlag
            )) && cur.value,
          priceStrategyId:
            (cur = vm.formSchema.priceStrategyId.options.find(
              e => e.defaultFlag
            )) && cur.value,
          cntStrategyId:
            (cur = vm.formSchema.cntStrategyId.options.find(
              e => e.defaultFlag
            )) && cur.value,
          timeStrategyId:
            (cur = vm.formSchema.timeStrategyId.options.find(
              e => e.defaultFlag
            )) && cur.value,
          frequencyStrategyId:
            (cur = vm.formSchema.frequencyStrategyId.options.find(
              e => e.defaultFlag
            )) && cur.value
        }
      })
    },
    validate() {
      return Promise.all([
        this.$refs.form.validate(),
        this.$refs.form1.validate()
      ])
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.storeInfo,
          ...this.value,
          sellingInfo: this.sellingInfo.list,
          op: 0
        }
        return this.$api[`ss/sellingSaveLib`](params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.w1100 {
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0;
  }
}
</style>
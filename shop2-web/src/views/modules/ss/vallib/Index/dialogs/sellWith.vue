<template>
  <div class="w1200">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <div class="mb20 import">
      <b>【温馨提示】</b>非平台采购的库存、采购价，都>0时，系统将会优先销售。请留意设置运费。
    </div>
    <el-form ref="form1" size="mini" :model="sellingInfo">
      <el-table stripe border size="mini" class="custom-eltable" :data="sellingInfo.list">
        <el-table-column label="ASIN" prop="asin"></el-table-column>
        <el-table-column label="父ASIN" prop="parentAsin"></el-table-column>
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
        <el-table-column label="固定售价" key="pricing" v-if="strageInfo.pricing">
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
        <el-table-column key="localStockQty" prop="localStockQty">
          <template slot="header" slot-scope="scope">
            <div>
              库存
              <ElTooltip content="非平台库存" placement="top">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column key="purchasePrice">
          <template slot="header" slot-scope="scope">
            <div>
              采购价(美元)
              <ElTooltip content="非平台采购价" placement="top">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <!-- <el-form-item
              :key="scope.$index + 'purchasePrice'"
              :rules="notEmpty"
              :prop="`list.${scope.$index}.purchasePrice`"
            >-->

            <el-form-item :key="scope.$index + 'purchasePrice'">
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
        <el-table-column key="fare">
          <template slot="header" slot-scope="scope">
            <div>
              运费(美元)
              <ElTooltip content="非平台采购运费" placement="top">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
          </template>
          <template slot-scope="scope">
            <!-- <el-form-item :key="scope.$index + 'fare'" :rules="notEmpty" :prop="`list.${scope.$index}.fare`"> -->
            <el-form-item :key="scope.$index + 'fare'">
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
        <el-table-column key="fixedSiteId" :width="150" label="成本价-指定站点采购" v-if="strageInfo.purchaseObject">
          <template slot-scope="scope">
            <el-form-item :rules="notEmpty" :prop="`list.${scope.$index}.fixedSiteId`">
              <el-select v-model="scope.row.fixedSiteId" @change="getSellers(scope.row, $event)">
                <el-option
                  v-for="(item, index) in siteTypes.slice(0, curSiteId == scope.row.srcSiteId ? 1 :2)"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column key="fixedSeller" label="成本价-指定卖家采购" v-if="strageInfo.purchaseObject" :width="150">
          <template slot-scope="scope">
            <el-form-item :rules="notEmpty" :prop="`list.${scope.$index}.fixedSeller`">
              <el-select :disabled="!scope.row._loading" v-model="scope.row.fixedSeller">
                <el-option
                  v-for="(item, index) in scope.row.sellers ||[]"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="sellingInfo.list.length > 1" width="60">
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
      siteTypes: [
        {
          label: '源站点',
          value: 0
        },
        {
          label: '目标站点',
          value: 1
        }
      ],
      hasStrag: {},
      strageInfo: {
        purchaseObject: null,
        pricing: null
      },
      formSchema: {
        siteId: {
          label: '站点',
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
          placeholder: '请选择店铺',
          widget: 'select',
          options: () => this.getStoreList({ fareTempFlag: true })
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
          change: data => {
            if (this.hasStrag[data.priceStrategyId]) {
              this.strageInfo = this.hasStrag[data.priceStrategyId]
              return
            }
            this.getStraInfo(data.priceStrategyId, 1)
          },
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
        }
        // frequencyStrategyId: {
        //   label: '频率策略',
        //   required: true,
        //   span: 12,
        //   widget: 'select',
        //   options: []
        // }
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
  },
  methods: {
    getSellers(row, val) {
      const { asin, srcSiteId } = row
      const params = {
        ...this.storeInfo,
        deliverySiteId: this.curSiteId,
        siteId: srcSiteId,
        // srcSiteId: this.curSiteId,
        asin
      }
      this.$set(row, '_loading', false)
      return this.$api[`ss/sellingSellerAllList`](params).then(data => {
        row._loading = true
        this.$set(
          row,
          'sellers',
          data.data &&
            data.data.map(el => ({
              label: el.sellerName,
              value: el.sellerId
            }))
        )
      })
    },
    getStraInfo(strategyId) {
      const params = {
        ...this.storeInfo,
        siteId: this.curSiteId,
        strategyId
      }
      this.$api[`ss/sellingStrategyInfoByPrice`](params).then(data => {
        this.strageInfo = data.data
        this.hasStrag[strategyId] = data.data
      })
    },
    getStras() {
      let params = {
          ...this.storeInfo,
          siteId: this.curSiteId,
          pageSize: 10000,
          pageNumber: 1
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
        // vm.formSchema.frequencyStrategyId.options = list.filter(
        //   e => e.strategyType == 4
        // )

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
            )) && cur.value
          // frequencyStrategyId:
          //   (cur = vm.formSchema.frequencyStrategyId.options.find(
          //     e => e.defaultFlag
          //   )) && cur.value
        }
        this.getStraInfo(vm.value.priceStrategyId)
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
          siteId: this.curSiteId,
          sellingInfo: this.sellingInfo.list.map(e => ({
            asin: e.asin,
            srcSiteId: e.srcSiteId,
            purchasePrice: e.purchasePrice,
            fare: e.fare,
            fixedPrice: e.fixedPrice,
            fixedSeller: e.fixedSeller,
            fixedSiteId: e.fixedSiteId ? this.curSiteId : e.srcSiteId
          })),
          op: 0
        }
        return this.$api[`ss/sellingSaveLib`](params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.w1200 {
  /deep/ .el-form-item--mini.el-form-item {
    margin-bottom: 0;
  }
}
</style>
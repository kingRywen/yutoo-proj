<template>
  <div>
    <First
      v-show="active == 0"
      ref="form0"
      :params="params"
      :validSuccess.sync="validSuccess[0]"
      :value.sync="value.first"
    />
    <Second v-show="active == 1" ref="form1" :params="params" :validSuccess.sync="validSuccess[1]" />
    <Third v-show="active == 2" ref="form2" :params="params" :productPlatIds="value.first.variants" :validSuccess.sync="validSuccess[2]" />

    <Fourth v-show="active == 3" ref="form3" :params="params" :validSuccess.sync="validSuccess[3]" />
    <div class="txc mt10">
      <ElButton type="primary" @click="prev" v-if="active !== 0">上一步</ElButton>
      <ElButton type="primary" @click="next" v-if="active <=2" :disabled="validSuccess[active] === false">下一步</ElButton>
      <ElButton type="primary" @click="submit" v-if="active == 3" :disabled="validSuccess[active] === false">提交</ElButton>
    </div>
  </div>
</template>
<script>
import First from './first'
import Second from './second'
import Third from './third'
import Fourth from './fourth'
export default {
  components: {
    First,
    Second,
    Third,
    Fourth
  },
  created() {
    let { productPlatId, platSiteId } = this.$route.query
    this.productPlatId = +productPlatId
    this.platSiteId = +platSiteId
  },
  data() {
    return {
      skuRuleShow: false,
      value: {
        first: {
          toSellAsins: [],
          stores: [42132585.42101598],
          variants: [1],
          saleType: 1,
          putawayType: 0
        },
        second: {}
      },
      active: 0,
      validSuccess: [false, false, false, false],
      productPlatId: null,
      platSiteId: null
    }
  },
  computed: {
    params() {
      return {
        productPlatId: this.productPlatId,
        platSiteId: this.platSiteId,
        saleType: this.value.first.saleType,
        putawayType: this.value.first.putawayType
      }
    }
  },
  methods: {
    isSkuRuleShow() {
      let params = { storeIds: this.value.first.stores }
      return this.$api[`product/platProductSkuRuleShowFlag`](params).then(
        data => {
          this.skuRuleShow = data.showFlag
          return data.showFlag
        }
      )
    },
    async next() {
      let params
      if (this.active == 0) {
        // 判断是否要显示sku规则页
        let isShow = await this.isSkuRuleShow()
        // console.log(isShow)
        if (isShow) {
          this.active++
        } else {
          this.active = this.active + 2
        }
      } else {
        if (this.active == 1) {
          params = this.$refs.form1.formData.stores
        } else if (this.active == 2) {
          params = this.$refs.form2.formData.stores
        }
        this.active++
      }
      this.$refs[`form${this.active}`].init(params)
    },
    submit() {
      const {
        productPlatId,
        platSiteId,
        value: {
          first: { putawayType, saleType, toSellAsins }
        }
      } = this
      let {
        storeDiffs,
        variantDiffs,
        storeSchema,
        varSchema
      } = this.$refs.form3
      let storeDifferencePropertys = [],
        variantDifferencePropertys = {}
      // 店铺差异
      if (this.params.saleType == 1) {
        storeDiffs.table.forEach(element => {
          let propertys = []
          let head = storeSchema.table.head
          for (const key in head) {
            if (head.hasOwnProperty(key)) {
              propertys.push({
                propertyId: +key,
                propertyType: head.propertyType,
                propertyValue: element[key]
              })
            }
          }
          let el = {
            storeId: element.storeId,
            propertys
          }
          storeDifferencePropertys.push(el)
        })
      }

      // 店铺变体差异
      variantDiffs.table.forEach(element => {
        let cur = variantDifferencePropertys[element.productPlatId]
        if (!cur) {
          cur = variantDifferencePropertys[element.productPlatId] = {
            productPlatId: element.productPlatId,
            stores: []
          }
        }
        let propertys = []
        let head = varSchema.table.head
        for (const key in head) {
          if (head.hasOwnProperty(key)) {
            propertys.push({
              propertyId: key,
              propertyType: head.propertyType,
              propertyValue: element[key]
            })
          }
        }
        cur.stores.push({
          storeId: element.storeId,
          sellerSku: element.sellerSku,
          propertys
        })
      })
      variantDifferencePropertys = Object.values(variantDifferencePropertys)
      let stores = this.$refs.form2.formData.stores.map(el => {
        const { storeId, sellerSku, sellerTitle, platSkus } = el
        let ret = { storeId, sellerSku, sellerTitle }
        ret.platSkus = platSkus.map(e => {
          const { productPlatId, sellerSku, sellerTitle } = e
          return { productPlatId, sellerSku, sellerTitle }
        })
        return ret
      })
      let params = {
        productPlatId,
        platSiteId,
        storeDifferencePropertys,
        variantDifferencePropertys,
        stores,
        putawayType,
        saleType,
        toSellAsins: saleType !== 0 ? [] : toSellAsins
      }
      console.log(params)

      this.$api[`product/platProductSubmit`](params).then(() => {
        this.$confirm('恭喜您，提交成功，商品进入店铺待审核列表！', '提示', {
          confirmButtonText: '返回列表',
          cancelButtonText: '前往店铺产品查看',
          type: 'success'
        }).then(() => {
          this.$router.go(-1)
        }).catch(() => {
          this.$router.push('/product/amazon/storeProduct')
        });
      })
    },
    prev() {
      if (this.active == 2) {
        if (!this.skuRuleShow) {
          this.active = this.active - 2
        } else {
          this.active--
        }
      } else {
        this.active--
      }
    }
  }
}
</script>
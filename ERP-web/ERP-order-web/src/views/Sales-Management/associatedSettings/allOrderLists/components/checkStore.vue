<template>
  <div v-loading="loading">
    <el-button type="success" icon="el-icon-refresh" size="small" class="mb10" @click="refresh">刷新重试</el-button>
    <el-table :data="data" border stripe class="mb10">
      <el-table-column label="收货仓库" align="center">
        <template slot-scope="scope">
          <div>
            {{scope.row.checkObject.destinationFulfillmentCenterId}}
            <!-- <i class="el-icon-info"></i> -->
            <el-tooltip placement="top" effect="light">
              <div slot="content" class="tooltip-content">
                <!-- addressLine1: "21 Roadway Drive"
                  addressLine2: null
                  city: "Carlisle"
                  countryCode: "US"
                  districtOrCounty: null
                  name: "Amazon.com.dedc LLC"
                  orderAmzonCheckAddressId: 38
                  orderAmzonCheckId: 19
                  orderId: 226
                  postalCode: "17015-8806"
                stateOrProvinceCode: "PA"-->
                <p>地址1：{{scope.row.address.addressLine1}}</p>
                <p>地址2：{{scope.row.address.addressLine2}}</p>
                <p>城市：{{scope.row.address.city}}</p>
                <p>国家代码：{{scope.row.address.countryCode}}</p>
                <p>名字：{{scope.row.address.name}}</p>
                <p>邮编：{{scope.row.address.postalCode}}</p>
                <p>城市代码：{{scope.row.address.stateOrProvinceCode}}</p>
              </div>
              <el-button type="text" icon="el-icon-info"></el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="产品">
        <template slot-scope="scope">
          <div style="display:flex">
            <div v-for="(item) in scope.row.products" class="flex1" :key="item.id">
              <div class="flex">
                <div class="__img_wrapper">
                  <img class="loadingImg" v-lazy="item.productImg">
                </div>
                <span class="sku">{{item.storeSku}}</span>
                <span class="num">{{item.quantity}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align:center">
      <el-button type="success" @click="create" :loading="createLoading">以亚马逊分仓创建计划</el-button>
      <el-button type="success" @click="edit">重新编辑发货数量</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      data: [],
      createLoading: false,
      loading: false
    }
  },
  props: {
    orderId: {
      type: Number,
      default: undefined
    }
  },
  watch: {
    orderId: {
      immediate: true,
      handler(val) {
        console.log(val)
        this.getData(val)
      }
    }
  },
  methods: {
    getData(orderId) {
      this.loading = true

      this.$api[`order/inventoryCheck`]({ orderId })
        .then(data => {
          this.loading = false
          this.data = data.rows
        })
        .catch(err => {
          this.data = []
          this.loading = false
        })
    },
    refresh() {
      this.getData(this.orderId)
    },
    create() {
      this.createLoading = true
      this.$api[`order/inventoryCreate`]({ orderId: this.orderId })
        .then(data => {
          this.createLoading = false
          this.$emit('close')
        })
        .catch(err => {
          this.createLoading = false
        })
    },
    edit() {
      this.$emit('edit', this.orderId)
    }
  }
}
</script>

<style lang='scss' scoped>
.flex1 {
  display: flex;
  // flex-direction: column;
  .flex {
    display: flex;
    margin: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .sku {
      font-weight: bolder;
    }
  }
}
.tooltip-content {
  p {
    margin: 10px 0;
  }
}
</style>

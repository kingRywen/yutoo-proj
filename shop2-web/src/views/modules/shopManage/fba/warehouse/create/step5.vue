<template>
  <div class="w1200">
    <Info type="check" />
    <section class="mt20">
      <main-layout :columns="columns" radioMode :outerTableList="shipments">
        <el-table-column slot="right" :width="160" label align="left">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="del(scope.row, scope.$index)"></el-button> -->
            <button v-if="scope.row.shipmentStatus != 1" class="amazon-btn" @click="handler(scope.row)">
              <span>处理货件</span>
            </button>
            <button v-else class="amazon-btn amazon-btn-sec" @click="handler(scope.row, true)">
              <span>追踪货件</span>
            </button>
          </template>
        </el-table-column>
      </main-layout>
    </section>
  </div>
</template>
<script>
import Info from './info'
import { mapState } from 'vuex'
export default {
  components: {
    Info
  },
  data() {
    return {
      columns: [
        {
          label: '货件名称',
          minWidth: 140,
          value: 'shipmentName'
          // render(h, scope) {}
        },
        {
          label: 'MSKU',
          value: 'msku',
          render(h, scope) {
            return <span>{scope.row.items && scope.row.items.length}</span>
          }
        },
        // {
        //   label: '纸箱数',
        //   value: 'packNum'
        // },
        {
          label: '商品数',
          value: 'totalUnits'
        },
        {
          label: '配送地址',
          value: 'add',
          minWidth: 300,
          noTooltip: true,
          render(h, scope) {
            const {
              shipToCity,
              shipToCountry,
              shipToLine1,
              shipToName,
              shipToPostal,
              shipToState
            } = scope.row
            return (
              <span>
                {shipToName}, {shipToLine1} {shipToCity} {shipToState},{' '}
                {shipToPostal} {shipToCountry}
              </span>
            )
          }
        }
      ]
    }
  },
  created() {
    this.$store.dispatch('fba/getShipments')
  },
  computed: {
    ...mapState('fba', ['shipments'])
    // data() {
    //   let selectProjProduct = this.$store.state.fba.selectProjProduct
    //   let planInfo = this.$store.state.fba.planInfo
    //   let ret = {}
    //   ret.name = planInfo.planName
    //   // ret.msku = selectProjProduct.length
    //   // ret.packNum =
    //   ret.proNum = selectProjProduct.length
    //   ret.add = this.$store.getters['fba/addressGroupName']
    //   return [ret]
    // }
  },
  methods: {
    async next() {},
    handler(row, hasCreate) {
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.$route.query,
          shipmentId: row.shipmentId
        }
      })
      !hasCreate && this.$store.dispatch('fba/createShipments')
      this.$store.commit('fba/saveCreateInfo', 5)
    }
  }
}
</script>
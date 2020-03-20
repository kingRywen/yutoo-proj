<template>
  <div v-if="loading">
    <el-steps style="width:1200px;margin: 0 auto;" :active="activeIndex" finish-status="success" align-center>
      <el-step title="选择操作">
        <!-- <i class="el-icon-check" slot="title" @click="saveCreateInfo(0)"></i> -->
        <span class="title" slot="title" @click="goto(0)">选择操作</span>
      </el-step>
      <el-step title="设置数量">
        <span class="title" slot="title" @click="goto(1)">设置数量</span>
      </el-step>
      <el-step title="预处理">
        <span class="title" slot="title" @click="goto(2)">预处理</span>
      </el-step>
      <el-step title="为商品贴标">
        <span class="title" slot="title" @click="goto(3)">为商品贴标</span>
      </el-step>
      <el-step title="检查货件">
        <span class="title" slot="title" @click="goto(4)">检查货件</span>
      </el-step>
      <el-step title="预处理货件">
        <span class="title" slot="title" @click="goto(5)">预处理货件</span>
      </el-step>
    </el-steps>
    <component
      @done="handleDone"
      :planProcess="planProcess"
      @cancel="cancel"
      :addressInfo="addressInfo"
      :planInfo="planInfo"
      :is="componentId"
    ></component>
  </div>
  <!-- <div style="height: 500px" class="flex flex-v" v-else>
    <div>
      <img src="./img/建设中.png" alt />
    </div>
    <div class="mt20" style="font-size: 12px">正在建设中...</div>
  </div>-->
</template>
<script>
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import Step5 from './step5'
import Step6 from './step6'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    Step1,
    Step2,
    Step3,
    Step6,
    Step4,
    Step5
  },
  data() {
    const shipmentId = this.$route.query.shipmentId

    return {
      loading: false,
      shipmentId,
      isShip: !!shipmentId,
      shipAddressId: this.$route.query.shipAddressId,
      planProcess: this.$route.query.planProcess
      // componentId: 'Step1',
      // active: 0
      // 计划详情
      // planInfo: {},
      // 地址详情
      // addressInfo: {}
    }
  },
  async created() {
    this.loading = false
    this.getAddress({ storeId: this.$route.query.storeId }).then(async list => {
      const defaultAds = list.find(
        el => el.storeId === this.$route.query.storeId && el.addressType == 1
      )
      // debugger

      if (this.planProcess) {
        // this.saveCreateInfo(+this.planProcess)
        this.setAddressInfo(
          list.find(el => el.addressId == this.shipAddressId) || {}
        )
        const {
          shipAddressId,
          storeId,
          storeName,
          planName,
          targetCountryCode,
          packageType,
          labelPrepPreference,
          // planProcess,
          planId,
          replenishInfoId
        } = this.$route.query
        // debugger
        this.setPlanInfo({
          latestIndex: +this.planProcess - 1,
          shipAddressId: shipAddressId,
          storeId: storeId,
          storeName: storeName,
          planId,
          planName: planName,
          targetCountryCode: targetCountryCode,
          packageType: +packageType,
          labelPrepPreference: labelPrepPreference,
          // planProcess: +planProcess,
          replenishInfoId: replenishInfoId
        })
        this.saveCreateInfo(+this.planProcess - 1)
      } else {
        defaultAds && this.setAddressInfo(defaultAds)
      }
      this.loading = true
      if (this.shipmentId) {
        this.saveCreateInfo(5)
        this.queryShipItems({
          shipmentId: this.shipmentId
        })
      }
    })
  },
  // beforeDestroy() {
  //   this.clearCacheProj()
  // },
  computed: {
    ...mapState('fba', ['planInfo', 'addressInfo', 'activeIndex']),
    componentId() {
      return 'Step' + Math.min(this.activeIndex + 1, 6)
    },
    addDisplay() {
      return this.addressInfo
    }
  },
  // watch: {
  //   activeIndex(val) {
  //     if (this.planProcess == null) {
  //       return
  //     }
  //     this.$router.replace({
  //       path: this.$route.path,
  //       query: {
  //         ...this.$route.query,
  //         planProcess: val
  //       }
  //     })
  //   }
  // },
  methods: {
    ...mapMutations('fba', ['saveCreateInfo', 'setAddressInfo', 'setPlanInfo']),
    ...mapActions('fba', ['clearCacheProj', 'getAddress', 'queryShipItems']),
    handleDone() {
      // this.saveCreateInfo(this.activeIndex + 1)
    },
    goto(index) {
      if (index >= this.planInfo.latestIndex + 1 || this.shipmentId) {
        return
      }
      this.saveCreateInfo(index)
    },
    async cancel() {
      await this.clearCacheProj()
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  cursor: pointer;
  position: relative;
  &:after {
    content: '';
    display: block;
    width: 100%;
    height: 50px;
    position: absolute;
    top: -41px;
    left: 0;
    z-index: 1;
  }
}
</style>
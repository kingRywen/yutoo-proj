<template>
  <div class="w600">
    <article class="first">
      <header>要创建新入库计划还是添加至现有入库计划？</header>
      <section>
        <p>
          <input :disabled="$attrs.unedit" type="radio" id="new" v-model="isNew" @change="isError = false" :value="true" />
          <label for="new">创建新的</label>
        </p>
        <p>
          <input :disabled="$attrs.unedit" type="radio" id="1" v-model="isNew" :value="false" />
          <label for="1">
            添加至现有的入库计划
            <el-select :disabled="$attrs.unedit" size="mini" @change="isError = false" v-model="proj">
              <el-option v-for="item in projects" :key="item.planId" :value="item.planId" :label="item.planName"></el-option>
            </el-select>
            <div class="error mt10" v-if="isError">
              <el-alert title="请选择要添加的计划" show-icon :closable="false" type="warning"></el-alert>
            </div>
          </label>
        </p>
      </section>
    </article>
    <template v-if="isNew">
      <article class="second">
        <header>设置发货地址</header>
        <section>
          <template v-if="addressInfo.addressName">
            <p>
              <b style="font-weight: 900;font-size: 18px;">{{addressInfo.addressName}}</b>
            </p>
            <p>{{addressInfo.addressLine1}}</p>
            <p>{{addressInfo.addressLine2}}</p>
            <p>{{addressInfo.addressCity}} {{addressInfo.addressState}}, {{addressInfo.addressCountryCode}} {{addressInfo.addressPostalCode}}</p>
            <p>{{addressInfo.addressCountry}}</p>
            <el-button :disabled="$attrs.unedit" class="edit" @click="edit" type="text">修改</el-button>
          </template>
          <div class="flex just-sb" v-else>
            <div style="opacity: 0.5">没有设置默认地址。</div>
            <ElButton :disabled="$attrs.unedit" type="text" @click="edit">选择发货地址</ElButton>
          </div>
        </section>
      </article>
      <article class="first third">
        <header>包装类型</header>
        <section>
          <p>
            <input type="radio" id="pack1" v-model="packageType" :value="1" />
            <label for="pack1">混装商品</label>
          </p>
          <p>
            <input type="radio" id="pack2" v-model="packageType" :value="2" />
            <label for="pack2">原厂包装发货商品</label>
          </p>
          <div>
            <img src="./img/pack.png" />
          </div>
        </section>
      </article>
    </template>
    <article class="mt20">
      <el-button :disabled="$attrs.unedit" type="default" @click="$emit('cancel')">取消创建</el-button>
      <el-button :disabled="$attrs.unedit" type="primary" @click="next">继续下一步</el-button>
    </article>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      isNew: true,
      proj: null,
      packageType: 1,
      storeId: this.$route.query.storeId,
      storeName: this.$route.query.storeName,
      projects: [],
      isError: false
    }
  },

  computed: {
    ...mapState('fba', ['addresses', 'planInfo', 'addressInfo', 'activeIndex'])
  },
  created() {
    // if (this.$route.query.replenishInfoId) {
    //   return
    // }
    this.getProjects()
  },
  watch: {
    'planInfo.packageType': {
      immediate: true,
      handler(val) {
        if (val) {
          this.packageType = val
        }
      }
    }
  },
  methods: {
    ...mapActions('fba', [
      'delPlan',
      'updatePlan',
      'clearCacheProj',
      'addItemToCreated'
    ]),
    ...mapMutations('fba', ['setAddressInfo', 'saveCreateInfo', 'setPlanInfo']),
    getProjects() {
      const params = { storeId: this.storeId, pageSize: 1000, pageNumber:1 }
      this.$api[`fba/fbaShipmentCreatePlanList`](params).then(data => {
        this.projects = data.plans.rows.filter(
          el => el.storeId === this.storeId && el.planProcess !== 6
        )
      })
    },
    async addToExist(params) {
      await this.addItemToCreated(params)
      // commit("saveCreateInfo", activeIndex);
      this.saveCreateInfo(this.activeIndex + 1)
      const planInfo = this.projects.find(e => e.planId == this.proj),
        addressInfo = this.addresses.find(
          e => e.addressId === planInfo.shipAddressId
        )
      // debugger
      this.setPlanInfo(planInfo)
      this.setAddressInfo(addressInfo || {})
    },
    async next() {
      if (!this.isNew && !this.proj) {
        this.isError = true
        return
      }
      if (this.isNew && this.addressInfo.addressName == null) {
        return this.$message.warning('请先选择一个发货地址')
      }

      // if (this.planInfo.planId) {
      //   try {
      //     if (
      //       !(!this.isNew && this.proj && this.proj === this.planInfo.planId)
      //     ) {
      //       await this.delPlan({ planId: this.planInfo.planId })
      //     }
      //     // eslint-disable-next-line no-empty
      //   } catch (error) {}
      // }

      if (!this.isNew && this.proj) {
        return this.addToExist({
          planId: this.proj,
          items: this.$store.state.fba.selectProjProduct
        })
      }
      const params = {
        storeId: this.storeId,
        planId: this.planInfo.planId,

        storeName: this.storeName,
        shipAddressId: this.addressInfo.addressId,
        targetCountryCode:
          this.$store.getters['storeInfo/currentSite'].countryCode ||
          this.planInfo.targetCountryCode,
        packageType: this.packageType,
        labelPrepPreference: 'SELLER_LABEL',
        replenishInfoId: this.$route.query.replenishInfoId
      }
      let plan = await this.updatePlan({
        info: params,
        activeIndex: this.activeIndex + 1
      })
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, planId: plan.planId }
      })
      this.$emit('done')
    },
    edit() {
      this._openDialog({
        size: 'medium',
        fullscreen: false,
        title: '地址管理',
        params: {
          cb: row => {
            this.setAddressInfo(row)
          }
        },
        cancelBtnText: '关闭',
        component: () => import('./address.vue')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.w600 {
  font-size: 13px;
  header {
    font-size: 14px;
    color: rgb(51, 51, 51);
    font-weight: bold;
    font-family: 'Arial Negreta', 'Arial Normal', Arial;
    margin: 30px 0 16px 0;
  }
  section {
    border: 1px solid #ddd;
    padding: 6px 16px;
  }
  .first {
    input,
    p,
    label {
      vertical-align: middle;
    }
    label {
      margin-left: 4px;
    }
  }
  .third {
    p {
      display: inline-block;
      line-height: 16px;
      & + p {
        margin-left: 20px;
      }
    }
  }
  .second {
    section {
      position: relative;
      .edit {
        padding: 0;
        position: absolute;
        right: 16px;
        bottom: 16px;
      }
    }
  }
}
</style>
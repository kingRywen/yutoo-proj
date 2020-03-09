<template>
  <new-form ref="form" :form-schema="formSchema" style="margin-right:20px" label-width="160px" :value="value"></new-form>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      formSchema: {
        brokerage: {
          label: '佣金/件',
          widget: 'currency',
          disabled: true
        },
        handleMoney: {
          widget: 'currency',
          required: true,
          label: '操作费$/次',
          tip: {
            content: '包含入库费、出库费、分拣费'
          }
        },
        storageMoney: {
          widget: 'currency',
          label: '仓储费$/立方英寸/天',
          required: true
        },
        decalsMoney: {
          required: true,
          widget: 'currency',
          label: '贴标费$/次',
          tip: {
            content: '纸箱贴标费、产品贴标费价格均一'
          }
        },
        packMoney: { required: true, widget: 'currency', label: '打包费$/件' },
        cartonMoney: {
          required: true,
          widget: 'currency',
          label: '纸箱费$/个',
          tip: {
            content: '标准箱'
          }
        }
      },
      value: {}
    }
  },
  computed: {
    ...mapState(['cstInfo'])
  },
  created() {
    this.value = { ...this.cstInfo }
    // this.getCst().then(() => {
    //   this.value = { ...this.cstInfo }
    // })
  },
  methods: {
    ...mapActions(['getCst']),
    ...mapMutations(['setCst']),
    _submit() {
      let vm = this
      return this.$refs.form.validate().then(() => {
        const promises = [
          vm.$api[`main/recycleExplainUpdate`]({
            ...vm.value,
            platformCode: this.$store.state.currentSiteInfo.platformCode
          })
        ]
        return Promise.all(promises).then(() => {
          vm.setCst(vm.value)
          return Promise.resolve(true)
        })
      })
    }
  }
}
</script>
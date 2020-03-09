<template>
  <new-form ref="form" label-width="120px" :form-schema="formSchema" v-model="value"></new-form>
</template>
<script>
// import { mapState } from 'vuex'
export default {
  props: ['productRecycleId', 'unit'],
  data() {
    return {
      formSchema: {
        length: {
          widget: 'currency',
          label: '商品尺寸（英寸）/件',
          labelWidth: '160px',
          width: '100%',
          controls: false,
          span: 14,
          required: true
        },
        width: {
          widget: 'currency',
          // label: '商品体积/件',
          span: 5,
          controls: false,
          required: true,
          width: '100%'
        },
        height: {
          widget: 'currency',
          // label: '仓储费$/件/天',
          span: 5,
          controls: false,
          required: true,
          width: '100%'
        },
        volume: {
          widget: 'currency',
          label: '商品体积/件',
          labelWidth: '160px',
          controls: false,
          disabled: true,
          width: '100%'
        },
        storageMoney: {
          widget: 'currency',
          labelWidth: '160px',
          label: '仓储费$/件/天',
          disabled: true,
          controls: false,
          width: '100%'
        }
        // inTime: {
        //   widget: 'date',
        //   time: true,
        //   labelWidth: '160px',
        //   label: '入库时间',
        //   required: true,
        //   width: '100%'
        // }
      },
      value: {}
    }
  },
  computed: {
    // ...mapState(['cstInfo']),
    totalVol() {
      const { length, height, width } = this.value
      if (length && height && width) {
        return length * height * width
      } else {
        return null
      }
    }
  },
  watch: {
    totalVol(val) {
      // console.log(val)

      if (val) {
        this.getMoney(val)
      }
    }
  },
  methods: {
    _submit() {
      return this.$api[`main/recycleAuditInStorage`]({
        ...this.value,
        productRecycleId: this.productRecycleId
      })
    },
    getMoney(val) {
      this.value.volume = val
      this.value.storageMoney = val * this.unit
    }
  }
}
</script>
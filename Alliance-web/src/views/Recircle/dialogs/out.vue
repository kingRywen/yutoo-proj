<template>
  <el-tabs type="card" v-model="activeName">
    <el-tab-pane v-for="item in tabs" :label="item.label" :key="item.name" :name="item.name">
      <OutInfo :productRecycleId="productRecycleId" ref="form1" v-if="item.name === 'first'" />
      <Audit :type="type" :disabled="type === 'pack'" v-if="item.name === 'second'" ref="form2" />
      <new-form
        v-if="item.name === 'third'"
        ref="form3"
        label-width="120px"
        :form-schema="formSchema3"
        v-model="value3"
      ></new-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Audit from 'Views/Task/Source/dialogs/audit.vue'
import OutInfo from './outInfo'
export default {
  components: { Audit, OutInfo },
  props: {
    type: {
      // audit 出库审核   pack 打包
      default: 'audit',
      type: String
    },
    productRecycleId: Number
  },
  data() {
    let activeName = 'second'
    let tabs = [
      {
        label: '出库申请',
        name: 'first'
      },
      {
        label: '出库审核',
        name: 'second'
      }
    ]
    if (this.type === 'pack') {
      tabs.pop()
      tabs.push({
        label: '打包',
        name: 'third'
      })
      activeName = 'third'
    } else {
      activeName = 'second'
    }
    return {
      tabs,
      activeName,

      formSchema3: {
        consumableMoney: {
          widget: 'currency',
          label: '耗材费$',
          required: true,
          tip: {
            content: '含纸箱、胶带等。'
          }
        },
        cartonDecalsMoney: {
          widget: 'currency',
          required: true,
          label: '纸箱贴标费$'
          // hidden: () => {
          //   return (
          //     this.$refs.form1[0].value.cartonDecalsFlag == null ||
          //     this.$refs.form1[0].value.cartonDecalsFlag == 0
          //   )
          // }
        },
        transport: {
          required: true,
          label: '运输方式',
          hidden: () => {
            return (
              this.$refs.form1[0].value.freightType == null ||
              this.$refs.form1[0].value.freightType != 1
            )
          }
        },
        transportNo: {
          required: true,
          label: '运单号',
          hidden: () => {
            return (
              this.$refs.form1[0].value.freightType == null ||
              this.$refs.form1[0].value.freightType != 1
            )
          }
        }
      },
      value3: {}
    }
  },

  methods: {
    _submit() {
      if (this.type === 'audit') {
        return this.$refs.form2[0].$refs.form
          .validate()
          .then(() => {
            return this.$api[`main/recycleAuditOutStorage`]({
              ...this.$refs.form2[0].value,
              productRecycleId: this.productRecycleId
            })
          })
          .catch(() => {
            this.activeName = 'second'
            return Promise.reject('请填写审核信息')
          })
      }
      if (this.type === 'pack') {
        return this.$refs.form3[0]
          .validate()
          .then(() => {
            return this.$api[`main/recyclePack`]({
              ...this.value3,
              productRecycleId: this.productRecycleId
            })
          })
          .catch(() => {
            this.activeName = 'third'
            return Promise.reject('请填写打包信息')
          })
      }
    }
  }
}
</script>
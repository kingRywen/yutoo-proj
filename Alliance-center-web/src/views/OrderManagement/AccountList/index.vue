<template>
  <div class="flex-col">
    <SimpleForm :defaultData="defaultData" label-width="120px" :fields="infoFields" ref="info" />
    <main-layout
      :btns="btns"
      :sideBar="false"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      :outerParams="outerParams"
      editWidth="160px"
      :tableCols="tableCols"
    ></main-layout>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapState, mapActions } from 'vuex'

export default {
  props: ['orderId'],
  mixins: [mixin],
  data() {
    let vm = this
    return {
      defaultData: {},
      outerParams: {
        orderId: +this.orderId
      },
      listApi: 'merchantOrderAccountList',
      btns: [],
      edits: [],

      infoFields: [
        {
          name: 'merchantEmail',
          label: '商户邮箱',
          span: 8,
          disabled: true
        },
        {
          name: 'orderId',
          label: '订单编号',
          span: 8,
          disabled: true
        },
        {
          name: 'ipCount',
          label: '账号配额',
          span: 8,
          disabled: true
        },
        {
          name: 'createTime',
          label: '创建时间',
          span: 8,
          disabled: true
        },
        {
          name: 'payTime',
          label: '最近支付时间',
          span: 8,
          disabled: true
        },
        {
          name: 'expireTime',
          label: '到期时间',
          span: 8,
          disabled: true
        }
      ],
      tableCols: [
        {
          label: '序号',
          prop: 'accountId'
        },
        {
          label: '平台账号',
          prop: 'account'
        },
        {
          label: '账号类型',
          prop: 'accountType',
          render(h, scope) {
            return <span>{scope.row.accountType ? '自动' : '手动'}</span>
          }
        },
        {
          label: '姓名',
          prop: 'name'
        },
        {
          label: '平台站点',
          prop: 'platformSiteName'
        },
        {
          label: 'IP',
          prop: 'ip'
        },
        {
          label: 'IP归属国家',
          prop: 'addressCountry'
        },
        {
          label: 'IP归属州',
          prop: 'addressState'
        },
        {
          label: 'IP归属城市',
          prop: 'addressCity'
        },
        {
          label: 'IP归属街道',
          prop: 'addressStreet'
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  computed: {
    searchFields() {
      return [
        {
          name: 'merchantNo',
          label: '商户编号'
        }
      ]
    }
  },
  methods: {
    getData() {
      this.$api[`main/merchantOrderInfo`]({ orderId: this.orderId })
        .then(data => {
          this.defaultData = data.rows
        })
        .catch(err => {})
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="flex-col">
    <SimpleForm :defaultData="defaultData" label-width="120px" :fields="infoFields" ref="info" />
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      :searchFunc="searchFunc"
      :outerParams="outerParams"
      editWidth="160px"
      :tableCols="tableCols"
    ></main-layout>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapState, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import download from 'Utils/download'

const token = storage.get('local', 'token')

export default {
  mixins: [mixin],
  created() {
    if (!this.platformSite.length) {
      this.getPlatformSite()
    }
    this.getData()
  },
  data() {
    let vm = this
    return {
      defaultData: {},
      outerParams: {
        ipPoolId: +this.$route.params.ipPoolId
      },
      listApi: 'ipBindRecordList',
      btns: [],
      edits: [],

      infoFields: [
        {
          name: 'ip',
          label: 'IP',
          span: 8,
          disabled: true
        },
        {
          name: 'port',
          label: '端口',
          span: 8,
          disabled: true
        },
        {
          name: 'addressCountry',
          label: '归属国家',
          span: 8,
          disabled: true
        },
        {
          name: 'addressState',
          label: '归属州',
          span: 8,
          disabled: true
        },
        {
          name: 'addressCity',
          label: '归属城市',
          span: 8,
          disabled: true
        },
        {
          name: 'addressStreet',
          label: '归属街道',
          span: 8,
          disabled: true
        },
        {
          name: 'payTime',
          label: '购买时间',
          span: 8,
          disabled: true
        },
        {
          name: 'expireTime',
          label: '到期时间',
          span: 8,
          disabled: true
        },
        {
          name: 'status',
          label: '状态',
          span: 8,
          type: 'select',
          options: [
            {
              label: '正常',
              value: 1
            },
            {
              label: '作废',
              value: 0
            }
          ],
          disabled: true
        },
        {
          name: 'useCase',
          label: '在用/总用账号',
          span: 8,
          disabled: true
        }
      ],

      addFields: [
        {
          name: 'ip',
          label: 'IP',
          span: 12,
          required: true
        },
        {
          name: 'port',
          label: '端口',
          span: 12,
          required: true
        },
        {
          name: 'account',
          label: '账号',
          span: 12,
          required: true
        },

        {
          name: 'password',
          label: '密码',
          span: 12,
          required: true
        },
        {
          name: 'addressCountry',
          label: '归属国家',
          span: 12,
          disabled: true,
          required: true
        },
        {
          name: 'addressState',
          label: '归属州',
          disabled: true,
          span: 12,
          required: true
        },
        {
          name: 'addressCity',
          label: '归属城市',
          disabled: true,
          span: 12,
          required: true
        },
        {
          name: 'addressStreet',
          label: '归属街道',
          disabled: true,
          span: 12
        },
        {
          name: 'payTime',
          label: '购买时间',
          span: 12,
          type: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 24 * 3600 * 1000
            }
          },
          required: true
        },
        {
          name: 'expireTime',
          label: '到期时间',
          span: 12,
          type: 'date',
          required: true,
          pickerOptions: {
            disabledDate(time) {
              return (
                time.getTime() <
                new Date(vm.$refs.add.formData.payTime).getTime() -
                  24 * 3600 * 1000
              )
            }
          }
        },
        {
          name: 'remark',
          label: '备注',
          span: 24,
          type: 'textarea',
          rows: 5,
          required: true
        },
        {
          name: 'timezone',
          label: '时区',
          span: 12,
          required: true
        },
        {
          name: 'timeOffset',
          label: '时区简称',
          span: 12,

          required: true
        }
      ],
      tableCols: [
        {
          label: '商户编号',
          prop: 'merchantNo'
        },
        {
          label: '商户邮箱',
          prop: 'merchantEmail'
        },
        {
          label: '平台站点',
          prop: 'platformSiteName'
        },
        {
          label: '平台账号',
          prop: 'account'
        },
        {
          label: '收货人',
          prop: 'consigneeName'
        },
        {
          label: '收货国家',
          prop: 'addressCountry'
        },
        {
          label: '收货州',
          prop: 'addressState'
        },
        {
          label: '收货城市',
          prop: 'addressCity'
        },
        {
          label: '收货街道',
          prop: 'addressStreet'
        },
        {
          label: 'IP使用状态',
          prop: 'status',
          render(h, scope) {
            let { status } = scope.row
            return (
              <span>{status == 0 ? '终止' : status == 1 ? '正常' : '-'}</span>
            )
          }
        }
      ]
    }
  },

  computed: {
    ...mapState(['platformSite']),
    searchFields() {
      return [
        {
          name: 'merchantNo',
          label: '商户编号'
        },
        {
          name: 'platformSiteId',
          label: '平台站点',
          type: 'cascader',
          clearable: true,
          options: this.platformSite
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getPlatformSite']),
    searchFunc(data) {
      let { platformSiteId = [], merchantNo } = data
      platformSiteId = platformSiteId.slice(0).pop()
      return { merchantNo, platformSiteId }
    },
    getData() {
      this.$api[`main/ipPoolInfo`]({ ipPoolId: this.$route.params.ipPoolId })
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

<template>
  <table-select
    :url="`order/senderList`"
    :initial="senderListInitial"
    :options="tableAddSendInfoOptions"
    ref="tableSenderInfo"
  >
    <!-- 添加新地址 -->
    <yt-dialog :options="senderInfoOptsAdd" :events="senderInfoEventsAdd" slot="add" name="添加新地址">
      <SimpleForm :fields="senderInfoFields" :form-data.sync="senderInfoForm" label-width="123px"></SimpleForm>
    </yt-dialog>

    <div slot="del" uid="senderId" uids="senderIds" url="order/senderRemove" name="删除选中地址"></div>
    <template slot="right" slot-scope="scope">
      <el-button type="text" @click="$refs.tableSenderInfo.handleEdit(scope)">编辑</el-button>
      <el-button type="text" @click="handleSenderInfoDel(scope.row)">删除</el-button>
      <el-button type="text" @click="handleSenderInfoSelect(scope.row)">选择</el-button>
    </template>
  </table-select>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    let vm = this
    return {
      senderInfoForm: {},
      senderInfoOptsAdd: {
        visible: false,
        title: '新增地址',
        width: '60%',
        okBtnText: '保存',
        cancelBtnText: '取消',
        appendToBody: true
      },

      // 寄件人信息管理 - 添加
      senderInfoEventsAdd: {
        handleOkClick() {
          // 确认事件
          return vm.$api['order/senderSave'](vm.senderInfoForm).then(() => {
            vm.$refs.tableSenderInfo.reset()
          })
        },
        handleEditOkClick() {
          // 编辑
          return vm.$api['order/senderUpdate'](vm.senderInfoForm).then(() => {
            // 重置搜索
            vm.$refs.tableSenderInfo.reset()
          })
        }
      },

      tableAddSendInfoOptions: {
        rowKey: 'senderId',
        search: {
          list: [
            {
              label: '订单来源渠道',
              value: 'storeId',
              type: 'select',
              children: [],
              props: {
                label: 'name',
                value: 'storeId'
              }
            }
          ]
        },
        table: {
          columns: [
            {
              multi: [
                { label: '寄件人', value: 'contacter' },
                { label: '始发地', value: 'originAddress' },
                { label: '联系电话', value: 'phone' },
                {
                  label: '寄件区域',
                  value(scope) {
                    return `${scope.row.province} ${scope.row.city} ${
                      scope.row.area
                    }`
                  }
                },
                { label: '寄件地址', value: 'addressDetail' }
              ],
              label: '寄件信息'
            },
            {
              value: 'defaultFlag',
              label: '是否默认',
              formatter(scope) {
                return scope.row.defaultFlag === 1 ? '是' : '否'
              }
            }
          ]
        }
      },
      senderListInitial: {}
    }
  },
  created() {
    this.getAllShopList().then(() => {
      this.tableAddSendInfoOptions.search.list[0].children = this.allShopList
    })
    this.initCountryList()
  },

  methods: {
    ...mapActions('order', ['getAllShopList', 'initCountryList']),
    // 删除地址(寄件人)
    handleSenderInfoDel(row) {
      this.$confirm('是否删除地址？', '警告', {
        type: 'danger'
      })
        .then(() => {
          this.$api['order/senderRemove']({
            senderIds: [row.senderId]
          }).then(() => {
            this.$refs.tableSenderInfo.reset()
          })
        })
        .catch(() => {})
    },
    //选择地址(寄件人)
    handleSenderInfoSelect(row) {
      let {
        contacter: senderContacts,
        phone: senderContactPhone,
        addressDetail: senderAddress,
        senderPostcode
      } = row
      this.formData = {
        senderPostcode,
        senderContactPhone,
        senderAddress,
        senderContacts
      }
      this.$parent.$options.parent.options.visible = false
    }
  },
  computed: {
    ...mapState('order', ['allShopList', 'countryList']),
    formData: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    },
    senderInfoFields() {
      let vm = this
      return [
        {
          type: 'select',
          name: 'storeId',
          label: '订单来源店铺',
          required: true,
          bind: {
            label: 'name',
            value: 'storeId'
          },
          options: vm.allShopList
        },
        {
          label: '联系人',
          name: 'contacter',
          required: true
        },

        {
          label: '始发地',
          name: 'originAddress'
        },
        {
          label: '联系电话',
          name: 'phone',
          required: 'mobile'
        },
        {
          type: 'multi',
          label: '寄件区域',
          opts: [
            {
              type: 'select',
              name: 'countryId',
              label: '国家',
              required: true,
              options: vm.countryList
            },
            {
              name: 'province',
              label: '省',
              required: true
            },
            {
              name: 'city',
              label: '市',
              required: true
            },
            {
              name: 'area',
              label: '区',
              required: true
            }
          ]
        },
        {
          label: '寄件地址',
          name: 'addressDetail',
          required: true
        },
        {
          label: '寄件单位',
          name: 'senderCompany'
        },
        {
          label: '寄件邮编',
          name: 'senderPostcode',
          required: true
        }
      ]
    }
  }
}
</script>

<style>
</style>

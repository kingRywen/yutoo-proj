<template>
  <div>
    <!-- {{tableData}} -->
    <v-data-table :data="loadData" :columns="columns" :currentData.sync="tableData" ref="table">
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='entryPricePercent'">供应商报价
          <v-input-number style="width: 100px" :value="props.content || ''" @change="handlerInput(props, $event)"></v-input-number>%
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
    <div style="text-align:center" class="margin-top-20">
      <v-button type="primary" @click="add">新增</v-button>
      <v-button v-if="tableData.length" type="primary" @click="save">保存</v-button>
    </div>
    <v-modal title="新增报关价" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <v-form direction="horizontal" :model="entry" :rules="rules" ref="ruleForm">
        <v-form-item label="国家" :label-col="labelCol" :wrapper-col="wrapperCol" prop="nationId">
          <v-select search size="lg" v-model="entry.nationId" :data="nationList" style="width:100%"></v-select>
        </v-form-item>
        <v-form-item label="报关价比率" :label-col="labelCol" :wrapper-col="wrapperCol" prop="entryPricePercent">
          <div class="flex">
            <v-input-number style="width:100%" size="large" :min="0" :max="100" v-model="entry.entryPricePercent"></v-input-number>
            <span>%</span>
          </div>
        </v-form-item>
      </v-form>
    </v-modal>
  </div>
</template>

<script>
import { fetchData, showToast, handlerCode } from 'common/common'
import apis from 'apis'

export default {
  created() {
    this.getNationList()
  },
  data() {
    return {
      loadData() {
        return fetchData({ ...apis.PRODUCT_ENTRY_PRICE_PERCENT_LIST }).then(
          res => {
            if (res.data.code !== 0) {
              showToast('error', res.data.msg)
            }
            return {
              result: res.data.rows
            }
          }
        )
      },
      entry: { entryPricePercent: '' },
      nationList: [],
      visible: false,
      tableData: [],
      columns: [
        { title: '国家', field: 'nationName' },
        { title: '报关比例', field: 'entryPricePercent' }
      ],
      rules: {
        nationId: [
          {
            required: true,
            message: '不能为空'
          }
        ],
        entryPricePercent: [
          {
            required: true,
            message: '不能为空'
          }
        ]
      },
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      }
    }
  },
  methods: {
    getNationList() {
      let vm = this
      fetchData({
        ...apis.NATION_LIST
      }).then(res => {
        if (res.data.code === 0) {
          vm.nationList = res.data.rows.map(el => ({
            label: el.nameZh,
            value: el.nationId,
            ...el
          }))
        }
      })
    },
    handleOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.saveData()
        }
      })
    },
    saveData() {
      let vm = this
      fetchData({
        ...apis.PRODUCT_ENTRY_PRICE_PERCENT_SAVE,
        data: this.entry
      }).then(res => {
        handlerCode(res, () => {
          vm.visible = false
          vm.$refs.table.refresh()
        })
      })
    },
    handleCancel() {
      this.visible = false
    },
    add() {
      this.visible = true
    },
    handlerInput(props, val) {
      props.item.entryPricePercent = val
    },
    save() {
      fetchData({
        ...apis.PRODUCT_ENTRY_PRICE_PERCENT_BATCH_UPDATE,
        data: { productEntryPricePercentList: this.tableData }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        } else {
          showToast('success', res.data.msg)
        }
      })
    }
  }
}
</script>

<style>
</style>

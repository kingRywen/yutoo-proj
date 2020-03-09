<template>
  <div class="expressNumber">
    <div>
      请选择匹配单号类型 :
      <el-select v-model="form.type" size="small" style="margin-right:10px;">
        <el-option v-for="item in typelist" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <span style="color:#f56c6c">（*必选每次最多只能导2000条）</span>
    </div>
    <div style="margin:15px 0;">导入下单号/支付宝交易号与快递单号关联（从Excel中复制 或 以“Tab”制表符号分隔）：</div>
    <el-table :data="tableData" style="width: 100%" border :header-cell-style="{background:'#f2f2f2'}">
      <el-table-column label="导入下单号 / 支付宝交易号 / 采购平台订单号" align="center">
        <template slot-scope="scope">
          <el-input
            size="small"
            type="textarea"
            class="textarea1"
            placeholder="一行一个或以逗号分隔"
            v-model.trim="form.purchaseNumber"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="追踪号" align="center">
        <template slot-scope="scope">
          <el-input
            size="small"
            type="textarea"
            class="textarea1"
            placeholder="一行一个或以逗号分隔"
            v-model.trim="form.trackNumber"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="info" round size="small" style="margin-top:15px" @click="submitForm">导入下单号/支付宝交易号、采购平台订单号与快递单号关联</el-button>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    importNumberCallback: Function
  },
  data() {
    return {
      typelist: [
        { label: '下单号', value: '1' },
        { label: '支付宝交易号', value: '2' },
        { label: '采购平台订单号', value: '3' }
      ],
      form: {
        type: '1',
        purchaseNumber: '',
        trackNumber: ''
      },
      tableData: [{ oddNumbers: '', expressNumber: '' }]
    }
  },
  methods: {
    submitForm() {
      let purchaseNumber = this.form.purchaseNumber
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== '')
      let trackNumber = this.form.trackNumber
        .split(/[\n|\r\n|\,|\，]/)
        .map(el => el.trim())
        .filter(el => el !== '')

      let params = {
        purchaseNumber,
        trackNumber,
        type: this.form.type
      }
      if (purchaseNumber.length && trackNumber.length) {
        this.$api['procurement/importTrackNumber'](params).then(res => {
          this.importNumberCallback && this.importNumberCallback(true)
          this.$message.success(res.msg)
        })
      } else {
        this.$message.warning('交易号/单号/追踪号不能为空')
      }
    },
    resetForm() {
      this.form.purchaseNumber = ''
      this.form.trackNumber = ''
    }
  }
}
</script>
<style lang="scss" scope>
.textarea1 {
  textarea {
    height: 300px;
    overflow-y: auto;
    resize: none;
  }
}
</style>
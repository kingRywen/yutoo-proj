<template>
  <div class="w1200">
    <ElButton type="primary" class="mb10" size="small" @click="batch">批量应用修改</ElButton>
    <el-table :data="value.table" ref="table">
      <ElTableColumn :selectable="selectable" type="selection"></ElTableColumn>
      <el-table-column label="订单号" prop="amazonOrderId"></el-table-column>

      <el-table-column label="运输方" prop="carrierCode">
        <template slot-scope="scope">
          <div class="flex just-sb">
            <el-select
              :class="scope.$index == 0 ? '' : 'vali'"
              filterable
              size="small"
              v-model="scope.row.carrierCode"
              placeholder
            >
              <el-option v-for="item in carrierCode" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
            <!-- <el-input
              class="ml10 vali"
              v-if="scope.row.carrierCode == 'Other'"
              v-model="scope.row.carrierName"
              size="small"
              placeholder="请输入运输方"
            ></el-input>-->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="运输方式" prop="trackingNumber">
        <template slot-scope="scope">
          <div>
            <el-select :class="scope.$index == 0 ? '' : 'vali'" size="small" v-model="scope.row.shipMethod" placeholder>
              <el-option v-for="item in shipMethod" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="运单号" prop="trackingNumber">
        <template slot-scope="scope">
          <div class="flex">
            <el-input
              class="ml10"
              :class="scope.$index == 0 ? '' : 'vali'"
              v-model="scope.row.trackingNumber"
              size="small"
              placeholder="请输入运单号"
            ></el-input>
            <el-button
              class="ml10 del-hover"
              size="small"
              type="text"
              icon="el-icon-delete"
              :style="{visibility: scope.$index !== 0 ? 'visible' : 'hidden'}"
              @click="value.table.splice(scope.$index, 1)"
            ></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ['orderNumbers', 'ways', 'edit'],
  data() {
    return {
      carrierCode: [
        { label: 'USPS', value: 'USPS' },
        { label: 'UPS', value: 'UPS' },
        { label: 'UPSMI', value: 'UPSMI' },
        { label: 'FedEx', value: 'FedEx' },
        { label: 'DHL', value: 'DHL' },
        { label: 'Fastway', value: 'Fastway' },
        { label: 'GLS', value: 'GLS' },
        { label: 'GO!', value: 'GO!' },
        { label: 'Hermes Logistik Gruppe', value: 'Hermes Logistik Gruppe' },
        { label: 'Royal Mail', value: 'Royal Mail' },
        { label: 'Parcelforce', value: 'Parcelforce' },
        { label: 'City Link', value: 'City Link' },
        { label: 'TNT', value: 'TNT' },
        { label: 'Target', value: 'Target' },
        { label: 'SagawaExpress', value: 'SagawaExpress' },
        { label: 'NipponExpress', value: 'NipponExpress' },
        { label: 'YamatoTransport', value: 'YamatoTransport' },
        { label: 'DHL Global Mail', value: 'DHL Global Mail' },
        { label: 'UPS Mail Innovations', value: 'UPS Mail Innovations' },
        { label: 'FedEx SmartPost', value: 'FedEx SmartPost' },
        { label: 'OSM', value: 'OSM' },
        { label: 'OnTrac', value: 'OnTrac' },
        { label: 'Streamlite', value: 'Streamlite' },
        { label: 'Newgistics', value: 'Newgistics' },
        { label: 'Canada Post', value: 'Canada Post' },
        { label: 'Blue Package', value: 'Blue Package' },
        { label: 'Chronopost', value: 'Chronopost' },
        { label: 'Deutsche Post', value: 'Deutsche Post' },
        { label: 'DPD', value: 'DPD' },
        { label: 'La Poste', value: 'La Poste' },
        { label: 'Parcelnet', value: 'Parcelnet' },
        { label: 'Poste Italiane', value: 'Poste Italiane' },
        { label: 'SDA', value: 'SDA' },
        { label: 'Smartmail', value: 'Smartmail' },
        { label: 'FEDEX_JP', value: 'FEDEX_JP' },
        { label: 'JP_EXPRESS', value: 'JP_EXPRESS' },
        { label: 'NITTSU', value: 'NITTSU' },
        { label: 'SAGAWA', value: 'SAGAWA' },
        { label: 'YAMATO', value: 'YAMATO' },
        { label: 'BlueDart', value: 'BlueDart' },
        { label: 'AFL/Fedex', value: 'AFL/Fedex' },
        { label: 'Aramex', value: 'Aramex' },
        { label: 'India Post', value: 'India Post' },
        { label: 'Professional', value: 'Professional' },
        { label: 'DTDC', value: 'DTDC' },
        { label: 'Overnite Express', value: 'Overnite Express' },
        { label: 'First Flight', value: 'First Flight' },
        { label: 'Delhivery', value: 'Delhivery' },
        { label: 'Lasership', value: 'Lasership' },
        { label: 'Yodel', value: 'Yodel' },
        { label: 'Other', value: 'Other' },
        { label: 'Amazon Shipping', value: 'Amazon Shipping' },
        { label: 'Seur', value: 'Seur' },
        { label: 'Correos', value: 'Correos' },
        { label: 'MRW', value: 'MRW' },
        { label: 'Endopack', value: 'Endopack' },
        { label: 'Chrono Express', value: 'Chrono Express' },
        { label: 'Nacex', value: 'Nacex' },
        { label: 'Otro', value: 'Otro' },
        { label: 'Correios', value: 'Correios' },
        { label: 'Toll Global Express', value: 'Toll Global Express' },
        { label: 'China Post', value: 'China Post' },
        { label: 'AUSSIE_POST', value: 'AUSSIE_POST' },
        { label: 'EUB', value: 'EUB' },
        { label: 'Australia Post', value: 'Australia Post' },
        { label: 'Yun Express', value: 'Yun Express' },
        { label: '4PX', value: '4PX' },
        { label: 'YANWEN', value: 'YANWEN' },
        { label: 'SF Express', value: 'SF Express' }
      ],
      shipMethod: [
        {
          label: 'Standard',
          value: 'Standard'
        },
        {
          label: 'Express',
          value: 'Express'
        }
      ],
      formSchema: {
        table: {
          // rowKey: 'sku',
          type: 'table',
          label: 'table',
          batch: false,
          width: 'auto',
          head: {
            amazonOrderId: {
              widget: 'text',
              label: '订单号',
              noLabel: true
            },
            trackingNumber: {
              widget: 'input',
              label: '运单号',
              required: true,
              noLabel: true
            },
            shipMethod: {
              widget: 'select',
              options: this.ways,
              label: '运输方式',
              required: true,
              noLabel: true
            }
          }
        }
      },
      value: {
        table: [
          { all: true },
          ...this.orderNumbers.map(e => ({
            ...e,
            amazonOrderId: e.amazonOrderId,
            trackingNumber: e.trackingNumbers || '',
            shipMethod: e.shipMethods || null,
            carrierCode: e.shipCarriers || null
          }))
        ]
      }
    }
  },
  mounted() {
    this.$refs.table.toggleAllSelection()
  },
  methods: {
    batch() {
      let {
        carrierCode,
        carrierName,
        shipMethod,
        trackingNumber
      } = this.value.table[0]
      this.$refs.table.selection.forEach(el => {
        this.$set(el, 'carrierCode', carrierCode)
        this.$set(el, 'carrierName', carrierName)
        this.$set(el, 'shipMethod', shipMethod)
        this.$set(el, 'trackingNumber', trackingNumber)
      })
      Object.keys(this.value.table[0]).forEach(key => {
        this.value.table[0][key] = null
      })
    },
    selectable(row, index) {
      return index == 0 ? false : true
    },
    validate() {
      // let el = [].find.call(
      //   document.querySelectorAll('.vali .el-input__inner'),
      //   e => e.value == ''
      // )
      let index = this.$refs.table.selection
        .filter(el => !el.all)
        .find(e => e.trackingNumber)
      if (index == -1) {
        return Promise.resolve()
      }
      let el = document.querySelectorAll('.vali .el-input__inner')[index]
      if (el) {
        this.$message.warning('请填写完整信息')
        return Promise.reject()
      }
      return Promise.resolve()
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          // storeId: this.orderNumbers[0].storeId,
          orders: this.$refs.table.selection
            .filter(el => !el.all)
            .map(e => ({
              storeId: e.storeId,
              amazonOrderId: e.amazonOrderId,
              shipDate: e.shipDate,
              carrierCode: e.carrierCode,
              carrierName: e.carrierName,
              shipMethod: e.shipMethod,
              trackingNumber: e.trackingNumber
            }))
        }
        return this.$api[`fbm/${'fbm-orderOrderFulfillment'}`](params)
      })
    }
  }
}
</script>
<style lang="scss">
.del-hover.el-button {
  opacity: 0;
  transition: 0.3s;
  &:hover {
    opacity: 1;
  }
}
</style>
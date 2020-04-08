<template>
  <div class="w600">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <el-switch v-model="isFile" active-text="上传文件" inactive-text="填写数据" class="mb20"></el-switch>
    <!-- <el-radio-group size="small" class="mb10" v-model="isFile">
      <el-radio-button :label="true">上传文件</el-radio-button>
      <el-radio-button :label="false">填写数据</el-radio-button>
    </el-radio-group>-->
    <div v-if="isFile">
      <el-button class="mb10" type="success" plain @click="download">下载模板</el-button>
      <new-form ref="form1" label-width="0px" :form-schema="formSchema1" :value="value1"></new-form>
    </div>
    <div v-else>
      <el-table :data="tableData" :show-header="false">
        <el-table-column label>
          <div class="flex" slot-scope="scope">
            <ElInput
              type="textarea"
              :rows="10"
              size="small"
              v-model="scope.row.text"
              placeholder="每行一个订单，订单号和运单号以逗号或制表符分隔"
            ></ElInput>
            <!-- <div style="width:100px">
              <ElButton
                size="small"
                style="padding:10px;margin-left: 10px"
                type="text"
                @click="tableData.splice(scope.$index, 0, {})"
                icon="el-icon-plus"
              ></ElButton>
              <ElButton
                size="small"
                style="padding:10px;margin: 0"
                v-if="tableData.length > 1"
                @click="tableData.splice(scope.$index, 1)"
                type="text"
                icon="el-icon-delete"
              ></ElButton>
            </div>-->
          </div>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { downloadFile } from 'Utils'
export default {
  data() {
    return {
      tableData: [{}],
      isFile: true,
      formSchema: {
        carrierCode: {
          widget: 'select',
          label: '运输方',
          filterable: true,
          required: true,
          options: [
            { label: 'USPS', value: 'USPS' },
            { label: 'UPS', value: 'UPS' },
            { label: 'UPSMI', value: 'UPSMI' },
            { label: 'FedEx', value: 'FedEx' },
            { label: 'DHL', value: 'DHL' },
            { label: 'Fastway', value: 'Fastway' },
            { label: 'GLS', value: 'GLS' },
            { label: 'GO!', value: 'GO!' },
            {
              label: 'Hermes Logistik Gruppe',
              value: 'Hermes Logistik Gruppe'
            },
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
          ]
        },
        shipMethod: {
          required: true,
          widget: 'select',
          label: '运输方式',
          options: [
            {
              label: 'Standard',
              value: 'Standard'
            },
            {
              label: 'Express',
              value: 'Express'
            }
          ]
        }
      },
      formSchema1: {
        file: {
          widget: 'upload',
          // label: 'upload',
          action: 'https://jsonplaceholder.typicode.com/posts/',
          required: true,
          full: true,
          limitSize: 500,
          fileLimit: ['excel'] // [word | excel | image | all] 文件类型
        }
      },
      value: {},
      value1: {}
    }
  },
  methods: {
    download() {
      this.$api[`fbm/fbm-orderOrderFulfillment-template`]({ a: 1 }).then(
        data => {
          downloadFile(data)
        }
      )
    },
    validate() {
      let forms = ['form']
      if (this.isFile) {
        forms.push('form1')
      } else {
        if (this.tableData[0] == null || this.tableData[0] === '') {
          this.$message.error('请填写数据')
          return Promise.reject()
        }
        // return Promise.resolve()
      }
      return Promise.all(forms.map(e => this.$refs[e].validate()))
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.value
        }
        if (this.isFile) {
          params = { ...params, file: this.value1.file[0] }
          // debugger
        } else {
          params.text = this.tableData[0].text
        }
        return this.$api[
          `fbm/${
            this.isFile
              ? 'fbm-orderOrderFulfillment-import'
              : 'fbm-orderOrderFulfillment-text'
          }`
        ](params)
      })
    }
  }
}
</script>
<template>
  <div class="w600">
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
  </div>
</template>
<script>
import { getCategorySelect } from 'Utils/table-render'
export default {
  props: ['siteId'],
  data() {
    return {
      formSchema: {
        siteId: {
          label: '源站点',
          widget: 'select',
          disabled: true,
          bind: {
            label: 'siteName',
            value: 'siteId'
          },
          options: this.$store.getters['storeInfo/currentPlat'].sites
        },
        dataType: {
          label: '抓取方式',
          widget: 'select',
          required: true,
          change: data => {
            this.value.dataSources = ''
            this.formSchema.dataSources.label =
              data.dataType == 1
                ? '关键词'
                : data.dataType == 2
                ? '店铺ID'
                : data.dataType == 3
                ? 'ASIN'
                : ''
            this.formSchema.dataSources.required =
              data.dataType == 1
                ? true
                : data.dataType == 2
                ? true
                : data.dataType == 3
                ? 'asin'
                : ''
          },
          options: this.$const['SS/scDataType']
        },
        pcId: {
          ...getCategorySelect({ siteId: this.$store.state.selling.curSiteId }),
          required: true,
          hidden: data => {
            return data.dataType !== 0 || data.dataType == null
          },
          label: '平台类目'
        },
        searchPages: {
          label: '抓取页数',
          hidden: data => {
            return data.dataType == 3 || data.dataType == 2
          },
          widget: 'number',
          max: 400,
          min: 1,
          placeholder: '抓取页数最大值为400',
          required: true,
          // options: Array.from({length: 10})
          //   .map((e, index) => ({ label: index + 1, value: index + 1 }))
        },
        dataSources: {
          hidden: data => {
            return data.dataType == 0 || data.dataType == null
          },
          widget: 'textarea',
          // required: true,
          rows: 6,
          required: true,
          label: '关键词/店铺ID/ASIN'
        }
      },
      value: {
        siteId: this.siteId,
        dataSources: ''
      }
    }
  },
  methods: {
    _submit() {
      return this.$refs.form.validate().then(() => {
        let { dataType, pcId, searchPages, dataSources } = this.value,
          params = { ...this.storeInfo, dataType, siteId: this.siteId }
        if (dataType == 0) {
          params = { ...params, pcId: pcId.slice().pop(), searchPages }
        } else {
          params = {
            ...params,
            searchPages,
            dataSources: dataSources.split(/[\n|\r\n]/)
          }
        }
        return this.$api[`ss/sellingSaveTask`](params)
      })
    }
  }
}
</script>
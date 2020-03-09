<template>
  <div class="add-trans-way">
    <el-form ref="form" :model="form" :disabled="disabled" :rules="rules" size="small" label-width="100px">
      <ElFormItem label="运输方式:" prop="transportType">
        <ElSelect v-model="form.transportType" placeholder class="normal-input" @change="handleChange">
          <ElOption
            v-for="item in allTransportList"
            :key="item.id"
            :disabled="item.disabled"
            :label="item.name"
            :value="item.id"
          ></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="type == 2" label="物品所在国家:" prop="countryIds">
        <ElSelect v-model="form.countryIds" multiple placeholder class="normal-input">
          <ElOption
            v-for="item in countries"
            :key="item.id"
            :disabled="item.disabled"
            :label="item.label"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="运费:" prop="freight">
        <el-input-number
          v-model="form.freight"
          controls-position="right"
          :min="1"
          :max="10000000"
          class="normal-input"
          :controls="false"
        ></el-input-number>
      </ElFormItem>
      <ElFormItem label="附加费:" prop="additionalCost">
        <el-input-number
          v-model="form.additionalCost"
          controls-position="right"
          :min="1"
          :max="10000000"
          class="normal-input"
          :controls="false"
        ></el-input-number>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode } from 'common/common'

export default {
  props: ['platformId', 'selectedList', 'type','countries'],
  data() {
    return {
      outerList: [],
      // countries: [],
      disabled: false,
      form: {
        countryIds: []
      },
      rules: {
        transportType: [{ required: true, message: '请选择运输方式' }],
        freight: [{ required: true, message: '请输入运费' }],
        additionalCost: [{ required: true, message: '请输入附加费' }]
      },
      params: {},
      allTransportList: []
    }
  },
  computed: {
    selectedId() {
      if (!this.selectedList) {
        return []
      }
      return this.selectedList.map(el => el.transportType)
    }
  },
  created() {
    this.getAllTransport()
    // this.getCountries()
  },
  methods: {
    setList(params) {
      this.outerList = params.foreignPermitTransportAreaList
    },
    handleChange(val) {
      let _el = this.selectedList.filter(e=> e.transportType === val)
      if (!_el.length) {
        this.countries.forEach(el => el.disabled = false)
        return
      }
      _el = _el.reduce((total, cur) => {
        return [].concat(total, cur.countryIds)
      }, [])
      this.countries.forEach(el => {
        if (_el.length && _el.indexOf(el.value) > -1) {
          el.disabled = true
        }else {
          el.disabled = false
        }
      })
    },
    getAllTransport() {
      fetchData({
        ...apis.SALE_GLOBAL_PRO_ITEM_GET_GLOBAL_TRANSPORTS,
        data: {
          platformId: this.platformId
        }
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.allTransportList = res.data.rows
          },
          () => {
            // this.message.error(res.data.msg)
          },
          true
        )
      })
    },
    getCountries() {
      fetchData({
        ...apis.LOGISTIC_COUNTRY_SEARCH_LIST_EBAY,
        data: {}
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.countries = res.data.rows.map(el => ({
            label: el.countryName,
            value: el.countryId
          }))
          },
          () => {
            // this.message.error(res.data.msg)
          },
          true
        )
      })
    },
    edit(params) {
      this.getAllTransport()
      let vm = this
      console.log(params)
      vm.form = params.row
      // return vm.$api[`order/returnPolicyInfo`]({
      //   ebayReturnPolicyId: params.ebayReturnPolicyId
      // }).then(({ rows }) => {
      //   vm.form = rows
      //   console.log(params.check)
      //   if (params.check) {
      //     vm.disabled = true
      //     vm.params = params
      //   } else if (params.copy) {
      //     delete vm.form.ebayReturnPolicyId
      //   }
      //   return Promise.resolve()
      // })
    },
    submitForm(cb) {
      console.log('submit')
      let vm = this
      vm.$refs['form'].validate(valid => {
        let transportTypeName, allCountryArray
        if (valid) {
          if (vm.params.check == true) {
            _data = false
          }
          transportTypeName = vm.allTransportList.find(
            el => el.id === vm.form.transportType
          ).name
          if (vm.type == 2) {
            allCountryArray = vm.form.countryIds
              .map(el => {
                return vm.countries.find(_el => _el.value === el).label
              })
              .join(',')
          }

          cb && cb({ ...vm.form, allCountryArray, transportTypeName })
        } else {
          console.log('error')
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.add-trans-way {
  background: #fff;
  .normal-input {
    width: 200px;
  }
}
</style>
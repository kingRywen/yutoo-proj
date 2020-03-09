<template>
  <div class="add-regional-freight">
    <el-form ref="form" :model="form" size="small" label-width="90px" :rules="rules">
      <el-form-item label="选择区域:" prop="logisticRegionId">
        <el-select v-model="form.logisticRegionId" clearable placeholder="请选择" class="normal-input">
          <el-option v-for="item in logisticRegionList" :label="item.label" :value="item.value" :key="item.id"></el-option>
          <!-- <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>-->
        </el-select>
        <el-button type="primary" class="marleft10" @click="handleArea">添加国家区域</el-button>
      </el-form-item>
      <el-form-item label="国家:" prop="logisticCountryList">
        <el-row>
          <ElCol :span="16" class="nation-border">
            <span class="item-border" v-for="(item, index) in form.logisticCountryList" :key="item.id">
              {{item.countryName}}
              <i class="el-icon-circle-close-outline" @click="handleDeleteCountry(index)"></i>
            </span>
          </ElCol>
          <ElCol :span="4">
            <el-button :disabled="disabled" type="primary" class="marleft10" @click="handleNation">选择更多国家</el-button>
          </ElCol>
        </el-row>
      </el-form-item>
      <el-form-item label="省:" prop="logisticProvinceList">
        <el-row>
          <ElCol :span="16" class="nation-border">
            <span class="item-border" v-for="(item, index) in form.logisticProvinceList" :key="item.id">
              {{item.provinceName}}
              <i class="el-icon-circle-close-outline" @click="handleDeleteProvince(index)"></i>
            </span>
          </ElCol>
          <ElCol :span="4">
            <el-button type="primary" :disabled="disabled" class="marleft10" @click="handleProvince">选择更多省</el-button>
          </ElCol>
        </el-row>
      </el-form-item>
      <el-form-item label="运费算法类型:">
        <el-select v-model="form.freightAlgorithmType" class="normal-input">
          <el-option label="起重续价" :value="1"></el-option>
          <el-option label="区间价格" :value="2"></el-option>
          <el-option label="重量体积" :value="3"></el-option>
          <el-option label="海运体积" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币种选择:" prop="currency">
        <el-select v-model="form.currency" class="normal-input">
          <el-option v-for="item in currencyList" :label="item.label" :value="item.value" :key="item.id"></el-option>
          <!-- <el-option label="起重续假" value="起重续假"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item label="费用折扣:" prop="discount">
        <el-input v-model="form.discount" type="number" class="normal-input"></el-input>
        <span class="red-remaind">（1标识不打折,打8折,填写:0.8）</span>
      </el-form-item>
      <section v-if="form.freightAlgorithmType == 1">
        <el-form-item label-width="30px">
          <ElRow>
            <ElCol :span="14">
              <ElFormItem prop="lifting" label="起重:" label-width="60px">
                <el-input v-model="form.lifting" class="normal-input"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="4">
              <ElFormItem prop="unit" label-width="90px">
                <el-select v-model="form.unit" class="small-input marleft10">
                  <el-option v-for="item in unitList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </el-form-item>
        <el-form-item label-width="30px">
          <ElRow>
            <ElCol :span="5">
              <ElFormItem prop="startingPrice" label="起价:" label-width="60px">
                <el-input v-model="form.startingPrice" class="small-input"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem prop="fuelCost" label="燃油费:" label-width="68px">
                <el-input v-model="form.fuelCost"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem prop="fuelCostTax" label="燃油费费率:" label-width="90px">
                <el-input v-model="form.fuelCostTax"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="5">
              <ElFormItem prop="otherExpenses" label="其他费用:" label-width="80px">
                <el-input v-model="form.otherExpenses"></el-input>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </el-form-item>
        <el-form-item label-width="30px">
          <ElRow>
            <ElCol :span="14">
              <ElFormItem prop="continuousWeight" label="续重:" label-width="60px">
                <el-input v-model="form.continuousWeight" class="normal-input"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="4">
              <ElFormItem prop="unit" label-width="90px">
                <el-select v-model="form.unit" class="small-input marleft10">
                  <el-option v-for="item in unitList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                  <!-- <el-option label="起重续假" value="起重续假"></el-option> -->
                </el-select>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </el-form-item>
        <el-form-item label="续价:" prop="continuationPrice">
          <el-input v-model="form.continuationPrice" class="small-input"></el-input>
        </el-form-item>
        <el-form-item label-width="0px">
          <ElRow>
            <ElCol :span="14">
              <ElFormItem prop="maximumWeight" label="最大重量:" label-width="90px">
                <el-input v-model="form.maximumWeight" class="normal-input"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="4">
              <ElFormItem prop="unit" label-width="100px">
                <el-select v-model="form.unit" class="small-input marleft10">
                  <el-option v-for="item in unitList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </el-form-item>
        <el-form-item prop="activateFlag" label-width="90px">
          <el-checkbox
            :true-label="1"
            :false-label="0"
            class="isChecked"
            v-model="form.calculationFactorFlag"
          >当体积重大于总重量，取体积重</el-checkbox>
          <span class="red-remaind">(提示：长度（厘米cm）X宽度（厘米cm）X高度（厘米cm）/计重因子 = 以公斤为单位的体积重量)</span>
        </el-form-item>
        <el-form-item v-if="form.calculationFactorFlag" label="计算因子:" prop="calculationFactor">
          <el-input v-model="form.calculationFactor" type="number" class="normal-input"></el-input>
          <span class="red-remaind">（提示：如5000,6000,8000）</span>
        </el-form-item>
      </section>
      <section v-if="form.freightAlgorithmType == 2 ">
        <el-form-item prop="activateFlag" label-width="90px">
          <el-checkbox
            :true-label="1"
            :false-label="0"
            class="isChecked"
            v-model="form.calculationFactorFlag"
          >当体积重大于总重量，取体积重</el-checkbox>
          <span class="red-remaind">(提示：长度（厘米cm）X宽度（厘米cm）X高度（厘米cm）/计重因子 = 以公斤为单位的体积重量)</span>
        </el-form-item>
        <el-form-item v-if="form.calculationFactorFlag" label="计算因子:" prop="calculationFactor">
          <el-input v-model="form.calculationFactor" type="number" class="normal-input"></el-input>
          <span class="red-remaind">（提示：如5000,6000,8000）</span>
        </el-form-item>

        <el-row>
          <ElCol :span="24">
            <el-button size="small" type="primary" @click="addSection">添加区间</el-button>
            <el-button size="small" type="primary" @click="handleDelete()">删除</el-button>
          </ElCol>
          <ElCol :span="24" class="mb20">
            <el-table
              :data="form.logisticTransporterIntervalPriceList"
              tooltip-effect="dark"
              style="width: 100%"
              border
              @selection-change="handleSelectionChange"
              class="area-add"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column label="重量" align="center">
                <template slot-scope="scope">
                  <!-- <ElInput size="small" class="min-input" v-model="scope.row.weightStart"></ElInput>~ -->
                  <el-input-number
                    v-model="scope.row.weightStart"
                    size="small"
                    class="min-input"
                    :controls="false"
                    :min="1"
                  ></el-input-number>~
                  <!-- <ElInput size="small" class="min-input" v-model="scope.row.weightEnd"></ElInput> -->
                  <el-input-number
                    v-model="scope.row.weightEnd"
                    size="small"
                    class="min-input"
                    :controls="false"
                    :min="scope.row.weightStart"
                  ></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.quantityStart"
                    size="small"
                    class="min-input"
                    :controls="false"
                    :min="1"
                  ></el-input-number>~
                  <!-- <ElInput size="small" class="min-input" v-model="scope.row.quantityStart"></ElInput> -->
                  <el-input-number
                    v-model="scope.row.quantityEnd"
                    size="small"
                    class="min-input"
                    :controls="false"
                    :min="scope.row.quantityStart"
                  ></el-input-number>
                  <!-- <ElInput size="small" class="min-input" v-model="scope.row.quantityEnd"></ElInput> -->
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center">
                <template slot-scope="scope">
                  <ElInput size="small" class="min-input" v-model="scope.row.weight"></ElInput>g/
                  <ElInput size="small" class="min-input" v-model="scope.row.price"></ElInput>
                </template>
              </el-table-column>
              <el-table-column label="固定燃油费" width="82px" align="center">
                <template slot-scope="scope">
                  <ElInput size="small" class="min-input" v-model="scope.row.fuelCost"></ElInput>
                </template>
              </el-table-column>
              <el-table-column label="燃油费费率" width="82px" align="center">
                <template slot-scope="scope">
                  <ElInput size="small" class="min-input" v-model="scope.row.fuelCostTax"></ElInput>
                </template>
              </el-table-column>
              <el-table-column label="其他费用" width="82px" align="center">
                <template slot-scope="scope">
                  <ElInput size="small" class="min-input" v-model="scope.row.otherExpenses"></ElInput>
                </template>
              </el-table-column>
              <el-table-column label="费用折扣" width="82px" align="center">
                <template slot-scope="scope">
                  <ElInput size="small" class="min-input" v-model="scope.row.discount"></ElInput>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="46px" align="center">
                <template slot-scope="scope">
                  <el-button
                    class="normal-table-icon"
                    @click="handleDelete(scope.$index, scope.row)"
                    icon="el-icon-delete"
                    size="mini"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </ElCol>
        </el-row>
      </section>
      <section v-if="form.freightAlgorithmType == 4 || form.freightAlgorithmType == 3">
        <el-form-item v-if="form.freightAlgorithmType == 3" label="体积重量，每立方厘米每千克价格:" label-width="208px" prop="price">
          <el-input v-model="form.price" style="width: 384px;"></el-input>
        </el-form-item>
        <el-form-item v-else label="每立方米价格:" prop="cubicMetrePrice" label-width="90px">
          <el-input v-model="form.cubicMetrePrice" class="normal-input"></el-input>
        </el-form-item>
        <el-form-item label="最大重量:">
          <ElRow>
            <ElCol :span="14">
              <ElFormItem prop="maximumWeight">
                <el-input v-model="form.maximumWeight" class="normal-input"></el-input>
              </ElFormItem>
            </ElCol>
            <ElCol :span="4">
              <ElFormItem prop="unit" label-width="60px">
                <el-select v-model="form.unit" class="small-input marleft10">
                  <el-option v-for="item in unitList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </el-form-item>
        <el-form-item label="计算因子:" prop="calculationFactor">
          <el-input v-model="form.calculationFactor" type="number" class="normal-input"></el-input>
          <span class="red-remaind">（提示：如5000,6000,8000）</span>
        </el-form-item>
      </section>
      <el-form-item label="预计到达天数:">
        <ElRow>
          <ElCol :span="4">
            <ElFormItem prop="predictTimeStart">
              <el-input-number
                v-model="form.predictTimeStart"
                size="small"
                class="small-input"
                :controls="false"
                :min="1"
              ></el-input-number>~
              <!-- <el-input v-model="form.predictTimeStart" class="small-input"></el-input>~ -->
            </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElFormItem prop="predictTimeEnd">
              <el-input-number
                v-model="form.predictTimeEnd"
                size="small"
                class="small-input"
                :controls="false"
                :min="form.predictTimeStart"
              ></el-input-number>
              <!-- <el-input v-model="form.predictTimeEnd" class="small-input"></el-input> -->
            </ElFormItem>
          </ElCol>
        </ElRow>
      </el-form-item>
    </el-form>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      // rules: {
      // logisticRegionId: [{ required: true, message: '不能为空' }],
      // logisticCountryList: [{ required: true, message: '不能为空' }],
      // logisticProvinceList: [{ required: true, message: '不能为空' }]
      // currency: [{ required: true, message: '不能为空' }],
      // discount: [{ required: true, message: '不能为空' }],
      // lifting: [{ required: true, message: '不能为空' }],
      // unit: [{ required: true, message: '不能为空' }],
      // startingPrice: [{ required: true, message: '不能为空' }],
      // fuelCost: [{ required: true, message: '不能为空' }],
      // fuelCostTax: [{ required: true, message: '不能为空' }],
      // otherExpenses: [{ required: true, message: '不能为空' }],
      // continuousWeight: [{ required: true, message: '不能为空' }],
      // continuationPrice: [{ required: true, message: '不能为空' }],
      // calculationFactor: [{ required: true, message: '不能为空' }],
      // price: [{ required: true, message: '不能为空' }],
      // cubicMetrePrice: [{ required: true, message: '不能为空' }],
      // maximumWeight: [{ required: true, message: '不能为空' }],
      // predictTimeStart: [{ required: true, message: '不能为空' }],
      // predictTimeEnd: [{ required: true, message: '不能为空' }]
      // },
      rules: vm.$formValidate([
        {
          label: '选择区域',
          value: 'logisticRegionId'
        },
        {
          label: '国家',
          value: 'logisticCountryList'
        },
        {
          label: '省',
          value: 'logisticProvinceList'
        },
        {
          label: '预计天数',
          value: 'predictTimeStart'
        },
        {
          label: '预计天数',
          value: 'predictTimeEnd'
        }
      ]),
      id: 0,
      form: {
        logisticRegionId: null,
        freightAlgorithmType: 1,
        logisticTransporterIntervalPriceList: [
          {
            id: 0
          }
        ],
        logisticCountryList: [],
        logisticProvinceList: [],
        maximumWeight: null
      },
      tableData3: [{}],
      selectData: [],
      disabled: true,
      params: {},
      isEdit: false
    }
  },
  created() {
    this.getLogisticRegionList()
    this.getCurrencyList()
    this.getUnitList()
  },
  mounted() {},
  computed: {
    ...mapState('logistics', ['logisticRegionList', 'currencyList', 'unitList'])
  },
  watch: {
    'form.logisticRegionId'(val, oldVal) {
      let vm = this
      console.log(val)
      if (val || val == 0) {
        console.log(val)
        console.log(oldVal)
        if (oldVal == null && vm.isEdit) {
          vm.disabled = false
          return
        }
        let logisticRegionId = val
        vm.disabled = false
        this.$api['warehouse/forwarderTransportTypeRegionGet']({
          logisticRegionId
        }).then(data => {
          let { rows } = data
          vm.$set(vm.form, 'logisticCountryList', rows.logisticCountryList)
          vm.$set(vm.form, 'logisticProvinceList', rows.logisticProvinceList)
        })
      } else {
        vm.disabled = true
        vm.$set(vm.form, 'logisticCountryList', null)
        vm.$set(vm.form, 'logisticProvinceList', null)
      }
    },
    'form.freightAlgorithmType'(val) {
      let vm = this
      let form = {
        logisticForwarderFreightId: vm.form.logisticForwarderFreightId || null,
        logisticRegionId: vm.form.logisticRegionId,
        freightAlgorithmType: val,
        logisticTransporterIntervalPriceList: [{ id: 0 }],
        logisticCountryList: vm.form.logisticCountryList,
        logisticProvinceList: vm.form.logisticProvinceList,
        predictTimeEnd: vm.form.predictTimeEnd,
        predictTimeStart: vm.form.predictTimeStart
      }
      vm.form = JSON.parse(JSON.stringify(form))
    }
  },
  methods: {
    ...mapActions('logistics', [
      'getLogisticRegionList',
      'getCurrencyList',
      'getUnitList'
    ]),
    getParams(params) {
      this.params = params
    },
    edit(params) {
      let vm = this
      vm.isEdit = true
      vm.$api['warehouse/forwarderTransportTypeRegionFreightget'](params).then(
        data => {
          let { rows } = data
          vm.form.freightAlgorithmType = rows.freightAlgorithmType
          vm.$nextTick(() => {
            vm.form = rows
            vm.form.intervalPriceList &&
              (vm.form.logisticTransporterIntervalPriceList =
                vm.form.intervalPriceList)
          })
        }
      )
    },
    submitForm(cb) {
      let _data = JSON.parse(JSON.stringify(this.form))
      let vm = this
      _data.logisticForwarderTransportTypeId =
        vm.params.logisticForwarderTransportTypeId
      vm.$refs['form'].validate(valid => {
        if (valid) {
          _data.logisticCountryIdList = _data.logisticCountryList.map(
            item => item.countryId
          )
          _data.logisticProvinceIdList = _data.logisticProvinceList.map(
            item => item.provinceId
          )
          _data.logisticTransporterIntervalPriceList &&
            _data.logisticTransporterIntervalPriceList.map(item => {
              if (item.id || item.id == 0) {
                delete item.id
              }
            })
          _data.calculationFactorFlag = _data.calculationFactorFlag ? 1 : 0
          cb && cb(_data)
        } else {
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleDelete(index) {
      let vm = this
      if (index || index == 0) {
        vm.form.logisticTransporterIntervalPriceList.splice(index, 1)
      } else {
        if (vm.selectData.length) {
          vm.$set(
            vm.form,
            'logisticTransporterIntervalPriceList',
            vm.form.logisticTransporterIntervalPriceList.filter(
              item => !vm.selectData.find(el => el.id == item.id)
            )
          )
        }
      }
    },
    addSection() {
      let vm = this
      vm.form.logisticTransporterIntervalPriceList.push({
        id: ++vm.id
      })
    },
    handleDeleteCountry(index) {
      let vm = this
      let countryIdList = JSON.parse(
        JSON.stringify(vm.form)
      ).logisticCountryList.map(item => item.countryId)
      countryIdList.splice(index, 1)
      let provinceIdList = JSON.parse(
        JSON.stringify(vm.form)
      ).logisticProvinceList.map(item => item.provinceId)
      let params = {
        countryIdList,
        provinceIdList,
        logisticRegionId: vm.form.logisticRegionId
      }
      vm.$api['warehouse/forwarderTransportTypeCountrySelectRemove'](
        params
      ).then(data => {
        let { rows } = data
        vm.$set(vm.form, 'logisticCountryList', rows.logisticCountryList)
        vm.$set(vm.form, 'logisticProvinceList', rows.logisticProvinceList)
      })
    },
    handleDeleteProvince(index) {
      let vm = this
      let countryIdList = JSON.parse(
        JSON.stringify(vm.form)
      ).logisticCountryList.map(item => item.countryId)
      let provinceIdList = JSON.parse(
        JSON.stringify(vm.form)
      ).logisticProvinceList.map(item => item.provinceId)
      provinceIdList.splice(index, 1)
      let params = {
        countryIdList,
        provinceIdList,
        logisticRegionId: vm.form.logisticRegionId
      }
      vm.$api['warehouse/forwarderTransportTypeProvinceSelectRemove'](
        params
      ).then(data => {
        let { rows } = data
        vm.$set(vm.form, 'logisticCountryList', rows.logisticCountryList)
        vm.$set(vm.form, 'logisticProvinceList', rows.logisticProvinceList)
      })
    },
    handleArea() {
      let vm = this
      vm.$refs.dialog.$dialog({
        title: '选择区域',
        width: '100%',
        height: '810px',
        visible: true,
        fullscreen: true,
        display: false,
        component: () => import('./addArea.vue')
      })
    },
    handleNation() {
      let vm = this
      let logisticCountryList = vm.form.logisticCountryList
      let logisticProvinceList = vm.form.logisticProvinceList
      let logisticRegionId = vm.form.logisticRegionId
      vm.$refs.dialog.$dialog({
        title: '选择国家',
        width: '760px',
        visible: true,
        okBtnText: '选择',
        reserveSelection: 'countryId',
        component: () => import('./addNation.vue'),
        childFn: [
          {
            name: 'getList',
            params: {
              title: '选择更多国家',
              logisticCountryList,
              logisticProvinceList,
              logisticRegionId,
              url: 'warehouse/forwarderTransportTypeNationSelectPage'
            }
          }
        ],
        submitForm: data => {
          vm.$api['warehouse/forwarderTransportTypeCountrySelect'](data).then(
            data => {
              let { rows } = data
              vm.form.logisticCountryList = rows.logisticCountryList
              vm.form.logisticProvinceList = rows.logisticProvinceList
            }
          )
        }
      })
    },
    handleProvince() {
      let vm = this
      let logisticCountryList = vm.form.logisticCountryList
      let logisticProvinceList = vm.form.logisticProvinceList
      let logisticRegionId = vm.form.logisticRegionId
      vm.$refs.dialog.$dialog({
        title: '选择省',
        width: '760px',
        visible: true,
        okBtnText: '选择',
        reserveSelection: 'provinceId',
        component: () => import('./addNation.vue'),
        childFn: [
          {
            name: 'getList',
            params: {
              title: '选择更多省',
              logisticCountryList,
              logisticProvinceList,
              logisticRegionId,
              url: 'warehouse/forwarderTransportTypeProvinceSelectPage'
            }
          }
        ],
        submitForm(data) {
          vm.$api['warehouse/forwarderTransportTypeProvinceSelect'](data).then(
            data => {
              let { rows } = data
              vm.form.logisticCountryList = rows.logisticCountryList
              vm.form.logisticProvinceList = rows.logisticProvinceList
            }
          )
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add-regional-freight {
  background: #fff;
  .normal-input {
    width: 502px;
  }
  .area-add {
    .el-input-number.is-without-controls .el-input__inner {
      padding: 0 !important;
    }
  }
  .red-remaind {
    color: red;
  }
  .small-input {
    width: 90px;
    margin-right: 10px;
    .el-input-number.is-without-controls .el-input__inner {
      padding: 0;
    }
  }
  .min-input {
    width: 50px;
    .el-input-number.is-without-controls .el-input__inner {
      padding: 0;
    }
  }
  .el-input__inner {
    padding: 4px;
  }
  .nation-border {
    border: 1px solid #e6e6e6;
    height: 82px;
    overflow: auto;
    .item-border {
      display: inline-block;
      height: 34px;
      padding: 0 16px;
      margin-left: 4px;
      // margin-top: 4px;
      overflow: hidden;
      background: #f1f1f1;
      position: relative;
      border-radius: 8px;
      .el-icon-circle-close-outline {
        font-size: 16px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
}
</style>

<template>
  <div class="add-transport">
    <el-form ref="form" size="small" :model="form" :disabled="isViewFlag" label-width="96px" :rules="rules">
      <simple-table label="运输方">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发货仓库:" prop="warehouseIds">
              <el-select
                v-model="form.warehouseIds"
                multiple
                clearable
                collapse-tags
                placeholder="(多选)"
                class="normal-input"
              >
                <el-option
                  v-for="item in WmWarehouseGlobalLists"
                  :label="item.label"
                  :value="item.value"
                  :key="item.id"
                ></el-option>
                <!-- <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方:" prop="logisticTransportationId">
              <el-select v-model="form.logisticTransportationId" clearable placeholder="请选择" class="normal-input">
                <el-option v-for="item in transportationList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                <!-- <el-option label="区域一" :value="1"></el-option>
                <el-option label="区域二" :value="0"></el-option>-->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </simple-table>
      <simple-table label="运输方API配置">
        <el-row>
          <el-col :span="12" v-for="item in form.logisticTransportApiDataList" :key="item.id">
            <el-form-item :label="item.fieldName">
              <el-input v-model="item.data" class="normal-input"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="Token:">
              <el-input v-model="form.Token" class="normal-input" size="small"></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>
      </simple-table>
      <simple-table label="面单设置">
        <el-form-item label-width="20px">
          <ElRow>
            <ElCol :span="6">
              <ElFormItem prop="faceSheetType">
                <el-radio-group v-model="form.faceSheetType">
                  <el-radio :label="1">API接口面单</el-radio>
                  <el-radio :label="0">自定义面单</el-radio>
                </el-radio-group>
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <el-form-item v-if="!form.faceSheetType" prop="faceSheetId">
                <el-select clearable v-model="form.faceSheetId" placeholder="请选择" class="normal-input marleft10">
                  <el-option
                    v-for="item in customFaceSheetTempList"
                    :label="item.label"
                    :value="item.value"
                    :key="item.id"
                  ></el-option>
                  <!-- <el-option label="区域一" :value="1"></el-option>
                  <el-option label="区域二" :value="0"></el-option>-->
                </el-select>
              </el-form-item>
            </ElCol>
          </ElRow>
        </el-form-item>
      </simple-table>
      <simple-table label="报关单设置">
        <el-form-item label-width="20px">
          <ElRow>
            <ElCol :span="6">
              <ElFormItem prop="customsDeclarationType">
                <el-radio-group v-model="form.customsDeclarationType">
                  <el-radio :label="1">通用报关单</el-radio>
                  <el-radio :label="0">自定义报关单</el-radio>
                </el-radio-group>
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <el-form-item v-if="!form.customsDeclarationType" prop="customsDeclarationId">
                <el-select
                  clearable
                  v-model="form.customsDeclarationId"
                  placeholder="请选择"
                  class="normal-input marleft10"
                >
                  <el-option
                    v-for="item in customManifestTempList"
                    :label="item.label"
                    :value="item.value"
                    :key="item.id"
                  ></el-option>
                  <!-- <el-option label="区域一" :value="1"></el-option>
                  <el-option label="区域二" :value="0"></el-option>-->
                </el-select>
              </el-form-item>
            </ElCol>
          </ElRow>
        </el-form-item>
      </simple-table>
      <simple-table label="报关参数设置">
        <el-form-item label="包裹申报规则" prop="logisticDeclareId">
          <el-select clearable v-model="form.logisticDeclareId" placeholder="请选择" class="normal-input">
            <el-option v-for="item in declareList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            <!-- <el-option label="区域一" :value="1"></el-option>
            <el-option label="区域二" :value="0"></el-option>-->
          </el-select>
        </el-form-item>
      </simple-table>
      <el-form-item prop="activateFlag" label-width="0px">
        <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      rules: {
        warehouseIds: [{ required: true, message: '请选择发货仓库' }],
        logisticTransportationId: [{ required: true, message: '请选择运输方' }],
        logisticTransportApiDataList: [],
        logisticDeclareId: [{ required: true, message: '请选择包裹申报规则' }],
        faceSheetType: [{ required: true, message: '请选择面单' }],
        faceSheetId: [{ required: true, message: '请选择自定义面单' }],
        customsDeclarationType: [{ required: true, message: '请选择报关单' }],
        customsDeclarationId: [
          { required: true, message: '请选择自定义报关单' }
        ]
      },
      form: {
        warehouseIds: [],
        logisticForwarderId: null,
        logisticTransportApiDataList: [],
        logisticDeclareId: null,
        activateFlag: 0,
        faceSheetType: 1,
        faceSheetId: null,
        customsDeclarationType: 1,
        customsDeclarationId: null
      },
      isViewFlag: false,
      isEdit: false
    }
  },
  watch: {
    'form.logisticTransportationId'(val) {
      let params = {}
      let vm = this
      console.log(val)
      if (val && !vm.isEdit) {
        params = {
          logisticTransportationId: val
        }
        vm.$api['warehouse/forwarderApiFieldGet'](params).then(data => {
          let { rows } = data
          vm.$set(vm.form, 'logisticTransportApiDataList', rows)
        })
      }
    },
    'form.faceSheetType'(val) {
      if (!val) {
        // this.form.faceSheetId = null
      }
    },
    'form.customsDeclarationType'(val) {
      if (!val) {
        // this.form.customsDeclarationId = null
      }
    }
    // 'form.logisticTransportApiDataList': {
    //   deep: true,
    //   handler(val) {
    //     console.log(val)
    //   }
    // }
  },
  created() {},
  mounted() {
    this.getWmWarehouseGlobalLists()
    this.getTransportationList()
    this.getCustomFaceSheetTempList()
    this.getCustomManifestTempList()
    this.getDeclareList()
  },
  computed: {
    ...mapState('logistics', [
      'WmWarehouseGlobalLists',
      'transportationList',
      'customFaceSheetTempList',
      'customManifestTempList',
      'declareList'
    ])
  },
  methods: {
    ...mapActions('logistics', [
      'getWmWarehouseGlobalLists',
      'getTransportationList',
      'getCustomFaceSheetTempList',
      'getCustomManifestTempList',
      'getDeclareList'
    ]),
    edit(params) {
      let vm = this
      vm.isViewFlag = params.isViewFlag
      this.$api['warehouse/transportGet'](params)
        .then(data => {
          let { rows } = data
          vm.isEdit = true
          vm.form = rows
          vm.$emit('loading')
        })
        .catch(() => {
          vm.$emit('loading')
        })
    },
    handleView() {
      this.isViewFlag = true
    },
    resetForm() {},
    submitForm(cb) {
      let vm = this
      let data = JSON.parse(JSON.stringify(this.form))
      if (data.faceSheetType) {
        delete data.faceSheetId
      }
      if (data.customsDeclarationType) {
        delete data.customsDeclarationId
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (vm.isViewFlag) {
            data = false
          }
          cb && cb(data)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add-transport {
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
  .normal-input {
    width: 380px;
  }
}
</style>

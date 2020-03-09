<template>
  <div class="freight">
    <el-form ref="form" :rules="rules" class="form" :model="form" size="small" label-width="90px">
      <el-row>
        <ElCol :span="24">
          <el-form-item label="发货仓库：" prop="warehouseId">
            <el-select v-model="form.warehouseId" clearable class="small-normal" placeholder="请选择活动区域">
              <el-option
                v-for="item in wmWarehouseGlobalAllList"
                :label="item.label"
                :value="item.value"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item label-width="0" style="margin-bottom: 0;">
            <el-row>
              <ElCol :span="12">
                <el-form-item prop="nationId" label="到达国家：">
                  <el-select v-model="form.nationId" clearable placeholder="请选择活动区域">
                    <el-option v-for="item in nationList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </ElCol>
              <ElCol :span="10" class="marleft10">
                <el-form-item prop="provinceId">
                  <el-select v-model="form.provinceId" clearable placeholder="请选择活动区域">
                    <el-option v-for="item in provinceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </ElCol>
            </el-row>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item label="运输方式：" prop="logisticTransportTypeList">
            <el-select
              v-model="form.logisticTransportTypeList"
              multiple
              clearable
              collapse-tags
              placeholder="请选择"
              class="small-normal"
            >
              <el-option
                v-for="item in logisticTransportTypeList"
                :label="item.label"
                :value="item.value"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item label-width="0" style="margin-bottom: 0;">
            <el-row>
              <ElCol :span="10">
                <el-form-item prop="length" label="体积：">
                  <span>长</span>
                  <el-input-number v-model="form.length" :min="0" :controls="false" class="small-input"></el-input-number>
                  <span>CM</span>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item prop="width">
                  宽
                  <el-input-number v-model="form.width" :min="0" :controls="false" class="small-input"></el-input-number>CM
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item prop="height">
                  高
                  <el-input-number v-model="form.height" :min="0" :controls="false" class="small-input"></el-input-number>CM
                </el-form-item>
              </ElCol>
            </el-row>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item label="货物重量：" prop="weight">
            <!-- <el-input v-model="form.weight" type="number" class="small-normal"></el-input>G -->
            <el-input-number v-model="form.weight" :min="0" :controls="false" class="small-normal"></el-input-number>G
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item label="数量：" prop="num">
            <el-input-number v-model="form.num" :min="0" :controls="false" class="small-normal"></el-input-number>个
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item class="sub-btn">
            <el-button type="primary" @click="onSubmit">提交查询</el-button>
          </el-form-item>
        </ElCol>
      </el-row>
    </el-form>
    <!-- 自定义表单 -->
    <!-- <forms @submit="submit"></forms> -->
    <!-- 表格 -->
    <yt-table :selection="false" :columns="columns" :data="tableData"></yt-table>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Forms from './form'
export default {
  data() {
    let vm = this
    return {
      rules: vm.$formValidate([
        {
          label: '发货仓库',
          value: 'warehouseId'
        },
        {
          label: '到达国家',
          value: 'nationId'
        },
        {
          label: '到达省',
          value: 'provinceId'
        },
        {
          label: '运输方式',
          value: 'logisticTransportTypeList'
        },
        {
          label: '长',
          value: 'length',
          type: 'number'
        },
        {
          label: '宽',
          value: 'width',
          type: 'number'
        },
        {
          label: '高',
          value: 'height',
          type: 'number'
        },
        {
          label: '货物重量',
          value: 'weight',
          type: 'number'
        },
        {
          label: '数量',
          value: 'num',
          type: ['number', 0]
        }
      ]),
      form: {
        warehouseId: null,
        nationId: null,
        provinceId: null,
        length: null,
        width: null,
        height: null,
        weight: null,
        num: null,
        logisticTransportTypeList: []
      },
      columns: [
        {
          label: '区域',
          value: 'logisticRegionName'
        },
        {
          label: '运输商名称',
          value: 'forwarderName'
        },
        {
          label: '运输方式',
          value: 'logisticTransportType'
        },
        {
          label: '运费',
          value: 'freight'
        },
        {
          label: '挂号费',
          value: 'registrationFee'
        },
        {
          label: '处理费',
          value: 'handlingFee'
        },
        {
          label: '折扣',
          value: 'discount'
        },
        {
          label: '折后总价',
          value: 'discountPrice'
        },
        {
          label: '当前币种折后总价',
          value: 'discountPriceCurrency'
        },
        {
          label: '天数',
          value: 'predictTime'
        },
        {
          label: '物流属性限制',
          value: 'logisticTypeArray'
        },
        {
          label: '描述',
          value: 'remark'
        }
      ],
      tableData: [],
      provinceList: [],
      logisticTransportTypeList: []
    }
  },
  watch: {
    'form.nationId'(val) {
      let vm = this
      vm.provinceList = []
      vm.form.provinceId = ''
      if (val) {
        vm.$api['warehouse/provinceList']({
          countryId: val
        }).then(data => {
          let { rows } = data
          vm.provinceList = rows.map(item => {
            return {
              label: item.provinceName,
              value: item.provinceId
            }
          })
        })
      }
    },
    'form.warehouseId'(val) {
      let vm = this
      vm.logisticTransportTypeList = []
      vm.form.logisticTransportTypeList = []
      if (val) {
        vm.$api['warehouse/freightTransportList']({
          warehouseId: val
        }).then(data => {
          let { rows } = data
          vm.logisticTransportTypeList = rows.map(item => {
            return {
              label: item.transportTypeName,
              value: item.logisticTransportTypeId
            }
          })
        })
      }
    }
  },
  created() {
    this.getNationList()
    this.getWmWarehouseGlobalAllList()
  },
  computed: {
    ...mapState('logistics', ['nationList', 'wmWarehouseGlobalAllList'])
  },
  methods: {
    ...mapActions('logistics', [
      'getNationList',
      'getWmWarehouseGlobalAllList'
    ]),
    submit(form) {
      console.log(form)
    },
    onSubmit() {
      let vm = this
      let params = vm.form
      vm.$refs['form'].validate(valid => {
        if (valid) {
          vm.$api['warehouse/freightForecast'](params).then(data => {
            let { rows } = data
            vm.tableData = rows
            vm.tableData.map(item => {
              item.predictTime = `${item.predictTimeStart}~${
                item.predictTimeEnd
              }`
            })
            vm.$refs['form'].resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  components: {
    Forms
  }
}
</script>
<style lang="scss">
.freight {
  padding: 20px;
  .form {
    width: 560px;
  }
  .small-input {
    width: 90px;
  }
  .small-normal {
    width: 400px;
  }
  .sub-btn {
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
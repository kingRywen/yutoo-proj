<template>
  <div>
    <el-form ref="form" :model="formData" size="small" :rules="rules" label-width="120px">
      <el-row>
        <ElCol :span="12">
          <ElFormItem label="选择仓库" prop="wmWarehouseId">
            <el-select v-model="formData.wmWarehouseId">
              <ElOption v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </el-select>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="选择区域" prop="wmWarehouseDivisionId">
            <el-select
              v-model="formData.wmWarehouseDivisionId"
              :loading="loading"
              :no-data-text="formData.wmWarehouseId ? '无数据':'请先选择仓库'"
            >
              <ElOption v-for="item in regionalList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </el-select>
          </ElFormItem>
        </ElCol>
      </el-row>

      <div class="wrapper" v-if="formData.isSingle" :key="formData.isSingle">
        <ElFormItem v-if="showBatchBtn">
          <el-button type="primary" size="small" @click="formData.isSingle = false">批量生成编码</el-button>
        </ElFormItem>
        <ElFormItem label="行" prop="single.row" :rules="getRules('行')">
          <el-input-number
            v-model="formData.single.row"
            controls-position="right"
            class="per100"
            :precision="0"
            :min="1"
            :max="99999999999"
            placeholder
          ></el-input-number>
        </ElFormItem>
        <ElFormItem label="列" prop="single.col" :rules="getRules('列')">
          <el-input-number
            v-model="formData.single.col"
            controls-position="right"
            :precision="0"
            :min="1"
            class="per100"
            :max="99999999999"
            placeholder
          ></el-input-number>
        </ElFormItem>
        <ElFormItem label="层" prop="single.layer" :rules="getRules('层')">
          <el-input-number
            v-model="formData.single.layer"
            controls-position="right"
            :precision="0"
            class="per100"
            :min="1"
            :max="99999999999"
            placeholder
          ></el-input-number>
        </ElFormItem>
      </div>
      <div class="wrapper" v-if="!formData.isSingle" :key="formData.isSingle">
        <ElFormItem prop="row">
          <el-button type="primary" size="small" @click="formData.isSingle = true">取消批量生成编码</el-button>
        </ElFormItem>
        <ElFormItem>
          <template slot="label">
            <div>
              批量添加
              <el-tooltip
                effect="light"
                content="编码规则：行—列—层，可以批量生成，填写行xx-xx，列xx-xx，层xx-xx，进行组合生成，生成的数量为行*列*层。"
                placement="right"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
          </template>
          <el-row type="flex" :gutter="10">
            <ElCol :span="16">
              <ElFormItem label="行" label-width="20px">
                <el-input-number
                  v-model="formData.batchData.rowStart"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  @change="val => formData.batchData.rowEnd = Math.max(val, formData.batchData.rowEnd)"
                  :max="99999999999"
                  placeholder
                ></el-input-number>
                <span style="margin:0 6px">~</span>
                <el-input-number
                  v-model="formData.batchData.rowEnd"
                  controls-position="right"
                  :precision="0"
                  :min="formData.batchData.rowStart"
                  :max="99999999999"
                  placeholder
                ></el-input-number>
              </ElFormItem>
              <ElFormItem label="列" label-width="20px">
                <el-input-number
                  v-model="formData.batchData.colStart"
                  @change="val => formData.batchData.colEnd = Math.max(val, formData.batchData.colEnd)"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="99999999999"
                  placeholder
                ></el-input-number>
                <span style="margin:0 6px">~</span>
                <el-input-number
                  v-model="formData.batchData.colEnd"
                  controls-position="right"
                  :precision="0"
                  :min="formData.batchData.colStart"
                  :max="99999999999"
                  placeholder
                ></el-input-number>
              </ElFormItem>
              <ElFormItem label="层" label-width="20px">
                <el-input-number
                  v-model="formData.batchData.layerStart"
                  @change="val => formData.batchData.layerEnd = Math.max(val, formData.batchData.layerEnd)"
                  controls-position="right"
                  :precision="0"
                  :min="1"
                  :max="99999999999"
                  placeholder
                ></el-input-number>
                <span style="margin:0 6px">~</span>
                <el-input-number
                  v-model="formData.batchData.layerEnd"
                  controls-position="right"
                  :precision="0"
                  :min="formData.batchData.layerStart"
                  :max="99999999999"
                  placeholder
                ></el-input-number>
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <el-button type="primary" @click="createCode">生成到文本框</el-button>
            </ElCol>
          </el-row>
          <ElFormItem label label-width="0" prop="list" :rules="[{ required: true, message: '请先生成编码' }]">
            <el-input v-model="formData.list" type="textarea" :rows="5" placeholder></el-input>
          </ElFormItem>
        </ElFormItem>
      </div>
      <ElFormItem label="位置状态" prop="locationStatus">
        <el-radio-group v-model="formData.locationStatus">
          <ElRadio :label="0">空置</ElRadio>
          <ElRadio :label="1">占用</ElRadio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="库位规格" prop="locationSize">
        <el-select v-model="formData.locationSize" clearable>
          <ElOption v-for="item in locationSpecifications" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </el-select>
        <el-button type="primary" style="margin-left:8px" @click="openSpecificationManagement">规格管理</el-button>
      </ElFormItem>
      <ElFormItem label="库位类型" prop="locationType">
        <el-radio-group v-model="formData.locationType">
          <ElRadio :label="1">正常库位</ElRadio>
          <ElRadio :label="2">呆滞库位</ElRadio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="库位是否多Sku" prop="multipleSkuFlag">
        <el-switch v-model="formData.multipleSkuFlag" :active-value="1" :inactive-value="0"></el-switch>
        <ElFormItem v-if="formData.multipleSkuFlag" prop="multipleCount" style="display: inline-block">
          <span style="margin-left:6px">
            该库位最多只能限制入
            <ElInputNumber style="margin:0 6px" controls-position="right" v-model="formData.multipleCount"></ElInputNumber>个SKU
          </span>
        </ElFormItem>
      </ElFormItem>
      
      <ElFormItem label="是否激活" prop="activatedFlag">
        <el-switch v-model="formData.activatedFlag" :active-value="1" :inactive-value="0"></el-switch>
      </ElFormItem>
    </el-form>
    <el-dialog
      width="1000px"
      title="库位规格管理"
      @open="handleOpen"
      @close="handleClose"
      :visible.sync="specificationManagementVisible"
      append-to-body
    >
      <SpecificationManagement ref="list"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
/* eslint-disable */
export default {
  inheritAttrs: false,

  components: {
    SpecificationManagement: () => import('./SpecificationManagement.vue')
  },
  data() {
    return {
      showBatchBtn: true,
      specificationManagementVisible: false,
      loading: false,

      rules: {
        wmWarehouseId: [{ required: true, message: '请选择仓库' }],
        wmWarehouseDivisionId: [{ required: true, message: '请选择区域' }],
        locationStatus: [{ required: true, message: '请选择位置状态' }],
        locationSize: [{ required: true, message: '请选择库位规格' }],
        multipleCount: [{ required: true, message: '请输入限制的sku个数' }],
        locationType: [{ required: true, message: '请选择库位类型' }]
      },
      formData: {
        list: null,
        isSingle: true,
        locationType: null,
        wmWarehouseId: null,
        wmWarehouseDivisionId: null,
        batchData: {
          rowStart: undefined,
          rowEnd: undefined,
          colStart: undefined,
          colEnd: undefined,
          layerStart: undefined,
          layerEnd: undefined
        },
        generatedData: null,
        single: {
          row: undefined,
          col: undefined,
          layer: undefined
        },
        locationStatus: null,
        multipleSkuFlag: 0,
        activatedFlag: 0,
        locationSize: null
      },
      regionalList: [] // 区域列表 动态获取
    }
  },
  created() {
    this.initData()
  },
  computed: {
    ...mapState('vmWarehouse', ['warehouseList', 'locationSpecifications'])
  },
  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    createCode() {
      let data = this.formData.batchData
      let flag = true
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (!element) {
            flag = false
            break
          }
        }
      }
      if (flag) {
        let arr = [],
          a1 = [],
          a2 = [],
          a3 = [],
          { rowStart, rowEnd, colStart, colEnd, layerStart, layerEnd } = data
        for (let i = rowStart; i <= rowEnd; i++) {
          a1.push(i)
        }
        for (let i = colStart; i <= colEnd; i++) {
          a2.push(i)
        }
        for (let i = layerStart; i <= layerEnd; i++) {
          a3.push(i)
        }
        arr.push(a1)
        arr.push(a2)
        arr.push(a3)
        this.formData.list = this.doExchange(arr).join('\n')
      } else {
        this.$message.warning('请先填写行、列、层区间值')
      }
    },
    doExchange(array) {
      let len = array.length
      let results = []
      let indexs = {}
      function _sort(start) {
        start++
        if (start > len - 1) {
          return
        }
        if (!indexs[start]) {
          indexs[start] = 0
        }
        if (!(array[start] instanceof Array)) {
          array[start] = [array[start]]
        }
        for (
          indexs[start] = 0;
          indexs[start] < array[start].length;
          indexs[start]++
        ) {
          _sort(start)
          if (start == len - 1) {
            let temp = []
            for (let i = len - 1; i >= 0; i--) {
              if (!(array[start - i] instanceof Array)) {
                array[start - i] = [array[start - i]]
              }
              temp.push(array[start - i][indexs[start - i]])
            }
            results.push(temp.join('-'))
          }
        }
      }
      _sort(-1)
      return results
    },
    handleOpen() {
      // 小弹窗
      this.$nextTick(() => {
        this.$refs.list._initData(true)
      })
    },
    handleClose() {
      // 关闭时刷新库位规格
      this.queryData(8).then(() => {
        if (
          !this.locationSpecifications.some(
            el => el.value === this.formData.locationSize
          )
        ) {
          this.formData.locationSize = null
        }
      })
    },
    openSpecificationManagement() {
      this.specificationManagementVisible = true
    },
    submit() {
      let { list, isSingle, single, batchData, ...info } = this.formData,
        locationInfoList = []
      let { row, col, layer } = single
      // 处理编码
      if (isSingle) {
        locationInfoList.push({
          locationCode: [row, col, layer].join('-'),
          locationRow: row,
          locationColumn: col,
          locationFloor: layer
        })
        info.locationColumn = col
        info.locationRow = row
        info.locationFloor = layer
      } else {
        list = list.split('\n').forEach(element => {
          let n = element.split('-')
          locationInfoList.push({
            locationCode: element,
            locationRow: +n[0],
            locationColumn: +n[1],
            locationFloor: +n[2]
          })
        })
      }
      return this.$api[
        info.wmLocationId
          ? `warehouse/wmLocationUpdate`
          : `warehouse/wmLocationCreate`
      ]({
        ...info,
        locationInfoList
      })
    },
    getRules(name) {
      return [
        {
          required: true,
          message: `请输入${name}`
        }
      ]
    },
    // 动态获取区域
    getRegionalList(wmWarehouseIds, notClear = false) {
      this.$api[`warehouse/wmWarehouseGlobalDivisionList`]({ wmWarehouseIds })
        .then(data => {
          this.regionalList = data.list.map(el => ({
            label: el.name,
            value: el.id
          }))
          if (notClear) {
            return
          }
          this.formData.wmWarehouseDivisionId = null
        })
        .catch(() => {})
    },
    // 外部初始化操作
    _initData() {
      let vm = this
      // 获取编辑数据
      let { data } = this.$attrs
      this.showBatchBtn = true
      if (data != null) {
        if (this.$.dataType(data) === 'Object') {
          this.showBatchBtn = false
          this.formData.isSingle = true
          this.isFetchEditData = true
          // row对象
          this.$api[`warehouse/wmLocationFindLocations`]({
            ids: [data.wmLocationId]
          })
            .then(data => {
              let _data = data.list[0]
              let {
                // locationCode,
                locationRow,
                locationColumn,
                locationFloor,
                // locationBarCode,
                ...info
              } = _data
              let single = {
                row: locationRow,
                col: locationColumn,
                layer: locationFloor
              }
              this.formData = {
                ...this.formData,
                single,
                ...info,
                locationRow,
                locationColumn,
                locationFloor
              }
              this.getRegionalList([vm.formData.wmWarehouseId], true)

              // 清除验证信息
              this.$nextTick(() => {
                this.isFetchEditData = false
                this.$refs.form.clearValidate()
              })
            })
            .catch(() => {})
        }
      } else {
        this.formData = {
          list: null,
          isSingle: true,
          locationType: null,
          wmWarehouseId: null,
          wmWarehouseDivisionId: null,
          batchData: {
            rowStart: undefined,
            rowEnd: undefined,
            colStart: undefined,
            colEnd: undefined,
            layerStart: undefined,
            layerEnd: undefined
          },
          generatedData: null,
          single: {
            row: undefined,
            col: undefined,
            layer: undefined
          },
          locationStatus: null,
          multipleSkuFlag: 0,
          activatedFlag: 0,
          locationSize: null
        }
        // this.formData.isSingle = true
        // this.formData.batchData = {
        //   rowStart: undefined,
        //   rowEnd: undefined,
        //   colStart: undefined,
        //   colEnd: undefined,
        //   layerStart: undefined,
        //   layerEnd: undefined
        // }
        // this.formData.single = {
        //   row: undefined,
        //   col: undefined,
        //   layer: undefined
        // }
      }
    },
    initData() {
      if (!this.warehouseList.length) {
        this.queryData(4)
      }
      this.queryData(8)
    }
  },

  watch: {
    'formData.wmWarehouseId'(val) {
      if (this.isFetchEditData) {
        return
      }
      if (!val) {
        return
      }
      this.getRegionalList([val])
    }
  }
}
</script>

<style>
</style>

<template>
  <div>
    <el-collapse v-model="activeName">
      <ElCollapseItem name="first" title="安全库存">
        <div class="box">
          <el-form :model="formData" size="small" label-width="100px">
            <ElFormItem label="安全库存天数">
              <el-input-number :min="1" :precision="0" controls-position="right" v-model="formData.inventoryDaysSafety"></el-input-number>
            </ElFormItem>
            <ElFormItem>
              <el-checkbox :true-label="1" :false-label="0" v-model="formData.safetyFlag" label="启动有断货风险产品优化"></el-checkbox>
            </ElFormItem>
            <YtTransition name="fadeInUp-fadeOutDown">
              <div class="mb20" v-if="formData.safetyFlag">
                <el-row type="flex" :gutter="12">
                  <ElCol :span="12">
                    <ElFormItem label="最高价比例">
                      <el-input-number
                        :min="1"
                        class="mr10"
                        :precision="2"
                        controls-position="right"
                        v-model="formData.safetyMaxLv"
                        placeholder
                      ></el-input-number>
                      <span>%</span>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="12">
                    <ElFormItem label="单次提价幅度">
                      <el-input-number
                        :min="1"
                        class="mr10"
                        :precision="2"
                        controls-position="right"
                        v-model="formData.safetyAmplitude"
                        placeholder
                      ></el-input-number>
                      <span>%</span>
                    </ElFormItem>
                  </ElCol>
                </el-row>
                <ElFormItem label="排除sku">
                  <ElButton icon="el-icon-plus" @click="addSku" type="success">添加SKU</ElButton>
                  <ElButton icon="el-icon-delete" type="danger" :disabled="!outerSelected.length" @click="del">删除</ElButton>
                  <yt-table
                    class="mt10"
                    v-if="tableSelectParams.selected.length"
                    @selectChange="handleSelectChange"
                    :data="tableSelectParams.selected"
                    :columns="tableSelectCol"
                  ></yt-table>
                </ElFormItem>
              </div>
            </YtTransition>
          </el-form>
        </div>
      </ElCollapseItem>
      <ElCollapseItem name="second" title="滞销库存">
        <div class="box">
          <el-form :model="formData1" size="small" label-width="100px">
            <ElFormItem label="滞销库存天数">
              <el-input-number
                :min="1"
                :precision="0"
                controls-position="right"
                v-model="formData1.inventoryDaysUnsalable"
              ></el-input-number>
            </ElFormItem>
            <ElFormItem>
              <el-checkbox :true-label="1" :false-label="0" v-model="formData1.unsalableFlag" label="启动有滞销风险产品优化"></el-checkbox>
            </ElFormItem>
            <YtTransition name="fadeInUp-fadeOutDown">
              <div class="mb20" v-if="formData1.unsalableFlag">
                <el-row type="flex" :gutter="12">
                  <ElCol :span="12">
                    <ElFormItem label="最低价比例">
                      <el-input-number
                        :min="1"
                        class="mr10"
                        :precision="2"
                        controls-position="right"
                        v-model="formData1.unsalableMaxLv"
                        placeholder
                      ></el-input-number>
                      <span>%</span>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="12">
                    <ElFormItem label="单次降价幅度">
                      <el-input-number
                        :min="1"
                        class="mr10"
                        :precision="2"
                        controls-position="right"
                        v-model="formData1.unsalableAmplitude"
                        placeholder
                      ></el-input-number>
                      <span>%</span>
                    </ElFormItem>
                  </ElCol>
                </el-row>
                <ElFormItem label="排除sku">
                  <ElButton icon="el-icon-plus" @click="addSku1" type="success">添加SKU</ElButton>
                  <ElButton icon="el-icon-delete" type="danger" :disabled="!outerSelected1.length" @click="del1">删除</ElButton>
                  <yt-table
                    class="mt10"
                    v-if="tableSelectParams1.selected.length"
                    @selectChange="handleSelectChange1"
                    :data="tableSelectParams1.selected"
                    :columns="tableSelectCol"
                  ></yt-table>
                </ElFormItem>
              </div>
            </YtTransition>
          </el-form>
        </div>
      </ElCollapseItem>
    </el-collapse>
    <yt-dialog :options="options" @close="close" :events="events" :validate="validate" :scrollTop="false">
      <YtTableSelect
        ref="table"
        key="1"
        url="warehouse/wmInventoryList"
        v-if="flag"
        :params="tableSelectParams1"
        :evalFunc="evalFunc"
        :options="tableSelectOptions"
      />
      <YtTableSelect
        ref="table"
        key="2"
        url="warehouse/wmInventoryList"
        v-else
        :params="tableSelectParams"
        :evalFunc="evalFunc"
        :options="tableSelectOptions"
      />
    </yt-dialog>
  </div>
</template>

<script>
import { evalFunc } from 'Plugins/util'
/* eslint-disable */
export default {
  data() {
    let vm = this
    return {
      flag: false,
      validate: () => {
        return Promise.resolve()
      },
      activeName: ['first', 'second'],
      formData: {
        inventoryDaysSafety: undefined,
        safetyMaxLv: undefined,
        safetyAmplitude: undefined,
        safetyFlag: 0
      },
      tableSelectParams: {
        rowKey: 'productId', // rowkey
        selected: []
      },
      outerSelected: [],

      formData1: {
        inventoryDaysUnsalable: undefined,
        unsalableMaxLv: undefined,
        unsalableAmplitude: undefined,
        unsalableFlag: 0
      },
      tableSelectParams1: {
        rowKey: 'productId', // rowkey
        selected: []
      },
      outerSelected1: [],

      tableSelectOptions: {
        search: [
          {
            label: '',
            value: 'searchType',
            type: 'select',
            placeholder: '选择搜索字段',
            children: vm.$const['WAREHOUSE/productsType']
          },
          {
            label: '',
            value: 'searchValue',
            placeholder: '输入搜索值',
            type: 'input'
          }
        ],
        // 表格项
        table: {
          maxHeight: 410,
          border: true,
          selectableFunc: () => {
            return true
          },
          selection: true,
          reserveSelection: 'productId',
          searchDataFn(data) {
            return data
          },
          columns: [
            {
              value: 'label',
              label: '自定义SKU',
              width: 200,
              render(h, scope, arr) {
                // eslint-disable-next-line
                let { children, expand, loading, _level, customSku } = scope.row
                // eslint-disable-next-line
                let { $index: index } = scope
                return (
                  <div
                    class="flex-c"
                    style={{
                      paddingLeft: (_level - 1) * 40 + 'px',
                      justifyContent: 'start'
                    }}
                  >
                    <div class="btn" style="margin-right:4px">
                      {_level === 1 ? (
                        <el-button
                          disabled={loading}
                          icon={
                            loading
                              ? 'el-icon-loading'
                              : scope.row._expanded
                              ? 'el-icon-minus'
                              : 'el-icon-plus'
                          }
                          onClick={() => {
                            if (!scope.row._expanded) {
                              if (!scope.row.children) {
                                let { productId } = scope.row
                                let params = {
                                  parentId: productId
                                }
                                vm.$set(scope.row, 'loading', true)
                                vm.$api[`warehouse/wmInventoryListChilds`](
                                  params
                                )
                                  .then(data => {
                                    vm.$set(scope.row, 'children', data.list)
                                    let selected = !vm.flag
                                      ? vm.tableSelectParams.selected
                                      : vm.tableSelectParams1.selected
                                    let arr = []
                                    data.list.forEach(element => {
                                      if (
                                        selected.find(
                                          el =>
                                            el.productId === element.productId
                                        )
                                      ) {
                                        arr.push(element)
                                      }
                                    })
                                    // console.log(arr);
                                    vm.$refs.table.setSelected(arr, true)
                                    vm.$set(scope.row, 'loading', false)
                                    vm.$set(scope.row, '_expanded', true)
                                  })
                                  .catch(() => {})
                              } else {
                                vm.$set(scope.row, '_expanded', true)
                              }
                            } else {
                              scope.row._expanded = false
                            }
                          }}
                          type="text"
                        />
                      ) : null}
                    </div>
                    <div class="text">{customSku}</div>
                  </div>
                )
              }
            },
            {
              value: 'imgPath',
              label: '图片',
              img: true,
              style: {
                //图片宽高
                width: 45,
                height: 45
              }
            }
            // { value: 'customSku', label: '自定义SKU', width: 200 }
          ]
        }
      },

      tableSelectCol: [
        {
          value: 'imgPath',
          label: '图片',
          img: true,
          style: {
            //图片宽高
            width: 45,
            height: 45
          }
        },
        {
          value: 'customSku',
          label: '自定义SKU',
          width: 200,
          render(h, scope) {
            return (
              <span>{scope.row.storeSku || scope.row.customSku || '-'}</span>
            )
          }
        }
      ],
      options: {
        visible: false,
        title: '添加SKU',
        width: '600px',
        modal: true,
        okBtnText: '确认',
        appendToBody: true
      },
      events: {
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.table.getData()
          })
        },
        handleOkClick() {
          if (vm.flag) {
            vm.tableSelectParams1.selected = vm.$refs.table.selection
            return
          }
          vm.tableSelectParams.selected = vm.$refs.table.selection
        }
      }
    }
  },
  watch: {
    'formData.safetyFlag'(val) {
      if (!val) {
        this.outerSelected = []
        this.tableSelectParams.selected = []
        this.formData.safetyMaxLv = undefined
        this.formData.safetyAmplitude = undefined
      }
    },
    'formData1.unsalableFlag'(val) {
      if (!val) {
        this.outerSelected1 = []
        this.tableSelectParams1.selected = []
        this.formData1.unsalableMaxLv = undefined
        this.formData1.unsalableAmplitude = undefined
      }
    }
  },
  methods: {
    close() {
      // console.log(123);
      this.$refs.table.reset(true)
    },
    // 树展开函数
    evalFunc(data, expandAll, parent = null, level = null) {
      return evalFunc.apply(this, arguments)
    },
    submit() {
      let {
        formData,
        formData1,
        tableSelectParams: { selected: selected },
        tableSelectParams1: { selected: selected1 }
      } = this
      let parentSafetyExcludeProductIds = selected
        .filter(el => el._level === 1)
        .map(el => el.productId)
      let variantsSafetyExcludeProductIds = selected
        .filter(el => el._level !== 1)
        .map(el => el.productId)
      let parentUnsalableExcludeProductIds = selected1
        .filter(el => el._level === 1)
        .map(el => el.productId)
      let variantsUnsalableExcludeProductIds = selected1
        .filter(el => el._level !== 1)
        .map(el => el.productId)
      let params = {
        ...formData,
        ...formData1,
        parentSafetyExcludeProductIds,
        variantsSafetyExcludeProductIds,
        parentUnsalableExcludeProductIds,
        variantsUnsalableExcludeProductIds
      }
      return this.$api[`warehouse/wmInventoryEarlyWarning`](params)
    },
    _initData() {
      this.$api[`warehouse/wmInventoryEarlyWarningFind`]({})
        .then(data => {
          // 安全库存
          let {
            inventoryDaysSafety,
            safetyMaxLv,
            safetyAmplitude,
            safetyFlag,
            parentSafetyExcludeProductSkus,
            childSafetyExcludeProductSkus,
            inventoryDaysUnsalable,
            unsalableFlag,
            unsalableMaxLv,
            unsalableAmplitude,
            parentUnsalableExcludeProductSkus,
            childUnsalableExcludeProductIds
          } = data.info
          this.formData = {
            inventoryDaysSafety,
            safetyMaxLv,
            safetyAmplitude,
            safetyFlag
          }
          this.tableSelectParams.selected = parentSafetyExcludeProductSkus
            .concat(childSafetyExcludeProductSkus)
            .map(el => ({ ...el, imgPath: el.imgPath }))
          this.formData1 = {
            inventoryDaysUnsalable,
            unsalableFlag,
            unsalableMaxLv,
            unsalableAmplitude
          }
          this.tableSelectParams1.selected = parentUnsalableExcludeProductSkus
            .concat(childUnsalableExcludeProductIds)
            .map(el => ({ ...el, imgPath: el.imgPath }))
        })
        .catch(() => {})
    },
    _close() {
      this.activeName = ['first', 'second']
      this.formData = {
        inventoryDaysSafety: undefined,
        safetyMaxLv: undefined,
        safetyAmplitude: undefined,
        safetyFlag: 0
      }
      this.tableSelectParams = {
        rowKey: 'productId',
        selected: []
      }
      this.outerSelected = []
      this.formData1 = {
        inventoryDaysUnsalable: undefined,
        unsalableMaxLv: undefined,
        unsalableAmplitude: undefined,
        unsalableFlag: 0
      }
      this.tableSelectParams1 = {
        rowKey: 'productId',
        selected: []
      }
      this.outerSelected1 = []
    },
    addSku() {
      this.flag = false
      this.options.visible = true
    },
    del() {
      if (!this.outerSelected.length) {
        this.$message.warning('请选择要删除的项')
        return
      }
      this.tableSelectParams.selected = this.tableSelectParams.selected.filter(
        el => this.outerSelected.indexOf(el) === -1
      )
    },
    handleSelectChange(val) {
      this.outerSelected = val
    },
    addSku1() {
      this.flag = true
      this.options.visible = true
    },
    del1() {
      if (!this.outerSelected1.length) {
        this.$message.warning('请选择要删除的项')
        return
      }
      this.tableSelectParams1.selected = this.tableSelectParams1.selected.filter(
        el => this.outerSelected1.indexOf(el) === -1
      )
    },
    handleSelectChange1(val) {
      this.outerSelected1 = val
    }
  }
}
</script>

<style>
</style>

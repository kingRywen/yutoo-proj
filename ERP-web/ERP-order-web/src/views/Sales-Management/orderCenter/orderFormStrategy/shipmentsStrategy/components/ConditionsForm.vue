<template>
  <div>
    <SimpleForm
      :fields="currentFields"
      :form-data.sync="formData.expand"
      label-width="170px"
      :currency-type="currencyType"
      v-if="refresh"
      ruleForm
      type="border"
      style="margin-bottom:0;background:#fff"
    />
    <div class="flex" v-if="!type">
      <div v-if="!isError" class="text">满足以上条件，执行</div>
      <div v-else class="error">条件重复，请修改后再提交</div>
      <el-tooltip content="设置更多条件" placement="top">
        <div class="sel-btn" @click="setCondition">
          <i class="iconfont1">&#xe7f4;</i>
        </div>
      </el-tooltip>
    </div>

    <div class="change" v-if="!type">
      <el-form :model="formData" size="small" :rules="rules" ref="ruleForm">
        <el-row type="flex" :gutter="10">
          <el-col :span="6">
            <el-form-item label-width="100px" label="改变订单状态" style="margin-bottom:0;width:100%" prop="orderState">
              <el-select v-model="formData.orderState" placeholder="改变订单状态" style="width:100%">
                <el-option :value="1" label="异常需人工处理"></el-option>
                <el-option :value="2" label="正常系统处理"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.orderState === 1">
            <el-form-item style="margin-bottom:0">
              <el-input v-model="formData.exceptionExplain" placeholder="异常说明"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18" v-if="formData.orderState === 2" class="flex1">
            <el-form-item style="margin-bottom:0;width:100%" prop="turnDeliveryWarehouse">
              <el-select v-model="formData.turnDeliveryWarehouse" placeholder="转发货仓库" style="width:100%">
                <el-option
                  v-for="item in warehouseList"
                  :value="item.warehouseId"
                  :label="item.warehouseName"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0;width:100%" prop="deadweightTransportType">
              <el-select v-model="formData.deadweightTransportType" placeholder="重货运输方式" style="width:100%">
                <el-option
                  v-for="item in deadweightTransportTypeList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0;width:100%" prop="throwTransportType">
              <el-select v-model="formData.throwTransportType" placeholder="抛货运输方式" style="width:100%">
                <el-option
                  v-for="item in throwTransportTypeList"
                  :value="item.value"
                  :label="item.label"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0;width:100%" prop="platformMarkedShipment">
              <el-select v-model="formData.platformMarkedShipment" placeholder="平台标记发货" style="width:100%">
                <el-option :value="1" label="默认"></el-option>
                <el-option :value="2" label="立即"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <yt-dialog :options="dialogOpts" :events="dialogEvents">
      <el-checkbox-group v-model="selectedFields" class="custom_checkbox_tb">
        <!-- eslint-disable -->
        <el-checkbox v-for="item in allFields" :label="item" :key="item.id"></el-checkbox>
      </el-checkbox-group>
    </yt-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  created() {
    if (this.type === 'giftStragy') {
      this.currentFieldsLabel = [
        '新增订单原因',
        '订购产品包含店铺SKU',
        '订购产品包含平台SKU',
        '订购产品包含仓库SKU',
        '产品中文名包含关键词',
        '订购产品包含店铺SKU前缀',
        '订购产品包含自定义SKU前缀',
        '订购产品包含店铺SKU后缀',
        '订购产品包含自定义SKU后缀',
        '订购产品店铺SKU包含字符'
      ]
    }
    this.label = JSON.parse(JSON.stringify(this.currentFieldsLabel))
    this.init()
  },

  data() {
    let vm = this
    return {
      rules: {
        orderState: [
          {
            required: true,
            message: '不能为空'
          }
        ],
        turnDeliveryWarehouse: [
          {
            required: true,
            message: '不能为空'
          }
        ],
        deadweightTransportType: [
          {
            required: true,
            message: '不能为空'
          }
        ],
        throwTransportType: [
          {
            required: true,
            message: '不能为空'
          }
        ],
        platformMarkedShipment: [
          {
            required: true,
            message: '不能为空'
          }
        ]
      },
      isEdit: false,
      condition: {
        expand: {
          // createOrderReason: []
        }
      },
      refresh: true,
      // allFields: [
      //   '客户支付运费',
      //   '订单产品包含',
      //   '订单原来的运输方式',
      //   '新增订单原因'
      // ],
      // 设置选中
      selectedFields: [],
      // 默认显示的
      currentFieldsLabel: [
        '客户支付运费',
        '体积重量区间(g)',
        '实际重量区间(g)',
        '产品SKU数量区间',
        '产品数量区间',
        '产品长宽高(cm)'
      ],
      dialogOpts: {
        visible: false,
        title: '添加条件',
        width: '840px',
        okBtnText: '确认',
        appendToBody: true
      },
      dialogEvents: {
        close() {
          // 关闭时的回调
          vm.selectedFields = vm.currentFieldsLabel
        },

        handleOkClick() {
          vm.isEdit = true
          // 确认事件
          let _deleted = vm.currentFieldsLabel.filter(
            el => vm.selectedFields.indexOf(el) === -1
          )
          vm.currentFieldsLabel = vm.selectedFields
          // 把取消显示的数据清除掉
          let _fields = vm.fields.filter(el => _deleted.indexOf(el.label) > -1)
          console.log(_fields)
          _fields.forEach(el => {
            // debugger
            if (
              el.type === 'price' ||
              el.type === 'weight' ||
              el.type === 'number'
            ) {
              // 如果是价格组件 删除开始，结束，单位的值
              delete vm.formData['start' + vm.$.firstCase(el.name)]
              delete vm.formData['end' + vm.$.firstCase(el.name)]
              delete vm.formData[el.name + 'CurrencyType']
              delete vm.formData.expand['start' + vm.$.firstCase(el.name)]
              delete vm.formData.expand['end' + vm.$.firstCase(el.name)]
              delete vm.formData.expand[el.name + 'CurrencyType']
            } else if (el.type === 'group') {
              el.opts.forEach(sub => {
                delete vm.formData['start' + vm.$.firstCase(sub.name)]
                delete vm.formData['end' + vm.$.firstCase(sub.name)]
                delete vm.formData.expand['start' + vm.$.firstCase(sub.name)]
                delete vm.formData.expand['end' + vm.$.firstCase(sub.name)]
              })
            } else {
              delete vm.formData.expand[el.name]
              delete vm.formData[el.name]
            }
          })
        }
      }
    }
  },
  props: {
    isError: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: undefined
    }
  },
  methods: {
    ...mapActions('common', [
      'initTransportTypeList',
      'getWarehouseList',
      'initCommonList',
      'getEnumList'
    ]),
    validate() {
      return this.$refs.ruleForm.validate()
    },
    init() {
      if (!this.warehouseList.length) {
        this.getWarehouseList()
      }
      // 获取所有运输方式
      if (!this.transportTypeList.length) {
        this.initTransportTypeList()
      }

      // 获取重货运输方式
      if (!this.deadweightTransportTypeList.length) {
        this.initTransportTypeList(1)
      }

      // 获取抛货运输方式
      if (!this.throwTransportTypeList.length) {
        this.initTransportTypeList(2)
      }

      // 获取插头规格
      if (!this.productPlugSpecList.length) {
        this.getEnumList(4)
      }
      // 侵权风险
      if (!this.riskTypeList.length) {
        this.getEnumList(2)
      }
      // 物流属性
      if (!this.logisticTypeList.length) {
        this.getEnumList(8)
      }

      // 货币类型
      if (!this.currencyType.length) {
        this.initCommonList(2)
      }
    },
    setCondition() {
      this.dialogOpts.visible = true
      this.selectedFields = this.currentFieldsLabel
    }
  },
  computed: {
    ...mapState('common', [
      'warehouseList', // 所有仓库
      'deadweightTransportTypeList', //重货运输方式
      'throwTransportTypeList', //抛货运输方式
      'transportTypeList', //所有运输方式
      'productPlugSpecList', //插头规格
      'riskTypeList', //侵权风险
      'logisticTypeList', //物流属性
      'currencyType' //货币类型
    ]),
    currentFields() {
      return this.fields.filter(
        el => this.currentFieldsLabel.indexOf(el.label) > -1
      )
    },
    allFields() {
      return this.fields.map(el => el.label)
    },
    fields() {
      let vm = this,
        common = [
          {
            type: 'price',
            label: '订单总额',
            name: 'orderAmount',
            span: 12
          },
          {
            type: 'price',
            label: '产品销售单价',
            name: 'salesPrice',
            span: 12
          },

          {
            type: 'price',
            label: '欧洲报关费用',
            name: 'customsCost',
            span: 12
          },

          {
            type: 'price',
            label: '采购总价格',
            name: 'purchaseAmount',
            span: 12
          },

          {
            type: 'select',
            multi: true,
            label: '不能包含的产品侵权风险',
            name: 'riskTypeNonContain',
            options: vm.riskTypeList,
            span: 12
          },

          {
            type: 'select',
            multi: true,
            label: '必须包含的产品侵权风险',
            name: 'riskTypeContain',
            options: vm.riskTypeList,
            span: 12
          },

          {
            type: 'select',
            multi: true,
            label: '不能包含的产品物流属性',
            name: 'logisticTypeNonContain',
            options: vm.logisticTypeList,
            span: 12
          },

          {
            type: 'select',
            multi: true,
            label: '必须包含的产品物流属性',
            name: 'logisticTypeContain',
            options: vm.logisticTypeList,
            span: 12
          },

          {
            type: 'select',
            multi: true,
            label: '产品插头规格',
            name: 'productPlugSpec',
            options: vm.productPlugSpecList,
            span: 12
          },

          {
            type: 'select',
            label: '订单原来的运输方式',
            name: 'originalTransportType',
            options: vm.transportTypeList,
            span: 12
          },

          {
            type: 'select',
            label: '平台客户选择的运输方式',
            name: 'customerTransportType',
            options: vm.transportTypeList,
            span: 12
          },

          {
            type: 'select',
            label: '订单原来的发货仓库',
            bind: {
              label: 'warehouseName',
              value: 'warehouseId'
            },
            name: 'originalWarehouse',
            options: vm.warehouseList,
            span: 12
          },

          {
            type: 'select',
            label: '平台订单类型',
            name: 'orderType',
            options: this.$const['ORDER/addType'],
            span: 12
          },

          {
            //
            type: 'textarea',
            label: '产品中文名包含关键词',
            name: 'productNameContain',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含店铺SKU前缀',
            name: 'storeSkuPrefix',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含自定义SKU前缀',
            name: 'customSkuPrefix',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含自定义SKU后缀',
            name: 'customSkuSuffix',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含店铺SKU后缀',
            name: 'storeSkuSuffix',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品店铺SKU包含字符',
            name: 'storeSkuCharContain',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含店铺SKU',
            name: 'storeSkuContain',
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含类别',
            name: 'productCategoryContain',
            span: 12
          },
          {
            type: 'textarea',
            label: '订单产品包含',
            name: 'orderProductContain',
            span: 12
          }
        ],
        before = [],
        after = []
      /**
       * '客户支付运费',
        '体积重量区间(g)',
        '实际重量区间(g)',
        '产品SKU数量区间',
        '产品数量区间',
        '产品长宽高(cm)'
       */
      if (this.type === 'giftStragy') {
        before = [
          {
            type: 'select',
            multi: true,
            label: '新增订单原因',
            name: 'createOrderReason',
            options: this.$const['ORDER/createOrderReason'], //$const['ORDER/addType']
            span: 12
          },
          {
            type: 'textarea',
            label: '订购产品包含店铺SKU',
            name: 'storeSku',
            span: 24
          },
          {
            type: 'textarea',
            label: '订购产品包含平台SKU',
            name: 'platformSku',
            span: 24
          },
          {
            type: 'textarea',
            label: '订购产品包含仓库SKU',
            name: 'warehouseSku',
            span: 24
          }
        ]
      }
      if (!this.type) {
        before = [
          {
            type: 'select',
            multi: true,
            label: '新增订单原因',
            name: 'createOrderReason',
            options: this.$const['ORDER/createOrderReason'], //$const['ORDER/addType']
            span: 12
          },
          {
            type: 'price',
            label: '客户支付运费',
            name: 'customerFreight',
            span: 12
          },
          {
            type: 'weight',
            label: '体积重量区间(g)',
            name: 'volumeWeight',
            span: 12
          },
          {
            type: 'weight',
            label: '实际重量区间(g)',
            name: 'actualWeight',
            span: 12
          },
          {
            type: 'weight',
            integer: true,
            label: '产品SKU数量区间',
            name: 'skuQuantity',
            span: 12
          },
          {
            type: 'weight',
            integer: true,
            label: '产品数量区间',
            name: 'prodictQuantity',
            span: 12
          },
          {
            type: 'group',
            label: '产品长宽高(cm)',
            span: 12,
            opts: [
              {
                label: '长',
                name: 'long'
              },
              {
                label: '宽',
                name: 'wide'
              },
              {
                label: '高',
                name: 'high'
              }
            ]
          }
        ]
      }
      return before.concat(common).concat(after)
    }
  },
  watch: {
    'formData.expand'(val) {
      if (this.isEdit) {
        return
      }
      let label = this.label,
        vm = this
      for (const key in val) {
        if (val.hasOwnProperty(key)) {
          const element = val[key]
          if (element != null) {
            let name = vm.$.firstLower(key.replace(/^(start|end)/, ''))

            let elementLabel = vm.fields.find(el => {
              if (el.type === 'group') {
                return el.opts.some(_el => _el.name === name)
              } else {
                return el.name === name
              }
            })
            if (elementLabel) {
              elementLabel = elementLabel.label
            }
            if (label.indexOf(elementLabel) === -1) {
              label.push(elementLabel)
            }
          }
        }
      }

      this.currentFieldsLabel = label
    }
    // condition: {
    //   deep: true,
    //   handler(val) {
    //     console.log(123)
    //     this.$emit('update', val)
    //   }
    // }
  }
}
</script>

<style lang='scss' scoped>
.flex1 {
  @include flex-wrapper(space-between);
  & > div {
    margin-right: 6px;
  }
}
.flex {
  @include flex-wrapper(space-between);
  padding: 6px 18px;
  background: #f5f7fa;
  border: 1px solid #ddd;
  border-top: 0;
  .text {
    color: #108ee9;
  }
  .error {
    color: #ff5722;
  }
  .sel-btn {
    cursor: pointer;
    i {
      font-size: 18px;
    }
  }
}
.change {
  padding: 18px 18px;
  border: 1px solid #ddd;
  border-top: 0;
  border-radius: 0 0 5px 5px;
  background: #fff;
  font-size: 12px;
  color: #606266;
  transition: all 0.25s ease;
}
</style>

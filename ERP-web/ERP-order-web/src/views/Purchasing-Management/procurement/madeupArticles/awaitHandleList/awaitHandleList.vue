<template>
  <!-- 待加工订单列表 -->
  <div class>
    <universal-layout
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @clickBtn="clickBtn"
    >
      <template slot="search">
        <search :searchList="searchList" @search="search">
          <!-- <el-button type="info" size="small" slot="right">自定义筛选条件</el-button> -->
        </search>
      </template>
      <template slot="btnRight">
        <!-- <el-button type="info" size="small" slot="right">自定义列表</el-button> -->
      </template>
      <template slot="table">
        <yt-table
          :data="tableList"
          reserveSelection="productId"
          ref="table"
          :columns="columns"
          :border="true"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column label="ID" width="100" align="center" slot="left">
            <template slot-scope="scope">
              <div>
                <img src="./u120567.png" width="32" height="32" alt="优先" title="优先" v-if="scope.row.priority">
                <p>{{scope.row.purchaseFinishedWorksheetId}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" slot="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.worksheetState==1"
                type="text"
                @click="finishProcessing(scope.row.productId,scope.row.purchaseFinishedWorksheetId)"
              >完成加工</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
    <!--  -->
    <el-dialog title="选择优先级别" :visible.sync="firstDialogVisible" width="20%" center>
      <el-select v-model="priority" style="width:100%;">
        <el-option label="优先" value="1"></el-option>
        <el-option label="非优先" value="0"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="firstDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitFormFirst(priority)">确 定</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <el-dialog title="加工" :visible.sync="machiningDialogVisible" width="450px" center>
      <el-form :model="finishProcessingForm" :rules="fprules" ref="finishProcessingForm" label-width="100px">
        <el-form-item label="加工数量：" prop="machiningQuantity">
          <el-row :gutter="10">
            <el-col :span="17">
              <el-input v-model.number="finishProcessingForm.machiningQuantity" type="number"/>
            </el-col>
            <el-col :span="6">
              <el-button type="success" @click="openConsumeFormDialog">添加耗损</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="耗材备注：" prop="remark">
          <el-input type="textarea" v-model="finishProcessingForm.remark" class="textarea"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFormMachining('finishProcessingForm')">取 消</el-button>
        <el-button type="primary" @click="submitFormMachining('finishProcessingForm')" :loading="machiningLoading">加 工</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <el-dialog title="添加耗损" :visible.sync="consumeDialogVisible" width="600px" center>
      <el-form :model="consumeForm" ref="consumeForm">
        <yt-table :data="consumeList" :columns="consumeColumns" :border="true" :selection="false">
          <el-table-column label="原料损耗数量" width="120" align="center" slot="right">
            <template slot-scope="scope">
              <el-form-item
                :prop="'products.' + scope.$index + '.wastageQuantity'"
                :rules="{
                                  required: true, message: '不能为空,须大于0', trigger: 'blur',pattern:/^[0-9_]{0,}$/
                    }"
              >
                <el-input
                  v-model="consumeForm.products[scope.$index].wastageQuantity"
                  size="mini"
                  type="number"
                  min="0"
                />
              </el-form-item>
            </template>
          </el-table-column>
        </yt-table>
        <el-form-item label="注意：">
          <p style="color:#f56c6c">添加原料损耗后会导致不够生成单个成品的原料SKU数量重新入库，并且会修改当前加工单的需求数量和已生成加工单的数量，请谨慎操作！</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetFormConsume('consumeForm')">取 消</el-button>
        <el-button type="primary" @click="submitFormConsumeRules('consumeForm')">保 存</el-button>
      </span>
    </el-dialog>
    <!--  -->
    <el-dialog :title="queryOrderFormTitle" :visible.sync="queryOrderFormVisible" width="1200px" center>
      <queryOrderForm ref="queryOrderForm"/>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import queryOrderForm from '../../procurementList/orderformList/components/queryOrderForm'

var checknum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('数量不能为空'))
  }
  if (!Number.isInteger(value)) {
    callback(new Error('请输入数字值，须为整数'))
  } else {
    if (value < 1) {
      callback(new Error('加工数量必须大于0'))
    } else {
      callback()
    }
  }
}
export default {
  data() {
    return {
      selection: [],
      queryOrderFormTitle: '',
      queryOrderFormVisible: false,
      searchList: [
        {
          label: '加工状态',
          value: 'worksheetState',
          type: 'select',
          style: {
            width: '100px'
          },
          children: [
            { label: '已加工', value: '2' },
            { label: '未加工', value: '0' },
            { label: '加工中', value: '1' }
          ]
        },
        {
          label: '采购订单状态',
          value: 'purchaseState',
          type: 'select',
          style: {
            width: '100px'
          },
          children: [
            { label: '已完结', value: '1' },
            { label: '未完结', value: '0' }
          ]
        },
        // {
        //     label: '加工单状态',
        //     value: 'machiningState',
        //     type: 'select',
        //     style: {
        //         width: '100px'
        //     },
        //     children: [
        //         { label: '已生成', value: '1' },
        //         { label: '未生成', value: '0' }
        //     ]
        // },
        {
          label: '转化时间',
          value: 'time',
          type: 'time'
        },
        {
          label: '请输入成品SKU',
          value: 'productSku',
          type: 'input',
          style: {
            width: '150px'
          }
        }
      ],
      btnList: [
        {
          name: '设置优先',
          fn: () => {
            if (this.purchaseFinishedWorksheetIds.length) {
              this.firstDialogVisible = true
            } else {
              this.$message.warning('请选择需要设置的优先订单数据')
            }
          }
        },
        {
          name: '取消优先',
          fn: () => {
            if (this.purchaseFinishedWorksheetIds.length) {
              this.submitFormFirst(0)
            } else {
              this.$message.warning('请选择需要取消的订单数据')
            }
          }
        },
        {
          name: '加工',
          fn: () => {
            if (this.purchaseFinishedWorksheetIds.length) {
              this.$confirm(
                '将锁定选中成品的原材料库存，原材料不足的需要去采购方可进入加工中状态，是否确认加工?',
                '提示',
                {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }
              )
                .then(() => {
                  this.$api['procurement/conversionStockOperator']({
                    purchaseMachiningDetailIds: this
                      .purchaseFinishedWorksheetIds,
                    stockState: 1
                  })
                    .then(res => {
                      this.$message.success(res.msg)
                      this.getList()
                    })
                    .catch(err => {
                      this.$message.error(err.msg)
                    })
                })
                .catch(() => {
                  return false
                })
            } else {
              this.$message.warning('请选择需要设置的加工订单数据')
            }
          }
        },
        {
          name: '批量打印',
          children: [
            { name: '打印产品条码' },
            { name: '打印单个产品条码' },
            { name: '打印成品加工单' }
          ]
        }
        // {
        //   name: '批量打印',
        //   fn: () => {
        //     if (this.purchaseFinishedWorksheetIds.length) {
        //       window.open(
        //         `#/print?title=打印加工单&purchaseIds=${this.purchaseFinishedWorksheetIds.join(
        //           ','
        //         )}`
        //       )
        //     } else {
        //       this.$message.warning('请选择需要批量打印的订单数据')
        //     }
        //   }
        // }
      ],
      tableList: [],
      columns: [
        {
          value: 'worksheetStateName',
          label: '加工状态'
        },
        {
          value: 'lowerSingleNumber',
          label: '采购订单号',
          render: (h, scope) => {
            return (
              <el-button
                type="text"
                onClick={this.queryOrderFormInfo.bind(
                  this,
                  scope.row.lowerSingleNumber,
                  scope.row.purchaseNumber
                )}
              >
                {scope.row.purchaseNumber}
              </el-button>
            )
          }
        },
        {
          value: 'productImg',
          label: '成品图片',
          img: true,
          style: {
            width: 60,
            height: 60
          },
          bulkyHeight: 180
        },
        {
          value: 'productSku',
          label: '成品sku'
        },
        {
          value: 'productNameZh',
          label: '中文名'
        },
        {
          value: 'purchaseQuantity',
          label: '采购单数量'
        },
        {
          value: 'alreadyMachiningQuantity',
          label: '已生成加工单数量'
        },
        {
          value: 'generateTime',
          label: '采购单生成时间'
        },
        {
          value: 'conversionTime',
          label: '转化时间'
        }
      ],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      purchaseFinishedWorksheetIds: [],
      firstDialogVisible: false,
      priority: '1',
      machiningDialogVisible: false,
      finishProcessingForm: {
        machiningQuantity: '',
        remark: ''
      },
      fprules: {
        machiningQuantity: [
          {
            // required: true,
            // message: '请输入数字值，须大于0',
            trigger: 'blur',
            validator: checknum
            // pattern: /^[0-9_]{1,}$/
          }
        ],
        remark: [{ required: true, message: '请填写备注', trigger: 'change' }]
      },
      consumeDialogVisible: false,
      consumeForm: {
        products: []
      },
      consumeList: [],
      consumeColumns: [
        { value: 'sku', label: '原料SKU' },
        { value: 'nameZh', label: '原料名称' },
        { value: 'num', label: '原料数量' },
        { value: 'proportion', label: '原料对比' }
      ],
      pMDId: null,
      machiningLoading: false,
      purchaseFinishedWorksheetId: null,
      searchInfo: {}
    }
  },
  watch: {
    consumeList(val) {
      this.consumeForm.products = val.map(item => {
        return {
          wastageQuantity: item.quantity,
          productId: item.productId
        }
      })
    }
  },
  methods: {
    queryOrderFormInfo(lowerSingleNumber, purchaseNumber) {
      this.queryOrderFormVisible = true
      this.queryOrderFormTitle = `订单详情 - ${purchaseNumber}`
      this.$nextTick(() => {
        this.$refs.queryOrderForm.getListData(lowerSingleNumber)
      })
    },
    //取消耗损保存
    resetFormConsume(formName) {
      this.$refs[formName].resetFields()
      this.consumeDialogVisible = false
    },
    //添加耗损保存
    submitFormConsumeRules(formName) {
      const _this = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            purchaseMachiningDetailId: this.purchaseFinishedWorksheetId,
            products: this.consumeForm.products
          }
          _this.$api['procurement/conversionSaveWastage'](params).then(res => {
            _this.$message.success(res.msg)
            _this.consumeDialogVisible = false
          })
        } else {
          return false
        }
      })
    },
    //添加耗损
    async openConsumeFormDialog() {
      this.consumeDialogVisible = true
      //获取原材料耗损

      this.$api['procurement/conversionGetRawMaterial']({
        productId: this.pMDId,
        purchaseMachiningDetailId: this.purchaseFinishedWorksheetId
      })
        .then(res => {
          this.consumeList = res.rows
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    //完成加工取消
    resetFormMachining(formName) {
      this.$refs[formName].resetFields()
      this.machiningDialogVisible = false
    },
    //完成加工確定
    submitFormMachining(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //判断是否添加过耗损，是否都有值
          let isLength = this.consumeForm.products.length
          let status
          if (isLength) {
            status = this.consumeForm.products.every(
              item => item.wastageQuantity != ''
            )
          }

          if (isLength && status) {
            this.machiningLoading = true
            this.$api['procurement/conversionMachining']({
              purchaseMachiningDetailId: this.purchaseFinishedWorksheetId,
              remark: this.finishProcessingForm.remark,
              machiningQuantity: this.finishProcessingForm.machiningQuantity,
              products: this.consumeForm.products
            })
              .then(res => {
                this.$message.success(res.msg)
                this.machiningDialogVisible = false
                this.machiningLoading = false
                this.getList()
              })
              .catch(err => {
                this.$message.error(err.msg)
                this.machiningLoading = false
              })
          } else {
            this.$message.warning('请添加耗损')
          }
        } else {
          return false
        }
      })
    },

    // 批量打印

    clickBtn(name) {
      console.log(name)
      if (name === '打印单个产品条码') {
        name = '打印采购清单产品条码'
      }
      // let finishedWorksheetId = this.$refs.table.selection.map(el => el.finishedWorksheetId)
      if (this.selection.length === 0) {
        this.$message.warning('请选择需要批量打印的订单数据')
        return
      } else {
        window.open(
          `#/print?title=${name}&purchaseIds=${this.selection.join(',')}`
        )
      }
    },

    //完成加工
    finishProcessing(productId, purchaseFinishedWorksheetId) {
      this.machiningDialogVisible = true
      this.pMDId = productId
      this.purchaseFinishedWorksheetId = purchaseFinishedWorksheetId
      this.$nextTick(() => {
        this.$refs.finishProcessingForm.resetFields()
      })
    },
    submitFormFirst(priority) {
      let self = this
      this.$api['procurement/conversionSetPriority']({
        purchaseMachiningDetailIds: self.purchaseFinishedWorksheetIds,
        priority
      })
        .then(res => {
          self.$message.success(res.msg)
          self.firstDialogVisible = false
          self.getList()
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    handleSelectionChange(val) {
      this.purchaseFinishedWorksheetIds = val.map(
        item => item.purchaseFinishedWorksheetId
      )
      this.selection = val.map(item => item.finishedWorksheetId)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search')
    },
    //搜索
    search(val) {
      this.$refs.table.clearSelection()
      this.searchInfo = val
      this.pageNo = 1
      this.getList('search')
    },
    //获取列表数据
    getList(val = 'table', data) {
      let self = this
      val === 1 ? (self.pageNo = 1) : self.pageNo
      let params = {
        sortOrder: 'asc',
        pageSize: self.pageSize,
        pageNumber: self.pageNo
      }
      if (val == 'search') {
        let obj = self.searchInfo
        if (Object.keys(obj).length) {
          let newParams = {}
          for (let key in obj) {
            if (
              key == 'time' &&
              obj[key] != null &&
              obj[key] instanceof Array &&
              obj[key].length
            ) {
              newParams['startTime'] = obj.time[0]
              newParams['endTime'] = obj.time[1]
              continue
            }
            if (obj[key]) newParams[key] = obj[key]
          }
          params = Object.assign({}, params, newParams)
        }
      }
      self.$api['procurement/conversionList'](params)
        .then(res => {
          self.tableList = res.rows
          self.pageNo = res.pageNo
          self.pageSize = res.pageSize
          self.total = res.total
        })
        .catch(err => {
          self.$message.error(err.msg)
        })
    }
  },
  mounted() {},
  components: {
    queryOrderForm
  }
}
</script>

<style lang="scss">
.textarea {
  textarea {
    height: 120px;
    resize: none;
  }
}
</style>

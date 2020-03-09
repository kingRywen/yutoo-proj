<template>
  <div>
    <!-- 订单退换货管理 -->
    <universal-layout
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
    >
      <template slot="search">
        <search :searchList="searchList" @search="search"></search>
      </template>
      <template slot="table">
        <yt-table
          v-loading="loading"
          element-loading-text="加载中..."
          element-loading-spinner="el-icon-loading"
          :data="tableList"
          ref="table"
          reserveSelection="orderReturnId"
          :columns="columns"
          :border="true"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column label="操作" width="130" align="center" slot="left">
            <template slot-scope="scope">
              <div>
                <el-tooltip class="item" effect="dark" content="查看订单" placement="bottom">
                  <el-button type="text" icon="el-icon-search" class="ibtn" @click="edit(scope.row.orderReturnId,true)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="订单追踪" placement="bottom">
                  <a href="http://www.kuaidi100.com/" target="_blank" style="margin: 0 8px;">
                    <el-button type="text" icon="el-icon-rank" class="ibtn"></el-button>
                  </a>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" v-if="scope.row.status==3">
                  <el-button type="text" icon="el-icon-edit" class="ibtn" @click="edit(scope.row.orderReturnId,false)"></el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.examineRemark"
                  placement="bottom"
                  v-if="scope.row.status==3"
                >
                  <el-button type="text" icon="el-icon-bell" class="ibtn"></el-button>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
    <!--  -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width">
      <div style="max-height: 580px;overflow-y: auto;padding-right: 10px;">
        <component :is="dialog.component" ref="component" :disabled="disabled"></component>
      </div>
      <span slot="footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm(dialog.title)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { myMixin, auditType, problemstate, problemTypeList } from '../mixins.js'
import backAndExchangeForm from './backAndExchangeForm'
import check from './check'
export default {
    mixins: [myMixin],
    data() {
        return {
            columns: [
                { label: '订单来源店铺', value: 'storeName' },
                {
                    label: '平台订单号',
                    value: 'orderNumPlatform',
                    width: '120px',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.goOrderInfo.bind(
                                    this,
                                    scope.row.orderId,
                                    scope.row.platformId,
                                    scope.row.orderType
                                )}
                            >
                                {scope.row.orderNumPlatform}
                            </el-button>
                        )
                    }
                },
                {
                    label: '系统订单号',
                    value: 'orderNumSystem',
                    width: '120px',
                    render: (h, scope) => {
                        return (
                            <el-button
                                type="text"
                                onClick={this.goOrderInfo.bind(
                                    this,
                                    scope.row.orderId,
                                    scope.row.platformId,
                                    scope.row.orderType
                                )}
                            >
                                {scope.row.orderNumSystem}
                            </el-button>
                        )
                    }
                },
                { label: '追踪号', value: 'trackingNumber' },
                { label: '名称', value: 'cneeMemberName' },
                { label: '邮箱', value: 'cneeEmail', width: '150px' },
                { label: '联系电话', value: 'cneePhone', width: '120px' },
                { label: '退换货原因', value: 'issueTypeName', width: '150px' },
                { label: '退货数量', value: 'returnQuantity' },
                { label: '添加时间', value: 'createTime', width: '150px' },
                { label: '收到货', value: 'inspectQty', width: '80px' },
                { label: '质检OK', value: 'goodQty', width: '80px' },
                { label: '不良品', value: 'rejectsQty', width: '70px' },
                { label: '入库', value: 'wareQty', width: '60px' },
                { label: '状态', value: 'statusName' },
                { label: '负责人', value: 'operatorName' }
            ],
            btnList: [
                {
                    name: '添加',
                    fn: () => {
                        this.disabled = false
                        this.openDialog({
                            title: '添加退换货',
                            visible: true,
                            component: 'backAndExchangeForm',
                            width: '1000px'
                        })
                        this.$nextTick(() => {
                            this.$refs.component.resetForm()
                        })
                    }
                },
                {
                    name: '审核',
                    fn: () => {
                        if (this.orderRefundIds.length) {
                            this.openDialog({
                                title: '审核',
                                visible: true,
                                component: 'check',
                                width: '480px'
                            })
                            this.$nextTick(() => {
                                this.$refs.component.resetForm()
                            })
                        } else {
                            this.$message.warning('请选择需要审核的数据')
                        }
                    }
                }
            ],
            searchList: [
                {
                    placeholder: '所有退换货原因',
                    type: 'select',
                    value: 'issueType',
                    children: problemTypeList
                },
                {
                    placeholder: '所有问题状态',
                    type: 'select',
                    value: 'status',
                    children: problemstate
                },
                {
                    placeholder: '负责客服',
                    type: 'select',
                    value: 'operatorId',
                    children: [],
                    style: {
                        width: '120px'
                    }
                },
                {
                    label: '添加时间：',
                    type: 'time',
                    value: 'time'
                },
                {
                    placeholder: '请输入邮箱、客户姓名货退换ID',
                    type: 'input',
                    value: 'other',
                    children: auditType,
                    style: {
                        width: '240px'
                    }
                }
            ],
            orderRefundIds: [],
            orderReturnId: '',
            disabled: false
        }
    },
    methods: {
        edit(orderReturnId, disabled) {
            this.disabled = disabled
            this.orderReturnId = orderReturnId
            this.openDialog({
                title: disabled ? '查看退换货' : '编辑退换货',
                visible: true,
                component: 'backAndExchangeForm',
                width: '1000px'
            })
            this.$nextTick(() => {
                this.$refs.component.getAllInfo(orderReturnId)
            })
        },
        submitForm(title) {
            if (!title) title = this.dialog.title
            switch (title) {
                case '添加退换货':
                    this.$refs.component.submitForm(title, () => {
                        this.openDialog({ visible: false })
                        this.getList()
                    })
                    break
                case '审核':
                    this.$refs.component.submitForm(
                        'returnExamine',
                        this.orderRefundIds,
                        () => {
                            this.openDialog({ visible: false })
                            this.getList()
                        }
                    )
                    break
                case '编辑退换货':
                    this.$refs.component.submitForm(
                        title,
                        () => {
                            this.openDialog({ visible: false })
                            this.getList()
                        },
                        this.orderReturnId
                    )
                    break
                case '查看退换货':
                    this.$refs.component.submitForm(title, () => {
                        this.openDialog({ visible: false })
                    })
                    break
                default:
                    break
            }
        },
        handleSelectionChange(val) {
            this.orderRefundIds = val.map(item => item.orderReturnId)
        },
        getList(val) {
            let params = {
                pageSize: this.pageSize,
                pageNumber: this.pageNo,
                sortOrder: 'asc'
            }
            if (val === 'search') {
                let np = {}
                for (let k in this.searchInfo) {
                    if (
                        k == 'time' &&
                        this.searchInfo[k] !== null &&
                        this.searchInfo[k].length
                    ) {
                        np['startTime'] = this.searchInfo[k][0]
                        np['endTime'] = this.searchInfo[k][1]
                        continue
                    }
                    if (
                        this.searchInfo[k] !== '' &&
                        this.searchInfo[k] !== null &&
                        this.searchInfo[k] !== undefined
                    ) {
                        np[k] = this.searchInfo[k]
                    }
                }
                params = Object.assign({}, params, np)
            }
            this.http('email/returnList', params, 'list')
        }
    },
    mounted() {
        this.getList()
        this._getservice().then(data => {
            this.searchList[2].children = data
        })
    },
    components: {
        backAndExchangeForm,
        check
    }
}
</script>
<style lang="scss">
@import '@/assets/css/common.scss';
</style>
<template>
  <!-- 供应商列表 -->
  <div>
    <universal-layout
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      @clickBtn="clickBtn"
    >
      <template slot="search">
        <search :searchList="searchList"></search>
      </template>
      <template slot="table">
        <yt-table :data="tableList" :columns="columns" :border="true">
          <el-table-column label="操作" width="100" align="center" slot="right">
            <template slot-scope="scope">
              <el-button type="text">退回</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
  </div>
</template>

<script>
import addSupplier from './addSupplier'

export default {
    data() {
        return {
            searchList: [
                {
                    label: '添加人',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '负责开发人',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '采购点',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '采购人',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '采购类型',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '付款方式',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '供应商级别',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '票据类型',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '审核状态',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '供应商贴标',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '是否开票',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '供应商发货地',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '是否平台注册',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },

                {
                    label: '是否有密码',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '是否黑名单',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '供应商备货',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '账期类型',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                },
                {
                    label: '对应仓库',
                    value: 'Id1',
                    type: 'select',
                    style: {
                        width: '100px'
                    },
                    children: [
                        {
                            label: '是',
                            value: '1'
                        }
                    ]
                }
            ],
            btnList: [
                { name: '添加', value: '1' },
                { name: '批量删除', value: '2' },
                { name: '批量审核', value: '3' },
                { name: '批量采购人员', value: '4' },
                { name: '批量设置开发人员', value: '5' },
                { name: '批量设置供应商发货地址', value: '6' },
                { name: '批量设置供应商备货', value: '7' },
                { name: '批量设置对应仓库', value: '8' },
                { name: '批量设置黑名单', value: '9' },
                { name: '批量设置结算时间', value: '10' },
                { name: '批量设置付款方式', value: '11' },
                { name: '批量设置账期', value: '12' }
            ],
            tableList: [],
            columns: [
                {
                    value: '',
                    label: 'ID',
                    width: '60'
                },
                {
                    value: '',
                    label: '采购类型'
                },
                {
                    value: '',
                    label: '付款方式'
                },
                {
                    value: '',
                    label: '供应商名称'
                },
                {
                    value: '',
                    label: '是否供应商备货'
                },
                {
                    value: '',
                    label: '是否开票'
                },
                {
                    value: '',
                    label: '是否黑名单'
                },
                {
                    value: '',
                    label: '供应商地址'
                },
                {
                    value: '',
                    label: '对应仓库'
                },
                {
                    value: '',
                    label: '联系人'
                },
                {
                    value: '',
                    label: '联系方式'
                },
                {
                    value: '',
                    label: '供应商级别'
                },
                {
                    value: '',
                    label: '账期'
                },
                {
                    value: '',
                    label: '开发人员'
                },
                {
                    value: '',
                    label: '采购人员'
                },
                {
                    value: '',
                    label: '采购点'
                },
                {
                    value: '',
                    label: '添加时间'
                },
                {
                    value: '',
                    label: '审核状态'
                },
                {
                    value: '',
                    label: '审核驳回原因'
                }
            ]
        }
    },
    components: {
        addSupplier
    },
    methods: {
        handleSizeChange(val) {
            console.log(val)
        },
        handleCurrentChange(val) {
            console.log(val)
        },
        //
        clickBtn(val) {
            console.log(val)
        }
    }
}
</script>

<style lang="scss">
</style>

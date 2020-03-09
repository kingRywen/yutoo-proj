<template>
  <!-- 生成移库计划 -->
  <div class="generate" v-loading="loading" element-loading-text="数据加载中...">
    <el-form ref="form" :model="form" label-width="90px" size="small">
      <el-form-item label="选择仓库：">{{wmWarehouseName || '-'}}</el-form-item>
      <el-form-item label="移库产品：">
        <el-button type="primary" @click="add">添 加</el-button>
        <el-button type="danger" @click="del" :disabled="!baseProductIds.length">删 除</el-button>
      </el-form-item>
      <el-form-item label-width="0px">
        <yt-table :data="list" :columns="columns" :border="true" @selectChange="selectChangeGenerate"></yt-table>
      </el-form-item>
      <el-form-item label="备注：" label-width="70px">
        <el-input type="textarea" v-model.trim="form.remark" :autosize="{ minRows: 6, maxRows: 9}"></el-input>
      </el-form-item>
    </el-form>
    <!--  -->
    <el-dialog title="选择SKU" :visible.sync="dialog.visible" :append-to-body="true" width="980px">
      <div style="height: 500px; overflow: auto;" v-loading="loading1" element-loading-text="数据加载中...">
        <!-- <el-form :inline="true" :model="skuForm" size="small">
                    <el-form-item label="SKU">
                        <el-input v-model="skuForm.sku"></el-input>
                    </el-form-item>
                    <el-form-item label="产品名称">
                        <el-input v-model="skuForm.name"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="searchProduct">查询</el-button>
                    </el-form-item>
        </el-form>-->
        <yt-table :data="skulist" :columns="productColumns" :border="true" @selectChange="selectChangeProduct"></yt-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNumber"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          class="pagination"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="checkedDelect">确 认 选 择</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      form: {
        remark: ''
      },
      list: [],
      skulist: [],
      columns: [
        {
          label: '主图',
          value: 'imageBase',
          img: true,
          width: 110,
          style: {
            width: 50,
            height: 50
          }
        },
        { label: '自定义SKU', value: 'skuCus' },
        {
          label: '原库位',
          value: 'wmLocationName',
          children: 'originalLocation'
        },
        {
          label: '转移库位',
          value: 'wmLocationName',
          children: 'targetLocation'
        },
        { label: '数量', value: 'amount' }
      ],
      dialog: {
        visible: false
      },
      skuForm: {
        sku: '',
        name: '',
        arr: []
      },
      productList: [],
      productColumns: [
        {
          value: 'imageBase',
          label: '主图',
          img: true,
          width: 110,
          style: {
            width: 50,
            height: 50
          }
        },
        { value: 'skuCus', label: 'SKU' },
        { value: 'nameCh', label: '中文名' },
        { value: 'originalLocationName', label: '库位' },
        { value: 'repertoryAmount', label: '数量' },
        { value: 'recommendLocationName', label: '推荐库位' },
        { value: 'recommendAmount', label: '推荐转库数量' },
        { value: 'remark', label: '备注' }
      ],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      wmWarehouseName: '',
      wmWarehouseId: '',
      loading: true,
      loading1: true,
      wmMoveRecommendIds: [],
      wmMoveRecommendIdsSku: [], //添加选择的

      baseProductIds: []
    }
  },
  methods: {
    add() {
      this.dialog.visible = true
      this.getskuList()
    },
    getskuList() {
      this.$api['warehouse/recommendList']({
        wmMoveRecommendIds: this.wmMoveRecommendIds,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        sortOrder: 'asc'
      }).then(res => {
        let { pageSize, pageNo, total, rows } = res
        this.skulist = rows
        this.pageSize = pageSize
        this.pageNumber = pageNo
        this.total = total
        this.loading1 = false
      })
    },

    del() {
      let nArr = []
      this.list.forEach((i, index) => {
        let everp = this.baseProductIds.findIndex(j => i.baseProductId == j)
        if (everp != -1) {
          return
        } else {
          nArr.push(i)
        }
      })
      this.list = nArr
    },
    searchProduct() {
      //
    },
    selectChangeGenerate(val) {
      this.baseProductIds = val.map(item => item.baseProductId)
    },
    selectChangeProduct(val) {
      this.wmMoveRecommendIdsSku = val.map(item => item.wmMoveRecommendId)
    },
    checkedDelect() {
      if (!this.wmMoveRecommendIdsSku.length) {
        return this.$message.warning('请选择需要添加的sku产品')
      }
      this.dialog.visible = false

      this.getInfo([...this.wmMoveRecommendIdsSku, ...this.wmMoveRecommendIds])
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.getskuList()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getskuList()
    },
    submitForm(cb) {
      let params = {
        wmWarehouseId: this.wmWarehouseId,
        remark: this.form.remark,
        productInfo: this.list.map(item => {
          return {
            baseProductId: item.baseProductId,
            amount: item.amount,
            originalLocationIds: item.originalLocation.map(i => i.wmLocationId),
            targetLocationIds: item.targetLocation.map(i => i.wmLocationId)
          }
        })
      }
      if (!this.list.length) {
        return this.$message.warning('移库计划产品不能为空,请先添加')
      }
      cb && cb(params)
    },
    getInfo(wmMoveRecommendIds) {
      this.wmMoveRecommendIds = wmMoveRecommendIds
      this.$api['warehouse/wmRecommendCreateMovePlan']({
        wmMoveRecommendIds
      }).then(res => {
        let { wmWarehouseName, wmWarehouseId, productInfo } = res.rows
        this.wmWarehouseName = wmWarehouseName
        this.wmWarehouseId = wmWarehouseId
        this.list = productInfo
        this.loading = false
      })
    }
  }
}
</script>

<style>
.pagination {
  margin-top: 15px;
  text-align: right;
}
</style>

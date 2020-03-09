<template>
  <v-form ref="form" :model="formData">
    <v-button type="primary" @click="visible = true">添加产品</v-button>
    <v-button type="primary" @click="showBtn = false" v-if="showBtn">批量修改加工数量</v-button>
    <template v-else>
      <v-input v-model.number="allVal" style="width:200px;display: inline-block;"></v-input>
      <v-button type="primary" @click="handleOk">确认</v-button>
    </template>
    <v-button type="danger" @click="handleDel">删除</v-button>
    <ElTable ref="table" :data="data">
      <ElTableColumn type="selection"></ElTableColumn>
      <ElTableColumn label="NO">
        <template slot-scope="scope">{{scope.$index}}</template>
      </ElTableColumn>
      <ElTableColumn label="图片">
        <template slot-scope="scope">
          <el-tooltip placement="right" effect="light" :open-delay="300">
            <div slot="content">
              <img
                :src="scope.row.imgPath && scope.row.imgPath.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'"
              >
            </div>
            <div class="divContent" style="margin:0">
              <img :src="scope.row.imgPath || '/static/no-image.jpg'">
            </div>
          </el-tooltip>
        </template>
      </ElTableColumn>
      <ElTableColumn label="自定义SKU" prop="skuCustom"></ElTableColumn>
      <ElTableColumn label="产品中文名" prop="variantNameZh"></ElTableColumn>
      <ElTableColumn label="加工数量">
        <template slot-scope="scope">
          <v-form-item :prop="`data.${scope.$index}.count`" :rules="checkCount">
            <v-input v-model.number="scope.row.count"/>
          </v-form-item>
        </template>
      </ElTableColumn>
    </ElTable>
    <!-- <v-button type="primary">确认导出条码</v-button> -->
    <v-modal
      title="选择产品"
      ok-text="确认"
      cancel-text="取消"
      :width="1200"
      :visible="visible"
      @ok="handleAsyncOk"
      ref="modal"
      @cancel="handleAsyncCancel"
      :confirm-loading="asyncConfirmLoading"
    >
      <ProductList ref="ProductList" :simple="true"/>
    </v-modal>
  </v-form>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast, downloadFile } from 'common/common'
import ProductList from '@/pages/product/productList/app.vue'

export default {
  props: ['variant', 'outerVm'],
  components: {
    ProductList
  },
  data() {
    let checkNum = (rule, value, cb) => {
      if (value == null || value === '') {
        cb(new Error('不能为空'))
        return
      }
      if (!Number.isFinite(value)) {
        cb(new Error('请输入数字'))
        return
      }
      if (value <= 0) {
        cb(new Error('必须大于0'))
        return
      }
      cb()
    }
    return {
      data: this.variant,
      allVal: undefined,
      visible: false,
      showBtn: true,
      asyncConfirmLoading: false,
      checkCount: [{
        validator: checkNum
      }]
    }
  },
  computed: {
    formData() {
      return {
        data: this.data
      }
    }
  },
  methods: {
    handleOk() {
      if (!this.allVal) {
        showToast('error', '请填写数量')
        return
      }
      this.showBtn = true
      this.data.map(el => {
        el.count = this.allVal
      })
    },
    handleDel() {
      let list = this.$refs.table.selection
      if (!list.length) {
        showToast('info', '请选择至少一条数据')
        return
      }
      this.data = this.data.filter(el => list.indexOf(el) === -1)
    },
    generateProductProcessingBarcode() {
      this.loadingPage = true
      fetchData({
        ...apis.PRODUCT_DOWNLOAD_PROCESS_CODE,
        data: variant
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.loadingPage = false
          },
          () => {
            this.loadingPage = false
          },
          true
        )
      })
    },
    handleAsyncOk() {
      let { variant, parent } = this.$refs.ProductList.getDiffTableData(
        null,
        true
      )
      if (variant.length) {
        this.data.push(...variant)
        this.visible = false
      } else {
        showToast('info', '请选择变体')
      }
    },
    handleAsyncCancel() {
      this.visible = false
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false
    },
    ok() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$root.$children[0].asyncConfirmLoading = true
          fetchData({
            ...apis.PRODUCT_DOWNLOAD_PROCESS_CODE,
            data: {
              variantList: this.data.map(el => ({
                variantId: el.productId,
                count: el.count
              }))
            }
          }).then(res => {
            this.$root.$children[0].asyncConfirmLoading = false
            handlerCode(
              res,
              () => {
                downloadFile(res.data.path)
                this.cancel()
                this.$listeners.set(this)
              },
              () => {}
            )
          })
        }
      })
    }
  }
}
</script>

<style>
</style>

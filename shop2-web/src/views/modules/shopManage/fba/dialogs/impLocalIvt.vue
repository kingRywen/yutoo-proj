<template>
  <div>
    <ImportFile
      :downloadParams="downloadParams"
      @success="handleSuccess"
      :filename="fileName"
      :data="dataParams"
      :downloadApi="downloadApi"
      :action="action"
    />
    <div v-if="info.items.length" class="hr"></div>
    <div v-if="info.errorInfos.length">
      <el-tag
        class="mr10 mb10"
        size="small"
        v-for="(item,index) in info.errorInfos"
        :key="index"
        type="warning"
      >{{item}}</el-tag>
    </div>
    <div v-if="info.items.length">
      <yt-table :columns="columns" :data="info.items"></yt-table>
    </div>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
export default {
  props: {
    data: Array,
    downApi: {
      default: 'fba/fbaReplenishProductLocalInventoryDownlocad'
    },
    confirmApi: {
      default: 'fba/fbaReplenishProductLocalInventoryConfirm'
    },
    uploadUrl: {
      default: '/fbaReplenishProduct/localInventory/import'
    },
    fileName: {
      default: ''
    },
    cols: {
      type: Array,
      default: () => [
        {
          label: 'SKU',
          value: 'sellerSku'
        },
        {
          label: '传入的库存',
          value: 'inventoryString'
        },
        {
          label: '当前库存',
          value: 'nowInventory'
        }
      ]
    }
  },
  data() {
    return {
      ImportFileData: {},
      downloadApi: this.downApi,
      action: `${CONST_PORT_CONFIG.DEFAULT_URL}` + this.uploadUrl,
      // action: `http://120.79.124.232:8001/mock/250` + this.uploadUrl,
      columns: [
        ...this.cols,
        {
          label: '错误信息',
          value: 'errorInfo',
          minWidth: 260,
          render(h, scope) {
            return (
              <span>
                {scope.row.errorInfo ? (
                  <el-tag size="small" type="warning">
                    {scope.row.errorInfo}
                  </el-tag>
                ) : (
                  '-'
                )}
              </span>
            )
          }
        }
      ],
      uploadCode: '',
      info: {
        errorInfos: [],
        items: []
      }
    }
  },
  methods: {
    //导入数据成功
    handleSuccess({ res }) {
      this.uploadCode = ''
      this.info = {
        errorInfos: [],
        items: []
      }
      if (res.code === 0) {
        this.updateInfo(res)
      } else {
        this.$message.error(res.msg)
      }
    },
    updateInfo(res) {
      this.uploadCode = res.uploadCode
      this.info.errorInfos = res.info.errorInfos || []
      this.info.items = Object.values(res.info.items)
    },
    validate() {
      let vm = this
      return new Promise((resolve, reject) => {
        if (!vm.uploadCode) {
          vm.$message.error('请添加导入文件')
          reject()
        }
        // if (
        //   vm.info.errorInfos.length ||
        //   vm.info.items.some(el => el.errorInfo && el.errorInfo.length > 0)
        // ) {
        //   vm.$message.error('请修改错误问题后再试')
        //   reject()
        // }
        resolve()
      })
    },
    _submit() {
      return this.validate().then(() => {
        let params = { uploadCode: this.uploadCode }
        return this.$api[this.confirmApi](params)
      })
    }
  },
  computed: {
    downloadParams() {
      //导出模板文件传给后台数据
      return {
        // ...this.storeInfo,
        data: this.data
      }
    },
    dataParams() {
      //导入传给后台数据
      let ret = {
        ...this.storeInfo
      }
      return ret
    }
  }
}
</script>

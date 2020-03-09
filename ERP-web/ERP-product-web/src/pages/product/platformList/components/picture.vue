<template>
  <v-spin
    tip="加载中..."
    :spinning="spinning"
    style="overflow: auto;height: 100%;padding-right: 10px;"
    class="platformList-picture"
  >
    <v-spin v-if="tabs.length" tip="加载中..." :spinning="spinning1">
      <div>
        <el-tabs type="border-card" v-model="shopIndex" @tab-click="handleShopChange">
          <el-tab-pane v-for="(list, index) in tabs" :name="index + ''" :label="'店铺名：' + list.storeName">
            <!-- <h2>{{list.storeName}}</h2> -->
            <el-tabs type="card" v-model="skuIndex" @tab-click="handleSkuChange(list, $event)">
              <el-tab-pane
                v-for="(item, cindex) in list.childList"
                :name="index + ',' + cindex"
                :label="item.baseVariantSku"
              >
                <UploadImg
                  :key="item.skuStore"
                  @removemultactive="removemultactive"
                  :shop-img="true"
                  :oss="true"
                  ref="upload1"
                  type="platPrev"
                  @updateimg="handleUpdate"
                  :oss-config="{dir: item.objectNameDir, baseVariantId:item.baseVariantId,
          parentDetailId:productPltDetailId,
          storeId:list.storeId}"
                  v-if="skuIndex === (index + ',' + cindex)"
                  :has-img="item.imgList"
                  :product-type="productType"
                  :product-id="productId"
                  @refresh="getImgs({baseVariantId:item.baseVariantId,
          detailVariantId:item.detailVariantId,
          storeId:list.storeId }, index, cindex)"
                  :show="$attrs.show"
                  :variant-id="item.detailVariantId"
                ></UploadImg>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </div>
    </v-spin>
    <div noHovering style="border:none;padding-bottom:40px;margin-top:30px">
      <h3 class="margin-bottom-20">编辑压缩包</h3>
      <UploadFile
        :key="1"
        @removemultactive="removemultactive"
        :show="$attrs.show"
        ref="upload"
        :file-upload="true"
        @successfile="setFile"
        :zip="zipInfo"
        :loading.sync="spinning"
      ></UploadFile>
    </div>
  </v-spin>
</template>

<script>
import UploadFile from 'components/base/uploadFile.vue'
import UploadImg from 'components/base/uploadImg'
import { fixNumber, getQueryString } from 'common/util'
import { fetchData, showToast, handlerCode } from 'common/common'
import apis from 'apis'

export default {
  components: {
    UploadFile,
    UploadImg
  },
  created() {
    this.productId = +getQueryString('productId')
    this.productPltDetailId = +getQueryString('productPltDetailId')
    this.isVariant = getQueryString('variant')
    this.productType = this.isVariant ? 1 : 0
    this.getTabs()
  },
  data() {
    return {
      productType: null,
      spinning: false,
      spinning1: false,
      // imgLists: [],
      shopIndex: '0',
      skuIndex: '0,0',
      oldShopIndex: '0',
      oldSkuIndex: '0,0',
      isShow: true,
      tabs: [],
      zipInfo: {}
    }
  },
  filters: {
    fixNum(value) {
      return fixNumber(+value, 2)
    }
  },
  methods: {
    removemultactive() {
      let uploads = [this.$refs.upload, ...this.$refs.upload1]
      console.log(uploads)
      uploads.forEach(load => {
        load.closeActive()
      })
    },
    handleUpdate({ file, val }) {
      console.log(file, val)
      let { imgId, mainFlag, remark } = file
      remark = val
      fetchData({
        ...apis.PRODUCT_IMAGE_UPDATE_IMAGE,
        data: {
          imgId,
          mainFlag,
          remark
        }
      }).then(res => {})
    },
    handleShopChange(tabInstance) {
      this.skuIndex = tabInstance.index + ',0'
      let _skuIndex = this.skuIndex.split(',')
      let { childList, storeId } = this.tabs[tabInstance.index]
      let { baseVariantId, detailVariantId } = childList[0]

      this.getImgs(
        {
          baseVariantId,
          detailVariantId,
          storeId
        },
        tabInstance.index,
        0
      )
    },
    handleSkuChange(list, tabInstance) {
      // this.skuIndex = tabInstance.index
      console.log(list, tabInstance)
      let _skuIndex = this.skuIndex.split(',')
      let [index, cindex] = _skuIndex
      let { childList, storeId } = list
      let { baseVariantId, detailVariantId } = childList[tabInstance.index]
      this.getImgs(
        {
          baseVariantId,
          detailVariantId,
          storeId
        },
        index,
        cindex
      )
    },
    setFile(files) {
      // this.imgLists = files
      // this.oldSkuIndex = this.skuIndex
      // this.oldShopIndex = this.shopIndex
      // let [index, cindex] = this.skuIndex.split(',').map(el => +el)
      this.skuIndex = '0,0'
      this.shopIndex = '0'

      this.getTabs()
      // this.$set(this.imgLists, files)
    },
    getTabs(index, cindex) {
      let vm = this
      vm.spinning = true
      // 根据母体id获取变体列表
      fetchData({
        ...apis.PRODUCT_IMAGE_LIST_VARIANTS,
        data: {
          detailId: vm.productPltDetailId,
          productType: vm.isVariant ? 1 : 0
        }
      }).then(res => {
        vm.spinning = false
        let { code, rows, msg } = res.data
        let { variantInfo, zipInfo } = rows
        if (code === 0) {
          let firstShopTab = variantInfo[0]
          vm.zipInfo = zipInfo
          vm.tabs = variantInfo
          if (firstShopTab) {
            let { childList, storeId } = firstShopTab
            let { baseVariantId, detailVariantId } = childList[0]
            vm.getImgs(
              {
                baseVariantId,
                detailVariantId,
                storeId
              },
              index,
              cindex
            )
          }
        } else {
          showToast('error', msg)
        }
      })
    },
    getImgs(data, index = 0, cindex = 0) {
      let vm = this
      vm.spinning1 = true

      fetchData({
        ...apis.PRODUCT_IMAGE_LIST_IMG,
        data
      }).then(res => {
        vm.spinning1 = false
        if (res.data.code === 0) {
          let data = JSON.parse(JSON.stringify(vm.tabs))
          data[index].childList[cindex].imgList =
            res.data.rows && res.data.rows[0]
              ? res.data.rows[0].childList[0].imgList
              : []
          vm.tabs = data
          // vm.skuIndex = vm.oldSkuIndex
          // vm.shopIndex = vm.oldShopIndex
        } else {
          showToast('error', res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.platformList-picture {
  & > .ant-spin-container {
    margin-right: 10px;
  }
  .noOverflow {
    .el-tab-pane .ant-card .ant-card-body {
      overflow: inherit;
    }
  }
  .img-box {
    display: flex;
    flex-wrap: wrap;
    .img-main {
      margin-right: 20px;
      background: #ececec;
      padding: 10px;
      margin-bottom: 20px;
      .divContent {
        width: 150px;
        height: 150px;
        margin: 0 auto;
        // background: #fff;
        border: 1px dotted #ddd;
        img {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
      // img {
      //   width: 150px;
      //   height: 150px;
      //   display: block;
      // }
      .title {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
        .name {
          font-size: 14px;
          font-weight: bold;
          width: 140px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
</style>

<template>
  <v-spin tip="加载中..." :spinning="spinning" style="margin-bottom:30px;overflow: auto;height: 100%;" class="platformList-picture">
    <div noHovering style="border:none">
      <UploadFile :show="$attrs.show" ref="upload" :file-upload="true" @successfile="setFile" :zip="zipInfo" :loading.sync="spinning"></UploadFile>
    </div>
    <div v-if="imgLists.length" style="padding-bottom:40px;margin-top:30px">
      <h3 class="margin-bottom-20">图片预览</h3>
      <el-tabs type="border-card" :value="imgLists[0].storeName">
        <el-tab-pane v-for="list in imgLists" :name="list.storeName" :label="'店铺名：' + list.storeName">
          <!-- <h2>{{list.storeName}}</h2> -->
          <el-tabs type="card" :value="list.childList[0].sku">
            <el-tab-pane v-for="item in list.childList" :name="item.sku" :label="item.sku">
              <div class="img-box">
                <div class="img-main" v-for="img in item.imgList">
                  <div class="divContent">
                    <img :src="img.imgM || '/static/no-image.jpg'" alt="">
                  </div>

                    <div class="title">
                      <span class="name">{{img.name}}</span>
                      <span>{{img.mainFlag ? '主图' : ''}}</span>
                    </div>
                    <span class="size">{{img.size}}</span>
                  </div>
                </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </div>
  </v-spin>
</template>

<script>
import UploadFile from "components/base/uploadFile.vue";
import { fixNumber, getQueryString } from "common/util";
import { fetchData } from "common/common";
import apis from "apis";

export default {
  components: {
    UploadFile
  },
  created() {
    let productId = +getQueryString("productId");
    this.productPltDetailId = +getQueryString("productPltDetailId");
    this.isVariant = getQueryString("variant") == "true";
    this.spinning = true;
    fetchData({
      ...apis.PRODUCT_IMAGE_INFO,
      // data: { productId: id, productType: this.isVariant ? 1 : 0 }
      data: {
        productId,
        productType: this.isVariant ? 1 : 0,
        productPltDetailId: this.productPltDetailId
      }
    }).then(res => {
      this.spinning = false;
      if (res.data.code === 0 && res.data.rows) {
        if (res.data.rows.imgInfo) {
          this.imgLists = res.data.rows.imgInfo;
        }
        if (res.data.rows.zipInfo) {
          this.zipInfo = res.data.rows.zipInfo;
        }
      }
    });
  },
  data() {
    return {
      spinning: false,
      imgLists: [],
      zipInfo: {}
    };
  },
  filters: {
    fixNum(value) {
      return fixNumber(+value, 2);
    }
  },
  methods: {
    setFile(files) {
      this.imgLists = files;
      this.$set(this.imgLists, files);
    }
  }
};
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

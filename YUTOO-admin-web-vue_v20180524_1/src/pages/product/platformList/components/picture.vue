<template>
  <div style="margin-bottom:80px" class="platformList-picture">
    <v-card noHovering style="border:none">
      <UploadFile ref="upload" :file-upload="true" @successfile="setFile"></UploadFile>
    </v-card>
    <v-card noHovering style="border:none">
      <h3 class="margin-bottom-20">图片预览</h3>
      <div style="border: 1px solid #ddd;padding:30px" v-for="list in imgLists">
        <h2>{{list.storeInfo.name}}</h2>
        <!-- <span>{{list.childList}}</span> -->
        <div v-for="item in list.childList">
          <span>变体 SKU: {{item.childInfo.sku}}</span>
          <div class="img-box">
            <div class="img-main" v-for="img in item.imgList">
              <img :src="img.imgM || '/static/no-image.jpg'" alt="" width="150" height="150">
              <div class="title">
                <span class="name">{{img.name}}</span>
                <span>{{img.mainFlag ? '主图' : ''}}</span>
              </div>
              <span class="size">{{img.size / 1024 | fixNum}}KB</span>
            </div>
          </div>
        </div>

      </div>

    </v-card>
  </div>
</template>

<script>
import UploadFile from "components/base/uploadFile.vue";
import { fixNumber } from "common/util";

export default {
  components: {
    UploadFile
  },
  data() {
    return {
      imgLists: []
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
    }
  }
};
</script>

<style lang="less" scoped>
.platformList-picture {
  .img-box {
    display: flex;
    flex-wrap: wrap;
    .img-main {
      margin-right: 20px;
      background: #ececec;
      padding: 10px;
      margin-bottom: 20px;
      img {
        width: 150px;
        height: 150px;
        display: block;
      }
      .title {
        display: flex;
        justify-content: space-between;
        margin: 5px 0;
        .name {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>

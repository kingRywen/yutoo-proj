<template>
  <div class="category">
    <img :src="item" v-for="item in arr" :key="item.id" alt />

    <ElRow>
      <ElCol :span="5" class="wrap_span border_right border_left">
        <div class="search-wrap" v-if="searchFlag">
          <el-input placeholder="请输入SKU..." size="large" v-model="input3" class="input-with-select">
            <i class="el-icon-search el-input__icon" slot="suffix" @click="handleIconClick(input3)"></i>
          </el-input>
        </div>
        <div class="chose-wrap">
          <div
            class="chose-item"
            v-for="(item, index) in choseList"
            :key="item.id"
            @click="handleChose(item, index)"
          >{{item.name}}</div>
        </div>
      </ElCol>
      <ElCol :span="8" class="wrap_span border_right">
        <div class="update_wrap">
          <template v-if="!imgView.url">
            <!-- 上传 -->
            <up :disabled="limitFlag" :addFlag="false" @upload="uploadImg"></up>
          </template>
          <template v-else>
            <el-image style="width: 100%; height: 100%" :src="imgView.url" fit="cover"></el-image>
            <i class="el-icon-close img-close-view" @click="imgView.url=''"></i>
          </template>
        </div>
      </ElCol>
      <ElCol :span="11" class="wrap_span border_right">
        <ElRow>
          <vuedraggable v-model="imgList">
            <ElCol :span="num == 9 ? 8 : 6" v-for="(item, index) in imgList" :key="item.id">
              <div class="img-warp" :class="'img'+ index">
                <template v-if="item.ossUrl.imagePath">
                  <i class="el-icon-close img-close" @click="deleteImg(item)"></i>
                  <el-image
                    class="img-item"
                    :src="item.ossUrl.imagePath || ''"
                    @click="handleViewImg(index,item)"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline"></i>
                    </div>
                  </el-image>
                </template>
                <template v-else-if="item.update">
                  <!-- 上传 -->
                  <up :disabled="limitFlag" @upload="uploadImg"></up>
                </template>
              </div>
            </ElCol>
          </vuedraggable>
        </ElRow>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
export default {
  components: {
    up: () => import("./up"),
    vuedraggable: () => import("vuedraggable")
  },
  props: {
    num: {
      type: Number,
      default: 12
    },
    limit: {
      type: Number,
      default: 2
    },
    variant: {
      type: Object,
      default: () => {}
    },
    apiOptions: {
      type: Object,
      default: () => ({
        upLoad() {
          return Promise.resolve();
        },
        delete() {
          return Promise.resolve();
        }
      })
    },
    choseList: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    searchFlag: {
      type: Boolean,
      default: true
    },
    productRepoId: {
      type: Number
    },
    imgSource: {
      type: Number
    }
  },
  data() {
    return {
      arr: [],
      imgView: { url: "" },
      input3: "",
      imgList: [],
      limitFlag: false,
      currentVariant: {},
      originList: []
    };
  },
  created() {
    let vm = this;
    // vm.currentVariant = vm.variant;
    // eslint-disable-next-line no-unused-vars
    if (vm.imgList.length == 0) {
      let num = 12;
      if (this.num == 9) {
        num = 9;
      }
      [...Array(num).keys()].forEach((item, index) => {
        if (index == 0) {
          vm.imgList.push({ url: "", update: true, ossUrl: {} });
        } else {
          vm.imgList.push({ url: "", update: false, ossUrl: {} });
        }
      });
      vm.originList = vm.utils.clone(vm.imgList);
    }
  },
  computed: {
    fileList: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler(val) {
        let vm = this;
        vm.imgList = vm.utils.clone(vm.originList);
        vm.$nextTick(() => {
          val.forEach((item, index) => {
            vm.$set(vm.imgList[index], "ossUrl", item);
            vm.$set(vm.imgList[index + 1], "update", true);
          });
        });
      }
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleChose(item, index) {
      this.$emit("update:variant", item);
      this.$emit("handleChose", item, index);
    },

    handleIconClick(val) {
      this.$emit("searchSku", val);
    },
    handleViewImg(index, item) {
      this.imgView.url = item.ossUrl;
      this.imgView.index = index;
    },
    // eslint-disable-next-line no-unused-vars
    deleteImg(item) {
      let vm = this;
      vm.apiOptions.delete([item]).then(() => {
        vm.imgList = vm.utils.clone(vm.originList);
        vm.$emit("success");
      });
    },
    uploadImg(list) {
      let vm = this;
      vm.apiOptions.upload(list).then(() => {
        vm.imgList = vm.utils.clone(vm.originList);
        vm.$emit("success");
      });
    }
  }
};
</script>


<style lang='scss'>
.border_left {
  border-left: 1px solid #d7dae2;
}
.border_right {
  border-right: 1px solid #d7dae2;
}
.border_bottom {
  border-bottom: 1px solid #d7dae2;
}
.border_top {
  border-top: 1px solid #d7dae2;
}

.category {
  padding: 0 20px;
  background: #fff;
  width: $box_width;
  margin: 0 auto;
  .el-upload--picture-card {
    width: 248px;
    height: 132px;
    border: none;
  }
  .update_wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 398px;
    width: 399px;
    overflow: hidden;
    position: relative;
    .el-upload-dragger {
      margin-left: -111px;
      margin-top: -28px;
      border: none;
    }
    .img-close-view {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
    }
  }
  .wrap_span {
    min-height: 400px;
    border-top: 1px solid #d7dae2;
    border-bottom: 1px solid #d7dae2;
    .search-wrap {
      .el-input--suffix .el-input__inner {
        border-radius: 0px !important;
        border-top: none;
        border-left: none;
        border-right: none;
      }
      .el-input__suffix-inner {
        font-size: 20px;
      }
    }
    .chose-item {
      height: 39px;
      border-bottom: 1px solid #d7dae2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .img-warp {
      width: 100%;
      height: 132px;
      margin-top: -1px;
      background: url("./bg.png");
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #d7dae2;
      // border-top: none;
      // border-right: none;
      position: relative;
      overflow: hidden;
      .el-icon-picture-outline {
        font-size: 26px;
        color: rgb(158, 158, 158);
      }
      .img-close {
        position: absolute;
        top: 2px;
        right: 2px;
        font-size: 18px;
        z-index: 666;
      }
    }
    // .img11,
    // .img10,
    // .img9,
    // .img8 {
    //   border-bottom: none;
    // }
    // .img0,
    // .img4,
    // .img8 {
    //   border-left: none;
    // }
  }
}
</style>
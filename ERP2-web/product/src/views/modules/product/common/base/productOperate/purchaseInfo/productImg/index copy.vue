<template>
  <div class="picture">
    <ElRow>
      <ElCol :span="21">
        <ElSelect
          style="margin:10px 0px 20px 80px"
          size="small"
          v-model="form.propertyList"
          clearable
          placeholder="请选择"
        >
          <ElOption
            v-for="(item, index) in list"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </ElCol>
      <ElCol :span="3">
        <ElButton type="text" class="mt10">删除全部</ElButton>
      </ElCol>
    </ElRow>
    <imgUpload
      :limit="3"
      v-model="topImagePath"
      @handleChose="handleChose"
      :choseList="choseList"
      :searchFlag="false"
      uploadType="product-img"
      :apiOptions="apiOptions"
      @success="getImgList"
    ></imgUpload>
    <flodText text="展开具体SKU图片" v-model="isHide" left="80px" @handleClick="val => isHide = !val"></flodText>
    <template v-if="isHide">
      <ElRow>
        <ElCol :span="21" style="opacity: 0">3</ElCol>
        <ElCol :span="3">
          <ElButton type="text" class="mt10">删除全部</ElButton>
        </ElCol>
      </ElRow>
      <imgUpload
        :limit="3"
        @handleChose="handleChoseSku"
        :choseList="choseSkuList"
        v-model="downImagePath"
        @success="getImgList"
        uploadType="product-img"
        :apiOptions="apiOptionsSku"
      ></imgUpload>
    </template>
    <!-- <btns :btns="bottomBtns"></btns> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    // bottomBtns: {
    //   type: Array,
    //   default: () => []
    // },
    productRepoId:{
        typeP: Number,
        default: null
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let vm = this;
    return {
      apiOptions: {
        // eslint-disable-next-line no-unused-vars
        delete(imageList) {
          return vm.$api[`product/prProductRepoImageDelete`]({
            productRepoId: vm.productRepoId,
            imgType: 2,
            imageList
          });
        },
        upload(imageList) {
          return vm.$api[`product/prProductRepoImageSave`]({
            productRepoId: vm.productRepoId,
            imgType: 2,
            imgSource: 2,
            variantPropertyId: 1, //?
            imageList
          });
        }
      },
      apiOptionsSku: {
        // eslint-disable-next-line no-unused-vars
        delete(imageList) {
          return vm.$api[`product/prProductRepoImageDelete`]({
            productRepoId: vm.productRepoId,
            imgType: 2,
            imageList
          });
        },
        upload(imageList) {
          return vm.$api[`product/prProductRepoImageSave`]({
            productRepoId: vm.productRepoId,
            imgType: 2,
            imgSource: 2,
            variantPropertyId: 1, //?
            imageList
          });
        }
      },
      fileList: [],
      isHide: false,
      form: {
        propertyList: null
      },
      list: [],
      myArray: [
        {
          name: "1"
        },
        {
          name: "2"
        },
        {
          name: "3"
        }
      ],
      choseList: [],
      choseSkuList: [],
      topList: [],
      downList: [],
      topImagePath: [],
      downImagePath: []
    };
  },
  created() {
    let vm = this;
    // vm.bottomBtns[1].show = false;
    vm.getVariantList();
    vm.getImgList();
  },
  watch: {
    variantList(val) {
      this.list = val;
    },
    fileList(val) {
      console.log(val);
    },
    "form.propertyList": {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) {
          return;
        }
        let vm = this;
        vm.$api[`product/prProductRepoGetVariantPropertyValue`]({
          productRepoId: 1,
          variantPerprotyId: val
        }).then(({ rows }) => {
          this.choseList = rows.map(item => {
            return {
              name: item.name,
              value: item.id
            };
          });
        });
      }
    }
  },
  computed: {
    ...mapState("common", ["variantList"]),
    editObj: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    ...mapActions("common", ["getVariantList"]),
    addPeople() {},
    getImgList() {
      let vm = this;
      vm.$api[`product/prProductRepoImageGet`]({
        productRepoId: vm.productRepoId,
        imgSource: 2
      }).then(({ rows: { topList, downList } }) => {
        vm.downList = downList;
        vm.topList = topList;
        vm.choseSkuList = downList.map(item => {
          return {
            name: item.repoSku,
            value: item.productRepoId
          };
        });
      });
    },
    handleChose(item) {
      // console.log(item);
      this.topList.forEach(i => {
        if (item.value == i.propertyId) {
          this.topImagePath = i.imagePaths;
        }
      });
    },
    handleChoseSku(item) {
      this.downList.forEach(i => {
        if (item.value == i.productRepoId) {
          console.log(item.value);
          this.downImagePath = i.imageList.map(k => k.imagePath);
        }
      });
    }
  },
  components: {
    imgUpload: () => import("../../../components/imgUpload"),
    vuedraggable: () => import("vuedraggable"),
    // btns: () => import("../common/btns"),
    flodText: () => import("../../baseInfo/common/flodText")
  }
};
</script>

<style lang='scss'>
.picture {
  background: #fff;
  .mt10 {
    margin-top: 10px;
  }
}
</style>
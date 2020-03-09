<template>
  <div class="picture">
    <ElRow>
      <ElCol :span="21">
        <ElSelect
          style="margin:10px 0px 20px 80px"
          size="small"
          v-model="form.property"
          clearable
          placeholder="请选择"
        >
          <ElOption
            v-for="(item, index) in variantList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </ElCol>
      <ElCol :span="3">
        <ElButton type="text" class="mt10" @click="deleteAll">删除全部</ElButton>
      </ElCol>
    </ElRow>
    <imgUpload
      :limit="3"
      v-model="topImagePath"
      @handleChose="handleChose"
      :variant.sync="variant"
      :choseList="choseList"
      :searchFlag="false"
      uploadType="product-img"
      :apiOptions="apiOptions"
      @success="handleSuccess"
    ></imgUpload>
    <flodText text="展开具体SKU图片" v-model="isHide" left="80px" @handleClick="val => isHide = !val"></flodText>
    <template v-if="isHide">
      <ElRow>
        <ElCol :span="21" style="opacity: 0">3</ElCol>
        <ElCol :span="3">
          <ElButton type="text" class="mt10" @click="deleteSkuAll">删除全部</ElButton>
        </ElCol>
      </ElRow>
      <imgUpload
        :limit="3"
        @handleChose="handleChoseSku"
        :choseList="choseSkuList"
        v-model="downImagePath"
        @success="handleSkuSuccess"
        uploadType="product-img"
        :variant.sync="variantSku"
        :apiOptions="apiOptionsSku"
        @searchSku="searchSku"
      ></imgUpload>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    let vm = this;
    return {
      variant: {},
      variantSku: {},
      apiOptions: {
        // eslint-disable-next-line no-unused-vars
        delete(imageList) {
          return vm.deletePic(imageList.map(item => item.ossUrl.imageId));
        },
        upload(imageList) {
          return vm.$api[`product/prProductRepoImageSave`]({
            productRepoId: vm.editObj.productRepoId,
            imgType: 2,
            imgSource: vm.editObj.picture.form.imgSource,
            variantPropertyId: vm.variantPropertyId, //?
            imageList
          });
        }
      },
      apiOptionsSku: {
        // eslint-disable-next-line no-unused-vars
        delete(imageList) {
          return vm.deleteSkuPic(imageList.map(item => item.ossUrl.imageId));
        },
        upload(imageList) {
          return vm.$api[`product/prProductRepoImageSave`]({
            productRepoId: vm.editObj.productRepoId,
            imgType: 1,
            imgSource: vm.editObj.picture.form.imgSource,
            productVariantId: vm.productVariantId, //?
            imageList
          });
        }
      },
      isHide: false,
      form: {
        property: null
      },
      choseList: [],
      choseSkuList: [],
      topList: [],
      downList: [],
      topImagePath: [],
      downImagePath: [],
      variantPropertyId: null,
      productVariantId: null,
      variantList: [],
      skuSearch: ""
    };
  },
  async created() {
    let vm = this;
    await vm.getImgList();
    await vm.getVariant();
    vm.utils.isArrLength(vm.variantList) &&
      (vm.form.property = vm.variantList[0].value);
    vm.utils.isArrLength(vm.choseSkuList) &&
      (vm.variantSku = vm.choseSkuList[0]);
    // vm.handleChoseSku(vm.downList.find(
    //   item => item.productRepoId == vm.variantSku.value
    // ));
    vm.utils.isArrLength(vm.downList) &&
      (vm.productVariantId = vm.downList[0].productRepoId);
  },
  watch: {
    "form.property": {
      immediate: true,
      deep: true,
      async handler(val) {
        if (!val) {
          return;
        }
        await this.getImgList();
        await this.getVariantPerprotyId(val);
      }
    },
    variant(val) {
      this.variantPropertyId = val.value;
    },
    variantSku(val) {
      this.productVariantId = val.value;
    },
    isHide: {
      immediate: true,
      handler(val) {
        let vm = this;
        if (val) {
          vm.handleChoseSku(
            vm.downList.find(item => item.productRepoId == vm.variantSku.value)
          );
        }
      }
    }
  },
  computed: {
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
    deletePic(imageIds) {
      let vm = this;
      return vm.$api[`product/prProductRepoImageDelete`]({
        productRepoId: vm.editObj.productRepoId,
        imgType: 2,
        imageIds
      });
    },
    deleteAll() {
      let vm = this;
      this.deletePic(this.topImagePath.map(item => item.imageId)).then(() => {
        vm.handleSuccess();
      });
    },
    deleteSkuPic(imageIds) {
      let vm = this;
      return vm.$api[`product/prProductRepoImageDelete`]({
        productRepoId: vm.productVariantId,
        imgType: 1,
        imageIds
      });
    },
    deleteSkuAll() {
      let vm = this;
      this.deletePic(this.downImagePath.map(item => item.imageId)).then(() => {
        vm.handleSkuSuccess();
      });
    },
    getVariant() {
      let vm = this;
      return vm.$api[`product/cateSystemCategoryPropertyMDropDownVariation`]({
        type: 1,
        productType: 1,
        id: vm.editObj.categoryId
      }).then(({ rows }) => {
        vm.variantList = rows.map(item => {
          return {
            label: item.desc,
            value: item.key,
            desc: item.desc
          };
        });
        return Promise.resolve();
      });
    },
    getVariantPerprotyId(val) {
      // 通过变体获取变体属性ID
      let vm = this;
      return vm.$api[`product/prProductRepoGetVariantPropertyValue`]({
        productRepoId: vm.editObj.productRepoId,
        variantPerprotyId: val
      }).then(({ rows }) => {
        this.$set(
          vm,
          "choseList",
          rows.map(item => {
            // choseList 变体属性集合
            return {
              name: item.name,
              value: item.id
            };
          })
        );
        vm.$nextTick(() => {
          if (vm.utils.isArrLength(vm.choseList)) {
            vm.variant = vm.choseList[0]; //  variant 默认第一个变体属性
            vm.handleChose(vm.variant);
          }
        });
        return Promise.resolve();
      });
    },
    getImgList() {
      // 获取图片列表
      let vm = this;
      return vm.$api[`product/prProductRepoImageGet`]({
        productRepoId: vm.editObj.productRepoId,
        imgSource: vm.editObj.picture.form.imgSource,
        sku: vm.skuSearch
      }).then(({ rows: { topList, downList } }) => {
        vm.$set(vm, "downList", downList);
        vm.$set(vm, "topList", topList); //
        vm.$set(
          vm,
          "choseSkuList", // sku列表
          downList.map(item => {
            return {
              name: item.repoSku,
              value: item.productRepoId
            };
          })
        );
        return Promise.resolve(vm.choseSkuList);
      });
    },
    async handleSuccess() {
      let vm = this;
      await vm.getImgList();
      vm.handleChose(vm.variant);
    },
    async handleSkuSuccess() {
      let vm = this;
      await vm.getImgList();
      vm.handleChoseSku(
        vm.downList.find(item => item.productRepoId == vm.variantSku.value)
      );
    },
    handleChose(item) {
      // 选择的时候匹配id显示右边的图片
      let vm = this;
      vm.topImagePath = [];
      vm.$nextTick(() => {
        vm.topList.forEach(i => {
          if (item.value == i.propertyId) {
            vm.$set(vm, "topImagePath", i.imagePaths);
          }
        });
      });
    },
    handleChoseSku(item, index = null) {
      let vm = this;
      vm.downImagePath = [];
      vm.$nextTick(() => {
        let data = null;
        if (index != null) {
          data = vm.downList[index].imageList;
        } else {
          data = item.imageList;
        }
        vm.$set(vm, "downImagePath", data);
      });
    },
    async searchSku(val) {
      let vm = this;
      vm.skuSearch = val;
      await vm.getImgList().then(choseSkuList => {
        if (vm.utils.isArrLength(choseSkuList)) {
          vm.variantSku = choseSkuList[0];
          vm.handleChoseSku(
            vm.downList.find(item => item.productRepoId == vm.variantSku.value)
          );
        }
      });
    }
  },
  components: {
    imgUpload: () => import("../../../components/imgUpload"),
    vuedraggable: () => import("vuedraggable"),
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
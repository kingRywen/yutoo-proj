<template>
  <div class="combinationInfo">
    <ElRow v-for="(item,index) in editObj.combinationInfo.form" :key="item.id" class="item-warp">
      <el-col :span="24" style="background: #f5f5f5;height: 40px;line-height: 40px;">
        <ElCol :span="5" style="padding-left: 10px;">仓库SKU:&nbsp; {{item.repoSku}}</ElCol>
        <ElCol
          :span="15"
          style="padding-left: 10px;"
        >变体属性:&nbsp; {{item.variantProperty.map(item => item.propertyName).join(",")}}</ElCol>
        <ElCol :span="4">
          <el-button
            size="small"
            style="background: rgba(58, 182, 254, 1);color: white"
            @click="addProduct(index)"
          >添加产品</el-button>
          <el-button
            size="small"
            :disabled="!item.combinationProductList.length"
            @click="handleDelete(index)"
          >删除</el-button>
          <el-button size="small" type="text" @click="handleHide(index)">
            <i
              :class="combinationFlags[index] ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
              style="font-size: 18px"
            ></i>
          </el-button>
        </ElCol>
      </el-col>
      <el-col :span="24">
        <customTable
          v-if="combinationFlags[index]"
          :hasSearch="false"
          :columns="columns"
          v-model="selectData"
          :searchConfig="searchConfig"
          :moreParams="{}"
          rowKey="productRepoId"
          :tableData="item.combinationProductList || []"
        ></customTable>
      </el-col>
    </ElRow>
    <btns :btns="bottomBtns"></btns>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    bottomBtns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          label: "图片",
          value: "image",
          type: "image"
        },
        {
          label: "产品名称",
          value: "nameCn"
        },
        {
          label: "仓库SKU",
          value: "repoSku"
        },
        {
          label: "系统SKU",
          value: "sysSku"
        },
        {
          label: "变体属性",
          value: "variantProperty"
        },
        {
          label: "产品数量",
          value: "productNumber",
          input: true
        }
      ],
      selectData: [],
      tableDatas: [],
      searchConfig: [],
      combinationFlags: [],
      combinationInfo: [
        {
          variantId: 1,
          repoSku: "232",
          variantProperties: "23432",
          combinationProductList: [
            // {
            //   productId: null,
            //   productNumber: 32432,
            //   sysSku: 32432,
            //   repoSku: 32432,
            //   variantProperty: 32432
            // }
          ]
        },
        {
          variantId: 1,
          repoSku: "232",
          variantProperties: "23432",
          combinationProductList: [
            // {
            //   productId: null,
            //   productNumber: 32432,
            //   sysSku: 32432,
            //   repoSku: 32432,
            //   variantProperty: 32432
            // }
          ]
        }
      ]
    };
  },
  created() {
    let vm = this;
    let len = vm.combinationInfo.length;
    vm.combinationFlags = [...new Array(len).keys()].map(() => false);
  },
  watch: {
    combinationInfo: {
      deep: true,
      handler(val) {
        this.$set(this.editObj.combinationInfo, "form", val);
      }
    },
    "editObj.combinationInfo.form": {
      deep: true,
      immediate: true,
      handler(val) {
        this.combinationInfo = val;
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
    handleHide(index) {
      this.$set(this.combinationFlags, index, !this.combinationFlags[index]);
    },
    handleDelete(index) {
      let selectIds = this.selectData.map(item => item.productRepoId);
      let restArr = this.combinationInfo[index].combinationProductList.filter(
        item => selectIds.every(i => item.productRepoId != i)
      );
      this.$set(this.combinationInfo[index], "combinationProductList", restArr);
    },
    addProduct(index) {
      let vm = this;
      vm._dialog({
        title: "添加组合产品",
        fullscreen: true,
        component: () => import("./addcombination/"),
        params: {
          systemCategoryId: vm.editObj.categoryId,
          addProduct(data) {
            console.log(data);
            // vm.combinationInfo[index].combinationProductList.push(...data);
            vm.$set(vm.combinationInfo[index], "combinationProductList", data);
          },
          tableData: vm.combinationInfo[index].combinationProductList
        }
      });
    }
  },
  components: {
    customTable: () =>
      import("Views/modules/product/common/base/components/customTable/src"),
    btns: () => import("../common/btns")
  }
};
</script>

<style lang='scss'>
.combinationInfo {
  background: #fff;
  .item-warp {
    margin-bottom: 20px;
  }
}
</style>
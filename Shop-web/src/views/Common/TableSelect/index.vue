<!--  -->
<template>
  <div class="__tableSelect">
    <template >
      <el-popover placement="left" width="140" v-model="customColumnPopover" trigger="click" popper-class="propClass" >

        <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox> -->
        <section v-for="(item,index) in tableSelect" class="__popover">
          <el-checkbox :indeterminate="item.indeterminate" v-model="item.checkAll" @change="val=>handleCheckAllChange(val,item,index)">{{item.name}}</el-checkbox>
          <!-- 此处要传全选的item,index,根据官方例子 this.checkAll = checkedCount === this.cities.length; 须改变的checkAll是父的-->
          <el-checkbox-group v-for="(child,childIndex) in item.childList" v-model="item.selected" style="margin-left:24px;" @change="value=>handleCheckedCitiesChange(value, item, index)">
            <el-checkbox :label="child.label" :key="child.name">{{child.name}}</el-checkbox>
          </el-checkbox-group>
          <div style="margin: 15px 0;"></div>
        </section>

        <!-- <div style="display:flex;justify-content: center;">
          <el-button type="primary" size="mini" @click="customColumnPopover = false">确认</el-button>
        </div> -->
        <el-button slot="reference" size="mini" type="primary" plain>自定义列表展示</el-button>
      </el-popover>
    </template>
  </div>
</template>

<script>
// const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  props: ["tableSelect"],
  components: {},
  data() {
    return {
      customColumnPopover: false // popover显示隐藏
      //   tableSelect: [
      //     {
      //       indeterminate: false,
      //       checkAll: true,
      //       name: "ARA数据",
      //       selected: ["araSearches"],
      //       allSelected: ["araSearches"],
      //       childList: [
      //         {
      //           name: "ARA搜索量",
      //           label: "araSearches"
      //         }
      //       ]
      //     },
      //     {
      //       indeterminate: false,
      //       checkAll: true,
      //       name: "广告数据",
      //       selected: ["advertExposure"],
      //       allSelected: ["advertExposure"],
      //       childList: [
      //         {
      //           name: "广告曝光量",
      //           label: "advertExposure"
      //         }
      //       ]
      //     },
      //     {
      //       indeterminate: false,
      //       checkAll: true,
      //       name: "其他",
      //       selected: ["googleSearches", "amazonProducts"],
      //       allSelected: ["googleSearches", "amazonProducts"],
      //       childList: [
      //         {
      //           name: "Google搜索量",
      //           label: "googleSearches"
      //         },
      //         {
      //           name: "产品数",
      //           label: "amazonProducts"
      //         }
      //       ]
      //     }
      //   ]
      //   checkAll: false,
      //   checkedCities: ["上海", "北京"],
      //   cities: cityOptions,
      //   isIndeterminate: true
    };
  },

  created() {},
  mounted() {},
  methods: {
    handleCheckAllChange(val, item, index) {
      //   console.log(val);
      //   console.log(item);
      //   console.log(index);
      let item_ = JSON.parse(JSON.stringify(item));
      // 全选，反选
      item_.selected = val ? item_.allSelected : [];
      //   console.log(item_.selected, "item_.selected;");
      item_.indeterminate = false;
      this.tableSelect.splice(index, 1, item_);
    },
    handleCheckedCitiesChange(value, item, index) {
      //   console.log(value);
      //   console.log(item);
      //   console.log(index);
      let checkedCount = value.length;
      let item_ = JSON.parse(JSON.stringify(item));
      item_.checkAll = checkedCount === item_.allSelected.length;
      item_.indeterminate =
        checkedCount > 0 && checkedCount < item_.allSelected.length;
      this.tableSelect.splice(index, 1, item_);
    }
  },
  computed: {},
  watch: {}
};
</script>

<style>
	
</style>
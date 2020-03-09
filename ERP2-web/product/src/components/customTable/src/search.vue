<template>
  <div class="table-search">
    <ElForm
      :model="form"
      class="search-form"
      ref="form"
      inline="inline"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        v-for="(item, index) in searchConfig"
        :label-width="labelWidth(item)"
        :label="item.label"
        :key="index"
      >
        <template v-if="item.type === 'batch'">
          <el-dropdown split-button type="primary">
            应用于{{num}}件选定的产品
            <el-dropdown-menu slot="dropdown">
              <template v-if="num > 0">
                <el-dropdown-item v-for="i in (item.btns || [])" :key="i.id">
                  <div @click="() => {i.fn ? i.fn(selectData) : ''}">{{i.name}}</div>
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else-if="item.type === 'add'">
          <ElButton class="search-add" @click="() => {item.fn ? item.fn() : ''}">{{item.name}}</ElButton>
        </template>
        <template v-else-if="item.type === 'input'">
          <el-input
            v-model="form[item.value || 'input']"
            :placeholder="item.placeholder || '请输入仓库SKU、系统SKU、中英文名称'"
            :style="{width: item.width || '300px'}"
            clearable
          ></el-input>
        </template>
        <template v-else-if="item.type === 'select'">
          <el-select
            v-model="form[item.value || 'select']"
            :placeholder="item.placeholder || '请选择'"
          >
            <el-option
              v-for="i in item.children || []"
              :key="i.id"
              :label="i.label"
              :value="i.value"
              clearable
            ></el-option>
          </el-select>
        </template>
        <template v-else-if="item.type === 'multiple'">
          <el-select
            v-model="form[item.value || 'multiple']"
            :placeholder="item.placeholder || '请选择(可多选)'"
          >
            <el-option
              v-for="i in item.children || []"
              :key="i.id"
              :label="i.label"
              :value="i.value"
              clearable
              multiple
              collapse-tags
            ></el-option>
          </el-select>
        </template>
        <template v-else-if="item.type == 'btn'">
          <ElButton class="search-btn" @click="searchForm">搜索</ElButton>
        </template>
      </el-form-item>
    </ElForm>
  </div>
</template>

<script>
export default {
  props: {
    selectData: {
      type: Array,
      default: () => []
    },
    searchConfig: {
      type: Array,
      default: () => [
        // {
        //   name: "添加",
        //   type: "add",
        //   fn() {
        //     console.log("add");
        //   }
        // },
        // {
        //   type: "batch",
        //   btns: [
        //     {
        //       name: "删除",
        //       fn() {
        //         console.log("甲");
        //       }
        //     }
        //   ],
        //   fn() {}
        // },
        // {
        //   type: "input",
        //   value: "bbb",
        //   fn() {}
        // },
        // {
        //   value: "aaa",
        //   type: "select",
        //   children: []
        // },
        // {
        //   value: "aaa",
        //   type: "multiple",
        //   children: []
        // }
      ]
    }
  },
  data() {
    return {
      form: {},
      rules: {}
    };
  },
  computed: {
    num: {
      get() {
        return this.selectData.length;
      },
      set() {}
    }
  },
  methods: {
    searchForm() {
      let vm = this;
      vm.$emit("searchForm", vm.utils.clone(vm.form));
    },
    labelWidth(item) {
      switch (item.type) {
        case "add":
          return "0px";
        case "dropDowm":
          return "0px";

        default:
          return item.labelWidth || "";
      }
    }
  }
};
</script>

<style lang='scss'>
.table-search {
  background: #fff;
  .el-button--primary {
    border-color: rgba(215, 215, 215, 1);
    background: rgba(243, 251, 255, 1);
    color: #999999;
    &:hover {
      background: rgba(62, 134, 255, 1);
      color: white;
    }
  }
  .el-dropdown__icon {
    font-size: 12px;
  }
  .search-form {
    .el-form-item {
      margin-bottom: 10px;
      .search-add {
        color: white;
        background: rgba(58, 182, 254, 1);
      }
    }
    .search-btn {
      color: white;
      background: rgba(62, 134, 255, 1);
    }
  }
}
</style>
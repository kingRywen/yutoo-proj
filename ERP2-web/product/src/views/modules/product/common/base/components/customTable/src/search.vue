<template>
  <div class="table-search">
    <ElForm
      :model="form"
      class="search-form"
      ref="form"
      inline="inline"
      :rules="rules"
      label-width="100px"
      size="small"
    >
      <el-form-item
        v-for="(item, index) in searchConfig"
        :label-width="labelWidth(item)"
        :label="item.label"
        :key="index"
      >
        <template v-if="item.type === 'dropDowm'">
          <el-dropdown split-button type="primary">
            应用于{{num}}件选定的产品
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="i in (item.btns || [])" :key="i.id">
                <div
                  v-if="selectData.length"
                  @click="() => {i.fn ? i.fn(selectData) : ''}"
                >{{i.name}}</div>
              </el-dropdown-item>
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
            clearable
          >
            <el-option
              v-for="i in item.children || []"
              :key="i.id"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </template>
        <template v-else-if="item.type === 'multiple'">
          <el-select
            v-model="form[item.value || 'multiple']"
            :placeholder="item.placeholder || '请选择(可多选)'"
            clearable
            multiple
            collapse-tags
          >
            <el-option
              v-for="i in item.children || []"
              :key="i.id"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
        </template>
      </el-form-item>
      <el-form-item>
        <ElButton v-if="hideSearchBtn" class="search-btn" @click="searchForm">搜索</ElButton>
      </el-form-item>
    </ElForm>
  </div>
</template>

<script>
export default {
  props: {
    useNumber: {
      type: Number,
      default: 0
    },
    hideSearchBtn: {
      type: Boolean,
      default: true
    },
    selectData: {
      type: Array,
      default: () => []
    },
    searchConfig: {
      type: Array,
      default: () => [
        {
          name: "添加",
          type: "add",
          fn() {
            console.log("add");
          }
        },
        {
          type: "dropDowm",
          btns: [
            {
              name: "删除",
              fn() {
                console.log("甲");
              }
            }
          ],
          fn() {}
        },
        {
          type: "input",
          value: "bbb",
          fn() {}
        },
        {
          value: "aaa",
          type: "select",
          children: []
        },
        {
          value: "aaa",
          type: "multiple",
          children: []
        }
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
        return this.useNumber;
      },
      set() {}
    }
  },
  created() {},
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
<template>
  <div>
    <div class="btns" v-if="tableBtns.length">
      <div v-for="btns in tableBtns" class="btn_wrapper">
        <el-button-group>
          <el-button type="success" plain v-for="btn in btns" @click="btn.fn">{{btn.name}}</el-button>
        </el-button-group>
      </div>
    </div>

    <!-- table -->
    <el-table :data="data.rows" style="width: 100%;margin-top:10px" @selection-change="handleSelectionChange" :max-height="12000">
      <el-table-column type="selection">
      </el-table-column>
      <slot>
        <el-table-column prop="date" label="日期">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </slot>
    </el-table>
    <el-pagination style="margin-top:10px" v-if="showPag" :page-sizes="[10, 20, 50, 100]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="data.total" :current-page="data.pageNo" :page-size="data.pageSize" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
  </div>
</template>

<script>
export default {
  name: "BasicTable",
  inject: ["handleCurrentChange", "handleSizeChange"],
  data() {
    return {
      selection: []
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("update:multipleSelection", val);
    }
  },
  props: {
    showPag: {
      default: true
    },
    tableBtns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({
        rows: []
      })
    }
  }
};
</script>


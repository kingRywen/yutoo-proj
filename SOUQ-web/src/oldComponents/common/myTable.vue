<!-- table组件 -->
<template>
  <div>
    <section>
      <el-table :height="table.height" ref="multipleTable" :data="table.data" style="width: 100%" stripe @section-change="handler">
        <el-table-column type="selection" width="55" v-if="table.isShowChecked">
        </el-table-column>
        <template v-for="(column,index) in columns">
          <!-- 有一下查看删除按钮的 -->
          <el-table-column align="center" v-if="column.operations" :prop="column.prop" :label="column.label" :width="column.width" :formatter="column.formatter">
            <template slot-scope="scope">
              <!-- 用v-if来判断在遍历column时，显示图片或者按钮 -->
              <img v-if="operate.img" v-for="operate in column.operations" :src="scope.row.imageUrl" style="cursor:pointer;background-size:100%">
              <el-button v-if="operate.label" v-for="operate in column.operations" size="small" type="primary" @click="operate.func(scope)">{{operate.label}}</el-button>
            </template>
          </el-table-column>
          <!-- 没有按钮的 -->
          <el-table-column align="center" v-else :prop="column.prop" :label="column.label" :width="column.width" :formatter="column.formatter">
          </el-table-column>
        </template>
      </el-table>
    </section>
  </div>
</template>

<script>
export default {
  name: "myTable",
  components: {},
  props: ["table", "columns"],
  data() {
    return {
      myTable: []
    };
  },

  created() {},
  mounted() {},
  methods: {
    handler(val) {
      this.$emit("select-item", val);
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>

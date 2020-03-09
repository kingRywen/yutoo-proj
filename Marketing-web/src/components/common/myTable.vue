<!-- table组件 -->
<template>
  <div>
    <section>
      <el-table ref="multipleTable" :data="table.data" style="width: 100%" :stripe="table.stripe" @section-change="handler">
        <el-table-column type="selection" width="55" v-if="table.isShowChecked">
        </el-table-column>
        <template v-for="(column,index) in columns">
          <!-- 有一下查看删除按钮的 -->
          <el-table-column align="center" v-if="column.operations" :prop="column.prop" :label="column.label" :width="column.width" :formatter="column.formatter">
            <template slot-scope="scope">
              <!-- 用v-if来判断在遍历column时，显示图片或者按钮 -->
              <div v-if="operate.category" v-for="operate in column.operations">
                <div class="fix__row_2" v-if="scope.row.category === '' || scope.row.category == null">{{scope.row.category | _formatData}}</div>
                <el-tooltip v-else placement="top" :content="scope.row.category">
                  <div class="fix__row_2">
                    <!-- 9-22 -->
                    {{scope.row.category | _formatData_cate}}
                  </div>
                </el-tooltip>
              </div>
              <!-- <div class="__img_wrapper" v-if="operate.img" v-for="operate in column.operations">
                <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
              </div> -->
              <el-popover placement="right" title="" trigger="hover" v-if="operate.img" v-for="operate in column.operations">
                <img :src="scope.row.imageUrl" />
                <div class="__img_wrapper" slot="reference">
                  <img class="loadingImg" v-if="scope.row.imageUrl" :key="scope.row.imageUrl" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'">
                </div>
              </el-popover>
              <div v-if="operate.title" v-for="operate in column.operations">
                <div class="fix__row_2" v-if="scope.row.title === '' || scope.row.title == null">{{scope.row.title | _formatData}}</div>
                <el-tooltip v-else placement="top" :content="scope.row.title">
                  <div class="fix__row_2">
                    {{ scope.row.title | _formatData}}
                  </div>
                </el-tooltip>
              </div>
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

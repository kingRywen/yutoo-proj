<template>
  <div style="max-width:1200px;margin:0 auto">
    <el-form :model="data" class="no-message">
      <el-table size="small" border :data="formData">
        <el-table-column label="币种">
          <template slot-scope="scope">
            <el-form-item>
              <!-- <el-input v-model="scope.row.currency" disabled></el-input> -->
              <el-select disabled style="width:100%" v-model="scope.row.currency" placeholder="请选择币种">
                <el-option v-for="(val, key) in curList" :key="key" :value="key" :label="val"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="汇率">
          <template slot-scope="scope">
            <el-form-item
              required
              :rules="[{ required: true, message: '请输入汇率' }]"
              :prop="`formData.${scope.$index}.rate`"
            >
              <el-input-number
                :min="0.01"
                style="width:100%"
                :controls="false"
                :precision="2"
                :max="99999999999"
                v-model="scope.row.rate"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="txc mt20" v-if="formData.length">
      <ElButton :disabled="$store.state.layoutLoading" @click="setData" type="primary">保存</ElButton>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: [],
      loading: false,
      curList: {}
    }
  },
  computed: {
    data() {
      return {
        formData: this.formData
      }
    }
  },
  created() {
    this.getCurList()
    this.getData()
  },
  methods: {
    getCurList() {
      this.$api[`main/exchangeRateCurrency`]({}).then(data => {
        this.curList = data.rows
      })
    },
    getData() {
      this.$api[`main/exchangeRateList`]({}).then(data => {
        this.formData = data.rows
      })
    },
    setData() {
      this.$api[`main/exchangeRateUpdate`](this.formData).then(data => {
        // this.
      })
    }
  }
}
</script>

<style lang="scss">
.no-message {
  .el-form-item {
    margin-bottom: 0 !important;
  }
}
</style>
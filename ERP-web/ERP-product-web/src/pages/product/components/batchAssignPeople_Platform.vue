<template>
  <v-form direction="horizontal">
    <table class="table">
      <template v-for="(item, index) in options">
        <tr>
          <td class="title1" :class="index === 0 ? 'first':''" width="200">{{item.operate}}</td>
          <td>
            <v-select
              style="width:100%"
              :data="item.operatorList"
              clue="userId"
              label="nickName"
              v-model="item.operatorId"
            ></v-select>
          </td>
        </tr>
      </template>
    </table>
    <div style="text-align: center;margin-top:20px">
      <v-button type="primary" @click="ok">确定</v-button>
    </div>
  </v-form>
</template>

<script>
import { fetchData, showToast } from 'common/common'
import apis from 'apis'

export default {
  created() {
    let { productPlatformId } = this.$attrs
    fetchData({
      ...apis.PRODUCT_PLATFORM_OPERATION_OPERATOR_LIST,
      data: {
        productPlatformId
      }
    }).then(res => {
      if (res.data.code !== 0) {
        showToast('error', res.data.msg)
        return
      }
      this.options = res.data.rows
    })
  },
  data() {
    return {
      options: [],

      ruleForm: {},

      labelCol: {
        span: 6
      },
      wrapperCol: { span: 14 }
    }
  },
  methods: {
    ok() {
      this.$listeners.set(this)
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.table {
  width: 100%;
  font-size: 11px;
  color: #333333;
  border-width: 1px;
  border-color: #dddddd;
  border-collapse: collapse;
  td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #dddddd;
    background-color: #ffffff;
  }
  .title1 {
    &.first {
      color: #108ee9;
    }
    background: #f2f2f2;
  }
}
h3 {
  margin: 10px 0 10px;
}
</style>

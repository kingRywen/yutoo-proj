<template>
  <div class="copy-btn-group">
    <el-button
      size="mini"
      :class="vertical? 'verticalBtns' : 'rowBtns'"
      :ref="'btnCustomerCopy'+index"
      data-clipboard-action="copy"
      :data-clipboard-target="'#success_form_input_customer'+index"
      v-for="(item,index) in copyBtton"
      :key="item.id"
      @click="$emit('btnInput', item)"
    >{{ item }}</el-button>
    <!-- 隐藏复制功能 -->
    <div class="copy-input-text">
      <input
        type="text"
        readonly="readonly"
        v-for="(item, index) in copyBtton "
        :id="'success_form_input_customer'+index"
        v-model="customerCopyTxt['value'+index]"
        :key="item.id"
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    vertical: {
      type: Boolean,
      default: () => false
    },
    copyBtton: {
      type: Array,
      default: () => {
        return [
          '{#账号签名#}',
          '{#客服名字#}',
          '{#客户名字#}',
          '{#客户地址#}',
          '{#OrderID#}',
          '{#产品名称#}',
          '{#追踪号#}',
          '{#LeaveFeedback#}',
          '{#LeaveProductReview#}',
          '{#ASIN#}'
        ]
      }
    },
    customerCopyText: {
      type: Array,
      default: () => {
        return undefined
      }
    }
  },
  data() {
    return {
      customerCopyTxt: {}
    }
  },
  created() {
    let vm = this
    if (vm.customerCopyText === undefined) {
      vm.copyBtton.map((item, index) => {
        vm.customerCopyTxt['value' + index] = item
      })
    } else {
      vm.customerCopyText.map((item, index) => {
        vm.customerCopyTxt['value' + index] = item
      })
    }
  },
  mounted() {
    let vm = this
    vm.$nextTick(() => {
      vm.copyBtton.map((item, index) => {
        new vm.clipboard(vm.$refs['btnCustomerCopy' + index][0].$el)
      })
    })
  }
}
</script>

<style lang="scss">
.copy-btn-group {
  .rowBtns {
    width: 19.3%;
    margin-top: 8px;
    margin-left: 0.87%;
    &:nth-child(1) {
      margin-left: 0px;
    }
    &:nth-child(6) {
      margin-left: 0;
    }
    &:nth-child(9) {
      span {
        margin-left: -17%;
      }
    }
  }
  .verticalBtns {
    width: 180px;
    margin-top: 8px;
    margin-left: 10px;
    &:nth-child(10) {
      margin-bottom: 8px;
    }
  }
  .copy-input-text {
    height: 1px;
    width: 100%;
    opacity: 0;
    overflow: hidden;
  }
}
</style>

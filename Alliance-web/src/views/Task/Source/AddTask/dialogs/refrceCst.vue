<template>
  <new-form :form-schema="formSchema" style="margin-right:20px" label-width="160px" :value="value"></new-form>
</template>
<script>
export default {
  data() {
    return {
      formSchema: {
        f1: {
          label: '佣金/件',
          disabled: true
        },
        f2: {
          label: '操作费$/次',
          tip: {
            content: '包含入库费、出库费、分拣费'
          },
          disabled: true
        },
        f3: {
          label: '仓储费$/立方英寸/天',
          disabled: true
        },
        f4: {
          label: '贴标费$/次',
          tip: {
            content: '纸箱贴标费、产品贴标费价格均一'
          },
          disabled: true
        },
        f5: {
          label: '打包费$/件',
          disabled: true
        },
        f6: {
          label: '纸箱费$/个',
          tip: {
            content: '标准箱'
          },
          disabled: true
        }
      },
      value: {}
    }
  }
}
</script>
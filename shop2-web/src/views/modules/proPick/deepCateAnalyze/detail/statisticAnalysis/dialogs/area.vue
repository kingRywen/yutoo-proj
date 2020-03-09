<template>
  <div>
    <el-form :model="data" ref="form" label-width="100px" size="small">
      <template v-for="(item, index) in data.value">
        <div class="flex-c" :key="index">
          <el-form-item :label="`区间${index+1}`" :prop="`value.${index}.priceFrom`" :rules="rule">
            <el-input-number
              :disabled="true"
              :max="999999"
              :min="0"
              :precision="2"
              :controls="false"
              v-model="item.priceFrom"
              placeholder="请输入值"
            ></el-input-number>
          </el-form-item>
          <span style="margin: 0 10px 18px">~</span>
          <el-form-item
            label-width="0"
            :prop="index == data.value.length-1 ?null: `value.${index}.priceTo`"
            :key="data.value.length-1"
            :rules="rule"
          >
            <el-input-number
              @change="handleMaxChange(index,item, $event)"
              :min="index == data.value.length-1 ? undefined: data.value[index].priceFrom+1"
              :controls="false"
              :precision="2"
              :max="999999"
              v-model="item.priceTo"
              placeholder="请输入值"
            ></el-input-number>
          </el-form-item>
          <ElButton type="primary" class="ml10" plain style="margin-bottom: 18px" @click="plus(item, index)">+</ElButton>
          <ElButton
            :style="{visibility: index == 0 ? 'hidden': 'false'}"
            type="primary"
            plain
            style="margin-bottom: 18px"
            @click="minus(item, index)"
          >-</ElButton>
        </div>
      </template>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['success'],
  data() {
    return {
      step: 0.01,
      merchantTaskId: +this.$route.query.merchantTaskId,
      rule: [
        {
          required: true,
          message: '不能为空'
        }
      ],
      data: {
        value: [{ priceFrom: 0 }, {}, {}]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      let params = {
        ...this.storeInfo,
        merchantTaskId: this.merchantTaskId
      }
      this.$api[`proPick/categoryDepthTaskMerchantGetProductStatPrice`](
        params
      ).then(data => {
        if (!data.data || !data.data.length) {
          return
        }
        // if (data.data.length > 0 && data.data[data.data.length - 1]) {
        //   data.data[data.data.length - 1].priceTo = 100
        // }
        this.data.value = data.data
      })
    },
    plus(item, index) {
      if (this.data.value.length >= 10) {
        this.$message.warning('最多只能设置10个价格区间')
        return
      }
      this.data.value.splice(index + 1, 0, {
        priceFrom: (item.priceTo * 100 + this.step * 100) / 100,
        priceTo: index == this.data.value.length - 1 ? undefined : undefined
      })
    },
    minus(item, index) {
      let val = this.data.value.splice(index, 1)
      // debugger
      if (index == 0) {
        this.data.value[0].priceFrom = 0
      } else {
        this.data.value[index] &&
          (this.data.value[index].priceFrom = val[0].priceFrom)
      }
    },
    handleMaxChange(index, item, val) {
      if (!this.data.value[index + 1]) {
        return
      }
      this.$set(
        this.data.value[index + 1],
        'priceFrom',
        (val * 100 + this.step * 100) / 100
      )
      if (
        this.data.value[index + 1].priceTo <
        (val * 100 + this.step * 100) / 100
      ) {
        this.$set(this.data.value[index + 1], 'priceTo', undefined)
      }
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          merchantTaskId: this.merchantTaskId,
          ...this.storeInfo,
          range: this.data.value.map((el, sort) => ({
            ...el,
            sort
          }))
        }
        return this.$api[
          `proPick/categoryDepthTaskMerchantSaveProductStatPrice`
        ](params).then(() => {
          this.success()
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>
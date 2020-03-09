<template>
  <div class="h100 flex-t-b">
    <div>
      <h2>产品分类</h2>
      <div>
        <span style="font-size: 14px">{{selectCateInfo.path}}</span>
        <ElButton type="primary" size="mini" plain class="ml10" @click="$emit('go', 1)">修改</ElButton>
      </div>
      <h2>选择语言</h2>
      <el-form ref="form" :model="formData">
        <el-form-item label-width="0" prop="value" :rules="[{required: true, message: '请选择语言'}]">
          <ElSelect style="width:100%" placeholder="请选择" v-model="formData.value">
            <ElOption v-for="(item, index) in langList" :key="index" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </el-form-item>
      </el-form>
    </div>
    <div class="txc">
      <ElButton type="primary" plain @click="$router.push('/product/amazon/platProduct')">取消</ElButton>
      <ElButton type="primary" @click="next">下一步</ElButton>
    </div>

    <!-- {{selectCateInfo}} -->
  </div>
</template>
<script>
import { langList, getLang } from 'Store/helper/common'
export default {
  props: ['selectCateInfo'],
  data() {
    return {
      formData: {}
    }
  },
  created() {
    this.getLangList()
  },
  computed: {
    ...langList
  },
  methods: {
    ...getLang,
    next() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('go', -1, this.formData.value)
        }
      })
    }
  }
}
</script>
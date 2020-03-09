<template>
  <div class="h100 flex-t-b">
    <div>
      <h2>产品分类</h2>
      <div>
        <span style="font-size: 12px">{{selectCateInfo.path}}</span>
        <ElButton type="primary" size="mini" plain class="ml10" @click="$emit('prev')">修改</ElButton>
      </div>
      <h2>选择语言</h2>
      <el-form ref="form" :model="formData">
        <el-form-item label-width="0" prop="lang" :rules="[{required: true, message: '请选择语言'}]">
          <ElSelect style="width:100%" placeholder="请选择" v-model="formData.lang">
            <ElOption v-for="(item, index) in langList" :key="index" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </el-form-item>
      <h2>选择店铺</h2>
        <el-form-item label-width="0" prop="store" :rules="[{required: true, message: '请选择店铺'}]">
          <ElSelect style="width:100%" placeholder="请选择" v-model="formData.store">
            <ElOption v-for="(item, index) in storeList" :key="index" :label="item.label" :value="item.value"></ElOption>
          </ElSelect>
        </el-form-item>
      </el-form>
    </div>
    <div class="txc">
      <ElButton type="primary" plain @click="$emit('prev')">取消</ElButton>
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
      formData: {},
      storeList: []
    }
  },
  created() {
    this.getLangList()
    this.getStoreList()
  },
  computed: {
    ...langList
  },
  methods: {
    ...getLang,
    getStoreList() {
      this.$api[`product/storeProductListStore`]({platSiteId: this.$route.query.platSiteId})
      .then((data) => {
        this.storeList = data.map(el => ({label: el.storeName, value: el.storeId}))
      })
    },
    next() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('next', this.formData)
        }
      })
    }
  }
}
</script>
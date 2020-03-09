<template>
  <div>
    <ElForm :model="data" size="small">
      <ElFormItem label="属性列表" prop="value" :rules="rules">
        <ElInput type="textarea" :rows="5" v-model="data.value" placeholder="自定义添加，多个换行输入"></ElInput>
      </ElFormItem>
      <ElFormItem>
        <el-tag
          size="large"
          style="margin-right: 6px; margin-bottom:8px"
          closable
          v-for="item in current"
          :key="item"
          type="primary"
          @close="handleClose(item)"
        >{{item}}</el-tag>
        <!-- <ElInput v-model="data.value" placeholder="自定义添加，多个换行输入"></ElInput> -->
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
export default {
	props: ['params'],
  data() {

    let check = (rule, value, cb) => {
      if (!this.current.length) {
        cb(new Error('请输入要添加的属性'))
      } 
      cb()
    }
    return {
      data: {
        value: ''
      },
      rules: [
        {
          validator: check
        }
      ]
    }
  },
  computed: {
    current() {
      let arr = this.data.value
        .split(/[\n|\r\n|,|，]+/)
        .map(el => el.trim())
        .filter(el => el !== '')
      arr = [...new Set(arr)]
      return arr
    }
  },
  methods: {
    handleClose(item) {
      let str = this.current.filter(el => el !== item).join('\n')
      this.data.value = str
    },
    _submit() {
      const { name, parentName } = this.params			
      const params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        name,
        parentName,
        cusAttrKeys: this.current
      }
      return this.$api[`sameAttrConfigDetailBatchSave`](params)
    }
  }
}
</script>

<style>
</style>

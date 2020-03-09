<template>
  <el-form label-width="100px">
    <el-form-item label="是否完成：">
      <el-select v-model="state" style="width:100%;">
        <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
    data() {
        return {
            state: 1,
            list: [{ value: 1, label: '已完成' }, { value: 0, label: '未完成' }]
        }
    },
    methods: {
        submitForm(orderServiceIds, callback) {
            console.log(orderServiceIds)
            this.$api['email/setCompleteSituation']({
                orderServiceIds,
                state: this.state
            }).then(res => {
                this.$message.success(res.msg)
                callback && callback()
            })
        }
    }
}
</script>
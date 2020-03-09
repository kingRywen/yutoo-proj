<template>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-row>
      <el-col :span="10">
        <el-form-item label="">
          <el-input v-model="formInline.val" placeholder="输入查询关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-col>
      <el-col class="btn-box" :span="10" :offset="2">
        <el-button @click="$emit('refresh')">刷新</el-button>
        <el-button type="success" @click="$emit('add', {src: addFrameSrc, requestUrl: addFrameUrl})">新增</el-button>
        <el-button type="primary" @click="$emit('edit')">编辑</el-button>
        <el-button type="danger">删除</el-button>
      </el-col>
    </el-row>
    
    
  </el-form>
</template>
<script>
export default {
  props: ['addFrameSrc', 'addFrameUrl'],
  data() {
    return {
      formInline: {
        val: ""
      }
    };
  },
  methods: {
    onSubmit(e) {
      console.log(e);
      this.$emit('search', {
        val: this.formInline.val
      })
    }
  }
};
</script>
<style scoped>
.btn-box {
    float: right;
}
</style>


<template>
  <el-dialog
  :title="title"
  :visible="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <slot></slot>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="cancel">确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
export default {
  props: ['dialogVisible', 'title'],
  data () {
    return {
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    cancel () {
      this.$emit('cancelData')
    }
  }
}
</script>

<template>
  <div class="face-sheet">
    <el-form ref="form" :model="form" label-width="90px" :rules="rules" :disabled="disabled">
      <el-form-item label="选择面单:" prop="faceSheetId">
        <el-select v-model="form.faceSheetId" size="small" placeholder="请选择" class="normal-input">
          <el-option v-for="item in faceSheetTempList" :label="item.label" :value="item.value" :key="item.id"></el-option>
          <!-- <el-option label="区域一" :value="1"></el-option>
          <el-option label="区域二" :value="0"></el-option>-->
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      form: {},
      disabled: false,
      rules: vm.$formValidate([
        {
          label: '面单',
          value: 'faceSheetId'
        }
      ])
    }
  },
  created() {
    this.getFaceSheetTempList()
  },
  computed: {
    ...mapState('logistics', ['faceSheetTempList'])
  },
  methods: {
    ...mapActions('logistics', ['getFaceSheetTempList']),
    getIdList(params) {
      this.form = params
    },
    resetForm() {},
    submitForm(cb) {
      let data = JSON.parse(JSON.stringify(this.form))
      this.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(data)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.face-sheet {
  background: #fff;
}
</style>

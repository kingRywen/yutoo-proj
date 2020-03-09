<template>
  <div class="inner-form mt20">
    <el-form class="mt20" size="small" ref="form" :model="formData">
      <el-form-item v-if="showWeek" prop="week" :rules="notEmpty">
        <el-checkbox-group v-model="formData.week" @change="handleChange">
          <el-checkbox
            v-for="item in weeks"
            :key="item.label"
            :label="item.label"
            :disabled="formData.week.indexOf(item.label) > -1 ? false: item.disabled"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="flex" v-for="(item, index) in formData.range">
        <el-form-item
          class="multi-array-item"
          label-width="20px"
          label="从"
          :prop="`range.${index}.start`"
          :rules="notEmpty"
        >
          <el-time-picker
            :picker-options="{
              selectableRange: `${index == 0 ? '00:00':(formData.range[index-1].end || '00:00')}:00 - 23:59:59`,
              format:'HH:mm'
            }"
            value-format="HH:mm"
            v-model="item.start"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label-width="20px" label="到" :prop="`range.${index}.end`" :rules="notEmpty">
          <el-time-picker
            :disabled="!item.start"
            :picker-options="{
             selectableRange: `${item.start}:00 - 23:59:59`,
              format:'HH:mm'
            }"
            value-format="HH:mm"
            v-model="item.end"
          ></el-time-picker>
        </el-form-item>
        <el-form-item>
          <div class="flex multi-array-item">
            <el-button type="default" @click="handleAdd(index)" v-if="formData.range.length - 1 == index">+</el-button>
            <el-button type="default" @click="formData.range.splice(index, 1)" v-if="formData.range.length > 1">-</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    formData: {
      default: () => ({})
    },
    showWeek: {
      default: false
    },
    weeks: Array
  },
  data() {
    return {
      // formData: {
      //   range: [
      //     {
      //       start: '',
      //       end: ''
      //     }
      //   ]
      // },
      notEmpty: [
        {
          required: true,
          message: '不能为空'
        }
      ]
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    handleChange(val) {
      this.$emit('changebox', val)
    },
    handleAdd(index) {
      let hasAdd = false,
        i = 0
      if (this.formData.range.some(e => JSON.stringify(e) === '{}')) {
        this.$message.warning('请填写完当前数据再新增')
        return
      }
      this.$refs.form.validateField(
        [`range.${index}.start`, `range.${index}.end`],
        err => {
          i++
          if (!err && !hasAdd && i == 2) {
            hasAdd = true
            this.formData.range.push({})
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.inner-form {
  border: 1px solid #ddd;
  padding: 0 18px 18px;
}
</style>
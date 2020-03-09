<template>
  <div>
    <!-- {{list}} -->
    <div class="wrapper">
      <ElForm label-width="80px" size="small" ref="form" :model="data">
        <ElRow :gutter="12" type="flex" v-for="(item, index) in list" :key="index">
          <ElCol :span="6">
            <ElFormItem label-width="0">
              <ElInput disabled v-model="item.name"></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="10">
            <ElFormItem label="账号复用" :prop="`list.${index}.extendType`" :rules="[{ required: true, message: '请选择' }]">
              <!-- <ElInput v-model="item.num"></ElInput> -->
              <el-select v-model="item.extendType" @change="handleChange(item, $event)" placeholder style="width:100%">
                <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </ElFormItem>
          </ElCol>
          <ElCol v-if="item.extendType" :span="8">
            <ElFormItem label-width="0" v-if="item.extendType" :prop="`list.${index}.quantity`" :rules="[{ required: true, message: '请输入数量' }]">
              <ElInputNumber controls-position="right" v-model="item.quantity"></ElInputNumber>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {
      selectList: [
        {
          label: '全局最大化',
          value: 0
        },
        {
          label: '限定数量',
          value: 1
        }
      ]
    }
  },
  computed: {
    data() {
      return {
        list: this.list
      }
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    handleChange(item, val) {
      if (val === 0) {
        this.$set(item, 'quantity', undefined)
      }
    }
  }
}
</script>

<style>
</style>

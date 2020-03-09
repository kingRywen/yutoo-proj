<template>
  <ElForm ref="form" :model="data" size="small" label-width="120px">
    <ElFormItem label="人群属性名称" prop="crowdPropertyName" :rules="[{ required: true, message: '请输入人群属性名称' }]">
      <ElInput v-model="data.crowdPropertyName"></ElInput>
    </ElFormItem>
    <ElFormItem label="备注">
      <ElInput type="textarea" :rows="4" v-model="data.remark"></ElInput>
    </ElFormItem>
    <div>
      <h4 class="title">人群属性值</h4>
    </div>
    <div class="box">
      <ElRow type="flex" :gutter="12" v-for="(item, index) in data.crowdPropertyValueArray" :key="index">
        <ElCol :span="10">
          <ElFormItem label="属性值" :prop="`crowdPropertyValueArray.${index}.value`" :rules="[{ required: true, message: '请输入属性值' }]">
            <ElInput v-model="item.value"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="10">
          <ElFormItem label="属性描述" :prop="`crowdPropertyValueArray.${index}.description`" :rules="[{ required: true, message: '请输入属性描述' }]">
            <ElInput v-model="item.description"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="4">
          <ElButton type="text" icon="el-icon-plus" style="margin:0;padding: 10px 4px" @click="add(item, index)"></ElButton>
          <ElButton
            type="text"
            icon="el-icon-minus"
            :style="{margin: 0, padding: '10px 4px', visibility: data.crowdPropertyValueArray.length <= 1 ? 'hidden' : 'initial'}"
            @click="minus(item, index)"
          ></ElButton>
        </ElCol>
      </ElRow>
    </div>
  </ElForm>
</template>

<script>
export default {
  data() {
    return {
      data: {
        crowdPropertyName: null,
        remark: null,
        crowdPropertyValueArray: [
          {
            value: null,
            description: null
          }
        ]
      }
    }
  },
  methods: {
    clear() {
      Object.assign(this.$data, this.$options.data())
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    add(item, index) {
      this.data.crowdPropertyValueArray.splice(index + 1, 0, {
        value: null,
        description: null
      })
    },
    minus(item, index) {
      this.data.crowdPropertyValueArray.splice(index, 1)
    },
    setData(data) {
      if (data === true) {
        this.data = {
          crowdPropertyName: null,
          remark: null,
          crowdPropertyValueArray: [
            {
              value: null,
              description: null
            }
          ]
        }
        return
      }
      Object.assign(this.data, data)
    }
  }
}
</script>

<style lang='scss' scoped>
.box {
  background: #f2f2f2;
  padding: 20px 0 0;
}
</style>

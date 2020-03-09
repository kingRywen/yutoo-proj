<template>
  <el-form ref="form" :model="data">
    <yt-table :data="data.ids" :columns="columns">
      <template slot="right">
        <el-table-column label="打印数量" align="center">
          <template slot-scope="scope">
            <ElFormItem
              label-width="0"
              class="per100"
              :prop="`ids.${scope.$index}.num`"
              :rules="[{required: true, message: '请输入数量'}]"
            >
              <el-input-number
                :min="1"
                :controls="false"
                class="per100"
                v-model="scope.row.num"
                size="small"
                placeholder="打印数量"
              ></el-input-number>
            </ElFormItem>
          </template>
        </el-table-column>
      </template>
    </yt-table>
    <div class="txc">
      <el-button class="mt20" type="primary" @click="handleClick">确认选择</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    data: {
      default: () => {}
    }
  },
  data() {
    let formData = this.data.ids.map(el => ({ ...el, num: undefined }))
    return {
      columns: [
        {
          value: 'imgPath',
          label: '图片',
          img: true,
          style: {
            //图片宽高
            width: 45,
            height: 45
          }
        },
        { value: 'customSku', label: '自定义SKU', width: 200 },
        { value: 'name', label: '产品名' }
      ],
      formData
    }
  },
  methods: {
    handleClick() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = this.data.ids
            .map(el => el.productId + '-' + el.num)
            .join('_')
          this.$router.push({
            name: 'printPlugSpecification',
            params: { id: params }
          })
        }
      })
    }
  }
}
</script>

<style>
</style>

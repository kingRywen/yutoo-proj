<template>
  <div class="__edit--wrapper">
    <el-tabs v-model="activeName" class="__custom-tabs">
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name" lazy>
        <WidgetCardWrapper :isCollapse="true" :defaultHide="false" title="任务信息">
          <div>状态：图片审核不通过</div>
          <div>任务发起时间：2019-08-07 20：30：20</div>
          <div>编辑复制人员：llincy</div>
          <div>店铺：amazin-A01</div>
          <div>审核人员：lincy</div>
          <div>审核审核时间：2019-08-07 20：30：20</div>
        </WidgetCardWrapper>
        <WidgetCardWrapper :isCollapse="false">
          <new-form :disabled="isDisabled" :form-schema="formSchema" label-width="110px" ref="form" v-model="data"></new-form>
          <div class="hr"></div>
          <div class="flex">
            <div>
              <ElButton :disabled="isDisabled" type="primary" size="small">下载图片文件</ElButton>
            </div>
          </div>
        </WidgetCardWrapper>
        <WidgetCardWrapper class="img" :isCollapse="true" title="具体SKU图片">
          <ImgUpload />
        </WidgetCardWrapper>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ImgUpload from 'Views/modules/product/common/base/components/imgUpload'
export default {
  components: {
    ImgUpload
  },
  props: {
    // 是否不可编辑
    isDisabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      tabs: [
        {
          label: '任务1',
          name: 'first'
        },
        {
          label: '任务2',
          name: 'second'
        }
      ],
      activeName: 'first',

      formSchema: {
        upload: {
          widget: 'upload',
          required: true,
          noLabel: true,
          fileLimit: 'all',
          limitSize: 2000,
          limit: 1,
          action: 'https://jsonplaceholder.typicode.com/posts/'
        }
      },
      data: {}
    }
  }
}
</script>
<style lang="scss" scoped>
.hr {
  border-top: 1px solid #ddd;
  margin: 10px -10px;
}
.wrapper {
  & /deep/ .content.img {
    padding: 0;
    border: none;
    .category {
      padding: 0;
      width: 100%;
    }
  }
}
</style>
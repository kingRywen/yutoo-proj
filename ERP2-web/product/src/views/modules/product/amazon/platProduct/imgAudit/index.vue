<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="图片信息" lazy>
        <EditForm :isDisabled="true" />
      </el-tab-pane>
      <el-tab-pane name="second" label="审核">
        <ElTabs v-model="activeName1" class="__custom-tabs">
          <ElTabPane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name">
            <AuditForm @form-submit="submit" :value.sync="item.data" ref="form" />
          </ElTabPane>
        </ElTabs>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import EditForm from '../imgEdit/editForm'
import AuditForm from '../infoAudit/auditForm'
export default {
  components: {
    EditForm,
    AuditForm
  },
  data() {
    return {
      activeName: 'second',
      activeName1: 'first',
      tabs: [
        {
          label: '任务1',
          name: 'first',
          data: {}
        },
        {
          label: '任务2',
          name: 'second',
          data: {}
        }
      ]
    }
  },
  methods: {
    submit(data) {
      const forms = this.$refs.form.slice()
      if (forms.every(el => el.validSuccess)) {
        const { productPlatId, platSiteId } = this.$route.query
      const params = { ...data, platSiteId, productPlatIds: [productPlatId] }
      this.$api[`product/prProductPlatAmzAuditBasic`](params).then(() => {
        this.$router.go(-1)
      })
      } else {
        this.$message.warning('请审核完所有的任务！')
        const index = forms.findIndex(el => el.validSuccess == false)
        this.activeName1 = this.tabs[index].name
        this.$nextTick(() => {
          forms[index].$refs.form.validate()
        })
      }
      
      
    }
  }
}
</script>
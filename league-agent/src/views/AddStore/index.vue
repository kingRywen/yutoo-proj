<template>
  <div>
    <el-page-header @back="goBack" :content="view ? '查看店铺':quick ? '快速新增店铺' : edit ? '编辑店铺' : '新增店铺'"></el-page-header>
    <br />
    <br />
    <br />

    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <div class="mt10" style="margin-left: 120px">
      <ElButton type="primary" @click="submit" class="more-len">提交</ElButton>
      <ElButton type="primary" @click="$router.go(-1)" plain>取消</ElButton>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    view: {
      default: false,
      type: Boolean
    },
    quick: {
      default: false,
      type: Boolean
    },
    edit: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      formSchema: {
        platformSiteId: {
          width: '200px',
          widget: 'cascader',
          label: '平台站点',
          clearable: true,
          required: true,
          options: '$store.common.platSite',
          props: {
            label: 'cnName',
            value: 'platformSiteId',
            children: 'childs'
          },
          handler: {
            action: 'common/getPlatSite'
          }
        },
        sellerName: {
          width: '400px',
          maxlength: 100,
          placeholder: '请填写平台真实店铺名称（SellerName，用于发布任务）',
          label: '店铺名称',

          required: true
        }
      },
      value: {}
    }
  },
  created() {
    if (this.edit) {
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$api[`agent/merchantStoreInfo`]({ id: this.$route.query.id }).then(
        data => {
          data.rows.platformSiteId = [
            data.rows.platformCode,
            data.rows.platformSiteId
          ]
          this.value = data.rows
        }
      )
    },
    goBack() {
      this.$router.go(-1)
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api[
            `agent/${this.edit ? 'merchantStoreUpdate' : 'merchantStoreSave'}`
          ]({
            ...this.value,
            platformSiteId: this.value.platformSiteId.slice().pop()
          }).then(() => {
            // this.$store.dispatch('common/getStore')
            this.$router.push('/stores')
          })
        }
      })
    }
  }
}
</script>
<template>
  <div>
    <ElForm ref="form" :model="data" size="small" class="table-form" :rules="rules">
      <ElRow>
        <ElCol :span="12">
          <ElFormItem label="模板类型" prop="templateType">
            <el-select class="mt10" v-model="data.templateType" style="width:100%">
              <el-option v-for="item in templateTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </ElFormItem>
        </ElCol>
        <el-col :span="12">
          <ElFormItem label="模板名称" prop="templateName">
            <ElInput class="mt10" v-model.trim="data.templateName"></ElInput>
          </ElFormItem>
        </el-col>
      </ElRow>
      <ElRow type="flex">
        <el-col :span="20">
          <ElFormItem label="模板内容" prop="templateContent">
            <div class="normal">
              <ElFormItem label="原因" label-width="100px" prop="contactReason">
                <ElInput v-model.trim="data.contactReason"></ElInput>
              </ElFormItem>
              <ElFormItem label="详细说明" label-width="100px" prop="templateContent">
                <ElInput type="textarea" :rows="10" v-model.trim="data.templateContent"></ElInput>
              </ElFormItem>
            </div>
          </ElFormItem>
        </el-col>
        <ElCol :span="4" style="height:360px">
          <ElFormItem label="替换标签">
            <div style="margin-top:60px" class="btn">
              <ElTooltip content="加入后可根据当前客户的名字来替换" placement="right">
                <el-button @click="handleClick('{#买家名字#}')" style="width:100%">{#买家名字#}</el-button>
              </ElTooltip>
              <ElTooltip content="加入后可根据当前客户的订单收货地址来替换" placement="right">
                <el-button @click="handleClick('{#买家地址#}')" style="width:100%">{#买家地址#}</el-button>
              </ElTooltip>
              <ElTooltip v-if="data.templateType == 2" content="加入后可根据当前客户的OrderID来替换，客户退款才可用" placement="right">
                <el-button @click="handleClick('{#OrderID#}')" style="width:100%">{#OrderID#}</el-button>
              </ElTooltip>
              <ElTooltip content="加入后可根据当前客户的订单产品的英文名字来替换" placement="right">
                <el-button @click="handleClick('{#产品名称#}')" style="width:100%">{#产品名称#}</el-button>
              </ElTooltip>
              <ElTooltip v-if="data.templateType == 0" content="加入后可根据当前客户的订单发货追踪号来替换，亚马逊丢件才可用" placement="right">
                <el-button @click="handleClick('{#ShipmentId#}')" style="width:100%">{#ShipmentId#}</el-button>
              </ElTooltip>
              <ElTooltip content="加入后可根据当前客户的订单产品的ASIN码来替换 (限亚马逊)" placement="right">
                <el-button @click="handleClick('{#ASIN#}')" style="width:100%">{#ASIN#}</el-button>
              </ElTooltip>
            </div>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <div class="mt10">
      <span>是否默认：</span>
      <ElSwitch v-model="data.defaultFlag" :active-value="1" :inactive-value="0"></ElSwitch>
    </div>
  </div>
</template>

<script>
export default {
  props:['params'],
  data() {
    return {
      rules: {
        templateType: [{ required: true, message: '不能为空' }],
        templateName: [{ required: true, message: '不能为空' }],
        templateContent: [{ required: true, message: '不能为空' }],
        contactReason: [{ required: true, message: '不能为空' }]
      },
      data: {
        templateContent: ''
      },
      templateTypeList: [
        {
          label: '亚马逊丢货未赔偿',
          value: 0
        },
        {
          label: '亚马逊损坏未赔偿',
          value: 1
        },
        {
          label: '客户退款未退货未赔偿',
          value: 2
        },
        {
          label: 'FBA配送费不对重测',
          value: 3
        },
        {
          label: '佣金不对重测',
          value: 4
        },
        {
          label: '仓储费不对重测',
          value: 5
        },
        {
          label: 'FBA配送费不对索赔',
          value: 6
        },
        {
          label: '佣金不对索赔',
          value: 7
        },
        {
          label: '仓储费不对索赔',
          value: 8
        },
      ]
    }
  },
  methods: {
    handleClick(str) {
      this.data.templateContent += str
    },
    _initData() {
      if (this.params && this.params.edit) {
        this.data = Object.assign({}, this.data, this.params.row)
      }
      
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        const { sellerId, siteId, platformId } = this.sellerData
        return this.$api[this.params && this.params.edit ? `taskClaimTemplateUpdate` : `taskClaimTemplateSave`]({...this.data, sellerId, siteId, platformId})
      })
    }
  },
}
</script>
<style lang="scss">
.table-form {
  
  border: 1px solid #ddd;
  border-width: 1px 0 0 1px;
  .el-form-item__error {
    padding-left: 10px;
  }
  .el-col {
    // padding: 10px;
    border: 1px solid #ddd;
    border-width: 0 1px 1px 0;
    .el-form-item__label {
      background: #f2f4f5;
      width: 100%;
      text-align: left;
      padding: 10px;
      line-height: 20px;
      border-bottom: 1px solid #ddd;
    }
    .el-form-item__content {
      padding: 0 10px;
    }
  }
  .normal {
    .el-form-item__label {
      line-height: 14px;
      text-align: right;
      background-color: transparent;
      border: none;
    }
    .el-form-item--small.el-form-item:first-child {
      margin-top: 60px;
    }
    & + .el-form-item__error {
      display: none;
    }
  }
  .btn {
    .el-button {
      margin-left: 0;
      margin-bottom: 10px;
    }
  }
}
</style>

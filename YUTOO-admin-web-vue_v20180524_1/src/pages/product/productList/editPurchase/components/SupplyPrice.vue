<template>
  <div>
    <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="ruleForm">
      <v-row>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="网络采购链接">
            <v-input type="textarea" v-model="ruleForm.persellFlag"></v-input>
            <v-button>采集</v-button>
            <v-button>添加供应商</v-button>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商">
            <v-select v-model="ruleForm.persellFlag" :data="[{text:1, value:'1'}]"></v-select>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商SKU">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商发货地">
            <v-cascader :data="options" @change="onchange"></v-cascader>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商报价">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="采购运费">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="批发数量">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="12">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="批发价格">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="12">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否提供备品">
            <v-switch v-model="ruleForm.persellFlag"></v-switch>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="采购天数">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="生产天数">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="运输天数">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="入库天数">
            <v-input v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
            <v-input type="textarea" v-model="ruleForm.persellFlag"></v-input>
          </v-form-item>
        </v-col>

      </v-row>
    </v-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [
        {
          value: "sc",
          label: "四川",
          children: [
            {
              value: "cd",
              label: "成都",
              children: [
                {
                  value: "jyq",
                  label: "九眼桥"
                },
                {
                  value: "cxl",
                  label: "春熙路"
                }
              ]
            },
            {
              value: "nc",
              label: "南充",
              children: [
                {
                  value: "nbx",
                  label: "南部县"
                }
              ]
            }
          ]
        },
        {
          value: "cq",
          label: "重庆",
          children: [
            {
              value: "lp",
              label: "梁平",
              children: [
                {
                  value: "sgt",
                  label: "双桂堂"
                }
              ]
            }
          ]
        }
      ],
      ruleForm: {},
      rules: {},
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      }
    };
  },
  methods: {
    onchange(val) {
      console.log(val);
    }
  }
};
</script>

<style>
</style>

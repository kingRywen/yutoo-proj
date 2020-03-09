<template>
  <div style="padding:20px">
    <v-select size="lg" placeholder="请选择SKU类型" style="width: 50%;" :data="options" @change="change" :allowClear='false' v-model="skuType"></v-select>
    <p class="margin-top-10">一行一个从Excel复制</p>
    <p class="margin-top-10">格式：成品SKU 原料SKU 原料SKU数量
      <span class="text-primary">（注：严格按照顺序，不能打乱）</span>
    </p>
    <v-input type="textarea" class="margin-top-10" :autosize="{minRows:12}" v-model="inputText" wrap="hard"></v-input>
    <div class="margin-top-10">
      <v-button type="primary" @click="generate">开始生成</v-button>
    </div>

    <p class="margin-top-10">生成结果:</p>
    <div v-if="result.success.length > 0">
      <h3 style="margin:20px 0">
        <v-icon type="check" style="color:#00a854"></v-icon>成功{{result.success.length}}个</h3>
      <p style="text-indent:10px" v-for="suc in result.success">SKU为{{suc.sku}}的产品成功添加了{{suc.num}}个sku为{{suc.relSku}}的原材料</p>
    </div>
    <div v-if="result.fail.length > 0">
      <h3 style="margin:20px 0">
        <v-icon type="close" style="color:#f04134"></v-icon>失败{{result.fail.length}}个</h3>
      <p style="text-indent:10px" v-for="suc in result.fail">SKU为{{suc.sku}}的产品添加失败</p>
    </div>
    <!-- <v-input type="textarea" class="margin-top-10" placeholder="" :autosize="{minRows:12}"></v-input> -->
  </div>
</template>

<script>
import { fetchData, handlerCode, showToast } from "common/common";
import apis from "apis";

export default {
  data() {
    return {
      inputText: "",
      skuType: 0,
      result: {
        success: [],
        fail: []
      },
      options: [
        {
          label: "系统SKU",
          value: 0
        },
        {
          label: "自定义SKU",
          value: 1
        }
      ]
    };
  },
  methods: {
    change() {},
    generate() {
      let list = [];
      console.log(JSON.stringify(this.inputText));
      let list1 = this.inputText
        .split(/\n/)
        .filter(el => el != "" && el != null);
      list1.forEach(element => {
        let els = element.replace(/(\s|\t){2,}/gi, " ").split(/\s/);
        list.push({
          sku: els[0],
          relSku: els[1],
          num: +els[2]
        });
      });
      console.log(list);
      if (list.length <= 0) {
        showToast("error", "请输入数据");
        return;
      }
      fetchData({
        ...apis.PRODUCT_BATCH_UPLOAD_MATERIAL,
        data: {
          skuType: this.skuType,
          list
        }
      }).then(res => {
        handlerCode(res, () => {
          delete res.data.code;
          this.result = res.data;
        });
      });
    }
  }
};
</script>

<style>
</style>

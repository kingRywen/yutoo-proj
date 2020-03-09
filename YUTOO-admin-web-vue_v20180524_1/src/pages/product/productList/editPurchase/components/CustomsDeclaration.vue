<template>
  <div v-if="showField.length">
    <v-card :title="$attrs.type == 1?'母体基本信息': ($attrs.type == 2 ?'母体差异字段信息' :`变体sku:${$attrs.sku}差异字段信息`)" class="margin-bottom-20">
      <v-form :model="ruleForm" direction="horizontal" :rules="renderedField.vali" ref="ruleForm">
        <v-row>
          <v-col span="24" v-if="showField.indexOf('titleEn') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品英文名称" prop="titleEn">
              <v-input v-model="ruleForm.titleEn"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('entryNameEn') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品报关英文名称" prop="entryNameEn">
              <v-input v-model="ruleForm.entryNameEn"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('entryNameZh') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品报关中文名" prop="entryNameZh">
              <v-input v-model="ruleForm.entryNameZh"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('productApplication') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品用途" prop="productApplication">
              <v-input v-model="ruleForm.productApplication"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('entryMaterial') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="报关材质" prop="entryMaterial">
              <v-input v-model="ruleForm.entryMaterial"></v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('hsCode') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="海关编码" prop="hsCode">
              <v-input v-model="ruleForm.hsCode"></v-input>
              <v-switch v-model="ruleForm.hsCodeAudit" :true-value="1" :false-value="0"></v-switch>是否审核
              <v-button @click="openLink">查询海关编码</v-button>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('refundRate') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="退税率" prop="refundRate">
              <v-input v-model.number="ruleForm.refundRate">
                <span slot="after">%</span>
              </v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('entryPrice') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="报关价" prop="entryPrice">
              <v-input v-model.number="ruleForm.entryPrice">
                <span slot="after">USD</span>
              </v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('entryUnit') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="报关单位" prop="entryUnit">
              <v-input v-model="ruleForm.entryUnit">
              </v-input>
            </v-form-item>
          </v-col>
          <v-col span="24" v-if="showField.indexOf('europeEntryLink') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="欧洲报关链接" prop="europeEntryLink">
              <v-input v-model="ruleForm.europeEntryLink">
              </v-input>
              <v-button>打开报关链接</v-button>
            </v-form-item>
          </v-col>

          <v-col span="24" v-if="showField.indexOf('europeEntryPrice') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="欧洲报关链接价格" prop="europeEntryPrice">
              <v-input v-model.number="ruleForm.europeEntryPrice">
                <span slot="after">UER</span>
              </v-input>
            </v-form-item>
          </v-col>

          <v-col span="24" v-if="showField.indexOf('declareElement') >= 0">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="申报要素" prop="declareElement">
              <v-input v-model="ruleForm.declareElement">
                <span slot="after">UER</span>
              </v-input>
            </v-form-item>
          </v-col>

        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: ["ruleForm"],
  data() {
    return {
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
    // 打开海关编码查询
    openLink() {
      window.open("https://www.hsbianma.com/");
    },
    // 修正小数点
    fixN(key, val) {
      console.log(key, val);
      this.$set(this.ruleForm, key, formatCurrency(val, 2));
    },
    showSupply() {
      showDialog(
        "SupplyPrice",
        { title: "添加修改供货价", width: 1200, okText: "保存" },
        {},
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(arr) {
            console.log(arr);
            Vue.set(
              vm.items,
              index,
              Object.assign({}, vm.items[index], { childs: arr })
            );
            // vm.items[index].childs = arr;
            console.log(vm.items);
            setTimeout(() => {
              fixFrameHeight(1);
            });
          }
        }
      );
    }
  },
  watch: {
    ruleForm(val) {
      this.$emit("update:senddata", val);
    }

    // 设置包邮
    // "ruleForm.pinkageFlag"(val) {
    //   console.log(val);
    //   if (val) {
    //     this.ruleForm.freightPrice = "0.00";
    //   } else {
    //     this.ruleForm.freightPrice = this.ruleForm.freightCost;
    //   }
    // }
  },
  computed: {
    // 找到需要渲染的字段
    showField() {
      // 如果是母体
      if (this.$attrs.type == 1) {
        return this.renderedField.inputArrs.map(
          el => el.displayKey || el[0].displayKey
        );
      } else {
        return this.renderedField.variants.map(el => el.displayKey);
      }
    },

    // 获取动态字段
    renderedField() {
      return this.$attrs.formatField.entryInfoTabField;
    }
  }
};
</script>

<style>
</style>

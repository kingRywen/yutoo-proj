<template>
  <v-spin tip="正在读取数据..." :spinning="spinning">

    <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="ruleForm">
      <v-row>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="网络采购链接">
            <v-input type="textarea" v-model="ruleForm.purchaseLink" :autosize="{minRows: 4}"></v-input>
            <!-- <v-button>采集</v-button>
            <v-button>添加供应商</v-button> -->
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商" required prop="supplierId">
            <v-select v-model="ruleForm.supplierId" :data="suppliers" label="supplierName" clue="supplierId" size="lg"></v-select>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商SKU">
            <v-input v-model="ruleForm.supplierSku"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商发货地" required prop="supplierAddressId">
            <!-- <v-cascader :data="options" v-model="ruleForm.supplierAddressId"></v-cascader> -->
            <SyncCascader :city="city" :load="lists" :props="prop" v-model="ruleForm.supplierAddressId" @change="$refs.ruleForm.validate()"></SyncCascader>
          </v-form-item>
        </v-col>

        <v-col span="24">
          <v-form :model="priceModel" ref="priceForm" direction="horizontal">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="供应商报价" style="margin-bottom:0">
              <div class="clearBoth" v-for="(item, index) in priceModel.priceArr">
                <v-row class="__row">
                  <v-col span="8">
                    <v-form-item :label-col="labelCol1" :wrapper-col="wrapperCol1" label="数量">
                      <v-row>
                        <v-col span="11">
                          <v-form-item style="width:100%" required :prop="'priceArr.' + index + '.numStart'" :rules="numRuleStart(priceModel.priceArr, index)">
                            <v-input-number size="large" style="width:100%" :disabled="index === 0" :value.number="item.numStart || ''" @input="val => (index === 0 ? '': priceModel.priceArr[index-1].numEnd = parseInt(val) -1, item.numStart = val)"></v-input-number>
                          </v-form-item>
                        </v-col>
                        <v-col span="2" style="text-align:center">~</v-col>
                        <v-col span="11">
                          <v-form-item style="width:100%" required :prop="'priceArr.' + index + '.numEnd'" :rules="numRuleEnd(priceModel.priceArr, index)">
                            <v-input-number size="large" style="width:100%" :value.number="item.numEnd || ''" @input="val => (!priceModel.priceArr[index+1] ? '': priceModel.priceArr[index+1].numStart = parseInt(val) +1, item.numEnd = val)" :min="1"></v-input-number>
                          </v-form-item>
                        </v-col>
                      </v-row>
                    </v-form-item>
                  </v-col>
                  <v-col span="8">
                    <v-form-item :label-col="labelCol1" :wrapper-col="wrapperCol1" label="单价" required :prop="'priceArr.' + index + '.supplierPrice'" :rules="numFloat">
                      <price-toggle @reset="reset" v-if="priceUnits.length" :data="priceUnits" v-model.number="item.supplierPrice" :unit.sync="item.supplierPriceUnit"></price-toggle>
                    </v-form-item>
                  </v-col>
                  <v-col span="8">
                    <v-form-item :label-col="labelCol1" :wrapper-col="wrapperCol1" label="采购运费" required :prop="'priceArr.' + index + '.purchaseFreight'" :rules="numFloat">
                      <price-toggle @reset="reset" v-if="priceUnits.length" :data="priceUnits" v-model.number="item.purchaseFreight" :unit.sync="item.purchaseFreightUnit"></price-toggle>
                    </v-form-item>
                  </v-col>
                </v-row>
                <v-row class="__row">
                  <v-col span="8">
                    <v-form-item :label-col="labelCol1" :wrapper-col="wrapperCol1" label="加工费用" required :prop="'priceArr.' + index + '.processPrice'" :rules="numFloat">
                      <price-toggle @reset="reset" v-if="priceUnits.length" :data="priceUnits" v-model.number="item.processPrice" :unit.sync="item.processPriceUnit"></price-toggle>
                    </v-form-item>
                  </v-col>
                  <v-col span="8">
                    <v-form-item :label-col="labelCol1" :wrapper-col="wrapperCol1" label="其它费用" required :prop="'priceArr.' + index + '.otherPrice'" :rules="numFloat">
                      <price-toggle @reset="reset" v-if="priceUnits.length" :data="priceUnits" v-model.number="item.otherPrice" :unit.sync="item.otherPriceUnit"></price-toggle>
                    </v-form-item>
                  </v-col>

                </v-row>
                <div class="__add" @click="handlerAddItem(index)">
                  <v-icon type="plus"></v-icon>
                </div>
                <div class="__add __minus" v-if="index !== 0" @click="handlerDelItem(index)">
                  <v-icon type="minus"></v-icon>
                </div>
              </div>

            </v-form-item>
          </v-form>
        </v-col>

        <v-col span="8">
          <v-form-item :label-col="{span:12}" :wrapper-col="{span:12}" label="生产天数" required prop="produceTime">
            <v-input-number @change="val => ruleForm.produceTime  = val || ''" :min="1" :value.number="ruleForm.produceTime || ''" size="large" style="width:100%"></v-input-number>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="{span:12}" :wrapper-col="{span:12}" label="运输天数" required prop="freightTime">
            <v-input-number @change="val => ruleForm.freightTime  = val || ''" :min="1" :value.number="ruleForm.freightTime || ''" size="large" style="width:100%"></v-input-number>
          </v-form-item>
        </v-col>
        <v-col span="6">
          <v-form-item :label-col="{span:12}" :wrapper-col="{span:12}" label="入库天数" required prop="storageTime">
            <v-input-number @change="val => ruleForm.storageTime  = val || ''" :min="1" :value.number="ruleForm.storageTime || ''" size="large" style="width:100%"></v-input-number>
          </v-form-item>
        </v-col>

        <v-col span="8">
          <v-form-item :label-col="{span:12}" :wrapper-col="{span:12}" label="采购天数" required prop="purchaseTime">
            <v-input-number @change="handlerChange" :min="+purchaseTime1" :value.number="purchaseTime1" size="large" style="width:100%"></v-input-number>
          </v-form-item>
        </v-col>
        <v-col span="8">
          <v-form-item :label-col="{span:12}" :wrapper-col="{span:12}" label="是否提供备品">
            <v-switch v-model="ruleForm.sampleFlag" :true-value="1" :false-value="0"></v-switch>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
            <v-input type="textarea" v-model="ruleForm.remark" :autosize="{minRows: 4}"></v-input>
          </v-form-item>
        </v-col>

      </v-row>
    </v-form>
  </v-spin>
</template>

<script>
import { fetchData, handlerCode, showToast } from "common/common";
import apis from "apis";
import PriceToggle from "./productPrice/PriceToggle";
import SyncCascader from "components/base/SyncCascader";

const checkStart = function(arr, index) {
  return (rule, value, callback) => {
    if (value == 0 && index !== 0) {
      callback(new Error("不能为0"));
    }
    if (value === "") {
      callback(new Error("不能为空"));
    }
    if (parseInt(value) != value) {
      callback(new Error("请输入数字"));
    }
    if (!Number.isSafeInteger(value)) {
      callback(new Error("请输入数字"));
    }

    if (value < 0) {
      callback(new Error("请输入正整数"));
    }

    if (arr[index - 1] && value < arr[index - 1].numStart) {
      callback(new Error(`不能小于${arr[index - 1].numStart}`));
    }

    if (arr[index].numEnd && value > arr[index].numEnd) {
      callback(new Error(`不能大于${arr[index].numEnd}`));
    }
    callback();
  };
};
const checkEnd = function(arr, index) {
  return (rule, value, callback) => {
    if (value == 0) {
      callback(new Error("不能为0"));
    }
    if (value === "") {
      callback(new Error("不能为空"));
    }
    if (parseInt(value) != value) {
      // debugger
      callback(new Error("请输入正整数"));
    }
    if (!Number.isSafeInteger(value)) {
      callback(new Error("请输入数字"));
    }

    if (value < 0) {
      callback(new Error("请输入正整数"));
    }

    if (
      arr[index + 1] &&
      arr[index + 1].numEnd != null &&
      value > arr[index + 1].numEnd
    ) {
      callback(new Error(`不能大于${arr[index + 1].numEnd}`));
    }

    if (value < arr[index].numStart) {
      callback(new Error(`不能小于${arr[index].numStart}`));
    }
    callback();
  };
};

const checkFloat = (rule, value, callback) => {
  if (!(Number.isFinite(value) && value > 0)) {
    callback(new Error("请输入正确的数字"));
  }
  callback();
};

const checkZero = (rule, value, callback) => {
  if (value <= 0) {
    callback(new Error("请输入合理的天数"));
  }
  if (!Number.isFinite(+value)) {
    callback(new Error("请输入数字"));
  }
  callback();
};

export default {
  components: {
    PriceToggle,
    SyncCascader
  },
  created() {
    if (this.$attrs.id) {
      this.getEditData();
    }
    this.getSupplier();
  },

  data() {
    let vm = this;
    const checkPurchaseTime = (rule, value, callback) => {
      let total =
        vm.ruleForm.produceTime +
        vm.ruleForm.freightTime +
        vm.ruleForm.storageTime;
      if (value < total) {
        callback(
          new Error("采购天数必须大于生产天数、运输天数、入库天数的总和")
        );
      }
      if (!Number.isFinite(+value)) {
        callback(new Error("请输入数字"));
      }
      callback();
    };
    return {
      spinning: false,
      purchaseTimeInput: false,
      city: "/address/city/list/",
      prop: {
        label: "provinceName",
        value: "provinceId",
        children: "childs",
        enabled: "provinceName"
      },
      lists(id, city) {
        if (city) {
          return fetchData({
            method: "get",
            url: city + id
          }).then(res => {
            if (res.data.code !== 0) {
              showToast("error", res.data.msg);
              return;
            }
            if (res.data.rows) {
              return res.data.rows.map(el => {
                return {
                  ...el,
                  provinceName: el.cityName,
                  provinceId: el.cityId
                };
              });
            }
          });
        }
        return fetchData({
          ...apis.ADDRESS_PROVINCE_LIST
        }).then(res => {
          if (res.data.code !== 0) {
            showToast("error", res.data.msg);
            return;
          }
          if (res.data.rows) {
            return res.data.rows.map(el => {
              return {
                ...el,
                childs: []
              };
            });
          }
        });
      },
      options: [
        {
          value: 1,
          label: "广东",
          children: [
            {
              value: 1,
              label: "深圳",
              children: [
                {
                  value: 1,
                  label: "宝安区"
                },
                {
                  value: 1,
                  label: "南山区"
                }
              ]
            },
            {
              value: 1,
              label: "广州",
              children: [
                {
                  value: 1,
                  label: "白云区"
                }
              ]
            }
          ]
        }
      ],

      priceDemo: "",

      priceModel: {
        priceArr: [
          {
            numStart: 1,
            numEnd: null,
            supplierPrice: null,
            supplierPriceUnit: null,
            purchaseFreight: null,
            purchaseFreightUnit: null,
            processPrice: null,
            processPriceUnit: null,
            otherPrice: null,
            otherPriceUnit: null
          }
        ]
      },

      suppliers: [],
      ruleForm: {
        produceTime: "",
        freightTime: "",
        purchaseTime: "",
        storageTime: "",
        supplierAddressId: []
      },
      numRuleStart(arr, index) {
        return [
          // { type: "integer", message: "必须为正整数" },
          { validator: checkStart(arr, index) }
        ];
      },
      numRuleEnd(arr, index) {
        return [
          // { type: "integer", message: "必须为正整数" },
          { validator: checkEnd(arr, index) }
        ];
      },
      // numRuleEnd: [
      //   {
      //     required: true,
      //     message: "不能为空"
      //   },
      //   {
      //     validator: checkEnd
      //   }
      // ],
      numFloat: [
        {
          required: true,
          message: "不能为空"
        },
        {
          validator: checkFloat
        }
      ],
      rules: {
        supplierId: [
          {
            required: true,
            message: "不能为空"
          }
        ],
        purchasePrice: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "number",
            message: "必须为数字"
          }
        ],
        produceTime: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "integer",
            message: "必须为整数"
          }
        ],
        purchaseTime: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "integer",
            message: "必须为整数"
          },
          {
            validator: checkPurchaseTime
          }
        ],
        storageTime: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "integer",
            message: "必须为整数"
          },
          {
            validator: checkZero
          }
        ],
        supplierPriceTime: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "integer",
            message: "必须为整数"
          },
          {
            validator: checkZero
          }
        ],
        freightTime: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "integer",
            message: "必须为整数"
          },
          {
            validator: checkZero
          }
        ],
        supplierPrice: [
          {
            required: true,
            message: "不能为空"
          },
          {
            type: "number",
            message: "必须为数字"
          }
        ],
        supplierAddressId: [
          {
            required: true,
            message: "不能为空"
          }
        ]
      },
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 18
      },
      labelCol1: {
        span: 7
      },
      wrapperCol1: {
        span: 17
      }
    };
  },
  methods: {
    reset() {
      let vm = this;
      console.log("object");
      setTimeout(() => {
        vm.$refs.priceForm.resetFields();
      });
    },
    handlerChange(val) {
      if (val < this.total) {
        this.purchaseTimeInput = false;
        this.$nextTick(() => {
          this.purchaseTime1 = +this.total;
          this.ruleForm.purchaseTime = this.total;
        });
      } else {
        this.ruleForm.purchaseTime = val;
      }
    },
    handlerAddItem(index) {
      this.priceModel.priceArr.splice(index + 1, 0, {
        numStart: this.priceModel.priceArr[index].numEnd + 1,
        numEnd: null,
        supplierPrice: null,
        supplierPriceUnit: null,
        purchaseFreight: null,
        purchaseFreightUnit: null,
        processPrice: null,
        processPriceUnit: null,
        otherPrice: null,
        otherPriceUnit: null
      });
    },
    handlerDelItem(index) {
      let arr = this.priceModel.priceArr;
      if (arr[index - 1] && arr[index + 1]) {
        arr[index - 1].numEnd = arr[index].numEnd;
      }
      arr.splice(index, 1);
      // debugger;
    },
    getSupplier() {
      fetchData({ ...apis.SUPPLIER_LIST_ALL }).then(res => {
        // handlerCode(res);
        this.suppliers = res.data.rows;
      });
    },
    getEditData() {
      this.spinning = true;
      fetchData({
        ...apis.PRODUCT_SUPPLIER_REL_INFO,
        data: { productSupplierRelId: this.$attrs.id }
      }).then(res => {
        this.spinning = false;
        console.log(res);
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        const {
          productSupplierRelEntity,
          productSupplierPriceEntityList
        } = res.data.rows;
        let supplierAddressId = [];
        if (productSupplierRelEntity.cityId != null) {
          supplierAddressId = [
            productSupplierRelEntity.provinceId,
            productSupplierRelEntity.cityId
          ];
        }
        this.ruleForm = {
          ...this.ruleForm,
          ...productSupplierRelEntity,
          supplierAddressId
        };
        this.priceModel.priceArr = productSupplierPriceEntityList;
      });
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    ok() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs.priceForm.validate(vali => {
            if (vali) {
              this.$listeners.set(this);
            } else {
              showToast("error", "请填写完整正确的信息");
            }
          });
        } else {
          this.$refs.priceForm.validate();
          showToast("error", "请填写完整正确的信息");
        }
      });
    }
  },
  computed: {
    // 价格单位选项
    priceUnits() {
      return this.$attrs.options;
    },
    total() {
      return (
        this.ruleForm.produceTime +
        this.ruleForm.freightTime +
        this.ruleForm.storageTime
      );
    },
    purchaseTime1: {
      get() {
        this.$nextTick(() => {
          if (
            this.ruleForm.produceTime == "" ||
            this.ruleForm.freightTime == "" ||
            this.ruleForm.storageTime == ""
          ) {
            return;
          }
          this.$refs.ruleForm.validateField("purchaseTime");
        });

        let total =
          this.ruleForm.produceTime +
          this.ruleForm.freightTime +
          this.ruleForm.storageTime;
        if (
          this.ruleForm.produceTime != 0 &&
          this.ruleForm.freightTime != 0 &&
          this.ruleForm.storageTime != 0
        ) {
          if (this.purchaseTimeInput) {
            if (
              this.ruleForm.produceTime +
                this.ruleForm.freightTime +
                this.ruleForm.storageTime >=
              this.ruleForm.purchaseTime
            ) {
              return (this.ruleForm.purchaseTime =
                this.ruleForm.produceTime +
                this.ruleForm.freightTime +
                this.ruleForm.storageTime);
            } else {
              return this.ruleForm.purchaseTime;
            }
          } else {
            if (this.ruleForm.purchaseTime > total) {
              return this.ruleForm.purchaseTime;
            } else {
              return (this.ruleForm.purchaseTime =
                this.ruleForm.produceTime +
                this.ruleForm.freightTime +
                this.ruleForm.storageTime);
            }
          }
        } else {
          return "";
        }
      },
      set(val) {
        this.ruleForm.purchaseTime = val;
      }
    }
  },
  watch: {
    purchaseTime1(val) {
      this.$refs.ruleForm.validateField("purchaseTime");
    }
  }
};
</script>

<style lang="scss" scoped>
.clearBoth {
  position: relative;
  margin-bottom: 16px;
  .__row {
    overflow: auto;
    height: 60px;
  }
  .ant-form-item-control {
    margin-bottom: 20px;
  }
  .ant-row:after {
    clear: none;
  }
  .__add {
    width: 33px;
    height: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #eee;
    position: absolute;
    right: -45px;
    top: 0;
    cursor: pointer;
  }
  .__minus {
    right: -82px;
  }
}
</style>

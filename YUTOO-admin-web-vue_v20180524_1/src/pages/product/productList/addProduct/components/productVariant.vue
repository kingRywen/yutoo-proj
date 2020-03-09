<template>
  <div class="productVariant_wrapper">
    {{firstInputVals}}
    <v-form :model="customForm" :rules="customRules" ref="customRuleForm">
      <v-row>
        <v-form-item label="产品类目" prop="ablum">
          <v-input placeholder="" v-model="customForm.ablum" style="width:400px" :disabled="true"></v-input>
        </v-form-item>
        <v-form-item>
          <v-button type="primary" @click="selectColumns" v-if="!$attrs.show">选择类目</v-button>
        </v-form-item>
      </v-row>
    </v-form>
    <v-row v-if="showBianSetting">
      <v-card title="变体设置" @mouseleave.native="changeShow" @mouseenter.native="changeShow" style="margin-top: 20px">
        <div v-if="!createB">

          <!-- 设置自定义属性 -->
          <div v-for="(item, index) in items" :key="index">
            <v-row :gutter="16">
              <v-col v-if="!item.new" span="2">
                <h3 style="line-height:2.8;font-size:14px">{{item.propertyName}}:</h3>
              </v-col>
              <v-col v-else span="2">
                <v-input v-model="item.propertyName" placeholder="输入属性名称" style="width:100%"></v-input>
              </v-col>
              <v-col span="3" v-if="item.childs.length" v-for="i in item.childs" :key="i.globalColorId">
                <v-input :value="i.nameCn"></v-input>
              </v-col>
              <v-col span="3" v-for="(i, order) in item.inputs" :key="order">
                <dyniInput placeholder="自定义" :type="item.inputType" :value="i" @blur="customInput(item, order, $event)" @colorselect="onColorSelect(item, $event, order)" :item="item"></dyniInput>
              </v-col>
              <v-col span="3">
                <!-- {{'first'}} -->
                <dyniInput placeholder="自定义" :type="item.inputType" v-model="firstInputVals[index]" ref="firstInput" @colorselect="onColorSelect(item, $event)" @blur="customInputOne(item, index, $event)" :item="item"></dyniInput>
              </v-col>
              <v-col span="3" v-if="item.new">
                <v-button @click="delItem(item, index)" type="error" v-if="item.inputType == 1" style="width:100%">删除</v-button>
              </v-col>

            </v-row>

          </div>
        </div>

        <!-- 生成变体 -->
        <div v-else>
          <!-- {{tableData}} <br> {{columnsFor}} -->
          <v-data-table stripe :tree-option='treeOption' ref="table" :data='list1' :columns='columnsFor' class="margin-top-25" :current-data.sync='tableData'>
            <template slot="th" slot-scope="props">
              <strong v-html="props.title"></strong>
            </template>
            <template slot="td" slot-scope="props">
              <div v-if="props.column.field=='sku'">
                {{props.item.sku}}
              </div>
              <div v-if="props.column.field=='edit'">
                <v-button type="error" @click="removeItem(props.index)">移除</v-button>
                <v-button type="primary" v-if="!props.item.sku" @click="createVariant(props)">生成</v-button>
              </div>
              <div v-else>
                <v-input v-if="props.column.field != 'sku' && props.column.field != 'edit'" v-model="tableData[props.index][props.column.field]"></v-input>
              </div>

            </template>
          </v-data-table>
        </div>
        <div slot="extra" v-if="!createB">
          <v-button type=" success " v-if="!$attrs.show" @click="creatBian">批量生成变体</v-button>
          <v-button type="success " v-if="!$attrs.show" @click="addProps">新增自定义属性</v-button>
        </div>
        <div slot="extra" v-else>
          <v-switch v-model="variant" :true-value="1" :false-value="0"></v-switch>
          <span style="margin-right:20px">规格加入产品参数</span>
          <v-button type="success" v-if="!$attrs.show" @click="addItem">增加变体</v-button>
        </div>
      </v-card>

    </v-row>
  </div>
</template>

<script>
import Vue from "vue";
import {
  showDialog,
  getVue,
  fetchData,
  fixFrameHeight,
  showToast
} from "common/common";
import {
  getQueryString,
  doExchange,
  isNumber,
  isEmptyObject
} from "common/util";
import dyniInput from "components/base/dyniInput.vue";
import {
  YT_PRODUCT_COLUMNS,
  YT_SEARCH,
  COLOR_PICKER
} from "../../../componentName";
import apis from "apis";

export default {
  inheritAttrs: false,
  components: {
    dyniInput
  },
  mounted() {
    let { edit, show, allData, catelogy } = this.$attrs;

    // 展示模式
    if (show) {
      console.log("show");
    }
  },
  data() {
    let vm = this;
    let isedit = true;
    return {
      // 生成的变体列表，如果是编辑进入 ，则是获取到的变体数据
      list1: data => {
        // 编辑
        if (this.$attrs.edit && isedit) {
          // this.bianLists = this
          return this.getBase(+this.$attrs.productId).then(res => {
            console.log(res);
            isedit = false;
            if (res.data && res.data.code == 0) {
              delete res.data.code;
              this.variant = res.data.variantFlag;
              this.$emit("update:flag", this.variant);
              this.$emit("update:data", res.data);
              let productVariantList = res.data.productVariantList;

              let tableData = [];

              productVariantList.forEach((el, i) => {
                // 设置表格数据
                let tr = {};

                let list = el.variantPropertyList;
                let variant = el.variant;

                list.forEach((lis, lisIndex) => {
                  tr[lisIndex] = lis.propertyValue;
                });
                tr.sku = variant.sku;
                tr.skuCustom = variant.skuCustom;
                tr.productId = variant.productId;

                tableData.push(tr);
              });

              // 设置列信息
              productVariantList[0].variantPropertyList.forEach((el, i) => {
                let isOrigin = el.propertyOriginal == 1;
                this.columnsFor.unshift({
                  title: el.propertyName,
                  field: i
                });
                this.items.push({
                  new: isOrigin ? false : true,
                  inputType: isOrigin ? el.inputType : 1,
                  propertyName: el.propertyName,
                  childs: [],
                  inputs: []
                });
              });

              console.log(tableData);
              return Promise.resolve({
                result: tableData
              });
            }
          });
        } else {
          // 新增
          console.log(vm.bianLists);
          let res = [];
          let skus = [];

          // 获取系统SKU
          return fetchData({
            ...apis._PRODUCT_SKU_GET,
            data: {
              num: vm.bianLists.length
            }
          }).then(res1 => {
            skus = res1.data.skuList;
            for (let i = 0; i < vm.bianLists.length; i++) {
              const el = vm.bianLists[i];

              let ret = {};
              ret.sku = skus[i];
              ret.skuCustom = "";
              this.items.forEach((e, i) => {
                ret[i] = el[i];
              });
              res.push(ret);
            }
            console.log(res);

            return Promise.resolve({
              result: res
            });
          });
        }
      },
      isShow: false,
      variant: 0, // 是否加入规格参数
      createB: false,
      firstInputVals: [],
      showBianSetting: false,
      // variantTab: [], // 编辑时获取到的variantTab数据
      index: 0,
      lists: [],
      bianLists: [],
      inputs: [],
      items: [],
      showExtra: true,
      tableData: [],
      columns: [
        {
          title: "系统SKU",
          field: "sku"
        },
        {
          title: "自定义SKU",
          field: "skuCustom"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      columnsFor: [], // 变体列表对应项
      customForm: {
        ablum: ""
      },
      treeOption: {
        isAsync: true,
        idKey: "productId",
        loadChildren: function(pramas) {
          return fetchData({ url: GET_PRODUCT_ALL_LIST, params }).then(res => {
            console.log(res);
            return res.data;
          });
        }
      },
      customRules: {
        ablum: [{ required: true, message: "请选择产品类目" }]
      }
    };
  },
  methods: {
    // 根据选择类目获取变体属性
    getProperties(opts) {
      console.log(opts);
      if (isEmptyObject(opts)) {
        return;
      }
      fetchData({
        ...apis.variant_property,
        data: opts
      }).then(res => {
        if (res.data && res.data.map) {
          res.data.map(el => {
            // 变体属性初始化
            el.childs = [];
            el.inputs = [];
            el.variantPropFlag = 1;
            el.propertyOriginal = 1;
          });
          this.showBianSetting = true;
          this.items = res.data;
          this.index = res.data.length - 1;
        }
      });
    },

    // 获取产品变体页面数据
    getBase(id) {
      return fetchData({
        ...apis.PRODUCT_PARENT_BASE_VARIANT_TAB,
        data: { productId: id }
      });
    },

    // 创建变体
    creatBian() {
      let arrs = [];
      let flag = true;

      if (!this.items.length) {
        flag = false;
        showToast("error", "请新增一个自定义属性");
      }

      this.items.forEach(el => {
        if (el.childs.length == 0 && el.inputs.length == 0) {
          showToast("error", "请输入有效的值");
          flag = false;
        }
        arrs.push([...el.childs.map(el => el.nameCn), ...el.inputs]);
      });
      console.log(arrs);
      this.bianLists = doExchange(arrs);
      setTimeout(() => {
        fixFrameHeight(1);
      });
      if (flag) {
        this.createB = true;
      }
    },

    selectItem(item, index) {
      let { childs, prop } = item;
      let url = apis.variant_property;
      console.log(index);
      let vm = this;
      showDialog(
        COLOR_PICKER,
        { title: "选择" + prop },
        {
          select: childs,
          url: {
            ...url,
            data: {
              categoryId: 2,
              sourceType: "Merchant"
            }
          }
        },
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
    },
    delItem(item, index) {
      let { childs, prop } = item;
      this.items.splice(index, 1);
      setTimeout(() => {
        fixFrameHeight(1);
      });
    },

    // 选择类目
    selectColumns() {
      let hasCate = !!Object.keys(this.catelogy).length,
        selected;
      if (hasCate) {
        selected = this.catelogy.ars;
      }
      let vm = this;
      showDialog(
        YT_PRODUCT_COLUMNS,
        { title: "请选择产品类目", width: 960 },
        { selected },
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr, ars, name) {
            console.log(arr);
            if (arr.length <= 0) {
              getVue().$message.error("请选择一个类目");
              return true;
            }
            vm.showBianSetting = true;

            // 获取类目变体属性
            vm.getProperties({
              categoryId: arr.categoryId,
              sourceType: arr.sourceType
            });

            // 把获取的类目信息修改到根组件，用来提交到服务器
            vm.$emit("update:cate", {
              ...arr,
              ars,
              categoryDetail: name.join(";")
            });
            vm.customForm.ablum = name.join(" > ");
            // 每次选择类目时重置生成 的变体列表
            vm.createB = false;
            vm.tableData = [];
          }
        }
      );
    },
    customInput(item, i, e) {
      console.log(item, i, e);
      if ((!!e && e != "") || e === 0) {
        if (i < item.inputs.length) {
          item.inputs.splice(i, 1, e);
        } else {
          item.inputs.push(e);
        }
      } else {
        item.inputs.splice(i, 1);
      }
    },
    customInputOne(item, i, e) {
      console.log(item, i, e);
      let val = e;
      if ((!!val && val != "") || val === 0) {
        item.inputs.push(e);
        // 重置最后 的输入框的值
        this.$nextTick(() => {
          this.firstInputVals = [];
          // if (item.inputType === 1) {
          //   this.$refs.firstInput[i].value = "";
          // }
        });
      }
    },

    // 颜色选择确认事件
    onColorSelect(item, $event, order) {
      console.log(item, order, $event);
      item.childs = $event;
    },

    changeShow() {
      this.isShow = !this.isShow;
    },
    setTableItem(props, e) {
      this.tableData[props.index][props.column.field] = e;
    },
    addProps() {
      this.items.push({
        new: true,
        inputType: 1,
        propertyName: "",
        val: "",
        childs: [],
        inputs: []
      });
      setTimeout(() => {
        fixFrameHeight(1);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    removeItem(index) {
      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1);
      } else {
        this.tableData.splice(0);
        this.createB = false;
      }
    },
    addItem() {
      this.tableData.push({});
      setTimeout(() => {
        fixFrameHeight(1);
      });
    },
    inputItem(props, val) {
      console.log(val);
      Vue.set(
        this.tableData,
        props.index,
        Object.assign({}, this.tableData[props.index], {
          [props.column.field]: val
        })
      );
    },
    createVariant(item) {
      console.log(this.columnsFor.length);
      if (Object.keys(item.item).length < this.columnsFor.length - 2) {
        showToast("error", "请填写字段");
        return;
      }
      console.log("object", item);
      fetchData({
        ...apis._PRODUCT_SKU_GET,
        data: {
          num: 1
        }
      }).then(res => {
        let skus = res.data.skuList;
        Vue.set(this.tableData, item.index, {
          ...this.tableData[item.index],
          sku: skus[0]
        });
      });
    }
  },
  watch: {
    items: {
      deep: true,
      handler: function(val) {
        let ret = [];
        val.forEach((el, i) => {
          let item = {
            title: el.propertyName,
            field: i
          };
          ret.push(item);
        });
        ret.push(...this.columns);
        this.columnsFor = ret;
      }
    },

    // 监控表格数据变动
    tableData: {
      deep: true,
      immediate: true,
      handler: function(val) {
        console.log(22222);
        let ress = {};
        let first = this.$attrs.edit;

        // 设置变体字段

        ress.productVariantList = [];
        val.forEach((el, index) => {
          let cur = {};
          if (first) {
            first = false;
            cur.variant = Object.assign({}, this.variantNum[index].variant, {
              sku: el.sku,
              skuCustom: el.skuCustom
            });
          } else {
            cur.variant = {
              sku: el.sku,
              skuCustom: el.skuCustom
            };
          }

          cur.variantPropertyList = [];

          this.columnsFor.forEach((col, colIndex) => {
            if (isNumber(col.field)) {
              if (this.$attrs.edit) {
                // 如果是编辑页面
                console.log(this.variantTab);
                if (el[col.field + ""]) {
                  cur.variantPropertyList.push(
                    Object.assign(
                      {},
                      this.variantTab.productVariantList[index]
                        .variantPropertyList[colIndex],
                      {
                        propertyName: col.title,
                        propertyValue: el[col.field + ""]
                      }
                    )
                  );
                }
              } else {
                cur.variantPropertyList.push({
                  productPropertyId: null,
                  categoryPropertyId: 1,
                  productId: null,
                  propertyName: col.title,
                  propertyValue: el[col.field + ""],
                  propertyOriginal: 1,
                  variantPropFlag: 1
                });
              }
            }
          });
          ress.productVariantList.push(cur);
        });
        console.log(ress);
        ress.variantFlag = this.items.checked ? 1 : 0;
        this.$emit("update:data", ress);
      }
    },
    variant(val) {
      let variantFlag = val ? 1 : 0;
      console.log(variantFlag);
      this.$emit("update:flag", variantFlag);
    },

    catelogy(val) {
      // 编辑模式 初始化数据
      // 变体数据
      if (this.$attrs.edit) {
        this.createB = true;
        // 获取类目变体属性
        this.getProperties({
          categoryId: val.categoryId,
          sourceType: val.sourceType
        });
        this.customForm.ablum = val.nameCn;
      }
    }
  },
  computed: {
    variantNum() {
      let ret;
      try {
        ret = this.$attrs.allData.variantTab.productVariantList;
      } catch (e) {
        ret = [];
      }
      return ret;
    },

    // 获取主页要提交 的varianttab数据
    variantTab() {
      return this.$attrs.allData.variantTab;
    },
    catelogy() {
      return this.$attrs.catelogy;
    }
  }
};
</script>

<style lang="less">
.productVariant_wrapper {
  .ant-card-head {
    height: 42px;
    line-height: 42px;
    background: #f2f2f2;
  }
}
</style>

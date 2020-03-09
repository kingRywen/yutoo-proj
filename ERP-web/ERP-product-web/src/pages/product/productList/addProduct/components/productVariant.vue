<template>
  <div class="productVariant_wrapper" ref="content">
    <v-form :model="customForm" :rules="customRules" ref="customRuleForm">
      <v-row>
        <v-form-item label="产品类目" prop="ablum">
          <v-input placeholder v-model="customForm.ablum" style="width:400px" :disabled="true"></v-input>
        </v-form-item>
        <v-form-item>
          <v-button :disabled="show || createB" type="primary" @click="selectColumns" v-if="!$attrs.show">选择类目</v-button>
          <v-button :disabled="show" type="primary" @click="addColumns" v-if="!$attrs.show">添加</v-button>
        </v-form-item>
      </v-row>
    </v-form>
    <v-row v-if="showBianSetting">
      <v-card title="变体设置" style="margin-top: 20px" noHovering>
        <!-- 属性填写 -->
        <div v-if="!createB">
          <!-- 设置自定义属性 -->
          <v-form ref="form">
            <div v-for="(item, index) in items" :key="index">
              <v-row :gutter="10" class="margin-bottom-10">
                <v-col v-if="!item.new" span="2">
                  <h3 style="line-height:38px;font-size:14px;text-align: right;margin-right:10px">{{item.propertyName}}:</h3>
                </v-col>
                <v-col v-else span="2">
                  <v-form-item style="margin-right:0;width:100%">
                    <v-input :disabled="show" v-model="item.propertyName" placeholder="输入属性名称" style="width:100%"></v-input>
                  </v-form-item>
                </v-col>
                <v-col span="22">
                  <v-row :gutter="10">
                    <v-col
                      span="3"
                      v-if="item.childs.length"
                      v-for="(i, cIndex) in item.childs"
                      :key="i.globalColorId"
                      class="_col"
                    >
                      <v-form-item style="margin-right:0;width:100%" class="delete_icon_wrapper">
                        <v-input style="width:100%" :disabled="true" :value="i.nameCn"></v-input>
                        <span class="del" @click="deleteInput(i, item, cIndex)">
                          <v-icon type="minus-circle"></v-icon>
                        </span>
                      </v-form-item>
                    </v-col>
                    <v-col span="3" v-for="(i, order) in item.inputs" :key="order">
                      <!-- {{disabledList}} -->
                      <dyniInput
                        style="width:100%"
                        :disabled="show"
                        placeholder="自定义"
                        :type="item.inputType"
                        :value="i"
                        @input="customInput(item, order, $event)"
                        @change="customInput(item, order, $event)"
                        @colorselect="onColorSelect(item, $event, order)"
                        :item="item"
                        :opts.sync="disabledList[index]"
                        :index="index"
                        :key="order"
                      ></dyniInput>
                    </v-col>
                    <v-col span="3">
                      <!-- {{item.inputs}} -->
                      <dyniInput
                        style="width:100%"
                        :disabled="show"
                        placeholder="自定义"
                        :type="item.inputType"
                        v-model="firstInputVals[index]"
                        ref="firstInput"
                        @colorselect="onColorSelect(item, $event)"
                        @blur="customInputOne(item, index, $event)"
                        :item="item"
                        :info="{categoryId: catelogy.categoryId}"
                      ></dyniInput>
                    </v-col>
                    <v-col span="3" v-if="item.new">
                      <!-- <v-button :disabled="show" @click="delItem(item, index)" type="error" v-if="item.inputType == 1" style="width:100%">删除</v-button> -->
                      <v-button
                        type="dashed"
                        shape="circle-outline"
                        icon="minus"
                        :disabled="show"
                        @click="delItem(item, index)"
                        v-if="item.inputType == 1"
                      ></v-button>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </div>

        <!-- 生成变体 -->
        <div v-else>
          <!-- {{tableFormData}} -->
          <v-form :model="tableFormData" ref="tableForm" v-if="items[0] && items[0].categoryPropertyId != null">
            <v-data-table
              stripe
              :tree-option="treeOption"
              ref="table"
              :data="list1"
              :columns="columnsFor"
              class="margin-top-25"
              :current-data.sync="tableData"
            >
              <template slot="th" slot-scope="props">
                <strong v-html="props.title"></strong>
              </template>
              <template slot="td" slot-scope="props">
                <div v-if="props.column.field=='sku'">{{props.item.sku}}</div>
                <div v-else-if="props.column.field=='edit'">
                  <v-button :disabled="show" type="error" @click="removeItem(props.index)">移除</v-button>
                  <v-button :disabled="show" type="primary" v-if="!props.item.sku" @click="createVariant(props)">生成</v-button>
                </div>
                <div v-else>
                  <!-- {{`${props.column.field}.${props.index}.value`}} -->
                  <v-form-item
                    class="inputForm"
                    v-if="(props.column.field != 'sku' && props.column.field != 'edit' && tableFormData[props.column.field] && tableFormData[props.column.field][props.index] && tableFormData[props.column.field][props.index].value != null) || props.item._new"
                    style="margin: 16px 0;width:100%"
                    :prop="`${props.column.field}.${props.index}.value`"
                    :rules="props.column.field === 'skuCustom' ? variantRules : [{required: true, message: '不能为空',trigger: 'blur,change'}]"
                  >
                    <v-input
                      class="noBtn"
                      style="width:100%"
                      :disabled="show || props.column.field != 'skuCustom'"
                      v-model="props.content"
                      :placeholder="props.column.field === 'sku' ? '自动生成' :null"
                      @input="onColorSelect1(props, $event)"
                    >
                      <span
                        class="__select"
                        v-if="props.column.field != 'skuCustom' && props.column.field != 'sku' && !show"
                        slot="after"
                      >
                        <dyniInput
                          style="width:100%"
                          :disabled="show"
                          placeholder="自定义"
                          :type="2"
                          @colorselect="onColorSelect1(props, $event)"
                          :item="{propertyName: props.column.title, radio: true, childs: tableData[props.index][props.column.field], propertyId: getPropertyId(props)}"
                          icon="edit"
                          :info="{categoryId: catelogy.categoryId}"
                        ></dyniInput>
                      </span>
                    </v-input>
                  </v-form-item>
                </div>
              </template>
            </v-data-table>
          </v-form>
        </div>
        <div slot="extra" v-if="!createB" class="content">
          <div>
            <v-button :disabled="show" type="primary" v-if="!$attrs.show" @click="creatBian">批量生成变体</v-button>
            <v-button :disabled="show" type="primary" v-if="!$attrs.show" @click="addProps">新增自定义属性</v-button>
          </div>
          <div>
            <v-form :model="parent" ref="skuForm">
              <v-form-item label="母体SKU">
                <v-input disabled placeholder="请输入" v-model="parent.sku"></v-input>
              </v-form-item>
              <v-form-item label="母体自定义SKU" prop="skuCustom" :rules="parentSkuCheck">
                <v-input placeholder="请输入" v-model="parent.skuCustom" :disabled="show"></v-input>
              </v-form-item>
            </v-form>
          </div>
        </div>
        <div slot="extra" v-else class="content">
          <div>
            <v-switch :disabled="show" v-model="variant" :true-value="1" :false-value="0"></v-switch>
            <span style="margin-right:20px">规格加入产品参数</span>
            <v-button :disabled="show" type="success" v-if="!$attrs.show" @click="addItem">增加变体</v-button>
          </div>

          <div>
            <v-form :model="parent" ref="skuForm">
              <v-form-item label="母体SKU">
                <v-input disabled placeholder="请输入" v-model="parent.sku"></v-input>
              </v-form-item>
              <v-form-item label="母体自定义SKU" prop="skuCustom" :rules="parentSkuCheck">
                <v-input placeholder="请输入" v-model="parent.skuCustom" :disabled="show"></v-input>
              </v-form-item>
            </v-form>
          </div>
        </div>
      </v-card>
    </v-row>

    <div class="saveBtn" v-if="!$attrs.show">
      <div style="margin: 0 auto">
        <v-button
          type="primary"
          :disabled="show"
          v-if="!$attrs.show"
          :loading="saveBtnLoading"
          @click.prevent="save"
        >{{saveBtnLoading ? '正在' : null}}保存</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import bus from 'common/bus'
import {
  showDialog,
  getVue,
  fetchData,
  fixFrameHeight,
  showToast,
  showConfirm,
  toParamUrl,
  _storage
} from 'common/common'
import {
  getQueryString,
  doExchange,
  isArray,
  doExchange1,
  isNumber,
  isEmptyObject
} from 'common/util'
import dyniInput from 'components/base/dyniInput.vue'
import {
  YT_PRODUCT_COLUMNS,
  YT_SEARCH,
  COLOR_PICKER
} from '../../../componentName'
import apis from 'apis'
import {loginRedirect} from 'common/config';
let _isEqual = require('lodash/isEqual')

export default {
  props: ['edit'],
  inheritAttrs: false,
  components: {
    dyniInput
  },
  created() {
    this.getPlatSignList()
    let vm = this
    this.isGroup = getQueryString('groupFlag')
    bus.$on('timeout', () => {
      vm.$nextTick(() => {
        vm.saveBtnLoading = false
      })
    })
  },
  data() {
    let vm = this
    let isedit = true
    let checkSpecial = (rule, value, callback) => {
      // let str = '@#$%^*:;"`'.split('')
      // str.forEach(el => {
      //   if (value.indexOf(el) > -1) {
      //     callback(new Error('不能包含特殊字符'))
      //   }
      // })
      if (
        this.ruleStr.find(
          el => value.toUpperCase().indexOf(el.toUpperCase()) > -1
        )
      ) {
        callback(new Error('不能包含平台名称'))
      }
      if (/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/.test(value)) {
        callback(new Error('不能输入中文字符'))
      }
      callback()
    }
    return {
      spinning: true,
      // 验证生成变体后的数据
      tableFormData: {
        // skuCustom: [
        //   {
        //     value: ""
        //   }
        // ]
        // 0: [{
        //     value: ""
        //   }],
        // 1: [{
        //     value: ""
        //   }]
      },
      // 生成的变体列表，如果是编辑进入 ，则是获取到的变体数据
      list1: data => {
        // 编辑
        if (this.fromEdit && isedit && this.bianLists.length === 0) {
          this.$emit('openload')
          return this.getBase(+this.$attrs.productId).then(res => {
            this.$emit('close')
            this.spinning = false
            console.log(res)
            isedit = false
            if (res.data && res.data.code == 0) {
              delete res.data.code
              vm.variant = res.data.variantFlag
              vm.$emit('update:flag', vm.variant)
              vm.$emit('update:data', res.data)
              let productVariantList = res.data.productVariantList
              this.variantTabMain = {
                productVariantList: res.data.productVariantList,
                variantFlag: res.data.variantFlag
              }

              vm.parent.sku = res.data.sku
              vm.parent.skuCustom = res.data.skuCustom
              vm.catelogyMain = {
                categoryDetail: res.data.categoryDetail,
                categoryId: res.data.categoryId,
                categoryIdList: res.data.categoryIdList,
                ars: res.data.categoryIdList
                  ? res.data.categoryIdList.split(';').map(el => +el)
                  : [res.data.categoryId]
              }
              vm.customForm.ablum = res.data.categoryDetail
                ? res.data.categoryDetail.split(';').join(' > ')
                : []

              let tableData = []

              if (productVariantList.length && productVariantList.length > 0) {
                productVariantList.forEach((el, i) => {
                  // 设置表格数据
                  let tr = {}

                  let list = el.variantPropertyList
                  let variant = el.variant
                  console.log(
                    vm.items,
                    '----------------------------------------'
                  )
                  list.forEach((lis, lisIndex) => {
                    let __index = vm.items.findIndex(
                      el => el.categoryPropertyId === lis.categoryPropertyId
                    )
                    tr[__index] = lis.propertyValue
                    tr['_prop-' + __index] =
                      lis.propertyValueShort || lis.propertyValue
                  })
                  tr.sku = variant.sku
                  tr.skuCustom = variant.skuCustom
                  tr.productId = variant.productId

                  tableData.push(tr)
                  sessionStorage.setItem('tableData', JSON.stringify(tableData))
                })
              } else {
                vm.createB = false
                vm.showBianSetting = true
                vm.tableDataEmpty = false
                vm.fromEdit = false
              }

              // 设置列信息
              productVariantList[0].variantPropertyList.forEach((el, i) => {
                let isOrigin = el.propertyOriginal == 1
                this.items.push({
                  new: isOrigin ? false : true,
                  inputType: isOrigin ? el.inputType : 1,
                  propertyName: el.propertyName,
                  childs: [],
                  inputs: []
                })
              })

              console.log(tableData)
              return Promise.resolve({
                result: tableData
              })
            }
          })
        } else {
          // 新增
          console.log(vm.bianLists)
          let res = []
          let skus = []

          // 获取系统SKU
          return fetchData({
            ...apis._PRODUCT_SKU_GET,
            data: {
              num: vm.bianLists.length
            }
          }).then(res1 => {
            if (res1.data.code !== 0) {
              showToast('error', res.data.msg)
              return
            }

            const list = vm.items
            const data = vm.bianLists.map((el, index) => {
              let _el = {}
              for (let i = 0; i < list.length; i++) {
                // debugger;
                const element = list[i]
                const propList = _storage._get('session', 'erp_add_props')[
                  element.propertyName + '_' + element.categoryPropertyId
                ]
                if (propList) {
                  const propItems = [
                    ...propList.addItems,
                    ...propList.customItems,
                    ...propList.items
                  ]
                  const item = propItems.find(els => els.nameCn === el[i])
                  _el[element.displayKey] =
                    item.propertyValue || item.nameEn || item.propertyValue
                } else {
                  _el[element.displayKey] = el[i]
                }
              }
              _el.skuSys = res1.data.skuList[index]
              _el.parentSku = vm.parent.skuCustom
              return _el
            })

            return fetchData({
              ...apis.PRODUCT_BATCH_SKU_CUSTOM_GET,
              data
            }).then(res => {
              if (res.data.code === 0) {
                const rows = res.data.rows
                let result = []
                skus = res1.data.skuList
                for (let i = 0; i < vm.bianLists.length; i++) {
                  const el = vm.bianLists[i]

                  let ret = {}
                  ret.sku = skus[i]
                  ret.skuCustom = rows.find(
                    el => el.skuSys === skus[i]
                  ).skuCustom
                  vm.items.forEach((e, i) => {
                    ret[i] = el[i]
                  })

                  result.push(ret)
                }
                console.log(result)
                vm.setTableDataRule(null, result)

                return Promise.resolve({
                  result
                })
              } else {
                vm.resetToCreate()
                showToast('error', res.data.msg)
                return Promise.resolve({
                  result: null
                })
                
              }
            })
          })
        }
      },
      parent: {
        sku: '',
        skuCustom: ''
      },

      isCreate: true,

      disabledList: {},

      parentSkuCheck: [
        {
          required: true,
          type: 'string',
          min: 1,
          max: 30,
          message: '请输入1-30位的字符'
        },
        {
          validator: checkSpecial
        }
      ],
      variantRules: [
        {
          required: true,
          type: 'string',
          min: 1,
          max: 50,
          message: '请输入1-50位的字符'
          // trigger: 'blur,change'
        },
        {
          validator: checkSpecial
        }
      ],

      variantNum: this.$attrs.allData.variantTab.productVariantList || [],
      deleteId: [],
      saveBtnLoading: false,
      show: this.$attrs.show,
      variant: 0, // 是否加入规格参数
      fromEdit: this.edit,
      createB: false,
      firstInputVals: [],
      showBianSetting: false,
      tableDataEmpty: true,

      variantTabMain: {},
      catelogyMain: {},

      index: 0,
      lists: [],
      bianLists: [],
      inputs: [],
      items: [],
      ruleStr: [],
      showExtra: true,
      tableData: [],
      columns: [
        {
          title: '操作',
          field: 'edit'
        },
        {
          title: '系统SKU',
          field: 'sku'
        },
        {
          title: '自定义SKU',
          field: 'skuCustom'
        }
      ],
      columnsFor: [], // 变体列表对应项
      customForm: {
        ablum: ''
      },
      treeOption: {
        isAsync: true,
        idKey: 'productId',
        loadChildren: function(pramas) {
          return fetchData({ url: GET_PRODUCT_ALL_LIST, params }).then(res => {
            console.log(res)
            return res.data
          })
        }
      },
      customRules: {
        ablum: [{ required: true, message: '请选择产品类目' }]
      }
    }
  },
  methods: {
    getPlatSignList() {
      fetchData({ ...apis.PRODUCT_PLATFORM_SIGN_LIST, data: {} }).then(res => {
        if (res.data.code === 0) {
          this.ruleStr = res.data.rows
          _storage.set('local', 'ruleStr', res.data.rows)
        } else {
          showToast('error', '载入验证规则失败，请刷新重试')
          this.spinning = true
        }
      })
    },
    getPropertyId(props) {
      const field = props.column.title
      const el = this.items.find(el => el.propertyName === field)
      const id = el && el.propertyId
      return id
    },
    // 重置编辑框到属性编辑
    resetToCreate() {
      let vm = this
      vm.createB = false
      vm.showBianSetting = true
      vm.tableDataEmpty = false
      vm.fromEdit = false
    },
    // 选择类目
    selectColumns() {
      let hasCate =
          !!Object.keys(this.catelogy).length ||
          (!!this.catelogyMain.ars && !!this.catelogyMain.ars.length),
        selected
      if (hasCate) {
        selected = this.catelogy.ars || this.catelogyMain.ars
      }
      let vm = this
      showDialog(
        YT_PRODUCT_COLUMNS,
        { title: '请选择产品类目', width: 960 },
        { selected },
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr, ars, name) {
            console.log(arr)
            if (arr.length <= 0) {
              getVue().$message.error('请选择一个类目')
              return true
            }

            if (vm.tableData.length > 0) {
              vm.showBianSetting = true
            }

            // 获取类目变体属性
            vm.getProperties({
              categoryId: arr.categoryId,
              sourceType: arr.sourceType
            })

            // 把获取的类目信息修改到根组件，用来提交到服务器
            vm.$emit('update:cate', {
              ...arr,
              ars,
              categoryDetail: name.join(';')
            })
            vm.catelogyMain = {
              ...arr,
              ars,
              categoryDetail: name.join(';')
            }

            vm.customForm.ablum = name.join(' > ')
            // 每次选择类目时如果与之前的不同 重置生成 的变体列表
            if (selected && selected[selected.length - 1] !== arr.categoryId) {
              vm.tableData.splice(0)
              vm.createB = false
              vm.deleteId.splice(vm.deleteId.length)
              console.log(vm.tableData.map(el => el.productId))
              vm.deleteId.push(...vm.tableData.map(el => el.productId))
              vm.tableData = []
            }
            if (!vm.parent.sku) {
              vm.getSku()
            }
          }
        }
      )
    },

    // 打开类目编辑
    addColumns() {
      showDialog(
        'AddCategory',
        { title: '添加类目' },
        {},
        {
          // 绑定点击model确认事件,
          set: function() {
            showToast('success', '添加成功')
          }
        },
        true
      )
    },

    // 根据选择类目获取变体属性
    getProperties(opts) {
      let vm = this
      console.log(opts)
      if (isEmptyObject(opts)) {
        return
      }
      fetchData({
        ...apis.variant_property,
        data: opts
      }).then(res => {
        if (res.data && res.data.map) {
          res.data.map(el => {
            // 变体属性初始化
            el.childs = []
            el.inputs = []
            el.variantPropFlag = 1
          })
          vm.showBianSetting = true
          // vm.createB = false;
          vm.items = res.data
          vm.index = res.data.length - 1
        }
      })
    },

    // // 根据选择类目获取变体属性
    // getProperties(opts) {
    //   let vm = this
    //   if (isEmptyObject(opts)) {
    //     return
    //   }
    //   if (!this.getProperties.obj || !this.getProperties.obj.hasOwnProperty) {
    //     this.getProperties.obj = {}
    //   }
    //   if (!this.getProperties.obj.hasOwnProperty(JSON.stringify(opts))) {
    //     fetchData({
    //       ...apis.variant_property,
    //       data: opts
    //     }).then(res => {
    //       if (res.data && res.data.map) {
    //         res.data.map(el => {
    //           // 变体属性初始化
    //           el.childs = []
    //           el.inputs = []
    //           el.variantPropFlag = 1
    //         })
    //         vm.showBianSetting = true
    //         vm.items = res.data
    //         vm.index = res.data.length - 1
    //         this.getProperties.obj[[JSON.stringify(opts)]] = res.data
    //       }
    //     })
    //   } else {
    //     let data = this.getProperties.obj[[JSON.stringify(opts)]]
    //     vm.showBianSetting = true
    //     vm.items = data
    //     vm.index = data.length - 1
    //   }
    // },

    // 删除输入
    deleteInput(i, item, index) {
      console.log(i, item)
      item.childs.splice(index, 1)
    },

    // 获取产品变体页面数据
    getBase(id) {
      return fetchData({
        ...apis.PRODUCT_TAB_GET,
        data: { productId: id }
      })
    },

    // 创建变体
    creatBian() {
      let vm = this
      // 验证母体自定义SKU
      vm.$refs.skuForm.validate(valid => {
        if (valid) {
          let arrs = []
          let flag = true

          if (!vm.items.length) {
            flag = false
            showToast('error', '请新增一个自定义属性')
          }

          if (!vm.parent.skuCustom || vm.parent.skuCustom === '') {
            showToast('error', '母体自定义SKU不能为空')
            return
          }

          vm.items.forEach(el => {
            if (el.childs.length == 0 && el.inputs.length == 0) {
              showToast('error', '请填写属性值')
              flag = false
            }
            arrs.push([...el.childs.map(el => el.nameCn), ...el.inputs])
          })
          console.log(arrs)
          // 标记是否有生成过
          this.isCreate = false
          if (isArray(arrs[0])) {
            if (arrs.length > 1) {
              vm.bianLists = doExchange(arrs)
            } else {
              vm.bianLists = doExchange1(arrs)
            }
          } else {
            vm.bianLists = doExchange1(arrs)
          }
          console.log(vm.bianLists)

          if (flag) {
            vm.createB = true
          }
        }
      })
    },

    selectItem(item, index) {
      let { childs, prop } = item
      let url = apis.variant_property
      console.log(index)
      let vm = this
      showDialog(
        COLOR_PICKER,
        { title: '选择' + prop },
        {
          select: childs,
          url: {
            ...url,
            data: {
              categoryId: 2,
              sourceType: 'Merchant'
            }
          }
        },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(arr) {
            console.log(arr)
            Vue.set(
              vm.items,
              index,
              Object.assign({}, vm.items[index], { childs: arr })
            )
            // vm.items[index].childs = arr;
            console.log(vm.items)

            setTimeout(() => {
              fixFrameHeight(1)
            })
          }
        }
      )
    },
    delItem(item, index) {
      let { childs, prop } = item
      this.items.splice(index, 1)
      setTimeout(() => {
        fixFrameHeight(1)
      })
    },

    handlerTableInput(props, val) {
      if (!this.tableFormData[props.column.field]) {
        this.tableFormData[props.column.field] = [
          {
            value: ''
          }
        ]
        this.tableFormData[props.column.field][props.index] = {
          value: val
        }
      } else {
        this.tableFormData[props.column.field][props.index].value = val
      }
    },

    customInput(item, i, e) {
      console.log(item, i, e)
      if ((!!e && e != '') || e === 0) {
        if (i < item.inputs.length) {
          item.inputs.splice(i, 1, e)
        } else {
          item.inputs.push(e)
        }
      } else {
        item.inputs.splice(i, 1)
      }
    },
    customInputOne(item, i, e) {
      console.log(item, i, e)
      let val = e
      if ((!!val && val != '') || val === 0) {
        item.inputs.push(e)
        // 重置最后 的输入框的值
        this.$nextTick(() => {
          this.firstInputVals = []
          // if (item.inputType === 1) {
          //   this.$refs.firstInput[i].value = "";
          // }
        })
      }
    },

    // 颜色选择确认事件
    onColorSelect(item, $event, order) {
      console.log(item, order, $event)
      item.childs = $event
    },

    // 单选的时候
    onColorSelect1(props, $event) {
      this.$set(props.item, props.column.field, $event)
      // this.$refs.tableForm.validate();
      this.tableFormData[props.column.field][props.index].value = $event
      if (props.column.field == 'skuCustom') {
        this.variantTabMain.productVariantList[
          props.index
        ].variant.skuCustom = $event
      } else {
        try {
          this.variantTabMain.productVariantList[
            props.index
          ].variantPropertyList[props.column.field].propertyValue = $event
          console.log(props.column.field, $event)
          this.variantTabMain.productVariantList[
            props.index
          ].variantPropertyList[
            props.column.field
          ].propertyValueShort = this.getValueSort(props.column.field, $event)
        } catch (error) {}
      }
    },

    getValueSort(field, value) {
      let vm = this
      let DATAS = _storage._get('session', 'erp_add_props'),
        datas
      if (DATAS) {
        datas =
          DATAS[
            vm.items[field].propertyName +
              '_' +
              vm.items[field].categoryPropertyId
          ]
        if (datas) {
          datas = [...datas.addItems, ...datas.customItems, ...datas.items]
          datas = datas.find(_el => _el.nameCn === value)

          datas = datas && (datas.propertyValue || datas.nameEn || datas.nameCn)
        }
      }
      return datas
    },

    setTableItem(props, e) {
      this.tableData[props.index][props.column.field] = e
    },
    addProps() {
      let vm = this
      // debugger;
    let src = loginRedirect + `product/ProductCategoryManagement.html?categoryId=${
        this.catelogy.categoryId
      }`
      showDialog(
        'setVariantProp',
        { title: '变体值设置', width:700, modalnoBtn: true },
        { src },
        {
          set: function() {
            vm.getProperties({
              categoryId: vm.catelogy.categoryId,
              sourceType: vm.catelogy.sourceType
            })
          }
        },
        null,
        null,
        'h680'
      )
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    removeItem(index) {
      this.variantNum.splice(index, 1)
      this.variantTabMain.productVariantList.splice(index, 1)
      if (this.tableData[index].productId) {
        this.deleteId.push(this.tableData[index].productId)
      }

      if (this.tableData.length > 1) {
        this.tableData.splice(index, 1)
      } else {
        this.tableData.splice(0)
        this.createB = false
      }
    },
    addItem() {
      let tableFormData = this.tableFormData
      for (const key in tableFormData) {
        if (tableFormData.hasOwnProperty(key)) {
          const element = tableFormData[key]
          element.push({ value: null })
        }
      }

      let _el = { ...this.tableData[0] }
      for (const key in _el) {
        if (_el.hasOwnProperty(key)) {
          let element = _el[key]
          element = null
        }
      }
      this.tableData.push({ _new: true })

      // 设置增加的数据
      let ret = {
        variant: {
          productId: null,
          sku: null,
          skuCustom: null
        },
        variantPropertyList: []
      }
      let el = JSON.parse(
        JSON.stringify(
          this.variantTabMain.productVariantList[0].variantPropertyList
        )
      )
      el.forEach(i => {
        i.productId = null
        i.createTime = null
        i.modifyTime = null
        i.propertyValue = null
        i.productPropertyId = null
      })

      ret.variantPropertyList = el
      this.variantTabMain.productVariantList.push(ret)
    },
    inputItem(props, val) {
      console.log(val)
      Vue.set(
        this.tableData,
        props.index,
        Object.assign({}, this.tableData[props.index], {
          [props.column.field]: val
        })
      )
    },
    createVariant(item) {
      console.log(this.columnsFor.length)

      let fields = [],
        result = true

      this.columnsFor.forEach(el => {
        if (Number.isFinite(el.field)) {
          fields.push(`${el.field}.${item.index}.value`)
        }
      })
      console.log(fields)

      fields.forEach(el => {
        this.$refs.tableForm.validateField(el, err => {
          if (err) {
            result = false
          }
        })
      })
      setTimeout(() => {}, 10)
      if (result) {
        let vm = this
        // debugger;
        // 获取系统sku和自定义sku
        let data = []
        let _data = {}
        let DATAS = _storage._get('session', 'erp_add_props')
        for (const key in item.item) {
          if (item.item.hasOwnProperty(key)) {
            const element = item.item[key]
            if (isNaN(key)) {
              continue
            }

            _data[vm.items[key].displayKey] = ''

            let datas =
              DATAS[
                vm.items[key].propertyName +
                  '_' +
                  vm.items[key].categoryPropertyId
              ]
            datas = [...datas.addItems, ...datas.customItems, ...datas.items]
            datas = datas.find(el => el.nameCn === element)
            if (datas) {
              datas = datas.propertyValue || datas.nameEn || datas.nameCn
            }
            _data[vm.items[key].displayKey] = datas
          }
        }
        _data.parentSku = vm.parent.skuCustom

        fetchData({
          ...apis._PRODUCT_SKU_GET,
          data: {
            num: 1
          }
        }).then(res => {
          if (res.data.code === 0) {
            _data.skuSys = res.data.skuList[0]
            data.push(_data)
            fetchData({
              ...apis.PRODUCT_BATCH_SKU_CUSTOM_GET,
              data
            }).then(res1 => {
              if (res1.data.code === 0) {
                let skus = _data.skuSys
                let skuCustom = res1.data.rows[0].skuCustom
                Vue.set(vm.tableData, item.index, {
                  ...vm.tableData[item.index],
                  sku: skus,
                  skuCustom
                })

                vm.variantTabMain.productVariantList[
                  item.index
                ].variant.sku = skus
              } else {
                showToast('error', res.data.msg)
              }
            })
          } else {
            showToast('error', res.data.msg)
          }
        })
      }
    },

    // 检测要删除的变体中是否是组合产品
    async isGroupPro() {
      const variantIds = this.deleteId
      if (variantIds.length == 0) {
        return false
      }
      return fetchData({
        ...apis.PRODUCT_VARIANT_REMOVE_CHECK,
        data: {
          variantIds
        }
      }).then(res => {
        if (res.data.code === 0) {
          if (res.data.msg) {
            // showToast('warning', res.data.msg)
            return res.data.msg
          } else {
            return false
          }
        } else {
          showToast('error', res.data.msg)
          return false
        }
      })
    },

    // 保存到服务器
    save() {
      if (!this.tableData.length) {
        showToast('warning', '请先生成变体')
        return
      }
      this.$refs.skuForm.validate(valid => {
        if (valid) {
          this.$refs.tableForm.validate(valid => {
            if (valid) {
              if (this.hasSkuRule()) {
                this.saveBtnLoading = true
                this.saveGroup()
              }
            }
          })
        } else {
          showToast('error', '请输入正确的内容')
        }
      })
    },

    async saveGroup() {
      let isGroup = await this.isGroupPro()
      let vm = this
      if (isGroup) {
        showConfirm({
          title: '提示',
          content: isGroup,
          onOk() {
            vm.saveToApi()
          },
          onCancel() {
            location.reload()
          }
        })
      } else {
        vm.saveToApi()
      }
    },

    hasSkuRule() {
      // 判断自定义sku是否符合规则
      let skus = this.tableData.map(el => el.skuCustom)

      if (skus.some(el => el == '' || el == null)) {
        showToast('error', '请输入自定义SKU')
        return
      }
      if (skus.some(el => el === '')) {
        showToast('error', '自定义SKU不能为空')
        return
      }

      if (this.parent.skuCustom === '') {
        showToast('error', '母体自定义SKU不能为空')
        return
      }

      if (this.tableData.length <= 0) {
        showToast('error', '请先生成变体')
        return
      }

      if (!_isEqual(skus, [...new Set(skus)])) {
        showToast('error', '自定义SKU不能重复')
        return
      }

      return true
    },

    // 保存到服务器api
    saveToApi() {
      let vm = this
      // console.log(this.saved())
      // return
      fetchData({ ...apis.PRODUCT_TAB_SAVE, data: this.saved() }).then(res => {
        vm.isCreate = true
        console.log(res)
        vm.saveBtnLoading = false
        if (res.data.code === 0) {
          _storage.clear('session')
          sessionStorage.setItem('save', 1)
          if (vm.edit) {
            showToast('success', '保存成功')
            window.location.reload()
          } else {
            showToast('success', '保存成功')

            toParamUrl('/product/productList/addProduct.html', {
              productId: res.data.productId,
              groupFlag: !!vm.isGroup
            })
          }
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    // 获取产品的sku
    getSku() {
      fetchData({
        ...apis._PRODUCT_SKU_GET,
        data: {
          num: 1
        }
      }).then(res => {
        console.log(res)
        this.$nextTick(() => {
          this.parent.sku = res.data.skuList[0]
        })
      })
    },

    setTableDataRule(val, tableData) {
      const v = (val || this.columnsFor).slice(2)
      tableData = tableData || this.tableData
      v.forEach(el => {
        if (tableData && tableData.length > 0) {
          let arr = []
          for (let index = 0; index < tableData.length; index++) {
            const element = tableData[index]
            if (element[el.field]) {
              arr.push({ value: element[el.field] })
            } else {
              arr.push({ value: '' })
            }
          }
          this.$set(this.tableFormData, el.field, arr)
        }
      })
    },
    saved() {
      let { variantFlag, productVariantList } = this.variantTabMain
      let { categoryId, categoryDetail, ars } = this.catelogyMain
      let variantArray = []
      this.items.forEach(el => {
        variantArray.push([...el.childs, ...el.inputs])
      })
      variantArray = JSON.stringify(variantArray)
      let data = {
        sku: null,
        skuCustom: null,
        productVariantList,
        variantFlag,
        variantArray,
        deleteVariantIds: this.deleteId,
        categoryId,
        categoryDetail: categoryDetail,
        categoryIdList: ars.length ? ars.join(';') : ars
      }
      let customPropertyList = []
      const added = _storage._get('session', 'erp_add_props')
      for (const key in added) {
        if (added.hasOwnProperty(key)) {
          const element = added[key]
          if (element.addItems.length > 0) {
            customPropertyList.push(
              ...element.addItems.map(el => ({
                productPropertyValueId: null,
                categoryId: el.categoryId,
                categoryPropertyId: el.categoryPropertyId,
                propertyName: el.propertyName,
                value: el.nameCn,
                valueShort: el.valueShort,
                propertyValue: el.valueShort,
                nameCn: el.nameCn
              }))
            )
          }
        }
      }

      let ret = {
        ...data,
        ...this.parent,
        customPropertyList,
        variantFlag: this.variant
      }
      if (this.isGroup) {
        ret.productType = 3
      }

      return ret
    }
  },
  watch: {
    'parent.skuCustom'(newVal, oldVal) {
      if (this.tableData.length) {
        this.tableData.forEach(el => {
          let skuCustoms = el.skuCustom.split('-')
          const skuCustom = skuCustoms.pop()
          if (skuCustom === oldVal) {
            skuCustoms.push(newVal)
            el.skuCustom = skuCustoms.join('-')
          }
        })
      }
    },
    columnsFor(val) {
      this.setTableDataRule(val)
    },
    items: {
      deep: true,
      handler: function(val) {
        sessionStorage.setItem('tableDataItems', JSON.stringify(this.items))
        let vm = this
        let ret = []
        val.forEach((el, i) => {
          let item = {
            title: el.propertyName,
            field: i
          }
          ret.push(item)
        })
        ret.unshift(...this.columns)
        let arr = []
        if (!this.variantTabMain) {
          return
        }
        if (
          this.variantTabMain.productVariantList &&
          this.variantTabMain.productVariantList.length > 0
        ) {
          let list = this.variantTabMain.productVariantList[0]
            .variantPropertyList

          if (
            this.variantTabMain.productVariantList &&
            this.variantTabMain.productVariantList.length &&
            ret.length - 3 < list.length
          ) {
            list.forEach((el, index) => {
              if (ret.find(i => i.title === el.propertyName)) {
                return false
              }
              arr.push(el.propertyName)
            })
          }
        }

        if (arr.length > 0) {
          console.log(ret[ret.length - 1])
          arr.forEach((element, index) => {
            ret.push({
              field: ret[ret.length - 1].field + 1 + index,
              title: element
            })
          })
        }

        this.columnsFor = ret
      }
    },

    // 监控表格数据变动
    tableData: {
      deep: true,
      immediate: true,
      handler: function(val) {
        let ress = {}
        let first = this.fromEdit
        let vm = this

        // 设置变体字段

        console.log(val)

        ress.productVariantList = []
        setTimeout(() => {
          this.$nextTick(() => {
            val.forEach((el, index) => {
              let cur = {}
              if (first && this.tableDataEmpty) {
                // first = false;
                if (this.variantNum[index]) {
                  cur.variant = Object.assign(
                    {},
                    this.variantNum[index].variant,
                    {
                      sku: el.sku,
                      skuCustom: el.skuCustom
                    }
                  )
                } else {
                  cur.variant = {
                    sku: el.sku,
                    skuCustom: el.skuCustom,
                    productId: el.productId
                  }
                }
              } else {
                cur.variant = {
                  sku: el.sku,
                  skuCustom: el.skuCustom,
                  productId: el.productId
                }
              }

              cur.variantPropertyList = []

              vm.columnsFor.forEach((col, colIndex) => {
                if (isNumber(col.field)) {
                  let _name = col.title
                  let datas = vm.getValueSort(col.field, el[col.field + ''])

                  if (vm.fromEdit) {
                    console.log('edit', el['_prop-' + col.field])
                    // 如果是编辑页面
                    // console.log(this.variantTab);
                    if (el[col.field + '']) {
                      let __list =
                          vm.variantTab.productVariantList[index]
                            .variantPropertyList,
                        __el = __list[colIndex - 3],
                        __props = vm.items[col.field]
                      console.log(__el, __props)
                      let list = Object.assign(
                        {},
                        __el
                          ? __el
                          : vm.variantTab.productVariantList[0]
                              .variantPropertyList[col.field],
                        {
                          propertyName: col.title,
                          propertyValue: el[col.field + ''],
                          productId: el.productId,
                          propertyValueShort:
                            datas != null && datas != ''
                              ? datas
                              : el['_prop-' + col.field],
                          categoryPropertyId: __props.categoryPropertyId,
                          // productPropertyId: __el.productPropertyId,
                          propertyOriginal: 1,
                          variantPropFlag: 1
                        }
                      )
                      if (
                        !vm.variantTab.productVariantList[index]
                          .variantPropertyList[colIndex]
                      ) {
                        delete list.productId
                        // delete list.productPropertyId
                      }
                      cur.variantPropertyList.push(list)
                    }
                  } else {
                    console.log('false')
                    let valueShortEl = vm.items[col.field].childs.find(
                      _el =>
                        _el.propertyValue === el[col.field + ''] ||
                        _el.nameCn === el[col.field + '']
                    )
                    let valueShort
                    if (valueShortEl) {
                      valueShort = valueShortEl.nameEn || valueShortEl.nameCn
                    }

                    cur.variantPropertyList.push({
                      productPropertyId: null,
                      categoryPropertyId:
                        vm.items[col.field].categoryPropertyId,
                      productId: null,
                      propertyValueShort: valueShort,
                      propertyName: col.title,
                      propertyValue: el[col.field + ''],
                      propertyOriginal: 1,
                      variantPropFlag: 1
                    })
                  }
                }
              })
              ress.productVariantList.push(cur)
            })
            console.log(ress)
            ress.variantFlag = this.items.checked ? 1 : 0
            this.$emit('update:data', ress)

            this.variantTabMain = ress
          })
        })
      }
    },

    'tableData.length'(val) {
      if (val == 0) {
        this.$nextTick(() => {
          this.createB = false
          this.showBianSetting = true
          this.tableDataEmpty = false
          this.fromEdit = false
        })
      }
    },

    variant(val) {
      let variantFlag = val ? 1 : 0
      console.log(variantFlag)
      this.$emit('update:flag', variantFlag)
    },

    catelogy(val) {
      // 编辑模式 初始化数据
      // 变体数据
      if (this.fromEdit) {
        this.createB = true
        console.log('--------------------------')
        // 获取类目变体属性
        this.getProperties({
          categoryId: val.categoryId,
          sourceType: val.sourceType
        })
      }
    }
  },
  computed: {
    // 获取主页要提交 的varianttab数据
    variantTab() {
      return this.$attrs.allData.variantTab
    },
    catelogy() {
      if (this.$attrs.catelogy.code) {
        return {}
      }
      return this.$attrs.catelogy
    }
  }
}
</script>

<style lang="less">

.productVariant_wrapper {
  .noBtn {
    .ant-input-group-addon {
      padding: 0;
      .ant-form-item {
        margin-bottom: 0;
        .ant-btn.ant-btn-ghost {
          border: 0;
        }
      }
    }
  }
  .__select {
    cursor: pointer;
    & > .ant-form-item {
      height: 31px;
    }
  }
  .delete_icon_wrapper {
    position: relative;
    margin-bottom: 6px;
    .del {
      position: absolute;
      top: -5px;
      right: -5px;
      line-height: 1;
      cursor: pointer;
      i {
        font-size: 15px;
      }
    }
  }
  .ant-form-inline ._col .ant-form-item > div {
    width: 100%;
  }
  margin-bottom: 40px;
  .ant-card-head {
    min-height: 48px;
    height: auto;
    line-height: 48px;
    padding: 0 8px;
    background: #f2f2f2;
    .ant-card-head-title {
      display: none;
    }

    .ant-card-extra {
      float: none;
      display: block;
      width: 100%;
      overflow: hidden;
      .content {
        display: flex;
        justify-content: space-between;
        &* {
          flex: auto;
        }
        input {
          width: 160px;
        }
      }
    }
  }
  .inputForm > div {
    width: 100%;
  }
}
</style>

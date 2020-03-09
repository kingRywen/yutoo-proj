<template>
  <div v-if="spinning" class="flex">
    <div style="width:200px">
      <v-progress-line :percent="percent" status="active"></v-progress-line>
      <div style="text-align:center">{{loadingText}}...</div>
    </div>
  </div>
  <v-spin v-else :tip="tip" :spinning="spinning" style="height:100%">
    <div class="content">
      <el-steps
        :active="activeName"
        simple
        class="__langForms_step"
        v-if="(!hasTemplate && siteList.length) || showStrict"
      >
        <el-step title="选择分类" icon="el-icon-menu"></el-step>
        <el-step title="填写详细信息" icon="el-icon-edit"></el-step>
        <!-- <el-step title="预览" icon="el-icon-view"></el-step> -->
        <!-- <el-step title="提交审核" icon="el-icon-circle-check-outline"></el-step> -->
      </el-steps>
      <div class="__langForms_step_content">
        <div class="__main">
          <div v-show="activeName == 1" v-if="!hasTemplate || showStrict" class="__main_box" style="height: auto;">
            <v-card
              v-for="(item, index) in siteList"
              :title="item.siteName + '站'"
              style="margin-bottom:20px;flex:1"
              noHovering
            >
              <v-form direction="horizontal">
                <v-form-item label="基础产品类目" :label-col="labelcol" :wrapper-col="wrappercol">
                  <v-input :disabled="true" :value="item.categoryPath && item.categoryPath.replace(/\;/ig, ' > ')"></v-input>
                </v-form-item>
                <v-form-item label="映射类目" :label-col="labelcol" :wrapper-col="wrappercol">
                  <v-input
                    :disabled="true"
                    :value="item.pltCategoryPath && item.pltCategoryPath.replace(/\:/ig, ' > ')"
                  ></v-input>
                </v-form-item>
                <v-form-item label="选择类目" :label-col="labelcol" :wrapper-col="wrappercol">
                  <SyncCascader
                    :load="lists(item)"
                    :props="prop"
                    @change="getTemp(item, $event, index)"
                    v-model="item._val"
                    :disabled="$attrs.show"
                    ref="_this"
                  ></SyncCascader>
                  <div style="opacity:0.5;">除服装类目模板，其它模板尚未完善，请选择服装类目模板</div>
                </v-form-item>
                <v-form-item label="选择模板" :label-col="labelcol" :wrapper-col="wrappercol" v-if="item._val.length">
                  <v-select
                    :data="item._select"
                    size="lg"
                    label="templateNameCh"
                    clue="salePfTemplateId"
                    v-model="item._temp"
                    :disabled="$attrs.show"
                  ></v-select>
                </v-form-item>
              </v-form>
            </v-card>
            <div class="btn_wrapper" style="flex: none;">
              <v-button :disabled="!(showFirstNextBtn && siteList.length)" type="primary" @click="toTwo">下一步</v-button>
              <v-button
                :disabled="!(showFirstNextBtn && siteList.length && (!$attrs.show && !isReview))"
                type="primary"
                @click="save(0)"
                :loading="saveLoading"
              >保存</v-button>
            </div>
          </div>
          <div v-show="activeName == 2" class="__name_2_box">
            <el-tabs
              ref="tab"
              type="card"
              v-model="tabsName"
              class="product_box"
              style="padding-bottom: 0;"
              @tab-click="handleTabClick"
            >
              <el-tab-pane
                v-for="(data, key, index) in secondData"
                :label="descMap[key]"
                :key="key"
                :name="index + ''"
                style="flex:1"
              >
                <v-spin :tip="`加载中...`" :spinning="loadingTb">
                  <v-form
                    v-if="index === 0 && variantPropGroup.length"
                    :model="formObj"
                    :showMessage="false"
                    class="plat-variant-table"
                    ref="formTable"
                  >
                    <v-data-table
                      :currentData.sync="tableData"
                      v-if="index === 0"
                      ref="table"
                      :data="loadData"
                      border
                      :columns="columns"
                      style="height:auto;margin:20px"
                    >
                      <template slot="td" slot-scope="props">
                        <v-form-item
                          v-if="props.column.field!=='sku' && Object.keys(formObj).length"
                          class="custom"
                          style="width:100%"
                          :required="true"
                          :prop="`${props.index}.${props.column.field}`"
                          :rules="tableRules(props)"
                        >
                          <v-select
                            :disabled="$attrs.show"
                            size="lg"
                            v-if="props.column.props.controlType === 2"
                            style="width:100%"
                            clue="salePfPropItemId"
                            label="itemValue"
                            :value="+props.content"
                            :data="props.column.list"
                            @change="handleTbSelectChange(props, $event)"
                          ></v-select>
                          <v-input
                            :disabled="$attrs.show"
                            v-if="props.column.props.controlType === 1"
                            :value="props.content"
                            @input="handleTbInput(props, $event)"
                          ></v-input>
                        </v-form-item>
                        <span v-else v-html="props.content"></span>
                      </template>
                    </v-data-table>
                  </v-form>
                </v-spin>

                <PurchaseInputNew
                  :auditDataList="auditDataList"
                  direction="horizontal"
                  :rules="rules"
                  :data="data"
                  :labelcol="{span:6}"
                  :wrappercol="{span:14}"
                  :bind-field="bindField"
                  :mappingFieldData="mappingFieldData"
                  ref="purchaseinput"
                  :variantDataList="variantDataList"
                  :name="key"
                  :disabled="$attrs.show"
                ></PurchaseInputNew>
              </el-tab-pane>
            </el-tabs>
            <div class="btn_wrapper">
              <!-- 
              <v-button v-if="showFirstNextBtn" type="primary" @click="next">下一步</v-button>-->
              <v-button v-if="tabsName == 0" type="primary" @click="prev">{{isReview ? '查看' : '选择'}}模板</v-button>
              <v-button
                v-if="showFirstNextBtn && (!$attrs.show && !isReview)"
                type="primary"
                @click="save(0)"
                :loading="saveLoading"
              >保存</v-button>
              <v-button
                v-if="showFirstNextBtn && (!$attrs.show && !isReview)"
                type="primary"
                @click="save(1)"
                :loading="saveLoading"
              >提交</v-button>
            </div>
          </div>

          <div v-if="activeName == 3" class="__main_box">
            <el-collapse accordion>
              <el-collapse-item v-for="(data, key, index) in secondData" :key="key">
                <template slot="title">{{descMap[key]}}</template>
                <PurchaseInputNew
                  :auditDataList="auditDataList"
                  :disabled="true"
                  direction="horizontal"
                  :rules="rules"
                  :data="data"
                  :labelcol="{span:6}"
                  :wrappercol="{span:14}"
                  :bind-field="bindField"
                  :mappingFieldData="mappingFieldData"
                  :variantDataList="variantDataList"
                  :name="key"
                ></PurchaseInputNew>
              </el-collapse-item>
            </el-collapse>
            <div class="btn_wrapper">
              <v-button v-if="showFirstNextBtn" type="primary" @click="activeName = 2">选择模板</v-button>
              <v-button
                v-if="showFirstNextBtn && (!$attrs.show && !isReview)"
                type="primary"
                @click="save(0)"
                :loading="saveLoading"
              >保存</v-button>
              <v-button
                v-if="showFirstNextBtn && !isVariant && (!$attrs.show && !isReview)"
                type="primary"
                @click="save(1)"
              >提交审核</v-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-spin>
</template>

<script>
import { Steps, Step, Collapse, CollapseItem, Tooltip } from 'element-ui'
import Vue from 'vue'
import PurchaseInputNew from 'components/base/purchaseInputNew'
import {
  handlerCode,
  fetchData,
  showToast,
  showConfirm,
  toParamUrl,
  _storage,
  batchValidForm
} from 'common/common'
import { getQueryString, isObj } from 'common/util'
import apis from 'apis'
import PurchaseInput from 'components/base/purchaseInput'
import SyncCascader from 'components/base/SyncCascader'

Vue.use(Steps)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Tooltip)
Vue.use(Step)

export default {
  inheritAttrs: false,
  // TODO: 语种的信息，以后用得到
  props: ['langInfo'],
  components: {
    PurchaseInputNew,
    SyncCascader,
    PurchaseInput
  },
  created() {
    if (this.hasTemplate) {
      this.activeName = 2
    }
    this.isReview = getQueryString('review')
    this.productPltDetailId = +getQueryString('productPltDetailId')
    this.platformId = +getQueryString('platformId')
    this.parentProductPltDetailId = +getQueryString('parentProductPltDetailId')
    window.location.pathname === '/product/platformList/review.html'
    this.isVariant = getQueryString('variant') == true
    this.getSiteList()
  },
  mounted() {
    this.openLoading()
  },
  data() {
    let vm = this
    let checkItem = props => (rule, value, cb) => {
      let { index, cindex } = props
      console.log(index, cindex)
      vm.tableData.forEach(element => {
        if (element[vm.columns[cindex].field] === value) {
          cb(new Error('各值不能相同'))
        }
      })
      cb()
    }
    return {
      saveType: undefined,
      tableData: [],
      lists1: [],
      loadData(pramas) {
        return Promise.resolve().then(() => {
          return {
            result: vm.lists1
          }
        })
      },
      columns: [
        { title: '自定义SKU', field: 'sku' },
        { title: 'Color', field: 'color' },
        { title: 'Color Map', field: 'color_map' },
        { title: 'Size Map', field: 'size_map' },
        { title: 'Size', field: 'size' }
      ],
      tip: '正在读取数据...',
      saveLoading: false,
      showStrict: false,
      auditDataList: [],
      keywords: [],
      tabsName: '0',
      descMap: {},
      mappingFieldData: {},
      productPltVariantDetailList: [],
      variantDataList: [],
      spinning: true,
      loadingTb: false,
      activeKey: '0',
      percent: 0,

      cateVal: [],
      labelcol: { span: 6 },
      wrappercol: { span: 14 },
      prop: {
        label: 'categoryName',
        value: 'platformCategoryId',
        children: 'childs',
        enabled: 'haveTemplate'
      },
      bindField: {
        label: 'propertyName',
        value: 'value',
        bindval: 'propertyName',
        type: 'dataType',
        inputType: 'controlType',
        required: 'mustFlag'
      },
      lists(item) {
        return id => {
          return fetchData({
            ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
            data: {
              siteId: item.siteInfo.siteId || 1,
              cateId: id != null ? id[id.length - 1] : -1
            }
          }).then(res => {
            if (res.data.code !== 0) {
              showToast('error', res.data.msg)
              return
            }
            if (res.data.cates) {
              return res.data.cates.map(el => {
                return {
                  ...el,
                  childs: el.childCount > 0 ? [] : null
                }
              })
            }
          })
        }
      },
      tableRules(props) {
        return [
          { required: true, message: '请输入' }
          // {
          //   validator: checkItem(props)
          // }
        ]
      },
      variantPropGroup: [],
      ruleForm: {},
      rules: {},
      siteList: [],
      activeName: 1,
      firstData: {
        category: {
          label: '亚马逊类别',
          value: '',
          rules: 'notEmpty',
          type: 9
        },
        category1: {
          label: '亚马逊类别',
          value: '',
          rules: 'notEmpty',
          type: 1
        },
        category2: {
          label: '亚马逊类别',
          value: '',
          rules: 'notEmpty',
          type: 1
        }
      },
      secondData: {}
    }
  },
  methods: {
    handleTabClick(tab, event) {
      console.log(tab, event)
      setTimeout(() => {
        this.$nextTick(() => {
          tab.$el.parentNode.scrollTop = 0
        })
      })
    },
    // 表单验证
    async submitForm() {
      let form = this.$refs.purchaseinput
      // form = form.filter(el => el.$refs.ruleForm.fields.length)
      return await batchValidForm(form, true)
    },
    prev() {
      this.showStrict = true
      let len = Object.keys(this.secondData).length
      if (this.tabsName > 0) {
        this.tabsName = +this.tabsName - 1 + ''
      } else {
        this.activeName = 1
      }
    },
    async next() {
      let len = Object.keys(this.secondData).length

      if (this.tabsName < len - 1) {
        const _input = this.$refs.purchaseinput[this.tabsName]

        // if (!_input.$refs.ruleForm.fields.length) {
        //   this.tabsName = +this.tabsName + 1 + ''
        //   return
        // }

        // 先验证表单项
        this.$refs.formTable[0].validate(async valid => {
          if (valid) {
            // debugger
            let valis = await batchValidForm([_input], true)
            console.log(valis)
            if (valis.length > 0) {
              showToast('error', '请填写正确的必填项')
              // this.tabsName = valis[0] + ''
            } else {
              this.tabsName = +this.tabsName + 1 + ''
            }
          } else {
            showToast('error', '请填写正确的必填项')
          }
        })
      } else {
        let valis = await this.submitForm()
        console.log(valis)
        if (valis.length > 0) {
          showToast('error', '请填写正确的必填项')
          this.tabsName = valis[0] + ''
        } else {
          this.activeName = 3
        }
      }
    },

    // 验证敏感关键词
    setKeywords(data) {
      let vm = this
      // let arr = [];
      vm.keywords = []
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key]
          if (isObj(element)) {
            vm.setKeywords(element)
          } else {
            vm.keywords.push(element)
            // if (
            //   key === "titleEn" ||
            //   key === "entryNameEn" ||
            //   key === "entryNameZh"
            // ) {
            //   vm.keywords.push(element);
            // }
          }
        }
      }
    },

    async validKeyword(data) {
      this.setKeywords(data)
      let valis = await fetchData({
        ...apis.PRODUCT_KEY_WORD_VERIFY_1,
        data: { word: this.keywords.join(';') }
      })

      if (Object.keys(valis.data).length > 1) {
        let str = ``
        for (const key in valis.data) {
          if (valis.data.hasOwnProperty(key)) {
            const element = valis.data[key]
            if (key === 'code') {
              continue
            }
            str += '<p>' + key + ': ' + element + '</p>'
          }
        }
        return str
      } else {
        return null
      }
    },

    async save(commit, showSuc) {
      let isSave = !!arguments[2] // 是否是类目选择后的保存
      let vm = this
      let api = apis.PRODUCT_PLT_DETAIL_A_EN_SAVE
      if (commit) {
        api = apis.PRODUCT_PLT_DETAIL_A_EN_COMMIT
      }
      if (isSave) {
        api = apis.PRODUCT_PLT_DETAIL_CATEGORY_UPDATE
      }
      let data = this.getData()

      let res = await this.validKeyword(data)
      if (res) {
        showConfirm({
          content: `您提交的表单信息中包含 <div class="text-error">${res}</div>是否继续？`,
          title: '警告',
          onOk() {
            vm.save1(data, api, commit, showSuc, isSave)
          }
        })
        return
      }

      this.save1(data, api, commit, showSuc, isSave)
    },

    setPosition() {
      this.$nextTick(() => {
        let errorFormDom = this.$refs.purchaseinput[this.tabsName].$el
        let errorInputDom = errorFormDom.querySelectorAll(
          '.ant-form-item-control.has-error'
        )[0]
        let errorBounding = errorInputDom.getBoundingClientRect()
        let { top } = errorBounding
        // debugger
        if (top <= 300) {
          return
        }
        errorFormDom.parentNode.parentNode.scrollTop = top - 300
      })
    },

    async save1(data, api, commit, showSuc, isSave) {
      if (commit) {
        if (this.$refs.formTable) {
          this.$refs.formTable[0].validate(async valid => {
            if (valid) {
              let valis = await this.submitForm()
              console.log(valis)
              if (valis.length > 0) {
                showToast('error', '请填写正确的必填项')
                this.tabsName = valis[0] + ''
                this.setPosition()
              } else {
                this.fetch.apply(this, arguments)
              }
            } else {
              this.tabsName = '0'
              showToast('error', '请填写正确的必填项')
              this.$nextTick(() => {
                this.$refs.tab.$el.querySelectorAll(
                  '.el-tabs__content'
                )[0].scrollTop = 0
              })
            }
          })
        } else {
          let valis = await this.submitForm()
          if (valis.length > 0) {
            showToast('error', '请填写正确的必填项')
            this.tabsName = valis[0] + ''
            this.setPosition()
          } else {
            this.fetch.apply(this, arguments)
          }
        }
        return
      } else {
      }
      this.fetch.apply(this, arguments)
    },
    fetch(data, api, commit, showSuc, isSave) {
      _storage.remove('session', 'USATime')
      if (commit) {
        this.saveType = 2
      } else {
        this.saveType = 1
      }
      this.openLoading()
      this.spinning = true
      this.tip = `正在${commit ? '提交' : isSave ? '读取' : '保存'}数据...`
      this.saveLoading = true
      fetchData({ ...api, data }).then(res => {
        this.saveLoading = false
        this.tip = '正在读取数据...'
        if (!isSave) {
          this.spinning = false
        }

        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        if (!showSuc) {
          showToast('success', res.data.msg)
        }

        if (commit) {
          toParamUrl('/product/platformList.html')
        }
      })
    },
    getData() {
      let vm = this
      const datas = vm.$refs.purchaseinput
        ? vm.$refs.purchaseinput.map(el => el.ruleForm)
        : []
      let ret = {
        platformId: vm.platformId,
        productPltDetailId: vm.isVariant
          ? vm.parentProductPltDetailId
          : vm.productPltDetailId,
        siteList: [],
        parentDetail: {},
        variantDetailList: []
      }

      ret = JSON.parse(JSON.stringify(ret))

      vm.siteList.forEach(el => {
        ret.siteList.push({
          ...el.siteInfo,
          templateId: el._temp,
          siteCategoryInfo: el._val.join(',')
        })
      })

      if (datas.length == 0) {
        return ret
      }

      let parent = JSON.parse(JSON.stringify(vm.lists1.slice().shift()))
      delete parent.sku

      datas.forEach(element => {
        ret.parentDetail = { ...ret.parentDetail, ...element.parent, ...parent }
      })
      let el = datas[0].variants

      for (const key in el) {
        if (el.hasOwnProperty(key)) {
          const element = el[key]
          const productPltVariantDetail = vm.productPltVariantDetailList.find(
            el => el.sku === key
          )
          let productPltDetailId
          if (productPltVariantDetail) {
            productPltDetailId = productPltVariantDetail.productPltDetailId
          }
          let data = {}
          datas.forEach(el => {
            data = { ...data, ...el.variants[key] }
          })
          // map数据
          let _val = vm.lists1.find(el => el.sku === key)
          if (_val) {
            _val = JSON.parse(JSON.stringify(_val))
            delete _val.sku
          }
          if (productPltDetailId) {
            ret.variantDetailList.push({
              productPltDetailId,
              data: { ...data, ..._val }
            })
          }
        }
      }

      delete ret.parentDetail.reference

      function removeNull(obj) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const element = obj[key]
            if (
              element == null ||
              (Object.prototype.toString.call(element) === '[object Array]' &&
                element[0] == null &&
                element.length <= 1) ||
              key.indexOf('edit-') === 0
            ) {
              delete obj[key]
            }
          }
        }
      }

      let { parentDetail, variantDetailList } = ret

      removeNull(parentDetail)
      variantDetailList.forEach(el => {
        removeNull(el.data)
      })

      if (this.isVariant) {
        ret.parentFlag = 0
        ret.variantPltDetailId = this.productPltDetailId
      } else {
        ret.parentFlag = 1
      }

      return ret
    },

    handleTbInput(props, val) {
      let {
        index,
        cindex,
        column: { field },
        item
      } = props
      props.item[props.column.field] = val
      if (item.variantProp && item.variantProp[field] != null) {
        this.tableData.forEach(el => {
          if (el.variantProp[field] === item.variantProp[field]) {
            this.$set(el, field, val)
          }
        })
      }
    },

    handleTbSelectChange(props, val) {
      let vm = this
      let {
        index,
        cindex,
        column: { field },
        item
      } = props
      this.$set(props.item, props.column.field, val)
      if (item.variantProp && item.variantProp[field] != null) {
        this.tableData.forEach(el => {
          if (el.variantProp[field] === item.variantProp[field]) {
            this.$set(el, field, val)
          }
        })
      }

      this.$nextTick(() => {
        setTimeout(() => {
          vm.$refs.formTable[0].validateField(
            `${props.index}.${props.column.field}`
          )
        })
      })
    },
    secondNext() {
      console.log(this.$refs.tabs)
      if (this.$refs.tabs.activeIndex < Object.keys(this.secondData).length) {
      }
    },
    async toTwo() {
      if (this.isReview) {
        this.getFeild()
        return
      }
      await this.save(0, 1, 1)
      this.getFeild()
    },
    getFeild() {
      let vm = this
      vm.spinning = true
      vm.saveType = null
      vm.tip = '正在读取数据...'
      vm.openLoading()
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_FIELD,
        data: {
          productPltDetailId: vm.productPltDetailId,
          templateIds: vm.selectedTempId,
          parentFlag: vm.isVariant ? 0 : 1
        }
      }).then(res => {
        vm.spinning = false
        // vm.percent = 100
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        vm.spinning = true

        // 获取保存的数据
        fetchData({
          ...apis.PRODUCT_PLT_DETAIL_DATA,
          data: {
            flag: vm.isReview ? 1 : 0,
            parentFlag: vm.isVariant ? 0 : 1,
            productPltDetailId: vm.productPltDetailId
          }
        }).then(res1 => {
          function getAllPropVal(data) {
            let result = {}
            for (const __key in data) {
              if (data.hasOwnProperty(__key)) {
                const group = res.data.field[__key]
                let groupField = []
                for (const key in group) {
                  if (group.hasOwnProperty(key)) {
                    const element = group[key]
                    groupField.push({
                      name: element.propertyGroupName,
                      num: element.num
                    })
                  }
                }

                const _element = JSON.parse(JSON.stringify(data[__key]))
                result[__key] = {}

                // groupField.forEach(({ name, num }) => {
                //   let arr = (result[__key][name + 1] = [])
                //   for (let index = 1; index <= num; index++) {
                //     arr.push(_element[name + index])
                //     delete _element[name + index]
                //   }
                // })

                // for (const key in _element) {
                //   if (_element.hasOwnProperty(key)) {
                //     const element = _element[key]
                //     result[__key][key] = element
                //   }
                // }

                for (const key in _element) {
                  if (_element.hasOwnProperty(key)) {
                    const element = _element[key]
                    // let _key = key.slice().split('')
                    // let lastIndex = _key.pop()
                    // let _keyStr = _key.join('')

                    result[__key][key] = element

                    // if (!isNaN(lastIndex)) {
                    //   if (result[__key][_keyStr]) {
                    //     result[__key][_keyStr].unshift(element)
                    //   } else {
                    //     result[__key][_keyStr] = [element]
                    //   }
                    // } else {
                    //   result[__key][key] = element
                    // }
                  }
                }
              }
            }
            return result
          }

          function getList(id) {
            vm.loadingTb = true
            return fetchData({
              ...apis.SALEPFPROPITEM_GETPROPITEM_1,
              data: {
                propertyId: id
              }
            })
              .then(res => {
                vm.loadingTb = false
                if (res.data.code !== 0) {
                  return
                }
                return res.data.list
              })
              .catch(error => {
                vm.loadingTb = false
                showToast('error', '获取选择项失败')
              })
          }
          vm.percent = 100
          setTimeout(() => {
            clearInterval(vm.timer)
            vm.timer = null
            vm.spinning = false
          }, 500)

          if (res1.data.code !== 0) {
            showToast('error', res1.data.msg)
            return
          }

          /* 设置值 */
          let { parentData, variantDataList, auditDataList } = res1.data.rows
          let parentObj = {},
            varList = []
          vm.lists1 = []

          // colormap sizemap 处理表格数据
          vm.variantPropGroup = res.data.variantPropGroup
          // 提取column
          vm.columns = [{ title: '自定义SKU', field: 'sku', props: {} }]
          res.data.variantPropGroup.forEach((el, index) => {
            vm.columns.push({
              title:
                el.propertyHead != null && el.propertyHead.trim() !== ''
                  ? el.propertyHead
                  : el.propertyName,
              field: el.propertyName,
              props: el,
              list: [],
              width:
                (100 / (res.data.variantPropGroup.length + 1)).toFixed(2) + '%'
            })
            let _el = vm.columns[index + 1]
            if (el.controlType === 2) {
              getList(el.salePfPropertyId).then(list => {
                if (list) {
                  vm.$set(vm.columns, index + 1, { ..._el, list })
                }
              })
            }
          })

          // 提取子产品map数据
          variantDataList.forEach(el => {
            let _el = {
              sku: el.pltSku,
              variantProp: el.variantProp
            }
            vm.columns.forEach(subel => {
              if (subel.field !== 'sku') {
                let req = (el.data && el.data.Required) || {}
                _el[subel.field] = req[subel.field]
              }
            })
            varList.push(_el)
          })

          variantDataList.forEach(list => {
            let data = list.data
            if (!Object.keys(data).length) {
              for (const key in res.data.field) {
                if (res.data.field.hasOwnProperty(key)) {
                  if (!data[key]) {
                    data[key] = {}
                  }
                  const element = res.data.field[key]
                  for (const k in element) {
                    if (element.hasOwnProperty(k)) {
                      const el = element[k]
                      if (el.propertyGroupName && el.num) {
                        data[key][k] = new Array(el.num)
                      }
                    }
                  }
                }
              }
            }
          })

          if (!Object.keys(parentData).length) {
            for (const key in res.data.field) {
              if (res.data.field.hasOwnProperty(key)) {
                if (!parentData[key]) {
                  parentData[key] = {}
                }
                const element = res.data.field[key]
                for (const k in element) {
                  if (element.hasOwnProperty(k)) {
                    const el = element[k]
                    if (el.propertyGroupName && el.num) {
                      parentData[key][k] = new Array(el.num)
                    }
                  }
                }
              }
            }
          }
          // console.log(parentData);

          for (const key in parentData) {
            // debugger
            if (parentData.hasOwnProperty(key)) {
              const element = parentData[key]
              // 提取父产品map数据
              // if (key === 'Required') {
              //   vm.columns.forEach(el => {
              //     if (el.field !== 'sku') {
              //       parentObj[el.field] = element[el.field]
              //     } else {
              //       parentObj.sku = res.data.mappingFieldData.parent.pltSku
              //     }
              //   })
              //   vm.lists1.push(parentObj)
              // }

              for (let subKey in element) {
                if (element.hasOwnProperty(subKey)) {
                  const subEl = element[subKey]
                  if (subEl == null) {
                    continue
                  }
                  try {
                    // subKey 属性名 subEl 属性值 _el属性对象
                    let _el = res.data.field[key][subKey]
                    if (
                      Object.prototype.toString.call(_el) ===
                        '[object Array]' &&
                      Object.prototype.toString.call(subEl) !== '[object Array]'
                    ) {
                      // 分组
                      _el.forEach(fieldEl => {
                        fieldEl.value = subEl[fieldEl.propertyName]
                      })
                    }
                    if (
                      Object.prototype.toString.call(_el) !==
                        '[object Array]' &&
                      Object.prototype.toString.call(subEl) === '[object Array]'
                    ) {
                      _el = res.data.field[key][subKey]
                      let val = subEl.filter(el => el != null)
                      if (!val.length) {
                        val = [null]
                      }
                      _el.value = val
                    } else {
                      _el.value = subEl
                    }
                  } catch (error) {}
                }
              }
            }
          }

          // 合成map
          vm.lists1.push(...varList)
          // vm.$refs.table.refresh()

          // 审核提示
          vm.auditDataList = auditDataList

          vm.activeName = 2
          vm.secondData = res.data.field
          vm.descMap = res.data.descMap

          vm.mappingFieldData = res.data.mappingFieldData
          vm.variantDataList = variantDataList
        })
      })
    },
    setFeild(list) {
      let ret = {}
      list.forEach(element => {
        ret[element.propertyName] = {
          label: element.propertyName,
          value: element.value,
          // ruleExp: element.dataRanges,
          type: element.dataType,
          required: !!element.mustFlag
        }
      })

      return ret
    },
    getTemp(item, e, cb) {
      let siteCategoryId
      console.log(e)
      if (!cb) {
        item._temp = null
      }

      if (
        Object.prototype.toString.call(e) === '[object Object]' &&
        e.platformCategoryId != null
      ) {
        siteCategoryId = e.platformCategoryId
      }
      if (
        Object.prototype.toString.call(e) === '[object Array]' &&
        e.length > 0
      ) {
        siteCategoryId = e[e.length - 1]
      }

      if (!siteCategoryId) {
        return
      }
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_MODULE,
        data: {
          siteCategoryId
        }
      }).then(res => {
        console.log(res)
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        }
        item._select = res.data.categoryList
        if (cb) cb(res)

        // item._select = res.data
      })
    },
    closeLoading() {
      this.percent = 100
      setTimeout(() => {
        this.spinning = false
        clearInterval(this.timer)
        this.timer = null
        this.percent = 0
      }, 500)
    },
    openLoading() {
      this.percent = 0
      this.timer = setInterval(() => {
        if (this.percent >= 98) {
          if (this.spinning) {
            clearInterval(this.timer)
            this.timer = null
            return
          }
        }
        if (this.percent >= 100) {
          clearInterval(this.timer)
          this.percent = 0
          this.timer = null
          return
        }
        this.percent += 1
      }, 200)
    },
    getSiteList() {
      let vm = this
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_SITE_INFO,
        data: {
          parentFlag: this.isVariant ? 0 : 1,
          productPltDetailId: this.productPltDetailId
        }
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.siteList = res.data.siteList.map((el, index) => {
              let siteCategoryInfo = el.siteInfo.siteCategoryInfo
                ? el.siteInfo.siteCategoryInfo.split(',').map(el => +el)
                : [].map(el => +el)
              if (el.siteInfo.templateId != null) {
                vm.getTemp(el, siteCategoryInfo, res => {
                  vm.siteList[index]._select = res.data.categoryList
                })
              }
              return {
                ...el,
                _select: [],
                _val: el.siteInfo.siteCategoryInfo ? siteCategoryInfo : [],
                _temp: el.siteInfo.templateId
              }
            })

            this.productPltVariantDetailList =
              res.data.productPltVariantDetailList
            if (!vm.hasTemplate) {
              vm.closeLoading()
            }
          },
          () => {
            vm.closeLoading()
          },
          true
        )
      })
    }
  },
  watch: {
    hasTemplate: {
      immediate: true,
      handler(val) {
        // if (this.isReview) {
        //   return
        // }
        if (val) {
          setTimeout(() => {
            this.getFeild()
          })
        }
      }
    }
  },
  computed: {
    loadingText() {
      if (this.saveType === 1) {
        return '保存中'
      }
      if (this.saveType === 2) {
        return '提交中'
      }
      if (this.percent >= 75) {
        return '加载中'
      }
      if (this.percent >= 50) {
        return '装载数据'
      }
      if (this.percent >= 25) {
        return '初始化模板数据'
      }
      if (this.percent >= 0) {
        return '读取后端资源'
      }
    },
    hasTemplate() {
      if (this.siteList.length === 0) {
        return false
      }
      return this.siteList.every(el => el.siteInfo.templateId != null)
    },
    formObj() {
      let ret = {}
      this.tableData.forEach((el, index) => {
        ret[index] = JSON.parse(JSON.stringify(el))
      })
      return ret
    },
    showFirstNextBtn() {
      return !this.siteList.some(el => el._temp == null)
    },
    selectedTempId() {
      return this.siteList.filter(el => el._temp != null).map(el => el._temp)
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .__langForms_step {
    flex: none;
  }
  .__langForms_step_content {
    flex: auto;
    overflow: auto;
    height: 100%;
    .__main {
      padding-top: 20px;
      height: auto;
      overflow: auto;
      flex: auto;
      // box-sizing: content-box;
      display: flex;
      flex-direction: column;
      height: 100%;
      .__name_2_box {
        display: flex;
        height: 100%;
        flex-direction: column;
      }
      .__main_box {
        box-sizing: content-box;
        display: flex;
        flex-direction: column;
        overflow: auto;
        height: 100%;
        flex: auto;
      }
    }
  }
  .btn_wrapper {
    padding: 6px 0;
    margin: 0 auto;
    text-align: center;
    background: #fff;
    border-top: 1px solid #ddd;
    width: 100%;
    padding-top: 20px;
  }
}
</style>
<style lang='scss'>
.custom.ant-form-item > div {
  width: 100%;
}
.custom {
  &.ant-form-inline .ant-form-item-with-help {
    margin-bottom: 0 !important;
  }
}
.flex {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>

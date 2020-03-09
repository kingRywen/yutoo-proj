<template>
  <ElForm
    v-if="groupCode !== 7 && formData && formData.list && formData.list.length"
    class="editListing-wrapper"
    ref="form"
    size="small"
    label-width="180px"
    :model="formData"
  >
    <template v-for="(item, index) in formData.list">
      <template v-if="platFlag ? item.controlType !== 100 : true">
        <template v-if="item.controlType !== 100">
          <div v-if="!item.variantList" class="__hover_box">
            <ElFormItem
              :key="index"
              :label="item.propertyName"
              :required="!!item.mustFlag"
              :prop="`list.${index}.value`"
              :rules="getRules(item)"
            >
              <template slot="label">
                {{item.propertyName}}
                <ElTooltip v-if="item.propertyDesc && item.propertyDesc !== ''" placement="top">
                  <div slot="content" v-html="item.propertyDesc.replace('\n', '<br />')"></div>
                  <i class="el-icon-info"></i>
                </ElTooltip>
              </template>
              <FormInputs
                :remoteMethod="remoteMethod"
                :disabled="review"
                :item="item"
                :formData="data"
                v-model="item.value"
              />
            </ElFormItem>
          </div>
          <template v-else>
            <div class="__hover_box">
              <ElFormItem
                :key="index"
                :required="!!item.mustFlag"
                :label="item.propertyName"
                :prop="`list.${index}.value`"
                :rules="getRules(item)"
              >
                <template slot="label">
                  {{item.propertyName}}
                  <ElTooltip v-if="item.propertyDesc && item.propertyDesc !== ''" placement="top">
                    <div slot="content" v-html="item.propertyDesc.replace('\n', '<br />')"></div>
                    <i class="el-icon-info"></i>
                  </ElTooltip>
                </template>
                <FormInputs
                  :remoteMethod="remoteMethod"
                  :item="item"
                  :disabled="review"
                  :formData="data"
                  v-model="item.value"
                  @setSame="handleSetSame(item)"
                  @input="handleInput($event, item, index)"
                />
              </ElFormItem>
              <div class="drop-btns-wrapper">
                <ElButton
                  :disabled="false"
                  type="text"
                  :icon="`el-icon-caret-${item._show ? 'top' : 'bottom'}`"
                  @click="$set(item, '_show', !item._show)"
                ></ElButton>
              </div>
              <template v-if="item._show">
                <ElFormItem
                  :required="!!item.mustFlag"
                  v-for="(variant, i) in item.variantList"
                  :key="i  + '-'+ index"
                  :label="variant.variantSkuCustom"
                  :prop="`list.${index}.variantList.${i}.value`"
                  :rules="getRules(item, variant)"
                >
                  <FormInputs
                    :remoteMethod="remoteMethod"
                    :disabled="review"
                    :item="item"
                    :formData="data"
                    v-model="variant.value"
                  />
                </ElFormItem>
              </template>
            </div>
          </template>
        </template>
        <!-- 店铺编辑运费设置 -->
        <ElFormItem required label="运费设置" v-else>
          <FreightSet :formData="formData" :item="item"/>
        </ElFormItem>
      </template>
    </template>
  </ElForm>
  <!-- 变体特殊表格 -->
  <ElForm ref="form" size="small" v-else-if="formData.list[0]" :model="formData">
    <ElTable
      v-if="formData && formData.list && formData.list.length"
      size="small"
      stripe
      border
      :data="formData.list[0].variantList"
    >
      <ElTableColumn label="自定义SKU" prop="variantSkuCustom"></ElTableColumn>
      <ElTableColumn
        v-for="(item, index) in formData.list"
        :render-header="handleRenderHeader"
        :label="item.propertyName"
      >
        <template slot-scope="scope">
          <ElFormItem
            v-if="item && item.variantList && item.variantList[scope.$index]"
            :prop="`list.${index}.variantList.${scope.$index}.value`"
            :rules="getRules(item, item.variantList[scope.$index])"
          >
            <FormInputs
              :remoteMethod="remoteMethod"
              :disabled="review"
              :item="{...item, controlType: item.selectKey === 'Size-WISH' ? selectedSize.itemGroup ==='Custom Size' ? 1 : 18 : 18, multiple: false}"
              :formData="data"
              v-model="item.variantList[scope.$index].value"
            />
          </ElFormItem>
        </template>
      </ElTableColumn>
    </ElTable>
  </ElForm>
</template>

<script>
import bus from 'common/bus'
import FormInputs from '../FormInputs'
import apis from 'apis'
import axios from 'axios'
import { fetchData, showToast, handlerCode } from 'common/common'
import { getQueryString } from 'common/util'
import handleArray from '../common/handleArray'
import FreightSet from '../wish/FreightSet'
import { getRules } from './fetch'

export default {
  mixins: [handleArray],
  components: {
    FormInputs,
    FreightSet
  },
  props: {
    platFlag: {
      default: true
    },
    name: String,
    groupCode: Number,
    data: {
      default: () => ({})
    },
    // 是否审核状态
    review: {
      default: false
    },
    // 母变体
    parentFlag: {
      default: 1
    },
    // 平台id
    productPltDetailId: Number,
    platformId: Number,
    productType: Number,
    productId: Number
  },
  data() {
    return {
      loading: false,
      options: [],
      sizeKey: null
    }
  },
  computed: {
    formData() {
      if (!this.data[this.name]) {
        return {
          list: []
        }
      }
      return this.data[this.name]
    },
    selectedSize() {
      if (!this.sizeKey) {
        return {}
      } else {
        return this.options.find(el => this.sizeKey === el.salePfGlobaGroupId)
      }
    }
  },
  created() {
    this.getFields()
    if (this.groupCode === 7) {
      this.getKey('Size-WISH').then(res => {
        this.options = res.data.data
      })
    }
  },
  methods: {
    getRules(item, variant) {
      return getRules(item, variant)
    },
    handleRenderHeader(h, { column, $index }) {
      // console.log(column, $index)
      let { label } = column,
        text
      if (label === 'size') {
        text = (
          <el-select
            size="small"
            disabled={this.review}
            on-change={val => {
              this.sizeKey = val
            }}
            value={this.sizeKey}
          >
            {this.options.map(el => (
              <el-option
                label={el.itemGroup}
                value={el.salePfGlobaGroupId}
                key={el.salePfGlobaGroupId}
              />
            ))}
          </el-select>
        )
      }
      return (
        <div class="flex">
          <span>{label}</span>
          {text}
        </div>
      )
    },
    validate() {
      return Promise.resolve()
    },

    getSizeItem(itemKey, salePfGlobaGroupId, searchKey) {
      let data = {
        itemKey,
        salePfGlobaGroupId,
        searchKey: searchKey
      }
      return this.getList(data).then(res => {
        let el = []
        if (searchKey.trim() !== '') {
          el.push({
            itemValue: searchKey,
            salePfPropItemId: searchKey
          })
        }
        if (res && !res.data.data[0]) {
          return el
        }
        return el.concat(res.data.data)
      })
    },

    remoteMethod(searchKey, { selectKey, salePfPropertyId }) {
      if (selectKey === 'Size-WISH') {
        selectKey = this.selectedSize.itemGroup
        salePfPropertyId = this.selectedSize.salePfGlobaGroupId
        if (this.selectedSize.itemGroup == null) {
          showToast('warning', '请先选择size的类型')
          return Promise.resolve([])
        }
        return this.getSizeItem('Size-WISH', salePfPropertyId, searchKey)
      }

      return this.getKey(selectKey).then(res => {
        if (!res.data.data[0]) {
          return [
            {
              itemValue: searchKey,
              salePfPropItemId: searchKey
            }
          ]
        }
        let { itemKey, salePfGlobaGroupId } = res.data.data[0]
        let data = {
          itemKey,
          salePfGlobaGroupId,
          searchKey: searchKey
        }
        return this.getList(data).then(res => {
          let el = []
          if (searchKey.trim() !== '') {
            el.push({
              itemValue: searchKey,
              salePfPropItemId: searchKey
            })
          }
          if (!res.data.data[0]) {
            return el
          }
          return el.concat(res.data.data)
        })
      })
    },
    // 获取字段
    getKey(itemKey) {
      return fetchData({
        ...apis.salePfGlobaGroupGetGroupByKey,
        data: {
          itemKey
        }
      })
    },
    // 获取范围
    getList({ itemKey, salePfGlobaGroupId, searchKey }) {
      return fetchData({
        ...apis.salePfGlobaGroupItemGetItem,
        data: {
          itemKey,
          salePfGlobaGroupId,
          searchKey: searchKey.trim()
        }
      })
    },
    handleSetSame(item) {
      if (!item.variantList || !item.variantList.length) {
        return
      }
      // debugger
      item.variantList.forEach(el => {
        function isEmpty(e) {
          return e === '' || e == null
        }
        function sameArr(arr1, arr2) {
          let same = true
          arr1.forEach(el => {
            if (arr2.indexOf(el) === -1) {
              same = false
            }
          })
          return same
        }
        if (!Array.isArray(item.value)) {
          if (
            (isEmpty(item.value) && isEmpty(el.value)) ||
            item.value === el.value
          ) {
            this.$set(el, '_same', true)
          } else {
            this.$set(el, '_same', false)
          }
        } else {
          // array
          if (sameArr(item.value, el.value)) {
            this.$set(el, '_same', true)
          } else {
            this.$set(el, '_same', false)
          }
        }
      })
    },
    handleInput(val, item, index) {
      if (!item.variantList || !item.variantList.length) {
        return
      }
      item.variantList.forEach(el => {
        if (el._same) {
          el.value = val
        }
      })
    },
    // 保存
    save(params = {}) {
      if (!this.$refs.form) {
        return
      }
      return this.$refs.form.validate().then(() => {
        let api, data
        if (this.productPltDetailId != null) {
          // 平台保存接口
          api = 'PRODUCT_PLT_DETAIL_A_EN_SAVE'
          data = {
            groupCode: this.groupCode,
            platformId: this.platformId,
            parentFlag: this.parentFlag,
            productPltDetailId: this.productPltDetailId,
            dataList: this.setSpecialData(this.formData.list, 0, 1)
          }
        } else {
          // 店铺保存接口
          api = 'STORE_PRODUCT_EDIT'
          data = {
            groupCode: this.groupCode,
            productId: this.productId,
            platformId: this.platformId,
            productType: this.productType,
            dataList: this.setSpecialData(this.formData.list, 0, 1)
          }
        }
        bus.$emit('setLoading', true)
        return fetchData({
          ...apis[api],
          data
        }).then(res => {
          if (res.data.code !== 0) {
            return Promise.reject(res.data.msg)
          }
          handlerCode(
            res,
            () => {
              bus.$emit('setLoading', false)
              console.log('保存成功')
            },
            () => {
              bus.$emit('setLoading', false)
              // this.$message.error(res.data.msg)
              // showToast('error', res.data.msg)
            },
            true
          )
        })
      })
    },
    // 获取字段及编辑数据
    getFields() {
      if (this.groupCode == null) {
        return
      }
      let api,
        params = {},
        vm = this
      if (this.productPltDetailId) {
        // 平台编辑
        api = 'PRODUCT_PLT_DETAIL_DATA'
        params = {
          flag: this.review ? 1 : 0,
          parentFlag: this.parentFlag,
          platformId: this.platformId,
          productPltDetailId: this.productPltDetailId,
          groupCode: this.groupCode
        }
      } else {
        // 店铺编辑
        api = 'STORE_PRODUCT_INFO'
        params = {
          productId: this.productId,
          groupCode: this.groupCode,
          platformId: this.platformId,
          productType: this.productType
        }
      }
      bus.$emit('setLoading', true)
      return fetchData({
        ...apis[api],
        data: params
      }).then(res => {
        handlerCode(
          res,
          () => {
            vm.$emit('setData', {
              data:
                this.productPltDetailId == null
                  ? this.setSpecialData(res.data.rows.properties) || {}
                  : this.setSpecialData(res.data.rows.dataList)
            })
            bus.$emit('setLoading', false)
          },
          () => {
            bus.$emit('setLoading', false)
            // this.$message.error(res.data.msg)
            showToast('error', res.data.msg)
          },
          true
        )
      })
    }
  }
}
</script>

<style>
</style>

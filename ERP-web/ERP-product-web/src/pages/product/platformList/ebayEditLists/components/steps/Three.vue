<template>
  <div v-loading="loading">
    <!-- 公共字段 -->
    <ElForm class="editListing-wrapper" ref="form" size="small" label-width="180px" :model="data">
      <template v-for="(item, index) in data.commonData">
        <div v-if="!item.variantList" class="__hover_box">
          <ElFormItem
            :key="index"
            :required="!!item.mustFlag"
            :prop="`commonData.${index}.value`"
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
              :siteId="siteId"
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
              :prop="`commonData.${index}.value`"
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
                :siteId="siteId"
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
                type="text"
                :disabled="false"
                :icon="`el-icon-caret-${(item.nonPropertyFlag ? !item._show : item._show) ? 'top' : 'bottom'}`"
                @click="$set(item, '_show', !item._show)"
              ></ElButton>
            </div>
            <template v-if="item.nonPropertyFlag ? !item._show : item._show">
              <ElFormItem
                v-for="(variant, i) in item.variantList"
                :key="i  + '-'+ index"
                :label="variant.variantSkuCustom"
                :prop="`commonData.${index}.variantList.${i}.value`"
                :rules="getRules(item, variant)"
                :required="!!item.mustFlag"
              >
                <FormInputs
                  :remoteMethod="remoteMethod"
                  :siteId="siteId"
                  :disabled="review"
                  :item="{...item, ...variant}"
                  :formData="data"
                  v-model="variant.value"
                />
              </ElFormItem>
            </template>
          </div>
        </template>
      </template>
      <!-- 图片属性 -->
      <div v-if="productPltDetailId == null" class="__hover_box">
        <ElFormItem label="图片属性" prop="imgProp" :rules="[{ required: true, message: '请选择图片属性' }]">
          <ElSelect style="width:100%" size="small" v-model="data.imgProp">
            <ElOption v-for="item in imgPropList" :label="item.label" :value="item.value" :key="item.value"></ElOption>
          </ElSelect>
        </ElFormItem>
      </div>
    </ElForm>
    <!-- 第一个表格 -->
    <h3 style="margin-top:30px; font-weight:bold;font-size:16px;margin-bottom:10px">物品详情</h3>
    <el-form class="editListing-wrapper" size="small" ref="form1" :model="data" inline-message>
      <el-table stripe size="mini" border :data="data.firstFields">
        <el-table-column label width="70">
          <template slot-scope="scope">
            <ElButton
              :disabled="review"
              size="small"
              icon="el-icon-close"
              type="danger"
              plain
              @click="handleFirstDel(scope)"
            ></ElButton>
          </template>
        </el-table-column>
        <el-table-column label="名称" :render-header="renderFirstHeader" prop="propertyName" min-width="150">
          <template slot-scope="scope">
            <span v-if="!scope.row.custom">{{scope.row.propertyName}}</span>
            <el-form-item
              v-else
              :prop="`firstFields.${scope.$index}.propertyName`"
              :rules="[{required:true, message: '名称不能为空'}]"
            >
              <FormInputs
                style="width:50%;margin-top:18px"
                :remoteMethod="remoteMethod"
                :siteId="siteId"
                :disabled="review"
                :item="scope.row"
                :formData="data"
                v-model="scope.row.propertyName"
              />
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="值" :render-header="renderFirstHeader" min-width="200">
          <template slot-scope="scope">
            <el-form-item :prop="`firstFields.${scope.$index}.value`" :rules="[{required:true, message: '值不能为空'}]">
              <FormInputs
                style="width:50%;margin-top:18px"
                :remoteMethod="remoteMethod"
                :siteId="siteId"
                :disabled="review"
                :item="scope.row"
                :formData="data"
                v-model="scope.row.value"
              />
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- 第一个表格 未加项 -->
    <div class="btns">
      <ElButton
        :disabled="review"
        icon="el-icon-plus"
        :key="index"
        size="small"
        style="margin-top:10px"
        v-for="(item, index) in firstUnused"
        type="success"
        plain
        round
        @click="handleAddItem(item, index)"
      >{{item.propertyName}}</ElButton>
    </div>

    <div style="margin-bottom: 20px">
      <el-button :disabled="review" type="text" v-if="firstUnused.length" @click="addAll">都加进去</el-button>
      <el-button :disabled="review" type="text" @click="addNew">添加新项目细节</el-button>
      <el-button :disabled="review" type="text" @click="delAll">删除所有项目细节</el-button>
    </div>

    <!-- 第二个表格 -->
    <el-form class="editListing-wrapper" :disabled="review" size="small" :model="data" ref="form2">
      <el-table
        stripe
        size="mini"
        border
        :data="data.pltVariantsList"
        v-if="data.pltVariantsList && data.pltVariantsList[0]"
      >
        <el-table-column label="SKU" prop="variantSkuCustom"></el-table-column>
        <el-table-column
          :render-header="renderHeader"
          :prop="`${item.propertyName}$_$${!!item.mustFlag}$_$${item.salePfPropertyId}`"
          v-for="(item, index) in data.pltVariantsList[0].fields"
          :key="item.salePfPropertyId"
        >
          <template slot-scope="scope">
            <el-form-item
              style="margin-top:18px"
              :prop="`pltVariantsList.${scope.$index}.fields.${index}.value`"
              :rules="getRules(scope.row.fields[index])"
            >
              <FormInputs
                :remoteMethod="remoteMethod"
                :siteId="siteId"
                :item="{...scope.row.fields[index], selectDataList: data.pltVariantsList[0].fields[index].selectDataList}"
                :disabled="review"
                :formData="data"
                v-model="scope.row.fields[index].value"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :render-header="renderHeader" prop="edit" width="200px">
          <template slot-scope="scope">
            <el-button type="text" @click="delSku(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="sort" width="60px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-sort-up" @click="handleSortItem(scope.$index, 'up')"></el-button>
            <el-button
              style="margin-left: 0"
              type="text"
              icon="el-icon-sort-down"
              @click="handleSortItem(scope.$index, 'down')"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import FormInputs from '../FormInputs'
import apis from 'apis'
import axios from 'axios'
import { fetchData, showToast, handlerCode } from 'common/common'
import { getQueryString } from 'common/util'
import handleArray from '../common/handleArray'
import { getRules } from '../common/fetch'

export default {
  mixins: [handleArray],
  components: {
    FormInputs
  },
  props: {
    // data: {
    //   default: () => ({
    //     // 公用数据
    //     commonData: [],
    //     // 第一个表格展示数据
    //     firstFields: [],
    //     // 第二个表格数据
    //     pltVariantsList: []
    //   })
    // },
    // 站点ID
    siteId: Number,
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
      imgPropList: [],
      groupCode: 1,
      data: {
        // 公用数据
        commonData: [],
        // 第一个表格展示数据
        firstFields: [],
        // 第二个表格数据
        pltVariantsList: [],
        imgProp: ''
      },
      loading: false,
      fields: [],
      // 第一个表格未用数据
      firstUnused: [],
      // 第二个表格可选变体字段
      secondSelectFields: [],
      // 第二个表格已选变体字段
      secondSelected: [],
      // 选择时绑定的值
      selectVal: null,
      deletedSku: []
    }
  },
  created() {
    this.getFields()
    this.getImgPropList()
  },
  methods: {
    remoteMethod(searchKey, { salePfPropertyId, modelPropertyType }) {
      let data = {
        salePfPropertyId,
        modelPropertyType,
        searchKey
      }
      return this.getList(data).then(res => {
        let el = []
        if (searchKey.trim() !== '') {
          el.push({
            itemValue: searchKey,
            salePfPropItemId: searchKey
          })
        }
        if (!res.data.list || !res.data.list[0]) {
          return el
        }
        // return el.concat(res.data.data.map(el => ({salePfPropItemId: el.id, itemValue: el.name})))
        return el.concat(res.data.list)
      })
    },

    getImgPropList() {
      this._fetch('catePltTempPropSetGetSelectImagePropertyName', {
        templateId: 200000
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.imgPropList = res.data.data.map(el => ({
              label: el,
              value: el
            }))
          },
          () => {},
          true
        )
      })
    },

    submitImgProp() {
      let api = 'storeImgSetImgProperty'
      let data = {
        productType: this.productType,
        productId: this.productId,
        propertyName: this.data.imgProp
      }
      return this._fetch(api, data)
    },

    _fetch(api, data, link = false) {
      let isPlat = this.productPltDetailId != null
      return fetchData({
        ...apis[api],
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            if (link) {
              showToast('success', '提交成功')
              toParamUrl(this.listUrl)
            }
          },
          () => {
            showToast('error', res.data.msg)
          },
          true
        )
        return res
      })
    },

    // 获取范围
    getList({ salePfPropertyId, searchKey, modelPropertyType }) {
      return fetchData({
        ...apis.SALEPFPROPITEM_GETPROPITEM_1,
        data: {
          propertyId: salePfPropertyId,
          modelPropertyType: modelPropertyType,
          searchKey: searchKey.trim()
        }
      })
    },

    getRules(item, variant) {
      return getRules(item, variant)
    },
    renderFirstHeader(h, { column, $index }) {
      return <div class="table-required-col">{column.label}</div>
    },
    renderHeader(h, { column, $index }) {
      // console.log(column, $index);
      let name, mustFlag, salePfPropertyId
      if (column.property.indexOf('$_$') > -1) {
        let arrs = column.property.split('$_$')
        name = arrs[0]
        mustFlag = arrs[1] == 'true'
        salePfPropertyId = +arrs[2]
      }
      console.log(name, mustFlag)
      let label =
        column.property === 'edit' ? (
          <el-select
            size="small"
            value={this.selectVal}
            on-change={this.handleSelect}
            placeholder="请选择或输入自定义属性"
            filterable
            allow-create
          >
            {this.secondSelectFields.map(el => (
              <el-option
                label={el.propertyName}
                value={el.salePfPropertyId}
                key={el.salePfPropertyId}
              />
            ))}
          </el-select>
        ) : (
          <span>{name}</span>
        )

      let closeBtn =
        column.property === 'edit' ? null : mustFlag ? null : (
          <el-button
            on-click={this.delCol.bind(this, salePfPropertyId, name)}
            style="padding: 4px;margin-right: 6px;"
            icon="el-icon-close"
          />
        )
      return (
        <div>
          {closeBtn}
          {label}
        </div>
      )
    },
    // 删除列
    // 判断salePfPropertyId是否存在 ，如果存在，即删除的是系统内置的属性，如果不存在，删除的是用户自定义输入的属性
    delCol(salePfPropertyId, propertyName) {
      this.data.pltVariantsList.forEach((e, index) => {
        if (index === 0) {
          // 把删除的放入选择框中
          let deleteItem = e.fields.filter(el =>
            salePfPropertyId
              ? el.salePfPropertyId === salePfPropertyId
              : el.propertyName === propertyName
          )[0]
          deleteItem = { ...deleteItem }
          deleteItem.value = null
          this.secondSelectFields.push(deleteItem)
        }
        e.fields = e.fields.filter(el =>
          salePfPropertyId
            ? el.salePfPropertyId !== salePfPropertyId
            : el.propertyName !== propertyName
        )
      })
    },
    // 删除SKu
    delSku(index) {
      let current = this.data.pltVariantsList.splice(index, 1)
      // 清除要删除的sku的数据
      current[0].fields.forEach(el => {
        el.value = null
      })
      this.deletedSku.push(current[0])
    },

    // 排序sku
    handleSortItem(index, type) {
      let list = this.data.pltVariantsList,
        len = list.length
      let current = list.splice(index, 1),
        curIndex
      if (type === 'down') {
        curIndex = index + 1
      } else {
        curIndex = index - 1
      }
      if (curIndex < 0) {
        curIndex = len - 1
      }
      if (curIndex > len - 1) {
        curIndex = 0
      }
      list.splice(curIndex, 0, current[0])
    },

    handleSelect(val) {
      function getInputData(propertyName) {
        return {
          controlType: 1,
          dataType: 2,
          custom: true,
          propertyName,
          value: ''
        }
      }
      // let selectedEl = this.secondSelectFields.find(el => el.salePfPropertyId === val)
      let index = this.secondSelectFields.findIndex(
          el => el.salePfPropertyId === val
        ),
        el
      if (index === -1) {
        el = getInputData(val)
      } else {
        el = this.secondSelectFields.splice(index, 1)
        el = el[0]
      }

      // 必须每一行数据加入选择的field
      this.data.pltVariantsList.forEach(e => {
        e.fields.push({ ...el })
      })
      this.secondSelected.push({ ...el })
    },
    addNew() {
      this.data.firstFields.push({
        controlType: 1,
        dataType: 2,
        custom: true,
        propertyName: '',
        value: ''
      })
    },
    addAll() {
      this.data.firstFields.push(...this.firstUnused)
      this.firstUnused = []
    },
    delAll() {
      this.firstUnused = [...this.data.firstFields]
      this.data.firstFields = []
    },
    // handleSetSame(item) {

    //   if (!item.variantList || !item.variantList.length) {
    //     return
    //   }
    //   // debugger
    //   item.variantList.forEach(el => {
    //     if (el.value === item.value) {
    //       this.$set(el, '_same', true)
    //     } else {
    //       this.$set(el, '_same', false)
    //     }
    //   })
    // },
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
    save() {
      let { commonData, pltVariantsList, firstFields } = this.data
      let unselect = this.secondSelectFields,
        data,
        api
      // @,,#@ 处理controlType 为3 和17的控件值 处理成字符串
      commonData = this.setSpecialData(commonData, 0, 1)
      pltVariantsList = this.setSpecialData(pltVariantsList, 1, 1)
      firstFields = this.setSpecialData(firstFields, 0, 1)
      // 把删除的SKu合入传到后台
      pltVariantsList.concat(...this.deletedSku)
      // 把未选择的属性值合入传到后台 如果是平台编辑，不需要合并未选择的值
      if (this.productPltDetailId == null) {
        pltVariantsList.forEach(el => {
          el.fields.push(...unselect)
        })
      }

      if (this.productPltDetailId != null) {
        // 平台保存接口
        api = 'PRODUCT_PLT_DETAIL_A_EN_SAVE'
        data = {
          groupCode: this.groupCode,
          platformId: this.platformId,
          parentFlag: this.parentFlag,
          productPltDetailId: this.productPltDetailId,
          dataList: commonData,
          pltFieldList: firstFields,
          pltVariantsFieldList: pltVariantsList
        }
      } else {
        // 店铺保存接口
        api = 'STORE_PRODUCT_EDIT'
        data = {
          productId: this.productId,
          groupCode: this.groupCode,
          productType: this.productType,
          platformId: this.platformId,
          dataList: commonData,
          pltFieldList: firstFields,
          pltVariantsFieldList: pltVariantsList
        }
      }
      let p1 = fetchData({
        ...apis[api],
        data
      }).then(res => {
        if (res.data.code !== 0) {
          return Promise.reject(res.data.msg)
        }
        handlerCode(
          res,
          () => {
            console.log('保存成功')
          },
          () => {
            // this.message.error(res.data.msg)
          },
          true
        )
      })
      let p = []
      p.push(p1)
      if (this.productPltDetailId == null) {
        p.push(this.submitImgProp())
      }
      return Promise.all(p)
    },
    handleFirstDel(scope) {
      let del = this.data.firstFields.splice(scope.$index, 1)
      if (del.propertyName == null || del.propertyName === '') {
        return
      }
      this.firstUnused.push(...del)
    },
    handleAddItem(item, index) {
      let del = this.firstUnused.splice(index, 1)
      this.data.firstFields.push(...del)
    },
    validate() {
      let forms = ['form', 'form1', 'form2']
      return Promise.all(forms.map(form => this.$refs[form].validate()))
    },
    // getFields() {

    // },
    // 获取字段及编辑数据
    getFields() {
      let api,
        params = {}
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
      this.loading = true
      return fetchData({
        ...apis[api],
        data: params
      }).then(res => {
        handlerCode(
          res,
          () => {
            let { dataList, pltFieldList, pltVariantsFieldList } =
              this.productPltDetailId == null
                ? res.data.rows.properties
                : res.data.rows
            // 特殊处理，比如把controlType 3 17的控件类型的值还原成数组
            dataList = this.setSpecialData(dataList)
            pltFieldList = this.setSpecialData(pltFieldList)
            pltVariantsFieldList = this.setSpecialData(pltVariantsFieldList, 1)
            let firstDefaultData = pltFieldList.filter(el => el.showFlag !== 0)
            this.firstUnused = pltFieldList.filter(el => el.showFlag === 0)
            this.data.commonData = dataList
            this.data.firstFields = firstDefaultData
            this.data.pltVariantsList = pltVariantsFieldList
            this.data.pltVariantsList = pltVariantsFieldList.map(
              (el, index) => {
                // 处理哪些数据需要显示， 哪些数据不需要显示，不需要显示的放在选择框中供用户选择
                if (index === 0) {
                  el.fields.forEach(_el => {
                    if (!_el.showFlag) {
                      this.secondSelectFields.push(_el)
                    }
                  })
                }

                // 不需要显示的 去掉
                el.fields = el.fields.filter(el => el.showFlag)
                return el
              }
            )
          
            // 店铺产品获取ebay图片属性并设置值
            if (this.productPltDetailId == null) {
              this.getEbayImgProp()
            }
            

            this.loading = false
          },
          () => {
            this.loading = false
            showToast('error', res.data.msg)
          },
          true
        )
      })
    },
    getEbayImgProp() {
      fetchData({
        ...apis.STORE_IMG_GET_IMG_PROPERTY,
        data:{
          productId: this.productId,
          productType: this.productType,
        }
      }).then(res => {
        handlerCode(
          res,
          () => {
            console.log(this.data);
            // this.$set(this.data, 'imgProp', res.data.propertyName)
            this.data.imgProp = res.data.propertyName
          },
          () => {
          },
          true
        )
      })
    }
  }
}
</script>

<style lang="scss">
.table-required-col {
  &:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
</style>


<template>
  <!-- 分组 -->
  <v-col v-if="isGroup" span="22">
    <v-form-item
      v-if="item[0]['propertyGroupName'] == '强电插头'"
      :label="variant ? variant.skuCustom : '强电插头'"
      :label-col="{span:3}"
      :wrapper-col="{span:19}"
      :required="required"
    >
      <!-- {{variant}} -->
      <template>
        <div v-for="(i, index) in item" :key="i.displayKey" class="radio-fix-group tips_box">
          <v-form-item v-if="i.inputType ==5" :prop="i.displayKey" :required="required">
            <v-switch
              v-model="groupData.plugFlag"
              :true-value="1"
              :false-value="0"
              :disabled="disabled"
              @change="$emit('input', {e:$event, index:index })"
            ></v-switch>
            <!-- {{groupData}} -->
          </v-form-item>
          <v-form-item
            v-else-if="i.inputType == 3 && groupData.plugFlag"
            :prop="i.displayKey"
            class="margin-top-20 margin-bottom-10"
            :required="required"
          >
            <el-radio-group
              class="div-radio-group"
              v-model="groupData.plugId"
              @change="$emit('input', {e:$event, index:index })"
            >
              <el-radio v-for="opt in options.plugTypeList" :label="opt.key">{{opt.value}}</el-radio>
            </el-radio-group>
          </v-form-item>
          <div class="tips" v-if="historyText && historyText[i.displayKey]">
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">
                旧值:
                <span style="color:red">{{historyText[i.displayKey]}}</span>
              </div>
              <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
            </el-tooltip>
          </div>
        </div>
      </template>
    </v-form-item>

    <v-row :gutter="10" v-else>
      <v-col :span="parseInt(24 / item.length)" v-for="(i, index) in item">
        <v-form-item
          :label="index ==0 ? item[0]['propertyGroupName'] : null"
          :label-col="item.length === 3 ? {span:index ==0 ? 9 : null} : {span: 6}"
          :wrapper-col="item.length === 3 ? {span:index ==0 ? 13 : 18} : {span: index ==0 ? 14: 20}"
          :prop="i.displayKey"
          :rules="required ? checkNum : null"
          :required="required"
          class="tips_box"
        >
          <v-input
            v-model.number="groupData[i.displayKey]"
            maxlength="11"
            :disabled="disabled"
            @input="$emit('input', {e:$event, index:index })"
          >
            <span slot="after">{{i.propertyName}}</span>
          </v-input>
          <!-- <v-input
            v-else
            :value="ruleForm[i.displayKey]"
            :disabled="disabled"
            @input="val => ($emit('input', {e:val, index:index }), ruleForm[i.displayKey]=  val)"
          >
            <span slot="after">{{i.propertyName}}</span>
          </v-input>-->
          <div class="tips" v-if="historyText && historyText[i.displayKey]">
            <el-tooltip class="item" effect="light" placement="top">
              <div slot="content">
                旧值:
                <span style="color:red">{{historyText[i.displayKey]}}</span>
              </div>
              <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
            </el-tooltip>
          </div>
        </v-form-item>
      </v-col>
    </v-row>
  </v-col>
  <!-- 不分组 -->
  <v-col v-else :span="span || inputType == 4 || prop === 'element' || prop === 'brand'? '22' : '12'">
    <!-- 输入类型 -->
    <v-form-item
      :label="label"
      v-if="inputType == 1 && prop !== 'element'"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="prop"
      :required="required"
      :rules="$attrs.rules"
      class="tips_box"
    >
      <!-- {{$attrs.rules}} -{{typeof value}} - {{dateType}} -->
      <!-- 参考网站链接 -->
      <v-row :gutter="60" v-if="dateType !== 1 && prop == 'referenceLink'">
        <v-col span="24">
          <v-input :value="value" @input="$emit('input', $event)" :disabled="disabled">
            <a slot="after" @click="openLink">打开参考链接</a>
          </v-input>
        </v-col>
      </v-row>

      <!-- 文字输入框 -->
      <v-input
        v-else-if="dateType !== 1"
        :disabled="disabled || prop === 'sku' || (prop === 'skuCustom' && !$attrs.parent)"
        :maxlength="max + ''"
        :minlength="min + ''"
        :value="value"
        @input="$emit('input', $event)"
      ></v-input>

      <!-- 数字输入框 -->
      <v-input-number
        v-else
        :min="min"
        :max="max"
        size="large"
        :disabled="disabled"
        style="width:100%"
        :value="value || ''"
        @change="$emit('input', $event)"
        @input="$emit('input', $event)"
      ></v-input-number>

      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>

    <!-- 单选下拉 -->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 2"
      :label-col="prop === 'brand' ?{span:3}:labelcol"
      :wrapper-col="prop === 'brand' ?{span:21}:wrappercol"
      :prop="prop == 'sourceType' ? null : prop"
      :required="required"
      class="tips_box"
    >
      <!-- 开发人员选择框 -->
      <v-row :gutter="12" v-if="prop == 'developId'">
        <v-col span="18">
          <v-select
            size="lg"
            ref="singleSel"
            :disabled="disabled"
            label="nickName"
            clue="userId"
            style="width: 100%;"
            :data="datas"
            :value="value"
            @input="$emit('input', $event)"
          ></v-select>
        </v-col>
        <v-col span="6">
          <v-button type="primary" @click="addPerson(0)" :disabled="disabled">添加</v-button>
        </v-col>
      </v-row>

      <!-- 采购人员选择框 -->
      <v-row v-else-if="prop == 'purchaseId'" :gutter="12">
        <v-col span="18">
          <v-select
            size="lg"
            :disabled="disabled"
            label="nickName"
            clue="userId"
            style="width: 100%;"
            :data="datas"
            ref="singleSel"
            :value="value"
            @input="$emit('input', $event)"
          ></v-select>
        </v-col>
        <v-col span="6">
          <v-button type="primary" @click="addPerson(1)" :disabled="disabled">添加</v-button>
        </v-col>
      </v-row>

      <!-- 产品单位 -->
      <v-select
        size="lg"
        :disabled="disabled"
        label="value"
        clue="value"
        v-else-if="prop == 'unit'"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>

      <!-- 物流属性 -->
      <v-select
        size="lg"
        :disabled="disabled"
        v-else-if="prop == 'logisticType'"
        label="value"
        clue="value"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>

      <!-- 产品类型 -->
      <v-select
        size="lg"
        :disabled="disabled || value == 3"
        v-else-if="prop == 'productType'"
        label="value"
        clue="key"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>

      <!-- 产品来源 -->
      <v-select
        size="lg"
        :disabled="disabled"
        v-else-if="prop == 'sourceType'"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value || 1"
        @input="$emit('input', $event)"
        disabled
      ></v-select>

      <!-- 推荐指数 -->
      <v-rate
        v-else-if="prop == 'recommendLevel'"
        :disabled="disabled"
        :value="~~value"
        @change="$emit('input', $event)"
      ></v-rate>

      <!-- 产品品牌 -->
      <v-select
        size="lg"
        :disabled="disabled"
        v-else-if="prop == 'productType'"
        label="value"
        clue="key"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>

      <!-- 产品侵权风险 -->
      <v-select
        size="lg"
        :disabled="disabled"
        v-else-if="prop == 'riskType'"
        label="value"
        clue="value"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>

      <!-- 选择品牌 -->
      <v-row v-else-if="prop == 'brand'" :gutter="12">
        <v-col span="18">
          <v-select
            size="lg"
            :disabled="disabled"
            label="brandNameZh"
            clue="productBrandId"
            style="width: 100%;"
            :data="datas"
            ref="singleSel"
            :value="value"
            @input="$emit('input', $event)"
          ></v-select>
        </v-col>
        <v-col span="6">
          <v-button type="primary" @click="openAddBrand" :disabled="disabled">添加</v-button>
        </v-col>
      </v-row>

      <!-- 发货仓库 -->
      <v-select
        size="lg"
        :disabled="disabled"
        v-else-if="prop == 'warehouseId'"
        clue="warehouseId"
        label="warehouseName"
        style="width: 100%;"
        :data="datas"
        ref="singleSel"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>

      <!-- 统一换成switch -->
      <v-switch
        :disabled="disabled"
        v-else-if="prop == 'shareFlag' || prop == 'variantFlag'"
        :true-value="1"
        :false-value="0"
        v-model="checked"
        :value="value"
        @input="$emit('input', $event)"
      ></v-switch>

      <!-- 默认 -->
      <v-select
        :disabled="disabled"
        size="lg"
        v-else
        style="width: 100%;"
        :data="[{label: 'mock', value:0}]"
        :value="value"
        @input="$emit('input', $event)"
      ></v-select>
      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>

    <!-- 多选框 -->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 3"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="prop"
      :required="required"
    >
      <v-checkbox-group
        :disabled="disabled"
        v-if="prop == 'platformIds'"
        :data="activePlatform"
        :value="checkVal"
        @change="$emit('input', $event)"
      ></v-checkbox-group>
      <v-checkbox-group
        :disabled="disabled"
        v-else-if="prop == 'plugId'"
        :data="options['plugTypeList']"
        :value="value"
        @change="$emit('input', $event)"
        label="value"
        keyField="key"
      ></v-checkbox-group>
      <v-checkbox-group
        :disabled="disabled"
        v-else
        :data="[{label: '暂无数据', value:0}]"
        :value="value"
        @change="$emit('input', $event)"
      ></v-checkbox-group>
      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>
    <!-- 多行文本输入框-->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 4"
      :label-col="{span:3}"
      :wrapper-col="{span:21}"
      :prop="prop"
      :required="required"
    >
      <v-input
        :disabled="disabled"
        type="textarea"
        :value="value"
        @input="$emit('input', $event)"
        :autosize="{ minRows: 6, maxRows: 12 }"
      ></v-input>
      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>
    <!-- 单选按键-->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 5"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="prop"
      :required="required"
    >
      <!-- 强电插头选择 -->
      <v-switch
        :disabled="disabled"
        v-if="prop == 'plugFlag'"
        :value="value"
        @input="$emit('input', $event)"
        :true-value="1"
        :false-value="0"
      ></v-switch>

      <!-- 是否支持海外仓直采 -->
      <v-switch
        :disabled="disabled"
        v-if="prop == 'overseaFlag' || prop == 'photoFlag'"
        :value="value"
        @input="$emit('input', $event)"
        :true-value="1"
        :false-value="0"
      ></v-switch>

      <el-radio-group v-else v-model="value">
        <el-radio v-for="opt in []" :label="opt.key">{{opt.value}}</el-radio>
      </el-radio-group>
      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>
    <!-- 日期-->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 6"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="prop"
      :required="required"
    >
      <v-date-picker
        :disabled-date="disabledDate"
        :disabled="disabled"
        :value="value"
        @change="$emit('input', $event)"
        size="lg"
      ></v-date-picker>
      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>
    <!-- 富文本-->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 7"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="prop"
      :required="required"
    >
      <Editor
        :disabled="disabled"
        :defaultMsg="value"
        :config="config"
        init-id="editor"
        @input="$emit('input', $refs.ue.getUEContent())"
        ref="ue"
      />
      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" placement="top">
          <div slot="content">
            旧值:
            <span style="color:red">{{historyText}}</span>
          </div>
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>
    <!-- 颜色类型-->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 9"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="prop"
      :required="required"
    >
      <v-input
        :disabled="disabled"
        v-on="$listeners"
        :value="value"
        @input="$emit('input', $event)"
        style="display:none"
      ></v-input>
      <v-button :disabled="disabled" @click="openColor">选择类目</v-button>
    </v-form-item>
    <!-- 产品类目类型-->
    <v-form-item
      :rules="$attrs.rules"
      :label="label"
      v-else-if="inputType == 10"
      :label-col="labelcol"
      :wrapper-col="wrappercol"
      :prop="$attrs.cate && $attrs.cate.categoryDetail ? null : prop"
      :required="$attrs.cate && $attrs.cate.categoryDetail ? false : required"
    >
      <div v-if="item.displayKey === 'categoryId'">
        <v-input
          :disabled="disabled"
          v-on="$listeners"
          :value="$attrs.cate && $attrs.cate.categoryId"
          @input="$emit('input', $event)"
          style="display:none"
        ></v-input>
        {{$attrs.cate && $attrs.cate.categoryDetail ? $attrs.cate.categoryDetail.replace(/\;/gi, ' > ') : cateDetail ? cateDetail.replace(/\;/gi, ' > ') : null }}
        <div class="tips" v-if="historyText">
          <el-tooltip class="item" effect="light" placement="top">
            <div slot="content">
              旧值:
              <span style="color:red">{{historyText}}</span>
            </div>
            <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
          </el-tooltip>
        </div>
      </div>
      <div v-else>
        <v-row :gutter="12">
          <v-col :span="18">
            <!-- {{name}} -->
            <v-input :disabled="true" v-on="$listeners" :value="name" @input="$emit('input', $event)"></v-input>
          </v-col>
          <v-col :span="6">
            <v-button :disabled="disabled" @click="open">选择类目</v-button>
          </v-col>
        </v-row>
        <div class="tips" v-if="historyText">
          <el-tooltip class="item" effect="light" placement="top">
            <div slot="content">
              旧值:
              <span style="color:red">{{historyText}}</span>
            </div>
            <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
          </el-tooltip>
        </div>
      </div>
    </v-form-item>

    <!-- 产品成分 -->
    <v-form-item
      :label="label"
      v-else-if="inputType == 1 && prop === 'element'"
      :label-col="{span:3}"
      :wrapper-col="{span:21}"
      :prop="prop"
      :required="required"
      :rules="$attrs.rules"
      class="tips_box"
    >
      <div class="element" v-for="(i, index) in elementArr">
        <v-input
          :disabled="disabled"
          maxlength="100"
          :placeholder="item.propertyDesc"
          :value="elementArr[index]"
          @input="handleElement($event, index)"
        ></v-input>
        <div class="btn">
          <v-button :disabled="disabled" @click="addElement(index)">+</v-button>
          <v-button :disabled="disabled" @click="delElement(index)" v-if="index !== 0">-</v-button>
        </div>
      </div>

      <div class="tips" v-if="historyText">
        <el-tooltip class="item" effect="light" :content="historyText" placement="top">
          <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
        </el-tooltip>
      </div>
    </v-form-item>
  </v-col>
</template>

<script>
import Vue from 'vue'
import {
  fetchData,
  getVue,
  showDialog,
  showToast,
  handlerCode
} from 'common/common'
import { Radio, RadioGroup, Tooltip } from 'element-ui'
import Editor from 'components/base/editor.vue'
import { isArray, getQueryString } from 'common/util'
import isURL from 'is-url'
import apis from 'apis'
import {
  YT_PRODUCT_COLUMNS,
  COLOR_PICKER
} from '../../pages/product/componentName'

Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Tooltip)

export default {
  inheritAttrs: false,
  components: {
    Editor
  },
  props: [
    'data',
    'group',
    'options',
    'value',
    'cateDetail',
    'label',
    'labelcol',
    'wrappercol',
    'disabled',
    'span',
    'propItem',
    'inputType',
    'dateType',
    'item',
    'edit',
    'ruleForm',
    'history',
    'variant',
    'cateSecondDetail',
    'review'
  ],
  created() {
    if (this.cateDetail) {
      this.name = this.cateDetail.split(';').join(' > ')
    }
    if (this.cateSecondDetail) {
      this.name = this.cateSecondDetail.replace(/&gt;/gi, ' > ')
    }

    if (this.item && this.item.requireFlag) {
      this.required = true
    }
    if (this.isGroup) {
      if (this.item && this.item[0].requireFlag) {
        this.required = true
      }
    }
    if (getQueryString('variant')) {
      this.isVariant = true
    }

    if (this.item.displayKey === 'platformIds') {
      fetchData({ ...apis.PLATFORM_LIST_ALL_ACTIVATE_PLATFORM }).then(res => {
        if (res.data.code === 0) {
          this.activePlatform = res.data.rows.map(el => ({
            label: el.name,
            value: el.platformId
          }))
        }
      })
    }
  },
  data() {
    let checkZero = (rule, value, cb) => {
      console.log(value)
      if (!Number.isFinite(value)) {
        cb(new Error('请输入数字'))
      }
      if (value <= 0) {
        cb(new Error('请输入正数'))
      }
      cb()
    }

    return {
      activePlatform: [],
      checkNum: [
        {
          type: 'number',
          message: '请输入数字'
        },
        {
          validator: checkZero
        }
      ],
      isVariant: false,
      // 分组数据存储
      groupData: {},
      name: '',
      // 富文本配置
      defaultMsg: '',
      checked: 0,
      checkVal: [],
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      required: false
    }
  },
  filters: {
    formatPlug(val) {
      if (!val) {
        return []
      }
      let ret = []
      val.forEach(el => {
        ret.push({
          value: +el.key,
          text: el.value
        })
      })
      return ret
    }
  },
  methods: {
    handleElement(val, index) {
      let _arr = JSON.parse(JSON.stringify(this.elementArr))
      _arr[index] = val
      this.elementArr = _arr
    },

    addElement(index) {
      if (this.elementArr.length > 9) {
        showToast('warning', '您只能添加最多10个产品成分')
        return
      }
      let _arr = JSON.parse(JSON.stringify(this.elementArr))
      _arr.splice(index + 1, 0, '')
      this.elementArr = _arr
    },

    delElement(index) {
      let _arr = JSON.parse(JSON.stringify(this.elementArr))
      _arr.splice(index, 1)
      this.elementArr = _arr
    },
    openAddBrand() {
      let vm = this
      showDialog(
        'AddBrand',
        { title: '添加品牌', width: 1200 },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr, arrs, name) {
            fetchData({
              ...apis.PRODUCT_BRAND_GETBRANDNAMELIST
            }).then(res => {
              if (res.data.code === 0) {
                const options = {
                  ...vm.options,
                  brandList: res.data.rows
                }
                vm.$emit('update:options', options)
              }
            })
          }
        }
      )
    },
    addPerson(type) {
      let vm = this
      showDialog(
        'AddPersonnel',
        { title: '添加', width: 800 },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(childVm) {
            const { ruleForm: data } = childVm
            childVm.cancel()
            if (data.roleType.indexOf(1) > -1) {
              fetchData({
                ...apis.PRODUCT_DEVELOP_USER_LIST,
                method: 'get'
              }).then(res => {
                if (res.data.code === 0) {
                  const options = {
                    ...vm.options,
                    developList: res.data.rows
                  }
                  vm.$emit('update:options', options)
                }
              })
            }
            if (data.roleType.indexOf(2) > -1) {
              fetchData({
                ...apis.PRODUCT_PURCHASE_USER_LIST,
                method: 'get'
              }).then(res => {
                if (res.data.code === 0) {
                  const options = {
                    ...vm.options,
                    purchaseList: res.data.rows
                  }
                  vm.$emit('update:options', options)
                }
              })
            }
          }
        }
      )
    },
    disabledDate(current) {
      return current && current.valueOf() < Date.now()
    },
    // 打开参考链接
    openLink() {
      if (isURL(this.value)) {
        window.open(this.value)
      } else {
        showToast('error', '请填写正确的url')
      }
    },

    open() {
      let vm = this
      showDialog(
        YT_PRODUCT_COLUMNS,
        { title: '请选择产品类目' },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr, arrs, name) {
            console.log(arr, arrs, name)
            if (arr.length <= 0) {
              getVue().$message.error('请选择一个类目')
              return true
            }
            vm.name = name.join(' > ')
            // vm.$emit("input", arr.parentId);
            vm.$emit('set-input', { arr, arrs, name })
          }
        }
      )
    },
    openColor() {
      let vm = this
      showDialog(
        COLOR_PICKER,
        { title: '请选择颜色' },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr) {
            console.log(arr)
            if (arr.length <= 0) {
              getVue().$message.error('请选择一个颜色')
              return true
            }
            vm.$emit('input', arr)
          }
        }
      )
    },
    blur() {
      this.$emit('blur')
    }
  },
  computed: {
    elementArr: {
      get() {
        if (this.prop !== 'element') {
          return
        }

        if (!this.value) {
          return ['']
        }
        return JSON.parse(this.value)
      },
      set(val) {
        if (this.prop !== 'element') {
          return
        }
        let _arr = JSON.parse(JSON.stringify(val))
        // _arr = _arr.filter(el => el !== "");
        this.$emit('input', JSON.stringify(_arr))
      }
    },
    historyText() {
      if (!this.history && typeof this.history !== 'array') {
        return
      }
      const el =
        this.history &&
        this.history.find &&
        this.history.find(el => el.key === this.propItem)
      this.isGroup &&
        console.log(this.groupData, this.history, this.propItem, el)
      if (this.isGroup) {
        let data = {}
        for (const key in this.groupData) {
          if (this.groupData.hasOwnProperty(key)) {
            const element = this.groupData[key]
            const _el =
              this.history &&
              this.history.find &&
              this.history.find(el => el.key === key)
            data[key] = _el && _el.value
          }
        }
        return data
      }
      return el && el.value
    },
    prop() {
      return this.variant ? this.propItem.split('_')[1] : this.propItem
    },
    datas() {
      let list = []
      switch (this.prop) {
        case 'developId':
          list = this.options['developList']
          break
        case 'purchaseId':
          list = this.options['purchaseList']
          break
        case 'unit':
          list = this.options['unitList']
          break
        case 'logisticType':
          list = this.options['logisticList']
          break
        case 'productType':
          if (!this.options['productTypeList']) {
            return
          }
          list = this.options['productTypeList'].map(el => {
            if (el.key == 3) {
              el.disabled = true
            }
            return el
          })
          break
        case 'sourceType':
          list = [
            { label: '新样品', value: 1 },
            { label: '销售提报', value: 2 },
            { label: '平台采集', value: 3 },
            { label: '供应商审核', value: 4 }
          ]
          break
        case 'riskType':
          list = this.options['productRiskList']
          break
        case 'brand':
          list = this.options['brandList']
          break
        case 'warehouseId':
          list = this.options['warehouseList']
          break

        default:
          break
      }
      return list
    },

    isGroup() {
      return this.item.length
    },
    htType() {
      switch (this.dateType) {
        case 1:
          return 'int'
          break
        case 2:
          return 'string'
          break
        case 3:
          return 'date'
          break
        case 4:
          return 'boolean'
          break
        case 5:
          return 'double'
          break
        case 6:
          return 'bigdecimal'
          break

        default:
          return 'string'
          break
      }
    },
    change(val) {
      console.log(val)
    },
    min() {
      if (!this.item.rule) {
        return null
      }
      if (this.dateType === 1) {
        let el = this.item.rule.find(el => el.type === 2)
        if (el) {
          return el.min
        } else {
          return null
        }
      } else if (this.dateType === 2) {
        let el = this.item.rule.find(el => el.type === 1)
        if (el) {
          return el.min
        } else {
          return null
        }
      } else {
        return null
      }
    },
    max() {
      if (!this.item.rule) {
        return null
      }
      if (this.dateType === 1) {
        let el = this.item.rule.find(el => el.type === 2)
        if (el) {
          return el.max
        } else {
          return null
        }
      } else if (this.dateType === 2) {
        let el = this.item.rule.find(el => el.type === 1)
        if (el) {
          return el.max
        } else {
          return null
        }
      } else {
        return null
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.$set(this.groupData, 'plugFlag', val.plugFlag)
          this.$set(this.groupData, 'plugId', val.plugId)
        }
      }
    },
    groupData: {
      deep: true,
      handler: function(val) {
        if (!val.plug_flag) {
          delete val.plug_id
        }
        this.$emit('selectmore', val)
        // this.$emit("input", {index: , e: val});
      }
    },
    value: {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }

        this.checked = val

        let arr

        if (this.prop == 'platformIds') {
          if (isArray(val)) {
            this.checkVal = val
          } else {
            arr = val.split(';').map(el => +el)
            this.checkVal = arr
          }
        }
      }
    },
    ruleForm: {
      immediate: true,
      handler(val) {
        if (this.variant) {
          return
        }
        if (this.item.length && this.edit) {
          this.item.forEach(el => {
            let value
            if (!val) {
              return
            }
            if (val[el.displayKey] == null) {
              value = null
            } else {
              value = val[el.displayKey]
            }
            if (el.displayKey === 'plugId') {
              Vue.set(this.groupData, el.displayKey, value || 1)
            } else {
              Vue.set(this.groupData, el.displayKey, value)
            }
          })
          console.log(this.groupData)
        }
      }
    }
  }
}
</script>

<style lang="less">
.radio-fix-group {
  .el-radio {
    line-height: 3.2;
  }
}
</style>
<style scoped lang="less">
.element {
  display: flex;
  margin-bottom: 10px;
  .btn {
    display: flex;
    width: 120px;
    button {
      margin-left: 10px;
    }
  }
}
</style>


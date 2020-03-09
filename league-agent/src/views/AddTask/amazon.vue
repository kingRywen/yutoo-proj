<template>
  <div v-if="showEdit">
    <el-alert type="warning" show-icon class="mt20" v-if="showMsg" :title="showMsg"></el-alert>
    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="基本信息">
      <new-form ref="form1" :disabled="view" label-width="140px" :form-schema="base" :value="value1"></new-form>
    </WidgetCardWrapper>

    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="买家偏好" v-if="isAmazon">
      <new-form ref="form2" :disabled="view" label-width="140px" :form-schema="love" :value="value1"></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper
      :isCollapse="false"
      :defaultHide="false"
      title="任务信息"
      v-if="value1.platformSiteId && value1.platformSiteId.length"
    >
      <new-form ref="form3" :disabled="view" label-width="140px" :form-schema="task" :value="value1"></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="搜索关键词">
      <new-form ref="form4" :disabled="view" label-width="140px" :form-schema="taskKeyword" :value="value1"></new-form>
    </WidgetCardWrapper>
    <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="产品信息">
      <new-form ref="form5" :disabled="view" label-width="140px" :form-schema="productInfo" :value="value1"></new-form>
    </WidgetCardWrapper>
    <template v-if="value1.relHandle">
      <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="关联产品信息">
        <new-form ref="form6" :disabled="view" label-width="140px" :form-schema="relateInfo" :value="value1"></new-form>
      </WidgetCardWrapper>
    </template>
    <template v-if="value1.taskTypeId == 7">
      <WidgetCardWrapper :isCollapse="false" :defaultHide="false" title="评价点Helpful参数">
        <new-form ref="form7" :disabled="view" label-width="140px" :form-schema="helpful" :value="value1"></new-form>
      </WidgetCardWrapper>
    </template>
    <template v-if="showReview">
      <WidgetCardWrapper key="review" :isCollapse="false" :defaultHide="false" title="Review评价内容">
        <div v-if="taskNum">
          <new-form ref="form8" :disabled="view" label-width="140px" :form-schema="review" :value="value1"></new-form>

          <ElTabs v-if="value1.reviewSupplyType == 0" style="margin:0 40px" v-model="activeTab1">
            <ElTabPane label="填写" name="first">
              <el-form
                ref="form9"
                :disabled="view"
                style="margin-top:10px"
                label-width="100px"
                size="small"
                :model="reviewData"
              >
                <ElRow class="box" v-for="(item, index) in reviewData.data" :key="index">
                  <ElCol :span="22" v-if="isAmazon">
                    <el-form-item :label="`标题`" :rules="requiredRule" :prop="`data.${index}.title`">
                      <el-input v-model="item.title" placeholder></el-input>
                    </el-form-item>
                  </ElCol>
                  <ElCol :span="22">
                    <el-form-item :label="`内容`" :rules="requiredRule" :prop="`data.${index}.content`">
                      <el-input
                        v-model="item.content"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: !view ? 3 : 12}"
                        maxlength="1024"
                        placeholder
                      ></el-input>
                    </el-form-item>
                  </ElCol>
                  <ElCol :span="24">
                    <el-form-item :label="`评分`" :rules="requiredRule" :prop="`data.${index}.grade`">
                      <el-select style="width: 25%" v-model="item.grade">
                        <el-option v-for="i in helpful.grade.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </ElCol>
                  <ElCol
                    v-if="(value1.taskTypeId === 3 && value1.reviewSupplyType == 0) || value1.taskTypeId == 8"
                    :span="24"
                  >
                    <el-form-item
                      label="图片"
                      :rules="value1.taskTypeId == 8 ? null : requiredRule"
                      :prop="value1.taskTypeId == 8 ? null : `data.${index}.imageUrl`"
                    >
                      <el-upload
                        accept="image/*"
                        :auto-upload="true"
                        list-type="picture-card"
                        :limit="3"
                        ref="upload"
                        :multiple="true"
                        :file-list="item.imageUrl"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :on-exceed="handleExceed"
                        :on-change="handleChange.bind(null, item)"
                        :on-success="handleSuccess.bind(null, item)"
                        :on-preview="handlePictureCardPreview"
                        :http-request="handleRequest.bind(null, item)"
                        :on-remove="handleRemove.bind(null, item)"
                      >
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <el-checkbox-group v-show="false" :value="item.imageUrl"></el-checkbox-group>
                    </el-form-item>
                  </ElCol>
                  <ElCol v-if="item.accountName" :span="24">
                    <el-form-item :label="`评价者名称`">
                      <!-- <el-input v-model="item.accountName" :disabled="true"></el-input> -->
                      {{item.accountName}}
                    </el-form-item>
                  </ElCol>
                </ElRow>
              </el-form>
            </ElTabPane>
            <ElTabPane v-if="!view" label="导入" name="second">
              <ElButton :disabled="view" type="primary" size="small" class="mb10" @click="downloadTemp(0)">下载模板</ElButton>
              <new-form :disabled="view" :form-schema="importRvSkm" v-model="imptRvVal"></new-form>
            </ElTabPane>
          </ElTabs>
          <ElForm
            v-else-if="!(view && !quick && reviewData.data.length)"
            ref="form9"
            :disabled="view"
            style="margin-top:10px"
            label-width="100px"
            size="small"
            :rules="reviewCusRules"
            :model="reviewCusData"
          >
            <ElRow>
              <ElCol :span="8">
                <ElFormItem label="评分">
                  <el-input value="1" disabled></el-input>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="数量" :required="!isReviewCusValid" prop="reviewGradeOneNum">
                  <ElInputNumber :min="0" size="small" v-model="reviewCusData.reviewGradeOneNum"></ElInputNumber>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="8">
                <ElFormItem label="评分">
                  <el-input value="2" disabled></el-input>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="数量" :required="!isReviewCusValid" prop="reviewGradeTwoNum">
                  <ElInputNumber :min="0" size="small" v-model="reviewCusData.reviewGradeTwoNum"></ElInputNumber>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="8">
                <ElFormItem label="评分">
                  <el-input value="3" disabled></el-input>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="数量" :required="!isReviewCusValid" prop="reviewGradeThreeNum">
                  <ElInputNumber :min="0" size="small" v-model="reviewCusData.reviewGradeThreeNum"></ElInputNumber>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="8">
                <ElFormItem label="评分">
                  <el-input value="4" disabled></el-input>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="数量" :required="!isReviewCusValid" prop="reviewGradeFourNum">
                  <ElInputNumber :min="0" size="small" v-model="reviewCusData.reviewGradeFourNum"></ElInputNumber>
                </ElFormItem>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol :span="8">
                <ElFormItem label="评分">
                  <el-input value="5" disabled></el-input>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem label="数量" :required="!isReviewCusValid" prop="reviewGradeFiveNum">
                  <ElInputNumber :min="0" size="small" v-model="reviewCusData.reviewGradeFiveNum"></ElInputNumber>
                </ElFormItem>
              </ElCol>
            </ElRow>
          </ElForm>
          <!-- 如果是查看页 并且 有评价内容，则展示出来 -->
          <el-form
            v-else
            ref="form9"
            :disabled="view"
            style="margin-top:10px"
            label-width="100px"
            size="small"
            :model="reviewData"
          >
            <ElRow class="box" v-for="(item, index) in reviewData.data" :key="index">
              <ElCol :span="22" v-if="isAmazon">
                <el-form-item :label="`标题`" :rules="requiredRule" :prop="`data.${index}.title`">
                  <el-input v-model="item.title" placeholder></el-input>
                </el-form-item>
              </ElCol>
              <ElCol :span="22">
                <el-form-item :label="`内容`" :rules="requiredRule" :prop="`data.${index}.content`">
                  <el-input
                    v-model="item.content"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: !view ? 3 : 12}"
                    maxlength="1024"
                    placeholder
                  ></el-input>
                </el-form-item>
              </ElCol>
              <ElCol :span="24">
                <el-form-item :label="`评分`" :rules="requiredRule" :prop="`data.${index}.grade`">
                  <el-select style="width: 25%" v-model="item.grade">
                    <el-option v-for="i in helpful.grade.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </el-form-item>
              </ElCol>
              <ElCol
                v-if="(value1.taskTypeId === 3 && value1.reviewSupplyType == 0) || value1.taskTypeId == 8"
                :span="24"
              >
                <el-form-item
                  label="图片"
                  :rules="value1.taskTypeId == 8 ? null : requiredRule"
                  :prop="value1.taskTypeId == 8 ? null : `data.${index}.imageUrl`"
                >
                  <el-upload
                    accept="image/*"
                    :auto-upload="true"
                    list-type="picture-card"
                    :limit="3"
                    ref="upload"
                    :multiple="true"
                    :file-list="item.imageUrl"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-exceed="handleExceed"
                    :on-change="handleChange.bind(null, item)"
                    :on-success="handleSuccess.bind(null, item)"
                    :on-preview="handlePictureCardPreview"
                    :http-request="handleRequest.bind(null, item)"
                    :on-remove="handleRemove.bind(null, item)"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-checkbox-group v-show="false" :value="item.imageUrl"></el-checkbox-group>
                </el-form-item>
              </ElCol>
              <ElCol v-if="item.accountName" :span="24">
                <el-form-item :label="`评价者名称`">
                  <el-input v-model="item.accountName" :disabled="true"></el-input>
                </el-form-item>
              </ElCol>
            </ElRow>
          </el-form>
        </div>
        <none-page v-else text="请先填写任务数量" noBack></none-page>
      </WidgetCardWrapper>
    </template>

    <template v-if="value1.taskTypeId == 6 && taskNum">
      <WidgetCardWrapper key="qa" :isCollapse="false" :defaultHide="false" title="QA内容">
        <div v-if="taskNum">
          <ElTabs style="margin:0 40px" v-model="activeTab2">
            <ElTabPane label="填写" name="first">
              <el-form
                ref="form10"
                :disabled="view"
                style="margin-top:10px"
                label-width="100px"
                size="small"
                :model="QaData"
              >
                <ElRow class="box" v-for="(item, index) in QaData.data" :key="index">
                  <ElCol :span="22">
                    <el-form-item :label="`问题`" :rules="requiredRule" :prop="`data.${index}.content`">
                      <el-input v-model="item.content" maxlength="1024" placeholder></el-input>
                    </el-form-item>
                  </ElCol>
                  <!-- <ElCol :span="2">
                    <ElButton class="ml10" type="text" @click="copy(item.content)">复制</ElButton>
                  </ElCol>-->
                </ElRow>
              </el-form>
            </ElTabPane>
            <ElTabPane v-if="!view" label="导入" name="second">
              <ElButton :disabled="view" type="primary" size="small" class="mb10" @click="downloadTemp(1)">下载模板</ElButton>
              <new-form :disabled="view" :form-schema="importQaSkm" :value="importQaVal"></new-form>
            </ElTabPane>
          </ElTabs>
        </div>
        <none-page v-else text="请先填写任务数量" noBack></none-page>
      </WidgetCardWrapper>
    </template>

    <el-dialog width="800px" :visible.sync="dialogVisible">
      <a target="_blank" :href="dialogImageUrl">
        <img width="100%" :src="dialogImageUrl" />
      </a>
    </el-dialog>
    <div class="txc">
      <ElButton v-if="!view" class="more-len" type="primary" @click="submit">{{(edit && !quick) ?'发布' : '发布'}}任务</ElButton>
      <ElButton type="primary" @click="cancel" plain>{{!view ?'取消' : '返回'}}</ElButton>
    </div>
  </div>
</template>
<script>
import { downloadFile } from 'Utils'
import { CONST_PORT_CONFIG } from 'Config'
import Oss from 'Utils/oss'

const relHandles = [
  {
    label: '无',
    value: 0
  },
  {
    label: '浏览',
    value: 1
  },
  {
    label: '加购',
    value: 2
  },
  {
    label: '购买',
    value: 3
  }
]
export default {
  name: 'amazon',
  props: {
    view: {
      default: false,
      type: Boolean
    },
    quick: {
      default: false,
      type: Boolean
    },
    edit: {
      default: false,
      type: Boolean
    }
    // platformSiteId: Number
  },
  data() {
    let vm = this
    const checkAsin = key => (rule, value, cb) => {
      if (!value) {
        cb(new Error('不能为空'))
      }
      if (
        vm.value1.platformSiteId[0] == 'amazon' &&
        !/^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/.test(value)
      ) {
        cb(new Error('ASIN须为10位数，纯数字或大写字母和数字的组合'))
      }
      if (
        vm.value1.platformSiteId[0] == 'aliexpress' &&
        !/^[0-9]{1,20}$/.test(value)
      ) {
        cb(new Error('产品ID须为20位数，纯数字的组合'))
      }
      if (value && key == 'productId') {
        if (vm.value1.relProductId !== value) {
          vm.$refs.form6 &&
            vm.$refs.form6.$refs.ruleform &&
            vm.$refs.form6.$refs.ruleform.clearValidate('relProductId')
        } else {
          cb(new Error('关联产品ID不能与产品ID相同'))
        }
      }
      if (value && key == 'relProductId') {
        if (vm.value1.productId !== value) {
          vm.$refs.form5 &&
            vm.$refs.form5.$refs.ruleform &&
            vm.$refs.form5.$refs.ruleform.clearValidate('productId')
        } else {
          cb(new Error('关联产品ID不能与产品ID相同'))
        }
      }
      cb()
    }
    const checkReviewNum = (rule, value, cb) => {
      vm.$refs.form9.clearValidate()
      if (Object.values(vm.reviewCusData).every(el => !el)) {
        vm.isReviewCusValid = false
        cb(new Error('请输入任务数量'))
      } else if (
        Object.values(vm.reviewCusData).reduce(
          (prev, cur) => prev + (cur || 0),
          0
        ) !== vm.taskNum
      ) {
        vm.isReviewCusValid = false
        cb(new Error('任务数量总和必须与搜索任务数量总和一致'))
      } else {
        vm.isReviewCusValid = true
        cb()
      }
    }
    return {
      showEdit: !this.view && !this.quick && !this.edit,
      taskTypes: {
        amazon: this.$const['OTHER/taskType'],
        aliexpress: this.$const['OTHER/taskType_aliexpress']
      },
      showMsg: false,
      isReviewCusValid: false,
      reviewCusRules: {
        reviewGradeOneNum: [
          {
            validator: checkReviewNum
          }
        ],
        reviewGradeTwoNum: [
          {
            validator: checkReviewNum
          }
        ],
        reviewGradeThreeNum: [
          {
            validator: checkReviewNum
          }
        ],
        reviewGradeFourNum: [
          {
            validator: checkReviewNum
          }
        ],
        reviewGradeFiveNum: [
          {
            validator: checkReviewNum
          }
        ]
      },
      reviewCusData: {
        reviewGradeOneNum: 0,
        reviewGradeTwoNum: 0,
        reviewGradeThreeNum: 0,
        reviewGradeFourNum: 0,
        reviewGradeFiveNum: 0
      },
      maxTaskCount: 10,
      earnReview: [],
      earnQa: [],
      moneyInfo: {},
      importRvSkm: {
        value: {
          widget: 'upload',
          label: '',
          span: 24,
          limit: 1,
          multiple: false,
          autoUpload: true,
          withCredentials: true,
          data: {
            token: this.$storage.get('local', 'token'),
            platformCode: null
          },
          action: CONST_PORT_CONFIG.AGENT_URL + '/TaskSource/review/importData',
          onSuccess: this.reviewImpSuc,
          fileLimit: ['excel']
        }
      },
      imptRvVal: {
        value: []
      },
      importQaSkm: {
        value: {
          widget: 'upload',
          label: '',
          span: 24,
          limit: 1,
          autoUpload: true,
          withCredentials: true,
          data: {
            token: this.$storage.get('local', 'token')
          },
          action: CONST_PORT_CONFIG.AGENT_URL + '/TaskSource/qa/importData',
          onSuccess: this.qaImpSuc,
          fileLimit: ['excel']
        }
      },
      importQaVal: {},
      dialogVisible: false,
      dialogImageUrl: '',
      requiredRule: [
        {
          required: true,
          message: '不能为空'
        }
      ],
      activeTab1: 'first',
      activeTab2: 'first',
      reviewData: {
        data: []
      },
      QaData: {
        data: []
      },
      base: {
        platformSiteId: {
          widget: 'cascader',
          label: '平台站点',
          clearable: true,
          required: true,
          span: 12,
          width: '50%',
          options: '$store.common.platSite',

          props: {
            label: 'cnName',
            value: 'platformSiteId',
            children: 'childs'
          },
          handler: {
            action: 'common/getPlatSite'
          }
        },
        categoryId: {
          widget: 'cascader',
          disabled: data => {
            return (
              data.platformSiteId == null || data.platformSiteId.length == 0
            )
          },
          label: '产品类目',
          required: true,
          width: '50%',
          clearable: true,
          // hidden: data =>
          //   data.platformSiteId == null || data.platformSiteId.length == 0,
          hidden: false,
          span: 12,
          props: {
            lazy: true,
            lazyLoad: (node, resolve) => {
              // debugger
              if (!node.data) {
                node.data = { level: 0, categoryId: 0 }
              }
              if (
                !vm.value1.platformSiteId ||
                !vm.value1.platformSiteId.length
              ) {
                resolve([])
              }
              node.data.parentId = node.data.categoryId
              node.data.level++
              this.$api[`agent/categoryDropdownListHasLastLevel`]({
                // ...node.data,
                parentId: node.data.parentId,
                level: node.data.level,
                platformSiteId: vm.value1.platformSiteId
                  ? vm.value1.platformSiteId.slice().pop()
                  : null
              }).then(data => {
                resolve(
                  data.map(el => ({
                    label: el.name,
                    value: el.categoryId,
                    leaf: !el.hasChild,
                    ...el
                  }))
                )
              })
            }
          }
        },
        terminalType: {
          widget: 'radio',
          label: '终端类型',
          required: true,
          clearable: true,
          span: 12,
          options: '$const.OTHER/termnalType'
        },
        storeId: {
          label: '店铺名称',
          span: 12,
          width: '50%',
          widget: 'select',
          required: true,
          // hidden: data => {
          //   return !data.platformSiteId.length
          // },
          disabled: data => {
            return (
              data.platformSiteId == null || data.platformSiteId.length == 0
            )
          },
          hidden: false,
          change: data => {
            if (data.storeId) {
              this.showMsg = false
            }
          },
          options: []
          // handler: {
          //   action: 'common/getStore',
          //   payload: {
          //     platformSiteId: null
          //   }
          // }
        }
      },
      love: {
        buyerSex: {
          widget: 'select',
          span: 12,
          label: '买家性别',
          clearable: false,
          defaultVal: -1,
          options: '$const.OTHER/sex',
          innerTips: ' ',
          change: data => {
            if (~data.buyerSex) {
              this.love.buyerSex.innerTips = this.moneyInfo.buyerSex[
                data.buyerSex
              ]
            }
          },
          showInnerTipFunc(data) {
            return !!~data.buyerSex
          }
        },
        primeMemberFlag: {
          widget: 'switch',
          span: 12,
          label: 'Prime会员',
          innerTips: ' ',
          change: data => {
            if (data.primeMemberFlag) {
              this.love.primeMemberFlag.innerTips = this.moneyInfo.primeMemberFlag[
                data.primeMemberFlag
              ]
            }
          },
          showInnerTipFunc(data) {
            return data.primeMemberFlag
          }
        },
        age: {
          clearable: false,
          widget: 'select',
          span: 12,
          innerTips: ' ',
          label: '年龄段',
          defaultVal: 'unlimited',
          showInnerTipFunc(data) {
            return data.age !== 'unlimited'
          },
          change: data => {
            if (data.age !== 'unlimited') {
              this.love.age.innerTips = this.moneyInfo.age[data.age]
            }
          },
          options: () =>
            this.$api[`agent/taskSourceAgeDropdownList`]({}).then(data => {
              return data.rows.map(el => ({ label: el.value, value: el.key }))
            })
        }
      },
      task: {
        taskTypeId: {
          required: true,
          label: '任务类型',
          widget: 'radio',
          vertical: true,
          // innerTips: '（佣金：$10/单）',
          options: '$const.OTHER/taskType',
          change: this.taskTypeChange
        },
        relHandle: {
          // required: true,
          width: '200px',
          label: '关联操作',
          hidden(data) {
            return (
              !data.taskTypeId || (data.taskTypeId > 5 && data.taskTypeId !== 8)
            )
          },
          widget: 'select',
          vertical: true,
          // innerTips: '（佣金：$10/单）',
          options: relHandles
        },
        // recycleProductFlag: {
        //   hidden(data) {
        //     return !data.taskTypeId || data.taskTypeId > 3
        //   },
        //   label: '商品回收',
        //   widget: 'switch',
        //   rightBtn: {
        //     alwaysUse: true,
        //     name: '佣金参考费用说明',
        //     type: 'text',
        //     fn: () => {
        //       this._openDialog({
        //         size: 'small',
        //         title: '费用说明',
        //         cancelBtnText: '关闭',
        //         component: () => import('./dialogs/refrceCst.vue')
        //       })
        //     }
        //   }
        // },
        reviewSupplyType: {
          required: true,
          hidden(data) {
            return (
              !data.taskTypeId ||
              ((data.taskTypeId == 1 || data.taskTypeId > 3) &&
                data.taskTypeId !== 8)
            )
          },
          change: data => {
            this.task.reviewSupplyType.innerTips = this.moneyInfo.reviewSupplyType[
              data.reviewSupplyType
            ]
          },
          label: 'Review内容提供',
          widget: 'radio',
          defaultVal: 0,
          innerTips: ' ',
          options: [
            {
              label: '自己提供',
              value: 0,
              tip: false
            },
            {
              label: '系统提供',
              // tip: '条数=任务数量*评价数量',
              value: 1
            }
          ]
        }
      },
      taskKeyword: {
        taskKeywordArray: {
          type: 'object',
          label: '',
          array: true,
          arrayMax: 5,
          showBtn: true,
          properties: {
            keyword: {
              widget: 'input',
              label: '关键词',
              labelWidth: '80px',
              maxlength: 255,
              required: true,
              span: 10
            },
            taskNum: {
              widget: 'select',
              options: [],
              width: '100px',
              labelWidth: '100px',
              label: '任务数量',
              required: {
                value: (rule, value, cb) => {
                  if (
                    this.value1.taskKeywordArray.reduce(
                      (prev, cur) => prev + cur.taskNum,
                      0
                    ) > this.maxTaskCount
                  ) {
                    cb(new Error(`任务数量总和不能大于${this.maxTaskCount}`))
                  }
                  cb()
                }
              },
              span: 5
            },
            executeTime: {
              pickerOptions: {
                disabledDate: time => {
                  let today = Date.now() - 24 * 3600 * 1000
                  return time.getTime() < today
                }
              },
              selectDate: null,
              widget: 'date',
              // time: true,
              labelWidth: '165px',
              label: '任务执行时间(太平洋)',
              // blur: () => {
              //   this.selectDate = null
              // },
              required: true,
              span: 9
            }
          }
        }
      },
      productInfo: {
        productId: {
          label: '产品ID',
          placeholder: '子产品ASIN',
          maxlength: 10,
          span: 12,
          width: '50%',
          required: {
            value: checkAsin('productId')
          }
        },
        parentProductId: {
          label: '父产品ID',
          hidden: () => vm.isWhat(['AliExpress']),
          placeholder: '父产品ASIN',
          maxlength: 10,
          span: 12,
          width: '50%',
          required: 'asin'
        },
        sku: {
          label: '成交SKU属性',
          maxlength: 255,
          span: 12,
          hidden(data) {
            return (
              !data.taskTypeId || (data.taskTypeId >= 4 && data.taskTypeId != 8)
            )
          },
          required: true
        },
        productMoney: {
          widget: 'currency',
          label: '产品金额',
          min: 0.01,
          max: 999999999.99,
          width: '50%',
          hidden(data) {
            return (
              !data.taskTypeId || (data.taskTypeId >= 4 && data.taskTypeId != 8)
            )
          },
          span: 12,
          required: true
        },
        deliver: {
          widget: 'radio',
          label: '发货方式',
          options: [
            {
              label: 'FBA',
              value: 0
            },
            {
              label: 'FBM',
              value: 1
            }
          ],
          width: '50%',
          hidden(data) {
            return (
              !data.taskTypeId ||
              data.taskTypeId >= 4 ||
              vm.isWhat(['AliExpress'])
            )
          },
          span: 12,
          required: true
        },
        imgUrl: {
          label: '产品主图URL',
          maxlength: 255,
          tip: {
            img: require('@/assets/images/tips.jpg')
          },
          span: 24,
          required: 'url'
        },
        productTitle: {
          label: '产品标题',
          maxlength: 255,
          span: 24,
          required: true
        },
        appPrintscreen: {
          hidden(data) {
            return !data.terminalType || data.terminalType == 2
          },
          widget: 'upload',
          limitSize: 1,
          listType: 'picture-card',
          label: 'App搜索结果截图',
          span: 24,
          limit: 1,
          drag: false,
          autoUpload: true,
          action: 'https://jsonplaceholder.typicode.com/posts/',
          required: false,
          httpRequest: this.handleRequest.bind(null, 'appPrintscreen'),
          fileLimit: ['image']
        }
      },
      relateInfo: {
        relProductId: {
          label: '产品ID',
          placeholder: '关联子产品ASIN',
          maxlength: 10,
          span: 12,
          width: '50%',
          required: checkAsin('relProductId')
        },
        relParentProductId: {
          label: '父产品ID',
          placeholder: '关联父产品ASIN',
          hidden: () => vm.isWhat(['AliExpress']),
          maxlength: 10,
          span: 12,
          width: '50%',
          required: 'asin'
        },
        relSku: {
          label: '成交SKU属性',
          span: 12,
          maxlength: 255,
          hidden(data) {
            return !data.relHandle || data.relHandle !== 3
            // return !data.taskTypeId || data.taskTypeId >= 4
          },
          required: true
        },
        relProductMoney: {
          widget: 'currency',
          label: '产品金额',
          min: 0.01,
          max: 999999999.99,
          width: '50%',
          hidden(data) {
            return !data.relHandle || data.relHandle !== 3
            // return !data.taskTypeId || data.taskTypeId >= 4
          },
          span: 12,
          required: true
        },

        relSeller: {
          span: 12,
          hidden(data) {
            return (
              !data.relHandle ||
              data.relHandle !== 3 ||
              vm.isWhat(['AliExpress'])
            )
          },
          maxlength: 255,
          label: '卖家名称',
          required: true
        },

        relDeliver: {
          widget: 'radio',
          label: '发货方式',
          hidden(data) {
            return (
              !data.relHandle ||
              data.relHandle !== 3 ||
              vm.isWhat(['AliExpress'])
            )
          },
          options: [
            {
              label: 'FBA',
              value: 0
            },
            {
              label: 'FBM',
              value: 1
            }
          ],
          width: '50%',
          // hidden(data) {
          //   return !data.taskTypeId || data.taskTypeId >= 4
          // },
          span: 12,
          required: true
        },

        relProductTitle: {
          maxlength: 255,
          label: '产品标题',
          span: 24,
          required: true
        },
        relAppPrintscreen: {
          hidden(data) {
            return !data.terminalType || data.terminalType == 2
          },
          widget: 'upload',
          limitSize: 1,
          listType: 'picture-card',
          label: 'App搜索结果截图',
          span: 24,
          limit: 1,
          drag: false,
          autoUpload: true,
          action: 'https://jsonplaceholder.typicode.com/posts/',
          required: false,
          httpRequest: this.handleRequest.bind(null, 'relAppPrintscreen'),
          fileLimit: ['image']
        }
      },
      helpful: {
        sortBy: {
          label: '排序方式',
          widget: 'select',
          span: 12,
          width: '50%',
          required: true,
          options: [
            {
              label: 'Top Reviews',
              value: 0
            },
            {
              label: 'Most Recent',
              value: 1
            }
          ]
        },
        grade: {
          label: '评分',
          widget: 'select',
          width: '50%',
          span: 12,
          required: true,
          options: [
            {
              label: '1',
              value: 1
            },
            {
              label: '2',
              value: 2
            },
            {
              label: '3',
              value: 3
            },
            {
              label: '4',
              value: 4
            },
            {
              label: '5',
              value: 5
            }
          ]
        },
        helpfulNum: {
          label: '评价数量',
          width: '50%',
          widget: 'number',
          required: true,
          tip: {
            content: '按排序方式，前N条'
          },
          span: 12
        }
      },
      review: {
        reviewTimeType: {
          label: '评价时间',
          widget: 'select',
          width: '50%',
          options: [
            {
              label: '系统定义',
              value: 0
            },
            // {
            //   label: '自定义',
            //   value: 1
            // },
            {
              label: '人工索评',
              value: 1
            }
          ],
          change: data => {
            this.review.reviewTimeType.innerTips = this.moneyInfo.reviewTimeType[
              data.reviewTimeType
            ]
          },
          span: 12,
          defaultVal: 0,
          required: true,
          tip: {
            content:
              '系统定义：购买完成10天后。<Br>人工索评（收费）：在任务中心人工索评。'
          },
          innerTips: ' ',
          showInnerTipFunc(data) {
            return !!data.reviewTimeType
          }
        }
      },
      value1: { relHandle: 0, recycleProductFlag: 0 }
    }
  },
  watch: {
    'value1.platformSiteId'(val, oldVal) {
      if (val && val.length) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) {
          return
        }
        setTimeout(() => {
          this.taskTypeChange(this.value1)
        })
        this.importRvSkm.value.data.platformCode = val[0]
        // 平台变了要查数量和佣金
        this.setPlaceholder(val[0])
        this.getMax(val[0])
        this.getMoney(val[0])
        // 站点变了要查店铺数据
        let curPlatformSiteId = val.slice().pop()
        if (this['storeList_' + curPlatformSiteId]) {
          this.$store.commit(
            'common/setStore',
            this['storeList_' + curPlatformSiteId]
          )
          this.base.storeId.options = this.$store.state.common.storeList
        } else {
          this.$store
            .dispatch('common/getStore', {
              platformSiteId: val.slice().pop()
            })
            .then(res => {
              this['storeList_' + curPlatformSiteId] = res
              this.base.storeId.options = this.$store.state.common.storeList
            })
        }
        if (this.showEdit) {
          // 清空任务信息
          if (
            !this.isAmazon &&
            (this.value1.taskTypeId == 2 || this.value1.taskTypeId == 3)
          ) {
            this.$set(this.value1, 'taskTypeId', 8)
          } else if (this.isAmazon && this.value1.taskTypeId == 8) {
            this.$set(this.value1, 'taskTypeId', 2)
          } else {
            this.$set(this.value1, 'taskTypeId', null)
          }
          this.$set(this.value1, 'categoryId', null)
          this.$set(this.value1, 'relHandle', null)
          this.$set(this.value1, 'storeId', null)

          this.base.categoryId.hidden = () => true
          this.$nextTick(() => {
            this.base.categoryId.hidden = () => false
          })
          // if (!this.isAmazon) {
          //   this.$set(this.value1, 'reviewSupplyType', null)
          // }
        }
      } else {
        this.value1.categoryId = []
        this.$set(this.value1, 'storeId', null)
      }
    },
    'value1.relHandle'(val) {
      if (!this.moneyInfo.relHandle) {
        return
      }
      this.task.relHandle.innerTips = val ? this.moneyInfo.relHandle[val] : null
    },
    taskNum(val, oldVal) {
      // if (this.isEdit) {
      //   return
      // }
      if (val == oldVal) {
        return
      }

      if (val > oldVal) {
        let len = val - oldVal
        for (let index = 0; index < len; index++) {
          if (this.reviewData.data.length !== val) {
            this.reviewData.data.push(this.earnReview.shift() || {})
          }
          if (this.QaData.data.length !== val) {
            this.QaData.data.push(this.earnQa.shift() || {})
          }
        }
      } else {
        // const len = this.reviewData.data.length
        this.earnReview.push(...this.reviewData.data.slice(val))
        this.earnQa.push(...this.QaData.data.slice(val))
        this.reviewData.data = this.reviewData.data.slice(0, val)
        this.QaData.data = this.QaData.data.slice(0, val)
      }
    }
  },
  computed: {
    showReview() {
      if (!this.taskNum) {
        return false
      }
      if (this.isAmazon) {
        return (
          (this.value1.taskTypeId == 2 || this.value1.taskTypeId == 3) &&
          this.taskNum
        )
      }
      return this.taskNum && this.value1.taskTypeId == 8
    },
    taskNum() {
      if (!this.value1 || !this.value1.taskKeywordArray) {
        return 0
      }
      return this.value1.taskKeywordArray.reduce(
        (total, cur) => (total += cur.taskNum || 0),
        0
      )
    },
    isAmazon() {
      return this.isWhat(['Amazon'])
      // let havePlats = ['Amazon']
      // return this.value1.platformSiteId
      //   ? havePlats.indexOf(this.value1.platformSiteId[0]) > -1
      //   : false
    }
  },
  created() {
    let vm = this
    // this.getMax()
    // this.getMoney()
    if (this.view || this.edit) {
      this.getEditData()
    }
    if (this.quick && !this.view) {
      this.$store.watch(
        state => state.common.storeList,
        () => {
          // console.log(val)
          vm.checkStore()
        }
      )
    }
  },
  methods: {
    setPlaceholder(id) {
      // console.log(id)
      if (id == 'amazon') {
        this.productInfo.productId.placeholder = '子产品ASIN'
        this.productInfo.parentProductId.placeholder = '父产品ASIN'
        this.relateInfo.relProductId.placeholder = '关联子产品ASIN'
        this.relateInfo.relParentProductId.placeholder = '关联父产品ASIN'

        this.productInfo.productId.maxlength = 10
        this.productInfo.parentProductId.maxlength = 10
        this.relateInfo.relParentProductId.maxlength = 10
        this.relateInfo.relProductId.maxlength = 10
      } else if (id == 'aliexpress') {
        this.productInfo.productId.placeholder = '子产品ID'
        this.productInfo.parentProductId.placeholder = '父产品ID'
        this.relateInfo.relProductId.placeholder = '关联子产品ASIN'
        this.relateInfo.relParentProductId.placeholder = '关联父产品ASIN'

        this.productInfo.productId.maxlength = 20
        this.productInfo.parentProductId.maxlength = 20
        this.relateInfo.relParentProductId.maxlength = 20
        this.relateInfo.relProductId.maxlength = 20
      }
    },
    isWhat(plats = []) {
      plats = plats.map(el => el.toLowerCase())
      if (!this.value1.platformSiteId || !this.value1.platformSiteId[0]) {
        return false
      }
      return this.value1.platformSiteId
        ? plats.indexOf(this.value1.platformSiteId[0].toLowerCase()) > -1
        : false
    },
    taskTypeChange(data) {
      if (data.taskTypeId < 6 || data.taskTypeId == 8) {
        data.relHandle = 0
      }

      this.taskKeyword.taskKeywordArray.arrayMax = 5
      data.recycleProductFlag = null
      if (data.taskTypeId <= 3) {
        if (data.taskTypeId == 1 && this.isWhat(['aliexpress'])) {
          this.task.relHandle.options = [
            relHandles[0],
            relHandles[1],
            relHandles[3]
          ]
        } else {
          this.task.relHandle.options = relHandles
        }
      } else if (data.taskTypeId == 4) {
        this.task.relHandle.options = [
          relHandles[0],
          relHandles[1],
          relHandles[2]
        ]
      } else if (data.taskTypeId == 5) {
        // data.relHandle = 1
        this.task.relHandle.options = [relHandles[0], relHandles[1]]
      } else if (data.taskTypeId == 8) {
        this.task.relHandle.options = [
          relHandles[0],
          relHandles[1],
          relHandles[3]
        ]
      } else {
        this.taskKeyword.taskKeywordArray.arrayMax = 1
        this.task.relHandle.options = relHandles
      }
    },
    // 检查店铺是否被禁用，如果被禁用则去掉店铺的选择值
    checkStore() {
      if (this.view) {
        return
      }
      if (
        this.value1.storeId != null &&
        this.$store.state.common.storeList.length
      ) {
        let store = this.$store.state.common.storeList.find(
          el => el.value === this.value1.storeId
        )
        if (store && store.status == 0) {
          this.showMsg = `店铺 ${store.label} 已暂停，请激活店铺 或者重新选择店铺`
          this.value1.storeId = null
        }
      }
    },
    getMax(platformCode) {
      let data
      if (this['max_' + platformCode]) {
        data = this['max_' + platformCode]
        this.setNums(data.rows.maxTaskCount)
        this.maxTaskCount = data.rows.maxTaskCount
      } else {
        this.$api[`agent/taskSourceMaxTaskCount`]({ platformCode }).then(
          data => {
            this.setNums(data.rows.maxTaskCount)
            this.maxTaskCount = data.rows.maxTaskCount
            this['max_' + platformCode] = data
          }
        )
      }
    },
    setNums(num) {
      const nums = new Array(num)
        .join(',')
        .split(',')
        .map((el, index) => ({ label: index + 1, value: index + 1 }))
      this.taskKeyword.taskKeywordArray.properties.taskNum.options = nums
    },
    reviewImpSuc(data) {
      this.imptRvVal.value = []
      if (data.code == 0) {
        this.activeTab1 = 'first'
        this.$message.success(data.msg)
        if (this.taskNum > data.data.length) {
          this.reviewData.data = data.data.concat(
            new Array(this.taskNum - data.data.length)
              .join(',')
              .split(',')
              .map(() => ({}))
          )
        } else if (this.taskNum < data.data.length) {
          this.reviewData.data = data.data.slice(0, this.taskNum)
        } else {
          this.reviewData.data = data.data
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    qaImpSuc(data) {
      this.importQaVal.value = []
      if (data.code == 0) {
        this.activeTab2 = 'first'
        this.$message.success(data.msg)
        this.QaData.data = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    getMoney(platformCode) {
      let vm = this,
        data

      // console.log(this['money_' + platformCode])

      if (this['money_' + platformCode]) {
        data = this['money_' + platformCode]
        this.handleM(data, platformCode)
      } else {
        vm.$api[`agent/taskSourceTaskMoney`]({ platformCode }).then(data => {
          this.handleM(data, platformCode)
          this['money_' + platformCode] = data
        })
      }
    },
    handleM(data, platformCode) {
      // return
      let vm = this
      vm.moneyInfo = data.rows
      // eslint-disable-next-line no-unused-vars
      const { buyerSex, primeMemberFlag, age, taskTypeId } = data.rows
      // vm.love.buyerSex.innerTips = buyerSex
      // vm.love.age.innerTips = age

      vm.task.taskTypeId.options = this.taskTypes[
        platformCode.toLowerCase()
      ].map(el => {
        el.innerTips = taskTypeId[el.value]
        return el
      })
      this.setMoney()
    },
    submit() {
      let promises = new Array(10)
        .join(',')
        .split(',')
        .map((el, index) => this.$refs[`form${index + 1}`])
        .filter(el => !!el)
        .map(el => el.validate())
      Promise.all(promises)
        .then(() => {
          const {
            categoryId,
            platformSiteId,
            appPrintscreen,
            relAppPrintscreen,
            ...info
          } = this.value1
          const hasReview = [2, 3, 8],
            hasQa = [6]
          debugger
          let params = {
            categoryId: categoryId.slice().pop(),
            platformSiteId: platformSiteId.slice().pop(),
            appPrintscreen:
              appPrintscreen &&
              appPrintscreen[0] &&
              (appPrintscreen[0].response
                ? appPrintscreen[0].response[0]
                : appPrintscreen[0].url),
            relAppPrintscreen:
              relAppPrintscreen &&
              relAppPrintscreen[0] &&
              (relAppPrintscreen[0].response
                ? relAppPrintscreen[0].response[0]
                : relAppPrintscreen[0].url),
            ...info,
            taskReviewArray:
              hasReview.indexOf(this.value1.taskTypeId) > -1
                ? this.value1.reviewSupplyType == 0 // 如果 Review内容提供 选项为 自己提供 时才会传评价内容
                  ? this.reviewData.data.map(el => {
                      // eslint-disable-next-line no-unused-vars
                      const { imageUrl, ...info } = el
                      if (
                        imageUrl &&
                        // 有图片评价的都判断一下
                        (this.value1.taskTypeId == 3 ||
                          this.value1.taskTypeId == 8)
                      ) {
                        if (imageUrl[0]) {
                          info.imgUrlOne = imageUrl[0].response
                            ? imageUrl[0].response[0]
                            : imageUrl[0].url
                        }
                        if (imageUrl[1]) {
                          info.imgUrlTwo = imageUrl[1].response
                            ? imageUrl[1].response[0]
                            : imageUrl[1].url
                        }
                        if (imageUrl[2]) {
                          info.imgUrlThree = imageUrl[2].response
                            ? imageUrl[2].response[0]
                            : imageUrl[2].url
                        }
                      }
                      return info
                    })
                  : []
                : null,
            taskQaArray:
              hasQa.indexOf(this.value1.taskTypeId) > -1
                ? this.QaData.data
                : null
          }
          if (this.value1.reviewSupplyType == 1) {
            // 如果 Review内容提供 选项为 系统提供 时要传reviewCusData的数据给后端
            Object.keys(this.reviewCusData).forEach(key => {
              params[key] = this.reviewCusData[key] || 0
            })
          }
          if (this.value1.taskTypeId >= 6) {
            delete params.relHandle
          }
          this.$api[`agent/taskSourceCheckBalance`](params).then(data => {
            this.showTips({ msg: data.msg }, () => {
              return this.$api[
                `agent/${
                  this.edit && !this.quick
                    ? 'taskSourceUpdate'
                    : 'taskSourceSave'
                }`
              ](params).then(() => {
                this.$router.push('/dash')
              })
            })
          })
        })
        .catch(err => {
          if (err === false) {
            // 验证不通过
            this.$nextTick(() => {
              let item = document.querySelectorAll('.is-error.el-form-item')[0]
              this.$message.warning(
                item.querySelectorAll('label')[0].innerText +
                  '：' +
                  item.querySelectorAll('.el-form-item__error')[0].innerText
              )
              item.scrollIntoViewIfNeeded()
            })
          } else {
            if (err instanceof Error) {
              console.error(err)
            }
          }
        })
    },
    cancel() {
      let isChange =
        JSON.stringify(this.value1) !== this.$options.value1 ||
        JSON.stringify(this.reviewData) !== this.$options.reviewData ||
        JSON.stringify(this.QaData) !== this.$options.QaData
      if (this.view) {
        window.close()
        return
      }
      if (!isChange) {
        this.$router.push('/dash')
        return
      }
      this.$confirm('确认后所有填写的信息都将丢失，是否取消?', '警告', {
        confirmButtonText: '取消',
        cancelButtonText: '确认',
        type: 'warning'
      })
        .then(() => {})
        .catch(() => {
          this.$router.push('/dash')
        })
      // this.showTips({ msg: '确认后所有填写的信息都将丢失，是否取消?' }, () => {
      //   this.$router.push('/dash')
      //   return Promise.resolve()
      // })
    },
    downloadTemp(type) {
      this.$api[
        `agent/${
          type ? 'taskSourceQaExportTemplate' : 'taskSourceReviewExportTemplate'
        }`
      ]({ platformCode: this.value1.platformSiteId[0] }).then(data => {
        downloadFile(data)
      })
    },
    setMoney() {
      if (!this.hasVal || !this.moneyInfo.buyerSex) {
        return
      }
      this.love.buyerSex.innerTips = this.moneyInfo.buyerSex[
        this.value1.buyerSex
      ]
      this.love.primeMemberFlag.innerTips = this.moneyInfo.primeMemberFlag[
        this.value1.primeMemberFlag
      ]
      this.love.age.innerTips = this.moneyInfo.age[this.value1.age]

      this.task.reviewSupplyType.innerTips = this.moneyInfo.reviewSupplyType[
        this.value1.reviewSupplyType
      ]
    },
    getEditData() {
      this.isEdit = true
      this.$api[`agent/taskSourceInfo`]({ id: this.$route.query.id })
        .then(data => {
          let {
            categoryMap,
            platformCode,
            platformSiteId,
            taskReviewArray,
            taskQaArray,
            appPrintscreen,
            relAppPrintscreen,
            reviewGradeOneNum,
            reviewGradeTwoNum,
            reviewGradeThreeNum,
            reviewGradeFourNum,
            reviewGradeFiveNum,
            ...info
          } = data.rows
          categoryMap = [
            ...Object.values(categoryMap)[0],
            +Object.keys(categoryMap)[0]
          ]
          this.reviewCusData = {
            reviewGradeOneNum: reviewGradeOneNum || 0,
            reviewGradeTwoNum: reviewGradeTwoNum || 0,
            reviewGradeThreeNum: reviewGradeThreeNum || 0,
            reviewGradeFourNum: reviewGradeFourNum || 0,
            reviewGradeFiveNum: reviewGradeFiveNum || 0
          }

          this.value1 = {
            ...this.value1,
            ...info,
            platformSiteId: [platformCode, platformSiteId],
            categoryId: categoryMap,
            appPrintscreen: appPrintscreen
              ? [{ name: '', url: appPrintscreen }]
              : [],
            relAppPrintscreen: relAppPrintscreen
              ? [{ name: '', url: relAppPrintscreen }]
              : []
          }
          this.checkStore()
          this.hasVal = true
          this.setMoney()
          this.taskTypeChange(data.rows)

          this.reviewData.data =
            (taskReviewArray &&
              taskReviewArray.map(el => {
                let { imgUrlOne, imgUrlTwo, imgUrlThree, ...info } = el
                return {
                  ...info,
                  imageUrl: new Array(imgUrlOne, imgUrlTwo, imgUrlThree)
                    .filter(el => el !== null)
                    .map(el => ({ name: '', url: el }))
                }
              })) ||
            []
          this.QaData.data = taskQaArray || []
          this.$options.value1 = JSON.stringify(this.value1)
          this.$options.reviewData = JSON.stringify(
            taskReviewArray ? this.reviewData : { data: [] }
          )
          this.$options.QaData = JSON.stringify(
            taskQaArray ? this.QaData : { data: [] }
          )
          setTimeout(() => {
            this.isEdit = false
            this.showEdit = true
          }, 0)
        })
        .catch(err => {
          console.error(err)
        })
    },
    copy(text) {
      this.$copyText(text).then(
        () => {
          this.$message.success('复制成功')
        },
        () => {
          this.$message.success('复制失败，请重试或手动复制')
        }
      )
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleSuccess(item, value = 'value1', res) {
      if (item === 'appPrintscreen') {
        this.$set(this.value1, item, value.map(el => ({ name: '', url: el })))
        return
      }
      if (!res) {
        res = value
        value = 'value1'
      }
      if (typeof item === 'object') {
        this.$set(item, 'imageUrl', res)
      } else {
        this.$set(this[value], item, res.map(el => ({ name: '', url: el })))
      }
    },
    async handleRequest(item, file) {
      let vm = this
      console.log(item, file)

      const path = await this.$api[`agent/constantRealPathGet`]({
        uploadType: 'review-img-url'
      }).then(data => data.filePath)
      let res
      try {
        res = await Oss.batchUpload(
          [file.file],
          path,
          '/constant/get/oss/signature',
          e => {
            if (e.lengthComputable) {
              let percent = Math.round(((e.loaded / e.total) * 100) | 0)
              if (typeof item === 'object') {
                let f = item.imageUrl.find(el => el.raw === file.file)
                f.percentage = percent
              } else {
                // console.log(vm.value1.appPrintscreen)
              }

              // console.log(percent)
            }
          },
          this.$storage.get('local', 'token')
        )
      } catch (error) {
        console.log(error)
      }
      if (typeof item === 'object') {
        this.$set(item, 'imgs', res)
      }
      return res
    },
    handleRemove(item, file, fileList) {
      this.$set(item, 'imageUrl', fileList)
    },
    handleExceed() {
      this.$message.warning('只能上传3张图片')
    },
    handleChange(item, file, fileList) {
      this.$set(item, 'imageUrl', fileList)
    }
  }
}
</script>
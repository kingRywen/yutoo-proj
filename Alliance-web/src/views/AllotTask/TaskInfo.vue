<template>
  <div class="main" v-loading="loading">
    <ElForm
      label-position="left"
      ref="form1"
      size="mini"
      label-width="80px"
      :show-message="false"
      inline-message
      :model="taskActionData"
    >
      <ElFormItem label="账号">
        <div class="flex" style="cursor:pointer" @click="doCopy(infos.accountInfo.account)">
          <b>{{infos.emailInfo.email}}</b>
        </div>
      </ElFormItem>
      <!-- <ElFormItem label="任务动作">
        <div class="flex">
          <ElSelect style="flex: 1; margin-right: 20px" v-model="taskActionData.value">
            <ElOption v-for="item in taskActionList" :label="item.label" :value="item.value" :key="item.value"></ElOption>
          </ElSelect>
          <ElButton class="btn" type="text" @click="excute('action1')" :disabled="disabledBtn">执行</ElButton>
        </div>
      </ElFormItem>-->
    </ElForm>
    <div class="hr"></div>
    <ElForm size="mini" label-position="left" ref="form2" label-width="120px" :show-message="true" :model="resultData">
      <ElFormItem class="checkbox" label="完成结果" prop="value" :rules="[{required: true, message: '请选择结果'}]">
        <div class="flex">
          <ElRadioGroup class="flex1 w100" v-model="resultData.value">
            <ElRadio :label="0">成功</ElRadio>
            <ElRadio :label="1">失败</ElRadio>
          </ElRadioGroup>
          <ElButton class="btn" type="text" :disabled="disabledBtn" :loading="loading1" @click="submitResult">完成</ElButton>
        </div>
      </ElFormItem>
      <ElFormItem
        :key="resultData.value + 1"
        v-if="infos.taskInfo.orderTaskFlag && resultData.value == 0"
        label="订单ID"
        :prop="!resultData.value ? `orderNum` : null"
        :rules="[{required: !resultData.value, message: '请输入订单ID'}]"
      >
        <el-input maxlength="100" v-model="resultData.orderNum" placeholder></el-input>
      </ElFormItem>
      <ElFormItem
        :key="resultData.value + 2"
        v-if="infos.taskInfo.orderTaskFlag && resultData.value == 0"
        label="购买金额"
        :required="!resultData.value"
        :prop="!resultData.value ? `feeTotal` : null"
        :rules="[{required: !resultData.value, message: '请输入购买金额'}]"
      >
        <el-input-number
          :min="0.01"
          :controls="false"
          :precision="2"
          v-model="resultData.feeTotal"
          placeholder
          style="width:100%;"
        ></el-input-number>
      </ElFormItem>
      <template v-if="infos.taskInfo.orderTaskFlag && resultData.value == 0 && infos.taskInfo.relHandle == 3">
        <ElFormItem
          :key="resultData.value + infos.taskInfo.relHandle"
          label="关联订单ID"
          :prop="`relOrderNum`"
          :rules="[{required: true, message: '请输入关联订单ID'}]"
        >
          <el-input maxlength="100" v-model="resultData.relOrderNum" placeholder></el-input>
        </ElFormItem>
        <ElFormItem
          :key="resultData.value + infos.taskInfo.relHandle"
          label="关联购买金额"
          :prop="`relFeeTotal`"
          :rules="[{required: true, message: '请输入关联购买金额'}]"
        >
          <el-input-number
            :min="0.01"
            :controls="false"
            :precision="2"
            v-model="resultData.relFeeTotal"
            placeholder
            style="width:100%;"
          ></el-input-number>
        </ElFormItem>
      </template>
      <ElFormItem
        v-if="resultData.value == 1"
        label="失败原因"
        prop="failCause"
        :rules="[{required: true, message: '请选择失败原因'}]"
      >
        <ElSelect v-model="resultData.failCause">
          <ElOption label="收货人地址异常" :value="0"></ElOption>
          <ElOption label="信用卡异常" :value="1"></ElOption>
          <ElOption label="找不到产品" :value="2"></ElOption>
          <ElOption label="其它" :value="3"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem style="margin-top:20px" label-width="0">
        <el-input maxlength="500" v-model="resultData.result" placeholder="结果反馈内容" :rows="2" type="textarea"></el-input>
      </ElFormItem>
    </ElForm>
    <div class="hr"></div>
    <el-tabs style="min-height: 200px" v-model="activeName">
      <el-tab-pane name="6" label="基本信息">
        <!-- {{infos}} -->
        <ElForm size="mini" class="customForm" label-position="right" label-width="100px">
          <ElFormItem label="平台站点">{{infos.platformSite}}</ElFormItem>
          <ElFormItem label="终端类型">{{infos.terminalType == 1 ? '手机' :'PC'}}</ElFormItem>
          <ElFormItem label="终端编号">{{infos.terminalNo}}</ElFormItem>
          <ElFormItem v-if="infos.taskInfo.orderTaskFlag" label="上次购买时间">{{infos.prePayTime}}</ElFormItem>
        </ElForm>
      </el-tab-pane>

      <el-tab-pane name="1" label="任务信息">
        <!-- {{infos}} -->
        <ElForm v-if="infos.taskInfo" size="mini" class="customForm" label-position="right" label-width="100px">
          <ElFormItem label="任务类型">{{infos.taskInfo.taskType}}</ElFormItem>
          <ElFormItem label="任务时间">{{infos.taskInfo.taskTime}}</ElFormItem>
          <ElFormItem label="关键词" v-if="!infos.taskInfo.reviewTaskFlag">{{infos.taskInfo.searchParam}}</ElFormItem>
          <ElFormItem
            v-if="infos.taskInfo.relHandle && !infos.taskInfo.reviewTaskFlag"
            label="关联操作"
          >{{infos.taskInfo.relHandle == 1 ? '浏览' : infos.taskInfo.relHandle == 2 ? '加购' : '购买' }}</ElFormItem>
        </ElForm>
      </el-tab-pane>
      <template v-if="!infos.taskInfo.reviewTaskFlag">
        <el-tab-pane name="2" label="收货人" v-if="infos.taskInfo.orderTaskFlag">
          <ElForm size="mini" class="customForm" label-position="right" label-width="100px">
            <ElFormItem label="收件人">
              <div @click="doCopy(infos.taskInfo.consigneeName)">{{infos.taskInfo.consigneeName}}</div>
            </ElFormItem>
            <ElFormItem label="地址">
              <div
                @click="doCopy([
                      infos.taskInfo.consigneeAddressCountry,
                      infos.taskInfo.consigneeAddressState,
                      infos.taskInfo.consigneeAddressCity,
                      infos.taskInfo.consigneeAddressStreet,
                      infos.taskInfo.consigneeAddressOther,
                      ].join('; '))"
              >
                {{[
                infos.taskInfo.consigneeAddressCountry,
                infos.taskInfo.consigneeAddressState,
                infos.taskInfo.consigneeAddressCity,
                infos.taskInfo.consigneeAddressStreet,
                infos.taskInfo.consigneeAddressOther,
                ].join('; ')}}
              </div>
            </ElFormItem>
            <ElFormItem label="邮编">
              <div @click="doCopy(infos.taskInfo.consigneeZipcode)">{{infos.taskInfo.consigneeZipcode}}</div>
            </ElFormItem>
            <ElFormItem label="电话">
              <div @click="doCopy(infos.taskInfo.consigneePhone)">{{infos.taskInfo.consigneePhone}}</div>
            </ElFormItem>
          </ElForm>
          <!-- <div
            style="font-size:14px;font-weight: bold;"
            @click="doCopy([
          infos.taskInfo.consigneeName,
          infos.taskInfo.consigneePhone,
          infos.taskInfo.consigneeAddressCountry,
          infos.taskInfo.consigneeAddressState,
          infos.taskInfo.consigneeAddressCity,
          infos.taskInfo.consigneeAddressStreet,
          infos.taskInfo.consigneeAddressOther,
          ].join('; '))"
          >
            {{[
            infos.taskInfo.consigneeName,
            infos.taskInfo.consigneePhone,
            infos.taskInfo.consigneeAddressCountry,
            infos.taskInfo.consigneeAddressState,
            infos.taskInfo.consigneeAddressCity,
            infos.taskInfo.consigneeAddressStreet,
            infos.taskInfo.consigneeAddressOther,
            ].join('; ')}}
          </div>-->
        </el-tab-pane>

        <el-tab-pane name="4" label="产品信息">
          <el-form class="customForm" size="mini" label-position="right" label-width="100px">
            <el-form-item label-width="0">
              <div class="flex flex-start">
                <div class="flex flex-center img-wrapper" style="width:100px">
                  <el-tooltip placement="top" effect="light">
                    <img slot="content" width="200" :src="infos.taskInfo.imgUrl" />
                    <img :src="infos.taskInfo.imgUrl" />
                  </el-tooltip>
                </div>

                <div
                  @click="doCopy(infos.taskInfo.productTitle)"
                  class="wrap-overflow-2"
                  :title="infos.taskInfo.productTitle"
                >{{infos.taskInfo.productTitle}}</div>
              </div>
            </el-form-item>
            <el-form-item label="产品ID">
              <div @click="doCopy(infos.taskInfo.productId)">{{infos.taskInfo.productId}}</div>
            </el-form-item>
            <el-form-item v-if="isAmazon" label="父产品ID">
              <div @click="doCopy(infos.taskInfo.parentProductId)">{{infos.taskInfo.parentProductId}}</div>
            </el-form-item>
            <el-form-item label="成交SKU属性">
              <div @click="doCopy(infos.taskInfo.sku)">{{infos.taskInfo.sku}}</div>
            </el-form-item>
            <el-form-item label="产品金额">
              <div @click="doCopy(infos.taskInfo.productMoney)">{{infos.taskInfo.productMoney}}</div>
            </el-form-item>
            <el-form-item label="店铺名称">
              <div @click="doCopy(infos.taskInfo.storeName)">{{infos.taskInfo.storeName}}</div>
            </el-form-item>
            <el-form-item v-if="infos.taskInfo.deliver != null" label="发货方式">
              <div @click="doCopy(infos.taskInfo.deliver)">{{infos.taskInfo.deliver == 0 ? 'FBA' : 'FBM'}}</div>
            </el-form-item>
            <el-form-item v-if="infos.terminalType == 1" label="APP截图">
              <div>
                <div class="flex flex-center img-wrapper" style="width:100px">
                  <el-tooltip placement="top" effect="light">
                    <img slot="content" width="200" :src="infos.taskInfo.appPrintscreen" />
                    <img :src="infos.taskInfo.appPrintscreen" />
                  </el-tooltip>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane v-if="infos.taskInfo.relHandle" name="5" label="关联产品信息">
          <el-form class="customForm" size="mini" label-position="right" label-width="100px">
            <el-form-item label="产品标题">
              <div @click="doCopy(infos.taskInfo.relProductTitle)">{{infos.taskInfo.relProductTitle}}</div>
            </el-form-item>
            <el-form-item label="产品ID">
              <div @click="doCopy(infos.taskInfo.relProductId)">{{infos.taskInfo.relProductId}}</div>
            </el-form-item>
            <el-form-item v-if="isAmazon" label="父产品ID">
              <div @click="doCopy(infos.taskInfo.relParentProductId)">{{infos.taskInfo.relParentProductId}}</div>
            </el-form-item>
            <el-form-item label="成交SKU属性">
              <div @click="doCopy(infos.taskInfo.relSku)">{{infos.taskInfo.relSku}}</div>
            </el-form-item>
            <el-form-item label="产品金额">
              <div @click="doCopy(infos.taskInfo.relProductMoney)">{{infos.taskInfo.relProductMoney}}</div>
            </el-form-item>
            <el-form-item label="店铺名称">
              <div @click="doCopy(infos.taskInfo.relSeller)">{{infos.taskInfo.relSeller}}</div>
            </el-form-item>
            <el-form-item v-if="infos.taskInfo.relDeliver != null && isAmazon" label="发货方式">
              <div @click="doCopy(infos.taskInfo.relDeliver)">{{infos.taskInfo.relDeliver == 0 ? 'FBA' : 'FBM'}}</div>
            </el-form-item>
            <el-form-item v-if="infos.terminalType == 1" label="APP截图">
              <div>
                <div class="flex flex-center img-wrapper" style="width:100px">
                  <el-tooltip placement="top" effect="light">
                    <img slot="content" width="200" :src="infos.taskInfo.relAppPrintscreen" />
                    <img :src="infos.taskInfo.relAppPrintscreen" />
                  </el-tooltip>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </template>
      <ElTabPane label="评价点Helpful参数" v-if="infos.taskInfo.param && infos.taskInfo.param.helpfulNum">
        <el-form class="customForm" size="mini" label-position="right" label-width="100px">
          <el-form-item label="排序方式">
            <div>{{infos.taskInfo.param.sortBy}}</div>
          </el-form-item>
          <el-form-item label="评分">
            <div>{{infos.taskInfo.param.grade}}</div>
          </el-form-item>
          <el-form-item label="评价数量">
            <span slot="label">
              评价数量
              <ElTooltip content="按排序方式，前N条" placement="top">
                <span>?</span>
              </ElTooltip>
            </span>
            <div>{{infos.taskInfo.param.helpfulNum}}</div>
          </el-form-item>
        </el-form>
      </ElTabPane>
      <ElTabPane label="QA内容" v-if="infos.taskInfo.param && infos.taskInfo.param.qaContent">
        <el-form class="customForm" size="mini" label-position="right" label-width="100px">
          <el-form-item label="问题">
            <div @click="doCopy(infos.taskInfo.param.qaContent)">{{infos.taskInfo.param.qaContent}}</div>
          </el-form-item>
        </el-form>
      </ElTabPane>
      <ElTabPane label="Review评价内容" v-if="infos.taskInfo.reviewTaskFlag">
        <el-form class="customForm" size="mini" label-position="right" label-width="100px">
          <el-form-item label-width="0">
            <div class="flex flex-start">
              <div class="flex flex-center img-wrapper" style="width:100px">
                <el-tooltip placement="top" effect="light">
                  <img slot="content" width="200" :src="infos.taskInfo.imgUrl" />
                  <img :src="infos.taskInfo.imgUrl" />
                </el-tooltip>
              </div>
              <div
                @click="doCopy(infos.taskInfo.productId)"
                class="wrap-overflow-2"
                :title="infos.taskInfo.productId"
              >{{infos.taskInfo.productId}}</div>
            </div>
          </el-form-item>
          <el-form-item label="订单ID">
            <div @click="doCopy(infos.taskInfo.param.orderNum)">{{infos.taskInfo.param.orderNum}}</div>
          </el-form-item>
          <el-form-item label="标题" v-if="isAmazon">
            <div @click="doCopy(infos.taskInfo.param.reviewTitle)">{{infos.taskInfo.param.reviewTitle}}</div>
          </el-form-item>
          <el-form-item label="内容">
            <div @click="doCopy(infos.taskInfo.param.reviewContent)">{{infos.taskInfo.param.reviewContent}}</div>
          </el-form-item>
          <el-form-item label="评分">
            <div @click="doCopy(infos.taskInfo.param.grade)">{{infos.taskInfo.param.grade}}</div>
          </el-form-item>
          <el-form-item label="评价图片">
            <span slot="label">
              评价图片
              <ElTooltip content="注意：下载图片到本地目录，每个账号保存的目录尽可能不一样" placement="top">
                <span>?</span>
              </ElTooltip>
            </span>
            <div class="flex flex-start">
              <el-tooltip placement="top" effect="light" v-if="infos.taskInfo.param.imgUrlOne">
                <img slot="content" width="200" :src="infos.taskInfo.param.imgUrlOne" />
                <div>
                  <img :src="infos.taskInfo.param.imgUrlOne" />
                  <ElButton type="text" @click="doCopy(infos.taskInfo.param.imgUrlOne)">复制URL</ElButton>
                  <br />
                  <ElButton type="text" @click="openDownloadDialog(infos.taskInfo.param.imgUrlOne)">下载</ElButton>
                </div>
              </el-tooltip>
              <el-tooltip placement="top" effect="light" v-if="infos.taskInfo.param.imgUrlTwo">
                <img slot="content" width="200" :src="infos.taskInfo.param.imgUrlTwo" />
                <div>
                  <img :src="infos.taskInfo.param.imgUrlTwo" />
                  <ElButton type="text" @click="doCopy(infos.taskInfo.param.imgUrlTwo)">复制URL</ElButton>
                  <br />
                  <ElButton type="text" @click="openDownloadDialog(infos.taskInfo.param.imgUrlTwo)">下载</ElButton>
                </div>
              </el-tooltip>
              <el-tooltip placement="top" effect="light" v-if="infos.taskInfo.param.imgUrlThree">
                <img slot="content" width="200" :src="infos.taskInfo.param.imgUrlThree" />
                <div>
                  <img :src="infos.taskInfo.param.imgUrlThree" />
                  <ElButton type="text" @click="doCopy(infos.taskInfo.param.imgUrlThree)">复制URL</ElButton>
                  <br />
                  <ElButton type="text" @click="openDownloadDialog(infos.taskInfo.param.imgUrlThree)">下载</ElButton>
                </div>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-form>
      </ElTabPane>
    </el-tabs>
    <div class="hr"></div>
    <ElForm
      size="mini"
      label-position="left"
      label-width="80px"
      :show-message="true"
      ref="form3"
      inline-message
      :model="errorData"
    >
      <ElFormItem label="账号异常" class="checkbox" prop="value" :rules="[{required: true, message: '请选择异常原因'}]">
        <div class="flex">
          <ElRadioGroup class="flex1 w100" v-model="errorData.value">
            <ElRadio :label="0">不能登录</ElRadio>
            <ElRadio :label="1">不能评价</ElRadio>
          </ElRadioGroup>
          <ElButton class="btn" type="text" :disabled="disabledBtn" :loading="loading2" @click="submitError">反馈</ElButton>
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
import VueClipboard from 'vue-clipboard2'
import Vue from 'vue'
Vue.use(VueClipboard)
export default {
  props: {
    data: {
      default: () => ({
        taskInfo: {
          paramMapList: []
        },
        emailInfo: {},
        accountInfo: {}
      })
    }
  },
  data() {
    return {
      loading1: false,
      loading2: false,
      disabledBtn: false,
      loading: false,
      errorData: {
        value: null
      },
      // infos: {
      //   taskInfo: {
      //     paramMapList: []
      //   },
      //   accountInfo: {}
      // },
      activeName: '1',
      taskActionData: {
        value: null
      },
      resultData: {},
      taskActionList: [
        {
          label: '输入关键词1',
          value: 1
        },
        {
          label: '输入关键词2',
          value: 2
        },
        {
          label: '输入平台账号',
          value: 3
        },
        {
          label: '输入平台密码',
          value: 8
        },
        {
          label: '输入收货人信息',
          value: 4
        },
        {
          label: '输入信用卡信息',
          value: 5
        },
        {
          label: '输入邮箱账号',
          value: 6
        },
        {
          label: '输入邮箱密码',
          value: 7
        }
      ]
    }
  },
  computed: {
    isAmazon() {
      return this.infos.platformCode == 'amazon'
    }
  },
  methods: {
    submitError() {
      let vm = this
      this.$refs.form3.validate().then(() => {
        this.$confirm('请确认该账号是否出现异常？', '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          center: true,
          type: 'warning',
          customClass: 'custom-popup'
        })
          .then(() => {
            vm.disabledBtn = true
            this.loading2 = true
            this.$api[`main/extensionFeedback`]({
              accountId: this.infos.accountId,
              accountException: this.errorData.value,
              taskSubParamId: this.infos.taskSubParamId,
              taskAllotId: this.infos.taskAllotId
            })
              .then(() => {
                this.$emit('success', 1)
              })
              .catch(() => {
                vm.disabledBtn = false
                this.loading2 = false
              })
          })
          .catch(() => {
            vm.loading2 = false
          })
      })
    },
    submitResult() {
      let vm = this

      this.$refs.form2.validate().then(() => {
        vm.loading1 = true
        vm.disabledBtn = true
        this.$api[`main/extensionComplete`]({
          taskSubParamId: this.infos.taskSubParamId,
          accountId: this.infos.accountId,
          result: this.resultData.value,
          orderNum: this.resultData.orderNum,
          relOrderNum: this.resultData.relOrderNum,
          relFeeTotal: this.resultData.relFeeTotal,
          feeTotal: this.resultData.feeTotal,
          failCause: this.resultData.failCause,
          taskAllotId: this.infos.taskAllotId,
          feedback: this.resultData.result
        })
          .then(() => {
            this.$emit('success', 2)
          })
          .catch(() => {
            vm.disabledBtn = false
            this.loading1 = false
          })
      })
    },
    doCopy(text) {
      this.$copyText(text)
        .then(res => {
          this.$message.success('复制成功')
        })
        .catch(err => {})
    }
  },
  computed: {
    infos() {
      if (!this.data) {
        return {
          taskInfo: {
            paramMapList: []
          },
          accountInfo: {}
        }
      }
      return this.data
    }
  }
}
</script>

<style lang='scss' scoped>
body {
  margin: 0;
  padding: 10px;
}
.main {
  // margin: 6px 0;
  // font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // width: 320px;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  & /deep/ .el-card {
    margin-bottom: 16px;
    padding: 10px;
  }
  & /deep/ .el-form-item__content {
    text-align: left;
    font-weight: bold;
  }
  & /deep/ .checkbox {
    height: 20px;
    & /deep/ .el-form-item__content,
    & /deep/ .el-form-item__label,
    & /deep/ .flex {
      line-height: 20px;
      height: 20px;
    }
  }
  & /deep/ .el-radio {
    margin-right: 16px;
  }
  & /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
}
.flex {
  display: flex;
  align-items: center;
  .img-wrapper {
    justify-content: flex-end;
  }
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    margin-right: 8px;
  }
}
.flex1 {
  flex: auto;
  display: flex;
}

.w100 {
  width: 100%;
  text-align: left;
}
.custom-popup {
  width: 300px;
}
@mixin wrap-overflow($clamp: 3) {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: $clamp;
  /* autoprefixer: ignore next */
  -webkit-box-orient: vertical;
}
.btn {
  margin-left: 20px;
}

.wrap-overflow-2 {
  @include wrap-overflow(2);
  line-height: 1.6;
  cursor: pointer;
}
.flex-start {
  align-items: flex-start;
}

.hr {
  margin-top: 16px;
  margin-bottom: 16px;
  border-top: 1px dashed #ddd;
  padding: 0;
}

.flex-center {
  justify-content: flex;
}

// .el-form-item__content > div {
//   line-height: 20px
// }
</style>
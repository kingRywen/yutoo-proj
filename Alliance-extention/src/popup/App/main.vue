<template>
  <div v-loading="loading" id="login" class="show">
    <!-- {{infos}} -->
    <!-- <el-button type="text" @click="loginAct(3)">loginAct</el-button>
    <el-button type="text" @click="loginAct(8)">loginAct</el-button>-->
    <div v-if="!logged" class="login-wrapper">
      <!-- {{curSites}}1 -->
      <div ref="form" class="input my-form" id="login-form">
        <!-- <div class="input_wrapper">
          <select name="platform" required v-model="platformCode" @change="handlePlatChange" errmsg="请选择平台">
            <option v-for="item in platformInfo.platform" :key="item.code" :value="item.code">{{item.enName}}</option>
          </select>
        </div>-->

        <div class="input_wrapper">
          <select name="site" required v-model="platformSiteId" errmsg="请选择站点">
            <option v-for="item in curSites" :value="item.countryCode" :key="item.countryCode">{{item.cnName}}</option>
          </select>
        </div>
        <div class="input_wrapper">
          <input name="account" autocomplete="off" required type="email" errmsg="请输入账号" placeholder="请输入账号" />
        </div>

        <button id="login_btn" :disabled="logging" @click="login">
          <i class="iconfont loading" :class="{hidden: !logging}">&#xe618;</i>
          <span>登录</span>
        </button>
      </div>
    </div>
    <!-- 信息 -->
    <div v-else id="app" class="popup-content">
      <div id="display-container">
        <div class="main">
          <ElForm
            label-position="left"
            ref="form1"
            size="mini"
            label-width="80px"
            :show-message="false"
            inline-message
            :model="taskActionData"
          >
            <ElFormItem label="切换站点">
              <select v-model="platformSiteId" @change="handleSiteChange">
                <option v-for="item in curSites" :value="item.countryCode" :key="item.countryCode">{{item.cnName}}</option>
              </select>
            </ElFormItem>
            <ElFormItem label="账  号">
              <div class="flex" style="cursor:pointer" @click="doCopy(infos.accountInfo.account)">
                <b>{{infos.accountInfo.account}}</b>
              </div>
            </ElFormItem>
            <ElFormItem v-if="infos && !infos.noTask" label="任务动作">
              <div class="flex">
                <ElSelect style="flex: 1; margin-right: 20px" v-model="taskActionData.value">
                  <ElOption v-for="item in taskActionList" :label="item.label" :value="item.value" :key="item.value"></ElOption>
                </ElSelect>
                <ElButton class="btn" type="text" @click="excute('action1')" :disabled="disabledBtn">执行</ElButton>
              </div>
            </ElFormItem>
          </ElForm>
          <div class="hr"></div>
          <template v-if="!infos.noTask">
            <ElForm
              size="mini"
              label-position="left"
              ref="form2"
              label-width="110px"
              :show-message="true"
              :model="resultData"
            >
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
                :key="resultData.value"
                v-if="infos.taskInfo.orderTaskFlag && resultData.value == 0"
                label="订单ID"
                :prop="!resultData.value ? `orderNum` : null"
                :rules="[{required: !resultData.value, message: '请输入订单ID'}]"
              >
                <el-input maxlength="100" v-model="resultData.orderNum" placeholder></el-input>
              </ElFormItem>
              <ElFormItem
                :key="resultData.value"
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
              <el-tab-pane name="6" label="基本">
                <!-- {{infos}} -->
                <ElForm size="mini" class="customForm" label-position="right" label-width="100px">
                  <ElFormItem label="平台站点">{{infos.platformSite}}</ElFormItem>
                  <ElFormItem label="终端类型">{{infos.terminalType == 1 ? '手机' :'PC'}}</ElFormItem>
                  <ElFormItem label="终端编号">{{infos.terminalNo}}</ElFormItem>
                  <ElFormItem v-if="infos.taskInfo.orderTaskFlag" label="上次购买时间">{{infos.prePayTime}}</ElFormItem>
                </ElForm>
              </el-tab-pane>

              <el-tab-pane name="1" label="任务">
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

                <el-tab-pane name="4" label="产品">
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
                <el-tab-pane v-if="infos.taskInfo.relHandle" name="5" label="关联产品">
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
              <ElTabPane label="评价点Helpful参数" name="6" v-if="infos.taskInfo.param && infos.taskInfo.param.helpfulNum">
                <el-form class="customForm" size="mini" label-position="right" label-width="100px">
                  <el-form-item label="排序方式">
                    <div>{{infos.taskInfo.sortBy}}</div>
                  </el-form-item>
                  <el-form-item label="评分">
                    <div>{{infos.taskInfo.grade}}</div>
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
              <ElTabPane label="QA内容" name="7" v-if="infos.taskInfo.param && infos.taskInfo.param.qaContent">
                <el-form class="customForm" size="mini" label-position="right" label-width="100px">
                  <el-form-item label="问题">
                    <div @click="doCopy(infos.taskInfo.param.qaContent)">{{infos.taskInfo.param.qaContent}}</div>
                  </el-form-item>
                </el-form>
              </ElTabPane>
              <ElTabPane label="Review评价内容" name="8" v-if="infos.taskInfo.reviewTaskFlag">
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
                          <br />
                          <ElButton type="text" @click="doCopy(infos.taskInfo.param.imgUrlOne)">复制URL</ElButton>
                          <br />
                          <ElButton type="text" @click="openDownloadDialog(infos.taskInfo.param.imgUrlOne)">下载</ElButton>
                        </div>
                      </el-tooltip>
                      <el-tooltip placement="top" effect="light" v-if="infos.taskInfo.param.imgUrlTwo">
                        <img slot="content" width="200" :src="infos.taskInfo.param.imgUrlTwo" />
                        <br />
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
                          <br />
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
          </template>

          <NonePage style="height: 300px" v-else text="没有更多任务了" />

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
            <ElFormItem label="账号异常" class="checkbox last" prop="value" :rules="[{required: true, message: '请选择异常原因'}]">
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
      </div>
    </div>
  </div>
</template>

<script>
import secret from './secret'
import MyForm from './form'
const Decrypt = secret.Decrypt

export default {
  name: 'app',
  props: ['platformCode', 'curSites'],
  data() {
    let logged = !!window.items[this.platformCode]

    return {
      hasInfo: false,
      platformSiteId: this.curSites.find(el => el.cnName.indexOf('美国') > -1)
        .countryCode,
      // curSites: [],
      // platformInfo: {},
      logging: false,
      logged: logged,
      loading1: false,
      loading2: false,
      disabledBtn: false,
      loading: false,
      errorData: {
        value: null
      },
      infos: {
        taskInfo: {
          paramMapList: []
        },
        noTask: true,
        accountInfo: {}
      },
      activeName: '6',
      taskActionData: {
        value: null
      },
      resultData: {},
      taskActionList: [
        {
          label: '输入关键词',
          value: 1
        },
        // {
        //   label: '输入关键词2',
        //   value: 2
        // },
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
        // {
        //   label: '输入信用卡信息',
        //   value: 5
        // },
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
  mounted() {
    let vm = this
    if (this.$refs.form) {
      this.__form = new MyForm(this.$refs.form)
    }
    // chrome.storage.sync.set({ account: null, platform: null })
    // chrome.storage.sync.get(
    //   { account: null, platform: null, platformCode: null, site: null },
    //   function(items) {
    //     if (items.account) {
    //       vm.logging = false
    //       vm.logged = true
    //       vm.getData(items)
    //     }
    //   }
    // )

    chrome.storage.sync.get(
      {
        // account: null,
        // platform: null,
        // platformCode: null,
        // site: null
        [vm.platformCode]: null
      },
      function(items) {
        // debugger
        if (items && items[vm.platformCode]) {
          items = JSON.parse(items[vm.platformCode])
          items = { ...items, platform: vm.platformCode }
          vm.logging = false
          vm.hasInfo = true
          vm.logged = true
          vm._items = items
          // vm.$emit('setLog', vm.logged)
          vm.getData(items)
        }
      }
    )

    // this.bgPage = chrome.extension.getBackgroundPage()
    // this.init()
  },
  watch: {
    logged: {
      immediate: true,
      handler(val) {
        this.$emit('setLog', val)
      }
    }
  },
  created() {
    // if (!this.logged) {
    //   this.getPlatformInfo()
    // }
    this.disabledBtn = false
    this.loading1 = false
    this.loading2 = false
  },
  computed: {
    isAmazon() {
      return this.infos.platformCode == 'amazon'
    }
  },
  methods: {
    // handlePlatChange(e) {
    //   // this.platformSiteId = ''
    //   // this.curSites = this.platformInfo.platformSite.filter(
    //   //   el => el.platformCode === e.target.value
    //   // )
    //   // .map(el => ({ label: el.cnName, value: el.platformSiteId }))
    // },

    handleSiteChange(platformSiteId) {
      this.init(null, null, this._items)
    },

    openDownloadDialog(url, saveName) {
      if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = url
      aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        )
      }
      aLink.dispatchEvent(event)
    },
    setCache(value) {
      chrome.storage.sync.set(
        { [this.platformCode]: JSON.stringify(value) },
        function() {
          console.log('保存信息成功')
        }
      )
    },
    login() {
      let vm = this
      if (this.__form.validate()) {
        let params = { ...this.__form.value, platform: this.platformCode }
        this._items = params
        this.logging = true
        this.init(
          () => {
            vm.logging = false
            vm.hasInfo = true
            vm.logged = true
            vm.setCache({ ...this.__form.value })
          },
          () => {
            vm.logging = false
            vm.hasInfo = true
          },
          params
        )
      }
    },
    clickbtn() {
      this.sendMessageToContentScript(
        {
          cmd: 'test_move'
        },
        res => {}
      )
    },
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
            this._fetch(
              '/extension/feedback',
              {
                accountId: this.infos.accountId,
                accountException: this.errorData.value,
                taskSubParamId: this.infos.taskSubParamId,
                taskAllotId: this.infos.taskAllotId
              },
              res => {
                vm.loading2 = false
                vm.disabledBtn = true
                setTimeout(() => {
                  chrome.storage.sync.get(
                    {
                      // account: null,
                      // platform: null,
                      // platformCode: null,
                      // site: null
                      [vm.platformCode]: null
                    },
                    function(items) {
                      items = JSON.parse(items[vm.platformCode])
                      items = { ...items, platform: vm.platformCode }
                      if (items.account) {
                        vm.getData(items)
                      }
                    }
                  )
                }, 400)
              },
              res => {
                vm.disabledBtn = false
                vm.loading2 = false
              }
            )
          })
          .catch(() => {
            vm.disabledBtn = false
            vm.loading2 = false
          })
      })
    },
    submitResult() {
      let vm = this

      this.$refs.form2.validate().then(() => {
        vm.loading1 = true
        vm.disabledBtn = true
        this._fetch(
          '/extension/complete',
          {
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
          },
          res => {
            vm.loading1 = false
            vm.disabledBtn = true

            setTimeout(() => {
              chrome.storage.sync.get(
                {
                  // account: null,
                  // platform: null,
                  // platformCode: null,
                  // site: null
                  [vm.platformCode]: null
                },
                function(items) {
                  items = JSON.parse(items[vm.platformCode])
                  items = { ...items, platform: vm.platformCode }
                  if (items.account) {
                    vm.getData(items)
                  }
                }
              )
            }, 400)
          },
          res => {
            vm.disabledBtn = false
            vm.loading1 = false
            setTimeout(() => {
              chrome.storage.sync.get(
                {
                  // account: null,
                  // platform: null,
                  // platformCode: null,
                  // site: null
                  [vm.platformCode]: null
                },
                function(items) {
                  items = JSON.parse(items[vm.platformCode])
                  items = { ...items, platform: vm.platformCode }
                  if (items.account) {
                    vm.getData(items)
                  }
                }
              )
            }, 400)
          }
        )
      })
    },
    _fetch(url, params, cb, errCb) {
      this.loading = true
      let bgPage = chrome.extension.getBackgroundPage()
      bgPage.fetchData(
        { url, params },
        res => {
          this.loading = false
          // if (res.data.code == 0) {
          //   this.$message.success(res.data.msg)
          // } else {
          //   this.$message.error(res.data.msg)
          // }
          if (cb) cb(res)
        },
        res => {
          this.loading = false
          // this.$message.error(res.data.msg)
          if (errCb) {
            errCb(res)
          }
        }
      )
    },
    getData(params) {
      this.loading = true
      let vm = this
      let bgPage = chrome.extension.getBackgroundPage()
      bgPage.fetchData(
        { url: '/extension/taskInfo', params },
        res => {
          vm.loading = false
          try {
            let infos = JSON.parse(Decrypt(res.data.rows))
            if (!infos) {
              vm.infos = {
                accountInfo: {
                  account: params.account
                },
                noTask: true
              }
              return
            }
            if (!infos.taskInfo.param) {
              infos.taskInfo.param = {}
            }

            infos.platformCode = params.platform
            infos.noTask = false
            console.log(infos)

            vm.infos = infos
          } catch (error) {
            vm.loading = false
            if (!res.data.rows) {
              vm.infos = {
                accountInfo: {
                  account: params.account
                },
                noTask: true
              }
              return
            }

            res.data.rows.platformCode = params.platform
            res.data.rows.noTask = false
            vm.infos = res.data.rows
          }
        },
        () => {
          vm.loading = false
        }
      )
    },
    init(cb, errCb, params) {
      this.loading = true
      let vm = this
      let bgPage = chrome.extension.getBackgroundPage()
      params = params || this.__form.value
      params.site = this.platformSiteId
      // let [platformCode,countryCode] = params.platformSiteId.split('-')
      // params.countryCode =
      bgPage.fetchData(
        { url: '/extension/taskInfo', params },
        res => {
          cb && cb()
          vm.loading = false
          try {
            let infos = JSON.parse(Decrypt(res.data.rows))
            if (!infos) {
              vm.infos = {
                accountInfo: {
                  account: params.account
                },
                noTask: true
              }
              return
            }
            if (!infos.taskInfo.param) {
              infos.taskInfo.param = {}
            }
            this.infos = {
              ...infos,
              noTask: false,
              platformCode: this.__form.value.platform
            }
          } catch (error) {
            vm.loading = false
            if (!res.data.rows) {
              vm.infos = {
                accountInfo: {
                  account: params.account
                },
                noTask: true
              }
              return
            }
            vm.infos = {
              ...res.data.rows,
              noTask: false,
              platformCode: this.__form.value.platform
            }
          }
        },
        () => {
          vm.loading = false
          errCb && errCb()
        }
      )
    },

    doCopy(text) {
      this.$copyText(text)
        .then(res => {
          this.$message.success('复制成功')
        })
        .catch(err => {})
    },
    excute(type) {
      console.log(this.taskActionData.value)
      if (this.taskActionData.value == null) {
        this.$confirm('请选择执行动作', '警告', {
          type: 'warning',
          customClass: 'custom-popup'
        })
          .then(() => {})
          .catch(() => {})
        return
      }
      switch (type) {
        case 'action1':
          // 任务动作
          if (this.taskActionData.value == 6) {
            // 输入邮箱账号
            this.loginOutlook(0)
          } else if (this.taskActionData.value == 7) {
            // 输入邮箱密码
            this.loginOutlook(1)
          } else if (this.taskActionData.value == 1) {
            // 搜索
            this.search()
          } else if (this.taskActionData.value == 2) {
            // 二次搜索
            this.search(true)
          } else if (
            this.taskActionData.value == 3 ||
            this.taskActionData.value === 8
          ) {
            // 登录账号
            this.loginAct(this.taskActionData.value)
          } else if (this.taskActionData.value == 4) {
            // 输入收货人信息
            this.consigneeInput()
          } else if (this.taskActionData.value == 5) {
            // 输入收货人信息
            this.creditInput()
          }
          break

        default:
          break
      }
    },
    consigneeInput() {
      this.sendMessageToContentScript(
        {
          cmd: 'consignee_input',
          platformCode: this.infos.platformCode,
          value: this.infos.taskInfo
        },
        res => {}
      )
    },
    creditInput() {
      this.sendMessageToContentScript(
        {
          cmd: 'credit_input',
          platformCode: this.infos.platformCode,
          value: this.infos.cardInfo
        },
        res => {}
      )
    },
    loginAct(typeNum) {
      this.sendMessageToContentScript(
        {
          cmd: 'login_account',
          platformCode: this.infos.platformCode,
          type: typeNum == 3 ? 'act' : 'pwd',
          value: {
            user: this.infos.accountInfo.account,
            pwd: this.infos.accountInfo.password
          }
        },
        res => {}
      )
    },
    loginOutlook(type) {
      this.sendMessageToContentScript(
        {
          cmd: 'login_eml',
          // value: {
          //   email: this.infos.emailInfo.email,
          //   emailPassword: this.infos.emailInfo.emailPassword
          // }
          type,
          value: {
            email: this.infos.emailInfo.email,
            emailPassword: this.infos.emailInfo.emailPassword
          }
          // value: {
          //   email: 'paulkbradley@sina.com',
          //   emailPassword: 'adsi190@'
          // }
        },
        res => {
          console.log('来自content.js的回复', res)
        }
      )
    },

    search(second = false) {
      if (second) {
        // 二次搜索
        this.sendMessageToContentScript(
          {
            cmd: 'second_search',
            value: this.infos.taskInfo.secondSearchParam,
            platformCode: this.infos.platformCode
          },
          res => {}
        )
        return
      }
      // 一次搜索
      this.sendMessageToContentScript(
        {
          cmd: 'search',
          value: this.infos.taskInfo.searchParam,
          platformCode: this.infos.platformCode
        },
        res => {}
      )
    },
    // 发消息给content.js
    sendMessageToContentScript(message, cb) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message, res => {
          if (cb) cb(res)
        })
      })
    }
  }
}
</script>

<style lang='scss'>
.loading {
  display: inline-block;
  // margin-top: 3px;
  width: 16px;
  height: 16px;
  animation: rotate 3s linear infinite;
  // transform: rotate(120deg);
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.el-message {
  min-width: 100px;
}
.el-tabs__item {
  padding: 0 11px;
}
body {
  margin: 0;
  // padding: 10px;
}
.main {
  // margin: 6px 0;
  font-family: PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
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
.el-radio {
  margin-right: 16px;
}
.w100 {
  width: 100%;
  text-align: left;
}
</style>
<style lang='scss'>
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
.el-card {
  margin-bottom: 16px;
  padding: 10px;
}
.el-form-item {
  margin-bottom: 12px !important;
}
.customForm .el-form-item {
  margin-bottom: 0px !important;
}
.el-form-item__content {
  text-align: left;
  font-weight: bold;
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
  margin-top: 10px;
  margin-bottom: 10px;
  border-top: 1px dashed #ddd;
}

.flex-center {
  justify-content: flex;
}
.checkbox {
  &.last {
    height: 30px;
    line-height: 30px;
    padding-bottom: 10px !important;
  }
  height: 20px;
  .el-form-item__content,
  .el-form-item__label,
  .flex {
    line-height: 20px;
    height: 20px;
  }
}
.el-input-number .el-input__inner {
  text-align: left;
}
// .el-form-item__content > div {
//   line-height: 20px
// }
.error_msg {
  margin-top: 2px;
  font-size: 12px;
  color: red;
  position: absolute;
  top: 100%;
  left: 0;
}
</style>

<style lang="scss" scoped>
$brand-primary: #4990e2;
$brand-hover: mix($brand-primary, #000, 40%);
.w100 {
  width: 100%;
}
.hidden {
  display: none;
}
.input_wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 1em;
  position: relative;
  label {
    width: 70px;
    flex: none;
    margin-right: 10px;
  }
}

button {
  white-space: nowrap;
  cursor: pointer;
  &.button-text {
    margin-left: 10px;
    color: $brand-primary;
    &:hover,
    &:active {
      color: $brand-hover;
    }
  }
}

input[type='input'],
input[type='email'],
input[type='password'],
input[type='select'],
select {
  font-size: 14px;
  box-sizing: border-box;
  // margin-bottom: 1.6em;
  width: 100%;
  border: 1px solid #a6a6a6;
  border-top-color: #949494;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.5),
    0 1px 0 rgba(0, 0, 0, 0.07) inset;
  outline: 0;
  background-color: #fff;
  height: 31px;
  padding: 3px 7px;
  line-height: normal;
  transition: all 0.1s linear;
  &:focus {
    border-color: #e77600;
    box-shadow: 0 0 3px 2px rgba(228, 121, 17, 0.5);
  }
  &::-webkit-input-placeholder {
    color: #a8a8a8;
    font-size: 14px;
  }
}

#login {
  min-width: 360px;

  min-height: 400px;
  max-width: 360px;
  // height: 100vh;
  display: flex;
  flex-direction: column;

  #login-form {
    transition: all 0.1s ease-in;
    .input_wrapper {
      margin-bottom: 1.6em;
    }
  }
  #app {
    min-width: 300px;
    // min-height: 430px;
    height: auto;
    max-width: 350px;
    padding: 10px;
    // padding: 20px 20px;
    font-size: 14px;
    transform: translateY(10px);
    // opacity: 0;
    transition: all 0.3s ease-in;
  }

  .input {
    // position: relative;
    // top: -2em;
    z-index: 222;
    background-color: #fff;
    height: 12em;
    margin: 0 1em;
    // border-radius: 0.2em;
    // box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    padding: 2em 1em;
    button {
      cursor: pointer;
      background: #f3d078;
      background: -webkit-linear-gradient(top, #f7dfa5, #f0c14b);
      background: linear-gradient(to bottom, #f7dfa5, #f0c14b);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset;
      width: 100% !important;
      border: 1px solid !important;
      height: 31px;
      border-radius: 3px;
      user-select: none;
      border-color: #a88734 #9c7e31 #846a29 !important;
      color: #111 !important;
      span {
        margin-left: 6px;
      }
      i {
        &.hidden {
          display: none;
        }
      }

      &:not(:disabled):hover {
        border-color: #a88734 #9c7e31 #846a29;
        background: #f1c860;
        background: -webkit-linear-gradient(top, #f5d78e, #eeb933);
        background: linear-gradient(to bottom, #f5d78e, #eeb933);
      }
      &:not(:disabled):active {
        border-color: #a88734 #9c7e31 #846a29;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) inset;
        background-color: #f0c14b;
      }
      &:disabled,
      &:disabled:hover,
      &:disabled:active {
        // pointer-events:none;
        cursor: not-allowed;
        background: #ddd;
        border-color: #a8a8a8 !important;
      }
    }
  }
  &.has-login {
    height: 800px;
    #login-form {
      // display: none;
      opacity: 0;
      transform-origin: top center;
      transform: scale(0);
    }
    .wrapper {
      height: 0;
    }
    .logo {
      display: none;
    }
    #app {
      opacity: 1;
      transform: translateY(0);
      // transition: all 0.2s ease-in;
    }
  }
}
</style>
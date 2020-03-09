<template>
  <div class="index-wrap">
    <universal-layout
      :isAmazon="true"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <section slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allbtn">
        <el-row>
          <el-button type="primary" size="small" @click="writeClick">写信</el-button>
          <el-dropdown size="small" split-button type="primary" class="dropdown-btn" @command="handleCommand">
            批量操作
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="客服">批量设置客服人员</el-dropdown-item>
              <el-dropdown-item command="标记">批量标记</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="small" @click="handleGetOrder">批量提取订单号</el-button>
          <el-button type="primary" size="small" @click="handleMove">移动分类</el-button>
          <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
        </el-row>
        <el-row>
          <el-col :span="19">
            <div class="filtrate">
              <span>快速筛选：</span>
              <button
                :class="{active: activeShow == index}"
                @click="handleQuickPick(index)"
                v-for="(item, index) in btnArr"
                :key="index"
              >{{item}}</button>
            </div>
          </el-col>

          <el-col :span="5">
            <div class="left-btn-sign">
              未回复统计：
              <span>{{noReplyNum}}</span>
              当天回复统计：
              <span>{{replyNum}}</span>
            </div>
          </el-col>
        </el-row>
      </section>
      <section slot="table">
        <yt-table
          :columns="tableColumns"
          reserveSelection="emailBaseId"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <el-table-column label="操作" width="110" slot="left">
            <template slot-scope="scope">
              <el-tooltip content="查看/回复" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleView(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="新窗口打开" offset="1" placement="bottom" effect="light">
                <!-- <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-document"
                  @click="handleDetail(scope.$index, scope.row)"
                ></el-button>-->
                <router-link
                  target="_blank"
                  :to="{path: '/viewEmail', query: {emailBaseId: scope.row.emailBaseId,emailType:1}}"
                >
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-document"
                    @click="handleDetail(scope.$index, scope.row)"
                  ></el-button>
                </router-link>
              </el-tooltip>
              <el-tooltip content="加入智能营销邮件黑名单" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-news"
                  @click="handleBlackAdd(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="邮件状态" width="70">
            <template slot-scope="scope">
              <span v-if="!scope.row.readStatus" class="normal-table-icon">
                <i class="iconfont">&#xe6f0;</i>
              </span>
              <span v-else class="normal-table-icon">
                <i class="iconfont">&#xe617;</i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="标题" width="120" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="display:inline-block;width:86px;" class="ellipsis-abbreviation">{{ scope.row.subject }}</span>
              <span v-if="scope.row.starFlag" class="normal-table-icon" style="position:absolute;top:16px;left: -14px;">
                <i class="el-icon-star-off"></i>
              </span>
            </template>
          </el-table-column>
        </yt-table>
      </section>
    </universal-layout>
    <menu-select
      :loadData="loadData"
      nodeKey="label"
      :defaultProps="{
        children: 'children',
        label: 'label',
        count: 'count',
        value: 'value'
      }"
      @nodeclick="nodeclick"
    ></menu-select>
    <!-- 写邮件dialog -->
    <yt-dialog :options="writeOptions" :key="WriteKeyIndex">
      <div v-if="writeFlag">
        <write
          @searchModule="searchModule"
          @handleNodeClick="handleNodeClick"
          @sendFlag="sendFlag"
          :emailType="1"
          :writeForm="writeForm"
        ></write>
      </div>
      <div v-if="!writeFlag">
        <div class="view-wrap">
          <div class="view-email">
            <div class="email-information">
              <el-row class="martop20">
                <el-col :span="2" :offset="2" class="title">平台订单号：</el-col>
                <el-col :span="4">
                  {{ emailReply.orderNumPlatform }}
                  <span v-if="!emailReply.orderNumPlatform" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">系统订单号：</el-col>
                <el-col :span="4">
                  {{ emailReply.orderNumSystem }}
                  <span v-if="!emailReply.orderNumSystem" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">订单来源：</el-col>
                <el-col :span="4">
                  {{ emailReply.storeName }}
                  <span v-if="!emailReply.storeName" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">客服人员：</el-col>
                <el-col :span="2">
                  {{ emailReply.serviceName }}
                  <span v-if="!emailReply.serviceName" style="opacity: 0">1</span>
                </el-col>
              </el-row>
              <el-row class="martop20">
                <el-col :span="2" :offset="2" class="title">客户姓名：</el-col>
                <el-col :span="4">
                  {{ emailReply.customerName }}
                  <span v-if="!emailReply.customerName" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">Item ID：</el-col>
                <el-col :span="4">
                  {{ emailReply.itemId }}
                  <span v-if="!emailReply.itemId" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">邮箱：</el-col>
                <el-col :span="4">
                  {{ emailReply.customerEmailBox }}
                  <span v-if="!emailReply.customerEmailBox" style="opacity: 0">1</span>
                </el-col>
              </el-row>
              <el-row class="martop20">
                <el-col :span="2" :offset="2" class="title">主题：</el-col>
                <el-col :span="20">
                  {{ emailReply.subject }}
                  <span v-if="!emailReply.subject" style="opacity: 0">1</span>
                </el-col>
              </el-row>
            </div>
            <div ref="emailContent"></div>
          </div>
        </div>
      </div>
      <div class="view-btn-group" slot="footer" v-if="!writeFlag">
        <el-row class="martop">
          <el-col :span="21">
            <el-button type="primary" size="small" class="marright10" @click="handleReply(emailReply)">回复</el-button>
            <el-dropdown size="small" split-button type="primary" class="dropdown-btn" @command="handleCommandSeting">
              标记为
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">设置已读</el-dropdown-item>
                <el-dropdown-item :command="2">设置未读</el-dropdown-item>
                <el-dropdown-item :command="3">设置已回复</el-dropdown-item>
                <el-dropdown-item :command="4">设置未回复</el-dropdown-item>
                <el-dropdown-item :command="5">标记星标</el-dropdown-item>
                <el-dropdown-item :command="6">撤销星标</el-dropdown-item>
                <el-dropdown-item :command="7">设置不需要回复</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              class="marleft10"
              size="small"
              @click="handleBlackAdd(emailReply.emailBaseId)"
            >加入智能营销邮件黑名单</el-button>
          </el-col>
          <el-col :span="3" style="padding-left: 5px;">
            <el-button type="primary" size="small" @click="handlePre(emailReply.emailBaseId)">上一封</el-button>
            <el-button type="primary" size="small" @click="handleNext(emailReply.emailBaseId)">下一封</el-button>
          </el-col>
        </el-row>
      </div>
    </yt-dialog>

    <!-- 其他弹窗 -->
    <yt-dialog :options="otherOptions" :events="otherEvents">
      <div class="dialog-wrap" style="border:none">
        <div v-if="dialogFlag === '客服'">
          <el-form ref="otherForm" size="small" :inline="false" :key="keyIndex" label-width="130px">
            <!-- <el-form-item size="small" label="选择客服人员：" class="martop">
              <el-select placeholder="选择客服人员" class="marleft10" v-model="serviceData.serviceId">
                <el-option v-for="item in serviceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </el-form-item>-->
            <t-form-item
              label="选择客服人员："
              placeholder="选择客服人员"
              :list="serviceList"
              :value.sync="serviceData.serviceId"
              type="select"
            ></t-form-item>
            <el-row class="saveBtn">
              <el-button size="small" type="primary" @click="serviceSubmit">保存</el-button>
            </el-row>
          </el-form>
        </div>
        <div v-else-if="dialogFlag === '渠道'">
          <el-form class="search-top-form" ref="otherForm">
            <el-form-item size="small" label="选择订单来源：" class="martop">
              <el-select placeholder="选择订单来源" class="marleft10" v-model="writeData.serviceId">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <div class="martop">注：只可转同账号组的订单来源</div>
            <el-row class="saveBtn" style="margin-top:60px;">
              <el-button size="small" type="primary" @click="channelSubmit">保存</el-button>
            </el-row>
          </el-form>
        </div>
        <div v-else-if="dialogFlag === '标记'">
          <el-form class="search-top-form" :key="keyIndex" label-width="100px" size="small">
            <!-- <el-form-item size="small" label="批量标记：" class="martop">
              <el-select class="marleft10" v-model="signData.emailId">
                <el-option label="标记" value="1"></el-option>
                <el-option label="不标记" value="0"></el-option>
              </el-select>
            </el-form-item>-->
            <t-form-item
              label="批量标记："
              :list="[{label: '标记',value: '1'},{label: '不标记',value: '0'}]"
              :value.sync="signData.emailId"
              type="select"
            ></t-form-item>
            <el-row class="saveBtn" style="margin-top:20px;">
              <el-button size="small" type="primary" @click="signSubmit">保存</el-button>
            </el-row>
          </el-form>
        </div>
        <div v-else-if="dialogFlag === '移动分类'">
          <el-form class="search-top-form" :key="keyIndex">
            <el-form-item size="small" label="选择分类：" class="martop">
              <tree-btn @close="handleEmailClassificationId" :text="'邮件分类'" class="tree-btns"></tree-btn>
            </el-form-item>
            <el-row class="saveBtn" style="margin-top:60px;">
              <el-button size="small" type="primary" @click="moveSubmit">保存</el-button>
            </el-row>
          </el-form>
        </div>
      </div>
    </yt-dialog>
    <yt-dialog :options="orderNumOptions" :copy-text="copyText">
      <el-row>
        <el-table :data="orderData" highlight-current-row style="width: 100%">
          <el-table-column show-overflow-tooltip property="subject" label="主题" width="220" class="subject-cell"></el-table-column>
          <el-table-column property="orderNumPlatform" label="平台订单号"></el-table-column>
          <el-table-column property="orderNumSystem" label="系统订单号"></el-table-column>
        </el-table>
        <el-row class="saveBtn" style="margin-top:60px;">
          <el-button size="small" type="primary" @click="orderNumOptions.visible = false">关闭</el-button>
        </el-row>
      </el-row>
    </yt-dialog>
  </div>
</template>

<script>
import Write from './comment/Write'
import MenuSelect from './comment/MenuSelect'
import { mapState, mapActions } from 'vuex'
import { CONST_PORT_CONFIG } from 'Config'
const { loginRedirect } = CONST_PORT_CONFIG

export default {
  inject: ['deleteList', 'extendObj', 'getList', 'platformId'],
  data() {
    return {
      orderData: [],
      orderNumSystems: [],
      orderNumPlatforms: [],
      keyIndex: null,
      WriteKeyIndex: null,
      pageNo: 1,
      pageSize: 10,
      total: 10,
      copyText: undefined,
      replyNum: 0,
      noReplyNum: 0,
      searchList: [
        {
          value: 'type',
          type: 'select',
          placeholder: '搜索类型',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '客户邮箱'
            },
            {
              value: 2,
              label: '客户id'
            },
            {
              value: 3,
              label: '客户姓名'
            },
            {
              value: 4,
              label: '系统订单号'
            },
            {
              value: 5,
              label: '平台订单号'
            },
            {
              value: 6,
              label: '国家'
            },
            {
              value: 7,
              label: '邮件标题 '
            },
            {
              value: 8,
              label: '邮件内容'
            },
            {
              value: 9,
              label: 'sku'
            },
            {
              value: 10,
              label: '店铺sku'
            }
          ]
        },
        {
          value: 'searchValue',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '170px'
          }
        },
        {
          value: 'storeIds',
          type: 'multiple',
          placeholder: '订单来源店铺(多选)',
          size: 'small',
          style: {
            width: '180px'
          },
          children: []
        },
        {
          label: '收取时间：',
          value: 'receiveTime',
          type: 'time',
          size: 'small'
        },
        {
          value: 'serviceIds',
          type: 'multiple',
          placeholder: '操作客服人员(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'starFlag',
          type: 'select',
          placeholder: '特殊状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '标记'
            },
            {
              value: '0',
              label: '未标记'
            }
          ]
        },
        {
          value: 'replyType',
          type: 'select',
          placeholder: '回复状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '未回复'
            },
            {
              value: '2',
              label: '已回复'
            },
            {
              value: '3',
              label: '不需要回复'
            }
          ]
        },
        {
          value: 'readStatus',
          type: 'select',
          placeholder: '读取状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: '1',
              label: '已读'
            },
            {
              value: '0',
              label: '未读'
            }
          ]
        }
      ],
      signData: {
        emailId: ''
      },
      serviceData: {},
      writeData: {
        selectOrder: '',
        input: '',
        orderId: '',
        serviceId: '',
        theme: '',
        clientId: '',
        itemId: '',
        email: ''
      },
      btnArr: ['所有', '24小时内回复', '24小时前回复', '已回复', '所有未回复'],
      activeShow: 0,
      searchForm: {
        platformIds: '',
        timeStart: '',
        timeEnd: ''
      },
      tableColumns: [
        {
          label: '回复状态',
          value: 'replyTypeName',
          width: '70'
        },
        {
          label: '客户',
          value: 'customerName'
        },
        {
          label: '邮箱',
          value: 'customerEmailBox'
        },
        {
          label: '订单号',
          value: 'orderNumSystem',
          render: (h, scope) => {
            let num = scope.row.orderNumSystem || '-'
            return (
              <div
                onClick={() => {
                  this.getDetail(num)
                }}
                style="color:#108ee9;cursor:pointer"
              >
                {num}
              </div>
            )
          }
        },
        {
          label: '订单来源店铺',
          value: 'storeName'
        },
        {
          label: '收取时间',
          value: 'receiveTime'
        },
        {
          label: '回复时间',
          value: 'replyTime'
        },
        {
          label: '客服人员',
          value: 'serviceName'
        }
      ],
      tableData: [],
      writeFlag: true,
      writeOptions: {
        visible: false,
        title: '写邮件',
        width: '1330px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      otherOptions: {
        visible: false,
        title: '批量设置客户',
        width: '440px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      orderNumOptions: {
        visible: false,
        title: '批量提取订单号',
        width: '600px',
        fullscreen: false,
        top: '15vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true,
        okBtnText: false
      },
      otherEvents: {
        close: () => {}
      },
      dialogFlag: '移动分类',
      listParams: {
        emailType: 1,
        platformId: this.platformId,
        quickPick: null,
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1,
        emailClassificationId: null
      },
      emailBaseIds: [],
      emailAllBaseIds: [],
      emailReply: {
        content: ''
      },
      emailClassificationId: null,
      writeForm: {
        content: ''
      },
      nextFlag: true,
      classifyType: 1
    }
  },
  created() {
    let vm = this
    vm.getservice()
    vm.getPlatformStoreList()
    vm.getPlatformList()
    vm.getList().then(data => {
      vm.emailAllBaseIds = data.rows.map(item => {
        return item.emailBaseId
      })
    })
  },
  mounted() {},
  computed: {
    ...mapState('email', ['serviceList']),
    ...mapState('product', ['platformStoreList', 'platformList'])
  },
  watch: {
    serviceList(val) {
      let vm = this
      vm.searchList[4].children = val
    },
    platformStoreList(val) {
      let vm = this
      vm.searchList[2].children = val
    },

    'emailReply.content'(val) {
      if (this.$refs.emailContent) {
        this.$refs.emailContent.innerHTML = val
      }
    }
  },
  methods: {
    ...mapActions('email', ['getservice']),
    ...mapActions('product', ['getPlatformStoreList', 'getPlatformList']),
    async getDetail(val) {
      if (!val || val == '-') {
        return
      }
      let orderServiceId = null
      let deliveryStatus = null
      let platformId = null
      let orderType = null
      await this.$api['order/getOrderIdByNumber']({
        orderNumber: val
      }).then(data => {
        orderServiceId = data.orderId
      })
      await this.$api['order/orderInfo']({
        orderId: orderServiceId
      }).then(data => {
        let info = data.rows.essentialInfo
        deliveryStatus = info.deliveryStatus
        platformId = info.platformId
        orderType = info.orderType
        let a = document.createElement('a')
        let evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        a.href =
          loginRedirect +
          `/erp-order/#/salesManagement/associatedSettings/allOrderLists/lookOver?deliveryStatus=${deliveryStatus}&orderServiceId=${orderServiceId}&platformId=${platformId}&orderType=${orderType}`
        a.target = '_blank'
        a.dispatchEvent(evt)
        a = null
      })
    },
    loadData() {
      let vm = this
      return vm.$api['email/classificationList']({
        classifyType: 1,
        flag: 1,
        emailType: 1,
        platformId: vm.platformId
      }).then(data => {
        if (!data || !data.rows) {
          return []
        }
        let val = JSON.parse(JSON.stringify(data.rows))
        let obj = {
          label: val.classifyName,
          count: val.num,
          value: val.emailClassificationId
        }
        obj.children = vm.getClassification(val.childs)
        return [obj]
      })
    },
    getClassification(data) {
      let vm = this
      let result = []
      data.map(item => {
        let obj = {
          label: item.classifyName,
          count: item.num,
          value: item.emailClassificationId
        }
        if (item.childs && item.childs.length) {
          obj.children = vm.getClassification(item.childs)
        }
        result.push(obj)
      })
      return result
    },
    nodeclick(data) {
      this.listParams.emailClassificationId = data.value
      // console.log(this.listParams)
      this.getList()
    },
    handleCurrentChange(val) {
      this.extendObj({
        pageNumber: val
      })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({
        pageSize: val
      })
      this.getList()
    },
    handleSelectionChange(val) {
      this.emailBaseIds = val.map(item => {
        return item.emailBaseId
      })
    },
    handleSearch(data) {
      let vm = this
      let obj = JSON.parse(JSON.stringify(data))
      if (obj.receiveTime && obj.receiveTime.length) {
        obj.receiveTimeStart = obj.receiveTime[0]
        obj.receiveTimeEnd = obj.receiveTime[1]
        delete obj.receiveTime
      }

      vm.extendObj(true, obj)
      vm.getList()
    },
    writeClick() {
      this.writeFlag = true
      this.writeOptions.visible = true
      this.WriteKeyIndex = Math.random()
      this.writeOptions.title = '写邮件'
      this.writeForm = {}
    },
    handleView(index, row) {
      this.writeFlag = false
      this.classifyType = 2
      this.writeOptions.visible = true
      this.writeOptions.title = '查看邮件'
      this.getEmailReply(row.emailBaseId)
    },
    handleDetail() {
      console.log(this)
    },
    handleReply(val) {
      this.writeFlag = true
      this.writeOptions.visible = true
      this.WriteKeyIndex = Math.random()
      this.writeOptions.title = '邮件回复'
      this.writeForm = Object.assign({}, this.writeForm, val)
      if (this.writeForm.content) {
        this.writeForm.content =
          `<br>回复：<br>----------------------------------------------------------------------------------------------------` +
          this.writeForm.content
      }
      this.writeForm.emailBaseId = null
      this.writeForm.platformId = this.platformId
      this.writeForm.replyBaseId = val.emailBaseId
    },
    handleBlackAdd(index, row) {
      let vm = this
      let params = {}
      vm.$confirm('此操作将加入营销邮件黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (row) {
            params = {
              emailBaseId: row.emailBaseId
            }
          } else {
            params = {
              emailBaseId: index
            }
          }
          vm.$api['email/emailListAdd'](params)
            .then(() => {})
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消加入黑名单'
          })
        })
    },
    onAddSubmit() {},
    serviceSubmit() {
      let vm = this
      let params = {
        emailBaseIds: vm.emailBaseIds,
        serviceId: vm.serviceData.serviceId
      }
      vm.$api['email/batchServiceSet'](params)
        .then(data => {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'warning',
            message: `<strong>成功设置${
              data.successNum
            }数据</strong>，<strong>失败${data.failNum}数据</strong>
            <br/><strong>${data.errMsg}</strong>`
          })
          vm.otherOptions.visible = false
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleMove() {
      let vm = this
      if (!vm.emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        vm.otherOptions.visible = false
        return
      }
      vm.dialogFlag = '移动分类'
      this.otherOptions.title = '移动分类'
      vm.otherOptions.visible = true
    },
    handleEmailClassificationId(val) {
      if (Array.isArray(val) && val.length) {
        this.emailClassificationId = val[0].value
      }
    },
    moveSubmit() {
      let vm = this
      let params = {
        emailBaseIds: vm.emailBaseIds,
        emailClassificationId: vm.emailClassificationId
      }
      vm.$api['email/batchClassificationMove'](params)
        .then(data => {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'warning',
            message: `<strong>成功移动${
              data.successNum
            }数据</strong>，<strong>失败${data.failNum}数据</strong>
            <br/><strong>${data.errMsg}</strong>`
          })
          vm.otherOptions.visible = false
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    signSubmit() {
      let vm = this
      let params = {
        emailBaseIds: vm.emailBaseIds,
        starFlag: +vm.signData.emailId
      }
      vm.$api['email/batchStarSet'](params)
        .then(data => {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'warning',
            message: `<strong>成功标记${
              data.successNum
            }数据</strong>，<strong>失败${data.failNum}数据</strong>
            <br><strong>${data.errMsg}</strong>`
          })
          vm.otherOptions.visible = false
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleQuickPick(index) {
      let vm = this
      vm.activeShow = index
      if (index === 1) {
        vm.extendObj({
          quickPick: 2
        })
      } else if (index === 2) {
        vm.extendObj({
          quickPick: 3
        })
      } else if (index === 3) {
        vm.extendObj({
          quickPick: 4
        })
      } else if (index === 4) {
        vm.extendObj({
          quickPick: 1
        })
      } else {
        vm.extendObj({
          quickPick: null
        })
      }
      vm.getList()
    },
    handleGetOrder() {
      let vm = this
      if (!vm.emailBaseIds.length) {
        vm.$message({
          type: 'error',
          message: '请选择邮件'
        })
        return
      }
      vm.orderNumOptions.visible = true
      let params = {
        emailBaseIds: vm.emailBaseIds
      }
      vm.$api['email/batchOrderGet'](params)
        .then(data => {
          if (!data && !data.rows) {
            return
          }
          vm.orderData = data.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    channelSubmit() {},
    handleDelete() {
      let vm = this
      if (!vm.emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        vm.otherOptions.visible = false
        return
      }
      let emailBaseIds = vm.emailBaseIds
      vm.deleteList({
        emailBaseIds,
        emailType: 1
      })
    },
    handleCommandSeting(val) {
      let vm = this
      let emailBaseId = vm.emailReply.emailBaseId

      let params = {
        emailBaseId,
        signType: val
      }
      vm.$api['email/inboxSignSet'](params)
        .then(() => {})
        .catch(err => {
          console.log(err)
        })
    },
    handleCommand(val) {
      let vm = this
      if (!vm.emailBaseIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择邮件</strong>`
        })
        vm.otherOptions.visible = false
        return
      }
      this.dialogFlag = val
      this.keyIndex = Math.random()
      if (val === '客服') {
        this.otherOptions.title = '批量设置客服'
      } else if (val === '渠道') {
        this.otherOptions.title = '批量设置渠道来源'
      } else if (val === '标记') {
        this.otherOptions.title = '批量标记'
      }
      this.otherOptions.visible = true
    },

    getEmailReply(emailBaseId) {
      let vm = this
      return vm.$api['email/baseGet']({
        emailBaseId: emailBaseId,
        emailType: 1
      })
        .then(data => {
          if (!data) {
            return
          }
          vm.nextFlag = true
          vm.emailReply = data.rows
        })
        .catch(err => {
          vm.nextFlag = true
          console.log(err)
        })
    },
    // 写邮件事件
    searchModule(val) {
      console.log(val)
    },
    handleNodeClick(data) {
      console.log(data)
    },
    sendFlag() {
      console.log(1111111111)

      this.writeFlag = false
      this.writeOptions.visible = false
      this.getList()
    },
    handlePre(id) {
      let vm = this
      if (!vm.nextFlag) {
        return
      }
      let emailAllBaseIds = vm.emailAllBaseIds
      let index = emailAllBaseIds.indexOf(id) - 1
      if (index < 0) {
        return
      }
      vm.nextFlag = false
      vm.getEmailReply(emailAllBaseIds[index])
    },
    handleNext(id) {
      let vm = this
      if (!vm.nextFlag) {
        return
      }
      let emailAllBaseIds = vm.emailAllBaseIds
      let len = emailAllBaseIds.length
      let index = emailAllBaseIds.indexOf(id) + 1
      if (index >= len) {
        return
      }
      vm.nextFlag = false
      vm.getEmailReply(emailAllBaseIds[index])
    }
  },
  components: {
    Write,
    MenuSelect
  }
}
</script>

<style lang="scss">
.index-wrap {
  .email-reply {
    width: 212px;
  }
  .ellipsis-abbreviation {
    padding-right: 0;
  }
  .allbtn {
    display: block;
  }
  .search-top-form {
    .client-input {
      width: 120px;
    }
    .searh-type-btn {
      width: 98px;
    }
    .normal-width {
      width: 150px;
    }
    .start-time {
      margin-right: 0;
    }
    .el-form-item--small.el-form-item,
    .el-form-item {
      margin-bottom: 4px;
    }
    .el-form-item__content {
      line-height: 33px;
    }
  }
  .dropdown-btn {
    margin: 0 6px;
  }
  .filtrate {
    padding: 10px 10px 10px 0px;
    height: 32px;
    line-height: 32px;
    button {
      padding: 9px 15px;
      font-size: 12px;
      border-radius: 3px;
      border: none;
      transition: 0.1s;
      font-weight: 500;
      box-sizing: border-box;
      outline: none;
      margin: 0;
      -webkit-appearance: none;
      text-align: center;
      background: #fff;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      color: #409eff;
    }
    .active {
      border: 1px solid #409eff;
      background: #409eff;
      color: #fff;
    }
  }
  .left-btn-sign {
    span {
      color: #a2cffc;
      display: inline-block;
      height: 30px;
      line-height: 30px;
      padding: 11px 0;
      padding-right: 30px;
    }
  }
  .normal-icon {
    border: none;
    padding: 6px 6px;
    margin-left: 6px;
    background: rgba(255, 255, 255, 0);
    i {
      font-size: 16px;
    }
  }
  .state-icon {
    font-size: 24px;
  }
  .dialog-wrap {
    border-top: 1px solid #bbb;
    padding-top: 10px;
    .el-form-item__label {
      padding-right: 0;
    }
    .normal-input {
      width: 500px;
    }
    .email-left {
      height: 650px;
      border: 1px solid rgb(226, 226, 226);
      .select-modules {
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        font-weight: bold;
        font-size: 16px;
        background: rgb(231, 231, 231);
      }
      .search-input {
        input {
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;
        }
      }
      .search-btn {
        padding: 5px 14px;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        i {
          font-size: 20px;
        }
      }
    }
  }
  .view-wrap {
    .view-email {
      width: 99.8%;
      height: 500px;
      border: 1px solid rgb(240, 240, 240);
      margin-top: -11px;
      .email-information {
        height: 120px;
        background: rgb(240, 240, 240);
        .martop20 {
          padding-top: 20px;
        }
        .title {
          text-align: right;
        }
      }
    }
  }
}
</style>

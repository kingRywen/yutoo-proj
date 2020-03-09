<template>
  <div class="write-template">
    <el-form class="search-top-form" :model="writeData" label-width="170px">
      <el-col :span="17">
        <el-row>
          <el-form-item size="small" label="平台订单号：" class="martop">{{writeData.orderNumPlatform}}</el-form-item>
          <el-form-item size="small" label="订单来源：" class="martop">
            <el-select placeholder="选择来源店铺" v-model="writeData.storeId">
              <el-option v-for="item in platformStoreList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
            <el-select placeholder="选择客服人员" class="marleft10" v-model="writeData.serviceId">
              <el-option v-for="item in serviceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item size="small" label="附件：" class="martop">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :on-remove="handleRemove"
            :on-change="handleChange"
            :http-request="handleHttpRequest"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item size="small" label="主题：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.subject"></el-input>
        </el-form-item>
        <el-form-item size="small" label="客户姓名：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.customerName"></el-input>
        </el-form-item>
        <el-form-item size="small" label="Item ID：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.itemId"></el-input>
          <span class="marleft10 special-span">注：ItemID 该项信息 发送Ebay Message 才需要</span>
        </el-form-item>
        <el-form-item size="small" label="邮箱：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.customerEmailBox"></el-input>
          <span class="marleft10 special-span">注：不建议修改客户邮件，一旦对应错了账号，会关联账号被封</span>
        </el-form-item>
        <el-form-item size="small" label="正文：" class="martop">
          <div style="border:1px solid rgb(226, 226, 226);width:720px;height: 344px;">
            <UeEditor v-model="writeData.content" ref="editor" :config="editorConfig"/>
          </div>
        </el-form-item>
        <el-form-item size="small" class="martop">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange1"
            :show-file-list="false"
            :http-request="handleHttpRequests"
            :file-list="fileLists"
            accept="image/*"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <!-- <el-row class="saveBtn mar10" style="margin-top: 80px">
          <el-button size="small" type="primary" v-if="saveFlag" :loading="loading" @click="sendEmail(0)">保存</el-button>
          <el-button size="small" type="primary" :loading="loading" @click="sendEmail(1)">发送</el-button>
        </el-row>-->
      </el-col>
      <el-col :span="7">
        <div class="email-left">
          <div class="select-modules">模板选择</div>
          <div style="padding-left: 5px;" class="martop">
            <search :searchList="searchList" @search="handleSearch"></search>
          </div>
          <div class="martop">
            <yt-table :columns="columnsData" :data="tableData" :border="true" :selection="false">
              <el-table-column label="操作" slot="right">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleChose(scope.$index, scope.row)">点击选择</el-button>
                </template>
              </el-table-column>
            </yt-table>
          </div>
        </div>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { oss } from '@yutoo/yutoo/utils/utils.umd.min'
import { OSS_CONFIG } from 'Config'
import storage from 'Utils/saver'
// email/pathGet
/* eslint-disable */
export default {
  inject: ['platformId'],
  props: {
    classifyType: {
      type: Number,
      default: 2
    },
    emailType: {
      type: Number,
      default: () => {
        return 1
      }
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    saveFlag: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    concat: {
      type: Boolean,
      default: true
    }
  },
  data() {
    let vm = this
    return {
      loading: false,
      columnsData: [
        {
          label: '模板名称',
          value: 'templateName',
          width: '120'
        },
        {
          label: '语言',
          value: 'languageName',
          width: '120'
        }
      ],
      tableData: [],
      searchList: [
        {
          value: 'languageId',
          type: 'select',
          placeholder: '语言',
          size: 'small',
          style: {
            width: '72px'
          },
          children: [
            {
              value: 1,
              label: '索取好评'
            }
          ]
        },
        {
          type: 'treeBtn',
          text: '分类',
          style: {
            width: '74px'
          },
          classifyType: vm.classifyType
        },
        {
          value: 'templateName',
          type: 'input',
          placeholder: '模板名称',
          size: 'small',
          style: {
            width: '95px'
          }
        }
      ],
      visible: false,
      fileList: [],
      fileLists: [],
      writeData: {
        content: '',
        serviceId: '',
        storeId: ''
      },
      searchData: '',
      editorConfig: {
        initialFrameHeight: 196,
        initialFrameWidth: 718
      },
      moduleForm: {},
      moduleList: [],
      orderNumValue: '',
      orderNumPlatform: '',
      orderNumSystem: '',
      uploadFlag: true
    }
  },
  created() {
    let vm = this

    vm.getservice()
    vm.getPlatformStoreList(2)
    vm.getLanguageList()
  },
  watch: {
    languageList(val) {
      let vm = this
      vm.searchList[0].children = val || []
    }
  },
  computed: {
    ...mapState('email', ['serviceList']),
    ...mapState('product', ['platformStoreList', 'languageList'])
  },
  methods: {
    ...mapActions('email', ['getservice']),
    ...mapActions('product', ['getPlatformStoreList', 'getLanguageList']),
    edit(row) {
      let vm = this
      let _data = vm.$clone(row)
      if (row.orderInfo) {
        _data.customerEmailBox = row.orderInfo.cneeEmail || ''
        _data.customerName = row.orderInfo.customerName || ''
      }
      _data.orderNumPlatform = row.orderNumber
      vm.writeData = _data
      return Promise.resolve()
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },

    handleChange1(file, fileList) {
      this.fileLists = fileList
    },

    handleHttpRequest() {
      let vm = this
      const token = storage.get('local', 'token')
      vm.uploadFlag = false
      vm.$api[`email/pathGet`]()
        .then(async data => {
          let { path } = data
          let res = await oss.batchUpload(
            vm.fileList
              .filter(el => el.path == null && el.raw)
              .map(el => el.raw),
            path,
            OSS_CONFIG.signUrl,
            null,
            token
          )
          vm.fileList.forEach(async (element, index) => {
            if (!element.path) {
              element.path = res.shift()
            } else {
              return
            }
            vm.uploadFlag = false
            await vm.$api['email/downloadPathGet']({
              path: element.path
            })
              .then(data => {
                element.path = data.path
                vm.uploadFlag = true
              })
              .catch(err => {})
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleHttpRequests() {
      let vm = this
      const token = storage.get('local', 'token')
      vm.$api[`email/pathGet`]()
        .then(async data => {
          let { path } = data
          let res = await oss.batchUpload(
            vm.fileLists.filter(el => el.ossUrl == null).map(el => el.raw),
            path,
            OSS_CONFIG.signUrl,
            null,
            token
          )
          vm.fileLists.forEach(async (element, index) => {
            if (!element.ossUrl) {
              element.ossUrl = res.shift()
              await vm.$api['email/downloadPathGet']({
                path: element.ossUrl
              })
                .then(data => {
                  // vm.$refs.editor.setStr(`<img src="${data.path}">`)
                  vm.$set(
                    vm.writeData,
                    'content',
                    (vm.writeData.content ? vm.writeData.content : '') +
                      `<img src="${data.path}">`
                  )
                  // if (vm.writeData.content) {
                  //   vm.writeData.content += `<img src="${data.path}">`
                  // } else {
                  //   let path = data.path + ''
                  //   // vm.$set(vm.writeData, 'content', null)
                  //   vm.$nextTick(() => {
                  //     vm.$set(vm.writeData, 'content', `<img src="${path}">`)
                  //   })
                  // }
                  element.ossUrl = data.path
                })
                .catch(err => {})
            }
          })
        })
        .catch(err => {})
    },
    // 上传文件事件
    handleLoad() {
      let vm = this
      let params = {}
      if (vm.selectOrder === 'orderNumPlatform') {
        params = {
          orderNumPlatform: this.orderNumValue
        }
      } else {
        params = {
          orderNumSystem: this.orderNumValue
        }
      }
      if (!this.orderNumValue) {
        return
      }
      vm.$api['email/orderNumGet'](params)
        .then(data => {
          vm.$set(vm.writeData, 'serviceId', data.serviceId)
          vm.$set(vm.writeData, 'storeId', data.storeId)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSearch(data) {
      let vm = this
      let params = Object.assign({}, data, {
        templateType: 1,
        platformIds: [vm.platformId]
      })
      if (
        params.emailClassificationIds &&
        params.emailClassificationIds.length
      ) {
        params.emailClassificationId = params.emailClassificationIds[0].value
        delete params.emailClassificationIds
      }
      vm.$api['email/templateGroupList'](params)
        .then(data => {
          if (!data) return
          let dataList = JSON.parse(JSON.stringify(data.rows))
          vm.tableData = dataList
        })
        .catch(err => {
          console.log(err)
        })
    },
    sendEmail() {},
    submitForm(cb) {
      // 邮件发送事件
      let vm = this
      vm.loading = true
      vm.writeData.platformId = vm.platformId
      vm.writeData.emailType = vm.emailType
      vm.writeData.attachmentList = [...vm.fileList]
      if (!vm.uploadFlag) {
        vm.loading = false
        return
      }
      cb && cb(vm.writeData)
    },
    handleNodeClick(data) {
      this.visible = false
    },
    handleChose(index, row) {
      let vm = this
      if (row.context) {
        vm.writeData.content += row.context
        delete row.context
      }
      vm.writeData.content
      vm.writeData = Object.assign({}, vm.writeData, row)
    }
  }
}
</script>

<style lang="scss">
.write-template {
  .pad5 {
    padding: 4px 0;
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
    .el-form-item__label {
      padding-right: 0;
    }
    .normal-input {
      width: 450px;
    }
    .special-span {
      line-height: 16px;
      display: inline-block;
      width: 222px;
      height: 33px;
      vertical-align: middle;
      box-sizing: border-box;
    }
    .email-left {
      height: 655px;
      overflow-y: scroll;
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
}
</style>

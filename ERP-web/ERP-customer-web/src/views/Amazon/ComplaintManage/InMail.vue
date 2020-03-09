<template>
  <div class="write-template">
    <el-form class="search-top-form" :model="writeData" label-width="170px">
      <el-col :span="17">
        <el-form-item size="small" label="收件人：" class="martop">
          <el-select
            placeholder="多选"
            multiple
            filterable
            allow-create
            default-first-option
            collapse-tags
            v-model="writeData.recipients"
            class="normal-input"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="主题：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.subject"></el-input>
        </el-form-item>
        <el-form-item size="small" label="正文：" class="martop">
          <div style="width:720px;height: 344px;">
            <UeEditor v-model="writeData.content" ref="editor" :config="editorConfig"/>
          </div>
        </el-form-item>
        <el-row class="saveBtn mar10" style="margin-top: 70px">
          <el-button size="small" type="primary" :loading="loading" @click="sendEmail(0)">保存</el-button>
          <el-button size="small" type="primary" :loading="loading" @click="sendEmail(1)">确认发送</el-button>
        </el-row>
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
  props: {
    writeForm: {
      // 发送的邮件表单
      type: Object,
      default: () => {
        return {
          storeId: '',
          serviceId: '',
          subject: '',
          serviceName: '',
          itemId: '',
          clientEmailBox: '',
          content: '',
          attachmentList: '',
          clientName: ''
        }
      }
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
    platformId: {
      type: Number,
      default: 1
    }
  },
  data() {
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
          }
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
        serviceId: 0,
        storeId: 0
      },
      searchData: '',
      editorConfig: {
        initialFrameHeight: 196,
        initialFrameWidth: 718
      },
      moduleForm: {},
      moduleList: [],
      selectOrder: 'orderNumPlatform',
      orderNumValue: '',
      orderNumPlatform: '',
      orderNumSystem: '',
      uploadFlag: true
    }
  },
  created() {
    let vm = this

    vm.getservice()
    vm.getPlatformStoreList()
    vm.getLanguageList()
  },
  watch: {
    writeForm: {
      immediate: true,
      deep: true,
      handler(val) {
        this.writeData = JSON.parse(JSON.stringify(val)) || {}
        this.fileList = this.writeData.attachmentList || []

        if (this.writeData.context) {
          this.writeData.content = this.writeData.context || ''
        } else {
          this.writeData.content = this.writeData.content || ''
        }
        if (this.writeData.orderNumPlatform) {
          this.selectOrder = 'orderNumPlatform'
          this.orderNumValue = this.writeData.orderNumPlatform || ''
        } else {
          this.selectOrder = 'orderNumSystem'
          this.orderNumValue = this.writeData.orderNumSystem || ''
        }
      }
    },
    languageList(val) {
      let vm = this
      vm.searchList[0].children = val || []
    },
    fileList(val) {
      console.log(val)
    }
  },
  computed: {
    ...mapState('email', ['serviceList']),
    ...mapState('product', ['platformStoreList', 'languageList'])
  },
  methods: {
    ...mapActions('email', ['getservice']),
    ...mapActions('product', ['getPlatformStoreList', 'getLanguageList']),

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
                  if (vm.writeData.content) {
                    vm.writeData.content += `<img src="${data.path}">`
                  } else {
                    let path = data.path + ''
                    vm.$set(vm.writeForm, 'content', null)
                    vm.$set(vm.writeForm, 'content', `<img src="${path}">`)
                  }
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
    sendEmail(type) {
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
      vm.$api[type ? 'email/baseDraftCommit' : 'email/baseSave'](vm.writeData)
        .then(data => {
          vm.loading = false
          if (!type) {
            vm.$emit('sendFlag', true)
          }
        })
        .catch(() => {
          vm.loading = false
        })
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
      height: 430px;
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

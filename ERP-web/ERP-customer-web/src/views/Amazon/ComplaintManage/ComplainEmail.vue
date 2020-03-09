<template>
  <div class="write-template">
    <el-form class="search-top-form" :model="writeData" label-width="170px">
      <el-col :span="17">
        <el-form-item size="small" label="接收人邮箱：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.customerEmailBox"></el-input>
        </el-form-item>
        <el-form-item size="small" label="主题：" class="martop">
          <el-input size="small" class="normal-input" v-model="writeData.subject"></el-input>
        </el-form-item>
        <el-form-item size="small" label="正文：" class="martop">
          <div style="width:720px;height: 344px;">
            <UeEditor v-model="writeData.content" ref="editor" :config="editorConfig"/>
          </div>
        </el-form-item>
        <el-row class="saveBtn mar10" style="margin-top: 80px">
          <el-button size="small" type="primary" :loading="loading" @click="handleSave">保存</el-button>
          <el-button size="small" type="primary" :loading="loading" @click="sendEmail">确认申诉</el-button>
        </el-row>
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
// email/pathGet
/* eslint-disable */
export default {
  props: {
    serviceSellingComplaintsId: {
      type: Number,
      default: () => {
        return null
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
        customerEmailBox: '',
        subject: '',
        content: ''
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
  async created() {
    let vm = this
    vm.getLanguageList()
    await vm.$api['email/complaintsGetEmailContent']({
      serviceSellingComplaintsId: vm.serviceSellingComplaintsId
    }).then(data => {
      let { content } = data
      if (!content) {
        vm.writeData = {
          customerEmailBox: '',
          subject: '',
          content: ''
        }
        return
      }
      vm.writeData =
        typeof JSON.parse(content) == 'object'
          ? JSON.parse(content)
          : {
              customerEmailBox: '',
              subject: '',
              content: ''
            }
    })
  },
  watch: {
    languageList(val) {
      let vm = this
      vm.searchList[0].children = val || []
    },
    fileList(val) {
      console.log(val)
    }
  },
  computed: {
    ...mapState('product', ['languageList'])
  },
  methods: {
    ...mapActions('product', ['getLanguageList']),
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
    handleSave() {
      let vm = this
      vm.loading = true
      let serviceSellingComplaintsId = vm.serviceSellingComplaintsId
      let content = JSON.stringify(vm.writeData)
      vm.$api['email/complaintsSaveEmailContent']({
        content,
        serviceSellingComplaintsId
      })
        .then(() => {
          vm.$emit('sendFlag', true)
          vm.loading = false
        })
        .catch(() => {
          vm.loading = false
        })
    },
    sendEmail() {
      // 邮件发送事件
      let vm = this
      vm.loading = true

      if (!vm.uploadFlag) {
        vm.loading = false
        return
      }
      let _data = JSON.parse(JSON.stringify(vm.writeData))
      _data.serviceSellingComplaintsId = vm.serviceSellingComplaintsId
      vm.$api['email/complaintsSendEmail'](_data)
        .then(data => {
          vm.loading = false
          vm.$emit('sendFlag', true)
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

<template>
  <div v-if="$route.name === 'IP'">
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm label-width="120px" :fields="addFields" ref="add" />
    </yt-dialog>
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        class="custom-upload"
        v-loading="importLoading"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
        :action="uploadConfig.url"
        :headers="uploadConfig.headers"
        :data="uploadConfig.data"
        :show-file-list="false"
        :on-success="handleOnSuccess"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </yt-dialog>
  </div>
  <router-view v-else></router-view>
</template>

<script>
import mixin from '@/mixin'
import { mapState, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import download from 'Utils/download'

const token = storage.get('local', 'token')

export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      importLoading: false,
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'IpPool/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      importDialogOptions: {
        visible: false,
        title: '导入IP',
        width: '500px'
      },
      importDialogEvents: {
        close() {},
        handleOkClick() {}
      },
      ip: null,
      listApi: 'ipPoolList',
      dialogOptions: {
        visible: false,
        title: '新增IP',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增IP'
              ? `main/ipPoolSave`
              : `main/ipPoolUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增IP') return
          vm.editInfo = true
          vm.$api[`main/ipPoolInfo`]({ ipPoolId: vm.editId })
            .then(data => {
              vm.$refs.add.setData(data.rows, true, true, () => {
                vm.editInfo = false
              })
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增IP')
          }
        },
        {
          name: '导入',
          fn() {
            vm.importDialogOptions.visible = true
          }
        },
        {
          name: '编辑',
          disabled: selection => {
            if (selection.length !== 1) {
              return true
            }
            return false
          },
          fn() {
            vm.edit()
          }
        },
        {
          name: '删除',
          type: 'danger',
          disabled: selection => {
            if (!selection.length) {
              return true
            }
            return false
          },
          fn() {
            vm.del()
          }
        }
      ],
      edits: [
        {
          name: '使用情况',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'IPServiceCondition',
              params: {
                ipPoolId: scope.row.ipPoolId
              }
            })
          }
        }
      ],

      addFields: [
        {
          name: 'ip',
          label: 'IP',
          span: 12,
          required: 'ip'
        },
        {
          name: 'port',
          label: '端口',
          span: 12,
          required: true
        },
        {
          name: 'account',
          label: '账号',
          span: 12
          // required: true
        },

        {
          name: 'password',
          label: '密码',
          span: 12
          // required: true
        },
        // {
        //   name: 'addressCountry',
        //   label: '归属国家',
        //   span: 12,
        //   disabled: true,
        //   // required: true
        // },
        // {
        //   name: 'addressState',
        //   label: '归属州',
        //   disabled: true,
        //   span: 12,
        //   // required: true
        // },
        // {
        //   name: 'addressCity',
        //   label: '归属城市',
        //   disabled: true,
        //   span: 12,
        //   // required: true
        // },
        // {
        //   name: 'addressStreet',
        //   label: '归属街道',
        //   disabled: true,
        //   span: 12
        // },
        {
          name: 'payTime',
          label: '购买时间',
          span: 12,
          type: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 24 * 3600 * 1000
            }
          },
          required: true
        },
        {
          name: 'expireTime',
          label: '到期时间',
          span: 12,
          type: 'date',
          required: true,
          pickerOptions: {
            disabledDate(time) {
              return (
                time.getTime() <
                new Date(vm.$refs.add.formData.payTime).getTime() -
                  24 * 3600 * 1000
              )
            }
          }
        },
        {
          name: 'remark',
          label: '备注',
          span: 24,
          type: 'textarea',
          rows: 5
          // required: true
        }
        // {
        //   name: 'timezone',
        //   label: '时区',
        //   span: 12,
        //   disabled: true
        // },
        // {
        //   name: 'timeOffset',
        //   label: '时区简称',
        //   span: 12,
        //   disabled: true
        // }
      ],
      tableCols: [
        {
          label: 'IP',
          prop: 'ip'
        },
        {
          label: '端口',
          prop: 'port'
        },
        {
          label: '归属国家',
          prop: 'addressCountry'
        },
        {
          label: '归属州',
          prop: 'addressState'
        },
        {
          label: '归属城市',
          prop: 'addressCity'
        },
        {
          label: '归属街道',
          prop: 'addressStreet'
        },
        {
          label: '使用平台',
          prop: 'platformName',
          render(h, scope) {
            const { platformName } = scope.row
            const num = platformName ? platformName.split(',').length : 0
            return num ? (
              <el-tooltip placement="right" content={platformName}>
                <el-button type="text">{num}</el-button>
              </el-tooltip>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '在用/总用账号数',
          prop: 'useCase'
        },
        {
          label: 'IP状态',
          prop: 'bindFlag',
          render(h, scope) {
            let { status } = scope.row
            if (status == null) {
              return <span>-</span>
            }
            if (status == 0) {
              return <span class="info">废弃</span>
            }
            if (status == 1) {
              return <span class="success">正常</span>
            }
          }
        },
        {
          label: '购买时间',
          prop: 'payTime'
        },
        {
          label: '到期时间',
          prop: 'expireTime'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  created() {
    this.getPlatformList()
    this.getCountry()
    this.debounceCheckIp = debounce(this.checkIp, 1000)
  },
  computed: {
    ...mapState(['countryList', 'platformList']),
    searchFields() {
      return [
        {
          name: 'ip',
          label: 'IP'
        },
        {
          name: 'status',
          label: 'IP状态',
          type: 'select',
          options: [
            {
              label: '正常',
              value: '1'
            },
            {
              label: '废弃',
              value: '0'
            }
          ]
        },
        {
          name: 'addressCountry',
          label: '归属国家',
          type: 'select',
          options: this.countryList
        },
        {
          name: 'platformName',
          label: '使用平台',
          type: 'select',
          options: this.platformList
        }
      ]
    }
  },
  watch: {
    // ip(host) {
    //   if (host && !this.editInfo) {
    //     let vm = this
    //     this.debounceCheckIp()
    //   }
    // }
  },
  methods: {
    ...mapActions(['getPlatformList', 'getCountry']),
    downloadTemp() {
      this.$api[`main/ipPoolExportTemplate`]({})
        .then(data => {
          download(data, 'IP导入模板.xls')
        })
        .catch(err => {})
    },
    handleError() {
      this.importLoading = false
    },
    handleBeforeUpload() {
      return (this.importLoading = true)
    },
    handleOnSuccess(res, file, fileList) {
      let { msg: message, code } = res
      if (code === 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: message,
          type: 'success'
        })
        this.importDialogOptions.visible = false
        this.$refs.lay.reset()
      } else {
        this.$message({
          dangerouslyUseHTMLString: true,
          message: message,
          type: 'error'
        })
      }
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    // handleDataChange(data) {
    //   // this.ip = data.ip
    // },
    checkIp() {
      this.$api[`main/ipPoolCheck`]({ host: this.ip })
        .then(data => {
          if (this.$refs.add) {
            this.$refs.add.setData(data.rows, false)
          }
        })
        .catch(err => {})
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑IP', row.ipPoolId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑IP', data[0].ipPoolId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此IP？',
          'ipPoolRemove',
          'ipPoolId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(data, '是否删除此IP？', 'ipPoolRemove', 'ipPoolId')
        }
      }
    }
  }
}
</script>

<style>
</style>

<template>
  <div class="chose-template">
    <el-button type="primary" @click="handleClick">选择模板</el-button>
    <yt-dialog :options="options" :events="events">
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
    </yt-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'ChoseTemplate',
  props: {
    platformIds: {
      type: Array,
      default: () => {
        return null
      }
    },
    templateType: {
      type: Number,
      default: () => {
        return 1
      }
    },
    // 判断平台是否选择
    showError: {
      type: Boolean,
      default: true
    },
    errMsg: {
      type: String,
      default: () => {
        return '请先选择订单来源'
      }
    },
    classifyType: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data() {
    let vm = this
    return {
      options: {
        visible: false,
        title: '添加',
        width: '430px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      events: {
        open() {
          vm.handleSearch()
        }
      },
      searchList: [
        {
          value: 'languageId',
          type: 'select',
          placeholder: '语言',
          size: 'small',
          style: {
            width: '76px'
          },
          children: []
        },
        {
          type: 'treeBtn',
          text: '分类',
          style: {
            width: '76px'
          },
          classifyType: this.classifyType
        },
        {
          value: 'templateName',
          type: 'input',
          placeholder: '模板名称',
          size: 'small',
          style: {
            width: '96px'
          }
        }
      ],
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
      tableData: []
    }
  },
  created() {
    this.getLanguageList()
  },
  mounted() {},
  watch: {
    languageList(val) {
      this.searchList[0].children = val
    },
    classifyType: {
      immediate: true,
      handler(val) {
        this.searchList[1].classifyType = val
      }
    }
  },
  computed: {
    ...mapState('product', ['languageList'])
  },
  methods: {
    ...mapActions('product', ['getLanguageList']),
    handleClick() {
      let vm = this
      console.log(vm.platformIds)

      if (
        this.showError &&
        (!Array.isArray(vm.platformIds) ||
          !vm.platformIds.length ||
          vm.platformIds[0] == 0)
      ) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>${vm.errMsg}</strong>`
        })
        return
      }
      vm.options.visible = true
    },
    handleSearch(data) {
      let vm = this
      let params = Object.assign({}, data, {
        templateType: vm.templateType,
        platformIds: vm.showError ? vm.platformIds : null
      })
      if (!vm.showError) {
        delete params.platformIds
      }
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
    handleChose(index, row) {
      let vm = this
      if (row.context) {
        row.content = row.context
      }
      vm.options.visible = false
      this.$emit('choseData', row)
    }
  }
}
</script>

<style lang="scss">
</style>

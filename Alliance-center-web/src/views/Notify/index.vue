<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :outerParams="{type: 1}"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="160px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm :defaultData="defaultData" label-width="120px" :fields="addFields" ref="add" />
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'

export default {
  mixins: [mixin],
  name: 'SystemSettings',
  data() {
    let vm = this
    return {
      defaultData: {
        type: 1
        // id: new Array(1)
      },
      listApi: 'merchantMessageList',
      dialogOptions: {
        visible: false,
        title: '新增消息通知',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增消息通知'
              ? `main/merchantMessageSave`
              : `main/merchantMessageUpdate`
          let data = vm.$refs.add.formData
          return vm.$api[api](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增消息通知') return
          vm.$api[`main/merchantMessageInfo`]({ id: vm.editId })
            .then(data => {
              vm.$refs.add.setData(data.rows)
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增消息通知')
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          show: () => true,
          fn: (scope, item) => {
            vm.edit(scope.row)
          }
        },
        {
          name: '删除',
          show: () => true,
          fn: (scope, item) => {
            vm.del([scope.row.id])
          }
        }
      ],
      searchFields: [
        {
          label: '消息类型',
          type: 'select',
          name: 'type',
          options: [
            {
              label: '系统通知',
              value: 1
            }
          ]
        }
      ],
      tableCols: [
        {
          label: '消息类型',
          prop: 'type',
          render(h, scope) {
            return <span>{scope.row.type == 1 ? '系统通知' : '-'}</span>
          }
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '内容',
          prop: 'content',
          minWidth: 300
        },
        {
          label: '通知日期',
          prop: 'noticeStartDate'
        },
        {
          label: '截止日期',
          prop: 'noticeEndDate'
        },
        {
          label: '发布时间',
          prop: 'createTime'
        }
      ]
    }
  },

  computed: {
    addFields() {
      return [
        {
          name: 'type',
          label: '消息类型',
          width: '40.5%',
          type: 'select',
          options: [
            {
              label: '系统通知',
              value: 1
            }
          ],
          span: 24,
          required: true
        },
        {
          name: 'noticeStartDate',
          label: '通知日期',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now() - 24 * 3600 * 1000
            }
          },
          type: 'date',
          span: 12,
          required: true
        },
        {
          name: 'noticeEndDate',
          label: '截止日期',
          pickerOptions: {
            disabledDate: time => {
              return (
                time.getTime() <
                new Date(this.$refs.add.formData.noticeStartDate).getTime() -
                  24 * 3600 * 1000
              )
            }
          },
          type: 'date',
          span: 12
        },
        {
          name: 'title',
          label: '标题',
          span: 24,
          required: true
        },
        {
          name: 'content',
          label: '内容',
          span: 24,

          type: 'textarea',
          rows: 5,
          required: true
        }
      ]
    }
  },
  methods: {
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row) {
      if (row) {
        this.openAdd('编辑消息通知', row.id)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑消息通知', data[0].id)
        }
      }
    },
    del(ids) {
      let vm = this
      this.$confirm('是否删除此通知？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api[`main/merchantMessageRemove`]({ idArray: ids })
            .then(data => {
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        })
        .catch(() => {})
    }
  }
}
</script>

<style>
</style>

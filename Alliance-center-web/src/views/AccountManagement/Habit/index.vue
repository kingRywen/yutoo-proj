<template>
  <div>
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
      <Add ref="add"/>
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'
import Add from './components/add'

export default {
  name: 'Habit',
  mixins: [mixin],
  components: { Add },
  data() {
    let vm = this
    return {
      listApi: 'habitList',
      dialogOptions: {
        visible: false,
        title: '新增习惯定义',
        width: '90%',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            (vm.dialogOptions.title === '新增习惯定义' || vm.dialogOptions.title === '克隆习惯定义')
              ? `main/habitSave`
              : `main/habitUpdate`

          return vm.$refs.add.validate().then(() => {
            let data = vm.$refs.add.formData
            let habitConstActiveTimeArray = vm.$refs.add.$refs.time.formData.list
            habitConstActiveTimeArray = habitConstActiveTimeArray.map(el => ({time: el.time.join(), week: el.week.join()}))
            return vm.$api[api]({...data, habitConstActiveTimeArray})
              .then(data => {
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          }).catch(() => {
            vm.$message.warning('请输入必填项')
            return Promise.reject()
          })
        },
        close() {
          vm.$refs.add.close()
        },
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.add.clearValidate()
          })
          if (vm.dialogOptions.title === '新增习惯定义') {
            vm.$nextTick(() => {
              vm.$refs.add.getAddData()
            })
            return
          }
          vm.$api[`main/habitInfo`]({ habitId: vm.editId })
            .then(data => {
              // 数据处理
              let { habitConstActiveTimeArray } = data.rows
              habitConstActiveTimeArray.forEach(el => {
                el.time = el.time.split(',').map(el => +el)
                el.week = el.week.split(',').map(el => +el)
              })
              vm.$refs.add.setData(data.rows)
            })
            .catch(err => {
              console.error(err)
            })
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增习惯定义')
          }
        },
        {
          name: '克隆',
          disabled: selection => {
            return selection.length !== 1
          },
          fn() {
            vm.edit(null, true)
          }
        },
        {
          name: '编辑',
          disabled: selection => {
            return selection.length !== 1
          },
          fn() {
            vm.edit()
          }
        },
        {
          name: '删除',
          type: 'danger',
          disabled: selection => {
            return !selection.length
          },
          fn() {
            vm.del()
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.edit(scope.row)
          }
        },
        {
          name: '删除',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.del(scope.row)
          }
        }
      ],
      searchFields: [
        {
          label: '习惯名称',
          name: 'habitName'
        },
        // {
        //   label: '流程状态',
        //   name: 'habitName1',
        //   type: 'select',
        //   options: [{}]
        // }
      ],
      tableCols: [
        {
          label: '习惯编号',
          prop: 'habitId'
        },
        {
          label: '习惯名称',
          prop: 'habitName'
        },
        {
          label: '关联账号数',
          prop: 'accountCount'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        }
      ]
    }
  },

  methods: {
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    edit(row, clone = false) {
      if (row) {
        this.openAdd(clone ? '克隆习惯定义' : '编辑习惯定义', row.habitId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd(clone ? '克隆习惯定义' : '编辑习惯定义', data[0].habitId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除习惯？',
          'habitRemove',
          'habitId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(data, '是否删除习惯？', 'habitRemove', 'habitId')
        }
      }
    }
  }
}
</script>

<style>
</style>

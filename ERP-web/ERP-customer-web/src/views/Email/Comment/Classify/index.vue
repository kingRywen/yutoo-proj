<template>
  <div class="email-custom-classify">
    <universal-layout :pagination="false">
      <section slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allbtn">
        <el-button type="primary" size="mini" class="search-submit" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleDelete">删除</el-button>
      </section>
      <section slot="table">
        <category-tree
          :data="tableData"
          :columns="tableColumns"
          @handleSelectionChange="handleSelectionChange"
          @addCategoryNext="addCategoryNext"
          ref="table"
        >
          <template slot="left">
            <el-table-column label="ID" width="40">
              <template slot-scope="scope">
                <span>{{ scope.row.emailClassificationId }}</span>
              </template>
            </el-table-column>
          </template>
          <template>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-tooltip
                  v-if="scope.row.classifyName !== '默认分类'"
                  content="编辑"
                  offset="1"
                  placement="bottom"
                  effect="light"
                >
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
          <template slot="right">
            <el-table-column label="状态">
              <template slot-scope="scope">
                <i
                  class="normal-table-icon"
                  :class="scope.row.activateFlag?'el-icon-check':'el-icon-close'"
                  @click="handleFlagChange(scope.$index, scope.row)"
                ></i>
              </template>
            </el-table-column>
          </template>
        </category-tree>
      </section>
    </universal-layout>
    <yt-dialog :options="options" :events="events">
      <el-form :key="keyIndex" ref="dialogForm" :model="dialogForm" label-width="100px" class="demo-ruleForm">
        <el-form-item size="small" label="选择上级分类:" class="input-width">
          <el-cascader
            :options="selectOptions"
            :show-all-levels="true"
            change-on-select
            v-model="selectedOptions"
            placeholder="所有分类"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="类别名称:"
          :rules="[
            { required: true, message: '请输入类别名称' }
          ]"
          size="small"
          prop="classifyName"
          class="must-fill-sign input-width"
        >
          <el-input v-model="dialogForm.classifyName"></el-input>
        </el-form-item>
        <el-form-item label="排序:" size="small" prop="priority" class="must-fill-sign input-width" :rules="sort">
          <!-- <el-input type="number" v-model="dialogForm.priority"></el-input> -->
          <el-input-number style="width:60%" v-model="dialogForm.priority" :controls="false" :min="0" :max="10"></el-input-number>
          <span class="before-blank">优先级越高，越排前</span>
        </el-form-item>

        <ElFormItem prop="activateFlag">
          <el-checkbox :true-label="1" :false-label="0" v-model="dialogForm.activateFlag">是否激活</el-checkbox>
        </ElFormItem>
        <el-row class="saveBtn">
          <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
        </el-row>
      </el-form>
    </yt-dialog>
    <yt-dialog :options="otherOptions">
      <el-form class="search-top-form" :key="keyIndex">
        <el-form-item size="small" label="选择分类：" class="martop">
          <tree-btn @close="handleEmailClassificationId" :text="'邮件分类'" class="tree-btns" :classifyType="classifyType"></tree-btn>
        </el-form-item>
        <el-row class="saveBtn" style="margin-top:60px;">
          <el-button size="small" type="primary" @click="moveSubmit">转移</el-button>
        </el-row>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import categoryTree from '../category-tree/category-tree'
export default {
  props: ['classifyType'],
  data() {
    let sort = (rule, value, callback) => {
      if (!value) {
        callback('请输入排序')
      } else if (value > 10 || value < 0) {
        callback('请输入1-10之间的数字')
      } else {
        callback()
      }
    }
    return {
      sort: [{ validator: sort }],
      loading: false,
      keyIndex: null,
      selectOptions: [
        {
          value: null,
          label: '所有分类'
        }
      ],
      selectedOptions: [],
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'classifyName',
          type: 'input',
          placeholder: '邮件分类名',
          size: 'small',
          style: {
            width: '260px'
          }
        },
        {
          value: 'createTime',
          type: 'time',
          size: 'small'
        }
      ],
      dialogForm: {
        priority: 0,
        activateFlag: 0
      },
      tableColumns: [
        {
          value: 'classifyName',
          add: 'nameCn',
          text: '邮件分类名'
        },
        {
          value: 'createTime',
          text: '添加时间'
        },
        {
          value: 'priority',
          text: '排序'
        }
      ],
      tableData: [],
      options: {
        visible: false,
        title: '添加',
        width: '500px',
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
      listParams: {
        classifyType: null
      },
      events: {
        close: () => {
          this.dialogForm = {}
          this.selectedOptions = []
        },
        open: () => {},
        handleOkClick: () => {}
      },
      selectData: [],
      otherOptions: {
        visible: false,
        title: '移动分类',
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
      moveClassificationId: null
    }
  },
  created() {
    let vm = this
    vm.listParams.classifyType = vm.classifyType
    vm.getList()
  },
  watch: {
    tableData(val) {
      let vm = this
      vm.selectOptions = vm.getClassifyName(val)
    },
    selectedOptions(val) {
      let vm = this
      vm.dialogForm.superId = val[val.length]
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)

      this.dialogForm.superId = val[val.length - 1]
    },
    addCategoryNext(val) {
      let vm = this
      let emailClassificationId = val.emailClassificationId
      vm.$api['email/classificationGet']({
        emailClassificationId
      })
        .then(data => {
          vm.selectedOptions = [].concat(data.rows.superArray, [
            data.rows.emailClassificationId
          ])
        })
        .catch(err => {
          console.log(err)
        })
      this.options.visible = true
    },
    handleSubmit() {
      let vm = this
      vm.loading = true
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          if (!vm.selectedOptions.length) {
            vm.dialogForm.superId = null
          }
          vm.dialogForm.superId =
            vm.selectedOptions[vm.selectedOptions.length - 1]
          if (vm.dialogForm.superArray) {
            vm.dialogForm.superArray = null
          }

          let params = Object.assign({}, vm.dialogForm, {
            classifyType: vm.classifyType,
            superId: vm.dialogForm.superId,
            classifyName: vm.dialogForm.classifyName,
            priority: vm.dialogForm.priority,
            activateFlag: vm.dialogForm.activateFlag || 0
          })
          vm.$api['email/classificationSave'](params)
            .then(() => {
              vm.loading = false
              vm.getList()
              vm.options.visible = false
            })
            .catch(() => {
              vm.loading = false
            })
        } else {
          vm.loading = false
          return false
        }
      })
    },
    handleSearch(data) {
      let vm = this
      let obj = vm.$.deepClone(data)
      if (obj.createTime && obj.createTime.length) {
        obj.timeStart = obj.createTime[0]
        obj.timeEnd = obj.createTime[1]
        delete obj.createTime
      } else {
        delete obj.timeStart
        delete obj.timeEnd
      }

      vm.extendObj(true, obj)
      vm.getList()
    },
    handleAdd() {
      this.dialogForm = {}
      this.keyIndex = Math.random()
      this.options.visible = true
    },
    handleSelectionChange(val) {
      this.selectData = val.map(item => {
        return item.emailClassificationId
      })
    },
    handleDelete() {
      let vm = this
      if (!vm.selectData.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择分类</strong>`
        })
        return
      }
      let params = {
        classifyType: vm.classifyType,
        emailClassificationIds: vm.selectData
      }
      vm.deleteList(params)
    },
    handleEdit(index, row) {
      let vm = this
      vm.keyIndex = Math.random()
      vm.options.visible = true
      vm.options.title = '编辑'
      let emailClassificationId = row.emailClassificationId
      vm.$api['email/classificationGet']({
        emailClassificationId
      })
        .then(data => {
          vm.selectedOptions = data.rows.superArray
          vm.dialogForm = data.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleFlagChange(index, row) {
      let vm = this
      vm.$api['email/classificationGet']({
        emailClassificationId: row.emailClassificationId
      }).then(data => {
        let _data = data.rows
        _data.activateFlag = _data.activateFlag ? 0 : 1
        _data.superArray = null
        vm.$api['email/classificationSave'](_data)
          .then(() => {
            vm.$message.success('操作成功')
            vm.extendObj(true)
            vm.getList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    handleEmailClassificationId(val) {
      if (Array.isArray(val) && val.length) {
        this.moveClassificationId = val[0].value
      }
    },
    moveSubmit() {
      let vm = this
      vm.remove({
        emailClassificationIds: vm.selectData,
        classifyType: vm.classifyType,
        moveFlag: 1,
        moveClassificationId: vm.moveClassificationId
      })
    },
    deleteList(params = {}) {
      let vm = this
      vm.$confirm('此操作将永久删除该分类及其下级分类, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '不删除',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/classificationRemoveCheck'](params).then(data => {
            if (data.flag) {
              vm.$confirm('是否将该分类及其下级分类邮件转移?', '提示', {
                cancelButtonText: '不转移',
                confirmButtonText: '转移',
                type: 'warning'
              })
                .then(() => {
                  vm.keyIndex = Math.random()
                  vm.otherOptions.visible = true
                  vm.getList()
                  vm.$refs.table.clearSelection()
                })
                .catch(() => {
                  vm.remove({
                    emailClassificationIds: vm.selectData,
                    classifyType: vm.classifyType,
                    moveFlag: 0,
                    moveClassificationId: null
                  })
                })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    remove(params = {}) {
      let vm = this
      vm.$api['email/classificationRemove'](params)
        .then(() => {
          vm.otherOptions.visible = false
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList() {
      let vm = this
      return vm.$api['email/classificationPage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.tableData = data.rows
          }
          return data
        })
    },
    extendObj(...obj) {
      let vm = this
      if (typeof obj[0] == 'boolean') {
        obj.shift()
        this.listParams = { classifyType: vm.classifyType }
      }
      return (this.listParams = Object.assign({}, vm.listParams, ...obj))
    },
    getClassifyName(params) {
      let vm = this
      let options = []
      for (let i = 0; i < params.length; i++) {
        let item = params[i]
        let obj = {}
        if (item.classifyName && item.emailClassificationId) {
          obj.label = item.classifyName
          obj.value = item.emailClassificationId
          options.push(obj)
        }
        if (item.childs && item.childs.length) {
          obj.children = vm.getClassifyName(item.childs)
        }
      }
      return options
    }
  },
  components: {
    categoryTree
  }
}
</script>

<style lang='scss'>
.email-custom-classify {
  .el-form-item__content {
    line-height: 33px;
  }
  .checkbox {
    .el-form-item__content {
      vertical-align: bottom;
      input {
        margin-top: 15px;
      }
    }
  }
  .start-time {
    margin-right: 0 !important;
  }
  .marginTop8 {
    margin-top: 8px;
  }
  .input-width {
    .el-input {
      width: 100%;
    }
  }
  .must-fill-sign {
    .el-form-item__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .before-blank {
    padding-left: 10px;
  }
  .isChecked {
    margin-top: 14px;
    padding-left: 10px;
  }
  .saveBtn {
    margin-top: 14px;
  }
}
</style>

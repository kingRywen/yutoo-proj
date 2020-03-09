<template>
  <div style="max-width:1240px;margin:0 auto" class="custom_from">
    <el-form :model="formData" label-width="120px" size="mini" ref="form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="任务名称" prop="taskName" :rules="validator(true, '任务名称')">
            <el-input v-model="formData.taskName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品名称" prop="productName" :rules="validator(true, '产品名称')">
            <el-input v-model="formData.productName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="终端类型" prop="terminalType" :rules="validator(true, '终端类型')">
            <el-radio-group v-model="formData.terminalType">
              <el-radio :label="0">web</el-radio>
              <el-radio :label="1">app</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类目" prop="categoryId" :rules="validator(true, '类目')">
            <SyncCascader
              v-if="refresh"
              v-model="formData.categoryId"
              :get-el="cascader.getEl"
              :load="cascader.options"
              :props="cascader.props"
            ></SyncCascader>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div class="hr"></div>
        </el-col>

        <el-col :span="24">
          <el-form-item label="搜索入口" prop="searchType" :rules="validator(true, '搜索入口')">
            <el-select class="per100" v-model="formData.searchType" placeholder>
              <el-option
                v-for="item in $const['OTHER/searchType']"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产品URL" prop="productUrl" :rules="[{required: true, type: 'url', message:'请输入正确的URL'}]">
            <el-input v-model="formData.productUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.searchType !== 4">
          <el-form-item label="产品ID" prop="productId" :rules="checkASIN" required>
            <el-input v-model="formData.productId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.searchType === 1 || formData.searchType === 3">
          <el-form-item label="关键词" prop="searchParam" :rules="validator(true, '关键词')">
            <el-input v-model="formData.searchParam"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.searchType === 2">
          <!-- TODO: -->
          <el-form-item label="类目ID" prop="searchParam" :rules="validator(true, '类目ID')">
            <el-input v-model="formData.searchParam"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="二次搜索" prop="secondSearchType" :rules="validator(true, '二次搜索')">
            <el-select class="per100" v-model="formData.secondSearchType" placeholder>
              <el-option
                v-for="item in $const['OTHER/secondSearchType']"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <template v-if="formData.secondSearchType!==0">
          <el-col :span="12" v-if="formData.secondSearchType === 5 || formData.secondSearchType === 6">
            <el-form-item label="关联位置" prop="secondRelatedPosition" :rules="validator(true, '关联位置')">
              <el-select class="per100" v-model="formData.secondRelatedPosition" placeholder>
                <template v-for="item in $const['OTHER/relatedPosition']">
                  <el-option :key="item.value" :value="item.value" :label="item.label"></el-option>
                </template>
                <el-option v-if="formData.secondSearchType === 5" :key="3" :value="3" label="位置3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="formData.secondSearchType !== 7">
            <el-form-item
              label="产品URL"
              prop="secondProductUrl"
              :rules="[{required: true, type: 'url', message:'请输入正确的URL'}]"
            >
              <el-input v-model="formData.secondProductUrl"></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="12"
            v-if="formData.secondSearchType === 1 || formData.secondSearchType === 2 || formData.secondSearchType === 3"
          >
            <el-form-item label="产品ID" prop="secondProductId" required :rules="checkASIN">
              <el-input v-model="formData.secondProductId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.secondSearchType === 5 || formData.secondSearchType === 6">
            <el-form-item label="产品ID" prop="secondProductId" required :rules="checkASIN">
              <el-input v-model="formData.secondProductId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.secondSearchType === 2">
            <el-form-item label="类目ID" prop="secondSearchParam" :rules="validator(true, '类目ID')">
              <el-input v-model="formData.secondSearchParam"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="formData.secondSearchType === 1||formData.secondSearchType === 3">
            <el-form-item label="关键词" prop="secondSearchParam" :rules="validator(true, '关键词')">
              <el-input v-model="formData.secondSearchParam"></el-input>
            </el-form-item>
          </el-col>
        </template>

        <template v-for="(item, index) in formData.taskSubList">
          <el-col :span="24">
            <div class="hr"></div>
          </el-col>
          <el-col :span="24">
            <el-form-item label="任务类型" :prop="`taskSubList.${index}.taskTypeId`" :rules="validator(true, '任务类型')">
              <div class="flex">
                <el-select class="per100" v-model="item.taskTypeId" @change="handleTaskChange(index, $event)">
                  <el-option v-for="item in taskType" :key="item.key" :value="item.key" :label="item.value"></el-option>
                </el-select>
                <div class="btn">
                  <el-button type="text" icon="el-icon-plus" @click="handleAdd(item, index)"></el-button>
                  <el-button
                    type="text"
                    icon="el-icon-minus"
                    @click="handleMinus(item, index)"
                    v-if="index !== 0 || (index === 0 && formData.taskSubList.length > 1)"
                  ></el-button>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table :data="item.taskSubParamList" stripe border class="mb20">
              <el-table-column
                v-for="(paramItem, indexItem) in item.taskSubParamList[0].paramMapList"
                :label="paramItem.key"
                :key="paramItem.key"
                :min-width="paramItem.key === '时间范围' ? '160px': null"
                align="center"
              >
                <template slot-scope="scope">
                  <template v-if="paramItem.key === '时间范围'">
                    <el-form-item
                      class="table-form-item"
                      label-width="0"
                      :prop="`taskSubList.${index}.taskSubParamList.${scope.$index}.paramMapList.${indexItem}.value`"
                      :rules="timeValidator(item.taskSubParamList, scope.$index)"
                    >
                      <el-date-picker
                        class="per100"
                        v-model="scope.row.paramMapList[indexItem].value"
                        @change="handleTimeChange(scope, $event, item.taskSubParamList)"
                        type="datetimerange"
                        :picker-options="pickerOptions"
                        range-separator="~"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                  </template>
                  <template v-else-if="paramItem.key === '任务数量'">
                    <el-form-item
                      class="table-form-item"
                      label-width="0"
                      :prop="`taskSubList.${index}.taskSubParamList.${scope.$index}.paramMapList.${indexItem}.value`"
                      :rules="validator('number', '任务数量')"
                    >
                      <el-input-number
                        class="per100"
                        v-model="scope.row.paramMapList[indexItem].value"
                        @change="val => scope.row.totalNum = val"
                        :controls="false"
                        :min="1"
                      ></el-input-number>
                    </el-form-item>
                  </template>

                  <template v-else>
                    <el-form-item
                      class="table-form-item"
                      label-width="0"
                      :prop="`taskSubList.${index}.taskSubParamList.${scope.$index}.paramMapList.${indexItem}.value`"
                      :rules="(paramItem.key !== '商户名称' && paramItem.key !== '是否FBA' && paramItem.key !== '舒适度') ? validator(true, paramItem.key) : null"
                    >
                      <el-input
                        v-if="!scope.row.paramMapList[indexItem].select"
                        v-model="scope.row.paramMapList[indexItem].value"
                        :controls="false"
                        :min="1"
                      ></el-input>
                      <el-select v-else v-model="scope.row.paramMapList[indexItem].value">
                        <el-option
                          v-for="item in scope.row.paramMapList[indexItem].select"
                          :key="item.key"
                          :label="item.value"
                          :value="item.key"
                        ></el-option>
                      </el-select>
                      <!-- <el-input v-else v-model="scope.row.paramMapList[indexItem].value" :controls="false" :min="1"></el-input> -->
                    </el-form-item>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="原因" v-if="showReason">
                <template slot-scope="scope">
                  <div class="danger">{{scope.row.reason}}</div>
                </template>
              </el-table-column>
              <el-table-column width="80px">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      type="text"
                      icon="el-icon-plus"
                      @click="handleAddTable(item.taskSubParamList, scope, item.taskTypeId)"
                    ></el-button>
                    <el-button
                      type="text"
                      icon="el-icon-minus"
                      @click="handleMinusTable(item.taskSubParamList, scope)"
                      v-if="scope.$index !== 0 || (scope.$index === 0 && item.taskSubParamList.length > 1)"
                    ></el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </template>

        <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" :rows="6" v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="txc mb20">
          <el-button type="primary" @click="ok">确认</el-button>
          <el-button type="danger" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import validator from 'Utils/validator'
import SyncCascader from 'Components/SimpleForm/src/SyncCascader'
import { mapState, mapActions } from 'vuex'

const initialCol = () => [
  {
    value: [],
    key: '时间范围'
  },
  {
    value: undefined,
    key: '任务数量'
  }
]

const taskSubList = () => ({
  taskTypeId: undefined,
  taskSubParamList: [{ taskTypeId: 1, paramMapList: initialCol() }]
  // paramMapList: [...initialCol]
})

export default {
  components: {
    SyncCascader
  },
  computed: {
    ...mapState(['taskType'])
  },
  created() {
    this.getTaskType()
    if (this.$route.query.taskId != null) {
      this.initData(this.$route.query.taskId)
    } else {
      this.getTaskName()
    }
  },
  data() {
    let vm = this
    // 验证产品ID， 如果是亚马逊平台，则用验证ASIN的方式去校验,其它平台判断不为空
    let checkASIN = (rule, value, cb) => {
      if (value == null || value === '') {
        cb(new Error('产品ID不能为空'))
      }
      if (this.$store.state.defalutSiteName.slice(0, 6) === 'Amazon') {
        if (!/^[A-Z0-9]{10}$/.test(value)) {
          cb(new Error('亚马逊产品ID须为10位数，纯数字或大写字母和数字的组合'))
        }
      }
      cb()
    }
    let _timeValidator = (list, index) => (rule, value, cb) => {
      if (!value) {
        return cb(new Error('时间范围不能为空'))
      }
      let prev = list[index - 1]
      let next = list[index + 1]
      let start = value[0]
      let end = value[1]
      if (index === 0) {
        if (!value || (value && !value.length)) {
          return cb(new Error('时间范围不能为空'))
        }
        if (end > next && next.startTime) {
          return cb(new Error('结束时间不能大于下一个起始时间'))
        }
        return cb()
      } else if (index === list.length - 1) {
        if (start < prev.endTime) {
          return cb(new Error('起始时间不能小于上一个结束时间'))
        }
        return cb()
      } else {
        if (start < prev.endTime) {
          return cb(new Error('起始时间不能小于上一个结束时间'))
        }
        if (end > next.startTime) {
          return cb(new Error('结束时间不能大于下一个起始时间'))
        }
        return cb()
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      timeValidator(list, index) {
        return [
          {
            validator: _timeValidator(list, index)
          }
        ]
      },

      checkASIN: [{ validator: checkASIN }],
      refresh: true,
      showReason: false,
      formData: {
        searchType: 1,
        taskName: '',
        secondSearchType: 0,
        categoryId: [],
        taskSubList: [taskSubList()]
      },
      cascader: {
        getEl: true,
        options: vm.loadTree,
        props: {
          label: 'name',
          value: 'categoryId',
          children: 'childs',
          enabled: 'enabled'
        }
      }
    }
  },
  methods: {
    ...mapActions(['getTaskType']),

    handleTimeChange(scope, val, taskSubParamList) {
      let [start, end] = val
      let index = scope.$index
      let prev = taskSubParamList[index - 1]
      let next = taskSubParamList[index + 1]
      scope.row.startTime = start
      scope.row.endTime = end

      // 设置联动
      // 如果存在下一个，修改其起始值
      // if (next) {
      //   next.startTime = start

      // }
      // if (prev) {
      //   prev.endTime = end
      // }
    },

    getTaskName() {
      this.$api[`main/taskName`]()
        .then(data => {
          this.formData.taskName = data.rows.taskName
        })
        .catch(err => {})
    },

    initData(taskId) {
      this.$api[`main/taskInfo`]({ taskId })
        .then(data => {
          let { categoryId, categoryMap } = data.rows
          data.rows.categoryId = [...categoryMap[categoryId], categoryId]
          this.refresh = false
          this.$nextTick(() => {
            this.refresh = true
            this.formData = data.rows
          })
        })
        .catch(err => {})
    },

    ok() {
      let params = JSON.parse(JSON.stringify(this.formData))
      params.categoryId = params.categoryId.pop()
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api[
            this.$route.query.taskId ? `main/taskUpdate` : `main/taskSave`
          ](params)
            .then(data => {
              this.$router.push({ name: 'task' })
            })
            .catch(err => {
              console.log(err)
              if (err.data && err.data.taskSubList) {
                this.showReason = true
                this.formData.taskSubList = err.data.taskSubList
              }
            })
        } else {
          this.$message.warning('请填写正确的表单')
        }
      })
    },
    cancel() {
      this.$confirm('是否放弃本次操作？', '警告', {
        type: 'error'
      })
        .then(() => {
          this.$router.push({ name: 'task' })
        })
        .catch(() => {})
    },

    handleAdd(item, index) {
      this.formData.taskSubList.splice(index + 1, 0, taskSubList())
    },
    handleMinus(item, index) {
      this.formData.taskSubList.splice(index, 1)
    },

    handleAddTable(list, { $index }, id) {
      let paramMapList
      let paramEl = this.taskType.find(el => el.key === id)
      if (paramEl) {
        paramEl = paramEl.param
      }
      if (!paramEl) {
        paramEl = []
      }
      paramMapList = [...initialCol(), ...JSON.parse(JSON.stringify(paramEl))]
      let added = {
        ...taskSubList().taskSubParamList[0],
        paramMapList
      }
      list.splice($index + 1, 0, added)
    },

    handleMinusTable(list, { $index }) {
      list.splice($index, 1)
    },
    validator() {
      return validator.apply(null, arguments)
    },
    handleTaskChange(index, val) {
      let list = this.formData.taskSubList[index].taskSubParamList
      this.showReason = false

      // let paramMapList = this.formData.taskSubList[index].taskSubParamList[0].paramMapList
      let paramEl = this.taskType.find(el => el.key === val)
      if (paramEl) {
        paramEl = paramEl.param
      }
      if (!paramEl) {
        paramEl = []
      }

      list.forEach(element => {
        // 请空报错原因
        delete element.reason
        element.paramMapList = [
          ...initialCol(),
          ...JSON.parse(JSON.stringify(paramEl))
        ]
      })

      this.$nextTick(() => this.$refs.form.clearValidate())
    },
    getParams(id) {
      if (id == null) {
        return initialCol
      } else {
        let param = this.taskType.find(el => el.key === id)
        if (param) {
          param = param.param
        }
        if (!param) {
          param = []
        } else {
          param = param.map(el => ({ prop: '', name: el.key }))
        }
        return [...initialCol, ...param]
      }
    }
  },
  watch: {
    formData(val) {
      this.showReason = false
    }
  }
}
</script>

<style lang='scss' scoped>
.table-form-item {
  margin-top: 18px;
  margin-left: 18px;
  margin-right: 18px;
}
.flex {
  display: flex;
  .btn {
    display: flex;
    margin-left: 20px;
    flex: 1;
  }
}
</style>
<style lang="scss">
.custom_from {
  .el-button--text {
    i {
      font-size: 18px;
    }
  }
  .btn {
    .el-button--text {
      padding: 2px 6px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
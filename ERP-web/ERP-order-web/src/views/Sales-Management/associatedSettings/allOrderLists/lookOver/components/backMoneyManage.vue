<template>
  <!-- 退款原因管理 -->
  <div class>
    <universal-layout
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
    >
      <template slot="search">
        <search :searchList="searchList" @search="search"></search>
      </template>
      <template slot="table">
        <yt-table :data="tableList" :columns="columns" :border="true" @handleSelectionChange="handleSelectionChange">
          <el-table-column type="index" label="序号" width="60" align="center" slot="left"/>
          <el-table-column label="操作" width="120" align="center" slot="right">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row.refundReasonId)" v-if="scope.row.type">编辑</el-button>
              <el-button type="text" @click="isDel(scope.row.refundReasonId)" v-if="scope.row.type">删除</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="500px" :append-to-body="true" center>
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" size="small">
        <el-form-item label="原因级别" prop="level">
          <el-select v-model="form.level" style="width:100%" @change="changelevel">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-collapse-transition>
          <el-form-item label="上级原因" prop="parentId" v-if="form.level!=1">
            <el-select v-model="form.parentId" style="width:100%">
              <el-option :label="i.name" :value="i.refundReasonId" v-for="(i,j) in list" :key="j"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-transition>
        <el-form-item label="退款原因" prop="name">
          <el-input type="textarea" class="textarea" v-model="form.name"/>
        </el-form-item>
        <el-form-item prop="activateFlag">
          <el-checkbox v-model="form.activateFlag">是否激活</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    update: Function
  },
  data() {
    return {
      searchList: [
        {
          label: '退款原因',
          value: 'refundReason',
          type: 'input'
        },
        {
          label: '上级原因',
          value: 'refundReasonParent',
          type: 'input'
        },
        {
          label: '操作人',
          value: 'creatorId',
          type: 'select',
          children: []
        }
      ],
      btnList: [
        {
          name: '添 加',
          fn: () => {
            this.dialogVisible = true
            this.title = '添加退款原因'
            this.$nextTick(() => {
              this.$refs.form.resetFields()
            })
          }
        },
        {
          name: '批量删除',
          type: 'danger',
          fn: () => {
            if (this.refundReasonIds.length) {
              this.del({
                refundReasonIds: this.refundReasonIds
              })
            } else {
              this.$message.warning('请选择需要批量删除的数据')
            }
          }
        }
      ],
      tableList: [],
      columns: [
        {
          value: 'name',
          label: '退款原因名称'
        },
        {
          value: 'parentName',
          label: '上级原因'
        },
        {
          value: 'levelName',
          label: '级别',
          width: '90'
        },
        {
          value: 'typeName',
          label: '类型',
          width: '90'
        },
        {
          value: 'activateFlagName',
          label: '是否激活',
          width: '90'
        },
        {
          value: 'creatorName',
          label: '添加人',
          width: '90'
        },
        {
          value: 'createTime',
          label: '添加时间',
          width: '150'
        }
      ],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      searchInfo: {},
      refundReasonIds: [],
      title: null,
      dialogVisible: false,
      form: {
        activateFlag: true,
        name: null,
        parentId: null,
        level: null
      },
      rules: {
        level: [{ required: true, message: '请选择級別', trigger: 'change' }],
        parentId: [
          {
            required: true,
            message: '请选择上级原因',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入退款原因',
            trigger: 'change'
          }
        ]
      },
      refundReasonId: null
    }
  },
  created() {
    let opts = null
    if (this.$store.state.common.handleUser.operator) {
      opts = this.$store.state.common.handleUser.operator
    }
    let el = this.searchList[2]
    el.children = opts
  },
  methods: {
    ...mapActions(['getHandleUser']),
    changelevel(val) {
      if (val == 1) {
        this.form.parentId = null
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.form)
          params.activateFlag = params.activateFlag ? 1 : 0
          params.parentId = params.level == 1 ? 0 : params.parentId
          let url
          if (this.title == '添加退款原因') {
            url = 'refundReasonSave'
          } else {
            url = 'refundReasonUpdate'
            params = Object.assign({}, params, {
              refundReasonId: this.refundReasonId
            })
          }
          this.http(url, params, res => {
            this.$message.success(res.msg)
            this.dialogVisible = false
            this.getReasonList()
            this.update()
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    edit(refundReasonId) {
      this.refundReasonId = refundReasonId
      this.dialogVisible = true
      this.title = '编辑退款原因'
      this.http('refundReasonInfo', { refundReasonId }, res => {
        let obj = res.rows
        this.form.activateFlag = obj.activateFlag ? true : false
        this.form.name = obj.name
        this.form.parentId = obj.parentId
        this.form.level = obj.level + ''
      })
    },
    handleSelectionChange(val) {
      this.refundReasonIds = val.map(i => i.refundReasonId)
    },
    del(params) {
      this.http('refundReasonRemove', params, res => {
        this.$message.success(res.msg)
        this.getReasonList()
        this.update()
      })
    },
    isDel(refundReasonId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = {
            refundReasonIds: Array.of(refundReasonId)
          }
          this.del(params)
        })
        .catch(() => {
          return false
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getReasonList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getReasonList('search')
    },
    search(val) {
      this.searchInfo = val
      this.getReasonList('search')
    },
    //获取退款原因列表
    getReasonList(val) {
      let params = {
        sortOrder: 'asc',
        pageSize: this.pageSize,
        pageNumber: this.pageNo
      }
      if (val == 'search') {
        let data = { ...this.searchInfo }
        let obj = {}
        for (let key in data) {
          if (data[key]) obj[key] = data[key]
        }
        params = Object.assign({}, params, obj)
      }

      this.http('refundReasonList', params, res => {
        this.tableList = res.rows
        this.total = res.total
        this.pageNo = res.pageNo
        this.pageSize = res.pageSize
      })
    },
    http(url, params, callback) {
      this.$api['order/' + url](params)
        .then(res => {
          callback && callback(res)
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    }
  },
  computed: {
    ...mapState(['handleUser'])
  }
}
</script>

<style lang="scss">
.textarea {
  textarea {
    height: 180px;
    resize: none;
  }
}
</style>

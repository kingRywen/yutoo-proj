<template>
  <div>
    <div class="grid-content bg-purple-light">
      <el-form class="search-top-form search-wrap" ref="form" :inline="true" :model="form" label-width="70px">
        <el-form-item size="small">
          <el-select v-model="form.region" placeholder="来源渠道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱:"
          size="small"
          :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]"
        >
          <el-input v-model="form.email" class="emailInput"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" size="mini" class="search-submit" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="grid-content search-wrap">
      <el-button type="primary" size="mini" class="search-submit" @click="onAdd">添加</el-button>
      <el-button type="primary" size="mini" class="search-submit" @click="onSubmit">修改</el-button>
      <el-button type="primary" size="mini" class="search-submit" @click="onSubmit">删除</el-button>
    </div>
    <div>
      <yt-table :columns="columns" :data="tableData3">
        <template>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                class="handle-btn"
                size="mini"
                icon="el-icon-tickets"
                @click="handleEdit(scope.$index, scope.row)"
              ></el-button>
              <el-button
                class="handle-btn"
                size="mini"
                icon="el-icon-edit"
                @click="handleDetail(scope.$index, scope.row)"
              ></el-button>
            </template>
          </el-table-column>
        </template>
      </yt-table>
    </div>
    <!-- <div>
      <simple-form :fields="fields" :form-data="form" ref="smform"></simple-form>
      <el-button type="primary" @click="$refs.smform.validate()">yanzz</el-button>
    </div>-->
    <div>
      <!-- 添加编辑dialog -->
      <yt-dialog :options="options" :events="dialogEvents">
        <div v-if="isEdit">
          <el-form
            class="search-top-form search-wrap"
            ref="dialogForm"
            :inline="true"
            :model="dialogForm"
            label-width="120px"
          >
            <el-row>
              <el-form-item size="small" label="订单来源:" prop="region" class="select-input">
                <el-select v-model="dialogForm.store_id" placeholder="来源渠道" class="input-width input-right-padding">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="small" label="接收邮件协议:" prop="region" class="select-input">
                <el-select v-model="dialogForm.protocol" placeholder="来源渠道" class="input-width">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row class="form-row">
              <el-form-item
                prop="email"
                label="邮箱账号:"
                size="small"
                :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]"
              >
                <el-input v-model="dialogForm.nickName" class="emailInput input-right-padding"></el-input>
              </el-form-item>
              <el-form-item
                prop="email"
                label="密码/授权码:"
                size="small"
                :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]"
              >
                <el-input v-model="dialogForm.auth_code" class="emailInput"></el-input>
              </el-form-item>
            </el-row>
            <el-row class="form-row select-input">
              <el-form-item label="账户签名：">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入内容"
                  v-model="dialogForm.signature"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row class="form-row select-input">
              <el-form-item label="是否激活">
                <input type="checkbox" class="checkbox" v-model="dialogForm.activate_flag">
              </el-form-item>
            </el-row>

            <el-row>
              <el-col :offset="9" :span="6">
                <el-form-item>
                  <el-button type="primary" class="search-submit save-btn" @click="onAddSubmit">保存</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-else>
          <yt-table :columns="detailColumns" :data="detailData"></yt-table>
        </div>
      </yt-dialog>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage3"
        :page-size="100"
        layout="prev, pager, next, jumper"
        :page-count="pageCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage3: 5,
      pageSize: 100,
      pageCount: 30,
      isEdit: true,
      options: {
        visible: false,
        title: '添加',
        width: '930px',
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
      dialogEvents: {
        closed: () => {
          this.isEdit = true
        }
      },
      form: {
        region: '',
        email: ''
      },
      dialogForm: {
        store_id: '',
        protocol: '',
        nickName: '',
        auth_code: '',
        signature: '',
        activate_flag: ''
      },
      columns: [
        {
          value: 'storeName',
          label: '订单来源'
        },
        {
          value: 'protocol',
          label: '接收邮件协议'
        },
        {
          value: 'acount',
          label: '用户名'
        },
        {
          value: 'sendNum',
          label: '发送数量'
        },
        {
          value: 'receiveNum',
          label: '收取数量'
        },
        {
          label: '激活',
          render(h, scope) {
            return <el-switch value={JSON.parse(scope.row.activateFlag)} />
          }
        },
        {
          value: 'createTime',
          label: '添加时间'
        }
      ],
      tableData3: [
        {
          storeName: 'Amazon-01-us',
          protocol: 'POP3',
          acount: '402876909@qq.com',
          sendNum: '11',
          receiveNum: '110',
          activateFlag: 'true',
          createTime: '2018-08-06'
        },
        {
          storeName: 'Amazon-01-us',
          protocol: 'POP3',
          acount: '402876909@qq.com',
          sendNum: '11',
          receiveNum: '110',
          activateFlag: 'true',
          createTime: '2018-08-06'
        },
        {
          storeName: 'Amazon-01-us',
          protocol: 'POP3',
          acount: '402876909@qq.com',
          sendNum: '11',
          receiveNum: '110',
          activateFlag: 'true',
          createTime: '2018-08-06'
        }
      ],
      detailColumns: [
        {
          value: 'storeName1',
          label: '操作类型'
        },
        {
          value: 'storeName2',
          label: '操作时间'
        },
        {
          value: 'storeName3',
          label: '操作人员'
        },
        {
          value: 'storeName4',
          label: '下单号'
        },
        {
          value: 'storeName5',
          label: '销单号'
        },
        {
          value: 'storeName6',
          label: '备注'
        }
      ],
      detailData: []
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    onAdd() {
      let vm = this
      vm.options.visible = true
      vm.$api['email/protocolList']().then(data => {
        console.log('protocolList')
        console.log(data)
      })
    },
    onAddSubmit() {
      console.log(this.dialogForm)
    },
    handleEdit(index, row) {
      this.options.visible = true
      this.dialogForm = {
        store_id: 'beijing',
        protocol: 'beijing',
        nickName: '12345',
        auth_code: '456',
        signature: 'dfsda',
        activate_flag: true
      }
      console.log(index, row)
    },
    handleDetail(index, row) {
      this.isEdit = false
      this.options.visible = true
      console.log(this.isEdit)
      console.log(index, row)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss">
.bg-purple-light {
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '';
  }
}
.select-input {
  .el-form-item__label::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }
}
.search-top-form {
  .emailInput {
    width: 260px;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .input-width {
    width: 260px;
  }
  .input-right-padding {
    padding-right: 30px;
  }
}

.el-form-item__content {
  line-height: 30px;
}
.el-button {
  border: none;
}
.handle-btn.el-button--mini {
  padding: 7px 8px;
}
.el-textarea {
  width: 680px;
}
.form-row {
  margin-top: 20px;
}
.checkbox {
  margin-top: 14px;
}
.save-btn {
  width: 100px;
}
</style>

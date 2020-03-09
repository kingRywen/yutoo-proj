<template>
  <div class="write-template">
    <el-form class="search-top-form" :model="writeData" label-width="170px" ref="form">
      <el-col>
        <el-form-item
          size="small"
          label="订单来源："
          class="martop"
          prop="storeId"
          :rules="[
            { required: true, message: '请选择订单来源', trigger: 'change' }            
          ]"
        >
          <el-select placeholder="选择来源店铺" v-model="writeData.storeId">
            <el-option :label="item.name" :value="item.storeId" v-for="item in shopList" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="附件：" class="martop">
          <el-upload
            action="/"
            multiple
            :on-remove="handleRemove"
            :on-change="handleChange"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip"></div>
          </el-upload>
        </el-form-item>
        <el-form-item
          size="small"
          label="客户姓名："
          class="martop"
          prop="customerName"
          :rules="[
            { required: true, message: '请输入客户姓名', trigger: 'change' }            
          ]"
        >
          <el-input size="small" class="normal-input" v-model="writeData.customerName"></el-input>
        </el-form-item>
        <el-form-item
          size="small"
          label="主题："
          class="martop"
          prop="subject"
          :rules="[
            { required: true, message: '请输入主题', trigger: 'change' }            
          ]"
        >
          <el-input size="small" class="normal-input" v-model="writeData.subject"></el-input>
        </el-form-item>
        <el-form-item
          size="small"
          label="邮箱："
          class="martop"
          prop="customerEmailBox"
          :rules="[
            { required: true, message: '请输入邮箱', trigger: 'change' },
             { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }            
          ]"
        >
          <div style="display: flex;">
            <el-input size="small" class="normal-input" v-model="writeData.customerEmailBox"></el-input>
            <div style="flex: 1;margin-left:10px;color:#f56c6c">注：不建议修改客户邮件，一旦对应错了账号，会关联账号被封</div>
          </div>
        </el-form-item>
        <el-form-item
          size="small"
          label="正文："
          class="martop"
          prop="content"
          :rules="[
            { required: true, message: '请输入正文', trigger: 'change' }            
          ]"
        >
          <UeEditor v-model="writeData.content" ref="editor" :config="editorConfig" style="z-index: 99999;"/>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
import { Utils } from '@yutoo/yutoo'
import storage from 'Utils/saver'
import { CONST_PORT_CONFIG } from 'Config'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      fileList: [],
      editorConfig: {
        initialFrameHeight: 190,
        initialFrameWidth: '100%'
      },
      writeData: {
        storeId: '',
        subject: '',
        customerEmailBox: '',
        content: '',
        customerName: '',
        file: []
      }
    }
  },
  methods: {
    submitForm(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api['procurement/purchaseSendEmail'](this.writeData).then(
            res => {
              this.$message.success(res.msg)
              callback && callback()
            }
          )
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
    },
    getFilePath() {
      return this.$api['procurement/purchaseGetFilePath']({}).then(
        res => res.path
      )
    },
    async handleChange(file, fileList) {
      console.log('change', fileList)
      this.fileList = fileList
      let url = await this.getFilePath()
      let path = await Utils.oss.batchUpload(
        this.fileList.map(el => el.raw),
        url,
        CONST_PORT_CONFIG.PRODUCT_URL + '/img/get/oss/signature',
        null,
        storage.get('local', 'token')
      )
      this.writeData.file = path.map(item => {
        return {
          name: file.name,
          path: 'https://yutoo-admin-erp.oss-cn-shenzhen.aliyuncs.com/' + item
        }
      })
    },
    handleRemove(file, fileList) {
      let index = this.writeData.file.findIndex(item => item.name === file.name)
      this.writeData.file.splice(index, 1)
      this.fileList = fileList
    },
    ...mapActions('common', ['getAllShopList'])
  },
  computed: {
    ...mapGetters('common', ['shopList'])
  },
  mounted() {
    this.getAllShopList()
  }
}
</script>

<style lang="scss">
.write-template {
  padding-right: 10px;
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

    .el-form-item__content {
      line-height: 33px;
    }
    .el-form-item__label {
      padding-right: 0;
    }
    .normal-input {
      width: 500px;
    }
    .special-span {
      line-height: 16px;
      display: inline-block;
      width: 270px;
      height: 33px;
      vertical-align: middle;
      box-sizing: border-box;
    }
    .email-left {
      height: 606px;
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

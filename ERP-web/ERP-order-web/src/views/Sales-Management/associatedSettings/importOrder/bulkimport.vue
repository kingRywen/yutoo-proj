<template>
  <universal-layout>
    <el-button type="primary" size="small" @click="download">
      下载导单模板
      <i class="el-icon-download"></i>
    </el-button>
    <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" class="form">
      <el-form-item prop="deliveryWarehouseId">
        <el-select placeholder="发货仓库" v-model="form.deliveryWarehouseId">
          <el-option :label="item.warehouseName" :value="item.warehouseId" v-for="item in warehouseList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="platformId">
        <el-select placeholder="选择平台来源" v-model="form.platformId" @change="changePlatform">
          <el-option :label="item.name" :value="item.platformId" v-for="item in platformList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="storeId">
        <el-select placeholder="选择店铺来源" v-model="form.storeId">
          <el-option :label="item.name" :value="item.storeId" v-for="item in shopList" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="transportType">
        <el-select placeholder="选择发货方式" v-model="form.transportType">
          <el-option
            :label="item.deliveryName"
            :value="item.deliveryId"
            v-for="item in deliveryModeList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item>
        <el-checkbox v-model="form.overseaPurchaseFlag" :true-label="1" :false-label="0">是否海外仓直采</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.executeStrategyFlag" :true-label="1" :false-label="0">是否执行订单策略</el-checkbox>
      </el-form-item>
      <br>
      <el-form-item>
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="url"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-change="handleOnChange"
          :with-credentials="true"
          :headers="headers"
          :data="file"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-exceed="onExceed"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">添加文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认导入订单</el-button>
          <div slot="tip" class="el-upload__tip">只能导入excel文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </universal-layout>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex'

import storage from 'Utils/saver'
import { CONST_PORT_CONFIG } from '@/config/index'

export default {
  data() {
    return {
      form: {
        overseaPurchaseFlag: 0,
        executeStrategyFlag: 0,
        deliveryWarehouseId: null,
        platformId: null,
        storeId: null,
        transportType: null
      },
      rules: {
        deliveryWarehouseId: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        platformId: [
          { required: true, message: '请选择平台', trigger: 'change' }
        ],
        storeId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        transportType: [
          {
            required: true,
            message: '请选择发货方式',
            trigger: 'change'
          }
        ]
      },
      shopList: [],
      deliveryModeList: [],
      fileList: [],
      url: CONST_PORT_CONFIG.ORDER_URL + '/order/import/upload',
      headers: {
        token: storage.get('local', 'token')
      },
      file: {}
    }
  },
  computed: {
    ...mapGetters('common', ['warehouseList', 'platformList'])
  },
  methods: {
    download() {
      this.$api['order/importDownloadTemplate']()
        .then(res => {
          window.location.href = res.path
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    changePlatform(val) {
      this.platformList.forEach(i => {
        if (i.platformId == val) {
          this.shopList = i.stores
        }
      })
    },
    submitUpload() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.fileList.length) {
            this.$message.warning('请添加需要导入的订单文件再上传')
            return
          }
          this.$api['order/importUpload']({
            ...this.form,
            file: this.fileList[0]
          })
            .then(data => {
              this.$message.success(data.msg)
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        } else {
          return false
        }
      })
    },
    beforeUpload(file) {
      this.file['file'] = file
      let obj = Object.assign({}, this.form)
      obj.overseaPurchaseFlag = obj.overseaPurchaseFlag ? 1 : 0
      obj.executeStrategyFlag = obj.executeStrategyFlag ? 1 : 0
      for (let key in obj) {
        this.file[key] = obj[key]
      }
    },
    uploadSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.$message.success(response.msg)
      } else {
        this.$message.error(response.msg)
      }
    },
    uploadError(err, file, fileList) {
      console.log(err)
    },
    onExceed(files, fileList) {
      // this.$refs.upload.clearFiles()
      // this.$message.warning('请次只能上传一个')
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      console.log(file, fileList)
    },
    handleOnChange(file, fileList) {
      if (fileList.length > 1) {
        this.fileList.splice(0)
        this.fileList.push(file)
      }
      if (fileList.length === 1) {
        this.fileList.push(file)
      }
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    //获取发货方式
    getDeliveryModeList() {
      this.$api['order/GetDeliveryModeList']()
        .then(res => {
          this.deliveryModeList = res.rows
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    //获取仓库
    ...mapActions('common', ['getWarehouseList', 'getAllShopList'])
  },
  created() {
    this.getWarehouseList()
    this.getAllShopList()
    this.getDeliveryModeList()
  }
}
</script>

<style lang="css">
.form {
  margin-top: 10px;
}
</style>

<template>
  <div>
    <div class="col-table">
      <el-form :model="ruleForm" ref="ruleForm" label-width="0" size="medium">
        <template v-for="(item,index) in config">
          <el-row :key="index">
            <el-col :span="span[0]" class="col-left" :style="setStyle(item)">
              <span :class="item.required?'required':''">{{item.label || '-'}}</span>
            </el-col>
            <!-- 图片 -->
            <el-col
              :span="span[1]"
              class="col-right"
              :style="item.style"
              :class="item.fn?'cursor':''"
              v-if="item.type==='image'"
            >
              <template v-if="typeof data[item.value]=='string'">
                <img
                  :src="data[item.value]"
                  height="50px"
                  style="display: inline-block;"
                  @click="openImage(data[item.value])"
                />
              </template>
              <template v-else-if="Array.isArray(data[item.value])">
                <el-carousel trigger="click" height="50px">
                  <el-carousel-item v-for="(j,l) in data[item.value]" :key="l">
                    <img :src="j" height="100%" style="display: inline-block;" @click="openImage(j)" />
                  </el-carousel-item>
                </el-carousel>
              </template>
              <!--  -->
            </el-col>
            <!-- 输入框 -->
            <el-col :span="span[1]" class="col-right pd" v-else-if="item.type==='input'">
              <el-form-item :prop="item.value" :rules="createRules(item)">
                <el-input :style="item.style" v-model="ruleForm[item.value]" placeholder="请输入" size="medium" clearable></el-input>
              </el-form-item>
            </el-col>
            <!-- 文本框 -->
            <el-col :span="span[1]" class="col-right pd" v-else-if="item.type==='textarea'">
              <el-form-item :prop="item.value" :rules="createRules(item)">
                <el-input
                  :style="item.style"
                  v-model.trim="ruleForm[item.value]"
                  placeholder="请输入"
                  size="medium"
                  type="textarea"
                  :rows="3"
                  resize="none"
                  maxlength="50"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 计数器 -->
            <el-col :span="span[1]" class="col-right pd" v-else-if="item.type==='inputNumber'">
              <el-form-item :prop="item.value" :rules="createRules(item)">
                <el-input-number
                  :style="item.style || 'width:100%;'"
                  v-model.number="ruleForm[item.value]"
                  controls-position="right"
                  :min="1"
                  :precision="2"
                  size="medium"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <!-- 选择款 -->
            <el-col :span="span[1]" class="col-right pd" v-else-if="item.type==='select'">
              <el-form-item :prop="item.value" :rules="createRules(item)">
                <el-select
                  v-model.number="ruleForm[item.value]"
                  clearable
                  placeholder="请选择"
                  size="medium"
                  :style="item.style || 'width:100%;'"
                >
                  <template v-if="Array.isArray(item.list) ">
                    <el-option v-for="(j,k) in item.list" :key="k" :label="j.label" :value="j.value"></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 上传 -->
            <el-col :span="span[1]" class="col-right pd" :style="item.style" v-else-if="item.type==='upload'">
              <el-form-item :prop="item.value" :rules="createRules(item)">
                <el-upload
                  v-bind="item.props || {}"
                  action="/"
                  :auto-upload="false"
                  accept=".jpg, .png"
                  :limit="5"
                  class="upload"
                  v-on="item.event"
                  :before-upload="handleBeforeUpload"
                  :on-exceed="handleExceed"
                  :on-change="handleChange"
                  :file-list="ruleForm.fileList"
                  :on-remove="handleChange"
                  :on-preview="handlePictureCardPreview"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
            <!--  -->
            <el-col :span="span[1]" class="col-right" v-else>
              <span
                :class="item.event?'cursor':''"
                :style="item.style"
                @click="item.event && (typeof item.event==='function') && item.event(data[item.value],data,item,index)"
              >{{data[item.value] || '-'}}</span>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </div>
    <!--  -->
    <el-dialog :visible.sync="visible" width="50%" append-to-body>
      <img :src="imgsrc" height="auto" width="100%" />
    </el-dialog>
  </div>
</template>
<script>
import { oss } from '@yutoo/yutoo/utils/utils.umd.min'
import storage from 'Utils/saver'
import { CONST_PORT_CONFIG } from 'Config'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Array,
      default: () => []
    },
    span: {
      type: Array,
      default: () => [6, 18]
    }
  },
  mounted() {},
  data() {
    return {
      imgsrc: '',
      visible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      ruleForm: {
        fileList: []
      }
    }
  },
  methods: {
    controlChange(item, val) {
      this.$set(this.ruleForm, item.value, val)
      // this.key++;
    },
    getPath() {
      return this.$api['finance/financeGlobalFilePath']().then(res => {
        return res
      })
    },
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.warning('图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    handleChange(file, fileList) {
      this.ruleForm.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.imgsrc = file.url
      this.visible = true
    },
    submitForm(cb) {
      const _this = this
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          try {
            const isUpload = _this.config.filter(i => i.type == 'upload').length
            let obj = { ..._this.ruleForm }
            if (isUpload) {
              let { path } = await _this.getPath()
              let existing = []
              _this.ruleForm.fileList.forEach(item => {
                if (!item.raw && item.url) {
                  existing.push(item.url)
                }
              })
              let binary = _this.ruleForm.fileList.map(el => el.raw)
              let url = []
              if (binary.length && binary.every(i => i !== undefined)) {
                url = await oss.batchUpload(
                  binary,
                  path,
                  CONST_PORT_CONFIG.PRODUCT_URL + '/img/get/oss/signature',
                  null,
                  storage.get('local', 'token')
                )
              }
              obj.fileList = [...url, ...existing]
            } else {
              delete obj['fileList']
            }
            cb && cb(obj)
          } catch (error) {
            console.error(error)
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      // this.$refs.ruleForm.resetFields();
      // this.ruleForm = {
      //     fileList: []
      // };
    },
    openImage(path) {
      this.visible = true
      this.imgsrc = path
    },
    createRules(item) {
      let obj = {
        required: item.required || false,
        trigger: item.type == 'select' ? 'change' : 'blur'
      }
      if (item.validator && typeof item.validator == 'function') {
        obj['validator'] = item.validator
      } else {
        obj['message'] = `${item.label}不能为空`
      }
      return obj
    },
    setStyle(item) {
      let str = ''
      switch (item.type) {
        case 'image':
          str = 'height:82px;line-height:50px;'
          break
        case 'input':
        case 'select':
          str = 'height:86px;line-height:56px;'
          break
        case 'inputNumber':
          str = 'height:86px;line-height:56px;'
          break
        case 'textarea':
          str = 'height:126px;line-height:106px;'
          break
        case 'upload':
          str = 'height:146px;line-height:106px;'
          break
        default:
          break
      }
      if (item.align) str += `text-align:${item.align};`
      return str
    }
  }
}
</script>
<style lang="scss" >
.col-table {
  border: 1px solid #dcdfe6;
  background: #fff;
  transition: all 0.1s;
  border-radius: 4px;
  .el-row {
    border-bottom: 1px solid #dcdfe6;
    transition: all 0.2s;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      transition: all 0.1s;
      background: #f5f7fa;
    }
    .el-col {
      padding: 15px;
    }
    .col-left {
      border-right: 1px solid #dcdfe6;
      text-align: center;
      background: #f5f7fa;
      span {
        font-size: 14px;
        color: #909399;
      }
      .required {
        &::before {
          content: '*';
          color: #f56c6c;
          margin-right: 4px;
          font-size: 12px;
        }
      }
    }
    .col-right {
      font-size: 14px;
      color: #606266;
      text-align: center;
    }
    .pd {
      padding: 22px 22px 0 22px;
    }
    .cursor {
      cursor: pointer;
      color: #67c23a;
      &:hover {
        transition: all 0.3s;
        font-weight: 700;
        user-select: none;
      }
    }
  }
  .upload {
    .el-upload-list--picture-card {
      .el-upload-list__item {
        width: 80px !important;
        height: 80px !important;
        line-height: 80px !important;
      }
    }
    .el-upload--picture-card {
      width: 80px !important;
      height: 80px !important;
      line-height: 80px !important;
    }
  }
}
</style>

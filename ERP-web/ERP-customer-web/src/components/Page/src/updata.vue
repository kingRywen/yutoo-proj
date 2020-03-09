<template>
  <div class="twp-update">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :http-request="handleHttpRequest"
      :file-list="fileList"
      :limit="1"
      :multiple="multiple"
      :accept="`${accept}/*`"
      :list-type="listType"
    >
      <el-button size="small" type="primary">{{btnMsg}}</el-button>
      <div slot="tip" class="el-upload__tip"></div>
    </el-upload>
  </div>
</template>

<script>
import { oss } from '@yutoo/yutoo/utils/utils.umd.min'
import { OSS_CONFIG } from 'Config'
import storage from 'Utils/saver'
/*
 *使用    <twp-updata :list.sync="form.refundOucher" listType="picture" btnMsg="上传退款凭证" accept="image"></twp-updata>
 */
export default {
  name: 'twp-updata',
  props: {
    list: {
      type: [Array, Object],
      default: () => {
        return []
      }
    },
    btnMsg: {
      type: String,
      default: '上传'
    },
    listType: {
      type: String,
      default: 'text' // text/picture/picture-card
    },
    limit: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  created() {
    this.$emit('success', false)
  },
  computed: {
    fileArr: {
      get() {
        return this.list
      },
      set(val) {
        this.$emit('update:list', val)
      }
    }
  },
  methods: {
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handleHttpRequest() {
      let vm = this
      const token = storage.get('local', 'token')
      vm.uploadFlag = false
      vm.$api[`email/pathGet`]()
        .then(async data => {
          let { path } = data
          let res = await oss.batchUpload(
            vm.fileList
              .filter(el => el.path == null && el.raw)
              .map(el => el.raw),
            path,
            // eslint-disable-next-line
            OSS_CONFIG.signUrl,
            null,
            token
          )
          vm.fileList.forEach(async element => {
            if (!element.path) {
              element.path = res.shift()
            } else {
              return
            }
            vm.uploadFlag = false
            await vm.$api['email/downloadPathGet']({
              path: element.path
            })
              .then(data => {
                element.path = data.path
                vm.uploadFlag = true
              })
              .catch(() => {})
          })
          this.$emit('success', true)
          if (vm.limit == 1) {
            vm.fileArr = vm.fileList[0]
          } else {
            vm.fileArr = vm.fileList
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang='scss'>
.twp-update {
  background: #fff;
  .el-upload-list {
    width: 360px;
  }
}
</style>
<template>
  <v-spin tip="处理中." :spinning="spinning" @click="$refs.upload1.active = true">
    <div class="upload_wrapper" ref="content" @drop.stop.prevent="handleDrop" @dragover.stop.prevent="handleDragover">
      <div v-show="showDrop && ($refs.upload1 && $refs.upload1.dropActive)" class="drop-active">
        <h3>放下鼠标确认</h3>
      </div>
      <div class="upload">
        <div class="table-responsive">
          <div class="text-center p-5">
            <label :for="inputId" class="file-area" v-if="!$attrs.show && !show && !files.length">
              <span class="up_text_wrapper">
                <v-icon type="cloud-upload-o"></v-icon>
                <span class="text">点击添加图片，或将文件拖到此</span>
              </span>
            </label>
            <label :for="inputId" class="file-area" v-if="($attrs.show || show) && !files.length">
              <span class="up_text_wrapper">
                <v-icon type="file"></v-icon>
                <span class="text">暂无上传的图片</span>
              </span>
            </label>
          </div>
          <label :for="inputId" class="file-ul">
            <draggable
              class="upload-allfiles"
              id="items"
              element="ul"
              v-model="files"
              :options="dragOptions"
              @start="showDrop=false"
              @end="handlerEnd"
            >
              <li v-for="(file, index) in files" :key="file.id" :class="file._checked ? '_checked': ''">
                <!-- {{file._checked}} -->
                <v-checkbox
                  :disabled="$attrs.show || show"
                  v-if="file.has"
                  v-model="file._checked"
                  @change="val => file._checked = val"
                ></v-checkbox>
                <div class="imgBox">
                  <img :src="file.thumb || '/static/no-image.jpg'">
                </div>

                <div class="bot">
                  <div class="first">
                    <span class="title">{{file.name}}</span>
                    <v-radio
                      :disabled="$attrs.show || show"
                      @input="handleRadioChangeLib(index)"
                      v-model.number="file.mainFlag"
                      :label="1"
                      v-if="lib"
                    >主图</v-radio>
                    <!-- 店铺平台主图 -->
                    <v-radio
                      :disabled="$attrs.show || show"
                      @input="handleRadioChange(index, file, $event)"
                      v-model="radio"
                      :label="index"
                      v-else-if="hasImg"
                    >主图</v-radio>

                    <!-- 产品库主图 -->
                    <v-radio
                      :disabled="$attrs.show || show"
                      @input="handleRadioChange(index, file, $event, 'base')"
                      v-model="radio"
                      :label="index"
                      v-else
                    >主图</v-radio>
                  </div>
                  <div class="second">
                    <span v-if="typeof file.size === 'string'">{{file.size}}</span>
                    <span v-else>{{file.size | fixNumber}}KB</span>
                  </div>
                  <v-progress-line
                    v-if="file.active || file.progress"
                    :percent="+file.progress"
                    :status="file.active ? 'active': (file.error ? 'exception' : file.progress != 0 ?'success' : null)"
                    :stroke-width="5"
                  ></v-progress-line>
                  <div>
                    <v-input
                      :disabled="$attrs.show || show"
                      placeholder="请输入图片备注"
                      :key="index"
                      v-model="file.remark"
                      @input="deUpdate(file, $event)"
                      autosize
                    ></v-input>
                  </div>
                </div>
                <el-popover v-if="!baseSave &&!$attrs.show && !show" width="460" :key="Math.random()">
                  <div style="text-align: center;margin-bottom:20px;font-size:12px">
                    <span>警告：</span>
                    <span style="color:red">删除该图片会将该{{!type ? '平台' : '店铺'}}对应的图片删除，但不会同步到售卖平台</span>
                  </div>
                  <div style="text-align: center; margin: 0">
                    <el-button
                      size="mini"
                      type="warning"
                      @click="handleDel(1, file, index)"
                      :loading="loadingBtn"
                    >删除相同颜色下的图片</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="handleDel(0, file, index)"
                      :loading="loadingBtn"
                    >直接删除图片</el-button>
                  </div>
                  <el-button
                    slot="reference"
                    v-if="!$attrs.show && !show"
                    type="danger"
                    icon="el-icon-delete"
                    class="dropdown-item del-file-btn"
                    circle
                    size="mini"
                  ></el-button>
                </el-popover>
                <el-button
                  v-if="!$attrs.show && !show && baseSave"
                  type="danger"
                  icon="el-icon-delete"
                  class="dropdown-item del-file-btn"
                  circle
                  @click.prevent="removeFile(file, index)"
                  size="mini"
                ></el-button>
              </li>
            </draggable>
          </label>

          <table style="display:none" class="table table-hover">
            <tbody>
              <tr v-for="(file, index) in files" :key="file.id">
                <td>{{index}}</td>
                <td>
                  <img v-if="file.thumb" :src="file.thumb" width="40" height="auto">
                  <img
                    v-else-if="file.imgPathM"
                    :src="'data:image/png;base64,' + file.imgPathM"
                    width="40"
                    height="auto"
                  >
                  <span v-else>No Image</span>
                </td>
                <td>
                  <div class="filename">{{file.name}}</div>
                  <div class="progress" v-if="file.active || file.progress !== '0.00'">
                    <div
                      :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}"
                      role="progressbar"
                      :style="{width: file.progress + '%'}"
                    >{{file.progress}}%</div>
                  </div>
                </td>
                <td>{{file.size}}</td>
                <td>{{file.speed}}</td>

                <td v-if="file.error">{{file.error}}</td>
                <td v-else-if="file.success">success</td>
                <td v-else-if="file.active">active</td>
                <td v-else></td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button">Action</button>
                    <div class="dropdown-menu">
                      <a
                        :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'}"
                        href="#"
                        @click.prevent="file.active || file.success || file.error === 'compressing' ? false :  onEditFileShow(file)"
                      >Edit</a>
                      <a
                        :class="{'dropdown-item': true, disabled: !file.active}"
                        href="#"
                        @click.prevent="file.active ? $refs.upload1.update(file, {error: 'cancel'}) : false"
                      >Cancel</a>
                      
                      <a
                        class="dropdown-item"
                        href="#"
                        v-if="file.active"
                        @click.prevent="$refs.upload1.update(file, {active: false})"
                      >Abort</a>
                      <a
                        class="dropdown-item"
                        href="#"
                        v-else-if="file.error && file.error !== 'compressing' && $refs.upload1.features.html5"
                        @click.prevent="$refs.upload1.update(file, {active: true, error: '', progress: '0.00'})"
                      >Retry upload</a>
                      <a
                        :class="{'dropdown-item': true, disabled: file.success || file.error === 'compressing'}"
                        href="#"
                        v-else
                        @click.prevent="file.success || file.error === 'compressing' ? false : $refs.upload1.update(file, {active: true})"
                      >Upload</a>

                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#" @click.prevent="$refs.upload1.remove(file)">Remove</a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="example-foorer">
          <!-- <div class="footer-status float-right">
          Drop: {{$refs.upload1 ? $refs.upload1.drop : false}}, Active: {{$refs.upload1 ? $refs.upload1.active : false}}, Uploaded: {{$refs.upload1 ? $refs.upload1.uploaded : true}}, Drop active: {{$refs.upload1 ? $refs.upload1.dropActive : false}}
        </div>
        <div class="footer-status float-right">
          {{files}}
          </div>-->
          <div class="btn-group">
            <v-row>
              <v-col :lg="8" :md="8" :sm="8" :xs="24">
                <!-- {{accept}} -->
                <file-upload
                  v-if="!$attrs.show && !show"
                  :input-id="inputId"
                  class="ant-btn ant-btn-primary"
                  :post-action="postAction"
                  :extensions="extensions"
                  :accept="accept"
                  :multiple="multiple"
                  :directory="directory"
                  :size="size || 0"
                  :maximum="maximum"
                  :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
                  :headers="headers"
                  :drop="drop"
                  :drop-directory="dropDirectory"
                  :add-index="addIndex"
                  :value="files"
                  @input="getFile"
                  @input-filter="inputFilter"
                  @input-file="inputFile"
                  ref="upload1"
                >
                  <i class="anticon anticon-plus"></i>
                  <span>添加图片</span>
                </file-upload>
                <!-- <v-button
                  v-if="!showUpload"
                  :disabled="$attrs.show || show"
                  type="primary"
                  style="vertical-align: middle;"
                  icon="upload"
                  :loading="uploadBtnLoading"
                  @click.prevent="startUpload"
                >上传文件</v-button>-->
                <v-button
                  v-if="!showUpload && baseSave"
                  :disabled="$attrs.show || show"
                  type="success"
                  style="vertical-align: middle;"
                  icon="save"
                  :loading="uploadBtnLoading"
                  @click.prevent="startUpload(1)"
                >保存修改</v-button>
              </v-col>
              <v-col :lg="8" :md="8" :sm="8" :xs="24" style="margin-top:8px;">
                <v-progress-line
                  v-show="isUpload"
                  v-if="!($attrs.show || show)"
                  :status="propgressLineStatus"
                  :percent="propgressLine"
                ></v-progress-line>
              </v-col>
              <v-col :lg="8" :md="8" :sm="8" :xs="24" style="text-align:right" v-if="files.length">
                <v-button
                  v-if="!lib"
                  type="primary"
                  style="vertical-align: middle;"
                  :disabled="$attrs.show || show"
                  @click.prevent="selectAllOrNull"
                >全选</v-button>
                <v-button
                  v-if="baseSave"
                  type="primary"
                  style="vertical-align: middle;"
                  :disabled="$attrs.show || show"
                  :loading="exportBtnLoading"
                  @click.prevent="exportFile(0)"
                >导出</v-button>
                <v-button
                  v-else
                  type="primary"
                  style="vertical-align: middle;"
                  :disabled="$attrs.show || show"
                  :loading="exportBtnLoading"
                  @click.prevent="exportFile(1)"
                >导出全部</v-button>

                <v-button
                  type="primary"
                  style="vertical-align: middle;"
                  :disabled="$attrs.show || show"
                  :loading="deleteBtnLoading"
                  @click.prevent="del"
                >删除</v-button>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>

      <div :class="{'modal-backdrop': true, 'fade': true, show: addData.show}"></div>
      <div
        :class="{modal: true, fade: true, show: addData.show}"
        id="modal-add-data"
        tabindex="-1"
        role="dialog"
        v-show="false"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add data</h5>
              <button type="button" class="close" @click.prevent="addData.show = false">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="onAddData">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name">Name:</label>
                  <input
                    type="text"
                    class="form-control"
                    required
                    id="name"
                    placeholder="Please enter a file name"
                    v-model="addData.name"
                  >
                  <small class="form-text text-muted">
                    Such as
                    <code>filename.txt</code>
                  </small>
                </div>
                <div class="form-group">
                  <label for="type">Type:</label>
                  <input
                    type="text"
                    class="form-control"
                    required
                    id="type"
                    placeholder="Please enter the MIME type"
                    v-model="addData.type"
                  >
                  <small class="form-text text-muted">
                    Such as
                    <code>text/plain</code>
                  </small>
                </div>
                <div class="form-group">
                  <label for="content">Content:</label>
                  <textarea
                    class="form-control"
                    required
                    id="content"
                    rows="3"
                    placeholder="Please enter the file contents"
                    v-model="addData.content"
                  ></textarea>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click.prevent="addData.show = false">Close</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div :class="{'modal-backdrop': true, 'fade': true, show: editFile.show}"></div>
      <div
        :class="{modal: true, fade: true, show: editFile.show}"
        id="modal-edit-file"
        tabindex="-1"
        role="dialog"
        v-show="false"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Edit file</h5>
              <button type="button" class="close" @click.prevent="editFile.show = false">
                <span>&times;</span>
              </button>
            </div>
            <form @submit.prevent="onEditorFile">
              <div class="modal-body">
                <div class="form-group">
                  <label for="name">Name:</label>
                  <input
                    type="text"
                    class="form-control"
                    required
                    id="name"
                    placeholder="Please enter a file name"
                    v-model="editFile.name"
                  >
                </div>
                <div
                  class="form-group"
                  v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'"
                >
                  <label>Image:</label>
                  <div class="edit-image">
                    <img :src="editFile.blob" ref="editImage">
                  </div>

                  <div class="edit-image-tool">
                    <div class="btn-group" role="group">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="editFile.cropper.rotate(-90)"
                        title="cropper.rotate(-90)"
                      >
                        <i class="fa fa-undo" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="editFile.cropper.rotate(90)"
                        title="cropper.rotate(90)"
                      >
                        <i class="fa fa-repeat" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div class="btn-group" role="group">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="editFile.cropper.crop()"
                        title="cropper.crop()"
                      >
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </button>
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="editFile.cropper.clear()"
                        title="cropper.clear()"
                      >
                        <i class="fa fa-remove" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click.prevent="editFile.show = false">Close</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <v-modal title="删除图片" :visible="delVisible" @cancel="delVisible=false">
      <div style="margin-bottom:20px">
        <span>警告：</span>
        <span style="color:red">删除该图片会将该{{!type ? '平台' : '店铺'}}对应的图片删除，但不会同步到售卖平台</span>
      </div>
      <v-button type="danger" size="small" @click="delShopImg(1)" :loading="loadingBtn">删除相同颜色下的图片</v-button>
      <v-button type="primary" size="small" @click="delShopImg(0)" :loading="loadingBtn">直接删除图片</v-button>

      <div slot="footer">&nbsp;</div>
    </v-modal>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import ImageCompressor from '@xkeshi/image-compressor'
import FileUpload from 'vue-upload-component'
import config from 'common/config'
import { debounce } from 'throttle-debounce'
import { fixNumber, getQueryString } from 'common/util'
import { Button, Popover } from 'element-ui'
import draggable from 'vuedraggable'
import apis from 'apis'
import {
  fixFrameHeight,
  fetchData,
  showToast,
  showConfirm,
  downloadFile,
  _storage,
  uploadFileToOssMulti,
  handlerCode
} from 'common/common'

Vue.use(Button)
Vue.use(Popover)

export default {
  inheritAttrs: false,
  props: [
    'oss',
    'productId',
    'variantId',
    'shopImg',
    'hasImg',
    'productType',
    'showUpload',
    'platformValue',
    'platformImage',
    'baseSave',
    'lib',
    'base',
    'ossConfig',
    'type'
  ],
  components: {
    FileUpload,
    draggable
  },
  created() {
    let vm = this
    if (this.lib) {
      this.productPltDetailId = +getQueryString('productPltDetailId')
      this.platformProductId = +getQueryString('productPlatformId')
    }
    if (this.type === 'platPrev') {
      this.productPltDetailId = +getQueryString('productPltDetailId')
    }
    this.deUpdate = debounce(300, false, function(file, val) {
      this.$emit('updateimg', { file, val })
      if (this.baseSave) {
        let { productImgId, imgShowFlag } = file
        let data = {
          productImgId,
          imgShowFlag,
          singleRemark: val,
          parentFlag: vm.$attrs.parent == 1 ? 1 : 0
        }
        this.baseImgUpdate(data).then(res => {
          if (res.data.code !== 0) {
            file.remark = null
            showToast('error', res.data.msg)
          }
        })
      }
    })
  },
  mounted() {
    let vm = this
    // 如果是母体标签一开始就请求图片数据， 变体标签点击后再请求
    // if (this.$attrs.parent == 1) {
    //   this.refreshData();
    // }
    if (!this.shopImg) {
      this.refreshData()
    }

    if (this.$attrs.show) {
      if (this.$refs.content) {
        let input = this.$refs.content.querySelectorAll('input,select,textarea')
        input.forEach(el => (el.disabled = true))
      }
    }

    // 判断是否有平台图片带过来，如果存在，则提示用户是否应用平台的图片
    if (this.platformValue) {
      let vm = this,
        { productId, productType } = this
      showConfirm({
        title: '是否应用平台图片？',
        onOk() {
          // vm.initStoreList(vm.platformImage);
          // 调用接口
          fetchData({
            ...apis.STORE_IMG_UPDATE_PLATFORM,
            data: { productId, productType }
          }).then(res => {
            console.log(res)
            if (res.data.code === 0) {
              showToast('success', '应用成功')
            }
          })
        }
      })
    }
  },
  data() {
    let originData = {
      popoverVisible: false,
      inputId: null,
      spinning: false,
      shopDelImgId: [],
      loadingBtn: false,
      delVisible: false,
      show: getQueryString('show'),
      checkedList: [],
      showDrop: true,
      uploadBtnLoading: false,
      exportBtnLoading: false,
      deleteBtnLoading: false,
      propgressLine: 0,
      propgressLineStatus: '',
      headers: {
        token: _storage._get('local', 'token')
      },
      fileBase64: [],
      files: [],
      radio: 0,
      addData: {
        show: false,
        name: '',
        type: '',
        content: ''
      },
      editFile: {
        show: false,
        name: ''
      }
    }
    originData.inputId = '_' + Math.random()
    let data = Object.assign({}, config.uploadImageConfig, originData)
    data = JSON.parse(JSON.stringify(data))
    return data
  },
  filters: {
    fixNumber(val) {
      return fixNumber(val / 1024, 2)
    }
  },
  watch: {
    'editFile.show'(newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload1.update(this.editFile.id, {
          error: this.editFile.error || ''
        })
      }
      if (newValue) {
        this.$nextTick(function() {
          if (!this.$refs.editImage) {
            return
          }
          let cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false
          })
          this.editFile = {
            ...this.editFile,
            cropper
          }
        })
      }
    },

    hasImg: {
      immediate: true,
      handler(val) {
        if (!val) {
          return
        }
        console.log(val)
        this.initStoreList(val)
      }
    },

    'addData.show'(show) {
      if (show) {
        this.addData.name = ''
        this.addData.type = ''
        this.addData.content = ''
      }
    },

    // 动态更新根组件的files属性， 以同步未编辑过的子组件图片
    files(files) {
      this.$emit('update:imgs', files)
      let isUpload = files.some(el => !el.has)
      if (isUpload) {
        this.startUpload()
      }
    },

    // 监听文件长度，如果没有文件，就把radio置为0
    'files.length'(val, oldVal) {
      if (val === 0) {
        this.radio = 0
      }
      if (!oldVal && !this.radio) {
        this.radio = 0
      }
    },

    // 监控母体页的图片，  并且，如果变体没有被编辑过，则与母体页同步
    filesImg() {}
  },
  methods: {
    baseImgUpdate(data) {
      return fetchData({ ...apis.PRODUCT_IMG_MASTER_UPDATE, data })
    },
    closeActive() {
      this.$refs.upload1.dropActive = false
    },
    handleDrop(e) {
      if (!e.dataTransfer.files[0]) {
        return
      }
      this.$emit('removemultactive')
      if (
        !/.*\.(JPEG|jpeg|JPG|jpg|png|PNG|gif|GIF)$/.test(
          e.dataTransfer.files[0].name
        )
      ) {
        showToast('error', '只能上传图片文件')
        this.$refs.upload1.dropActive = false
        return
      }
      this.$refs.upload1.dropActive = false
      
      this.$refs.upload1.addDataTransfer(e.dataTransfer)
    },
    handleDragover(e) {
      return false
    },
    // 初始化从店铺产品传入的值
    initStoreList(val) {
      this.files.splice(0)
      let vm = this
      let res = [...val]
      res.map((el, index) => {
        if (el.mainFlag) {
          vm.radio = index
        }
        // el.imgShowFlag = el.mainFlag
        // el._checked = el.mainFlag
        el.thumb = el.imgM
        el.progress = 100
        el.has = true
        el.remark = el.remark || null
        // debugger
        if (!vm.baseSave) {
          el.size = el.size
        } else {
          el.size = parseInt(el.size) * 1024
        }
      })
      // this.fileBase64 = res.map(el => el.imgPathM);
      vm.files = res
    },

    // 删除文件
    removeFile(file, index) {
      let vm = this

      if (file.has) {
        // 删除数据库图片
        if (vm.hasImg) {
          if (vm.lib) {
            // 图片库图片删除
            showConfirm({
              title: '是否删除图片？',
              content: '删除后可以在图片回收站找回',
              onOk() {
                vm.spinning = true
                fetchData({
                  ...apis.PRODUCT_IMAGE_IMG_DELETE,
                  data: {
                    platformProductImgId: file.platformProductImgId
                  }
                }).then(res => {
                  vm.spinning = false
                  if (res.data.code === 0) {
                    // vm.refreshData();
                    showToast('success', '删除成功')
                    vm.$emit('updatelib')
                  } else {
                    showToast('error', '删除失败')
                  }
                })
              }
            })
          } else {
            // 店铺产品图片删除
            vm.delVisible = true
            vm.shopDelImgId = [file.storeImgId || file.imgId]
          }
        } else {
          showConfirm({
            title: '是否删除图片？',
            content: '删除后可以在图片回收站找回',
            onOk() {
              // 基础信息图片删除
              console.log(file)
              vm.spinning = true
              fetchData({
                ...apis.PRODUCT_IMG_DELETE,
                data: {
                  parentFlag: vm.$attrs.parent ? 1 : 0,
                  productImgId: file.productImgId
                }
              }).then(res => {
                vm.spinning = false
                if (res.data.code === 0) {
                  vm.refreshData()
                  showToast('success', '删除成功')
                } else {
                  showToast('error', '删除失败')
                }
              })
            }
          })
        }
      } else {
        // 删除本地要上传的图片
        vm.files.splice(index, 1)
      }
    },

    // 店铺产品删除图片
    delShopImg(type) {
      let vm = this
      vm.loadingBtn = true

      let obj = {}
      if (this.type === 'platPrev') {
        // 平台预览图片删除
        obj = {
          ...apis.PRODUCT_IMAGE_IMG_DELETE,
          data: {
            platformProductImgIds: vm.shopDelImgId,
            deleteType: type
          }
        }
      } else {
        // 店铺产品图片删除
        obj = {
          ...apis.STORE_IMG_DELETE,
          data: {
            storeImgIds: vm.shopDelImgId,
            deleteType: type
          }
        }
      }
      fetchData(obj).then(res => {
        vm.loadingBtn = false
        if (res.data.code === 0) {
          vm.delVisible = false
          vm.refreshData()
          showToast('success', res.data.msg)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    getFile(files) {
      this.files = files
    },
    inputFilter(newFile, oldFile, prevent) {
      console.log(newFile, oldFile, prevent)
      if (newFile && !oldFile) {
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          showToast('error', '只能添加图片文件')
          return prevent()
        }

        // 限定最小字节
        if (newFile.size > this.size) {
          showToast('error', '只能添加小于1MB的图片')
          return prevent()
        }
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
        // Automatic compression
        // 自动压缩
        if (
          newFile.file &&
          newFile.type.substr(0, 6) === 'image/' &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = 'compressing'
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512
          })
          imageCompressor
            .compress(newFile.file)
            .then(file => {
              this.$refs.upload1.update(newFile, {
                error: '',
                file,
                size: file.size,
                type: file.type
              })
            })
            .catch(err => {
              this.$refs.upload1.update(newFile, {
                error: err.message || 'compress'
              })
            })
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      let vm = this
      setTimeout(() => {
        fixFrameHeight(1)
      })
      if (newFile && !oldFile) {
        // 添加文件
        // console.log(newFile, '添加上传')
        // if (!newFile.has) {
        //   this.startUpload()
        // }

        // 如果是母体添加，则添加到根组件图片集合
        this.$emit('setvariantimg', newFile)
      }

      if (newFile && oldFile) {
        // 开始上传
        if (newFile.active !== oldFile.active) {
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log('progress', newFile.progress, newFile)
        }
      }

      if (newFile && oldFile) {
        // update
        if (newFile.active && !oldFile.active) {
          // beforeSend
          // min size
          if (
            newFile.size >= 0 &&
            this.minSize > 0 &&
            newFile.size < this.minSize
          ) {
            this.$refs.upload1.update(newFile, { error: 'size' })
          }
        }
        if (newFile.progress !== oldFile.progress) {
          // progress
        }
        if (newFile.error && !oldFile.error) {
          // error
        }
        if (newFile.success && !oldFile.success) {
          // success
        }
      }
      if (!newFile && oldFile) {
        // remove
        if (oldFile.success && oldFile.response.id) {
        }
      }
    },
    handleRadioChange(index, file, val) {
      let {
        storeImgId,
        mainFlag,
        remark,
        imgId,
        productImgId,
        imgShowFlag
      } = file
      let vm = this
      let api =
        productImgId != null
          ? apis.PRODUCT_IMG_MASTER_UPDATE
          : storeImgId != null
          ? apis.STORE_IMG_UPDATE
          : apis.PRODUCT_IMAGE_UPDATE_IMAGE
      if (this.shopImg) {
        // 店铺图片改主图
        fetchData({
          ...api,
          data: {
            storeImgId,
            imgId,
            mainFlag: 1
          }
        }).then(res => {
          handlerCode(res)
        })
        return
      }

      if (productImgId != null) {
        // 基础产品库
        fetchData({
          ...api,
          data: {
            productImgId,
            imgShowFlag: 1,
            parentFlag: vm.$attrs.parent == 1 ? 1 : 0
          }
        }).then(res => {
          handlerCode(res)
        })
        return
      }

      this.files.forEach((el, i) => {
        if (this.hasImg) {
          el.manFlag = false
          if (i === index) {
            el.manFlag = true
            // vm.radio = index;
          }
          return
        }
        el.imgShowFlag = 0
        if (i === index) {
          vm.radio = el.imgShowFlag = 1
        }
      })

      if (this.hasImg) {
        this.startUpload(1)
        return
      }

      this.sendData(1, 1)
    },
    // 平台图片编辑处理
    handleRadioChangeLib(index) {
      this.radio = index
      this.sendEditPlatform([], res => {
        if (res.data.code !== 0) {
          showToast('error', '修改主图失败')
        } else {
          showToast('success', '修改主图成功')
          this.$emit('updatelib')
          this.files.forEach(el => (el.success = true))
        }
      })
    },

    alert(message) {
      alert(message)
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true }
      this.$refs.upload1.update(file, { error: 'edit' })
    },
    onEditorFile() {
      if (!this.$refs.upload1.features.html5) {
        this.alert('浏览器不支持')
        this.editFile.show = false
        return
      }
      let data = {
        name: this.editFile.name
      }
      if (this.editFile.cropper) {
        let binStr = atob(
          this.editFile.cropper
            .getCroppedCanvas()
            .toDataURL(this.editFile.type)
            .split(',')[1]
        )
        let arr = new Uint8Array(binStr.length)
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        data.file = new File([arr], data.name, { type: this.editFile.type })
        data.size = data.file.size
      }
      this.$refs.upload1.update(this.editFile.id, data)
      this.editFile.error = ''
      this.editFile.show = false
    },

    handlerEnd({ to, from, item, clone, oldIndex, newIndex }) {
      // console.log(to, from, item, clone, oldIndex, newIndex);
      // // debugger;

      // if (this.hasImg) {
      //   // 店铺图片
      // } else {
      //   // 基础信息编辑
      //   if (this.files[newIndex].imgShowFlag) {

      //   }
      //   if (this.files[oldIndex].imgShowFlag) {
      //     this.radio = oldIndex;
      //   }
      //   let oldFlag = this.files[newIndex].imgShowFlag;
      //   this.files[newIndex].imgShowFlag = this.files[oldIndex].imgShowFlag;
      //   this.files[oldIndex].imgShowFlag = oldFlag;
      // }

      this.showDrop = false
    },

    // 点击上传按钮
    async startUpload(type) {
      this.uploadBtnLoading = true
      this.spinning = true
      let vm = this
      let count = 0,
        isEdit = false

      if (this.hasImg || this.type === 'platPrev') {
        // 店铺图片上传 平台预览图片上传
        vm.sendStoreData(type)
      } else {
        // 基础信息 上传oss
        vm.sendData(type)
      }
    },

    // 全选
    selectAllOrNull() {
      let checked = this.files.filter(el => el._checked)
      if (checked.length === this.uploadedFiles.length) {
        this.files.forEach((el, index) => {
          if (el.has) {
            el._checked = false
            this.files.splice(index, 1, el)
          }
        })
      } else {
        this.files.forEach((el, index) => {
          if (el.has) {
            el._checked = true
            this.files.splice(index, 1, el)
          }
        })
      }
    },

    deleteZip(zipPath) {
      fetchData({ ...apis.IMG_DELETE_EXPORT, data: { zipPath } }).then(
        res => {}
      )
    },

    // 导出图片
    exportFile(type) {
      let vm = this
      /* type true是导出全部 */
      if (type) {
        // 店铺图片导出
        if (vm.oss && !this.type) {
          vm.exportBtnLoading = true
          fetchData({
            ...apis.STORE_IMG_EXPORT,
            data: {
              productType: vm.productType,
              productId: vm.productId
            }
          }).then(res => {
            vm.exportBtnLoading = false
            if (res.data.code !== 0) {
              showToast('error', res.data.msg)
              return
            }

            downloadFile(res.data.rows.path)
            vm.deleteZip(res.data.rows.path)
          })
          return
        }

        if (this.type && this.type === 'platPrev') {
          debugger
          // 平台图片编辑导出
          vm.exportBtnLoading = true
          fetchData({
            ...apis.PRODUCT_IMAGE_DOWNLOAD_ALL_ZIP,
            data: {
              parentDetailId: vm.productPltDetailId
            }
          }).then(res => {
            vm.exportBtnLoading = false
            if (res.data.code !== 0) {
              showToast('error', res.data.msg)
              return
            }

            downloadFile(res.data.rows.path)
            vm.deleteZip(res.data.rows.path)
          })
          return
        }
        return
      }

      if (this.type && this.type === 'platPrev') {
        // 平台图片编辑导出
        showConfirm({
          title: '提示',
          content: '是否导出全部图片的压缩包？',
          onOk() {
            fetchData({
              ...apis.PRODUCT_IMAGE_DOWNLOAD_ALL_ZIP,
              data: {
                platformProductId: vm.platformProductId,
                productId: vm.productPltDetailId
              }
            }).then(res => {
              if (res.data.code !== 0) {
                showToast('error', res.data.msg)
                return
              }

              downloadFile(res.data.rows.path)
            })
          }
        })
        return
      }
      let checkedData = this.files
        .filter(el => el._checked)
        .map(el => el.productImgId)
      if (checkedData.length === 0) {
        showToast('info', '请选择图片进行导出')
        return
        showConfirm({
          title: '提示',
          content: '是否导出全部图片？',
          onOk() {
            // 店铺图片导出
            if (vm.oss) {
              fetchData({
                ...apis.STORE_IMG_EXPORT,
                data: {
                  productType: vm.productType,
                  productId: vm.productId
                }
              }).then(res => {
                if (res.data.code !== 0) {
                  showToast('error', res.data.msg)
                  return
                }

                downloadFile(res.data.rows.path)
              })
            }

            // 基础信息导出
            if (vm.baseSave) {
              fetchData({
                ...apis.PRODUCT_IMG_EXPORT,
                data: {
                  productId: vm.productId
                }
              }).then(res => {
                if (!res.data) {
                  showToast('error', res.data.msg)
                  return
                }

                downloadFile(res.data.path)
              })
            }
          }
        })
      } else {
        showConfirm({
          title: '提示',
          content: '是否导出选中的图片？',
          onOk() {
            // 店铺图片导出
            if (vm.oss) {
              fetchData({
                ...apis.STORE_IMG_EXPORT,
                data: {
                  productType: vm.productType,
                  productId: vm.productId
                }
              }).then(res => {
                if (res.data.code !== 0) {
                  showToast('error', res.data.msg)
                  return
                }

                downloadFile(res.data.rows.path)
              })
            }

            // 基础信息导出
            if (vm.baseSave) {
              fetchData({
                ...apis.PRODUCT_IMG_EXPORT,
                data: {
                  imgIds: checkedData
                }
              }).then(res => {
                if (!res.data) {
                  showToast('error', res.data.msg)
                  return
                }

                downloadFile(res.data.path)
              })
            }
          }
        })
      }
    },

    // 删除图片
    del() {
      let vm = this

      // 基础信息的删除
      let checked = this.files
        .filter(el => el._checked)
        .map(el => el.productImgId || el.storeImgId || el.imgId)
      console.log(checked)
      if (checked.length === 0) {
        showToast('warning', '请选择图片进行删除')
        return
      }

      if (vm.baseSave) {
        showConfirm({
          content: '是否删除所选图片?',
          onOk() {
            // 基础信息
            vm.spinning = true
            fetchData({
              ...apis.PRODUCT_IMG_BATCH_REMOVE,
              data: {
                parentFlag: vm.$attrs.parent == 1 ? 1 : 0,
                productImgIds: checked
              }
            }).then(res => {
              vm.spinning = false
              if (res.data.code !== 0) {
                showToast('error', res.data.msg)
                return
              }
              vm.refreshData()
              if (!res.data.failNum) {
                showToast('success', '删除成功')
              } else {
                showToast(
                  'error',
                  `成功: ${res.data.successNum}, 失败: ${
                    res.data.failNum
                  }, 失败信息： ${res.data.errMsg.join(';')}`
                )
              }
            })
          }
        })
      } else {
        // 店铺产品图片删除
        vm.delVisible = true
        vm.shopDelImgId = checked
      }
    },

    handleDel(type, file, index) {
      this.shopDelImgId = [file.storeImgId || file.imgId]
      this.delShopImg(type)
    },

    // 从服务器获取上传的文件夹
    async getUrl() {
      return fetchData({
        ...apis.UPLOAD_REALPATH_GET,
        data: { uploadType: 'img' }
      }).then(res => {
        if (res.data.code === 0) {
          return res.data.msg
        }
      })
    },

    // 获取上传路径（店铺产品）
    async getStoreImgPath(suffix) {
      let variantId = this.variantId

      switch (this.type) {
        case 'platPrev':
          // 平台预览图片(可编辑)
          let { dir } = this.ossConfig
          return dir
          break

        default:
          if (this.lib) {
            variantId = this.files[0] && this.files[0].productVariantId
            return await fetchData({
              ...apis.PRODUCT_IMAGE_IMG_DIR,
              data: { suffix }
            }).then(res => {
              this.uploadBtnLoading = false
              if (res.data.code !== 0) {
                showToast('error', res.data.msg)
              } else {
                return res.data.rows.path
              }
            })
          } else {
            // 店铺图片上传
            let { dir } = this.ossConfig
            return dir
            // return await fetchData({
            //   ...apis.STORE_IMG_DIR,
            //   data: { variantId }
            // }).then(res => {
            //   this.uploadBtnLoading = false
            //   if (res.data.code !== 0) {
            //     showToast('error', res.data.msg)
            //   } else {
            //     return res.data.rows
            //   }
            // })
          }
          break
      }
    },

    // 处理上传图片的数据(基础信息)
    setUploadImgData() {
      // 设置请求数据
      let vm = this

      let uploadObj = {}
      uploadObj.imgList = []
      uploadObj.parentFlag = this.$attrs.parent == 1 ? 1 : 0

      vm.files.forEach((el, index) => {
        // 如果上传成功的
        if (el.success || el.has) {
          return
        }

        uploadObj.imgList.push({
          productId: vm.productId,
          imgName: el.name,
          imgPath: null,
          imgPathM: null,
          imgShowFlag: vm.radio === index ? 1 : 0,
          originalType: null,
          singleSize: el.size,
          singleRemark: el.remark
          // file: vm.fileBase64[index]
        })
      })
      return uploadObj
    },

    // 提交图片到服务器(基础信息)
    async sendData(type, toggle) {
      this.spinning = true
      let url = await this.getUrl()
      let isEdit = false
      let all = 0
      let current = 0
      // 上传oss
      for (let i = 0; i < this.files.length; i++) {
        const element = this.files[i]
        var file = element.file
        //  判断是否有已经上传了的文件
        if (element && !file) {
          isEdit = true
          continue
        }
        all += 100
      }

      let files = this.files.filter(el => el.file)

      if (files.length <= 0 && !type) {
        this.uploadBtnLoading = false
        this.spinning = false
        showToast('error', type ? '修改成功' : '没有要上传的图片文件')
        return
      }
      files = files.map(el => el.file)
      // 把文件一个个上传到oss
      const upFiles = await uploadFileToOssMulti(files, url, () => {
        // 上传成功一个文件就执行这个回调
        current += 100
        this.propgressLine = (current / all) * 100
      })
      console.log(upFiles)

      // 上传成功
      // 请求本地服务器保存图片
      if (upFiles.length >= 0) {
        let data = {}
        let i = 0
        data.productId = this.productId
        data.parentFlag = this.$attrs.parent == 1 ? 1 : 0
        data.imgList = []
        this.files.forEach((el, index) => {
          let flag = this.radio === index ? 1 : 0
          if (!el.file) {
            data.imgList.push({
              imgShowFlag: el.imgShowFlag != null ? el.imgShowFlag : flag || 0,
              ...el
            })
          } else {
            data.imgList.push({
              imgName: el.name,
              imgPath: upFiles[i],
              imgShowFlag: el.imgShowFlag != null ? el.imgShowFlag : flag || 0,
              singleSize: el.size,
              singleRemark: el.remark
            })
            i++
          }
        })

        console.log('上传图片的参数： ', data)

        fetchData({ ...apis.PRODUCT_IMG_UPLOAD, data }).then(res => {
          this.uploadBtnLoading = false
          this.spinning = false
          handlerCode(res, () => {
            if (toggle) {
              if (res.data.code === 0) {
                showToast('success', '修改主图成功')
                this.refreshData()
                this.files.forEach(el => (el.success = true))
              } else {
                showToast('error', res.data.msg)
              }
              return
            }
            this.refreshData()
            this.files.forEach(el => (el.success = true))
          })
        })
      }
    },

    // 提交图片到服务器(店铺图片 平台图片)
    async sendStoreData(type) {
      let vm = this
      let url = await this.getStoreImgPath()
      url = url.substr(0, url.length - 1)
      let isEdit = false
      let all = 0
      let current = 0
      // 上传oss
      for (let i = 0; i < this.files.length; i++) {
        const element = this.files[i]
        var file = element.file
        //  判断是否有已经上传了的文件
        if (element && !file) {
          isEdit = true
          continue
        }
        all += 100
      }

      let files = this.files.filter(el => el.file)

      if (files.length <= 0 && !type) {
        this.uploadBtnLoading = false
        this.spinning = false
        showToast('error', type ? '修改成功' : '没有要上传的图片文件')
        return
      }
      files = files.map(el => el.file)
      // 把文件一个个上传到oss
      const upFiles = await uploadFileToOssMulti(files, url, () => {
        // 上传成功一个文件就执行这个回调
        current += 100
        this.propgressLine = (current / all) * 100
      })
      console.log(upFiles)
      let platUpFiles = JSON.parse(JSON.stringify(upFiles))

      // 上传成功
      // 请求本地服务器保存图片
      if (upFiles.length >= 0) {
        let data = {}
        let list = []
        data.data = []
        let rowData = data.data
        let i = 0

        vm.files.forEach((el, index) => {
          // if (vm.type && vm.type === 'platPrev') {
          // if (vm.ossConfig) {
          //   let { dir } = vm.ossConfig
          // }

          if (!el.file) {
            return false
          }
          list.push({
            name: el.name,
            mainFlag: vm.radio === index ? 1 : 0,
            size: el.size,
            remark: el.remark,
            objectName: upFiles.shift()
          })
          return false
          // }
          // if (!el.file) {
          //   // rowData.push({
          //   //   ...el,
          //   //   mainFlag: vm.radio === index ? 1 : 0
          //   // })
          // } else {
          //   rowData.push({
          //     name: el.name,
          //     variantId: vm.variantId,
          //     objectName: upFiles.shift(),
          //     mainFlag: vm.radio === index ? 1 : 0,
          //     size: el.size,
          //     remark: el.remark
          //   })
          //   i++
          // }
        })

        console.log('上传图片的参数： ', this.files)

        if (this.type && this.ossConfig) {
          // 平台预览上传图片

          let {
            baseVariantId,
            parentDetailId,
            storeId,
            variantId
          } = this.ossConfig

          fetchData({
            ...apis.PRODUCT_IMAGE_UPLOAD_IMAGE,
            data: {
              baseVariantId,
              parentDetailId,
              storeId,
              imgs: list
            }
          }).then(res => {
            this.spinning = false
            this.uploadBtnLoading = false

            handlerCode(
              res,
              () => {
                this.refreshData()
                this.files.forEach(el => (el.success = true))
              },
              () => {
                this.refreshData()
                this.propgressLineStatus = 'exception'
              }
            )
          })
        } else if (!this.lib) {
          let {
            baseVariantId,
            parentDetailId,
            storeId,
            variantId
          } = this.ossConfig
          // 店铺上传图片
          fetchData({
            ...apis.STORE_IMG_UPLOAD_BATCH,
            data: {
              variantId,
              imgs: list
            }
          }).then(res => {
            this.spinning = false
            this.uploadBtnLoading = false

            handlerCode(
              res,
              () => {
                this.refreshData()
                this.files.forEach(el => (el.success = true))
              },
              () => {
                this.refreshData()
                this.propgressLineStatus = 'exception'
              }
            )
          })
        } else {
          // 平台图片编辑
          this.sendEditPlatform(platUpFiles)
        }
      }
    },

    // 平台图片编辑 上传
    sendEditPlatform(upFiles, cb) {
      let data = this.getUploadPlatformData(upFiles)
      fetchData({
        ...apis.PRODUCT_IMAGE_UPDATE,
        data
      }).then(res => {
        this.uploadBtnLoading = false
        this.spinning = false
        if (cb) {
          cb(res)
          return
        }
        handlerCode(res, () => {
          // this.refreshData();
          this.$emit('updatelib')
          this.files.forEach(el => (el.success = true))
        })
      })
    },

    // 平台图片编辑的数据整理
    getUploadPlatformData(upFiles) {
      let vm = this
      let _has = this.files.find(el => el.has)
      const {
        productVariantId,
        folderId: imgFolderId,
        storeId,
        batchId,
        parentDetailId
      } = _has
      const data = {
        data: [],
        productVariantId,
        imgFolderId,
        storeId,
        batchId,
        parentDetailId
      }

      this.files.forEach((el, index) => {
        if (el.has) {
          data.data.push({
            ...el,
            size: parseFloat(el.size),
            objectName: el.img,
            mainFlag: vm.radio === index ? 1 : 0
          })
        } else {
          data.data.push({
            objectName: upFiles.shift(),
            remark: el.remark,
            mainFlag: vm.radio === index ? 1 : 0,
            size: parseFloat(el.size),
            fileName: el.name
          })
        }
      })

      return data
    },

    // 刷新图片数据
    refreshData() {
      let vm = this
      if (!this.baseSave) {
        //店铺图片编辑
        this.$emit('refresh')
        this.propgressLineStatus = ''
        this.propgressLine = 0
      } else {
        // 基础图片编辑
        fetchData({
          ...apis.PRODUCT_IMG_PARENT_BASE_TAB,
          data: { productId: this.productId }
        }).then(res => {
          console.log(res)
          if (
            res.data &&
            res.data.productImgEntityList &&
            res.data.productImgEntityList.length >= 0
          ) {
            vm.radio = null
            res.data.productImgEntityList.forEach((el, index) => {
              if (el.imgShowFlag) {
                vm.radio = index
              }
            })
            this.files = res.data.productImgEntityList
            this.files.map((el, index) => {
              el.progress = 100
              el.has = true
              el.name = el.imgName
              el.size = el.singleSize
              el.remark = el.singleRemark
              el.thumb = el.imgPath
              el.sort = index
              el._checked = false
            })
          }
        })
      }
    }
  },
  computed: {
    isUpload() {
      return this.files.some(el => el.has == null)
    },
    uploadedFiles() {
      return this.files.filter(el => el.has)
    },

    // 如果是变体页， 获取母体的展示图片
    filesImg() {
      if (!this.$attrs.parent) {
        return this.$attrs.variantFiles
      }
    },
    dragOptions() {
      return {
        animation: 150
        // group: "description",
        // disabled: !this.editable,
        // ghostClass: "ghost"
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import '~assets/style/variables.less';

.upload_wrapper {
  position: relative;

  .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: absolute;
    z-index: 9999;
    opacity: 0.3;
    text-align: center;
    background: #404040;
  }
  .upload {
    .table-responsive {
      position: relative;
      // background: #f2f2f4;
      overflow: hidden;
      height: auto;
      border: 1px dashed #ddd;
      width: 100%;
      min-height: 300px;
      .file-ul {
        overflow: hidden;
        height: 100%;
        cursor: pointer;
        min-height: 300px;
      }
      .upload-allfiles {
        overflow: hidden;
        height: 100%;
        cursor: pointer;
        min-height: 300px;
        padding: 0;
        li {
          position: relative;
          width: 150px;
          float: left;
          background: #ececec;
          margin: 10px;
          padding: 10px;
          .ant-checkbox-wrapper {
            position: absolute;
            padding-left: 4px;
          }
          & > div.imgBox {
            display: block;
            margin: 0 auto;
            width: 130px;
            height: 130px;
            overflow: hidden;
            img {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }

          .bot {
            div {
              margin-top: 6px;
            }
            .ant-radio-wrapper {
              float: right;
            }
            .first {
              overflow: hidden;
              .title {
                width: 70px;
                font-size: 15px;
                font-weight: bold;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: block;
                float: left;
              }
            }
          }
          .dropdown-item {
            position: absolute;
            padding: 0;
            top: -10px;
            right: -10px;
            height: 20px;
            width: 20px;
            line-height: 1;
            font-weight: bold;
          }
        }
      }
      .file-area {
        bottom: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        cursor: pointer;
        .up_text_wrapper {
          display: block;
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100px;
          margin-left: -50px;
          margin-top: -40px;
          color: #999;
          i {
            text-align: center;
            font-size: 48px;
            display: block;
          }
          & > span.text {
            margin-top: 10px;
            text-align: center;
          }
        }
      }
    }
    .example-foorer {
      .add-files-btn {
        color: #fff;
        background: @title-color;
        padding: 10px;
      }
      .file-uploads {
        vertical-align: middle;
        line-height: 30px;
        i,
        span {
          vertical-align: baseline;
        }
      }
    }
  }
}
.upload_wrapper .btn-group:hover > .dropdown-menu {
  visibility: visible;
}
.upload_wrapper label.dropdown-item {
  margin-bottom: 0;
}
.upload_wrapper .btn-group .dropdown-toggle {
  margin-right: 0.6rem;
}
.upload_wrapper .filename {
  margin-bottom: 0.3rem;
}
.upload_wrapper .btn-is-option {
  margin-top: 0.25rem;
}
.upload_wrapper .example-foorer {
  padding: 0.5rem 0;
}
.upload_wrapper .edit-image img {
  max-width: 100%;
}
.upload_wrapper .edit-image-tool {
  margin-top: 0.6rem;
}
.upload_wrapper .edit-image-tool .btn-group {
  margin-right: 0.6rem;
}
.upload_wrapper .footer-status {
  padding-top: 0.4rem;
}
.upload_wrapper .drop-active h3 {
  margin: -0.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  /* color: #fff; */
  padding: 0;
}
._checked {
  background: #f00;
}
</style>
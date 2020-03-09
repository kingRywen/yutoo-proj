<template>
  <div class="upload_wrapper" ref="content" @drop.stop.prevent="handleDrop" @dragover.stop.prevent="handleDragover">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>放下鼠标确认</h3>
    </div>
    <div class="upload">
      <div class="table-responsive">
        <div class="text-center p-5">
          <label :for="name" class="file-area" v-if="!files.length">
            <span class="up_text_wrapper">
              <v-icon type="cloud-upload-o"></v-icon>
              <span class="text">点击添加文件，或将文件拖到此</span>
            </span>
          </label>
        </div>
        <ul class="upload-allfiles">
          <li v-for="(file, index) in files" :key="file.id">
            <img :src="'/static/zip.png'" width="150" height="auto" />
            <div class="bot">
              <div class="first">
                <span class="title" :title="file.name">{{file.name}}</span>
                <!-- <v-radio v-model="radio" :label="index">主图</v-radio> -->
              </div>
              <div class="second" v-if="file.size">
                {{file.size | fixNumber}}KB
              </div>
              <v-progress-line v-if="file.active || file.progress !== '0.00'" :percent="+file.progress" :status="file.active ? 'active': (file.error ? 'exception' : 'success')" :stroke-width="5"></v-progress-line>
              <div>
                <v-input placeholder="请输入文件备注" v-model="file.remark" autosize></v-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="example-foorer">
        <div class="btn-group" v-if="!$attrs.show">
          <v-row :gutter="10">
            <v-col span="8">
              <v-button style="vertical-align: middle;" icon="download" :loading="$refs.upload && $refs.upload.active" @click.prevent="downloadZIP">下载ZIP文件</v-button>
              <file-upload class="ant-btn ant-btn-primary" :multiple="false" :post-action="postAction" :extensions="extensions" :accept="accept" :directory="directory" :size="size || 0" :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)" :headers="headers" :drop="drop" :drop-directory="dropDirectory" :add-index="addIndex" :value="files" @input="getFile" @input-filter="inputFilter" @input-file="inputFile" ref="upload" style="height:33px;line-height: 33px;">
                <i class="anticon anticon-plus"></i>
                <span>添加文件</span>
              </file-upload>
              <v-button type="primary" style="vertical-align: middle;" icon="upload" :loading="uploadLoading" @click.prevent="startUpload">上传文件</v-button>
            </v-col>
            <v-col span="12" style="margin-top:8px">
              <v-progress-line :status="propgressLineStatus" :percent="propgressLine"></v-progress-line>
            </v-col>
            <v-col span="4" style="text-align:right" v-if="!noEditPhotoBtn">
              <v-button type="primary" style="vertical-align: middle;" @click.prevent="linkToEditPhoto">图片编辑</v-button>
            </v-col>
          </v-row>
        </div>
      </div>
    </div>

    <div :class="{'modal-backdrop': true, 'fade': true, show: addData.show}"></div>
    <div :class="{modal: true, fade: true, show: addData.show}" id="modal-add-data" tabindex="-1" role="dialog" v-show="false">
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
                <input type="text" class="form-control" required id="name" placeholder="Please enter a file name" v-model="addData.name">
                <small class="form-text text-muted">Such as
                  <code>filename.txt</code>
                </small>
              </div>
              <div class="form-group">
                <label for="type">Type:</label>
                <input type="text" class="form-control" required id="type" placeholder="Please enter the MIME type" v-model="addData.type">
                <small class="form-text text-muted">Such as
                  <code>text/plain</code>
                </small>
              </div>
              <div class="form-group">
                <label for="content">Content:</label>
                <textarea class="form-control" required id="content" rows="3" placeholder="Please enter the file contents" v-model="addData.content"></textarea>
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
    <div :class="{modal: true, fade: true, show: editFile.show}" id="modal-edit-file" tabindex="-1" role="dialog" v-show="false">
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
                <input type="text" class="form-control" required id="name" placeholder="Please enter a file name" v-model="editFile.name">
              </div>
                <div class="form-group" v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'">
                  <label>Image: </label>
                  <div class="edit-image">
                    <img :src="editFile.blob" ref="editImage" />
                </div>

                    <div class="edit-image-tool">
                      <div class="btn-group" role="group">
                        <button type="button" class="btn btn-primary" @click="editFile.cropper.rotate(-90)" title="cropper.rotate(-90)">
                          <i class="fa fa-undo" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="btn btn-primary" @click="editFile.cropper.rotate(90)" title="cropper.rotate(90)">
                          <i class="fa fa-repeat" aria-hidden="true"></i>
                        </button>
                      </div>
                      <div class="btn-group" role="group">
                        <button type="button" class="btn btn-primary" @click="editFile.cropper.crop()" title="cropper.crop()">
                          <i class="fa fa-check" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="btn btn-primary" @click="editFile.cropper.clear()" title="cropper.clear()">
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
</template>
<style lang="less" scoped>
@import "~assets/style/variables.less";

.upload_wrapper {
  position: relative;
  .drop-active {
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    position: fixed;
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
      min-height: 400px;
      .upload-allfiles {
        padding: 20px;
        li {
          position: relative;
          width: 150px;
          float: left;
          background: #ececec;
          margin: 10px;
          padding: 10px;
          img {
            display: block;
            margin: 0 auto;
            width: 130px;
            height: 130px;
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
                width: 100%;
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
            top: 0;
            right: 0;
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
            text-align: center;
          }
        }
      }
    }
    .table-hover {
      .text-center {
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
        i,
        span {
          vertical-align: middle;
          line-height: 33px;
        }
      }
    }
  }
}

// .upload_wrapper .btn-group .dropdown-menu {
//   display: block;
//   visibility: hidden;
//   transition: all 0.2s;
// }
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
</style>

<script>
// import Cropper from "cropperjs";
import Vue from "vue";
import ImageCompressor from "@xkeshi/image-compressor";
import FileUpload from "vue-upload-component";
import config from "common/config";
import { fixNumber, getQueryString } from "common/util";
import { toParamUrl, downloadFile, _storage, showToast } from "common/common";
// import bus from 'common/bus';
import apis from "apis";
import {
  fixFrameHeight,
  fetchData,
  showModal,
  uploadFileToOss
} from "common/common";
export default {
  inheritAttrs: false,
  props: ["zip", "noEditPhotoBtn"],
  components: {
    FileUpload
  },
  created() {
    this.isVariant = getQueryString("variant") == "true";
    // if (this.zip) {
    //   this.$emit("getzip");
    // }
  },
  mounted() {
    // 如果是母体标签一开始就请求图片数据， 变体标签点击后再请求
    if (this.$attrs.parent == 1) {
      this.refreshData();
    }

    if (this.$attrs.show) {
      let input = this.$refs.content.querySelectorAll("input,select,textarea");
      input.forEach(el => (el.disabled = true));
    }
  },
  data() {
    let originData = {
      singleFile: null,
      propgressLine: 0,
      propgressLineStatus: "",
      uploadLoading: false,
      headers: {
        token: _storage._get("local", "token")
      },
      fileBase64: [],
      files: [],
      radio: 0,
      addData: {
        show: false,
        name: "",
        type: "",
        content: ""
      },
      editFile: {
        show: false,
        name: ""
      },
      accept: "application/x-zip-compressed",
      extensions: "zip"
    };
    let data = Object.assign({}, config.uploadImageConfig, originData);
    return data;
  },
  filters: {
    fixNumber(val) {
      return fixNumber(val / 1024, 2);
    }
  },
  watch: {
    "editFile.show"(newValue, oldValue) {
      // 关闭了 自动删除 error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, {
          error: this.editFile.error || ""
        });
      }
      if (newValue) {
        this.$nextTick(function() {
          if (!this.$refs.editImage) {
            return;
          }
          let cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false
          });
          this.editFile = {
            ...this.editFile,
            cropper
          };
        });
      }
    },

    zip(val) {
      this.files.splice(0);
      this.files.push({
        fileObject: true,
        size: val.zipSize,
        name: val.name,
        type: "application/x-zip-compressed",
        active: false,
        error: "",
        success: false,
        progress: "0.00",
        thumb: val.zipPath,
        remark: val.remark
      });
    },

    "addData.show"(show) {
      if (show) {
        this.addData.name = "";
        this.addData.type = "";
        this.addData.content = "";
      }
    },

    // 动态更新根组件的files属性， 以同步未编辑过的子组件图片
    files(files) {
      this.$emit("update:imgs", files);
    },

    // 监控母体页的图片，  并且，如果变体没有被编辑过，则与母体页同步
    filesImg() {}
  },
  methods: {
    get() {
      console.log(this.$refs.upload);
      this.$refs.upload.dropActive = true;
    },
    handleDrop(e) {
      console.log(e);
      this.$refs.upload.dropActive = false;
      this.$refs.upload.clear();
      this.$refs.upload.addDataTransfer(e.dataTransfer);
    },
    handleDragover(e) {
      // console.log("移动", e.dataTransfer.effectAllowed);
      // if (e.dataTransfer.effectAllowed === "all") {
      //   this.showDrop = true;
      // } else {
      //   this.showDrop = false;
      // }
    },
    linkToEditPhoto() {
      toParamUrl("/product/imageLibrary.html", {
        productPltDetailId: +getQueryString("productPltDetailId"),
        productId: +getQueryString("productId"),
        productPlatformId: +getQueryString("productPlatformId")
      });
    },

    getFile(files) {
      this.files = files;
    },
    inputFilter(newFile, oldFile, prevent) {
      console.log(newFile, oldFile, prevent);
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent();
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent();
        }
        // Automatic compression
        // 自动压缩
        if (
          newFile.file &&
          newFile.type.substr(0, 6) === "image/" &&
          this.autoCompress > 0 &&
          this.autoCompress < newFile.size
        ) {
          newFile.error = "compressing";
          const imageCompressor = new ImageCompressor(null, {
            convertSize: Infinity,
            maxWidth: 512,
            maxHeight: 512
          });
          imageCompressor
            .compress(newFile.file)
            .then(file => {
              this.$refs.upload.update(newFile, {
                error: "",
                file,
                size: file.size,
                type: file.type
              });
            })
            .catch(err => {
              this.$refs.upload.update(newFile, {
                error: err.message || "compress"
              });
            });
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        // 创建 blob 字段
        newFile.blob = "";
        let URL = window.URL || window.webkitURL;
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file);
        }
        // Thumbnails
        // 缩略图
        newFile.thumb = "";
        if (newFile.blob && newFile.type.substr(0, 6) === "image/") {
          newFile.thumb = newFile.blob;
        }
      }
    },
    // add, update, remove File Event
    inputFile(newFile, oldFile) {
      let vm = this;
      setTimeout(() => {
        fixFrameHeight(1);
      });
      if (newFile && !oldFile) {
        // 添加文件
        console.log(newFile);
        this.propgressLine = 0;
        this.propgressLineStatus = "normal";
        this.singleFile = newFile;

        // 如果是母体添加，则添加到根组件图片集合
        this.$emit("setvariantimg", newFile);
      }

      if (newFile && oldFile) {
        // 开始上传
        if (newFile.active !== oldFile.active) {
        }

        // 上传进度
        if (newFile.progress !== oldFile.progress) {
          console.log("progress", newFile.progress, newFile);
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
            this.$refs.upload.update(newFile, { error: "size" });
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
    alert(message) {
      alert(message);
    },
    onEditFileShow(file) {
      this.editFile = { ...file, show: true };
      this.$refs.upload.update(file, { error: "edit" });
    },
    onEditorFile() {
      if (!this.$refs.upload.features.html5) {
        this.alert("浏览器不支持");
        this.editFile.show = false;
        return;
      }
      let data = {
        name: this.editFile.name
      };
      if (this.editFile.cropper) {
        let binStr = atob(
          this.editFile.cropper
            .getCroppedCanvas()
            .toDataURL(this.editFile.type)
            .split(",")[1]
        );
        let arr = new Uint8Array(binStr.length);
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i);
        }
        data.file = new File([arr], data.name, { type: this.editFile.type });
        data.size = data.file.size;
      }
      this.$refs.upload.update(this.editFile.id, data);
      this.editFile.error = "";
      this.editFile.show = false;
    },

    // 下载ZIP文件
    downloadZIP() {
      fetchData({
        ...apis.PRODUCT_IMAGE_DOWNLOAD,
        data: {
          productPlatformId: this.isVariant
            ? +getQueryString("productPltDetailId")
            : +getQueryString("productPlatformId"),
          detailVariantId: this.isVariant
            ? +getQueryString("productPltDetailId")
            : +getQueryString("productPlatformId"),
          productType: this.isVariant ? 1 : 0
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          console.log(res.data.path, "---------------------------------");
          // downloadFile(res.data.path)
          window.location.href = res.data.path;
        } else {
          showModal("error", "没有找到图片ZIP文件");
        }
      });
    },

    // 获取店铺产品zip的路径
    async getStoreZipDir() {
      return fetchData({ ...apis.PRODUCT_IMAGE_DIR, data: {} }).then(res => {
        if (res.data.code === 0) {
          return res.data.rows.dir;
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    // 提交图片到oss服务器
    async startUpload() {
      if (!this.singleFile) {
        showToast("warning", "请先选择需要上传的图片ZIP文件");
        return;
      }
      this.$emit("update:loading", true);
      this.uploadLoading = true;
      // 设置请求数据
      let vm = this;
      let id = +getQueryString("productId");
      let productPlatformId = +getQueryString("productPlatformId");
      let productPltDetailId = +getQueryString("productPltDetailId");
      let dir = await this.getStoreZipDir();
      uploadFileToOss(this.singleFile.file, dir, key => {
        // 如果上传成功，设置状态为成功
        fetchData({
          method: "post",
          url: "/product/image/upload",
          data: {
            remark: "remark",
            productId: id,
            productPlatformId,
            objectName: key,
            parentDetailId: productPltDetailId
          }
        }).then(res => {
          this.$emit("update:loading", false);
          this.uploadLoading = false;
          if (res.data.code === 0) {
            showToast("success", "上传成功");
            this.$emit("successfile", res.data.rows);
            this.$emit("getzip");
          } else {
            showToast("error", res.data.msg);
          }
        });
      });
    },

    // 刷新图片数据
    refreshData() {
      console.log("刷新");
      fetchData({
        ...apis.PRODUCT_IMG_PARENT_BASE_TAB,
        productId: this.productId
      }).then(res => {
        console.log(res);
      });
    }
  },
  computed: {
    // 如果是变体页， 获取母体的展示图片
    filesImg() {
      if (!this.$attrs.parent) {
        return this.$attrs.variantFiles;
      }
    },

    // 获取productId
    productId() {
      return this.$attrs.productId;
    }
  }
};
</script>
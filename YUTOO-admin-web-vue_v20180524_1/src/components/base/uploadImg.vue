<template>
  <div class="upload_wrapper" ref="content">
    <!-- {{files}} -->
    <div class="upload">
      <div class="table-responsive">
        <div class="text-center p-5">
          <label :for="name" class="file-area" v-if="!files.length">
            <span class="up_text_wrapper">
              <v-icon type="cloud-upload-o"></v-icon>
              <span class="text">点击添加图片，或将文件拖到此</span>
            </span>
          </label>
        </div>
        <ul class="upload-allfiles">
          <li v-for="(file, index) in files" :key="file.id">
            <img :src="file.thumb || '/static/no-image.jpg'" width="150" height="auto" />
            <!-- <img v-else-if='file.imgPathM' :src="'data:image/png;base64,' + file.imgPathM" width="40" height="auto" />
                <span v-else>No Image</span> -->
            <div class="bot">
              <div class="first">
                <span class="title">{{file.name}}</span>
                <v-radio v-model="radio" :label="index">主图</v-radio>
              </div>
              <div class="second">
                {{file.size | fixNumber}}KB
              </div>
              <v-progress-line v-if="file.active || file.progress !== '0.00'" :percent="+file.progress" :status="file.active ? 'active': (file.error ? 'exception' : 'success')" :stroke-width="5"></v-progress-line>
              <div>
                <v-input placeholder="请输入图片备注" v-model="file.remark" autosize></v-input>
              </div>
            </div>
            <v-button type="error" class="dropdown-item del-file-btn" size="small" shape="circle" icon="minus" @click.prevent="removeFile(file)"></v-button>
          </li>
        </ul>

        <table style="display:none" class="table table-hover">
          <tbody>

            <tr v-for="(file, index) in files" :key="file.id">
              <td>{{index}}</td>
              <td>
                <img v-if="file.thumb" :src="file.thumb" width="40" height="auto" />
                <img v-else-if='file.imgPathM' :src="'data:image/png;base64,' + file.imgPathM" width="40" height="auto" />
                <span v-else>No Image</span>

              </td>
              <td>
                <div class="filename">
                  {{file.name}}
                </div>
                <div class="progress" v-if="file.active || file.progress !== '0.00'">
                  <div :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}" role="progressbar" :style="{width: file.progress + '%'}">{{file.progress}}%</div>
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
                  <button class="btn btn-secondary btn-sm dropdown-toggle" type="button">
                    Action
                  </button>
                  <div class="dropdown-menu">
                    <a :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing'}" href="#" @click.prevent="file.active || file.success || file.error === 'compressing' ? false :  onEditFileShow(file)">Edit</a>
                    <a :class="{'dropdown-item': true, disabled: !file.active}" href="#" @click.prevent="file.active ? $refs.upload.update(file, {error: 'cancel'}) : false">Cancel</a>

                    <a class="dropdown-item" href="#" v-if="file.active" @click.prevent="$refs.upload.update(file, {active: false})">Abort</a>
                    <a class="dropdown-item" href="#" v-else-if="file.error && file.error !== 'compressing' && $refs.upload.features.html5" @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">Retry upload</a>
                    <a :class="{'dropdown-item': true, disabled: file.success || file.error === 'compressing'}" href="#" v-else @click.prevent="file.success || file.error === 'compressing' ? false : $refs.upload.update(file, {active: true})">Upload</a>

                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" @click.prevent="$refs.upload.remove(file)">Remove</a>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="example-foorer">
        <!-- <div class="footer-status float-right">
          Drop: {{$refs.upload ? $refs.upload.drop : false}}, Active: {{$refs.upload ? $refs.upload.active : false}}, Uploaded: {{$refs.upload ? $refs.upload.uploaded : true}}, Drop active: {{$refs.upload ? $refs.upload.dropActive : false}}
        </div>
        <div class="footer-status float-right">
          {{files}}
        </div> -->
        <div class="btn-group" v-if="!$attrs.show">
          <v-row>
            <v-col span="8">
              <file-upload class="ant-btn ant-btn-primary" :post-action="postAction" :extensions="extensions" :accept="accept" :multiple="multiple" :directory="directory" :size="size || 0" :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)" :headers="headers" :drop="drop" :drop-directory="dropDirectory" :add-index="addIndex" :value="files" @input="getFile" @input-filter="inputFilter" @input-file="inputFile" ref="upload">
                <i class="anticon anticon-plus"></i>
                <span>添加图片</span>
              </file-upload>
              <v-button type="success" style="vertical-align: middle;" icon="upload" :loading="$refs.upload && $refs.upload.active" @click.prevent="startUpload">上传文件</v-button>
            </v-col>
            <v-col span="16" style="margin-top:8px;">
              <v-progress-line :status="propgressLineStatus" :percent="propgressLine"></v-progress-line>
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

<script>
import Vue from "vue";
import ImageCompressor from "@xkeshi/image-compressor";
import FileUpload from "vue-upload-component";
import config from "common/config";
import { fixNumber } from "common/util";
import apis from "apis";
import { fixFrameHeight, fetchData, showToast } from "common/common";
export default {
  inheritAttrs: false,
  props: ["oss", "productId"],
  components: {
    FileUpload
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
      propgressLine: 0,
      propgressLineStatus: "",
      headers: {
        token: localStorage.getItem("token")
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
      }
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
    // 删除文件
    removeFile(file) {
      let vm = this;
      console.log(file);
      fetchData({
        ...apis.PRODUCT_IMG_DELETE,
        data: {
          parentFlag: vm.$attrs.parent ? 1 : 0,
          productImgId: file.productImgId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.refreshData();
          showToast("success", "删除成功");
        } else {
          showToast("error", "删除失败");
        }
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

        // 如果是母体添加，则添加到根组件图片集合
        this.$emit("setvariantimg", newFile);

        // this.$emit();
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

    // 点击上传按钮
    startUpload() {
      console.log("上传");
      let vm = this;
      // 把图片转化为base64
      let count = 0,
        isEdit = false;
      for (let i = 0; i < this.files.length; i++) {
        const element = this.files[i];
        var file = element.file;
        if (element && !file) {
          isEdit = true;
          continue;
        }
        var reader = new FileReader();
        reader.readAsDataURL(file); // 读出 base64
        reader.onloadend = function() {
          count++;
          // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
          vm.fileBase64[i] = reader.result;

          if (isEdit) {
            vm.sendData();
          }

          if (count == vm.files.length) {
            // 请求数据
            vm.sendData();
          }
        };
      }
    },

    // 提交图片到服务器
    sendData() {
      // 设置请求数据
      let vm = this;
      let uploadObj = {};
      uploadObj.imgList = [];
      uploadObj.parentFlag = this.$attrs.parent == 1 ? 1 : 0;

      vm.files.forEach((el, index) => {
        // 如果上传成功的
        if (el.success || el.has) {
          return;
        }

        uploadObj.imgList.push({
          productId: vm.productId,
          imgName: el.name,
          imgPath: null,
          imgPathM: null,
          imgShowFlag: vm.radio === index ? 1 : 0,
          originalType: null,
          singleSize: el.size,
          singleRemark: el.remark,
          file: vm.fileBase64[index]
        });
      });

      console.log(uploadObj, "上传图片的参数---------------------------------");

      // 发送请求， progressEvent 请求进度
      fetchData(
        {
          ...apis.PRODUCT_IMG_UPLOAD,
          data: uploadObj,
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token")
          }
        },
        progressEvent => {
          if (progressEvent.lengthComputable) {
            console.log(progressEvent);
            let loaded = progressEvent.loaded;
            let total = progressEvent.total;
            this.$nextTick(() => {
              this.propgressLine = Math.round(loaded / total * 100);
            });
          }
        }
      ).then(res => {
        console.log(res);

        // 如果上传成功，设置状态为成功
        if (res.data.code === 0) {
          this.refreshData();
          this.files.forEach(el => (el.success = true));
        }

        if (res.data.code === 500) {
          setTimeout(() => {
            this.propgressLineStatus = "exception";
          });
        }
      });
    },

    // 刷新图片数据
    refreshData() {
      console.log("刷新");
      fetchData({
        ...apis.PRODUCT_IMG_PARENT_BASE_TAB,
        data: { productId: this.productId }
      }).then(res => {
        console.log(res);
        if (
          res.data &&
          res.data.productImgEntityList &&
          res.data.productImgEntityList.length >= 0
        ) {
          this.files = res.data.productImgEntityList;
          this.files.map(el => {
            el.progress = 100;
            el.has = true;
            el.name = el.imgName;
            el.size = el.singleSize;
            el.remark = el.singleRemark;
            el.thumb = // 图片base64加前缀
              "data:image/" +
              el.imgName.substring(el.imgName.lastIndexOf(".") + 1) +
              ";base64," +
              el.imgPathM;
          });
          this.fileBase64 = res.data.productImgEntityList.map(
            el => el.imgPathM
          );
        }
      });
    }
  },
  computed: {
    // 如果是变体页， 获取母体的展示图片
    filesImg() {
      if (!this.$attrs.parent) {
        return this.$attrs.variantFiles;
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "~assets/style/variables.less";

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
          vertical-align: -webkit-baseline-middle;
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
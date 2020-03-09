<template>
  <div class="upload_wrapper" ref="content">
    <!-- {{files}} -->
    <div class="upload">
      <div class="table-responsive">
        <div class="text-center p-5">
          <label :for="name" class="file-area" v-if="!$attrs.show && !files.length">
            <span class="up_text_wrapper">
              <i class="el-icon-upload"></i>
              <span class="text">点击添加图片，或将文件拖到此</span>
            </span>
          </label>
        </div>
        <ul class="upload-allfiles">
          <li v-for="(file, index) in files" :key="file.id">
            <img :src="file.thumb || '/static/no-image.jpg'" width="150" height="auto" />
            <div class="bot">
              <div class="first">
                <span class="title">{{file.name}}</span>
                <el-radio v-model="radio" :label="index">主图</el-radio>

              </div>
              <div class="second">
                {{file.size | fixNumber}}KB
              </div>
              <!-- <el-progress v-if="file.active || file.progress" :percentage="+file.progress" :status="file.active ? 'active': (file.error ? 'exception' : file.progress != 0 ?'success' : null)" :stroke-width="5"></el-progress> -->
              <div>
                <!-- remark定义备注名字 -->
                <el-input placeholder="请输入图片备注" v-model="file.remark" @input="val => file.singleRemark = val" autosize></el-input>
              </div>
            </div>
            <!-- <el-button type="error" class="dropdown-item del-file-btn" circle icon="minus" @click.prevent="removeFile(file, index)"></el-button> -->
            <el-button type="danger" icon="el-icon-delete" class="dropdown-item del-file-btn" circle @click.prevent="removeFile(file, index)"></el-button>
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
        <div class="btn-group" v-if="!$attrs.show">
          <el-row :gutter="20">
            <el-col :span="8">
              <file-upload class="el-button el-button--primary" style="padding: 9px 20px;" :post-action="postAction" :extensions="extensions" :accept="accept" :multiple="multiple" :directory="directory" :size="size || 0" :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)" :headers="headers" :drop="drop" :drop-directory="dropDirectory" :add-index="addIndex" :value="files" @input="getFile" @input-filter="inputFilter" @input-file="inputFile" ref="upload">
                <i class="el-icon-plus"></i>
                <span>添加图片</span>
              </file-upload>
              <el-button v-if="!showUpload" type="primary" style="vertical-align: middle;" icon="upload" :loading="loading" @click.prevent="startUpload">上传文件</el-button>
              <el-button v-if="!showUpload && baseSave" type="success" style="vertical-align: middle;" icon="save" :loading="loading" @click.prevent="startUpload(1)">保存修改</el-button>
            </el-col>
            <el-col :span="16" style="margin-top:8px;">
              <el-progress :status="propgressLineStatus" :percentage="propgressLine"></el-progress>
            </el-col>
          </el-row>
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
import { mapActions, mapState, mapMutations } from "vuex";
import oss from "@/plugins/oss.js";

const config = {
  uploadImageConfig: {
    accept: "image/png,image/gif,image/jpeg,image/webp",
    extensions: "gif,jpg,jpeg,png,webp",
    // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
    // extensions: /\.(gif|jpe?g|png|webp)$/i,
    minSize: 1024,
    size: 1024 * 1024 * 10,
    multiple: true,
    directory: false,
    drop: true,
    dropDirectory: true,
    addIndex: false,
    thread: 3,
    name: "file",
    postAction: "/product/img/upload",
    autoCompress: 1024 * 1024,
    uploadAuto: false,
    isOption: false
  }
};

const uploadFileToOssMulti = (file, dir, callback) => {
  console.log(file, "555566699");
  return oss.batchUpload(file, dir, callback);
};

const toast = {
  error: "error",
  success: "success",
  warning: "warning",
  info: "info"
};

const showToast = (type, text) => {
  console.log(type);
  this.$message[toast[type]](text);
};

const fixNumber = (num, fixNum, type) => {
  let n = parseFloat(num);
  if (isNaN(n)) {
    return null;
  } else {
    if (type) {
      return Math.floor(n * Math.pow(10, fixNum)) / Math.pow(10, fixNum);
    }
    return Math.round(n * Math.pow(10, fixNum)) / Math.pow(10, fixNum);
  }
};

const fetchData = (opts, loadProgress) => {
  const defaults = {
    baseURL: BASE_URL,
    withCredentials: false,
    credentials: "include",
    method: "get",
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token")
    },
    // 对原生进度事件的处理
    onUploadProgress: loadProgress
  };
  const options = Object.assign(defaults, opts);
  if (options.method === "get") {
    defaults.params = opts.data;
  }
  return Promise.resolve().then(() => axios(options));
};

export default {
  inheritAttrs: false,
  props: [
    "oss",
    "productId",
    "hasImg",
    "productType",
    "showUpload",
    "platformValue",
    "platformImage",
    "baseSave",
    "loading",
    "propgressLine"
  ],
  components: {
    FileUpload
  },

  data() {
    let originData = {
      // uploadBtnLoading: false,
      // propgressLine: this.$attrs.propgressLine,
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

    hasImg: {
      immediate: true,
      handler(val) {
        if (!val) {
          return;
        }
        console.log(val);
        this.initStoreList(val);
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
  created() {
    //  this.getImgsListsApi();
  },
  computed: {
    //    ...mapState("imgUpload", {
    //   getImgListsData: state => state.imgsGetLists
    // })

    ...mapState("imgUpload", {
      getImgListsData: state => state.imgsGetLists
    })
  },
  methods: {
    //   ...mapActions("imgUpload", ["getImgsListsApi"]),
    // ...mapMutations("imgUpload", {
    //   setWordList: "imgsList"
    // }),
    // 初始化从店铺产品传入的值
    initStoreList(val) {
      let res = [...val];
      res.map((el, index) => {
        if (el.manFlag) {
          this.radio = index;
        }
        el.thumb = el.imgM;
        el.progress = 100;
        el.has = true;
        el.size = parseInt(el.size) * 1024;
      });
      this.fileBase64 = res.map(el => el.imgPathM);
      this.files = res;
    },

    // 删除文件
    removeFile(file, index) {
      if (file.has) {
        // 删除数据库图片
        if (this.hasImg) {
          // 店铺产品图片删除
          let vm = this;
          console.log(file);
          fetchData({
            ...apis.STORE_IMG_DELETE,
            data: {
              storeImgId: file.storeImgId
            }
          }).then(res => {
            if (res.data.code === 0) {
              this.refreshData();
              showToast("success", "删除成功");
            } else {
              showToast("error", "删除失败");
            }
          });
        } else {
          // 基础信息图片删除
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
        }
      } else {
        // 删除本地要上传的图片
        this.files.splice(index, 1);
      }
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
    async startUpload(type) {
      this.$emit("loading");
      // this.loading = true;
      this.$emit("upload", this.files);
      let params = {
        dir: "a/a/",
        suffix: "png"
      };
      // let params = {
      //   platformId: 2,
      //   imgFolderId: 1
      // };
      // this.$axios.post("/img/save", params).then(res => {
      //   if (res.data.code == 0) {
      //     this.$message({
      //       message: res.data.msg,
      //       type: "success"
      //     });
      //   }
      //   if (res.data.code == 500) {
      //     this.$message.error(res.data.msg);
      //     return;
      //   }
      // });

      // this.uploadBtnLoading = false;
    },

    // 从服务器获取上传的文件夹
    // async getUrl() {
    //   return fetchData({
    //     ...apis.UPLOAD_REALPATH_GET,
    //     data: { uploadType: "img" }
    //   }).then(res => {
    //     if (res.data.code === 0) {
    //       return res.data.msg;
    //     }
    //   });
    // },

    // 上传图片(店铺产品)
    sendStoreImgData() {
      let data = this.setUploadImgDataStoreList();
      fetchData({ ...apis.STORE_IMG_UPLOAD_BATCH, data }).then(res => {
        this.uploadBtnLoading = false;
        console.log(res);
        if (res.data.code === 0 && res.data.rows.error) {
          this.$emit("refresh");
          this.uploadBtnLoading = false;
        } else if (res.data.code === 0 && !res.data.rows.error) {
          showToast("error", "上传失败");
        } else {
          showToast("error", "上传失败");
        }
      });
    },

    // 处理上传图片的数据(店铺产品)
    setUploadImgDataStoreList() {
      let files = this.files;
      let formData = new FormData();
      let info = [];
      files.map((el, index) => {
        if (!el.file) {
          return;
        }
        console.log(el.file);
        formData.append("files", el.file);

        var i = {
          remark: el.remark,
          mainFlag: el.manFlag,
          index: index
        };
        info.push(i);
      });
      formData.append("productId", this.productId);
      formData.append("info", JSON.stringify(info));

      return formData;
    },

    // 处理上传图片的数据(基础信息)
    setUploadImgData() {
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
      return uploadObj;
    },

    // 提交图片到服务器(基础信息)
    async sendData(type) {
      let url = await this.getUrl();
      let isEdit = false;
      let all = 0;
      let current = 0;
      // 上传oss
      for (let i = 0; i < this.files.length; i++) {
        const element = this.files[i];
        var file = element.file;
        //  判断是否有已经上传了的文件
        if (element && !file) {
          isEdit = true;
          continue;
        }
        all += 100;
      }

      let files = this.files.filter(el => el.file);

      if (files.length <= 0 && !type) {
        this.uploadBtnLoading = false;
        showToast("error", type ? "修改成功" : "没有要上传的图片文件");
        return;
      }
      files = files.map(el => el.file);
      // 把文件一个个上传到oss
      // const upFiles = await uploadFileToOssMulti(files, url, () => {
      //   // 上传成功一个文件就执行这个回调
      //   current += 100;
      //   this.propgressLine = current / all * 100;
      // });
      console.log(upFiles);

      // 上传成功
      // 请求本地服务器保存图片
      if (upFiles.length >= 0) {
        let data = {};
        let i = 0;
        data.productId = this.productId;
        data.parentFlag = this.$attrs.parent == 1 ? 1 : 0;
        data.imgList = [];
        this.files.forEach((el, index) => {
          if (!el.file) {
            data.imgList.push(el);
          } else {
            data.imgList.push({
              imgName: el.name,
              imgPath: upFiles[i],
              imgShowFlag: this.radio === index ? 1 : 0,
              singleSize: el.size,
              singleRemark: el.remark
            });
            i++;
          }
        });

        console.log("上传图片的参数： ", data);

        fetchData({ ...apis.PRODUCT_IMG_UPLOAD, data }).then(res => {
          this.uploadBtnLoading = false;
          console.log("上传==============================");
        });
      }
    },

    // 刷新图片数据
    refreshData() {
      console.log("刷新");
      if (this.hasImg) {
        //店铺图片编辑
        this.$emit("refresh");
      } else {
        // 基础图片编辑
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
              el.thumb = el.imgPath;
            });
            // this.fileBase64 = res.data.productImgEntityList.map(
            //   el => el.imgPathM
            // );
          }
        });
      }
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
<style lang="scss">
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
      overflow: hidden;
      height: auto;
      border: 1px dashed #ddd;
      width: 100%;
      min-height: 400px;
      .del-file-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        [class^="el-icon-"],
        [class*=" el-icon-"] {
          line-height: 0;
        }
      }
      .upload-allfiles {
        padding: 20px;
        li {
          list-style: none;
          position: relative;
          width: 150px;
          float: left;
          background: #ececec;
          margin: 10px;
          padding: 10px;
          img {
            display: block;
            margin: 0 auto;
            width: 150px;
            height: 150px;
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
                font-size: 14px;
                font-weight: bold;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                display: block;
                float: left;
              }
              .el-radio {
                float: right;
              }
            }
            .second {
              font-size: 12px;
              margin-top: 14px;
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
        background: #0f0;
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
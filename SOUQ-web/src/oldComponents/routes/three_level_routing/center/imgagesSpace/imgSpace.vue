<template>
  <!-- 图片空间 -->
  <div class='imgSpace'>
    <!-- 删除目录弹窗 -->
    <!-- <el-dialog title="删除目录" :visible.sync="deleteCatalog" style="min-width:1200px;padding-right:100px;" width="35%">
      <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%; padding-right:100px; ">
        <el-form-item label="父目录: " prop="keywords" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.keywords" />
        </el-form-item>
        <el-form-item label="目录名称:" prop="sku" :label-width="formLabelWidth" style="margin-top:20px;">
          <el-input type="textarea" v-model="form.sku" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
        <el-button type="primary" style="width:100%;" @click="addTaskSubmit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog> -->

    <!-- 图片目录 -->
    <el-row class='paddingBobbtom'>
      <span style="padding-right:15px; ">图片目录</span>

      <div style="width:200px; display:inline-block;">

        {{ currentCatalog}}
        <el-cascader placeholder="可以输入或者点击选择" :options="skuListw" :props="props" filterable style=" width:100%;" v-model="currentCatalog" id="one"></el-cascader>
      </div>
      <el-button type="success" @click="addCatalog = true" style="margin-left:20px;">添加目录</el-button>
      <!-- 添加目录弹窗 -->
      <el-dialog title="添加目录" :visible.sync="addCatalog" style="min-width:1200px;padding-left:20
      " width="35%">
        <el-form :model="form" :rules="rules" ref="ruleForm" style="width:100%;  padding-left:20%;">
          <span>父目录</span>
          <div style="width:200px; display:inline-block;">
            {{addcurrentCatalog}}
            <el-cascader class="cur" placeholder="点击选择" :options="fatherCatalogList" :props="propsList" @focus="getFatherCatalogList" filterable style=" width:100%;" v-model="addcurrentCatalog" id="one"></el-cascader>
          </div>
          <el-form-item label="目录名称:" prop="sku" :label-width="formLabelWidth" style="margin-top:20px; width:60%;">
            <el-input type="textarea" v-model="currentCatalogName" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="addCatalogSubmit('parentId')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 删除弹窗 -->
      <el-button type="success" @click="onaDelete">删除</el-button>
      <el-dialog title="删除目录" :visible.sync="deleteDialog" style="min-width:1200px;padding-right:100px;" width="35%">
        <el-tree :data="skuListw" show-checkbox node-key="imgFolderId" :props="defaultProps" @check-change="handleCheckChange" ref="tree">
        </el-tree>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="deleteSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <div style="float:right; right:50px;">
        <a @click="onExportUrl($event.currentTarget)">
          <el-button type="success">批量导出URL</el-button>
        </a>
      </div>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <el-tabs type="border-card" style="width:100%;">
        <el-tab-pane label="预览模式">
          <UploadImg @upload="startUpload" @loading="loading=true" :propgressLine="propgressLine" :loading="loading" />
        </el-tab-pane>
        <el-tab-pane label="列表模式">
          <div>
            <el-col :span="15">
              <template>
                <span>名称：</span>
                <el-input placeholder="请输入名称" clearable @change="newLists1()" v-model="imgListName" style='max-width:200px;'>
                </el-input>
                <el-button type="success" icon="el-icon-search" @click="searchImgList()">搜索</el-button>
              </template>
            </el-col>
            <el-col :span="9">
              <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;float:right;margin-right:70px;" @change="currentTimeData">
                <el-radio-button label="1">今日</el-radio-button>
                <el-radio-button label="7">7天</el-radio-button>
                <el-radio-button label="30">30天</el-radio-button>
              </el-radio-group>
            </el-col>
          </div>
          <el-table stripe ref="multipleTable" :data="getImgListsData" tooltip-effect="dark" style="width: 100%;padding-top:10px;" @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column prop="imgName" label="名称" align='center'>
            </el-table-column>
            <el-table-column prop="imgType" label="类型" align='center'>
            </el-table-column>
            <el-table-column prop="imgSize" label="大小" align='center'>
            </el-table-column>
            <el-table-column prop="size" label="尺寸" align='center'>
            </el-table-column>
            <el-table-column prop="imgUrl" label="网络连接" align='center'>
            </el-table-column>
            <el-table-column prop="imgUploadTime" label="上传时间" align='center'>
            </el-table-column>
            <el-table-column prop="imgUrl" label="图片" align='center'>

              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <img :src="scope.row.imgUrl" style="width:60px;height60px;">
              </template>
            </el-table-column>
            <el-table-column label="操作" align='center'>
              <template slot-scope="scope">
                <el-button plain @click="deleteData()">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block" style='margin-top:20px;'>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-row>
    <!-- 表格数据 -->

  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations } from "vuex";
import UploadImg from "@/components/common/uploadImg";
import oss from "@/plugins/oss";
const d = require("@/plugins/download.js");

export default {
  components: {
    UploadImg
  },
  data() {
    return {
      imgRemarks: [],
      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数
      tabPosition: 1,
      getImgListsData: [], //接收请求的列表
      deleteListSelects: [], //定义需要删除的目录列表
      // tododata
      loading: false,
      data2: [],
      // 定义删除列表的初始值
      defaultProps: {
        children: "recursionList",
        label: "name"
      },
      imgHost: "",
      imgDir: "",
      resultArr: [],
      filesList: [],
      platformId: 2,
      imgFolderId: null,
      imgUploadTime: "",
      imgUrl: "",
      //导出图片回调数据  返回后台
      dateList: [
        {
          platformId: 2,
          imgFolderId: 2,
          imgUrl: "www.baidu.com",
          imgUploadTime: "2018-7-11 9:57:32",
          imgName: "哈士奇.jpg",
          imgType: "jpg",
          imgSize: 110352,
          size: 1204
        }
      ],

      // ],
      // imgFolderId: [],
      //导出图片回调数据  返回后台
      autograph: "", //图片签名

      addImgLists: "",
      getSiteData: [], //定义选择站点
      currentCatalog: null, //定义当前目录的值
      currentCatalogName: "", //定义表单名字
      addcurrentCatalog: [], //定义添加父目录，获取目录值
      // 定义图片类目
      skuListw: [],
      fatherCatalogList: [], //定义添加目录获取父目录列表
      // 定义图片类目名称列表
      props: {
        value: "imgFolderId",
        // value: "imgFolderId",
        children: "recursionList",
        label: "name"
      },
      propsList: {
        value: "imgFolderId",
        // value: "imgFolderId",
        children: "recursionList",
        label: "name"
      },
      deletecatalogList: {
        value: "imgFolderId",
        // value: "imgFolderId",
        children: "recursionList",
        label: "name"
      },
      formLabelWidth: "120px",
      //关键词排名的变量
      form: {
        platformId: 2,
        keyword: null,
        sku: null,
        monitorFlag: null,
        monitorFrom: null,
        monitorTo: null,
        monitorTimeAry: null
      },

      rules: {
        keywords: [
          { required: true, message: "请输入关键字", trigger: "blur" }
        ],
        sku: [{ required: true, message: "请输入商品ASIN:", trigger: "blur" }]
      },
      imgIdList: [],
      userSelect: [],
      propgressLine: 0,
      deleteDialog: false,
      imgListName: "", //搜索名字
      addCatalog: false, //添加目录
      deleteCatalog: false, //删除目录弹窗
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,
      // 关键词
      inputText: "",
      // 来源
      originOptions: [
        {
          value: "选项1",
          label: "Google"
        },
        {
          value: "选项2",
          label: "速卖通"
        },
        {
          value: "选项3",
          label: "merchantwords"
        }
      ],
      originValue: "",

      // 状态
      StatusOptions: [
        {
          value: "选项1",
          label: "开启"
        },
        {
          value: "选项2",
          label: "抓取成功"
        }
      ],
      StatusValue: "",

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },
  created() {
    this.getImgsListsApi(); //获取列表
    this.getCategorList(); //图片目录列表
  },
  computed: {
    // ...mapState("imgUpload", {
    //   getImgListsData: state => state.imgsGetLists
    // })
  },

  watch: {
    //监听图片的数量
    filesList(val) {
      this.resultArr = [];
      val.forEach(item => {
        this.resultArr.push({
          imgName: item.name,
          imgType: item.name,
          imgSize: item.size,
          size: 1024
        });
      });
    }
  },
  methods: {
    newLists1() {
      this.getImgsListsApi(this.params); //请求类目查询列表
    },
    // 请求列表
    getImgsListsApi(
      params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/Img/list", params).then(res => {
        this.currentPage = res.data.pageNo;
        this.total = res.data.total;
        this.pageSize = res.data.pageSize;
        this.getImgListsData = res.data.rows;
      });
      // /img/list
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let params = {
        pageSize: val, //条数
        pageNumber: this.currentPage, //当前页
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getImgsListsApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      let params = {
        pageSize: this.pageSize,
        pageNumber: val,
        platformId: this.$store.state.selectPlatform.platformId
      };
      this.getImgsListsApi(params);
    },
    currentTimeData() {
      let a = Number(this.tabPosition);

      let params = {
        createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.selectPlatform.platformId
      };
      console.log(params);
      return this.getImgsListsApi(params);
    },
    // 批量导出URL
    onExportUrl(a) {
      console.log(a);
      let exportUrlList = this.userSelect;
      let exportData = [];
      exportUrlList.forEach(item => {
        exportData.push(item.imgId);
      });
      console.log(exportData, "url"); //获取的URL
      // document.writeln(location.host); //获取host

      // window.open(
      //   "http://192.168.0.115:8080/img//exportData/10002?token=e332b8b9209e47e749292f1f535eac95"
      // );

      // location.href =
      //   "http://192.168.0.115:8080/img//exportData/10002?token=e332b8b9209e47e749292f1f535eac95";

      // this.$axios
      //   .post("/Img/exportData", {
      //     taskRtIdArray: exportData
      //   })
      //   .then(res => {
      //     d.download(
      //       new Blob([res.data], { type: "application/vnd.ms-excel" }),
      //       "file.xls",
      //       "application/vnd.ms-excel"
      //     );
      //   });

      this.$axios({
        method: "post",
        url: "/Img/exportData",
        data: { taskRtIdArray: exportData },
        responseType: "blob"
      })
        .then(res => {
          console.log(res, 99999);
          let url = window.URL.createObjectURL(new Blob([res.data]));
          a.href = url;
          a.setAttribute("download", "Url列表.xlsx");
        })
        .catch(function(error) {
          console.log(error);
        });

      // this.$axios.post("/Img/exportData").then(res => {
      //   if (res.data) {
      //     //成功返回的数据
      //     window.open(
      //       "http://192.168.0.233:8080/img//exportData/10002?token=" +
      //         localStorage.getItem("token")
      //     );
      //     this.$message({
      //       message: res.data.msg,
      //       type: "success"
      //     });

      //     return;
      //   } else if (res.data.code == 500) {
      //     this.$message.error(res.data.msg);
      //     return;
      //   }
      // });
    },

    // this.$axios.post("/taskKeywordCompeteRt/exportData", {
    //     taskRtIdArray: result
    //   })
    //   .then(res => {
    //     d.download(
    //       new Blob([res.data], { type: "application/vnd.ms-excel" }),
    //       "file.xls",
    //       "application/vnd.ms-excel"
    //     );

    //   }),

    //删除目录todom
    deleteSubmit() {
      let dataList = this.$refs.tree.getCheckedNodes();
      console.log(dataList, "999");
      dataList.forEach(item => {
        this.deleteListSelects.push(item.imgFolderId);
      });

      this.$axios
        .post("/ImgFolder/remove", { imgFolderIds: this.deleteListSelects })
        .then(res => {
          if (res.data.code == 0) {
            //成功返回的数据
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.deleteDialog = false;

            let deleteDataList = [];
            this.getCategorList(); //图片目录列表
            return;
          }
        });
    },
    handleCheckChange(data, checked, indeterminate) {},

    //批量上传图片
    async startUpload(files) {
      if (this.currentCatalog == "") {
        return;
      } else {
        console.log(this.getImgListsData, "这是拿到的数据");
        this.filesList = files;
        console.log(this.filesList, "???");
        let x = this.filesList;
        let imgRemarks = [];
        x.forEach(item => {
          imgRemarks.push(item.remark);
        });
        console.log(imgRemarks, "beizhu");
        imgRemarks = imgRemarks.map(item => {
          if (item == undefined) {
            return "";
          } else {
            return item;
          }
        });
        this.imgRemarks = imgRemarks;
        console.log(imgRemarks, "999444");
        files = files.map(el => el.file);

        console.log(files, "777777777"); //可以查看图片的信息
        let imgNameLists = [];
        let imgTypeList = [];
        let imgUploadTime = [];
        let imgSizeLists = [];

        let data = [];
        // data["imgUploadTime"] = new Date();
        files.forEach((item, index) => {
          var name = item.name;
          var type = name.substring(name.indexOf(".") + 1, name.length);
          let d = {
            imgName: item.name,
            imgSize: item.size,
            imgType: type
          };

          var f = item;
          var reader = new FileReader();
          reader.onload = function(e) {
            var data = e.target.result;
            //加载图片获取图片真实宽度和高度
            var image = new Image();
            image.onload = function() {
              var width = image.width;
              var height = image.height;

              var size = width + "x" + height;
              d["size"] = size;
              // 这里是弹出图片的宽高尺寸
              // alert(width + "======" + height + "=====" + f.size);
            };
            image.src = data;
          };
          reader.readAsDataURL(f);
          data[index] = d;
        });

        // console.log("data6666666666666666666666666666666",da)

        this.dateList = data;

        // console.log(imgNameLists, "这是图片名字");
        // console.log(imgTypeList, "这是图片类型");
        // console.log(imgSizeLists, "这是图片大小");
        let formatTime = (time, cFormat) => {
          if (!time) {
            return null;
          }
          time = new Date(time).getTime();
          if (arguments.length === 0) return null;
          if ((time + "").length === 10) {
            time = +time * 1000;
          }
          var format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}",
            date;
          if (typeof time === "object") {
            date = time;
          } else {
            date = new Date(time);
          }
          var formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
          };
          var time_str = format.replace(
            /{(y|m|d|h|i|s|a)+}/g,
            (result, key) => {
              var value = formatObj[key];
              if (key === "a")
                return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
              if (result.length > 0 && value < 10) {
                value = "0" + value;
              }
              return value || 0;
            }
          );

          return time_str;
        };
        // }, //导出图片回调数据  返回后台
        // return;
        let total = files.length;
        let cur = 0;
        let vm = this;
        // 获取dir
        // 上传
        // 请求后端入库
        let a = this.currentCatalog;
        let b = document
          .querySelectorAll(".el-cascader__label")[0]
          .innerText.replace(/\s/g, "");

        let routes = b;

        let params = {
          dir: routes,
          suffix: "png"
        };
        let imgFolderIdList = params.routes;
        this.imgFolderId = imgFolderIdList;
        // console.log(this.uploadImgData.imgFolderId, "这是文件的路径");

        // console.log(params, "6666666");
        let res = await this.$axios.post("/Img/getDirs", params);
        debugger;
        if (res.data.code == 0) {
          vm.autograph = res.data.data;

          let paths = await oss.batchUpload(files, res.data.data, paths => {
            // console.log(1);
            cur++;
            vm.propgressLine = cur / total * 100;
          });

          console.log(paths);

          const afterNum = this.currentCatalog[this.currentCatalog.length - 1];

          const getCurrentTimeFormat = function() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            if (month >= 1 && month <= 9) {
              month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
            }
            var currentdate =
              year +
              seperator1 +
              month +
              seperator1 +
              strDate +
              " " +
              hour +
              ":" +
              minutes +
              ":" +
              seconds;
            return currentdate;
          };

          let dataList = [];

          files.forEach((el, index) => {
            dataList.push({
              platformId: this.$store.state.selectPlatform.platformId,
              imgFolderId: Number(afterNum),
              imgUrl: paths[index],
              imgUploadTime: getCurrentTimeFormat(),
              imgName: el.name,
              imgType: el.name.split(".")[el.name.split(".").length - 1],
              imgSize: el.size,
              size: data[index].size,
              imgRemarks: this.imgRemarks[index]
            });
            console.log(dataList, "999");
          });
          debugger;
          vm.$axios.post("/Img/save", dataList).then(res => {
            this.loading = false;
            if (res.data.code == 0) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              // this.uploadBtnLoading = false;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      }
    },
    // 添加目录提交
    addCatalogSubmit(parentId) {
      // 不选择目录列表，默认创建父目录
      if (this.addcurrentCatalog == "") {
        let params = {
          platformId: this.$store.state.selectPlatform.platformId,
          parentImgFolderId: Number(0),
          name: this.currentCatalogName
        };

        this.$axios.post("/ImgFolder/save", params).then(res => {
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);

            return;
          }
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.addCatalog = false;
            this.getCategorList(); //图片目录列表
          }
        });
      } else {
        // 选择父目录，创建子目录
        //取最后一位
        const afterNum = this.addcurrentCatalog[
          this.addcurrentCatalog.length - 1
        ];
        let params = {
          platformId: this.$store.state.selectPlatform.platformId,
          parentImgFolderId: Number(afterNum),
          name: this.currentCatalogName
        };
        this.$axios.post("/ImgFolder/save", params).then(res => {
          if (res.data.code == 500) {
            this.$message.error(res.data.msg);

            return;
          }
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.addCatalog = false;
            this.getCategorList(); //图片目录列表
          }
        });
      }
    },

    //获取图片目录列表
    getCategorList() {
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      };
      this.$axios.post("/ImgFolder/list", params).then(res => {
        if (res.data.code == 0) {
          this.skuListw = res.data.data;
          console.log(this.skuListw, "天涯");
          let nameList = [];
          let nameNew = this.skuListw;
          nameNew.forEach(item => {
            nameList.push(item.name);
          });
          console.log(nameList, "名字");

          if (this.nameList == this.currentCatalog) {
            console.log(this.skuListw.imgFolderId, "当前ID>???");
          }

          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    //  添加目录的获取目录
    getFatherCatalogList() {
      if (this.fatherCatalogList.length) {
        return;
      }
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10
      };
      this.$axios.post("/ImgFolder/list", params).then(res => {
        if (res.data.code == 0) {
          this.fatherCatalogList = res.data.data;
          // console.log(this.fatherCatalogList, "天涯");
          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg);
        }
      });
    },
    //删除
    onaDelete() {
      this.deleteDialog = true;
    },

    // ...mapActions("imgUpload", ["getImgsListsApi"]),
    ...mapMutations("imgUpload", {
      setWordList: "imgsList"
    }),
    //搜索
    searchImgList() {
      // alert(this.imgListName);
      if (this.imgListName) {
        // console.log(this.imgListName, "1111115");
        this.recordSearch(this.imgListName);
      }
    },
    recordSearch(imgListName) {
      // console.log(this.imgListName, "22222");
      let params = {
        platformId: this.$store.state.selectPlatform.platformId,
        pageNumber: 1,
        pageSize: 10,
        imgName: this.imgListName
      };
      // console.log(params, "222");
      this.$axios.post("/Img/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo;
          this.pageSize = res.data.pageSize;
          this.total = res.data.total;
          this.getImgListsData = res.data.rows;

          return;
        }
        if (!res.data.rows.length) {
          this.$message.error("未查询到相关的数据");
        }
      });
    },
    //删除
    deleteData() {
      if (this.userSelect.length) {
        //去重
        let a = this.imgIdList;
        let s = new Set(a);
        let result = Array.from(s);
        // console.log(result, "55555???????");
        this.$axios.post("/Img/remove", { imgIds: result }).then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.getImgsListsApi();
            this.imgIdList = [];
            return;
          }
        });
      }
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val; //返回选中信息的数据
      this.userSelect.forEach(item => {
        this.imgIdList.push(item.imgId);
        // console.log(this.imgIdList, "777777");
      });
      // console.log(val);
    },
    // table删除
    deleteRow(tableData) {
      console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      console.log(index, rowDetail);
      this.$router.push({
        name: "salesMonitoringSee",
        params: {
          id: index
        }
      });
    }
  }
};
</script>

<style scoped>
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
</style>

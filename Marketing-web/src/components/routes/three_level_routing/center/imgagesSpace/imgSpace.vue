<template>
  <!-- 图片空间 -->
  <div class='imgSpace __wrapper_i'>
    <!-- 图片目录 -->
    <el-row class='paddingBobbtom'>
      <!-- <span style="padding-right:15px; ">图片目录</span> -->

      <!-- <div style="width:200px; display:inline-block;">

        {{ currentCatalog}}
        <el-cascader placeholder="可以输入或者点击选择" :options="skuListw" @blur="getImgId()" :change-on-select="true" :props="props" filterable style=" width:100%;" v-model="currentCatalog" id="one"></el-cascader>
      </div> -->
      <el-button type="success" @click="addForder">添加目录</el-button>
      <!-- 添加目录弹窗 -->
      <el-dialog :close-on-click-modal="false" title="添加目录" v-if="addCatalog" :visible.sync="addCatalog" width="600px">
        <div class="__box_wrapper">
          <el-form :model="form22" ref="ruleForm" style="width:100%;">
            <!-- <span>父目录</span> -->
            <el-form-item :label-width="formLabelWidth" label="父目录:">
              <!-- {{addcurrentCatalog}} -->
              <el-cascader v-if="refreshTree" class="cur" placeholder="默认根目录" :options="fatherCatalogList" :change-on-select="true" :props="propsList" clearable style=" width:100%;" v-model="form22.addcurrentCatalog" id="one" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="目录名称:" prop="currentCatalogName" :label-width="formLabelWidth" :rules="[{required:true, message: '请填写目录'}]">
              <el-input placeholder="无选择父目录默认添加父目录" v-model="form22.currentCatalogName" />
            </el-form-item>
            <el-form-item :label-width="formLabelWidth">
              <el-button type="primary" style="width:100%;" @click="addCatalogSubmit('parentId')">确 定</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-dialog>
      <!-- 删除弹窗 -->
      <!-- <el-button type="success" plain @click="onaDelete">删除</el-button> -->
      <el-dialog :close-on-click-modal="false" title="删除目录" :visible.sync="deleteDialog" width="600px">
        <el-tree @check="handlerNodeClickDel" :check-strictly="true" :data="skuListw" show-checkbox node-key="imgFolderId" :props="defaultProps" ref="tree">

        </el-tree>
        <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
          <el-button type="primary" style="width:100%;" @click="deleteSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 获取流量 -->
      <!-- <template>
        <div class="timeBox timeStyImgSpace">
          <span v-if="showResidualCapacity"> 剩余 {{this.residualCapacity}}</span>
          <span v-if="!showResidualCapacity"> 未开启图片空间</span>
        </div>
      </template> -->
      <div style="float:right; right:50px;">
        <template>
          <span style="font-size:14px;opacity:0.6" v-if="$refs.uploadImg && activeName == 1 && $refs.uploadImg.checkList.length > 0">已选择: {{$refs.uploadImg.checkList.length}}</span>
          <span style="font-size:14px;opacity:0.6" v-if="$refs.multipleTable && activeName == 2 && $refs.multipleTable.selection.length > 0">已选择: {{$refs.multipleTable.selection.length}}</span>
          <el-button v-if="($refs.uploadImg && $refs.uploadImg.checkList.length > 0) || ($refs.multipleTable && $refs.multipleTable.selection.length > 0)" style="margin:0 10px;font-size:14px" type="text" @click="clearList">清空</el-button>
        </template>

        <el-button type="success" v-if="$refs.uploadImg && activeName == 1" @click="handlerBatchUrl(0)">批量导出URL</el-button>
        <el-button type="success" v-if="$refs.multipleTable && activeName == 2 && $refs.multipleTable.selection.length > 0" v-else @click="handlerBatchUrl(1)">批量导出URL</el-button>
        <!-- 添加目录弹窗 -->
        <el-dialog :close-on-click-modal="false" title="提示" v-if="exportDialog" :visible.sync="exportDialog" width="600px">
          <div class="__box_wrapper">
            <el-form :model="formExport" ref="ruleForm33" style="width:100%;">
              <el-form-item label="请确认导出:" prop="currentCatalogName" :label-width="formLabelWidth">
                <el-checkbox v-model="formExport.checked">是否包含子目录</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-button type="primary" style="width:100%;" @click="onExportUrl(false)">确 定</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button type="primary" style="width:100%;" @click="exportDialog = false">取 消</el-button>
                  </el-col>
                </el-row>

              </el-form-item>
            </el-form>
          </div>

        </el-dialog>
      </div>
    </el-row>
    <!-- 布局 -->
    <el-row type='flex' justify="space-between" style="margin:0 !important;padding-top:10px;box-sizing:border-box" :gutter="20" v-loading="loadingImgBox" class="space_wrapper">
      <el-col :span="4" style="padding:20px; border: 1px solid #ddd;padding-top:0;display: flex;flex-direction: column;">
        <div style="font-size:12px;color:#00c0de;margin:10px 0;line-height:2">
          <el-button v-for="(i, index) in currentFolder" @click="goToFolder(i, index)" href="#" type="text">{{i.name.trim() === '.' ? '根目录' : i.name}} / </el-button>
        </div>
        <!-- <el-tree :auto-expand-parent="true" v-if="refreshTree" :expand-on-click-node="false" ref="treeMain" :props="treeProps" :load="loadNode" lazy @current-change="handleFolderNodeClick" node-key="imgFolderId">
        </el-tree> -->
        <el-tree class="custom_tree" :auto-expand-parent="true" :expand-on-click-node="false" ref="treeMain" :props="treeProps" :data="skuListw" node-key="imgFolderId" @node-click="handleFolderNodeClick" :default-expanded-keys="defaultKeys">
          <span class="custom-tree-node" slot-scope="{ node, data }" @mouseenter="$set(data, 'showEdit', true)" @mouseleave="$set(data, 'showEdit', false)">
            <span>
              <span v-if="!data.showInput">
                <img src="~@/assets/folder.png" width="20" height="20" />
                <span style="vertical-align: text-bottom;"> {{ node.label }}</span>
              </span>
              <div class="add-input" v-else @mouseenter.self.stop="$set(data, 'showEdit', false)">
                <el-input @click.self.stop v-model="data.name" size="mini"></el-input>
                <span class="btn-box-1">
                  <i class="el-icon-check" @click.self.stop="saveName(node, data)"></i>
                  <i class="el-icon-close" @click.self.stop="cancelItem(node, data)"></i>
                </span>
              </div>

            </span>

            <span v-if="data.showEdit && !data.showInput" class="btn-box btn-box-space">
              <i class="el-icon-edit" @click.self.stop="editName(node, data)"></i>
              <i class="el-icon-delete" @click.self.stop="delItem(node, data)"></i>
            </span>

          </span>
        </el-tree>
      </el-col>
      <el-col :span="20" style="padding-right:0">
        <el-tabs type="border-card" style="width:100%;" @tab-click="newLists" v-model="activeName" class="tabs">
          <el-tab-pane label="预览模式" name='1' class="tabs__wrapper">
            <UploadImg :showBtn='showBtn' :propgressLineStatus.sync="propgressLineStatus" :current-folder="currentFolder" :has-img="folderList" @upload="startUpload" @loading="loading=true" @delItem="handlerDownDel" :propgressLine.sync="propgressLine" :loading="loading" @open-folder="changeFolderId($event)" @delete-file="handleDeleteFile" ref="uploadImg" />

          </el-tab-pane>
          <el-tab-pane label="列表模式" name='2'>
            <el-row class='__my_form_inline'>
              <el-form :inline="true">
                <el-form-item label="名称">
                  <el-input placeholder="请输入名称" clearable @change="newLists1()" v-model="searchParams.imgName" style='max-width:150px;' @keyup.enter="searchImgList">
                  </el-input>
                  <el-button type="success" icon="el-icon-search" @click="searchImgList()">搜索</el-button>
                </el-form-item>
                <el-form-item class="__J_flex right" style="margin-right: 0;">
                  <el-radio-group v-model="tabPosition" @change="currentTimeData">
                    <el-radio-button label="1">今日</el-radio-button>
                    <el-radio-button label="7">7天</el-radio-button>
                    <el-radio-button label="30">30天</el-radio-button>
                  </el-radio-group>
                  <el-date-picker unlink-panels style="max-width:240px" :label-width="formLabelWidth" value-format="yyyy-MM-dd" @blur="newTime()" clearable @change="newLists2()" class="el-date-wrapper" v-model="monitorTimeAry" type="daterange" align="left" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                  </el-date-picker>

                </el-form-item>

              </el-form>

            </el-row>
            <el-table :max-height="12000" stripe ref="multipleTable" :data="getImgListsData" tooltip-effect="dark" style="width: 100%;padding-top:10px;" @selection-change="handleSelectionChange">
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
              <el-table-column prop="imgUrl" label="URL" align='center'>
                <template slot-scope="scope">
                  <div class="fix__row_2" v-if="scope.row.imgUrl === '' || scope.row.imgUrl == null">{{scope.row.imgUrl | _formatData}}</div>
                  <el-tooltip v-else placement="top">
                    <div slot="content" class="___tooltip">
                      <div>{{scope.row.imgUrl}}</div>
                      <!-- <div>
                        <el-button style="padding:0 !important;margin:0 0 0 6px !important" type="text" @click="copy('text', scope.$index)">复制</el-button>
                      </div> -->
                    </div>
                    <div class="fix__row_2">
                      <a rel="noopener noreferrer nofollow" class="aLink" target="_blank" style="text-decoration:none;">{{ scope.row.imgUrl!=""?scope.row.imgUrl:"-"}}
                      </a>
                    </div>
                  </el-tooltip>
                </template>
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
                  <el-button plain @click="deleteData(scope)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block" style='margin-top:20px;'>
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>

    </el-row>
    <!-- 表格数据 -->

  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState, mapMutations } from 'vuex'
import UploadImg from '@/components/common/uploadImg'
import oss from '@/plugins/oss'
import { isDisabled, getDay } from '@/api/functions'
const d = require('@/plugins/download.js')

export default {
  components: {
    UploadImg
  },
  data() {
    return {
      defaultKeys: [],
      folderTree: [],
      exportDialog: false,
      formExport: {},
      propgressLineStatus: null,
      searchParams: {},
      activeName: '1',
      form22: {
        currentCatalogName: '',
        addcurrentCatalog: []
      },
      refreshTree: true,
      loadingImgBox: false,
      currentFolder: [{ name: '. ', key: 0 }],
      currentFolderName: '. /',
      treeProps: {
        label: 'name',
        children: 'recursionList'
      },
      folderList: [],
      monitorTimeAry: [],
      imgSuccess: [],
      // residualCapacity: null,
      // showResidualCapacity: true,
      imgRemarks: [],
      paths: [],
      currentPage: null, //分页
      total: null, //总条数
      pageSize: null, //每页条数
      tabPosition: null,
      getImgListsData: [], //接收请求的列表
      deleteListSelects: [], //定义需要删除的目录列表
      // tododata
      loading: false,
      data2: [],
      // 定义删除列表的初始值
      defaultProps: {
        children: 'recursionList',
        label: 'name'
      },
      imgHost: '',
      imgDir: '',
      resultArr: [],
      filesList: [],
      platformId: 2,
      imgFolderId: null,
      imgUploadTime: '',
      imgUrl: '',
      //导出图片回调数据  返回后台
      dateList: [
        {
          platformId: 2,
          imgFolderId: 2,
          imgUrl: 'www.baidu.com',
          imgUploadTime: '2018-7-11 9:57:32',
          imgName: '哈士奇.jpg',
          imgType: 'jpg',
          imgSize: 110352,
          size: 1204
        }
      ],

      // ],
      // imgFolderId: [],
      //导出图片回调数据  返回后台
      autograph: '', //图片签名

      addImgLists: '',
      getSiteData: [], //定义选择站点
      currentCatalog: ['0'], //定义当前目录的值
      currentCatalogName: '', //定义表单名字
      addcurrentCatalog: [], //定义添加父目录，获取目录值
      // 定义图片类目
      skuListw: [],
      fatherCatalogList: [], //定义添加目录获取父目录列表
      // 定义图片类目名称列表
      props: {
        value: 'imgFolderId',
        // value: "imgFolderId",
        children: 'recursionList',
        label: 'name'
      },
      propsList: {
        value: 'imgFolderId',
        // value: "imgFolderId",
        children: 'recursionList',
        label: 'name'
      },
      deletecatalogList: {
        value: 'imgFolderId',
        // value: "imgFolderId",
        children: 'recursionList',
        label: 'name'
      },
      formLabelWidth: '90px',
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
        currentCatalogName: [
          {
            required: true,
            message: '请输入图片目录名',
            trigger: ['blur', 'change']
          }
        ]
      },
      imgIdList: [],
      userSelect: [],
      propgressLine: 0,
      deleteDialog: false,
      imgListName: '', //搜索名字
      addCatalog: false, //添加目录
      deleteCatalog: false, //删除目录弹窗
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      dialogFormVisible: false,

      // 关键词
      inputText: '',
      // 来源
      originOptions: [
        {
          value: '选项1',
          label: 'Google'
        },
        {
          value: '选项2',
          label: '速卖通'
        },
        {
          value: '选项3',
          label: 'merchantwords'
        }
      ],
      originValue: '',

      // 状态
      StatusOptions: [
        {
          value: '选项1',
          label: '开启'
        },
        {
          value: '选项2',
          label: '抓取成功'
        }
      ],
      StatusValue: '',

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    }
  },
  created() {
    // this.getImgsListsApi(); //获取列表

    this.getflowApi() //获取流量
    this.getFolder()
  },
  mounted() {
    this.$refs.treeMain.setCurrentKey(0)
    // this.getFatherCatalogList();
    this.getCategorList() //图片目录列表
  },
  computed: {
    // ...mapState("imgUpload", {
    //   getImgListsData: state => state.imgsGetLists
    // })
    currentId() {
      return this.currentFolder[this.currentFolder.length - 1].key
    },
    showBtn() {
      return this.currentId !== 0
    },
    isRoot() {
      return this.currentFolder.length == 0 || this.currentFolder.length == 1
    }
  },

  watch: {
    currentId(val) {
      this.$refs.treeMain.setCurrentKey(val)
    },

    // selectPlatform() {
    //   this.getCategorList();
    //   this.$refs.treeMain.setCurrentKey(0);
    //   this.getFolder();
    //   this.getFatherCatalogList();
    // },
    //监听图片的数量
    filesList(val) {
      // this.$emit("update:propgressLineStatus", null);
      // console.log(2222222222222222222222);
      // this.propgressLineStatus = null;
      this.resultArr = []
      val.forEach(item => {
        this.resultArr.push({
          imgName: item.name,
          imgType: item.name,
          imgSize: item.size,
          size: 1024
        })
      })
    },

    activeName(val) {
      this.searchParams = {}
      this.tabPosition = null
      this.monitorTimeAry = []
      if (val === '2') {
        this.recordSearch()
      } else {
        if (this.$refs.treeMain.getCurrentKey() !== 0) {
          // console.log(this.$refs.treeMain.getCurrentKey());
          let key = this.$refs.treeMain.getCurrentKey()
          let i
          this.currentFolder.forEach((element, index) => {
            if (key === element.key) {
              i = index
              return false
            }
          })
          if (i) {
            this.currentFolder.splice(i + 1)
          }
          this.getFolder(key || 0)
          return
          // this.$refs.treeMain.setCurrentKey(0)
        }
        this.currentFolder = [{ name: '. ', key: 0 }]
        this.getFolder(this.$refs.treeMain.getCurrentKey() || 0)
      }
    },

    // 监听目录改变，选择对应的列表
    currentCatalog(val) {
      // console.log(val, "66666");
      let imgData = val[val.length - 1]
      // console.log(imgData, 4444);

      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0],
        pageNumber: 1,
        pageSize: 10,
        imgFolderId: imgData
      }
    },

    monitorTimeAry(val) {
      this.searchParams.startTime = val[0]
      this.searchParams.endTime = val[1]
    }
  },
  methods: {
    editName(node, data) {
      this.$set(data, '_oldVal', data.name)
      this.$set(data, 'showInput', true)
    },
    saveName(node, data) {
      if (data._oldVal === data.name) {
        this.cancelItem(node, data)
        return
      }
      this.$axios
        .post('/ImgFolder/updateName', {
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ','
          )[0],
          imgFolderId: data.imgFolderId,
          name: data.name
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg)
            this.currentFolder = [
              {
                id: 0,
                name: '根目录'
              }
            ]
            this.findFolderById({ id: 0 })
            this.getflowApi()
            this.getCategorList() //图片目录列表
          } else if (res.data.code === 500) {
            this.$message.error(res.data.msg)
          }
        })
    },
    cancelItem(node, data) {
      this.$set(data, 'name', data._oldVal)
      this.$set(data, 'showInput', false)
    },
    delItem(node, data) {
      this.$confirm('是否删除该目录及子目录所有文件？', '警告', {
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .post('/ImgFolder/remove', {
              imgFolderIds: [data.imgFolderId]
            })
            .then(res => {
              if (res.data.code == 0) {
                this.$message.success(res.data.msg)
                this.currentFolder = [
                  {
                    id: 0,
                    name: '根目录'
                  }
                ]
                this.findFolderById({ id: 0 })
                this.getflowApi()
                this.getCategorList() //图片目录列表
              } else if (res.data.code === 500) {
                this.$message.error(res.data.msg)
              }
            })
        })
        .catch(() => {})
    },
    clearList() {
      this.$refs.uploadImg.clearCheckList()
      if (this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
      }
    },
    addForder() {
      this.addCatalog = true

      const arr = this.currentFolder.map(el => el.key).slice(1)
      // this.refresh();
      // this.getCategorList();
      this.getFatherCatalogList(() => {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$set(this.form22, 'addcurrentCatalog', arr)
            this.addcurrentCatalog = arr
            // this.form22.addcurrentCatalog = this.currentFolder.map(el => el.key);
            this.form22.currentCatalogName = this.currentCatalogName = ''
          })
        })
      })
    },
    findFolderById({ id, name, notF }) {
      let root = this.$refs.treeMain.root
      let cur = this.currentFolder
      let parentId = cur[cur.length - 1].key

      function findNode(id) {
        let child = root.childNodes
        if (child) {
          let find = child.find(el => el.data.imgFolderId === id)
          if (find) {
            return find
          } else {
            if (child.childNodes) {
              findNode(child.childNodes)
            }
          }
        }
      }
      let el = findNode(parentId)
      if (name) {
        this.currentFolder.push({
          key: id,
          name
        })
      }

      this.defaultKeys = [id]
      this.refresh(id)

      if (!notF) {
        this.getFolder(id)
      }
    },

    changeFolderId({ imgFolderId: id, name }) {
      this.loadingImgBox = true
      this.findFolderById({ id, name })
    },
    async handlerDownDel(list, done) {
      if (!list.length) {
        this.$message({
          type: 'warning',
          message: '请选择至少一项进行删除'
        })
        return
      }
      try {
        let [resA, resB] = await Promise.all([
          this.delPic(list),
          this.delFordler(list)
        ])
        if (resA !== 1 && resA.data.code !== 0) {
          this.$message({
            type: 'error',
            message: resA.data.msg
          })
          return
        }
        if (resB !== 1 && resB.data.code !== 0) {
          this.$message({
            type: 'error',
            message: resB.data.msg
          })
          return
        }

        this.getflowApi()
        this.getCategorList() //图片目录列表
        this.getFolder(this.currentId)

        if (this.activeName == 1) {
          this.$refs.uploadImg.checkList.splice(0)
        } else {
          this.$refs.multipleTable.selection.splice(0)
        }

        this.$message({
          type: 'success',
          message: '删除成功'
        })

        done()

        list.splice(0)
      } catch (error) {
        console.error(error)
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
    },
    delPic(list) {
      const imgIds = list.filter(el => el.imgId != null).map(el => el.imgId)
      console.log(imgIds)
      if (!imgIds.length) {
        return 1
      }
      return this.$axios.post('/Img/remove', {
        imgIds
      })
    },
    delFordler(list) {
      const imgFolderIds = list
        .filter(el => el.imgFolderId != null)
        .map(el => el.imgFolderId)
      if (!imgFolderIds.length) {
        return 1
      }
      return this.$axios.post('/ImgFolder/remove', {
        imgFolderIds
      })
    },
    handleDeleteFile({ file, index }) {
      this.$confirm('此操作将删除该项, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (file.imgId) {
            // 删除图片
            this.$axios
              .post('/Img/remove', { imgIds: [file.imgId] })
              .then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  })
                  this.folderList.splice(index, 1)
                  this.$refs.uploadImg.checkList.splice(0)
                  this.getflowApi()
                  this.getCategorList()
                } else if (res.data.code === 500) {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              })
          } else {
            // 删除文件夹
            this.$axios
              .post('/ImgFolder/remove', { imgFolderIds: [file.imgFolderId] })
              .then(res => {
                if (res.data.code === 0) {
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  })
                  this.$refs.uploadImg.checkList.splice(0)
                  this.folderList.splice(index, 1)
                  this.getFatherCatalogList()
                  this.getflowApi()
                  this.getCategorList()
                } else {
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  })
                }
              })
          }
        })
        .catch(() => {})
    },
    handleFolderNodeClick(i, m, n) {
      console.log(i, m, n)
      if (n.$el.querySelectorAll('.el-input__inner').length !== 0) {
        return
      }

      this.loadingImgBox = true
      if (this.activeName === '2') {
        this.recordSearch(i.imgFolderId, true)
      } else {
        this.getFolder(i.imgFolderId)
      }
      let arr = []
      function findParent(parent) {
        if (parent) {
          if (parent.data) {
            if (parent.parent) {
              arr.unshift({
                name: parent.data.name,
                key: parent.data.imgFolderId
              })
            } else {
              arr.unshift({
                name: '根目录',
                key: 0
              })
            }
          }

          if (parent.parent) {
            findParent(parent.parent)
          }
        }
      }
      findParent(m)
      this.currentFolder = arr
      // console.log(arr);
    },

    copy(refname, index) {
      let input = this.$refs[refname]
      input.select() //选中文本
      setTimeout(() => {
        document.execCommand('copy') // 执行浏览器复制命令
        this.$message({
          type: 'success',
          message: '复制成功'
        })
      })
    },
    loadNode(node, resolve) {
      // console.log(222222222222222222);
      if (node.level === 0) {
        return resolve([{ name: '根目录', imgFolderId: 0 }])
      }
      this.getFolder(node.data.imgFolderId, data => {
        resolve(data.imgFolder || [])
      })
    },
    //扣点
    getflowApi() {
      this.$axios.post('/FunctionMkt/surplusCapacity').then(res => {
        // console.log(res);
        let code = res.data.code
        // console.log(code);
        if (code == 0) {
          let status = res.data.data.type
          // console.log(status);
          if (status == 1) {
            // this.showResidualCapacity = true;
            this.$store.commit('common/showResidualCapacity', true)
            // this.residualCapacity = res.data.data.capacity;
            this.$store.commit(
              'common/residualCapacity',
              res.data.data.capacity
            )
            return
            // console.log(this.residualCapacity);
          } else {
            this.$store.commit('common/showResidualCapacity', false)
            // this.showResidualCapacity = false;
          }
        } else {
          this.$store.commit('common/showResidualCapacity', false)
          // this.showResidualCapacity = false;
        }
      })
    },
    newLists() {
      if (this.currentCatalog == null) {
        return
      } else {
        let imgFolderIdData = this.currentCatalog[
          this.currentCatalog.length - 1
        ]
        let params = {
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ','
          )[0],
          pageNumber: 1,
          pageSize: 10,
          // imgFolderId: this.currentCatalog[0]
          imgFolderId: imgFolderIdData
        }
        // this.getImgsListsApi(params); //获取列表
      }
    },

    goToFolder(i, index) {
      // console.log(i, index);

      if (this.activeName === '2') {
        this.recordSearch(i.key)
      } else {
        this.changeFolderId({ imgFolderId: i.key })
        // this.getFolder(i.imgFolderId);
      }

      this.currentFolder.splice(index + 1)
      this.$refs.treeMain.setCurrentKey(i.key === 0 ? null : i.key)
      // this.getFolder(this.currentId);
    },

    // 选择目录失去焦点出发的函数，请问求对应的列表
    getImgId(
      params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0],
        pageNumber: 1,
        pageSize: 10,
        // imgFolderId: this.currentCatalog[0]
        imgFolderId: imgFolderIdData
      }
    ) {
      // console.log(this.currentCatalog, "点击触发的ID?");
      if (this.currentCatalog == null) {
        return
      } else {
        let imgFolderIdData = this.currentCatalog[
          this.currentCatalog.length - 1
        ]

        this.$axios.post('/Img/list', params).then(res => {
          this.currentPage = res.data.pageNo
          this.total = res.data.total
          this.pageSize = res.data.pageSize
          this.getImgListsData = res.data.rows
        })
      }
    },
    newLists1() {
      // this.getImgsListsApi(this.params); //请求类目查询列表
    },
    newLists2() {
      // this.getImgsListsApi(this.params); //请求类目查询列表
    },

    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.searchParams.pageSize = val
      this.recordSearch()
      // this.getImgsListsApi(params);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // let params = {
      //   pageSize: this.pageSize,
      //   pageNumber: val,
      //   platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0]
      // };
      this.searchParams.pageNumber = val
      this.recordSearch()
      // this.getImgsListsApi(params);
    },
    //获取多少天以前的时间
    getBeforeTime(n) {
      var n = n
      var d = new Date()
      var year = d.getFullYear()
      var mon = d.getMonth() + 1
      var day = d.getDate()
      if (day <= n) {
        if (mon > 1) {
          mon = mon - 1
        } else {
          year = year - 1
          mon = 12
        }
      }
      d.setDate(d.getDate() - n)
      year = d.getFullYear()
      mon = d.getMonth() + 1
      day = d.getDate()
      return (
        year +
        '-' +
        (mon < 10 ? '0' + mon : mon) +
        '-' +
        (day < 10 ? '0' + day : day)
      )
    },
    //计算本月有多少天
    getCountDays() {
      var curDate = new Date()
      var curMonth = curDate.getMonth()
      curDate.setMonth(curMonth + 1)
      curDate.setDate(0)
      return curDate.getDate()
    },

    // 根据时间选择数据 今日 7日  30日
    currentTimeData() {
      // console.log(this.monitorTimeAry[0], "时间");
      let a = Number(this.tabPosition)
      let _end = null
      let _start = null
      switch (a) {
        case 7:
          _start = getDay(7).computedDay
          _end = getDay().today
          break
        case 30:
          _start = getDay(30).computedDay
          _end = getDay().today
          break
        default:
          _start = getDay().today
          _end = getDay().today
      }
      this.monitorTimeAry = [_start, _end]

      // let params = {
      //   startTime: this.monitorTimeAry[0],
      //   endTime: this.monitorTimeAry[1],
      //   pageSize: this.pageSize,
      //   pageNumber: this.currentPage,
      //   platformId: this.$store.state.common.savePlatformIdAndSiteId.split("," )[0]
      // };
      this.$forceUpdate()
      let _params = {
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1],
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        imgFolderId: this.currentId,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0]
      }
      this.getImgId(_params)
    },

    //自由选择时间 刷新列表
    newTime() {
      let a = Number(this.tabPosition)
      this.tabPosition = null
      let params = {
        // createTime: a,
        pageSize: this.pageSize,
        pageNumber: this.currentPage,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0],
        startTime: this.monitorTimeAry[0],
        endTime: this.monitorTimeAry[1]
      }
      // return this.getCategoryApi(params);
    },
    handlerBatchUrl(type) {
      if (type) {
        this.onExportUrl({
          imgIds: this.$refs.multipleTable.selection.map(el => el.imgId)
        })
        return
      }
      if (
        this.$refs.uploadImg &&
        this.activeName == 1 &&
        this.$refs.uploadImg.checkList.length > 0 &&
        this.$refs.uploadImg.checkList1.some(el => el.imgFolderId)
      ) {
        this.exportDialog = true
      } else if (
        this.$refs.uploadImg &&
        this.activeName == 1 &&
        this.$refs.uploadImg.checkList.length > 0 &&
        this.$refs.uploadImg.checkList1.every(el => el.imgId)
      ) {
        this.onExportUrl({
          imgIds: this.$refs.uploadImg.checkList
        })
      } else {
        this.$confirm(
          '此操作将导出当前目录下的所有图片路径，是否继续？',
          '警告',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(res => {
            this.onExportUrl({
              flag: 1, // 下级
              imgIds: [],
              imgFolderIds: [
                this.currentFolder[this.currentFolder.length - 1].key
              ]
            })
          })
          .catch(err => {})
      }
    },
    // 批量导出URL
    onExportUrl(data) {
      console.log(data)
      if (!data) {
        let imgIds = this.$refs.uploadImg.checkList1
          .filter(el => el.imgId != null)
          .map(el => el.imgId)
        let imgFolderIds = this.$refs.uploadImg.checkList1
          .filter(el => el.imgFolderId != null)
          .map(el => el.imgFolderId)
        data = {
          flag: this.formExport.checked ? 1 : 0,
          imgIds,
          imgFolderIds
        }
      }

      this.$axios({
        method: 'post',
        url: '/Img/exportData',
        data,
        responseType: 'blob'
      })
        .then(res => {
          if (res.data && res.data.code && res.data.code === 500) {
            this.$message('error', res.data.msg)
            return
          }
          let a = document.createElement('a')
          let url = window.URL.createObjectURL(new Blob([res.data]))
          a.href = url
          a.setAttribute('download', 'Url列表.xlsx')
          a.click()
          window.URL.revokeObjectURL(a.href)
          this.exportDialog = false
        })
        .catch(function(error) {
          // console.log(error);
        })
    },

    //删除目录todom
    deleteSubmit() {
      let dataList = this.$refs.tree.getCheckedNodes()
      // console.log(dataList, "999");
      dataList.forEach(item => {
        this.deleteListSelects.push(item.imgFolderId)
      })

      this.$axios
        .post('/ImgFolder/remove', {
          imgFolderIds: dataList.map(el => el.imgFolderId)
        })
        .then(res => {
          if (res.data.code == 0) {
            this.currentFolder = [
              {
                id: 0,
                name: '根目录'
              }
            ]
            this.findFolderById({ id: 0 })
            this.getflowApi()
            let ids = dataList.map(el => el.imgFolderId)
            let vm = this

            this.folderList.forEach((el, index) => {
              if (el.imgFolderId != null) {
                if (ids.indexOf(el.imgFolderId) > -1) {
                  vm.folderList.splice(index, 1)
                }
              }
            })

            //成功返回的数据
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.deleteDialog = false

            let deleteDataList = []
            this.getCategorList() //图片目录列表
            return
          }
        })
    },
    // handleCheckChange(data, checked, indeterminate) {
    //   console.log(123);
    //   this.$refs.tree.setChecked(data.imgFolderId, checked, true)
    // },
    handlerNodeClickDel(data, checkedData) {
      console.log(data, checkedData)
      const { checkedKeys } = checkedData
      const { imgFolderId, recursionList } = data
      let _checked
      let vm = this

      function setKeys(arr, checked) {
        if (arr && arr.length > 0) {
          arr.forEach(el => {
            vm.$refs.tree.setChecked(el.imgFolderId, checked)
            if (el.recursionList && el.recursionList.length > 0) {
              setKeys(el.recursionList, checked)
            } else {
              return false
            }
          })
        }
      }
      if (checkedKeys.indexOf(imgFolderId) > -1) {
        _checked = true
      } else {
        _checked = false
      }
      setKeys(recursionList, _checked)
    },

    //批量上传图片todo
    async startUpload(files) {
      let hasfile = files.filter(el => el.file).length !== 0

      if (!hasfile) {
        this.$message({
          type: 'info',
          message: '没有要上传的文件'
        })
        return
      }

      if (this.currentFolder.length == 1 || this.currentFolder.length == 0) {
        this.$message({
          type: 'info',
          message: '根目录下不能上传文件，请选择一个文件夹'
        })
        return
      } else {
        this.propgressLine = 0
        this.propgressLineStatus = null

        this.loading = true
        this.filesList = files
        // 遍历数组，拿到所有图片的尺寸，计算后总数传给后台
        let imgDataList = this.filesList
        let imgSizeNum = []

        imgDataList.forEach(item => {
          imgSizeNum.push(item.size)
        })
        // console.log(imgSizeNum, "这是所有图片尺寸的集合");
        let numSize = 0
        imgSizeNum.forEach(item => {
          numSize += item
        })
        // console.log(numSize, "和？");
        // let _params = numSize;
        this.$axios
          .post('/Img/judgementUpload', { imgSize: numSize })
          .then(res => {
            if (res.data.code !== 0) {
              this.$message.error(res.data.msg)
              return Promise.reject()
            }
          })
          .then(async () => {
            let x = this.filesList
            let imgRemarks = []
            x.forEach(item => {
              imgRemarks.push(item.remark)
            })

            imgRemarks = imgRemarks.map(item => {
              if (item == undefined) {
                return ''
              } else {
                return item
              }
            })
            this.imgRemarks = imgRemarks

            files = files.filter(el => el.file).map(el => el.file)

            let imgNameLists = []
            let imgTypeList = []
            let imgUploadTime = []
            let imgSizeLists = []

            let data = []
            // data["imgUploadTime"] = new Date();
            files.forEach((item, index) => {
              var name = item.name
              var type = name.substring(name.indexOf('.') + 1, name.length)
              let d = {
                imgName: item.name,
                imgSize: item.size,
                imgType: type
              }

              var f = item
              var reader = new FileReader()
              reader.onload = function(e) {
                var data = e.target.result
                //加载图片获取图片真实宽度和高度
                var image = new Image()
                image.onload = function() {
                  var width = image.width
                  var height = image.height

                  var size = width + 'x' + height
                  d['size'] = size
                  // 这里是弹出图片的宽高尺寸
                  // alert(width + "======" + height + "=====" + f.size);
                }
                image.src = data
              }
              reader.readAsDataURL(f)
              data[index] = d
            })
            this.dateList = data
            let formatTime = (time, cFormat) => {
              if (!time) {
                return null
              }
              time = new Date(time).getTime()
              if (arguments.length === 0) return null
              if ((time + '').length === 10) {
                time = +time * 1000
              }
              var format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}',
                date
              if (typeof time === 'object') {
                date = time
              } else {
                date = new Date(time)
              }
              var formatObj = {
                y: date.getFullYear(),
                m: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                i: date.getMinutes(),
                s: date.getSeconds(),
                a: date.getDay()
              }
              var time_str = format.replace(
                /{(y|m|d|h|i|s|a)+}/g,
                (result, key) => {
                  var value = formatObj[key]
                  if (key === 'a')
                    return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
                  if (result.length > 0 && value < 10) {
                    value = '0' + value
                  }
                  return value || 0
                }
              )

              return time_str
            }
            // }, //导出图片回调数据  返回后台
            // return;
            let total = files.length
            let cur = 0
            let vm = this
            // 获取dir
            // 上传
            // 请求后端入库
            let a = this.currentFolder
            let b = a
              .slice(1)
              .map(el => el.name)
              .join('/')

            let routes = b

            let params = {
              dir: routes,
              suffix: 'png'
            }
            let imgFolderIdList = params.routes
            this.imgFolderId = imgFolderIdList

            let res = await this.$axios.post('/Img/getDirs', params)
            if (res.data.code == 0) {
              vm.autograph = res.data.data

              let paths = null
              if (files.length > 1) {
                let _path = []
                for (let i = 0; i < files.length; i++) {
                  let _ary = []
                  _ary[0] = files[i]
                  let _temp = await oss.batchUpload(
                    _ary,
                    res.data.data,
                    paths => {
                      cur++
                      vm.propgressLine = +((cur / total) * 100).toFixed(0)
                    }
                  )
                  _path.push(_temp[0])
                }
                paths = _path
              } else {
                paths = await oss.batchUpload(files, res.data.data, paths => {
                  cur++
                  vm.propgressLine = +((cur / total) * 100).toFixed(0)
                })
              }

              const afterNum = this.currentCatalog[
                this.currentCatalog.length - 1
              ]

              const getCurrentTimeFormat = function() {
                var date = new Date()
                var seperator1 = '-'
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                var strDate = date.getDate()
                var hour = date.getHours()
                var minutes = date.getMinutes()
                var seconds = date.getSeconds()

                if (month >= 1 && month <= 9) {
                  month = '0' + month
                }
                if (strDate >= 0 && strDate <= 9) {
                  strDate = '0' + strDate
                }
                var currentdate =
                  year +
                  seperator1 +
                  month +
                  seperator1 +
                  strDate +
                  ' ' +
                  hour +
                  ':' +
                  minutes +
                  ':' +
                  seconds
                return currentdate
              }
              let dataList = []

              let hasLen = this.filesList.filter(el => el.has).length

              files.forEach((el, index) => {
                if (el.has) {
                  return false
                }
                dataList.push({
                  platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                    ','
                  )[0],
                  imgFolderId: this.currentFolder[this.currentFolder.length - 1]
                    .key,
                  imgUrl: paths[index],
                  imgUploadTime: getCurrentTimeFormat(),
                  imgName: el.name,
                  imgType: el.name.split('.')[el.name.split('.').length - 1],
                  imgSize: el.size,
                  size: data[index].size,
                  imgRemarks: this.imgRemarks[hasLen + index]
                })
              })

              vm.$axios.post('/Img/save', dataList).then(res => {
                this.loading = false
                if (res.data.code == 0) {
                  this.$message.success('上传成功')
                  let params = {
                    platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                      ','
                    )[0],
                    pageNumber: 1,
                    pageSize: 10,
                    imgFolderId: this.currentCatalog
                  }
                  this.imgSuccess.push(true)

                  this.getFolder(this.currentId, data => {
                    this.folderList = [
                      ...(data.imgFolder ? data.imgFolder : []),
                      ...(data.img ? data.img : [])
                    ]
                  })

                  // 设置容量
                  this.getflowApi()
                } else if (res.data.code === 500) {
                  this.$message.error(res.data.msg)
                  this.propgressLineStatus = 'exception'
                }
              })
            }
          })
          .catch(() => {
            this.$message.error('获取文件夹信息失败，请刷新后重试')
          })
      }
    },

    refresh(id) {
      this.refreshTree = false
      this.$nextTick(() => {
        this.refreshTree = true
        if (id != null) {
          this.$refs.treeMain.setCurrentKey(id)
        }
      })
    },
    // 添加目录提交
    addCatalogSubmit(parentId) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 不选择目录列表，默认创建父目录
          if (!this.form22.addcurrentCatalog.length) {
            let params = {
              platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                ','
              )[0],
              parentImgFolderId: Number(0),
              name: this.form22.currentCatalogName
            }

            this.$axios.post('/ImgFolder/save', params).then(res => {
              if (res.data.code == 500) {
                this.$message.error(res.data.msg)

                return
              }
              if (res.data.code == 0) {
                // this.getFolder(this.$refs.treeMain.getCurrentKey() || 0);
                this.refresh()
                // 获取目录
                this.getCategorList()
                this.addCatalog = false
                // this.getCategorList(); //图片目录列表
              }
            })
          } else {
            // 选择父目录，创建子目录
            //取最后一位
            // const afterNum = this.addcurrentCatalog[
            //   this.addcurrentCatalog.length - 1
            // ];
            let params = {
              platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
                ','
              )[0],
              parentImgFolderId: this.form22.addcurrentCatalog.slice(0).pop(),
              name: this.form22.currentCatalogName
            }
            this.$axios.post('/ImgFolder/save', params).then(res => {
              if (res.data.code == 500) {
                this.$message.error(res.data.msg)

                return
              }
              if (res.data.code == 0) {
                // this.getFolder(this.$refs.treeMain.getCurrentKey() || 0);
                this.refresh()
                // 获取目录
                this.getCategorList()
                this.addCatalog = false
              }
            })
          }
        }
      })
    },

    // 获取预览模式下的目录
    getFolder(parentImgFolderId = 0, cb, platformId) {
      this.$axios
        .post('/ImgFolder/previewMode', {
          parentImgFolderId,
          platformId:
            platformId ||
            this.$store.state.common.savePlatformIdAndSiteId.split(',')[0]
        })
        .then(res => {
          this.loadingImgBox = false
          if (res.data.code !== 0) {
            this.folderList = []
            this.$message({
              message: res.data.msg,
              type: 'error'
            })
            return
          }
          if (cb) {
            cb(res.data.data)
          } else {
            if (this.isRoot) {
              this.folderList = [
                ...(res.data.data.imgFolder ? res.data.data.imgFolder : []),
                ...(res.data.data.img ? res.data.data.img : [])
              ]
            } else {
              this.folderList = [
                // {
                //   name: "返回上一级",
                //   key: parentImgFolderId,
                //   imgFolderId: -1,
                //   platformId:
                //     platformId || this.$store.state.common.savePlatformIdAndSiteId.split("," )[0]
                // },
                ...(res.data.data.imgFolder ? res.data.data.imgFolder : []),
                ...(res.data.data.img ? res.data.data.img : [])
              ]
            }
          }
        })
    },

    //获取图片目录列表
    getCategorList() {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0],
        pageNumber: 1,
        pageSize: 100
      }
      this.$axios.post('/ImgFolder/list', params).then(res => {
        if (res.data.code == 0) {
          this.skuListw = res.data.data

          let nameList = []
          let imgFolderId = []
          let nameNew = this.skuListw
          nameNew.forEach(item => {
            nameList.push(item.name)
            imgFolderId.push(item.imgFolderId)
            this.imgFolderId = item.imgFolderId
          })
          // console.log(imgFolderId, "目录ID");
          // console.log(nameList, "名字");

          if (this.nameList == this.currentCatalog) {
            // console.log(this.skuListw.imgFolderId, "当前ID>???");
          }

          this.findFolderById({ id: this.currentId, notF: true })

          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 展开子目录
    // expandAndCur(id) {},
    //  添加目录的获取目录
    getFatherCatalogList(cb) {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0],
        pageNumber: 1,
        pageSize: 100
      }
      this.$axios.post('/ImgFolder/list', params).then(res => {
        if (res.data.code == 0) {
          // console.log("object");
          this.fatherCatalogList = res.data.data
          cb()
          // console.log(this.fatherCatalogList, "天涯");
          // console.log(this.skuList, "4545");
        } else if (res.data.code == 500) {
          this.$message.error(res.data.msg)
        }
      })
    },
    //删除
    onaDelete() {
      let vm = this
      this.deleteDialog = true
      this.$nextTick(() => {
        debugger
        setTimeout(() => {
          this.$refs.tree.setCheckedKeys(
            this.currentFolder.slice(0).pop().key,
            true
          )
        }, 1000)
      })
    },

    // ...mapActions("imgUpload", ["getImgsListsApi"]),
    ...mapMutations('imgUpload', {
      setWordList: 'imgsList'
    }),
    //搜索
    searchImgList() {
      this.recordSearch()
    },
    recordSearch(imgListName, reset) {
      let imgFolderId = imgListName != null ? imgListName : this.currentId || 0
      if (imgFolderId == 0) {
        // this.$message({
        //   type: "info",
        //   message: "目录不能为根目录"
        // });
        this.total = 0
        this.getImgListsData = []
        this.loadingImgBox = false
        return
      }

      if (reset) {
        this.searchParams.pageSize = 10
        this.searchParams.pageNumber = 1
      }

      let _params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ','
        )[0],
        pageNumber: 1,
        pageSize: 10,
        imgFolderId,
        ...this.searchParams
      }

      _params = this.$.dealObjectValue(_params)

      this.$axios.post('/Img/list', _params).then(res => {
        this.loadingImgBox = false
        if (res.data.code == 500) {
          this.$message.error(res.data.msg)
          return
        }
        if (res.data.rows.length) {
          this.currentPage = res.data.pageNo
          this.pageSize = res.data.pageSize
          this.total = res.data.total
          this.getImgListsData = res.data.rows
          return
        }
        if (!res.data.rows.length) {
          this.getImgListsData = []
          this.total = 0
          // this.$message.error("未查询到相关的数据");
        }
      })
    },
    //删除
    deleteData(scope) {
      // console.log(scope);
      this.$confirm('此操作将删除该项, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios
            .post('/Img/remove', { imgIds: [scope.row.imgId] })
            .then(res => {
              if (res.data.code == 0) {
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                })
                this.getImgListsData.splice(scope.$index, 1)

                // this.getImgsListsApi();
                // this.imgIdList = [];
                return
              }
            })
        })
        .catch(() => {})
    },
    // table选中
    handleSelectionChange(val) {
      this.userSelect = val //返回选中信息的数据
      this.userSelect.forEach(item => {
        this.imgIdList.push(item.imgId)
        // console.log(this.imgIdList, "777777");
      })
      // console.log(val);
    },
    // table删除
    deleteRow(tableData) {
      // console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === '美国'))
      ) // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    // table的查看
    handleClick(index, rowDetail) {
      // console.log(index, rowDetail);
      this.$router.push({
        name: 'salesMonitoringSee',
        params: {
          id: index
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.___tooltip {
  display: flex;
}
.imgSpace .el-button--text {
  font-size: 12px;
  padding: 0 !important;
}
.imgSpace {
  .tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
.formstyle {
  display: inline;
  margin-left: 100px;
}
.formStyle2 {
  margin-top: 20px;
  margin-left: 28px;
  width: 420px;
}
.dialog-footer {
  padding: 0 110px 0 150px;
}
.timeBox {
  position: relative;
}
.tabs__wrapper {
  height: 100%;
  .el-tab-pane {
    height: inherit;
  }
}
.timeStyImgSpace {
  position: fixed;
  display: inline;
  top: 61px;
  color: #777;
  font-size: 12px;
  white-space: nowrap;
  right: 72px;
  text-align: right;
}
.imgSpace {
  margin-top: 0 !important;
}
.main_wrapper {
  height: auto !important;
}
.paddingBobbtom {
  padding-bottom: 0;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
</style>
<style lang="scss">
.el-message-box__btns {
  .el-button--small {
    margin-right: 10px;
  }
}
.el-tabs__content {
  box-sizing: content-box;
}
.custom-tree-node {
  font-size: 12px;
  vertical-align: middle;
  img {
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
}
.imgSpace {
  .el-tabs--border-card > .el-tabs__content {
    height: 100%;
  }
}
</style>


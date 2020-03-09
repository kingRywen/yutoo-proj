<template>
  <div class="box" v-loading="loading">
    <el-row class="handle-template">
      <el-col :span="24">
        <!-- <el-tooltip content="添加关键词" placement="left-end" effect="light" v-show="filePopover"> -->
        <div content="添加关键词" placement="bottom-end" effect="light" v-show="filePopover">
          <el-button
            class="addkeywordBtn"
            type="text"
            icon="el-icon-circle-plus"
            @click="showDialog('ruleForm')"
            style="margin-right:10px;"
          >添加关键词</el-button>
        </div>

        <!-- v-show="!noData" -->
        <el-popover placement="right" width="270" v-model="setImgNum" @hide="handleShowImgNum">
          <div class="flex">
            <el-input size="mini" placeholder="请输入1~30的数字" v-model.number="imgNum" style="margin-right:6px; flex:1">
              <template slot="append">张</template>
            </el-input>
            <el-button
              size="mini"
              type="primary"
              @click="setNum"
              :loading="$store.state.isloading || $store.state.loading"
            >确认</el-button>
          </div>
          <!-- <el-tooltip slot="reference" content="图片缓存设置" placement="bottom-end" effect="light"> -->
          <div slot="reference">
            <el-button type="text" icon="el-icon-setting" style="margin-right:10px;">图片缓存设置</el-button>
          </div>
          <!-- </el-tooltip> -->
        </el-popover>

        <!-- <el-popover placement="right" width="170" v-model="popoverImgCache" v-show="filePopover"> -->
        <el-button type="text" icon="el-icon-upload" @click="uploadOptions.visible = true" v-if="exportBtnDShow">导入关键词</el-button>
        <a v-show="false" ref="exportExcel"></a>
      </el-col>
    </el-row>

    <div v-if="!noData" class="wrapper">
      <el-row type="flex">
        <el-col :span="6">
          <el-button
            class="keyword-textbtn"
            type="text"
            v-for="item in resData.data.keywordText.split(' ')"
            @click="addKeyword(item)"
            :style="{color: allSetKeywords.indexOf(item) > -1 ? '#333' : null}"
          >{{item}}</el-button>
        </el-col>
        <el-col :span="18">
          <!-- <el-button type="primary" plain size="mini" @click="updateKeywordStatus('VALID_UNION','相关词')">相关词(W)</el-button>
          <el-button type="primary" plain size="mini" @click="updateKeywordStatus('INVALID_EXACT','精确否定')">精确否定(E)</el-button>
          <el-button type="primary" plain size="mini" @click="updateKeywordStatus('INVALID','词组否定')">词组否定(R)</el-button>-->

          <el-button type="primary" plain size="mini" @click="copyText">复制关键词</el-button>
          <el-button type="primary" plain size="mini" @click="translateTextBtn" :loading="translateTextBtnLoading">翻译</el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="changeVal(btnTxt2)"
            :disabled="changeValLoading"
          >{{btnTxt2}}</el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            v-if="btnTxt3!==null"
            @click="changeVal(btnTxt3)"
            :disabled="changeValLoading"
          >{{btnTxt3}}</el-button>

          <el-button type="primary" plain size="mini" @click="revokeScreen" :disabled="!revokeKeywords.length">撤销筛选(DEL)</el-button>
          <!-- <el-dropdown v-else style="margin-left: 10px;" key="el-dropdown" @command="handleCommand">
            <el-button type="primary" plain size="mini">
              {{btnTxt3}}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="INVALID_EXACT">精准否定</el-dropdown-item>
              <el-dropdown-item command="INVALID">词组否定</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </el-col>
      </el-row>
      <div style="color:rgb(16, 142, 233);">{{translateText}}</div>
      <el-row>
        <el-col :span="6">
          <draggable v-model="draggableList" @start="drag=true" @end="drag=false" class="draggable">
            <!-- <el-button type="text" v-for="item in draggableList" @click="addKeyword(item)">{{item}}</el-button> -->
            <el-button type="text" v-for="item in draggableList" @click="addKeyword(item)">{{item}}</el-button>
          </draggable>&nbsp;
        </el-col>
        <el-col :span="18">
          <div v-show="draggableList.length>0">
            <el-button type="primary" plain size="mini" @click="clearDraggable">清空(C)</el-button>
            <el-button type="primary" plain size="mini" @click="addKeywordRoot(4,'加入有效词根')">有效词根(A)</el-button>
            <!-- <el-button type="primary" plain size="mini" @click="addKeywordRoot(1,'加入无效词根')">无效词根(S)</el-button> -->
            <el-button type="primary" plain size="mini" @click="addKeywordRoot(2,'加入词组无效词根')">词组无效词根(S)</el-button>
            <el-button type="primary" plain size="mini" @click="addKeywordRoot(1,'加入精准无效词根')">精准无效词根(D)</el-button>
            <el-button type="primary" plain size="mini" @click="addKeywordRoot(3,'加入绝对无效词根')" style="margin-top:10px;">绝对无效词根(F)</el-button>
			<el-button type="primary" plain size="mini" @click="addKeywordRoot(5,'加入可布局品牌词')" style="margin-top:10px;">可布局品牌词(G)</el-button>
			<el-button type="primary" plain size="mini" @click="addKeywordRoot(6,'加入仅广告品牌词')" style="margin-top:10px;">仅广告品牌词(H)</el-button>
			<el-button type="primary" plain size="mini" @click="showDialogMethod" style="margin-top:10px;" >分类属性</el-button>
          </div>
        </el-col>
      </el-row>

      <div class="key-row-1">
        <div class="column-1">有效词根</div>
        <div class="column-2">{{resData.valid.join('; ')}}</div>
      </div>
      <div class="key-row-2">
        <div class="column-1">无效词根</div>
        <div class="column-2">{{resData.invalid.join('; ')}}</div>
      </div>
      <div
        style="display:flex;justify-content:flex-end;margin-top:10px;"
      >{{revokeSelfKeywords.length + deletedLength}}/{{totalLength}}</div>
      <div>
        <div>
          <div :key="resData.data.keywordId">
            <div v-if="showImgUrls.length>0" class="img-flex-comnt">
              <div v-for="item in showImgUrls" :key="item.sku" class="img-flex-item">
                <div class="img-div">
                  <img :key="item.imageUrl" class="item-img loadingImg" v-lazy="item.imageUrl" />
                </div>
                <el-tooltip :content="item.title" placement="top" effect="light">
                  <p class="p1">{{item.title}}</p>
                </el-tooltip>
              </div>
            </div>
            <div
              v-if="!(showImgUrls.length>0)"
              style="width:100%;text-align: center;color: #909399;font-size: 14px;"
            >暂无缓存图片</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else="noData" class="no-data" style="height: 100vh;margin-right:10px;font-size:18px;">
      <div style="margin-bottom: 10px;" v-if="revokeKeywords.length">
        <el-button type="primary" plain size="mini" @click="revokeScreen" :disabled="!revokeKeywords.length">撤销筛选(DEL)</el-button>
      </div>
      <div style="line-height:60vh">暂无数据</div>
    </div>

    <yt-dialog :options="uploadOptions" :events="uploadEvents" class="upload-dialog">
      <ImportFile
        @success="handleSuccess"
        filename="导入关键词模板"
        :downloadApi="downloadApi"
        :data="downloadData"
        :action="action"
      />
      <!-- <el-upload
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleFileChange"
        :file-list="fileList"
        :on-remove="handleFileRemove"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="mini" type="primary" plain>选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只支持xlsx,xls格式，文件不超过2M</div>
      </el-upload>-->
    </yt-dialog>

    <el-dialog title="添加关键词" :visible.sync="dialogVisible" width="500px" class="Key-words-dialog customDialog">
      <el-form size="small" :model="ruleForm" ref="ruleForm" label-width="90px" class="pad10">
        <el-form-item
          label="添加来源:"
          prop="source"
          :rules="[
            { required: true, message: '添加来源不能为空'},
          ]"
        >
          <el-select class="w100" v-model="ruleForm.source" placeholder="请选择" size="mini">
            <el-option v-for="item in sourceList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词:" prop="keywords" :rules="keywordsRules">
          <el-input type="textarea" v-model.trim="ruleForm.keywords" :rows="5" placeholder='请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号'
          ></el-input>
        </el-form-item>
		<el-form-item>
			<div class='word-length' v-if="keywordNum<=500">
			    限制500个,已输入{{keywordNum}}个
			</div>
			<div class='word-length' v-else style="color: red;">
			    您已输入超过500个关键词!已输入{{keywordNum}}个
			</div>
		</el-form-item>
				
      </el-form>
      <div slot="footer" class="txc">
        <el-button
          type="primary"
          @click="submitKeyWords('ruleForm')"
          size="small"
          :loading="$store.state.isloading || $store.state.loading"
        >确定</el-button>
        <el-button size="small" type="primary" plain @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import testData from './test';
import draggable from 'vuedraggable'
import storage from 'Utils/saver'
import { debounce } from 'throttle-debounce'
import _ from 'lodash'
import { CONST_PORT_CONFIG, host } from 'Config'
const { BASE_URL } = CONST_PORT_CONFIG
export default {
  components: {
    draggable
  },
  props: ['pParams'],
  data() {
    let keywordsValidator = (rule, value, callback) => {
      if (value === '' || !value) {
        return callback(new Error('请输入关键词,一行一个'))
      }
      // let paramMap = _.compact(value.split('\n'))
      // paramMap = _.uniq(paramMap)
      // let _test = /^b[0-9A-Za-z]{9}$/ ;
      // if(
      //   !paramMap.every(i=>{
      //   return _test.test(i)
      // })
      // ){
      //    return callback(new Error('请正确输入关键词,一行一个'));
      // };
      // paramMap = paramMap.filter(i=>{
      //   return _test.test(i)
      // });
      // if(paramMap.length > 500){
      //   return callback(new Error('500个之内'));
      // }
      callback()
    }
    return {
      deletedLength: 0,
      // 已经加载过图片的关键词
      imgHasLoaded: [],
      // 队列中的关键词
      keywordList: [],
      // 已经筛选过的图片集合,有效无效筛选都会进入这个对象， 如果撤销筛选，则把对应的图片推到未筛选图片中
      hasSelectImg: {},
      downloadApi: 'categoryKeywordDownloadFile',
      // action: `${host}keywordClassify/importData`,
      setImgNum: false,
      imgNum: 10,
      settedImgNums: 10,
      currentWidth: null,
      loading: false,
      noData: false,
      popoverImgCache: false,
      filePopover: false,

      revokeKeywords: [],

      listQuery: {
        // sortOrder: "asc",
        sellerId: null,
        siteId: null,
        cusCateId: null, //92
        productId: null, //6887
        keywordType: null
      },
      resData: {
        data: null,
        imageUrls: [],
        invalid: [],
        valid: []
      },
      draggableList: [],
      sourceList: [],
      uploadOptions: {
        visible: false,
        width: '500px',
        title: '数据导入',
        okBtnText: '上传',
        showFooter: false
      },
      uploadEvents: {
        handleOkClick: () => {
          this.submitUploadForm()
        }
      },
      // sourceForm: {
      //   source: null
      // },
      fileList: [],

      btnTxt2: '开始筛选',
      btnTxt3: null,
      dialogVisible: false,
      ruleForm: {
        siteId: null,
        sellerId: null,
        cusCateId: null,
        productId: null,
        source: null,
        keywords: null
      },
      revokeScreenIds: [],
      revokeScreenBtn: true,

      total: null, //后台返回的未筛选的数量
      totalLength: null, //总数

      imgLoaded: false,
      imgLoadedLoading: false,

      keywordsRules: [
        { required: true, validator: keywordsValidator, trigger: 'blur' }
      ],

      translateText: '', //翻译的文本
      translateTextBtnLoading: false, //翻译文本按钮的loading

      changeValLoading: false //筛选按钮的loading
    }
  },
  watch: {
    'resData.data.keywordText'() {
      // console.log(111);
      
      this.clearTran()
    },
    sellerId() {
      // 切换店铺时需要把缓存的数据清掉
      this.resetStaData()
    },
    currentWidth(val) {
      // console.log(val)
      if (val <= 1280) {
        this.$emit('setMenuClose', false)
      } else {
        this.$emit('setMenuClose', true)
      }
    },
    'pParams.type'(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId
      if (newP === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
      }
      this.getList(1)
      this.revokeScreenIds = []
    },
    'pParams.treeId'(newP, oldP) {
      console.log('treeId');
      this.resetStaData()
      storage.set(
        'session',
        this.pParams.treeId === 40 ? 'revokeKeywords_next' : 'revokeKeywords',
        []
      ) // sessionStorage.removeItem("revokeScreenIds");
      ;(this.btnTxt2 = '开始筛选'),
        (this.btnTxt3 = null),
        (this.listQuery.cusCateId = this.pParams.cusCateId)
      let type = this.pParams.type
      if (type === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
      }

      if (newP == 18) {
        //上架
        this.listQuery.keywordType = 'PUBLISH'

        // this.filePopover = true;
      } else if (newP == 40) {
        //广告

        let type = this.pParams.type
        if (type === 'category') {
          this.listQuery.keywordType = 'ADVERT'
        } else {
          this.listQuery.keywordType = 'PRODUCT'
        }
        // this.filePopover = false;
      }
      this.getList(1)
      this.revokeScreenIds = []
    },
    'pParams.cusCateId'(newP, oldP) {
      this.translateText = ''
      this.resetStaData()
      storage.set(
        'session',
        this.pParams.treeId === 40 ? 'revokeKeywords_next' : 'revokeKeywords',
        []
      )

      let type = this.pParams.type
      this.listQuery.cusCateId = newP
      if (type === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
      }
      this.getList(1)
      this.revokeScreenIds = []
    },
    'pParams.productId'(newP, oldP) {
      this.resetStaData()
      storage.set(
        'session',
        this.pParams.treeId === 40 ? 'revokeKeywords_next' : 'revokeKeywords',
        []
      )
      let type = this.pParams.type
      this.listQuery.cusCateId = this.pParams.cusCateId
      if (type === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = newP
      }
      this.getList(1)
      this.revokeScreenIds = []
    },
    revokeScreenIds(newP, oldP) {
      if (newP.length === 0) {
        this.revokeScreenBtn = true
      } else {
        this.revokeScreenBtn = false
      }
    },
    sellerData() {
      this.listQuery.siteId = this.siteId
      this.listQuery.sellerId = this.sellerId
    }
  },
  created() {
    // sessionStorage.removeItem("revokeScreenIds");

    // sessionStorage.setItem("revokeScreenIds", ids.toString());
    // let revokeScreenIds =sessionStorage.getItem("revokeScreenIds")
    // if(revokeScreenIds!==null){
    //   console.log("********************")
    //   console.log(revokeScreenIds.split(','))
    // }

    // this.resetStaData()

    if (this.sellerId && this.siteId) {
      this.listQuery.siteId = this.siteId
      this.listQuery.sellerId = this.sellerId
    }

    let imgNum = storage.get('local', 'imgNum')
    if (imgNum) {
      this.imgNum = this.settedImgNums = +imgNum
    }

    // let revokeKeywords = this.pParams.treeId === 40 ? storage.get('session', 'revokeKeywords_next') : storage.get('session', 'revokeKeywords')
    // this.revokeKeywords = revokeKeywords || []

    this.currentWidth =
      document.body.clientWidth || document.documentElement.clientWidth
    //console.log(debounce)
    this.handleResize = debounce(300, () => {
      this.currentWidth =
        document.body.clientWidth || document.documentElement.clientWidth
    })
    window.onresize = this.handleResize

    this.listQuery.cusCateId = this.pParams.cusCateId
    if (this.pParams.type === 'category') {
      this.listQuery.productId = null
    } else {
      let productId = this.pParams.productId
      this.listQuery.productId = productId
    }
    let treeId = this.pParams.treeId
    let type = this.pParams.type
    if (treeId == 18) {
      //上架
      this.listQuery.keywordType = 'PUBLISH'
      // this.filePopover = true;
    } else if (treeId == 40) {
      //广告
      if (type === 'category') {
        this.listQuery.keywordType = 'ADVERT'
      } else {
        this.listQuery.keywordType = 'PRODUCT'
      }
      // this.filePopover = false;
    }
    if (type === 'category') {
      if (this.pParams.treeId === 18) {
        this.filePopover = true
      } else {
        this.filePopover = false
      }
    } else {
      this.filePopover = true
    }
    this.getList(1)
    this.getSource()
  },
  mounted() {
    this.__event = event => this.bindKey(event)
    document.addEventListener('keydown', this.__event)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.__event)
    this.__event = null
    window.onresize = null
    this.handleResize = null
  },
  computed: {
	keywordNum(){
		return this.ruleForm.keywords && this.ruleForm.keywords.split(/[\n|\r\n|\,|\，]/)
		.map(el => el.trim())
		.filter(el => el !== '').length || 0;
	},
    exportBtnDShow() {
      //console.log(this.pParams.treeId);
      return this.pParams.treeId === 40 && this.pParams.type === 'category'
        ? false
        : true
    },
    downloadData() {
      let params = {
        ...this.storeIds,
        cusCateId: this.listQuery.cusCateId,
        productId: this.listQuery.productId,
        source: 'OTHER'
      }
      if (this.listQuery.productId === null) {
        delete params.productId
      }
      // 以前 categoryKeywordImportData
      // let apiName = 'categoryKeywordImportData'
      // if (this.listQuery.keywordType === 'PRODUCT') {
      //   apiName = 'categoryKeywordImportAdData'
      // }
      return params
    },
    // downloadApi() {
    //   // return this.listQuery.keywordType === 'PRODUCT' ? 'categoryKeywordImportAdData' : 'categoryKeywordImportData'
    // },
    action() {
      return (
        host +
        (this.listQuery.keywordType === 'PUBLISH'
          ? 'categoryKeyword/importData'
          : 'categoryKeyword/importAdData')
      )
    },
    showImgUrls() {
      let keyword = this.resData.data && this.resData.data.keywordText
      return this.resData.imageUrls
        .filter(el => el.keyword === keyword)
        .slice(0, this.settedImgNums)
    },
    //得到已筛选的
    revokeSelfKeywords() {
      // siteId: this.pParams.siteId,
      //   cusCateId: this.pParams.cusCateId,
      //   productId: this.pParams.productId,
      //   keywordType: this.listQuery.keywordType,
      //   keywordId: params.keywordId
      return this.revokeKeywords.filter(
        el =>
          el.siteId === this.pParams.siteId &&
          el.cusCateId === this.pParams.cusCateId &&
          el.productId === this.pParams.productId &&
          el.keywordType === this.listQuery.keywordType
      )
    },
    allSetKeywords() {
      let { invalid, valid, keywordText } = this.resData.data

      let arr = [...invalid, ...valid]
      let all = []
      arr.forEach(str => {
        if (keywordText.indexOf(str) > -1) {
          str = str.split(' ')
          all = all.concat(str)
        } else {
          all.push(str)
        }
      })
      all = [...new Set(all)]
      return all
    }
  },
  methods: {
	//分类属性
	showDialogMethod(){
		this._openDialog({
			title:'分类属性',
			width: '1200px',
			params: {
				params:{
					cusCateId: this.listQuery.cusCateId,
					productId: this.listQuery.productId,
					classifyText:[this.draggableList.slice(0).join(' ')]
				}
			},
			component: () => import('Views/KeyLexicon/KeyLexicon/dialog/addClass.vue'),
			okBtnText:'确认',
			cancelBtnText:'取消'
		})
	},
    //翻译
    translateTextBtn() {
      //console.log(this.resData.data.keywordText);
      //return
      this.translateTextBtnLoading = true
      this.$api['categoryKeywordTranslateToChines']({
        keywordText: this.resData.data.keywordText
      })
        .then(data => {
          //console.log(data);
          this.translateTextBtnLoading = false
          this.translateText = data.data
        })
        .catch(() => {
          this.translateTextBtnLoading = false
        })
    },
    //导入模板成功
    handleSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.uploadOptions.visible = false
        this.getList()
      }
    },
    //关键词的操作按钮
    changeVal(btnTxt) {
      switch (btnTxt) {
        case '开始筛选':
          this.btnTxt2 = '有效(W)'
          this.btnTxt3 = '无效(E)'
          break
        case '有效(W)':
          // this.btnTxt2='开始筛选'
          // this.btnTxt3=null
          this.translateText = ''
          this.updateKeywordStatus('VALID_UNION', '相关词')
          break
        case '无效(E)':
          // this.btnTxt2='开始筛选'
          // this.btnTxt3=null
          this.translateText = ''
          this.updateKeywordStatus('INVALID_EXACT', '精准否定')
          break
        case '撤销筛选':
          this.translateText = ''
          this.revokeScreen()
          break
      }
    },
    //保存设置缓存图片的数量
    handleShowImgNum() {
      this.imgNum = storage.get('local', 'imgNum')
    },
    //设置缓存图片的数量
    setNum() {
      if (
        Number.isInteger(this.imgNum) &&
        this.imgNum >= 1 &&
        this.imgNum <= 30
      ) {
        storage.set('local', 'imgNum', this.imgNum)
        this.settedImgNums = this.imgNum
        this.$message.success('设置成功')
        this.setImgNum = false
      } else {
        this.$message.warning('请输入1-30之间的正整数')
      }
    },
    addKeyword(word) {
      if (this.draggableList.indexOf(word) === -1) {
        this.draggableList.push(word)
      } else {
        this.draggableList = _.remove(this.draggableList, function(n) {
          return n !== word
        })
      }
    },
    clearDraggable() {
      this.draggableList = []
    },
    getSource() {
      this.$api['categoryKeywordGetSource']().then(res => {
        let { code, data } = res
        if (code === 0) {
          this.sourceList = data
        }
      })
    },
    handleCommand(command) {
      let title = null
      if (command === 'INVALID_EXACT') {
        title = '精确否定'
      } else if (command === 'INVALID') {
        title = '词组否定'
      } else {
        return
      }
      this.updateKeywordStatus(command, title)
    },
    clearTran() {
      this.translateText = ''
    },
    //获取数据
    getList(flag, noloading, reload) {
      this.noloading = noloading
      if (!noloading) {
        this.noData = true
        this.loading = true
      }

      this.$api['categoryKeywordGetFilterKeyword']({
        ...this.listQuery,
        flag
      })
        .then(res => {
          this.noloading = false
          this.loading = false
          let { code, msg, data, imageUrls, total } = res

          if (code === 0) {
            if (msg === '暂无数据') {
              this.noData = true
            } else {
              //total 是后台返回的未筛选的数量
              this.total = total
              this.totalLength = total + this.revokeKeywords.length //总数是已筛选的加上自己记录筛选的数量
              this.noData = false
              // 去重关键词后合并
              if (reload) {
                this.keywordList = []
              }
              data.forEach(el => {
                if (
                  !this.keywordList.find(
                    _el => _el.keywordText === el.keywordText
                  )
                ) {
                  this.keywordList.push(el)
                }
              })
              
              // this.keywordList = data
              this.handleImg(imageUrls, this.keywordList[0])

              // let preLoads = this.resData.imageUrls.filter(
              //   el => keywords.indexOf(el.keyword) > -1
              // )

              // console.log(keywords, '关键词')

              // console.log(preLoads)

              // let imgOne = new Image();
              // imgOne.src= preLoads[0].imageUrl;
            }
          } else {
            this.loading = false
            this.noData = true
          }
        })
        .catch(res => {
          console.log(res)
          this.loading = false
          this.noData = true
        })
    },
    handleImg(imageUrls = [], data = {}, noloading, set) {
      // console.log(imageUrls, data)
      // if (reload) {
      //   this.keywordList = []
      // }

      let { invalid, valid } = data || {}
      this.resData.data = data
      this.resData.invalid = invalid
      this.resData.valid = valid

      if (set) {
        this.resData.imageUrls = imageUrls
      } else {
        this.resData.imageUrls = [
          ...new Set(this.resData.imageUrls.concat(...(imageUrls || [])))
        ]
      }

      let keywords = this.keywordList
        .slice(0, 5)
        .filter(el => this.imgHasLoaded.indexOf(el.keywordText) === -1)
        .map(el => el.keywordText)
      let preLoads = [] //找出关键词对应的图片
      keywords.forEach(word => {
        // debugger
        let arr = this.resData.imageUrls
          .filter(el => word === el.keyword)
          .slice(0, this.imgNum)
        preLoads = preLoads.concat(arr)
      })

      //加载图片
      !noloading && (this.imgLoadedLoading = true)
      let vm = this
      this.$nextTick(function() {
        let promiseAll = preLoads.map(
          el =>
            new Promise((resolve, reject) => {
              let _img = new Image()
              _img.onload = () => {
                resolve()
              }
              _img.onerror = () => {
                resolve()
              }
              _img.src = el.imageUrl
            })
        )
        Promise.all(promiseAll)
          .then(() => {
            // 加载成功的图片剔除
            // this.resData.imageUrls = this.resData.imageUrls.filter(
            //   el => keywords.indexOf(el.keyword) === -1
            // )
            // 把加载成功的关键词标记
            vm.imgHasLoaded.push(...keywords)
            // 全部图片加载完成
            vm.imgLoaded = true
            vm.imgLoadedLoading = false
          })
          .catch(() => {
            vm.imgLoaded = true
            vm.imgLoadedLoading = false
          })
      })
    },
    updateKeywordStatus(keywordStatus) {
      let params = {
        keywordId: this.resData.data.keywordId,
        keywordStatus
      }

      this.changeValLoading = true

      this.$api['categoryKeywordUpdateStatus'](params)
        .then(res => {
          let { code } = res
          if (code === 0) {
            let selected = this.keywordList.shift()
            // 如果没有图片了，就把nodata开了
            if (!this.keywordList.length) {
              this.noData = true
            }
            //保存当前筛选的图片
            let currentImgs = []
            currentImgs = this.resData.imageUrls.filter(
              el => el.keyword === this.resData.data.keywordText
            )
            this.hasSelectImg[params.keywordId] = currentImgs
            this.handleImg(
              this.resData.imageUrls.filter(
                el => el.keyword !== this.resData.data.keywordText
              ),
              this.keywordList[0],
              true,
              true
            )

            this.total--
            this.draggableList = []
            // 后台返回175张图片，如果剩 90张时，去请求图片，并塞到imgUrls中
            // console.log((this.resData.imageUrls && this.resData.imageUrls.length < 90) ? 1 : 0);

            //保存筛选过图片的id
            this.revokeScreenIds.unshift(params.keywordId)
            let _p = {
              siteId: this.pParams.siteId,
              cusCateId: this.pParams.cusCateId,
              productId: this.pParams.productId,
              keywordType: this.listQuery.keywordType,
              keywordId: params.keywordId,
              resData: selected
            }
            //保存筛选过图片的数据,如果数据大于50 shift掉开始的数据，最多只能保存50次撤销的数据
            if (this.revokeKeywords.length > 50) {
              let { resData = {} } = this.revokeKeywords.shift()
              // 过滤掉多余 的关键词图片
              this.resData.imageUrls = this.resData.imageUrls.filter(
                e => e.keyword !== resData.keywordText
              )
              this.deletedLength++
            }
            this.revokeKeywords.push(_p)
            console.log('增加撤销关键词')

            storage.set(
              'session',
              this.pParams.treeId === 40
                ? 'revokeKeywords_next'
                : 'revokeKeywords',
              this.revokeKeywords
            )

            //过滤筛选过的图片
            // this.resData.imageUrls = this.resData.imageUrls.filter(
            //   el => el.keyword !== this.resData.data.keywordText
            // )
            this.changeValLoading = false
            // 如果还存在不少于5个关键词，则不用请求后台拿关键词
            if (
              this.keywordList.length < 5 &&
              this.totalLength >= 5 &&
              this.totalLength >= this.revokeSelfKeywords.length + 5
            ) {
              setTimeout(() => {
                this.getList(1, true)
              })
            }
          } else {
            this.changeValLoading = false
          }
        })
        .catch(() => {
          this.changeValLoading = false
        })
    },
    //撤销筛选
    revokeScreen() {
      this.translateText = ''
      let revokeKeywords = this.revokeKeywords
      let params = revokeKeywords.pop()
      if (!params || !Object.keys(params).length) {
        return
      }
      this.revokeKeywordsLoading = true
      this.$api['categoryKeywordRevokeScreen'](params).then(res => {
        this.revokeKeywordsLoading = false
        let { code } = res
        if (code === 0) {
          this.noData = false
          this.keywordList.unshift(params.resData)
          // this.draggableList = []
          // // 撤销后把图片还原
          // // this.hasSelectImg[params.keywordId]
          this.resData.imageUrls.unshift(
            ...(this.hasSelectImg[params.keywordId] || [])
          )
          // 设置撤销之后的选择词为当前
          this.handleImg(null, params.resData)

          delete this.hasSelectImg[params.keywordId]
          storage.set(
            'session',
            this.pParams.treeId === 40
              ? 'revokeKeywords_next'
              : 'revokeKeywords',
            revokeKeywords
          )
          this.revokeKeywords = revokeKeywords
        }
      })
    },
    // handleKeywordStatusCommand(command){
    //     this.$confirm(`此操作将加入${command.title}, 是否继续?`, '提示', {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //     }).then(() => {
    //         let params ={
    //             keywordId:this.resData.data.keywordId,
    //             keywordStatus:command.status,
    //             source:command.source
    //         }
    //         this.$api['categoryKeywordUpdateStatus'](params).then(res => {
    //             let {code} =res
    //             if(code===0){
    //                 this.getList()
    //             }
    //         })
    //     })
    // },

    // 绑定快捷键
    bindKey(event) {
      const { keyCode } = event
      // 弹出输入框 禁止
      if (
        this.noloading ||
        this.noData ||
        this.dialogVisible ||
        this.setImgNum ||
        this.popoverImgCache ||
        this.uploadOptions.visible
      ) {
        return
      }
      if (
        (keyCode == 87 || keyCode == 69) &&
        (this.changeValLoading || this.btnTxt3 == null)
      ) {
        return
      }
      if (keyCode == 46 && this.revokeKeywordsLoading) {
        return
      }
      let actions1 = {
        87: {
          action: 'updateKeywordStatus',
          query: 'VALID_UNION'
        }, // 相关词
        69: {
          action: 'updateKeywordStatus',
          query: 'INVALID_EXACT'
        }, // 精准否定
        // 82: {
        //   action: "updateKeywordStatus",
        //   query: "INVALID"
        // }, // 词组否定

        65: {
          action: 'addKeywordRoot',
          query: 4
        }, // 有效词根
        83: {
          action: 'addKeywordRoot',
          query: 2
        }, // 加入词组无效词根
        68: {
          action: 'addKeywordRoot',
          query: 1
        }, // 加入精准无效词根
        70: {
          action: 'addKeywordRoot',
          query: 3
        }, // 加入绝对无效词根
		
		71: {
		  action: 'addKeywordRoot',
		  query: 5
		}, // 加入可布局品牌词
		72: {
		  action: 'addKeywordRoot',
		  query: 6
		}, // 加入仅广告品牌词
		

        // 清除 clearDraggable
        67: {
          action: 'clearDraggable'
        },
        // 撤销
        46: {
          action: 'revokeScreen'
        }
      }

      // console.log(event)
      let key1 = Object.keys(actions1)
      let index1 = Object.keys(actions1).indexOf(event.keyCode + '')
      let action_el = null
      if (index1 > -1) {
        action_el = actions1[key1[index1]]
      }

      if (action_el) {
        let { action, query } = action_el
        // 快捷键
        this[action](query)
      }
    },
    addKeywordRoot(rootType, title) {
      let treeId = this.pParams.treeId
      let repository = null
      if (treeId == 18) {
        //上架
        repository = 3
      } else if (treeId == 40) {
        //广告
        repository = 4
      }

      let rootTextArr = this.draggableList
      if (rootTextArr.length === 0) {
        this.$message.warning('关键词不能为空')
        return
      }
      if (repository === null) {
        this.$message.warning('词根归属的词库为空')
        return
      }
	  
	  //如果是加入品牌词的,要区分一下
	  if(rootType === 5 || rootType === 6){
		  let params = {
		    siteId: this.listQuery.siteId,
		    brandNames: [this.draggableList.slice(0).join(' ')],
		    cusCateId: this.listQuery.cusCateId,
		    productId: this.listQuery.productId,
		    brandType:rootType === 5 ? 2 : 1
		  }
		  this.draggableList = []
		  this.$api['brandSave'](params).then(res => {
		    let { code } = res
		    if (code === 0) {
		      this.draggableList = []
		      this.resetStaData()
		      this.getList(null, null, 1)
		    }
		  })
	  }else{
		  let params = {
		    siteId: this.listQuery.siteId,
		    rootText: [this.draggableList.slice(0).join(' ')],
		    cusCateId: this.listQuery.cusCateId,
		    productId: this.listQuery.productId,
		    repository,
		    rootType
		  }
		  this.draggableList = []
		  this.$api['keywordRootSave'](params).then(res => {
		    let { code } = res
		    if (code === 0) {
		      this.draggableList = []
		      this.resetStaData()
		      this.getList(null, null, 1)
		    }
		  })
	  }
	  
      
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleFileRemove(file) {
      this.fileList = []
    },
    submitUploadForm() {
      //
      if (this.fileList.length === 0) {
        this.$message.warning('请选择文件')
        return
      }
      // const isCSV = this.fileList[0].raw.type === "application/vnd.ms-excel";
      // const isZIP =
      //   this.fileList[0].raw.type === "application/x-zip-compressed";

      // if (!isCSV && !isZIP) {
      //   this.$message.warning("上传文件只能是 csv 或 zip 格式!");
      //   return;
      // }
      const isLt2M = this.fileList[0].raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 2MB!')
        return
      }
      // 后端的 @RestController 要改成 @Controller
      // source: this.sourceForm.source,
      let params = {
        siteId: this.listQuery.siteId,
        cusCateId: this.listQuery.cusCateId,
        productId: this.listQuery.productId,
        source: 'OTHER',
        file: this.fileList[0]
      }
      if (this.listQuery.productId === null) {
        delete params.productId
      }
      // 以前 categoryKeywordImportData
      let apiName = 'categoryKeywordImportData'
      if (this.listQuery.keywordType === 'PRODUCT') {
        apiName = 'categoryKeywordImportAdData'
      }

      this.$api[apiName](params).then(res => {
        let { code, msg } = res
        if (code === 0) {
          this.$message.success(msg)
          this.uploadOptions.visible = false
          this.draggableList = []
          this.getList()
        }
      })
    },
    downloadTemplate() {
      this.popoverImgCache = false
      this.$ajax({
        method: 'post',
        url: BASE_URL + 'categoryKeyword/downloadFile',
        responseType: 'blob'
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let a = this.$refs.exportExcel
          a.href = url
          a.setAttribute('download', '关键词模板.xlsx')
          a.click()
          window.URL.revokeObjectURL(url)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    showDialog(formName) {
      let form = this.$refs[formName]
      if (form !== undefined) {
        form.resetFields()
      }
      this.dialogVisible = true
    },
    submitKeyWords(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.siteId = this.listQuery.siteId
          this.ruleForm.sellerId = this.listQuery.sellerId
          this.ruleForm.cusCateId = this.listQuery.cusCateId
          this.ruleForm.productId = this.listQuery.productId
          let paramMap = _.cloneDeep(this.ruleForm)
          paramMap.keywords = _.compact(this.ruleForm.keywords.split('\n'))
          paramMap.keywords = _.uniq(paramMap.keywords)
          let _test = /^b[0-9A-Za-z]{9}$/
          paramMap.keywords = paramMap.keywords.filter(i => {
            return !_test.test(i)
          })
          if (!paramMap.keywords.length) {
            this.$message.warning('请正确输入关键词')
            return
          }
          // console.log(paramMap.keywords);
          // return
          let apiName = 'categoryKeywordSave' // 以前
          let p = this.pParams
          if (
            (p.type === 'category' || p.type === 'product') &&
            p.treeId === 18
          ) {
            apiName = 'categoryKeywordSaveDigKeyword'
          } else if (p.type === 'product' && p.treeId === 40) {
            apiName = 'categoryKeywordSaveAdKeyword'
          } else {
            return
          }

          this.$api[apiName](paramMap).then(res => {
            let { code } = res
            if (code === 0) {
              this.resetStaData()
              this.getList()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetStaData() {
      this.dialogVisible = false
      this.deletedLength = 0
      this.draggableList = []
      this.revokeKeywords = []
      this.hasSelectImg = {}
      this.imgHasLoaded = []
      this.keywordList = []
      storage.set(
        'session',
        this.pParams.treeId === 40 ? 'revokeKeywords_next' : 'revokeKeywords',
        []
      )
    },
    copyText() {
      this.$copyText(this.resData.data.keywordText).then(
        () => {
          this.$message.success('复制成功')
        },
        () => {
          this.$message.error('复制失败了')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.img-flex-comnt {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .img-flex-item {
    width: 16%;
    height: 300px;
    .img-div {
      width: 100%;
      overflow: hidden;
      height: 60%;
      .item-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    p {
      width: 90%;
      margin: 0 auto;
      text-align: center;
      margin-top: 10px;
    }
    .p1 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
.box {
  /deep/.addkeywordBtn {
    i {
      font-size: 16px;
    }
  }
  // border: 1px solid @borderColor;
  // margin-left: 10px;
  // padding: 10px;
  // height: 100%;
  min-height: 800px;
  height: auto;
  .handle-template {
    .el-col {
      display: flex;
      justify-content: flex-end;
    }
    /deep/.el-icon-setting,
    /deep/.el-icon-upload {
      font-size: 16px;
    }
  }
  // background-clip: #f5f5f5;

  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .key-row-1 {
    margin-top: 10px;
  }
  .key-row-1,
  .key-row-2 {
    display: flex;
    font-size: 12px;
    color: #606266;
    .column-1 {
      text-align: center;
      width: 150px;
      padding: 8px;
      font-weight: bold;
    }
    .column-2 {
      width: 100%;
      padding: 8px;
      border-left: 1px solid @borderColor;
    }
  }
  .key-row-1 {
    border: 1px solid @borderColor;
  }
  .key-row-2 {
    // border:1px solid @borderColor;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;
  }
  .no-data {
    text-align: center;
    color: #909399;
    font-size: 14px;
  }
  .Key-words-dialog {
    /deep/.el-dialog__header {
      border-bottom: 1px solid @borderColor;
    }
    /deep/.el-dialog__title {
      font-size: 18px;
    }

    .el-select {
      width: 360px;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}
.flex {
  display: flex;
  justify-content: center;
}
.upload-dialog {
  /deep/.el-upload {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .el-upload__tip {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
}
.keyword-textbtn {
  user-select: auto;
}
img.loadingImg[lazy='loaded'] {
  background: none !important;
}
</style>

<template>
  <div>
    <!-- 上面的待筛选关键词 start -->
    <div class="wrapper">
      <el-row type="flex">
        <el-col v-if="!noData" :span="6" class="wrapper--keyword">
          <el-button
            class="wrapper--keyword__textbtn textbtn"
            :class="{'disabled': allSetKeywords.indexOf(item) !== -1}"
            type="text"
            :key="index"
            v-for="(item, index) in data.keywordText.split(' ')"
            @click="addKeyword(item)"
          >{{item}}</el-button>
        </el-col>
        <el-col :span="6" v-else></el-col>
        <el-col :span="16">
          <template v-if="!noData">
            <el-button type="primary" plain size="mini" @click="copyKeyword">复制关键词</el-button>
            <el-button type="primary" plain size="mini" @click="translateKeyword" :loading="translateTextBtnLoading">翻译</el-button>
            <!-- <el-button type="primary" plain size="mini" v-show="!showScreenBtn" @click="showScreenBtn = true">开始筛选</!-->
            <el-button
              :disabled="$store.state.loading"
              type="primary"
              plain
              size="mini"
              @click="addKeywordValid('VALID')"
            >有效(W)</el-button>
            <el-button
              type="primary"
              :disabled="$store.state.loading"
              plain
              size="mini"
              @click="addKeywordValid('INVALID')"
            >无效(E)</el-button>
          </template>
          <el-button
            type="primary"
            plain
            size="mini"
            v-if="history.length"
            @click="revokeScreen"
            :disabled="!history.length || $store.state.loading"
          >撤销筛选(DEL)</el-button>
        </el-col>

        <div class="wrapper--setting">
          <el-tooltip content="添加关键词" placement="top">
            <el-button type="text" class="wrapper--setting__btn" plain icon="el-icon-plus" @click="addMore"></el-button>
          </el-tooltip>
          <el-tooltip content="导入关键词" placement="top">
            <el-button type="text" class="wrapper--setting__btn" plain icon="iconfont icondaoru" @click="imptKeyword"></el-button>
          </el-tooltip>
        </div>
      </el-row>
      <div style="color:rgb(16, 142, 233);font-size:12px;l">{{translateText}}&nbsp;</div>
      <el-row>
        <el-col :span="6" style="margin-top: 6px">
          <draggable v-model="draggableList" @start="drag=true" @end="drag=false" class="draggable">
            <el-button
              type="text"
              class="textbtn"
              v-for="item in draggableList"
              :key="item"
              @click="addKeyword(item)"
            >{{item}}</el-button>
          </draggable>&nbsp;
        </el-col>
        <el-col :span="18">
          <div v-show="draggableList.length>0">
            <el-button type="primary" plain size="mini" @click="clearDraggable">清空(C)</el-button>
            <el-button
              type="primary"
              :disabled="$store.state.loading"
              plain
              size="mini"
              @click="addKeywordRoot(4,'加入有效词根')"
            >有效词根(A)</el-button>
            <el-button
              type="primary"
              :disabled="$store.state.loading"
              plain
              size="mini"
              @click="addKeywordRoot(2,'加入词组无效词根')"
            >词组无效词根(S)</el-button>
            <el-button
              type="primary"
              :disabled="$store.state.loading"
              plain
              size="mini"
              @click="addKeywordRoot(1,'加入精准无效词根')"
            >精准无效词根(D)</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="$store.state.loading"
              @click="addKeywordRoot(3,'加入绝对无效词根')"
              style="margin-top:10px;"
            >绝对无效词根(F)</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="$store.state.loading"
              @click="addKeywordRoot(5,'加入可布局品牌词')"
              style="margin-top:10px;"
            >可布局品牌词(G)</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              :disabled="$store.state.loading"
              @click="addKeywordRoot(6,'加入仅广告品牌词')"
              style="margin-top:10px;"
            >仅广告品牌词(H)</el-button>
            <el-button type="primary" plain size="mini" @click="addProps" style="margin-top:10px;">分类属性</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 上面的待筛选关键词 end -->

    <template v-if="!noData">
      <!-- 词根表 start -->
      <div class="key-row-1">
        <div class="column-1">有效词根</div>
        <div class="column-2">{{data.valid.join('; ')}}</div>
      </div>
      <div class="key-row-2">
        <div class="column-1">无效词根</div>
        <div class="column-2">{{data.invalid.join('; ')}}</div>
      </div>
      <!-- 词根表 end -->
      <!-- 关键词计数 -->
      <div style="display:flex;justify-content:flex-end;margin-top:10px;font-size:12px">{{screenedNum}}/{{total}}</div>

      <!-- 图片 start -->
      <div :key="data.keywordId">
        <div v-if="imageUrls.length>0" class="img-flex-comnt">
          <div v-for="item in imageUrls.concat([{},{},{},{},{},{}])" :key="item.sku" class="img-flex-item">
            <div class="img-div" v-if="item.imageUrl !== undefined">
              <img :key="item.imageUrl" class="item-img loadingImg" v-lazy="item.imageUrl" />
            </div>
            <div class="brand">{{item.brand}}</div>
            <el-tooltip :content="item.title" placement="top" effect="light">
              <p class="p1">{{item.title}}</p>
            </el-tooltip>
          </div>
        </div>
        <div v-if="!(imageUrls.length>0)" style="width:100%;text-align: center;color: #909399;font-size: 14px;">暂无缓存图片</div>
      </div>
      <!-- 图片 end -->
    </template>
    <nonePage v-else noBack></nonePage>
  </div>
</template>
<script>
import _remove from 'lodash/remove'
import _cloneDeep from 'lodash/cloneDeep'
import translate from 'Utils/translate'
import mixin from '../common/mixin'
export default {
  props: ['categoryId', 'curQuery'],
  mixins: [mixin],
  components: {
    draggable: () => import('vuedraggable')
  },
  data() {
    return {
      history: [],
      // 按钮筛选是否有效？
      activeEvent: true,
      screenedNum: 0,
      refresh: true,
      showScreenBtn: false,
      // 当前正在筛选的词
      // data: {
      //   keywordText: '',
      //   invalid: [],
      //   valid: []
      // },
      // 已筛选过的词
      revokeKeywords: [],
      // 所有未筛选的词
      unFilterWords: [],
      // 未筛选总数
      total: 0,

      // imageUrls: [],

      draggableList: [],

      translateText: '',

      translateTextBtnLoading: false,

      finish: false
    }
  },
  created() {
    this.getKeywords().then(() => {
      this.watchBind()
    })
  },
  mounted() {
    this.__event = event => this.bindKey(event)
    document.addEventListener('keydown', this.__event)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.__event)
    this.__event = null
  },

  computed: {
    noData() {
      return !this.unFilterWords.length
    },
    // 当前正在筛选的词
    data() {
      return (
        this.unFilterWords[0] || {
          keywordText: '',
          invalid: [],
          valid: []
        }
      )
    },
    // 当前图片显示
    imageUrls() {
      return this.data.data || []
    },
    keywordText() {
      return this.data.keywordText
    },
    allSetKeywords() {
      let { invalid, valid, keywordText } = this.data
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
    },
    initParams() {
      return {
        ...this.storeInfo,
        keywordId: this.data && this.data.keywordId,
        categoryId: this.categoryId
      }
    }
  },

  methods: {
    watchBind() {
      this._watch = this.$watch('unFilterWords', val => {
        if (val.length < 5 && this.total > this.screenedNum) {
          console.log('重新获取关键词')
          this.getKeywords(true)
        }
      })
    },
    watchUnbind() {
      this._watch()
    },
    addMore() {
      this.activeEvent = false
      this._openDialog(
        {
          size: 'medium',
          title: '添加关键词',
          params: {
            type: 'unfilter',
            categoryId: this.categoryId,
            callback: data => {
              if (this.noData) {
                this.getKeywords()
              } else {
                this.total += data.success
              }
            }
          },
          cancelBtnText: '取消',
          okBtnText: '确认',
          component: () =>
            import(
              'Views/modules/Keyword/keywordLib/detail/tabs/components/common/relatedWords/dialogs/add.vue'
            )
        },
        undefined,
        {
          close: () => {
            this.activeEvent = true
          }
        }
      )
    },
    imptKeyword() {
      this.activeEvent = false
      this._openDialog(
        {
          fullscreen: false,
          size: 'medium',
          title: '导入关键词',
          params: {
            query: {
              importType: 7,
              categoryId: this.categoryId
            },
            tempName: '导入关键词模板'
          },
          cancelBtnText: '关闭',
          component: () =>
            import(
              'Views/modules/Keyword/keywordLib/detail/tabs/components/common/relatedWords/dialogs/import.vue'
            )
        },
        undefined,
        {
          close: () => {
            this.activeEvent = true
          }
        }
      )
    },
    addProps() {
      this._openDialog({
        size: 'medium',
        title: '加入分类属性',
        params: {
          categoryId: this.categoryId,
          keywordTexts: [this.draggableList.join(' ')]
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/propList.vue')
      })
    },
    // 绑定快捷键
    bindKey(event) {
      // console.log(22)

      const { keyCode } = event
      // 弹出输入框 禁止
      if (
        !this.activeEvent ||
        this.$store.state.loading ||
        this.noData ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return
      }
      let actions1 = {
        87: {
          action: 'addKeywordValid',
          query: 'VALID'
        }, // 相关词  有效
        69: {
          action: 'addKeywordValid',
          query: 'INVALID'
        }, // 精准否定 无效
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
      let index1 = Object.keys(actions1).indexOf(keyCode + '')
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
    // 获取关键词数据
    // 是否循环获取
    getKeywords(isLoop, pure) {
      return this.$api[`keyword/keywordLibUnDisposedList`]({
        ...this.storeInfo,
        categoryId: this.categoryId
      }).then(data => {
        if (pure) {
          return data
        }
        if (!data.data) {
          return
        }
        console.log(
          `获取到的关键词数:${data.data && data.data.length}\n词总数: ${
            data.total
          }`
        )

        if (!isLoop) {
          this.unFilterWords = data.data
          // 预加载图片
          this.preLoadImg()
          this.total = data.total
        } else {
          this.handleLoop(data)
        }
      })
    },
    handleLoop(res) {
      const { data } = res
      data.forEach(k => {
        if (this.unFilterWords.some(e => e.keywordText === k.keywordText)) {
          return
        }
        this.unFilterWords.push(k)
      })

      // this.total = total
    },
    // 预加载图片
    // 逻辑： 只加载未筛选词:unFilterWords前6个中的图片
    preLoadImg(array) {
      let index = 0
      function preload(imageUrl) {
        index++
        // console.log(22)
        let _img = new Image()
        _img.src = imageUrl
      }
      if (!array) {
        array = this.unFilterWords.slice(0, 7)
      }
      console.log(
        '预加载图片的关键词',
        array.map(el => el.keywordText)
      )

      for (let i = 0; i < array.length; i++) {
        const element = array[i]
        const { data } = element
        if (!data) {
          continue
        }
        for (let j = 0; j < data.length; j++) {
          const e = data[j]
          const url = e.imageUrl
          !e.loaded && url && preload(url)
          e.loaded = true
        }
      }
      console.log(`预加载的图片数量${index}`)
    },

    // 复制关键词
    copyKeyword() {
      this.$copyText(this.data.keywordText).then(
        () => {
          this.$message.success('复制成功')
        },
        () => {
          this.$message.error('复制失败')
        }
      )
    },
    // 点击关键字
    addKeyword(word) {
      if (this.draggableList.indexOf(word) === -1) {
        this.draggableList.push(word)
      } else {
        this.draggableList = _remove(this.draggableList, function(n) {
          return n !== word
        })
      }
    },
    // 翻译
    translateKeyword() {
      this.translateTextBtnLoading = true
      translate(this.keywordText, true).then(txt => {
        this.translateTextBtnLoading = false
        this.translateText = txt
      })
    },

    clearDraggable() {
      this.draggableList = []
    },

    addKeywordRoot(rootType) {
      let params = {
        rootTexts: [this.draggableList.slice(0).join(' ')]
      }
      switch (rootType) {
        case 1:
          // 加入精准无效词根
          this.addWordToRoot(params, 'INVALID_EXACT')
          break
        case 2:
          // 加入词组无效词根
          this.addWordToRoot(params, 'INVALID_PHRASE')
          break
        case 3:
          // 加入绝对无效词根
          this.addWordToRoot(params, 'ABSOLUTE_PHRASE')
          break
        case 4:
          // 加入有效词根
          this.addWordToRoot(params, 'VALID')
          break
        case 5:
          // 加入可布局品牌词
          params.brandNames = params.rootTexts
          params.rootTexts = null
          this.addWordToBrand(params, 'LAYOUT')
          break
        case 6:
          // 加入仅广告品牌词
          params.brandNames = params.rootTexts
          params.rootTexts = null
          this.addWordToBrand(params, 'AD')
          break
        default:
          break
      }
    },
    // 重新获取关键词数据
    resetData(params) {
      // console.log('重置数据')

      this.getKeywords(null, true).then(data => {
        // if (!data.data) {
        //   // 筛选完了，没有关键词
        //   this.revokeKeywords.push({ params: _cloneDeep(params) })
        //   this.setUnfilterToRevokeWord(this.data, false, this.unFilterWords[0])
        //   return
        // }
        if (
          !data.data ||
          data.data[0].keywordId !== this.unFilterWords[0].keywordId
        ) {
          this.clearDraggable()
          this.clearTran()
          this.revokeKeywords.push({ params: _cloneDeep(params) })
          this.screenedNum++
          // this.watchUnbind()
          this.unFilterWords = data.data || []
          // this.watchBind()
          // 预加载图片
          this.preLoadImg()
          this.total = data.total
          // console.log(this.total)
        } else {
          this.revokeKeywords.push({ params: _cloneDeep(params) })
          this.setUnfilterToRevokeWord(this.data, false, data.data[0])
        }
      })
    },
    // 添加词根
    addWordToRoot(params, type) {
      if (!this.data.keywordId) {
        return
      }

      const rootTypeMap = this.$const['KEYWORD/rootTypeMap']
      params = { ...this.initParams, ...params }
      params.rootType = rootTypeMap[type]
      this.$api[`keyword/keywordLibRootSave`](params, {
        singleLoading: true
      }).then(({ success }) => {
        if (!success) {
          return
        }

        // 加入词根后，先把此次操作记录下来
        let params = {
          rootTexts: [this.draggableList.join(' ')],
          keywordId: this.data.keywordId
        }

        this.pushHistory({
          type: 1,
          data: this.clone$data(),
          rootTexts: [this.draggableList.join(' ')]
        })
        this.clearDraggable()

        this.resetData(params)
      })
    },
    // 添加品牌
    addWordToBrand(params, type) {
      if (!this.data.keywordId) {
        return
      }

      const brandTypeMap = this.$const['KEYWORD/brandTypeMap']
      params = { ...this.initParams, ...params }
      params.brandType = brandTypeMap[type]
      this.$api[`keyword/keywordLibBrandSave`](params, {
        singleLoading: true
      }).then(({ success }) => {
        if (!success) {
          return
        }
        let params = {
          brandNames: [this.draggableList.join(' ')],
          keywordId: this.data.keywordId
        }

        this.pushHistory({
          type: 1,
          data: this.clone$data(),
          brandNames: [this.draggableList.join(' ')]
        })
        this.clearDraggable()

        this.resetData(params)
      })
    },
    addKeywordValid(keywordStatus) {
      if (!this.data.keywordId) {
        return
      }
      let params = {
        ...this.initParams,
        keywordStatus
      }
      this.$api[`keyword/keywordLibFilterKeyword`](params, {
        singleLoading: true
      }).then(() => {
        this.preLoadImg(this.unFilterWords.slice(6, 7))
        this.clearDraggable()

        this.setUnfilterToRevokeWord(this.data)
      })
    },
    clearTran() {
      this.translateText = ''
    },

    // 撤销关键词
    revokeScreen() {
      if (!this.history.length) {
        return
      }
      this.clearDraggable()
      let keyword = this.revokeKeywords.slice().pop()
      if (!keyword) {
        return
      }
      let params = {
        ...this.initParams,
        keywordId: keyword.keywordId,
        ...(keyword.params ? keyword.params : keyword)
        // rootTexts,
        // brandNames
      }
      this.$api[`keyword/keywordLibRevokeKeyword`](params, {
        singleLoading: true
      }).then(() => {
        // this.revokeKeywords.pop()
        // this.setRevokeWordToUnfilter(keyword)
        // this.data = keyword
        let { data } = this.history.pop()
        // console.log(data)

        this.recorve(data)
      })
    },
    // 设置筛选过的词到已筛选词列表
    setUnfilterToRevokeWord(keyword, history = true, data) {
      history &&
        this.pushHistory({
          type: 1,
          data: this.clone$data()
        })

      history && this.total--
      history && this.clearTran()
      history && this.screenedNum++
      keyword = _cloneDeep(keyword)
      this.watchUnbind()
      this.unFilterWords.shift()
      !history && this.unFilterWords.unshift(data)
      this.watchBind()
      history && this.revokeKeywords.push(keyword)
      if (this.revokeKeywords.length > 9) {
        this.revokeKeywords.shift()
      }
    },
    clone$data() {
      // let el =
      return Object.assign(_cloneDeep(this.$data), { history: this.history })
    },
    pushHistory(record) {
      if (this.history.length > 9) {
        this.history.shift()
      }
      this.history.push(record)
    },
    recorve(data) {
      this.watchUnbind()
      Object.assign(this.$data, data)
      this.watchBind()
    },
    // 设置撤销词到未筛选词
    setRevokeWordToUnfilter(keyword) {
      this.screenedNum--
      keyword = _cloneDeep(keyword)
      this.unFilterWords.unshift(keyword)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  & /deep/ .textbtn {
    padding: 8px 0;
    font-size: 14px;
    &.textbtn + .textbtn {
      margin-left: 6px;
    }
  }
  & /deep/ .draggable .textbtn {
    cursor: move;
  }
  & /deep/ .el-button.el-button--primary {
    padding: 6px 14px;
    font-size: 12px;
    i {
      font-size: 12px;
    }
  }
  &--keyword {
    position: relative;
    // margin-left: 10px;
    // &:after {
    //   content: '';
    //   display: block;
    //   height: 2px;
    //   position: absolute;
    //   bottom: 0px;
    //   width: 70%;
    //   background-color: #f2f2f2;
    // }
    &__textbtn {
      font-size: 14px;
      padding: 8px 0;

      &.disabled {
        color: #666;
        border: none;
        &:hover,
        &:focus {
          color: #666;
        }
      }
    }
  }
  &--setting {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 3;
    &__btn {
      padding: 0;
      border: none;
      font-size: 24px;
      color: $hoverColor;
      &:hover,
      &:focus {
        color: $bghoverColor;
      }
    }
  }
}

.key-row-1 {
  margin-top: 20px;
  border: 1px solid $boxBorderColor;
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
    border-left: 1px solid $boxBorderColor;
  }
}
.key-row-2 {
  border-left: 1px solid $boxBorderColor;
  border-right: 1px solid $boxBorderColor;
  border-bottom: 1px solid $boxBorderColor;
}
.img-flex-comnt {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  .brand {
    margin-top: 20px;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }
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
      font-size: 12px;
      line-height: 1.3;
    }
  }
}
</style>
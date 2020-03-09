<template>
  <div class="mainContent addTasks" v-loading.fullscreen.lock="mainLoading"  :style="{height:viewHeight}">
    <div class="leftCt" :style="{height:viewHeight}">
      <div>
        <slot name="leftContent"></slot>
      </div>
      <div v-if="!noAsin">
        <div>
          <p
            :style="{color: $parent.formData.keyword && (moreRowText($parent.formData.keyword).length > (addOptions.num - successNum)) ? 'red': null}"
          >限{{addOptions.num - successNum}}个，已输入{{$parent.formData.keyword && moreRowText($parent.formData.keyword).length || 0}}个</p>
          <p
            v-if="leftData.showTip === 1"
          >{{leftData.successTotal}}/{{leftData.allTotal}} 已成功添加{{addOptions.rightTitle}}</p>
          <p v-if="leftData.showTip === 2">
            {{leftData.successTotal}}/{{leftData.allTotal}} 已成功添加{{addOptions.rightTitle}}
            <el-button type="text" @click="toExport" style="padding: 0">下载错误报告</el-button>
          </p>
        </div>

        <el-button
          @click="addMethod"
          :disabled=" !$parent.formData.keyword || (moreRowText($parent.formData.keyword).length > (addOptions.num - successNum)) || $parent.formData.keyword.trim() == ''"
        >添加</el-button>
      </div>
    </div>
    <div class="rightCt" v-if="!noAsin"  :style="{height:viewHeight}">
      <div>
        <span>已添加{{successNum}}个</span>
        <el-button type="text" @click="delMethod('all')">全部删除</el-button>
      </div>
      <div>{{addOptions.rightTitle}}</div>
      <div v-for="(item,index) in formList" :key="index">
        <span class="fix__row_1">{{item}}</span>
        <el-button type="text" class="el-icon-close" @click="delMethod('single',index)"></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { exportRaw } from '../../../utils/exportTxt.js'
export default {
  props: {
    noAsin: {
      default: false,
      type: Boolean
    },
    addOptions: {
      default: () => ({
        num: 200
      }),
      type: Object
    },
    defaultList: {
      default: () => []
    }
  },
  data() {
    return {
      formList: this.defaultList,
      mainLoading: false,
      leftData: {},
      errorObj: {},
	  viewHeight:'760px'
    }
  },
  methods: {
    delMethod(type, index) {
      if (type === 'single') {
        let [...form] = this.formList
        form.splice(index, 1)
        this.$set(this, 'formList', form)
      } else {
        this.$set(this, 'formList', [])
      }
      this.$message.success('操作成功')
    },
    addMethod() {
      this.mainLoading = true
      let list = [...new Set(this.moreRowText(this.$parent.formData.keyword))]

      //验证每一条
      let successList = []
      let failList = []
      list.forEach(e => {
        if (this.addOptions.regText.test(e)) {
          successList.push(e)
        } else {
          failList.push(e)
        }
      })

      //判断添加进来的关键词是否与表格的关键词相同
      let [...oldList] = this.formList
      let filterNewList = successList.filter(e => {
        if (oldList.indexOf(e) === -1) return e
      })

      //保存错误报告的文字
      this.errorObj = {
        isLeftSame:
          this.moreRowText(this.$parent.formData.keyword).length == list.length
            ? false
            : true,
        isSame: successList.length == filterNewList.length ? false : true,
        isSpecial: failList.length ? true : false
      }

      setTimeout(() => {
        //添加进表格
        filterNewList.forEach(e => {
          this.formList.push(e)
        })

        //加载左侧数据
        this.leftData = {
          allTotal: this.moreRowText(this.$parent.formData.keyword).length,
          successTotal: (filterNewList && filterNewList.length) || 0
        }
        if (this.leftData.allTotal == this.leftData.successTotal) {
          this.leftData.showTip = 1
        } else {
          this.leftData.showTip = 2
        }

        //取消全屏loading
        this.mainLoading = false

        //判断弹出何种提示文字
        filterNewList && filterNewList.length
          ? (this.idid = 1)
          : failList.length
          ? (this.idid = 1)
          : this.$message.warning(`存在相同的${this.addOptions.rightTitle}`)

        //判断是否存在失败的关键词
        if (failList.length) {
          this.$emit('clearInput', failList.join('\n'))
          this.$message.warning(
            `存在不合法的${this.addOptions.rightTitle},请修改!`
          )
        } else {
          this.$emit('clearInput')
        }
      }, 500)
    },
    toExport() {
      let errorText = {
        isLeftSame: `文本域输入框添加的${this.addOptions.rightTitle}存在重复`,
        isSame: `添加的${this.addOptions.rightTitle}和右边表格重复`,
        isSpecial: `添加的${this.addOptions.rightTitle}存在特殊字符`
      }
      let str = ''
      Object.entries(this.errorObj).forEach((e, index) => {
        if (e[1]) str += errorText[e[0]] + '\n'
      })
      console.log(str)
      exportRaw('错误报告', str)
    },
	resize(){
		let height = document.body.clientHeight
		this.viewHeight = height - 176 + 'px'
	}
  },
  watch: {
    placeholderText: {
      handler(val) {
        this.$emit('changePlaceHolder', val)
      }
    }
  },
  computed: {
    successNum() {
      return this.formList.length
    },
    placeholderText() {
      return `多个${this.addOptions.rightTitle}换行输入，最多限制${this
        .addOptions.num - this.successNum}个......`
    }
  },
  mounted() {
    let vm = this
    window.onresize = function() {
      vm.resize()
    }
	vm.resize()
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>

<style scoped="scoped" lang="scss">
.mainContent.addTasks {
  width: 100%;
  display: flex;
  justify-content: space-between;
  min-width: 1240px;
  min-height: 300px;
  > div {
    width: 49%;
	min-height: 300px;
  }
  .leftCt {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > div:nth-child(2) {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100px;
    }
  }
  .rightCt {
    border: 1px solid rgb(215, 215, 215);
    overflow-y: auto !important;
    > div {
      width: 100%;
      height: 65px;
      line-height: 65px;
      border-bottom: 1px solid rgb(215, 215, 215);
      padding: 0 20px 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>

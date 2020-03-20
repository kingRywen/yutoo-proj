<template>
  <!-- number -->
  <el-input-number
    @clear="$emit('clear')"
    :style="{width:widgetWidth|| '100%',minWidth: '120px'}"
    v-if="type === 'number'"
    :value="currentVal"
    @change="handleNumberChange($event)"
    controls-position="right"
    :precision="item.precision || 0"
    :controls="item.controls"
    :min="min"
    :max="max"
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    :placeholder="item.placeholder"
  ></el-input-number>
  <!-- 货币 -->
  <div :class="['__currency', {'has-signal': item.signal}]" v-else-if="type === 'currency'">
    <span class="el-input-group__prepend" v-if="item.signal">{{item.signal}}</span>
    <el-input-number
      @clear="$emit('clear')"
      :style="{width:widgetWidth|| '100%',minWidth: '120px'}"
      :value="currentVal"
      :precision="2"
      @change="handleNumberChange($event)"
      controls-position="right"
      :controls="item.controls"
      :min="min"
      :max="max"
      :disabled="typeof disabled  === 'function' ? disabled() : disabled"
      :placeholder="item.placeholder"
    ></el-input-number>
  </div>
  <!-- 多行文本 -->
  <el-input
    @blur="textAreaBlur(item)"
    @focus="textAreaFocus(item)"
    ref="textarea"
    v-else-if="type === 'textarea'"
    @input="$emit('input', $event)"
    :autosize="item.autosize"
    :value="currentVal"
    @clear="$emit('clear')"
    :maxlength="item.max || item.maxlength"
    :style="Object.assign(textStyle, item.style)"
    type="textarea"
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    :rows="item.rows || 1"
    :placeholder="item.placeholder"
  ></el-input>
  <!-- 带输入建议 -->
  <el-autocomplete
    v-else-if="type === 'autocomplete'"
    class="w100"
    @input="$emit('input', $event)"
    @clear="$emit('clear')"
    :placeholder="item.placeholder"
    :value="currentVal"
    :fetch-suggestions="getFetchSuggestions.bind(null,item)"
  ></el-autocomplete>
  <!-- 多选框 -->
  <el-checkbox-group
    v-model="checkBoxVal"
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    v-else-if="type === 'checkbox'"
  >
    <el-checkbox v-for="item in options" :label="item[labeVal]" :key="item[labeVal]">{{item[label]}}</el-checkbox>
  </el-checkbox-group>
  <!-- 单选radio -->
  <ElRadioGroup v-else-if="type === 'radio'" :class="{vertical: item.vertical}" v-model="checkBoxVal">
    <ElRadio v-for="i in options" :key="i.value" :label="i.value">
      <span :style="(i.innerTips || item.innerTips) ? item.vertical ? 'width:100px;display: inline-block;' : '' : ''">
        {{i.label}}
        <ElTooltip v-if="i.tip" :content="i.tip" placement="top">
          <i :class="i.tipIcon || 'el-icon-info'"></i>
        </ElTooltip>
      </span>

      <span v-if="(item.innerTips || i.innerTips) && i.tip !==false" class="innerTips">{{i.innerTips || item.innerTips}}</span>
    </ElRadio>
  </ElRadioGroup>
  <!-- switch -->
  <el-switch
    v-else-if="type === 'switch'"
    style="margin-top: 6px;"
    :active-text="(options[1]&& options[1].label)"
    :inactive-text="(options[0]&& options[0].label)"
    :active-value="options[1]&& options[1].value"
    :inactive-value="options[0] && options[0].value"
    @change="$emit('input', $event), $emit('change', $event)"
    :value="currentVal"
  ></el-switch>
  <!-- 选择 -->
  <el-select
    collapse-tags
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    :multiple="!!item.multi"
    :multiple-limit="(typeof item.multi ==='number' && item.multi === item.multi) ? item.multi : 0"
    :style="{width:widgetWidth|| '100%',minWidth: item.width ? 0 : '150px'}"
    @visible-change="handleSelectVisibleChange"
    v-else-if="type === 'select'"
    :value="currentVal"
    :allow-create="item.allowCreate"
    :filterable="item.allowCreate || item.filterable"
    :placeholder="selectPlaceholder"
    @change="$emit('input', $event), $emit('change', $event)"
    @clear="$emit('clear'), $emit('change', $event)"
    :clearable="item.clearable===false?false:true"
  >
    <!-- <div
      v-if="loading"
      v-loading="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      style="min-height: 100px"
    ></div>-->
    <el-option v-for="i in options" :key="i[labeVal]" :label="i[label]" :value="i[labeVal]">
      <span :class="{'custom_hover': item.optionsHoverFunc ? item.optionsHoverFunc(i) : false}">{{ i[label] }}</span>
    </el-option>
    <div
      v-if="loading"
      element-loading-text="加载中"
      element-loading-spinner="el-icon-loading"
      slot="empty"
      v-loading="loading"
      style="min-height: 100px"
    ></div>
  </el-select>

  <!-- 树型展示 -->
  <el-cascader
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    :change-on-select="item.every"
    v-else-if="type === 'cascader'"
    :options="options"
    :props="item.props"
    ref="cas"
    :filterable="item.filterable"
    :placeholder="item.placeholder"
    :clearable="item.clearable"
    :collapse-tags="item.collapseTags"
    :show-all-levels="item.showAllLevels == null ? true : item.showAllLevels"
    @clear="$emit('clear'), $emit('change', $event)"
    :style="{width: item.width ? item.width.indexOf('%') > -1 ? item.width : parseInt(item.width) + 'px' : '200px'}"
    @change="handleCascaderChange($event)"
    @active-item-change="handleChangeItem"
    :value="currentVal"
  >
    <template v-if="item.render" slot-scope="{ node, data }">
      <slot v-bind="{node, data}">
        <component :is="renderCas({node, data})"></component>
      </slot>
    </template>
  </el-cascader>
  <!-- 日期范围 -->
  <el-date-picker
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    :value-format="item.format || (type === 'datetimerange' || item.time) ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'"
    v-else-if="type === 'daterange' || type === 'date' || type === 'datetimerange' || type === 'datetime'"
    :type="type === 'daterange' ? 'daterange': type === 'datetimerange' ? 'datetimerange' : item.time ? 'datetime' : 'date'"
    :value="currentVal"
    :unlink-panels="item.isShowUnlink !== false ? true : false"
    :picker-options="getPickerOptions"
    @blur="item.blur && item.blur()"
    :range-separator="item.rangeSeparator || '-'"
    :start-placeholder="item.startPlaceholder || '开始时间'"
    :end-placeholder="item.endPlaceholder || '结束时间'"
    :style="{width: item.width ? (typeof item.width === 'string' && item.width.indexOf('%') > -1) ? item.width : (parseInt(item.width) + 'px') : '230px'}"
    @clear="$emit('clear'), $emit('change', $event)"
    @change="$emit('input', $event), $emit('change', $event)"
    @input="$emit('input', $event)"
    :clearable="item.clearable===false?false:true"
  ></el-date-picker>

  <!-- 富文本 -->
  <div v-else-if="type === 'editor'">
    <UeEditor :value="currentVal" @input="handleEditorChange"></UeEditor>
    <ElInput type="textarea" v-show="false" :value="currentVal"></ElInput>
  </div>

  <!-- 上传文件 -->
  <div v-else-if="type === 'upload'">
    <!-- <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>-->
    <el-upload
      :disabled="false"
      :before-upload="handleBeforeUpload"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      :on-remove="handleFileRemove"
      :on-change="handleFileChange"
      :on-exceed="handleFileExceed"
      class="upload-demo"
      style="display:block"
      ref="upload"
      list-type="picture"
      :on-preview="handlePictureCardPreview"
      :file-list="currentVal"
      :accept="item.drag !== true && item.drag !== undefined ? uploadOpts.accept.join(', ') : undefined"
      v-bind="{drag: true,action:'https://jsonplaceholder.typicode.com/posts/',  ...item}"
    >
      <template v-if="item.listType === 'picture-card'">
        <i class="el-icon-plus"></i>
      </template>
      <template v-else>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </template>
      <div :class="['el-upload__tip', {mt10:item.listType === 'picture-card' }]" slot="tip">
        <span v-if="uploadOpts.text && uploadOpts.text.length">只能上传{{uploadOpts.text.join('/')}}文件，</span>
        {{item.limitSize ? `文件大小不超过${item.limitSize}M` : ''}}
      </div>
    </el-upload>
    <el-checkbox-group v-show="false" :value="currentVal"></el-checkbox-group>
  </div>

  <div class="w100" v-else-if="type === 'txt' || type === 'text'">
    <a :style="item.style" class="link" target="_blank" v-if="item.url" :href="currentVal">{{currentVal}}</a>
    <span :style="item.style" class="txc" v-else>{{currentVal || item.text}}</span>
  </div>

  <!-- 等于号 -->
  <div class="w100 _forminput-equal" v-else-if="type === 'equal'">{{item.text || "="}}</div>

  <!-- 普通 -->
  <el-input
    @blur="$emit('blur')"
    :disabled="typeof disabled  === 'function' ? disabled() : disabled"
    :placeholder="item.placeholder"
    :maxlength="item.maxlength"
    :suffix-icon="item.suffixIcon"
    :prefix-icon="item.prefixIcon"
    v-else
    :style="{width:widgetWidth|| '100%',minWidth:item.width ? 0 : '150px'}"
    :value="currentVal"
    @input="$emit('input', $event)"
    @clear="$emit('clear')"
    :type="item.showType === 'password' ? 'password' : 'text'"
    :clearable="item.clearable===false ? false : true"
  >
    <template v-if="item.pend" :slot="item.pend.type">
      <slot :name="item.pend.type"></slot>
    </template>
  </el-input>
</template>

<script>
import _get from 'lodash/get'
import bus from './event'

const cfun = {
  // 只能选择以前的时候
  _pickerBefore: {
    disabledDate(date) {
      return date.getTime() > Date.now()
    }
  },
  // 只能选择以后的时间
  _pickerFuture: {
    disabledDate(time) {
      return time.getTime() < Date.now() - 3600 * 24 * 1000
    }
  }
}
export default {
  name: 'FormInputs',
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      options: [],
      loading: false,
      fileList: [],
      textStyle: { width: '100%', minWidth: '150px' },
      hasFetch: false
      // checkBoxVal: []
    }
  },

  props: {
    search: {
      default: false
    },
    formData: {
      type: Object
    },
    disabled: {
      type: [Function, Boolean],
      default: false
    },
    placeholder: {
      type: String
    },
    item: {
      type: Object,
      default: () => {}
    },
    value: {
      default: null,
      required: true
    }
  },

  created() {
    if (this.type === 'upload') {
      // upload组件时，需要监听currentVal，重置表单时有用
      this.$watch('currentVal', val => {
        if (!val.length) {
          this.$refs.upload.clearFiles()
        }
      })
    }
    if (this.type === 'switch') {
      if (!this.item.options) {
        this.options = [
          {
            label: this.item.inactiveText,
            value: this.item.inactiveValue != null ? this.item.inactiveValue : 0
          },
          {
            label: this.item.activeText,
            value: this.item.activeValue != null ? this.item.activeValue : 1
          }
        ]
      }
    }
  },

  beforeDestroy() {
    if (this._storeWatch) {
      this._storeWatch()
    }
  },

  methods: {
    handleNumberChange($event) {
      this.$emit('input', $event)
      this.$emit('change', $event)
    },
    handleCascaderChange($event) {
      this.$emit('input', $event)
      this.$emit('change', $event)
      let panal = this.$refs.cas.$refs.panel.$refs.menu
      let el = this.getNode(panal, $event)
      if (el) {
        el.handleExpand()
      }
    },
    getNode(menu, id) {
      let child = []
      ;[].forEach.call(menu, el => {
        child.push(...el.$children[0].$children)
      })
      child = child.filter(el => el.$options._componentTag === 'cascader-node')
      return child.find(
        el => el.value && el.value.slice().pop() === id.slice().pop()
      )
    },
    getFetchSuggestions(item, queryString, cb) {
      // FIXME: 加入分页
      const { asyncSearch } = item
      if (!this.hasFetch) {
        try {
          item.options().then(data => {
            this.hasFetch = true
            this.options = data
            this.lastText = queryString
            this.lastOptions = data
            cb(data)
          })
        } catch (error) {
          console.log(error)

          console.error('item.options必须为函数')
        }
      } else {
        if ((queryString == null || queryString === '') && !asyncSearch) {
          cb(this.options)
        } else {
          if (asyncSearch) {
            if (this.lastText !== queryString) {
              item.options(queryString).then(data => {
                this.options = data
                this.lastText = queryString
                this.lastOptions = data
                cb(data)
              })
            } else {
              cb(this.lastOptions)
            }
          } else {
            cb(
              this.options.filter(
                el =>
                  String(el.value)
                    .trim()
                    .toLowerCase()
                    .indexOf(queryString.trim().toLowerCase()) > -1
              )
            )
          }
        }
      }
    },
    textAreaFocus(item) {
      if (this.search) {
        this.textStyle = { width: '100%', minWidth: '150px', zIndex: 999 }
        item.rows = 4
      }
    },
    textAreaBlur(item) {
      if (this.search) {
        item.rows = 1
        this.$refs.textarea.$el
          .querySelectorAll('textarea')[0]
          .removeAttribute('style')
        this.textStyle = { width: '100%', minWidth: '150px' }
      }
      this.$emit('blur')
    },
    handlePictureCardPreview(file) {
      this._openDialog({
        size: 'large',
        title: '',
        params: { url: file.url },
        component: () => import('Components/Widget/reviewImg.vue')
      })
      // this.dialogImageUrl = file.url
      // this.dialogVisible = true
    },
    handleFileChange(file, fileList) {
      if (!this.item.autoUpload) {
        this.fileList = fileList
        this.$emit('input', fileList)
      }
    },
    handleFileSuccess(response, file, fileList) {
      if (fileList.every(el => el.status === 'success')) {
        bus.$emit('isFileLoading', false)
      }
      this.fileList = fileList
      this.$emit('input', fileList)
    },
    handleFileError() {
      bus.$emit('isFileLoading', false)
    },
    // beforeFileRemove(file) {
    //   return this.$confirm(`确定移除 ${file.name}？`)
    // },
    handleFileExceed() {
      this.$message.warning(`最多只能上传${this.item.limit || 1}个文件`)
    },
    handleFileRemove(file, fileList) {
      // console.log(file, fileList)
      this.$emit('input', fileList)
      if (fileList.every(el => el.status === 'success')) {
        bus.$emit('isFileLoading', false)
      }
    },
    handleBeforeUpload(file) {
      let isLimit = file.size / 1024 / 1024 > (this.item.limitSize || 10)
      let ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      let allFileExt = this.uploadOpts.text.reduce(
        (prev, cur) => prev.concat(cur.split(',').map(el => el.trim())),
        []
      )
      let isFileType = allFileExt.indexOf(ext) > -1
      if (isLimit) {
        this.$message.warning(`只能上传小于${this.item.limitSize}M的文件`)
        return false
      }
      if (!isFileType) {
        this.$message.warning(`只能上传${this.uploadOpts.text.join(',')}文件`)
        return false
      }
      if (!isLimit && isFileType) {
        bus.$emit('isFileLoading', true)
      }
      return !isLimit
    },
    handleEditorChange(val) {
      this.$emit('input', val)
    },
    renderCas({ node, data }) {
      let vm = this
      return {
        render(h) {
          return vm.item.render(h, { node, data })
        }
      }
    },
    handleChangeItem(arr) {
      if (this.item.changeItem) {
        this.item.changeItem(arr)
      }
    },
    handleSelectVisibleChange(show) {
      if (this.item.visibleChange) {
        this.item.visibleChange(show)
      }
    },
    getOptionStrag(val, { payload, action }) {
      let vm = this
      let _n = val.indexOf('.')
      let type = val.slice(0, _n)
      let props = val.slice(_n + 1)

      // console.log(type, props)
      switch (type) {
        /* options: '$store.storeInfo.curStoreList',
          handler: {
            action: 'storeInfo/getStoreList'
          } */
        case '$store':
          // 监听vuex的值
          if (!this.$store) {
            console.error('没有引入vuex')
            return
          }
          if (this._storeWatch) {
            this._storeWatch()
          }
          this._storeWatch = this.$store.watch(
            (state, getter) => {
              let ret
              if (props.includes('/')) {
                ret = _get(getter, props)
              } else {
                ret = _get(state, props)
              }

              if (ret) {
                return ret
              }
            },
            val => {
              if (
                Array.isArray(val) &&
                !val.length &&
                action &&
                !this._storeWatch
              ) {
                vm.loading = true
                vm.$store
                  .dispatch(action, payload)
                  .then(() => {
                    vm.loading = false
                  })
                  .catch(() => {
                    vm.loading = false
                  })
              } else {
                vm.options = val
              }
            },
            {
              immediate: true
            }
          )
          break
        case '$const':
          // 取常量的值
          this.options = _get(this.$const, props)
          break

        default:
          break
      }
    }
  },
  watch: {
    'item.options': {
      immediate: true,
      handler(val) {
        let { options, handler = {} } = this.item
        if (val) {
          if (typeof val === 'function') {
            this.loading = true
            // console.log(val);
            options()
              .then(res => {
                this.loading = false
                this.options = res
              })
              .catch(err => {
                this.loading = false
                // eslint-disable-next-line no-console
                err instanceof Error && console.error(err)
              })
          } else if (typeof val === 'string') {
            this.getOptionStrag(val, handler)
          } else {
            this.options = options
          }
        }
      }
    }
  },
  computed: {
    widgetWidth() {
      const width = this.item.width
      if (!this.search && !width) {
        return undefined
      }
      return typeof width === 'string'
        ? width
        : typeof width == 'number' && width === width
        ? width + 'px'
        : '100px'
      // return this.item.width
      //   ? this.item.width.indexOf('%') > -1
      //     ? this.item.width
      //     : parseInt(this.item.width) + 'px'
      //   : '100px'
    },
    uploadOpts() {
      if (this.type !== 'upload') {
        return {}
      }
      let text = [],
        accept = [],
        fileLmt = this.item.fileLimit

      if (typeof fileLmt === 'string') {
        fileLmt = [fileLmt]
      }
      if (fileLmt.indexOf('all') > -1) {
        fileLmt = ['all']
      }
      fileLmt.forEach(name => {
        switch (name) {
          case 'image':
            text.push('jpg, jpeg, gif, png')
            accept.push('image/*')
            break
          case 'excel':
            text.push('xls', 'xlsx')
            accept.push(
              '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            break
          case 'pdf':
            text.push('pdf')
            accept.push('.pdf, application/pdf')
            break
          case 'word':
            text.push('doc', 'docx')
            accept.push('application/msword, .doc, .docx')
            break
          case 'all':
            text = []
            accept = ['*']
            break

          default:
            break
        }
      })
      return {
        accept,
        text
      }
    },
    checkBoxVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        this.$emit('change', val)
      }
    },
    type() {
      return this.item.widget
    },
    getPickerOptions() {
      let ret = {}
      if (this.item.pickerOptions) {
        ret = this.item.pickerOptions
      }
      if (this.item.timeDisabled) {
        switch (this.item.timeDisabled) {
          case 'before':
            Object.assign(ret, cfun._pickerFuture)
            // ret = cfun._pickerFuture
            break
          case 'after':
            Object.assign(ret, cfun._pickerBefore)
            // ret = cfun._pickerBefore
            break
          default:
        }
      }
      return ret
    },
    selectPlaceholder() {
      return (
        this.item.placeholder ||
        `请选择${this.item.label != null ? this.item.label : ''}`
      )
    },
    min() {
      return this.item.min || 0
    },
    max() {
      return this.item.max || Infinity
    },
    currentVal() {
      return this.value == null ? undefined : this.value
    },
    label() {
      return (this.item.bind && this.item.bind.label) || 'label'
    },
    labeVal() {
      return (this.item.bind && this.item.bind.value) || 'value'
    }
  }
}
</script>

<style lang='scss' scoped>
.custom_hover {
  background: #e4e7ed;
  display: block;
  margin: 0 -20px;
  padding: 0 20px;
  &:hover {
    background: #dcdfe6;
  }
}
</style>
<style lang="scss">
.vertical.el-radio-group {
  label {
    display: block;
    margin: 10px 0;
  }
}
.el-form-item.is-required:not(.is-no-asterisk)
  .el-input
  > .el-input-group__prepend:before,
.el-form-item.is-required:not(.is-no-asterisk) .el-input-group__prepend:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.el-range-editor--small.el-input__inner {
  height: 33px;
}
.__currency {
  display: inline-table;
  width: 100%;

  .el-input-group__prepend {
    height: 30px;
    line-height: 30px;
  }
  &.has-signal .el-input-number {
    display: table-cell;
    .el-input__inner {
      border-radius: 0 4px 4px 0;
    }
  }
}
.el-form-item.is-error {
  .edui-default .edui-editor {
    border-color: #f56c6c;
  }
}
.table-search {
  .el-textarea {
    z-index: 9 !important;
  }
}
</style>
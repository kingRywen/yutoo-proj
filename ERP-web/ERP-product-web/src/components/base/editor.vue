<template>
  <div>
    <script :id.prop="initId" type="text/plain"></script>
    <v-upload :beforeUpload="onUploadRemarkChange" action="/" style="width:100%" v-if="!disabled && upload">
      <v-row :gutter="10" style="margin-top:10px">
        <v-col span="12">
          <v-input placeholder="点击上传" disabled :value="path"></v-input>
        </v-col>
        <v-col span="12">
          <v-button type="primary" :disabled="disabled" :loading="loading">上传文件插入编辑器</v-button>
        </v-col>
      </v-row>
    </v-upload>
  </div>
</template>
<script>
// import UE from 'UE'
// import XLSX from 'XLSX'
import { fetchData, showToast, uploadFileToOss } from 'common/common'
import apis from 'apis'
import { HTMLDecode } from 'common/util'
export default {
  name: 'UE',
  data() {
    return {
      editor: null,
      path: '',
      loading: false,
      out: ''
    }
  },
  created() {
    console.log(this.props)
  },
  props: {
    noCN: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    upload: {
      type: Boolean,
      default: true
    },
    defaultMsg: {
      type: [String, Number]
    },
    config: {
      type: Object
    },
    initId: {
      type: [String, Number]
    },
    value: {
      type: [String, Number]
    }
  },
  mounted() {
    let iframe = top.frames['main']
    const _this = this

    if (this.noCN) {
      // 如果需要首字大小写功能
      UE.registerUI('firstupper', function(editor, uiName) {
        //注册按钮执行时的command命令，使用命令默认就会带有回退操作
        editor.registerCommand(uiName, {
          execCommand: function(uiName) {
            let _select = editor.selection.getRange(),
              _contentsFrag = _select.cloneContents(),
              node = document.createElement('p')
            if (!_contentsFrag) {
              return
            }
            node.appendChild(_contentsFrag)
            // let text = node.innerText
            console.log(node)
            function handleText(node) {
              node.forEach(el => {
                if (el.childNodes.length) {
                  handleText(el.childNodes)
                } else {
                  if (el.nodeType === 3) {
                    let text = el.data
                    text = el.data.split(' ')
                    text = text
                      .map(
                        el =>
                          el.slice(0, 1).toUpperCase() +
                          el.substr(1).toLowerCase()
                      )
                      .join(' ')
                    el.data = text
                  }
                }
              })
            }

            handleText([node])

            let text = node.innerHTML.replace(/<p><br[\/]?><\/p>$/, '')

            editor.execCommand(
              'inserthtml',
              `${text.slice(0, 1).toUpperCase() + text.substr(1)}`
            )
          }
        })
        //创建一个button
        var btn = new UE.ui.Button({
          //按钮的名字
          name: uiName,
          //提示
          title: '首字母大写',
          //添加额外样式，指定icon图标，这里默认使用一个重复的icon
          cssRules: 'background-position: -160px -40px;',
          //点击时执行的命令
          onclick: function() {
            //这里可以不用执行命令,做你自己的操作也可
            editor.execCommand(uiName)
          }
        })

        //当点到编辑内容上时，按钮要做的状态反射
        editor.addListener('selectionchange', function() {
          var state = editor.queryCommandState(uiName)
          if (state == -1) {
            btn.setDisabled(true)
            btn.setChecked(false)
          } else {
            btn.setDisabled(false)
            btn.setChecked(state)
          }
        })
        //因为你是添加button,所以需要返回这个button
        return btn
      })
    }

    this.editor = UE.getEditor(this.initId, this.config) // 初始化UE

    this.editor.addListener('ready', function() {
      if (_this.value) {
        _this.editor.setContent(_this.html(_this.value)) // 确保UE加载完成后，放入内容。
      }
      if (_this.disabled) {
        _this.editor.setDisabled()
      }
    })

    this.editor.addListener('contentChange', function() {
      // 动态获取编辑器的内容
      let content = _this.editor.getContent()
      if (_this.noCN) {
        content = content
          .replace(
            '<audio controls="controls" style="display: none;"></audio>',
            ''
          )
          .replace(/ style=\"white-space: normal\;\"/, '')

        function getText(range) {
          if (!range) {
            return
          }
          if (!range.data) {
            return getText(range.firstChild)
          } else {
            return range.firstChild || range
          }
        }

        if (/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/.test(content)) {
          // showToast('error', '不能输入中文字符')
        }
      }
      console.log(content)

      _this.$emit('input', _this.unhtml(content))
    })

    /**
     * xlsx解析excel表格数据 ， 此为初始化
     */
    this.X = XLSX
  },
  methods: {
    /**
     * 解析xlsx
     */
    process_wb(wb) {
      let vm = this
      function to_html(workbook) {
        workbook.SheetNames.forEach(function(sheetName) {
          let htmlstr = vm.X.write(workbook, {
            sheet: sheetName,
            type: 'string',
            bookType: 'html'
          })
          vm.out += htmlstr
        })
        return ''
      }
      try {
        to_html(wb)
      } catch (error) {}
      this.editor.setContent(this.editor.getContent() + vm.out)
    },

    do_file(file) {
      let vm = this
      let rABS =
        typeof FileReader !== 'undefined' &&
        (FileReader.prototype || {}).readAsBinaryString
      let domrabs = {
        checked: true
      }
      if (!rABS) domrabs.checked = false

      let use_worker = typeof Worker !== 'undefined'
      let domwork = {
        checked: true
      }
      if (!use_worker) domwork.checked = false

      let xw = function xw(data, cb) {
        let worker = new Worker(XW.worker)
        worker.onmessage = function(e) {
          switch (e.data.t) {
            case 'ready':
              break
            case 'e':
              console.error(e.data.d)
              break
            case XW.msg:
              cb(JSON.parse(e.data.d))
              break
          }
        }
        worker.postMessage({ d: data, b: rABS ? 'binary' : 'array' })
      }

      let _rABS = domrabs.checked
      let _use_worker = domwork.checked
      let f = file
      let reader = new FileReader()
      reader.onload = function(e) {
        if (typeof console !== 'undefined')
          console.log('onload', new Date(), _rABS, _use_worker)
        let data = e.target.result
        if (!_rABS) data = new Uint8Array(data)
        // if (_use_worker) xw(data, this.process_wb);
        else
          vm.process_wb(vm.X.read(data, { type: _rABS ? 'binary' : 'array' }))
      }
      if (_rABS) reader.readAsBinaryString(f)
      else reader.readAsArrayBuffer(f)

      this.loading = false

      return false
    },

    async onUploadRemarkChange(file) {
      this.loading = true
      console.log(file)
      let fileArr = file.name.split('.')
      let ext = fileArr[fileArr.length - 1]
      console.log(ext)

      // 如果是这些文件，就到后台解释获取文件内容
      if (ext === 'txt' || ext === 'doc' || ext === 'docx') {
        let data = new FormData()
        data.append('file', file)
        return fetchData({ ...apis.PRODUCT_RICH_FILE_UPLOAD, data }).then(
          res => {
            this.loading = false
            console.log(res)
            if (res.data.code === 0) {
              this.editor.setContent(this.editor.getContent() + res.data.file)
              return false
            } else {
              showToast('error', res.data.msg)
            }
          }
        )
        return false
      }

      // 如果是excel文件，解析成excel表格
      if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
        return this.do_file(file)
      }

      // 如果其它文件，上传到oss再处理
      return await this.fileToOss(file, path => {
        this.loading = false
        let _a
        // 如果是图片文件，显示出来
        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'gif') {
          _a = `<img src='${path}' alt='${file.name}'></img>`
        } else {
          _a = `<a href='${path}'>${file.name}</a>`
        }

        this.editor.setContent(this.editor.getContent() + _a)
        return false
      }).then(() => false)
      return false
    },

    // 传文件到oss
    async fileToOss(file, cb) {
      let dir = await this.getUrl()

      uploadFileToOss(file, dir, key => {
        // 上传成功
        fetchData({
          ...apis.UPLOAD_VISIT_PATH_GET,
          data: { path: key }
        }).then(res => {
          console.log(res)
          if (res.data.code === 0) {
            cb(res.data.msg)
          } else {
            showToast('error', res.data.msg)
          }
        })
      })
    },

    // 从服务器获取上传的文件夹
    async getUrl() {
      return fetchData({
        ...apis.UPLOAD_REALPATH_GET,
        data: { uploadType: 'remark' }
      }).then(res => {
        if (res.data.code === 0) {
          return res.data.msg
        }
      })
    },

    getUEContent() {
      // 获取内容方法
      return this.editor.getContent()
      this.$emit('input', this.editor.getContent())
    },
    getRange() {
      return this.editor.selection.getRange()
    },
    unhtml(html) {
      return UE.utils.unhtml(html)
    },
    html(html) {
      return UE.utils.html(html)
    }
  },

  beforeDestory() {
    this.editor.destroy()
    localStorage.removeItem('ueditor_preference')
    this.X = null
  }
}
</script>
<style>
.edui-default .edui-toolbar .edui-button,
.edui-default .edui-toolbar .edui-splitbutton,
.edui-default .edui-toolbar .edui-menubutton,
.edui-default .edui-toolbar .edui-combox {
  line-height: 1;
}
</style>

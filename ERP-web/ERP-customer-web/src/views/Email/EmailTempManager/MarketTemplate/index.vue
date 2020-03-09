<template>
  <div class="add-template-manager">
    <yt-dialog :options="options">
      <el-form :model="dialogForm" ref="dialogForms" label-width="0" class="demo-ruleForm">
        <el-table :data="dialogData" style="width: 100%" border class="table-top14">
          <el-table-column prop="name" label="模板类型" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" class="channel-input input-wrap-layout" prop="saleType">
                <el-select placeholder v-model="dialogForm.saleType">
                  <el-option label="索取好评" :value="1"></el-option>
                  <el-option label="产品推广" :value="2"></el-option>
                  <el-option label="延迟发货" :value="3"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="模板名称" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" class="channel-input input-wrap-layout" prop="templateName">
                <el-input v-model="dialogForm.templateName" placeholder></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="模板语言" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" class="channel-input input-wrap-layout" prop="languageId">
                <el-select placeholder v-model="dialogForm.languageId">
                  <el-option v-for="item in languageList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="模板分类">
            <template slot-scope="scope">
              <el-form-item size="small" class="channel-input input-wrap-layout" prop="platformIds">
                <el-form-item size="small" class="channel-input input-wrap-layout" prop="superArray">
                  <el-cascader
                    :options="selectOptions"
                    v-model="dialogForm.superArray"
                    placeholder
                    @change="handleChange"
                  ></el-cascader>
                </el-form-item>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="dialogData" style="width: 100%" border class="table-top14">
          <el-table-column prop="name" label="模板主题" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" prop="subject">
                <el-input v-model="dialogForm.subject" placeholder prop="subject"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="dialogData" style="width: 100%" border class="table-top14">
          <el-table-column prop="name" width="718" label="模板内容" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" prop="context">
                <UeEditor v-model="dialogForm.context" ref="editor" :config="editorConfig"/>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="替换标签" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" class="channel-input input-wrap-layout">
                <copy-btn :vertical="vertical" @btnInput="btnInput"></copy-btn>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="form-row select-input">
          <el-col :span="2">
            <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="dialogForm.activateFlag">是否启用</el-checkbox>
          </el-col>
        </el-row>
        <el-row class="saveBtn">
          <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
        </el-row>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import CopyBtn from '../../Comment/CopyBtn'
export default {
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    classifyType: {
      type: Number,
      default: () => {
        return 2
      }
    },
    templateType: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data() {
    return {
      loading: false,
      selectOptions: [
        {
          value: null,
          label: '所有分类'
        }
      ],
      options: {
        visible: false,
        title: '添加',
        width: '1000px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      dialogData: [{}],
      dialogForm: {},
      editorConfig: {
        initialFrameHeight: 160,
        initialFrameWidth: 697
      },
      vertical: true
    }
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler(val) {
        let vm = this
        this.options.visible = val
        if (val) {
          //模板分类
          vm.$api['email/classificationList']({
            classifyType: vm.classifyType
          })
            .then(data => {
              if (!data) return
              let val = data.rows
              vm.selectOptions = vm.getClassifyName(val.childs)
            })
            .catch(err => {
              console.log(err)
            })
        }
      }
    },
    form: {
      immediate: true,
      deep: true,
      handler(val) {
        val = JSON.parse(JSON.stringify(val))
        this.dialogForm = val
      }
    }
  },
  created() {
    this.getLanguageList()
    this.getPlatformList()
  },
  computed: {
    ...mapState('product', ['platformList', 'languageList'])
  },
  methods: {
    ...mapActions('product', ['getPlatformList', 'getLanguageList']),
    handleChange(val) {
      this.dialogForm.emailClassificationId = val[val.length - 1]
    },
    getClassifyName(params) {
      let vm = this
      let options = []
      for (let i = 0; i < params.length; i++) {
        let item = params[i]
        let obj = {}
        if (item.classifyName && item.emailClassificationId) {
          obj.label = item.classifyName
          obj.value = item.emailClassificationId
          options.push(obj)
        }
        if (item.childs && item.childs.length) {
          obj.children = vm.getClassifyName(item.childs)
        }
      }
      return options
    },
    btnInput(item) {
      let vm = this
      vm.$refs.editor.setStr(item)
    },
    handleSubmit() {
      let vm = this
      vm.loading = true
      let params = JSON.parse(JSON.stringify(vm.dialogForm))
      params = Object.assign(params, {
        templateType: vm.templateType
      })
      if (params.superArray) {
        delete params.superArray
      }
      if (!params.activateFlag) {
        params.activateFlag = 0
      }
      vm.getVerification(params)
      if (!vm.verificationFlag) {
        vm.loading = false
        return
      }
      vm.$api['email/templateSave'](params)
        .then(data => {
          if (data.code === 0) {
            vm.options.visible = false
            vm.loading = false
            vm.$emit('formSubmit')
          }
        })
        .catch(() => {
          vm.loading = false
        })
    },
    getVerification(form) {
      let vm = this
      vm.verificationFlag = false
      if (!form.saleType) {
        this.verification('请选择模板类型')
        return
      }
      if (!form.templateName) {
        this.verification('请输入模板名称')
        return
      }
      if (!form.languageId) {
        this.verification('请选择模板语言')
        return
      }
      if (!form.emailClassificationId) {
        this.verification('请选择模板分类')
        return
      }
      if (!form.subject) {
        this.verification('请输入模板主题')
        return
      }
      if (!form.context) {
        this.verification('请输入模板内容')
        return
      }
      vm.verificationFlag = true
    },
    verification(msg) {
      let vm = this
      vm.$message({
        dangerouslyUseHTMLString: true,
        type: 'error',
        message: `<strong>${msg}</strong>`
      })
    }
  },
  components: {
    CopyBtn
  }
}
</script>

<style lang="scss">
</style>

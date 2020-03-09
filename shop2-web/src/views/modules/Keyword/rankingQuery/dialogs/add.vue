<template>
  <div>
    <addTasks :addOptions="addOptions" @clearInput="clearInput" ref="child" @changePlaceHolder="changePlaceHolder">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData" label-width="90px" label-position="left">
          <el-form-item label="查询类型" prop="adFlag" :rules="[{required:true,message:'请选择查询类型'}]">
            <el-select v-model="formData.adFlag" size="small">
              <el-option label="自然搜索" :value="0"></el-option>
              <el-option label="广告搜索" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否监控" prop="monitorFlag" :rules="[{required:true,message:'请选择是否监控'}]">
            <el-select v-model="formData.monitorFlag" size="small">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formData.monitorFlag === 1"
            label="监控周期"
            prop="monitor"
            :rules="[{required:true,message:'请选择监控周期'}]"
          >
            <el-date-picker
              v-model="formData.monitor"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              size="small"
            ></el-date-picker>
          </el-form-item>

          <el-form-item
            v-if="formData.monitorFlag === 1"
            label="监控频率"
            prop="frequency"
            :rules="[{required:true,message:'请选择监控频率'}]"
          >
            <el-select v-model="formData.frequency" size="small">
              <el-option label="10分钟" :value="10"></el-option>
              <el-option label="30分钟" :value="30"></el-option>
              <el-option label="60分钟" :value="60"></el-option>
              <el-option label="240分钟" :value="240"></el-option>
              <el-option label="1天" :value="60 * 24"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="asin" :rules="asin1Rule()">
            <span slot="label">
              <span style="color: #f56c6c;margin-right: 4px;">*</span>ASIN
            </span>
            <el-input
              size="medium"
              v-model="formData.asin"
              @change="asinInputMethod"
              :disabled="asinTagShow"
              placeholder="请输入ASIN"
            >
              <template slot="prepend" v-if="asinTagShow">
                <el-tag type="warning" closable @close="asinTagMethod()">{{asinTagText}}</el-tag>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="compareAsin">
            <div slot="label">
              对比ASIN
              <ElTooltip content="非必填,填写后,将会对产品排名进行对比" placement="right" style="margin-left: 4px;">
                <i class="el-icon-info"></i>
              </ElTooltip>
            </div>
            <el-input
              size="medium"
              v-model="formData.compareAsin"
              @change="ConAsinInputMethod"
              :disabled="ConAsinTagShow1 && ConAsinTagShow2"
              placeholder="请输入对比ASIN"
            >
              <template slot="prepend" v-if="ConAsinTagShow1">
                <el-tag type="warning" closable @close="ConAsinTag1Method()">{{ConAsinTagText1}}</el-tag>
              </template>
              <template slot="prepend" v-if="ConAsinTagShow2">
                <el-tag type="warning" closable @close="ConAsinTag2Method()">{{ConAsinTagText2}}</el-tag>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="keyword" label-width="0">
            <el-input v-model="formData.keyword" type="textarea" rows="5" :placeholder="placeText"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </addTasks>
  </div>
</template>

<script>
import addTasks from 'Views/common/dialog/addTasks.vue'
export default {
  data() {
    return {
      //传给子组件参数
      addOptions: {
        rightTitle: '关键词', //右侧表格标题
        regText: this.$const['OTHER/keywordExp'], //验证规则,现在是逐个验证;
        num: 200
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //禁用以前的日期，今天不禁用
          // return date.getTime() <= Date.now();    //禁用今天以及以前的日期
        }
      },
      formData: {
        monitor: null,
        adFlag: null,
        monitorFlag: 0,
        asin: null,
        compareAsin: null,
        frequency: null,
        keyword: null
      },
      asinTagText: null,
      ConAsinTagText1: null,
      ConAsinTagText2: null,
      asinTagShow: false,
      ConAsinTagShow1: false,
      ConAsinTagShow2: false,
      asinRule: /^(?=.*?[A-Z])(?=.*?[0-9])[A-Z0-9]{10,10}$|^[0-9]{10,10}$/,
      placeText: `多个关键词换行输入，最多限制200个......`
    }
  },
  methods: {
    changePlaceHolder(data) {
      this.placeText = data
    },
    //判断是否需要清空input,如果全部验证通过需要清空input,反之则留下未验证通过的;
    clearInput(data) {
      if (data) {
        this.formData.keyword = data
      } else {
        this.formData.keyword = null
        this.$nextTick(() => {
          this.$refs.formData.clearValidate()
        })
      }
    },
    _submit() {
      let [...childData] = this.$refs.child.formList
      if (childData && childData.length == 0)
        return this.$message.warning('请添加关键词!')
      return this.$refs.formData.validate().then(() => {
        let params = {
          ...this.storeInfo,
          asin: this.asinTagText,
          compareAsin1: this.ConAsinTagText1,
          compareAsin2: this.ConAsinTagText2,
          adFlag: this.formData.adFlag,
          monitorFlag: this.formData.monitorFlag,
          monitorFrom:
            this.formData.monitorFlag === 1 ? this.formData.monitor[0] : null,
          monitorTo:
            this.formData.monitorFlag === 1 ? this.formData.monitor[1] : null,
          frequency:
            this.formData.monitorFlag === 1 ? this.formData.frequency : null,
          keywords: childData
        }

        return this.$api['keyword/taskKeywordRankSave'](params)
      })
    },
    ConAsinInputMethod(e) {
      if (e && this.asinRule.test(e)) {
        if (this.ConAsinTagText1) {
          this.ConAsinTagShow2 = true
          this.ConAsinTagText2 = e
        } else {
          this.ConAsinTagShow1 = true
          this.ConAsinTagText1 = e
        }
        this.formData.compareAsin = ''
      } else {
        this.formData.compareAsin = ''
      }
    },
    asinInputMethod(e) {
      if (e && this.asinRule.test(e)) {
        this.asinTagShow = true
        this.asinTagText = e
        this.formData.asin = ''
      } else {
        this.formData.asin = ''
      }
    },
    asinTagMethod() {
      this.asinTagShow = false
      this.asinTagText = null
    },
    ConAsinTag1Method() {
      this.ConAsinTagShow1 = false
      this.ConAsinTagText1 = null
    },
    ConAsinTag2Method() {
      this.ConAsinTagShow2 = false
      this.ConAsinTagText2 = null
    },
    asin1Rule() {
      let asin1Rule = (rule, value, cb) => {
        if (!this.asinTagText) cb(new Error('请输入正确的ASIN'))
        if (this.ConAsinTagText1 == this.asinTagText)
          cb(new Error('ASIN和对比ASIN不能一样'))
        cb()
      }
      return [
        {
          validator: asin1Rule,
          trigger: 'blur'
        }
      ]
    }
  },
  components: {
    addTasks
  }
}
</script>

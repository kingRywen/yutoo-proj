<template>
  <div class="form-item">
    <ElRow>
      <ElCol v-for="(item, index) in items" :span="item.span" :key="index">
        <!-- input -->
        <template v-if="item.type == 'input'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'input'">
            <div style="white-space:nowrap;padding-right: 4px;" v-if="item.frontLabel">{{item.frontLabel}}</div>
            <ElInput
              v-model="form[item.value || 'input']"
              :placeholder="item.placeholder || ''"
              :style="item.style || null"
              :size="item.size || 'small'"
              clearable
            ></ElInput>
            <div style="white-space:nowrap;padding-left: 4px;" v-if="item.backLabel">{{item.backLabel}}</div>
          </ElFormItem>
        </template>
        <!-- select -->
        <template v-else-if="item.children && item.type == 'select'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'select'">
            <div style="white-space:nowrap;padding-right: 4px;" v-if="item.frontLabel">{{item.frontLabel}}</div>
            <el-select
              v-model="form[item.value || 'select']"
              clearable
              :placeholder="item.placeholder || ''"
              :style="item.style || null"
              :size="item.size || 'small'"
              @change="() => {
                    typeof item.changeFn == 'function' && item.changeFn()
                  }"
            >
              <el-option v-for="(i, idx) in item.children" :key="idx" :label="i.label" :value="i.value"></el-option>
            </el-select>
            <div style="white-space:nowrap;padding-left: 4px;" v-if="item.backLabel">{{item.backLabel}}</div>
          </ElFormItem>
        </template>
        <!-- 文本域 -->
        <template v-else-if="item.type == 'textarea'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'textarea'">
            <div style="white-space:nowrap;padding-right: 4px;" v-if="item.frontLabel">{{item.frontLabel}}</div>
            <el-input
              type="textarea"
              :autosize="item.autosize || { minRows: 2, maxRows: 4 }"
              :placeholder="item.placeholder || null"
              v-model="form[item.value || 'textarea']"
            ></el-input>
            <div style="white-space:nowrap;padding-left: 4px;" v-if="item.backLabel">{{item.backLabel}}</div>
          </ElFormItem>
        </template>
        <!-- number -->
        <template v-else-if="item.type == 'number'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'number'">
            <div style="white-space:nowrap;padding-right: 4px;" v-if="item.frontLabel">{{item.frontLabel}}</div>
            <el-input-number
              :class="{numClass: item.controls == false}"
              v-model="form[item.value || 'number']"
              :controls-position="item.controlsPosition"
              :min="item.min || 0"
              :max="item.max || 999999"
              :controls="item.controls != false"
              @change="() => {
                    typeof item.changeFn == 'function' && item.changeFn()
                  }"
            ></el-input-number>
            <div style="white-space:nowrap;padding-left: 4px;" v-if="item.backLabel">{{item.backLabel}}</div>
          </ElFormItem>
        </template>
        <!-- mult 多选 -->
        <template v-else-if="item.children && item.type == 'mult'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'multiple'">
            <div style="white-space:nowrap;padding-right: 4px;" v-if="item.frontLabel">{{item.frontLabel}}</div>
            <el-select
              v-model="form[item.value || 'multiple']"
              clearable
              collapse-tags
              :placeholder="item.placeholder || ''"
              multiple
              :style="item.style || null"
              :size="item.size || 'small'"
              @change="() => {
                    typeof item.changeFn == 'function' && item.changeFn()
                  }"
            >
              <el-option v-for="(i, idx) in item.children" :key="idx" :label="i.label" :value="i.value"></el-option>
            </el-select>
            <div style="white-space:nowrap;padding-left: 4px;" v-if="item.backLabel">{{item.backLabel}}</div>
          </ElFormItem>
        </template>
        <!-- 时间 -->
        <template v-else-if="item.type == 'time'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'time'">
            <div style="white-space:nowrap;padding-right: 4px;" v-if="item.frontLabel">{{item.frontLabel}}</div>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              :size="item.size || 'small'"
              v-model="form[item.value || 'time']"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              @change="timeChange(item)"
              @clear="() => form[item.value] = []"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :style="item.style || null"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <div style="white-space:nowrap;padding-left: 4px;" v-if="item.backLabel">{{item.backLabel}}</div>
          </ElFormItem>
        </template>
        <!-- 激活 -->
        <template v-else-if="item.type == 'active'">
          <ElFormItem :label="item.label || '是否激活'" :prop="item.value || 'activateFlag'">
            <el-checkbox v-model="form[item.value || 'activateFlag']" :true-label="1" :false-label="0"></el-checkbox>
          </ElFormItem>
        </template>
        <!-- radio -->
        <template v-else-if="item.children && item.type == 'radio'">
          <ElFormItem :label="item.label || ''" :prop="item.value || 'radio'">
            <el-radio-group
              v-model="form[item.value || 'radio']"
              @change="() => {
                    typeof item.changeFn == 'function' && item.changeFn()
                  }"
            >
              <el-radio v-for="(i, idx) in item.children" :label="i.value" :key="idx">{{i.label}}</el-radio>
            </el-radio-group>
          </ElFormItem>
        </template>
        <!-- table -->
        <template v-else-if="item.type == 'table'">
          <div class="twp-table">
            <ElRow v-if="item.config && item.config.title">
              <ElCol :span="24">
                <div class="title">{{item.config.title}}</div>
              </ElCol>
            </ElRow>
            <ElRow>
              <ElCol
                class="table-head"
                v-for="(i, index) in item.config.thead"
                :span="i.span || Math.floor(24/item.config.thead.length)"
                :key="index"
              >{{i.label}}</ElCol>
            </ElRow>
            <!-- <ElRow>
              <template v-for="(i, idx) in item.config.tbody">
                <ElCol :key="i.id" class="table-body" :span="i.span || Math.floor(24/item.config.thead.length)">
                  <form-item :items="i.items" :value.sync="form" :key="idx"></form-item>
                </ElCol>
              </template>
            </ElRow>-->
            <ElRow v-for="(row,index) in item.config.tbody" :key="index">
              <template v-for="(i, idx) in row">
                <div v-if="idx < item.config.thead.length">
                  <ElCol
                    v-if="dataType(i) == 'Array'"
                    :key="i.id"
                    class="table-body"
                    :span="i.span || Math.floor(24/item.config.thead.length)"
                  >
                    <form-item :items="i" :value.sync="form" :key="idx"></form-item>
                  </ElCol>
                  <ElCol
                    v-else-if="dataType(i) == 'Object' && i.type != 'string'"
                    :key="idx"
                    class="table-body"
                    :span="i.span || Math.floor(24/item.config.thead.length)"
                  >
                    <form-item :items="[i]" :value.sync="form" :key="idx"></form-item>
                  </ElCol>
                  <ElCol
                    v-else-if="dataType(i) == 'Object' && i.type == 'string'"
                    :key="idx"
                    class="table-body"
                    style="line-height: 67px;padding-top: 0;"
                    :span="i.span || Math.floor(24/item.config.thead.length)"
                  >{{form[i.value]}}</ElCol>
                </div>
              </template>
            </ElRow>
          </div>
        </template>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
export default {
  name: 'form-item',
  props: {
    items: {
      type: Array,
      default: () => {
        return {}
      }
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {},

  data() {
    return {
      time: [],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  methods: {
    dataType(val) {
      return this.$.dataType(val)
    },
    timeChange() {
      // if (Array.isArray(item.value) && item.value.length == 2) {
      //   this.form[item.value[0]] = form.time[0]
      //   this.form[item.value[1]] = form.time[1]
      //   delete this.form.time
      // }
    }
  },
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  components: {}
}
</script>

<style lang='scss'>
.form-item {
  background: #fff;
  .el-form-item__content {
    display: flex;
  }
  .twp-table {
    background: #fff;
    .title {
      width: 100%;
      height: 40px;
      background: #f5f7fa;
      line-height: 40px;
      padding-left: 10px;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: bold;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
    .table-head {
      text-align: center;
      border: 1px solid #ebeef5;
      border-right: none;
      height: 40px;
      line-height: 40px;
      &:first-child {
        border-right: none;
      }
      &:last-child {
        border-right: 1px solid #ebeef5;
      }
    }
    .table-body {
      padding: 0 6px;
      text-align: center;
      border: 1px solid #ebeef5;
      border-top: none;
      border-right: none;
      height: 67px;
      padding-top: 15px;
      &:first-child {
        border-right: none;
      }
      &:last-child {
        border-right: 1px solid #ebeef5;
      }
      .twp-form {
        .el-row {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .mt10 {
      margin-top: 10px;
    }
  }
}
</style>
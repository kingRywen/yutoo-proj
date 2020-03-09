<template>
  <ElFormItem
    :style="{width:width,marginBottom: type == 'custom' ? 0 : '14px'}"
    class="t-form-item"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div style="width: 100%" class="form-item-wrap">
      <span class="text-class">
        <slot name="front"></slot>
      </span>
      <!-- input -->
      <ElInput
        v-if="type == 'input'"
        v-model="vals"
        style="width: 100%"
        v-bind="$attrs"
        v-on="$listeners"
        clearable
      ></ElInput>
      <!-- number -->
      <el-input-number
        v-if="type == 'number'"
        style="width: 100%"
        v-model="vals"
        controls-position="right"
        v-bind="$attrs"
        v-on="$listeners"
        :min="0"
        clearable
      ></el-input-number>
      <!-- password -->
      <ElInput
        v-else-if="type == 'password'"
        v-model="vals"
        style="width: 100%"
        type="password"
        v-bind="$attrs"
        v-on="$listeners"
        clearable
      ></ElInput>
      <!-- 按钮 -->
      <ElButton
        style
        v-else-if="type == 'btn'"
        type="primary"
        v-bind="$attrs"
        v-on="$listeners"
      >{{btnText}}</ElButton>
      <!-- textarea -->
      <ElInput
        v-else-if="type == 'textarea'"
        type="textarea"
        :autosize="{ minRows: Number(minRows), maxRows: Number(maxRows)}"
        v-model="vals"
        style="width: 100%"
        v-bind="$attrs"
        v-on="$listeners"
        clearable
      ></ElInput>
      <!-- check 是否激活-->
      <el-checkbox
        v-else-if="type == 'check'"
        :true-label="1"
        :false-label="0"
        v-model="vals"
        style="width: 100%"
      ></el-checkbox>

      <!-- 单一时间 -->
      <el-date-picker
        v-else-if="type == 'singleTime'"
        :value-format="valueFormat"
        v-model="vals"
        type="date"
        style="width: 100%"
        v-bind="$attrs"
        v-on="$listeners"
      ></el-date-picker>

      <!-- time -->
      <el-date-picker
        v-else-if="type == 'time'"
        value-format="yyyy-MM-dd HH:mm:ss"
        :type="'datetimerange'"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        v-model="vals"
        style="width: 100%"
        v-bind="$attrs"
        v-on="$listeners"
        clearable
      ></el-date-picker>
      <!-- date -->
      <el-date-picker
        v-else-if="type == 'datetime'"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        align="right"
        v-model="vals"
        style="width: 100%"
        v-bind="$attrs"
        v-on="$listeners"
        clearable
      ></el-date-picker>
      <!-- multiple -->
      <template v-else-if="type == 'multiple'">
        <ElSelect
          multiple
          :collapse-tags="collapseTags"
          v-model="vals"
          style="width: 100%"
          v-bind="$attrs"
          v-on="$listeners"
          clearable
        >
          <ElOption
            v-for="(item, index) in list"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </template>
      <!-- select -->
      <template v-else-if="type == 'select'">
        <ElSelect v-model="vals" v-bind="$attrs" style="width: 100%" v-on="$listeners" clearable>
          <ElOption
            v-for="(item, index) in list"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></ElOption>
        </ElSelect>
      </template>
      <!-- checkbox -->
      <template v-else-if="type == 'checkbox'">
        <el-checkbox-group v-model="vals" style="width: 100%" v-bind="$attrs" v-on="$listeners">
          <el-checkbox v-for="(item, index) in list" :key="index" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </template>
      <!-- radio -->
      <template v-else-if="type == 'radio'">
        <el-radio-group
          style="width: 100%;margin-top:8px"
          v-model="vals"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <el-radio v-for="(item, index) in list" :key="index" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </template>
      <!-- 上传 -->
      <template v-else-if="type == 'upload'">
        <el-upload
          style="width: 100%"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :on-success="onSuccess"
          :on-error="onError"
          :show-file-list="true"
          :http-request="handleHttpRequests"
          :file-list="vals"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <el-button size="small" type="primary">{{upBtnText}}</el-button>
          <div slot="tip" class="el-upload__tip">
            <slot name="tip"></slot>
          </div>
        </el-upload>
      </template>

      <!-- 编辑器 -->
      <template v-else-if="type == 'editor'">
        <UeEditor ref="editor" v-model="vals" :config="editorConfig" />
      </template>
      <template v-else-if="type == 'custom'">
        <slot></slot>
      </template>
      <span class="text-class">
        <slot name="back"></slot>
      </span>
    </div>
  </ElFormItem>
</template>

<script>
import { oss } from "@yutoo/yutoo/utils/utils.umd.min";
import { OSS_CONFIG } from "Config";
import storage from "Utils/saver";
export default {
  name: "t-form-item",
  props: {
    uploadFile: {
      type: Boolean,
      default: false
    },
    dateType: {
      type: String
    },
    type: {
      type: String,
      default: "input"
    },
    valueFormat: {
      type: String,
      default: "yyyy-MM-dd"
    },
    value: {},
    width: {
      type: String,
      default: "100%"
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    minRows: {
      type: [Number, String],
      default: 2
    },
    maxRows: {
      type: [Number, String],
      default: 4
    },
    btnText: {
      // 按钮名称
      type: String,
      default: "确定"
    },
    upBtnText: {
      // 上传按钮名称
      type: String,
      default: "点击上传"
    },
    editorConfig: {
      // 编辑器属性
      type: Object,
      default: () => {
        return {
          initialFrameHeight: 196,
          initialFrameWidth: 718
        };
      }
    },
    collapseTags: {
      type: Boolean,
      default: true
    }
  },
  created() {
    // if (this.type == 'btn') {
    // }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  computed: {
    vals: {
      get() {
        if (
          (this.type == "time" ||
            this.type == "multiple" ||
            this.type == "checkbox") &&
          this.value == undefined
        ) {
          return [];
        }
        return this.value;
      },
      set(val) {
        this.$emit("update:value", val);
      }
    }
  },
  methods: {
    getEditHtml(val) {
      return this.$refs.editor.html(val);
    },
    handleChange(file, fileList) {
      this.vals = fileList;
    },
    handleRemove(file, fileList) {
      this.vals = fileList;
    },
    onSuccess(res) {
      console.log(res);
    },
    onError(err) {
      console.log(err);
    },
    handleHttpRequests() {
      let vm = this;
      console.log(vm.vals);
      if (vm.uploadFile) {
        this.$emit("handleHttpRequests");
        return;
      }

      const token = storage.get("local", "token");
      vm.$api[`finance/financeGlobalFilePath`]()
        .then(async data => {
          let { path } = data;
          let res = await oss.batchUpload(
            vm.vals.filter(el => el.ossUrl == null).map(el => el.raw),
            path,
            OSS_CONFIG.signUrl,
            null,
            token
          );
          // eslint-disable-next-line
          vm.vals.forEach(async (element, index) => {
            if (!element.ossUrl) {
              element.ossUrl = res.shift();
            }
            element.url = element.ossUrl;
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang='scss'>
.t-form-item {
  .form-item-wrap {
    display: flex;
    .text-class {
      display: inline-block;
      padding: 0 0px;
      white-space: nowrap;
    }
  }
  .mb0 {
    margin-bottom: 0px !important;
  }
  // .el-form-item--small.el-form-item {
  //   margin-bottom: 0;
  // }
}
</style>
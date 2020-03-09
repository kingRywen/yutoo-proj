<template>
  <!-- 描述可编辑工具 -->
  <div class='descriptionEditing'>
    <el-dialog title="复制代码" :visible.sync="cobyDialog" style="min-width:1200px;padding-right:100px;" width="35%">
      <el-form style="width:100%; padding-right:100px; ">
        <el-form-item label="" style="min-height:100px;">
          <el-input type="textarea" style="heigth:100px;" v-model="text1" id="input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="padding: 0 69px 30px 102px;">
        <el-button type="primary" style="width:50%; padding-rigtht" @click="cobySubmit()">确定复制</el-button>
      </div>
    </el-dialog>
    <el-row class='paddingBobbtom'>
      <span style="padding-right:15px; ">版本名称：</span>
      <el-input placeholder="请输入版本名称" v-model="inputText" clearable style='max-width:300px;'>
      </el-input>
      <el-button type="success" style="margin-left:20px; " @click="savedVersionSubmit()" v-if="firstPreservation">保存版本</el-button>
      <div style="float:right; right:50px;">
        <el-button type="success" @click="localList()">切换到版本列表</el-button>
        <el-button type="success" @click="onCoby(source)">复制源代码</el-button>
      </div>
    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键字输入 -->
    </el-row>
    <Editor v-model="editorVal" initId="editor1" :config="config" :defaultMsg="defaultMsg" :source.sync="source"></Editor>
    <el-button type="success" style=";margin-top:30px; " @click="savedVersionSubmit()" v-if="editShow">另存为版本</el-button>
  </div>
</template>

<script >
/* eslint-disable */
// 引入ueditor 引入编辑插件
import "../../../../../../static/editor/ueditor.config.js";
import "../../../../../../static/editor/ueditor.all.min.js";
import "../../../../../../static/editor/lang/zh-cn/zh-cn.js";
import "../../../../../../static/editor/ueditor.parse.min.js";
import Editor from "@/components/common/editor.vue";
import { mapActions, mapState, mapMutations } from "vuex";
import Clipboard from "clipboard";

export default {
  components: {
    Editor
  },
  data() {
    return {
      dataList: this.$route.params, //接收过来的路由参数
      editShow: false,
      firstPreservation: true,
      text1: "",
      formLabelWidth: "120px",
      cobyDialog: false,
      centerDialogVisible: false,
      source: "",
      // 文本内容
      editorVal: "",
      // 版本名称
      inputText: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      defaultMsg: "",
      pcRankingMonitoringTable: false,
      dialogTableVisible: false,
      // 来源
      originOptions: [
        {
          value: "选项1",
          label: "Google"
        },
        {
          value: "选项2",
          label: "速卖通"
        },
        {
          value: "选项3",
          label: "merchantwords"
        }
      ],
      originValue: "",
      // 状态
      StatusOptions: [
        {
          value: "选项1",
          label: "开启"
        },
        {
          value: "选项2",
          label: "抓取成功"
        }
      ],
      StatusValue: "",
      // 时间段
      tabPosition: "top",

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },

  created() {
    this.getParams();
    // this.addDescribeApi(); //添加描述
    this.getEditionListApi(); //版本列表
  },
  computed: {
    ...mapState("editingTools", {
      addDescribeLists: state => state.editionListget
    })
  },
  methods: {
    ...mapActions("editingTools", ["addDescribeApi", "getEditionListApi"]),
    ...mapMutations("editingTools", {
      setWordList: "addDescribeLists"
    }),

    getParams() {
      // 取到路由带过来的参数
      let versionName = this.$route.params.versionName;
      let content = this.$route.params.content;
      (this.inputText = versionName), (this.defaultMsg = content);
    },

    //复制源代码。弹出弹窗
    onCoby(source) {
      this.cobyDialog = true;
      this.text1 = this.source;
    },
    //确定，复制提交
    cobySubmit(text1) {
      this.cobyDialog = false;
      let input = document.getElementById("input");
      input.select(); //选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },

    //另存为版本
    savedVersionSubmit() {
      let params = {
        versionName: this.inputText,
        descriptionId: this.descriptionId,
        content: this.editorVal
      };
      if (!this.inputText == "" && !this.editorVal == "") {
        this.addDescribeApi(params);
        this.$message({
          message: "保存成功",
          type: "success"
        });
        (this.inputText = ""), (this.editorVal = ""), this.getEditionListApi();
      } else {
        this.$message({
          showClose: true,
          message: "不能为空",
          type: "warning"
        });
        return;
      }
    },
    //替换原来的文本
    update() {
      let params = {
        descriptionId: this.dataList.descriptionId,
        versionName: this.inputText,
        content: this.editorVal
      };
      this.$axios.post("/Description/update", params).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
        }
      });
    },
    // table选中
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // table删除
    deleteRow(tableData) {
      console.log(tableData);
      tableData.splice(
        tableData.splice(tableData.findIndex(item => item.Numbering === "美国"))
      ); // 删除对象中的name值为美国的。开发中会是该项的id
      // tableData.remove(1);
    },
    //
    // 切换本地列表
    localList() {
      this.$router.push({ name: "switchingLocalList" });
    },
    // 分页
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    }
  },
  watch: {
    $route: "getParams"
  }
};
</script>

<style scoped>
.keywordIndexContainer {
  margin-top: 20px;
}
.paddingBobbtom {
  padding-bottom: 10px;
}
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
</style>

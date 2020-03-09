<template>
  <!-- 描述可编辑工具 -->
  <div class='descriptionEditing'>
    <el-dialog :close-on-click-modal="false" title="复制源代码" :visible.sync="cobyDialog" width="600px">
      <el-form>
        <el-form-item label="">
          <el-input ref="input" type="textarea" :autosize="{ minRows: 6, maxRows: 8}" v-model="text1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="text-align:center">
        <el-button type="primary" style="width:50%; " @click="cobySubmit()">确定复制</el-button>
      </div>
    </el-dialog>
    <el-row class="__fixed_form">
      <el-form :inline="true">
        <el-form-item label="版本名称">
          <el-input placeholder="请输入版本名称" v-model.trim="inputText" clearable style='max-width:150px;'>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="savedVersionSubmit()" v-if="firstPreservation">保存版本</el-button>
        </el-form-item>
        <el-form-item>
          <span> {{this.charge}}点/每次</span>
        </el-form-item>
        <el-form-item style="float:right;margin-right:0">
          <el-button type="success" @click="localList()">切换到版本列表</el-button>
          <el-button type="success" @click="onCoby(source)">复制源代码</el-button>
        </el-form-item>
      </el-form>

    </el-row>
    <!-- 布局 -->
    <el-row :gutter="24" type='flex' justify="space-between">
      <!-- 输入框 关键词输入 -->
    </el-row>
    <Editor v-model="editorVal" initId="editor1" :config="config" :defaultMsg="defaultMsg" :source.sync="source" ref="edit"></Editor>
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
      surplusAmount: null, //剩余点数
      charge: null, //点数

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
        initialFrameHeight: 600
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
      tabPosition: 30,

      // 放删除选中的数组
      multipleSelection: [],
      // 分页
      currentPage3: 1
    };
  },

  created() {
    this.getParams();
    // this.addDescribeApi(); //添加描述
    // this.getEditionListApi(); //版本列表
    this.getPointeApi(); //请求扣点
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
    getListData() {
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10
      };
      this.$axios.post("/Description/list", params).then(res => {});
    }, // saveEditionListApi() {
    //   let params = {
    //     platformId:  this.$store.state.common.savePlatformIdAndSiteId.split("," )[0],
    //     versionName: "v2.0",
    //     content: "<p></p>"
    //   };
    //   this.$axios.post("")
    // },
    // 请求扣点   描述编辑工具扣点
    getPointeApi() {
      this.$axios.post("/FunctionMkt/description/list").then(res => {
        if (res.data.code == 0) {
          this.surplusAmount = res.data.data.surplusAmount;
          this.charge = res.data.data.charge;
        }
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          return;
        }
      });
    },
    getParams() {
      // 取到路由带过来的参数
      let versionName = this.$route.params.versionName;
      let content = this.$route.params.content;
      (this.inputText = versionName), (this.defaultMsg = content);
    },

    //复制源代码。弹出弹窗
    onCoby(source) {
      this.cobyDialog = true;
      if (this.source.indexOf("&gt;请输入内容&lt") > -1) {
        this.text1 = "";
      } else {
        this.text1 = this.$refs.edit.getHtml();
      }
    },
    //确定，复制提交
    cobySubmit(text1) {
      this.cobyDialog = false;
      let input = this.$refs.input;
      input.select(); //选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },

    //保存版本
    async savedVersionSubmit() {
      let content = this.$refs.edit.getUnhtml();
      // console.log(content);
      // return;
      let params = {
        versionName: this.inputText,
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        content
      };
      if (
        this.inputText == null ||
        this.editorVal == null ||
        this.inputText == "" ||
        this.editorVal == ""
      ) {
        this.$message({
          showClose: true,
          message: "版本名称和输入内容不能为空",
          type: "warning"
        });
        return;
      }

      if (this.inputText != null && this.editorVal != null) {
        let res = await this.addDescribeApi(params);
        if (res.code === 0) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "保存失败",
            type: "error"
          });
        }

        this.inputText = "";
        this.$refs.edit.clearText();
        this.editorVal = "";
        this.reloadPointApi(); // 重新获取点数
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
      // console.log(val);
    },
    // table删除
    deleteRow(tableData) {
      // console.log(tableData);
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
    // platformId(val) {
    //   this.getListsApi({ ...this.params, platformId: val });
    //   console.log(val);
    //   this.savedVersionSubmit(val);
    // }
  }
};
</script>

<style scoped>
.dialog-footer {
  /* margin-right: 160px; */
}
.timeCss {
  display: inline;
  margin-left: 30px;
  color: #00c0de;
  font-size: 12px;
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

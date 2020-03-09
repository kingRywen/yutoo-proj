<template>
  <!-- 描述可编辑工具 -->
  <div class='addNewEdition'>
    <el-dialog :close-on-click-modal="false" title="复制源代码" :visible.sync="cobyDialog" width="35%">
      <el-form>
        <el-form-item label="">
          <el-input ref="input" type="textarea" :autosize="{ minRows: 6, maxRows: 8}" v-model="text1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer " style="text-align:center">
        <el-button type="primary" style="width:50%;" @click="cobySubmit()">确定复制</el-button>
      </div>
    </el-dialog>
    <el-row class='__fixed_form'>
      <el-form :inline="true">
        <el-form-item label="版本名称">
          <el-input placeholder="请输入版本名称" v-model.trim="inputText" clearable style='max-width:300px;'>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" style="width:100%" @click="update">编辑保存/替换</el-button>
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
    <el-button type="success" style=";margin-top:15px; " @click="onSubmitDialog()">另存为版本</el-button>
    <el-dialog :close-on-click-modal="false" title="另存为版本" :visible.sync="editionDialog" class="editionDialog" style="padding-right:100px;" width="600px">
      <el-form :model="formEdition">
        <el-form-item label="版本名称" :label-width="formLabelWidth" style="width:88%">
          <el-input v-model="formEdition.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" style="margin-right: 174px;
    width: 204px;" @click="savedVersionSubmit()">确 定</el-button>
      </div>
    </el-dialog>
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
      formEdition: {
        name: null
      },
      editionDialog: false, //版本弹窗
      dataList: this.$route.params, //接收过来的路由参数
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
    this.$store.commit(
      "common/pathFromCheckProductAnalysis",
      "/admin/descriptionEditing"
    );
    // this.addDescribeApi(); //添加描述
    // this.getEditionListApi(); //版本列表
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

    //请求列表
    getEditionListApi(
      params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        pageNumber: 1,
        pageSize: 10
      }
    ) {
      this.$axios.post("/Description/list", params).then(res => {
        if (res.data.code == 500) {
          this.$message.error(res.data.msg);
          this.loading = false;
        }
        if (res.data.rows.length) {
          this.loading = false;
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.editionListget = res.data.rows;
        }
        if (!res.data.rows.length) {
          this.loading = false;
          this.currentPage = res.data.pageNo;
          this.total = res.data.total;
          this.pageSize = res.data.pageSize;
          this.editionListget = res.data.rows;
        }
      });
    },

    getParams() {
      // 取到路由带过来的参数
      let versionName = this.$route.query.versionName;
      let content = this.$route.query.content;
      (this.inputText = versionName), (this.defaultMsg = content);
    },

    //复制源代码。弹出弹窗
    onCoby(source) {
      this.cobyDialog = true;
      this.text1 = this.$refs.edit.getHtml();
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

    //另存为版本
    onSubmitDialog() {
      this.editionDialog = true;
    },
    //另存为版本提交
    savedVersionSubmit() {
      let params = {
        versionName: this.formEdition.name,
        descriptionId: this.$route.query.descriptionId,
        content: this.$refs.edit.getHtml()
      };
      if (!this.inputText == "" && !this.editorVal == "") {
        this.addDescribeApi(params).then(res => {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          // this.getEditionListApi();
          this.editionDialog = false;
          this.$router.push({
            path: "/admin/switchingLocalList"
          });

          (this.inputText = ""), (this.editorVal = "");
        });
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
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        descriptionId: this.$route.query.descriptionId,
        versionName: this.inputText,
        content: this.$refs.edit.getUnhtml()
      };
      this.$axios.post("/Description/update", params).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          // this.inputText = "";
          // this.editorVal = "";
          // this.defaultMsg = "";
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
  }
};
</script>

<style scoped>
/* .paddingBobbtom {
  padding-bottom: 10px;
} */
.keywordQuery .el-table th {
  background: #f2f2f2 !important;
  font-size: 15px;
  color: red;
  border: 1px solid #d7d3d3;
  border-right: none;
}
</style>

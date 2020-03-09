<!-- 复制导出加入关注 -->
<template>
  <div class="__wrapper_i">
    <!-- 添加关注 -->
    <el-dialog :close-on-click-modal="false" title="添加关注" :visible.sync="dialog.addFollowShow" width="600px">
      <div slot="title">
        <span class="el-dialog__title">添加关注</span>
      </div>
      <div class="box __box_wrapper addFollow">
        <el-form :model="dialog.form" ref="ruleForm" style="width:100%;">
          <el-form-item label="选择分组: " prop="group" label-width="80px" style="width:100%;">
            <el-cascader placeholder="" v-model="dialog.groupId" :options="dialog.options" :show-all-levels="true" :props="dialog.props"></el-cascader>
            <el-button type="primary" @click="dialog.groupDialog.addGroupShow=true">添加分组</el-button>
          </el-form-item>
          <el-form-item label-width="80px">
            <el-button type="primary" style="width:280px" @click.stop="addFollowSubmit()" :loading="dialog.loading">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 添加分组 -->
    <el-dialog :close-on-click-modal="false" title="添加分组" :visible.sync="dialog.groupDialog.addGroupShow" width="600px">
      <div slot="title">
        <span class="el-dialog__title">添加分组</span>
      </div>
      <div class="box __box_wrapper addFollow">
        <el-form :model="dialog.form" ref="ruleForm" style="width:100%;">
          <el-form-item label="分组名称: " prop="new_group" label-width="100px" style="width:100%;">
            <el-input v-model.trim="dialog.groupDialog.new_group" placeholder="请输入新分组" style="width:82%"></el-input>
          </el-form-item>
          <el-form-item label="选择上级分组: " label-width="100px" style="width:100%;" v-if="dialog.groupDialog.options==''?false:true">
            <el-cascader placeholder="默认根目录" :options="dialog.groupDialog.options" :show-all-levels="true" :props="dialog.groupDialog.props" v-model="dialog.groupDialog.parentGroupId" change-on-select style="width:82%;" clearable></el-cascader>
          </el-form-item>
          <el-form-item label-width="100px">
            <el-button :disabled="dialog.groupDialog.new_group.trim()!==''?false:true" :loading="dialog.groupDialog.loading" type="primary" style="width:280px" @click="addGroupSubmit()">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 加入竞争分析弹窗 -->
    <addCom :data="addDialog"></addCom>
    <!-- {{data}} -->
    <div class="margin_bottom8 margin_top8">
      <el-button :disabled="Disabled" type="success" :loading="buttonLoading.funCopyButtonLoading" @click="funCopy" ref="copy" class="copy" data-clipboard-action="copy" data-clipboard-target="#text">复制</el-button>
      <el-button v-if="data.length>0?false:true" type="success" :loading="buttonLoading.funExportButtonLoading" @click="funExport">导出全部</el-button>
      <el-button v-else :disabled="Disabled" type="success" :loading="buttonLoading.funExportButtonLoading" @click="funExport">导出</el-button>
      <el-button :disabled="Disabled" type="success" :loading="buttonLoading.funAddButtonLoading" @click="funAddShow()">加入关注</el-button>
      <el-button :disabled="Disabled" type="success" :loading="buttonLoading.funAddCompButtonLoading" @click="funAddComp">加入竞争分析</el-button>
    </div>
    <table id="text" style="position:fixed;left:-4000px">
      <tbody>
        <!-- <tr>
          <td>
            源关键词
          </td>
          <td>
            关键词
          </td>
          <td>
            类型
          </td>
          <td>
            深度
          </td>
        </tr> -->
        <tr v-for="item in data">
          <td>
            {{item.keywordSrc}}
          </td>
          <td>
            {{item.keyword}}
          </td>
          <td>
            <span v-if="item.keywordType=='0'">相关词</span>
            <span v-if="item.keywordType=='1'">下拉词</span>
            <span v-if="item.keywordType=='2'">联想词</span>
            <span v-if="item.keywordType=='3'">TAG词</span>
            <span v-if="item.keywordType=='4'">AdWords</span>
            <span v-if="item.keywordType=='-1'">-</span>
          </td>
          <td>
            {{item.keywordType==2||item.keywordType==3||item.keywordType==4?"-":item.depth==""?"-":item.depth}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import addCom from "@/components/common/addCom";
export default {
  props: {
    onExport: {},
    data: {},
    buttonLoading: {}
  },
  components: { addCom },
  data() {
    return {
      Disabled: true,
      // 添加关注弹窗
      dialog: {
        loading: false,
        addFollowShow: false,
        form: {},
        options: [],
        props: {
          value: "groupId",
          children: "groupingVOS",
          label: "groupName"
        },
        groupId: [-1],
        // 添加任务弹窗
        groupDialog: {
          addGroupShow: false,
          options: [],
          props: {
            value: "groupId",
            children: "groupingVOS",
            label: "groupName"
          },
          new_group: "",
          parentGroupId: [0],
          loading: false
        },
        add_disabled: false
      },
      // 加入竞争分弹窗
      addDialog: {
        show: false,
        type: ""
      }
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 复制
    funCopy() {
      this.clipboard = new Clipboard(".copy");
      let _this = this;
      this.clipboard.on("success", e => {
        this.$message({
          type: "success",
          message: "复制成功"
        });
        // 释放内存
        _this.clipboard.destroy();
      });
      this.clipboard.on("error", e => {
        // 不支持复制
        this.$message.error("浏览器不支持复制");
        // 释放内存
        _this.clipboard.destroy();
      });
    },
    //导出
    funExport() {
      this.onExport();
    },
    // 加入关注弹窗
    funAddShow(cb) {
      this.dialog.addFollowShow = true;
      this.$axios
        .post("/Grouping/list", {
          platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[0],
          siteId: this.$store.state.common.savePlatformIdAndSiteId.split(
            ","
          )[1],
          groupType: 0
        })
        .then(res => {
          if (cb) {
            cb(res);
            return;
          }
          // console.log(res.data.data.groupingVOS, "目录返回");
          let code = res.data.code;
          if (code === 0) {
            //第一个弹窗的分组
            this.dialog.options = Object.assign([], res.data.data.groupingVOS);
            // this.dialog.options.forEach((item, index) => {
            //   // if (item.groupName === "未分组") {
            //   //   item.groupName = "默认分组";
            //   // }
            // });
            // 第二个弹窗的选择上级分组
            this.dialog.groupDialog.options = Object.assign(
              [],
              res.data.data.groupingVOS
            );
            // this.dialog.groupDialog.options.forEach((item, index) => {
            //   if (item.groupName === "默认分组") {
            //     this.dialog.groupDialog.options.splice(index);
            //   }
            // });
            this.dialog.groupDialog.options = this.dialog.groupDialog.options.filter(
              function(item) {
                return item.groupName !== "未分组";
              }
            );
            // console.log(this.dialog.groupDialog.options);
          } else {
            this.dialog.options = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 确认添加分组
    addGroupSubmit() {
      const ids = JSON.parse(
        JSON.stringify(this.dialog.groupDialog.parentGroupId)
      );
      const name = this.dialog.groupDialog.new_group;
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        groupName: this.dialog.groupDialog.new_group,
        parentGroupId:
          this.dialog.groupDialog.parentGroupId == ""
            ? 0
            : this.dialog.groupDialog.parentGroupId[
                this.dialog.groupDialog.parentGroupId.length - 1
              ],
        groupType: 0
      };
      this.dialog.groupDialog.loading = true;

      this.$axios
        .post("/Grouping/save", params)
        .then(res => {
          let code = res.data.code;
          if (code === 0) {
            this.$message.success(res.data.msg);
            this.dialog.groupDialog.addGroupShow = false;
            this.funAddShow(res => {
              if (res.data.code === 0) {
                this.dialog.options = res.data.data.groupingVOS;
                let lastId = this.$.findGroupIdsByName(
                  name,
                  ids,
                  this.dialog.options
                );
                ids.push(lastId);
                this.dialog.groupId = ids;
              }
            }); // 添加成功之后重新请求分组
          } else if (res.data.code === 500) {
            this.$message.warning(res.data.msg);
          }
          this.dialog.groupDialog.new_group = "";
          this.dialog.groupDialog.loading = false;
        })
        .catch(err => {
          this.dialog.groupDialog.loading = false;
        });
    },
    // 加入关注
    addFollowSubmit() {
      this.dialog.loading = true;
      let keywords = [];
      this.data.forEach((item, index) => {
        if (item.keyword !== "" && item.keyword !== "-") {
          keywords.push(item.keyword);
        }
      });
      let params = {
        platformId: this.$store.state.common.savePlatformIdAndSiteId.split(
          ","
        )[0],
        siteId: this.$store.state.common.savePlatformIdAndSiteId.split(",")[1],
        groupId: this.dialog.groupId[this.dialog.groupId.length - 1],
        keywords: keywords
      };
      this.$axios
        .post("/KeywordLib/save", params)
        .then(res => {
          // console.log(res);
          let code = res.data.code;
          if (code === 0) {
            this.$message.success(res.data.msg);
            this.dialog.addFollowShow = false;
          } else if (res.data.code === 500) {
            this.$message.warning(res.data.msg);
          }
          this.dialog.loading = false;
        })
        .catch(err => {
          this.dialog.loading = false;
        });
    },
    // 加入竞争分析
    funAddComp() {
      this.addDialog.show = true;
      let arr = this.$store.state.common.userSelect;
      this.keywordsArr = [];
      arr.forEach((item, index) => {
        if (item.keyword !== "" && item.keyword !== "-") {
          this.keywordsArr.push(item.keyword);
        }
      });
      let str = this.keywordsArr.join(",");
      this.$store.commit("common/type_keyword", str);
      // this.addDialog.type = 2;
    }
  },
  computed: {},
  watch: {
    data() {
      if (this.data.length === 0) {
        this.Disabled = true;
      } else {
        this.Disabled = false;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
#text td {
  text-align: center;
}
</style>

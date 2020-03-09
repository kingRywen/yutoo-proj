<!-- 复制导出加入关注 -->
<template>
  <div class="__wrapper_i">
    <!-- 添加关注 -->
    <el-dialog
      class="customDialog"
      :close-on-click-modal="false"
      title="加入词库"
      :visible.sync="dialog.addFollowShow"
      width="500px"
    >
      <div slot="title">
        <span class="el-dialog__title" style="font-size:18px;">加入词库</span>
      </div>
      <div class="box __box_wrapper addFollow">
        <el-form size="small" :model="dialog.form" ref="ruleForm" style="width:100%;">
          <el-form-item label="选择类目词库: " prop="group" label-width="116px" style="width:100%;margin-bottom:15px;">
            <div class="flex">
              <el-cascader
                placeholder="选择类目词库"
                v-model="dialog.id"
                :options="dialog.options"
                :show-all-levels="true"
                :props="dialog.props"
                size="small"
                :filterable="true"
                clearable
              ></el-cascader>
              <el-button class="ml10" type="primary" @click="showAddCate" size="small">添加类目词库</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="txc" slot="footer">
        <el-button type="primary" @click.stop="addFollowSubmit()" :loading="dialog.loading" size="small">确认</el-button>
        <el-button type="primary" @click.stop="dialog.addFollowShow = false" size="small" plain>取消</el-button>
      </div>
    </el-dialog>
    <!-- 添加分组 -->
    <yt-dialog :close-on-click-modal="false" title="添加类目词库" :options='addGroupShowOpt'  :events='addGroupShowOptEvents'>
      <div slot="title">
        <span class="el-dialog__title" style="font-size:14px;">添加类目词库</span>
      </div>
      <div class="box __box_wrapper addFollow">
        <el-form :model="form" ref="ruleForm" style="width:100%;">
          <el-form-item label="添加类目词库: " label-width="126px" style="width:100%;">
            <!-- <el-cascader placeholder="默认根目录" :options="dialog.groupDialog.options" :show-all-levels="true" :props="dialog.groupDialog.props" v-model="dialog.groupDialog.parentGroupId" change-on-select style="width:82%;" clearable></el-cascader> -->
            <el-cascader
              placeholder="选择类目（只能选择最后一级）"
              :options="form.haveChildCateData"
              :show-all-levels="true"
              :props="form.props"
              v-model="form.ids"
              :change-on-select="false"
              style="width:280px;"
              clearable
              size="mini"
              :filterable="true"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <div class="txc" slot="footer">
        <el-button
          :disabled="form.ids.length>0?false:true"
          :loading="form.loading"
          type="primary"
          @click="addGroupSubmit()"
          size="mini"
        >确定</el-button>
        <el-button type="primary" @click.stop="addGroupShowOpt.visible = false" size="small" plain>取消</el-button>
      </div>
    </yt-dialog>

    <div class="margin_bottom8 margin_top8">
      <el-button
        :disabled="Disabled"
        type="primary"
        :loading="buttonLoading.funCopyButtonLoading"
        @click="funCopy"
        ref="copy"
        class="copy"
        data-clipboard-action="copy"
        data-clipboard-target="#text"
        size="mini"
        plain
      >复制</el-button>
      <el-button
        v-if="data.length>0?false:true"
        type="primary"
        :loading="buttonLoading.funExportButtonLoading"
        @click="funExport"
        size="mini"
        plain
      >导出全部</el-button>
      <el-button
        v-else
        :disabled="Disabled"
        type="primary"
        :loading="buttonLoading.funExportButtonLoading"
        @click="funExport"
        size="mini"
        plain
      >导出</el-button>
      <el-button
        :disabled="Disabled"
        type="primary"
        :loading="buttonLoading.funAddButtonLoading"
        @click="funAddShow()"
        plain
        size="mini"
      >加入词库</el-button>
      <table id="text" style="position:fixed;left:-4000px">
        <tbody>
          <tr v-for="item in data">
            <td>{{item.keywordSrc}}</td>
            <td>{{item.keyword}}</td>
            <td>
              <span v-if="item.keywordType=='0'">相关词</span>
              <span v-if="item.keywordType=='1'">下拉词</span>
              <span v-if="item.keywordType=='2'">联想词</span>
              <span v-if="item.keywordType=='3'">TAG词</span>
              <span v-if="item.keywordType=='4'">AdWords</span>
              <span v-if="item.keywordType=='-1'">-</span>
            </td>
            <td>{{item.keywordType==2||item.keywordType==3||item.keywordType==4?"-":item.depth==""?"-":item.depth}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
export default {
  props: {
    onExport: {},
    data: {},
    buttonLoading: {}
  },
  components: {},
  data() {
    return {
      Disabled: true,
      // 加入排名第一个弹窗
      dialog: {
        loading: false,
        addFollowShow: false,
        options: [],
        props: {
          value: 'cusCateId',
          label: 'cusCateName',
          children:'childList'
        },
        id: []
      },
      addGroupShowOpt:{
        visible:false,
        width:"500px",
        title:"添加类目词库",
      },
      addGroupShowOptEvents:{
        handleOKClick:()=>{

        }
      },
      form: {
        addGroupShow: false,
        loading: false,
        haveChildCateData: [],
        haveChildren: null,
        ids: [],
        props: {
          value: 'cusCateId',
          children: 'childList',
          label: 'cusCateName'
        }
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 复制
    funCopy() {
      // this.$message({
      //   dangerouslyUseHTMLString: true,
      //   message: "这是</br>片段"
      // });
      this.clipboard = new Clipboard('.copy')
      let _this = this
      this.clipboard.on('success', e => {
        this.$message({
          type: 'success',
          message: '复制成功'
        })
        // 释放内存
        _this.clipboard.destroy()
      })
      this.clipboard.on('error', e => {
        // 不支持复制
        this.$message.error('浏览器不支持复制')
        // 释放内存
        _this.clipboard.destroy()
      })
    },
    //导出
    funExport() {
      this.onExport()
    },
    // 加入类目弹窗
    funAddShow(cb) {
      // this.$message.warning("功能开发中");
      this.dialog.addFollowShow = true
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      this.$api['CategoryKeywordListForCategory'](params)
        .then(data => {
          // console.log(data, "目录返回");
          this.dialog.options = data.data
          if (cb) {
            cb(data)
            return
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 确认添加
    addFollowSubmit() {
      this.dialog.loading = true
      let keywords = []
      this.data.forEach((item, index) => {
        if (item.keyword !== '' && item.keyword !== '-') {
          keywords.push(item.keyword)
        }
      })
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        cusCateId: this.dialog.id.pop(),
        source: 'OTHER',
        keywords: keywords
      }
      this.$api['CategoryKeywordSaveDigKeyword'](params)
        .then(data => {
          // console.log(data, "data");
          this.dialog.addFollowShow = false
          this.dialog.loading = false
        })
        .catch(err => {
          // console.log(err, "err");
          // 超时error捕获
          let str = err + ''
          if (str.includes('timeout') !== -1) {
            this.$alert('超时请重试', '提示', {
              confirmButtonText: '确定',
              callback: action => {}
            })
          }
          this.dialog.loading = false
        })
    },
    // 点击添加类目词库 获取自定义类目列表
    showAddCate() {
      this.addGroupShowOpt.visible = true
      console.log('object');
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      this.$api['CustomCategoryList'](params)
        .then(data => {
          // console.log(data);
          // 不传haveChildren代表是获取列表，传haveChildren为1表示获取的是可添加下级目录的上级目录集合
          this.form.haveChildCateData = data.data
          // console.log(this.form.haveChildCateData);
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 确认添加类目词库
    addGroupSubmit() {
      const ids = JSON.parse(JSON.stringify(this.form.ids))
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        cusCateId: ids[ids.length - 1]
      }
      this.form.loading = true
      console.log(params)
      this.$api['CustomCategorySaveCategory'](params)
        .then(data => {
          this.addGroupShowOpt.visible = false
          this.form.loading = false
          // 添加成功end传入回调函数
          let lastId = ids[ids.length - 1]
          this.funAddShow(arg => {
            // arg是形参,在上面funAddShow参数会传入实参
            this.findCate(arg, lastId)
          })
          // 添加成功end
        })
        .catch(err => {
          this.form.loading = false
        })
    },
    // 根据lastId找到新添加的词库类目，展示到默认中
    findCate(arg, lastId) {
      // console.log(arg, "arg");
      // console.log(lastId, "lastId");
      let item = arg.data.find(el => {
        return el.cusCateId === lastId
      })
      if (item) {
        this.dialog.id = [item.cusCateId]
        // console.log(this.dialog.id);
      }
    }
  },
  computed: {},
  watch: {
    data() {
      if (this.data.length === 0) {
        this.Disabled = true
      } else {
        this.Disabled = false
      }
    }
  }
}
</script>

<style lang='scss' scoped>
#text td {
  text-align: center;
}
</style>

<!--  -->
<template>
  <div>
    <div v-if='$route.name==="Log" || $route.name === "SFMLog" || $route.name === "ProductDatasAnalysisWarningLog" || $route.name==="ProLog123" || $route.name==="AdLog"'  >
		<ElButton style="position: absolute;right:20px;top:-2px;" v-if="$route.name==='AdLog'" @click.stop="handleBack" type="text" icon="el-icon-back">返回</ElButton>
      <MainLayout :edits="edits" :editBtns="editBtns" :outerParams="outerParams" :searchFields="searchFields" :columns="columns" :searchFunc="searchFunc" @selectChange='selectChange' ref="layout" url="productInfoImportLogList">
      </MainLayout>
    </div>

    <router-view v-else></router-view>
    <a href="" ref='link'></a>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      parentSkus: null,
      //columns表格
      columns: [
        {
          label: "文件名称",
          value: "fileName"
        },
		{
		  label: "导入状态",
		  value: "status",
		  enum: {
		    0: "导入中",
		    1: "导入成功,无失败",
		    2: "导入成功,有失败记录"
		  }
		},
        {
          // img: true,
          label: "上传时间",
          value: "createTime"
        },
        
        // {
        //   label: "导入记录",
        //   value: "description"
        // }
      ],
      //表格列表操作按钮
      edits: [
        {
          name: "下载",
          icon: "el-icon-download",
          show: scope => {
            return scope.row.status===2
          },
          fn: scope => {
            //console.log(scope);
            this.download(scope);
          }
        }
      ],
      searchFields: [
		{
			label:'名称',
			name:'fileName',
			type:'input',
			placeholder: "请输入名称"
		},
        {
          label: "上传时间",
          name: "time",
          type: "dateRange",
          placeholder: "请选择"
        }
      ],
      editBtns: [
        // {
        //   name: "导出文件",
        //   fn: () => {
        //     // this.$refs.layout.$dialog({
        //     //   title: "导入商品费用明细",
        //     //   width: "500px",
        //     //   params: {
        //     //     downLoadUrl: "finance/downloadFile",
        //     //     uploadUrl: "finance/costImport",
        //     //     excellName: "商品费用明细"
        //     //     // type: "store",
        //     //   }
        //     // component: () => import("@/views/Common/downUpload"),
        //     // okBtnText: "确认",
        //     // cancelBtnText: "取消"
        //     // });
        //   }
        // },
        {
          name: "删除",
          fn: () => {
            this.delBtn();
          }
        }
    
      ],
      //外部参数
      outerParams: {
        startTime: null,
        endTime: null,
        platformId: this.platformId,
        siteId: null,
        sellerId: null,
		fileType:this.$route.query.type
      },
      slectIds: [] //选择的ID的数组
      //   tab2
    };
  },

  created() {
    if (this.sellerId && this.siteId) {
      this.outerParams.siteId = this.siteId;
      this.outerParams.sellerId = this.sellerId;
    }
  },
  mounted() {},
  methods: {
    //参数处理
    searchFunc(data) {
      let { time, ...info } = data;
      let [startTime, endTime] = time || [];
      return { startTime, endTime, ...info };
    }, //勾选改变
	handleBack(){
		this.$router.go(-1)
	},
    selectChange(v) {
      //   console.log(v);
      this.slectIds = [];
      v.forEach(i => {
        this.slectIds.push(i.logId);
      });
      //console.log(this.slectIds);
    },
    // 导出文件按钮
    // downloadFile() {
    //   this.$api[""]({
    //     siteId: this.outerParams.siteId,
    //     sellerId: this.outerParams.sellerId,
    //     ids: this.slectIds
    //   })
    //     .then(data => {})
    //     .catch(() => {});
    // },
    //删除按钮
    delBtn() {
      if (this.slectIds.length === 0) {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
        return;
      }
			this.$confirm('此操作将删除,是否继续','提示',{type:'warning'}).then(()=>{
				this.$api["productInfoRemoveImportLog"]({
				  siteId: this.outerParams.siteId,
				  sellerId: this.outerParams.sellerId,
				  ids: this.slectIds
				})
				  .then(data => {
				    if (data.code === 0) {
				      this.$refs.layout.getList();
				    }
				  })
				  .catch(() => {});
			}).catch(()=>{})
      
    },
    // 单个导出
    download(scope) {
      //console.log(scope);
      this.$api["productInfoDownloadImportReport"]({
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        logId: scope.row.logId
      })
        .then(data => {
            let url = window.URL.createObjectURL(new Blob([data]));
            let a = this.$refs.link;
            a.href = url;
            a.setAttribute("download", "日志.xlsx");
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(() => {});
    },
  },

  computed: {},
  watch: {
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.outerParams.siteId = this.siteId;
        this.outerParams.sellerId = this.sellerId;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
</style>

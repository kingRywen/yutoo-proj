<!--  -->
<template>
  <div class="box">
    <div v-if='$route.name==="ProDetails" || $route.name === "SFMProDetails"'>
      <tpl-drawer v-if='$route.name==="ProDetails" || $route.name === "SFMProDetails"'>
        <div slot="leftMenu" class="box-left-menu">
          <el-input clearable placeholder="输入类目过滤" v-model="filterText" size="mini" class="menu-select">
          </el-input>
          <div class="el-icon-box">
            <i class="el-icon-refresh common_color" @click="getCustomCategory"></i>
          </div>
          <el-tree class="leftTree" :expand-on-click-node="false" node-key="cusCateId" :data="customCategoryData" :props="defaultProps" highlight-current @node-click="handleNodeClick" ref="treeCustomCategory" :filter-node-method="filterNode" v-loading="treeLoading" :key='treeKey' default-expand-all :current-node-key="null">
            <!-- 鼠标移上去显示 -->
            <span class="span-ellipsis" slot-scope="{ node, data }">
              <span :title="node.label" class="font12">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
        <div slot="body" class="box-body" style="min-width:900px;">
          <MainLayout :edits="edits" :editBtns="editBtns" :outerParams="outerParams" :searchFields="searchFields" :columns="columns" :searchFunc="searchFunc" @selectChange='selectChange' ref="layout" url="productInfoCostList">
          </MainLayout>
        </div>
      </tpl-drawer>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import TplDrawer from "@/views/Common/tpl-drawer/index";
export default {
  components: { TplDrawer },
  data() {
    return {
      // sider
      filterText: null,
      treeLoading: false,
      treeKey: 1,
      customCategoryData: [],
      defaultProps: {
        children: "childList",
        label: "cusCateName"
      },
      cusCateId: null,
      // sider end
      parentSkus: null,
      editBtns: [
        {
          name: "导入商品费用明细",
          fn: () => {
            let vm = this
            this.$refs.layout.$dialog({
              title: "导入商品费用明细",
              size: "small",
              params: {
                success() {
                  vm.$refs.layout.closeDialog()
				  vm.getLayoutList()
                }
              },
              component: () => import("../FirstPage/dialogs/Upload.vue"),
            });
            // this.$refs.layout.$dialog({
            //   title: "导入商品费用明细",
            //   size: "small",
            //   params: {
            //     downLoadUrl: "finance/downloadFile",
            //     uploadUrl: "finance/costImport",
            //     excellName: "商品费用明细",
            //     edit:true
            //     // type: "store",
            //   },
            //   component: () => import("@/views/Common/downUpload"),
            //   okBtnText: "确认",
            //   cancelBtnText: "取消"
            // });
          }
        },
        {
          name: "导入日志",
          fn: () => {
            this.$router.push({
              name: "SFMLog",
			  query:{
				  type:0
			  }
            });
          }
        },
        {
          name: "清空费用",
          fn: () => {
            this.delBtn();
          }
        },
        {
          name: "添加费用",
          fn: (scope) => {
            return this.AddCost();
          }
        }
      ],
      //columns表格
      columns: [
        {
          label: "SKU",
          value: "sku",
          width:'200px'
        },
        {
          label: "ASIN",
          value: "asin",
          width:'200px'
        },
        {
          img: true,
          label: "主图",
          value: "imageUrl"
        },
        {
          label: "开始时间",
          value: "createTime",
          sortable: 'custom',
          width:"140px",
          // enum: {
          //   0: "导入中",
          //   1: "导入成功,无失败",
          //   2: "导入成功,有失败记录"
          // }
        },
        {
          label: "成本",
          value: "cost",
          sortable: 'custom'
        },
        {
          label: "FBA配送费",
          value: "fbaFulfillmentFee",
          sortable: 'custom',
          width:"140px",
        },
        {
          label: "佣金",
          value: "commission",
          sortable: 'custom'
        },
        {
          label: "1~90天仓储费",
          value: "inv0To90DaysFee",
          sortable: 'custom',
          width:"140px",
        },
        {
          label: "91-180天仓储费",
          value: "inv91To180DaysFee",
          sortable: 'custom',
          width:"140px",
        },
        {
          label: "181-270天仓储费",
          value: "inv181To270DaysFee",
          sortable: 'custom',
          width:"140px",
        },
        {
          label: "271-365天仓储费",
          value: "inv271To365DaysFee",
          sortable: 'custom',
          width:"140px",
        },
        {
          label: "365~天仓储费",
          value: "inv365PlusDaysFee",
          sortable: 'custom',
          width:"140px",
        }
      ],
      //表格列表操作按钮
      edits: [
        {
          name: "操作",
          icon: "el-icon-search",
          show: scope => {
            return true;
          },
          fn: (scope) => {
            //console.log(scope);
            let params ={
                siteId:this.outerParams.siteId,
                sellerId:this.outerParams.sellerId,
                sku:scope.row.sku
            };
            this.$refs.layout.$dialog({
              title: "成本详情",
              size: "large",
              component: () => import("./dialogs/DetailsDialog.vue"),
              params,
              // okBtnText: "确认",
              // cancelBtnText: "取消"
            });
          }
        }
      ],
      searchFields: [
        {
          label: "ASIN",
          name: "asin",
          labelWidth:'40px',
          placeholder: "请输入asin或sku"
        }
      ],
      //外部参数
      outerParams: {
        startTime: null,
        endTime: null,
        platformId: this.platformId,
        siteId: null,
        sellerId: null,
        cusCateId:null
      },


      slectIds: [] //选择的ID的数组
    };
  },

  created() {
    if (this.sellerId && this.siteId) {
      this.getCustomCategory();
      this.outerParams.siteId = this.siteId;
      this.outerParams.sellerId = this.sellerId;
    }
  },
  mounted() {},
  methods: {
    //添加费用
      AddCost(){
          if(!this.slectIds.length){
            this.$message({
              message:"请至少选择一项",
              type:'warning'
            });
            return
          };
         let params = this.outerParams;
            this.$refs.layout.$dialog({
              title: "添加费用",
              size: "small",
              component: () => import("./dialogs/AddCostDialog.vue"),
              params:{
                sellerId:this.outerParams.sellerId,
                siteId:this.outerParams.siteId,
                skus:this.slectIds
              },
              okBtnText: "确认",
              cancelBtnText: "取消"
            });
      },
    handleNodeClick(data) {
      // console.log(data);
      // this.cusCateId = data.cusCateId;
      this.$set(this.outerParams, "cusCateId", data.cusCateId);
      // this.getList();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.cusCateName.indexOf(value) !== -1;
    },
    getCustomCategory() {
      this.treeLoading = true;
      if (this.outerParams.cusCateId === 0) {
        // 如果本来就是全部，那么请求一下新的侧边栏
        this.getcustomCategoryList();
      } else {
        // 如果不是处于全部，既然请求侧边栏，也要请求右边的表格数据
        this.getcustomCategoryList();
        this.$set(this.outerParams, "cusCateId", null);
      }
       setTimeout(() => {
        this.treeLoading = false;
      }, 500);
    },
    getcustomCategoryList() {
      this.$api["CustomCategoryList_POP"]({
        sellerId: this.sellerId,
        siteId: this.siteId
      })
        .then(res => {
          let data = res.data;
          if (!data.length) {
            return;
          }
          let notInGroups = {
            createTime: "",
            cusCateId: null,
            cusCateId: -1,
            cusCateName: "未分类",
            haveChildren: 0,
            parentCusCateId: null
          };
          data.push(notInGroups);
          let newData = [
            {
              childList: data,
              createTime: "",
              cusCateId: null,
              cusCateName: "全部",
              haveChildren: 1,
              parentCusCateId: null
            }
          ];
          this.customCategoryData = newData;
        })
        .catch(err => {
          this.customCategoryData = [];
        });
    },
    //参数处理
    searchFunc(data) {
      let { time, ...info } = data;
      let [startTime, endTime] = time || [];
      return { startTime, endTime, ...info };
    }, //勾选改变
    selectChange(v) {
      //console.log(v);
      this.slectIds = [];
      v.forEach(i => {
        this.slectIds.push(
          i.sku
        );
        //console.log(this.slectIds);
      });
      //console.log(this.slectIds);
    },
    // 导出文件按钮
    downloadFile() {
      this.$api[""]({
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        ids: this.slectIds
      })
        .then(data => {})
        .catch(() => {});
    },
    //清空费用按钮
    delBtn() {
      if (this.slectIds.length === 0) {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
        return;
      }
      this.$api["productInfoClearCost"]({
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        skus: this.slectIds
      })
        .then(data => {
          if (data.code === 0) {
            this.$refs.layout.getList();
          }
        })
        .catch(() => {});
    }
  },

  computed: {
    afterDelGetList() {
      return this.$store.state.common.afterDelGetList;
    }
  },
  watch: {
    filterText(val) {
      this.$refs.treeCustomCategory.filter(val);
    },
    afterDelGetList() {
      this.$refs.layout.getList();
    },
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.getCustomCategory();
        this.outerParams.siteId = this.siteId;
        this.outerParams.sellerId = this.sellerId;
      }
    }
  }
};
</script>

<style lang='less' scoped>
.el-icon-box {
  display: flex;
  justify-content: flex-end;
  font-size: 16px !important;
}
.box {
  .box-left-menu {
	
    .el-icon-box {
      margin-top: 5px;
      margin-bottom: 5px;
      /deep/[class^="el-icon-"] {
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .leftTree{
	  max-height:720px;
	  overflow-y:auto; 
  }
  .box-body {
    .el-tabs {
      -webkit-box-shadow: 0 0 0 0;
      box-shadow: 0 0 0 0;
      /deep/.el-tabs__content {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
.inner-add-visible-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 270px;
      margin-right: 10px;
    }
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
  }
}
.inner-visible-dialog {
  .body-box {
    padding: 10px;
    border: 1px solid @borderColor;
  }
  /deep/.dialog-footer {
    display: flex;
    justify-content: space-around;
  }
}

.add-yt-dialog {
  .el-dialog__body {
    .el-select {
      width: 100%;
    }
    .is-disabled {
      width: 260px;
      margin-right: 10px;
    }
  }
}
.tree-dialog {
  .el-tree {
    // border:1px solid @borderColor;
    // padding: 5px;
    height: 300px;
    overflow-y: auto;
  }
}
.dialog-footer {
  text-align: center;
}
.esc_desc {
  padding: 0px 7px;
}
</style>

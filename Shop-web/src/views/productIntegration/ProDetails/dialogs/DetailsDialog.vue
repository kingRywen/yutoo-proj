<!--  -->
<template>
  <div>
    <div>
      <MainLayout style="padding-bottom: 50px;" :isShowPag="false" :showSearch="false" :edits="edits" :editBtns="editBtns" :outerParams="outerParams" :searchField="false" :columns="columns" :fixedPageFunc="fixedPageFunc" :searchFunc="searchFunc" @selectChange='selectChange' ref="detail" url="productInfoCostDetailList">
      </MainLayout>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props:['params'],
  data() {
    return {
      parentSkus: null,
      editBtns: [
        {
          name: "添加",
          fn: () => {
          
            this.$refs.detail.$dialog({
              title: "添加费用",
              size: "small",
              component: () => import("./AddCostDialog.vue"),
              params:{
                  sellerId:this.outerParams.sellerId,
                  siteId:this.outerParams.siteId,
                  slectsku:[this.params.sku],
              },
              appendToBody: true,
              okBtnText: "确认",
              cancelBtnText: "取消"
            });
          }
        },
        {
          name: "删除",
          fn: () => {
            this.delBtn();
          }
        }
      ],
      //columns表格
      columns: [
        {
          label: "时间",
          value: "createTime"
        },
        {
          // img: true,
          label: "成本",
          value: "cost"
        },
        {
          label: "佣金",
          value: "commission"
        },
        {
          label: "1~90天仓储费",
          value: "inv0To90DaysFee",
        },
        {
          label: "91-180天仓储费",
          value: "inv91To180DaysFee",

        },
        {
          label: "181-270天仓储费",
          value: "inv181To270DaysFee",
        },
        {
          label: "271-365天仓储费",
          value: "inv271To365DaysFee",
        },
        {
          label: "365~天仓储费",
          value: "inv365PlusDaysFee",
        }
      ],
      searchFields: [],
      //表格列表操作按钮
      edits: [
        {
          name: "编辑",
          icon: "el-icon-edit",
          show: scope => {
            return true;
          },
          fn: (scope) => {
           
            this.$refs.detail.$dialog({
              title: "编辑费用",
              size: "small",
              component: () => import("./AddCostDialog.vue"),
              params: {
                edit: true,
                sellerId:this.outerParams.sellerId,
                siteId:this.outerParams.siteId,
                financeCostId:scope.row.financeCostId,
              },
              appendToBody: true,
              okBtnText: "确认",
              cancelBtnText: "取消"
            });
          }
        },
        {
          name: "删除",
          icon: "el-icon-delete",
          show: scope => {
            return true;
          },
          fn: scope => {
            this.$api["productInfoRemoveCost"]({
              siteId: this.outerParams.siteId,
              sellerId: this.outerParams.sellerId,
              ids: [scope.row.financeCostId]
            })
              .then(data => {
                if (data.code === 0) {
                  // 删除时重新请求数据
                  this.$refs.detail.getList();
                  // 重新请求父组件的列表数据
                  this.$store.commit("common/afterDelGetList", new Date());
                }
              })
              .catch(() => {});
          }
        },
        {
          name: "复制",
          icon: "iconfuzhi el-icon-menu iconfont1",
          show: scope => {
            return true;
          },
          fn: scope => {
              //this.$message.success('复制成功');
  
              this.$refs.detail.$dialog({
                title: "添加费用",
                size: "small",
                component: () => import("./AddCostDialog.vue"),
                params:{
                  sellerId:this.outerParams.sellerId,
                  siteId:this.outerParams.siteId,
                  copyContent:scope.row,  //复制的内容
                  copy:true,
                  slectsku:[this.params.sku],
                },
                appendToBody: true,
                okBtnText: "确认",
                cancelBtnText: "取消"
              });
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
        newDate: null,
        ...this.params
      },
      slectIds: [] ,//选择的ID的数组
      selectfinanceCostIds:[],//勾选的financeCostId数据

     
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
		_close(){
			this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getLayoutList()
		},
    // 修正后端列表数据结构
    fixedPageFunc(data) {
      return { rows: data.data };
    },
    //参数处理
    searchFunc(data) {
      let { time, ...info } = data;
      let [startTime, endTime] = time || [];
      return { startTime, endTime, ...info };
    },
    selectChange(v) {
      //console.log(v);
      this.slectIds = [];
      this.selectfinanceCostIds = [];
      v.forEach(i => {
        this.slectIds.push(i.sku);
        this.selectfinanceCostIds.push(i.financeCostId);
      });
     // console.log(this.slectIds);
    },
    //删除按钮
    delBtn() {
      if (this.selectfinanceCostIds.length === 0) {
        this.$message({
          message: "请至少选择一项",
          type: "warning"
        });
        return;
      }
      this.$api["productInfoRemoveCost"]({
        siteId: this.outerParams.siteId,
        sellerId: this.outerParams.sellerId,
        ids: this.selectfinanceCostIds
      })
        .then(data => {
          if (data.code === 0) {
            // 删除时重新请求数据
            this.$refs.detail.getList();
            // 重新请求父组件的列表数据
            this.$store.commit("common/afterDelGetList", new Date());
          }
        })
        .catch(() => {});
    }
  },

  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>

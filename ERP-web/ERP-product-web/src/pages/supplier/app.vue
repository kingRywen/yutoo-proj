<template>
  <div id="components-layout-demo-top-side">
    <v-layout>
      <yt-header :index="1"></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout style="padding:24px 24px">
          <v-content>
            <!-- 主体内容开始 -->
            <div>
              <v-card>
                <v-form :model="ruleForm" ref="ruleForm">

                  <v-form-item>
                    <v-input v-model="ruleForm.sku" placeholder="请输入产品名称/SKU"></v-input>
                  </v-form-item>
                  <v-form-item>
                    <v-select v-model="ruleForm.nationId" style="width:200px" size="lg" :data="nationLists" clue="key" label="value"></v-select>
                  </v-form-item>
                  <v-form-item>
                    <el-date-picker style="width:100%;max-width:430px" type="daterange" size="small" start-placeholder="开始日期" end-placeholder="结束日期" v-model="ruleForm.time">
                    </el-date-picker>
                  </v-form-item>
                  <v-form-item>
                    <v-button type="primary">搜索</v-button>
                  </v-form-item>

                </v-form>

                <div class="hr"></div>
                <v-button @click="addNew" type="primary">新增产品</v-button>
                <v-button @click="batchSubmissionAudit" type="primary">批量提交审核</v-button>

                <v-data-table stripe ref="table" :data='lists' :tree-option='treeOption' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" class="margin-top-25" :current-data.sync='tableData'>
                  <template slot="th" slot-scope="props">
                    <div v-if="props.column.field=='imgMUrl'" class="text-center">
                      图片
                    </div>
                    <div v-else>
                      {{props.column.title}}
                    </div>
                  </template>
                  <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='imgMUrl'">
                      <el-tooltip placement="right" effect="light" :open-delay="300">
                        <div slot="content">
                          <img :src="props.item.imgMUrl && props.item.imgMUrl.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'" width="240">
                        </div>
                        <div class="divContent">
                          <img :src="props.item.imgMUrl || '/static/no-image.jpg'" :alt="props.column.title">
                        </div>
                      </el-tooltip>

                      <!-- <img :src="props.item.imgMUrl || '/static/no-image.jpg'" alt="" width="100" height="100" style="display:block"> -->
                    </div>
                    <div v-else-if="props.column.field=='status'">
                      <span v-if="props.content == 1">未提交审核</span>
                      <span v-if="props.content == 2">审核中</span>
                      <span v-if="props.content == 3">审核通过</span>
                      <span v-if="props.content == 4">审核不通过</span>
                    </div>
                    <div v-else-if="props.column.field=='edit'">
                      <v-button @click="editItem(props)" type="primary" v-if="props.item.status == 1 || props.item.status == 3 || props.item.status == 4">编辑</v-button>
                      <v-button @click="reviewItem(props)" type="primary" v-if="props.item.status == 1">提交审核</v-button>
                      <v-button @click="copyItem(props)" type="primary" v-if="props.item.status == 1 || props.item.status == 2 || props.item.status == 3 || props.item.status == 4">复制添加</v-button>
                      <v-button @click="delItem(props)" type="danger" v-if="props.item.status == 1 || props.item.status == 4">删除</v-button>
                    </div>
                    <div v-else>{{props.content}}</div>
                  </template>
                </v-data-table>
              </v-card>

            </div>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>

    <v-modal title="审核" :visible="customTextVisible" @ok="customTextOk" @cancel="customTextCancel" ok-text="确认" cancel-text="取消">
      <v-form style="width:100%">
        <v-form-item :label-col="{span:6}" :wrapper-col="{span:18}" label="审核结果" style="width:100%">
          <v-radio-group v-model="ruleFormReview.status" :data="[{value:2, text: '通过'},{value: 3, text: '不通过'}]">
          </v-radio-group>
        </v-form-item>
        <v-form-item :label-col="{span:6}" :wrapper-col="{span:18}" label="理由" style="width:100%">
          <v-input v-model="ruleFormReview.auditReasons" type="textarea"></v-input>
        </v-form-item>
      </v-form>

    </v-modal>
  </div>
</template>

<script>
import Vue from "vue";
import ytHeader from "components/layout/header.vue";
import ytCard from "components/base/ytCard.vue";
import { fetchData, handlerCode, showToast, showConfirm } from "common/common";
import apis from "apis";

export default {
  name: "WarehousingLogisticsManagement",
  components: {
    ytHeader,
    ytCard
  },
  data: function() {
    return {
      customTextVisible: false,
      reviewCur: null,
      ruleFormReview: {},
      mainMenu: [
        {
          icon: "desktop",
          name: "我的工作台",
          href: "/admin.html"
        },
        {
          icon: "appstore",
          name: "产品库中心",
          href: "/product.html#/product/productList.html"
        },
        {
          icon: "rocket",
          name: "仓储物流管理",
          href: "/WarehousingLogisticsManagement.html"
        },
        {
          icon: "shop",
          name: "销售管理"
        },
        {
          icon: "customer-service",
          name: "CRM客服管理"
        },
        {
          icon: "setting",
          name: "系统管理"
        },
        {
          icon: "pay-circle-o",
          name: "财务管理"
        },
        {
          icon: "area-chart",
          name: "报告中心"
        }
      ],
      cards: [],
      loading: true,
      ruleForm: {
        time: ""
      },
      nationLists: [
        { label: "Ebay", value: 0 },
        { label: "Wish", value: 1 },
        { label: "Amazon", value: 2 },
        { label: "Aliexpress", value: 3 }
      ],
      add: true,

      // 对话框
      visible: false,
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
      addForm: {},

      // 列表
      lists: data => {
        data.pageNumber = data.pageNo;
        delete data.pageNo;
        let reqData = Object.assign({}, data, this.params);
        delete reqData.sortColumns;

        let opts = Object.assign(
          {},
          { ...apis.PRODSRCSUPPLIER_LIST },
          { data: reqData }
        );

        return fetchData(opts).then(res => {
          let data = res.data;
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          };
        });
      },
      params: {
        sortOrder: "asc",
        status: null,
        keyword: null,
        startDate: null,
        endDate: null
      },
      treeOption: {
        isAsync: true
      },
      columns: [
        {
          title: "编号",
          field: "prodSrcSupplierId"
        },
        {
          title: "图片",
          field: "imgMUrl"
        },
        {
          title: "产品SKU",
          field: "productSku"
        },
        {
          title: "产品名称",
          field: "productNameCn"
        },
        {
          title: "类目",
          field: "categoryNameArry"
        },
        {
          title: "采购价格",
          field: "spurchasePrice"
        },
        {
          title: "添加时间",
          field: "createTime"
        },
        {
          title: "备注",
          field: "remarks"
        },
        {
          title: "审批状态",
          field: "status"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      tableData: [],
      options: [],
      searchData: "",
      items: [],
      pageNo: 1,
      pageSize: 10
    };
  },
  methods: {
    addNew() {
      location.href = "/supplier/add.html";
    },
    batchSubmissionAudit() {
      let vm = this;
      let data = this.$refs.table.getCheckedData();
      if (data.length == 0) {
        showToast("info", "请选择至少一条数据进行操作");
        return;
      }
      data = data.map(el => el.prodSrcSupplierId);
      showConfirm({
        title: "是否提交审核？",
        onOk() {
          fetchData({
            ...apis.PRODSRCSUPPLIER_UPDATESTATUS,
            data: {
              prodSrcSupplierId: data
            }
          }).then(res => {
            if (res.data.code === 0) {
              vm.$refs.table.refresh();
              showToast("success", "审核成功");
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    },
    editItem(props) {
      location.href =
        "/supplier/add.html" + "?id=" + props.item.prodSrcSupplierId;
    },
    delItem(props) {
      let vm = this;
      showConfirm({
        title: "是否删除",
        onOk() {
          fetchData({
            ...apis.PRODSRCSUPPLIER_REMOVE,
            data: {
              prodSrcSupplierId: [props.item.prodSrcSupplierId]
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", "删除成功");
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    },

    customTextOk() {
      let vm = this;
      let data = this.ruleFormReview;
      data.prodSupplierAuditId = this.reviewCur;
      fetchData({ ...apis.PRODSRCSUPPLIER_UPDATESTATUS, data }).then(res => {
        if (res.data.code === 0) {
          vm.$refs.table.refresh();
          showToast("success", res.data.msg);
        } else {
          showToast("error", res.data.msg);
        }
      });
      this.customTextVisible = false;
    },
    customTextCancel() {
      this.customTextVisible = false;
    },

    copyItem(props) {
      let vm = this;
      showConfirm({
        title: "是否复制添加？",
        onOk() {
          fetchData({
            ...apis.PRODSRCSUPPLIER_CLONE,
            data: {
              prodSrcSupplierId: props.item.prodSrcSupplierId
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", res.data.msg || "复制成功");
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    },
    reviewItem(props) {
      let vm = this;
      // this.customTextVisible = true;
      // this.reviewCur = props.item.prodSrcSupplierId;
      showConfirm({
        title: "是否提交审核？",
        onOk() {
          fetchData({
            ...apis.PRODSRCSUPPLIER_UPDATESTATUS,
            data: {
              prodSrcSupplierId: [props.item.prodSrcSupplierId]
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", res.data.msg || "提交审核成功");
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<template>
  <div id="components-layout-demo-top-side">
    <v-layout>
      <yt-header :data="mainMenu"></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout style="padding:24px 24px">
          <v-content>
            <!-- 主体内容开始 -->
            <div>
              <v-card>
                <v-form :model="ruleForm" ref="ruleForm">
                  <v-form-item label="国家">
                    <v-select v-model="ruleForm.nationId" style="width:200px" size="lg" :data="nationLists" clue="key" label="value"></v-select>
                  </v-form-item>
                  <v-form-item label="运输方式">
                    <v-input v-model="ruleForm.freightType" size="lg"></v-input>
                  </v-form-item>
                  <v-form-item>
                    <v-button type="primary">搜索</v-button>
                  </v-form-item>

                </v-form>

                <div class="hr"></div>
                <v-button @click="addNew" type="primary">添加</v-button>

                <v-data-table stripe ref="table" :data='lists' :tree-option='treeOption' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" class="margin-top-25" :current-data.sync='tableData'>
                  <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='freightTime'">{{props.content}}天</div>
                    <div v-else-if="props.column.field=='edit'">
                      <v-button @click="editItem(props)" type="primary">编辑</v-button>
                      <v-button @click="delItem(props)" type="danger">删除</v-button>
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
    <v-modal title="添加运输方式" :visible="visible" @ok="formSubmit" @cancel="visible = false">
      <!-- {{addForm}} -->
      <v-form :model="addForm" ref="addForm" direction="horizontal">
        <v-form-item label="国家" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-select v-model="addForm.nationId" size="lg" style="width:100%" :data="nationLists" clue="key" label="value"></v-select>
        </v-form-item>
        <v-form-item label="运输方式" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm.freightType" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="体积" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-row>
            <v-col span="6">
              <span>长*宽*高/</span>
            </v-col>
            <v-col span="18">
              <v-input v-model="addForm.productVolume" size="lg"></v-input>
            </v-col>
          </v-row>
        </v-form-item>
        <v-form-item label="费用" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm.tariff" size="lg">
            <span slot="after">kg</span>
          </v-input>

        </v-form-item>
        <v-form-item label="运输时间" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm.freightTime" size="lg">
            <span slot="after">天</span>
          </v-input>

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
  created() {
    fetchData({ ...apis.TRANSPORT_FIRST_NATION, data: {} }).then(res => {
      this.nationLists = res.data;
    });
  },
  data: function() {
    return {
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
      ruleForm: {},
      nationLists: [], // 国家列表
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
          { ...apis.TRANSPORT_FIRST_LIST },
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
        sortOrder: "asc"
      },
      treeOption: {
        isAsync: true,
        idKey: "productBaseStatusString",
        loadChildren: function(pramas) {
          return fetchData({ url: GET_PRODUCT_ALL_LIST, params }).then(res => {
            console.log(res);
            return res.data;
          });
        }
      },
      columns: [
        {
          title: "国家",
          field: "nation"
        },
        {
          title: "运输方式",
          field: "freightType"
        },
        {
          title: "体积",
          field: "productVolume"
        },
        {
          title: "费用",
          field: "tariff"
        },
        {
          title: "运输时间",
          field: "freightTime"
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
      this.addForm = {};
      this.visible = true;
      this.add = true;
    },

    // 弹窗提交
    formSubmit() {
      if (this.add) {
        this.addItemList();
      } else {
        this.editItemList();
      }
    },

    // 新增列表
    addItemList() {
      fetchData({
        ...apis.TRANSPORT_FIRST_SAVE,
        data: this.addForm
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", "新增成功");
          this.$refs.table.refresh();
          this.visible = false;
        }
      });
    },

    // 编辑列表
    editItemList() {
      fetchData({
        ...apis.TRANSPORT_FIRST_SAVE,
        data: this.addForm
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", "编辑成功");
          this.$refs.table.refresh();
          this.visible = false;
        }
      });
    },

    // 编辑列表项
    editItem(props) {
      this.visible = true;
      this.add = false;
      this.addForm = props.item;
    },

    // 删除列表项
    delItem(props) {
      showConfirm({
        title: "是否删除",
        onOk() {
          //删除接口
          // fetchData({...apis.})
        }
      });
    }
  }
};
</script>

<style lang="less">
#components-layout-demo-top-side {
  background: #ececec;
  .ant-card {
    margin-bottom: 20px;
  }
  .logo {
    width: 120px;
    height: 48px;
    background: #333;
    border-radius: 6px;
    margin: 16px 28px 16px 0;
    float: left;
  }
}
</style>
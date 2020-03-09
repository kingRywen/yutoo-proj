<template>
  <div id="components-layout-demo-top-side">
    <v-layout>
      <yt-header></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout style="padding:24px 24px">
          <v-content>
            <!-- 主体内容开始 -->
            <div>
              <v-card>
                <v-tabs active-tab-key="key1" @change="onChange" @tab-click="onTabClick">
                  <v-tab-pane tab-key="key1" tab="权限管理">
                    <v-button @click="addNew" type="primary" class="margin-bottom-20">添加</v-button>

                    <v-data-table :data='lists' :columns='columns' ref="table" :page-no="pageNo" :page-size="pageSize">
                      <template slot="td" slot-scope="props">
                        <div v-if="props.column.field=='activateFlag'" class="edit-box">
                          <v-icon v-if="!props.content" type="close" style="color:#ff464e"></v-icon>
                          <v-icon v-else type="check" style="color:#00a854"></v-icon>
                        </div>
                        <div v-else-if="props.column.field=='edit'" class="edit-box">
                          <v-button @click="editRole(props)">修改</v-button>
                          <v-button @click="delRole(props)">删除</v-button>
                        </div>
                        <span v-else v-html="props.content"></span>
                      </template>
                    </v-data-table>
                  </v-tab-pane>
                  <v-tab-pane tab-key="key2" tab="用户管理">
                    <v-button @click="addNew1" type="primary" class="margin-bottom-20">添加</v-button>

                    <v-data-table :data='lists1' :columns='columns1' ref="table1" :page-no="pageNo1" :page-size="pageSize1">
                      <template slot="td" slot-scope="props">
                        <div v-if="props.column.field=='activateFlag'" class="edit-box">
                          <v-icon v-if="!props.content" type="close" style="color:#ff464e"></v-icon>
                          <v-icon v-else type="check" style="color:#00a854"></v-icon>
                        </div>
                        <div v-else-if="props.column.field=='edit'" class="edit-box">
                          <v-button @click="editRole1(props)">修改角色</v-button>
                          <v-button @click="del(props)">删除</v-button>
                        </div>
                        <span v-else v-html="props.content"></span>
                      </template>
                    </v-data-table>
                  </v-tab-pane>
                </v-tabs>

                <!-- <div class="hr"></div> -->

              </v-card>

            </div>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>
    <v-modal title="添加角色" :visible="visible" @ok="formSubmit" @cancel="visible = false">
      <!-- {{addForm}} -->
      <v-form :model="addForm" ref="addForm" direction="horizontal">
        <v-form-item label="名字" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="[{required: true, message: '请输入名字'}]" required prop="name">
          <v-input v-model="addForm.name" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="权限" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="[{required: true, message: '请选择权限'}]" required prop="perms">
          <!-- <v-tree :data="treeData" checkable multiple @select="selectFn" @check="checkFn" children="childMenu" title="name"></v-tree> -->
          <el-tree v-if="refresh" :data="treeData" @check-change="handlerCheckChange" show-checkbox node-key="merchantMenuId" :props="props" ref="tree" :default-expanded-keys="expandedKeys" :default-checked-keys="checkedKeys">
          </el-tree>
        </v-form-item>
        <v-form-item label="角色描述" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm.remark" type="textarea" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="是否激活" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-switch v-model="addForm.activateFlag" :true-value="1" :false-value="0"></v-switch>
        </v-form-item>
      </v-form>
    </v-modal>
    <v-modal :title="add1 ? `新增用户角色`:`修改用户角色`" :visible="visible1" @ok="formSubmit1" @cancel="visible1 = false">
      <!-- {{addForm}} -->
      <v-form :model="addForm1" ref="addForm1" direction="horizontal" :rules="rules">
        <v-form-item label="用户名" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="[{required: true, message: '请输入用户名'}]" required prop="username">
          <v-input v-model="addForm1.username" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="密码" v-if="this.add1" :label-col="labelCol" :wrapper-col="wrapperCol" required prop="password">
          <v-input v-model="addForm1.password" size="lg" type="password"></v-input>
        </v-form-item>
        <v-form-item label="昵称" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="[{required: true, message: '请输入昵称'}]" required prop="nickName">
          <v-input v-model="addForm1.nickName" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="qq" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm1.qq" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="微信" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm1.wechat" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="email" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm1.email" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="手机" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm1.mobile" size="lg"></v-input>
        </v-form-item>
        <v-form-item label="角色" :label-col="labelCol" :wrapper-col="wrapperCol">
          <el-tree v-if="refresh" :data="treeData1" show-checkbox node-key="merchantRoleId" :props="props" ref="tree1" :default-expanded-keys="expandedKeys1" :default-checked-keys="checkedKeys1">
          </el-tree>
        </v-form-item>
        <v-form-item label="描述" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input v-model="addForm1.remark" type="textarea" size="lg"></v-input>
        </v-form-item>

        <v-form-item label="是否激活" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-switch v-model="addForm1.activateFlag" :true-value="1" :false-value="0"></v-switch>
          <!-- <v-input v-model="addForm1.remark" type="textarea" size="lg"></v-input> -->
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
import { Tree, Icon } from "element-ui";
import apis from "apis";

Vue.use(Tree);
Vue.use(Icon);

export default {
  name: "WarehousingLogisticsManagement",
  components: {
    ytHeader,
    ytCard
  },
  created() {
    this.getRoleTree();
    // fetchData({ ...apis.TRANSPORT_FIRST_NATION, data: {} }).then(res => {
    //   this.nationLists = res.data;
    // });

    // 获取权限树
    fetchData({ ...apis.MERCHANT_MENU_LIST_BY_MERCHANT, data: {} }).then(
      res => {
        this.treeData = res.data.rows;
      }
    );
  },
  data: function() {
    var valiEmail = (rule, value, callback) => {
      // if (value == null) {
      //   callback()
      // }
      var patt1 = new RegExp(
        /^[A-Za-z0-9\\u4e00-\\u9fa5]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$/
      );
      if (!patt1.test(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    var valiPass = (rule, value, callback) => {
      var patt1 = new RegExp(
        /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,30}/
      );
      if (!patt1.test(value)) {
        callback(
          new Error(
            "密码中必须包含字母、数字、特称字符，至少6个字符，最多30个字符。"
          )
        );
      } else {
        callback();
      }
    };
    return {
      refresh: true,
      props: {
        label: "name",
        children: "childMenu"
      },
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

      // valiEmail: [
      //   {
      //     // required: true,
      //     validator: valiEmail
      //   }
      // ],
      cards: [],
      expandedKeys: [],
      expandedKeys1: [],
      checkedKeys: [],
      checkedKeys1: [],

      loading: true,
      ruleForm: {},
      nationLists: [], // 国家列表
      add: true,
      add1: true,

      // 对话框
      visible: false,
      visible1: false,
      labelCol: {
        span: 4
      },
      params: {
        pageSize: 10,
        pageNumber: 1
      },
      wrapperCol: {
        span: 18
      },
      treeData: [],
      treeData1: [],
      addForm: {
        activateFlag: 1
      },
      addForm1: {
        activateFlag: 1
      },

      // 列表
      lists: data => {
        delete data.sortColumns;
        data.pageNumber = data.pageNo;
        delete data.pageNo;
        let opts = Object.assign({}, { ...apis.MERCHANT_ROLE_LIST }, { data });

        return fetchData(opts).then(res => {
          let data = res.data.rows;
          console.log(res.data.rows);
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          };
        });
      },
      lists1: data => {
        delete data.sortColumns;
        data.pageNumber = data.pageNo;
        delete data.pageNo;
        let opts = Object.assign({}, { ...apis.MERCHANT_USER_LIST }, { data });

        return fetchData(opts).then(res => {
          let data = res.data.rows;
          console.log(res.data.rows);
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          };
        });
      },

      rules: {
        password: [
          {
            required: true,
            message: "不能为空"
          },
          {
            validator: valiPass
          }
        ]
        // email: [
        //   {
        //     required: true,
        //     message: "不能为空"
        //   },
        //   {
        //     validator: valiEmail
        //   }
        // ]
      },
      columns: [
        {
          title: "角色名称",
          field: "name"
        },
        {
          title: "角色描述",
          field: "remark"
        },
        {
          title: "是否激活",
          field: "activateFlag"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      columns1: [
        {
          title: "商户名称",
          field: "merchantName"
        },
        {
          title: "昵称",
          field: "nickName"
        },
        {
          title: "用户名",
          field: "username"
        },
        {
          title: "是否激活",
          field: "activateFlag"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      options: [],
      searchData: "",
      items: [],
      pageNo: 1,
      pageSize: 10,
      pageNo1: 1,
      pageSize1: 10
    };
  },
  methods: {
    async getRoleTree(userId, edit) {
      let api = apis.MERCHANT_ROLE_LIST;
      let data = {
        pageSize: 1000,
        pageNumber: 1
      };
      if (userId) {
        data.userId = userId;
      }
      if (edit) {
        api = apis.MERCHANT_ROLE_LIST_BY_USER;
      }

      return fetchData({
        ...api,
        data
      }).then(res => {
        // handlerCode(res);
        if (res.data.code == 0) {
          let data;
          if (edit) {
            data = res.data.rows;
          } else {
            data = res.data.rows.rows;
          }
          this.treeData1 = data;
          return data;
        }
      });
    },
    editRole(props) {
      this.visible = true;
      this.add = false;
      fetchData({
        ...apis.MERCHANT_ROLE_INFO,
        data: {
          roleId: props.item.merchantRoleId
        }
      }).then(res => {
        this.addForm = res.data.rows;
        let selected = [];
        let expandedKeys = []; //expandedKeys
        function getKeys(arr, parent) {
          arr.forEach(el => {
            if (el.selected) {
              selected.push(el.merchantMenuId);
              if (!parent) {
                expandedKeys.push(el.merchantMenuId);
              } else {
                expandedKeys.push(parent.merchantMenuId);
              }
              if (el.childMenu && el.childMenu.length > 0) {
                getKeys(el.childMenu, el);
              }
            } else {
              if (el.childMenu && el.childMenu.length > 0) {
                getKeys(el.childMenu, el);
              } else {
                return;
              }
            }
          });
        }

        getKeys(res.data.rows.merchantMenuEntities);

        console.log(expandedKeys);

        this.refresh = false;

        this.$nextTick(() => {
          this.expandedKeys = expandedKeys;
          this.refresh = true;
          this.$nextTick(() => {
            selected.forEach(el => {
              this.$refs.tree.setChecked(el, true, false);
            });
          });
        });
      });
    },
    delRole(props) {
      let vm = this;
      showConfirm({
        title: "是否删除角色",
        onOk() {
          fetchData({
            ...apis.MERCHANT_ROLE_REMOVE,
            data: {
              id: [props.item.merchantRoleId].join("")
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh();
            });
          });
        }
      });
    },
    del(props) {
      let vm = this;
      showConfirm({
        title: "是否删除用户",
        onOk() {
          fetchData({
            ...apis.MERCHANT_USER_REMOVE,
            data: {
              id: [props.item.userId].join("")
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table1.refresh();
            });
          });
        }
      });
    },
    async editRole1(props) {
      let roles = await this.getRoleTree(props.item.userId, true);
      if (!roles) {
        return;
      }
      this.visible1 = true;
      this.add1 = false;
      this.addForm1 = props.item;
      this.treeData1 = roles;
      // this.addForm1.merchantUserId = props.item.merchantUserId
      let selected = [];
      function getKeys(arr) {
        arr.map(el => {
          if (el.selected) {
            selected.push(el.merchantRoleId);
          } else {
            if (el.childMenu && el.childMenu.length > 0) {
              getKeys(el.childMenu);
            } else {
              return;
            }
          }
        });
      }

      getKeys(roles);

      console.log(selected);

      this.refresh = false;
      this.$nextTick(() => {
        this.checkedKeys1 = selected;
        this.refresh = true;
      });
    },
    addNew() {
      this.addForm = {
        activateFlag: 1
      };
      this.checkedKeys = [];
      this.visible = true;
      this.add = true;
    },
    addNew1() {
      this.addForm1 = {
        activateFlag: 1
      };
      this.checkedKeys1 = [];
      this.getRoleTree();
      this.visible1 = true;
      this.add1 = true;
    },

    // 弹窗提交
    formSubmit() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if (this.add) {
            this.addItemList();
          } else {
            this.editItemList();
          }
        } else {
          // resolve(false);
        }
      });
    },

    // 弹窗提交
    formSubmit1() {
      this.$refs["addForm1"].validate(valid => {
        if (valid) {
          if (this.add1) {
            this.addItemList1();
          } else {
            this.editItemList1();
          }
        }
      });
    },

    // 新增列表
    async addItemList() {
      let menuIdList = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ].join(",");
      fetchData({
        ...apis.MERCHANT_ROLE_SAVE,
        data: { ...this.addForm, menuIdList }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", "新增成功");
          this.$refs.table.refresh();
          this.visible = false;
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    async formValid(name) {
      return new Promise(resolve => {
        this.$refs[name].validate(valid => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
    },

    // 新增列表
    addItemList1() {
      let menuIdList = [
        ...this.$refs.tree1.getCheckedKeys(),
        ...this.$refs.tree1.getHalfCheckedKeys()
      ].join(",");
      fetchData({
        ...apis.MERCHANT_USER_SAVE,
        data: { ...this.addForm1, type: 2, roleIdList: menuIdList }
      }).then(res => {
        handlerCode(res);
        if (res.data.code === 0) {
          // showToast("success", "新增成功");
          this.$refs.table1.refresh();
          this.visible1 = false;
        }
      });
    },

    // 用户编辑
    editItemList1() {
      let roleIdList = [
        ...this.$refs.tree1.getCheckedKeys(),
        ...this.$refs.tree1.getHalfCheckedKeys()
      ].join(",");
      const {
        userId,
        merchantId,
        username,
        nickName,
        qq,
        email,
        mobile,
        activateFlag
      } = this.addForm1;
      fetchData({
        ...apis.MERCHANT_USER_UPDATE,
        data: {
          merchantUserId: userId,
          merchantId,
          username,
          nickName,
          qq,
          email,
          activateFlag,
          mobile,
          roleIdList
        }
      }).then(res => {
        handlerCode(res);
        if (res.data.code === 0) {
          // showToast("success", "编辑成功");
          this.$refs.table1.refresh();
          this.visible1 = false;
        }
      });
    },

    // 角色编辑
    editItemList() {
      let menuIdList = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ].join(",");
      const {
        name,
        remark,
        sign,
        merchantId,
        merchantRoleId,
        activateFlag
      } = this.addForm;
      fetchData({
        ...apis.MERCHANT_ROLE_UPDATE,
        // data: { ...this.addForm, type: 2, roleIdList: menuIdList }
        data: {
          name,
          remark,
          sign,
          merchantId,
          menuIdList,
          activateFlag,
          merchantRoleId
        }
      }).then(res => {
        handlerCode(res);
        if (res.data.code === 0) {
          // showToast("success", res.data.msg);
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
    },
    onChange(tabKey) {
      console.log("tab changed : " + tabKey);
    },
    onTabClick(tabKey) {
      console.log("tab clicked : " + tabKey);
    },
    selectFn(data) {
      console.log(data);
    },
    checkFn(data) {
      console.log(data);
    },
    handlerCheckChange(val) {
      this.$set(this.addForm, "perms", val);
      this.formValid("addForm");
      // this.addForm.perms = val;
    }
  }
};
</script>
<style>
#components-layout-demo-top-side {
  background: #ececec
}
</style>

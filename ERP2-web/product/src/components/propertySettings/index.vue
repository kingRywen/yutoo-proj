<template>
  <div style="height:100%;" v-loading="globalLoading" element-loading-text="正在加载...">
    <el-dropdown @command="quoteField" v-if="childFlag">
      <el-button type="primary" plain size="mini">
        引用
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="0">完全引用</el-dropdown-item>
        <el-dropdown-item :command="1">引用部分扩展属性</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <layout>
      <!-- 添加删除 -->
      <template slot="handleBtn">
        <el-button type="primary" plain size="mini" @click="addField">添加自定义字段</el-button>
        <el-button
          type="primary"
          plain
          size="mini"
          @click="delField"
          :disabled="isOnClick('checkedAllList')"
        >删除</el-button>
      </template>
      <!-- 所有字段列表 -->
      <attribute-table
        slot="allFieldList"
        :data="allfiledList"
        :columns="allfiledColumns"
        @selection-change="handleSelectionAll"
        ref="allfiledList"
      />

      <!-- 控制变体属性字段按钮 -->
      <el-button
        slot="rightAttribute"
        @click="changePosition(1)"
        type="primary"
        :plain="isOnClick('checkedAllList',1)"
        :disabled="isOnClick('checkedAllList',1)"
      >
        到右边
        <i class="el-icon-arrow-right" />
      </el-button>
      <el-button
        slot="leftAttribute"
        type="primary"
        :plain="isOnClick('checkedAttributeList',2)"
        :disabled="isOnClick('checkedAttributeList',2)"
        icon="el-icon-arrow-left"
        @click="changePosition(2)"
      >到左边</el-button>

      <!-- 控制变体差异字段按钮 -->
      <el-button
        @click="changePosition(3)"
        slot="rightDiffAttribute"
        type="primary"
        :plain="isOnClick('checkedAllList')"
        :disabled="isOnClick('checkedAllList')"
      >
        到右边
        <i class="el-icon-arrow-right" />
      </el-button>
      <el-button
        @click="changePosition(4)"
        slot="leftDiffAttribute"
        type="primary"
        :plain="isOnClick('checkedDiffList')"
        :disabled="isOnClick('checkedDiffList')"
        icon="el-icon-arrow-left"
      >到左边</el-button>

      <!------------------------------ 变体属性字段 --------------------------------------->
      <attribute-table
        slot="attributeFieldList"
        :data="attributeList"
        :columns="attributeColumns"
        @selection-change="handleSelectionAttribute"
        ref="attributeList"
      />

      <!----------------------------------- 变体差异字段------------------------------------ -->
      <attribute-table
        slot="diffFieldList"
        :data="diffList"
        :columns="diffColumns"
        ref="diffList"
        @selection-change="handleSelectionDiff"
      />
    </layout>
    <!-- --------------------------------- -->
    <el-dialog title="添加词" :visible.sync="filed.visible" width="70%" append-to-body>
      <el-form :model="filedForm" :rules="filedRules" ref="filedForm">
        <el-form-item prop="filedText">
          <el-input type="textarea" v-model="filedForm.filedText" :rows="20" placeholder="多个换行输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm(true)">取 消</el-button>
        <el-button type="primary" :loading="filed.loading" @click="submitAddField">确 定</el-button>
      </span>
    </el-dialog>
    <!----------------------------------- -->
    <el-dialog :title="quote.title" :visible.sync="quote.visible" width="70%" append-to-body>
      <el-form :model="quote" :rules="quote.rules" ref="quoteForm">
        <el-form-item prop="citeSystemCategoryId">
          <el-cascader
            v-model="quote.citeSystemCategoryId"
            @change="changeFatherCategory"
            :options="quote.fatherCategory"
            :props="quote.props"
            change-on-select
            style="width:100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="propertyIdArray" v-if="quote.isPart">
          <el-table
            :data="quote.fatherCustomField"
            border
            style="width: 100%"
            @selection-change="selectFCustomField"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column prop="propertyName" label="名称" align="center"></el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="quote.visible=false">取 消</el-button>
        <el-button type="primary" :loading="quote.loading" @click="submiQuoteField">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Layout from "./layout";
import attributeTable from "./table";
export default {
  props: ["systemCategoryId", "childFlag"],
  components: { Layout, attributeTable },
  data() {
    return {
      allfiledList: [],
      allfiledColumns: [
        { label: "名称", prop: "propertyName" },
        { label: "添加类型", prop: "addType" },
        { label: "是否必填", prop: "mustFlag", type: "switch" }
      ],
      attributeList: [],
      attributeColumns: [
        { label: "名称", prop: "propertyName" },
        {
          label: "是否图片目录",
          prop: "imgFlag",
          type: "switch",
          width: "120px"
        },
        {
          label: "层级",
          prop: "imgFloor",
          type: "select"
        },
        {
          label: "是否用于标题/SKU规则",
          prop: "titleSkuFlag",
          type: "switch",
          width: "170px"
        }
      ],
      diffList: [],
      diffColumns: [{ label: "名称", prop: "propertyName" }],
      globalLoading: false,
      filed: {
        visible: false,
        loading: false
      },
      filedForm: {
        filedText: ""
      },
      filedRules: {
        filedText: [
          {
            required: true,
            message: "请输入字段名称",
            trigger: "blur"
          }
        ]
      },
      // 左边选中的字段列表
      checkedAllList: [],
      //选中的变体属性列表
      checkedAttributeList: [],
      //选中的变体差异列表
      checkedDiffList: [],
      quote: {
        title: "",
        loading: false,
        visible: false,
        isPart: 0,
        rules: {
          citeSystemCategoryId: [
            {
              required: true,
              message: "请选择父级类目",
              trigger: "change"
            }
          ],
          propertyIdArray: [
            {
              required: true,
              message: "请选择需要引用的字段",
              trigger: "change"
            }
          ]
        },
        fatherCategory: [], //当前父类目
        props: {
          label: "systemCategoryName",
          value: "systemCategoryId",
          children: "childArray"
        },
        citeSystemCategoryId: [],

        fatherCustomField: [], //父类目自定义字段,
        propertyIdArray: []
      }
    };
  },
  methods: {
    _submit() {
      //修改属性 => // 1扩展属性；2变体属性；3变体差异属性
      let all = [...this.allfiledList],
        attribute = [...this.attributeList],
        diff = [...this.diffList];
      all.forEach(i => {
        i.propertyType = 1;
      });
      attribute.forEach(i => {
        i.propertyType = 2;
      });
      diff.forEach(i => {
        i.propertyType = 3;
      });

      let arr = [...all, ...attribute, ...diff];
      arr.forEach(i => {
        for (let k in i) {
          if (k == "id") {
            delete i["id"];
          }
          if (k == "addType") {
            delete i["addType"];
          }
        }
      });
      return this.$api["product/storeAttributeListSave"](arr);
    },
    // 引用确定
    submiQuoteField() {
      this.$refs.quoteForm.validate(valid => {
        if (valid) {
          let path = "product/";
          let params = {
            systemCategoryId: this.systemCategoryId
          };
          if (this.quote.isPart) {
            //部分引用
            path += "quoteCategoryPart";
            params = {
              ...params,
              propertyIdArray: this.quote.propertyIdArray
            };
          } else {
            //全部引用
            path += "quoteCategoryAll";
            params = {
              ...params,
              citeSystemCategoryId: this.quote.citeSystemCategoryId[
                this.quote.citeSystemCategoryId.length - 1
              ]
            };
          }
          this.$api[path](params).then(res => {
            this.$message.success(res.msg);
            this.quote.visible = false;
          });
        } else {
          return false;
        }
      });
    },
    //选择的自定义字段
    selectFCustomField(v) {
      this.quote.propertyIdArray = v.map(i => {
        const {
          cateSystemPropertyId,
          cateSystemCategoryPropertyId,
          systemCategoryPropertyMId
        } = i;
        return (
          cateSystemPropertyId ||
          cateSystemCategoryPropertyId ||
          systemCategoryPropertyMId
        );
      });
    },
    //获取父类目自定义字段
    changeFatherCategory(v) {
      if (this.quote.isPart && v.length) {
        let systemCategoryId = v[v.length - 1];
        this.init(systemCategoryId, true);
      }
    },
    async quoteField(isPart) {
      (await !this.quote.fatherCategory.length) && this.getFatherCategory();
      this.quote.visible = true;
      this.$nextTick(() => {
        this.$refs.quoteForm.resetFields();
      });
      this.quote.isPart = isPart;
      this.quote.title = isPart ? "选择父级类目字段" : "选择父级类目";
    },
    //添加字段
    addField() {
      this.filed.visible = true;
      this.$nextTick(() => {
        this.resetForm();
      });
    },
    //删除
    delField() {
      this.$confirm("此操作将永久删除该字段, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api["product/removeCustomAttribute"]({
            idArray: this.checkedAllList.map(
              i =>
                i.cateSystemPropertyId ||
                i.cateSystemCategoryPropertyId ||
                i.systemCategoryPropertyMId
            )
          }).then(res => {
            this.$message.success(res.msg);
            this.clearSelection("allfiledList");
            this.init(this.systemCategoryId);
          });
        })
        .catch(() => {
          return false;
        });
    },
    //提交添加的字段
    submitAddField() {
      this.$refs.filedForm.validate(valid => {
        if (valid) {
          const propertyNameArray = this.filedForm.filedText
            .split(/[\s\n]/)
            .filter(i => i !== "");
          if (propertyNameArray.length > 50) {
            return this.$message.warning("扩展属性字段不可超过50个");
          }
          this.filed.loading = true;
          this.$api["product/addCustomAttribute"]({
            systemCategoryId: this.systemCategoryId,
            propertyNameArray
          }).then(res => {
            this.$message.success(res.msg);
            this.filed.visible = false;
            this.filed.loading = false;
            this.init(this.systemCategoryId);
          });
        } else {
          this.filed.loading = false;
          return false;
        }
      });
    },
    //重置添加的
    resetForm(isClone) {
      this.$refs.filedForm.resetFields();
      if (isClone) this.filed.visible = false;
    },
    returnEnumerate(type) {
      let add, checked, list;
      switch (type) {
        case 1:
          add = "attributeList";
          checked = "checkedAllList";
          list = "allfiledList";
          break;
        case 2:
          add = "allfiledList";
          checked = "checkedAttributeList";
          list = "attributeList";
          break;
        case 3:
          add = "diffList";
          checked = "checkedAllList";
          list = "allfiledList";
          break;
        case 4:
          add = "allfiledList";
          checked = "checkedDiffList";
          list = "diffList";
          break;
      }
      return {
        add,
        checked,
        list
      };
    },
    // 1.需要添加的
    // 2.已经选中的
    // 3.当前列表
    changePosition(type) {
      const { add, checked, list } = this.returnEnumerate(type);
      if (
        add == "attributeList" &&
        this[add].length + this[checked].length > 5
      ) {
        return this.$message.warning("变体属性字段最多只能添加5个");
      }
      if (
        add == "allfiledList" &&
        list == "attributeList" &&
        this[checked].length == this[list].length
      ) {
        return this.$message.warning("变体属性字段最少需要一个");
      }

      this[add].push(...this[checked]);
      const ids = this[checked].map(i => i.id);
      let resule = [];
      this[list].forEach(i => {
        if (ids.find(j => j == i.id)) {
          return;
        } else {
          resule.push(i);
        }
      });
      this[list] = resule;
      this.clearSelection(list);
    },
    handleSelectionAll(v) {
      this.checkedAllList = [...v];
    },
    handleSelectionAttribute(v) {
      this.checkedAttributeList = [...v];
    },
    handleSelectionDiff(v) {
      this.checkedDiffList = [...v];
    },
    //
    isOnClick(curChecked, type) {
      if (type == 1)
        return this[curChecked].length && this.attributeList.length < 5
          ? false
          : true;
      if (type == 2) {
        return this[curChecked].length && this.attributeList.length > 1
          ? false
          : true;
      }
      return this[curChecked].length ? false : true;
    },
    clearSelection(curTable) {
      this.$refs[curTable].clearSelection();
    },
    init(systemCategoryId, getCustom) {
      if (!getCustom) {
        this.globalLoading = true;
        this.allfiledList = [];
        this.attributeList = [];
        this.diffList = [];
      }
      this.$api["product/storeAttributeList"]({
        systemCategoryId
      }).then(res => {
        let str = "系統";
        res.rows.forEach((item, index) => {
          if (item.systemCategoryPropertyMId) {
            str = "自定义";
          }
          if (item.cateSystemPropertyId || item.cateSystemCategoryPropertyId) {
            str = "系統";
          }
          item["firstMustFlag"] = item.mustFlag;
          item["addType"] = str;
          item["id"] = index + 1;
          if (!getCustom) {
            switch (item.propertyType) {
              case 1:
                this.allfiledList.push(item);
                break;
              case 2:
                this.attributeList.push(item);
                break;
              case 3:
                this.diffList.push(item);
                break;
              default:
                break;
            }
          }
        });
        //处理当前类目父类目自定义字段
        if (getCustom) {
          this.quote.fatherCustomField = res.rows
            .filter(i => i.addType == "自定义")
            .map(i => {
              return {
                cateSystemPropertyId: i.cateSystemPropertyId,
                cateSystemCategoryPropertyId: i.cateSystemCategoryPropertyId,
                systemCategoryPropertyMId: i.systemCategoryPropertyMId,
                id: i.id,
                propertyName: i.propertyName
              };
            });
        } else {
          this.globalLoading = false;
        }
      });
    },
    // 获取当前类目的父类目
    getFatherCategory() {
      this.$api["product/currentFatherCategory"]({
        id: this.systemCategoryId
      }).then(res => {
        this.quote.fatherCategory = res.rows;
      });
    }
  },
  mounted() {
    this.init(this.systemCategoryId);
  }
};
</script>
<style lang="scss">
.customDialog .p20-scrollbar__view {
  height: 100%;
}
</style>
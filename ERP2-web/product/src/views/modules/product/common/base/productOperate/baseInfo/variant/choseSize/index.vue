<template>
  <div class="color">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="0">
      <ElFormItem>
        <ElRow>
          <ElCol :span="24">
            <div
              v-for="(item, index) in navList"
              :key="item.id"
              @click="handleNavClick(item, index)"
              class="nav-item mgr10"
              :class="{
                activeBg: navActiveList[index]
              }"
            >
              {{item.labelCn}}
              <span @click.stop="handleDelete(item, index)" v-if="item.removeFlag">
                <i class="el-icon-close"></i>
              </span>
            </div>
            <span @click.stop="tabFlag = !tabFlag" class="add-color">
              <i class="el-icon-plus"></i>add
            </span>
            <el-input
              v-if="tabFlag"
              placeholder="请输入内容"
              v-model="form.name"
              class="input-with-select"
            >
              <el-button slot="append" @click="handleTab(form.name)">确认</el-button>
            </el-input>
          </ElCol>
        </ElRow>
      </ElFormItem>
      <ElFormItem v-if="colorList.length">
        <el-checkbox-group style="display: inline-block" v-model="colorChose">
          <el-checkbox
            class="check-wrap"
            :label="item.labelCn"
            v-for="(item, index) in colorList"
            :key="item.id"
          >
            <span>{{item.labelCn}}</span>
            <span class="close" v-if="item.removeFlag">
              <div @click.stop="handleClose(item, index)">
                <i class="el-icon-error"></i>
              </div>
            </span>
          </el-checkbox>
        </el-checkbox-group>
        <span @click.stop="addFlag = !addFlag" class="add-color">
          <i class="el-icon-plus"></i>add
        </span>
        <div class="add-wrap" v-if="addFlag">
          <ElInput class="add-normal" v-model="addColorItem.labelCn" placeholder="请输入尺码"></ElInput>
          <ElInput class="add-normal" v-model="addColorItem.labelEn" placeholder="请输入缩写"></ElInput>
          <ElButton type class="add-sure" @click="addColorSure(addColorItem)">确认</ElButton>
        </div>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      addColorItem: {
        labelCn: "",
        labelEn: ""
      },
      navActiveList: [true, false],
      addFlag: false,
      tabFlag: false,
      colorChose: [],
      form: {},
      rules: {},
      colorList: [],
      addColorList: [
        {
          name: "白色",
          color: "white"
        }
      ],
      addColor: [],
      navList: [
        // {
        //   labelCn: "服装",
        //   value: 2
        // },
        // {
        //   labelCn: "手机",
        //   value: 3,
        //   removeFlag: 1
        // }
      ],
      currentTab: {}
    };
  },
  created() {
    let vm = this;
    this.getTab().then(item => {
      vm.currentTab = item;
      vm.getList(item);
    });
  },
  watch: {
    colorChose(val) {
      let arr = [];
      for (const item of val) {
        this.allColorList.forEach(i => {
          if (item == i.labelCn) {
            arr.push(i);
          }
        });
      }
      this.form.colorChose = arr;
    },
    "form.colorChose"(val) {
      console.log(val);
    }
  },
  computed: {
    allColorList: {
      get() {
        return this.colorList;
      }
    }
  },
  methods: {
    submit() {
      let vm = this;
      let data = vm.utils.clone(vm.form.colorChose);
      this.params.getColorForm(data);
    },
    handleTab(name) {
      let vm = this;
      vm.$api[`product/glEnumSave`]({
        enumName: "Repo-Size-Type",
        labelCn: name,
        labelEn: name
      }).then(() => {
        vm.getTab();
        vm.tabFlag = false;
      });
    },
    handleClose(item) {
      let vm = this;
      vm.$api[`product/glEnumRemove`]({
        enumName: item.enumName,
        value: item.value
      }).then(() => {
        vm.getList(vm.currentTab);
      });
    },
    handleDelete(item) {
      let vm = this;
      vm.$api[`product/glEnumRemove`]({
        enumName: item.enumName,
        value: item.value
      }).then(() => {
        vm.form.name = "";
        vm.getTab().then(() => {
          vm.getList(vm.currentTab);
        });
      });
    },
    handleNavClick(item, index) {
      let vm = this;
      vm.currentTab = item;
      vm.$set(vm, "navActiveList", vm.navActiveList.map(() => false));
      vm.$set(vm.navActiveList, index, true);
      vm.getTab().then(() => vm.getList(item));
    },
    getTab() {
      let vm = this;
      return vm.$api[`product/glEnumList`]({
        enumName: "Repo-Size-Type"
      }).then(({ rows }) => {
        vm.navList = rows;
        return Promise.resolve(rows[0] || {});
      });
    },
    getList(item) {
      let vm = this;
      vm.$api[`product/glEnumList`]({
        parentEnumName: item.enumName,
        parentValue: item.value
      }).then(({ rows }) => {
        vm.colorList = rows;
      });
    },
    addColorSure(item) {
      let vm = this;
      vm.addColorItem = {};
      if (!item.labelCn || !item.labelEn) {
        return;
      }
      vm.$api[`product/glEnumSave`]({
        parentEnumName: vm.currentTab.enumName,
        parentValue: vm.currentTab.value,
        ...item
      }).then(() => {
        vm.addFlag = false;
        vm.getList(vm.currentTab);
      });
    }
  }
};
</script>

<style lang='scss'>
.mgr10 {
  margin-right: 10px;
}
.color {
  .activeBg {
    background: rgb(134, 134, 134);
    color: white;
  }
  .input-with-select {
    width: 200px;
  }
  .nav-item {
    display: inline-block;
    width: 80px;
    border: 1px solid #e0e0e0;
    height: 30px;
    text-align: center;
    overflow: hidden;
    position: relative;
    & > span {
      display: inline-block;
      position: absolute;
      top: -8px;
      right: 0px;
      cursor: pointer;
    }
  }
  .normal-input {
    width: 300px;
  }
  .color-block {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: bottom;
    margin-right: 6px;
    border: 1px solid #e0e0e0;
  }
  .check-wrap {
    width: 300px;
    margin-right: 10px;
    overflow: hidden;
    .close {
      display: inline-block;
      margin-left: 10px;
    }
  }
  .add-color {
    display: inline-block;
    cursor: pointer;
    margin-right: 10px;
    width: 40px;
    color: #3ab6fe;
  }
  .add-wrap {
    display: inline-block;
    .add-normal {
      width: 100px;
      margin-right: 10px;
    }
    .add-sure {
      background: rgba(228, 228, 228, 1);
      border-color: rgba(204, 204, 204, 1);
    }
  }
}
</style>
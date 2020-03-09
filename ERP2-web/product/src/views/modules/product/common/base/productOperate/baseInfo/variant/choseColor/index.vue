<template>
  <div class="color">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="0">
      <ElFormItem>
        <el-checkbox-group style="display: inline-block" v-model="colorChose">
          <el-checkbox
            class="check-wrap"
            :label="item.labelCn"
            v-for="(item, index) in colorList"
            :key="item.id"
          >
            <span
              v-if="item.stringValue1"
              class="color-block"
              :style="{background: item.stringValue1}"
            ></span>
            <span>{{item.labelCn}}</span>
            <span class="close" v-if="item.removeFlag">
              <div @click.stop="handleClose(item, index)">
                <i class="el-icon-close"></i>
              </div>
            </span>
          </el-checkbox>
        </el-checkbox-group>
        <span @click.stop="addFlag = !addFlag" class="add-color">
          <i class="el-icon-plus"></i>add
        </span>
        <div class="add-wrap" v-if="addFlag">
          <ElInput class="add-normal" v-model="addColorItem.color" placeholder="请输入颜色"></ElInput>
          <ElInput class="add-normal" v-model="addColorItem.name" placeholder="请输入缩写"></ElInput>
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
        name: "",
        color: ""
      },
      addFlag: false,
      colorChose: [],
      form: { colorChose: [] },
      rules: {},
      colorList: [],
      addColorList: [],
      addColor: []
    };
  },
  created() {
    this.getList();
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
    handleClose(item) {
      let vm = this;
      vm.$api[`product/glEnumRemove`]({
        enumName: item.enumName,
        value: item.value
      }).then(() => {
        vm.addColorItem = {};
        vm.getList();
      });
    },
    getList() {
      let vm = this;
      this.$api[`product/glEnumList`]({
        enumName: "Repo-Color"
      }).then(({ rows }) => {
        vm.colorList = rows;
      });
    },

    addColorSure(item) {
      let vm = this;

      if (!item.name || !item.color) {
        return;
      }
      vm.$api[`product/glEnumSave`]({
        enumName: "Repo-Color",
        labelCn: item.color,
        labelEn: item.name
      }).then(() => {
        vm.addColorItem = {};
        vm.addFlag = false;
        vm.getList();
      });
    }
  }
};
</script>

<style lang='scss'>
.color {
  background: #fff;
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
    position: relative;
    width: 100px;
    margin-right: 10px;
    .close {
      position: absolute;
      right: 0px;
      top: 0px;
      z-index: 999999;
    }
  }
  .add-color {
    display: inline-block;
    cursor: pointer;
    margin-right: 10px;
    width: 40px;
    color: $btnColor;
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
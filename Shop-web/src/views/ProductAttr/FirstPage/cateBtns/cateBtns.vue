<!--  -->
<template>
  <div>
    <template v-for="(item, index) in cateBtns">
      <template v-if="item.show == null ? true : typeof item.show === 'boolean' ? item.show : item.show()">
        <template v-if="!item.childs">
          <el-button v-if="!item.icon" class="right-btns" type="text" :key="index" @click.stop="item.fn( item)" :icon="item.icon">item.name</el-button>
          <el-tooltip effect="light" v-else :content="item.name" placement="top" :open-delay="300">
            <el-button :style="!type ? {padding: 0} : null" :class="{'right-btns': !type}" type="text" :key="index" @click.stop="item.fn(item)" :icon="item.icon"></el-button>
          </el-tooltip>
        </template>

        <el-button type="text" v-else-if="(item.childs()).length === 1" :key="index" @click.stop="item.fn(item, (item.childs())[0].name,(item.childs())[0].value)">{{(item.childs())[0].name}}</el-button>

        <el-dropdown v-else-if="(item.childs()).length !== 0" split-button type="text" @click.stop="item.fn(item,item.name)" @command="c => item.fn(item,c)">
          {{(item.childs())[0].name}}
          <el-dropdown-menu slot="dropdown">
            <template v-for="(i, subIndex) in (item.childs())">
              <el-dropdown-item v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </template>
    <Dialog :options="innerDialogOpts" :events="events" @close="innerDialogOpts.visible = false">
      <transition-type name="fadeIn-fadeOut">
        <component v-if="innerDialogOpts.visible" :is="dialogComponent.component" :params="dialogComponent.params" ref="component"></component>
      </transition-type>
    </Dialog>
  </div>
</template>

<script>
import Dialog from "@/components/MainLayout/src/dialog.vue";
export default {
  components: { Dialog },
  props: {
    type: {
      default: null
    },
    cateBtns: {
      required: true,
      default: () => []
    },
    // 外部传入弹窗的事件
    outerEvents: {
      default: () => ({})
    }
  },
  data() {
    let vm = this;
    return {
      dialogComponent: {},
      innerDialogOpts: {
        visible: false,
        size: null,
        width: null,
        closeOnClickModal: false,
        title: null,
        okBtnText: "",
        cancelBtnText: ""
      },
      innerEvents: {
        open() {
          setTimeout(() => {
            vm.$nextTick(() => {
              // 弹窗里的组件
              let component = vm.$refs.component;
              if (!component) {
                return;
              }
              // 调用组件初始化函数
              component && component._initData && component._initData();
            });
          });
        },
        close() {
          // 弹窗里的组件
          let component = vm.$refs.component;
          // 调用组件关闭函数
          component && component._close && component._close();
        },
        handleOkClick() {
          let component = vm.$refs.component;
          // if (!component) {
          //   return
          // }
          if (!component._submit) {
            throw new Error("确保弹窗组件内定义了_submit方法");
          }
          return (
            component &&
            component._submit &&
            component._submit().then(res => {
              if (res) {
                vm.innerDialogOpts.visible = false;
                // vm.getList(undefined, res === "reset");
              }
            })
          );
        }
      }
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 弹窗
    $dialog({
      title,
      width,
      size,
      component,
      okBtnText,
      cancelBtnText,
      params,
      appendToBody = false
    }) {
      component().then(com => {
        
        com.default.inheritAttrs = false;
        this.dialogComponent.component = com.default;
        this.dialogComponent.params = params;
        this.innerDialogOpts.title = title;
        this.innerDialogOpts.visible = true;
        this.innerDialogOpts.width = width;
        this.innerDialogOpts.appendToBody = appendToBody;
        this.innerDialogOpts.size = size;
        this.innerDialogOpts.okBtnText = okBtnText;
        this.innerDialogOpts.cancelBtnText = cancelBtnText;
      });
    }
  },
  computed: {
    events() {
      return this.innerEvents;
    }
  },
  watch: {}
};
</script>

<style lang='less' scoped>
.el-button {
  font-size: 15px !important;
}
.right-btns.el-button + .right-btns.el-button {
  margin-left: 4px;
}
.tree-wrapper-w {
  width: 100%;
  display: flex;
  // justify-content: flex-end;
}
</style>

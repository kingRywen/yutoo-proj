<template>
  <div style="height:100%">

    <!-- 平台信息，图片 -->
    <vue-tabs ref="tab" style="height:100%" @tab-change="onTabClick">
      <v-tab v-for="item in tabs" :key="item.title" :title="item.title">
        <keep-alive>
          <component ref="com" :is="name" v-if="name === item.component"></component>
        </keep-alive>
      </v-tab>
    </vue-tabs>
    <!-- 平台信息，图片 -->

    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="name === 'PlatformInformation'" @click.prevent="translate">翻译</v-button>
        <v-button type="primary" @click.prevent="save">保存</v-button>
        <v-button type="primary" @click.prevent="submit">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
// 异步组件
const PlatformInformation = () =>
  import("../components/PlatformInformation.vue").then(m => m.default);
const Picture = () => import("../components/picture.vue").then(m => m.default);
import bus from "common/bus";

export default {
  components: {
    PlatformInformation,
    Picture
  },

  data() {
    return {
      name: "PlatformInformation",
      tabs: [
        {
          title: "平台信息",
          component: "PlatformInformation",
          dataName: "f"
        },
        {
          title: "图片",
          component: "Picture",
          dataName: "w"
        }
      ]
    };
  },
  methods: {
    onTabClick(tabIndex, newTab, oldTab) {
      this.name = this.tabs[tabIndex].component;
    },
    translate() {},
    save() {
      bus.$emit("save");
    },
    submit() {
      bus.$emit("submit");
    }
  }
};
</script>

<style lang="less">
.saveBtn {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 0;
  left: 0;
  background: #f7f7f7;
  z-index: 222;
  padding: 20px;
  box-sizing: border-box;
  button {
    width: 160px;
  }
}
</style>

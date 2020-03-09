<template>

    <!-- <el-tabs v-model="index" type="card" closable @tab-remove="removeTab" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item) in tabs"
        :key="item.name"
        :label="item.name"
        :name="item.route"
      >
      </el-tab-pane>
    </el-tabs> -->
    <div style="height:100%">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件 -->
        </router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>

</template>
<script>
/* eslint-disable */
import { mapState } from "vuex";
export default {
  name: "Keyword"
};
</script>

<template>
  <div>
    <div v-if="success">
      <ul class="list">
        {{selected}}
        <v-checkbox-group @change="checkGroup">
          <v-checkbox v-for="i in items" :true-value="i" :key="i.globalColorId" style="margin-right:20px">
            <span v-if="$attrs.color" class="text" :style="{background: i.code, width: '16px', height: '16px', display:'inline-block', verticalAlign: 'middle'}"></span> {{i.nameCn}} {{i.nameEn}}</v-checkbox>
        </v-checkbox-group>
      </ul>
    </div>
    <div v-else>加载中</div>
  </div>

</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";
export default {
  inheritAttrs: false,
  created() {
    fetchData(apis.GLOBALCOLOR_LISTCOLOR).then(res => {
      if (res.data.code === 0) {
        this.success = true;
        this.items = res.data.list.colors;
      }
    });
  },
  data() {
    return {
      success: false,
      colorVal: "",
      selected: [],
      items: []
    };
  },
  methods: {
    change() {
      console.log("change");
    },
    checkGroup(values) {
      console.log(values, this.$attrs.index, this.selected);
      this.selected = values;
    },
    ok() {
      console.log("ok");
      this.$root.$children[0].asyncModalVisible = false;
      this.$listeners.set(this.selected);
    }
  }
};
</script>

<style lang="less">
.list {
  overflow: hidden;
  .ant-checkbox-wrapper {
    line-height: 3;
  }
}
</style>

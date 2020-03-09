<template>
  <div>
    <div v-if="btns.length >0">
      <v-button v-for="btn in btns" @click="handleBtn(btn.languageId)" :index="btn.languageId">{{btn.languageName}}</v-button>
    </div>
    <div v-else>注意：产品状态不支持导出</div>
    <v-modal title="导出" :width='1000' :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <BatchCustomExport :type='2' :productPlatformId="$attrs.data.productPlatformId" :languageId="curId"></BatchCustomExport>
      <div slot="footer">
      </div>
    </v-modal>
  </div>

</template>

<script>
import { fetchData, showToast } from "common/common";
import apis from "apis";
import BatchCustomExport from "./batchCustomExport";

export default {
  inheritAttrs: false,
  components: {
    BatchCustomExport
  },
  data() {
    return {
      btns: [],
      visible: false,
      curId: null
    };
  },
  created() {
    console.log(this.$attrs);
    const { productPlatformId } = this.$attrs.data;
    fetchData({
      ...apis.PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_LANGUAGEID_LIST,
      data: { productPlatformId }
    }).then(res => {
      if (res.data.code !== 0) {
        showToast("error", res.data.msg);
      }
      this.btns = res.data.rows;
    });
  },
  methods: {
    handleOk() {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
    handleBtn(id) {
      this.curId = id;
      this.visible = true;
    }
  }
};
</script>

<style>
</style>

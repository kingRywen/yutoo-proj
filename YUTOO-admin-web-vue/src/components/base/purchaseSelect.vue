<template>
  <v-select size="lg" :disabled="disabled" v-if="$attrs.type == null" :value="value" @focus="$emit('focus')" @change="$emit('input', $event)" @input="$emit('input', $event)" style="width:100%" :data="selectOptions" clue="salePfPropItemId" label="itemValue"></v-select>
  <v-checkbox-group :disabled="disabled" @focus="$emit('focus')" v-else-if="$attrs.type == 1" :data="selectOptions" :value="value" @change="$emit('input', $event)" @input="$emit('input', $event)"></v-checkbox-group>
  <v-radio-group :disabled="disabled" @focus="$emit('focus')" v-else-if="$attrs.type == 2" :data="selectOptions" :value="value" @change="$emit('input', $event)" @input="$emit('input', $event)"></v-radio-group>
</template>

<script>
import { fetchData, showToast } from "common/common";
import apis from "apis";
export default {
  props: ["value", "cateId", "list", "disabled", "plat"],
  data() {
    return {
      selectOptions: []
    };
  },
  created() {
    // debugger
    if (this.list && !this.plat) {
      this.selectOptions = this.list;
      return;
    }
    fetchData({
      ...apis.SALEPFPROPITEM_GETPROPITEM,
      data: {
        propertyId: this.cateId
      }
    }).then(res => {
      console.log(res);
      if (res.data.code !== 0) {
        showToast("error", res.data.msg);
      }
      this.selectOptions = res.data.list;
      if (this.selectOptions.find(el => el.salePfPropItemId == this.value)) {
        this.$emit("input", this.value);
      } else {
        this.$emit("input", null);
      }
    });
  }
};
</script>

<style>
</style>

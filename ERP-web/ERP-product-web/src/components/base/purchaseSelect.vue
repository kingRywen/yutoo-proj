<template>
    <v-select
        size="lg"
        :allowClear="true"
        @clearVal="$emit('clearVal')"
        :disabled="disabled"
        v-if="$attrs.type == null"
        :value="value"
        @focus="$emit('focus')"
        @input="handleChange"
        style="width:100%"
        :data="selectOptions"
        @change="handleChange"
        clue="salePfPropItemId"
        label="itemValue"
    ></v-select>
    <v-select size="lg" :disabled="disabled" v-else-if="$attrs.type == 4" :value="value" @focus="$emit('focus')" @change="handleChange" @input="handleChange" style="width:100%" :data="selectOptions1" :allowClear="true" @clearVal="$emit('clearVal')"></v-select>
    <v-checkbox-group :disabled="disabled" @focus="$emit('focus')" v-else-if="$attrs.type == 1" :data="selectOptions" :value="value" @change="handleChange"></v-checkbox-group>
    <v-radio-group :disabled="disabled" @focus="$emit('focus')" v-else-if="$attrs.type == 2" :data="selectOptions" :value="value" @change="handleChange"></v-radio-group>
</template>

<script>
import { fetchData, showToast } from 'common/common';
import apis from 'apis';
export default {
    props: ['value', 'cateId', 'list', 'disabled', 'plat'],
    data() {
        return {
            selectOptions: [],
            selectOptions1: [
                { label: 'TRUE', value: 'TRUE' },
                { label: 'FALSE', value: 'FALSE' }
            ]
        };
    },
    created() {
        // debugger
        // if (this.list && this.$attrs.type !== 4) {
        //   this.selectOptions = this.list
        //   return
        // }
        if (!this.plat) {
            return;
        }
        // fetchData({
        //   ...apis.SALEPFPROPITEM_GETPROPITEM,
        //   data: {
        //     propertyId: this.cateId
        //   }
        // }).then(res => {
        //   console.log(res)
        //   if (res.data.code !== 0) {
        //     showToast('error', res.data.msg)
        //   }
        //   this.selectOptions = res.data.list
        //   if (this.selectOptions.find(el => el.salePfPropItemId == this.value)) {
        //     this.$emit('input', this.value)
        //   } else {
        //     this.$emit('input', null)
        //   }
        // })
    },
    watch: {
        list: {
            immediate: true,
            handler(val) {
                let vm = this,
                    value;
                if (!val || !val.length) {
                    return;
                }
                if (this.$attrs.type !== 4) {
                    this.selectOptions = val;
                    // 把默认值填入
                    // 如果找不到对应id，则查找字符值
                    if (
                        vm.value != null &&
                        vm.value != '' &&
                        !val.find(el => el.salePfPropItemId === vm.value)
                    ) {
                        value = val.find(el => el.itemValue === vm.value);
                        if (value != null) {
                            this.$emit('change', value.salePfPropItemId);
                            // vm.value = value.salePfPropItemId
                        }
                    }
                }
            }
        }
    },
    methods: {
        handleChange($event) {
            if (this.$attrs.type == null || this.$attrs.type == 4) {
                if ($event == null) {
                    this.$emit('input', null);
                    this.$emit('change', null);
                    return;
                }
            }
            this.$emit('input', $event);
            this.$emit('change', $event);
        }
    }
};
</script>

<style>
</style>

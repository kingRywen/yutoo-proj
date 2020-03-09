<template>
    <!-- 单个审核 -->
    <div style="height:540px;overflow-y: auto;">
        <base-info ref="baseInfo" @change="change"/>
        <batch-toExamine labelWidth="60px" ref="batchToExamine" :disabled="disabled" :params="params"/>
    </div>
</template>
<script>
import baseInfo from './baseInfo';
import batchToExamine from './batchToExamine';
export default {
    components: {
        baseInfo,
        batchToExamine
    },
    data() {
        return {
            disabled: false,
            params: {}
        };
    },
    methods: {
        getInfo(val) {
            if (val.disabled !== undefined) {
                this.disabled = val.disabled;
            }
            this.$refs.baseInfo.getInfo(val);
        },
        change(val) {
            console.log(val);
            this.params = { ...val };
        },
        submitForm(cb) {
            this.$refs.batchToExamine.submitForm(val => {
                cb && cb(val);
            });
        }
    }
};
</script>